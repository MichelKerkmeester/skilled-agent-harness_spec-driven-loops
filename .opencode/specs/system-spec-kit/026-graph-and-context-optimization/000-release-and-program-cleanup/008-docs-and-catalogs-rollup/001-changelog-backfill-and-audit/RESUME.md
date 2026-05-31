# Autonomous Runbook — 026 Changelog Backfill

Goal (owner, 2026-05-31, going to bed): get ALL of spec 026 to 100 percent changelog completion and verification using agent workflows. Keep going autonomously, do not wait for answers.

## Reusable workflow scripts (session transcript dir)

- Inline-array backfill: `workflows/scripts/changelog-backfill-batch-wf_d587b75d-d5e.js`
- File-driven backfill: `workflows/scripts/changelog-backfill-fromfile.js` (args `{ todoFile, offset?, limit? }`)
- HVR repair: `workflows/scripts/changelog-hvr-repair-wf_6e598c88-1c5.js`

## Work inventory (in this packet)

`work-list/<track>.todo.txt` = uncovered leaves to author. `.parents.txt` = phase parents needing root.md rollups (73 total). `.noncanon.txt` = existing changelogs to relocate (28 total).

## External verification sweep (run after EVERY batch, never trust agent self-reports)

```
ROOT=.opencode/specs/system-spec-kit/026-graph-and-context-optimization
while IFS= read -r f; do
  dash=$(grep -cE "—|–" "$f")
  semi=$(grep -n ';' "$f" | grep -vE '`[^`]*;[^`]*`' | grep -c ';')
  secs=$(grep -cE '^### (Summary|Added|Changed|Fixed|Verification|Files Changed|Follow-Ups)' "$f")
  marker=$(grep -c 'SPECKIT_TEMPLATE_SOURCE' "$f"); date=$(grep -cE '^## [0-9]{4}-' "$f")
  { [ "$dash" -ne 0 ] || [ "$semi" -ne 0 ] || [ "$secs" -ne 7 ] || [ "$marker" -lt 1 ] || [ "$date" -ne 1 ]; } && echo "FAIL $f dash=$dash semi=$semi secs=$secs"
done < <(find "$ROOT/<track>" -path '*/changelog/changelog-*.md' -newermt "2026-05-31 21:00")
```
Any FAIL -> run the repair workflow on those files -> re-sweep until zero.

## Sequence (Phase 2 backfill, then 3, then 4)

1. [done] Batch 1: 007, 001, 005, 006 = 39 clean
2. [done] Batch 2: 004 = 51 clean, 8 HALT
3. [running] Batch 3: 000 (119) -> sweep -> repair
4. [next] Batch 4: 003 (223) via fromfile, todoFile = .../work-list/003-memory-and-causal-runtime.todo.txt (split offset/limit if needed) -> sweep -> repair
5. [next] Batch 5: 002 THEMATIC (~13 entries, NOT 92 per-leaf). 002 precedent groups related leaves into one entry continuing the 002-skill-advisor/changelog README numbering. Author grouped entries, not one-per-leaf.
6. Phase 3a: author root.md rollups for all 73 phase parents (use generator --mode root --json then enrich; templates/changelog/root.md; Included Phases table).
7. Phase 3b: build/update every changelog/README.md index (004 README is the model).
8. Phase 3c: canonicalize residue — relocate 28 noncanon (move, never delete), fix stale spec-folder paths in the 103 pre-existing changelogs, repair 9 dangling symlinks in 026/changelog, rename 2 non-canonical changelog.md files, migrate 003 per-child changelog dirs to parent-level, rebuild 026/changelog symlink aggregation.
9. Phase 4: write audit-report.md (coverage before/after, HALT inventory ~47, residue inventory, thin-completion flags) + sampled GPT-5.5 adversarial fidelity check via cli-opencode (read cli-opencode/SKILL.md first). Reconcile completion metadata. Final validate.sh --strict. /memory:save.

## Invariants

- No fabrication. HALT (no file) on unshipped/thin packets; log them in the audit.
- HVR whole-file: zero em/en dashes, zero non-backtick semicolons, zero Oxford commas.
- Sequential batches (shared concurrency). Each batch: launch -> wait for notification -> sweep -> repair -> next.
- The harness re-invokes on each workflow completion; keep the chain alive by always launching the next step.
