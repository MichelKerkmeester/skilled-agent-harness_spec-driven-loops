---
title: "Feature Specification: Phase 20: review-p1-fixes"
description: "The 019 deep review confirmed three P1 defects in the skill advisor: a refresh request during a running refresh is dropped, the recommend path's coverage check opens the database read-write, and advisor_status reports the semantic lane enabled while its coverage gate refuses to score."
trigger_phrases:
  - "review p1 fixes"
  - "phase 20 review p1 fixes"
  - "refresh rerun after mid-refresh reindex"
  - "read-only coverage check on the recommend path"
  - "advisor_status incomplete_skill_vectors"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 20: review-p1-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-20 |
| **Branch** | `worktrees/480-ollama-lane-honest-and-closeout` |
| **Parent Spec** | ../spec.md |
| **Phase** | 20 of 20 |
| **Predecessor** | 019-ollama-lane-honest-and-closeout |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and the change is merged to main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of the Pi context decisions refinement. It fixes the three P1 defects the 019 deep review confirmed in `../019-ollama-lane-honest-and-closeout/review/review-report.md`.

**Scope Boundary**: the three P1 defects, one test each, and the two feature-catalog pages that describe the changed behavior. The 25 P2 advisories stay in the review report.

**Dependencies**:
- The 019 review report and its merged findings registry.

**Deliverables**:
- A background refresh that makes one more pass when a request arrives during a run.
- A recommend-path coverage read through the read-only handle.
- An `advisor_status` that reports `incomplete_skill_vectors` and `laneEnabled: false` when coverage is incomplete.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`refreshEmbeddingsInBackground` hands a caller that arrives during a run the running promise and never reruns, so a skill a mid-refresh reindex adds keeps no vector until the next reindex or restart. The semantic lane's coverage check calls `embeddingCoverage()` with no handle, which opens the skill-graph database read-write in any process that has no handle yet. `advisor_status` computes `laneEnabled` without coverage, so it reports the lane enabled while the lane's own gate refuses to score.

### Purpose
A running daemon reaches full vector coverage after every reindex, the recommend path never opens the database read-write, and status reports the lane the way the scorer treats it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n "embeddingCoverage\(\)" lib/scorer/lanes/semantic-shadow.ts
392:        if (!embeddingCoverage().complete) {

$ rg -n "if \(backgroundEmbeddingRefresh\)" -A2 lib/skill-graph/skill-graph-db.ts
1442:  if (backgroundEmbeddingRefresh) {
1443-    return backgroundEmbeddingRefresh;
1444-  }

$ rg -n "laneEnabled: Boolean" handlers/advisor-status.ts
242:      laneEnabled: Boolean(hasActive && adapter && !dimMismatch && !staleness.stale && hasVecTable && embedded > 0 && !disabledReason),

$ sed -n 444,448p tests/handlers/advisor-status.vitest.ts
      coverageComplete: false,
      dimMismatch: false,
      lastRefresh: '2026-04-20T00:00:00.000Z',
      disabledReason: null,
      laneEnabled: true,
```
Commands run from `.skilled/skills/system-skill-advisor/runtime` at main `03c7fb56e47`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make `refreshEmbeddingsInBackground` record a request that arrives during a run and make exactly one more pass before the run resolves.
- Pass `getDbReadOnly()` to `embeddingCoverage` from the semantic lane, and disable the lane with `database_absent` when it returns null.
- Add an `incomplete_skill_vectors` reason to the `advisor_status` reason chain, so `laneEnabled` is false while coverage is incomplete.
- Add one test per fix that fails before it and passes after, and update the status test that asserted the old contract.
- Update the background-refresh and advisor-status feature-catalog pages where their text describes these behaviors.

### Out of Scope
- The 25 P2 advisories from the 019 review - they stay recorded in its report for a later pass.
- The other `getDb()` default-argument sites in `skill-graph-queries.ts` - none is on the recommend path the review flagged.
- The expansive-depth tooling gaps the review run exposed - they belong to the deep-loop skill, not the advisor.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts` | Modify | Rerun the background refresh once when a request arrives during a run |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts` | Modify | Read coverage through `getDbReadOnly()` |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-status.ts` | Modify | Add the `incomplete_skill_vectors` reason |
| `.skilled/skills/system-skill-advisor/runtime/tests/skill-graph/refresh-in-background.vitest.ts` | Modify | Test a reindex during a running refresh |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/semantic-shadow-cosine.vitest.ts` | Modify | Test that scoring opens no read-write handle |
| `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts` | Modify | Assert the lane is reported disabled on incomplete coverage |
| `.skilled/skills/system-skill-advisor/feature-catalog/daemon-and-freshness/background-vector-refresh.md` | Modify | Describe the extra pass |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-status.md` | Modify | Describe `laneEnabled` with the coverage gate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A refresh request that arrives while a background refresh runs causes exactly one more pass, so a skill indexed during the run has a current vector when the run resolves |
| REQ-002 | The semantic lane reads coverage through `getDbReadOnly()`, so scoring in a process with no read-write handle leaves none open, and a null handle disables the lane with `database_absent` |
| REQ-003 | `advisor_status` with `includeSemanticHealth` reports `disabledReason: 'incomplete_skill_vectors'` and `laneEnabled: false` when the lane weight is above 0 and coverage is incomplete |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Each fix has a test that fails on main `03c7fb56e47` and passes after the change, and the runtime suite has no new failure |
| REQ-005 | The background-refresh and advisor-status catalog pages state the shipped behavior |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three new or changed tests fail with the source at `03c7fb56e47` and pass after the fix.
- **SC-002**: The full runtime suite (`vitest run` after `skill_graph_scan --trusted`) reports no failure that the baseline did not have.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `getDbReadOnly()` returns the read-write handle when one is open | Inside the daemon the coverage read keeps using the daemon's own handle | That is the wanted behavior; the test covers a process with no handle open |
| Risk | A refresh loop that never ends if requests keep arriving | Med | Each request during a run sets one flag; the run makes one more pass per flag set and stops when no request arrived during the last pass |
| Risk | Status consumers that treated `laneEnabled: true` with incomplete coverage as healthy | Low | The doctor checks already read `coverageComplete`; the catalog page states the new rule |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A refresh with no request during its run makes one pass, as today.
- **NFR-P02**: The coverage read on the recommend path opens no new handle when the daemon already holds one.

### Security
- **NFR-S01**: No change reads or writes credentials or network settings.
- **NFR-S02**: The recommend path holds no read-write handle on the shared database.

### Reliability
- **NFR-R01**: A refresh pass that throws still clears the in-flight slot, so the next request starts a new run.
- **NFR-R02**: A missing database on the recommend path disables the lane instead of creating the file.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a refresh with full coverage returns null without probing, as today, and an extra pass after full coverage returns null too.
- Maximum input: many requests during one run set the same flag, so they cause one extra pass, not one each.
- Failure path: an Ollama outage during the extra pass keeps the existing vectors and returns the backend warning, as the first pass does.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Three source files, three test files, two catalog pages, about 150 lines |
| Risk | 9/25 | Shared database handle and status contract; no API or schema change |
| Research | 4/20 | The 019 review located each defect at file and line |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should status keep reporting the lane enabled when coverage is incomplete, as the old status test asserted? Decision: no. That assertion predates the coverage gate, and the operator approved the fix that makes status match the scorer.
<!-- /ANCHOR:questions -->

---
