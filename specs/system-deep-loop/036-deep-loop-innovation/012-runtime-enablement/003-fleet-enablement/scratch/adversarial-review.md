# Adversarial review and what it found

The delivered code passed 38 tests and a 12-guard control pass before this review
ran. A second executor was then given the complete text of all four files, every
external fact it needed, and one instruction: refute. It was told that a review
returning "looks good" has failed.

It found a bug that both the tests and the orchestrator's own probe had missed,
for the same reason in both cases — they asserted the in-memory result of a
resumed run and never read back what that run wrote to disk.

## Confirmed by execution, then fixed

**A resumed run erased the earlier run's progress.** `save` persisted only the
current call's completions. Prior completions lived in `skippedModes` and were
never written back.

Reproduced before the fix, with the driver's own API:

```
after run A  completedModes = ["deep-review"]
after run B  completedModes = ["deep-ai-council"]
run C would re-plan: ["deep-review", ...]
```

Run C re-planning `deep-review` is the precise failure the state file exists to
prevent: a mode whose authority already moved, queued to move again, in a
deployment with no rollback window. After the fix the same probe reports
`["deep-review","deep-ai-council"]` and run C plans neither.

**One unreadable authority record aborted the whole run.** The registry read sat
outside the step's error handling, so a malformed record on disk threw past the
driver into the CLI's top-level catch — exit 1, `RUNTIME_ERROR`, and no record of
where the run stopped, even though earlier modes may already have moved. It now
returns a `flip` failure for that mode and the driver stops cleanly and persists
it.

**The state file was overwritten in place.** A crash mid-write left truncated
JSON, and every later read then threw, making the run permanently unresumable and
the record of what already moved unrecoverable. It is now written to a temporary
file and renamed over the target.

## Found, confirmed, not fixed here

**Eight manifest surfaces belong to no mode.** Every one is `disposition:
project`, so each is meant to be projected from the ledger, yet no mode's
enablement covers it: `runtime-observability`, `fanout-ledger`,
`fanout-checkpoints`, `behavior-benchmark-output`,
`divergent-pivot-transactions`, `loop-guard-session-state`, `loop-guard-archive`,
`compiled-command-manifest`. Their writers are runtime-wide rather than
mode-scoped. Enabling all seven modes would still leave these eight unowned.

The risk table anticipates a mode with no manifest entry and calls it a failure to
investigate. It does not anticipate the reverse. Whether these surfaces flip with
the runtime rather than with a mode is a design question this phase cannot answer
by itself, so it is recorded rather than decided. `probe-orphans.mjs` reproduces
the census.

**Three surfaces are claimed by two modes each.** `improvement-config-manifests`,
`improvement-derived-state` and `improvement-ledgers` are attributed to both
`deep-improvement-common` and `agent-improvement`, because the manifest carries no
mode field and both own the `improvement-` prefix. The derivation reports the
overlap through `sharedWith` rather than silently picking a winner. It is a
property of the manifest, not a defect introduced here.

## Reviewed and accepted as-is

- `runFleetEnablement` resumes implicitly; only the CLI requires `--resume`. A
  library caller therefore resumes without the operator gate. It still skips
  completed modes, so it cannot re-move authority — the gate is a CLI policy and
  is left there deliberately.
- A prior state in which every mode completed still refuses a re-run without
  `--resume`, even though that re-run would do nothing.
- The registry is constructed before the driver knows whether any mode is
  planned, so a fully-completed run still creates the authority directory.
- Atomicity of the state write is verified by inspection, not by a test. A test
  that asserted the absence of a leftover temp file would stay green with the
  rename removed, which would make it an assertion that cannot fail. No such test
  was written.
