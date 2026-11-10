# Verification: Phase 2 tooling-fixes

Independent read-only check of `acceptance-criteria.md` AC-001 to AC-007 plus four
scope/evidence checks. Every command below was rerun from the repository root on
2026-11-03 with Node v26.8.2. Nothing in the tree was edited to produce a verdict;
no generator was run with `--write` and `compiled-route-sync.cjs` was not run at all.

| Row | Verdict | Command | Deciding output |
|-----|---------|---------|-----------------|
| AC-001 | MET | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-router-intent-signals-orphans.test.cjs` | `✔ --check reports a generated phrase no router declares as an orphan (105.874625ms)` — the passing assertion set is exit `1`, a `       - old generated phrase` line, `orphans=  1`, `RESULT: FAILED`, and JSON `orphans: ["old generated phrase"]`, `removed: 1`, `added: 0` |
| AC-002 | MET | same file as AC-001 | `✔ --write removes the orphan from both lists and keeps the surviving order` — asserts the written file equals `intent_signals: ["zeta stays","alpha stays"]` and `intent_signals_generated: ["zeta stays","alpha stays"]` from input `["zeta stays","renamed away","alpha stays"]` |
| AC-003 | MET | same file as AC-001 | `✔ a keep-listed generated phrase is neither reported nor removed` — `--check` exits `0`, stdout does not contain `kept generated phrase`, `orphans=  0`, `RESULT: PASSED`; `--write` leaves both arrays at `["kept generated phrase"]` |
| AC-004 | MET | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-router-vocabulary-reach-default.test.cjs` | `✔ router reach defaults to concurrency 2 (0.399208ms)`; the no-flag path is `const concurrency = args.includes('--concurrency') ? ... : DEFAULT_CONCURRENCY;` (`ci-router-vocabulary-reach.cjs:254-256`) with `const DEFAULT_CONCURRENCY = 2;` (`:38`) |
| AC-005 | MET | `sed -n '13,16p' specs/sk-code/018-frontend-upstream-proposals/002-tooling-fixes/scratch/reach-concurrency.txt` | `cold concurrency=8 n=48 wall=2.8s {"live":48}` / `cold concurrency=2 n=48 wall=3.4s {"live":48}` / `... 2.9s` / `... 3.3s`; lines 1-12 hold the alternating 8-vs-2 warm and three-sweep runs |
| AC-006 | MET | `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check` and `diff <(…| grep -E '^(OK\|STALE\|WROTE)') <(sed -n '3,9p' …/scratch/orphans.txt)` | Live run: `checked=7 hub(s), missing=0, orphans=0`, `RESULT: PASSED`, `EXIT=0`; the saved hub rows are byte-identical to the live rows (`DIFF_EXIT=0`), e.g. `OK    sk-code                      declared= 97 signals=135 missing=  0 orphans=  0` |
| AC-007 | MET | `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/` | `ℹ tests 97` / `ℹ pass 97` / `ℹ fail 0` / `ℹ skipped 0`, `AC007_EXIT=0` (run twice, exit 0 both times) |
| EXTRA-1 (diff scope) | MET | `git diff --name-only -- .skilled/skills/sk-doc/sk-create-skill/scripts/` and `git ls-files --others --exclude-standard -- .skilled/skills/sk-doc/sk-create-skill/scripts/` | Tracked: `ci-router-vocabulary-reach.cjs`, `ci-skill-root-metadata.cjs`, `generate-router-intent-signals.cjs`, `tests/skill-root-metadata-contract.test.cjs`. Untracked: `tests/ci-router-vocabulary-reach-default.test.cjs`, `tests/generate-router-intent-signals-orphans.test.cjs`. That is the generator, the reach tool, the metadata gate and exactly three test files — nothing else |
| EXTRA-2 (live metadata) | MET | `git status --short -- .skilled/skills` | Output lists only the contract doc, the three scripts and the three test files. No `.skilled/skills/**/graph-metadata.json` appears, so no live hub metadata differs from HEAD |
| EXTRA-3 (revert evidence) | UNVERIFIABLE | `read specs/…/002-tooling-fixes/scratch/revert-test.txt` (redo forbidden: no script edits) | `✖ router reach defaults to concurrency 2 (0.622375ms)`, `ℹ tests 7`, `ℹ pass 4`, `ℹ fail 3` in the "reverted orphan logic and default 8" section; restored section `ℹ tests 7 / pass 7 / fail 0`. Only the reach-default failure is named; no orphan test is named, and no command line or exit status is recorded. Two orphan failures are implied by arithmetic (7 tests = 1 reach + 6 orphan), not shown. See item 3 below |
| EXTRA-4 (ADR vs code) | MET | `read` of `decision-record.md` against the three script diffs | ADR-001: provenance on `--write` (`:102-109`), orphan = generated minus declared minus keep, lower-cased (`:80-90`), `--check` prints, counts and exits 1 (`:170-184`), prune from both arrays preserving order (`:98-106`). ADR-002: `DEFAULT_CONCURRENCY = 2` (`:38`), exported (`:362`), test pins it; `--concurrency` override still present (`:254-256`); exit-75 retry still present (`:145`). Two internal wording errors are listed below |

