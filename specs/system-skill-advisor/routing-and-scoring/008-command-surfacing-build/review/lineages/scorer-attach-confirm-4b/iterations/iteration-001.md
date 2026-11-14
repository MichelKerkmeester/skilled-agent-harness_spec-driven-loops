# Review Iteration 001 — scorer-attach-confirm-4b

## Dispatcher

- Mode: review (deep-review, fan-out lineage)
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Lineage: `scorer-attach-confirm-4b`, session `fanout-scorer-attach-confirm-4b-1794680176420-xvj4ed`, generation 1, lineageMode `new`
- Artifact directory: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-attach-confirm-4b`
- Focus: correctness — refusal over an or-list, the is-the question, shell-read start, heredoc end word, `offeredAs` retention
- Operator focus: `review-brief-4b.txt` — confirming round of pass four over `11af224a34..48f03b5013`, scorer-attach rows only, `verify-4/report.md` as the finding ledger, holdout rule observed. This iteration addressed it by taking each of the brief's five code checks in order and confirming or breaking it against the post-fix code; the doc check is carried to iteration 2.
- Sources read: `steer.md` (absent), `review-brief-4b.txt`, `review-scope-4b.txt`, `review/verify-4/report.md`, `.skilled/skills/system-deep-loop/deep-review/SKILL.md`, `sk-code-review/SKILL.md`, `references/review-core.md`, the diff of the eight scorer-attach paths, and the files listed below.
- Budget profile: verify (11 analysis calls).

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:356-440,459-513`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:638-694,719-750,910-925,1471-1477,1628-1638,1698-1706,1884-1920`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:120-260`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:614-640,1082-1120,2279-2284`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts:129-230`
- `.skilled/skills/system-skill-advisor/README.md:118-121`
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:39`
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:65`
- Context evidence (read-only, sibling area): `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:496`, `run-command-behaviour.mjs:824`, `.skilled/hooks/shared/session-readers/codex.mjs:158-176`

Diff command used (recorded for audit, no holdout path in scope):

