---
title: "Review Report: Playbook path repair"
description: "Five-iteration deep review of the playbook path repair commits: CONDITIONAL, one P1 and six P2, with each disposition."
importance_tier: "normal"
contextType: "review"
---
# Review Report: Playbook path repair

<!-- MACHINE-OWNED: START -->
Session `2026-10-12T06:18:50.635Z`, generation 1. Five iterations, stop reason `maxIterationsReached` (stopPolicy `max-iterations`). Executor cli-pi, `llmgateway/deepseek-v4.1-flash`, reasoning max.
<!-- MACHINE-OWNED: END -->

## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** false (the verdict is not PASS)
- **Active findings:** P0 0, P1 1, P2 6
- **Scope:** commits `41302e72be..cd34e1fbbe` on `worktrees/118-playbook-paths`. That is the validator change (two skip rules and their tests), the sk-doc 2.3.7.0 bump and the backticked-path corrections across 223 playbook files. 234 files in all.

The P1 is the phase's own closure state: one warning was left with no Remaining row yet. Five P2s are real drift, and the two the orchestrator ruled to reject are recorded below with their reasons.

## 2. Planning Trigger

`/speckit:plan` is not required. Every finding is fixed inside this phase or rejected with a reason, so the remediation fits in this phase's own commits.

```json
{
  "triggered": false,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {"id": "R1-P1-001", "severity": "P1", "disposition": "fix: record RM-1"},
    {"id": "R1-P2-001", "severity": "P2", "disposition": "rejected"},
    {"id": "R1-P2-002", "severity": "P2", "disposition": "fix: comment"},
    {"id": "R2-P2-001", "severity": "P2", "disposition": "fix: root playbooks"},
    {"id": "R3-P2-001", "severity": "P2", "disposition": "fix: drop In-repo"},
    {"id": "R4-P2-001", "severity": "P2", "disposition": "rejected"},
    {"id": "R5-P2-001", "severity": "P2", "disposition": "fix: rename binding"}
  ],
  "remediationWorkstreams": ["spec closure", "root playbook drift", "validator comments and test naming"],
  "specSeed": "UNKNOWN",
  "planSeed": "UNKNOWN",
  "findingClasses": {"R2-P2-001": "class-of-bug", "R3-P2-001": "instance-only", "R5-P2-001": "instance-only", "R1-P1-001": "instance-only", "R1-P2-002": "instance-only"},
  "affectedSurfacesSeed": ["cli-codex, cli-cursor, mcp-figma and sk-vision root playbooks", "two sk-code motion scenarios", "validate-playbook-package.cjs and its test"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

| ID | Sev | Title | Dim | File:line | Evidence | Disposition |
|----|-----|-------|-----|-----------|----------|-------------|
| R1-P1-001 | P1 | The residual warning has no Remaining row | correctness | `cli-cursor/manual-testing-playbook/worktree-isolation/worktree-dry-run-inspection.md:14` | The validator prints 1 warning, and the RM-row grep in `implementation-summary.md` printed 0 | Fix: RM-1 recorded, PP-04 Closed with "see Remaining" |
| R1-P2-001 | P2 | The `.skilled/release/` skip blanks the whole namespace | correctness | `validate-playbook-package.cjs:381` | The prefix rule skips any filename under it | **Rejected.** Everything under the prefix is release state that `/doctor:update` writes in an installed tree, and the source tree holds only `.gitignore` there. Listing filenames in the validator would copy the engine's file contract into a second place |
| R1-P2-002 | P2 | A dangling symlink passes the backtick check but fails the link check | correctness | `validate-playbook-package.cjs:394` | `pathPresent` vs the link check's `existsSync` | Fix: the comment states the link check stays stricter on purpose |
| R2-P2-001 | P2 | CX-025 says `.codex/config.toml`/`mcp_servers` while its root summary says `.codex/settings.json`/`mcpServers` | correctness | `cli-codex/manual-testing-playbook/manual-testing-playbook.md:686,692` | grep of the root file | Fix. Class-of-bug: the validator never backtick-checks root files, and the inventory found the same drift in the cli-codex, cli-cursor, mcp-figma and sk-vision roots, all fixed with the replacement their scenarios got. `references/codex-tools.md` is outside the phase scope and is listed in Deferred Items |
| R3-P2-001 | P2 | Three a_nobel_en_zn rows still say "In-repo" | traceability | `sk-code/.../motion-api-smoke.md:99`, `prefers-reduced-motion.md:84` | grep of `a_nobel_en_zn` | Fix: "In-repo" dropped |
| R4-P2-001 | P2 | The backtick symlink rule accepts a target outside the repository | security | `validate-playbook-package.cjs:394-397` | `pathPresent` takes any symlink | **Rejected.** All 4 tracked symlinks whose targets leave the repository (out of 468) sit under `scratch/` or `review/` segments the check already skips. The check reads nothing through the link. The R1-P2-002 comment now also says the link check rejects a symlink that leaves the repository |
| R5-P2-001 | P2 | The piped-report test still names a fleet run | maintainability | `tests/validate-playbook-package.test.cjs:293-295` | `const fleet` and both messages | Fix: renamed to `seeded` |

## 4. Remediation Workstreams

1. **P1, spec closure:** write RM-1 and the 29 ledger rows in `implementation-summary.md`.
2. **P2, root playbook drift:** apply the same replacements in the four root playbook files, and drop "In-repo" in the two sk-code scenarios.
3. **P2, validator hygiene:** add the comment clause and rename the test binding.

## 5. Spec Seed

- Record RM-1 for `.cursor/worktrees.json` with its reason.
- Name the root-file blind spot as a known limitation, since the validator backtick-checks scenario files only.

## 6. Plan Seed

- Dispatch the literal replacements, confirm each file byte for byte, then rerun the validator and its tests.

## 7. Traceability Status

**Core protocols**
- `spec_code`: pass after remediation. The ledger rows trace to per-package validator runs.
- `checklist_evidence`: partial at review time. The acceptance criteria were Unmet until the ledger was written.

**Overlay protocols**
- `playbook_capability`: partial. Root playbook files drifted from their scenarios (R2-P2-001).
- `skill_agent`, `agent_cross_runtime`, `feature_catalog_code`: not applicable to this diff.
- `AC_COVERAGE`: advisory-shortfall at review time, for the same reason as `checklist_evidence`.

## 8. Deferred Items

These sit outside the phase scope and are left as found:
- `cli-codex/references/codex-tools.md` section 2 still says `.codex/settings.json`.
- `sk-design-diagram/references/export.md:151` cites a missing path.
- The deep-ai-council advisor scenario command points at a moved test file.
- The sk-vision feature catalog still uses `pi/sk-vision.ts`.
- The doctor test-env text says five yaml files; there are six.
- The cli-cursor role text still says "Phase 011's".

## Dimension Expansion Map

No pivots, overrides or Council artifacts. The four dimensions ran in order: correctness (iterations 1 and 2), traceability (3), security (4), maintainability (5). Remaining frontier: none recorded.

## 9. Search Ledger

- Required bug classes: version_drift, stale_doc_contradiction, comment_hygiene_violation and test_false_confidence. test_false_confidence was covered; the other three were ruled out.
- Candidates covered: content_beyond_path, cross_doc_inconsistency, path_containment, path_intent_mismatch, row_loss, skip_false_negative, spec_criterion_unmet and test_false_confidence.
- Candidates ruled out include destructive_side_effects, secret_exposure, developer_absolute_path, unset_variable_expansion, rename_breakage, output_truncation and test_weakening.
- `searchDebt` is empty, so hasSearchDebt is false.

## 10. Audit Appendix

- **Convergence:** reducer convergenceScore 0.86. Graph score 0.793 with decision STOP_BLOCKED, because graph dimension coverage was 60% against an 80% threshold. That is telemetry only under stopPolicy `max-iterations`, and the registry marks all four dimensions covered.
- **Iterations:** each one passed `verify-iteration.cjs` and claim adjudication, and each ended "Review verdict: CONDITIONAL" because R1-P1-001 stayed open.
- **Sources reviewed:** the validator and its test, all 223 changed playbook files sampled by package, the sk-doc bump files, the changelog, the Hermes mirror, both manifests and this phase's spec docs.

### Cross-reference appendix

**Core Protocols:** `spec_code`, `checklist_evidence` (see section 7).

**Overlay Protocols:** `playbook_capability`, `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` (see section 7).
