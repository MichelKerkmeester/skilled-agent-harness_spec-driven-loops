---
title: "Implementation Plan: Bulk TOC Block Removal"
description: "Plan for the idempotent fence-aware transform that removes all TOC blocks from in-scope skill markdown."
trigger_phrases:
  - "bulk toc removal plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/117-skill-anchor-toc-removal/002-toc-removal"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Removed all TOC blocks from in-scope skill markdown"
    next_safe_action: "Proceed to phase 003"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Bulk TOC Block Removal

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 (stdlib only) |
| **Tool** | `strip_toc_anchors.py --toc` |
| **Scope list** | `rg --files .opencode/skills -g '*.md'` minus carve-outs |
| **Testing** | residual grep + `validate_document.py` + idempotency re-run |

### Overview
A single fence-aware transform removes the `## TABLE OF CONTENTS` heading and its link list
(plus a wrapping `ANCHOR:table-of-contents`). It stops at the first non-blank/non-bullet/
non-anchor line so body content and real headings survive. A TOC that sat between two `---` rules
leaves a redundant rule, collapsed by the `collapse_rules` step.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Script tested on temp copies; diff inspected
- [x] Carve-outs identified (system-spec-kit/templates, sk-doc/scripts/tests)

### Definition of Done
- [x] Zero `## TABLE OF CONTENTS` headings in scope (outside fences)
- [x] Idempotent (second run = 0 changes)
- [x] Changed READMEs pass `validate_document.py`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Line-stream transform with fenced-code-block state tracking.

### Key Components
- `strip_toc(lines)` — fence-aware TOC block excision + redundant bounding-rule drop.
- `collapse_rules(lines)` / `collapse_blanks(lines)` — frontmatter/fence-aware whitespace tidy.
- Gate: a file is rewritten ONLY when a removal occurred (no cosmetic-only churn).

### Data Flow
read file → strip_toc → collapse_rules → collapse_blanks → write iff changed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Build + prove
- [x] Author `strip_toc_anchors.py`; test on cli-gemini README, codex playbook, feature catalog, template
- [x] Confirm idempotency + validator pass on cleaned output

### Phase 2: Bulk run
- [x] Run `--toc` on in-scope list (362 files changed)
- [x] Collapse 96 double-HR artifacts with `--collapse-rules`

### Phase 3: Residual cleanup
- [x] Manually remove 2 fenced-example TOCs (skill_readme_template, benchmark_creation)
- [x] Update 4 obsolete playbook scenarios that asserted generated TOCs
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Residual | Zero TOC headings | `rg '^#+ .*TABLE OF CONTENTS'` |
| Structural | No body loss | `git diff` review + Devin sample sweep |
| Validation | READMEs valid | `validate_document.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 config flip | Internal | Green | Validator would re-flag cleaned READMEs |
| python3 | External | Green | Cannot run transform |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Body content found removed.
- **Procedure**: `git checkout -- <affected files>`; fix the transform; re-run.
<!-- /ANCHOR:rollback -->
