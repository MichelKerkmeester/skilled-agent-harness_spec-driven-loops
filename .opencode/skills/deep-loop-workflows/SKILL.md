---
name: deep-loop-workflows
version: 1.1.0.0
description: "Unified deep-loop workflow skill: routes active requests to research, review, ai-council, and improvement modes over the shared deep-loop-runtime backend."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch]
---

<!-- Keywords: deep-loop-workflows, deep-loop, deep-research, deep-review, deep-ai-council, deep-improvement, context-gathering, reuse-catalog, autoresearch, iterative-research, code-audit, severity-findings, P0-P1-P2, ai-council, council-deliberation, multi-seat-planning, agent-improvement, benchmark-harness, model-benchmark, skill-benchmark, non-dev-ai-system, convergence-detection, externalized-state, coverage-graph, mode-registry, workflowmode, runtimeloop-type, backendkind -->

# Deep Loop Workflows

One skill, four active workflow families, one shared backend. `deep-loop-workflows` is the public, advisor-routable home for active deep-loop personas; `deep-loop-runtime` is the frozen, MCP-free backend it consumes. This hub holds NO per-mode convergence, state, or synthesis logic — each active mode keeps its own contract in its packet, and the hub only routes by `workflowMode` through `mode-registry.json`.

Use `@context` for one-shot retrieval, `/deep:research` for iterative investigation with a bounded context snapshot, `/deep:review` for iterative audit with a bounded review snapshot, or `/speckit:plan` for implementation planning.

---

## 1. WHEN TO USE

Use this skill (through the hub) for any active deep-loop workflow. Invoke it as `Skill(deep-loop-workflows)` (optionally with a mode hint such as `research: <request>`); the hub classifies the request, resolves a `workflowMode`, and loads the matching nested mode packet. Active `/deep:*` commands and native agent types remain as complementary surfaces over the same packets.

| Mode | Use it for | Packet | Command | Agent |
|------|-----------|--------|---------|-------|
| **research** | Outward, web + code iterative investigation → `research/research.md` | `deep-loop-workflows/deep-research/` | `/deep:research` | `deep-research` |
| **review** | Iterative code audit → P0/P1/P2 findings + verdict | `deep-loop-workflows/deep-review/` | `/deep:review` | `deep-review` |
| **ai-council** | Multi-seat planning deliberation → `ai-council/**` artifacts | `deep-loop-workflows/deep-ai-council/` | `/deep:ai-council` | `ai-council` |
| **improvement** (4 lanes) | Evaluator-first improvement: `agent-improvement`, `model-benchmark`, `skill-benchmark`, `non-dev-ai-system-refine` | `deep-loop-workflows/deep-improvement/` | `/deep:agent-improvement` · `/deep:model-benchmark` · `/deep:skill-benchmark` · `/deep:ai-system-improvement` | `deep-improvement` |

### When NOT to Use
- A single quick read/edit (no loop) — use the relevant code or doc skill directly.
- Backend/runtime support (executor, coverage-graph, scoring, fan-out) — that is `deep-loop-runtime`, consumed here, not invoked as a user workflow.

---

## 2. SMART ROUTING

Routing is **registry-driven** (invokable-hub, Option E). `mode-registry.json` is the single source of truth; the hub reads it and does not re-derive the mapping. When invoked as `Skill(deep-loop-workflows[, "<mode>: <request>"])`, the hub classifies the request to a `workflowMode`, resolves it through the registry, and loads `registry[mode].packet`. The advisor routes any deep-loop query to the single identity `deep-loop-workflows`; the hub then picks the mode. The `/deep:*` commands and native agent types remain as complementary surfaces — they reach the same packets through static routers/agent definitions — and the hub holds NO per-mode logic.

### The three-tier discriminator
- **`workflowMode`** — the public active mode key: `research`, `review`, `ai-council`, and the four improvement lanes `agent-improvement`, `model-benchmark`, `skill-benchmark`, `ai-system-improvement` (its loop-host mode stays `non-dev-ai-system-refine`).
- **`runtimeLoopType`** — the graph-backed convergence key consumed by `deep-loop-runtime/scripts/convergence.cjs` (validated against active `research|review|council`). **Explicit `null` for all four improvement lanes; never inferred from `workflowMode`.** Note `ai-council` maps to `runtimeLoopType: council`.
- **`backendKind`** — which backend runs the mode: `runtime-loop-type` (research/review/ai-council), `improvement-host` (`deep-improvement/scripts/shared/loop-host.cjs --mode`), or `external-adapter` (non-dev-ai-system; the loop is owned by external packaging).

### Routing rule
```
classify the request to a workflowMode (dominant deep-loop intent; mode hint like "research: ..." overrides)
read mode-registry.json
  → resolve workflowMode from the hint / classified intent (or the /deep:* command / advisor alias)
  → load the mode packet at registry[mode].packet/SKILL.md
       e.g. registry["research"].packet → deep-loop-workflows/deep-research/SKILL.md
       (the 4 improvement modes all share the deep-loop-workflows/deep-improvement/ packet)
  → if registry[mode].runtimeLoopType !== null: backend = convergence.cjs --loop-type <runtimeLoopType>
     else: backend = improvement loop-host (--mode) or external adapter, per backendKind
```

Intent classification favors the single dominant active deep-loop mode; a mode hint (`research: ...`, `review: ...`, `ai-council: ...`, or an improvement lane) overrides the classifier. The legacy advisor projection maps stay hardcoded and drift-guarded against the registry, and the command files remain static routers with hardcoded asset/mode routing; neither resolves from `mode-registry.json` at runtime, but both stay equal to its projection.

