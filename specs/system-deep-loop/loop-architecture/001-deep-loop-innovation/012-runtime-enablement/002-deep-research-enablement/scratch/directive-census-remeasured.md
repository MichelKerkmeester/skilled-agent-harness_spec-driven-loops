---
title: "The directive-to-command gap, re-measured"
trigger_phrases: []
---
# The directive-to-command gap, re-measured

`directive-to-command-gap.md` recorded that a directive row fails with
`Unrecognized event format: expected object with stem or event_type`, because the command never
references the upcaster. Re-running it shows that reason has decayed. Every claim below is a
command invocation against a scratch run directory, not a reading.

## The machinery it says is missing already exists

`append-mode-event.cjs:453` calls `upcastLegacyDeepResearchRecord`, and the branch at `:427`
routes any object to it when the mode is deep-research — placed last so canonical envelopes keep
their fast path. A legacy row therefore reaches the upcaster and is refused there BY NAME. It
never reaches the final throw the earlier note quotes.

## Four outcomes, not one

Every distinct directive shape in the auto variant was executed. Placeholder-filled real rows were
used where a stub proved too thin.

**Writes through the gateway, `ok: true` (4):** `blocked_stop`, `resumed`, `restarted`,
and `type: iteration`.

**Refused on purpose (3):** `config_warning`, `graph_convergence`, `lock_released` return
`legacy-event-has-no-lossless-mode-event`. This is a deliberate pin, not a gap. Inventing canonical
stems for these would discard the very information the pin exists to preserve, so they are not work.

**Unmapped, and the actual build (11):** `migration`, `min_iterations_guard_pass`, `paused`,
`spec_check_result`, `spec_mutation`, `spec_mutation_conflict`, `spec_preinit_context_added`,
`spec_preinit_context_deduped`, `spec_seed_created`, `stuck_recovery`, and `type: spec_mutation`
all return `unknown-legacy-record`.

**Untested (1):** `type: config` failed on a stub payload; it was not retried with a filled row.

## Why the first measurement misled

A thin stub carrying only run, runId and lineageId made `resumed` and `restarted` report
`Payload validator rejected the event`, which reads as a missing mapping. Both are in the mapping
table and both succeed once the row carries its real fields. The probe was wrong, not the code.

## What this changes

The earlier note frames the work as a mapping from every directive row the workflow emits. Measured,
it is eleven unmapped rows needing registered stems. Four already work and three must keep failing.
Counting the pinned rows as gaps would inflate the work and push toward a lossy translation that
defeats the pin.
