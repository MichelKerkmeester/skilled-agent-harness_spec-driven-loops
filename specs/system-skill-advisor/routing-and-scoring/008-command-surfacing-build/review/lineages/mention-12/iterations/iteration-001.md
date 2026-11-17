# Review Iteration 001 - mention-12

## Dispatcher

- Mode: review. Target agent: `@deep-review`, executed in-process by this detached fan-out lineage (no nested dispatch).
- Session: `fanout-mention-12-1794856957949-n58dw7`, generation 1, lineage `mention-12` under `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/mention-12`.
- Iteration: 1 of 8. Dimensions: correctness and traceability. Focus: the `commandOnlyMentioned` normalization and the wrapper invariance test.
- Operator review focus, and how this iteration addressed it: pass twelve's brief asks for a wrapper, quote or alias case the invariance test does not cover that changes a refusal or question into a request or back. This iteration read `review-brief-12.txt` and `review-scope-12.txt` first, then exercised the exported mention guard over the test's own fixture rows with wrapper pairs the test does not list. Two cases reproduce; they are F001 and F002 below.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1-549`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:410-459` (focused reread of the normalization chain, occurrence scan and lead tests)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:1-573`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:169-232` (focused reread of `WRAPPERS`, `PLAIN_ROWS` and the retired-name test)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1200-1260` (the `withholdMentionedCommands` consumer)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-brief-12.txt:1-10`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-scope-12.txt:1-7`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-report.md:1-31`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-report-pass-10.md:1-28`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/039-main-sk-doc-routing-repair/acceptance-criteria.md:60`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/039-main-sk-doc-routing-repair/tasks.md:64-65`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **A markdown wrapper the normalizer does not strip turns a refusal or question into an offer** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:427` -- `commandOnlyMentioned` folds the prompt by dropping backticks, asterisks and double quotes and by dropping a single quote only where it opens or closes a command name. A refusal or question wrapped in brackets, parentheses, strikethrough, an HTML tag, guillemets or a markdown link keeps that punctuation, and `COMMAND_GAP_WORDS` (line 363) admits only plain words and apostrophes between the lead and the name, so the anchored lead test at lines 444-450 never matches. The name is still found by the occurrence scan; the lead is what fails. `attachCommand` then returns the mutating command the reader refused.

   - Case: `do not run [/create:readme], just explain` returns `commandOnlyMentioned === false`, and `attachCommand('sk-doc', {action:'route',selectionKind:'single',targets:[{workflowMode:'sk-create-readme'}]}, prompt)` returns `/create:readme`. `do not run /create:readme, just explain` returns `true` and attaches nothing. The same flip reproduces for `do not run (/create:readme) yet`, `do not run ~~/create:readme~~ yet`, `do not run <code>/create:readme</code> yet`, `do not run «/create:readme» yet`, `do not run [/create:readme](https://x.test) yet`, `is [/speckit:complete] overkill for a two line fix?`, and `do not run [/create:skill] yet` for the retired name.
   - Finding class: algorithmic
   - Scope proof: ran the module's exported function over the 23 rows of the test's `PLAIN_ROWS` cross the six non-normalized wrapper pairs (`[`/`]`, `(`/`)`, `~~`/`~~`, `<code>`/`</code>`, `«`/`»`, `′`/`′`): every one of the 12 refusal/question rows flipped under every pair (72 of 72), and every request row stayed a request. The six covered pairs in `WRAPPERS` produced 0 mismatches over the same rows. The occurrence regex still matches the name inside the brackets, so the failure is the lead match, not name detection.
   - Affected surface hints: `lib/command-attach.ts` `commandOnlyMentioned` and `attachCommand`; `lib/scorer/fusion.ts:1204-1215` `withholdMentionedCommands`; `tests/command-attach-guards.vitest.ts:175-188` `WRAPPERS`/`PLAIN_ROWS`.
   - Claim adjudication:
     ```json
     {"type":"claim","claim":"A refusal or question that wraps the command in markdown punctuation the normalizer does not strip is read as a request, so the hub route and the scorer both offer a mutating command the reader refused.","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:427",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:363",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:444",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:510",".skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1213",".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:175",".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:183"],"counterevidenceSought":"Checked every wrapper pair the test lists (0 mismatches), single-asterisk and underscore emphasis, the recorded suffix-plus-extension limit, and whether the occurrence scan itself misses the bracketed name; it does not, so the defect is isolated to the lead gap and the strip list.","alternativeExplanation":"The guard may deliberately treat any punctuation between the lead and the name as a clause boundary, which would make brackets intentional. The comment at lines 360-362 names a comma as the clause end, and the normalizer already removes five markup forms, so markup is not being treated as a boundary by design.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"Downgrade to P2 if bracket, parenthesis, strikethrough or link markup around a command name is declared outside the prompt forms the advisor accepts."}
     ```

### P2 Findings

