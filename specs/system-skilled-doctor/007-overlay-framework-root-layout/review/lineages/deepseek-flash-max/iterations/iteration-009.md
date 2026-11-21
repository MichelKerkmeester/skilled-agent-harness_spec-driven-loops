# Review Iteration 009

## Dispatcher

- Target spec folder: `specs/system-skilled-doctor/007-overlay-framework-root-layout`
- Review packet root: `specs/system-skilled-doctor/007-overlay-framework-root-layout/review/lineages/deepseek-flash-max`
- Frontier node: `F-1-006` at depth 1 of 3 (the packet-and-docs node)
- Dimension: traceability
- Focus: close the `checklist_evidence` core protocol by executing the packet's own six completion criteria
- Executor: cli-mistral-vibe model=deepseek-flash (inline, no nested dispatch)
- Operator review focus: follow-up round after remediation. This iteration asks the traceability half of the follow-up question: whether the packet's own completion criteria still reproduce against the remediated tree, which is the one core protocol the previous eight iterations left `partial`.
- Rotation note: the reducer listed no dimension as remaining after iteration 8, so this iteration is steered by `reviewUnfinishedCoreProtocols`, which named `checklist_evidence` as the one core protocol the stop still owed. The dimension is traceability because that is the protocol's dimension in `review-mode-contract.yaml:247-254`.

## Files Reviewed

