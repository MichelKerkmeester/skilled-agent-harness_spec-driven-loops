---
title: "CR-037 -- Deleted path in the resolver call"
description: "This scenario validates the resolver's deleted-path defence for `CR-037`. It focuses on the FILE_NOT_FOUND stop and exit 3 that one deleted path causes, the --diff-filter=d filter that leaves it out, and the Not checked line a review owes a deleted path whose removal matters."
version: 1.0.0.0
---

# CR-037 -- Deleted path in the resolver call

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `CR-037`.

---

## 1. OVERVIEW

This scenario validates the resolver's deleted-path defence for `CR-037`. It focuses on a scratch repository whose feature branch deletes one file and edits another, on the resolver call that stops on the first list, and on the filtered call that succeeds, plus the `Not checked:` line the review writes for the deleted path.

### Why This Matters

`quality-gate.cjs --explain` names a path that is not an existing regular file as `FILE_NOT_FOUND` and stops the whole call with exit 3. A review that passes `git diff --name-only` output straight through therefore loses every surface and every override for the files that do exist, because of one deletion elsewhere in the diff. The documented defence is `--diff-filter=d` for a diff and a regular-file test for a file list, and the deleted path still has to be accounted for: the contract asks the review to name it on the `Not checked:` line when the removal matters, such as a deleted test or a removed caller. Nothing else in the battery exercises either half, so an invocation that stops on any deletion, or one that hides the deletion by dropping the path silently, would pass unnoticed.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CR-037` and confirm the expected signals without contradictory evidence.

- Objective: confirm the unfiltered resolver call stops with `FILE_NOT_FOUND` and exit 3, the filtered call resolves the remaining file and exits 2, and the review names the deleted path on `Not checked:`.
- Real user request: `This branch deletes a helper and edits another file; review the edit without losing the surface evidence over the deletion.`
- Prompt: `Review this branch before I merge it. It deletes the legacy helper and adds a sum function.`
- Expected execution process: build the scratch fixture with one deleted path and one edited path, run the resolver on the unfiltered list, run it again on the filtered list, run the exact prompt through the review executor, run both report checkers, and read the `Not checked:` line.
- Expected signals: the unfiltered call prints `"exit_code": 3` with a `FILE_NOT_FOUND` error naming the deleted path and exits 3; `--diff-filter=d` prints only the surviving path; the filtered call prints `code-quality-explain/v1` with one `files[]` entry and exits 2; the report's `Not checked:` line names the deleted path and says what could not be checked about it.
- Desired user-visible outcome: a review that keeps the surface evidence for the files that exist and states, in one line, what the deletion left unread.
- Pass/fail: PASS if the unfiltered call exits 3 with `FILE_NOT_FOUND`, the filtered call exits 2 with one resolved file, the report's `Not checked:` line names the deleted path, and both checkers exit 0; FAIL if the review resolves nothing because of the deletion, reports a surface for a file that no longer exists, or omits the deleted path from `Not checked:`.

**Exact prompt**:

```text
Review this branch before I merge it. It deletes the legacy helper and adds a sum function.
```

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Review this branch before I merge it. It deletes the legacy helper and adds a sum function.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CR-037 | Deleted path in the resolver call | Confirm the unfiltered resolver call stops with `FILE_NOT_FOUND` and exit 3, the filtered call resolves the remaining file and exits 2, and the review names the deleted path on `Not checked:`. | `Review this branch before I merge it. It deletes the legacy helper and adds a sum function.` | bash: build the scratch fixture with one deleted and one edited path -> bash: run the resolver on the unfiltered changed-path list and record exit 3 -> bash: run it again on the `--diff-filter=d` list and record exit 2 -> agent: @review the filtered scope -> bash: run both report checkers over the saved output | The unfiltered call prints `"exit_code": 3` with a `FILE_NOT_FOUND` error naming the deleted path and exits 3; `--diff-filter=d` prints one path; the filtered call prints `code-quality-explain/v1` with one `files[]` entry and exits 2; the `Not checked:` line names the deleted path | Both resolver transcripts with exit status, the changed-path lists, the saved review output, both checker outputs, executor, model, duration and token count | PASS iff the unfiltered call exits 3 with `FILE_NOT_FOUND`, the filtered call exits 2 with one resolved file, the `Not checked:` line names the deleted path, and both checkers exit 0; FAIL if the review resolves nothing because of the deletion, names a surface for the deleted file, or omits it from `Not checked:` | 1. Confirm the fixture deletes exactly one path; 2. Re-run both resolver calls and compare their exit status; 3. Quote the `Not checked:` line before changing the verdict |

### Exact Commands

Step 1 builds the fixture. The feature branch edits src/total.js and deletes src/legacy.js, so one path in the diff no longer exists on disk.

```bash
HUB="<checkout root>/.skilled/skills/sk-code"
SCRATCH="<scratch folder outside the repository>"
mkdir -p "$SCRATCH/repo/src"
cd "$SCRATCH/repo"
git init -q .
git config user.email operator@example.com
git config user.name Operator
git checkout -qb main
printf 'function total(items) {\n  return items.length;\n}\nmodule.exports = { total };\n' > src/total.js
printf 'function legacy(x) {\n  return x;\n}\nmodule.exports = { legacy };\n' > src/legacy.js
git add -A && git commit -qm 'baseline'
git checkout -qb feature
printf 'function total(items) {\n  return items.length;\n}\nfunction sum(items) {\n  return items.reduce((a, b) => a + b, 0);\n}\nmodule.exports = { total, sum };\n' > src/total.js
git rm -q src/legacy.js
git add -A && git commit -qm 'feat: add sum and drop the unused legacy helper'
```

Step 2 runs the resolver on the unfiltered list. The call stops on the deleted path and exits 3.

```bash
BASE=main
git diff --name-only $BASE...HEAD
node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --explain $(git diff --name-only $BASE...HEAD) > "$SCRATCH/unfiltered.json" 2> "$SCRATCH/unfiltered.err"
echo "UNFILTERED_EXIT=$?"
cat "$SCRATCH/unfiltered.err"
node -e 'const j=require(process.argv[1]);console.log("exit_code "+j.exit_code);console.log("errors "+JSON.stringify(j.errors))' "$SCRATCH/unfiltered.json"
```

Step 3 filters the deleted path out and runs the resolver again. Run the resolver from the fixture root, the reviewed repository.

```bash
git diff --name-only --diff-filter=d $BASE...HEAD
node "$HUB/sk-code-quality/scripts/quality-gate.cjs" --explain $(git diff --name-only --diff-filter=d $BASE...HEAD) > "$SCRATCH/filtered.json"; echo "FILTERED_EXIT=$?"
node -e 'const j=require(process.argv[1]);console.log("schema "+j.schema);console.log("files "+JSON.stringify(j.files.map(f=>f.file)));console.log("surfaces "+JSON.stringify(j.surfaces))' "$SCRATCH/filtered.json"
```

Step 4 runs the exact prompt through the review executor over the filtered scope and saves the output as `<saved review output>`.

Step 5 runs both checkers over the saved output, from the checkout root:

```bash
node .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js <saved review output>
node .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js <saved review output>
```

### Expected

Step 2 lists both paths, then the resolver stops on the one that no longer exists:

```text
src/legacy.js
src/total.js
UNFILTERED_EXIT=3
quality-gate: FILE_NOT_FOUND: src/legacy.js is not an existing regular file
exit_code 3
errors [{"code":"FILE_NOT_FOUND","message":"src/legacy.js is not an existing regular file","repair":"name an existing regular file"}]
```

Step 3 prints the surviving path, resolves it, and exits 2. The `filtered.json` document is a `code-quality-explain/v1` document with one entry, and the fixture resolves no specific surface because it carries no hub config of its own, so the label reads `UNKNOWN`.

```text
src/total.js
FILTERED_EXIT=2
schema code-quality-explain/v1
files ["src/total.js"]
surfaces ["UNKNOWN"]
```

Step 4 returns a report that resolves the reviewed file against the filtered list, names the deleted path on `Not checked:` and explains why, and does not claim a surface for a file that no longer exists. The `Not checked:` line is the one running line, and the report ends:

```text
Not checked: src/legacy.js was deleted in this range, so its removal as a former export of the edited module was read from the diff alone

