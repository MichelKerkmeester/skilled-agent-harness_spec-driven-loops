#!/usr/bin/env bash
# Reproduce the report that a command routing baseline capture, run in the same
# shell command as a trusted skill graph scan, returns a row's `top` from before
# the scan. One invocation is one run and appends one result line.
#
# It runs against a private copy of the tree, never a git checkout, because a
# flipped run edits sk-code's ROUTER.md and graph-metadata.json. The scan writes
# its database and generation file under --db, so the shared advisor state of
# other sessions on this machine is never touched.
#
# usage: repro-capture-after-scan.sh --tree <copy root> --db <dir> --work <dir>
#          --results <file> [--flip] [--cold] [--wait <seconds>]
#
#   --flip   remove "the stylesheet" from sk-code's ROUTER.md and run
#            generate-router-intent-signals.cjs --write before the scan. That
#            keyword decides the `top` of cmd-design-extract-plain-holdout-01.
#   --cold   stop the copy's advisor daemon before the scan, so the scan starts one.
#   --wait   seconds between the first and the second capture (default 60).
#
# Result line: run=<n> mode=<plain|flip> daemon=<warm|cold> <scan facts> result=<same|differs ids>
# `same` means the capture made in the scan's command and the capture made
# --wait seconds later agree on every row.

set -euo pipefail

TREE='' DB='' WORK='' RESULTS='' FLIP=0 COLD=0 WAIT=60
while [ $# -gt 0 ]; do
  case "$1" in
    --tree) TREE=$2; shift 2 ;;
    --db) DB=$2; shift 2 ;;
    --work) WORK=$2; shift 2 ;;
    --results) RESULTS=$2; shift 2 ;;
    --flip) FLIP=1; shift ;;
    --cold) COLD=1; shift ;;
    --wait) WAIT=$2; shift 2 ;;
    *) echo "unknown option: $1" >&2; exit 64 ;;
  esac
done
for name in TREE DB WORK RESULTS; do
  if [ -z "${!name}" ]; then echo "missing --$(echo "$name" | tr 'A-Z' 'a-z')" >&2; exit 64; fi
done
TREE=$(cd "$TREE" && pwd -P)
if [ -e "$TREE/.git" ]; then
  echo "refusing to run in a git checkout: $TREE (use a private copy of the tree)" >&2
  exit 64
fi
mkdir -p "$DB" "$WORK"
DB=$(cd "$DB" && pwd -P)
WORK=$(cd "$WORK" && pwd -P)

# Every advisor process this script starts must read the private database.
export SYSTEM_SKILL_ADVISOR_DB_DIR="$DB"

RUNTIME="$TREE/.skilled/skills/system-skill-advisor/runtime"
CAPTURE="$RUNTIME/scripts/routing-accuracy/capture-command-routing-baseline.mjs"
ADVISOR="$TREE/.skilled/bin/skill-advisor.cjs"
GENERATOR="$TREE/.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs"
HUB="$TREE/.skilled/skills/sk-code"
GEN_FILE="$DB/skill-graph-generation.json"
HERE=$(cd "$(dirname "$0")" && pwd -P)
INPUTS="$WORK/capture-inputs.txt"

run_no=$(( $( [ -f "$RESULTS" ] && wc -l < "$RESULTS" || echo 0 ) + 1 ))
RUN="$WORK/run-$run_no"
mkdir -p "$RUN"

advisor_pids() { pgrep -f "$TREE/.skilled/(bin/system-skill-advisor-launcher.cjs|skills/system-skill-advisor/runtime/dist/runtime/advisor-server.js)" | tr '\n' ',' | sed 's/,$//' || true; }

# The files the capture reads are recorded once by tracing a capture, so the
# hashes below cover what the capture actually opened, not a guessed list.
if [ ! -s "$INPUTS" ]; then
  : > "$WORK/reads.tsv"
  (cd "$RUNTIME" && TRACE_READS_OUT="$WORK/reads.tsv" NODE_OPTIONS="--import $HERE/trace-reads.mjs" node "$CAPTURE" > /dev/null)
  awk -F'\t' '$2=="readFileSync"{print $3}' "$WORK/reads.tsv" | sed 's#^file://##' \
    | grep "^$TREE/" | grep -v node_modules | sed "s#^$TREE/##" | sort -u > "$INPUTS"
fi

hash_inputs() {
  node -e '
const { createHash } = require("crypto");
const fs = require("fs");
const [tree, list, gen] = process.argv.slice(1);
const h = (p) => fs.existsSync(p) ? createHash("sha256").update(fs.readFileSync(p)).digest("hex").slice(0, 16) : "absent";
for (const f of fs.readFileSync(list, "utf8").split("\n").filter(Boolean)) console.log(`${h(`${tree}/${f}`)}  ${f}`);
console.log(`${h(gen)}  <db>/skill-graph-generation.json`);' "$TREE" "$INPUTS" "$GEN_FILE"
}

