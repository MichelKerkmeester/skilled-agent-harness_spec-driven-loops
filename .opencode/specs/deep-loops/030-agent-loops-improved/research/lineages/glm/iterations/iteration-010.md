# Iteration 010 — Re-verify RESOLVED: fanout-merge Silent-Drop Bug (Round-1 F, now FIXED)

**Focus:** Did 009/001-fanout-merge-schema-tolerance actually fix the silent-drop bug in LIVE code?
**Angle:** Spec-vs-code cross-check: read the actual fanout-merge.cjs merge functions + 009/001 implementation-summary claims.

## Findings

**FIXED — confirmed in live code.** The `normalizeRegistrySchema` helper is present and wired into BOTH merge paths:

- `mergeReviewRegistries` (fanout-merge.cjs:633-641): calls `normalizeRegistrySchema(rawRegistry, { canonicalKey: 'openFindings', aliases: { findings: 'openFindings' }, lineage: label })`, pushes warnings to `schemaWarnings` AND writes each warning to stderr.
- `mergeResearchRegistries`: parallel fix using `keyFindings` canonical key.
- The merged return value attaches `schema_mismatch` when warnings exist (line 614/706).

A `reconstructReviewRegistryFromState` function (line 762) was also added, addressing the leaf-only-lineage drop (GLM review P1-011): it reconstructs a registry from JSONL `findingDetails` when no registry file exists.

**009/001 implementation-summary claims:** 33/33 targeted tests pass; real-data re-run emits the `schema_mismatch` warning and the merged registry now shows 26 keyFindings (was silently 8). (Not re-run this round — test execution deferred as heavy; claim taken at face value with the code-level confirmation as the load-bearing evidence.)

**Verdict: Round-1 critical-ish finding RESOLVED.** This is the ONE round-1 tooling bug that has been genuinely fixed. The fix is well-scoped and verified at the code level.

**Caveat (Known Limitation from impl-summary:77):** the fix tolerates ONLY the specific `findings` alias. A future registry under a third schema shape would still be silently skipped (with a warning). This is a targeted fix, not a general schema-validation framework.

## Evidence
[SOURCE: fanout-merge.cjs:627-654 — normalizeRegistrySchema in mergeReviewRegistries]
[SOURCE: fanout-merge.cjs:762-779 — reconstructReviewRegistryFromState]
[SOURCE: 009/.../001-fanout-merge-schema-tolerance/implementation-summary.md:48-71]

## newInfoRatio: 0.5 (resolution confirmed; known-limitation caveat is the net-new detail)
