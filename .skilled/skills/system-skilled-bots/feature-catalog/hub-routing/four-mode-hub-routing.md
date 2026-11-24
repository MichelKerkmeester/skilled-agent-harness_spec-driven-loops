---
title: "Four-mode hub routing"
description: "Routes a bot request to the author, run, schedule or status mode through the hub router and mode registry, and defers when no mode is named."
trigger_phrases:
  - "four-mode hub routing"
  - "system-skilled-bots routing"
  - "bots hub modes"
  - "bot request defer"
version: 1.0.1.0
---

# Four-mode hub routing

## 1. OVERVIEW

Routes a bot request to the author, run, schedule or status mode through the hub router and mode registry, and defers when no mode is named.

The hub is one skill with one advisor identity and four workflow modes. It holds no per-mode logic: each mode keeps its contract in its own packet and calls the runtime, and the hub only picks the mode.

---

## 2. HOW IT WORKS

`hub-router.json` scores a request against its vocabulary classes and selects one `workflowMode`, an ordered bundle or a defer outcome. `mode-registry.json` maps that mode to its packet folder, its command and its tool surface. The root router then picks the selected mode's leaves. Every mode routes by hub membership, so the advisor routes the hub and the hub picks the mode.

Author writes or edits a definition from the template through `/bots:author` and grants no Bash. Run, schedule and status each run verbs of `.skilled/bin/bots.cjs` through `/bots:run`, `/bots:schedule` and `/bots:status`, limited to that CLI by their Bash allowlist. `bots inbox` belongs to status and `bots answer` belongs to run, and neither has a mode of its own.

Every signal is anchored on the word bot or the bot-only term needs-you, because bare verbs like run, schedule and status also name unrelated work. A bot request that names no mode defers and asks which mode the reader means. A request that never names a bot, such as running tests or scheduling a meeting, routes elsewhere. Checking definitions as a doctor task goes to `/doctor:bots`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/hub-router.json` | Shared | Stage-one policy, signals, vocabulary classes and tie-break order |
| `.skilled/skills/system-skilled-bots/mode-registry.json` | Shared | Mode identity, packet, command, aliases and tool surface |
| `.skilled/skills/system-skilled-bots/ROUTER.md` | Shared | The hub routing directive and stage-two maps |
| `.skilled/skills/system-skilled-bots/SKILL.md` | Handler | The hub contract and its mode table |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/manual-testing-playbook.md` | Manual playbook | The hub-routing scenario index |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/hub-routing/hub-only-defer.md` | Manual playbook | A bot request naming no mode defers |
| `.skilled/skills/system-skilled-bots/manual-testing-playbook/hub-routing/out-of-domain-defer.md` | Manual playbook | A request that never names a bot routes elsewhere |

---

## 4. SOURCE METADATA

- Group: Hub routing
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `hub-routing/four-mode-hub-routing.md`

Related references:
- [../definition/bot-definition-contract.md](../definition/bot-definition-contract.md) - what the author mode writes
- [../runs/bot-runner.md](../runs/bot-runner.md) - what the run mode starts
