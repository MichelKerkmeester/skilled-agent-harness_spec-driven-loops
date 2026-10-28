---
title: "CR-033 -- Opt-in minimum evidence gate"
description: "This scenario validates the M-2 minimum-evidence gate for `CR-033`. It focuses on the opt-in SK_CODE_REVIEW_MIN_CHANGED_LINES threshold, the numstat changed-line count, the exact skip status line for a small non-sensitive diff, and the sensitive-path taxonomy that forces the full review anyway."
version: 1.0.0.0
---

# CR-033 -- Opt-in minimum evidence gate

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-033`.

---

## 1. OVERVIEW

This scenario validates the M-2 minimum-evidence gate for `CR-033`. It focuses on a scratch repository with a five-line non-sensitive diff under an exported threshold, the exact skip line that diff produces, and a second run in the same repository where a `*token*` path arrives and the full review must run regardless of line count.

### Why This Matters

M-2 is the gate that trades a full review for a cheaper skip on trivially small diffs, and its whole safety rests on one exception: six high-risk path classes are never skipped. A gate that skips too eagerly hides exactly the defects a review exists to catch, and a gate that never skips is dead weight. The two halves need separate evidence, which is why this scenario runs the same threshold twice: once on a diff that must skip and once on a diff that must not. No other scenario exports the variable, runs the counting command, or asserts the skip line, so without this one the gate could change its threshold semantics, its count, or its taxonomy and the battery would stay green. `SKILL.md` §9.2 holds the contract and `scripts/README.md` holds the whole-output rule the checker enforces.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-033` and confirm the expected signals without contradictory evidence.

- Objective: confirm a sub-threshold non-sensitive diff produces the exact skip line and passes the final-line checker, and that a `*token*` path in the same repository forces the full review.
- Real user request: `Do not spend a full review on a tiny diff, but never skip auth code.`
- Prompt: `Review this small diff, skipping the full pass when the change is too small to matter, and never skip it when the diff touches auth, config, persistence, dependency or subprocess code.`
- Expected execution process: build the scratch fixture, export the threshold, run the numstat counting command, classify the changed paths against the six never-skip classes, emit the skip output, run the final-line checker over it as the whole output, then add a `*token*` path, re-count and re-classify.
- Expected signals: the first count is `5`, below the threshold of `50`, and src/total.js falls in no never-skip class; the skip output is exactly `Review status: COMMENTED (skipped: diff below evidence threshold of 50 lines, no sensitive paths touched)` and the checker exits 0; the second count is `9` and src/auth-token.js matches `*token*` in the Security / Authentication / Authorization class, so no skip line is emitted.
- Desired user-visible outcome: a small inert change that costs no full review, and an auth-adjacent change that always gets one.
- Pass/fail: PASS if the first count is below the threshold with no sensitive path, the skip line matches exactly and the checker exits 0, and the second diff is classified as sensitive so the full review runs; FAIL if the count or the threshold is misread, the skip line differs, the checker rejects it, or a sensitive-path diff is skipped.

**Exact prompt**:

