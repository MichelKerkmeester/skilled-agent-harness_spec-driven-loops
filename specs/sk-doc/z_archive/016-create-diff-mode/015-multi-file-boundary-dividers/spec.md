---
title: "Feature Specification: Multi-file boundary dividers for create-diff"
description: "Make aggregate create-diff reports clearly identify where every file begins and ends, even when surrounding context is collapsed."
trigger_phrases:
  - "create diff multi file divider"
  - "diff report file boundary"
  - "begin file end file band"
  - "aggregate document diff"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-create-diff-mode/015-multi-file-boundary-dividers"
    last_updated_at: "2026-07-20T12:17:52Z"
    last_updated_by: "opencode"
    recent_action: "Removed side dividers from inter-file whitespace"
    next_safe_action: "No phase-local work remains"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - ".opencode/skills/sk-doc/create-diff/scripts/create_diff.py"
      - ".opencode/skills/sk-doc/create-diff/scripts/test_create_diff.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-diff-multi-file-boundaries"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use a new phase because phase 010 is complete and excludes report structure changes."
      - "Do not modify command files; support pre-composed aggregate pairs in the skill engine."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Multi-file boundary dividers for create-diff

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 15 |
| **Predecessor** | `../010-fluid-responsive-report/spec.md` |
| **Successor** | None |
| **Handoff Criteria** | Both views render validated file-start and file-end bands without safety, accessibility, or diff regressions |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase extends the shipped report renderer. The earlier responsive-report phase improved page hierarchy but deliberately excluded report-structure changes. Aggregate reports now expose a separate navigation problem: their synthetic file delimiters are ordinary context lines, so file starts can disappear inside collapsed runs and file ends appear inconsistently.

**Scope Boundary**: Add semantic rendering for validated aggregate bundle delimiters inside the create-diff skill. Native multi-file CLI arguments and all `.opencode/commands/` files remain out of scope.

**Dependencies**:
- The current `Row`, `diff_lines`, `_hunks`, `_render_unified`, and `_render_side_by_side` pipeline.
- The existing HTML allowlist, CSP, token palette, and accessibility contract.

**Deliverables**:
- Balanced delimiter detection with a plain-text fallback for invalid envelopes.
- Persistent start/end boundary rows in unified and side-by-side output.
- Automated and manual evidence for visibility, escaping, and regression safety.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When multiple files are combined into one explicit before/after pair, lines such as `===== BEGIN FILE: path =====` and `===== END FILE: path =====` are diffed as ordinary document text. Long-context collapsing can remove every start marker, while some end markers remain visible as low-emphasis context rows. The report therefore gives no reliable visual or semantic indication that the reviewer moved from one file to another.

### Purpose
Turn a validated aggregate delimiter envelope into explicit, high-contrast file-start and file-end bands that remain visible in every report view and preserve the existing safety and accessibility guarantees.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Recognize exact `BEGIN FILE` and `END FILE` delimiter lines only when they form a balanced multi-file envelope.
- Carry boundary kind and escaped file path through the diff row model.
- Keep every recognized boundary visible across collapsed context and reset Markdown section context at each file transition.
- Render full-width semantic boundary bands in unified and side-by-side reports using existing HTML and CSS tokens.
- Document the aggregate-pair contract and release it as create-diff `1.1.1.0`.

