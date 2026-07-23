---
title: "system-deep-loop"
description: "The advisor-routable hub for the five active deep-loop workflow families (research, review, AI Council, improvement, alignment) over a nested runtime/ layer (formerly the separate deep-loop-runtime skill, merged 2026-07-08)."
trigger_phrases:
  - "system deep loop"
  - "deep loop workflows"
  - "deep research review council alignment improvement"
  - "deep-loop hub routing"
version: 2.0.0.0
---

# system-deep-loop

> One skill that routes to every active deep-loop workflow: research, review, AI Council, alignment and improvement.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Running an iterative deep-loop workflow: autonomous research, code review, multi-seat AI Council planning, named-standard conformance alignment or evaluator-first improvement. |
| **Invoke with** | `Skill(system-deep-loop)`, the `/deep:*` commands or the deep agents. |
| **Works on** | A spec packet or a scoped target, with externalized state kept under the packet. |
| **Produces** | The mode's artifacts (for example research.md, review-report.md, council artifacts or improvement proposals) plus convergence state. |

---

## 2. OVERVIEW

### Why This Skill Exists

The deep-loop workflows used to ship as five separate sibling skills over one backend. Five identities for one runtime meant the advisor had to disambiguate near-duplicates, and a shared fix had to be applied five times. This hub gives the family one advisor identity while keeping each workflow's logic intact in its own packet.

### What It Does

`Skill(system-deep-loop)` loads the hub, and the hub routes by `workflowMode` through `mode-registry.json` to one active mode packet. The hub holds no per-mode logic. Each packet keeps its own convergence math, state shape, artifacts and tool-permission guards. The shared backend, `runtime/`, does the executor configuration, prompt-pack rendering, validation, atomic state, coverage graph and scoring.

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

- **`workflowMode`** is the public key used by commands, the advisor and the registry, for example `research`, `ai-council`, `alignment` or `agent-improvement`.
- **`runtimeLoopType`** is the graph-backed convergence key for `runtime/`, one of `research`, `review` or `council` for active modes. Alignment maps to `review`. It is an explicit `null` only for the three improvement lanes and is never guessed from `workflowMode`.
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
| `deep-research/`, `deep-review/`, `deep-ai-council/`, `deep-improvement/`, `deep-alignment/` | The active mode packets, each with its own `SKILL.md`, references, scripts, assets and governance. |
| `shared/synthesis/` | Synthesis helpers shared across modes, such as resource-map emission. |

### Commands and agents

Active `/deep:*` commands and deep agents (`deep-research`, `deep-review`, `deep-improvement`, `ai-council` and `deep-alignment`) dispatch into the matching mode packet. `@context` remains the one-shot retrieval agent.

### Related Skills

| Skill | Relationship |
|---|---|
| `system-spec-kit` | Owns the spec packets and memory continuity the modes read and write. |

`runtime/` is not a related skill — it is this hub's own nested, frozen infrastructure layer (executor config, prompt-pack rendering, validation, atomic state, coverage graph, scoring) that every mode consumes internally. It carries no `graph-metadata.json` of its own and is not independently advisor-routable (see Layout above).

---

## 6. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions and routing logic. |
| [`mode-registry.json`](./mode-registry.json) | The three-tier discriminator for every mode. |
| [`deep-ai-council/SKILL.md`](./deep-ai-council/SKILL.md) | An example mode packet. |
| [`deep-alignment/SKILL.md`](./deep-alignment/SKILL.md) | Named-standard conformance mode packet. |

---

## 7. ADDING A WORKFLOW MODE

Adding another active mode (a new packet beyond `deep-research`, `deep-review`, `deep-ai-council`, `deep-improvement`, `deep-alignment`) touches every one of these surfaces — miss one and the mode is either unroutable, undiscoverable, or drift-guard-broken:

- [ ] **`mode-registry.json`** — add the mode's registry entry: `workflowMode`, `runtimeLoopType` (or explicit `null`), `backendKind`, `packet`, `packetKind`, `toolSurface`, `advisorRouting`, and `aliases`.
- [ ] **`hub-router.json`** — add a `routerSignals` entry for the new mode's vocabulary classes, and add it to `routerPolicy.tieBreak`.
- [ ] **`SKILL.md`** — add a row to the §1 WHEN TO USE mode table (mode, use-it-for, packet, command, agent), and update the frontmatter `allowed-tools` if the new mode's `toolSurface.allowed` introduces a tool no existing mode grants (keep it equal to the union — see §2 SMART ROUTING).
- [ ] **`README.md`** (this document) — add the mode to §1 AT A GLANCE / §4 HOW IT WORKS as applicable, and to the Layout table if it changes the directory listing.
- [ ] **Drift-guard test** — `system-skill-advisor/mcp-server/tests/routing-registry-drift-guard.vitest.ts` asserts the advisor's hardcoded projection maps equal the registry projection; update the maps it checks against or the test fails on the next run.
- [ ] **`node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/system-deep-loop`** — re-run after all of the above; it validates registry shape, alias uniqueness, tool-surface union (3j), and hub-router consistency in one pass.
