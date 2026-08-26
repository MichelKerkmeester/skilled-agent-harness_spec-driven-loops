---
title: "Feature Specification: Phase 4: rehome-rules-content [template:level-1/spec.md]"
description: "Rehome the 20 constitutional rule files' unique content and retarget the root-doc citations, then delete the folder. Most rules are already inlined in the root docs; the actionable citation set is concentrated in CLAUDE.md/AGENTS.md/BARTER.md, though a full census must precede deletion (420 raw refs exist, mostly non-load-bearing spec history)."
trigger_phrases:
  - "rehome constitutional rules"
  - "citation census"
  - "retarget links"
  - "delete constitutional folder"
  - "spec core"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "037-decisions-memory-redesign/004-rehome-rules-content"
    last_updated_at: "2026-08-26T07:25:00Z"
    last_updated_by: "design-author"
    recent_action: "Authored rehome design from 001-analysis research (R6) + verified citation census"
    next_safe_action: "Run a full citation census before moving or deleting any rule file"
    blockers: []
    key_files:
      - "CLAUDE.md"
      - "AGENTS.md"
      - "BARTER.md"
      - ".opencode/skills/system-spec-kit/constitutional/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design-037-004-rehome-rules-content"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Full citation census beyond the 3 root docs (install-guides, feature-catalog playbooks, skill READMEs)"
    answered_questions:
      - "How many raw constitutional/*.md references exist? (420, mostly non-load-bearing spec history)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: rehome-rules-content

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-26 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-deprecation-mechanics |
| **Successor** | 005-advisor-integration |
| **Handoff Criteria** | A full citation census is complete; unique rule content is rehomed (root docs + DECISIONS.md Standing); all load-bearing links retargeted; the folder deleted only after no live reference remains. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4**, moving the rule *content* off the constitutional folder now that the tier is inert (phase 3). Grounded in 001-analysis research R6 and the verified census: 420 raw `constitutional/*.md` references exist, but nearly all are in spec history / research iterations (non-load-bearing); the actionable set is the 3 root docs plus a few skill docs.

**Scope Boundary**: Rule-file content + the links that cite it. NOT the search plumbing (phase 3) or the advisor capsules (phase 5).

**Dependencies**:
- Phase 3 landed (tier inert), so nothing live reads the folder as an indexed surface.
- A full citation census — the "~16 links" estimate was wrong; a real enumeration must precede deletion.

**Deliverables**:
- Unique rule content rehomed (root docs for the long-forms AGENTS.md cites; DECISIONS.md Standing for the global rules).
- All load-bearing citations retargeted; the folder deleted.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Deleting the constitutional folder naively breaks dangling `See …md` links in CLAUDE.md/AGENTS.md/BARTER.md and any skill doc that cites a rule as its authority. Most rule content is already inlined in the root docs, but a subset (the long-form rules AGENTS.md points to) exists only in the files. The raw reference count (420) is dominated by spec history that does not need fixing, which makes a blind grep-and-replace both incomplete and over-broad.

### Purpose
Rehome the genuinely unique rule content, retarget only the load-bearing citations, and delete the folder once no live reference depends on it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A full citation census separating load-bearing references (root docs, skill READMEs, install-guides, feature-catalog) from non-load-bearing spec history.
- Rehome unique long-form rule content into the root docs (or keep a small number as unindexed docs) and the global standing rules into DECISIONS.md.
- Retarget the load-bearing links; delete the `constitutional/` folder.

### Out of Scope
- Search plumbing / tier config (phase 3).
- Advisor render.ts capsules (phase 5).
- Editing spec-history references (non-load-bearing; left as historical record).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| CLAUDE.md / AGENTS.md / BARTER.md | Modify | Retarget the load-bearing `See …md` links; inline any missing long-form content |
| .opencode/DECISIONS.md | Modify | Absorb the global standing rules |
| .opencode/skills/system-spec-kit/constitutional/ | Delete | Removed after all live citations move |
| skill READMEs / install-guides citing rules | Modify | Retarget authority pointers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Full citation census complete before any move | **Given** a repo-wide scan, every load-bearing reference is enumerated and separated from spec-history references |
| REQ-002 | Unique rule content preserved | **Given** the folder deletion, no rule's unique guidance is lost — it lives in a root doc or DECISIONS.md |
| REQ-003 | No dangling links after deletion | **Given** the retargeted docs, a link check finds zero references to the deleted `constitutional/*.md` paths in load-bearing docs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Spec-history references left intact | **Given** non-load-bearing history, those references are deliberately not rewritten (they are a historical record) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Citation census complete; load-bearing vs history separated.
- **SC-002**: Unique rule content rehomed; global standing rules in DECISIONS.md.
- **SC-003**: Folder deleted; zero dangling load-bearing links (verified by a link check).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deleting before census is complete | High — dangling authority links | Census is REQ-001, a hard precondition to any deletion |
| Risk | Losing unique long-form rule content | High — steering guidance lost | Inline into root docs or keep as unindexed docs before delete |
| Risk | Over-broad grep rewrites spec history | Medium — churns historical record | Scope rewrites to load-bearing docs only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Beyond the 3 root docs, which skill READMEs / install-guides / feature-catalog playbooks carry load-bearing constitutional citations? (Resolved by the REQ-001 census.)
<!-- /ANCHOR:questions -->

---
