---
title: "Timeline: Phase 3: manual-runner"
description: "Level-agnostic chronological record of events, outcomes and milestones."
trigger_phrases:
  - "manual runner timeline"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: timeline | v2.2 -->
# Timeline: Phase 3: manual-runner

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Tracks the planning and build of the manual runner phase.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the timeline id, the date and the owner. GOOD: TL-001, 2026-10-24, conductor. WEAK: TBD. -->

**Subject:** Phase 3, the manual runner for system-skilled-bots
**Status:** In Progress
**Started:** 2026-11-22
**Last updated:** 2026-11-22
**Owner:** Operator
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:timeline -->
## 2. TIMELINE
<!-- FILL: Put each event in date order with its evidence. GOOD: 2026-10-24: `--keep` merged. `ls logs/archive | wc -l` printed 3. WEAK: Events happened. -->

**2026-11-22:** Phase scaffolded and its spec, plan, tasks, acceptance criteria and five proposed decisions written. Outcome: planned. Nothing is built.

**2026-11-22:** Operator decisions applied. Raised to Level 3 (D8). ADR-001 accepted as a decision queue with `bots inbox` and `bots answer` (D1). ADR-005 accepted and T025 unblocked (D7). Run folders moved to the Skilled tree's gitignored `.state` (D2). Outcome: planned. Nothing is built.

**2026-11-22:** Second operator round applied. A bot with an open item is held (D9, REQ-022, T034). The expiry key is `needsYou.expiryDays` (D10). `bots answer` moved to phase 5 (D12): T030 removed, AC-015 and AC-016 Superseded, AC-018 and AC-019 added. Outcome: planned. Nothing is built.

**2026-11-22:** Built and verified with a stub executor. The bots suite passed 164 tests and the deep-loop suite held at 4039 passed before and after the allowlist entry. Outcome: 15 criteria Met, AC-006 Unmet (do receipts count as logs), AC-008 Unmet (gateway replay, T014 blocked), the live executor run awaiting operator approval.
<!-- /ANCHOR:timeline -->

---

<!-- ANCHOR:milestones -->
## 3. MILESTONES
<!-- FILL: Name each milestone and whether it passed. GOOD: M1 passed. 3 archives left. WEAK: Milestones met. -->

**M1, first end-to-end manual run:** target after phase 1 closes. Status: Planned. Evidence: none yet.

**M2, phase closed:** every row in `acceptance-criteria.md` is `Met` or `Superseded`. Target after M1. Status: Planned. Evidence: none yet.
<!-- /ANCHOR:milestones -->
