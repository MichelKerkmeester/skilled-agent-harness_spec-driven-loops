---
title: "cli-jev Playbook Run: 2026-09-20 hub-routing baseline"
description: "First execution of the cli-jev hub-routing corpus: CJ-001 and CJ-002 resolve cli-usage, CJ-003 and its holdout phrasing resolve nothing, and the transport executes the judgment it was routed."
trigger_phrases:
  - "cli-jev hub routing baseline"
  - "2026-09-20 cli-jev validation"
  - "cli-jev playbook run"
importance_tier: "normal"
contextType: "general"
version: 1.0.0.0
---

# cli-jev Playbook Run — 2026-09-20 hub-routing baseline

_The hub's first recorded run, executed from the compiled front door after the hub joined the serving closure. Raw captures sit under `raw/` beside this file._

---

## 1. RUN IDENTITY

| Field | Value |
|---|---|
| Date | 2026-09-20 |
| Playbook | `manual-testing-playbook/manual-testing-playbook.md` (hub level) |
| Corpus | `manual-testing-playbook/hub-routing/` — CJ-001, CJ-002, CJ-003 |
| Front door | `node .skilled/bin/compiled-route.cjs --hub cli-jev --prompt "<prompt>"` |
| Serving state | `compiled`, generation 1, fence epoch 1, policy `3240ebf5…` |
| Executor | the orchestrator session that performed the migration |

```bash
bash raw/hub-routing-run.sh > raw/hub-routing.txt
```

---

## 2. VERDICT

**3 PASS, 0 FAIL, 0 SKIP** — every scenario resolves what it says it resolves.

| Scenario | Verdict | Evidence from this run |
|---|---|---|
| CJ-001 | PASS | `action: route`, `selectionKind: single`, target `workflowMode: cli-usage` / `packetKind: transport` / `packetId: cli-usage`, at policy `3240ebf5…` generation 1 |
| CJ-002 | PASS | the retired mode name still resolves the same single target, `cli-usage` |
| CJ-003 | PASS | `action: defer`, no target, no packet loaded — for both the packet-summary prompt and the holdout judgment phrasing |
| CJ-001 kill-switch | PASS | with the flag off, the front door returns the legacy sentinel `{"servingAuthority":"legacy","hubId":"cli-jev"}` |
| CJ-001 end to end | PASS | the judgment ran through the packet the route selected: `jev noul -q 'Is this incident urgent?' -s 'Checkout is failing since 09:12 UTC.' --value` → `0.86`, exit 0 |

What each row proves: the hub resolves its one transport for a Jev judgment request (CJ-001), keeps
the retired name working as an alias (CJ-002), and invents no route when no signal is present
(CJ-003). The kill-switch row is the control for the route rows: the same prompt answers with the
sentinel when compiled serving is disabled, so the route comes from the compiled policy and not from
a stale path.

---

## 3. RAW EVIDENCE

| File | Holds |
|---|---|
| `raw/hub-routing.txt` | the four prompts with their route JSON, the kill-switch control, and the executed judgment |
| `raw/hub-routing-run.sh` | the script that produced the capture |

The routing half of the corpus needs no provider credential; the end-to-end row does, and it ran
against the stored key with stdin closed, per the packet's own dispatch rules.

---

## 4. DELTA AGAINST BASELINE

This is the corpus's first run, so it is its own baseline. Until this run the hub playbook recorded
`not run` and pointed at the compiled-fleet onboarding for its first execution; those rows are now
observed rather than promised. The next run compares against the table in §2, and any row that moves
is reported with its cause.
