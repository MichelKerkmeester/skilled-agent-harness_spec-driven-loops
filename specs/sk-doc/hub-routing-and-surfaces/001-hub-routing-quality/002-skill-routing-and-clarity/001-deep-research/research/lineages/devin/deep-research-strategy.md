---
title: Deep Research Strategy - Skill Routing Shape and Doc Clarity (lineage devin)
description: Runtime strategy for the devin fan-out lineage covering CLI/MCP hubs, standalone skills, and the docs, mirrors and generators that teach routing.
trigger_phrases:
  - "skill routing strategy devin"
  - "cli-external-orchestration routing"
  - "mcp-tooling routing"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - Skill Routing Shape and Doc Clarity

Runtime strategy for the `devin` fan-out lineage. It tracks research progress across five iterations and is read at every iteration.

## 1. OVERVIEW

### Purpose

Serves as the persistent brain for this lineage. Records what to investigate, what worked, what failed, and where to focus next. Read by the executor at every iteration.

### Usage

- **Init:** populated with Topic, Key Questions, Known Context, and Research Boundaries from config and the lead steer.
- **Per iteration:** the executor reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC

Skill routing shape and doc clarity across every skill and hub under `.skilled/skills`, plus the command and agent docs that teach routing. The starting hypothesis to test, not assume, is the sk-code advisor report at `specs/sk-doc/072-skill-routing-and-clarity/001-deep-research/scratch/sk-code-advisor-report.md`: JSON decides stage one, one hub ROUTER.md decides leaf files, script resolvers handle the rest, each mode SKILL.md keeps a short routing section with the machine block moved to an appendix, no ROUTER.md per mode, and JSON-only is viable only as a hybrid.

This lineage owns: hubs `cli-external-orchestration`, `mcp-tooling`, `cli-classifier` with every mode packet inside them; standalone skills `cli-orca`, `mcp-code-mode`, `sk-git`, `sk-prompt`, `sk-vision`, `system-skill-advisor`, `system-spec-kit`; the command docs under `.skilled/commands/` and agent docs under `.skilled/agents/` that teach routing; the runtime mirrors (`.hermes/skills`, `.claude`, `.opencode`, `.codex`, and the others) and the script that generates each; `system-skill-advisor`'s `graph-metadata.json` intent signals and trigger-phrase inputs; and the shared smart-router reference at `system-spec-kit/references/cli/shared-smart-router.md` plus every skill that defers to it.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Per skill, which routing mechanisms exist, where is one routing decision restated, and where have the copies drifted?
- [x] Which checks, parsers, templates, generators, benchmarks and runtime mirrors enforce the current routing shape, and what would each proposed change break?
- [x] Should hubs, mode packets and standalone skills each use a per-mode ROUTER.md, one hub ROUTER.md, the advisor hybrid, or JSON-only?
- [x] Which readability problems does each skill show, and which quoted passages demonstrate them?
- [x] What phased implementation plan, with order, risk and rollback, follows from the evidence?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not implement any routing change; this is read-only research.
- Do not cover `sk-code`, `sk-doc`, `sk-design`, `system-deep-loop`, or the parent-skill/router-sync/replay/compiled-route/package_skill tooling; the sibling lineage owns those.
- Do not re-litigate whether the repo should keep a skill system at all.
- Do not inventory ordinary reference content that makes no routing decision.

---

## 5. STOP CONDITIONS

