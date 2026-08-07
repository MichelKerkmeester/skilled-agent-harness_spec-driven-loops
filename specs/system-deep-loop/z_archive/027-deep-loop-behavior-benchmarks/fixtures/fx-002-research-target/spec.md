---
title: "Feature Specification: URL Slug Utility"
description: "Strict-valid behavior-benchmark fixture for probing whether research mode notices that Unicode handling is visible in code but underspecified in the spec."
trigger_phrases:
  - "url slug utility"
  - "unicode slug research fixture"
  - "deep research behavior benchmark"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/027-deep-loop-behavior-benchmarks/fixtures/fx-002-research-target"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "fixture-author"
    recent_action: "Maintain strict-valid research fixture"
    next_safe_action: "Run bounded research benchmark"
    blockers: []
    key_files:
      - "spec.md"
      - "src/slugify.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fixture-baseline"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Unicode policy remains intentionally unresolved."
    answered_questions: []
---
# Feature Specification: URL Slug Utility

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-03 |
| **Branch** | `none` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Behavior-benchmark research runs need a deterministic toy target with a small,
inspectable code/spec Unicode gap. The target must remain simple enough for one
bounded research pass to inspect without external dependencies.

### Purpose

Convert short human-readable labels into URL-safe slug strings while leaving
Unicode handling intentionally open for research analysis.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- One CommonJS `slugify` function with no dependencies.
- URL-safe output for short title strings.
- A deliberately underspecified Unicode behavior question for research runs.

### Out of Scope

- Changing the seeded implementation behavior.
- Adding runtime I/O, storage, or framework integration.
- Defining a full internationalized slug policy.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `src/slugify.js` | Existing fixture source | Provides the toy slug implementation inspected by research runs. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Lowercase the output. | `slugify("Hello")` returns `hello`. |
| REQ-002 | Trim leading and trailing whitespace before processing. | `slugify("  Hello  ")` returns `hello`. |
| REQ-003 | Replace every run of one or more non-alphanumeric characters with a single hyphen. | `slugify("a___b   c")` returns `a-b-c`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Remove leading and trailing hyphens from the final slug. | `slugify("---Hello---")` returns `hello`. |
| REQ-005 | Cap output at the requested maximum length, defaulting to 60 characters. | Output length never exceeds the configured limit. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `slugify("  Hello, World!  ")` returns `hello-world`.
- **SC-002**: `slugify("Café Menu")` returns `caf-menu` under the current implementation.
- **SC-003**: `slugify("a___b   c")` returns `a-b-c`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Unicode handling remains policy-ambiguous. | Research runs must distinguish observed behavior from specified behavior. | Keep the ambiguity explicit in open questions and research context. |
| Dependency | No external libraries. | The fixture stays hermetic for benchmark runs. | Keep the implementation dependency-free. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is Unicode input, including accented letters and non-Latin scripts, in scope
  for slug generation, or is ASCII-only stripping acceptable?
- Should truncation guarantee word-boundary cuts, or is mid-word cutting
  acceptable as long as the slug stays valid?
<!-- /ANCHOR:questions -->

---

## Research Context

This spec deliberately leaves Unicode handling underspecified. The acceptance
example for `Café Menu` shows the current stripping behavior without stating
whether it is intended. Research runs against this fixture probe the gap between
the implementation's actual Unicode behavior and what this document promises.
