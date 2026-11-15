---
title: Deep Research Strategy - Agent Documentation Alignment (vibe-b lineage)
description: Runtime strategy for the vibe-b fan-out lineage of the agent documentation alignment research packet.
trigger_phrases:
  - "agent docs alignment strategy"
  - "vibe-b lineage strategy"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - Agent Documentation Alignment (vibe-b)

## 1. OVERVIEW

### Purpose

Persistent brain for the `vibe-b` fan-out lineage. Records what to investigate, what worked, what failed, and where to focus next across the lineage's two iterations.

### Usage

- **Init:** populated from the research topic and the fan-out dispatch parameters.
- **Per iteration:** the iteration narrative carries evidence; the reducer refreshes the machine-owned sections below.
- **Mutability:** analyst-owned sections stay stable; machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC

Do the READMEs, AGENTS.md, CROSS-CLI.md, runtime sync docs, skill and command docs, feature catalogs and manual testing playbooks across the repo describe the current eleven agents (`.skilled/agents/*.md` and `agent-registry.json`) and their runtime copies (`.claude`, `.codex`, `.cursor`, `.devin`, `.dsh`, `.opencode`, `.pi`, `.vibe` agent folders) correctly? Find each doc line that misdescribes an agent's role, tools, status values, routing, file location, model pin or sync mechanism, and cite both the doc line and the agent or generator file it contradicts. Exclude changelogs, `specs/` and archived packets.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which doc lines in README.md, AGENTS.md, CROSS-CLI.md and the runtime sync docs state an agent count, roster, or agent file location that disagrees with `.skilled/agents/*.md` and `agent-registry.json`?
- [x] Which doc lines misdescribe an individual agent's role, tool allowlist, or permission block relative to that agent's `.skilled/agents/<name>.md` frontmatter?
- [x] Which doc lines state agent status values, routing rules, or model pins that contradict the agent frontmatter, the registry, or the runtime generator?
- [x] Which skill, command, feature-catalog and manual-testing-playbook docs describe agent sync mechanisms or runtime copy locations that no longer match the generator and the checked-in runtime agent folders?
- [x] Which runtime agent copies (.claude, .codex, .cursor, .devin, .dsh, .opencode, .pi, .vibe) diverge from their `.skilled/agents/*.md` source in a way a doc claims is synchronized?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Changelogs, `specs/` packets, and archived research packets are out of scope.
- No implementation of fixes: this lineage reports documentation drift only.
- No re-derivation of the agent roster from runtime copies; `.skilled/agents/*.md` plus `agent-registry.json` are the source of truth.

---

## 5. STOP CONDITIONS

- `config.maxIterations` (2) reached, recorded as `maxIterationsReached`.
- Convergence below `config.convergenceThreshold` (0.05) is telemetry only for this lineage; the loop broadens review angles instead of synthesizing early.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which doc lines in README.md, AGENTS.md, CROSS-CLI.md and the runtime sync docs state an agent count, roster, or agent file location that disagrees with `.skilled/agents/*.md` and `agent-registry.json`?
- Which doc lines misdescribe an individual agent's role, tool allowlist, or permission block relative to that agent's `.skilled/agents/<name>.md` frontmatter?
- Which doc lines state agent status values, routing rules, or model pins that contradict the agent frontmatter, the registry, or the runtime generator?
- Which skill, command, feature-catalog and manual-testing-playbook docs describe agent sync mechanisms or runtime copy locations that no longer match the generator and the checked-in runtime agent folders?
- Which runtime agent copies (.claude, .codex, .cursor, .devin, .dsh, .opencode, .pi, .vibe) diverge from their `.skilled/agents/*.md` source in a way a doc claims is synchronized?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the repo's own translation contract first turned it into a checklist. Every claim in `.skilled/bin/agent-mirror-crosswalk.md` is falsifiable against a directory listing, so the drift surfaced as a set of concrete line-level contradictions rather than a vague "docs are stale" impression. Verifying the claims that turned out to be *correct* (model pins, temperature split, `task` grants) was as valuable as finding the wrong ones, because it kept the finding list honest and produced the Ruled Out section. (iteration 1)
- switching the comparison target from directory listings to frontmatter blocks and sibling skill docs surfaced a class of drift iteration 1 could not see. The status-enum finding exists only because two skill docs for sibling loops were read side by side; neither is wrong on its own, and only the pair plus the agent file makes the omission visible. Reading `.vibe/SYNC.md` as a contract rather than as prose also paid off: its own section 3 contradicts itself within sixteen lines, which is a stronger finding than any cross-file mismatch. (iteration 2)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the first pass treated `.opencode/agents/` as a non-symlinked copy and nearly reported `CROSS-CLI.md:36` as drift. `ls -la` on the parent directory showed the symlink and the finding was withdrawn. Directory listings of a symlinked directory show the target's files, which is a trap for exactly this topic. (iteration 1)
- the README role-paragraph sweep produced one finding from eleven paragraphs. Nine of the eleven paragraphs describe behavior rather than tool surface, so there is nothing in them for a permission map to contradict. Spending four tool calls on that sweep was a poor trade against the two calls that found the Vibe contradiction. (iteration 2)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`.claude/agents/Explore.md` as an orphaned mirror.** It is documented as deliberate in three places: `.skilled/bin/agent-mirror-crosswalk.md:2.5` ("`Explore.md` is not a roster agent"), `.skilled/CROSS-CLI.md:55` ("a Claude-only agent with no counterpart in `.skilled/agents/`"), and `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:52` (`CLAUDE_ONLY_AGENTS = new Set(['Explore'])`). Not drift. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`.claude/agents/Explore.md` as an orphaned mirror.** It is documented as deliberate in three places: `.skilled/bin/agent-mirror-crosswalk.md:2.5` ("`Explore.md` is not a roster agent"), `.skilled/CROSS-CLI.md:55` ("a Claude-only agent with no counterpart in `.skilled/agents/`"), and `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:52` (`CLAUDE_ONLY_AGENTS = new Set(['Explore'])`). Not drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`.claude/agents/Explore.md` as an orphaned mirror.** It is documented as deliberate in three places: `.skilled/bin/agent-mirror-crosswalk.md:2.5` ("`Explore.md` is not a roster agent"), `.skilled/CROSS-CLI.md:55` ("a Claude-only agent with no counterpart in `.skilled/agents/`"), and `.skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs:52` (`CLAUDE_ONLY_AGENTS = new Set(['Explore'])`). Not drift.

