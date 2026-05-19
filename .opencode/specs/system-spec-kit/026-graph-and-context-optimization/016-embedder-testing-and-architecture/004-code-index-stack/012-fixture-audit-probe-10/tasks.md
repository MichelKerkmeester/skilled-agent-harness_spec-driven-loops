---
title: "Tasks: 016/004/012 Fixture Audit (Probe 10 First)"
description: "Task list for the research investigation"
trigger_phrases: ["016/004/012 tasks"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-probe-10"
    last_updated_at: "2026-05-18T20:42:02Z"
    last_updated_by: "main_agent"
    recent_action: "Completed fixture audit"
    next_safe_action: "Main agent commit handoff"
    blockers: []
    key_files:
      - "research.md"
      - "evidence/code-retrieval-fixture-proposed.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004012"
      session_id: "016-004-012-tasks"
      parent_session_id: "016-004-012"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 016/004/012 Fixture Audit (Probe 10 First)

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` - completed
- `[ ]` - pending
- `[B]` - blocked
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] T001 - Survey / read source material per plan.md Phase 1. Evidence: `research.md` §1 and §5; source fixture at `../002-baseline-fixture/evidence/code-retrieval-fixture.json`; trigger analysis at `../../007-ollama-and-bge-promotion-arc/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md`.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] T002 - Execute the research measurement per plan.md Phase 2. Evidence: all 18 KEEP / CHANGE / AMBIGUOUS verdicts in `research.md` §2-3.
- [x] T003 - Capture evidence in `evidence/` subfolder. Evidence: `evidence/code-retrieval-fixture-proposed.json` contains the one-line probe 10 path proposal.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] T004 - Write `research.md` with verdict + recommendation. Evidence: `research.md` §4 recommends changing probe 10 only and keeping probe 18 as clarification-needed.
- [x] T005 - Run strict-validate; hand off commit if PASSED. Evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-probe-10 --strict` returned `RESULT: PASSED` with 0 errors / 0 warnings.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

- research.md exists with verdict
- evidence/ has proposed fixture output
- strict-validate PASSED
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- Spec: `spec.md`
- Plan: `plan.md`
- Trigger: `../../007-ollama-and-bge-promotion-arc/003-bge-code-v1-confirmation-and-promote/pre-confirmation-margin-analysis.md`
<!-- /ANCHOR:cross-refs -->
