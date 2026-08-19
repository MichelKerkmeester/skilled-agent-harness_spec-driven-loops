# Projection coverage, measured through the shipped CLI

## Why this was checked

The state-write protocol blocks added to the deep-loop workflow assets told every mode to route
its canonical records through the append gateway, and asserted that the gateway "refreshes
state_log from the ledger. Exit 0 means the record is durable." That was never measured for any
mode other than research. This file records the measurement and what it does and does not show.

## What was run

Appends through `runtime/scripts/append-mode-event.cjs`, same command shape, different `--mode`,
each into a fresh empty run directory, each with a valid closed-shape event. The file column is a
full recursive walk of the run directory, not a list the script reports about itself.

| mode        | exit | `ok` | receipt seq | `projectionRefreshed` | legacy state file |
| ----------- | ---- | ---- | ----------- | --------------------- | ----------------- |
| `research`  | 0    | true | 1           | **true**              | `research/deep-research-state.jsonl` plus a projection watermark |
| `review`    | 0    | true | 1           | **false**             | **none** |
| `alignment` | 0    | true | 1           | **false**             | **none** |

Both non-research runs reported `No projection contract registered for mode <mode>`. Their run
directories held only ledger frames, audit-ledger frames, and the fencing coordinator's own
bookkeeping.

## Mechanism

`appendModeEvent` resolves a projection contract for the mode. When the caller supplies none it
falls back to a default resolver that returns a contract for research and `null` for everything
else. A null contract sets `projectionRefreshed` false, records the reason, and the function still
returns `ok: true`. The CLI supplies an event registry but never a projection contract, so every
invocation of the shipped script takes that fallback, and its exit code is derived from `ok` alone.

Two non-research modes were measured. The generalisation to the rest rests on that resolver being
a single unconditional `return null` for every mode outside research — a code fact, not a measured
one, and worth reading as such.

This is a wiring gap, not an impossibility. A caller that supplied a projection contract could
project for any mode; the shipped command is simply not that caller. Registering contracts is what
would make the original sentence true.

The projection phase is additionally wrapped in a try/catch that converts any thrown error into
the same non-fatal shape, so a projection that fails for an unrelated reason is also
indistinguishable from success at the exit code.

## What was actually false

Precision matters here, because an earlier draft of this note overstated it.

"Exit 0 means the record is durable" was **true and remains true**. Durability comes from the
fenced ledger write, evidenced by the ledger and audit frames and the grant journal, all of which
were produced in every run including the ones where projection did nothing. The projected state
file is a derived view, not the durable record.

The false clause was "and refreshes state_log from the ledger". For the five non-research modes
carrying the block, the gateway does not do that. Standing next to a true durability claim, the
false clause read as covering the legacy file too, which is what made it load-bearing: a workflow
following the block would have written to the ledger, seen exit 0, left the legacy state file
untouched, and been told not to write that file directly. Existing readers of that file would then
see a run that never progressed.

## What was changed

The blocks for the five non-research modes now say the gateway does not refresh their legacy file,
that exit 0 means durable in the ledger and nothing more, and that their existing direct writes
must stay until a projection contract exists. The opening sentence was changed from an
accomplished fact to a statement of intended mechanism so the two halves stop contradicting each
other. The research blocks were left untouched, because for research the original text is
accurate and measured so.

Retaining those direct writes conflicts with no guard: the declaration-coverage checker requires
direct appends to be declared and counted, which they already are, and it does not forbid them.

## Guard evidence

The checker was driven to red against the live tree, not only in unit tests: with `mechanism`
altered to a non-gateway value it exited 2 with `UNDECLARED_APPEND_MECHANISM` naming the file;
restored, it exited 0. Both outcomes observed in sequence.

## Not addressed here

Registering projection contracts for the remaining modes is the work that would make the original
assertion true. Each needs a reducer and a contract matching its own legacy file shape. That is a
build, not a correction, and it is not attempted here.

One pre-existing parse failure was observed in `deep-model-benchmark-confirm.yaml` at a line far
outside the edited region. It reproduces on the unmodified file from git history, so it is
unrelated to these edits and was left alone.
