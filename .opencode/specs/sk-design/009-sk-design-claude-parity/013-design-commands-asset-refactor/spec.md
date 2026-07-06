---
title: "Phase 013 - Design Commands Refactor (Assets, Workflow YAML, Presentation Dashboard)"
description: "Level 3 phase packet planning the router+assets refactor of all five /design:* commands into thin routers plus owned auto/confirm workflow YAML and a presentation dashboard, mirroring the speckit/create/deep command family pattern."
trigger_phrases:
  - "design commands asset refactor"
  - "design command router split"
  - "design presentation dashboard"
  - "design auto confirm workflow"
  - "sk-design command family parity"
  - "phase 013 design commands"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored the Phase 013 planning packet for the design command router+assets refactor."
    next_safe_action: "Confirm Phases 006-012 are settled before starting implementation."
---
# Feature Specification: Phase 013 - Design Commands Refactor (Assets, Workflow YAML, Presentation Dashboard)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 013 plans the refactor of all five `/design:*` commands (`interface`, `foundations`, `motion`, `audit`, `md-generator`) from flat, richly-developed single-file commands into the router+assets pattern already proven by the `speckit`, `create`, and `deep` command families: a thin `<mode>.md` router plus an owned `assets/design_<mode>_auto.yaml` (autonomous workflow), `assets/design_<mode>_confirm.yaml` (interactive workflow), and `assets/design_<mode>_presentation.txt` (the presentation/dashboard source of truth). This is a planning-only packet: no `.opencode/commands/design/**` file is edited during this phase; the packet defines what will be built, why, and how it will be verified.

**Key Decisions**: Split each command into a thin router plus three owned assets per `sk-doc`'s `command_template.md` § "Presentation / Router Split (Command Families)" contract; keep every existing task lane, sibling discriminator, precondition, register dial, choreography step, deliverable contract, and handoff grammar line unchanged in content and relocate it verbatim; add the `:auto` / `:confirm` interaction dimension net-new, following `.opencode/commands/speckit/plan.md` + `speckit_plan_presentation.txt` as the reference shape.

**Critical Dependencies**: Phases 006-012 of this packet being settled (the commands are the user-facing surface wrapping the whole optimized `sk-design` system), the `sk-doc` command template and presentation-template contracts, and the five current `/design:*` command files as the sole source of truth for behavior to preserve.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Planned / Not Started |
| **Created** | 2026-07-06 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Estimated LOC** | Documentation packet only; implementation LOC not estimated in this phase packet |
<!-- /ANCHOR:metadata -->

---

## Phase Navigation

| Link | Target |
|------|--------|
| **Parent Spec** | ../spec.md |
| **Predecessor Phase** | ../012-routing-benchmark-rigor/spec.md |
| **Successor Phase** | None (last phase in this packet, pending any further extension) |

> **Forward-reference note**: at the time this Phase 013 packet was authored, phases 006-012 had not yet been created under this parent packet (the parent `spec.md` Phase Documentation Map still lists only 001-005). The Predecessor Phase link above is recorded per explicit task instruction as a forward reference to the phase that will immediately precede this one once the intervening phases are authored. This packet does not depend on reading 006-012 content to plan its own scope; it depends on those phases being **settled** (their sk-design behavior finalized) before Phase 013 **implementation** begins, because this phase's commands wrap the whole optimized system those phases produce.

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The five `/design:*` commands (`interface`, `foundations`, `motion`, `audit`, `md-generator`) are currently flat, single-file commands with no `assets/` folder. Each file mixes routing logic (mode binding, sibling discriminators, preconditions, register handling) with presentation content (Ask-first question wording, STATUS result templates, HANDOFF GRAMMAR, next-step suggestions) in one markdown body. This is the same shape the `speckit`, `create`, and `deep` command families moved away from, and it means the design commands cannot yet offer the same `:auto` (autonomous, defaults-resolved) versus `:confirm` (interactive, consolidated setup prompt) interaction surface those families offer, and any presentation wording change requires editing routing-bearing files.

### Purpose

