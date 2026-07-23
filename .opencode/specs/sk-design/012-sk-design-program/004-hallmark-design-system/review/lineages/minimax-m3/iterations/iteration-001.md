# Iteration 1: D3 Traceability — Parent vs. Child Status Consistency

## Focus

**Dimension:** D3 Traceability (spec/code alignment, checklist evidence, cross-reference integrity). Specifically cross-reference integrity between the phase parent `spec.md`/`graph-metadata.json` and the five child phase folders.

**Files read:**
- `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md` (parent)
- `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/description.json` (parent)
- `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/graph-metadata.json` (parent)
- `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/001-surgical-fixes/spec.md` + `implementation-summary.md` + `checklist.md`
- `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/002-evidence-envelopes/spec.md`
- `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/003-authored-cards/spec.md` + `implementation-summary.md`
- `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/004-brand-first-lane/spec.md` + `implementation-summary.md`
- `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/spec.md` + `implementation-summary.md`
- `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/006-deep-alignment-and-review/alignment/alignment-report.md` + `deep-alignment-config.json` + `deep-alignment-findings-registry.json`
- `.opencode/specs/sk-design/012-sk-design-program/retrospective.md` (program-level)
- `.opencode/specs/sk-design/012-sk-design-program/spec.md` (program-level)
- `.opencode/skills/sk-design/shared/evidence-envelopes/{owned-asset-manifest.md, motion-character-handoff.md}` (claimed implementations exist)
- `.opencode/skills/sk-design/shared/authored-brand/{authored-brand-boundary.mjs, authored-design-template.md, authored-provenance-schema.md}` (claimed implementations exist)
- `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/` (claimed implementations exist, 7 cards)

## Scorecard

- **Dimensions covered:** D3 Traceability
- **Files reviewed:** 22 (parent + 5 children + 006 alignment + program + key implementation files)
- **New findings:** P0=1, P1=3, P2=1
- **Refined findings:** P0=0, P1=0, P2=0
- **New findings ratio:** 1.0 (post-iteration clamping per P0-override rule; calculated raw = (10.0 + 5 + 5 + 5 + 1) / (10 + 5 + 5 + 5 + 1) = 1.0)

## Findings

### P0, Blocker

- **F001**: Parent `spec.md` metadata reports `Status: Planned` and `completion_pct: 0` while every one of the five child phase folders (`001-surgical-fixes`, `002-evidence-envelopes`, `003-authored-cards`, `004-brand-first-lane`, `005-measured-composition-and-retrieval-facets`) reports `Status: Complete` with `completion_pct: 100` and a fully populated `implementation-summary.md`. The phase parent is the cross-reference anchor for the program retrospective and the four-lane adoption narrative; the contradiction is a release-blocking spec/code alignment failure regardless of whether the children are correct or the parent is correct. Evidence:
  - Parent: `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md:45` (`**Status** | Planned — the four adoption lanes are specced but not yet built`)
  - Parent: `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md:17` (`completion_pct: 0`)
  - Child 001: `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/001-surgical-fixes/spec.md:45` (`**Status** | Complete`), `completion_pct: 100` at line 27.
  - Child 002: same shape, status `Complete`, completion 100.
  - Child 003: same shape, status `Complete`, completion 100.
  - Child 004: same shape, status `Complete`, completion 100.
  - Child 005: `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/spec.md:51` (`Status: Complete`), `completion_pct: 100`.
  - Each child has an `implementation-summary.md` with a verified `## Verification` table (for example `001-surgical-fixes/implementation-summary.md:97-110`).
  - Sample shipped artifacts observed: `.opencode/skills/sk-design/shared/evidence-envelopes/{owned-asset-manifest.md, motion-character-handoff.md}` (5288 / 5888 bytes), `.opencode/skills/sk-design/shared/authored-brand/{authored-brand-boundary.mjs, authored-design-template.md, authored-provenance-schema.md}` (7537 / 4231 / 3258 bytes), `.opencode/skills/sk-design/shared/references/structural-fingerprint-cards/` (7 cards present).
