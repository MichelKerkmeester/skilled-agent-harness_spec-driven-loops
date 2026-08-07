# Iteration 006

**Pool:** native-a + native-b (sonnet) · **Focus:** agents (3 runtimes) + governance; deep-research/review SWE-1.6 sections; descriptions.json=historical

## Findings (14)
- `.opencode/agents/deep-context.md` — Sibling Seats (203) → inline-edit — remove /cli-devin; sync .claude:186 + .codex:193
- `.claude/agents/deep-context.md` — Sibling Seats (186) → inline-edit — mirror
- `.codex/agents/deep-context.toml` — Sibling Seats (193) → inline-edit — mirror
- `.opencode/agents/deep-research.md` — ### SWE-1.6 Iter Contract (cli-devin executor) section (329-344) → delete-section — whole section; .claude/.codex mirrors already clean (lack section)
- `.opencode/agents/deep-review.md` — ### SWE-1.6 Iter Contract (cli-devin executor) section (281-298) → delete-section — whole section; mirrors already clean
- `.opencode/agents/deep-improvement.md` — Lane B executor list 'devin' (44) → inline-edit — remove ', and devin'; sync .claude:29 + .codex:34
- `.claude/agents/deep-improvement.md` — Lane B executor list (29) → inline-edit — mirror
- `.codex/agents/deep-improvement.toml` — Lane B executor list (34) → inline-edit — mirror
- `AGENTS.md` — CLI + small-model dispatch rules (56,57) → inline-edit — remove 'devin /'(56) + 'cli-devin/'(57); CLAUDE.md root is verbatim twin - patch both
- `CLAUDE.md` — CLI + small-model dispatch rules (root twin) (56,57) → inline-edit — verbatim copy of AGENTS.md; NOT a symlink - co-patch
- `.claude/CLAUDE.md` — (none) (0 matches) → none — NO cli-devin - only code-graph routing; no edit
- `README.md` — tagline + skill section + sk-prompt bullet (18,942-944,974) → delete-section+inline — L18 'and Devin CLI'; L942-944 skill section; L974 'cli-devin and'
- `.opencode/skills/README.md` — cli-devin skills-index row (51) → delete-paragraph — delete table row
- `.opencode/specs/descriptions.json` — cli-devin entries (1639-1649,5055+) → none — ALL historical spec rows (z_archive,135/004) - NO active skills-index entry; LEAVE (historical-record)

See `../seats/iter-006/` for the full per-seat finding sets.
