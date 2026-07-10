#!/usr/bin/env bash
# Census one validation rule without changing the caller's environment.
# Parallelized across folders (each validate.sh invocation is independent and
# read-only) -- a serial loop over ~2,500 spec.md files at ~0.3s/invocation
# blows past a 10-minute budget, so folders are farmed out to a worker pool
# instead, each writing its own result file to avoid a shared-file race.

set -euo pipefail

usage() {
    cat <<'EOF'
Usage: census-validation-rule.sh --root <spec-root> --rule <rule-name> --flag <SPECKIT_FLAG> [--validate-script <path>] [--jobs N]
EOF
}

root=""
rule=""
flag=""
validate_script=""
jobs="12"

while [[ $# -gt 0 ]]; do
    case "$1" in
        --root)
            root="${2:-}"
            shift 2
            ;;
        --rule)
            rule="${2:-}"
            shift 2
            ;;
        --flag)
            flag="${2:-}"
            shift 2
            ;;
        --validate-script)
            validate_script="${2:-}"
            shift 2
            ;;
        --jobs)
            jobs="${2:-}"
            shift 2
            ;;
        --help|-h)
            usage
            exit 0
            ;;
        *)
            usage >&2
            exit 1
            ;;
    esac
done

if [[ -z "$root" || -z "$rule" || -z "$flag" ]]; then
    usage >&2
    exit 1
fi

if [[ -z "$validate_script" ]]; then
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    validate_script="$(cd "$script_dir/../../../../../skills/system-spec-kit/scripts/spec" && pwd)/validate.sh"
fi

if [[ ! -d "$root" || ! -f "$validate_script" ]]; then
    printf 'root or validate script is unavailable\n' >&2
    exit 1
fi

root="$(cd "$root" && pwd)"
work_dir="$(mktemp -d "${TMPDIR:-/tmp}/speckit-census.XXXXXX")"
trap 'rm -rf "$work_dir"' EXIT

export CENSUS_VALIDATE_SCRIPT="$validate_script"
export CENSUS_RULE="$rule"
export CENSUS_FLAG="$flag"
export CENSUS_WORK_DIR="$work_dir"

worker_script="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/census-worker.sh"
if [[ ! -f "$worker_script" ]]; then
    printf 'census-worker.sh not found alongside this script\n' >&2
    exit 1
fi

find "$root" -type f -name spec.md -print | sort > "$work_dir/inputs.txt"
inspected=$(wc -l < "$work_dir/inputs.txt" | tr -d ' ')

# Standalone worker script (not an exported bash function) -- macOS ships
# bash 3.2, which does not reliably support export -f for xargs workers.
# -n 1 (not -I{}) -- BSD xargs's -I replace-string mode buffers the whole
# input list up front and hits "command line cannot be assembled, too long"
# somewhere past ~1000 lines; -n 1 streams one argument per invocation with
# no such buffer and scales to the full ~2,500-folder input cleanly.
xargs -P "$jobs" -n 1 "$worker_script" < "$work_dir/inputs.txt"

results_file="$work_dir/combined.jsonl"
find "$work_dir" -maxdepth 1 -type f -name '*.json' -exec cat {} + > "$results_file"

node - "$root" "$rule" "$flag" "$inspected" "$results_file" <<'NODE'
const fs = require('fs');
const [root, rule, flag, inspected, resultsPath] = process.argv.slice(2);
const results = fs.readFileSync(resultsPath, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
const tally = { pass: 0, warn: 0, missing: 0, error: 0 };
for (const r of results) {
  if (r.status === 'pass') tally.pass++;
  else if (r.status === 'warn') tally.warn++;
  else if (r.status === 'missing') tally.missing++;
  else tally.error++;
}
console.log(JSON.stringify({
  root,
  rule,
  flag,
  inspected: Number(inspected),
  passes: tally.pass,
  warnings: tally.warn,
  missing: tally.missing,
  errors: tally.error,
  violations: results.filter((entry) => entry.status === 'warn'),
  results,
}, null, 2));
NODE
