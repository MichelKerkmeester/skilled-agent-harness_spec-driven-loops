# Iteration 2: Skill and command docs vs each agent's declared role, tools, status values and routing

## Focus

Take the agent-level claims rather than the doc-level ones: the skill and command docs under `.skilled/skills/**` and `.skilled/commands/**` that restate an agent's role, allowed tools, status values or routing, checked against the agent frontmatter and `.skilled/agents/agent-registry.json`. Iteration 1 covered the top-level docs and the runtime sync docs; this pass covers the skill surface.

## Findings

1. `.skilled/skills/system-deep-loop/deep-research/SKILL.md:15` states "Runtime path resolution: OpenCode/Copilot runtime uses `.opencode/agents/*.md`; Claude runtime uses `.claude/agents/*.md`." Two problems: it names only two of the eight runtime agent trees that ship the eleven agents, and "Copilot" has no agent tree anywhere in this repository. The trees it omits are `.codex/agents/`, `.cursor/agents/`, `.devin/agents/`, `.dsh/agents/`, `.pi/agents/` and `.vibe/agents/`. [SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:15] [SOURCE: .codex/agents/] [SOURCE: .vibe/agents/] [SOURCE: .dsh/agents/]

2. `.skilled/skills/system-deep-loop/deep-review/SKILL.md:14-16` repeats the same two-runtime resolution list ("OpenCode/Copilot runtime: `.opencode/agents/*.md`", "Claude runtime: `.claude/agents/*.md`"), so the deep-review skill carries the same omission of six runtime agent trees. [SOURCE: .skilled/skills/system-deep-loop/deep-review/SKILL.md:14] [SOURCE: .pi/agents/] [SOURCE: .cursor/agents/]

3. `.skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md:247` describes the OpenCode column as "11 agents via `.skilled/agents/*.md`, split into 3 classes". The split it then gives names nine project agents — `orchestrate` under primary, `context`, `markdown`, `review`, `debug`, `ai-council` under subagent, and `deep-research`, `deep-review`, `prompt-improver` under command-owned — and pads the count with `general` and `plan`, which are Claude Code built-ins with no file in `.skilled/agents/`. The two project agents missing from the classification are `code` and `design`. [SOURCE: .skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md:247] [SOURCE: .skilled/agents/agent-registry.json:1] [SOURCE: .skilled/agents/code.md:1] [SOURCE: .skilled/agents/design.md:1]

4. The same line classifies `prompt-improver` as "command-owned ... dispatched only by their parent `/deep:*` command". Its registry dispatchers are `/prompt:improve` and `orchestrate`; no `/deep:*` command dispatches it. The two genuinely `/deep:*`-owned agents are `deep-research` and `deep-review`. [SOURCE: .skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md:247] [SOURCE: .skilled/agents/agent-registry.json:1]

5. The same line says `ai-council` is "routed via `--agent orchestrate`, never direct". The registry lists `/speckit:ai-council` and `operator` among its dispatchers, and `.skilled/skills/system-deep-loop/SKILL.md:33` states the council "runs as the standalone `@ai-council` agent, reached through `/speckit:ai-council`". The "never direct" clause contradicts both. [SOURCE: .skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md:247] [SOURCE: .skilled/agents/agent-registry.json:1] [SOURCE: .skilled/skills/system-deep-loop/SKILL.md:33]

6. `.skilled/skills/system-deep-loop/deep-review/SKILL.md:262` and `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-state-and-gates.md:76` both give the deep-review iteration status enum as `complete | timeout | error | stuck | insight` — five values. `.skilled/agents/deep-review.md:236` allows six: `complete | timeout | error | stuck | insight | thought`. The skill surface therefore omits `thought`, the analytical-only status the agent is permitted to record. [SOURCE: .skilled/skills/system-deep-loop/deep-review/SKILL.md:262] [SOURCE: .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-state-and-gates.md:76] [SOURCE: .skilled/agents/deep-review.md:236]

7. `.skilled/skills/system-deep-loop/deep-research/README.md:28` describes the loop as running "through the LEAF agent's Read, WebFetch, Grep and Glob tool set". The agent's permission map also grants `write`, `edit` and `bash`, and the same README relies on the write grant at line 88 ("**Agent:** writes only iteration files and JSONL records"). The tool set is understated by three tools, one of which the doc itself depends on. [SOURCE: .skilled/skills/system-deep-loop/deep-research/README.md:28] [SOURCE: .skilled/skills/system-deep-loop/deep-research/README.md:88] [SOURCE: .skilled/agents/deep-research.md:6]

