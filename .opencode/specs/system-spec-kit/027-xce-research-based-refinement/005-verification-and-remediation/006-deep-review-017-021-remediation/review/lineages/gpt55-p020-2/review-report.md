# Deep Review Report - gpt55-p020-2

## Executive Summary

- Verdict: PASS
- hasAdvisories: true
- Stop reason: maxIterationsReached
- Iterations: 1
- Active findings: P0=0, P1=0, P2=1
- Release readiness state: in-progress
- Scope: correctness-focused fan-out lineage for `020-maintenance-grace-background-embedding`.

No P0/P1 correctness defect was confirmed. The implementation evidence matches the key packet claims: the marker module is reference-counted, the background scan holds it during the scan, and the embedding queue starts its holder only after the empty-queue guard and ends it in `finally`. One P2 advisory remains for direct regression coverage of the retry-manager marker boundary.

## Planning Trigger

No required remediation plan is triggered by this lineage because the verdict is PASS with advisory-only P2. A follow-up may schedule a small test-hardening task for F001.

```json
{
  "triggered": false,
  "verdict": "PASS",
  "hasAdvisories": true,
  "activeFindings": [
    {
      "id": "F001",
      "severity": "P2",
      "title": "Retry-manager marker boundary lacks a direct regression assertion",
      "file": ".opencode/skills/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:662-683"
    }
  ],
  "remediationWorkstreams": [
    "Optional test hardening for retry-manager marker boundary"
  ],
  "specSeed": [],
  "planSeed": [
    "Add a retry-manager test that proves empty runBackgroundJob ticks leave .maintenance-active.json absent."
  ],
  "findingClasses": [
    "matrix/evidence"
  ],
  "affectedSurfacesSeed": [
    "background embedding queue",
    "maintenance marker guard",
    "retry-manager tests"
  ],
  "fixCompletenessRequired": false
}
```

## Active Finding Registry

| ID | Severity | Dimension | Finding | Evidence | Disposition |
|----|----------|-----------|---------|----------|-------------|
| F001 | P2 | correctness | Retry-manager marker boundary lacks a direct regression assertion | `.opencode/skills/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:662-683`; `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1030-1055` | active advisory |

## Remediation Workstreams

| Workstream | Findings | Priority | Notes |
|------------|----------|----------|-------|
| Test hardening | F001 | Optional | Add direct retry-manager assertions for empty-queue no-marker behavior and optionally busy-queue marker behavior. |

## Spec Seed

- No spec change required from this lineage.
- If F001 is implemented, it can be recorded as test hardening under existing REQ-002/REQ-004 rather than a new requirement.

## Plan Seed

- Add a focused `retry-manager.vitest.ts` case that redirects database marker writes to a temp directory, mocks an empty queue, runs `runBackgroundJob`, and asserts `.maintenance-active.json` does not exist.
- Optional: add a busy-queue case with a controlled content loader/embedding stub to assert the marker appears while processing and is removed after completion.

## Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Notes |
|----------|--------|----------|-------|
| spec_code | pass | `spec.md:131-139`; `maintenance-marker.ts:58-85`; `memory-index.ts:1513-1551`; `retry-manager.ts:1030-1055` | Core claims resolve to shipped behavior. |
| checklist_evidence | partial | `tasks.md:63-65`; `implementation-summary.md:86-93` | Level 1 packet has no checklist.md; this lineage did not rerun verification commands. |

### Overlay Protocols

| Protocol | Status | Notes |
|----------|--------|-------|
| feature_catalog_code | notApplicable | Not selected for this lineage. |
| playbook_capability | notApplicable | Not selected for this lineage. |

AC_COVERAGE: exempt for this Level 1 packet without checklist.md.

## Deferred Items

- F001 is advisory test-hardening work and does not block this lineage's PASS verdict.
- Security, traceability, and maintainability dimensions were not covered in this max-1 lineage.

## Search Ledger

*No search-depth state captured (legacy v1 record)*.

## Audit Appendix

| Iteration | Focus | P0 | P1 | P2 | Ratio | Verdict |
|-----------|-------|----|----|----|-------|---------|
| 1 | correctness | 0 | 0 | 1 | 1.00 | PASS |

### Evidence Reads

- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts:58-85`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1513-1551`
- `.opencode/skills/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:1030-1055`
- `.opencode/skills/system-spec-kit/mcp_server/tests/maintenance-marker.vitest.ts:82-190`
- `.opencode/skills/system-spec-kit/mcp_server/tests/retry-manager.vitest.ts:662-683`

### Convergence Replay

- Max iterations reached: yes, 1 of 1.
- Dimension coverage: 1 of 4 = 0.25.
- Active P0/P1: none.
- Terminal verdict: PASS because only P2 advisories are active.

### Tool/Context Notes

- Code graph status was stale; direct file reads and exact Grep were used for evidence.
- `memory_context` failed with `E_SESSION_SCOPE`; packet docs were used as canonical continuity.
