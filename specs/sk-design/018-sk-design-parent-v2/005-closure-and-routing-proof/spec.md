---
title: "Feature Specification: Closure and routing proof"
description: "Every phase in this packet reported success against its own gate. Nothing had yet checked those claims against the fleet from the final state, and three of them turned out to be false."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Closure and routing proof

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Four phases moved skills, merged an advisor identity and rewrote routing metadata, each closing
against its own gate. This phase measures the result from the final state instead, and it found
three claims that were true when made and false afterwards: four dangling graph edges the build was
silently dropping, two stale derived blocks, and a hub gate failing because a mode moved out from
under its fixtures.

**Key Decisions**: measure from the closing state rather than trust per-phase evidence; treat a
validator that reads a built artefact as unable to see a defect the build repairs.

**Critical Dependencies**: every other phase in this packet, and an advisor daemon rebuilt
explicitly rather than assumed fresh.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 001-sk-create-chart |
| **Successor** | None |
| **Handoff Criteria** | Nothing follows; this phase closes the packet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Reinstate sk-design as a parent hub and absorb chart, diagram and the md generator as its modes specification.

**Scope Boundary**: Measurement and reconciliation only. No skill tree moves. The two canon tables naming the old fleet shape, and `016`'s spec saying from its own side that it is superseded in part.

**Dependencies**:
- Every other phase in this packet, including the relocated `001-sk-create-chart`
- An explicitly rebuilt advisor daemon; a replay against a stale one proves nothing
- `scratch/routing-baseline.txt`, which cannot be recaptured

**Deliverables**:
- The sixteen-phrase replay taken from the final state and diffed against the baseline
- Every gate green from the final state, each read rather than inferred
- The two canon tables and `016`'s spec reconciled with the fleet's actual shape
- Every acceptance criterion across the packet `Met`, `Waived` or `Superseded` with observed evidence

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every phase in this packet closed against evidence it gathered itself, at the moment it ran. That is
the weakest position from which to claim a fleet is correct: a later phase can invalidate an earlier
one's evidence without either noticing, and no gate in the packet compares the closing state against
the baseline taken before any of it started.

### Purpose
Every claim this packet makes matches what the fleet does, measured from the closing state.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An explicit advisor rebuild with its generation number observed to move
- The sixteen-phrase replay taken from the closing state and diffed against `routing-baseline.txt`
- Every gate re-run and its output read, not its exit code trusted
- Repair of anything those measurements prove wrong, where the repair is in this packet's blast radius
- Reconciliation of documents that describe the old fleet shape

### Out of Scope
- Re-baselining `sk-doc`'s routing benchmark corpus - four of its fixtures assert `sk-doc` owns
  FLOWCHART and now block the typed-gold gate, but the corpus is keyed to benchmark reports from
  2026-07-21 and belongs to whoever owns that benchmark
- `SD-CR-001`, a compiled-routing scenario with no pass/fail criteria - it was already failing on
  2026-09-02, before this packet's first commit, and has nothing to do with design routing
