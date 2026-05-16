---
title: "Phase A: sk-doc-aligned READMEs for 3 system-code-graph code folders"
description: "Fill the 3 README gaps in system-code-graph (mcp_server root + core/ + plugin_bridges/) using a two-pass cli-devin (SWE 1.6 context) + cli-opencode (deepseek-v4-pro markdown) pipeline. Proof-of-concept for the larger Phases B/C/D."
trigger_phrases:
  - "035 spec"
  - "system-code-graph code-folder readmes"
  - "Phase A code readme proof-of-concept"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/017-code-folder-readmes"
    last_updated_at: "2026-05-15T08:50:00Z"
    last_updated_by: "main_agent"
    recent_action: "Scaffolded Phase A packet for 3-folder PoC of the cli-devin + cli-opencode README pipeline"
    next_safe_action: "Dispatch cli-devin SWE 1.6 Pass 1 over the 3 target folders"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/"
      - ".opencode/skills/system-code-graph/mcp_server/core/"
      - ".opencode/skills/system-code-graph/mcp_server/plugin_bridges/"
    session_dedup:
      fingerprint: "sha256:df353d82031ebf136badb831742343ac288b2e440f1e2d39cab449dd43aef72f"
      session_id: "035-phase-a-scaffolded"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "What is the validation gate? sk-doc validate_document.py per README + strict-validate on the packet"
      - "Where do context bundles live? research/context-bundles/<folder-slug>.json"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Phase A: sk-doc-aligned READMEs for system-code-graph

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
| **Parent** | `system-spec-kit/026-graph-and-context-optimization/007-code-graph` |
| **Phase** | A of 4 (proof-of-concept) |
| **Successor** | `008-skill-advisor/002-code-folder-readmes` |
| **Handoff Criteria** | 3 new `README.md` files in scope folders, each sk-doc-compliant per `validate_document.py --type readme` exit 0, strict-validate on this packet exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem

Three code folders under `.opencode/skills/system-code-graph/mcp_server/` ship without a README:

1. `mcp_server/` (the root of the extracted system-code-graph package itself)
2. `mcp_server/core/`
3. `mcp_server/plugin_bridges/`

The structural inconsistency degrades the smart router's ability to surface the right docs (the cocoindex_code semantic-search lane + the memory-retrieval channels both index README anchored sections) and onboarding contributors lose the quick map of each folder's responsibility. The companion `dist/` folder is gitignored build output and stays out of scope.

### Purpose

Author 3 sk-doc-aligned READMEs (CODE template, 9 anchored sections, YAML frontmatter, HVR-compliant prose) using a two-pass cli-devin + cli-opencode pipeline. This phase is the proof-of-concept for the larger Phases B (9 folders), C (56 folders), and D (root README realignment).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Write `README.md` in 3 target folders: `mcp_server/`, `mcp_server/core/`, `mcp_server/plugin_bridges/`
- Each README follows `.opencode/skills/sk-doc/assets/readme/readme_code_template.md` (CODE template)
- Pass 1 dispatch: cli-devin with `--model swe-1.6 --permission-mode normal` over the 3 folders
- Pass 2 dispatch: cli-opencode with `--model deepseek/deepseek-v4-pro --variant high --agent general`
- Per-README validation via `python3 .opencode/skills/sk-doc/scripts/validate_document.py <path> --type readme`
- Persist 3 context bundles under `research/context-bundles/` as audit trail

### Out of Scope

- `mcp_server/dist/` (gitignored build output)
- Folders that already ship sk-doc-compliant READMEs (handlers/, lib/, lib/utils/, tests/, stress_test/code-graph/, tools/)
- Phases B/C/D — separate L2 packets
- HVR auto-fix beyond what `validate_document.py --fix --dry-run` suggests; structural fixes are manual

### Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-code-graph/mcp_server/README.md` | Create | Root README for the extracted system-code-graph package |
| `.opencode/skills/system-code-graph/mcp_server/core/README.md` | Create | core/ folder responsibility, key files, entrypoints |
| `.opencode/skills/system-code-graph/mcp_server/plugin_bridges/README.md` | Create | plugin_bridges/ responsibility, boundary with handlers/ |
| `research/context-bundles/mcp_server-root.json` | Create | Pass 1 output: file inventory + exports for root |
| `research/context-bundles/core.json` | Create | Pass 1 output for core/ |
| `research/context-bundles/plugin_bridges.json` | Create | Pass 1 output for plugin_bridges/ |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 3 target folders have a `README.md` | `ls` confirms files exist; bytes > 1000 each |
| REQ-002 | Each README passes sk-doc validate | `validate_document.py --type readme` exits 0 for each |
| REQ-003 | Each README contains the 4 mandatory anchors | `table-of-contents`, `overview`, `key-files`, `related` anchor pairs present in each (verified via grep) |
| REQ-004 | Each README has YAML frontmatter | `title`, `description`, `trigger_phrases` (1+ entries) present |
| REQ-005 | Strict-validate on this packet exits 0 | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Context bundles persisted | 3 JSON files under `research/context-bundles/`, each ≥ 1500 bytes |
| REQ-007 | HVR score ≥ 85 per README | `validate_document.py --json` returns `hvr_score >= 85` |
| REQ-008 | Executor separation honored | cli-devin only runs SWE 1.6; deepseek-v4-pro only via cli-opencode |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 target folders have a sk-doc-compliant README on disk.
- **SC-002**: 0 blocking errors from `validate_document.py` for any of the 3 READMEs.
- **SC-003**: 0 blocking errors from `audit_readmes.py` scoped to `.opencode/skills/system-code-graph/`.
- **SC-004**: Phase A serves as the pipeline-shape proof for Phases B/C/D — any pipeline failures here block downstream dispatch.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cli-devin SWE 1.6 produces malformed JSON bundles | High (blocks Pass 2) | Phase A as PoC; if Pass 1 fails, fall back to cli-codex gpt-5.5 high for context gathering |
| Risk | deepseek-v4-pro skips required anchors | Medium | `validate_document.py --fix --dry-run` auto-suggests; manual structural fix if needed |
| Risk | HVR violations (em dashes, banned phrases) | Low | Pass 2 prompt explicitly cites HVR rules; per-README HVR score check post-write |
| Dependency | cli-devin authenticated + reachable | Met | `devin auth status` confirms authenticated |
| Dependency | cli-opencode + DeepSeek API key | Met | Proven working pattern this session |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Pass 1 wall-clock < 5 min for 3 folders (cli-devin SWE 1.6)
- **NFR-P02**: Pass 2 wall-clock < 5 min for 3 README writes (cli-opencode deepseek-v4-pro)
- **NFR-P03**: validate_document.py per README < 2 sec each

### Quality
- **NFR-Q01**: Each README HVR score >= 85 (per template_rules.json pass bar)
- **NFR-Q02**: No em dashes, no semicolons, no banned phrases per HVR rules
- **NFR-Q03**: Anchor-pair balance verified by sk-doc validator (no orphan opens or closes)

### Reproducibility
- **NFR-R01**: Pass 1 + Pass 2 dispatch logs persisted under `research/dispatch-logs/`
- **NFR-R02**: Pre-existing exemplar READMEs cited verbatim in Pass 2 prompt for shape parity
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Pipeline failures
- **EC-001**: cli-devin returns empty bundle for a folder → log gap, fall back to cli-codex gpt-5.5 high for that one folder
- **EC-002**: deepseek-v4-pro skips a mandatory anchor → run `validate_document.py --fix --dry-run`, apply suggested fix manually
- **EC-003**: HVR score < 85 → re-dispatch Pass 2 for that single README with stricter voice instructions

### Folder content boundaries
- **EC-004**: `core/` has only 1 source file → use the compact README variant (utils-style)
- **EC-005**: `plugin_bridges/` content unknown until Pass 1 — README structure adapts to bundle output
- **EC-006**: `mcp_server/` root has 4+ files including `index.ts` + `tool-schemas.ts` — use the full 9-section scaffold
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

None. All scope, dispatch, and verification questions resolved at planning time.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Resource Map**: See `resource-map.md`
<!-- /ANCHOR:related-docs -->
