# Iteration 5: Testing & Integration — Coverage, Chain Breaks, Failure Modes

## Focus
Per-JSON test/CI coverage map, the end-to-end scaffold→gate→advisor-ingest→routing chain, whether routing-accuracy fixtures gate JSON regressions, and failure modes for malformed/absent graph-metadata.

## Findings

### F5.1 — CI coverage map: one workflow gates skill JSON; advisor compiler NOT in CI
Exactly one CI workflow references the skill-JSON gates: `.github/workflows/routing-registry-drift.yml`. Its steps:
1. drift-guard + parity vitest suites (routing-registry-drift-guard, routing-parity-deep-skills, routing-parity-deep-council)
2. `compiled-route-guard.cjs` (compiled-routing freshness)
3. `parent-skill-check.cjs` per hub (one identity, registry coverage)
4. `ci-skill-root-metadata.cjs` + `ci-leaf-manifest-freshness.cjs` (fleet gate)

It does NOT run `skill_graph_compiler.py --validate-only` or any advisor-rebuild/validate. So the graph-metadata `derived` schema + path-existence validation (skill_graph_compiler.py:294-394) is NOT in CI. A malformed `derived` block or broken `derived.key_files` path passes CI and only surfaces at an offline advisor rebuild. This confirms the F3.4 integration gap end-to-end.
[SOURCE: .github/workflows/routing-registry-drift.yml (full); skill_graph_compiler.py:294-394]

### F5.2 — Per-JSON test coverage is uneven; leaf-aliases and command-metadata undertested
Vitest files referencing each JSON type (across .opencode/skills):
| JSON type | vitest files |
|-----------|-------------|
| description.json | 145 (mostly spec-folder schema, not skill-root) |
| graph-metadata.json | 77 (mixed spec-folder + skill-root) |
| mode-registry.json | 9 |
| hub-router.json | 7 |
| leaf-manifest.json | 5 |
| command-metadata.json | 2 |
| leaf-aliases.json | 1 |
[SOURCE: find .opencode/skills -name "*.vitest.ts" | xargs grep -l <type>]

Caveat: the description/graph-metadata counts are inflated by spec-folder continuity-schema tests (the separate schema per the contract §1 warning). The skill-root-specific test coverage for leaf-aliases.json (1 file) and command-metadata.json (2 files) is thin relative to their class-required status. command-metadata.json has a schema validator (command-metadata-schema.cjs) run by the fleet gate, but only 2 vitest files target it.
[SOURCE: contract §1 note on separate schemas; command-metadata-schema.cjs]

### F5.3 — routing-accuracy corpus is offline, not CI-gated
A routing-accuracy corpus exists: 195 labeled + 72 holdout + 24 ambiguity prompts (`mcp-server/scripts/routing-accuracy/*.jsonl`) plus `score-routing-corpus.py`, `scorer-eval-baseline.json`, and build/capture/rerank scripts. These could detect routing-quality regressions from JSON changes (e.g. F4.4 path-keyword false matches, F4.1 thin-signal skills losing routes). But `score-routing-corpus.py` / the routing-accuracy scripts are NOT in `routing-registry-drift.yml` — only the parity vitest suites run in CI. So routing-accuracy is an offline eval, not a gate; JSON-driven routing regressions are not blocked by CI.
[SOURCE: routing-accuracy/ dir listing; routing-registry-drift.yml steps (no score-routing-corpus.py)]

### F5.4 — End-to-end chain breaks (integration gaps)
The scaffold→gate→advisor-ingest→routing chain has three confirmed breaks:
1. **Derived schema validation not in CI** (F3.4/F5.1): fleet gate does graph-metadata identity-only; advisor compiler (full derived schema + path existence) runs only offline.
2. **command-metadata.json not ingested by advisor** (F4.5): the fleet gate validates command-metadata schema, but the advisor routes commands via hardcoded `COMMAND_BRIDGES` (projection.ts:58-145). The drift-guard asserts `mode-registry == advisor maps`, NOT `command-metadata == COMMAND_BRIDGES` — so command-metadata↔COMMAND_BRIDGES drift is ungated.
3. **No `derived` freshness gate** (F2.4/F3.1): leaf-manifest has a freshness gate (ci-leaf-manifest-freshness.cjs); graph-metadata `derived` has none, so the derived block drifts silently as the corpus evolves.
[SOURCE: routing-registry-drift.yml drift-guard comment; projection.ts:58-145; ci-leaf-manifest-freshness.cjs exists, no graph-metadata-derived freshness equivalent]

### F5.5 — Failure mode: malformed/absent graph-metadata is "silent until advisor rebuild"
- Absent graph-metadata.json → caught by fleet gate as MISSING_REQUIRED_FILE (CI fails). Good.
- Nested second identity → caught as NESTED_IDENTITY. Good.
- Present but malformed `derived` (bad key_files path, missing causal_summary, non-array trigger_phrases) → passes ci-skill-root-metadata (identity-only check), passes CI; fails only at `skill_graph_compiler.py` validate/rebuild, which is offline. Failure mode is silent-in-CI, loud-at-rebuild.
- Absent `derived` entirely → compiler emits "schema_version 2 requires a 'derived' object" (skill_graph_compiler.py:310-311), but again offline.
So the failure-mode asymmetry is: presence is fail-fast in CI; content-quality is fail-slow at offline rebuild. The advisor's own ingestion (skill_advisor.py:912-921) records `invalid_derived` issues into a metadata-issues sink but does not hard-fail routing.
[SOURCE: ci-skill-root-metadata.cjs:131-137; skill_graph_compiler.py:294-396; skill_advisor.py:912-921]

## Sources Consulted
- .github/workflows/routing-registry-drift.yml (full)
- .github/workflows/ dir listing (11 workflows)
- find/vitest grep per JSON type
- routing-accuracy/ dir + wc -l on *.jsonl
- skill_graph_compiler.py:294-396, skill_advisor.py:912-921

## Assessment
- **newInfoRatio:** 0.75 — five testing/integration findings; F5.1 (CI map + advisor compiler absent), F5.3 (routing-accuracy offline), F5.4 (three chain breaks) are new. Lower ratio because F5.1/F5.4 consolidate earlier F3.4/F4.5 into the integration view rather than introducing wholly new surfaces.
- **Novelty justification:** First CI workflow trace, first per-JSON test-coverage count, first confirmation that routing-accuracy is offline-only and that the three chain breaks are ungated.
- **Confidence:** High on F5.1/F5.2/F5.3 (direct workflow read + counts + dir listing); High on F5.4 (consolidates confirmed F3.4/F4.5/F2.4); High on F5.5 (gate + compiler code read).

## Reflection
- **What worked:** Reading the full workflow revealed the fleet gate IS in CI (correcting an earlier inference) while pinpointing that the advisor compiler is the missing CI step.
- **What failed:** The description/graph-metadata vitest counts initially looked high; disambiguating spec-folder vs skill-root schema showed skill-root coverage is thinner than the raw count suggests.
- **Ruled out:** None new.

## Recommended Next Focus
Synthesis — rank all findings (F1.1–F5.5) into a single opportunity map by leverage across the five dimensions, marking cross-dimension clusters (the derived-regenerator gap spans optimization+automation+testing; the command-metadata-not-ingested gap spans effectiveness+integration).
