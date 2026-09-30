# 023 session evidence: verification, review, fixes and commit

The orchestrator session's record for phase 023. The session reran the proof plan from the final state itself; where this file and `../w4-build/build-evidence.md` disagree, this file wins.

## 1. Build

A build orchestrator leaf (Opus 5.5 xhigh, under parent D5 as it stood before the 2026-09-29 amendment) ran dispatches 01 to 18 and 11b, Devin `deepseek-v4-1-flash-max` for code and Pi `llmgateway/mimo-v2.6-pro` at `high` for docs, all exit 0. The operator then said "Dont use opus" and chose "Stop them now" and "No Claude leaves", so the session stopped the leaf with its executors idle and ran the three remaining doc briefs itself through Pi: `18b-doc.md` (restores a sentence brief 18 dropped from the catalog index), `19-doc.md` (the playbook scenario, `cmp` equal to its draft) and `20-doc.md` (the playbook index, `cmp` equal to its draft). Each printed `STATUS: DONE` with its checks passing. The leaf's own record in `../w4-build/build-evidence.md` covers sections 1 and 2 (baseline and proof plan).

## 2. Session verification from the final state

- The builder's `../w4-build/final/proof.sh <scratchpad dir>` with logging stubs first on `PATH`: `p1 rc=0`, `p2 rc=0`, `p3 rc=0`, `p6-grep rc=1`, `p1 stub log lines: 0`, both switch runs' stdout prefixes byte-identical to the census, `p2 tail: deem arm skipped: stub backend`, `p3 tail: jev: path=<stub>/jev provider=official|jev arm skipped: no credential`, `porcelain identical: yes` (sk-communication paths also compared on their own: equal).
- The census ends `labeled: 0`, `baseline agreement: n/a`, `margin: 0.10`, the keep-rule line, the power line and `stop: fewer than 20 labeled replies`.
- `node --test .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs`: `tests 43`, `pass 43`, `fail 0`, exit 0 (baseline: the harness shipped no test file).
- `validate_document.py` exit 0 on all 8 changed docs (the catalog index with `--type feature_catalog`, the playbook index with `--type playbook`).
- Comment hygiene checker exit 0 on `judge-agreement.mjs` and `judge-agreement.test.mjs`.

## 3. Cross-family review

Read-only, split by author family, briefs `review-pi.md` and `review-devin.md` (each carries the diff), logs in `logs/`. SHA-1 over the 10 reviewed files `82857a393c75b5e3c26bddde37b55215341bf249` before and after both runs.

- Pi MiMo on the code Devin wrote (819 s): `VERDICT: PASS`, 4 P2.
- Devin DeepSeek on the docs Pi wrote (521 s): `VERDICT: FAIL`, 2 P1 and 3 P2.

P1 findings and how each closed:
1. `sk-communication/leaf-manifest.json` did not list the two new leaf docs, so `ci-leaf-manifest-freshness.cjs` printed `checked=15 fresh=14 failed=1` and `ci-skill-root-metadata.cjs` failed sk-communication. Closed by the skill's own generator, run by the session: `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix --skill sk-communication` (`wrote leaf-manifest.json, leaf-aliases.json`). After it: `checked=15 fresh=15 failed=0` and `checked=15 passed=15 failed=0`.
2. REQ-014: the playbook scenario and its `### COMM-011` index section never named `--jev`. Closed by Pi fix brief `fix/f1.md` (128 s, `STATUS: DONE`): one appended sentence in each file naming `--jev` and its gate. Both files validate (exit 0) and each `grep -c -- --jev` prints 1.

Recheck: Devin, read-only, `fix/recheck.md` (101 s): Finding 1 closed, Finding 2 closed, `VERDICT: PASS`. SHA-1 over the reviewed files plus the two leaf files `d6d5f8f7229af334122b5d7b3777f63565d98f61` before and after.

P2 findings, recorded, not chased (parent D5):
1. Pi: the `jev --version` gate compares only the first line, so `jev 0.6.2` followed by more output passes.
2. Pi: no test covers the requalify branches (`requalify: model commit changed`).
3. Pi: no test covers the exit-4 retry and the mid-run commit-change stop.
4. Pi: the `jev auth test` record in `calls.jsonl` says `status: "measured"` though it holds no judgment.
5. Devin: the changelog's keep-rule summary drops the exact kill test and the Jev flip bound.
6. Devin: no test exercises the exit-table stops (2, 3, 4, 130, timeout) or the requalify lines.
7. Devin: the trigger index is stale for the new docs until the session rebuilds it after the commit.

## 4. Generated files

- `sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` rewritten by `test_readme_verdict_parity.py --write`: the harness README moves from fail (missing overview) to pass, and the whole-file generator also took in 5 tracked READMEs committed earlier under `009-cli-jev-hub-move/scratch/w3-build/attach/` (1,100 to 1,105 files). After it `PARITY PASS: verdict diff is empty`.
- `sync-skills-hermes.cjs --check` lists no drift for sk-communication (its copy was regenerated with the 020 commit's sync run and left unstaged until this commit).

## 5. Open for the operator

- 20 operator labels on the masked replies, then a live Deem run, and a Jev run on the operator's yes.
- The P2 findings above.

## 6. Scratch kept out of the commit, and closure

- `../w4-build/baseline/gates/drift-guards.txt` (5.0 MB, the whole-repo drift guard dump, 16,978 findings) was moved to the session scratchpad instead of committed. Its summary line stays in `../w4-build/build-evidence.md` section 2.
- Closure: Pi MiMo, 1,184 s, exit 0. The session reran `validate.sh --strict` (`RESULT: PASSED`, Errors 0, 1 warning: `SPECDOC_FRONTMATTER_004`, the `next_safe_action` fields of `implementation-summary.md` and `goal.md` read long), `check-goal.cjs` (`RESULT: PASSED (5/5 checks)`) and `goal.cjs packet` (`packet_durable_chars=3451`).
