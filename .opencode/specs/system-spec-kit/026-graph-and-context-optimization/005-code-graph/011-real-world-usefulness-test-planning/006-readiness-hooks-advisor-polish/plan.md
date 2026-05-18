---
title: "Implementation Plan: Code Graph + Advisor + Hooks Polish"
description: "Sequential plan for Phase 006 clusters A-E: hook docs, CocoIndex interop, read-path readiness, advisor hardening, and glob-aware fingerprints."
trigger_phrases:
  - "026/007/012/006 plan"
  - "clusters A-E plan"
  - "read-path auto-rescan plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-code-graph/011-real-world-usefulness-test-planning/006-readiness-hooks-advisor-polish"
    last_updated_at: "2026-05-06T11:34:49Z"
    last_updated_by: "cli-codex-gpt-5.5"
    recent_action: "Aligned plan with Level 2 contract"
    next_safe_action: "Review verification blockers"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Code Graph + Advisor + Hooks Polish

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, NodeNext ESM, Markdown |
| **Runtime** | system-spec-kit MCP server |
| **Storage** | Existing SQLite metadata and skill graph artifacts |
| **Testing** | Vitest, `npm run build`, strict spec validation |

### Overview
Implement the requested order with one correction: planning artifacts first, then Cluster B docs, Cluster D interop, Cluster A readiness behavior, Cluster C advisor hardening, and Cluster E fingerprint extension. Each code cluster receives a regression test before full-suite verification.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gate 3 pre-approved by user for `specs/.../006-readiness-hooks-advisor-polish/`.
- [x] Source research read from `003-code-graph-bug-surface-research/research/research.md`.
- [x] Existing readiness, context, query, verify, scope-policy, hook-doc, and advisor surfaces identified.

### Definition of Done
- [ ] All P0 checklist items are verified with command evidence.
- [ ] Dist output rebuilt with `npm run build`.
- [ ] Code graph, advisor, and hooks/test suites pass or failures are reported.
- [ ] Strict validation passes for child and parent folders.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use narrowly-scoped shared helpers near the existing code graph readiness and scope-policy surfaces. Preserve existing handler response envelopes while adding missing diagnostics and safe automatic recovery gates.

### Key Components
- **Readiness diagnostics**: `ReadyResult` carries structured scope and manifest details; handler blocked payloads project them to users.
- **Guarded auto-rescan**: query/context invoke full scans only when stored and active scope fingerprints match and parser-error backlog is under threshold.
- **Verify scope preflight**: verify results include active/stored scope comparison before gold-query execution.
- **Advisor startup assertions**: rebuild and startup live publication require both freshness and trust/artifact axes to be healthy.
- **CocoIndex seed normalizer**: accepts both camelCase and snake_case seed fields and normalizes to internal `CodeGraphSeed` shapes.
- **Scope fingerprint v3**: includes sorted scan globs while parsing v2 as legacy compatible data.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Planning Artifacts
- Create Level 2 packet docs under the user-approved `specs/.../006-readiness-hooks-advisor-polish/` folder.
- Add `006-readiness-hooks-advisor-polish` to the parent `children_ids` array.

### Phase 2: Cluster B - Hook Docs
- Update Copilot README session-prime smoke wording to describe raw startup/compact text and managed-block verification.
- Add Gemini SessionStart, compact, SessionEnd registration sections and smoke examples.

### Phase 3: Cluster D - CocoIndex Contract
- Update `code_graph_context` seed input handling to normalize `file_path`, `start_line`, `end_line`, and `content`.
- Update CocoIndex tool reference to document live snake_case protocol and interop normalization.

### Phase 4: Cluster A - Read Path
- Add readiness diagnostics fields to blocked-read payloads.
- Add guarded auto-rescan policy shared by query/context handlers.
- Add scope-aware verify preflight/result field.

### Phase 5: Cluster C - Advisor
- Change `advisor_rebuild` skip predicate to require both live freshness and non-absent trust state.
- Add context-server startup post-index artifact assertion before publishing live state.

### Phase 6: Cluster E - Glob Fingerprints
- Extend scope fingerprint builder to include sorted include/exclude glob arrays.
- Preserve v2 legacy parse compatibility.
- Add scan regression for glob-only scope mismatch.

