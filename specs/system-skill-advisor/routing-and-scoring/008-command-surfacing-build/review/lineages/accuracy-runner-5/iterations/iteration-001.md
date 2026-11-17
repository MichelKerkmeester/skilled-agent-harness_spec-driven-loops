# Review Iteration 001

## Dimension

Correctness: what the transcript scorer counts as a write, a start and an offer, and whether an action that did not happen can still be counted.

## Dispatcher

Pass-five fan-out lineage `accuracy-runner-5` (area `accuracy-runner`), review target `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`. Sources read this iteration: `review/review-brief-5.txt`, `review/review-focus-5.txt`, `review/review-scope-5.txt`, and the packet's `deep-review-findings-registry.json` for deduplication.

## Files Reviewed

- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:160-330]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:348-560]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:662-710]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1044-1100]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1158-1230]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1531-1740]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1918-2060]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:308-370]

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **In-place shell edits are never write events, so `unsafe` and `loopInit` miss every write that is not a redirect** -- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:391-411 -- `normalize` turns a shell call into a `write` event only when `redirectTargets` finds a redirect or `APPLY_PATCH` matches; every other shell call becomes a `shell` event with no write. `startState` builds `unsafe` from `firstWritePosition(stream)` (line 1086) and `deepLoopInit`/`completeLoopInit` look for `write` events only (lines 1174-1200), so `sed -i`, `tee`, `mkdir`, `cp`, `rm`, `git checkout --`, and a script that writes from inside itself are invisible to both. The runner's own `changedPaths` proves the write happened, but it reaches only `workflowPath` through the `wrote` argument (line 1697), never `unsafe`.
   Finding class: correctness (safety metric under-report)
   Scope proof: the counting path is inside `score-command-transcripts.mjs`, which the pass-five scope lists under area `accuracy-runner`; the same file's `startState` doc block (lines 1061-1066) claims unsafe covers "a write on an `ask` row", which is the claim this input contradicts.
   Affected surface hints: `startState`, `deepLoopInit`, `completeLoopInit`, the `unsafe`/`unsafeNoChangedPath`/`loopsWithoutInit` counts and the `policy wrote` block in `addScored`.
   Case: an `ask` row where the turn answers by running `sed -i '' 's/a/b/' specs/x/review/report.md` with no redirect. A probe against the module (`normalize` -> `startState` -> `loopInit`) returns `unsafe=false` and `loopInit=null`, while the same edit written as `printf x > specs/x/review/report.md` returns `unsafe=true` and `loopInit=false`.

```json
{
  "type": "claim",
  "claim": "A shell action that changes a file without a redirect is not counted as a write, so the unsafe count and the loop-init check cannot see it.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:391-411",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1086",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1158-1200",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1697"
  ],
  "counterevidenceSought": "Read every branch that creates a write event (redirect scan, apply_patch, writePaths) and checked whether any other path turns a shell call into a write; checked whether the runner's changedPaths reaches unsafe anywhere; ran the exported facts on both spellings of one edit.",
  "alternativeExplanation": "The scorer may deliberately score only the writes a runtime's tool table reports, leaving shell side effects to the runner's changedPaths. That explanation fails because unsafe is the only count the summary presents as a safety verdict and the runner's path list is discarded before startState runs.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade if a consumer reads changedPaths beside unsafe and folds the two before any release decision."
}
```

### P2 Findings

1. **A refusal that quotes the `COMMAND:` format is scored as a start** -- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:504-507 -- `commandLines` matches the marker anywhere in any assistant text block, and `reportedStart` (line 1004) treats state `started` as a start regardless of the surrounding prose. A refusal, a question or a history statement that spells the marker out with a real command name is therefore counted as a started command on a decline or skill-only row, and as a start on any row whose expected command it names.
   Finding class: correctness (false-positive start)
   Scope proof: the marker scanner and `reportedStart` are in the scoped scorer file; the brief's "can a refusal, a question, a history statement or a mention still start" question is exactly this input.
   Affected surface hints: `startState.started`, `startedCommand`, `commandStartRuns`, `startRate`, `offerSeenIn`.
   Case: a refusal reply that says `A line like COMMAND: /deep:review -> started appears only when I actually run one, so you will not see it here.` A probe returns `commandLines = [{command:'/deep:review', state:'started'}]`, `startedCommand = '/deep:review'` and `startState.started = true` for a decline row that started nothing.

