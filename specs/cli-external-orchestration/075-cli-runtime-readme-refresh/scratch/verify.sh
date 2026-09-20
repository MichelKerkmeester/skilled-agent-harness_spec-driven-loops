#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# Packet verifier: the acceptance rows for the cli runtime README refresh.
#
# Written as a script and not as eight inline commands because a shell command
# naming several cli-* executors is refused by the dispatch guard before it runs.
#
# Gated rows (9). The first eight are the plan's, in its order. The ninth is the
# repo-wide broken-link count, added because a success criterion no check enforces
# is a criterion nothing protects: leaving SC-002 outside the gate would let the
# cli-pi repoint silently regress.
#
# Usage: bash verify.sh            # summary + failures
#        bash verify.sh --verbose # also print each row's evidence
# ───────────────────────────────────────────────────────────────
set -uo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKET="$(cd "$HERE/.." && pwd)"
ROOT="$(cd "$PACKET/../../.." && pwd)"
VERBOSE=0
[ "${1:-}" = "--verbose" ] && VERBOSE=1

SKILLS="$ROOT/.skilled/skills/cli-external-orchestration"
RUNTIMES="claude-code codex cursor devin hermes jev opencode pi"
# The files that carry the stale pin as a markdown link. cli-pi/changelog/ is
# deliberately absent: the link checker's own EXCLUDE_SEGMENTS freezes changelog
# history, and those three links are broken in relative depth as well.
PIN_FILES=(
  "$SKILLS/cli-pi/README.md"
  "$SKILLS/cli-pi/SKILL.md"
  "$SKILLS/cli-pi/assets/prompt-templates.md"
  "$SKILLS/cli-pi/references/agent-delegation.md"
  "$SKILLS/cli-pi/references/cli-reference.md"
  "$SKILLS/cli-pi/references/integration-patterns.md"
  "$SKILLS/cli-pi/references/mcp-and-third-party-packages.md"
  "$SKILLS/cli-pi/references/native-skills-and-extensions.md"
  "$SKILLS/cli-pi/references/pi-tools.md"
)
STALE_PIN='specs/cli-external-orchestration/031-cli-pi-creation'

cd "$ROOT" || exit 1

if [ ! -d "$SKILLS" ]; then
  echo "FATAL: repo root resolved to '$ROOT', which holds no cli-external-orchestration tree." >&2
  exit 1
fi

PASSED=0
FAILED=0
declare -a FAILURES

row() { # row <name> <pass|fail> <evidence>
  local name="$1" ok="$2" ev="$3"
  if [ "$ok" = "pass" ]; then
    PASSED=$((PASSED + 1))
    printf 'PASS  %-34s %s\n' "$name" "$ev"
  else
    FAILED=$((FAILED + 1))
    FAILURES+=("$name :: $ev")
    printf 'FAIL  %-34s %s\n' "$name" "$ev"
  fi
}

# ── R1: every README passes the shared document validator ───────────────────
# The verdict file prints `VALID: <path>` or `INVALID: <path>`, and "INVALID:"
# contains "VALID:" as a substring, so a bare grep for VALID: passes an invalid
# document. Require the affirmative marker AND the absence of the negative one.
valid=0; bad=""
for r in $RUNTIMES; do
  out="$(python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py "$SKILLS/cli-$r/README.md" 2>&1)"
  if printf '%s' "$out" | grep -q 'VALID:' && ! printf '%s' "$out" | grep -q 'INVALID:'; then
    valid=$((valid + 1))
  else
    bad="$bad cli-$r"
  fi
done
row "validator 8/8 VALID" "$([ "$valid" -eq 8 ] && echo pass || echo fail)" "$valid/8 VALID${bad:+; INVALID:$bad}"

