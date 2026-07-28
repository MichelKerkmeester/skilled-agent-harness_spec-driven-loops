---
title: "Multi-format extraction"
description: "Extracts comparable text from text, Markdown, HTML, DOCX, and text-layer PDF, each tagged with an explicit fidelity tier."
trigger_phrases:
  - "Multi-format extraction"
  - "extract comparable text from documents"
  - "text extraction fidelity tiers"
  - "supported document formats"
version: 1.0.0.0
---

# Multi-format extraction

<!-- sk-doc-template: skill_asset_feature-catalog -->

## 1. OVERVIEW

Extracts comparable text from plain text, Markdown, HTML, DOCX, and text-layer PDF, each with an explicit fidelity tier so a comparison is never trusted beyond what the extractor can see.

Every `compare` and `compare-pair` run starts here: the engine picks an extractor by file type, produces normalized text, and records the fidelity tier that later appears in the report summary. Text and Markdown are the only full-fidelity formats; HTML, DOCX, and PDF are text-only and carry an honest warning about what was dropped. The typical caller is the diff flow itself rather than a human, and the main failure mode is a format the extractor cannot read at all — handled by exiting `3` with a fallback message rather than emitting a misleading empty diff.

---

## 2. HOW IT WORKS

The engine selects an extractor from the file extension. Plain text is read directly; Markdown is read the same way and additionally surfaces its heading structure, so both reach the `full` tier. HTML is parsed with the standard-library `html.parser`, which drops `<script>` and `<style>` content and returns only visible text, and the run warns that styling and attributes are not compared. DOCX is unzipped with `zipfile` and its document XML walked with `xml.etree` to pull paragraph and table text, again at the `text` tier with a warning that formatting and tracked changes are not compared.

PDF is conditional: the engine tries `pdftotext`, then `pypdf`, then `pdfplumber`, using whichever is present, and reports the `text*` tier. A scanned or image-only PDF with no text layer is flagged explicitly rather than silently producing an empty diff; OCR is out of scope. When no extractor can handle the input, the run exits `3` with an actionable message that points at the explicit-pair fallback.

Whatever the source format, the extracted text is normalized before diffing (Unicode NFC, CRLF/CR to LF, trailing whitespace stripped per line) so that only meaningful content differences survive into the comparison.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/create_diff.py` | Script | Per-format extractors (text, Markdown, HTML via `html.parser`, DOCX via `zipfile`+`xml.etree`, PDF via pdftotext/pypdf/pdfplumber) that emit normalized text and a fidelity tier |
| `references/capabilities-and-fidelity.md` | Shared | Documents the supported formats, the full/text/conditional fidelity tiers, and the optional PDF extractor dependency |
| `assets/fixtures/onboarding-before.md`, `assets/fixtures/onboarding-after.md` | Shared | Shipped Markdown fixture pair demonstrating full-fidelity extraction |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/manual-testing-playbook.md` | Manual playbook | Scenarios CMP-001 (Markdown), CMP-002 (DOCX), and CMP-004 (HTML) exercise per-format extraction and the fidelity warnings |

---

## 4. SOURCE METADATA

- Group: COMPARISON ENGINE
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `comparison-engine/multi-format-extraction.md`

Related references:
- [deterministic-diffing.md](deterministic-diffing.md) — the deterministic line- and word-level diff applied to the extracted text
- [self-contained-report.md](self-contained-report.md) — the self-contained HTML report the extracted diff is rendered into
