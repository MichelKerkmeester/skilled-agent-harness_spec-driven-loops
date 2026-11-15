---
title: Deep Research Strategy - Agent Docs Alignment (vibe-a lineage)
description: Runtime strategy packet for the vibe-a fan-out lineage of the agent documentation alignment research run.
trigger_phrases:
  - "agent docs alignment research"
  - "deep research strategy vibe-a"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Agent Docs Alignment (vibe-a)

## 1. OVERVIEW

### Purpose

Persistent brain for the `vibe-a` fan-out lineage. Records what to investigate, what worked, what failed, and where to focus next across the three iterations of this lineage.

### Usage

- **Init:** populated from the run config and the research topic.
- **Per iteration:** the leaf reads Next Focus, writes iteration evidence, and the reducer refreshes the machine-owned sections.
- **Mutability:** analyst-owned sections stay stable; machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC

Do the READMEs, AGENTS.md, CROSS-CLI.md, runtime sync docs, skill and command docs, feature catalogs and manual testing playbooks across the repo describe the current eleven agents (`.skilled/agents/*.md` and `agent-registry.json`) and their runtime copies (`.claude`, `.codex`, `.cursor`, `.devin`, `.dsh`, `.opencode`, `.pi`, `.vibe` agent folders) correctly? Find each doc line that misdescribes an agent's role, tools, status values, routing, file location, model pin or sync mechanism, and cite both the doc line and the agent or generator file it contradicts. Exclude changelogs, `specs/` and archived packets.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Does the canonical agent inventory in `.skilled/agents/*.md` plus `.skilled/agents/agent-registry.json` match what the top-level docs (`README.md`, `AGENTS.md`, `CROSS-CLI.md`) say about the eleven agents' names, roles, tiers, tools and model pins?
- [x] Do the runtime sync docs and the generator scripts describe the same sync mechanism, source-of-truth path and runtime copy locations (`.claude`, `.codex`, `.cursor`, `.devin`, `.dsh`, `.opencode`, `.pi`, `.vibe`) that the generators actually implement?
- [x] Do the skill and command docs (`.skilled/skills/**`, `.skilled/commands/**`) describe each agent's role, allowed tools, status values and routing correctly?
- [x] Do the feature catalogs and manual testing playbooks describe agent status values, routing, file locations and sync behaviour correctly?
- [x] Which specific doc lines misdescribe an agent's role, tools, status values, routing, file location, model pin or sync mechanism, and which agent or generator file contradicts each one?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Changelogs, `specs/` packets and archived packets are out of scope.
- No implementation fixes: this run reports doc/agent contradictions only.
- No edits to any researched file; the packet is the only write surface.

---

## 5. STOP CONDITIONS

