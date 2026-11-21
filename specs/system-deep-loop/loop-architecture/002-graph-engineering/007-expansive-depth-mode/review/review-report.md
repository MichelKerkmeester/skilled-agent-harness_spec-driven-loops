# Review Report: rounds 5 and 6 of the deep-loop runtime (fan-out, generation 1 of this root)

## 1. Executive Summary

- **Verdict: FAIL.** hasAdvisories: false.
- Counts the verdict used, from `fanout-merge.cjs` and `review-verdict.cjs`: P0 0, P1 2, P2 19,
  search debt 0, failed required gates `coverage` and `scope`. No P0 is open. The FAIL comes from the
  two failed gates in the opus lineage's terminal stop, not from a finding severity.
- Self-check outcomes (fan-out root, recorded for reference only, nothing appended):
  `OPUS-F003-P1-002 P1` confirmed, `OPUS-F003-P1-001 P1` confirmed. The conductor reproduced
  OPUS-F003-P1-001 live: after a `--stop`, `orchestration-summary.json` still listed both stopped
  lineages as `running`, and the runner's own `stopped` row carries no label.
- Review scope: `17a9ddbcb68..555487146e2 -- .skilled/skills/system-deep-loop .skilled/commands/deep`
  (88 files, 5,079 insertions, 364 deletions), seeded as six depth-1 nodes and dealt round-robin:
  opus F-1-001 (fan-out trust), F-1-003 (stop and status), F-1-005 (blocked stop and dry run); deepseek
  F-1-002 (adapter contract and sandbox), F-1-004 (gateway identity), F-1-006 (docs and contracts).
- Lineages: opus (`cli-claude-code`, `claude-opus-5-5`, medium) `succeeded`, 24 iterations, stop
  `maxIterationsReached`; deepseek (`cli-opencode`, `llmgateway/deepseek-v4.1-flash-1017`, max)
  `failed` (`stamped_after_completion`) after 16 iterations and its own `converged` stop. The merge still
  counted deepseek's 9 P2 findings, and the runner's pass evidence flags 15 of its 16 passes as
  unexamined (`future_stamp`), so treat the deepseek-only findings as lower confidence.
- Operator review focus: none.

## 2. Planning Trigger

`/speckit:plan` is required: two active P1 findings and two failed required gates.

```json
{
  "Planning Packet": {
    "triggered": true,
    "verdict": "FAIL",
    "hasAdvisories": false,
    "activeFindings": {"P0": 0, "P1": 2, "P2": 19},
    "remediationWorkstreams": ["fan-out stop and ledger integrity", "stamp and pass-evidence consistency", "sandbox and adapter record accuracy", "docs and contract drift"],
    "specSeed": ["Record a per-lineage stopped outcome when the runner itself is signalled", "Verify a ledger pid is still a lineage before signalling its group"],
    "planSeed": ["Label the runner's stopped rows and update summary results on stop", "Check pid start time or command before --stop signals"],
    "findingClasses": ["process-control", "stamp-trust", "doc-drift", "sandbox-provenance"],
    "affectedSurfacesSeed": [".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs", ".skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs", ".skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs", ".skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts", ".skilled/commands/deep/assets/deep-review-presentation.txt"],
    "fixCompletenessRequired": true
  }
}
```

## 3. Active Finding Registry

The merged registry is `deep-review-findings-registry.json`; each lineage registry carries the
evidence, impact and fix text. P1 first.

