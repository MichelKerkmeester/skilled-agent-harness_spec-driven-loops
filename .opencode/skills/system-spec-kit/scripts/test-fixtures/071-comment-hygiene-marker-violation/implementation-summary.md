---
title: "Implementation Summary: Comment Hygiene Violation Fixture"
description: "Violation fixture for the comment hygiene validation rule."
trigger_phrases:
  - "comment hygiene violation fixture"
importance_tier: "normal"
contextType: "general"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 071-comment-hygiene-marker-violation |
| **Completed** | 2026-07-01 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Comment Hygiene Violation Fixture gives the validator a compact Level 1 packet with one tracking marker inside an HTML comment.

### Comment Hygiene Violation Fixture

You can use this fixture to confirm the fail rule path without relying on production project docs.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| .opencode/skills/system-spec-kit/scripts/test-fixtures/071-comment-hygiene-marker-violation/spec.md | Added | Supplies marker violation fixture content |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fixture is verified by running the isolated comment hygiene harness category.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Place the marker in spec.md | The rule scans authored spec documents and reports file:line details |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Isolated comment hygiene harness | FAIL expected |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Fixture-only scope.** It does not describe a production feature.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
