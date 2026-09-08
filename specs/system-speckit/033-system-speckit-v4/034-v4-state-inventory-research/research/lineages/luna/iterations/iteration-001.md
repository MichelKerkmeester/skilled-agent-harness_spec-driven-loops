# Iteration 1: Angle 1, ROSTER

## Focus

Enumerate the top-level skill roots, hub and standalone classification, registry modes and routing classes, command families, agents and hook concerns.

## Actions Taken

- Read the lineage state log and strategy before research.
- Read each top-level registry or leaf manifest with tight `rg -n` patterns.
- Enumerated command entrypoints, agent files and hook files without opening excluded directories.

## Findings

## INVENTORY

| Surface | Value | Source |
|---|---|---|
| Top-level skill surface | 13 skill roots plus `README.txt`; 6 parent hubs expose `mode-registry.json`, 7 standalone roots expose `leaf-manifest.json`. | [SOURCE: `.opencode/skills/README.txt:30`] |
| `cli-external-orchestration` | Parent hub. Modes: `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`; all `metadata`. | [SOURCE: `.opencode/skills/cli-external-orchestration/mode-registry.json:19`] [SOURCE: `.opencode/skills/cli-external-orchestration/mode-registry.json:208`] |
| `mcp-tooling` | Parent hub. Modes: `mcp-chrome-devtools`, `mcp-click-up`, `mcp-aside-devtools`, `mcp-figma`, `mcp-refero`, `mcp-mobbin`, `mcp-obsidian`, `mcp-notion`, `mcp-magicpath`; all `metadata`. | [SOURCE: `.opencode/skills/mcp-tooling/mode-registry.json:31`] [SOURCE: `.opencode/skills/mcp-tooling/mode-registry.json:352`] |
| `sk-code` | Parent hub. Modes: `sk-code-quality`, `sk-code-review`, `sk-code-webflow`, `sk-code-opencode`, `sk-code-mobile-cli`, `sk-code-obsidian`; all `metadata`. | [SOURCE: `.opencode/skills/sk-code/mode-registry.json:24`] [SOURCE: `.opencode/skills/sk-code/mode-registry.json:129`] |
| `sk-design` | Parent hub. Modes: `sk-design-fundamentals`, `sk-design-md-generator`, `sk-design-diagram`, `sk-design-chart`; all `metadata`. | [SOURCE: `.opencode/skills/sk-design/mode-registry.json:13`] [SOURCE: `.opencode/skills/sk-design/mode-registry.json:203`] |
| `sk-doc` | Parent hub. Fourteen modes, from `sk-create-skill` through `sk-create-with-human-voice`, including `sk-create-frontmatter`; all `metadata`. | [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:19`] [SOURCE: `.opencode/skills/sk-doc/mode-registry.json:531`] |
| `system-deep-loop` | Parent hub. Modes: `research`, `review`, `ai-council` are `lexical`; `agent-improvement` is `alias-fold`; `model-benchmark` and `skill-benchmark` are `command-bridge`. | [SOURCE: `.opencode/skills/system-deep-loop/mode-registry.json:32`] [SOURCE: `.opencode/skills/system-deep-loop/mode-registry.json:172`] |
| Standalone roots | `mcp-code-mode`, `sk-communication`, `sk-git`, `sk-prompt`, `sk-vision`, `system-skill-advisor`, `system-spec-kit`; each has a single leaf-manifest mode. | [SOURCE: `.opencode/skills/mcp-code-mode/leaf-manifest.json:41`] [SOURCE: `.opencode/skills/system-spec-kit/leaf-manifest.json:52`] |
| Commands | 37 primary command entrypoints: root 1; `create/` 12; `deep/` 6; `design/` 3; `doctor/` 3; `goal` 1; `prompt/` 1; `rewrite/` 3; `speckit/` 6; `vision` 1. Support Markdown under command assets, scripts and fixtures brings all `.md` files under `.opencode/commands` to 48. | [SOURCE: `.opencode/commands/create/skill.md:2`] [SOURCE: `.opencode/commands/deep/research.md:2`] [SOURCE: `.opencode/commands/design/diagram.md:2`] [SOURCE: `.opencode/commands/speckit/plan.md:2`] |
| Command families | Current primary families are `create:*`, `deep:*`, `design:*`, `doctor:*`, `goal-opencode`, `prompt:*`, `rewrite:*`, `speckit:*`, `vision`, plus `agent-router`. | [SOURCE: `.opencode/commands/create/skill-parent.md:2`] [SOURCE: `.opencode/commands/deep/review.md:2`] [SOURCE: `.opencode/commands/design/chart.md:2`] [SOURCE: `.opencode/commands/speckit/search.md:2`] |
| Agents | 12 files: `ai-council`, `code`, `context`, `debug`, `deep-improvement`, `deep-research`, `deep-review`, `design`, `markdown`, `orchestrate`, `prompt-improver`, `review`. | [SOURCE: `.opencode/agents/deep-research.md:3`] [SOURCE: `.opencode/agents/orchestrate.md:3`] |
| Hook roster | 72 hook files across centralized concerns including `completion`, `dispatch`, `goal`, `mcp-route-guard`, `post-edit-quality`, `task-dispatch`, git guards and shared adapters. The README lists the active kill-switch roster and marks the concerns wired. | [SOURCE: `.opencode/hooks/README.md:22`] [SOURCE: `.opencode/hooks/README.md:42`] [SOURCE: `.opencode/hooks/README.md:46`] |

## DRIFT

| Draft line | Claim | Verdict | Actual state | Severity | One-line correction | Source |
|---|---|---|---|---|---|---|
| Not opened in this angle; draft walk is reserved for iteration 10 | The draft’s roster counts and command-family claims | MISSING | The live roster is recorded here, but no draft line was opened during the roster pass. | P1 | Reproduce every roster claim against the live registries and command frontmatter in iteration 10. | [SOURCE: `.opencode/skills/README.txt:30`] |

## DISAGREEMENTS

README-versus-registry contradiction: `.opencode/skills/README.txt` says 11 top-level identities and lists `sk-design-md-generator`, while the directory contains 13 top-level `SKILL.md` roots and `sk-design` is a hub with four registry modes. The README also describes 11 skills while its catalog already names more than 11 entries.

## CONFIDENCE

Confirmed: all registry and manifest lines cited above were opened, and the command, agent and hook counts were observed from explicit `rg --files` inventories. Inferred: the 37-versus-48 command distinction treats support Markdown as non-command documentation, pending reproduction against command routing logic.

## Questions Answered

- The roster question is answered at inventory level. Exact command-to-family mapping and draft comparison remain open.

## Questions Remaining

- Validate whether any registry mode is not reachable through the hub’s second routing stage.
- Walk the draft’s own roster claims and classify them.

## Next Focus

SYSTEM-SPEC-KIT: inspect the runtime CLI surface, rules, templates, addons, retrieval index and `/speckit:*` commands.

## Reflection

The direct registry pass exposed a stale skills README immediately. The excluded changelog was not opened, so no draft conclusion is claimed here. Nested executor dispatch remains ruled out.
