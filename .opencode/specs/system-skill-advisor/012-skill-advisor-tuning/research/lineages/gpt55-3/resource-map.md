# Research Resource Map - fanout gpt55-3

## Scorer Sources
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts` - projection from SQLite/filesystem plus hardcoded command bridges.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` - hardcoded token/phrase boosts and metadata explicit lane scoring.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts` - derived trigger/keyword/doc trigger scoring.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts` - positive and conflict graph propagation.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` - cosine lane and embedding source fields.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` - query class, fusion, conflict adjustment, ambiguity application.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/ambiguity.ts` - top-cluster ambiguity calculation.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts` - metadata-derived alias table precedent.

## Parent Hub Sources
- `.opencode/skills/sk-code/graph-metadata.json`, `mode-registry.json`, `hub-router.json`.
- `.opencode/skills/sk-design/graph-metadata.json`, `mode-registry.json`, `hub-router.json`.
- `.opencode/skills/deep-loop-workflows/graph-metadata.json`, `mode-registry.json`, `hub-router.json`.

## Guard And Eval Sources
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs` - hub-local vocabulary sync guard.
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-validate.ts` - validation slices and ambiguity stability caveat.
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/007-eval-hardening/implementation-summary.md` - frozen baseline and ambiguity slice evidence.
- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md` - semantic_shadow freeze evidence.

## Proposed Follow-Up Assets
- `cross-hub-vocab-collisions.json` - normalized phrase -> hub/mode/intent-class owners.
- `cross-hub-ambiguity-prompts.jsonl` - labeled parent-hub ambiguity set.
- `command-bridge-projection.json` or SQLite table - generated command bridge projection.
- `mcp-semantic-neighbor-abstain.jsonl` - semantic_shadow gold-none false-fire guard.
