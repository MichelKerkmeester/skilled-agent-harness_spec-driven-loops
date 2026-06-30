---
title: "Feature Specification: Refine resource-detection heuristic + re-extract metrics from 071 raw logs"
description: "Address P1-001 from 071/003 review-report: cli-copilot's verbose 'Not loaded:' sections inflate false-positive count. Refine extract_metrics_v2.py to parse only positive resource mentions, re-extract from existing 071 logs, publish corrected matrix_v2.csv + review-report-v2.md."
trigger_phrases: ["072", "sk-doc-router-rerun-refined-extraction", "P1-001 fix"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/060-sk-doc-router-rerun-refined-extraction"
    last_updated_at: "2026-05-05T16:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Authored 072 spec.md after packet 071 closeout"
    next_safe_action: "Commit + push"
    blockers: []
    key_files:
      - .opencode/specs/skilled-agent-orchestration/z_archive/057-sk-doc-router-stress-test/003-synthesize/scripts/extract_metrics.py
      - .opencode/specs/skilled-agent-orchestration/z_archive/057-sk-doc-router-stress-test/002-matrix-execute/logs/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "072-authoring"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Refined Resource-Detection + Metric Re-extraction (072)

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Predecessor** | 071-sk-doc-router-stress-test (commit 46a63f9c1) |
| **Successor** | None |
| **Handoff Criteria** | matrix_v2.csv + review-report-v2.md authored; cli-copilot accuracy numbers refreshed; one commit on main + push to remote |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 071's 003-synthesize/review-report.md flagged P1-001: cli-copilot's resource accuracy was reported as 5.6%, but this number is inflated-low because the detect_resources() heuristic in extract_metrics.py captures ANY `references/*` or `assets/*` path mention — including ones in cli-copilot's verbose "Not loaded:" / "would NOT load" sections. The headline ranking (cli-codex > cli-opencode > cli-copilot) is directionally correct, but copilot's exact accuracy number isn't trustable.

### Purpose
Refine the resource-detection heuristic in a v2 extractor to parse only POSITIVE mentions (resources the response says were "loaded", "selected", "fetched", "used") and exclude NEGATIVE mentions ("Not loaded:", "would NOT load", "excluded", "filtered out"). Re-run extraction against the existing 45 raw logs from 071/002-matrix-execute/logs/ (no new matrix dispatch needed). Publish corrected matrix_v2.csv + review-report-v2.md.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `extract_metrics_v2.py` based on 071's extract_metrics.py with refined `detect_resources()` (positive-mention parsing)
- Re-extract from 071/002-matrix-execute/logs/ (45 cells) into 072/matrix_v2.csv
- Per-CLI summary stats with refined accuracy numbers
- Author 072/review-report-v2.md comparing v1 (071) vs v2 (072) per-CLI accuracy deltas
- One commit on main + push to remote

### Out of Scope
- Re-running the 45-cell matrix (raw logs already captured in 071)
- Authoring NEW scenarios (15 from 071 are sufficient)
- Router code changes (sk-doc/SKILL.md unmodified)
- 3-CLI matrix expansion (still 3 CLIs: codex, copilot, opencode)
- Out-of-scope per session: barter/coder/, z_archive/, .opencode/specs/** historical, build artifacts

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `072/scripts/extract_metrics_v2.py` | Create | Refined extractor with positive-mention heuristic |
| `072/matrix_v2.csv` | Create | 45 rows × 19 cols (refined metrics) |
| `072/review-report-v2.md` | Create | Verdict + per-CLI v1-vs-v2 deltas + recommendations |
| `072/{spec,plan,tasks,implementation-summary}.md` | Create | Spec docs |
| `072/graph-metadata.json` | Modify | derived.status=complete on closeout |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | extract_metrics_v2.py has refined detect_resources() | Function only counts resources mentioned in positive contexts; excludes "Not loaded", "would NOT load", "excluded", "filtered out" sections |
| REQ-002 | matrix_v2.csv has 45 rows × ~19 cols | `wc -l matrix_v2.csv` returns 46 (header + 45) |
| REQ-003 | review-report-v2.md compares v1 vs v2 accuracy per CLI | Section showing original 071 numbers + new 072 numbers + delta |
| REQ-004 | Verdict line present in review-report-v2.md | grep "Verdict" or "**Verdict**" present |
| REQ-005 | One commit on main + pushed to remote | `git log -1` matches; `git push origin main` exit 0 |
| REQ-006 | validate.sh --strict on 072 exits 0 | Exit code 0, 0 errors, 0 warnings |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | If new ranking emerges (e.g., copilot now beats opencode), update recommendations | Section explicitly states whether 071's "cli-codex preferred default" still holds |
| REQ-008 | Document the parsing-heuristic improvement for future packets | review-report-v2.md "How It Was Built" section explains the v1 vs v2 detect_resources() diff |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: matrix_v2.csv + review-report-v2.md shipped on main + pushed to remote
- **SC-002**: cli-copilot accuracy number refined; 071's qualitative recommendation either confirmed or revised

### Given/When/Then Verification Scenarios

**Given** 071's 45 raw cell logs, **When** running extract_metrics_v2.py, **Then** matrix_v2.csv has 45 rows with refined metrics.

**Given** cli-copilot's "Not loaded:" sections, **When** detect_resources_v2() parses, **Then** those resources are NOT counted as false-positives.

**Given** matrix_v2.csv populated, **When** computing per-CLI summary stats, **Then** cli-copilot's reported accuracy is HIGHER than 071's 5.6%.

**Given** v1 vs v2 numbers, **When** authoring review-report-v2.md, **Then** delta table shows the change per CLI per metric.

**Given** the commit lands, **When** running `git push origin main`, **Then** exit 0.

**Given** the push completes, **When** running `git branch --show-current`, **Then** returns main.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Refined heuristic still imperfect for cli-copilot's exact response style | Low | Iterate once more if v2 still flags many false positives; document remaining noise in v2 report |
| Risk | v1 ranking changes (e.g., copilot now best) | Medium | Honest reporting in review-report-v2.md; update recommendations accordingly |
| Risk | git push fails (auth, conflicts) | Low | Pull-rebase if conflicts; user has explicit push request so auth should be configured |
| Dependency | 071's 45 raw logs at logs/SD-NNN/{cli}.log | Green | Verified present in 071 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Single-Level-1 packet with clear scope.
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
