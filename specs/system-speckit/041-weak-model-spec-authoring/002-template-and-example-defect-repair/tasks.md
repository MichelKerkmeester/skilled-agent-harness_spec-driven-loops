---
title: "Tasks: Phase 2: template-and-example-defect-repair"
description: "Task Format: T### [P?] Description (file path). Each task names its verify command with the output it must print, and the 25 known rows and the exact-match applier are written out literally."
trigger_phrases:
  - "template and example defect repair tasks"
  - "known rows apply script"
  - "ledger rows owned by phase 2"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: template-and-example-defect-repair

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`, then `Verify:` with the command whose output proves the task.

Shell variables used below, set once by the conductor in the build worktree:
- `WORKTREE`: the build worktree path recorded in `../goal.md` section 4.
- `PHASE_REL`: `specs/system-speckit/054-weak-model-spec-authoring/002-template-and-example-defect-repair`
- `PHASE`: `$WORKTREE/$PHASE_REL`
- `P1`: `$WORKTREE/specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline`
- `LED`: `$P1/scratch/ledger/ledger.jsonl`, the verified and reviewed phase 1 ledger.
- `KR`: `$PHASE/scratch/ledger/known-rows.jsonl`, the 25 known rows written by T004.
- `S`: `.skilled/skills/system-spec-kit`
- `P2START`: the commit hash recorded by T003.

Every command runs from `$WORKTREE` unless the task says otherwise. Paths in ledger rows are relative to that directory.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Check that phase 1 closed (no file). Run the three commands below. Verify: they print `LEDGER_OK`, then a line that starts with `exit=`, then `REVIEW_OK`. When the ledger check fails, write `BLOCKED ledger missing` in `goal.md` section 4. Then run T002 to T008 and skip T009 to T011. T012 then checks the known rows only. Acceptance criterion AC-002 then stays Unmet and the phase cannot close.

  ```bash
  cd "$WORKTREE"
  test -s "$LED" && jq -c . "$LED" > /dev/null && echo LEDGER_OK
  tail -1 "$P1/scratch/baseline/suite-start.txt"
  test -s "$P1/scratch/review/T011.txt" && echo REVIEW_OK
  ```

- [x] T002 Check the tools (no file). Verify: `python3 --version && jq --version && rg --version | head -1 && node --version` prints four lines that start with `Python 3.`, `jq-`, `ripgrep ` and `v`.
- [x] T003 Record the phase start state (`goal.md`, `scratch/status-start.txt`). Run the commands below. Write the printed hash into the `Phase start commit` row of `goal.md` section 4 as `| Phase start commit | Done | <the 40 character hash> |`. Verify: `grep -cE 'Phase start commit \| Done \| [0-9a-f]{40}' "$PHASE/goal.md"` prints `1`, and `test -d "$PHASE/scratch/tools" && echo DIRS_OK` prints `DIRS_OK`.

  ```bash
  cd "$WORKTREE"
  git rev-parse HEAD
  git status --porcelain > "$PHASE/scratch/status-start.txt"
  mkdir -p "$PHASE/scratch/ledger" "$PHASE/scratch/tools" "$PHASE/scratch/briefs" "$PHASE/scratch/runs" "$PHASE/scratch/review"
  ```

- [x] T004 Save the 25 known rows (`scratch/ledger/known-rows.jsonl`). Run the heredoc block that follows this line exactly as written. The file holds one JSON object per line with the fields `id`, `file`, `locator` and `expected_text`. Rows K-01 to K-18 replace the `description:` line of the 18 example docs. Rows K-19 to K-21 replace the stale `Checklist.md` line. Rows K-22 and K-23 give the two bare `<spec-folder>` placeholders a real Level 1 packet path. Rows K-24 and K-25 make the style guide say table in both places. Verify: the two commands under the block print `25` and then `25 1`. A line other than `25 1` means a `locator` no longer occurs exactly once in its file because the tree changed after this packet was written. Write that row id in `goal.md` section 4 and carry on, because T006 will report the row as `BLOCKED` and T009 may apply the same fix from the ledger.

```bash
cd "$WORKTREE"
cat > "$KR" <<'JSONL'
{"id": "K-01", "file": ".skilled/skills/system-spec-kit/templates/examples/level-1/implementation-summary.md", "locator": "description: \"the completed authentication feature. Created AFTER implementation completes. -->\"", "expected_text": "description: \"Level 1 implementation summary for the user authentication example, written after the feature shipped.\""}
{"id": "K-02", "file": ".skilled/skills/system-spec-kit/templates/examples/level-1/plan.md", "locator": "description: \"planning required for a simple authentication feature. Note the straightforward\"", "expected_text": "description: \"Level 1 plan for the user authentication example, with the minimum planning a small feature needs.\""}
{"id": "K-03", "file": ".skilled/skills/system-spec-kit/templates/examples/level-1/spec.md", "locator": "description: \"required for a simple authentication feature (~80 LOC). Use this as a reference when\"", "expected_text": "description: \"Level 1 spec for a small user authentication feature of about 80 lines, used as a reference for baseline documentation depth.\""}
{"id": "K-04", "file": ".skilled/skills/system-spec-kit/templates/examples/level-1/tasks.md", "locator": "description: \"needed for a simple authentication feature. Note the straightforward task numbering\"", "expected_text": "description: \"Level 1 task list for the user authentication example, with straightforward sequential task numbering.\""}
{"id": "K-05", "file": ".skilled/skills/system-spec-kit/templates/examples/level-2/implementation-summary.md", "locator": "description: \"verification documentation and test coverage details. -->\"", "expected_text": "description: \"Level 2 implementation summary for the user authentication example, with verification and test coverage details.\""}
{"id": "K-06", "file": ".skilled/skills/system-spec-kit/templates/examples/level-2/plan.md", "locator": "description: \"planning. Note the addition of Phase Dependencies, Effort Estimation, and Enhanced\"", "expected_text": "description: \"Level 2 plan for the user authentication example, adding phase dependencies, effort estimation and an enhanced rollback.\""}
{"id": "K-07", "file": ".skilled/skills/system-spec-kit/templates/examples/level-2/spec.md", "locator": "description: \"documentation. Note the addition of NFRs and Edge Cases sections compared to Level 1.\"", "expected_text": "description: \"Level 2 spec for the user authentication example, adding non-functional requirements and edge cases to the Level 1 sections.\""}
{"id": "K-08", "file": ".skilled/skills/system-spec-kit/templates/examples/level-2/tasks.md", "locator": "description: \"including effort estimates and explicit verification tasks for each feature. -->\"", "expected_text": "description: \"Level 2 task list for the user authentication example, with effort estimates and explicit verification tasks.\""}
{"id": "K-09", "file": ".skilled/skills/system-spec-kit/templates/examples/level-3/decision-record.md", "locator": "description: \"architecture decisions with proper context, alternatives, and consequences.\"", "expected_text": "description: \"Level 3 decision record example showing architecture decisions with their context, alternatives and consequences.\""}
{"id": "K-10", "file": ".skilled/skills/system-spec-kit/templates/examples/level-3/implementation-summary.md", "locator": "description: \"decision summary, comprehensive metrics, and lessons learned sections. -->\"", "expected_text": "description: \"Level 3 implementation summary example with a decision summary, metrics and lessons learned.\""}
{"id": "K-11", "file": ".skilled/skills/system-spec-kit/templates/examples/level-3/plan.md", "locator": "description: \"planning. Note the addition of Dependency Graph, Critical Path, Milestones, and\"", "expected_text": "description: \"Level 3 plan example adding a dependency graph, critical path and milestones.\""}
{"id": "K-12", "file": ".skilled/skills/system-spec-kit/templates/examples/level-3/spec.md", "locator": "description: \"documentation. Note the addition of Executive Summary, Risk Matrix, User Stories\"", "expected_text": "description: \"Level 3 spec example adding an executive summary, risk matrix and user stories.\""}
{"id": "K-13", "file": ".skilled/skills/system-spec-kit/templates/examples/level-3/tasks.md", "locator": "description: \"including dependencies, milestone mapping, and detailed verification tasks. -->\"", "expected_text": "description: \"Level 3 task list example with dependencies, milestone mapping and detailed verification tasks.\""}
{"id": "K-14", "file": ".skilled/skills/system-spec-kit/templates/examples/level-3+/decision-record.md", "locator": "description: \"Level 3, demonstrating that governance-level features are primarily in spec.md\"", "expected_text": "description: \"Level 3+ decision record example, showing that governance features live mainly in spec.md rather than here.\""}
{"id": "K-15", "file": ".skilled/skills/system-spec-kit/templates/examples/level-3+/implementation-summary.md", "locator": "description: \"metrics, workstream performance, AI execution analysis, and comprehensive lessons\"", "expected_text": "description: \"Level 3+ implementation summary example with metrics, workstream performance, AI execution analysis and lessons learned.\""}
{"id": "K-16", "file": ".skilled/skills/system-spec-kit/templates/examples/level-3+/plan.md", "locator": "description: \"Note the AI Execution Framework, Workstream Coordination, and Communication Plan\"", "expected_text": "description: \"Level 3+ plan example with the AI execution framework, workstream coordination and a communication plan.\""}
{"id": "K-17", "file": ".skilled/skills/system-spec-kit/templates/examples/level-3+/spec.md", "locator": "description: \"Note the Complexity Assessment, Approval Workflow, Compliance Checkpoints, Stakeholder\"", "expected_text": "description: \"Level 3+ spec example with a complexity assessment, approval workflow, compliance checkpoints and stakeholder matrix.\""}
{"id": "K-18", "file": ".skilled/skills/system-spec-kit/templates/examples/level-3+/tasks.md", "locator": "description: \"features including 3-Tier Task Format, AI Execution Protocol, and Workstream\"", "expected_text": "description: \"Level 3+ task list example with the three-tier task format, AI execution protocol and workstream tracking.\""}
{"id": "K-19", "file": ".skilled/skills/system-spec-kit/templates/examples/level-2/tasks.md", "locator": "- [x] Checklist.md fully verified", "expected_text": "- [x] Verification checklist in tasks.md fully verified"}
{"id": "K-20", "file": ".skilled/skills/system-spec-kit/templates/examples/level-3/tasks.md", "locator": "- [x] Checklist.md fully verified", "expected_text": "- [x] Verification checklist in tasks.md fully verified"}
{"id": "K-21", "file": ".skilled/skills/system-spec-kit/templates/examples/level-3+/tasks.md", "locator": "- [x] Checklist.md fully verified", "expected_text": "- [x] Verification checklist in tasks.md fully verified"}
{"id": "K-22", "file": ".skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md", "locator": "- [ ] Read the Level 1 contract files in an existing packet such as `<spec-folder>`.", "expected_text": "- [ ] Read the Level 1 contract files in an existing packet such as `specs/system-speckit/041-write-recipe-fixes/001-fix-write-recipe-backfill-flag`."}
{"id": "K-23", "file": ".skilled/skills/system-spec-kit/references/workflows/spec-folder-authoring-checklist.md", "locator": "- Prior example: `<spec-folder>`", "expected_text": "- Prior example: `specs/system-speckit/041-write-recipe-fixes/001-fix-write-recipe-backfill-flag`"}
{"id": "K-24", "file": ".skilled/skills/system-spec-kit/references/templates/template-style-guide.md", "locator": "### Why Bulleted Lists", "expected_text": "### Why a Table"}
{"id": "K-25", "file": ".skilled/skills/system-spec-kit/references/templates/template-style-guide.md", "locator": "| Metadata format | Bulleted list format used |", "expected_text": "| Metadata format | Table with Field and Value columns |"}
JSONL
```

  ```bash
  jq -c . "$KR" | wc -l | tr -d ' '
  jq -r '[.file,.locator] | @tsv' "$KR" | while IFS=$'\t' read -r f l; do grep -cF -- "$l" "$f"; done | sort | uniq -c | awk '{print $1, $2}'
  ```

- [x] T005 Save the applier and the helper functions, then test them on a copy (`scratch/tools/apply_row.py`, `scratch/tools/lib.sh`). Run the two heredocs below, then the self-test. Verify: the self-test prints, in order, a line that starts with `APPLIED K-08`, a line that starts with `FAIL K-08: locator found 0 times`, `exit=1`, and `1`. The last number is the count of changed lines in the copy, so it proves the applier changed one line and ran only once.

  `apply_row.py` reads a ledger path, a row id and an optional root directory. It refuses a row whose `expected_text` is `OWNED BY PHASE` or `DELETE FILE`. It refuses unless the `locator` occurs exactly once in the row's file. It replaces that one occurrence, or removes the whole line that holds it when `expected_text` is `DELETE LINE`, prints `APPLIED <id> <file>` and exits 0. Every refusal prints `FAIL <id>: <reason>` and exits 1. A second apply of the same row fails because the locator is gone.

```bash
cd "$WORKTREE"
cat > "$PHASE/scratch/tools/apply_row.py" <<'PY'
import json, sys
ledger, row_id = sys.argv[1], sys.argv[2]
root = sys.argv[3] if len(sys.argv) > 3 else "."
rows = [json.loads(l) for l in open(ledger, encoding="utf-8") if l.strip()]
match = [r for r in rows if r["id"] == row_id]
if len(match) != 1:
    sys.exit(f"FAIL {row_id}: expected 1 ledger row, found {len(match)}")
