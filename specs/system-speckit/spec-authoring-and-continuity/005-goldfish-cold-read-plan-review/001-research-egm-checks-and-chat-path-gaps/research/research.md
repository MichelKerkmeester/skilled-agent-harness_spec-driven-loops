# Research: Keeping a chat-started deep loop on its workflow

Five iterations, each a fresh `cli-pi` process on `deepseek-v4.1-flash-1017` at max effort, generation 3 of this packet's research. Compiled by the orchestrating session from `iterations/iteration-001.md` to `iteration-005.md`. Finding numbers below refer to those files. First-hand evidence is in `../scratch/incident-chat-started-loop.md`.

## 1. The question

How can this repository make sure that a deep loop started through natural conversation follows its proper workflow and does not skip steps?

## 2. Verdict

One refusal in one script would have stopped the incident before anything ran. `fanout-run.cjs` should refuse a research or review call whose executor matrix expands to a single lineage, unless the caller passes an explicit escape flag. The change set is five edits across four files, with no new command, agent, hook or document (iteration 5, finding 7).

The reason this is the right layer: every hard check in the loop is invoked from inside a workflow step. A route that skips the workflow skips all of them at once (iteration 1, finding 5). Wording in a doc is the class of control that already failed here (iteration 2, finding 9).

## 3. What the incident exposed (iteration 1)

- The fan-out policy is prose keyed on the shape of the command's flags. The script it points at never re-checks it (finding 1). The command docs say "an `--executors` value ... switches to fan-out" [SOURCE: .skilled/commands/deep/research.md:126], and the script accepts a one-entry matrix.
- The fan-out path is defined as not containing the init phase. It does not merely skip it (finding 2).
- One process per lineage is deliberate. The lineage prompt says "THIS process is the executor for EVERY iteration" [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1585]. The stated cause is that a leaf dispatching a nested CLI from inside its own sandbox is denied, and the lineage then burns every iteration on dispatch failures (finding 3).
- That design overrides the stated principle "Fresh context per iteration" [SOURCE: .skilled/commands/deep/assets/deep-research-auto.yaml:35], and nothing records or reports that a lineage's iterations shared one context (findings 3 and 4).
- `verify-iteration.cjs` passes on a run whose packet-level phases never happened, and no script anywhere asserts that a run completed (findings 6 and 7).

## 4. Why no existing check fired (iterations 1 and 3)

- No existing check could have fired before the run, and only one can fire after it (iteration 3, finding 9).
- The timestamp-anomaly telemetry is advisory and cannot see in-process iteration. Iteration 3 corrected iteration 2 on this point and withdrew a change built on it (iteration 3, finding 5).
- The packet-level `config.status` field is a valid discriminator, because a correctly walked fan-out run does write `complete`. It lags, since it is only known after the run (iteration 2, finding 7 and iteration 4, finding 8).

## 5. The candidate fixes, priced (iteration 2)

| Candidate | Cost | Verdict |
|---|---|---|
| Refusal in `fanout-run.cjs` at the lineage-expansion boundary | A few lines beside three same-family guards, plus fixture updates | Take it |
| The same rule in the config schema | Wrong layer, and more expensive | Rejected |
| A runner that owns the single-executor loop | A new subsystem, with nothing existing to promote into it | Rejected for now |
| A hook | Six separate runtime mechanisms, and it still delivers prose | Rejected |
| A gate hosted in the append gateway | The widest blast radius, and it cannot stop a run when it fires | Rejected |
| Doc wording alone | The control that already failed | Only as the one-clause correction below |

A guard inside `fanout-run.cjs` is inert in a dispatched child, which is the cheapest child behaviour available (iteration 2, finding 4).

## 6. The change set (iteration 5)

1. `fanout-run.cjs`: add `'allowSingleLineage'` to `FANOUT_FLAGS` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:30]. Without this, passing the escape flag fails as an unknown flag.
2. `fanout-run.cjs`: add the refusal after `expandLineages` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3396], in the shape of the shipped stop-policy guard on the next line. It runs before the lineage directory, the status ledger, the summary or any spawn.
3. `tests/unit/fanout-run.vitest.ts`: add the flag to the capped one-executor case that currently spawns, and add one negative and one positive case from the existing stop-policy test template.
4. `tests/stress` fixtures in `fanout.vitest.ts`: add the flag to three one-executor cases.
5. Four doc lines, one clause each, in `research.md`, `review.md` and the two presentation assets: "an `--executors` value" becomes "an `--executors` matrix that expands to two or more lineages".

`AGENTS.md` and `delegation-and-orchestration.md` stay untouched, because neither states the trigger (iteration 5, finding 5).

## 7. The other loop modes (iteration 3)

- Deep review inherits both defects and needs the same guard, which the loop-type predicate already covers (finding 7).
- The AI council needs no change. It never enters the lineage runner (finding 6).

## 8. What this does not fix

- A legitimate multi-lineage fan-out still runs each lineage's iterations in one process. The refusal stops the one-lineage misuse and does not restore fresh context inside a real fan-out.
- The single-executor path still has no runner. The orchestrating session must walk the workflow file step by step, and in this session that took a hand-written driver of about 250 lines.
- A session can still skip the workflow without touching `fanout-run.cjs` at all, for example by writing iteration files itself. No iteration tested that route.

## 9. Eliminated Alternatives

- A schema-level rule (iteration 2, finding 2).
- A new single-executor runner as part of this change (iteration 2, finding 6).
- A hook or an append-gateway gate (iteration 2, findings 5 and 8).
- A completion check built on the timestamp anomaly (iteration 3, finding 5).
- Restating the trigger in `AGENTS.md` or the delegation rule file, which would add a second statement to drift (iteration 5, finding 5).

## 10. Divergence Map

- Saturated directions: none recorded in the registry.
- Pivots taken: two corrections of earlier iterations. Iteration 3 withdrew iteration 2's timestamp-based change. Iteration 5 corrected iteration 4's fixture count upward after reading the unit test bodies.
- Pivot failures and audited overrides: none.
- Remaining frontier: whether a fan-out lineage should run the packet-level init and save phases, and whether the single-executor path should get a runner. Both are design decisions for a follow-up packet.

## 11. Open Questions

All five tracked questions are marked answered. Three things are unknown:

1. Whether the refusal breaks any caller outside the test suites. No suite was run and the script was not modified.
2. The fixture pass and fail count after the flag is added. The implementation must run both test files.
3. How often a chat-started loop goes wrong by a route other than the one in the incident.

## 12. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 5 of 5
- Questions answered: 5 / 5
- Remaining questions: 0
- newInfoRatio by iteration, self-reported by each fresh agent: 0.88, 0.85, 0.79, 0.73, 0.89
- Convergence threshold: 0.05, telemetry only under the max-iterations stop policy
- Dispatch time per iteration in seconds: 111, 137, 114, 106, 85
- Every iteration passed `verify-iteration.cjs` on its first dispatch

## 13. References

- `iterations/iteration-001.md` to `iterations/iteration-005.md` and `deltas/iter-001.jsonl` to `iter-005.jsonl`
- `../scratch/incident-chat-started-loop.md`, `../scratch/single-executor-driver.py`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`, `verify-iteration.cjs`, `fanout-merge.cjs`, `synthesis-closeout.cjs`
- `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`
- `.skilled/commands/deep/research.md`, `review.md`, `assets/deep-research-auto.yaml`, `assets/deep-research-presentation.txt`
- The previous generation's synthesis, on workflow protection for chat sessions: `../research_archive/2026-11-11T20-11-35Z/research.md`