| ID | Sev | Dim | Location | Title |
|----|-----|-----|----------|-------|
| OPUS-F003-P1-002 | P1 | security | `fanout-run.cjs:1030` | `--stop` signals the process group of whatever process now holds a ledger pid, with no check it is still a lineage |
| OPUS-F003-P1-001 | P1 | correctness | `fanout-run.cjs:4418` | A SIGHUP, SIGTERM or parent-death stop leaves every lineage open in the ledger, so the next run requeues each as an orphan and charges it a retry |
| OPUS-F001-P2-003 | P2 | security | `lineage-timestamp-window.ts:101` | A lineage that omits timestamp on its records escapes every stamp check |
| OPUS-F005-P2-001 | P2 | correctness | `convergence.cjs:2031` | Blocked-stop event reports every active finding as adjudicated, even when that gate blocks |
| R4-P2-001 | P2 | security | `deep-review-presentation.txt:226` | Presentations and compiled contracts still say cli-pi has no sandbox flag |
| R1-P2-001 | P2 | correctness | `fanout-run.cjs:3605` | dsh danger-full-access narrowed to workspace-write while provenance records the requested mode |
| OPUS-F001-P2-002 | P2 | correctness | `fanout-run.cjs:4924` | Lineage block written only after the lineage exits |
| OPUS-F006-P2-001 | P2 | correctness | `fanout-salvage.cjs:273` | One untimed attempt log turns every pass of the lineage to unknown |
| OPUS-F003-P2-003 | P2 | maintainability | `fanout-run.cjs:4418` | One `stopped` event name carries two shapes; `--status` shows a SIGHUP-stopped run as running |
| R13-P2-001 | P2 | correctness | `fanout-run.cjs:3337` | devin workspace-write enforcement label versus the builder's flag |
| OPUS-F005-P2-003 | P2 | maintainability | `convergence.cjs:1912` | Research blocked-stop row hard-codes hotspotSaturation pass |
| OPUS-F006-P2-002 | P2 | security | `fanout-run.cjs:2686` | The 20 MB stdout cap now counts the full stream-json transcript |
| R1-P2-002 | P2 | correctness | `executor-config.ts:165` | The auto-approve-flag sandbox surface is no longer mode-discriminating |
| OPUS-F005-P2-002 | P2 | traceability | `deep-review/references/convergence/convergence.md:142` | Documented review blocked_stop row is not the projected row |
| R3-P2-001 | P2 | correctness | `runtime/feature-catalog/executor/executor-config.md:29` | Conformance-test claim cannot see a same-mode collapse |
| R12-P2-001 | P2 | maintainability | `deep-review-presentation.txt:142` | Executor help text hand-maintained in four files |
| R2-P2-001 | P2 | correctness | `append-mode-event.cjs:483` | Feature catalog repeats the identity claim the projection contradicts |
| R11-P2-001 | P2 | maintainability | `append-mode-event.cjs:108` | The identity strip is a denylist missing four fields |
| OPUS-F001-P2-004 | P2 | traceability | `SPEC/implementation-summary.md:78` | The packet every range commit cites records none of the fan-out trust, stop or blocked-stop work |
| R8-P2-001 | P2 | traceability | `deep-review/references/state/state-jsonl.md:101` | State-format reference omits frontierNodeId |
| OPUS-F001-P2-005 | P2 | maintainability | `lineage-timestamp-window.ts:101` | Three copies of the claimed-stamp choice use two predicates |

`R*` ids are deepseek's; `OPUS-*` ids are opus's.

## 4. Remediation Workstreams

1. P1: fan-out stop integrity (OPUS-F003-P1-001, OPUS-F003-P1-002, with OPUS-F003-P2-003).
2. P2: stamp and pass-evidence consistency (OPUS-F001-P2-003, -005, OPUS-F006-P2-001).
3. P2: sandbox and adapter record accuracy (R1-P2-001, R1-P2-002, R13-P2-001, R3-P2-001, R4-P2-001).
4. P2 advisories: docs, contracts and catalog drift (the remaining traceability and maintainability rows).

## 5. Spec Seed

- A runner that is signalled records one `stopped` outcome per live lineage, with its rerun command.
- `--stop` signals a pid only after proving it is the lineage the ledger names.

## 6. Plan Seed

- Add a label and rerun command to the runner-side stop rows; update `results[].status` on stop.
- Compare the pid's start time or command line before `stopLiveFanoutRun` signals its group.
- Unify the claimed-stamp predicate across the three call sites.

## 7. Traceability Status

- Core `spec_code`: **fail** in opus (no packet requirement governs the range's fan-out and
  blocked-stop code, OPUS-F001-P2-004). Core `checklist_evidence`: not applicable.
- This is the `coverage` gate failure (`traceability-incomplete`). The `scope` gate failed because
  OPUS-F001-P2-004 cites a spec doc outside the review target's pathspec.
- AC_COVERAGE: exempt (target type `files`).

## 8. Deferred Items

- The custom dimension `cross-cli-parity` was requested and not applied: a fan-out run binds the four
  canonical dimensions in every lineage (`deep-review.yaml:54`, `:443`).

## Dimension Expansion Map

- Growth: opus admitted F-2-006 (rotated lineage logs) and deepseek F-2-007 (sandbox enforcement label
  matrix), one each. No pivots, overrides or Council artifacts.
- Remaining frontier: every node store row is `open` or `active`; review lineages wrote no close rows.

## 9. Search Ledger

- searchDebt: none in either lineage. hasSearchDebt: false.
- Candidate and search coverage are per lineage in the merged registry's `searchCoverage` and
  `candidateCoverage`.

## 10. Audit Appendix

- Convergence: opus ran stuck recovery five times and recorded four `blocked_stop` rows from the
  convergence script (`dimensionCoverageGate`, `missing: []`), then stopped at the 24-iteration cap.
  Deepseek ran its terminal gates (all pass) and stopped `converged`, then the runner rejected it.
- Coverage: all four canonical dimensions on every depth-1 node in both lineages.
- Cost: opus $20.507748, deepseek $0.455302, total $20.96305 (`orchestration-summary.json`).
- Cross-reference appendix. Core Protocols: `spec_code` fail, `checklist_evidence` n/a.
  Overlay Protocols: see each lineage registry's `traceability.results`.
