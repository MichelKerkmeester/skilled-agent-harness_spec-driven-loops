---
title: "Feature Specification: Fenced Code Block Structure Parity"
description: "Several sk-doc authoring templates had malformed 3-backtick nested fences whose inner bare fence prematurely closed the outer example, spilling the example's own headers into the document as real sections. This packet fixes the fence balance in the four affected templates."
trigger_phrases:
  - "fenced code block"
  - "fence awareness"
  - "swallowed sections"
  - "template fence fix"
  - "markdown structure parity"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-fenced-code-structure-parity"
    last_updated_at: "2026-07-17T13:56:23.385Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level 1 spec folder for the four template fence fixes"
    next_safe_action: "Run strict validation and refresh packet metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-readme/assets/install_guide_template.md"
      - ".opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_template.md"
      - ".opencode/skills/sk-doc/create-skill/assets/skill/skill_asset_template.md"
      - ".opencode/skills/sk-git/assets/pr-template.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-034-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Fenced Code Block Structure Parity

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
| **Created** | 2026-07-17 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Four sk-doc authoring templates each contain a fenced example that shows a copy-pasteable document skeleton. The examples were authored with 3-backtick outer fences that wrap nested 3-backtick code fences. Under CommonMark, the first bare inner ` ``` ` closes the outer fence early, so the remainder of the example — and, worse, the template's own later `## N.` sections — render outside the fence as real document structure. The structure validator and heading extractor then read example headers as real sections, and a reader copying the template sees sections that belong inside a code block leak out as live headings.

### Purpose
Restore correct fence balance in the four affected templates so each example is fully contained and every real `## N.` section is parsed as real, with the doc's own section numbering sequential again.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Widen or rebalance the malformed outer example fences in the four affected templates.
- Verify with a fence-aware structure scan that no real `## N.` section remains trapped in a fence and no fence is left unclosed.
- Confirm `validate_document.py` reports the four templates valid with zero numbering warnings.

### Out of Scope
- The `validate_document.py` non-sequential fence-awareness fix and the `extract_structure.py` parity fix — already shipped in prior commits on this branch; referenced here as related prior work, not re-implemented.
- Any content rewrite of the example bodies. Only fence delimiters change; the example text is untouched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-doc/create-readme/assets/install_guide_template.md | Modify | Widen six §7 error-example fences; wrap §13 COMPLETE TEMPLATE in one 4-backtick fence |
| .opencode/skills/sk-doc/create-skill/assets/parent_skill/parent_skill_hub_template.md | Modify | Widen the §5 COPY-PASTE HUB SCAFFOLD example fence (open + true close) to 4 backticks |
| .opencode/skills/sk-doc/create-skill/assets/skill/skill_asset_template.md | Modify | Widen the §4 STANDARD ASSET STRUCTURE example fence to 4 backticks |
| .opencode/skills/sk-git/assets/pr-template.md | Modify | Widen the §12 BREAKING CHANGES example fence to 4 backticks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every real `## N.` section in each template is parsed outside any fence | Fence-aware scan reports real top-level sections as a gap-free sequential run with none trapped in a fence |
| REQ-002 | No template is left with an unclosed fence | Fence-aware scan reports zero unclosed fences across all four files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Example headers stay literal inside their fences | Scaffold/example `## N.` headers remain in-fence; only the template's own sections are real |
| REQ-004 | Validator agrees the templates are clean | `validate_document.py` returns valid with zero errors and zero non-sequential numbering warnings for each file |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four templates pass the fence-aware structure scan (sequential real sections, zero swallowed real sections, zero unclosed fences).
- **SC-002**: `validate_document.py` reports each template valid with 0 errors, 0 warnings, 0 non-sequential numbering warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Widening the wrong fence pair could swallow a real section or misrepresent an example | Low | Assert-guarded line-targeted edits that abort on any content mismatch, followed by a fence-aware re-scan before commit |
| Risk | A concurrent session shares the working tree | Low | Pathspec-scoped edits and commits limited to the four templates and this spec folder |
| Dependency | CommonMark fence semantics (longer outer fence keeps shorter inner fences literal) | None if honored | Outer fences widened to 4 backticks while every inner fence stays at 3 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All four fixes are verified and the numbering warnings are cleared.
<!-- /ANCHOR:questions -->