2. **A mode suffix hides a command reported twice** -- .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:529-533 -- `repeatedCommands` keys its tally by the raw matched string (`counts.set(line.command, line.count)`), while every other command comparison in the file goes through `commandParts`, which strips a `:auto|:confirm|:autopilot|:unattended` suffix. Two reports of one command that differ only in the suffix are counted as two distinct commands, so `repeatedCommandLines` stays 0.
   Finding class: correctness (counting fidelity)
   Scope proof: the tally and the normalizer both live in the scoped scorer; `commandParts` at line 582 already owns the suffix rule the tally bypasses.
   Affected surface hints: `repeatedCommands`, `commandLines`, the `repeated` count in `addScored` and the `repeated` field of the printed block.
   Case: one turn that prints `COMMAND: /deep:review → offered` and later `COMMAND: /deep:review:auto → started`. The two lines produce counts of 1 each, so `repeatedCommands` returns 0 although the same command was reported twice.

## Traceability Checks

- `spec_code`: the pass-five scope assigns the seven reviewed files to area `accuracy-runner`; the scorer module, its test file and the two READMEs are the ones this iteration read. Pass for this iteration.
- `checklist_evidence`: the claims under test are the scorer's own doc block ("a write on an `ask` row", "the only evidence in the transcript that it took the command") and the pass-five brief's counting questions, each checked against the code path it names. Two drifts recorded above.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs`: `changedPaths` is written after each turn and read by `scoreRun` (line 1693) but never reaches `startState`, which is the reason finding P1-1 under-reports. Exact surface read: `run-command-behaviour.mjs` run-line assembly and the `changedPaths` field.
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts`: the file's `startState`, `loopInit` and `commandLines` suites exercise redirect writes and plain marker lines only, which is why neither defect is caught.

## Edge Cases

- A shell call that both reads a document and redirects its output is normalised to writes alone, so the read half is also dropped from `followedBeforeWrite`. Recorded here as the same root cause as P1-1 rather than as a separate finding.
- A `COMMAND:` line inside a fenced example in an assistant reply is indistinguishable from a report in the current matcher; the P2 case above is the narrowest input that shows it.
- The scorer's single-session mode (`--runtime`/`--locator`) prints record counts and never scores, which is a pre-existing gap already recorded by pass four and not re-reported.

## Confirmed-Clean Surfaces

- `TOOL_TABLES` covers every tool name the normalizer can meet for claude, codex, opencode, pi, devin, dsh and vibe, and `normalize` refuses an unknown runtime with `unscorable_runtime` instead of scoring an empty stream.
- `offerOf` separates an absent offer field from an offer that named another command, and counts a partner-side offer apart, so a missing field cannot read as a refusal.
- `wilsonRange` and `signTestP` are exact for their inputs: the sign test uses integer binomial coefficients and the Wilson bound is clamped to [0,1].
- `latestLines` keeps one line per runtime, arm, row and run, so a retried line replaces its own earlier line and a second run stays a second sample.

## Ruled Out

- `latestLines` collapsing two same-arm captures into one sample: the key is the documented retry rule, and two files holding the same runtime/arm/row/run describe one retried sample rather than two, so no honest count is lost (evidence: `latestLines` key construction, score-command-transcripts.mjs:1509-1517).
- `startState` calling `firstWritePosition` without the checkout folder while `workflowPath` passes it: the difference only shows for an absolute write outside the checkout and outside temp, which is a write into somebody else's tree, so counting it as unsafe is the defensible reading (evidence: `insideCheckout`, score-command-transcripts.mjs:670-704).
- `workflow.unscored` printing the run-level unscored count inside the workflow line: the number is the same count named twice, not a miscount (evidence: `tallyBlock`, score-command-transcripts.mjs:1857).

## Next Focus

- Dimension: security
- Focus area: holdout hygiene and arena containment -- `prepare-behaviour-arena.mjs`, `run-command-behaviour.mjs` prompt/holdout paths, and the fresh-row set
- Reason: the brief's second half asks whether any tune, fix or report path reads or leaks holdout rows, and whether the arena can carry a secret
- Rotation status: first security pass
- Required evidence: file:line for each guard, plus counts-only corpus queries where a split boundary matters

Review verdict: CONDITIONAL
