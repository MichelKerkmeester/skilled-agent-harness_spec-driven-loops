# Plugin Audit Review - mk-spec-memory

> **Iteration 2 cross-check (Opus 4.8):** 13 iteration-1 findings adjudicated (10 confirmed, 1 refuted, 2 adjusted); 7 new findings. Full detail in [`iteration-002-opus-4.8.md`](./iteration-002-opus-4.8.md).

> **Source:** GPT-5.6-Sol-Fast (`openai/gpt-5.6-sol-fast --variant high`) read-only audit via cli-opencode, 2026-07-10. Findings are hypotheses with file:line evidence, pending remediation-time confirmation.

## Summary

No P0 default-export failure was found; mk-spec-memory correctly exposes only a default plugin factory. The audit found several P1 lifecycle, timeout, persistence, and parity defects plus smaller cache, configuration, and schema-hardening issues.

| Field | Value |
|-------|-------|
| Plugin | `.opencode/plugins/mk-spec-memory.js` (Spec Kit Memory continuity plugin) |
| Claude hook counterpart | .claude/settings.json, .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts, .opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts, .opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts, .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts, .opencode/skills/system-spec-kit/mcp_server/hooks/claude/shared.ts |
| Verdict | REFINE |
| Findings | 0 P0 / 10 P1 / 3 P2 / 0 refinement (13 total) |

**Parity assessment:** Parity is partial. Both surfaces ultimately consume warm Spec Memory recovery, but OpenCode uses per-system-transform daemon briefs with short caching while Claude uses SessionStart, transcript-derived PreCompact caching, and Stop autosave; the missing reciprocal lifecycle counterparts and currently stale Claude dist make their freshness and failure behavior materially different.

## Finding Registry

| ID | Sev | Category | Location | Title | Conf |
|----|-----|----------|----------|-------|------|
| F1 | P1 | bug | `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:289-354` | A placeholder Session Continuity section suppresses real warm recovery | high |
| F2 | P1 | error | `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:104-127` | The autosave fallback reports deferred without performing or queuing a save | high |
| F3 | P1 | bug | `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:471-483` | Optional citation telemetry can abort all Stop-hook persistence | high |
| F4 | P1 | bug | `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:41-48` | PreCompact tailing reads the entire transcript synchronously | high |
| F5 | P1 | bug | `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:383-445` | The PreCompact workload is not bounded by HOOK_TIMEOUT_MS | high |
| F6 | P1 | bug | `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:304-331` | The cached payload contract does not describe the payload being cached | high |
| F7 | P1 | bug | `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:375-406` | Producer metadata can identify an older transcript generation than the parsed bytes | high |
| F8 | P1 | error | `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13-18` | UserPromptSubmit launches its child without timeout or output bounds | high |
| F9 | P1 | parity | `.opencode/plugins/mk-spec-memory.js:404-436` | OpenCode and Claude inject continuity at materially different lifecycle points | high |
| F10 | P1 | error | `.claude/settings.json:32` | Claude executes generated dist hooks without enforcing source freshness | high |
| F11 | P2 | bug | `.opencode/plugins/mk-spec-memory.js:350-369` | Session invalidation does not invalidate an in-flight continuity lookup | high |
| F12 | P2 | error | `.opencode/plugins/mk-spec-memory.js:42-49` | Configuration parse and read failures are completely silent | high |
| F13 | P2 | bug | `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs:114-121` | Marker deduplication rejects otherwise valid text parts with extra fields | med |

## Finding Detail

