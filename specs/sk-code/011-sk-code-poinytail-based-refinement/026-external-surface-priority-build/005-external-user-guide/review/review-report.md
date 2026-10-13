# Deep Review Report: External user guide

Review of commits `8f59b9bd0a` and `1895122d37` on branch `worktrees/129-surface-guide` (diff `d99ddaff7d..1895122d37`): `README.md` marks OpenCode native and Webflow and Obsidian optional examples and rewrites the "What Adapting `sk-code` Looks Like" block into the external-user guide, the sk-code `SKILL.md` surface sentence, the hub README rows and the regenerated Hermes copy carry the same roles, and `.skilled/changelog/skilled/v4.0.0.5.md` is the next release note.

## 1. Executive Summary

- **Verdict:** PASS
- **hasAdvisories:** true
- **Active findings at synthesis:** P0 0, P1 0, P2 4
- **Scope:** 7 files (5 in the commits, plus the phase `spec.md` and `goal.md`), four dimensions, five iterations on cli-pi `deepseek-v4.1-flash` at `max` thinking. Stop reason `maxIterationsReached` under stop policy `max-iterations`.
- Every path and command the guide names exists and matches its script's usage, the R4 lines are true against `mode-registry.json` and `hub-router.json`, and every release-note bullet traces to a phase 001 to 004 ledger. The four P2 advisories are gaps at the edges of the guide and the spec, not wrong instructions.

## 2. Planning Trigger

`/speckit:plan` is not required: the phase goal (C3) has the builder fix every confirmed P0 to P2 inside this phase. Three findings were fixed (`746eb3d0cf` and the closeout commit), one was rejected with a reason, and all four are recorded as RV rows in the phase `implementation-summary.md`.

```json
{
  "label": "Planning Packet",
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": { "P0": 0, "P1": 0, "P2": 4 },
  "remediationWorkstreams": ["guide completeness: name the Hermes skill-copy refresh and the root README surface lines in the removal and add recipes (R1-P2-001, R1-P2-002)", "spec scope: list the regenerated artifacts in Files to Change (R3-P2-001)"],
  "specSeed": ["Files to Change lists generated copies the commit gates write"],
  "planSeed": ["edit removal steps 5 and 8 and add step 5 of the README block", "add the regenerated-artifacts row to spec.md"],
  "findingClasses": ["instance-only"],
  "affectedSurfacesSeed": ["README.md adaptation block", "005 spec.md"],
  "fixCompletenessRequired": false
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dimension | Evidence | Disposition |
|----|-----|-------|-----------|----------|-------------|
| R1-P2-001 | P2 | The recipes never refresh the Hermes skill copies, so a removal leaves `.hermes/skills/sk-code-webflow` and `-obsidian` behind and the commit stops at the mirror-parity hook | correctness | `README.md:1463`, `.hermes/skills/sk-code-webflow/`, `sync-skills-hermes.cjs:234-260` | Fix (`746eb3d0cf`): removal step 8 and add step 5 refresh the copies with `sync-skills-hermes.cjs`, which prunes a removed packet |
| R1-P2-002 | P2 | The root README surface lines go stale after a removal and the hub-rooted doc-claims walk cannot flag them | correctness | `README.md:800`, `README.md:1384` | Fix (`746eb3d0cf`): removal step 5 names the surface lines in the root `README.md` |
| R2-P2-001 | P2 | The removal recipe deletes an example folder with no work-loss preflight | security | `README.md:1456` | Reject: the folder is tracked, so `git restore` brings it back, and the guide's opening already offers keeping the examples as models |
| R3-P2-001 | P2 | `spec.md` Files to Change does not list the generated artifacts the diff carries | traceability | `spec.md:94` | Fix (closeout commit): one row lists the Hermes copy and the two activation manifests, written by `sync-skills-hermes.cjs` and the pre-commit route gate |

Finding class for all four: instance-only. Adversarial self-check: the orchestrator confirmed R1-P2-001 by listing `.hermes/skills/sk-code*` (six packet copies, both examples among them) and reading the prune branch of `sync-skills-hermes.cjs`. No P0 or P1 was raised, so the typed claim-adjudication gate stayed vacuous.

## 4. Remediation Workstreams

1. Guide completeness (R1-P2-001, R1-P2-002): three lines of the README block.
2. Spec scope (R3-P2-001): one `spec.md` row.

## 5. Spec Seed

- Files to Change names generated copies the commit gates write.

## 6. Plan Seed

- Edit the three guide lines, add the spec row, rerun goal criteria 1 to 3 and `validate_document.py`.

## 7. Traceability Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | pass | REQ-001 to REQ-005 map to the diff; goal criteria 1, 2 and 3 rerun by iteration 3 print `ok`, `8`, `ok` |
| `checklist_evidence` | core | pass after closeout | Ledger rows P11-1 to P11-6 are closeout evidence (search debt SL-506 below) |
| `skill_agent` | overlay | pass | The scaffold claims in the guide match `create-skill-parent-auto.yaml` step_4 and step_6 |
| `agent_cross_runtime` | overlay | pass after fix | The Hermes copy matches its source line; the removal-path gap is R1-P2-001 |
| `feature_catalog_code` | overlay | notApplicable | No catalog entry covers the adaptation guide |
| `playbook_capability` | overlay | notApplicable | The guide names the playbook scenarios a user removes, it changes none |

AC_COVERAGE: lifecycle-active Level 2 packet; the acceptance rows are closed by the builder with ledger evidence.

## 8. Deferred Items

None open. Search debt SL-506 (acceptance-ledger evidence) was deferred by the read-only iterations to closeout, where the ledger rows are filled from the reader-test runs and the worktree checks.

## Dimension Expansion Map

No divergent pivots ran (convergence mode `default`). Iteration 5 was an adversarial re-check across all four dimensions that re-read every finding; none changed severity and none was dropped.

## 9. Search Ledger

- `searchCoverage.graphCoverageMode`: `graphless_fallback`
- Required bug classes: missing_instruction_step, stale_reference, destructive_data_loss, spec_scope_mismatch, wrong_path_or_command
- Covered by findings: destructive_data_loss, missing_instruction_step, spec_scope_mismatch, stale_reference; ruled out: wrong_path_or_command
- hasSearchDebt: true at synthesis (SL-506), closed by the closeout ledger
- Reducer-owned `searchDebt`, `ruledOutCandidates` (15) and `cleanSearchProof` are in `deep-review-findings-registry.json`.

## 10. Audit Appendix

- **Convergence:** five iterations, new-findings ratios 1, 0.33, 0.25, 0, 0; all four dimensions covered by iteration 4; graph convergence `STOP_BLOCKED` on the first check and `CONTINUE` after. Stop: `maxIterationsReached`.
- **Coverage:** correctness (1, 5), security (2, 5), traceability (3, 5), maintainability (4, 5).
- **Ruled out:** a wrong path or command in the guide, a release-note claim phases 001 to 004 did not ship, a broken anchor, a reversed copy direction, secret exposure, an HVR or changelog-template breach, and any line left that tells the user to replace OpenCode.
- **Sources reviewed:** the five changed files, the phase spec docs, the 001 to 004 implementation summaries, research section 14.1, `create-skill-parent-auto.yaml`, the battery scripts, `sync-skills-hermes.cjs`, the pre-commit hook.

### Core Protocols

`spec_code` and `checklist_evidence`, as in section 7.

### Overlay Protocols

`skill_agent` passes, `agent_cross_runtime` passes after the fix, `feature_catalog_code` and `playbook_capability` are not applicable.
