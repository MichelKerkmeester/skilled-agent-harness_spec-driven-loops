---
name: cli-classifier
description: "Routes typed classifier judgment requests to the hosted Jev transport via mode-registry.json; future classifiers join as modes."
allowed-tools: [Read, Bash, Grep, Glob]
version: 0.8.0.0
---

<!-- Keywords: cli-classifier, cli-jev, cli-usage, jev, typed judgment, jev-mcp, hosted classifier, noul, jev choice, jev score -->

# cli-classifier - Classifier Transport Hub

One public skill identity for typed classifier judgments. The hub holds the hosted Jev transport as mode `cli-jev` today, with its own packet. A future classifier backend joins as a new mode and packet. The hub holds no packet-local logic; it routes by `workflowMode` through `mode-registry.json` and uses `hub-router.json` for router policy, signals and outcomes.

---

## 1. WHEN TO USE

Use this skill when a request needs a typed judgment from a classifier or needs to know whether one is usable.

| Mode | Packet | Kind | Use it for | Tool posture |
|------|--------|------|------------|--------------|
| `cli-jev` | `cli-jev` | transport | A hosted Jev judgment through the `jev` CLI or its MCP surface: a probability, one option key, an ordered score position or a batch of keyed answers | Read and Bash only, mutates nothing |

This is the hub's only mode today. A future classifier backend belongs in its own new mode and packet. A caller names the classifier it wants, and transports never fail over silently.

### When NOT to Use

- Work that needs an edit, a review or a multi-step process. Dispatch the judgment to a transport and pair it with a workflow mode.
- Running `jev-mcp` from a shell. Its stdio carries MCP frames, so it belongs in an MCP host configuration.

---

## 2. SMART ROUTING

Routing is registry-driven. `mode-registry.json` lists every packet. `hub-router.json` decides whether the result is one transport, an ordered bundle or a defer. Today, only `cli-jev` is registered.

> **Compiled routing (default-on, flag-gated, additive).** Resolve the mode via the compiled router contract first:
> ```bash
> node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "<task>"
> ```
> Follow the returned decision: `route` (use its `targets`), `clarify`/`defer` (disambiguate), `reject` (refuse). On a `{"servingAuthority":"legacy"}` sentinel or any error, use the routing below. The front door self-gates on serving-authority. Compiled routing is now the default for `cli-classifier`. Set `SPECKIT_COMPILED_ROUTING=0` to force legacy routing fleet-wide. That is the explicit kill-switch.

### Surface Router — per-intent leaf sets

Stage 2 of routing lives in the hub root's `ROUTER.md`, next to `SKILL.md` and `README.md`, and ships `router_state: active`. It maps Jev judgment, question-shaping, provider and MCP intents to the exact packet-local leaf resources that mode loads. A future classifier mode can add its own intent and leaves. The two layers stay separate: the hub never emits leaf paths, and the surface router never re-decides the mode.

### Two-Axis Model

- `packetKind: "transport"` marks a bridge to an external tool. It selects a value and never mutates this workspace.
- A transport declares `mutatesWorkspace: false`, forbids `Write`, `Edit` and `Task` and is registered under the `transport-axis` extension.
- The advisor resolves the hub identity and stays blind to the transports (`routingClass: "metadata"`). The hub owns the resolution.

### Routing Rule

```text
read hub-router.json
  -> score routerSignals and vocabularyClasses
  -> apply routerPolicy.tieBreak (currently cli-jev)
  -> read mode-registry.json for packetKind, backendKind, toolSurface and advisorRouting
  -> load the selected packet
```

### Outcomes

- `single`: one dominant judgment intent routes to the registered transport, currently `cli-jev`.
- `orderedBundle`: a request that explicitly names multiple registered modes routes to them in `tieBreak` order when a matching bundle rule is configured.
- `defer`: unclear intent asks for disambiguation rather than guessing a value. A request that names only the hub defers, because the hub name does not choose a backend.

---

## 3. HOW IT WORKS

### Layout

