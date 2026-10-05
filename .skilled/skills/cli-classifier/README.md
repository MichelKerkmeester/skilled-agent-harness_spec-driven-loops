---
title: "cli-classifier"
description: "The hub for typed classifier judgments. It holds cli-jev for hosted Jev today; future classifiers join as new modes with their own packets."
trigger_phrases:
  - "cli-classifier hub"
  - "local classifier hub"
  - "jev judgment hub"
version: 0.4.0.0
---

# cli-classifier

> One skill identity for typed classifier judgments. The hub holds `cli-jev` for hosted Jev today; a future classifier joins as a new mode with its own packet.

Each transport defines how to check its backend and return a typed judgment. The current mode, `cli-jev`, answers through the `jev` CLI with a stored key. The parent hub stays ready for another classifier mode without changing its public identity.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Typed judgments from the hosted Jev service; future classifiers can have their own modes |
| **Invoke with** | A request that names Jev, `cli-jev` or its `cli-usage` alias. The advisor resolves the hub |
| **Routes to** | The current mode `cli-jev` (packet `cli-jev`), through `mode-registry.json` and `hub-router.json` |
| **Produces** | One typed Jev value, with an exit code that names the outcome |

---

## 2. OVERVIEW

### What It Does

`cli-classifier` is one public advisor identity over its registered transport packets. Today, its only `packetKind: "transport"` mode is `cli-jev`, which bridges the `jev` CLI and MCP surface. The hub holds no packet-local logic. `mode-registry.json` resolves the mode, and `leaf-manifest.json` inventories its leaves. A future classifier backend joins as a new mode with a packet of its own.

### Why It Matters

- **A caller names Jev:** the transport returns the requested judgment type and never changes backends silently.
- **One availability rule:** `command -v jev` gates the hosted CLI with one exit code.
- **One stable hub identity:** a future classifier can arrive as a new mode while callers continue to address `cli-classifier`.

```text
request that names Jev
   |
   v
advisor  -->  cli-classifier  -->  hub-router.json  -->  cli-jev
                                                           |
                                                           v
                                          one typed answer and an exit code
```

### Before You Start

The hub routes nothing until the `jev` binary is on `PATH`. Install the pinned CLI and store a key for the provider you use:

```bash
uv tool install jev-cli                    # the contract is pinned against jev-cli 0.6.2
jev auth set --provider official           # prompts for TYPESAFE_API_KEY; other providers use their own name
jev auth status --provider official </dev/null
```

Without `jev`, the hub reports mode `cli-jev` as unavailable instead of guessing a judgment. `cli-jev/references/providers-and-models.md` lists the four providers and their keys.

### Features That Run When a Key Is Stored

Once `jev auth status` passes, four features ask Jev on their own. Each one beat the best rule without a model in a measured run, and each asks the question it was measured with. `shared/scripts/jev-features.mjs` decides whether one runs.

| Feature | Where it runs | Turn it off |
|---|---|---|
| Citation drift advisory | End of `validate_document.py`'s human report | `JEV_FEATURE_CITE_DRIFT=0` |
| Injection screen | Claude Code, Devin, OpenCode, Pi, and Hermes, after each fetched page | `JEV_FEATURE_INJECTION_SCREEN=0` |
| Reviewer verdict fallback | `/deep:model-benchmark` reviewer runs under `--grader auto` | `JEV_FEATURE_VERDICT_FALLBACK=0` |
| Hallucination grader | `/deep:model-benchmark` 5dim runs under `--grader auto` | `JEV_FEATURE_HALLUCINATION_GRADER=0` |

`JEV_FEATURES=0` turns all four off. A switch is read from the environment first and then from `.skilled/hooks/hook-flags.env`. None of them blocks work, and a failed call leaves the path as it would be without Jev.

---

## 3. MODES AND PACKETS

The hub registers one mode today. A future classifier is added as a new mode and packet, and the root hub router remains the selection point.

| Mode | Packet | Kind | Use it for | Pointer |
|---|---|---|---|---|
| `cli-jev` | `cli-jev/` | transport | Hosted Jev judgments through the `jev` CLI and its MCP surface | [`README.md`](./cli-jev/README.md) |

---

## 4. NAVIGATION

| File | What it holds | Why it matters |
|---|---|---|
| [`SKILL.md`](./SKILL.md) | The hub's routing contract and rules | The entry point an agent loads |
| [`mode-registry.json`](./mode-registry.json) | The single source of truth for every mode | Resolve which packet owns a request |
| [`hub-router.json`](./hub-router.json) | Router policy, signals and vocabulary classes | See which phrases pick the current `cli-jev` mode |
| [`ROUTER.md`](./ROUTER.md) | The stage-two surface router, `router_state: active` | Keep its `INTENT_SIGNALS` and `RESOURCE_MAP` keys equal, every path a `leaf-manifest.json` leaf, and its keywords equal to both mode routers |
| [`leaf-manifest.json`](./leaf-manifest.json) | The generated inventory of routed leaves | Find the references a mode loads |
| [`benchmark/injection-screen/`](./benchmark/injection-screen/) | The offline injection screen scorer and its tests | Its default run makes zero model calls. `--jev` adds the hosted classifier behind its gate |

The manifest regenerates when packets change, so read it as a snapshot.

---

## 5. CHANGELOG

Releases live in `changelog/` with one file per release, named `v[version].md`. `v0.1.0.0` and `v0.2.0.0` are the Jev hub's own releases from before it became mode `cli-jev` here.

| Release | Entry |
|---|---|
| v0.8.0.0 | [`changelog/v0.8.0.0.md`](./changelog/v0.8.0.0.md) |
| v0.7.0.0 | [`changelog/v0.7.0.0.md`](./changelog/v0.7.0.0.md) |
| v0.6.0.0 | [`changelog/v0.6.0.0.md`](./changelog/v0.6.0.0.md) |
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
| Jev transport tests | `node --test .skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs` | exit 0 |
