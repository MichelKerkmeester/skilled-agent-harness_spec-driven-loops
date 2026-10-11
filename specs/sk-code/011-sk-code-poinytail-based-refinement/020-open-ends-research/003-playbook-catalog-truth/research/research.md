---
title: "Research: playbook and catalog self-checks against the code"
description: "Checked synthesis of a ten-iteration DeepSeek V4.1 Flash deep-research run on how manual-testing playbook scenarios and feature catalog entries drift from the code, what catches it today, and the lightest self-checks their sk-doc modes and validators could run."
trigger_phrases:
  - "playbook catalog truth synthesis"
  - "playbook drift self check research"
  - "feature catalog anchor drift"
importance_tier: "important"
contextType: "research"
---
# Research: playbook and catalog self-checks against the code

One lineage ran ten iterations of `/deep:research` on DeepSeek V4.1 Flash at max effort, through cli-pi on the llmgateway (DevPass) route, with stop policy max-iterations. Its iterations are under `iterations/`, its deltas under `deltas/` and its dispatch receipts under `dispatch-receipts/`. This file is the orchestrator's synthesis. Every load-bearing claim was re-checked in the worktree and carries one mark:

- **[VERIFIED]**: the orchestrator read the cited line or ran the named command, and the result would have differed had the claim been false.
- **[LINEAGE]**: a measurement the lineage made and the orchestrator did not rerun. It is reported as the lineage's number, not as a fact.

---

## 1. Executive Summary

The repository already owns most of the self-check this question asks for. It is not running it.

- A line-level citation scanner, `cite-drift-scan.mjs`, already resolves every `path:line` citation in every skill's playbook scenarios and catalog leaves. It needs no model call and took 4.5 seconds here. It reports two past-end anchors in a live deep-research playbook scenario today. No workflow runs it. [VERIFIED]
- The feature catalog package validator runs green across all 29 packages in about 2 seconds. No workflow runs it either. Its fixture test is orphaned from every test runner. [VERIFIED]
- The catalog validator's path check silently skips every two-column `File` table: 55 such tables, 47 checkable paths, one of them dead. [VERIFIED]
- The scanner's resolver cannot see paths written relative to a skill's `runtime/` directory, which is why three stale advisor anchors pass every check. [VERIFIED]
- The token-at-line check the lineage designed already exists in the scanner as `flagByIdentifierOverlap`, used only to score labelled rows. [VERIFIED]

So the lightest path is mostly wiring and in-place extension: run the two existing checkers in CI, close two blind spots in them, and reuse a function that is already written. The option and expected-answer halves of the question come out as **Build nothing**, with evidence below. Section 5 holds the ranked table.

---

## 2. Method

- **Workflow**: `/deep:research` auto YAML, executed step by step by the orchestrator. Config, state log through the append gateway, strategy and registry at init. Per iteration: lock refresh, graph convergence telemetry, prompt pack render, the YAML's cli-pi branch (`buildLineageCommand` plus `runAuditedExecutorCommand` plus write containment), `verify-iteration.cjs`, the reducer, graph upsert and telemetry.
- **Route**: every iteration dispatched `pi -p --offline --model llmgateway/deepseek-v4.1-flash --thinking max`. All ten completion receipts in `dispatch-receipts/` name that selector. No usage limit was reported, so the Cline Pass fallback was never used. [VERIFIED]
- **Iterations**: 10 records of `"type":"iteration"` in `deep-research-state.jsonl`. Every iteration passed `verify-iteration.cjs` on its first dispatch. [VERIFIED]
- **Containment**: `git status` showed no change outside this packet after the loop. [VERIFIED]
- **Orchestrator checks**: beyond the spot-checks, the orchestrator ran the scanner census, the catalog validator, `--advise` on the two drifted catalogs and a two-column-table census. Those runs produced findings the lineage did not have (section 7).

---

## 3. Answers to the Research Questions

### Q1. Where do scenarios and catalog entries drift today, and what catches it?

