---
title: "Feature Specification: Generate one gallery page rendering every form in both colour schemes"
description: "One page carrying every chart form twice, once per pinned colour scheme, generated from the templates directory so a missing form is impossible rather than merely unlikely."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Generate one gallery page rendering every form in both colour schemes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `010-corpus-expansion-and-gallery` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Every file in the corpus carries a dark palette block behind `prefers-color-scheme`, and the checker
proves that block reaches the paint. What nobody can do is see the two schemes together: comparing
them means changing a system setting and reloading, one form at a time, twenty-six times.

The obvious fix is a page listing every form. The obvious fix is also how a corpus acquires a page
that quietly omits the form somebody added last week, and an omission of that kind is
indistinguishable from a form that was never meant to be listed.

### Purpose

One self-contained page showing every form in both schemes, generated from the directory rather
than written by hand, with a corpus rule that makes a stale gallery an error.

### Non-Goals

- Restyling anything. The gallery frames the corpus; it does not change it.
- A build step for the charts. The generator writes one static page and the charts stay as they are.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Generated, never authored

`scripts/build-gallery.cjs` reads `assets/templates/`, and `--check` fails when the written page
differs by a byte from what a fresh build would produce. That is the whole design: the page cannot
disagree with the directory without the disagreement being an error somebody sees.

Each of the fifty-two frames pins its own colour scheme, written into the framed document once it
loads, because a scheme cannot be forced on a frame from outside it. Without the pin a pair is two
copies of whatever the reader's system happens to be set to, which is not a comparison.

### In Scope
- The generator, the generated page, and the corpus rule enforcing that they agree.

### Out of Scope
- The deliveries under `assets/examples/`, which are built from templates already shown.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/scripts/build-gallery.cjs` | Create | Reads the directory, writes the page, and checks the page against the directory |
| `.opencode/skills/sk-doc/sk-create-chart/assets/gallery.html` | Create | Generated: every form, twice |
| `.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` | Modify | The `gallery` rule, and an exemption so the page is not checked as though it were a chart |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | The gallery is generated from the templates directory, not hand-listed. |
| REQ-002 | Every form appears twice, once per colour scheme, with each frame pinned. |
| REQ-003 | A form missing from the gallery is an error, and so is a gallery that has fallen behind the directory. Both watched failing before the rule is trusted. |
| REQ-004 | The page is self-contained: no framework, no CDN, no build step for the charts it frames. |
| REQ-005 | The gallery is not judged by the chart rules. It carries no data block and no colour system because it is a contact sheet, and asking it for either is a category error. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The gallery carries all 26 forms in 52 frames.
- **SC-002**: `build-gallery.cjs --check` passes against the written page.
- **SC-003**: Dropping a form from the page fails the corpus, naming that form.
- **SC-004**: Adding a form to the corpus without rebuilding fails, naming the count and the form.
- **SC-005**: The corpus gate prints `RESULT: PASSED` with the gallery present.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The gallery drifts from the corpus | High: a stale contact sheet is worse than none, because it looks authoritative | Generated, and the rule fails on both a missing form and a count mismatch |
| Risk | The chart rules are applied to a page that is not a chart | Medium: this happened, producing 24 failures demanding a data block from a contact sheet | The page is exempted by path and held to its own rule instead |
| Risk | Frames show one scheme twice | Medium: the comparison silently becomes a duplicate | Each frame pins its scheme into the framed document on load, with the reader's own scheme as the degraded fallback |
| Dependency | Children 002 and 003 | The gallery shows whatever the corpus contains at build time | Both complete; the page was generated after them and covers 26 forms |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: [Response time target - e.g., <200ms p95]
- **NFR-P02**: [Throughput target - e.g., 100 req/sec]

### Security
- **NFR-S01**: [Auth requirement - e.g., JWT tokens required]
- **NFR-S02**: [Data protection - e.g., TLS + encrypted at rest]

### Reliability
- **NFR-R01**: [Uptime target - e.g., 99.9%]
- **NFR-R02**: [Error rate - e.g., <1%]
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: [How system handles]
- Maximum length: [Limit and behavior]
- Invalid format: [Validation response]

### Error Scenarios
- External service failure: [Fallback behavior]
- Network timeout: [Retry strategy]
- Concurrent access: [Conflict resolution]

### State Transitions
- Partial completion: [Recovery behavior]
- Session expiry: [User experience]
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | [/25] | [Files, LOC, systems] |
| Risk | [/25] | [Auth, API, breaking changes] |
| Research | [/20] | [Investigation needs] |
| **Total** | **[/70]** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- [Question 1 requiring clarification]
- [Question 2 requiring clarification]
<!-- /ANCHOR:questions -->

---



<!-- SCAFFOLD_VALIDATION_COUNTS:
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
REQUIREMENT_PLACEHOLDER
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
