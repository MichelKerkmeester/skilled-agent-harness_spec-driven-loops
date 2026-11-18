---
title: "cli-classifier"
description: "Routes a request for a typed judgment to a classifier that can answer it and returns one value a script can branch on, with a clear signal when no judgment can be made."
trigger_phrases:
  - "cli-classifier hub"
  - "typed judgment hub"
  - "jev judgment hub"
version: 0.8.9.0
---

# cli-classifier

> Turns a question into one typed value that code can branch on, with a clear outcome when no judgment can be made.

---

## 1. OVERVIEW

### At a Glance

| Aspect | What you get |
|---|---|
| **Use it for** | A category or a probability that code will branch on |
| **Invoke with** | A request that names Jev, such as `jev choice` or `jev noul` |
| **Works on** | One question and the text it judges, read from the command line or a file |
| **Produces** | One typed value per question plus an exit code that names the outcome |

### What It Does

`cli-classifier` is the one public identity for typed classifier judgments. It resolves a request to a registered transport and loads that transport's packet. Today the only mode is `cli-jev`, which asks the hosted Jev service for a probability, an option key, an ordered position or a batch of keyed answers. The hub holds no packet-local logic, so a future classifier joins as a new mode and packet while callers keep addressing this skill.

A judgment is not an action. The transport reads state and returns a value. It changes nothing in this workspace. Pair it with a workflow mode when the value feeds an edit or a review.

---

## 2. QUICK START

**Step 1: Route a request.** The advisor sends a request that names Jev to `cli-classifier`. To see the decision without running anything, use the compiled route.

```bash
node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "use jev choice to pick a queue"
```

The command prints one JSON line with `"action":"route"` and a single target whose `workflowMode` is `cli-jev`.

**Step 2: Check the CLI.**

```bash
jev --version
```

The command prints `jev 0.6.2`, the version the packet's contract is pinned against.

**Step 3: Check the credential.**

```bash
jev auth status --provider official </dev/null
```

The command prints one JSON line with `"ok": true` and `"stored": true`. A missing key exits 3 with `official API key is not stored`. Run `jev auth set --provider official` to store one. The four providers and their key variables are in the [providers reference](./cli-jev/references/providers-and-models.md).

If `jev` is not on `PATH`, install it with `uv tool install jev-cli`.

---

## 3. HOW IT WORKS

### Two Stages

Routing happens in two stages. The hub picks the mode and the router picks the leaves inside it. Stage one scores `routerSignals` from `hub-router.json` against its `vocabularyClasses` and applies `routerPolicy.tieBreak`. Stage two lives in `ROUTER.md`, which maps the chosen intent to the packet-local files that mode loads.

`routerPolicy.defaultMode` is `null`, so an unclear request or one that names only the hub asks for clarification. It never guesses a backend. The compiled route returns `route` with its targets. `clarify` and `defer` ask for a clearer request. `reject` refuses.

```text
┌──────────────────────────────────┐
│ A request that names Jev         │
└─────────────────┬────────────────┘
                  │
                  ▼
┌──────────────────────────────────┐
│ Advisor resolves cli-classifier  │
└─────────────────┬────────────────┘
                  │
                  ▼
┌──────────────────────────────────┐
│ hub-router.json picks the mode   │
└─────────────────┬────────────────┘
                  │
                  ▼
┌──────────────────────────────────┐
│ ROUTER.md picks the leaves       │
└─────────────────┬────────────────┘
                  │
                  ▼
┌──────────────────────────────────┐
│ cli-jev packet                   │
└─────────────────┬────────────────┘
                  │
                  ▼
┌──────────────────────────────────┐
│ One typed value and an exit code │
└──────────────────────────────────┘
```

### The Transport Axis

A `packetKind: "transport"` mode bridges an external tool. It selects a value and never mutates this workspace. That boundary is what keeps a judgment from turning into an action by accident.

