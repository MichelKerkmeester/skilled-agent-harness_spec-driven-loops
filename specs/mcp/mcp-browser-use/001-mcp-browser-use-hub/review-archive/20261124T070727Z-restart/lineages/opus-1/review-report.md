# Deep Review Report - mcp-browser-use hub epic (fan-out lineage opus-1)

## 1. Executive Summary

- **Overall verdict: FAIL.** `review-verdict.cjs` over the lineage registry and state log returned `verdict FAIL, active_p0 0, active_p1 1, active_p2 8, search_debt 0, failed_required_gate_ids ["coverage"]`. No P0 exists. The FAIL comes from the coverage gate (`traceability-incomplete`): the hard core protocols `spec_code` and `checklist_evidence` ended `partial`, because a real spec mismatch (O1-I1-P1-001) and checklist drift are still active. Without the gate failure the findings alone would map to CONDITIONAL.
- hasAdvisories: false (only set on PASS).
- Counts the verdict used: P0 = 0, P1 = 1, P2 = 8.
- Stop reason: `maxIterationsReached` (7 of 7). Release readiness: `in-progress`.
- Adversarial self-check: one active P1. The iteration-7 re-read confirmed O1-I1-P1-001 at P1 (the two `_utils.sh` copies still differ at line 160). No downgrade and no false positive, so no claim-adjudication rows were appended.
- Review scope: 470 pre-bound files (review-scope-files.txt): the 13 phase packets, the `mcp-browser-use` hub (277 files), the compiled routing lib, the advisor scorer, doctor scripts and related docs.
- Operator review focus: every phase's shipped work against its goal criteria

## 2. Planning Trigger

`/speckit:plan` is required: one active P1 and a failed coverage gate.

```json
{
  "Planning Packet": true,
  "triggered": true,
  "verdict": "FAIL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "O1-I1-P1-001", "severity": "P1", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/_utils.sh:160"},
    {"id": "O1-I1-P2-001", "severity": "P2", "dimension": "correctness", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md:327"},
    {"id": "O1-I1-P2-002", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation/goal.md:1"},
    {"id": "O1-I2-P2-001", "severity": "P2", "dimension": "security", "file": ".skilled/skills/mcp-browser-use/mcp-bladebro/scripts/install.sh:111"},
    {"id": "O1-I2-P2-002", "severity": "P2", "dimension": "security", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/scripts/install.sh:28"},
    {"id": "O1-I3-P2-001", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:146"},
    {"id": "O1-I3-P2-002", "severity": "P2", "dimension": "traceability", "file": "specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/graph-metadata.json:53"},
    {"id": "O1-I4-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/mcp-browser-use/mcp-chrome-devtools/changelog/v1.0.27.0.md:15"},
    {"id": "O1-I6-P2-001", "severity": "P2", "dimension": "maintainability", "file": ".skilled/skills/mcp-browser-use/mcp-aside-devtools/manual-testing-playbook/manual-testing-playbook.md:35"}
  ],
  "remediationWorkstreams": ["WS1 installer helper parity (O1-I1-P1-001)", "WS2 phase goal and parent metadata hygiene (O1-I1-P2-001, O1-I1-P2-002, O1-I3-P2-001, O1-I3-P2-002)", "WS3 install supply chain (O1-I2-P2-001, O1-I2-P2-002)", "WS4 release history and counts (O1-I4-P2-001, O1-I6-P2-001)"],
  "specSeed": ["Restore byte parity of the two _utils.sh copies and add the mcp-installers test to the hub's gate list"],
  "planSeed": ["Sync or revert check_node default in one _utils.sh copy; rerun node --test .skilled/bin/tests/mcp-installers.test.cjs"],
  "findingClasses": "UNKNOWN",
  "affectedSurfacesSeed": "UNKNOWN",
  "fixCompletenessRequired": true
}
```

`findingClasses` and `affectedSurfacesSeed` are UNKNOWN because the iteration state records' `findingDetails` carry only id, severity, title, file and dimension; the class and surface lines live in the iteration narratives only, and the step forbids inferring them from prose.

## 3. Active Finding Registry

