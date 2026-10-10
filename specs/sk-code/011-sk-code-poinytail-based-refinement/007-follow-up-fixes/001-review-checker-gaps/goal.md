---
title: "Goal: Phase 1: review-checker-gaps"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/001-review-checker-gaps"
    last_updated_at: "2026-10-10T05:34:18Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-007-001-review-checker-gaps"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: review-checker-gaps

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the review final-line checker reject the four outputs its contract forbids, each with a named reason, and prove each one with a tamper case in the existing rule-canary harness.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A skip status passes only as the whole output, meaning one line after the single trailing newline is removed. A skip status below any other line fails with `skip status must be the whole output`. |
| D2 | A bare status needs exactly one blank line above it, a `Not checked: ` line above that blank line, and exactly one `Not checked:` line in the output. The four failure messages are fixed text, and the existing wording `no "Not checked:" line above the status line` stays. |
| D3 | An unreadable input prints `cannot read <path or stdin>: <error message>`, then the usage line, and exits 2. The banner border widens to match the title, and the title text does not change. |
| D4 | Edits stay in the three files that the spec's Files to Change table names. The harness gains five tamper cases, each one exit-code check and one message check, so its PASS count goes from 38 to 48. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh; echo "exit=$?"` ends with `All rule-canary test cases passed` and `exit=0`, and `bash .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh 2>&1 | grep -c '^PASS '` prints `48`. This covers the skip, spacing, Not checked and unreadable-file messages (REQ-001 to REQ-003) and the 48-line count (REQ-005).
- [ ] `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js; echo "exit=$?"` and `node .opencode/skills/sk-code/sk-code-review/scripts/check-rule-copies.js; echo "exit=$?"` each print `OK: all rule invariants present (5 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 2 example output(s)).` and `exit=0`, which covers both example outputs (REQ-006).
- [ ] `python3 -I -c "import sys; ls=open('.skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js',encoding='utf8').read().split('\n'); w=[len(l) for l in ls[1:4]]; print(w[0]==w[1]==w[2])"` prints `True`, which shows the banner title and both border lines have equal length in code points (REQ-004).
- [ ] `grep -c 'must hold exactly one line that starts with' .skilled/skills/sk-code/sk-code-review/scripts/README.md` prints `1` (REQ-007).
- [ ] `diff -rq specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/001-review-checker-gaps/scratch/before-sk-code-review .skilled/skills/sk-code/sk-code-review; echo "exit=$?"` prints exactly three lines, each reading `Files ... differ`, that name `check-review-final-line.js`, `check-rule-copies.test.sh` and `scripts/README.md`, and it prints `exit=1`. No `Only in` line appears (SC-001).
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/001-review-checker-gaps --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| C1 harness prints 48 PASS lines and exits 0 | PASS | Harness exit=0, 48 `^PASS ` lines, last line `All rule-canary test cases passed` (scratch/final-harness.txt) |
| C2 both canary runs print the OK line and exit 0 | PASS | `.skilled` and `.opencode` canary runs each exit=0 with the OK line and `2 example output(s)` (scratch/final-canary.txt, scratch/final-canary-opencode.txt) |
| C3 banner title and border have equal length | PASS | Width check prints `True [81, 81, 81]` |
| C4 README row states the exact rules | PASS | `grep -c 'must hold exactly one line that starts with'` prints 1 |
| C5 scope diff names exactly three files | PASS | `diff -rq` names the three tracked files and exits 1, with no `Only in` line |
| C6 packet validates with RESULT: PASSED | PASS | `validate.sh <folder> --strict` gives `Errors: 0  Warnings: 0` and `RESULT: PASSED` (scratch/validate-final.txt) |

### Environment

- Node: v26.8.2
- Bash: GNU bash, version 3.2.57(1)-release (arm64-apple-darwin26)

### Deviations and findings

| Item | Note |
|------|------|
| Parent Files table omits `scripts/README.md` | This child lists the README because the brief asks for the row. The parent amendment is proposed in the spec's Open Questions and was not made. |
| Nested-child workflow asks for criteria repeated in the objective | The brief asks for a one-sentence objective, which matches the phase 004 goal. The orchestrator should confirm the parent's set string copies the criteria. |
| Halt at T005 on a goal.md edit conflict | The brief said not to edit goal.md, while T005 and the spec's Files table asked for a log entry. The coordinator allowed edits to this LOG section only, and the COMPLETION CRITERIA and Decisions stay as written. |
<!-- /ANCHOR:log -->
