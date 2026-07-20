# Iteration 7: Curated Themes And Extracted Corpus Coexistence

## Focus

Compare Hallmark's twenty-theme catalog, four genre overlays, four currently shipped optional per-theme specifications, signal-driven custom fallback, and rotation memory against sk-design's 1,290 complete extracted style bundles, persistent retrieval/rights gates, relational-exemplar authority, register, corpus adapter, and Foundations-compatible token posture. The selected interpretation is narrow: curated archetypes may improve explanation and evaluation, but must not become a theme chooser, copy source, or value authority.

## Findings

### 1. The reported corpus cardinality is 1,290 complete bundles, not approximately 1,290

A direct packet-local census found exactly 1,290 `*-canonical.json` files and exactly 1,290 directories containing the other five required roles (`DESIGN.md`, `css-variables.css`, `tailwind-v4.css`, `design-tokens.json`, and `source.md`). Flat files remain authoritative; SQLite is a rebuildable projection rather than another corpus. [SOURCE: command: Python pathlib census of `.opencode/skills/sk-design/styles/*/*-canonical.json` and the five sibling roles, 2026-07-20] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:1-5]

### 2. Hallmark is a small authored decision system, not a retrieval corpus

Hallmark first infers one of four genres, then defaults silently to a genre-scoped cluster of twenty named themes. It rotates against recent project memory and requires a difference on paper band, display style, or accent hue. This is deterministic and explainable, but its labels encode Hallmark's own authored combinations rather than observations from independent sources. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:230-251] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:274-323]

### 3. “Twenty themes” overstates the depth of the authored catalog

Actual files contain four genre guides and only four optional per-theme specifications (`carnival`, `cobalt`, `hum`, `lumen`). Hallmark explicitly says most themes have no specification; absent files are silent no-ops. Therefore the catalog is mostly token/axis combinations plus routing, while only 20% of themes have richer signature, affinity, voice, and anti-pattern guidance. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:348-358] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/themes/cobalt.md:1-99] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/genres/editorial.md:1-71] [SOURCE: command: exact `themes/*.md` and `genres/*.md` file listing, 2026-07-20]

### 4. Hallmark's custom fallback is the useful anti-preset mechanism, but sk-design already has a stronger native boundary

Hallmark surfaces custom only for explicit custom intent, a named brand color, an off-catalog multi-attribute vibe, a mood reference, or singular structural vision; silence remains catalog. Tuned custom is one-off palette/type while bespoke may drop catalog structures, yet neither becomes a permanent theme. sk-design's register/dials and target-first authority are stronger because corpus grounding occurs only after brief and owned system resolution and never chooses taste. [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/custom-theme.md:3-32] [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/custom-theme.md:50-79] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:170-204]

### 5. The styles engine already supplies the controls a curated selector would otherwise need

Persistent retrieval filters required facets, exclusions, known provenance, and exact-reuse rights before structured, FTS, or vector ranking. The interface adapter then permits one mode-selected anchor and at most one bounded secondary, discards hydrated source bodies, checks immutable target locks, and supports `no-fit`. Adding a parallel Hallmark-style theme picker would weaken both rights gating and selected-mode judgment. [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:52-65] [SOURCE: .opencode/skills/sk-design/design-interface/corpus/README.md:3-24] [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:200-206]

### 6. Curated archetypes are useful as derived labels and evaluation lenses, never as source bundles or generation presets

A small native taxonomy can summarize relationships already present in eligible corpus records (for example tonal band, typographic contrast, density, image role, motion stance, structural rhythm) and explain why an anchor was selected or rejected. The labels must be independently inferred from source evidence, multi-label, confidence-bearing, and subordinate to the brief; no fixed palette, font pair, token values, prose, screenshot, or component recipe may cross the handoff. [INFERENCE: based on `.opencode/skills/sk-design/styles/_db/README.md:15-23`, `.opencode/skills/sk-design/design-interface/corpus/README.md:6-13`, and `.opencode/skills/sk-design/design-interface/SKILL.md:204-206`]

### 7. Coexistence should be one-way: corpus evidence may be described through lenses, while lenses never select or synthesize a design

