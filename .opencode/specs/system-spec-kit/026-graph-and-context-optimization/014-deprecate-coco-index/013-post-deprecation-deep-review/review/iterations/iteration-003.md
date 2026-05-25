# Iteration 3 - D3 Traceability / Cross-Reference & Governance

## Files Reviewed
- `CLAUDE.md:69-97`
- `AGENTS.md:69-97`
- `.claude/CLAUDE.md:1-5`
- `.gemini/GEMINI.md:1-5`
- `.codex/AGENTS.md:1-183`
- `resource-map.md:1-131`
- `spec.md:96-124`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/intent-prompt-corpus.ts:1-132`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/lexical.ts:1-89`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:1-171`

## Findings

### P0
- none

### P1
- **F007**: spec.md phase-map claims phases 002-012 complete despite residue — `spec.md:101-114` — The phase-map table marks all phases 002-012 as "Complete", but iter-1 found 4 misses (F001-F004: GEMINI.md routing, .gitignore, skill-graph.json, /memory:manage) and iter-2 found 2 P2s (F005-F006: embedder_pluggability obsolete commands, doctor_deep-loop.yaml vestigial glob) that should have been cleaned in those phases. Either update the phase-map to reflect residue status or add a "complete with known residue" qualifier to maintain traceability accuracy.

### P2
- none

## Confirmed-Clean Surfaces
- **Runtime routing parity**: CLAUDE.md, AGENTS.md, and .claude/CLAUDE.md all have the correct HYBRID search-routing policy (Code Graph + Grep). .codex/AGENTS.md is voice/tone only and uses the project-level AGENTS.md. The only drift is the known F001 in .gemini/GEMINI.md (routes to deleted mcp__cocoindex_code__search).
- **Resource-map DELETE classifications**: Both deleted skills confirmed gone — mcp-coco-index and system-rerank-sidecar folders do not exist in .opencode/skills/.
- **Skill-advisor routing**: The lexical lane correctly routes "find code" intents to system-code-graph with hints like "code graph", "structural search", "grep not enough", "find code", "where logic" (lexical.ts:29). The semantic-shadow lane uses embedders and does not reference coco-index. The intent-prompt corpus has "Use system-code-graph for structural code search" (intent-prompt-corpus.ts:43-46) which is correct. No routing to the deleted mcp-coco-index skill found.

## Claim Adjudication
- F007: claim "spec.md phase-map completion claims are inaccurate"; evidence spec.md:101-114 (phases 002-012 marked "Complete"); counterevidence sought = whether "complete" allows for harmless residue; alternative = retain as historical record (rejected — traceability requires accuracy: phases marked complete should not have P0/P1 residue); finalSeverity P1; confidence 0.90.

## Next Focus
D4 Maintainability over clusters D+E

Review verdict: CONDITIONAL
