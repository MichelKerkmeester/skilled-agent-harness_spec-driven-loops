# Research Synthesis: Automated Data Quality Across the Full Spec-Kit Knowledge Surface (dq-probe lineage)

<!-- ANCHOR:dq-probe-index -->
Fan-out lineage `dq-probe` under packet 005-spec-data-quality. The parent `research/research.md` converged on the **truncation law** over a narrow surface (spec docs + the two metadata JSONs + retrieval code). This lineage extends the same doctrine to the **entire spec-kit knowledge surface** (skill docs + references + assets, command docs, and the context-engineering layer) and asks which out-of-the-box automated on-write and retroactive features perfect data quality there. The unit of this lineage is a verdict, not a build.

## 1. Executive Verdict

The full-surface finding is that the spec-kit quality machinery is **bifurcated and surface-incomplete**, and the cheapest, highest-ROI win is already fully built and merely unwired.

Three automation regimes exist today, and they do not overlap on the doc-quality axis:
1. **Spec docs** get a deep 33-rule gate (`validate.sh`, every rule spec-folder-scoped at `validator-registry.json:1-313`), but it is a manual completion-time gate, not an on-write one.
2. **Code / MCP / prompt-registry** surfaces get blocking on-write commit gates (5 gates in `.git/hooks/pre-commit`: doc-model-refs, comment-hygiene, prompt-card-sync, MCP mutation-class, tool-ownership).
3. **Skill docs, references, command docs, and context-engineering assets** get NOTHING on the data-quality axis. No on-write gate, no retroactive sweep, no DQI enforcement.

That third gap matters because of the parent's truncation law. The signals carried by skill/reference/command docs (`trigger_phrases`, `importance_tier`, `contextType`, and the RULES adherence instructions) are write-time, adherence, and logic signals that BYPASS the 3-result prod floor. By the parent's own doctrine, floor-bypassing write-time gates are the cheapest real wins. The biggest such surface is the one with no gate at all.

The decisive consequence: a deterministic, type-aware Document Quality Index scorer (`extract_structure.py`, 0-100, per-type gates) already exists in sk-doc (`validation.md:177-310`) and is never automated. The single highest-ROI feature in this entire program is wiring that existing scorer into an on-write gate plus a retroactive corpus sweep. The lever is fully built and blind only by lack of wiring.

## 2. The Ranked Feature Set

