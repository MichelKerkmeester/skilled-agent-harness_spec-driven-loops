---
title: "Implementation Plan: Code Graph + Advisor + Hooks Polish"
description: "Sequential plan for Phase 006 clusters A-E: hook docs, CocoIndex interop, read-path readiness, advisor hardening, and glob-aware fingerprints."
trigger_phrases:
  - "026/007/012/006 plan"
  - "clusters A-E plan"
  - "read-path auto-rescan plan"
importance_tier: "critical"
contextType: "implementation"
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
- [x] Gate 3 pre-approved by user for `specs/.../006-cluster-a-to-e/`.
- [x] Source research read from `003-deep-research-issues/research/research.md`.
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
- Create Level 2 packet docs under the user-approved `specs/.../006-cluster-a-to-e/` folder.
- Add `006-cluster-a-to-e` to the parent `children_ids` array.

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

<!-- ANCHOR:risks -->
## 6. RISKS

| Risk | Mitigation |
|------|------------|
| Auto-rescan could revive destructive scan paths. | Gate on scope equality and parse-error backlog, and rely on prior Phase 005 scope guard. |
| Fingerprint v3 could block legacy installations. | Parse v2 fingerprints as legacy and allow graceful first repair. |
| Context-server startup tests may be brittle. | Keep assertion helper small and test predicate behavior without broad startup rewrites. |
| Doc-only findings could drift into behavior changes. | Limit Cluster B and F-017 to markdown edits only. |
<!-- /ANCHOR:risks -->
