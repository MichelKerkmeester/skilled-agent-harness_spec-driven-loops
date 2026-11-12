---
title: Deep Research Strategy - Command Surfacing and Workflow Enforcement
description: Runtime strategy file for the opencode-deepseek lineage researching advisor command surfacing and chat-only routing.
trigger_phrases:
  - "command surfacing strategy"
  - "deep research strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Command Surfacing and Workflow Enforcement

## 1. OVERVIEW

### Purpose

Persistent brain for the opencode-deepseek fan-out lineage. Records what to investigate, what worked, what failed, and where to focus next across 10 iterations.

### Usage

- **Init:** populated Topic, Key Questions, Known Context, and Research Boundaries from config.
- **Per iteration:** agent reads Next Focus, writes iteration evidence, and the reducer refreshes machine-owned sections.
- **Mutability:** analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer.

---

## 2. TOPIC

How should the skill advisor surface slash commands (all 45 under .skilled/commands, not only /doctor) so a model either runs the matching command workflow by itself or asks the user first, and how does a request typed as plain chat with no slash command still reach the proper command workflow on every runtime?

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which commands have no active bridge, which bridges point at retired names, and what does one drift-proof command inventory need?
- [x] Why do plain planning and research prompts return no recommendation, how does command intent compete with skill intent in fusion, and what do the no-slash penalty and mutating-command gate cost in recall versus precision?
- [x] What must the advisor render inside the 80 to 120 token brief for a model to act on a command, given that advisor_recommend has no kind or runnable field?
- [x] Which commands are safe to start without asking, which need a question first, judged by what they write and what they can undo, and where should that run-or-ask policy live?
- [x] Can a model start a slash command itself on Claude Code, OpenCode, Codex, Pi, Cursor, Devin and DSH, and what is the fallback where it cannot?
- [x] Which mechanism brings a request typed as plain chat onto the command workflow, and what is the evidence that workflows are hand-rolled today?
- [x] Which commands never load the mode SKILL.md their metadata names, which skills have no command front door, and should a skill recommendation imply its command?
- [x] Which benchmark and fixture rows are needed for every command group and for chat-style prompts, and which metrics separate a missed command from a wrongly started one?
- [x] How do other agent harnesses route a free-text request to a packaged workflow, from their public documentation?
- [x] Which failure modes matter most: over-triggering, command-versus-skill ambiguity, a dispatched child session starting commands by itself, loops, and the brief budget?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any advisor, hook, command or AGENTS.md change; this packet ends at research.
- Re-scoring skills against each other; that belongs to sibling packets.
- Repairing the Pi extension loading failure.

---

