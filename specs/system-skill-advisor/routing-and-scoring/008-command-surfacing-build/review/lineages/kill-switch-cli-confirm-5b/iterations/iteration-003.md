# Iteration 3: Advisory Replay and Fix Provenance

## Dispatcher

- Run: `fanout-kill-switch-cli-confirm-5b-1794780590351-ezt1v0`
- Mode: review; target agent: `@deep-review`; execution: single review iteration
- Lineage: `kill-switch-cli-confirm-5b`; confirming-round-`5b` area `kill-switch-cli`
- Operator review focus: confirming round `5b`; the `kill-switch-cli` half is "the kill-switch names agree in code and docs, and docs agree with code". This iteration replays the two active advisories against the files as they stand and pins the commit that produced them.
- Dimension this iteration: traceability and maintainability replay. No new dimension is opened; the iteration checks that the two advisories are still present exactly as written and that the reviewed content is the fix state, so the confirming round cannot be closed against a stale tree.
- Sources read this iteration: `review-brief-5b.txt`, `review-scope-5b.txt`, `review-focus-5b.txt`, `verify-5/report.md`, `deep-review-strategy.md`, the reducer's `deep-review-findings-registry.json` and `deep-review-dashboard.md`, `.skilled/hooks/README.md:30-50` (replay), `.skilled/skills/system-skill-advisor/runtime/lib/README.md:54-76` (replay), and `git log` / `git diff --stat` for the five scope paths against `d0f605b42f8`, `d21dbc1cafe` and `HEAD`.
- Steer channel: `steer.md` still does not exist in the lineage directory; no lead ruling was available for this iteration.

## Files Reviewed

- `.skilled/hooks/README.md:30-50` (replay: the alias omission still stands)
- `.skilled/skills/system-skill-advisor/runtime/lib/README.md:54-76` (replay: the topology omission still stands)
- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` (provenance: last changed at `d0f605b42f8`)
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md` (provenance: last changed at `d0f605b42f8`)
- `.skilled/skills/system-skill-advisor/runtime/lib/README.md` (provenance: last changed at `d0f605b42f8`)
- `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts` (provenance: last changed at `d0f605b42f8`)
- `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` (provenance: last changed at `d0f605b42f8`)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None this iteration. Both iteration-1 advisories are still present exactly as written, and no third defect surfaced in the replay. No finding is repeated and no new one is manufactured to fill the pass.

## Traceability Checks

- `spec_code`: pass, replayed. The ten-name switch set and the docs that state it are unchanged since iteration 1; nothing in the replay contradicted the resolver reading.
- `checklist_evidence`: partial, unchanged. The confirming brief's kill-switch items remain covered by iterations 1 and 2.
- `feature_catalog_code` and `playbook_capability`: pass, replayed. CP-003's control command is still the ten-name form and the four files still match the resolver.

## Integration Evidence

- `fix provenance`: the last commit touching any of the five scope paths is `d0f605b42f8`, which is an ancestor of `d21dbc1cafe` and of `HEAD` `[SOURCE: git log -1 --format=%h -- <each scope path>]`. `git diff --stat d0f605b42f8 d21dbc1cafe -- <the five paths>` is empty, so the content reviewed in iterations 1 and 2 is the fix state and no later commit in the range moved it.
- `alias index replay`: `rg -n "MK_HOOKS_DISABLED|MK_SKILL_ADVISOR" .skilled/hooks/README.md` still returns no hit, so `c5b-iter1-P2-hooks-index-aliases` stands `[SOURCE: .skilled/hooks/README.md:36-44]`.
- `topology replay`: no `skill-graph` line exists between lines 54 and 76 of the lib README, and section 4 still lists it, so `c5b-iter1-P2-topology-skill-graph` stands `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/README.md:57-76,135]`.
- `registry`: the reducer reports `openFindingsCount: 2`, `resolvedFindingsCount: 0`, `corruptionCount: 0`, `searchDebtCount: 0` after iteration 2. No finding was resolved in this round and none was withdrawn.

## Edge Cases

- The four-way duplicate of the ten-name list is recorded once, on the incomplete copy. CP-003's list is correct today but hand-maintained; a future alias addition would have to touch it by hand. Recorded, not a separate finding.
- `manual-testing-playbook.md:209` shows the display text `[003-global-disable-flag.md](compat-and-disable/global-disable-flag.md)`: the label carries a `003-` prefix the file does not have, while the link target resolves. That file is the `docs-metadata` area of this same round, the label is cosmetic, and the line is unchanged by the fix range. Recorded as a cross-area note for that lineage, not raised here.
- The fix commit for this area is `d0f605b42f8`, not the range end `d21dbc1cafe`. The confirming round's diff range still contains it, and the empty diff to the range end proves nothing regressed after it. Recorded so the synthesis does not claim the fix landed at the range tip.
- The coverage graph stayed unavailable for all three iterations, so the stop reason is `maxIterationsReached`, not `converged`, even though the last two ratios are 0.0. Recorded rather than relabelled.

## Confirmed-Clean Surfaces

- **The fix state is what was reviewed.** Every scope path's last touching commit is inside the range, and the range end changes none of them.
- **The two active advisories are stable.** Neither the replay nor the provenance check found a later edit that fixed or worsened them.
- **No new defect in the third pass.** The replay covered the two doc surfaces and the provenance of all five files; nothing else in the area is unread.
- **The registry and the narrative agree.** Two open P2, zero P1, zero P0, zero resolved, zero search debt.

## Ruled Out

- **The advisories were fixed after iteration 1.** The replay shows both lines unchanged. Ruled out.
- **A later commit in the range rewrote the reviewed content.** The last touching commit is `d0f605b42f8` and the diff to `d21dbc1cafe` is empty. Ruled out.
- **The round should claim convergence.** The coverage graph is unavailable, so no graph-backed convergence decision exists; the legal stop is `maxIterationsReached`. Ruled out.
- **The `003-` display label in the playbook index is a broken link.** The href resolves to the real file; only the label is stale, and the file belongs to another area. Ruled out here.
- **A P2 should be raised to fill the third pass.** Both surviving advisories are already recorded and no new evidence supports a third. Ruled out.

## Next Focus

- Dimension: none; D1-D4 are covered and the run is at `maxIterations=3`.
- Focus area: synthesis and the closeout record, not another dispatch.
- Reason: the final iteration found no new finding; the active set is two P2 advisories, so the verdict is PASS with `hasAdvisories: true` and the legal stop reason is `maxIterationsReached`.
- Rotation status: all four dimensions covered across three iterations.
- Required evidence: the two finding rows, the three iteration files, the three deltas and the reducer's registry.
- Recovery note: the synthesis must not claim convergence and must carry the fix-provenance note forward.

Review verdict: PASS
