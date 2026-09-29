# Build evidence: 035-fetched-text-injection-screen

Build orchestrator leaf (Opus 5.5 xhigh), 2026-09-29, worktree `069-cli-jev-workflow-integration`, HEAD `bf830c3d47` at the start. Nothing here is committed. `W` = `specs/cli-jev/003-cli-jev-workflow-integration/035-fetched-text-injection-screen/scratch/w4-build`. `S` = `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs`, `T` = its test file under `tests/`. The build contract every code brief cites is `W/briefs/ref/design.md`, with the stub binaries in `W/briefs/ref/stubs.md`.

## 1. Baseline (captured before the first dispatch)

Raw output in `W/baseline/`.

| Gate | Command | Result | Exit |
|---|---|---|---|
| cli-deem suite | `node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs` | tests 34, pass 34, fail 0 | 0 |
| Hub contract | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` | `OK: parent-skill-check — all hard invariants passed, 0 warnings` | 0 |
| Hub docs | `validate_document.py` on `SKILL.md`, `README.md`, `benchmark/README.md`, `changelog/v1.1.0.0.md`, and the playbook root with `--type playbook` | `Total issues: 0` on each | 0 each |
| Hermes copies | `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` | `PASS: 72 Hermes skill copies in sync` | 0 |
| README manifest | `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py` | `SUMMARY: discovery=pass exclusions=21/21 manifest=reproducible` | 0 |
| README verdicts | `python3 .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py` | `PARITY PASS: verdict diff is empty` | 0 |
| Route guard | `node .skilled/bin/compiled-route-guard.cjs` | `All hubs fresh or excused` | 0 |
| Catalog packages | `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` | `FAIL: 743 violation(s) (42 fail, 701 warn)`; no `cli-classifier` root package; `cli-classifier/cli-deem` and `cli-classifier/cli-usage` PASS | 1 |
| Hub playbook package | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package cli-classifier` | `FAIL package=cli-classifier ... scenarios=5 categories=1 ... violations=2`, both `BAKED_RUN_TRANSCRIPT` in `hub-routing/` | 1 |
| Advisor graph | `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only` | `VALIDATION PASSED` | 0 |
| Trigger index | `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` | 0 stale, 0 obsolete, 0 untrusted | 0 |

Corpus and census probes (read-only scratch scripts, not build targets), at `bf830c3d47`:

- Fetch census: 486 tracked `deep-research-state.jsonl`, 6,661 parsed records, 835 with `toolsUsed`, 82 naming `WebFetch`, 61 naming `WebSearch`, 31 files with either, 5 unparsed lines. Matches the spec's 82, 61 and 31 of 486.
- Corpus: 185 tracked `.md` files after the notes file, 2 refused `.env.example` paths. In-band sections (5 to 60 lines) per source group: `supercov-main` 837, `jev-cli-main` 139, `claude-jev-main` 28, `pi-jev-context-main` 8, `jev-review-main` 5, `social posts` 5, `external websites` 0. Lexical hits in band: 0.

## 2. Dispatch log

Every brief is `W/briefs/<NN>-<name>.md`, assembled by `W/briefs/assemble.sh` from the verbatim shared blocks (`_preamble.txt`, `_persona-*.txt`, `_post.txt`) and a body in `W/briefs/bodies/`. Logs are `W/logs/<NN>.{status,last.txt,log}`. After each dispatch the orchestrator read the HANDBACK, compared `git status --porcelain` against the brief's allowed paths (only `.skilled/skills/cli-classifier/...` paths are judged; other orchestrators' paths are ignored) and reran the brief's checks plus `node --test` on T.

| Brief | Executor | Seconds | Result | Orchestrator check |
|---|---|---|---|---|
| 01 skeleton | devin | 374 | S and T created | `node --check` both exit 0; `node --test` T 1/1 pass. Found `KEEP_RULE_LINE` missing the design's trailing ` (jev only)` |
| 01b keep rule fix | devin | 13 | S:59 one line replaced | `grep` 1, `node --check` exit 0 |
| 02 fetch census | devin | 212 | S +69, T +30 | `node --test` T 2/3: the counts test saw 0 state files |
| 02b excludes fix | devin | 22 | T +2 | Cause confirmed by the orchestrator: `git config --global core.excludesFile` is `~/.gitignore_global`, whose line 11 is `/specs`, so `git add -A` in a fixture repo skipped every `specs/...` file. Fix: `-c core.excludesFile=/dev/null -c core.attributesFile=/dev/null` in `makeRepo`. `node --test` T 3/3 pass |
| 03 corpus split | devin | 154 | S +117, T +39 | `node --test` T 9/9 pass |
| 04 corpus census, attempt 1 | devin | 62 | nothing written, empty stdout and stderr, exit 0 | Launched with a shell `&` inside a foreground tool call. INFERRED cause: the child lost its session when that shell exited (not confirmed; every other dispatch ran through the tool's background mode and wrote output). Logs kept as `W/logs/04-attempt1.*`. Re-dispatched unchanged through the tool's background mode |
| 04 corpus census, attempt 2 | devin | 148 | S +83, T +48 | `node --test` T 11/11 pass |
| 05 draw | devin | 280 | S +125, T +26 | `node --test` T 12/12 pass. Found `holdsOperatorContent` would throw on the null `readJsonl` returns for a missing file |
| 05b null-safe fix | devin | 38 | S 2 code and 2 JSDoc lines, T +1 | `node --test` T 12/12 pass |
| 06 main draw | devin | 187 | S +87/-10, T +61 | `node --test` T 15/15 pass |
| 07 gate and baseline | devin | 365 | S +134, T +65 | `node --test` T 19/19 pass. The executor read `plantedCaught` as planted rows the lexical screen catches, the design's intent |
| 08 main default | devin | 243 | S +33, T +113 | `node --test` T 21/21 pass; `node --check` S exit 0 |
| 09 verdict | devin | 209 | S +136, T +40 | `node --test` T 26/26 pass; `signTestP` and `nearestRank` byte-identical to N with JSDoc (awk extract plus `cmp`) |
| 10 calls and deem gate | devin | 164 | S +225, T +24 | `node --test` T 28/28 pass; the seven copied functions byte-identical to N with JSDoc; every upper-case constant they use is defined in S; key grep 0 |
| 11 deem arm | devin | 155 | S +141, T +82 | `node --test` T 32/32 pass; exit handling read side by side with N's `runDeemArm` and matches it |
| 12 jev gate | devin | 251 | S +49, T +21 | `node --test` T 34/34 pass; `jevGate` byte-identical to N with JSDoc |
| 13 jev arm | devin | 130 | S +177, T +39 | `node --test` T 36/36 pass; auth test, backoff retry and stop lines read side by side with N's `runJevArm` |
