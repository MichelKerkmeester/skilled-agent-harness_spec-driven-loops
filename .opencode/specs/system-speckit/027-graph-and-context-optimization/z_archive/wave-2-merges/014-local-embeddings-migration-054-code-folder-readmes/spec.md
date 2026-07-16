---
title: "Phase C: sk-doc-aligned READMEs for system-spec-kit code folders"
description: "Close the sk-doc gap in system-spec-kit/mcp_server: 8 git-tracked folders need new READMEs. Discovery showed 96 of 116 folders already pass sk-doc validate, so actual work is far smaller than the original 56-folder plan estimate."
trigger_phrases:
  - "054 spec"
  - "system-spec-kit code-folder readmes"
  - "Phase C code readme scoped"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/z_archive/wave-2-merges/014-local-embeddings-migration-054-code-folder-readmes"
    last_updated_at: "2026-05-15T12:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded Phase C packet after scope-discovery reduction"
    next_safe_action: "Dispatch cli-devin Pass 1"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/.github/hooks/"
      - ".opencode/skills/system-spec-kit/mcp_server/data/"
      - ".opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/advisor-fixtures/"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/description/fixtures/"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/fixtures/council-value/"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/fixtures/council-value/data/"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/validation/fixtures/"
    session_dedup:
      fingerprint: "sha256:e1b604e400e1222e2ff0469c696936522dc81ae8b2fe4839dc62942e0a7dfef1"
      session_id: "054-phase-c-scaffolded"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "What is the actual scope? 8 git-tracked folders need new READMEs (down from 56 in original plan)"
      - "Where did the 48 folders go? 96 of 116 already pass sk-doc validate from prior packets, 12 are gitignored noise (.pytest_cache, build outputs, _archived)"
      - "What was the bundle-gate gap in Phase B? grep-only verification let through 2 P0 wrong-cwd defects. Fixed by the new 3-check gate (imports grep, exports grep, validation_commands smoke-run)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase C: sk-doc-aligned READMEs for system-spec-kit

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
| **Phase** | C of 4 |
| **Predecessors** | `005-code-graph/017-code-folder-readmes` (Phase A), `006-skill-advisor/002-code-folder-readme-coverage` (Phase B) |
| **Successor** | `014-local-embeddings-migration/055-root-readme-realignment` (Phase D) |
| **Handoff Criteria** | 8 new `README.md` files in scope folders, each sk-doc validate exit 0, strict-validate on this packet exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem

Discovery against the live tree (2026-05-15) reduced the original plan's 56-folder estimate to 8 git-tracked folders that actually need new READMEs. The other 48 reflect:

- 96 of 116 folders already have valid sk-doc READMEs from prior packets (the bulk of `mcp_server/lib/`, `handlers/`, `tools/`, etc.)
- 12 are gitignored noise: `.pytest_cache`, build outputs, `_archived`, embedding caches, test-stress directories that exist transiently
- 1 has an invalid README (`.pytest_cache/v` — gitignored, out of scope)

### Target folders (8)

| Folder | Type |
|--------|------|
| `.github/hooks/` | Git hook scripts |
| `data/` | MCP server config data |
| `matrix_runners/templates/` | Matrix runner templates |
| `tests/advisor-fixtures/` | Advisor test fixtures |
| `tests/description/fixtures/` | Description module test fixtures |
| `tests/fixtures/council-value/` | Council-value test fixtures (parent) |
| `tests/fixtures/council-value/data/` | Council-value test data |
| `tests/validation/fixtures/` | Validation test fixtures |

### Purpose

Close the gap using the proven 2-pass cli-devin + cli-opencode pipeline with the new 3-check verification gate (`feedback_bundle_gate_smoke_run`).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Author 8 new sk-doc-aligned `README.md` files
- 8 context bundles under `research/context-bundles/`
- 3-check verification gate per bundle: imports grep, exports grep, validation_commands smoke-run
- Per-README sk-doc validate
- Strict-validate on this packet
- Sonnet @markdown + @review double-check

### Out of Scope

- Folders with valid sk-doc READMEs (96 of 116 in `system-spec-kit/mcp_server/`)
- Gitignored noise (`.pytest_cache`, `_archived`, build outputs)
- Phase D (root README realignment) — separate packet
- Refactoring existing READMEs that already pass validate

### Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/.github/hooks/README.md` | Create | Git hook scripts documentation |
| `.opencode/skills/system-spec-kit/mcp_server/data/README.md` | Create | MCP server config data documentation |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/templates/README.md` | Create | Matrix runner templates documentation |
| `.opencode/skills/system-spec-kit/mcp_server/tests/advisor-fixtures/README.md` | Create | Advisor fixture documentation |
| `.opencode/skills/system-spec-kit/mcp_server/tests/description/fixtures/README.md` | Create | Description fixture documentation |
| `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/council-value/README.md` | Create | Council-value fixture parent documentation |
| `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/council-value/data/README.md` | Create | Council-value data documentation |
| `.opencode/skills/system-spec-kit/mcp_server/tests/validation/fixtures/README.md` | Create | Validation fixture documentation |
| `research/context-bundles/*.json` | Create (8) | Pass 1 output bundles |
| `research/bundle-verification.md` | Create | 3-check gate transcript |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 8 target folders have a README.md | `ls` confirms 8 files; each > 1000 bytes |
| REQ-002 | Each README passes sk-doc validate | `validate_document.py --type readme` exits 0 |
| REQ-003 | Each README contains 4 mandatory anchors | grep confirms table-of-contents, overview, key-files-equivalent, related |
| REQ-004 | Each README has YAML frontmatter | title, description, trigger_phrases (1+) |
| REQ-005 | Strict-validate on this packet exits 0 | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Context bundles persisted | 8 JSON files, each >= 1500 bytes |
| REQ-007 | 3-check verification gate passes | imports grep + exports grep + validation_commands smoke-run per bundle |
| REQ-008 | HVR score >= 85 per README | `validate_document.py --json` returns hvr_score >= 85 |
| REQ-009 | Executor separation honored | cli-devin only SWE 1.6; deepseek only via cli-opencode |
| REQ-010 | Sonnet @markdown + @review double-check | 0 P0 outstanding before commit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 8 new READMEs on disk and PASS sk-doc validate.
- **SC-002**: 0 blocking errors from `audit_readmes.py` scoped to `system-spec-kit/mcp_server/`.
- **SC-003**: 3-check gate verified each bundle's claims and smoke-tested validation commands.
- **SC-004**: Single commit on `main` references this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cli-devin bundle hallucinates (Phase A + B precedent) | Medium | 3-check gate (new in Phase C per Phase B lesson) catches more than Phase B's 2-check gate |
| Risk | Parallel-session interference (Phase B precedent) | Medium | Commit immediately after Pass 2 + validate; do not wait |
| Risk | Some target folders contain no source files (pure data fixtures) | Low | Use compact README variant with minimal sections |
| Dependency | Phase A + B pipelines proven | Met | Both shipped 2026-05-15 |
| Dependency | sk-doc template + HVR rules | Met | Same paths as Phases A/B |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Pass 1 wall-clock < 10 min for 8 folders
- **NFR-P02**: Pass 2 wall-clock < 10 min for 8 README writes
- **NFR-P03**: validate_document.py per file < 2 sec

### Quality
- **NFR-Q01**: HVR score >= 85 per README
- **NFR-Q02**: No em dashes, semicolons, or banned HVR phrases
- **NFR-Q03**: Anchor balance verified

### Reproducibility
- **NFR-R01**: 3-check gate transcript persisted under `research/bundle-verification.md`
- **NFR-R02**: Pass 1 + Pass 2 dispatch logs persisted under `research/dispatch-logs/`
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **EC-001**: cli-devin returns empty bundle for one folder → log gap, fall back to main-agent direct authoring for that one file
- **EC-002**: bundle gate flags hallucination → correct bundle JSON in place; re-run gate before Pass 2
- **EC-003**: validation_commands smoke-test fails → fix the command; flip verified field
- **EC-004**: data-only folder (no .ts/.py source) → compact README documenting the data shape and ownership
- **EC-005**: deepseek skips a mandatory anchor → run validate --fix --dry-run, apply manually
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

None. Scope and verification questions resolved at planning time.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Resource Map**: See `resource-map.md`
- **Predecessors**: `../../005-code-graph/017-code-folder-readmes/`, `../../006-skill-advisor/002-code-folder-readme-coverage/`
<!-- /ANCHOR:related-docs -->
