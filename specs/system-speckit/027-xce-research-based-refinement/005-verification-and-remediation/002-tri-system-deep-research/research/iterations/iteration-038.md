# Iteration 038 — Angle 38

**Angle:** Trigger vocabulary hygiene: the sk-git over-matching class — audit all skills for greedy keyword sets that need boundary disambiguation.

**Summary:** The native TypeScript scorer mostly uses token or phrase-boundary matching for skill metadata, but the Python fallback and multiple skill-local smart-router snippets still use greedy substring checks. The highest-risk concrete defect is the fallback `recreate agent` misroute; the broader sk-git `pr` class remains a cross-skill router hygiene refinement.

**Findings kept:** 4

## [P1][BUG] Python skill-advisor fallback matches explicit aliases by substring

- Evidence: .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py:3247-3258 and command `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "Recreate agent routing documentation" --threshold 0 --show-rejections` -> top result `create:agent`, confidence 0.95, reason `Matched: !create agent(explicit), !create agent(phrase), recreate~`
- Detail: The local fallback path treats alias variants as raw substrings, so `create agent` fires inside `recreate agent`. This is not just theoretical: when the native route is bypassed or unavailable, a documentation/routing request can become a create-agent command bridge recommendation.
- Fix sketch: Use `_matches_phrase_boundary()` or an equivalent boundary-aware matcher for alias variants and phrase boosters, with explicit exceptions only for slash-command literals.

## [P2][REFINEMENT] Skill-local smart routers use unbounded substring matching

- Evidence: .opencode/skills/sk-git/SKILL.md:61-65 and :120-122; .opencode/skills/sk-code-review/SKILL.md:127-134 and :181-184; .opencode/skills/system-spec-kit/references/cli/shared_smart_router.md:61-64 and :117-120; command output: `sk-git FINISH.pr: 'pr' in 'improve prompt' -> True`, `sk-git COMMIT.message: 'message' in 'messagepack parser' -> True`, `cli-claude CODE_EDITING.fix: 'fix' in 'prefix handling' -> True`, `sk-code-review TESTING.test: 'test' in 'latest routing notes' -> True`
- Detail: The skill-local resource routers repeatedly score `if keyword in text`, which makes short or common words behave greedily. This mainly affects which references/assets are loaded after a skill is selected, but it is the same over-matching class as the sk-git `pr` issue and appears across multiple skill routers.
- Fix sketch: Centralize a boundary-aware keyword matcher in the smart-router templates and require explicit `substring_ok` metadata for the rare patterns that intentionally match inside larger strings.

## [P2][REFINEMENT] sk-git keeps bare `pr` as a routing keyword

- Evidence: .opencode/skills/sk-git/SKILL.md:33 lists `pr`; .opencode/skills/sk-git/SKILL.md:64 includes `"pr"` in FINISH keywords; .opencode/skills/sk-git/SKILL.md:121 uses `if keyword in text`
- Detail: Bare `pr` is especially risky because it appears inside common words such as `prompt`, `improve`, and `production`. Even if top-level advisor tokenization is safer, the skill-local router still documents a greedy `pr` match that can inflate FINISH routing.
- Fix sketch: Replace bare `pr` with boundary-matched `\bpr\b`, uppercase acronym handling, or the explicit phrase `pull request`.

## [P2][DOC-DRIFT] Advisor scorer docs describe the `git` token target incorrectly

- Evidence: .opencode/skills/system-skill-advisor/references/scoring/advisor_scorer.md:90 says `git` maps to sk-code at 1.0; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:29 maps `git` to sk-git at 1.0
- Detail: The scoring reference claims a core git token routes to the code skill, but the native scorer routes it to sk-git. This is a small documentation error, but it directly touches the trigger vocabulary under audit and can mislead future tuning.
- Fix sketch: Update the scoring reference example to say `git` maps to sk-git at 1.0.