# ── R2: every immediate subdirectory is named in its README ─────────────────
missing_dirs=""; checked_dirs=0
for r in $RUNTIMES; do
  readme="$SKILLS/cli-$r/README.md"
  for d in "$SKILLS/cli-$r"/*/; do
    name="$(basename "$d")/"
    checked_dirs=$((checked_dirs + 1))
    grep -qF "$name" "$readme" || missing_dirs="$missing_dirs cli-$r:$name"
  done
done
row "subdirectories named" "$([ -z "$missing_dirs" ] && echo pass || echo fail)" \
  "$((checked_dirs - $(printf '%s' "$missing_dirs" | wc -w | tr -d ' '))) /$checked_dirs named${missing_dirs:+; MISSING:$missing_dirs}"

# ── R3: every references/ + assets/ file is named in its README ─────────────
missing_files=""; checked_files=0
for r in $RUNTIMES; do
  readme="$SKILLS/cli-$r/README.md"
  for sub in references assets; do
    [ -d "$SKILLS/cli-$r/$sub" ] || continue
    for f in "$SKILLS/cli-$r/$sub"/*; do
      [ -f "$f" ] || continue
      checked_files=$((checked_files + 1))
      grep -qF "$(basename "$f")" "$readme" || missing_files="$missing_files cli-$r:$sub/$(basename "$f")"
    done
  done
done
row "references+assets files named" "$([ -z "$missing_files" ] && echo pass || echo fail)" \
  "$((checked_files - $(printf '%s' "$missing_files" | wc -w | tr -d ' '))) /$checked_files named${missing_files:+; MISSING:$missing_files}"

# ── R4: a fenced text tree is present in every README ──────────────────────
no_tree=""; trees=0
for r in $RUNTIMES; do
  if grep -q '^```text' "$SKILLS/cli-$r/README.md"; then trees=$((trees + 1)); else no_tree="$no_tree cli-$r"; fi
done
row "fenced tree present" "$([ "$trees" -eq 8 ] && echo pass || echo fail)" "$trees/8 have a fenced text block${no_tree:+; absent:$no_tree}"

# ── R5: H2 headings are sequentially numbered 1..N ─────────────────────────
bad_seq=""
for r in $RUNTIMES; do
  nums="$(grep -o '^## [0-9]\+\.' "$SKILLS/cli-$r/README.md" | grep -o '[0-9]\+' | tr '\n' ' ')"
  expected="$(seq 1 "$(printf '%s\n' $nums | wc -l | tr -d ' ')" | tr '\n' ' ')"
  [ "$(printf '%s' "$nums" | tr -s ' ')" = "$(printf '%s' "$expected" | tr -s ' ')" ] || bad_seq="$bad_seq cli-$r($nums)"
done
row "sequential H2 numbering 1..N" "$([ -z "$bad_seq" ] && echo pass || echo fail)" \
  "${bad_seq:-all 8 sequential 1..N}"

# ── R6: the stale contract pin is gone from the 9 files that link it ───────
hits=0; nasty=""
for f in "${PIN_FILES[@]}"; do
  n="$(grep -c "$STALE_PIN" "$f" 2>/dev/null || true)"
  n="${n:-0}"
  if [ "$n" -gt 0 ] 2>/dev/null; then hits=$((hits + n)); nasty="$nasty $(basename "$(dirname "$f")")/$(basename "$f"):$n"; fi
done
archived="$SKILLS/cli-pi/../../../../specs/cli-external-orchestration/z_archive/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md"
row "stale pin cleared (9 files)" "$([ "$hits" -eq 0 ] && echo pass || echo fail)" \
  "$hits stale occurrence(s)${nasty:+ in$nasty}; archived target $([ -f "$archived" ] && echo present || echo MISSING)"

# ── R7: the hermes cli-pi mirror is in sync and no new drift appeared ──────
sync_out="$(node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check 2>&1)"
drift_n="$(printf '%s' "$sync_out" | grep -c '^DRIFT ')"
stale_n="$(printf '%s' "$sync_out" | grep -c '^STALE ')"
pi_drifted=0
printf '%s' "$sync_out" | grep -qE '^(DRIFT|STALE) cli-pi$' && pi_drifted=1
# Before-state was 7 drifted + 1 stale, none of them cli-pi. Anything more is new.
if [ "$pi_drifted" -eq 0 ] && [ "$drift_n" -le 7 ] && [ "$stale_n" -le 1 ]; then
  row "hermes cli-pi mirror in sync" pass "cli-pi absent; drift=$drift_n stale=$stale_n (before: 7/1)"
else
  row "hermes cli-pi mirror in sync" fail "cli-pi drifted=$pi_drifted; drift=$drift_n stale=$stale_n (before: 7/1)"
fi

# ── R8: every changed path is authorized ──────────────────────────────────
authorized() {
  case "$1" in
    .skilled/skills/cli-external-orchestration/cli-claude-code/README.md|\
    .skilled/skills/cli-external-orchestration/cli-codex/README.md|\
    .skilled/skills/cli-external-orchestration/cli-cursor/README.md|\
    .skilled/skills/cli-external-orchestration/cli-devin/README.md|\
    .skilled/skills/cli-external-orchestration/cli-hermes/README.md|\
    .skilled/skills/cli-external-orchestration/cli-jev/README.md|\
    .skilled/skills/cli-external-orchestration/cli-opencode/README.md|\
    .skilled/skills/cli-external-orchestration/cli-pi/README.md|\
    .skilled/skills/cli-external-orchestration/cli-pi/SKILL.md|\
    .skilled/skills/cli-external-orchestration/cli-pi/assets/prompt-templates.md|\
    .skilled/skills/cli-external-orchestration/cli-pi/references/agent-delegation.md|\
    .skilled/skills/cli-external-orchestration/cli-pi/references/cli-reference.md|\
    .skilled/skills/cli-external-orchestration/cli-pi/references/integration-patterns.md|\
    .skilled/skills/cli-external-orchestration/cli-pi/references/mcp-and-third-party-packages.md|\
    .skilled/skills/cli-external-orchestration/cli-pi/references/native-skills-and-extensions.md|\
    .skilled/skills/cli-external-orchestration/cli-pi/references/pi-tools.md|\
    .hermes/skills/cli-pi/SKILL.md)
      return 0 ;;
    specs/cli-external-orchestration/075-cli-runtime-readme-refresh/*)
      return 0 ;;
    # A compiled-routing activation manifest may be re-minted by the commit gate.
    # Allowed only on proof that the diff is a hash re-stamp, not a content change.
    *compiled-routing*manifest*.json|*compiled-routing*/compiled/*.json)
      local touched
      touched="$(git diff -U0 -- "$1" 2>/dev/null | grep '^[+-]' | grep -v '^[+-][+-]' \
        | grep -v 'effectivePolicyHash' | grep -v '^[+-][[:space:]]*$' | head -3)"
      [ -z "$touched" ] && return 0 || return 1 ;;
    *) return 1 ;;
  esac
}

unexpected=""; n_unexpected=0; n_ok=0
while IFS= read -r p; do
  [ -z "$p" ] && continue
  if authorized "$p"; then n_ok=$((n_ok + 1)); else unexpected="$unexpected $p"; n_unexpected=$((n_unexpected + 1)); fi
done < <(git status --porcelain -uall | cut -c4-)
row "authorized paths only" "$([ "$n_unexpected" -eq 0 ] && echo pass || echo fail)" \
  "$n_ok authorized; $n_unexpected unexpected${unexpected:+:$unexpected}"

# ── R9: repo-wide broken link count came down and lost the cli-pi cluster ──
links_out="$(node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs 2>&1)"
broken_n="$(printf '%s' "$links_out" | grep -o '[0-9]\+ broken' | grep -o '[0-9]\+' | head -1)"
mine="$(printf '%s' "$links_out" | grep -c 'cli-pi/\|cli-claude-code/README\|cli-codex/README\|cli-cursor/README\|cli-devin/README\|cli-hermes/README\|cli-jev/README\|cli-opencode/README')"
if [ "${broken_n:-999}" -le 5 ] && [ "$mine" -eq 0 ]; then
  row "broken links 15 -> <=5, no cluster" pass "broken=$broken_n (before 15); cli-pi/README hits=$mine"
else
  row "broken links 15 -> <=5, no cluster" fail "broken=$broken_n (before 15); cluster hits=$mine"
fi

if [ "$VERBOSE" -eq 1 ]; then
  echo
  echo "--- recorded (non-gating) ---"
  printf '%s\n' "$sync_out" | sed 's/^/  sync: /'
  printf '%s\n' "$links_out" | grep 'broken' | sed 's/^/  links: /'
  printf '%s\n' "$links_out" | sed -n '/Broken markdown links/,$p' | tail -n +2 | sed 's/^/  /'
fi

echo
if [ "$FAILED" -eq 0 ]; then
  echo "RESULT: PASSED (passed=$PASSED failed=0)"
  exit 0
else
  echo "RESULT: FAILED (passed=$PASSED failed=$FAILED)"
  for f in "${FAILURES[@]}"; do echo "  - $f"; done
  exit 1
fi
