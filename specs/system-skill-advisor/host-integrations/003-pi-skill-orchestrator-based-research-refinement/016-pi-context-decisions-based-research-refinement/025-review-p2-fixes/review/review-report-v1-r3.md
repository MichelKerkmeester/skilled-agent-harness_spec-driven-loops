---
title: "Deep Review Report: review P2 fixes"
description: "Three-iteration deep review of the 025 fix packet: verdict FAIL on the coverage gate, no P0 or P1, seven P2 findings, SL4-005 fixture realism ruled out."
trigger_phrases:
  - "review p2 fixes review report"
  - "025 deep review report"
importance_tier: normal
contextType: review
---

# Deep Review Report: review P2 fixes

Path shorthand used below: `T` is `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs`, `V` is `.skilled/skills/system-spec-kit/runtime/cli/tests/sweep-lane-residue.vitest.ts`, `024/` and `025/` are the sibling packets under `016-pi-context-decisions-based-research-refinement/`, `005/` is `024/005-shared-embeddings-package/`, and `R` is this `review/` folder.

## 1. Executive Summary

- **Verdict:** FAIL
- **hasAdvisories:** false (the verdict is not PASS, so the flag stays false)
- **Counts the verdict used:** P0 0, P1 0, P2 7, search debt 0. These are the active counts in `deep-review-findings-registry.json` (`findingsBySeverity`, `searchDebt: []`).
- **Why FAIL:** the verdict comes from a failed required gate, not from severity. No finding is P0 or P1. The `terminal_gates` event in `deep-review-state.jsonl` (run 4) records stop reason `maxIterationsReached` and `failedRequiredGateIds: ["coverage"]`, with reasonCode `traceability-incomplete`. The evidence gate (`all-findings-cited`) and the scope gate (`all-findings-in-scope`) passed.
- **Cause of the coverage failure:** the two hard core protocols, `spec_code` and `checklist_evidence`, both ended `partial`. Registry `traceability.summary.gatingFailures` is 2, and `unfinishedCoreProtocols` lists both. The two partial protocols match the four 025 documentation-drift findings, R3-P2-001 to R3-P2-004 (section 7 maps each one). Fixing them and re-running traceability should clear the gate. Two caveats. First, the `checklist_evidence` summary also names AC-024 as Unmet. Whether that alone keeps the protocol partial on a re-run is UNKNOWN, so mark AC-024 Met in the same fix pass; this report supplies its verdict and SL4-005 disposition. Second: in iterations 1 and 2, `spec_code` was also partial because of REQ-009, which is R1-P2-002 (`iteration-001.md:71`, `iteration-002.md:40`). A re-run that checks REQ-009 again stays partial unless R1-P2-002 is fixed too, so this report recommends fixing all seven.
- **Self-check outcomes:** there were no P0 or P1 findings, so the adversarial self-check had nothing to adjudicate. The three `claim_adjudication` events in the state log (runs 1 to 3) each record `activeP0P1: 0` and `passed: true`. No finding was confirmed, downgraded or called a false positive.
- **Per-iteration verdict lines:** each iteration file ends `Review verdict: PASS`. That line covers only the findings of that pass. It does not reflect the terminal coverage gate, which ran after iteration 3.
- **Scope:** `025-review-p2-fixes` as a spec folder, reviewed at HEAD `1d1bfadab67` (the fix commit). That covers the 025 packet docs, the code and test fixes in `T` and `V`, the workflow, catalog and README wording, and the 024 docs the fixes touched. Three iterations ran on the native `@deep-review` executor under a convergence stop policy with a cap of 3, and stopped at the cap after 3 iterations. Dimension coverage is 1.0: correctness, security, traceability and maintainability are all covered.
- **SL4-005 disposition:** ruled out. Section 8 and section 9 give the evidence.
- **Operator review focus:** Replay each of the ten P2 fixes from 024-ollama-lane-removal/review/review-report.md against the code, and finish the deferred fixture_realism search: do the residue tests bind real sockets where the behavior depends on a socket.

