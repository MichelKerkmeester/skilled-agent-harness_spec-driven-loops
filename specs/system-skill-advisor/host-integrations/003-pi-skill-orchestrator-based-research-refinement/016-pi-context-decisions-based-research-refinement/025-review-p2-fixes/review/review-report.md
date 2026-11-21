---
title: "Deep Review Report: review P2 fixes"
description: "Four-iteration deep review of the 025 fix packet after a one-iteration extension: verdict PASS with advisories, no P0 or P1, one active P2, seven earlier P2 findings resolved at dfdaee3a064, SL4-005 fixture realism ruled out."
trigger_phrases:
  - "review p2 fixes review report"
  - "025 deep review report"
importance_tier: normal
contextType: review
---

# Deep Review Report: review P2 fixes

Path shorthand used below: `T` is `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs`, `V` is `.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts`, `024/` and `025/` are the sibling packets under `016-pi-context-decisions-based-research-refinement/`, `005/` is `024/005-shared-embeddings-package/`, and `R` is this `review/` folder. Line numbers for `T` and `V` are at `dfdaee3a064` unless a row says otherwise.

## 1. Executive Summary

- **Verdict:** PASS
- **hasAdvisories:** true (the verdict is PASS and one P2 is active)
- **Counts the verdict used:** P0 0, P1 0, P2 1, search debt 0. These are the active counts in `deep-review-findings-registry.json` (`findingsBySeverity`, `openFindingsCount: 1`, `searchDebt: []`).
- **Gates:** no required gate failed. The last `terminal_gates` event in `deep-review-state.jsonl` records stop reason `maxIterationsReached` and `failedRequiredGateIds: []`. Evidence passed (`all-findings-cited`), scope passed (`all-findings-in-scope`) and coverage passed (`coverage-complete`). Registry traceability summary: 3 required, 3 pass, 0 partial, 0 gating failures, and `unfinishedCoreProtocols` is empty.
- **Why the earlier run was FAIL:** the three-iteration run, kept as `R/review-report-v1-r3.md`, failed the coverage gate (`traceability-incomplete`) because the two hard core protocols, `spec_code` and `checklist_evidence`, both ended partial. The fixes in `dfdaee3a064` cleared it. Iteration 4 reran both protocols against that commit and recorded both as pass.
- **Resolved:** the seven earlier P2 findings, R1-P2-001, R1-P2-002, R2-P2-001 and R3-P2-001 to R3-P2-004, were resolved in iteration 4 against `dfdaee3a064`. Section 3 lists each with its evidence.
- **Active:** one P2, R4-P2-001, at `025/spec.md:201`. The complexity table's risk row said repo mode gates every push. Disposition: fixed in the working tree after the stop, unverified by a review iteration.
- **Self-check outcomes:** there were no P0 or P1 findings, so the adversarial self-check had nothing to adjudicate. The four `claim_adjudication` events in the state log (runs 1 to 4) each record `activeP0P1: 0` and `passed: true`. No finding was confirmed, downgraded or called a false positive.
- **Scope:** `025-review-p2-fixes` as a spec folder. Iterations 1 to 3 reviewed HEAD `1d1bfadab67`. Iteration 4 reviewed HEAD `dfdaee3a064`, the follow-up fix commit. That covers the 025 packet docs, the code and test fixes in `T` and `V`, the workflow, catalog and README wording, and the 024 and 005 docs the fixes touched. Four iterations ran on the native `@deep-review` executor under a convergence stop policy: three in the original run and one from a `--extend=1` extension (`lineageMode` `completed-continue`, `continuedFromRun` 3), which raised the cap from 3 to 4. The run stopped at the cap after 4 iterations. Dimension coverage is 1.0: correctness, security, traceability and maintainability are all covered.
- **SL4-005 disposition:** `fixture_realism` is ruled out. Section 8 and section 9 give the evidence.
- **Operator review focus:** Replay the seven P2 findings of iterations 1 to 3 against commit dfdaee3a064 and mark each resolved or still active, then rerun the core traceability protocols spec_code and checklist_evidence over the 025 packet docs and record each as pass, partial or fail with evidence.

