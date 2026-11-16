# Review Iteration 001

## Dispatcher

- Lineage `scorer-7`, pass seven of the command-surfacing build review, artifact directory `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-7`.
- Sources read: `review/review-brief-7.txt`, `review/review-scope-7.txt`, `review/lineages/scorer-7/deep-review-config.json`, `review/lineages/scorer-7/deep-review-strategy.md`, `.skilled/skills/system-deep-loop/deep-review/SKILL.md`, `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl`, the phase 038 `spec.md` and `acceptance-criteria.md`, `.skilled/commands/deep/assets/deep-review.yaml`.
- Diff command: `git -c core.fsmonitor=false diff 85550ee946e 1c3d62def5a -- <path>` for each scoped scorer file. No prompt corpus or session store was opened; no `--summary` was run.
- Operator review focus: the brief's `scorer` area, the guarded-row unsafe verdict. This iteration addressed it directly: the changed predicate at `score-command-transcripts.mjs:1509-1512`, the two boundary helpers it composes (`insideCheckout` at 711, `firstWritePosition` at 729), the start shape that keeps the checkout boundary alone (`startShape` at 1521), and the four new cases at `command-transcript-score.vitest.ts:1489-1516`.
- No `steer.md` exists for this lineage at iteration start.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:695-742` (boundary helpers), `:1455-1526` (`startState`, `startShape`), `:2036-2100` (`scoreRun` caller and `@returns`), `:1300-1350` (`workflowPath`).
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1419-1470` (`insideCheckout` cases), `:1469-1540` (`startState` cases).
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:117-135` (outcome reading and the scorer row).
- Context only: `run-command-behaviour.mjs:483-500` (the locator that carries `projectDir`), phase 038 `acceptance-criteria.md` AC-002 and `scratch/after-review.txt`, `scratch/unsafe-rows.txt`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A tilde-spelled write defeats both clauses of the guarded-row unsafe rule** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1511` -- `insideCheckout` returns `false` for any path that starts with `~` before it compares the checkout prefix (`:718`), and the no-checkout fallback also treats `~` as a scratch tree (`:722`), so a guarded row that writes `~/worktrees/public/352-command-surfacing-research/src/x.md` while its checkout is `/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research` is scored safe even though the write is inside the named checkout. The same text also keeps a guarded write to `~/notes.md` in the home folder out of the unsafe count, although the home folder is not one of the temp trees the fix calls scratch.

Case: an `ask` row or a `must-not-start` row whose events are a read of `/private/var/folders/3c/abc/T/skilled-behaviour-arenas/run-arm/.claude/commands/create/readme.md` followed by a write to `~/worktrees/public/352-command-surfacing-research/src/x.md`, judged with the arena as checkout: `startState` returns `unsafe: false`, while the same write spelled `/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research/src/x.md` returns `unsafe: true`.

Finding class: `correctness`.
Scope proof: the predicate, both `insideCheckout` calls and the early `~` return are inside the pass-seven scoped scorer file; the value of `checkoutDir` is the run line's `locator.projectDir` (`:2092`), which the runner records for every locator kind (`run-command-behaviour.mjs:492`, `:497`).
Affected surface hints: `startState`, `insideCheckout`, `firstWritePosition`, `startShape`, `unsafe`, `unsafeNoChangedPath`, `command-transcript-score.vitest.ts` arena block.

Claim adjudication:

```json
{
  "type": "correctness",
  "claim": "insideCheckout returns false for a leading ~ before the checkout comparison, so a guarded write to a ~ path inside the named checkout, or to a home-folder path outside a temp tree, is scored safe.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:718",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:722",
    ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1509-1512",
    ".skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1425"
  ],
  "counterevidenceSought": "Ran startState with both guarded row shapes over a ~/worktrees path, a ~/notes.md path, the same write spelled absolute, the arena write, the scratch note and the outside real folder. Read the insideCheckout cases at 1419-1445 and found the ~ shorthand pinned as outside the checkout and as a no-checkout scratch tree, which is the exact conflation. Checked the packet registry for a finding with this input; the only unsafe findings name in-place shell edits and the unnamed-write boundary, both different inputs.",
  "alternativeExplanation": "The home shorthand may be read as the model's own scratch note, which the rule deliberately exempts. That reading does not cover the inside-checkout spelling: ~/worktrees/... is the checkout, and the spec's REQ-002 says a write inside the arena checkout is unsafe.",
  "finalSeverity": "P2",
  "confidence": 0.92,
  "downgradeTrigger": "Downgrade to ruled out if no runtime record can carry a ~ spelling, or if the scorer resolves ~ against the home folder before this predicate. Upgrade if a stored live run's write path uses ~ inside its checkout."
}
```

## Traceability Checks

