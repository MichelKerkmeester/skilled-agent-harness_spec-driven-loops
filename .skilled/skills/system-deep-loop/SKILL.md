---
name: system-deep-loop
version: 1.6.19.0
description: "Routes research, review, and AI Council modes through registry-selected packets."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch]
---

<!-- Keywords: system-deep-loop, deep-loop, deep-research, deep-review, deep-ai-council, autoresearch, iterative-research, review-loop, deep-review-wave, release-readiness, severity-findings, P0-P1-P2, ai-council, council-deliberation, multi-seat-planning, benchmark-harness, convergence-detection, externalized-state, iteration-files, coverage-graph, mode-registry, workflowmode, runtimeloop-type, backendkind -->

# System Deep Loop

One skill has three active workflow families and one nested runtime layer.
`system-deep-loop` is the public, advisor-routable home for active deep-loop personas.
`runtime/` is the frozen, MCP-free infrastructure layer it consumes.
This hub holds NO per-mode convergence, state or synthesis logic.
Each active mode keeps its own contract in its packet. The hub only routes by `workflowMode` through `mode-registry.json`.

**Version authority.** This file's `version` frontmatter is the hub's release version and matches the newest entry under `changelog/`; `description.json`, `mode-registry.json` and `hub-router.json` carry the same value, so every hub-root JSON routing file states the same release; `ROUTER.md` keeps its own document version.

Use `@context` for one-shot retrieval, `/deep:research` for iterative investigation with a bounded context snapshot, `/deep:review` for iterative audit with a bounded review snapshot, or `/speckit:plan` for implementation planning.

---

## 1. WHEN TO USE

Use this skill (through the hub) for any active deep-loop workflow. Invoke it as `Skill(system-deep-loop)` (optionally with a mode hint such as `research: <request>`); the hub classifies the request, resolves a `workflowMode`, and loads the matching nested mode packet. Active `/deep:*` commands and native agent types remain as complementary surfaces over the same packets.

| Mode | Use it for | Packet | Command | Agent |
|------|-----------|--------|---------|-------|
| **research** | Outward, web + code iterative investigation → `research/research.md` | `system-deep-loop/deep-research/` | `/deep:research` | `deep-research` |
| **review** | Iterative review loop → P0/P1/P2 findings + verdict | `system-deep-loop/deep-review/` | `/deep:review` | `deep-review` |
| **ai-council** | Multi-seat planning deliberation → `ai-council/**` artifacts | `system-deep-loop/deep-ai-council/` | `/deep:ai-council` | `ai-council` |

### When NOT to Use
- A single quick read/edit (no loop) — use the relevant code or doc skill directly.
- Backend/runtime support (executor, coverage-graph, scoring, fan-out) — that is `runtime/`, consumed here, not invoked as a user workflow (formerly the separate deep-loop-runtime skill).

---

## 2. SMART ROUTING

Routing is **registry-driven at runtime and authored in `hub-router.json`** in two stages.
Stage 1 (hub → mode) selects a mode: `hub-router.json` `vocabularyClasses` is the one authored vocabulary, and its `routerSignals` keys are `research`, `review` and `ai-council`.
The `mode-registry.json` aliases, each packet's `Keyword triggers:` line where one exists and the root `ROUTER.md` intents are checked against it.
Stage 2 (mode → leaves) lives in the root [`ROUTER.md`](./ROUTER.md), which maps the request's deep-loop intent to the packet-local leaf resources that mode loads.
The advisor routes every deep-loop query to the single identity `system-deep-loop`.
Resolve the mode with `node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt "<task>"`.
Compiled routing is the default. `route` loads its `targets`, `clarify` and `defer` ask, `reject` refuses.
An unclear deep-loop intent asks for disambiguation, because `routerPolicy.defaultMode` is `null`.
The `routerPolicy.defaultResource` list is only a defer-time suggestion, never a silent default.
The directive, the fallback, the checklist and the rest of the routing detail live in the final MACHINE ROUTER section.

---

## 3. HOW IT WORKS

### Terms

