---
title: "Self-contained report"
description: "Renders the diff as one self-contained, zero-JavaScript, CSP-locked, accessible HTML file in unified or side-by-side view."
trigger_phrases:
  - "Self-contained report"
  - "single-file HTML diff report"
  - "zero-JavaScript diff report"
  - "self-contained report renderer"
version: 1.0.0.0
---

# Self-contained report

<!-- sk-doc-template: skill_asset_feature-catalog -->

## 1. OVERVIEW

Renders the diff as a single self-contained HTML file — inlined CSS, zero JavaScript, a restrictive Content-Security-Policy, escaped source content, and accessibility affordances — in unified or side-by-side views.

The report is the only artifact a human actually opens, so it is built to be trustworthy offline: it loads from a `file://` path with no network access and cannot execute any script. Callers choose the layout with `--view unified` or `--view side-by-side`. The main safety concern the renderer defends against is hostile document content, which it neutralizes by escaping every source character before it reaches the page, and the main reproducibility concern is byte-stable output, which it guarantees under `SOURCE_DATE_EPOCH`.

---

## 2. HOW IT WORKS

### Core behavior

The renderer emits one HTML document with all CSS inlined and no JavaScript whatsoever. A restrictive Content-Security-Policy meta tag (`default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'`) locks the page down so that even if markup leaked in, nothing could load or run. Every character of source content is HTML-escaped, so a `<script>` in a document body renders as literal text rather than live markup. Two layouts are available — unified and side-by-side — selected by the `--view` flag.

### Accessibility and reproducibility

The report is built to an accessibility contract: a skip link, semantic landmarks, the summary and diff rendered as tables with `th` scope, `+`/`−` text markers carrying `aria-label` alongside the colour cue, dark and light theming via `prefers-color-scheme`, and relative units throughout. Output is byte-reproducible under `SOURCE_DATE_EPOCH`, so re-rendering the same diff produces an identical file — which is what lets `validate_report.py` and human reviewers trust it.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/create_diff.py` | Script | HTML report renderer: inlined CSS, zero JS, restrictive CSP meta tag, HTML-escaping of all source content, unified/side-by-side views, and `SOURCE_DATE_EPOCH` reproducibility |
| `references/accessibility-contract.md` | Shared | The self-containment and accessibility guarantees the report must satisfy and what the validator enforces |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/validate_report.py` | Automated test | Asserts doctype, `<html lang>`, and a CSP meta tag, and that real markup contains no `<script>`, inline handlers, or remote references |
| `manual-testing-playbook/manual-testing-playbook.md` | Manual playbook | SAFE-001 (self-contained zero-JS) and SAFE-002 (hostile content escaped) validate the rendered report |

---

## 4. SOURCE METADATA

- Group: COMPARISON ENGINE
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `comparison-engine/self-contained-report.md`

Related references:
- [multi-format-extraction.md](multi-format-extraction.md) — supplies the extracted text that becomes report content
- [deterministic-diffing.md](deterministic-diffing.md) — supplies the diff opcodes this report renders
