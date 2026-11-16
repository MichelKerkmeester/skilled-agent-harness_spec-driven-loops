# Iteration 1: Agent roster, runtime-tree inventory and sync-mechanism claims

## Focus

Establish the ground truth for the eleven agents and their runtime copies, then diff every doc line that states an agent count, roster, file location, or sync mechanism against that ground truth. The topic's six drift dimensions (role, tools, status values, routing, file location, model pin, sync mechanism) were narrowed for this first pass to the two that a whole-repo grep can settle with high confidence: **file location** and **sync mechanism**. Role, tools, status values and routing are deferred to iteration 2.

Ground truth read first:

- `.skilled/agents/` holds exactly eleven agent files: `ai-council.md`, `code.md`, `context.md`, `debug.md`, `deep-research.md`, `deep-review.md`, `design.md`, `markdown.md`, `orchestrate.md`, `prompt-improver.md`, `review.md`, plus `agent-registry.json` and `README.txt`.
- `agent-registry.json` records the same eleven, all `tier: LEAF` except `orchestrate` (`tier: ORCHESTRATOR`), plus one `routingExtras` row for `cli-<mode>` at priority 11.
- Eight runtime agent trees exist, each carrying all eleven: `.claude/agents/` (11 `.md` + `Explore.md` + `README.txt`), `.codex/agents/` (11 `.toml`), `.cursor/agents/` (11 `.md` symlinks), `.devin/agents/` (11 `<name>/AGENT.md` symlinks), `.dsh/agents/` (11 `.patch.yml`), `.opencode/agents/` (a symlink to `../.skilled/agents`), `.pi/agents/` (11 `.md`), `.vibe/agents/` (11 `.toml`).

## Actions Taken

1. Read `.skilled/agents/agent-registry.json` and the frontmatter of all eleven `.skilled/agents/*.md` files to fix the roster, tiers, modes, temperatures and permission maps.
2. Listed all eight runtime agent directories and compared their entry counts and file shapes against the roster.
3. Read `.skilled/bin/agent-mirror-crosswalk.md` end to end as the repo's own translation contract, then checked each of its factual claims against the trees it describes.
4. Grepped `README.md`, `AGENTS.md` and `.skilled/CROSS-CLI.md` for agent-count, agent-path and sync-mechanism statements.
5. Read the two roster/sync checkers (`.skilled/bin/check-agent-mirror-sync.cjs`, `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs`) to see which trees the tooling actually covers.
6. Grepped the feature catalogs and manual-testing playbooks for agent-path claims.

## Findings

1. `.skilled/bin/agent-mirror-crosswalk.md:16` states "Six runtime trees ship the same eleven agents: `.skilled/agents/`, `.claude/agents/`, `.cursor/agents/`, `.pi/agents/`, `.codex/agents/` and `.devin/agents/`." Two further trees ship all eleven and are omitted: `.dsh/agents/` (11 `.patch.yml`) and `.vibe/agents/` (11 `.toml`). The same file's frontmatter description repeats the "six runtime agent trees" count. [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:16] [SOURCE: .skilled/CROSS-CLI.md:77] [SOURCE: .skilled/CROSS-CLI.md:78]

2. `.skilled/bin/agent-mirror-crosswalk.md:121` states "`.skilled` declares `mode: subagent` for ten agents, `mode: all` for `markdown` and `mode: primary` for `orchestrate`." The actual split is nine / one / one: `mode: subagent` is declared by `ai-council`, `code`, `context`, `debug`, `deep-research`, `deep-review`, `design`, `prompt-improver` and `review`; `markdown` is `mode: all`; `orchestrate` is `mode: primary`. The sentence overcounts subagents by one and its three-way split sums to twelve against an eleven-agent roster. [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:121] [SOURCE: .skilled/agents/markdown.md:5] [SOURCE: .skilled/agents/orchestrate.md:5]

3. `README.md:963` states the eleven agents are "mirrored for Claude Code, Codex, Cursor, Devin and Pi (`.<runtime>/agents/`)". `.dsh/agents/` and `.vibe/agents/` are omitted, so the README names five of the seven runtime copies. `AGENTS.md:282` names all eight agent directories, including `.dsh/agents/` and `.vibe/agents/`, so the two root docs disagree with each other as well as with the tree. [SOURCE: README.md:963] [SOURCE: AGENTS.md:282]

