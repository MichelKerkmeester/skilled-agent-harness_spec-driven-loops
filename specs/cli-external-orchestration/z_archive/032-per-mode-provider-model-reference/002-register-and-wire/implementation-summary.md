---
title: "Implementation Summary: Phase 2 — register leaves + wire pointers + fix smart-routing"
description: "The six new catalogs are registered as advisor-routable leaves and the stale 3-mode surface router now covers all six modes."
trigger_phrases:
  - "leaf manifest regenerated cli"
  - "smart-routing six modes"
  - "cli catalog leaf registration"
  - "surface router version bump"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-per-mode-provider-model-reference/002-register-and-wire"
    last_updated_at: "2026-08-11T07:16:29.255Z"
    last_updated_by: "implementer"
    recent_action: "Regenerated leaf-manifest and expanded smart-routing to six modes"
    next_safe_action: "Trim duplicated enumerations (phase 003)"
    blockers: []
    key_files:
      - "leaf-manifest.json"
      - "shared/references/smart-routing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-033-002"
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
| **Spec Folder** | 002-register-and-wire |
| **Completed** | 2026-07-29 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The six new catalogs are now discoverable by both the advisor and human readers, and the hub's surface router — which had silently covered only three of the six modes — now covers all six.

### Leaf registration

`leaf-manifest.json` was regenerated through the canonical generator so each mode's `references/providers-and-models.md` registers as a routable leaf (six new leaves, one per mode).

### Surface-router repair

`shared/references/smart-routing.md` grew from three modes to six: `INTENT_SIGNALS` and `RESOURCE_MAP` now enumerate cursor, devin, and pi alongside opencode, claude-code, and codex, and the prose no longer claims only three executors. The new catalog is documented as an on-demand deeper reference (not first-slice), keeping each mode's first-slice leaf set at its established two entries so the compiled-routing and benchmark contracts are unperturbed. Version bumped 1.0.0.1 to 1.0.0.2.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `leaf-manifest.json` | Modified (generated) | Register six new catalog leaves |
| `shared/references/smart-routing.md` | Modified | 3 to 6 modes + version bump |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The manifest was regenerated (never hand-edited) via `generate-leaf-manifest.cjs --write` and confirmed fresh with `--check`. The surface-router edits were verified: six intents present, two leaves per mode, all `RESOURCE_MAP` paths resolve on disk and are manifest-registered.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Catalog is an on-demand leaf, not first-slice | The design note reserves the first slice for the CLI reference + integration patterns; adding the catalog there would perturb the deterministic router-replay and benchmark expectations |
| Regenerate manifest via the generator, never by hand | The freshness gate compares committed vs a fresh regeneration byte-for-byte |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `generate-leaf-manifest.cjs --check` | PASS (fresh, six new leaves) |
| `smart-routing.md` INTENT_SIGNALS keys | PASS (6 modes) |
| All `RESOURCE_MAP` paths resolve + manifest-registered | PASS (18/18) |
| `parent-skill-check.cjs` router invariants | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pointer links land in phase 003.** The per-mode SKILL.md / cli-reference.md pointers to the catalog are delivered as the natural residue of the phase-003 trim, to avoid editing the same sections twice.
<!-- /ANCHOR:limitations -->