## 2. Planning Trigger

`/speckit:plan` is not required. The verdict is PASS, no gate failed, and the one advisory is already reworded in the working tree. This run verified fixes inside an existing packet, so the next step is `/create:changelog`, or none. The `spec.md:201` rewording is committed together with this report.

```json
{
  "Planning Packet": {
    "triggered": false,
    "verdict": "PASS",
    "hasAdvisories": true,
    "activeFindings": [
      {"id": "R4-P2-001", "severity": "P2", "file": "025/spec.md:201", "disposition": "fixed in the working tree after the stop, unverified by a review iteration"}
    ],
    "remediationWorkstreams": [
      "WS-1 P2 advisory: commit the spec.md:201 risk-row rewording with this report (R4-P2-001)"
    ],
    "specSeed": [
      "The 025 complexity table states the real repo-mode trigger: every pull request and pushes to main and skilled/**"
    ],
    "planSeed": [
      "Commit the reworded 025/spec.md:201 together with review/review-report.md",
      "Optionally confirm with rg -n 'every push' over the 025 docs that only quoting or site-naming lines remain",
      "Next step: /create:changelog, or none"
    ],
    "findingClasses": [
      "doc-to-config drift"
    ],
    "affectedSurfacesSeed": [
      "025/spec.md"
    ],
    "fixCompletenessRequired": false,
    "searchDebt": []
  }
}
```

`fixCompletenessRequired` is false because no gate depends on R4-P2-001. Every required gate already passed with the finding active.

## 3. Active Finding Registry

Titles, severities, files and lines come from the registry. The registry holds `findingClass`, `scopeProof` and `affectedSurfaceHints` as null or empty for R4-P2-001, so those come from `findingDetails` in iteration 4's record in `deep-review-state.jsonl`. The finding is `active` in the registry, and the verdict counts it. The registry has no disposition field, so the disposition below comes from the orchestrator's record of the working-tree edit.

**Dimension mismatch:** the registry tags R4-P2-001 `correctness`, while `findingDetails` records it as `traceability`. The table shows both values.

| ID | Sev | Dimension (registry / details) | Title | file:line | Fix | Disposition | Class |
|----|-----|-------------------------------|-------|-----------|-----|-------------|-------|
| R4-P2-001 | P2 | correctness / traceability | The 025 spec's complexity table still says repo mode gates every push, the claim REQ-005 removes from the three named sites | `025/spec.md:201` | Reword the risk row to state the real trigger | Fixed in the working tree after the stop, unverified by a review iteration | doc-to-config drift |

**Evidence, impact, scope proof and surfaces:**

- **Evidence:** at `dfdaee3a064` the risk row read "repo mode gates every push and pull request". The workflow trigger is `push: branches: [main, 'skilled/**']` plus `pull_request` (`.github/workflows/advisory-checks.yml:2-6`). The workflow comment (`:25`), `retrieval/README.md:25` and catalog `:19` already say so. REQ-005 (`025/spec.md:128`) scopes its fix to three sites, so REQ-005 is met, and this line sits outside them (`iteration-004.md:50`). `spec.md:39` also says "every push", but it describes what the 024 review found, so it is not drift.
- **Impact:** a reader of the complexity table expects a push to a feature branch outside `skilled/**` to run the lane-residue gate, and it does not.
- **Scope proof:** a grep for `every push` over the five 025 docs matches `spec.md:39` and `:201`, plus `plan.md:83` and `:88`, `tasks.md:57-59` and AC-015 (`acceptance-criteria.md:68`). Those other matches name the sites to reword or quote the old claim. Only `spec.md:201` stated the trigger as a present fact.
- **Affected surface hints:** `025/spec.md:201`.
- **Current working-tree text, not review evidence:** the row now reads "The apply path deletes files, and repo mode gates every pull request and pushes to `main` and `skilled/**`". The orchestrator made this edit after the stop. It is uncommitted and will be committed with this report. No review iteration has checked it.

