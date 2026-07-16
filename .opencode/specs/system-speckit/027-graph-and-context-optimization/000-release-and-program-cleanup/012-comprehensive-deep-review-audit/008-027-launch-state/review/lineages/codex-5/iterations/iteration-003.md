# Iteration 003 - Traceability

## Focus

Renumbered child metadata and 026 alignment.

## Findings

### F002 - P1 - Renumbered child metadata still exposes old phase ids and titles

`context-index.md` states that on 2026-06-04 the peck phase was renumbered to `001` and the remaining memory phases became a contiguous `002-008` sequence [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:29]. The mapping specifically says `008-peck-teachings-adoption/` is now `001-peck-teachings-adoption/` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:33].

The child metadata is only partially aligned. `001-peck-teachings-adoption/description.json` still has `"specId": "008"` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/description.json:33]. `002-memory-write-safety/description.json` is titled "Phase 012" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json:2] and still has `"specId": "001"` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json:38]. `004-semantic-trigger-fallback/description.json` is titled "Phase 008" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/description.json:2] while its `specId` is `"006"` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/description.json:41]. `005-learning-feedback-reducers/description.json` is titled "009" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:2] while its `specId` is `"007"` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:53].

Impact: spec search, memory routing, and operator resume can surface stale phase numbers even though the folder names were renumbered. Fix by regenerating child descriptions and graph metadata from current folder names, then validating that titles, trigger phrases, `specId`, `specFolder`, and parent chains agree.

Claim adjudication packet:

```json
{
  "findingId": "F002",
  "claim": "Renumbered 027 child folders still expose stale phase ids and titles in description metadata.",
  "evidenceRefs": [
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:29",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/description.json:33",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json:2",
    ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/005-learning-feedback-reducers/description.json:53"
  ],
  "counterevidenceSought": "Checked parent phase map, context-index renumbering table, and child description metadata.",
  "alternativeExplanation": "Some old phase numbers may be historical provenance, but these fields are machine-facing metadata rather than narrative history.",
  "finalSeverity": "P1",
  "confidence": 0.91,
  "downgradeTrigger": "Downgrade to P2 if consumers ignore title, trigger phrase, and specId fields for routing and display."
}
```

### F005 - P2 - 027 launch review does not pin which 026 completion surface it builds on

The review slice says 027 should be checked for alignment with "the 026 completion it builds on" [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state/spec.md:37] and repeats that focus as "alignment with 026 completion state" [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/008-027-launch-state/spec.md:62].

The top-level 026 packet is still marked `In Progress` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:43], while the 026 release-and-program-cleanup child is marked `Complete` [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/spec.md:39]. The 027 parent related docs do not explicitly name either surface as its handoff base [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:187].

Impact: the launch audit can pass against the wrong "026 completion" truth. Fix by naming the exact 026 surface 027 builds on, likely the completed `000-release-and-program-cleanup` release gate rather than the still-in-progress 026 root.

## Verdict Rationale

One P1 and one P2 were found. No P0 was found.

Review verdict: CONDITIONAL