## Anything that looked wrong

1. **The acceptance criteria document is stale.** Every row still says `Unmet`, the
   closure statement still says `Closeable: No` and "Nothing is built yet". The work
   is built and green; the packet record currently contradicts the verified state and
   will fail the completion gate until the Status column and the closure statement
   are rewritten.

2. **ADR-002 contradicts itself on what was measured.** Five Checks row 2 says
   "Both proposed fixes were measured", but the same record's alternatives table says
   the concurrency-1 retry path is "A second code path that the measured run never
   exercised", and `scratch/reach-concurrency.txt` contains no retry comparison at
   all. Only the default (8 vs 2) was measured.

3. **`scratch/revert-test.txt` does not show what it claims to show.** It reports
   `ℹ fail 3` but its "failing tests" section names exactly one: the reach-default
   test. No orphan test is named, so the orphan-failure claim rests on subtracting
   1 reach test from 7 total tests and inferring two orphan failures. The file also
   records no command and no exit status. It is consistent with the claim, not proof
   of it. I could not redo the experiment because editing a script to break it is
   banned for this role.

4. **ADR-001's "151 signals across seven hubs" does not reproduce.** Using the same
   `declaredPhrases` extraction and lower-cased comparison the generator uses, I count
   **144** undeclared multi-word signals (or **184** if single-word `intent_signals`
   entries are included) across the same seven hubs. Per hub: cli-classifier 4 vs 3/4,
   cli-external-orchestration 2/7, mcp-tooling 3/15, sk-code 34 recorded vs 29/38,
   sk-design 95 vs 94/99, sk-doc 11/16, system-deep-loop 2/5 (recorded / my multi-word
   / my all-signals). The mismatch is small but the recorded vector matches no
   definition I could derive from the code, and the same 151 is repeated in the Q001
   row and its appendix. If that count is load-bearing for the Q001 rationale, the
   method that produced it should be written down; the per-hub "undeclared" table in
   `scratch/orphans.txt` is stale in the same way.

5. **`scratch/callers.txt` line 5 is stale evidence.** It quotes
   `const DEFAULT_CONCURRENCY = 8;` from `ci-router-vocabulary-reach.cjs`, which this
   phase changed to 2. The inventory was captured at 12:41, the edit landed at 12:50.

6. **None of the AC-005/AC-006 evidence is committed.** `decision-record.md`,
   `scratch/orphans.txt`, `scratch/reach-concurrency.txt` and `scratch/revert-test.txt`
   are all untracked; `scratch/.gitignore` ignores only `dispatch-*`. The report
   "saved for the hub owners" exists only in this worktree.

7. **AC-004's evidence is a constant, not an observed run.** The test pins
   `DEFAULT_CONCURRENCY`, and the no-flag behaviour is established by reading
   `:254-256`. That is adequate for the criterion as written, but the test would still
   pass if the call site stopped using the constant, so it is a weaker guard than the
   other two suites.

## Checked and clean

- `--check` on the live tree wrote nothing: `git status --short -- .skilled/skills` is
  unchanged after the run.
- The metadata gate still passes the fleet with the two new keys admitted:
  `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` →
  `checked=13 passed=13 failed=0 fixed=0`, exit 0.
- `.opencode/skills` is a symlink to `.skilled/skills`, so the CI caller in
  `routing-registry-drift.yml` runs the edited generator, not a copy.
- `require.main === module` in the reach tool means the new `module.exports` cannot
  change CLI behaviour; the only requirer in the tree is the new default test.
