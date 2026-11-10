---
title: "Review Report: Playbook root and stale refs"
description: "Five-iteration deep review of the playbook root and stale reference commits: no P0 or P1, five P2, one search-debt item, with each disposition."
importance_tier: "normal"
contextType: "review"
---
# Review Report: Playbook root and stale refs

<!-- MACHINE-OWNED: START -->
Session `2026-10-12T10:01:23.529Z`, generation 1. Five iterations, stop reason `maxIterationsReached` (stopPolicy `max-iterations`). Executor cli-pi, `llmgateway/deepseek-v4.1-flash`, reasoning max.
<!-- MACHINE-OWNED: END -->

## 1. Executive Summary

- **Verdict:** CONDITIONAL. No P0 or P1 is active, so the findings alone give PASS with advisories; the reducer recorded one search-debt item, and the contract carries a run with search debt as CONDITIONAL.
- **hasAdvisories:** false (the verdict is not PASS)
- **hasSearchDebt:** true at synthesis. SL-008 asked for the RR-1 revert to be rerun, which the read-only iteration could not do. The orchestrator reran it after the review: with the validator reverted to `b4d4e90192` the test exits 1 on the root-file assertion, and with it restored the test exits 0.
- **Active findings:** P0 0, P1 0, P2 5
- **Scope:** commits `b4d4e90192..d20d841f06` on `worktrees/121-playbook-root-refs`, 56 files: the validator's root-file check and its test, the sk-doc 2.3.9.0 release, 13 root playbook files, six stale reference fixes and the phase's spec docs.

## 2. Planning Trigger

`/speckit:plan` is not required. Four findings are fixed inside this phase and one is rejected with a reason.

```json
{
  "triggered": false,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R1-P2-001", "severity": "P2", "disposition": "rejected"},
    {"id": "R2-P2-001", "severity": "P2", "disposition": "fix: prefix the three bare names"},
    {"id": "R3-P2-001", "severity": "P2", "disposition": "fix: parent continuity at closeout"},
    {"id": "R4-P2-001", "severity": "P2", "disposition": "fix: snippet names the user config"},
    {"id": "R5-P2-001", "severity": "P2", "disposition": "fix: summary count"}
  ],
  "remediationWorkstreams": ["root playbook wording", "parent continuity", "codex config example", "test summary count"],
  "specSeed": "UNKNOWN",
  "planSeed": "UNKNOWN",
  "findingClasses": {"R1-P2-001": "class-of-bug", "R2-P2-001": "instance-only", "R3-P2-001": "instance-only", "R4-P2-001": "instance-only", "R5-P2-001": "UNKNOWN"},
  "affectedSurfacesSeed": ["backtick token normalization", "sk-code-obsidian root playbook", "022 parent goal and spec continuity", "cli-codex references/codex-tools.md", "validate-playbook-package.test.cjs summary line"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dim | File:line | Evidence | Disposition |
|----|-----|-------|-----|-----------|----------|-------------|
| R1-P2-001 | P2 | A backticked path with a `#fragment` never reaches the check | correctness | `validate-playbook-package.cjs:376` | The extension gate is end-anchored, so `references/gone.md#setup` is skipped. Reproduced: the regex returns false for that token, and 0 anchored backticked paths exist in any playbook file | **Rejected.** The root check reuses the scenario check's token rules unchanged; anchored tokens are a class the check has never covered, with no instance in any of the 57 roots or their scenarios. A rule for a form nobody writes is what prevent-overengineering rules out |
| R2-P2-001 | P2 | The sk-code-obsidian sentence mixes prefixed and bare names | correctness | `sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md:180-181` | The fix prefixed only the three slashed names; the sentence above prefixes all six. Reproduced by reading the lines | Fixed: `references/` added to `accessibility.md`, `theme-variables.md` and `skill-reference-integrity.md` |
| R3-P2-001 | P2 | Parent continuity claims completion while its criteria are pending | traceability | `022-doc-version-and-playbook-paths/goal.md:24`, `spec.md:23` | `completion_pct: 100` beside unchecked criteria, and "two children" wording. Reproduced by grep | Fixed at closeout: continuity, D2 and the purpose line name three children, and the criteria are rechecked from the final tree |
| R4-P2-001 | P2 | The Codex MCP snippet puts a key slot in a tracked project config | security | `cli-codex/references/codex-tools.md:137` | `.codex/config.toml` is tracked and not ignored here; the snippet named it first. Reproduced with `git ls-files` and `git check-ignore` | Fixed: the snippet's header names `~/.codex/config.toml` and says to keep a real key out of the committed project file |
| R5-P2-001 | P2 | The fixture-suite summary count is stale | maintainability | `tests/validate-playbook-package.test.cjs:240` | The suite printed 33 after the root case added two assertion sites. Reproduced by running the suite | Fixed: the constant is 28, and the suite prints 35 |

