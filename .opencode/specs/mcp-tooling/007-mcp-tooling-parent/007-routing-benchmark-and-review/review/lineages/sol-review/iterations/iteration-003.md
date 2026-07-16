# Iteration 3: Traceability — metadata projections and acceptance evidence

## Focus

Bidirectional inventory alignment, benchmark-gate fidelity, graph metadata projections, operator playbook coverage, and the phase specification's acceptance chain after six-mode expansion.

## Files Reviewed

- `.opencode/skills/mcp-tooling/mode-registry.json`
- `.opencode/skills/mcp-tooling/hub-router.json`
- `.opencode/skills/mcp-tooling/description.json`
- `.opencode/skills/mcp-tooling/graph-metadata.json`
- `.opencode/skills/mcp-tooling/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skills/mcp-tooling/benchmark/baseline/skill-benchmark-report.json`
- `.opencode/skills/mcp-tooling/benchmark/baseline/skill-benchmark-report.md`
- phase `spec.md`, `plan.md`, and `tasks.md`

## Scorecard

- Dimensions covered: traceability
- Cross-reference protocols executed: 6
- New findings: P0=1 P1=2 P2=1
- New findings ratio: 1.00

## Findings

### P0

- **F008**: The committed baseline benchmark declares `PASS`, all 13 scenarios passed, and zero hub-route regressions while recording `routeGoldRows:0`; its own route telemetry shows MT-004 selecting all six modes, MT-003 selecting no Figma mode, and MT-H02 through MT-H06 selecting no intended mode. Seven route-contract violations therefore pass the designated deterministic CI gate. [SOURCE: .opencode/skills/mcp-tooling/benchmark/baseline/skill-benchmark-report.json:11] [SOURCE: .opencode/skills/mcp-tooling/benchmark/baseline/skill-benchmark-report.json:126] [SOURCE: .opencode/skills/mcp-tooling/benchmark/baseline/skill-benchmark-report.json:657]

### P1

- **F009**: The graph's derived intent projection remains three-mode, `.opencode/skills/mcp-tooling/graph-metadata.json:196`, omitting Aside, Refero, and Mobbin even though the root intent inventory and derived entities contain all six. Edge contexts and the causal summary also still describe “all three modes” and one Figma-only `sk-design` pairing. Consumers choosing the derived projection receive a different routable inventory from consumers choosing the root projection. [SOURCE: .opencode/skills/mcp-tooling/graph-metadata.json:67] [SOURCE: .opencode/skills/mcp-tooling/graph-metadata.json:278]
- **F010**: The target phase's spec/plan/tasks acceptance package still defines a three-mode benchmark, keeps the phase deferred, and says only a `.gitkeep` baseline exists, while a six-mode 13-scenario baseline is committed. It contains no acceptance coverage for Aside, Refero, or Mobbin and cannot trace the current six-mode routing expansion to requirements, tasks, or completion evidence. [SOURCE: .opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/spec.md:61] [SOURCE: .opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/plan.md:85] [SOURCE: .opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/tasks.md:53]

### P2

- **F011**: The hub manual-testing index still advertises only Chrome, ClickUp, Figma, and four scenarios, `.opencode/skills/mcp-tooling/manual_testing_playbook/manual_testing_playbook.md:3`, although `hub_routing/` now contains seven primary scenarios and six holdouts across all six modes. Operators following the index are not told the expanded capability and holdout surface exists.

## Claim Adjudication

```json
{"findingId":"F008","claim":"The committed routing benchmark can issue a PASS while seven scenario route expectations are violated because no route-gold rows are scored.","evidenceRefs":[".opencode/skills/mcp-tooling/benchmark/baseline/skill-benchmark-report.json:11-31",".opencode/skills/mcp-tooling/benchmark/baseline/skill-benchmark-report.json:89-126",".opencode/skills/mcp-tooling/benchmark/baseline/skill-benchmark-report.json:180-228",".opencode/skills/mcp-tooling/benchmark/baseline/skill-benchmark-report.json:657-1329",".opencode/skills/mcp-tooling/benchmark/baseline/skill-benchmark-report.md:1-60"],"counterevidenceSought":"Compared all 13 telemetry rows to the scenario frontmatter expectations and checked the benchmark's hard-gate, known-gap, and route-gold counters.","alternativeExplanation":"The score threshold may intentionally reward discovery/connectivity, but the report calls Mode A the deterministic CI gate and explicitly reports all routing scenarios passed.","finalSeverity":"P0","confidence":0.99,"downgradeTrigger":"Downgrade only if this report is proven non-gating and another committed gate fails the seven route mismatches.","transitions":[{"iteration":3,"from":null,"to":"P0","reason":"Acceptance report-to-telemetry adjudication"}]}
```