- **Severity rationale:** The 5-of-5 children with full evidence + non-empty shipped artifacts makes the parent `Status: Planned` claim materially false regardless of which side is correct. This is a P0 because the contradiction (a) ships to readers via the program retrospective (next finding) and (b) blocks any release decision for the hallmark-adoption surface. The cross-reference failure is the dimension being audited; downgrading would defeat the audit.

### P1, Required

- **F002**: Parent `spec.md` §3 Files to Change references a single row `004-hallmark-design-system/00[1-4]-*/` (four lanes) but the filesystem contains five child phase folders (001-005) plus a `006-deep-alignment-and-review/` directory. The parent's "Phase Documentation Map" (spec.md:88-95) enumerates only four rows (001-004) and the parent `Files to Change` table reflects the same four-lane model. The fifth lane (`005-measured-composition-and-retrieval-facets`) is the largest scope drift: it is recognized by `graph-metadata.json` `children_ids` (line 12) but is not declared or scoped in the parent `spec.md`. Evidence:
  - Parent: `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md:80` (Files to Change row `004-hallmark-design-system/00[1-4]-*/`).
  - Parent: `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md:88-95` (Phase Documentation Map lists 001-004 only).
  - Parent: `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/graph-metadata.json:12` (children_ids includes 005).
  - File system: `004-hallmark-design-system/005-measured-composition-and-retrieval-facets/` exists as a full spec folder with its own `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`.
- **F003**: The parent `spec.md` §4 Open Questions is stale: it claims "the four adoption lanes are specced but not yet built — surfaced in the program retrospective.md as planned-but-missed work." This reference predates the implementation-record pass on each child. The "Planned but not built" claim is real only as a documentation drift, not as a packet state. Evidence: `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md:108-109`.
- **F004**: The program-level `retrospective.md` (`012-sk-design-program/retrospective.md:62-66`) lists all four hallmark adoption lanes under "Planned but not built" and concludes "All four adoption lanes are Planned, none built". This contradicts the per-packet `Status: Complete` (with shipped artifacts) on each of the four children. The retrospective is the operator-facing summary that drives the program-level opportunities backlog; the contradiction propagates downstream into the program spec, the `012-sk-design-program/description.json` keyword set, and any plan that reads the retrospective. Evidence: `.opencode/specs/sk-design/012-sk-design-program/retrospective.md:62-66` vs. the child spec.md metadata lines cited in F001.

### P2, Suggestion

- **F005**: The `006-deep-alignment-and-review/alignment/` subtree is a seeded but unrun deep-alignment run (`iterationsRun: 0`, `applicableLaneCount: 0`, `overall.verdict: FAIL`, `overall.sealed: false`, `overall.incompleteCoverage: true`, `lanes[*].verdict: NOT_APPLICABLE`). The 006 directory is not in the parent `graph-metadata.json` `children_ids` (which lists 001-005 only) and is not declared in the parent `spec.md` Files to Change table. The artifact is read-only context for this review, but if it is intended as a sixth phase or as a continuation child, the parent spec should either include it in `children_ids` and the phase map, or remove the worktree to avoid downstream confusion. Evidence:
  - `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/006-deep-alignment-and-review/alignment/alignment-report.md:9-11` (Verdict: FAIL; PRELIMINARY; not sealed).
  - `.opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/006-deep-alignment-and-review/alignment/deep-alignment-findings-registry.json:61-75` (overall fields).
  - Parent `graph-metadata.json:6-12` children_ids does not include 006.

## Cross-Reference Results

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| `spec_code` | **fail** | hard | parent spec.md:45 vs. 5 child spec.md metadata | The parent claims `Planned`; the children ship `Complete` with verified files. The contradiction is the headline audit result. |
| `checklist_evidence` | **partial** | hard | parent has no `checklist.md`; all 5 children have `checklist.md` with `[EVIDENCE: ...]` lines | No checklist evidence is required of the parent because it is a phase parent (lean trio), but the parent has no completion checklist, so the child evidence cannot resolve the parent status. |
| `feature_catalog_code` | **partial** | advisory | retrospective.md:62-66 claims "all four lanes planned" | Stale against child evidence; the catalog (children) is more current than the program summary. |
| `playbook_capability` | **notApplicable** | advisory | target is a spec folder, not a playbook | Not exercised. |