| ID | Sev | Dimension | File:line | Issue | Fix |
|----|-----|-----------|-----------|-------|-----|
| O1-I1-P1-001 | P1 | correctness | `mcp-chrome-devtools/scripts/_utils.sh:160` | Phase 013 (commit 1a350b1512b) raised `check_node_version`'s default from 18 to 20 and changed the install hint in the Chrome DevTools copy only; `mcp-code-mode/scripts/_utils.sh:160` still says 18. `.skilled/bin/tests/mcp-installers.test.cjs:49` asserts byte parity, so `node --test` exits 1 (5 tests, 1 fail). This breaks 003's goal criterion 4 and 013's own REQ-006 "No hub gate regresses" (013 spec.md:130); 013's verification table never ran the test. The change bought no behavior: install.sh passes `MIN_NODE_VERSION="20"` explicitly (install.sh:30). | Change both copies together (or revert the default), then rerun the test. |
| O1-I1-P2-001 | P2 | correctness | `mcp-chrome-devtools/references/troubleshooting.md:327` | 011's criterion `rg -c 'Session target not found\|returnByValue'` expects 3; it prints 5 since 013 added lines 327 and 826. | Update 011's recorded evidence or note the later change. |
| O1-I1-P2-002 | P2 | traceability | `003-mode-relocation/goal.md`, `004-bladebro-mode/goal.md` | Both phases say Complete while every goal criterion is `[ ]`. 004's hold; four of 003's five hold, the fifth fails per O1-I1-P1-001. | Tick the boxes that hold after WS1 lands. |
| O1-I2-P2-001 | P2 | security | `mcp-bladebro/scripts/install.sh:111` | `npm install -g` runs lifecycle scripts before the SHA-256 check at :130; R-SEC-3 says verify before use. | Install with `--ignore-scripts`, verify, then run any needed scripts, or document why scripts are safe. |
| O1-I2-P2-002 | P2 | security | `mcp-chrome-devtools/scripts/install.sh:28` | Installs `browser-debugger-cli@alpha` (floating) while 013 D1 pins every documented behavior to bdg 0.6.10. | Pin `browser-debugger-cli@0.6.10` or gate on the version. |
| O1-I3-P2-001 | P2 | traceability | `spec.md:146` | Handoff row 006 -> 007 is `[Criteria TBD] \| [Verification TBD]` in a Complete parent. | Fill from 007's goal criteria. |
| O1-I3-P2-002 | P2 | traceability | `graph-metadata.json:53` | Parent says `in_progress`, last active child 012; spec.md:17,24 say next action "Start 002-hub-scaffold" and completion 0; goal.md:24 completion 0. | Refresh parent continuity and graph metadata. |
| O1-I4-P2-001 | P2 | maintainability | `mcp-chrome-devtools/changelog/v1.0.27.0.md:15` | 013 changed 36 chrome-devtools and 21 aside-devtools files (install.sh behavior included) without new versions; it rewrote the released v1.0.27.0 entry, and Aside got no entry. | Add chrome-devtools 1.0.28.0 and an Aside entry; keep released entries frozen. |
| O1-I6-P2-001 | P2 | maintainability | `mcp-aside-devtools/manual-testing-playbook/manual-testing-playbook.md:35` | Validator warns `HAND_TYPED_CENSUS (29 scenarios, 8 categories)`; correct today, drift-prone. | Derive the census or drop the number. |

Disposition of every row: active. Count note: iteration 7's narrative says "seven P2 advisories"; the registry holds 8 P2. The iteration file is write-once and is left as written; this report uses 8.

## 4. Remediation Workstreams

1. WS1 (P1): O1-I1-P1-001. Make the two `_utils.sh` copies identical; rerun `node --test .skilled/bin/tests/mcp-installers.test.cjs`.
2. P2 advisories: WS2 metadata hygiene (O1-I1-P2-001, O1-I1-P2-002, O1-I3-P2-001, O1-I3-P2-002); WS3 install supply chain (O1-I2-P2-001, O1-I2-P2-002); WS4 release history and counts (O1-I4-P2-001, O1-I6-P2-001).

## 5. Spec Seed

- A remediation child under the hub packet: restore installer helper parity and list `mcp-installers.test.cjs` among the hub gates a phase must rerun.
- Fill the parent's 006 -> 007 handoff row and refresh parent continuity.

## 6. Plan Seed

