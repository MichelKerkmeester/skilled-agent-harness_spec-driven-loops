---
title: "Verification Checklist: Phase 009 — README Alignment (Hub + Sub-Skills)"
description: "Complete Level 2 verification checklist for aligning sk-design's hub and mode-packet README files with the shipped Phase 002-005 reality. All items verified with evidence."
trigger_phrases:
  - "verification"
  - "checklist"
  - "readme alignment"
  - "sk-design readme alignment"
importance_tier: "normal"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/009-readme-alignment"
    last_updated_at: "2026-07-06T05:10:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Verified all 22 checklist items with real evidence"
    next_safe_action: "Start Phase 010 feature-catalog-completeness"
---
# Verification Checklist: Phase 009 — README Alignment (Hub + Sub-Skills)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot start implementation until complete |
| **[P1]** | Required | Must complete OR get user approval to defer |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] [EVIDENCE: Phase 008 checklist] Phase 008 gate closes before any Phase 009 implementation, or explicit user approval to proceed is recorded
  - **Evidence required**: Phase 008 `checklist.md` gate status closed, or a recorded approval note.
  - **Evidence**: `../008-smart-routing-optimization/checklist.md` line 170 records `Gate Status: CLOSED`; `../008-smart-routing-optimization/implementation-summary.md` line 34 records `Status: Complete`.
- [x] CHK-002 [P0] [EVIDENCE: SKILL.md, mode-registry.json, procedures/, manual_testing_playbook/ read] Current hub and mode-packet state is re-read before any edit
  - **Evidence required**: File paths and current-state notes confirmed live, not assumed from `spec.md`.
  - **Evidence**: `SKILL.md`, `mode-registry.json`, each mode's `procedures/` directory, and `manual_testing_playbook/manual_testing_playbook.md` were re-read live during this verification pass; the shipped README content matches the live counts (see CHK-012/CHK-013).
- [x] CHK-003 [P0] [EVIDENCE: no README edit before Phase 008 closure] No README implementation edit occurs before Phase 008 closure or explicit approval
  - **Evidence required**: Scoped status/diff review before implementation.
  - **Evidence**: Phase 008 closed 2026-07-06 per its `implementation-summary.md`; the six README edits land as part of the same packet session after that closure, confirmed via `git diff` scope review (CHK-030).
- [x] CHK-004 [P0] [EVIDENCE: logic-sync review] Logic-sync conflicts between this plan's cited counts and the live tree are escalated before writing
  - **Evidence required**: Any conflict between this spec's counts (procedure-card counts, playbook scenario counts) and the live tree is reported with the prevailing truth decision.
  - **Evidence**: No conflict found. Live counts match `spec.md`'s cited figures exactly: 6/3/1/2/1 procedure cards for interface/foundations/motion/audit/md-generator, and 10 `MOTION-*` scenarios across 6 categories (including `06--advanced-craft`) in `design-motion/manual_testing_playbook/manual_testing_playbook.md`.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] [EVIDENCE: hub README RELATED DOCUMENTS] Hub `README.md` names `benchmark/` and `manual_testing_playbook/`
  - **Evidence required**: Both paths appear with a one-line description each and resolve on disk.
  - **Evidence**: `.opencode/skills/sk-design/README.md` lines 102-103 list `benchmark/` and `manual_testing_playbook/` with one-line descriptions; both directories confirmed present on disk (`benchmark/baseline/`, `benchmark/after-009/`; `manual_testing_playbook/` with 6 category folders, 24 scenario files).
- [x] CHK-011 [P0] [EVIDENCE: hub README Section 4] Hub `README.md` names the Phase 002 hub-shell contract sections by number
  - **Evidence required**: `Manager Intake Before Routing`, `Visible Plan Before Design or Build Work`, `Proof Gates and Verifier Cadence`, and the transport-vs-taste separation are each attributed to their live `SKILL.md` section.
  - **Evidence**: `.opencode/skills/sk-design/README.md` line 76 names all three `SKILL.md` Section 2 headings verbatim plus `SKILL.md` Section 7 for the transport-vs-taste separation.
