# Cross-Lineage Synthesis — Skill & Advisor JSON Optimization

Three independent deep-research lineages, 5 iterations each, no early convergence (`stop-policy=max-iterations`), run concurrently:

| Lineage | Executor | Iterations | Findings | research.md |
|---------|----------|-----------|----------|-------------|
| `sol-high` | cli-opencode `openai/gpt-5.6-sol` (high) | 5/5 | 30 | 26.6 KB |
| `glm-high` | cli-devin `glm-5-2` (GLM-5.2 High, free) | 5/5 | 28 | 16.5 KB |
| `grok-high` | cli-cursor `cursor-grok-4.5-high` | 5/5 | 32 | 8.0 KB |

90 findings total; 0 failed / 0 orphaned lineages. Every finding below is a **research hypothesis with cited evidence** — confirm against source before scheduling any fix (findings-only run; no implementation performed).

---

## 1. Verdict

The fleet is **structurally healthy but not lifecycle-complete.** All three lineages independently confirm: 11/11 roots pass the H/S presence contract and generated manifests are byte-fresh. The real gaps are not missing files — they are **consumption, freshness, and integration seams**: authored data that never reaches routing, generated data that drifts because it has no regenerator or freshness gate, and validation that runs offline instead of in CI. One lineage (grok-high) found a **live routing miss** (a parent-hub scaffold prompt ranked `sk-prompt` above `sk-doc`), which grounds the "selection is under-tested" theme in a concrete symptom.

---

## 2. Cross-lineage convergence

Ranked by leverage × agreement. "Agreement" = how many of the three independent lineages surfaced the theme.

| # | Theme | Agreement | Dimensions |
|---|-------|-----------|------------|
| 1 | The `derived` block is the weakest surface: no skill-root regenerator, no freshness gate, and a TS-writer-vs-Python-compiler schema conflict | **3/3** | optimization · automation · effectiveness · testing |
| 2 | Scaffold → generated-artifact → advisor-ingest is not one verified journey (`init_skill.py` omits `--fix`; no joined test) | **3/3** | automation · integration · testing |
| 3 | No Gate-2 acceptance/golden-prompt tests in CI (joined parent→mode); a live selection miss exists | **3/3** | testing · effectiveness |
| 4 | Advisor compiler / graph-schema / routing-accuracy validation runs offline, never in CI | **3/3** | testing · integration |
| 5 | Dead / orphan authored fields (`manual.*`, unread `description.json` extras, `causal_summary`) — one with live drift | **3/3** | optimization |
| 6 | Intent-signal quality: ~20× coverage variance, `domains`↔`intent_signals` double-count, path-keyword noise; the advisor's own skill is thinnest | **2–3/3** | effectiveness · optimization |
| 7 | `command-metadata.json` is schema-gated but **not ingested** by the advisor (routing uses a hardcoded TS array) | **2/3** (glm strong, grok partial) | effectiveness · integration |
| 8 | Rich mode/router vocabulary is compiled **after** a parent hub wins, so it can't help parent selection | **1–2/3** (sol-high distinctive) | effectiveness · automation |
| 9 | S-class `leaf-manifest.config.json` is ~90% boilerplate; could be defaulted/generated | **2/3** | automation |
| 10 | Duplicate authorities (`tieBreak`, `advisorRouting.packetSkillName`) + spec-folder vs skill-root generator name collision | **2/3** | optimization · inventory |

---

## 3. Ranked opportunity map

Leverage = impact × breadth across dimensions × actionability, weighted up by cross-lineage agreement. No fixes implemented; each item names a candidate follow-up.

### Tier 1 — highest leverage (all 3 lineages)

