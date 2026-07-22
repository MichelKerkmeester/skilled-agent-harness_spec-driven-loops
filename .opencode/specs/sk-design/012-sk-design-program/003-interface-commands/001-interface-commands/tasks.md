---
title: "Tasks: /interface:* creation commands"
description: "Task breakdown for the interface commands build."
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/003-interface-commands/001-interface-commands"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "implementation-engineer"
    recent_action: "Completed all interface-command implementation and verification tasks"
    next_safe_action: "Reviewer checks command wording and restarts OpenCode to load the new command surface"
    blockers: []
    key_files:
      - ".opencode/commands/design/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: /interface:* creation commands

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` open · `[x]` done with evidence. IDs `T001+`. Executor: GPT-5.6-SOL via cli-opencode in the isolated worktree.

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Author `sk-design/shared/creation-contract.md` (9-stage lifecycle, envelope, intake/grounding/proof/handoff). [SOURCE: `.opencode/skills/sk-design/shared/creation-contract.md`]
- [x] T002 Author `/interface:design` command against the contract, routing to `interface`. [TESTED: `interface-command-contract.test.mjs` route and visible-block assertions]

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Author `/interface:{foundations,motion,audit,design-reference}` per 002 §7, routing to their stable modes. [TESTED: canonical route test for all five stable modes]
- [x] T004 Convert `/design:*` to additive compatibility aliases; do not delete them. [TESTED: thin in-place alias assertions for all five aliases]
- [x] T005 Update `command-metadata.json` + `hub-router.json` to register interface commands + design aliases. [TESTED: `design-command-surface-check.mjs` reports `commands=5 compatibilityAliases=5`]

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 4 sk-design checkers PASS; route/contract `node --test` suite green (route, output blocks, alias routing, boundary rejections). [TESTED: `# tests 16`, `# pass 16`, `# fail 0`]
- [x] T007 Run `validate.sh` for this phase folder `--strict`. [TESTED: 0 errors, 0 warnings]

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All tasks `[x]` with evidence; P0 met; checkers + tests + validate green; packet ready for doc alignment + final validate.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Design authority: `../002-research-design-commands/research/research.md`.
- Parent: `../spec.md`. Predecessor: `../003-style-database/`.
- Surface: `.opencode/skills/sk-design/{mode-registry.json,hub-router.json,command-metadata.json}` + `shared/scripts/*-check.mjs`.

<!-- /ANCHOR:cross-refs -->
