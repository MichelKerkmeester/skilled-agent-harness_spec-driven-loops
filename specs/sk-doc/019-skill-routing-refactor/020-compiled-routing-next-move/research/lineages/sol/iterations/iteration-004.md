# Iteration 4: Staging And Rollback Retention

## Focus
This iteration investigated Q4 only: whether staging and rollback should remain for a single-operator, git-backed compiled-routing build tool after the former live-runtime `rmSync` hazard. I interpreted the question as a decision about publication mechanics, not source-control policy: staging, atomic rename, retained rollback, terminal receipt cleanup, and git recovery are separate mechanisms with different failure coverage.

## Findings
1. The strongest remove/simplify case is real: the current implementation is large and carries test-only failure injection, nested rename recovery, terminal state, publication locks, and explicit finalize/revert modes for a single local build tool. The live tool has named failure injection at `verifyPhase` and `renamePhase`, the build path allocates staging and rollback siblings, and the CLI exposes both `--finalize` and `--revert`; the test file then exercises staging aborts, post-publish restores, cleanup resumes, terminal lock failures, and nested rename failures. [SOURCE: .opencode/bin/compiled-route-sync.cjs:705] [SOURCE: .opencode/bin/compiled-route-sync.cjs:716] [SOURCE: .opencode/bin/compiled-route-sync.cjs:746] [SOURCE: .opencode/bin/compiled-route-sync.cjs:747] [SOURCE: .opencode/bin/compiled-route-sync.cjs:1004] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:711] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:755] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:863]
2. The strongest retain-staging case is stronger than the simplify case because staging is the mechanism that removes the live-runtime deletion window. The old hazard is evidenced by the recent commit diff deleting the former `fs.rmSync(RUNTIME_ROOT, { recursive: true, force: true })` followed by direct copies into `RUNTIME_ROOT`; the current code instead copies every traced closure file into `stagingRoot`, writes the manifest there, verifies the staging root, and only then renames the prior serving root aside and renames staging into place. [SOURCE: command: `git show 19b87f67a1 -- .opencode/bin/compiled-route-sync.cjs | rg -n -C 10 "rmSync\\(RUNTIME_ROOT"`] [SOURCE: .opencode/bin/compiled-route-sync.cjs:767] [SOURCE: .opencode/bin/compiled-route-sync.cjs:769] [SOURCE: .opencode/bin/compiled-route-sync.cjs:798] [SOURCE: .opencode/bin/compiled-route-sync.cjs:814] [SOURCE: .opencode/bin/compiled-route-sync.cjs:817] [SOURCE: .opencode/bin/compiled-route-sync.cjs:821]
3. Atomic rename is distinct from staging and should remain with it. Staging builds and verifies an isolated candidate; the rename operations are what make the publication boundary narrow. The code moves the old runtime root to a rollback sibling with `fs.renameSync`, installs staging with `renamePhase`, restores the rollback if staging-install fails, and even falls back to installing the verified staging root while retaining recoverable state when rollback restoration fails. Tests assert that staging-verify failure leaves the old sentinel untouched and no rollback sibling exists, while staging-install rename failures still retain a serving root and recoverable rollback/staging state. [SOURCE: .opencode/bin/compiled-route-sync.cjs:817] [SOURCE: .opencode/bin/compiled-route-sync.cjs:821] [SOURCE: .opencode/bin/compiled-route-sync.cjs:827] [SOURCE: .opencode/bin/compiled-route-sync.cjs:837] [SOURCE: .opencode/bin/compiled-route-sync.cjs:846] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:521] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:532] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:908] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:917]
4. Retained rollback is not just "git revert in another form"; it preserves the exact prior runtime closure for post-publish gates after a successful local promotion. The build writes publication state into the candidate with prior/current closure fingerprints, validates later finalize/revert calls against the active publication state, lock, runtime path, rollback basename, and closure fingerprints, then prints explicit operator instructions to run gates and either finalize or revert. Tests prove a second build retains the first real closure, `revert()` swaps it back into the serving root, and closure-byte drift in the rollback is rejected before revert. [SOURCE: .opencode/bin/compiled-route-sync.cjs:803] [SOURCE: .opencode/bin/compiled-route-sync.cjs:809] [SOURCE: .opencode/bin/compiled-route-sync.cjs:810] [SOURCE: .opencode/bin/compiled-route-sync.cjs:566] [SOURCE: .opencode/bin/compiled-route-sync.cjs:577] [SOURCE: .opencode/bin/compiled-route-sync.cjs:580] [SOURCE: .opencode/bin/compiled-route-sync.cjs:891] [SOURCE: .opencode/bin/compiled-route-sync.cjs:901] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:595] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:613] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:736]
5. Terminal receipt cleanup is justified separately from rollback retention because it prevents cleanup failure from wedging future finalize/revert or corrupting a newer publication state. `resumeFinalizeCleanup` and `resumeRevertCleanup` accept terminal phases, validate closure fingerprints before removal, release the publication lock, and only then remove the publication state. Tests inject rollback-removal, failed-root-removal, and lock-removal failures, then assert resume works; a nested publication test asserts a newer publication state survives terminal cleanup rather than being deleted by the older cleanup pass. [SOURCE: .opencode/bin/compiled-route-sync.cjs:612] [SOURCE: .opencode/bin/compiled-route-sync.cjs:619] [SOURCE: .opencode/bin/compiled-route-sync.cjs:627] [SOURCE: .opencode/bin/compiled-route-sync.cjs:629] [SOURCE: .opencode/bin/compiled-route-sync.cjs:633] [SOURCE: .opencode/bin/compiled-route-sync.cjs:637] [SOURCE: .opencode/bin/compiled-route-sync.cjs:653] [SOURCE: .opencode/bin/compiled-route-sync.cjs:656] [SOURCE: .opencode/bin/compiled-route-sync.cjs:659] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:755] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:779] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:811] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:847]
6. Git recovery is necessary but insufficient for this publication path. Git tracks the sync tool and promoted runtime files, so committed bad artifacts can be reverted, but git does not provide an atomic live-root swap, does not preserve uncommitted external activation manifests during a local promotion, and does not bind a user-supplied rollback directory to the exact closure that was displaced. The current finalize path explicitly carries external manifests forward and tests simulate a concurrent external manifest surviving finalize; that is an operational runtime-state concern rather than a source-history concern. [SOURCE: command: `git ls-files .opencode/bin/compiled-route-sync.cjs .opencode/bin/lib/compiled-routing`] [SOURCE: .opencode/bin/compiled-route-sync.cjs:765] [SOURCE: .opencode/bin/compiled-route-sync.cjs:785] [SOURCE: .opencode/bin/compiled-route-sync.cjs:928] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:564] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:583] [INFERENCE: git can revert tracked committed files, but cannot by itself make a multi-directory local publication atomic or recover uncommitted runtime-only state]

