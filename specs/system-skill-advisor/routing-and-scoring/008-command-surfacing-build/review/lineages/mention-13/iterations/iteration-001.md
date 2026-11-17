# Review Iteration 001 - mention-13

## Dispatcher

- Mode: review. Target agent: `@deep-review`, executed in-process by this detached fan-out lineage (no nested dispatch).
- Session: `fanout-mention-13-1794865302020-qunumz`, generation 1, lineage `mention-13` under `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/mention-13`.
- Iteration: 1 of 8. Dimension: correctness. Focus: the two new tail rules and the widened occurrence boundary in `commandOnlyMentioned`, plus the new typed start boundary.
- Operator review focus, and how this iteration addressed it: pass thirteen's brief asks for a request that now reads as a mention, and for a refusal or question shape still read as a request. This iteration read `review-brief-13.txt` and `review-scope-13.txt` first, diffed the two mention scope files between `b8ebee37d75` and `932aff4e437`, read both whole files, and then ran the module's exported guards over 34 concrete prompts. It found two request shapes that now read as mentions (F001, F002) and two refusal/question shapes still read as requests (F003, F004).

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1-566` (whole file at `932aff4e437`; working tree bytes match that commit)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:197-245` (typed reader, focused reread)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:359-476` (lead lists, new tail rules, mention function, focused reread)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:1-615` (whole file at `932aff4e437`)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:138-320` (mention suite, focused reread)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:509-597` (typed boundary suite, focused reread)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1200-1216` (`withholdMentionedCommands`, the consumer)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-13.txt:1-10`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-scope-13.txt:1-6`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/spec.md:40-202`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/tasks.md:37-46,130-131`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/acceptance-criteria.md:56`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/command-offer-fit-gates.md:3-123`

## Findings - New

### P0 Findings

None. No input tested produces data loss, an executed command the reader did not type, or an authorization change; every failure here is a withheld or a wrongly offered command. `commandOnlyMentioned` is a filter over an offer, so its worst case is a lost offer, not an unsafe run: `attachCommand` returns `undefined` and `withholdMentionedCommands` clears a command row, and the reader can still run the command by hand.

### P1 Findings

1. **A document naming returns a mention before a later request clause is read** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:458` -- `COMMAND_AS_DOCUMENT` returns `true` from `commandOnlyMentioned` on the document noun alone, so the `COMMAND_ASKED_BY_PRONOUN` check at line 460 never runs for that occurrence. `open the /deep:review command file, then run it` reads as a mention, and `typedCommandForTop('system-deep-loop', ...)` returns `undefined` for a prompt that literally asks to run the command. The same shadowing withholds a hub command the reader asked for: `attachCommand('system-deep-loop', SINGLE('review'), 'read the /deep:review docs, then do a thorough review of this diff')` returns `undefined` although `DEPTH_REQUEST` matches `thorough` at line 323. The function's own contract at lines 403-407 says a clause that opens with a use verb and `it` turns an earlier naming into a request, and the diff placed the new early return ahead of it.
   Finding class: logic-ordering
   Scope proof: Ran the exported `commandOnlyMentioned` and `typedCommandForTop` on the two prompts above; both classify as mentions. The old tree had no `COMMAND_AS_DOCUMENT` return, and the unchanged pronoun regex matches the tail `command file, then run it`, so the earlier read was a request. `REQUEST6`/`CONTROL5` do not carry a document naming, which is why the suite stays green.
   Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts`
   Case: `open the /deep:review command file, then run it` typed by a reader who wants the review run, and `read the /deep:review docs, then do a thorough review of this diff` on a hub route to the review mode.

```json
{
  "type": "claim-adjudication",
  "findingId": "F001",
  "claim": "The new document rule returns a mention before the existing pronoun-request rule can read a later request, so a prompt that asks to run the command loses it.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:458",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:460",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:403-407",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:527"
  ],
  "counterevidenceSought": "Checked whether the determiner requirement or the tail split already excludes these prompts. It does not: `the /deep:review` satisfies the determiner test at line 458, and the tail starts with ` command file`, which `COMMAND_AS_DOCUMENT` accepts. Checked whether the deep-loop depth gate rescues the hub case; it is consulted after the mention check at line 527, so it never runs.",
  "alternativeExplanation": "A reader naming the command file may be assumed not to want the run. Rejected: both prompts carry an explicit later request (`then run it`, `do a thorough review`), and the function's own comment says that clause wins.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade to P2 if a follow-up shows no caller reaches `commandOnlyMentioned` with a document naming plus a later request, or if the document rule is moved after the pronoun-request check and the two prompts then read as requests."
}
```

2. **A limiting negation after the name reads as a refusal** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:413` -- `COMMAND_DECLINED_BY_PRONOUN` ends at `it\b`, so any qualifier after `it` still satisfies the refusal: `run /speckit:save and don't run it twice` reads as a mention, `typedCommandForTop('system-spec-kit', ...)` returns `undefined`, and `run /deep:review but never run it without a budget` does the same on the hub path. The comment at lines 409-412 claims the rule keeps a request a request, and the packet records this exact risk as High at `spec.md:150` with `REQUEST6`, `CONTROL5` and the wrapper matrix as the mitigation; none of those rows carries a limiting clause after `it`, so the mitigation does not cover the shape it names.
   Finding class: logic-overreach
   Scope proof: Ran the exported guards on both prompts; both classify as mentions and `typedCommandForTop` drops the typed command. The unchanged lead tests cannot produce this reading: the only decline lead before the name would need `do not run /speckit:save`, and the bare-ask lead is false, so on `b8ebee37d75` the prompt returned a request.
   Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts`
   Case: `run /speckit:save and don't run it twice`, and `run /deep:review but never run it without a budget`, both typed requests with a limit rather than a refusal.

