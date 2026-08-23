---
title: Deep Research Strategy
description: Meta Bind plugin reference-docs optimization research
---

# Deep Research Strategy - Meta Bind Plugin Docs

## 1. OVERVIEW

Research session to optimize the mcp-obsidian Meta Bind file-layer reference docs for AI operation.

## 2. TOPIC
Optimize the mcp-obsidian meta-bind file-layer reference docs for AI operation. Research the real plugin (repo mProjectsCode/obsidian-meta-bind-plugin, id obsidian-meta-bind-plugin, docs, and the installed main.js) to resolve the two VERIFY-flagged unknowns behind the Notion-style task-timer buttons: (1) the exact expression grammar for writing a now()-style timestamp into frontmatter from a button, and (2) the precise signature and options of the js inline-button action (script path resolution, arguments, and coupling to the JS Engine plugin). Confirm input-field and button-block syntax and identify missing workflows and gotchas.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] How does the js action couple with JS Engine's API surface (engine.setMetadata, engine.getMetadata)?
- [ ] What workflows and gotchas are missing from the current reference docs?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Editing the shipped mcp-obsidian reference docs
- Implementing any plugin modifications
- Researching plugins other than Meta Bind
- Reproducing the full plugin documentation

## 5. STOP CONDITIONS

1. All five key questions answered with confidence
2. Convergence threshold reached (newInfoRatio < 0.05)
3. Max iterations (4) reached

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Attempted to fetch example vault `Button.md` — 404; example vault structure differs from expected path -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Attempted to fetch example vault `Button.md` — 404; example vault structure differs from expected path
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Attempted to fetch example vault `Button.md` — 404; example vault structure differs from expected path

### Attempted to fetch plugin docs from GitHub `docs/` folder — 404; docs are hosted externally at `moritzjung.dev/obsidian-meta-bind-plugin-docs` -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Attempted to fetch plugin docs from GitHub `docs/` folder — 404; docs are hosted externally at `moritzjung.dev/obsidian-meta-bind-plugin-docs`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Attempted to fetch plugin docs from GitHub `docs/` folder — 404; docs are hosted externally at `moritzjung.dev/obsidian-meta-bind-plugin-docs`

### Direct GitHub docs path (`/docs/Button Actions.md`, `/docs/Expressions.md`) — the plugin repo does not ship docs in a flat `docs/` folder; they are a separate documentation site -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Direct GitHub docs path (`/docs/Button Actions.md`, `/docs/Expressions.md`) — the plugin repo does not ship docs in a flat `docs/` folder; they are a separate documentation site
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Direct GitHub docs path (`/docs/Button Actions.md`, `/docs/Expressions.md`) — the plugin repo does not ship docs in a flat `docs/` folder; they are a separate documentation site

### Example vault direct file access — the example vault exists but file paths differ from expected -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Example vault direct file access — the example vault exists but file paths differ from expected
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Example vault direct file access — the example vault exists but file paths differ from expected

### The `=now()` prefix pattern from the reference docs is ruled out as incorrect for Meta Bind; it's a Dataview convention -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The `=now()` prefix pattern from the reference docs is ruled out as incorrect for Meta Bind; it's a Dataview convention
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `=now()` prefix pattern from the reference docs is ruled out as incorrect for Meta Bind; it's a Dataview convention

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Attempted to fetch example vault `Button.md` — 404; example vault structure differs from expected path (iteration 1)
- Attempted to fetch plugin docs from GitHub `docs/` folder — 404; docs are hosted externally at `moritzjung.dev/obsidian-meta-bind-plugin-docs` (iteration 1)
- Direct GitHub docs path (`/docs/Button Actions.md`, `/docs/Expressions.md`) — the plugin repo does not ship docs in a flat `docs/` folder; they are a separate documentation site (iteration 1)
- Example vault direct file access — the example vault exists but file paths differ from expected (iteration 1)
- The `=now()` prefix pattern from the reference docs is ruled out as incorrect for Meta Bind; it's a Dataview convention (iteration 1)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Follow up on: `VIEW[{a} * {b}][math:c]` — compute and save result to bind target `c`

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- Spec folder: specs/mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/006-meta-bind
- Plugin: Meta Bind (mProjectsCode/obsidian-meta-bind-plugin)
- The plugin is installed and main.js is available
- Current mcp-obsidian reference docs are in references/plugins/meta-bind/
- HARD BOUNDARY: Do NOT edit shipped docs outside the spec folder
- Memory context: No prior context found (timeout)

## 13. RESEARCH BOUNDARIES

- Max iterations: 4
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
