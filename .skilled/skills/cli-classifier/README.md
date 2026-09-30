---
title: "cli-classifier"
description: "The hub for classifier models that return typed judgments. It routes a request to the cli-jev transport (hosted Jev) or the cli-deem transport (local Deem) through mode-registry.json."
trigger_phrases:
  - "cli-classifier hub"
  - "local classifier hub"
  - "jev judgment hub"
version: 0.4.0.0
---

# cli-classifier

> One skill identity for asking a classifier for a typed answer, from the hosted Jev service or from the Deem model on this machine.

Every feature that wants a typed judgment needs the same two things: a way to learn whether the backend is usable and a client that speaks its wire. This hub gives both backends one home. Jev answers through the `jev` CLI with a stored key. Deem answers in about 60 ms from a loopback server with no key and no quota.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Typed judgments from the hosted Jev service or from the locally served Deem model |
| **Invoke with** | A request that names Jev, Deem, `cli-jev` or `cli-deem`. The advisor resolves the hub |
| **Routes to** | Mode `cli-jev` (packet `cli-jev`) or mode `cli-deem`, through `mode-registry.json` and `hub-router.json` |
| **Produces** | One typed value from the chosen transport, with an exit code that names the outcome |

---

## 2. OVERVIEW

### What It Does

`cli-classifier` is one public advisor identity over two `packetKind: "transport"` packets. The hub holds no packet-local logic. `mode-registry.json` resolves the mode. `leaf-manifest.json` inventories the leaves each mode can load. Mode `cli-jev` runs over the packet folder `cli-jev` and bridges the `jev` CLI and MCP surface. Mode `cli-deem` asks the local Deem server. Either returns a probability, one option key, an ordered level or a batch of keyed answers, and neither writes into this workspace.

### Why It Matters

- **A caller names its backend:** the two transports answer the same judgment types and never fail over to each other silently.
- **One availability rule per backend:** `command -v jev` gates Jev, and `cli-deem health` gates Deem with one exit code.
- **Nothing leaves the machine for Deem:** its client sends no key and talks only to a loopback address, `127.0.0.1:8300` by default.

```text
request that names Jev or Deem
   |
   v
advisor  -->  cli-classifier  -->  hub-router.json  -->  cli-jev  or  cli-deem
                                                           |
                                                           v
                                          one typed answer and an exit code
```

---

## 3. MODES AND PACKETS

The hub registers two modes. The registry lists them and the router picks one, or both in tie-break order when a request names both backends.

| Mode | Packet | Kind | Use it for | Pointer |
|---|---|---|---|---|
| `cli-jev` | `cli-jev/` | transport | Hosted Jev judgments through the `jev` CLI and its MCP surface | [`README.md`](./cli-jev/README.md) |
| `cli-deem` | `cli-deem/` | transport | The Deem availability check and typed judgments from the local Deem model | [`README.md`](./cli-deem/README.md) |

---

## 4. NAVIGATION

| File | What it holds | Why it matters |
|---|---|---|
| [`SKILL.md`](./SKILL.md) | The hub's routing contract and rules | The entry point an agent loads |
| [`mode-registry.json`](./mode-registry.json) | The single source of truth for every mode | Resolve which packet owns a request |
| [`hub-router.json`](./hub-router.json) | Router policy, signals and vocabulary classes | See which phrases pick `cli-jev` or `cli-deem` |
| [`ROUTER.md`](./ROUTER.md) | The stage-two control document, `stage1-only` | Promote it only with a concrete leaf map |
| [`leaf-manifest.json`](./leaf-manifest.json) | The generated inventory of routed leaves | Find the references a mode loads |
| [`benchmark/injection-screen/`](./benchmark/injection-screen/) | The offline injection screen scorer and its tests | Its default run makes zero model calls. `--jev` and `--deem` each add one backend behind that backend's own gate |

The manifest regenerates when packets change, so read it as a snapshot.

---

## 5. CHANGELOG

Releases live in `changelog/` with one file per release, named `v[version].md`. The two `v0.x` entries are the Jev hub's own releases from before it became mode `cli-jev` here.

| Release | Entry |
|---|---|
| v0.5.0.0 | [`changelog/v0.5.0.0.md`](./changelog/v0.5.0.0.md) |
| v0.4.0.0 | [`changelog/v0.4.0.0.md`](./changelog/v0.4.0.0.md) |
| v0.3.0.0 | [`changelog/v0.3.0.0.md`](./changelog/v0.3.0.0.md) |
| v0.2.0.0 | [`changelog/v0.2.0.0.md`](./changelog/v0.2.0.0.md) |
| v0.1.0.0 | [`changelog/v0.1.0.0.md`](./changelog/v0.1.0.0.md) |

---

## 6. VERIFICATION

| Check | Command | Expected |
|---|---|---|
| Hub contract | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` | exit 0 |
| Compiled route | `node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "use jev choice to pick a queue"` | a single `cli-jev` target |
| README structure | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/cli-classifier/README.md --type readme` | zero issues |
| Client tests | `node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/` | exit 0 |
