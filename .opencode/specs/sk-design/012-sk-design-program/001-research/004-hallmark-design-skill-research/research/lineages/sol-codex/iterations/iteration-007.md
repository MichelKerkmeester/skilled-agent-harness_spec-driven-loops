# Iteration 7: Curated Theme Architecture Versus Extracted Corpus

## Focus

This iteration tested whether Hallmark's twenty-theme catalog, four genre packets, rotation state, three diversification axes, custom-theme signal gate, per-theme packets, and theme-aware motion should become presets, corpus metadata, retrieval facets, or a new sk-design capability. The narrow interpretation was deliberate: prior iterations already rejected importing Hallmark's named presets and exact motion multipliers, so this pass looked for a complementary decision layer that preserves sk-design's corpus-as-evidence contract.

## Findings

1. **Hallmark's “twenty themes” are a routing system, not merely twenty token bundles.** Genre is chosen before theme and scopes the catalog: atmospheric gets five themes, modern-minimal two, playful one, and editorial twelve. The default is catalog, and the catalog/custom fork is hidden unless the brief carries a qualifying signal. This combination reduces open-ended choice while keeping a quiet escape hatch. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:230] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:240] **Verdict: LEARN.** Add an internal `directionArchetype` interpretation step to `design-interface/procedures/aesthetic-direction.md`, after register and Design Read, with coarse evidence-derived facets such as `genre`, `paper-band`, `display-style`, and `accent-family`. It must remain internal calibration, never a twenty-item chooser. Value: high. Effort: low-medium.

2. **The checked-in corpus is two orders of magnitude larger and structurally better suited to evidence retrieval than Hallmark's catalog.** The repository contains 1,293 direct style directories, 1,290 canonical JSON bundles, and 1,290 `source.md` artifacts. The persistent database already stores `theme` and `industry`, generic facet/capability terms, token axes, provenance and rights state, plus FTS/vector documents. Hallmark's catalog cannot replace that breadth or its provenance boundary. [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:73] [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:97] [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:125] [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:147] [INFERENCE: checked-in counts produced by `find .opencode/skills/sk-design/styles -mindepth 1 -maxdepth 1 -type d`, `find ... -name '*-canonical.json'`, and `find ... -name source.md`] **Verdict: SKIP** catalog replacement. Keep extracted bundles authoritative as evidence anchors. Value: critical defensive value. Effort: none.

3. **Hallmark's three-axis diversification rule is the most portable part of its theme system.** It records paper band, display style, and accent hue, then requires consecutive outputs to differ; project memory checks the last three to five runs and excludes recent macrostructures/themes. Unlike a named theme, these axes describe observable design decisions. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:268] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:274] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:296] **Verdict: ADAPT.** Extend `shared/assets/variant-parameter-contract.md` with semantic `paperBand`, `displayStyle`, and `accentFamily` knobs, then have `design-interface/references/design-process/variation-diversity.md` require meaningful delta across at least one owned axis between alternatives. Do not copy Hallmark's exact category memberships or turn the fields into presets. Value: high. Effort: low.

4. **Those same axes fit sk-design's existing retrieval surface without a new theme table.** `styles/_db/schema.mjs` already permits arbitrary normalized facets and token-axis rows; `styles/_db/retrieval.mjs` accepts `requiredFacets`, `exclusions`, `axes`, and `needs`, filters eligible provenance first, then scores structured axis/capability matches alongside FTS and vector lanes. [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:125] [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:132] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:102] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:151] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:172] **Verdict: ADAPT.** Teach `styles/_db/indexer.mjs` to materialize evidence-backed `genre`, `paper-band`, `display-style`, `accent-family`, and optional `motion-character` terms from canonical bundles when present; pass only brief-supported values through `design-interface/corpus/relational-exemplar.mjs` and `design-foundations/corpus/relationship-blueprint.mjs`. The generic schema means this should be an ingestion/query change, not a parallel curated-theme database. Value: high. Effort: medium.

5. **The anti-preset contract blocks direct adoption of Hallmark's catalog but explicitly permits the proposed facet layer.** Interface allows one mode-selected coherent corpus anchor plus at most one bounded contrast/rejected default; corpus evidence cannot select the mode, override target evidence, authorize copying, or expose raw hydrated prose/tokens/assets. Its aesthetic examples are critique-against cues, “never a chooser or preset.” [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:86] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:89] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:200] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:204] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:206] **Verdict: LEARN.** Add an explicit invariant to `design-interface/corpus/README.md`: archetype facets narrow candidate evidence; they never return a named style menu or choose the direction. Record the no-corpus default that changed, as the current relational-exemplar contract already requires. Value: high. Effort: low.

