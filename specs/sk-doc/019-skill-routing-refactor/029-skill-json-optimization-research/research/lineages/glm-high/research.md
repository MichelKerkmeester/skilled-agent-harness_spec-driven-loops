# Research Synthesis: Skill & Advisor JSON Optimization (glm-high lineage)

> Findings-only investigation. No implementation. Ranked opportunity map of the highest-leverage optimization, automation, effectiveness, testing, and integration gaps across every skill- and skill-advisor-related JSON in `.opencode/skills/`. Evidence cited as `file:line`. Single-lineage view (glm-high); cross-lineage synthesis merges this with sol-high and grok-high.

---

## 1. EXECUTIVE SUMMARY

The skill-metadata program built a clean two-class (H/S) contract and a fleet gate, and the presence matrix is fully conformant. The highest-leverage gaps are NOT presence gaps — they are **consumption and freshness gaps**: data that is authored or generated but never reaches routing, data that drifts because it has no regenerator or freshness gate, and validation that runs offline instead of in CI. Three findings dominate the opportunity map:

1. The skill-root `graph-metadata.json` `derived` block has **no regenerator and no freshness gate** — it is scaffolded minimal, hand-enriched, and silently drifts (F2.4/F3.1).
2. The advisor's full `derived` schema + path-existence validation **runs only offline**, not in CI — malformed derived passes the fleet gate (F3.4/F5.1).
3. `command-metadata.json` is **gated for schema but not ingested by the advisor** — command routing uses a hardcoded TS array with no drift gate to the JSON (F4.5/F5.4).

A secondary effectiveness gap: intent-signal coverage varies ~20x across the fleet, and the advisor's *own* skill has the thinnest signal set (F4.1).

---

## 2. RANKED OPPORTUNITY MAP

Ranked by leverage (impact × breadth across dimensions × actionability). Each entry lists: dimensions touched, evidence, the gap, and the opportunity (no implementation here).

### Tier 1 — Highest leverage

#### O1. Skill-root `derived` regenerator + freshness gate
- **Dimensions:** optimization · automation · testing/integration
- **Source findings:** F2.4, F3.1, F5.4.3
- **Evidence:** `init_skill.py:287-293,540-557` (scaffolds 5-field minimal derived); `backfill-graph-metadata.ts:485-516` (spec-folder has a regenerator, skill-root does not); `ci-skill-root-metadata.cjs:40-42` (`--fix` writes leaf-manifest only); no `derived` freshness gate exists (only `ci-leaf-manifest-freshness.cjs`).
- **Gap:** The densest part of graph-metadata.json is hand-enriched after scaffold and hand-maintained forever. Most of its fields are corpus-derivable (key_files/source_docs/entities from leaf-manifest + SKILL.md; trigger_phrases from SKILL.md keywords + mode names; key_topics from domains + mode-registry). There is no skill-root analog to spec-folder `backfill-graph-metadata.ts`, and no freshness gate, so the block drifts silently as references/assets/SKILL.md evolve.
- **Opportunity:** A skill-root `derived` regenerator (deriving key_files/source_docs/entities/trigger_phrases/key_topics from the corpus, leaving causal_summary authored) plus a `derived`-freshness gate in the fleet CI. This single change closes the optimization (drift), automation (hand-maintenance), and testing (freshness) dimensions at once.

#### O2. Wire advisor compiler (graph-metadata derived schema + path validation) into CI
- **Dimensions:** testing/integration
- **Source findings:** F3.4, F5.1, F5.5
- **Evidence:** `.github/workflows/routing-registry-drift.yml` runs `ci-skill-root-metadata.cjs` + `ci-leaf-manifest-freshness.cjs` but NOT `skill_graph_compiler.py`; `ci-skill-root-metadata.cjs:131-137` (graph-metadata used only for NESTED_IDENTITY identity check); `skill_graph_compiler.py:294-394` (full derived schema + key_files/source_docs path existence).
- **Gap:** A skill can pass the fleet gate and CI with a malformed `derived` block or broken key_files paths; the failure surfaces only at an offline advisor rebuild. Presence is fail-fast in CI; content-quality is fail-slow at rebuild.
- **Opportunity:** Add `skill_graph_compiler.py --validate-only` (or the TS `graph-metadata-schema.ts` equivalent) as a CI step in `routing-registry-drift.yml`, triggered on `graph-metadata.json` changes (already in the path filter).

