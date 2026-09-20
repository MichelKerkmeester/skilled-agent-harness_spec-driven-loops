---
name: cli-jev
description: "Routes Jev typed-judgment requests to the cli-usage transport through mode-registry.json; holds no packet-local logic."
allowed-tools: [Read, Bash, Grep, Glob]
version: 0.2.0.0
---

<!-- Keywords: cli-jev, cli-usage, jev, typed judgment, transport, noul, choice, score, run, jev-mcp -->

# cli-jev - Typed-Judgment Transport Hub

One public skill identity with one `packetKind: "transport"` packet. This hub holds no packet-local logic. It routes by `workflowMode` through `mode-registry.json` and uses `hub-router.json` for router policy, signals and outcomes.

---

## 1. WHEN TO USE

Use this skill when a request needs a typed judgment from the `jev` CLI or its MCP surface.

| Packet | Kind | Use it for | Tool posture |
|--------|------|------------|--------------|
| `cli-usage` | transport | One typed judgment: a probability, one option key, an ordered score position, or a batch of keyed answers | Read/Bash only, mutates nothing |

### When NOT to Use

- Work that needs an edit, a review, or a multi-step process: dispatch the judgment to `cli-usage` and pair it with a workflow mode.
- Running `jev-mcp` from a shell: its stdio carries MCP frames, so it belongs in an MCP host configuration.
- Anything outside Jev typed judgments.

---

## 2. SMART ROUTING

Routing is registry-driven. `mode-registry.json` lists every packet, and `hub-router.json` decides whether the result is the single transport, a defer, or a bundle where the transport supplies the judgment and a workflow mode acts.

> **Compiled routing (default-on, flag-gated, additive).** Resolve the mode via the compiled router contract first:
> ```bash
> node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "<task>"
> ```
> Follow the returned decision — `route` (use its `targets`), `clarify`/`defer` (disambiguate), `reject` (refuse). On a `{"servingAuthority":"legacy"}` sentinel or any error, use the routing below. The front door self-gates on serving-authority. Compiled routing is now the default for `cli-jev`; set `SPECKIT_COMPILED_ROUTING=0` to force legacy routing fleet-wide — the explicit kill-switch.

### Two-Axis Model

- `packetKind: "transport"` means a bridge to an external tool's CLI/MCP surface: it selects a value and never mutates this workspace.
- A transport declares `mutatesWorkspace: false`, forbids `Write`, `Edit` and `Task`, and is registered under the `transport-axis` extension.
- The advisor resolves the hub identity and stays blind to the transport (`routingClass: "metadata"`), so the hub owns the resolution.

### Routing Rule

```text
read hub-router.json
  -> score routerSignals and vocabularyClasses
  -> apply routerPolicy.tieBreak (a workflow mode outranks a transport)
  -> read mode-registry.json for packetKind, backendKind, toolSurface and advisorRouting
  -> load the selected packet
```

### Outcomes

- `single`: one dominant judgment intent routes to `cli-usage`.
- `orderedBundle`: a judgment intent paired with a workflow intent dispatches the workflow first, with the transport attached as the judgment source.
- `defer`: unclear intent asks for disambiguation rather than guessing a value.

---

## 3. HOW IT WORKS

### Layout

```text
cli-jev/
  SKILL.md
  README.md
  mode-registry.json
  hub-router.json
  ROUTER.md                     # stage-two control, stage1-only
  description.json
  graph-metadata.json
  leaf-manifest.json
  changelog/
  manual-testing-playbook/
  benchmark/
  shared/
  cli-usage/
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

- `mode-registry.json` owns `workflowMode`, `packetKind`, `backendKind`, `toolSurface`, packet folder identity, aliases and `advisorRouting`; the `transport-axis` extension lists the transports.
- `hub-router.json` owns `routerPolicy`, `routerSignals`, `vocabularyClasses` and outcomes.
- `ROUTER.md` is the stage-two control document, `router_state: stage1-only` until an author promotes it with a concrete leaf map.
- `description.json` owns hub-doctor metadata.
- `graph-metadata.json` is the one skill-graph identity node for the hub.

### Extensions

- `transport-axis`: declares `transports: ["cli-usage"]`. The per-hub gate enforces the whole transport contract (routingClass `metadata`, `mutatesWorkspace: false`, the forbidden tool set, and membership in the axis).

---

## 4. RULES

### ALWAYS

- Resolve the packet through `mode-registry.json`; never hardcode the transport's path in prose-only logic.
- Keep `SKILL.md` thin: routing, invariants and navigation only.
- Keep `cli-usage` non-mutating: the transport returns a value and selects, while a workflow mode acts.
- Keep the transport `routingClass: "metadata"`: the hub resolves it, and the advisor stays blind to the axis.
- Keep exactly one `graph-metadata.json`, at the hub root.

### NEVER

- Never grant `Write`, `Edit` or `Task` to the transport.
- Never add a second packet array or a packet-local `graph-metadata.json`.
- Never let a transport complete a task on its own.
- Never start `jev-mcp` from a shell.

### ESCALATE IF

- A request needs a judgment and an edit but no workflow mode is selected: report the gap instead of mutating from a transport.
- `command -v jev` fails: the transport is not routable on this machine, and the hub says so rather than inventing a judgment.

---

## 5. REFERENCES

- Registry: [`mode-registry.json`](./mode-registry.json).
- Router: [`hub-router.json`](./hub-router.json).
- Root router: [`ROUTER.md`](./ROUTER.md).
- Transport packet: [`cli-usage/SKILL.md`](./cli-usage/SKILL.md), [`cli-usage/references/cli-reference.md`](./cli-usage/references/cli-reference.md), [`cli-usage/references/providers-and-models.md`](./cli-usage/references/providers-and-models.md), [`cli-usage/references/integration-patterns.md`](./cli-usage/references/integration-patterns.md), [`cli-usage/references/mcp-server.md`](./cli-usage/references/mcp-server.md).
- Hub metadata: [`description.json`](./description.json), [`graph-metadata.json`](./graph-metadata.json), [`leaf-manifest.json`](./leaf-manifest.json).
- Hub changelog: [`changelog/v0.2.0.0.md`](./changelog/v0.2.0.0.md).

---

## RELATED RESOURCES

- `cli-usage/manual-testing-playbook/manual-testing-playbook.md` - the transport's operator-facing scenario index.
- `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` - the parent-hub pattern this hub follows.
