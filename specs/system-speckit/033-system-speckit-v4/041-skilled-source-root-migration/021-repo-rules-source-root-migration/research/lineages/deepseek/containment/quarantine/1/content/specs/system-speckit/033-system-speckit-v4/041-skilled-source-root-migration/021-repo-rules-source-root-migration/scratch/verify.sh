#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Phase verification for the rule-corpus relocation
# ─────────────────────────────────────────────────────────────────────────────
# One runner for every check this change makes a claim about, so a red row is
# visible without reading tails by hand. Each check prints PASS or FAIL with the
# line that decides it; the runner exits non-zero when any row is red.
#
# Layout-aware rows carry their own fixture: the canonical layout is what this
# repository ships, and the plain layout is what a repository with no source
# root still gets, so both are exercised rather than asserted.
set -uo pipefail

cd "$(git rev-parse --show-toplevel)" || exit 2
PKT="$(cd "$(dirname "$0")/.." && pwd)"
PARENT="$(cd "$PKT/.." && pwd)"
CHECKER=.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs
BASE="$(sed -n 's/^# base=//p' "$PKT/scratch/baseline/freeze-digest.txt")"
PASSED=0
FAILED=0

pass() { printf 'PASS  %-22s %s\n' "$1" "${2:-}"; PASSED=$((PASSED + 1)); }
fail() { printf 'FAIL  %-22s %s\n' "$1" "${2:-}"; FAILED=$((FAILED + 1)); }

# Runs a command, keeps its output, and reports the given expectation over that
# output rather than trusting an exit status on its own.
expect() { # expect <name> <expected-substring> <command...>
  local name="$1" want="$2"; shift 2
  local out
  out="$("$@" 2>&1)"
  if printf '%s' "$out" | grep -Fq "$want"; then
    pass "$name" "$(printf '%s' "$out" | tail -1 | cut -c1-110)"
  else
    fail "$name" "$want not in: $(printf '%s' "$out" | tail -2 | tr '\n' ' ' | cut -c1-110)"
  fi
}

expect 'corpus checker'    'RESULT: PASSED (9/9' node "$CHECKER"
expect 'markdown links'    '0 broken markdown links' node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs
expect 'gate inputs'       'RESULT: PASSED'      bash .github/scripts/check-gate-inputs.sh
expect 'farm integrity'    'PASSED'              node "$PKT/scratch/check-farm.cjs"
expect 'agent mirror sync' 'all mirrors in sync' env NODE_PATH="$PWD/.skilled/skills/system-spec-kit/node_modules" node .skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs --all
expect 'doctor roster'     'STATUS=OK'           node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs
expect 'doctor catalog'    'STATUS=OK'           node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs

# Generators: a mirror that no longer matches its source is drift this change
# would have introduced. The hermes mirror carries one pre-existing drift at the
# base commit, so it is judged on the drift set, not on a clean exit.
expect 'runtime mirrors'   'PASS'  node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
expect 'codex agents'      'PASS'  node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check
expect 'codex prompts'     'PASS'  node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check
expect 'pi agents'         'PASS'  node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check

hermes_now="$(node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check 2>&1 | grep -E '^(DRIFT|FAIL)' | sort)"
hermes_base="$(grep -E '^(DRIFT|FAIL)' "$PKT/scratch/baseline/sync-skills-hermes.txt" | sort)"
if [ "$hermes_now" = "$hermes_base" ]; then
  pass 'hermes skills' "drift set unchanged from base: $(printf '%s' "$hermes_now" | head -1 | cut -c1-70)"
else
  fail 'hermes skills' "new drift: $(printf '%s' "$hermes_now" | tr '\n' ' ' | cut -c1-110)"
fi

# The frozen record is a diff, not a listing: modification or deletion of a
# frozen path is the failure, while this change legitimately adds a packet.
# Two exceptions are planned writing, not drift: the new packet itself, and the
# parent packet's phase map, which every appended child phase registers in.
frozen="$(git diff --diff-filter=MD "$BASE" HEAD -- specs \
  ':!specs/**/021-repo-rules-source-root-migration/**' \
  ':!specs/**/041-skilled-source-root-migration/spec.md' \
  ':!specs/**/041-skilled-source-root-migration/graph-metadata.json' \
  ':(glob)**/changelog/**' ':!:(glob)**/node_modules/**' \
  ':(glob)**/benchmark/reports/**' ':!:(glob)**/node_modules/**' \
  .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/latency-report.json \
  .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json \
  .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/recipe-execution.json \
  .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/daemon-off-proof.json)"
if [ -z "$frozen" ]; then
  pass 'frozen record' "no modified or deleted frozen file since ${BASE:0:8}"
else
  fail 'frozen record' "$(printf '%s' "$frozen" | grep -c '^[AMD]') paths touched"
fi

# The repository link checker walks skill, command and agent roots only, so the
# root-facing documents sit outside it: AGENTS.md is checked here, and the
# router rows and rule-body backlinks are covered by the corpus checker.
missing=""
for target in $(grep -o ']([^)]*repo-rules[^)]*)' AGENTS.md | sed 's/](//; s/)$//' | sort -u); do
  [ -f "$target" ] || missing="$missing $target"
done
if [ -z "$missing" ]; then
  pass 'AGENTS.md links' "every rule link resolves"
else
  fail 'AGENTS.md links' "unresolved: $missing"
fi

# History survives the move: the public path is a link, so a reader who runs
# --follow must still reach the commits before the relocation.
followed="$(git log --follow --oneline -- .skilled/repo-rules/blast-radius.md | wc -l | tr -d ' ')"
if [ "$followed" -gt 1 ]; then
  pass 'history follows' "$followed commits reachable through the move"
else
  fail 'history follows' "git log --follow found $followed commit(s)"
fi

# The plain layout stays supported: a repository with no source root keeps its
# corpus in repo-rules/ and must still pass all nine checks.
fixture="$(mktemp -d)"
mkdir -p "$fixture/scripts" "$fixture/repo-rules"
cp .skilled/repo-rules/*.md "$fixture/repo-rules/"
cp "$CHECKER" "$fixture/scripts/"
sed 's|\.skilled/repo-rules/|repo-rules/|g' 'REPO RULES.md' > "$fixture/REPO RULES.md"
sed -i.bak 's|\.\./\.\./REPO%20RULES\.md|../REPO%20RULES.md|g' "$fixture"/repo-rules/*.md
rm -f "$fixture"/repo-rules/*.bak
if node "$fixture/scripts/check-repo-rules.cjs" 2>&1 | grep -Fq 'RESULT: PASSED (9/9'; then
  pass 'plain layout' 'repo-rules/ fixture passes all nine checks'
else
  fail 'plain layout' 'the repo-rules/ fixture did not pass'
fi
rm -rf "$fixture"

expect 'packet validation' 'RESULT: PASSED' bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PKT" --strict
expect 'parent validation' 'RESULT: PASSED' bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PARENT" --recursive --strict

echo
printf 'RESULT: %s (passed=%d failed=%d)\n' "$([ "$FAILED" -eq 0 ] && echo PASSED || echo FAILED)" "$PASSED" "$FAILED"
[ "$FAILED" -eq 0 ]
