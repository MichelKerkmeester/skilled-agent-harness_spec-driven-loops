# Deep Review Report: Scaffold surface placement

## 1. Executive Summary

- **Verdict:** PASS
- **hasAdvisories:** true
- **hasSearchDebt:** true (one deferred `checklist_evidence_gap` row; see section 9)
- **Active findings:** P0 0, P1 0, P2 2
- **Scope:** commit `17bb342b1c` on `worktrees/125-surface-placement`: the tieBreak insertion rule in the step_4 `hub-router.json` activity of both create-skill-parent YAML twins, the two step_6_completion follow-up lines, the same rule in `parent-hub-router-schema.md` and `parent-skills-nested-packets.md`, and the sk-create-skill v1.5.4.0 release.
- **Run:** 5 iterations, executor cli-pi `deepseek-v4.1-flash` (DevPass `llmgateway`) at `--thinking max`, stop reason `maxIterationsReached` under `stopPolicy: max-iterations`. All four dimensions covered.

## 2. Planning Trigger

`/speckit:plan` is not required: the verdict is PASS and both active findings are P2 advisories handled inside this phase.

```json
{
  "Planning Packet": {
    "triggered": false,
    "verdict": "PASS",
    "hasAdvisories": true,
    "activeFindings": [
      {"id": "R1-P2-001", "severity": "P2", "file": ".skilled/commands/create/assets/create-skill-parent-auto.yaml", "line": 423},
      {"id": "R4-P2-001", "severity": "P2", "file": ".skilled/commands/create/assets/tests/test_skill_parent_router_parity.py", "line": 7}
    ],
    "remediationWorkstreams": ["P2 advisories: state the order of several new surfaces; twin-parity guard decision"],
    "specSeed": [],
    "planSeed": [],
    "findingClasses": ["UNKNOWN", "UNKNOWN"],
    "affectedSurfacesSeed": ["UNKNOWN"],
    "fixCompletenessRequired": false
  }
}
```

## 3. Active Finding Registry

| ID | Severity | Title | Dimension | File:line | Evidence | Fix recommendation |
|----|----------|-------|-----------|-----------|----------|--------------------|
| R1-P2-001 | P2 | tieBreak insertion rule leaves the order among multiple new surfaces undefined | correctness | `.skilled/commands/create/assets/create-skill-parent-auto.yaml:423` | The rule places each new surface ahead of the existing ones but says nothing about two surfaces added in one `--surfaces a,b` run; the spec's edge case says "in the order given" | Add "in the order given" for several new surfaces at all four rule sites |
| R4-P2-001 | P2 | New twin line groups have no parity guard, unlike the root_router_contract block | maintainability | `.skilled/commands/create/assets/tests/test_skill_parent_router_parity.py:7` | The existing twin-parity test covers only the root_router_contract block; the changed step_4 and step_6 lines are compared only by this phase's goal criteria | Extend the parity test to the changed line groups, or accept the goal criteria as the guard |

findingClass, scopeProof and affectedSurfaceHints were not emitted by the iterations and are UNKNOWN.

## 4. Remediation Workstreams

- P0: none. P1: none.
- P2 advisories: R1-P2-001 and R4-P2-001, dispositions recorded in the phase `implementation-summary.md` RV table.

## 5. Spec Seed

- None required. R1-P2-001 restates an edge case `spec.md` already names ("Several surfaces added in one run").

## 6. Plan Seed

- None required.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | REQ-001..REQ-006 map to the changed lines; the spec anchors `parent-hub-router-schema.md:290` and `parent-skills-nested-packets.md:224` resolve to them (iteration 3) |
| `checklist_evidence` | deferred | The P8 ledger, AC rows and tasks were still scaffold during the review; the packet's own order fills them after the review (task T012) |

### Overlay Protocols

| Protocol | Status | Evidence |
|----------|--------|----------|
| `skill_agent` | pass | SKILL.md, changelog and Hermes copy agree on 1.5.4.0 (iterations 1, 4, 5) |
| `agent_cross_runtime` | pass | `.hermes/skills/sk-create-skill/SKILL.md:5` carries 1.5.4.0 (iterations 1, 2) |
| `feature_catalog_code` | notApplicable | No feature catalog entry covers the changed lines |
| `playbook_capability` | notApplicable | No playbook scenario covers the changed lines |

AC_COVERAGE: advisory, `acceptance-criteria.md` rows still `Unmet` at review time; closed by the phase closeout.

## 8. Deferred Items

- The `checklist_evidence_gap` search-debt row (SL-013): closes when the phase ledger, tasks and acceptance criteria are filled.

## Dimension Expansion Map

- Saturated directions: none. Completed pivots: 0. Failed pivots: 0. Audited overrides: 0. Remaining frontier: none recorded.

## 9. Search Ledger

- `searchCoverage`: required bug classes `spec_code_mismatch`, `cross_file_parity`, `command_executability`, all ruled out; graphCoverageMode `graphless_fallback`.
- `candidateCoverage`: covered `regression_guard_gap`, `undefined_ordering`; 16 classes ruled out (among them `cross_file_parity`, `command_executability`, `path_traversal`, `secrets_exposure`, `release_surface_staleness`, `template_instruction_drift`); deferred `checklist_evidence_gap`.
- `searchDebt`: SL-013 (iteration 3, traceability, `checklist_evidence_gap`, deferred: the ledger was not yet due).
- `ruledOutCandidates` and `cleanSearchProof`: see `deep-review-findings-registry.json`; SL-001 shows one identical phrase in every required site.
- Per the report contract, non-empty searchDebt carries the dashboard verdict as CONDITIONAL; the derived verdict from findings is PASS.

## 10. Audit Appendix

- **Convergence:** stopPolicy `max-iterations`, so convergence was telemetry only. Graph decision per iteration: STOP_BLOCKED for 1 to 3 (uncovered dimensions), CONTINUE for 4 and 5. newFindingsRatio: 1, 0, 0, 0.5, 0.
- **Coverage:** correctness (iterations 1, 5), security (2), traceability (3), maintainability (4).
- **Ruled out:** injection and path traversal in the new prose, secrets exposure, release-surface staleness, executability of every command the step_6 lines name.
- **Sources reviewed:** the six scope files, `parent-skill-check.cjs`, `compiled-route-manifest.cjs`, `.skilled/scripts/git-hooks/pre-commit`, `install-git-hooks.sh`, the canary fixture pair, `test_skill_parent_router_parity.py`.
- **Executor note:** pi ran with `--no-extensions` added after `-p`, because in this linked worktree the global extension symlink and the worktree's own copy both register `--fast` and pi refuses to start otherwise.
