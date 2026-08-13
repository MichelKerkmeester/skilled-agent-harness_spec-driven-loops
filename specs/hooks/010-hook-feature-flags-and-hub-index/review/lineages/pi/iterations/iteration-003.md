# Iteration 3: D3 Traceability — spec_code: spec/plan/tasks vs shipped state

## Focus
- Dimension: traceability (spec_code core protocol)
- Files: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `.opencode/hooks/README.md` (matrix + index claims), `.opencode/hooks/**` symlink tree, `.opencode/skills/system-spec-kit/mcp-server/hooks/{codex,cursor,devin}/session-start.ts`

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 9
- New findings: P0=0 P1=1 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P1, Required
- **F003**: `spec.md` STATUS section is stale relative to the shipped packet — it claims "Phases 1-2 shipped ... Phase 3 fan-out next" (`spec.md:72`) with `completion_pct: 30` (`spec.md:5`), while `plan.md:50` states "Phases 1-9 shipped", `tasks.md` marks Phases 3-9 all `[x]` (83%), and `implementation-summary.md:5` reports 92%. A reader of the canonical spec doc would under-scope the packet as ~30% complete when 9 of 9 phases are shipped. This is a cross-document contradiction, not a code-behavior bug; severity P1 (blocks accurate release-readiness assessment from the spec doc alone).

```json
{
  "findingId": "F003",
  "claim": "spec.md STATUS and completion_pct contradict plan.md/tasks.md/implementation-summary.md, understating the shipped packet at Phases 1-2/30% when 9 phases are shipped.",
  "evidenceRefs": [
    "specs/hooks/010-hook-feature-flags-and-hub-index/spec.md:72",
    "specs/hooks/010-hook-feature-flags-and-hub-index/spec.md:5",
    "specs/hooks/010-hook-feature-flags-and-hub-index/plan.md:50",
    "specs/hooks/010-hook-feature-flags-and-hub-index/tasks.md:5",
    "specs/hooks/010-hook-feature-flags-and-hub-index/implementation-summary.md:5"
  ],
  "counterevidenceSought": "Grepped all four packet docs for STATUS/completion_pct; checked tasks.md checkbox state for Phases 3-9 (all [x]); checked README.md matrix presence (full 15x6 matrix present, so Phase 9 shipped).",
  "alternativeExplanation": "The spec STATUS may be intentionally frozen at the last operator-approved checkpoint; however, plan.md and implementation-summary.md both assert full shipment and no doc records a freeze intent, so this is stale rather than deliberate.",
  "finalSeverity": "P1",
  "confidence": 0.85,
  "downgradeTrigger": "If spec.md STATUS is updated to reflect Phases 1-9 shipped (or an explicit doc-freeze note is added), downgrade to P2 documentation nit.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery: cross-doc status contradiction" }
  ]
}
```

### P2, Suggestion
- **F004**: `tasks.md` Phase 5 README-rewrite checkbox is stale — the item `[ ] Rewrite hub README.md + injection-contract.md ... skipped because this implementation's scope lock permits only new symlinks` (`tasks.md:47`) remains unchecked although the rewrite was completed in the final-review pass (implementation-summary.md:106: "They were completed in the final-review pass (full-index + kill-switch model)") and the README demonstrably carries the full-index model plus the 15×6 coverage matrix. Checklist evidence protocol: the unchecked item misleads a phase-by-phase reader.
- **F005**: Hub symlink count claim drifted — implementation-summary.md:104 and :110 assert "49 relative symlinks" / "all 49 hub symlinks resolve", but the final tree holds **58** symlinks (0 broken; `find .opencode/hooks -type l ! -exec test -e {} \;` empty). The 49 was a Phase-5 snapshot; Phase 7/8 additions (cursor dispatch/post-edit proxy, pi completion, etc.) were never reflected in the summary's count. Same stale count in `tasks.md:45`.
- **F006**: Coverage-matrix labeling inconsistency for `directive-lifecycle` — README matrix row 176 marks codex/cursor/devin `✓ covered` while Pi/OpenCode get `— by-design: embedded`. The codex/cursor/devin coverage is equally embedded: `session-start.ts:14` imports `notifyDirectiveLifecycleBoundary` from the claude boundary (2 hits each), i.e., the same embedded-ownership pattern the matrix labels "by-design" for Pi/OpenCode. Either all four embedded surfaces should be `by-design: embedded in session-start` or the hub should carry directive-lifecycle index symlinks for codex/cursor/devin; currently a user browsing `directive-lifecycle/` sees only claude entries while the matrix claims four-runtime coverage.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | F003-F006 | Spec STATUS stale; counts drifted; matrix label inconsistent |
| checklist_evidence | partial | hard | F004 | Unchecked checkbox for completed work |

## Assessment
- New findings ratio: 1.00 (1 P1 + 3 P2)
- Dimensions addressed: traceability
- Novelty justification: Direct comparison of the four packet docs against the shipped tree. Guard/impl claims otherwise hold: 84 guarded importers ≈ spec's "~90 adapters" (within tolerance), 7/7 tests pass, 0 broken symlinks. The contradictions are doc-state, not code.

## Ruled Out
- F003 as P0: normative spec content (scope, decisions, concern families) is consistent with implementation; only the STATUS/metadata snapshot is stale. Ruled out as P0.
- "49 symlinks" as a live mismatch: 58-49=9 of the added links come from later phases, so behavior is fine; only the doc count is stale. Ruled out as P1.

## Dead Ends
- None.

## Recommended Next Focus
D3 Traceability (checklist_evidence protocol) — verify every `[x]` in tasks.md has supporting evidence in implementation-summary.md, and check the remaining matrix cells (`task-dispatch` pi `~ partial`, codex `unverified`) against the code.

Review verdict: CONDITIONAL
