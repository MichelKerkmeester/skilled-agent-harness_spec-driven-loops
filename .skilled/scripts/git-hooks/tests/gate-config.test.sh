#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Gate Settings Regression Harness
# ───────────────────────────────────────────────────────────────
# Proves the persistent gate settings: a `speckit.hooks.<key>` value of off in local
# or global git config makes the matching hook gate run as if its SPECKIT_SKIP_*
# variable were set, command-line config never counts, and the per-push approvals
# cannot be persisted. The registry parity checks keep gates.tsv and the hook
# scripts naming the same variables, so a new gate cannot ship without a setting.
#
# Exit Codes:
#   0 - Every case passed
#   1 - At least one case failed

set -uo pipefail

unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
HOOKS_DIR="$(cd "$HERE/.." && pwd -P)"
HELPER="$HOOKS_DIR/lib/gate-config.sh"
REGISTRY="$HOOKS_DIR/lib/gates.tsv"

for f in "$HELPER" "$REGISTRY"; do
  [[ -f "$f" ]] || { echo "FAIL: missing $f" >&2; exit 1; }
done

pass=0; fail=0
chk() { # <actual> <expected> <name>
  if [[ "$1" == "$2" ]]; then echo "PASS: $3"; pass=$((pass + 1))
  else echo "FAIL: $3 (got '$1' want '$2')"; fail=$((fail + 1)); fi
}
has() { # <haystack> <needle> <name>
  if [[ "$1" == *"$2"* ]]; then echo "PASS: $3"; pass=$((pass + 1))
  else echo "FAIL: $3 (missing '$2' in '$1')"; fail=$((fail + 1)); fi
}

T="$(mktemp -d "${TMPDIR:-/tmp}/gate-config-test.XXXXXX")"
trap 'rm -rf "$T"' EXIT
export GIT_CONFIG_GLOBAL="$T/global.gitconfig"

setup_repo() {
  rm -rf "$T/repo"; : > "$GIT_CONFIG_GLOBAL"
  git init -q "$T/repo"
  git -C "$T/repo" config user.email t@t
  git -C "$T/repo" config user.name t
  git -C "$T/repo" config commit.gpgsign false
}

# Runs the helper for one hook inside the fixture and prints `<var>=<value>` for the
# variable under test, then the helper's notices. Extra arguments are env assignments.
apply() { # <hook> <var> [VAR=value ...]
  local hook="$1" var="$2"; shift 2
  (
    cd "$T/repo" || exit 1
    for assignment in "$@"; do export "${assignment?}"; done
    # shellcheck source=../lib/gate-config.sh
    . "$HELPER"
    gate_config_apply "$hook" 2>"$T/notice"
    printf '%s=%s\n' "$var" "${!var:-unset}"
    cat "$T/notice"
  )
}

# ── 1. local config switches a gate off ──
setup_repo
git -C "$T/repo" config --local speckit.hooks.cardSync off
out="$(apply pre-commit SPECKIT_SKIP_CARD_SYNC)"
has "$out" "SPECKIT_SKIP_CARD_SYNC=1" "local off sets the skip variable"
has "$out" "the cardSync gate is off (git config speckit.hooks.cardSync in local config)" "local off prints its source"

# ── 2. global config switches a gate off ──
setup_repo
git config --global speckit.hooks.routeRemint false
out="$(apply pre-commit SPECKIT_SKIP_ROUTE_REMINT)"
has "$out" "SPECKIT_SKIP_ROUTE_REMINT=1" "global false sets the skip variable"
has "$out" "in global config" "global off names global config"

# ── 3. the off spellings are case-insensitive ──
for value in OFF No 0; do
  setup_repo
  git -C "$T/repo" config --local speckit.hooks.mirrorParity "$value"
  out="$(apply pre-commit SPECKIT_SKIP_MIRROR_PARITY)"
  has "$out" "SPECKIT_SKIP_MIRROR_PARITY=1" "value '$value' reads as off"
done

# ── 4. on, any other value, or no key leaves the gate running ──
setup_repo
out="$(apply pre-commit SPECKIT_SKIP_COMMENT_HYGIENE)"
chk "$out" "SPECKIT_SKIP_COMMENT_HYGIENE=unset" "an unset key leaves the gate on, silently"
git -C "$T/repo" config --local speckit.hooks.commentHygiene on
out="$(apply pre-commit SPECKIT_SKIP_COMMENT_HYGIENE)"
chk "$out" "SPECKIT_SKIP_COMMENT_HYGIENE=unset" "on leaves the gate on"
git -C "$T/repo" config --local speckit.hooks.commentHygiene maybe
out="$(apply pre-commit SPECKIT_SKIP_COMMENT_HYGIENE)"
chk "$out" "SPECKIT_SKIP_COMMENT_HYGIENE=unset" "an unknown value leaves the gate on"

# ── 5. local config overrides global ──
setup_repo
git config --global speckit.hooks.specRemint off
git -C "$T/repo" config --local speckit.hooks.specRemint on
out="$(apply pre-commit SPECKIT_SKIP_SPEC_REMINT)"
chk "$out" "SPECKIT_SKIP_SPEC_REMINT=unset" "local on overrides global off"