6. **Hallmark's custom route supplies a useful escalation gate and depth distinction.** It surfaces only for explicit custom/brand asks, a named brand color, a multi-attribute off-catalog aesthetic, a mood reference, or a singular structural vision. “Tuned” changes palette/type while retaining structure; “bespoke” changes composition too; neither becomes a permanent catalog entry, and the quality floor stays fixed. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/custom-theme.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/custom-theme.md:9] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/custom-theme.md:16] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/custom-theme.md:50] **Verdict: ADAPT.** Add `tuned-system` versus `bespoke-direction` depth to `design-interface/references/design-process/brief-to-dials.md` and route the former to Foundations token work while Interface owns the latter. Ask only when evidence indicates the depth would materially change; do not default users into a catalog/custom fork. Value: high. Effort: low-medium.

7. **Per-theme packets show where a curated layer can add value beyond scalar facets, but only four of twenty themes currently have such files.** Hallmark eagerly loads an optional packet when present; those packets carry signature moves, macrostructure affinities/rejections, voice fixtures, anti-patterns, palette drops, and motion behavior that token blocks cannot encode. The partial coverage makes these useful as a packet-shape prototype, not a complete catalog contract. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:353] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/themes/lumen.md:1] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/themes/lumen.md:23] [INFERENCE: the checked-in `references/themes/` directory contains only `carnival.md`, `cobalt.md`, `hum.md`, and `lumen.md`] **Verdict: INSPIRE-NEW.** Add an optional compact “archetype rationale card” generated from a retrieved corpus anchor—signature relationships, affinities, rejections, voice register, and motion character—inside the decision-only Interface handoff. Do not author 1,290 permanent packets or redistribute Hallmark's prose. Value: medium-high. Effort: medium-high.

8. **Theme-aware motion should remain semantic and evidence-derived.** Hallmark's roadmap proposes per-theme duration tokens, while its theme packets couple motion to material metaphors (for example, Lumen Night emits with a slow pulse while Day refracts with a one-time reveal). That is stronger than a naked multiplier because it explains why behavior differs. Prior work already found sk-design's Brand/Product budget but no portable theme motion character. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:17] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/themes/lumen.md:23] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/themes/lumen.md:39] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/themes/lumen.md:54] [SOURCE: .opencode/skills/sk-design/shared/register.md:24] [SOURCE: .opencode/skills/sk-design/shared/register.md:75] **Verdict: INSPIRE-NEW.** Keep the previously proposed `motionCharacter` handoff in `design-foundations/assets/token-starter.md` and `shared/design-token-vocabulary.md`, but derive it from material/interaction rationale (`quiet`, `snappy`, `elastic`, `static-first`; entrance/spring/repetition policies) rather than named-theme multipliers. Motion consumes the semantics and chooses measured duration/easing tokens. Value: high. Effort: medium.

## Reuse / Learning Matrix

| Hallmark asset | sk-design target mode / command / reference | Verdict | Specific concrete change to sk-design | Value | Effort |
|---|---|---|---|---|---|
| Twenty-theme catalog and genre clusters | INTERFACE; `procedures/aesthetic-direction.md`; corpus request mapping | LEARN | Add a coarse internal `directionArchetype` facet read after register/dials; never expose the twenty names as a chooser | High | Low-medium |
| Four genre packets | INTERFACE + AUDIT; `brief-to-dials.md`; corpus query facets | ADAPT | Normalize brief-supported genre/posture facets and allow them to scope retrieval and applicable anti-slop checks | Medium-high | Medium |
| Paper/display/accent diversification axes | `shared/assets/variant-parameter-contract.md`; `variation-diversity.md` | ADAPT | Add three semantic variant axes and require evidence-backed delta between alternatives | High | Low |
| `.hallmark/log.json` recency rotation | INTERFACE variation procedure | LEARN | Track only the current variation set's axis fingerprints in the design handoff; do not add persistent hidden project memory merely to force novelty | Medium | Low |
| Catalog-as-default behavior | INTERFACE direction contract | SKIP | Preserve brief/owned-system authority and `no-fit` as valid; never force a catalog theme when evidence is weak | High defensive value | None |
| `custom-theme.md` signal gate | INTERFACE + FOUNDATIONS; `brief-to-dials.md` | ADAPT | Add signal-gated `tuned-system` versus `bespoke-direction` depth routing | High | Low-medium |
| Four optional per-theme packets | INTERFACE corpus handoff | INSPIRE-NEW | Generate a bounded archetype rationale card from the selected evidence anchor; no permanent preset packets | Medium-high | Medium-high |
| Named theme token values | FOUNDATIONS / styles corpus | SKIP | Keep extracted, provenance-bearing tokens as evidence; do not import Hallmark's fixed palette/font combinations | High defensive value | None |
| Theme facets in corpus | `styles/_db/indexer.mjs`, `schema.mjs`, `retrieval.mjs` | ADAPT | Materialize generic evidence-backed facets and feed existing structured/FTS/vector fusion; no new theme table | High | Medium |
| Theme-aware motion tokens | FOUNDATIONS -> MOTION; token starter and shared vocabulary | INSPIRE-NEW | Add semantic `motionCharacter` and derive timings/easing from rationale and measured context, not Hallmark names or multipliers | High | Medium |
| Genre-aware gate exceptions | AUDIT applicable-check contract | LEARN | Express exceptions as target-evidence applicability, not named-genre exemptions | Medium | Low-medium |

