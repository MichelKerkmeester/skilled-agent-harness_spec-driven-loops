---
title: "Feature Specification: mcp-code-mode README"
description: "Rewrite the mcp-code-mode skill README in the narrative voice, leading with the Code Mode execution engine (progressive disclosure, ~98% context reduction) the other mcp-* skills consume."
trigger_phrases:
  - "mcp-code-mode readme"
  - "mcp-code-mode narrative rewrite"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/109-skill-readme-standardization/014-mcp-code-mode-readme"
    last_updated_at: "2026-06-07T13:05:42Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Shipped mcp-code-mode README via deep-context + dual-draft"
    next_safe_action: "Begin phase 015 (sk-code-review README)"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-code-mode/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-014"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Used the code-form call_tool_chain (canonical here), documented the naming translation rule and the .env prefix gotcha; dropped version line and contested manual/tool/catalog counts"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: mcp-code-mode README

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 24 |
| **Predecessor** | 013-mcp-click-up-readme |
| **Successor** | 015-sk-code-review-readme |
| **Handoff Criteria** | README passes validate_document.py --type readme and HVR; paths verified |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14**, the Code Mode engine that closes Batch C (mcp-*).

**Scope Boundary**: Only `.opencode/skills/mcp-code-mode/README.md`. No SKILL.md or behavior change.

**Dependencies**: The narrative template (phase 001) and the deep-context gather in this folder's `context/`.

**Deliverables**: A rewritten `mcp-code-mode/README.md` in the narrative voice.

**Changelog**: Refresh the matching ../changelog/ file when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The mcp-code-mode README is a tabular reference card with a table of contents and no problem-first entry point. It carries drift: a version line the docs disagree on (1.0.7.0 vs 1.0.9 vs 2.0.0), a "5 manuals" count the install guide contradicts (6), an unverified "60% faster execution" claim, and it omits the single most important gotcha, the naming translation rule that is the documented number-one error.

### Purpose

Rewrite the README in the narrative voice, grounded in a two-iteration deep-context gather and a dual-model draft, leading with the Code Mode execution engine (the four tools, progressive disclosure, the ~98% context reduction) and the engine role the other mcp-* skills consume, while documenting the naming translation rule and the .env prefix gotcha and dropping the version and contested counts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rewrite `mcp-code-mode/README.md` to the narrative skeleton; lead with the engine, progressive disclosure and the naming rule.

### Out of Scope

- Any change to SKILL.md, INSTALL_GUIDE.md or the skill's behavior. Documentation only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-code-mode/README.md` | Modify | Narrative-voice rewrite of the Code Mode engine README |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README follows the narrative template | Sections match the template skeleton, no table of contents |
| REQ-002 | README passes structure validation | `validate_document.py --type readme` reports zero issues |
| REQ-003 | Documents the engine correctly | Uses the `call_tool_chain({ code })` form, the four-step progressive-disclosure workflow and the naming translation rule |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | README is HVR-clean in prose | No prose em dashes, semicolons, Oxford-comma lists or banned words (code-block syntax exempt) |
| REQ-005 | Drift dropped | No version line, no contested manual/tool/catalog count, no unverified perf claim; every cited path resolves |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate_document.py --type readme` passes with zero issues.
- **SC-002**: The four tools, the workflow, the naming rule and the boundary match SKILL.md; every cited path resolves and the naming translation rule is documented.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Model uses the array call form instead of the code form | Wrong invocation for this engine | Context report pinned the code form; host scanned the draft and found zero array-form calls |
| Risk | Model omits the naming translation rule | README misses the #1 error | Authoring prompt mandated it; host confirmed it is present |
| Risk | Model invents a playbook subdir name | Broken reference | Host verified the cited subdirs (01--core-tools, 07--recovery-and-config) exist; fixed one prose typo (Code Graph) |
| Dependency | deep-context gather in `context/` | Grounds the draft | Two-iteration sweep with cited file evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The engine model, the four tools and the naming rule verified during the gather and against the runtime tool registry.
<!-- /ANCHOR:questions -->