**O1. Canonicalize `derived` and give it one owner: a skill-root regenerator + a freshness gate.**
The densest, most drift-prone, least-automated, least-CI-validated surface. sol-high found the schema is defined incompatibly in two places — the TypeScript sync writer emits `keywords`+provenance while the Python compiler requires `key_topics`/`entities`/`causal_summary`, and the scorer reads the Python-style vocabulary, not the TS writer's `keywords`. glm-high found there is **no skill-root analog** to the spec-folder `backfill-graph-metadata` regenerator and **no `derived` freshness gate**, so the block is hand-enriched after scaffold and drifts forever. grok-high found `syncDerivedMetadata` is off the CI path.
- Evidence: `system-skill-advisor/mcp-server/schemas/skill-derived-v2.ts:35-55`; `system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py:300-325`; `system-skill-advisor/mcp-server/lib/scorer/projection.ts:658-685`; `sk-doc/create-skill/scripts/init_skill.py:287-293,540-557`; `ci-skill-root-metadata.cjs:40-42`.
- Prerequisite: pick the authoritative `derived` producer (TS sync vs Python compiler vs a shared schema package) **before** any field trimming or generation.

**O2. Make scaffold→`--fix`→ingest→`advisor_recommend` one verified journey.**
`init_skill.py` leaves required generated artifacts (manifest, S aliases) to a later manual `--fix`; no test joins scaffold → generated gate → advisor ingest → parent selection → compiled route. The 024 journey-proof checklist items (CHK-005/CHK-009) are still open.
- Evidence: `init_skill.py:321-340,583-665`; `skill-root-metadata-contract.test.cjs:222-235`; `discovery-pipeline-parity.vitest.ts:47-85`; `024-create-journey-gate-fixes/checklist.md`.

**O3. Add a Gate-2 golden-prompt acceptance suite in CI (joined parent→mode).**
grok-high recorded a **live miss** — a parent-hub scaffold prompt ranked `sk-prompt` above `sk-doc` — and no GitHub workflow wires `advisor_recommend`. Command canaries cover command forms but only two positive natural-language routes; the advisor regression corpus has one generic sk-doc case. No joined case proves every mode first selects the parent and then the intended compiled route.
- Evidence: `009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json:5-23`; `skill-advisor-regression-cases.jsonl:30`; live `advisor_recommend` probe 2026-07-29T06:14:15Z (grok-high iter4).

**O4. Wire the advisor compiler / graph-schema / routing-accuracy validation into CI.**
`routing-registry-drift.yml` runs the class + freshness gates but not `skill_graph_compiler.py` (full `derived` schema + `key_files`/`source_docs` path existence), nor `score-routing-corpus.py` (195 labeled + 72 holdout + 24 ambiguity prompts). A skill can pass CI with a malformed `derived` block or broken paths; the failure only surfaces at an offline advisor rebuild — a green-root / downstream-failure seam.
- Evidence: `ci-skill-root-metadata.cjs:98-140`; `skill_graph_compiler.py:306-396`; `.github/workflows/routing-registry-drift.yml:109-110`; `mcp-server/scripts/routing-accuracy/`.

### Tier 2 — medium-high leverage

**O5. Remove or migrate dead/orphan fields.** `graph-metadata.manual.*` is ignored by `parseSkillMetadata` and has live drift (e.g. `cli-external-orchestration` `manual.depends_on` vs an empty `edges.depends_on`) with 0 tests; `description.json` carries `trigger_examples`/`supported_surfaces`/`opencode_languages` with no verified local reader; `derived.causal_summary` is validated but has no skill-root consumer. (3/3) — grok-high rated `manual.*` P0. Confirm no external consumer before deleting; migrate `manual.*` into typed `edges` + an unknown-key lint.
- Evidence: `sk-code/graph-metadata.json:259-265`; `sk-doc/description.json:2-51`; `parent-skill-check.cjs:1022-1044`; `skill_graph_compiler.py:318-320`.

**O6. Fix intent-signal quality.** ~20× coverage variance (3→64 intent_signals across the fleet), `domains`↔`intent_signals` double-count in the lexical lane, and file-path tokens polluting `derivedKeywords` with generic shared tokens. The advisor's *own* skill has the thinnest signal set, so routing **to** the advisor is the weakest case. Candidate: a per-skill signal-coverage floor + lane-size normalization + strip path-only entries — confirmed against the O4 routing-accuracy corpus.
- Evidence: `scorer/lanes/lexical.ts:64-90`; `scorer/lanes/derived.ts:62-87`; `scorer/projection.ts:216-221`.

