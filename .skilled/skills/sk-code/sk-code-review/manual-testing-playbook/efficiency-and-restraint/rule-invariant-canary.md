---
title: "CR-024 -- Rule-invariant canary"
description: "This scenario validates the rule-invariant canary for `CR-024`. It focuses on check-rule-copies.js passing when the verdict triplet and cross-doc Iron Law wording agree and failing closed when any copy drifts, and that both documented example outputs end on a Not checked line then the exact status line."
version: 1.6.0.0
---

# CR-024 -- Rule-invariant canary

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-024`.

---

## 1. OVERVIEW

This scenario validates the rule-invariant canary for `CR-024`. It focuses on `check-rule-copies.js` passing when the verdict triplet and cross-doc Iron Law wording agree and failing closed when any copy drifts, and that both documented example outputs end on a Not checked line then the exact status line.

### Why This Matters

Some rules have to read identically in more than one place: the `Review status:` verdict triplet that downstream PR-state dedup logic keys on, and the cross-document Iron Law that forbids completion claims without verification. When an editor updates one copy and forgets the others, the docs silently disagree and the guarantee rots. The `scripts/check-rule-copies.js` canary added in v1.4.0.0 asserts the load-bearing substrings still exist across copies, validates the Iron Law lines in `workflow-verify.md` and the root `AGENTS.md`, and fails loudly when any copy drifts. It is a checker, not a generator. CR-024 proves the clean run passes, the self-test passes, and a tampered copy is caught with a non-zero exit. It also runs `scripts/check-review-final-line.js` over the example outputs in `SKILL.md` and `README.md`, because automation reads only the final line and string presence cannot prove a line is last.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-024` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the canary exits 0 when copies agree, its self-test passes, and a reworded Iron Law copy inside a seeded tree makes it exit non-zero without touching any tracked file.
- Real user request: `Prove the load-bearing review wording cannot silently drift across its copies.`
- Prompt: `Run the rule-invariant canary and its self-test, confirm a clean pass, then tamper one Iron Law copy and confirm the canary fails loudly.`
- Expected execution process: Run the deterministic command sequence, capture the transcript, compare the output against review references, and record a PASS, FAIL, or SKIP verdict with rationale; SKIP only when the node runtime needed to execute scripts/check-rule-copies.js is unavailable in the current environment. The tamper step mutates a copy in a scratch tree, never a tracked file.
- Expected signals: Step 1: canary exits 0 reporting the exact-string, Iron Law, delivery-prefix and example-output counts; Step 2: the self-test reports all cases pass; Step 3: the seeded copy passes, the same copy with one Iron Law phrase reworded makes the canary exit 1 and name the drifted concept, and the restore returns it to exit 0 with no tracked file touched.
- Desired user-visible outcome: a guard that passes silently when wording agrees and blocks loudly the moment any copy drifts.
- Pass/fail: PASS if the clean run exits 0, the self-test passes, and a tampered copy exits 1 per scripts/check-rule-copies.js; FAIL if drift is not caught or the clean run errors.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the invariant being guarded in plain language.
2. Confirm the canary, its self-test, and the copies it checks all resolve on disk.
3. Execute the deterministic steps exactly as written. The tamper step seeds a scratch tree first, so no tracked copy is ever mutated.
4. Compare the observed exit codes against the cited review source files.
5. Return a concise final verdict that names the uncaught drift when the scenario fails.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-024 | Rule-invariant canary | Confirm the canary exits 0 when copies agree, its self-test passes, and a reworded Iron Law copy inside a seeded tree makes it exit non-zero without touching any tracked file. | `Run the rule-invariant canary and its self-test, confirm a clean pass, then tamper one Iron Law copy and confirm the canary fails loudly.` | bash: node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js -> bash: bash .skilled/skills/sk-code/sk-code-review/scripts/tests/check-rule-copies.test.sh -> bash: seed the nine checked copies into a scratch tree -> bash: reword one Iron Law phrase in the copy -> bash: re-run the canary over the seeded tree expecting exit 1 -> bash: restore the copy and confirm exit 0 | Step 1: canary exits 0 reporting the exact-string, Iron Law, delivery-prefix and example-output counts; Step 2: self-test reports all cases pass; Step 3: the seeded copy passes, the reworded copy exits 1 and names the drifted concept, and the restore returns exit 0 | Clean-run output, self-test output, the seeded-tree run, the reworded-tree run with exit 1, the restored run, and `git status` over the tracked copies | PASS iff the clean run exits 0, the self-test passes, the reworded copy exits 1 naming the drifted concept, the restored tree exits 0, and no tracked file changed; FAIL if drift is not caught, the clean run errors, or the tamper touches a tracked file | 1. Confirm the seeded tree holds all nine checked copies; 2. Confirm the reword is the only difference from the seeded tree; 3. Restore the copy and re-run before changing the verdict |

### Exact Commands

Steps 1 and 2 run from the repository root and check the tracked tree.

```bash
node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js
bash .skilled/skills/sk-code/sk-code-review/scripts/tests/check-rule-copies.test.sh
```