- Five iterations complete (`stopPolicy: max-iterations`).
- Every assigned skill has at least one path:line routing citation and one readability citation.
- Questions (a) through (e) each have an evidence-backed answer.
- A claim that could not be read is marked inferred rather than asserted.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Per skill, which routing mechanisms exist, where is one routing decision restated, and where have the copies drifted?
- Which checks, parsers, templates, generators, benchmarks and runtime mirrors enforce the current routing shape, and what would each proposed change break?
- Should hubs, mode packets and standalone skills each use a per-mode ROUTER.md, one hub ROUTER.md, the advisor hybrid, or JSON-only?
- Which readability problems does each skill show, and which quoted passages demonstrate them?
- What phased implementation plan, with order, risk and rollback, follows from the evidence?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- a scripted set comparison turned "the lists look duplicated" into exact missing-phrase counts, which is the difference between a hunch and a finding. (iteration 1)
- reusing the iteration-1 comparison script made the mcp drift measurable in one call and kept the method identical across hubs. (iteration 2)
- reading the Class S contract first turned "these skills look similar" into a rule with a fleet list, which is what a verdict can stand on. (iteration 3)
- reading the doctor invariant before the scripts named the exact coupling in the authors' own words, which is stronger evidence than inferring it from filenames. (iteration 4)
- testing each candidate shape against a named check turned a preference into a verdict with a failure mode. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the benchmark report files are enormous and embed historical skill text; reading them whole wastes budget. The README states the retirement in 20 lines. (iteration 1)
- reading all nine packets in full would have exceeded the useful budget; the routing-section grep located the blocks without losing the evidence. (iteration 2)
- the first pass assumed every standalone had a `description.json` and the Node check failed; the contract explains why the absence is correct. (iteration 3)
- the mirror count needed `node_modules` exclusion; the first count looked like a mirror gap that was not one. (iteration 4)
- the first draft of the mode-packet verdict repeated the prior report's "remove the tables"; separating executor intent from task intent showed the two maps are not the same decision. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A per-mode `ROUTER.md` for any class. Class S forbids the hub files; Class H's router is hub-root only; no packet carries one. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A per-mode `ROUTER.md` for any class. Class S forbids the hub files; Class H's router is hub-root only; no packet carries one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A per-mode `ROUTER.md` for any class. Class S forbids the hub files; Class H's router is hub-root only; no packet carries one.

### A per-mode `ROUTER.md` for standalone skills. Class S forbids the hub files outright, so the option is not available, not merely inadvisable. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A per-mode `ROUTER.md` for standalone skills. Class S forbids the hub files outright, so the option is not available, not merely inadvisable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A per-mode `ROUTER.md` for standalone skills. Class S forbids the hub files outright, so the option is not available, not merely inadvisable.

### Counting "keyword triggers" lines as a routing decision: the CLI packets have none; their triggers live in the `<!-- Keywords: -->` comment, which no parser in this iteration was found to read. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Counting "keyword triggers" lines as a routing decision: the CLI packets have none; their triggers live in the `<!-- Keywords: -->` comment, which no parser in this iteration was found to read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting "keyword triggers" lines as a routing decision: the CLI packets have none; their triggers live in the `<!-- Keywords: -->` comment, which no parser in this iteration was found to read.

### Counting `.hermes/skills` against `find .skilled/skills -name SKILL.md` without excluding `node_modules`: the three extra hits are Playwright's bundled skills, correctly not mirrored. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Counting `.hermes/skills` against `find .skilled/skills -name SKILL.md` without excluding `node_modules`: the three extra hits are Playwright's bundled skills, correctly not mirrored.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting `.hermes/skills` against `find .skilled/skills -name SKILL.md` without excluding `node_modules`: the three extra hits are Playwright's bundled skills, correctly not mirrored.

### Deleting the packet task-intent maps. They answer a different question from the hub's executor map. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Deleting the packet task-intent maps. They answer a different question from the hub's executor map.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deleting the packet task-intent maps. They answer a different question from the hub's executor map.

### Looking for `description.json` in the standalone roots: the contract forbids it, and none exists. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for `description.json` in the standalone roots: the contract forbids it, and none exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for `description.json` in the standalone roots: the contract forbids it, and none exists.

### Pure JSON-only routing for hubs. `router-reach` reads `ROUTER.md` as stage-two vocabulary. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Pure JSON-only routing for hubs. `router-reach` reads `ROUTER.md` as stage-two vocabulary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pure JSON-only routing for hubs. `router-reach` reads `ROUTER.md` as stage-two vocabulary.

### Searching the mcp packets for a per-mode `ROUTER.md`: none exists. Every packet routes from its own SKILL.md block. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searching the mcp packets for a per-mode `ROUTER.md`: none exists. Every packet routes from its own SKILL.md block.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching the mcp packets for a per-mode `ROUTER.md`: none exists. Every packet routes from its own SKILL.md block.

### Treating `benchmark/reports/**` as live enforcement. The reports are frozen archives from an older worktree and the harness is retired (`benchmark/README.md:20`), so they are evidence of past behaviour only. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating `benchmark/reports/**` as live enforcement. The reports are frozen archives from an older worktree and the harness is retired (`benchmark/README.md:20`), so they are evidence of past behaviour only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `benchmark/reports/**` as live enforcement. The reports are frozen archives from an older worktree and the harness is retired (`benchmark/README.md:20`), so they are evidence of past behaviour only.

