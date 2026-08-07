---
title: "system-deep-loop"
description: "The advisor-routable hub for the iterative deep-loop workflow families: research, review, AI Council, alignment and evaluator-first improvement, all running on one shared backend."
trigger_phrases:
  - "system deep loop"
  - "deep loop workflows"
  - "deep research review council alignment improvement"
  - "deep-loop hub routing"
version: 2.1.0.0
---

# system-deep-loop

> Deep work needs a loop, not a one-shot prompt. This skill runs the iterative deep-loop workflows for research, review, AI Council, alignment and improvement from one shared backend, so the family stays a single advisor identity.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Running an iterative deep-loop workflow: autonomous research, code review, multi-seat AI Council planning, named-standard conformance alignment or evaluator-first improvement |
| **Invoke with** | `Skill(system-deep-loop)`, the `/deep:*` commands or the deep agents |
| **Works on** | A spec packet or a scoped target, with externalized state kept under the packet |
| **Produces** | Mode artifacts (research.md, review-report.md, council artifacts, improvement proposals) plus convergence state |

---

## 2. OVERVIEW

### Why This Skill Exists

The deep-loop workflows used to ship as five separate sibling skills over one backend. Five identities for one runtime meant the advisor had to disambiguate near-duplicates. A shared fix had to be applied five times. This hub gives the family one advisor identity while each workflow keeps its own logic in its own packet.

### What It Does

The hub loads through `Skill(system-deep-loop)` and routes by `workflowMode` through `mode-registry.json` to one active mode packet. The hub holds no per-mode logic. Each packet keeps its own convergence math, state shape, artifacts and tool-permission guards. The shared backend, `runtime/`, does the executor configuration, prompt-pack rendering, validation, atomic state, coverage graph and scoring.

### The Mode Family

| Mode | What the workflow delivers |
|---|---|
| **deep-research** | autonomous iterative research over a spec packet, converging to a synthesis report |
| **deep-review** | multi-pass code review against a review scope, converging to a review-report.md |
| **deep-ai-council** | multi-seat deliberation with critique and convergence, writing council artifacts |
| **deep-alignment** | named-standard conformance alignment, reusing the review convergence loop |
| **deep-improvement** | the evaluator-first lanes for agent improvement, model benchmark and skill benchmark |

---

## 3. QUICK START

**Step 1: Invoke it.** Let the advisor route a deep-loop request, run a `/deep:*` command or read `SKILL.md` directly.

**Step 2: Run a mode.** For example, a deep review:

```bash
/deep:review
```

The hub resolves `workflowMode: review` to the `deep-review` packet and runs its convergence loop.

**Step 3: Find the output.** Each mode writes its artifacts and convergence state under the spec packet it was pointed at.

---

## 4. HOW IT WORKS

### The Three-Tier Discriminator

Every mode is described once in `mode-registry.json` and no router re-derives that mapping:

- **`workflowMode`** is the public key used by commands, the advisor and the registry, for example `research`, `ai-council`, `alignment` or `agent-improvement`.
- **`runtimeLoopType`** is the graph-backed convergence key for `runtime/`, one of `research`, `review`, `council` or an explicit `null`. Alignment maps to `review`. The null value belongs only to the improvement lanes and is never guessed from `workflowMode`.
- **`backendKind`** is what actually runs the mode: a runtime convergence loop, the improvement host or an external adapter.

A router reads the registry and loads the mode packet. The runtime convergence loop runs when `runtimeLoopType` is set. The improvement host or external adapter runs when it is `null`.

### One Advisor Identity

The mode packets carry no `graph-metadata.json` of their own, so the advisor discovers exactly one skill. The hub's single `graph-metadata.json` is that identity.

### Adding A Workflow Mode

Adding another active mode touches every surface below. Miss one and the mode is unroutable, undiscoverable, drift-guard-broken or detached from the advisor's projection:

