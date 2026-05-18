---
title: "Tasks: 016/005/004 Skill-local benchmarks/ format"
description: "Task list mapping plan phases to discrete steps"
trigger_phrases: ["016/005/004 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/004-skill-local-benchmarks-format"
    last_updated_at: "2026-05-18T19:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored tasks with phases A-E"
    next_safe_action: "Close Phase E with final commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000005004"
      session_id: "016-005-004-skill-local-benchmarks-tasks"
      parent_session_id: "016-005-004-skill-local-benchmarks"
    completion_pct: 90
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 016/005/004 Skill-local benchmarks/ format

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` — completed
- `[ ]` — pending
- Tasks grouped by phase from plan.md (Phases A-E)
- T-numbers persist across re-renders
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

### Phase A — Convention layer (DONE)
- [x] T001 — Author `FORMAT.md` at `system-spec-kit/mcp_server/benchmarks/FORMAT.md`
- [x] T002 — Symlink `FORMAT.md` into `mcp-coco-index/mcp_server/benchmarks/FORMAT.md`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

### Phase B — Evidence promotion (DONE)
- [x] T003 — Create `benchmark-2026-05-17/` for mk-spec-memory
- [x] T004 — Copy `embedder-comparison.csv` → `results.csv`
- [x] T005 — Copy `embedder-comparison-with-rescue.jsonl` → `per-probe-with-rescue.jsonl`
- [x] T006 — Copy `jina-runtime-measurements.md` → `runtime-measurements.md`
- [x] T007 — Write `SOURCE.md` for mk-spec-memory benchmark
- [x] T008 — Create `benchmark-2026-05-18/` for mcp-coco-index
- [x] T009 — Copy `cocoindex-embedder-comparison-with-hybrid-rerank.csv` → `results.csv`
- [x] T010 — Copy `cocoindex-embedder-comparison-with-hybrid-rerank.jsonl` → `per-probe.jsonl`
- [x] T011 — Write `SOURCE.md` for mcp-coco-index benchmark

### Phase C — sk-doc-routed report writing (DONE)
- [x] T012 — Dispatch `@markdown` for mk-spec-memory: write `benchmark-2026-05-17/benchmark_report.md`
- [x] T013 — Dispatch `@markdown` for mk-spec-memory: write `benchmarks/README.md` (top-level index)
- [x] T014 — Dispatch `@markdown` for mcp-coco-index: write `benchmark-2026-05-18/benchmark_report.md`
- [x] T015 — Dispatch `@markdown` for mcp-coco-index: write `benchmarks/README.md` (top-level index)
- [x] T016 — Each agent runs sk-doc `validate_document.py` post-write; resolves HIGH issues before completion

### Phase D — sk-doc resources + cross-skill polish (DONE)
- [x] T017 — Write `sk-doc/references/benchmarks_format.md`
- [x] T018 — Write `sk-doc/assets/benchmark/benchmark_report_template.md`
- [x] T019 — Update `sk-doc/SKILL.md` INTENT_SIGNALS + RESOURCE_MAP for BENCHMARK intent
- [x] T020 — Improve SOURCE.md + runtime-measurements.md + FORMAT.md per sk-doc (parallel agents)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

### Phase E — Validation + commit (IN PROGRESS)
- [ ] T021 — Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict`
- [ ] T022 — Verify all P0/P1 requirements per spec.md §4
- [ ] T023 — Strict-scope commit (single commit covering all phases)
- [ ] T024 — Update `implementation-summary.md` final state
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- All four primary docs (FORMAT.md, 2× README.md, 2× benchmark_report.md) sk-doc-validated
- All sub-phase docs (spec/plan/tasks/impl-summary) strict-validate PASSED
- SOURCE.md cross-links resolve in both skill folders
- FORMAT.md symlink resolves to canonical copy
- sk-doc references + assets shipped
- Single commit on main covering all changes (no feature branch)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- Parent: `../spec.md` (016/005-cross-cutting-quality)
- Spec: `spec.md` (this packet)
- Plan: `plan.md` (this packet)
- Source spec packets (authoritative):
  - `016/002/004-spec-memory-embedder-bake-off/`
  - `016/004/004-extended-bake-off/`
- sk-doc resources added: `references/benchmarks_format.md` + `assets/benchmark/benchmark_report_template.md`
- Follow-on work: `016/007-ollama-and-bge-promotion-arc/` (Ollama adapter + bge-code-v1 promotion confirmation)
<!-- /ANCHOR:cross-refs -->
