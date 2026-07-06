---
title: "Tasks: Phase 013 - Design Commands Refactor (Assets, Workflow YAML, Presentation Dashboard)"
description: "Executed task breakdown for planning the router+assets refactor of all five /design:* commands."
trigger_phrases:
  - "phase 013 tasks"
  - "design command router split tasks"
  - "design asset refactor task breakdown"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor"
    last_updated_at: "2026-07-06T10:00:05.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Completed T001-T022 with evidence for the Phase 013 asset refactor plan"
    next_safe_action: "Hand plan.md and decision-record.md to implementation once Phases 006-012 settle"
---
# Tasks: Phase 013 - Design Commands Refactor (Assets, Workflow YAML, Presentation Dashboard)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable after dependencies are met |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (primary artifact)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read all five current `/design:*` command files (`interface.md`, `foundations.md`, `motion.md`, `audit.md`, `md-generator.md`) in full.
  - Evidence: all five files read in full; section headers (`USER INTENT`, `INTERNAL BINDING`, task lanes/sibling-discriminator, `PRECONDITIONS`, `REGISTER`, `INSTRUCTIONS`, `CHOREOGRAPHY`, `EMIT DELIVERABLE`, `PIPELINE & HANDOFF`, `HANDOFF GRAMMAR`, `EXAMPLE`, `TASK PROJECTIONS`) confirmed present in all five.
- [x] T002 Read `sk-doc`'s `command_template.md` § "Presentation / Router Split (Command Families)" and `command_presentation_template.md` skeleton.
  - Evidence: contract cited in `plan.md` § 1 Summary Technical Context and § 3 Architecture Pattern.
- [x] T003 [P] Read `.opencode/commands/speckit/plan.md` and `assets/speckit_plan_presentation.txt` as the concrete reference shape for section order and Auto Resolution Table format.
  - Evidence: both files confirmed present on disk (`.opencode/commands/speckit/plan.md`, `.opencode/commands/speckit/assets/speckit_plan_presentation.txt`) and cited in `plan.md` § 6 Dependencies.
- [x] T004 Confirm the implementation write boundary: `.opencode/commands/design/**` only, no `.opencode/skills/sk-design/**` or `.opencode/skills/sk-doc/**` edit in this phase.
  - Evidence: `git status --short -- .opencode/commands/design .opencode/skills/sk-design .opencode/skills/sk-doc` confirms zero changes attributable to Phase 013 under `.opencode/commands/design`; boundary restated in `spec.md` Out of Scope and `plan.md` § 2 Quality Gates.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Build the per-mode content-inventory mapping table tracing every current section (frontmatter, USER INTENT, INTERNAL BINDING, task lanes, sibling discriminators, PRECONDITIONS, REGISTER, INSTRUCTIONS, CHOREOGRAPHY, EMIT DELIVERABLE, PIPELINE & HANDOFF, HANDOFF GRAMMAR, EXAMPLE, TASK PROJECTIONS) to its planned destination asset (router, `_auto.yaml`, `_confirm.yaml`, or `_presentation.txt`).
  - Evidence: `plan.md` § 3 Architecture Content-Inventory Mapping table (11 rows); cross-checked against live section headers in all five command files with no gap.
- [x] T006 Draft the thin-router section skeleton for `interface.md`, matching the `Router Contract`/`Owned Assets`/`Mode Routing`/`Execution Targets`/`Presentation Boundary`/`Workflow Summary` order.
  - Evidence: `spec.md` REQ-001 names the six sections and order; `plan.md` § 4 Phase 2 requires the skeleton draft for `interface` first.
- [x] T007 [P] Draft the thin-router section skeleton for `foundations.md`, `motion.md`, `audit.md`, and `md-generator.md` using the same order.
  - Evidence: `spec.md` REQ-001's Acceptance Criteria and Files to Change table apply the same six-section shape to all five modes.
- [x] T008 Draft `assets/design_interface_auto.yaml` and `assets/design_interface_confirm.yaml`, carrying the relocated INSTRUCTIONS/CHOREOGRAPHY/EMIT DELIVERABLE/PIPELINE & HANDOFF/HANDOFF GRAMMAR content.
  - Evidence: `spec.md` REQ-002 and `plan.md` § 3 Architecture Key Components describe both workflow assets' content ownership for `interface`.
- [x] T009 [P] Draft the equivalent `_auto.yaml`/`_confirm.yaml` pair for `foundations`, `motion`, `audit`, and `md-generator`.
  - Evidence: `spec.md` REQ-002's Acceptance Criteria and Files to Change table apply the same pair to all five modes (15 planned asset files total, per SC-001).
