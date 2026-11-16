#!/usr/bin/env bash
# Show that a host with its own vocabulary passes the two captured-fixture tests
# through its own capture files, and that the same change still fails them with
# no host capture. Runs against a private copy of the tree, never a git checkout,
# because it edits sk-code's routing vocabulary and writes host capture files.
#
# usage: host-capture-check.sh --tree <copy root> --out <dir>
#
# The host vocabulary is simulated by two removals from sk-code:
#   - "the stylesheet" from ROUTER.md, carried into graph-metadata.json by
#     generate-router-intent-signals.cjs --write. It moves the `top` of
#     cmd-design-extract-plain-holdout-01, which command-routing-slice reads.
#   - "build a tiny script" and "tiny script that counts" from graph-metadata.json
#     intent_signals. They move the native top of rr-iter3-070, which
#     local-native-divergence-ratchet reads.
# Every edited file is put back on exit, and the host files are removed.

set -euo pipefail

TREE='' OUT=''
while [ $# -gt 0 ]; do
  case "$1" in
    --tree) TREE=$2; shift 2 ;;
    --out) OUT=$2; shift 2 ;;
    *) echo "unknown option: $1" >&2; exit 64 ;;
  esac
done
[ -n "$TREE" ] && [ -n "$OUT" ] || { echo "usage: host-capture-check.sh --tree <copy root> --out <dir>" >&2; exit 64; }
TREE=$(cd "$TREE" && pwd -P)
if [ -e "$TREE/.git" ]; then echo "refusing to run in a git checkout: $TREE" >&2; exit 64; fi
mkdir -p "$OUT"

RT="$TREE/.skilled/skills/system-skill-advisor/runtime"
HUB="$TREE/.skilled/skills/sk-code"
BASELINE_HOST="$RT/scripts/routing-accuracy/command-routing-baseline.host.json"
LEDGER_HOST="$RT/tests/parity/fixtures/local-native-approved-divergences.host.json"
TESTS='tests/command-routing-slice.vitest.ts tests/parity/local-native-divergence-ratchet.vitest.ts'

cp "$HUB/ROUTER.md" "$OUT/ROUTER.md.orig"
cp "$HUB/graph-metadata.json" "$OUT/graph-metadata.json.orig"
restore() {
  cp "$OUT/ROUTER.md.orig" "$HUB/ROUTER.md"
  cp "$OUT/graph-metadata.json.orig" "$HUB/graph-metadata.json"
  rm -f "$BASELINE_HOST" "$LEDGER_HOST"
}
trap restore EXIT
rm -f "$BASELINE_HOST" "$LEDGER_HOST"

run_tests() {
  (cd "$RT" && npx vitest run $TESTS > "$OUT/$1.txt" 2>&1) || true
  echo "$1: $(grep -E '^ +Tests ' "$OUT/$1.txt" | sed 's/^ *//')"
  grep -E '^ +(×|✕) ' "$OUT/$1.txt" | sed 's/^ */  failed: /' || true
}

run_tests upstream-vocabulary

sed -i '' 's/"with css", "the stylesheet", "css file"/"with css", "css file"/' "$HUB/ROUTER.md"
node "$TREE/.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs" --write --hub sk-code > "$OUT/generator.out"
node -e '
const fs = require("fs");
const path = process.argv[1];
const meta = JSON.parse(fs.readFileSync(path, "utf8"));
const drop = new Set(["build a tiny script", "tiny script that counts"]);
meta.intent_signals = meta.intent_signals.filter((signal) => !drop.has(signal));
fs.writeFileSync(path, `${JSON.stringify(meta, null, 2)}\n`);' "$HUB/graph-metadata.json"

run_tests host-vocabulary-no-host-capture

# A host makes its capture files from its own checkout by redirecting each
# capture's stdout. The ledger capture prints a one-line summary before the
# ledger, so that first line is dropped.
(cd "$RT" && node scripts/routing-accuracy/capture-command-routing-baseline.mjs > "$BASELINE_HOST")
(cd "$RT" && node scripts/routing-accuracy/capture-local-native-divergence-ledger.mjs | tail -n +2 > "$LEDGER_HOST")

run_tests host-vocabulary-with-host-capture

# The host files keep every row guarded: a vocabulary change made after they
# were captured fails the tests against them. Putting upstream's vocabulary
# back is such a change.
cp "$OUT/ROUTER.md.orig" "$HUB/ROUTER.md"
cp "$OUT/graph-metadata.json.orig" "$HUB/graph-metadata.json"

run_tests later-change-with-host-capture
