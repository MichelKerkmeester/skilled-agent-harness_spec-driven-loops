#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Rebase Commit-Id Probe
# ───────────────────────────────────────────────────────────────
# Runs the real prepare-commit-msg hook in a throwaway repository and
# records what happens to a Commit-Id trailer across four rebase cases:
# a pick onto a moved base, an interactive rebase whose leading commit
# keeps its parent, a reworded commit and the --apply backend.
#
# WHY: the hook re-mints only while CHERRY_PICK_HEAD exists, so a rebase
# pick re-mints only when git marks the pick that way and the repository
# asks for ids. The block per case records the id before and after, so
# the skill sentence is written from observed behavior.
#
# Exit Codes:
#   0 - Every case printed an id before and after
#   1 - A case printed no id, which means the hook did not run
#
set -euo pipefail

unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
HOOK="$REPO_ROOT/.skilled/scripts/git-hooks/prepare-commit-msg"
ALLOCATOR_DIR="$REPO_ROOT/.skilled/skills/sk-git/scripts"

# A test identity only: no machine config, no global hooks, no user identity.
export GIT_CONFIG_GLOBAL=/dev/null
export GIT_AUTHOR_NAME=probe
export GIT_AUTHOR_EMAIL=probe@example.com
export GIT_COMMITTER_NAME=probe
export GIT_COMMITTER_EMAIL=probe@example.com
export GIT_EDITOR=true
export GIT_SEQUENCE_EDITOR=:

TMP="$(mktemp -d "$SCRIPT_DIR/probe.XXXXXX")"
trap 'rm -rf "$TMP"' EXIT

REPO="$TMP/repo"
HOOK_LOG="$TMP/hook.log"
export PROBE_HOOK_LOG="$HOOK_LOG"
export PROBE_REAL_HOOK="$HOOK"
GIT_VERSION="$(git --version | awk '{print $3}')"

echo "git version: $GIT_VERSION"
echo

setup_repo() {
  rm -rf "$REPO"
  mkdir -p "$REPO"
  git -C "$REPO" init -q
  # History is built without hooks so every fixture id is exactly the one written.
  git -C "$REPO" config core.hooksPath /dev/null
  git -C "$REPO" config skilled.trustRepoHooks true
  git -C "$REPO" config user.email probe@example.com
  git -C "$REPO" config user.name probe
  printf 'seed\n' > "$REPO/seed.txt"
  git -C "$REPO" add seed.txt
  git -C "$REPO" commit -qm "chore: seed the probe"
  mkdir -p "$REPO/.skilled/skills/sk-git"
  cp -R "$ALLOCATOR_DIR" "$REPO/.skilled/skills/sk-git/scripts"
  mkdir -p "$REPO/hooks"
}

install_hook() {
  cat > "$REPO/hooks/prepare-commit-msg" <<'WRAPPER'
#!/usr/bin/env bash
if git rev-parse -q --verify CHERRY_PICK_HEAD >/dev/null 2>&1; then
  printf 'CHERRY_PICK_HEAD=1 source=%s\n' "${2:-}" >> "$PROBE_HOOK_LOG"
else
  printf 'CHERRY_PICK_HEAD=0 source=%s\n' "${2:-}" >> "$PROBE_HOOK_LOG"
fi
exec "$PROBE_REAL_HOOK" "$@"
WRAPPER
  chmod +x "$REPO/hooks/prepare-commit-msg"
  git -C "$REPO" config core.hooksPath "$REPO/hooks"
}

# Build one commit on the current branch without running the hook.
commit_with_id() { # commit_with_id <file> <subject> <id> <body>
  local file="$1" subject="$2" id="$3" body="${4:-probe body}"
  printf '%s\n' "$body" > "$REPO/$file"
  git -C "$REPO" add "$file"
  git -C "$REPO" commit -qm "$subject" -m "$body" -m "Commit-Id: $id"
}

commit_id() {
  git -C "$REPO" log -1 --format=%B "$1" | sed -n 's/^Commit-Id: //p' | head -1
}

