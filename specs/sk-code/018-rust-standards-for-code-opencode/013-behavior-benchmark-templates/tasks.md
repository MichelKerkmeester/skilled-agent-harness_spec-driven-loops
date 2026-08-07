---
title: "Tasks: Phase 13 — Behavior Benchmark Templates & Creation Guide"
description: "Author + validate the behavior_benchmark templates, guide, and create-benchmark SKILL/README extension, with evidence."
trigger_phrases:
  - "018 phase 013 tasks behavior benchmark"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/013-behavior-benchmark-templates"
    last_updated_at: "2026-07-12T08:54:18Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete; every file validates"
    next_safe_action: "Commit 013"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13 — Behavior Benchmark Templates & Creation Guide

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending. Each row carries evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Read shared `framework.md`, shipped index/scenario/baseline, and sk-doc template pattern (`benchmark_report_template.md`) — evidence: files read in session
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T002 Author `assets/behavior_benchmark_scenario_template.md` (JSON machine contract + Rationale/Pass shape/Failure modes; Overview meta stripped on copy)
- [x] T003 Author `assets/behavior_benchmark_index_template.md` (OVERVIEW + SCENARIO TABLE + AXIS COVERAGE + EXECUTION + RELATED RESOURCES)
- [x] T004 Author `assets/behavior_benchmark_baseline_template.md` (Overview + Baseline Table + Capture Provenance + Notes)
- [x] T005 Author `references/behavior_benchmark_guide.md` (what it measures, family boundary, layout, matrix design, naming, validation)
- [x] T006 Extend `SKILL.md`: §1 Benchmark Families router + triggers, §8 authoring section, description/keywords/Family Boundary; bump version → 1.1.0.0
- [x] T007 Update `README.md` + `references/README.md` (two-family framing, template rows); add `changelog/v1.1.0.0.md`
- [x] T008 Bundled hygiene: correct broken `assets/benchmark/…` → `assets/…` paths in touched files (SKILL, README, references/README)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T009 `validate_document.py` on all 3 templates + guide → 0 issues each
- [x] T010 `validate_document.py` on SKILL.md (skill), README.md + references/README.md (readme), changelog (changelog) → 0 issues each
- [x] T011 Relative-link resolution: guide→framework and SKILL→framework probed on disk → OK (SKILL depth corrected `../../../` → `../../`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
All authored files validate 0 issues; templates faithfully mirror the shipped deep-alignment package; framework untouched; no concrete package authored.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- `./spec.md`, `./plan.md`, `./implementation-summary.md`
- `.opencode/skills/sk-doc/create-benchmark/` (deliverable location)
- `.opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md` (normative contract)
<!-- /ANCHOR:cross-refs -->
