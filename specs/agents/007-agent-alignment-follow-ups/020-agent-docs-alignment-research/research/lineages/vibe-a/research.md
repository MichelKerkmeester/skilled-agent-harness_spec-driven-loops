---
title: "Agent Documentation Alignment — vibe-a Lineage Synthesis"
description: "Synthesis of three research iterations checking whether the repository's docs describe the eleven agents and their runtime copies correctly."
trigger_phrases:
  - "agent docs alignment"
  - "eleven agents documentation drift"
  - "agent mirror documentation"
importance_tier: important
contextType: research
---

# Agent Documentation Alignment — vibe-a Lineage Synthesis

## 1. Research Metadata

| Field | Value |
|---|---|
| Session ID | `fanout-vibe-a-1794754623609-z9i1mt` |
| Lineage | `vibe-a` (fan-out, `cli-mistral-vibe`, model `deepseek-flash`) |
| Iterations | 3 of 3 |
| Stop reason | `maxIterationsReached` |
| Convergence threshold | 0.05 |
| Findings | 23 |
| Questions answered | 4 of 5 |
| Executor | `cli-mistral-vibe` |

## 2. Executive Summary

The repository's documentation does not describe the eleven agents correctly. Twenty-three distinct doc lines misdescribe an agent's role, tools, status values, routing, file location or sync mechanism, and every one of them is contradicted by a checked-in agent file, registry entry or generator.

The findings cluster into six properties rather than scattering:

1. **Mirror inventory is stale by two to three runtimes.** Docs written when six runtime trees existed still say six, or five, or list five by name. Eight trees ship the eleven agents today.
2. **The source-of-truth path is contested.** Four surfaces say `.skilled/agents/` is authored; two checkers treat `.claude/agents/` or `.opencode/agents/` as canonical.
3. **One status enum is short a value.** The deep-review skill surface omits `thought`, which the agent file allows.
4. **One tool set is understated.** The deep-research README lists four tools where the permission map grants seven.
5. **One routing classification is wrong in three ways.** A single table row in `claude-tools.md` omits two agents, misassigns one dispatcher and denies a direct route that exists.
6. **Playbook drift checks cannot fail.** Both deep-loop playbooks diff a sandbox path their setup script never creates.

The single unresolved question is which tree is canonical. The evidence favours `.skilled/agents/` on four citations against two, but the two dissenters are the checkers that would enforce the answer, so counting does not settle it.

## 3. Research Question & Objectives

Do the READMEs, `AGENTS.md`, `CROSS-CLI.md`, runtime sync docs, skill and command docs, feature catalogs and manual testing playbooks describe the current eleven agents (`.skilled/agents/*.md` and `agent-registry.json`) and their runtime copies (`.claude`, `.codex`, `.cursor`, `.devin`, `.dsh`, `.opencode`, `.pi`, `.vibe` agent folders) correctly? Find each doc line that misdescribes an agent's role, tools, status values, routing, file location, model pin or sync mechanism, and cite both the doc line and the agent or generator file it contradicts. Changelogs, `specs/` and archived packets are excluded.

## 4. Method

Ground truth was taken from the machine-readable surfaces first — `.skilled/agents/agent-registry.json` and the eleven agent frontmatter blocks — so every prose claim could be checked by counting rather than by judgement. Each iteration then took one documentation surface:

- **Iteration 1** — top-level docs (`README.md`, `AGENTS.md`, `.skilled/CROSS-CLI.md`) and runtime sync docs (`agent-mirror-crosswalk.md`, `.claude/README.md`, `.dsh/README.md`, `.vibe/SYNC.md`).
- **Iteration 2** — skill and command docs under `.skilled/skills/**` and `.skilled/commands/**`.
- **Iteration 3** — feature catalogs, manual testing playbooks and the `.skilled/commands/doctor/` roster check.

## 5. The Agent Inventory as Ground Truth

Eleven agents, one orchestrator and ten leaves:

| Agent | `mode` | Registry tier | Dispatchers |
|---|---|---|---|
| `orchestrate` | `primary` | ORCHESTRATOR | operator |
| `context` | `subagent` | LEAF | orchestrate, `/speckit:*`, `/create:*`, operator |
| `deep-research` | `subagent` | LEAF | `/deep:research`, orchestrate |
| `ai-council` | `subagent` | LEAF | `/speckit:ai-council`, orchestrate, operator |
| `markdown` | `all` | LEAF | `/create:*`, orchestrate |
| `review` | `subagent` | LEAF | orchestrate, `/speckit:*` |
| `deep-review` | `subagent` | LEAF | `/deep:review`, orchestrate |
| `code` | `subagent` | LEAF | orchestrate |
| `debug` | `subagent` | LEAF | operator |
| `design` | `subagent` | LEAF | operator, orchestrate |
| `prompt-improver` | `subagent` | LEAF | `/prompt:improve`, orchestrate |