## 2. Planning Trigger

`/speckit:plan` is required, or the existing 025 packet can carry the work. The FAIL is a gate failure, and it clears only when the documentation drift is fixed and traceability is re-run. Fix the seven P2 findings, then run a one-iteration `/deep:review --extend=1` for traceability.

```json
{
  "Planning Packet": {
    "triggered": true,
    "verdict": "FAIL",
    "hasAdvisories": false,
    "activeFindings": [
      {"id": "R3-P2-001", "severity": "P2", "file": "024/goal.md:91"},
      {"id": "R3-P2-002", "severity": "P2", "file": "025/implementation-summary.md:145"},
      {"id": "R3-P2-003", "severity": "P2", "file": "025/implementation-summary.md:144"},
      {"id": "R3-P2-004", "severity": "P2", "file": "025/tasks.md:172"},
      {"id": "R1-P2-002", "severity": "P2", "file": "024/005-shared-embeddings-package/goal.md:57"},
      {"id": "R1-P2-001", "severity": "P2", "file": ".skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:202"},
      {"id": "R2-P2-001", "severity": "P2", "file": ".skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs:1996"}
    ],
    "remediationWorkstreams": [
      "WS-1 025 documentation drift (clears the coverage gate): R3-P2-001, R3-P2-002, R3-P2-003, R3-P2-004, plus marking AC-024 Met",
      "WS-2 phase 005 completion residue (REQ-009): R1-P2-002",
      "WS-3 residue tool hardening: R2-P2-001, R1-P2-001"
    ],
    "specSeed": [
      "025 docs describe the committed tree at 1d1bfadab67, including the README.md:25 rewording and all five 024 goal ticks",
      "NFR-P01 names every new filesystem call, including the statSync through isFileOnDisk",
      "Every evidence line pin in 025 tasks, checklist and criteria resolves to the cited test or function at the pinned commit",
      "Phase 005 goal criteria and T054 read Complete, matching 005 spec.md and the goal log"
    ],
    "planSeed": [
      "Reconcile T022, AC-018 and implementation-summary :64, :111, :142 with the five ticks and two log rows in 024/goal.md",
      "Drop Known Limitation 5, add the README row to Files Changed, and update :93 and CHK-FIX-007",
      "Rewrite Known Limitation 4 around an unlisted option and amend NFR-P01",
      "Re-pin the stale T: and V: references, then pin them to the commit",
      "Tick 005/goal.md:57-62 and drop the stale clause at 005/tasks.md:103",
      "Add an apply test for a linked server folder and narrow the T:1688-1690 comment",
      "Widen NODE_VALUE_OPTIONS or narrow the T:1252-1253 comment",
      "Mark AC-024 Met, citing review/review-report.md for the verdict and SL4-005's disposition"
    ],
    "findingClasses": [
      "completion-metadata drift",
      "doc-to-commit drift",
      "doc-code drift",
      "stale evidence pins",
      "input-parsing edge case",
      "security test gap on a destructive path plus an overbroad doc promise"
    ],
    "affectedSurfacesSeed": [
      "025/tasks.md",
      "025/acceptance-criteria.md",
      "025/implementation-summary.md",
      "025/spec.md",
      "024/goal.md",
      "024/005-shared-embeddings-package/goal.md",
      "024/005-shared-embeddings-package/tasks.md",
      "sweep-lane-residue.mjs",
      "sweep-lane-residue.vitest.ts"
    ],
    "fixCompletenessRequired": true,
    "searchDebt": []
  }
}
```

`fixCompletenessRequired` is true because the coverage gate clears only when every partial protocol passes, and a partial fix leaves at least one protocol partial.

## 3. Active Finding Registry

Titles, severities, files and lines come from the registry. The registry holds `findingClass`, `scopeProof` and `affectedSurfaceHints` as null or empty, so those come from `findingDetails` in `deep-review-state.jsonl`. Every finding is `active`. The registry has no disposition field, so the disposition fix is this report's recommendation.

