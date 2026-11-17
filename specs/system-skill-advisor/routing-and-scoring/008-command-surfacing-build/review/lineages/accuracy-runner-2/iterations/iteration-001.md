# Review Iteration 001

## Dispatcher

- Mode: review (fan-out lineage `accuracy-runner-2`, pass two)
- Session: `fanout-accuracy-runner-2-1794570021136-noekp0`, generation 1, lineage mode `new`
- Dimension: D1 Correctness, first pass over the closed pass-one findings
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder)
- Budget profile: verify (12 review actions)
- Operator review focus bound as `review_focus`: pass-two review of command surfacing in the `accuracy-runner` area. Re-verify every pass-one fix first, then review the files changed since pass one line by line, then look for new defects; check cross-runtime behaviour, mutating-command safety and holdout hygiene; never read or print holdout prompt text.
- How this iteration addressed the focus: it re-read every pass-one finding recorded by the pass-one `accuracy-runner` lineage at the code or doc line that fixed it, exercised the two easiest guard tests directly, and counted the committed baseline and corpus by structure (ids and splits only, never holdout text). It did not yet review the changed files line by line; that is iteration 2's scope.
- `steer.md`: absent before this iteration; no lead rulings to apply.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:29,95-114`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs:470-570,640-660`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:69-91,498-610,1140-1189`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:300-316`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:900-975,1270-1330`
- `.skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts:1-133`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts:1-118`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts:93-130`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:800-980`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` (structure and key counts only)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (ids, splits and row types only; no holdout prompt text)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:108-155`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/tasks.md:141`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The pass-one phase-map finding is only half fixed: the reason lives in the phase child, not in the map the finding named** -- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:122` -- The pass-one item `iter3-P2-phase007-open-evidence` asked to "Close phase 007 or record in the phase map why phases 10 to 13 closed past it". Phase 007 is still `In Progress` in the map while 008 and 010 to 013 are `Complete`, and the map carries no sentence saying why. The rationale does exist, but one directory away: `007-per-runtime-behaviour-proof/tasks.md:141` says T020 and T046, plus AC-004, AC-005 and AC-007, wait on the final behaviour arm that runs after the merge to main. A reader of the parent map alone still cannot tell an intentional deferral from a phase that was skipped, which is the ambiguity the pass-one finding named. The fix picked the "close or record" branch but recorded it outside the map.
Finding class: traceability / packet-navigation
Scope proof: the finding is about the packet's own phase map, the review target's `spec.md`; it cites no code and changes no file. The pass-one item was raised by this lineage, so it is re-verified here rather than treated as another area's finding.
Affected surface hints: `spec.md` Phase Documentation Map row 7; `007-per-runtime-behaviour-proof/tasks.md:141`; any operator or planner who reads only the parent map.
Case: an operator opens the parent packet to decide whether phase 007 is safe to close and sees row 7 `In Progress` above thirteen later rows with no note; without opening `007/tasks.md` they cannot tell the final behaviour arm is intentionally deferred, so they either re-plan a finished phase or close one with open acceptance rows.

```json
{
  "type": "claim",
  "claim": "The parent phase map still shows 007 In Progress beside completed later phases and contains no reason, while the reason exists only in 007/tasks.md:141; the pass-one fix required the map itself to carry it.",
  "evidenceRefs": [
    "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:122",
    "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/spec.md:125",
    "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/tasks.md:141",
    "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/review-report-pass-1.md:197"
  ],
  "counterevidenceSought": "Checked whether a later commit added a parent-map note (none in spec.md), whether the phase 007 handoff row in the map states the deferral (it states the 007-to-008 criteria, not why 010 to 013 closed past 007), and whether a parent decisions or continuity file carries the note in place of the map (the note found is in the phase child only).",
  "alternativeExplanation": "The authors may have decided the phase child's note is the authoritative record and the map is only a status table, in which case the residual is a documentation-location choice rather than a defect.",
  "finalSeverity": "P2",
  "confidence": 0.82,
  "downgradeTrigger": "Downgrade to no finding if a parent-packet document that a phase-map reader is expected to open states the deferral, or if the map row gains a note naming the final behaviour arm."
}
```

## Fix Replay (pass one, this area)

