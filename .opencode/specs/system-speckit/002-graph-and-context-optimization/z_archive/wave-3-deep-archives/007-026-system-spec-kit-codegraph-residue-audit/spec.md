---
title: "System Spec Kit Codegraph Residue Audit + Install/Doctor Coverage"
description: "Audit packet for post-014/024 residue: (Phase 1) user-facing system-spec-kit docs after code-graph ownership moved to system-code-graph, and (Phase 2) install-guide + master-README + /doctor:mcp install/debug + .vscode/mcp.json coverage gaps for mk_code_index and mk_skill_advisor."
trigger_phrases:
  - "012 system spec kit codegraph residue audit"
  - "system spec kit code graph residue"
  - "post 014 code graph docs cleanup"
  - "system-code-graph extraction audit"
  - "system-code-graph install guide"
  - "mk-code-index doctor coverage"
  - "vscode mcp.json broken launcher"
  - "mk_skill_advisor doctor mcp install"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-026-system-spec-kit-codegraph-residue-audit"
    last_updated_at: "2026-05-15T13:00:00Z"
    last_updated_by: "main-agent-026-phase2"
    recent_action: "phase2_patches_landed"
    next_safe_action: "commit_when_green"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/INSTALL_GUIDE.md"
      - ".opencode/install_guides/README.md"
      - ".opencode/commands/doctor/scripts/mcp-doctor.sh"
      - ".opencode/commands/doctor/assets/doctor_mcp_install.yaml"
      - ".opencode/commands/doctor/assets/doctor_mcp_debug.yaml"
      - ".opencode/commands/doctor/mcp.md"
      - ".vscode/mcp.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-15-026-residue-audit-phase2"
      parent_session_id: "2026-05-14-012-system-spec-kit-codegraph-residue-audit"
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Phase 1 (audit) closed 2026-05-14 with 312 raw matches triaged into 4 buckets."
      - "Phase 2 added: skill-level INSTALL_GUIDE.md authored; cross-link to SET-UP - Code Graph.md."
      - "Phase 2 added: master install README §7.1/§7.3/§10.4/§10.5/§19 patched + aggregate counts reconciled."
      - "Phase 2 added: mcp-doctor.sh + install/debug YAML + mcp.md updated for mk_code_index + mk_skill_advisor."
      - "Phase 2 added: .vscode/mcp.json broken launcher fixed; mk_skill_advisor block inserted."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: System Spec Kit Codegraph Residue Audit + Install/Doctor Coverage (Phase 2)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress (Phase 2 added 2026-05-15) |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 014 moved code-graph ownership out of `system-spec-kit` into the standalone `.opencode/skills/system-code-graph/` skill. User-facing system-spec-kit docs still contained a mixture of correct cross-skill runtime mentions and stale ownership/path claims, including old `mcp_server/code_graph` paths and prose describing Code Graph as a system-spec-kit subsystem.

### Purpose

Audit the scoped user-facing docs, rewrite stale ownership/path references to the sibling skill, preserve legitimate historical and cross-skill mentions, and document the triage.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Search system-spec-kit user-facing markdown docs: root docs, `references/`, `feature_catalog/`, and `manual_testing_playbook/`.
- Rewrite stale root-doc ownership claims from "system-spec-kit owns Code Graph" to "system-code-graph owns Code Graph."
- Rewrite stale source and database paths from system-spec-kit code-graph locations to `.opencode/skills/system-code-graph/`.
- Preserve historical feature/playbook records and legitimate cross-skill runtime references.
- Create this 012 Level 1 packet and validation evidence.

### Out of Scope

