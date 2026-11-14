# Review Iteration 001 — Correctness

## Dispatcher

- Mode: review (deep-review LEAF iteration, detached fan-out lineage `scorer-attach-close-4c`).
- Iteration: 1 of 3.
- Run: `fanout-scorer-attach-close-4c-1794682797954-pcdanq`, generation 1, lineageMode `new`.
- Budget profile: `verify` (evidence rereads plus the CLI probe).
- Sources read: `review/review-brief-4c.txt:1`, `review/review-scope-4c.txt:1-5`, `review/verify-4/report.md:1-24`, `027-review-pass-four-remediation/scratch/review-rounds.txt:1-6`, `027-review-pass-four-remediation/spec.md:239,279,378-390`, `027-review-pass-four-remediation/tasks.md:81-82`, `.skilled/skills/system-deep-loop/deep-review/SKILL.md`, `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl`, `git -c core.fsmonitor=false diff 48f03b5013 868b185e76 -- .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts`, and the same diff for `tests/command-attach-guards.vitest.ts`. `steer.md` does not exist in this lineage; nothing was carried from it.
- Operator review focus: the closing round of review pass four (`review-brief-4c.txt`). This iteration addresses it by reading the brief first, reviewing only the `scorer-attach` rows, reproducing SAC4B-P1-001 and SAC4B-P2-001 through the real module and the advisor CLI, and hunting defects the fix added rather than re-raising anything `verify-4/report.md` rejects.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:356-441` (the or-list grammar, the leads and `commandOnlyMentioned`), `:459-514` (`attachCommand`).
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:145-215` (the added or-list rows), `:245-274` (the hub-command table).
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:67-76,122` (shared doc context only; the sibling lineage owns that row).
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1200-1246` (caller of `commandOnlyMentioned`, reach evidence).
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:500` (typed-command call site).
- Probe: `review/lineages/scorer-attach-close-4c/tmp/probe-or-list.mjs` (imports the real module; read-only).

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **An or-list whose non-final item is a two-word `/doctor:` command still publishes the refused command** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:380` -- `COMMAND_OR_LIST` matches a listed item as `\/[a-z][a-z0-9_-]*(?::[a-z][a-z0-9_-]*)?(?: command)?`, a single token, so a list item such as `/doctor:ci report` cannot be consumed. The bridge stops before the `or`, the last command is left unled, and `commandOnlyMentioned` returns false. The advisor then prints the refused commands: `do not run /doctor:ci report or /doctor:ci scaffold` prints `[["command-doctor-ci-report","/doctor:ci report","run"],["command-doctor-ci-scaffold","/doctor:ci scaffold","ask"],…]`, and `never use /doctor:git hooks or /doctor:skill-advisor tune` keeps `/doctor:skill-advisor tune`. The single-word forms the round fixed behave correctly.
   Finding class: incomplete-fix / grammar-reach.
   Scope proof: the item pattern is in `COMMAND_OR_LIST` (`command-attach.ts:380`), applied at `:427`, `:429`, `:432` and `:439`; `TRACKED_COMMANDS` holds 22 two-word `/doctor:` rows (`:143-178`), and `withholdMentionedCommands` compares on the base command `'/doctor:ci'` (`fusion.ts:1209`), whose first occurrence is led and whose second is not, so the refused command row keeps passing.
   Affected surface hints: `commandOnlyMentioned`, `typedCommandForTop`, `withholdMentionedCommands`, `rankTypedCommandOwnerFirst`, advisor CLI rows, `COMMAND_OR_LIST`.
   Case: `do not run /doctor:ci report or /doctor:ci scaffold` (or the same list with the article, `… or the /doctor:ci scaffold command`) — the CLI answers a refusal with both refused commands on rows 0 and 1. A mixed list where the non-final item is two-word also fails: `do not run /doctor:ci report or /create:readme` reads `/create:readme` as a request.
   ```json
   {
     "type": "claim",
     "claim": "A refusal or a question over an or-list still carries a command when a non-final list item is a two-word /doctor command, so the refused command is published.",
     "evidenceRefs": [
       "command-attach.ts:380",
       "command-attach.ts:427-439",
       "command-attach.ts:143-178",
       "fusion.ts:1209",
       "tmp/probe-or-list.mjs (module probe: REFUSE rows read REQUEST for /doctor:ci scaffold; typed path returns it for top sk-code)",
       "advisor CLI: do not run /doctor:ci report or /doctor:ci scaffold -> command-doctor-ci-report /doctor:ci report run, command-doctor-ci-scaffold /doctor:ci scaffold ask"
     ],
     "counterevidenceSought": "REQ-001 names only three single-word refusals; A3 and the Out-of-Scope line (P049) limit the carry to decline leads and record a question over an or-list as unreproduced, but neither declares two-word commands out of the or-list grammar. The accepted limits SA4-P1-001 and SA4-P1-003 concern a retired name and broad creation words, not list items. The last item of a list may be two-word and still works, so the failure is positional, not a blanket exclusion.",
     "alternativeExplanation": "T028 authored the item pattern with one token on purpose, so the authors may treat a two-word /doctor command as outside the or-list's shape. That reading is not recorded anywhere, and the comment above the constant says the list covers every command it joins while TRACKED_COMMANDS ships the two-word rows, so the code's own stated contract includes them.",
     "finalSeverity": "P1",
     "confidence": "high",
     "downgradeTrigger": "Downgrade to P2 if a packet doc or adjudication record declares the or-list grammar single-token only, or declares multi-word /doctor commands out of the typed-command and command-row withholding contract."
   }
   ```

