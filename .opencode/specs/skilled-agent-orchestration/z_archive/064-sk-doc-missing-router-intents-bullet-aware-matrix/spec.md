---
title: "Feature Specification: 076 sk-doc Router Coverage v3"
description: "Extend sk-doc router test matrix coverage from 15 to 17 scenarios by adding OPTIMIZATION + INSTALL_GUIDE intents (the 2 of 11 router intents not exercised in 071), introduce a markdown-bullet-aware v3 extractor, and produce matrix_v3.csv across all 51 cells (17 × 3 CLIs)."
trigger_phrases: ["076", "sk-doc-router-coverage-v3", "extract_metrics_v3"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/064-sk-doc-missing-router-intents-bullet-aware-matrix"
    last_updated_at: "2026-05-05T18:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "v3 matrix complete"
    next_safe_action: "Validate + commit"
    blockers: []
    key_files:
      - .opencode/skills/sk-doc/manual_testing_playbook/01--intent-detection/004-optimization.md
      - .opencode/skills/sk-doc/manual_testing_playbook/01--intent-detection/005-install-guide.md
      - .opencode/specs/skilled-agent-orchestration/z_archive/064-sk-doc-missing-router-intents-bullet-aware-matrix/scripts/extract_metrics_v3.py
      - .opencode/specs/skilled-agent-orchestration/z_archive/064-sk-doc-missing-router-intents-bullet-aware-matrix/matrix_v3.csv
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "076-final"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 076 sk-doc Router Coverage v3

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Predecessor** | 072 review-report-v2.md (refined extractor v2; 15 scenarios) |
| **Successor** | None |
| **Handoff Criteria** | matrix_v3.csv produced for 17 scenarios × 3 CLIs (51 cells); validate.sh --strict exit 0; one commit on main |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 071 stress-matrix covered 15 scenarios but exercised only 9 of sk-doc's 11 router intents. Two intents — OPTIMIZATION (load `references/global/optimization.md` + `assets/documentation/llmstxt_templates.md`) and INSTALL_GUIDE (load `references/specific/install_guide_creation.md` + `assets/documentation/install_guide_template.md`) — were never tested across cli-codex, cli-opencode. Without coverage on these intents, claims like "cli-codex resource accuracy is ~67%" rest on partial evidence and may not generalize. Additionally, 072's extractor v2 used flat substring matching that doesn't distinguish between markdown-bullet listings (the canonical "loaded:" form) and prose mentions, so cli-copilot's verbose summary paragraphs inflate measured FP counts.

### Purpose
Add SD-016 (OPTIMIZATION) and SD-017 (INSTALL_GUIDE) scenario files, run the matrix on the 6 new cells, ship a v3 extractor with markdown-bullet-aware parsing, re-extract all 51 cells uniformly, and surface whether the per-CLI accuracy ranking shifts under the new measurement.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author 2 new manual_testing_playbook scenarios: SD-016 (OPTIMIZATION) and SD-017 (INSTALL_GUIDE) under `01--intent-detection/`
- Update `manual_testing_playbook.md` index Categories table + Scenario Index
- Build `extract_metrics_v3.py` with markdown-bullet-aware parser (Pass A: full paths; Pass B: bullet-line basenames; Pass C: prose-fallback)
- Run matrix on 6 new cells (SD-016 + SD-017 × 3 CLIs) using existing 071 dispatcher pattern
- Re-extract all 51 cells uniformly with v3 → `matrix_v3.csv` + per-CLI summary
- Author `076/review-report-v3.md` with v2-vs-v3 delta, OPTIMIZATION/INSTALL_GUIDE-specific findings, and recommendations
- Spec docs (spec, plan, tasks, implementation-summary) per Level 1 contract

### Out of Scope
- Re-running the original 45 cells from 071 with the same prompts — too costly and unnecessary; v3 re-extracts from the SAME stored logs uniformly, which is the methodology-correct comparison
- Re-authoring v1 extractor scenarios that already converged in 072 (SD-001..SD-015) — only the 2 new scenarios get matrix runs
- Statistical hypothesis testing across CLIs — n=17 is descriptive; significance testing belongs in a separate packet (e.g., 080+)
- Adding the 9 already-covered intents again — only the 2 missing intents (OPTIMIZATION, INSTALL_GUIDE) are added
- Changing 072's extractor v2 retroactively — v2 stays as the historical record for that packet

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/manual_testing_playbook/01--intent-detection/004-optimization.md` | Create | SD-016 scenario file |
| `.opencode/skills/sk-doc/manual_testing_playbook/01--intent-detection/005-install-guide.md` | Create | SD-017 scenario file |
| `.opencode/skills/sk-doc/manual_testing_playbook/manual_testing_playbook.md` | Modify | Add SD-016 + SD-017 to Categories + Scenario Index |
| `076/scripts/extract_metrics_v3.py` | Create | Markdown-bullet-aware extractor |
| `076/scripts/run-matrix-076.sh` | Create | Variant of 071 dispatcher restricted to SD-016/017 |
| `076/logs/{SD-016,SD-017}/{codex,copilot,opencode}.log` | Create | Raw CLI output captures |
| `076/deltas/{codex,copilot,opencode}.jsonl` | Create | Per-CLI delta records |
| `076/matrix_v3.csv` | Create | 51-row metrics matrix |
| `076/review-report-v3.md` | Create | v3 findings synthesis |
| `076/{spec,plan,tasks,implementation-summary}.md` | Create | Level 1 packet docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SD-016 + SD-017 scenario files exist with reflective-framing prompts | Files present; frontmatter validates; "DO NOT execute" disclaimer in §Setup |
| REQ-002 | manual_testing_playbook.md index lists SD-016 + SD-017 | grep "SD-016" + "SD-017" returns hits in both Categories table and Scenario Index |
| REQ-003 | extract_metrics_v3.py runs cleanly across all 51 cells | python3 extract_metrics_v3.py exit 0; 51 rows in CSV |
| REQ-004 | matrix_v3.csv contains 51 rows (17 scenarios × 3 CLIs) | wc -l matrix_v3.csv = 52 (1 header + 51 rows) |
| REQ-005 | All 6 new cells have exit_code 0 | grep '"exit":0' deltas/*.jsonl returns 6 |
| REQ-006 | review-report-v3.md cites v2-vs-v3 per-CLI accuracy delta | grep "v2.*v3" or "comparison" in review-report-v3.md |
| REQ-007 | validate.sh --strict on 076 exits 0 | Validator returns 0/0 |
| REQ-008 | One commit on main + pushed | `git push origin main` exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | review-report-v3.md surfaces per-intent (OPTIMIZATION + INSTALL_GUIDE) findings | grep "OPTIMIZATION" + "INSTALL_GUIDE" each return >=2 hits |
| REQ-010 | review-report-v3.md confirms or refutes 072 P1-072-001 cli-copilot hallucination finding | grep "P1-072-001" or "hallucinat" in review-report-v3.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: matrix_v3.csv shipped with 51 rows; per-CLI numbers reproducible from raw logs.
- **SC-002**: Future packets reading 076 review-report-v3.md see whether OPTIMIZATION/INSTALL_GUIDE intent coverage changes the per-CLI ranking; bullet-aware parsing methodology is documented for reuse.

### Given/When/Then Verification Scenarios

**Given** SD-016 + SD-017 scenarios are authored, **When** an external CLI runs them, **Then** exit_code 0 and intent_picked matches expected_intent.

**Given** extract_metrics_v3.py is run, **When** it parses all 51 logs, **Then** matrix_v3.csv has 51 rows with no missing fields.

**Given** matrix_v3.csv exists, **When** comparing per-CLI accuracy to 072 v2 numbers, **Then** v3 numbers are within ±5% (confirms v2 finding stability) OR the delta is documented in review-report-v3.md.

**Given** review-report-v3.md is authored, **When** a maintainer reads it, **Then** they see OPTIMIZATION/INSTALL_GUIDE intent-specific findings and a recommendation.

**Given** validate.sh --strict on 076, **When** running, **Then** 0 errors and 0 warnings.

**Given** all changes committed, **When** running `git push origin main`, **Then** push succeeds.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | n=17 still small for cross-CLI ranking claims | Low | review-report-v3.md frames numbers as descriptive, not significance-tested |
| Risk | Bullet-aware parser changes per-CLI numbers in unexpected directions | Med | Run v2 + v3 side-by-side; document delta in review-report-v3.md |
| Risk | cli-copilot's hallucination behavior is the same on OPTIMIZATION/INSTALL_GUIDE | Low | Confirms 072 finding; reinforces 075 caveat — not a new risk |
| Dependency | 071 logs at `.opencode/specs/skilled-agent-orchestration/071-.../logs/` still exist | Green |  |
| Dependency | 071 deltas JSONL still parseable | Green |  |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Scope is tightly bounded; methodology mirrors 071/072.
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
