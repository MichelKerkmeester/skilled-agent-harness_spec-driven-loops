---
title: "Tasks: rewrite the /interface:* command bodies into literal design prompts"
description: "Sentinel + test-first, then atomically rewrite the five wrappers to the 9-step grammar with a single @-include and reconcile presentation/metadata authority, proven by the command test suite green."
trigger_phrases:
  - "interface command rewrite tasks"
  - "creation-contract include tasks"
  - "literal interface prompt tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/012-style-database-and-interface-commands/008-interface-command-rewrite"
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 tasks for the gap-004 command rewrite."
    next_safe_action: "Execute T001 (baseline + sentinel) before any wrapper edit."
    blockers: []
    key_files:
      - ".opencode/commands/interface/design.md"
      - ".opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-012-gap-plan-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: rewrite the /interface:* command bodies into literal design prompts

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` open · `[x]` done with evidence. IDs `T001+`. The executable contract is `interface-command-contract.test.mjs` + `design-command-surface-check.test.mjs` green plus the include sentinel. Comment hygiene: no spec/packet/phase/REQ ids in command bodies, assets, or test comments.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 (REQ-001/REQ-007) Capture the green 15-test baseline, then run the isolated include **sentinel**: a throwaway command carrying only `@.opencode/skills/sk-design/shared/creation-contract.md`; assert the contract's sentinel bytes appear in the model-visible prompt. Halt on contradiction.
- [ ] T002 (REQ-007) Extend `interface-command-contract.test.mjs`: assert exactly one canonical include per wrapper, all four typed statuses, anti-duplication (no copied lifecycle/schema/blocks), no nested public command, audit read-only, and md-generator measured-only fidelity.
- [ ] T003 (REQ-007) Extend `design-command-surface-check.test.mjs`: frontmatter, suffix, route, sibling, and proof projection parity across the five wrappers.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 (REQ-002/REQ-003/REQ-004/REQ-005) Rewrite all five wrappers from research §7 in one change: literal mode-specific mission + consequence of weak work; local intake field names on `$ARGUMENTS`; `:auto|:confirm` parsed first; fit/siblings/cannot-run/`workflowMode` without invoking a sibling; grounding + only decision-changing evidence; authority split + exactly one `@`-include; ordered outcome sequence + decisive criterion; artifact refinement; all four statuses. No command-owned taste.
- [ ] T005 (REQ-006) In the same patch: demote the five `interface-<mode>-presentation.txt` assets to consolidated-question + display fixtures (invert every PRESENTATION BOUNDARY), and update `command-metadata.json` to mirror the wrapper-normative / presentation-fixture split. Leave the `interface-<mode>-{auto,confirm}.yaml` execution assets unchanged.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 (REQ-007) Run `node --test interface-command-contract.test.mjs design-command-surface-check.test.mjs` (baseline 15 + new assertions) plus the fixture matrix: five auto, five confirm-wait, ASK/FAIL/DEFER, proof downgrade/blocked, audit no-write, md-generator output/fidelity.
- [ ] T007 (REQ-001/REQ-004/REQ-006) Confirm exactly one canonical include per wrapper and zero command-owned taste tables (`rg`), the presentation boundary inverted in all five, and `command-metadata.json` mirroring the split; then `validate.sh --strict` on this phase = 0 errors. On any gate failure, whole-change rollback to the 15/15 baseline.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All tasks `[x]` with evidence; the include sentinel passed; the two test files green (baseline 15 + new assertions); exactly one canonical include per wrapper; no command-owned taste; presentation demoted and metadata mirrored in one atomic patch; `validate.sh --strict` = 0 errors.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Design source: `../007-gap-remediation-research/004-commands/research/lineages/sol-high-fast/research.md` (§6 grammar, §7 body cores, §8 authority reconciliation, §9 acceptance matrix, §10 sequence).
- Decision source: parent `../spec.md` PHASE DOCUMENTATION MAP + this phase's `spec.md` FROZEN decision.
- Executable authority: `.opencode/skills/sk-design/shared/scripts/interface-command-contract.test.mjs` and `design-command-surface-check.test.mjs`.
- Sibling (already shipped): `../006-retire-design-alias-namespace/` retired `/design:*`, so this rewrite operates on an alias-free `/interface:*` surface.
<!-- /ANCHOR:cross-refs -->
