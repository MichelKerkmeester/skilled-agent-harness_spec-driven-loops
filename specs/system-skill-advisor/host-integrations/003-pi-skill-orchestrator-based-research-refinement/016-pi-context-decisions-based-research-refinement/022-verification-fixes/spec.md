---
title: "Feature Specification: Phase 22: verification-fixes"
description: "The phase 021 verification of the advisor epic found one P1 and ten P2 defects. The launcher's heartbeat watchdog can kill a healthy daemon after the machine sleeps, and smaller gaps sit in the parent watch, the semantic lane gates, the refresh, the hook crash path and the DSH receipt boundary."
trigger_phrases:
  - "verification fixes"
  - "phase 22 verification fixes"
  - "heartbeat watchdog after sleep"
  - "semantic lane coverage before embed"
  - "dsh route receipt at compaction"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 22: verification-fixes

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
| **Branch** | `worktrees/489-advisor-verification-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 22 of 22 |
| **Predecessor** | 021-epic-verification |
| **Successor** | None |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and the change is merged to main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 22** of the pi-context-decisions refinement. It fixes the eleven defects in `../021-epic-verification/evidence/report.md`, by operator directive "Fix all".

**Scope Boundary**: the eleven defects, a test for each behavior change, and the docs that describe the changed behavior. The PARTIAL verdicts that name no defect stay as recorded: Pi storing no route receipt and the legacy `skill_nodes.embedding` read.

**Dependencies**:
- The phase 021 report and the conductor's checks in its `implementation-summary.md`.

**Deliverables**:
- A heartbeat watchdog that skips a check after its own suspension.
- A parent watch that compares against the launcher PID read before startup.
- Semantic lane gates that agree: off at weight 0, coverage checked before the embed and on the exact rerank path.
- A refresh that keeps a queued pass when a pass throws, with a behavioral watcher test.
- A silent disabled hook, a DSH boundary that drops the route receipt, corrected comments and a pinned strip case.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The launcher judges the daemon's heartbeat file from one read and never notices that it was itself asleep, so on wake it can SIGTERM a healthy daemon. The parent watch reads its baseline only after startup work, so a launcher that dies during startup leaves an orphan. A stale index marks the switched-off semantic lane degraded, a live lane pays its prompt embed before refusing on incomplete coverage, and the exact rerank path has no coverage gate. A refresh pass that throws drops a queued request, a disabled hook that crashes prints the outage line, and a DSH route receipt can outlive a compaction.

### Purpose
Each defect is fixed or pinned with a test that fails on the old source, and the docs state the shipped behavior.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n "nowMs: now\(\)" .skilled/bin/system-skill-advisor-launcher.cjs
1619:      nowMs: now(),
$ rg -n "const parentPid = getParentPid\(\);" .skilled/skills/system-skill-advisor/runtime/lib/daemon/liveness.ts
68:  const parentPid = getParentPid();
$ rg -n "backgroundEmbeddingRefreshRequested = null;" .skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts
1458:        backgroundEmbeddingRefreshRequested = null;
1468:      backgroundEmbeddingRefreshRequested = null;
```
Commands run in the primary checkout at main `cb751e06e38`, which holds the pre-fix source of the worktree base `24749648b24`. The watchdog judges `now()` from one read, the parent baseline is read when the watch is armed, and the `finally` clears a queued request.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix the P1 and nine of the ten P2 defects in code, each behind a test that fails on the old source.
- Add a behavioral watcher test for the refresh after reindex, shown to fail when the refresh call is removed.
- Pin the last-marker strip shape in the shared fixture with its `ideal` answer, since the rule is deliberate.
- Close the three gaps the independent review of this diff found: a hidden failed pass, the other pre-score refusals and the remaining parent-pid window.
- Update the catalog, reference and playbook lines that describe the changed behavior.

