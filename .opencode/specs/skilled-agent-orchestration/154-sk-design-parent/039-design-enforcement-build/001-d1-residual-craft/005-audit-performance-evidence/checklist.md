---
title: "Verification Checklist: Audit Performance Evidence"
description: "Verification items for the Performance Evidence block added to audit_report_template.md and the perf_evidence_check.py deterministic gate, including existence, field-set, acceptance/tamper, below-threshold, not-assessed, advisory-honesty, evergreen, and scope-lock checks."
trigger_phrases:
  - "audit performance evidence checklist"
  - "perf evidence gate design build"
  - "perf_evidence_check deterministic gate"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/005-audit-performance-evidence"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verified all 24 checklist items against the delivered block and gate"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/assets/audit_report_template.md"
      - ".opencode/skills/sk-design/design-audit/scripts/perf_evidence_check.py"
      - ".opencode/skills/sk-design/design-audit/references/accessibility_performance.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Audit Performance Evidence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Spec target re-read: `audit_report_template.md` Section 5 scores Performance 0-4 with no evidence fields today
  - **Acceptance**: the live Section 5 table has a Performance row with a `Score (0-4)` cell and no baseline/delta/metric field
- [x] CHK-002 [P0] Existing evidence model re-read so the block restates it, not a new invention (`accessibility_performance.md` §5, `evidence_capture.md` §6)
  - **Acceptance**: the block's static-risk + measurement-needed language traces to those two references
- [x] CHK-003 [P0] Scope frozen to one additive template edit + one new checker; no other audit file touched
  - **Acceptance**: `git status --porcelain` shows only `audit_report_template.md` modified and `scripts/perf_evidence_check.py` added under `.opencode/skills/sk-design/design-audit/`

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `audit_report_template.md` carries a `### Performance Evidence` block with all four spec §4 fields — Baseline, Post-change, Static-risk label, Measurement needed
  - **Acceptance**: the block renders the four fields plus a Metric and Evidence-type row, in the template's fill-in style
- [x] CHK-011 [P0] The block states the rule: a Performance score above 2 must carry a numeric metric or an explicit `not-assessed` label
  - **Acceptance**: the rule sentence is present, adjacent to the Section 5 Performance score, and names both accepted forms
- [x] CHK-012 [P0] `perf_evidence_check.py` parses the Section 5 Performance score and FAILS when a score above 2 has neither a numeric metric nor a not-assessed label (not merely on a missing block)
  - **Acceptance**: a filled Perf=3 report with the metric and not-assessed label removed yields a non-zero exit naming the reason
- [x] CHK-013 [P1] The checker classifies `<= 2`, `not-assessed`, and unfilled scores correctly (pass / pass / fail)
  - **Acceptance**: Perf=2 → exit 0; Performance marked not-assessed → exit 0; placeholder score → exit 1 (`performance score not filled`)

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACCEPTANCE: a filled report with Perf > 2 and a numeric metric exits 0
  - **Acceptance**: deterministic exit 0 on the populated, evidenced report
- [x] CHK-021 [P0] ACCEPTANCE: the same report with the metric and not-assessed label removed exits non-zero
  - **Acceptance**: exit 1 + a message identifying `Perf score > 2 without numeric metric or not-assessed label`
- [x] CHK-022 [P0] ACCEPTANCE: a not-assessed Performance dimension and a `<= 2` Performance score both exit 0
  - **Acceptance**: the honest not-assessed path and the below-threshold path are not punished
- [x] CHK-023 [P1] ROBUSTNESS: no score table, unreadable file, and a ragged row each exit 2 with no false pass
  - **Acceptance**: usage/parse failures are deterministic and never reported as a clean pass

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Acceptance**: instance-only — this phase adds one template block plus one stdlib gate and produces no code-defect findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Acceptance**: instance-only; the change set is one template edit + one new checker, and an evergreen grep over both finds no IDs/paths
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Acceptance**: the only consumer of the Performance Evidence block is `perf_evidence_check.py`; no existing audit doc, asset, or script reads it, so nothing downstream changes
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Acceptance**: adversarial matrix executed — score > 2 with metric, score > 2 without metric, score `<= 2`, not-assessed, unfilled score, no score table, and ragged row all behave deterministically
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Acceptance**: matrix is 7 gate cases (metric-present / metric-absent / below-threshold / not-assessed / unfilled / no-table / ragged-row) plus the field-set consistency check against spec §4
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Acceptance**: not applicable; the gate reads only the target report text and no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to the delivered files, not a moving branch-relative range.
  - **Acceptance**: evidence pins to the `### Performance Evidence` block in `audit_report_template.md` and the score-classify + requirement functions in `perf_evidence_check.py`

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No false trust signal: the block and the checker both state the bite is structural (a number or label is present); whether the metric is a real measurement stays advisory
  - **Acceptance**: neither artifact claims the checker verifies a real measurement ran — the advisory boundary is written, matching the spec acceptance
- [x] CHK-031 [P1] Integrity: the block restates the existing evidence model and relocates no logic out of `accessibility_performance.md` / `evidence_capture.md`
  - **Acceptance**: the block references those files; it does not copy or move their content

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD]: no spec/packet/phase IDs or `specs/` paths embedded in the template block or the checker
  - **Acceptance**: an evergreen grep over both returns no `specs/` paths and no packet-phase IDs; only skill-relative paths appear
- [x] CHK-041 [P1] spec/plan/tasks/checklist synchronized on the four-field set and the deterministic Perf > 2 acceptance
  - **Acceptance**: all four docs carry the same field set (baseline, post-change, static-risk label, measurement needed) and the same pass/fail/not-assessed acceptance

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Only `audit_report_template.md` edited and `scripts/perf_evidence_check.py` added; no existing audit file modified; the template edit deletes/rewords no existing prose
  - **Acceptance**: `git status --porcelain` lists exactly those two paths; a diff shows the template change is a pure insertion
- [x] CHK-051 [P1] No temp/scratch files left outside the scratchpad
  - **Acceptance**: any acceptance fixtures live only in the session scratchpad; the working tree carries only the edited template + the new checker

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent — verified against the delivered Performance Evidence block + `perf_evidence_check.py` (exit 0 with metric and with not-assessed, exit 1 on stripped/unfilled, exit 2 usage)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