**O7. Ingest `command-metadata.json` into command routing.** It is schema-gated by the fleet gate but not consumed by the advisor — command routing uses a hardcoded `COMMAND_BRIDGES` TS array, and no drift-guard ties the two. (glm-high strong; grok-high notes thin tests.) Candidate: derive the bridges from the JSON + add a drift-guard.
- Evidence: `scorer/projection.ts:58-145`; `routing-registry-drift.yml` (drift-guard asserts mode-registry, not command-metadata).

**O8. Generate a high-specificity parent-intent projection from mode/router vocabulary.** (sol-high distinctive) Distinctive per-mode phrases live only in `hub-router.json`/`mode-registry.json`, which are compiled **after** the parent wins — so they cannot help parent selection. Projecting that vocabulary into a parent-selection input activates already-authored intent without changing scorer math.
- Evidence: `sk-doc/hub-router.json:36-49`; `scorer/projection.ts:173-247`; `registry-compiler.cjs:173-185`.

### Tier 3 — lower leverage

**O9.** Generate S-class `leaf-manifest.config.json` with defaults (~90% boilerplate; `--fix`-generate, author only on override). Evidence: `generate-leaf-manifest.cjs:95-127`.
**O10.** Denser `command-metadata` / `leaf-aliases` e2e tests (thin: 2–3 vitest files vs 7–9 for registry/router). Evidence: sol/glm/grok iter-5.
**O11.** Resolve duplicate authorities — `routerPolicy.tieBreak` (already drifted from the compiler's derived order) and `advisorRouting.packetSkillName` (no verified production reader); document the spec-folder vs skill-root `generate-description.js`/`backfill-graph-metadata.js` name collision. Evidence: `hub-router.json:4-13`; `registry-compiler.cjs:188-195`; `mode-registry.json:19-40`.

---

## 4. Disagreements & single-lineage flags

- **command-metadata ingestion (O7):** glm-high frames it as a clear "gated but not consumed" gap; sol-high treats command-metadata as legitimately consumed for choreography by a distinct consumer (not advisor routing) and does not call it a gap. Not a contradiction — different consumers — but the "advisor does not ingest it for routing" claim is glm-primary; confirm the `COMMAND_BRIDGES` hardcoding before acting.
- **Parent-intent projection (O8):** sol-high's deepest effectiveness finding; the other two touch "selection is weaker than post-selection" but do not propose the projection. Single-lineage design idea — treat as a hypothesis.
- **Baseline accuracy numbers:** sol-high explicitly warns the checked-in routing-accuracy baselines are version-sensitive and contradictory across sources; do not quote a single global accuracy percentage. Any O4/O6 gating must pin an exact corpus hash.

---

## 5. What all three agree is NOT the problem

Presence/class conformance (11/11), generated-manifest freshness, the H/S class split itself, compiled-route publication mechanics (mint/lease/atomic-refresh), and command-metadata *schema* validation are all healthy and well-tested. Several apparent duplicates are load-bearing consumer projections (compiled manifests preserve serving authority, H aliases carry relocation, command-metadata carries choreography) and should not be deleted.

---

## 6. Recommended next step

The four Tier-1 items form a coherent follow-up program with a natural order: **O1 (canonical `derived` owner) is the prerequisite** — field trimming (O5), generation (O2), and any parent projection (O8) all depend on first naming the authoritative `derived` producer. A single follow-up packet could sequence: (1) pick the `derived` authority + build the regenerator + freshness gate; (2) close the scaffold journey with `--fix` + the joined proof; (3) wire compiler + routing-accuracy + golden prompts into CI. This is an **operator-gated implementation decision** — this packet delivers the ranked map only.

---

## 7. Per-lineage evidence

- `research/lineages/sol-high/research.md` (+ `iterations/`, `deltas/`)
- `research/lineages/glm-high/research.md` (+ `iterations/`, `deltas/`)
- `research/lineages/grok-high/research.md` (+ `iterations/`, `deltas/`)
- Orchestration summary: `research/orchestration-summary.json`