| Drift class | Live instance | What catches it today |
|---|---|---|
| Line anchor past the end of the file | `iteration-citation-jsonl.md:102` cites `research.md:157-179`; the file has 161 lines. Same row shape at `:107` against `SKILL.md:450-459`, 458 lines. [VERIFIED] | `cite-drift-scan.mjs`, when someone runs it. Nothing in CI. |
| Anchor in range, wrong line | `code-standards-alignment.md:76` cites `spec-folder-mutex.ts:10` for `SPEC_FOLDER_LOCKS`; line 10 is an import and the constant is at line 22. [VERIFIED] Three advisor anchors, such as `compiledRoute` cited at `advisor-tool-schemas.ts:221` and declared at `:268`. [VERIFIED] | The scanner's `--advise` flags the mutex case (p_yes 0.12) through the Jev classifier when a credential is stored. The advisor cases are invisible to everything. [VERIFIED] |
| Moved or deleted file named in a scenario | `design-diagram-command.md:30` names `.skilled/commands/create/diagram.md` and `create-diagram-auto.yaml`. The command now lives at `.skilled/commands/design/diagram.md` with `assets/diagram-auto.yaml`. [VERIFIED] | Nothing. The playbook validator checks markdown links only. |
| Dead path in a catalog table | `json-primary-deprecation-posture.md:44` lists `.skilled/commands/memory/save.md`, which does not exist. [VERIFIED] | Nothing. The table has two columns, and the validator skips rows with fewer than three cells. |
| Expected text disagrees with the producer | `spec-folder-literal-naming-create-sh-fallback.md:90` ends the warning at "literal slugs."; `create.sh:1637` prints "literal slugs describing the concrete work." The same scenario's Evidence block at line 119 shows the full text. [VERIFIED] | Nothing. Found by the lineage. |
| Prose line reference gone stale | The same scenario's triage line 138 says `create.sh` line 1084 holds `PROVIDE-DESCRIPTIVE-SLUG`; the token sits at 1060 and 1636, and line 1084 is a `print` statement. [VERIFIED] | Nothing. No extractor reads the "`file` line N" form. |
| Option that does not exist | The historical `--phase-count` case. Remediated: `rg phase-count .skilled/skills` returns nothing. [VERIFIED] | `create.sh` now exits 1 on an unknown option (`create.sh:349-353`), so the scenario run fails. [VERIFIED] |
| Expected router answer disagrees with the router | The DOC-331 case, settled in `016-residual-closeout/003-admission-gold`. | `compiled-route-admission.cjs --all --warn-only` in `routing-registry-drift.yml:180`, which scores compiled decisions against playbook routing gold. [VERIFIED] |

### Q2. What do the two validators check, and which checks touch the code?

- **Playbook validator** (`validate-playbook-package.cjs`): its only repository-touching check is `pathChecks`, which resolves markdown-link targets for existence, case, symlink escape and repo escape (`validate-playbook-package.cjs:339-345`). Everything else is document shape: required sections, presence markers (the command-sequence rule at line 254 accepts any heading text), verdict vocabulary, prompt sync and census. It runs fleet-wide and strict on every PR, push and schedule (`playbook-operator-contract.yml:61`). [VERIFIED]
- **Catalog validator** (`validate_catalog_package.py`): it checks path existence for `File`-table cells under four prefixes, with the `:line` suffix stripped before the check (`validate_catalog_package.py:593`), plus prose path existence (`:332` strips the suffix the same way). The rest is document parity, including a registry parity check against `mode-registry.json` (`:786`). Its own SKILL.md says source-anchor accuracy "still require[s] manual review" (`SKILL.md:378`). No workflow runs it. [VERIFIED]

### Q3. What is the lightest self-check?

For catalog code anchors and scenario code references: the existing scanner, run in CI, with one resolver base added and its existing identifier-overlap verdict printed (R1, R4, R5). For catalog paths: the existing package validator, run in CI, reading two-column tables (R2, R3). For scenario file references that carry no line number: one in-place extension of `pathChecks` (R6). For scenario options, expected answers and router answers: build nothing new (R8 to R10).

### Q4. What would that check still miss?

