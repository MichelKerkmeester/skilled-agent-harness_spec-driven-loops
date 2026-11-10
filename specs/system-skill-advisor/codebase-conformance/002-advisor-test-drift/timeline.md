---
title: "Timeline: advisor-test-drift"
description: "Tracks each advisor drift child's start, outcome and latest commit."
trigger_phrases:
  - "advisor scorer drift timeline"
  - "advisor suite reconciliation chronology"
  - "playbook inventory timeline"
  - "advisor test gate chronology"
importance_tier: "normal"
contextType: "general"
---
# Timeline: advisor-test-drift

<!-- SPECKIT_TEMPLATE_SOURCE: timeline | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This timeline records each child packet's dates and outcome.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Subject:** Advisor test and playbook drift reconciliation
**Status:** Complete
**Started:** 2026-08-15
**Last updated:** 2026-09-20
**Owner:** regenerated from git log over each child's current and former paths
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:timeline -->
## 2. TIMELINE

**2026-08-15:** `001-code-graph-retirement-drift` (was `019-code-graph-retirement-drift`) started; 6 commits, 0 nested phases. Outcome: The scorer now skips invalid retired-skill entries, and remaining failures were triaged without weakening gates. Status Complete; last commit 2026-09-20. Key commits: 0661a0f, 72d9566, 52946a6.

**2026-08-15:** `002-advisor-suite-drift-reconciliation` (was `021-advisor-suite-drift-reconciliation`) started; 5 commits, 0 nested phases. Outcome: Advisor suite expectations and derived copies now reflect legitimate behavior, with gates intact. Status Complete; last commit 2026-09-07. Key commits: c9359c2, 52946a6, 7e7da2f.

**2026-08-16:** `003-playbook-inventory-reconciliation` (was `022-playbook-inventory-reconciliation`) started; 3 commits, 0 nested phases. Outcome: The playbook table and inventory test now match the scenario files on disk. Status Complete; last commit 2026-08-30. Key commits: 52946a6, 7b3ca05, e48374a.
<!-- /ANCHOR:timeline -->

---

<!-- ANCHOR:milestones -->
## 3. MILESTONES

**Code-Graph Retirement Test Drift:** target 2026-09-20. Status: Done. Evidence: `001-code-graph-retirement-drift/`.

**Advisor Suite Drift Reconciliation:** target 2026-09-07. Status: Done. Evidence: `002-advisor-suite-drift-reconciliation/`.

**Playbook Inventory Reconciliation:** target 2026-08-30. Status: Done. Evidence: `003-playbook-inventory-reconciliation/`.
<!-- /ANCHOR:milestones -->