The `mode` split is nine `subagent`, one `all`, one `primary`. Eight runtime trees ship this roster: `.skilled/agents/`, `.claude/agents/`, `.codex/agents/`, `.cursor/agents/`, `.devin/agents/`, `.dsh/agents/`, `.opencode/agents/` and `.vibe/agents/`. `.claude/agents/` additionally carries `Explore.md`, a Claude-only agent documented as such.

## 6. Mirror Inventory Misdescriptions (Q1, Q2)

**`README.md:963`** lists the mirrors as "Claude Code, Codex, Cursor, Devin and Pi", omitting `.dsh/agents/` and `.vibe/agents/`. Both ship all eleven agents and both are documented as generated agent trees by `.dsh/README.md:43` and `.vibe/SYNC.md:28`.

**`README.md:963`** also says `.opencode/agents/` "links to the same `.skilled/agents/` source". It is a real directory of regular files, each byte-identical to its `.skilled/agents/` twin. The mechanism is a copy, not a link.

**`.skilled/bin/agent-mirror-crosswalk.md:17`** opens with "Six runtime trees ship the same eleven agents" and names only `.skilled`, `.claude`, `.cursor`, `.pi`, `.codex` and `.devin`. Three trees are absent from the declared translation contract: `.opencode/agents/`, `.dsh/agents/` and `.vibe/agents/`.

**`.skilled/bin/agent-mirror-crosswalk.md` §2.3** says "`.skilled` declares `mode: subagent` for ten agents". The actual count is nine, and the sentence's own arithmetic (ten plus one plus one) would make twelve agents.

**`.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:9`** says the roster "is exposed to five runtimes". The script checks five surfaces plus the canonical tree, and never inspects `.dsh/agents/` or `.vibe/agents/`.

## 7. Source-of-Truth Misdescriptions (Q2)

Four surfaces name `.skilled/agents/` as the authored source: `README.md:963` ("source of truth"), the `agent-registry.json` description ("One record per agent file in this directory"), `agent-mirror-crosswalk.md:17` ("authored source of truth") and `.skilled/agents/README.txt:5` ("the canonical source the .codex and .pi trees are generated from").

Two checkers disagree:

- **`.skilled/bin/check-agent-mirror-sync.cjs:8,30`** documents and binds `.opencode/agents/` as the authored tree (`AGENTS_DIR = path.join(REPO_ROOT, '.opencode', 'agents')`).
- **`.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:45`** binds `CANONICAL_REL = '.claude/agents'` under the comment "The Claude tree is canonical", and at line 65 labels `.skilled/agents` as the `opencode` surface — so the real `.opencode/agents/` tree is never read by that check at all.

The same file's header (lines 11-13) adds a third misdescription: it says "OpenCode and Codex keep independently-authored files in their own dialects", but `.opencode/agents/*.md` are byte-identical copies of `.skilled/agents/*.md` and `.codex/agents/*.toml` is generated from `.skilled`.

## 8. Status-Value Misdescriptions (Q3)

**`.skilled/skills/system-deep-loop/deep-review/SKILL.md:262`** and **`references/protocol/loop-state-and-gates.md:76`** both give the deep-review iteration status enum as `complete | timeout | error | stuck | insight` — five values. **`.skilled/agents/deep-review.md:236`** allows six, adding `thought`. The skill surface therefore omits the analytical-only status the agent is permitted to record.

The deep-research sibling is correct: `.skilled/skills/system-deep-loop/deep-research/SKILL.md:225` lists all six and matches `.skilled/agents/deep-research.md`.

## 9. Tool-Set Misdescriptions (Q3)

**`.skilled/skills/system-deep-loop/deep-research/README.md:28`** describes the loop as running "through the LEAF agent's Read, WebFetch, Grep and Glob tool set". The permission map also grants `write`, `edit` and `bash`, and the same README depends on the write grant at line 88 ("**Agent:** writes only iteration files and JSONL records").

**`.claude/agents/deep-research.md:4`** declares `tools: ... WebSearch`, which has no counterpart key in the `.skilled` permission map whose vocabulary `agent-mirror-crosswalk.md` §2.1 fixes. Either the crosswalk omits a `websearch` source key or the Claude mirror grants a tool the source does not.

## 10. Routing Misdescriptions (Q3)

