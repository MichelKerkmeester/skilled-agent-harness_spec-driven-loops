# Review Iteration 003 — fixes-11

**Lineage:** `fixes-11` (detached fan-out, review pass eleven)
**Artifact dir:** `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/fixes-11`
**Session:** `fanout-fixes-11-1794851543294-mlt3r6`

## Dispatcher

- **Operator review focus (bound):** review pass eleven, area `fixes`, per `review/review-brief-11.txt`. This iteration attacked the same focus from the safety side: whether the single-quote fold lets a refusal or question reach a mutating command, and whether the doctor install's printed writing commands can carry anything beyond the values the operator gave.
- **Dimension this iteration:** security.
- **Dimensions planned:** correctness (done), traceability (done), security, maintainability.
- **Steer file:** absent at iteration start.

## Files Reviewed

| File | Under |
|------|-------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | security |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | security |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | security |
| `.skilled/commands/doctor/assets/doctor-install.yaml` | security |
| `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` | security |

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Refusing the retired `/create:skill` name still delivers `/create:sk-skill`** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:259` -- `typedCommandForTop` resolves the typed name through `RETIRED_COMMANDS` (`file:217-219`, `:243`) and then runs the refusal guard against the **mapped** command (`file:259`). The prompt contains only the retired name, so `commandOnlyMentioned` finds zero occurrences of the mapped name and returns `false`, and the successor is delivered. `attachCommand` has the same shape when a route selects the successor mode: it guards `commands[workflowMode]` (`file:504`), and a prompt that refuses only the old name never contains the new name. The information needed to withhold the offer is present: guarding the typed name `/create:skill` returns `true`.
Case: prompt `do not run /create:skill yet, just explain`; `typedCommandForTop('sk-doc', prompt)` returns `{"command":"/create:sk-skill","policy":"start","ownerSkillId":"sk-doc"}`, and `attachCommand('sk-doc', {action:'route',selectionKind:'single',targets:[{workflowMode:'sk-create-skill'}]}, prompt)` returns `/create:sk-skill`.
Finding class: security (a refusal bypass that delivers a mutating creation command under its renamed successor).
Scope proof: the input is ordinary chat text; the retired name is supported deliberately, per the comment at `file:213-216` ("A command that was renamed is still typed from habit"); both production paths are in the reviewed file (`file:259`, `file:504`); no shell, config, or runtime surface is required.
Affected surface hints: `RETIRED_COMMANDS`, `typedCommandForTop`, `attachCommand`, the `MODE_COMMANDS['sk-doc']['sk-create-skill']` row, and every retired-name alias added later.

```json
{
  "type": "claim_adjudication",
  "findingId": "FIX11-P1-002",
  "claim": "A prompt that refuses the retired command name /create:skill still receives /create:sk-skill from typedCommandForTop, and from attachCommand when the route selects the successor mode, because the refusal guard reads the mapped command name rather than the name the reader typed.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:217-219",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:243",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:259",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:504"
  ],
  "counterevidenceSought": "Ran the shipped compiled module. Controls: `do not run /create:sk-skill yet` returns `undefined` from typedCommandForTop (the canonical name is guarded correctly), and `commandOnlyMentioned('do not run /create:skill yet, just explain', '/create:skill')` returns `true` (the refusal IS readable when the typed name is passed). Tested both delivery paths: typedCommandForTop returned the successor, attachCommand returned the successor on a single-target route for sk-create-skill. Checked that `policy` is `start`, so the successor asks before writing rather than writing immediately.",
  "alternativeExplanation": "The behaviour could be intended if the retired name were not reachable in the shipped tables or if a refusal never routes to the successor mode. The retired mapping exists specifically because readers type the old name, and both call sites returned the command without needing a crafted route.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade to P2 if the retired name is removed from the shipped command surface, or if the successor mode can never be selected for a prompt that only refuses the old name. Upgrade toward P0 only if the successor can write without any further operator confirmation."
}
```

### P2 Findings

None new this iteration.

## Traceability Checks

No new protocol was run this iteration. The security review used the two production call sites (`command-attach.ts:259`, `:504`) and the doctor printed-command invariants (`doctor-install-presentation.txt:5`, `:139`) as its evidence base.

## Integration Evidence

- **Guard call sites:** `attachCommand` (`command-attach.ts:504`) and `typedCommandForTop` (`command-attach.ts:259`) both call the guard before returning a command; both were exercised through the compiled module for the probes below.
- **Retired-name table:** `RETIRED_COMMANDS` at `command-attach.ts:217-219` maps `/create:skill` to `/create:sk-skill`; `typedCommandIn` applies the mapping at `:243`, before the guard sees the command.
- **Doctor runtime validation:** `symlink-engine.cjs:435-438` throws `UsageError: unknown runtime: <name>` for any runtime the manifest does not hold, so a printed step that carried an unaccepted name would fail closed when the operator runs it.
- **Printed-command invariants:** `doctor-install-presentation.txt:5` says every writing step is printed and the operator runs it; `:139` says a printed step is handed back, never run, and no argument is added beyond the values the operator gave. `doctor-install.yaml:60` repeats "never run them".
- **Re-ask rule for unaccepted answers:** `doctor-install-presentation.txt:78` tells the guide an unknown runtime name "is not guessed. Ask that one question again with the accepted values", and `doctor-install.yaml:58` asks with the accepted eight.

## Edge Cases

- **Line break between a refusal and the command.** `do not run\n'/create:readme' yet` returns `false` from the compiled guard, so the command would be offered. This is the documented sentence-boundary rule at `command-attach.ts:411-413` ("a line break survives as the sentence end it is"), not a defect introduced by the quote fold: the fold does not run across the break. Recorded as intended behavior, with the risk that a bulleted refusal split across lines is not honoured.
- **Long adversarial or-list.** A 7,115-character prompt with 400 quoted `or` entries returned `false` in 2 ms, so the per-occurrence regex construction does not open a practical denial-of-service path.
- **Operator-supplied runtime string.** A hostile runtime answer such as `claude; rm -rf ~` is a name outside the accepted set, which the guide is instructed to re-ask (`presentation:78`) and the engine rejects (`symlink-engine.cjs:435-438`). The residual risk is a human copying a printed line into a shell; the command is a template with `<list>` and the guide is told to ask again, so this stays a defensive-depth note rather than a finding.
- **Retired-name reach.** The retired mapping exists because readers type the old name from habit (`command-attach.ts:213-216`); that is what makes the P1 reachable rather than hypothetical.

## Confirmed-Clean Surfaces

- No reviewed file reads environment variables, credentials, or session stores; the changed surface is pure text processing plus a contract test.
- No reviewed artifact contains directive-like text aimed at an agent; the presentation's instructions are operator-facing and addressed to the guide.
- Quote-mark permutations around a single command hold: straight, curly, double, backticked, with `the`, with `this`, with `command`, with a trailing clause (`do not run '/create:readme', just explain`) and with an apostrophe in the lead (`don't run …`) all return `true` against the compiled module.
- Question forms hold: `what does the '/create:readme' command do?` returns `true`; `what's '/create:readme' for?` returns `true`.
- The canonical name is guarded: `typedCommandForTop('sk-doc', 'do not run /create:sk-skill yet')` returns `undefined`.
- No secrets, tokens, or holdout prompt text were read or printed during this iteration; the holdout rule was observed by not opening any prompt corpus file.

