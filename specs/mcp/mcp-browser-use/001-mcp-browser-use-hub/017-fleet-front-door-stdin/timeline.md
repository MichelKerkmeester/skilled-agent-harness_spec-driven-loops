---
title: "Timeline: Phase 17: fleet-front-door-stdin"
description: "Level-agnostic chronological record of events, outcomes and milestones."
trigger_phrases:
  - "fleet front door stdin timeline"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: timeline | v2.2 -->
# Timeline: Phase 17: fleet-front-door-stdin

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> How the fleet moved from a spliced `--prompt` argument to a stdin heredoc.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** Fleet-wide stdin front door
**Status:** Complete
**Started:** 2026-11-24
**Last updated:** 2026-11-24
**Owner:** Claude, for the operator
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:timeline -->
## 2. TIMELINE

List events in order. For each, give the date, what happened, then what it led to. Use prose, not a table.

**2026-11-24:** The generation-4 review confirmed that the mcp-browser-use `SKILL.md` spliced the task into a shell argument, and 016 fixed that hub alone. Outcome: the other hubs were left for an operator decision.

**2026-11-24:** The operator chose the fleet-wide switch (Q011). Outcome: 32 live lines were rewritten, seven manifests re-minted and the suites run.
<!-- /ANCHOR:timeline -->

---

<!-- ANCHOR:milestones -->
## 3. MILESTONES

**Fleet on stdin:** target the phase commit. Status: Done. Evidence: `git grep -- '--prompt "<task>"'` finds only changelogs and benchmark reports.
<!-- /ANCHOR:milestones -->
