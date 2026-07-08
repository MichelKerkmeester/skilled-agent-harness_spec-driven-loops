---
title: "Feature Specification: sk-doc smart router stress test (15 scenarios x 3 CLIs = 45 cell matrix)"
description: "Phase parent for sk-doc smart router stress test (15 scenarios x 3 CLIs = 45 cell matrix)"
trigger_phrases:
  - "071-sk-doc-router-stress-test"
  - "sk-doc router stress test phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/008-sk-doc-router-stress-test"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: sk-doc smart router stress test (15 scenarios x 3 CLIs = 45 cell matrix)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/071-sk-doc-router-stress-test |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | All 4 phase children pass `validate.sh --strict`; matrix.csv + review-report.md ship clean to main; if P0/P1 findings present, follow-up packet ID surfaced (NOT auto-created) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-doc has a smart router (§2 of SKILL.md) with INTENT_MODEL, RESOURCE_MAP, score_intents(), select_intents() — but NO manual_testing_playbook to verify it works correctly across model interpretations. Each external CLI (codex, copilot, gemini, opencode, claude-code) loads sk-doc via a different LLM, and there's no comparative data showing which model is most efficient/accurate/cost-effective at consuming sk-doc's router output. Packet 068 just shipped a router-adjacent reorg; this is a good moment to baseline router behavior across CLIs before further router changes land.

### Purpose
Author NEW manual_testing_playbook for sk-doc (15 scenarios, 5 categories) and run a 45-cell test matrix (15 scenarios × 3 CLIs: cli-codex, cli-opencode). Capture 3 metric dimensions per cell (efficiency, accuracy, token usage). Surface P0/P1/P2 findings into review-report.md. Remediation deferred to follow-up packet if findings warrant. Pure observational test — no router code changes in this packet.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `.opencode/skills/sk-doc/manual_testing_playbook/` with 15 scenarios across 5 categories
- Execute 45 dispatches (3 CLIs × 15 scenarios) with concurrency cap ≤3 per CLI
- Capture 3 metrics per cell: efficiency (wall-clock, tool calls, refs loaded), accuracy (intent picked, false-positive ref load, outcome correctness), token usage (CLI-specific normalized to USD)
- Build matrix.csv companion (45 rows × ~10 cols)
- Author review-report.md with verdict + P0/P1/P2 findings registry
- Recommend follow-up packet ID if P0/P1 findings warrant remediation

### Out of Scope (locked)
- Router code changes (sk-doc/SKILL.md unmodified — observational only)
- cli-gemini and cli-claude-code (user picked 3-CLI subset)
- `barter/coder/`, `z_archive/`, `.opencode/specs/**` historical records
- Build artifacts (`.tmp/`, `dist/`, `observability/*.jsonl`)
- Cross-phase remediation work (deferred to follow-up packet)

### Files to Change (aggregate)

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/manual_testing_playbook/01--intent-detection/` | Create | 001 | 3 scenarios |
| `.opencode/skills/sk-doc/manual_testing_playbook/02--resource-loading/` | Create | 001 | 3 scenarios |
| `.opencode/skills/sk-doc/manual_testing_playbook/03--unknown-fallback/` | Create | 001 | 3 scenarios |
| `.opencode/skills/sk-doc/manual_testing_playbook/04--cross-cli-dispatch/` | Create | 001 | 3 scenarios |
| `.opencode/skills/sk-doc/manual_testing_playbook/05--token-cost-baseline/` | Create | 001 | 3 scenarios |
| `.opencode/skills/sk-doc/manual_testing_playbook/manual_testing_playbook.md` | Create | 001 | Index |
| `071/002-matrix-execute/deltas/{codex,copilot,opencode}.jsonl` | Create | 002 | Per-CLI delta logs |
| `071/002-matrix-execute/logs/<scenario-id>/{codex,copilot,opencode}.log` | Create | 002 | Per-cell stdout/stderr |
| `071/003-synthesize/matrix.csv` | Create | 003 | 45-row data table |
| `071/003-synthesize/review-report.md` | Create | 003 | Findings + verdict |
| Spec folder docs | Modify/Create | All | Per-phase spec/plan/tasks/impl-summary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-scenario-author/ | Author NEW `.opencode/skills/sk-doc/manual_testing_playbook/` with 5 categories × 3 scenarios = 15 scenarios. Closes a real gap (sk-doc had no manual_testing_playbook before). | Pending |
| 2 | 002-matrix-execute/ | Execute 45-cell matrix: 15 scenarios × 3 CLIs (cli-codex with stdin-redirection mitigation, cli-opencode). Concurrency cap ≤3 per CLI, ≤9 total. Capture stdout/stderr/exit/wall-clock/tokens per cell. | Pending |
| 3 | 003-synthesize/ | Build matrix.csv (45 rows × ~10 cols). Author review-report.md with verdict (PASS/CONDITIONAL/FAIL) + per-CLI ranked summary + P0/P1/P2 findings registry. If P0/P1, recommend follow-up packet ID for remediation. | Pending |
| 4 | 004-closeout/ | validate.sh --strict (must exit 0); graph-metadata refresh; implementation-summary per child + parent; final commit on main. | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-scenario-author | 002-matrix-execute | 15 scenario .md files authored across 5 categories; manual_testing_playbook.md index shipped; commit on main | `ls manual_testing_playbook/` shows 5 dirs each with 3 .md files + index.md |
| 002-matrix-execute | 003-synthesize | 45 cells executed; per-CLI delta JSONL files complete; per-scenario logs/ populated | `wc -l deltas/*.jsonl` shows 45 entries total; `ls logs/*/` shows 3 .log files per scenario |
| 003-synthesize | 004-closeout | matrix.csv + review-report.md authored; P0/P1/P2 findings classified | `test -f matrix.csv && test -f review-report.md`; verdict line present in review-report.md |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None — all 5 ambiguities (Q1–Q5) resolved at packet kickoff:
- Q1=A: author NEW manual_testing_playbook
- Q2: 3-CLI subset (cli-codex + cli-copilot + cli-opencode); cli-gemini + cli-claude-code excluded
- Q3=A: all 3 metric dimensions
- Q4=C: both review-report.md + matrix.csv
- Q5=C: test + create new spec packet for any remediation
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
