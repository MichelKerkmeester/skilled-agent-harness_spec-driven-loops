---
title: "RRX-004 -- Card generator sync"
description: "This scenario validates the card generator sync for `RRX-004`. It focuses on idempotent card generation in a copy, the drift check catching an orphan card, a normal run deleting it, and the corpus checker's card sync check on both the copy and the live repository."
stage: routing
version: 1.0.0.0
---

# RRX-004 -- Card generator sync

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `RRX-004`.

---

## 1. OVERVIEW

This scenario validates the card generator sync for `RRX-004`. It focuses on idempotent card generation in a copy, the drift check catching an orphan card, a normal run deleting it, and the corpus checker's card sync check on both the copy and the live repository.

### Why This Matters

Cards are generated from the rule files and never edited by hand, because a hand-kept copy drifts the first time a rule changes. That promise holds only if three things hold together. A second generation run must change nothing, or every run rewrites files and hides real drift in noise. The `--check` mode must fail on any card no rule backs, or a deleted rule leaves a card that still loads. And the corpus checker must treat a repository with no cards directory as opted out, so the live repository passes until cards are adopted on purpose.

The scenario is deterministic and needs no executor. It works in a copy under a temporary directory, and the live repository is only read.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `RRX-004` and confirm the expected signals without contradictory evidence.

- Objective: prove card generation is idempotent, the drift check fails on an orphan, a normal run removes it, and card sync reads correctly on a copy with cards and on the live repository without them
- Real user request: `Make sure the rule card generator does not drift or leave stale cards behind.`
- Prompt: `Generate rule cards in a copy of the rule set and prove the generator is idempotent, its check catches an orphan card, and the live repo still has no cards.`
- Expected execution process: the router, the rules and their linked skill references are copied to a temporary root, `build-rule-cards.cjs --root` generates the cards twice, `--check` passes, a planted orphan makes `--check` fail, a normal run deletes the orphan, and `check-repo-rules.cjs` runs on the copy and then on the live repository.
- Expected signals: `written=13` then `unchanged=13`, `RESULT: PASSED (0 card problems)`, `cards/orphan-rule.md: orphaned` with `RESULT: FAILED (1 card problems)` and exit 1, `deleted=1`, `card sync - cards=13 every card matches its rule` on the copy, and `card sync - no cards directory` on the live repository.
- Desired user-visible outcome: the operator trusts that cards can only ever equal what the rules render today, and that the live repository has not adopted cards by accident.
- Pass/fail: PASS if every signal above is observed with the stated exit codes, FAIL if the second run writes anything, the orphan passes `--check`, the normal run leaves the orphan, or the live repository reports a cards directory.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Generate rule cards in a copy of the rule set and prove the generator is idempotent, its check catches an orphan card, and the live repo still has no cards.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| RRX-004 | Card generator sync | Verify card generation is idempotent, `--check` fails on an orphan, a normal run deletes it, and card sync reads correctly on a copy and on the live repository | `Generate rule cards in a copy of the rule set and prove the generator is idempotent, its check catches an orphan card, and the live repo still has no cards.` | 1. `bash: C=$(mktemp -d) && X=.skilled/skills/sk-doc/sk-create-repo-rule/scripts && mkdir -p "$C/.skilled/skills/sk-doc/sk-create-with-human-voice" && cp 'REPO RULES.md' "$C/" && cp -R .skilled/repo-rules "$C/.skilled/" && cp -R .skilled/skills/sk-doc/sk-create-with-human-voice/references "$C/.skilled/skills/sk-doc/sk-create-with-human-voice/"` -> 2. `bash: node "$X/build-rule-cards.cjs" --root "$C"` -> 3. `bash: node "$X/build-rule-cards.cjs" --root "$C"` -> 4. `bash: node "$X/build-rule-cards.cjs" --root "$C" --check` -> 5. `bash: printf '# Card: Orphan\n' > "$C/.skilled/repo-rules/cards/orphan-rule.md"` -> 6. `bash: node "$X/build-rule-cards.cjs" --root "$C" --check` -> 7. `bash: node "$X/build-rule-cards.cjs" --root "$C"` -> 8. `bash: node "$X/check-repo-rules.cjs" --root "$C"` -> 9. `bash: node "$X/check-repo-rules.cjs"` -> 10. `bash: rm -rf "$C"` | Step 2: `cards=13 written=13 unchanged=0 deleted=0`. Step 3: `written=0 unchanged=13`. Step 4: `RESULT: PASSED (0 card problems)`, exit 0. Step 6: `cards/orphan-rule.md: orphaned`, `RESULT: FAILED (1 card problems)`, exit 1. Step 7: `unchanged=13 deleted=1`. Step 8: `card sync - cards=13 every card matches its rule`, `RESULT: PASSED (11/11 checks)`. Step 9: `card sync - no cards directory`, `RESULT: PASSED (11/11 checks)` | Output and exit status of steps 2 through 9 | PASS if every step prints its expected line with the stated exit code. FAIL if step 3 writes a card, step 6 exits 0, step 7 deletes nothing, step 8 fails card sync, or step 9 finds a cards directory | 1. If step 3 writes cards, rendering is not deterministic, so diff a card across the two runs. 2. If step 8 fails check 7 rather than card sync, the copy is missing the linked skill references from step 1. 3. If step 9 finds cards, someone generated cards into the live repository, which is an adoption decision and not a test outcome |

