---
title: "Feature Specification: 003-readme-problem-first-rewrite (skeleton, pre-synthesis)"
description: "Skeleton spec — full marketing-style README.md rewrite for system-skill-advisor. HVR-compliant, ~2000 words, 9 numbered sections, peer-anchored on system-code-graph/README.md."
trigger_phrases:
  - "skill-advisor readme rewrite"
  - "003 marketing readme phase"
  - "system-skill-advisor marketing readme"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/003-readme-problem-first-rewrite"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded child 003 skeleton"
    next_safe_action: "Fill after 001 synthesis"
    blockers: ["001 research.md required"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "003-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 003-readme-problem-first-rewrite

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Pending (gated by 001 synthesis) |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current `system-skill-advisor/README.md` reads as a structural reference (PASS on sk-doc `skill_readme` template) but lacks marketing voice. The project root README and peer `system-code-graph/README.md` set the voice ceiling: technical-but-narrative, tables-heavy, ~2000 words, 9 numbered sections.

### Purpose
Rewrite README.md in marketing-but-HVR-compliant style. Surface the 8 USPs (standalone MCP, 5-lane scorer, cross-runtime Gate 2 routing, skill-graph SQLite + auto-propagated enhances, v0.2.0 production isolation, v0.3.0 async I/O + 4-tier config precedence, daemon-backed freshness model, mk_skill_advisor MCP namespace).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Full rewrite of `.opencode/skills/system-skill-advisor/README.md` (~2000 words target)
- 9 numbered sections: OVERVIEW, QUICK START, FEATURES (3.1-3.4), STRUCTURE, CONFIGURATION, USAGE EXAMPLES, TROUBLESHOOTING, FAQ, RELATED DOCUMENTS
- HVR compliance per `.opencode/skills/sk-doc/references/global/hvr_rules.md`
- USP-mapped feature surfacing

### Out of Scope
- Other doc surfaces (owned by 004)
- New reference docs (owned by 005)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/README.md` | Modify (rewrite) | Marketing-style, ~2000 words, 9 sections |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README passes HVR compliance grep | 0 hard-blocker word hits |
| REQ-002 | README passes sk-doc skill_readme template | 9 required anchors present |
| REQ-003 | README ships all 8 USPs | Manual checklist verification |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: README rewrite ≈ 1800-2200 words
- **SC-002**: HVR grep returns 0 hard-blocker hits
- **SC-003**: User reads README top-to-bottom and confirms voice matches peer ceiling
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 001 research.md README gap audit | Blocker | Cannot author until iter 02 findings shipped |
| Risk | Marketing voice tips into hype/banned words | Medium | HVR grep gate before claiming done |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- All deferred to post-001
<!-- /ANCHOR:questions -->
