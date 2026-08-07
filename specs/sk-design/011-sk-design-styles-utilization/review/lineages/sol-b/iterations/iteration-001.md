# Deep Review Iteration 001

## Dispatcher

- Resolved route: mode=review target_agent=deep-review
- Session: `fanout-sol-b-1784385520599-ecg4bg`, generation 1, lineage mode `new`
- Focus: correctness — lifecycle state, dependency ordering, implementation-summary truthfulness, and runtime-claim support
- Budget profile: `scan`; five focused actions completed
- Structural caveat: code graph and structural-impact analysis were unavailable by dispatch contract. Direct Read/Grep/Glob evidence was used; no daemon retry was attempted.

## Files Reviewed

- Parent: `spec.md`, `description.json`, `graph-metadata.json`
- Completed research children: `001-research-utilization/implementation-summary.md`, `002-md-generator-upgrade/{spec.md,implementation-summary.md}`, `003-global-modes-utilization/{spec.md,implementation-summary.md}`
- Planned implementation children: `004-retrieval-substrate/implementation-summary.md`; dependency sections and graph metadata for phases 005-008; exact metadata searches across phases 001-010
- Runtime surface: exact searches under `.opencode/skills/sk-design/**` and existence check for `.opencode/skills/sk-design/styles/_engine/**`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **Completed research phases still advertise pre-dispatch continuation state** -- `002-md-generator-upgrade/spec.md:15` -- Phase 002 says the recent action was authoring the charter, directs the next session to dispatch the research loop, and reports 10% completion, while its own status row says Complete and its implementation summary reports a completed five-iteration synthesis at 100%. Phase 003 repeats the same contradiction, and the parent still directs child 001 at 0% despite declaring phases 001-003 complete. A resume or indexed-context consumer can therefore repeat completed research or present false progress. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/spec.md:15-26] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/spec.md:47] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/002-md-generator-upgrade/implementation-summary.md:10-27] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/spec.md:15-26] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/spec.md:47] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/003-global-modes-utilization/implementation-summary.md:10-27] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:15-25] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/spec.md:46]
   - Finding class: cross-consumer
   - Scope proof: Exact lifecycle searches covered parent Markdown and all ten child phases; the contradiction was confirmed in parent, phase 002, and phase 003 against their current implementation summaries. Phase 001's implementation summary consistently reports complete/100%, while phases 004-010 consistently report planned/0%.
   - Affected surface hints: `parent continuity`, `phase 002 resume`, `phase 003 resume`, `spec-memory indexing`

```json
{"type":"lifecycle-state-contradiction","claim":"Authoritative-looking continuation fields direct consumers to repeat completed research and report stale completion.","evidenceRefs":["002-md-generator-upgrade/spec.md:15-26","002-md-generator-upgrade/implementation-summary.md:10-27","003-global-modes-utilization/spec.md:15-26","003-global-modes-utilization/implementation-summary.md:10-27","spec.md:15-25","spec.md:46"],"counterevidenceSought":"Checked the resume-precedence implementation summaries and phase status rows; they correctly report completion and reduce the impact for consumers that always prefer them.","alternativeExplanation":"The spec frontmatter may be treated as a non-authoritative historical snapshot after an implementation summary exists.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"Downgrade to P2 only if every resume, indexing, and status consumer is proven to ignore spec and parent continuity fields once an implementation summary exists."}
```

2. **Dependency graph metadata omits every declared implementation prerequisite** -- `005-md-generator-schema-contract/graph-metadata.json:8` -- Phase 005 declares phase 004 as a strict prerequisite, phase 006 declares phases 004 and 005, phase 007 declares phase 004, and phase 008 declares phases 004 and 007, yet each corresponding `manual.depends_on` array is empty. The exact metadata sweep found empty dependency arrays across all ten children, so graph-based ordering and impact traversal cannot represent the packet's documented build invariants. [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/005-md-generator-schema-contract/graph-metadata.json:7-10] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/005-md-generator-schema-contract/spec.md:143-148] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/graph-metadata.json:7-10] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/006-md-generator-study-exemplars/spec.md:134-143] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/007-shared-context-seam/graph-metadata.json:7-10] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/007-shared-context-seam/spec.md:128-135] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/008-interface-audit-pilots/graph-metadata.json:7-10] [SOURCE: .opencode/specs/sk-design/011-sk-design-styles-utilization/008-interface-audit-pilots/spec.md:151-156]
   - Finding class: class-of-bug
   - Scope proof: Exact search across every child `graph-metadata.json` found `"depends_on": []` for phases 001-010; direct reads confirmed four dependency-bearing implementation phases disagree with that representation, and the search also identified documented prerequisites in phases 009 and 010.
   - Affected surface hints: `graph traversal`, `phase sequencing`, `blast-radius analysis`, `resume dependency context`

