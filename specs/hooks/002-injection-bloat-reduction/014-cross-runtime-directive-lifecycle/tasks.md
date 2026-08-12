---
title: "Tasks: Cross-Runtime Directive Lifecycle"
description: "Ordered tasks: locate the seams, add the canonical core + shim wiring + plugin mirror, prove every branch and no regression, then run the full gate."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "cross-runtime directive lifecycle tasks"
importance_tier: "high"
contextType: "tasks"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/014-cross-runtime-directive-lifecycle"
    last_updated_at: "2026-08-11T08:31:00Z"
    last_updated_by: "claude"
    recent_action: "All historical delivery tasks and gates completed; phase 018 owns hardening"
    next_safe_action: "None; historical packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts"
      - ".opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts"
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/skills/system-skill-advisor/mcp-server/plugin-bridges/mk-skill-advisor-bridge.mjs"
    session_dedup:
      fingerprint: "sha256:cc433faccb1d00699d39b815b236a9db56e225d52b0f038ac9b535772cd886d4"
      session_id: "2026-08-11-cross-runtime-directive-lifecycle"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Cross-Runtime Directive Lifecycle

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` completed and evidenced; `[~]` explicitly deferred with a recorded reason and owner; `[ ]` pending.
- `T-NNN` identifiers are stable within this packet.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Locate the seams: the shim's emitted-envelope assembly point (`effectiveEmitted` after `emitted`/fallback), the `\nDirectives:` separator (canonical `DIRECTIVE_SEPARATOR` mirroring render.ts `DIRECTIVES_LABEL`), the plugin's transform push point (`output.system`), the lifecycle-event plumbing (`lifecycleEventFor` in the shim, `lifecycleEventFrom` in the plugin), and the Pi call site. Evidence: `hooks/claude/user-prompt-submit.ts` assembly block; `plugins/mk-skill-advisor.js` transform block; `prompt-advisor.ts` calls `handleClaudeUserPromptSubmit({ prompt, cwd, hook_event_name })` with no session id.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-002 Add the canonical core `hooks/lib/directive-lifecycle.ts`: `DIRECTIVE_LIFECYCLE_DEDUP_ENV`, `DIRECTIVE_LIFECYCLE_STATE_DIR_ENV`, `DIRECTIVE_SEPARATOR`, `MAX_DIRECTIVE_LIFECYCLE_SESSIONS` (64), `isDirectiveLifecycleDedupEnabled`, `splitDirectiveBrief`, `decideDirectiveLifecycleDelivery`, `FULL_DIRECTIVE_LIFECYCLE_DELIVERY`, `InMemoryDirectiveLifecycleStore`, `FileDirectiveLifecycleStore` (per-session JSON under the env override or `tmpdir/speckit-advisor/directive-lifecycle/<project-hash>/`, atomic writes, fail-open IO), `defaultDirectiveLifecycleStore`, `resetDefaultDirectiveLifecycleStore`. Evidence: module present with all exports; boundary set is `startup`/`resume`/`compact` plus transcript path-change/shrink.
- [x] T-003 Wire the shim: compute `sessionId`, `sessionConfirmed` (`session_identity_confirmed` ?? `hasSessionId && !ambiguous`), lifecycle event, and transcript path/size (`statSync`); apply the decision to `emitted`; any throw keeps the full brief; `observeEmittedAdvisorPolicy` observes the effective (possibly reduced) emission. Evidence: `decideDirectiveLifecycleDelivery` call with `defaultDirectiveLifecycleStore()`; try/catch fails open; DL1-DL6 tests reference the envelope.
- [x] T-004 Wire the plugin mirror: `isDirectiveLifecycleDedupEnabled`, `decideOpenCodeDirectiveLifecycle`, per-instance `state.directiveDedupBySession` (bounded 64), transform integration via `pendingShadowLifecycle`, lifecycle re-arm on `session.created`/`session.resumed`/`session.compacted`/`session.compact`/`session.deleted` plus `resetRuntimeState`, and status-tool lines `directive_lifecycle_dedup` + `directive_dedup_sessions`. Evidence: mirror functions and event handlers in `mk-skill-advisor.js`; PL1-PL7 tests.
- [x] T-005 Leave the bridge and Pi untouched. Evidence: `plugin-bridges/mk-skill-advisor-bridge.mjs` has zero directive-lifecycle references and no git diff; `prompt-advisor.ts` unchanged and still uses its own `decidePiDirectiveDelivery` (013); `render.ts`, `policy-plan.ts`, and the 007 activation matrix have no git diff.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-006a Write the three suites: `directive-lifecycle.vitest.ts` (21 cases: decision branches, kill-switch env, file-store behavior), shim DL1-DL6, plugin PL1-PL7, and update the two pre-existing plugin repeat-turn tests to the route-line-only expectations (`ROUTE_ONLY_CONTEXT`). Evidence: test files present with the enumerated cases; updated assertions in "caches repeat prompts inside the TTL and misses after expiry" and "keeps separate cache entries for identical prompts across workspace roots".
- [x] T-006b Run the full gate: core+store suite, shim suite, plugin suite, Pi regression suite, and `validate.sh --recursive` on the parent spec folder; confirm zero diff on the frozen files. Evidence: directive-lifecycle.vitest.ts 21/21, claude-user-prompt-submit-hook.vitest.ts 16/16, mk-skill-advisor-plugin.vitest.ts 38/38, Pi dispatch 54/54 (129 tests); frozen files (`render.ts`, `policy-plan.ts`, 007 matrix, bridge, `prompt-advisor.ts`) zero git diff; 014 `validate.sh --strict` errors 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- A confirmed same-content repeat drops the directive block and keeps the route line on both `[SYS]` consumers; every uncertain case delivers full.
- Lifecycle boundaries and the kill-switch re-arm full delivery; sessions are isolated; Pi is untouched; the frozen files have zero diff.
- Full gate verification passes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria: `spec.md`.
- Approach and rollback: `plan.md`.
- Verification evidence: `checklist.md`, `implementation-summary.md`.
- Sibling Pi phase (adapter-local dedup): `../013-pi-local-directive-dedup/`.
<!-- /ANCHOR:cross-refs -->
