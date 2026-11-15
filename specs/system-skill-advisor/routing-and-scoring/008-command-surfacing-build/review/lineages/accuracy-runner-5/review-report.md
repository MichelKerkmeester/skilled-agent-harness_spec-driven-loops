# Review Report - Command Surfacing Pass Five, `accuracy-runner-5`

Lineage: `fanout-accuracy-runner-5-1794760565927-i99t40` | Artifact root: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/accuracy-runner-5` | Stop reason: `maxIterationsReached` | Iterations: 4

## 1. Executive Summary

**Overall verdict: CONDITIONAL**

- hasAdvisories: false
- Active findings: P0 = 0, P1 = 3, P2 = 7
- Review scope: the seven files `review/review-scope-5.txt` assigns to area `accuracy-runner` -- the transcript scorer, the behaviour runner, the arena builder, the two folder READMEs, and the two vitest files that cover them.
- Dimensions covered: correctness (iteration 1), security (iteration 2, re-entered in iteration 3), traceability (iteration 3), maintainability (iteration 4).
- Operator review focus: "Code review pass five of command surfacing. Read review/review-brief-5.txt in the packet first and follow it. Review the files in review/review-scope-5.txt whose area equals your lineage label without its -5 suffix, plus docs that describe them. Each finding is P0, P1 or P2 with file:line and a concrete input. Check the kill switch and direct-call switch paths, command offers on refusal, question, history or mention, Vibe journal scoring, the doctor hooks-file reading, docs against code, and holdout hygiene. Never open command-prompts.jsonl, holdout-prompts.jsonl or behaviour-fresh-prompts.jsonl except through jq del(.prompt), and print counts only. Change no code and write only inside your lineage folder."

Three P1 findings keep the verdict at CONDITIONAL. Two of them are measurement-integrity defects in this lineage's own area: the transcript scorer cannot see a shell write that is not a redirect, and the arena's build output is the working tree's build while its tracked tree is HEAD. The third is a containment invariant applied once per arm rather than once per turn. Seven P2 findings cover the remaining count semantics, the arena's file-type and platform guards, the untested copy path and one copied contract literal.

## 2. Planning Trigger

`/speckit:plan` is required: three active P1 findings need an implementation packet before the next pass.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": {"P0": 0, "P1": 3, "P2": 7},
  "remediationWorkstreams": [
    "WS-1 scorer write detection",
    "WS-2 runner containment per turn",
    "WS-3 arena provenance",
    "WS-4 arena guard and coverage advisories"
  ],
  "specSeed": [
    "Define which shell actions count as a write for the unsafe and loop-init checks",
    "State whether a live arm re-checks containment before every turn",
    "State the arena's build-provenance precondition and what the run line must record about it"
  ],
  "planSeed": [
    "Add a shell-write detector for in-place edits and non-redirect writers, and feed it to startState and the loop-init checks",
    "Re-run the containment guard per turn, or assert the checkout has no remote after every restore",
    "Refuse an arena build from a dirty worktree, or record the build's source digest on the run line",
    "Cover the arena copy path, the dotenv skip and the marker contract in the guards suite"
  ],
  "findingClasses": ["correctness", "security", "traceability", "maintainability"],
  "affectedSurfacesSeed": [
    "score-command-transcripts.mjs normalize/startState/loopInit",
    "run-command-behaviour.mjs runTurn/liveArmRefusal",
    "prepare-behaviour-arena.mjs copyPlan/buildArena/runCp",
    "command-behaviour-guards.vitest.ts arena builder block"
  ],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | Evidence | Fix recommendation | Finding class | Scope proof | Affected surfaces |
|---|---|---|---|---|---|---|---|---|
| iter1-P1-shell-writes-invisible | P1 | In-place shell edits are never write events, so `unsafe` and `loopInit` miss every write that is not a redirect | correctness | `score-command-transcripts.mjs:391-411`, `:1086`, `:1158-1200`, `:1697` | Detect `sed -i`, `tee`, `cp`, `rm`, `mkdir` and similar non-redirect writers as writes, or consume the runner's `changedPaths` in `startState` | correctness | Counting path inside the scoped scorer; the file's own `startState` doc claims a write on an `ask` row is unsafe | `startState`, `deepLoopInit`, `completeLoopInit`, `unsafe`, `unsafeNoChangedPath`, `loopsWithoutInit` |
| iter3-P1-arena-build-not-the-commit | P1 | The arena's build output comes from the working tree while its tracked tree comes from HEAD | traceability | `prepare-behaviour-arena.mjs:310-327`, `:22-24` | Refuse a dirty source worktree, or copy the build from a clean checkout, and record the build provenance on the run line | traceability | Both halves of the mismatch are in the scoped builder; the claim is the module header | `copyPlan`, `buildArena`, `stampBuildTree`, arena marker, every attributed number |
| iter3-P1-remote-guard-first-turn-only | P1 | The containment guard runs before the first turn only, so a remote added by any turn survives and a later turn can push | security | `run-command-behaviour.mjs:1264-1268`, `:1403`, `:610-613`, `worktree-restore.mjs:20-120` | Re-check `liveArmRefusal` before every turn, or assert no remote after each restore | security | Guard call site, restore mechanism and the comment are in the scoped files | `runTurn`, `liveArmRefusal`, `restoreTurn`, `statusSnapshot` |
| iter1-P2-quoted-command-line-is-a-start | P2 | A refusal that quotes the `COMMAND:` format is scored as a start | correctness | `score-command-transcripts.mjs:504-507`, `:1004` | Require the marker to be the reply's own report rather than a quoted example, or count a quoted line apart | correctness | Marker scanner and `reportedStart` are in the scoped scorer | `startState.started`, `startedCommand`, `commandStartRuns`, `startRate` |
| iter1-P2-mode-suffix-hides-repeat | P2 | A mode suffix hides a command reported twice | correctness | `score-command-transcripts.mjs:529-533`, `:582` | Key the repeat tally by `commandParts` rather than the raw string | correctness | Tally and normalizer are in the scoped scorer | `repeatedCommands`, `repeated` count |
| iter2-P2-symlink-escapes-arena | P2 | The dotenv skip and the containment claim cover regular files only, so a symlinked entry is copied as a link that can point outside the arena | security | `prepare-behaviour-arena.mjs:218-269`, `:12-34` | Refuse or materialise a symlinked entry whose target is outside the arena | security | Walk, guard and copy call are in the scoped builder | `copyPlan`, `holdsDotenv`, `copyPath`, `buildArena` |
| iter2-P2-tracked-dotenv-cloned | P2 | A dotenv file tracked in the commit under test is cloned into the arena | security | `prepare-behaviour-arena.mjs:275-327`, `:31-34` | Run the dotenv check over the clone as well as the copied trees | security | Clone, copy plan and guard are in the scoped builder | `buildArena`, `cloneInto`, `copyPath` |
| iter2-P2-macos-only-copy-flag | P2 | The single copy call uses the macOS clonefile flag with no platform check | security | `prepare-behaviour-arena.mjs:226-230`, `:254`, `.github/workflows/spec-kit-check.yml:251-298` | Fall back to a portable copy flag when `cp` rejects `-c`, or state the macOS-only precondition | security | Copy call is in the scoped builder; the CI lane is the platform evidence | `runCp`, `copyPath`, `buildArena` |
| iter4-P2-marker-literal-duplicated | P2 | The arena marker's name is a literal in two modules and no test asserts they agree | maintainability | `prepare-behaviour-arena.mjs:61`, `run-command-behaviour.mjs:523`, `command-behaviour-guards.vitest.ts:286` | Export the marker name from one module and assert it in a test | maintainability | Both copies and the test are in the scoped files | `MARK` in both files, marker write and read |
| iter4-P2-arena-copy-path-untested | P2 | The guards suite never exercises the builder's copy path | maintainability | `command-behaviour-guards.vitest.ts:407-468`, `prepare-behaviour-arena.mjs:193-269` | Add one small `dist` tree with a `.env` file and assert both the copy and the skip | maintainability | Test file and builder are both in the scoped area | `copyPlan`, `holdsDotenv`, `copyPath`, `runCp`, `stampBuildTree` |

Every finding above is active. No finding was downgraded or resolved during the run.

## 4. Remediation Workstreams

### WS-1 Scorer write detection (P1, do first)
1. Extend write detection beyond redirects and `apply_patch` so an in-place edit and a non-redirect writer produce a write event, or pass the runner's `changedPaths` into `startState`.
2. Re-check `loopInit` against the same events so a loop that edits its own state without a lock is not read as "no loop".
3. Add the two regression cases to `command-transcript-score.vitest.ts`.

### WS-2 Runner containment per turn (P1)
1. Re-run `liveArmRefusal` before every live turn, not only the first, or compare `git remote` after each restore.
2. Treat a new remote as a restore failure so the turn's line records it.
3. Add a guard test that a remote added by one turn is refused by the next.

### WS-3 Arena provenance (P1)
1. Refuse to build from a dirty source worktree, or copy build output from a clean checkout of `head`.
2. Record the build's provenance (source digest or clean-tree assertion) in the arena marker and carry it to the run line.
3. Document the precondition in the `routing-accuracy/README.md` builder row.

### WS-4 Arena guard and coverage advisories (P2)
1. Handle symlinked entries in `copyPlan`/`copyPath`.
2. Apply the dotenv check to the clone.
3. Add a portable copy fallback or state the platform restriction.
4. Export the marker name once and add the copy-path test that covers all of the above.

## 5. Spec Seed

- The pass-five packet should state which shell actions count as a write for the safety counts, because "a write on an `ask` row" currently means only a tool-level write or a redirect.
- The packet should state whether the arena is allowed to be built from a dirty worktree; today the header implies it is not, and nothing enforces it.
- The packet should state whether containment is an arm-opening precondition or a per-turn invariant; the code and its comment disagree.
- The pass-five scope should name the test file that must gain a case for each new builder guard.

## 6. Plan Seed

- `01` add the shell-write detector and its two regression cases.
- `02` re-check containment per turn and record a new remote as a restore failure.
- `03` refuse a dirty-source arena build or record the build provenance.
- `04` cover the copy path, dotenv skip, symlink handling and marker contract in the guards suite.
- `05` re-run the pass with the same area split once `01`-`04` land.

## 7. Traceability Status

### Core Protocols

- `spec_code`: pass. The seven scoped files match the area assignment in `review-scope-5.txt`, and every finding names the file and line it came from.
- `checklist_evidence`: pass with two recorded contradictions. Two scorer doc-block claims and two builder/runner comments describe behaviour the code applies more narrowly; both are recorded as findings rather than as unchecked items.

### Overlay Protocols

- `skill_agent`: pass. The scorer and runner are consumed from `system-skill-advisor`'s runtime folder; no agent definition is in this area's scope.
- `agent_cross_runtime`: notApplicable. No agent file is in this area's scope.
- `feature_catalog_code`: partial by scope. `docs-metadata` owns the feature-catalog pages; this lineage cross-checked the two folder READMEs only.
- `playbook_capability`: notApplicable. The manual-testing playbook belongs to another lineage's area.

### AC_COVERAGE

`AC_COVERAGE`: exempt for this lineage. The acceptance-coverage signal applies to the review target spec folder's checklist, not to a single-area lineage; this lineage's closure gate is its own findings registry.

## 8. Deferred Items

- The README defects already recorded by pass two and pass four (backfill field counts, `--brief-only` wording, `--row-id` scope, paired-block wording, structure-table drift) are not re-reported here; they stay with their original findings.
- The kill-switch and doctor hooks-file paths named in the pass-five brief belong to the `kill-switch-cli` and `vibe-hooks-doctor` lineages and were not reviewed here.
- The `workflow.unscored` duplicate name is a readability nit with no miscount, so it is left as an observation rather than a finding.

## Dimension Expansion Map

- Saturated directions: transcript write/start counting (iteration 1), holdout and arena guards (iteration 2), builder and runner claims (iteration 3), shared literals and test surface (iteration 4).
- Completed pivots: 0. Failed pivots: 0. Audited overrides: 0.
- Council artifacts: none.
- Selected review directions: the four configured dimensions plus one security re-entry in iteration 3 for the per-turn containment contract.
- Remaining frontier: none; the loop stopped at `maxIterationsReached`.

## 9. Search Ledger

- `searchCoverage`: required bug classes for this area were counting fidelity, containment, secret exposure, provenance and test coverage. Covered: counting fidelity, containment, secret exposure, provenance, test coverage. Ruled out: multi-turn session scoping, chat probe split filtering, README drift already recorded. Deferred: none. Blocked: none.
- `candidateCoverage`: ten candidates were exercised; ten findings recorded; four directions ruled out with evidence in the iteration files.
- `searchDebt`: none.
- `ruledOutCandidates`: listed per iteration under `## Ruled Out`.
- `cleanSearchProof`: each iteration names the files and line ranges read and the check that made the direction clean.
- Graph coverage mode: graphless fallback (the lineage's convergence graph carries only the file and bug-class nodes each iteration emitted).

## 10. Audit Appendix

- Convergence summary: iteration ratios 1.0, 0.3, 0.5, 0.0909; the loop stopped at the fourth of four permitted iterations with stop reason `maxIterationsReached`, so no converged signal is claimed.
- Coverage summary: correctness 1 pass, security 2 passes, traceability 1 pass, maintainability 1 pass; every scoped file was read at least once and every changed file carries a recorded verdict.
- Ruled-out claims: `latestLines` sample collapse, the `startState` checkout argument, `workflow.unscored` as a miscount, a tracked dotenv in this repository, the chat probe split filter, multi-turn Vibe scoping, holdout parsing in `findRow`, a mid-arm dirty-worktree refusal, `command-bridges` policy drift, and the scorer's test-only export surface.
- Sources reviewed: the seven scoped files, `worktree-restore.mjs`, `command-offer.mjs`, `vibe.mjs`, `claude.mjs` and `index.mjs` under the shared session readers, `derive-command-bridges.cjs`, `.github/workflows/spec-kit-check.yml`, and the packet's brief, focus, scope and findings registry.
- Holdout hygiene of this review: no holdout prompt text was read or printed; corpus access was limited to `jq del(.prompt)` counts and label fields.
- Release readiness: `in-progress` -- the loop reached its iteration cap without a converged signal, and three P1 findings remain open.

### Core Protocols Appendix

`spec_code` and `checklist_evidence` are recorded in section 7 with their evidence.

### Overlay Protocols Appendix

`skill_agent`, `agent_cross_runtime`, `feature_catalog_code` and `playbook_capability` are recorded in section 7 with their applicability.
