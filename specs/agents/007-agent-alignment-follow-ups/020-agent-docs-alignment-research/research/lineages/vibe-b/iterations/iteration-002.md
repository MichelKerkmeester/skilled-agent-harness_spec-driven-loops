# Iteration 2: Role, tool surface, status vocabulary and the Vibe sync contract

## Focus

Iteration 1 settled the roster, the runtime-tree inventory and the sync-mechanism claims, and deferred four dimensions: **role**, **tools**, **status values** and **routing**. This iteration takes those four, plus the per-runtime `SYNC.md` files that iteration 1 deferred. The angle is deliberately different from iteration 1: instead of comparing doc claims against directory listings, it compares doc claims against the agent frontmatter blocks and against the sibling skill docs that restate the same vocabulary.

## Actions Taken

1. Read `.vibe/SYNC.md` sections 3-4 (the agent-profile contract and its per-profile table) and cross-checked every row against the generated `.vibe/agents/*.toml` files.
2. Compared the iteration status enum in `.skilled/skills/system-deep-loop/deep-review/SKILL.md` against `.skilled/agents/deep-review.md` and against the deep-research sibling.
3. Read the README's eleven per-agent role paragraphs (`README.md:969`-`1017`) and diffed each role claim against the agent's `permission:` block.
4. Read `.skilled/agents/orchestrate.md`'s three generated roster blocks and confirmed they match `agent-registry.json` row for row.
5. Checked the routing claims that name a single dispatcher (`Only @orchestrate dispatches it`, `never auto-dispatched`) against the registry's `dispatchers` arrays.
6. Checked `.skilled/agents/README.txt`'s inventory rule against the Claude-only `Explore.md`.

## Findings

1. `.vibe/SYNC.md:37` states "One `.toml` per `.skilled/agents/*.md`, `README.md` excepted, named by the source stem." The exception file is `.skilled/agents/README.txt`, not `README.md`; there is no `README.md` in `.skilled/agents/`. The same wrong filename appears in the generated-block comment convention the roster writer emits. [SOURCE: .vibe/SYNC.md:37] [SOURCE: .skilled/agents/README.txt:1]

2. `.vibe/SYNC.md:39` labels its second column "`mode` (dropped)" and `.vibe/SYNC.md:53` states "the OpenCode `permission` map and the `mode` value do not travel into Vibe." Both contradict `.vibe/SYNC.md:37` in the same section, which says the render "adds `agent_type = \"subagent\"` when the source declares `mode: subagent`", and contradict the generated tree: nine of the eleven `.vibe/agents/*.toml` files carry `agent_type = "subagent"`. `mode` does travel, as `agent_type`; only the `all` and `primary` values are dropped. [SOURCE: .vibe/SYNC.md:39] [SOURCE: .vibe/SYNC.md:53] [SOURCE: .vibe/SYNC.md:37] [SOURCE: .vibe/agents/context.toml:3]

3. `.skilled/skills/system-deep-loop/deep-review/SKILL.md:264` gives the iteration status enum as `complete | timeout | error | stuck | insight` — five values. `.skilled/agents/deep-review.md:236` allows six, `complete | timeout | error | stuck | insight | thought`, and the deep-research sibling at `.skilled/skills/system-deep-loop/deep-research/SKILL.md:225` lists all six. The deep-review skill doc therefore omits `thought`, the analytical-only status, and its explanatory list at `:266` explains only `insight`. [SOURCE: .skilled/skills/system-deep-loop/deep-review/SKILL.md:264] [SOURCE: .skilled/agents/deep-review.md:236] [SOURCE: .skilled/skills/system-deep-loop/deep-research/SKILL.md:225]

