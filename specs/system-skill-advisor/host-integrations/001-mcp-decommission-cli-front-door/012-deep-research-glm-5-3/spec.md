---
title: "Feature Specification: Phase 12: deep-research-glm-5-3"
description: "A third independent research pass over the completed MCP decommission, run on GLM-5.3-Flash through the LLM Gateway at max thinking. Three models on one subject turn agreement into evidence rather than a single model's opinion."
trigger_phrases:
  - "glm 5.3 deep research decommission"
  - "third research lineage advisor"
  - "llmgateway glm flash research"
  - "transport removal lessons third reading"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 12: deep-research-glm-5-3

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
| **Phase** | 12 of 12 |
| **Predecessor** | 011-deep-research-swe-2 |
| **Successor** | None |
| **Handoff Criteria** | Four iterations recorded with a synthesized `research.md`, readable beside the DeepSeek and SWE-2 lineages without being merged into them |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the deep review and research over the completed MCP decommission.

**Scope Boundary**: Research only. No runtime, document or configuration change ships from this phase. The write authority is this folder's `research/` tree.

**Dependencies**:
- Phases 010 and 011 supplied the first two lineages, on DeepSeek and SWE-2. Neither is read before this run, so all three stay independent
- The `glm-5.3-flash` route through the LLM Gateway, which the fan-out reaches by mapping the bare literal to `llmgateway` and pinning effort to `max`

**Deliverables**:
- Four iteration records and a synthesized `research.md` under `research/lineages/glm-5-3-research/`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two readings agree on the decommission's lessons, which is better than one but still thin evidence. Two models can share a blind spot for the same reason two people can: they were pointed at the same documents and asked the same questions. A third reading on an unrelated model either raises the agreement to something worth generalizing from, or it finds what the first two both walked past. The SWE-2 pass also declared a limitation worth testing against another reader: it ran no commands and re-measured nothing, so every test count and latency figure in it is a packet-document claim rather than an observation.

### Purpose

A third independent research lineage over the same subject, on a model unrelated to the first two, so the decommission's lessons rest on convergence rather than on any single reader.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The same three questions the prior lineages answered, asked the same way so agreement means something
- Which failures were latent while the CLI was a fallback and surfaced only once it became the primary path
- What classes of residue a transport removal leaves behind
- What a repeatable checklist for the next transport-to-CLI migration would contain

### Out of Scope
- Any change to shipped code, documents or configuration. This phase writes research artifacts only
- Re-auditing the defect findings that phase 009 closed
- Reading the DeepSeek or SWE-2 output before this run finishes, which would turn a third reading into a review of the second

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/lineages/glm-5-3-research/` | Create | Iteration records and the synthesized `research.md` |
| `spec.md`, `plan.md`, `tasks.md` | Create | This phase's own documents |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Four iterations run, with no early convergence stop | The stop policy is `max-iterations` and four iteration records exist |
| REQ-002 | The run dispatches on GLM-5.3-Flash through the LLM Gateway at max effort | The lineage's effective config names the gateway route and `max` |
| REQ-003 | Nothing outside this phase folder is written | The scoped diff shows only this folder's files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A synthesized `research.md` exists and cites what it read | Claims carry a file, a command with output, or a packet document; anything else is labelled a hypothesis |
| REQ-005 | All three lineages remain separately readable | No lineage's output is merged into another's |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Four iteration records under `research/lineages/glm-5-3-research/`
- **SC-002**: A `research.md` answering the three questions in scope
- **SC-003**: Cited commits and file ranges spot-check clean, as the SWE-2 lineage's did
- **SC-004**: `validate.sh --strict` on this phase reports `RESULT: PASSED`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The third reading restates the second rather than testing it | Med | Neither prior lineage's output is supplied, so agreement is independent rather than echo |
| Risk | A lineage stalls after one iteration and exits zero | Med | Iteration records are counted rather than the exit status read, which is how the prior run was checked |
| Risk | The state log carries fabricated timestamps | Med | The SWE-2 lineage did exactly this, on round twenty-minute marks against a twenty-four minute run. The anomaly detector catches it, and the finding is reported rather than swallowed |
| Risk | Citations look plausible but point at nothing | High | Spot-checked against the repository, as the SWE-2 lineage's nine commits and three file ranges were |
| Dependency | The gateway route for `glm-5.3-flash` at `max` | Low | Probed live before wiring and it replied; the roster records the route as dispatch-verified and the only GLM-5.3-Flash route carrying both `xhigh` and `max` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether three readings is where this subject stops paying, and what a fourth would have to find to justify itself.
- Whether the migration checklist the lineages converge on belongs in this packet or in a shared reference the next transport removal would actually find.
<!-- /ANCHOR:questions -->

---
