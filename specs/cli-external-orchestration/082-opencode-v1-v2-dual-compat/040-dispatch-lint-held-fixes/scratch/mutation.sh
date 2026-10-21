#!/usr/bin/env bash
# Runs the new tests against the pre-change sources: each listed source file is swapped for its
# copy at the base commit (MUTATION_BASE, default the phase base), the command runs, and the changed file is put back byte for byte.
# Usage: mutation.sh <label> "<test command>" <source> [<source> ...]
set -uo pipefail
label="$1"; cmd="$2"; shift 2
root="$(git rev-parse --show-toplevel)"
base="${MUTATION_BASE:-f14f449a6e}"
out="$root/specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/040-dispatch-lint-held-fixes/scratch/mutation"
keep="$(mktemp -d)"
mkdir -p "$out"
export PATH="/Users/michelkerkmeester/.nvm/versions/node/v26.8.2/bin:$PATH"
cd "$root"
for f in "$@"; do mkdir -p "$keep/$(dirname "$f")"; cp "$f" "$keep/$f"; git show "$base:$f" > "$f"; done
perl -e 'alarm 900; exec @ARGV' bash -c "$cmd" > "$out/$label.txt" 2>&1
status=$?
for f in "$@"; do cp "$keep/$f" "$f"; cmp -s "$keep/$f" "$f" || { echo "RESTORE FAILED: $f"; exit 9; }; done
rm -rf "$keep"
echo "$label: exit $status against the base sources ($*)" | tee -a "$out/$label.txt"
