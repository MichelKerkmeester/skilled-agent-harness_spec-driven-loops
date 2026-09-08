---
title: "Feature Specification: screenshot library of well-designed charts from external sources"
description: "A screenshot library of well-designed charts from public component libraries, chart libraries, design systems and editorial chart products, captured in both colour schemes with an index of what each one is worth borrowing."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: screenshot library of well-designed charts from external sources

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | [P0/P1/P2] |
| **Status** | Complete |
| **Created** | 2026-09-08 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The chart corpus was measured against one external reference, the frozen shadcn copy. The survey of other libraries and style guides named a dozen more sources with strong chart design, but none of them existed in the repository as something a designer could look at beside the corpus captures. Reading a docs page is not the same as seeing the chart.

### Purpose
A curated, indexed screenshot library of well-designed charts from public sources, in both colour schemes where the source supports them, with one line per capture on what to borrow and a record of what could not be captured and why.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Three capture rounds over 58 candidate pages: two with bare headless Chrome at 1440 by 1000, then a Playwright pass driving the installed Chrome that scrolls each page so lazily rendered cards draw and captures down to 3200 pixels; a contact-sheet tool for triage.
- 52 page keepers from 39 sources converted to JPEG under `library/`, with `index.md` (source, kind, what to look at), `index.json` and a browsable `gallery.html` that links each capture to its source.
- 210 element-level chart crops at 2x under `library/details/` from 24 source pages, found by what they are (SVG, canvas, chart image, chart card or the iframe a page renders a chart in), scrolled into view and captured alone with a margin; curated by eye, with their own `index.md`, `index.json` and `gallery.html`. Vercel, Carbon and Apple were widened to five, seven and five pages for this.
- A "not captured" record naming every source that failed and why.

### Out of Scope
- Shipping any capture inside the skill - the pages belong to their publishers; the library is packet reference material.
- Native app charts (Apple Health, Stocks) - the HIG page stands in.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `library/*.jpg` (52) | Create | The page captures, 1200 wide, scrolled pages down to 3200 pixels |
| `library/details/*.jpg` (210) | Create | The chart crops at 2x, longest side 1600 |
| `library/details/{index.md,index.json,gallery.html}` | Create | Index and gallery for the crops |
| `scratch/capture-details.cjs`, `scratch/build-details.py` | Create | Crop capture and builder |
| `library/index.md`, `library/index.json`, `library/gallery.html` | Create | Index, manifest and gallery |
| `scratch/capture-playwright.cjs`, `scratch/sources.json`, `scratch/build-library.py`, `scratch/contact-sheet.cjs` | Create | Reproduction: capture, source manifest with the dark-scheme flag, builder, triage sheet |
| `scratch/capture.sh`, `scratch/capture-round2.sh` | Create | The first two bare-Chrome rounds, kept as the record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every keeper has a source URL, capture date, scheme and a borrowable note in the index, and every failed source is listed with its reason | `library/index.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | The library is browsable offline and each capture links to its source | `library/gallery.html` rendered and read |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 52 page captures from 39 sources and 210 chart crops from 24 pages, all triaged by eye from contact sheets.
- **SC-002**: The gallery page renders every capture with its caption and source link.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Public pages reachable without login | Some sit behind consent or verification walls | Recorded as not captured |
| Risk | Captures age as sites change | Low | Each carries its date and the scripts reproduce the run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Tremor's tracker, bar list and spark components sit below the crop size floor and inside the docs frame, so they are in the page captures but not the crops; a hand crop would add them.
<!-- /ANCHOR:questions -->

---