- **`workflowMode`**: the public active mode key, `research`, `review` or `ai-council`.
- **`runtimeLoopType`**: the graph-backed convergence key that `runtime/scripts/convergence.cjs` consumes, validated against `research|review|council`, explicitly `null` for a custom backend and never inferred from `workflowMode`.
- **`backendKind`**: `runtime-loop-type` for all three modes, which run on the `runtime/` convergence backend.
- **mode packet**: one of the three nested folders that owns its mode's convergence, state and artifact contract.
- **`runtime/`**: the frozen, MCP-free layer every mode consumes, holding the executor config, atomic state, coverage graph, Bayesian scoring, fan-out and council primitives.
- **`mode-registry.json`**: the registry that owns each mode's discriminator and its authoritative `packet` path.
- **`hub-router.json`**: stage one's signals, vocabulary classes and tie-break order.
- **`vocabularyClasses`**: the authored deep-loop vocabulary that stage one scores.
- **`UNKNOWN_FALLBACK`**: the load level the router returns, with its disambiguation checklist, when no mode resolves or the registry has no entry for the mode.
- **leaf**: a canonical `(workflowMode, leafResourceId)` pair from `leaf-manifest.json`.
- **`defer`**: the outcome that asks for disambiguation, which this hub reaches because `routerPolicy.defaultMode` is `null`.
- **advisor projection map**: one of the hardcoded advisor maps that a drift-guard test keeps equal to the registry projection.

### Layout
```
system-deep-loop/
  SKILL.md               # this routing hub (no per-mode logic)
  ROUTER.md              # stage-two surface router (deep-loop intent -> leaf sets)
  mode-registry.json     # the three-tier discriminator + advisorRouting (single source of truth)
  graph-metadata.json    # the ONE advisor identity for the whole skill
  deep-research/   deep-review/   deep-ai-council/   # active mode packets
  shared/synthesis/      # workflows-shared synthesis (e.g. emitResourceMap)
```

Always resolve a packet path through `mode-registry.json` instead of hardcoding it.
Each active mode packet keeps its own `SKILL.md`, `references/`, `scripts/`, `assets/`, `feature-catalog/` or `manual-testing-playbook/`, as applicable, with internal paths repointed.
Mode packets have **no per-packet `graph-metadata.json`**. Only this hub carries one, so the advisor discovers exactly one skill.
The `deep-ai-council` packet folder follows the standard `folder == packetSkillName` convention (`deep-ai-council`).
Its legacy public surfaces, the `/deep:ai-council` command and the `ai-council` agent, intentionally keep the shorter `ai-council` key.

### Backend
All modes consume `runtime/`, a frozen, MCP-free layer.
It provides executor config, prompt-pack, validation, atomic state, coverage-graph, Bayesian scoring, fan-out and the council primitives.
The offline fan-out pair replay at `runtime/scripts/score-fanout-pairs.cjs` reads the merge's own decisions on near-line and cross-body pairs.
It compares a backend's judgment with the operator's labels and makes no model call by default.
Until the operator has labeled 40 pairs, 10 of them cross-body, it prints `stop: fewer than 40 labeled pairs`.
It runs its `--jev` arm only with `--out <dir>` and past that backend's own gate.
It leaves the merge unchanged.

---

## 4. RULES

