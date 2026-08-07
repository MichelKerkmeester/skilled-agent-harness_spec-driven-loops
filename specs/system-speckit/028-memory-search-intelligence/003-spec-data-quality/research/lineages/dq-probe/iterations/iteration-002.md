# Iteration 2: Ranking out-of-the-box automated features to perfect data quality across the full surface

## Focus

Turn iteration 1's coverage gap into a ranked set of out-of-the-box automated features (on-write gates + retroactive sweeps) that maximize data quality for retrieval (R), AI adherence (A) and logic reading (L) across the full surface, classified by truncation-floor relationship and biased to reuse-first. Cover the context-engineering layer (assembly / injection / prompts / memory) explicitly, which iteration 1 only reached via the post-save review.

## Actions Taken

1. Inspected the context-engineering/memory ops surface: `/memory:manage` subcommands and their MCP tool bindings.
2. Confirmed routing-metadata validators exist (`advisor_validate`, `skill_graph_validate`) in the skill-advisor surface.
3. Confirmed the truncation floor lives in compiled `confidence-truncation.js` (the parent's law), anchoring the floor-relationship classification.
4. Cross-read the parent tiering doctrine (GO-on-cost = write-time/floor-bypassing) to extend it to the net-new surface.

## Findings

### F7: The context-engineering/memory layer already has retroactive HYGIENE ops, but none refine source-doc data quality

`/memory:manage` ships scan, cleanup, retention-sweep, bulk-delete, tier, triggers, validate, health, checkpoint, ingest [SOURCE: file:.opencode/commands/memory/manage.md:2-3,26-53]. These are index/DB hygiene and human-feedback ops (`validate <id> useful|not` is operator feedback, not automated scoring). None reads back into the source documents to improve their data quality. The retroactive machinery exists for the DB, not for the docs that feed it.

### F8: Routing-metadata validators exist but are orthogonal to doc DQI

The skill-advisor surface ships `advisor_validate` (routing baselines) and `skill_graph_validate` (graph integrity) [SOURCE: file:.opencode/skills/system-skill-advisor/SKILL.md:289-345]. These validate routing scores and edge integrity, not the data quality of the skill DOCUMENTS. So a SKILL.md can route well yet be a poor-DQI, low-adherence document and nothing flags it. Do not duplicate these; they cover a different axis.

### F9: The injection layer is a pure consumer with no quality feedback loop to the docs

Context assembly/injection (the skill-advisor hook brief, `memory_context`, the deep-loop prompt-pack render) consumes docs and is subject to the 3-result truncation floor (`confidence-truncation.js`, parent law) [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/confidence-truncation.js]. Nothing feeds "what got truncated" or "which trigger_phrases never matched" back as an automated doc-refinement signal. This is the single genuinely missing context-engineering automation, and per the parent law it is a RETRIEVAL-class loop, so it PAYS the floor tax and inherits the prod-mode proof gate.

### Ranked feature set (extends the parent doctrine to the full surface)

Reader tags: R retrieval, A adherence, L logic. Floor: bypass = write-time/metadata/logic (cheap, ships on cost); pays = retrieval-class (needs prod-mode completeRecall@3 proof).

**Tier GO-on-cost (write-time + retroactive, floor-bypassing, reuse-first) — ship on cost and structural soundness:**

| # | Feature | Reader | Timing | Floor | Reuse basis |
|---|---------|--------|--------|-------|-------------|
| 1 | Wire the existing sk-doc DQI scorer (`extract_structure.py`, deterministic 0-100, type-aware, per-type gates) into (a) an on-write pre-commit gate for `SKILL.md`/references/command docs and (b) a retroactive corpus sweep reporting a band distribution. Highest ROI: the scorer and gates already exist; the work is wiring. | A, L, R-via-frontmatter | on-write + retroactive | bypass | DQI scorer + per-type gates already shipped (validation.md:177-310) |
| 2 | Extend the post-save-review trigger_phrase/importance_tier/contextType quality check from spec-folder-only to the skill/reference/command surface. | R, A | on-write + backfill | bypass | post-save-review.ts logic exists; just widen the scope |
| 3 | A retroactive DQI sweep command that scores the whole skill/command corpus and lists worst offenders, modeled on the `/memory:manage` scan/report shape. | governance, A, L | retroactive | bypass | DQI + manage's scan/report pattern |
| 4 | EARS + three-tier (always/ask-first/never) constraint linter extended to skill RULES sections and command docs (the parent proposed it for spec templates; the skill RULES are the actual adherence instructions, the largest adherence surface). | A, L | on-write + retroactive linter | bypass | parent's proposed EARS linter; new target surface |
| 5 | Extend the wikilink/anchor integrity validators (`check-links.sh`, `check-spec-doc-integrity.sh`, LINKS_VALID) to the skill `[[name]]` reference graph so dangling cross-doc logic links are caught corpus-wide. | L | on-write + retroactive | bypass | check-links.sh / spec-doc-integrity already exist |

**Tier CONDITIONAL (touches retrieval, gated on a re-index + prod-mode completeRecall@3 proof) — build default-off:**

| # | Feature | Reader | Floor | Note |
|---|---------|--------|-------|------|
| 6 | Close the inject->refine loop: feed truncation/injection telemetry (what fell below the 3-floor, which trigger_phrases never matched any query) back as automated doc-refinement suggestions. The novel context-engineering automation. | R | pays | Inherits the parent's exact unblock condition: only a prod-mode completeRecall@3 read can promote it. |
| 7 | LLM-as-judge over skill-doc adherence clarity (does the RULES section actually steer an agent?). | A, R-marginal | bypass-but-costly | Same caveat as the parent's LLM-judge: governance value, marginal lift, prove value before paying an LLM pass per doc. |

**Tier NO-GO (already shipped on a different axis, or premature):**

| Feature | Why |
|---------|-----|
| `/memory:manage` retention/cleanup as a "data quality" lever | Index/DB hygiene, not source-doc quality; already shipped (F7). |
| `advisor_validate` / `skill_graph_validate` reused as doc DQI | Routing/graph integrity, orthogonal to document quality; already shipped (F8). |
| A new parallel quality index/DB/lane | Parent's "no new lane" rule: enrich existing machinery (DQI, post-save-review, check-links), do not duplicate. |

## Questions Answered

- Q2 (ANSWERED): The doc-refinement and context-engineering automations that maximize adherence/logic are write-time, floor-bypassing, and already half-built (DQI scorer, post-save-review, EARS linter, link validators) — features 1-5. The one automation that maximizes RETRIEVAL is the inject->refine telemetry loop (feature 6), which PAYS the floor and inherits the prod-mode proof gate. The injection layer is currently a pure consumer with no feedback to source docs (F9).
- Q3 (ANSWERED): Highest-ROI out-of-the-box set = features 1-5 (Tier GO-on-cost). Rank 1 (wire the existing DQI scorer on-write + retroactively) is the single highest-ROI move because the lever is fully built and structurally blind only by lack of wiring. Features 6-7 are conditional and must not be promoted on external/eval-mode evidence.

## Dead Ends

- Treating `/memory:manage` or `advisor_validate` as the doc-quality automation: ruled out. Both operate on the index/routing axis, not the source-document data-quality axis (F7, F8).

## Assessment

- newInfoRatio: 0.55
- Novelty justification: The ranked feature set and the inject->refine loop (F9) are new, but they build on iteration 1's gap and re-apply the parent's settled floor doctrine rather than discovering a new law, so novelty is moderate not high.
- Confidence: High on F7/F8 (file:line confirmed) and on the reuse-first basis of features 1-5; the conditional tier (6-7) is explicitly hypothesis-until-prod-measured, inheriting the parent's caveat.

## Reflection

What worked: extending the parent's GO-on-cost / floor-bypass doctrine onto the net-new surface produced an immediately actionable ranking. What is ruled out: the index-hygiene and routing-validator surfaces are not the quality lever. Convergence: two iterations answered all three key questions; the maxIterations=2 cap is reached, so the loop stops at maxIterationsReached with the floor-relationship and reuse-first guards satisfied.

## Recommended Next Focus

(Cap reached.) If extended: count the actual skill/reference/command-doc census to harden F5's magnitude claim, and prototype feature 1 as a default-off warn-only retroactive DQI report to measure the real band distribution before any on-write gate is promoted to blocking.
