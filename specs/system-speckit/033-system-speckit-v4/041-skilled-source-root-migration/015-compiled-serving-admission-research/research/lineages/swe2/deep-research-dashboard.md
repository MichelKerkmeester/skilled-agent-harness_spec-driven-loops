# Deep-Research Dashboard — swe2 lineage

**Topic:** How should a new parent hub be admitted to compiled-serving now that the Lane C parity harness is retired?
**Session:** `fanout-swe2-1789762218897-56yqt6` | **Executor:** cli-devin / swe-2-max | **Mode:** research (detached fan-out lineage)

## Status: COMPLETE — stopReason: `maxIterationsReached`

| Iteration | Focus | newInfoRatio | Status | Key output |
|---|---|---|---|---|
| 1 | Retired Lane C parity modules at `b45ea54cea3^` (Q1) | 0.95 | complete | Parity = compiled-vs-legacy-replay via frozen scorer; restore census (4 named + 6 supporting modules, 268-file lane) |
| 2 | `compiledRoute()` vs scenario gold feasibility (Q2) | 0.90 | complete | Bridge exists + verified live; granularity rule; defer/holdout/negative semantics; semantic-bar delta named |
| 3 | Admission machinery — cohort tables, manifest, guard (Q3) | 0.92 | complete | 6 hardcoded cohort sites; mint/refresh/flip lifecycle; flip scorer gate stale; hook auto-remint |
| 4 | Cost/risk ledger per path (Q4) | 0.85 | complete | A~3700 lines vs B~500-800 vs C~0; archived verdicts all-7/0-drift/258/258/47/47; canary corpus 67 cases smoke-only |
| 5 | Recommendation + build steps (Q5) | 0.55 | complete | Path B recommended; redefinition recorded; completeness-gate design; runbook + doc fixes |

## Metrics

- **Iterations:** 5/5 (max-iterations policy; convergence telemetry-only — no early synthesis)
- **newInfoRatio rolling avg:** 0.83 (trend 0.95 → 0.90 → 0.92 → 0.85 → 0.55)
- **Questions:** 5/5 resolved (Q1–Q5) + 2 cross-cutting findings + 4 open follow-ups for build phase
- **Findings:** 39 across 5 deltas
- **Source diversity:** retired modules @`b45ea54cea3^`, live runtime reads + executions, authored spec-tree tooling, advisor runtime, playbook gold census, archived verdict reports, git history

## Headline result

**Recommend Path B:** a new checker of `compiledRoute()` decisions against authored routing gold (~500–800 lines on live deps), with the bar redefinition recorded and three named mitigations (playbook corpus required, corpus-completeness gate, loud shared-gold-gap findings). Restore only if the bar must stay literally `== legacy replay`; keep-closed only with an explicit cohort-frozen decision.

**Topology correction:** the admitted cohort is **five** hubs (sk-design dissolved `f931ba2e14`, sk-prompt retired `a9286399bc3`); "seven hubs" in docs is stale.

## Artifacts

- `research.md` — canonical synthesis (Q1–Q5 + ranked recommendation)
- `resource-map.md` — source inventory by category
- `findings-registry.json` — resolved questions + follow-ups
- `iterations/iteration-001..005.md` + `deltas/iter-001..005.jsonl`
- `deep-research-state.jsonl` — append-only event log incl. `phase_synthesis` record
- `deep-research-strategy.md`, `deep-research-config.json`, `BINDING.md`

## Write containment

All artifacts under `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/015-compiled-serving-admission-research/research/lineages/swe2`. No writes outside the lineage; no `resolveArtifactRoot`, `generate-context.js`, `validate.sh`, or git write commands executed.
