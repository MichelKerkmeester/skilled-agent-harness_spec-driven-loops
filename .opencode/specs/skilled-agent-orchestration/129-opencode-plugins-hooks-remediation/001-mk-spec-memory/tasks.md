---
title: "Tasks: mk-spec-memory remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mk-spec-memory remediation"
  - "mk-spec-memory fixes"
  - "mk-spec-memory bug fixes"
  - "opencode plugin remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/001-mk-spec-memory"
    last_updated_at: "2026-07-10T09:27:08.451Z"
    last_updated_by: "gpt-5.6-sol-fast-audit"
    recent_action: "Enumerated 19 fix tasks"
    next_safe_action: "Implement P1 tasks first"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-spec-memory.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mk-spec-memory remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`. Each task carries its source finding id, severity, and the audit's proposed fix.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] T001 Capture a green baseline of the mk-spec-memory test suite before any change
- [ ] T002 Confirm each targeted finding reproduces against current code
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P1 - correctness / silent-breakage

- [ ] T003 [P1 (GPT P1 / Opus P2)] A placeholder Session Continuity section suppresses real warm recovery (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:289-354`)
    - Source: iteration-1 F1, Opus verdict: confirmed
    - Fix: Distinguish actual recovered continuity from instructional placeholders, or suppress the CLI fallback only when a section contains accepted continuity payload data.
- [ ] T004 [P1 (GPT P1 / Opus P2)] The autosave fallback reports deferred without performing or queuing a save (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:104-127`)
    - Source: iteration-1 F2, Opus verdict: confirmed
    - Fix: Use a write-capable, auditable fallback or durable retry queue; otherwise return failed/skipped and state explicitly that no autosave occurred.
- [ ] T005 [P1 (GPT P1 / Opus P2)] PreCompact tailing reads the entire transcript synchronously (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:41-48`)
    - Source: iteration-1 F4, Opus verdict: confirmed
    - Fix: Read a bounded tail using open/fstat/read with a byte cap, expanding backward only if necessary to obtain the requested line count.
- [ ] T006 [P1 (GPT P1 / Opus P2)] The PreCompact workload is not bounded by HOOK_TIMEOUT_MS (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:383-445`)
    - Source: iteration-1 F5, Opus verdict: confirmed
    - Fix: Apply one end-to-end deadline with cancellation or staged remaining-budget checks, and persist a bounded legacy fallback before the external hook deadline expires.
- [ ] T007 [P1 (GPT P1 / Opus P2)] The cached payload contract does not describe the payload being cached (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:304-331`)
    - Source: iteration-1 F6, Opus verdict: confirmed
    - Fix: Return text and payloadContract from one merge operation and add every auto-surfaced section to that same envelope before truncation and persistence.
- [ ] T008 [P1 (GPT P1 / Opus P2)] Producer metadata can identify an older transcript generation than the parsed bytes (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:375-406`)
    - Source: iteration-1 F7, Opus verdict: confirmed
    - Fix: Open and stat one descriptor, parse no farther than the captured size, and build metadata from that descriptor; alternatively re-stat afterward and discard/retry if identity, size, or mtime changed.
- [ ] T009 [P1 (GPT P1 / Opus refinement)] UserPromptSubmit launches its child without timeout or output bounds (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13-18`)
    - Source: iteration-1 F8, Opus verdict: adjusted
    - Fix: Set a timeout below the outer hook deadline, cap maxBuffer and input size, and emit a sanitized diagnostic to stderr for timeout, overflow, spawn, and parse failures.
- [ ] T010 [P1 (GPT P1 / Opus P2)] OpenCode and Claude inject continuity at materially different lifecycle points (`.opencode/plugins/mk-spec-memory.js:404-436`)
    - Source: iteration-1 F9, Opus verdict: confirmed
    - Fix: Define a shared lifecycle contract: either add bounded compaction/stop persistence to OpenCode and per-prompt refresh to Claude, or intentionally converge both on a common session-start plus compaction strategy with the same freshness and fallback guarantees.
- [ ] T011 [P1 (GPT P1 / Opus refinement)] Claude executes generated dist hooks without enforcing source freshness (`.claude/settings.json:32`)
    - Source: iteration-1 F10, Opus verdict: adjusted
    - Fix: Rebuild the MCP server dist and make the hook launcher verify a source/dist fingerprint before execution, emitting a bounded diagnostic or safe fallback when stale.

