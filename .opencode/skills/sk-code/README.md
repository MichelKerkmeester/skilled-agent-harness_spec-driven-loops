---
title: sk-code
description: The single advisor-routable code skill: a two-axis hub that routes to five workflow modes (implement, quality, debug, verify, review) and bundles three read-only surface evidence packets (webflow, opencode, animation).
trigger_phrases:
  - "code skill"
  - "code mode router"
  - "sk-code hub"
version: 4.1.0.0
---

# sk-code

> Route code work to focused implement, quality, debug, verify, and review modes over one shared surface-detection router.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Code-family work: implementation, quality, debugging, verification, and findings-first review. |
| **Invoke with** | `Skill(sk-code)` plus an optional mode hint such as `verify:` or `review:`. |
| **Works on** | The shared surface-detection router for WEBFLOW, OPENCODE, and MOTION_DEV context. |
| **Produces** | A routed mode packet with the right code-work contract and tool surface. |

---

## 2. OVERVIEW

### Why This Skill Exists

Code work needs distinct contracts for implementation, quality, debugging, verification, and review, but those contracts still share the same surface identity rules. sk-code keeps one advisor identity, centralizes surface detection once, and routes each kind of code work to a focused mode packet.

### What It Does

`Skill(sk-code)` loads the hub, and the hub routes the request to one of five modes through `mode-registry.json`. Each mode holds its own code-work contract and the hub itself is routing-only. The mode packets carry no `graph-metadata.json`, so the advisor discovers exactly one code skill.

---

## 3. HOW IT WORKS

A code request resolves through the hub to exactly one primary mode. A request that spans modes stays at the hub for ordered routing or disambiguation. The five modes:

| Mode | Owns |
|---|---|
| `code-implement` | Research, implementation, WEBFLOW/OPENCODE authoring, and Motion.dev overlay consumption. |
| `code-quality` | Author-side quality gates, comment hygiene, and surface checklists. |
| `code-debug` | Root-cause debugging, error recovery, and escalation discipline. |
| `code-verify` | Verification evidence, Iron Law checks, and mutation/falsifier ritual. |
| `review` | Findings-first review, security/correctness baseline, and review output cache. |

Alongside the primary workflow mode, the hub bundles zero-or-more **surface evidence packets** (read-only, advisor-invisible): `webflow/` (frontend), `opencode/` (system code), `animation/` (Motion.dev overlay). "review my webflow animation for jank" resolves to `[review, webflow, animation]`.

### One advisor identity

The mode packets and `shared/` carry no `graph-metadata.json` of their own. The hub root keeps the single graph identity for the whole family. `mode-registry.json` is the routing source of truth, and `hub-router.json` preserves the vocabulary that helps code prompts resolve to the right mode.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for sk-code when the task is code work and the next step is implementation, author-side quality, debugging, verification, or review. The shared router keeps WEBFLOW, OPENCODE, and MOTION_DEV surface identity consistent across all five modes.

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
| [`shared/README.md`](./shared/README.md) | Placeholder for shared surface detection and cross-mode helpers. |
| [`code-implement/SKILL.md`](./code-implement/SKILL.md) | Implement mode skeleton. |
