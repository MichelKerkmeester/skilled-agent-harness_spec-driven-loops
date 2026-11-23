#!/bin/sh
# Proves the manual-run goal criterion without calling a model: one `bots run` on a manual
# bot writes exactly one run record under the user-level state root, and the consumer
# checkout's `git status --short` is identical before and after the run.
# The executor is the runner tests' codex stub, first on PATH. A claude stub would be
# refused when this runs under Claude Code, by the runner's recursion guard. HOME, the state root, the
# consumer repository and the Skilled tree that receives run folders are all throwaway.
# Usage: sh goal-manual-run-proof.sh
set -u
W="$(cd "$(dirname "$0")/../../../.." && pwd)"
BOTS="$W/.skilled/bin/bots.cjs"
FIX="$W/.skilled/skills/system-skilled-bots/runtime/tests/fixtures"
[ -f "$BOTS" ] || { echo "bots CLI not found at $BOTS"; exit 2; }
BASE="$(mktemp -d "${TMPDIR:-/tmp}/bots-goal-proof.XXXXXX")"
BASE="$(cd "$BASE" && pwd -P)"
REPO="$BASE/consumer"; TREE="$BASE/tree"; STATE="$BASE/state"; FAKEHOME="$BASE/home"
mkdir -p "$REPO/bots/manual-ok" "$TREE/.skilled/skills/.state" "$STATE" "$FAKEHOME"
git -C "$TREE" init -q
printf '%s\n' '.skilled/skills/.state/*/*' > "$TREE/.gitignore"
git -C "$REPO" init -q
printf '{"identity":"goal-proof/consumer"}\n' > "$REPO/bots/config.json"
cp "$FIX/bots/manual-ok/BOT.md" "$REPO/bots/manual-ok/BOT.md"
printf 'notes\n' > "$REPO/NOTES.txt"
git -C "$REPO" -c user.email=proof@example.invalid -c user.name=proof add -A
git -C "$REPO" -c user.email=proof@example.invalid -c user.name=proof commit -q --no-verify -m proof

BEFORE="$(git -C "$REPO" status --short)"
RECORDS_BEFORE="$(find "$STATE" -path '*/records/*.json' | wc -l | tr -d ' ')"
echo "base: $BASE"
echo "git status --short before: [${BEFORE}]"
echo "run records before: $RECORDS_BEFORE"

HOME="$FAKEHOME" XDG_STATE_HOME="$STATE" PATH="$FIX/stub-executor:$PATH" \
  node "$BOTS" run manual-ok --repo "$REPO" --skilled-tree "$TREE" </dev/null
CODE=$?
echo "bots exit=$CODE"

AFTER="$(git -C "$REPO" status --short)"
echo "git status --short after: [${AFTER}]"
find "$STATE" -path '*/records/*.json' | sed "s|$BASE|<base>|"
RECORDS_AFTER="$(find "$STATE" -path '*/records/*.json' | wc -l | tr -d ' ')"
echo "run records after: $RECORDS_AFTER"

FAILED=0
[ "$CODE" -eq 0 ] || { echo "FAIL: bots run exited $CODE"; FAILED=1; }
[ "$RECORDS_AFTER" -eq 1 ] && [ "$RECORDS_BEFORE" -eq 0 ] || { echo "FAIL: expected exactly one new run record"; FAILED=1; }
[ "$BEFORE" = "$AFTER" ] || { echo "FAIL: consumer git status changed"; FAILED=1; }
case "$(find "$REPO" -path "$REPO/.git" -prune -o -newer "$REPO/NOTES.txt" -type f -print | grep -v '/.git/' | head -1)" in
  '') echo "ok: no file in the consumer checkout changed after the commit" ;;
  *) echo "FAIL: a consumer file changed"; FAILED=1 ;;
esac
[ "$FAILED" -eq 0 ] && echo "RESULT: PASSED" || echo "RESULT: FAILED"
rm -rf "$BASE"
exit "$FAILED"