- **Semantic expectations.** A wrong count, branch or exit code while every literal still exists needs execution, and the playbook package has no runner. The scenario run is the check.
- **Paraphrased claims.** Identifier overlap only works when the citing sentence names a code token. The lineage found 25 of 36 catalog anchors carry none. [LINEAGE]
- **Non-repository executables.** Flags of `git`, `node` or `pi` have no in-repo source of truth.
- **Extension trees.** The playbook validator discovers packages only under `.skilled/skills` (`validate-playbook-package.cjs:81`), so the 23 scenarios under `.pi/extensions/` stay outside it. [LINEAGE count; root VERIFIED]
- **Moves inside a file.** Bounds checking passes a citation whose target moved down but stayed within the file's length; only the identifier-overlap advisory sees it.

### Q5. What can be extended in place?

`cite-drift-scan.mjs` (resolver bases, census output), `validate_catalog_package.py` (the `File`-table row walk), `validate-playbook-package.cjs` (`pathChecks`) and the existing `sk-doc-script-tests.yml` workflow. No new script, registry or runner is needed.

---

## 4. Counts the Recommendations Rest On

| Measure | Value | Mark |
|---|---|---|
| Playbook trees and files under `.skilled/skills` | 57 trees, 1,465 files | [VERIFIED] |
| `### Expected` blocks / with a fenced transcript | 1,012 / 10 by the orchestrator's count (13 by the lineage's) | [VERIFIED] |
| Feature catalog packs | 29 | [VERIFIED] |
| Catalog files with a `path:line` anchor | 6 | [VERIFIED] |
| Scanner skills census | 505 citations: 225 in range, 2 past end, 1 moved past end, 219 unresolved | [VERIFIED] |
| Catalog validator, all packages | 0 failures, 2 notes, about 2 s | [VERIFIED] |
| Two-column `File` tables in catalogs | 55 tables, 47 prefixed paths, 1 dead | [VERIFIED] |
| Option-attribution false absences | 273 of 1,085 nearest-mention pairs | [LINEAGE] |
| Fresh-sample backticked tokens unresolved under the best ladder | 153 of 4,384 (3.5 percent) | [LINEAGE] |

---

## 5. Recommendations

Ranked so R1 matters most. Each move is named from the reversal-cost order in `.skilled/repo-rules/prevent-overengineering.md`.

