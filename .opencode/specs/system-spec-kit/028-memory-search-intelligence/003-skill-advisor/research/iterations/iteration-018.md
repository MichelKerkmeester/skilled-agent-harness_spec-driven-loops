# Iteration 18: Round J External-Coverage Final — aionforge-procedural is the one genuine miss

## Focus
Round J: did the 100-iteration campaign miss any external system surface with transferable value? Read-only.

## Findings (newInfoRatio 0.15)
**One genuine miss: `aionforge-procedural`** — the procedural-memory / skill-ranking crate, skipped despite Skill Advisor being a skill-ranking system.
| Net-new item | Source | Informs | Lev |
|---|---|---|---|
| **Outcome-weighted skill ranking** — Beta-posterior reliability `(α₀+s)/(α₀+β₀+s+f)` over recorded execution successes/failures, blended as `score = similarity × reliability × penalty` (fresh skill = neutral 0.5) | aionforge-procedural/src/ranking.rs, memory.rs:256-281 (`record_skill_outcome`) | **Skill Advisor** — rank by observed success/failure history, not metadata similarity alone | M (H for advisor) |
| Per-skill failure-mode storage + query-scored recall ("how this skill tends to fail on inputs like yours") | aionforge-procedural/src/memory.rs:304; tests/bad_patterns.rs | Skill Advisor — surface known failure patterns with a recommendation | M |
| Advertised-metadata token-budget regression test | aionforge-mcp/tests/token_budget.rs | MCP tool/skill descriptions — lint against a token ceiling | L |
| Two-tier memory (persistent status-tracked work-items vs decaying episodes) | plugins/.../work-tracking/SKILL.md | Memory — explicit non-decay tier (mostly framing) | L |

**NO TRANSFER (confirmed plumbing/agent-loop):** aionforge-embed (HTTP embedder), aionforge-capture (echoes mined store/consolidate/security), aionforge-mcp transport/telemetry, cli/tui/auth/config; the memory-* consumer skills (packaging of already-mined recall/consolidate/forget); ALL galadriel surfaces (SOUL/CONTEXT/TOOLS = persona, tower=web, discord_bot, cmd=CLI).

## Verdict
**External coverage is COMPLETE except `aionforge-procedural`** — one crate genuinely skipped, warranting a follow-up mining pass for the advisor (outcome-weighted ranking + failure-mode recall). Notably, this maps to the Round-A-refuted Memory "bad-pattern/procedural" cluster — but here applied to SKILL selection (advisor), where it's net-new, not Memory (where the infra couldn't host it).

## Next Focus
Document `aionforge-procedural` mining as the single external follow-up (advisor outcome-weighted ranking + failure-mode recall). Otherwise external coverage is complete at 100. Feeds the roadmap addendum's "follow-ups" section.