Plan a behavior-preserving refactor that relocates each command's existing content into the router+assets pattern: a thin `<mode>.md` router (mode routing, owned-assets table, Presentation Boundary section, no inline presentation content) plus `assets/design_<mode>_auto.yaml`, `assets/design_<mode>_confirm.yaml`, and `assets/design_<mode>_presentation.txt`, modeled on `.opencode/commands/speckit/plan.md` + `speckit_plan_presentation.txt`. The plan must preserve every current command's task lanes, sibling discriminators, preconditions, register handling, choreography, and handoff grammar as relocated content, not rewritten content, while adding the `:auto`/`:confirm` interaction dimension and a consolidated interview-style setup prompt per mode.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Plan the router+assets split for all five `/design:*` commands: `interface`, `foundations`, `motion`, `audit`, `md-generator`.
- Plan one thin router file per mode (`Router Contract`, `Owned Assets`, `Mode Routing`, `Execution Targets`, `Presentation Boundary`, `Workflow Summary` sections, matching the `.opencode/commands/speckit/plan.md` reference shape).
- Plan one `assets/design_<mode>_auto.yaml` and one `assets/design_<mode>_confirm.yaml` per mode that carry today's `INSTRUCTIONS`, `CHOREOGRAPHY`, `EMIT DELIVERABLE`, `PIPELINE & HANDOFF`, and `HANDOFF GRAMMAR` content as executable workflow steps.
- Plan one `assets/design_<mode>_presentation.txt` per mode holding the consolidated setup prompt, `:auto` pre-bound setup answers and auto-resolution table, dashboard/checkpoint layout (where applicable), STATUS result templates, and next-step suggestions.
- Author a `decision-record.md` covering (a) the interview-question design for each mode's presentation asset and (b) the `:auto` versus `:confirm` default behavior per mode.
- Define the verification approach that proves the split changes no observable command behavior (task lanes, sibling discriminators, preconditions, register dials, deliverable contracts, handoff grammar) beyond the added interaction surface.

### Out of Scope

- Any edit to `.opencode/commands/design/**`, `.opencode/skills/sk-design/**`, or `.opencode/skills/sk-doc/**` content. This phase is planning-only; implementation is a later, separately-approved pass.
- Work belonging to Phases 006-012 of this parent packet; this phase depends on those phases being settled but does not perform, re-scope, or re-plan their content.
- Adding a sixth public design mode or changing the five-mode `mode-registry.json` taxonomy.
- Changing any command's deliverable contract fields, sibling-discriminator boundaries, register dial set, or `HANDOFF GRAMMAR` semantics. The split relocates content; it does not redesign command behavior.
- Editing the parent root (`../spec.md`, `../description.json`, `../graph-metadata.json`), sibling phase folders, `../external/**`, or `../research/**`, except automatic parent metadata touches performed by the Spec Kit save tooling.

### Files to Change

