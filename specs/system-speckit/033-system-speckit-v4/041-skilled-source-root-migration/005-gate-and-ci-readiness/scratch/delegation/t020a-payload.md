# Edits for unit t020a

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/scripts/git-hooks/pre-push`

OLD:

~~~~text
# Mass-deletion guard: source if present. The gate inside the loop checks that
# its function actually loaded before using it, so a missing/broken lib simply
# means the deletion ceiling is not enforced (fail-open) — never a blocked push.
_MASS_DEL_GUARD="$REPO_ROOT/.opencode/scripts/git-hooks/lib/mass-deletion-guard.sh"
if [[ -f "$_MASS_DEL_GUARD" ]]; then
~~~~

NEW:

~~~~text
# Mass-deletion guard: source if present. The gate inside the loop checks that
# its function actually loaded before using it, so a lib that fails to load means
# the deletion ceiling is not enforced (fail-open). A lib missing from a checkout
# that ships the toolchain is a broken install instead, and the gate then blocks
# each update push until SPECKIT_ALLOW_MASS_DELETION=1 approves it.
_MASS_DEL_GUARD="$REPO_ROOT/.opencode/scripts/git-hooks/lib/mass-deletion-guard.sh"
_MASS_DEL_MISSING=0
if [[ -f "$_MASS_DEL_GUARD" ]]; then
~~~~

## Edit 2

File: `.opencode/scripts/git-hooks/pre-push`

OLD:

~~~~text
    echo "WARNING [gate:mass-deletion]: guard unavailable; push gate failed open." >&2
  fi
fi
~~~~

NEW:

~~~~text
    echo "WARNING [gate:mass-deletion]: guard unavailable; push gate failed open." >&2
  fi
elif _in_toolchain_repo; then
  _MASS_DEL_MISSING=1
fi
~~~~

## Edit 3

File: `.opencode/scripts/git-hooks/pre-push`

OLD:

~~~~text
# --- Fail-safe validator load — never block a push on a missing/broken validator ---
NAMING="$REPO_ROOT/.opencode/skills/sk-git/scripts/worktree-naming.sh"
NAMING_AVAILABLE=1
if [[ ! -f "$NAMING" ]]; then
  echo "⚠️  pre-push: worktree-naming.sh not found at $NAMING — skipping the remote-push-permission gate." >&2
  NAMING_AVAILABLE=0
else
~~~~

NEW:

~~~~text
# --- Validator load: a broken validator never blocks a push, and a missing one ---
# --- blocks only in a checkout that ships the toolchain ---
NAMING="$REPO_ROOT/.opencode/skills/sk-git/scripts/worktree-naming.sh"
NAMING_AVAILABLE=1
NAMING_MISSING=0
if [[ ! -f "$NAMING" ]]; then
  if _in_toolchain_repo; then
    # Without the script the remote allowlist cannot be read, so the permission gate
    # below asks for approval rather than disappearing.
    NAMING_MISSING=1
  else
    echo "⚠️  pre-push: worktree-naming.sh not found at $NAMING — skipping the remote-push-permission gate." >&2
  fi
  NAMING_AVAILABLE=0
else
~~~~

## Edit 4

File: `.opencode/scripts/git-hooks/pre-push`

OLD:

~~~~text
  # delete from. Fail-open if the guard lib did not load.
  if [[ "$is_new" -eq 0 ]] && command -v mass_deletion_verdict >/dev/null 2>&1; then
~~~~

NEW:

~~~~text
  # delete from. Fail-open if the guard lib did not load.
  if [[ "$is_new" -eq 0 && "$_MASS_DEL_MISSING" -eq 1 && "${SPECKIT_ALLOW_MASS_DELETION:-0}" != "1" ]]; then
    echo "BLOCKED [gate:mass-deletion]: guard library is missing: $_MASS_DEL_GUARD" >&2
    echo "Approve this push once, deliberately: SPECKIT_ALLOW_MASS_DELETION=1 git push ..." >&2
    REJECTED=1
    continue
  fi
  if [[ "$is_new" -eq 0 ]] && command -v mass_deletion_verdict >/dev/null 2>&1; then
~~~~

## Edit 5

File: `.opencode/scripts/git-hooks/pre-push`

OLD:

~~~~text
  if [[ "$NAMING_AVAILABLE" -eq 0 ]]; then
    continue
  fi
~~~~

NEW:

~~~~text
  if [[ "$NAMING_AVAILABLE" -eq 0 ]]; then
    # Approval keeps its usual meaning: `1` passes an update, the branch name passes
    # any push, and the live autosync branch keeps its exception.
    if [[ "$NAMING_MISSING" -eq 1 && "$is_autosync_live" -eq 0 \
          && "${SPECKIT_ALLOW_REMOTE_PUSH:-0}" != "$branch_name" ]] \
       && ! [[ "$is_new" -eq 0 && "${SPECKIT_ALLOW_REMOTE_PUSH:-0}" = "1" ]]; then
      {
        echo ""
        echo "BLOCKED [gate:remote-permission]: the permission script is missing: $NAMING"
        echo "Without it the remote allowlist cannot be read, so this push needs explicit approval:"
        echo "  SPECKIT_ALLOW_REMOTE_PUSH=1 git push ...   (an update)"
        echo "  SPECKIT_ALLOW_REMOTE_PUSH=$branch_name git push ...   (creating the branch)"
        echo ""
      } >&2
      REJECTED=1
    fi
    continue
  fi
~~~~

## Edit 6

File: `.opencode/scripts/git-hooks/pre-push`

OLD:

~~~~text
  ROUTE_GUARD="$REPO_ROOT/.opencode/bin/compiled-route-guard.cjs"
  if [[ -f "$ROUTE_GUARD" ]]; then
~~~~

NEW:

~~~~text
  ROUTE_GUARD="$REPO_ROOT/.opencode/bin/compiled-route-guard.cjs"
  if [[ ! -f "$ROUTE_GUARD" ]] && _in_toolchain_repo; then
    echo "" >&2
    echo "BLOCKED [gate:compiled-routing]: route guard is missing: $ROUTE_GUARD" >&2
    echo "Override once, deliberately: SPECKIT_SKIP_PREPUSH_ROUTE_GATE=1 git push ..." >&2
    exit 1
  fi
  if [[ -f "$ROUTE_GUARD" ]]; then
~~~~
