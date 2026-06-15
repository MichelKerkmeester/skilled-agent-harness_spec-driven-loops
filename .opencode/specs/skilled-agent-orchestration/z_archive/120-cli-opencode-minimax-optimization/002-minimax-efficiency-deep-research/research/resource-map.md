---
title: "Resource Map — How can we improve/update sk-prompt-small-model and cli-opencode to make best use and maximize the efficiency of MiniMax 2.7 dispatched through cli-opencode via the direct MiniMax.io API provider? Cover: MiniMax-2.7 context-budget defaults, output-verification recipe, prompt-quality/RCAF patterns, --variant/reasoning-effort mapping for the minimax provider, quota-pool + fallback wiring (minimax-api), permissions-matrix applicability, cost/latency profile, and routing heuristics vs deepseek/qwen/glm. Extend the 114 small-model infrastructure rather than rebuilding it. Output concrete file-level deltas for sk-prompt-small-model and cli-opencode."
description: "Auto-generated research resource map from convergence evidence."
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

## Summary

- **Total references**: 17
- **By category**: READMEs=0, Documents=0, Commands=0, Agents=0, Skills=17, Specs=0, Scripts=0, Tests=0, Config=0, Meta=0
- **Missing on disk**: 1
- **Scope**: research convergence output for 002-minimax-efficiency-deep-research
- **Generated**: 2026-05-28T09:42:39.959Z

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` · `MISSING` · `PLANNED`.

## 5. Skills

> `.opencode/skills/**` including `SKILL.md`, `references/`, `assets/`, `feature_catalog/`, `manual_testing_playbook/`, `scripts/`, `shared/`, `mcp_server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| .opencode/skills/cli-devin/assets/per-model-budgets.json | Cited | OK | Citations=3; Iterations=3 |
| .opencode/skills/cli-devin/references/context-budget.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/cli-devin/references/output-verification.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/cli-opencode/assets/permissions-matrix.example-packet-local.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/cli-opencode/assets/permissions-matrix.example-readonly.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/cli-opencode/assets/permissions-matrix.schema.json | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/cli-opencode/assets/prompt_quality_card.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/cli-opencode/manual_testing_playbook/03--multi-provider/004-variant-levels-comparison.md | Cited | OK | Citations=1; Iterations=1 |
| .opencode/skills/cli-opencode/manual_testing_playbook/03--multi-provider/005-minimax-variant-ablation.md | Cited | MISSING | Citations=2; Iterations=2 |
| .opencode/skills/cli-opencode/references/cli_reference.md | Cited | OK | Citations=3; Iterations=3 |
| .opencode/skills/cli-opencode/references/context-budget.md | Cited | OK | Citations=3; Iterations=3 |
| .opencode/skills/cli-opencode/references/permissions-matrix.md | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/cli-opencode/SKILL.md | Cited | OK | Citations=3; Iterations=3 |
| .opencode/skills/sk-prompt-small-model/references/pattern-index.md | Cited | OK | Citations=4; Iterations=4 |
| .opencode/skills/sk-prompt-small-model/SKILL.md | Cited | OK | Citations=2; Iterations=2 |
| .opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md | Cited | OK | Citations=3; Iterations=3 |
| .opencode/skills/sk-prompt/assets/model-profiles.json | Cited | OK | Citations=4; Iterations=4 |

---