### Treating `DEFAULT_RESOURCE = []` and `DEFAULT_RESOURCE = "references/x.md"` as a contradiction. Both declare fallback-only semantics; the difference is representation. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating `DEFAULT_RESOURCE = []` and `DEFAULT_RESOURCE = "references/x.md"` as a contradiction. Both declare fallback-only semantics; the difference is representation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `DEFAULT_RESOURCE = []` and `DEFAULT_RESOURCE = "references/x.md"` as a contradiction. Both declare fallback-only semantics; the difference is representation.

### Treating all five phrase lists as live routing sources. Only `graph-metadata.json` feeds stage one; the rest are documentation or dead metadata. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating all five phrase lists as live routing sources. Only `graph-metadata.json` feeds stage one; the rest are documentation or dead metadata.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating all five phrase lists as live routing sources. Only `graph-metadata.json` feeds stage one; the rest are documentation or dead metadata.

### Treating ROUTER.md as removable on the strength of the CLI hub's duplication alone. `router-reach` reads it and fails without it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating ROUTER.md as removable on the strength of the CLI hub's duplication alone. `router-reach` reads it and fails without it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating ROUTER.md as removable on the strength of the CLI hub's duplication alone. `router-reach` reads it and fails without it.

### Treating the four standalone routers as interchangeable. Their scoring implementations differ; only `sk-git` handles word boundaries. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the four standalone routers as interchangeable. Their scoring implementations differ; only `sk-git` handles word boundaries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the four standalone routers as interchangeable. Their scoring implementations differ; only `sk-git` handles word boundaries.

### Treating the Hermes mirror as a text copy of routing prose that can be hand-edited. It is generated and `--check` enforces it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the Hermes mirror as a text copy of routing prose that can be hand-edited. It is generated and `--check` enforces it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the Hermes mirror as a text copy of routing prose that can be hand-edited. It is generated and `--check` enforces it.

### Treating the hypothesis report as confirmed wholesale. Its hub and standalone conclusions hold; its "remove the per-packet loading tables" needs the correction in finding 2. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the hypothesis report as confirmed wholesale. Its hub and standalone conclusions hold; its "remove the per-packet loading tables" needs the correction in finding 2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the hypothesis report as confirmed wholesale. Its hub and standalone conclusions hold; its "remove the per-packet loading tables" needs the correction in finding 2.

### Treating the mcp hub as a copy of the CLI hub. Its stage-two contract is consistent with its packets, so the CLI drift is a packet-level defect, not a universal hub defect. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the mcp hub as a copy of the CLI hub. Its stage-two contract is consistent with its packets, so the CLI drift is a packet-level defect, not a universal hub defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the mcp hub as a copy of the CLI hub. Its stage-two contract is consistent with its packets, so the CLI drift is a packet-level defect, not a universal hub defect.

### Treating the mode packets' `INTENT_SIGNALS` as a duplicate of the hub's. They encode a different decision (task intent inside one executor), so the duplicate is the leaf mapping, not the intent names. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the mode packets' `INTENT_SIGNALS` as a duplicate of the hub's. They encode a different decision (task intent inside one executor), so the duplicate is the leaf mapping, not the intent names.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the mode packets' `INTENT_SIGNALS` as a duplicate of the hub's. They encode a different decision (task intent inside one executor), so the duplicate is the leaf mapping, not the intent names.

