# The composition seam, wired

## What this closes and what it does not

The phase's in-scope work includes wiring the shared composition seam so the canonical persistence
boundary resolves through the gateway. That wiring did not exist: a legacy-shaped directive row
passed to the gateway command returned `exit 1` and `Unrecognized event format`.

It exists now. It does not close the requirement, and the measured coverage says why.

## What was built

The command gained a fourth record-resolution branch, tried only after the three existing branches
fail to match and only for the research mode. It runs the record through the existing compatibility
decision and upcaster, then feeds the resulting canonical stem, scope, data, prevEventHash and
replay through the same prepare path the explicit-stem branch already used. That path was extracted
into a shared helper rather than copied, so the two branches cannot drift.

A refusal throws with the decision's own reason code, so a caller learns why a row was rejected
rather than only that it was. Upcast warnings are surfaced on the success output, so a lossy
migration is visible instead of silent.

## Measured, driving the shipped command

| input | result |
| ----- | ------ |
| legacy `type: config` row | `exit 0`, receipt sequence 1, `projectionRefreshed` true, warning surfaced, 6 files written |
| canonical stem envelope | `exit 0`, sequence 1, projection refreshed, no warnings key — unchanged |
| unmappable legacy row | `exit 1`, `Legacy deep-research record refused: unknown-legacy-record`, 0 files |
| same row under a non-research mode | `exit 1`, original `Unrecognized event format`, 0 files |

Negative control on the refusal branch: 4 passed, condition forced false gave 1 failed and 3
passed with the refusal case naming itself, restored 4 passed.

Regression across nine adjacent suites: 197 passed, 1 failed. That one failure is the pre-existing
stale census path in another packet's folder, unchanged by this work.

## Coverage, which is the honest number

Every distinct record shape the research auto workflow emits through its append directives was
driven through the seam. **One of fifteen rows round-trips.** The rest refuse.

| shape | rows | result |
| ----- | ---: | ------ |
| `event` / `blocked_stop` | 1 | round-trips |
| `event` (six other names, including `spec_check_result`, `config_warning`, `lock_released`) | 8 | refused |
| `spec_mutation` (five variants) | 6 | refused |

The upcaster's event table maps three names, and a pinned set deliberately keeps other legacy
events on the old path. Nothing maps `spec_mutation` at all.

So the seam is real and the refusals are now diagnosable by name rather than generic, but coverage
is one row in fifteen. Claiming the directive-to-command gap is closed would be wrong. Closing it
needs event stems that do not exist yet, which is schema work beyond wiring.

## Limitation worth stating

The upcast is lossy by construction, and says so: the config path reuses one digest for both
charter and configuration evidence, and emits a warning to that effect. That warning now reaches
the caller. Whether a lossy upcast belongs on a persistence path at all is a judgement the schema
work should settle, because a ledger whose evidence fields are synthesised is weaker than one whose
fields are recorded.
