# Review Iteration 001 - attach-scorer-10

## Dispatcher

- Mode: review, leaf iteration 1 of the `attach-scorer-10` fan-out lineage.
- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Scope: the seven `attach-scorer` rows of `review/review-scope-10.txt`.
- Focus read first: `review/review-brief-10.txt` (area label, scope file, graph and stop steps, holdout rule).
- Review focus binding `review_focus`: this iteration reads and follows `review-brief-10.txt`; it names the mention guard, the scratch-folder pattern, the re-captured routing baseline and the bench's Vibe row, and every finding below stays inside that area.
- Diff basis: `git -c core.fsmonitor=false diff 05f776202e0 5b2b062baef -- <area paths>`, then the whole file at HEAD.
- Recorded limits honoured: suffix-before-extension, the `node -e` arrow redirect, macOS-only `isolation-check.sh`, underscore emphasis, the two moved baseline rows judged by lead indices only, and the open P2 list in `038-alignment-p1-remediation/scratch/alignment-final-dispositions.md`.
- Holdout rule honoured: no prompt corpus was opened, no `git diff/show/log -p` over a corpus path was run, `score-command-transcripts.mjs --summary` was not run, and no CLI session text was printed.

## Files Reviewed

| File | Lines read | Dimension |
|------|-----------|-----------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | 240-270, 330-455, 480-520 | correctness |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | 130-240, 455-485 | correctness |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | 600-745, 1355-1375, 1445-1475, 1495-1545 | correctness |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | 1430-1450, 1500-1575 | correctness |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` | 1-60, 1780-1820 | correctness |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | 130-140 | correctness |
| `.skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts` | 1-134 | correctness |

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **A single-quoted command name still hides a refusal or a question lead** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:423` -- The new strip drops backticks, asterisks and straight or curly double quotes, and the comment above it claims that "quote marks around a name are dropped", but a straight or curly single quote is left in place. `commandOnlyMentioned("do not run '/create:readme' yet", "/create:readme")` returns `false`, so the refusal is not read and `attachCommand` (`:501`) and `typedCommandForTop` (`:259`) both offer the command the reader refused. The same holds for a question: `commandOnlyMentioned("what does '/create:readme' do?", "/create:readme")` returns `false`. The defect is the same class the branch set out to close for backticks and double quotes, and a straight apostrophe is the most common way to quote a command in chat prose after the backtick.
   Finding class: incomplete markup normalization in the shared mention guard.
   Scope proof: the strip line at `:423`, its comment at `:411-418`, the two offer call sites at `:259` and `:501`, and the new markup table at `tests/command-attach-guards.vitest.ts:172-184` are this area's own changed surface.
   Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:423`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:259`, `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:501`, `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:172`.
   Case: `do not run '/create:readme' yet` (or the curly form `do not run ‘/create:readme’ yet`) is read as a request, so `/create:readme` is attached to the recommendation; the plain form `do not run /create:readme yet` and the backticked form both withhold it.

   ```json
   {"type":"claim","claim":"A command name wrapped in straight or curly single quotes does not carry its refusal or question lead into the mention reader, so the command is offered against the reader's refusal or question.","evidenceRefs":[".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:423",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:411",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:259",".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:501",".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:172"],"counterevidenceSought":"Ran commandOnlyMentioned at HEAD on the straight and curly single-quote refusal and question forms (all false) beside the backtick and double-quote forms (all true); read the whole markup test table and found no single-quote row; checked whether the caller normalizes apostrophes (fusion.ts and advisor-recommend.ts pass the prompt through unchanged). Read the contraction handling to test the one reason to exclude the character.","alternativeExplanation":"A straight single quote is also the apostrophe in what's and don't, so stripping it globally would turn what's into whats and break the ask lead; the authors may have scoped the fix to inline code, bold and double quotes on purpose.","finalSeverity":"P1","confidence":0.85,"downgradeTrigger":"Downgrade to P2 if a single-quoted command name is judged outside the claimed markup class, because the apostrophe cannot be stripped globally without breaking the contraction leads."}
   ```

### P2 Findings

None in this dimension. The provenance and coverage questions raised by the same files belong to iterations 3 and 4, where their dimension is loaded.

## Traceability Checks

- `spec_code` -- pass for this dimension. Phase 038 `REQ-006` and `AC-006` own every scorer change in this scope: the suffix chain read off the name before the route in linear time, a self-chosen `:auto` with modifiers or a route read as the run's own mode, and `/tmp`, `/var/tmp` and `/var/folders` treated as scratch. The code at `:609-640`, `:716-742`, `:1461-1468` and `:1514-1536` matches each clause, and the new cases at `tests/command-transcript-score.vitest.ts:1438-1446` and `:1528-1554` pin them. `REQ-003`'s leading-anchor row is pinned at `tests/command-attach-guards.vitest.ts:471-476`. The D-01 disposition in `038-alignment-p1-remediation/scratch/alignment-final-dispositions.md` owns the mention fix; the single-quote case above is the one input in its claimed class that it does not cover.
- `checklist_evidence` -- notApplicable: this phase-parent packet has no `checklist.md`; the review closes over the area files and the packet's requirement rows.