## 5. STOP CONDITIONS
- 10 iterations reached (stopPolicy: max-iterations).
- State corruption or a refused append gateway record (halt with error status).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which commands have no active bridge, which bridges point at retired names, and what does one drift-proof command inventory need?
- Why do plain planning and research prompts return no recommendation, how does command intent compete with skill intent in fusion, and what do the no-slash penalty and mutating-command gate cost in recall versus precision?
- What must the advisor render inside the 80 to 120 token brief for a model to act on a command, given that advisor_recommend has no kind or runnable field?
- Which commands are safe to start without asking, which need a question first, judged by what they write and what they can undo, and where should that run-or-ask policy live?
- Can a model start a slash command itself on Claude Code, OpenCode, Codex, Pi, Cursor, Devin and DSH, and what is the fallback where it cannot?
- Which mechanism brings a request typed as plain chat onto the command workflow, and what is the evidence that workflows are hand-rolled today?
- Which commands never load the mode SKILL.md their metadata names, which skills have no command front door, and should a skill recommendation imply its command?
- Which benchmark and fixture rows are needed for every command group and for chat-style prompts, and which metrics separate a missed command from a wrongly started one?
- How do other agent harnesses route a free-text request to a packaged workflow, from their public documentation?
- Which failure modes matter most: over-triggering, command-versus-skill ambiguity, a dispatched child session starting commands by itself, loops, and the brief budget?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- comparing the generated projection against the live tree exposed both missing commands and retired aliases in one pass, because the projection carries `enabled` flags that the source files do not. (iteration 1)
- rerunning the same prompt at a lowered threshold exposed the full candidate field, which turned an empty result into measurable evidence about which skill almost won. (iteration 2)
- producing the real brief text for paired doctor and non-doctor commands made the difference visible in one line; the renderer's branches alone would not have shown that the planning brief says `command-spec-kit`. (iteration 3)
- the doctor manifest supplied an existing three-class vocabulary, so the recommendation could extend a proven model instead of inventing one. (iteration 4)
- counting the mirrors and reading the command tree's own invocation sentence turned a capability question into a structural one; if no runtime exposes a command tool, the fallback must be file-based. (iteration 5)
- the mode registries turned a design debate into a data question; the command already exists beside every mode, so the missing piece is exposure and a rule, not a new inventory. (iteration 6)
- reading the router's actual load list instead of the metadata choreography exposed the gap in one comparison; the metadata describes an intent the executable path does not implement. (iteration 7)
- reading the corpus buckets against the six command groups showed the gap as a set difference, which made the fixture requirement concrete. (iteration 8)
- the Claude and Codex docs independently show the same convergence on model-invocable skills, which makes the repository's skill-plus-command duopoly look like a transition state rather than a novel design. (iteration 9)
- combining the measured `/speckit:plan` ambiguity with the child-dispatch exemption exposed a policy hole that neither the scoring nor the run-or-ask angle saw alone. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- counting bridge entries without deduplicating by command overstates coverage; the doctor family fans one command into many routes. (iteration 1)
- the first attempt put `confidenceThreshold` at the top level, which the strict input schema rejected; the schema nests it under `options`. (iteration 2)
- the first call passed the prompt inside the options object, which returned no result; the function signature takes the prompt as its first argument. (iteration 3)
- searching command metadata for a safety field found nothing, which is itself the finding. (iteration 4)
- an initial `.devin` file count was inflated by nested skill content; the directory listing, not the count, established that Devin has no command surface. (iteration 5)
- looking for a runner refusal as enforcement failed because the refusal is prose that loads after the routing decision. (iteration 6)
- a first path check resolved alias names as folder names and reported every mode file missing; the real folders use the packet names, and rechecking with those paths showed all files exist. (iteration 7)
- searching for command metrics in the release schema returned only skill-level fields, which is itself the finding. (iteration 8)
- searching for a harness that routes free text through a prompt-time brief found none, so the repository's advisor-brief approach is the local exception. (iteration 9)
- searching for a routing-loop guard found only the advisor self-penalty; the loop risk is emergent from Gate 2 and command writes, not a named control. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "Give the model the slash string and it will invoke it": the command docs are user-invoked, no tool schema exposes a slash command, and no model-facing rule instructs typing one. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "Give the model the slash string and it will invoke it": the command docs are user-invoked, no tool schema exposes a slash command, and no model-facing rule instructs typing one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Give the model the slash string and it will invoke it": the command docs are user-invoked, no tool schema exposes a slash command, and no model-facing rule instructs typing one.

### A blanket command-first tiebreak: it would override a better-calibrated skill in the measured `/speckit:plan` case. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A blanket command-first tiebreak: it would override a better-calibrated skill in the measured `/speckit:plan` case.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A blanket command-first tiebreak: it would override a better-calibrated skill in the measured `/speckit:plan` case.

### A brief-only mechanism: no reviewed harness uses a prompt-time brief as the primary route to a packaged workflow; all use model-invocable packages with persistent instructions. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A brief-only mechanism: no reviewed harness uses a prompt-time brief as the primary route to a packaged workflow; all use model-invocable packages with persistent instructions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A brief-only mechanism: no reviewed harness uses a prompt-time brief as the primary route to a packaged workflow; all use model-invocable packages with persistent instructions.

