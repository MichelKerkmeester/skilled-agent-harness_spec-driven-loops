---
title: "Feature Specification: Phase 11: deep-research-swe-2"
description: "A second independent research pass over the completed MCP decommission, run on SWE-2 Max rather than DeepSeek, asking what the transport removal teaches rather than hunting defects. Two models on one subject make the findings comparable instead of singular."
trigger_phrases:
  - "swe-2 deep research decommission"
  - "transport removal lessons"
  - "mcp to cli migration checklist"
  - "second research lineage advisor"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: deep-research-swe-2

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-12 |
| **Branch** | `worktrees/052-swe-2-model-cutover` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-deep-research-residue |
| **Successor** | None |
| **Handoff Criteria** | Five iterations recorded with a synthesized `research.md`, and the parent packet's open questions updated with anything the pass answers |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the deep review and research over the completed MCP decommission.

**Scope Boundary**: Research only. No runtime, document or configuration change ships from this phase. The write authority is this folder's `research/` tree.

**Dependencies**:
- Phase 010 supplied the first research lineage, on DeepSeek. This phase does not read its conclusions before running, so the two stay independent and comparable
- The SWE-2 cutover in `cli-external-orchestration/070-swe-2-model-cutover`, without which the fan-out would refuse `swe-2-max`

**Deliverables**:
- Five iteration records and a synthesized `research.md` under `research/lineages/swe-2-research/`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

One model's read of a subject is one opinion, and phase 010 supplied exactly one: a single DeepSeek lineage. The decommission it examined was unusually instructive — several failures were latent for as long as the CLI was a fallback and only surfaced when it became the primary path — but nothing has tested whether those lessons hold under a different reader. A second independent pass on a different model either corroborates the first or exposes where it was model-specific.

### Purpose

A second, independently run research lineage over the same subject, so the decommission's lessons are held by two readings rather than one.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- What the decommission teaches, not what it got wrong. The defect hunt was phase 009's job and it closed
- Which failures were latent while the CLI was a fallback and surfaced only once it became the primary path
- What classes of residue a transport removal leaves behind, beyond the obvious references
- What a repeatable checklist for the next transport-to-CLI migration would contain

### Out of Scope
- Any change to shipped code, documents or configuration. This phase writes research artifacts only
- Re-auditing phase 009's nine required findings. They closed and were confirmed closed
- Reading phase 010's conclusions before this run finishes, which would collapse two independent readings into one

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/lineages/swe-2-research/` | Create | Iteration records and the synthesized `research.md` |
| `spec.md`, `plan.md`, `tasks.md` | Create | This phase's own documents |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Five iterations run, with no early convergence stop | The stop policy is `max-iterations` and five iteration records exist |
| REQ-002 | The run dispatches on SWE-2 Max through the Devin route | Iteration records name `swe-2-max` as the executor model |
| REQ-003 | Nothing outside this phase folder is written | The scoped diff shows only this folder's files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A synthesized `research.md` exists and cites what it read | The file names files and commands rather than asserting from memory |
| REQ-005 | The run's findings are set beside phase 010's rather than merged into them | Both lineages remain separately readable |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Five iteration records under `research/lineages/swe-2-research/`
- **SC-002**: A `research.md` answering the three questions in scope
- **SC-003**: `validate.sh --strict` on this phase reports `RESULT: PASSED`
- **SC-004**: The parent packet's open questions reflect anything this pass settles
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Write containment reverts edits made to packet documents while the loop runs | High | This has already happened twice on this packet. Nothing outside the lineage directory is edited while the run is live, and the runner's saved patches under `containment-reverted/` are the recovery path |
| Risk | A lineage stalls after one iteration and exits zero | Med | The orchestration summary records per-lineage status; a run is not read as complete until its iteration records are counted |
| Risk | The second reading simply restates the first | Med | Phase 010's conclusions are not supplied to this run, so agreement is evidence rather than echo |
| Dependency | `swe-2-max` reachable through the fan-out allowlist | Low | Added and dispatch-verified in `cli-external-orchestration/070-swe-2-model-cutover` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether a third reading would add anything, or whether two independent passes are the point of diminishing return for a subject this size.
- Whether the migration checklist this produces belongs in the advisor packet or in a shared reference the next transport removal would actually find.
<!-- /ANCHOR:questions -->

---
