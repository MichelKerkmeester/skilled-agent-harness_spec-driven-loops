# Iteration 2: Fan-out retry, dispatch, and append-gateway audit

## Focus

Continue Q1 from the dispatched focus: inspect fan-out stop and retry transitions, including a runner-held child whose process start time cannot be read, then trace iteration dispatch and append-gateway retry/projection behavior. The explicit dispatch assigns Q1 even though the packet currently marks it resolved; this pass records that status mismatch and does not claim Q1 answered.

## Actions Taken

- Read the archived v4.2.0.0 synthesis first to avoid repeating its completed directions.
- Traced the signal-stop path from `stopActiveLineageProcesses` through identity refusal and survivor recording. The iteration-1 P2 remains present: the held-child fallback and survivor list handle `no_recorded_identity`, while `identity_unreadable` can describe a still-live held child when the leader still answers. This is a revalidation of iteration 1, not a second finding. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1047] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1334] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1413] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5283] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5296]
- Checked retry accounting: the pool counts both `retry_scheduled` and `orphan_requeued`, and only schedules another attempt when the failure is retryable and the configured retry count remains. The stop reference says a `stopped` row closes the lineage rather than charging a retry. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:267] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:745] [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:163]
- Followed the standard CLI dispatch wrapper: it snapshots the pre-dispatch dirty set, runs the executor, then reports out-of-artifact writes. The workflow YAML routes CLI executor branches through `dispatch-iteration.cjs`; no separate mismatch was found in these inspected paths. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:400] [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1602]
- Checked append-gateway retry handling: the CLI derives a stable idempotency key from the caller's unchanged event, the gateway reuses the original receipt for an exact replay, retries stale-head/head-conflict append attempts, and returns a durable receipt with a failed result if an attempted projection refresh fails. The reviewed code agrees with the gateway reference. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:364] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:385] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:630] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:800] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/README.md:74]
- Compared the packet's question state with iteration 1's record and narrative.

## Findings

1. **P3 — The packet gives two incompatible Q1 closure states.** The registry marks Q1 resolved at iteration 1 and labels it `legacy-import`; the strategy checks Q1. The current iteration-1 state record has `answeredQuestions: []`, while its narrative and the progressive synthesis say Q1 remains open. This is an observed cross-artifact inconsistency. Whether the imported closure is intentionally carried forward or was applied incorrectly is UNKNOWN; this evidence alone does not establish a reducer defect. [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/findings-registry.json:13] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/findings-registry.json:18] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/findings-registry.json:19] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/deep-research-strategy.md:58] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/deep-research-state.jsonl:6] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/iterations/iteration-001.md:58] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/research.md:7]

## Questions Answered

None. This pass did not answer the broader Q1 question.

## Questions Remaining

- Q1 closure provenance is ambiguous across the current registry, strategy, iteration record, and narrative.
- Q2: Does the changed system-skill-advisor (scorer, hooks, brief policy, embedding-lane removal) hold routing bugs or drift between code, hook docs and AGENTS.md Gate 2?
- Q3: Do the changed mcp-browser-use, mcp-tooling, cli-external-orchestration and cli-orca modes hold broken paths, registry or hub-router drift, or executor builder bugs?
- Q4: Do the changed system-spec-kit runtime and hooks (decision-capture, session-handover, cli-dispatch, overlay-guard, git hooks) hold logic bugs or doc drift against what v4.2.0.0 claims?
- Q5: Do the doctor commands and skill, sk-doc, sk-code, sk-git, runtime mirrors, CI workflows and the v4.2.0.0 changelog agree with the code they describe?

## Ruled Out

- No independent retry-budget defect was confirmed in the inspected path: orphan requeues consume retry credit, and stopped lineages are terminal.
- No duplicate append or stale-head retry defect was confirmed in the inspected append-gateway path.
- No new dispatch-wrapper defect was confirmed in the inspected CLI path.

## Dead Ends

None.

## Edge Cases

- Ambiguous input: the dispatch assigns Q1 although the registry and strategy mark it resolved. I treated this as a Q1 follow-up and left `answeredQuestions` empty.
- Contradictory evidence: the registry/strategy disagree with iteration 1's empty answer list and prose. The legacy-import provenance needs follow-up.
- Missing dependencies: none.
- Partial success: none; the planned static source review completed. No tests or runtime reproductions were run.

## Sources Consulted

- [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research_archive/20261126T112816Z/research.md:131]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1047]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs:267]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:163]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs:400]
- [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1602]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:364]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:385]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/append-mode-event.ts:630]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/mode-append-gateway/README.md:74]
- [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/findings-registry.json:13] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/findings-registry.json:18] [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/findings-registry.json:19]
- [SOURCE: specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/deep-research-state.jsonl:6]

## Assessment

- New information ratio: 1.0 (one new packet-level inconsistency; the fan-out shutdown path was a revalidation of iteration 1).
- Questions addressed: Q1 fan-out stop/retry, dispatch, and append-gateway subpaths.
- Questions answered: none.

## Reflection

- What worked and why: comparing the registry, strategy, iteration record, and narrative exposed a status mismatch that was not visible in the code-only trace.
- What did not work and why: the current packet does not identify which imported event established Q1's resolved state; tracing the legacy-import source is still needed.
- What I would do differently: check the import/reducer provenance before treating the inherited Q1 closure as authoritative.

## Recommended Next Focus

Proceed to Q2, the system-skill-advisor audit. Also trace the legacy-import source for Q1 if its closure affects convergence or focus selection.

## Status

complete
