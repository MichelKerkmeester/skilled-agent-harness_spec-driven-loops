---
title: "Feature Specification: Analysis of peck framework teachings applicable to system-spec-kit"
description: "Analyze the external repo gytis-ivaskevicius/peck and extract transferable teachings that could improve system-spec-kit. Analysis-only deliverable; no behavioral changes to spec-kit."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/001-peck-teachings-for-spec-kit"
    last_updated_at: "2026-06-02T08:38:07Z"
    last_updated_by: "analysis-author"
    recent_action: "Authored peck-teachings-analysis.md and canonical docs"
    next_safe_action: "User reviews report; optionally open per-teaching spec folders"
    blockers: []
    key_files:
      - "peck-teachings-analysis.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-peck-teachings-for-spec-kit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Deliverable type → analysis report only (user-selected)"
      - "Teachings → all four T1-T4 (user-selected)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Analysis of peck framework teachings applicable to system-spec-kit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-02 |
| **Branch** | `001-peck-teachings-adoption` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The user asked whether the external repo `gytis-ivaskevicius/peck` contains any teachings that could
improve `system-spec-kit`. Without a structured comparison, transferable ideas stay implicit and the
risk is either ignoring useful mechanisms or over-importing peck's minimalist philosophy wholesale.

### Purpose
Produce one well-cited analysis report that names which peck mechanisms map onto real spec-kit gaps,
how spec-kit could adopt them, and which to explicitly reject — leaving the team a decision-ready
artifact without changing spec-kit behavior.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A standalone analysis report (`peck-teachings-analysis.md`) covering teachings T1-T4.
- Verified citations to both peck source and spec-kit source for every claim.
- An explicit anti-teachings section and a suggested adoption sequence.

### Out of Scope
- Any change to spec-kit code, templates, validation rules, MCP server, or constitutional memory - this is analysis only.
- Implementing the `AC_COVERAGE` rule or any other recommendation - described, not built.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `peck-teachings-analysis.md` | Create | Primary deliverable: the teachings report |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Create | Level 1 framing docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Report covers all four teachings (T1-T4) | Given the report, when a reader opens it, then each of T1-T4 has its own section with peck source + spec-kit gap + recommendation |
| REQ-002 | Every claim is cited and verified | Given any factual claim, when checked, then it cites a peck file/line or spec-kit path that actually resolves |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Anti-teachings section present | Given the report, when read, then it names which peck ideas to reject and why |
| REQ-004 | No spec-kit behavior changed | Given the repo, when diffed, then only this spec folder's files are added; no spec-kit code/template/rule is modified |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The report distinguishes mechanisms worth borrowing from peck's philosophy, with a per-teaching verdict (worthiness/effort/risk).
- **SC-002**: `validate.sh --strict` passes on this spec folder and every cited path resolves.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Access to peck source | Cannot verify quotes | Repo cloned locally at `/tmp/peck`; quotes verified against it |
| Risk | Overstating spec-kit gaps | Misleading recommendations | Cross-checked each gap against actual validation rules and templates |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Deliverable type (analysis only) and teaching scope (all four) were confirmed with the user before writing.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
