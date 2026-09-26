#!/usr/bin/env bash
# Development gate for the Ruby frontend's insertions over a real corpus:
# Ruby's whole standard library plus the Rails, Rack, RSpec, Minitest,
# test-unit and Cucumber gems, about 3,000 files. The gems are installed once
# into a stable directory outside any checkout ($SUPERCOV_RUBY_CORPUS,
# default ~/.cache/supercov/ruby-corpus) so the sweep is repeatable; the plan
# comes from the engine's `ruby_plan` example and the check is
# scripts/ruby-position-sweep.rb with `--load` (every file transformed,
# compiled, and loaded untouched and probed in separate processes).
#
# Usage: scripts/ruby-corpus-sweep.sh [ruby]       (default: ruby on PATH)
set -euo pipefail

repository=$(cd "$(dirname "$0")/.." && pwd)
ruby=${1:-ruby}
corpus=${SUPERCOV_RUBY_CORPUS:-$HOME/.cache/supercov/ruby-corpus}
work=$(mktemp -d "${TMPDIR:-/tmp}/supercov-ruby-corpus-XXXXXX")
trap 'rm -rf "$work"' EXIT

bindir=$("$ruby" -e 'print RbConfig::CONFIG["bindir"]')
if [ ! -d "$corpus/gems" ]; then
  echo "[ruby-corpus] installing the corpus gems into $corpus"
  "$bindir/gem" install --install-dir "$corpus" --no-document \
    rails rack rspec minitest test-unit cucumber
fi

rubylibdir=$("$ruby" -e 'print RbConfig::CONFIG["rubylibdir"]')
find "$rubylibdir" "$corpus/gems" -name '*.rb' -type f | sort > "$work/files.txt"
echo "[ruby-corpus] $(wc -l < "$work/files.txt" | tr -d ' ') files"

(cd "$repository" && cargo run -q -p supercov-engine --example ruby_plan -- $(cat "$work/files.txt")) > "$work/plan.json"

# Loaded files may write to the working directory (a gem's extconf leaves a
# Makefile and mkmf.log), so the sweep runs from a scratch directory.
mkdir -p "$work/cwd"
cd "$work/cwd"
GEM_PATH=$corpus RUBYOPT= "$ruby" "$repository/scripts/ruby-position-sweep.rb" --load "$work/plan.json"
