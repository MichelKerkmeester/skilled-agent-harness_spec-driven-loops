---
title: "Next Focus: Scored and Replayable Frontier Selection"
description: "Derives, scores and durably records the next research or review focus region as a replayable ledger decision."
---

# Next Focus

---

## 1. OVERVIEW

Runtime primitives that decide where a `system-deep-loop` research or review mode should look next. Candidates are derived from coverage gaps, open contradictions and under-covered semantic communities, scored under one versioned policy. The winning (or unavailable) decision is recorded as a ledger event so it can be replayed deterministically. Selection is shadow-compared against the legacy pivot-candidate selector during migration.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `next-focus-candidates.ts` | Derives and validates next-focus candidates from a source snapshot (coverage gaps, contradictions, under-covered communities) |
| `next-focus-errors.ts` | Fail-closed error codes for selection, recording and replay |
| `next-focus-events.ts` | Ledger event types and preparation or recording for selected and unavailable next-focus decisions |
| `next-focus-replay.ts` | Replays a recorded next-focus decision deterministically from ledger evidence |
| `next-focus-selection.ts` | Scores and selects the next-focus candidate, with shadow comparison against the legacy pivot-candidate selector |
| `next-focus-types.ts` | Candidate, signal, region and decision type contracts |
| `index.ts` | Public API barrel |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/runtime/lib/cycle-detection/`

## 4. TESTS

- `.opencode/skills/system-deep-loop/runtime/tests/unit/next-focus.vitest.ts`