- [x] CHK-012 [P0] [EVIDENCE: five mode README RELATED DOCUMENTS] Each mode README names its own `procedures/` folder
  - **Evidence required**: `design-interface/README.md`, `design-foundations/README.md`, `design-motion/README.md`, `design-audit/README.md`, and `design-md-generator/README.md` each reference their `procedures/` directory.
  - **Evidence**: All five confirmed via `grep -n "procedures/"` against each mode README: `design-interface/README.md` lines 108/182 (6 cards named), `design-foundations/README.md` lines 96/150 (3 cards), `design-motion/README.md` lines 56/112 (1 card), `design-audit/README.md` lines 81/128 (2 cards), `design-md-generator/README.md` lines 123/239 (1 card).
- [x] CHK-013 [P1] [EVIDENCE: design-motion/README.md VERIFICATION] `design-motion/README.md`'s scenario count and category list match the live playbook
  - **Evidence required**: The VERIFICATION section's scenario count and category names match `design-motion/manual_testing_playbook/manual_testing_playbook.md` Section 1 exactly.
  - **Evidence**: `design-motion/README.md` line 94 states "Ten scenarios across `01--strategy`, `02--presence`, `03--reduced-motion`, `04--micro-interactions`, `05--decision` and `06--advanced-craft` categories"; the live playbook's Section 1 overview table lists exactly 10 `MOTION-*` rows across those 6 categories.
- [x] CHK-014 [P1] [EVIDENCE: design-md-generator/README.md frontmatter] `design-md-generator/README.md` carries a frontmatter block matching sibling convention
  - **Evidence required**: `title`, `description`, `trigger_phrases`, and `version` fields exist, with `trigger_phrases` sourced from `mode-registry.json`'s `md-generator` `aliases`.
  - **Evidence**: `design-md-generator/README.md` lines 1-9 carry the frontmatter block; all 5 `trigger_phrases` ("extract design system", "generate design.md", "capture website css", "design tokens from url", "validate design.md") are a verified subset of `mode-registry.json` line 127's `md-generator` `aliases` array.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] [EVIDENCE: validate_document.py per file] README structure validates with zero issues for all six edited files
  - **Evidence required**: `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` reports zero issues per file.
  - **Evidence**: All six files report `Total issues: 0` (hub, `design-interface`, `design-foundations`, `design-motion`, `design-audit`, `design-md-generator`), re-run and confirmed during this verification pass.
- [x] CHK-021 [P0] [EVIDENCE: parent-skill-check.cjs] Parent-skill canon check remains a clean pass after the README edits
  - **Evidence required**: `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` exits 0 with 0 failures and 0 warnings.
  - **Evidence**: Exit 0; output ends `OK: parent-skill-check — all hard invariants passed, 0 warnings`, re-run and confirmed during this verification pass.
- [x] CHK-022 [P1] [EVIDENCE: link resolution review] Every newly added or edited link resolves on disk
  - **Evidence required**: `Read`/`Glob` confirmation for each `procedures/`, `benchmark/`, and `manual_testing_playbook/` path cited.
  - **Evidence**: Confirmed on disk: `benchmark/baseline/`, `benchmark/after-009/`, `manual_testing_playbook/` (6 category dirs, 24 scenario files), and each mode's `procedures/` directory with the exact card counts cited (6/3/1/2/1).
- [x] CHK-023 [P1] [EVIDENCE: HVR manual review] Human Voice Rules pass on every edited README
  - **Evidence required**: No em dashes, semicolons, Oxford commas, banned words, or setup phrases in any new or edited passage.
  - **Evidence**: `git diff` added-line review across all six files found no em dashes, semicolons, Oxford commas, or banned words (leverage, seamless, robust, utilize, delve, boasts) in the new/edited passages.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-005 [P0] [EVIDENCE: README Alignment Findings table in spec.md] Every finding recorded in `spec.md`'s README Alignment Findings table is resolved by a corresponding README edit
  - **Evidence required**: Each row in that table maps to a completed edit in the matching README.
  - **Evidence**: All 6 rows resolved: hub `benchmark/`/`manual_testing_playbook/` (line 102-103) and Section 4 citation (line 76); `design-interface`, `design-foundations`, `design-audit`, `design-md-generator` `procedures/` references; `design-motion` `procedures/` reference plus corrected VERIFICATION scenario/category claim.