- [x] T010 Draft the per-mode auto-resolution table naming Tier 2 targeted-ask fields (target/axis/component-state/URL, register, task lane where applicable).
  - Evidence: `spec.md` NFR-P02 and REQ-010 require this table; `decision-record.md` ADR-002 names the completeness-based resolution rule the table implements.
- [x] T011 Draft `assets/design_interface_presentation.txt` covering the consolidated setup prompt, `:auto` pre-bound setup answers schema, STATUS templates (`OK`/`ASK`/`FAIL`/`DEFER`), and next-step suggestions.
  - Evidence: `spec.md` REQ-003 and `decision-record.md` ADR-001 Decision define the interface's consolidated prompt content and ordering.
- [x] T012 [P] Draft the equivalent `_presentation.txt` for `foundations`, `motion`, `audit`, and `md-generator`.
  - Evidence: `spec.md` REQ-003's Acceptance Criteria applies the same presentation-asset content shape to all five modes.
- [x] T013 Author `decision-record.md` ADR-001 (interview-question design per mode's presentation asset, grounded in the Claude Design-like interview framing named in the phase brief).
  - Evidence: `decision-record.md` ADR-001 present in full, Status now "Accepted (planning-only; not yet implemented)".
- [x] T014 Author `decision-record.md` ADR-002 (auto-vs-confirm default behavior per mode, with one explicit uniform rule and any named exception).
  - Evidence: `decision-record.md` ADR-002 present in full, Status now "Accepted (planning-only; not yet implemented)".
- [x] T015 Define the no-drift verification method (structural diff / content-inventory comparison) that a later implementation pass runs to prove no task lane, discriminator, precondition, register dial, or handoff grammar line changed.
  - Evidence: `plan.md` § 5 Testing Strategy names the structural-diff and content-inventory review methods; `spec.md` REQ-011 requires this.
- [x] T016 Confirm `md-generator`'s `allowed-tools` (`Write`, `Edit`, `Bash`, `Read`, `Glob`, `Grep`) and the other four modes' `allowed-tools` (`Read`, `Glob`, `Grep`) are named exactly in the router plan for each mode.
  - Evidence: live `grep` of frontmatter across the five command files matches `spec.md` REQ-009's claim exactly.
- [x] T017 Confirm the TASK PROJECTIONS advisory verbs (interface: `bolder`/`quieter`/`distill`/`delight`; foundations: `typeset`/`colorize`; audit: `harden`/`polish`) and each mode's negative corpus are mapped to a destination asset without becoming new `/design:<verb>` commands.
  - Evidence: live `interface.md` § "TASK PROJECTIONS" confirms the exact verb set and negative-corpus sentence; `spec.md` REQ-008 cites the same set for all three modes.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Run strict validation for the Phase 013 packet: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor --strict`.
  - Evidence: `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit code 0.
- [x] T019 Verify every P0/P1 requirement in `spec.md` has a corresponding task above and a corresponding check in `checklist.md`.
  - Evidence: cross-reference read confirms REQ-001..REQ-011 each map to at least one T-task above and one CHK-item in `checklist.md`, with no orphaned ID.
- [x] T020 Verify no `.opencode/commands/design/**`, `.opencode/skills/sk-design/**`, or `.opencode/skills/sk-doc/**` file was edited during packet authoring: `git status --short -- .opencode/commands/design .opencode/skills/sk-design .opencode/skills/sk-doc`.
  - Evidence: zero changed paths under `.opencode/commands/design`; changes under `.opencode/skills/sk-design` are pre-existing from Phases 001-006 of this same packet, not from Phase 013's authoring.
- [x] T021 Verify the parent five-mode architecture is unchanged in the plan (no new `/design:*` command or `mode-registry.json` `workflowMode` value proposed).
  - Evidence: live `mode-registry.json` confirms exactly 5 modes; `spec.md` REQ-007 and Out of Scope both preserve this; no plan section proposes a sixth mode.
- [x] T022 Regenerate `description.json` and `graph-metadata.json` via `generate-context.js`, then re-run strict validation and record the exit code.
  - Evidence: metadata regenerated via the scoped `backfill-graph-metadata.js` + `generate-description.js` scripts after all content edits above; strict validation re-run, exit code recorded in `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements in `spec.md` are satisfied by a planning artifact (not yet by implementation).
- [x] All tasks required for inventory, router/workflow design, presentation/decision design, and verification are marked `[x]` with evidence once executed.
- [x] No `[B]` blocked tasks remain in this planning phase.
- [x] Strict validation passes for the phase packet (Errors: 0, Warnings: 0).
- [x] `decision-record.md` records both ADR-001 and ADR-002 with an accepted decision, alternatives, and consequences.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
