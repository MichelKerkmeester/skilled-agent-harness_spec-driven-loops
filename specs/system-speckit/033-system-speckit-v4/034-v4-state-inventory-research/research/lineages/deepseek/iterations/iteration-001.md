# Iteration 1: Angle 1 — ROSTER

## Focus
Enumerate the full shipped roster on `skilled/v4.0.0.0`: every skill root (hub vs standalone), every mode from `mode-registry.json` with workflowMode and routingClass, every command family, every agent, and the hook roster, with counts and registry-line citations.

## INVENTORY

| Surface | Value | SOURCE |
|---|---|---|
| Skill roots under `.opencode/skills/` | 14 entries: README.txt + 13 skill dirs (6 hubs, 7 standalone) | .opencode/skills/ (ls) |
| Parent hubs (mode-registry.json + hub-router.json + description.json present) | 6: cli-external-orchestration, mcp-tooling, sk-code, sk-design, sk-doc, system-deep-loop | hub-router/description presence scan |
| Standalone skills (no mode-registry.json) | 7: mcp-code-mode, sk-communication, sk-git, sk-prompt, sk-vision, system-skill-advisor, system-spec-kit | same scan |
| cli-external-orchestration modes | 6, all routingClass metadata: cli-opencode, cli-claude-code, cli-codex, cli-cursor, cli-devin, cli-pi | mode-registry.json:19-208 |
| mcp-tooling modes | 9, all metadata: mcp-chrome-devtools, mcp-click-up, mcp-aside-devtools, mcp-figma, mcp-refero, mcp-mobbin, mcp-obsidian, mcp-notion, mcp-magicpath | mode-registry.json:31-384 |
| sk-code modes | 6, all metadata: sk-code-quality, sk-code-review, sk-code-webflow, sk-code-opencode, sk-code-mobile-cli, sk-code-obsidian | mode-registry.json:24-129 |
| sk-design modes | 4, all metadata: sk-design-fundamentals, sk-design-md-generator, sk-design-diagram, sk-design-chart | mode-registry.json:13-203 |
| sk-doc modes | 13, all metadata: sk-create-skill, sk-create-skill-parent, sk-create-readme, sk-create-agent, sk-create-command, sk-create-feature-catalog, sk-create-manual-testing-playbook, sk-create-benchmark, sk-create-changelog, sk-create-diff, sk-create-frontmatter, sk-create-quality-control, sk-create-repo-rule, sk-create-with-human-voice | mode-registry.json:19-567 |
| system-deep-loop modes | 6: research (lexical), review (lexical), ai-council (lexical), agent-improvement (alias-fold), model-benchmark (command-bridge), skill-benchmark (command-bridge) | mode-registry.json:32-172 |
| Command families | 9 families + 3 top-level files: speckit/ (6), deep/ (6), create/ (12), design/ (3), doctor/ (3), prompt/ (1), rewrite/ (3), goal-opencode.md, vision.md, agent-router.md | .opencode/commands/ (ls) |
| Total command files | 37 markdown commands + READMEs/scripts | sum of family ls |
| Agents | 12: ai-council, code, context, debug, deep-improvement, deep-research, deep-review, design, markdown, orchestrate, prompt-improver, review | .opencode/agents/*.md frontmatter |
| Hook concern dirs | 21 hook dirs + shared/ + docs: codex-watchdog, completion, directive-lifecycle, dispatch, dist-freshness, git, git-hooks-check, git-preflight, git-primary-reconcile, git-worktree-guard, goal, hook-install, mcp-route-guard, permission-policy, post-edit-quality, session-cleanup, session-lifecycle, sk-vision, skill-advisor, spec-gate, task-dispatch | .opencode/hooks/ (ls) |

## DRIFT (roster-level, first pass)

| Draft line | Claim | Verdict | Actual state | Severity | Correction | SOURCE |
|---|---|---|---|---|---|---|
| "seven hubs" / "seven families made the move" | Seven parent hubs exist | STALE | Six hubs (cli-external-orchestration, mcp-tooling, sk-code, sk-design, sk-doc, system-deep-loop); sk-prompt is standalone v3.0.0.0 with no mode-registry | P1 | Count is six hubs, not seven | hub-router/description scan |
| "sk-prompt ... running two modes over one shared structure: prompt-improve ... and prompt-models" | sk-prompt is a two-mode hub | STALE | sk-prompt is a standalone single-leaf skill (leaf-manifest: only "sk-prompt"); no prompt-models mode dir, no mode-registry.json | P0 | Draft describes a hub surface that no longer exists; sk-prompt is standalone | .opencode/skills/sk-prompt/ layout; leaf-manifest.json |
| "/prompt is now /prompt-improve" | Command renamed to /prompt-improve | FALSE | Command file is .opencode/commands/prompt/improve.md → /prompt:improve | P1 | The command is /prompt:improve, not /prompt-improve | .opencode/commands/prompt/improve.md |
| "a set of /interface: commands" / "nine-stage contract under /interface:*" | /interface:* family exists | FALSE | No interface/ dir; design commands are .opencode/commands/design/{chart,diagram,extract}.md | P0 | Design commands live under /design:* (chart, diagram, extract) | .opencode/commands/design/ |
| "joined by a new alignment (conformance-audit) mode" | deep-alignment mode exists | FALSE | system-deep-loop registry has research, review, ai-council, agent-improvement, model-benchmark, skill-benchmark; no alignment mode; no alignment command in deep/ | P0 | No alignment mode on the branch today | system-deep-loop/mode-registry.json:32-172; .opencode/commands/deep/ |
| "the deep router agent was renamed deep → deep-loop, then retired" | deep-loop agent exists (or retired) | TRUE (retired) | No deep-loop agent in .opencode/agents/ (12 agents, none named deep or deep-loop) | P2 | Consistent: agent retired | .opencode/agents/ frontmatter scan |
| "the quality packet is sk-create-quality-control (with /doc:quality kept as an alias)" | /doc:quality alias exists | MISSING | sk-create-quality-control mode exists in registry but no quality-control command file under create/ or doc/ | P1 | Mode exists; command alias not found in .opencode/commands | sk-doc/mode-registry.json:453; create/ ls |

## Sources Consulted
- .opencode/skills/ (ls), mode-registry.json files for 6 hubs (rg), hub-router/description presence scan
- .opencode/commands/** (ls), .opencode/agents/*.md frontmatter (head), .opencode/hooks/ (ls)
- CHANGELOG-v4.0.0.0.md (draft lines cited above)

## Assessment
- **newInfoRatio**: 1.0 — first inventory pass; every row is new to this packet.
- **Novelty**: First-pass enumeration; no prior iteration data existed.
- **Confidence**: Confirmed (all rows opened/listed directly). The hook file count (draft "ninety-six symlinks") and total command count need a deeper pass in angle 8 / angle 10.

## Reflection
- Worked: direct `ls` + registry grep gives an exact roster fast; hub-vs-standalone is decided by mode-registry.json presence.
- Failed: nothing failed; counts of symlinked hooks deferred (angle 8).
- Ruled out: reading every mode-registry.json in full (grep sufficed for workflowMode/routingClass).

## Recommended Next Focus
Angle 2: SYSTEM-SPEC-KIT — runtime/cli surface, validation rules count, template set, /speckit:* commands, trigger index, shared package.
