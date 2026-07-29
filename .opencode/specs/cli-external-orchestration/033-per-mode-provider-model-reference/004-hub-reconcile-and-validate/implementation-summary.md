---
title: "Implementation Summary: Phase 4 — hub reconcile + adjacent fixes + validate"
description: "Hub docs now point at the per-mode catalogs, the three approved adjacent defects are fixed, and the full conformance battery is green."
trigger_phrases:
  - "hub reconcile provider pointers"
  - "version skew reconciled cli"
  - "stale scripts reference removed"
  - "cli conformance gates green"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/033-per-mode-provider-model-reference/004-hub-reconcile-and-validate"
    last_updated_at: "2026-07-29T09:39:46.394Z"
    last_updated_by: "implementer"
    recent_action: "Reconciled hub docs, fixed adjacent defects, ran conformance battery"
    next_safe_action: "Optional /memory:save to stamp continuity fingerprints and close the packet"
    blockers: []
    key_files:
      - "SKILL.md"
      - "README.md"
      - "hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-033-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-hub-reconcile-and-validate |
| **Completed** | 2026-07-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The hub-level documentation now points readers at the per-mode catalogs, three long-standing adjacent defects are fixed, and the whole hub still conforms.

### Hub reconcile + adjacent fixes

The parent SKILL.md §5 and README.md gained a pointer to the per-mode `providers-and-models.md` catalogs. The three operator-approved adjacent defects were fixed: the surface router now covers all six modes (phase 002); `hub-router.json` and `README.md` were aligned from 1.1.0.0 to 1.2.0.0, matching SKILL.md / mode-registry.json / description.json; and the phantom `cli-opencode/scripts/` directory was removed from the SKILL.md layout tree and the README §2 prose (it does not exist on disk).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `SKILL.md` | Modified | Catalog pointer; remove phantom `scripts/` |
| `README.md` | Modified | Catalog pointer; version → 1.2.0.0; remove phantom `scripts/` |
| `hub-router.json` | Modified | Version → 1.2.0.0 (no model-token change) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Edits were surgical and confined to the three approved defects plus the pointer bullets. The full conformance battery was then run and all gates passed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bump only the two lagging version fields | `hub-router.json` and `README.md` were the only laggards at 1.1.0.0; the rest of the hub was already 1.2.0.0 |
| Version field edit to hub-router.json is safe | The preservation rule protects model tokens / vocabulary classes, not the top-level version metadata |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `ci-skill-root-metadata.cjs` | PASS (11/11, hub clean class-H) |
| `parent-skill-check.cjs` | PASS (all hard invariants, 0 warnings) |
| `generate-leaf-manifest.cjs --check` | PASS (fresh) |
| `advisor_validate` (heavy) | PASS (status ok) |
| Advisor routing smoke (6 modes) | PASS (0.95 each) |
| `cli-opencode/scripts/` exists on disk | ABSENT (stale ref correctly removed) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Observed but out-of-scope:** README.md §2 states `defaultMode` is `cli-opencode`, but `hub-router.json` sets `routerPolicy.defaultMode: null` (and parent-skill-check expects null). This pre-existing doc/config inconsistency was not one of the three approved adjacent fixes, so it was left for the operator.
2. **Formal packet closure:** continuity fingerprints remain template zeros; a `/memory:save` would stamp real fingerprints and index the packet.
<!-- /ANCHOR:limitations -->