### **`.claude` model pins** (same section). Verified: `context.md`, `markdown.md` and `Explore.md` declare `model: haiku`; `prompt-improver.md` declares `model: sonnet`; no other `.claude` agent declares a model. The claim holds. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`.claude` model pins** (same section). Verified: `context.md`, `markdown.md` and `Explore.md` declare `model: haiku`; `prompt-improver.md` declares `model: sonnet`; no other `.claude` agent declares a model. The claim holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`.claude` model pins** (same section). Verified: `context.md`, `markdown.md` and `Explore.md` declare `model: haiku`; `prompt-improver.md` declares `model: sonnet`; no other `.claude` agent declares a model. The claim holds.

### **`.codex` model pin** (`.skilled/bin/agent-mirror-crosswalk.md:2.5`). Verified: all eleven `.codex/agents/*.toml` carry `model = "gpt-6-luna"`, with `model_reasoning_effort = "high"` except `context` (`low`) and `markdown` (`medium`). The claim holds exactly. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`.codex` model pin** (`.skilled/bin/agent-mirror-crosswalk.md:2.5`). Verified: all eleven `.codex/agents/*.toml` carry `model = "gpt-6-luna"`, with `model_reasoning_effort = "high"` except `context` (`low`) and `markdown` (`medium`). The claim holds exactly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`.codex` model pin** (`.skilled/bin/agent-mirror-crosswalk.md:2.5`). Verified: all eleven `.codex/agents/*.toml` carry `model = "gpt-6-luna"`, with `model_reasoning_effort = "high"` except `context` (`low`) and `markdown` (`medium`). The claim holds exactly.

### **`.opencode/agents/` as a non-symlinked copy.** `ls -la .opencode` shows `agents -> ../.skilled/agents`, so `CROSS-CLI.md:36` ("Symlinked ... `agents`") and `README.md:963` ("links to the same `.skilled/agents/` source") are both correct. The apparent "real files" in a directory listing are the symlink target's files. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`.opencode/agents/` as a non-symlinked copy.** `ls -la .opencode` shows `agents -> ../.skilled/agents`, so `CROSS-CLI.md:36` ("Symlinked ... `agents`") and `README.md:963` ("links to the same `.skilled/agents/` source") are both correct. The apparent "real files" in a directory listing are the symlink target's files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`.opencode/agents/` as a non-symlinked copy.** `ls -la .opencode` shows `agents -> ../.skilled/agents`, so `CROSS-CLI.md:36` ("Symlinked ... `agents`") and `README.md:963` ("links to the same `.skilled/agents/` source") are both correct. The apparent "real files" in a directory listing are the symlink target's files.