Reader tags: R retrieval, A adherence, L logic. Floor: **bypass** = write-time/metadata/logic (ships on cost), **pays** = retrieval-class (needs a prod-mode completeRecall@3 proof, inheriting the parent's exact unblock condition).

### Tier GO-on-cost (write-time + retroactive, floor-bypassing, reuse-first)

| # | Feature | Reader | Timing | Floor | Reuse basis |
|---|---------|--------|--------|-------|-------------|
| 1 | Wire the existing sk-doc DQI scorer into (a) an on-write pre-commit gate for `SKILL.md`/references/command docs and (b) a retroactive corpus sweep reporting a band distribution. **Highest ROI.** | A, L, R-via-frontmatter | on-write + retroactive | bypass | DQI scorer + per-type gates already shipped (`validation.md:177-310`) |
| 2 | Extend the post-save-review trigger_phrase/importance_tier/contextType quality check from spec-folder-only to the skill/reference/command surface. | R, A | on-write + backfill | bypass | `core/post-save-review.ts` logic exists; widen scope |
| 3 | A retroactive DQI sweep command (band distribution + worst offenders), modeled on the `/memory:manage` scan/report shape. | governance, A, L | retroactive | bypass | DQI + manage's scan/report pattern |
| 4 | EARS + three-tier (always/ask-first/never) constraint linter extended to skill RULES sections and command docs (skill RULES are the actual adherence instructions, the largest adherence surface). | A, L | on-write + retroactive | bypass | parent's proposed EARS linter; new target surface |
| 5 | Extend the wikilink/anchor integrity validators (`check-links.sh`, `check-spec-doc-integrity.sh`, LINKS_VALID) to the skill `[[name]]` reference graph. | L | on-write + retroactive | bypass | link validators already exist |

These ship on cost and structural soundness, not on a proven retrieval lift. Each reuses shipped machinery; the work is wiring and scope-widening, not invention. Rank 1 ships first.

### Tier CONDITIONAL (touches retrieval, gated on a re-index + prod-mode completeRecall@3 proof, build default-off)

| # | Feature | Reader | Floor | Note |
|---|---------|--------|-------|------|
| 6 | Close the inject->refine loop: feed truncation/injection telemetry (what fell below the 3-floor, which trigger_phrases never matched) back as automated doc-refinement suggestions. The genuinely novel context-engineering automation. | R | pays | Inherits the parent's exact unblock condition: only a prod-mode completeRecall@3 read can promote it. |
| 7 | LLM-as-judge over skill-doc adherence clarity (does the RULES section actually steer an agent?). | A, R-marginal | bypass-but-costly | Same caveat as the parent's LLM-judge: governance value, marginal lift, prove value before paying an LLM pass per doc. |

### Tier NO-GO (already shipped on a different axis, or premature)

| Feature | Why |
|---------|-----|
| `/memory:manage` retention/cleanup as a "data quality" lever | Index/DB hygiene, not source-doc quality; already shipped. |
| `advisor_validate` / `skill_graph_validate` reused as doc DQI | Routing/graph integrity, orthogonal to document quality; already shipped. |
| A new parallel quality index/DB/lane | Parent's "no new lane" rule: enrich the existing DQI / post-save-review / link validators, do not duplicate. |

## 3. Cross-Cutting Findings

**The bifurcation is the spine.** The most mature quality gate in the repo (`validate.sh`, 33 rules) is structurally blind to the largest doc surface. The on-write enforcement that DOES exist (commit hook) is for code/tool integrity, not document data quality. The two never meet on the skill/command surface.

**Reuse first (again).** As in the parent packet, every recommended feature maps to an enrichment of shipped machinery: the DQI scorer, the post-save-review trigger_phrase check, the EARS linter design, the link/anchor validators. The work is wiring, not green-field building. Feature 1 is the extreme case: a fully-built deterministic scorer with per-type gates that simply was never wired into a hook or a sweep.

**The floor doctrine carries cleanly.** The parent's law (write-time/adherence/logic bypass the 3-result floor; retrieval pays it and needs prod-mode proof) classifies this surface without modification. Features 1-5 bypass and ship on cost; feature 6 pays and stays a hypothesis until the same prod-mode completeRecall@3 read the parent demands.

**The one missing loop.** The context-engineering injection layer (skill-advisor hook brief, `memory_context`, prompt-pack render) is a pure consumer subject to the floor. Nothing feeds truncation/match telemetry back to refine the source docs. That feedback loop (feature 6) is the only net-new retrieval-class automation this surface offers, and it is exactly the kind the parent law warns must not be promoted on eval-mode evidence.

## 4. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| "A corpus-wide retroactive doc-quality sweep already exists" | The batch examples are illustrative shell snippets; no shipped runner wires DQI across the surface | `sk-doc/references/global/validation.md:506-522` | 1 |
| Treat `/memory:manage` (retention/cleanup/scan) as the doc-quality automation | Operates on the index/DB hygiene axis (and operator useful/not feedback), not source-document data quality | `commands/memory/manage.md:2-53` | 2 |
| Treat `advisor_validate` / `skill_graph_validate` as doc DQI | Validate routing baselines and graph edge integrity, orthogonal to document quality; a SKILL.md can route well yet be a poor-DQI doc | `system-skill-advisor/SKILL.md:289-345` | 2 |
| Build a new parallel quality index / DB / lane | Duplicates shipped machinery; violates the parent's "no new lane, enrich the existing record" rule | parent `research/research.md` Tier NO-GO | 2 |
| Promote the inject->refine loop (feature 6) on external/eval-mode evidence | It is a retrieval-class automation that PAYS the 3-result floor; only a prod-mode completeRecall@3 read can promote it | parent truncation law; `confidence-truncation.js` | 2 |

## 5. Prove-First Caveats

This is a research deliverable, not a build. Nothing here is shipped.

**Confirmed by file:line.** The bifurcation (33 spec-scoped rules; 5 code/tool commit gates; zero skill/command doc-quality gates), the existence and never-automated status of the DQI scorer, the retroactive-hygiene-not-doc-quality nature of `/memory:manage`, and the routing-not-DQI nature of `advisor_validate` are all confirmed against current files.

**Asserted, not counted.** The "largest surface" magnitude claim (F5) is asserted from sampled reference headers, not a counted census of skill/reference/command docs. Harden it before sizing the work.

**Hypothesis-until-prod-measured.** Tier CONDITIONAL (features 6-7) inherits the parent's discipline: a release reviewer must read the prod-mode completeRecall@3 column, not the eval-mode column, before promoting any retrieval-class automation. Tier GO-on-cost (features 1-5) ships on cost and structural soundness, but feature 1 should land as a default-off warn-only retroactive DQI report first, to measure the real band distribution before any on-write gate is promoted to blocking.

## 6. Convergence Report

- Stop reason: maxIterationsReached (cap=2)
- Total iterations: 2 (newInfoRatio 0.85 -> 0.55)
- Questions answered: 3/3
- Quality guards: source diversity pass (file:line on 7 of 8 findings), focus alignment pass, no single-weak-source pass
- Note: maxIterations=2 capped the statistical composite-convergence math (which needs 3-4 evidence iterations); the stop is the iteration cap, not a rolling-average convergence.

## References

- Parent synthesis: `.../005-spec-data-quality/research/research.md` (the truncation law and parent tiering)
- `.opencode/skills/system-spec-kit/scripts/lib/validator-registry.json`
- `.git/hooks/pre-commit`
- `.opencode/skills/sk-doc/references/global/validation.md`
- `.opencode/skills/system-spec-kit/scripts/core/post-save-review.ts`
- `.opencode/commands/memory/manage.md`
- `.opencode/skills/system-skill-advisor/SKILL.md`
- `.opencode/skills/system-spec-kit/mcp_server/dist/lib/search/confidence-truncation.js`

(`resource-map.md` not present at init; no coverage gate cited.)
<!-- /ANCHOR:dq-probe-index -->