### F1 - A placeholder Session Continuity section suppresses real warm recovery
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:289-354`
- **Evidence:** When lastSpecFolder exists, handleResume creates a section titled "Session Continuity" whose content only instructs the model to call memory_context. maybeAppendCliWarmFallback then returns immediately whenever any section has that title, so it never attempts buildWarmSessionResumeSection for this common resume case.
- **Impact:** A session with a known packet receives less recovered context than a session without one, even when the warm daemon could provide continuity.
- **Proposed fix:** Distinguish actual recovered continuity from instructional placeholders, or suppress the CLI fallback only when a section contains accepted continuity payload data.

### F2 - The autosave fallback reports deferred without performing or queuing a save
- **Severity / Category / Confidence:** P1 / error / high
- **Location:** `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:104-127`
- **Evidence:** runContextAutosaveCliFallback invokes the read-only session_resume tool and returns "deferred" when that read succeeds. No canonical document write, memory_save call, queue operation, or retry record is created.
- **Impact:** When generate-context.js is missing or fails, callers can believe continuity was deferred safely even though the latest session summary was not persisted anywhere beyond hook state.
- **Proposed fix:** Use a write-capable, auditable fallback or durable retry queue; otherwise return failed/skipped and state explicitly that no autosave occurred.

### F3 - Optional citation telemetry can abort all Stop-hook persistence
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:471-483`
- **Evidence:** runTrueCitationEmit is awaited without a local try/catch despite the surrounding comment calling it shadow-only and fail-safe. State persistence and autosave occur later at lines 551-572.
- **Impact:** Any filesystem, parsing, or database exception from optional telemetry prevents the state update and context autosave for that Stop event.
- **Proposed fix:** Catch failures around runTrueCitationEmit, log them, retain the skipped outcome, and continue to the state-write and autosave phases.

### F4 - PreCompact tailing reads the entire transcript synchronously
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:41-48`
- **Evidence:** tailFile calls readFileSync(filePath, 'utf-8') before selecting the last N lines. Transcript size is therefore unbounded even though only 50 lines are used.
- **Impact:** Long sessions can block the event loop, allocate memory proportional to the complete transcript, exceed the three-second Claude hook timeout, and lose the compact recovery cache.
- **Proposed fix:** Read a bounded tail using open/fstat/read with a byte cap, expanding backward only if necessary to obtain the requested line count.

### F5 - The PreCompact workload is not bounded by HOOK_TIMEOUT_MS
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:383-445`
- **Evidence:** withTimeout is applied only to parseHookStdin. Snapshot refresh, transcript processing, autoSurfaceAtCompaction, CLI fallback, merging, and state persistence execute without a shared deadline, while .claude/settings.json:45 gives the process only three seconds.
- **Impact:** A slow database, transcript, or fallback operation can cause Claude to kill the hook before pendingCompactPrime is persisted, silently defeating post-compaction recovery.
- **Proposed fix:** Apply one end-to-end deadline with cancellation or staged remaining-budget checks, and persist a bounded legacy fallback before the external hook deadline expires.

