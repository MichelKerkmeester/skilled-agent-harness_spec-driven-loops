---
title: "Review Report: Doctor guard and sync messages"
description: "Five-iteration deep review of the doctor, guard and sync message commits: no P0 or P1, eight P2, five fixed and three rejected with reasons, and two search-debt items closed by observed runs."
importance_tier: "normal"
contextType: "review"
---
# Review Report: Doctor guard and sync messages

<!-- MACHINE-OWNED: START -->
Session `2026-10-13T06:01:53.622Z`, generation 1. Five iterations, stop reason `maxIterationsReached` (stopPolicy `max-iterations`). Executor cli-pi, `deepseek-v4.1-flash` through `llmgateway`, `--thinking max`, run through the auto workflow's cli-pi branch with `--no-extensions` added (see the Audit Appendix).
<!-- MACHINE-OWNED: END -->

## 1. Executive Summary

- **Verdict:** CONDITIONAL. No P0 or P1 is active, so the findings alone give PASS with advisories; the reducer recorded two search-debt items, and the contract carries a run with search debt as CONDITIONAL.
- **hasAdvisories:** false (the verdict is not PASS)
- **hasSearchDebt:** true at synthesis, closed afterwards by the orchestrator. SL-108: with the authored manifest at mode 000 in a throwaway copy, the guard exits 1 with `EACCES`, so an unreadable manifest fails closed; the read is the same `readFileSync` the pre-phase guard used, so the behavior is unchanged. SL-304: the ledger rows P9-1 to P9-7 and T1 to T4 are filled in `implementation-summary.md` from runs made on the final commit.
- **Active findings:** P0 0, P1 0, P2 8 at synthesis. Five fixed in `015d7ea3d0`, three rejected.
- **Scope:** commits `4b9bf840b0..f9eb84c4fe` on `worktrees/127-surface-messages`, six files: `compiled-route-sync.cjs`, `compiled-route-guard.cjs`, `compiled-route-manifest.test.cjs`, `parent-skill-check.cjs`, `parent-skill-check-invariants.test.cjs` and `doctor-update-apply.yaml`.

## 2. Planning Trigger

`/speckit:plan` is not required. Every finding is a P2 inside this phase's own files or the one catalog doc that describes them, and each is fixed or rejected here.

