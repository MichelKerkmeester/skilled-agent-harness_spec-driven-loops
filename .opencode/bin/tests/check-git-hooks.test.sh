#!/usr/bin/env bash
# Test harness for the SessionStart git-hook check.
#
# Runs the real check against throwaway repositories: hooks under a linked source
# root must still compare as installed, a checkout that ships the toolchain must
# warn when its hook source or installer is missing, and any other repository must
# stay silent. Every case expects exit 0, because the check never blocks a session.
set -uo pipefail

unset GIT_DIR GIT_WORK_TREE GIT_COMMON_DIR GIT_INDEX_FILE GIT_OBJECT_DIRECTORY \
      GIT_ALTERNATE_OBJECT_DIRECTORIES GIT_CONFIG GIT_CONFIG_SYSTEM \
      GIT_CONFIG_COUNT GIT_NAMESPACE GIT_CEILING_DIRECTORIES

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
REPO_ROOT="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"
CHECK="$REPO_ROOT/.opencode/bin/check-git-hooks.sh"

PASS=0; FAIL=0
export GIT_CONFIG_GLOBAL=/dev/null
unset SPECKIT_GIT_HOOKS_GUARD

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

setup_repo() { # setup_repo [toolchain]
  rm -rf "$TMP"; mkdir -p "$TMP"
  git -C "$TMP" init -q
  if [[ "${1:-}" == "toolchain" ]]; then
    mkdir -p "$TMP/.opencode/skills/system-spec-kit"
    echo sentinel > "$TMP/.opencode/skills/system-spec-kit/SKILL.md"
  fi
}

run_check() { ( cd "$TMP" && bash "$CHECK" >"$TMP/out.log" 2>&1 ); }

check() { # check <label> <expected-rc> <actual-rc> <present|silent> [<substring>]
  local label="$1" want="$2" got="$3" mode="$4" needle="${5:-}"
  if [[ "$got" != "$want" ]]; then
    echo "FAIL  $label: expected rc $want, got $got"; sed 's/^/        /' "$TMP/out.log" | tail -5
    FAIL=$((FAIL + 1)); return
  fi
  if [[ "$mode" == "present" ]] && ! grep -qF -- "$needle" "$TMP/out.log"; then
    echo "FAIL  $label: output did not contain '$needle'"; sed 's/^/        /' "$TMP/out.log" | tail -5
    FAIL=$((FAIL + 1)); return
  fi
  if [[ "$mode" == "silent" && -s "$TMP/out.log" ]]; then
    echo "FAIL  $label: expected no output"; sed 's/^/        /' "$TMP/out.log" | tail -5
    FAIL=$((FAIL + 1)); return
  fi
  echo "PASS  $label"; PASS=$((PASS + 1))
}

# ── 1. hooks under a linked source root compare as installed ──
setup_repo toolchain
mkdir -p "$TMP/.skilled/scripts/git-hooks"
mv "$TMP/.opencode/skills" "$TMP/.skilled/skills"
rm -rf "$TMP/.opencode"
ln -s .skilled "$TMP/.opencode"
printf '#!/usr/bin/env bash\nexit 0\n' > "$TMP/.skilled/scripts/git-hooks/pre-commit"
chmod +x "$TMP/.skilled/scripts/git-hooks/pre-commit"
ln -s "$TMP/.opencode/scripts/git-hooks/pre-commit" "$TMP/.git/hooks/pre-commit"
run_check; RC=$?
check "hooks under a linked source root compare as installed" 0 "$RC" silent

# ── 2. a missing hook source directory warns where the toolchain ships ──
setup_repo toolchain
run_check; RC=$?
check "a missing hook source directory warns" 0 "$RC" present "hook source directory is missing"

# ── 3. a missing installer warns when self-heal would run where the toolchain ships ──
setup_repo toolchain
mkdir -p "$TMP/.opencode/scripts/git-hooks"
printf '#!/usr/bin/env bash\nexit 0\n' > "$TMP/.opencode/scripts/git-hooks/pre-commit"
run_check; RC=$?
check "a missing installer warns instead of skipping self-heal" 0 "$RC" present "installer is missing"

# ── 4. a repository that does not ship the toolchain stays silent ──
setup_repo
run_check; RC=$?
check "a repository without the toolchain stays silent" 0 "$RC" silent

echo ""
echo "check-git-hooks: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
