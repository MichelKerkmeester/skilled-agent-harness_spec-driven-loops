# Iteration 001 - correctness

## Dimension

Correctness: does each changed rule read the prompt the way its own comment and the pass-thirteen decision record say it should, in both directions (a request read as a mention, and a refusal or question read as a request)?

## Dispatcher

```text
BINDING: target=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build
BINDING: maxIterations=8
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build
```

Resolved route: mode=review target_agent=deep-review; execution=single_review_iteration; state_source=externalized_files.

Operator review focus: pass fourteen, area `mention`. Addressed by reading `review-brief-14.txt` first, restricting the pass to the two files `review-scope-14.txt` assigns to `mention`, and following the holdout rule (no corpus or holdout file opened, no `git diff` over those paths, no score summary, no CLI session text). The brief's recorded limits were treated as already recorded, not re-reported.

Sources: `review-brief-14.txt:1-10`, `review-scope-14.txt:1-5`, `.skilled/skills/sk-code/sk-code-review/references/review-core.md:1-120`, `040-final-alignment-loop/spec.md:52-58`, `040-final-alignment-loop/implementation-summary.md:78-90`.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1-572` (whole file at `e626653ce79`; working tree matches)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:1-621` (whole file at `e626653ce79`)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-14.txt:1-10`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-scope-14.txt:1-5`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/spec.md:52-58`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/implementation-summary.md:78-90`
- `.skilled/skills/sk-code/sk-code-review/references/review-core.md:1-120`

The diff base `932aff4e437` and head `e626653ce79` were read with `git -c core.fsmonitor=false diff` for both scope files only.

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **A refusal whose object carries a reason or a repeat adverb is read as a request** -- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:415 -- `COMMAND_DECLINED_BY_PRONOUN` now requires the pronoun `it` to sit at the end of the clause; only `yet`, `now`, `for now`, `at all` and `please` may follow it before the end anchor. A refusal whose object is followed by `again`, `anymore`, `because ...` or `until ...` therefore fails the test. `/create:readme keeps failing, never run it again` returns `false` from `commandOnlyMentioned`, and `attachCommand('sk-doc', SINGLE('sk-create-readme'), prompt)` returns `/create:readme`, a mutating `start` command. The comment at lines 412-414 says "the refusal has to end its clause"; this refusal does end its clause, so the code contradicts its own stated contract. The same shape fails for `/create:readme is broken, do not run it again until it is fixed` and `/deep:review is too slow, do not run it again` on the deep-loop route.
   Case: `/create:readme keeps failing, never run it again` typed by a reader who wants the command withheld (verified: guard `false`, consumer offers `/create:readme`).
   Finding class: correctness-regression
   Scope proof: Imported the exported module at `e626653ce79` with Node's type stripping and ran `commandOnlyMentioned` and `attachCommand` on the prompts above; all return the request reading. The removed pattern in the diff ended at `it\b`, so the same input read as a mention before this branch. The leading-lead rule cannot rescue it because the refusal sits after the name; no other rule in the function inspects the tail for a refusal.
   Affected surface hints: `commandOnlyMentioned` (line 463), `typedCommandForTop` (line 259), `attachCommand` (line 533), the `REFUSE8`/later-refusal fixtures, and every caller that relies on the guard to withhold a mutating command.