**`.skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md:247`** carries three separate errors in one table cell:

- It claims an "11 agents ... split into 3 classes" but names only nine project agents, padding the count with `general` and `plan`, which are Claude Code built-ins with no file in `.skilled/agents/`. The two project agents missing from the classification are `code` and `design`.
- It classifies `prompt-improver` as "command-owned ... dispatched only by their parent `/deep:*` command". Its registry dispatchers are `/prompt:improve` and `orchestrate`; no `/deep:*` command dispatches it.
- It says `ai-council` is "routed via `--agent orchestrate`, never direct". The registry lists `/speckit:ai-council` and `operator`, and `.skilled/skills/system-deep-loop/SKILL.md:33` states the council "runs as the standalone `@ai-council` agent, reached through `/speckit:ai-council`".

**`.skilled/skills/system-deep-loop/deep-research/SKILL.md:15`** and **`.skilled/skills/system-deep-loop/deep-review/SKILL.md:14-16`** both resolve runtime agent paths to two trees only — "OpenCode/Copilot" and "Claude" — omitting six of the eight, and naming a Copilot tree that does not exist in this repository.

## 11. Playbook and Sync-Doc Misdescriptions (Q4)

**`.vibe/SYNC.md:37`** says "One `.toml` per `.skilled/agents/*.md`, `README.md` excepted". The file it excepts is `.skilled/agents/README.txt`; no `README.md` exists there.

**`.vibe/SYNC.md:53`** concludes "A generated profile therefore carries no tool restriction and no primary/subagent distinction". Nine of the eleven generated profiles carry `agent_type = "subagent"`, which is exactly that distinction, and the same section's table lists a `mode` value per profile.

**Both deep-loop playbooks' drift checks cannot fail.** `setup-cp-sandbox.sh:104-105` in each playbook copies only `.skilled/agents/<agent>.md` and `.claude/agents/<agent>.md` into the sandbox, while the stress-test files diff `.opencode/agents/<agent>.md` between baseline and sandbox — `exhausted-approach-respect.md:101`, `pause-sentinel-halt.md:87`, `spec-fence-writeback.md:84`, `setup-yaml-handoff.md:84` and `iteration-citation-jsonl.md:84` for deep-research, and `leaf-only-nested-dispatch-refusal.md:63` for deep-review. The sandbox never creates that path, so each diff compares two absent files and reports no drift regardless of what the run did.

Two stale line citations round out the playbook findings: `exhausted-approach-respect.md:123` cites `.skilled/agents/deep-research.md:399-428` for the always/never rules that live at 424-464, and `spec-fence-writeback.md:106` cites `:51-55` for the no-repair rule that is the `No speculative recovery` invariant at line 39.

## 12. Recommendations

1. **Fix the mirror inventory in one pass.** Update `README.md:963`, `agent-mirror-crosswalk.md:17` and `agent-roster-mirror-check.cjs:9` to name all eight runtime trees, and add `.dsh` and `.vibe` rows to the crosswalk's tree table.
2. **Settle the canonical tree before fixing the checkers.** Decide whether `.skilled/agents/` or `.claude/agents/` is authored, then align `check-agent-mirror-sync.cjs:30` and `agent-roster-mirror-check.cjs:45,65` to that decision. Fixing the checkers first would encode whichever answer they happen to hold.
3. **Correct the deep-review status enum** in `deep-review/SKILL.md:262` and `loop-state-and-gates.md:76` to include `thought`.
4. **Correct the deep-research tool set** in `deep-research/README.md:28` to include `write`, `edit` and `bash`.
5. **Rewrite the `claude-tools.md:247` OpenCode cell** so it names all eleven project agents, assigns `prompt-improver` to `/prompt:improve`, and drops the "never direct" clause for `ai-council`.
6. **Fix the playbook sandboxes** by adding `.opencode/agents/<agent>.md` to both `setup-cp-sandbox.sh` scripts, or by retargeting the diffs at the paths the sandbox actually creates.
7. **Correct the two `.vibe/SYNC.md` lines** — the `README.md`/`README.txt` filename and the "no primary/subagent distinction" claim.

## Eliminated Alternatives

