---
name: deep-loop-workflows
version: 1.0.0
description: "Unified deep-loop workflow skill: routes a request to one of five modes (context, research, review, ai-council, improvement) over the shared deep-loop-runtime backend. Holds no per-mode logic — it dispatches by workflowMode through mode-registry.json. Use for codebase-context gathering, autonomous research, iterative code review, multi-seat AI Council planning, and evaluator-first agent/model/skill/non-dev-system improvement."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch]
---

<!-- Keywords: deep-loop-workflows, deep-loop, deep-context, deep-research, deep-review, deep-ai-council, deep-improvement, context-gathering, reuse-catalog, autoresearch, iterative-research, code-audit, severity-findings, P0-P1-P2, ai-council, council-deliberation, multi-seat-planning, agent-improvement, benchmark-harness, model-benchmark, skill-benchmark, non-dev-ai-system, convergence-detection, externalized-state, coverage-graph, mode-registry, workflowmode, runtimeloop-type, backendkind -->

# Deep Loop Workflows

One skill, five workflow modes, one shared backend. `deep-loop-workflows` is the public, advisor-routable home for every deep-loop persona; `deep-loop-runtime` is the frozen, MCP-free backend it consumes. This hub holds NO per-mode convergence, state, or synthesis logic — each mode keeps its own contract in its packet, and the hub only routes by `workflowMode` through `mode-registry.json`.

---

## 1. WHEN TO USE

Use this skill (through its `/deep:*` commands and native agents) for any deep-loop workflow:

| Mode | Use it for | Command | Agent |
|------|-----------|---------|-------|
| **context** | Inward codebase-context gathering → reuse-first Context Report, before `/speckit:plan` | `/deep:context` | `deep-context` |
| **research** | Outward, web + code iterative investigation → `research/research.md` | `/deep:research` | `deep-research` |
| **review** | Iterative code audit → P0/P1/P2 findings + verdict | `/deep:review` | `deep-review` |
| **ai-council** | Multi-seat planning deliberation → `ai-council/**` artifacts | `/deep:ai-council` | `ai-council` |
| **improvement** (4 lanes) | Evaluator-first improvement: `agent-improvement`, `model-benchmark`, `skill-benchmark`, `non-dev-ai-system-refine` | `/deep:agent-improvement` · `/deep:model-benchmark` · `/deep:skill-benchmark` · `/deep:ai-system-improvement` | `deep-improvement` |

### When NOT to Use
- A single quick read/edit (no loop) — use the relevant code or doc skill directly.
- Backend/runtime support (executor, coverage-graph, scoring, fan-out) — that is `deep-loop-runtime`, consumed here, not invoked as a user workflow.

---

## 2. SMART ROUTING

Routing is **registry-projected**. `mode-registry.json` is the declarative source of truth for the mode projection; the hub and commands resolve from it, while the advisor keeps hardcoded Python/TypeScript projection maps in sync through the routing-registry drift guard and does not read the registry at runtime.

### The three-tier discriminator
- **`workflowMode`** — the public mode key (all modes): `context`, `research`, `review`, `ai-council`, and the four improvement lanes `agent-improvement`, `model-benchmark`, `skill-benchmark`, `ai-system-improvement` (its loop-host mode stays `non-dev-ai-system-refine`).
- **`runtimeLoopType`** — the graph-backed convergence key consumed by `deep-loop-runtime/scripts/convergence.cjs` (validated against exactly `research|review|council|context`). **Explicit `null` for all four improvement lanes; never inferred from `workflowMode`.** Note `ai-council` maps to `runtimeLoopType: council`.
- **`backendKind`** — which backend runs the mode: `runtime-loop-type` (context/research/review/ai-council), `improvement-host` (`deep-improvement/scripts/shared/loop-host.cjs --mode`), or `external-adapter` (non-dev-ai-system; the loop is owned by external packaging).

### Routing rule
```
read mode-registry.json
  → resolve workflowMode from the command / advisor alias
  → load the mode packet at registry[mode].packet/   (the 4 improvement modes all share the deep-improvement/ packet)
  → if registry[mode].runtimeLoopType !== null: backend = convergence.cjs --loop-type <runtimeLoopType>
     else: backend = improvement loop-host (--mode) or external adapter, per backendKind
```

Per-mode behavior is **not flattened**: each packet keeps its own convergence math, state shape, artifacts, and tool-permission guards (research has WebFetch; review/context/ai-council are code/inward-only; improvement is the only mutating family).

---

## 3. HOW IT WORKS

### Layout
```
deep-loop-workflows/
  SKILL.md               # this routing hub (no per-mode logic)
  mode-registry.json     # the three-tier discriminator (single source of truth)
  graph-metadata.json    # the ONE advisor identity for the whole skill
  deep-context/   deep-research/   deep-review/   ai-council/   deep-improvement/   # five verbatim mode packets
  shared/synthesis/      # workflows-shared synthesis (e.g. emitResourceMap)
```

Each mode packet is the former skill's content moved verbatim (its own `SKILL.md`, `references/`, `scripts/`, `assets/`, `feature_catalog/`, `manual_testing_playbook/`), with internal paths repointed and **no per-packet `graph-metadata.json`** — only this hub carries one, so the advisor discovers exactly one skill.

### Backend
All modes consume `deep-loop-runtime` (frozen, MCP-free): executor config, prompt-pack, validation, atomic state, coverage-graph, Bayesian scoring, fan-out, the council primitives, and the promoted plumbing (capability resolver, artifact-root, loop-lock CLI, lifecycle taxonomy). The runtime never gains an `improvement` loopType — improvement stays host-driven.

---

## 4. RULES

### ALWAYS
- **ALWAYS** resolve hub and command modes through `mode-registry.json`; advisor projection maps may be hardcoded only when the drift guard proves they match the registry projection.
- **ALWAYS** keep each mode's convergence/state/artifact contract in its packet — the hub stays logic-free.
- **ALWAYS** keep exactly one `graph-metadata.json` (this hub's) so the advisor sees one skill.

### NEVER
- **NEVER** add an `improvement` `loopType` to `deep-loop-runtime/convergence.cjs` (improvement is host-driven; `runtimeLoopType` stays `null`).
- **NEVER** infer `runtimeLoopType` from `workflowMode` — read it from the registry (explicit `null` is load-bearing).
- **NEVER** let a read-only mode (context/research/review/ai-council) reach the improvement mutation scripts (`promote-candidate.cjs`/`rollback-candidate.cjs`).
- **NEVER** add a `graph-metadata.json` or a discoverable skill marker inside a mode packet or `shared/`.

### ESCALATE IF
- A new mode is needed beyond the eight registered — extend `mode-registry.json` and open a packet, do not bolt logic onto the hub.
- A change would require the runtime to gain MCP tools or an improvement loopType — that contradicts the architecture; escalate.

---

## 5. REFERENCES

- Backend: `.opencode/skills/deep-loop-runtime/` (frozen, consumed by every mode).
- Mode packets: `deep-context/SKILL.md`, `deep-research/SKILL.md`, `deep-review/SKILL.md`, `ai-council/SKILL.md`, `deep-improvement/SKILL.md` (per-mode detail).
- Commands: the eight `/deep:*` commands under `.opencode/commands/deep/`.
- Registry: `mode-registry.json` (the routing contract).
