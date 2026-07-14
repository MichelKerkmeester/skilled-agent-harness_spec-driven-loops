---
title: "Tasks: Benchmark Authoring Centralization"
description: "Author + integrate + rewire task checklist with evidence for centralizing benchmark-document authoring in create-benchmark."
trigger_phrases:
  - "016 tasks benchmark authoring centralization"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-benchmark-authoring-centralization"
    last_updated_at: "2026-07-12T11:38:53Z"
    last_updated_by: "claude-code"
    recent_action: "All tasks complete; 10/10 packets PASS; rewire pointer-only"
    next_safe_action: "Terminal gates + push"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Benchmark Authoring Centralization

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
`[x]` complete · `[ ]` pending. Each row carries evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Confirm benchmark-family inventory (8 types) and the renderer-owned / lane-local boundaries
- [x] T002 Confirm the behavior-family precedent (contract in the lane, templates in create-benchmark) as the target shape
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Author `references/skill_benchmark_storage_guide.md` (hub benchmark/ storage + renderer-owned report boundary) — validate 0 issues
- [x] T004 Author `assets/skill_benchmark_readme_template.md` (hub benchmark/README index template) — validate 0 issues
- [x] T005 Author `references/model_benchmark_fixture_guide.md` (fixture families + profiles + lane-local contracts) — validate 0 issues
- [x] T006 Author `assets/model_benchmark_code_task_fixture_template.md` (t-tier fixture) — validate 0 issues; fields mirror real t3 fixture
- [x] T007 Author `assets/model_benchmark_pattern_fixture_template.md` (pattern/capability fixture) — validate 0 issues
- [x] T008 Author `assets/model_benchmark_profile_template.md` (profile) — validate 0 issues
- [x] T009 Integrate create-benchmark SKILL: split merged header (§1 WHEN TO USE / §2 SMART ROUTING) + add §12 REFERENCES; expand family table to 6 families (owns-vs-routes; Lane A/D code-owned non-goals); add §10 skill-benchmark + §11 model-benchmark sections; v1.1.0.0 → v1.2.0.0 + changelog
- [x] T010 Update README.md + references/README.md (family overview, template rows); fix 2 renumber-stale cross-refs (behavior guide, report template)
- [x] T011 Rewire 8 deep-improvement/hub consumer docs to pointer-only references
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T012 `package_skill.py --check` all 10 sk-doc packets → 10/10 PASS (create-benchmark now included)
- [x] T013 `validate_document.py` on all new + edited create-benchmark docs → 0 issues each
- [x] T014 Rewire audit: diffs additive (1-6 lines added, 0 removed); ZERO paths under deep-alignment; no scorer/runner/contract edits
- [x] T015 Model-benchmark template fidelity: template field set is a faithful superset of the real fixture keys
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
10/10 `--check`; all new docs validate 0; family table complete; rewire pointer-only with zero deep-alignment/scorer edits; MCP-promotion contract preserved. Met.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- `./spec.md`, `./plan.md`, `./checklist.md`, `./decision-record.md`, `./implementation-summary.md`
- `../015-sk-doc-router-alignment/009-packet-smart-routing-conformance/` (owns the header-split canon)
- `.opencode/skills/sk-doc/create-benchmark/` (deliverable location)
<!-- /ANCHOR:cross-refs -->