- [x] CHK-006 [P1] [EVIDENCE: shared/procedures/polish_gate_orchestration.md placement decision] The shared-level procedure card's README placement is decided and recorded, not silently dropped
  - **Evidence required**: A note in the implementer's evidence trail stating where `shared/procedures/polish_gate_orchestration.md` is documented (most likely the hub README).
  - **Evidence**: Decided and recorded in the hub README's `RELATED DOCUMENTS` table: `.opencode/skills/sk-design/README.md` line 104 links `shared/procedures/polish_gate_orchestration.md` as "Shared maintainer-facing procedure card for polish-gate orchestration across modes."

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] [EVIDENCE: scoped git diff] No `SKILL.md`, `mode-registry.json`, `hub-router.json`, `procedures/**`, `shared/**`, `benchmark/**`, or `manual_testing_playbook/**` content file is edited by this phase
  - **Evidence required**: Scoped `git diff` for those paths returns no output.
  - **Evidence**: `git diff --name-only -- .opencode/skills/sk-design .opencode/commands/design` shows six `README.md` files plus pre-existing dirty state from earlier packet phases (002/003/004/007, all already-shipped content per Phase 006's ADR-001 and Phase 007's Path B decision). This phase's own edits are confined to the six `README.md` files; the diff dates on `SKILL.md`/`mode-registry.json`/`hub-router.json`/`shared/**`/`procedures/**` predate this phase's session (last commit `07a6acd909`, prior to this phase's edits).
- [x] CHK-031 [P1] [EVIDENCE: plan.md rollback section] Rollback path preserves unrelated work
  - **Evidence required**: Non-destructive rollback path and explicit confirmation rule are recorded before implementation.
  - **Evidence**: `plan.md` Section 7 states a `git diff`/`git status`-first, non-destructive rollback path. No rollback was triggered; all six README edits landed clean on the first pass.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] [EVIDENCE: cross-document review after implementation] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` stay synchronized once implementation runs
  - **Evidence required**: Cross-document review confirming all four docs describe the same completed evidence set.
  - **Evidence**: `spec.md` Section 1 status updated to Complete; `plan.md` Definition of Done and phase checkboxes marked done; `tasks.md` T001-T025 marked complete; this `checklist.md` records the same evidence set across all four documents.
- [x] CHK-041 [P1] [EVIDENCE: no premature completion claim] Docs do not claim implementation completion while it remains planned
  - **Evidence required**: `spec.md`, `plan.md`, `tasks.md`, and this `checklist.md` all state "Planned / Not Started" or an unchecked state until real evidence exists.
  - **Evidence**: Real evidence now exists for every P0/P1 item above (validator output, canon-check output, live grep/find confirmations), so the Complete status is evidenced, not premature.
- [x] CHK-042 [P2] Optional handoff notes recorded if implementation stays blocked
  - **Evidence required**: Continuation notes describing the blocker, once one exists.
  - **Evidence**: Not applicable. Implementation completed with no blocker; see `implementation-summary.md`.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] [EVIDENCE: authored docs and generated metadata live in this phase folder] Phase writes remain inside the Phase 009 folder for this documentation task
  - **Evidence required**: File list includes only `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `description.json`, and `graph-metadata.json` in this folder.
  - **Evidence**: `find .opencode/specs/sk-design/009-sk-design-claude-parity/009-readme-alignment -maxdepth 1` lists exactly `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `description.json`, `graph-metadata.json`, plus this run's added `implementation-summary.md`.
- [x] CHK-051 [P1] [EVIDENCE: scoped status shows no other path touched] Parent root, sibling phases, `external/**`, `research/**`, and `.opencode/skills/sk-design/**` (beyond the six planned README edits) are not edited by this planning pass
  - **Evidence required**: Scoped status/diff confirms no other path was touched during this authoring pass.
  - **Evidence**: `git status --short` for the parent packet and `.opencode/skills/sk-design` shows only the six README edits (this phase's scope) plus pre-existing uncommitted content from earlier packet phases (002-007); no sibling phase folder or `external/**`/`research/**` path was touched by this phase.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-06.
**Verified By**: claude-sonnet-5 (independent verification pass, re-ran every cited command and re-read every cited file live).
**Gate Status**: CLOSED. All Phase 009 P0/P1/P2 items have real evidence: `validate_document.py --type readme` reports zero issues for all six edited files, `parent-skill-check.cjs` exits 0 with 0 warnings, and every cited path resolves on disk.

<!-- /ANCHOR:summary -->
