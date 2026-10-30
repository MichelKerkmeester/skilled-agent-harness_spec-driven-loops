# Prompt improver survey ledger

Survey run 2026-10-30 by a delegated web agent; three load-bearing quotes re-fetched and confirmed by the orchestrating session (marked CONFIRMED). Everything else is the delegate's reading of the fetched page. UNVERIFIED items carry no requirement in `spec.md`.

## Local: AI Systems Prompt Improver (`sk-prompt-improver` v1.0.1.0, kernel v1.0.1)

- Same lineage as sk-prompt (DEPTH, CLEAR, RCAF), diverged since: every shared file differs by 343 to 949 diff lines.
- Delivers first, lists defaults as numbered open items, asks only when there is no prompt and no task.
- `strip_source_prompt()` sets a pasted prompt aside before mode detection.
- `benchmark/router/run_fixtures.sh` printed `PASSED 32/32 fixtures` plus a kernel parity pass on 2026-10-30.
- Adds creative modes with their own scorers (EVOKE, VISUAL), per-dimension CLEAR floors and a 3-cycle repair cap.

## Public sources

1. Anthropic prompting best practices, https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
   - CONFIRMED: "Prefer general instructions over prescriptive steps."
   - CONFIRMED: the advice to soften "CRITICAL: You MUST use this tool when..." into normal prompting.
   - CONFIRMED: "Before you finish, verify your answer against" test criteria.
   - Clear and direct, explain why, 3-5 varied examples in example tags, XML sections, long documents first.
2. Anthropic Opus 5.5 prompting page: remove "think carefully" lines, control depth with effort, not wording; asking for written reasoning can be refused.
3. Anthropic Console prompt improver article, https://claude.com/resources/articles/prompt-improver: adds a reasoning section, standardises examples in XML, prefills; delivers first, judged in the Evaluations tab. Current Console steps UNVERIFIED.
4. Anthropic skill-creator, https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md: explain the why, all-caps ALWAYS or NEVER is a yellow flag, remove what does not pull its weight, judge with 2-3 realistic test prompts run with and without the skill.
5. OpenAI prompt generation, https://developers.openai.com/api/docs/guides/prompt-generation: one fixed skeleton, reasoning before conclusions, keeps user content, a "Simple Change" check that skips the rest; never asks questions.
6. OpenAI GPT-5 guide: contradictions cost reasoning tokens; metaprompt for minimal edits.
7. OpenAI prompt optimizer, https://developers.openai.com/api/docs/guides/prompt-optimizer: CONFIRMED needs "at least three rows" with a grader result or annotation; CONFIRMED Evals read-only on October 31, 2026 and shut down on November 30, 2026.
8. Gemini prompting strategies, https://ai.google.dev/gemini-api/docs/prompting-strategies: few-shot always, one delimiter style, constraints first, question last. Vertex optimizer tiers: zero-shot, few-shot with feedback, data-driven. Detailed Vertex loop UNVERIFIED.
9. DSPy optimizers and promptfoo: quality is a metric over examples; "Test-driven prompt engineering is much more effective than trial-and-error." GEPA detail UNVERIFIED.
10. severity1/claude-code-prompt-improver: about 189-token hook, clear prompts pass through, vague ones get 1-6 multiple-choice questions, `*` bypass.
11. christabone/claude-prompt-improvement: 10-item yes or no checklist with reasons, "Not every prompt needs improvement", growth under 3x, confidence rating.
12. melodic-software prompt-improvement: method UNVERIFIED.

## Cross-source finding

No surveyed vendor or community tool runs a multi-round, multi-perspective thinking ritual, though the local AI Systems sibling still mandates DEPTH, and no vendor guide names acronym frameworks. They converge on one assessment pass, a fixed component skeleton, examples, and evaluation against real inputs.
