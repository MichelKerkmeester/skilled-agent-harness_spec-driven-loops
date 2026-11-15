# Agent Docs Alignment Across the Repository

> Merged synthesis of two fan-out lineages, `vibe-a` (three iterations) and `vibe-b` (two iterations), both Mistral Vibe 3.1.2 on `deepseek-flash` (DeepSeek V4.1 Flash, thinking max). Lineage files: `lineages/<label>/iterations/`. Where the lineages disagreed, or where a claim carries the report, the merge owner re-read the cited lines. Those rulings are marked **[merge-verified]**. Claims taken from one lineage without a re-read are marked **[lineage]**.

---

## 1. Executive Summary

The eleven agent definitions and their generated blocks are in good shape. The docs that describe the agents around them have drifted in four ways:

1. **Runtime lists stop at five or six trees.** The Mistral Vibe (`.vibe/agents/`) and DeepSeek Harness (`.dsh/agents/`) trees ship all eleven agents, yet the root README, the mirror crosswalk, `CROSS-CLI.md`, the agents README, the doctor roster check and both deep-loop skills leave them out.
2. **Counts and mechanisms inside the sync docs are wrong.** The crosswalk counts ten subagents where there are nine. `.vibe/SYNC.md` names a `README.md` that does not exist and denies a subagent distinction its own generator writes.
3. **Agent behavior is understated in skill docs.** The deep-review skill drops the `thought` status. The deep-research README lists four of the agent's seven tools. One CLI reference misclassifies three agents.
4. **Some playbook checks cannot fail.** Both deep-loop sandboxes diff `.opencode/agents/` files that the sandbox never creates.

None of these changes runtime behavior. Agents load from the right files. The cost falls on a reader or an operator who trusts a doc or a check that cannot see two runtimes.

---

## 2. Scope and Method

- **In scope:** the root `README.md` and `AGENTS.md`, `.skilled/CROSS-CLI.md`, `.skilled/agents/README.txt`, `.skilled/bin/agent-mirror-crosswalk.md`, the runtime sync docs (`.claude/README.md`, `.dsh/README.md`, `.vibe/SYNC.md`), skill and command docs, feature catalogs, manual testing playbooks and the doctor roster check.
- **Ground truth:** `.skilled/agents/*.md` frontmatter and `agent-registry.json`. There are eleven agents: ten `LEAF` and one `ORCHESTRATOR`. Their `mode:` split is nine `subagent`, one `all` (`markdown`) and one `primary` (`orchestrate`). **[merge-verified]**: `grep '^mode:'` counts 9, 1 and 1.
- **Excluded:** changelogs, `specs/` and archived packets.

---

## 3. Findings: Runtime Lists Omit `.dsh` and `.vibe`

| # | Doc line | What it says | What is true | Status |
|---|---|---|---|---|
| A1 | `README.md:963` | Agents are "mirrored for Claude Code, Codex, Cursor, Devin and Pi" | `.dsh/agents/` (11 `.patch.yml`) and `.vibe/agents/` (11 `.toml`) also ship all eleven | **[merge-verified]** |
| A2 | `.skilled/bin/agent-mirror-crosswalk.md:3`, `:16` | "Six runtime trees ship the same eleven agents" | Eight trees ship them. `.dsh` and `.vibe` are missing from the crosswalk's tree table | **[merge-verified]** |
| A3 | `.skilled/CROSS-CLI.md:57` | `.skilled/agents/` is canonical "for the Claude fork, the Codex TOMLs and the Pi copies" | The same file's generator table names `sync-agents-dsh.cjs` and `sync-agents-vibe.cjs`, which also read `.skilled/agents/` | **[merge-verified]** |
| A4 | `.skilled/agents/README.txt:5-6`, `:8` | The canonical files generate "the .codex and .pi trees". "Sibling runtime: .claude/agents/" | The `.dsh` and `.vibe` trees are generated too, and there are seven sibling trees | **[merge-verified]** |
| A5 | `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:9`, `:57-68` | The roster "is exposed to five runtimes". The surface table lists cursor, devin, opencode, codex and pi | The check never reads `.dsh/agents/` or `.vibe/agents/`, so an agent missing there passes | **[merge-verified]** |
| A6 | `.skilled/skills/system-deep-loop/deep-research/SKILL.md:15`, `.../deep-review/SKILL.md:14-16` | "OpenCode/Copilot runtime uses `.opencode/agents/*.md`; Claude runtime uses `.claude/agents/*.md`" | Six more trees exist, and no Copilot tree exists in the repo | **[merge-verified]** |