| Contract | What it means |
|---|---|
| `packetKind: "transport"` | The mode bridges an external CLI or MCP surface |
| `mutatesWorkspace: false` | A judgment reads state and changes nothing |
| `Write`, `Edit`, `Task` forbidden | A transport cannot edit a file or dispatch another agent |
| `routingClass: "metadata"` | The advisor resolves the hub and the hub selects the transport |

`mode-registry.json` declares the tool surface for `cli-jev`. Its `transport-axis` extension lists the registered transports. The parent-skill check enforces the whole contract.

---

## 4. OPTIONAL FEATURES

Two features ask Jev on their own when a credential is stored. `shared/scripts/jev-features.mjs` is the one gate both ask. It resolves the master switch and each feature's own switch from the environment first and then from the shared hook-flags file at `.skilled/hooks/hook-flags.env`. Only after a switch allows the feature does it run one bounded `jev auth status` call for the provider.

| Switch | What it controls |
|---|---|
| `JEV_FEATURES=0` | Both features |
| `JEV_FEATURE_CITE_DRIFT=0` | The citation drift advisory |
| `JEV_FEATURE_INJECTION_SCREEN=0` | The injection screen |

A closed gate returns its reason and spawns nothing, so an off switch never touches the CLI. The gate never prints and never reads a key. It discards the command's output.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for it when you need a value to drive a decision rather than prose. Gate a change on an urgency probability before a reviewer sees it, pick the queue that owns an incoming request, rank incident severity against fixed levels or ask several typed questions about one state in a single batch.

Never use it for the action itself. An edit or a review belongs to a workflow mode, with the judgment passed in as an input. Never start `jev-mcp` from a shell either, because its stdio carries MCP frames and it belongs in an MCP host configuration.

### Related Skills

| Skill | Relationship |
|---|---|
| `cli-jev` | The hub's only mode today. It owns the judgment primitives and the dispatch rules |
| `cli-external-orchestration` | The sibling hub for external CLI dispatch. That hub routes work to workflow modes. This hub returns a judgment |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `defer` from the compiled route | The request names only the hub or matches no judgment | Name the judgment and its shape, such as `jev choice` or `jev score` |
| Mode `cli-jev` reported as unavailable | `command -v jev` fails, so the CLI is not on `PATH` | `uv tool install jev-cli` |
| Exit code 3 with `official API key is not stored` | The provider has no stored credential | `jev auth set --provider official` |
| A `choice` call refused before it runs | Fewer than two options were passed | Pass at least two `-o` options |
| Exit code 4 | The service returned an error or the connection failed | Retry, then check the endpoint for the provider |

---

## 7. VERIFICATION

Run each command from the repository root.

| Check | Command | Expected |
|---|---|---|
| Hub contract | `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier` | Every hard invariant reports `PASS`, a rule that does not apply prints `INFO` and the command exits 0 |
| Compiled route | `node .skilled/bin/compiled-route.cjs --hub cli-classifier --prompt "use jev choice to pick a queue"` | One JSON line with `"action":"route"` and one `cli-jev` target |
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/cli-classifier/README.md --type readme` | `VALID` with zero issues |
| Transport tests | `node --test .skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs` | The runner reports 0 failures and exits 0 |

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | The hub's routing contract and the rules a transport obeys |
| [`ROUTER.md`](./ROUTER.md) | The stage-two intent map and resource map |
| [`mode-registry.json`](./mode-registry.json) | The packet registry: the mode and its tool surface |
| [`hub-router.json`](./hub-router.json) | The stage-one policy and vocabulary classes |
| [`leaf-manifest.json`](./leaf-manifest.json) | The generated inventory of leaves each mode loads |
| [`cli-jev/README.md`](./cli-jev/README.md) | The transport's judgment primitives and dispatch rules |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Operator scenarios for hub routing |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Hub features and the measurement records behind them |
| [`changelog/`](./changelog/) | One entry per release |