## Ruled Out
- Removing staging and copying directly into the serving root: ruled out because the old `rmSync(RUNTIME_ROOT)`-then-copy pattern is the exact live-runtime deletion hazard Q4 asks to consider. [SOURCE: command: `git show 19b87f67a1 -- .opencode/bin/compiled-route-sync.cjs | rg -n -C 10 "rmSync\\(RUNTIME_ROOT"`]
- Treating git as the rollback mechanism for post-publish gates: ruled out because current rollback binding uses runtime fingerprints and active publication state, while git has no knowledge of a local publication's displaced sibling or runtime-only external activation manifests. [SOURCE: .opencode/bin/compiled-route-sync.cjs:566] [SOURCE: .opencode/bin/compiled-route-sync.cjs:580] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:564]
- Keeping every nested rename recovery branch at current size without pruning: not ruled out as unsafe, but not recommended as the minimum next move. The tests demonstrate behavior, yet the prompt baseline says roughly 100 lines of test-injection-only nested rename recovery remain oversized. [SOURCE: .opencode/bin/compiled-route-sync.cjs:705] [SOURCE: .opencode/bin/tests/compiled-route-manifest.test.cjs:863] [INFERENCE: based on current failure-injection-only entry points plus the supplied verified baseline]

## Dead Ends
No dead-end research path needs reducer promotion. The productive path was line-reading the publication algorithm, current tests, git tracking, and the recent commit evidence for the former live-root deletion hazard.

