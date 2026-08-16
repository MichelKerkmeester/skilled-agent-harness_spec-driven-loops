---
title: sk-code
description: The single advisor-routable entry point for code work: one hub that routes each request to the focused quality or review mode it needs, bundles the matching surface evidence and keeps one graph identity for the whole code family.
trigger_phrases:
  - "code skill"
  - "code mode router"
  - "sk-code hub"
version: 4.2.1.0
---

# sk-code

> Code work is more than one activity. sk-code is the single entry point that routes each request to the quality or review mode it needs, with the surface evidence to back it up, under one advisor identity.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Code-family work: implementation, quality gating, debugging, verification and findings-first review |
| **Invoke with** | `Skill(sk-code)` plus an optional mode hint such as `sk-code-quality:` or `sk-code-review:` |
| **Works on** | The shared surface-detection router for WEBFLOW and OPENCODE context, plus the Motion.dev animation overlay |
| **Produces** | A routed workflow mode or bundled surface evidence packet with the matching code-work contract and tool surface |

---

## 2. OVERVIEW

### Why This Skill Exists

Code work is not one activity. Writing code needs author-side quality gates and comment hygiene. Reviewing it needs a findings-first baseline with security and correctness checks. Frontend work needs browser and performance evidence. System work needs hook and alignment verification. Each kind of code work carries its own contract, yet they all share the same surface identity rules.

Without one routing point, every contract would duplicate surface detection and a request that touches several kinds of code work would have no ordered way to resolve. sk-code exists so one advisor identity covers the whole code family: the hub centralizes surface detection once and routes each request to the focused packet that owns the work.

### What It Does

`Skill(sk-code)` loads the hub. The hub routes the request through `mode-registry.json` to one of two workflow modes; root `ROUTER.md` selects the packet leaves and declared shared controls bundled alongside it. Each mode and surface holds its own code-work contract while the hub itself stays routing-only. The packets carry no `graph-metadata.json`, so the advisor discovers exactly one code skill.

The boundary is deliberate: sk-code routes code work. Documentation quality, git workflow, spec discipline and browser evidence belong to sibling skills that sk-code hands off to.

### The Code Work Contract Grid

**Workflow modes (act):**

| Mode | Owns |
|---|---|
| `sk-code-quality` | Author-side quality gates, comment hygiene and surface checklists |
| `sk-code-review` | Findings-first review, security and correctness baseline, review output cache |

**Surface evidence packets (read-only and advisor-invisible, bundled alongside a workflow mode):**

| Surface | Carries |
|---|---|
| `sk-code-webflow` | Frontend evidence: CSS/HTML/JS standards, implementation and performance patterns, CDN deployment, browser debug and verify, plus the Motion.dev animation overlay |
| `sk-code-opencode` | System-code evidence: TypeScript, Python, shell and config standards, hooks, alignment verification, authoring checklists |

---

## 3. HOW IT WORKS

### How A Request Resolves

A code request resolves through the hub to a primary workflow mode and one or more bundled surface packets. A request that spans intents stays at the hub for ordered routing or disambiguation. Two examples show the shape of a resolution:

| Request | Resolves to |
|---|---|
| "review my webflow animation for jank" | `[sk-code-review, sk-code-webflow]` |
| "run my implementation through the author-side quality gates" | `[sk-code-quality]` |

### The Implement To Verify Doctrine

The implement → debug → verify phases are not standalone modes. Their surface-agnostic doctrine lives once in `shared/references/`, symlinked into each surface so the active surface carries the full workflow without duplicating it:

- `workflow-implement.md` for the authoring pass
- `workflow-debug.md` for the repair pass
- `workflow-verify.md` for the proof pass

### One Advisor Identity

The mode packets and `shared/` carry no `graph-metadata.json` of their own. The hub root keeps the single graph identity for the whole family. `mode-registry.json` is the routing source of truth while `hub-router.json` preserves the vocabulary that helps code prompts resolve to the right mode.

---

## 4. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for sk-code when the task is code work and the next step is implementation, author-side quality, debugging, verification or review. The shared router keeps surface identity consistent across every mode and surface for WEBFLOW and OPENCODE work, plus the Motion.dev animation overlay. Use a mode hint when you already know the contract you need and let the hub classify when the request spans intents.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-design` | Designs UI direction, systems, motion and design audits that sk-code may implement |
| `sk-doc` | Owns markdown and documentation quality |
| `sk-git` | Owns branches, commits, PRs and the finish workflow |
| `system-spec-kit` | Owns spec folders, memory, continuity and packet validation |
| `mcp-chrome-devtools` | Provides browser evidence for frontend runtime behavior |

---

## 5. FAQ

**Q: Why does the advisor see only one code skill when the hub contains five packets?**

A: The mode packets and `shared/` carry no `graph-metadata.json` of their own. The hub root holds the single graph identity for the whole family, so prompts resolve to one entry point and the hub routes from there.

**Q: What happens when a request spans intents, like review plus implementation?**

A: The request stays at the hub. The hub orders the routing and asks for disambiguation instead of guessing a single mode.

---

## 6. VERIFICATION

| Check | Result |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-code/README.md --type readme` reports zero issues |
| Routing scenarios | The manual testing playbook runs every routing and disambiguation scenario behind the hub |

---

## 7. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime hub instructions and routing rules |
| [`ROUTER.md`](./ROUTER.md) | Active stage-two surface router, leaf map, and explicit shared-control declaration |
| [`mode-registry.json`](./mode-registry.json) | The mode-to-packet routing map |
| [`hub-router.json`](./hub-router.json) | Hub-local routing vocabulary and mode signals |
| [`shared/README.md`](./shared/README.md) | Shared surface detection and cross-mode helpers, plus the implement/debug/verify workflow doctrine |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Current-state inventory of every mode, surface and routing capability |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Manual scenarios that validate routing and disambiguation |
| [`sk-code-quality/SKILL.md`](./sk-code-quality/SKILL.md) | Quality mode packet |
| [`sk-code-review/SKILL.md`](./sk-code-review/SKILL.md) | Review mode packet |
| [`sk-code-webflow/SKILL.md`](./sk-code-webflow/SKILL.md) | Webflow surface packet |
| [`sk-code-opencode/SKILL.md`](./sk-code-opencode/SKILL.md) | OpenCode surface packet |
