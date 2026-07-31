---
title: "Verification Checklist: Create/Doctor/Skill-Advisor Core Alignment Fixes"
description: "Verification Date: 2026-07-31"
trigger_phrases:
  - "core alignment fixes checklist"
  - "advisor index handoff verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/035-create-doctor-skill-advisor-alignment/002-core-alignment-fixes"
    last_updated_at: "2026-07-31T03:28:14Z"
    last_updated_by: "claude-code"
    recent_action: "A1-A7 implemented and verified; checklist complete"
    next_safe_action: "None — packet Complete"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "035-002-core-alignment-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Create/Doctor/Skill-Advisor Core Alignment Fixes

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

- [x] CHK-001 [P0] Requirements documented in spec.md — `REQ-001` through `REQ-005` in Section 4, all citing research.md Section 6 Track A findings
- [x] CHK-002 [P0] Technical approach defined in plan.md — `Section 4` lists 7 dependency-ordered phases (A1-A7), shared-vocabulary-not-shared-formatter architecture
- [x] CHK-003 [P1] Dependencies identified and available — sole dependency is `../001-research/research/research.md`, already Complete
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — every edited YAML re-validated with `python3 -c "import yaml; yaml.safe_load(...)"` immediately after each edit (11 files, all clean)
- [x] CHK-011 [P0] No console errors or warnings — `advisor-index-handoff.md` passes `validate_document.py` with 0 issues
- [x] CHK-012 [P1] Error handling implemented — `UNAVAILABLE (retryable)` vs `FAILED` distinction implemented per Theme E1/E4 (transport failure vs structural finding never conflated)
- [x] CHK-013 [P1] Code follows project patterns — new tests follow the existing `speckit-goal-offer-contract.test.cjs` static-assertion pattern per Theme F3/F8, not a new pattern
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — REQ-001 (`route-validate.sh` 10/10, 0 errors), REQ-002 (severity derivation wired + tested), REQ-003 (handoff doc authored + wired into all 6 full-handoff surfaces), REQ-004 (scoped generator used, fleet `--fix` never invoked as a create-time side effect), REQ-005 (13 new contract-test assertions, 13/13 passing)
- [x] CHK-021 [P0] Manual testing complete — `route-validate.sh`, `parent-skill-check.cjs` (7/7 hubs), fleet `ci-skill-root-metadata.cjs` (11/11 roots) all re-run and pass after every relevant edit
- [x] CHK-022 [P1] Edge cases tested — standalone vs parent H-only field omission (A6a test 5/6), full-create vs full-update freshness (write vs read-only `--check`), reference/asset-only narrow-signal-only branch (A6a test 5)
- [x] CHK-023 [P1] Error scenarios validated — `skill_graph_validate` unavailable/malformed-payload path renders `UNAVAILABLE (retryable)` per Theme E4, distinct from a structural `fail`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class — `class-of-bug` (A1: 3 independently-diagnosed defects, no shared root cause) and `cross-consumer` (A2-A6: one vocabulary rendered by 8 workflow-asset surfaces)
- [x] CHK-FIX-002 [P0] Same-class producer inventory — every surface that renders a completion report after touching a skill root was found and updated: `create-skill-auto.yaml`, `create-skill-confirm.yaml`, `create-skill-presentation.txt` (standalone); `create-skill-parent-auto.yaml`, `create-skill-parent-confirm.yaml`, `create-skill-parent-presentation.txt` (parent); confirmed via direct read of every asset file in `.opencode/commands/create/assets/`, not assumed from `-auto.yaml` alone
- [x] CHK-FIX-003 [P0] Consumer inventory — `doctor-skill-advisor.yaml` (A2), `_routes.yaml`/`speckit.md` (A1), `skill-parent.md` (A1), and the new `advisor-index-handoff.md` (A4) all confirmed consistent; the new A6a/A6b tests pin every one of these cross-file relationships so future drift fails loudly
- [x] CHK-FIX-004 [P0] [deferred: documentation and workflow asset alignment fix only, no security path parser or redaction change, no adversarial table applies]
- [x] CHK-FIX-005 [P1] [deferred: no matrix style fix exists anywhere in this packet]
- [x] CHK-FIX-006 [P1] [deferred: no process wide or global state is read by any test in this packet]
- [x] CHK-FIX-007 [P1] Evidence pinned to this session's actual command output (route-validate.sh/parent-skill-check.cjs/node --test runs captured verbatim in implementation-summary.md), not a moving branch-relative claim
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] [deferred: no hardcoded secrets exist because no secret bearing file was touched by this packet]
- [x] CHK-031 [P0] [deferred: no user input handling code was changed anywhere in this packet]
- [x] CHK-032 [P1] [deferred: no authentication or authorization surface was touched by this packet]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — `tasks.md` shows 14/14 tasks complete; spec.md Files-to-Change table reconciled to the actual broader scope (confirm.yaml mirrors) in this same pass
- [x] CHK-041 [P1] [deferred: no source code comments were added because every new activity line is self explanatory workflow asset prose]
- [x] CHK-042 [P2] README updated — N/A, no README in scope
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] [deferred: no temporary file was created anywhere outside the session scratchpad directory]
- [x] CHK-051 [P1] [deferred: no scratch file was written at all for this packet so nothing needs cleanup]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 11 | 11/11 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-07-31

**Known pre-existing, unrelated failures** (confirmed via `git stash` baseline diff against commit `6fbaee057c`, identical failure before and after this packet's changes — not a regression):
- `create-journey-proof.test.cjs`: `GRAPH_METADATA_UNKNOWN_KEY`/`INTENT_SIGNALS_BELOW_FLOOR` on its own scaffolded fixtures
- `parent-skill-check-leaf-manifest.test.cjs`: `MODULE_NOT_FOUND` for `./lib/s-class-config-defaults.json` in its fixture-copy list (stale relative to `generate-leaf-manifest.cjs`'s current dependency)
- `test_create_skill_contract.py`: 2/23 fail on compiled-routing counter/path-ordering state (`test_parent_scaffold_ready_mints_and_verifies_canonical_manifest`, `test_compiled_routing_validator_rejects_malformed_manifest`)
<!-- /ANCHOR:summary -->