4. `.skilled/CROSS-CLI.md:57` states "`.skilled/agents/` is canonical for the Claude fork, the Codex TOMLs and the Pi copies, while `.claude/agents/` is canonical for Cursor and Devin." The same file's generator table two sections later attributes `.dsh/agents/` to `sync-agents-dsh.cjs` and `.vibe/agents/` to `sync-agents-vibe.cjs`, both reading `.skilled/agents/`, so the "two upstreams" enumeration is missing two generated trees it documents itself. [SOURCE: .skilled/CROSS-CLI.md:57] [SOURCE: .skilled/CROSS-CLI.md:77] [SOURCE: .skilled/CROSS-CLI.md:78]

5. `.skilled/agents/README.txt:8` states "Sibling runtime: .claude/agents/ (.md)" — one sibling. Seven runtime copies exist (`.claude`, `.codex`, `.cursor`, `.devin`, `.dsh`, `.pi`, `.vibe`), and the same file's next paragraph already refers to "the `.codex` and `.pi` trees", so the sibling line contradicts its own file. [SOURCE: .skilled/agents/README.txt:8] [SOURCE: .skilled/agents/README.txt:5]

6. `.skilled/bin/check-agent-mirror-sync.cjs:6` states "Every agent is authored once under `.opencode/agents/<name>.md`". `.skilled/bin/agent-mirror-crosswalk.md:30` designates `.skilled/agents/` as the "authored source of truth", and `.opencode/agents` is a symlink to `../.skilled/agents`, so `.opencode/agents/<name>.md` is the same file as `.skilled/agents/<name>.md` rather than a separate authoring location. The checker's own `AGENTS_DIR` constant points at `.opencode/agents`, which resolves through the symlink, so the comment names a path that only exists because of the link it does not mention. [SOURCE: .skilled/bin/check-agent-mirror-sync.cjs:6] [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:30]

7. `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:57`-`:68` enumerates the roster surfaces as `cursor`, `devin`, `opencode`, `codex` and `pi`. `.dsh/agents/` and `.vibe/agents/` are absent from both the `LINKED` and `AUTHORED` lists, so the check that `.skilled/bin/agent-mirror-crosswalk.md:58` advertises as failing "when a runtime is missing an agent" cannot see two of the eight runtime trees. [SOURCE: .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:57] [SOURCE: .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:65] [SOURCE: .skilled/bin/agent-mirror-crosswalk.md:58]

8. `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/template-compliance-contract-enforcement-blocks-non-compliant.md:184` tells the operator to "Inspect ... `.skilled/agents/speckit.toml`". No `speckit` agent exists in the eleven-agent roster, and `.skilled/agents/` holds `.md` files, not `.toml`. The same file's evidence block at lines 64-68 already records `MISSING .skilled/agents/speckit.md` and `MISSING .skilled/agents/speckit.toml`, so the follow-up line points at a path the file itself proves absent. [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/template-compliance-contract-enforcement-blocks-non-compliant.md:184] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/template-compliance-contract-enforcement-blocks-non-compliant.md:65]

## Ruled Out

- **`.claude/agents/Explore.md` as an orphaned mirror.** It is documented as deliberate in three places: `.skilled/bin/agent-mirror-crosswalk.md:2.5` ("`Explore.md` is not a roster agent"), `.skilled/CROSS-CLI.md:55` ("a Claude-only agent with no counterpart in `.skilled/agents/`"), and `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:52` (`CLAUDE_ONLY_AGENTS = new Set(['Explore'])`). Not drift.
- **`.opencode/agents/` as a non-symlinked copy.** `ls -la .opencode` shows `agents -> ../.skilled/agents`, so `CROSS-CLI.md:36` ("Symlinked ... `agents`") and `README.md:963` ("links to the same `.skilled/agents/` source") are both correct. The apparent "real files" in a directory listing are the symlink target's files.
- **`.skilled` as "the only tree that carries a permission map"** (`.skilled/bin/agent-mirror-crosswalk.md:68`). `.opencode/agents` resolves to `.skilled/agents`, so no second distinct tree carries a permission map. The claim holds.
- **`.codex` model pin** (`.skilled/bin/agent-mirror-crosswalk.md:2.5`). Verified: all eleven `.codex/agents/*.toml` carry `model = "gpt-6-luna"`, with `model_reasoning_effort = "high"` except `context` (`low`) and `markdown` (`medium`). The claim holds exactly.
- **`.claude` model pins** (same section). Verified: `context.md`, `markdown.md` and `Explore.md` declare `model: haiku`; `prompt-improver.md` declares `model: sonnet`; no other `.claude` agent declares a model. The claim holds.
- **`.pi` model absence** (same section). Verified: no `model:` key in any `.pi/agents/*.md`. The claim holds.
- **`temperature` split** (`.skilled/bin/agent-mirror-crosswalk.md:2.2`). Verified: `0.2` for `debug` and `design`, `0.1` for the other nine. The claim holds.
- **`Agent`/`task` grant** (`.skilled/bin/agent-mirror-crosswalk.md:2.4`). Verified: only `ai-council` and `orchestrate` carry `task: allow`; the other nine carry `task: deny`. The claim holds.
- **`.skilled/agents/README.txt:4` "agent definitions for the OpenCode runtime".** Literally true because `.opencode/agents` is a symlink to this directory. Not reported as drift.

