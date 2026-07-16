# Deep-Research Charter — skill-advisor scorer, parent-hub compatibility

**HARD READ-ONLY.** Proposals and reports only. NEVER edit, write, or commit the advisor TS or Python under `mcp_server` — it is a live gated lane with another agent's staged changes. Write only to the research artifacts under this spec folder.

**Scope:** `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer` and how it projects into and stays consistent with the parent hubs `sk-code`, `sk-design`, `deep-loop-workflows`.

**Priority:** parent-hub compatibility is the operator's top priority — weight the loop toward angles 1–5.

## Ranked research angles
1. **Layer-1b is half-landed** — `deep-loop-workflows/graph-metadata.json` still projects `code audit` and `severity weighted findings` (terms slated to move to sk-code). Design the safe deletion + coordinated reindex, and quantify which hardcoded fusion penalties (e.g. `codeAuditDeepReviewPenalty`) become removable once metadata is corrected.
2. **Two competing vocabulary authorities** — `TOKEN_BOOSTS`/`PHRASE_BOOSTS` in `lanes/explicit.ts` vs projected `graph-metadata` that double-count before the clamp. Produce a migration contract for which vocab belongs in metadata (reindex-refreshable) vs frozen code.
3. **No cross-hub collision guard** — `parent-hub-vocab-sync.cjs` checks one hub internally only. Design a cross-hub collision report mapping shared normalized phrases to their owning hub by intent class.
4. **The guard never validates the advisor projection surface** — it checks `trigger_phrases` only, not `intent_signals` or `derived.key_topics`. Close the "typed-but-unprojected" gap so every registry mode's aliases have advisor-projected representation (or an explicit exemption).
5. **Hub-vs-mode routing quality on ambiguous cross-hub prompts** — build a labeled cross-hub ambiguity set (single-pass audit vs review-loop; design-audit vs code-audit; deep-loop-runtime vs deep-loop-workflows), measure top-1 + margin, feed survivors into 007's frozen ambiguity slice (weakest measured at 0.60).
6. **Reindex → re-baseline → ratchet-recapture runbook** as one atomic operation, given native-ABI/SIGBUS fragility and the eval ratchet's fixture pins.
7. **Whether to author `conflicts_with` edges** into the live skill graph — 003 proved the seam works but it is inert (zero live conflict edges). Define authoring criteria, weights, and the measurement gate.
8. **Command-bridge hardcoding** in `projection.ts` (`COMMAND_BRIDGES`, 6 hardcoded) — derive bridges from command metadata the way WS2 derived executor aliases (`buildExecutorAliasTable` is the in-repo precedent).
9. **Three overlapping intent taxonomies** — query-class (`classifyAdvisorQuery`), hub-router intent classes, and 007's buckets — exist with no cross-mapping. Should they be derived from or validated against each other?
10. **semantic_shadow abstain-misfires** point at description-embedding hygiene — 008's "hurt" flips are gold-`none` abstains false-firing to `mcp-chrome-devtools`. Research embedding hygiene for mcp-* near-neighbor attractors as the cheaper alternative to lane-weight work.

## Watch-outs
- Do not re-litigate the **known-falsified WS1** (post-cap demotion) — it was empirically reverted.
- Respect verified-vs-aspirational status: WS2/WS4/WS5 are committed; 003's GRADUATE (RRF still default-off) and CUT verdicts are unexecuted; Layer-1b vocab is half-landed; the coordinated reindex is pending.
- Read-only: never mutate `mcp_server`. Findings/proposals only.
