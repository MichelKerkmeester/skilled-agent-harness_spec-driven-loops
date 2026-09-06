---
title: "Confirmed findings: CLI runtime utilization"
description: "Every removal, merge and fix row from the GLM 5.3 Flash synthesis over the @spec-kit/cli package, reproduced or dropped in the main checkout, with the evidence observed and the remediation each was handed to."
trigger_phrases:
  - "cli runtime confirmed findings"
  - "cli package removal list reproduction"
  - "coverage graph cluster dead"
  - "spec kit check workflow"
importance_tier: "important"
contextType: "research"
---
# Confirmed findings: CLI runtime utilization

Source: `lineages/glm-5-3-flash-cli-runtime/research.md` (10 of 10 iterations, stop reason `maxIterationsReached`, 54 registered findings). Every row was re-checked in the main checkout on 2026-09-06 with a full-repository reference census (`rg` over `.opencode`, `.github` and the root, excluding `specs/`, changelogs, benchmark reports, `dist/` and `node_modules/`) before the remediation child `007-cli-package-residue-removal` was opened. **Confirmed** means the census agreed; **Corrected** means the row holds with a different count or cause; **Dropped** means the census contradicted it.

---

## 1. REMOVAL LIST

| # | Target | Reproduction | Disposition |
|---|--------|--------------|-------------|
| 1 | The seven `.scan*` and no-frontmatter files | Seven tracked files, one of them zero bytes; the only reference is one output file naming its own producer. | Confirmed. Removed in 007. |
| 2 | `continuity/ast-parser.ts` and `fix-memory-h1.mjs` | The parser's only importer is `tests/test-ast-parser.js`, which no npm script runs; the fixer is named only by two READMEs. | Confirmed. Both removed with the orphan test and every README row in 007. |
| 3 | `kpi/` | Referenced only by its own README. | Confirmed. Removed in 007. |
| 4 | `setup/_utils.sh` | No script under `setup/` sources it; the one `source` line loads `../common.sh`. The install-guides carry their own unrelated `_utils.sh`. | Confirmed. Removed with its two README rows in 007. |
| 5 | The three evals research harnesses | Each referenced only by the evals README and itself; none is in `npm run check`. | Confirmed. Removed with their README rows in 007. |
| 6 | `doctor.sh` | Referenced by nothing; the `/doctor` command has its own bootstrap. Its one check (the runtime resolves `zod`) is already implied by the runtime build the doctor bootstrap runs. | Confirmed. Removed in 007. |
| 7 | `migrate-deep-research-paths.ts` and `seed-council-value-fixture.cjs` | Referenced only from changelogs that record their one-time use. | Confirmed. Removed in 007. |
| 8 | `continuity/rank-memories.ts` | Five references, all documentation plus one section of the legacy module test; no command or hook runs it. | Confirmed. Removed with its test section, the root README bullet, the skill README row, the continuity README rows and the sk-code conventions tree in 007. |
| 9 | The retrieval acceptance trio | Already decided by lane 001: the retrofit moved to `ops/`, the sweep and latency harness stay documented as acceptance evidence. | Recorded decision from child 006; no further change. |
| 10 | `spec/check-smart-router.sh` and `spec/sweep-track-roots.mjs` | The router check has no caller. The track-root sweep is the manual tool the drift regeneration used and its README row documents the invocation. | Corrected: the router check removed in 007; the sweep kept as a documented manual tool. |
| 11 | `core/quality-scorer.ts` | Zero production importers; `core/workflow.ts` imports `extractors/quality-scorer.ts`. Two tests existed only to exercise it and one test mocked it. | Confirmed. Removed with the disambiguation test, the provenance test block and the mock in 007; the calibration test already exercised the live scorer. |
| 12 | `renderers/` | Zero production importers; the only importer was a test that mocked it around a test already marked obsolete. | Confirmed. Removed with the mock, the obsolete skipped test, the tsconfig include, the legacy module section, the export-contract row and every README pointer in 007. |
| 13 | `registry-loader.sh` and `scripts-registry.json` | The loader has no caller; the registry's counts disagree with the tree (14 scripts and 9 rules listed against 39 dispatched rules) and it is read by nothing at runtime. | Confirmed. Both removed with the three doc pointers in 007; the live registry is `lib/validator-registry.json`. |

The synthesis also named `lib/trigger-extractor.js` as a dead-but-registered shim. **Dropped:** the source is `lib/trigger-extractor.ts`, imported by `semantic-signal-extractor.ts` and `memory-frontmatter.ts`.

---

## 2. MERGE LIST

