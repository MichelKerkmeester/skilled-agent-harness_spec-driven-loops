#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: sk-git Rebase Sentence Check
# ───────────────────────────────────────────────────────────────
# The observable checks behind the corrected rebase sentence, its skill
# version, its changelog entry and the untouched commit hook.
#
# Exit Codes:
#   0 - Every check passed
#   1 - At least one check failed
#
set -uo pipefail

ROOT="$(git -C "$(dirname "${BASH_SOURCE[0]}")" rev-parse --show-toplevel)"
SKILL="$ROOT/.skilled/skills/sk-git/SKILL.md"
CHANGELOG="$ROOT/.skilled/skills/sk-git/changelog/v1.11.12.0.md"
PROBE="$ROOT/specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/018-sk-git-rebase-sentence/scratch/rebase-probe.txt"

FAIL=0

pass() { printf 'PASS  %s\n' "$1"; }
fail() { printf 'FAIL  %s: %s\n' "$1" "$2"; FAIL=$((FAIL + 1)); }

check_absent() { # check_absent <label> <fixed-string> <file>
  if rg -qF -- "$2" "$3" 2>/dev/null; then
    fail "$1" "found: $2"
  else
    pass "$1"
  fi
}

check_present() { # check_present <label> <fixed-string> <file>
  if rg -qF -- "$2" "$3" 2>/dev/null; then
    pass "$1"
  else
    fail "$1" "missing: $2"
  fi
}

check_absent "the old rebase sentence is gone" \
  "A rebase keeps an id only when the replayed message still carries one" "$SKILL"

check_present "the new sentence names both conditions" \
  "only when the repository asks for ids and git marks the pick with \`CHERRY_PICK_HEAD\`" "$SKILL"

check_present "the skill version is 1.11.12.0" "version: 1.11.12.0" "$SKILL"

if [[ -f "$CHANGELOG" ]]; then
  pass "the changelog file exists"
  check_present "the changelog names 1.11.12.0" "1.11.12.0" "$CHANGELOG"
else
  fail "the changelog file exists" "$CHANGELOG is missing"
  fail "the changelog names 1.11.12.0" "$CHANGELOG is missing"
fi

if [[ -f "$PROBE" ]]; then
  probe_cases="$(grep -c '^CASE: ' "$PROBE" || true)"
  if [[ "$probe_cases" = "4" ]]; then
    pass "the probe output holds four cases"
  else
    fail "the probe output holds four cases" "got $probe_cases"
  fi
else
  fail "the probe output holds four cases" "$PROBE is missing"
fi

run_check() { # run_check <label> <command...>
  local label="$1"
  shift
  if "$@" >/dev/null 2>&1; then
    pass "$label"
  else
    fail "$label" "command failed: $*"
  fi
}

run_check "frontmatter-version verify passes" \
  env -u AI_SESSION_CHILD -u OPENCODE_DB node "$ROOT/.skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs" verify --skill sk-git
run_check "the skill package validates" \
  python3 "$ROOT/.skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py" "$ROOT/.skilled/skills/sk-git"
run_check "the skill document validates" \
  python3 "$ROOT/.skilled/skills/sk-doc/shared/scripts/validate_document.py" "$SKILL"
run_check "the commit hook folder is unchanged" \
  git -C "$ROOT" diff --quiet HEAD -- .skilled/scripts/git-hooks

printf '\nchecks: 10, failed: %d\n' "$FAIL"
exit $((FAIL > 0 ? 1 : 0))