**Dimension mismatch:** the registry tags six findings `correctness`, but `findingDetails` records R1-P2-002, R3-P2-001, R3-P2-002 and R3-P2-004 as traceability and R3-P2-003 as maintainability. The table shows both values. This is why the dashboard shows 0 open findings under traceability and maintainability.

| ID | Sev | Dimension (registry / details) | Title | file:line | Fix | Class |
|----|-----|-------------------------------|-------|-----------|-----|-------|
| R3-P2-001 | P2 | correctness / traceability | The 025 docs say the 024 goal's criterion 4 stays unticked, but the commit ticks all five criteria and adds two log rows | `024/goal.md:91`, `:112-113`; `025/tasks.md:64`; `025/acceptance-criteria.md:71`; `025/implementation-summary.md:64`, `:111`, `:142` | Make T022, AC-018 and the summary match the committed goal, or amend criterion 4 with a decision record entry | completion-metadata drift |
| R3-P2-002 | P2 | correctness / traceability | The implementation summary describes the tree before the commit: it says README.md:25 was left unchanged and that nothing is committed | `025/implementation-summary.md:145`, `:68-83`, `:93`; `025/tasks.md:163`; `025/spec.md:92-105` | Drop Known Limitation 5, add the README row, and state the commit | doc-to-commit drift |
| R3-P2-003 | P2 | correctness / maintainability | The 025 docs did not follow the independent review fix: Known Limitation 4 cites an example the code now handles, and NFR-P01 names a single lstat as the only new filesystem call | `025/implementation-summary.md:144`; `025/spec.md:171`; `T:202`, `:1266-1268`, `:1276`, `:1290-1296`, `:1323-1327` | Rewrite Limitation 4 around an unlisted option such as `--env-file`, and amend NFR-P01 to name `isFileOnDisk` | doc-code drift |
| R3-P2-004 | P2 | correctness / traceability | The evidence line references in the 025 tasks, checklist and criteria do not match HEAD, and some land on a different test or function | `025/tasks.md:172`, `:159`, `:47-53`, `:157-172`; `025/acceptance-criteria.md:55`, `:54-58`, `:63`; `025/spec.md:83`; `025/implementation-summary.md:70` | Re-pin each reference (for example V:931 to V:936, T:1637 to T:1531 or T:1668) before pinning to the commit | stale evidence pins |
| R1-P2-002 | P2 | correctness / traceability | Phase 005 goal still reads unstarted: six completion criteria unticked and T054 says no phase commit exists | `024/005-shared-embeddings-package/goal.md:57-62`, `:79`; `005/spec.md:36`; `005/tasks.md:103`; `025/tasks.md:61` | Tick each criterion whose check holds and drop the "no phase commit exists yet" clause | completion-metadata drift |
| R1-P2-001 | P2 | correctness / correctness | nodeScriptOf reads the value of an unlisted node option as the script, so a model server launched with one is missed | `T:202`, `:1252-1253`, `:1267-1269`, `:1350`, `:1994-2001` | Widen `NODE_VALUE_OPTIONS` to node's value-taking options, or narrow the doc comment to the seven it checks | input-parsing edge case |
| R2-P2-001 | P2 | security / security | The linked-server-folder refusal is the only guard against a redirected delete there, and no test reaches it | `T:1996`, `:1995-2000`, `:1714-1715`, `:1688-1690` | Add an apply test with a linked `SPECKIT_IPC_SOCKET_DIR`, and narrow the comment or move the refusal into `resolveContainedTarget` | security test gap on a destructive path plus an overbroad doc promise |

**Evidence, impact, scope proof and surfaces per finding:**

