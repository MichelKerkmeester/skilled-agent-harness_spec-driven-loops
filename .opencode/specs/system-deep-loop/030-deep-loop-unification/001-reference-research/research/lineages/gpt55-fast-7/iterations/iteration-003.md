# Iteration 3: External References, Advisor Corpus, and Guard Plugin

## Focus

Stress-test the external reference migration scope across command surfaces, advisor routing, corpus fixtures, graph metadata, and the OpenCode guard plugin.

## Findings

1. The external migration is broad enough to justify child 003's staged plan. A live scoped count across commands, agents, advisor, plugin, GitHub/root README surfaces found 764 old-name matches across 77 files, excluding specs and build output. [SOURCE: command:rg-count:2026-07-08]
2. Advisor routing has duplicated identity constants. Python `skill_advisor.py` points `MODE_REGISTRY_PATH` at `deep-loop-workflows`, and later hardcodes `MERGED_DEEP_SKILL_ID = "deep-loop-workflows"`; TypeScript `aliases.ts` separately hardcodes the same merged identity. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:83] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2579] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts:109]
3. Explicit lexical boosts also encode the old identity. `explicit.ts` maps `/deep:start-research-loop` and related phrases to `deep-loop-workflows`, so migration must include scorer constants, not just graph metadata and corpus files. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:105]
4. The routing corpus supports field-scoped replacement. The skill id appears in `skill_top_1` values for deep-loop prompt rows, while prompt text remains semantic training/evaluation material. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl:24] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/labeled-prompts.jsonl:41]
5. New risk: `mk-deep-loop-guard` fails open if its registry path is missed. It reads `.opencode/skills/deep-loop-workflows/mode-registry.json`, returns `null` on read/parse failure, and the hook skips mode-mismatch checks when `registry` is falsy; the plugin explicitly documents missing/unreadable registry as fail-open. [SOURCE: file:.opencode/plugins/mk-deep-loop-guard.js:35] [SOURCE: file:.opencode/plugins/mk-deep-loop-guard.js:75] [SOURCE: file:.opencode/plugins/mk-deep-loop-guard.js:353]

## Sources Consulted

- `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/spec.md`
- `.opencode/specs/system-deep-loop/052-deep-loop-unification/003-external-reference-migration/plan.md`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/aliases.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`
- `.opencode/plugins/mk-deep-loop-guard.js`

## Assessment

- `newInfoRatio`: 0.48
- Novelty justification: confirmed advisor duplication and surfaced the guard plugin's silent fail-open behavior as an actionable migration risk.
- Confidence: high that child 003 needs staged, category-specific migration and explicit advisor rebaseline.

## Reflection

- Worked: combining grep counts with targeted code reads separated volume risk from correctness risk.
- Failed: this pass did not inspect every README/agent duplicate; the stage plan's residual-grep exit gate remains necessary.
- Ruled out: relying on temporary symlinks or guard runtime behavior to catch stale plugin paths.

## Recommended Next Focus

Resolve whether fallback-router wiring should be a merge blocker, optional pre-rerun hardening, or deferred follow-up.