| ID | Recommendation | Evidence | Move | Why the cheaper move fails |
|----|----------------|----------|------|----------------------------|
| R1 | Run the existing citation scanner, `cite-drift-scan.mjs --corpus skills`, as a report-only step in `sk-doc-script-tests.yml`. It already resolves every `path:line` in playbook scenarios and catalog leaves, makes no model call and took 4.5 seconds here. | `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:12`; two past-end anchors today at `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/iteration-citation-jsonl.md:102` and `:107`; `.github/workflows/sk-doc-script-tests.yml:53` | Extend in place | Build nothing fails: no workflow runs the scanner (`grep -rln cite-drift .github/workflows` exits 1), and its only automatic caller is the per-document advisory at `.skilled/skills/sk-doc/scripts/validate_document.py:1843`, so both past-end anchors stand unflagged. Change a value fails: no workflow step or config list exists to add it to. |
| R2 | Run `validate_catalog_package.py` over all packages in CI, fail-closed, in the same workflow, and run its orphaned fixture test there too. | `.skilled/skills/sk-doc/scripts/tests/run-script-tests.sh:12`; `.github/workflows/playbook-operator-contract.yml:61` | Extend in place | Build nothing fails: no workflow names the catalog validator (`grep -rn validate_catalog_package .github/workflows` exits 1), while the playbook validator gates every PR. It ran green here (29 packages, 0 failures), so it can block from its first run. Change a value fails: the shared runner globs only `test_*.py` in its own directory, so there is no list to append the fixture test to. |
| R3 | Make the catalog path check read two-column `File` tables, or flag them as off-template so their paths get checked. | `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:306`; missed dead path at `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/json-primary-deprecation-posture.md:44`; the template is three-column at `feature-catalog-template.md:223` | Extend in place | Change a value fails: lowering the shared `< 3` guard also changes `_implementation_rows` at `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:738`, which feeds the shipped-label check, so the change belongs in the existence caller's row walk, not in the shared threshold. Build nothing fails: 55 tables with 47 paths are never checked today. |
| R4 | Add the skill's `runtime/` and `scripts/` directories as candidate bases in `resolveCitation`, after the skill root. | `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:378`; `advisor-recommend.md:31` cites `schemas/advisor-tool-schemas.ts:221` while `compiledRoute` is declared at `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:268` | Extend in place | Build nothing fails: the resolver tries only the citing doc's directory, the repo root and the skill root, so `--advise` over the two drifted catalogs checked 2 citations and set 7 aside, and the three stale advisor anchors pass every check. The census leaves 219 of 505 citations unresolved. |
| R5 | Print the scanner's existing mechanical identifier-overlap verdict per citation in the census, as an advisory line. This is the token-at-line check the lineage proposed, and it is already written. | `.skilled/skills/sk-doc/shared/scripts/classifier-cite-drift-scan.mjs:118`; used only for scoring at `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:1062`; live case `.skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/code-standards-alignment.md:76` against `.skilled/skills/system-spec-kit/runtime/handlers/save/spec-folder-mutex.ts:22` | Extend in place | Build nothing fails: `flagByIdentifierOverlap` only scores labelled rows, and the per-citation advisory that does flag `code-standards-alignment.md:76` calls the Jev classifier and stays silent without a stored credential (`.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:8`), which CI does not hold. It stays advisory: the census scores it 16 of 40 right on labelled rows. |
| R6 | Extend the playbook validator's `pathChecks` to resolve backticked repo paths in scenario files, report-only, with file-relative, skill-root and repo-root bases and an expected-unresolved list (placeholders, globs, `/tmp`, runtime output). | `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs:342`; `.skilled/skills/sk-design/sk-design-diagram/manual-testing-playbook/command-and-hub-integration/design-diagram-command.md:30` names a command and asset that moved to `.skilled/commands/design/` | Extend in place | Build nothing fails: the strict fleet gate passes a scenario whose command file and workflow asset moved, because `pathChecks` matches only `[text](target)` links and the scanner needs a line number. Report-only because the lineage's best ladder still left 3.5 percent of backticked tokens unresolved, nearly all placeholders and scratch paths. |
| R7 | Correct the live drift this run found, as plain doc edits in the fix phase: triage line 138 (1084 to 1060 and 1636), the truncated Expected warning at line 90, `spec-folder-mutex.ts:10` to `:22`, the three stale advisor anchors, the moved diagram paths, the past-end ranges in `iteration-citation-jsonl.md` and the dead `memory/save.md` row. | `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:90` against `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:1637` | Change a value | Build nothing fails: each document sends an operator to a wrong line, a missing file or a shorter message than the producer prints. |
| R8 | Build no static flag-versus-script option check for scenarios. | `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:351` rejects an unknown option with exit 1 | Build nothing | None: this is the cheapest move. A static check would cost more and fail its own test: binding flags to the command they belong to gave 273 false absences in 1,085 pairs, and the flagship scenario's `--trace-warnings`, a Node flag in captured stderr at `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:123`, trips a naive version. `--phase-count` now fails at run time, where the scenario runner sees it. |
| R9 | Build no expected-answer comparison against producer output. | `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/spec-folder-literal-naming-create-sh-fallback.md:90` is the one live disagreement; 10 to 13 of 1,012 `### Expected` blocks hold a literal transcript | Build nothing | None: this is the cheapest move. A comparator would serve about a dozen blocks with one known fire, which R7 fixes by hand; one instance is a case, not a pattern (`prevent-overengineering.md` section 4). Semantic expectations need execution, and the package has no runner. |
| R10 | Build no new checker for router expected answers, the DOC-331 class. | `.github/workflows/routing-registry-drift.yml:180` already scores every hub's compiled decisions against its playbook routing gold; `.skilled/bin/compiled-route-admission.cjs:3` | Build nothing | None: this is the cheapest move. This is the check that caught DOC-331. It runs warn-only until its first baseline is triaged (`routing-registry-drift.yml:175`), and making it blocking is that triage's decision, not a new tool's. |

---

## 6. Eliminated Alternatives

