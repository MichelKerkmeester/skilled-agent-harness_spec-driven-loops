# Build evidence: 022-alignment-folder-suggestion

Build orchestrator leaf, 2026-09-29, worktree `069-cli-jev-workflow-integration`, HEAD `bf830c3d47` at the start. Nothing here is committed. `W` = `specs/cli-jev/003-cli-jev-workflow-integration/022-alignment-folder-suggestion/scratch/w4-build`, `S` = `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts`, `T` = `.skilled/skills/system-spec-kit/runtime/cli/tests/score-alignment-suggestion.vitest.ts`. The build contract every code brief points at is `W/briefs/ref/design.md`.

## 1. Baseline (captured before the first dispatch)

`git status --porcelain` at the start (`W/baseline/status-start.txt`) held only four untracked `scratch/w4-build/` folders of the parallel build lanes (019, 020, 022, 024).

| Gate | Command | Result | Exit |
|---|---|---|---|
| cli project suite | from `runtime/cli`: `npx vitest run --config ../../vitest.config.ts --project cli` (`W/baseline/cli-vitest.txt`) | `Test Files 157 passed \| 3 skipped (160)`, `Tests 1602 passed \| 19 skipped (1621)`, 485 s | 0 |
| cli typecheck | from `runtime/cli`: `npm run typecheck` (`tsc --noEmit --composite false -p tsconfig.json`, which includes `evals/**/*.ts`) | no diagnostics | 0 |
| Import policy (AST) | `npx tsx evals/check-no-mcp-lib-imports-ast.ts` | `AST import policy check passed` | 0 |
| Import policy (text) | `npx tsx evals/check-no-mcp-lib-imports.ts` | `Import policy check passed` | 0 |
| Architecture boundaries | `npx tsx evals/check-architecture-boundaries.ts` | `Architecture boundary check passed` | 0 |
| Code route | `verify_alignment_drift.py --root .skilled/skills/system-spec-kit/runtime/cli/evals` | `PASS`, `Scanned files: 8`, `Findings: 0` | 0 |
| validate_document, 6 docs to change | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <doc>` on `SKILL.md`, `README.md`, `runtime/cli/evals/README.md`, `runtime/cli/tests/README.md`, `feature-catalog/feature-catalog.md`, `manual-testing-playbook/manual-testing-playbook.md` | all `VALID`; the two index files carry the `document_type_fallback` warning | 0 each |
| Playbook package | `validate-playbook-package.cjs --package system-spec-kit` | `PASS ... scenarios=86 categories=10 operator=72 ... violations=0 warnings=1` | 0 |
| Catalog package | `validate_catalog_package.py --package system-spec-kit` | `WARN tier=warn violations=85` | 0 |
| Skill root metadata | `ci-skill-root-metadata.cjs` | `checked=15 passed=15 failed=0 fixed=0` | 0 |
| Hermes copies | `sync-skills-hermes.cjs --check` | `PASS: 72 Hermes skill copies in sync` | 0 |
| Trigger index | `generate-trigger-index.mjs --check` | `trigger index matches the corpus`, `stale documents: 0` | 0 |
| Phase strict validate | `validate.sh <phase> --strict` | `Errors: 0  Warnings: 0`, `RESULT: PASSED` | 0 |

Premise probe (orchestrator, scratch only, `W/runs/replay-probe.mts`): the validator run non-interactively with the save data `quantum lattice orchard telemetry` printed, against the real specs root, the CLI-path warning branch and a hard block with no `Better matching` list, and against a synthetic tree of `001-billing-export`, `002-quantum-lattice-orchard`, `003-quantum-telemetry` and `z_archive`, the data path listed `003-quantum-telemetry` and `002-quantum-lattice-orchard`. This fixed the expected replay values before any code was written.

## 2. Proof plan

Commands run from `.skilled/skills/system-spec-kit/runtime/cli` unless they start with a repository path. `STUB` is a scratch directory of logging `jev` and `cli-deem` stubs, and `O` a directory outside the repository.

| Row | Source | Command | Expected |
|---|---|---|---|
| G1 | goal criterion 1, spec proof 1, REQ-001, REQ-005 | `PATH="$STUB:$PATH" npx tsx evals/score-alignment-suggestion.ts --report $O/r` | exit 0; `committed path cli:` and `committed path data:` lines with `below50=`; `replay cli: validateContentAlignment ... alternatives listed: 0` and `replay data: validateFolderAlignment ... alternatives listed: 2`; `transcript events: not measured`; both stub logs absent or empty. Boundary: the archived fanout log's 0% events show as cli `low=2 ... without_alternatives=2 hard_blocks=2` |
| G2 | goal criterion 2, spec proof 2, REQ-002 | `--transcripts <synthetic dir> --rows-out $O/rows.jsonl`, then `--score $O/rows.jsonl`, then `--score <29-label file>`, then `--transcripts <dir> --rows-out ./rows.jsonl` | rows with every `label` empty; `stop: fewer than 30 labeled rows (0 labeled)` exit 0; `stop: fewer than 30 labeled rows (29 labeled)` exit 0; the last exits 2 with no stdout |
| G3 | goal criterion 3, spec proof 3 and 5, REQ-009 | `npx vitest run --config ../../vitest.config.ts --project cli tests/score-alignment-suggestion.vitest.ts` | exit 0, at least 18 passed, among them a `verdict deem: keep`, a `stop (margin)` and a `jev arm skipped: payload not accepted` case |
| G4 | goal criterion 4, spec proof 4, REQ-004 | `grep -nE 'API_KEY\|TYPESAFE\|Bearer\|Authorization' evals/score-alignment-suggestion.ts`; `git status --porcelain` before and after G1 and G2 | grep exit 1; the two status captures identical |
| G5 | goal criterion 5, REQ-010 | `validate_document.py` on `SKILL.md`, `README.md`, `changelog/v4.4.0.0.md` and both `tooling-and-scripts/alignment-suggestion-measurement.md` files | exit 0 each |
| G6 | goal criterion 6 | `validate.sh <phase> --strict` | `RESULT: PASSED` |
| Suites | step 4 | cli project suite, typecheck, the three import and boundary checks, code route, package validators | no failure beyond baseline |

## 3. Dispatches

One brief at a time through `W/briefs/run-brief.sh <executor> <NN> <brief>`, which saves `git status --porcelain` and copies of S and T before and after each dispatch into `W/logs/`. After each one I read `<NN>.last.txt`, diffed the two status captures (lines of other lanes left out), diffed S and T against the pre copies and ran the focused file from `runtime/cli`: `npx vitest run --config ../../vitest.config.ts --project cli tests/score-alignment-suggestion.vitest.ts` (output in `<NN>.vitest.txt`).

| NN | Brief | Executor, model | Seconds | Handback | Own-lane status diff | Focused file |
|---|---|---|---|---|---|---|
| 01 | c01 line scan (S sections 1 to 3, T 4 cases) | devin, deepseek-v4-1-flash-max | 219 | none: 31 lines of exploration notes, no HANDBACK, no file written | none | n/a |
| 01b | c01 re-dispatch, told to open only R and V | devin, same | 239 | DONE | S and T added | `Tests 4 passed (4)`, exit 0 |
| 01c | c01c header rules found anywhere on a line, +1 case | devin, same | 138 | DONE | S +2/-2, T +14 | `Tests 5 passed (5)`, exit 0 |
| 02 | c02 census and main (census mode), +3 cases | devin, same | 325 | DONE | S and T only | `Tests 1 failed \| 7 passed (8)`, exit 1: `--report inside the repository is refused` got 0 |
| 02b | c02b swap the `isPathInsideRoot` arguments, make the refusal case unable to write | devin, same | 136 | DONE | S +1/-1, T +2/-1 | `Tests 8 passed (8)`, exit 0 |
| 03 | c03 path replay, +2 cases and 2 expectations | devin, same | 235 | DONE | S and T only | `Tests 10 passed (10)`, exit 0 |
| 03b | c03b decision rules match the whole printed line, +2 cases | devin, same | 332 | DONE | S +8/-8, T +17 | `Tests 12 passed (12)`, exit 0 |
| 04 | c04 transcripts and rows, +4 cases | devin, same | 269 | DONE | S and T only | `Tests 16 passed (16)`, exit 0 |
| 05 | c05 scorer and label gate, +5 cases | devin, same | 208 | DONE | S and T only | `Tests 21 passed (21)`, exit 0 |
| 06 | c06 keep rule, +7 cases | devin, same | 134 | DONE | S and T only | `Tests 28 passed (28)`, exit 0 |
| 07 | c07 backend gates with stub binaries, +10 cases | devin, same | 227 | DONE | S and T only | `Tests 38 passed (38)`, exit 0 |
| 08 | c08 model arms, +4 cases | devin, same | 492 | DONE | S and T only | `Tests 42 passed (42)`, exit 0 |

Re-dispatches and corrections, with the reason for each:
- **01 to 01b.** The first run spent its budget reading packet docs and repository files and wrote nothing, then exited 0. The re-dispatch named the only two files to open and asked for S within four tool calls.
- **01c.** My own contract error. `scanText` anchored header lines at the line start, so a JSON log whose output string opens with the header (`{"output":"   Alignment check: ...`) lost its target. Case d passed only because the CLI low branch prints a `Target folder:` line. The header rules now match anywhere on a line; decision lines stay anchored.
- **02 to 02b.** Devin passed `isPathInsideRoot(path.resolve(value), repoRoot)`, but `shared/utils/path-containment.ts:36` takes the root first. The focused run failed on the refusal case, and because the refusal did not fire, that run went on to scan the real repository and wrote `no-such-report-dir/report.json` at the worktree root (see "Stray folder" below). 02b swapped the arguments and moved the case's path under `SKILL.md`, a file, so a broken refusal can neither create a folder nor scan the repository (`trackedFiles` injected empty).
- **03b.** Found by the orchestrator's read-only smoke run of the real census after 03 (`W/runs/smoke-03.txt`): `committed: files=6 events=4` with one data-path `infrastructure` event. It came from `specs/system-speckit/033-system-speckit-v4/041-skilled-source-root-migration/009-reference-rewrite/scratch/briefs/r3-04-payload.md:10`, which quotes the validator's source template `Warning: INFRASTRUCTURE MISMATCH (${Math.round(...)}% of files ...`. The decision rules now match the validator's whole printed line (digits where it prints numbers), with an optional JSON string end. The rerun (`W/runs/smoke-03b.txt`) prints `events=3`: the two archived 0% hard blocks and the 60% moderate event, as the spec's recount says.

### Stray folder `no-such-report-dir/` at the worktree root

- **What.** An untracked folder holding one `report.json`, modified 2026-09-29 16:35:05. Its content is census counts only (`"events": 4` with the data-path `infrastructure` count of 1), which is the pre-03b census shape, so it was written between dispatch 02 and dispatch 03b.
- **Cause.** My focused vitest run after dispatch 02 (`W/logs/02.vitest.txt`). T's case `--report inside the repository is refused before any output` called `main(['--report', join(REPO, 'no-such-report-dir')])` with no injected `trackedFiles`. With the swapped `isPathInsideRoot` arguments the refusal returned false, so `main` ran the real census and wrote `<repo>/no-such-report-dir/report.json`.
- **Fix, through executor brief c02b (dispatch 02b).** S line 398 now calls `isPathInsideRoot(repoRoot, path.resolve(value))`. The case now passes `join(REPO, '.skilled', 'skills', 'system-spec-kit', 'SKILL.md', 'report-dir')`, a path under a file where no directory can be made, and injects `trackedFiles: () => ({ files: [], skippedSource: 0 })`. The `--rows-out` refusal case (brief c04) uses the same under-a-file path.
- **Proof that no test writes outside a temp dir now.** Every other `main` call in T passes `--report`, `--rows-out` or `--out` paths made by `mkdtempSync(join(tmpdir(), 'alignment-suggestion-'))`, and `afterEach` removes them. After dispatch 08, a run of the whole file (42 passed) left the worktree root listing identical (`W/runs/root-before.txt` against `W/runs/root-after.txt`), added no status line outside my scratch folder, and left no `alignment-*` folder in `$TMPDIR` (0 before, 0 after).
- **Left for the session.** I did not delete the folder: it is outside my write scope and the brief forbids it. `rm -r no-such-report-dir` at the worktree root removes it.
