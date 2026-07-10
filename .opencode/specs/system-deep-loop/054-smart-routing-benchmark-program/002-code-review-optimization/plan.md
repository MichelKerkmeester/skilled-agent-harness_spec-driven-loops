---
title: "Implementation Plan: code-review Routing Optimization"
description: "Plan to wire code-review's orphan references into RESOURCE_MAP intents, align its Type-1 gold with the router's ALWAYS-tier loads, and re-benchmark."
trigger_phrases:
  - "code-review optimization plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/002-code-review-optimization"
    last_updated_at: "2026-07-09T05:03:21Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the code-review routing-optimization plan"
    next_safe_action: "Wire orphan refs into intents, align gold, re-benchmark"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-review/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session_01Ht7J9NZTEBBXwzTeNvras9"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions:
      - "Wire orphans + map ALWAYS into intents; no thoroughness change — operator-locked"
---
# Implementation Plan: code-review Routing Optimization

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
Additive router change (4 new intents reaching the 5 orphan files) + gold alignment (prepend the ALWAYS refs each scenario's router loads) + re-benchmark. No thoroughness change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- D5 = 100 (no orphan_reference findings).
- Every pre-existing intent/keyword/map entry byte-unchanged.
- Mode-A stays PASS; Mode-B rises from 69.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
The router keeps its ALWAYS tier (thoroughness contract). The 4 added intents (`CORE`, `COMPLETENESS`, `PR_STATE`, `SETUP`) exist to make every resource reachable from a meaningful intent so the D5 connectivity gate credits them. The gold is aligned to the router's real load so D3 stops penalizing legitimate base loads.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Router: add the 4 intents + RESOURCE_MAP entries.
2. Gold: prepend the ALWAYS refs to each of the 7 scenarios.
3. Re-benchmark Mode-A + Mode-B; confirm D5/D3/aggregate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Router-replay + D5 connectivity scan for orphan count; Mode-A verdict for no-regression; Mode-B live re-baseline for the aggregate rise.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| Sibling 001 asset-fold scorer fix | Met | Without it, live asset recall would still read 0 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
- **Trigger**: A new intent misroutes an existing scenario, or Mode-A regresses.
- **Procedure**: Revert the additive router block + gold prepends; both are self-contained diffs.
<!-- /ANCHOR:rollback -->