- T1: Sync `check_node_version` in both `_utils.sh` copies; run the parity test (expect 5/5).
- T2: Tick 003/004 goal boxes that hold; update 011 evidence count.
- T3: Pin bdg in install.sh; add `--ignore-scripts` ordering to the Bladebro installer.
- T4: Add chrome-devtools 1.0.28.0 and an Aside changelog entry for 013's changes.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved drift |
|----------|--------|----------|------------------|
| `spec_code` (hard) | partial | Parent criteria 1-4 re-verified; stage-two routing replays route each mode; 003 criterion 4 and 013 REQ-006 broken | O1-I1-P1-001 |
| `checklist_evidence` (hard) | partial | 009/010/013 criteria confirmed | O1-I1-P2-001, O1-I1-P2-002, O1-I3-P2-001, O1-I3-P2-002 |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | pass | Own-Chrome lift needs an attach verb (fusion.ts:623); no `--account`; live manual consent (chrome-devtools SKILL.md:86) |
| `agent_cross_runtime` | pass | Runtime skill dirs symlink to `.skilled/skills`; no stale packet paths in agents or root docs |
| `feature_catalog_code` | pass | 31 leaves, TOTAL 31 (feature-catalog.md:243) |
| `playbook_capability` | pass | Validators violations=0 for all three packages; run tallies match READMEs |

AC_COVERAGE: not computed (validate.sh is barred inside this lineage).

## 8. Deferred Items

- Parent criterion 5 stage one (advisor replay) and criterion 7 (`validate.sh --strict --recursive`) were not re-run: the advisor may start a daemon that writes outside the lineage, and validate.sh is barred by the dispatch.
- 012 criterion 1 (`doc-alignment.cjs scope`) not re-run.
- Four Aside playbook scenarios were edited by 013 after the 2026-11-22 recorded runs; no rerun records the new wording.
- No frontier (default depth mode).

## Dimension Expansion Map

- Saturated directions: none recorded. Completed pivots 0, failed pivots 0, audited overrides 0. No Council artifacts. Remaining frontier: none.
- Passes: correctness (1, 5), security (2, 7), traceability (3, 6), maintainability (4, 7).

## 9. Search Ledger

- searchCoverage (latest reducer state): required `secret_exposure`, `consent_bypass`; both ruled out; graphCoverageMode `graph`.
- Across iterations, ledger rows covered: criterion_regression, cross_copy_drift (findings), supply_chain (2 findings), destructive_command and consent_bypass (ruled out), status_drift (2 findings), scope_creep (ruled out), release_drift (finding), version_mismatch (ruled out), routing_regression and evidence_tally_drift (ruled out), count_drift (finding), stale_mirror_path (ruled out), secret_exposure (ruled out).
- searchDebt: [] (hasSearchDebt: false).

## 10. Audit Appendix

- Convergence: ratios 1.0, 0.25, 0.17, 0.07, 0.0, 0.06, 0.0. Convergence check after iteration 4 (read-only) returned CONTINUE (evidenceDensity, unfinished core protocols). Stop at the iteration cap. Terminal gates: evidence pass, scope pass, coverage fail (`traceability-incomplete`).
- Dimension coverage: 4 of 4.
- Ruled out: stale mcp-tooling browser paths; Aside curl installer (operator-invoked); teardown rm -rf regression (prior R2-P1-001 fix holds); 013 scope creep (Devin, freshness declared in 013 spec.md:91); 403 Forbidden reject regression (prior C2-I1-P1-001 fix holds, canary present); results.csv tally drift; JSON routing version mismatch; stale mirror paths; credential leakage in browser manuals.
- Sources: see each iteration's Files Reviewed.

### Workflow deviations (provenance)

- `step_acquire_lock` was not run in this lineage, so there is no lock to release.
- The lineage config was first written with the root's `fanout` key copied in; it was removed before synthesis so the lineage takes the single-executor branches. The run-open row's contentDigest reflects the earlier bytes.
- Convergence was first evaluated after iteration 4 and only with `--read-only`; no blocked-stop rows were written.
- Per-iteration graph upserts for iterations 1-4 were backfilled after iteration 4; 5-7 ran per iteration.
- `step_generate_context` skipped: the dispatch bans `generate-context.js`; the dispatch's write limits override the YAML here.
- A scratch file `/tmp/opus1-inst.txt` was written outside the lineage during iteration 1 and has been deleted.
