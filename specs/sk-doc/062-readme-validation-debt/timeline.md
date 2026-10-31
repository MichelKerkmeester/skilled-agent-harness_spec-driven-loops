---
title: "Timeline: readme-validation-debt"
description: "Tracks README audit fixes and the removal of checker false positives."
trigger_phrases:
  - "readme validation timeline"
  - "broken reference debt chronology"
  - "changelog audit findings timeline"
importance_tier: "normal"
contextType: "general"
---
# Timeline: readme-validation-debt

<!-- SPECKIT_TEMPLATE_SOURCE: timeline | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Tracks README and changelog audit findings and the fixes for false positives.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** README validation and reference debt
**Status:** Complete
**Started:** 2026-10-27
**Last updated:** 2026-10-28
**Owner:** regenerated from git log over each child's current and former paths
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:timeline -->
## 2. TIMELINE

**2026-10-27:** `001-repo-doc-debt` (was `070-repo-doc-debt`) started; 7 commits, 7 nested phases. Outcome: Fix every finding that is real drift, keep every fact while doing it, and record each finding left in place with the reason it stays. Status Complete; last commit 2026-10-28. Key commits: 2c19c00da7, a11614dfc1, be4535e456.

**2026-10-27:** `002-readme-reference-debt` (was `071-readme-reference-debt`) started; 4 commits, 0 nested phases. Outcome: Every real broken reference or wrong count in the 12 READMEs is fixed, every systematic false positive is fixed once in the checker, and every failure left standing is recorded with its reason. Status Complete; last commit 2026-10-28. Key commits: ca2c37cb01, 6e23ee87f8, 7059cceb4d.
<!-- /ANCHOR:timeline -->

---

<!-- ANCHOR:milestones -->
## 3. MILESTONES

**Clear repo-wide documentation debt: broken README references, README template conformance, changelog internal ids and test counts:** target 2026-10-28. Status: Done. Evidence: `001-repo-doc-debt/`.
**Triage and fix the README reference and derived-count check failures across the root and hub READMEs:** target 2026-10-28. Status: Done. Evidence: `002-readme-reference-debt/`.
<!-- /ANCHOR:milestones -->
