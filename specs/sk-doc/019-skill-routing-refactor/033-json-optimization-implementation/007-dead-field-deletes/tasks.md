---
title: "Tasks: Remove Routing-Neutral Dead Fields"
description: "Tasks for grep-verifying, deleting, and reconciling the routing-neutral dead-field set (O5 half + O11) from the 029 skill/advisor JSON optimization research."
trigger_phrases:
  - "dead field deletes tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/007-dead-field-deletes"
    last_updated_at: "2026-07-29T09:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "causal_summary disposition gated on phase 003's canonical-derived-owner decision"
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-dead-field-deletes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Remove Routing-Neutral Dead Fields

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Carriers re-verified live [evidence: fresh grep — trigger_examples in exactly the 7 named description.json; supported_surfaces/opencode_languages only sk-code + sk-doc]
- [x] T-02 graph-metadata carriers re-verified [evidence: sk-code sole carrier of derived.supported_surfaces + derived.peer_resource_categories]
- [x] T-03 Consumer split re-verified — with one premise correction [evidence: nested advisorRouting.packetSkillName's only reader = drift-guard vitest; BUT system-deep-loop's 7 modes had NO top-level packetSkillName (nested was their sole carrier) — the spec's fleet-wide-duplicate premise was wrong for that hub; amendment recorded in spec.md]
- [x] T-04 Pre-change baseline captured [evidence: fleet gate 11/11, doctors sk-code/sk-doc exit 0, compiler PASSED, drift-guard 7/7, corpus warm 0.5692/0.9843/108-3-1 + fallback 0.5333/0.9843/101-3-1]
- [x] T-05 REQ-004 branch resolved from 003's decision [evidence: 003 kept the Python-compiler shape canonical (merged core + TS-additive) → Python-canonical branch: annotate, don't remove]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-06 trigger_examples deleted from all 7 [evidence: SOL-high executor pass, LUNA-xhigh review angle 1/2 CONFIRMED-CLEAN]
- [x] T-07 supported_surfaces + opencode_languages deleted from sk-code + sk-doc description.json [evidence: same pass, byte-minimal diffs]
- [x] T-08 sk-code derived orphans deleted [evidence: compiler still PASSED — neither field in its required list]
- [x] T-09 Python-canonical branch executed [evidence: two-line durable-why comment above the compiler's causal_summary required check (zero logic change, LUNA angle 6) + prose-not-routing-input note in the contract doc]
- [x] T-10 tieBreak reordered to the exact derived `Object.keys(routerSignals)` order [evidence: LUNA angle 4 — exact 12-entry permutation match; exception note placed in the contract doc (JSON carries no comments; an unknown routerPolicy key risked the doctor)]
- [x] T-11 DELETE branch chosen + one amendment [evidence: nested key removed on all 40 modes; deep-loop's 7 modes FIRST gained top-level packetSkillName (= packet; all 3d preconditions pre-verified: frontmatter==leaf, gfm flags correct); vitest asserts top-level === packet fleet-wide; init_skill scaffold literal updated; LUNA angles 3/5/7 CONFIRMED-CLEAN]
- [x] T-12 Script-name-collision note added to skill-root-metadata-contract.md [evidence: contract doc diff, LUNA angle 1 in-scope]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-13 Fleet gate post [evidence: checked=11 passed=11 failed=0 — matches baseline; leaf + derived freshness also 11/11]
- [x] T-14 Doctors post [evidence: sk-code, sk-doc AND system-deep-loop (whose modes gained keys) all exit 0]
- [x] T-15 Compiler post [evidence: VALIDATION PASSED, all 11]
- [x] T-16 Drift-guard green under the DELETE branch [evidence: 4-file vitest set 31/31, incl. drift-guard + golden suite]
- [x] T-17 Scope confirmed [evidence: LUNA angle 1 — exactly the 20 in-scope files changed; the 2 out-of-scope dirty files belong to a different live session and are excluded from the commit]
- [x] T-18 Docs updated with evidence [evidence: this file + checklist.md + implementation-summary.md; corpus BOTH regimes byte-identical pre/post]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Every field named in REQ-001 through REQ-003 is removed with a zero-reader grep proof; REQ-004's branch is recorded against phase 003's actual decision; REQ-005's `tieBreak` reorder plus comment lands; REQ-006's chosen branch is fully applied (including any dependent test/scaffold edits); REQ-007's doc note exists; all quality gates in `plan.md` §2 are green; the diff is scope-clean.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · QA `checklist.md` · Source research `../../029-skill-json-optimization-research/research/research.md`
<!-- /ANCHOR:cross-refs -->
