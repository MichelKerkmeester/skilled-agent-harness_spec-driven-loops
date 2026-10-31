# Helpers for the conductor. Set WORKTREE, PHASE, PHASE_REL, ROWS and S before sourcing this file.

# Prints YES when the row's locator is still in its file, NO when it is gone.
present() {
  local id="$1" file locator
  file=$(jq -r --arg i "$id" 'select(.id==$i) | .file' "$ROWS")
  locator=$(jq -r --arg i "$id" 'select(.id==$i) | .locator' "$ROWS")
  if grep -qF -- "$locator" "$file"; then echo YES; else echo NO; fi
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
