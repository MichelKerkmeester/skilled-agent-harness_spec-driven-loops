---
title: "Feature Specification: Cross-skill decoupling + zero-table README §1 + terse ARCHITECTURE conform"
description: "Removes sibling references from system-spec-kit docs, zeros tables in §1 of three READMEs, conforms three ARCHITECTURE.md files to a single 8-section terse template."
trigger_phrases:
  - "005 cross-skill decoupling"
  - "remove sibling refs from spec-kit"
  - "zero tables readme section 1"
  - "terse arch conform"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/005-cross-skill-decoupling"
    last_updated_at: "2026-05-16T12:33:24Z"
    last_updated_by: "main_agent"
    recent_action: "Shipped 3-phase doc decouple plus arch conform plus zero-table pass"
    next_safe_action: "Strict-validate and commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0050000000000000000000000000000000000000000000000000000000000005"
      session_id: "005-cross-skill-decoupling-scaffold"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Spec folder placement? Under 005-docs as sibling 005"
      - "Voice rule? Accept resemblance to exemplars"
      - "Section 1 table policy? Zero tables, all prose"
      - "ARCHITECTURE conform depth? Match shape AND keep terse"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Cross-Skill Decoupling

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent** | `005-docs` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three coordinated drift issues across the system-spec-kit + system-skill-advisor + system-code-graph triad. (1) The three system-spec-kit docs (README, mcp_server/README, ARCHITECTURE) carry pre-extraction cross-skill references that couple them to sibling skills. (2) Section 1 (OVERVIEW) of each README has multiple tables that fragment what should be prose. (3) The three ARCHITECTURE.md files diverge significantly in shape, frontmatter, and depth even though they describe parallel runtimes.

### Purpose
Decouple spec-kit docs from siblings so each skill stands alone. Zero out Section 1 tables across all three READMEs in favor of prose plus bullets. Conform advisor and code-graph ARCHITECTURE.md to spec-kit's terse 8-section template so the three architecture docs differ only in subject material.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- spec-kit/README.md: remove 11 cross-skill mentions; rewrite §1 OVERVIEW into prose + bullets with zero tables; remove 4 em dashes
- spec-kit/mcp_server/README.md: clean frontmatter trigger_phrases of advisor/code-graph terms; remove inline path refs to sibling skills; drop cross-skill link
- spec-kit/ARCHITECTURE.md: full rewrite to the canonical 8-section template; remove §5 SKILL-ADVISOR SUBSYSTEM and §6 CODE-GRAPH SUBSYSTEM entirely; strip cross-skill trigger_phrases; renumber sections
- advisor/README.md: zero tables in §1; rewrite "How This Compares" + "Key Features" as prose + bullets
- code-graph/README.md: zero tables in §1; rewrite "How This Compares" + "Cross-Skill Integration" as prose + bullets
- advisor/ARCHITECTURE.md: full rewrite to match spec-kit's 8-section template, terse depth, ≤210 lines
- code-graph/ARCHITECTURE.md: full rewrite to match spec-kit's 8-section template, terse depth, ≤220 lines

### Out of Scope
- Source-code changes in mcp_server runtime of any skill
- HVR scoring beyond em-dash cleanup in spec-kit/README
- Removing `ccc_status` / `ccc_reindex` / `ccc_feedback` mentions from code-graph and advisor docs (those tools ARE owned by code-graph)
- Per-feature catalog or per-scenario playbook files (only the listed 7 skill docs touched)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/README.md` | Modify | Phase 1 + Phase 2: decouple + zero §1 tables + em dashes |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modify | Phase 1: decouple frontmatter + inline refs |
| `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | Modify (full rewrite) | Phase 1: decouple + becomes canonical 8-section template |
| `.opencode/skills/system-skill-advisor/README.md` | Modify | Phase 2: zero §1 tables |
| `.opencode/skills/system-code-graph/README.md` | Modify | Phase 2: zero §1 tables |
| `.opencode/skills/system-skill-advisor/ARCHITECTURE.md` | Modify (full rewrite) | Phase 3: conform to 8-section terse template |
| `.opencode/skills/system-code-graph/ARCHITECTURE.md` | Modify (full rewrite) | Phase 3: conform to 8-section terse template |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | spec-kit docs report 0 cross-skill refs | `grep -niE "system-skill-advisor\|system-code-graph\|mk_skill_advisor\|mk-code-index\|advisor_recommend\|code_graph_\|ccc_status\|ccc_reindex\|ccc_feedback\|detect_changes\|skill_advisor\|code_graph"` returns 0 hits in the 3 spec-kit files |
| REQ-002 | Section 1 of each README has zero markdown tables | `awk '/## 1\\./,/## 2\\./' README.md \| grep -c '^\|'` returns 0 for each of the 3 READMEs |
| REQ-003 | Three ARCHITECTURE.md files have identical 9-row section list | TOC + 8 numbered H2s, same anchor names |
| REQ-004 | Advisor and code-graph ARCHITECTURE.md each at terse target | ≤220 lines each |
| REQ-005 | Strict-validate child 005 + parent 005-docs (where pre-existing warnings allow) | Child exit 0 errors |

### P1 - Required
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | spec-kit/README em-dash count | 0 (down from 4) |
| REQ-007 | ARCHITECTURE frontmatter shape uniform | Same 4 keys: title (with "Architecture:" prefix), description, trigger_phrases, importance_tier |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three spec-kit docs describe only spec-kit; sibling skills can be deleted without breaking these files.
- **SC-002**: Section 1 of each README reads as prose, not table grid.
- **SC-003**: The three ARCHITECTURE.md files differ only in subject material; shape and anchor names are byte-for-byte aligned.
- **SC-004**: Strict-validate exit 0 for child 005.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deleting spec-kit ARCHITECTURE §5/§6 drops useful detail for spec-kit operators | Medium | Detail per-tool already lives in sibling skills' own ARCHITECTURE; spec-kit is decoupled cleanly |
| Risk | Terse ARCHITECTURE loses runtime detail operators relied on | Low | Detail per-tool moves to feature_catalog and INSTALL_GUIDE per the plan |
| Risk | Rewriting prose to remove tables introduces ambiguity | Low | Bulleted lists preserved where they read better than paragraphs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. All 4 plan-time decisions locked.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent decisions**: `../spec.md`
- **Voice exemplar**: `.opencode/skills/system-spec-kit/ARCHITECTURE.md` (the canonical 8-section template)
<!-- /ANCHOR:related-docs -->
