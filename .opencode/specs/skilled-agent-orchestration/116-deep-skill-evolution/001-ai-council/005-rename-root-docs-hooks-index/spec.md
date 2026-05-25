---
title: "Feature Specification: 115/005 — root docs + hooks + skills index"
description: "Parallel-after-001: update root README.md skill catalog entry + AGENTS.md (CLAUDE.md symlink) Agent Definitions + Quick Reference row + .github/hooks/scripts/pre-push-council.sh glob + .opencode/skills/README.md."
trigger_phrases: ["115 005", "root docs rename"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/001-ai-council/005-rename-root-docs-hooks-index"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 005 spec.md"
    next_safe_action: "Author 005 plan.md"
    blockers: []
    key_files: ["README.md", "AGENTS.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115005"
      session_id: "115-005-spec-init"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: 115/005 — root docs + hooks + skills index

---

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 (parallel after 001) |
| **Status** | Complete |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 of 6 |
| **Handoff Criteria** | 4 root docs + git hook updated; rg = 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context
Phase 5 of 6. Parallel after 001. Touches root-level surfaces + skills index + git hook.

**Deliverables**: 4 files updated (README.md line 935; AGENTS.md lines 162+336; .github/hooks/scripts/pre-push-council.sh CHANGED_FILES glob; .opencode/skills/README.md).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
### Problem Statement
Root docs + git hook still reference old names post-002/003 rename.
### Purpose
Update so the repo-facing surfaces (skill catalog, agent definitions, hook trigger) reflect new identity.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
### In Scope
- README.md (line 935 area)
- AGENTS.md (lines 162 + 336)
- CLAUDE.md (symlink — automatic)
- .github/hooks/scripts/pre-push-council.sh
- .opencode/skills/README.md

### Out of Scope
Memory files (007 pattern: not in 115's primary scope; can be follow-on).

### Files to Change
| File | Action |
|------|--------|
| `README.md` | Edit skill catalog entry |
| `AGENTS.md` | Edit Agent Definition + Quick Reference row |
| `.github/hooks/scripts/pre-push-council.sh` | Update CHANGED_FILES glob |
| `.opencode/skills/README.md` | Edit skill listing |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
### P0
| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Root README.md updated | grep |
| REQ-002 | AGENTS.md Agent Definitions + Quick Reference updated | grep |
| REQ-003 | Git hook CHANGED_FILES glob matches new paths | grep + smoke-test |
| REQ-004 | rg "sk-ai-council" on these 4 files = 0 | rg |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: 005 strict validate exit 0.
- **SC-002**: Git hook still fires on rename-related path changes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Mitigation |
|------|------|------------|
| Risk | Git hook glob uses wildcards that need shape change | Inspect glob before edit |
| Dependency | 001+002+003 landed | gating |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
(see parent §10)
<!-- /ANCHOR:questions -->