- **R3-P2-001.** Evidence: in `1d1bfadab67`, criterion 4 changes from `[ ]` to `[x]` at `024/goal.md:91`, and the log gains row `:112` ("Criterion 4 open") and row `:113` ("Criterion 4 | Complete"). A grep of `024/decision-record.md` for `criterion 4`, `C-08` or `BAT-01` returns nothing (`iteration-003.md:58-64`). Impact: AC-018's Observed cell claims four ticks and one row where the goal holds five ticks and two rows that disagree. Scope proof: `git show 1d1bfadab67` on `024/goal.md` shows five `+- [x]` lines and two added log rows, and the 025 rows were committed in the same commit. Surfaces: `025/tasks.md:64`, `025/acceptance-criteria.md:71`, `025/implementation-summary.md:64`, `:111`, `:142`, `024/goal.md:91`.
- **R3-P2-002.** Evidence: the commit stat shows `README.md | 2 +-`, and `README.md:25` now holds the new wording, while Known Limitation 5 says it is "reported, not changed". `:93` says "Nothing is committed", and CHK-FIX-007 (`025/tasks.md:163`) says the commit does not exist yet (`iteration-003.md:70-78`). Impact: an operator who reads Limitation 5 opens a follow-up for a line already reworded. Scope proof: `git show --stat 1d1bfadab67` lists `retrieval/README.md` and the 025 docs. Surfaces: `025/implementation-summary.md:68`, `:93`, `:145`, `025/tasks.md:163`, `025/spec.md:92`.
- **R3-P2-003.** Evidence: `-r` is in `NODE_VALUE_OPTIONS` (`T:202`), and a probe returned `nodeScriptOf('node -r foo /p/hf-model-server.cjs') = /p/hf-model-server.cjs` with `runsModelServer` true. `isFileOnDisk` adds `fs.statSync` (`T:1276`, `:1290-1296`), which NFR-P01 does not name (`iteration-003.md:80-89`). Impact: a test written from Limitation 4 fails against HEAD. Scope proof: `isFileOnDisk` has one caller, `nodeScriptOf`, and `NODE_VALUE_OPTIONS` is defined once. Surfaces: `025/implementation-summary.md:144`, `025/spec.md:171`, `T:202`, `T:1276`. This finding is about documentation and does not refine R1-P2-001.
- **R3-P2-004.** Evidence: CHK-031 and AC-002 cite V:931 for the regular-file case, but V:931 is now the `finally` of the socket test and the case is at V:936. CHK-FIX-003 cites T:1637, which is `machineExitCode`. `checkDotenv` is at T:1531 and is called at T:1668 (`iteration-003.md:91-102`). Impact: a reviewer who follows a pin reads the wrong code. Scope proof: a grep of definitions at HEAD; the check ran against HEAD only, not against `bf3bca7a8b1`. Surfaces: `025/tasks.md:47`, `:157`, `025/acceptance-criteria.md:54`, `:63`, `025/implementation-summary.md:70`, `025/spec.md:83`.
- **R1-P2-002.** Evidence: the six criteria at `005/goal.md:57-62` are `[ ]`, while `005/spec.md:36` and the log row `005/goal.md:79` read Complete and all fifteen AC rows are Met. `005/tasks.md:103` still says "no phase commit exists yet", although the commit is `1f85a9dd6dd`. 025's T019 verify (`025/tasks.md:61`) greps only `Blocked|Unmet|not committed` (`iteration-001.md:46-50`). Impact: REQ-009 is only partly met. Scope proof: limited to phase 005 `goal.md` and `tasks.md`; the other 024 phases were not re-swept. Surfaces: `005/goal.md:57`, `005/tasks.md:103`.
- **R1-P2-001.** Evidence: a live probe printed `runsModelServer("node --env-file cfg.vars /x/.skilled/bin/hf-model-server.cjs") === false` with script `cfg.vars`. The same happened for `--inspect-port 9230` (`iteration-001.md:40-44`). Impact: M4 lists no process, so machine mode can report the server absent while it runs, and apply can delete the socket and pid files under a live server. Scope proof: `nodeScriptOf` is the only producer of the script value. The retired supervisor launched plain `node <script>` (`bf6806ad4b3:.skilled/bin/lib/model-server-supervision.cjs:991`), so no known launcher sends a value option. Surfaces: `T:202`, `T:1243`, `V:891`.
- **R2-P2-001.** Evidence: a probe of `resolveContainedTarget('<scratch>/link', ['hf-embed.sock'])` with `link -> real` returned `status ok` with the target in the real folder. The four `symlinkSync` fixtures (`V:437`, `:845`, `:1201`, `:1494`) never link a server folder (`iteration-002.md:32-36`). Impact: removing the `isSymlink(dir)` check at `T:1996` leaves the suite green, and apply would then delete inside the real target of a linked `SPECKIT_IPC_SOCKET_DIR`. Scope proof: the server-folder delete at `T:1995-2000` is the only `deleteContained` caller where a linked root is unwanted. Surfaces: `V:1118`, `T:1688`, `T:1996`.