### Phase 7: Verification and Summary
- Run targeted cluster tests, full vitest suites, build, alignment verification as applicable, and strict validation.
- Author final implementation summary with evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Readiness diagnostics blocked payload. | `npx vitest run code_graph/tests/` targeted file |
| Regression | Guarded auto-rescan safe path. | `npx vitest run code_graph/tests/` targeted file |
| Regression | Verify scope preflight mismatch. | `npx vitest run code_graph/tests/code-graph-verify.vitest.ts` |
| Regression | Advisor rebuild mixed live/absent state. | `npx vitest run tests/advisor-rebuild.vitest.ts` |
| Regression | Startup post-index assertion failure. | `npx vitest run tests/context-server.vitest.ts` |
| Regression | CocoIndex snake_case seed normalization. | `npx vitest run code_graph/tests/code-graph-context-handler.vitest.ts` |
| Regression | Glob-only scope mismatch. | `npx vitest run code_graph/tests/code-graph-scan.vitest.ts` |
| Full | MCP server test surfaces and build. | `npx vitest run ...`, `npm run build` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Notes |
|------------|--------|-------|
| Phase 004 remediation | Complete | Earlier P0 remediation packet. |
| Phase 005 scope guard | Complete | Required for guarded read-path auto-rescan safety. |
| Existing code graph metadata helpers | Available | Reused for stored scope comparison. |
| Existing Vitest suites | Mixed | Focused/code graph suites pass; broad suites have unrelated failures. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:risks -->
## 7. RISKS

| Risk | Mitigation |
|------|------------|
| Auto-rescan could revive destructive scan paths. | Gate on scope equality and parse-error backlog, and rely on prior Phase 005 scope guard. |
| Fingerprint v3 could block legacy installations. | Parse v2 fingerprints as legacy and allow graceful first repair. |
| Context-server startup tests may be brittle. | Keep assertion helper small and test predicate behavior without broad startup rewrites. |
| Doc-only findings could drift into behavior changes. | Limit Cluster B and F-017 to markdown edits only. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:effort -->
## 8. EFFORT

| Area | Estimate | Actual Result |
|------|----------|---------------|
| Cluster B docs | Small | Completed. |
| Cluster D interop | Small | Completed with regression test. |
| Cluster A read path | Medium | Completed with readiness/query/context/verify regressions. |
| Cluster C advisor | Medium | Completed with targeted regressions. |
| Cluster E fingerprint | Medium | Completed with scan and fingerprint regressions. |
| Global verification | Medium | Blocked by unrelated dirty-worktree failures. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:rollback -->
## 9. ROLLBACK PLAN

If any cluster needs to be backed out, revert only the files listed in the spec scope for that cluster and rerun its focused vitest target. Do not revert unrelated workspace deletions or modifications. For Cluster E specifically, preserve legacy v2 fingerprint parsing if v3 emission is rolled back so older metadata remains readable.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| Planning | Gate 3 pre-approval | Establishes packet docs and parent graph metadata. |
| Cluster B | Planning | Documentation-only, low risk. |
| Cluster D | Planning | Seed normalization and docs are independent. |
| Cluster A | Phase 005 | Auto-rescan safety relies on scope-change guard. |
| Cluster C | Planning | Advisor hardening is independent. |
| Cluster E | Phase 005 | Extends the scope fingerprint guard introduced earlier. |
| Verification | All clusters | Runs targeted and broad gates after edits. |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Cluster | Rollback Path | Verification |
|---------|---------------|--------------|
| A | Revert readiness/query/context/verify changes and related tests. | `npx vitest run code_graph/tests/ tests/ensure-ready.vitest.ts`. |
| B | Revert README text only. | Markdown diff review. |
| C | Revert advisor rebuild and startup assertion helpers/tests. | `npx vitest run tests/advisor-rebuild.vitest.ts tests/context-server.vitest.ts -t "F-015|advisor_rebuild"`. |
| D | Revert context seed normalizer and CocoIndex docs. | `npx vitest run code_graph/tests/code-graph-context-handler.vitest.ts`. |
| E | Revert v3 glob fingerprint emission and scan config plumbing. | `npx vitest run code_graph/tests/code-graph-scan.vitest.ts code_graph/tests/code-graph-indexer.vitest.ts`. |
<!-- /ANCHOR:enhanced-rollback -->
