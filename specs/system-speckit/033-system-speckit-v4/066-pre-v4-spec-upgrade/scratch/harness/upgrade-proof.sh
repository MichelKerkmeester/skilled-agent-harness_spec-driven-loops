#!/usr/bin/env bash
# Run the upgrade command over a pre-v4 tag's spec tree and check the proof
# plan: pass counts after --apply, a second --apply that changes nothing, a dry
# run that changes nothing, and a new broken link that still fails --strict.
# The sandbox holds a real copy of system-spec-kit, dist included, so every
# tool's project boundary is the sandbox and the real repo is never written.
# Usage: HARNESS_SANDBOX=<dir> upgrade-proof.sh <tag> [--include-archive]
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(git -C "$HERE" rev-parse --show-toplevel)"
S="${HARNESS_SANDBOX:?set HARNESS_SANDBOX to a scratch directory outside the repo}"
TAG="$1"; ARCH="${2:-}"
W="$S/proof-$TAG${ARCH:+-archive}"
CMD=.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs
LOG="$W.log"

manifest() { ( cd "$W" && find specs -type f -print0 | sort -z | xargs -0 shasum -a 256 ) > "$1"; }

rm -rf "$W"; mkdir -p "$W/.opencode" "$W/.skilled/skills" "$W/raw"
rsync -a --exclude node_modules "$REPO/.skilled/skills/system-spec-kit" "$W/.skilled/skills/"
for nm in node_modules runtime/node_modules runtime/cli/node_modules; do
  [[ -e "$REPO/.skilled/skills/system-spec-kit/$nm" ]] && ln -s "$REPO/.skilled/skills/system-spec-kit/$nm" "$W/.skilled/skills/system-spec-kit/$nm"
done
# The build record that proves the dist fresh is keyed by the dist's absolute
# path, so a copy has none and falls back to comparing mtimes. The copy's dist
# was built from exactly these sources, so it is marked newer than them.
find "$W/.skilled/skills/system-spec-kit/runtime" -path '*/node_modules' -prune -o -path '*/dist/*' -type f -print0 | xargs -0 touch
( cd "$REPO" && git archive "$TAG" .opencode/specs ) | tar -x -C "$W/raw"
mv "$W/raw/.opencode/specs" "$W/specs"; rm -rf "$W/raw"
( cd "$W" && git init -q && git -c core.hooksPath=/dev/null -c core.excludesFile=/dev/null add specs && git -c core.hooksPath=/dev/null -c user.name=h -c user.email=h@x commit -qm base )
echo "[$TAG] sandbox ready: $(find "$W/specs" -name spec.md | wc -l | tr -d ' ') spec.md files" | tee "$LOG"

manifest "$W.m0"
( cd "$W" && node "$CMD" $ARCH > "$W.dry.out" 2>&1 ); DRY=$?
manifest "$W.m1"
cmp -s "$W.m0" "$W.m1" && M1=identical || M1=CHANGED
echo "[$TAG] proof 5: dry run exit=$DRY manifest=$M1 (want exit 1, identical)" | tee -a "$LOG"

( cd "$W" && node "$CMD" --apply $ARCH > "$W.apply1.out" 2>&1 ); A1=$?
echo "[$TAG] first --apply exit=$A1" | tee -a "$LOG"
tail -n 40 "$W.apply1.out" | grep -E '^(inspected|passing|still failing|unreadable|step .*FAILED)' | tee -a "$LOG"

# Scope of the first --apply: it adds no document, changes no status line, and
# gives an archived packet nothing but its baseline file.
( cd "$W" && git -c core.excludesFile=/dev/null status --porcelain --untracked-files=all -- specs ) > "$W.status"
NEWMD=$(grep -cE '^\?\? .*\.md$' "$W.status")
ARCHMOD=$(grep -E '/z_(archive|future)/' "$W.status" | grep -cvE '^\?\? .*/upgrade-baseline\.json$')
# A status row in a table (| **Status** |), a "Status:" line, or a status: key.
STATUSLINES=$( (cd "$W" && git diff -U0 -- 'specs/*.md') | grep -cE '^[-+]([^-+].*)?(\*\*Status\*\*|Status:)|^[-+][[:space:]]*status:')
echo "[$TAG] scope: new .md files=$NEWMD, archived files changed=$ARCHMOD, changed status lines=$STATUSLINES (want 0, 0, 0)" | tee -a "$LOG"
node "$HERE/validate-all.cjs" "$W" "$W.proof.jsonl" 2>/dev/null
node "$HERE/agg.cjs" "$W.proof.jsonl" "$TAG after upgrade" | tee -a "$LOG"

manifest "$W.m2"
( cd "$W" && node "$CMD" --apply $ARCH > "$W.apply2.out" 2>&1 ); A2=$?
manifest "$W.m3"
cmp -s "$W.m2" "$W.m3" && M3=identical || M3=CHANGED
echo "[$TAG] proof 2: second --apply exit=$A2 manifest=$M3 (want identical)" | tee -a "$LOG"

# Negative control: a link to a file that does not exist, added to an upgraded
# packet that now passes, must fail strict again.
PKT="$(node -e '
const rows = require("fs").readFileSync(process.argv[1], "utf8").trim().split("\n").map(JSON.parse);
const hit = rows.find((r) => !r.archived && !r.unreadable && r.errors === 0 && r.warnings > 0);
process.stdout.write(hit ? hit.folder : "");' "$W.proof.jsonl")"
if [[ -n "$PKT" ]]; then
  cp "$W/$PKT/spec.md" "$W.neg.bak"
  printf '\nSee [missing](./does-not-exist-%s.md).\n' "$$" >> "$W/$PKT/spec.md"
  NEG="$(cd "$W" && bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$PKT" --strict --no-recursive 2>&1)"
  cp "$W.neg.bak" "$W/$PKT/spec.md"
  echo "[$TAG] proof 3: $PKT -> $(grep -E '^RESULT' <<<"$NEG") | $(grep -E '^x ' <<<"$NEG" | tr '\n' ' ')" | tee -a "$LOG"
else
  echo "[$TAG] proof 3: no passing packet with a recorded finding to mutate" | tee -a "$LOG"
fi
echo "[$TAG] FINISHED" | tee -a "$LOG"
