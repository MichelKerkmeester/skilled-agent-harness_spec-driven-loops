---
title: "Feature Specification: Phase 6: deep-loop-findings-parser"
description: "The iteration findings parser that research verification and the fan-out merge share counts an indented numbered sub-step as a finding of its own and reads nothing from a section written as F### bullets, so an iteration's narrative count can disagree with the findings it lists."
trigger_phrases:
  - "deep loop findings parser"
  - "phase 6 deep loop findings parser"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: deep-loop-findings-parser

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/006-deep-loop-findings-parser` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-doc-claims-hardening |
| **Successor** | 007-hook-deadline-margins |
| **Handoff Criteria** | The three fixtures parse to two findings each, the new parser test file passes 5 of 5, the review reducer counts restated F### findings once, and the caller suites pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Round four children specification.

**Scope Boundary**: `parseIterationMarkdownFindings` in `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs` and one new test file for it, the structured-row rule in the review reducer `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` and one new case in its test file, and the deep-loop runtime changelog entry v1.9.4.0. The orchestrator assigned the reducer files to this child because they ship in the same runtime packet.

**Dependencies**:
- Known Limitations 4 in `../../010-round-three-remediation/006-deep-loop-follow-ups/implementation-summary.md` and the follow-ups in that child's `plan.md` section 6
- The deep-loop runtime changelog line, last bumped to 1.9.3.0 by that same child

**Deliverables**:
- Only a numbered line at the left margin opens a finding
- `- **F###**:` bullets at the left margin are read when the section has no numbered shape, and a section written in two shapes counts each finding once
- In the review reducer, `- **F###**:` findings yield to the delta rows and `findingDetails` of their iteration, as numbered findings already do
- A unit test file with five cases, one new reducer case and a runtime changelog entry v1.9.4.0

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`parseIterationMarkdownFindings` (`iteration-findings.cjs` lines 5 to 32) trims every line of the `## Findings` section before matching `^\d+\.\s+`, so a numbered sub-step indented under a finding counts as a finding of its own. A fixture with two findings and two indented steps parses to `count=4`. The same parser reads no `- **F###**:` bullets, so a section written in that shape parses to `count=0`. `verify-iteration.cjs` compares this count with a research iteration's `findingsCount`, and `fanout-merge.cjs` uses it to rebuild a research registry, so both read a wrong number. The review reducer `reduce-state.cjs` has its own reader and lets only numbered narrative findings yield to an iteration's structured rows, so an F### finding that the delta rows restate under other wording is counted twice. That happens in 146 of the 456 real review folders that reduce.

### Purpose
Every narrative shape the deep loops write is read once per finding, so the research count check and the registry rebuild agree with the findings an iteration lists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The margin rule for numbered lines in `parseIterationMarkdownFindings`
- Reading `- **F###**:` bullets as the lowest-precedence shape, one shape per section
- Letting F### findings yield to structured rows in the review reducer, and removing the set that only marked numbered findings
- A new unit test file for the parser and the runtime changelog entry v1.9.4.0

### Out of Scope
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` and the deep-research command assets - another session edits them in the main checkout
- The callers `verify-iteration.cjs` and `fanout-merge.cjs` - they already prefer structured findings over narrative ones and need no change
- The Hermes generator and the trigger-index rebuild - the orchestrator runs them once after all builds

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/iteration-findings.cjs` | Modify | Margin rule for numbered lines, F### bullets as a third shape, one shape per section |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/iteration-findings.vitest.ts` | Create | Five cases: margin rule, subheadings, F### shape, mixed shapes, no section |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | F### findings yield to structured rows, comment aligned, unused `numberedNarrativeFindings` set removed |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Modify | One case: F### bullets restated by delta rows reduce to 2 open findings, not 4 |
| `.skilled/skills/system-deep-loop/runtime/changelog/v1.9.4.0.md` | Create | Compact changelog entry for the deep-loop runtime |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/implementation-summary.md` | Modify | Build evidence |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/goal.md` | Modify | Progress rows |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/tasks.md` | Modify | Task state |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/006-deep-loop-findings-parser/scratch/` | Create | Capture files written by Phase 1 and Phase 3 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An indented numbered line in the Findings section is not a finding | `node <scratch>/probe/parse-fixture.cjs <scratch>/fixtures/iteration-indented.md` prints `count=2 titles=The guard compares paths lexically\|The stale comment names a removed flag` (before the build: `count=4`) |
| REQ-002 | `- **F###**:` bullets are read when the section has no numbered shape, and a section written in both shapes counts each finding once | The same probe prints `count=2 titles=Guard compares paths lexically\|Stale comment names a removed flag` for `iteration-fbullets.md` (before: `count=0`) and for `iteration-mixed.md` |
| REQ-003 | The parser has its own unit tests for the margin rule, subheadings, the F### shape, the mixed case and a missing section | `npx vitest run --no-coverage tests/unit/iteration-findings.vitest.ts` in the runtime prints `Tests  6 passed (6)` |
| REQ-007 | In the review reducer, an F### finding yields to the structured row of its iteration with the same id, so a restated finding counts once and a narrative-only finding is kept | The two reducer cases print `Tests  2 passed \| 11 skipped (13)` (the first fails `expected 4 to be 2` on the old reducer, the second `expected 1 to be 2` on the first build), and `handoff-review-yield.cjs` prints `mode=after dirs=499 same=310 changed=146 raised=0 liveErrors=43` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The suites that cover the parser's callers and the reducer stay green | The seven-file reducer command prints `Tests  153 passed (153)` (151 plus the two new cases) and the fan-out merge and closeout command prints `Tests  65 passed (65)`, and the reducer readers outside the runtime read the same as before |
| REQ-005 | The real-data ripple is recorded | The two review folders still reduce to `open=9` and `open=173`, and `compare-parser-real.cjs` prints `mode=after` with `changed=0` |
| REQ-006 | The runtime version moves to 1.9.4.0 with a valid compact changelog | `validate_document.py` prints `VALID`, `Document type: changelog` and `Total issues: 0`, and `hvr_scan.py` reports `hard blockers:          0` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: On every real research iteration under `specs/` whose state claims `findingsCount` with no structured findings, the parser's count matches the claim at least as often as before (planned 1087 of 2687 against 1075 today)
- **SC-002**: Nothing around the edit moves: the Hermes `--check` line reads the same after the build as before it and never names a system-deep-loop skill, `compiled-route-guard.cjs` still reads `system-deep-loop            fresh`, and the scope check shows only the five runtime paths this phase names
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The reducer rule lowers the open counts of 146 real review folders | Med | Every change is downward (`raised=0`), and the folder inspected lists each id twice under two wordings. The dashboards of those folders show fewer open findings on their next reduction |
| Risk | A research iteration whose top-level findings are all indented by one to three spaces now parses to fewer findings | Low | The real-data comparison shows 13 iterations gaining a claim match and 1 losing a coincidental one, recorded in `plan.md` section 5 |
| Risk | Other sessions add iteration files under `specs/` before the build | Low | The real-data checks compare the live parser with the planned one at run time, so new files do not change the expected `changed=0` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The narrative-findings question round three left open is decided in `plan.md` section 3 (decision D3) and built here.
<!-- /ANCHOR:questions -->

---
