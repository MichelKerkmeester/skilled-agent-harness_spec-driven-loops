# Iteration 29 (Round M): Does the 027-revisit re-prioritize the 028 roadmap?

## Focus
Identify concrete edits the 005 findings should make to the 028 roadmap. Read-only synthesis.

## Findings (newInfoRatio 0.55)
**FIVE roadmap edits:**
1. **createScanKey mis-citation** (`roadmap.md:33` + §4 shared-infra row `:247`): replace base `memory-index.ts:281` with `computeContentHash` (content) + `hashJson` (canonical-field); only C4-B's hash is net-new. [iter-018/021]
2. **skip-closed gate** (`roadmap.md:53,174`): promote C3-D from optional decision-note to a HARD gating prereq of C3-A. [iter-012]
3. **C8 reclassify** (`roadmap.md:124,255`): strike the refuted ingest-bypass claim. **Reconciled verdict (M2 code-grounded over M9):** C8 is a REAL render-gap (no escaper exists anywhere; getSessionMemories renders content unescaped) → stays BUILD-new always-on render-wrapper, **reusing 027's fail-closed scrubber PATTERN, not its seam** (write-lane ≠ render-boundary). [iter-011/020/022]
4. **bi-temporal scoping** (`roadmap.md:189,249`): consumers = causal+lineage+code_edges; EXCLUDE retention TTL (category error); add the canonical-supersede-writer decision (lineage canonical; active_memory_projection is the real current store). [iter-019/024]
5. **C5-B** (`roadmap.md:29`): confirm net-new; ADD the RRF surface (`rrf-fusion.ts:255`, no tiebreak) to its seam; note it reuses computeContentHash. [iter-014/018/027]

**RE-PRIORITIZATIONS:** the 028 6-item Wave-0 spearhead is NOT re-ordered. New: C3-D skip-closed sequences before C3-A; C5-B argued for re-add to spearhead (net-new both surfaces, S, reuses 027 hasher); C8 down-scoped (no longer a security blocker) → Wave-0-eligible pending the getSessionMemories renderer audit. LEVERAGE H.

## Most-likely-wrong
The C8 reclassification — M9 said "promote", M2 (opened the code) said "real render-gap BUILD-new". Carried M2's verdict; if the getSessionMemories renderer turns out to escape content after all, C8 collapses to already-covered. → Round N audits `memory-triggers.ts:655`.

## Next Focus
These 5 edits land in the 028 roadmap during synthesis (Task #16). Round N audits the C8 render path + writes the ledger.