### P2 - minor bugs

- [ ] T012 [P2] Session invalidation does not invalidate an in-flight continuity lookup (`.opencode/plugins/mk-spec-memory.js:350-369`)
    - Source: iteration-1 F11, Opus verdict: confirmed
    - Fix: Associate lookups with a per-session generation and cache only if the generation is unchanged, or cancel/remove the matching in-flight operation during invalidation.
- [ ] T013 [P2 (GPT P2 / Opus refinement)] Configuration parse and read failures are completely silent (`.opencode/plugins/mk-spec-memory.js:42-49`)
    - Source: iteration-1 F12, Opus verdict: confirmed
    - Fix: Return configuration plus a sanitized config status/error code and expose it through mk_spec_memory_status without writing to the OpenCode TUI.
- [ ] T014 [P2] Marker deduplication rejects otherwise valid text parts with extra fields (`.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-opencode-message-schema.mjs:114-121`)
    - Source: iteration-1 F13, Opus verdict: confirmed
    - Fix: Use a minimal passthrough schema for marker inspection, or directly validate only type, metadata, markerKey, and dedupeKey while retaining strict validation for newly created parts.
- [ ] T015 [P2 · Opus-new] runBridge never attaches a child.stdin 'error' handler — early-exiting bridge yields unhandled EPIPE (`.opencode/plugins/mk-spec-memory.js:329`)
    - Source: Opus iteration-2 (new)
    - Fix: Attach `child.stdin.on('error', () => {})` (or wrap the .end in try/catch and swallow EPIPE) before writing, consistent with the fail-open contract used for the other streams.
- [ ] T016 [P2 · Opus-new] runBridge accumulates bridge stdout with no size cap (parity gap vs Claude spawnSync maxBuffer) (`.opencode/plugins/mk-spec-memory.js:296-298`)
    - Source: Opus iteration-2 (new)
    - Fix: Cap accumulated stdout (e.g., stop appending / kill child past a byte ceiling) and return fail_open with an OVERFLOW error code, matching the Claude maxBuffer behavior.
- [ ] T017 [P2 · Opus-new] PreCompact performs unbounded synchronous authored-snapshot disk writes before any cache is persisted (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:401-415`)
    - Source: Opus iteration-2 (new)
    - Fix: Run the snapshot refresh under a remaining-budget deadline (or after the cache write), and ensure a bounded legacy cache is persisted before the external hook deadline.

### Refinements

- [ ] T018 [refinement · Opus-new] UserPromptSubmit shim has no top-level try/catch; a stdin-read throw drops the safe '{}' default (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13-31`)
    - Source: Opus iteration-2 (new)
    - Fix: Wrap the read+spawn in try/catch and always emit `process.stdout.write('{}\n')` on any failure; optionally add a timeout below the 3s outer deadline.
- [ ] T019 [refinement · Opus-new] Stop hook re-runs autosave against pre-existing state when no patch was produced (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:564-571`)
    - Source: Opus iteration-2 (new)
    - Fix: Gate autosave on 'summary was (re)extracted this run' (e.g., only when patch.sessionSummary or a fresh transcript delta exists), not merely on the presence of any prior state.
- [ ] T020 [refinement · Opus-new] OpenCode invalidates continuity cache on every message/session event, largely defeating the 5s TTL cache (`.opencode/plugins/mk-spec-memory.js:427-430`)
    - Source: Opus iteration-2 (new)
    - Fix: Invalidate on session boundary / genuine state-changing events only (or key the cache by a session generation counter) so intra-session prompts can reuse a warm brief within the TTL.
- [ ] T021 [refinement · Opus-new] appendContinuityBrief dedupe compares a clamped brief with includes(), so a prior full brief can be re-injected (`.opencode/plugins/mk-spec-memory.js:411-413`)
    - Source: Opus iteration-2 (new)
    - Fix: Dedupe on a stable marker/hash of the un-clamped brief (or on a metadata key) rather than substring-includes of the clamped text.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T022 Re-run the mk-spec-memory test suite; confirm green
- [ ] T023 Verify each fixed finding no longer reproduces
- [ ] T024 Verify OpenCode<->Claude parity for this plugin
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All P1 tasks `[x]`
- [ ] P2 + refinements applied or deferred with rationale
- [ ] Plugin tests green; no `[B]` blocked tasks
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Audit findings**: See `../../127-opencode-plugins-hooks-audit/001-mk-spec-memory/review/`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
