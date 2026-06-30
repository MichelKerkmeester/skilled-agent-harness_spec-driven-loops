---
title: "Feature Specification: Phase 7: governance-alignment"
description: "Ten verified governance drift findings in sk-doc, sk-code, and system-spec-kit/constitutional require targeted doc and code corrections to align tooling, docs, and enforcement surfaces."
trigger_phrases:
  - "governance alignment"
  - "comment hygiene doc"
  - "sk-doc frontmatter spec row"
  - "tool routing fallback"
  - "verify alignment drift python sh"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/007-governance-alignment"
    last_updated_at: "2026-06-04T22:00:00Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "Implemented G1-G10 fixes; spec Complete"
    next_safe_action: "run validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/assets/frontmatter_templates.md"
      - ".opencode/skills/sk-doc/references/global/quick_reference.md"
      - ".opencode/skills/sk-doc/references/global/core_standards.md"
      - ".opencode/skills/sk-code/scripts/check-comment-hygiene.sh"
      - ".opencode/skills/system-spec-kit/constitutional/comment-hygiene.md"
      - ".opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md"
      - ".opencode/skills/sk-code/SKILL.md"
      - ".opencode/skills/sk-code/references/universal/code_quality_standards.md"
      - ".opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md"
      - ".opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py"
      - ".opencode/skills/sk-code/assets/scripts/test_verify_alignment_drift.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-007-governance-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: governance-alignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-04 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 7 |
| **Predecessor** | 006-catalog-playbook-accuracy |
| **Successor** | None |
| **Handoff Criteria** | All 10 findings fixed; validate.sh --strict passes; self-verification tests pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the comprehensive audit remediation specification.

**Scope Boundary**: Own `.opencode/skills/sk-doc/**`, `.opencode/skills/sk-code/**` (incl. `scripts/check-comment-hygiene.sh` and `assets/scripts/verify_alignment_drift.py`), `.opencode/skills/system-spec-kit/constitutional/**`, and `AGENTS.md`. No edits to code-graph or deep-loop source.

**Dependencies**:
- G9 must land before G10 (Python .sh files must not become false ERRORs after severity promotion)

**Deliverables**:
- sk-doc frontmatter Spec row corrected (G1)
- sk-doc command required-sections aligned to template_rules.json (G2)
- core_standards.md filename exception clause added (G3)
- check-comment-hygiene.sh broadened to catch all constitutional forbidden examples (G4)
- comment-hygiene.md hygiene-ok escape documented (G5)
- comment-hygiene.md Two gates → Three gates (G6)
- gate-tool-routing.md Semantic fallback corrected from memory_search to Grep/Glob (G7)
- bash prefix removed from check-comment-hygiene.sh invocations in 3 docs (G8)
- verify_alignment_drift.py check_shell early-returns for Python shebangs (G9)
- verify_alignment_drift.py header/shebang rules promoted to ERROR; test updated (G10)

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Ten governance drift findings exist across sk-doc, sk-code, and system-spec-kit/constitutional: the sk-doc spec frontmatter row instructs agents to remove required frontmatter; command required-section lists diverge across three docs; the comment-hygiene checker misses half the forbidden patterns the constitutional rule lists; enforcement docs miscount enforcement gates and misstate bypass behavior; and the alignment verifier false-positives on Python scripts with .sh extensions while passing on P0 header gaps.

### Purpose
Every governance doc and enforcement tool accurately reflects and enforces the constitutional rules, with no false-positives or false-negatives, so agents and contributors get reliable guidance.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- sk-doc/assets/frontmatter_templates.md Spec row (G1)
- sk-doc/references/global/quick_reference.md and core_standards.md command sections (G2, G3)
- sk-code/scripts/check-comment-hygiene.sh VIOLATION_PATTERNS (G4)
- system-spec-kit/constitutional/comment-hygiene.md enforcement section (G5, G6)
- system-spec-kit/constitutional/gate-tool-routing.md Semantic fallback cell (G7)
- sk-code/SKILL.md, code_quality_standards.md, universal_checklist.md bash prefix (G8)
- sk-code/assets/scripts/verify_alignment_drift.py check_shell + classify_severity (G9, G10)
- sk-code/assets/scripts/test_verify_alignment_drift.py severity test update (G10)