2. **A doc-path mention of the command defeats a led refusal** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:437` -- the occurrence scan's after-name lookahead blocks only `[a-z0-9_-]`, unlike `typedCommandIn`'s dot-and-slash continuation rule at line 234, so `/create:readme.md` and `/create:readme/notes.txt` both count as occurrences of `/create:readme`. Because every occurrence must carry a lead (line 439), a led refusal plus an unled path reference returns `false`, and the refusal is lost.

   - Case: `do not run /create:readme, the rules are in /create:readme.md` returns `false` and `attachCommand('sk-doc', SINGLE('sk-create-readme'), prompt)` returns `/create:readme`; the same prompt without the path returns `true` and attaches nothing. The same holds for `do not run /create:readme, see /create:readme/notes.txt`.
   - Finding class: algorithmic
   - Scope proof: the occurrence regex matches the name inside both a `.md` file name and a directory segment, and `typedCommandIn` (`:232-234`) already refuses both forms for the typed path, so the two readers of the same prompt disagree on what a path is.
   - Affected surface hints: `lib/command-attach.ts` `commandOnlyMentioned`; `lib/command-attach.ts` `typedCommandIn` continuation rule as the precedent; `lib/scorer/fusion.ts:1213`.
   - Note: this is not the recorded `:auto.md` limit. That limit says a suffix followed by an extension still reads as the command; this finding is that a path occurrence defeats a *different*, led refusal in the same prompt.

## Traceability Checks

- `spec_code` (core): pass. The branch diff for this area is exactly the two scope files (12 lines in the module, 42 in the test), and the module change does what pass eleven's report says: one closing-quote strip and the retired-name spelling alternation. `[SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-report.md:16-17]`
- `checklist_evidence` (core): notApplicable. This review pass owns no packet checklist; 039's AC-007 was read as the wrapper contract. AC-007 scopes its matrix to backtick, straight/curly quote, bold and the retired name, and the test meets that matrix as written (`[SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/039-main-sk-doc-routing-repair/acceptance-criteria.md:60]`). F001 is a new defect outside AC-007's enumerated marks, not an AC failure.
- `skill_agent` (overlay): pass. No agent definition is in the diff; both changed files are runtime library and test files.
- `agent_cross_runtime` (overlay): notApplicable. No runtime mirror is touched by the scope files.
- `feature_catalog_code` (overlay): partial. The wrapper invariance test pins exactly the six mark pairs it lists and the retired-name mapping; F001 names the wrapper class it cannot see, and F002 names the occurrence-boundary disagreement with `typedCommandIn`.
- `playbook_capability` (overlay): partial. No playbook scenario was executed; the node module was exercised directly with the test's fixture rows and the uncovered wrapper pairs.

## Integration Evidence

- `lib/scorer/fusion.ts:1204-1215` `withholdMentionedCommands` withholds a command row on the same `commandOnlyMentioned` result, so F001 and F002 reach the scorer's command rows as well as `attachCommand`.
- `lib/command-attach.ts:510` `attachCommand` calls the mention guard for every hub route that maps a mode to a command.
- `handlers/advisor-recommend.ts:421-439` `attachTypedCommand` is the consumer of `typedCommandForTop`; it is read here as context for the iteration-2 maintainability focus.

## Edge Cases

- The `WRAPPERS` matrix is a parity test: it proves the listed marks do not change the reading, and it cannot fail for a mark the normalizer does not strip. That is why F001 survived pass eleven's "pins the whole class" claim.
- Underscore emphasis (`do not run _/create:readme_`) flips the same way, but the brief records underscore emphasis as deliberately not dropped because a command name may hold an underscore; it is not reported.
- The recorded `:auto.md` limit was rechecked: `do not run /deep:review:auto.md` still reads as the command and withholds the offer. It is not re-reported; F002 is a different input.
- Brackets around a *request* do not flip: `run [/speckit:complete] for the rate limiter` still reads as a request, so the defect is one-directional (refusal or question becomes an offer).
- The single-quote and retired-name fixes hold: `do not run '/create:readme' yet`, `what's '/create:readme' for?`, `do not run /create:skill yet` and `what does /create:skill do?` all read as mentions.

## Confirmed-Clean Surfaces

- The straight, curly and double quote strips and the bold and backtick strips: 0 parity mismatches across all 23 test rows.
- The retired-name alternation: `/create:skill` reads as `/create:sk-skill` for refusals, questions and requests, including a mode suffix (`typedCommandIn('/create:skill:auto') === '/create:sk-skill'`).
- The or-list lead: every listed command in a refusal or question is read as a mention, including the later command.
- `commandOnlyMentioned`'s occurrence scan does not read `/create:readme` inside a word or a longer command name (`/create:sk-skill-parent` stays a request).

## Ruled Out

- ReDoS in the lead patterns: a 2,025-character or-list prompt evaluates in 1.2 ms and a 2,425-character alternating list in 0.1 ms; the anchored alternation does not backtrack catastrophically at these sizes.
- A missing occurrence of a bracketed name: the scan finds the name inside `[...]`; only the lead fails.
- A regression from the single-quote or retired-name fixes: both still behave as pass eleven recorded.
- The test's omission of the or-list question, bare-lead, pronoun and later-clause rows from `PLAIN_ROWS`: all of those rows still show 0 mismatches under the six covered wrappers, so the omission is not hiding a second defect today.

## Next Focus

- Dimension: security and maintainability
- Focus area: the untrusted-prompt surface of the mention guard, and the two divergent "is this command named" boundary rules (`commandOnlyMentioned` normalization versus `typedCommandIn`'s start boundary).
- Reason: correctness produced the wrapper flip and the path occurrence; security has not yet checked the guard's regex construction, and maintainability owns the boundary divergence that lets a typed but bold-wrapped command lose its delivery.
- Rotation status: first pass complete for correctness and traceability; security and maintainability next.
- Blocked/productive carry-forward: productive was exercising the exported module over the test's own fixtures; keep that method for the typed boundary.
- Required evidence: a `file:line` for the boundary constants and a concrete prompt whose `attachCommand` or `typedCommandForTop` result differs between a wrapped and a plain typed command.
- Recovery note: none.

Review verdict: CONDITIONAL
