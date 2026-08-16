---
title: "Tasks: Phase 3 package-baseline-gates"
description: "Task ledger for packaging, provenance, and baseline verification."
trigger_phrases:
  - "package-baseline-gates tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package/003-package-baseline-gates"
    last_updated_at: "2026-08-16T11:00:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Created package gate task ledger"
    next_safe_action: "Execute T301"
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
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: Phase 3 package-baseline-gates

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending · `[x]` complete · `[P]` parallelizable · `[B]` blocked.

<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T301 Compare the upstream manifest and package guidance.
- [ ] T302 [P] Define the expected pack file list and provenance assertions.

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T303 Set package name, keywords, `pi.extensions` -> `./src/index.ts`, peer dependencies, scripts, and included files.
- [ ] T304 Update README provenance and preserve the MIT LICENSE.
- [ ] T305 Confirm strict no-emit TypeScript settings, review lockfile churn, and assert Pi core packages are peers with no `dist/` requirement (grep).

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T306 Run `npm run typecheck` and `npm test` from the fork.
- [ ] T307 Run identity/provenance/license greps and `npm pack --dry-run`, comparing its output to the enumerated file list.
- [ ] T308 Record the handoff receipt, the Node version used (>=22.19), and ensure no settings/install files changed.

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
