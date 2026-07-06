# Iteration 5: Adversarial Verification — Is `fuseResultsMulti` Generically Reusable by Code Graph? (PARTIAL)

## Focus
Round A (broadening) adversarial verification of the roadmap **[INFERRED]** claim that Memory's `fuseResultsMulti` (with a `{bonusOverChannels}` option) can be PROMOTED to Code Graph to fuse CALLS-channel + IMPORTS-channel impact results. Read the real signature + code-graph impact result shapes. Read-only.

## Actions Taken
1. Read `fuseResultsMulti` signature + `RrfItem`/`RankedList`/`FuseMultiOptions` types in `rrf-fusion.ts` (`:63-66`, `:83-100`, `:272-275`, `:302`, `:310-311`, `:319`, `:350`, `:356-388`).
2. Read code-graph impact result shapes in `code-graph-context.ts` (`:343-372` formatContextEdge, `:638-663` impact nodes/edges).
3. Compared the field contracts + the fusion mechanic.

## Findings (file:line)

**Signature carries ZERO Memory coupling — [CONFIRMED].**
`RrfItem` requires only `id: number|string` plus an open `[key:string]: unknown` index [SOURCE: rrf-fusion.ts:63-66]; `RankedList { source; results: RrfItem[]; weight? }` [SOURCE: :83-87]. The fuser only touches an item via `canonicalRrfId(item.id)` (`:311`) and `...item` spread (`:319`) — never a content/text/embedding field. Promotion is structurally viable: the only field a code-graph impact item must supply is `id`, which a reached symbol already has identity for (fqName / sourceId / symbolId at code-graph-context.ts:647,656,638). [CONFIRMED]

**But NOT a drop-in — [PARTIAL].**
(1) Code-graph emitted shapes (`nodes{name,kind,file,line}` `:366`, `edges{from,to,type,confidence,...}` `:367-372`) have NO `id` field → must synthesize one. (2) The fuser fuses by RANK position (`1/(k+i+1)` `:310`), DISCARDING each item's own confidence/weight (`edge.metadata?.confidence ?? edge.weight`, `:350`) → Code Graph must pre-sort each channel into ranked order or lose magnitude. (3) The GRAPH source-weight boost is keyed on `list.source === SOURCE_TYPES.GRAPH` (`:302`) → dual graph channels need deliberate source labeling. [PARTIAL]

**The `{bonusOverChannels}` option does NOT exist — [naming REFUTED].**
`FuseMultiOptions` has `k | convergenceBonus | graphWeightBoost | calibratedOverlapBeta` (`:90-100`) — the roadmap's named `{bonusOverChannels}` is NOT a real option (closest mechanic: `convergenceBonus` flat bonus `:383` / calibrated overlap `:356-380`). This affects the roadmap's C-X1 (Memory) AND the fuseResultsMulti-reuse naming: **C-X1 must AUTHOR `{bonusOverChannels}`, not assume it exists.**

**Roadmap impact:** "fuseResultsMulti is generically reusable by Code Graph (Q8)" → **PARTIAL** (promotable signature; needs an adapter: synthesize id + pre-rank channels + label graph sources). The `{bonusOverChannels}` option referenced across the roadmap is **not-yet-existing** — a naming correction cross-linking 001's C-X1.

## Questions Answered
- Is fuseResultsMulti generically reusable by Code Graph? **PARTIAL** — Memory-agnostic signature (CONFIRMED) but reuse needs a thin adapter (id synthesis + per-channel pre-ranking + graph-source labeling); the fuser ignores per-item scores.
- Does `{bonusOverChannels}` exist? **NO** — must be authored (affects C-X1).

## Questions Remaining
- (new) Should the fuser gain an optional score-aware ingest (use `item.score` for initial rank) so confidence-bearing channels (code-graph impact) don't lose magnitude to pure rank fusion?
- (new) Does `convergenceBonus`/calibrated-overlap (rewarding CALLS∩IMPORTS overlap) match desired impact-ranking semantics, or is overlap-reward wrong for impact?

## Next Focus
fuseResultsMulti promotion is viable-with-adapter (not drop-in) — feeds Round C feasibility (the adapter + score-aware-ingest question) and cross-links 001's C-X1 (`{bonusOverChannels}` must be built).
