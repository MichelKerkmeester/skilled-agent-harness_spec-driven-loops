# Iteration 6 — security — blast-radius

**Verdict:** FAIL

Dispatched gpt-5.5-fast (high) for an adversarial SECURITY-dimension review of the flag-flip blast radius (commit `0060a097b3`): every save now enriches + reconsolidates + quality-auto-fixes by default. The reviewer read the actual source and returned 3 P1 findings tracing each default-on path to its concrete destructive/unbounded side effect.

## Findings

- **[P1] Default-on quality auto-fix can silently truncate saved user content**
  - File: `.opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts` (line 463)
  - Evidence: Lines 463-468: `if (fixedContent.length > DEFAULT_CHAR_BUDGET) { ... fixedContent = lastNewline > 0 ? trimmed.substring(0, lastNewline) : trimmed; fixed.push(\`Trimmed content from ${content.length} to ${fixedContent.length} chars\`); }` — runs by default because `search-flags.ts` lines 164-169 make `SPECKIT_QUALITY_AUTO_FIX` default-on via `isFeatureEnabled`, and `memory-save.ts` lines 513-519 replaces `parsed.content` with `qualityLoopResult.fixedContent` when the loop passes.
  - Recommendation: Do not persist content-changing auto-fixes by default. Require explicit `plannerMode: full-auto` or a dedicated opt-in for trimming/anchor rewrites, and return a proposed diff/advisory instead of rewriting saved content automatically. At minimum, never truncate user content as an auto-fix.

- **[P1] Default-on save-time reconsolidation can deprecate or merge existing memory rows without explicit full-auto intent**
  - File: `.opencode/skills/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` (line 497)
  - Evidence: Line 497: `const allowSaveTimeReconsolidation = plannerMode === 'full-auto' || isSaveReconsolidationEnabled();`; `search-flags.ts` lines 137-143 make `SPECKIT_RECONSOLIDATION_ENABLED` default-on, and `reconsolidation.ts` lines 516-522 show the destructive side effect: `UPDATE memory_index SET importance_tier = 'deprecated' ... WHERE id = @id`. A checkpoint only gates whether this runs, not whether the user explicitly requested a destructive reconsolidation on this save.
  - Recommendation: Make save-time reconsolidation advisory unless `plannerMode: full-auto` or an explicit destructive-reconsolidation flag is present. Keep default saves append/create-only, and surface merge/supersede candidates as proposed actions.

- **[P1] Default-on async enrichment schedules unbounded background work per save**
  - File: `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` (line 2690)
  - Evidence: Lines 2690-2694: `if (shouldRunPostInsertEnrichment(plannerMode) && isPostInsertEnrichmentAsync()) { ... setImmediate(() => { runPostInsertEnrichment(database, backgroundId, backgroundParsed) ... })`; `search-flags.ts` lines 146-160 make enrichment enabled and async by default, while `post-insert.ts` lines 552-557 runs causal links, entity extraction, summary generation, entity linking, and graph lifecycle for each save. There is no visible queue, concurrency cap, or backpressure in this path.
  - Recommendation: Route post-insert enrichment through a bounded job queue with configurable concurrency and retry/backoff. Keep the pending-marker replay behavior, but prevent unlimited `setImmediate` work from piling up under bulk saves or repeated `memory_save` calls.
