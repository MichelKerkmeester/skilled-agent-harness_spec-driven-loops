---
title: "deep-loop-workflows"
description: "The advisor-routable hub for the five deep-loop workflow personas (context, research, review, AI Council, improvement) over one shared runtime."
trigger_phrases:
  - "deep loop workflows"
  - "deep research review council improvement"
  - "deep-loop hub routing"
version: 1.0.0.0
---

# deep-loop-workflows

> One skill that routes to every deep-loop workflow: context gathering, research, review, AI Council and improvement.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Running an iterative deep-loop workflow: codebase context, autonomous research, code review, multi-seat AI Council planning or evaluator-first improvement. |
| **Invoke with** | `Skill(deep-loop-workflows)`, the `/deep:*` commands or the deep agents. |
| **Works on** | A spec packet or a scoped target, with externalized state kept under the packet. |
| **Produces** | The mode's artifacts (for example research.md, review-report.md, council artifacts or improvement proposals) plus convergence state. |

---

## 2. OVERVIEW

### Why This Skill Exists

The deep-loop workflows used to ship as five separate sibling skills over one backend. Five identities for one runtime meant the advisor had to disambiguate near-duplicates, and a shared fix had to be applied five times. This hub gives the family one advisor identity while keeping each workflow's logic intact in its own packet.

### What It Does

`Skill(deep-loop-workflows)` loads the hub, and the hub routes by `workflowMode` through `mode-registry.json` to one of five mode packets. The hub holds no per-mode logic. Each packet keeps its own convergence math, state shape, artifacts and tool-permission guards. The shared backend, `deep-loop-runtime`, does the executor configuration, prompt-pack rendering, validation, atomic state, coverage graph and scoring.

---

## 3. QUICK START

**Step 1: Invoke it.** Let the advisor route a deep-loop request, run a `/deep:*` command, or read `SKILL.md` directly.

**Step 2: Run a mode.** For example, a deep review:

```bash
/deep:review
```

The hub resolves `workflowMode: review` to the `deep-review` packet and runs its convergence loop.

**Step 3: Find the output.** Each mode writes its artifacts and convergence state under the spec packet it was pointed at.

---

## 4. HOW IT WORKS

Every mode is described once in `mode-registry.json` by a three-tier discriminator, and no router re-derives that mapping:

- **`workflowMode`** is the public key used by commands, the advisor and the registry, for example `research`, `ai-council` or `agent-improvement`.
- **`runtimeLoopType`** is the graph-backed convergence key for `deep-loop-runtime`, one of `research`, `review`, `council` or `context`. It is an explicit `null` for the four improvement lanes and is never guessed from `workflowMode`.
- **`backendKind`** is what actually runs the mode: a runtime convergence loop, the improvement host or an external adapter.

A router reads the registry, loads the mode packet, and either calls the runtime convergence loop (when `runtimeLoopType` is set) or the improvement host or external adapter (when it is `null`).

### One advisor identity

The mode packets carry no `graph-metadata.json` of their own, so the advisor discovers exactly one skill. The hub's single `graph-metadata.json` is that identity.

---

## 5. INTEGRATION & NAVIGATION

### Layout

| Path | What it holds |
|------|---------------|
| `SKILL.md` | The routing hub, with no per-mode logic. |
| `mode-registry.json` | The single source of truth for the three-tier discriminator. |
| `graph-metadata.json` | The one advisor identity for the whole skill. |
| `deep-context/`, `deep-research/`, `deep-review/`, `deep-ai-council/`, `deep-improvement/` | The five mode packets, each with its own `SKILL.md`, references, scripts, assets and governance. |
| `shared/synthesis/` | Synthesis helpers shared across modes, such as resource-map emission. |

### Commands and agents

The `/deep:*` commands and the five deep agents (`deep-context`, `deep-research`, `deep-review`, `deep-improvement` and `ai-council`) keep their names and dispatch into the matching mode packet.

### Related Skills

| Skill | Relationship |
|---|---|
| `deep-loop-runtime` | The frozen, MCP-free backend the modes run on. |
| `system-spec-kit` | Owns the spec packets and memory continuity the modes read and write. |

---

## 6. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions and routing logic. |
| [`mode-registry.json`](./mode-registry.json) | The three-tier discriminator for every mode. |
| [`deep-ai-council/SKILL.md`](./deep-ai-council/SKILL.md) | An example mode packet. |
