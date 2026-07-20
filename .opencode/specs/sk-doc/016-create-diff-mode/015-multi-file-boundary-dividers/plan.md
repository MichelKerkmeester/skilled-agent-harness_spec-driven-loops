---
title: "Implementation Plan: Multi-file boundary dividers for create-diff"
description: "Add validated aggregate-file boundaries to the diff row model and render them as accessible full-width bands in both HTML views."
trigger_phrases:
  - "multi file boundary plan"
  - "create diff file divider implementation"
  - "aggregate diff report plan"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-create-diff-mode/015-multi-file-boundary-dividers"
    last_updated_at: "2026-07-20T12:17:52Z"
    last_updated_by: "opencode"
    recent_action: "Masked frame edges across inter-file whitespace"
    next_safe_action: "No phase-local work remains"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-diff-multi-file-boundaries"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Multi-file boundary dividers for create-diff

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3, generated semantic HTML, embedded CSS |
| **Framework** | Standard library only (`dataclasses`, `difflib`, `re`, `html`) |
| **Storage** | None changed |
| **Testing** | Python `unittest`, report allowlist validator, spec/package/document checks |

### Overview
Validate exact aggregate bundle markers before diffing, annotate recognized rows with file-boundary metadata, and preserve those rows through context collapsing. Both renderers will emit full-width semantic bands using the existing report dialect, while malformed envelopes continue through the ordinary single-document path unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The generated report reproduction confirms start markers are collapsed and end markers are inconsistent. [EVIDENCE: `sk-git-docs.diff.html` contained no visible `BEGIN FILE` marker and only selected `END FILE` context rows.]
- [x] The owning model and renderer functions are identified. [EVIDENCE: `Row`, `diff_lines`, `_hunks`, `_render_unified`, and `_render_side_by_side` in `create_diff.py`.]
- [x] The HTML allowlist supports the intended semantic bands without expansion. [EVIDENCE: existing `tbody`, `tr`, `th`, `span`, `class`, `scope`, and `colspan` are allowed by `validate_report.py`.]

### Definition of Done
- [x] Valid aggregate envelopes produce persistent start/end bands in both views.
- [x] Invalid and incidental marker text remains ordinary diff content.
- [x] Paths are escaped, sections reset, CSP is unchanged, and generated reports validate.
- [x] Full tests and package/spec/document gates pass with evidence in `checklist.md` and `implementation-summary.md`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Validated annotation inside the existing linear diff pipeline: preflight envelope validation -> row metadata -> collapse-aware segmentation -> view-specific semantic rendering.

### Key Components
- **Boundary grammar**: exact anchored regular expressions for `BEGIN FILE` and `END FILE` lines.
- **Envelope validator**: accepts only ordered, non-nested, path-matched pairs and requires at least two files.
- **Row metadata**: `boundary` (`start` or `end`) and `file_path`, separate from Markdown `sec` metadata.
- **Collapse preservation**: recognized boundaries are always emitted, with ordinary long context collapsed around them.
- **Renderer bands**: shared helper emits existing-dialect table markup with view-specific column spans.
- **Inter-file gap**: a shared accessibility-inert row group adds `--sp-8` canvas whitespace before every file after the first and masks the frame edges across the gap.

### Data Flow
`_compare_and_report` validates the normalized pair, passes the active grammar into `diff_lines`, and receives rows whose recognized transitions cannot be collapsed. `_hunks` splits boundary rows from ordinary hunks. Unified and side-by-side renderers then emit one semantic row group per boundary.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `diff_lines` and `Row` | Produces context/change rows and section metadata | Add validated boundary metadata and collapse preservation | Unit fixtures for long context and section reset |
| `_hunks` | Segments ordinary hunks and gaps | Split boundary rows into explicit segments | Renderer assertions on segment order |
| `_render_unified` | Four-column report table | Render 4-column boundary bands | HTML and validator assertions |
| `_render_side_by_side` | Six-column report table | Render 6-column boundary bands | HTML and validator assertions |
| `_CSS` | Existing token-based visual hierarchy | Add start/end styles using existing tokens | Literal checks and visual fixture review |
| Skill docs and catalog | Describe live behavior | Document pre-composed aggregate pairs and release version | Document validators and package check |
| `.opencode/commands/` | Routes one document or explicit pair | No change | Scoped `git status` confirms untouched |

Required inventories:
- Same-class producers: only `diff_lines` creates `Row` instances and only the two table renderers consume hunk segments.
- Consumer inventory: `_hunks`, `_render_unified`, `_render_side_by_side`, report tests, accessibility docs, and feature catalog.
- Matrix axes: view (2) x envelope (valid/invalid) x context (short/collapsed) x path (plain/hostile) x section state (present/absent).
- Algorithm invariant: boundary mode is all-or-nothing per normalized pair; invalid structure cannot produce partial file chrome.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold phase 015 and document the exact grammar, scope, risks, and verification matrix.
- [x] Confirm the validator dialect and existing report hierarchy.

### Phase 2: Implementation
- [x] Add envelope validation and row boundary metadata.
- [x] Preserve boundaries across collapsed context and reset section state.
- [x] Add shared boundary-band markup and existing-token CSS for both views.
- [x] Update versioned skill documentation and changelog.

### Phase 3: Verification
- [x] Add matrix-driven unit and CLI/report regressions.
- [x] Generate and validate representative unified and side-by-side aggregate reports.
- [x] Run package, document, alignment, diff, and strict child-spec checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Envelope validation, collapse preservation, section reset, false-positive fallback | `python3 scripts/test_create_diff.py` |
| Renderer | Start/end band count, labels, column spans, one gap per later file, first-file alignment, both views | `unittest` HTML assertions |
| Security | Hostile path escaping and inert output | `validate_report.py` and allowlist tests |
| Regression | Existing counts, single documents, CSP, reproducibility, responsive layout | Full create-diff suite |
| Manual | Scan order at wide and narrow report widths | Generated representative reports |
| Spec/package | Templates, metadata, docs, package shape | `validate.sh`, document validator, package check |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Current create-diff renderer and tests | Internal | Green | No implementation baseline |
| Report safety validator | Internal | Green | Cannot deliver generated HTML |
| System-spec-kit child validation | Internal | Partially degraded | Child checks can run; parent-recursive checks may reflect unrelated deleted phase files |
| Existing report design tokens | Internal | Green | Boundary styling would need a new visual system, which is out of scope |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any single-document regression, false boundary activation, validator failure, incorrect section label, or unreadable transition in either report view.
- **Procedure**: Revert the boundary regex/validator, `Row` fields, collapse segmentation, renderer helper/CSS, tests, and versioned docs as one feature unit. No data or snapshot migration is involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Envelope validation -> row annotation/collapse -> both renderers -> docs and full verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Existing renderer evidence | Implementation |
| Implementation | Frozen grammar and fallback invariant | Verification |
| Verification | Both renderers and docs complete | Phase closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and spec | Low | 0.5 hour |
| Parser/model/render implementation | Medium | 1.5-2 hours |
| Tests, docs, and verification | Medium | 1-1.5 hours |
| **Total** | | **3-4 hours** |
<!-- /ANCHOR:effort -->