### A hook-only mechanism: the hook is advisory and cannot dispatch a command. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A hook-only mechanism: the hook is advisory and cannot dispatch a command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A hook-only mechanism: the hook is advisory and cannot dispatch a command.

### A runner-refusal-only mechanism: the refusal text loads too late to prevent the hand-roll. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A runner-refusal-only mechanism: the refusal text loads too late to prevent the hand-roll.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A runner-refusal-only mechanism: the refusal text loads too late to prevent the hand-roll.

### A static command list in `AGENTS.md`: 45 entries with modes and arguments would drift and consume the rule budget. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A static command list in `AGENTS.md`: 45 entries with modes and arguments would drift and consume the rule budget.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A static command list in `AGENTS.md`: 45 entries with modes and arguments would drift and consume the rule budget.

### A universal "ask first" rule: it contradicts `:auto` and would add a question before every read-only doctor or review command. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A universal "ask first" rule: it contradicts `:auto` and would add a question before every read-only doctor or review command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A universal "ask first" rule: it contradicts `:auto` and would add a question before every read-only doctor or review command.

### Adding command rows to the calibration corpus: it would invalidate the corpus hash and the Brier/ECE baseline. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Adding command rows to the calibration corpus: it would invalidate the corpus hash and the Brier/ECE baseline.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding command rows to the calibration corpus: it would invalidate the corpus hash and the Brier/ECE baseline.

### Copying Claude Code's frontmatter directly as the repository mechanism: only one of seven runtimes reads it. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Copying Claude Code's frontmatter directly as the repository mechanism: only one of seven runtimes reads it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Copying Claude Code's frontmatter directly as the repository mechanism: only one of seven runtimes reads it.

### Counting `command-bridges.generated.json` entries as "commands": the 62 entries are routes and compatibility aliases, not a command list, and three of them name non-live spellings. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Counting `command-bridges.generated.json` entries as "commands": the 62 entries are routes and compatibility aliases, not a command list, and three of them name non-live spellings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting `command-bridges.generated.json` entries as "commands": the 62 entries are routes and compatibility aliases, not a command list, and three of them name non-live spellings.

### Hoping `workflowMode` fills the gap: it is optional in the schema and absent from the measured `/speckit:plan` output, so it cannot be relied on as the runnable command. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Hoping `workflowMode` fills the gap: it is optional in the schema and absent from the measured `/speckit:plan` output, so it cannot be relied on as the runnable command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hoping `workflowMode` fills the gap: it is optional in the schema and absent from the measured `/speckit:plan` output, so it cannot be relied on as the runnable command.

### Implying a command for every skill: nine skills have no command, so the implication would invent routes. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Implying a command for every skill: nine skills have no command, so the implication would invent routes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Implying a command for every skill: nine skills have no command, so the implication would invent routes.

### Letting a child inherit the full run-or-ask policy: the child exemption removes the ask path, so mutating commands need a parent-authority rule. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Letting a child inherit the full run-or-ask policy: the child exemption removes the ask path, so mutating commands need a parent-authority rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Letting a child inherit the full run-or-ask policy: the child exemption removes the ask path, so mutating commands need a parent-authority rule.

### Looking for a Codex custom-prompt path that survives deprecation: the documented replacement is skills plus `AGENTS.md`. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Looking for a Codex custom-prompt path that survives deprecation: the documented replacement is skills plus `AGENTS.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a Codex custom-prompt path that survives deprecation: the documented replacement is skills plus `AGENTS.md`.

### Looking for a command-level metric in the release-gate schema: only skill-level fields exist. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Looking for a command-level metric in the release-gate schema: only skill-level fields exist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a command-level metric in the release-gate schema: only skill-level fields exist.