`AGENTS.md:282` already names all eight agent directories, so the root instruction file and the root README disagree with each other.

---

## 4. Findings: Wrong Counts and Mechanisms in the Sync Docs

| # | Doc line | What it says | What is true | Status |
|---|---|---|---|---|
| B1 | `.skilled/bin/agent-mirror-crosswalk.md:121` | `mode: subagent` "for ten agents", plus `all` and `primary` | Nine `subagent`. The sentence sums to twelve agents | **[merge-verified]** |
| B2 | `.vibe/SYNC.md:37` | One `.toml` per source, "`README.md` excepted" | The skipped file is `README.txt`. No `README.md` exists in `.skilled/agents/` | **[merge-verified]** |
| B3 | `.vibe/SYNC.md:53` (and the column heading at `:39`) | Profiles carry "no primary/subagent distinction", and `mode` does not travel | Nine of the eleven profiles carry `agent_type = "subagent"`, which `:37` itself describes | **[merge-verified]** (`grep` counts 9 files) |
| B4 | `.skilled/bin/check-agent-mirror-sync.cjs:6` | Every agent "is authored once under .opencode/agents/<name>.md" | True only through the `.opencode/agents -> ../.skilled/agents` symlink, which the comment does not name. Every other doc names `.skilled/agents/` | **[merge-verified]**, wording only |
| B5 | `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:11-13` | "OpenCode and Codex keep independently-authored files in their own dialects" | `.opencode/agents` is a symlink to the source, and `.codex/agents/*.toml` is generated from it. Neither is authored independently | **[merge-verified]** |
| B6 | `.claude/agents/deep-research.md:4` | `tools:` includes `WebSearch` | The source permission map grants `webfetch` and has no `websearch` key. Either the Claude fork grants an extra tool or the crosswalk lacks the key | **[merge-verified]** |

---

## 5. Findings: Agent Behavior Described Wrongly

| # | Doc line | What it says | What is true | Status |
|---|---|---|---|---|
| D1 | `.skilled/skills/system-deep-loop/deep-review/SKILL.md:264`, `.../references/protocol/loop-state-and-gates.md` (status enum after `:76`) | Status enum `complete \| timeout \| error \| stuck \| insight` | `.skilled/agents/deep-review.md:236` also allows `thought`. The research sibling lists all six | **[merge-verified]** (SKILL line) |
| D2 | `.skilled/skills/system-deep-loop/deep-research/README.md:28` | The loop runs through the agent's "Read, WebFetch, Grep and Glob tool set" | The agent also has `write`, `edit` and `bash`, and the same README relies on writes at `:88` | **[merge-verified]** |
| D3 | `.skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md:247` | "11 agents via `.skilled/agents/*.md`", counted with the built-ins `general` and `plan` | It leaves out `code` and `design`. It calls `prompt-improver` `/deep:*`-owned, but its dispatchers are `/prompt:improve` and `orchestrate`. It says `ai-council` is "never direct", but `/speckit:ai-council` reaches it directly | **[merge-verified]** |
| D4 | `README.md:1017` | Deep Review is "read-only on code" | The agent may write and edit, and a rule forbids code changes. Read as "changes no code" it holds. Read as a tool claim it does not | **[lineage]**, wording |

---

## 6. Findings: Playbooks and Stale Citations

