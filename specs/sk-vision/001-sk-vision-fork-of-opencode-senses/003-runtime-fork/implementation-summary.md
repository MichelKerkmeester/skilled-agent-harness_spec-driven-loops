---
title: "Implementation Summary: sk-vision 003 runtime fork"
description: "This child will fork shipped Senses v0.2.0 into vision-runtime, rebrand identifiers, and emit dist/plugin.js."
trigger_phrases:
  - "sk-vision runtime summary"
importance_tier: "critical"
contextType: "summary"
_memory:
  continuity:
    packet_pointer: "sk-vision/001-sk-vision-fork-of-opencode-senses/003-runtime-fork"
    last_updated_at: "2026-08-15T17:45:00.000Z"
    last_updated_by: "cursor-grok"
    recent_action: "Rewrote planned delivery claims; GPU load then status."
    next_safe_action: "Wait for 002; then copy dump into vision-runtime/."
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-vision-003-runtime-20260815"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-vision 003 runtime fork

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-runtime-fork |
| **Completed** | Not yet |
| **Level** | 3 |
| **Status** | Planned |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This child will copy shipped OpenCode Senses v0.2.0 into `.opencode/skills/sk-vision/vision-runtime/` after 002 closes. No runtime tree exists yet.

### Core Runtime Extraction
This child will copy shipped TypeScript and Python files from `../context/`, omitting unbuilt `PLAN.md` roadmap work.

### Systematic Rebranding
This child will map `SENSES_*` to `SK_VISION_*`, cache to `~/.cache/sk-vision`, evidence to `<SK-VISION>`, and tools to the 13 dump `sk_vision_*` names. Package name is `sk-vision`. Do not invent `sk_vision_query`.

### Build Output
This child will emit `dist/plugin.js` for 004 to import, or document a `tsc` substitute.

### GPU Smoke
Optional JSON-RPC `load` then `status` on NVIDIA Ampere+ or Apple Silicon. First load ~3.9 GB. SKIP allowed. `ping` is not the smoke.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. Close this child only after the identifier `rg` is clean, tests pass, `dist/plugin.js` exists or a substitute is documented, and GPU `load`/`status` or SKIP is recorded.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

- Shipped Core Fork: shipped v0.2.0 files only (ADR-002).
- MIT Dual Copyright: keep Adarsh Gourab Mahalik 2026 and add the project notice (ADR-004).
- Package name: `sk-vision`, not `@opencode-ai/sk-vision`.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate / Check | Target | Result |
|--------------|--------|--------|
| Rebrand Audit | `rg` for `SENSES_` / `opencode-senses` / `senses_` | Not run |
| Build Pipeline | `dist/plugin.js` | Not emitted |
| GPU Smoke | RPC `load` then `status`, or SKIP | Not run |
| Spec Validation | `validate.sh --strict` on this child | Pending implementation close |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Blocked on `002-skill-scaffold` (still Planned).
- OpenCode loader adapter is deferred to `004-opencode-adapter`.
- Pi extension adapter is deferred to `005-pi-adapter`.
<!-- /ANCHOR:limitations -->
