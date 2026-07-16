---
title: "Tasks: generation and cleanup"
description: "Task breakdown for the G1-G4 + A-W4/A-G2 generation-and-cleanup phase, ordered A-W4 schema standardization then G1 generator + --check gate then G2 command-local fixes then A-G2 deep-router slimming then G3 hint budget then G4 ergonomics canon then the full gate set. All tasks open; nothing built yet."
status: in_progress
trigger_phrases:
  - "generation cleanup tasks"
  - "command router generator tasks"
  - "A-W4 table standardization"
  - "G4 ergonomics canon tasks"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation/005-generation-and-cleanup"
    last_updated_at: "2026-07-16T16:00:00Z"
    last_updated_by: "claude"
    recent_action: "Materialized Level-3 doc set for the generation-and-cleanup phase"
    next_safe_action: "Standardize the OWNED ASSETS and EXECUTION TARGETS tables (A-W4) first"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-command/assets/command_contract.json"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
      - ".opencode/commands/scripts/validate-command-references.cjs"
---
# Tasks: generation and cleanup

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) {deps: T###}`. All tasks are currently `[ ]` — nothing is built yet.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M1 Uniform tables | T001-T003 | Day 1 |
| M2 Generator live | T004-T007 | Day 2 |
| M3 Command-local clean | T008-T011 | Day 2 EOD |
| M4 Routers slimmed | T012-T015 | Day 3 AM |
| M5 Canon + gate green | T016-T024 | Day 3 EOD |

<!-- /ANCHOR:milestones -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### A-W4 Schema Standardization (REQ-002, lands before the generator)
- [ ] T001 Standardize the OWNED ASSETS table to `| Purpose | Asset |` across all families (`.opencode/commands/**`)
- [ ] T002 Standardize the EXECUTION TARGETS table to `| Mode | Target |` across all families (`.opencode/commands/**`) {deps: T001}
- [ ] T003 Reconcile the create family's divergent tables to the `command_router_template.md` shapes and confirm a single uniform parse target (`.opencode/commands/create/*.md`) {deps: T002}

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### G1 Generator + `--check` drift gate (REQ-001)
- [ ] T004 Scaffold `generate-command-routers.cjs` as a sibling to `sync-prompts.cjs` (`.opencode/skills/system-spec-kit/scripts/codex/generate-command-routers.cjs`) {deps: T003}
- [ ] T005 Implement `buildExpectedSpans()` reading `command_contract.json` for the five contract-derivable spans (argument-hint, OWNED ASSETS, EXECUTION TARGETS, MODE ROUTING, PRESENTATION BOUNDARY) {deps: T004}
- [ ] T006 [P] Implement section-scoped write for the five spans (no whole-file render) {deps: T005}
- [ ] T007 Implement the `--check` span-diff gate; confirm clean on the conformant tree and failing on a staled committed span {deps: T006}

### G2 Command-local contract fixes (REQ-003)
- [ ] T008 Repair the `deep/research.md` timeout claim to match the contract (`.opencode/commands/deep/research.md`) {deps: T007}
- [ ] T009 [P] Repair the `memory/save.md` hint / fallback text to match the contract (`.opencode/commands/memory/save.md`) {deps: T007}
- [ ] T010 [P] Repair the create-family `.txt` presentation-ownership labels (`.opencode/commands/create/*_presentation.txt`) {deps: T007}
- [ ] T011 Confirm the phase-003 semantic checks (gate-obligation, mode-completeness, reference coverage) and the generator span-diff pass without exceptions for the three fixed files {deps: T008, T009, T010}

### A-G2 Deep-router ownership slimming (REQ-004)
- [ ] T012 Snapshot the current `deep/*` dispatch behavior as the behavior-preserving baseline {deps: T007}
- [ ] T013 Move display-box prose the PRESENTATION BOUNDARY assigns to an asset out of the router into its asset file (`.opencode/commands/deep/*.md`, deep asset files) {deps: T012}
- [ ] T014 [P] Move autonomous-directive prose the boundary assigns to an asset into its asset file {deps: T012}
- [ ] T015 Confirm the slimmed routers keep gates, binding, mode-selection, and summary, and match the snapshot (behavior-preserving) {deps: T013, T014}

### G3 Hint-budget WARN + canon (REQ-005)
- [ ] T016 Add the soft `argument-hint` ≤140-char budget as a validator WARN (not hard-fail) to `validate_document.py` (`.opencode/skills/sk-doc/shared/scripts/validate_document.py`)
- [ ] T017 Confirm over-budget hints warn (including `speckit/plan` at 511 chars) and conformant hints stay silent {deps: T016}
- [ ] T018 [P] Wire the principle "hint summarizes, EXECUTION TARGETS enumerates" into `create-command/SKILL.md` Step 6 and `command_template.md`

### G4 Command ergonomics canon (REQ-006)
- [ ] T019 Canonize loader-gating frontmatter + an agent-existence check in `create-command/SKILL.md` Steps 6/9/11 (`.opencode/skills/sk-doc/create-command/SKILL.md`)
- [ ] T020 [P] Document/deprecate the `User request: $ARGUMENTS` raw-echo idiom (copied into 14 files) in the ergonomics canon
- [ ] T021 [P] Canonize the template self-sufficiency invariant (each variant authors from its template alone)
- [ ] T022 Add the ergonomics WARN checks to `validate_document.py` / `validate-command-references.cjs` and surface them through the `sk-doc-command.cjs` adapter; wire the create-quality-control gate {deps: T019}
- [ ] T023 Record the subaction-dispatch `routing_source` naming sub-item as DEFERRED to phase 004 (field undefined for all families); do not enforce here

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T024 Run the full gate set — `generate-command-routers.cjs --check` clean, phase-003 semantic checks clean, `validate_document.py` WARN checks silent on conformant hints, and `validate.sh --strict` on this folder Errors:0 Warnings:0 — then reconcile the doc set to the built state {deps: T011, T015, T017, T022}

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `generate-command-routers.cjs --check` clean on the conformant tree; staled span fails
- [ ] OWNED ASSETS / EXECUTION TARGETS tables uniform; generator parses all families
- [ ] Three command-local mismatches pass the phase-003 checks and the span-diff
- [ ] Deep routers slimmed, snapshot-verified behavior-preserving
- [ ] G3/G4 WARN checks wired and silent on conformant input; canon in Steps 6/9/11 + quality-control gate
- [ ] `routing_source` sub-item recorded as deferred to phase 004
- [ ] `checklist.md` fully verified; all ADRs status: Accepted

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
- **Parent**: `system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation`
- **Predecessor**: `003-semantic-validation-and-fixtures` (dependency spine 000 → 001 → 003 → 005)

<!-- /ANCHOR:cross-refs -->
