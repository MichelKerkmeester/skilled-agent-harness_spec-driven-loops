# Iter-10 — FINAL SYNTHESIS

## Role
Senior deep-reviewer. Synthesis judge. Cite EVIDENCE.

## Context
Iters 1-9 covered: READMEs (1), skill-advisor (2), skill internals (3), cross-skill (4), 4-runtime agents (5), tests (6), spec metadata (7), hooks/CI (8), adversarial (9).

## Scope: SYNTHESIS

### Pre-planning
1. **Read** all 9 prior iter files at `.opencode/specs/skilled-agent-orchestration/115-deep-ai-council-rename/review/iterations/iteration-{001..009}.md`. Build findings registry.
2. **Convergence judgment**: compute newFindingsRatio across iters. If 3 consecutive iters had `newFindingsRatio < 0.15`, declare CONVERGED.
3. **Verdict assignment**:
   - PASS (with hasAdvisories=true) — 0 P0/P1, P2 findings accepted as advisories
   - CONDITIONAL — P1 findings unresolved
   - FAIL — any P0
4. **Compare to 007 deep-review verdict** (PASS+advisories, 9 iters, cli-devin SWE-1.6). Did 115 + repo-wide sweep find anything 007 missed?
5. **Executive summary** for review-report.md (1 paragraph).

## Output
JSON FINDINGS (likely 0 new) + NARRATIVE with: verdict, executive summary, full findings table, comparison to 007, stop_recommendation. End.
