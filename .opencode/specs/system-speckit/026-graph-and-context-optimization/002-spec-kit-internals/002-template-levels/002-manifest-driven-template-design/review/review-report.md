# Deep Review Report: Template Backend Greenfield Redesign — Implementation Audit

## Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | **CONDITIONAL** |
| **hasAdvisories** | true |
| **Active P0** | 0 |
| **Active P1** | 4 |
| **Active P2** | 4 |
| **Dimensions Reviewed** | 5/5 |
| **Iterations** | 5/5 |
| **Stop Reason** | maxIterationsReached |
| **Review Scope** | 16 implementation files |

**Summary**: The C+F hybrid manifest-driven template system has been partially implemented. Phase 1 (manifest + loader + renderer) and Phase 2 (scaffolder migration) are complete and well-executed. However, Phase 3 (validator migration) was skipped while Phase 4 (legacy deletion) was performed, creating a **validator-coverage gap** — only 1 of 23 validators reads from the single-source-of-truth manifest. No P0 correctness or security issues were found. The 4 P1 findings center on the incomplete validator migration and a renderer error-quality issue.

## Planning Trigger

Planning is **required** for remediation of P1 findings before a PASS verdict can be granted.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": {
    "P0": 0,
    "P1": 4,
    "P2": 4
  },
  "remediationWorkstreams": [
    {
      "id": "WS-1",
      "priority": "P1",
      "title": "Migrate validators to manifest-driven single source of truth",
      "findings": ["P1-001", "P1-004"],
      "effort": "~2-4 hours"
    },
    {
      "id": "WS-2",
      "priority": "P1",
      "title": "Fix inline-gate-renderer error quality for malformed gate placement",
      "findings": ["P1-003"],
      "effort": "~30 minutes"
    },
    {
      "id": "WS-3",
      "priority": "P2",
      "title": "Add golden-snapshot tests for template rendering + shell dependency hardening",
      "findings": ["P2-003", "P2-004", "P2-005"],
      "effort": "~1-2 hours"
    }
  ],
  "specSeed": [
    "Add acceptance criteria for validator manifest migration (each level-dependent validator reads from manifest)",
    "Add golden-snapshot test requirement for template rendering to checklist",
    "Add cross-runtime parity check for manifest resolution caching"
  ],
  "planSeed": [
    "Phase 3a: Migrate check-files.sh to resolve_level_contract (~20 lines)",
    "Phase 3b: Migrate check-sections.sh to resolve_level_contract (~15 lines)",
    "Phase 3c: Migrate check-template-headers.sh to manifest",
    "Phase 3d: Migrate check-anchors.sh, check-level-match.sh, check-template-source.sh",
    "Phase 3e: Verify all 23 validators pass regression suite after migration",
    "Phase 3f: Add renderer error-quality improvement (P1-003)",
    "Phase 3g: Add golden-snapshot tests (P2-004)",
    "Phase 3h: Harder shell resolver dependency (P2-003)"
  ],
  "findingClasses": [
    "validator-migration-gap",
    "renderer-error-quality",
    "test-coverage-gap",
    "cross-runtime-parity"
  ],
  "affectedSurfacesSeed": [
    "scripts/rules/check-files.sh",
    "scripts/rules/check-sections.sh",
    "scripts/rules/check-template-headers.sh",
    "scripts/rules/check-anchors.sh",
    "scripts/rules/check-level-match.sh",
    "scripts/rules/check-template-source.sh",
    "scripts/templates/inline-gate-renderer.ts",
    "scripts/lib/template-utils.sh"
  ],
  "fixCompletenessRequired": false
}
```

## Findings

### P1 Findings (Blocking CONDITIONAL verdict)

| ID | Title | Dimension | Source | Fix |
|----|-------|-----------|--------|-----|
| **P1-001** | Validators NOT migrated to manifest — contradicts ADR-001 single-source-of-truth claim | implementation-spec-alignment | `check-files.sh:93`, `check-sections.sh:34,49,57` | Migrate to `resolve_level_contract` from template-utils.sh |
| **P1-002** | Phase ordering violation — Phase 4 (delete) executed before Phase 3 (migrate validators) | implementation-spec-alignment | plan.md:131-137 vs deleted dirs | Complete Phase 3 migration first |
| **P1-003** | inline-gate-renderer produces unparseable token when gate marker shares line with content | code-correctness | `inline-gate-renderer.ts:109` | Add explicit validation for one-gate-per-line with clear error |
| **P1-004** | Only 1 of 23 validators has manifest integration — 91% coverage gap | validator-coverage | Audit of all check-*.sh files | Migrate all 6 legacy-dependent validators |

### P2 Findings (Advisories)

| ID | Title | Dimension | Source |
|----|-------|-----------|--------|
| **P2-001** | validate.sh lacks manifest integration | implementation-spec-alignment | `validate.sh` |
| **P2-003** | template-utils.sh resolve_level_contract() fragile Node.js dependency chain | code-correctness | `template-utils.sh:238-257` |
| **P2-004** | No golden-snapshot tests for template rendering output | template-rendering-correctness | Missing test files |
| **P2-005** | TS resolver caching + dual-path vs shell single-path parity gap | cross-runtime-mirror-consistency | `level-contract-resolver.ts:62` |

## Remediation Workstreams

### WS-1: Validator Migration (P1-001, P1-004)
**Priority**: P1 | **Effort**: 2-4 hours

1. Migrate `check-files.sh` line 93: replace `node "$helper_script" docs "$level"` with `resolve_level_contract` + `level_contract_docs_from_json`
2. Migrate `check-sections.sh` lines 34,49,57: same pattern
3. Migrate `check-template-headers.sh`, `check-anchors.sh`, `check-level-match.sh`, `check-template-source.sh`
4. Run `validate.sh --strict` regression against all 868 existing spec folders
5. Verify workflow-invariance test remains green

### WS-2: Renderer Error Quality (P1-003)
**Priority**: P1 | **Effort**: 30 min

1. In `renderInlineGates()`: after GATE_OPEN regex match, check if there's content after `-->` on the same line
2. Throw clear error: "Inline gate marker must appear on its own line — found content after `-->`: '...'"
3. Add test case for this error path

### WS-3: Test Coverage + Shell Hardening (P2-003, P2-004, P2-005)
**Priority**: P2 | **Effort**: 1-2 hours

1. Extract inline heredoc JS from `template-utils.sh:resolve_level_contract()` to standalone `scripts/lib/resolve-level-contract.mjs`
2. Add 6 golden-snapshot tests for `renderInlineGates()` (1 per level + phase-parent)
3. Add single manifest path resolution to shell resolver (or remove dual-path from TS)

## Spec Seed

- Add manifest-dependent validator list to `spec.md` §4 requirements
- Add golden-snapshot test requirement as P1 checklist item
- Add renderer error-quality acceptance criteria

## Plan Seed

1. Phase 3a: Migrate `check-files.sh` to manifest (~20-line diff)
2. Phase 3b: Migrate `check-sections.sh` to manifest (~15-line diff)  
3. Phase 3c: Migrate remaining 4 legacy validators
4. Phase 3d: Regression test all 868 existing spec folders
5. Phase 3e: Fix renderer gate-marker error quality
6. Phase 3f: Add golden-snapshot tests
7. Phase 3g: Extract shell resolver to standalone script

## Traceability Status

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` (core) | **partial** | Scaffolder fully migrated; validators not. 4 P1 findings citing spec/code gaps. |
| `checklist_evidence` (core) | **pass** | This is investigation-only packet; no implementation checklist required. |
| `skill_agent` (overlay) | notApplicable | No agent files in review scope. |
| `agent_cross_runtime` (overlay) | notApplicable | No multi-runtime agent files. |

## Audit Appendix

### Convergence Summary
- Iterations: 5/5 (maxIterationsReached)
- newFindingsRatio progression: 1.00 → 0.60 → 0.25 → 0.33 → 0.20
- Trend: Declining. Rolling average (last 2): ~0.27. Below threshold but converged prematurely due to hard cap.
- Dimensions covered: 5/5 (implementation-spec-alignment, code-correctness, template-rendering-correctness, validator-coverage, cross-runtime-mirror-consistency)

### Sources Reviewed
- `templates/manifest/spec-kit-docs.json` (709 lines)
- `scripts/templates/inline-gate-renderer.ts` (297 lines)
- `scripts/templates/inline-gate-renderer.sh` (14 lines)