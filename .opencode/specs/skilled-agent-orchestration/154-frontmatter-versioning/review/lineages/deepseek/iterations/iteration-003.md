# Iteration 3: Traceability

## Focus
D3 Traceability — verifying spec/code alignment between the versioning standard doc, the engine implementation, child phase specs vs their impl-summaries, and cross-reference protocol execution.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 9 (frontmatter_versioning.md, 001-005 spec.md files, graph-metadata.json, frontmatter-version.mjs)
- New findings: P0=0 P1=2 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P1, Required
- **F010**: Three child-phase specs (001, 002, 005) report `completion_pct: 0` in `_memory.continuity` but `Status: Complete` in their metadata tables. The implementation summaries confirm all phases are complete — the continuity block was never updated from scaffolding state. Operators using `/speckit:resume` would be told 0% completion despite all work being done. `001-versioning-standard/spec.md:28`, `002-derivation-engine/spec.md:27`, `005-verify-and-enforce/spec.md:27`

- **F012**: `graph-metadata.json` `derived.status` is `"planned"` but the spec.md `_memory.continuity.completion_pct` is 100 and all five child phases are `Status: Complete`. The `last_active_child_id` is `null`. This dead pointer makes `/speckit:resume` silently fail on the phase parent — it cannot route to the last active child and would need manual operator intervention. `graph-metadata.json:41`, `graph-metadata.json:101`

### P2, Suggestion
- **F011**: Phase 2 spec `_memory.continuity.key_files` references `frontmatter-version.ts` (line 21) but the actual implementation file is `frontmatter-version.mjs`. The scope table correctly lists `{ts,mjs}` as alternatives, but the continuity block key_files is stale. `002-derivation-engine/spec.md:21`, `frontmatter-version.mjs:1`

- **F013**: Three child-phase specs (001, 002, 005) carry the identical scaffolding `recent_action: "Authored the phase scope from the approved plan"` in heir continuity blocks. This text was written before any implementation and never updated, making the continuity ladder unreliable for resuming work. `001-versioning-standard/spec.md:17`, `002-derivation-engine/spec.md:17`, `005-verify-and-enforce/spec.md:17`

- **F014**: All child-phase spec `session_dedup.fingerprint` values are all-zero sha256, same as the parent (F004). This is a systematic scaffolding artifact affecting all six spec files — sessions cannot be deduplicated. `001-versioning-standard/spec.md:25`, `002-derivation-engine/spec.md:25`, `005-verify-and-enforce/spec.md:25`

- **F015**: The `frontmatter_versioning.md` standard doc (line 81) claims `W = min( realEditCount(file), 99 )` — capping at 99. The engine code at `frontmatter-version.mjs:47` sets `W_CAP = 99` and `frontmatter-version.mjs:257` applies `Math.min(realEdits, W_CAP)`. Traceability is confirmed: the code correctly implements the standard. However, the standard says `W` is the numstat-gated edit count (line 90) while the engine function is named `realEditCount` — slight naming drift between spec and code. `frontmatter_versioning.md:81,90`, `frontmatter-version.mjs:47,63,257`

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | Multiple sources | F010-F014 are spec-vs-implementation state mismatches; engine logic matches standard (F015) |
| checklist_evidence | notApplicable | hard | — | No checklist at parent (correct per Phase Parent mode) |

## Claim Adjudication (P1 Findings)

### F010 Claim Adjudication
```json
{
  "findingId": "F010",
  "claim": "Three child-phase specs report completion_pct: 0 in _memory.continuity but Status: Complete in metadata tables.",
  "evidenceRefs": [
    "001-versioning-standard/spec.md:28",
    "001-versioning-standard/spec.md:54",
    "002-derivation-engine/spec.md:27",
    "002-derivation-engine/spec.md:53",
    "005-verify-and-enforce/spec.md:27",
    "005-verify-and-enforce/spec.md:53"
  ],
  "counterevidenceSought": "Checked all 5 child implementation-summaries for completion evidence — all report 100% done with verification results passed. Checked if any child plan.md or tasks.md suggests incomplete work — none found; all phases verify green.",
  "alternativeExplanation": "The continuity blocks were auto-generated during scaffolding with `completion_pct: 0` and were never updated after implementation. The metadata `Status: Complete` was set manually. This is documentation drift, not an incomplete phase.",
  "finalSeverity": "P1",
  "confidence": 0.90,
  "downgradeTrigger": "If the `completion_pct` field is non-functional (i.e., the resume ladder reads `implementation-summary.md` continuity and ignores spec frontmatter `completion_pct`), downgrade to P2 doc-drift.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery — systematic mismatch across 3 of 5 child specs" }
  ]
}
```

### F012 Claim Adjudication
```json
{
  "findingId": "F012",
  "claim": "graph-metadata.json derived.status is 'planned' and last_active_child_id is null despite all phases being complete.",
  "evidenceRefs": [
    "graph-metadata.json:41",
    "graph-metadata.json:101",
    "spec.md:26-30"
  ],
  "counterevidenceSought": "Checked all child phase graph-metadata.json files for status — each child correctly reports its own status. Checked if the parent graph-metadata had been regenerated after child completions — the last_save_at timestamp (2026-06-23T10:34:04Z) is after the child phase creation but before their implementation was finalized. The parent graph-metadata was never refreshed post-completion.",
  "alternativeExplanation": "The graph-metadata was generated once during scaffolding and never re-run after children completed. The `generate-context.js` / `graph-metadata` refresh step was skipped after the final phase implementation.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If the memory system reads status from child graph-metadata files rather than the parent's derived.status, and the parent status is informational only, downgrade to P2.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Assessment
- New findings ratio: 1.00 (all findings are newly discovered in this dimension)
- Dimensions addressed: traceability
- Novelty justification: The `completion_pct`/`Status` mismatch was uncovered by cross-referencing spec frontmatter against metadata tables and impl-summaries — a traceability-specific lens that prior correctness/security passes didn't apply. The engine standard-vs-code trace confirms fidelity on the derivation logic (F015 positive).

## Ruled Out
- Engine derivation logic mismatch: Ruled out — `frontmatter-version.mjs` correctly implements all rules from `frontmatter_versioning.md`: anchor = max(fm, changelog), SKILL.md reconcile up to anchor, child doc W = min(numstat-gated edit count, 99), line-wise insertion as last key. Traceability between standard and code is solid.
- Phase 3 and 4 spec continuity: their `_memory.continuity` blocks were updated (compare 003 `completion_pct: 100` and 004 `completion_pct: 100` vs 001/002/005 at 0). The inconsistency is partial, not uniform.

## Dead Ends
- None in this iteration.

## Recommended Next Focus
D4 Maintainability — review documentation quality, spec structure coherence, cross-phase naming consistency, and whether the phase-parent metadata system (graph-metadata, continuity ladder) is structurally sound for future maintenance.

Review verdict: CONDITIONAL
