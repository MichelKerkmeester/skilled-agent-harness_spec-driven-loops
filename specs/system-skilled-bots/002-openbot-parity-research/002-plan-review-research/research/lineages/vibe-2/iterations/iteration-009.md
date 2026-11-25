# Iteration 9: The `until` check — prose executed as a shell command

## Focus

Frontier node F-2-005 (depth 2), second pass: phase 002's `until` timeout and failure path, plus a sweep for any remaining P0 Definition-of-Done contradiction. The carried-forward question from iteration 6 was whether the `until` timeout and failure path behave; the answer is that the field itself is the wrong kind of thing.

## Findings

1. **`until` is prose in the reference and a shell command in the plan, so the runner would execute arbitrary BOT.md text after every completed run.** The plan has the runner "run `until` through `runPrecheck`" (`002-routine-layer/plan.md:64`) and calls `runPrecheck(until)` in the data flow (`002-routine-layer/plan.md:71`); REQ-004 says the runner "runs `until` through the existing precheck helper; exit 0 records `untilMetAt`" (`002-routine-layer/spec.md:164`). The reference the phase cites defines the fourth part as "You stop it. Or it is done, when you gave it an outcome to reach" (`how-openbot-works.md:41-44`), and REQ-001 says "The four parts are OpenBot's own" (`002-routine-layer/spec.md:160`). `runPrecheck` spawns `/bin/sh -c command` (`runner.ts:534`), so a BOT.md whose `until` reads "the release ships" fails every time and the bot never completes, and one whose `until` reads `curl … | sh` executes after every run. **Severity P0.** Fix: split the field in `002-routine-layer/spec.md` REQ-001 — `until` stays the prose outcome and a new `until_check` holds the command — and add a `routine-until-check-missing` refusal for a routine whose `until` is prose and whose `until_check` is absent, plus one `bot-check.cjs` invariant refusing a shell metacharacter in `until`.

2. **The `until` check runs in the checkout, not in the tree the run worked in.** `runPrecheck` is called with `context.checkoutRoot` (`runner.ts:932`), and the plan reuses it unchanged for the post-run check (`002-routine-layer/plan.md:71`). A worktree bot whose `until_check` is `test -f out/report.md` therefore checks the checkout and never sees the file its run wrote, so the routine never completes. **Severity P1.** Fix: in `002-routine-layer/plan.md:71`, pass the run's `workDir` rather than `context.checkoutRoot` to the `until` call, and add one acceptance row with an isolation-mode bot whose check passes only in its worktree.

3. **A broken `until` command is indistinguishable from an unmet one, so a typo means "never done" forever and silently.** `runPrecheck` collapses a non-zero exit, a timeout and a spawn error into `precheck-failed` with only a `detail` string (`runner.ts:561-566`), and REQ-004 records `met: false` for "any other outcome" (`002-routine-layer/spec.md:164`). Nothing raises an item, so the operator sees a routine that keeps running and never learns its check cannot run. **Severity P1.** Fix: add a requirement to `002-routine-layer/spec.md` §4 — the observation carries the helper's `detail`, and three consecutive `until` checks that end `precheck-failed` with a non-zero exit raise one needs-you item naming the command and its exit code.

4. **The `[SILENT]` marker collides with the `until` outcome.** `PRECHECK_SILENT_MARKER = '[SILENT]'` makes `runPrecheck` return `precheck-silent` (`runner.ts:153`, `runner.ts:567-568`), which under REQ-004 is "any other outcome" and records `met: false`. A check that prints the marker for an unrelated reason therefore reads as not-met. **Severity P2.** Fix: state in `002-routine-layer/spec.md` REQ-004 that the `until` call ignores the silent marker, and add one acceptance row with a check that prints `[SILENT]` and exits 0.

