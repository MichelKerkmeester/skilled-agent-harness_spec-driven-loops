---
title: "Implementation Plan: Phase 013 - Design Commands Refactor (Assets, Workflow YAML, Presentation Dashboard)"
description: "Plan for splitting all five /design:* commands into thin routers plus owned auto/confirm workflow YAML and presentation assets, preserving current command behavior."
trigger_phrases:
  - "phase 013 plan"
  - "design command router split plan"
  - "design auto confirm workflow plan"
  - "design presentation asset plan"
importance_tier: "high"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/013-design-commands-asset-refactor"
    last_updated_at: "2026-07-06T00:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored the Phase 013 implementation plan for the design command router+assets refactor."
    next_safe_action: "Confirm Phases 006-012 are settled, then hand this plan to an implementation pass."
---
# Implementation Plan: Phase 013 - Design Commands Refactor (Assets, Workflow YAML, Presentation Dashboard)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command routers, YAML workflow assets, plain-text presentation contracts |
| **Framework** | Spec Kit Level 3 packet; `sk-doc` command_template.md "Presentation / Router Split (Command Families)" contract |
| **Storage** | File-based command package under `.opencode/commands/design/` (router files plus a new `assets/` subfolder) |
| **Testing** | Spec strict validation, content-inventory diff review, frontmatter/tool-surface parity review, structural comparison against `.opencode/commands/speckit/plan.md` reference shape |

### Overview

This phase plans, but does not implement, the relocation of all five `/design:*` commands into the router+assets pattern. Each command's routing-bearing content (mode binding, sibling discriminators, preconditions, register handling, choreography, deliverable contract, handoff grammar) moves into a thin router plus two workflow YAML assets (`_auto.yaml`, `_confirm.yaml`); each command's display-only content (Ask-first wording, STATUS templates, next-step suggestions, task-lane menus) moves into one presentation asset (`_presentation.txt`). The plan adds a net-new `:auto`/`:confirm` interaction dimension modeled on `.opencode/commands/speckit/plan.md` + `speckit_plan_presentation.txt`, while treating every other behavior as frozen content to relocate, not redesign.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phases 006-012 of this parent packet are confirmed settled by the operator before implementation begins (this planning phase itself does not require that confirmation).
- [ ] The five current `/design:*` command files are read in full and treated as the sole source of truth for behavior to preserve.
- [ ] `sk-doc`'s `command_template.md` § "Presentation / Router Split (Command Families)" and `command_presentation_template.md` are read and cited as the canonical contract.
- [ ] `.opencode/commands/speckit/plan.md` and `assets/speckit_plan_presentation.txt` are read as the concrete reference shape for a mode-based, `:auto`/`:confirm` command family.
- [ ] The implementation boundary is confirmed to permit edits only inside `.opencode/commands/design/**` (routers plus the new `assets/` folder); no `sk-design` or `sk-doc` content is touched.

### Definition of Done

- [ ] A thin router is planned for each of the five modes, matching the `Router Contract`, `Owned Assets`, `Mode Routing`, `Execution Targets`, `Presentation Boundary`, `Workflow Summary` section order.
- [ ] `assets/design_<mode>_auto.yaml` and `assets/design_<mode>_confirm.yaml` are planned for each mode, each mapped to the current command's `INSTRUCTIONS`, `CHOREOGRAPHY`, `EMIT DELIVERABLE`, `PIPELINE & HANDOFF`, and `HANDOFF GRAMMAR` content.
- [ ] `assets/design_<mode>_presentation.txt` is planned for each mode, covering the consolidated setup prompt, auto pre-bound answers, auto-resolution table, STATUS templates, and next-step suggestions.
- [ ] A content-inventory mapping table exists (see § 3 Architecture) tracing every task lane, discriminator, precondition, register dial, and handoff grammar line from its current location to its planned destination asset.
- [ ] `decision-record.md` documents both the interview-question design (ADR-001) and the auto-vs-confirm default behavior (ADR-002).
- [ ] Strict validation for this phase packet is run; the exit code is recorded in this plan's Testing Strategy evidence once implementation of the planning docs is complete.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Thin command router plus three owned assets per mode (workflow-backed command family split), matching the pattern already used by `speckit`, `create`, and `deep`.

### Key Components

