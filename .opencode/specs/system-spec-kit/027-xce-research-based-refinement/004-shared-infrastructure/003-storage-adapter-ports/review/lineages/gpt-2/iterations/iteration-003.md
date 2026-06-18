# Iteration 003: Traceability

## Focus
Compared spec completion claims and REQ-002 contract-test expectations against the actual VectorStore adapter, fake, and contract tests.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 7
- New findings: P0=0 P1=1 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.8333

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: VectorStore contract suite misses caller-supplied ID parity. The shared `StorageId` type allows `number | string`, and the `VectorStore` interface accepts a `VectorRecord.id`, but `BetterSqliteVectorStore.upsert(record)` ignores that ID for persisted lookup and routes through legacy memory indexing, while `get` and `delete` coerce lookup IDs through `Number(id)`. The fake preserves the original key. The shared contract test upserts records with IDs like `left` and `right`, but then fetches/deletes by `String(results[0]?.id)` instead of asserting `get('left')` or `delete('left')`, so fake and production implementations can pass with different semantics. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/common.ts:8-9] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:79-93] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:175-187] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:236-260] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/storage-ports-contract.vitest.ts:276-304] [SOURCE: .opencode/skills/system-spec-kit/mcp_server/tests/fakes/storage-ports.ts:188-197]

### P2, Suggestion
- None.

## Claim Adjudication
```json
{
  "findingId": "F001",
  "claim": "The VectorStore contract test does not verify that caller-supplied record IDs work the same way for the better-sqlite adapter and fake, so an alternative implementation could pass while diverging from production semantics.",
  "evidenceRefs": [
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/common.ts:8-9",
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:79-93",
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:175-187",
    ".opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/vector-store.ts:236-260",
    ".opencode/skills/system-spec-kit/mcp_server/tests/storage-ports-contract.vitest.ts:276-304",
    ".opencode/skills/system-spec-kit/mcp_server/tests/fakes/storage-ports.ts:188-197"
  ],
  "counterevidenceSought": "Checked production VectorStore call sites, storage port contract tests, fake implementation, and vector-index legacy mutation/query helpers. The only shared contract assertions fetch and delete by the returned search result id, not the original upsert record id.",
  "alternativeExplanation": "The better-sqlite adapter may intentionally expose generated memory IDs rather than caller-provided IDs for legacy compatibility. That still leaves the typed port and fake contract ambiguous, so the finding remains P1 against REQ-002 contract validation rather than a current production P0.",
  "finalSeverity": "P1",
  "confidence": 0.86,
  "downgradeTrigger": "Downgrade to P2 if the VectorStore interface explicitly documents generated-ID semantics and the fake plus contract tests are updated to validate that behavior.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery during traceability protocol review." }
  ]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/015-storage-adapter-ports/spec.md:113-116`; `.opencode/skills/system-spec-kit/mcp_server/tests/storage-ports-contract.vitest.ts:276-304` | REQ-002 contract validation misses VectorStore ID parity. |
| checklist_evidence | partial | hard | `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/015-storage-adapter-ports/tasks.md:69-88`; `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/015-storage-adapter-ports/implementation-summary.md:143-174` | Completion evidence does not cover F001. |
| feature_catalog_code | pass | advisory | `.opencode/skills/system-spec-kit/mcp_server/lib/storage/ports/index.ts:5-49` | Five port surfaces are exported. |
| playbook_capability | partial | advisory | `.opencode/skills/system-spec-kit/mcp_server/tests/storage-ports-contract.vitest.ts:422-439` | Contract tests run but miss the original-ID case. |

## Assessment
- New findings ratio: 0.8333
- Dimensions addressed: traceability
- Novelty justification: First required traceability pass found a contract coverage gap tied to REQ-002.

## Ruled Out
- Missing `checklist.md` is not itself a finding because this is a Level 1 packet and completion evidence is in `tasks.md` and `implementation-summary.md`.

## Dead Ends
- No missing export found in the port index.

## Recommended Next Focus
Review maintainability and routing simplicity, then run a stabilization pass.
Review verdict: CONDITIONAL
