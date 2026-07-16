---
title: "Implementation Summary: sk-doc create-diff mode wrapper and accessibility"
description: "Delivery summary for the create-diff nested sk-doc mode: a self-contained embedded engine (ADR-003) with references, fixtures, and passing canon gates."
trigger_phrases:
  - "OpenCode skill phase summary"
  - "document diff accessibility status"
importance_tier: "important"
contextType: "implementation"
status: "active"
_memory:
  continuity:
    packet_pointer: "sk-doc/033-create-diff-mode/006-opencode-skill-and-accessibility"
    last_updated_at: "2026-07-15T13:52:51Z"
    last_updated_by: "claude"
    recent_action: "Refined the engine: binary/unsupported refusal and a code-diff report redesign; re-ran all gates"
    next_safe_action: "Add the optional command or extend format fidelity"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "document-diff-phase-006-scaffold"
      parent_session_id: null
    completion_pct: 85
    open_questions:
      - "Whether to add the command and richer adapters"
    answered_questions:
      - "The mode embeds the engine, not a separate package"
      - "Automatic capture is default with explicit-pair fallback"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: sk-doc create-diff mode wrapper and accessibility

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-opencode-skill-and-accessibility |
| **Status** | Active: create-diff mode v1 in progress (self-contained embedded engine, ADR-003); richer fidelity, optional command, and OCR pending |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `create-diff` nested sk-doc mode, delivered as a self-contained embedded engine rather than a wrapper over a separate npm package (see `../001-research-and-requirements/decision-record.md` ADR-003).

### Files Created / Changed (under `.opencode/skills/sk-doc/create-diff/`)

| File | Action | Purpose |
|------|--------|---------|
| `scripts/create_diff.py` | Created / Refined | Comparison engine: extraction (text, Markdown, HTML, DOCX, text-PDF), deterministic line + inline word diff, content-addressed snapshots, and the self-contained HTML report renderer (Python 3 stdlib). Refined: honest refusal of binary/unsupported formats (NUL-byte content sniff + extension denylist → exit 3) and a code-diff report redesign (GitHub-style `@@` hunk headers, change-summary stat strip, cell-level add/remove tinting, verified WCAG-AA palette, paired change rows and scoped horizontal scroll in side-by-side). |
| `scripts/validate_report.py` | Created | Asserts a report is safe/self-contained (doctype, lang, CSP, zero-JS, no inline handlers, no remote refs). |
| `SKILL.md` | Rewritten | Functional contract; removed preview gating; added INTEGRATION POINTS and RELATED RESOURCES. |
| `README.md`, `changelog/v1.1.0.0.md` | Updated / Created | Functional overview and version bump to 1.1.0.0. |
| `references/*.md` | Created | Capabilities/fidelity, workflow, CLI reference, accessibility contract, worked example, and route-map. |
| `assets/fixtures/*` | Created | Runnable before/after worked example. |
| `feature-catalog/*` | Created | Capability inventory — root + 8 per-feature files (3 categories), to the create-feature-catalog template. |
| `manual-testing-playbook/*` | Created | Manual validation — root + 11 scenario files (3 categories), to the create-manual-testing-playbook template. |
| `../SKILL.md` | Updated | Hub mode-table row now describes the functional mode. |
| `../mode-registry.json`, `../hub-router.json` | Unchanged | create-diff was already registered in v1.0.0.0; no edit needed. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Fidelity tiers: text and Markdown (full), HTML and DOCX (visible/structural text), text-layer PDF (conditional on `pdftotext`/`pypdf`/`pdfplumber`). The mode captures a baseline before an edit, compares after, falls back to an explicit pair when no baseline exists, and renders a self-contained, zero-JavaScript, accessible HTML report. Source files are never mutated; all processing is local. The engine is Python-stdlib-first for zero-install self-containment.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Embed the engine as skill-owned Python scripts (ADR-003) | The separate-npm-package path was blocked on an unresolved host-path question; embedding makes the mode work with zero install. |
| Python 3 stdlib rather than Node/TS | `difflib`, `zipfile` (DOCX), `html.parser` (HTML) are stdlib, so no bundled dependencies; mirrors the self-contained create-flowchart sibling. |
| Treat pre-write capture as an invariant | A snapshot taken after mutation cannot recover the original document. |
| Keep explicit-pair comparison first-class | Automatic state can be unavailable, locked, or intentionally disabled. |
| State fidelity tiers honestly | Text/text* formats never claim formatting or layout fidelity; scanned PDFs are flagged, not silently emptied. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Cross-format engine suite | PASS: 27/27 checks across text, Markdown, HTML, DOCX, and PDF (diff correctness, snapshot flow, explicit-pair fallback, XSS-safe escaping, source-unchanged). |
| Report safety validator | PASS: `validate_report.py` confirms self-contained, zero-JS, CSP, no remote refs. |
| `package_skill.py --check` | PASS (8 warnings: 6 are the intentional 017 hyphen-naming advisories on `references/`+`assets/` names, 2 are the bare data fixtures). |
| `parent-skill-check.cjs` | PASS: all hard invariants, 0 warnings. |
| `check-frontmatter-versions.sh` | Exit 0. |
| Spec-folder strict validation | `validate.sh --recursive --strict` on the parent — Errors 0, Warnings 0. |
| Binary/unsupported refusal | PASS: `.xlsx` and NUL-byte content refused with exit 3 (`EXIT_UNSUPPORTED`) instead of a misleading text fallback. |
| Report redesign structure | PASS: hunk headers, stat strip, legend, and paired side-by-side change rows render; hostile `<script>`/`onerror=` stays escaped-inert (0 live handlers); output byte-reproducible under fixed `SOURCE_DATE_EPOCH`. |
<!-- /ANCHOR:verification -->

> **Post-review remediation (see `../008-fidelity-safety-a11y-hardening/`).** An adversarial GPT-5.6 review, independently re-verified, found that this phase's "WCAG-AA both themes" claim did not hold for the legend inline swatches (three pairs failed) and that the "scoped horizontal scroll" for side-by-side wrapped instead of scrolling and was not keyboard-reachable; it also surfaced pre-existing engine gaps (replacement-character decoding erasing byte-level differences; a validator that only checked CSP presence). All were fixed and locked with a checked-in `test_create_diff.py` suite in packet 008. Treat the contrast and scroll claims above as accurate only as of that remediation.

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Text-fidelity for HTML/DOCX/PDF.** Formatting, styling, layout, images, comments, and tracked changes are not compared; the report states this per format.
2. **PDF needs a local extractor** (`pdftotext`/`pypdf`/`pdfplumber`); scanned/image-only PDFs are flagged, and OCR (phase 007) is out of scope.
3. **No `/create:diff` command yet.** The mode routes via advisor aliases and direct script invocation; the command is an optional follow-up.
4. **Richer fidelity and a portable-package extraction** remain possible future work.
<!-- /ANCHOR:limitations -->
