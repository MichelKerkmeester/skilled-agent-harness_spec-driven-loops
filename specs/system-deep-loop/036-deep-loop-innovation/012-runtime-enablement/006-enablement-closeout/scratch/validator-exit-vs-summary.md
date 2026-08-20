# The validator's summary and its exit code disagree

## What every phase in this packet has been reading

Each phase records `validate.sh <folder> --strict` as `Errors: 0  Warnings: 0` and `RESULT: PASSED`.
That reading is accurate. It is also incomplete in a way none of those records could have detected.

Measured without a pipeline in the way, so the status is the validator's own and not some later
command's:

    001-append-gateway-and-projection  -> exit=2   Errors: 0  Warnings: 0   RESULT: PASSED
    004-legacy-writer-retirement       -> exit=2   Errors: 0  Warnings: 0   RESULT: PASSED
    005-whole-system-gate              -> exit=2   Errors: 0  Warnings: 0   RESULT: PASSED
    002-deep-research-enablement       -> exit=2   Errors: 0  Warnings: 0
    006-enablement-closeout            -> exit=2   Errors: 0  Warnings: 0

The exit code has been 2 the whole time. Earlier readings of "exit 0" in this work came from a
pipeline, where `$?` reports the status of the last stage — a `grep` — rather than the validator's.

## It is not this packet

The same command against an unrelated packet behaves identically:

    specs/agents/001-terminal-proof-discipline -> exit=2  Errors: 0  Warnings: 0  RESULT: PASSED

Without `--strict` the same folder exits 0. So `--strict` returns 2 for every folder in the
repository regardless of its contents.

## Where the 2 comes from

Traced by execution rather than inspection:

    + validate-command-tree-parity.sh --quiet
    + parity_rc=1
    + (( parity_rc > rc ))
    + rc=2
    + exit 2

`COMMAND_TREE_PARITY` is a strict-only rule. It runs after the summary is printed, its failure is
never added to the error tally, and its escalated status becomes the script's exit code.

The rule is failing on command-mirror drift entirely unrelated to this packet:

    MISSING .claude/commands/rewrite/response.md
    MISSING .claude/commands/rewrite/response-by-external-agent.md
    EXTRA   .claude/commands/rewrite-response.md
    EXTRA   .claude/commands/rewrite-response-by-external-agent.md
    STALE   .cursor/commands/rewrite-response.md — broken symlink

The mirrors are flat symlinks where the checker expects a nested directory. They are dated before
this work, and no commit in this packet touches those paths.

## Why this matters beyond the fix

`COMMAND_TREE_PARITY` appears **zero times** in the validator's full recursive report. The rule that
decides the exit code is absent from the human-readable output it accompanies. A reader who checks
the summary sees a green that structurally cannot show this class of failure, and a reader who checks
the exit code sees a red with no explanation anywhere in the report.

That is the same defect this packet has been correcting all along, in the tool used to certify the
corrections: a signal whose displayed value is disconnected from what it actually measured. Here it
fails safe rather than dangerously — the exit code is pessimistic, not optimistic — but the two
halves still disagree, and only one of them is visible.

## Not fixed here

The drift is in the `rewrite` command tree and its mirrors for other runtimes. That is outside this
packet's scope and outward-facing for tools other than this one, so it is reported rather than
repaired. Regenerating those mirrors, or teaching the summary to print strict-only rule outcomes, are
both changes that belong to whoever owns that surface.

The packet's own state is unaffected: the validation orchestrator run directly against a phase folder
returns `passed: true`, `{"errors":0,"warnings":0}`, exit 0.