### Looking for a general command loop guard in the advisor: only the self-recommendation penalty and directive dedup exist, and neither is a routing-loop guard. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Looking for a general command loop guard in the advisor: only the self-recommendation penalty and directive dedup exist, and neither is a routing-loop guard.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a general command loop guard in the advisor: only the self-recommendation penalty and directive dedup exist, and neither is a routing-loop guard.

### Looking for a safety class in `userIntent` or `choreography`: those fields describe intent and load order, not writes. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for a safety class in `userIntent` or `choreography`: those fields describe intent and load order, not writes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a safety class in `userIntent` or `choreography`: those fields describe intent and load order, not writes.

### Lowering the confidence threshold alone as the fix: at 0.0 the planning prompt surfaces `sk-doc`, `sk-code`, and `system-spec-kit`, not a command, so lowering the bar amplifies wrong-skill routing rather than command recall. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Lowering the confidence threshold alone as the fix: at 0.0 the planning prompt surfaces `sk-doc`, `sk-code`, and `system-spec-kit`, not a command, so lowering the bar amplifies wrong-skill routing rather than command recall.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lowering the confidence threshold alone as the fix: at 0.0 the planning prompt surfaces `sk-doc`, `sk-code`, and `system-spec-kit`, not a command, so lowering the bar amplifies wrong-skill routing rather than command recall.

### Raising the token cap as the fix: the current omission is a data-contract gap, and the measured briefs fit comfortably inside the existing cap. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Raising the token cap as the fix: the current omission is a data-contract gap, and the measured briefs fit comfortably inside the existing cap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Raising the token cap as the fix: the current omission is a data-contract gap, and the measured briefs fit comfortably inside the existing cap.

### Reading the doctor route manifest alone cannot explain non-doctor coverage; the route manifest only governs 17 of 45 commands. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading the doctor route manifest alone cannot explain non-doctor coverage; the route manifest only governs 17 of 45 commands.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the doctor route manifest alone cannot explain non-doctor coverage; the route manifest only governs 17 of 45 commands.

### Relying on directive dedup as the loop guard: it suppresses repeated briefs, not repeated routing. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Relying on directive dedup as the loop guard: it suppresses repeated briefs, not repeated routing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Relying on directive dedup as the loop guard: it suppresses repeated briefs, not repeated routing.

### Reusing the `readOnlyRouteAllowed` boolean as the whole policy: it has no ask state and no write root, so it can only suppress a recommendation, not tell the model what to do next. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Reusing the `readOnlyRouteAllowed` boolean as the whole policy: it has no ask state and no write root, so it can only suppress a recommendation, not tell the model what to do next.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing the `readOnlyRouteAllowed` boolean as the whole policy: it has no ask state and no write root, so it can only suppress a recommendation, not tell the model what to do next.

### Reusing the doctor map shape without a source: the map is generated from the doctor route manifest; a universal map needs an authoritative command manifest rather than a hand-written table. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reusing the doctor map shape without a source: the map is generated from the doctor route manifest; a universal map needs an authoritative command manifest rather than a hand-written table.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing the doctor map shape without a source: the map is generated from the doctor route manifest; a universal map needs an authoritative command manifest rather than a hand-written table.

### Reusing the skill accuracy gate as the command gate: it has no command class, so a command miss is scored the same as a skill miss. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Reusing the skill accuracy gate as the command gate: it has no command class, so a command miss is scored the same as a skill miss.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing the skill accuracy gate as the command gate: it has no command class, so a command miss is scored the same as a skill miss.

### Searching for a dedicated "command intent" lane: no such lane exists; commands are projected into the same five lanes as skills. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searching for a dedicated "command intent" lane: no such lane exists; commands are projected into the same five lanes as skills.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a dedicated "command intent" lane: no such lane exists; commands are projected into the same five lanes as skills.

### Searching for a model-invocable command mechanism in the hook adapters: they inject context or notices, and none can dispatch a command. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Searching for a model-invocable command mechanism in the hook adapters: they inject context or notices, and none can dispatch a command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a model-invocable command mechanism in the hook adapters: they inject context or notices, and none can dispatch a command.