```json
{
  "type": "behavioral",
  "claim": "A refusal after the name whose object is followed by a reason or a repeat adverb is read as a request, so a mutating command is offered against the refusal.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:415",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:463",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:533"
  ],
  "counterevidenceSought": "Checked the leading decline leads (line 467) for a refusal before the name; the refusal here is after it. Checked the ask-by-pronoun rule (line 464) and the document rule (line 465); neither matches. Checked the new fixtures at test lines 210-218; none carries a trailing reason.",
  "alternativeExplanation": "The author may read any qualifier after `it` as a limit rather than a refusal, as with `don't run it twice`. Rejected for `again` and `because` because the whole clause refuses the run and the prompt contains no request for the command.",
  "finalSeverity": "P1",
  "confidence": 0.94,
  "downgradeTrigger": "Downgrade if a corpus shows a prompt of this shape whose author meant to run the command; the reviewed fixtures contain none."
}
```

2. **A document naming followed by any `then` clause is read as a request** -- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:465 -- The new guard `!/\bthen\b/.test(clause)` suppresses the document reading whenever `then` appears anywhere after the name, even when the follow-up is read-only or unrelated. `commandOnlyMentioned('read the /deep:review command file and then tell me what it does', '/deep:review')` returns `false`, and `attachCommand('system-deep-loop', SINGLE('review'), prompt)` returns `/deep:review`. The deep-loop depth gate at lines 549-552 does not withhold it either, because `typedCommandIn` finds the name in the prompt. `read the /deep:review command file, then run the test suite` and `read the /create:readme document and then tell me what it does` fail the same way. The `then` clause is not evidence that the command is wanted: the intended `then` case (`read the docs, then do a thorough review`) is separable by the work verb, not by the word alone.
   Case: `read the /deep:review command file and then tell me what it does` on a hub route to the review mode (verified: guard `false`, consumer offers `/deep:review`).
   Finding class: rule-precedence
   Scope proof: Ran the exported guard and consumer on four prompts; the document naming returns a mention without `then` and a request with it. `COMMAND_ASKED_BY_PRONOUN` already returns a request for `..., then run it`, so the new `then` guard adds no discrimination there; its only added effect is on read-only follow-ups. The suite has one row for the guard (test line 215) and it expects a request, so no row pins the read-only side.
   Affected surface hints: `attachCommand` (lines 533 and 549-552), the document rule (line 423), the deep-loop depth gate, and the document fixtures at test lines 221-226.

```json
{
  "type": "behavioral",
  "claim": "A prompt that names a command as a document and then asks a read-only or unrelated follow-up is read as a request for the command.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:465",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:423",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:549"
  ],
  "counterevidenceSought": "Checked whether the ask-by-pronoun rule needs the `then` guard: it already matches `, then run it`, so the guard is not what protects that case. Checked whether the determiner requirement or the occurrence boundary rejects the prompt earlier; both pass for `the /deep:review command file`.",
  "alternativeExplanation": "The guard may intend any `then` clause to mark work. Rejected because `then tell me what it does` and `then run the test suite` ask for something other than the named command, and the pass-thirteen decision records the shape as a document read.",
  "finalSeverity": "P1",
  "confidence": 0.93,
  "downgradeTrigger": "Downgrade if the accepted reading is that any `then` clause in a prompt that names the command is a request for it; the current comment's wider claim would then need no change."
}
```

### P2 Findings

1. **The new fixtures pin neither boundary the two rules changed** -- .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:210 -- The five rows added to the request table cover a limit after `it` and a work clause after `then`; no row covers a refusal whose object carries a reason (`never run it again`, `do not run it because ...`) and no row covers a document naming with a read-only `then` (`read the docs, then tell me what it does`). The suite therefore stays green if either anchor is widened or narrowed again. A failing-first row for each shape would have caught both P1s above.
   Case: Adding `['/create:readme keeps failing, never run it again', '/create:readme']` to `REFUSE8` fails against the current code, and no such row exists.
   Finding class: test-coverage-gap
   Scope proof: Read both fixture tables at lines 202-218 and 221-229; the only `then` row (line 215) asserts a request and the only post-name refusals (lines 202-208) end at `it`.
   Affected surface hints: the `it.each` request table (lines 210-218), the `REFUSE8` table (lines 42-51), and the document-naming table (lines 221-226).

## Traceability Checks

Not run in this iteration; the traceability pass is iteration 3. The 040 decision record was read only to ground the two rules' stated intent (`040-final-alignment-loop/implementation-summary.md:83`).

## Integration Evidence

- `attachCommand` (`command-attach.ts:501-555`) was exercised as the consumer of `commandOnlyMentioned` for both findings: a single-target route to the readme mode and to the deep-loop review mode.
- `typedCommandForTop` (`command-attach.ts:256-264`) was exercised for the deep-loop prompt, because its `typedCommandIn` result is what lets the costly command bypass the depth gate.

## Edge Cases

- Intended trade-off, not a finding: `don't run it twice` and `never run it without a budget` remain requests, per the pass-thirteen decision. The defect is the shape where the refusal itself ends the clause with a reason.
- The `then` guard is not the only way the document rule is suppressed; moving the decline and ask checks ahead of it is what makes `..., then run it` a request. The overreach is confined to the `then` test.
- Ambiguity in the required graph-event shape: `state-jsonl.md:141-148` shows node types as `dimension`/`file`/`finding`/`evidence`, while the iteration prompt pack and `iteration-graph-upsert.cjs:142-144` accept only `type: "node"` with a `kind`. Chose the prompt-pack shape, which is the one the upsert step consumes; recorded here rather than as a finding because both documents are outside the declared review target.
- The guard suite was not executed as a suite because a Vitest run would write build caches outside this lineage's write boundary. Behavior was verified by importing the module directly; the five new rows were replayed by hand and all pass as asserted.

## Confirmed-Clean Surfaces

- Command names are escaped with `escapePhrase` before entering any built regex (`command-attach.ts:316-318`, `455`), so prompt text cannot inject a pattern.
- The occurrence scan still rejects a doc path and a longer command name (`456`), and the typed-command boundary still rejects `:auto.md`, path segments and unknown suffixes (`221-245`, tests `516-572`).
- The five added request rows all return `false` as their titles assert.

## Ruled Out

- A request read as a mention caused by the reordering itself: the decline and ask checks were only moved ahead of the document check, and `..., then run it` still returns a request through `COMMAND_ASKED_BY_PRONOUN`; no prompt was found where the new order withholds a command the earlier order delivered.
- A refusal swallowed by the leading-lead rule: the `before` side still requires the lead to sit directly before the name, so a refusal in a later clause does not affect an earlier occurrence.

## Next Focus

- Dimension: security
- Focus area: the guard as a trust-boundary filter over user prompt text in `command-attach.ts`, and the fixture matrix in the guard suite.
- Reason: correctness produced two P1s and one P2; the security pass must show whether prompt-controlled text can steer the guard through pattern construction, backtracking, or markup folding.
- Rotation status: correctness complete, security next.
- Blocked/productive carry-forward: no exhausted approaches yet.
- Required evidence: `escapePhrase` call sites, every `new RegExp` built from prompt data, and a negative test for prompt-length or nested-quantifier blowup.

## Verdict

Two P1 findings and one P2 finding in the two rules pass fourteen changed; no P0.

Review verdict: CONDITIONAL
