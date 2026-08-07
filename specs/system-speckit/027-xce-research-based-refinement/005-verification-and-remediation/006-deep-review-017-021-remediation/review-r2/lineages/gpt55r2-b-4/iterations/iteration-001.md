# Iteration 1: Correctness And Delete-Safety Pass

## Focus

Reviewed the scope manifest and sampled the highest-risk non-search memory lifecycle surfaces: single/folder delete, bulk delete, retention sweep, background index scan, async ingest queue, maintenance job store, path discovery, provenance, idempotency receipts, and incremental index cleanup.

## Scorecard

- Dimensions covered: correctness, security
- Files reviewed: 15
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P0, Blocker

None.

### P1, Required

- **F001**: `memory_delete` does not enforce the documented mutually-exclusive delete modes. The public schema describes the tool as requiring EITHER `id` or `specFolder`, and the Zod schema only rejects the case where both are missing; it does not reject both being present. The handler then chooses the single-id branch whenever `id` is present, ignoring `specFolder`, so a caller that supplies both can delete an arbitrary record by id while believing the operation is constrained to the supplied folder. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:454-464] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:279-302] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:106-128]

```json
{
  "findingId": "F001",
  "claim": "memory_delete accepts both id and specFolder, then deletes by id without verifying the id belongs to the supplied specFolder.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:454-464",
    ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:279-302",
    ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:106-128"
  ],
  "counterevidenceSought": "Checked the tool schema, Zod schema, dispatch path, and delete handler. The schema advertises EITHER mode but only checks confirm and at-least-one; the dispatch passes validated args directly to the handler; the handler selects id mode whenever id is present.",
  "alternativeExplanation": "The API may intentionally allow id to take precedence over specFolder, but the public contract says EITHER id or specFolder and the folder field is documented as a scoped bulk delete input, so silent precedence is unsafe for a destructive tool.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Downgrade only if a validator outside validateToolArgs rejects simultaneous id and specFolder before handleMemoryDelete can run, or if the public contract is intentionally changed to state that id always takes precedence.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

### P2, Suggestion

None.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:3-14` | One-iteration sample covered destructive delete/write lifecycle paths, not the full scoped surface. |
| checklist_evidence | pass | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation/review-r2/scopes/B-rest-of-002/spec.md:1-17` | No checklist exists in the scope folder; no checked completion claims to verify. |
| feature_catalog_code | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:454-464` | Delete contract drift found between schema prose and handler behavior. |
| playbook_capability | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:106-128` | Destructive delete playbook should reject ambiguous mode inputs. |

## Assessment

- New findings ratio: 1.0
- Dimensions addressed: correctness, security
- Novelty justification: Found one new destructive-write scope-safety defect with direct schema and handler evidence.

## Ruled Out

- Retention-edge orphaning: `delete_memory_from_database` calls `deleteAncillaryMemoryRows`, which sweeps causal edges before deleting the memory row. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:717-758] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:159-208]
- Background scan lease leak: `runIndexScan` releases the scan lease in both explicit completion and `finally`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:480-485] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts:1483-1494]

## Dead Ends

- Full search/retrieval review was intentionally skipped because scope A owns that pipeline.

## Recommended Next Focus

Patch `memory_delete` validation to reject simultaneous `id` and `specFolder`, or require a membership check when both are supplied.
Review verdict: CONDITIONAL