```json
{"findingId":"F009","claim":"graph-metadata exposes inconsistent six-mode root and three-mode derived routing projections.","evidenceRefs":[".opencode/skills/mcp-tooling/graph-metadata.json:7-30",".opencode/skills/mcp-tooling/graph-metadata.json:67-117",".opencode/skills/mcp-tooling/graph-metadata.json:196-218",".opencode/skills/mcp-tooling/graph-metadata.json:234-278"],"counterevidenceSought":"Compared root intent signals, derived trigger phrases, derived intent signals, entities, edge contexts, and causal summary.","alternativeExplanation":"A consumer could use only the root signals, but the file publishes the derived projection as first-class metadata and does not identify it as legacy.","finalSeverity":"P1","confidence":0.97,"downgradeTrigger":"Downgrade if all production consumers are demonstrated to ignore derived.intent_signals and the stale prose projections.","transitions":[{"iteration":3,"from":null,"to":"P1","reason":"Projection-to-projection inventory comparison"}]}
```

```json
{"findingId":"F010","claim":"The phase acceptance package does not specify or track the current six-mode routing surface.","evidenceRefs":[".opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/spec.md:61-148",".opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/plan.md:85-142",".opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/tasks.md:53-88",".opencode/skills/mcp-tooling/benchmark/baseline/skill-benchmark-report.md:1-60"],"counterevidenceSought":"Searched all phase requirements, success criteria, plan axes, and tasks for Aside, Refero, Mobbin, six-mode, and the committed baseline path.","alternativeExplanation":"The phase predates expansion, but it remains the active target for benchmark-and-review acceptance and has not been superseded in the provided scope.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade if a newer authoritative phase acceptance packet covering all six modes is linked as its superseding source.","transitions":[{"iteration":3,"from":null,"to":"P1","reason":"Spec-plan-task-to-code trace"}]}
```

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | fail | Phase requirements and success criteria cover only the original three modes and do not match the current six-mode router. |
| `checklist_evidence` | fail | All tasks remain unchecked; `router-final/` is absent; the committed baseline is untracked by the task paths and falsely passes route misses. |
| `skill_agent` | notApplicable | Target is a spec folder, not a skill-agent pair. |
| `agent_cross_runtime` | notApplicable | Target is not an agent runtime surface. |
| `feature_catalog_code` | partial | Registry/router key sets and every registry alias align, but graph derived metadata and registry discriminator prose retain three-mode projections. |
| `playbook_capability` | fail | The operator index omits three modes and nine scenarios; the committed baseline does not score route gold. |

Core traceability gate failures: 2 (`spec_code`, `checklist_evidence`).

## Assessment

- New findings ratio: 1.00
- Dimensions addressed: traceability
- Novelty justification: acceptance-gate blindness, graph projection drift, phase requirement drift, and playbook index drift are separate producer/consumer failures.

## Ruled Out

- Registry/router mode-key drift: all six keys align bidirectionally.
- Registry-alias/router-vocabulary drift: every registry alias is present in a vocabulary class referenced by its corresponding router signal.
- Advisor-facing description inventory drift: `description.json` names all six modes and all three design transports.

## Dead Ends

- Treating the baseline's aggregate 95/100 as route correctness: D1 intra is 78/100, and the report explicitly has zero route-gold rows despite observed telemetry.

## Next Focus

Maintainability and packet-local recall: execute every scenario in all six `intra_routing_recall` packs, then assess recurring vocabulary and gold-schema failure patterns.

Review verdict: FAIL
