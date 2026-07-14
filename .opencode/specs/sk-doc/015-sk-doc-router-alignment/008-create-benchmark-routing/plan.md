---
title: "Implementation Plan: create-benchmark routing via redundant-alias swap"
description: "Swap one redundant alias for benchmark package across three synced surfaces, then prove the route, the coverage preservation, and the guards."
trigger_phrases:
  - "008 plan create-benchmark routing swap"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-router-alignment/008-create-benchmark-routing"
    last_updated_at: "2026-07-13T16:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Swap verified across battery and guards"
    next_safe_action: "Terminal validation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: create-benchmark routing via redundant-alias swap

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
Routing-config edit in the sk-doc hub. One redundant alias is swapped, not added, so the word-capped packet stays under cap and the drift guard stays green.
### Overview
Preserve coverage by swapping `skill-benchmark-report` (substring-covered by `skill-benchmark`) for `benchmark package`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
Redundancy confirmed: `skill-benchmark` substring-covers `skill-benchmark-report`.
### Definition of Done
Benchmark prompt routes correctly, coverage preserved, no regression, vocab-sync 100, d5 clean, `--check` errors 0 under cap.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Redundant-alias swap: replace a longer alias that a shorter retained alias already substring-covers, freeing the slot for a new phrase without a net keyword add. Applied identically across the three synced surfaces.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Confirm `skill-benchmark-report` is redundant and locate it in all three surfaces (14 SKILL.md hits: 1 alias + 13 prose; 1 each in the JSONs).
2. Swap the alias occurrence for `benchmark package` in all three surfaces; leave prose filenames intact.
3. Verify route, coverage preservation, battery, guards, and `--check`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
`router-replay` for the target prompt plus a coverage-preservation prompt (`generate a skill-benchmark-report`) and a full regression battery; `parent-hub-vocab-sync` and `d5-connectivity` on the hub; `package_skill.py --check` on create-benchmark.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- Sibling `007-hub-intent-keyword-coverage` (same root cause; deferred this case).
- `parent-hub-vocab-sync.cjs`, `router-replay.cjs`, `d5-connectivity.cjs`.
- Second-opinion review via `cli-codex` (GPT-5.6-sol) that proposed the swap.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Single alias swap across three files. Rollback = revert the commit; the prior alias returns.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- `./spec.md`, `./tasks.md`, `./checklist.md`, `./implementation-summary.md`
- Sibling: `../007-hub-intent-keyword-coverage/`
