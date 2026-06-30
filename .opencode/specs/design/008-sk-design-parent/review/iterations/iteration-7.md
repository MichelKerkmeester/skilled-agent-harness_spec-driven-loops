---
iteration: 7
run: 1
sessionId: "2026-06-30T06:07:52.070Z"
generation: 1
status: complete
focus: "maintainability second pass — deep pattern scan"
dimension: maintainability
timestamp: "2026-06-30T08:30:00.000Z"
budgetProfile: scan
toolCallsUsed: 11
---

# Iteration 7 — Maintainability Second Pass (Deep Pattern Scan)

## Dispatcher

Second maintainability pass from dispatch. Followed dispatch focus areas: stale strategy rows (5-6 more phases), template version consistency, documentation completeness ratio (4-5 phases), old/dead references.

## Files Reviewed

- `016-register-loader-contract/spec.md` — completion_pct=100 (reconfirmed)
- `017-real-bugs/spec.md` — completion_pct=0, genuinely planned
- `018-routing-wiring/spec.md` — completion_pct=0, genuinely planned
- `019-handoff-card/spec.md` — completion_pct=0, genuinely planned
- `020-benchmark-fixtures/spec.md` — completion_pct=100, COMPLETE (strategy says "planned")
- `021-content-topups/spec.md` — completion_pct=100 (prior P2-017)
- `043-design-review-remediation/spec.md` — now has SPECKIT_TEMPLATE_SOURCE at line 35 (P2-016 resolved)
- All spec.md files (grep: SPECKIT_TEMPLATE_SOURCE)
- All spec.md files (grep: completion_pct)
- All implementation-summary.md files (grep: TODO/stale references)

## Findings - New

### P2 Findings

1. **Strategy §15 status stale for 020-benchmark-fixtures — phase is complete but listed as "planned"**
   - File: `strategy.md:206`; `020-benchmark-fixtures/spec.md:26`
   - Evidence: Strategy §15 line 206 lists 020 as "planned" but spec.md:26 shows `completion_pct: 100` with description stating "Completed Level-2 implementation phase" and `recent_action: "Mode A reports captured"`. Line 3 explicitly says "Completed" in the description field. This is the same stale-pattern as P2-017 (021) and P2-018 (016) — now 3 of 6 phases in the 016–021 "planned" cluster are actually complete.
   - Finding class: instance-only
   - Scope proof: Direct read of 020/spec.md:26 confirms completion_pct=100 with completed description. Direct read of strategy §15 line 206 confirms "planned" label. Same cross-phase pattern as P2-017 and P2-018.
   - Affected surface hints: ["strategy.md §15 status column", "020 spec.md frontmatter", "parent spec.md phase documentation map"]
   - Recommendation: Update strategy.md §15 status for 020 from "planned" to "complete". Audit the remaining 3 phases (017, 018, 019) — these are genuinely planned with completion_pct=0.

2. **Three-of-six "planned" phases (016-021 cluster) actually complete — strategy §15 status column half-stale**
   - File: `strategy.md:202-207`; `016/spec.md:26`; `020/spec.md:26`; `021/spec.md:26`
   - Evidence: Of the 6 phases in the 016–021 "planned" cluster, 3 are now confirmed complete (016: P2-018, 020: new this iteration, 021: P2-017) and 3 are genuinely planned (017: completion_pct=0 with "Not started", 018: completion_pct=0 with "Not started", 019: completion_pct=0 with "Not started"). The 50% staleness rate suggests the strategy §15 status column has not been refreshed since the 016–020 cluster was initially scaffolded.
   - Finding class: matrix/evidence
   - Scope proof: Cross-referenced all 6 phases in the cluster: 3 complete vs 3 planned. Used strategy §15 table, all 6 spec.md frontmatter fields. Pattern consistent with prior P2-017 and P2-018.
   - Affected surface hints: ["strategy.md §15 status column", "parent spec.md PHASE DOCUMENTATION MAP", "phase transition dependencies", "release readiness assessment"]
   - Recommendation: Full audit of strategy §15 status column against all 43 phases using completion_pct and description fields as ground truth. 016, 020, 021 need immediate status updates.

3. **017, 018, 019 have full documentation (spec+plan+tasks+checklist+impl-summary) but completion_pct=0 — "well-scaffolded not started" anti-pattern**
   - File: `017-real-bugs/spec.md:26`; `018/spec.md:26`; `019/spec.md:26`
   - Evidence: All three phases have complete documentation sets including checklist.md and implementation-summary.md despite `completion_pct: 0` and descriptions beginning with "Planned... Not started." The checklists and implementation summaries contain expected template structure but represent documentation written before any implementation work. This is not incorrect — it's a scaffolding convention — but it creates a documentation-completeness false-positive when counting files. A docs-completeness ratio check would count these as "4/4 docs present" while the phases are actually 0% complete.
   - Finding class: instance-only
   - Scope proof: Confirmed completion_pct=0 for 017, 018, 019 via direct reads of spec.md line 26. Confirmed checklist.md and implementation-summary.md existence via prior traceability verification (iter 6). This is a scaffolding-pattern observation, not a correctness defect.
   - Affected surface hints: ["documentation completeness scoring", "phase scaffolding conventions", "strategy.md §15 status"]
   - Recommendation: If scaffolding convention is deliberate, document it in strategy §15 or parent spec.md so future reviewers know that checklist+impl-summary presence does not imply implementation completion.

