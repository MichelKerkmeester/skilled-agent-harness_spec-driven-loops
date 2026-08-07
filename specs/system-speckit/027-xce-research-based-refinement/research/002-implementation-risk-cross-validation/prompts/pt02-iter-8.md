Deep-research iter 8/10 cross-validation pass for packet 027.

ITER 8 FOCUS: IRQ8 — code_packages necessity escalation triggers.

READ FIRST:
- 027/002-code-graph-trace/spec.md (especially P1 REQ-007 marking code_packages as optional + L2 EDGE CASES + Phase 5 of plan.md)
- 027/research/027-xce-research-based-refinement-pt-02/iterations/iteration-002.md (CONTAINS edge BLOCKING finding) and iteration-006.md (cross-phase contract findings)
- mcp_server/code_graph/lib/code-graph-db.ts (existing tables — code_files, code_nodes, code_edges. No code_packages today.)
- mcp_server/code_graph/lib/structural-indexer.ts (search for "fq_name" assignment — how is the dot-delimited prefix produced today?)
- mcp_server/code_graph/lib/indexer-types.ts (CodeNode field for fq_name)

QUESTION: Phase 002 P1 REQ-007 says `code_packages` table is OPTIONAL (~50 LOC). When does the fq_name prefix-splitting fallback fail vs require P0 schema migration?
- fq_name structure today: who produces it, what's the format? (e.g., `src.auth.middleware.requireAuth` or `src/auth/middleware.ts:requireAuth` or `auth.middleware.requireAuth`?)
- Languages where fq_name is well-defined: TS modules with explicit imports, Python packages. Cases where it's ambiguous: anonymous functions, IIFE-wrapped scopes, JS files with no explicit module structure, Rust `mod` declarations.
- Phase 002's fallback: split fq_name on `.` to derive module hierarchy. What about:
  - `class C { method m() {} }` → fq_name `module.C.m`. Splitting gives `module.C.m` → module="module.C", method="m". Wrong: module should be just "module".
  - Symbol with explicit re-export: `export { foo } from './lib'` — does fq_name reflect the re-export source or the importing module?
  - Symbol with `default export`: anonymous export, no name in fq_name? Or "default"?
- iter-2 BLOCKING finding: CONTAINS edge is class→method only, no module/file→symbol containment. So Phase 002's chain via CONTAINS is broken at the file/module rung. The fq_name fallback becomes the ONLY mechanism for module rung.
- Question: does the iter-2 finding ESCALATE Phase 002's REQ-007 from P1 to P0? If CONTAINS doesn't reach module level, fq_name splitting is the only path; if fq_name splitting is unreliable for some shapes (anonymous functions, default exports, re-exports), code_packages becomes mandatory.
- Empirical test: pick 5 distinct fq_name patterns from the live db (`SELECT DISTINCT fq_name FROM code_nodes LIMIT 5` — if accessible) and trace whether dot-splitting recovers the correct module rung. If not, escalate.
- Performance argument: code_packages table joins faster than runtime fq_name splitting on every query. At what scale does this matter?

DELIVERABLES (all 3 required):
1. WRITE `pt-02/iterations/iteration-008.md` (Focus, Actions with file:line, Findings with verdicts BLOCKING/CONFIRMED/NO-CHANGE-NEEDED, Q-Answered, Q-Remaining, Next Focus = IRQ9)
2. APPEND `>>` ONE LINE to `pt-02/deep-research-state.jsonl`:
{"type":"iteration","iteration":8,"newInfoRatio":<0..1>,"status":"complete","focus":"IRQ8"}
3. WRITE `pt-02/deltas/iter-008.jsonl` (1 iter record + ≥3 finding records)

CONSTRAINTS: LEAF, ≤12 tools, READ-ONLY 027/* + mcp_server/, WRITE pt-02/ ONLY.

NEXT: IRQ9 — LLM-enrichment dispatch shape (Phase 003 P1 enrichWithLLM=true; local-first via cli-opencode? SaaS leak prevention).
