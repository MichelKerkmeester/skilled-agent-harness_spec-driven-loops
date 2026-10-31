# Trim plan and per-item dispositions

## Rules applied

Source: `.skilled/skills/sk-doc/sk-create-frontmatter/assets/frontmatter-templates.md`, section "Description Budget & Trim Style".

- DROP: product enumerations, stack lists, marketing prose, parenthetical jargon.
- KEEP (the per-item floor): the name token where the description carried it, the primary verb, the primary domain noun, mode suffixes, numeric specifics.
- Per-item stop rule: stop at or under the soft target (130 for skills and agents, 110 for commands) with every KEEP token still present.
- Routing rule: a trim is kept only if the advisor's top recommendation for the item's representative prompt is unchanged (`advisor-before.json` against `advisor-after.json`).

## Build-time scope narrowing

The build orchestrator's brief narrowed this build to the OVER-SOFT items: trim each to its per-item target, do not change the ceiling, the per-item targets or any rule constant, and hand the ceiling decision to the operator. The stage-2 fleet pass (cutting items already at or under target toward the 5,600 aggregate) is therefore not run; it waits on the operator's ceiling decision.

## Stage 1 dispositions (the seven OVER-SOFT items)

| Item | Before | After | Dropped | Kept | Routing |
|------|-------:|------:|---------|------|---------|
| `sk-code` | 405 | 127 | four packet-name enumerations, the em-dash clause, `over shared surface-detection`, `holds no per-mode logic`, the dispatch tail | `sk-code` name token, quality/review workflow modes, read-only surface packets, implement/debug/verify doctrine, stack knowledge | unchanged (sk-code top on both prompts) |
| `design` agent | 267 | 127 | the three child skill names and the `decides ... via` mechanics | `four` (numeric), `sk-design` modes, values and behavior, Style Reference, charts and diagrams, `LEAF` | unchanged (sk-design top) |
| `cli-classifier` | 155 | 126 | `Holds no packet-local logic.` | classifier judgment, cli-jev, hosted Jev, cli-deem, local Deem, transport, mode-registry.json | unchanged (cli-classifier top) |
| `cli-external-orchestration` | 149 | 124 | `Holds no per-mode logic` | external CLI dispatch, seven workflow modes, mode-registry.json, workflowMode | unchanged |
| `system-spec-kit` | 147 | 130 | `Unified`, `and`; `modifications` shortened to `changes` | spec-folder workflow, context preservation, Levels 1-3+, validation, trigger-index, ripgrep retrieval, required-for-file-changes | unchanged (score 0.868 to 0.860) |
| `sk-doc` | 144 | 128 | `OpenCode-`, `packet` | documentation and component authoring hub, skills, agents, commands, READMEs, catalogs, playbooks, changelogs, goals, frontmatter | unchanged |
| `sk-design` | 135 | 119 | `being asked for` padding | design parent hub, one design identity, owning mode, sk-design-fundamentals | unchanged |

Stage 1 total: 1,402 to 881 characters, 521 recovered. Project total 6,851 to 6,330.

## Stage 2

Not run under this build (see scope narrowing). No item outside the seven was edited.
