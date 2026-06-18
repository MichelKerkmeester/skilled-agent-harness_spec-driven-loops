---
title: "022 — code_graph_query blast_radius multi-subject + transitive"
description: "Verify code_graph_query blast_radius operation in both single and union (multi-subject) modes, with and without includeTransitive expansion."
trigger_phrases:
  - "022 blast radius scenario"
  - "code graph blast radius testing"
importance_tier: "important"
contextType: "verification"
---

# Scenario 022 — `code_graph_query` blast_radius (multi-subject + transitive)

> **Coverage gap closed (F018):** the 015 + 016 playbook covered single-symbol blast-radius implicitly via `code_graph_context` impact mode. This scenario explicitly tests the `code_graph_query({operation:"blast_radius", ...})` tool path including multi-subject union (`unionMode:"multi"` + `subjects[]`) and transitive expansion (`includeTransitive:true`, `maxDepth`).

## Preconditions

- Code graph index is `fresh` (verify via `code_graph_status`).
- At least 100 indexed files with non-trivial import topology.

## Steps

1. **Single-subject baseline:**
   ```jsonc
   mcp__mk_code_index__code_graph_query({
     operation: "blast_radius",
     subject: ".opencode/skills/system-spec-kit/shared/embeddings.ts",
     limit: 20
   })
   ```
   Expected: returns a list of importing files / symbols affected if that file is mutated. `status` not `blocked`.

2. **Multi-subject union mode:**
   ```jsonc
   mcp__mk_code_index__code_graph_query({
     operation: "blast_radius",
     subject: ".opencode/skills/system-spec-kit/shared/embeddings.ts",
     subjects: [".opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts"],
     unionMode: "multi",
     limit: 30
   })
   ```
   Expected: result count ≥ single-subject baseline (union semantics — never fewer affected files than the single case alone).

3. **Transitive expansion:**
   ```jsonc
   mcp__mk_code_index__code_graph_query({
     operation: "blast_radius",
     subject: ".opencode/skills/system-spec-kit/shared/embeddings.ts",
     includeTransitive: true,
     maxDepth: 3,
     limit: 100
   })
   ```
   Expected: result count > non-transitive baseline (3 hops of dependent files included).

4. **Confidence filter:**
   ```jsonc
   mcp__mk_code_index__code_graph_query({
     operation: "blast_radius",
     subject: ".opencode/skills/system-spec-kit/shared/embeddings.ts",
     minConfidence: 0.7,
     limit: 50
   })
   ```
   Expected: result count ≤ unfiltered count (high-confidence edges only).

5. **Trace breadcrumbs:**
   ```json
   mcp__mk_code_index__code_graph_query({
     "operation": "blast_radius",
     "subject": ".opencode/skills/system-spec-kit/shared/embeddings.ts",
     "includeTrace": true,
     "limit": 20
   })
   ```
   Expected: affected entries include `why_included` breadcrumbs with depth and an import `edgeChain` for non-seed files. The same query without `includeTrace` omits `why_included`.

6. **Readiness refusal:** if you can artificially mark the graph stale (e.g., touch a file mtime), repeat step 1. Expected: `status:"blocked"`, `requiredAction:"code_graph_scan"`, NO affectedFiles returned (hard refuse, not soft degrade per the readiness invariant in architecture.md §6).

## Pass criteria

| # | Check | Pass |
|---|-------|------|
| 1 | Single-subject returns non-blocked | ☐ |
| 2 | Multi-subject union ≥ single-subject | ☐ |
| 3 | Transitive expansion > non-transitive | ☐ |
| 4 | minConfidence filter reduces count | ☐ |
| 5 | `includeTrace:true` adds `why_included`; default response omits it | ☐ |
| 6 | Stale graph returns blocked (hard refuse) | ☐ |

## Notes

Tests the path in `mcp_server/handlers/query.ts`. Multi-subject union logic is in the blast-radius assembler; transitive BFS uses the maxDepth bound to prevent runaway traversal. Trace breadcrumbs are built from `.opencode/skills/system-code-graph/mcp_server/lib/graph/bfs-traversal.ts` and are covered by `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-query-handler.vitest.ts`.

> **Contract (fixed in packet 029 phase 008, F-022-1):** `blast_radius` honors `includeTransitive`. Default (flag absent) returns **direct importers only (depth 1)**; `includeTransitive:true` opts into multi-hop closure up to `maxDepth` (default 3). Step 3's `transitive > non-transitive` assertion therefore depends on step 1 running WITHOUT `includeTransitive` (depth-1 baseline) and step 3 WITH it. Before the fix the flag was ignored and blast_radius was always multi-hop, so this assertion was unsatisfiable.
