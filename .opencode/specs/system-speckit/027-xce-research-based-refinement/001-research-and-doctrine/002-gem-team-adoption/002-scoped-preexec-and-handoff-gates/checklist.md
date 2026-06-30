---
title: "Verification Checklist: 027/006/002 Scoped Pre-Execution & Handoff Gates"
description: "Verification checklist for the three scoped, predicate-guarded gates: typed debug→implement handoff, boundary contract-first, and pre-mortem field."
trigger_phrases:
  - "027 phase 006/002"
  - "scoped preexec gates"
  - "debug handoff schema"
  - "boundary contract-first"
  - "pre-mortem field"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/002-gem-team-adoption/002-scoped-preexec-and-handoff-gates"
    last_updated_at: "2026-06-10T05:18:20Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Landed scoped agent gates"
    next_safe_action: "Report out-of-scope skill/scaffold items"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-002-scoped-preexec-gates-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 027/006/002 Scoped Pre-Execution & Handoff Gates

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`. Evidence: scope and requirements sections read before edits.
- [x] CHK-002 [P0] Technical approach documented in `plan.md`. Evidence: architecture and affected-surfaces sections read before edits.
- [x] CHK-003 [P0] All six original target surfaces read before editing. Evidence: three agents, `sk-code/SKILL.md`, debug-delegation template, and scaffold script were read.
- [x] CHK-004 [P1] `001-typed-agent-io-adapter` envelope (`confidence`/`failure_type`) confirmed available to reuse. Evidence: child 001 task/summary records Wave 1 as complete and contract result group existed before edits.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Each gate references exactly one `@orchestrate` predicate and skips when it is false. Evidence: orchestrator predicate table maps Gate A/B/C to one predicate each.
- [x] CHK-011 [P0] `@debug`'s 5-phase method is left untouched; only typed handoff fields are added. Evidence: Phase 1-5 headings remain present after edit.
- [x] CHK-012 [P0] Boundary contract-first is scoped to API/schema/integration and does not trigger on ordinary edits. Evidence: contract and orchestrator predicate table limit it to `api`, `schema`, and `integration`.
- [x] CHK-013 [P1] Edits follow existing agent/contract patterns and stay additive/advisory. Evidence: dispatch/result native formats remain authoritative; missing metadata remains non-rejection for ordinary work.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] A low/typo/docs task triggers none of the three gates. Evidence: all predicates are false for low docs/typo work.
- [x] CHK-021 [P0] A medium/high task carries the pre-mortem field; a low task omits it. Evidence: orchestrator task format gates pre-mortem on medium/high only.
- [x] CHK-022 [P0] A debug-to-implement crossing carries the typed `root_cause`/`target_files`/`fix_recommendations`/`confidence` handoff. Evidence: debug emits, orchestrator carries, code validates the same fields.
- [x] CHK-023 [P0] `@code` returns BLOCKED/LOW_CONFIDENCE (not a guessed fix) when a required handoff field is missing. Evidence: code agent diagnosis-based validation section.
- [x] CHK-024 [P1] An API/schema/integration change requires a contract / boundary test / acceptance check before edits. Evidence: shared contract and orchestrator pre-execution predicates; direct `sk-code` edit flagged out of approved write scope.
- [x] CHK-025 [P1] A legacy `debug-delegation.md` outside the new crossing warns rather than fails. Evidence: contract and agent docs state warning/manual verification behavior.
- [x] CHK-026 [P1] `scaffold-debug-delegation.sh` typed-field smoke test was out of approved write scope. Evidence: script read; no edit or smoke test claimed because scaffold changes were not approved.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class documented as `cross-consumer` for the typed handoff (emitter `@debug`, carrier `@orchestrate`, validator `@code`). Evidence: implementation summary documents emitter/carrier/validator flow.
- [x] CHK-FIX-002 [P0] Same-class producer inventory covers all three predicate definitions in `@orchestrate`. Evidence: grep verification covered `diagnosis_crosses_agents`, `change_class`, and `complexity`.
- [x] CHK-FIX-003 [P0] Consumer inventory confirms `root_cause`/`target_files`/`fix_recommendations`/`confidence` are consistent across allowed agent surfaces. Evidence: debug/orchestrate/code mirrors use the same fields; template/scaffold consistency is flagged out of approved write scope.
- [x] CHK-FIX-004 [P1] Gate matrix axes and row count are listed before completion is claimed. Evidence: implementation summary lists complexity, change class, crossing, completeness, and provenance axes.
- [x] CHK-FIX-005 [P1] Evidence is pinned to explicit changed files and verification commands. Evidence: implementation summary records changed file groups and check commands; no git commit was made.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: text-only agent/contract/spec-doc edits introduce no credentials.
- [x] CHK-031 [P0] No new network or provider calls; `@debug` remains user-opt-in (no auto-dispatch). Evidence: debug invocation boundary unchanged.
- [x] CHK-032 [P1] No governance/validator file (`validate.sh`, `check-completion.sh`, `spec-doc-structure`) modified. Evidence: no validator files edited.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, and `tasks.md` remain synchronized for the approved write scope. Evidence: tasks and implementation summary record the out-of-scope skill/scaffold items.
- [x] CHK-041 [P1] Gate A is documented as a downscale of Gem's `debugger_diagnosis` check, not a novel invention. Evidence: contract and debug agent wording.
- [x] CHK-042 [P1] Stale scaffold schema comment was identified but not corrected because the scaffold script was out of approved write scope. Evidence: script read and flag recorded.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No scratch files left outside this packet. Evidence: no scratch artifacts were created.
- [x] CHK-051 [P1] Changed files stayed within the user-approved paths: agent mirrors, shared contract, and phase docs. Evidence: mirrors were required by user scope; disallowed skill/script paths were not edited.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 13 | 13/13 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-10
<!-- /ANCHOR:summary -->
