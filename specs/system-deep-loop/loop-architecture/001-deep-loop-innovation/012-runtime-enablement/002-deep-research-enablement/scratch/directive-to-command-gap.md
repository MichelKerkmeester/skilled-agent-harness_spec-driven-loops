---
title: "Why the directive-to-command step could not be executed"
trigger_phrases: []
---
# Why the directive-to-command step could not be executed

## The earlier reason was incomplete

Two items were held open with the reason that neither workflow variant had been run as an agent,
so the step from a manifest directive to the gateway command remained declared. That framing
implied the step worked and merely lacked a witness. It does not work. Executing it fails.

## What was run

A real directive row was taken verbatim from the research workflow, its placeholders filled, and
passed as the event JSON to the exact command the protocol block names:

    {"type":"event","event":"spec_check_result","folder_state":"existing", ...}

Result:

    exit 1
    {"ok":false,"phase":"runtime",
     "reason":"Unrecognized event format: expected object with stem or event_type",
     "code":"RUNTIME_ERROR"}

## Why

The command accepts an event JSON in one of three shapes: a canonical envelope carrying a `stem`
with `scope` and `data`, an object carrying `event_type` with a `payload`, or a fully prepared
event record. Every directive row in this workflow is legacy-shaped instead — `type` plus `event`,
or `type: spec_mutation`, `type: config`, `type: iteration`.

A library function exists that upcasts some legacy rows to canonical stems. Two facts make it
irrelevant here. The command never references it. And its event-name table maps three names only,
while a separate pinned set deliberately keeps other legacy events on the legacy path.

Counting the directive rows in the auto variant: 17 are `type: event`, 6 are `type: spec_mutation`,
1 is `type: config`, 1 is `type: iteration`. The block's `exempt_append_sites` value of 3 covers
the lifecycle sentinels only. So the block claimed the remaining rows reach the log through the
command, and the command accepts none of them in the shape the directives define.

## What changed

The paragraph asserting that each directive's record is written by invoking the command with that
record as the event JSON was false and is now corrected in both research variants. It states the
envelope the command actually accepts, that a legacy-shaped row is rejected with exit 1, that
translating a directive row into that envelope is a step the block does not yet define, and that
exit 1 is not the exit 2 refusal described elsewhere in the same block.

The paragraph about authorization, the ledger fence, the receipt and refreshing state_log was left
alone. For this mode it is accurate and was measured so: a canonical envelope through the same
command returns a receipt at sequence 1, refreshes the projected legacy file, and writes a
watermark.

## Effect on the two open items

They stay open, with the reason corrected. The gap is not a missing agent run. It is a missing
translation step between a legacy-shaped directive row and the canonical envelope the gateway
requires. Until that translation exists and is named, an agent following the block cannot complete
the route, and running one would only reproduce the exit 1 recorded above.

Defining that translation is a build: a mapping from every directive row this workflow emits to a
registered stem, plus the scope and data each stem requires. Several of those stems do not exist,
which is the same missing-schema condition already recorded for the lifecycle sentinels.
