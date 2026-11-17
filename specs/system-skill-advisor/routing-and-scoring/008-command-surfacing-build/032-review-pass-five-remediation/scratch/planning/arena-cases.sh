#!/usr/bin/env bash
# Planning probe: one line per arena-builder case, each on its own temporary source
# repository, so one refusal never hides the next case.
#   A  dirty source: the tracked source edited after the build, nothing committed
#   B  stale build: the tree is clean, the copied dist is older than its source
#   C  escaping link: clean and fresh, plus a dist symlink to a folder outside
#   D  control: clean and fresh, no link, prints the marker's lines
#   E  tracked dotenv: clean and fresh, a committed .env.example at the root
# Usage: arena-cases.sh <path to prepare-behaviour-arena.mjs>
# Writes only under one mktemp folder in TMPDIR and removes it before it exits.
set -u
BUILDER="$1"
T=$(mktemp -d "${TMPDIR:-/tmp}/arena-cases.XXXXXX") || exit 1
trap 'rm -rf "$T"' EXIT
G() { git -c core.fsmonitor=false -c core.hooksPath=/dev/null -c user.name=probe -c user.email=probe@example.invalid "$@"; }

# A source repository with dist ignored, src.js committed and a dist built from it.
# fresh: the build is newer than the source. stale: the source is newer than the build.
make_source() {
  local dir="$1" order="$2"
  mkdir -p "$dir" && cd "$dir" || exit 1
  G init -q
  printf 'dist/\n' > .gitignore
  printf 'v1\n' > src.js
  G add -A && G commit -qm v1
  mkdir dist && printf 'built-from-v1\n' > dist/out.js
  if [ "$order" = fresh ]; then
    touch -t 202001010000 src.js .gitignore
  else
    touch -t 202001010000 dist/out.js dist
  fi
  cd "$T" || exit 1
}

run_case() {
  local label="$1" src="$2" dest="$T/arena-$1"
  local out code
  out=$(node "$BUILDER" --source "$src" --dest "$dest" 2>/dev/null)
  code=$?
  printf '%s exit=%s %s' "$label" "$code" "$(printf '%s' "$out" | jq -c '{ok, code} + (if has("trackedDotenv") then {trackedDotenv} else {} end)' 2>/dev/null || printf 'unparsed')"
}

make_source "$T/a" fresh
printf 'v2-uncommitted\n' > "$T/a/src.js"
echo "$(run_case A "$T/a") source-status-lines=$(cd "$T/a" && G status --porcelain | wc -l | tr -d ' ')"

make_source "$T/b" stale
echo "$(run_case B "$T/b") source-status-lines=$(cd "$T/b" && G status --porcelain | wc -l | tr -d ' ')"

make_source "$T/c" fresh
mkdir -p "$T/outside" && printf 'outside-value\n' > "$T/outside/secret.txt"
ln -s "$T/outside" "$T/c/dist/linked"
echo "$(run_case C "$T/c") outside-readable=$([ -f "$T/arena-C/dist/linked/secret.txt" ] && echo yes || echo no)"

make_source "$T/d" fresh
echo "$(run_case D "$T/d") marker-lines=$(wc -l < "$T/arena-D/.git/skilled-behaviour-arena" 2>/dev/null | tr -d ' ') marker-second-line=$(sed -n '2p' "$T/arena-D/.git/skilled-behaviour-arena" 2>/dev/null | tr ' ' '_')"

make_source "$T/e" fresh
(cd "$T/e" && printf 'KEY=\n' > .env.example && touch -t 202001010000 .env.example && G add -A && G commit -qm env && touch -t 202001010000 .env.example)
echo "$(run_case E "$T/e") arena-has-env-example=$([ -f "$T/arena-E/.env.example" ] && echo yes || echo no)"
