# Iteration 1: Deep-loop fan-out stop safety

## Focus

Investigated Q1's fan-out shutdown path, specifically how the runner handles a still-running child when its process start time cannot be read. This is a narrow part of Q1; the broader runtime, workflow, and reference-doc audit remains open.

## Actions Taken

- Traced `processStartOf`, refusal classification, the runner's own signal handler, and its stopped-row write path.
- Compared the unreadable-identity handling with the fan-out stop contract.
- Checked the changed-range prompt's `keyQuestions` / `answeredQuestions` rules against the reducer matching logic; they agree.

## Findings

1. **P2 — A live fan-out child can be left running while the runner records it as stopped when its start time is unreadable.** On POSIX, `processStartOf` returns an empty value if `ps` cannot read the PID's start time; the classifier treats that as `identity_unreadable`. If the child leader still answers, the exited-group path yields no members. The runner's in-process fallback terminates held children only for `no_recorded_identity`, and the signal handler tracks refused survivors only for that same reason. It can therefore omit a still-live `identity_unreadable` child from survivor tracking and write its lineage's `stopped` row. This can leave the child running without a live status row. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1291] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1416] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1047] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5288] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5296]

## Questions Answered

None. The shutdown-path issue is evidence for Q1, but Q1 covers the wider runtime and remains open.

## Questions Remaining

- Q1: Does the changed system-deep-loop runtime (dispatch, fan-out, convergence, append gateway, lock, reducer) hold logic bugs, or disagree with its workflow YAML and reference docs?
- Q2: Does the changed system-skill-advisor (scorer, hooks, brief policy, embedding-lane removal) hold routing bugs or drift between code, hook docs and AGENTS.md Gate 2?
- Q3: Do the changed mcp-browser-use, mcp-tooling, cli-external-orchestration and cli-orca modes hold broken paths, registry or hub-router drift, or executor builder bugs?
- Q4: Do the changed system-spec-kit runtime and hooks (decision-capture, session-handover, cli-dispatch, overlay-guard, git hooks) hold logic bugs or doc drift against what v4.2.0.0 claims?
- Q5: Do the doctor commands and skill, sk-doc, sk-code, sk-git, runtime mirrors, CI workflows and the v4.2.0.0 changelog agree with the code they describe?

## Ruled Out

- The current `keyQuestions` and `answeredQuestions` wording is consistent with the reducer's exact question matching; no defect confirmed in that contract.

## Dead Ends

None.

## Edge Cases

- Ambiguous input: none; focused on a live child with an unreadable process start time.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none; this iteration confirms one issue, while the full Q1 audit remains unfinished.

## Sources Consulted

- [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1291]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1416]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1047]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5288]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5296]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:152]
- [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2740]

## Assessment

- New information ratio: 1.0
- Questions addressed: Q1's fan-out signal-shutdown path
- Questions answered: none; Q1 remains open

## Reflection

- What worked and why: Following the unreadable-identity branch through classification, fallback signaling, survivor detection, and ledger closure exposed a gap across three stages.
- What did not work and why: The question-field review did not yield a defect because the prompt and reducer agree on exact matching.
- What I would do differently: Continue Q1 with separate passes over dispatch and append-gateway behavior, then compare their workflow contracts.

## Recommended Next Focus

Audit the remaining fan-out stop and retry transitions, then move to dispatch and append-gateway behavior under Q1. Include cases where a runner can identify a child it still holds but cannot read the child's process start time.
