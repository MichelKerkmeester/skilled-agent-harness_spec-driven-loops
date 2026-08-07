Deep-research iter 1/10 cross-validation pass for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

CONTEXT: 5 implementation phases (001-005) were scaffolded based on pass-1 findings from cli-opencode/deepseek-v4-pro. THIS PASS uses cli-codex/gpt-5.5/high/fast as cross-validator. Goal: find implementation risks, schema gaps, edge cases, and alternative approaches the first AI missed.

ITER 1 FOCUS: IRQ1 — Phase 001 HLD/LLD determinism + edge cases.

READ FIRST:
- 027/001-code-graph-hld-lld/spec.md (especially REQ-001 determinism + L2 EDGE CASES section)
- mcp_server/code_graph/lib/code-graph-db.ts:107-150 (schema)
- mcp_server/code_graph/lib/indexer-types.ts:12-44 (SymbolKind, EdgeType, DEFAULT_EDGE_WEIGHTS)
- mcp_server/code_graph/lib/structural-indexer.ts:944-993 (capturesToNodes)
- 027/research/research.md (pass-1 baseline)

QUESTION: Where could non-determinism leak into Phase 001's `generateHLD()` / `generateLLD()` / `generateFileNarrative()` outputs? Stress-test scenarios:
- Empty file (no symbols)
- File with 1000+ symbols (truncation behavior)
- File with missing/empty docstrings (template fallback)
- Mixed-language file (TS + embedded SQL/regex/markdown)
- File with multiple top-level "module" symbols
- Hub symbol with high fan-in (>10 callers — REQ-009 threshold)
- Symbol with edges to nodes NOT in code_files (foreign-key dangling)
- Re-running on stale db (file changed but not reindexed)

DELIVERABLES (all 3 required):
1. WRITE `pt-02/iterations/iteration-001.md` with sections: Focus, Actions Taken (with file:line cites), Findings (each with file:line evidence + verdict BLOCKING/CONFIRMED/NO-CHANGE-NEEDED), Questions Answered, Questions Remaining, Next Focus (IRQ2).
2. APPEND ONE LINE to `pt-02/deep-research-state.jsonl` (must NOT overwrite, use `>>` append):
{"type":"iteration","iteration":1,"newInfoRatio":<0..1>,"status":"complete","focus":"IRQ1"}
3. WRITE `pt-02/deltas/iter-001.jsonl` with multi-line JSONL: 1 iteration record + ≥3 finding records {"type":"finding","id":"f-iter001-NNN","severity":"P0|P1|P2","label":"...","verdict":"BLOCKING|CONFIRMED|NO-CHANGE-NEEDED","iteration":1}.

CONSTRAINTS:
- LEAF agent. Max 12 tool calls.
- READ-ONLY: 027/{spec.md, 001-005/, research/}, mcp_server/code_graph/, mcp_server/skill_advisor/.
- WRITE: pt-02/ ONLY. NEVER touch 001-005/ phase dirs, NEVER touch 027/research/iterations/ (pass-1 artifacts), NEVER touch mcp_server/.
- Cite file:line for EVERY claim. No bare assertions.
- Verdict diversity required across iter 1-10: ≥1 BLOCKING + ≥1 CONFIRMED + ≥1 NO-CHANGE-NEEDED total.

NEXT iter focus hint: IRQ2 — Phase 002 CONTAINS edge cross-language population (TS-only or all langs?).
