# Iteration 013 (wave 2, gpt-5.5-fast xhigh) — Low-confidence path structured signal

**Verdict:** Low confidence triggers prose because the runtime emits low-confidence as prompt-visible markdown and natural-language `safeResponse`, while the exact command envelope remains only a static doc. The mechanical fix is a single structured render policy and server-generated MEMORY:SEARCH envelope where confidence/action/citation limits are fields inside the envelope, not prose outside it.

## [MECHANISM] Evidence gap is injected as prose
- Evidence: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1409 parsed.summary = `${pipelineResult.annotations.evidenceGapWarning}\n\n${parsed.summary}`;
- Detail: The TRM warning is not represented inside the command envelope; it is prepended to the MCP summary before the model renders the command response. Because the warning text itself says to consider first principles, it primes the model to narrate a caveat rather than fill rows.
- Recommendation: Stop prepending `evidenceGapWarning` to `summary`; expose it as structured `quality`/`notice` fields and render it only inside a server-generated `MEMORY:SEARCH` block.

## [MECHANISM] Weak policy is a prose instruction
- Evidence: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:325 safeResponse: 'Retrieval quality is weak. Broaden the query or ask the user for disambiguation before citing any path.',
- Detail: For non-good quality, `deriveResponsePolicy` returns natural-language `safeResponse` plus `citationPolicy=do_not_cite_results`. That conflicts mechanically with the command contract that expects grouped result rows, so the model follows the safety prose instead of the display envelope.
- Recommendation: Replace `safeResponse` with structured render policy: `displayMode: "memory_search_envelope"`, `quality: "weak|gap"`, `resultRole: "candidates_not_citations"`, `footerAction`, and `pathClaimPolicy`; do not provide a sentence to emit.

## [MECHANISM] Evidence-gap boolean is dropped
- Evidence: .opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts:1060 evidenceGap: Boolean(safeExtraData?.evidenceGap),
- Detail: The formatter recovery path keys off `extraData.evidenceGap`, but the handler only passes `evidenceGapWarning` when Stage 4 detects a gap. This splits the signal: the model sees warning prose while response/recovery policy is derived from a separate confidence heuristic.
- Recommendation: Pass `evidenceGap: pipelineResult.metadata.stage4.evidenceGapDetected` plus structured TRM metrics into `formatSearchResults`, and derive `requestQuality`, `recovery`, `citationPolicy`, and presentation from that single source.

## [MECHANISM] Decision envelope hides weak quality
- Evidence: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts:1352 responsePolicy: {
- Detail: The `SearchDecisionEnvelope` is built with a hard-coded live `memory_search_response` policy before the formatter derives the real weak/gap `responsePolicy`. The model and audit trail therefore receive both a generic live decision envelope and a separate top-level weak policy.
- Recommendation: Move policy derivation upstream or expose it as a pure helper, then populate `trustTreeInput.responsePolicy` with the actual `requiredAction`, `citationPolicy`, and `quality` used for rendering.

## [CONSTRAINT] Presentation has no weak-result slot
- Evidence: .opencode/commands/memory/assets/search_presentation.txt:84 - Include trace/provenance only when requested or needed to explain a degraded result.
- Detail: The asset defines normal and empty result templates, but no mandatory weak/gap variant. Its degraded-result exception leaves an escape hatch exactly on the low-confidence path.
- Recommendation: Add a weak/gap envelope shape and have the MCP layer generate it verbatim, e.g. `MEMORY:SEARCH ... quality=gap`, candidate rows, and footer `STATUS=OK RESULTS=N INTENT=x QUALITY=gap ACTION=broaden_or_ask CITATION=candidates_only`.
