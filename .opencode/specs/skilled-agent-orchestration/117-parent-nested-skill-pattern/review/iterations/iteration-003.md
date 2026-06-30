# Review Iteration 003 — Drift-guard efficacy

- **Model**: gpt-5.5-fast xhigh
- **Seat**: r03
- **clean**: False
- **findings**: 1

## Analysis

I’ll keep this read-only and focus only on the drift-guard efficacy slice: inspect the real test and related registry/map definitions, then spot-run the targeted test if the repo tooling allows it.
SKILL ROUTING: `sk-code-review` recommended with confidence 0.95, with `system-skill-advisor` also relevant for the tested routing surface. I’ll use the review standard and inspect the advisor routing files directly.
I’m inspecting the test and its live inputs now: the mode registry, Python dump implementation, and TS alias/routing exports.
The test is explicit `toEqual` against registry projections, so extra keys on either side should fail unless the projection is incomplete. I’m checking that projection completeness and alias coverage rather than relying on the test comments.
A likely gap is emerging: the alias assertion imports the TypeScript alias table, but the Python advisor also has its own `SKILL_ALIAS_GROUPS`. I’m confirming whether the Python aliases can drift independently and whether that affects this guard’s stated contract.
I found a concrete alias mismatch in the live Python alias table versus the registry. I’m spot-running the targeted Vitest guard to confirm whether that mismatch is currently caught or passes.
**Findings**

P1 `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:95` - The alias drift guard only compares registry `legacyAliases` to the TypeScript `SKILL_ALIAS_GROUPS`, not the Python advisor’s live alias table. `--dump-routing-maps` emits only `DEEP_ROUTING_SKILLS` and `DEEP_ROUTING_MODE_BY_KEY` at `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:3780`, while Python aliases already differ from the registry: `deep-research` and `deep-review` use `deep:start-*` in Python at `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:236` and `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:243`, but registry uses `spec_kit:*` at `.opencode/skills/deep-loop-workflows/mode-registry.json:45` and `.opencode/skills/deep-loop-workflows/mode-registry.json:61`. Python also has a narrower `deep-ai-council` set at `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:256` than the registry at `.opencode/skills/deep-loop-workflows/mode-registry.json:77`. This is not cosmetic: Python deep routing reads those aliases for recent/operator history scoring at `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:2420`. Spot-run result: `npm test -- tests/routing-registry-drift-guard.vitest.ts` passed 5/5, so this real drift is not caught.

Fix: extend `--dump-routing-maps` to include Python `SKILL_ALIAS_GROUPS`, then assert registry `legacyAliases` equals both Python and TypeScript alias tables for routed modes.

===REVIEW-JSON===
{"slice":"drift-guard-test-efficacy","findings":[{"severity":"P1","path":".opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:95","issue":"Alias drift assertion only checks TypeScript SKILL_ALIAS_GROUPS; Python SKILL_ALIAS_GROUPS is not dumped or compared, and current Python aliases already differ from registry legacyAliases while the targeted test still passes.","fix":"Add Python SKILL_ALIAS_GROUPS to --dump-routing-maps and assert registry legacyAliases against both Python and TypeScript alias tables for routed modes.","confidence":"high"}],"clean":false}
===END===

## Findings (structured)

```json
[
  {
    "severity": "P1",
    "path": ".opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:95",
    "issue": "Alias drift assertion only checks TypeScript SKILL_ALIAS_GROUPS; Python SKILL_ALIAS_GROUPS is not dumped or compared, and current Python aliases already differ from registry legacyAliases while the targeted test still passes.",
    "fix": "Add Python SKILL_ALIAS_GROUPS to --dump-routing-maps and assert registry legacyAliases against both Python and TypeScript alias tables for routed modes.",
    "confidence": "high"
  }
]
```
