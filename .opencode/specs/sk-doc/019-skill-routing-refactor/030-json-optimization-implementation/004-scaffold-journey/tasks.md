---
title: "Tasks: Complete the Scaffold-to-Route Journey"
description: "Tasks for auto-running the H/S class gate --fix from init_skill.py, writing a compiler-valid derived block, single-sourcing S-class config defaults, and adding the joined scaffold-to-route test."
trigger_phrases:
  - "scaffold to route journey tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/004-scaffold-journey"
    last_updated_at: "2026-07-29T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "030-json-optimization-implementation/004-scaffold-journey"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Complete the Scaffold-to-Route Journey

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-01 Re-confirm every `file:line` cited in `spec.md`/`plan.md` against the checked-out tree — `init_skill.py`, `generate-leaf-manifest.cjs`, `ci-skill-root-metadata.cjs`, `skill_graph_compiler.py`, `skill-derived-v2.ts`, `create-journey-proof.test.cjs`, `discovery-pipeline-parity.vitest.ts` — and note any drift before writing code
- [ ] T-02 Decide the config single-sourcing direction (plan.md §3.3): a shared default data file read by both `init_skill.py` and `generate-leaf-manifest.cjs`, or a minimal scaffolded literal that leans on `readStandaloneConfig`'s existing fallback — record the choice and why
- [ ] T-03 Decide the joined test's authoring shape (plan.md §3.4): plain self-running `.cjs` shelling into the TS/vitest ingest helpers, or a `.vitest.ts` sibling to `discovery-pipeline-parity.vitest.ts` — record the choice and update `tests/README.md`'s file table to match once written
- [ ] T-04 Capture the current (pre-fix) baseline: run `create-journey-proof.test.cjs` and note its existing `checked=2 passed=2 failed=0 fixed=2` line, and run `skill_graph_compiler.py`'s validator against a scaffold produced by the unmodified `init_skill.py` to confirm it currently fails on the missing `derived` fields — this is the regression baseline this phase must move
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-05 Add a scoped class-gate `--fix` helper to `init_skill.py`, mirroring `_run_manifest_command`'s subprocess-and-JSON-parse pattern (`init_skill.py:354-393`): invoke `ci-skill-root-metadata.cjs --skills-dir <parent> --format json --fix`, read only the `results[]` entry matching the new `skill_name`, and treat that entry's `status`/`fixed`/`violations` — never the aggregate exit code — as the outcome
- [ ] T-06 Call the new helper at the tail of `init_skill()` (standalone, after `leaf-manifest.config.json` is written); on failure, print the cause and return `None` rather than reporting the scaffold as successful
- [ ] T-07 Call the new helper at the tail of `init_parent_skill()` (hub, after `command-metadata.json` is written and before the existing `--compiled-routing` mint/freshness block); on failure, print the cause and return `None`
- [ ] T-08 Extend the standalone `derived` block literal (`init_skill.py:287-293`) with non-empty `key_files`, `entities` (at least one object with valid `name`/`kind`/`path`/`source`, `kind` in `ALLOWED_ENTITY_KINDS`), and a non-empty `causal_summary`, composed after every referenced file exists on disk
- [ ] T-09 Extend the parent-hub `derived` block literal (`init_skill.py:541-558`) the same way, referencing files the hub scaffold has already written by that point (`SKILL.md`, `mode-registry.json`, `hub-router.json`, etc.)
- [ ] T-10 Implement the config single-sourcing decision from T-02 in `generate-leaf-manifest.cjs`'s `readStandaloneConfig()` and `init_skill.py`'s scaffolded literal; update `skill-leaf-manifest-config-template.json`'s documented defaults to match
- [ ] T-11 Write the new joined test per the T-03 shape: scaffold one S-class and one H-class skill into a temp tree; run the class gate `--fix`; ingest both into a temp advisor DB (`initDb`/`indexSkillMetadata` pattern); run an unmocked scorer call proving at least one representative prompt resolves to the scaffolded skill/hub; run `compiled-route-manifest.cjs` mint + freshness against the hub root; clean up in `try/finally`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-12 Run `create-journey-proof.test.cjs`, `skill-root-metadata-contract.test.cjs`, `leaf-resource-contract.test.cjs`, and the new joined test; confirm all pass with the modified `init_skill.py`/`generate-leaf-manifest.cjs`
- [ ] T-13 Run `skill_graph_compiler.py`'s validator directly against a fresh scaffold's `graph-metadata.json` (standalone and hub) and confirm zero errors with no hand-editing — the REQ-003 proof
- [ ] T-14 Re-run `ci-skill-root-metadata.cjs` plain (no `--fix`) against a fresh scaffold and confirm `fixed=0` on the second pass — the idempotency proof
- [ ] T-15 Run a scaffold against a temp `--skills-dir` that also contains one deliberately non-conforming sibling root; confirm the new scaffold still reports success — the REQ-007 fix-scoping proof
- [ ] T-16 Reconcile `spec.md`/`checklist.md`/`implementation-summary.md` completion metadata against actual evidence; run `validate.sh <this-folder> --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Every T-nn task above is `[x]` with cited evidence; all seven `spec.md` requirements (REQ-001 through REQ-007) are verified against real command output, not assumed; the new joined test and every regression suite pass; and `validate.sh --strict` on this folder reports Errors:0 before this phase is marked Complete.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · QA `checklist.md` · Outcome `implementation-summary.md` (after the work lands)
<!-- /ANCHOR:cross-refs -->