# ── 6. command-line config never counts ──
setup_repo
out="$(apply pre-commit SPECKIT_SKIP_CARD_SYNC GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=speckit.hooks.cardSync GIT_CONFIG_VALUE_0=off)"
chk "$out" "SPECKIT_SKIP_CARD_SYNC=unset" "command-scope off is ignored"
git -C "$T/repo" config --local speckit.hooks.cardSync off
out="$(apply pre-commit SPECKIT_SKIP_CARD_SYNC GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=speckit.hooks.cardSync GIT_CONFIG_VALUE_0=on)"
has "$out" "SPECKIT_SKIP_CARD_SYNC=1" "command-scope on cannot re-enable a local off"

# ── 7. a variable already set is left alone and prints nothing ──
setup_repo
git -C "$T/repo" config --local speckit.hooks.cardSync off
out="$(apply pre-commit SPECKIT_SKIP_CARD_SYNC SPECKIT_SKIP_CARD_SYNC=1)"
chk "$out" "SPECKIT_SKIP_CARD_SYNC=1" "an env skip already set stays quiet"

# ── 8. the per-push approvals cannot be persisted ──
setup_repo
git -C "$T/repo" config --local speckit.hooks.remotePush off
git -C "$T/repo" config --local speckit.hooks.massDeletion off
out="$(apply pre-push SPECKIT_ALLOW_REMOTE_PUSH)"
chk "$out" "SPECKIT_ALLOW_REMOTE_PUSH=unset" "remotePush is not persistable"
out="$(apply pre-push SPECKIT_ALLOW_MASS_DELETION)"
chk "$out" "SPECKIT_ALLOW_MASS_DELETION=unset" "massDeletion is not persistable"

# ── 9. a hook applies only its own gates ──
setup_repo
git -C "$T/repo" config --local speckit.hooks.prepushTrackGate off
out="$(apply pre-commit SPECKIT_SKIP_PREPUSH_TRACK_GATE)"
chk "$out" "SPECKIT_SKIP_PREPUSH_TRACK_GATE=unset" "pre-commit ignores a pre-push gate"
out="$(apply pre-push SPECKIT_SKIP_PREPUSH_TRACK_GATE)"
has "$out" "SPECKIT_SKIP_PREPUSH_TRACK_GATE=1" "pre-push applies its own gate"

# ── 10. registry parity with the hook scripts ──
registry_vars="$(grep -v '^#' "$REGISTRY" | awk -F'\t' 'NF >= 5 { print $3 }' | sort -u)"
hook_vars="$(grep -hoE 'SPECKIT_(SKIP|ALLOW)_[A-Z_]+' "$HOOKS_DIR"/pre-commit "$HOOKS_DIR"/pre-push \
  "$HOOKS_DIR"/prepare-commit-msg "$HOOKS_DIR"/commit-msg "$HOOKS_DIR"/post-commit \
  "$HOOKS_DIR"/post-merge "$HOOKS_DIR"/post-rewrite | sort -u)"
chk "$(comm -13 <(printf '%s\n' "$registry_vars") <(printf '%s\n' "$hook_vars") | tr '\n' ' ')" "" \
  "every hook skip or approval variable has a registry row"
chk "$(comm -23 <(printf '%s\n' "$registry_vars") <(printf '%s\n' "$hook_vars") | tr '\n' ' ')" "" \
  "every registry row names a variable a hook reads"
misplaced=""
while IFS=$'\t' read -r hook key env persistable _description; do
  [[ -z "$hook" || "$hook" == \#* ]] && continue
  grep -q "$env" "$HOOKS_DIR/$hook" || misplaced+="$key "
  [[ "$persistable" == "yes" || "$persistable" == "no" ]] || misplaced+="$key(persistable) "
done < "$REGISTRY"
chk "$misplaced" "" "every row's variable is read by the hook it names"
chk "$(grep -v '^#' "$REGISTRY" | awk -F'\t' 'NF >= 5 { print $2 }' | sort | uniq -d | tr '\n' ' ')" "" \
  "registry keys are unique"

# ── 11. the installed hook reads the setting through its symlink ──
# The installer links each hook into the global hooksPath, so the hook must find
# lib/ beside its real file. The fixture is a trusted toolchain repository.
setup_repo
mkdir -p "$T/repo/.skilled/skills/system-spec-kit" "$T/hookpath"
: > "$T/repo/.skilled/skills/system-spec-kit/SKILL.md"
git -C "$T/repo" config --local skilled.trustRepoHooks true
ln -s "$HOOKS_DIR/prepare-commit-msg" "$T/hookpath/prepare-commit-msg"
git -C "$T/repo" config --local core.hooksPath "$T/hookpath"
git -C "$T/repo" config --local speckit.hooks.prepareCommitMsg off
printf 'x\n' > "$T/repo/f.txt"
git -C "$T/repo" add f.txt
err="$(git -C "$T/repo" commit -qm 'chore: fixture' 2>&1 >/dev/null)"
has "$err" "prepare-commit-msg: the prepareCommitMsg gate is off" "the linked hook prints the notice"
chk "$(git -C "$T/repo" log -1 --format=%B | grep -c '^Commit-Id:')" "0" "the switched-off hook leaves the message unstamped"

# ── 12. an untrusted or foreign repository reads no setting ──
setup_repo
mkdir -p "$T/hookpath"
git -C "$T/repo" config --local core.hooksPath "$T/hookpath"
git -C "$T/repo" config --local speckit.hooks.prepareCommitMsg off
printf 'x\n' > "$T/repo/f.txt"
git -C "$T/repo" add f.txt
err="$(git -C "$T/repo" commit -qm 'chore: fixture' 2>&1 >/dev/null)"
chk "$err" "" "a repository without the toolchain prints no gate notice"

echo
echo "gate-config: $pass passed, $fail failed"
(( fail == 0 ))