## Ruled Out

- **ReDoS in the mention guard** — 7,115-character adversarial input returned in 2 ms; the regexes are bounded by prompt size and no catastrophic backtracking was observed.
- **Doctor printed command as an injection path** — an unaccepted runtime name is refused by the engine at execution (`symlink-engine.cjs:435-438`) and the presentation instructs a re-ask (`presentation:78`); no reviewed code substitutes an unvalidated value into an executed command.
- **Guard bypass through curly or double quotes** — the fold removes `“”` whole and normalizes `‘’` before the quote rule; both refusal shapes return `true`.
- **Guard bypass through the canonical successor name** — refusing `/create:sk-skill` by its current name returns `undefined` from `typedCommandForTop`; the bypass is specific to the retired alias.
- **A second quoted-shape evasion** — beyond the quoted or-list shape already recorded as `FIX11-P1-001`, the tested quote permutations either refuse correctly or are the documented sentence-boundary case.

## Next Focus

- **Dimension:** maintainability.
- **Focus area:** the contract test's now-redundant count assertion and its two runtime-list surfaces, the new fold comment's readability and its missing note about the closing quote, and the test table's naming around quote markup.
- **Reason:** security added one P1 with a root cause distinct from the quote fold; the remaining work is the low-severity clarity and drift cost in the same five files.
- **Rotation status:** correctness, traceability and security reviewed; maintainability closes the rotation.
- **Blocked/productive carry-forward:** security is productive (one P1 with a distinct root cause, reachable through two paths); no approach is blocked.
- **Required evidence:** exact assertion lines in the contract test, the comment block at `command-attach.ts:409-421`, and the test table heading at `command-attach-guards.vitest.ts:172`.

**Stop decision after iteration 2:** CONTINUE; `stopReason` none; `blockedBy` empty; the coverage gate named `security` and `maintainability` as missing, and `security` is now covered.

Review verdict: CONDITIONAL
