---
title: "Feature Specification: 17-skill README refinement survey + remediation"
description: "cli-devin SWE 1.6 audited the 17 non-system skill READMEs for em dashes, §1 tables, banned words/phrases, cross-skill coupling, and frontmatter drift; then autonomously remediated 17 READMEs across 4 parallel waves to zero §1 tables and zero em dashes."
trigger_phrases:
  - "006 skill readme refinement"
  - "cli-devin 17-skill audit"
  - "zero section 1 tables remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-docs/006-skill-readme-refinement-survey"
    last_updated_at: "2026-05-16T13:25:00Z"
    last_updated_by: "main_agent"
    recent_action: "Shipped audit and 4-wave cli-devin remediation"
    next_safe_action: "Strict-validate and commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0060000000000000000000000000000000000000000000000000000000000006"
      session_id: "006-skill-readme-refinement-scaffold"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Scope? Full Phases A through D, autonomous via cli-devin"
      - "Concurrency? Waves of 4 parallel dispatches"
      - "Section 1 table policy? Strict zero across all 17"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 17-Skill README Refinement Survey

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Parent** | `005-docs` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 005 (`a1a1ca9d3`) refined the 3 system-* skill READMEs. The 17 OTHER skill READMEs (cli-*, deep-*, mcp-*, sk-*) carried the same kinds of drift: tables in §1 OVERVIEW that fragment the reader's first impression, em dashes scattered through the body, and (potentially) banned words or banned phrases. A spot-check before the audit showed 15 of 17 READMEs had ≥19 table rows in §1 and 9 had em dashes (cli-devin alone with 29).

### Purpose
Apply the same packet-005 refinement lens to all 17 skill READMEs. Use cli-devin SWE 1.6 for both the audit and the remediation. Hold to a strict zero-table rule in §1 OVERVIEW.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Phase A: single cli-devin audit dispatch produces `research/audit-report.{json,md}` covering 17 READMEs
- Phase C: 4 parallel waves of cli-devin remediation dispatches (4+4+4+3 = 15 remediations; sk-git and sk-prompt audit-marked "none" but turned out to need remediation too)
- All 17 READMEs end at em=0, §1 tables=0
- Phase D: this tracked packet (Level 1 lean trio + plan/tasks/impl-summary), strict-validate, commit

### Out of Scope
- Source code changes in any skill's `mcp_server/` runtime
- ARCHITECTURE.md changes (no skill outside system-* has one)
- SKILL.md changes (separate template + lint cycle)
- HVR deep rewrites beyond em-dash + §1-table + banned-word cleanup
- Cross-skill refs that are legitimate (sibling CLI comparisons in Related sections, consumer dependencies)

### Files to Change

17 README files at `.opencode/skills/<skill>/README.md`:

cli-claude-code, cli-codex, cli-devin, cli-gemini, cli-opencode,
deep-agent-improvement, deep-ai-council, deep-research, deep-review,
mcp-chrome-devtools, mcp-coco-index, mcp-code-mode,
sk-code-review, sk-code, sk-doc, sk-git, sk-prompt.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every audited README has 0 tables in §1 OVERVIEW | `awk '/^## 1\\./,/^## 2\\./' README.md \| grep -c '^\|'` returns 0 for each of the 17 |
| REQ-002 | Every audited README has 0 em dashes | `grep -c '—' README.md` returns 0 for each of the 17 |
| REQ-003 | Strict-validate child 006 exits 0 | `validate.sh --strict` exits 0 |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Audit report committed | `research/audit-report.{json,md}` present |
| REQ-005 | Per-skill remediation prompts + recipes preserved | `research/prompts/remediation-*.md` and `agent-config-remediation-*.json` files committed for audit trail |
| REQ-006 | All cli-devin logs preserved | `research/logs/devin-*.log` per dispatch |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 17 skill READMEs end at em=0, §1 tables=0.
- **SC-002**: Audit report grep-verifiable for every cited finding.
- **SC-003**: cli-devin dispatches use waves of ≤4 parallel per `feedback_cli_dispatch_unreliability`.
- **SC-004**: Strict-validate exit 0 for child 006.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Audit hallucinates findings or misses tables | Medium | Bundle verification gate; followup retry pass for false negatives |
| Risk | Devin rejects tool call mid-dispatch | Low | Retry serially with same recipe |
| Risk | Parallel dispatch failures per `feedback_cli_dispatch_unreliability` | Low | Practical ceiling of 4 per wave |
| Risk | Audit misses tables that ARE §1 tables (false negative) | Realized | sk-git, sk-prompt, mcp-coco-index needed v2 retry pass |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Operating rules locked at plan time.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Plan**: See `plan.md`
- **Tasks**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Predecessor**: `005-cross-skill-documentation-decoupling/` (carrying the same refinement lens)
- **Audit artifacts**: `research/audit-report.{json,md}` and per-skill `research/prompts/` + `research/logs/`
<!-- /ANCHOR:related-docs -->