- Changes to `.opencode/skills/system-code-graph/`.
- Changes to packet 014 docs or any parallel packet folder.
- Source code, generated JavaScript, TypeScript, MCP processes, or live child restarts.
- Spec-kit memory code-graph DB environment variables such as `SPECKIT_CODE_GRAPH_DB_DIR`, which are legitimate cross-skill plumbing.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/SKILL.md` | Modify | Redirect structural-routing prose to the sibling `system-code-graph` skill. |
| `.opencode/skills/system-spec-kit/README.md` | Modify | Replace the embedded Code Graph package section with cross-skill integration guidance. |
| `.opencode/skills/system-spec-kit/ARCHITECTURE.md` | Modify | Remove stale subsystem ownership narrative and describe extracted integration boundaries. |
| `.opencode/skills/system-spec-kit/feature_catalog/**/*.md` | Modify | Rewrite stale code-graph package paths and broken post-extraction references. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/**/*.md` | Modify | Rewrite stale code-graph package and DB paths in retained historical/manual scenarios. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/005-code-graph/026-system-spec-kit-codegraph-residue-audit/` | Create | Track this audit, triage, and verification. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Do not include the standalone system-code-graph skill in this packet | `git diff --cached --name-only` for the staged commit contains no `.opencode/skills/system-code-graph/` paths. |
| REQ-002 | Stale system-spec-kit code-graph ownership/path residue is removed or redirected | Stale-residue grep for old `mcp_server/code_graph`, old DB paths, old MCP namespace, and "code-graph subsystem" wording exits with no matches in scoped markdown docs. |
| REQ-003 | Legitimate historical and cross-skill references are preserved | Remaining raw matches are documented in `implementation-summary.md` as historical or cross-skill, not stale residue. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Packet docs capture the 4-bucket triage | `implementation-summary.md` includes counts for STALE_REMOVE, STALE_REWRITE, LEGITIMATE_HISTORICAL, and LEGITIMATE_CROSS_SKILL. |
| REQ-005 | Packet validation passes | `validate.sh --strict` exits 0 for this 012 packet. |
| REQ-006 | Commit when sandbox allows git index writes | Commit SHA is recorded, or `COMMIT_SHA=uncommitted` is reported when staging/commit is blocked. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Stale Code Graph ownership claims are gone from root system-spec-kit docs.
- **SC-002**: Stale package and DB paths under system-spec-kit are gone from scoped markdown docs.
- **SC-003**: Remaining code-graph mentions are intentional historical records or cross-skill integration references.
- **SC-004**: This packet validates strictly and can be committed alone with the scoped doc edits.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Broad manual playbook and feature catalog surfaces | Easy to over-delete useful historical scenarios. | Rewrite stale paths and ownership claims; preserve shipped feature records. |
| Risk | Parallel dirty worktree changes | Accidental commit pollution. | Stage only the 012 packet and the specific source docs edited for this audit. |
| Dependency | Current code-graph package layout | Redirects need accurate paths. | Verified current sibling package paths under `.opencode/skills/system-code-graph/mcp_server/`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:phase2 -->
## 8. PHASE 2 — INSTALL GUIDE + DOCTOR COVERAGE (added 2026-05-15)

### Problem Statement

Phase 1 audited user-facing docs INSIDE `system-spec-kit/` for stale code-graph ownership. A follow-on audit surfaced the inverse problem: `system-code-graph` itself plus the cross-runtime install/doctor surfaces have **gaps that prevent end users from discovering, installing, and diagnosing the `mk_code_index` MCP server**. The parallel skill `mk_skill_advisor` has the same omissions in `mcp-doctor.sh` and `.vscode/mcp.json`.

### In Scope (Phase 2)

- Create `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` (sk-doc `skill_reference_install_guide` template; ~13 KB; cross-link to `SET-UP - Code Graph.md`).
- Patch `.opencode/install_guides/README.md`: add `mk-code-index` and `mk_skill_advisor` to §7.1 Component Matrix, §7.3 Installation Bundles, new §10.4 + §10.5 Phase 3 subsections, §19 Setup Guides table, and reconcile aggregate counts (lines 17, 58, 73, 1440).
- Patch `.opencode/commands/doctor/scripts/mcp-doctor.sh`: add `diagnose_mk_code_index()` + `diagnose_mk_skill_advisor()`, update enumeration and dispatch, fix line-533 hyphen typo (`diagnose_mk-spec-memory` → `diagnose_mk_spec_memory`).
- Patch `.opencode/commands/doctor/assets/doctor_mcp_install.yaml` + `doctor_mcp_debug.yaml`: extend `valid_values`, add server-definition blocks and repair_actions, update install_guides map and report_format rows.
- Patch `.opencode/commands/doctor/mcp.md`: update help copy from "all 4 MCP servers" to "all 6 MCP servers", add invocation examples for the two new servers.
- Patch `.vscode/mcp.json`: rename `system_code_graph` → `mk_code_index`, fix launcher path to `mk-code-index-launcher.cjs`, replace `_NOTE_1_TOOLS` with `_NOTE_1_DB` / `_NOTE_2_TOOLS` / `_NOTE_3_INDEX_DEFAULTS` convention, insert missing `mk_skill_advisor` block. Final order: sequential_thinking, mk-spec-memory, mk_skill_advisor, mk_code_index, cocoindex_code, code_mode.

### Out of Scope (Phase 2)

- `.opencode/install_guides/SET-UP - Code Graph.md` content drift (separate follow-on).
- `mk-spec-memory`, `cocoindex_code`, `code_mode`, `sequential_thinking` coverage (already complete).
- Hook wiring for `mk_code_index` (covered by `/doctor:update`).
- Any deep-review remediation work from prior packets.

### Phase 2 Requirements

#### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | `system-code-graph` has a skill-level INSTALL_GUIDE.md with the sk-doc template marker | `test -f .opencode/skills/system-code-graph/INSTALL_GUIDE.md && grep -c '<!-- sk-doc-template: skill_reference_install_guide -->' .opencode/skills/system-code-graph/INSTALL_GUIDE.md` returns 1. |
| REQ-008 | `.vscode/mcp.json` no longer references the deleted `system-code-graph-launcher.cjs` | `grep -c 'system-code-graph-launcher' .vscode/mcp.json` returns 0; `grep -c 'mk-code-index-launcher.cjs' .vscode/mcp.json` returns 1. |
| REQ-009 | `/doctor:mcp install --server mk_code_index` and `--server mk_skill_advisor` pass argument validation | The `valid_values` lists in both `doctor_mcp_install.yaml` and `doctor_mcp_debug.yaml` include both names. |

#### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Master install README covers `mk_code_index` in §7.1, §7.3, and a dedicated §10.x | `grep -n 'mk-code-index\|mk_code_index' .opencode/install_guides/README.md` returns hits in each of these section line ranges. |
| REQ-011 | `bash .opencode/commands/doctor/scripts/mcp-doctor.sh --server mk_code_index --json` runs and produces JSON output | Exit code is 0/1/2 (not "Unknown option"); stdout starts with `{` or contains a `checks` array. |
| REQ-012 | All 6 runtime configs reference `mk_code_index` | The cross-runtime grep in the verification block returns ≥1 hit for each of: opencode.json, .claude/mcp.json, .codex/config.toml, .gemini/settings.json, .devin/config.json, .vscode/mcp.json. |
| REQ-013 | Packet validation passes | `validate.sh --strict` exits 0. |

### Phase 2 Success Criteria

- **SC-005**: A user reading the master install README can find an explicit `mk-code-index` Phase 3 subsection and follow it to a working installation.
- **SC-006**: `/doctor:mcp install` and `/doctor:mcp debug` interactive menus list 6 servers and accept `mk_code_index` / `mk_skill_advisor` as `--server` values.
- **SC-007**: Opening the project in VSCode no longer fails to start the code-graph MCP server due to the deleted launcher.
- **SC-008**: A maintainer can run `bash .opencode/skills/system-code-graph/node_modules/.bin/tsc --build` and use `mk_code_index.code_graph_status({})` end-to-end after following only the new INSTALL_GUIDE.md.
<!-- /ANCHOR:phase2 -->
