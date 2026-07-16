# Iteration 003 - Traceability

## Dispatcher
- Focus dimension: traceability
- Review target: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement`
- State packet: `review/lineages/codex-2`

## Files Reviewed
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/description.json`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json`
- `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json`

## Findings - New
### P1
- **F003**: Top-level child description specIds are stale after renumbering - `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/description.json:33` - The current child paths are 001-008, but top-level child `description.json` files still carry the old sequence: 001 has `specId: "008"`, 002 has `specId: "001"`, and 008 has `specId: "007"`. The same off-by-one pattern applies through the intervening children. [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/description.json:14`] [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/description.json:33`] [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json:27`] [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json:38`] [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:40`] [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:53`]

### P2
- **F004**: The 000 placeholder is advertised as a child phase even though it has no spec or metadata - `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:130` - Parent spec, description metadata, and graph metadata all advertise `000-release-cleanup` as a child. Direct filesystem inspection found only `.gitkeep` placeholder files under that subtree. The validator skips such placeholders, so this is a launch-readiness cleanup item rather than a validation blocker. [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:130`] [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:27`] [SOURCE: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:6`]

## Claim Adjudication
```json
[
  {
    "findingId": "F003",
    "claim": "Top-level child description.json files retain old specId values after the current 001-008 folder renumbering.",
    "evidenceRefs": [
      ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/description.json:14",
      ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/description.json:33",
      ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json:27",
      ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json:38",
      ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:40",
      ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:53"
    ],
    "counterevidenceSought": "Checked every top-level child description.json; nested child descriptions under 001 and 008 use matching local ids, so the drift is limited to top-level children after the inserted peck phase.",
    "alternativeExplanation": "The generator may treat specId as immutable historical identity, but description specFolder and parent maps use current folder identity, so mixing both meanings is unsafe for launch routing.",
    "finalSeverity": "P1",
    "confidence": 0.93,
    "downgradeTrigger": "Downgrade if the metadata contract explicitly defines specId as historical identity and all consumers are proven to route by specFolder only."
  }
]
```

## Traceability Checks
- `spec_code`: partial. Parent map and child paths mostly align, but `specId` identity and placeholder-child metadata are not fully truthful.
- `checklist_evidence`: pass by absence. This Level 1 audit slice has no checklist.md with checked boxes.

## Next Focus
Maintainability pass on parent-level support docs and lean-parent wording.

Review verdict: CONDITIONAL
