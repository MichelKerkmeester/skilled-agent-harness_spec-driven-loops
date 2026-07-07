---
title: "Feature Specification: Child 002 — README marketing-voice rewrite"
description: "Full rewrite of system-code-graph/README.md in problem-first marketing arc, mirroring Public root README and system-spec-kit README structure. Per D1, accept stylistic resemblance to exemplars; do not enforce strict HVR ≥85."
trigger_phrases:
  - "019/002 readme marketing"
  - "system-code-graph readme rewrite"
  - "marketing voice readme"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/007-code-graph-buildout/009-system-code-graph-uplift-phase-parent/002-readme-problem-first-rewrite"
    last_updated_at: "2026-05-16T11:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored child 002 plan from research 11 with D1 resemblance rule"
    next_safe_action: "Execute the README rewrite"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000295"
      session_id: "029-002-scaffold"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "D1 voice rule? Accept resemblance to exemplars"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Child 002 README Marketing-Voice Rewrite

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent** | `system-spec-kit/026-graph-and-context-optimization/005-code-graph/019-system-code-graph-uplift-phase-parent` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current `.opencode/skills/system-code-graph/README.md` opens with implementation prose ("Structural code indexing, SQLite-backed graph storage..."). Operators reading the skill cold get a technical map without a reason to care. The Public root README and the system-spec-kit README both open with a problem hook ("AI assistants have amnesia") and walk the reader through problem → solution → mechanism → quick start → reference. The system-code-graph README should follow the same arc so the skill positions as indispensable, not specialized.

### Purpose
Rewrite the README front-to-back in marketing voice, mirroring the structural patterns of the two exemplar READMEs. Per D1 locked at parent §5, accept stylistic resemblance to exemplars; do not enforce strict HVR ≥85. Banned words and banned phrases stay banned; em dashes, semicolons, and Oxford commas may carry over where natural for resemblance.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Full rewrite of `.opencode/skills/system-code-graph/README.md`
- Open with problem hook + solution breakdown + key statistics + comparison table
- Section ordering: OVERVIEW → QUICK START → FEATURES → STRUCTURE → CONFIGURATION → USAGE EXAMPLES → TROUBLESHOOTING → FAQ → RELATED DOCUMENTS
- Key Statistics table per §11 plan (MCP tools, languages, graph metrics, scan times, success rates)
- 3-column comparison table: Manual grep, Semantic search, system-code-graph
- "How It All Connects" cross-skill section per system-spec-kit pattern
- Frontmatter with title, description, trigger_phrases

### Out of Scope
- SKILL.md edits (child 001 already shipped)
- Per-folder mcp_server READMEs (child 001 already shipped)
- sk-doc per-type validation across every authored doc (child 003)
- Source-code changes under `mcp_server/`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/README.md` | Modify (full rewrite) | Marketing voice with problem-first arc |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README opens with problem hook in §1 OVERVIEW | First paragraph of §1 names a concrete operator pain point before introducing the solution |
| REQ-002 | Section arc matches exemplar pattern | OVERVIEW → QUICK START → FEATURES → STRUCTURE → CONFIGURATION → USAGE EXAMPLES → TROUBLESHOOTING → FAQ → RELATED DOCUMENTS sequence present |
| REQ-003 | Key Statistics table included | MCP tools count, languages, metrics, scan times present in §1 |
| REQ-004 | 3-column comparison table included | Manual grep, Semantic search, system-code-graph columns; ≥5 rows |
| REQ-005 | No HVR banned words or banned phrases | grep clean for `leverage`, `empower`, `seamless`, `disrupt`, `harness`, `delve`, `realm`, `cutting-edge`, `It's important to`, `Dive into`, `When it comes to` |
| REQ-006 | Strict-validate child 002 + parent 019 exits 0 | `validate.sh --strict` exits 0 |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | TOC present with double-dash anchors | `## TABLE OF CONTENTS` block with `#1--overview` style anchors |
| REQ-008 | Cross-skill integration section | References system-spec-kit ownership + CocoIndex bridge |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A new operator reading the README cold understands what the skill solves before reading any technical detail.
- **SC-002**: Section structure matches the exemplar pattern (root README + system-spec-kit README).
- **SC-003**: HVR banned words and banned phrases are absent; stylistic carries (em dashes, semicolons, Oxford commas) are allowed per D1.
- **SC-004**: Strict-validate exit 0 for child 002 and parent 019.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Drift in claimed numbers (tool count, languages) | Medium | Cite tool-schemas.ts directly; pull language list from tree-sitter-wasms manifest |
| Risk | Voice mismatch with sibling READMEs | Low | Anchor on system-spec-kit README phrasing patterns |
| Risk | New README claims something not yet shipped | Low | Cross-check every capability claim against research findings |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. D1-D5 locked at parent §5.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent decisions**: `../spec.md` §5 (D1)
- **Research**: `../research/research.md` §6.4, §11, §6.5
- **Voice exemplars**: `README.md` (root), `.opencode/skills/system-spec-kit/README.md`
<!-- /ANCHOR:related-docs -->
