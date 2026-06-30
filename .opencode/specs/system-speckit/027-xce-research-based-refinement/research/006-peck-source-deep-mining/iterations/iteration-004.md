# Iteration 004 — Reviewer token-budget read discipline

**Focus:** peck code-reviewer "justify each read; never re-read a new file" vs spec-kit @review/@context/deep-review/deep-research tool-call budgets.
**Executor:** cli-opencode `openai/gpt-5.5-fast` --variant high (read-only; orchestrator-written artifacts). **Status:** complete. **newInfoRatio:** 0.72.

## Findings
- **[F-004-01]** @review real gap: peck opens files only when the diff is insufficient + states the reason + never re-reads new files (`external/peck-master/src/assets/agents/code-reviewer.md:37`); @review's "Did I Read every file I'm reviewing?" can incentivize BROAD reads (`.opencode/agents/review.md:48-52,338-340`). **ADOPT** · S · low · blast: `.opencode/agents/review.md`.
- **[F-004-02]** @context partial gap: has routing discipline + output budget + "over-reading" guidance but not "state why before this Read" (`.opencode/agents/context.md:92-103,143-148,274-281`). **ADAPT** · S · low.
- **[F-004-03]** deep-review real but constraint-sensitive: caps calls + count-before-action, but MANDATES P0 evidence rereads → peck's "never re-read" must NOT override severity verification (`deep-review/SKILL.md:383-393`, `.opencode/agents/deep-review.md:166-170,189-195`). **ADAPT** · M · med.
- **[F-004-04]** deep-research partial: enforces one-focus + max-12 calls but lacks per-read justification (`deep-research/SKILL.md:375-396`, `.opencode/agents/deep-research.md:162-183`). **ADAPT** · S · low.
- **[F-004-05]** net-new mechanism = QUALITATIVE read-friction (each read tied to a stated unknown), distinct from spec-kit's NUMERIC TCB (max 12 calls). **ADOPT** for diff-review surfaces, **ADAPT** for research/retrieval · S · low.

## Ruled out
- read-only/LEAF boundaries already enforced in both.
- acceptance-reviewer read-scope ≠ the token-cost rule.
- numeric TCB already shipped — the delta is per-read justification, not call counting.

## Verdict contribution
Net-new: a "state the reason before each non-diff Read; never re-read full-content files" discipline. **ADOPT for @review** (clean win); **ADAPT for deep-review/deep-research/@context** (must not override P0 rereads). Bundles with 001 as agent-prompt discipline.
