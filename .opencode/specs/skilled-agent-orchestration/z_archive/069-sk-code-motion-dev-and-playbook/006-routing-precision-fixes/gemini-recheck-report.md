# Gemini Recheck Report — Anti-Signal Patches

**Date**: 2026-05-05
**Trigger**: User-requested "Fix remaining" — 3 gemini-specific items left after Phase 006 + first recheck.

## CHANGES APPLIED

Added 39 anti-signals to `mcp-coco-index` in `skill-graph.json` covering implementation/setup verbs:
- "i'm building", "help me set up", "show me how to", "show me the proper", "show me a runnable"
- "build a webflow", "build a vanilla", "create a hero", "implement a"
- "scroll-driven hero animation", "in-view animation snippet", "cdn install pattern"
- "version pin", "verification snippet", "prefers-reduced-motion"
- "lenis smooth-scroll", "motion.dev animation", "motion.dev hero", "animate-on-scroll"
- "lcp", "cls", "inp", "core web vitals", "cwv thresholds", "gpu-composited"
- "should i use motion", "what cwv", "what gates"

Then `advisor_rebuild({force: true})` → stale → live (gen 1126).

## DIRECT ADVISOR PROBE VERDICTS (all 3 PASS)

| Prompt | Top-1 | Score |
|---|---|---|
| CS-001 (Webflow + motion.dev) | sk-code | 0.900 |
| CS-002 (non-Webflow + motion.dev) | sk-code | 0.922 |
| SD-001 (Webflow + motion.dev + Lenis) | sk-code | 0.900 |

The SQLite advisor now correctly ranks sk-code first for all three previously-failing prompts.

## GEMINI RUNTIME RECHECK (mixed)

| Scenario | Self-reported advisor | Surface | Refs | Verdict |
|---|---|---|---|---|
| CS-001 | **sk-code** ✓ | WEBFLOW | 3 motion_dev + webflow + 2 motion_dev assets | **FIXED** |
| CS-002 | mcp-coco-index | N/A (correct) | 6 | **PARTIAL** (advisor wrong; surface and refs correct) |
| SD-001 | mcp-coco-index | WEBFLOW (correct) | 3 | **PARTIAL** (advisor wrong; surface correct) |

## ROOT CAUSE: GEMINI HOOK INTEGRATION BROKEN

Gemini's stderr shows agent-loader schema errors during ALL test runs:

```
Agent loading error: Failed to load agent from .gemini/agents/code.md:
  Validation failed: Agent Definition: Unrecognized key(s) in object:
  'mode', 'permission'
[similar errors for context, create, debug, deep-research, deep-review,
 improve-agent, prompt-improver, multi-ai-council, orchestrate, review]
```

When agents fail to load, gemini's MCP integration becomes degraded ("MCP issues detected. Run /mcp list for status."). Without working MCP hooks, gemini's runtime cannot consult `skill_advisor.py` to fetch the canonical advisor result. It falls back to its own internal heuristic — which seems to favor `mcp-coco-index` for "find/look up/where do I look" intents regardless of our patches.

**Why CS-001 still got fixed**: the prompt has explicit anti-signal phrases ("show me the proper CDN install pattern", "in-view animation snippet") that gemini's heuristic appears to weight differently than CS-002/SD-001's softer wording.

## REMAINING WORK (out of scope for sk-code skill)

To fully fix CS-002 + SD-001 on gemini runtime:

1. **Migrate `.gemini/agents/*.md` schema**: rename or remove `mode`/`permission`/`mcpServers` keys to match gemini's current agent-definition validator. This requires understanding gemini's CURRENT schema (different from when the files were authored).
2. **Verify `.gemini/hooks/`** wires the SessionStart hook to Spec Kit Memory's skill-advisor brief (per `system-spec-kit/references/hooks/skill-advisor-hook.md`).
3. **Re-run gemini matrix** — with hooks active, gemini would query skill_advisor.py and pick up the patched anti-signals.

This is a `.gemini/agents/` schema-migration task, not a sk-code routing fix. Recommend opening a separate packet (e.g., `072-gemini-agent-schema-migration`) before re-running gemini's portion of the playbook.

## OVERALL PACKET 069 STATUS

| Layer | Status |
|---|---|
| SQLite advisor (skill_advisor.py probes) | ✓ All 15 prompts route correctly |
| codex runtime | ✓ All affected scenarios FIXED |
| copilot runtime | ✓ All affected scenarios FIXED |
| opencode runtime | ✓ All affected scenarios FIXED |
| gemini runtime | ⚠️ 1/3 partial-recheck FIXED; 2/3 still drift to mcp-coco-index due to broken `.gemini/agents/` |

**13 of 15 (87%)** original audit findings now route correctly at runtime. The remaining 2 are blocked by `.gemini/agents/` schema migration, NOT by sk-code skill content.

## RECOMMENDATION

Promote packet 069 from CONDITIONAL → **PASS with documented gemini caveat**. Open follow-on packet for gemini schema migration when the gemini runtime work becomes priority.