report_case() { # report_case <name> <before-ref> <after-ref>
  local name="$1" before_ref="$2" after_ref="$3"
  local before_id after_id before_hash after_hash hook_runs cherry outcome

  before_id="$(commit_id "$before_ref")"
  after_id="$(commit_id "$after_ref")"
  if [[ -z "$before_id" || -z "$after_id" ]]; then
    printf 'STOP  %s printed no id before or after\n' "$name" >&2
    exit 1
  fi

  before_hash="$(git -C "$REPO" rev-parse --short "$before_ref")"
  after_hash="$(git -C "$REPO" rev-parse --short "$after_ref")"
  hook_runs="$(grep -c '^CHERRY_PICK_HEAD' "$HOOK_LOG" || true)"
  if grep -q '^CHERRY_PICK_HEAD=1' "$HOOK_LOG"; then cherry=yes; else cherry=no; fi
  if [[ "$before_id" = "$after_id" ]]; then outcome=kept; else outcome=fresh; fi

  echo "CASE: $name"
  echo "  git version: $GIT_VERSION"
  echo "  id before: $before_id"
  echo "  CHERRY_PICK_HEAD seen by the hook: $cherry (hook runs: $hook_runs)"
  echo "  id after: $after_id"
  echo "  outcome: $outcome"
  if [[ "$before_hash" = "$after_hash" ]]; then
    echo "  hash changed: no ($before_hash)"
  else
    echo "  hash changed: yes ($before_hash -> $after_hash)"
  fi
  if [[ -s "$HOOK_LOG" ]]; then
    sed 's/^/  hook: /' "$HOOK_LOG"
  else
    echo "  hook: did not run"
  fi
  echo
}

# ── 1. a pick onto a moved base ─────────────────────────────────
setup_repo
git -C "$REPO" checkout -q -b base
commit_with_id base.txt "feat: move the base" 0000501
git -C "$REPO" checkout -q -b topic HEAD~1
commit_with_id topic.txt "feat: pick onto a moved base" 0000502
BEFORE="$(git -C "$REPO" rev-parse topic)"
install_hook
: > "$HOOK_LOG"
git -C "$REPO" checkout -q topic
git -C "$REPO" rebase base > "$TMP/rebase-1.log" 2>&1
report_case "pick onto a moved base" "$BEFORE" topic

# ── 2. an interactive rebase whose leading commit keeps its parent ──
setup_repo
git -C "$REPO" checkout -q -b topic
commit_with_id leading.txt "feat: keep the leading commit" 0000601
commit_with_id trailing.txt "feat: replay the trailing commit" 0000602
BEFORE="$(git -C "$REPO" rev-parse topic~1)"
install_hook
: > "$HOOK_LOG"
git -C "$REPO" checkout -q topic
GIT_SEQUENCE_EDITOR=: git -C "$REPO" rebase -i HEAD~2 > "$TMP/rebase-2.log" 2>&1
LEADING_AFTER="$(git -C "$REPO" rev-parse topic~1)"
report_case "unchanged leading commit in an interactive rebase" "$BEFORE" "$LEADING_AFTER"

# ── 3. a reworded commit ────────────────────────────────────────
setup_repo
git -C "$REPO" checkout -q -b topic
commit_with_id reword.txt "feat: reword this commit" 0000701
BEFORE="$(git -C "$REPO" rev-parse topic)"
install_hook
: > "$HOOK_LOG"
cat > "$TMP/reword-sequence" <<'SEQ'
#!/usr/bin/env bash
perl -pi -e 's/^pick /reword /' "$1"
SEQ
cat > "$TMP/reword-message" <<'MSG'
#!/usr/bin/env bash
printf '\nReworded by the probe.\n' >> "$1"
MSG
chmod +x "$TMP/reword-sequence" "$TMP/reword-message"
git -C "$REPO" checkout -q topic
GIT_SEQUENCE_EDITOR="$TMP/reword-sequence" GIT_EDITOR="$TMP/reword-message" \
  git -C "$REPO" rebase -i HEAD~1 > "$TMP/rebase-3.log" 2>&1
report_case "reworded commit" "$BEFORE" topic

# ── 4. the --apply backend ─────────────────────────────────────
setup_repo
git -C "$REPO" checkout -q -b base
commit_with_id base.txt "feat: move the base" 0000801
git -C "$REPO" checkout -q -b topic HEAD~1
commit_with_id apply.txt "feat: replay with --apply" 0000802
BEFORE="$(git -C "$REPO" rev-parse topic)"
install_hook
: > "$HOOK_LOG"
git -C "$REPO" checkout -q topic
git -C "$REPO" rebase --apply base > "$TMP/rebase-4.log" 2>&1
report_case "rebase --apply" "$BEFORE" topic
