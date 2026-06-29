---
title: "Feature Specification: Audit Performance Evidence"
description: "The audit report scores Performance 0-4 with no place for a number, so a strong optimize score can rest on prose. This adds a Performance Evidence block plus a presence gate."
trigger_phrases:
  - "d1-r5 performance evidence"
  - "audit performance evidence design build"
  - "perf_evidence_check deterministic gate"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/005-audit-performance-evidence"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgraded spec to Level 2 and recorded presence-deterministic vs realness-advisory split"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/assets/audit_report_template.md"
      - ".opencode/skills/sk-design/design-audit/scripts/perf_evidence_check.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Deterministic bite as a checker vs prose-only resolved to a new stdlib checker mirroring proof_check.py"
---
# Feature Specification: Audit Performance Evidence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `005-audit-performance-evidence` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The audit report template scores Performance 0 to 4 in its Section 5 five-dimension table but gives the Performance dimension no field for a number. A reviewer can therefore claim a strong optimize score on prose alone. The impeccable corpus requires optimize claims to carry metric proof (`optimize.md:21`), and the audit's own evidence model already says a metrics-unavailable finding becomes a static-risk finding with a stated measurement needed (`evidence_capture.md` §6), but nothing in the report makes that mandatory and nothing checks it.

### Purpose
Give the Performance dimension a place to carry evidence and a deterministic gate: a Performance score above 2 must carry a numeric metric or an explicit not-assessed label, enforced by presence. Whether the number is a true measurement stays a judgment call.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `### Performance Evidence` block added to `design-audit/assets/audit_report_template.md`, inside Section 5, after the score table.
- The fixed field set: Metric, Baseline, Post-change, Evidence type, Static-risk label, Measurement needed.
- The rule that a Performance score above 2 requires a numeric metric in Baseline/Post-change or an explicit `not-assessed` label.
- A new stdlib gate `design-audit/scripts/perf_evidence_check.py` that fails when that rule is violated.

### Out of Scope
- Proving a captured number reflects a real measurement run, the right tool, or a fair baseline; that stays advisory.
- Any change to the Performance scoring rubric or the rating bands themselves.
- Device-constrained probe capture, which is a separate sibling phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `design-audit/assets/audit_report_template.md` | Modify | Additive Performance Evidence subsection in Section 5; no section removed or renumbered |
| `design-audit/scripts/perf_evidence_check.py` | Create | Stdlib presence gate for the Performance score and evidence block |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The template carries a Performance Evidence block with all four named fields (Baseline, Post-change, Static-risk label, Measurement needed) plus Metric and Evidence-type rows, in the template fill-in style | The block renders the six rows immediately after the Section 5 score table, before Section 6 |
| REQ-002 | `perf_evidence_check.py` fails when a Performance score above 2 carries neither a numeric metric nor a not-assessed label | A filled Perf=4 report with a real metric exits 0; the same report with the metric and label removed exits 1 naming the reason |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The gate classifies below-threshold, not-assessed, and unfilled scores correctly | Perf=2 exits 0; a not-assessed Performance dimension exits 0; a placeholder score exits 1 (`performance score not filled`) |
| REQ-004 | Enforcement honesty: both artifacts state the bite is presence, and that metric realness stays advisory | Neither the block nor the checker claims a real measurement was verified |
| REQ-005 | Additive and evergreen | The template loses no prose and renumbers nothing; only the one edit + one new file change; neither embeds spec, packet, or phase identifiers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A filled report with Performance above 2 and a numeric metric passes (exit 0); the same report stripped of its metric and not-assessed label fails (exit 1) naming `Perf score > 2 without numeric metric or not-assessed label`.
- **SC-002**: Below-threshold (Perf 2), honestly not-assessed, and unfilled-score reports all behave as specified; usage and no-table cases exit 2 with no false pass.
- **SC-003**: The block's field set matches §4 and restates the live evidence model in `accessibility_performance.md` §5 / `evidence_capture.md` §6 rather than inventing a new one.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The gate is deterministic about presence but advisory about truth; a present number could still come from a fabricated or unfair measurement | Med | Both artifacts state the split in plain words; presence is enforced, realness stays audit judgment |
| Risk | A reader mistakes a passing gate for proof the optimization works | Med | The block and checker say the bite is structural only; audit judgment still proves the number is real |
| Risk | The numeric-metric token misses an exotic unit | Low | The honest not-assessed label is always an accepted path, so an un-recognized unit falls back to a labeled non-assessment |
| Dependency | `audit_report_template.md` Section 5 Performance score row | Block and parser lose their anchor if the table shape changes | Parse the dimension/score columns by header, not by fixed index |
| Dependency | `accessibility_performance.md` §5, `evidence_capture.md` §6 (evidence model) | Block loses its canonical source if these move | Reference by evergreen path + section, never line numbers |
| Dependency | Python 3 stdlib (`re`, `json`) | No deterministic gate possible without it | Stdlib only, no external dependency |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The gate runs in well under a second on a single report file (one read, linear section/table scan).

### Security
- **NFR-S01**: The gate reads only the target report text and no process-wide state; no network or shell-out.

### Reliability
- **NFR-R01**: The gate is deterministic: identical input yields identical exit code and output across runs.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Below-threshold score: Performance 2 or lower passes; the evidence block is optional there.
- Honest non-assessment: a `not-assessed` Performance score, or a not-assessed label in the block, passes.
- Placeholder score: a `__` or blank Performance score fails (`performance score not filled`), so a half-filled report never green-lights.

### Error Scenarios
- No Section 5 score table, unreadable target path, or a ragged row: usage/parse error at exit 2, never a false pass.
- Missing argument or an unknown flag: usage error at exit 2.

### State Transitions
- Score above 2 with neither a metric nor a not-assessed label: fail at exit 1 naming the reason.
- Score above 2 with the metric and the label both later stripped: the same report flips from exit 0 to exit 1.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One additive template subsection plus one stdlib checker |
| Risk | 6/25 | Additive only, no existing craft prose touched, reversible by revert + delete |
| Research | 6/20 | Binding the block to the live evidence model and matching the score-table parse shape |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- The gate enforces presence (a number-with-unit or the not-assessed label), not realness. Should a future sibling add a measurement-capture lane that ties the number to a named run and tool? Today the realness of the number stays audit judgment, and both artifacts say so rather than implying a stronger guarantee.
- Should the numeric-metric vocabulary become a shared, versioned token list if other gates start grading metrics? Today the unit set lives in the checker; promoting it would make the accepted-metric contract explicit across modes.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