### Out of Scope
- Code-graph and deep-loop source (owned by cluster A)
- Any logic changes outside comment-hygiene patterns and verifier severity rules

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/assets/frontmatter_templates.md` | Modify | Spec row: suggest-removal → validate required fields |
| `.opencode/skills/sk-doc/references/global/quick_reference.md` | Modify | Command required sections aligned to template_rules.json |
| `.opencode/skills/sk-doc/references/global/core_standards.md` | Modify | Command required sections + filename exception clause |
| `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` | Modify | Broaden VIOLATION_PATTERNS to catch all constitutional examples |
| `.opencode/skills/system-spec-kit/constitutional/comment-hygiene.md` | Modify | Document hygiene-ok escape; Two→Three gates; bypass accuracy |
| `.opencode/skills/system-spec-kit/constitutional/gate-tool-routing.md` | Modify | Semantic fallback: memory_search → Grep/Glob |
| `.opencode/skills/sk-code/SKILL.md` | Modify | Remove bash prefix from check-comment-hygiene.sh invocation |
| `.opencode/skills/sk-code/references/universal/code_quality_standards.md` | Modify | Remove bash prefix |
| `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md` | Modify | Remove bash prefix |
| `.opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py` | Modify | check_shell early-return for python3 shebang; classify_severity ERROR promotion |
| `.opencode/skills/sk-code/assets/scripts/test_verify_alignment_drift.py` | Modify | Update test_warning_only_exit_code_is_zero_by_default for JS-USE-STRICT becoming ERROR |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | sk-doc Spec row instructs validation not removal | frontmatter_templates.md Spec row reads "Validate required fields..." |
| REQ-002 | Command required sections consistent across all three docs | quick_reference.md, core_standards.md, template_rules.json all list [purpose, instructions] |
| REQ-003 | Filename exception clause for NNN-name.md pattern | core_standards.md contains explicit exception for packet-local numbered docs |
| REQ-004 | Comment hygiene checker catches all constitutional forbidden examples | Each missed pattern (REQ-\d+\b, CHK-\d+\b, T\d{3,4}\b, checklist item N, Pn-finding-N, finding #N, top-level spec path) exits 1 on scratch file |
| REQ-005 | hygiene-ok escape documented in constitutional doc | comment-hygiene.md describes per-line hygiene-ok escape alongside --no-verify |
| REQ-006 | Enforcement doc lists three gates not two | comment-hygiene.md Enforcement section says "Three gates" including CI gate |
| REQ-007 | Tool routing constitutional doc uses correct semantic fallback | gate-tool-routing.md Semantic/concept Fallback column reads "Grep / Glob" |
| REQ-008 | check-comment-hygiene.sh invoked without bash prefix in all three docs | No remaining "bash .opencode/skills/sk-code/scripts/check-comment-hygiene.sh" in SKILL.md, code_quality_standards.md, universal_checklist.md |
| REQ-009 | verify_alignment_drift.py skips shell checks for Python .sh files | Running verifier on check-comment-hygiene.sh produces no SH-SHEBANG or SH-STRICT-MODE findings |
| REQ-010 | Header/shebang rules promoted to ERROR in verifier | SH-SHEBANG, SH-STRICT-MODE, PY-SHEBANG, TS-MODULE-HEADER violations exit 1 without --fail-on-warn |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 10 G-cluster findings resolved; no finding remains in confirmed-open state
- **SC-002**: check-comment-hygiene.sh scratch test exits 1 for each forbidden example; clean file exits 0
- **SC-003**: pytest test_verify_alignment_drift.py -v passes with updated severity expectations
- **SC-004**: validate.sh --strict on this folder exits 0 (Errors: 0)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | G9 before G10 | Python .sh files become false ERRORs if G10 lands first | Implement check_shell guard before severity promotion |
| Risk | T\d{3,4}\b pattern broadening | Variable names like T1234 may false-positive | Already mitigated by is_comment_line gate; 3-4 digit constraint provides specificity |
| Risk | JS-USE-STRICT not promoted to ERROR | G10 scope is header/shebang rules only; JS-USE-STRICT stays WARN | Scope-locked: only SH-SHEBANG, SH-STRICT-MODE, PY-SHEBANG, TS-MODULE-HEADER promoted |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. All findings were fully specified in the verified backlog.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
