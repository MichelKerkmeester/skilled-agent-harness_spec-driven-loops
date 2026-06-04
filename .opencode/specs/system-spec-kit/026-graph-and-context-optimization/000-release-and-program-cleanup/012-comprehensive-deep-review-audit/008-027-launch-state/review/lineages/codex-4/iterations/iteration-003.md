# Iteration 003 - Traceability

## Focus

Spec-folder naming, generated metadata alignment, and parent-child traceability after 027 renumbering.

## Files Reviewed

- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/description.json`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/description.json`

## Findings

### P1-002: Renumbered 027 child descriptions still advertise old specId values

Severity: P1  
Category: metadata-naming-drift  
Finding class: spec-folder-naming  
Evidence:

- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:131`] Parent phase map lists `001-peck-teachings-adoption/` as phase 001.
- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/description.json:33`] The same child description still says `"specId": "008"`.
- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json:38`] The `002-memory-write-safety` description still says `"specId": "001"`.
- [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/description.json:53`] The `008-learning-feedback-reducers` description still says `"specId": "007"`.

The parent and graph child paths now use the new 001-008 numbering, but the generated child `description.json` ids still carry the old numbering. That is launch-state drift because metadata consumers can display, search, or route these phases under stale ids even when the folder path is correct.

Concrete fix: regenerate `description.json` for children 001-008, then verify each `specId` equals its folder prefix.

## Claim Adjudication

```json
{
  "findingId": "P1-002",
  "claim": "Renumbered 027 child descriptions still advertise old specId values.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:131",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/description.json:33",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json:38",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/008-learning-feedback-reducers/description.json:53"
  ],
  "counterevidenceSought": "Checked parent description/graph children and child specFolder fields; paths were updated while specId fields remained stale.",
  "alternativeExplanation": "specId might be intended as historical identity, but sibling metadata and folderSlug fields present it alongside current specFolder, so consumers have no marker that it is historical.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "Downgrade if the metadata schema documents specId as immutable historical identity and exposes a separate current numeric id for routing/display.",
  "transitions": []
}
```

## Traceability Protocols

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | partial | parent map plus child description files | Child folders exist, but metadata ids do not fully align. |
| `checklist_evidence` | partial | slice is Level 1 and has no checklist | Iteration/report artifacts carry evidence instead. |

Review verdict: CONDITIONAL