5. **The dependency table's impact text contradicts REQ-004 and the runtime.** The row reads "`runner.ts` `runPrecheck` | Internal | Green | The `until` check has no process-group isolation, so REQ-004 is blocked" (`002-routine-layer/plan.md:135`), while REQ-004 cites the helper as owning a process group and `runPrecheck` does, with SIGTERM then SIGKILL on the whole group (`runner.ts:529-556`). A reader checking whether the dependency is real is told the opposite of the truth. **Severity P2.** Fix: change the impact text to "The `until` check would have no timeout and no process-group isolation, so a hung check would hold the run open".

## Verified Correct

- **Phase 003's Definition of Done is runnable in this checkout.** `cargo 1.92.0` and `rustc 1.92.0` are installed, and `crates/` does not exist, so `cargo build --release --manifest-path crates/bots-tui/Cargo.toml` on an empty crate is a real pre-state and `cargo test` is a real post-state.
- **The `until` timeout itself is handled.** `runPrecheck` signals the whole process group with SIGTERM and then SIGKILL after a two-second grace (`runner.ts:545-552`), so a hung check cannot outlive the run. The defect is what the outcome means, not whether the process is reaped.
- **The 004 `SCHEMA_VERSION` P0 is confirmed and unchanged.** `004-computer-exposure/spec.md:147` REQ-006 still requires `SCHEMA_VERSION` to stay `'2'` while phase 001 bumps it to `'3'` and 004 depends on 001. Recorded as P0 in iteration 1; the sweep found no second instance of the same shape.

## Ruled Out

- **Treating the `until` timeout as the defect.** The timeout works and is tested by the helper's own suite; the defect is that a prose field is executed.
- **Treating the `until` check as a precheck.** It reuses the helper's process-group and timeout machinery, which is the right reuse; only the working directory and the outcome vocabulary are wrong.
- **Looking for a second `SCHEMA_VERSION`-shaped P0.** The sweep over every phase's Definition of Done found one instance, already recorded.

## Dead Ends

- **Looking for a routine block example in the phase docs.** Neither `spec.md` nor `plan.md` shows a filled `routine` block, which is why the prose-versus-command ambiguity survived review: there is no example to read.
- **Looking for a `bot-check.cjs` invariant over the `until` field.** The checker's hard invariants cover the schedule, the label, the posture and the executor bounds, and none reads the routine block.

## Edge Cases

- **Ambiguous input:** "the `until` timeout and failure path" could mean the helper's timeout or the routine's completion semantics. Both were read; the helper's timeout is sound and the completion semantics are the defect.
- **Contradictory evidence:** the plan's dependency table says the helper has no process-group isolation while REQ-004 and the source say it does. Both are cited; finding 5 records the plan as the defect.
- **Missing dependencies:** none.
- **Partial success:** the sweep covered every phase's Definition of Done for version and count assertions, not for every command. A DoD command that fails for a reason other than a version would not be caught.

## Sources Consulted

- `specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:160,164`
- `specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:64,71,99,135`
- `specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:147`
- `specs/system-skilled-bots/context/OpenBot-main/docs/how-openbot-works.md:41-44`
- `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts:153,529-556,561-568,932`
- `cargo --version` → `cargo 1.92.0 (344c4567c 2025-10-21)`
- `rustc --version` → `rustc 1.92.0 (ded5c06cf 2025-12-08)`

## Assessment

- New information ratio: 1.0 (all five findings are new to this run)
- Questions addressed: F-2-005, second pass; the carried-forward `until` question
- Questions answered: the `until` timeout and failure path

## Reflection

- **What worked and why:** reading the reference's own definition of the field, rather than the phase's use of it, is what exposed the category error. The phase cites the reference for the four parts and then treats one of them as a command.
- **What did not work and why:** the first pass checked only whether the timeout was handled, which it is, and would have closed the question. The question was "does the failure path behave", and the answer needed the field's type, not the helper's behaviour.
- **What I would do differently:** for every field a phase executes, read the reference's definition of that field before reading the phase's use of it. A field that is prose in the source and a command in the plan is a P0 every time.

## Recommended Next Focus

The per-phase findings grouped and ranked, which is the deliverable the topic names, then the cross-phase conflict list.