| File | Lines | Why |
|------|-------|-----|
| `specs/system-skilled-doctor/007-overlay-framework-root-layout/goal.md` | 80-95 | The packet's six completion criteria, read verbatim |
| `specs/system-skilled-doctor/007-overlay-framework-root-layout/003-engine-docs-and-release/goal.md` | 60-70 | The ticked criterion R7-P2-001 rests on |
| `.skilled/commands/doctor/assets/doctor-env.yaml` | 48 | The single hit the phase-003 criterion prints |
| `.skilled/skills/system-skilled-doctor/SKILL.md` | 5 | Criterion 2, first clause |
| `.skilled/skills/system-skilled-doctor/changelog/v1.2.0.0.md` | 16, 29, 57 | Criterion 2, second clause |
| `barter/ai-speckit/skilled/.skilled-overlays.json` | 1 | Criterion 3 |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-fixtures.cjs` | 63 | Whether the engine suites write inside the repository |

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The packet's last completion criterion understates the phase count** -- `specs/system-skilled-doctor/007-overlay-framework-root-layout/goal.md:93` -- The criterion reads `validate.sh --recursive --strict` on this packet and its six phases prints `RESULT: PASSED`. The packet now holds eleven phase folders, `001-engine-out-of-tree-overlay-folder` through `011-push-and-repin-open-items`, so a run that satisfied the criterion as written would validate six of eleven phases and still print `RESULT: PASSED`. The count was correct when the criterion was written and drifted as phases 007 to 011 were added.
   Finding class: traceability
   Scope proof: listed the packet directory and counted eleven `0*/` folders; read `goal.md:93` verbatim; the criterion names no glob and no explicit folder list, so its scope is fixed by the numeral alone.
   Affected surface hints: `specs/system-skilled-doctor/007-overlay-framework-root-layout/goal.md`, `specs/system-skilled-doctor/007-overlay-framework-root-layout/009-skilled-open-items`, `specs/system-skilled-doctor/007-overlay-framework-root-layout/010-barter-open-items`, `specs/system-skilled-doctor/007-overlay-framework-root-layout/011-push-and-repin-open-items`
   Case: an operator runs the criterion's command, sees `RESULT: PASSED`, and records the packet as validated while phases 007 to 011 were never in the validated set.

   ```json
   {
     "type": "claim",
     "claim": "The packet's sixth completion criterion validates six phases while the packet holds eleven, so its PASS cannot cover the packet it names.",
     "evidenceRefs": [
       "specs/system-skilled-doctor/007-overlay-framework-root-layout/goal.md:93",
       "specs/system-skilled-doctor/007-overlay-framework-root-layout/011-push-and-repin-open-items"
     ],
     "counterevidenceSought": "checked whether `--recursive` on the packet folder would reach every child regardless of the numeral: it would, so the numeral is descriptive rather than operative. That reading makes the criterion's command correct and its wording wrong, which is still a traceability defect because the wording is what a reader checks the result against. Checked whether a later phase records the eleven-folder run: no phase records a recursive run after 006.",
     "alternativeExplanation": "the numeral may be a leftover from the packet's original six-phase shape that nobody re-read after 007 was added. That is the same defect stated as a cause rather than a refutation.",
     "finalSeverity": "P2",
     "confidence": "high",
     "downgradeTrigger": "drop if the criterion is reworded to name the packet folder alone, or to name all eleven phases, which makes the wording match what the command validates"
   }
   ```

## Traceability Checks

| Check | Protocol | Result | Evidence |
|-------|----------|--------|----------|
| `checklist_evidence` | core | partial | Five of the packet's six criteria executed read-only and all five pass; the sixth is `validate.sh --recursive --strict`, which this lineage's dispatch forbids it to run. The phase-003 ticked criterion R7-P2-001 still does not reproduce, so one unsupported completion mark remains. |
| `spec_code` | core | pass | Criterion 2's two clauses match the code and the docs: `SKILL.md:5` prints `version: 1.2.0.0`, and `changelog/v1.2.0.0.md:16`, `:29` and `:57` each name `/doctor:overlay apply --relayout`. |
| `decision_alignment` | core | pass | Criterion 3 matches D4 exactly: `barter/ai-speckit/skilled/.skilled-overlays.json:1` prints `{ "overlayDir": "../overlays" }` and `ls -d barter-overlays` fails. |
| `integration_naming` | core | pass | Criterion 5 names the guard surface and the engine answers on it: `--guard .skilled/skills/sk-git/sk-git-skilled/SKILL.md` exits 1 and its refusal names `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`. |

### Criterion-by-criterion result

| # | Criterion | Result | Evidence |
|---|-----------|--------|----------|
| 1 | `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 | pass | Executed: `tests 262`, `pass 262`, `fail 0`, `duration_ms 28548`. The suites write only under `os.tmpdir()` (`overlay-engine-fixtures.cjs:63`), and `git status --porcelain` over `.skilled/commands/doctor`, `.skilled/skills/system-skilled-doctor` and `barter/ai-speckit` is empty afterwards. |
| 2 | `SKILL.md:5` prints `version: 1.2.0.0`, and the changelog names `/doctor:overlay apply --relayout` | pass | `sed -n 5p` prints `version: 1.2.0.0`; the changelog names the command at `:16`, `:29` and `:57`. |
| 3 | `.skilled-overlays.json` prints `{ "overlayDir": "../overlays" }`, and `ls -d barter-overlays` fails | pass | `cat` prints the object verbatim; `ls` reports `No such file or directory`. |
| 4 | `status --json` reports `PASSED` and an empty `offLayout` | pass | `result: PASSED`, `overlayFolder: ../overlays`, `offLayout: []`, `in-sync: 488`, `check.checked 136 / ok 136 / miss 0`. |
| 5 | `--guard` exits 1 and names a source under `../overlays/framework/` | pass | Exit 1; the refusal names `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`. |
| 6 | `validate.sh --recursive --strict` prints `RESULT: PASSED` | not executed | Forbidden by this lineage's dispatch, which names `validate.sh` as a command that writes outside the lineage. Recorded as a limit, not a pass. |

## Integration Evidence

