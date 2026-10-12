---
title: "cli-jev Feature: Transport classification"
description: "Why cli-jev is a packetKind transport mode, what the registration declares, and the rule that a transport selects while a workflow acts."
trigger_phrases:
  - "jev transport classification"
  - "transport-axis jev"
  - "jev packetKind"
importance_tier: "important"
contextType: "reference"
version: 0.1.0.3
---

# Transport classification

---

## 1. Transport mode registration

**What it is.** `cli-jev` is declared in `mode-registry.json` with `packetKind: "transport"` — the
narrow third kind the hub doctrine defines for a packet that bridges an external tool's CLI or MCP
surface and never performs the hub's own judgment. It is the hub's first and only transport.

**Why transport and not workflow.** The workflow packets classify intent, choose a provider and
conduct a dispatched session whose writes land in this workspace. Jev does none of that: it reads a
state, prints a typed value, and exits. It cannot edit a file or run a process, so it fails the
workflow test on capability rather than on preference.

**Why transport and not surface.** A surface packet is a read-only *evidence base* loaded as
supporting context for a workflow mode. Jev is not context; it is a call that returns a value the
caller branches on, and it has its own contract, hard rules and exit taxonomy.

**Declaration, checked rather than asserted.** The per-hub gate enforces the shape:

| Requirement | Where it is enforced |
|---|---|
| `routingClass: "metadata"` | `parent-skill-check.cjs` rule 3h — a transport is advisor-invisible; the hub stays the single advisor identity |
| `mutatesWorkspace: false` | rule 3h — writes land in the external tool, not this repo |
| `forbidden` includes `Write`, `Edit`, `Task` | rule 3h |
| Named in `extensions["transport-axis"].transports[]` | rule 3h — the axis is registered, not ad-hoc |
| `tieBreak` lists workflow modes before the transport | rule 5i |

Anchors: `mode-registry.json` (the entry and the `extensions` block), the hub's `SKILL.md`
(two-axis prose and the mode table), `hub-router.json` (signal and vocabulary classes),
`leaf-manifest.json` (leaf set).

**Verified**: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs
.skilled/skills/cli-classifier` exits 0 with `PASS: 5i` and two registered modes; rule 3h reports only when the
shape is violated, so its clean state is the absence of a `3h` line rather than a `PASS` line. The
same run passes the moved-mode check `3c`, because both of this hub's modes resolve
to existing packet folders.

---

## 2. Tool surface

| Aspect | Value | Consequence |
|---|---|---|
| `allowed` | `Bash`, `Read`, `Glob`, `Grep` | Enough to compose the command and read the state |
| `forbidden` | `Write`, `Edit`, `Task` | A transport that edits is a workflow wearing the wrong `packetKind` |
| `mutatesWorkspace` | `false` | The mode changes nothing here; the judgment is the whole output |
| `bashAllowlist` | `[]` | The shared dispatch engine governs the command, not a per-mode list |

---

## 3. The pairing rule

**A transport selects; a workflow acts.**

The judgment is one input to a decision, never the decision. Three consequences:

1. **No self-sufficiency.** A request that needs an artefact resolves to a workflow mode. The
   transport supplies the value that steers it, not the work.
2. **No authorization transfer.** A `choice` answer is evidence about the caller's own options. It is
   not permission for an irreversible step, and nothing in this packet gates one.
3. **No lineage.** Jev cannot run a lineage or start one: it has no `Task`, file or process tools,
   and each call returns one value and exits. No runtime refusal backs this. The deep-loop recursion
   guard checks fan-out lineage and the dispatch stack only for a registered `ExecutorKind`, and Jev
   has none, so the tool surface is the whole bound.

Anchors: `SKILL.md` §3 "Transport Guard" and §7 "Not a Deep-Loop Executor".

---

## 4. Alias hygiene

The registry carries nine aliases — `jev cli`, `jev judgment`, `typesafe jev`, `type-safe jev`,
`cli-jev`, `cli jev`, `jev probability judgment`, `typed judgment cli`, `cli-usage` — and the mode key is now
`cli-jev`, over the packet folder `cli-jev`. The routing vocabulary keeps the former packet name, `cli-usage`, in the same alias class,
because this hub declares `routerPolicy.defaultMode: null` and carries no hub-identity catch-all: a
request that names the packet explicitly is the one case the alias class must catch. The aliases are
narrow in the sense that was replayed under the old registration against an out-of-domain phrase
(`describe the JSON value in this file`, `choose a type for this variable`) and resolved to no
intent, because "json" and "value" are not aliases and no generic word entered the list. Keeping the
alias narrow is what stops the transport from capturing traffic the hub cannot serve, and the routing
corpus (`CJ-001`, `CJ-002` and `CC-003`) re-checks the boundary under this hub's router.
