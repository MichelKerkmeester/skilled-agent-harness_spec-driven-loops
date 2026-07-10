# Resource Map: gpt55-2 Research Lineage

## Core Charter

- `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/_research-charter.md` - ranked agenda and read-only boundary.

## Scorer Files

- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` - token/phrase boosts, metadata contributions, explicit-lane clamp.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` - primary intent bonuses, query class, ambiguity handling, RRF/conflict/executor tail.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts` - SQLite/filesystem projection and hardcoded command bridges.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts` - derived trigger/keyword scoring.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts` - edge weights and negative conflict semantics.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` - cosine lane behavior and runtime health.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts` - metadata-derived alias-table precedent.
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/scoring-constants.ts` - calibration values for code-audit and other intent seams.

## Parent Hubs And Metadata

- `.opencode/skills/sk-code/graph-metadata.json` - code-review/audit ownership.
- `.opencode/skills/deep-loop-workflows/graph-metadata.json` - stale code-audit/deep-review loop projection.
- `.opencode/skills/sk-design/graph-metadata.json` - design audit identity and design-mode vocabulary.
- `.opencode/skills/deep-loop-runtime/graph-metadata.json` - runtime skill identity and deep-loop-workflows relationship.
- `.opencode/skills/sk-code/hub-router.json` - sk-code typed vocabulary classes.
- `.opencode/skills/deep-loop-workflows/hub-router.json` - deep-loop typed vocabulary classes.
- `.opencode/skills/sk-design/hub-router.json` - design typed vocabulary classes.
- `.opencode/skills/sk-code/mode-registry.json` - sk-code mode aliases and advisor routing.
- `.opencode/skills/deep-loop-workflows/mode-registry.json` - deep-loop mode aliases and command-bridge classes.
- `.opencode/skills/sk-design/mode-registry.json` - design mode aliases.

## Guards And Tests

- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs` - existing single-hub vocab guard.
- `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts` - deep-loop registry/advisor projection drift guard.
- `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/ambiguity-slice.vitest.ts` - frozen ambiguity-slice gate.
- `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/conflict-query-rerank.vitest.ts` - conflict/query-class/exact-semantic seams.
- `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/projection-fallback-049-005.vitest.ts` - projection fallback honesty.
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json` - ratcheted baseline.
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/ambiguity-prompts.jsonl` - frozen ambiguity rows.

## Prior Packets

- `003-advisor-rrf-fusion/benchmark-results.md` - RRF, conflict-rerank, and self-guard verdicts.
- `007-eval-hardening/implementation-summary.md` - ambiguity slice, buckets, ratchet, holdout.
- `008-semantic-shadow-prove-or-freeze/implementation-summary.md` - semantic-shadow freeze and false-fire evidence.
- `001-scorer-saturation-root-fix/implementation-summary.md` - root plan constraints and Layer-1b dependency.