## Edge Cases
- Ambiguous input: "rollback" could mean git revert, retained runtime sibling, or failed-publish automatic restore. I separated them and recommend keeping only the operational runtime rollback that covers post-publish gates.
- Contradictory evidence: None for current code behavior. The former live-runtime `rmSync` hazard is not present in the current file; it is supported by the recent commit message/diff and the operator-supplied verified state, but not by a current file line.
- Missing dependencies: No required Q4 source was missing. A full historical test run for the exact pre-staging implementation was not available; claims about the old hazard are therefore marked as historical evidence or supplied baseline, not re-executed proof.
- Partial success: Current tests were read but not executed. This iteration is research-only, and current `--check`/lifecycle failures from Q2 would make a broad execution misleading before the closure-resolution work is fixed.

## Sources Consulted
- .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/deep-research-config.json
- .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/deep-research-state.jsonl
- .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/deep-research-strategy.md
- .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/findings-registry.json
- .opencode/specs/sk-doc/019-skill-routing-refactor/020-compiled-routing-next-move/research/lineages/sol/prompts/iteration-004.md
- .opencode/bin/compiled-route-sync.cjs:233
- .opencode/bin/compiled-route-sync.cjs:566
- .opencode/bin/compiled-route-sync.cjs:612
- .opencode/bin/compiled-route-sync.cjs:637
- .opencode/bin/compiled-route-sync.cjs:705
- .opencode/bin/compiled-route-sync.cjs:746
- .opencode/bin/compiled-route-sync.cjs:803
- .opencode/bin/compiled-route-sync.cjs:817
- .opencode/bin/compiled-route-sync.cjs:821
- .opencode/bin/compiled-route-sync.cjs:891
- .opencode/bin/compiled-route-sync.cjs:924
- .opencode/bin/compiled-route-sync.cjs:938
- .opencode/bin/compiled-route-sync.cjs:1004
- .opencode/bin/tests/compiled-route-manifest.test.cjs:125
- .opencode/bin/tests/compiled-route-manifest.test.cjs:447
- .opencode/bin/tests/compiled-route-manifest.test.cjs:521
- .opencode/bin/tests/compiled-route-manifest.test.cjs:541
- .opencode/bin/tests/compiled-route-manifest.test.cjs:564
- .opencode/bin/tests/compiled-route-manifest.test.cjs:595
- .opencode/bin/tests/compiled-route-manifest.test.cjs:711
- .opencode/bin/tests/compiled-route-manifest.test.cjs:736
- .opencode/bin/tests/compiled-route-manifest.test.cjs:755
- .opencode/bin/tests/compiled-route-manifest.test.cjs:811
- .opencode/bin/tests/compiled-route-manifest.test.cjs:863
- command: `git show --name-status --find-renames 19b87f67a1 -- .opencode/bin/compiled-route-sync.cjs .opencode/bin/tests/compiled-route-manifest.test.cjs`
- command: `git show 19b87f67a1 -- .opencode/bin/compiled-route-sync.cjs | rg -n -C 10 "rmSync\\(RUNTIME_ROOT"`
- command: `git ls-files .opencode/bin/compiled-route-sync.cjs .opencode/bin/lib/compiled-routing`

## Assessment
- New information ratio: 1.00
- Questions addressed: Q4 staging and rollback retention
- Questions answered: Q4. Keep staging plus atomic rename and keep retained rollback with terminal receipt cleanup, but prune the oversized nested failure-injection surface after Q5 sequencing. Git recovery remains the source-history backstop, not the live publication safety mechanism.

## Reflection
- What worked and why: Separating staging, rename, rollback, cleanup, and git avoided the false binary of "keep all complexity" versus "trust git." Each mechanism covers a different failure window.
- What did not work and why: Broad repository grep was too noisy because many archived specs and unrelated rollback systems use the same terms; narrowing to `compiled-route-sync.cjs`, its tests, and git history produced usable evidence.
- What I would do differently: If implementation were in scope, I would first preserve the staging/rename/rollback contract tests, then simplify the nested rename recovery API around externally observable failure modes rather than deleting safety wholesale.

## Recommended Next Focus
Q5 should sequence the minimum work as: keep publication safety in place, first fix reproducibility and guard self-reporting so the system can run unattended, then prune test-injection-only nested rename recovery once the closure-resolution and `sk-design` restructure state stop forcing lifecycle tests to fail before their bodies.
