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
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Created integration suite task ledger"
    next_safe_action: "Execute T701"
    blockers: []
    key_files: ["../../research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T701 Inventory the upstream structural FakePi in `context/pi-openai-fast-mode/tests/extension.test.ts` and the current fork coverage against research.md §10 items 1-3 and 5.
- [ ] T702 Create the structural FakePi fixture module `tests/helpers/fake-pi.ts` (registration spies, handler/command maps, `makeCtx(cwd, model)`) with temporary config directories and cleanup.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T703 Author `tests/lifecycle.test.ts`: registration of the `fast` command and `fast` flag, plus `session_start`/`model_select`/`session_shutdown` ordering.
- [ ] T704 Author `tests/config-migration.test.ts`: config scope resolution and the one-time legacy migration.
- [ ] T705 Author `tests/integration.test.ts`: model selection, namespaced `setStatus`, cloned-payload `service_tier`, and handoff-state application on a supported model.
- [ ] T706 Export the command-ownership helper from `tests/helpers/command-ownership.ts` (asserts the registered `fast` command source/owner) for the live probe in `002-install-transition/`.

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T707 Run `npm run typecheck` (`tsc --noEmit`) and `npm test` (full Vitest); both must exit 0.
- [ ] T708 Record a clean `git status` proving no settings or npm-scope change occurred.

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remain.
- [ ] Handoff criteria in `spec.md` are evidenced.

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
<!-- /ANCHOR:cross-refs -->
