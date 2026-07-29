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

- [ ] T-01 Re-run repo-wide grep for `"trigger_examples"`, `"supported_surfaces"`, `"opencode_languages"` across `.opencode/skills/**/description.json` and confirm the carrying-hub list still matches `spec.md` §3 (7 / 2 / 2 hubs)
- [ ] T-02 Re-run repo-wide grep for `"supported_surfaces"`, `"peer_resource_categories"`, `"causal_summary"` across `.opencode/skills/**/graph-metadata.json` and confirm `sk-code` is still the sole carrier of the first two
- [ ] T-03 Re-run repo-wide grep for `packetSkillName` and `tieBreak` across `*.ts`/`*.js`/`*.cjs` (excluding `/specs/`) and reconfirm the production-vs-test-only consumer split from `spec.md` REQ-005/REQ-006
- [ ] T-04 Capture pre-change baseline: `ci-skill-root-metadata.cjs`, `parent-skill-check.cjs` for `sk-code` and `sk-doc`, `skill_graph_compiler.py` validate mode, `routing-registry-drift-guard.vitest.ts`
- [ ] T-05 Read phase 003's decision artifact and resolve REQ-004's branch (Python-schema-canonical vs TS-schema-canonical) before touching any `causal_summary` field
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-06 Delete `trigger_examples` from all 7 carrying `description.json` files (REQ-001)
- [ ] T-07 Delete `supported_surfaces` and `opencode_languages` from `sk-code/description.json` and `sk-doc/description.json` (REQ-002)
- [ ] T-08 Delete `derived.supported_surfaces` and `derived.peer_resource_categories` from `sk-code/graph-metadata.json` (REQ-003)
- [ ] T-09 Execute the REQ-004 `causal_summary` branch fleet-wide per T-05's resolution: either re-document it as descriptive-only prose (Python-canonical branch) or fold the change into phase 003's migration and record the no-op here (TS-canonical branch)
- [ ] T-10 Reorder `sk-doc/hub-router.json`'s `routerPolicy.tieBreak` to match `scoreTieBreakOrder()`'s derived order; add the exception comment (REQ-005)
- [ ] T-11 Resolve `mode.advisorRouting.packetSkillName` per the chosen branch: delete fleet-wide + update `routing-registry-drift-guard.vitest.ts` + update `init_skill.py`'s scaffold literal, OR keep it and add the redundant-self-check doc note to `mode-registry.json`'s `advisorRoutingContract` block (REQ-006)
- [ ] T-12 Add the spec-folder-vs-skill-root script-name-collision note to `skill-root-metadata-contract.md`, adjacent to the existing schema-separation note at line 32 (REQ-007)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-13 Re-run `ci-skill-root-metadata.cjs` fleet-wide and compare against the T-04 baseline
- [ ] T-14 Re-run `parent-skill-check.cjs` for `sk-code` and `sk-doc` and compare against the T-04 baseline
- [ ] T-15 Re-run `skill_graph_compiler.py` validate mode fleet-wide and compare against the T-04 baseline
- [ ] T-16 Re-run `routing-registry-drift-guard.vitest.ts` and confirm it is green under whichever REQ-006 branch was chosen
- [ ] T-17 Run `git diff --stat` and confirm only the files named in `spec.md` §3 are touched
- [ ] T-18 Update `checklist.md` and `implementation-summary.md` with the gathered evidence
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