- `maxIterations` (3) reached for this lineage.
- Three trailing failed iterations.
- `maxDurationMinutes` (120) elapsed from `createdAt`.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Do the runtime sync docs and the generator scripts describe the same sync mechanism, source-of-truth path and runtime copy locations (`.claude`, `.codex`, `.cursor`, `.devin`, `.dsh`, `.opencode`, `.pi`, `.vibe`) that the generators actually implement?
- Do the skill and command docs (`.skilled/skills/**`, `.skilled/commands/**`) describe each agent's role, allowed tools, status values and routing correctly?
- Do the feature catalogs and manual testing playbooks describe agent status values, routing, file locations and sync behaviour correctly?
- Which specific doc lines misdescribe an agent's role, tools, status values, routing, file location, model pin or sync mechanism, and which agent or generator file contradicts each one?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- starting from the machine-readable registry and the frontmatter rather than from the prose gave a cheap, exact ground truth, so every prose claim could be checked by counting rather than by reading. The `mode:` count and the runtime-tree listing both fell out of one `grep` and one `ls`. (iteration 1)
- grepping for the numeric and enumerable claims ("11 agents", "Runtime path resolution", "Iteration Status Enum") found the misdescriptions directly, because a doc that restates a count or an enum is checkable by counting rather than by judgement. The status-enum pair and the tool-set line both fell out of one grep each. (iteration 2)
- reading the doctor roster check as a claim about the roster rather than as code found four misdescriptions in one file, because its header comment, its canonical constant and its surface table each assert something about the eleven agents that the trees contradict. The playbook defect fell out of comparing the sandbox setup script against the diff commands it feeds. (iteration 3)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- `AGENTS.md` and `.skilled/CROSS-CLI.md` were probed first on the assumption that a repo-level instruction file would carry an agent roster. Neither does, which cost two calls before the README's §10 Agent Library turned out to be the real inventory surface. (iteration 1)
- the first pass assumed the skill docs would restate agent roles in prose. Most do not — they defer to the workflow YAML — so prose-level role hunting returned nothing and the productive surface turned out to be the enumerations instead. (iteration 2)
- the feature catalogs were probed first on the assumption that a catalog would restate agent roles. They do not — they describe loop mechanics and link to agent files as evidence — so that pass produced only ruled-out entries. (iteration 3)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `.skilled/agents/orchestrate.md`'s three generated blocks (`routing-table` at line 76, `tier-table` at line 98, `agent-files` at line 171) match `agent-registry.json` exactly, including the eleven priorities and the LEAF/ORCHESTRATOR split. The generator is in sync. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `.skilled/agents/orchestrate.md`'s three generated blocks (`routing-table` at line 76, `tier-table` at line 98, `agent-files` at line 171) match `agent-registry.json` exactly, including the eleven priorities and the LEAF/ORCHESTRATOR split. The generator is in sync.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.skilled/agents/orchestrate.md`'s three generated blocks (`routing-table` at line 76, `tier-table` at line 98, `agent-files` at line 171) match `agent-registry.json` exactly, including the eleven priorities and the LEAF/ORCHESTRATOR split. The generator is in sync.

### `.skilled/commands/deep/research.md` makes no per-agent role, tool or status claim: it is a thin router that explicitly refuses to dispatch (lines 13-14, 24, 31) and defers every agent claim to the workflow YAML. Nothing there to contradict. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `.skilled/commands/deep/research.md` makes no per-agent role, tool or status claim: it is a thin router that explicitly refuses to dispatch (lines 13-14, 24, 31) and defers every agent claim to the workflow YAML. Nothing there to contradict.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.skilled/commands/deep/research.md` makes no per-agent role, tool or status claim: it is a thin router that explicitly refuses to dispatch (lines 13-14, 24, 31) and defers every agent claim to the workflow YAML. Nothing there to contradict.

### `.skilled/commands/doctor/runtime-mirrors.md:59` describes the roster check only as "the agent roster" without naming a runtime count or a canonical tree, so the command doc itself carries no contradictable claim. The misdescription lives in the script it invokes. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `.skilled/commands/doctor/runtime-mirrors.md:59` describes the roster check only as "the agent roster" without naming a runtime count or a canonical tree, so the command doc itself carries no contradictable claim. The misdescription lives in the script it invokes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.skilled/commands/doctor/runtime-mirrors.md:59` describes the roster check only as "the agent roster" without naming a runtime count or a canonical tree, so the command doc itself carries no contradictable claim. The misdescription lives in the script it invokes.

### `.skilled/CROSS-CLI.md` is the only `CROSS-CLI.md` in the repository (there is none at the root). It is a cross-CLI dispatch doc, not an agent-inventory doc; its agent references are dispatch examples rather than role or tool claims. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `.skilled/CROSS-CLI.md` is the only `CROSS-CLI.md` in the repository (there is none at the root). It is a cross-CLI dispatch doc, not an agent-inventory doc; its agent references are dispatch examples rather than role or tool claims.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.skilled/CROSS-CLI.md` is the only `CROSS-CLI.md` in the repository (there is none at the root). It is a cross-CLI dispatch doc, not an agent-inventory doc; its agent references are dispatch examples rather than role or tool claims.

