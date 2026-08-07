---
title: "Phase B: sk-doc-aligned READMEs for system-skill-advisor code folders"
description: "Close the remaining sk-doc gaps in system-skill-advisor/mcp_server/: author 2 new fixture-folder READMEs via the cli-devin + cli-opencode pipeline, add TOC anchor blocks to 5 already-structured READMEs that lack only that section."
trigger_phrases:
  - "024 spec"
  - "system-skill-advisor code-folder readmes"
  - "Phase B code readme scoped"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/008-skill-advisor-documentation/002-code-folder-readme-coverage"
    last_updated_at: "2026-05-15T11:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded Phase B packet"
    next_safe_action: "Dispatch cli-devin Pass 1"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/fixtures/lifecycle/"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/context/README.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/README.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/__tests__/README.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/README.md"
      - ".opencode/skills/system-skill-advisor/mcp_server/stress_test/search-quality/README.md"
    session_dedup:
      fingerprint: "sha256:0af13222b15be4a4db3b4dc3d19514c029418adb23a879d50a46998dec2cc5f2"
      session_id: "024-phase-b-scaffolded"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "What is the actual scope? 2 new READMEs (fixture folders) + 5 TOC additions to existing READMEs"
      - "Why fewer than the planned 9? Discovery showed 2 folders (lib/skill-graph, stress_test/skill-advisor) already pass sk-doc validate, and 5 have all required structure except the TOC anchor block"
      - "Why not pipeline-author the 5 TOC fixes? Their structure is already aligned; the 2-pass pipeline is reserved for full authoring tasks, not mechanical anchor inserts"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase B: sk-doc-aligned READMEs for system-skill-advisor

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Target Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-05-15 |
| **Branch** | `main` |
| **Parent** | `system-spec-kit/026-graph-and-context-optimization/006-skill-advisor` |
| **Phase** | B of 4 |
| **Predecessor** | `005-code-graph/017-code-folder-readmes` (Phase A, shipped) |
| **Successor** | `014-local-embeddings-migration/054-code-folder-readmes` (Phase C) |
| **Handoff Criteria** | 2 new `README.md` files in fixture folders + TOC anchor blocks added to 5 existing READMEs, each sk-doc validate exit 0, strict-validate on this packet exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem

Discovery against the live tree (2026-05-15) shows the system-skill-advisor README gap is smaller than the original 4-phase plan estimated:

| Folder | State | Action |
|--------|-------|--------|
| `tests/fixtures/lifecycle/` | NO README | Author new (pipeline) |
| `tests/scorer/fixtures/` | NO README | Author new (pipeline) |
| `lib/context/` | README present, missing TOC anchor block | Mechanical TOC insert |
| `lib/scorer/lanes/` | README present, missing TOC | Mechanical TOC insert |
| `lib/scorer/lanes/__tests__/` | README present, missing TOC | Mechanical TOC insert |
| `scripts/routing-accuracy/` | README present, missing TOC | Mechanical TOC insert |
| `stress_test/search-quality/` | README present, missing TOC | Mechanical TOC insert |
| `lib/skill-graph/` | Already passes sk-doc validate | None (upgraded by earlier 022 packet) |
| `stress_test/skill-advisor/` | Already passes sk-doc validate | None (upgraded by earlier 022 packet) |

Until both kinds of gap are closed, the smart router's anchor-driven retrieval over the system-skill-advisor tree drops the affected folders.

### Purpose

Close the gap in two parallel tracks:

1. Author 2 brand-new fixture READMEs via the cli-devin (SWE 1.6 context) + cli-opencode (deepseek-v4-pro markdown) pipeline proven in Phase A.
2. Insert a TOC anchor block into 5 already-aligned READMEs mechanically (no pipeline needed; their section structure is already complete).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Author `README.md` in 2 fixture folders (`tests/fixtures/lifecycle/`, `tests/scorer/fixtures/`)
- Add `## TABLE OF CONTENTS` anchor block to 5 existing READMEs
- 2 context bundles under `research/context-bundles/` for the new fixture READMEs
- Pre-Pass-2 verification gate: grep-verify each bundle's `internal_imports` and `validation_commands` against source (new step per Phase A lesson, captured in `feedback_cli_devin_bundle_verification`)
- Per-README sk-doc validate and strict-validate on this packet

### Out of Scope

- The 2 READMEs that already pass (`lib/skill-graph/`, `stress_test/skill-advisor/`) — they remain untouched
- Folders with sk-doc-compliant READMEs that pass validate already (the bulk of `system-skill-advisor/mcp_server/`)
- Phase C (system-spec-kit 56 folders) and Phase D (root README realignment) — separate packets
- HVR rule overrides beyond the standard pass bar (>= 85)

### Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-skill-advisor/mcp_server/tests/fixtures/lifecycle/README.md` | Create | New sk-doc README for lifecycle fixture folder (1 file: index.ts) |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/fixtures/README.md` | Create | New sk-doc README for scorer fixture folder (3 .ts + .embeddings-cache) |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/context/README.md` | Edit | Insert TOC anchor block above section 1 |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/README.md` | Edit | Insert TOC anchor block |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/__tests__/README.md` | Edit | Insert TOC anchor block |
| `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/README.md` | Edit | Insert TOC anchor block |
| `.opencode/skills/system-skill-advisor/mcp_server/stress_test/search-quality/README.md` | Edit | Insert TOC anchor block |
| `research/context-bundles/tests-fixtures-lifecycle.json` | Create | Pass 1 bundle for lifecycle fixture |
| `research/context-bundles/tests-scorer-fixtures.json` | Create | Pass 1 bundle for scorer fixtures |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both new fixture READMEs exist | `ls` confirms 2 files; each > 1000 bytes |
| REQ-002 | Both new READMEs pass sk-doc validate | `validate_document.py --type readme` exits 0 |
| REQ-003 | All 5 TOC-fixed READMEs pass sk-doc validate | `validate_document.py --type readme` exits 0 for each |
| REQ-004 | Each README contains 4 mandatory anchors | grep confirms `table-of-contents`, `overview`, `key-files`-equivalent, `related` pairs |
| REQ-005 | Each README has YAML frontmatter | `title`, `description`, `trigger_phrases` (1+) present |
| REQ-006 | Strict-validate on this packet exits 0 | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Context bundles persisted | 2 JSON files in `research/context-bundles/`, each >= 1500 bytes |
| REQ-008 | Pre-Pass-2 verification gate passes | Each bundle's claimed internal_imports + validation_commands verified by grep against source; hallucinations flagged before Pass 2 |
| REQ-009 | HVR score >= 85 per README | `validate_document.py --json` returns `hvr_score >= 85` for each |
| REQ-010 | Executor separation honored | cli-devin only runs SWE 1.6; deepseek-v4-pro only via cli-opencode |
| REQ-011 | Sonnet @markdown + @review double-check | Task-tool dispatches catch any P0 hallucinations; patch before commit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 2 new fixture READMEs land on disk and pass sk-doc validate.
- **SC-002**: 5 existing READMEs gain TOC and pass sk-doc validate.
- **SC-003**: 0 blocking errors from `audit_readmes.py` scoped to `.opencode/skills/system-skill-advisor/`.
- **SC-004**: Phase B confirms the verification-gate addition (per Phase A lesson) catches bundle hallucinations before they reach Pass 2.
- **SC-005**: Single commit on `main` references this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cli-devin bundle hallucinates (per Phase A lesson) | Medium | Pre-Pass-2 grep-verify gate; flag and correct before Pass 2 |
| Risk | TOC insert breaks anchor balance (e.g., header levels shift) | Low | Each insert is a single bounded anchor block; verify each file post-edit |
| Risk | Fixture-folder content too thin for a useful README | Low | Use the compact CODE variant; cite the small file count explicitly |
| Risk | DeepSeek-API rate limit during Pass 2 | Low | Retry with backoff; single dispatch for 2 READMEs is small |
| Dependency | Phase A pipeline proven | Met | 035 shipped 2026-05-15 with 3 PASS READMEs |
| Dependency | sk-doc CODE template + HVR rules | Met | Same paths as Phase A |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Pass 1 wall-clock < 5 min for 2 folders (cli-devin SWE 1.6)
- **NFR-P02**: Pass 2 wall-clock < 5 min for 2 README writes (cli-opencode deepseek-v4-pro)
- **NFR-P03**: TOC insertion across 5 files < 1 min (mechanical Edit)
- **NFR-P04**: validate_document.py per README < 2 sec each

### Quality
- **NFR-Q01**: Each README HVR score >= 85
- **NFR-Q02**: No em dashes, no semicolons, no banned phrases per HVR rules
- **NFR-Q03**: Anchor-pair balance verified; no orphan opens or closes

### Reproducibility
- **NFR-R01**: Pass 1 + Pass 2 dispatch logs persisted under `research/dispatch-logs/`
- **NFR-R02**: Verification-gate transcript captured in `research/bundle-verification.md`
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **EC-001**: cli-devin returns empty bundle for one fixture folder → log gap, fall back to direct main-agent authoring for that one file
- **EC-002**: deepseek skips mandatory anchor → run `validate_document.py --fix --dry-run`, apply manually
- **EC-003**: TOC insert lands above frontmatter by mistake → assert frontmatter on lines 1-N before insert
- **EC-004**: Bundle verification gate flags hallucination → correct bundle JSON in place, then run Pass 2
- **EC-005**: Fixture folder has 0 source files → skip with a one-line README and an explicit note (acceptable per sk-doc compact variant)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

None. Scope, dispatch, and verification questions resolved at planning time.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Resource Map**: See `resource-map.md`
- **Phase A predecessor**: `../../005-code-graph/017-code-folder-readmes/`
<!-- /ANCHOR:related-docs -->
