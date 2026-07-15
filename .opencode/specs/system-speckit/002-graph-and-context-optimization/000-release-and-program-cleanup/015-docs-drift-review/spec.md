---
title: "Feature Specification: Documentation-Drift Review vs Session Changes (013-016 + release)"
description: "A read-only deep review that audits user-facing docs (root README, skill READMEs/SKILL.md, MCP server READMEs, feature_catalog, manual_testing_playbook) for staleness introduced by this session's shipped changes (packets 013/014/015/016 + v3.5.0.0 release) on origin/main HEAD 75cfec1700. Output is a P0/P1/P2 findings report with the exact correction each doc needs."
trigger_phrases:
  - "documentation drift review"
  - "docs stale versus shipped code"
  - "feature catalog playbook drift"
  - "mcp readme accuracy"
  - "embedder registry doc drift"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/015-docs-drift-review"
    last_updated_at: "2026-06-05T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored review packet + ran partitioned gpt-5.5 drift passes; wrote review-report.md"
    next_safe_action: "Owner triages findings into a remediation packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/feature_catalog"
      - ".opencode/skills/system-spec-kit/manual_testing_playbook"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "docs-drift-review-2026-06-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3 pre-answered: create NEW review packet at 015-docs-drift-review (authorized)."
      - "Scope excludes sk-code and sk-git docs."
---
# Feature Specification: Documentation-Drift Review vs Session Changes (013-016 + release)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-05 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This session shipped packets 013 (comprehensive-audit-remediation), 014/015 (launcher-overlap fix), 016 (mk-spec-memory launcher-ownership hardening), and a pre-existing-failure remediation, all now on `origin/main` (HEAD `75cfec1700`). User-facing documentation (root README, skill READMEs/SKILL.md, MCP server READMEs, the feature_catalog, and the manual_testing_playbook) may now describe behavior that was removed, renamed, or changed by those packets, so a reader following the docs could trust a removed feature or run a command that fails.

### Purpose
Produce a read-only P0/P1/P2 drift report that names each stale doc file:section, the exact stale claim, the change it conflicts with, and the precise correction, without editing any reviewed doc.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Read-only audit of: root `README.md`; skill `README.md`/`SKILL.md` under `.opencode/skills/*/` (excluding sk-code and sk-git); MCP server READMEs; `feature_catalog/**`; `manual_testing_playbook/**`.
- Comparison against the seven shipped change-areas from packets 013/014/015/016 + release.
- A consolidated findings report at `review/review-report.md` (verdict, counts, per-finding correction, no-drift list, coverage gaps).

### Out of Scope
- Editing any reviewed documentation - this packet outputs findings only; corrections go to a follow-on remediation packet.
- `sk-code` and `sk-git` docs - explicitly excluded by the request.
- Reviewing or changing code; running `git commit`/`push`; running `code_graph_scan`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `015-docs-drift-review/spec.md` | Create | This review-packet spec |
| `015-docs-drift-review/description.json` | Create | Generated packet metadata |
| `015-docs-drift-review/graph-metadata.json` | Create | Generated graph metadata |
| `015-docs-drift-review/review/review-report.md` | Create | P0/P1/P2 drift findings report |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No reviewed doc is edited | Final git diff shows only `015-docs-drift-review/` additions |
| REQ-002 | Findings are evidence-backed | Every finding cites doc file:section + the quoted stale string + the change it conflicts with |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Coverage is explicit | review-report.md lists checked-and-accurate areas and any coverage gaps (timed-out passes) |
| REQ-004 | Findings are conservative | Each finding ties to one of the seven change-areas with a corrected value; no invented or pre-existing-unrelated findings |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review/review-report.md` exists with a verdict (PASS/CONDITIONAL/FAIL), P0/P1/P2 counts, grouped per-doc-area findings, a no-drift list, and a coverage-gap note.
- **SC-002**: `validate.sh <folder> --strict` exits 0 for the packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | gpt-5.5-fast high via cli-opencode | Broad passes time out (exit 124) | Partition each pass to a bounded file set; pre-filter catalog/playbook by topic |
| Risk | False-positive drift (model over-reports) | Misleading corrections | Orchestrator verifies each finding against the real repo before inclusion |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None - Gate 3 pre-answered (new review packet), scope and exclusions specified in the request.
<!-- /ANCHOR:questions -->
