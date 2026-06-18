# Deep Review Report: B-rest-of-002 Lineage gpt55r2-b-4

## Executive Summary

- Verdict: CONDITIONAL
- Stop reason: maxIterationsReached
- Iterations: 1 of 1
- Release-readiness state: in-progress
- Active findings: P0=0 P1=1 P2=0
- hasAdvisories: false
- Scope: memory store, index, and lifecycle non-search code under `.opencode/skills/system-spec-kit/mcp_server/`, sampled through the supplied B-rest-of-002 scope manifest.

This lineage found one active P1 destructive-tool contract defect. No P0 was confirmed in the one iteration.

## Planning Trigger

Route to remediation planning because a P1 remains active. The required fix is small and localized: `memory_delete` should reject simultaneous `id` and `specFolder`, or verify that the supplied `id` belongs to the supplied `specFolder` before deleting.

## Active Finding Registry

| ID | Severity | Status | Dimension | Evidence | Summary |
|----|----------|--------|-----------|----------|---------|
| F001 | P1 | active | correctness | `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:454-464`; `.opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:279-302`; `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:106-128` | `memory_delete` advertises mutually-exclusive single-id or folder delete modes, but validation permits both and the handler silently prioritizes `id`. |

## Remediation Workstreams

| Workstream | Findings | Action |
|------------|----------|--------|
| Destructive delete input contract | F001 | Add mutual-exclusion validation in `memoryDeleteSchema` and/or `handleMemoryDelete`; include a regression test for `{ id, specFolder, confirm: true }`. |

## Spec Seed

- The delete mutation contract should explicitly state and enforce one of two modes: single-record `id` delete or folder-scoped `specFolder` bulk delete.
- If both inputs are ever accepted intentionally, the contract must require membership validation and must document precedence.

## Plan Seed

1. Update `memoryDeleteSchema.superRefine` to reject `id !== undefined && specFolder !== undefined` with an `E_VALIDATION` issue.
2. Add a defensive handler guard in `handleMemoryDelete` before branch selection.
3. Add tests covering missing mode, both modes, valid id mode, and valid folder mode.
4. Re-run the memory MCP handler/unit test gate for destructive delete paths.

## Traceability Status

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:3-14` | One iteration sampled high-risk destructive write lifecycle paths, not the entire scoped surface. |
| checklist_evidence | pass | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:1-17` | No checklist exists in this scope folder. |
| feature_catalog_code | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:454-464` | Delete mode contract drift confirmed. |
| playbook_capability | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:106-128` | Destructive delete playbook should reject ambiguous mode inputs. |

## Deferred Items

- Full traceability and maintainability coverage remained incomplete because this fan-out lineage was capped at one iteration.
- Remaining scope areas for another lineage/pass: semantic trigger fallback, learning-feedback reducers, memclaw-derived hardening, OpenLTM continuity/resilience, and broader 002 non-search handler/lib paths.

## Audit Appendix

| Iteration | Focus | Verdict | New Findings Ratio | Findings |
|-----------|-------|---------|--------------------|----------|
| 1 | correctness/security | CONDITIONAL | 1.0 | P0=0 P1=1 P2=0 |

### Files Sampled

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-scan-jobs.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-ingest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts`
- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-queue.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/write-provenance.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/maintenance-marker.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/storage/incremental-index.ts`

### Replay Validation

- JSONL config record present: yes
- Iteration record present: yes
- Iteration final line parseable: `Review verdict: CONDITIONAL`
- Active P0/P1/P2 recomputed from registry: 0/1/0
- Synthesis verdict: CONDITIONAL, matching active P1 and no P0
- Legal stop: maxIterationsReached; coverage gate remains incomplete by design for this one-iteration lineage

### Continuity Note

Phase save was not requested. No canonical spec documents or memory indexes were modified outside the bound lineage artifact directory.