- The fleet-wide `description.json` versus `graph-metadata.json` vocabulary finding - it is real and
  it is its own packet

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/graph-metadata.json` | Modify | Remove a dangling sibling edge and a self-loop left by the identity merge |
| `.opencode/skills/mcp-tooling/graph-metadata.json` | Modify | Retarget a sibling edge from the dead standalone name to the hub |
| `.opencode/skills/sk-communication/graph-metadata.json` | Modify | Same retarget; the rewritten row also comes into the recommended weight band |
| `.opencode/skills/sk-doc/graph-metadata.json` | Modify | Regenerate the derived block that still pointed at a moved mode |
| `.opencode/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` | Modify | The fleet class table named the old shape |
| `.opencode/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` | Modify | The extension matrix said the hub was decommissioned |
| `specs/sk-design/016-deprecate-sk-design-interface/spec.md` | Modify | Record its own partial supersession |
| `specs/sk-design/018-sk-design-parent-v2/scratch/routing-after-005.txt` | Create | The closing replay |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The advisor daemon is rebuilt explicitly and its generation number observed to move before any routing claim is made. |
| REQ-002 | All sixteen baseline phrases are replayed from the closing state. No phrase reaches nobody, chart and diagram name `sk-design`, and the three `sk-doc` controls are unchanged. |
| REQ-003 | Every gate is re-run and its **output** read. An exit code alone is not evidence, and at least one gate in this fleet reports `verdict=FAIL` while exiting 0. |
| REQ-004 | Anything those measurements prove wrong is repaired where it lies inside this packet's blast radius, or named with its cause and its owner where it does not. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | No document still describes `sk-design` as standalone, or `sk-doc` as the home of chart and diagram. |
| REQ-006 | `016`'s spec records its own partial supersession from its own side, without rewriting the reasoning it recorded. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The replay in `scratch/routing-after-005.txt` shows zero phrases reaching nobody, against four at the baseline.
- **SC-002**: The advisor rebuild reports `rejectedEdges: 0`, against 4 before this phase.
- **SC-003**: The fleet metadata audit reports 13 of 13 passing, `sk-design` and `sk-doc` both class H.
- **SC-004**: `ci-skill-derived-freshness` reports 13 fresh, 0 stale, exit 0.
- **SC-005**: `validate.sh --strict` prints `RESULT: PASSED` for the parent, all five children, and `016`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor daemon | A replay against a stale generation proves nothing | Rebuild explicitly and read the generation back before measuring |
| Dependency | `scratch/routing-baseline.txt` | Without it there is nothing to diff against, and it cannot be recaptured | It was committed in phase 002, before anything moved |
| Risk | A gate reports success in its exit code and failure in its output | High | Read every gate's output; use `--strict` where a gate offers it |
| Risk | A validator reads the built artefact and cannot see a defect the build repairs | High | Read the build's own warning stream, not only the validator's verdict |
| Risk | Repairing something outside this packet's scope | Medium | Name the finding, its cause and its owner, and stop |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target. The only measured quantity is advisor confidence per phrase, recorded in `acceptance-criteria.md`.

### Security
- **NFR-S01**: No credential, token or network call is added. Every command is local and read-mostly.

### Reliability
- **NFR-R01**: Every measurement is reproducible from a named daemon generation, so a later reader can re-take it rather than trust it.

---

## 8. EDGE CASES

### Data Boundaries
- A phrase that reaches nobody: recorded as `NOTHING`, never as a low score, so a silent miss cannot read as a weak pass.
- A phrase whose owner changed: reported as an owner change, never as a score delta, because the two numbers describe different identities.

### Error Scenarios
- A gate that prints nothing: treated as failed, not passed. A validator with no output has not run.
- A gate that exits 0 with `verdict=FAIL`: the output wins. `--strict` is used wherever a gate offers it.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 12/25 | Files: 8 changed, 3 skill graphs, 3 canon documents; no code path |
| Risk | 14/25 | Auth: N, API: N, Breaking: routing metadata, which is why every change is re-measured |
| Research | 8/20 | No investigation; the measurements are the work |
| Multi-Agent | 2/15 | Single workstream, serial by nature |
| Coordination | 12/15 | Depends on all four preceding phases being complete and green |
| **Total** | **[/100]** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A per-phase claim is true when made and false at the close | H | H | This phase exists for exactly that; measure from the closing state |
| R-002 | A silently-repaired defect never surfaces | M | H | Read the build's warning stream, not only the validator verdict |
| R-003 | A found defect lies outside this packet's scope | H | M | Name cause and owner; repair nothing outside the blast radius |

---

## 11. USER STORIES

### US-001: A later reader trusts the packet's claims (Priority: P0)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: The next packet inherits an accurate fleet description (Priority: P1)

**As a** [user type], **I want** [needed behavior], **so that** [benefit].

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- How `sk-doc`'s four blocked FLOWCHART fixtures should be resolved: moved to a `sk-design` hub
  playbook that does not exist yet, retired, or re-baselined with the benchmark corpus they belong
  to. Recorded for the owner of that corpus rather than decided here.
- Whether the `description.json` versus `graph-metadata.json` vocabulary finding holds across the
  rest of the fleet. Worth checking before anyone writes a packet to tune scorer thresholds.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
