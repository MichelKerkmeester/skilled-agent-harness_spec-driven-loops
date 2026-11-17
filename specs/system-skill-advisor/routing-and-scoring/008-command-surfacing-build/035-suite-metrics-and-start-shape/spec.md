---
title: "Feature Specification: Phase 35: suite-metrics-and-start-shape"
description: "The advisor suite writes health records into the operator's shared temp metrics folder, and the printed start rate hides how many starts are bare document reads. This phase gives each suite run its own temp folder and prints the shape of every start beside the rate."
trigger_phrases:
  - "suite metrics and start shape"
  - "phase 35 suite metrics and start shape"
  - "advisor suite shared metrics folder"
  - "start shape split per runtime"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 35: suite-metrics-and-start-shape

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 35 of 35 |
| **Predecessor** | 034-scorer-heredoc-redirect-fix |
| **Successor** | 036-start-rate-fixed-rule |
| **Handoff Criteria** | A full suite run leaves the shared metrics folder unchanged, and the rescored 033 summary prints a start shape split that sums to every started count |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 35** of the command surfacing build. It builds ranks 3 and 4 of research segment five. Ranks 1, 2 and 5 were declined until a full arm is designed.

**Scope Boundary**: the vitest config of the advisor runtime and the start judgment and summary of the transcript scorer. No advisor, runner, plugin, row or run-log change.

**Dependencies**:
- `009-ux-performance-cross-cli-research/research/research-segment-5.md`, ranks 3 and 4 and section 7 question 1
- Phase 034's fixed scorer and its `scratch/summary-rescore.json`, the baseline every start rate must equal
- The goal's fixed arm start rule (`../goal.md`, Arm start rule row)

**Deliverables**:
- A suite that writes its health records under its own temp folder
- `startShapes` per runtime and arm in the scorer summary
- `scratch/` evidence of both
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`lib/metrics.ts` keeps durable health records under `join(tmpdir(), 'speckit-skill-advisor-metrics')`, and the suite runs with the operator's own temp folder, so every suite run adds test records to the folder that the health readers and the research lanes read as real use. Separately, the scorer's printed start rate counts a document read with no write as a start, while the goal's fixed arm start rule calls that a lookup, and no printed number says how many starts are of that kind.

### Purpose
A suite run leaves the shared metrics folder untouched, and each start rate prints the shape of its starts so a reader can apply either rule without rescoring.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ find "$(node -p 'require("os").tmpdir()')/speckit-skill-advisor-metrics" -type f | wc -l   (before and after one run)
$ npx vitest run tests/handlers/advisor-status.vitest.ts
shared files before 724 after default run 729
$ TMPDIR=<fresh dir> npx vitest run tests/handlers/advisor-status.vitest.ts
after TMPDIR run 729; files under per-run dir 5
$ TMPDIR=<fresh dir> npx vitest run   (full suite)
exit 0, Test Files 185 passed, Tests 2319 passed | 6 skipped
shared files 729 -> 729, lines 26001 -> 26001; per-run metrics files 10

$ jq ... 034-scorer-heredoc-redirect-fix/scratch/summary-rescore.json
claude off startRate 2 of 15 startShapes absent
claude on startRate 3 of 15 startShapes absent
opencode off startRate 1 of 7 startShapes absent
opencode on startRate 3 of 10 startShapes absent
pi off startRate 3 of 14 startShapes absent
pi on startRate 6 of 15 startShapes absent
devin off startRate 2 of 11 startShapes absent
devin on startRate 6 of 12 startShapes absent
dsh off startRate 6 of 15 startShapes absent
dsh on startRate 10 of 15 startShapes absent
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create a per-run temp folder in `vitest.config.ts`, point `TMPDIR` at it before any worker starts and remove it when the run exits
- Return the start's shape from `startState`: skill load, `COMMAND:` started line, host expansion, read with a checkout write, or read alone
- Tally the shapes of counted starts per runtime and arm and print them as `startShapes` beside `startRate`
- Rescore the committed 033 lines and show every rate unchanged and every split summing to its started count

### Out of Scope
- Choosing which rule the printed rate follows - the operator's call (segment five question 1), and the split serves either answer
- Turn duration, the OpenCode delivery receipt and a longer cap - declined until a full arm is designed
- Removing the 77 sweep files already in the shared folder - outside git, so removal waits on the operator

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` | Modify | Per-run `TMPDIR` created at config load and removed on exit |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Modify | `startState` returns a shape, the tally and summary print `startShapes` |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | Modify | Cases for each shape and for the summary split |
| `035-suite-metrics-and-start-shape/scratch/` | Create | Before and after counts, the rescore and its comparison |
| `../goal.md` | Modify | Rows through the goal log command only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A full suite run reports 0 failed and leaves the shared metrics folder's file count and line count unchanged |
| REQ-002 | Rescoring the 033 lines prints every `startRate` equal to 034's `summary-rescore.json`, and every `startShapes` sums to that rate's started count |
| REQ-003 | `FLOOR` and `EVAL` print the same lines before and after. No prompt text is read or printed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Each of the five shapes has a test that `startState` returns it, and a read alone stays a start in `started` so no total changes |
| REQ-005 | The per-run temp folder is gone after the run, checked by its path recorded in `scratch/` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `find <shared folder> -type f | wc -l` prints the same number before and after `npx vitest run` in the advisor runtime
- **SC-002**: a `jq` check over the rescored summary prints 10 lines of `rate equal, shapes sum equal`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The session stores still holding the 033 sessions | The rescore cannot run | 034 loaded all 401 lines today. The rescore stops on any unscored line count above 033's |
| Risk | A longer `TMPDIR` pushes a test's unix socket path past the macOS limit | Med | The full suite already passed under a 58-character per-run path. The folder name stays short |
| Risk | A consumer compares the summary JSON key by key | Low | The new key is additive. The full suite runs after the change |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The config adds one folder create and one remove per suite run
- **NFR-P02**: The shape adds no pass over a session. It reuses the events `startState` already reads

### Security
- **NFR-S01**: The per-run folder is made with `mkdtempSync`, so it is private to the user like the shared one
- **NFR-S02**: No session text is printed. The evidence prints counts and shape names only

### Reliability
- **NFR-R01**: A run that crashes before exit may leave its folder. It sits under the system temp folder, which the OS clears
- **NFR-R02**: The rescore is deterministic, so two runs print the same summary

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a row with no expected command keeps `started` false and no shape
- Maximum input: a run that both loaded the command and read its document counts once, under the first shape in the fixed order
- Failure path: if the folder cannot be made, the config throws and the suite does not start, so no run falls back to the shared folder unnoticed
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | Three files, about 60 lines |
| Risk | 8/25 | Test environment and a print-only scorer field |
| Research | 3/20 | Both causes measured in segment five and here |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which rule should the printed start rate follow? Waiting on the operator (segment five question 1). This phase prints the split either answer needs.
<!-- /ANCHOR:questions -->

---
