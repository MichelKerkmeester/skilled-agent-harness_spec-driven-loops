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

- [x] T-01 003 + 004 confirmed shipped and merged before this landed [evidence: both Status Complete on `origin/skilled/v4.0.0.0` prior to this change]
- [x] T-02 002's pin read [evidence: `002-baseline-capture/baseline/routing-baseline.json` `corpus` block — sha256 per corpus file; the CI hash check reads it at run time]
- [x] T-03 Compiler clean baseline [evidence: `--validate-only` → "VALIDATION PASSED: all metadata files are valid" (11 roots), exit 0]
- [x] T-04 Scorer baseline recorded — **in both regimes**: sqlite-warm local 0.5692/0.9843/TT 108 (matches 002's pin) and the no-sqlite fallback CI actually runs 0.5333/0.9843/TT 101, FT 3, FF 1 (deterministic, two masked runs byte-identical); the fallback numbers are the floor source [evidence: masked-DB runs]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-05 Compiler step added to `routing-drift` after the class-contract step [evidence: workflow diff — stdlib-only, no install needed in the lean job]
- [x] T-06 Accuracy step added — **in `golden-prompt-gate`, not the lean job** (its gate3 leg imports the built shared dist that job's install step produces), with a sha256 corpus-pin check before scoring and the T-04 fallback-regime floors [evidence: workflow diff; deviation recorded in spec amendment]
- [x] T-07 Trigger paths — compiler + `routing-accuracy/**` already covered by the existing `mcp-server/**` glob (no-op); the 002 baseline dir added to both blocks so a pin edit fires the gate [evidence: workflow diff; deviation recorded]
- [x] T-08 Inline rationale comment added in the file's comment style — why an unpinned corpus is unsafe, why floors are fallback-regime [evidence: the accuracy step's comment block]
- [x] T-09 Four pre-existing `routing-drift` steps byte-unchanged [evidence: diff shows only additive step + paths lines]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-10 CI-condition dry run — the operative local-state difference (the gitignored `skill-graph.sqlite`) was masked and both steps re-run: compiler exit 0, gated scorer exit 0 with the shipped floors; this is what exposed and fixed the regime gap a fresh clone would have hit [evidence: masked-DB runs; the `npm ci` legs remain first-push-confirmable, as with the sibling golden gate]
- [x] T-11 Compiler negative [evidence: scratch tree with a broken `derived.key_files` → `ERRORS in sk-git … path does not exist`, `VALIDATION FAILED`, exit 2]
- [x] T-12 Accuracy negative [evidence: raised floor → exit 1; tampered corpus copy → hash-pin check names the drifted file, exit 2]
- [x] T-13 Paths syntax [evidence: the added entry is byte-parallel to the existing quoted `**` glob entries in the same lists; workflow YAML parses]
- [ ] T-14 `validate.sh --strict` — **BLOCKED** repo-wide (concurrent session's incomplete pi-hook relocation breaks the spec-kit orchestrator build); verified by the direct positive/negative gate runs instead [documented]
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
