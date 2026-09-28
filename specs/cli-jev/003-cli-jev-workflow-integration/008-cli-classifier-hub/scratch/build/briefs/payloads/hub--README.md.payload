---
title: "cli-classifier"
description: "The hub for classifier models served on this machine. It routes a typed-judgment request to the cli-deem transport through mode-registry.json."
trigger_phrases:
  - "cli-classifier hub"
  - "local classifier hub"
version: 1.0.0.0
---

# cli-classifier

> One skill identity for asking a classifier on this machine for a typed answer.

A local classifier answers in about 60 ms with no key and no quota. Every feature that wants one needs the same two things: a way to learn whether the model is up and a client that speaks its wire. This hub gives both one home.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Typed judgments from a locally served classifier, starting with Deem |
| **Invoke with** | A request that names Deem or `cli-deem`. The advisor resolves the hub |
| **Routes to** | The `cli-deem` transport, through `mode-registry.json` and `hub-router.json` |
| **Produces** | One JSON answer from `cli-deem` with an exit code that names the outcome |

---

## 2. OVERVIEW

### What It Does

`cli-classifier` is one public advisor identity over one `packetKind: "transport"` packet. The hub holds no packet-local logic. `mode-registry.json` resolves the mode. `leaf-manifest.json` inventories the leaves the mode can load. The transport asks the local Deem server for a probability, one option key, an ordered level or a batch of keyed answers. It never writes into this workspace.

### Why It Matters

- **One availability rule:** every feature that can use Deem calls `cli-deem health` and reads one exit code.
- **Nothing leaves the machine:** the client sends no key and talks only to a loopback address, `127.0.0.1:8300` by default.
- **Room to grow:** another local classifier becomes a second transport in the same registry, not a new hub.

```text
request that names Deem
   |
   v
advisor  -->  cli-classifier  -->  hub-router.json  -->  cli-deem
                                                           |
                                                           v
                                          one JSON answer and an exit code
```

---

## 3. MODES AND PACKETS

The hub registers one mode today. The registry lists it and the router picks it.

| Packet | Kind | Use it for | Pointer |
|---|---|---|---|
| `cli-deem/` | transport | The Deem availability check and typed judgments from the local Deem model | [`README.md`](./cli-deem/README.md) |

---

## 4. NAVIGATION

| File | What it holds | Why it matters |
|---|---|---|
| [`SKILL.md`](./SKILL.md) | The hub's routing contract and rules | The entry point an agent loads |
| [`mode-registry.json`](./mode-registry.json) | The single source of truth for every mode | Resolve which packet owns a request |
| [`hub-router.json`](./hub-router.json) | Router policy, signals and vocabulary classes | See which phrases pick `cli-deem` |
| [`ROUTER.md`](./ROUTER.md) | The stage-two control document, `stage1-only` | Promote it only with a concrete leaf map |
| [`leaf-manifest.json`](./leaf-manifest.json) | The generated inventory of routed leaves | Find the references a mode loads |

The manifest regenerates when packets change, so read it as a snapshot.

---

## 5. CHANGELOG

Releases live in `changelog/` with one file per release, named `v[version].md`.

| Release | Entry |
|---|---|
| v1.0.0.0 | [`changelog/v1.0.0.0.md`](./changelog/v1.0.0.0.md) |

---

## 6. VERIFICATION

| Check | Command | Expected |
|---|---|---|
| Hub contract | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` | exit 0 |
| README structure | `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/cli-classifier/README.md --type readme` | zero issues |
| Client tests | `node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/` | exit 0 |