r = match[0]
if r["expected_text"] in ("OWNED BY PHASE", "DELETE FILE"):
    sys.exit(f"FAIL {row_id}: not a text replacement ({r['expected_text']})")
path = f"{root}/{r['file']}"
text = open(path, encoding="utf-8").read()
count = text.count(r["locator"])
if count != 1:
    sys.exit(f"FAIL {row_id}: locator found {count} times in {r['file']}")
if r["expected_text"] == "DELETE LINE":
    start = text.rfind("\n", 0, text.index(r["locator"])) + 1
    end = text.find("\n", start)
    text = text[:start] + (text[end + 1:] if end != -1 else "")
else:
    text = text.replace(r["locator"], r["expected_text"], 1)
open(path, "w", encoding="utf-8").write(text)
print(f"APPLIED {row_id} {r['file']}")
PY
```

```bash
cd "$WORKTREE"
cat > "$PHASE/scratch/tools/lib.sh" <<'SH'
# Helpers for the conductor. Set WORKTREE, PHASE, PHASE_REL, LED and S before sourcing this file.

# Prints YES when the ledger row's evidence command still prints its evidence_expect, NO when it does not.
repro() {
  local cmd exp
  cmd=$(jq -r --arg i "$1" 'select(.id==$i) | .evidence_cmd' "$LED")
  exp=$(jq -r --arg i "$1" 'select(.id==$i) | .evidence_expect' "$LED")
  if bash -c "$cmd" 2>&1 | grep -qF -- "$exp"; then echo YES; else echo NO; fi
}

