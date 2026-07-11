---
title: "Verification Checklist: Phase 6: adapter-sk-git-and-sk-design"
description: "Verification Date: 2026-07-11 - both adapters built and dry-verified against live data"
trigger_phrases:
  - "verification"
  - "checklist"
  - "phase 006"
  - "adapter sk-git"
  - "adapter sk-design"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/006-adapter-sk-git-and-sk-design"
    last_updated_at: "2026-07-11T14:51:52Z"
    last_updated_by: "claude"
    recent_action: "Verified all checklist items with real evidence"
    next_safe_action: "Hand off to phase 007 sk-code adapter build"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-git.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/scripts/adapters/sk-design.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-059-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 6: adapter-sk-git-and-sk-design

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001..005 present at `spec.md:133-142`, each with a real `path:line` citation (e.g. `SKILL.md:298`).
- [x] CHK-002 [P0] Technical approach defined in plan.md — Architecture section names both adapters' `discover`/`standardSource`/`check` behavior; superseded by an actual build matching it.
- [x] CHK-003 [P1] Phase 005 adapter contract dependency identified and tracked — `sk-doc.cjs` read in full; both new adapters copy its exact module/CLI shape.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Adapter code passes lint/format checks — no `.eslintrc`/`eslint.config.*` exists at repo root or under `system-deep-loop/` for `.cjs` files (confirmed by search 2026-07-11), so `node --check` (syntax validity) is the applicable gate: both `sk-git.cjs` and `sk-design.cjs` pass clean. Stated honestly rather than claiming a lint pass that has no config to run against.
- [x] CHK-011 [P0] No console errors or warnings — both scripts run clean via their CLI subcommands (`discover`/`check`/`standard-source`) against real data with no uncaught exceptions or stderr noise on the success path.
- [x] CHK-012 [P1] Error handling implemented for empty-scope and missing-artifact edge cases — verified: off-label scope types return `{artifacts:[], nodes:[]}`; a deleted/nonexistent commit or branch produces a `P1` `adapter-error` finding, not a thrown exception; a malformed `tokens.json` produces `P1` `could-not-validate`.
- [x] CHK-013 [P1] Adapter code follows the phase-005 contract signature — both export `discover(scope)`, `standardSource(authority)`, `check(artifact, rules[, options])` with the identical calling shape `sk-doc.cjs` uses.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria in spec.md REQ-001..005 met — evidence trail in `spec.md:148-152` (SC-001..004), each citing a real dry-run command (e.g. `node sk-git.cjs discover HEAD~15 HEAD`).
- [x] CHK-021 [P0] Manual dry-run against a real commit range and a real DESIGN.md complete — `discover HEAD~15 HEAD` (sk-git) and `discover` over the real `design-md-generator/references/examples/` tree (sk-design), both against live repo state.
- [x] CHK-022 [P1] Edge cases tested: empty scope, exempt Git-generated subjects, missing DESIGN.md — empty/off-label scope confirmed empty-result; `Merge `-prefixed real commit confirmed exempt; a nonexistent branch/commit confirmed `adapter-error`, not a crash.
- [x] CHK-023 [P1] Error scenarios validated per spec.md Edge Cases section — the Git-generated-subject exemption (spec.md "Error Scenarios") verified against real `Merge` commits in this repo's own history; the "no DESIGN.md found" case is the natural `discover()` empty-array result, same code path as empty scope.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class — not applicable in the fix-bug sense (net-new adapters, no bug fix ships here); the two real bugs found during THIS phase's own dry-run construction (sk-git main-checkout false-positive, sk-design `extractSection`/frequency-dump false-positives) are each `instance-only` (a single function each, fixed in place, re-verified with no other producer of the same defect in either module).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep — confirmed by reading both full `.cjs` files end-to-end: `branchIsBackedByWorktree()` is the only caller of `git worktree list --porcelain` in `sk-git.cjs`; `extractSection()`/`FREQUENCY_DUMP_RE` are each used in exactly one call site in `sk-design.cjs`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — no other file in the repo requires either `.cjs` module yet (confirmed: neither is wired into phase 008's engine, which does not exist); both adapter `.md` docs were updated in the same pass to describe the fixed behavior, not the buggy first draft.
- [x] CHK-FIX-004 [P0] Not applicable in this phase - no security/path/parser/redaction fix ships here (adapters are net-new, read-only). `[deferred: not applicable, both adapters are net-new read-only planning code, no security or path-parsing fix ships this phase]`
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed — `plan.md:112` names the 2-authority x 3-method matrix (6 planned behaviors), all implemented (`sk-git.cjs`, `sk-design.cjs`).
- [x] CHK-FIX-006 [P1] Not applicable - no process-wide state is read or mutated by either adapter in v1. `[deferred: not applicable, neither adapter reads or mutates any process wide state in this v1 scope]`
- [x] CHK-FIX-007 [P1] Not applicable this phase - no prior finding is being fixed against a pinned SHA; the two bugs above were found and fixed within this same build pass, not against separately-landed code.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in adapter code — both files reviewed end-to-end; only repo-relative paths, regex constants, and one hardcoded commit SHA/date pair at `sk-git.cjs` (`HOOK_INSTALL_COMMIT_SHA`, the hook-install cutover marker, not a secret).
- [x] CHK-031 [P0] Input validation implemented for lane scope resolution — both adapters' `discover()` defer primary scope validation to `scripts/scoping.cjs`'s `validateScope()` (upstream, before `DISCOVER` calls either adapter) and add defense-in-depth repo-root containment checks of their own (`isInsideRepoRoot()`), mirroring `sk-doc.cjs`'s own documented pattern.
- [x] CHK-032 [P1] Not applicable - no auth/authz surface in this phase. `[deferred: not applicable, this phase has no authentication or authorization surface to validate]`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `checklist.md` all updated to Complete status in this same pass (2026-07-11), cross-consistent evidence.
- [x] CHK-041 [P1] Adapter code comments adequate once written — both `.cjs` files carry section-header comments, JSDoc on every exported function, and inline citations for every ported rule (exact source file:line).
- [ ] CHK-042 [P2] README updated (deferred to phase 009 cutover) — deferred, matching the pre-existing plan; not this phase's scope.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — all dry-run scratch files used during verification lived under the session scratchpad or a `.tmp-test-*` directory inside the target adapters folder, both removed after use.
- [x] CHK-051 [P1] scratch/ cleaned before completion — confirmed via `git status --porcelain` showing no stray `.tmp-test-*` or debug files remaining.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 0/1 (CHK-042 deferred to phase 009, documented reason above) |

**Verification Date**: 2026-07-11. Both adapters built, dry-verified against live git state and real `DESIGN.md`/`tokens.json` fixtures, two real bugs found and fixed during that same verification pass. Known, named limitation: no committed vitest suite (see plan.md Testing Strategy) — scope-locked to exactly the 6 files this phase's Files-to-Change table names, none of which is a test file.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
