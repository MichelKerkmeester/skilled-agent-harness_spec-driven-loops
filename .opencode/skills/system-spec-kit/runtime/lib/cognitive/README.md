---
title: "Cognitive"
description: "Deterministic feature-flag rollout gating for the spec-kit engine."
trigger_phrases:
  - "rollout policy"
  - "feature flag rollout"
  - "deterministic bucketing"
  - "SPECKIT_ROLLOUT_PERCENT"
---

# Cognitive

Feature-flag rollout gating for the spec-kit engine. One module decides whether a graduated flag is on for a given identity, so a percentage rollout lands on the same side of the line every time it is asked.

## 1. OVERVIEW

Use this folder when code needs to gate behavior behind a `SPECKIT_*` flag, or when a change should reach a fraction of sessions before all of them. The gate reads only the environment: it opens no database, holds no state between calls, and returns the same answer for the same identity and percentage.

The folder's name is historical. It once held the memory engine's lifecycle, decay and attention modules; those went out with that engine and nothing replaced them here.

---

## 2. STRUCTURE

| File | Role |
| --- | --- |
| `rollout-policy.ts` | Flag resolution, `SPECKIT_ROLLOUT_PERCENT` parsing, and deterministic identity bucketing. |

---

## 3. FLOW

```text
╭──────────────────────╮
│ flagName + identity  │
╰──────────┬───────────╯
           ▼
┌──────────────────────────┐
│ read process.env[flag]   │
│ 'false' / '0' → disabled │
└──────────┬───────────────┘
           ▼
┌──────────────────────────┐
│ getRolloutPercent()      │
│ clamp to 0-100           │
└──────────┬───────────────┘
           ▼
┌──────────────────────────┐
│ 100 → on · 0 → off       │
│ else bucket the identity │
└──────────┬───────────────┘
           ▼
╭──────────────────────╮
│ enabled: true/false  │
╰──────────────────────╯
```

An absent identity is treated as in-rollout, so a caller with nothing stable to hash is never silently gated off.

---

## 4. ALLOWED DEPENDENCY DIRECTION

```text
╭────────────────────╮
│ validation and     │
│ generator callers  │
╰─────────┬──────────╯
          ▼
┌────────────────────╮
│ cognitive/         │
└─────────┬──────────┘
          ▼
┌────────────────────╮
│ process.env only   │
└────────────────────┘
```

This module imports nothing. Keep it that way: a gate that reaches for configuration, storage or a logger becomes a gate that can fail, and a failing gate has no safe answer.

---

## 5. KEY CONTRACTS

| Contract | Rule |
| --- | --- |
| Default polarity | An unset flag is ON. Only the exact strings `false` and `0` disable one. |
| Percentage parsing | Accept full integer strings only; `50abc` and `1e2` fall back to 100 rather than to an accidental 50. |
| Bucket stability | The same identity must land in the same bucket across processes and restarts, so never seed the hash with time or randomness. |
| No side effects | Reading a flag must not write, log or cache anything. |

---

## 6. RELATED FILES

| Path | Why it matters |
| --- | --- |
| `../config/capability-flags.ts` | Names the generator capability flags this gate resolves. |
| `../validation/` | The rule set whose behavior the flags gate. |
| `../../ENV-REFERENCE.md` | Source-anchored defaults for `SPECKIT_ROLLOUT_PERCENT` and every gated flag. |
