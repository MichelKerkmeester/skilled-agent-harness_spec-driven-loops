---
title: "Implementation Summary: create-benchmark routing via redundant-alias swap"
description: "Swapped the redundant skill-benchmark-report alias for benchmark package across all three synced surfaces, fixing 'create a benchmark package' -> create-benchmark. Word-neutral swap keeps the packet under the 5000-word cap and drift-free; empirically confirmed no coverage loss. Battery 11/11, vocab-sync 100, d5 100/100, --check errors 0."
trigger_phrases:
  - "008 summary create-benchmark routing swap"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-sk-doc-router-alignment/008-create-benchmark-routing"
    last_updated_at: "2026-07-13T16:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Swap verified; guards green; under cap"
    next_safe_action: "Terminal validation and optional commit"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Packet** | 008 — create-benchmark routing via redundant-alias swap |
| **Status** | Complete |
| **Parent** | `sk-doc/018-sk-doc-router-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

One redundant-alias swap across the three synced surfaces:

| Surface | Change |
|---|---|
| create-benchmark `Keyword triggers:` line | `skill-benchmark-report` → `benchmark package` |
| `mode-registry.json` create-benchmark aliases | same swap |
| `hub-router.json` create-benchmark-aliases | same swap |

`skill-benchmark-report` was dead weight for routing: the retained `skill-benchmark` alias is a substring of it, so any task naming the longer term already matched the shorter one. Freeing that slot for `benchmark package` fixes `create a benchmark package` → create-benchmark with **no net keyword add** — so create-benchmark stays under its 5000-word `--check` cap and the vocab-sync guard stays green. The 13 prose occurrences of `skill-benchmark-report` (a real artifact filename) in the SKILL.md were left untouched; only the routing alias moved.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

This resolved the create-benchmark case that sibling 007 deferred (word-cap constraint). The approach came from a second-opinion review dispatched to GPT-5.6-sol (max effort) via `cli-codex`, which proposed the redundant-alias swap over the two options originally on the table (a documented vocab-sync exception, or trimming the SKILL.md). The swap was applied source-first, then mirrored into the registry and hub projections.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Swap, don't add.** A net keyword add risked the 5000-word cap or a phantom-alias drift. Removing a substring-redundant alias frees the slot at zero word cost and zero drift.
- **Keep the prose filenames.** `skill-benchmark-report` remains a valid artifact name in the SKILL.md body; only its routing-alias role was replaced.
- **Avoided bare `benchmark`.** `benchmark package` is specific enough to fix the reported prompt without over-matching incidental benchmark mentions.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|---|---|
| `create a benchmark package` | → create-benchmark (6) — fixed |
| Coverage preserved (`generate a skill-benchmark-report`) | → create-benchmark (6) — no loss from the removed alias |
| Regression battery | 11/11, no regression |
| `parent-hub-vocab-sync` | score 100, driftDetected false, 0 collisions, 0 orphans |
| `d5-connectivity` | connectivity 100, hub-registry 100, gateFailed false |
| `package_skill.py --check` | errors 0, 4997 words (under 5000 cap) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- `benchmark package` fixes the specific reported phrasing; other loose phrasings (e.g. a bare `create a benchmark`) still tie on the generic verb — acceptable, and avoiding bare `benchmark` was the deliberate trade-off.
- Verified in Mode A (deterministic `router-replay`). The live advisor (separate system) was not changed.
<!-- /ANCHOR:limitations -->

---

## Post-Completion Follow-Up
- With 007 + 008, all ten create-* modes now route their representative prompts correctly. Optional next step is negative replay assertions for the changelog alias boundary (`changelog` / `changelog entry` / `create changelog` overlap), flagged in the 007 review.
