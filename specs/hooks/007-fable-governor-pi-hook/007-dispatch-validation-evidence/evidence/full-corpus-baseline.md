# Full-Corpus Baseline

## Scope and command contract

This artifact records the advisor-package corpus from its committed Vitest configuration. The command runs from the package root; it is not a focused dispatch gate. A nonzero result is retained as a failure baseline and is not described as green.

| Field | Observation 001 |
|---|---|
| Command | `(cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp-server && npx vitest run --reporter=dot)` |
| Package root | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp-server` |
| Vitest config | `vitest.config.ts` in the package root; `tests/**/*.vitest.ts` included, benches excluded unless `SPECKIT_RUN_BENCHES=true` |
| Git commit | `99661d468fc19a9a26335a52045f7e1c07e2bae9` |
| Start / end (UTC) | `2026-08-04T22:38:29Z` / `2026-08-04T22:39:46Z` |
| Wall duration | 77 seconds (wrapper measurement) |
| Vitest duration | 76.42 seconds (`transform 747ms`, `setup 342ms`, `import 3.81s`, `tests 63.35s`, `environment 4ms`) |
| Environment | Node `v25.6.1`; npm `11.9.0`; Vitest `4.1.6` (`darwin-arm64`); Darwin arm64 kernel `25.6.0` |
| `SPECKIT_RUN_BENCHES` | Unset |
| Test-file result | 93 passed, 18 failed, 1 skipped; 112 total |
| Test result | 675 passed, 27 failed, 7 skipped; 709 total |
| Exit code | **1** |

The working tree was already dirty before this phase's edits. The commit above is the repository `HEAD`, not a claim that the working tree was clean.

## Historical observation retained as provenance

Phase 002 recorded a historical full-repository observation of **21 failed test files** attributed broadly to IPC, corpus, missing-plugin, and environment issues (`../002-governor-parity/tasks.md`, T005; `../002-governor-parity/implementation-summary.md`). That row did not retain an exact command, package root, commit, or complete failure ledger. It remains historical provenance only. The current package-root observation above is a separate result: 18 failed test files and 27 failed tests, exit 1. The changed count is not substituted for the historical count.

## Observation 001 failure ledger

The following failures are copied from the command output. The owner labels identify the maintenance surface for a later repair; they do not attribute any failure to the dispatch guard without a causal reproduction.

| # | Failure name | Observed symptom | Maintenance owner |
|---:|---|---|---|
| 1 | `tests/compiled-routing-consumption.vitest.ts` (collection) | Cannot find package `@opencode-ai/plugin/tool` imported by `.opencode/plugins/mk-skill-advisor.js`. | OpenCode plugin dependency/integration |
| 2 | `tests/mk-skill-advisor-plugin.vitest.ts` (collection) | Cannot find package `@opencode-ai/plugin/tool` imported by `.opencode/plugins/mk-skill-advisor.js`. | OpenCode plugin dependency/integration |
| 3 | `tests/skill-graph-diagnostic-redaction.vitest.ts` (collection) | Cannot find package `@opencode-ai/plugin/tool` imported by `.opencode/plugins/mk-skill-advisor.js`. | OpenCode plugin dependency/integration |
| 4 | `tests/launcher-bootstrap.vitest.ts` — filters parent environment before spawning npm or the advisor server | Unexpected `SPECKIT_IPC_SOCKET_DIR` appears in the filtered environment. | Advisor launcher environment contract |
| 5 | `tests/launcher-bootstrap.vitest.ts` — passes the committed daemon trust default through to the advisor child env | Unexpected `SPECKIT_IPC_SOCKET_DIR` appears in the child environment. | Advisor launcher environment contract |
| 6 | `tests/launcher-bootstrap.vitest.ts` — passes advisor shadow feature flags through to the child env | Unexpected `SPECKIT_IPC_SOCKET_DIR` appears in the child environment. | Advisor launcher environment contract |
| 7 | `tests/manual-testing-playbook.vitest.ts` — keeps the root playbook aligned with the live 47-scenario corpus | Expected 47 scenario files; observed 0. | Advisor manual-testing corpus |
| 8 | `tests/skill-advisor-cli-parity.vitest.ts` — keeps top recommendations identical across ten representative prompts | Expected parity fixture path does not exist. | Advisor CLI parity fixtures |
| 9 | `tests/vocabulary-agreement.vitest.ts` — every skill-family dialect agrees | Parsed vocabulary is `"sk-hub", "category": "[category` instead of the canonical skill-family set. | Advisor vocabulary agreement |
| 10 | `tests/handlers/advisor-validate.vitest.ts` — surfaces named intent buckets with minN floors | Review bucket count is 31 but the minimum is 32. | Advisor validation corpus |
| 11 | `tests/handlers/advisor-validate.vitest.ts` — computes buckets over the full corpus regardless of skillSlug scope | Review and memory-save bucket counts are 31 instead of 32. | Advisor validation corpus |
| 12 | `tests/hooks/settings-driven-invocation-parity.vitest.ts` — `event=UserPromptSubmit` matcher-group hook length | Expected 1 hook; observed 2. | Hook settings parity |
| 13 | `tests/hooks/settings-driven-invocation-parity.vitest.ts` — `event=SessionStart` matcher-group hook length | Expected 2 hooks; observed 5. | Hook settings parity |
| 14 | `tests/hooks/settings-driven-invocation-parity.vitest.ts` — `event=Stop` matcher-group hook length | Expected 1 hook; observed 2. | Hook settings parity |
| 15 | `tests/parity/local-native-divergence-ratchet.vitest.ts` — every current divergence is recorded in the ledger | 11 current local/native divergences are absent from the approved ledger. | Local/native divergence ledger |
| 16 | `tests/parity/local-native-divergence-ratchet.vitest.ts` — every ledger entry is still divergent | 5 ledger entries no longer diverge. | Local/native divergence ledger |
| 17 | `tests/parity/local-native-divergence-ratchet.vitest.ts` — ledger entries match current promptHash and local/native tops | 12 ledger entries have changed local or native top results. | Local/native divergence ledger |
| 18 | `tests/parity/python-ts-parity.vitest.ts` — preserves all Python-correct corpus decisions while improving accuracy | Observed `pythonCorrect=110`; ratchet expected 106. | Python/TypeScript parity corpus |
| 19 | `tests/parity/scorer-eval-baseline-ratchet.vitest.ts` — full-corpus top-1 holds exactly and clears the release floor | Observed `full_corpus_top1.correct=152`; baseline is 151. | Scorer evaluation baseline |
| 20 | `tests/legacy/advisor-corpus-parity.vitest.ts` — preserves Python-correct top-1 decisions while allowing native improvements | Observed 195 rows; test expects 193. | Legacy advisor corpus |
| 21 | `tests/legacy/advisor-graph-health.vitest.ts` — keeps health ok when skill-advisor is the only graph-only node | Observed status `degraded`; test expects `ok`. | Advisor graph health |
| 22 | `tests/scorer/bm25-lexical-shadow.vitest.ts` — matches or beats the current lexical lane on exact-label advisor corpus prompts | TypeError: undefined skill id is read by `.replace`. | Scorer lexical lane fixtures |
| 23 | `tests/scorer/executor-delegation.vitest.ts` — retired executor abstention | Observed action `route`; test expects `abstain`. | Executor-delegation resolver |
| 24 | `tests/scorer/executor-delegation.vitest.ts` — native scorer shared fixture | `suppressed-codex-abstain` routes to `cli-codex` instead of `none`. | Executor-delegation fixtures |
| 25 | `tests/scorer/executor-delegation.vitest.ts` — TypeScript/Python shared fixture parity | `suppressed-codex-abstain` routes to `cli-codex` in both implementations instead of `none`. | Executor-delegation fixtures |
| 26 | `tests/scorer/lane-weight-sweep.vitest.ts` — seeded lane weight sweep harness | No summary meets the expected accuracy condition. | Scorer lane-weight evaluation |
| 27 | `tests/scorer/semantic-lane-promotion.vitest.ts` — pre-promotion stability for four prompts | TypeError: undefined skill id is read by `.toLowerCase` in four stability cases. | Semantic lane promotion fixtures |