**Resolved findings.** All seven were resolved in iteration 4 against `dfdaee3a064` (`iteration-004.md:28-34`). The registry lists each with `status: resolved`, and iteration 4's `resolvedFindings` names all seven.

| ID | Original location | Iteration 4 evidence at `dfdaee3a064` |
|----|-------------------|---------------------------------------|
| R1-P2-001 | `T:202` (at `1d1bfadab67`) | `NODE_VALUE_OPTIONS` at `T:206` now lists `--env-file`, `--inspect-port` and 37 other value options, and `nodeScriptOf` skips their value at `T:1279`. A probe printed `/x/.skilled/bin/hf-model-server.cjs true` for `node --env-file cfg.vars /x/.skilled/bin/hf-model-server.cjs`, and the same for `--inspect-port 9230`. Both are rows of the table at `V:901-902`. An option left off the list still misreads (`node --test-reporter spec ...` printed `spec false`). The constant's comment and Known Limitation 4 document that residual, so it was not refiled. |
| R1-P2-002 | `005/goal.md:57` | `005/goal.md:57-62` ticks all six criteria, and the log gains a `Completion criteria \| Complete` row at `:80`. Criterion 4 was narrowed to exclude the residue check and its test, and `git grep -l "@huggingface/transformers" -- ':!specs'` lists exactly those two files. `005/tasks.md:103` T054 names phase commit `1f85a9dd6dd`. |
| R2-P2-001 | `T:1996` (at `1d1bfadab67`) | The case `refuses to delete a model server file through a linked IPC folder` (`V:1136`) sets `SPECKIT_IPC_SOCKET_DIR` to a link and asserts that the file survives and that a `refused` action carries `its directory is a symlink`. That string is produced only by the `isSymlink(dir)` guard at `T:2011`. The `resolveContainedTarget` comment (`T:1711`) now says a linked root passes. The Vitest file ran 106 of 106, exit 0. |
| R3-P2-001 | `024/goal.md:91` | T022 (`025/tasks.md:64`), AC-018's Observed cell, `025/implementation-summary.md:64`, `:78`, `:123` and Known Limitation 2 (`:154`) all say five ticks and two log rows, with criterion 4 resting on dispositions. That matches `024/goal.md:91` and log rows `:112-113`. A grep for `stays unticked` and `four of its five` prints nothing. |
| R3-P2-002 | `025/implementation-summary.md:145` | `025/implementation-summary.md:75` and `025/spec.md:99` hold a README row, and `:94` names `1d1bfadab67` and the README rewording. The README Known Limitation is gone. CHK-FIX-007 (`025/tasks.md:174`) no longer says the commit does not exist and is left open until the final pin. A grep for `Nothing is committed`, `does not exist yet` and `is reported, not changed` prints nothing. |
| R3-P2-003 | `025/implementation-summary.md:144` | Known Limitation 4 (`025/implementation-summary.md:156`) now cites `node --test-reporter spec ...`, which the probe confirms still reads `spec`. NFR-P01 (`025/spec.md:172`) names the `fs.statSync` in `isFileOnDisk` (`T:1303`), and its count of reads matches `checkModelServer` and `isOwnedModelServer` (`T:1336-1338`). |
| R3-P2-004 | `025/tasks.md:172` | `rg -n '\b[TV]:[0-9]+'` over the five packet docs prints nothing. The checklist now cites test titles and function names: CHK-031 (`025/tasks.md:183`) names the regular-file case by title, and CHK-FIX-003 (`:170`) names `checkDotenv` and its caller. |

## 4. Remediation Workstreams

There is no P0 or P1 work, and no gate depends on the remaining item.

1. **WS-1 P2 advisory, R4-P2-001:** commit the `025/spec.md:201` rewording with this report. The edit is already in the working tree. A later review iteration, if one runs, would move the finding to resolved.