## Ruled Out

- Importing Hallmark's twenty theme definitions or exact axis memberships as sk-design presets: this would create a chooser menu and parallel doctrine, conflicting with Interface's evidence-anchor contract.
- Adding a separate curated-theme database: the existing generic facet, token-axis, FTS and vector schema already has the required extension points.
- Persisting a `.hallmark/log.json` analogue solely for novelty: sk-design's variation contract needs diversity inside the requested option set, while cross-run memory can override a pinned brief or owned system.
- Copying exact duration multipliers or theme-specific CSS/token values: the portable idea is semantic motion character; close textual/code reuse would also require Hallmark's MIT notice.

## Dead Ends

- Treating all twenty catalog entries as equally specified. Only four checked-in theme packets carry the richer affinity/voice/motion contract; the remaining themes are token-block entries, so the catalog cannot serve as a uniform schema without new authoring.
- Treating “genre” as a user-facing style picker. In sk-design it is useful only as evidence-derived retrieval/audit metadata subordinate to the brief and owned system.

## Edge Cases

- Ambiguous input: “curated themes” could mean importing presets or adding metadata. The preset path was already blocked by prior negative knowledge; this iteration evaluated metadata, retrieval, and semantic handoff adaptations.
- Contradictory evidence: Hallmark says catalog is the default, while sk-design permits `no-fit` and forbids corpus rank from choosing direction. The sk-design authority order prevails; Hallmark contributes narrowing heuristics only.
- Missing dependencies: none. The persistent database file itself was not queried; checked-in schema, retrieval implementation, corpus counts, and mode contracts were sufficient for architecture comparison.
- Partial success: none. The curated-theme mechanics portion of the extraction/motion/theme question is answered; broader roadmap ranking remains for later iterations.

## Sources Consulted

- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:205-354`
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/custom-theme.md:1-79`
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/genres/*.md`
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/themes/*.md`
- `.opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/ROADMAP.md:15-17`
- `.opencode/skills/sk-design/styles/_db/schema.mjs:67-162`
- `.opencode/skills/sk-design/styles/_db/retrieval.mjs:13-197`
- `.opencode/skills/sk-design/design-interface/SKILL.md:80-89,172,200-206,241-252`
- `.opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs`
- `.opencode/skills/sk-design/shared/assets/variant-parameter-contract.md:15-29`
- `.opencode/skills/sk-design/shared/register.md:24-79`
- Checked-in `.opencode/skills/sk-design/styles/` inventory counts.

## Assessment

- New information ratio: 0.81
- Novelty justification: Five of eight findings are new architecture/schema conclusions and three refine earlier catalog and motion hypotheses, yielding `(5 + 0.5×3) / 8 = 0.8125`, rounded to 0.81.
- Questions addressed: Which curated-theme mechanics improve the existing styles pipeline, Interface direction, Foundations tokens, and Motion handoff?
- Questions answered: The curated twenty-theme versus 1,290-bundle corpus comparison and its concrete complement architecture.
- Confidence: high for checked-in counts, routing, schema, retrieval, and anti-preset constraints; medium-high for implementation effort because ingestion fixtures and migration impact were not executed in this research-only pass.

## Reflection

- What worked and why: Comparing the theme router to the actual generic facet/retrieval schema converted a vague “curated complement” idea into a no-new-table implementation seam.
- What did not work and why: Sampling canonical JSON with a guessed `.tokens` shape failed because representative bundles do not share that guessed top-level key. The database schema and index/retrieval contracts were the safer canonical surfaces for this question.
- What I would do differently: In an implementation-planning pass, inspect `styles/_db/indexer.mjs` fixtures first and derive the exact canonical-to-facet mapping before estimating migration work.

## Recommended Next Focus

Audit Hallmark's ROADMAP item by item against shipped sk-design commands and feature catalog, then rank only net-new gaps: brand-first authored DESIGN.md, redesign/variant ergonomics, data-viz, tactile-rebellion, structural cookbook evolution, and the image-generation hook.
