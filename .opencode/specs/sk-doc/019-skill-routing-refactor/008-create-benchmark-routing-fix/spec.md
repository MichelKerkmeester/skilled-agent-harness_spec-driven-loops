---
title: "Feature Specification: create-benchmark routing via redundant-alias swap"
description: "The hub router mis-routed 'create a benchmark package' to create-skill because create-benchmark's alias class held only artifact-path terms and a redundant skill-benchmark-report alias (already substring-covered by skill-benchmark). Swap the redundant alias for benchmark package across all three synced surfaces — word-neutral under the 5000-word cap, drift-free, zero coverage loss."
trigger_phrases:
  - "create-benchmark routing swap"
  - "benchmark package hub routing"
  - "redundant alias swap"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-sk-doc-router-alignment/008-create-benchmark-routing"
    last_updated_at: "2026-07-13T16:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Swapped a redundant benchmark alias for benchmark package"
    next_safe_action: "Terminal validation and optional commit"
    blockers: []
    completion_pct: 100
    status: "Complete"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: create-benchmark routing via redundant-alias swap

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-13 |
| **Parent Packet** | `sk-doc/018-sk-doc-router-alignment` |
| **Sibling** | `007-hub-intent-keyword-coverage` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`create a benchmark package` mis-routed to `create-skill`: create-benchmark's alias class held only artifact-path terms (`benchmark_report.md`, `skill-benchmark`, `model-benchmark`, …) and no phrase matching that prompt, so it tied on the generic authoring verb and lost the tiebreak. The sibling 007 fix left this open because create-benchmark's SKILL.md sits at the 5000-word hard cap, so a naive keyword add risked a `--check` FAIL, and a hub/registry-only add would trip the vocab-sync drift guard.

### Purpose
Fix the route within the constraints by swapping the **redundant** `skill-benchmark-report` alias — which `skill-benchmark` already substring-covers — for `benchmark package` across all three synced surfaces. This adds routing coverage without a net keyword add, staying under the word cap and drift-free.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the `skill-benchmark-report` alias with `benchmark package` in the packet `Keyword triggers:` line, `mode-registry.json` aliases, and `hub-router.json` vocabularyClasses.

### Out of Scope
- The 13 prose occurrences of `skill-benchmark-report` as a filename in create-benchmark's SKILL.md (legitimate references, not routing aliases — untouched).
- Any other create-benchmark content or word-cap change beyond the one-token swap.
- The skill-advisor registry.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: `create a benchmark package` routes to `create-benchmark`.
- R2: Removing the `skill-benchmark-report` alias loses no coverage — a task naming it still routes to create-benchmark via the retained `skill-benchmark` alias.
- R3: All three synced surfaces agree; `parent-hub-vocab-sync` reports score 100, no drift.
- R4: create-benchmark still passes `package_skill.py --check` (errors 0) under the 5000-word cap.
- R5: No routing regression across the other modes.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Routing battery: create-benchmark prompt fixed; other modes unchanged.
- Redundancy check: `generate a skill-benchmark-report` still routes to create-benchmark.
- vocab-sync score 100 / no drift; d5 connectivity 100 / hub-registry 100.
- `package_skill.py --check` errors 0, words under cap.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Risk:** removing an alias could drop coverage. Mitigated — verified empirically that `skill-benchmark` substring-covers `skill-benchmark-report`, so routing is preserved.
- **Dependency:** the three-surface sync contract; `router-replay.cjs` substring semantics. A second-opinion review (GPT-5.6-sol via cli-codex) proposed this redundant-alias swap over a word-cap exception or a SKILL.md trim.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The word-cap constraint is resolved by the word-neutral swap.
<!-- /ANCHOR:questions -->