The concrete model is: brief/owned system -> register and dials -> rights-gated corpus query -> mode-selected relational exemplar -> derived archetype explanation -> target-owned preserve/transform/reject decisions -> render/preflight. Curated lenses can also grade diversity and detect collapse across fixtures, but cannot rank candidates independently, average values, authorize exact reuse, or become user-visible options. [INFERENCE: based on `.opencode/skills/sk-design/design-interface/SKILL.md:200-206`, `.opencode/skills/sk-design/design-interface/references/aesthetics/README.md:24-28`, and `.opencode/skills/sk-design/design-interface/corpus/README.md:19-24`]

## Corpus / Theme Comparison Matrix

| Concern | Hallmark curated model | sk-design extracted model | Coexistence decision |
|---|---|---|---|
| Cardinality | 20 names; 4 genre files; 4 optional theme specs | 1,290 complete six-role bundles | Corpus remains evidence authority; labels stay compact and derived |
| Selection | Silent genre signal, cluster, rotation; custom only on named signals | Required facets/rights first, ranked retrieval, mode selects one anchor, valid no-fit | Do not add a second selector; expose bounded reason codes after selection |
| Explainability | Human-readable genre/theme/axis choice and recent-history delta | Channel contributions plus relational preserve/transform/reject handoff | Add native axis evidence and rejection reasons, not Hallmark theme names |
| Values | Authored fixed combinations and recipes | Extracted per-source values and relationships | Never project archetype defaults into target tokens |
| Provenance/rights | Hallmark source is MIT; external ingredients may have separate rights | Known provenance and exact-reuse rights gate before ranking | Rights gate precedes labels; labels cannot upgrade eligibility |
| Anti-preset | Rotation plus rare custom/bespoke escape | Brief/owned-system authority, no-fit, anti-copy, no raw hydration/value averaging | sk-design boundary is authoritative; use labels only for critique/evaluation |
| Theme-aware behavior | Genre scopes allowed moves and some audit exceptions | Register/dials scope judgment; target render/preflight stays authoritative | Express any lens as a hypothesis under register, never as a behavioral override |

## Candidate Matrix

| Candidate | Exact target files | Verdict | Concrete change | Value | Effort | Licensing treatment |
|---|---|---|---|---|---|---|
| Derived archetype evidence fields | `.opencode/skills/sk-design/styles/_engine/manifest.mjs`; `.opencode/skills/sk-design/styles/_db/indexer.mjs` | INSPIRE-NEW | Add optional multi-label axis evidence, confidence, source fields, and semantic-hash coverage; no label supplies values | High | High | Independently author generic dimensions; copying Hallmark names, axis tables, or prose requires Hallmark MIT notice |
| Selection explanation in relational adapter | `.opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs`; `.opencode/skills/sk-design/design-interface/corpus/README.md` | ADAPT | Emit bounded matched/mismatched lens evidence and `no-fit` reasons only after rights-gated retrieval and mode selection | High | Medium | Native implementation and wording; no Hallmark expression needed |
| Archetype-collapse evaluation fixtures | `.opencode/skills/sk-design/design-interface/corpus/__tests__/`; `.opencode/skills/sk-design/design-interface/manual-testing-playbook/` | INSPIRE-NEW | Test that different briefs do not converge on one lens and that labels never alter locks, rights, target values, or no-fit | High | Medium | Independent tests; do not reproduce Hallmark theme fixtures or recipes |
| Critique-against lens bridge | `.opencode/skills/sk-design/design-interface/references/aesthetics/README.md`; `.opencode/skills/sk-design/design-interface/references/design-process/resource-loading-notes.md` | LEARN | Permit at most one evidence-derived realized-look label at critique time; require a target-specific deviation and prohibit chooser exposure | Medium-high | Low | Rewrite in native anti-preset vocabulary; direct Hallmark theme text requires notice |
| Register/foundations compatibility note | `.opencode/skills/sk-design/shared/register.md`; `.opencode/skills/sk-design/design-foundations/references/design-system-artifact-contract.md` | LEARN | Clarify that labels cannot override Brand/Product ceilings or create token values; target-authored tokens remain authoritative | Medium | Low | Idea-level clarification; no Hallmark copying |
| Hallmark themes as corpus bundles | `.opencode/skills/sk-design/styles/` | SKIP | Do not ingest named themes, genre guides, token combinations, screenshots, or recipes | High avoided risk | None | Copying/substantial adaptation would require Hallmark MIT notice; bundled fonts/images and third-party exemplars require separate rights review |

