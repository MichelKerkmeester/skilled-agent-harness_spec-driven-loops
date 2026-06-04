# Deep Review Strategy

## Topic
Interconnected MCPs review slice: system-code-graph, system-skill-advisor, and deep-loop-runtime contracts with system-spec-kit.

## Review Dimensions
- [x] correctness: fan-out pool/worker behavior reviewed
- [x] security: executor sandbox and write-boundary behavior reviewed
- [x] traceability: spec-to-code and command contracts reviewed
- [x] maintainability: docs, tests, fallback contracts, and drift surfaces reviewed

## Completed Dimensions
| Dimension | Iteration | Verdict | Notes |
|---|---:|---|---|
| correctness | 1 | CONDITIONAL | Found serialized CLI fan-out despite concurrency cap. |
| security | 2 | CONDITIONAL | Found prompt-only artifact boundary while CLI permissions allow broader writes. |
| traceability | 3 | CONDITIONAL | Found per-lineage iterations contract not propagated into loop prompt/config. |
| maintainability | 4 | PASS | Found P2 docs/fallback drift. |
| stabilization | 5 | CONDITIONAL | No new findings; active P1s remain. |

## Running Findings
| Severity | Active | Delta |
|---|---:|---:|
| P0 | 0 | 0 |
| P1 | 3 | 0 |
| P2 | 2 | 0 |

## Files Under Review
| File | Coverage | Notes |
|---|---|---|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | full | Findings F001, F002, F003. |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs` | full | Pool primitive works for async workers; injected worker breaks overlap. |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-config.ts` | full | Findings F002, F003. |
| `.opencode/skills/deep-loop-runtime/SKILL.md` | partial | Runtime script ownership checked. |
| `.opencode/skills/system-code-graph/SKILL.md` | partial | Tool IDs and fallback contract checked. |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` | partial | Tool IDs match command references. |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/index.ts` | partial | Advisor tool dispatch IDs match reference. |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts` | partial | Skill graph public/internal IDs checked. |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | partial | CLI executor dispatch, artifact override, and sandbox handling checked. |
| `AGENTS.md` | partial | Graph unavailable fallback contract checked. |

## Cross-Reference Status
| Protocol | Level | Status | Evidence |
|---|---|---|---|
| spec_code | core | partial | Required fan-out and executor-config concerns mapped to F001-F003. |
| checklist_evidence | core | pass | No checklist exists in the Level 1 slice. |
| feature_catalog_code | overlay | partial | Fan-out docs exist but runtime overlap and loop-bound tests are missing. |
| playbook_capability | overlay | partial | Pool primitive has concurrency tests; fanout-run subprocess overlap does not. |
| skill_agent | overlay | not applicable | No runtime agent parity issue found for this slice. |
| agent_cross_runtime | overlay | not applicable | No agent target in this review. |

## Known Context
- `resource-map.md` was not present at init; skipping the resource-map coverage gate.
- Startup context reported Code Graph unavailable, so review used exact `rg` discovery plus direct reads.
- User supplied `config.fanout_lineage_artifact_dir`; artifact_dir was bound directly to the override.

## What Worked
- Comparing `fanout-pool.cjs` with the injected worker in `fanout-run.cjs` exposed the event-loop blocking bug cleanly.
- Cross-checking `executor-config.ts` docs against `buildLoopPrompt()` separated timeout sizing from actual loop-bound propagation.
- Tool ID audit found the code-graph and skill-advisor MCP tool names stable.

## What Failed
- Code Graph MCP was unavailable in session startup, so structural graph queries were not available.
- No live CLI fan-out test was run because this lineage is read-only and must not mutate outside its artifact directory.

## Exhausted Approaches
- No deeper skill-advisor tool ID finding was supported after checking tool descriptors, dispatcher, server registration, and reference docs.
- No P0 was supported: the active issues break runtime contract and safety posture, but do not corrupt review data by themselves.

## Ruled-Out Directions
- Treating the missing runtime `reduce-state.cjs` as a runtime bug was rejected; deep-loop-runtime documents that reducer ownership remains in `deep-review`.
- Treating code-graph fallback drift as P1 was rejected; it is operator guidance conflict, not a failing handler path.

## Next Focus
Synthesis complete. Remediation should focus on replacing `spawnSync` in fanout-run, propagating per-lineage max iterations into the loop prompt/config, and enforcing artifact-bound write permissions in CLI fan-out.

## Review Boundaries
- Max iterations: 7
- Completed iterations: 5
- Severity threshold: P2
- Target files stayed read-only.