| # | Claim | Reproduction | Disposition |
|---|-------|--------------|-------------|
| 1 | Two placeholder checks implement one rule | `spec/check-placeholders.sh` scans any bracket that looks like a placeholder for the post-edit hook; `rules/check-placeholders.sh` flags only the two canonical markers for the validator. Different inputs and different consumers. | Corrected: not one rule. Each header now names the other and the difference. |
| 2 | The coverage-graph cluster is duplicated across two skills | `lib/coverage-graph-*.cjs` (five modules, 1,531 lines) has zero production importers; the deep-loop runtime uses its own `lib/coverage-graph/` and the command contracts compute the stop gates from `graph_signals_json`. Eight cli test files and one cross-skill parity test existed to patrol the copy. | Confirmed. Cluster and its nine tests removed in 007; the deep-loop playbook scenario that called the copy canonical now points at the command contract and the ledger schema. |
| 3 | Two registries disagree | See removal row 13. | Confirmed; resolved by removal. |
| 4 | Two quality scorers | See removal row 11. | Confirmed; resolved by removal. |
| 5 | Two comment-hygiene lanes | The validator rule scans HTML comments in spec documents; the sk-code checker scans code comments in the pre-commit hook and CI. | Corrected: two inputs, not one concept. The rule header now says so. |
| 6 | Four sweeps should be one module | `strict-pass-freshness.ts` walks packets for CI, `process-sweep.ts` inventories processes for the plugin, the residue sweep greps for retired terms, the track-root sweep compares manifests. They share no logic. | Recorded decision: no change; an abstraction none of the four needs. |
| 7 | Three template mechanisms | With `renderers/` gone, `templates/inline-gate-renderer.sh` renders gates and `lib/template-utils.sh` copies level templates; different jobs. | Resolved by removal row 12; the remaining two stay. |
| 8 | Three repo-root resolvers | One is shell (`common.sh`), one is ESM (`shared/workspace/repo-root.mjs`, consolidated in the earlier program); a shell script cannot import the ESM one. | Recorded decision: no change. |
| 9 | Three phase-parent detectors with a documented regex that disagrees with the enforced one | The engine and the save path each keep a copy and the shell mirror is a third; the documented `^[0-9]{3}-[a-z0-9-]+$` differed from the enforced `^[0-9]{3}-[a-z0-9][a-z0-9-]*$`, and three code sites used the looser form. | Corrected and fixed: every document, comment and code site now carries the enforced regex; the save-path copy stays because it also recognises derived children and hardened membership, which the command contract now states. |
| 10 | `resource-map/extract-from-evidence.cjs` is unwired from the deep commands | The command contracts name the artifact and no step names the tool. | Confirmed. Wiring waits for lane 004, whose charter covers the resource-map addon; recorded in the parent goal log so it is not lost. |
| 11 | One production importer of `js-yaml` | Three production importers: `validation/continuity-freshness.ts`, `lib/validate-memory-quality.ts`, `rules/check-grep-convention-helper.mjs`. | Dropped. |

---

## 3. FIX LIST

| # | Claim | Reproduction | Disposition |
|---|-------|--------------|-------------|
| 1 | Three self-descriptions name three different packages | `package.json`, the CLI README and ARCHITECTURE each described a different third. | Confirmed. All three now describe the same package. |
| 2 | The 002 spec claimed validation and retrieval are the heaviest callers | Line 78 of its spec. | Confirmed. Rewritten. |
| 3 and 4 | Registry counts and dependency rows wrong | See removal row 13. | Resolved by removal. |
| 5 | README says the command-tree parity check is a validate.sh rule | No registry, orchestrator or validate.sh names `COMMAND_TREE_PARITY`; the workflow `command-tree-parity.yml` runs the script. | Confirmed. Row corrected. |
| 6 | ARCHITECTURE says validate.sh enforces 20 rules | The registry holds 39 (20 authored-template, 13 operational-runtime, 6 structural). | Confirmed. Sentence corrected and names the orchestrator hop. |
| 7 | A save-command key promises indexing | `post_save_indexing` in two plan command YAMLs; its own note says nothing indexes; no code reads the key. | Confirmed. Renamed `post_save_write`. |
| 8 | The delegation story is told differently in two documents | The rules README never named the orchestrator hop. | Confirmed. One sentence added there. |
| 9 | The ops healers are self-declared stubs | Both healers, the runbook that dispatches to them and their shared helper never completed a cycle. | Confirmed. All four removed and the ops README rewritten around what remains. |
| 10 | Mirror drift is CI-invisible for commands and prompts | The agent-mirror workflow covers agents only; the five doctor checks run on demand. | Confirmed. The new `spec-kit-check` workflow runs the five checks. Three of them fail today on the other session's uncommitted diagram move (`create-diagram.md` in `.cursor` and `.codex`), which is exactly the drift they exist to surface. |
| 11 | The trigger-index freshness story | Addressed by child 006. | Recorded. |
| 12 | Nothing automated runs `npm run check`, vitest or typecheck | No workflow named them; `changed-packet-validation.yml` only builds. | Confirmed. The `spec-kit-check` workflow now runs the CLI check gate, typecheck, the shared tests and the CLI vitest project on every pull request that touches the skill. |
| 13 | Worktree symlinks resolve into the main checkout | True of this machine's worktree, not of the repository. | Dropped as an environment fact. |

Found during reproduction, not in the synthesis: `tests/test-export-contracts.js` could not run at all (CommonJS `require` in an ESM package) and asserted handlers retired with the memory decommission. Removed in 007. `tests/recursive-child-manifest.vitest.ts` fails today because it checks a goal-file manifest inside the other session's live packet `specs/system-deep-loop/036-*`; that packet is not this program's to touch, and the failure is recorded here rather than worked around.

---

## 4. OPEN QUESTIONS CARRIED

1. Whether `resource-map/extract-from-evidence.cjs` should be named by the deep-research and deep-review contracts, decided with lane 004.
2. Whether the spec-kit test that reads a manifest inside `specs/system-deep-loop/036-*` should depend on a packet at all; it belongs to that packet's owner.