### ✅ ALWAYS
- **ALWAYS** resolve a mode through `mode-registry.json` (read the `packet` key; never hardcode a router mapping or packet path in the hub).
- **ALWAYS** keep advisor projection maps hardcoded and drift-guarded against the registry; command mode routing is still hardcoded in the command files and does not resolve through `mode-registry.json`.
- **ALWAYS** keep each mode's convergence/state/artifact contract in its packet — the hub stays logic-free.
- **ALWAYS** keep exactly one `graph-metadata.json` (this hub's) so the advisor sees one skill identity, whether a mode is reached via `Skill(system-deep-loop)`, a `/deep:*` command, or an agent.
- **ALWAYS** keep the root `ROUTER.md` `RESOURCE_MAP` in sync with `leaf-manifest.json` — the leaf sets dual-read to canonical typed pairs at the one contract boundary.
- **ALWAYS** keep `Skill(system-deep-loop)` hub routing, the `/deep:*` commands, and the agent types as complementary surfaces over the same packets — never let one surface fork per-mode logic out of its packet.

### ⛔ NEVER
- **NEVER** infer `runtimeLoopType` from `workflowMode` — read it from the registry (explicit `null` is load-bearing).
- **NEVER** add a `graph-metadata.json` or a discoverable skill marker inside a mode packet or `shared/`.
- **NEVER** let a CLI lineage dispatch a nested executor for its own iteration, and prefer not to edit tracked files in a checkout with a live lineage (write containment reports them against that lineage; it no longer reverts them, and a lane that produced its artifacts still completes). Both rules live in `deep-research/references/protocol/loop-protocol.md` under "Executor Resolution".

### ⚠️ ESCALATE IF
- A new mode is needed beyond the three registered — extend `mode-registry.json` and open a packet, do not bolt logic onto the hub.
- A change would require the runtime to gain MCP tools — that contradicts the architecture; escalate.

---

## 5. REFERENCES

- Backend: `.skilled/skills/system-deep-loop/runtime/` (frozen, consumed by every mode; nested infrastructure, not a separate skill).
- Mode packets: `deep-research/SKILL.md`, `deep-review/SKILL.md`, `deep-ai-council/SKILL.md` (per-mode detail).
- Commands: the active `/deep:*` commands under `.skilled/commands/deep/` (complementary surface).
- Registry: `mode-registry.json` (the routing contract — the authoritative `packet` paths).
- Surface router: `ROUTER.md` (deep-loop intent to packet-local leaf sets).

---

## 6. SUCCESS CRITERIA

- The hub resolves one primary active `workflowMode` for the request through `mode-registry.json` (never by array order).
- The selected mode packet owns the detailed convergence/state/artifact workflow; the hub stayed routing-only.
- `Skill(system-deep-loop[, hint])` reaches a mode, and the `/deep:*` commands and agent types still reach the same packets.
- Exactly one `graph-metadata.json` exists for the whole skill; no packet carries its own.

---

## 7. INTEGRATION POINTS

### Modes
- `research` — outward web + code iterative investigation (`research/research.md`).
- `review` — iterative review loop, P0/P1/P2 findings + verdict.
- `ai-council` — multi-seat planning deliberation (`ai-council/**` artifacts).

### Surfaces and Consumers
- `Skill(system-deep-loop)` is the invokable hub; active `/deep:*` commands and the agent types (`deep-research`, `deep-review`, `ai-council`) are complementary surfaces over the same packets.
- `runtime/` is the frozen, MCP-free backend every mode consumes (nested infrastructure, not a separate skill).
- `/speckit:plan` consumes `@context` packages plus research/review outputs; spec-folder docs consume research/review output.

---

## 8. RELATED RESOURCES

- Pattern: `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` (parent-skill hub + nested packets, the one-graph-metadata invariant).
- Sibling example: `.skilled/skills/sk-prompt/` (the same invokable-hub + `mode-registry.json` Option E pattern).
- Registry: `mode-registry.json` (this hub's routing contract).

---

## 9. MACHINE ROUTER

The hub's compiled-routing directive, its stage-two surface-router pointer, the frontmatter tool-grant note, the discriminator, the routing rule and the remaining routing detail live here, so the routing prose above stays short.

> **Compiled routing (default-on, flag-gated, additive).** Resolve the mode via the compiled router contract first:
> ```bash
> node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt "<task>"
> ```
> Follow the returned decision — `route` (use its `targets`), `clarify`/`defer` (disambiguate), `reject` (refuse). On a `{"servingAuthority":"legacy"}` sentinel or any error, use the routing below. The front door self-gates on serving-authority. Compiled routing is now the default for `system-deep-loop`; set `SPECKIT_COMPILED_ROUTING=0` to force legacy routing fleet-wide — the explicit kill-switch.

### Surface Router — per-mode leaf sets

Stage 2 of routing lives in `ROUTER.md` at the hub root, next to `SKILL.md` and `README.md`. It defines three things:
- The per-mode leaf-intent model: the research loop protocol/state/convergence leaves, the review loop protocol/completion/convergence leaves, and the ai-council loop protocol/scoring/output-schema leaves.
- The machine-readable `DEFAULT_RESOURCE` / `INTENT_SIGNALS` / `RESOURCE_MAP` block that the deterministic router-replay and benchmarks parse.
- The how-to-read rules: a dominant intent → one leaf set; near-tied intents → deduped union; no keyword match → hub `defer`, never a silent default to a mode.

Every `RESOURCE_MAP` path is packet-qualified and converts to the canonical `(workflowMode, leafResourceId)` pair at the one contract boundary.

`ROUTER.md` stays a separate document on purpose; [the parent-skill reference](../sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md#why-the-leaf-router-stays-in-routermd) gives the reason once.

This hub is an intent/registry router, not a keyed resource-discovery router.
At runtime, it omits `discover_markdown_resources` and only guards registry-selected packet loads.
It never selects hub-level `references/<key>/` or `assets/<key>/` resources by runtime key.
It also carries a second-layer surface router in the root `ROUTER.md`.
That router is a benchmark/replay artifact, mirroring sk-prompt/sk-code. It maps a resolved mode's intent to packet-qualified child leaves so router-replay can emit canonical `{workflowMode, leafResourceId}` typed pairs against `leaf-manifest.json`.
The surface layer never re-decides the mode and is not a runtime hub discovery surface.
The hub still routes by `workflowMode` through `mode-registry.json` alone.

### Note on the frontmatter `allowed-tools` grant

The hub's own routing logic is read-only: it classifies, guards a path and loads a packet.
Under the two-axis hub canon contract, a hub's `allowed-tools` list MUST equal the exact union of every registered mode's `toolSurface.allowed` in `mode-registry.json`.
This hard invariant is enforced by `parent-skill-check.cjs` (check 3j: "hub allowed-tools equals the union of mode tool surfaces").
Narrowing the frontmatter grant to what routing-only logic needs would fail that check.
It would also break every mode whose `toolSurface` is not a subset of the narrowed list.
Treat the breadth of `allowed-tools` as evidence of the child modes' combined needs, not of mutating logic living in the hub.

### The three-tier discriminator
- **`workflowMode`** — the public active mode key: `research`, `review`, and `ai-council`.
- **`runtimeLoopType`** — the graph-backed convergence key consumed by `runtime/scripts/convergence.cjs` (validated against active `research|review|council`). **Explicit `null` for custom backends; never inferred from `workflowMode`.** Note `ai-council` maps to `runtimeLoopType: council`.
- **`backendKind`** — which backend runs the mode: `runtime-loop-type` (research/review/ai-council).

### Routing rule
```
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether this is research, review, or ai-council work",
    "Confirm the target artifact: research.md, a review verdict, or ai-council deliberation artifacts",
    "Confirm the matching /deep:* command or agent type when one is already known",
    "Confirm the backend expectations: runtimeLoopType (research/review/council)",
]

classify the request to a workflowMode (dominant deep-loop intent; mode hint like "research: ..." overrides)
guard mode-registry.json inside SKILL_ROOT and read it as data
if classifier confidence is low or no mode dominates:
  → return UNKNOWN_FALLBACK with disambiguation_checklist = UNKNOWN_FALLBACK_CHECKLIST
else:
  → resolve workflowMode from the hint / classified intent (or the /deep:* command / advisor alias)
  → find registry[mode]; if missing, return UNKNOWN_FALLBACK instead of loading a guessed path
  → guard registry[mode].packet/SKILL.md inside SKILL_ROOT and load it only if the packet directory and SKILL.md both exist
       e.g. registry["research"].packet → system-deep-loop/deep-research/SKILL.md
  → if registry[mode].runtimeLoopType !== null: backend = convergence.cjs --loop-type <runtimeLoopType>
```

Before router-driven loads call `load()`, use `_guard_in_skill(relative_path)`.
Reject paths that escape this skill or do not end in `.md`.
Before loading, check `if packet_base.exists()` and `if packet_skill.exists()`.
The fallback must name the unresolved `workflowMode` when known and avoid loading any guessed packet.
Ask the operator to provide one of the registered modes or the matching `/deep:*` command.

Intent classification favors the single dominant active deep-loop mode.
A mode hint (`research: ...`, `review: ...`, `ai-council: ...`) overrides the classifier.
The legacy advisor projection maps stay hardcoded and drift-guarded against the registry.
The command files remain static routers with hardcoded asset/mode routing. Neither resolves from `mode-registry.json` at runtime, but both stay equal to its projection.

Per-mode behavior is **not flattened**.
Each active packet keeps its own convergence math, state shape, artifacts and tool-permission guards. Research has WebFetch; review/ai-council are code/inward-only.
This hub preserves exactly one `graph-metadata.json`, so the advisor discovers exactly one skill identity.
That remains true whether a mode is reached through the hub `Skill()`, a `/deep:*` command or an agent.
