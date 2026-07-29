# Iteration 002 — Optimization (redundant / unused / drift-prone fields)

## Focus
Dimension (2): redundant or unused fields, drift-prone data, consolidation candidates, fields no consumer reads.

## Actions Taken
1. Compared hub `description.json` vs `graph-metadata.json` vs `SKILL.md` field sets for sk-doc, sk-code, system-deep-loop.
2. Traced runtime readers: `parseSkillMetadata`, `projectionFromRow`, doctor `parent-skill-check` rule 8.
3. Grepped for `trigger_examples`, `opencode_languages`, `supported_surfaces`, and graph `manual` consumers.
4. Diffed `edges.*` vs `manual.*` across all 11 roots.

## Findings

### F8 — `description.json` is presence theater for advisor routing; projection reads `SKILL.md` instead
Doctor requires only `name`, `description`, `version`, `keywords` on hubs. Scorer projection takes `name`/`description`/`keywords` from `SKILL.md`, and domains/intentSignals from graph-metadata rows — never from `description.json`.

[SOURCE: parent-skill-check.cjs:1030-1032]
[SOURCE: projection.ts:195-232]
[SOURCE: skill-root-metadata-contract.md:73-75]

### F9 — Multiple `description.json` fields have zero runtime readers outside init scaffolds
Repo-wide code search for `trigger_examples`, `opencode_languages`, and `supported_surfaces` under skill tooling hits only `init_skill.py` writers. Doctor does not validate them. They are authored dead weight on every hub that carries them (e.g. sk-doc / sk-code).

[SOURCE: init_skill.py:566-568]
[SOURCE: parent-skill-check.cjs:1030 — required field list omits them]
[SOURCE: rg consumers — only init_skill.py writes]

### F10 — Dual identity surfaces invite silent drift: `description.keywords` ≈ `graph.domains` ≈ `SKILL.md` keywords
Hubs maintain overlapping keyword/domain vocab across three files. Advisor scoring uses graph domains + SKILL.md keywords + derived lanes; description keywords are unused at score time. Consolidation candidate (without redesigning H/S): shrink description to doctor-required quartet, or generate description from SKILL.md/graph.

[SOURCE: projection.ts:228-232]
[SOURCE: live sk-doc description.keywords vs graph.domains overlap]

### F11 — Graph `manual.{depends_on,related_to}` is orphaned relative to ingested `edges`
`parseSkillMetadata` only indexes `edges.<EDGE_TYPES>`; no consumer of the top-level `manual` object was found in skill-graph-db or projection. Yet 10/11 roots still author `manual`, and it diverges from edges:

| Root | Drift example |
|------|----------------|
| `cli-external-orchestration` | `manual.depends_on=['system-spec-kit']` but `edges.depends_on=[]` |
| `mcp-tooling` | `edges.depends_on` includes `sk-design`; `manual.depends_on` only `mcp-code-mode` |
| Nearly all | `manual.related_to` populated while `edges.related_to=[]` (related_to not even a live EDGE_TYPE in several schemas — edges use siblings/enhances/etc.) |

Highest-leverage optimization: delete or migrate `manual.*` into typed `edges`, then gate unused keys.

[SOURCE: skill-graph-db.ts:779-828]
[SOURCE: live census of manual vs edges across 11 roots]

### F12 — Author `intent_signals` + `derived.trigger_phrases` are parallel load-bearing lanes (intentional but drift-prone)
Projection keeps them separate (`intentSignals` from authored array; `derivedTriggers` from `derived.trigger_phrases`) after a prior double-counting bug. Effective, but authors must maintain two phrase lists that can diverge from SKILL.md frontmatter and description.trigger_examples (itself unread).

[SOURCE: projection.ts:204-234]
[SOURCE: extract.ts:38-39 — derived extractor reads SKILL.md + graph-metadata]

### F13 — `derived.*` block is large, partially scoring-relevant, and hand-stale risk
Derived contributes trigger_phrases, key_topics, entities, key_files, source_docs, demotion, lifecycle stamps. Other derived keys (causal_summary, peer_resource_categories, nested derived.intent_signals on some hubs) add authoring/sync surface. Stale derived without re-sync under-informs the derived_generated lane.

[SOURCE: projection.ts:213-242]
[SOURCE: sk-doc/sk-code derived key samples from iteration census]

### F14 — Consolidation candidates (findings only; H/S contract frozen)
1. Collapse unread description fields → doctor quartet only (or generate description from SKILL.md).
2. Remove or compile-away `manual.*` in favor of `edges.*`.
3. Document single source of truth for routing phrases: authored `intent_signals` vs derived sync — prevent third copies in description.trigger_examples.
4. Keep generated leaf-manifest as-is (already optimized/freshness-gated).

## Questions Answered
- Which fields are redundant, unused, or drift-prone across skill-root and advisor JSON? → Answered (F8–F14).

## Questions Remaining
- What still requires hand-authoring that scaffolder/generators could emit or auto-validate?
- Do intent-signals and load-bearing fields actually drive advisor routing quality?
- Where are test/CI and e2e gaps?

## Ruled Out
- Deleting `description.json` entirely this research cycle — forbidden by H class contract; optimize contents/consumers instead.
- Redesigning advisor scoring weights — out of scope.

## Next Focus
Dimension (3) Automation gaps — what still needs hand-authoring, what could be generated or auto-validated, scaffolder coverage gaps in `init_skill.py` / generators / CI.