### `.skilled/skills/system-deep-loop/SKILL.md`'s mode table (lines 28-31) names only `deep-research` and `deep-review` as agents, which is correct for a two-mode hub; the council is correctly called out as standalone at line 33. Not a finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `.skilled/skills/system-deep-loop/SKILL.md`'s mode table (lines 28-31) names only `deep-research` and `deep-review` as agents, which is correct for a two-mode hub; the council is correctly called out as standalone at line 33. Not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `.skilled/skills/system-deep-loop/SKILL.md`'s mode table (lines 28-31) names only `deep-research` and `deep-review` as agents, which is correct for a two-mode hub; the council is correctly called out as standalone at line 33. Not a finding.

### `AGENTS.md` carries no per-agent inventory: its only agent section is §9 "AGENT ROUTING" at line 280, which names runtime directories generically and makes no role, tool or count claim. There is nothing there to contradict, so `AGENTS.md` is not a productive target for this topic. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `AGENTS.md` carries no per-agent inventory: its only agent section is §9 "AGENT ROUTING" at line 280, which names runtime directories generically and makes no role, tool or count claim. There is nothing there to contradict, so `AGENTS.md` is not a productive target for this topic.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `AGENTS.md` carries no per-agent inventory: its only agent section is §9 "AGENT ROUTING" at line 280, which names runtime directories generically and makes no role, tool or count claim. There is nothing there to contradict, so `AGENTS.md` is not a productive target for this topic.

### Counting the CLI bridges as an agent-inventory error: `README.md:69`'s "Eight CLI bridges" resolves correctly against `.skilled/skills/cli-external-orchestration/mode-registry.json`, which declares exactly eight `workflow` modes (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`, `cli-deepseek-harness`, `cli-mistral-vibe`). Not a finding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Counting the CLI bridges as an agent-inventory error: `README.md:69`'s "Eight CLI bridges" resolves correctly against `.skilled/skills/cli-external-orchestration/mode-registry.json`, which declares exactly eight `workflow` modes (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`, `cli-deepseek-harness`, `cli-mistral-vibe`). Not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting the CLI bridges as an agent-inventory error: `README.md:69`'s "Eight CLI bridges" resolves correctly against `.skilled/skills/cli-external-orchestration/mode-registry.json`, which declares exactly eight `workflow` modes (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`, `cli-deepseek-harness`, `cli-mistral-vibe`). Not a finding.

### The feature catalogs are not a productive surface for this topic. Of the thirteen catalog files that mention an `agents/` path, only the two iteration-dispatch files make an agent claim, and both are accurate. The remaining eleven reference agent paths as evidence links rather than as role, tool or status claims. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The feature catalogs are not a productive surface for this topic. Of the thirteen catalog files that mention an `agents/` path, only the two iteration-dispatch files make an agent claim, and both are accurate. The remaining eleven reference agent paths as evidence links rather than as role, tool or status claims.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The feature catalogs are not a productive surface for this topic. Of the thirteen catalog files that mention an `agents/` path, only the two iteration-dispatch files make an agent claim, and both are accurate. The remaining eleven reference agent paths as evidence links rather than as role, tool or status claims.

### Treating `.claude/agents/Explore.md` as an undocumented twelfth agent: `.claude/README.md:41` documents it ("plus `Explore.md`, which only Claude has") and `check-agent-mirror-sync.cjs:40` carries it in `CLAUDE_ONLY_AGENTS`. Not a finding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `.claude/agents/Explore.md` as an undocumented twelfth agent: `.claude/README.md:41` documents it ("plus `Explore.md`, which only Claude has") and `check-agent-mirror-sync.cjs:40` carries it in `CLAUDE_ONLY_AGENTS`. Not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `.claude/agents/Explore.md` as an undocumented twelfth agent: `.claude/README.md:41` documents it ("plus `Explore.md`, which only Claude has") and `check-agent-mirror-sync.cjs:40` carries it in `CLAUDE_ONLY_AGENTS`. Not a finding.