# Applies one row with apply_row.py. Prints the script result, then a CHECK line counting
# the changed paths that the row does not explain. Run it from the worktree root.
apply_checked() {
  local led="$1" id="$2" file out extra
  file=$(jq -r --arg i "$id" 'select(.id==$i) | .file' "$led")
  git diff --name-only | sort > "$PHASE/scratch/pre.txt"
  if ! out=$(python3 -I "$PHASE/scratch/tools/apply_row.py" "$led" "$id" . 2>&1); then
    echo "BLOCKED $id $out"
    return 0
  fi
  git diff --name-only | sort > "$PHASE/scratch/post.txt"
  extra=$(comm -13 "$PHASE/scratch/pre.txt" "$PHASE/scratch/post.txt" | grep -v "^$PHASE_REL/" | grep -cvxF -- "$file")
  echo "$out"
  echo "CHECK $id extra_paths=$extra"
}

# Prints the worker brief for one ledger row.
make_brief() {
  local id="$1" file observed locator expected cmd exp
  file=$(jq -r --arg i "$id" 'select(.id==$i) | .file' "$LED")
  observed=$(jq -r --arg i "$id" 'select(.id==$i) | .observed' "$LED")
  locator=$(jq -r --arg i "$id" 'select(.id==$i) | .locator' "$LED")
  expected=$(jq -r --arg i "$id" 'select(.id==$i) | .expected_text' "$LED")
  cmd=$(jq -r --arg i "$id" 'select(.id==$i) | .evidence_cmd' "$LED")
  exp=$(jq -r --arg i "$id" 'select(.id==$i) | .evidence_expect' "$LED")
  cat <<BRIEF
GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a dispatched Task subagent. This repository's AGENTS.md treats a dispatched worker as
pre-resolved for the spec-folder question, and this prompt is that pre-resolution.

Your write authority is already bound. The spec folder is:
  $PHASE_REL

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
A failed edit match means a stale anchor: re-read the file and retry; halt only after three
failures on the same file.
Your task is complete only when the file is edited on disk and the verification command has been run.

ROLE: You are a precise text editor. You change one file and nothing else. Your output is
checked by a script.

ALLOWED WRITE PATHS:
  $file

BANNED OPERATIONS: git commit, git push, git checkout, git switch, git branch, git reset,
git stash, rm, mv, create.sh, generate-context.js, /speckit:save, and any edit to a file
not listed under ALLOWED WRITE PATHS.

TASK: Fix one defect in $file.
Defect: $observed
Old text, copied exactly from the file:
$locator
New text, to put in its place:
$expected
Steps:
1. Open $file and look for the old text. When it occurs exactly once, replace it with the new text.
2. When it occurs 0 times or more than once, find the one place in the file that has the defect
   described above and replace only that text with the new text.
3. Change nothing else. Do not reword the new text. Do not fix any other line.
4. Run this command and read its output: $cmd
5. The output must NOT contain: $exp
RETURN exactly one line: [$id] DONE - followed by the output of step 4.
BRIEF
}
SH
```

  ```bash
  cd "$WORKTREE"
  T="$PHASE/scratch/selftest"
  rm -rf "$T" && mkdir -p "$T/root/$S/templates/examples/level-2"
  cp "$S/templates/examples/level-2/tasks.md" "$T/root/$S/templates/examples/level-2/tasks.md"
  jq -c 'select(.id=="K-08")' "$KR" > "$T/one.jsonl"
  python3 -I "$PHASE/scratch/tools/apply_row.py" "$T/one.jsonl" K-08 "$T/root"
  python3 -I "$PHASE/scratch/tools/apply_row.py" "$T/one.jsonl" K-08 "$T/root"; echo "exit=$?"
  diff "$S/templates/examples/level-2/tasks.md" "$T/root/$S/templates/examples/level-2/tasks.md" | grep -c '^>'
  rm -rf "$T"
  ```

  Run `bash -n "$PHASE/scratch/tools/lib.sh" && echo SYNTAX_OK` after the self-test. It must print `SYNTAX_OK`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Apply the 25 known rows, one at a time (`scratch/applied.txt` and the 20 files the rows name). Run the block below. Do not edit any of those files by hand. Verify: the three counts under the block print `25`, `25` and `25`. A row that printed `BLOCKED` is recorded in `goal.md` section 4 and is not retried by hand.

  ```bash
  cd "$WORKTREE"
  . "$PHASE/scratch/tools/lib.sh"
  : > "$PHASE/scratch/applied.txt"
  for id in $(jq -r .id "$KR"); do
    apply_checked "$KR" "$id" >> "$PHASE/scratch/applied.txt"
  done
  jq -r '[.id,.file,.locator,.expected_text] | @tsv' "$KR" | while IFS=$'\t' read -r id f l e; do
    echo "KCHECK $id locator=$(grep -cF -- "$l" "$f") expected=$(grep -cF -- "$e" "$f")"
  done >> "$PHASE/scratch/applied.txt"
  ```

  ```bash
  grep -c '^APPLIED K-' "$PHASE/scratch/applied.txt"
  grep -c '^CHECK K-.* extra_paths=0$' "$PHASE/scratch/applied.txt"
  grep -c '^KCHECK K-.* locator=0 expected=1$' "$PHASE/scratch/applied.txt"
  ```

  The four bullets under the style guide heading `### Why a Table` are Consistency, Readability, Validation and Flexibility. They name no list format, so rows K-24 and K-25 leave the section consistent and no further row is needed.

