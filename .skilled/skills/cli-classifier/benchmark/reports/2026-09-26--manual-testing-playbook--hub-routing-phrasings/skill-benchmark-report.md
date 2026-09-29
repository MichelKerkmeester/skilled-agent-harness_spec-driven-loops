---
title: "cli-jev Playbook Run: 2026-09-26 hub-routing phrasings"
description: "Hub-routing corpus run after the jev-dispatch class gained ask jev, use jev, with jev and through jev: the six phrasings the hub advertises now route to cli-usage, CJ-002 still routes, and CJ-003 with its holdout still resolves nothing."
trigger_phrases:
  - "cli-jev hub routing phrasings"
  - "2026-09-26 cli-jev validation"
  - "cli-jev playbook run"
importance_tier: "normal"
contextType: "general"
version: 1.0.0.0
---

# cli-jev Playbook Run: 2026-09-26 hub-routing phrasings

_The corpus re-run after a vocabulary change, executed from the compiled front door once the activation manifest was re-minted. Raw captures sit under `raw/` beside this file._

---

## 1. RUN IDENTITY

| Field | Value |
|---|---|
| Date | 2026-09-26 |
| Playbook | `manual-testing-playbook/manual-testing-playbook.md` (hub level) |
| Corpus | `manual-testing-playbook/hub-routing/`: CJ-001 with its six phrasings, CJ-002, CJ-003 with its holdout |
| Front door | `node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "<prompt>"` |
| Serving state | `compiled`, generation 1, policy `033a20d9…` |
| Executor | Claude Opus 5.5 in a Claude Code session, the same session that made the change |

```bash
bash raw/hub-routing-run.sh > raw/hub-routing.txt
```

---

## 2. VERDICT

**3 PASS, 0 FAIL, 0 SKIP.**

| Scenario | Verdict | Evidence from this run |
|---|---|---|
| CJ-001 | PASS | The prompt and all six advertised phrasings answer `action: route`, `selectionKind: single`, one `cli-usage` transport target |
| CJ-002 | PASS | `cli-jev noul for this question.` still resolves the single `cli-usage` target |
| CJ-003 | PASS | The packet-summary prompt and the `score this flavor of ice cream` holdout both answer `action: defer` with no target |

The six phrasings come from the hub's own `description.json` and `graph-metadata.json`. The skill advisor already sent all of them to cli-jev, and the hub router deferred six of the eight it advertises, because its vocabulary only held phrases that pair `jev` with a subcommand name or an alias. The advisor put cli-jev first for all eight in this session, at confidence 0.82 to 0.91. The `jev-dispatch` class now carries `ask jev`, `use jev`, `with jev` and `through jev`. A multi-word detector allows up to two words between its words, so these four cover every advertised phrasing.

---

## 3. OUT-OF-DOMAIN REPLAYS

Each new phrasing was replayed against phrases that sit near it but are not Jev requests.

| Probe | Prompt | Result |
|---|---|---|
| out-of-domain-1 | `Plan a trip to Sarajevo with friends` | `defer` |
| out-of-domain-2 | `ask jeeves for directions` | `defer` |
| out-of-domain-3 | `use jevons paradox to explain this` | `route` to `cli-usage` |

The third probe routes because a detector anchors a word boundary at its start and not at its end, so `use jev` also matches `use jevons`. The existing `run jev` keyword has the same shape. The false positive stays at stage two: the skill advisor returns no recommendation for that prompt, so a real request never reaches this hub with it. Closing it for good would need an end boundary in the shared detector matcher, which this change leaves alone.

---

## 4. RAW EVIDENCE

| File | Holds |
|---|---|
| `raw/hub-routing.txt` | Every prompt with its exit status and route JSON, then the compiled-route guard output |
| `raw/hub-routing-run.sh` | The script that produced the capture |

No provider credential was needed. The run calls only the routing front door and the guard.

---

## 5. DELTA AGAINST BASELINE

The previous run is [`2026-09-20-hub-routing-baseline/`](../2026-09-20-hub-routing-baseline/). Its three scenario verdicts hold unchanged. CJ-001 grew from one prompt to one prompt plus six phrasings.

Before the vocabulary change, at policy `178b10dd…`, the six phrasings answered `action: defer`. That was observed in the same session before the edit, and no raw capture of it was saved. The policy hash moved to `033a20d9…` when the manifest was re-minted, and `compiled-route-guard.cjs` reports every hub fresh.
