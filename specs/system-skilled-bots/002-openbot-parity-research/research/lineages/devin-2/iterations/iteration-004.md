# Iteration 4: A deterministic sentence-to-trigger planner

## Focus

Frontier node F-2-008 (depth 2, scope .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts, definition.ts): What is the smallest deterministic sentence-to-trigger planner that maps routine text onto cron, queue and git-hook kinds?

## Actions Taken

1. Re-read the skilled-bots cron parser and translator boundaries.
2. Read OpenMausBot's cron-to-preset parser and sentence renderer.
3. Read Rakazo's preset-to-cron and cron-to-preset functions and their round-trip tests.
4. Read the installer and slot-accounting code that assumes one trigger per definition.
5. Re-read OpenBot's split between the New-routine form and asking a Bot.

## Findings

1. Skilled bots' cron reader accepts only five-field cron or a fixed macro set and refuses anything else by name; it never parses natural language, and its output is launchd calendar dictionaries rather than an internal schedule model. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:185-208] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:267-303]
2. OpenMausBot has a deterministic cron-to-preset parser (`cronPreset`) covering every day, monthly day, monthly last day, yearly, weekdays, weekly and monthly-nth, plus a sentence renderer (`routineCronText`) that turns a preset into a human line. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/packages/phone-protocol/src/cron-label.ts:9-46] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/server/routine-cron-text.ts:39-42]
3. Rakazo has the reverse preset-to-cron function (`cronFromPreset`) over the same vocabulary, plus `presetFromCron` and a round-trip test table that pins every preset form to its cron string. [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/routines/schedule.ts:35-103] [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/routines/schedule.ts:105-145] [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/routines/schedule.test.ts:74-96]
4. Combining those two permissive implementations gives a deterministic sentence-to-cron bridge for a closed phrase set (every day, weekdays, weekly, monthly, yearly, interval), with raw cron passthrough for anything else; this mirrors OpenBot's own split, where the form covers common schedules and a Bot handles the rest conversationally. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:36-57] [INFERENCE: based on findings 2 and 3]
5. Event starts are a name-mapping problem, not natural-language parsing: "when a pull request opens" maps to the existing git-hook trigger or a named queue, and "when an email arrives" maps to a queue name that a future mail connector feeds. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:25-32] [SOURCE: .skilled/bin/bots.cjs:35]
6. The current definition holds exactly one `trigger` object, and both the installer and slot accounting depend on that: the installer refuses a non-cron trigger with `trigger-not-cron`, and slot accounting refuses any schedule index past zero because "a definition holds one trigger". [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:30-32] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:585-586] [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:208-210]
7. The smallest planner is a pure `planRoutine(text)` returning `{what, starts[], does, until?}`: a phrase table for the preset vocabulary, a trigger-name table for events, raw-cron passthrough, and an explicit `unparsed` result that falls back to the manual block or a conversation. No model call, no fuzzy matching, no new dependency. Size M because the schema moves from one trigger to a `starts` list; risk medium because installer, slot accounting and status all read `trigger`. [INFERENCE: based on findings 1-6]
8. A smaller v1 that keeps the single-trigger invariant is possible: one cron or one queue/git-hook start per routine, with `starts` rendered as a list of names. That is size S but leaves OpenBot's "a routine can have more than one start" gap open, so it is a fallback rather than the recommended target. [INFERENCE: based on finding 6]

## Ruled Out

- Using a model to parse routine sentences at run time: it adds nondeterminism and a model call to an authoring step that a closed phrase table can cover.
- Reusing OpenBot's planner directly: `planRoutine` maps form answers to OpenBot's routine/goal/check-in stores, not to skilled bots' trigger union, so only its four-part shape transfers.
- Treating every event phrase as a git-hook: only repository events map to the existing hook; mail and other external events need a queue producer, and claiming otherwise would overstate parity.

## Dead Ends

- Searching for a natural-language parser in skilled bots found only the cron reader; there is no text-to-schedule layer to extend.
- Reading OpenMausBot's `routine-cron-text.ts` as a parser would be wrong: it renders cron to a sentence, and the reverse direction lives in Rakazo's `cronFromPreset`.

## Edge Cases

- Ambiguous input: none. F-2-008 names the deterministic planner and the three trigger kinds.
- Contradictory evidence: none. OpenMausBot renders cron to text while Rakazo maps presets to cron; the two compose rather than conflict.
- Missing dependencies: none. All cited files were readable.
- Partial success: none. All five research actions returned evidence.

## Sources Consulted

- .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:185-208
- .skilled/skills/system-skilled-bots/runtime/lib/cron-translator.ts:267-303
- .skilled/skills/system-skilled-bots/runtime/lib/definition.ts:25-32
- .skilled/skills/system-skilled-bots/runtime/lib/installer.ts:585-586
- .skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts:208-210
- .skilled/bin/bots.cjs:35
- specs/system-skilled-bots/context/OpenBot-main/docs/routines.md:36-57
- specs/system-skilled-bots/context/OpenMausBot-main/packages/phone-protocol/src/cron-label.ts:9-46
- specs/system-skilled-bots/context/OpenMausBot-main/server/routine-cron-text.ts:39-42
- specs/system-skilled-bots/context/rakazo-main/packages/core/src/routines/schedule.ts:35-145
- specs/system-skilled-bots/context/rakazo-main/packages/core/src/routines/schedule.test.ts:74-96

## Assessment

- New information ratio: 0.9
- Questions addressed: F-2-008
- Questions answered: F-2-008

## Reflection

- What worked and why: Reading the two permissive implementations as complementary directions (cron to text, preset to cron) produced a deterministic bridge without inventing a grammar.
- What did not work and why: Looking for a parser in skilled bots found none, which is the gap rather than a missing dependency.
- What I would do differently: Read the single-trigger assumptions in the installer and slot accounting before designing the `starts` list, so the size estimate accounts for those readers from the start.

## Recommended Next Focus

Work F-2-009 (missed windows and the 15-minute floor), which decides how the planner's cron expressions behave when the host sleeps or the drain backs off. Then F-2-010 (routine guardrails).