### Commands

Run every step in one shell from the repository root, so `$C` and `$X` persist between steps.

1. `bash: C=$(mktemp -d) && X=.skilled/skills/sk-doc/sk-create-repo-rule/scripts && mkdir -p "$C/.skilled/skills/sk-doc/sk-create-with-human-voice" && cp 'REPO RULES.md' "$C/" && cp -R .skilled/repo-rules "$C/.skilled/" && cp -R .skilled/skills/sk-doc/sk-create-with-human-voice/references "$C/.skilled/skills/sk-doc/sk-create-with-human-voice/"`
2. `bash: node "$X/build-rule-cards.cjs" --root "$C"`
3. `bash: node "$X/build-rule-cards.cjs" --root "$C"`
4. `bash: node "$X/build-rule-cards.cjs" --root "$C" --check`
5. `bash: printf '# Card: Orphan\n' > "$C/.skilled/repo-rules/cards/orphan-rule.md"`
6. `bash: node "$X/build-rule-cards.cjs" --root "$C" --check`
7. `bash: node "$X/build-rule-cards.cjs" --root "$C"`
8. `bash: node "$X/check-repo-rules.cjs" --root "$C"`
9. `bash: node "$X/check-repo-rules.cjs"`
10. `bash: rm -rf "$C"`

### Expected

Step 1 copies the router, the rules and the skill references the rules link to. Without those references, step 8 fails check 7 with three unresolved links, which tests the copy rather than the cards.

Step 2 prints `[rule-cards] cards=13 written=13 unchanged=0 deleted=0 dir=.skilled/repo-rules/cards`. The count is the number of rule files, so it follows the live rule set. Step 3 prints `written=0 unchanged=13 deleted=0`, proving a rerun touches nothing. Step 4 prints `[rule-cards] RESULT: PASSED (0 card problems)` and exits 0.

Step 6 prints `[rule-cards] cards/orphan-rule.md: orphaned` and `[rule-cards] RESULT: FAILED (1 card problems)` and exits 1. The check mode only reports and writes nothing, so the orphan is still present. Step 7, a normal run, prints `unchanged=13 deleted=1`, removing the card no rule backs.

Step 8 prints all eleven checks passing, with `11/11 PASS card sync - cards=13 every card matches its rule`, and `RESULT: PASSED (11/11 checks)`. Step 9, on the live repository, prints `11/11 PASS card sync - no cards directory` and `RESULT: PASSED (11/11 checks)`. A missing cards directory is an opt-out and passes.

### Evidence

Capture the output and exit status of steps 2 through 9. The step 3 line and the step 6 exit status are the central evidence: one proves idempotence, the other proves an orphan cannot pass silently.

### Pass / Fail

- **Pass**: step 2 writes every card, step 3 writes none, step 4 passes, step 6 fails with exit 1 naming the orphan, step 7 deletes exactly one card, step 8 passes 11 of 11 with cards matching, and step 9 passes 11 of 11 with no cards directory.
- **Fail**: step 3 writes a card, step 6 exits 0, step 7 leaves the orphan, step 8 fails card sync, or step 9 reports a cards directory.

### Failure Triage

1. Writes on step 3 mean rendering depends on something other than the rule text, such as directory order or line endings. Diff one card between the two runs.
2. A step 8 failure on check 7 means step 1 missed the linked skill references. A failure on check 11 means the generator and the checker render differently, and both import the same `renderCard`, so check for a local edit to either script.
3. A cards directory in step 9 is not a test failure to fix by deleting it. Cards in the live repository are an adoption decision, so report who generated them.
4. `--root` must point at a directory holding both `REPO RULES.md` and a rules directory. Any other root exits 2 with `no REPO RULES.md with a .skilled/repo-rules or repo-rules directory found`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| No feature-catalog entry | This packet ships no `feature-catalog/`, so no catalog cross-reference exists for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`scripts/build-rule-cards.cjs`](../../scripts/build-rule-cards.cjs) | Primary implementation anchor, `renderCard`, `cardDrift` and `writeCards` |
| [`scripts/check-repo-rules.cjs`](../../scripts/check-repo-rules.cjs) | Check 11, card sync |
| [`test_build_rule_cards.py`](../../../scripts/tests/test_build_rule_cards.py) | Byte-identical regeneration, 11 of 11 after generating, check 11 drift, and `--check` writing nothing |

---

## 5. SOURCE METADATA

- Group: RULE LOADING EXPERIMENTS
- Playbook ID: RRX-004
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `rule-loading-experiments/card-generator-sync.md`