- [x] T007 Check the example descriptions (no file). Run the block below. Verify: the first command prints nothing. The second prints `18 1`. The third prints `0`. The second command proves each of the 18 files holds exactly its new sentence as one whole line. The third proves the new sentences hold none of the words `preset`, `capability`, `kind` or `manifest`, which the workflow invariance test bans under `templates/`.

  ```bash
  cd "$WORKTREE"
  rg -n '^description: "([a-z]|.*--)' $S/templates/examples
  jq -r 'select(.id|test("^K-(0[1-9]|1[0-8])$")) | [.file,.expected_text] | @tsv' "$KR" | while IFS=$'\t' read -r f e; do grep -cxF -- "$e" "$f"; done | sort | uniq -c | awk '{print $1, $2}'
  jq -r 'select(.id|test("^K-(0[1-9]|1[0-8])$")) | .expected_text' "$KR" | grep -ciE '(preset|capabilit|kind|manifest)'
  ```

- [x] T008 Delete the dead hash file (`.skilled/skills/system-spec-kit/templates/.hashes`). The file lists four template files, three of which are not there, and nothing reads it. Run the guard block first. It searches `.skilled` and then the whole repository root for the text `.hashes`, and it saves each list of readers. Verify: it prints `rc=1` twice. The code `1` means ripgrep found no reader. The code `0` means it found a reader and the list is in the saved file. The code `2` means the search itself failed. Only when both codes are `1`, run the delete block. For any other code, do not delete. Mark this task `[B]`, and write the code and the saved list in `goal.md` section 4. Last check after the delete: `test ! -e $S/templates/.hashes && echo DELETED` prints `DELETED`.

  ```bash
  cd "$WORKTREE"
  rg -l --hidden '\.hashes' .skilled --glob '!**/node_modules/**' --glob '!.git' > "$PHASE/scratch/hashes-readers-skilled.txt"; echo "rc=$?"
  rg -l --hidden '\.hashes' . --glob '!**/node_modules/**' --glob '!.git' --glob '!specs/**' --glob '!.worktrees/**' > "$PHASE/scratch/hashes-readers-root.txt"; echo "rc=$?"
  ```

  ```bash
  cd "$WORKTREE"
  rm $S/templates/.hashes
  ```

  Both guards printed `rc=1` while this packet was written. A search that also covers `specs/` finds only historical review and research notes about the old template hashing, which are text and not readers.

