# Iteration 003 - Traceability

## Dispatcher

- Dimension: traceability
- Focus: renumbering drift, child metadata consistency, and status handoff claims
- Session: fanout-codex-1-1780596675702-e5bokn

## Files Reviewed

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:138`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/spec.md:3`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/spec.md:64`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json:38`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/description.json:41`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:2`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:53`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/spec.md:48`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:42`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/implementation-summary.md:3`

## Findings - New

### P0

- None.

### P1

- **F002**: Renumbered child metadata and docs still advertise old phase numbers - `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:53` - The current parent map identifies learning feedback reducers as `005-learning-feedback-reducers`, but the child description still titles it as "009", uses `027 phase 009` triggers, and reports `specId: "007"`. The same stale-number pattern appears in `002-memory-write-safety` (`specId: "001"` for folder `002`) and `004-semantic-trigger-fallback` (`specId: "006"` for folder `007`). [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:53]

#### Claim Adjudication - F002

```json
{
  "claim": "The launch metadata still contains pre-renumbering phase ids and path references.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:138",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:2",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:53",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/spec.md:64"
  ],
  "counterevidenceSought": "Compared the current parent phase map, child spec.md files, child description.json files, and representative stale old-path references.",
  "alternativeExplanation": "Some old numbers are intentionally retained as historical context, but these occur in active trigger phrases, specId fields, and dependency fields rather than only in context-index history.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if the metadata indexer ignores specId, trigger phrases, and dependency text for routing/resume."
}
```

- **F003**: Graph metadata marks draft placeholder phases complete - `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:42` - Phases 003-006 are listed as Draft in their specs and their implementation summaries explicitly say no implementation changes are claimed until completed after code and tests land, but their graph metadata records `derived.status` as `complete`. That makes the graph/resume surface report completion while the canonical spec docs remain planning placeholders. [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:42]

#### Claim Adjudication - F003

```json
{
  "claim": "The graph metadata completion state for phases 003-006 contradicts their spec and implementation-summary state.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/spec.md:48",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/implementation-summary.md:3",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/003-incremental-index-foundation/graph-metadata.json:42"
  ],
  "counterevidenceSought": "Checked the corresponding spec status and implementation summary for completion evidence before treating graph metadata as wrong.",
  "alternativeExplanation": "The complete state may mean planning-complete, but graph metadata does not label it that way and downstream status consumers use the generic status field.",
  "finalSeverity": "P1",
  "confidence": "high",
  "downgradeTrigger": "Downgrade to P2 if graph metadata status is proven unused for resume, search, and graph traversal."
}
```

### P2

- None.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| spec_code | fail | Current parent phase numbers do not match several child `description.json.specId` and trigger fields. |
| checklist_evidence | partial | Checked completion-style claims were limited to metadata and implementation summaries; no review-slice checklist exists. |
| feature_catalog_code | notApplicable | No feature catalog claim was part of this pass. |
| playbook_capability | notApplicable | No playbook capability was part of this pass. |

## Confirmed-Clean Surfaces

- The parent `context-index.md` correctly preserves the renumbering history outside the parent spec body.
- The root parent `graph-metadata.json.derived.last_active_child_id` points at the current peck child path.

## Assessment

- Dimensions addressed: traceability
- Iteration verdict basis: two new P1 traceability findings, no P0.

## Next Focus

Review maintainability and parent-doc clarity, including resource-map coverage and wording that may mislead future operators.
Review verdict: CONDITIONAL
