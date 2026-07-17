---
title: "Feature Specification: INSTALL-GUIDE canonical filename normalization (sk-doc 021)"
description: "Normalize every skill install-guide document filename to the single canonical form INSTALL-GUIDE.md (uppercase + hyphen), resolving three inconsistent casings (INSTALL_GUIDE, install-guide, install_guide). The doc-type identifier install_guide is a code contract and stays; the classifier gains additive hyphen-stem recognition so renamed files still type as install_guide rather than silently downgrading to readme."
trigger_phrases:
  - "install-guide canonical naming"
  - "INSTALL-GUIDE filename normalization"
  - "install guide uppercase hyphen"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc"
_memory:
  continuity:
    packet_pointer: "sk-doc/021-install-guide-canonical-naming"
    last_updated_at: "2026-07-17T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the INSTALL-GUIDE canonical-naming spec and classifier-coupling plan"
    next_safe_action: "Add hyphen-stem recognition to the classifier, then rename the 14 files"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/skills/system-spec-kit/scripts/check-markdown-links.cjs"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Canonical form is INSTALL-GUIDE.md (uppercase like README/CHANGELOG, hyphen per the naming program)."
      - "The doc-type id install_guide (classifier return, enum choices, adapter list, template_rules key, tests) is a code contract and is preserved."
      - "Prose mentions of the install-guide concept and the JSON install_guide key are out of scope (files + filename refs only)."
---

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: INSTALL-GUIDE canonical filename normalization

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/021-install-guide-canonical-naming |
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-17 |
| **Owner skill** | sk-doc |
| **Origin** | Operator directive: install-guide docs should be written as INSTALL-GUIDE everywhere |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The skill install-guide document exists under three inconsistent filesystem casings: `INSTALL_GUIDE.md` (upper snake, ~9),
`install-guide.md` (lower kebab, 3), and `install_guide.md` (lower snake, 2). The canonical form is `INSTALL-GUIDE.md` —
uppercase like `README.md`/`CHANGELOG.md`, and hyphenated per the repo naming program.

This is not a pure rename. The sk-doc document classifier (`validate_document.py`) types a file as the `install_guide`
document type when the lowercased filename stem contains `install_guide` (underscore). After renaming to `INSTALL-GUIDE.md`,
the stem becomes `install-guide` (hyphen), which the classifier would not match — silently downgrading the renamed files to
`readme`. So the rename requires an additive classifier change that recognizes the hyphen stem, while the internal doc-type
identifier `install_guide` (used by the classifier return, the `--type` choices, the deep-alignment adapter list,
`template_rules.json`, and validator tests) is preserved as a code contract.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename the 14 install-guide document files under `.opencode/skills/**` to `INSTALL-GUIDE.md`.
- Add hyphen-stem recognition to the `validate_document.py` classifier so `install-guide` stems still type as `install_guide`.
- Update `.md`-suffixed filename references (`INSTALL_GUIDE.md`, `install-guide.md`, `install_guide.md` → `INSTALL-GUIDE.md`), including the `check-markdown-links.cjs` known-link allowlist and doctor.sh/install.sh setup pointers.

### Out of Scope
- The doc-type identifier `install_guide` (classifier return value, `--type` choices, adapter doc-type list, `template_rules.json` key, validator tests) — preserved as a code contract.
- Prose mentions of the "install-guide" concept (workflow/format/standard) and the JSON `install_guide` data key.
- The `.worktrees/*` copies (separate branches).
- Broadening the naming program's exemption set beyond this document name.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every skill install-guide file uses the canonical `INSTALL-GUIDE.md` name | No `INSTALL_GUIDE.md`, `install-guide.md`, or `install_guide.md` file remains under `.opencode/skills/**` |
| REQ-002 | Renamed files still classify as the `install_guide` document type | The classifier returns `install_guide` for an `INSTALL-GUIDE.md` path; the validator test suite passes |
| REQ-003 | The doc-type identifier contract is unchanged | `install_guide` remains the type id in the classifier, `--type` choices, adapter list, `template_rules.json`, and tests |
| REQ-004 | Filename references resolve to the new name | No `.md`-suffixed reference to an old install-guide filename remains; the markdown link-check passes |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 14 files renamed to `INSTALL-GUIDE.md`; zero old-casing files remain; git records renames (history preserved).
- **SC-002**: An `INSTALL-GUIDE.md` fixture classifies as `install_guide`; validator tests and markdown link-check are green.
- **SC-003**: The `install_guide` doc-type id and the JSON key are untouched; prose concept mentions are untouched.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Impact | Mitigation |
|------|--------|------------|
| Renamed files silently downgrade to `readme` | Wrong validation rules applied to install guides | Additive hyphen-stem recognition in the classifier before/with the rename; classify a renamed fixture to prove it |
| A bare-name replace corrupts the `install_guide` doc-type id or JSON key | Broken classifier taxonomy / config | Replace only `.md`-suffixed filename references; never bare `install_guide`/`INSTALL_GUIDE` |
| Case-only rename on case-insensitive macOS filesystem | `install-guide.md` → `INSTALL-GUIDE.md` may no-op | Two-step `git mv` through a temporary name for the 3 case-only files |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Prose-concept normalization was explicitly deferred (files + filename references only). The canonical uppercase
convention could later be recorded in the hyphen-naming program's decision record.
<!-- /ANCHOR:questions -->
