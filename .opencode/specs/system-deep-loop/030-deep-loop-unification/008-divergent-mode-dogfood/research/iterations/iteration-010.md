# Iteration 10: Deep-Improvement Candidate and Budget Boundaries

## Focus

Compare deep-improvement candidate prompts, reducer boundaries, and dispatch budgets with the schema, provenance, containment, and cost failures previously found in deep-review and deep-ai-council.

## Actions Taken

1. Recovered iteration state, the current strategy focus, prior findings, and reducer ownership rules.
2. Traced Lane A from `/deep:agent-improvement` through its auto/confirm YAML candidate dispatch, the `deep-improvement` mutator contract, journal emission, scoring, and reduction.
3. Compared configured iteration/candidate limits and repeatability settings with their runtime consumers and test coverage.
4. Checked auto/confirm lifecycle-event parity and the reducer's treatment of journal, lineage, and score streams.

## Findings

### F-ITER010-001 (P1): Candidate dispatch omits the mutator's mandatory input envelope

Both workflows reduce candidate generation to `Dispatch @deep-improvement to write a new candidate into candidates/`; they do not bind the runtime root, copied charter, copied control file, canonical target, or candidate output path. The target agent declares those five fields mandatory and must halt before reading when any is absent. This is the improvement analogue of review's prompt/validator mismatch: the producer contract is strict, but the host prompt does not carry the required schema. [SOURCE: .opencode/commands/deep/assets/deep_agent-improvement_auto.yaml:169-174] [SOURCE: .opencode/commands/deep/assets/deep_agent-improvement_confirm.yaml:190-195] [SOURCE: .opencode/agents/deep-improvement.md:78-99]

### F-ITER010-002 (P1): The host trusts candidate success without validating output or artifact identity

Immediately after the underspecified dispatch, both workflows emit `candidate_generated`, record lineage, and score `{candidate_path}`. No intervening step validates the mutator's structured JSON fields, `critic_pass`, candidate existence, packet-local containment, write-once status, or the `NO-CANDIDATE` branch. The journal validator accepts `candidate_generated` without candidate details, and its tests explicitly emit that minimal event. This can turn a halted or malformed mutator response into false progress telemetry and downstream placeholder use, combining the review schema failure with council's requested-versus-effective provenance problem. [SOURCE: .opencode/commands/deep/assets/deep_agent-improvement_auto.yaml:169-180] [SOURCE: .opencode/agents/deep-improvement.md:120-176] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs:74-113] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/improvement-journal.vitest.ts:182-190]

### F-ITER010-003 (P1): Reducer ownership is atomic but not cross-stream consistent

The reducer independently builds the experiment registry from `agent-improvement-state.jsonl`, summarizes lifecycle counts from `improvement-journal.jsonl`, and summarizes candidate IDs from `candidate-lineage.json`; it then writes the registry/dashboard atomically. It does not reconcile candidate IDs, iteration numbers, candidate files, score outputs, or generated/scored event ordering across those streams. Atomic output therefore preserves a potentially inconsistent snapshot rather than detecting one. This is closer to council's provenance split than review's missing-field failure: each representation can be valid alone while disagreeing about what actually ran. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs:292-357] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs:390-429] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs:1381-1412]

### F-ITER010-004 (P1): The iteration cap does not bound cumulative dispatch cost

Lane A defaults to five iterations and describes `max_iterations` only as a positive integer. There is no hard numeric ceiling, per-candidate timeout, tool-call cap, token budget, or aggregate dispatch budget in the candidate workflow. Each iteration refreshes integration data, dispatches a mutator, scores, materializes fixtures, and runs a benchmark. The config's `maxCandidatesPerIteration` and `parallelWaves.maxCandidates` are not consumed by deep-improvement scripts, so they are descriptive rather than enforced safety limits. This reproduces council's unbounded-dimension cost pattern in serial form: bounded loop count does not bound work per iteration or total subprocess time. [SOURCE: .opencode/commands/deep/assets/deep_agent-improvement_presentation.txt:41-56] [SOURCE: .opencode/commands/deep/assets/deep_agent-improvement_auto.yaml:161-207] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config.json:5-7] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config.json:92-96]

### F-ITER010-005 (P1): Repeatability evidence is guaranteed insufficient on every iteration

