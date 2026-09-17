---
title: "Deep AI Council Strategy Template"
description: "Council round strategy template for seat setup, open disagreements, convergence status, and handoff risk."
trigger_phrases:
  - "council strategy template"
  - "ai council round strategy"
  - "deep ai council strategy"
importance_tier: "normal"
contextType: "planning"
version: 2.3.0.2
---

# Deep AI Council Strategy

Use this template before and between council rounds. Keep it short enough for every seat to read before proposing.

---

## 1. OVERVIEW

| Field | Value |
|-------|-------|
| Packet | `<spec-folder>` |
| Topic | `<planning topic>` |
| Round | `1` |
| Run Mode | `in-cli` |
| Max Rounds | `3` |

Boundary statement: `<what the council may decide, and what implementation work remains outside the council>`.

---

## 2. SEATS

| Seat | Lens | Mandate | Must Challenge |
|------|------|---------|----------------|
| Seat A | Analytical | `<main evaluation focus>` | `<risk or assumption>` |
| Seat B | Critical | `<main evaluation focus>` | `<risk or assumption>` |
| Seat C | Pragmatic | `<main evaluation focus>` | `<risk or assumption>` |

---

## 3. KNOWN CONTEXT

- `<fact with source>`
- `<constraint>`
- `<open dependency>`

---

## 4. OPEN DISAGREEMENTS

| ID | Disagreement | Current Evidence | Owner |
|----|--------------|------------------|-------|
| DAC-D001 | `<issue>` | `<evidence>` | `<seat or caller>` |

---

## 5. CONVERGENCE STATUS

| Signal | Current State |
|--------|---------------|
| Two-of-three material agreement | `unknown` |
| Surviving high-severity blocker | `unknown` |
| Required report sections ready | `unknown` |
| Failed rounds preserved | `unknown` |

Next round focus: `<what the next seat pass must decide>`.

---

## 6. HANDOFF RISKS

| Risk | Impact | Handoff Instruction |
|------|--------|---------------------|
| `<risk>` | `<impact>` | `<what the implementer must do>` |

---

## 7. ARTIFACT STATUS

| Artifact | Status | Notes |
|----------|--------|-------|
| `ai-council-config.json` | `draft` | `<notes>` |
| `ai-council-state.jsonl` | `not-started` | `<notes>` |
| `council-report.md` | `not-started` | `<notes>` |
| `failed/` | `not-needed` | `<notes>` |
