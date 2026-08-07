# Iteration 004 — Effectiveness (does the JSON drive routing well?)

## Focus
Dimension (4): intent-signal coverage, load-bearing fields, routing quality vs hard-coded scorer tables.

## Actions Taken
1. Census intent_signals vs derived.trigger_phrases sizes and Jaccard overlap for all 11 roots.
2. Read explicit-author lane tables and live lane weights.
3. Live `advisor_recommend` probe: "scaffold a new parent skill hub with mode-registry".
4. Cross-check projection load-bearing fields against lane contributions in the probe.

## Findings

### F22 — Live miss: create-skill / mode-registry prompt ranks `sk-prompt` above `sk-doc`
Probe prompt: `scaffold a new parent skill hub with mode-registry`.

| Rank | skillId | score | dominantLane | notes |
|------|---------|------:|--------------|-------|
| 1 | sk-prompt | 0.691 | explicit_author | Wrong primary for skill scaffolding |
| 2 | sk-code | 0.687 | explicit_author | |
| 3 | sk-doc | 0.654 | explicit_author | Correct hub; compiledRoute → `create-skill-parent` when selected |
| 4–5 | cli-external-orchestration, mcp-tooling | ~0.62 | explicit_author | |

`ambiguous: true`. For sk-doc, `graph_causal` rawScore was **0** on this prompt; `derived_generated` helped (0.81 raw) but could not overcome explicit_author/lexical winners elsewhere. Authored JSON that should uniquely identify create-skill (mode-registry domain, create-skill intent) did not win Gate-2 ranking.

[SOURCE: live advisor_recommend 2026-07-29T06:14:15Z]
[SOURCE: sk-doc compiledRoute targets create-skill-parent when ranked]

### F23 — `explicit_author` (weight 0.42) is dominated by hard-coded phrase/token tables, not graph-metadata
Lane registry defaults: explicit_author 0.42, lexical 0.28, graph_causal 0.13, derived_generated 0.12, semantic_shadow 0.05. The explicit lane ships large static `TOKEN_BOOSTS` / phrase maps (e.g. `prompt`→sk-prompt, `docs`→sk-doc) in `explicit.ts`. That means the highest-weight lane is only partially a function of authored skill JSON — large routing authority lives in scorer source, outside the JSON optimization surface (and outside this research's "don't redesign scoring" non-goal, but it caps JSON leverage).

[SOURCE: lane-registry.ts:9-12]
[SOURCE: explicit.ts:18-57]

### F24 — Intent-signal coverage is highly uneven; overlap with derived triggers is weak
| Skill | intent_signals | derived.trigger_phrases | Jaccard |
|-------|---------------:|------------------------:|--------:|
| sk-code | 64 | 20 | 0.04 |
| mcp-tooling | 50 | 41 | 0.30 |
| cli-external-orchestration | 29 | 114 | 0.25 |
| sk-doc | 18 | 16 | 0.17 |
| system-skill-advisor | 4 | 10 | 0.27 |
| mcp-code-mode | 3 | 12 | 0.25 |
| system-spec-kit | 5 | 12 | 0.42 |

Sparse intent lists on system hubs + near-disjoint sk-code lists mean authors maintain two weakly-coupled phrase banks; effectiveness of either alone is unclear without acceptance tests.

[SOURCE: live graph-metadata census]

### F25 — Graph edges are sparse; `graph_causal` under-contributes on many prompts
Most roots have only 1–3 nonempty edge types; `conflicts_with` is empty fleet-wide in the census; `depends_on` is empty for 9/11 roots (despite orphan `manual.depends_on` content from F11). Probe showed sk-doc graph_causal=0. Load-bearing edge JSON is thin relative to its 0.13 weight — and orphaned `manual.related_to` never feeds this lane.

[SOURCE: edge census iteration 4]
[SOURCE: skill-graph-db.ts:779-807]

### F26 — Load-bearing JSON that *does* work (when ranking succeeds)
Confirmed consumers:
- Authored `intent_signals`, `domains`, `family`, `category`, `edges.*` → SQLite → projection
- `derived.trigger_phrases` / key_topics / entities / key_files / source_docs → derived_generated lane
- Hub `mode-registry.json` + `hub-router.json` → `compiled-route-manifest` (correct packet selection for sk-doc when it ranks)
- `SKILL.md` name/description/keywords → projection keywords (not description.json)

So hub routing *policy* JSON is effective post-selection; skill *selection* JSON is diluted by hard-coded explicit tables and sparse edges.

[SOURCE: projection.ts:223-247]
[SOURCE: compiled-route-manifest.cjs:405-412]

### F27 — Highest-leverage effectiveness gaps (JSON-side, without redesigning weights)
1. Align create-skill / mode-registry / parent-hub phrases so sk-doc wins explicit+lexical without relying on scorer-source edits (still JSON/content work).
2. Migrate orphan `manual.related_to`/`depends_on` into typed edges so graph_causal has fuel.
3. Reconcile intent_signals ↔ derived.trigger_phrases (or make derived the sole generated phrase bank and keep intent minimal).
4. Add representative `advisor_recommend` acceptance fixtures per hub (effectiveness CI) — see iteration 5.

## Questions Answered
- Do intent-signals and load-bearing fields actually drive advisor routing well? → Partially: they contribute, but selection quality is capped by hard-coded explicit_author dominance and sparse/orphaned graph data (F22–F26).

## Ruled Out
- Changing lane weights / rewriting explicit.ts scoring algorithm — non-goal.

## Next Focus
Dimension (5) Testing and integration — per-JSON test/CI coverage, scaffold→gate→ingest→routing e2e, failure modes.