### **`.pi` model absence** (same section). Verified: no `model:` key in any `.pi/agents/*.md`. The claim holds. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`.pi` model absence** (same section). Verified: no `model:` key in any `.pi/agents/*.md`. The claim holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`.pi` model absence** (same section). Verified: no `model:` key in any `.pi/agents/*.md`. The claim holds.

### **`.skilled/agents/README.txt:4` "agent definitions for the OpenCode runtime".** Literally true because `.opencode/agents` is a symlink to this directory. Not reported as drift. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`.skilled/agents/README.txt:4` "agent definitions for the OpenCode runtime".** Literally true because `.opencode/agents` is a symlink to this directory. Not reported as drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`.skilled/agents/README.txt:4` "agent definitions for the OpenCode runtime".** Literally true because `.opencode/agents` is a symlink to this directory. Not reported as drift.

### **`.skilled` as "the only tree that carries a permission map"** (`.skilled/bin/agent-mirror-crosswalk.md:68`). `.opencode/agents` resolves to `.skilled/agents`, so no second distinct tree carries a permission map. The claim holds. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`.skilled` as "the only tree that carries a permission map"** (`.skilled/bin/agent-mirror-crosswalk.md:68`). `.opencode/agents` resolves to `.skilled/agents`, so no second distinct tree carries a permission map. The claim holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`.skilled` as "the only tree that carries a permission map"** (`.skilled/bin/agent-mirror-crosswalk.md:68`). `.opencode/agents` resolves to `.skilled/agents`, so no second distinct tree carries a permission map. The claim holds.

### **`Agent`/`task` grant** (`.skilled/bin/agent-mirror-crosswalk.md:2.4`). Verified: only `ai-council` and `orchestrate` carry `task: allow`; the other nine carry `task: deny`. The claim holds. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`Agent`/`task` grant** (`.skilled/bin/agent-mirror-crosswalk.md:2.4`). Verified: only `ai-council` and `orchestrate` carry `task: allow`; the other nine carry `task: deny`. The claim holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`Agent`/`task` grant** (`.skilled/bin/agent-mirror-crosswalk.md:2.4`). Verified: only `ai-council` and `orchestrate` carry `task: allow`; the other nine carry `task: deny`. The claim holds.

### **`ai-council` as a LEAF that grants `task: allow`.** Not a contradiction: `.skilled/agents/ai-council.md:44` states "The AI Council is a LEAF by default. It dispatches council seats only when the prompt states that the operator invoked it directly", and `.skilled/bin/agent-mirror-crosswalk.md:2.4` documents `Agent`/`task` as the nested-delegation grant. The registry's `tier: LEAF` and the frontmatter agree on the default. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`ai-council` as a LEAF that grants `task: allow`.** Not a contradiction: `.skilled/agents/ai-council.md:44` states "The AI Council is a LEAF by default. It dispatches council seats only when the prompt states that the operator invoked it directly", and `.skilled/bin/agent-mirror-crosswalk.md:2.4` documents `Agent`/`task` as the nested-delegation grant. The registry's `tier: LEAF` and the frontmatter agree on the default.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`ai-council` as a LEAF that grants `task: allow`.** Not a contradiction: `.skilled/agents/ai-council.md:44` states "The AI Council is a LEAF by default. It dispatches council seats only when the prompt states that the operator invoked it directly", and `.skilled/bin/agent-mirror-crosswalk.md:2.4` documents `Agent`/`task` as the nested-delegation grant. The registry's `tier: LEAF` and the frontmatter agree on the default.

### **`ai-council`'s `max_rounds` default of 3 (`agent-registry.json:47`).** `.skilled/agents/ai-council.md:389` states "up to `max_rounds` (default 3)". The claim holds. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`ai-council`'s `max_rounds` default of 3 (`agent-registry.json:47`).** `.skilled/agents/ai-council.md:389` states "up to `max_rounds` (default 3)". The claim holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`ai-council`'s `max_rounds` default of 3 (`agent-registry.json:47`).** `.skilled/agents/ai-council.md:389` states "up to `max_rounds` (default 3)". The claim holds.

### **`code`'s "seven dispatch modes" (`README.md:975`).** `.skilled/agents/code.md:261` states "Mode: <one of the 7 dispatch modes>". The count matches. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`code`'s "seven dispatch modes" (`README.md:975`).** `.skilled/agents/code.md:261` states "Mode: <one of the 7 dispatch modes>". The count matches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`code`'s "seven dispatch modes" (`README.md:975`).** `.skilled/agents/code.md:261` states "Mode: <one of the 7 dispatch modes>". The count matches.

