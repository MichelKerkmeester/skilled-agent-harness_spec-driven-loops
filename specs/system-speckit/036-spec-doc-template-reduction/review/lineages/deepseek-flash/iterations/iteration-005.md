# Iteration 005: D3 Traceability — Cross-Doc Consistency (tasks/impl-summary/graph metadata/description)

## Focus
checklist_evidence + cross-reference integrity: tasks.md vs spec REQ ids, implementation-summary completion claims, graph-metadata.json/description.json consistency, parent-child linkage.

## Scorecard
- Dimensions covered: traceability (completes dimension)
- Files reviewed: 8 (001 tasks.md, 001 implementation-summary.md, 002 tasks.md, 002 implementation-summary.md, parent graph-metadata.json, 001 graph-metadata.json, 001 description.json, 002 description.json)
- New findings: P0=0 P1=2 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.24

## Findings

### P1, Required
- **F018**: Scaffolded implementation-summary.md claims "Completed 2026-08-26" for unstarted phases, `001-analysis/implementation-summary.md:42`, [Description: the metadata table reads `| **Completed** | 2026-08-26 |` while the phase is unstarted — 001 spec.md is 100% placeholder, tasks.md 100% placeholder, and 002 spec.md:50 declares Status Draft. The summary body is entirely bracketed template text (`[Opening hook: ...]`, `[What this feature does...]`, line 59-64). A completion claim with zero delivered work is a false-completion signal in exactly the surface deriveStatus and the resume ladder trust. Same scaffold in 002 implementation-summary.md:42.] (dimension: traceability — checklist_evidence fail)
- **F020**: Parent graph-metadata.json orphans all six child phases, `specs/system-speckit/036-spec-doc-template-reduction/graph-metadata.json:6`, [Description: `children_ids: []` despite six child folders; every child's graph-metadata.json carries `parent_id: null` (001:5); and parent spec.md:142 promises a `derived.last_active_child_id` pointer that does not exist in the file. Graph traversal of the packet is broken — children are unreachable from the parent and vice versa.] (dimension: traceability)

### P2, Suggestion
- **F019**: tasks.md files are 100% scaffold placeholders in every phase, `001-analysis/tasks.md:63-66`, [Description: identical T001-T010 placeholder rows (`[Implement core feature 1]` etc.) in 001 and 002 (verified; same scaffold across all six by construction); no task maps to any spec REQ id, so REQ→task traceability does not exist for the packet.] (dimension: traceability)
- **F021**: 001 description.json is placeholder pollution, `001-analysis/description.json:4-14`, [Description: description holds the raw template placeholder and keywords are the tokenized placeholder words ("broken","missing","inefficient","sentences","describing","specific","pain","point") — index/keyword pollution that search and memory indexing will ingest. Also `level` encodings are inconsistent across the packet ("1" string here, "phase" at parent).] (dimension: traceability)
- **F022** (evidence extension of F009): 002 description.json description is truncated mid-sentence, `002-tasks-checklist-merge/description.json:4`, [Description: ends "...task rows duplicate checklist" — the spec.md:89 text continues "item intent". The garbled-description family (F009) extends into generated metadata files, not just example docs and the decision-record L3+ frontmatter.] (dimension: traceability)

## Claim Adjudication Packets (new P0/P1)

```json
{
  "findingId": "F018",
  "claim": "Scaffolded implementation-summary.md files assert a Completed date for phases with zero authored work, producing a false completion signal on the surface status derivation trusts.",
  "evidenceRefs": [
    "specs/system-speckit/036-spec-doc-template-reduction/001-analysis/implementation-summary.md:42",
    "specs/system-speckit/036-spec-doc-template-reduction/001-analysis/implementation-summary.md:59-64",
    "specs/system-speckit/036-spec-doc-template-reduction/002-tasks-checklist-merge/implementation-summary.md:42",
    "specs/system-speckit/036-spec-doc-template-reduction/002-tasks-checklist-merge/spec.md:50"
  ],
  "counterevidenceSought": "Checked whether the Completed date could refer to scaffolding rather than implementation; compared with spec Status fields (Draft/placeholder) and tasks.md completion marks (all unchecked). The metadata field is unambiguously a completion claim.",
  "alternativeExplanation": "The Completed date may be a template default (TODAY at scaffold time) rather than an authored claim. Rejected as harmless: the rendered doc is what tooling reads, and a completion claim on unstarted work is a defect regardless of origin.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If create.sh is changed to emit no Completed date on scaffolds (or 'Pending'), downgrade to P2 residue once the shipped fleet no longer carries the claim.",
  "transitions": [{ "iteration": 5, "from": null, "to": "P1", "reason": "Initial discovery during checklist_evidence sweep" }]
}
```

```json
{
  "findingId": "F020",
  "claim": "The parent graph-metadata.json declares zero children and children declare null parents, so graph-based traversal of the 036 packet is broken, and the promised last_active_child_id pointer is absent.",
  "evidenceRefs": [
    "specs/system-speckit/036-spec-doc-template-reduction/graph-metadata.json:6",
    "specs/system-speckit/036-spec-doc-template-reduction/001-analysis/graph-metadata.json:5",
    "specs/system-speckit/036-spec-doc-template-reduction/spec.md:142"
  ],
  "counterevidenceSought": "Listed the actual child folders (001-006 exist on disk) and checked the parent spec's own Phase Documentation Map (spec.md:102-107) which names all six; the graph metadata disagrees with both the filesystem and the spec.",
  "alternativeExplanation": "The graph metadata may be regenerated lazily by graph tooling on next save (save_lineage: graph_only). Rejected: the file is the persisted source of truth and the spec references a field it does not contain.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If graph tooling regenerates children_ids/parent_id/last_active_child_id on next indexed save (making this a transient snapshot), downgrade to P2 and note the regeneration path.",
  "transitions": [{ "iteration": 5, "from": null, "to": "P1", "reason": "Initial discovery during cross-doc consistency sweep" }]
}
```

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | (from iteration 4) | 9 pass / 2 fail |
| checklist_evidence | fail | hard | impl-summary Completed claims (F018) unsupported by any delivery evidence | Hard-gate failure: checked completion claim without evidence |
| feature_catalog_code | pending | advisory | — | Deferred to iteration 9 |
| playbook_capability | pending | advisory | — | Deferred to iteration 9 |

## Assessment
- New findings ratio: 0.24
- Dimensions addressed: traceability (complete: spec_code partial, checklist_evidence fail)
- Novelty justification: F018-F022 are new metadata/consistency defects; F022 extends the F009 family into generated metadata

## Ruled Out
- "graph-metadata is regenerated automatically": file timestamps (05:33:55Z) predate the authored specs (06:45Z+) and no regeneration occurred since — snapshot is stale, not transient.

## Dead Ends
- description.json keyword analysis: no additional corruption beyond the placeholder tokenization (001) and truncation (002) already recorded.

## Recommended Next Focus
- Dimension: maintainability (template bloat + small-model legibility)
- Focus area: measure duplication claims (decision-record ~24-line dup, continuity ~227 lines across 8 templates, comment leakage in impl-summary), byte budgets feasibility (005 draft budgets vs current rendered sizes), small-model legibility of scaffold output.

## Review verdict: CONDITIONAL
