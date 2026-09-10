---
title: "Implementation Plan: Phase 2: skin-contract"
description: "Signs seven skin-contract decisions against phase 1's reconciled research, specifies the derivation record's shape, and collapses four duplicated contracts to one locus each. No code changes; every deliverable is a decision or a record."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: skin-contract

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (spec-kit v2.2 templates); no application code |
| **Framework** | N/A — a documentation/decision-record phase |
| **Storage** | None — decisions live in `goal.md`, `plan.md`, and `findings-ledger.md` as version-controlled markdown |
| **Testing** | `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-design/019-sk-design-diagram-upgrade/002-skin-contract --strict` |

### Overview
Phase 2 has one deliverable shape: written decisions and records, not code. It reconciles two
research lineages into one fact base, signs seven contract decisions against that fact base,
specifies the derivation record's structure, and collapses four duplicated contracts to a single
locus each. Every artifact it produces is read by phase 3 (the applicator) before phase 3 writes
a line of script.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented — `spec.md`'s Problem Statement (phase 1 handoff read)
- [ ] Success criteria measurable — `spec.md` SC-001 through SC-008
- [ ] Dependencies identified — `findings-ledger.md` (T001) is the load-bearing dependency for T002-T013

### Definition of Done
- [ ] All acceptance criteria met — `acceptance-criteria.md`'s thirteen AC rows all `Met`
- [ ] Tests passing (if applicable) — N/A; `validate.sh --strict` is the applicable gate
- [ ] Docs updated (spec/plan/tasks) — `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md`, `findings-ledger.md` all internally consistent
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation contract (spec-kit phase-doc pattern). No application architecture applies — this
phase produces decision records, not a running system.

### Key Components
- **`findings-ledger.md`**: the reconciled fact base every decision cites
- **`goal.md`**: the durable directive and the nine decision rows refining the parent's D1-D12
- **The `data-diagram-node` markup convention (D7, T004)**: nodes carry the attribute; budgets
  count tagged nodes, not raw `<rect>` elements — the convention 005's checker family reads
- **The derivation record's specified shape**: three lists, four kinds, gates, tolerances, a
  reference-plus-sha256 pin — realized as a file in a later phase (see ADR-003)

