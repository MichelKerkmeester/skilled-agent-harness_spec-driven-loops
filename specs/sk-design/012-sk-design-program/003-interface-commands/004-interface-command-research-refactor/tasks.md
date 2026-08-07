---
title: "Tasks: Research + Refactor the sk-design /interface:* Design Commands"
description: "Task ledger for the /interface:* command research + thin-router refactor + test/benchmark/verify: 3 research passes, router restore, @-include, machine-contract refresh, contract test green, real invocation verified."
trigger_phrases:
  - "interface command refactor tasks"
  - "thin router refactor task ledger"
  - "design command research tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/003-interface-commands/004-interface-command-research-refactor"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "orchestrator"
    recent_action: "Completed research + refactor + verification tasks."
    next_safe_action: "Commit + push."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-012-009-interface-command-research-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: Research + Refactor the sk-design /interface:* Design Commands

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` done with evidence. The executable contract is: 5 router-detected commands with one
`@`-include each, `interface-command-contract.test.mjs` green, and a real invocation that routes.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Fresh worktree at v4 tip; runtime deps symlinked; `012/009` packet scaffolded. [SOURCE: `.worktrees/0096-sk-design-interface-command-research`]
- [x] T002 Ran 2 SOL-fast web-research dispatches + native Opus-4.8 research; synthesized `research.md`. [SOURCE: `research/{research.md,sol-findings-1.md,sol-findings-2.md,opus-native-findings.md}`; 30 webfetch in dispatch 1]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Restored the 5 routers + 5 presentations + the contract test to the conformant router base. [SOURCE: `git checkout d0e838c73c~1`]
- [x] T004 Added exactly one `@`-include of the shared contract per router. [TESTED: `@-include=1` for all 5]
- [x] T005 Refreshed `command-contract.json` to the live `/interface:*` surface. [TESTED: 0 stale `/design` refs; valid JSON]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Contract test green after all edits. [TESTED: `node --test interface-command-contract.test.mjs` 8/8]
- [x] T007 Real invocation verified: `/interface:design` routes (Route Proof + STATUS + `@`-include expansion). [TESTED: exit 0; `creation-contract` expanded; `ROUTER CONTRACT` emitted]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] 5 conformant thin routers, one `@`-include each (T003/T004)
- [x] Machine contract aligned to `/interface:*` (T005)
- [x] Test green + real invocation verified (T006/T007)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Research: `research/research.md` (+ the 3 passes).
- Router base: `d0e838c73c~1`. Standard: `.opencode/skills/sk-doc/create-command/`.
<!-- /ANCHOR:cross-refs -->
