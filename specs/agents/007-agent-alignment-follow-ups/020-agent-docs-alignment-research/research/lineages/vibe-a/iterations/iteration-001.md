# Iteration 1: Top-level docs and runtime sync docs vs the eleven-agent inventory

## Focus

Build the ground-truth agent inventory from `.skilled/agents/*.md` plus `.skilled/agents/agent-registry.json`, then diff the top-level docs (`README.md`, `AGENTS.md`, `.skilled/CROSS-CLI.md`) and the runtime sync docs (`.skilled/bin/agent-mirror-crosswalk.md`, `.claude/README.md`, `.dsh/README.md`, `.vibe/SYNC.md`) against it for role, tier, tools, model-pin and sync-mechanism claims.

Ground truth established first: `.skilled/agents/` holds eleven agent files (`ai-council`, `code`, `context`, `debug`, `deep-research`, `deep-review`, `design`, `markdown`, `orchestrate`, `prompt-improver`, `review`) plus `agent-registry.json` and `README.txt`. The registry lists the same eleven with tiers: ten `LEAF` and one `ORCHESTRATOR` (`orchestrate`). `mode:` values are nine `subagent`, one `all` (`markdown`), one `primary` (`orchestrate`).

## Findings

1. `README.md:963` says the eleven agents are "mirrored for Claude Code, Codex, Cursor, Devin and Pi (`.<runtime>/agents/`)". That list omits two runtime agent trees that ship all eleven agents: `.dsh/agents/` (eleven `<name>.patch.yml` persona patches) and `.vibe/agents/` (eleven `<name>.toml` profiles). Both are documented as generated agent trees by their own runtime docs, so the README's mirror list is stale by two runtimes. [SOURCE: README.md:963] [SOURCE: .dsh/README.md:43] [SOURCE: .vibe/SYNC.md:28]

2. `README.md:963` also says "OpenCode reads `.opencode/agents/`, which links to the same `.skilled/agents/` source." `.opencode/agents/` is a real directory of regular files, not links: every entry is `-rw-r--r--`, and each file is byte-identical to its `.skilled/agents/` twin. The sync mechanism is a copy, not a link, so the sentence misdescribes how OpenCode resolves its agents. [SOURCE: README.md:963] [SOURCE: .opencode/agents/] [SOURCE: .skilled/agents/README.txt:5]

3. `.skilled/bin/agent-mirror-crosswalk.md:17-19` opens with "Six runtime trees ship the same eleven agents" and names only `.skilled/agents/`, `.claude/agents/`, `.cursor/agents/`, `.pi/agents/`, `.codex/agents/` and `.devin/agents/`. Three further trees ship the same eleven agents and are absent from the crosswalk's tree table: `.opencode/agents/`, `.dsh/agents/` and `.vibe/agents/`. The crosswalk is the declared translation contract, so a tree missing from it is an untranslated declaration by its own definition. [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:17] [SOURCE: .dsh/README.md:43] [SOURCE: .vibe/SYNC.md:28] [SOURCE: .opencode/agents/]

4. `.skilled/bin/agent-mirror-crosswalk.md` §2.3 states "`.skilled` declares `mode: subagent` for ten agents, `mode: all` for `markdown` and `mode: primary` for `orchestrate`." The actual split is nine `subagent`, one `all`, one `primary` — eleven total. The count is off by one, and the sentence's own arithmetic (ten plus one plus one) would make twelve agents. [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:2.3] [SOURCE: .skilled/agents/ai-council.md:4] [SOURCE: .skilled/agents/markdown.md:4] [SOURCE: .skilled/agents/orchestrate.md:4]

5. `.skilled/bin/check-agent-mirror-sync.cjs:8-13` documents the source of truth as `.opencode/agents/<name>.md` ("Every agent is authored once under `.opencode/agents/<name>.md`"), and line 30 binds `AGENTS_DIR = path.join(REPO_ROOT, '.opencode', 'agents')`. Four other surfaces name `.skilled/agents/` as the authored source: `.skilled/agents/README.txt:5`, the `agent-registry.json` description ("One record per agent file in this directory"), `agent-mirror-crosswalk.md:17` ("authored source of truth"), and `README.md:963` ("source of truth"). The gate therefore validates against a tree the rest of the repository calls a mirror. [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:8] [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:30] [SOURCE: .skilled/agents/README.txt:5] [SOURCE: .skilled/agents/agent-registry.json:3] [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:17]

6. `.vibe/SYNC.md:37` says "One `.toml` per `.skilled/agents/*.md`, `README.md` excepted". The file it excepts is `.skilled/agents/README.txt`, not `README.md`; no `README.md` exists in that directory. The generator's exclusion rule is described against a filename that is not there. [SOURCE: .vibe/SYNC.md:37] [SOURCE: .skilled/agents/README.txt:1]

