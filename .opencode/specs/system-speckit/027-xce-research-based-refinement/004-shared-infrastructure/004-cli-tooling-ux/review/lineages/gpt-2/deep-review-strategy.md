# Deep Review Strategy

## Topic
Fan-out lineage review of `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux` with artifact root bound directly to `review/lineages/gpt-2`.

## Review Dimensions
| Dimension | Status | Iterations | Verdict |
| --- | --- | ---: | --- |
| correctness | complete | 1, 6 | CONDITIONAL |
| security | complete | 2, 6 | PASS with advisory |
| traceability | complete | 3, 5, 6 | PASS with advisory |
| maintainability | complete | 4, 6 | PASS |

## Completed Dimensions
| Dimension | Evidence |
| --- | --- |
| correctness | Freshness gate and build-script replay found F001. |
| security | Bridge allowlist review found F002. |
| traceability | Spec-to-playbook replay found F003. |
| maintainability | CLI compact/completion paths and unified reference reviewed without new maintainability findings. |

## Running Findings
| Severity | Count | Active IDs |
| --- | ---: | --- |
| P0 | 0 | none |
| P1 | 1 | F001 |
| P2 | 2 | F002, F003 |

## What Worked
- Source-level replay of shim freshness gates against package build scripts exposed the only required fix.
- Direct spec-to-playbook comparison found documentation drift not visible from implementation summaries alone.
- Fallback read path was used because code graph readiness reported stale state.

## What Failed
- Code graph structural queries were not used for final evidence because graph readiness was stale.
- No live smoke command was executed to avoid writing outside the requested lineage artifact directory.

## Exhausted Approaches
- Re-checking the three `list-tools` compact renderers found no evidence of schema leakage in compact/names-only JSON.
- Re-checking unified CLI reference and SKILL notes found the `jsonl` single-payload documentation present.

## Ruled-Out Directions
- Treating F002 as P1 was ruled out because the independent request/tool allowlist still limits execution to read-oriented prompt-safe tools.
- Treating F003 as P1 was ruled out because the unified smoke exists and the drift is confined to the older playbook scenario.

## Next Focus
Remediate F001 first, then tighten the bridge route-pair policy and update the parity playbook to point at `node .opencode/bin/cli-offline-smoke.cjs --format json`.

## Known Context
- Parent packet is a phase parent for daemon CLI UX hardening across five child phases.
- `resource-map.md` was not present in the target spec folder. Skipping coverage gate.
- `code_graph_status` returned stale readiness: git HEAD changed and stale files exceeded the selective threshold, so review citations are based on direct file reads.

## Cross-Reference Status
| Protocol | Gate | Status | Evidence |
| --- | --- | --- | --- |
| spec_code | hard | partial | F003 shows a scoped spec file target not reflected in the playbook. |
| checklist_evidence | hard | partial | Implementation summary claims smoke wraps playbook, but playbook still has old commands. |
| feature_catalog_code | advisory | pass | Compact/names-only code paths exist in all three CLIs. |
| playbook_capability | advisory | partial | Unified reference points to smoke, old playbook does not. |

## Files Under Review
| File | Coverage | Notes |
| --- | --- | --- |
| `.opencode/bin/spec-memory.cjs` | sampled | Spec-memory hash state has build finalizer coverage. |
| `.opencode/bin/code-index.cjs` | reviewed | F001 evidence. |
| `.opencode/bin/skill-advisor.cjs` | reviewed | F001 evidence. |
| `.opencode/bin/cli-offline-smoke.cjs` | reviewed | Smoke command exists and is daemon-free by construction. |
| `.opencode/skills/system-spec-kit/mcp_server/spec-memory-cli.ts` | reviewed | Compact/completion/help paths checked. |
| `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts` | reviewed | Compact/completion/help paths checked. |
| `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts` | reviewed | Compact/completion/help paths checked. |
| `.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs` | reviewed | F002 evidence. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/tooling-and-scripts/cli-list-tools-parity.md` | reviewed | F003 evidence. |

## Review Boundaries
- Max iterations: 6.
- Artifact root override was bound directly; no artifact-root resolver command was run.
- Writes were limited to `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/016-cli-tooling-ux/review/lineages/gpt-2`.
- Target files were read-only.

## Non-Goals
- No code fixes were implemented.
- No build, smoke, or test command was run because those commands can update freshness metadata or temp state outside this lineage.

## Stop Conditions
- Stopped at `config.maxIterations` with one active P1 and two active P2 findings.