### Out of Scope
- Pi route receipts - Pi sends no session id, and phase 011 recorded that gap by design.
- Removing the legacy `skill_nodes.embedding` read - nothing writes it, and the read is a harmless fallback for an old database.
- A behavioral test of the server's startup refresh gate - the 021 finding scoped its fix to the watcher, and testing `main()` would need a refactor this phase does not need.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/system-skill-advisor-launcher.cjs` | Modify | Skip a heartbeat check after a long gap between the watchdog's own checks |
| `.skilled/skills/system-skill-advisor/runtime/lib/daemon/liveness.ts`, `runtime/advisor-server.ts` | Modify | Read the launcher PID before startup work and pass it to the watch |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts` | Modify | One coverage gate for the pre-embed check and both scoring paths, and no stale reason at weight 0 |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`, `runtime/handlers/advisor-recommend.ts` | Modify | No degraded lane at weight 0, and incomplete coverage leaves the live total |
| `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts` | Modify | Per-pass catch in the refresh, corrected stale-vector comments |
| `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` | Modify | A disabled hook's crash returns `{}` |
| `.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs` | Modify | Drop the route receipt at a boundary and hold the next turn until it finishes |
| `.skilled/skills/system-skill-advisor/runtime/lib/embedders/schema.ts` | Modify | Comment names the background refresh as a vector writer |
| Tests under `.skilled/bin/`, `runtime/tests/` and `hooks/tests/`, and the shared strip fixture | Create/Modify | One test per behavior change |
| Catalog, reference and playbook pages under `.skilled/skills/system-skill-advisor/` | Modify | State the shipped behavior |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | After a gap of more than two check intervals between its own checks, the launcher watchdog skips that check, and it still reaps a child that stays silent through the next one |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | The parent watch compares against the launcher PID read at the top of `main()` |
| REQ-003 | At lane weight 0 a stale projection leaves the lane's reason `lane_weight_zero` and keeps it out of the degraded lanes |
| REQ-004 | A live lane checks coverage before the prompt embed, skips the embed when coverage is incomplete, and that call drops the lane from the live total |
| REQ-005 | The exact rerank path refuses to score while coverage is incomplete |
| REQ-006 | A behavioral test shows the watcher's default reindex requests one refresh per reindex |
| REQ-007 | A refresh request queued while a pass throws still gets its pass |
| REQ-008 | A disabled hook that crashes returns `{}` |
| REQ-009 | The DSH adapter drops the session's route receipt at a session start or clean compaction, and the next turn waits for that work |
| REQ-010 | The two comments that named only the trusted scan as a vector writer name the background refresh too |
| REQ-011 | The shared strip fixture pins the last-marker case with its `ideal` answer, and both scorers pass it |
| REQ-012 | The runtime, bin, DSH and Python suites report no failure absent from the baseline, and the docs state the shipped behavior |
| REQ-013 | A refresh pass that fails after an earlier pass succeeded adds a `refresh pass failed` warning to the run's result |
| REQ-014 | A dimension mismatch, an unavailable adapter or an absent database also drops a live lane from the live total |
| REQ-015 | The launcher passes its own pid to the server at spawn, and the server compares its parent against that pid |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every new or changed behavior test fails with the source at `24749648b24` and passes after the fix.
- **SC-002**: The full runtime suite after `skill_graph_scan --trusted` reports no failure the baseline of 2559 passed and 8 skipped did not have.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The watchdog skip hides a real wedge that coincides with a sleep | Low | It skips one check only; the test shows a child silent through the next check is still reaped |
| Risk | Checking coverage before the embed adds a database read to each live prompt | Low | The lane already read coverage per prompt; the read is local and the default weight is 0 |
| Dependency | The compiled `dist/hooks/lib/route-receipt.js` for the DSH adapter | Med | The adapter loads it lazily, logs a failure and never blocks the turn on it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: At the default weight of 0 no prompt is embedded, as before.
- **NFR-P02**: A live lane with incomplete coverage makes no embed call.

### Security
- **NFR-S01**: No change reads or writes credentials or network settings.

### Reliability
- **NFR-R01**: A DSH boundary failure is logged and never reaches the host.
- **NFR-R02**: A refresh run rejects only when every pass in it threw.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a DSH boundary with no session id drops nothing and rotates nothing.
- Maximum input: several requests during one failing pass still cause one extra pass.
- Failure path: a watchdog suspended again right after a skip skips again, and a child silent through a normal check is reaped.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Eleven defects across nine source files, about 430 lines with tests and docs |
| Risk | 9/25 | Daemon lifetime and lane health contracts; no API or schema change |
| Research | 3/20 | The 021 report located each defect at file and line |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should the last-marker strip rule change? Decision: no. The 021 reviewer called the rule deliberate, and a pasted reply holding its own `Task:` line has the same shape, so the fixture pins the miss with its `ideal` answer.
<!-- /ANCHOR:questions -->

---
