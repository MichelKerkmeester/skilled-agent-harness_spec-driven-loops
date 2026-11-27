---
name: bots-status
description: "Status mode of system-skilled-bots: read installed bots, last runs and deliveries, and the needs-you inbox. Read-only."
allowed-tools: [Read, Bash, Grep, Glob]
version: 1.0.0.0
---

# Bots Status

The status mode of the `system-skilled-bots` hub. It reads what the bots did and what they need through `bots status`, `bots activity` and `bots inbox`, and nothing else. It writes nothing in the consumer checkout. `bots inbox` lives here because reading the inbox is a status read.

---

## 1. WHEN TO USE

Use this packet when the `system-skilled-bots` hub selects the `status` mode, or when `/bots:status` names it.

- A request to list installed bots, their last run or its delivery.
- A request to read the needs-you inbox.
- A request to check whether a schedule needs a reinstall or a run folder vanished.

### When NOT to Use

- Answering an inbox item. The run mode owns `bots answer`.
- Changing a schedule. The schedule mode owns that.

Do not invoke this packet as a separate advisor identity. Routing belongs to the parent hub.

---

## 2. SMART ROUTING

The parent hub resolves this packet through `mode-registry.json`: `hub-router.json` scores the
request, the winning `workflowMode` names this packet, and the hub loads this `SKILL.md` first.

The hub's root `ROUTER.md` stops at the packet: it names this packet and its first leaves, and the
packet's own `ROUTER.md` maps the intents that pick among the material this folder holds. That file,
not the hub router, is where a packet-local resource selection is decided.

A request that matches no registered intent returns `UNKNOWN_FALLBACK`, never a silent default.
That fallback asks for disambiguation instead of guessing a verb.
The machine router, its intent signals and its resource map live in
[`ROUTER.md`](./ROUTER.md). Read that file before loading a packet-local resource.

---

## 3. HOW IT WORKS

1. Confirm the repository, or read every identity with `--all`.
2. Run `node .skilled/bin/bots.cjs status` or `node .skilled/bin/bots.cjs inbox` with `--repo <path>`, adding `--json` when the reader wants rows as data. These two commands are the only Bash this mode runs.
3. Report the rows as printed, and name the mode that acts on any row that needs action.

---

## 4. RULES

### ALWAYS

- Quote the rows as the CLI printed them.
- Point an open needs-you item at the run mode for its answer.

### NEVER

- Never write in the consumer checkout from this mode.
- Never run `--rebuild` or `--unregister`. Both write, so name them as the operator's next step.
- Never run any Bash command other than `bots status`, `bots activity` and `bots inbox`.
- Never answer, enqueue or install from this mode.

### ESCALATE IF

- The status index looks stale. Name `bots status --rebuild` as the operator's step, because it rewrites the index under the state root.
- A row reports a missing checkout.

---

## 5. REFERENCES

- [`ROUTER.md`](./ROUTER.md): this packet's machine router.
- [`references/status-and-inbox.md`](./references/status-and-inbox.md): the status verbs and their contract.
- [`README.md`](./README.md): packet overview.
- `../mode-registry.json`: authoritative packet registration.
- `../hub-router.json`: parent routing policy.

---

## 6. SUCCESS CRITERIA

- The status or inbox rows are reported as printed, with the next mode named for each row that needs action.

---

## 7. INTEGRATION POINTS

- Input: requests routed from the `system-skilled-bots` hub, or `/bots:status`.
- Output: the status result, with the command run and its exit status.
