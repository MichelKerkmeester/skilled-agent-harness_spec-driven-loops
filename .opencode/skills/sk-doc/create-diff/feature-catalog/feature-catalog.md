---
title: "create-diff: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the create-diff sk-doc mode."
trigger_phrases:
  - "create-diff"
  - "document diff engine"
  - "before after document review"
  - "feature catalog"
last_updated: "2026-07-15"
version: 1.0.0.0
---

# create-diff: Feature Catalog

This document combines the current feature inventory for the `create-diff` sk-doc mode into a single reference. The root catalog acts as the mode-level directory: it summarizes each capability area, describes what the mode does today, and points to the per-feature files that carry the deeper implementation and validation anchors. Everything runs locally through `scripts/create_diff.py` (Python 3 standard library); source documents are never modified.

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `create-diff` feature surface. The numbered sections below group the mode by capability area — the comparison engine, the snapshot lifecycle, and safety/capability reporting — so readers can move from a top-level summary into per-feature reference files without losing implementation or validation context.

---

## 2. COMPARISON ENGINE

### Multi-format extraction

#### Description

Extracts comparable text from plain text, Markdown, HTML, DOCX, and text-layer PDF, each with an explicit fidelity tier so a comparison is never trusted beyond what the extractor can see.

#### Current Reality

Text and Markdown extract at full fidelity (Markdown also surfaces headings); HTML and DOCX extract visible/structural text only (styling, formatting, tracked changes not compared); PDF extracts the text layer when `pdftotext`, `pypdf`, or `pdfplumber` is available, and flags scanned/image-only PDFs rather than emitting an empty diff.

#### Source Files

See [`comparison-engine/multi-format-extraction.md`](comparison-engine/multi-format-extraction.md) for full implementation and test file listings.

---

### Deterministic diffing

#### Description

Produces a deterministic line-level diff with inline word-level highlighting and a cheap move heuristic, after canonicalizing both sides (Unicode NFC, newline, trailing-whitespace normalization).

#### Current Reality

Uses Python `difflib.SequenceMatcher` for line and token opcodes; identical inputs yield identical output. Long unchanged runs collapse to a labelled row; a removed line whose text reappears as an added line is counted as a possible move.

#### Source Files

See [`comparison-engine/deterministic-diffing.md`](comparison-engine/deterministic-diffing.md) for full implementation and test file listings.

---

### Self-contained report

#### Description

Renders the diff as a single self-contained HTML file — inlined CSS, zero JavaScript, a restrictive Content-Security-Policy, escaped source content, and accessibility affordances — in unified or side-by-side views.

#### Current Reality

The report opens from `file://` with no network access; added/removed lines carry `+`/`−` text markers alongside colour; dark/light themes are supported; output is byte-reproducible under `SOURCE_DATE_EPOCH`.

#### Source Files

See [`comparison-engine/self-contained-report.md`](comparison-engine/self-contained-report.md) for full implementation and test file listings.

---

## 3. SNAPSHOT LIFECYCLE

### Baseline snapshot and compare

#### Description

Captures a baseline copy of a document before an edit, then compares the edited file against that baseline — the capture-before-edit invariant.

#### Current Reality

`snapshot` copies the source into a local `.create-diff/` store (content-addressed, atomic write, source never touched); `compare` uses the latest baseline as "before" and the current file as "after".

#### Source Files

See [`snapshot-lifecycle/baseline-snapshot-and-compare.md`](snapshot-lifecycle/baseline-snapshot-and-compare.md) for full implementation and test file listings.

---

### Explicit-pair comparison

#### Description

Compares two explicit files with no stored state — the fallback when no baseline exists or when comparing two arbitrary versions.

#### Current Reality

`compare-pair --before A --after B` produces the same report as the snapshot flow without reading or writing the snapshot store; labels are configurable.

#### Source Files

See [`snapshot-lifecycle/explicit-pair-comparison.md`](snapshot-lifecycle/explicit-pair-comparison.md) for full implementation and test file listings.

---

### Snapshot state management

#### Description

Lists and prunes stored baselines so local snapshot state stays bounded.

#### Current Reality

`status` lists snapshots (all or per-file); `cleanup` removes them by age (`--older-than`) or wholesale, with `--dry-run` to preview; state lives under `.create-diff/` and is safe to delete.

#### Source Files

See [`snapshot-lifecycle/snapshot-state-management.md`](snapshot-lifecycle/snapshot-state-management.md) for full implementation and test file listings.

---

## 4. SAFETY AND CAPABILITIES

### Report safety validation

#### Description

Asserts a generated report is safe and self-contained before it is handed off.

#### Current Reality

`scripts/validate_report.py` checks doctype, `<html lang>`, a Content-Security-Policy meta tag, and — inspecting real markup only — no `<script>` tags, inline event handlers, or remote resource references; escaped hostile text in document content never false-positives.

#### Source Files

See [`safety-and-capabilities/report-safety-validation.md`](safety-and-capabilities/report-safety-validation.md) for full implementation and test file listings.

---

### Capability and fidelity reporting

#### Description

Reports which formats are supported, at what fidelity tier, and which optional PDF extractor is present, so limited-fidelity results are never presented as complete.

#### Current Reality

`capabilities` prints (or emits `--json`) the format matrix and detected PDF extractor; unsupported formats exit `3` with an actionable message and the explicit-pair fallback.

#### Source Files

See [`safety-and-capabilities/capability-tier-reporting.md`](safety-and-capabilities/capability-tier-reporting.md) for full implementation and test file listings.
