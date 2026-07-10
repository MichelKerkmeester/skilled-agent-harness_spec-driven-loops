---
title: "Tasks: mk-skill-advisor remediation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mk-skill-advisor remediation"
  - "mk-skill-advisor fixes"
  - "mk-skill-advisor bug fixes"
  - "opencode plugin remediation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/129-opencode-plugins-hooks-remediation/002-mk-skill-advisor"
    last_updated_at: "2026-07-10T09:27:08.451Z"
    last_updated_by: "gpt-5.6-sol-fast-audit"
    recent_action: "Enumerated 17 fix tasks"
    next_safe_action: "Implement P1 tasks first"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-skill-advisor.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plugin-remediation-128"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: mk-skill-advisor remediation

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
- [ ] T001 Capture a green baseline of the mk-skill-advisor test suite before any change
- [ ] T002 Confirm each targeted finding reproduces against current code
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P1 - correctness / silent-breakage

- [ ] T003 [P1 (GPT P1 / Opus P2)] OpenCode can serve obsolete recommendations after skill-graph changes (`.opencode/plugins/mk-skill-advisor.js:48`)
    - Source: iteration-1 F1, Opus verdict: adjusted
    - Fix: Include canonical graph generation or the same freshness sourceSignature used by buildSkillAdvisorBrief in the OpenCode cache key, or remove the redundant host cache and rely on the shared advisor cache.
- [ ] T004 [P1 (GPT P1 / Opus P2)] Claude CLI fallback passes an unbounded prompt through argv (`.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:263`)
    - Source: iteration-1 F2, Opus verdict: adjusted
    - Fix: Send the CLI request through stdin rather than argv and apply one shared UTF-8 prompt-byte policy across both surfaces.
- [ ] T005 [P1 (GPT P1 / Opus P2)] Bridge output handling permits memory growth and stderr pipe deadlock (`.opencode/plugins/mk-skill-advisor.js:455`)
    - Source: iteration-1 F3, Opus verdict: adjusted
    - Fix: Enforce a bounded raw-stdout limit, drain stderr with a small diagnostic cap, terminate the child when output exceeds the limit, and return a prompt-safe fail-open code.
- [ ] T006 [P1 (GPT P1 / Opus P2)] Legacy Claude shim resolves its target from mutable process CWD (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:11`)
    - Source: iteration-1 F4, Opus verdict: adjusted
    - Fix: Resolve the target from import.meta.url or locate the repository root deterministically before spawning.
- [ ] T007 [P1 (GPT P1 / Opus P2)] Legacy Claude shim has no child timeout and hides launch failures (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:13`)
    - Source: iteration-1 F5, Opus verdict: adjusted
    - Fix: Give spawnSync a bounded timeout, emit a prompt-safe diagnostic to stderr for result.error/nonzero/invalid-output cases, and continue returning {} to preserve fail-open behavior.
- [ ] T008 [P1 (GPT P1 / Opus P2)] OpenCode injects context on skip or failure while Claude fails open silently (`.opencode/plugins/mk-skill-advisor.js:672`)
    - Source: iteration-1 F6, Opus verdict: adjusted
    - Fix: Define the fallback policy once in the shared renderer: either return no advisor context on all non-ok statuses or deliberately return the same hygiene-only context from both surfaces.

### P2 - minor bugs

- [ ] T009 [P2] Claude CLI fallback discards caller-supplied thresholds (`.opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:263`)
    - Source: iteration-1 F7, Opus verdict: confirmed
    - Fix: Include normalized confidenceThreshold and uncertaintyThreshold in the Claude CLI request and add a test using non-default values.
- [ ] T010 [P2] OpenCode uses a forked renderer that omits shared governor context (`.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs:324`)
    - Source: iteration-1 F8, Opus verdict: confirmed
    - Fix: Import and use the canonical compiled renderAdvisorBrief in the bridge, retaining a minimal fail-open response only when that shared module cannot load.