- [x] T009 Apply the census rows by script (`scratch/census.txt`). Skip this task when T001 reported a missing ledger. The loop reads every ledger row whose `owner_phase` is `002`. It skips a row whose defect no longer reproduces because a known row already fixed it. It skips rows that a later phase rewrites. It applies the rest with the applier and re-runs the row's evidence command after each apply. Run the block below. Verify: the first two commands under it print the same number, and the third prints `0`. The same number means every owner `002` row produced exactly one line in `census.txt`. A row marked `NEEDS-WORKER` is handled by T010. A row marked `DELETE-PENDING` is handled by T011. A row marked `OUT-OF-SCOPE` changed a file that no row names. Restore that file with `git restore --source="$P2START" -- <path>`, record it in `goal.md` section 4 and mark this task `[B]`.

  ```bash
  cd "$WORKTREE"
  . "$PHASE/scratch/tools/lib.sh"
  C="$PHASE/scratch/census.txt"
  : > "$C"
  for id in $(jq -r 'select(.owner_phase=="002") | .id' "$LED"); do
    new=$(jq -r --arg i "$id" 'select(.id==$i) | .expected_text' "$LED")
    file=$(jq -r --arg i "$id" 'select(.id==$i) | .file' "$LED")
    case "$new" in
      "OWNED BY PHASE") echo "SKIP-OWNED $id" >> "$C"; continue ;;
      "DELETE FILE")
        if [ -e "$file" ]; then echo "DELETE-PENDING $id $file" >> "$C"; else echo "SKIP-GONE $id" >> "$C"; fi
        continue ;;
    esac
    if [ "$(repro "$id")" = NO ]; then echo "SKIP-GONE $id" >> "$C"; continue; fi
    out=$(apply_checked "$LED" "$id")
    extra=$(printf '%s\n' "$out" | sed -n 's/^CHECK [^ ]* extra_paths=//p')
    if printf '%s\n' "$out" | grep -q '^BLOCKED'; then
      echo "NEEDS-WORKER $id locator-not-exactly-once" >> "$C"
    elif [ "$(repro "$id")" != NO ]; then
      echo "NEEDS-WORKER $id evidence-still-reproduces" >> "$C"
    elif [ "$extra" != 0 ]; then
      echo "OUT-OF-SCOPE $id $extra" >> "$C"
    else
      echo "APPLIED $id" >> "$C"
    fi
  done
  ```

  ```bash
  jq -r 'select(.owner_phase=="002") | .id' "$LED" | wc -l | tr -d ' '
  wc -l < "$PHASE/scratch/census.txt" | tr -d ' '
  grep -c '^OUT-OF-SCOPE ' "$PHASE/scratch/census.txt"
  cut -d' ' -f1 "$PHASE/scratch/census.txt" | sort | uniq -c
  ```

  The last command prints the tally of `APPLIED`, `SKIP-GONE`, `SKIP-OWNED`, `NEEDS-WORKER` and `DELETE-PENDING` rows. Copy it into `goal.md` section 4. Rows owned by the write recipe have the owner `041-006`, so the loop never selects them. Rows owned by `003`, `004`, `005` and `006` are never selected either.

- [x] T010 Fix the `NEEDS-WORKER` rows with one Task subagent each (`scratch/briefs/T010-<id>.txt`, `scratch/runs/T010-<id>.txt` and the one file each row names). Skip this task when T009 printed no `NEEDS-WORKER` line and when T001 reported a missing ledger. A row lands here when its locator no longer occurs exactly once, which means the defect is prose that needs an edit instead of a pure swap. The text may also have drifted. Before the first dispatch, run `rg -c 'deepseek-v4.1-flash-1017' opencode.json`, which must print a number above 0, because a Task subagent inherits the session model. Then read `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` sections 3 and 4, whose NEVER rules 1 and 5 forbid a CLI worker dispatch from inside OpenCode. Run the prepare block below. It writes one brief per row that still needs a worker and prints those row ids. It skips a row that is already fixed, so running it again prepares briefs only for the rows that still failed. For each printed id, dispatch with the Task tool: subagent_type `general`, description `T010-<id>`, prompt = the full text of `$PHASE/scratch/briefs/T010-<id>.txt`. When the subagent returns, write its final reply verbatim to `$PHASE/scratch/runs/T010-<id>.txt` with the write tool. At most 3 Task calls in one message, and never two that write the same file. When every call has returned, run the check block. When the prepare block printed no id, the check block prints nothing and the task is already met. Run the whole task at most three times in all. Verify: every printed line ends in `repro=NO extra=0 reply=present`. A row still failing after the third run is marked `[B]` under the blocked task protocol in `plan.md`.

  ```bash
  cd "$WORKTREE"
  . "$PHASE/scratch/tools/lib.sh"
  git diff --name-only | sort > "$PHASE/scratch/pre.txt"
  : > "$PHASE/scratch/ready.txt"
  for id in $(grep '^NEEDS-WORKER ' "$PHASE/scratch/census.txt" | awk '{print $2}'); do
    if [ "$(repro "$id")" = NO ]; then continue; fi
    make_brief "$id" > "$PHASE/scratch/briefs/T010-$id.txt"
    echo "$id" >> "$PHASE/scratch/ready.txt"
  done
  cat "$PHASE/scratch/ready.txt"
  ```

  ```bash
  cd "$WORKTREE"
  . "$PHASE/scratch/tools/lib.sh"
  git diff --name-only | sort > "$PHASE/scratch/post.txt"
  while read -r id; do
    jq -r --arg i "$id" 'select(.id==$i) | .file' "$LED"
  done < "$PHASE/scratch/ready.txt" | sort -u > "$PHASE/scratch/worker-files.txt"
  comm -13 "$PHASE/scratch/pre.txt" "$PHASE/scratch/post.txt" | grep -v "^$PHASE_REL/" | grep -vxF -f "$PHASE/scratch/worker-files.txt" > "$PHASE/scratch/extra-paths.txt"
  extra=$(grep -c . "$PHASE/scratch/extra-paths.txt")
  while read -r id; do
    reply=missing
    if [ -s "$PHASE/scratch/runs/T010-$id.txt" ]; then reply=present; fi
    echo "$id repro=$(repro "$id") extra=$extra reply=$reply"
  done < "$PHASE/scratch/ready.txt"
  ```

  When a printed `extra` is above `0`, restore each path in `scratch/extra-paths.txt` with `git restore --source="$P2START" -- <path>` and count that dispatch as failed.