#### O3. Ingest `command-metadata.json` into advisor command routing
- **Dimensions:** effectiveness · integration
- **Source findings:** F4.5, F5.4.2
- **Evidence:** `projection.ts:58-145` (hardcoded `COMMAND_BRIDGES` with inline intentSignals/keywords); `skill_advisor.py` grep for `command-metadata` returns no read; `routing-registry-drift.yml` drift-guard asserts `mode-registry == advisor maps`, NOT `command-metadata == COMMAND_BRIDGES`; contract §3 (command-metadata schema gated by fleet gate).
- **Gap:** `command-metadata.json` carries `userIntent`/`choreography`/`argumentHint` per command, is validated by the fleet gate, but is NOT consumed by the advisor — command routing uses a parallel hardcoded TS array. The two can drift with no gate.
- **Opportunity:** Derive `COMMAND_BRIDGES` (or its replacement) from `command-metadata.json` so the authored data drives routing, and add a drift-guard asserting command-metadata ↔ advisor command projections.

#### O4. Normalize and enrich intent-signal coverage; fix the advisor's own thin signal
- **Dimensions:** effectiveness
- **Source findings:** F4.1, F4.3
- **Evidence:** Fleet count table (iter 4): intent_signals 3→64, derived triggers 10→114; `system-skill-advisor` itself has 4 intent_signals / 10 derived triggers / 2 source_docs (thinnest); `lexical.ts:64-90` (no per-skill signal-size normalization).
- **Gap:** Thin-signal skills (mcp-code-mode, system-spec-kit, system-skill-advisor) lose lexical-lane matches to rich-signal hubs regardless of relevance. The advisor's own skill is the weakest, so routing TO the advisor is the weakest case in the fleet.
- **Opportunity:** A signal-coverage floor per skill (min intent_signals / derived triggers) and/or lexical-lane normalization for signal-set size; enrich system-skill-advisor's own graph-metadata first.

#### O5. Gate the routing-accuracy corpus in CI
- **Dimensions:** testing/integration · effectiveness
- **Source findings:** F5.3, F4.4
- **Evidence:** `mcp-server/scripts/routing-accuracy/` has 195 labeled + 72 holdout + 24 ambiguity prompts and `score-routing-corpus.py`; `routing-registry-drift.yml` runs only the parity vitest suites, not `score-routing-corpus.py`.
- **Gap:** JSON-driven routing-quality regressions (e.g. F4.4 path-keyword false matches, F4.1 thin-signal routes losing) are not blocked by CI. The corpus that could catch them exists but runs offline.
- **Opportunity:** Run `score-routing-corpus.py` against `scorer-eval-baseline.json` as a CI step on graph-metadata/routing-asset changes; gate on accuracy delta.

### Tier 2 — Medium leverage

#### O6. Remove or consume dead fields: `supported_surfaces`, `peer_resource_categories`, `manual.*`
- **Dimensions:** optimization
- **Source findings:** F2.1, F2.3, F4.2
- **Evidence:** `sk-code/graph-metadata.json:259-265` (supported_surfaces, peer_resource_categories); producer grep empty; `init_skill.py:284` (manual scaffolded); advisor grep: only test fixture.
- **Gap:** Hand-authored, unvalidated, unconsumed. Routing-neutral (F4.2) but bloat the JSON and add authoring/maintenance cost.
- **Opportunity:** Drop them from the contract + scaffold, or give them a consumer (e.g. a diagnostics dashboard). If kept, validate them in the compiler.

#### O7. Dedup `domains` vs `intent_signals` before lexical scoring
- **Dimensions:** optimization · effectiveness
- **Source findings:** F2.5, F4.3
- **Evidence:** `lexical.ts:68-69` (both in same `scoreTokenOverlap` call); sk-code 8/28 domains also in intent_signals.
- **Gap:** Shared tokens double-count in the lexical lane, distorting scores toward skills with overlapping domains+intent_signals.
- **Opportunity:** Dedup the two arrays (and derivedKeywords) before scoring, or document the intended double-count as a feature.

#### O8. Reconsider file paths as `derivedKeywords`
- **Dimensions:** effectiveness
- **Source findings:** F4.4
- **Evidence:** `projection.ts:216-221` (derivedKeywords = key_topics+entities+key_files+source_docs); `derived.ts:62-87` (tokenized into overlap).
- **Gap:** File paths tokenize into generic tokens ("skills","opencode","SKILL","md") shared across nearly every skill, risking false cross-skill matches.
- **Opportunity:** Exclude path-only entries from derivedKeywords, or strip generic path vocabulary before scoring. (Confirm with the routing-accuracy corpus — O5.)