## Concrete Coexistence Recommendation

Keep the 1,290-bundle corpus and its rights-gated retrieval as the only reference-selection system. Add an optional, independently authored archetype-evidence layer to the existing manifest/database and relational adapter, initially evaluation-only. After fixture precision is proven, allow it to explain a mode-selected anchor or `no-fit`; never allow it to generate values, rank independently, become a public chooser, or persist as a reusable target preset. Hallmark's catalog is therefore a useful lesson in compact explanation and explicit fallback, not a data model to copy.

## Ruled Out

- Importing Hallmark's twenty names, four genre labels, theme token combinations, or four detailed theme specifications as sk-design facets or presets.
- A user-visible curated-theme chooser or silent fallback to one native archetype when corpus retrieval returns `no-fit`.
- Allowing archetype labels to bypass provenance/exact-reuse rights, average source values, or upgrade source confidence.
- Treating all twenty Hallmark themes as equally specified; only four per-theme specification files exist.

## Dead Ends

- Broad text search for the literal reported cardinality produced numeric false positives inside extracted style data. A structural census of canonical files and six-role siblings supplied the exact count.
- Name-parity mapping between Hallmark themes and corpus styles remains blocked: it would turn descriptive labels into pseudo-presets and discard source-specific relationships.

## Edge Cases

- Ambiguous input: strategy's machine-owned next focus requested MIT notice placement, while the authoritative rendered iteration prompt explicitly selected theme/corpus coexistence. The narrower explicit iteration focus governed; notice placement is carried in each candidate's licensing treatment.
- Contradictory evidence: “twenty-theme catalog” coexists with only four detailed theme files; resolved as twenty named/token combinations, four rich optional specifications.
- Missing dependencies: no published SQLite generation file was present at the probed default locations; flat bundle authority and source code contracts were sufficient, and no database was rebuilt.
- Partial success: none.

## Sources Consulted

- [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/SKILL.md:230-354]
- [SOURCE: .opencode/specs/sk-design/014-hallmark-design-skill-research/external/hallmark/skills/hallmark/references/custom-theme.md:1-79]
- [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:1-65]
- [SOURCE: .opencode/skills/sk-design/design-interface/SKILL.md:170-206]
- [SOURCE: .opencode/skills/sk-design/design-interface/corpus/README.md:1-30]
- [SOURCE: .opencode/skills/sk-design/design-interface/references/aesthetics/README.md:24-28]
- [SOURCE: command: exact corpus census and Hallmark `themes/*.md` / `genres/*.md` listings, 2026-07-20]

## Assessment

- Status: complete for iteration 7's bounded focus.
- New information ratio: 0.86.
- Novelty justification: Five findings establish new cardinality, specification-depth, selection, rights, and coexistence facts; two partially refine prior anti-preset conclusions; `(5 + 2 x 0.5) / 7 = 0.86`.
- Questions addressed: Is Hallmark's curated twenty-theme model a useful complement to sk-design's extracted styles corpus, and if so how should the models coexist?
- Questions answered: Yes, only as independently authored derived labels, explanations, and evaluation lenses after rights-gated retrieval; not as themes, presets, values, or a selector.

## Reflection

- What worked and why: structural counting established exact corpus cardinality, while contract-level comparison separated selection authority from explanatory metadata.
- What did not work and why: broad cardinality grep matched arbitrary extracted numeric content, so it could not establish inventory size.
- What I would do differently: query a published database generation as a second cardinality check if one is supplied, without rebuilding it inside research.

## Recommended Next Focus

Evaluate Hallmark's remaining roadmap ideas—brand-first, data visualization, tactile interactions, and image hooks—against existing sk-design modes, preserving the same target-first and rights-aware boundary.