## Assessment

- **New findings ratio:** 1.0 — all five findings are this-iteration-never-before-seen. P0 override applies (raw ratio clamped to >= 0.50; effective ratio = 1.0).
- **Dimensions addressed:** D3 Traceability.
- **Novelty justification:** The cross-reference contradiction is a single, coherent audit signal that crosses the parent, the program, and the children. F001 is the load-bearing finding; F002, F003, F004 are the propagation of the same root cause; F005 is a separate, smaller documentation drift around the 006 worktree.

## Ruled Out

- Treating the parent `Status: Planned` as authoritative: ruled out because every child has shipped implementation artifacts and verified checklists, making the parent materially false regardless of which side is correct.
- Treating the child `Status: Complete` as authoritative without further code-graph or test verification: ruled out for F001-P0 — the parent is still conclusively wrong, but the per-child claims must be confirmed against the production code path before a release-blocking decision is finalized. Iteration 2 will audit the claims against the actual code.

## Dead Ends

- Trying to judge whether the parent or the children "should win" without checking the code: the in-scope evidence (spec folder discipline + shipped artifacts) is sufficient to confirm the contradiction but not to assign blame. Iteration 2 will use the code paths to triangulate.

## Recommended Next Focus

Iteration 2 (D1 Correctness): for each child that claims `Status: Complete`, verify that the claimed modifications exist on disk and that the verification claims (`validate.sh --strict`, fingerprint checks, file lists) actually hold. The 005 lane is the priority target because it is the undeclared child and its implementation summary says "Graph metadata absent under orchestrator ownership" — that is a direct conflict with the parent `graph-metadata.json` `children_ids` line that includes 005. Secondary focus: confirm the 002-evidence-envelopes files (`shared/evidence-envelopes/{owned-asset-manifest.md, motion-character-handoff.md}`) line up with the spec's "Create" rows.

## Claim Adjudication Packets

```json
{
  "findingId": "F001",
  "claim": "Parent spec.md metadata reports Status: Planned and completion_pct: 0 while all five child phase folders report Status: Complete and completion_pct: 100, contradicting the spec/code alignment that the phase parent is supposed to anchor.",
  "evidenceRefs": [
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md:17",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md:45",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/001-surgical-fixes/spec.md:27",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/001-surgical-fixes/spec.md:45",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/002-evidence-envelopes/spec.md:27",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/002-evidence-envelopes/spec.md:45",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/003-authored-cards/spec.md:45",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/004-brand-first-lane/spec.md:45",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/005-measured-composition-and-retrieval-facets/spec.md:51"
  ],
  "counterevidenceSought": "Searched the parent spec for buildtime markers, hidden status overrides, or generation script that might supersede the visible Status: Planned field. None found. Searched the program-level retrospective for an explicit override. None found.",
  "alternativeExplanation": "The parent spec.md could be a stale snapshot from before the implementation pass, with the program retrospective intentionally tracking the older state. This is rejected because the children claim Complete with verified evidence; the parent is the cross-reference anchor and must match the children, not the other way round.",
  "finalSeverity": "P0",
  "confidence": 0.90,
  "downgradeTrigger": "If the parent spec.md is regenerated to Status: Complete with completion_pct: 100 and the retrospective is updated to mark the four lanes complete, the contradiction resolves and F001 can be reclassified as P2 documentation-drift-resolved.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P0", "reason": "Initial discovery; 5-of-5 children claim Complete with shipped artifacts" }
  ]
}
```