Step 3 seeds the nine files the canary reads into a scratch tree, then mutates only that copy. The seed list is the same one the self-test uses, so the resulting failure is attributable to the one reword.

```bash
CHECKOUT="$PWD"
SCRATCH="<scratch folder outside the repository>"
for rel in \
  .skilled/skills/sk-code/sk-code-review/SKILL.md \
  .skilled/skills/sk-code/sk-code-review/README.md \
  .skilled/skills/sk-code/sk-code-review/changelog/v1.3.0.0.md \
  .skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md \
  .skilled/skills/sk-code/sk-code-review/references/review-ux-single-pass.md \
  .skilled/skills/sk-code/sk-code-review/references/review-core.md \
  .skilled/skills/sk-code/shared/references/workflow-verify.md \
  AGENTS.md \
  .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md; do
  mkdir -p "$SCRATCH/tree/$(dirname "$rel")"
  cp "$CHECKOUT/$rel" "$SCRATCH/tree/$rel"
done
node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js --root "$SCRATCH/tree"; echo "SEEDED_EXIT=$?"
node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8").replace("stack-appropriate verification","stack-appropriate checks"));' "$SCRATCH/tree/AGENTS.md"
node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js --root "$SCRATCH/tree"; echo "REWORDED_EXIT=$?"
cp "$CHECKOUT/AGENTS.md" "$SCRATCH/tree/AGENTS.md"
node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js --root "$SCRATCH/tree"; echo "RESTORED_EXIT=$?"
git status --short -- AGENTS.md
```

### Expected

Step 1 prints the invariant census and exits 0:

```text
OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).
```

Step 2 ends on `All rule-canary test cases passed` and exits 0.

Step 3 prints three exit codes and one named drift. The reword replaces `stack-appropriate verification` with `stack-appropriate checks`, which drops the `verification` concept from the Iron Law line:

```text
OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).
SEEDED_EXIT=0
MISSING: AGENTS.md: no "Iron Law" line carries all required concepts (completion claim, verification)

1 rule invariant(s) drifted. Restore the load-bearing wording in the file(s) above so every copy agrees.
REWORDED_EXIT=1
OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).
RESTORED_EXIT=0
```

The drift summary line on the reworded run opens with the canary's own drift label, which this package does not repeat because its verdict vocabulary is limited to the scenario outcomes.

The final `git status --short -- AGENTS.md` prints nothing, because every mutation happened inside the scratch tree and the tracked copy was never opened for writing.

| Signal | Expected value |
| --- | --- |
| Step 1 exit | `0`, with the invariant census on one line |
| Step 2 last line | `All rule-canary test cases passed` |
| Step 3 seeded tree | exit `0`, proving the seed list is complete |
| Step 3 reworded tree | exit `1`, with `MISSING: AGENTS.md` naming the dropped concept and a drift-summary line below it |
| Step 3 restored tree | exit `0` |
| `git status` over `AGENTS.md` | no output |

### Evidence

The clean-run output with its exit status, the self-test output, and the seeded, reworded and restored run outputs with their exit status, plus the `git status` line that shows no tracked file changed.

### Pass / Fail

- **Pass**: step 1 exits 0 with the invariant census, step 2 reports every case passing, the seeded tree exits 0, the reworded tree exits 1 and names the dropped concept, the restored tree exits 0, and `git status` over the tracked copies is empty.
- **Fail**: the clean run errors, the self-test reports a failure, the reworded tree exits 0, the restore does not return the tree to a clean run, or a tracked file changed.

### Failure Triage

1. Confirm the seeded tree holds all nine checked copies. A seeded run that already fails means the seed list is short a file, and the reworded failure then proves nothing.
2. Confirm the reword is the only difference from the seeded tree. Any other edit in the copy moves the failure away from the phrase under test.
3. Restore the copy and re-run before changing the verdict. A later run over an unrestored tree reports the reworded failure again and reads like a regression in the canary.
4. If `git status` is not empty, the tampers reached the tracked tree rather than the scratch copy, and the run is invalid regardless of its exit codes.

### Optional Supplemental Checks

To check the skill's own pins the way another repository would, run `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js --mode-only` from any folder outside this checkout. It prints `OK: mode rule invariants present (7 exact-string file(s) + 1 Iron Law file(s) + 6 extension floor(s) + 2 example output(s)).` and a `SKIPPED:` line that names the three `AGENTS.md` checks, and exits 0. Keep that output separate from the primary verdict.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../README.md` | Skill overview and current operator-facing description |

### Implementation Anchors

| File | Role |
|---|---|
| `../../scripts/check-rule-copies.js` | Rule-invariant canary asserting the verdict triplet and cross-doc Iron Law wording |
| `../../scripts/check-review-final-line.js` | Final-line checker the canary runs over the documented example outputs |
| `../../scripts/tests/check-rule-copies.test.sh` | Self-test proving the canary catches a dropped verdict string, a dropped Iron Law concept, and review outputs whose status line is not last |

---

## 5. SOURCE METADATA

- Group: Efficiency And Restraint
- Playbook ID: CR-024
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `efficiency-and-restraint/rule-invariant-canary.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