7. `.vibe/SYNC.md:53` concludes "A generated profile therefore carries no tool restriction and no primary/subagent distinction". Nine of the eleven generated profiles carry `agent_type = "subagent"`, which is precisely the primary/subagent distinction, and the same section's table lists a `mode` value per profile. The sentence contradicts both the generator output and its own table. [SOURCE: .vibe/SYNC.md:53] [SOURCE: .vibe/agents/context.toml] [SOURCE: .vibe/agents/orchestrate.toml]

8. `.claude/agents/deep-research.md:4` declares `tools: Read, Write, Edit, Bash, Grep, Glob, WebFetch, WebSearch`. `WebSearch` has no counterpart key in `.skilled/agents/deep-research.md`'s permission map, whose vocabulary the crosswalk fixes at `read`, `write`, `edit`, `bash`, `grep`, `glob`, `webfetch`, `chrome_devtools`, `browser`, `task`, `list`, `patch` and `external_directory`. Either the crosswalk omits a `websearch` source key or the Claude mirror grants a tool the source does not. [SOURCE: .claude/agents/deep-research.md:4] [SOURCE: .skilled/agents/deep-research.md:6] [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:2.1]

## Ruled Out

- Counting the CLI bridges as an agent-inventory error: `README.md:69`'s "Eight CLI bridges" resolves correctly against `.skilled/skills/cli-external-orchestration/mode-registry.json`, which declares exactly eight `workflow` modes (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`, `cli-deepseek-harness`, `cli-mistral-vibe`). Not a finding.
- Treating `.claude/agents/Explore.md` as an undocumented twelfth agent: `.claude/README.md:41` documents it ("plus `Explore.md`, which only Claude has") and `check-agent-mirror-sync.cjs:40` carries it in `CLAUDE_ONLY_AGENTS`. Not a finding.
- Treating `.skilled/agents/README.txt`'s model-pin claim as wrong: the claim that the Claude tree pins `context`, `markdown` and `Explore` to haiku and `prompt-improver` to sonnet matches `.claude/agents/*.md` exactly. Not a finding.

## Dead Ends

- `AGENTS.md` carries no per-agent inventory: its only agent section is §9 "AGENT ROUTING" at line 280, which names runtime directories generically and makes no role, tool or count claim. There is nothing there to contradict, so `AGENTS.md` is not a productive target for this topic.
- `.skilled/CROSS-CLI.md` is the only `CROSS-CLI.md` in the repository (there is none at the root). It is a cross-CLI dispatch doc, not an agent-inventory doc; its agent references are dispatch examples rather than role or tool claims.

## Edge Cases

- Ambiguous input: the topic names `CROSS-CLI.md` without a path. Only `.skilled/CROSS-CLI.md` exists, so that is the interpretation used; the root-level reading is deferred and recorded here.
- Contradictory evidence: finding 5 is a genuine two-sided conflict — the gate script and four other surfaces disagree about which tree is canonical. Both sides are cited; the majority and the registry description favour `.skilled/agents/`, but the gate's behaviour is not resolved by counting, so the question stays open.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- README.md:24, README.md:69, README.md:963
- AGENTS.md:280
- .skilled/agents/README.txt
- .skilled/agents/agent-registry.json
- .skilled/agents/ai-council.md, code.md, context.md, debug.md, deep-research.md, deep-review.md, design.md, markdown.md, orchestrate.md, prompt-improver.md, review.md (frontmatter)
- .skilled/bin/agent-mirror-crosswalk.md
- .skilled/bin/check-agent-mirror-sync.cjs
- .claude/README.md, .claude/agents/*.md
- .dsh/README.md, .dsh/agents/
- .vibe/SYNC.md, .vibe/agents/*.toml
- .opencode/agents/
- .skilled/skills/cli-external-orchestration/mode-registry.json

## Assessment

- New information ratio: 0.94
- Questions addressed: Q1 (top-level docs vs inventory), Q2 (sync docs and generators vs actual mechanism), Q5 (specific misdescribing lines)
- Questions answered: Q1, Q2

## Reflection

- What worked and why: starting from the machine-readable registry and the frontmatter rather than from the prose gave a cheap, exact ground truth, so every prose claim could be checked by counting rather than by reading. The `mode:` count and the runtime-tree listing both fell out of one `grep` and one `ls`.
- What did not work and why: `AGENTS.md` and `.skilled/CROSS-CLI.md` were probed first on the assumption that a repo-level instruction file would carry an agent roster. Neither does, which cost two calls before the README's §10 Agent Library turned out to be the real inventory surface.
- What I would do next differently: go straight to the section that calls itself an agent library, then work outward to the sync docs, instead of starting from the instruction files.

## Recommended Next Focus

Iteration 2 should take the agent-level claims rather than the doc-level ones: the registry's `tier` and `dispatchers` fields against each agent body's own LEAF/orchestrator statements, the `ai-council` LEAF-versus-`task: allow` conflict, and the skill and command docs under `.skilled/skills/**` and `.skilled/commands/**` that restate an agent's role, allowed tools or status values.
