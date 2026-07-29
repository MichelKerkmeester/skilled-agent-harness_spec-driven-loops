---
title: "Tasks: Wire Compiler + Routing-Accuracy Gates into CI"
description: "Tasks for adding skill_graph_compiler.py and score-routing-corpus.py as new gated CI steps in routing-registry-drift.yml, sequenced after 002/003/004."
trigger_phrases:
  - "ci compiler accuracy gate tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/006-ci-compiler-accuracy-gates"
    last_updated_at: "2026-07-29T09:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "002 corpus hash pin not yet shipped"
      - "003 fleet migration not yet shipped"
      - "004 scaffold born-complete not yet shipped"
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/006-ci-compiler-accuracy-gates"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Wire Compiler + Routing-Accuracy Gates into CI

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-01 Confirm 003 (fleet migration to schema-version 2 `derived`) and 004 (scaffold born schema-compliant) are shipped and merged before proceeding
- [ ] T-02 Read 002's pinned corpus-hash artifact to obtain the exact dataset path/reference for `score-routing-corpus.py --dataset`
- [ ] T-03 Run `python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/skill_graph_compiler.py --validate-only` locally against current `main`; confirm exit 0 (clean baseline post-003/004)
- [ ] T-04 Run `python3 .opencode/skills/system-skill-advisor/mcp-server/scripts/routing-accuracy/score-routing-corpus.py --dataset <pinned-path>` locally; record the resulting accuracy/F1 numbers as the floor-flag source
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-05 Add the compiler-validation step to the `routing-drift` job in `.github/workflows/routing-registry-drift.yml`, placed after the existing "Skill-root metadata class contract" step
- [ ] T-06 Add the routing-accuracy scoring step immediately after, invoking `score-routing-corpus.py --dataset <002-pinned-path> --require-historical-clean --min-advisor-accuracy <T-04 floor> --min-gate3-f1 <T-04 floor>`
- [ ] T-07 Extend the `paths:` filter lists in both the `push` and `pull_request` trigger blocks with the compiler script path and the `routing-accuracy/**` glob
- [ ] T-08 Add an inline workflow comment (matching the file's existing comment style) explaining the pinned-corpus rationale, citing the 029 research finding (O4)
- [ ] T-09 Confirm the four pre-existing `routing-drift` steps are byte-unchanged except for the `paths:` extension
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-10 Dry-run both new steps against a fresh clone (not the working tree) to rule out a pass that only holds locally
- [ ] T-11 Deliberately break a `derived.key_files` path in a scratch copy; confirm the compiler step fails with the expected `ERRORS in <folder>` diagnostic
- [ ] T-12 Deliberately regress an accuracy number in a scratch corpus copy; confirm the scoring step fails against the pinned floor
- [ ] T-13 Confirm the new `paths:` glob entries actually match GitHub Actions' path-filter syntax (no silent no-op filter)
- [ ] T-14 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` on this packet before any completion claim
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Both new CI steps are added to `routing-registry-drift.yml`, activated only after 003/004 are confirmed shipped; local dry runs (clean and deliberately-broken) match the documented failure modes; the four pre-existing steps are unaffected; `paths:` triggers cover both new script surfaces.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · QA `checklist.md` · Research source `../../029-skill-json-optimization-research/research/research.md` (§3 O4)
<!-- /ANCHOR:cross-refs -->
