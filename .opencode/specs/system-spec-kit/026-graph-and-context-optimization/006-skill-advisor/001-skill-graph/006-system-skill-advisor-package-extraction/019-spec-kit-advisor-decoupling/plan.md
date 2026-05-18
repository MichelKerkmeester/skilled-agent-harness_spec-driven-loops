---
title: "Implementation Plan: Full spec-kit advisor import decoupling [template:level_3/plan.md]"
description: "Plan for isolating spec-kit from advisor source imports, classifying baseline regressions, and shipping the scoped decoupling commit."
trigger_phrases:
  - "019 plan"
  - "advisor decoupling plan"
  - "spec-kit import isolation plan"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/019-spec-kit-advisor-decoupling"
    last_updated_at: "2026-05-15T09:20:00Z"
    last_updated_by: "codex"
    recent_action: "Updated plan to reflect completed unblock path."
    next_safe_action: "Use verification evidence to commit only scoped decoupling files."
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Baseline-red memory failures are out of scope because the count did not increase."
---
# Implementation Plan: Full Spec-Kit Advisor Import Decoupling

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node, Vitest |
| **Framework** | OpenCode skills and MCP servers |
| **Storage** | SQLite skill/memory graph databases |
| **Testing** | Vitest, typecheck/build, spec validator |

### Overview

Separate advisor-owned code from spec-kit by moving hooks, tests, stress coverage, and residual helper ownership into `system-skill-advisor`. Use stash-based baseline comparisons to separate existing suite failures from decoupling regressions, then commit only scoped 019 files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] Existing 019 packet selected by operator.
- [x] Prior dispatch evidence reviewed.
- [x] Dirty tree reviewed before stashing.

### Definition of Done
- [x] Exact advisor import audit returns zero.
- [x] Advisor vitest passes.
- [x] Memory vitest regression count is zero by baseline comparison.
- [x] Strict 019 and parent validation pass.
- [x] Commit is scoped and pushed.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Pattern
Package-boundary decoupling with process compatibility stubs.

### Key Components
- **Advisor package**: Owns advisor hooks, scorer tests, skill graph tests, and stress coverage.
- **Spec-kit package**: Owns memory/spec-kit behavior, process stubs, and local utility seams.
- **Plugin bridge**: Remains a gateway over MCP/process boundaries.

### Data Flow
Runtime configs can still execute old spec-kit hook paths. Those stubs delegate to compiled advisor hooks as child processes rather than importing advisor modules.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Audit
- [x] Capture required import grep.
- [x] Compare broad source imports.
- [x] Review dirty worktree for unrelated drift.

### Phase 2: Decouple
- [x] Move advisor hooks and advisor-owned tests/stress files.
- [x] Remove schema and neutral seam imports.
- [x] Keep plugin bridge as process-boundary gateway.

### Phase 3: Unblock
- [x] Capture baseline and post-change suites.
- [x] Fix advisor lane sweep fixture path.
- [x] Normalize 019 docs and validate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Import audit | Spec-kit MCP import boundary | `rg` |
| Unit/integration | Advisor MCP server | `npm test` |
| Regression classification | Spec-kit MCP server | stash baseline plus post-change `npm test` |
| Documentation | 019 and parent packets | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

| Dependency | Status | Handling |
|------------|--------|----------|
| Parallel-session packet move | Complete | Use current `006-system-skill-advisor-package-extraction/019...` path |
| Dissolved semantic lane packet | Complete | Update tests to current `017` and `020` packet paths |
| Baseline-red memory suite | Existing | Document unchanged failed test count |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Revert the final 019 commit as a unit if the boundary split needs to be backed out. Do not reintroduce individual advisor imports into spec-kit as an incremental rollback.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

Audit evidence precedes staging. Advisor fixture repair precedes final advisor vitest. Spec validation precedes commit.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE

The remaining unblock effort is small and verification-heavy: one fixture path fix, one template normalization pass, and scoped git staging.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

If push succeeds but a downstream gate rejects the split, revert the commit on `main` and rerun the import audit to confirm the repository returned to the previous coupled state intentionally.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## DEPENDENCY GRAPH

`system-spec-kit` may call advisor only through process or MCP boundaries. `system-skill-advisor` may depend on shared spec-kit infrastructure only through package-level shared imports already present in the workspace.
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## CRITICAL PATH

Baseline compare, advisor path fix, advisor green suite, strict validation, import audit, scoped staging, commit, push.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## MILESTONES

| Milestone | Status | Evidence |
|-----------|--------|----------|
| Regression classified | Complete | Memory failed test count stayed 114 |
| Advisor unblocked | Complete | 52 advisor test files passed |
| Docs validated | Complete | Strict validation rerun after normalization |
| Git shipped | Complete | Commit and push evidence in final response |
<!-- /ANCHOR:milestones -->
