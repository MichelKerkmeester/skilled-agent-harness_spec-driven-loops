# Skill Graphs: A Better Brain for Our Agents

We are upgrading how OpenCode skills store and share knowledge. Right now, skills use massive, single-file documents (like `SKILL.md`). We are moving to **Skill Graphs**: small, focused markdown files connected by wikilinks.

## The Problem

Currently, an agent must read a 1,500+ line `SKILL.md` file just to answer a simple question. This creates three problems:
1. **Token Exhaustion**: Loading massive files burns through context windows.
2. **Attention Decay**: Agents lose focus when presented with a wall of text.
3. **Poor Reusability**: You cannot easily share one specific rule across multiple different skills.

## The Solution

A Skill Graph breaks that massive file into pieces. It works exactly like a wiki. 

Instead of reading everything upfront, the agent uses **progressive disclosure**:
1. It starts at a lightweight `index.md`.
2. It reads short descriptions of available topics.
3. It spots a wikilink (like `[[validation-rules]]`).
4. It uses its tools to open only the files it actually needs.

## What We Are Building

We are converting **every single OpenCode skill** to this new graph format. Here is what we are building:

### 1. Skill Nodes
These are the small, focused markdown files. Every node gets a YAML header at the top with a short description. This lets the agent understand what the file does before deciding to read the whole thing.

### 2. The Index
A single `index.md` file that maps out the domain for each skill. It groups related nodes into sections so the agent knows where to start looking.

### 3. A Link Checker
Since we are relying on wikilinks across our entire skill ecosystem, broken links will break the agent's thought process. We are writing a bash script (`check-links.sh`) to automatically scan all graphs and flag any missing files.

## Next Steps

1. Build the `check-links.sh` tool to keep the graphs safe.
2. Pilot the extraction process on `system-spec-kit`.
3. Add Skill Graph authoring docs to `workflows-documentation` (standards reference and node template).
4. Update `workflows-documentation/SKILL.md` so it teaches graph-first skill authoring.
5. Roll out the extraction process to all other skills (e.g., `workflows-code`, `mcp-code-mode`, etc.).
6. Verify the agent can navigate seamlessly between them.