- **Thin router (`<mode>.md`)**: Owns mode binding to the `sk-design` hub, the sibling-discriminator table, preconditions, the Owned Assets table, `:auto`/`:confirm` mode routing, and the Presentation Boundary section. Contains no inline prompt wording, dashboard template, or result template.
- **Autonomous workflow (`assets/design_<mode>_auto.yaml`)**: Owns the steps that load the `sk-design` hub and the mode packet, apply the mode to `$ARGUMENTS`, and return a STATUS line, resolving as much setup as possible from `$ARGUMENTS` and documented defaults before any targeted ask.
- **Interactive workflow (`assets/design_<mode>_confirm.yaml`)**: Owns the same mode-application steps as the auto workflow, but shows the consolidated setup prompt first and waits for a reply before proceeding.
- **Presentation asset (`assets/design_<mode>_presentation.txt`)**: Owns the consolidated setup prompt wording, the `:auto` pre-bound setup answers schema and auto-resolution table, the STATUS result templates (`OK`/`ASK`/`FAIL`/`DEFER`), and the next-step suggestion table (drawn from the mode's current `HANDOFF GRAMMAR` and `PIPELINE & HANDOFF` sections).
- **Content-inventory mapping**: A per-mode table (drafted in this plan, finalized during implementation) that lists every current section of the flat command file and its planned destination asset, used as the basis for the no-drift verification task.

### Data Flow

A user or the `sk-design` hub invokes `/design:<mode>` with an optional `:auto`/`:confirm` suffix. The thin router resolves the interaction mode (from the suffix, or from the presentation contract's startup rule when no suffix is given), then loads the matching workflow YAML. The workflow YAML reads `.opencode/skills/sk-design/SKILL.md` and the mode's own `SKILL.md`, applies the mode to the resolved input, and returns a STATUS line whose wording is sourced from the presentation asset. No workflow step is defined inside the router or the presentation asset; no display wording is defined inside the workflow YAML.

### Content-Inventory Mapping (Planned, Per Mode)

| Current Section (flat command file) | Planned Destination |
|---------------------------------------|----------------------|
| Frontmatter (`description`, `argument-hint`, `allowed-tools`) | Thin router frontmatter, values unchanged |
| `## 1. USER INTENT` | Thin router body |
| `## 2. INTERNAL BINDING` | Thin router body (Router Contract / Mode Routing) |
| `## 3`/`## 4` Task lanes and `WHEN TO USE THIS, NOT A SIBLING` | Thin router body (sibling-discriminator table stays routing logic, not presentation) |
| `PRECONDITIONS` (Requires/Ask-first/Cannot-run/Escalate/Route instead) | Split: the gate conditions stay in the router or workflow YAML; the exact Ask-first question wording moves to the presentation asset's Consolidated Prompt Template |
| `REGISTER` | Split: the dial names and posture rule stay in the router; the exact Ask-first register question wording moves to the presentation asset |
| `INSTRUCTIONS` (Step 1/Step 2) | `assets/design_<mode>_auto.yaml` and `assets/design_<mode>_confirm.yaml` (workflow steps); the STATUS line templates move to the presentation asset |
| `CHOREOGRAPHY` | Both workflow YAML assets, as ordered steps |
| `EMIT DELIVERABLE` | Both workflow YAML assets (field contract); the display wording of the result moves to the presentation asset |
| `PIPELINE & HANDOFF` and `HANDOFF GRAMMAR` | Presentation asset's Next-Step Suggestions section, plus the workflow YAML's terminal output step |
| `EXAMPLE` | Presentation asset (illustrative usage) or router (kept as a routing example); finalized during implementation |
| `TASK PROJECTIONS` and negative corpus | Workflow YAML (advisory verb handling) and presentation asset (menu wording), per mode |

This table is the basis for the structural-diff verification task in § 5 Testing Strategy and the corresponding checklist items.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action (Planned) | Verification |
|---------|--------------|--------|--------------|
| Phase 013 spec packet | Planning and continuity surface | Authored Level 3 docs and generated metadata | `validate.sh <phase-root> --strict` |
| `.opencode/commands/design/interface.md` | Flat single-file command | Planned reduction to thin router | Content-inventory mapping review; no edit performed in this phase |
| `.opencode/commands/design/foundations.md` | Flat single-file command | Planned reduction to thin router | Content-inventory mapping review; no edit performed in this phase |
| `.opencode/commands/design/motion.md` | Flat single-file command | Planned reduction to thin router | Content-inventory mapping review; no edit performed in this phase |
| `.opencode/commands/design/audit.md` | Flat single-file command | Planned reduction to thin router | Content-inventory mapping review; no edit performed in this phase |
| `.opencode/commands/design/md-generator.md` | Flat single-file command | Planned reduction to thin router | Content-inventory mapping review; no edit performed in this phase |
| `.opencode/commands/design/assets/` | Does not exist | Planned new directory holding 15 asset files | Directory-existence check at implementation time |
| `sk-design` hub and five mode packets | Routing target of every design command | Unchanged by Phase 013 | Boundary review confirms no Phase 013 edit inside `.opencode/skills/sk-design/**` |

Required inventories:
- Same-class producers: the five `/design:*` commands, classified by their current tool surface (`md-generator` writes; the other four are read-only).
- Consumers of changed symbols: the `sk-design` hub's routing table and each mode's `SKILL.md`, reviewed to confirm the router split changes no load path, only file organization and the added interaction dimension.
- Matrix axes: mode, router section, workflow-YAML step, presentation-asset section, preserved dial/lane/discriminator.
- Algorithm invariant: a command's router+assets split may add an interaction-mode dimension (`:auto`/`:confirm`), but it may not change a task lane, sibling discriminator, precondition, register dial, deliverable contract field, or handoff grammar line.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Command Content Inventory
- [ ] Read all five current `/design:*` command files in full.
- [ ] Build the per-mode content-inventory mapping table (router vs. workflow YAML vs. presentation asset) at implementation-grade detail.
- [ ] Record every task lane, sibling discriminator, precondition, register dial, choreography step, deliverable field, and handoff grammar line as a named item to preserve.

### Phase 2: Router and Workflow Asset Design
- [ ] Draft the thin-router section skeleton per mode, matching `.opencode/commands/speckit/plan.md`'s section order.
- [ ] Draft `assets/design_<mode>_auto.yaml` and `assets/design_<mode>_confirm.yaml` per mode, carrying the relocated INSTRUCTIONS/CHOREOGRAPHY/EMIT DELIVERABLE/PIPELINE & HANDOFF/HANDOFF GRAMMAR content as workflow steps.
- [ ] Draft the per-mode auto-resolution table naming Tier 2 targeted-ask fields.

### Phase 3: Presentation Asset and Decision Design
- [ ] Draft `assets/design_<mode>_presentation.txt` per mode: consolidated setup prompt, pre-bound setup answers schema, STATUS templates, next-step suggestions.
- [ ] Author `decision-record.md` ADR-001 (interview-question design) and ADR-002 (auto-vs-confirm default behavior).
- [ ] Define the no-drift verification method (structural diff / content-inventory comparison) for the later implementation pass.

### Phase 4: Verification and Handoff
- [ ] Run strict spec validation for this phase packet.
- [ ] Run a placeholder scan on all authored docs.
- [ ] Confirm no `.opencode/commands/design/**`, `.opencode/skills/sk-design/**`, or `.opencode/skills/sk-doc/**` file was edited during packet authoring.
- [ ] Regenerate `description.json` and `graph-metadata.json` and confirm strict validation passes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | Required Level 3 docs and metadata | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase-root> --strict` |
| Placeholder scan | Template placeholders and sample residue | Validator output plus targeted text search if validation flags issues |
| Boundary audit | No edits outside the Phase 013 packet during packet creation | `git status --short -- .opencode/commands/design .opencode/skills/sk-design .opencode/skills/sk-doc` |
| Content-inventory review (implementation-phase) | Every relocated task lane, discriminator, precondition, register dial, and handoff grammar line traced to its destination asset | Manual reviewer pass against § 3 Architecture's mapping table |
| Structural-diff review (implementation-phase) | Confirms no observable command behavior changed beyond the added `:auto`/`:confirm` dimension | Side-by-side comparison of each current command file against its planned router + three assets |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 006-012 of this parent packet | Internal phases | Not yet authored at time of this plan | Blocks the start of Phase 013 implementation; does not block this planning phase |
| Five current `/design:*` command files | Source material | Read-only input, read in full for this plan | Blocks accurate content-inventory mapping if any file changes before implementation |
| `sk-doc` `command_template.md` and `command_presentation_template.md` | Canonical contract | Read and cited in this plan | Blocks conformance to the established router+assets shape |
| `.opencode/commands/speckit/plan.md` + `speckit_plan_presentation.txt` | Reference shape | Read and cited in this plan | Blocks a concrete section-order and Auto Resolution Table model to follow |
| `sk-design` hub and mode-registry.json | Routing contract | Preserved, unchanged | Blocks correct mode-binding wording in each planned router if the registry changes first |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase packet validation fails in a way that cannot be corrected within the packet boundary, or the operator rejects the router+assets plan before implementation begins.
- **Procedure**: Revert only the Phase 013 child folder additions, then re-run parent packet validation if parent metadata is later changed by an approved follow-up.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phases 006-012 (settled, not authored by this phase) -> Phase 013 design commands asset refactor plan
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Command Content Inventory | Five current command files, Phases 006-012 settled (for implementation, not planning) | Router and Workflow Asset Design |
| Router and Workflow Asset Design | Command Content Inventory | Presentation Asset and Decision Design |
| Presentation Asset and Decision Design | Router and Workflow Asset Design | Verification and Handoff |
| Verification and Handoff | Presentation Asset and Decision Design | Phase completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Command Content Inventory | Medium | 1-2 hours |
| Router and Workflow Asset Design | High | 3-5 hours |
| Presentation Asset and Decision Design | High | 3-5 hours |
| Verification and Handoff | Medium | 1-2 hours |
| **Total** | | **8-14 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm Phases 006-012 are settled before implementation begins.
- [ ] Confirm no parent, sibling, `sk-design`, or `sk-doc` folder is modified during packet creation.
- [ ] Confirm the planned `assets/` directory naming (`design_<mode>_auto.yaml`, `design_<mode>_confirm.yaml`, `design_<mode>_presentation.txt`) is reviewed before any implementation write.

### Rollback Procedure
1. Stop implementation if a planned asset would change a task lane, discriminator, precondition, register dial, or handoff grammar line rather than relocate it.
2. Revert the router or asset files introduced by the implementation phase.
3. Restore the prior flat command file behavior.
4. Re-run strict spec validation and any command-level verification used by the implementation.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Remove or revert the router/asset docs only; no persisted user data is involved.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Five current /design:* command files
        |
        v
Command content inventory ---> Router and workflow asset design ---> Presentation asset and decision design ---> Verification
        ^                                  |
        |                                  v
Phases 006-012 settled (implementation gate) --------> No-drift verification method
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Command content inventory | Five current command files | Content-inventory mapping table | Router and workflow asset design |
| Router and workflow asset design | Content-inventory mapping | Router skeleton, `_auto.yaml`/`_confirm.yaml` drafts | Presentation asset and decision design |
| Presentation asset and decision design | Router and workflow drafts | `_presentation.txt` drafts, ADR-001, ADR-002 | Verification |
| No-drift verification method | Content-inventory mapping, drafts | Structural-diff procedure | Completion claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Command content inventory** - 1-2 hours - CRITICAL
2. **Router and workflow asset design** - 3-5 hours - CRITICAL
3. **Presentation asset and decision design** - 3-5 hours - CRITICAL
4. **Verification and handoff** - 1-2 hours - CRITICAL

**Total Critical Path**: 8-14 hours

**Parallel Opportunities**:
- Per-mode router/workflow drafting can split by mode once the content-inventory mapping shape is stable.
- Presentation-asset drafting and the auto-vs-confirm decision record can proceed in parallel once the router/workflow drafts are stable.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Inventory ready | Content-inventory mapping table covers all five modes with no gaps | After command content inventory |
| M2 | Router/workflow drafts ready | Five thin-router skeletons and ten workflow YAML drafts match the reference shape | After router and workflow asset design |
| M3 | Presentation/decision ready | Five presentation-asset drafts and both ADRs are complete | Before verification |
| M4 | Phase ready | Strict validation and no-drift verification method pass | Phase completion |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISIONS

| Decision | Rationale | Consequence |
|----------|-----------|-------------|
| Thin router plus three owned assets per mode | Matches the established `speckit`/`create`/`deep` command family pattern and `sk-doc`'s canonical contract | Five modes now carry eight files each (router + 3 assets, plus frontmatter) instead of one flat file |
| Relocate, do not rewrite, existing command content | Preserves current behavior exactly, per the phase brief's behavior-preservation requirement | Drafting discipline must resist the temptation to "clean up" wording during the move |
| Add `:auto`/`:confirm` as a net-new interaction dimension | Brings the design command family to parity with `speckit`/`create`/`deep`'s interaction model | Requires a documented default-behavior decision (ADR-002) so five modes do not diverge silently |
| Presentation asset owns all display wording; workflow YAML owns all execution steps | Keeps the split's boundary unambiguous and matches `command_presentation_template.md`'s guidance | Any future wording change touches only the presentation asset, never the router or workflow YAML |

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm the current task scope permits authoring only inside this Phase 013 packet; no `.opencode/commands/design/**`, `.opencode/skills/sk-design/**`, or `.opencode/skills/sk-doc/**` edit is in scope for this phase.
- Confirm the five current command files were read in full before any planning claim about their content.
- Confirm Phases 006-012's existence status is stated accurately (not yet authored, per the forward-reference note in `spec.md`).

### Execution Rules
| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Complete the content-inventory mapping before drafting router/asset section shapes. |
| TASK-SCOPE | Keep this phase's own writes inside the Phase 013 packet only. |
| TASK-PROOF | Every planned requirement in `spec.md` must have a corresponding task in `tasks.md` and a corresponding check in `checklist.md`. |

### Status Reporting Format
Use `STATUS=<planned|blocked|validated> PHASE=013 DETAIL=<short detail>` for handoff updates.

### Blocked Task Protocol
No Phase 013 planning task is blocked. If Phases 006-012 change a command's deliverable contract fields before implementation starts, the implementation pass must update the affected router/asset plan sections instead of changing the public `/design:*` taxonomy.
