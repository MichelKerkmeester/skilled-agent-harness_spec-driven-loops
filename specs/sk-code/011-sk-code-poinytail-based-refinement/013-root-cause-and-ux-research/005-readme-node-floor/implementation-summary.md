---
title: "Implementation Summary: Phase 5: readme-node-floor"
description: "The README now tells adopters the Node version its own install steps need: 20.19 or newer."
trigger_phrases:
  - "readme node floor implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/005-readme-node-floor"
    last_updated_at: "2026-10-10T20:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase"
    next_safe_action: "Start the next phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-005-readme-node-floor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 5: readme-node-floor

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-readme-node-floor |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The README now tells adopters the Node version its own install steps need: 20.19 or newer.

### Phase 5: readme-node-floor

The research flagged a three-way disagreement but read the wrong lockfile. Rechecked, the spec-kit package is consistent at 20.11. The real gap is the advisor runtime, which the README's step 3 installs and whose rolldown and vite declare `^20.19.0 || >=22.12.0`. So the README line changed and the spec-kit package did not.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `README.md` | Modified | Node.js 20.19+ |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

One cli-pi build by DeepSeek V4.1 Flash at max effort on llmgateway; the orchestrator rechecked both lockfiles and the README validator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Leave package engines alone | No dependency of the spec-kit package needs more than 20.9 |
| Hand off the advisor runtime engines | That runtime belongs to the skill-authoring track |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `sed -n 160p README.md` | `- Node.js 20.19+ (22.12+ for the spec-kit runtime CLI)` |
| `validate_document.py README.md` | VALID, 0 issues |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **npm still does not warn at the advisor runtime install.** Its `package.json` has no `engines` field; adding one is handed to the track that owns that runtime.
<!-- /ANCHOR:limitations -->

---
