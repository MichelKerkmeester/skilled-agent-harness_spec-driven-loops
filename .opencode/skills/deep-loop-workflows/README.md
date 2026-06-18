# deep-loop-workflows

One skill for every deep-loop workflow. `deep-loop-workflows` is the public, advisor-routable home for five workflow personas — codebase-context gathering, autonomous research, iterative code review, multi-seat AI Council planning, and evaluator-first improvement — that all run over one shared backend, `deep-loop-runtime`.

It replaces the five former sibling skills (`deep-context`, `deep-research`, `deep-review`, `deep-ai-council`, `deep-improvement`) with a single identity and five mode packets. The hub itself holds no per-mode logic: it routes by `workflowMode` through `mode-registry.json` and hands off to the mode's packet.

## How it routes

Every mode is described once, in `mode-registry.json`, by a three-tier discriminator:

- **`workflowMode`** — the public key used by commands, the advisor, and the registry (e.g. `research`, `ai-council`, `agent-improvement`).
- **`runtimeLoopType`** — the graph-backed convergence key for `deep-loop-runtime/scripts/convergence.cjs`, one of `research|review|council|context`. It is an explicit `null` for the four improvement lanes and is never guessed from `workflowMode`.
- **`backendKind`** — what actually runs the mode: a runtime convergence loop, the improvement host (`deep-improvement/scripts/shared/loop-host.cjs`), or an external adapter whose loop lives in external packaging.

A router reads the registry, loads the mode packet, and either calls the runtime convergence loop (when `runtimeLoopType` is set) or the improvement host / external adapter (when it is `null`). No router re-derives that mapping.

## Layout

| Path | What it holds |
|------|---------------|
| `SKILL.md` | the routing hub (no per-mode logic) |
| `mode-registry.json` | the single source of truth for the three-tier discriminator |
| `graph-metadata.json` | the one advisor identity for the whole skill |
| `deep-context/` · `deep-research/` · `deep-review/` · `ai-council/` · `deep-improvement/` | the five verbatim mode packets, each with its own `SKILL.md`, references, scripts, assets, and governance |
| `shared/synthesis/` | workflows-shared synthesis helpers (e.g. resource-map emission) |

Each mode keeps its own convergence math, state shape, artifacts, and tool-permission guards — the merge preserves behavior rather than flattening it. The packets carry no `graph-metadata.json` of their own, so the advisor discovers exactly one skill.

## The backend

`deep-loop-runtime` stays the frozen, MCP-free backend: executor configuration, prompt-pack rendering, post-dispatch validation, atomic state, coverage-graph storage and signals, Bayesian scoring, fan-out, the council primitives, and the promoted plumbing (capability resolver, artifact-root, loop-lock CLI, lifecycle taxonomy). It never gains an `improvement` loop type — improvement stays host-driven.

## Commands and agents

The eight `/deep:*` commands and the five native agents (`deep-context`, `deep-research`, `deep-review`, `deep-improvement`, `ai-council`) keep their names and dispatch into the matching mode packet.