## 5. Spec Seed

- The 025 complexity table states the real repo-mode trigger: every pull request and pushes to `main` and `skilled/**`. The working tree already holds this wording.

## 6. Plan Seed

`/speckit:plan` is not required. These are the remaining starter tasks.

- Commit the reworded `025/spec.md:201` together with `review/review-report.md`.
- Optionally run `rg -n 'every push'` over the 025 docs to confirm that only lines quoting the old claim or naming the reworded sites remain.
- Next step: `/create:changelog`, or none, since this run is a fix verification inside an existing packet.

## 7. Traceability Status

**Core protocols** (both hard gates)

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | pass | `T:206`, `:1279`, `:1303`, `:2011`; `V:901`, `:1136`; `025/spec.md:119-135`, `:172`; `advisory-checks.yml:2-6`; `retrieval/README.md:25` | None in a requirement. REQ-001 to REQ-011 hold at `dfdaee3a064`, and REQ-012 is this review's own outcome. NFR-P01 now matches the code. R4-P2-001 sits in the complexity table's risk row, not in a requirement, so it does not make the protocol partial. |
| `checklist_evidence` | pass | `025/tasks.md:64`, `:87-94`, `:170`, `:174`, `:183`; AC-018 row; `005/goal.md:57-62`; `024/goal.md:91`, `:112-113` | None. Each checked row's evidence was matched to HEAD. Vitest printed `Tests 106 passed (106)`, exit 0. No `T:` or `V:` pin is left. T034, CHK-020 and CHK-FIX-007 are honestly open and wait on this review and the final pin. |

Registry summary: required 3, executed 3, pass 3, partial 0, fail 0, gatingFailures 0. `unfinishedCoreProtocols`: none.

**Overlay protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| `feature_catalog_code` | pass (advisory) | Catalog `lane-residue-gate-and-cleanup.md:19`, `:27` state the real trigger and the whole-file allowlist limit. Passed in iteration 3. Iteration 4 did not rerun it, and `dfdaee3a064` did not change the catalog. |
| `skill_agent` | not run | Not run for budget (`iteration-003.md:112`). |
| `agent_cross_runtime` | not run | Not run for budget (`iteration-003.md:112`). |
| `playbook_capability` | not run | Not run for budget (`iteration-003.md:112`). |

`AC_COVERAGE`: pass. In the working tree, 24 of 24 rows in `025/acceptance-criteria.md` read Met. The floor is UNKNOWN because the reducer recorded none. AC-024 (`025/acceptance-criteria.md:77`) asks for a follow-up review that records a verdict and SL4-005's disposition. Its Met mark rests on this report.

`resource-map.md` was not present at init (`resource_map_present: false`), so no Resource Map Coverage Gate ran. `R/resource-map.md` was emitted from the deltas at the end of iteration 3 and does not include iteration 4.

## 8. Deferred Items

- **SL4-005 `fixture_realism` (from the 024 report): ruled out, not deferred.** Iteration 1 recorded the evidence (`iteration-001.md:96`, ledger row SL1-003). The only branch whose behavior depends on a file being a socket was tested both ways at `1d1bfadab67`: a real socket bound with `net.createServer().listen(custom)` and asserted with `lstatSync(custom).isSocket()` (`V:914-922`), and a regular file that is kept (`V:936-955`). The fixed names are type-agnostic by design (`T:1368-1370`). Iteration 3 rechecked the citations without searching again (ledger row SL3-006), and iteration 4 recorded the class as exhausted and did not search it again. Those line numbers are as recorded at `1d1bfadab67`.
- **The unlisted-option residual of R1-P2-001:** a node value option left off `NODE_VALUE_OPTIONS` still misreads the script. It is documented in the constant's comment and in Known Limitation 4, and no known launcher passes such an option, so iteration 4 did not refile it.
- **R4-P2-001 re-verification:** the working-tree rewording has not been checked by a review iteration.

