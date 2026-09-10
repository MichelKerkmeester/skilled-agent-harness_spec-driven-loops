---
title: "Feature Specification: one style reference, no examples, open tables, a gallery that sizes its frames"
description: "The packet carried two Style References and one had stopped being the stock; the worked deliveries were a second corpus to keep in step; twenty forms hid their values behind a click; and the gallery clipped most of its frames at a guessed height."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: one style reference, no examples, open tables, a gallery that sizes its frames

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-10 |
| **Branch** | `scaffold/036-evilcharts-only-and-open-tables` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The stock palette has been derived from evilcharts since v2.1.0.0 and `--default` has themed from
it since then, but the cursor copy was still carried, three references still called it the stock,
and the corner-ladder argument was still made from its numbers. Seven worked deliveries duplicated
forms the templates already show. Twenty forms started their data table closed. The gallery gave
every frame 560px and most forms ran past it.

### Purpose
One reference, one corpus, every table open, and a gallery whose frames take the height of what
they show.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove `assets/style-reference/cursor/` and every current-fact mention of it.
- Remove `assets/examples/` and its captures; rescope the families and tests that read it.
- Open every data table by default and hold it in `table-disclosure`.
- Frames that size to their chart: a height poster in every template, a listener in the gallery,
  `frame-height` holding the poster, three mutation cases.
- Changelog v2.4.0.0 and the version field.

### Out of Scope
- The gallery's `contentDocument` scheme pin. It is dead on file URLs in Chrome and harmless; the
  `?scheme=` query the templates read does the work.
- Changelog history that mentions cursor or the deliveries as they were at the time.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `assets/style-reference/cursor/`, `assets/examples/`, `screenshots/examples/` | Delete | One reference, one corpus |
| `assets/templates/*.html` (29) | Modify | `open` on the disclosure; a height poster beside the scheme reader |
| `assets/gallery.html`, `scripts/build-gallery.cjs` | Modify | Frames take the posted height |
| `scripts/check-corpus.cjs` | Modify | Templates-only scoping, `table-disclosure` always open, `frame-height`, gallery listener assertion |
| `scripts/tests/*.cjs` | Modify | Examples dropped from the package copy; applicator-built design-md fixture; three new cases; reference set read from disk |
| `SKILL.md`, `README.md`, `references/*.md`, `changelog/v2.4.0.0.md` | Modify / Create | The docs say what the palette source and applicator already did |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The packet carries exactly one Style Reference, and no document presents another as current |
| REQ-002 | No document, family or test reads `assets/examples/`, and the corpus check still holds a themed delivery's provenance |
| REQ-003 | Every template's data table starts open and the corpus check fails one that does not |
| REQ-004 | No gallery frame clips its form; both sides of the height handshake are held by a check |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `check-corpus.cjs` PASSED, suite green, `build-gallery.cjs --check` PASSED, captures covered.
- **SC-002**: A rendered gallery shows every visible tile whole, including the tables.
- **SC-003**: A reader who did not make the edits finds no stale cursor or examples claim in the six documents.
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