- [x] T011 Delete other dead files named by the census (the files the rows name). Skip this task when T009 printed no `DELETE-PENDING` line. The block below runs the same reader guard as T008 with each file's base name and deletes the file only when ripgrep exits with code `1`, which means no reader. Any other code leaves the file and prints `KEPT`. A base name that other files mention, such as `README.md`, makes ripgrep exit with code `0`, so that file is also kept. Record every kept file in `goal.md` section 4. Verify: the two commands under the block print `0` and `0`. The first counts lines that do not start with `DELETED` or `KEPT`. The second counts `DELETED` paths that still exist.

  ```bash
  cd "$WORKTREE"
  grep '^DELETE-PENDING ' "$PHASE/scratch/census.txt" | while read -r _ id f; do
    rg -l --hidden -F --glob '!**/node_modules/**' --glob '!.git' -e "$(basename "$f")" .skilled > "$PHASE/scratch/readers.txt"; rc=$?
    if [ "$rc" = 1 ]; then rm -- "$f"; echo "DELETED $f"; else echo "KEPT $f rc=$rc"; fi
  done | tee "$PHASE/scratch/deleted.txt"
  ```

  ```bash
  cd "$WORKTREE"
  grep -cvE '^(DELETED|KEPT) ' "$PHASE/scratch/deleted.txt"
  grep '^DELETED ' "$PHASE/scratch/deleted.txt" | cut -d' ' -f2- | while read -r f; do test ! -e "$f" || echo "STILL $f"; done | wc -l | tr -d ' '
  ```

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Recheck every row (`scratch/recheck.txt`). Run the block below. It checks the 25 known rows, then every ledger row whose owner is `002`. Verify: the three counts under the block print `0`, `0` and `0`, which means no known locator remains, no ledger defect still reproduces and no owned dead file is still there. When T001 reported a missing ledger, the second and third counts are skipped and the first count is the only gate.

  ```bash
  cd "$WORKTREE"
  . "$PHASE/scratch/tools/lib.sh"
  : > "$PHASE/scratch/recheck.txt"
  jq -r '[.id,.file,.locator] | @tsv' "$KR" | while IFS=$'\t' read -r id f l; do
    echo "K-LEFT $id $(grep -cF -- "$l" "$f")" >> "$PHASE/scratch/recheck.txt"
  done
  for id in $(jq -r 'select(.owner_phase=="002") | .id' "$LED"); do
    new=$(jq -r --arg i "$id" 'select(.id==$i) | .expected_text' "$LED")
    file=$(jq -r --arg i "$id" 'select(.id==$i) | .file' "$LED")
    case "$new" in
      "OWNED BY PHASE") continue ;;
      "DELETE FILE") if [ -e "$file" ]; then echo "STILL-THERE $id" >> "$PHASE/scratch/recheck.txt"; fi; continue ;;
    esac
    echo "$(repro "$id") $id" >> "$PHASE/scratch/recheck.txt"
  done
  ```

  ```bash
  grep -c '^K-LEFT .* [1-9][0-9]*$' "$PHASE/scratch/recheck.txt"
  grep -c '^YES ' "$PHASE/scratch/recheck.txt"
  grep -c '^STILL-THERE ' "$PHASE/scratch/recheck.txt"
  ```

- [x] T013 Check that only the rows' files changed (`scratch/allowed-files.txt`, `scratch/changed-files.txt`). Run the block below. Verify: the last command prints `0`. A path it lists is a change no row explains. Restore it with `git restore --source="$P2START" -- <path>` and record it in `goal.md` section 4.

  ```bash
  cd "$WORKTREE"
  { jq -r .file "$KR"; jq -r 'select(.owner_phase=="002") | .file' "$LED"; echo "$S/templates/.hashes"; ls .skilled/commands/deep/assets/compiled/*.contract.markdown; echo "$S/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap"; sed 's/^...//' "$PHASE/scratch/status-start.txt"; } | sort -u > "$PHASE/scratch/allowed-files.txt"
  git diff --name-only | grep -v "^$PHASE_REL/" | sort -u > "$PHASE/scratch/changed-files.txt"
  comm -13 "$PHASE/scratch/allowed-files.txt" "$PHASE/scratch/changed-files.txt" | wc -l | tr -d ' '
  ```

  The three compiled deep-loop contracts in `.skilled/commands/deep/assets/compiled/` record a digest of `$S/references/workflows/auto-mode-contract.md`, which a row edits. They are regenerated with `node .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs --command <deep/ai-council|deep/review|deep/research> --write`, which changes only the recorded digest, so they are allowed here. The golden snapshot `$S/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` records the rendered `packet_pointer` lines that rows L-A-002 to L-A-004 change. It is updated with `npx vitest run --config ../../vitest.config.ts --project cli tests/scaffold-golden-snapshots.vitest.ts -u` from `$S/runtime/cli`, which changes those three lines only, so it is allowed too.

  No path under `$S/templates/core`, `$S/templates/addons` or `$S/templates/packet-types` may appear in `changed-files.txt` other than the two files that rows L-A-002 to L-A-005 fix, because later phases own those folders. Verify: `grep -E "^$S/templates/(core|addons|packet-types)/" "$PHASE/scratch/changed-files.txt" | grep -cvxF -e "$S/templates/core/implementation-summary.md.tmpl" -e "$S/templates/addons/resource-map.md.tmpl"` prints `0`.

