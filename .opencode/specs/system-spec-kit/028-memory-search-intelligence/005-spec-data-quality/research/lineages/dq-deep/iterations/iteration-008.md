# Iteration 008 - KQ8: The best-possible automated DQ program, floor-aware ROI tiering

**Focus:** Assemble the automation findings into one program, tiered by truncation-law-aware ROI.
**newInfoRatio:** 0.34
**Novelty:** Confirms the auto-fix already re-extracts body triggers + trims budget (primitives exist), then consolidates KQ1-7 into a four-tier reuse-first program; mostly synthesis, low net-new.
**Status:** complete

## What I examined
- `quality-loop.ts` scorers + auto-fix (`scoreTriggerPhrases:103`, `scoreAnchorFormat:137`, `scoreTokenBudget:235`, `scoreCoherence:274`, `attemptAutoFix:434`, `extractTriggersFromContent:450`) [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/quality-loop.ts:103-465]

## Finding: the primitives already exist
`attemptAutoFix` (`:434`) already (a) re-extracts trigger phrases from content via `extractTriggersFromContent` (`:450-453`) and (b) trims content to budget (`:461-465`). `scoreTriggerPhrases` enforces a 4+ floor (`:113`). So body-derived trigger extraction — which iter 4 called missing — exists on the memory-save path. The program is therefore overwhelmingly **wire existing primitives to the surface that lacks them**, not greenfield.

## THE PROGRAM (floor-aware)

### Tier A - On-write, floor-bypassing, reuse existing machinery (ship on cost)
- **A1 (keystone).** Extend the live default-ON quality loop (`quality-loop.ts`) to run on the **authored spec-doc + metadata-JSON write surface** (generate-context.js / validate.sh), not only memory-save. It already scores triggers/anchors/budget/coherence and auto-fixes — exactly the spec-doc dims. Highest leverage in the whole program. [reuse]
- **A2.** Propagate curated frontmatter `trigger_phrases` -> `description.json`; derive a real `description` (extractive summary, reuse `extractTriggersFromContent`) instead of copying the title. [iter 3 F1]
- **A3.** Enum-constrain `importance_tier`/`status`/`content_type` in both zod schemas, borrowing the command `mutation_class` enum discipline. [iter 3 F2 + iter 6 F3]
- **A4.** Promote `DESCRIPTION_SHAPE`/`GRAPH_METADATA_SHAPE` warn->error with the real zod schemas (parent's measured unconditional GO). Pairs with A3. [iter 1 F1]
- **A5.** Cross-surface `trigger_phrases` consistency assertion (frontmatter == description.json == graph-metadata.derived). Retires the `migrate-trigger-phrase-residual.ts` band-aid. [iter 3 F3]
- **A6.** HVR/style auto-fix linter (em-dash, prose semicolon, Oxford comma) — the unenforced P1 requirement, deterministic fix rung. [iter 4 F2]
- **A7.** EARS + always/ask-first/never constraint-tier soft linter + REQ_COVERAGE gate reusing the AC_COVERAGE pattern. [parent GO-on-cost; iter 1 F2]
- **A8.** Surface already-computed provenance/source_kind/document-weight (`pe-gating.ts` / `write-provenance.ts`) + content_type + temporal/freshness into the JSONs; freshness-bind `causal_summary` to `source_docs`. [iter 3 F4 + iter 7 F2]

### Tier B - Retroactive, continuous (the genuinely missing layer = "most automated")
- **B1 (keystone).** A standing **scheduled DQ sweep** (cron/post-merge hook) running the Tier-A detectors corpus-wide, with a guarded auto-fix tier: safe mechanical fixes apply, risky findings report. Fills the no-scheduled-invocation gap. [iter 2 F3]
- **B2.** Add a **guarded auto-remediation tier** to `/doctor` (today detect-only): safe fixes (regenerate malformed graph-metadata.json, normalize frontmatter) auto-apply; risky report-only. [iter 2 F4]
- **B3.** **Retrieval-learning feedback edge:** turn low-retrieval / never-retrieved signals (`learned-feedback.ts`) into queued content-quality refinement actions on the doc. [iter 7 F3]

### Tier C - Retrieval class, gated on re-index + prod-mode completeRecall@3 proof
- **C1.** Header-path + curated-signal **chunk prefix** (re-inject frontmatter triggers/title + header path that `content-normalizer.ts` strips), behind a coverage guard + the dual-cache-key fix. Prod-mode @3 gated. [iter 4 F1 + parent CONDITIONAL]
- **C2 (unblocker).** Port the **skill-surface benchmark+regression loop** to the spec corpus, wired to **prod-mode completeRecall@3** (not eval-mode@K). This is the automation that finally lets any Tier-C retrieval candidate be promoted — it closes the parent's standing open question. [iter 5 F5]

### Tier D - NO-GO (inherited + new)
- Inherited: libSQL/sqlite-vec swap, quantization tiers, Ed25519 signing, new rollup node type, LightRAG.
- New: do NOT build a parallel quality system — extend `quality-loop.ts`. A second scorer duplicates a live default-ON one.

## The shape of the answer
- "Perfected" = A1+A2+A3+A5+A6 (every doc carries consistent, enum-valid, summary-bearing, HVR-clean metadata, auto-fixed on write).
- "Most automated" = B1+B2 (a standing sweep with guarded auto-fix; no human trigger).
- The retrieval ceiling stays honestly gated by the truncation law until C2's prod-mode benchmark runs.

## Dead Ends / Ruled Out
- Building a new quality scorer: ruled out — extend the live default-ON `quality-loop.ts`.
- Promoting any Tier-C retrieval item on external recall@K: ruled out (inherited) — the K=3 floor hides that band; needs prod-mode @3.

## Answers
- **KQ8 answered:** see THE PROGRAM. Two keystones: A1 (extend the live quality loop to the authored surface) and B1 (standing scheduled sweep with guarded auto-fix). C2 (prod-mode @3 benchmark) is the unblocker for the entire retrieval tier.

## Next focus
Adversarial/risk pass: net-negative cautions, double-counting, and what could break — gap-close before synthesis.