### F6 - The cached payload contract does not describe the payload being cached
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:304-331`
- **Evidence:** buildMergedContext prepends auto-surfaced constitutional and triggered memories to merged.text. main then calls buildMergedPayloadContract separately at lines 422-439; that function rebuilds a transcript-only merge and never includes those surfaced sections.
- **Impact:** The text and its structured provenance/section envelope diverge, so downstream trust, diagnostics, and semantic validation cannot accurately identify all content injected after compaction.
- **Proposed fix:** Return text and payloadContract from one merge operation and add every auto-surfaced section to that same envelope before truncation and persistence.

### F7 - Producer metadata can identify an older transcript generation than the parsed bytes
- **Severity / Category / Confidence:** P1 / bug / high
- **Location:** `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:375-406`
- **Evidence:** The transcript is statted before parseTranscript, but parseTranscript receives only the path and offset and can read bytes appended after that stat. buildProducerMetadata then fingerprints the earlier size and mtime while metrics/newOffset may describe later content.
- **Impact:** Cached-summary fidelity checks can accept or reject continuity using metadata that does not correspond to the transcript generation actually parsed.
- **Proposed fix:** Open and stat one descriptor, parse no farther than the captured size, and build metadata from that descriptor; alternatively re-stat afterward and discard/retry if identity, size, or mtime changed.

### F8 - UserPromptSubmit launches its child without timeout or output bounds
- **Severity / Category / Confidence:** P1 / error / high
- **Location:** `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13-18`
- **Evidence:** spawnSync is called without timeout, maxBuffer, or a bounded stdin read. The outer Claude configuration has a three-second timeout, but the shim itself cannot terminate or classify a hung child cleanly.
- **Impact:** A stuck advisor process or excessive output can block the hook until externally killed, potentially leaving a child behind and silently dropping all prompt guidance to the fallback {}.
- **Proposed fix:** Set a timeout below the outer hook deadline, cap maxBuffer and input size, and emit a sanitized diagnostic to stderr for timeout, overflow, spawn, and parse failures.

### F9 - OpenCode and Claude inject continuity at materially different lifecycle points
- **Severity / Category / Confidence:** P1 / parity / high
- **Location:** `.opencode/plugins/mk-spec-memory.js:404-436`
- **Evidence:** OpenCode runs a warm session_resume brief on every experimental.chat.system.transform and otherwise only invalidates caches on lifecycle events. Its plugin has no transcript-derived PreCompact cache or Stop autosave counterpart. Conversely, Claude's UserPromptSubmit shim contains no memory continuity injection, while compact-inject.ts:383-485 and session-stop.ts:564-572 provide cache and persistence paths absent from the OpenCode plugin.
- **Impact:** OpenCode can repeatedly inject daemon-backed but stale continuity and cannot preserve unsaved transcript state when the daemon is unavailable; Claude receives fresher compact/stop state but has no equivalent per-prompt continuity refresh.
- **Proposed fix:** Define a shared lifecycle contract: either add bounded compaction/stop persistence to OpenCode and per-prompt refresh to Claude, or intentionally converge both on a common session-start plus compaction strategy with the same freshness and fallback guarantees.

### F10 - Claude executes generated dist hooks without enforcing source freshness
- **Severity / Category / Confidence:** P1 / error / high
- **Location:** `.claude/settings.json:32`
- **Evidence:** All four Spec Kit commands at lines 32, 44, 56, and 78 execute mcp_server/dist hook files rather than the audited TypeScript sources. The current runtime startup digest reports @spec-kit/mcp-server dist as stale, and these commands contain no local freshness guard.
- **Impact:** The actual Claude behavior can silently differ from the reviewed source and from the OpenCode plugin until a manual build occurs.
- **Proposed fix:** Rebuild the MCP server dist and make the hook launcher verify a source/dist fingerprint before execution, emitting a bounded diagnostic or safe fallback when stale.

### F11 - Session invalidation does not invalidate an in-flight continuity lookup
- **Severity / Category / Confidence:** P2 / bug / high
- **Location:** `.opencode/plugins/mk-spec-memory.js:350-369`
- **Evidence:** getContinuity reuses state.inFlight and caches its eventual response. invalidateSession at lines 392-400 clears only continuityCache, so a request begun before a message or session event can finish afterward and repopulate the cache with pre-event continuity.
- **Impact:** The next model turn can receive stale context for up to the configured TTL despite the lifecycle event explicitly invalidating that session.
- **Proposed fix:** Associate lookups with a per-session generation and cache only if the generation is unchanged, or cancel/remove the matching in-flight operation during invalidation.

### F12 - Configuration parse and read failures are completely silent
- **Severity / Category / Confidence:** P2 / error / high
- **Location:** `.opencode/plugins/mk-spec-memory.js:42-49`
- **Evidence:** loadConfig catches every read and JSON.parse exception and returns {} without preserving an error code for mk_spec_memory_status.
- **Impact:** Malformed JSON, permission failures, and missing configuration are indistinguishable; intended disablement, timeouts, or scoping can be ignored with no diagnostic.
- **Proposed fix:** Return configuration plus a sanitized config status/error code and expose it through mk_spec_memory_status without writing to the OpenCode TUI.

### F13 - Marker deduplication rejects otherwise valid text parts with extra fields
- **Severity / Category / Confidence:** P2 / bug / med
- **Location:** `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs:114-121`
- **Evidence:** hasSyntheticTextPartMarker parses existing parts with textPartSchema, which is strict at lines 20-33. Any OpenCode-added or plugin-added property makes validation fail before the metadata marker is inspected.
- **Impact:** SDK evolution or another transform augmenting a synthetic text part can defeat deduplication and permit duplicate context injection.
- **Proposed fix:** Use a minimal passthrough schema for marker inspection, or directly validate only type, metadata, markerKey, and dedupeKey while retaining strict validation for newly created parts.

## Files Reviewed

- `.opencode/plugins/mk-spec-memory.js`
- `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/shared.ts`
- `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs`
- `.claude/settings.json`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/spec-memory-cli-fallback.ts`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/memory-surface.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/hook-precompact.vitest.ts`
