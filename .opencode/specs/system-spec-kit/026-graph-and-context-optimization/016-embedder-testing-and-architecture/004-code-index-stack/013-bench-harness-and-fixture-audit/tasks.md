---
title: "Tasks: 016/004/013 Bench Harness Hardening + Fixture Audit"
description: "Completed task list for the hardened Phase 2 measurement baseline and full fixture audit."
trigger_phrases: ["016/004/013 tasks", "bench harness hardening tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/013-bench-harness-and-fixture-audit"
    last_updated_at: "2026-05-19T10:30:44Z"
    last_updated_by: "codex"
    recent_action: "Completed harness, fixture, bench, and docs"
    next_safe_action: "Commit handoff without git commit"
    blockers: []
    key_files:
      - "scratch/test_path_extraction.py"
      - "evidence/fixture-audit-summary.md"
      - "../011-rerank-model-fit-investigation/research/phase2-bench/code-retrieval-fixture-corrected.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004013"
      session_id: "016-004-013-tasks"
      parent_session_id: "016-004-013"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 016/004/013 Bench Harness Hardening + Fixture Audit

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` - completed
- `[ ]` - pending
- `[B]` - blocked
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] T001 - Read `spec.md`, both harness scripts, the 18-probe fixture, current Phase 2 artifacts, settings files, and the relevant ADR/README targets.
- [x] T002 - Attempt the requested sequential-thinking MCP pre-planning. Evidence: three calls returned `user cancelled MCP tool call`; no SpawnAgent was used.
- [x] T003 - Inspect the live sqlite schema and confirm sqlite-vec is required for `code_chunks_vec`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] T004 - Add `_extract_paths(stdout)` to `run-phase2-smoke.sh` with wrapper stripping, line-range stripping, mirror-prefix awareness, filesystem sanity filtering, and rank-order dedupe.
- [x] T005 - Apply the same helper to `run-extended-bake-off-with-hybrid-rerank.sh`.
- [x] T006 - Add `scratch/test_path_extraction.py` with 14 parametrized assertions covering both harnesses.
- [x] T007 - Generate `code-retrieval-fixture-audited.json` with `_fixture_status` and `_audit_evidence` for all 18 probes.
- [x] T008 - Generate `code-retrieval-fixture-corrected.json`; probe 10 is repointed from excluded dist JavaScript to indexed TypeScript source.
- [x] T009 - Re-run Phase 2 smoke bench with corrected fixture and emit `phase2-comparison-corrected.md`.
- [x] T010 - Generate `phase2-comparison-baseline-vs-corrected-delta.md`.
- [x] T011 - Update `phase2-bench/README.md` and append ADR-016.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] T012 - Run `python -m pytest .../scratch/test_path_extraction.py -q`. Evidence: `14 passed`.
- [x] T013 - Run `bash -n` on both harness scripts. Evidence: both exit 0 after quote hardening.
- [x] T014 - Validate audited and corrected JSON fixtures with `python -m json.tool`. Evidence: exit 0.
- [x] T015 - Run corrected three-lane re-bench. Evidence: `phase2-comparison-corrected.md` shows `14/18` for baseline-bge, bge-path-class, and jina-v3.
- [x] T016 - Run strict validation. Evidence: recorded in `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- [x] R1-R3 harness hardening complete.
- [x] R4 pytest coverage complete and passing.
- [x] R5-R6 audited and corrected fixtures written.
- [x] R7 corrected re-bench written.
- [x] R8-R9 ADR and README updated.
- [x] R10 strict validation passed.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- Spec: `spec.md`
- Plan: `plan.md`
- Summary: `implementation-summary.md`
- Corrected comparison: `../011-rerank-model-fit-investigation/research/phase2-bench/phase2-comparison-corrected.md`
- Delta analysis: `../011-rerank-model-fit-investigation/research/phase2-bench/phase2-comparison-baseline-vs-corrected-delta.md`
<!-- /ANCHOR:cross-refs -->