```json
{
  "type": "claim-adjudication",
  "findingId": "F002",
  "claim": "The tail refusal matches a negated use verb plus `it` without bounding what follows, so a request that limits how the command runs is read as a refusal and the command is dropped.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:413",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:459",
    "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/spec.md:150",
    ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:58-73"
  ],
  "counterevidenceSought": "Searched the fixtures for a limiting clause after `it`: `REQUEST6` has `don't forget to run`, `CONTROL5` has `never mind just run`, and the one negative tail row is `don't skip it`. None exercises `don't run it <qualifier>`, so no existing row contradicts the reproduction. Checked the `why not` guard at line 367; it does not apply to `don't`.",
  "alternativeExplanation": "`don't run it twice` could be read as refusing the second run, which is still a refusal of a run. Rejected as the intended reading here: the clause limits a run the reader already asked for, and the function's stated job is to keep a request a request.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "Downgrade to P2 if the tail rule is narrowed to refuse only a clause that ends at `it` or continues with a sentence boundary, and these prompts then read as requests."
}
```

### P2 Findings

1. **A markdown link label abuts its target and the naming stops being an occurrence** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:441` -- the fold drops `[`, `]`, `(` and `)`, so `[/create:readme](https://example.com/docs)` becomes `/create:readmehttps://example.com/docs`; the lookahead added at line 451 (`(?![a-z0-9_-]|[./][a-z0-9])`) then rejects the name because it is followed by `h`, `occurrences.length` is 0 at line 452, and the function returns `false`. `do not run [/create:readme](https://example.com/docs) yet` therefore reads as a request and `attachCommand('sk-doc', SINGLE('sk-create-readme'), ...)` returns `/create:readme`. The wrapper matrix pins `[name]` with nothing after the closing bracket, which is the one form where the fold is safe.
   Finding class: normalization-edge
   Scope proof: Probed the exported guard and `attachCommand` with the linked label, a parenthesized aside with no space (`/create:readme(see note below)`) and the bracketed form the matrix covers; only the merged forms flip to request. `withholdMentionedCommands` at `fusion.ts:1213` keeps the command row on the same reading.
   Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts`
   Case: `do not run [/create:readme](https://example.com/docs) yet`, and `do not run /create:readme(see note below)`, both refusals written in chat markdown.

2. **The post-name reader covers one clause shape, so a question or a sibling refusal after the name still reads as a request** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:459` -- the new rule reads `(do not|don't|dont|never) <use verb> it` after the name, while the ask rule at line 460 requires the clause to open with a use verb. `COMMAND_ASK_LEADS` only matches before the name, so `/create:readme, what does it do?` reads as a request and `attachCommand` offers `/create:readme`, and a refusal that uses a lead from `COMMAND_DECLINE_LEADS` other than the four negations, such as `skip` at line 376, is missed too: `/create:readme is wrong, skip it` reads as a request.
   Finding class: vocabulary-asymmetry
   Scope proof: Probed four post-name shapes: a question, `skip it`, `won't run it` and `no need to run it`; all four return `false`, and the first two offer the command through `attachCommand`. The pre-name lists already treat `skip` and `won't` as refusals, so the asymmetry is inside the file rather than an unclaimed vocabulary.
   Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts`
   Case: `/create:readme, what does it do?` asked to decide whether to run it, and `/create:readme is wrong, skip it` refusing it after naming it.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | `spec.md:57` names four refusal shapes and one behaviour claim (`a request still is`); the four refusal fixtures do read as mentions, and F001/F002 are the request direction failing. `spec.md:86` claims brackets, `~~`, `<code>`, guillemets and primes are dropped; lines 440-441 drop exactly that set, and the matrix at `command-attach-guards.vitest.ts:175-178` lists the same twelve pairs. |
| `checklist_evidence` | notApplicable | `tasks.md:45` records 16 failing-first cases for this branch; this pass reviews the behaviour, not the packet's task closure, and `040-final-alignment-loop` is still in progress. |
| `skill_agent` | pass | No agent definition is in the diff; both scope files are runtime library and test files. |
| `agent_cross_runtime` | notApplicable | No runtime mirror is touched by the two scope files. |
| `feature_catalog_code` | partial | The guards test pins the twelve wrapper pairs at `command-attach-guards.vitest.ts:175-189`; F001, F002, F003 and F004 are the shapes it cannot see. |
| `playbook_capability` | partial | Read `command-offer-fit-gates.md:22-24,51,68-72` for the refusal and question contract `NC-012` pins; no playbook scenario was executed, and the two guards were run directly instead. |

## Integration Evidence

- `attachCommand` (`.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:527`) consults `commandOnlyMentioned` before the deep-loop depth gate at line 545, so a false mention wins over depth wording. Reproduced on the hub path for the review mode.
- `withholdMentionedCommands` (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1213`) clears `passes_threshold` on a command row when the guard returns true, so F002 and F003 reach the ranked recommendation list as well as the hub offer.
- `typedCommandForTop` (`.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:259`) drops a typed command on a mention, so F001 and F002 cost the reader the command they typed.

## Edge Cases

- Ambiguity: `don't run it twice` (F002) is the one place where a reader could argue the negation is a refusal. It is recorded at P1 with a downgrade trigger rather than assumed; the mirror prompt `don't skip it`, which the packet pins at `spec.md:178`, still reads as a request.
- Contradiction: `spec.md:72` records the bracket case as `= false (plain form true)`. That line is pre-fix evidence for the defect this branch closes; the current tree returns `true`, so the line is historical and not a defect.
- Partial success: this iteration covered correctness only. Security, traceability and maintainability remain for later iterations, so the run is not complete.
- Recorded limits respected: the `:auto.md` suffix, the `node -e` arrow, `isolation-check.sh`, underscore emphasis and the open P2 lists were not re-reported; none of the four findings restates them.

## Confirmed-Clean Surfaces

- The twelve wrapper pairs and the retired name read every `PLAIN_ROWS` fixture the same as plain: re-ran all 21 rows across the twelve pairs and the retired spelling, 0 mismatches.
- `REFUSE8` (8/8), `QUESTION2` (2/2) still read as mentions and `REQUEST6` (6/6), `CONTROL5` (5/5) still read as requests on the current tree.
- The doc path is skipped: `do not run /create:readme, read /create:readme.md` reads as a mention, and `typedCommandIn('open /create:readme/notes.txt')` is still `undefined`.
- The typed start boundary accepts the new marks: `run **/deep:review** now`, `[..]`, curly quotes and `<code>` all return `/deep:review`; `see /create:sk-skill.md` stays `undefined`.

## Ruled Out

- A missing occurrence for the bracketed form: the scan finds the name inside `[...]` because the fold drops the brackets; the failure in F003 is the merge with a following target, not the brackets themselves.
- A regression in `typedCommandIn` from the widened start boundary: probed `*/`, `~/`, `>/`, `[/`, `(/`, guillemet and prime prefixes; every hit is a wrapped command, and no path or glob form newly reads as a typed command.
- A new false offer from the decline rule before the name: probed `not sure, use /create:readme`, `never mind just run /speckit:save`, `dont guess, run /speckit:plan` and `without asking, run /speckit:complete`; all still read as requests.
- A security or ReDoS surface in the two new regexes: both are single alternations with no nested quantifier over the same text, `COMMAND_AS_DOCUMENT` is anchored, and the module reads only its arguments (see iteration 3).

## Next Focus

- Dimension: traceability.
- Focus area: `spec.md` §3 and REQ-001 against the determiner requirement and the wrapper matrix, plus `CHK-FIX-001`/`CHK-FIX-002` evidence rows.
- Reason: correctness produced the two P1s; the packet's own scope bullet states the document shape without the determiner the code requires, which needs a traceability ruling rather than a second correctness finding.
- Rotation status: correctness complete, traceability next, then security and maintainability.
- Blocked/productive carry-forward: productive: exported-function probes with concrete prompts; every later finding gets the same treatment.
- Required evidence: file:line in `spec.md`, `tasks.md` and `acceptance-criteria.md`, plus the probe result for each claim.
- Recovery note: none.

Review verdict: CONDITIONAL
