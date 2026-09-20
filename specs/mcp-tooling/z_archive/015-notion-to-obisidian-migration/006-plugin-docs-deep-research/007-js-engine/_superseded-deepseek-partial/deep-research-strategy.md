---
title: Deep Research Strategy - JS Engine plugin docs optimization
description: Research session to confirm JS Engine plugin API surface and recommend mcp-obsidian doc updates
trigger_phrases:
  - "JS Engine research strategy"
  - "js-engine plugin API"
  - "Meta Bind js action"
  - "engine.markdown builder"
  - "engine.importJs"
  - "task-timer frontmatter"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - JS Engine Plugin Reference Docs

## 1. OVERVIEW

Research the real JS Engine plugin (mProjectsCode/obsidian-js-engine-plugin) to confirm the API surface exposed to scripts, the execution context object, and how scripts interact with frontmatter. Output recommendations for mcp-obsidian docs updates.

## 2. TOPIC

Optimize the mcp-obsidian docs for the JS Engine plugin — confirm the engine API surface (engine.markdown builder, engine.importJs, metadata access), the execution context (ctx/component/container/app) passed into a js action or js-engine code block, and how a script reads/writes note frontmatter (timestamp the task-timer records). Recommend concrete additions or updates to references/plugins/meta-bind/ or a dedicated references/plugins/js-engine/ tree.

## 3. KEY QUESTIONS (remaining)

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] What is the full `engine.*` API surface exposed to JS Engine scripts (engine.markdown, engine.importJs, metadata access, etc.)?
- [ ] What execution context object (ctx/component/container/app) is passed into a Meta Bind `js` action or a `js-engine` code block?
- [ ] How does a JS Engine script read and write note frontmatter (e.g., frontmatter timestamps)?
- [ ] What are the error handling and return conventions for JS Engine scripts?
- [ ] What gaps exist in the current mcp-obsidian references/plugins/meta-bind/ docs, and should a dedicated references/plugins/js-engine/ tree be created?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do NOT edit shipped mcp-obsidian docs under references/plugins/
- Do NOT implement any code changes
- Do NOT write task-timer scripts

## 5. STOP CONDITIONS

- All 5 key questions answered with evidence
- 4 iterations completed (max)

## 6. ANSWERED QUESTIONS

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->

## 7. WHAT WORKED

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

## 8. WHAT FAILED

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

## 9. EXHAUSTED APPROACHES (do not retry)

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **GitHub source code deep-dive**: The API docs are generated from the TypeScript source and are sufficient for the API surface investigation. Source-level analysis of `Engine.ts`, `JsExecution.ts`, etc. would add implementation details but the public API is well-documented. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **GitHub source code deep-dive**: The API docs are generated from the TypeScript source and are sufficient for the API surface investigation. Source-level analysis of `Engine.ts`, `JsExecution.ts`, etc. would add implementation details but the public API is well-documented.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **GitHub source code deep-dive**: The API docs are generated from the TypeScript source and are sufficient for the API surface investigation. Source-level analysis of `Engine.ts`, `JsExecution.ts`, etc. would add implementation details but the public API is well-documented.

### **Installed main.js analysis**: The Obsidian vault's `.obsidian/plugins/js-engine/` directory was not found in this workspace (the vault is not part of this repo). The official API docs site (moritzjung.dev) provides authoritative TypeScript API documentation that covers the full surface, making local main.js analysis unnecessary for this iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Installed main.js analysis**: The Obsidian vault's `.obsidian/plugins/js-engine/` directory was not found in this workspace (the vault is not part of this repo). The official API docs site (moritzjung.dev) provides authoritative TypeScript API documentation that covers the full surface, making local main.js analysis unnecessary for this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Installed main.js analysis**: The Obsidian vault's `.obsidian/plugins/js-engine/` directory was not found in this workspace (the vault is not part of this repo). The official API docs site (moritzjung.dev) provides authoritative TypeScript API documentation that covers the full surface, making local main.js analysis unnecessary for this iteration.

### None yet — this is the first iteration and all approaches were productive. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None yet — this is the first iteration and all approaches were productive.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None yet — this is the first iteration and all approaches were productive.

<!-- /ANCHOR:exhausted-approaches -->

## 10. RULED OUT DIRECTIONS

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **GitHub source code deep-dive**: The API docs are generated from the TypeScript source and are sufficient for the API surface investigation. Source-level analysis of `Engine.ts`, `JsExecution.ts`, etc. would add implementation details but the public API is well-documented. (iteration 1)
- **Installed main.js analysis**: The Obsidian vault's `.obsidian/plugins/js-engine/` directory was not found in this workspace (the vault is not part of this repo). The official API docs site (moritzjung.dev) provides authoritative TypeScript API documentation that covers the full surface, making local main.js analysis unnecessary for this iteration. (iteration 1)
- None yet — this is the first iteration and all approaches were productive. (iteration 1)

<!-- /ANCHOR:ruled-out-directions -->

## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

## 11A. CARRIED-FORWARD OPEN QUESTIONS

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

## 11. NEXT FOCUS

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Follow up on: No dedicated `references/plugins/js-engine/` tree exists

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- JS Engine plugin (mProjectsCode/obsidian-js-engine-plugin) is the scripting engine behind Meta Bind's js button action and js-engine code blocks
- Meta Bind's task-timer button uses JS Engine to write frontmatter timestamps
- The mcp-obsidian docs at references/plugins/meta-bind/ document the task-timer but may lack JS Engine API detail
- A dedicated references/plugins/js-engine/ tree may be warranted
- No resource-map.md present

## 13. RESEARCH BOUNDARIES

- Max iterations: 4
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Lifecycle branches: new (this run)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Current generation: 1
- Started: 2026-08-22T15:32:42Z