Every pass-one finding this lineage raised is listed with the line that was supposed to fix it. "Holds" means the re-read shows the fix present and, where a test exists, the test asserts it; "partial" is reported above as a finding.

| Pass-one id | Fix location | Verdict | Evidence |
|---|---|---|---|
| `iter1-P2-offer-reached-unknown` | `README.md:112` vs `score-command-transcripts.mjs:1294` | Holds | The README now says `offerReached` "counts offers whose brief was not shown missing, so a row whose brief state is unknown counts", and the code increments it when `result.briefDelivered !== false`. |
| `iter1-P2-readme-inventory-drift` | `README.md:29,95-124` | Holds | The table reads `Code files | 14`; the folder holds 22 entries, of which 14 are code (13 `.mjs` + 1 `.py`), 5 are `.jsonl`, 2 are `.json`, and 1 is the README. All 21 non-README files are listed in the structure table. |
| `iter2-P2-arena-precondition-unverified` | `run-command-behaviour.mjs:590-609`, `prepare-behaviour-arena.mjs:314` | Holds | The builder writes `.git/skilled-behaviour-arena`; `liveArmRefusal` resolves that path with `git rev-parse --git-path` and returns `arena_unprepared` when absent; `command-behaviour-guards.vitest.ts:76-89` asserts both the refusal and the marker acceptance. |
| `iter3-P2-phase007-open-evidence` | `spec.md:122` | **Partial** | Reported as finding 1 above. |
| `iter3-P2-readme-restore-exit3` | `README.md:114` vs `run-command-behaviour.mjs:68-69,1140-1145` | Holds | The README now documents exit 3 (`head_moved`) and that the arm ends without the restore; the code returns `EXIT_HEAD_MOVED` after appending `restored: false, headMoved: true`, before `restoreTurn`. |
| `iter4-P2-bench-runtime-matrix-incomplete` | `hook-brief-signal-noise.bench.ts:26-35` | Holds | The matrix is typed as `Record<typeof ADVISOR_RUNTIME_VALUES[number], ...>` and defines all seven values (`claude`, `opencode`, `pi`, `codex`, `cursor`, `devin`, `dsh`); `ADVISOR_RUNTIME_VALUES` is the same seven-value tuple at `lib/advisor-runtime-values.ts:10-18`. |
| `iter4-P2-g2-label-grammar-duplication` | `score-command-transcripts.mjs:31,952-967` | Holds | `startedLabel` reads `G2_ROWS` imported from the runner and returns the row's own `command` and `variant`; no `g2-` grammar regex remains in the scorer (`grep` for `g2-` and `split('-')` returns nothing), and `command-behaviour-guards.vitest.ts:43-66` pins every row. |
| `iter5-P2-credential-hardening-allowlist` | `run-command-behaviour.mjs:828-889` | Holds | `childEnv` copies only `CHILD_ENV_NAMES`, `CHILD_ENV_PREFIXES`, the empty `GH_CONFIG_DIR`, `GIT_TERMINAL_PROMPT=0` and the empty credential helper. `command-behaviour-guards.vitest.ts:19-40` asserts `SSH_AUTH_SOCK`, `AWS_ACCESS_KEY_ID`, `NPM_TOKEN`, `GH_TOKEN` and `AI_SESSION_CHILD` are absent and `ANTHROPIC_API_KEY` survives. Observed: the two guard files pass, 28 tests. |
| `iter5-P2-holdout-secondary-split-publication` | `capture-command-routing-baseline.mjs:499-501,527,543,554-556`; `command-routing-slice.vitest.ts:91-146` | Holds | `publishRow = row.split !== 'holdout'` gates `typedRows`, `attachedRows` and `rows`; the committed baseline publishes 132 row keys, which equals the 132 non-holdout corpus rows, and a scan of every key and string in the baseline finds 0 of the 44 holdout ids. The slice test filters holdout ids out of the row comparison and separately asserts no published map (including `needsModeRows`) names one. |

## Traceability Checks

