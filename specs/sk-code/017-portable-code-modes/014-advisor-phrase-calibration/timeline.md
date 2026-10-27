---
title: "Timeline: Advisor phrase calibration: an exact declared multi-word phrase beats repeated generic one-word hits"
description: "Chronological record of the cause confirmation, the baselines, the first Python attempt that regressed and the narrowed fix."
trigger_phrases:
  - "advisor phrase calibration timeline"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: timeline | v2.2 -->
# Timeline: Advisor phrase calibration: an exact declared multi-word phrase beats repeated generic one-word hits

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> The order in which the cause was confirmed, the gates were baselined and the fix was narrowed.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** Explicit-lane phrase calibration in the skill advisor
**Status:** Complete
**Started:** 2026-10-27
**Last updated:** 2026-10-27
**Owner:** Implementer lane
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:timeline -->
## 2. TIMELINE

**2026-10-27:** The lane breakdown on a fixture surface showed `author:browser` and `author:css` scored twice each, once per metadata field. Outcome: the reported cause was confirmed and refined to a repeat of one word.

**2026-10-27:** The vitest suite failed four graph-sensitive tests on the fresh worktree until its gitignored skill-graph SQLite was indexed. Outcome: a clean baseline of 153 files and 1301 passed tests, with the Python, accuracy and reach baselines captured beside it.

**2026-10-27:** The plain dedup on both sides passed the TypeScript gates but failed the legacy corpus parity (113 to 111) and the divergence ratchet. Outcome: the Python rule was narrowed to repeats under a rival exact phrase, and every gate then matched its baseline.
<!-- /ANCHOR:timeline -->

---

<!-- ANCHOR:milestones -->
## 3. MILESTONES

**Cause confirmed:** target before any edit. Status: Done. Evidence: spec.md, Measured Behavior.

**Gates unchanged:** target after the rebuild. Status: Done. Evidence: implementation-summary.md, Verification.
<!-- /ANCHOR:milestones -->