```text
cli-classifier/
  SKILL.md
  README.md
  mode-registry.json
  hub-router.json
  ROUTER.md                     # stage-two surface router, active
  description.json
  graph-metadata.json
  leaf-manifest.json
  changelog/
  manual-testing-playbook/
  benchmark/
  shared/
  cli-jev/                      # mode cli-jev
    SKILL.md
    README.md
    references/
    assets/
    feature-catalog/
    manual-testing-playbook/
    benchmark/
    changelog/
```

### Companion Metadata

- `mode-registry.json` owns `workflowMode`, `packetKind`, `backendKind`, `toolSurface`, packet folder identity, aliases and `advisorRouting`. Its `transport-axis` extension lists the transports.
- `hub-router.json` owns `routerPolicy`, `routerSignals`, `vocabularyClasses` and outcomes.
- `ROUTER.md` is the stage-two surface router, `router_state: active`: the Jev intents map to packet-local leaves from `leaf-manifest.json`.
- `description.json` owns hub-doctor metadata.
- `graph-metadata.json` is the one skill-graph identity node for the hub.

### Extensions

- `transport-axis`: declares the currently registered transport, `cli-jev`. The per-hub gate enforces the whole transport contract: routingClass `metadata`, `mutatesWorkspace: false`, the forbidden tool set and membership in the axis.

### Offline Measurement

`benchmark/injection-screen/score-injection-screen.mjs` measures offline whether Jev's `noul` spots text that tries to instruct an agent better than flag-nothing or a fixed lexical screen. Its default run makes zero model calls; `--jev` runs the hosted classifier only after its gate passes. No hook screens fetched content, so no verdict is wired to anything. `shared/scripts/jev-transport.mjs` answers `choice` and `noul` questions through Pi's classifier runtime first when no transport is named, and through the `jev` CLI wherever Pi's preflight fails. `JEV_TRANSPORT=jev` forces the CLI, and `shared/scripts/tests/jev-transport.test.mjs` pins both paths with stubs and no socket.

---

## 4. RULES

### ALWAYS

- Resolve the packet through `mode-registry.json`. Never hardcode a transport's path in prose-only logic.
- Keep `SKILL.md` thin: routing, invariants and navigation only.
- Keep every registered transport non-mutating. A transport returns a value and selects. A workflow mode acts.
- Keep every transport `routingClass: "metadata"`. The hub resolves it and the advisor stays blind to the axis.
- Keep exactly one `graph-metadata.json`, at the hub root.

### NEVER

- Never grant `Write`, `Edit` or `Task` to a transport.
- Never add a second packet array or a packet-local `graph-metadata.json`.
- Never let a transport complete a task on its own.
- Never fail over from one backend to another without the caller asking for it.
- Never start `jev-mcp` from a shell.

### ESCALATE IF

- A request needs a judgment and an edit but no workflow mode is selected. Report the gap instead of mutating from a transport.
- `command -v jev` fails. Mode `cli-jev` is not routable on this machine, and the hub says so rather than inventing a judgment. Point the user at `uv tool install jev-cli`.

---

## 5. REFERENCES

- Registry: [`mode-registry.json`](./mode-registry.json).
- Router: [`hub-router.json`](./hub-router.json).
- Root router: [`ROUTER.md`](./ROUTER.md).
- Mode `cli-jev`: [`cli-jev/SKILL.md`](./cli-jev/SKILL.md), [`cli-jev/references/cli-reference.md`](./cli-jev/references/cli-reference.md), [`cli-jev/references/providers-and-models.md`](./cli-jev/references/providers-and-models.md), [`cli-jev/references/integration-patterns.md`](./cli-jev/references/integration-patterns.md), [`cli-jev/references/mcp-server.md`](./cli-jev/references/mcp-server.md).
- Hub metadata: [`description.json`](./description.json), [`graph-metadata.json`](./graph-metadata.json), [`leaf-manifest.json`](./leaf-manifest.json).
- Hub changelog: [`changelog/v0.8.0.0.md`](./changelog/v0.8.0.0.md).

---

## RELATED RESOURCES

- `manual-testing-playbook/manual-testing-playbook.md` - the hub's operator-facing scenario index.
- `cli-jev/manual-testing-playbook/manual-testing-playbook.md` - the `cli-jev` transport's own scenario index.
- `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` - the parent-hub pattern this hub follows.
