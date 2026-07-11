# Iteration 5: Dead Command-to-Skill and Command-to-Agent References

## Focus

Determine which command-to-skill and command-to-agent references remain dead after excluding the already confirmed design transport routes.

## Actions Taken

1. Inventoried the live `.opencode/skills/**/SKILL.md`, `.opencode/agents/*.md`, and `.claude/agents/*.md` surfaces.
2. Extracted unique `@agent` tokens and explicit skill/agent paths from command Markdown, workflow YAML, presentation text, and compiled contracts.
3. Mechanically checked literal command-owned skill and agent paths against the filesystem, then read each high-signal failure in context.
4. Compared runtime-agent declarations with the current 12-agent Claude/OpenCode inventories and ruled out current nested deep-mode references as dead targets.

## Findings

### Commands

#### P1: Create-agent spec setup targets a nonexistent `speckit.md` agent and nonexistent Level-1 template paths

Both create-agent workflows declare `[runtime_agent_path]/speckit.md` for spec-folder creation, but neither `.opencode/agents/` nor `.claude/agents/` contains `speckit.md`. Their fallback explicitly bypasses template enforcement, and the two templates the same step names at `.opencode/skills/system-spec-kit/templates/level_1/{spec,plan}.md` are also absent; the only checked-in Level-1 examples are below `templates/examples/level_1/`. This leaves the documented spec setup route with neither its declared agent nor its declared template assets. [SOURCE: .opencode/commands/create/assets/create_agent_auto.yaml:299-309] [SOURCE: .opencode/commands/create/assets/create_agent_confirm.yaml:332-342] [SOURCE: .opencode/agents/:directory inventory] [SOURCE: .claude/agents/:directory inventory] [SOURCE: .opencode/skills/system-spec-kit/templates/:directory inventory]

Concrete fix: replace the retired `speckit.md` agent dispatch with the current `system-spec-kit` command/skill-owned spec-folder workflow, point template references to the canonical current templates selected by that workflow, and remove the template-bypassing fallback.

#### P1: Create-agent and create-readme quality gates still resolve the retired `write.md` agent instead of `markdown.md`

Six `agent_availability.agent_file` entries across create-agent and create-readme auto/confirm workflows resolve `[runtime_agent_path]/write.md`, which does not exist in either live agent directory. The activities immediately below those declarations instruct `@markdown`, and both runtime inventories contain `markdown.md`, making this a direct stale-agent rename rather than an intentionally optional runtime. The fields are marked non-blocking, so execution can silently skip the declared specialist even while prose claims sk-doc quality validation is mandatory. [SOURCE: .opencode/commands/create/assets/create_agent_auto.yaml:520-533] [SOURCE: .opencode/commands/create/assets/create_agent_confirm.yaml:592-605] [SOURCE: .opencode/commands/create/assets/create_readme_auto.yaml:600-612] [SOURCE: .opencode/commands/create/assets/create_readme_auto.yaml:1055] [SOURCE: .opencode/commands/create/assets/create_readme_confirm.yaml:584-597] [SOURCE: .opencode/commands/create/assets/create_readme_confirm.yaml:1131]

Concrete fix: change all six `agent_file` values to `[runtime_agent_path]/markdown.md`, then add a command-asset validator that resolves every concrete runtime-agent filename against both checked-in runtime inventories.

#### P2: Deep-review agent resolution advertises a nonexistent third repository runtime

Both deep-review workflows say agent targets must be discovered across `.claude/agents/`, `.opencode/agents/`, and `.agents/`, but this repository has only the first two runtime directories. The dead `.agents/` branch is duplicated in auto and confirm assets and can produce a false missing-mirror expectation during agent reviews. [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:317-326] [SOURCE: .opencode/commands/deep/assets/deep_review_confirm.yaml:294-303]

Concrete fix: remove `.agents/` from both runtime lists or derive the list from the same runtime capability inventory used by the current agent tooling.

### Doctor

No additional doctor finding was classified in this focus-locked iteration; iteration 2 owns doctor route and behavior findings.

### Agents

No new defect was found inside agent bodies. The defects above are command-owned references to absent agent files; iteration 3 owns body-sync and localization findings.

### Cross-Surface

#### P2: Command validation does not enforce referential integrity against current skill and agent inventories

The repeated `speckit.md`, `write.md`, template, and `.agents/` failures survived across paired auto/confirm assets because command contracts validate structure without proving that referenced runtime agents and literal skill assets exist. The same sweep ruled out additional dead references among current nested deep modes (`deep-research`, `deep-review`, `deep-ai-council`, `deep-improvement`) and named leaf agents present in `.opencode/agents/`; the remaining failures cluster around retired topology names rather than the current hub names. [SOURCE: .opencode/commands/create/assets/create_agent_auto.yaml:301-309] [SOURCE: .opencode/commands/create/assets/create_readme_confirm.yaml:587] [SOURCE: .opencode/commands/deep/assets/deep_review_auto.yaml:324] [SOURCE: .opencode/skills/system-deep-loop/:directory inventory] [SOURCE: .opencode/agents/:directory inventory]

Concrete fix: extend command contract validation to extract literal skill assets, runtime-agent filenames, and declared runtime directories; fail when a non-example reference has no live target, and run the check over both auto and confirm variants.

## Questions Answered

- Not all command-to-agent references resolve: `speckit.md` and `write.md` are absent from both checked-in runtime agent directories.
- Not all command-to-skill asset links resolve: create-agent's Level-1 spec and plan template paths are dead under the current system-spec-kit template layout.
- The current named deep-mode targets and checked-in leaf-agent names examined in this sweep resolve; no additional dead standalone skill name was confirmed after excluding the design transport routes.
- Deep-review still carries one dead runtime-directory reference, `.agents/`, in both execution modes.

## Questions Remaining

- Which router-level allowed-tool grants are unused overgrants after route-specific reconciliation?
- Should create-agent call the system-spec-kit command workflow directly, or should a new typed handoff field replace the retired `speckit.md` agent lookup?
- Should runtime directory inventories be generated from runtime capability metadata rather than repeated in command YAML?

## Sources Consulted

- `.opencode/commands/**/*.{md,yaml,txt}`
- `.opencode/skills/**/SKILL.md`
- `.opencode/skills/system-spec-kit/templates/`
- `.opencode/agents/*.md`
- `.claude/agents/*.md`

## Assessment

- `newInfoRatio`: 0.58
- Novelty justification: the iteration added two repeated retired-agent targets, one adjacent dead template pair, and one duplicated dead runtime directory while ruling out broader current deep-mode and leaf-agent reference drift.
- Confidence: high for filesystem existence and cited command fields; medium for runtime impact where `agent_availability` is advisory or non-blocking rather than parsed by a typed dispatcher.

## Reflection

- Worked: inventory extraction plus literal filesystem resolution isolated true dead references from examples, generated artifact paths, and live nested-mode names.
- Failed: the first agent-token grep used unsupported look-around syntax; a simpler exact-token search recovered the inventory without changing files.
- Ruled out: example paths such as `my-skill`, generated benchmark report paths, punctuation-suffixed backup names, live `@general`, and current nested deep-mode names are not dead command-to-skill findings.

## Next Focus

Synthesize iterations 1-5, carrying the unresolved allowed-tool overgrant question into implementation planning rather than another research iteration.