Per-mode behavior is **not flattened**: each active packet keeps its own convergence math, state shape, artifacts, and tool-permission guards (research has WebFetch; review/ai-council are code/inward-only; improvement is the only mutating family). Exactly one `graph-metadata.json` — this hub's — is preserved, so the advisor discovers exactly one skill identity regardless of which surface (hub `Skill()`, `/deep:*` command, or agent) reaches a mode.

---

## 3. HOW IT WORKS

### Layout
```
deep-loop-workflows/
  SKILL.md               # this routing hub (no per-mode logic)
  mode-registry.json     # the three-tier discriminator + advisorRouting (single source of truth)
  graph-metadata.json    # the ONE advisor identity for the whole skill
  deep-research/   deep-review/   deep-ai-council/   deep-improvement/   # active mode packets
  shared/synthesis/      # workflows-shared synthesis (e.g. emitResourceMap)
```

Each active mode packet keeps its own `SKILL.md`, `references/`, `scripts/`, `assets/`, `feature_catalog/`, or `manual_testing_playbook/` as applicable, with internal paths repointed and **no per-packet `graph-metadata.json`** — only this hub carries one, so the advisor discovers exactly one skill. The `deep-ai-council` packet folder follows the standard `folder == packetSkillName` convention (`deep-ai-council`); its legacy public surfaces (the `/deep:ai-council` command and the `ai-council` agent) intentionally keep the shorter `ai-council` key, so always resolve the packet path through `mode-registry.json` rather than hardcoding it.

### Backend
All modes consume `deep-loop-runtime` (frozen, MCP-free): executor config, prompt-pack, validation, atomic state, coverage-graph, Bayesian scoring, fan-out, the council primitives, and the promoted plumbing (capability resolver, artifact-root, loop-lock CLI, lifecycle taxonomy). The runtime never gains an `improvement` loopType — improvement stays host-driven.

---

## 4. RULES

### ALWAYS
- **ALWAYS** resolve a mode through `mode-registry.json` (read the `packet` key; never hardcode a router mapping or packet path in the hub).
- **ALWAYS** keep advisor projection maps hardcoded and drift-guarded against the registry; command mode routing is still hardcoded in the command files and does not resolve through `mode-registry.json`.
- **ALWAYS** keep each mode's convergence/state/artifact contract in its packet — the hub stays logic-free.
- **ALWAYS** keep exactly one `graph-metadata.json` (this hub's) so the advisor sees one skill identity, whether a mode is reached via `Skill(deep-loop-workflows)`, a `/deep:*` command, or an agent.
- **ALWAYS** keep `Skill(deep-loop-workflows)` hub routing, the `/deep:*` commands, and the agent types as complementary surfaces over the same packets — never let one surface fork per-mode logic out of its packet.

### NEVER
- **NEVER** add an `improvement` `loopType` to `deep-loop-runtime/convergence.cjs` (improvement is host-driven; `runtimeLoopType` stays `null`).
- **NEVER** infer `runtimeLoopType` from `workflowMode` — read it from the registry (explicit `null` is load-bearing).
- **NEVER** let a read-only mode (research/review/ai-council) reach the improvement mutation scripts (`promote-candidate.cjs`/`rollback-candidate.cjs`).
- **NEVER** add a `graph-metadata.json` or a discoverable skill marker inside a mode packet or `shared/`.

### ESCALATE IF
- A new mode is needed beyond the seven registered — extend `mode-registry.json` and open a packet, do not bolt logic onto the hub.
- A change would require the runtime to gain MCP tools or an improvement loopType — that contradicts the architecture; escalate.

---

## 5. REFERENCES

- Backend: `.opencode/skills/deep-loop-runtime/` (frozen, consumed by every mode).
- Mode packets: `deep-research/SKILL.md`, `deep-review/SKILL.md`, `deep-ai-council/SKILL.md`, `deep-improvement/SKILL.md` (per-mode detail).
- Commands: the active `/deep:*` commands under `.opencode/commands/deep/` (complementary surface).
- Registry: `mode-registry.json` (the routing contract — the authoritative `packet` paths).

---

## 6. SUCCESS CRITERIA

- The hub resolves one primary active `workflowMode` for the request through `mode-registry.json` (improvement folds to the right lane via the registry, never by array order).
- The selected mode packet owns the detailed convergence/state/artifact workflow; the hub stayed routing-only.
- `Skill(deep-loop-workflows[, hint])` reaches a mode, and the `/deep:*` commands and agent types still reach the same packets.
- Exactly one `graph-metadata.json` exists for the whole skill; no packet carries its own.

---

## 7. INTEGRATION POINTS

### Modes
- `research` — outward web + code iterative investigation (`research/research.md`).
- `review` — iterative code audit, P0/P1/P2 findings + verdict.
- `ai-council` — multi-seat planning deliberation (`ai-council/**` artifacts).
- `improvement` (4 lanes) — evaluator-first agent/model/skill/non-dev-system improvement.

### Surfaces and Consumers
- `Skill(deep-loop-workflows)` is the invokable hub; active `/deep:*` commands and the agent types (`deep-research`, `deep-review`, `ai-council`, `deep-improvement`) are complementary surfaces over the same packets.
- `deep-loop-runtime` is the frozen, MCP-free backend every mode consumes.
- `/speckit:plan` consumes `@context` packages plus research/review outputs; spec-folder docs consume research/review output.

---

## 8. RELATED RESOURCES

- Pattern: `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md` (parent-skill hub + nested packets, the one-graph-metadata invariant).
- Sibling example: `.opencode/skills/sk-design/` (the same invokable-hub + `mode-registry.json` Option E pattern).
- Registry: `mode-registry.json` (this hub's routing contract).
