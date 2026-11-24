---
title: "system-skilled-bots Router"
description: "Stage-two control document for system-skilled-bots. hub-router.json selects the bot mode; this file maps the request to the packet-local leaves that mode loads."
trigger_phrases:
  - "system-skilled-bots router"
  - "system-skilled-bots routing"
importance_tier: normal
contextType: general
version: 1.0.1.0
router_state: active
skill_pointer: SKILL.md
---

# system-skilled-bots Router

The stage-two control document for [`SKILL.md`](./SKILL.md). `hub-router.json` selects the bot mode. This file maps the request to the exact packet-local leaves that mode loads.

---

## 1. OVERVIEW

Routing has two stages. `hub-router.json` scores the request and selects one workflow mode, an ordered bundle or a defer outcome, and `mode-registry.json` maps that mode to its packet folder. This file then picks the leaves inside the selected packet. It never re-decides the mode.

Every path below is packet-qualified (`<packet>/references/...`, where `<packet>` is the mode's `mode-registry.json` `packet` field), resolves on disk and is listed in the generated `leaf-manifest.json`.

---

## 2. INTENT MODEL

Every keyword names a bot or the bot-only term needs-you, so a bare verb like run, schedule or status fires nothing here and the hub defers.

- **Author leaves.** Writing or editing a `BOT.md` loads the bot definition reference: the layout, the template and the check command that `/doctor:bots` runs.
- **Run leaves.** Starting a bot run, queueing or draining runs, or answering a bot's needs-you item loads the run reference. `bots answer` routes here.
- **Schedule leaves.** Installing or removing a bot's schedule, or enabling, disabling, pausing or resuming a bot, loads the schedule lifecycle reference.
- **Status leaves.** Reading bot status, the last bot run, the needs-you inbox or whether a bot's schedule needs a reinstall loads the status and inbox reference. `bots inbox` routes here.

---

## 3. MACHINE-READABLE ROUTER (replay / benchmark source)

The single machine-readable projection of the intent model above. Keep the two in sync: when a row changes above, update the matching entry here. `INTENT_SIGNALS` and `RESOURCE_MAP` carry the same keys.

```python
# No always-loaded preamble: a route loads only the selected mode's leaves, and
# a request that fires no intent takes the hub's defer fallback.
DEFAULT_RESOURCE = []

SHARED_CONTROL_RESOURCES = []

INTENT_SIGNALS = {
    "AUTHOR":   {"weight": 4, "keywords": ["author a bot", "write a bot", "create a bot", "new bot.md", "bot definition", "edit a bot", "bot.md", "new bot", "bot template", "bots:author"]},
    "RUN":      {"weight": 4, "keywords": ["run the bot", "run a bot", "drain the bot queue", "enqueue a bot run", "answer the bot", "bots answer", "bots run", "bots drain", "bots enqueue", "bot run request", "answer a needs-you", "bot's needs-you", "run the nightly-digest bot", "run my nightly bot", "run the nightly bot", "kick off the nightly-digest bot", "queue a bot run", "~drain bot", "~run bot", "~start the bot", "~launch the bot", "bots:run"]},
    "SCHEDULE": {"weight": 4, "keywords": ["schedule a bot", "pause the bot", "resume the bot", "enable the bot", "disable the bot", "bots schedule", "bot schedule", "launchd bot", "bot on a schedule", "cron bot", "pause the nightly-digest bot", "schedule for the nightly-digest bot", "bot on a launchd", "~bot schedule", "~pause bot", "~resume bot", "~enable bot", "~disable bot", "bots:schedule"]},
    "STATUS":   {"weight": 4, "keywords": ["bot status", "bots status", "last bot run", "which bots are installed", "bot inbox", "bots inbox", "what do the bots need from me", "bot runs", "bot needs-you", "bot needs me", "status of my bots", "needs-you inbox", "bot's schedule needs", "bots:status"]},
}

RESOURCE_MAP = {
    "AUTHOR": [
        "bots-author/references/bot-definition.md"
    ],
    "RUN": [
        "bots-run/references/run-queue-and-answer.md"
    ],
    "SCHEDULE": [
        "bots-schedule/references/schedule-lifecycle.md"
    ],
    "STATUS": [
        "bots-status/references/status-and-inbox.md"
    ],
}
```

---

## 4. HOW TO READ THIS

- One dominant intent routes to one leaf set.
- Two near-tied intents, such as a request to schedule a bot and show its status, route to both leaf sets in `hub-router.json` tie-break order: status, author, schedule, run.
- No keyword match is the hub's defer fallback: confirm the bot mode before loading anything.
- A keyword that starts with `~` lists whole words that must appear in order, each at most three words after the one before, so `~pause bot` matches "pause the triage bot" but not "pause the robot". A hyphenated name such as `release-notes` counts as one word, and so does a word with an apostrophe inside it, such as "michel's". A possessive "'s" is dropped, so `~bot schedule` matches "the bot's schedule" but not "the robot's schedule". Ordered keywords count only when no contiguous keyword matched any mode, and they never reach the advisor, because the intent-signal generator carries only phrases that start with a letter or digit.
- Ordered keywords also stay out of a prompt that holds one of the `orderedKeywordBlockers` in `hub-router.json`: "authoring", "building", "creating" and "writing". A request to write a bot uses the same verb and noun as a request to run one, so "start writing the bot" defers instead of reaching the run mode, which starts an executor. "build", "write" and "create" are not listed, because "the build bot" names a bot and "run the triage bot to write a summary" asks for a run.

---

## 5. RELATED RESOURCES

- [`hub-router.json`](./hub-router.json): stage-one policy, signals, and vocabulary classes.
- [`mode-registry.json`](./mode-registry.json): the mode registry that maps each `workflowMode` to its packet.
- [`leaf-manifest.json`](./leaf-manifest.json): the generated inventory of routed leaves.
- [`SKILL.md`](./SKILL.md): the hub routing entry point.

---

## MACHINE ROUTER

The hub's routing directive. The stage-two maps live in section 3, so no second map belongs in this section.

> **Compiled routing (default-on, flag-gated, additive).** Resolve the mode via the compiled router contract first:
> ```bash
> node .skilled/bin/compiled-route.cjs --hub system-skilled-bots --prompt "<task>"
> ```
> Follow the returned decision: `route` uses its `targets`, `clarify` and `defer` ask for disambiguation, and `reject` refuses. On a `{"servingAuthority":"legacy"}` sentinel or any error, use the registry routing in `hub-router.json`. Set `SPECKIT_COMPILED_ROUTING=0` to force legacy routing for every hub.

A fresh `system-skilled-bots` ships without a compiled activation manifest, so the directive above returns the legacy sentinel until the hub is activated, and routing then uses `hub-router.json` and the maps in section 3.

```python
UNKNOWN_FALLBACK_CHECKLIST = [
    "Name the bot outcome: write a BOT.md, run a bot, change its schedule, or read status and the inbox",
    "Name the bot id, or the needs-you item id for an answer",
    "Confirm whether the request may run an executor or install a launchd agent",
]
UNKNOWN_FALLBACK = {
    "load_level": "UNKNOWN_FALLBACK",
    "needs_disambiguation": True,
    "resources": [],
    "checklist": UNKNOWN_FALLBACK_CHECKLIST,
}
```