### P2 Findings

None this iteration.

## Traceability Checks

- `spec_code`: **partial**. REQ-001 (`spec.md:279`) names three or-list refusals; all three carry no command at the CLI, and both commands of `use A or B` keep theirs. The generalized contract in the code comment (`command-attach.ts:376-379`, "every command the list joins") is not met for the two-word rows, so the requirement's intent is met only for the asserted single-word corpus.
- `checklist_evidence`: **partial**. T028 and T029 (`tasks.md:81-82`) are marked `[x]` with verifier evidence that matches the code and tests. Their AC rows (AC-001, AC-006) still read `Unmet`, which is expected mid-round because AC-011 requires this confirming round before closeout, so this is not drift by itself.
- `feature_catalog_code`: **not run this iteration** (reserved for iteration 2).
- `skill_agent`, `agent_cross_runtime`, `playbook_capability`: **notApplicable** for this lineage's scope.

## Integration Evidence

- `attachCommand` (`command-attach.ts:492`) returns `undefined` for `do not run /create:agent or the /create:readme command` and for `should I run /create:agent or /create:readme?`; it returns `/create:readme` for `use /create:agent or the /create:readme command` and `the next step is /create:agent or /create:readme`. This is the exact split the brief asks for and the SAC4B-P1-001/P2-001 fixes are confirmed at this surface.
- `typedCommandForTop` with top `sk-code` returns `/doctor:ci scaffold` for `do not run /doctor:ci report or /doctor:ci scaffold` (finding 1's call path); the same function returns nothing for `do not run /create:agent or the /create:readme command`.
- The advisor CLI (`node .skilled/bin/skill-advisor.cjs advisor_recommend`) printed no command for the plain and article refusals and for both question forms, and printed `/create:readme (start)` for the request forms, which reproduces the brief's check end to end for single-word commands.

## Edge Cases

- **Article on each item**: `never use the /create:readme command or the /create:feature-catalog command` reads as a refusal; `use the /create:agent command or the /create:readme command` keeps its command. The doubled-article form `or the the /x` is accepted by the regex by construction; it is harmless over-permissiveness, not a finding.
- **Second use verb**: `do not run /speckit:complete or run /speckit:plan` keeps `/speckit:plan`, and `do not run /speckit:complete, run /speckit:plan or /speckit:implement` keeps both later commands, so the clause-separation property survives the fix.
- **Mixed single/multi-word list**: only a non-final two-word item breaks the bridge; a two-word final item works (`do not run /create:agent or /doctor:ci scaffold` reads as a refusal). Recorded so the finding is not over-generalised.
- **Line break inside a list**: `or\n/x` is not bridged because the constant requires a space after `or`; the input is unusual and this is not raised as a finding.
- **Expected-value boundary**: this P1 is new to this lineage, not a replay of an adjudicated finding, so AC-011's "0 adjudicated P1" expectation needs the lead's written judgment if the fix is left as is.

## Confirmed-Clean Surfaces

- The constant, its comment and the three `${COMMAND_OR_LIST}` insertions are exactly T028 and T029 and nothing else in `command-attach.ts` changed (`git diff` over the file shows two hunks).
- The nine added test rows are exactly the five T028 rows (four refusal, one request) plus the four T029 rows (three question, one request); no existing row changed.
- Refusal over a three-item list, comma-or, `skip`, `never use`, and the `the … command` forms all read as refusals through the real module and the CLI.
- Requests over a list keep their command in every probed shape, including after a refusal word in a separate clause.
- No ReDoS shape: the repeated group nests only fixed-width options and one command token; it cannot backtrack across unrelated text.

## Ruled Out

- **The fix over-suppresses requests**: probed seven request shapes (with and without the article, `the next step is`, a later unled clause); all kept their command.
- **The article allowance breaks an existing question row**: `Is the /doctor:update command safe?` and the sentence-start bare-ask rows still read as questions, because the added group matches zero iterations when no `or` is present.
- **The test count is short**: 9 added rows matches T028's 5 plus T029's 4; the added `it.each` tables account for every one.
- **The change is not what ships**: the ignored build output at `runtime/dist/runtime/lib/command-attach.js` holds the same constant and the three insertions, so the local CLI path carries the fix.
- **The capture corpus is involved**: no prompt file was opened this iteration; only code, packet docs and the CLI were read.

## Next Focus

- Dimension: traceability.
- Focus area: `027-review-pass-four-remediation/spec.md` REQ-001 (`:279`), the Out-of-Scope line (`:239`) and assumption A3 (`:384`) against the code and T029; the shared docs that describe the mention grammar; and whether the new forms are pinned at the `attachCommand` layer as well as at the predicate.
- Reason: the fixes are confirmed at the predicate and the CLI, so the remaining risk in this round is a document or a stored expectation that still describes the pre-fix grammar.
- Rotation status: correctness complete; traceability next, then maintainability/security.
- Blocked/productive carry-forward: correctness probe (real module + CLI) was productive; the same method applies to any doc claim.
- Required evidence: exact `file:line` for each doc sentence, and a check of the hub-command table for the new forms.
- Recovery note: none.

Review verdict: CONDITIONAL