## Traceability Checks

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | **partial** | Prior status upheld — parent phase map still 001-021 only |
| `checklist_evidence` | core | **passing** | Prior sampling reconfirmed (iter 6); no new checklist checks needed |
| `skill_agent` | overlay | **deferred** | Unchanged |
| `agent_cross_runtime` | overlay | **deferred** | Unchanged |
| `feature_catalog_code` | overlay | **deferred** | Unchanged |
| `playbook_capability` | overlay | **deferred** | Unchanged |

## Integration Evidence

None reviewed this iteration — maintainability second pass was entirely spec-doc domain.

## Edge Cases

1. **020 completion_pct=100 but strategy "planned"**: Same stale-pattern as P2-017/P2-018. Resolved by reading spec.md frontmatter directly — completion_pct=100 with full description content confirms implementation was completed.
2. **017/018/019 completion_pct=0**: Genuinely planned. Strategy correct for these. No stale-strategy issue here.
3. **SPECKIT_TEMPLATE_SOURCE on 043**: Previously missing (P2-016), now present at line 35. Finding resolution confirmed — the fix happened between iterations 4 and 7.
4. **"stale" references in implementation summaries**: Nearly all are generated-metadata staleness residuals (orchestrator regenerates) — not cleanup-needed references. The word "stale" in context of design tokens is domain vocabulary, not dead references.

## Confirmed-Clean Surfaces

1. **Template version consistency**: All spec.md files use `SPECKIT_TEMPLATE_SOURCE` with `v2.2`. Level 2/3 phases correctly use `spec-core + level2-verify [+ level3-arch] | v2.2`. Phase parents use `spec-phase-parent | v1.0`. No inconsistency.
2. **Old/dead references in implementation summaries**: No stale git hashes, deleted branch names, or unresolved TODOs found in complete-phase implementation summaries. All "stale" references are domain vocabulary (stale design tokens, stale generated metadata).
3. **Completed phases have no scaffold artifacts**: Unlike 040 (P2-015), no other completed phases show `scaffold-session` session_ids. The 040 case remains isolated.
4. **017, 018, 019**: Genuinely planned — strategy status correct for these three.

## Ruled Out

- **"stale" in implementation summaries as dead references**: All "stale" hits are legitimate domain vocabulary (stale generated metadata that orchestrator regenerates, stale design tokens in freshness contexts) — not cleanup candidates.
- **Template version drift across spec.md files**: All consistent at v2.2. No drift.
- **043 missing SPECKIT_TEMPLATE_SOURCE**: Resolved — present at line 35 now.
- **Strategy §15 status staleness beyond 016-021 cluster**: The 016-021 cluster is the only region with systematic status mismatches. Phases 001-015 and 022-043 appear correctly classified (apart from the known 037/041 duplication and 042 empty scaffold).

## Next Focus

- **Dimension:** maintainability — strategy audit complete
- **Focus area:** Second pass on maintainability confirmed 3 additional stale strategy rows (020, joining 016 and 021). The 016-021 cluster is now fully audited: 3 complete (016, 020, 021), 3 genuinely planned (017, 018, 019). Template consistency verified across all phases with no drift. No dead/cleanable references found. Documentation completeness pattern documented.
- **Reason:** Maintainability second pass complete. Strategy §15 audit expanded from 2 known staleness (016, 021) to 3 (now 020). All stale rows are in the 016-021 "planned" cluster.
- **Rotation status:** 4/4 dimensions + maintainability second pass complete; correctness second pass complete; traceability second pass complete. Ready for convergence/synthesis.
- **Blocked/Productive carry-forward:** Productive: cross-referencing strategy status vs spec.md completion_pct is a reliable audit method for the remaining phases. Blocked: budget discipline — 7/7 iterations over 12-call max (11 calls this iteration, within limit for the first time).
- **Required evidence:** Orchestrator should run reduce-state.cjs and evaluate convergence. 3 new P2 findings — weighted new = 3 (weights: 1 each for P2). Accumulated weighted prior = 63 + refinements. Ratio ≈ 3/66 ≈ 0.045.
- **Recovery note:** N/A — iteration within budget (11 calls), all findings backed by file:line evidence.

Review verdict: CONDITIONAL
