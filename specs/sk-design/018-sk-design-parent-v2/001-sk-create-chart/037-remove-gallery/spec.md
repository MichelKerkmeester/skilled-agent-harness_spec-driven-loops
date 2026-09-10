---
title: "Feature Specification: remove the gallery and re-render every capture"
description: "The operator asked for the gallery to go. It went, with the height poster, two checker families and three cases that existed only for it, and every capture was rebuilt from the final sources."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: remove the gallery and re-render every capture

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-10 |
| **Branch** | `scaffold/037-remove-gallery` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The gallery framed the corpus twice over and needed a height handshake in every template to show
it whole. The operator asked for it to go. The captures under `screenshots/` already show every
form, and the old ones predated the last two rounds of template changes.

### Purpose
Remove the gallery and everything that existed only to serve it, and rebuild every capture.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete `assets/gallery.html` and `scripts/build-gallery.cjs`.
- Remove the height poster from every template; keep the `?scheme=` reader the renderer needs.
- Remove the `gallery` and `frame-height` families, their cases, and the renderer's exclusion.
- Rewrite the sentences that described the gallery as the scheme carrier.
- Rebuild the capture set from empty.

### Out of Scope
- The contract's principle that a gallery is a workbench and never a deliverable. Still true, and
  now with nothing to tempt anyone.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `assets/gallery.html`, `scripts/build-gallery.cjs` | Delete | The gallery |
| `assets/templates/*.html` (29) | Modify | Height poster removed |
| `scripts/check-corpus.cjs`, `scripts/tests/corpus-mutations.test.cjs`, `../shared/scripts/render-screenshots.cjs` | Modify | Two families, three cases and one exclusion removed |
| `SKILL.md`, `README.md`, `scripts/README.md`, `references/*.md`, `changelog/v2.5.0.0.md` | Modify / Create | No sentence names the gallery as current |
| `screenshots/**` | Regenerate | 32 captures from the final sources |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No file, family, test or current-fact sentence in the packet refers to the gallery |
| REQ-002 | Every capture is rendered from the final template sources |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -i gallery` over scripts, tests and references returns only the contract's principle sentences.
- **SC-002**: Corpus PASSED, suite green, 32 captures rendered from an emptied directory and all covered.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [System/API] | [What if blocked] | [Fallback plan] |
| Risk | [Risk description] | [High/Med/Low] | [Mitigation strategy] |
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