## Integration Evidence

- The changed mention guard is consumed by three surfaces, and each was read: `attachCommand` at `command-attach.ts:501`, `typedCommandForTop` at `:259`, and the scorer's re-rank path at `runtime/lib/scorer/fusion.ts:1213`, `:1232` and `:1248`. The single-quote gap reaches the first two directly and the fusion rows through the same predicate.
- The scratch predicate is consumed by `insideCheckout` at `score-command-transcripts.mjs:721`, `firstWritePosition` at `:747`, `startShape` at `:1552` and `guardedWriteCounts` at `:1536`; all four were read and share the one `SCRATCH_FOLDER` constant.
- The re-captured baseline is held row by row by `runtime/tests/command-routing-slice.vitest.ts` (context evidence, outside this area); the two moved rows are `sv-06` and `sv-08`, and the metric arithmetic reconciles: `reached_top3` 2 to 0 (both moved rows left the top three), `agreement` 6/10 to 5/9 (`sv-08` left the set that counts a bridge below a skill; `sv-06` already had a bridge on top), while `named_total` 8, `partial_total` 4, `false_offer` 0/35 and the corpus hash did not move.

## Edge Cases

- Curly single quotes are folded to the straight form at `command-attach.ts:424`, so the P1 covers both spellings; the fold happens before the strip, and the strip does not include `'`.
- The `'` exclusion has a real constraint behind it: `COMMAND_ASK_LEADS` and the decline list match `what's` and `don't` as written, so a blanket strip would break those leads. A fix has to remove only the quotes that abut a command name, not every apostrophe.
- The mention guard is shared by the hub route and the typed route, so the P1 is one fix point, not two.
- The strip runs before whitespace folding; probe inputs with runs of spaces and a line break still behave as before.

## Confirmed-Clean Surfaces

- `commandParts` route-before-suffix: probed `speckit:complete:auto add auth`, `speckit:complete:auto:with-research:with-context:with-phases`, `speckit:complete:draft:auto` (still refused), a leading-slash form, repeated colons and a trailing colon; each resolves to the expected name and route, and the pop loop is linear in the segment count.
- `SELF_AUTO`: the head-only application reads `:auto` before a route and before a modifier chain, and the longest chain starts with self-auto true, as `AC-006` requires.
- `SCRATCH_FOLDER`: `/tmp`, `/tmp/notes.txt`, `/var/tmp/notes.txt`, `/private/var/tmp/notes.txt`, `/var/folders/ab/T/x.md` and both `/private` spellings read as scratch; `/tmpfiles/notes.txt`, `/var/tmpfoo/x` and a home path do not.
- `SCRATCH_FOLDER` in `guardedWriteCounts`: a guarded write to `/var/tmp/notes.md` or bare `/tmp` no longer counts as unsafe, which is exactly `REQ-006`'s clause, and a write into a real folder outside the arena still counts.
- Baseline arithmetic: the two moved rows and the four metric fields reconcile as recorded above; no other row in `rows` moved.
- Bench: `ADVISOR_RUNTIME_VALUES` at `runtime/lib/advisor-runtime-values.ts:12-21` enumerates eight runtimes including `vibe`, so the added `SEVEN_AXIS_MATRIX` row is the exhaustive-record requirement, and its `not-recorded` values are honest because nobody probed Vibe.

## Ruled Out

- A suffix followed by a file extension (`:auto.md`) reading as the command: recorded limit, no new input breaks it.
- The two moved baseline rows as a defect: judged under the recorded limit that their text is not read; the metric shift and the dispositions' lead-index evidence reconcile with the D-01 fix.
- The `SCRATCH_FOLDER` widening as a security regression: `REQ-006` names `/var/tmp` and bare `/tmp` as scratch, and the dispositions record the shared-pattern trade-off as an open P2 (F1), so re-reporting it without a new input would violate the recorded-limit rule.
- Quadratic suffix parsing: the pop loop reads each segment once, and `AC-006` records the 12055 ms to 8 ms measurement.
- A `--write` refusal claim in the README: the sentence's antecedent is the real-embedding mode, and the script at `:800-806` refuses only `--write --real-embedding`; the fixture `--write` path stays available to the slice test.
- ReDoS in the mention regexes: the leads hold bounded gaps and no nested quantifier over one span; the only superlinear shape is the pre-existing per-occurrence prefix slice, unchanged by this diff.

## Verdict

One active P1 (single-quote mention gap). No P0. The scorer and baseline changes in this scope match their owning requirement and their arithmetic reconciles.

## Next Focus

- Dimension: security
- Focus area: the four changed surfaces under a trust-boundary read, especially prompt-text handling in `commandOnlyMentioned` and path handling in `insideCheckout`/`guardedWriteCounts`
- Reason: correctness is complete; security is the next uncovered dimension
- Rotation status: D1 complete, D2-D4 pending
- Required evidence: every finding names an in-reach input and a `file:line`; a scratch-widening claim must name the requirement that owns it
- Recovery note: none

Review verdict: CONDITIONAL
