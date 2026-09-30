# Resource Map — SWE Lineage, Classifier Round 3

Lineage `swe` in `007-classifier-deep-research`. Produced at synthesis from the ten iteration deltas. Paths are repo-relative; each row names what the lineage read or produced.

## Primary sources opened

| Path | Used by |
|---|---|
| `context/deem-main/serve/deem_server.py` | iteration 1 (handlers, envelope, error taxonomy via deepseek-01's opened lines) |
| `context/deem-main/serve/deem_mcp.py`, `context/deem-main/serve/README.md` | iteration 1 (MCP apart, env/model-id default) |
| `context/deem-local.md` | all iterations (measured 0.8B facts: 60 ms p50, ~10 s cold, deem-ctl update swaps) |
| `~/.local/share/deem/bin/deem-ctl` | iteration 1 (lifecycle contract; audited, never executed) |
| `context/jev-cli-main/src/jev_cli/__init__.py` | iteration 1 (providers, request shapes, exit map) |
| `.skilled/skills/cli-jev/cli-usage/` (SKILL.md, docs) | iterations 1, 7 (transport contract, hub template) |
| sk-doc validator tools + five naming scripts | iteration 2 (16-check map, residue ranking) |
| `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs`, `compiled-route.cjs` | iteration 3 (three identity gates, normalized route result) |
| six active `ROUTER.md` files (`sk-code`, `sk-doc`, `sk-design`, `system-deep-loop`, `mcp-tooling`, `cli-external-orchestration`; `cli-jev` stage1-only) | iteration 3 (RESOURCE_MAP pattern) |
| `005-compaction-recall-harness/spec.md`, `score-compaction-recall.mjs` design, `vendored compact.ts` | iteration 4 (census contract, deletion-arm blueprint) |
| `.claude/settings.json` hook deadlines | iteration 4 (1.8 s internal / 3 s host PreCompact) |
| sk-prompt + sk-design SKILL.md INTENT_MODEL blocks + scenario files | iteration 5 (embedded scorers, tie counts) |
| `.skilled` `file:line` citation census (456), `description:` census (3,551) | iterations 2, 6 |
| `skill-root-metadata-contract.cjs` (`OVERLAY_FILES={}`), `cli-jev/` tree, `leaf-manifest.json` shapes | iteration 7 (hub file contract) |
| `002-advisor-jev-tiebreak-arm/spec.md` REQ-001/002/004–011; `003`/`006` spec gates; BASE1 row 27 | iterations 8–10 (gate text, caller census, PR slice) |
| BASE2 `004-deep-research-expansion/research/research.md` §9 (order/cost/kills), §11 (gate contract), §13 (phase tables) | iterations 8–10 |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/` (`labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `scorer-eval-baseline.json`, `capture-scorer-eval-baseline.mjs`) | iteration 10 (first PR fixtures) |

## Sibling artifacts read

| Path | Used by |
|---|---|
| `deepseek/iterations/iteration-001.md` … `010.md` | iterations 4–10 (probe contract, deem-ctl audit, failure table, amendments, order) |
| `deepseek/research.md` | synthesis (template + cross-check) |
| `grok/iterations/iteration-005.md`, `009.md`, `010.md` | iterations 5, 9, 10 (cost claims, no-new-phase order) |
| `glm/iterations/iteration-001.md` … `005.md` | iterations 7–9 (second-scorer proposal, D2/D3 rule) |
| `mimo/iterations/iteration-001.md` … `004.md` | iterations 4–9 (partial; lineage stopped at 4) |
| round-2 lineages under `../004-deep-research-expansion/research/lineages/` | phase_init (artifact conventions) |

## Artifacts produced (this lineage)

| Path | Content |
|---|---|
| `iterations/iteration-001.md` … `010.md` | ten bounded-focus iterations |
| `deltas/iter-001.jsonl` … `iter-010.jsonl` | finding/ruled-out records |
| `deep-research-state.jsonl` | binding, init, iteration, loop, telemetry, synthesis events |
| `research.md`, `findings-registry.json`, `resource-map.md` | synthesis |
| `deep-research-config.json`, `deep-research-strategy.md`, `invocation-metadata.json` | phase_init |

## Proposed (not built) code surfaces named by the lineage

| Path | Slice |
|---|---|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs` (+vitest) | first PR (swe-10) |
| `.skilled/skills/cli-deem/` (`deem-client.mjs`, `wire-format.md`, fixtures, tests) | PR #2 (swe-01/09) |
| `.skilled/bin/backend-probe.cjs` | extraction at third built caller (swe-08) |
| `.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/` arm | 005 amendment (swe-04) |
| `sk-doc/shared/scripts/leaf-route-replay.cjs`, cite-drift sibling script | lineage slices (swe-03/06) |
| `.skilled/skills/cli-classifier/` hub tree | deferred to second transport packet (swe-07) |
