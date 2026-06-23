<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Plan: Search-Quality Fixes

<!-- ANCHOR:approach -->
## 1. APPROACH

Land the six fixes in dependency order, smallest blast radius first, keeping each behavioral change reversible. The keystone (Fix 1) and the telemetry fix (Fix 3) share `memory-search.ts` and land together. Each MCP-code change is host-verified with its focused vitest, then the dist is rebuilt and the daemon recycled so the fast-subset re-run exercises the live fixes. The determinism change (Fix 5) ships behind a new default-off flag so default ranking stays byte-identical until a recall benchmark earns the flip.
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:steps -->
## 2. STEPS

1. **Fix 1 + Fix 3** in `memory-search.ts`: add `evidenceGap: pipelineResult.metadata.stage4.evidenceGapDetected` to `extraData`; add a separate `retrievalProfileApplied` status sourced from the hybrid profile-weight gate. Verify the recovery path still behaves on a true gap.
2. **Fix 4** in `search-results.ts`: emit the resolved row score (the existing `rrfScore -> score` fallback) on every rendered row, additive to `similarity`.
3. **Fix 5** behind a new `SPECKIT_DETERMINISTIC_RANKING` flag (default-off): when on, pass `useDecay=false` and a frozen `now` into the ranking path, and add `id` as the final trigger-channel tie-break.
4. **Fix 2** in `extract-metrics.mjs`: replace the binary `citeExpected` with valid-set membership.
5. **Fix 6** in `search_presentation.txt`: the rendered count equals rows shown; render the leaf title.
6. **Verify:** focused vitests, rebuild dist, recycle daemon, fast-subset benchmark re-run, confirm Fix 1 caps gap verdicts and `citeCorrect` reads honest.
<!-- /ANCHOR:steps -->

---

<!-- ANCHOR:verification -->
## 3. VERIFICATION
- Each MCP change passes its focused vitest with no regression to the rest of the suite.
- `validate.sh --strict` on this phase exits 0.
- The fast-subset re-run shows off-corpus and gap queries now returning `weak`/`gap` with the banner and verdict in agreement, and `citeCorrect` back near 1.0.
<!-- /ANCHOR:verification -->