> **Planning note**: no file below is created or edited during Phase 013 planning. This table documents the exact paths the later, separately-approved implementation phase is expected to touch.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/commands/design/interface.md` | Refactor (planned) | Implementation follow-up | Reduce to thin router: Router Contract, Owned Assets, Mode Routing, Execution Targets, Presentation Boundary, Workflow Summary |
| `.opencode/commands/design/foundations.md` | Refactor (planned) | Implementation follow-up | Same thin-router shape as `interface.md` |
| `.opencode/commands/design/motion.md` | Refactor (planned) | Implementation follow-up | Same thin-router shape as `interface.md` |
| `.opencode/commands/design/audit.md` | Refactor (planned) | Implementation follow-up | Same thin-router shape as `interface.md` |
| `.opencode/commands/design/md-generator.md` | Refactor (planned) | Implementation follow-up | Same thin-router shape as `interface.md`; keeps `Write`, `Edit`, `Bash` in `allowed-tools` for its extraction pipeline |
| `.opencode/commands/design/assets/` | Create (planned) | Implementation follow-up | New directory; does not exist today |
| `.opencode/commands/design/assets/design_<mode>_auto.yaml` (one per mode: `interface`, `foundations`, `motion`, `audit`, `md-generator`) | Create (planned) | Implementation follow-up | Autonomous workflow YAML per mode carrying today's INSTRUCTIONS/CHOREOGRAPHY/EMIT DELIVERABLE/PIPELINE & HANDOFF/HANDOFF GRAMMAR content |
| `.opencode/commands/design/assets/design_<mode>_confirm.yaml` (one per mode) | Create (planned) | Implementation follow-up | Interactive workflow YAML per mode; shows the consolidated setup prompt before applying the same mode logic |
| `.opencode/commands/design/assets/design_<mode>_presentation.txt` (one per mode) | Create (planned) | Implementation follow-up | Presentation source of truth per mode: setup prompt, auto-resolution table, STATUS result templates, next-step suggestions |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor/*.md` | Author (this phase) | 013 | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor/description.json` | Generate (this phase) | 013 | Memory discovery metadata, generated by `generate-context.js` |
| `.opencode/specs/sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor/graph-metadata.json` | Generate (this phase) | 013 | Graph traversal metadata, generated by `generate-context.js` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Plan a thin router for each of the five `/design:*` commands | Each planned router names exactly the `Router Contract`, `Owned Assets`, `Mode Routing`, `Execution Targets`, `Presentation Boundary`, and `Workflow Summary` sections, matching `.opencode/commands/speckit/plan.md`'s section order |
| REQ-002 | Plan `assets/design_<mode>_auto.yaml` and `assets/design_<mode>_confirm.yaml` for each mode | Each planned pair accounts for the current command's `INSTRUCTIONS`, `CHOREOGRAPHY`, `EMIT DELIVERABLE`, `PIPELINE & HANDOFF`, and `HANDOFF GRAMMAR` content as workflow steps, with no content dropped |
| REQ-003 | Plan `assets/design_<mode>_presentation.txt` for each mode | Each planned presentation asset accounts for the consolidated setup prompt, `:auto` pre-bound setup answers block, auto-resolution table, STATUS result templates (`OK`/`ASK`/`FAIL`/`DEFER`), and the next-step suggestion table drawn from the mode's existing `HANDOFF GRAMMAR` and `PIPELINE & HANDOFF` sections |
| REQ-004 | Preserve full behavioral parity in the plan | The plan states, per mode, that every task lane (e.g. interface's `direction`/`directions`/`redesign`/`preflight`/`handoff`/`aesthetic`), sibling discriminator, precondition, register dial (`register`, plus each mode's additional dials), choreography step, deliverable contract field, and handoff grammar line is relocated verbatim, not rewritten |
| REQ-005 | Author the interview-question design decision | `decision-record.md` documents what each mode's consolidated setup prompt asks (primary input, register posture, task lane/mode hint where applicable, execution-mode selection), citing the Claude Design-like interview framing named in this packet's task brief |
| REQ-006 | Author the auto-vs-confirm default decision | `decision-record.md` documents the default execution mode per command when no `:auto`/`:confirm` suffix is given, and the rule for when `:auto` is safe to use without prompting |
| REQ-007 | Keep the parent five-mode architecture unchanged | The plan does not add, remove, or rename a public `/design:*` command or a `mode-registry.json` `workflowMode` entry |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Preserve TASK PROJECTIONS advisory verbs | The plan states where each mode's advisory transform verbs (interface: `bolder`/`quieter`/`distill`/`delight`; foundations: `typeset`/`colorize`; audit: `harden`/`polish`) relocate to, and reaffirms the existing negative corpus (no verb becomes a new `/design:<verb>` command) |
| REQ-009 | Preserve `allowed-tools` and `argument-hint` accuracy | The plan states the exact frontmatter `allowed-tools` and `argument-hint` each planned router keeps, matching the current command's tool/argument surface (e.g. `md-generator.md` keeps `Write`, `Edit`, `Bash`; the other four keep `Read`, `Glob`, `Grep`) |
| REQ-010 | Document a per-mode auto-resolution table | `plan.md` or the presentation-asset plan names, per mode, which setup inputs are auto-resolvable defaults versus Tier 2 targeted-ask fields under `:auto`, mirroring `speckit_plan_presentation.txt`'s Auto Resolution Table shape |
| REQ-011 | Define the no-drift verification approach | `plan.md` names a concrete verification method (structural diff / content-inventory comparison) that a later implementation pass can run to prove no task lane, discriminator, precondition, register dial, or handoff grammar line was altered during relocation |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The plan accounts for exactly 5 thin routers and 15 new asset files (3 per mode x 5 modes) with no gaps against the current 5 flat command files.
- **SC-002**: Every task lane, sibling discriminator, precondition, register dial, choreography step, deliverable contract field, and handoff grammar line named in the five current command files is mapped to a specific destination asset in `plan.md`.
- **SC-003**: `decision-record.md` documents both the interview-question design and the auto-vs-confirm default behavior, each with an accepted decision, alternatives considered, and consequences.
- **SC-004**: The plan keeps the public taxonomy at exactly five `/design:*` commands and five `mode-registry.json` `workflowMode` values; no new public command or mode is introduced.
- **SC-005**: `checklist.md` and `tasks.md` give a later implementation pass an executable, evidence-oriented path to strict validation without requiring further design decisions.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 006-012 settled | Command wording or proof fields could reference sk-design behavior that has not stabilized yet | Treat Phase 013 implementation as blocked until the predecessor phases in this packet are settled; this planning phase only depends on their existence, not their content |
| Dependency | `sk-doc` `command_template.md` § "Presentation / Router Split" and `command_presentation_template.md` | The router+assets shape must match the canonical contract other command families already use | Cite the exact section and skeleton file in `plan.md`; use `.opencode/commands/speckit/plan.md` + `speckit_plan_presentation.txt` as the concrete reference shape |
| Risk | Behavior drift during relocation | A task lane, precondition, or handoff grammar line is paraphrased instead of relocated, silently changing command behavior | Require a content-inventory mapping table in `plan.md` and a structural-diff verification task in `tasks.md`/`checklist.md` |
| Risk | Inconsistent `:auto`/`:confirm` default across the five modes | Users get a different default interaction experience per mode without a documented reason | Require `decision-record.md` ADR-002 to state one explicit default rule that applies uniformly, with any per-mode exception named and justified |
| Risk | `md-generator`'s wider tool surface (`Write`, `Edit`, `Bash`) gets narrowed by mistake during the router split | The extraction pipeline could lose write/execute capability | Name the exact `allowed-tools` list to preserve per mode in REQ-009 and verify it in `checklist.md` |
| Risk | Forward-referenced predecessor phase (`012-routing-benchmark-rigor`) does not yet exist on disk | A reader could mistake the reference for a broken link | State the forward-reference explicitly in the Phase Navigation note above; the phase-links validator rule only checks a parent folder's own children, not a leaf phase's own predecessor text, so this does not block strict validation of this folder |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The planned router must stay small enough that loading it never requires reading all three owned assets before mode resolution; only the selected workflow YAML and the presentation asset are read per invocation.
- **NFR-P02**: The planned `:auto` path must resolve as many setup fields as possible from `$ARGUMENTS` and existing defaults before falling back to a targeted ask, so autonomous runs stay non-interactive whenever the required input is already present.

### Security

- **NFR-S01**: Presentation assets must not embed secrets, credentials, or environment-specific paths beyond the existing repository-relative references already present in the current command files.
- **NFR-S02**: The plan must not weaken any command's `allowed-tools` boundary; `md-generator`'s `Write`/`Edit`/`Bash` surface and the other four modes' read-only `Read`/`Glob`/`Grep` surface must be preserved exactly.

### Reliability

- **NFR-R01**: Every planned STATUS line (`STATUS=OK`, `STATUS=ASK`, `STATUS=FAIL`, `STATUS=DEFER`) must remain deterministic and traceable to the same conditions that produce it today.
- **NFR-R02**: The planned auto-vs-confirm split must not introduce a state where a command can silently proceed on a guessed target, axis, component-state, or URL; every current Ask-first / Cannot-run condition must have an equivalent gate in both the `:auto` and `:confirm` workflow assets.

---

## 8. EDGE CASES

### Data Boundaries

- No suffix given and `$ARGUMENTS` already supplies the full required input (e.g. `/design:interface dashboard-shell --mode redesign`): the plan must state whether this runs autonomously without a prompt or triggers the consolidated setup prompt once.
- `:auto` given with a required input missing (e.g. `/design:md-generator :auto` with no URL): the plan must route to the Auto Fail-Fast Display pattern, not a silent no-op.
- `:confirm` given with a fully-specified `$ARGUMENTS`: the plan must state whether the consolidated prompt still shows once for confirmation or is skipped when nothing is ambiguous.

### Error Scenarios

- A router references an asset file that does not exist yet at implementation time: the plan's verification approach must catch this before the phase can be marked complete.
- A relocated task lane or discriminator loses its original wording during the move: the plan's content-inventory mapping and structural-diff verification must be able to detect the drift.
- Two of the three new assets for one mode disagree on a STATUS field name or a required deliverable field: the plan must require a single source of truth (the presentation asset for display fields, the workflow YAML for execution fields) to prevent divergence.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Five commands, five thin routers, fifteen new asset files, one new `assets/` directory, one decision record with two ADRs |
| Risk | 18/25 | Behavior-preservation risk during relocation, last-phase dependency on Phases 006-012, public user-facing surface |
| Research | 14/20 | Reference shape already established by `speckit`/`create`/`deep`; lower research burden than an external-source mapping phase |
| Multi-Agent | 4/15 | Single leaf execution for packet creation; a later implementation phase may use reviewers |
| Coordination | 14/15 | Depends on every predecessor phase in this packet being settled; is the final phase wrapping the whole optimized system |
| **Total** | **70/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Relocation silently rewrites a task lane, discriminator, or handoff grammar line | H | M | Require a content-inventory mapping table in `plan.md` plus a structural-diff verification task |
| R-002 | The five modes end up with inconsistent `:auto`/`:confirm` default behavior without a documented reason | M | M | Require `decision-record.md` ADR-002 to state one explicit, uniform default rule with named exceptions |
| R-003 | `md-generator`'s wider tool surface is narrowed during the router split | H | L | Name the exact `allowed-tools` list to preserve per mode and verify it in `checklist.md` |
| R-004 | Implementation starts before Phases 006-012 are settled, coupling this user-facing surface to unstable sk-design behavior | M | M | State the dependency explicitly in Risks & Dependencies and in `plan.md` Dependencies; block implementation kickoff on operator confirmation |
| R-005 | The new presentation asset introduces prompt wording that diverges from "as experienced in Claude Design" framing named by the user | M | M | Require `decision-record.md` ADR-001 to ground the interview-question design in that framing with an explicit rationale |

---

## 11. USER STORIES

### US-001: Design Command User Keeps Identical Behavior (Priority: P0)

**As a** user of `/design:interface`, `/design:foundations`, `/design:motion`, `/design:audit`, or `/design:md-generator`, **I want** the command to behave exactly as it does today, **so that** the router+assets refactor does not change my task lanes, register handling, or deliverable output.

**Acceptance Criteria**:
1. Given a fully-specified invocation that works today, When the planned router+assets split is later implemented, Then the same STATUS line, deliverable fields, and handoff grammar are produced.
2. Given a missing required input, When the command runs after the split, Then it emits the same Ask-first question wording as today, now sourced from the presentation asset.
3. Given the current negative corpus (no transform verb is a standalone command), When the split is implemented, Then the negative corpus still holds.

---

### US-002: Command Author Extends Presentation Without Touching Routing (Priority: P0)

**As a** command author, **I want** to change a design command's setup-prompt wording or STATUS template, **so that** I can edit one presentation asset instead of a routing-bearing file.

**Acceptance Criteria**:
1. Given a wording change is needed, When the author edits `assets/design_<mode>_presentation.txt`, Then no routing logic in `<mode>.md` needs to change.
2. Given the router is read first, When a user invokes the command, Then the router's Presentation Boundary section names exactly what lives in the presentation asset, with no inline prompt or dashboard content left in the router.

---

### US-003: Reviewer Audits the New Interaction Surface (Priority: P1)

**As a** reviewer, **I want** the interview-question design and the auto-vs-confirm default behavior documented as decisions, **so that** I can evaluate whether the new `:auto`/`:confirm` dimension is deliberate and consistent across all five modes.

**Acceptance Criteria**:
1. Given `decision-record.md` exists, When the reviewer reads ADR-001, Then the per-mode consolidated setup prompt questions are explicit and traceable to the current command's existing Ask-first and register wording.
2. Given `decision-record.md` exists, When the reviewer reads ADR-002, Then the default execution mode per command is explicit, with a stated rule rather than five independent, undocumented choices.

---

## 12. OPEN QUESTIONS

- Should the consolidated setup prompt for `md-generator` include an inline confirmation step before Playwright extraction runs, given its wider `Write`/`Edit`/`Bash` tool surface? Defer to the implementation phase's operator.
- Should `:autopilot`/`:unattended`/`--unattended` (as used by `speckit`) be added to the design command family in this same phase, or deferred to a later phase? This packet's scope brief names only `:auto`/`:confirm`; the implementation phase should confirm before adding a third mode.
- Once Phases 006-012 exist, does any of them change a command's deliverable contract fields in a way this phase's asset plan needs to absorb before implementation starts?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