### Searching for a shared command-to-skill dispatcher: the linkage is declarative metadata plus per-command routers, with no central loader. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Searching for a shared command-to-skill dispatcher: the linkage is declarative metadata plus per-command routers, with no central loader.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a shared command-to-skill dispatcher: the linkage is declarative metadata plus per-command routers, with no central loader.

### Searching the ruleset for an existing anti-hand-rolling discovery rule: only the substitution prohibition exists, and it presumes the workflow is named. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Searching the ruleset for an existing anti-hand-rolling discovery rule: only the substitution prohibition exists, and it presumes the workflow is named.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching the ruleset for an existing anti-hand-rolling discovery rule: only the substitution prohibition exists, and it presumes the workflow is named.

### Treating Devin as a delivery exception: it receives the brief and can load and follow a command doc; it simply has no slash surface for the user. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating Devin as a delivery exception: it receives the brief and can load and follow a command doc; it simply has no slash surface for the user.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Devin as a delivery exception: it receives the brief and can load and follow a command doc; it simply has no slash surface for the user.

### Treating metadata choreography as an enforced load: neither the command routers nor the workflow YAML read the mode `SKILL.md`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating metadata choreography as an enforced load: neither the command routers nor the workflow YAML read the mode `SKILL.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating metadata choreography as an enforced load: neither the command routers nor the workflow YAML read the mode `SKILL.md`.

### Treating the allow-list as a complete fallback: it covers 8 commands, misses 4 live `/speckit:*`/`/prompt:improve` commands, and adds 3 retired aliases. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the allow-list as a complete fallback: it covers 8 commands, misses 4 live `/speckit:*`/`/prompt:improve` commands, and adds 3 retired aliases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the allow-list as a complete fallback: it covers 8 commands, misses 4 live `/speckit:*`/`/prompt:improve` commands, and adds 3 retired aliases.

