---
title: "Phase D: Root README realignment"
description: "Audit the project root ./README.md against current post-extraction reality (mk-spec-memory rename, mk-code-index extraction, mk-skill-advisor extraction, local-embedding migration, tool-surface trim) and surgically rewrite drifted sections via sonnet @markdown."
trigger_phrases:
  - "055 spec"
  - "root readme realignment"
  - "Phase D root readme audit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-2-merges/014-local-embeddings-migration-055-root-readme-realignment"
    last_updated_at: "2026-05-15T12:55:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded Phase D packet"
    next_safe_action: "Dispatch Pass 1 cli-devin drift audit"
    blockers: []
    key_files:
      - "README.md"
      - ".opencode/skills/system-spec-kit/SKILL.md"
      - ".opencode/skills/system-skill-advisor/SKILL.md"
      - ".opencode/skills/system-code-graph/SKILL.md"
    session_dedup:
      fingerprint: "sha256:6db3db30c8e195f8952240e8c0871020a966f6b4f8282a3156cbe28e65d89c2a"
      session_id: "055-phase-d-scaffolded"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Why is the writer different from A/B/C? Plan calls for sonnet @markdown via Task tool (not deepseek) because root README has distinct narrative voice that needs surgical preservation"
      - "How does this differ from prior Phases? 3-pass instead of 2-pass: cli-devin context + cli-opencode cross-check + sonnet writer; deepseek is the CROSS-CHECKER not the writer"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase D: Root README realignment

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
| **Parent** | `system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation` |
| **Phase** | D of 4 (final phase) |
| **Predecessors** | Phases A (007/035), B (008/024), C (014/054) all shipped |
| **Successor** | None (final phase) |
| **Handoff Criteria** | `./README.md` reflects current reality, strict-validate on this packet exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem

The project root `./README.md` was authored before several substrate changes shipped:

- `mk-spec-memory` MCP rename (commit `f91da9f1a`)
- `mk-code-index` extraction from system-spec-kit (commit `cce70914d` series)
- `mk-skill-advisor` extraction (`feedback_executor_model_separation` shipping path)
- Local-embedding model migration (014-local-embeddings-migration child packets 001-027)
- `mk-spec-memory` tool-surface trim 41 -> 39 (commit `602e4c031`)

Each of these may have introduced drift between what the README states and what the codebase now does.

### Purpose

Audit the README's factual claims (tool counts, file paths, server names, integration patterns) against current reality. Apply surgical edits ONLY to drifted sections; preserve voice and structure where claims are still correct.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit `./README.md` line-by-line for factual claims
- Build a drift inventory: claim vs current truth
- Cross-check the drift inventory with a second independent reader
- Apply surgical edits via sonnet @markdown to drifted sections only
- Preserve voice / structure / tone everywhere not drifted

### Out of Scope

- Rewriting non-drifted sections
- Adding new sections beyond what the current reality requires
- HVR voice rewrite (the root README has its own voice; HVR is for code-folder READMEs)
- Phases A/B/C work (already shipped)

### Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `./README.md` | Surgical Edit (drifted sections only) | Realign with post-extraction reality |
| `research/root-readme-context-bundle.json` | Create | Pass 1 drift inventory |
| `research/root-readme-delta-verified.md` | Create | Pass 2 cross-check verified delta |
| `research/root-readme-edit-evidence.md` | Create | Pass 3 before/after edit transcript |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Drift inventory built from current README + 3 SKILL.md + recent commits | `research/root-readme-context-bundle.json` exists and lists each claim |
| REQ-002 | Drift inventory cross-checked | `research/root-readme-delta-verified.md` exists with confirmed/refuted/added items |
| REQ-003 | Drifted sections rewritten by sonnet @markdown | Edit evidence captured; remaining claims accurate |
| REQ-004 | Non-drifted sections untouched | git diff shows surgical edits only |
| REQ-005 | Strict-validate on packet exits 0 | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Executor separation honored | cli-devin only SWE 1.6; deepseek only via cli-opencode; @markdown only via Task tool |
| REQ-007 | All edit evidence captured | `research/root-readme-edit-evidence.md` shows before/after per drifted section |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `./README.md` reflects current reality across all 5 drift surfaces (mk-spec-memory rename, mk-code-index/mk-skill-advisor extractions, local-embedding migration, tool-surface trim).
- **SC-002**: Non-drifted sections are byte-identical to pre-edit state.
- **SC-003**: Edit evidence is complete and auditable.
- **SC-004**: Single commit on `main` references this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Sonnet @markdown homogenizes the root README's voice | Medium | Explicit prompt: scoped edits only; preserve voice where not drifted |
| Risk | Drift inventory misses subtle claims (e.g., counts, dates) | Medium | Cross-check pass catches what Pass 1 missed |
| Risk | False-positive drift (a claim Pass 1 thinks is wrong but is actually still true) | Low | Pass 2 cross-check catches Pass 1 over-flagging |
| Risk | Parallel-session interference (Phase B precedent) | Low | Commit immediately after Pass 3 + validate |
| Dependency | Phases A/B/C shipped | Met | All three closed 2026-05-15 |
| Dependency | sonnet @markdown via Task tool | Met | Phase A used sonnet @markdown + @review |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Pass 1 wall-clock < 5 min
- **NFR-P02**: Pass 2 wall-clock < 5 min
- **NFR-P03**: Pass 3 sonnet @markdown wall-clock < 10 min

### Quality
- **NFR-Q01**: Edit count is minimal; non-drifted sections byte-identical to baseline
- **NFR-Q02**: Voice + structure preserved
- **NFR-Q03**: All claims verifiable against current source

### Reproducibility
- **NFR-R01**: All 3 pass artifacts persisted under `research/`
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **EC-001**: Pass 1 finds 0 drift → Pass 2 confirms 0 drift → Phase D commits a note rather than no-change (audit-only commit)
- **EC-002**: Sonnet @markdown rewrites a non-drifted section → reject and re-dispatch with tighter scope
- **EC-003**: A drift is irrecoverable in current commit reach (e.g., the README cites a deleted file) → document and propose follow-on cleanup
- **EC-004**: Pass 2 disagrees with Pass 1 on a specific drift item → record both views in `root-readme-delta-verified.md`; user adjudicates if needed (default: keep Pass 2 view since it's the independent reader)
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

None. Pipeline and scope resolved at planning time.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Resource Map**: See `resource-map.md`
- **Predecessors**: `../../005-code-graph/017-code-folder-readmes/`, `../../006-skill-advisor/002-code-folder-readme-coverage/`, `../054-code-folder-readmes/`
<!-- /ANCHOR:related-docs -->