#### O9. Generate S-class `leaf-manifest.config.json` with defaults
- **Dimensions:** automation
- **Source findings:** F3.2
- **Evidence:** `sk-git/leaf-manifest.config.json` (workflowMode == skill_id, leafRoots defaultable); `generate-leaf-manifest.cjs:110` (leafRoots default ['references','assets']).
- **Gap:** A required authored file that is ~90% boilerplate.
- **Opportunity:** Generate it with defaults via `--fix`; require authoring only when overriding defaults.

#### O10. Auto-suggest `command-metadata.json` entries from `.opencode/commands/`
- **Dimensions:** automation
- **Source findings:** F3.3
- **Evidence:** `init_skill.py:603` (scaffolds `[]`); contract §3 (entries validated against registry + disk).
- **Gap:** Full burden is manual; a generator could stub entries from owned command definition files.
- **Opportunity:** Enumerate `.opencode/commands/<hub>/*.md` and emit stub entries (command, ownerMode, description), leaving userIntent/choreography for authoring.

#### O11. Add a skill-root rich `derived` template/generator
- **Dimensions:** automation
- **Source findings:** F3.5
- **Evidence:** `init_skill.py:287-293,540-557` (minimal derived); contract §6 templates cover top-level only.
- **Gap:** The rich `derived` shape is learned by copying existing skills; no template or `--enrich-derived` generator.
- **Opportunity:** Subsumed by O1 (the regenerator); a template is the scaffold-time complement.

#### O12. Drop or repurpose `derived.causal_summary`
- **Dimensions:** optimization
- **Source findings:** F2.2
- **Evidence:** `skill_graph_compiler.py:318-320` (validated); no advisor consumer (spec-folder backfill uses it for review flags, skill-root does not).
- **Gap:** Validated prose with no skill-root consumer.
- **Opportunity:** Drop from skill-root schema, or give it a consumer (e.g. advisor explainability/diagnostics). If O1 regenerator leaves it authored, document its purpose.

### Tier 3 — Lower leverage

#### O13. Increase `leaf-aliases.json` and `command-metadata.json` vitest coverage
- **Dimensions:** testing
- **Source findings:** F5.2
- **Evidence:** 1 vitest file for leaf-aliases, 2 for command-metadata (vs 9 mode-registry, 7 hub-router).
- **Opportunity:** Add targeted vitest fixtures for the two undertested class-required/generated files.

#### O14. Unify the dual signal source with a consistency gate
- **Dimensions:** optimization · effectiveness
- **Source findings:** F2.7
- **Evidence:** `skill_advisor.py:822-921` reads both graph-metadata `derived.trigger_phrases` and doc frontmatter `trigger_phrases`; sk-code has neither SKILL.md nor shared/references frontmatter trigger_phrases.
- **Opportunity:** A gate asserting at least one signal source is populated per skill and that the two do not contradict.

---

## 3. DIMENSION COVERAGE

| Dimension | Primary findings | Highest-leverage opportunity |
|-----------|------------------|------------------------------|
| Inventory/current-state | F1.1–F1.6 | (baseline; no gap — presence matrix conformant) |
| Optimization | F2.1, F2.2, F2.3, F2.4, F2.5, F2.7 | O1 (derived drift), O6 (dead fields), O7 (dedup) |
| Automation | F3.1, F3.2, F3.3, F3.5 | O1 (regenerator), O9 (leaf-manifest.config), O10 (command-metadata auto-suggest) |
| Effectiveness | F4.1, F4.3, F4.4, F4.5 | O3 (command-metadata ingested), O4 (signal coverage), O8 (path-keywords) |
| Testing/integration | F3.4, F5.1, F5.2, F5.3, F5.4, F5.5 | O2 (advisor compiler in CI), O5 (routing-accuracy in CI) |

All five dimensions addressed; every in-scope JSON type and pipeline script referenced (see §4).

---

## 4. JSON / PIPELINE SURFACE COVERAGE

