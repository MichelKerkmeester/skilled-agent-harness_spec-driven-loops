---
title: "Feature Specification: Phase 34: scorer-heredoc-redirect-fix"
description: "The transcript scorer reads a > comparison inside a heredoc body as a redirect into the checkout, so a document read becomes a start. That misread made the untuned arm's only decline start and fired the B-5 trigger. This phase fixes the parser, rescores the phase 033 lines and logs the corrected verdict and trigger."
trigger_phrases:
  - "scorer heredoc redirect fix"
  - "phase 34 scorer heredoc redirect fix"
  - "heredoc comparison misread as write"
  - "untuned arm rescore b-5 trigger"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 34: scorer-heredoc-redirect-fix

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 34 of 34 |
| **Predecessor** | 033-untuned-arm-arena-run |
| **Successor** | 035-suite-metrics-and-start-shape |
| **Handoff Criteria** | The parent goal log holds a rescored arm verdict row and a B-5 trigger row, each from a printed line of the fixed scorer |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 34** of the command surfacing build. It fixes a scorer fault that phase 033's arm verdict and B-5 trigger rest on.

**Scope Boundary**: one parser fix in the transcript scorer, its tests and a rescore of the committed 033 run lines. No runner, advisor, row file or run log changes, and no live session runs.

**Dependencies**:
- Phase 033's committed run lines (`033-untuned-arm-arena-run/scratch/runs/*.jsonl`) and the session stores that still hold their sessions
- The arm target and start rule fixed before the first session (`../goal.md`, Arm target and Arm start rule rows) and the B-5 rule (P036)
- The coordinator's check in `009-ux-performance-cross-cli-research/research/research-segment-5.md`, section 7, question 9

**Deliverables**:
- The fixed `redirectTargets` and its tests
- `scratch/summary-rescore.json`, `scratch/rescore-evidence.txt` and a diff against phase 033's evidence
- Goal log rows for the rescored verdict and the B-5 trigger
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`redirectTargets` in the transcript scorer scans a whole shell command for `>`, heredoc bodies included, while `shellReadTargets` and `shellWriteTargets` strip those bodies first. A Python comparison such as `len(x)>0` inside a heredoc therefore reads as a redirect to a relative file, and `insideCheckout` counts every relative path as inside the checkout. That gave `startedCommand` the write boundary it needs, so DSH's run 1 of `fresh-decline-refusal-02` counted as a start of `/create:sk-skill` when it only read the document. That one start is the arm's only decline start and the B-5 trigger.

### Purpose
The scorer reads only real redirects as writes, and the arm's verdict and B-5 trigger are restated from a rescore with the fixed scorer.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node heredoc-probe.mjs   (a Read of /arena/.claude/commands/create/sk-skill.md, then one Bash call, through normalize and startedCommand at 8bc85acbf12)
body ["0:"] started /create:sk-skill        (python3 - <<'PY' ... if len(sys.argv)>0: ... PY)
opening ["notes.txt"] started /create:sk-skill   (cat <<'EOF' > notes.txt ... EOF)

$ node heredoc-reach.mjs   (033 run lines, sessions through loadSession and normalize, counts only)
claude   80 lines, 0 whose only checkout writes are heredoc-body redirects
opencode 80 lines, 2 (fresh-decline-refusal-02 off1, fresh-fit-14 on1)
pi       80 lines, 1 (fresh-fit-14 off1)
devin    81 lines, 3 (fresh-fit-14 off1 and on1, fresh-decline-app-problem-02 on1)
dsh      80 lines, 6 (fresh-decline-refusal-02 off1 and on1, fresh-fit-14 off1 and on1, fresh-skill-07 off1 and on1)

$ grep '^| B-5 trigger |' ../goal.md
| B-5 trigger | Fired | starts dsh on decline 1 of 16: fresh-decline-refusal-02 on run 1 started /create:sk-skill ...
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Strip heredoc bodies in `redirectTargets` with the `HEREDOC_BODY` pattern the other two shell parsers use, keeping a redirect on the heredoc's opening line
- Add scorer tests for a body comparison, an opening-line redirect and the DSH shape under `startedCommand`
- Rescore the committed 033 run lines with the fixed scorer and write the evidence with the 026 filters
- Log the rescored verdict, decline starts and B-5 trigger decision as new goal rows, leaving 033's rows in place

### Out of Scope
- The segment five measurement builds (turn duration and cap flag, OpenCode delivery receipt, suite metrics folder, start-shape print) - a later phase, so this one changes one parser
- Any advisor, runner, row or run-log change - the rescore must read the same lines 033 read
- Building B-5 - this phase only decides whether its trigger stands

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Modify | `redirectTargets` strips heredoc bodies before it scans |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | Modify | Three cases for the heredoc redirect |
| `034-scorer-heredoc-redirect-fix/scratch/` | Create | Rescore summary, evidence and diff |
| `../goal.md` | Modify | Rows through the goal log command only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node heredoc-probe.mjs` prints `body [] started null` and `opening ["notes.txt"] started /create:sk-skill` after the fix |
| REQ-002 | The advisor suite reports 0 failed, and `FLOOR` and `EVAL` print the same lines before and after the fix |
| REQ-003 | No prompt text is read or printed. Every number in the rescore comes from the committed scorer and the 026 filters |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `scratch/rescore-evidence.txt` holds the same line kinds as 033's `arm-evidence.txt`, and `scratch/rescore-diff.txt` lists every changed line |
| REQ-005 | The goal log holds a rescored verdict row and a B-5 trigger row, decided by the rules fixed before the arm |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node heredoc-reach.mjs` prints 0 lines whose only checkout writes are heredoc-body redirects on all five runtimes
- **SC-002**: `rg -c '^\| B-5 trigger, rescored \|' ../goal.md` prints 1, and its decline count matches `rescore-evidence.txt`
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The session stores holding the 033 sessions | A store pruned since 033 cannot be rescored | T001 loads every line first and stops the phase if any fails |
| Risk | The fix drops a real redirect written after a heredoc on the same line | Med | `HEREDOC_BODY` keeps the opening line, and a test pins `cat <<'EOF' > notes.txt` |
| Risk | Other rows' followed counts move with the boundary | Low | Expected. The diff lists each change and the verdict reads the rescore |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The rescore reads 401 lines in under 10 minutes, as 033's scoring did
- **NFR-P02**: The fix adds one regex replace per shell call, with no new pass over the session

### Security
- **NFR-S01**: No session text is printed. Scripts print counts, row ids and target names only
- **NFR-S02**: `.skilled/hooks/hook-flags.env` is never read or created

### Reliability
- **NFR-R01**: The rescore is deterministic, so two runs print the same summary
- **NFR-R02**: 033's committed files stay unchanged, checked with `git diff --quiet`

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a shell call with no command yields no redirect, as before
- Maximum input: two heredocs in one call strip both bodies, because `HEREDOC_BODY` is global
- Failure path: an unterminated heredoc does not match the pattern, so its body is scanned as before and the fix changes nothing for it
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | One function, one test file, one rescore |
| Risk | 10/25 | The scorer feeds every arm number and the B-5 decision |
| Research | 3/20 | The cause is found and reproduced |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The B-5 rule (P036) and the arm target decide the outcome from the rescore.
<!-- /ANCHOR:questions -->

---
