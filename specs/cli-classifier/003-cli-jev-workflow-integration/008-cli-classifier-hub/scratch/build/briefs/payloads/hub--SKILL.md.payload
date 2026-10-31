---
name: cli-classifier
description: "Routes local classifier judgment requests to the cli-deem transport through mode-registry.json. Holds no packet-local logic."
allowed-tools: [Read, Bash, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: cli-classifier, cli-deem, local classifier, deem, deem model, deem judgment, deem health, deem noul, deem choice, deem score, local deem server -->

# cli-classifier - Local Classifier Transport Hub

One public skill identity for classifier models served on this machine. This hub holds no packet-local logic. It routes by `workflowMode` through `mode-registry.json` and uses `hub-router.json` for router policy, signals and outcomes.

---

## 1. WHEN TO USE

Use this skill when a request needs a typed judgment from a locally served classifier or needs to know whether one is usable.

| Packet | Kind | Use it for | Tool posture |
|--------|------|------------|--------------|
| `cli-deem` | transport | A Deem availability check, a probability, one option key, an ordered level or a batch of keyed answers | Read and Bash only, mutates nothing |

### When NOT to Use

- Work that needs an edit, a review or a multi-step process. Dispatch the judgment to `cli-deem` and pair it with a workflow mode.
- Starting, stopping or updating the Deem server. That is the operator's step with `deem-ctl`.
- A hosted judgment service with a stored key. That belongs to the hub that owns that service.

---

## 2. SMART ROUTING

Routing is registry-driven. `mode-registry.json` lists every packet. `hub-router.json` decides whether the result is the single transport or a defer. The hub declares a bundle outcome because every parent hub must. With one registered mode it never produces one.

> **Compiled routing (default-on, flag-gated, additive).** Resolve the mode via the compiled router contract first:
> ```bash
> node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "<task>"
> ```
> Follow the returned decision: `route` (use its `targets`), `clarify`/`defer` (disambiguate), `reject` (refuse). On a `{"servingAuthority":"legacy"}` sentinel or any error, use the routing below. The front door self-gates on serving-authority. Set `SPECKIT_COMPILED_ROUTING=0` to force legacy routing fleet-wide. That is the explicit kill-switch.

`cli-classifier` has no compiled activation manifest, so the directive above returns the legacy sentinel until the hub is admitted to compiled routing. Until then the routing below decides.

### Two-Axis Model

- `packetKind: "transport"` marks a bridge to an external tool. It selects a value and never mutates this workspace.
- A transport declares `mutatesWorkspace: false`, forbids `Write`, `Edit` and `Task` and is registered under the `transport-axis` extension.
- The advisor resolves the hub identity and stays blind to the transport (`routingClass: "metadata"`). The hub owns the resolution.

### Routing Rule

```text
read hub-router.json
  -> score routerSignals and vocabularyClasses
  -> apply routerPolicy.tieBreak
  -> read mode-registry.json for packetKind, backendKind, toolSurface and advisorRouting
  -> load the selected packet
```

### Outcomes

- `single`: one dominant Deem judgment intent routes to `cli-deem`.
- `orderedBundle`: declared, never produced. The router bundles only when two registered modes both match. This hub registers one.
- `defer`: unclear intent asks for disambiguation rather than guessing a value.

---

## 3. HOW IT WORKS

### Layout

```text
cli-classifier/
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
  cli-deem/
    SKILL.md
    README.md
    references/
    feature-catalog/
    scripts/
    changelog/
```

### Companion Metadata

- `mode-registry.json` owns `workflowMode`, `packetKind`, `backendKind`, `toolSurface`, packet folder identity, aliases and `advisorRouting`. Its `transport-axis` extension lists the transports.
- `hub-router.json` owns `routerPolicy`, `routerSignals`, `vocabularyClasses` and outcomes.
- `ROUTER.md` is the stage-two control document, `router_state: stage1-only` until an author promotes it with a concrete leaf map.
- `description.json` owns hub-doctor metadata.
- `graph-metadata.json` is the one skill-graph identity node for the hub.

### Extensions

- `transport-axis`: declares `transports: ["cli-deem"]`. The per-hub gate enforces the whole transport contract: routingClass `metadata`, `mutatesWorkspace: false`, the forbidden tool set and membership in the axis.

---

## 4. RULES

### ALWAYS

- Resolve the packet through `mode-registry.json`. Never hardcode the transport's path in prose-only logic.
- Keep `SKILL.md` thin: routing, invariants and navigation only.
- Keep `cli-deem` non-mutating. The transport returns a value and selects. A workflow mode acts.
- Keep the transport `routingClass: "metadata"`. The hub resolves it and the advisor stays blind to the axis.
- Keep exactly one `graph-metadata.json`, at the hub root.

### NEVER

- Never grant `Write`, `Edit` or `Task` to the transport.
- Never add a second packet array or a packet-local `graph-metadata.json`.
- Never let a transport complete a task on its own.
- Never start the Deem server from this hub or its packet.

### ESCALATE IF

- A request needs a judgment and an edit but no workflow mode is selected. Report the gap instead of mutating from a transport.
- `cli-deem health` exits non-zero. Deem is not usable for this run. The hub says so rather than inventing a judgment.

---

## 5. REFERENCES

- Registry: [`mode-registry.json`](./mode-registry.json).
- Router: [`hub-router.json`](./hub-router.json).
- Root router: [`ROUTER.md`](./ROUTER.md).
- Transport packet: [`cli-deem/SKILL.md`](./cli-deem/SKILL.md), [`cli-deem/references/wire-contract.md`](./cli-deem/references/wire-contract.md), [`cli-deem/references/deem-ctl-lifecycle.md`](./cli-deem/references/deem-ctl-lifecycle.md), [`cli-deem/references/model-pin.md`](./cli-deem/references/model-pin.md).
- Hub metadata: [`description.json`](./description.json), [`graph-metadata.json`](./graph-metadata.json), [`leaf-manifest.json`](./leaf-manifest.json).
- Hub changelog: [`changelog/v1.0.0.0.md`](./changelog/v1.0.0.0.md).

---

## RELATED RESOURCES

- `manual-testing-playbook/manual-testing-playbook.md` - the hub's operator-facing scenario index.
- `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md` - the parent-hub pattern this hub follows.