### **`markdown` as `mode: all` while the registry calls it LEAF.** The crosswalk (`.skilled/bin/agent-mirror-crosswalk.md:121`) and `.vibe/SYNC.md:48` both report `mode: all` correctly. The tension is inside the agent file itself (`.skilled/agents/markdown.md:4` `mode: all` against `:24` "Dedicated LEAF executor"), not between a doc and the agent. Out of scope for a docs-drift finding; recorded for the next focus. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`markdown` as `mode: all` while the registry calls it LEAF.** The crosswalk (`.skilled/bin/agent-mirror-crosswalk.md:121`) and `.vibe/SYNC.md:48` both report `mode: all` correctly. The tension is inside the agent file itself (`.skilled/agents/markdown.md:4` `mode: all` against `:24` "Dedicated LEAF executor"), not between a doc and the agent. Out of scope for a docs-drift finding; recorded for the next focus.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`markdown` as `mode: all` while the registry calls it LEAF.** The crosswalk (`.skilled/bin/agent-mirror-crosswalk.md:121`) and `.vibe/SYNC.md:48` both report `mode: all` correctly. The tension is inside the agent file itself (`.skilled/agents/markdown.md:4` `mode: all` against `:24` "Dedicated LEAF executor"), not between a doc and the agent. Out of scope for a docs-drift finding; recorded for the next focus.

### **`never auto-dispatched` for `@debug`.** Consistent across `agent-registry.json:123`, `.skilled/agents/debug.md:26`, `.skilled/agents/README.txt:24` and `.skilled/skills/system-spec-kit/references/debugging/universal-debugging-methodology.md:29`. The registry's `dispatchers: ["operator"]` matches. No drift. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`never auto-dispatched` for `@debug`.** Consistent across `agent-registry.json:123`, `.skilled/agents/debug.md:26`, `.skilled/agents/README.txt:24` and `.skilled/skills/system-spec-kit/references/debugging/universal-debugging-methodology.md:29`. The registry's `dispatchers: ["operator"]` matches. No drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`never auto-dispatched` for `@debug`.** Consistent across `agent-registry.json:123`, `.skilled/agents/debug.md:26`, `.skilled/agents/README.txt:24` and `.skilled/skills/system-spec-kit/references/debugging/universal-debugging-methodology.md:29`. The registry's `dispatchers: ["operator"]` matches. No drift.

### **`Only @orchestrate dispatches it` (`README.md:977`) for `@code`.** `agent-registry.json` gives `code` exactly one dispatcher, `orchestrate`. The claim holds. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`Only @orchestrate dispatches it` (`README.md:977`) for `@code`.** `agent-registry.json` gives `code` exactly one dispatcher, `orchestrate`. The claim holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`Only @orchestrate dispatches it` (`README.md:977`) for `@code`.** `agent-registry.json` gives `code` exactly one dispatcher, `orchestrate`. The claim holds.

### **`orchestrate.md`'s generated roster blocks as drift.** The routing table at `.skilled/agents/orchestrate.md:77`-`:88`, the tier table at `:98` and the agent-files block at `:171` are all generated from `agent-registry.json` and match it row for row: eleven rows, priorities 1-11, every tier `LEAF` except the orchestrator itself. No drift. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`orchestrate.md`'s generated roster blocks as drift.** The routing table at `.skilled/agents/orchestrate.md:77`-`:88`, the tier table at `:98` and the agent-files block at `:171` are all generated from `agent-registry.json` and match it row for row: eleven rows, priorities 1-11, every tier `LEAF` except the orchestrator itself. No drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`orchestrate.md`'s generated roster blocks as drift.** The routing table at `.skilled/agents/orchestrate.md:77`-`:88`, the tier table at `:98` and the agent-files block at `:171` are all generated from `agent-registry.json` and match it row for row: eleven rows, priorities 1-11, every tier `LEAF` except the orchestrator itself. No drift.

### **`sync-agent-roster.cjs` as a broken reference.** The script exists at `.skilled/bin/sync-agent-roster.cjs` and is documented at `.skilled/bin/README.md:180`. The generated-block comments that name it are accurate. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`sync-agent-roster.cjs` as a broken reference.** The script exists at `.skilled/bin/sync-agent-roster.cjs` and is documented at `.skilled/bin/README.md:180`. The generated-block comments that name it are accurate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`sync-agent-roster.cjs` as a broken reference.** The script exists at `.skilled/bin/sync-agent-roster.cjs` and is documented at `.skilled/bin/README.md:180`. The generated-block comments that name it are accurate.

