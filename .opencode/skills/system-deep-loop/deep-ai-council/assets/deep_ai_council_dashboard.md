---
title: "Deep AI Council Dashboard Template"
description: "Status dashboard template for active council planning runs and persisted packet-local artifacts."
trigger_phrases:
  - "council dashboard"
  - "ai council status"
  - "deep ai council dashboard"
importance_tier: "normal"
contextType: "planning"
version: 2.3.0.2
---

# Deep AI Council Dashboard

Use this dashboard to report council status without re-reading every seat output.

---

## 1. OVERVIEW

| Field | Value |
|-------|-------|
| Packet | `<spec-folder>` |
| Topic | `<planning topic>` |
| Status | `in-progress` |
| Current Round | `1` |
| Last Updated | `YYYY-MM-DDTHH:mm:ssZ` |

---

## 2. ROUND SUMMARY

| Round | Seats | Result | Notes |
|-------|-------|--------|-------|
| 001 | `3` | `pending` | `<summary>` |

---

## 3. SEAT SNAPSHOT

| Seat | Lens | Recommendation | Confidence | Blockers |
|------|------|----------------|------------|----------|
| Seat A | `<lens>` | `<summary>` | `<low/medium/high>` | `<none or blocker>` |
| Seat B | `<lens>` | `<summary>` | `<low/medium/high>` | `<none or blocker>` |
| Seat C | `<lens>` | `<summary>` | `<low/medium/high>` | `<none or blocker>` |

---

## 4. CONVERGENCE

| Check | State | Evidence |
|-------|-------|----------|
| Two-of-three agreement | `unknown` | `<evidence>` |
| Critique blockers | `unknown` | `<evidence>` |
| Max-round escape | `not-reached` | `<evidence>` |
| Report sections complete | `unknown` | `<evidence>` |

---

## 5. ARTIFACT HEALTH

| Artifact | State | Evidence |
|----------|-------|----------|
| `ai-council-config.json` | `pending` | `<path or command>` |
| `ai-council-state.jsonl` | `pending` | `<path or command>` |
| `council-report.md` | `pending` | `<path or command>` |
| `failed/` | `not-needed` | `<path or command>` |
| Derived graph projection | `disabled` | `<path or command>` |

---

## 6. NEXT ACTION

`<one concrete next action: run next round, persist report, repair report sections, preserve failed round, or hand off implementation>`
