---
title: "Code Graph Phase 010: Fix-Iteration Quality Meta-Research"
description: "Research into why iterative LEAF-agent fixes accumulate gaps despite individual-fix verification. Eight process-improvement rounds (R1-R8) shipped: fix-completeness checklists, review-finding metadata enrichment, planner affected-surface wiring, class-of-bug detection, and cross-cutting consumer detection. P1 findings dropped from 6 to 0 in the final verification cycle."
trigger_phrases:
  - "phase 010 changelog"
  - "fix iteration quality"
  - "class of bug vs finding"
  - "LEAF agent fix narrowness"
  - "cross-cutting consumer detection"
  - "fix completeness checklist"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-02

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph` (Level 3)
> Parent packet: `002-graph-and-context-optimization/004-code-graph`

### Summary

Iterative LEAF-agent fixes (where an agent fixes a bug, then code review finds a gap, then the agent fixes the gap, then deeper review finds another gap) were accumulating 4 to 7 rounds before reaching completeness. Each round cost time and tokens. The problem was not that the agents were bad at fixing. It was that the process did not tell them what "complete" meant.

A meta-research packet investigated three root causes:

1. **Finding granularity mismatch.** Review findings described a symptom (line X does Y) but not the class of bug (this pattern of doing Y occurs at 3 other locations). The fix targeted the symptom and left the class untouched.
2. **Missing cross-cutting consumer detection.** When a fix changed a contract (function signature, return type, error shape), the planner did not check which other modules consumed that contract. The fix landed but broke consumers silently.
3. **No completeness checklist.** The fix prompt had no checklist of "verify these N things before claiming done." Each fix was individually verified but the set of fixes was incomplete.

Eight process-improvement rounds (R1 through R8) produced the infrastructure to close these gaps:

- **Fix-completeness checklist** (`fix-completeness-checklist.md`). Eight mandatory verification items that every fix must pass: class-of-bug search, cross-cutting consumer grep, contract-change blast-radius, adjacent-code audit, error-path coverage, deferred-item tracking, test evidence citation, and fix-boundary statement.
- **Review-finding metadata enrichment.** The `spec_kit:plan` and `spec_kit:review` prompts were updated to include `findingClass` (symptom or class-of-bug), `scopeProof` (which files and lines were checked), and `affectedSurfaceHints` (which modules might be impacted).
- **Planner affected-surface wiring.** The planning step now does a blast-radius query on the diff before producing the plan. The plan includes an `affectedConsumers` section listing modules that must be verified after the fix lands.
- **Class-of-bug detection.** The review prompt was updated with a "did you check if this pattern repeats?" gate before finalizing each finding.
- **Cross-cutting consumer detection.** The fix prompt now includes a contract-change-aware grep before claiming completeness.

A deep-review Phase 2 verified the R1-R8 infrastructure. The final FIX-010-v2 cycle applied the new process to a real fix trajectory: P1 findings dropped from 6 to 0 in a single round.

### Added

- `fix-completeness-checklist.md` (NEW): 8 mandatory verification items for every fix
- `findingClass`, `scopeProof`, and `affectedSurfaceHints` metadata fields in review findings schema
- `affectedConsumers` section in plan template
- Class-of-bug detection gate in review prompt
- Cross-cutting consumer detection gate in fix prompt
- Contract-change blast-radius query integration in planner workflow

### Changed

- `spec_kit_plan_auto.yaml` and `spec_kit_plan_confirm.yaml`: updated with affected-surface wiring
- `deep-review-strategy.md`: updated with finding-class and scope-proof metadata fields
- Review prompt: updated with class-of-bug detection gate
- Fix prompt: updated with completeness checklist and cross-cutting consumer detection gate

### Fixed

- Multi-round fix trajectories (4-7 rounds per fix) were the norm. After R1-R8 process improvements, P1 findings dropped from 6 to 0 in a single FIX-010-v2 round.

### Verification

- FIX-010-v2 cycle: P1 findings dropped from 6 to 0 in one round (the key metric).
- Fix-completeness checklist walkthrough: all 8 items verified on 3 historical fix trajectories, no false completions.
- Affected-surface detection: blast-radius query tested on 5 known cross-cutting changes, all consumers correctly identified.
- Deep-review Phase 2: confirmed R1-R8 process infrastructure without regressions.
- Strict packet validation (`validate.sh --strict`): passed at 90 percent completion.

### Files Changed

| File | What changed |
|------|--------------|
| `fix-completeness-checklist.md` (NEW) | 8-item mandatory fix verification checklist |
| `spec_kit_plan_auto.yaml` | Affected-surface wiring, blast-radius query |
| `spec_kit_plan_confirm.yaml` | Same as auto plus confirmation gate |
| `deep-review-strategy.md` | Finding-class, scope-proof, and affected-surface metadata fields |
| `review/` (NEW) | 7-iteration deep-review Phase 2 artifacts |
| `review_archive/round-2-final/` (NEW) | Final verification cycle artifacts |

### Follow-Ups

- **Automated checklist enforcement.** The checklist is currently a document that agents must read. A follow-up could enforce it at the tool level by refusing to mark a task complete until all 8 items are checked.
- **Historical fix trajectory replay.** The R1-R8 improvements were validated on the FIX-010-v2 cycle. A broader replay on 10+ historical fix trajectories would provide stronger evidence.
