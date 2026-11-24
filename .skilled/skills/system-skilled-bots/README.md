---
title: "system-skilled-bots"
description: "Parent hub for four bot modes: author, run, schedule and status of file-defined headless bots, routed by workflowMode through mode-registry.json."
trigger_phrases:
  - "system-skilled-bots"
  - "skilled bots hub"
  - "headless bots"
version: 1.0.2.0
---

# system-skilled-bots

> One advisor identity, four bot modes and one routing table that sends each bot request to the mode that owns it.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What it delivers |
|---|---|
| **Use it for** | File-defined headless bots: writing a `BOT.md`, running a bot, putting it on a launchd schedule and reading what it did |
| **Invoke with** | A request that names a bot, or `/bots:author`, `/bots:run`, `/bots:schedule` and `/bots:status` |
| **Routes to** | Four workflow packets through `mode-registry.json` and `hub-router.json` |
| **Produces** | The selected mode's result, or a disambiguation question when the request names no mode |

### What It Does

A bot is one `BOT.md` under a repository's `bots/` folder. The runtime under `runtime/` runs it by hand, from a launchd schedule or from a queued request, and keeps every piece of control state outside the consumer checkout. This hub is the route into that runtime: `hub-router.json` scores the request and picks one mode, and `mode-registry.json` maps that mode to its packet folder. The hub itself holds no per-mode logic.

Every routing signal names a bot or the bot-only term needs-you, so a request to run tests, schedule a meeting or read a build status never reaches the hub.

---

## 2. MODES AND PACKETS

| Packet | Kind | Use it for | Pointer |
|---|---|---|---|
| `bots-author/` | workflow | Write or edit a `BOT.md` from the template. The check runs under `/doctor:bots` | [`README.md`](./bots-author/README.md) |
| `bots-run/` | workflow | Run a bot, queue or drain runs, and answer a needs-you item | [`README.md`](./bots-run/README.md) |
| `bots-schedule/` | workflow | Install or remove a schedule, and enable, disable, pause or resume a bot | [`README.md`](./bots-schedule/README.md) |
| `bots-status/` | workflow | Read status, last runs, deliveries and the needs-you inbox | [`README.md`](./bots-status/README.md) |

The tie-break order is status, author, schedule, then run, so a request that names two modes reads before it acts.

---

## 3. NAVIGATION

| File | What it holds | Why it matters |
|---|---|---|
| [`mode-registry.json`](./mode-registry.json) | The single source of truth for every mode | Resolve which packet owns a request |
| [`hub-router.json`](./hub-router.json) | Stage-one signals, vocabulary and tie-break order | See how a request scores against each mode |
| [`ROUTER.md`](./ROUTER.md) | Stage-two intent and resource maps | See which leaves a selected mode loads |
| [`leaf-manifest.json`](./leaf-manifest.json) | The generated inventory of routed leaves | Find the reference files a mode loads |
| [`assets/bot-template.txt`](./assets/bot-template.txt) | The `BOT.md` template | Start a new bot from it |
| [`scripts/bot-check.cjs`](./scripts/bot-check.cjs) | The read-only definition checker | Prove a `bots/` folder before anything installs it |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | The current-state feature inventory with source and test anchors | Find which module and test back a bot capability |

---

## 4. CHANGELOG

Releases live in `changelog/` with one file per release, named `v[version].md`.

| Release | Entry |
|---|---|
| 1.0.0.0 | [`changelog/v1.0.0.0.md`](./changelog/v1.0.0.0.md) |

---

## 5. VERIFICATION

Run the parent-skill check on the hub and read the subject line before the verdict:

```bash
node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots
```

The run passes when it ends with `OK: parent-skill-check`. Then replay a real bot request through both routing stages, because the check asserts presence and never reachability.
