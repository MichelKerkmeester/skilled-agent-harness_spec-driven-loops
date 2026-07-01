# Iteration 034 — NEW: Round-2 Net-New Findings Beyond Round 1 (Delta Inventory)

**Focus:** Catalog findings that are GENUINELY NEW in round 2 (not re-verifications of round 1).
**Angle:** Delta isolation — what did the forced depth surface that round 1 missed?

## Findings

**Net-new findings discovered ONLY in round 2** (beyond re-verifying round-1 baseline):

1. **009 phase exists** (iter 019,020) — entirely new since round 1; 10-child plan, only 3 exist, execution stalled after 001.
2. **Salvage naming ROOT CAUSE** (iter 012) — round 1 found the symptom (duplicate files); round 2 traced it to `fanout-salvage.cjs:112` unpadded template literal + one-line fix.
3. **fanout-merge silent-drop FIXED** (iter 010) — round 1 found the bug; round 2 confirmed 009/001 shipped a real fix with `normalizeRegistrySchema` + `reconstructReviewRegistryFromState`.
4. **Research-reconstruct asymmetry** (iter 029) — review got a reconstruct function, research didn't; residual gap explicitly admitted in registry mitigation note.
5. **fanout-pool.cjs silent-return class** (iter 013) — same defect class as the merge bug, latent in pool guards.
6. **loop-lock no proactive sweeper** (iter 014,033) — round 1 said "no TTL sweeper"; round 2 specified WHY (contention-only reclaim) and designed the sweep command.
7. **stopPolicy reachability map + discoverability gap** (iter 015) — round 1 noted it's internal; round 2 mapped every touchpoint and diagnosed low operator-discoverability.
8. **deep-review anti-convergence is mode-conditional** (iter 016) — round 1 didn't check review; round 2 found the override is max-iterations-gated, not unconditional.
9. **3-root-cause taxonomy** (iter 028) — round 1 listed symptoms; round 2 clustered into missing-steps / generator-bugs / human-omission.
10. **description.json truncation = generator slice bug** (iter 027) — framework-level, affects all packets.
11. **4-reducer fragmentation** (iter 026) — explains crossmode drift.
12. **codex registry rebuilt 0→5** (iter 021) — state moved since round 1.
13. **Registry disposition is SYSTEMIC** (iter 025) — round 1 checked 2 lineages; round 2 proved it's a missing-workflow-step, not data corruption.

**Assessment:** the forced depth (35 vs 18) yielded 13 net-new findings + 5 root-cause/design deepening. The round-1 early-convergence DID leave real signal on the table — validating the operator's >=30-iteration floor.

## Evidence
[SOURCE: iter 010,012,013,014,015,016,019,020,021,025,026,027,028,029 — each cited above]

## newInfoRatio: 1.0 (pure delta inventory; the value-add of round 2)