## 4. Remediation Workstreams

There is no P0 or P1 work. The seven P2 findings fall into three groups. WS-1 and WS-2 clear the coverage gate. WS-3 is advisory and does not affect the gate.

1. **WS-1 025 documentation drift:** R3-P2-001, R3-P2-002, R3-P2-003 and R3-P2-004, plus marking AC-024 Met. These are the recorded causes of the two partial protocols. Edits are to the 025 packet docs only, plus `024/goal.md` if criterion 4 is amended instead.
2. **WS-2 phase 005 completion residue:** R1-P2-002. This closes REQ-009, which kept `spec_code` partial in iterations 1 and 2. Edits are to `024/005-shared-embeddings-package/goal.md` and `tasks.md` only.
3. **WS-3 residue tool hardening (P2 advisory, code and tests):** R2-P2-001 first, because it covers a destructive path with no regression test. Then R1-P2-001.

## 5. Spec Seed

- The 025 docs describe the tree as committed in `1d1bfadab67`: the README rewording, all five 024 goal ticks and both log rows.
- NFR-P01 names each new filesystem call: the `lstat` on extra server names and the `statSync` through `isFileOnDisk`.
- Every evidence line pin in the 025 tasks, checklist and criteria resolves to the cited test or function at the pinned commit.
- The phase 005 goal criteria and T054 agree with 005 `spec.md` and the goal log.
- A linked server folder is refused at apply, and a test proves it.

## 6. Plan Seed

- Rewrite T022 (`025/tasks.md:64`), AC-018's Observed cell (`025/acceptance-criteria.md:71`) and `025/implementation-summary.md:64`, `:111`, `:142` against the committed `024/goal.md`. Alternatively, amend criterion 4 in the 024 decision record.
- Remove Known Limitation 5 (`:145`), add a `retrieval/README.md` row to Files Changed (`:68-83`) and to spec.md's Files to Change, and update `:93` and CHK-FIX-007 (`tasks.md:163`).
- Rewrite Known Limitation 4 (`:144`) around an unlisted option, and amend NFR-P01 (`spec.md:171`).
- Re-pin each stale T: and V: reference listed in `iteration-003.md:92-96`, then pin them to the commit at closure.
- Tick `005/goal.md:57-62` where the checks hold, and drop the stale clause at `005/tasks.md:103`.
- Add a vitest apply case near `V:1118-1130` with a linked `SPECKIT_IPC_SOCKET_DIR`, and narrow the comment at `T:1688-1690`.
- Widen `NODE_VALUE_OPTIONS` (`T:202`) or narrow the comment at `T:1252-1253`, with an `it.each` row at `V:891-903`.
- Mark AC-024 Met (`025/acceptance-criteria.md:77`), citing `review/review-report.md` for the verdict and SL4-005's disposition.
- Re-run traceability with `/deep:review --extend=1`.

## 7. Traceability Status

