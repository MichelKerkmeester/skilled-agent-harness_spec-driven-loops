---
title: "Implementation Plan: Fenced Code Block Structure Parity"
description: "Rebalance the malformed outer example fences in four sk-doc templates by widening them to 4 backticks (or rebalancing an orphan), verified by an assert-guarded line-targeted editor and a fence-aware re-scan."
trigger_phrases:
  - "fence fix plan"
  - "widen outer fence"
  - "template structure plan"
  - "commonmark fence"
  - "fence parity plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-fenced-code-structure-parity"
    last_updated_at: "2026-07-17T13:56:23.385Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored implementation plan for the four template fence fixes"
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
# Implementation Plan: Fenced Code Block Structure Parity

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown templates + Python verification |
| **Framework** | sk-doc authoring templates |
| **Storage** | None |
| **Testing** | Fence-aware scan + `validate_document.py` |

### Overview
Each affected template has an example fenced with 3 backticks that contains nested 3-backtick fences. The fix widens the outer example fence to 4 backticks so the inner fences stay literal and the example is fully contained; one file instead needs its orphaned closing fence rebalanced. Edits are applied by an assert-guarded, line-targeted script that aborts on any content mismatch, and every file is re-scanned for fence balance before commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The exact open/close line of each malformed fence is identified per file.
- [x] The true intended boundary of each example is confirmed by reading the surrounding content.
- [x] The distinction between real sections and example headers is established per file.

### Definition of Done
- [x] Fence-aware scan: sequential real sections, zero swallowed real sections, zero unclosed fences.
- [x] `validate_document.py` valid with 0 errors / 0 warnings for each file.
- [x] Docs updated (spec/plan/tasks/implementation-summary).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical delimiter edit — no content or logic change.

### Key Components
- **Outer example fence**: widened from 3 to 4 backticks so shorter inner fences render literally.
- **Assert-guarded editor**: verifies expected content at each target line before mutating; aborts otherwise.
- **Fence-aware scan**: tracks the opening fence's backtick length; a close needs a bare fence of at least that length.

### Data Flow
Read template -> assert target lines -> rewrite delimiters in place -> re-scan for balance -> validate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| install_guide / parent_skill_hub / skill_asset / pr templates | Authoring examples copied by doc authors | update | Fence-aware scan + `validate_document.py` |
| `validate_document.py`, `extract_structure.py` | Structure parsers that read the templates | not a consumer change (already fence-aware from prior commits) | Re-run over the four fixed files |

Required inventories:
- Malformed nested-fence sites: fence-aware scan flagging any real `## N.` header rendered in-fence.
- Consumers of the templates: the create-readme, create-skill, and sk-git authoring flows that copy these skeletons.
- Matrix axes: each template file x its distinct malformed fence(s).
- Algorithm invariant: a longer outer fence keeps shorter inner fences literal; a close needs a bare fence of at least the opener's length.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Map every fence open/close per file with a fence-aware diagnostic.
- [x] Read each malformed region to confirm the intended example boundary.
- [x] Classify each fix as widen-to-4-backticks or rebalance-orphan.

### Phase 2: Core Implementation
- [x] parent_skill_hub: widen the §5 scaffold example fence (open + true close) to 4 backticks.
- [x] skill_asset: widen the §4 structure example fence to 4 backticks.
- [x] pr-template: widen the §12 breaking-changes example fence to 4 backticks.
- [x] install_guide: widen the six §7 error-example fences and wrap §13 COMPLETE TEMPLATE in one 4-backtick fence.

### Phase 3: Verification
- [x] Fence-aware scan on all four files.
- [x] `validate_document.py` on all four files.
- [x] Documentation updated.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Fence balance and real-vs-example section classification | Fence-aware Python scan |
| Validation | Per-file document validity and numbering | `validate_document.py` |
| Manual | Read each fixed region to confirm the example reads correctly | Read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `validate_document.py` fence-aware numbering | Internal | Green (shipped prior) | Numbering warnings would misreport, but structure fix still valid |
| Shared working tree with a concurrent session | Internal | Green | Pathspec-scoped edits avoid collision |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fixed template fails the fence-aware scan or introduces a new validator warning.
- **Procedure**: `git checkout -- <file>` restores the committed original; re-diagnose the fence boundary before retrying.
<!-- /ANCHOR:rollback -->
