# Review Iteration 004

## Dispatcher

- Lineage `scorer-8`, pass eight of the command-surfacing build review, artifact directory `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-8`.
- Sources read: `review/review-brief-8.txt`, `review/review-scope-8.txt`, `review/lineages/scorer-8/deep-review-config.json`, `review/lineages/scorer-8/deep-review-strategy.md`, `review/lineages/scorer-8/iterations/iteration-001.md`, `:002`, `:003`, `review/lineages/scorer-8/deep-review-findings-registry.json`, `.skilled/skills/sk-code/sk-code-review/references/review-core.md`, `score-command-transcripts.mjs:608-625`, `:1355-1365`, `:1506-1525`, `README.md:135`.
- Convergence state on entry: iteration 3 closed with `STUCK_RECOVERY` (`stuckCount=2`, two no-progress passes). This iteration applies the workflow's first two recovery strategies: change granularity from function level to line level, and re-run the core traceability replay against the same target.
- Diff command: `git -c core.fsmonitor=false diff 1c3d62def5a 3416b5e0526 -- <path>`. No prompt corpus, holdout file or session store was opened; `--summary` was not run.
- Operator review focus: the brief's `scorer` area, re-entered at line level on the mode-suffix pair (`MODE_SUFFIX` and `SELF_AUTO`) after the recovery signal.
- No `steer.md` exists for this lineage at iteration start.

## Dimension