### **`temperature` split** (`.skilled/bin/agent-mirror-crosswalk.md:2.2`). Verified: `0.2` for `debug` and `design`, `0.1` for the other nine. The claim holds. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`temperature` split** (`.skilled/bin/agent-mirror-crosswalk.md:2.2`). Verified: `0.2` for `debug` and `design`, `0.1` for the other nine. The claim holds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`temperature` split** (`.skilled/bin/agent-mirror-crosswalk.md:2.2`). Verified: `0.2` for `debug` and `design`, `0.1` for the other nine. The claim holds.

### Grepping for a numeric agent count (`eleven agents`, `11 agents`) across the repo returns almost nothing outside the crosswalk and `README.md:963`; the roster is described by enumeration rather than by count, so count-based greps are a weak detector for this topic. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Grepping for a numeric agent count (`eleven agents`, `11 agents`) across the repo returns almost nothing outside the crosswalk and `README.md:963`; the roster is described by enumeration rather than by count, so count-based greps are a weak detector for this topic.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Grepping for a numeric agent count (`eleven agents`, `11 agents`) across the repo returns almost nothing outside the crosswalk and `README.md:963`; the roster is described by enumeration rather than by count, so count-based greps are a weak detector for this topic.

### Grepping for a status enum by its literal pipe-separated form finds only five files, and four of them agree. The vocabulary is restated in prose in most places, so a grep for `status` alone returns hundreds of unrelated hits. The enum is a narrow, high-yield target; the surrounding prose is not. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Grepping for a status enum by its literal pipe-separated form finds only five files, and four of them agree. The vocabulary is restated in prose in most places, so a grep for `status` alone returns hundreds of unrelated hits. The enum is a narrow, high-yield target; the surrounding prose is not.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Grepping for a status enum by its literal pipe-separated form finds only five files, and four of them agree. The vocabulary is restated in prose in most places, so a grep for `status` alone returns hundreds of unrelated hits. The enum is a narrow, high-yield target; the surrounding prose is not.

### The feature catalogs contain no agent-roster claims. The only hits are handler-table rows naming `.skilled/agents/review.md`, `.skilled/agents/orchestrate.md` and `.skilled/agents/debug.md`, all of which exist and match their described roles. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The feature catalogs contain no agent-roster claims. The only hits are handler-table rows naming `.skilled/agents/review.md`, `.skilled/agents/orchestrate.md` and `.skilled/agents/debug.md`, all of which exist and match their described roles.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The feature catalogs contain no agent-roster claims. The only hits are handler-table rows naming `.skilled/agents/review.md`, `.skilled/agents/orchestrate.md` and `.skilled/agents/debug.md`, all of which exist and match their described roles.

### The README's per-agent role paragraphs are accurate for nine of the eleven agents. Only the Deep Review paragraph makes a tool-surface claim that the frontmatter contradicts, so this angle is close to exhausted after one pass. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The README's per-agent role paragraphs are accurate for nine of the eleven agents. Only the Deep Review paragraph makes a tool-surface claim that the frontmatter contradicts, so this angle is close to exhausted after one pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The README's per-agent role paragraphs are accurate for nine of the eleven agents. Only the Deep Review paragraph makes a tool-surface claim that the frontmatter contradicts, so this angle is close to exhausted after one pass.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- Source of truth for the roster: `.skilled/agents/*.md` frontmatter plus `agent-registry.json`.
- Runtime copies live under `.claude/agents/`, `.codex/agents/`, `.cursor/agents/`, `.devin/agents/`, `.dsh/agents/`, `.opencode/agents/`, `.pi/agents/`, `.vibe/agents/`.
- The repo already ships drift checkers: `.skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs` and `check-contract-drift.cjs`.
- `resource-map.md` not present; skipping coverage gate.

### Bounded Context Snapshot

- Source pointers: `.skilled/agents/`, `agent-registry.json`, `README.md`, `AGENTS.md`, `.skilled/CROSS-CLI.md`, `.skilled/skills/*/SKILL.md`, `.skilled/commands/**`, `.skilled/skills/*/feature-catalog/`, `.skilled/skills/*/manual-testing-playbook/`.
- Reuse candidates: existing drift checkers and the runtime sync generator.
- Integration points: documentation lines that name agent counts, roles, tools, status values, routing, file locations, model pins, or sync mechanisms.
- Constraints and risks: `specs/` and changelogs are excluded; runtime copies may be generated, so a doc/copy mismatch can be a stale-copy finding rather than a doc bug.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 2
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question conflict owner: reducer registry
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Current generation: 1
- Started: 2026-11-15T15:58:00Z