# Poll the one input the reported rows depend on for the whole run, so any
# rewrite between the regenerate step and the second capture is logged with
# its time and hash.
watch_hub() {
  local last='' now
  while :; do
    now="$(stat -f '%m' "$HUB/graph-metadata.json") $(shasum -a 256 "$HUB/graph-metadata.json" | cut -c1-16)"
    if [ "$now" != "$last" ]; then echo "$(node -e 'console.log(new Date().toISOString())') $now" >> "$RUN/hub-watch.log"; last=$now; fi
    sleep 0.2
  done
}

if [ "$COLD" = 1 ]; then
  pids=$(advisor_pids)
  if [ -n "$pids" ]; then kill $(echo "$pids" | tr ',' ' ') 2>/dev/null || true; sleep 2; fi
  daemon=cold
else
  daemon=warm
  [ -n "$(advisor_pids)" ] || daemon=cold-no-daemon
fi

hash_inputs > "$RUN/hash-before-scan.txt"
watch_hub & WATCH_PID=$!

# The flipped files are put back on every exit path, so a failed step never
# leaves the copy in the flipped state for the next run.
restore_hub() {
  if [ "$FLIP" = 1 ] && [ -f "$RUN/ROUTER.md.orig" ]; then
    cp "$RUN/ROUTER.md.orig" "$HUB/ROUTER.md"
    cp "$RUN/graph-metadata.json.orig" "$HUB/graph-metadata.json"
  fi
}
trap 'kill $WATCH_PID 2>/dev/null || true; restore_hub' EXIT

if [ "$FLIP" = 1 ]; then
  cp "$HUB/ROUTER.md" "$RUN/ROUTER.md.orig"
  cp "$HUB/graph-metadata.json" "$RUN/graph-metadata.json.orig"
  sed -i '' 's/"with css", "the stylesheet", "css file"/"with css", "css file"/' "$HUB/ROUTER.md"
  node "$GENERATOR" --write --hub sk-code > "$RUN/generator.out"
  mode=flip
else
  mode=plain
fi
hash_inputs > "$RUN/hash-after-regenerate.txt"

# The report's shape: the scan and the capture back to back in one command.
(cd "$TREE" && node "$ADVISOR" skill_graph_scan --trusted --format json > "$RUN/scan.json" 2> "$RUN/scan.err" \
  && (cd "$RUNTIME" && node "$CAPTURE" > "$RUN/capture-1.json" 2> "$RUN/capture-1.err"))
hash_inputs > "$RUN/hash-after-capture-1.txt"

sleep "$WAIT"

hash_inputs > "$RUN/hash-before-capture-2.txt"
(cd "$RUNTIME" && node "$CAPTURE" > "$RUN/capture-2.json" 2> "$RUN/capture-2.err")
hash_inputs > "$RUN/hash-after-capture-2.txt"

kill $WATCH_PID 2>/dev/null || true

differs=$(node -e '
const a = require(process.argv[1]).rows, b = require(process.argv[2]).rows;
const ids = [...new Set([...Object.keys(a), ...Object.keys(b)])].sort();
const out = ids.filter((id) => JSON.stringify(a[id]) !== JSON.stringify(b[id]));
console.log(out.join(","));' "$RUN/capture-1.json" "$RUN/capture-2.json")
top_row=$(node -e 'const r=require(process.argv[1]).rows["cmd-design-extract-plain-holdout-01"];console.log(r?r.top:"missing")' "$RUN/capture-1.json")
scan_facts=$(node -e '
const s = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
const d = s.data ?? {};
const scan = d.scan ?? {};
const e = scan.embeddings ?? {};
console.log(`scan=${s.status ?? "?"} gen=${d.generationBefore}->${d.generationAfter} indexedFiles=${scan.indexedFiles ?? "?"} embedded=${e.embedded ?? "?"} embedFailed=${e.failed ?? "?"}`);' "$RUN/scan.json" 2>/dev/null || echo 'scan=unparsed')
gen=$(node -e 'const g=require(process.argv[1]);console.log(`${g.generation}:${g.reason}`)' "$GEN_FILE" 2>/dev/null || echo none)
inputs_changed=$( (diff "$RUN/hash-after-regenerate.txt" "$RUN/hash-before-capture-2.txt" || true) | awk '/^>/{print $3}' | tr '\n' ',' | sed 's/,$//')

restore_hub
trap 'kill $WATCH_PID 2>/dev/null || true' EXIT
# Let the daemon's watcher settle on the restored files so its reindex cannot
# bleed into the next run.
prev='' stable=0
for _ in $(seq 1 60); do
  cur=$( [ -f "$GEN_FILE" ] && shasum -a 256 "$GEN_FILE" | cut -c1-16 || echo absent)
  if [ "$cur" = "$prev" ]; then stable=$((stable + 1)); else stable=0; fi
  [ "$stable" -ge 5 ] && break
  prev=$cur
  sleep 1
done

result=same
[ -z "$differs" ] || result="differs $differs"
line="run=$run_no mode=$mode daemon=$daemon pids=$(advisor_pids) $scan_facts gen-after-capture-2=$gen design-extract-top=$top_row inputs-changed-between-captures=${inputs_changed:-none} result=$result"
echo "$line" >> "$RESULTS"
echo "$line"