### Trying to express stage-two leaf choice in today's JSON without a script. The compiled router emits packets, not leaves (prior report), and no leaf resolver exists for hub routes. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Trying to express stage-two leaf choice in today's JSON without a script. The compiled router emits packets, not leaves (prior report), and no leaf resolver exists for hub routes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Trying to express stage-two leaf choice in today's JSON without a script. The compiled router emits packets, not leaves (prior report), and no leaf resolver exists for hub routes.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Counting "keyword triggers" lines as a routing decision: the CLI packets have none; their triggers live in the `<!-- Keywords: -->` comment, which no parser in this iteration was found to read. (iteration 1)
- Treating `benchmark/reports/**` as live enforcement. The reports are frozen archives from an older worktree and the harness is retired (`benchmark/README.md:20`), so they are evidence of past behaviour only. (iteration 1)
- Treating the mode packets' `INTENT_SIGNALS` as a duplicate of the hub's. They encode a different decision (task intent inside one executor), so the duplicate is the leaf mapping, not the intent names. (iteration 1)
- Searching the mcp packets for a per-mode `ROUTER.md`: none exists. Every packet routes from its own SKILL.md block. (iteration 2)
- Treating `DEFAULT_RESOURCE = []` and `DEFAULT_RESOURCE = "references/x.md"` as a contradiction. Both declare fallback-only semantics; the difference is representation. (iteration 2)
- Treating the mcp hub as a copy of the CLI hub. Its stage-two contract is consistent with its packets, so the CLI drift is a packet-level defect, not a universal hub defect. (iteration 2)
- A per-mode `ROUTER.md` for standalone skills. Class S forbids the hub files outright, so the option is not available, not merely inadvisable. (iteration 3)
- Looking for `description.json` in the standalone roots: the contract forbids it, and none exists. (iteration 3)
- Treating the four standalone routers as interchangeable. Their scoring implementations differ; only `sk-git` handles word boundaries. (iteration 3)
- Counting `.hermes/skills` against `find .skilled/skills -name SKILL.md` without excluding `node_modules`: the three extra hits are Playwright's bundled skills, correctly not mirrored. (iteration 4)
- Treating all five phrase lists as live routing sources. Only `graph-metadata.json` feeds stage one; the rest are documentation or dead metadata. (iteration 4)
- Treating ROUTER.md as removable on the strength of the CLI hub's duplication alone. `router-reach` reads it and fails without it. (iteration 4)
- Treating the Hermes mirror as a text copy of routing prose that can be hand-edited. It is generated and `--check` enforces it. (iteration 4)
- A per-mode `ROUTER.md` for any class. Class S forbids the hub files; Class H's router is hub-root only; no packet carries one. (iteration 5)
- Deleting the packet task-intent maps. They answer a different question from the hub's executor map. (iteration 5)
- Pure JSON-only routing for hubs. `router-reach` reads `ROUTER.md` as stage-two vocabulary. (iteration 5)
- Treating the hypothesis report as confirmed wholesale. Its hub and standalone conclusions hold; its "remove the per-packet loading tables" needs the correction in finding 2. (iteration 5)
- Trying to express stage-two leaf choice in today's JSON without a script. The compiled router emits packets, not leaves (prior report), and no leaf resolver exists for hub routes. (iteration 5)

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
- Per skill routing inventory and drift (question 1) still needs `system-skill-advisor` and `system-spec-kit`. (iteration 3)
- Enforcement surfaces and what a change breaks (question 2) still needs the command, agent, mirror and generator layer. (iteration 3)
- Hub and mode-packet verdicts (question 3), readability synthesis (question 4) and the plan (question 5) remain. (iteration 3)
- Question 1 still needs the readability synthesis across all assigned skills, though its inventory half is now complete. (iteration 4)
- Question 2 needs the explicit "what each option breaks" mapping. (iteration 4)
- Question 3 needs the hub and mode-packet verdicts. (iteration 4)
- Questions 4 and 5 remain open. (iteration 4)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

The lead steer (`steer.md` in this lineage directory) splits the work from a sibling lineage that owns `sk-code`, `sk-doc`, `sk-design`, `system-deep-loop` and the parent-skill/router-sync/replay/compiled-route/package_skill tooling.

### Bounded Context Snapshot

- Source pointers: `.skilled/skills/<skill>/SKILL.md`, `.skilled/skills/<hub>/ROUTER.md`, `.skilled/skills/<hub>/<mode>/SKILL.md`, `.skilled/skills/system-skill-advisor/graph-metadata.json`, `.skilled/commands/`, `.skilled/agents/`, `.hermes/skills/`, `.claude/`, `.opencode/`, `.codex/`.
- Reuse candidates: `system-spec-kit/references/cli/shared-smart-router.md`, `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-smart-router.md`.
- Integration points: advisor lookup (`system-skill-advisor`), hub router tables, per-mode SMART ROUTING sections, command and agent dispatch docs, runtime mirror copies.
- Constraints and risks: mirrors are generated copies, so editing a mirror is not editing the source; generated copies may lag the canonical file.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only; stop policy is max-iterations)
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2026-10-28T06:26:11Z
