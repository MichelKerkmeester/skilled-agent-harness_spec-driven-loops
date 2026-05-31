---
title: "Code-Graph Scope — Everything Here Is Intentional"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  - code graph scope
  - code_graph_scan scope
  - includeSkills
  - includeAgents
  - index everything
  - scan cost
  - mk-code-index scope
  - active scope
---

# Code-Graph Scope — Everything Here Is Intentional

## Rule

In THIS repo the code-graph (`mk-code-index`) indexes the entire `.opencode` tooling tree, not just app code. Treat the "index everything" active scope as intentional, never as a misconfiguration to "fix."

## Why

- **Default (for repo cloners / end users):** index only their own app code (e.g. `/src`). The `.opencode` tooling tree (skills, agents, commands, specs, plugins) is **opt-in and OFF by default** — `code_graph_scan` defaults `includeSkills`/`includeAgents`/`includeCommands`/`includeSpecs`/`includePlugins` to `false`.
- **This repo (owner setup):** overrides the default via env (`SPECKIT_CODE_GRAPH_INDEX_*=true`) so the graph also covers `.opencode` skill/tooling code, because skill/tooling development happens here. That is why `code_graph_status` shows active scope `skills=all:agents=all:commands=all:specs=all:plugins=all`.

A fresh clone's graph is small (their code); this repo's graph is large (everything). This matters whenever reasoning about scan cost or auto-scan behavior.

## How to apply

Any auto-scan / scan-cost feature must keep the default (end-user-code-only) case cheap, and keep an explicit gate for when `.opencode` is opted in. Do not "correct" the large active scope here — it is the owner's deliberate env override.