### Out of Scope
- Native repeated `--before`/`--after` CLI arguments or directory comparison.
- Changes to `.opencode/commands/`, command presentation assets, or workflow YAML.
- Changes to diff statistics, move detection, snapshot storage, extraction fidelity, CSP, or the report validator allowlist.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/create-diff/scripts/create_diff.py` | Modify | Detect, retain, and render semantic file boundaries |
| `.opencode/skills/sk-doc/create-diff/scripts/test_create_diff.py` | Modify | Add boundary behavior and safety regressions |
| `.opencode/skills/sk-doc/create-diff/SKILL.md` | Modify | Document aggregate-pair behavior and bump version |
| `.opencode/skills/sk-doc/create-diff/README.md` | Modify | Surface the boundary capability |
| `.opencode/skills/sk-doc/create-diff/references/workflow.md` | Modify | Define the canonical aggregate envelope |
| `.opencode/skills/sk-doc/create-diff/references/accessibility-contract.md` | Modify | Define boundary semantics and visible hierarchy |
| `.opencode/skills/sk-doc/create-diff/feature-catalog/feature-catalog.md` | Modify | Record the live capability |
| `.opencode/skills/sk-doc/create-diff/feature-catalog/comparison-engine/self-contained-report.md` | Modify | Add implementation and validation detail |
| `.opencode/skills/sk-doc/create-diff/changelog/v1.1.1.0.md` | Create | Record the release |
| `../spec.md` | Modify | Register phase 015 in the parent map |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Recognized file boundaries never collapse | Every valid start and end marker appears as a visible full-width band in unified and side-by-side reports, including markers inside long unchanged runs. |
| REQ-002 | Recognition is structural, not a loose text match | Boundary mode activates only for balanced, ordered, matching start/end markers representing at least two files; invalid or incidental marker-like text renders normally. |
| REQ-003 | Report safety and accessibility remain intact | Paths are escaped, bands use visible text plus non-color structure, table semantics remain valid, CSP is unchanged, and `validate_report.py` passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | File transitions have a deliberate hierarchy | Start bands are the strongest transition, end bands explicitly close the file, every later file starts after a 32px canvas gap with no side dividers, and ordinary hunks remain visually subordinate to the file label. |
| REQ-005 | Document sections do not leak across files | Markdown section context resets at file boundaries, so a hunk in the next file cannot inherit the previous file's heading. |
| REQ-006 | Existing behavior stays stable outside aggregate mode | Single-document reports, counts, line numbers, move detection, both views, normalization, and byte reproducibility remain covered by the full suite. |
| REQ-007 | The package contract reflects current behavior | Versioned skill docs, accessibility guidance, feature inventory, and changelog describe pre-composed aggregate pairs without claiming native multi-file CLI support. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A two-or-more-file fixture renders one `START FILE` and one `END FILE` band per file in both views, even across collapsed context.
- **SC-002**: Malformed envelopes and ordinary documents containing a delimiter-like line do not receive boundary chrome.
- **SC-003**: Hostile path text is escaped and the generated reports pass the safety validator.
- **SC-004**: The full create-diff regression suite, package validation, document validation, alignment check, and child strict spec validation pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Ordinary source text resembles a delimiter | False file chrome would misrepresent content | Require a balanced, ordered envelope with at least two matched files; otherwise fall back to ordinary rows |
| Risk | Boundary rows disappear during collapse | The original usability defect remains | Preserve recognized boundaries before applying ordinary collapsed-context rules |
| Risk | New markup expands the report attack surface | Validator failure or unsafe output | Reuse existing allowed tags and attributes; keep CSP and validator allowlist unchanged |
| Risk | Section labels leak between files | Hunk headers name the wrong document section | Reset section state on both file-start and file-end transitions and lock it with tests |
| Dependency | Existing report token system | Visual hierarchy must fit the shipped design | Reuse semantic surface, border, text, and focus tokens rather than adding arbitrary colors |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- Boundary validation and annotation remain linear in input lines and add no external dependency.

### Security
- File paths are treated as untrusted source text and HTML-escaped before rendering.
- No script, remote resource, inline event handler, or weakened CSP is introduced.

### Reliability
- Invalid envelopes fail closed to ordinary text rendering, never to partial boundary mode.
- Output remains deterministic under `SOURCE_DATE_EPOCH`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty file bodies still show their paired start and end bands.
- Long unchanged sections cannot hide file transitions.
- File paths may contain spaces, punctuation, or markup-like text and must remain inert.
- The first file has no leading spacer; each later file has exactly one accessibility-inert 32px gap with no side dividers before its start band.

### Error Scenarios
- Missing end marker, mismatched path, nested begin marker, duplicate open marker, or fewer than two files disables boundary mode for the whole pair.
- A marker added or removed as document content remains an ordinary diff row unless both inputs form valid aggregate envelopes.

### State Transitions
- File start and file end both clear the current Markdown section label.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One parser/model/render path, two views, tests, and versioned package docs |
| Risk | 15/25 | Generated HTML semantics, untrusted path text, collapse behavior, and accessibility are affected |
| Research | 5/20 | Root cause and renderer ownership are confirmed from current code and a generated report |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. The user requested explicit starts and ends, prohibited command-file changes, and approved implementation on the current branch.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Responsive report predecessor**: `../010-fluid-responsive-report/spec.md`
- **Implementation plan**: `plan.md`
- **Task breakdown**: `tasks.md`
- **Verification checklist**: `checklist.md`
