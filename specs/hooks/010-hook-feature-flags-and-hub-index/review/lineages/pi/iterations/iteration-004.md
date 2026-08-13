# Iteration 4: D3 Traceability — checklist_evidence protocol audit

## Focus
- Dimension: traceability (checklist_evidence core protocol)
- Files: `tasks.md` (27 `[x]` items), `implementation-summary.md` (evidence), `.opencode/hooks/mcp-route-guard/{claude,codex,devin,cursor}/**`, `.opencode/hooks/goal/{bin,cursor,pi}/**`, `.opencode/plugins/mk-goal.js`, `.pi/extensions/{completion-evidence,task-dispatch-guard}.ts`, `.codex/hooks.json`, `.opencode/hooks/README.md:188` (matrix row)

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 12
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=1 P2=0
- New findings ratio: 0.50 (refinement of F003 at half weight)

## Findings

### Refined
- **F003** (refined, stays P1): `plan.md:50` further overstates the packet by claiming "Phases 1-9 shipped" while `tasks.md:50` Phase 6 ("Each runtime loads clean; master-off silences all; per-concern toggles verified; no stray files") remains unchecked and `implementation-summary.md` Phase 6 section itself says the "live cross-runtime sweep follows" (i.e., not yet run). So the shipped-state contradiction is twofold: spec.md understates (30%), plan.md overstates (claims Phase 6 done). Both must be reconciled to the true state (Phases 1-5, 7-9 shipped; Phase 6 pending deployment-side sweep).

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | F003 refined | plan.md overstates Phase 6 |
| checklist_evidence | pass | hard | 27/27 [x] verified | Every checked item carries direct evidence |

## Assessment
- New findings ratio: 0.50 (one P1 refinement)
- Dimensions addressed: traceability
- Novelty justification: Systematically verified all 27 `[x]` items against shipped artifacts: mcp-route-guard stdin adapters each carry 2 `isHookEnabled` hits (claude/codex/devin/cursor); goal bin/cursor/pi/plugin all exist; pi completion registers `turn_end` (:55); pi task-dispatch matches `subagent` (:27-32); codex hooks.json exposes only `SessionStart/UserPromptSubmit/PreToolUse/PostToolUse/Stop/PreCompact` — no Task/subagent event, so the "unverified" matrix cell (:188) is truthful; the pi `~ partial` cell matches the code (no `runs.run` handling found in the adapter). Only F004 (already filed) and F003 refinement surfaced.

## Ruled Out
- New checklist violation: all 27 checked items have evidence (either inline `[Evidence: ...]` or verified by direct file inspection). Ruled out.
- F003 severity change: the plan.md overstatement strengthens, not weakens, the P1 — reconciliation needed on both sides. Ruled out as P2.

## Dead Ends
- None.

## Recommended Next Focus
D4 Maintainability — README prose vs tree coherence, hub naming/disambiguation (`speckit-` prefix), injection-contract alignment, dead-code or stale references in the hub index.

Review verdict: CONDITIONAL
