#!/usr/bin/env bash
# Probe: what the arena builder copies from a temp source repository.
# Case A: dirty source with a rebuilt dist. Case B: clean source with a stale dist.
# Case C: a dist symlink that points outside the source.
# Usage: arena-provenance.sh <path to prepare-behaviour-arena.mjs>
set -u
BUILDER="$1"
T=/tmp/v5-arena-probe
rm -rf "$T"; mkdir -p "$T/outside"
G() { git -c core.fsmonitor=false -c user.name=probe -c user.email=probe@example.invalid "$@"; }
S="$T/src"; mkdir -p "$S"; cd "$S" || exit 1
G init -q
printf 'dist/\n' > .gitignore
printf 'v1\n' > src.js
G add -A; G commit -qm v1
mkdir dist; printf 'built-from-v1\n' > dist/out.js

echo '== A: source edited and rebuilt, nothing committed'
printf 'v2-uncommitted\n' > src.js; printf 'built-from-v2-uncommitted\n' > dist/out.js
node "$BUILDER" --source "$S" --dest "$T/arena-a"; echo "builder exit=$?"
echo "arena src.js: $(cat "$T/arena-a/src.js")  arena dist/out.js: $(cat "$T/arena-a/dist/out.js")  marker head: $(cut -c1-12 "$T/arena-a/.git/skilled-behaviour-arena")"

echo '== B: source committed clean at v3, dist still holds the v2 build'
printf 'v3\n' > src.js; G add -A; G commit -qm v3
echo "source status lines: $(G status --porcelain | wc -l | tr -d ' ')"
node "$BUILDER" --source "$S" --dest "$T/arena-b"; echo "builder exit=$?"
echo "arena src.js: $(cat "$T/arena-b/src.js")  arena dist/out.js: $(cat "$T/arena-b/dist/out.js")"
echo "mtime src.js $(stat -f %Fm "$T/arena-b/src.js")  mtime dist/out.js $(stat -f %Fm "$T/arena-b/dist/out.js")  source src.js $(stat -f %Fm "$S/src.js")  source dist/out.js $(stat -f %Fm "$S/dist/out.js")"

echo '== C: a dist symlink that points outside the source'
printf 'outside-probe-value\n' > "$T/outside/secret.txt"
ln -s "$T/outside" dist/linked
node "$BUILDER" --source "$S" --dest "$T/arena-c"; echo "builder exit=$?"
echo "dist/linked in arena: $(readlink "$T/arena-c/dist/linked" 2>/dev/null || echo not-a-link)"
echo "outside file readable from the arena: $([ -f "$T/arena-c/dist/linked/secret.txt" ] && echo yes || echo no)"

rm -rf "$T"
echo "cleaned: $([ -e "$T" ] && echo no || echo yes)"