## Ruled Out

- Treating `ai-council`'s `task: allow` as a LEAF violation: `.skilled/agents/ai-council.md:38-47` defines an explicit Depth 0 / Depth 1 split, where seats are dispatched only when the prompt states operator invocation and Depth 1 refuses nested dispatch. The permission is consistent with the agent's own contract, so the registry's flat `LEAF` tier is a simplification rather than a contradiction.
- Treating `review`'s `bash: allow` as contradicting its "READ-ONLY file access" claim: `.skilled/agents/review.md:110` scopes Bash to `git diff`, `git log` and `gh pr view`, which are read-only commands. Not a finding.
- Treating the deep-research status enum as wrong: `.skilled/skills/system-deep-loop/deep-research/SKILL.md:225` lists all six values and matches `.skilled/agents/deep-research.md`. Only the deep-review sibling is short a value.

## Dead Ends

- `.skilled/commands/deep/research.md` makes no per-agent role, tool or status claim: it is a thin router that explicitly refuses to dispatch (lines 13-14, 24, 31) and defers every agent claim to the workflow YAML. Nothing there to contradict.
- `.skilled/skills/system-deep-loop/SKILL.md`'s mode table (lines 28-31) names only `deep-research` and `deep-review` as agents, which is correct for a two-mode hub; the council is correctly called out as standalone at line 33. Not a finding.
- `.skilled/agents/orchestrate.md`'s three generated blocks (`routing-table` at line 76, `tier-table` at line 98, `agent-files` at line 171) match `agent-registry.json` exactly, including the eleven priorities and the LEAF/ORCHESTRATOR split. The generator is in sync.

## Edge Cases

- Ambiguous input: none this iteration; the skill surface is unambiguous about which agent each claim refers to.
- Contradictory evidence: finding 3 has two readings — either the doc's "11 agents" counts Claude built-ins, or it counts project agents and simply omits two. Both readings are cited; the omission of `code` and `design` holds under either.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- .skilled/skills/system-deep-loop/deep-research/SKILL.md:15, :225
- .skilled/skills/system-deep-loop/deep-research/README.md:28, :88
- .skilled/skills/system-deep-loop/deep-review/SKILL.md:14, :262
- .skilled/skills/system-deep-loop/deep-review/references/protocol/loop-state-and-gates.md:76
- .skilled/skills/system-deep-loop/SKILL.md:28, :33
- .skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md:247
- .skilled/agents/agent-registry.json
- .skilled/agents/ai-council.md:38, .skilled/agents/deep-research.md:6, .skilled/agents/deep-review.md:236, .skilled/agents/review.md:110
- .skilled/agents/orchestrate.md:76, :98, :171
- .skilled/commands/deep/research.md:13, :24, :31
- .codex/agents/, .cursor/agents/, .dsh/agents/, .pi/agents/, .vibe/agents/

## Assessment

- New information ratio: 0.86
- Questions addressed: Q3 (skill and command docs), Q5 (specific misdescribing lines)
- Questions answered: Q3, Q5

## Reflection

- What worked and why: grepping for the numeric and enumerable claims ("11 agents", "Runtime path resolution", "Iteration Status Enum") found the misdescriptions directly, because a doc that restates a count or an enum is checkable by counting rather than by judgement. The status-enum pair and the tool-set line both fell out of one grep each.
- What did not work and why: the first pass assumed the skill docs would restate agent roles in prose. Most do not — they defer to the workflow YAML — so prose-level role hunting returned nothing and the productive surface turned out to be the enumerations instead.
- What I would do next differently: enumerate the checkable claim shapes first (counts, enums, path lists, tool lists) and grep for those, rather than reading skill docs for role prose.

## Recommended Next Focus

Iteration 3 should cover the remaining two surfaces the topic names and this pass did not touch: the feature catalogs and manual testing playbooks under `.skilled/skills/**/feature-catalog/` and `.skilled/skills/**/manual-testing-playbook/`, plus the `.skilled/commands/doctor/` agent-roster check, looking for agent status values, routing, file locations and sync behaviour that no longer match the eleven-agent inventory.
