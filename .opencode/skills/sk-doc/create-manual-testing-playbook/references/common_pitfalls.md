---
title: Manual Testing Playbook Common Pitfalls
description: The recurring defects that degrade manual testing playbook packages - split package truth, snippets subtrees, unsynced prompts, broken catalog links, bare prompts, and overloaded root summaries - each with the correct fix.
trigger_phrases:
  - "playbook common pitfalls"
  - "manual testing playbook mistakes"
  - "playbook review protocol split"
  - "unsynced prompt fields fix"
  - "overloaded root summary"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Manual Testing Playbook Common Pitfalls

The recurring defects that degrade a manual testing playbook package, why each one breaks the package, and the correct fix. Use this when reviewing a drafted playbook.

---

## 1. OVERVIEW

Most playbook defects come from splitting package truth across sidecar files, desynchronizing prompt fields, or overloading the root summary with execution detail that belongs in the per-feature file. Each row below pairs the mistake with why it breaks the package and the correct fix.

**Core Principle**: One canonical truth per scenario - shared policy in the root, execution truth in the per-feature file, and nothing duplicated between them.

---

## 2. COMMON PITFALLS

| Mistake | Why It Breaks | Correct Fix |
|---|---|---|
| Keeping separate canonical `review_protocol.md` or `subagent_utilization_ledger.md` files | Splits package truth across sidecar docs | Fold shared review/orchestration rules into the root playbook |
| Using a `snippets/` subtree | No longer matches the current package contract | Put per-feature files in root-level category folders |
| Unsynced prompt fields | Operators do not know which prompt is canonical | Update `SCENARIO CONTRACT`, the table prompt, and the root summary together |
| Broken feature-catalog links | Scenario traceability is lost | Link each scenario to its catalog entry or clearly document the exception |
| Bare command paraphrase prompts | Fails realistic orchestrator-led testing | Rewrite prompts around user intent, evidence, and verdict |
| Overloading root summaries with full execution detail | Root doc becomes noisy and hard to review | Keep full execution truth in the per-feature file |

---

## 3. RELATED RESOURCES

- [../SKILL.md](../SKILL.md) - § Rules carries the ALWAYS/NEVER/ESCALATE contract these pitfalls map to
- [README.md](README.md) - Reference map for all overflow detail
- [prompt_voice.md](prompt_voice.md) - The natural-human vs RCAF decision behind the prompt-sync fix
