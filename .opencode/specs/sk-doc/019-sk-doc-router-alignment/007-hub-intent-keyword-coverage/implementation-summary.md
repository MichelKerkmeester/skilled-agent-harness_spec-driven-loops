---
title: "Implementation Summary: hub intent keyword coverage for create-agent and create-changelog"
description: "Added artifact-noun keywords (agent file / new agent / agent persona; changelog / changelog entry) across the packet source, mode-registry, and hub-router so natural agent/changelog phrasings route correctly instead of tying to create-skill. Battery 12/13, vocab-sync 100, d5 100, --check errors 0. The create-benchmark instance is a word-capped follow-up."
trigger_phrases:
  - "007 summary hub intent keyword coverage"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/007-hub-intent-keyword-coverage"
    last_updated_at: "2026-07-13T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Fix verified across routing battery and both guards"
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
| **Packet** | 007 — hub intent keyword coverage |
| **Status** | Complete |
| **Parent** | `sk-doc/019-sk-doc-router-alignment` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Artifact-noun keyword coverage for two hub intents, added consistently across the three surfaces the vocab-sync guard checks:

| Intent | Keywords added | Surfaces |
|---|---|---|
| create-agent | `agent file`, `new agent`, `agent persona` | packet `Keyword triggers:` + `mode-registry.json` aliases + `hub-router.json` vocabularyClasses |
| create-changelog | `changelog`, `changelog entry` | same three surfaces |

Root cause: the hub scores `hits × weight`, every mode shares the generic `authoring-actions` verbs, and the mode alias classes held only multi-word exact phrases. `create an agent file` broke the `create agent` adjacency, so it matched only `create`, tied every mode at one hit, and lost the stable-sort tiebreak to `create-skill`. A single artifact-specific keyword gives the correct mode a second hit and breaks the tie.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Source-of-truth-first: the packet `Keyword triggers:` line was edited, then mirrored into the registry aliases and the hub vocabularyClasses so all three agree (aliases omit slash-commands by convention, so `/create:agent` was not mirrored). Terms were chosen artifact-specific (not bare `agent`, which substrings into `management`/`agentic`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Three-surface edit, not hub-only.** Editing `hub-router.json` alone would have made the new keywords phantom aliases and tripped `parent-hub-vocab-sync` (VOCAB-DRIFT). All three surfaces were updated together.
- **create-benchmark deferred, not force-fixed.** `create a benchmark package` mis-routes for the same reason, but create-benchmark's alias class has no `create benchmark` term and its SKILL.md is at the 5000-word hard cap, so adding a keyword to its source risks a `--check` FAIL. Left for an operator decision rather than silently breaching the cap or creating drift.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|---|---|
| Routing battery (13 prompts) | 12/13 — create-agent (8, 16) and create-changelog (9, 3) fixed; other ten unchanged |
| Regression | 0 — additions only raise the two target modes' scores |
| `parent-hub-vocab-sync` | score 100, driftDetected false, 0 orphan aliases, 0 collisions |
| `d5-connectivity` | connectivity 100, hub-registry 100, gateFailed false, 0 dead packets/modes |
| `package_skill.py --check` | create-agent errors 0; create-changelog errors 0 (3469 words, under cap) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- `create a benchmark package` still ties to create-skill (pre-existing, word-cap constrained — see the follow-up).
- Fix is verified in Mode A (deterministic `router-replay`). The live advisor (a separate system) was not changed and is out of scope.
<!-- /ANCHOR:limitations -->

---

## Post-Completion Follow-Up
- **create-benchmark routing:** decide between (a) a documented vocab-sync exception that lets the hub/registry carry `create benchmark` without the word-capped packet source, or (b) trimming create-benchmark's SKILL.md to make room for the keyword. Operator call.
