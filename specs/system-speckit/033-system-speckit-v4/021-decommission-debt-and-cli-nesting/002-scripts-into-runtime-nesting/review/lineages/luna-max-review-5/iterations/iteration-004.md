# Iteration 004: Maintainability, Documentation And Registry Surfaces

## Focus
Review moved-package READMEs, script registry entries, catalog claims and operator-facing topology references.

## Sources Reviewed
- `.opencode/skills/system-spec-kit/runtime/cli/README.md:56-99,115-138,190-200`
- `.opencode/skills/system-spec-kit/runtime/cli/spec/README.md:15-25,55-77,94-110`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/README.md:16-39,69-99`
- `.opencode/skills/system-spec-kit/runtime/cli/config/README.md:12-49`
- `.opencode/skills/system-spec-kit/runtime/cli/validation/README.md:14-38,80-111`
- `.opencode/skills/system-spec-kit/runtime/cli/evals/README.md:17-45,81-107`
- `.opencode/skills/system-spec-kit/runtime/cli/resource-map/README.md:7-31`
- `.opencode/skills/system-spec-kit/runtime/cli/kpi/README.md:17-43,87-92`
- `.opencode/skills/system-spec-kit/runtime/cli/ops/README.md:13-28,68-74`
- `.opencode/skills/system-spec-kit/runtime/cli/sweep/README.md:10-30,34-46`
- `.opencode/skills/system-spec-kit/runtime/cli/scripts-registry.json:8-23,318-394`

## Findings
### P1, Maintainability
- **F007**: Multiple persistent READMEs under `runtime/cli/` still call the moved package `scripts/` and retain retired topology links. Examples include `spec/README.md:17,58,72,105`, `tests/README.md:18,32,71`, `config/README.md:14,43-49`, `validation/README.md:16,105`, `resource-map/README.md:9,28`, `kpi/README.md:19-43,90`, `ops/README.md:15,72-74` and `evals/README.md:19,33`.

### P2, Maintainability
- **F008**: `scripts-registry.json:19,22,218,338-377,387-389` mixes current `runtime/cli` paths with stale package-internal dependency names and memory vocabulary.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | partial | hard | `runtime/cli/README.md:56-99`; `scripts-registry.json:8-23` | Root topology is current, subordinate docs are not. |
| checklist_evidence | partial | hard | `acceptance-criteria.md:60-63`; `implementation-summary.md:136-155` | Broad summary does not enumerate stale subordinate pages. |
| feature_catalog_code | partial | advisory | `feature-catalog/tooling-and-scripts/spec-folder-detection-and-description.md:44-54` | Catalog paths are mostly current. |
| playbook_capability | fail | advisory | `runtime/cli/tests/README.md:69-99` | Operator docs mix current commands with retired topology. |

## Assessment
- New findings ratio: 0.70
- Dimensions addressed: maintainability, traceability
- Novelty justification: the stale-topology issue was expanded from isolated docs to maintained registry and operator pages.

## Ruled Out
- Root CLI README main topology: current at `README.md:58-98`.
- Historical changelog residue: not admitted in this pass.

## Recommended Next Focus
Review generated source/dist alignment, runtime build boundaries and test harness path assumptions.

Review verdict: CONDITIONAL