```json
{"type":"dependency-metadata-omission","claim":"Graph metadata cannot represent the implementation build order because declared prerequisites are absent from every child dependency array.","evidenceRefs":["005-md-generator-schema-contract/graph-metadata.json:7-10","005-md-generator-schema-contract/spec.md:143-148","006-md-generator-study-exemplars/graph-metadata.json:7-10","006-md-generator-study-exemplars/spec.md:134-143","007-shared-context-seam/graph-metadata.json:7-10","007-shared-context-seam/spec.md:128-135","008-interface-audit-pilots/graph-metadata.json:7-10","008-interface-audit-pilots/spec.md:151-156"],"counterevidenceSought":"Checked the parent phase map and child specs; they preserve a human-readable order, but no alternate dependency field was found in graph metadata.","alternativeExplanation":"The manual dependency arrays may intentionally require a separate explicit metadata-authoring step rather than being derived from prose.","finalSeverity":"P1","confidence":0.91,"downgradeTrigger":"Downgrade to P2 if graph and resume consumers are proven not to use manual.depends_on for ordering or impact, and another machine-readable dependency source is shown to be canonical."}
```

### P2 Findings

None.

## Traceability Checks

- `spec_code` (core): **partial** — planned-runtime claims were checked against `.opencode/skills/sk-design`; the claimed retrieval engine is absent exactly as phase 004 states, but later dimensions still need consumer-level contract checks.
- `checklist_evidence` (core): **pending** — not the correctness focus of this iteration.
- `feature_catalog_code` (overlay): **not assessed**.
- `playbook_capability` (overlay): **not assessed**.

## Integration Evidence

- `.opencode/skills/sk-design/styles/_engine/**`: no files found, supporting phase 004's explicit “nothing built” claim at `004-retrieval-substrate/implementation-summary.md:57-73`.
- Exact searches under `.opencode/skills/sk-design/**` found no `CORPUS_CONTEXT_PLAN`, grounding-receipt, source-leak, de-literalization, or retrieval-engine implementation surfaces. This supports the parent claim that phases 004-010 remain planned; it is not proof about unsearched vocabulary.

## Edge Cases

- The implementation summaries for phases 002 and 003 are current and take precedence in the documented resume ladder, partially containing Finding 1; lower-precedence stale continuity remains visible to indexing and direct readers.
- Parent `graph-metadata.json` reports aggregate status `planned`, which is compatible with seven planned implementation phases; it was not treated as contradicting the completed research subset.
- Structural-impact analysis was unavailable because the rendered dispatch declared the code graph absent. Direct evidence is authoritative here, but transitive graph consumers could not be exercised.

## Confirmed-Clean Surfaces

- Phase 004's implementation summary truthfully says no engine, manifest, fixtures, or verification exists; the named `_engine` path is absent.
- Phase 001's implementation summary consistently reports the completed eight-iteration research outcome and 100% completion.
- Phases 004-010 consistently identify themselves as planned scaffolds in the status search; no shipped runtime behavior was claimed.

## Ruled Out

- No P0: neither contradiction creates destructive data loss, an exploitable security path, or an immediate blocker under the shared severity doctrine.
- No false shipped-behavior finding: absence of runtime engine files agrees with the implementation summaries instead of contradicting them.
- Per-style corpus inspection remained out of scope and unnecessary for lifecycle correctness.

## Next Focus

- Dimension: security
- Focus area: retrieval/content trust boundaries, provenance, path controls, prompt-injection and source-leak defenses in phases 004-010
- Reason: correctness is covered; the planned corpus-to-prompt boundary has the next-highest blast radius
- Rotation status: first pass
- Blocked/productive carry-forward: direct packet reads and exact searches were productive; memory and code-graph approaches remain blocked
- Required evidence: phase requirements/ADRs/checklists plus exact named `.opencode/skills/sk-design` trust-boundary surfaces

Review verdict: CONDITIONAL