### Treating `.skilled/agents/README.txt`'s model-pin claim as wrong: the claim that the Claude tree pins `context`, `markdown` and `Explore` to haiku and `prompt-improver` to sonnet matches `.claude/agents/*.md` exactly. Not a finding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `.skilled/agents/README.txt`'s model-pin claim as wrong: the claim that the Claude tree pins `context`, `markdown` and `Explore` to haiku and `prompt-improver` to sonnet matches `.claude/agents/*.md` exactly. Not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `.skilled/agents/README.txt`'s model-pin claim as wrong: the claim that the Claude tree pins `context`, `markdown` and `Explore` to haiku and `prompt-improver` to sonnet matches `.claude/agents/*.md` exactly. Not a finding.

### Treating `ai-council`'s `task: allow` as a LEAF violation: `.skilled/agents/ai-council.md:38-47` defines an explicit Depth 0 / Depth 1 split, where seats are dispatched only when the prompt states operator invocation and Depth 1 refuses nested dispatch. The permission is consistent with the agent's own contract, so the registry's flat `LEAF` tier is a simplification rather than a contradiction. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating `ai-council`'s `task: allow` as a LEAF violation: `.skilled/agents/ai-council.md:38-47` defines an explicit Depth 0 / Depth 1 split, where seats are dispatched only when the prompt states operator invocation and Depth 1 refuses nested dispatch. The permission is consistent with the agent's own contract, so the registry's flat `LEAF` tier is a simplification rather than a contradiction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `ai-council`'s `task: allow` as a LEAF violation: `.skilled/agents/ai-council.md:38-47` defines an explicit Depth 0 / Depth 1 split, where seats are dispatched only when the prompt states operator invocation and Depth 1 refuses nested dispatch. The permission is consistent with the agent's own contract, so the registry's flat `LEAF` tier is a simplification rather than a contradiction.

### Treating `pause-sentinel-halt.md:110`'s citation of `.skilled/agents/deep-research.md:43-55` as stale: those lines are the ILLEGAL NESTING AND SCOPE LOCK block, which is what the row claims to anchor. Not a finding. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating `pause-sentinel-halt.md:110`'s citation of `.skilled/agents/deep-research.md:43-55` as stale: those lines are the ILLEGAL NESTING AND SCOPE LOCK block, which is what the row claims to anchor. Not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `pause-sentinel-halt.md:110`'s citation of `.skilled/agents/deep-research.md:43-55` as stale: those lines are the ILLEGAL NESTING AND SCOPE LOCK block, which is what the row claims to anchor. Not a finding.

### Treating `review`'s `bash: allow` as contradicting its "READ-ONLY file access" claim: `.skilled/agents/review.md:110` scopes Bash to `git diff`, `git log` and `gh pr view`, which are read-only commands. Not a finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating `review`'s `bash: allow` as contradicting its "READ-ONLY file access" claim: `.skilled/agents/review.md:110` scopes Bash to `git diff`, `git log` and `gh pr view`, which are read-only commands. Not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `review`'s `bash: allow` as contradicting its "READ-ONLY file access" claim: `.skilled/agents/review.md:110` scopes Bash to `git diff`, `git log` and `gh pr view`, which are read-only commands. Not a finding.

### Treating the `.cursor`/`.devin` symlink claim as wrong: `ls -la` confirms `.cursor/agents/*.md` and `.devin/agents/*/AGENT.md` are symlinks into `.claude/agents/`. Only the OpenCode/Codex half of that sentence is wrong. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the `.cursor`/`.devin` symlink claim as wrong: `ls -la` confirms `.cursor/agents/*.md` and `.devin/agents/*/AGENT.md` are symlinks into `.claude/agents/`. Only the OpenCode/Codex half of that sentence is wrong.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the `.cursor`/`.devin` symlink claim as wrong: `ls -la` confirms `.cursor/agents/*.md` and `.devin/agents/*/AGENT.md` are symlinks into `.claude/agents/`. Only the OpenCode/Codex half of that sentence is wrong.

