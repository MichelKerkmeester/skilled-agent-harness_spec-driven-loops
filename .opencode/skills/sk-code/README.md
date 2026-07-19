---
title: sk-code
description: The single advisor-routable code skill: a two-axis hub that routes to two workflow modes (quality, code-review) and bundles two read-only surface evidence packets (code-webflow, code-opencode), each carrying the implement/debug/verify workflow doctrine.
trigger_phrases:
  - "code skill"
  - "code mode router"
  - "sk-code hub"
version: 4.1.0.0
---

# sk-code

> Route code work to focused quality and code-review modes and to Webflow/OpenCode surface evidence — each surface carrying the implement → debug → verify workflow doctrine — over one shared surface-detection router.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Code-family work: implementation, quality, debugging, verification, and findings-first review. |
| **Invoke with** | `Skill(sk-code)` plus an optional mode hint such as `quality:` or `code-review:`. |
| **Works on** | The shared surface-detection router for WEBFLOW, OPENCODE, and MOTION_DEV context. |
| **Produces** | A routed mode or surface packet with the right code-work contract and tool surface. |

---

## 2. OVERVIEW

### Why This Skill Exists

Code work needs distinct contracts for quality gating and findings-first review, and it needs surface-specific evidence and workflow doctrine for implementation, debugging, and verification. Those contracts still share the same surface identity rules. sk-code keeps one advisor identity, centralizes surface detection once, and routes each kind of code work to a focused packet.

### What It Does

`Skill(sk-code)` loads the hub, and the hub routes the request through `mode-registry.json` to one of two workflow modes or bundles one of two surface evidence packets. Each mode or surface holds its own code-work contract and the hub itself is routing-only. The packets carry no `graph-metadata.json`, so the advisor discovers exactly one code skill.

---

## 3. HOW IT WORKS

A code request resolves through the hub to a primary workflow mode and/or one-or-more bundled surface packets. A request that spans intents stays at the hub for ordered routing or disambiguation.

**Workflow modes** (act):

| Mode | Owns |
|---|---|
| `code-quality` | Author-side quality gates, comment hygiene, and surface checklists. |
| `code-review` | Findings-first review, security/correctness baseline, and review output cache. |

**Surface evidence packets** (read-only, advisor-invisible — bundled alongside a workflow mode):

| Surface | Carries |
|---|---|
| `code-webflow` | Frontend evidence (CSS/HTML/JS standards, implementation and performance patterns, CDN deployment, browser debug/verify) plus the Motion.dev animation overlay. |
| `code-opencode` | System-code evidence (TypeScript/Python/shell/config standards, hooks, alignment verification, authoring checklists). |

The **implement → debug → verify** phases are not standalone modes. Their surface-agnostic doctrine lives once in `shared/references/workflow-implement.md`, `workflow-debug.md`, and `workflow-verify.md`, symlinked into each surface, so the active surface carries the full workflow. "review my webflow animation for jank" resolves to `[code-review, code-webflow]`.

### One advisor identity

The mode packets and `shared/` carry no `graph-metadata.json` of their own. The hub root keeps the single graph identity for the whole family. `mode-registry.json` is the routing source of truth, and `hub-router.json` preserves the vocabulary that helps code prompts resolve to the right mode.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for sk-code when the task is code work and the next step is implementation, author-side quality, debugging, verification, or review. The shared router keeps WEBFLOW, OPENCODE, and MOTION_DEV surface identity consistent across every mode and surface.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-design` | Designs UI direction, systems, motion, and design audits that sk-code may implement. |
| `sk-doc` | Owns markdown and documentation quality. |
| `sk-git` | Owns branches, commits, PRs, and finish workflow. |
| `system-spec-kit` | Owns spec folders, memory, continuity, and packet validation. |
| `mcp-chrome-devtools` | Provides browser evidence for frontend runtime behavior. |

---

## 5. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime hub instructions and routing rules. |
| [`mode-registry.json`](./mode-registry.json) | The mode-to-packet routing map. |
| [`hub-router.json`](./hub-router.json) | Hub-local routing vocabulary and mode signals. |
| [`shared/README.md`](./shared/README.md) | Shared surface detection, cross-mode helpers, and the implement/debug/verify workflow doctrine. |
| [`code-quality/SKILL.md`](./code-quality/SKILL.md) | Quality mode packet. |
| [`code-review/SKILL.md`](./code-review/SKILL.md) | Review mode packet. |
| [`code-webflow/SKILL.md`](./code-webflow/SKILL.md) | Webflow surface packet. |
| [`code-opencode/SKILL.md`](./code-opencode/SKILL.md) | OpenCode surface packet. |