## Dimension Expansion Map

No divergent pivot ran. The registry `divergence` block is empty: `saturatedDirections`, completed pivots, failed pivots, audited overrides and `remainingFrontier` are all `[]`, and `currentFocus` is empty. No Council artifact exists. The selected review directions were correctness (iteration 1), security (iteration 2), traceability with maintainability combined (iteration 3), and traceability for the fix replay (iteration 4). This section records breadth only and does not change the verdict.

## 9. Search Ledger

- `searchCoverage` (iteration 4's set): required bug classes `input_parsing`, `completion_metadata`, `destructive_path` and `doc_drift`. Covered: `doc_drift`. Ruled out: `input_parsing`, `completion_metadata`, `destructive_path`. Deferred and blocked: none. Graph coverage mode is `graphless_fallback`.
- `candidateCoverage`, as stored:
  - Covered: `completion_state_drift`, `doc_code_drift`, `doc_commit_drift`, `doc_drift`, `input_parsing`, `stale_evidence_pin`, `symlink_redirect`.
  - Ruled out: `comment_hygiene`, `completion_metadata`, `destructive_path`, `doc_drift`, `false_negative_status`, `fixture_realism`, `input_parsing`, `path_containment`, `remote_destructive_call`, `secret_exposure`, `toctou`.
  - Deferred and blocked: none.
  - `input_parsing` and `doc_drift` appear in both lists. Each class was covered by a finding in one iteration and ruled out at HEAD in iteration 4.
- `ruledOutCandidates` and `cleanSearchProof` (13 rows each):
  - SL1-003 `fixture_realism`: real socket at `V:914-922`, regular file at `V:936-955`, fixed names type-agnostic at `T:1368-1370`.
  - SL1-004 `destructive_path`: the 024 R2-P2-001 fix holds; guard at `T:1371` plus `V:936-955`.
  - SL1-005 `false_negative_status`: the 024 R9-P2-001 fix holds; `T:1563`, `V:749-762`.
  - SL2-002 `path_containment`: containment holds for links under a root; `T:1721`, `V:1197-1209`.
  - SL2-003 `toctou`: no trust boundary is crossed; `T:1371`.
  - SL2-004 `secret_exposure`: value-free by construction; `T:1546`, `:846`.
  - SL2-005 `remote_destructive_call`: consent gated; `T:1852`.
  - SL3-005 `comment_hygiene`: comments are accurate and id-free; `T:1368`, `:1561`.
  - SL3-006 `fixture_realism`: rechecked citations only; `V:914`, `:922`.
  - SL-401 `input_parsing`: R1-P2-001 fixed at HEAD; `T:206`, `:1279`, `V:901`.
  - SL-402 `completion_metadata`: R1-P2-002 fixed at HEAD; `005/goal.md:57`.
  - SL-403 `destructive_path`: R2-P2-001 fixed at HEAD; `V:1136`, `T:2011`.
  - SL-404 `doc_drift`: R3-P2-001 to R3-P2-004 fixed at HEAD; `025/tasks.md:64`, `025/implementation-summary.md:94`, `:156`, `025/spec.md:172`.
- The SL1 to SL3 rows cite line numbers at `1d1bfadab67`. The SL-401 to SL-404 rows cite `dfdaee3a064`. SL4-005 is the 024 report's row ID and is distinct from iteration 4's SL-4xx IDs.
- Finding rows: SL1-001 (R1-P2-001), SL1-002 (R1-P2-002), SL2-001 (R2-P2-001), SL3-001 to SL3-004 (R3-P2-001 to R3-P2-004), and SL-405 (R4-P2-001).
- `searchDebt`: empty. hasSearchDebt: false.

## 10. Audit Appendix

- **Convergence:** 4 of 4 iterations, stop reason `maxIterationsReached` under the `convergence` stop policy (threshold 0.1). The cap was 3 and the `extended` event raised it to 4 (`addedIterations: 1`, `continuedFromRun: 3`). newFindingsRatio by iteration: 1, 0.333, 0.571, 0.125. Registry convergence score 0.875. No iteration errored.
- **Gate event labels:** the `graph_convergence` and `terminal_gates` events carry the label of the next run. The events labeled run 4 followed iteration 3 and recorded the coverage failure. The events labeled run 5 followed iteration 4: graph score 0.97 with decision CONTINUE, and terminal gates evidence pass, scope pass, coverage pass (`coverage-complete`). The run-5 label is not a fifth iteration.
- **Stale reducer fields:** the registry still reads `status: INITIALIZED` and `terminalStop: null`. Its `terminalGates` field and `graphConvergenceScore` (0.967) still hold the run-4 values, including `failedRequiredGateIds: ["coverage"]`. `deep-review-dashboard.md` follows them and shows a provisional FAIL with hasAdvisories false. The gate result in this report comes from the last `terminal_gates` event in `deep-review-state.jsonl`. Those files were left as they are.
- **Iteration 4's stated limits:**
  - `spec_code` passed while R4-P2-001 sat in `025/spec.md`. The protocol checks requirements, and the finding is a risk row in the complexity table, not a requirement.
  - Some prose line references in the 025 docs were not rechecked. Iteration 4 spot-checked them rather than resolving each one.
  - The guard negative control (T036) was not rerun inside the iteration. Iteration 4 rested that conclusion on a grep showing one producer of the asserted reason string. The orchestrator reports that it ran the control before the commit and that removing the guard made the case fail. That run is the orchestrator's claim and is not review evidence.
  - The state log's `config` row still shows `maxIterations` 3. `deep-review-config.json` and the iteration 4 prompt both say 4, and iteration 4 used 4.
- **Coverage:** iteration 1 correctness, iteration 2 security, iteration 3 traceability and maintainability, iteration 4 traceability. Dimension coverage 1.0 (4 of 4). Per-dimension state is in `deep-review-strategy.md`.
- **Ruled-out claims:** the ledger above, plus each iteration's Ruled Out section. Iteration 4 ruled out `spec.md:39` "every push" as drift, because it describes what the 024 review found, and kept the unlisted-option residual of R1-P2-001 out of the registry because it is documented. Earlier iterations ruled out the 005 acceptance-criteria Draft status, superseded goal-log rows, the check-to-apply type gap, printed process command lines and the Ollama host print.
- **Fix replay (operator focus):** iteration 4 replayed each of the seven P2 findings against the current files and against `git show dfdaee3a064`, not against the commit message or the packet's own claims, and marked all seven resolved (`iteration-004.md:22-36`). Iterations 1 and 3 had earlier replayed the ten 024 P2 fixes at `1d1bfadab67` (`iteration-001.md:56-67`, `iteration-003.md:26-37`).
- **Sources reviewed:** 58 `filesReviewed` entries across the four iteration records (16, 10, 13 and 19). Iteration 4 read `git show dfdaee3a064` for `T`, `V`, the 005 goal and tasks, and the 025 spec and acceptance criteria, plus the 025 tasks, implementation summary and spec, `024/goal.md`, `.github/workflows/advisory-checks.yml` and `retrieval/README.md`. It ran the Vitest file: `npx vitest run --config ../../vitest.config.ts --project cli tests/sweep-lane-residue.vitest.ts` from `runtime/cli`, exit 0, `Tests 106 passed (106)`.
- **Prior report:** the three-iteration report is kept as `R/review-report-v1-r3.md` (verdict FAIL on the coverage gate, P2 7).
- **Cross-reference appendix:**
  - **Core Protocols:** `spec_code` (pass), `checklist_evidence` (pass). Details are in section 7.
  - **Overlay Protocols:** `feature_catalog_code` (pass), `skill_agent` (not run), `agent_cross_runtime` (not run), `playbook_capability` (not run). Details are in section 7.
