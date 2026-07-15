---
title: "Feature Specification: create-diff fidelity, safety, and accessibility hardening"
description: "Remediate defects surfaced by an adversarial GPT-5.6 review of the create-diff engine and report renderer: strict text decoding (stop erasing byte-level differences), a correct empty/EOF-newline line model, a real HTML safety-gate validator, and the legend-contrast and side-by-side-scroll accessibility fixes."
trigger_phrases:
  - "create-diff hardening"
  - "diff report contrast fix"
  - "diff engine strict decode"
  - "validate report safety gate"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-create-diff-mode/008-fidelity-safety-a11y-hardening"
    last_updated_at: "2026-07-15T18:46:00Z"
    last_updated_by: "claude"
    recent_action: "Completed P1 code-opencode alignment; added scripts/README; wired 009 successor"
    next_safe_action: "Commit the alignment + command work and push to v4"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-diff-hardening-008"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Scope is redesign-defect fixes PLUS engine hardening (operator-selected)."
      - "The remediation is recorded as its own child under 999-create-diff-mode, cross-linked to 006."
---
# Feature Specification: create-diff fidelity, safety, and accessibility hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../007-optional-ocr-adapter/spec.md` |
| **Successor** | `../009-create-diff-command/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An adversarial review (GPT-5.6 SOL, ultra) of the `create-diff` engine and its redesigned HTML report, independently re-verified against the source, found real defects in three areas: (1) the engine decodes text with `errors="replace"` and only sniffs a NUL byte for binary, so two files differing only in invalid bytes both become `�` and are reported identical at "full fidelity" — silent difference-erasure; (2) the diff line model splits on `"\n"`, so empty files and trailing-newline-only differences produce phantom or mislabelled lines; (3) `validate_report.py` regex-matches tags and only checks that a CSP tag *exists*, so a hostile payload with a live handler, remote resources, `@import`, and a permissive CSP passes. The redesign itself also shipped two defects that contradicted its own claims: the legend inline-swatch text fails WCAG AA in three theme pairs, and the "scoped horizontal scroll" for side-by-side wraps instead of scrolling and is not keyboard-reachable.

### Purpose
Make the create-diff engine honest about what it can compare, make the safety validator actually gate safety, and make the redesigned report meet the accessibility contract it claims — each fix locked by a checked-in regression test.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Strict text decoding: undecodable input is refused (exit 3) or handled explicitly, never silently normalized to `�`; unknown-extension text fallback emits the promised warning.
- Correct logical-line model: empty text maps to no lines; a trailing-newline-only difference is treated as insignificant (consistent with the trailing-whitespace normalization already applied) rather than producing a spurious blank line.
- `validate_report.py` rewritten to an `html.parser` **allowlist** of the renderer's exact HTML dialect: only the emitter's known tags and attributes are permitted (any other fails), the exact normalized CSP directive set is asserted (rejecting non-ASCII directive smuggling and a mis-placed or duplicated CSP), every URL-bearing attribute must be a local `#` fragment, and `@import` and non-`data:` `url()` are rejected.
- Legend contrast fix (`.legend mark.wd{color:var(--text)}`) verified in both themes.
- Side-by-side scroll fix: a table `min-width` so the scoped region actually scrolls, plus `role`/`aria-label`/`tabindex`/`:focus-visible` so it is keyboard-operable.
- A checked-in renderer/engine regression suite covering the above plus the already-passing invariants (zero-JS, exact CSP, escaping, byte-reproducibility, pairing, collapse accounting).
- Doc accuracy: correct the `006` implementation-summary warnings count and the "relative units throughout" wording; align the accessibility contract.

