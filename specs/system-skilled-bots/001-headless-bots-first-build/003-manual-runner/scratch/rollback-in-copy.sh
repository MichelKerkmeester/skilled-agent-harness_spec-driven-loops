#!/usr/bin/env bash
# Rollback rehearsal in a copy: copy the working tree (deep-loop and bin as committed), run the deep-loop suite, then
# remove the bots skill, its CLI and the executor allowlist entry, and run the
# suite again. The working tree is never touched.
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKTREE="$(cd "$HERE/../../../../.." && pwd)"
RESULT="$HERE/rollback-in-copy-result.txt"
COPY="$(mktemp -d "${TMPDIR:-/tmp}/bots-rollback-copy-XXXXXX")"
: > "$RESULT"
log() { printf '%s\n' "$*" | tee -a "$RESULT"; }
log "date: $(date -u +%Y-%m-%dT%H:%M:%SZ)  head: $(git -C "$WORKTREE" rev-parse --short HEAD)  copy: $COPY"
# The working tree at HEAD, clean, with its ignored build output; node_modules are linked, not copied.
[ -z "$(git -C "$WORKTREE" status --porcelain -- .skilled/skills/system-deep-loop .skilled/bin)" ] || { log "FAIL: deep-loop or bin has uncommitted changes"; exit 1; }
rsync -a --exclude .git --exclude node_modules "$WORKTREE/" "$COPY/"
(cd "$WORKTREE" && find . -name node_modules -type d -prune) | while read -r nm; do ln -s "$WORKTREE/${nm#./}" "$COPY/${nm#./}"; done
log "node_modules linked: $(cd "$COPY" && find . -name node_modules -type l | wc -l | tr -d ' ')"
# Some deep-loop tests read git state, so the copy gets its own repository; the real one is never shared.
git -C "$COPY" init -q && git -C "$COPY" -c user.email=bots-live@example.invalid -c user.name="bots live" -c core.hooksPath=/dev/null commit -q --allow-empty -m "chore: empty parent for the rollback rehearsal" -m "The snapshot needs a parent commit." && git -C "$COPY" add -A >/dev/null 2>&1 && git -C "$COPY" -c user.email=bots-live@example.invalid -c user.name="bots live" -c core.hooksPath=/dev/null commit -q -m "chore: snapshot for the rollback rehearsal" -m "A throwaway repository for one suite run." >/dev/null 2>&1
log "copy repository: $(git -C "$COPY" rev-parse --short HEAD 2>&1)"
suite() { (cd "$COPY/.skilled/skills/system-deep-loop/runtime" && npx vitest run --no-coverage > "$COPY/$1.txt" 2>&1; echo "exit=$?" >> "$COPY/$1.txt"); grep -E "Test Files|Tests |exit=" "$COPY/$1.txt" | tee -a "$RESULT"; }
log "--- 1. deep-loop suite in the copy at HEAD"
suite before
log "--- 2. remove the bots skill, its CLI and the allowlist entry"
rm -rf "$COPY/.skilled/skills/system-skilled-bots" "$COPY/.skilled/bin/bots.cjs"
grep -n "'SKILLED_BOT_RUN_ID'," "$COPY/.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts" | tee -a "$RESULT"
sed -i '' "/^  'SKILLED_BOT_RUN_ID',$/d" "$COPY/.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts"
log "allowlist entries left: $(grep -c "SKILLED_BOT_RUN_ID" "$COPY/.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts")"
log "bots skill present: $(ls -d "$COPY/.skilled/skills/system-skilled-bots" 2>/dev/null || echo none)"
log "--- 3. deep-loop suite in the copy after removal"
suite after
log "--- failing tests after removal, if any"
grep -E "^ FAIL | ×" "$COPY/after.txt" | head -30 | tee -a "$RESULT"
log "copy: $COPY"
log "DONE"
