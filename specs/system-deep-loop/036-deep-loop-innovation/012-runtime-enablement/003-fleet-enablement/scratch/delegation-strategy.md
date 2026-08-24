# Delegation strategy

What actually works for dispatching this build, and why. Every constraint below
was hit in practice, not read in a doc.

## Roster

| Role | Executor | Invocation |
|------|----------|------------|
| Implement | GLM-5.2 High via cli-devin | `devin -p --model glm-5-2 --permission-mode accept-edits -- "<prompt>"` |
| Implement / verify | DeepSeek V4 Flash xhigh via cli-opencode (cline) | `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode run --model cline-pass/cline-pass/deepseek-v4-flash --variant xhigh --format json --dir <repo-root> "<prompt>" </dev/null` |

**Devin: use the free tier only.** `glm-5-2` with no suffix is GLM-5.2 High on the
free tier, 200K context. The paid models — `gemini-3-7-flash-high`, anything with
a `-max` suffix — return `resource_exhausted` against a daily quota, confirmed by
direct probe twice. Suffixes stack and all of them cost: `-max` is Max reasoning,
`-1m` is 1M context, `-none` disables reasoning. Probed working: exit 0.

**Devin has no `--agent` flag.** Open an implementation prompt by telling it to
dispatch `run_subagent` with the `code` profile.

**opencode rejects `--agent` at the top level.** `review` and `general` are both
subagent-mode and fail outright. Carry the persona in the prompt body instead —
open with "Act as the Review agent:". `</dev/null` is not optional; without it
the dispatch can hang forever at 0% CPU.

## The constraint that governs every DeepSeek brief

It stalls indefinitely once a multi-round read loop starts. Measured: three reads
hung at 51 minutes, ten tool calls hung at 34 minutes, both on an unfinished
`step_start`. A no-tool prompt returns instantly and a write-only prompt returns
in seconds.

So every brief inlines the complete text of anything it must know — file
contents, function signatures, measured command output — and forbids
`read`/`grep`/`glob` in its first line. Under that rule it has returned cleanly
on every dispatch, in 45 to 165 seconds each. Verify the discipline held by
counting tool uses in the JSON stream: only `write` and `edit` should appear.

## The role split that actually caught bugs

The executor writes; the orchestrator reads, runs, and negative-controls. Handing
the reading to the model that cannot read is the whole trick — it also means the
orchestrator is the one who sees the real command output, which is the only thing
that counts as evidence.

Three defects reached this packet's code and none were visible in what the
executor returned. Each surfaced by running it:

- an argument shape that turned a dry run into a real run,
- a missing value used as a filesystem path,
- a resumed run that erased the earlier run's durable progress.

The third was found only by a dedicated **refutation pass**: the same executor,
given the complete code, every external fact, and one instruction — refute, and a
review that says "looks good" has failed. It was told to attack specific
properties and to name an input and an outcome for every finding. It found what
38 passing tests and the orchestrator's own probe had both missed, because both
had asserted an in-memory result and never read back what was written to disk.

Run the refutation pass even when the suite is green and the guards are proven.
Green is when it pays.