- `.skilled/commands/doctor/scripts/tests/overlay-engine-fixtures.cjs:63` builds every fixture with `fs.mkdtempSync(path.join(os.tmpdir(), prefix))`, which is why criterion 1 could be executed without writing inside the repository. The post-run `git status --porcelain` over the three reviewed trees is empty, so the execution left no residue.
- `barter/ai-speckit/skilled/.skilled/commands/doctor/scripts/overlay-engine.cjs` is the vendored engine the criteria 4 and 5 commands actually run, and it answers on the sibling folder: `overlayFolder: ../overlays` with `offLayout: []` is the D2 sibling layout being read back by the vendored copy rather than by the Skilled source.
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/003-engine-docs-and-release/goal.md:62` is the ticked criterion R7-P2-001 rests on, and `.skilled/commands/doctor/assets/doctor-env.yaml:48` is the single hit it prints. The hit is the word `opt-in` inside a boolean-parsing description, unrelated to the layout rule.

## Edge Cases

- **The coverage gate cannot be closed inside this lineage's authority.** `terminal-gates.cjs` reports `coverage: fail` with reason `traceability-incomplete`, because `checklist_evidence` is a hard-gate protocol in `partial`. Two independent causes keep it partial: the phase-003 ticked criterion R7-P2-001 does not reproduce, and criterion 6 is a command this dispatch forbids. The first cause is a one-line amendment to `003-engine-docs-and-release/goal.md:62`; the second is an authority limit. Neither is fixable from inside the lineage, so the run stops on `blockedStop` rather than on convergence. Recorded here rather than resolved silently.
- **The iteration verdict line and the synthesis verdict diverge, by rule.** No P0 was ever active, so every iteration line reads `Review verdict: PASS`. The synthesis verdict is derived by `review-verdict.cjs`, which returns FAIL when `failedRequiredGateIds` is non-empty. The report states the synthesis verdict and names the gate, so the divergence is visible rather than hidden.
- **The config's `generation` disagrees with the run's own records.** `deep-review-config.json` carries `generation: 2`, while iterations 1 to 8 recorded `generation: 1`. This iteration keeps `1` so the state log stays internally consistent, and records the disagreement here. The reducer does not key on generation, so nothing downstream changes.
- **The packet's criteria are unchecked, so they impose no completion mark.** All six read `- [ ]` in `goal.md`. The unsupported mark that keeps `checklist_evidence` partial is the phase-003 `[x]`, not the packet's own list. That distinction is why the protocol is `partial` rather than `fail`.
- **The engine suites were executed, which the prior eight iterations did not do.** Every earlier iteration read the suite source instead of running it, because the suites were assumed to write inside the repository. `overlay-engine-fixtures.cjs:63` shows they do not. The execution is the strongest evidence in this run and it changes criterion 1 from a limit to a pass.

## Confirmed-Clean Surfaces

- Criterion 1: 262 tests pass with 0 failures across all six `overlay-engine-*.test.cjs` suites, including the sibling-folder cases `a sibling overlay folder applies every destination and status then passes in sync`, `status and status --json show a sibling overlay folder by its ../overlays label`, and `capture writes a live edit back into the sibling overlay folder`.
- Criterion 2: `SKILL.md:5` prints `version: 1.2.0.0` and the changelog names `/doctor:overlay apply --relayout` three times.
- Criterion 3: the vendored copy's `.skilled-overlays.json` prints `{ "overlayDir": "../overlays" }` and no `barter-overlays` folder exists beside it.
- Criterion 4: `status --json` reports `PASSED` with `offLayout: []` and `check.miss 0` over 136 checked entries.
- Criterion 5: the guard exits 1 and names a source under `../overlays/framework/`.
- The three reviewed trees are byte-clean after the test run: `git status --porcelain` over `.skilled/commands/doctor`, `.skilled/skills/system-skilled-doctor` and `barter/ai-speckit` prints nothing.

## Ruled Out

- **The engine suites write inside the repository.** Ruled out: `overlay-engine-fixtures.cjs:63` uses `os.tmpdir()`, and the post-run `git status --porcelain` over the three reviewed trees is empty.
- **Criterion 4 regressed since iteration 8.** Ruled out by re-execution: `status --json` still reports `PASSED` with an empty `offLayout`.
- **Criterion 5's refusal names the wrong source root.** Ruled out: the refusal names `../overlays/framework/skills/sk-git/sk-git-skilled/SKILL.md`, which is the `framework/` root D1 froze.
- **The phase-003 criterion now reproduces.** Ruled out by re-running its own command verbatim: it still prints `.skilled/commands/doctor/assets/doctor-env.yaml:48`.
- **The packet's criteria are ticked and therefore claim completion.** Ruled out: all six read `- [ ]`.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis
- Reason: all four canonical dimensions have an iteration behind them, the frontier nodes F-1-002, F-1-004 and F-1-006 are each covered, and the one core protocol the stop still owed has now been executed as far as this lineage's authority allows
- Rotation status: `checklist_evidence` moves from `partial` on an unexecuted set to `partial` on one unexecuted command plus one unreproducible tick; the other three core protocols stay `pass`
- Blocked/productive carry-forward: blocked -- the coverage gate fails on `traceability-incomplete` and neither cause is fixable inside the lineage's write surface
- Required evidence: the synthesis must state the coverage gate failure, name both causes, and carry criterion 6 as a limit rather than a pass
- Recovery note: the stop reason is `blockedStop`, not `converged`. The one-line fix that would let a re-run converge is amending `003-engine-docs-and-release/goal.md:62` to exclude `assets/` or to anchor the `opt-in` pattern to the layout rule.

Review verdict: PASS
