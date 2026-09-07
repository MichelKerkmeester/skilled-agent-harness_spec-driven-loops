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
| 10 | `resource-map/extract-from-evidence.cjs` is unwired from the deep commands | The command contracts name the artifact and no step names the tool. | Superseded in round two: the deep-research and deep-review workflows invoke `reduce-state.cjs --emit-resource-map`, which reaches the extractor through `system-deep-loop/shared/synthesis/resource-map.cjs`; the wiring exists and nothing waited on lane 004. |
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

1. Answered in round two: the extractor is reached through the reducer's `--emit-resource-map` path, so the contracts name the artifact and the reducer names the tool.
2. Whether the spec-kit test that reads a manifest inside `specs/system-deep-loop/036-*` should depend on a packet at all; it belongs to that packet's owner.

---

## 6. ROUND TWO (DeepSeek V4 Flash max through DevPass, 10 iterations on the remediated tree)

Source: `lineages/deepseek-v4-flash-cli-runtime/research.md`, stop reason `maxIterationsReached`, 21 findings: 15 P1, 6 P2. Censused in the main checkout on 2026-09-07 before child `014-cli-decommission-orphan-removal` was opened. The lane's zero-importer claims were re-checked with relative imports included, which the lane had not swept; two of its removal rows failed that check and stay.

### Verdict held

Children 007 and 008 landed at the file and reference level: none of the 31 removed paths has a live reference, the 13 environment variables are gone from every surface 008 named, and the six paths the CI workflow lists exist. The lane's own re-verification of round one's dropped rows and kept decisions held.

### Removal rows

| # | Target | Census | Disposition |
|---|--------|--------|-------------|
| 1 | `rules/check-doc-pointers.sh` | No registry row, no caller, no document names it | Removed |
| 2 | `utils/phase-classifier.ts` | A re-export shim; the legacy test loads the canonical `lib/` module | Removed |
| 3 | `utils/workspace-identity.ts` | `utils/tool-sanitizer.ts` imports it relatively, which the lane's sweep missed | Kept; the lane's claim was wrong |
| 4 | `core/alignment-validator.ts` | `core/workflow.ts` imports it relatively; it is not a twin of the spec-folder validator but the workflow's own | Kept; the lane's claim was wrong |
| 5 | `observability/live-session-wrapper.ts` | Only its own README rows named it | Removed with the rows |
| 6 | `utils/validation-utils.ts` | Two legacy test blocks were its only consumers | Removed with both blocks |
| 7 | `graph/migrate-generated-json.ts` | A documented maintenance command in two READMEs with a test | Kept: a CLI entrypoint has no importers by design |
| 8 | `lib/cli-capture-shared.ts` | Only a README row named it | Removed with the row |
| 9 | `lib/validator-registry.ts` | No importer; the engine reads the JSON directly | Removed with its README row; the lane 005 census that cited it as live was corrected |
| 10 | `cli/check-links.sh` | The post-edit router calls `rules/check-links.sh` directly | Removed; the catalog and hooks README point at the rule |
| 11 | `pi/sync-*-pi.cjs` | The doctor's runtime-mirrors asset names both as its pi targets | Kept: wired through the doctor, which the lane did not read |
| 12 | `optimizer/` | Its manifest is read by the deep-loop configs and a deep-loop test | Kept, as child 011 recorded |
| 13 | `codex/generate-command-routers.cjs` | The sk-create-command contract documents it as the router drift check | Kept: a documented manual tool |
| 14 | `tests/test-naming-migration.js` | Runs under no lane; its only subject was row 4 | Removed: the naming migration it verified is finished |

### Fix rows

| # | Leftover | Disposition |
|---|----------|-------------|
| 1 | `environment-variables.md` still taught `SPECKIT_ROLLOUT_PERCENT` | Row removed; the other 26 variables in that document all have readers |
| 2 | Two documents kept the looser phase-child regex | Both now carry the enforced form |
| 3 | Three test fixtures advertised `SPECKIT_ADAPTIVE_FUSION` | Sentence removed |
| 4 | `ARCHITECTURE.md` tree tag said the CLI indexes and runs evals | Tag rewritten |
| 5 | The CI workflow ran the vitest project only | The legacy module lanes and the bash validation suites now run in CI; they had rotted unseen: the legacy lane still tested the embeddings module child 009 removed, the validation-system test addressed the pre-nesting `scripts/` layout, the frozen compliant fixture carried a stale derived fingerprint, and the extended suite expected the fixture to be silent where the base suite documents its folder-token warning. All four were repaired. The runtime root project stays outside CI with seven failing files, recorded for the next child |
| 6 | pi mirror drift | Dropped: the doctor asset wires both scripts |
| 7 | `frontmatter.mjs` named the pre-nesting `scripts/lib` path | Corrected |
| 8 | The confirmed-findings row on resource-map wiring | Superseded: the reducer's `--emit-resource-map` path reaches the extractor |