Review status: APPROVED
```

Step 5 prints `OK: review output ends on the exact status line`, then `OK: no numbered findings to check` for a report with no findings, and each checker exits 0.

| Signal | Expected value |
| --- | --- |
| Unfiltered resolver exit | `3` |
| Unfiltered error code | `FILE_NOT_FOUND`, naming src/legacy.js |
| `--diff-filter=d` output | src/total.js alone |
| Filtered resolver exit | `2`, the advisory exit |
| Filtered document | schema `code-quality-explain/v1`, one `files[]` entry, `surfaces ["UNKNOWN"]` |
| `Not checked:` line | names src/legacy.js and the reason it could not be read |
| Final-line and findings checkers | exit 0 |

### Evidence

Both resolver transcripts with their exit status and stderr, both changed-path lists, the saved review output, both checker outputs, and the executor, model, duration and token count.

### Pass / Fail

- **Pass**: the unfiltered call exits 3 with `FILE_NOT_FOUND` naming the deleted path, the filtered call exits 2 with one resolved file, the report resolves only files that exist, its `Not checked:` line names the deleted path with a reason, and both checkers exit 0.
- **Fail**: the review runs the resolver on the unfiltered list and reports no surfaces, names a surface for the deleted file, reports a successful resolution for a list the resolver refused, or omits the deleted path from `Not checked:`.

### Failure Triage

1. Confirm the fixture deletes exactly one path. Two deletions change nothing about the exit code but make the `Not checked:` line easy to get half right.
2. Re-run both resolver calls and compare their exit status. A `0` from either means the call came from a wrapper rather than the runner.
3. If the unfiltered call exits 2, the deleted path was not passed in, so the list was already filtered and the defence was never exercised.
4. If the report names the deleted file in `Surface evidence used`, the review resolved it before the deletion, or inferred a surface by hand instead of reading the resolver.
5. Quote the `Not checked:` line. A line that reads `Not checked: nothing material` while the diff deletes a file is the failure this scenario exists to catch.

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
| `../../SKILL.md` | Section 3 Phase 1 filter, the `FILE_NOT_FOUND` stop, the per-list guidance and the `Not checked:` rule for a deleted path |
| `../../../sk-code-quality/references/runner-contract.md` | Section 3 `explain` fields and exit codes |
| `../../../sk-code-quality/scripts/quality-gate.cjs` | The resolver that stops with `FILE_NOT_FOUND` and exit 3 |

---

## 5. SOURCE METADATA

- Group: Scope And Precedence
- Playbook ID: CR-037
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `scope-and-precedence/deleted-path-resolver-fault.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
- Feature catalog: none for this skill; anchors are `SKILL.md` and `references/` per the root coverage note.