```bash
git -c core.fsmonitor=false diff 11af224a34 48f03b5013 -- \
  ':(exclude)**/command-prompts.jsonl' ':(exclude)**/holdout-prompts.jsonl' -- <eight scorer-attach paths>
```

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **An or-list refusal that names its second command as "the /x command" still attaches that command** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:379` (list pattern) and `:425-426` (its only use) -- `COMMAND_OR_LIST` joins list items only as `/cmd or `, so a refusal whose second item carries the article the request path already tolerates (`COMMAND_BARE_ASK_LEAD`, line 395, `(?:the )?`) falls through to `attachCommand` and is offered.
   Case: `do not run /create:agent or the /create:readme command` → `commandOnlyMentioned(..., '/create:readme')` returns `false`, so `attachCommand` reaches line 512 and returns `/create:readme` (verified by importing the module and printing the gate result; `skip /create:agent or the /create:readme command` and `do not run /create:agent, or the /create:readme command` behave the same, while `do not run /create:agent or /create:readme` correctly returns `true`).
   Finding class: class-of-bug
   Scope proof: the same one-token gap is the whole class; `rg -n "COMMAND_OR_LIST" command-attach.ts` shows the pattern is applied only to `COMMAND_DECLINE_LEADS`, and no test row covers an article inside the or-list (`command-attach-guards.vitest.ts:155-174`).
   Affected surface hints: ["commandOnlyMentioned", "attachCommand", "refusal lead grammar", "or-list"]
   ```json
   {"type":"claim-adjudication","findingId":"SAC4B-P1-001","claim":"A refusal that joins its commands with 'or the <cmd> command' still yields a command offer","evidenceRefs":["command-attach.ts:379","command-attach.ts:425","command-attach.ts:491","command-attach.ts:512","probe: tmp/probe-attach.mjs (module import, gate=false)"],"counterevidenceSought":"checked the five or-list test rows (command-attach-guards.vitest.ts:155-174): every passing row uses a bare '/cmd or /cmd' shape; checked the decline-lead comment (lines 366-374), which constrains the words before the lead, not the list item's article","alternativeExplanation":"the authors may intend only the bare '/cmd or /cmd' form as an or-list; but the sibling question path added '(?:the )?' in this same commit, so the article is treated as natural wording elsewhere","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"if a packet doc or spec declares 'or the <cmd> command' outside the refusal grammar's contract, downgrade to P2"}
   ```

### P2 Findings

2. **A question over an or-list still attaches its second command** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:386-389` -- `COMMAND_ASK_LEADS` never receives `COMMAND_OR_LIST`, so only the first item of a question list is read as asked-about.
   Case: `what does /create:readme or /create:agent do?` → `commandOnlyMentioned(..., '/create:agent')` returns `false` (module import), so the compiled route offers `/create:agent` on a pure question, while `what does /create:readme do?` correctly returns `true`.
   Finding class: class-of-bug
   Scope proof: one pattern, one use site; the fix comment at line 376-378 scopes the or-list to refusals, so the ask branch is a deliberate-looking omission rather than a missed call.
   Affected surface hints: ["COMMAND_ASK_LEADS", "commandOnlyMentioned"]

3. **README names the child-session policy `parent-named only` while the render prints `(n)`** -- `.skilled/skills/system-skill-advisor/README.md:121` -- the sentence added for R4-P2-003 lists the policy values as `run, start or ask, or parent-named only`, in the same slot where the other three are literal brief tokens; the renderer emits `n`.
   Case: a child session whose doctor bridge offers `/doctor:update` renders `Also: /doctor:update (n)` (`doctor-brief-render.vitest.ts`, `expect(...).toContain('\nAlso: /doctor:update (n)')`), not `(parent-named only)`, so a reader who follows the README looks for a token the brief never prints.
   Finding class: matrix/evidence
   Scope proof: `rg -n '\\(n\\)|parent-named|`n`' README.md` returns only line 121; no legend in that file maps `n` to the phrase, and `render.ts` defines `PARENT_NAMED_POLICY = 'n'`.
   Affected surface hints: ["README doctor routing paragraph", "render policy token"]

4. **The dead `unscoredOnly` field survives the round that said to delete it** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1633,1702` -- the counter is initialised to 0 and read into `unscored`, but nothing increments it: the only keyed increment is `tally.workflow[result.workflowPath] += 1` (line 1750) and `unscoredOnly` is not a `workflowPath` value.
   Case: any summary run — `unscored` is computed as `tally.unscored + tally.workflow.unscoredOnly` and the second term is always 0, so the field documents a state the scorer cannot produce.
   Finding class: instance-only
   Scope proof: `rg -n "unscoredOnly" score-command-transcripts.mjs` returns exactly these two lines; `verify-4/report.md:26` confirmed the finding with "Delete the field" and the fix commit does not touch it.
   Affected surface hints: ["score-command-transcripts summary projection"]

## Traceability Checks

| Check | Result | Evidence |
|---|---|---|
| Refusal over an or-list carries no command | partial | bare `/cmd or /cmd` forms pass (`command-attach.ts:425`, tests `:155-163`); the `or the /cmd command` form fails (finding 1) |
| An is-the question carries no command | pass | `command-attach.ts:395,431-438`; probe `Is the /doctor:update command safe?` → mention; test `command-attach-guards.vitest.ts:198` |
| A request over a list keeps its command | pass | tests `:165-174`; probe `use /create:agent or /create:readme` → request for both |
| Both run-log writers keep `offeredAs` | pass (sibling scope, context) | `command-offer.mjs:496` and `run-command-behaviour.mjs:824` write `offeredAs: offer.offeredAs ?? null` at HEAD; the scorer consumes it at `score-command-transcripts.mjs:1471-1477` |
| A shell read of a command document counts as a start | pass | `score-command-transcripts.mjs:921`; tests `command-transcript-score.vitest.ts:617-635` (`cat` true, `rg`/`sed -i`/heredoc false) |
| A search, in-place `sed`, redirect target and heredoc line do not count | pass | `shellReadTargets` `:650-694` (reader list, `-i` guard, redirect flag, heredoc strip); `:2279-2284` |
| A heredoc end word with `-` or `.` closes | pass | `:648`; tests `:2281-2282` (`END-SCRIPT`, `END.JS`) |
| The Codex reader opens the resolved file | pass (sibling scope, context) | `codex.mjs:164-171` reads `storePath` set from `containment.path` |
| Holdout guard reads the live capture | pass | `command-routing-slice.vitest.ts:198-215` asserts on `live`; the new map-level test pins all four maps |
| Docs agree with code | partial | `advisor-recommend.md:39` matches `advisor-recommend.ts:475-478`; `command-meaning-matching.md:65` matches 28 `it` blocks; README policy token fails (finding 3) |

Core protocol status this iteration: `spec_code` pending (packet spec not yet reread; the round's acceptance surface is `review-brief-4b.txt` plus `verify-4/report.md`), `checklist_evidence` pending. Dimension covered: correctness.

## Integration Evidence

- `attachCommand` → `enrichCompiledRoutes` (`handlers/advisor-recommend.ts:474-478`): the head keeps its command and lower rows drop a duplicate, matching `advisor-recommend.md:39`.
- Scorer start path: `startState` → `readDocument` (`score-command-transcripts.mjs:986`), loop path `takenLoop` → `readDocument` (`:1439`); the new shell branch is shared by both, which is why the single change fixes the P1 raised from `iter1-P2-shell-read-not-start`.
- Live-capture guard: `command-routing-slice.vitest.ts` `publishedHoldoutIds` reads `rows`, `attachedRows`, `typedRows` and `needsModeRows` for both `baseline` and `live`.

## Edge Cases

- The `or the /cmd command` gap (finding 1) and the ask-side gap (finding 2) are the same shape: the or-list is applied per lead family, not to the grammar as a whole. A single shared OR_LIST in both branches would close both.
- `iter3-P2-pair-doc-shared-rows` (README paired block needs a shared owned row) is confirmed unfixed but `verify-4/report.md:29` folds it into phase 026 T018; recorded as a carry-forward, not re-raised as a new finding.
- `iter4-P2-paired-arm-key-collision` (reserve `paired`) is left to 026 T019 by the same report line; the text writer already skips an arm named `paired` (`:1915`) but the JSON projection would still overwrite it.
- `unscoredOnly` could in principle be reached through the keyed increment at `:1750`; it is not a `workflowPath` value, so the field is dead. The verifier reached the same conclusion by reading.
- Sibling-owned checks (Codex reader, both run-log writers, accuracy docs) are reported as context evidence only; findings stay in the scorer-attach rows.

## Confirmed-Clean Surfaces

- `COMMAND_OR_LIST` scope: applied only to `COMMAND_DECLINE_LEADS`, never to a request lead, so `use /create:agent or /create:readme` keeps both commands (probe, tests `:165-174`).
- `(?:the )?` in `COMMAND_BARE_ASK_LEAD` does not over-suppress: `the next step is the /speckit:implement command` stays a request (probe, test `:181`).
- Heredoc body strip: the widened end-word class does not weaken the closing-line anchor (`\3[ \t]*(?=\n|$)`, `:648`).
- `sed -i ''` guard covers `-i`, `-ni`-style clusters and `--in-place[=]` (`:673`).
- Holdout guard: the live capture is scored in-memory (`:160`) and no holdout prompt text is read or printed in this lineage; only counts and `jq 'del(.prompt)'` shapes were used.

## Ruled Out

- `R4-P2-002` (first returned row always leads): rejected by `verify-4/report.md:16`; the attach path at `advisor-recommend.ts:475-478` shows the head is the only row guaranteed to render, so no new input breaks the rejection.
- `iter2-P1-fit-decline-ungated`: rejected by the report; the slice test compares the whole block (`command-routing-slice.vitest.ts:277-280`), so a move from 8 to 9 fails the suite. Not re-opened.
- `iter3-P2-attached-metrics-unpinned`: rejected; same whole-block comparison. Not re-opened.
- A shell read counting a failed `cat` (exit status is not on the normalized event, `:710-714`): outside the fix's claim and unchanged by it; not raised.

## Next Focus

- Dimension: traceability
- Focus area: `spec.md` T-items and `acceptance-criteria.md` for the refusal/attach and scorer-start claims, plus the README paired-block carry-forward
- Reason: finding 1 needs a spec-side reach judgment for its downgrade trigger, and finding 3 needs the doc contract that owns the policy token
- Rotation status: correctness completed; security and maintainability remain
- Blocked/productive carry-forward: productive — the lead-grammar probe is the cheapest way to break any attach fix
- Required evidence: `spec.md` lines named by `verify-4/report.md` (020 spec.md:122,184,242; T017, T021, T024; P017, P041)
- Recovery note: none

Review verdict: CONDITIONAL