### Treating the no-slash penalty as the cause of zero recommendations: it only reorders candidates that already pass; the zero result is caused by the 0.8 confidence floor and missing command descriptors. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the no-slash penalty as the cause of zero recommendations: it only reorders candidates that already pass; the zero result is caused by the 0.8 confidence floor and missing command descriptors.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the no-slash penalty as the cause of zero recommendations: it only reorders candidates that already pass; the zero result is caused by the 0.8 confidence floor and missing command descriptors.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Counting `command-bridges.generated.json` entries as "commands": the 62 entries are routes and compatibility aliases, not a command list, and three of them name non-live spellings. (iteration 1)
- Reading the doctor route manifest alone cannot explain non-doctor coverage; the route manifest only governs 17 of 45 commands. (iteration 1)
- Treating the allow-list as a complete fallback: it covers 8 commands, misses 4 live `/speckit:*`/`/prompt:improve` commands, and adds 3 retired aliases. (iteration 1)
- Lowering the confidence threshold alone as the fix: at 0.0 the planning prompt surfaces `sk-doc`, `sk-code`, and `system-spec-kit`, not a command, so lowering the bar amplifies wrong-skill routing rather than command recall. (iteration 2)
- Searching for a dedicated "command intent" lane: no such lane exists; commands are projected into the same five lanes as skills. (iteration 2)
- Treating the no-slash penalty as the cause of zero recommendations: it only reorders candidates that already pass; the zero result is caused by the 0.8 confidence floor and missing command descriptors. (iteration 2)
- Hoping `workflowMode` fills the gap: it is optional in the schema and absent from the measured `/speckit:plan` output, so it cannot be relied on as the runnable command. (iteration 3)
- Raising the token cap as the fix: the current omission is a data-contract gap, and the measured briefs fit comfortably inside the existing cap. (iteration 3)
- Reusing the doctor map shape without a source: the map is generated from the doctor route manifest; a universal map needs an authoritative command manifest rather than a hand-written table. (iteration 3)
- A universal "ask first" rule: it contradicts `:auto` and would add a question before every read-only doctor or review command. (iteration 4)
- Looking for a safety class in `userIntent` or `choreography`: those fields describe intent and load order, not writes. (iteration 4)
- Reusing the `readOnlyRouteAllowed` boolean as the whole policy: it has no ask state and no write root, so it can only suppress a recommendation, not tell the model what to do next. (iteration 4)
- "Give the model the slash string and it will invoke it": the command docs are user-invoked, no tool schema exposes a slash command, and no model-facing rule instructs typing one. (iteration 5)
- Searching for a model-invocable command mechanism in the hook adapters: they inject context or notices, and none can dispatch a command. (iteration 5)
- Treating Devin as a delivery exception: it receives the brief and can load and follow a command doc; it simply has no slash surface for the user. (iteration 5)
- A hook-only mechanism: the hook is advisory and cannot dispatch a command. (iteration 6)
- A runner-refusal-only mechanism: the refusal text loads too late to prevent the hand-roll. (iteration 6)
- A static command list in `AGENTS.md`: 45 entries with modes and arguments would drift and consume the rule budget. (iteration 6)
- Searching the ruleset for an existing anti-hand-rolling discovery rule: only the substitution prohibition exists, and it presumes the workflow is named. (iteration 6)
- Implying a command for every skill: nine skills have no command, so the implication would invent routes. (iteration 7)
- Searching for a shared command-to-skill dispatcher: the linkage is declarative metadata plus per-command routers, with no central loader. (iteration 7)
- Treating metadata choreography as an enforced load: neither the command routers nor the workflow YAML read the mode `SKILL.md`. (iteration 7)
- Adding command rows to the calibration corpus: it would invalidate the corpus hash and the Brier/ECE baseline. (iteration 8)
- Looking for a command-level metric in the release-gate schema: only skill-level fields exist. (iteration 8)
- Reusing the skill accuracy gate as the command gate: it has no command class, so a command miss is scored the same as a skill miss. (iteration 8)
- A brief-only mechanism: no reviewed harness uses a prompt-time brief as the primary route to a packaged workflow; all use model-invocable packages with persistent instructions. (iteration 9)
- Copying Claude Code's frontmatter directly as the repository mechanism: only one of seven runtimes reads it. (iteration 9)
- Looking for a Codex custom-prompt path that survives deprecation: the documented replacement is skills plus `AGENTS.md`. (iteration 9)
- A blanket command-first tiebreak: it would override a better-calibrated skill in the measured `/speckit:plan` case. (iteration 10)
- Letting a child inherit the full run-or-ask policy: the child exemption removes the ask path, so mutating commands need a parent-authority rule. (iteration 10)
- Looking for a general command loop guard in the advisor: only the self-recommendation penalty and directive dedup exist, and neither is a routing-loop guard. (iteration 10)
- Relying on directive dedup as the loop guard: it suppresses repeated briefs, not repeated routing. (iteration 10)

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

### Prior work
- Sibling packet `specs/system-skill-advisor/routing-and-scoring/003-doctor-command-surfacing/` covers doctor-command surfacing.
- Sibling packet `specs/system-spec-kit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/` covers cold-read plan review.
- Advisor runtime: `.skilled/skills/system-skill-advisor/` (command-bridges, scorer projection and fusion, render.ts).
- Behavioral gates: `AGENTS.md` Gates 2 and 4.

### Bounded Context Snapshot
- Source pointers: `.skilled/skills/system-skill-advisor/`, `.skilled/commands/`, `.skilled/bin/skill-advisor.cjs`.
- Reuse candidates: existing command metadata and bridge allow-list rather than a new registry.
- Constraints: no implementation in this packet; cite `path:line` for every claim.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (telemetry only; stopPolicy max-iterations)
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Started: 2026-11-12T09:36:50Z