- `spec_code`: partial. The command-routing baseline's pinned numbers were re-read as structure: 176 corpus rows (44 typed on `none`, 45 plain `tune`, 44 plain `holdout`, 22 must-not-start, 9 near-miss, 12 slash-variant), 132 published rows, `needs_mode_floor` `{count: 1, total: 35}`. The phase-map row remains unexplained (finding 1). Full floor reconciliation belongs to iteration 4.
- `checklist_evidence`: partial. The parent packet holds no checklist; its closure rows live in the phase children. Phase 007's T020/T046 and AC-004/005/007 are open by the note at `007/tasks.md:141`.
- `skill_agent`: notApplicable. No agent definition owns this harness area.
- `agent_cross_runtime`: pass for this iteration's scope. The six runtime argv tables and the runtime-keyed bench matrix were read; the end-to-end per-runtime proof stays open with phase 007 and is not claimed here.
- `feature_catalog_code`: not re-checked this iteration; iteration 4 covers it.
- `playbook_capability`: not re-checked this iteration; iteration 4 covers it.

## Integration Evidence

- `run-command-behaviour.mjs` ↔ `prepare-behaviour-arena.mjs`: the marker string (`skilled-behaviour-arena`) is identical in both files, and the guard resolves it through git's own path lookup rather than assuming `.git/`.
- `score-command-transcripts.mjs` ↔ `run-command-behaviour.mjs`: the scorer imports `G2_ROWS` from the runner, so the fixed started-command labels come from the same table the runner uses to send prompts.
- `capture-command-routing-baseline.mjs` ↔ `command-routing-slice.vitest.ts`: the capture's `publishRow` filter and the test's holdout filter agree; the test also names `needsModeRows` in its publication scan.

## Edge Cases

- **Pass-one item outside the pass-two scope file.** `iter3-P2-phase007-open-evidence` lives in `spec.md`, which the pass-two scope file does not list. It was re-verified because this lineage raised it in pass one, and reported because its fix does not hold; no other file outside the scope list was used as new-finding scope.
- **No live arm could run.** The worktree holds uncommitted files from four concurrent lineages, so the runner's first-turn guard would refuse with `worktree_dirty`; the runner was audited by reading instead. Only the two single-file vitest commands the dispatch allows were executed.
- **Holdout text never read.** Corpus composition was computed from `id`, `split` and `row_type` fields only; no prompt text was printed for any row, and the baseline scan tested ids only.
- **Conflicting pass-one note.** The pass-one report's section 9 records that the pass-one accuracy-runner synthesis claimed `converged` while the stop reason was `maxIterationsReached`; that is a report-metadata inconsistency, not a code defect, and it is left to the merge's own provenance check rather than re-reported here.

## Confirmed-Clean Surfaces

- The allowlisted child environment (`run-command-behaviour.mjs:828-889`) excludes the credential shapes the pass-one finding named, and the guard test pins it.
- The arena marker is written once, after `assertHead`, and before any live turn can observe the checkout.
- The published routing baseline contains no per-row holdout outcome in any of its maps or lists.
- The bench's seven-runtime matrix is complete and type-checked against the shared runtime tuple.
- The started-command label derives from the runner's row table, so label and prompt cannot drift by grammar.

## Ruled Out

- **`offerReached` still counting `unknown` as reached.** Ruled out: the packet's SC-002 pins that rule, and the pass-one fix corrected the README rather than the code.
- **README inventory count still drifting.** Ruled out by recounting both the code files (14) and the listed entries (21 of 21).
- **Bench matrix still two runtimes.** Ruled out by the seven keys and the shared tuple; the bench's exclusion from the default test glob is documented and is the reason pass one found it.
- **`needsModeRows` publishing a holdout id.** Ruled out by the `publishRow` guard before the push and by the baseline scan (0 of 44).
- **The `.env` copy guard missing in the arena builder.** Not reached this iteration; the builder's `holdsDotenv`/`DOTENV_PATTERN` path is iteration 3's security pass.

## Next Focus

- Dimension: correctness
- Focus area: `command-offer.mjs`, `run-command-behaviour.mjs` and `score-command-transcripts.mjs` line by line at their changed regions, plus `measure-brief-cost.mjs`
- Reason: iteration 1 proved the fixes are present; iteration 2 asks whether the changed code around them introduced a defect
- Rotation status: D1 continues
- Blocked/productive carry-forward: productive (fix replay); blocked (no live arm)
- Required evidence: a concrete command or function input per finding, and the line that produces the wrong result

Review verdict: PASS