- **Counting the eight CLI bridges as an agent-inventory error.** `README.md:69`'s "Eight CLI bridges" resolves correctly against the eight `workflow` modes in `.skilled/skills/cli-external-orchestration/mode-registry.json`.
- **Treating `.claude/agents/Explore.md` as an undocumented twelfth agent.** `.claude/README.md:41` documents it and `check-agent-mirror-sync.cjs:40` lists it in `CLAUDE_ONLY_AGENTS`.
- **Treating `.skilled/agents/README.txt`'s model-pin claim as wrong.** The claim that the Claude tree pins `context`, `markdown` and `Explore` to haiku and `prompt-improver` to sonnet matches `.claude/agents/*.md` exactly.
- **Treating `ai-council`'s `task: allow` as a LEAF violation.** `.skilled/agents/ai-council.md:38-47` defines a Depth 0 operator-invocation exception and a Depth 1 refusal, so the permission matches the agent's own contract.
- **Treating `review`'s `bash: allow` as contradicting its read-only claim.** `.skilled/agents/review.md:110` scopes Bash to `git diff`, `git log` and `gh pr view`.
- **Treating the feature catalogs as a misdescription surface.** The two catalogs that name an agent describe the LEAF contract, reducer boundary and file locations correctly.
- **Treating the `.cursor`/`.devin` symlink claim as wrong.** `ls -la` confirms both trees are symlinks into `.claude/agents/`.
- **Treating `AGENTS.md` as an inventory surface.** Its only agent section is §9 "AGENT ROUTING" at line 280, which names runtime directories generically and makes no role, tool or count claim.

## Divergence Map

No divergent pivots were taken. The three iterations were assigned distinct documentation surfaces up front rather than pivoting on saturation, so `completedPivots`, `failedPivots` and `pivotOverrides` are all zero. The frontier is fully covered: every surface the topic names was read, and the only remaining work is the canonical-tree decision recorded under Open Questions.

## Open Questions

1. **Which tree is canonical — `.skilled/agents/` or `.claude/agents/`?** Four surfaces say `.skilled/agents/`; `check-agent-mirror-sync.cjs` says `.opencode/agents/` and `agent-roster-mirror-check.cjs` says `.claude/agents/`. The evidence favours `.skilled/agents/` on count and on the registry's own description, but the dissenters are the enforcement points, so the question needs an owner decision rather than more evidence.
2. **Does the `.skilled` permission vocabulary include a `websearch` key?** `.claude/agents/deep-research.md:4` grants `WebSearch` and `agent-mirror-crosswalk.md` §2.1 does not list it. Either the crosswalk is incomplete or the mirror drifted; the answer changes whether this is a doc fix or a mirror fix.

## Risks & Caveats

- The `README.md:963` mirror-list finding and the `agent-mirror-crosswalk.md:17` six-tree finding describe the same underlying staleness on two surfaces. They are reported separately because they need separate edits, but a reader should treat them as one root cause.
- The playbook findings were established by reading the setup script against the diff commands, not by running either. A run would confirm the diffs are vacuous, but the path comparison is already decisive.
- Line numbers are as of this run. The two stale-citation findings in particular will shift if the agent files are edited before the docs are fixed.
- The `agent-roster-mirror-check.cjs` findings describe a read-only diagnostic. Nothing in the repository's commit path depends on it, so the drift it misses is not currently gated.

## Appendix: Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 3
- Questions answered: 4 / 5
- Remaining questions: 1
- Last 3 iteration summaries: run 1: top-level and sync docs (0.94); run 2: skill and command docs (0.86); run 3: feature catalogs, playbooks and doctor check (0.88)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded

## References

- `README.md:24`, `README.md:69`, `README.md:963`
- `AGENTS.md:280`
- `.skilled/agents/README.txt`, `.skilled/agents/agent-registry.json`
- `.skilled/agents/ai-council.md`, `code.md`, `context.md`, `debug.md`, `deep-research.md`, `deep-review.md`, `design.md`, `markdown.md`, `orchestrate.md`, `prompt-improver.md`, `review.md`
- `.skilled/bin/agent-mirror-crosswalk.md`, `.skilled/bin/check-agent-mirror-sync.cjs`
- `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs`, `.skilled/commands/doctor/runtime-mirrors.md`
- `.skilled/skills/system-deep-loop/SKILL.md`, `deep-research/SKILL.md`, `deep-research/README.md`, `deep-review/SKILL.md`
- `.skilled/skills/system-deep-loop/deep-review/references/protocol/loop-state-and-gates.md`
- `.skilled/skills/cli-external-orchestration/cli-claude-code/references/claude-tools.md`
- `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/`
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/command-flow-stress-tests/`
- `.claude/README.md`, `.claude/agents/*.md`, `.dsh/README.md`, `.vibe/SYNC.md`, `.vibe/agents/*.toml`
- `.cursor/agents/`, `.devin/agents/`, `.opencode/agents/`, `.pi/agents/`, `.codex/agents/`
- `resource-map.md` (this packet)