### Data Flow
Two research lineages (glm, sonnet) feed `findings-ledger.md` (T001). The ledger feeds seven
signed decisions (T002-T008, recorded in `goal.md`). The decisions plus six mechanical fixes
(T009-T013) feed phase 3, which reads `goal.md` and the derivation-record shape to build the
applicator.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable in the standard sense — this phase's `research_intent` is decision-signing, not
`fix_bug`, so the producer/consumer inventory and matrix-axes apparatus below does not apply. The
table lists every skill-side file a signed decision names, for traceability, and states plainly
that none of them is modified by this authoring pass.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-design/sk-design-diagram/SKILL.md` | Router pseudocode + prose contract (12.6% of file is pseudocode per F4.5) | Not modified by this phase; named as a future-phase target for T002, T004, T011, T012 | Read-only citation, verified via `sed -n` against the live file during authoring |
| `.opencode/commands/design/diagram.md` | Command router naming workflow YAML assets | Not modified by this phase; T011 names line 67's fix for a later phase | `grep -n "create-diagram" .opencode/commands/design/diagram.md` returns line 67 only |
| `.opencode/skills/sk-design/mode-registry.json` | Owns the actual `sk-design-diagram` registration (lines 89-110) | Not a consumer — this phase reads it as evidence for the ownership-locus decision (T011), does not edit it | `sed -n '85,115p'` confirmed the registration during authoring |
| `.opencode/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md` | Token/typography source of truth | Not modified by this phase; T007 and T013 name its future edits (derivation record, fallback-chain table) | `shasum -a 256` pinned during authoring: `e28789b22979472537d437e91fda6edd70ecb55be39e131b3e4ab4e4bece9a81` |

Required inventories: not applicable (see note above); the table above substitutes for a
producer/consumer inventory since no code symbol changes in this phase.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Tasks run T001 first — D10 requires the reconciliation before any
decision signs — then T002-T013 in any order; several are marked `[P]` for parallel execution.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] Read `findings-ledger.md` in full before signing any decision — every decision cites a row from it, not a memory of it
- [ ] Confirm the decision under work does not contradict a frozen row in the parent `../goal.md`'s D1-D12 table
- [ ] Confirm whether the task ahead needs an operator signature (the seven contract decisions) or is a mechanical edit executed without one (the reconciliation and the mechanical fixes)

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | The reconciliation task completes and is verifiable before any decision or mechanical-fix task starts; the parent's reconciliation directive makes this ordering non-negotiable |
| TASK-SCOPE | A task touches only the file(s) named in its own line in `tasks.md`; a decision task writes to `goal.md`, a mechanical-fix task writes only to the skill file(s) it names |
| TASK-VERIFY | A decision is not complete until its cited finding id and parent decision id are grep-verifiable in `goal.md`; a mechanical fix is not complete until the named line actually changed |

### Status Reporting Format

One line per task: `[TASK-ID] [DONE | IN PROGRESS | BLOCKED] — one line of evidence`

### Blocked Task Protocol

1. Mark the task `[B]` (BLOCKED) in `tasks.md` rather than leaving it pending or claiming it done
2. State the blocking fact in the task's status line — the missing citation, the contradicting decision, or the unavailable file
3. Do not sign a dependent decision or mechanical fix on top of a blocked task
4. Escalate the block to the operator before proceeding manually
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Every `<!-- ANCHOR -->` pair intact; no bracketed placeholder remains | `grep -c "<!-- ANCHOR"`, `grep -n '\[[a-z]'` |
| Traceability | Every finding id in the ledger's node-002 rows appears in a `tasks.md` task line | Cross-check `findings-ledger.md` against `tasks.md` |
| Validator | Spec-kit strict validation | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `findings-ledger.md` content (T001) | Internal | Green — authored in this pass | Every decision task (T002-T008) cites it; a gap here blocks all seven |
| Parent `goal.md`'s D1-D12 | Internal | Green — read and cited | A decision that can't cite a parent id is out of scope |
| `001-upgrade-research/research/research.md` | Internal | Green — read and cited | Supplies the phase-1 synthesis and the seven recommended answers this phase ratifies or departs from |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A signed decision is later shown to contradict evidence, or 003's applicator cannot build against the derivation-record shape this phase specifies.
- **Procedure**: Amend the specific decision row in `goal.md` (never delete it — supersede with a dated note), update the citing task in `tasks.md`, and re-run `validate.sh --strict`. Because this phase writes no code, rollback is a document edit, not a revert.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
T001 (reconciliation) ────────────────────────┐
                                                ├──► T002-T008 (seven decisions) ──► T009-T013 (mechanical fixes)
Parent D1-D12 (frozen, read-only) ─────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| T001 reconciliation | None (reads only the two research registries) | T002-T013 (D10) |
| T002-T008 seven decisions | T001 | 003's applicator; 005's checker families |
| T009-T013 mechanical fixes | T001 | 004's repaint (version/ownership loci); nothing inside 002 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| T001 reconciliation | Low | 1-2 hours (mechanical merge of two structured JSON registries) |
| T002-T008 seven decisions | Medium | 4-6 hours (judgment calls, each needs a defensible written rationale) |
| T009-T013 mechanical fixes | Low | 2-3 hours (single-line and single-locus edits) |
| **Total** | | **7-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `findings-ledger.md` exists and cites both registries
- [ ] Every decision row names the parent id it refines
- [ ] No bracketed placeholder remains in any of the seven docs

### Rollback Procedure
1. Identify the specific decision row or task line that is wrong
2. Amend `goal.md`'s decision table with a dated superseding note (never silently delete a frozen decision)
3. Update the citing task in `tasks.md` and any `acceptance-criteria.md` row that verifies it
4. Re-run `validate.sh --strict` on this folder

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — this phase touches no runtime data or generated artifact
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌───────────────┐     ┌─────────────────────┐     ┌──────────────────────┐
│      T001      │────►│    T002-T008        │────►│    T009-T013          │
│ Reconciliation │     │  Seven decisions     │     │  Mechanical fixes     │
└───────────────┘     └──────────┬──────────┘     └──────────────────────┘
                                  │
                            ┌─────▼─────┐
                            │  003, 005 │
                            │  read here│
                            └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| `findings-ledger.md` (T001) | Parent `goal.md`, both research registries | The reconciled fact base | T002-T013 |
| Seven decisions (T002-T008) | T001 | `goal.md`'s decision table | 003's applicator, 005's checker |
| Mechanical fixes (T009-T013) | T001 | Named single-locus targets in five skill files | 004's repaint (version/ownership) |
| Derivation-record shape (T007) | T001, T002-T006, T008 | The three-list/four-kind spec | 003's applicator directly |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T001 reconciliation** - 1-2 hours - CRITICAL
2. **T002-T008 seven decisions** (parallel among themselves, but all gate T007's derivation record and 003) - 4-6 hours - CRITICAL
3. **T007 derivation-record specification** - folded into the above, the single task 003 depends on directly - CRITICAL

**Total Critical Path**: 5-8 hours

**Parallel Opportunities**:
- T009, T010, T011, T013 (mechanical fixes) can run alongside T002-T008 once T001 is done
- T012 has a soft ordering preference after T002, so the 4px locus and the accessibility locus aren't consolidated in the same pass by accident
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Reconciled | `findings-ledger.md` exists, cites both registries | T001 done |
| M2 | Signed | All seven decisions in `goal.md`, each citing a parent id | T002-T008 done |
| M3 | Collapsed | One locus each for version, ownership, accessibility contract, 4px rule | T009-T013 done; successor gate met |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Accent contrast departs rather than re-derives

**Status**: Accepted

**Context**: The accent `#eb6c36` measures 2.863:1 against the paper ground, below the standard's
3.0 emphasis gate inherited from sk-design-chart. Re-deriving a compliant accent would mean
picking a different hex value.

