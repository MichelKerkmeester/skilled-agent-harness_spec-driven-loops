---
title: Deep Review Strategy - mcp-browser-use hub (lineage opus-1)
description: Session tracking for the opus-1 fan-out lineage reviewing the mcp-browser-use hub epic, phases 001-013.
---

# Deep Review Strategy - Session Tracking

## 2. TOPIC
Review: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub (spec-folder). Operator focus: every phase's shipped work against its goal criteria. Lineage opus-1 of a 4-lineage fan-out, generation 2 (restart after the 2026-11-21 review whose remediation is recorded in review-archive/20261124T044326Z-restart/review-report.md §11).

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Re-reporting the four P1s fixed after the prior review unless the current tree regressed them.
- Reviewing bdg, Aside or Bladebro tools themselves (out of scope per spec.md §3).
- Running repo tooling that writes (validate.sh, generate-context.js, git writes).

---

## 5. STOP CONDITIONS
- All four dimensions covered and newFindingsRatio under 0.10 for the rolling window, or maxIterations 7.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 8
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Re-running each phase goal's executable criteria on today's tree: surfaced a later phase breaking an earlier gate (iteration 1).

## 9. WHAT FAILED
- Advisor live replay and validate.sh not re-runnable inside the lineage write limits (iteration 1).

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### 005 status mismatch (prior C2-I3-P2-001): resolved. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: 005 status mismatch (prior C2-I3-P2-001): resolved.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 005 status mismatch (prior C2-I3-P2-001): resolved.

### 013 scope creep via Devin allowlist and freshness panel: declared in 013 spec.md:91. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: 013 scope creep via Devin allowlist and freshness panel: declared in 013 spec.md:91.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 013 scope creep via Devin allowlist and freshness panel: declared in 013 spec.md:91.

### Aside curl|bash installer: operator-invoked, documented, official URL. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Aside curl|bash installer: operator-invoked, documented, official URL.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Aside curl|bash installer: operator-invoked, documented, official URL.

### Credential or env leakage in the browser manuals: all `env` objects empty. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Credential or env leakage in the browser manuals: all `env` objects empty.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Credential or env leakage in the browser manuals: all `env` objects empty.

### Lighthouse leaf validation overclaim (prior C2-I5-P2-001): resolved. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Lighthouse leaf validation overclaim (prior C2-I5-P2-001): resolved.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lighthouse leaf validation overclaim (prior C2-I5-P2-001): resolved.

### Prior R2-P1-001 teardown regression: not regressed. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Prior R2-P1-001 teardown regression: not regressed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prior R2-P1-001 teardown regression: not regressed.

### Regression of prior C2-I1-P1-001 (403 Forbidden reject): fixed and canaried. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Regression of prior C2-I1-P1-001 (403 Forbidden reject): fixed and canaried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Regression of prior C2-I1-P1-001 (403 Forbidden reject): fixed and canaried.

### results.csv vs README tally drift for 008's two live runs: tallies match. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: results.csv vs README tally drift for 008's two live runs: tallies match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: results.csv vs README tally drift for 008's two live runs: tallies match.

### Stale mcp-tooling/mcp-*-devtools paths under .skilled: none. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Stale mcp-tooling/mcp-*-devtools paths under .skilled: none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale mcp-tooling/mcp-*-devtools paths under .skilled: none.

### Stale runtime-mirror or agent references to the old packet paths: none. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Stale runtime-mirror or agent references to the old packet paths: none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale runtime-mirror or agent references to the old packet paths: none.

### Version stamp mismatch across JSON routing files: parent-skill-check 13a passes. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Version stamp mismatch across JSON routing files: parent-skill-check 13a passes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Version stamp mismatch across JSON routing files: parent-skill-check 13a passes.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Synthesis. Carry O1-I1-P1-001 as the one required fix; seven P2 advisories. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- resource-map.md not present; skipping coverage gate.
- Prior generation (2026-11-21): P1=4, P2=17; three P1 fixed, R1-P1-001 downgraded to P2 and left (review-archive/20261124T044326Z-restart/review-report.md:147-152).
- Scope: 470 files pre-bound (review-scope-files.txt); 277 under .skilled/skills/mcp-browser-use.