| # | Doc line | Problem | Status |
|---|---|---|---|
| E1 | `deep-research/manual-testing-playbook/command-flow-stress-tests/setup-cp-sandbox.sh:104-105` and the diffs in `exhausted-approach-respect.md:101`, `pause-sentinel-halt.md:87`, `spec-fence-writeback.md:84`, `setup-yaml-handoff.md:84`, `iteration-citation-jsonl.md:84` | The sandbox copies only `.skilled/agents/` and `.claude/agents/` files and never creates `.opencode/`, so each `.opencode/agents/deep-research.md` drift check compares two missing files and always passes | **[merge-verified]** (setup script has no `opencode` line) |
| E2 | The same defect in `deep-review/.../setup-cp-sandbox.sh:104-105`, read by `leaf-only-nested-dispatch-refusal.md:63` and `final-synthesis-memory-save-and-guardrail-behavior.md:78` | As E1 | **[lineage]** |
| E3 | `deep-research/.../exhausted-approach-respect.md:123` | Cites `deep-research.md:399-428` for the always and never rules. They start at `:424` (`## 6. RULES`), with NEVER at `:439` | **[merge-verified]** |
| E4 | `deep-research/.../spec-fence-writeback.md:106` | Cites `deep-research.md:51-55` for the no-repair rule, which sits at `:39` | **[lineage]** |
| E5 | `system-spec-kit/manual-testing-playbook/tooling-and-scripts/template-compliance-contract-enforcement-blocks-non-compliant.md:184` | Tells the operator to inspect `.skilled/agents/speckit.toml`. No such agent or file exists, as the same file's evidence at `:64-68` records | **[merge-verified]** |

---

## 7. Found During the Run (Outside the Topic)

These came from running the research, not from the docs under study. They are recorded because they change how the next Vibe run must be set up.

- **V1. Mistral bills two separate pools.** `GET /v1/billing/budget` returns a `vibe_budget` (€255, 0% used) and an `api_budget` (€25.50, 100% used). A Vibe dispatch with `MISTRAL_API_KEY` in its environment billed the API pool and failed with `402 API budget exhausted`. After a browser sign-in (`vibe --setup`), the keychain held a second key. A dispatch with `MISTRAL_API_KEY` removed from its environment used that key and billed the Vibe pool. One probe moved the Vibe budget from 0% to 0.00053% and left the API budget unchanged. This run then used 0.17% of the Vibe budget. It settles part of the UNKNOWN in `.skilled/skills/cli-external-orchestration/cli-mistral-vibe/references/providers-and-models.md` §7. It also contradicts that skill's rule that a dispatch must export `MISTRAL_API_KEY` (`SKILL.md` §3 Provider Preflight), since the key in the environment overrides the keychain sign-in. **[merge-verified]**
- **V2. The runner reads a billing refusal as a crash.** `detectQuotaExhaustion` in `runtime/scripts/lib/cli-guards.cjs:209-216` does not match Mistral's `API budget exhausted` / `billing_api_budget_exhausted` line. It returns `null` for it, so the 402 counted as failure class `exit` instead of `quota`. **[merge-verified]**: called the function on the captured line.

---

## 8. Recommendations

Ranked by how far each one misleads a reader or an operator:

1. **Make the doctor roster check see all eight trees** (A5, B5): add `.dsh` and `.vibe` to its surface table and fix its header comment. It is the only item here that hides drift from a check.
2. **Fix the playbook sandboxes** (E1, E2): create `.opencode -> .skilled` in each sandbox, or diff `.skilled/agents/` instead, so the drift checks can fail.
3. **Bring the runtime lists to eight trees** (A1 to A4, A6) and the crosswalk counts (B1). Of these, `README.md:963` and the crosswalk are what readers open first.
4. **Correct `.vibe/SYNC.md`** (B2, B3) and the deep-review status enum (D1).
5. **Rewrite `claude-tools.md:247`** (D3) from the registry, and fix the tool list in the deep-research README (D2).
6. **Settle the `WebSearch` grant** (B6): add a `websearch` key to the source and crosswalk, or drop the tool from the Claude fork.
7. **Update the cli-mistral-vibe skill for billing** (V1), and add the Mistral budget phrasing to the quota patterns (V2).

