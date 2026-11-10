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
