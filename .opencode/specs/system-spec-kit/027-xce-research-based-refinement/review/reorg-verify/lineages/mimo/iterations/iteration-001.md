# Iteration 1: Correctness

## Focus
Correctness dimension. Parent-child inventory consistency, phase-map accuracy, and metadata drift between spec.md, description.json, and graph-metadata.json.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 8
- New findings: P0=0 P1=3 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.60

## Findings

### P0, Blocker

(none)

### P1, Required

- **F001**: Parent spec.md phase-map status stale for 000-release-cleanup, `spec.md:127`, Parent says "In Progress" but child frontmatter says `status: "completed"` with `completion_pct: 100`.
- **F002**: 004-shared-infrastructure spec.md phase map omits child 008, `004-shared-infrastructure/spec.md:109-118`, Phase map lists 001-007 but disk has 8 children including `008-mcp-config-alignment-reelection-default/`. key_files in frontmatter also misses 008.
- **F003**: description.json.description stale from pre-regrouping, `description.json:36`, Still reads "Residual 029 design units: vector reconcile, launcher front-proxy port, hash-class replay pool, defer-by-design bucket" — predates the six-track regrouping and does not match the current packet purpose.

### P2, Suggestion

- **F004**: 002-memory-store-and-search key_files incomplete, `002-memory-store-and-search/spec.md:22-28`, Lists 7 children (001-006) but disk has 14 children (001-014). Missing 007-014 from key_files.
- **F005**: 004-shared-infrastructure key_files incomplete, `004-shared-infrastructure/spec.md:22-28`, Lists 7 children (001-007) but disk has 8 children (001-008). Missing 008 from key_files.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:127, 000-release-cleanup/spec.md:10 | Phase-map statuses need spot-verification |
| checklist_evidence | skipped | hard | n/a | Phase parent: no parent checklist expected |

## Assessment
- New findings ratio: 0.60
- Dimensions addressed: correctness
- Novelty justification: 3 P1 findings from metadata drift between parent and child surfaces; 2 P2 advisory from incomplete key_files lists

## Ruled Out
- graph-metadata.json children_ids: matches disk (6 tracks confirmed)
- description.json children array: matches disk (6 tracks confirmed)

## Dead Ends
- (none)

## Recommended Next Focus
Security dimension. Check for credential exposure, unsafe paths, and trust boundary issues in research logs and configuration files.

## Claim Adjudication Packets

```json
{
  "findingId": "F001",
  "claim": "Parent spec.md phase-map status column says 'In Progress' for 000-release-cleanup, but child frontmatter says status: completed with completion_pct: 100.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:127",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/spec.md:10-11",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/000-release-cleanup/spec.md:27"
  ],
  "counterevidenceSought": "Checked 000-release-cleanup graph-metadata.json and description.json for contradicting status — both confirm completion. Checked other track statuses for similar drift.",
  "alternativeExplanation": "Could be intentional 'In Progress' meaning 'children still need final validation', but child _memory says 'All 9 children shipped; statuses reconciled at epic close' so this is rejected.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "If parent spec.md status is updated to 'Complete' for 000-release-cleanup.",
  "transitions": []
}
```

```json
{
  "findingId": "F002",
  "claim": "004-shared-infrastructure spec.md phase map lists only 7 children (001-007) but disk has 8 children including 008-mcp-config-alignment-reelection-default.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/spec.md:109-118",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/008-mcp-config-alignment-reelection-default/spec.md"
  ],
  "counterevidenceSought": "Checked if 008 is a symlink, placeholder, or empty — it has a real spec.md. Checked graph-metadata.json for 004 children — not explicitly listed at parent level.",
  "alternativeExplanation": "008 could be a recently scaffolded child not yet added to the phase map. But the child exists on disk with a spec.md, so it should be listed.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "If 008 is added to the 004-shared-infrastructure phase map.",
  "transitions": []
}
```

```json
{
  "findingId": "F003",
  "claim": "description.json.description field still references 'Residual 029 design units' which predates the six-track regrouping and does not match the current packet purpose.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:36"
  ],
  "counterevidenceSought": "Checked if the description is used by any automated consumer that would break if changed — memory search uses trigger_phrases and title, not description. Checked spec.md for matching text — none.",
  "alternativeExplanation": "Could be intentional retention of historical provenance, but description field should describe current state, not historical origin.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If description.json.description is updated to reflect the six-track refinement purpose.",
  "transitions": []
}
```

```json
{
  "findingId": "F004",
  "claim": "002-memory-store-and-search key_files lists only 7 of 14 children on disk.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/spec.md:22-28"
  ],
  "counterevidenceSought": "Checked if key_files is intentionally selective — it lists the first 6 children, suggesting it was written when only 6 existed. Later children 007-014 were added without updating key_files.",
  "alternativeExplanation": "key_files may be intentionally curated to list only the most important children. However, the pattern of listing sequentially suggests it was meant to be exhaustive.",
  "finalSeverity": "P2",
  "confidence": 0.80,
  "downgradeTrigger": "Already P2. Could be resolved if key_files is updated or if policy clarifies that key_files is selective.",
  "transitions": []
}
```

```json
{
  "findingId": "F005",
  "claim": "004-shared-infrastructure key_files lists only 7 of 8 children on disk.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/spec.md:22-28"
  ],
  "counterevidenceSought": "Checked if 008 is a recent addition — its presence on disk with a spec.md suggests it should be in key_files.",
  "alternativeExplanation": "Same as F004 — key_files may be selective. But the sequential pattern suggests omission by oversight.",
  "finalSeverity": "P2",
  "confidence": 0.80,
  "downgradeTrigger": "Already P2. Resolved if key_files is updated.",
  "transitions": []
}
```

Review verdict: CONDITIONAL
