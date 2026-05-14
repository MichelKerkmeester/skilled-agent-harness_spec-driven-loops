---
title: "System Spec Kit Codegraph Residue Audit"
description: "Audit packet for post-014 user-facing system-spec-kit documentation residue after code-graph ownership moved to the standalone system-code-graph skill."
trigger_phrases:
  - "012 system spec kit codegraph residue audit"
  - "system spec kit code graph residue"
  - "post 014 code graph docs cleanup"
  - "system-code-graph extraction audit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/014-system-code-graph-extraction/012-system-spec-kit-codegraph-residue-audit"
    last_updated_at: "2026-05-14T17:35:44Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-012"
    recent_action: "Audited and validated system-spec-kit user-facing docs for stale code-graph ownership references"
    next_safe_action: "Stage and commit the scoped 012 changes when git index writes are permitted"
    blockers:
      - "Sandbox denied git index lock creation during staging: .git/index.lock Operation not permitted"
    key_files:
      - ".opencode/skills/system-spec-kit/SKILL.md"
      - ".opencode/skills/system-spec-kit/README.md"
      - ".opencode/skills/system-spec-kit/ARCHITECTURE.md"
      - ".opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md"
      - ".opencode/skills/system-spec-kit/feature_catalog/03--discovery/04-detect-changes-preflight.md"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook/03--discovery/014-detect-changes-preflight.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-012-system-spec-kit-codegraph-residue-audit"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Raw scoped grep found 312 code-graph-related matches in system-spec-kit user-facing markdown docs before cleanup."
      - "Stale ownership/path residue was limited to root docs and catalog/playbook references that still pointed at system-spec-kit code-graph paths."
      - "Legitimate cross-skill mentions remain where startup, resume, memory, or manual validation surfaces consume stable code_graph_* and detect_changes tool IDs."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: System Spec Kit Codegraph Residue Audit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Review |
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
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/014-system-code-graph-extraction/012-system-spec-kit-codegraph-residue-audit/` | Create | Track this audit, triage, and verification. |
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
