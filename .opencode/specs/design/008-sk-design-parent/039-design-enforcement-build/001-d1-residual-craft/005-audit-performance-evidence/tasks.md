---
title: "Tasks: Audit Performance Evidence"
description: "Ordered implementer items to add a Performance Evidence block (baseline, post-change, static-risk label, measurement needed) to audit_report_template.md and create perf_evidence_check.py, the deterministic gate that fails when a Performance score above 2 carries neither a numeric metric nor a not-assessed label."
trigger_phrases:
  - "audit performance evidence tasks"
  - "perf evidence gate design build"
  - "perf_evidence_check deterministic gate"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/005-audit-performance-evidence"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked all tasks complete with evidence after gate acceptance passed"
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
# Tasks: Audit Performance Evidence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [Template Block]

- [x] T001 Re-read `audit_report_template.md` Section 5 to confirm the exact Performance score row, the `Score (0-4)` column shape, and the rating-band line the new block will sit beneath (`.opencode/skills/sk-design/design-audit/assets/audit_report_template.md`) [10m] — Performance row + `Score (0-4)` column + rating bands confirmed
- [x] T002 Re-read the evidence model the block binds to: `references/accessibility_performance.md` §5 Performance Evidence and `references/evidence_capture.md` §6 (metrics-unavailable → static-risk + measurement needed), so the block restates the live model rather than inventing one [10m] — block restates the live model, both §-sources cited
- [x] T003 Insert a `### Performance Evidence` subsection immediately after the Section 5 score table + rating-band line (before Section 6 OWNER MAPPING) with the four named fields — Baseline, Post-change, Static-risk label, Measurement needed — plus a Metric and Evidence-type row, in the template's fill-in house style (`audit_report_template.md`) [20m] — six-row block inserted before Section 6
- [x] T004 Add the rule line: a Performance score above 2 must carry a numeric metric (number + unit) in Baseline or Post-change, OR an explicit `not-assessed` label; state that the check confirms presence only and metric truth stays advisory; reference the two evidence files by skill-relative path (`audit_report_template.md`) [10m] — rule line + presence-vs-advisory note + both references present
- [x] T005 Verify additivity: every existing Section 1-8 and its prose is preserved verbatim; only a new subsection was inserted; no `specs/` path or packet/phase ID embedded (`audit_report_template.md`) [10m] — Sections 1-8 byte-preserved, no renumber, evergreen grep clean

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [Deterministic Gate]

- [x] T006 [P] Create `design-audit/scripts/perf_evidence_check.py` (Python 3 stdlib only) with a `main()` arg parser accepting a target path and an optional `--json`, mirroring `shared/scripts/proof_check.py` (`.opencode/skills/sk-design/design-audit/scripts/perf_evidence_check.py`) [15m] — `main()` + `--json`, stdlib `re`/`json`, `py_compile` clean
- [x] T007 Implement the score parser: locate the Section 5 five-dimension score table, read the row whose dimension matches `/performance/i`, extract and clean the `Score (0-4)` cell (`perf_evidence_check.py`) [25m] — `_find_performance_score` parses by header, not fixed index
- [x] T008 Implement the score classifier: integer/float `> 2` requires evidence; `<= 2` passes; `not-assessed` in the score cell passes; placeholder/blank score fails (`performance score not filled`) (`perf_evidence_check.py`) [20m] — `_classify_score` covers scored/not-assessed/unfilled
- [x] T009 Implement the evidence requirement for score > 2: a numeric-metric token (number + unit, e.g. `ms`, `s`, `kb`, `px`, `%`, `fps`, or a Core Web Vital with a number) in Baseline/Post-change, OR a `not-assessed` label in the Performance Evidence block; neither → fail naming `Perf score > 2 without numeric metric or not-assessed label` (`perf_evidence_check.py`) [25m] — `_has_metric`/`_has_not_assessed`, fail message verified
- [x] T010 Wire the exit contract and output: exit 0 satisfied, 1 requirement violated or score unfilled, 2 usage/unreadable/no-table; emit a human summary and an optional `--json` payload mirroring `proof_check.py` (`perf_evidence_check.py`) [10m] — exit 0/1/2 verified, human summary + `--json` emitted

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Acceptance
- [x] T011 Build a filled report fixture with Perf = 3 and a numeric metric (e.g. `LCP 2.1s` baseline); run the checker; confirm exit 0 [10m] — Perf 4 + Baseline 2200ms fixture, exit 0
- [x] T012 Tamper test: from the same fixture remove the metric and any not-assessed label; confirm exit 1 naming `Perf score > 2 without numeric metric or not-assessed label`; restore the fixture [10m] — all-placeholder evidence, exit 1 with the named reason
- [x] T013 Below-threshold + not-assessed: Perf = 2 → exit 0; Performance dimension marked `not-assessed` → exit 0 [10m] — both verified exit 0
- [x] T014 Unfilled guard: leave the Performance score cell as a placeholder; confirm exit 1 (`performance score not filled`), so a half-filled report never green-lights [5m] — placeholder score, exit 1 "performance score not filled"
- [x] T015 Robustness: no score table, unreadable file, ragged row → exit 2 deterministically with no false pass [10m] — no-table exit 2, no-arg usage exit 2, no false pass

### Consistency
- [x] T016 Confirm the block's field set equals the spec §4 set (baseline, post-change, static-risk label, measurement needed) and that the rule matches the existing model in `accessibility_performance.md` §5 / `evidence_capture.md` §6 (no invented requirement) [15m] — field set matches §4, both §-sources referenced, no invented requirement

### Audits
- [x] T017 Evergreen audit: grep the template block + checker for spec/packet/phase IDs and `specs/` paths; confirm none present [5m] — grep over both finds no `specs/` paths or packet/phase IDs
- [x] T018 Scope-lock audit: confirm the change set is exactly the one template edit + the one new checker, and no other audit doc/reference/asset/script is modified [5m] — `audit_report_template.md` modified + `perf_evidence_check.py` added only

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] A filled Perf > 2 report with a metric passes; the same report without metric and without not-assessed label fails (deterministic)
- [x] Perf <= 2, not-assessed, and unfilled-score cases all behave as specified
- [x] The block's fields and rule match the spec §4 set and the existing evidence model
- [x] Additive only — the template loses no prose; only the checker is a new file
- [x] Evergreen + scope-lock audits pass
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Evidence model**: `.opencode/skills/sk-design/design-audit/references/accessibility_performance.md` §5; `.opencode/skills/sk-design/design-audit/references/evidence_capture.md` §6
- **Gate convention**: `.opencode/skills/sk-design/shared/scripts/proof_check.py` (stdlib checker pattern)

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates, explicit acceptance + tamper + below-threshold + robustness tasks)
-->
