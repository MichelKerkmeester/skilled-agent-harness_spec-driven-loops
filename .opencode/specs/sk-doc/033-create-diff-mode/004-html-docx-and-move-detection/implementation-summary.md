---
title: "Implementation Summary: HTML, DOCX, and move-aware review"
description: "Planned-state summary for the gated HTML and DOCX adapter, move detection, side-by-side report, and fidelity dashboard phase."
trigger_phrases:
  - "HTML DOCX phase summary"
  - "move-aware review status"
importance_tier: "critical"
contextType: "implementation"
status: "draft"
_memory:
  continuity:
    packet_pointer: "sk-doc/033-create-diff-mode/004-html-docx-and-move-detection"
    last_updated_at: "2026-07-13T18:30:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded the rich-structure phase from research"
    next_safe_action: "Wait for phase 003 unlock evidence"
    blockers:
      - "Phase 003 applicable gates"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-phase-004-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: HTML, DOCX, and move-aware review

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-html-docx-and-move-detection |
| **Status** | Planned; gated rich-format implementation not started |
| **Level** | 1 scaffold |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Only the phase packet was scaffolded. It now binds HTML and DOCX extraction, parser isolation, deterministic move mapping, side-by-side review, and fidelity diagnostics to the phase 003 gates.

### Files Created

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Authored | Capability, security, mapping, report, and handoff requirements |
| `plan.md` | Authored | Adapter and tree-mapping architecture plus verification path |
| `tasks.md` | Authored | Gated implementation queue |
| `description.json`, `graph-metadata.json` | Generated | Discovery and packet graph metadata |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The Spec Kit scaffold was populated from the phase 001 HTML, DOCX, move-detection, report, security, and capability-tier recommendations. No parser, worker, diff, or report code was changed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate rich adapters on phase 003 | Untrusted containers and licenses must be proven before implementation. |
| Keep exact, contextual, and similarity mapping stages explicit | Repeated content needs deterministic one-to-one behavior. |
| Keep static unified review authoritative | Side-by-side JavaScript is optional enhancement, not a dependency. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Phase scaffold validation | PASS: bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-doc/033-create-diff-mode/004-html-docx-and-move-detection --strict completed with 0 errors and 0 warnings |
| Product tests | Not run; implementation is gated and has not started |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No rich adapter exists yet.** HTML and DOCX remain unsupported by product code.
2. **Move thresholds are uncalibrated.** Phase 003 fixtures must provide measured selection evidence.
3. **Implementation is gated.** Security, license, and fixture checks must pass before production work.
<!-- /ANCHOR:limitations -->