- **A new bounds check inside the catalog validator** (lineage iterations 2 to 4). Eliminated: the scanner already classifies `past_end` for the same files, and the bounds tier fired 0 of 36 times on catalog anchors. R1 gets the same coverage with no new code.
- **A new token-at-line function in the catalog validator** (lineage iterations 3, 6 and 7). Eliminated: `flagByIdentifierOverlap` already exists (R5), and it reaches prose bullets and bare-relative paths, which the catalog validator's `File`-table walk never sees.
- **Whole-line expected-answer anchoring with an `EXPECTED_TRUNCATED` class** (lineage iteration 4). Eliminated for now: about a dozen candidate blocks and one known fire do not earn a new comparator (R9).
- **Executing scenarios in a runner.** Ruled out by the spec: no new services or runners.
- **Editing the scanner to host playbook or catalog rules.** Eliminated in favour of two small in-place changes to it (R4, R5); hosting format rules there would widen its blast radius.

## Divergence Map

- Saturated directions: none recorded by the reducer.
- Pivots taken: none. Convergence mode was `default`; no divergent pivot ran.
- Pivot failures and audited overrides: none.
- Remaining frontier: the CI-wiring decisions in R1 and R2, the `.pi/extensions` playbook trees outside the validator's root, and the scanner's 219 unresolved citations after R4.

---

## 7. Corrections to the Lineage

- **Token-at-line already exists.** Iterations 3, 6, 7 and 9 designed a token-at-line check as new work. The scanner already has `flagByIdentifierOverlap` (`classifier-cite-drift-scan.mjs:118`) and a model-backed `--advise` that already flags `code-standards-alignment.md:76`. [VERIFIED]
- **`--advise` is not model-free.** Iteration 1 grouped `--advise` with the scanner's zero-model default run. The `--advise` output carries a classifier probability (p_yes 0.12), and the scanner's header says it stays silent without a stored Jev credential. [VERIFIED]
- **Why `memory/save.md` passes.** Iteration 7 called it the one candidate move drift in the existence tier but did not say why the validator misses it. The mechanism is the two-column table skip at `validate_catalog_package.py:306`. [VERIFIED]
- **Where the diagram command went.** Iteration 10 reported `create-diagram-*.yaml` absent. The command moved to `.skilled/commands/design/` with `diagram-auto.yaml` and `diagram-confirm.yaml`, so this is move drift, not a deletion. [VERIFIED]
- **The scanner finds live drift today.** No iteration ran the scanner's census. Its two past-end anchors in `iteration-citation-jsonl.md` are new to this synthesis. [VERIFIED]
- **Corpus numbers.** Iteration 8's 2,682-file denominator and 1,271 prefixed links did not reproduce; iteration 9 corrected them to 1,465 files in 57 trees, which the orchestrator confirmed. [VERIFIED]
- **Executor provenance in the state log.** The workflow patches each iteration record with an `executor` block by direct write, and the gateway's next projection refresh drops it. Only iteration 10's record keeps it. The ten dispatch receipts still prove the route. This is a workflow defect, recorded for the deep-loop owners, not a gap in this run.

---

## 8. Open Questions

- Should R2 block from its first run or start report-only? The validator is green today, so blocking is possible; the operator decides.
- Who reads report-only output (R1, R5, R6)? The admission step's precedent (`routing-registry-drift.yml:175`) is a triaged baseline, then blocking.
- Should the `.pi/extensions` playbook trees join the validator's discovery root? UNKNOWN; it depends on whether those trees are meant to meet the operator contract.

---

## Convergence Report

- Stop reason: maxIterationsReached (stop policy max-iterations; convergence was telemetry only)
- Total iterations: 10
- Questions answered: 5 / 5
- Remaining questions: 0
- newInfoRatio by iteration: 0.82, 0.68, 0.57, 0.56, 0.55, 0.35, 0.50, 0.50, 0.60, 0.70
- Last 3 iteration summaries: run 8: playbook citation surface and option attribution (0.50); run 9: corpus denominator and ladder corrections (0.60); run 10: fresh-skill ladder and catalog anchor census (0.70)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded

---

## References

- Iterations: `iterations/iteration-001.md` to `iterations/iteration-010.md`
- Resource map: `resource-map.md`
- Rule: `.skilled/repo-rules/prevent-overengineering.md`
- Prior cases: `specs/sk-code/011-sk-code-poinytail-based-refinement/018-create-sh-unknown-options/spec.md`, `specs/sk-code/011-sk-code-poinytail-based-refinement/016-residual-closeout/003-admission-gold/spec.md`
