#!/usr/bin/env bash
# Checks the two shapes a sandbox run can leave behind for finish-run.sh: a shutting-down
# runtime that writes its project folder back after removal, and a project-dir.txt that is
# present but names no folder at all. Usage: test-finish-run.sh
set -u
here="$(cd "$(dirname "$0")" && pwd)"
root="$(mktemp -d "${TMPDIR:-/tmp}/finish-run-test.XXXXXX")"
writer=
cleanup() {
  [ -n "$writer" ] && kill "$writer" 2>/dev/null
  rm -rf "$root"
}
trap cleanup EXIT

failed=0

# Case one: a late write after finish-run leaves no project folder.
case1="$root/late-write"; out="$case1/out"; proj="$case1/project"
mkdir -p "$out" "$proj"
printf '%s\n' "$proj" > "$out/project-dir.txt"

# The first removal happens at once; the shutting-down runtime writes the folder back two
# seconds later, inside the settle window.
( sleep 2; mkdir -p "$proj" ) &
writer=$!

FINISH_SETTLE_S=5 bash "$here/finish-run.sh" claude "$out"
wait "$writer"; writer=
sleep 3

if [ -e "$proj" ]; then
  echo 'FAIL: project folder still present'
  failed=1
else
  echo 'ok - a late write after finish-run leaves no project folder'
fi

# Case two: an empty project-dir.txt removes nothing and exits 0.
case2="$root/empty-list"; out="$case2/out"; sentinel="$case2/sentinel"
mkdir -p "$out" "$sentinel"
: > "$out/project-dir.txt"

FINISH_SETTLE_S=1 bash "$here/finish-run.sh" claude "$out"
rc=$?
if [ "$rc" -eq 0 ] && [ -e "$sentinel" ]; then
  echo 'ok - an empty project-dir.txt removes nothing and exits 0'
else
  echo 'FAIL: empty project-dir.txt case'
  failed=1
fi

[ "$failed" -eq 0 ] || exit 1
echo ok