- [x] T014 Compare the spec-kit suite with the phase 1 start (`scratch/suite-end.txt`). Run the first block. It takes several minutes. Then run the second block. Verify: the second block prints `SUITE_MATCH`. A match means the `Test Files` lines, the `Tests` lines and the final `exit=` line are identical in both files. Durations and start times are not compared. When it prints `SUITE_DIFF`, read the diff it shows and mark this task `[B]`. A line that appears only in the end file and starts with `FAIL` names a new failing test. Rerun the first block once before you decide, because a flaky test can differ between runs. A second diff blocks the phase.

  ```bash
  cd "$WORKTREE"
  npm --prefix "$WORKTREE/$S" test > "$PHASE/scratch/suite-end.txt" 2>&1; echo "exit=$?" >> "$PHASE/scratch/suite-end.txt"
  ```

  ```bash
  cd "$WORKTREE"
  for w in start end; do
    if [ "$w" = start ]; then src="$P1/scratch/baseline/suite-start.txt"; else src="$PHASE/scratch/suite-end.txt"; fi
    { grep -E '^ *(Test Files|Tests) ' "$src" | sed -E 's/^ +//; s/ +$//'; tail -1 "$src"; } > "$PHASE/scratch/suite-$w-summary.txt"
  done
  diff "$PHASE/scratch/suite-start-summary.txt" "$PHASE/scratch/suite-end-summary.txt" && echo SUITE_MATCH || echo SUITE_DIFF
  ```

  The `Tests` line must exist in the start file. Verify: `grep -c '^Tests ' "$PHASE/scratch/suite-start-summary.txt"` prints `1` or more. When it prints `0`, the suite output format is not the one this task expects. Write that in `goal.md` section 4 and stop the task.

- [x] T015 Frontier review of the diff (`scratch/review/T015.txt`). Read `.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md` first. Use its read-only invocation with the `gpt-6-luna` model, as phase 1 did. Write the brief with the first block and send it with the second block. The reply lands in `scratch/review/T015.txt`. Verify: every line of the file matches `^(P0|P1|P2) ` or the file holds the single line `NO FINDINGS`. Check it with `grep -cvE '^(P0|P1|P2) |^NO FINDINGS$' "$PHASE/scratch/review/T015.txt"`, which must print `0`.

```bash
cd "$WORKTREE"
cat > "$PHASE/scratch/briefs/T015.txt" <<BRIEF
GATE 3 IS PRE-RESOLVED. You are a non-interactive read-only reviewer. AI_SESSION_CHILD=1 is set.
You write nothing, so no documentation-scope question applies. Do not edit, create or delete any file.
ROLE: You are a read-only reviewer of a text diff. Your output is checked line by line by a script.
Run: git diff $P2START --stat
Then run: git diff $P2START -- .skilled
Then read $PHASE_REL/scratch/ledger/known-rows.jsonl and the rows with owner_phase 002 in specs/system-speckit/054-weak-model-spec-authoring/001-template-drift-census-and-baseline/scratch/ledger/ledger.jsonl.
Check these five things:
(1) Every changed line equals the expected_text of one row, and no other line changed.
(2) The 18 example description lines are full sentences, start with a capital letter and hold no end of an HTML comment.
(3) The file .skilled/skills/system-spec-kit/templates/.hashes is deleted, and rg -l --hidden '\.hashes' .skilled prints nothing.
(4) In the style guide, rg -c '^### Why a Table$' $S/references/templates/template-style-guide.md prints 1, and rg -n -A6 '^### Why a Table$' $S/references/templates/template-style-guide.md | grep -ciE 'bullet|list' prints 0.
(5) The two authoring checklist lines now name a path that exists.
Return one line per finding in this form, and nothing else:
P0|P1|P2 <file>:<line> | <what is wrong> | <the fix>
Return the single line NO FINDINGS when there are none.
BRIEF
```

  ```bash
  cd "$WORKTREE"
  AI_SESSION_CHILD=1 codex exec --model gpt-6-luna -c model_reasoning_effort="high" -c service_tier="fast" \
    -c approval_policy=never --sandbox read-only "$(cat "$PHASE/scratch/briefs/T015.txt")" </dev/null \
    > "$PHASE/scratch/review/T015.txt" 2> "$PHASE/scratch/review/T015.err" &
  PID=$!; wait "$PID"; kill -9 "$PID" 2>/dev/null; pkill -9 -P "$PID" 2>/dev/null
  ```


- [x] T016 Apply the review findings (`scratch/review/T016.txt`, `scratch/briefs/T016-<n>.txt`, `goal.md`). Do not edit any file a finding names by hand. For each `P0`, `P1` or `P2` line, write a brief with the Worker Brief Skeleton in `plan.md` section AI EXECUTION PROTOCOL. Put the finding's file under ALLOWED WRITE PATHS and the finding line in the TASK section. Dispatch it with the Task tool as described under Dispatch Command in the same section, with the brief at `scratch/briefs/T016-<n>.txt` and the reply at `scratch/runs/T016-<n>.txt`. At most 3 Task calls in one message, and never two that write the same file. Write `APPLIED <file>` to `scratch/review/T016.txt` after the dispatch. Write `RECORDED <file>` instead when the dispatch failed or the finding asks for a change outside the files the rows name, and raise it to the operator. Write every finding in `goal.md` section 4. Then rerun T012, T013 and T014. A `P2` finding is fixed by a worker or recorded with the reason it was not fixed. When T015 holds `NO FINDINGS`, run `: > "$PHASE/scratch/review/T016.txt"` and skip the dispatches. Verify: the block below prints `COUNTS_MATCH`.

  ```bash
  cd "$WORKTREE"
  grep -cE '^(P0|P1|P2) ' "$PHASE/scratch/review/T015.txt" > "$PHASE/scratch/review/findings.count"
  grep -cE '^(APPLIED|RECORDED) ' "$PHASE/scratch/review/T016.txt" > "$PHASE/scratch/review/dispositions.count"
  diff "$PHASE/scratch/review/findings.count" "$PHASE/scratch/review/dispositions.count" && echo COUNTS_MATCH
  ```

