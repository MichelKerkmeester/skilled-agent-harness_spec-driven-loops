---
title: "Implementation Plan: Phase 8: codegraph-why-included"
description: "Implement includeTrace-gated why_included edge-chain breadcrumbs for code graph blast_radius and context output."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/009-advisor-codegraph-shared-features/003-codegraph-why-included"
    last_updated_at: "2026-06-10T23:30:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed includeTrace-gated breadcrumb implementation and verification"
    next_safe_action: "None"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/graph/bfs-traversal.ts"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/query.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-codegraph-why-included"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use shortest retained chain per file, capped by existing limit/depth/budget/deadline controls."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: codegraph-why-included

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node) |
| **Framework** | mk_code_index MCP daemon |
| **Storage** | code-graph SQLite (AST index) |
| **Testing** | vitest |

### Overview
Add a debug-only `why_included` breadcrumb path to the two code graph read surfaces that already return impacted context: `blast_radius` and `code_graph_context`. The default response shape remains compact; callers only receive chain data when `includeTrace` is explicitly true.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing: typecheck, build, targeted vitest suites
- [x] Docs updated: spec, plan, tasks, implementation summary
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Opt-in debug enrichment on existing read payloads.

### Key Components
- **BFS helper**: preserves optional path steps and truncated frontier entries for callers that need trace output.
- **`computeBlastRadius`**: converts import-dependent BFS paths into per-file `why_included` breadcrumbs when `includeTrace` is true.
- **`buildContext`**: adds section-level `why_included` breadcrumbs for anchor and one-hop context files when `includeTrace` is true.

### Data Flow
Blast-radius traversal records file import edges as BFS path payloads, picks the shortest retained chain for each affected file, and omits the chain unless `includeTrace` is true. Context expansion records the anchor plus one-hop call/import/export edges into `graphContext[].why_included` only for trace requests.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| `lib/graph/bfs-traversal.ts` | Shared BFS traversal for graph reads | Added optional path and truncated frontier data without changing result values | `bfs-traversal.vitest.ts` |
| `handlers/query.ts` | `code_graph_query` blast-radius response | Added `includeTrace` handling and trace-only `why_included` fields | `code-graph-query-handler.vitest.ts` |
| `lib/code-graph-context.ts` | `code_graph_context` section builder | Added trace-only section breadcrumbs | `code-graph-context-handler.vitest.ts` |

Required inventories:
- Same-class producers: `code_graph_query blast_radius`, `code_graph_context`, and shared BFS traversal were inspected.
- Consumers of changed symbols: existing query/context/BFS tests cover default response shape and trace opt-in behavior.
- Matrix axes: `includeTrace` false/true, direct vs transitive blast radius, max-depth truncation, context one-hop edge metadata.
- Algorithm invariant: default-off responses must not include `why_included`; trace-on chains must derive from actual traversal edges.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Reused existing code-graph package and test harness
- [x] No dependency or package changes required
- [x] Confirmed phase 007 BFS helper is present

### Phase 2: Core Implementation
- [x] Extended BFS helper to retain optional path breadcrumbs and truncated frontier data
- [x] Added `includeTrace`-gated `why_included` breadcrumbs to blast-radius output
- [x] Added `includeTrace`-gated `graphContext[].why_included` breadcrumbs to context output

### Phase 3: Verification
- [x] Typecheck and build passed
- [x] Targeted vitest suites passed: BFS, query handler, context handler
- [x] Phase docs updated and ready for strict validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | BFS path retention and truncation metadata | vitest |
| Unit | `blast_radius` trace-on/default-off behavior | vitest |
| Unit | `code_graph_context` trace-on/default-off behavior | vitest |
| Build | TypeScript typecheck and build | npm scripts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Phase 007 BFS helper | Internal | Green | Trace chains would need local traversal logic instead |
| Existing query/context tests | Internal | Green | Would reduce confidence in default-off compatibility |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: default payloads gain `why_included` without `includeTrace`, or trace chains do not match actual traversal edges.
- **Procedure**: revert the BFS path additions and trace-only call-site fields from the three implementation files, then rerun the targeted vitest suites.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
