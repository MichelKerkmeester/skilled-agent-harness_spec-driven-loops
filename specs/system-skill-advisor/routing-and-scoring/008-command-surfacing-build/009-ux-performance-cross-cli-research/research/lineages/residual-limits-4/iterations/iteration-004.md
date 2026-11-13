# Iteration 4: Can the OpenCode store prove delivery, or must the plugin write a marker?

## Focus

Verification of the one build named in iteration 3. The build assumed the plugin must write a new delivery receipt because the OpenCode store keeps no trace. That assumption was unmeasured. This iteration inspects the store read-only: every arena session the final arm used, its message types, and whether the only `Advisor:` text in it is model output or an injected record. The answer decides whether the build is a new write or only a new reader.

## Actions Taken

- Took the 24 `sessionId` values from the OpenCode lines of `runs-final.jsonl` and queried `~/.local/share/opencode/opencode.db` read-only.
- Counted `session_message` rows by `type` across those 24 sessions, counted distinct sessions present, and counted distinct sessions whose rows contain `Advisor:`.
- Inspected one session (`ses_e2c74072effe6JtR9VvvJRGvVn`) at message-type level, without printing any message body.
- Read `command-offer.mjs:220-284` and `.opencode/plugins/system-skill-advisor.js:975-992` to name where a reader or a writer would land.

Measured output, store census over the 24 OpenCode sessions:

```
assistant|513
idle|24
synthetic|1
user|24
```

```
distinct sessions with an Advisor quote = 10
distinct sessions present = 24
```

## Findings

1. All 24 OpenCode arena sessions are present in the store, and their 562 message rows are 513 `assistant`, 24 `idle`, 24 `user` and 1 `synthetic`; there is no injected-context or system row type at all. The store has every session but no record of what the plugin injected. [SOURCE: ~/.local/share/opencode/opencode.db] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-final.jsonl]

2. Ten of the 24 sessions contain the string `Advisor:` and every one of those hits is in an `assistant` row, which is the model quoting the head, not the host recording an injection. A store-based delivery check would therefore report 10 of 24 as delivered and 14 as missing, and it would count model output as delivery evidence, which is both false-positive and prompt-text exposure. [SOURCE: ~/.local/share/opencode/opencode.db]

3. The build is a new prompt-free write, not a new reader. The plugin already computes the emitted block in `observeEmittedAdvisorBlock` and can append a bounded receipt (session id, block hash, runtime, epoch) beside the health records; `briefDelivered` then gains an `opencode` branch that reads that receipt and never the session text. [SOURCE: .opencode/plugins/system-skill-advisor.js:975] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:220]

4. The key space for the receipt is proven: all 24 OpenCode run lines carry a `sessionId` and a `projectDir`, and `SPECKIT_` is already in the behaviour runner's child-environment allowlist, so a `SPECKIT_SKILL_ADVISOR_METRICS_DIR`-style path reaches the plugin without changing the allowlist. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-final.jsonl] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:830]

## Ruled Out

- A reader-only fix against `session_message`: 10 of 24 sessions would read as delivered on assistant text alone, so the check would be wrong on 14 rows and truthy on model output.
- Reading message bodies for the brief text: it is model output, and it would put prompt-adjacent text in a score log.
- A plugin-local in-memory receipt: the arena turn ends the process, so only a durable write survives to scoring time.

## Dead Ends

- `instruction_entry` and `instruction_blob`: 0 entries for these sessions, so the injected block is not in the instruction tables either.
- `part` and `message`: 0 rows for the arena session; the live table is `session_message`.

## Edge Cases

- Ambiguous input: none. The iteration verifies one build.
- Contradictory evidence: the goal log says OpenCode "quoted by the model in 10"; the store census reproduces exactly 10 sessions, and both are consistent once the quotes are read as model output rather than delivery.
- Missing dependencies: the arena's own HOME was not isolated for OpenCode, so its sessions live in the operator's store; the query is read-only and prints only counts and types.
- Partial success: none.

## Sources Consulted

- `~/.local/share/opencode/opencode.db` (read-only queries)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-final.jsonl`
- `.opencode/plugins/system-skill-advisor.js`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs`

## Assessment

- New information ratio: 0.75
- Questions addressed: KQ3 (verification of the recommended build)
- Questions answered: none new; KQ3 was answered in iteration 3 and this iteration fixes the build's shape

## Reflection

- What worked and why: querying the store by message `type` rather than by text separated host records from model output, which is exactly the distinction a delivery check needs.
- What did not work and why: looking for a `system` row type found none, so there is no existing host record to read; the marker is not optional.
- What I would do differently: run the type census before recommending the build, so the write-versus-read decision is measured in the same iteration as the recommendation.

## Recommended Next Focus

No further measurement is needed for this lane. All three key questions are answered, the one build has its files, gain and check, and the remaining items are operator-owned or hypotheses that need a live arm this lane may not run. Synthesis should record the convergence with `all_questions_answered`.