- [ ] T011 [P2] Session disposal races with in-flight requests and can repopulate cleared state (`.opencode/plugins/mk-skill-advisor.js:582`)
    - Source: iteration-1 F9, Opus verdict: confirmed
    - Fix: Track an instance generation or disposed flag and refuse post-reset cache writes; also track child processes so disposal can terminate them and clear in-flight state safely.
- [ ] T012 [P2 (GPT P2 / Opus refinement)] Forced process exit can truncate Claude fail-open output and diagnostics (`.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:271`)
    - Source: iteration-1 F10, Opus verdict: confirmed
    - Fix: Await writeHookOutput in the catch path, avoid process.exit(), set process.exitCode = 0, and either await diagnostic persistence or explicitly flush it before returning.
- [ ] T013 [P2] Default prompt-blocking timeout differs by more than threefold (`.opencode/plugins/mk-skill-advisor.js:33`)
    - Source: iteration-1 F11, Opus verdict: confirmed
    - Fix: Use a shared end-to-end hook budget or explicitly document and test a justified per-runtime budget; include termination grace inside, rather than after, that budget.
- [ ] T014 [P2 (GPT P2 / Opus refinement)] Malformed OpenCode configuration is silently treated as absent (`.opencode/plugins/mk-skill-advisor.js:55`)
    - Source: iteration-1 F12, Opus verdict: confirmed
    - Fix: Treat ENOENT as an absent optional file, but retain a prompt-safe configuration error code for parse/read failures and expose it through the status tool.
- [ ] T015 [P2 · Opus-new] OpenCode appendAdvisorBrief has no outer try/catch → fail-CLOSED on unexpected throw (`.opencode/plugins/mk-skill-advisor.js:666-677`)
    - Source: Opus iteration-2 (new)
    - Fix: Wrap the getAdvisorContext + push block (or the whole appendAdvisorBrief body after output.system init) in try/catch that, on any throw, pushes HYGIENE_DIRECTIVE (or nothing) and records lastErrorCode — mirroring the Claude hook's outer guard.
- [ ] T016 [P2 · Opus-new] Legacy spec-kit shim uses readFileSync(0) with no try/catch → hard crash on EAGAIN, defeating fail-open (`.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:15`)
    - Source: Opus iteration-2 (new)
    - Fix: Wrap the read+spawn in try/catch that writes '{}\n' and exits 0 on any error; prefer a retry loop or async stdin read for EAGAIN resilience.

### Refinements

- [ ] T017 [refinement · Opus-new] OpenCode bridge payload mislabels runtime as 'codex' (`.opencode/plugins/mk-skill-advisor.js:361`)
    - Source: Opus iteration-2 (new)
    - Fix: Set runtime:'opencode' (or thread the actual runtime through) in bridgePayloadJson; add a test asserting the emitted payload runtime.
- [ ] T018 [refinement · Opus-new] Advisor cache expiresAt computed from pre-await timestamp shortens effective TTL by bridge duration (`.opencode/plugins/mk-skill-advisor.js:546`)
    - Source: Opus iteration-2 (new)
    - Fix: Re-read Date.now() after the await when computing expiresAt/updatedAt, or set expiresAt = completionTime + cacheTTLMs.
- [ ] T019 [refinement · Opus-new] session.deleted purge resolves session id via a different path than the cache-write key, so entries may not be evicted (`.opencode/plugins/mk-skill-advisor.js:693-701`)
    - Source: Opus iteration-2 (new)
    - Fix: Route both write and delete through one shared session-id resolver, and add a test feeding a delete event whose id lives under properties.info to assert purge.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] T020 Re-run the mk-skill-advisor test suite; confirm green
- [ ] T021 Verify each fixed finding no longer reproduces
- [ ] T022 Verify OpenCode<->Claude parity for this plugin
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
- **Audit findings**: See `../../127-opencode-plugins-hooks-audit/002-mk-skill-advisor/review/`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
