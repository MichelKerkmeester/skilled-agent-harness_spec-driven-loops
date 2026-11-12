# Iteration 8: Measurement for command surfacing

## Focus

Angle 8 (measurement): the benchmark and fixture rows needed for every command group and for chat-style prompts, and the metrics that separate a missed command from a wrongly started one.

## Actions Taken

- Read the existing labeled-prompt corpus and counted its buckets.
- Read the calibration baseline and release-gate fields.
- Read the command metadata end-to-end test and the bridge resolution guard to see what exists today.
- Checked the doctor phrase-reach tool as the only per-bridge behavior proof.

## Findings

1. The labeled corpus has 195 rows across six buckets: `true_write` 32, `true_read_only` 31, `memory_save_resume` 32, `mixed_ambiguous` 32, `deep_loop_prompts` 36, and `skill_routing_prompts` 32. None of the buckets is keyed to the six command groups, so a create, design, doctor or prompt regression has no direct fixture row. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1]

2. The calibration baseline covers 200 corpus rows with a Brier score of 0.204829 and an expected calibration error of 0.138314, bucketed by confidence. It measures skill confidence quality, not whether a command was surfaced, missed or wrongly started. [SOURCE: .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json:5]

3. The release gate is skill-level: `holdoutTop1`, per-skill accuracy and UNKNOWN counts. No schema field counts command recall, command precision, ask decisions or unsafe command starts. [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:496]

4. The existing command tests are inventory tests, not behavior tests. `command-metadata-e2e` asserts that the 19 metadata commands project to their declared hub and owner mode and that the command file exists; `command-bridge-resolution-guard` asserts that every bridge slash id resolves to a command file. Neither measures what a prompt returns. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-metadata-e2e.vitest.ts:52] [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-bridge-resolution-guard.vitest.ts:1]

5. The doctor family already has the right shape of proof: `doctor-phrase-reach.cjs` checks that each admitted phrase reaches its route. There is no equivalent for the other five groups, which is why the doctor family is the only one with measured phrase reach. [SOURCE: .skilled/commands/doctor/_routes.yaml:36]

6. A complete fixture set needs, for each of the six groups, three row types: a plain-chat intent that should surface the group's command (recall), a near-miss against a competing skill that should either keep the command first or choose ask (discrimination), and a read-only or explicit-refusal prompt that should not start a mutating command (precision). Chat-style prompts must appear without a slash, with a partial slash, and with a quoted slash, and the set needs a child-session row for "a dispatched child must not start a command by itself". [INFERENCE: from the missing group buckets and the three policy states in iteration 4]

7. The metrics that separate the two failure classes are: `commandRecall@1` (missed command), `commandPrecision` and `unsafeRunRate` (wrongly started or wrongly run), `askRecall` and `askPrecision` (the run-or-ask decision), `skillCommandAgreement` (does the brief name the command the skill maps to), and `childAutoStartRate` (a child session starting a command without authority). A missed command is a recall failure with a silent brief; a wrongly started command is a precision or unsafe-run failure with a visible brief. [INFERENCE: from the run-or-ask policy and the measured zero-recommendation behavior]

8. Evidence against folding these rows into the existing 200-row calibration corpus: the baseline's Brier and ECE are tied to that corpus SHA, so adding command rows would move the calibration numbers and make a routing regression look like a calibration change. The command rows should live in a separate bucket or harness that reports its own metrics. [SOURCE: .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json:4]

## Ruled Out

- Reusing the skill accuracy gate as the command gate: it has no command class, so a command miss is scored the same as a skill miss.
- Adding command rows to the calibration corpus: it would invalidate the corpus hash and the Brier/ECE baseline.

## Dead Ends

- Looking for a command-level metric in the release-gate schema: only skill-level fields exist.

## Edge Cases

- Ambiguous input: "every command group" could mean the six namespaces or the 45 individual commands; the fixture rows are specified per group, with at least one row per command added only where the group has a discriminator.
- Contradictory evidence: none. The inventory tests and the measured gaps are consistent.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl:1`
- `.skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration-baseline.json:4-6`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:496`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-metadata-e2e.vitest.ts:52`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-bridge-resolution-guard.vitest.ts:1`
- `.skilled/commands/doctor/_routes.yaml:36`

## Assessment

- New information ratio: 0.8
- Questions addressed: Which benchmark and fixture rows are needed for every command group and for chat-style prompts, and which metrics separate a missed command from a wrongly started one?
- Questions answered: Which benchmark and fixture rows are needed for every command group and for chat-style prompts, and which metrics separate a missed command from a wrongly started one?

## Reflection

- What worked and why: reading the corpus buckets against the six command groups showed the gap as a set difference, which made the fixture requirement concrete.
- What did not work and why: searching for command metrics in the release schema returned only skill-level fields, which is itself the finding.
- What I would do differently: build one row per group first and run it through the current scorer to capture a baseline for command recall before specifying the whole matrix.

## Recommended Next Focus

Angle 9 (prior art): how other agent harnesses route a free-text request to a packaged workflow, from their public documentation.
