---
name: system-skilled-bots
description: "Parent hub for four bot modes: author, run, schedule and status of file-defined headless bots. Routes by workflowMode through mode-registry.json."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
metadata:
  family: system
---

<!-- Keywords: system-skilled-bots, mode-registry, hub-router, workflowMode, packetKind, bots-author, bots-run, bots-schedule, bots-status, headless-bot, bot-md, bots-cli, launchd -->

# Skilled Bots Hub (system-skilled-bots)

One skill, four bot modes, one advisor identity. A bot is a `BOT.md` file under a repository's `bots/` folder, run headless by hand, on a launchd schedule or from a queued request. The hub reads `hub-router.json` to resolve a `workflowMode` and delegates through `mode-registry.json`. It holds no per-mode logic: each mode keeps its contract in its own packet, and the runtime under `runtime/` holds every rule the modes call.

**Version authority.** This file's `version` matches the newest entry under `changelog/`. The hub metadata files carry the same value.

---

## 1. WHEN TO USE

Use this hub for a request about a file-defined bot: writing one, running one, putting one on a schedule or reading what the bots did. This table lists all 4 mode packets.

| Mode | Use it for | Packet | Command |
|------|------------|--------|---------|
| **author** | Write or edit a `BOT.md` from the shipped template. The check runs under `/doctor:bots` | `bots-author/` | `/bots:author` |
| **run** | Run a bot, queue a run, drain the queue or answer a bot's needs-you item | `bots-run/` | `/bots:run` |
| **schedule** | Install or remove a bot's launchd schedule, and pause, resume, enable or disable a bot | `bots-schedule/` | `/bots:schedule` |
| **status** | Read installed bots, last runs, deliveries and the needs-you inbox | `bots-status/` | `/bots:status` |

`bots inbox` belongs to status and `bots answer` belongs to run. Neither has a mode of its own.

`bots chat` belongs to run as well. Each message it sends is one bot run, and the thread is kept in a conversation file under the state root.

`bots ui` belongs to status too. It opens the terminal screen, a live status surface over the same reads that can also answer a needs-you item.

### When NOT to Use

- A request that never names a bot, such as running tests, scheduling a meeting or reading a build status. Those belong to other skills.
- Checking a repository's bot definitions as a doctor task. Use `/doctor:bots`, which runs the definition checker read-only.
- Changing the bots runtime itself. That is code work under `runtime/`, not a mode of this hub.

---

## 2. SMART ROUTING

`hub-router.json` scores the request against its vocabulary classes. It then selects one `workflowMode`, an ordered bundle or a defer outcome. `mode-registry.json` maps that mode to its packet folder. The root [`ROUTER.md`](./ROUTER.md) holds the hub's routing directive and its fallback checklist, so read it before selecting a packet.

Every signal is anchored on the word bot or the bot-only term needs-you, because bare verbs like run, schedule and status also name unrelated work. A bot request that names no mode defers: ask which mode the reader means, using the table above.

---

## 3. HOW IT WORKS

### Terms

- **`workflowMode`**: the public mode key the hub resolves to one bot packet.
- **`packetKind`**: the axis a mode sits on. Every mode here is `workflow`.
- **`backendKind`**: which backend runs the mode. `template-scaffold` for author, `bots-cli` for the three modes that run a verb of `.skilled/bin/bots.cjs`.
- **advisor routing class**: how the advisor finds a mode. Every mode here is `metadata`, so the advisor routes this hub and the hub picks the mode.
- **needs-you item**: a question a run parked for the operator. Status lists it, and run answers it.
- **`defer`**: the outcome that asks for disambiguation when a bot request names no mode.

### Layout

```text
system-skilled-bots/
  SKILL.md
  README.md
  mode-registry.json
  hub-router.json
  ROUTER.md
  description.json
  graph-metadata.json
  leaf-manifest.json
  changelog/
  manual-testing-playbook/
  feature-catalog/  the current-state feature inventory
  benchmark/
  shared/
  assets/          the BOT.md template
  scripts/         the definition checker
  runtime/         the bots runtime and its tests
  bots-author/
  bots-run/
  bots-schedule/
  bots-status/
```

### Companion metadata

- `mode-registry.json` owns the workflow mode, packet kind, backend kind, tool surface, packet identity, aliases and advisor routing class.
- `hub-router.json` owns stage-one policy, signals, vocabulary classes and tie-break order.
- `ROUTER.md` owns the hub routing directive and the stage-two maps that pick the selected mode's leaves.
- `description.json` and the single hub `graph-metadata.json` provide advisor discovery without a second identity for any mode.
- `leaf-manifest.json` is generated from packet resources. Never hand-edit it.

---

## 4. RULES

### ALWAYS

- Resolve packets through `mode-registry.json`. Packet roots are never hardcoded in routing logic.
- Keep this hub thin. Command and runtime behavior belongs in the packet and in `runtime/`.
- Keep registry modes and router signal keys bidirectionally aligned.
- Replay a real prompt through both routing stages, and each alias against an out-of-domain phrase, whenever aliases or signal classes change.

### NEVER

- Never add a second packet array or a second advisor identity for a hub member.
- Never anchor an alias on a bare verb such as run, schedule or status.
- Never restate a runtime rule here. The runtime owns every field rule, path and default.

### ESCALATE IF

- A new bot verb fits none of the four modes.
- Registry modes, stage-one signals or generated manifest entries disagree.
- A mode needs a tool its `toolSurface` does not grant.

---

## 5. REFERENCES

- [`mode-registry.json`](mode-registry.json): canonical mode identity and tool surface.
- [`hub-router.json`](hub-router.json): stage-one policy and signal classes.
- [`ROUTER.md`](ROUTER.md): the hub routing directive and its fallback checklist.
- [`README.md`](README.md): operator-facing hub overview.
- [`feature-catalog/feature-catalog.md`](feature-catalog/feature-catalog.md): current-state feature inventory.