## Dead Ends

- Grepping for a numeric agent count (`eleven agents`, `11 agents`) across the repo returns almost nothing outside the crosswalk and `README.md:963`; the roster is described by enumeration rather than by count, so count-based greps are a weak detector for this topic.
- The feature catalogs contain no agent-roster claims. The only hits are handler-table rows naming `.skilled/agents/review.md`, `.skilled/agents/orchestrate.md` and `.skilled/agents/debug.md`, all of which exist and match their described roles.

## Edge Cases

- Ambiguous input: the topic names "runtime sync docs" without listing them. Resolved to the three files that actually carry sync contracts — `.skilled/bin/agent-mirror-crosswalk.md`, `.skilled/CROSS-CLI.md`'s map section, and `.skilled/agents/README.txt` — plus the two checkers that enforce them. Deferred: per-runtime `SYNC.md` files under `.dsh/` and `.vibe/`.
- Contradictory evidence: `README.md:963` and `AGENTS.md:282` disagree on the runtime-copy list. Both are cited; `AGENTS.md:282` is better supported because it matches the eight directories on disk, and the contradiction is recorded rather than collapsed.
- Missing dependencies: none. Every cited path resolved.
- Partial success: none. All six planned research actions completed.

## Sources Consulted

- `.skilled/agents/agent-registry.json`
- `.skilled/agents/README.txt:4`, `:5`, `:8`
- `.skilled/agents/markdown.md:5`, `.skilled/agents/orchestrate.md:5`
- `.skilled/bin/agent-mirror-crosswalk.md:16`, `:30`, `:58`, `:68`, `:121`, and sections 2.1-2.5
- `.skilled/bin/check-agent-mirror-sync.cjs:6`
- `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:52`, `:57`, `:65`
- `.skilled/CROSS-CLI.md:36`, `:37`, `:55`, `:57`, `:77`, `:78`
- `README.md:963`
- `AGENTS.md:282`
- `.skilled/skills/system-spec-kit/manual-testing-playbook/tooling-and-scripts/template-compliance-contract-enforcement-blocks-non-compliant.md:65`, `:184`
- Directory listings of `.claude/agents/`, `.codex/agents/`, `.cursor/agents/`, `.devin/agents/`, `.dsh/agents/`, `.opencode/agents/`, `.pi/agents/`, `.vibe/agents/`

## Assessment

- New information ratio: 0.94
- Questions addressed: Q1 (agent count, roster and file location), Q4 (sync mechanisms and runtime copy locations)
- Questions answered: Q1, Q4

## Reflection

- What worked and why: reading the repo's own translation contract first turned it into a checklist. Every claim in `.skilled/bin/agent-mirror-crosswalk.md` is falsifiable against a directory listing, so the drift surfaced as a set of concrete line-level contradictions rather than a vague "docs are stale" impression. Verifying the claims that turned out to be *correct* (model pins, temperature split, `task` grants) was as valuable as finding the wrong ones, because it kept the finding list honest and produced the Ruled Out section.
- What did not work and why: the first pass treated `.opencode/agents/` as a non-symlinked copy and nearly reported `CROSS-CLI.md:36` as drift. `ls -la` on the parent directory showed the symlink and the finding was withdrawn. Directory listings of a symlinked directory show the target's files, which is a trap for exactly this topic.
- What I would do differently: check symlink status with `ls -la` on the *parent* directory before comparing any two trees, and grep for the roster by enumeration (agent names) rather than by count.

## Recommended Next Focus

Iteration 2 should cover the four dimensions this pass deferred: **role**, **tools**, **status values** and **routing**. Concretely: (a) diff each agent's `description:` and registry `summary` against the role the docs assign it, starting with `ai-council` (registry says LEAF but its frontmatter grants `task: allow`, which the crosswalk explains as the nested-delegation grant) and `markdown` (`mode: all` while the registry calls it a LEAF dispatched by `/create:*` and `orchestrate`); (b) check the status-value vocabulary (`complete | timeout | error | stuck | insight | thought` for research, `P0/P1/P2` for review) wherever docs restate it; (c) check routing claims — which agent dispatches which — against `agent-registry.json`'s `dispatchers` arrays; (d) sweep the per-runtime `SYNC.md` files under `.dsh/` and `.vibe/` that this pass deferred.