### Treating the deep-research status enum as wrong: `.skilled/skills/system-deep-loop/deep-research/SKILL.md:225` lists all six values and matches `.skilled/agents/deep-research.md`. Only the deep-review sibling is short a value. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the deep-research status enum as wrong: `.skilled/skills/system-deep-loop/deep-research/SKILL.md:225` lists all six values and matches `.skilled/agents/deep-research.md`. Only the deep-review sibling is short a value.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the deep-research status enum as wrong: `.skilled/skills/system-deep-loop/deep-research/SKILL.md:225` lists all six values and matches `.skilled/agents/deep-research.md`. Only the deep-review sibling is short a value.

### Treating the feature catalogs as a misdescription surface: the two catalogs that name an agent — `deep-research/feature-catalog/loop-lifecycle/iteration-dispatch.md` and `deep-review/feature-catalog/loop-lifecycle/iteration-dispatch.md` — describe the LEAF contract, the reducer boundary and the file locations correctly, and `deep-research/feature-catalog/feature-catalog.md:54` matches the workflow. No finding. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the feature catalogs as a misdescription surface: the two catalogs that name an agent — `deep-research/feature-catalog/loop-lifecycle/iteration-dispatch.md` and `deep-review/feature-catalog/loop-lifecycle/iteration-dispatch.md` — describe the LEAF contract, the reducer boundary and the file locations correctly, and `deep-research/feature-catalog/feature-catalog.md:54` matches the workflow. No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the feature catalogs as a misdescription surface: the two catalogs that name an agent — `deep-research/feature-catalog/loop-lifecycle/iteration-dispatch.md` and `deep-review/feature-catalog/loop-lifecycle/iteration-dispatch.md` — describe the LEAF contract, the reducer boundary and the file locations correctly, and `deep-research/feature-catalog/feature-catalog.md:54` matches the workflow. No finding.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- `.skilled/CROSS-CLI.md` is the only `CROSS-CLI.md` in the repository (there is none at the root). It is a cross-CLI dispatch doc, not an agent-inventory doc; its agent references are dispatch examples rather than role or tool claims. (iteration 1)
- `AGENTS.md` carries no per-agent inventory: its only agent section is §9 "AGENT ROUTING" at line 280, which names runtime directories generically and makes no role, tool or count claim. There is nothing there to contradict, so `AGENTS.md` is not a productive target for this topic. (iteration 1)
- Counting the CLI bridges as an agent-inventory error: `README.md:69`'s "Eight CLI bridges" resolves correctly against `.skilled/skills/cli-external-orchestration/mode-registry.json`, which declares exactly eight `workflow` modes (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`, `cli-deepseek-harness`, `cli-mistral-vibe`). Not a finding. (iteration 1)
- Treating `.claude/agents/Explore.md` as an undocumented twelfth agent: `.claude/README.md:41` documents it ("plus `Explore.md`, which only Claude has") and `check-agent-mirror-sync.cjs:40` carries it in `CLAUDE_ONLY_AGENTS`. Not a finding. (iteration 1)
- Treating `.skilled/agents/README.txt`'s model-pin claim as wrong: the claim that the Claude tree pins `context`, `markdown` and `Explore` to haiku and `prompt-improver` to sonnet matches `.claude/agents/*.md` exactly. Not a finding. (iteration 1)
- `.skilled/agents/orchestrate.md`'s three generated blocks (`routing-table` at line 76, `tier-table` at line 98, `agent-files` at line 171) match `agent-registry.json` exactly, including the eleven priorities and the LEAF/ORCHESTRATOR split. The generator is in sync. (iteration 2)
- `.skilled/commands/deep/research.md` makes no per-agent role, tool or status claim: it is a thin router that explicitly refuses to dispatch (lines 13-14, 24, 31) and defers every agent claim to the workflow YAML. Nothing there to contradict. (iteration 2)
- `.skilled/skills/system-deep-loop/SKILL.md`'s mode table (lines 28-31) names only `deep-research` and `deep-review` as agents, which is correct for a two-mode hub; the council is correctly called out as standalone at line 33. Not a finding. (iteration 2)
- Treating `ai-council`'s `task: allow` as a LEAF violation: `.skilled/agents/ai-council.md:38-47` defines an explicit Depth 0 / Depth 1 split, where seats are dispatched only when the prompt states operator invocation and Depth 1 refuses nested dispatch. The permission is consistent with the agent's own contract, so the registry's flat `LEAF` tier is a simplification rather than a contradiction. (iteration 2)
- Treating `review`'s `bash: allow` as contradicting its "READ-ONLY file access" claim: `.skilled/agents/review.md:110` scopes Bash to `git diff`, `git log` and `gh pr view`, which are read-only commands. Not a finding. (iteration 2)
- Treating the deep-research status enum as wrong: `.skilled/skills/system-deep-loop/deep-research/SKILL.md:225` lists all six values and matches `.skilled/agents/deep-research.md`. Only the deep-review sibling is short a value. (iteration 2)
- `.skilled/commands/doctor/runtime-mirrors.md:59` describes the roster check only as "the agent roster" without naming a runtime count or a canonical tree, so the command doc itself carries no contradictable claim. The misdescription lives in the script it invokes. (iteration 3)
- The feature catalogs are not a productive surface for this topic. Of the thirteen catalog files that mention an `agents/` path, only the two iteration-dispatch files make an agent claim, and both are accurate. The remaining eleven reference agent paths as evidence links rather than as role, tool or status claims. (iteration 3)
- Treating `pause-sentinel-halt.md:110`'s citation of `.skilled/agents/deep-research.md:43-55` as stale: those lines are the ILLEGAL NESTING AND SCOPE LOCK block, which is what the row claims to anchor. Not a finding. (iteration 3)
- Treating the `.cursor`/`.devin` symlink claim as wrong: `ls -la` confirms `.cursor/agents/*.md` and `.devin/agents/*/AGENT.md` are symlinks into `.claude/agents/`. Only the OpenCode/Codex half of that sentence is wrong. (iteration 3)
- Treating the feature catalogs as a misdescription surface: the two catalogs that name an agent — `deep-research/feature-catalog/loop-lifecycle/iteration-dispatch.md` and `deep-review/feature-catalog/loop-lifecycle/iteration-dispatch.md` — describe the LEAF contract, the reducer boundary and the file locations correctly, and `deep-research/feature-catalog/feature-catalog.md:54` matches the workflow. No finding. (iteration 3)

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
Follow up on: `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/command-flow-stress-tests/spec-fence-writeback.md:106` cites `.skilled/agents/deep-research.md:51-55` for "agent may not repair reducer or contro...

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers: `.skilled/agents/` (11 agent markdown files plus `agent-registry.json` and `README.txt`); runtime mirrors `.claude/agents`, `.codex/agents`, `.cursor/agents`, `.devin/agents`, `.dsh/agents`, `.opencode/agents`, `.pi/agents`, `.vibe/agents`; sync tooling under `.skilled/bin/`; top-level docs `README.md`, `AGENTS.md`, `CROSS-CLI.md`, `PUBLIC-RELEASE.md`, `INSTALL-SKILLED.md`.
- Reuse candidates: `.skilled/agents/agent-registry.json` is the machine-readable roster the generated roster blocks are written from; `sync-agent-roster.cjs` is named as its writer.
- Integration points: agent frontmatter (`name`, `description`, `mode`, `temperature`, `permission`), the registry `tier`/`priority`/`dispatchers` fields, and the per-runtime generator scripts.
- Constraints and risks: `.claude/agents` carries an `Explore.md` that has no `.skilled/agents` counterpart; runtime mirrors are generated, so a doc that names a mirror path may be describing a generator rather than a checked-in file.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 3
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- `research.md` ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-11-15T14:58:06Z