```json
{
  "findingId": "F002",
  "claim": "Parent spec.md §3 Files to Change and the Phase Documentation Map declare four adoption lanes (001-004) but the filesystem contains five children (001-005) plus a 006-deep-alignment-and-review worktree.",
  "evidenceRefs": [
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md:80",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md:88-95",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/graph-metadata.json:12"
  ],
  "counterevidenceSought": "Searched the parent spec for a 'fifth lane' or 'measured composition' section. None found. Searched the program-level retrospective for explicit mention of the 005 lane. None found.",
  "alternativeExplanation": "The 005 lane could be a planned-but-undeclared appendage added by the orchestrator after the parent phase was authored. The implementation summary even says 'Parent map untouched. The existing phase-parent map remains unchanged under the requested scope lock.' This matches a deliberate scope lock, but it still needs to be reconciled with the parent spec.scope and the parent spec.md.handoff criteria.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If the parent spec.md is updated to add a fifth lane row to the Phase Documentation Map and the Files to Change table, the cross-reference resolves and F002 can be downgraded to P2.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery; five children exist on disk but only four are declared in the parent spec" }
  ]
}
```

```json
{
  "findingId": "F003",
  "claim": "Parent spec.md §4 Open Questions still claims the four adoption lanes are specced but not yet built, which is now stale against the per-packet implementation summaries.",
  "evidenceRefs": [
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/spec.md:108-109"
  ],
  "counterevidenceSought": "Searched the parent spec for ambiguity around 'specced but not yet built'. None found.",
  "alternativeExplanation": "Could be an intentional 'planned-but-missed' marker that the program retrospective tracks. This is rejected because the children are shipped, so the marker is stale.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "If the parent spec.md §4 Open Questions is updated to reflect the implementation-record state of the children, F003 can be downgraded to P2.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery; stale open question references pre-implementation state" }
  ]
}
```

```json
{
  "findingId": "F004",
  "claim": "Program retrospective.md §2 'Planned but not built' lists all four hallmark adoption lanes as Planned but the per-packet spec.md metadata and implementation summaries show Status: Complete.",
  "evidenceRefs": [
    ".opencode/specs/sk-design/012-sk-design-program/retrospective.md:62-66",
    ".opencode/specs/sk-design/012-sk-design-program/retrospective.md:88"
  ],
  "counterevidenceSought": "Searched the retrospective for an explicit override specifying that the four lanes are still pending re-verification. None found.",
  "alternativeExplanation": "Could be a deliberate staging-order artifact (the retrospective is written before the final pass). The retrospective.md `last_updated_at: 2026-07-22T16:57:27Z` and the child 001 `last_updated_at: 2026-07-22T18:00:04Z` timestamp sequence makes the staging-order theory plausible but still leaves the retrospective as the authoritative read for downstream consumers until it is updated.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If the retrospective is updated to mark the four hallmark adoption lanes as Complete (or alternatively, the children are re-verified to have been rolled back), F004 can be downgraded to P2.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery; program-level summary contradicts per-packet state" }
  ]
}
```

```json
{
  "findingId": "F005",
  "claim": "The 006-deep-alignment-and-review/alignment/ subtree is a seeded but unrun deep-alignment run; the parent graph-metadata.json children_ids does not include 006, and the parent spec.md does not declare it.",
  "evidenceRefs": [
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/006-deep-alignment-and-review/alignment/alignment-report.md:9-11",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/006-deep-alignment-and-review/alignment/deep-alignment-findings-registry.json:61-75",
    ".opencode/specs/sk-design/012-sk-design-program/004-hallmark-design-system/graph-metadata.json:6-12"
  ],
  "counterevidenceSought": "Searched the parent spec for an explicit 'anchored alignment worktree' note. None found. Searched the parent description.json keywords for 'alignment'. None found.",
  "alternativeExplanation": "Could be a transient worktree left over from a previous alignment run that did not get cleaned up. This is consistent with the unrun `iterationsRun: 0` state, but does not change the documentation drift.",
  "finalSeverity": "P2",
  "confidence": 0.80,
  "downgradeTrigger": "If the 006 directory is either cleaned up or formally added to the parent children_ids and phase map, F005 can be resolved.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P2", "reason": "Initial discovery; documentation drift only" }
  ]
}
```

Review verdict: FAIL