Both workflows call `measureStability([score], { minReplayCount: 3, ... })`: they always pass a one-element array while requiring three samples. The config separately declares `benchmarkStability.replayCount: 3`, but the workflow neither replays the score nor aggregates prior scores into the per-candidate report. Thus every generated repeatability report is structurally insufficient and cannot independently satisfy the documented evidence gate, while still paying the benchmark cost each iteration. [SOURCE: .opencode/commands/deep/assets/deep_agent-improvement_auto.yaml:196-201] [SOURCE: .opencode/commands/deep/assets/deep_agent-improvement_confirm.yaml:217-222] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config.json:104-107] [SOURCE: .opencode/agents/deep-improvement.md:198-206]

### F-ITER010-006 (P2): Auto and confirm runs emit different start events, but the reducer recognizes only one

Auto mode emits `session_initialized`; confirm mode emits `session_start`. Both are accepted journal event types, but `buildJournalSummary` sets `lastSessionStart` only for `session_start`. Consequently, a healthy auto run can render its start as unavailable even though initialization was journaled. This is a small but concrete command/runtime documentation drift at the reducer boundary. [SOURCE: .opencode/commands/deep/assets/deep_agent-improvement_auto.yaml:154-159] [SOURCE: .opencode/commands/deep/assets/deep_agent-improvement_confirm.yaml:167-172] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs:31-51] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs:307-329]

## Questions Answered

- **How do deep-improvement candidate prompts compare with review failures?** They repeat the producer/consumer schema mismatch: the mutator requires a five-field envelope and structured response, while the host supplies neither a complete dispatch packet nor post-dispatch validation.
- **How do reducer boundaries compare with council failures?** Improvement persists separate requested/generated/scored representations without cross-stream reconciliation, allowing valid-looking but contradictory provenance.
- **How do dispatch budgets compare?** Improvement is serial by default, but lacks per-dispatch and aggregate cost ceilings; its configured candidate controls are not runtime-enforced, and repeatability work cannot meet its own sample requirement.

## Questions Remaining

- What numeric ceilings should govern Lane A iterations, candidate wall time, benchmark wall time, and aggregate subprocess time on each supported capability profile?
- Should the reducer reject a run when journal, lineage, state ledger, candidate artifact, and score output do not form a one-to-one candidate transaction?
- Should `NO-CANDIDATE` be a first-class typed event and legal stop path rather than flowing into `candidate_generated`?
- Are the five original cross-cutting key questions intentionally left unresolved for synthesis, or should the final reducer map accumulated findings to them before completion?

## Sources Consulted

- `.opencode/commands/deep/agent-improvement.md`
- `.opencode/commands/deep/assets/deep_agent-improvement_auto.yaml`
- `.opencode/commands/deep/assets/deep_agent-improvement_confirm.yaml`
- `.opencode/commands/deep/assets/deep_agent-improvement_presentation.txt`
- `.opencode/agents/deep-improvement.md`
- `.opencode/skills/system-deep-loop/deep-improvement/assets/agent_improvement/improvement_config.json`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/improvement-journal.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/reduce-state.cjs`
- `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs`
- Deep-improvement skill-local tests under `scripts/shared/tests/`

## Assessment

- `newInfoRatio`: 0.88
- Status: `insight`
- Novelty: The iteration closes the long-carried deep-improvement comparison with six directly evidenced defects, including an impossible repeatability gate and a three-stream reducer consistency gap not covered by prior review/council findings.
- Confidence: High for static workflow and reducer behavior; actual executor interpolation behavior remains unobserved because this iteration was read-only.

## Reflection

- Worked: Following one Lane A candidate transaction end-to-end exposed defects hidden by reviewing the scorer or reducer in isolation.
- Failed: Memory trigger retrieval was unavailable (`Not connected`); canonical packet state and direct source reads provided continuity instead.
- Ruled out: Treating `maxIterations` alone as an adequate cost bound; it does not constrain mutator or benchmark duration.

## SCOPE VIOLATIONS

- An accidental tool call created the empty file `.opencode/specs/system-deep-loop/052-deep-loop-unification/008-divergent-mode-dogfood/retry-placeholder`, outside the allowed write list. The prompt bans deleting or replacing files outside that list, so no cleanup action was attempted. Operator/workflow cleanup is required.

## Next Focus

Synthesis should consolidate the ten iterations into prioritized fixes, starting with transaction-level output validation and hard aggregate dispatch budgets across all four deep-loop modes.
