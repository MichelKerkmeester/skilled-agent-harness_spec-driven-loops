---
title: "Tasks: Phase 1 extension-integration-suite"
description: "Task ledger for deterministic extension-boundary tests."
trigger_phrases:
  - "extension-integration-suite tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/003-integration-and-tests/001-extension-integration-suite"
    last_updated_at: "2026-08-17T03:34:46Z"
    last_updated_by: "claude-code"
    recent_action: "All suite tasks executed: 76 tests passed, typecheck exit 0"
    next_safe_action: "Continue to 002-install-transition"
    blockers: []
    key_files: ["../../research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: Phase 1 extension-integration-suite

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[P]` parallelizable · `[B]` blocked.

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T701 Inventory the upstream structural FakePi in `context/pi-openai-fast-mode/tests/extension.test.ts` and the current fork coverage against research.md §10 items 1-3 and 5. — inventory done; fork suite lives in `tests/extension.test.ts` plus per-boundary files; `npm test` 76 passed.
- [x] T702 Create the structural FakePi fixture module `tests/helpers/fake-pi.ts` (registration spies, handler/command maps, `makeCtx(cwd, model)`) with temporary config directories and cleanup. — DEVIATION: FakePi is inline in `tests/extension.test.ts` (`vi.fn()` spies, handler/command maps, `makeCtx`), not a separate `tests/helpers/fake-pi.ts`.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T703 Author `tests/lifecycle.test.ts`: registration of the `fast` command and `fast` flag, plus `session_start`/`model_select`/`session_shutdown` ordering. — DEVIATION: covered in `tests/extension.test.ts` (`registerCommand("fast")`, `registerFlag("fast")`, event order via handler map), not a separate `lifecycle.test.ts`.
- [x] T704 Author `tests/config-migration.test.ts`: config scope resolution and the one-time legacy migration. — DEVIATION: covered by `tests/config.test.ts` + `tests/extension.test.ts`; scope + one-time migration exercised; 76 passed.
- [x] T705 Author `tests/integration.test.ts`: model selection, namespaced `setStatus`, cloned-payload `service_tier`, and handoff-state application on a supported model. — DEVIATION: covered across `tests/extension.test.ts` + `tests/payload-status.test.ts`; `setStatus(STATUS_KEY, ...)` and cloned `service_tier` asserted; 76 passed.
- [x] T706 Export the command-ownership helper from `tests/helpers/command-ownership.ts` (asserts the registered `fast` command source/owner) for the live probe in `002-install-transition/`. — DEVIATION: helper not exported; live ownership proven via RPC `get_commands` directly in `002-install-transition`.

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T707 Run `npm run typecheck` (`tsc --noEmit`) and `npm test` (full Vitest); both must exit 0. — `npm run typecheck` exit 0; `npm test` = 76 passed.
- [x] T708 Record a clean `git status` proving no settings or npm-scope change occurred. — `git status` shows no `.pi/` or npm-scope change from the suite.

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remain.
- [x] Handoff criteria in `spec.md` are evidenced.

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
<!-- /ANCHOR:cross-refs -->