---

## Eliminated Alternatives

- **`.opencode/agents/` is a copied folder, so `README.md:963`'s "links to" is wrong** (`vibe-a`, iteration 1, finding 2). Refuted. `ls -ld .opencode/agents` prints `.opencode/agents -> ../.skilled/agents`. `vibe-b` had this right. **[merge-verified]**
- **The crosswalk omits a separate `.opencode` tree** (`vibe-a`, iteration 1, finding 3, in part). Refuted for `.opencode`, because it is the source through the symlink. The `.dsh` and `.vibe` part stands as A2.
- **The doctor check labels `.skilled/agents` as `opencode` and never reads the real OpenCode tree** (`vibe-a`, iteration 3, finding 3). Refuted: the two paths are the same directory.
- **`.skilled/agents/README.txt:9`'s inventory rule is broken by `Explore.md`** (`vibe-b`, iteration 2, finding 5). Not a defect: `Explore.md` is documented as Claude-only in the crosswalk, `CROSS-CLI.md:55` and the doctor check.
- **`ai-council`'s `task: allow` contradicts its `LEAF` tier.** The agent's own Depth 0 and Depth 1 contract explains it. Both lineages ruled it out.
- **The model pins, temperature split and `task` grants in the crosswalk.** `vibe-b` checked each against the trees, and all hold.

---

## Divergence Map

- **Saturated:** runtime lists (eight surfaces found), the sync docs, the deep-loop skill and playbook surface.
- **Lineage disagreement:** one, the `.opencode/agents` symlink. It was settled by a re-read in favor of `vibe-b`.
- **Pivots, Council artifacts, overrides:** none. The run used `stopPolicy: max-iterations` and default convergence mode.
- **Remaining frontier:** skill docs outside `system-deep-loop`, `cli-external-orchestration` and `system-spec-kit` were not swept line by line. Neither were the `.claude/README.md` and `.dsh/README.md` bodies beyond their tree claims.

---

## 9. Open Questions

1. Which tree is canonical for the doctor roster check? It uses `.claude/agents` (`agent-roster-mirror-check.cjs:45`), which suits the Cursor and Devin symlinks, while the other surfaces name `.skilled/agents`. This is a design call for the owner of the check, not a doc fix.
2. Should `markdown` keep `mode: all` while the registry and its own body call it a `LEAF`? This tension is inside the agent file, so it is out of scope here.

---

## 10. Threats to Validity

- Both lineages ran the same model through the same CLI, so they share blind spots. Their one disagreement shows they can still err in different ways.
- Three claims are marked **[lineage]** and were not re-read: D4, E2 and E4.
- Line numbers are from origin/main `bcd15801196` and will move.

---

## 11. References

- Lineage iterations: `lineages/vibe-a/iterations/iteration-001.md` to `-003.md`, `lineages/vibe-b/iterations/iteration-001.md` and `-002.md`
- Merged registry: `findings-registry.json`. Attribution: `fanout-attribution.md`. Resource map: `resource-map.md`
- Failed first attempt (API budget 402): `../research_archive/20261115T145700Z-api-budget-402/`

---

## 12. Convergence Report

- Stop reason: maxIterationsReached (`stopPolicy: max-iterations`, lineage caps 3 and 2)
- Total iterations: 5 (`vibe-a` 3, `vibe-b` 2), each lineage exit 0
- New information ratio by iteration: `vibe-a` 0.94, 0.86, 0.88. `vibe-b` values are in its iteration files
- Merged key findings: 36 in the registry, consolidated here into 21 rows plus 2 run findings
- Convergence threshold: 0.05 (telemetry only under max-iterations)
- Divergence summary: no divergent pivots recorded
