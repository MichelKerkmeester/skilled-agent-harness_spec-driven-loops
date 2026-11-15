---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Do the READMEs, AGENTS.md, CROSS-CLI.md, runtime sync docs, skill and command docs, feature catalogs and manual testing playbooks across the repo describe the current eleven agents (.skilled/agents/*.md and agent-registry.json) and their runtime copies (.claude, .codex, .cursor, .devin, .dsh, .opencode, .pi, .vibe agent folders) correctly? Find each doc line that misdescribes an agent's role, tools, status values, routing, file location, model pin or sync mechanism, and cite both the doc line and the agent or generator file it contradicts. Exclude changelogs, specs/ and archived packets.
- Started: 2026-11-15T15:58:00Z
- Status: COMPLETE
- Iteration: 2 of 2
- Session ID: fanout-vibe-b-1794754623609-z9i1mt
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Agent roster, runtime-tree inventory and sync-mechanism claims | file-location-and-sync-mechanism | 0.94 | 8 | complete |
| 2 | Role, tool surface, status vocabulary and the Vibe sync contract | role-tools-status-routing | 0.90 | 5 | complete |

- iterationsCompleted: 2
- keyFindings: 13
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Which doc lines in README.md, AGENTS.md, CROSS-CLI.md and the runtime sync docs state an agent count, roster, or agent file location that disagrees with `.skilled/agents/*.md` and `agent-registry.json`?
- [x] Which doc lines misdescribe an individual agent's role, tool allowlist, or permission block relative to that agent's `.skilled/agents/<name>.md` frontmatter?
- [x] Which doc lines state agent status values, routing rules, or model pins that contradict the agent frontmatter, the registry, or the runtime generator?
- [x] Which skill, command, feature-catalog and manual-testing-playbook docs describe agent sync mechanisms or runtime copy locations that no longer match the generator and the checked-in runtime agent folders?
- [x] Which runtime agent copies (.claude, .codex, .cursor, .devin, .dsh, .opencode, .pi, .vibe) diverge from their `.skilled/agents/*.md` source in a way a doc claims is synchronized?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▇▆▆▅▅▅▄▄▄▃▃▂▂▂▁▁
- score sparkline: ██▇▇▇▆▆▅▅▅▄▄▄▃▃▂▂▂▁▁
- Last 3 ratios: 0.94 -> 0.90
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.90
- coverageBySources: {"code":48,"other":3}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **`.claude/agents/Explore.md` as an orphaned mirror.** It is documented as deliberate in three places: `.skilled/bin/agent-mirror-crosswalk.md:2.5` ("`Explore.md` is not a roster agent"), `.skilled/CROSS-CLI.md:55` ("a Claude-only agent with no counterpart in `.skilled/agents/`"), and `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:52` (`CLAUDE_ONLY_AGENTS = new Set(['Explore'])`). Not drift. (iteration 1)
- **`.claude` model pins** (same section). Verified: `context.md`, `markdown.md` and `Explore.md` declare `model: haiku`; `prompt-improver.md` declares `model: sonnet`; no other `.claude` agent declares a model. The claim holds. (iteration 1)
- **`.codex` model pin** (`.skilled/bin/agent-mirror-crosswalk.md:2.5`). Verified: all eleven `.codex/agents/*.toml` carry `model = "gpt-6-luna"`, with `model_reasoning_effort = "high"` except `context` (`low`) and `markdown` (`medium`). The claim holds exactly. (iteration 1)
- **`.opencode/agents/` as a non-symlinked copy.** `ls -la .opencode` shows `agents -> ../.skilled/agents`, so `CROSS-CLI.md:36` ("Symlinked ... `agents`") and `README.md:963` ("links to the same `.skilled/agents/` source") are both correct. The apparent "real files" in a directory listing are the symlink target's files. (iteration 1)
- **`.pi` model absence** (same section). Verified: no `model:` key in any `.pi/agents/*.md`. The claim holds. (iteration 1)
- **`.skilled/agents/README.txt:4` "agent definitions for the OpenCode runtime".** Literally true because `.opencode/agents` is a symlink to this directory. Not reported as drift. (iteration 1)
- **`.skilled` as "the only tree that carries a permission map"** (`.skilled/bin/agent-mirror-crosswalk.md:68`). `.opencode/agents` resolves to `.skilled/agents`, so no second distinct tree carries a permission map. The claim holds. (iteration 1)
- **`Agent`/`task` grant** (`.skilled/bin/agent-mirror-crosswalk.md:2.4`). Verified: only `ai-council` and `orchestrate` carry `task: allow`; the other nine carry `task: deny`. The claim holds. (iteration 1)
- **`temperature` split** (`.skilled/bin/agent-mirror-crosswalk.md:2.2`). Verified: `0.2` for `debug` and `design`, `0.1` for the other nine. The claim holds. (iteration 1)
- Grepping for a numeric agent count (`eleven agents`, `11 agents`) across the repo returns almost nothing outside the crosswalk and `README.md:963`; the roster is described by enumeration rather than by count, so count-based greps are a weak detector for this topic. (iteration 1)
- The feature catalogs contain no agent-roster claims. The only hits are handler-table rows naming `.skilled/agents/review.md`, `.skilled/agents/orchestrate.md` and `.skilled/agents/debug.md`, all of which exist and match their described roles. (iteration 1)
- **`ai-council` as a LEAF that grants `task: allow`.** Not a contradiction: `.skilled/agents/ai-council.md:44` states "The AI Council is a LEAF by default. It dispatches council seats only when the prompt states that the operator invoked it directly", and `.skilled/bin/agent-mirror-crosswalk.md:2.4` documents `Agent`/`task` as the nested-delegation grant. The registry's `tier: LEAF` and the frontmatter agree on the default. (iteration 2)
- **`ai-council`'s `max_rounds` default of 3 (`agent-registry.json:47`).** `.skilled/agents/ai-council.md:389` states "up to `max_rounds` (default 3)". The claim holds. (iteration 2)
- **`code`'s "seven dispatch modes" (`README.md:975`).** `.skilled/agents/code.md:261` states "Mode: <one of the 7 dispatch modes>". The count matches. (iteration 2)
- **`markdown` as `mode: all` while the registry calls it LEAF.** The crosswalk (`.skilled/bin/agent-mirror-crosswalk.md:121`) and `.vibe/SYNC.md:48` both report `mode: all` correctly. The tension is inside the agent file itself (`.skilled/agents/markdown.md:4` `mode: all` against `:24` "Dedicated LEAF executor"), not between a doc and the agent. Out of scope for a docs-drift finding; recorded for the next focus. (iteration 2)
- **`never auto-dispatched` for `@debug`.** Consistent across `agent-registry.json:123`, `.skilled/agents/debug.md:26`, `.skilled/agents/README.txt:24` and `.skilled/skills/system-spec-kit/references/debugging/universal-debugging-methodology.md:29`. The registry's `dispatchers: ["operator"]` matches. No drift. (iteration 2)
- **`Only @orchestrate dispatches it` (`README.md:977`) for `@code`.** `agent-registry.json` gives `code` exactly one dispatcher, `orchestrate`. The claim holds. (iteration 2)
- **`orchestrate.md`'s generated roster blocks as drift.** The routing table at `.skilled/agents/orchestrate.md:77`-`:88`, the tier table at `:98` and the agent-files block at `:171` are all generated from `agent-registry.json` and match it row for row: eleven rows, priorities 1-11, every tier `LEAF` except the orchestrator itself. No drift. (iteration 2)
- **`sync-agent-roster.cjs` as a broken reference.** The script exists at `.skilled/bin/sync-agent-roster.cjs` and is documented at `.skilled/bin/README.md:180`. The generated-block comments that name it are accurate. (iteration 2)
- Grepping for a status enum by its literal pipe-separated form finds only five files, and four of them agree. The vocabulary is restated in prose in most places, so a grep for `status` alone returns hundreds of unrelated hits. The enum is a narrow, high-yield target; the surrounding prose is not. (iteration 2)
- The README's per-agent role paragraphs are accurate for nine of the eleven agents. Only the Deep Review paragraph makes a tool-surface claim that the frontmatter contradicts, so this angle is close to exhausted after one pass. (iteration 2)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