**Core protocols** (both hard gates)

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` | partial | `T:1371`, `:1564`, `:1259`, `:36`; `advisory-checks.yml:24`; `025/spec.md:171` | REQ-001, 002, 003, 005, 006 and 007 hold in code. NFR-P01's filesystem-call claim no longer holds (R3-P2-003). In iterations 1 and 2 REQ-009 was also partly met (R1-P2-002). |
| `checklist_evidence` | partial | `025/acceptance-criteria.md:71`; `025/tasks.md:172`, `:159`; `024/goal.md:91` | AC-018's observation contradicts the commit (R3-P2-001). Several line pins miss HEAD (R3-P2-004). AC-024 is honestly Unmet. CHK-FIX-007 says the commit does not exist (R3-P2-002; this report attributes it here through CHK-FIX-007, and the protocol summary does not name it). |

Registry summary: required 3, executed 3, pass 1, partial 2, fail 0, gatingFailures 2. `unfinishedCoreProtocols`: `spec_code`, `checklist_evidence`.

**Overlay protocols**

| Protocol | Status | Evidence |
|----------|--------|----------|
| `feature_catalog_code` | pass (advisory) | Catalog `lane-residue-gate-and-cleanup.md:19`, `:27` state the real trigger and the whole-file allowlist limit. |
| `skill_agent` | not run | Not run for budget (`iteration-003.md:112`). |
| `agent_cross_runtime` | not run | Not run for budget (`iteration-003.md:112`). |
| `playbook_capability` | not run | Not run for budget (`iteration-003.md:112`). |

`AC_COVERAGE`: advisory-shortfall. 23 of 24 rows are Met; the floor is UNKNOWN because the reducer recorded none. The Unmet row is AC-024 (`025/acceptance-criteria.md:77`). It asks for a follow-up review that records a verdict and SL4-005's disposition. This report records both, but the row stays Unmet until someone updates `acceptance-criteria.md`.

`resource-map.md` was not present at init (`resource_map_present: false`), so no coverage gate ran. `R/resource-map.md` was emitted from this run's deltas.

## 8. Deferred Items

- **SL4-005 `fixture_realism` (from the 024 report): ruled out, not deferred.** Iteration 1 recorded the evidence (`iteration-001.md:96`, ledger row SL1-003). The only branch whose behavior depends on a file being a socket is `T:1371`. It is tested both ways: a real socket bound with `net.createServer().listen(custom)` and asserted with `lstatSync(custom).isSocket()` (`V:914-922`), and a regular file that is kept (`V:936-955`). The fixed names are type-agnostic by design (`T:1368-1370`), so the empty regular files at `V:1032`, `:1122` and `:1134` match the code's contract. The apply delete path was proven on a real socket through the `V:905` test. Iteration 3 rechecked the citations at HEAD without searching again (`iteration-003.md:39-44`, ledger row SL3-006). The 024 row had pointed at `V:175`, a temp-dir helper, with no described defect (`iteration-001.md:83`).
- **Latent escalation triggers** recorded in `findingDetails`:
  - R3-P2-001 becomes P1 if the 008 implementation summary records no disposition for C-08 and BAT-01. Iteration 3 did not read that file, so this is UNKNOWN.
  - R1-P2-001 becomes P1 if any launcher passes a node value option as a separate word.
  - R2-P2-001 becomes P1 if the `T:1996` check is removed or another caller bypasses it.
- R3-P2-004 was checked against HEAD only, not against `bf3bca7a8b1`.
- The test-header coverage matrix (`V:4-29`) omits the new regular-file and rejected-dotenv-line cells. Iteration 3 judged this too small to file.

## Dimension Expansion Map

No divergent pivot ran. The registry `divergence` block is empty: `saturatedDirections`, completed pivots, failed pivots, audited overrides and `remainingFrontier` are all `[]`, and `currentFocus` is empty. No Council artifact exists. The selected review directions were correctness (iteration 1), security (iteration 2), and traceability with maintainability combined (iteration 3), because three iterations had to cover four dimensions. This section records breadth only and does not change the verdict.

## 9. Search Ledger

- `searchCoverage` required bug classes: `completion_state_drift`, `doc_commit_drift`, `doc_code_drift` and `stale_evidence_pin` (covered), plus `comment_hygiene` and `fixture_realism` (ruled out). Graph coverage mode is `graphless_fallback`.
- `candidateCoverage` covered: `completion_state_drift`, `doc_code_drift`, `doc_commit_drift`, `input_parsing`, `stale_evidence_pin`, `symlink_redirect`. Ruled out: `comment_hygiene`, `destructive_path`, `false_negative_status`, `fixture_realism`, `path_containment`, `remote_destructive_call`, `secret_exposure`, `toctou`. Deferred and blocked: none.
- `ruledOutCandidates` and `cleanSearchProof` (9 rows each):
  - SL1-003 `fixture_realism`: real socket at `V:914-922`, regular file at `V:936-955`, fixed names type-agnostic at `T:1368-1370`.
  - SL1-004 `destructive_path`: the 024 R2-P2-001 fix holds; guard at `T:1371` plus `V:936-955`.
  - SL1-005 `false_negative_status`: the 024 R9-P2-001 fix holds; `T:1563`, `V:749-762`.
  - SL2-002 `path_containment`: containment holds for links under a root; `T:1721`, `V:1197-1209`.
  - SL2-003 `toctou`: needs a same-user write in a bounded window, so no trust boundary is crossed; `T:1371`.
  - SL2-004 `secret_exposure`: value-free by construction; `T:1546`, `:846`.
  - SL2-005 `remote_destructive_call`: consent gated; `T:1852`.
  - SL3-005 `comment_hygiene`: comments are accurate and id-free; `T:1368`, `:1561`.
  - SL3-006 `fixture_realism`: rechecked citations only; `V:914`, `:922`.
- Finding rows: SL1-001 (R1-P2-001), SL1-002 (R1-P2-002), SL2-001 (R2-P2-001), SL3-001 to SL3-004 (R3-P2-001 to R3-P2-004).
- `searchDebt`: empty. hasSearchDebt: false.

## 10. Audit Appendix

- **Convergence:** 3 of 3 iterations, stop reason `maxIterationsReached` under the `convergence` stop policy (threshold 0.1). newFindingsRatio by iteration: 1, 0.333, 0.571. Registry convergence score 0.429. Graph convergence score 0.967 with decision CONTINUE at run 4. Graph decisions at runs 1 to 3 were STOP_BLOCKED on dimension coverage. No iteration errored. Terminal gates: evidence pass, scope pass, coverage fail (`traceability-incomplete`). The registry still reads `status: INITIALIZED` and `terminalStop: null`, so the stop and gate results here come from the `terminal_gates` event in `deep-review-state.jsonl`.
- **Coverage:** iteration 1 correctness, iteration 2 security, iteration 3 traceability and maintainability. Dimension coverage 1.0 (4 of 4). Per-dimension state is in `deep-review-strategy.md`.
- **Ruled-out claims:** the ledger above, plus each iteration's Ruled Out section. Among them: the 005 acceptance-criteria Draft status is a convention, superseded goal-log rows, the check-to-apply type gap, printed process command lines, and the Ollama host print.
- **Ten-fix replay (operator focus):** iteration 1 (`iteration-001.md:56-67`) and iteration 3 (`iteration-003.md:26-37`) replayed the ten 024 P2 fixes at HEAD. Seven hold in both passes. 024:R1-P2-001 holds for spaces, with the residual filed as R1-P2-001. In iteration 1, 024:R3-P2-002 was partial, with the residual filed as R1-P2-002. In iteration 3, 024:R3-P2-001 was partly met, with the drift filed as R3-P2-001.
- **Sources reviewed:** 39 `filesReviewed` entries across the three state records (16, 10 and 13). The passes focused on `T`, `V`, `.github/workflows/advisory-checks.yml`, the catalog page `lane-residue-gate-and-cleanup.md`, `retrieval/README.md`, the allowlist fixture, the four 025 packet docs, `024/goal.md`, and phase 005's goal, spec, tasks and acceptance criteria.
- **Cross-reference appendix:**
  - **Core Protocols:** `spec_code` (partial), `checklist_evidence` (partial). Details are in section 7.
  - **Overlay Protocols:** `feature_catalog_code` (pass), `skill_agent` (not run), `agent_cross_runtime` (not run), `playbook_capability` (not run). Details are in section 7.
