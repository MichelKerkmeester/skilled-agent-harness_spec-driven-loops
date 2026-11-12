# Incident record: a deep-research loop started from natural chat skipped its workflow

This is a factual record written by the orchestrating session (Claude Code, 2026-11-11). It is evidence for the research, not a conclusion.

## What the operator typed

"do 5 iters of deep research on it ... use deepseek v4.1 flash max". No slash command. Two later requests had the same shape ("Run 5 iters on that", "10 research iters on how ...").

## What the session did

1. Invoked the `deep:research` skill, which loaded `.skilled/commands/deep/research.md`.
2. Read the first 420 of 2,539 lines of `.skilled/commands/deep/assets/deep-research-auto.yaml`, saw its size, and looked for a runner.
3. Called `runtime/scripts/fanout-run.cjs` directly with one `cli-pi` lineage. The command doc says zero or one `--executor` runs the single-executor path, and that `--executors` JSON or a `--count` above 1 switches to fan-out. The session passed a one-entry `--fanout-config-json`.
4. The session told the operator about this as a "deviation" and described it as the runner "owning the loop". It did not check what that meant for the iterations.

## What went wrong, as observed afterwards

- One Pi process wrote every iteration of each run. In the ten-iteration run, iterations 7, 9 and 10 share a modification second, and iteration 3 was modified after iteration 10. Durations: 426 s, 418 s and 577 s for 5, 5 and 10 iterations.
- `phase_init` never ran at the packet level: no lock, no session classification, no spec check.
- Synthesis was a `cp` of the lineage `research.md`. The spec writeback was done by hand for one run of three. No continuity save ran.
- The third run's config stayed `initialized`.
- `fanout-run.cjs` reported every run as succeeded with no failure class. `fanout-merge.cjs` returned `status: ok`.
- Nothing in the session's context flagged the route. The operator found it by asking why the runs were so fast.

## What the proper path needed

- The single-executor path has no runner script. The orchestrating session must execute the YAML step by step: lock, config, ledger events through the append gateway, strategy, spec check, then per iteration a state read, graph convergence, prompt-pack render, executor dispatch, `verify-iteration.cjs`, the reducer, graph upsert and telemetry, then synthesis, writeback, save and lock release.
- To do that reliably the session wrote a driver of about 250 lines that extracts the YAML's own command blocks and binds their placeholders. A copy is at `scratch/single-executor-driver.py`.
- With the driver, ten iterations each ran as a separate process (77 to 149 s each), each passed `verify-iteration.cjs`, and each left an intent and a completion receipt under `research/dispatch-receipts/`.
- `verify-iteration.cjs` warned on every iteration that route proof came from the delta file because the projected state log carries no leaf dispatch fields.
- The continuity save was refused with `ALIGNMENT_HARD_BLOCK: 18% alignment is below minimum non-interactive threshold (20%)`.
