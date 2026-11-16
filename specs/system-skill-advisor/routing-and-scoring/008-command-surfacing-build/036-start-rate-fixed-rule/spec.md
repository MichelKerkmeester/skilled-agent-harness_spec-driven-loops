---
title: "Feature Specification: Phase 36: start-rate-fixed-rule"
description: "The printed start rate counts a bare document read as a start, while the goal's fixed arm start rule calls it a lookup. On the operator's go-ahead to take the recommended option, this phase makes the start rate follow the fixed rule, keeps the lookups visible and restates every printed rate it moves."
trigger_phrases:
  - "start rate fixed rule"
  - "phase 36 start rate fixed rule"
  - "document read is a lookup not a start"
  - "restated start rates 007 and 033"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 36: start-rate-fixed-rule

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 36 of 36 |
| **Predecessor** | 035-suite-metrics-and-start-shape |
| **Successor** | None |
| **Handoff Criteria** | The goal log restates the 007 before and after start rates and the 033 arm start rates under the fixed rule, each from a printed line |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 36** of the command surfacing build. It settles research segment five's question 1, which the operator handed back on 2026-11-16 with "do what you would recommend".

**Scope Boundary**: the start judgment of the transcript scorer, its tests and the routing-accuracy README. No runner, advisor, row or run-log change, and the decline and skill-only counts already follow the rule.

**Dependencies**:
- Phase 035's `startShapes`, which this phase keeps and re-reads
- The fixed arm start rule (`../goal.md`, Arm start rule row)
- The stored 007 start set (`007-per-runtime-behaviour-proof/scratch/runs-pre.jsonl` and `runs-post.jsonl`) and the 033 run lines

**Deliverables**:
- A start rate that follows the fixed rule, with lookups printed beside it
- Restated 007 and 033 start rates in the goal log
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The goal fixed the arm start rule before the first session: a run starts a command by a skill call naming it, a `COMMAND:` started line, a host expansion, or a read of its document plus a write in the checkout, and a read alone is a lookup. The decline and skill-only counts follow that rule, but `startState` counts a read alone as a start, so the printed start rate and the verdict's rule disagree. Phase 035's split shows the gap is large: most printed starts are reads alone.

### Purpose
One start rule across every printed number, with the lookups still printed so the old count stays recoverable.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node score-command-transcripts.mjs --summary 007/runs-pre.jsonl 007/runs-post.jsonl --json   (at 267c27fc5df, saved as scratch/start-007-before.json)
claude pre start 4 of 12 readOnly 1 fixedRule 3 of 12 unsafe 0
claude post start 4 of 12 readOnly 1 fixedRule 3 of 12 unsafe 0
codex pre start 1 of 12 readOnly 1 fixedRule 0 of 12 unsafe 0
codex post start 1 of 12 readOnly 1 fixedRule 0 of 12 unsafe 0
pi pre start 3 of 11 readOnly 3 fixedRule 0 of 11 unsafe 2
pi post start 2 of 10 readOnly 1 fixedRule 1 of 10 unsafe 0
devin pre start 1 of 8 readOnly 1 fixedRule 0 of 8 unsafe 1
devin post start 3 of 9 readOnly 1 fixedRule 2 of 9 unsafe 1
opencode pre start 2 of 7 readOnly 2 fixedRule 0 of 7 unsafe 2
opencode post start 2 of 5 readOnly 1 fixedRule 1 of 5 unsafe 0
dsh pre start 6 of 12 readOnly 5 fixedRule 1 of 12 unsafe 1
dsh post start 9 of 12 readOnly 6 fixedRule 3 of 12 unsafe 0

$ cat 035-suite-metrics-and-start-shape/scratch/shape-check.txt   (033 arm, on arm)
claude 3 of 15 readOnly=3, opencode 3 of 10 readOnly=2, pi 6 of 15 readOnly=5, devin 6 of 12 readOnly=4, dsh 10 of 15 readOnly=4
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make `startState`'s `started` follow the fixed rule, so a read alone is not a start, and keep its shape as `readOnly`
- Count lookups apart in the tally, so `startShapes.readOnly` holds them and the other four shapes sum to `started`
- State the rule and the `startShapes` field in the routing-accuracy README's scorer row
- Rescore the 007 start set and the 033 arm, and log the restated rates

### Out of Scope
- The decline and skill-only counts - they already follow the rule through `startedCommand`
- The `unsafe` count - it judges any write, not a start, and is unchanged
- Rerunning any live session - the restatement reads the stored lines

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Modify | `startState` and the tally follow the fixed rule |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | Modify | Cases that expected a read alone to start now expect a lookup |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | Modify | The scorer row states the rule and `startShapes` |
| `036-start-rate-fixed-rule/scratch/` | Create | Before and after summaries and their comparison |
| `../goal.md` | Modify | Rows through the goal log command only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | For every runtime and arm of the 007 start set and the 033 arm, the new `startRate` numerator equals the old numerator minus the old `startShapes.readOnly`, with the same denominator |
| REQ-002 | The advisor suite reports 0 failed, and `FLOOR` and `EVAL` print the lines of phase 035's `after.txt` |
| REQ-003 | The decline and skill-only counts of the 033 rescore equal 034's: decline on 0 of 80, skill-only 0 of 40 in each arm |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | A test shows a read alone returns `started` false with shape `readOnly`, and a read with a checkout write returns `started` true |
| REQ-005 | The goal log holds a restated 007 start rate row and a restated 033 start rate row, and the README states the rule |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: a `jq` check over the before and after summaries prints 22 lines (12 for 007, 10 for 033) reading `numerator moved by readOnly, denominator equal`
- **SC-002**: the README's scorer row names the rule for `startRate` and lists `startShapes`, checked with `rg -c 'startShapes' scripts/routing-accuracy/README.md` printing at least 1
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The session stores holding the 007 and 033 sessions | A store pruned since today cannot be rescored | Both sets rescored today. The check stops on any unscored count that differs from the before summary |
| Risk | A published figure quotes the old rate | Med | The goal log restates both sets. Older rows stay as written, append-only |
| Risk | A test fixture relied on a read alone starting | Low | Those tests change with the rule, and each change is listed in the summary |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: No new pass over a session. The write check reuses `firstWritePosition`
- **NFR-P02**: The rescore of both sets runs in under 10 minutes

### Security
- **NFR-S01**: No session text is printed. The checks print counts only
- **NFR-S02**: `.skilled/hooks/hook-flags.env` is never read or created

### Reliability
- **NFR-R01**: The rescore is deterministic
- **NFR-R02**: Committed evidence of earlier phases stays unchanged

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a row with no expected command stays not started with no shape
- Maximum input: a run that read the document and wrote only outside the checkout is a lookup
- Failure path: a line with no `projectDir` falls back to the scratch-folder rule `insideCheckout` already uses
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One function, its tally, tests and one README row |
| Risk | 10/25 | Changes printed rates that earlier rows quote |
| Research | 2/20 | Measured in phase 035 and above |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator asked for the recommended option on 2026-11-16.
<!-- /ANCHOR:questions -->

---
