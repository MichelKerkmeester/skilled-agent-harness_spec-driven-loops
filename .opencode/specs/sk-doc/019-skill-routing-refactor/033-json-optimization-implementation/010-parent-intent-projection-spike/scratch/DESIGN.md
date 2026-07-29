# Parent Intent Projection Spike

## Mechanism

The projection injects selected hub-router vocabulary into the authored
`graph-metadata.json.derived` channel.
Intent-shaped phrases enter `derived.trigger_phrases` first; overflow enters
`derived.key_topics` within a separate bounded budget.
The skill advisor already reads both fields during parent selection.
No scorer lane, feature, formula, or weight is added.
The prototype writes a full scratch copy and mutates no live skill or scorer source.

## Selection Rules

Inputs are every `hub-router.json.vocabularyClasses.*.keywords` value.
Inputs also include every `mode-registry.json.modes[].aliases` value.
Case-insensitive source duplicates fold into one phrase with combined provenance.
Token counting mirrors `scorer/text.ts`: all `\b\w+\b` tokens count.
The specificity formula is `min(0.7 + 0.18 * (tokens - 1), 1)`.
The `0.88` floor requires two tokens and removes broad one-word aliases.
A fleet gate then scans every other direct skill root.
It checks top-level and derived intent fields plus description keywords.
A case-insensitive substring match rejects the candidate as non-distinctive.
Existing sk-doc triggers, topics, and intent signals are excluded.
Survivors rank by token count descending, then stable authored source order.

## Capacity

Schema caps are 24 triggers and 48 topics; targets are 20 and 44.
This reserves four slots in each field for canonical generation.
Trigger slots are filled first because the candidates are intent-shaped aliases.
The remaining ranked phrases use the key-topic budget.
Candidates beyond both budgets are dropped.

## Production Freshness

A production version belongs in the canonical derived-metadata regenerator.
Hub-router or mode-registry changes should trigger deterministic regeneration.
The hook should compare generated output with checked-in metadata and fail on drift.
Phase 009's canonical producer must own the write to avoid competing generators.

## Risks

Cap crowding can displace stronger generated phrases despite token-count ranking.
The four-slot reserve may still be too small for phase 009 generation headroom.
Vocabulary drift can leave stale projections if the regenerator hook is bypassed.
Substring matching can reject useful phrases embedded in another root's longer term.
Mode aliases can describe implementation detail rather than parent-level intent.
Corpus measurement is required before treating this mechanism as production-ready.
