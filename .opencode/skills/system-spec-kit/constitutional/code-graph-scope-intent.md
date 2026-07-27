---
title: "Code-Graph Scope — Everything Here Is Intentional"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-05-31"
last_confirmed_source: "git-log-last-touch"
triggerPhrases:
  - code graph scope
  - includeSkills
  - includeAgents
  - index everything
  - scan cost
  - active scope
---

# Code-Graph Scope — Everything Here Is Intentional

## Rule


## Why


A fresh clone's graph is small (their code); this repo's graph is large (everything). This matters whenever reasoning about scan cost or auto-scan behavior.

## How to apply

Any auto-scan / scan-cost feature must keep the default (end-user-code-only) case cheap, and keep an explicit gate for when `.opencode` is opted in. Do not "correct" the large active scope here — it is the owner's deliberate env override.