4. `README.md:1017` describes Deep Review as "audits one review pass, read-only on code". `.skilled/agents/deep-review.md:7`-`:9` grants `write: allow`, `edit: allow` and `bash: allow`, so the agent is not read-only by tool surface; only its behavioral rule forbids code changes (`.skilled/skills/system-deep-loop/deep-review/SKILL.md:260`, "The review loop is observation-only. No code changes during audit."). The contrast is sharpest against `review`, which genuinely is read-only (`write: deny`, `edit: deny`) and which `README.md:983` describes as "never edits". [SOURCE: README.md:1017] [SOURCE: .skilled/agents/deep-review.md:7] [SOURCE: .skilled/skills/system-deep-loop/deep-review/SKILL.md:260] [SOURCE: README.md:983]

5. `.skilled/agents/README.txt:9` states "Inventory rule: if an agent file is not present in this directory, it is not a live runtime surface here." `.claude/agents/Explore.md` is a live runtime surface in the sibling tree the next line names, and is not present in `.skilled/agents/`. The rule is defensible only if "here" is read as strictly `.skilled/agents/` (and, through the symlink, `.opencode/agents/`); read as an inventory rule for the roster it is falsified by the file the same README's model paragraph goes on to name. [SOURCE: .skilled/agents/README.txt:9] [SOURCE: .skilled/agents/README.txt:8] [SOURCE: .claude/agents/Explore.md:1]

## Ruled Out

- **`orchestrate.md`'s generated roster blocks as drift.** The routing table at `.skilled/agents/orchestrate.md:77`-`:88`, the tier table at `:98` and the agent-files block at `:171` are all generated from `agent-registry.json` and match it row for row: eleven rows, priorities 1-11, every tier `LEAF` except the orchestrator itself. No drift.
- **`Only @orchestrate dispatches it` (`README.md:977`) for `@code`.** `agent-registry.json` gives `code` exactly one dispatcher, `orchestrate`. The claim holds.
- **`never auto-dispatched` for `@debug`.** Consistent across `agent-registry.json:123`, `.skilled/agents/debug.md:26`, `.skilled/agents/README.txt:24` and `.skilled/skills/system-spec-kit/references/debugging/universal-debugging-methodology.md:29`. The registry's `dispatchers: ["operator"]` matches. No drift.
- **`ai-council` as a LEAF that grants `task: allow`.** Not a contradiction: `.skilled/agents/ai-council.md:44` states "The AI Council is a LEAF by default. It dispatches council seats only when the prompt states that the operator invoked it directly", and `.skilled/bin/agent-mirror-crosswalk.md:2.4` documents `Agent`/`task` as the nested-delegation grant. The registry's `tier: LEAF` and the frontmatter agree on the default.
- **`markdown` as `mode: all` while the registry calls it LEAF.** The crosswalk (`.skilled/bin/agent-mirror-crosswalk.md:121`) and `.vibe/SYNC.md:48` both report `mode: all` correctly. The tension is inside the agent file itself (`.skilled/agents/markdown.md:4` `mode: all` against `:24` "Dedicated LEAF executor"), not between a doc and the agent. Out of scope for a docs-drift finding; recorded for the next focus.
- **`sync-agent-roster.cjs` as a broken reference.** The script exists at `.skilled/bin/sync-agent-roster.cjs` and is documented at `.skilled/bin/README.md:180`. The generated-block comments that name it are accurate.
- **`code`'s "seven dispatch modes" (`README.md:975`).** `.skilled/agents/code.md:261` states "Mode: <one of the 7 dispatch modes>". The count matches.
- **`ai-council`'s `max_rounds` default of 3 (`agent-registry.json:47`).** `.skilled/agents/ai-council.md:389` states "up to `max_rounds` (default 3)". The claim holds.

## Dead Ends

- Grepping for a status enum by its literal pipe-separated form finds only five files, and four of them agree. The vocabulary is restated in prose in most places, so a grep for `status` alone returns hundreds of unrelated hits. The enum is a narrow, high-yield target; the surrounding prose is not.
- The README's per-agent role paragraphs are accurate for nine of the eleven agents. Only the Deep Review paragraph makes a tool-surface claim that the frontmatter contradicts, so this angle is close to exhausted after one pass.