The command reported 1 skipped file and 7 skipped tests in addition to the failures above. Its complete result was `18 failed | 93 passed | 1 skipped` test files and `27 failed | 675 passed | 7 skipped` tests; exit code 1.

## Observation 002 — final focused source state

The canonical command was rerun after the Phase 007 Pi factory test update. The count and failure names matched Observation 001; the second run is retained rather than silently replacing the first result.

| Field | Observation 002 |
|---|---|
| Command | `(cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp-server && npx vitest run --reporter=dot)` |
| Package root | `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp-server` |
| Git commit | `99661d468fc19a9a26335a52045f7e1c07e2bae9` |
| Start / end (UTC) | `2026-08-04T22:49:53Z` / `2026-08-04T22:51:09Z` |
| Wall duration | 76 seconds (wrapper measurement) |
| Vitest duration | 76.04 seconds (`transform 722ms`, `setup 372ms`, `import 3.81s`, `tests 63.04s`, `environment 4ms`) |
| Environment | Node `v25.6.1`; npm `11.9.0`; Vitest `4.1.6` (`darwin-arm64`); Darwin arm64 kernel `25.6.0` |
| `SPECKIT_RUN_BENCHES` | Unset |
| Test-file result | 93 passed, 18 failed, 1 skipped; 112 total |
| Test result | 675 passed, 27 failed, 7 skipped; 709 total |
| Failure ledger | Same 27 failure names as Observation 001; no count change observed |
| Exit code | **1** |

`git diff` and focused test edits do not change the advisor package's corpus selection. Observation 002 is still a nonzero corpus result and remains deferred under the contract below.

## Deferral contract

**Disposition:** focused dispatch evidence is independent and may be handed off only with its own passing receipts. The full advisor corpus remains an explicit nonzero maintenance deferral; this artifact never calls it green.

**Owner:** maintainers of `.opencode/skills/system-skill-advisor/mcp-server` and its plugin, launcher, parity, corpus, and scorer fixtures.

**Revisit trigger:** before the next advisor-corpus release or any packet-level claim that depends on whole-corpus health, restore or intentionally revise the missing plugin dependency and the listed fixture/ratchet contracts, then rerun the exact package-root command above. Append a new dated observation with its own commit, environment, counts, and failure ledger; do not overwrite Observation 001 or the historical 21-file row.
