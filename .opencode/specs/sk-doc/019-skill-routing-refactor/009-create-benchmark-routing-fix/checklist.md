---
title: "Checklist: create-benchmark routing via redundant-alias swap"
description: "QA checklist for the redundant-alias swap, with evidence."
trigger_phrases:
  - "008 checklist create-benchmark routing swap"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/008-create-benchmark-routing-fix"
    last_updated_at: "2026-07-13T16:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "All items verified"
    next_safe_action: "Terminal validation"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

# Checklist: create-benchmark routing via redundant-alias swap

---

<!-- ANCHOR:protocol -->
## Verification Protocol
Every item carries a command or artifact reference.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] Redundancy of `skill-benchmark-report` confirmed (covered by `skill-benchmark`)
- [x] Clean vocab-sync baseline (score 100)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] Only the alias occurrence swapped; 13 prose filename references left intact
- [x] Swap applied identically across all three synced surfaces
- [x] No spec paths or artifact ids embedded in the JSON/markdown data
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing
- [x] `create a benchmark package` routes to create-benchmark
- [x] Coverage preserved: `generate a skill-benchmark-report` still routes to create-benchmark
- [x] Battery 11/11, no regression
- [x] vocab-sync score 100 / no drift / 0 collisions; d5 connectivity 100 / hub-registry 100
- [x] `package_skill.py --check` errors 0, 4997 words < 5000 cap
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] The deferred create-benchmark case from 007 is resolved
- [x] No word-cap breach and no vocab drift introduced
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
- [x] Routing-config data only; no capability, tool, or permission change
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
- [x] Second-opinion provenance (cli-codex / GPT-5.6-sol) recorded in spec + implementation-summary
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
- [x] Edits scoped to create-benchmark/SKILL.md + hub-router.json + mode-registry.json
- [x] No skill-advisor registry or deep-alignment edits
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Target prompt fixed | 1 | 1/1 |
| Coverage preserved after alias removal | 1 | 1/1 |
| Regression on other modes | 0 | 0 |
| Guards green (vocab-sync, d5) | 2 | 2/2 |

**Verification Date**: 2026-07-13
<!-- /ANCHOR:summary -->
