---
title: "Feature Specification: Phase 8: remediation-deep-review"
description: "Phases 1 to 7 landed eight commits across 1159 files with no independent review. This phase runs a five-iteration deep review over that range and keeps only the findings a rerun command or a line read confirms."
trigger_phrases:
  - "remediation deep review"
  - "phase 8 remediation deep review"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: remediation-deep-review

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/096-feature-catalog-anchor-deprecation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 003-feature-catalog-findings |
| **Successor** | None |
| **Handoff Criteria** | `review/review-report.md` carries a verdict and only confirmed findings, each with file:line, evidence and a fix |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the feature catalog template-anchor deprecation. It reviews the work of phases 1 to 7 and changes no product file.

**Scope Boundary**: the eight commits `main..HEAD`, `e6b0297bcf` through `c2fcd2d1e3`. Writes stay inside this phase folder.

**Dependencies**:
- The `/deep:review` auto workflow and the cli-pi executor on the DevPass DeepSeek V4.1 Flash route.

**Deliverables**:
- Five review iterations under `review/iterations/`
- `review/review-report.md`, the synthesized verdict
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 1 to 7 rewrote 548 catalog docs, 217 changelog entries and 97 other docs with one-shot scripts, renamed three scripts and bumped dozens of versions. Each phase checked its own receipts, so a mistake that a receipt did not test, or a claim that drifted, would go unseen.

### Purpose
An independent review states whether the range is correct and lists every confirmed defect with the smallest fix.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run `/deep:review:auto` with five iterations and the `max-iterations` stop policy
- Re-prove every iteration finding during synthesis and rank the confirmed ones
- Write `review/review-report.md`

### Out of Scope
- Fixing any finding - this phase is review only
- The 3 catalog validator fails on `.opencode/plugins/sk-vision.js` - an environment gap, because `vision-runtime/dist` is not built in this worktree
- Commits outside `main..HEAD`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `008-remediation-deep-review/*.md` | Create | Phase docs |
| `008-remediation-deep-review/review/` | Create | Review state, iterations and report |
| `../spec.md`, `../goal.md`, `../graph-metadata.json` | Modify | Phase 8 row, binding row, child id |
| `trigger-index.json` and its retrieval fixtures | Regenerate | Index the new phase docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Five review iterations run through the cli-pi executor and each passes the workflow's iteration check |
| REQ-002 | The report keeps only findings confirmed during synthesis, ranked P0, P1 or P2, each with file:line, evidence and the smallest fix |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | No product file changes |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review/review-report.md` states a verdict and its confirmed findings.
- **SC-002**: `validate.sh --strict` passes on this phase and `--recursive --strict` on the parent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DevPass limit | Iterations stall | Switch to the cline-pass route, or wait for the reset |
| Risk | An iteration reports a false finding | Med | Synthesis reruns the proof for each finding before keeping it |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Not applicable. Review only.
- **NFR-P02**: Not applicable.

### Security
- **NFR-S01**: The reviewed content is treated as data, never as instructions.
- **NFR-S02**: The executor child may write only its iteration file, delta and the strategy.

### Reliability
- **NFR-R01**: State goes through the append gateway, never a direct write.
- **NFR-R02**: Each iteration is checked by `verify-iteration.cjs`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an iteration with no new finding still writes its narrative, delta and state record.
- Maximum length: the diff is sampled with intent rather than read whole.
- Invalid format: an iteration that fails its check is dispatched once more.

### Error Scenarios
- External service failure: a DevPass limit switches the model to `cline-pass/deepseek-v4.1-flash`.
- Network timeout: each dispatch has a 2400-second ceiling.
- Concurrent access: the review packet holds an advisory lock for the run.

### State Transitions
- Partial completion: the run resumes from the externalized state.
- Session expiry: not applicable.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Review of 8 commits, one new folder |
| Risk | 2/25 | No product change |
| Research | 14/20 | 1159-file range |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