| Surface | Covered in | Key finding |
|---------|-----------|-------------|
| graph-metadata.json | F1.4, F1.5, F2.1–F2.5, F3.1, F3.4, F4.1–F4.4, F5.1, F5.5 | O1/O2/O4 — derived drift, validation not in CI, signal variance |
| description.json | F1.2 | H-only, no production consumer (contract §3); spec-folder schema is separate |
| mode-registry.json | F1.2, F4.5 | consumed by compiled-route-manifest + advisor; drift-guard gated |
| hub-router.json | F1.2, F2.6 | consumed by compiled-route-manifest.cjs:405-420 (not dead) |
| leaf-manifest.json | F1.2, F1.6 | generated + freshness-gated (the model surface) |
| leaf-manifest.config.json | F1.2, F3.2 | O9 — 90% boilerplate, could be defaulted |
| leaf-aliases.json | F1.2, F5.2 | undertested (1 vitest) |
| command-metadata.json | F1.2, F3.3, F4.5, F5.2 | O3/O10 — gated but NOT ingested by advisor; undertested |
| advisor DB/index inputs | F1.5 | compiler emits signals from intent_signals + affordance triggers |
| intent-signal data | F4.1, F4.3, F4.4, F2.7 | O4/O7/O8 — variance, double-count, path-keywords, dual source |
| compiled-route-manifest | F2.6, F5.1 | compiled-route-guard.cjs gated in CI |
| watcher-ingested identity | F1.5, F5.5 | skill_advisor.py records invalid_derived issues (non-fatal) |
| init_skill.py | F1.3, F3.1, F3.5 | O1/O11 — minimal derived scaffold, no rich template |
| generate-leaf-manifest.cjs | F1.3, F3.2 | O9 — defaults leafRoots |
| generate-description.js | F1.3 | spec-folder generator (schema confusion risk, F1.3) |
| backfill-graph-metadata.js | F1.3, F2.4, F3.1 | spec-folder regenerator; skill-root has no analog (O1) |
| ci-skill-root-metadata.cjs | F1.3, F3.4, F5.1 | identity-only on graph-metadata; --fix = leaf-manifest only |
| ci-leaf-manifest-freshness.cjs | F1.3, F5.1 | leaf-manifest freshness; no derived equivalent |
| compiled-route-manifest.cjs | F1.3, F2.6 | consumes hub-router + mode-registry |

---

## 5. CROSS-DIMENSION CLUSTERS

- **Derived-regenerator cluster (O1/O2/O11):** spans optimization (drift), automation (hand-maintenance), testing (freshness + CI validation). The single highest-leverage theme: the skill-root `derived` block is the densest, most drift-prone, least-automated, least-CI-validated surface.
- **Command-data cluster (O3/O10):** spans effectiveness (data not driving routing) and integration (parallel hardcoded source). command-metadata.json is the clearest case of "gated but not consumed."
- **Signal-quality cluster (O4/O7/O8/O14):** spans effectiveness and optimization. The scoring lanes consume the JSON, but coverage is uneven, overlapping, and includes path-noise — and the corpus to measure it (O5) is offline.

---

## 6. CONFIDENCE AND LIMITATIONS

- **High confidence:** presence matrix (F1.2, enumerated); consumer map (F1.5, F4.2, read from compiler + scorer); CI map (F5.1, workflow read); command-metadata-not-ingested (F4.5, grep + read); no skill-root derived regenerator (F2.4/F3.1, confirmed no writer except init_skill.py).
- **Medium confidence:** F4.4 false-match impact (inferred from tokenization, not a routing-accuracy regression — would be confirmed by O5); F4.1's routing-quality effect (variance is measured, the score distortion is inferred from lane structure); fleet-wide evenness of the dual signal source (F2.7, sk-code is one sample).
- **Single-lineage view:** this is the glm-high lineage only. Cross-lineage agreement (sol-high, grok-high) will raise confidence on the Tier-1 findings; single-lineage claims are flagged as such for the cross-lineage synthesis.
- **Non-goals respected:** no implementation, no advisor scoring redesign, no H/S contract change proposed.

## 7. REFERENCES

- Contract: `.opencode/skills/sk-doc/create-skill/references/shared/skill-root-metadata-contract.md`
- Advisor compiler: `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py`
- Advisor scorer: `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/{projection.ts,lanes/lexical.ts,lanes/derived.ts}`
- Fleet gate: `.opencode/skills/sk-doc/create-skill/scripts/ci-skill-root-metadata.cjs`
- CI: `.github/workflows/routing-registry-drift.yml`
- Scaffolder: `.opencode/skills/sk-doc/create-skill/scripts/init_skill.py`
- Per-iteration evidence: `iterations/iteration-001.md` … `iteration-005.md`