### Out of Scope
- New diff formats, OCR, or the `/create:diff` command — unrelated to the review findings.
- Re-architecting the snapshot/state store — not implicated.
- The `@@` header becoming a machine-applicable patch header — it is a documented human scan anchor by design; only the empty-file artifact is corrected.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py` | Modify | Strict decode; logical-line + EOF-newline model; legend-contrast CSS; side-by-side scroll min-width + a11y attrs. |
| `.opencode/skills/sk-doc/create-diff/scripts/validate_report.py` | Modify | Rewrite to an HTMLParser-based real safety gate. |
| `.opencode/skills/sk-doc/create-diff/scripts/test_create_diff.py` | Create | Regression suite locking the fixes and invariants. |
| `.opencode/skills/sk-doc/create-diff/references/capabilities-and-fidelity.md` | Modify | State strict-decode + unknown-extension warning behavior. |
| `.opencode/skills/sk-doc/create-diff/references/accessibility-contract.md` | Modify | Align relative-units wording; note the keyboard-operable scoped scroll. |
| `.opencode/specs/sk-doc/999-create-diff-mode/006-opencode-skill-and-accessibility/implementation-summary.md` | Modify | Correct warnings count + WCAG note; cross-link 008. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Strict decode; no silent difference-erasure | Two files differing only in invalid UTF-8 bytes are NOT reported identical; undecodable full-tier input exits 3 with an encoding message. Test asserts it. |
| REQ-002 | Legend swatch text meets WCAG AA both themes | `contrast_check.py` passes for every legend `mark.wd` pair in light and dark; test asserts the token pairs. |
| REQ-003 | `validate_report.py` is a real safety gate | An allowlist of the emitter's exact dialect: every hostile hazard class (live handler, remote/`data:`/`javascript:` reference, disallowed element/attribute, `@import`, `url()`, refresh/unknown `http-equiv`, duplicate attribute, non-ASCII/mis-placed/duplicate/weakened/missing CSP) FAILS one-per-test; the four canonical reports still PASS. Test asserts both. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Correct empty/EOF-newline line model | Empty→content = pure addition (no phantom unchanged line); empty→empty = no differences; a trailing-newline-only change is treated as insignificant (consistent with the trailing-whitespace normalization already applied), never a spurious blank-line add. Interior blank lines are preserved. Test asserts row kinds. |
| REQ-005 | Side-by-side scoped scroll actually scrolls + is keyboard-operable | The `.sxs` table has a `min-width`; the scroll wrapper carries `role="region"`, `aria-label`, `tabindex="0"`, and a visible focus style. |
| REQ-006 | Regression suite is checked in and green | `test_create_diff.py` runs offline with the stdlib and passes; covers REQ-001..005 plus zero-JS/CSP/escaping/byte-reproducibility/pairing/collapse. |
| REQ-007 | Docs are accurate | `006` warnings count corrected (8, not 2); "relative units throughout" reworded; accessibility contract aligned. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every reconciled P0/P1 finding has a fix and a failing-before/passing-after regression test.
- **SC-002**: The four canonical demo reports regenerate, still validate, and stay byte-reproducible after the changes.
- **SC-003**: `validate.sh --recursive --strict` on the 999 parent stays 0 errors / 0 warnings; canon gates (package_skill, parent-skill-check, comment-hygiene) stay clean.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Strict decode changes exit behavior for previously-accepted odd inputs | Med | Refuse only truly-undecodable full-tier input; keep the report path working for valid UTF-8; lock with tests. |
| Risk | `min-width` forces horizontal scroll on moderate viewports | Low | Choose a min-width that keeps code columns readable; unified view unaffected; documented in the contract. |
| Risk | Validator rewrite over-rejects legitimate reports | Med | Assert the four real reports still PASS in the suite; parse with the same escaping contract the renderer emits. |
| Dependency | `contrast_check.py` (sk-design) | Low | Read-only helper, already present. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Report generation stays O(lines); no measurable regression on the demo docs.

### Security
- **NFR-S01**: The report contract (zero-JS, exact CSP, no remote refs, escaped content) is preserved and now enforced by the validator, not merely asserted.
- **NFR-S02**: No new network, filesystem-write, or shell surface introduced; processing stays local.

### Reliability
- **NFR-R01**: The engine never silently reports differing inputs as identical.
- **NFR-R02**: Output stays byte-identical under a fixed `SOURCE_DATE_EPOCH`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: maps to zero logical lines; empty→empty is "no differences," empty→content is a pure addition.
- Trailing newline: tracked separately; a newline-only change is a distinct marker, not a blank-line add.
- Invalid bytes: undecodable full-tier input is refused (exit 3), not normalized to `�`.
- Long unbroken filename / >99,999 lines: header and gutter must not force document-level horizontal scroll (bounded follow-up if not fully closed here).

### Error Scenarios
- Hostile report content: live handlers, remote `src`, `@import`, permissive CSP — all must FAIL the validator.
- Unknown text-like extension: accepted with an explicit fidelity warning.

### State Transitions
- Partial completion: fixes are independent; each is landed with its own test so a partial run is still coherent.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 2 engine files + new test suite + 3 docs; ~400-600 LOC. |
| Risk | 18/25 | Security-gate rewrite + engine-behavior change (decode, line model); mitigated by tests. |
| Research | 6/20 | Findings already analyzed and independently verified. |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether to fully close the long-filename / 6-digit-line-number overflow edges here or track them as a bounded follow-up.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Origin**: reconciled findings from the GPT-5.6 SOL ultra review of the `006` redesign.
- **Sibling**: `../006-opencode-skill-and-accessibility/` (the build + redesign this remediates).
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
