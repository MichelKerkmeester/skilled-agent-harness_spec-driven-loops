---
title: "Feature Specification: Phase 47: measure every Jev feature"
description: "Fifteen of the 23 Jev integration points have no Jev measurement, so the benefit overview cannot say what Jev adds to them. This phase gives every remaining feature a live Jev verdict line or a zero-call bound its own scorer prints from confirmed labels."
trigger_phrases:
  - "measure every jev feature"
  - "jev live measurement"
  - "jev benefit overview"
  - "jev verdict lines"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 47: measure every Jev feature

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-02 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 47 of 47 |
| **Predecessor** | 046-deem-deprecation |
| **Successor** | None |
| **Handoff Criteria** | Every feature in the inventory below has a recorded result, and the benefit overview is resent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 47** of the cli-jev workflow integration packet.

**Scope Boundary**: Measuring the Jev arm each earlier phase built. A scorer changes only when a defect stops its own run.

**Dependencies**:
- `jev auth status --provider official` exits 0
- 042's label method (its ADR-001, the delegated arbiter) and 043's corrected 027 gold

**Deliverables**:
- One result line per feature in `scratch/evidence/results.md`
- The resent benefit overview

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The parent integrated Jev into 23 features. Seven have a live Jev verdict (002, 017, 019, 029, 032, 035, 037), and 023 left with `sk-communication`. The other 15 stopped at a label gate or a zero-call stop, so the overview cannot state what Jev adds to them.

### Purpose
Every one of the 15 has a result its own scorer printed: a live Jev verdict line, or a zero-call bound from confirmed labels that shows Jev cannot add benefit.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
The 15 features and what each needs before its scorer can print a result:

| Feature | Scorer | Needs |
|---------|--------|-------|
| 003 goal-verifier shadow | `score-verifier-labeled-set.cjs` | Its 042 gate printed `stop: no headroom`; record the bound or measure past it |
| 005 compaction recall | `score-compaction-recall.mjs` | Printed `stop: arm not built` (truncation keeps 3.64 times the stock tokens); record the bound |
| 006 goal-criteria lint | `score-goal-lint.cjs` | 98 labeled rows exist; run `--jev` live |
| 020 routing clarify default | `score-clarify-default.cjs` | 30 labeled rows; real census holds 2 |
| 021 leaf-route replay | `leaf-route-replay.cjs` | Run the tie-break arm live on its tied rows |
| 022 alignment folder suggestion | `score-alignment-suggestion.ts` | 30 labeled rows; real census holds 3 |
| 024 hallucination grader | `score-d4-agreement.cjs` | 30 labeled outputs, at least 5 yes and 5 no |
| 025 reviewer verdict fallback | `score-verdict-fallback.cjs` | 12 labeled regex-miss outputs |
| 026 completion-claim audit | `score-completion-claims.mjs` | At least 5 labeled yes rows; 50 drawn rows held 0 |
| 027 stop second rater | `score-stop-rater.cjs` | 5 confirmed lineages on 043's corrected gold |
| 028 confirm-mode stop hint | `score-stop-hint.cjs` | A 027 report with confirmed gold |
| 030 fan-out merge shadow | `score-fanout-pairs.cjs` | 40 labeled pairs exist past the gate; run `--jev` live |
| 031 debug next check | `score-debug-next-check.mjs` | 30 labeled fixture rows exist; run `--jev` live |
| 033 validator residue flagger | `score-residue-flagger.cjs` | 100 labeled rows |
| 034 HVR reader lens | `hvr_reader_lens.py` | Its 042 gate printed `stop: fewer than 2 categories can pass`; record the bound or relabel |

### Out of Scope
- Changing a scorer's keep rule, gate or verdict format. They are each phase's frozen design.
- Wiring any Jev arm into a default path. Enabling is the operator's choice after the overview.
- 023, removed on main with `sk-communication`.
- Re-measuring the seven features that already have a live verdict.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `047-measure-every-jev-feature/scratch/evidence/` | Create | Result lines, run commands and label digests |
| `~/.skilled/.labels/` | Create | Label files and Jev run outputs, kept outside the repository as in 042 |
| A scorer named above | Modify | Only for a defect that stops its own run, fixed by a D5 worker |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every one of the 15 features ends with a result line its own scorer printed: a live Jev verdict, or a zero-call bound from confirmed labels |
| REQ-002 | Labels come from the operator or the delegated arbiter of 042's ADR-001. No other label counts |
| REQ-003 | Every live run uses `--jev --out` under `--provider official`, and Jev gets no secret |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Where real rows fall short of a gate, a fixture set built for that scorer may fill it, and the result names its corpus as real or fixture |
| REQ-005 | A scorer fix needed to run passes its suite and a cross-family review with no open P0 or P1 |
| REQ-006 | The benefit overview is resent with all 22 measured features and each one's default state |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `results.md` holds 15 result lines, each a verbatim `verdict` or `stop:` line from the feature's scorer
- **SC-002**: The resent overview lists 22 features with a measured result and marks 023 as removed
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Jev official provider | No live run without it | Stop and report per parent D7 |
| Risk | Fixture rows measure a constructed case, not real traffic | Med | Each result names its corpus. The overview says which results came from fixtures |
| Risk | Arbiter labels drift from what the operator would pick | Med | Each label set gets a digest the operator can review, as in 042 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each live run records its p50 and p95 call latency where the scorer prints them

### Security
- **NFR-S01**: No key in a file and no `.env` opened. Label files that quote transcripts stay outside the repository

### Reliability
- **NFR-R01**: A run that fails on transport is retried once and then recorded with its exit code
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Real rows below the gate: build a fixture set per REQ-004, or record the zero-call bound
- A gate that proves no headroom: the `stop:` line is the result

### Error Scenarios
- Jev auth fails: stop and report, per parent D7
- A scorer refuses a label file: fix the labels, never the scorer's check

### State Transitions
- Partial completion: `results.md` marks each feature Done or Pending, so a resumed session starts at the first Pending row
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 15 scorers, label sets and fixture sets |
| Risk | 8/25 | Read-mostly, live calls cost cents |
| Research | 12/20 | Fixture design for four thin corpora |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The operator asked for every feature to be measured on 2026-10-02.
<!-- /ANCHOR:questions -->

---
