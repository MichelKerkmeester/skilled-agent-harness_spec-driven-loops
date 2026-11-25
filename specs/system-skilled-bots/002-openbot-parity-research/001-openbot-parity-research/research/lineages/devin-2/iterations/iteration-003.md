# Iteration 3: Evaluating a routine's until outcome after each run

## Focus

Frontier node F-2-007 (depth 2, scope .skilled/skills/system-skilled-bots/runtime/lib/definition.ts, runner.ts): How should a routine's until outcome be evaluated after each run from an existing BOT.md precheck or stop expression, without adding a scheduler?

## Actions Taken

1. Read the BOT.md definition schema around `precheck`.
2. Read the precheck runner and its call site in the run path.
3. Read the terminal outcome path in `runBot`.
4. Read the stop-switch layer and the run-record exit and dispatch fields.
5. Re-read OpenBot's goal-completion rule for the "until" transition.

## Findings

1. The existing `precheck` field is a pre-dispatch gate: a non-zero exit or a `[SILENT]` marker skips the run entirely, so it cannot express an outcome that is evaluated after work has happened. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:69] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:931-935]
2. `runPrecheck` is a reusable command executor: it runs `/bin/sh -c` in its own process group, treats a non-zero exit as a named failure, treats `[SILENT]` as a skip, and kills the whole group on timeout. The same helper can evaluate an `until` command after a run without new process plumbing. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:529-578]
3. The terminal outcome is finalized in `runBot` after `runSeeded` returns, and the terminal record is written before delivery starts, so an until evaluation has a natural insertion point between the two. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:750-757]
4. The stop-switch layer already keeps a disable file outside every checkout, reads a damaged file as still set, and lets `bots enable` clear it; an until-met transition can reuse that layer instead of inventing a second stop mechanism. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/switches.ts:1-10] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/switches.ts:56-76]
5. The run record already carries the exit reason, dispatch snapshot, skipped-slot summary and held slot, so a completion stamp belongs on that record rather than in a new store. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:82-110] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:130-141]
6. OpenBot completes a goal when its stated outcome is met and switches off the routines that run it; a small-team routine layer needs only that same met transition for its own schedule, not the goal store or the multi-routine switch-off graph. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:76-92]
7. The smallest change is an optional `until` command on BOT.md, evaluated with the existing precheck runner only after a successful run: exit 0 means met, which sets a completion switch and records `untilMetAt`, while a non-zero exit means not met and the routine keeps its schedule. Size S (one schema field, one post-run call, one switch value, one status line), risk low because no scheduler, queue or launchd code changes. [INFERENCE: based on findings 1-6]
8. The `precheck` field itself must not be reused as the `until` field: its `[SILENT]` marker means "skip this run", not "the outcome is met", so sharing the helper is correct while sharing the field would invert the meaning of a successful check. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:568] [INFERENCE: based on the precheck call site at runner.ts:931-935]

## Ruled Out

- Reusing `precheck` as the until field: it runs before dispatch and its silent marker skips a run, which is the opposite of completing a routine.
- Adding a goal store to evaluate outcomes: a single `until` command per routine is enough for a small team, and OpenBot's goal graph is only needed for multi-routine goals.
- Evaluating `until` on failed runs: a failed run has no outcome to judge, and treating its failure as "not met" would hide the failure behind a routine continuation.

## Dead Ends

- Looking for an existing post-run hook in the runner found only delivery and worktree cleanup; the terminal path has no outcome-evaluation stage today.
- Treating the run record's `exit.reason` as an outcome signal would conflate "the run completed" with "the routine's goal is met"; those are different facts and need different fields.

## Edge Cases

- Ambiguous input: none. F-2-007 names the precheck and stop-expression options explicitly.
- Contradictory evidence: none. The schema, the call site and the switch layer agree on the pre-dispatch and post-run split.
- Missing dependencies: none. All cited files were readable.
- Partial success: none. All five research actions returned evidence.

## Sources Consulted

- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:69
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:263-283
- .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:529-578
- .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:568
- .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:750-757
- .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:931-935
- .skilled/skills/system-skilled-bots/runtime/lib/switches.ts:1-10
- .skilled/skills/system-skilled-bots/runtime/lib/switches.ts:56-76
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:82-110
- .skilled/skills/system-skilled-bots/runtime/lib/run-record.ts:130-141
- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:76-92

## Assessment

- New information ratio: 0.9
- Questions addressed: F-2-007
- Questions answered: F-2-007

## Reflection

- What worked and why: Reading the precheck call site and the terminal outcome path together showed the exact seam for an after-run check, so the recommendation names real functions rather than a new subsystem.
- What did not work and why: Searching for an existing post-run hook found none, which initially looked like a missing dependency but is actually the gap the change fills.
- What I would do differently: Read the run-record vocabulary before the runner, so the completion field and the exit reason are distinguished before the insertion point is chosen.

## Recommended Next Focus

Work F-2-008 (the deterministic sentence-to-trigger planner), because it produces the `until` and `starts` fields this iteration's evaluation consumes. Then F-2-009 (missed windows and the 15-minute floor) and F-2-010 (routine guardrails).