## 4. Remediation Workstreams

1. **P2, docs:** prefix the three names (R2), name the user config in the Codex snippet (R4).
2. **P2, test:** raise the summary constant (R5).
3. **P2, spec closure:** parent continuity and wording (R3).

## 5. Spec Seed

- None beyond this phase. R1 stays a rejected advisory.

## 6. Plan Seed

- Dispatch the literal replacements, compare each file byte for byte, rerun the validator and its tests.

## 7. Traceability Status

**Core protocols**
- `spec_code`: pass. Each ledger row traces to a change, and the per-package proofs print what the rows claim.
- `checklist_evidence`: partial at review time; the acceptance criteria were Unmet until closeout.

**Overlay protocols**
- `playbook_capability`: pass. The rewritten root lines match their scenarios; CO-013's summary now matches the unflagged route its scenario tests.
- `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`: not applicable beyond the sk-vision catalog path form, which matches the catalog's other rows.
- `AC_COVERAGE`: advisory-shortfall at review time, for the same reason as `checklist_evidence`.

## 8. Deferred Items

- The cli-opencode CO-033 root summary still describes a raw `--agent deep-review` dispatch while its scenario runs `--command deep/review`. It is not a path, so it is outside this phase.
- The iteration 2 graph upsert failed with `SQLITE_CONSTRAINT_FOREIGNKEY`. The coverage graph is telemetry under stopPolicy `max-iterations`; iterations 3 to 5 upserted cleanly.

## Dimension Expansion Map

No pivots, overrides or Council artifacts. The dimensions ran in order: correctness (iterations 1 and 2), traceability (3), security (4), maintainability (5). Remaining frontier: none recorded.

## 9. Search Ledger

- Required bug classes: version_consistency, test_output_drift, comment_convention and stale_changelog_claim. test_output_drift was covered (R5); the other three were ruled out.
- Candidates covered include base_resolution, duplicate_reporting, exit_code_side_effect, false_green_criterion, missed_path_class, residual_warning_policy, secret_inlined_in_committed_config and test_effectiveness.
- Ruled out include path_resolution_escape, destructive_or_privileged_command_drift, credential_or_personal_path_leak, path_subject_mismatch, stale_reference_successor and rm_row_unjustified.
- `searchDebt`: SL-008, proof_command_drift on the RR-1 revert claim, deferred because the iteration was read-only. Closed after synthesis by the orchestrator's observed run described in section 1.

## 10. Audit Appendix

- **Convergence:** graph decision STOP_BLOCKED at iteration 1, telemetry only under stopPolicy `max-iterations`. The registry marks all four dimensions covered.
- **Iterations:** each passed `verify-iteration.cjs` and claim adjudication, with no new P0 or P1, and each ended "Review verdict: PASS".
- **Sources reviewed:** the validator and its test, the 13 root files, the six stale reference targets, the sk-doc release files, the Hermes mirror, both manifests, and this phase's and the parent's spec docs.

### Cross-reference appendix

**Core Protocols:** `spec_code`, `checklist_evidence` (see section 7).

**Overlay Protocols:** `playbook_capability`, `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` (see section 7).