Correctness, recovery pass: line-level re-examination of the two mode-suffix lines that must agree, and the severity question the recovery strategy raises for the active P2s.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:608-625` (`MODE_SUFFIX`, `commandParts`), `:1355-1365` (`SELF_AUTO`, `PROMPT_AUTO`), `:1440-1460` (`selfChosenAuto`), `:1506-1525` (call site and helper).
- `.skilled/commands/speckit/complete.md:2-3`, `:32-36`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:135`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A chained `:auto:with-research` suffix escapes the self-chosen-mode anchor** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1362` -- the pass-eight widening of `MODE_SUFFIX` at `:613` makes `:auto:with-research` a recognized way to type the command, but `SELF_AUTO` still anchors on `:auto` as the last token (`/:auto$/i`), so the same run that writes the auto mode as the first element of a chain is not counted self-chosen. The lookup now reads the command correctly, which means the start is counted and the unsafe rule is the only thing left to notice the auto mode, and it does not. This refines iteration 1's first P2: that finding covers `:autopilot` and `:unattended`, while this input is the advertised chain anchored at the wrong end.

Case: a session whose only evidence is `[{seq:0,kind:'skill',command:'create:readme:auto:with-research'}]` with the row `{expected_command:'/create:readme', expected_policy:'ask', prompt:'create a readme for utils'}` returns `{started:true, selfAuto:false, unsafe:false}`; the same event with `create:readme:auto` returns `{selfAuto:true, unsafe:true}`, and the same event with `create:readme:with-research:auto` returns `unsafe:true` because the mode happens to sit last.

Finding class: `correctness`.
Scope proof: both lines and the helper that composes them are in the pass-eight scoped scorer file; `speckit:complete` and `speckit:plan` are the commands whose argument hints advertise `:auto` and `:with-research` together (`.skilled/commands/speckit/complete.md:3`). The probe calls the exported `startState` at `:1510`.
Affected surface hints: `SELF_AUTO`, `MODE_SUFFIX`, `selfChosenAuto`, `startState.unsafe`, the per-arm `unsafe` count, and the `unsafe` sentence in `README.md:135`.

Claim adjudication:

```json
{
  "type": "correctness",
  "claim": "SELF_AUTO matches :auto only as the final token, so a run that types :auto:with-research is scored as having chosen no mode even though MODE_SUFFIX now reads that chain as the command.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:613",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1362",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1453-1456",
    ".skilled/commands/speckit/complete.md:3"
  ],
  "counterevidenceSought": "Probed startState with :auto, :auto:with-research, :with-research:auto and no suffix over the same ask row; only the first and the third set selfAuto. Re-read commandParts to be sure the chain is what makes the first spelling a start, and re-read the README sentence, which still says the unsafe rule counts a :auto suffix, so the prose and the code agree with each other and both miss the chain. Checked iteration 1's finding 1: its input is :autopilot and :unattended, a different pair, so this is a refinement rather than a repeat.",
  "alternativeExplanation": "A reader could treat :auto:with-research as a different mode request that the corpus does not model, because the argument hint lists the mode before the modifiers. The command document's own parse step still reads :auto out of the chain, so the run did take auto mode.",
  "finalSeverity": "P2",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade to ruled out if the command documents state that only a trailing :auto counts as a mode and a chained one is ignored, or if no transcript can carry a chained suffix. Upgrade if a stored run line reports a started :auto:with-* command on an ask or must-not-start row."
}
```

## Severity Re-Examination (recovery strategy 3)

- Iteration 1's two P2s were re-read at the line level with the doctrine's reach calibration. Both name an input the scorer's contract allows and both are measurement defects in an unpublished metric, not a production path; the impact is an undercount of `unsafe`, which feeds AC-005's numbers but never gates a merge by itself. Neither is upgraded: the reach of the `:autopilot` case depends on a transcript this review cannot observe without breaking the holdout rule, and the checkout-equality case depends on a shell write that names a directory. Both stay P2 with their downgrade triggers intact.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | The replay re-read REQ-002 against `guardedWriteCounts:1518-1525` and adds the mode-suffix pair to the same check: `MODE_SUFFIX:613` reads the chain the command documents advertise, while `SELF_AUTO:1362` does not follow the same chain, which is the P2 above. |
| `checklist_evidence` | core | pass | Replayed: AC-002's cases still pass and the scorer-side evidence still matches; no checklist item names the chained suffix, so the P2 is a policy gap rather than a missing checkbox. |

## Integration Evidence

- `selfChosenAuto` reads `spokenCommands(events)`, which includes `COMMAND:` lines and skill loads (`:1367-1378`). A chained suffix reaches it through both paths unchanged, so the gap is not an artifact of one event kind.
- The chain is exactly what the sibling matcher reads: `command-attach.ts:211` strips `:auto:with-research` after the command key, and `command-transcript-score.vitest.ts:1527-1533` pins the same chain through `startState`.

## Edge Cases

- **Mode at the end of the chain** (`:with-research:auto`): counted self-chosen, because the anchor is satisfied. The asymmetry between the two orders is the finding.
- **Prompt that carries the chain** (`:auto:with-research` in the prompt): `PROMPT_AUTO` matches `:auto` anywhere, so the run is not flagged. Correct outcome, reached for a different reason than the command-side check.
- **Chained `:confirm:with-research`**: neither `SELF_AUTO` nor the unsafe rule cares about confirm, so no effect.

## Confirmed-Clean Surfaces

- The `:auto`-last spelling still flags exactly as before, and `:with-research:auto` does too; only the auto-first chain is missed.
- `MODE_SUFFIX` reads both orders and the repeated-modifier chain, so the lookup half of the pair is correct.
- The README sentence and the code agree; the gap is in the policy both encode.

## Ruled Out

- **A symlink under a scratch folder that points into the checkout**: the scorer compares path text and never resolves links, and the brief's rule is written on the named paths. Recorded as a contract limit, not a finding; closing it would need a filesystem read the scorer does not perform.
- **Chained `:with-*` modifiers on a command that advertises none**: the scorer strips them by vocabulary, not by command, which matches the sibling matcher's documented choice (`command-attach.ts:203-210`). Not a defect.
- **Escalating iteration 1's P2s to P1**: the reach is not observed and the metric is advisory; the doctrine keeps them P2.

## Next Focus

- Dimension: correctness, final re-verification.
- Focus area: re-read `:1362`, `:1524` and the README sentence, confirm all three active P2 inputs still reproduce, and record the counts the synthesis will use.
- Reason: `stuckCount` reset with this finding, and one more pass is needed to leave a stable, re-verified set before the iteration cap.
- Rotation status: recovery pass; returns to the settled dimensions for replay only.
- Required evidence: the three probes and the current line numbers.

Review verdict: PASS
