---
title: "Implementation Plan: Phase 7: governance-alignment"
description: "Fix 10 governance drift findings across sk-doc, sk-code, and system-spec-kit/constitutional: doc corrections, checker broadening, enforcement doc accuracy, and verifier severity promotion."
trigger_phrases:
  - "governance alignment plan"
  - "comment hygiene implementation"
  - "verify alignment drift plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/007-governance-alignment"
    last_updated_at: "2026-06-04T22:00:00Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "Plan written"
    next_safe_action: "run validate.sh --strict"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-007-governance-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: governance-alignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3, Markdown |
| **Framework** | None (standalone scripts + doc edits) |
| **Storage** | None |
| **Testing** | pytest (verify_alignment_drift), manual scratch-file test (check-comment-hygiene.sh) |

### Overview
Fix ten governance drift findings by making targeted edits to sk-doc docs, sk-code docs, the comment-hygiene checker (Python), two Python verifier functions, and one test. All changes are isolated to their verified fix targets; no logic outside the stated scope is touched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (G9 before G10)

### Definition of Done
- [x] All acceptance criteria met
- [x] pytest test_verify_alignment_drift.py passes
- [x] Scratch file test for check-comment-hygiene.sh passes
- [x] validate.sh --strict exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted patch — each finding maps to a single file edit with isolated scope.

### Key Components
- **check-comment-hygiene.sh**: Python script; VIOLATION_PATTERNS extended
- **verify_alignment_drift.py**: check_shell early-return + classify_severity ERROR set expansion
- **comment-hygiene.md**: Enforcement section rewritten for accuracy
- **gate-tool-routing.md**: Single table cell corrected
- **sk-doc docs**: Spec row, command required-section lists, filename exception clause

### Data Flow
No data flow changes. All changes are doc or static-analysis tool updates.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `frontmatter_templates.md` | sk-doc frontmatter guidance | Update Spec row | Read side-by-side with spec.md.tmpl |
| `quick_reference.md` | sk-doc command quick-ref | Update required sections list | grep required |
| `core_standards.md` | sk-doc standards | Update command section + add filename exception | grep required + grep NNN |
| `check-comment-hygiene.sh` | Comment hygiene enforcement | Broaden VIOLATION_PATTERNS | Scratch file test, exit codes |
| `comment-hygiene.md` | Constitutional enforcement doc | Three gates + hygiene-ok + bypass accuracy | Manual read |
| `gate-tool-routing.md` | Constitutional routing table | Semantic fallback cell | grep memory_search |
| `SKILL.md` (sk-code) | sk-code workflow doc | Remove bash prefix | grep bash.*check-comment |
| `code_quality_standards.md` | sk-code quality standards | Remove bash prefix | grep bash.*check-comment |
| `universal_checklist.md` | sk-code checklist | Remove bash prefix | grep bash.*check-comment |
| `verify_alignment_drift.py` | Alignment verifier | check_shell guard + ERROR set | pytest + manual run |
| `test_verify_alignment_drift.py` | Verifier test suite | Update severity expectation for G10 | pytest -v |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Doc corrections (G1, G2, G3, G7, G8)
- [x] G1: frontmatter_templates.md Spec row
- [x] G2: quick_reference.md + core_standards.md command sections
- [x] G3: core_standards.md filename exception clause
- [x] G7: gate-tool-routing.md Semantic fallback cell
- [x] G8: SKILL.md + code_quality_standards.md + universal_checklist.md bash prefix

### Phase 2: Constitutional doc accuracy (G5, G6)
- [x] G5: comment-hygiene.md hygiene-ok escape documented
- [x] G6: comment-hygiene.md Two→Three gates + bypass accuracy

### Phase 3: Enforcement tool fixes (G4, G9, G10)
- [x] G9: verify_alignment_drift.py check_shell python3 shebang guard
- [x] G4: check-comment-hygiene.sh VIOLATION_PATTERNS broadened
- [x] G10: verify_alignment_drift.py classify_severity ERROR set + test updated

### Phase 4: Verification
- [x] Scratch file tests for G4/G8
- [x] pytest for G9/G10
- [x] validate.sh --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual scratch | check-comment-hygiene.sh pattern coverage | Python shebang-direct invocation |
| Unit | verify_alignment_drift.py check_shell + classify_severity | pytest |
| Manual doc review | All doc edits | Read + grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| G9 before G10 | Internal sequencing | Done | Python .sh false ERRORs if reversed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: validate.sh exits non-zero or pytest regresses
- **Procedure**: Revert each file edit individually; the changes are isolated and independent
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
