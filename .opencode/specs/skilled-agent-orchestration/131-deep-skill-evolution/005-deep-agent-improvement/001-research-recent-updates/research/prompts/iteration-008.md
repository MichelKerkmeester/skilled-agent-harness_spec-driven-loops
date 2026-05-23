# RCAF DEEP RESEARCH — ITERATION 8 — final devin adversarial pass

## ROLE
Last devin iter. Final adversarial sweep on areas iters 1-7 may have skimmed. Aim for HIGH precision (0 false-positives) rather than coverage.

## CONTEXT

Iter 8 of 10 (last cli-devin iter; iters 9-10 are cli-codex synthesis).

Iter-7 adjudication: 12 CONFIRMED / 2 OUTDATED / 1 MISCATEGORIZED / 0 FALSE-POSITIVE out of 15 adjudicated. Strong confirmation rate — deep-agent-improvement has REAL defects (unlike 119 which had 9 of 11 false-positives).

Current actionable queue (post-iter-7): ~4 P0 / ~10 P1 / ~5 P2 — much more substantive than 119's final 2 P1 + 3 P2.

## ACTION

This iter probes areas the prior iters didn't fully cover.

**Step 1: Probe untouched surfaces**

Specifically check:
- `.opencode/skills/deep-agent-improvement/assets/` — full inventory + adversarial check on each template
- `.opencode/skills/deep-agent-improvement/references/` — verify each reference doc matches actual code
- `.opencode/skills/deep-agent-improvement/feature_catalog/` — if exists, verify feature entries cite real code paths
- `.opencode/skills/deep-agent-improvement/manual_testing_playbook/` — if exists, verify scenarios are executable

**Step 2: Multi-runtime agent definition sync check**

If deep-agent-improvement modifies agent definitions, check:
- `.opencode/agents/<agent>.md` (OpenCode)
- `.claude/agents/<agent>.md` (Claude Code)
- `.codex/agents/<agent>.toml` (Codex)
- `.gemini/agents/<agent>.md` (Gemini)

Are these 4 mirrors KEPT IN SYNC by deep-agent-improvement? If improvements only land in one runtime, the others drift.

**Step 3: Last-pass test**

Try to find ONE substantive new finding (not in DAI-001..020). If found: convergence weakens. If 0 new findings: convergence holds.

## OUTPUT

`.opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/037-deep-agent-improvement-research-recent-updates/research/iterations/iteration-008.md` + `.../deltas/iter-008.jsonl`.

REMINDER: write outputs UNDER 123 packet path (NOT 010-sidecar-investigation).

After both:
`ITER-8 DONE: <P0>/<P1>/<P2>, dimensions=final-adversarial, new=<N>`