- **`mode-registry.json`**: add the mode's registry entry with `workflowMode`, `runtimeLoopType` (or explicit `null`), `backendKind`, `packet`, `packetKind`, `toolSurface`, `advisorRouting` and `aliases`.
- **`hub-router.json`**: add a `routerSignals` entry for the mode's vocabulary classes and a place in `routerPolicy.tieBreak`.
- **`SKILL.md`**: add a row to the WHEN TO USE mode table and keep `allowed-tools` equal to the union when the new mode's tool surface adds a tool.
- **`README.md`**: add the mode to AT A GLANCE, HOW IT WORKS and the Layout table as applicable.
- **The drift-guard test** at `system-skill-advisor/mcp-server/tests/routing-registry-drift-guard.vitest.ts` asserts the advisor's hardcoded projection equals the registry projection. Update the maps it checks against or the test fails on the next run.
- **The hub canon check**: rerun `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/system-deep-loop` after all of the above. It validates registry shape, alias uniqueness, tool-surface union and hub-router consistency in one pass.

---

## 5. INTEGRATION & NAVIGATION

### Layout

| Path | What it holds |
|---|---|
| `SKILL.md` | The routing hub, with no per-mode logic |
| `mode-registry.json` | The single source of truth for the three-tier discriminator |
| `graph-metadata.json` | The one advisor identity for the whole skill |
| `deep-research/`, `deep-review/`, `deep-ai-council/`, `deep-improvement/`, `deep-alignment/` | The active mode packets, each with its own SKILL.md, references, scripts, assets and governance |
| `shared/synthesis/` | Synthesis helpers shared across modes, such as resource-map emission |
| `runtime/` | The nested frozen backend: executor config, prompt-pack rendering, validation, atomic state, coverage graph and scoring |

### Commands And Agents

Active `/deep:*` commands and deep agents (`deep-research`, `deep-review`, `deep-improvement`, `ai-council` and `deep-alignment`) dispatch into the matching mode packet. `@context` remains the one-shot retrieval agent.

### Related Skills

| Skill | Relationship |
|---|---|
| `system-spec-kit` | Owns the spec packets and memory continuity the modes read and write |

### The Runtime Boundary

`runtime/` is not a related skill. It is this hub's own nested frozen infrastructure layer (executor config, prompt-pack rendering, validation, atomic state, coverage graph, scoring) that every mode consumes internally. It carries no `graph-metadata.json` of its own and is not independently advisor-routable.

---

## 6. FAQ

**Q: Why is this one skill instead of five?**

A: Five separate identities for one backend forced the advisor to disambiguate near-duplicate triggers. Every shared fix had to be applied five times. The hub keeps one advisor identity while each mode packet keeps its own logic.

**Q: What is `runtime/` and why is it not routable?**

A: It is the shared backend every mode consumes: executor configuration, prompt-pack rendering, validation, atomic state, the coverage graph and scoring. It is frozen infrastructure owned by the hub, not a mode, so it carries no advisor identity of its own.

**Q: Where do mode artifacts land?**

A: Each mode writes its artifacts and convergence state under the spec packet it was pointed at. A review writes `review-report.md`, a research run writes `research.md`, the council writes its deliberation artifacts and the improvement lanes write their proposals and scores.

**Q: How does the hub decide which mode runs?**

A: The registry maps the public `workflowMode` key to a packet and a backend kind. Commands, agents and the advisor all speak the same key, so routing never re-derives the mapping.

---

## 7. VERIFICATION

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-deep-loop/README.md --type readme` reports zero issues |
| Hub canon | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/system-deep-loop` validates registry shape, alias uniqueness, tool-surface union and hub-router consistency |
| Advisor projection | `routing-registry-drift-guard.vitest.ts` asserts the advisor's hardcoded projection equals the registry projection |
| Playbook | `manual-testing-playbook/manual-testing-playbook.md` walks operator scenarios across mode routing and convergence discipline |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions and routing logic |
| [`mode-registry.json`](./mode-registry.json) | The three-tier discriminator for every mode |
| [`hub-router.json`](./hub-router.json) | Router signals and tie-break policy for the hub |
| [`deep-ai-council/SKILL.md`](./deep-ai-council/SKILL.md) | An example mode packet |
| [`deep-alignment/SKILL.md`](./deep-alignment/SKILL.md) | Named-standard conformance mode packet |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Operator scenarios for routing, convergence and hub canon |
