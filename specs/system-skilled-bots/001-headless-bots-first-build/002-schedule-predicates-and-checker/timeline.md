---
title: "Timeline: Phase 2: schedule-predicates-and-checker"
description: "Level-agnostic chronological record of events, outcomes and milestones."
trigger_phrases:
  - "schedule predicates and checker timeline"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: timeline | v2.2 -->
# Timeline: Phase 2: schedule-predicates-and-checker

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Tracks the schedule predicates and checker phase, including the weekday probe's install and observation days.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the timeline id, the date and the owner. GOOD: TL-001, 2026-10-24, conductor. WEAK: TBD. -->

**Subject:** Phase 2: schedule predicates and definition checker
**Status:** Draft (Planned)
**Started:** 2026-11-22
**Last updated:** 2026-11-22
**Owner:** Phase implementer
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:timeline -->
## 2. TIMELINE
<!-- FILL: Put each event in date order with its evidence. GOOD: 2026-10-24: `--keep` merged. `ls logs/archive | wc -l` printed 3. WEAK: Events happened. -->

List events in order. For each, give the date, what happened, then what it led to. Use prose, not a table.

**2026-11-22:** Phase docs written from research.md §6, §7 and §16 Q1 and Q4. Outcome: the phase is planned. Nothing is built and no probe is installed.
<!-- /ANCHOR:timeline -->

---

<!-- ANCHOR:milestones -->
## 3. MILESTONES
<!-- FILL: Name each milestone and whether it passed. GOOD: M1 passed. 3 archives left. WEAK: Milestones met. -->

**M1, probe installed:** target the first day of implementation. Status: Planned. Evidence: `launchctl print` output for `com.skilled.probe.weekday`.

**M2, probe observed:** target one matching and one non-matching day after M1. Status: Planned. Evidence: the probe observation under ADR-001 in `decision-record.md`.

**M3, predicates and checker pass:** target after phase 1 lands. Status: Planned. Evidence: test suite and checker fixture runs.

**M4, probe removed:** target before close. Status: Planned. Evidence: `ls ~/Library/LaunchAgents | rg com.skilled.probe` prints nothing.
<!-- /ANCHOR:milestones -->
