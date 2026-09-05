# Iteration 008: Fixtures And Wrapper Boundaries

## Dispatcher
- Executor: inline detached OpenCode lineage, `cli-opencode model=llmgateway/gpt-5.6-luna`.
- Write surface: lineage directory only.
- Budget profile: scan.

## Files Reviewed
- `.opencode/skills/system-spec-kit/runtime/cli/tests/workflow-invariance.vitest.ts:48-84`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/README.md:1-42`
- `.opencode/skills/system-spec-kit/runtime/cli/test-fixtures/README.md:1-40`
- `.opencode/skills/system-spec-kit/runtime/scripts/README.md:1-90`
- `.opencode/skills/system-spec-kit/runtime/scripts/finalize-dist.mjs:1-120`
- `.opencode/skills/system-spec-kit/runtime/vitest.stress.config.ts:12-33`
- `.opencode/skills/system-spec-kit/runtime/cli/tests/test-embeddings-factory.cjs:13-31`
- `.opencode/skills/system-spec-kit/runtime/cli/continuity/README.md:75-90`
- `implementation-summary.md:279-319`

## Findings - New
### P1 Findings
1. **Fixture and wrapper-boundary correctness is source-evidenced but not replayed** -- `.opencode/skills/system-spec-kit/runtime/cli/tests/workflow-invariance.vitest.ts:48-84` -- fixture roots and legacy-phase cleanup allowlists deliberately distinguish current `runtime/cli` paths from historical vocabulary, while runtime stress config excludes CLI tests. The packet's claim that the complete moved suite is green cannot be independently confirmed here.
- Finding class: test-isolation
- Scope proof: Direct reads of fixture roots, allowlist logic, stress exclusions and wrapper README.
- Affected surface hints: ["fixture classification", "runtime stress config", "wrapper boundary"]
- Claim adjudication: {"type":"claim-adjudication","claim":"Fixture and wrapper-boundary tests cover the nested layout without swallowing current failures","evidenceRefs":["runtime/cli/tests/workflow-invariance.vitest.ts:48-84","runtime/vitest.stress.config.ts:15-21"],"counterevidenceSought":"Read current fixture roots, allowlists and stress excludes; no source contradiction found.","alternativeExplanation":"Tests may classify paths correctly while failing due to stale target packets or generated artifacts.","finalSeverity":"P1","confidence":0.82,"downgradeTrigger":"Authorized execution records the workflow-invariance, fixture and stress suites passing or documents exact unrelated failures."}

### P2 Findings
1. **Historical fixture vocabulary is not consistently marked as historical** -- `.opencode/skills/system-spec-kit/runtime/cli/tests/fixtures/README.md:1-3` -- the document title and description call the current package `scripts/tests`, while its body correctly names `runtime/cli/tests`. Similar mixed vocabulary appears in continuity and rules diagrams.
- Finding class: cross-consumer
- Scope proof: Direct reads across fixture, continuity, core and rules READMEs, with intentional external `sk-doc/scripts` references excluded.
- Affected surface hints: ["fixture README", "current package docs", "historical labels"]

## Traceability Checks
| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| spec_code | partial | hard | `workflow-invariance.vitest.ts:48-84` | Fixture cleanup rules describe current and legacy surfaces. |
| checklist_evidence | partial | hard | `implementation-summary.md:279-319` | Review dispositions are recorded, but no fresh replay. |
| feature_catalog_code | partial | advisory | `runtime/scripts/README.md:1-90` | Runtime wrapper remains distinct from CLI, but docs need sharper boundary labels. |
| playbook_capability | partial | advisory | `tests/fixtures/README.md:1-42` | Fixture docs mix current and retired names. |

## Integration Evidence
- `runtime/vitest.stress.config.ts:15-21` excludes `runtime/cli/tests/**`, keeping CLI tests in the CLI project.
- `runtime/scripts/README.md` describes the remaining runtime build-tooling directory, confirming it is not the moved CLI.

## Edge Cases
- Fixture-local `memory/` directories model packet data and are not evidence that the workspace rename was incomplete.
- The `scripts/` label in `sk-doc/sk-code` validation command paths refers to other skills and is not a local stale path.

## Confirmed-Clean Surfaces
- Workflow-invariance roots include `runtime/cli/tests/fixtures` and not the retired top-level `scripts` workspace at `workflow-invariance.vitest.ts:49-56`.
- Stress config explicitly excludes CLI tests at `runtime/vitest.stress.config.ts:19-21`.

## Ruled Out
- CLI tests accidentally included in runtime stress config: ruled out by the explicit `runtime/cli/tests/**` exclusion.

## Next Focus
- dimension: traceability
- focus area: generated metadata freshness, completion fingerprint and placeholder evidence
- reason: review final generated/current-state boundary before stabilization passes
- rotation status: new angle
- blocked/productive carry-forward: fixture source review productive; test replay pending
- required evidence: graph metadata, description metadata, continuity fingerprint and scaffold markers
- recovery note: none

Review verdict: CONDITIONAL