```json
{
  "triggered": false,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R1-P2-001", "severity": "P2", "disposition": "fixed"},
    {"id": "R1-P2-002", "severity": "P2", "disposition": "rejected"},
    {"id": "R2-P2-001", "severity": "P2", "disposition": "rejected"},
    {"id": "R3-P2-001", "severity": "P2", "disposition": "fixed"},
    {"id": "R3-P2-002", "severity": "P2", "disposition": "rejected"},
    {"id": "R4-P2-001", "severity": "P2", "disposition": "fixed"},
    {"id": "R4-P2-002", "severity": "P2", "disposition": "fixed"},
    {"id": "R5-P2-001", "severity": "P2", "disposition": "fixed"}
  ],
  "remediationWorkstreams": ["P2 advisories fixed in 015d7ea3d0"],
  "specSeed": [],
  "planSeed": [],
  "findingClasses": "UNKNOWN",
  "affectedSurfacesSeed": [".skilled/bin/compiled-route-guard.cjs", ".skilled/bin/tests/compiled-route-manifest.test.cjs", ".skilled/commands/doctor/assets/doctor-update-apply.yaml", ".skilled/bin/README.md"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Title | File:line | Disposition and proof |
|----|-----|-------|-----------|-----------------------|
| R1-P2-001 | P2 | The CLI build path's authored-root check is not covered | `compiled-route-manifest.test.cjs:572` | Fixed: the sync test runs `--check` and the no-argument build in both pruned sandboxes. With the build-path `requireAuthoredRoot()` removed the test exits 1 |
| R1-P2-002 | P2 | Authored twin derived from the runtime layout under generation divergence | `compiled-route-guard.cjs:70` | Rejected: the runtime closure is a relative-path mirror of the authored closure by design. `sync --check` compares each authored file with `path.join(runtimeRoot, rel)` and the pre-commit gate derives the authored manifest the same way, so a runtime on a different layout from its authored tree already fails sync |
| R2-P2-001 | P2 | The repair string hardcodes the authored destination path | `doctor-update-apply.yaml:160` | Rejected: goal decision D2 requires that literal path, and goal criterion 2 greps for `015-router-unification-program/013-live-activation` in the `compiled_routes` block |
| R3-P2-001 | P2 | The bin README lists two guard failure classes and no sync restore line | `.skilled/bin/README.md:25` | Fixed: the prose and both table rows name the authored-missing failure and the sync restore line |
| R3-P2-002 | P2 | T2 and T4 pin the helper record, not the printed line | `compiled-route-manifest.test.cjs:587` | Rejected: D5 asks for one test per behavior change, and the printed lines are observed in copy rows P9-2 and P9-5. Extracting a render function only so a test can reach it adds an abstraction no requirement asks for |
| R4-P2-001 | P2 | The guard header still says two divergences | `compiled-route-guard.cjs:13` | Fixed: the header lists three, with authored missing |
| R4-P2-002 | P2 | The guard tests place the twin with the guard's own formula | `compiled-route-manifest.test.cjs:591` | Fixed: both tests place runtime and twin by the literal suffix `013-live-activation/activation/sk-code/manifest.json` |
| R5-P2-001 | P2 | The repair binds the copy-back to stale hubs only | `doctor-update-apply.yaml:160` | Fixed: the copy-back applies to each refreshed hub and each hub the guard reports as differing from its authored source; copy row P9-3 reruns it |

## 4. Remediation Workstreams

P0 and P1: none. P2: the five fixes above, one commit (`015d7ea3d0`).

## 5. Spec Seed

None. The phase spec needs no change.

## 6. Plan Seed

None.

## 7. Traceability Status

Core protocols: `spec_code` pass (REQ-001 to REQ-006 and D1 to D6 map to the changed lines and tests); `checklist_evidence` partial at synthesis, closed by the ledger fill. Overlay protocols: `skill_agent`, `agent_cross_runtime` and `playbook_capability` not applicable; `feature_catalog_code` partial through R3-P2-001, now fixed. `AC_COVERAGE`: exempt (no `checklist.md`).

## 8. Deferred Items

None.

## Dimension Expansion Map

No pivots, overrides or saturated directions were recorded. All four dimensions were covered; iteration 5 rechecked correctness.

## 9. Search Ledger

- hasSearchDebt: true at synthesis (SL-108, SL-304), both closed as stated in the Executive Summary.
- searchCoverage: required classes `false_pass`, `wrong_remediation_path`, `spec_code_drift`, `output_test_gap`; covered `wrong_remediation_path`; ruled out the other three.
- Ruled-out candidates include command injection, path traversal, symlink bypass, raw stack, fail open, exemption abuse and output consumer break; see `deep-review-findings-registry.json`.

## 10. Audit Appendix

- **Convergence:** stop policy `max-iterations`, so convergence was telemetry only; reducer convergence score 0.875. Every iteration passed `verify-iteration.cjs` (narrative, route proof, delta) and the reducer.
- **Coverage:** correctness (1, 5), security (2), traceability (3), maintainability (4).
- **Executor deviation:** the workflow's cli-pi branch builds `pi -p --offline --model llmgateway/deepseek-v4.1-flash --thinking max <prompt>` for a write-capable leaf. In this repository pi refuses to start (`Flag "--fast" conflicts`), because the tracked `.pi/extensions/pi-fast-mode-w-subagent-support` and the operator's global copy register the same flag. Each dispatch added `--no-extensions`; everything else ran as the YAML states, with dispatch receipts in `dispatch-receipts/`.
- **Phase save:** the workflow's continuity save was not run; the orchestrator writes `implementation-summary.md` directly.

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | iteration 3 |
| `checklist_evidence` | pass after the ledger fill | `implementation-summary.md` |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | not applicable | iteration 3 |
| `agent_cross_runtime` | not applicable | iteration 3 |
| `feature_catalog_code` | pass after R3-P2-001 | `.skilled/bin/README.md` |
| `playbook_capability` | not applicable | iteration 3 |
