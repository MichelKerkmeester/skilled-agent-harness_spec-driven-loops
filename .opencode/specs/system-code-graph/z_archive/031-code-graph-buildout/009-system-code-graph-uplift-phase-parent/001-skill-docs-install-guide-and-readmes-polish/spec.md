---
title: "Feature Specification: Child 001 — SKILL.md and references polish + INSTALL_GUIDE drift + per-folder README usefulness audit"
description: "Implements child 001 of packet 019. Fixes verified drift across SKILL.md, INSTALL_GUIDE.md, ARCHITECTURE.md, references, feature_catalog, and per-folder mcp_server READMEs. Adds useful-gap primers sized to system-spec-kit siblings. Plugin_bridges README gets targeted alignment per D2."
trigger_phrases:
  - "019/001 skill md polish"
  - "system-code-graph references hvr"
  - "install_guide drift fixes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/009-system-code-graph-uplift-phase-parent/001-skill-docs-install-guide-and-readmes-polish"
    last_updated_at: "2026-05-16T10:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored child 001 plan from research 10 + verified findings"
    next_safe_action: "Execute Batch 1 SKILL.md edits"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000291"
      session_id: "029-001-scaffold"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "D2 plugin_bridges scope? Targeted alignment, preserve structure"
      - "D4 primer size? Match system-spec-kit references scale (1-2 paragraphs each)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Child 001 SKILL.md and References Polish

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
Research §10 enumerated 10 priority items spanning SKILL.md, INSTALL_GUIDE.md, ARCHITECTURE.md, references, feature_catalog, and per-folder mcp_server READMEs. Verified findings include drift (INSTALL_GUIDE version + tool count, ARCHITECTURE launcher reference, stale SKILL.md continuity), HVR violations (87+ across core docs), and useful-content gaps (no "why" primers, no glossaries, no situational triggers). All accumulated since packet 028 closed tool-count and topology drift.

### Purpose
Apply targeted edits across the verified findings to bring authored docs to a publishable state. SKILL.md ships first because it sets terminology and voice. Primers match system-spec-kit reference scale per D4.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- SKILL.md: continuity refresh, "why structural matters" primer, glossary, situational triggers, fix weak boundary explanation, fix weak reference notation, HVR violations
- INSTALL_GUIDE.md: 3 known drifts (lines 49/56/197), add classify_query_intent to tool list (line 17), em dash at line 240, semicolon cleanup, weak prose at line 216
- ARCHITECTURE.md: date drift line 29, launcher reference bug line 72, 12 em dashes, 18 semicolons, 4 Oxford commas
- References: ownership-boundary.md HVR (1 semicolon + 1 Oxford comma at line 20), database-path-policy.md content alignment
- feature_catalog/feature_catalog.md: 6 em dashes, 2 semicolons, 1 Oxford comma
- mcp_server/README.md: 2 Oxford commas (lines 35, 40); add "why this layer matters" primer
- mcp_server/tests/handlers/README.md: 2 Oxford commas (lines 67, 90)
- plugin_bridges/README.md: targeted alignment of import paths and module references per D2; preserve structure
- README.md: HVR fixes (1 em dash line 50, 1 semicolon line 54, 2 Oxford commas lines 112/223), DB path drift at line 54

### Out of Scope
- README.md marketing-voice rewrite (child 002)
- sk-doc per-type validation across every authored doc (child 003)
- Source-code changes under `mcp_server/{lib,handlers,tools,...}`
- Re-running packet 028 fixes (already shipped)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-code-graph/SKILL.md` | Modify | Continuity refresh, primer, glossary, triggers, HVR |
| `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | Modify | 3 drift + classify tool + em dash + weak prose |
| `.opencode/skills/system-code-graph/ARCHITECTURE.md` | Modify | Date drift, launcher fix, 34 HVR violations |
| `.opencode/skills/system-code-graph/README.md` | Modify | 4 HVR + DB path drift (NOT the marketing rewrite) |
| `.opencode/skills/system-code-graph/references/ownership-boundary.md` | Modify | HVR L20 |
| `.opencode/skills/system-code-graph/references/database-path-policy.md` | Modify | Content alignment at L31 if needed |
| `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` | Modify | 9 HVR violations |
| `.opencode/skills/system-code-graph/mcp_server/README.md` | Modify | 2 Oxford commas + primer |
| `.opencode/skills/system-code-graph/mcp_server/tests/handlers/README.md` | Modify | 2 Oxford commas |
| `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/README.md` | Modify | Targeted alignment per D2 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | INSTALL_GUIDE 3 known drifts fixed | `grep -nE "1\\.0\\.0\\.0\|10 \\(see" INSTALL_GUIDE.md` returns 0 matches |
| REQ-002 | SKILL.md continuity refreshed to packet 019/001 | `packet_pointer` references `019-system-code-graph-uplift-phase-parent/001-skill-docs-install-guide-and-readmes-polish` |
| REQ-003 | ARCHITECTURE.md launcher reference correct | Line 72 references `mk-code-index-launcher.cjs` |
| REQ-004 | Em dashes removed from in-scope files | `grep -c '—'` per file is 0 |
| REQ-005 | Strict-validate child 001 + parent 019 exits 0 | `validate.sh --strict` exits 0 |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | "Why structural matters" primer in SKILL.md and README.md | Primer section present, sized 1-2 paragraphs |
| REQ-007 | Glossary in SKILL.md | At least 7 terms defined (structural indexing, semantic search, blast radius, readiness, trust state, scope fingerprint, false-safe) |
| REQ-008 | Situational triggers in SKILL.md | At least 3 concrete scenarios |
| REQ-009 | Plugin_bridges import paths aligned to current code-graph reality | Spot-check matches source |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every verified finding in research §10 priorities 1-10 is either fixed in-scope or explicitly deferred to a follow-on with rationale.
- **SC-002**: HVR violation count for in-scope files drops to 0 em dashes and 0 internal semicolons (markdown header colons preserved).
- **SC-003**: SKILL.md adds primer + glossary + triggers sized to system-spec-kit reference scale (1-2 paragraphs each).
- **SC-004**: Strict-validate exit 0 for child 001 and parent 019.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Research hallucinated some file:line citations (e.g. INSTALL_GUIDE L195 is actually L197) | Medium | Grep-verify each finding before editing |
| Risk | Removing all semicolons mechanically would break code blocks and SKILL.md frontmatter | High | Only edit prose, never code blocks or JSON/YAML |
| Risk | plugin_bridges rewrite scope creep | Low | D2 says targeted alignment only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. D1-D5 locked at parent 019 §5.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Parent decisions**: `../spec.md` §5 (D1-D5)
- **Research**: `../research/research.md` §6.1, §6.2, §6.5, §10
<!-- /ANCHOR:related-docs -->