## Edge Cases

- Ambiguous input: "role" and "tools" overlap for an agent whose behavioral rule is narrower than its permission map. Resolved by reporting the `deep-review` case with both sides cited and marking which reading each source supports, rather than picking one.
- Contradictory evidence: `.vibe/SYNC.md` contradicts itself on whether `mode` travels (finding 2). Both lines are cited; the generated tree is the tiebreaker and supports line 37 over lines 39 and 53.
- Missing dependencies: none. Every cited path resolved.
- Partial success: none. All six planned research actions completed.

## Sources Consulted

- `.vibe/SYNC.md:37`, `:39`, `:48`, `:53`
- `.vibe/agents/context.toml:3` and the other eight `.vibe/agents/*.toml` carrying `agent_type`
- `.skilled/skills/system-deep-loop/deep-review/SKILL.md:260`, `:262`, `:264`, `:266`
- `.skilled/skills/system-deep-loop/deep-research/SKILL.md:225`
- `.skilled/agents/deep-review.md:7`, `:8`, `:9`, `:236`
- `.skilled/agents/README.txt:1`, `:8`, `:9`, `:24`
- `.skilled/agents/orchestrate.md:77`, `:88`, `:98`, `:171`
- `.skilled/agents/ai-council.md:44`, `:389`
- `.skilled/agents/markdown.md:4`, `:24`
- `.skilled/agents/code.md:261`
- `.skilled/agents/debug.md:26`
- `.skilled/agents/agent-registry.json:123`
- `.skilled/bin/agent-mirror-crosswalk.md:121`, section 2.4
- `.skilled/bin/README.md:180`
- `.skilled/skills/system-spec-kit/references/debugging/universal-debugging-methodology.md:29`
- `README.md:975`, `:977`, `:983`, `:1017`
- `.claude/agents/Explore.md:1`

## Assessment

- New information ratio: 0.90
- Questions addressed: Q2 (role, tools, permission block), Q3 (status values, routing, model pins), Q5 (runtime copies diverging from source)
- Questions answered: Q2, Q3, Q5

## Reflection

- What worked and why: switching the comparison target from directory listings to frontmatter blocks and sibling skill docs surfaced a class of drift iteration 1 could not see. The status-enum finding exists only because two skill docs for sibling loops were read side by side; neither is wrong on its own, and only the pair plus the agent file makes the omission visible. Reading `.vibe/SYNC.md` as a contract rather than as prose also paid off: its own section 3 contradicts itself within sixteen lines, which is a stronger finding than any cross-file mismatch.
- What did not work and why: the README role-paragraph sweep produced one finding from eleven paragraphs. Nine of the eleven paragraphs describe behavior rather than tool surface, so there is nothing in them for a permission map to contradict. Spending four tool calls on that sweep was a poor trade against the two calls that found the Vibe contradiction.
- What I would do differently: read the per-runtime `SYNC.md` files first. They are the densest source of sync-mechanism claims in the repo, they are short, and each one restates the same contract in a different dialect, which makes internal contradictions cheap to find.

## Recommended Next Focus

The two iterations have answered all five key questions, so the remaining work is verification rather than discovery. Three specific follow-ups remain, in priority order:

1. **Re-run the repo's own gates against these findings.** `node .skilled/bin/sync-agent-roster.cjs --check` and `node .skilled/bin/check-agent-mirror-sync.cjs --all` would confirm or refute findings 1-8 of iteration 1 mechanically. Neither was run here because both are repo-wide tooling and this lineage's write surface is the lineage directory only.
2. **Settle the `markdown` `mode: all` question.** `.skilled/agents/markdown.md:4` declares `mode: all` while `:24` and `:34` call it "LEAF-only". That is an agent-file inconsistency, not a doc drift, so it belongs in a separate finding class.
3. **Sweep `.dsh/SYNC.md` for the same class of internal contradiction found in `.vibe/SYNC.md`.** Only its agent rows were read here; its persona-patch contract was not.
