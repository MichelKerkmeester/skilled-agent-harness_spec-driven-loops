---
title: "Feature Specification: Phase 3: synthesize"
description: "Extract metrics from 45 raw cell logs into matrix.csv; author review-report.md with verdict + per-CLI rankings + P0/P1/P2 findings."
trigger_phrases: ["071/003", "synthesize"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/008-sk-doc-router-stress-test/003-synthesize"
    last_updated_at: "2026-05-05T15:35:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 3 complete: matrix.csv (45 rows) + review-report.md authored"
    next_safe_action: "Phase 4 closeout"
    blockers: []
    key_files: [.opencode/specs/sk-doc/z_archive/008-sk-doc-router-stress-test/003-synthesize/review-report.md]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase3-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: synthesize

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-matrix-execute |
| **Successor** | 004-closeout |
| **Handoff Criteria** | matrix.csv (45 rows × 19 cols) authored; review-report.md with verdict + P0/P1/P2 findings authored |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 3 of the 071 packet. Extracts metrics from 45 raw cell logs (Phase 2 output) into structured matrix.csv, then authors review-report.md with cross-CLI rankings + P0/P1/P2 findings registry.

**Scope Boundary**: Synthesis of existing data only. No additional matrix execution, no router changes.

**Deliverables**:
- extract_metrics.py — Python script for CLI-specific log parsing + intent/resource detection
- matrix.csv — 45 rows × 19 columns of per-cell metrics
- review-report.md — verdict (CONDITIONAL→REMEDIATE_AND_SHIP), per-CLI rankings, P0/P1/P2 findings, recommendations
- One commit on main: `feat(sk-doc): synthesize matrix metrics + review-report (071/003)`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
45 raw cell logs from Phase 2 contain CLI-specific output formats (codex stdout with token line, copilot Tokens summary block, opencode JSONL stream). Without structured extraction, no comparative analysis is possible.

### Purpose
Parse each CLI's log format, extract intent/resources/tokens/duration, build matrix.csv for downstream analysis, author review-report.md with findings + recommendations for sk-doc router consumption across CLIs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Python script (extract_metrics.py) parsing 3 CLI-specific log formats
- Intent detection regex (matching 11+UNKNOWN_FALLBACK intent names)
- Resource detection regex (matching references/* and assets/* paths)
- Per-cell accuracy: intent_match (bool), false-positive resources (count), accuracy_pct
- matrix.csv writer (45 rows × 19 cols)
- Per-CLI summary stats (intent accuracy %, avg duration, avg tokens, avg false-positive count)
- review-report.md authoring with verdict + findings registry

### Out of Scope
- Re-running matrix (Phase 2 done)
- Router code changes (entire packet)
- Phase 4 closeout (commit + validate)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `003-synthesize/scripts/extract_metrics.py` | Create | Python synthesis script |
| `003-synthesize/matrix.csv` | Create | 45-row data table |
| `003-synthesize/review-report.md` | Create | Verdict + findings + recommendations |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | matrix.csv has 45 rows | `wc -l matrix.csv` returns 46 (header + 45) |
| REQ-002 | matrix.csv has expected columns | header includes scenario_id, cli, exit_code, duration_s, tokens_total, intent_match, accuracy_pct, false_positive_resources |
| REQ-003 | Per-CLI summary stats computed | extract_metrics.py prints intent accuracy %, avg duration, avg tokens for codex/copilot/opencode |
| REQ-004 | review-report.md verdict line present | grep "VERDICT" or "**Verdict**" present in review-report.md |
| REQ-005 | At least 1 P0 finding documented (methodology bug) | grep "P0" in review-report.md |
| REQ-006 | Per-CLI ranking table in review-report.md | Section 2 has comparison matrix |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Recommendations section in review-report.md | Section 6 with concrete next-step suggestions |
| REQ-008 | Follow-up packet 072 candidate flagged if P1 findings warrant | "follow-up packet 072" mentioned in review-report.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: matrix.csv + review-report.md shipped on main
- **SC-002**: Phase 4 (closeout) unblocked

### Given/When/Then Verification Scenarios

**Given** 45 raw cell logs from Phase 2, **When** extract_metrics.py parses each CLI's log format, **Then** matrix.csv contains 45 rows with consistent column schema.

**Given** matrix.csv populated, **When** computing per-CLI summary stats, **Then** intent accuracy + avg duration + avg tokens reported per CLI.

**Given** the methodology bug surfaced in Phase 2, **When** authoring review-report.md, **Then** P0 finding documents the root cause + resolution + lesson.

**Given** cli-codex outperforms cli-copilot/cli-opencode on accuracy + tokens, **When** authoring recommendations, **Then** report names cli-codex as preferred default executor.

**Given** opencode hits 120s timeout on 2 cells, **When** authoring P1 findings, **Then** report recommends raising timeout to 180s for future runs.

**Given** review-report.md and matrix.csv shipped, **When** committing, **Then** message follows packet convention.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Intent detection regex picks wrong intent (e.g., from "Not loaded:" sections) | Medium | Documented as P1-001 in review-report; recommend follow-up to refine |
| Risk | Token extraction missing for codex/opencode | Low | Phase 3 script extracts from raw logs (recovers data lost in Phase 2 deltas) |
| Dependency | Phase 2 logs available at logs/SD-NNN/{cli}.log | Green | All 45 captured |
| Dependency | Scenario frontmatter parsable | Green | Simple line-based parser; PyYAML not required |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None for Phase 3 scope. Follow-up questions for Phase 4 closeout: should follow-up packet 072 be auto-created, or only if user requests it explicitly? (Default per Q5=C: only if user requests.)
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