**Decision**: Sign 2.863:1 as a recorded departure. The accent stays `#eb6c36` (parent D8); the
gate becomes a documented exception in the derivation record's gate table (T008), not a rule the
token must satisfy.

**Consequences**:
- The shipped brand accent (`#eb6c36`, atomic-tangerine) is preserved across every diagram already produced.
- The checker (005) must special-case this one token in its gate family rather than applying a uniform >=3.0 assertion to every coral element.

**Alternatives Rejected**:
- Re-derive a compliant accent (e.g., darken to hit 3.0): rejected because it changes the shipped
  brand color for a corpus that already exists at the current value, and the parent goal
  explicitly names `#eb6c36` as staying (D8).

---

### ADR-002: Connectors are structure, gated only when accent-painted

**Status**: Accepted

**Context**: F3.7 leaves open whether SVG connectors (arrows, lines) are marks (gated at the 3.0
emphasis threshold like coral elements) or structure (ungated, like hairlines at 1.25-1.58:1).

**Decision**: Connectors are structure by default and inherit the ungated hairline doctrine. A
connector painted with the accent color (to show a highlighted relationship) becomes a coral
element for that instance and is gated at 3.0 like any other coral-painted shape, consistent with
the existing 2-coral-element budget.

**Consequences**:
- Most connectors (ink or muted stroke) need no contrast gate, matching how the corpus already treats hairlines.
- The checker's coral-element budget family (max 2 per diagram) now has to recognize an accent-painted connector as one of the two, not just accent-painted nodes.

**Alternatives Rejected**:
- Gate every connector at 3.0 regardless of color: rejected because most connectors use
  `rule`/muted-ink strokes well below the emphasis threshold by design (the hairline range is
  1.25-1.58:1), and gating them would fail the entire corpus on a rule that was never meant to
  apply to structure.

---

### ADR-003: The derivation record lives at `references/foundations/derivation-record.md`

**Status**: Accepted

**Context**: The derivation record needs a stable, single path for phase 3's applicator to read.
No path is fixed on disk today; `style-guide.md:52` is the current unstructured prose draft.

**Decision**: Name `.opencode/skills/sk-design/sk-design-diagram/references/foundations/derivation-record.md`
as the record's home, sibling to `style-guide.md`, created during this phase's mechanical-fix
execution (not by this planning pass).

**Consequences**:
- 003's applicator has one path to read, matching the chart skill's `palettes.json` pattern in
  spirit (a dedicated token-source file, not prose buried in a style guide).
- `style-guide.md`'s own token tables (§1) stay the human-readable presentation; the new file
  becomes the machine-and-applicator-facing source.

**Alternatives Rejected**:
- Keep the derivation record as a new section inside `style-guide.md` itself: rejected because it
  would re-create the same scattering F2.4 already flags (the current doctrine is "scattered...
  `:52` is its prose draft"), and a single record is easier to sha256-pin than a section boundary
  inside a growing file.

---