- [x] T017 Close the phase (this folder and one local commit). Run `bash $S/runtime/cli/spec/validate.sh "$PHASE" --strict`. Fill `implementation-summary.md` with what changed and the T006, T007, T012, T013 and T014 results. Mark each row of `acceptance-criteria.md` `Met` with its evidence. Read the commit section of `.skilled/skills/sk-git/SKILL.md`, then commit with the block below. It adds the files that T013 listed plus this phase folder, never everything. When a commit hook refuses, read its message, fix what it names and commit again, at most twice. Verify: the validate command prints `RESULT: PASSED`, and the last command of the block prints the same number as `wc -l < "$PHASE/scratch/changed-files.txt"`.

  ```bash
  cd "$WORKTREE"
  git add -- $(cat "$PHASE/scratch/changed-files.txt") "$PHASE_REL"
  git commit -m "fix(system-spec-kit): repair example descriptions and stale authoring lines"
  git show --name-only --format= HEAD | grep -c "^$S/"
  ```
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every acceptance criterion marked `Met` with its evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, which holds the AI execution protocol and the decision records
- **Phase 1 ledger**: See `../001-template-drift-census-and-baseline/scratch/ledger/ledger.jsonl`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase 1 closed with a reviewed `ledger.jsonl`, shown by T001
- [x] CHK-002 [P0] T001 to T005 done with their verify output recorded in `goal.md` section 4
- [x] CHK-003 [P1] `apply_row.py` self-test printed the expected four lines
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `known-rows.jsonl` holds 25 lines and every `locator` occurs once before T006 runs
- [x] CHK-011 [P0] No example, checklist or style guide file was edited by hand or by a model for a known row
- [x] CHK-012 [P1] Every `description:` line in the 18 example docs is one whole sentence on one line
- [x] CHK-013 [P1] Every `NEEDS-WORKER` row used one brief with one allowed write path
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] T014 printed `SUITE_MATCH`
- [x] CHK-022 [P1] T012 counts are `0`, `0` and `0`
- [x] CHK-023 [P1] A row that failed is recorded with its error and not silently dropped
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Every owner `002` ledger row ends in one of five states: applied, skipped as already fixed, skipped as owned by a later phase, deleted, or sent to a worker.
- [x] CHK-FIX-002 [P0] The example descriptions were checked across all four level folders, not one file, by T007.
- [x] CHK-FIX-003 [P0] The `.hashes` reader search covered `.skilled` and the repository root before the delete.
- [x] CHK-FIX-004 [P1] The style guide heading and its manual check row both say table.
- [x] CHK-FIX-005 [P1] The matrix of four levels by the example doc kinds is reported as 18 description counts in `goal.md` section 4.
- [x] CHK-FIX-006 [P1] Each row's changed path check printed `extra_paths=0`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the phase start commit recorded in T003.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No brief contains a credential, token or key
- [x] CHK-031 [P0] `apply_row.py` wrote only the file each row names
- [x] CHK-032 [P1] Every worker was one Task subagent, and its brief carried the pre-resolution line
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on the 25 known rows
- [x] CHK-041 [P1] `goal.md` section 4 records the phase start commit, each dispatch and each blocker
- [x] CHK-042 [P2] `scratch/applied.txt` and `scratch/census.txt` are kept as the record of what ran
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working files are under this phase's `scratch/` only
- [x] CHK-051 [P1] `scratch/selftest/` does not exist at phase close
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 24 | 24/24 |
| P2 Items | 9 | 9/9 |

**Verification Date**: 2026-10-24
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] ADR-001 and ADR-002 in `plan.md` are followed by T006 and T008
- [x] CHK-101 [P1] All three ADRs have status Accepted
- [x] CHK-102 [P1] Each ADR names the alternative it rejected and why
- [x] CHK-103 [P2] No migration applies to this phase
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Known rows were applied by script with no model call (NFR-P01)
- [x] CHK-111 [P1] Applying a row twice failed the second time (NFR-R01)
- [x] CHK-112 [P2] No load test applies to this phase
- [x] CHK-113 [P2] The suite run time is recorded in `goal.md` section 4
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback in `plan.md` section 7 was not needed, or was run and recorded
- [x] CHK-121 [P0] Nothing outside the files the rows name changed, shown by T013
- [x] CHK-122 [P1] Phase 3 can start: every owner `002` row is gone and the suite matches
- [x] CHK-123 [P1] `goal.md` section 4 names the next phase as ready
- [x] CHK-124 [P2] No deployment applies to this phase
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Frontier review ran read-only and its reply is saved
- [x] CHK-131 [P1] No new dependency was installed
- [x] CHK-132 [P2] No user data is handled by this phase
- [x] CHK-133 [P2] No OWASP surface is touched by this phase
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` agree at close
- [x] CHK-141 [P1] `implementation-summary.md` cites `applied.txt` and the T014 result
- [x] CHK-142 [P2] The authoring checklist and style guide were the only reference docs changed
- [x] CHK-143 [P2] The count of census rows applied, skipped and sent to a worker is recorded for phase 3
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Conductor | Runs and verifies every task | Pending | |
| Frontier reviewer | Reads the diff read-only | Pending | |
| Operator | Merges the phase commit | Pending | |
<!-- /ANCHOR:sign-off -->