```text
Review this small diff, skipping the full pass when the change is too small to matter, and never skip it when the diff touches auth, config, persistence, dependency or subprocess code.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this small diff, skipping the full pass when the change is too small to matter, and never skip it when the diff touches auth, config, persistence, dependency or subprocess code.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-033 | Opt-in minimum evidence gate | Confirm a sub-threshold non-sensitive diff produces the exact skip line and passes the final-line checker, and that a `*token*` path in the same repository forces the full review. | `Review this small diff, skipping the full pass when the change is too small to matter, and never skip it when the diff touches auth, config, persistence, dependency or subprocess code.` | bash: build the scratch fixture and export `SK_CODE_REVIEW_MIN_CHANGED_LINES=50` -> bash: count the changed lines with the documented numstat command and list the changed paths -> bash: emit the skip output and run the final-line checker over it as the whole output -> bash: add a src/auth-token.js change, re-count and re-list -> classify each changed path against the six never-skip classes | The first count is `5` against a threshold of `50` with src/total.js in no never-skip class; the skip output is exactly `Review status: COMMENTED (skipped: diff below evidence threshold of 50 lines, no sensitive paths touched)` and the checker exits 0; the second count is `9` and src/auth-token.js matches `*token*` in the Security class, so no skip line is emitted | Both counting transcripts, the changed-path lists, the skip output, the final-line checker output and exit status, and the class classification for each path | PASS iff the first count is below the threshold with no sensitive path, the skip line matches exactly and the checker exits 0, and the second diff is classified as sensitive so the full review runs; FAIL on a misread count or threshold, a skip line that differs, a checker rejection, or a skipped sensitive-path diff | 1. Confirm `SK_CODE_REVIEW_MIN_CHANGED_LINES` was exported in the same shell as the count; 2. Re-run the numstat command and confirm it prints one integer; 3. Re-classify the changed paths against the six never-skip classes before changing the verdict |

### Exact Commands

Step 1 builds the fixture and exports the threshold. Without the export the gate is disabled and every diff receives a full review.

```bash
CHECKOUT="$PWD"
SCRATCH="<scratch folder outside the repository>"
mkdir -p "$SCRATCH/repo/src"
cd "$SCRATCH/repo"
git init -q .
git config user.email operator@example.com
git config user.name Operator
git checkout -qb main
printf 'function total(items) {\n  return items.length;\n}\nmodule.exports = { total };\n' > src/total.js
git add -A && git commit -qm 'baseline'
git checkout -qb feature
printf 'function total(items) {\n  return items.length;\n}\nfunction count(items) {\n  return items.length;\n}\nmodule.exports = { total, count };\n' > src/total.js
git add -A && git commit -qm 'feat: add a count helper'
export SK_CODE_REVIEW_MIN_CHANGED_LINES=50
```

Step 2 runs the documented counting command and lists the changed paths that still exist.

```bash
BASE=main
LINES=$(git diff --numstat $BASE...HEAD | awk '{added+=$1; removed+=$2} END {print added+removed}')
echo "THRESHOLD=$SK_CODE_REVIEW_MIN_CHANGED_LINES"
echo "LINES=$LINES"
echo "BELOW=$([ "$LINES" -lt "$SK_CODE_REVIEW_MIN_CHANGED_LINES" ] && echo yes || echo no)"
git diff --name-only --diff-filter=d $BASE...HEAD
```

Step 3 writes the skip output and checks it. The checker ships with the mode, so the step returns to the checkout root that holds it.

```bash
printf 'Review status: COMMENTED (skipped: diff below evidence threshold of %s lines, no sensitive paths touched)\n' "$SK_CODE_REVIEW_MIN_CHANGED_LINES" > "$SCRATCH/skip-output.md"
cat "$SCRATCH/skip-output.md"
cd "$CHECKOUT"
node .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js "$SCRATCH/skip-output.md"
```

Step 4 adds a `*token*` path to the same repository, re-counts and re-lists. The count grows, but the reason the gate must not skip is the path class, not the count.

```bash
cd "$SCRATCH/repo"
printf 'function token(t) {\n  return t;\n}\nmodule.exports = { token };\n' > src/auth-token.js
git add -A && git commit -qm 'feat: add an auth token helper'
LINES_2=$(git diff --numstat $BASE...HEAD | awk '{added+=$1; removed+=$2} END {print added+removed}')
echo "LINES_2=$LINES_2"
echo "SENSITIVE_PATHS=$(git diff --name-only --diff-filter=d $BASE...HEAD | grep -c -e 'auth' -e 'token' || true)"
git diff --name-only --diff-filter=d $BASE...HEAD
```

### Expected

Step 2 prints a threshold of `50`, a count of `5`, and a single non-sensitive path:

```text
THRESHOLD=50
LINES=5
BELOW=yes
src/total.js
```

src/total.js matches no pattern in the six never-skip classes: it is not `auth*`, not a config file, not persistence, not a dependency manifest, not sandbox or subprocess code, and not a public-facing response path. Both conditions of the skip therefore hold, and step 3 prints:

```text
Review status: COMMENTED (skipped: diff below evidence threshold of 50 lines, no sensitive paths touched)
OK: review output ends on the exact status line
```

Step 4 prints a count of `9` and two paths, one of which the Security / Authentication / Authorization class matches through `*token*`:

```text
LINES_2=9
SENSITIVE_PATHS=1
src/auth-token.js
src/total.js
```

With a sensitive path in the diff the full review runs regardless of the count, so no skip line is written for step 4.

| Signal | Expected value |
| --- | --- |
| `THRESHOLD` | `50`, from the exported variable |
| Step 2 `LINES` | `5`, below the threshold |
| Step 2 never-skip classification | src/total.js matches no class |
| Step 3 skip line | `Review status: COMMENTED (skipped: diff below evidence threshold of 50 lines, no sensitive paths touched)` as the whole output |
| Step 3 checker | `OK: review output ends on the exact status line`, exit 0 |
| Step 4 `LINES_2` | `9` |
| Step 4 classification | src/auth-token.js matches `*token*` in the Security class, so the full review runs |
| Skip line for step 4 | none |

### Evidence

Both counting transcripts, both changed-path lists, the skip output file, the final-line checker output with its exit status, and the written classification of each changed path against the six never-skip classes.

### Pass / Fail

- **Pass**: step 2 prints `50`, `5` and `yes` with no never-skip class matched, step 3's output is exactly the skip line and the checker exits 0, and step 4 prints `9` with src/auth-token.js classified as sensitive so no skip line applies.
- **Fail**: the threshold is unset or misread, the count differs, a never-skip class is missed for the step 4 path, the skip line differs in wording or number, the checker rejects the skip output, or a skip is recorded for the step 4 diff.

### Failure Triage

1. Confirm `SK_CODE_REVIEW_MIN_CHANGED_LINES` was exported in the same shell as the count. The gate is opt-in: without it M-2 has zero effect and every diff receives a full review, which looks identical to a passing skip test until the skip line is read.
2. Re-run the counting command on its own. It must print one integer; a multi-line result means `--numstat` hit a binary file or the range was wrong.
3. If the checker rejects the skip output, quote its message. A trailing `Not checked:` line, a trailing blank line or any text after the status line fails, and the M-2 skip output carries none of them.
4. If step 4 produced a skip, re-read the six never-skip rows in `SKILL.md` §9.2 and name the class the path falls in. `*token*` sits in the first row.
5. A count that lands exactly on the threshold does not skip: the condition is strictly below.

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
| `../../SKILL.md` | Section 9.2 M-2 enable gate, counting command, six never-skip classes and skip behavior |
| `../../references/pr-state-dedup.md` | The sibling M-1 gate the depth alias maps `lite` onto |
| `../../scripts/check-review-final-line.js` | Accepts the skip status only as the whole output |
| `../../scripts/README.md` | States the whole-output rule the checker enforces |

---

## 5. SOURCE METADATA

- Group: Efficiency And Restraint
- Playbook ID: CR-033
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `efficiency-and-restraint/minimum-evidence-gate.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
