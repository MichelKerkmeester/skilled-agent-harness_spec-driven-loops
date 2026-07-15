---
title: "Feature Specification: 005-content-additions-hvr-polish (skeleton, pre-synthesis)"
description: "Skeleton spec — 5 new reference docs (lane-weight tuning, query cookbook, validation baselines, daemon lease, skill-graph drift), canonical hook-reference copy, and HVR compliance sweep across the package."
trigger_phrases:
  - "skill-advisor content additions"
  - "005 content additions hvr"
  - "skill-advisor new reference docs"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/008-skill-advisor-documentation/004-documentation-quality-refactor/005-content-additions-hvr-polish"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded child 005 skeleton"
    next_safe_action: "Fill post-001 synthesis"
    blockers: ["001 research.md required"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "005-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: 005-content-additions-hvr-polish

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Pending (gated by 001 synthesis + 004 completion) |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The package has identifiable content gaps surfaced by audit: no lane-weight tuning guide, no skill-graph query cookbook, no validation baselines troubleshooting, no daemon lease contract, no skill-graph drift reconciliation guide, and the hook-reference link is broken because the canonical file lives in system-spec-kit. HVR compliance also needs a sweep after all 004 alignment edits.

### Purpose
Add 5 new reference docs to fill content gaps, copy the canonical hook-reference into the skill package, and run a final HVR compliance sweep across every authored doc surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `references/lane-weight-tuning.md` (~120 lines)
- Create `references/skill-graph-query-cookbook.md` (~200 lines, one section per query type)
- Create `references/validation-baselines.md` (~80 lines, baseline metrics + troubleshooting)
- Create `references/daemon-lease-contract.md` (~100 lines, lease semantics + contention recovery)
- Create `references/skill-graph-drift.md` (~100 lines, SQL-vs-graph-metadata.json reconciliation)
- Create `references/hooks/skill-advisor-hook.md` (canonical copy from system-spec-kit)
- HVR sweep: grep for hard-blocker words/phrases across every authored doc

### Out of Scope
- Bug fixes (owned by 002)
- README rewrite (owned by 003)
- Per-file alignment (owned by 004)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/references/lane-weight-tuning.md` | Create | New reference |
| `.opencode/skills/system-skill-advisor/references/skill-graph-query-cookbook.md` | Create | New reference |
| `.opencode/skills/system-skill-advisor/references/validation-baselines.md` | Create | New reference |
| `.opencode/skills/system-skill-advisor/references/daemon-lease-contract.md` | Create | New reference |
| `.opencode/skills/system-skill-advisor/references/skill-graph-drift.md` | Create | New reference |
| `.opencode/skills/system-skill-advisor/references/hooks/skill-advisor-hook.md` | Create | Canonical copy |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 new reference docs ship | 5 files exist, each passes sk-doc skill_reference validate |
| REQ-002 | Hook-reference canonical copy ships | File exists at expected path; README + INSTALL_GUIDE links resolve |
| REQ-003 | HVR sweep passes across package | rg hard-blocker pattern returns 0 hits in all authored docs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 6 new files exist and validate
- **SC-002**: HVR grep returns 0 hard-blocker hits
- **SC-003**: All cross-links to new reference docs from SKILL/README/ARCHITECTURE/INSTALL_GUIDE resolve
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 001 iter 15 HVR findings + iter 18 mcp_server doc gaps | Blocker | Cannot scope content until iters ship |
| Dependency | 004 alignment edits | Blocker | HVR sweep runs after 004 lands |
| Risk | Hook-reference content duplication drift over time | Low | Add source-canonicalized note in copy |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Hook reference: copy canonically into skill package vs maintain working relative link to system-spec-kit? Decision deferred to 002 or here based on 001 iter 17 findings.
<!-- /ANCHOR:questions -->