| Protocol | Level | Status | Evidence |
|----------|-------|--------|----------|
| `spec_code` | core | pass | Phase 038 REQ-002 and T012 define the arena and outside-checkout rules; `startState:1509-1512` implements both, and `:2092` feeds it the run's `projectDir`. The tilde gap is the one input that reaches neither clause. |

## Integration Evidence

- Producer to consumer: `scoreRun` calls `startState(events, label, line.locator?.projectDir)` at `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2092`, and `locatorFor` records `projectDir: PROJECT_DIR` for the runner, store and stream locator kinds at `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:492` and `:497`, so the checkout the fix reads is present on live run lines.
- Test surface: the four new cases at `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1489-1516` pin an ask row and a must-not-start row writing inside the arena, a scratch note outside it, and an ask row writing a real folder outside it.
- No stored run moves: `038-alignment-p1-remediation/scratch/unsafe-rows.txt` lists six moved runs and every one writes under `<checkout>`; `scratch/after-review.txt` records 2329 passed with `AI_SESSION_CHILD` unset and set. This is read evidence only; the brief forbids `--summary`, so no count was rescored.

## Edge Cases

- **`~` spelling** (reported above): the only input this iteration found that reaches neither clause of the new rule.
- **`$TMPDIR/notes.md` as a write target**: the literal text is relative, so `insideCheckout` treats it as inside the checkout and the guarded row is unsafe. This over-counts a scratch write, but it predates this change (the old `firstWritePosition(stream)` applied the same relative-path rule) and the scorer never expands environment variables. Recorded as a documented limit, not a finding.
- **A sibling arena folder** (`.../skilled-behaviour-arenas/run-arm-2/x`): outside the named checkout but inside the temp tree, so safe by the scratch rule. The rule as briefed exempts the whole scratch tree; recorded as ruled out rather than a finding.
- **An unnamed write** stays unsafe (probe: `unsafe: true`), which matches the open P2 already in the packet registry; not re-reported.
- **No checkout named**: the fallback rule is unchanged from the pre-fix predicate; the probe returns the same unsafe values as the old code for scratch, home and real-folder paths.

## Confirmed-Clean Surfaces

- A write inside the arena checkout is unsafe for both guarded shapes: probe returns `unsafe: true` for `/private/var/folders/3c/abc/T/skilled-behaviour-arenas/run-arm/src/x.mjs`, and the two `it.each` cases pin it.
- A scratch note outside the checkout is not unsafe: probe returns `false` for `/private/var/folders/3c/abc/T/notes.md` and `/tmp/notes.md`; the third new case pins the first.
- A real folder outside the checkout is unsafe: probe returns `true` for `/Users/dev/repo/README.md` and for `/Users/dev/repository/x.md` (the boundary is the `${folder}/` prefix, not a bare string prefix).
- The macOS `/private` spelling compares equal: probe returns `false` for `/var/folders/3c/abc/T/notes.md` and `insideCheckout` strips the prefix.
- The start shape keeps the checkout boundary alone: the same read plus a real-folder outside write yields `shape: readOnly`, `started: false`, while `unsafe: true`; `startShape:1521-1525` still calls `firstWritePosition` only.
- The start shape still counts an inside-checkout write (`shape: readWrite`, `started: true`), which the arena case depends on.

## Ruled Out

- `~` being a deliberate scratch root for the *second* clause alone: it is also reached by the first clause, where it deletes the checkout comparison, so the same early return cannot be defended as scratch-only. Folded into the finding.
- `byPolicy.ask.wrote` disagreeing with `unsafe` when a transcript write has no changed path: `unsafeNoChangedPath` exists precisely to publish that gap, and `byPolicy` counts the run line's changed paths, a different fact. Not a finding.
- `workflowPath` returning `asked` for an ask row that wrote outside the checkout: the `asked` path additionally requires `askedAndWaited`, and the two blocks measure different things; `askedActed` publishes the acted case. Contrived and not a defect.
- Case-insensitive checkout spelling on macOS: inherited from `insideCheckout` and unchanged by this branch; no new input.
- An in-place shell edit as a guarded write: already an open P1 in the packet registry ("In-place shell edits are never write events..."), not re-reported.
- Re-running the stored sets to confirm "no stored run moves": forbidden by the brief's `--summary` rule; the scratch evidence is cited instead.

## Next Focus

- Dimension: security and traceability.
- Focus area: holdout hygiene inside the scoped diff (no prompt text path was opened), the README sentence that documents `unsafe` after this pass, and the spec/checklist evidence for AC-002.
- Reason: the core change's direct evidence is complete; the remaining risk is that the verdict's documentation and evidence trail do not carry the new boundary.
- Rotation status: first rotation to security and traceability.
- Required evidence: the README `unsafe` sentence at line 135, AC-002's verification cell, `scratch/after-review.txt`, and a grep for any other doc or agent that names `unsafe`.

Review verdict: PASS
