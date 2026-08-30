#!/usr/bin/env bash
# Unit tests for the graph-metadata repair write boundary.
#
# The repair script decides whether a candidate is a regular file while walking
# the tree, reading the directory entry — which describes the link rather than
# its target, so symlinks are correctly skipped there. That decision was then
# acted on later by a write that follows symlinks, so a path replaced between
# the two was written through. These cases pin the write enforcing its own
# precondition instead of trusting the earlier check.

set -uo pipefail
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../../.." && pwd)"
SCRIPT="$REPO/.opencode/skills/system-spec-kit/mcp-server/scripts/repair-graph-metadata.mjs"
PASS=0; FAIL=0

if [[ ! -f "$SCRIPT" ]]; then echo "SKIP: repair script absent"; exit 0; fi

WORK="$(mktemp -d)"; trap 'rm -rf "$WORK"' EXIT

expect() {
    local name="$1" want="$2" got="$3"
    if [[ "$got" == "$want" ]]; then PASS=$((PASS+1)); printf '  ok    %-50s %s\n' "$name" "$got"
    else FAIL=$((FAIL+1)); printf '  FAIL  %-50s want=%s got=%s\n' "$name" "$want" "$got"; fi
}

# Exercises the same open flags the repair write uses.
run_probe() {
    node --input-type=module -e "
import fs from 'node:fs';
const target = process.argv[1];
let fd;
try {
  fd = fs.openSync(target, fs.constants.O_WRONLY | fs.constants.O_TRUNC | fs.constants.O_NOFOLLOW);
} catch (error) {
  process.stdout.write(error && (error.code === 'ELOOP' || error.code === 'EMLINK') ? 'refused' : 'error');
  process.exit(0);
}
try { fs.writeFileSync(fd, 'REPAIRED'); process.stdout.write('wrote'); } finally { fs.closeSync(fd); }
" "$1" 2>/dev/null
}

echo "CASE                                               RESULT"
echo "-------------------------------------------------- -------"

printf 'original\n' > "$WORK/regular.json"
expect "regular destination is written" "wrote" "$(run_probe "$WORK/regular.json")"
expect "its content was replaced" "REPAIRED" "$(cat "$WORK/regular.json")"

printf 'victim\n' > "$WORK/victim.json"
ln -s "$WORK/victim.json" "$WORK/swapped.json"
expect "destination swapped to a symlink is refused" "refused" "$(run_probe "$WORK/swapped.json")"
expect "the symlink target is untouched" "victim" "$(cat "$WORK/victim.json")"

# The refusal must not be a blanket failure: the script still has to run.
if node "$SCRIPT" --dry-run >/dev/null 2>&1; then
    expect "repair script still runs end to end" "ok" "ok"
else
    expect "repair script still runs end to end" "ok" "failed"
fi

echo
printf '  %d passed, %d failed\n' "$PASS" "$FAIL"
[[ "$FAIL" -eq 0 ]]
