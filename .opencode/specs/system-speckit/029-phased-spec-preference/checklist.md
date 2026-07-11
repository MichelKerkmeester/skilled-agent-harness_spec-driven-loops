---
title: "Verification Checklist: Analyze system-spec-kit routing docs and design enforcement of a phased-spec-over-new-folder preference policy"
description: "Verification Date: 2026-07-11"
trigger_phrases:
  - "verification"
  - "checklist"
  - "name"
  - "template"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-phased-spec-preference"
    last_updated_at: "2026-07-11T15:51:28.214Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/029-phased-spec-preference"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Analyze system-spec-kit routing docs and design enforcement of a phased-spec-over-new-folder preference policy

<!-- SPECKIT_LEVEL: 2 -->
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

- [x] CHK-001 [P0] Requirements documented in `spec.md` - [evidence: file exists, REQ-001..004 filled]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` - [evidence: file exists, 3 phases filled]
- [x] CHK-003 [P1] `openai` provider auth pre-flight confirmed before dispatch - [verified: `opencode providers list` shows OpenAI configured]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

_No code in this packet — items below cover the dispatched proposal's quality instead._

- [x] CHK-010 [P0] GPT-5.6 proposal names concrete file paths + exact wording, not generic advice - [verified: review - 7 files, diff-ready blocks, in `scratch/gpt-5.6-sol-proposal.md`]
- [x] CHK-011 [P0] Proposal's claims about existing docs verified against the actual files (not trusted as stated) - [evidence: `grep`/`diff`/`ls` on 8/8 highest-stakes claims, see `implementation-summary.md` Verification table]
- [x] CHK-012 [P1] "Small task" / "new & unrelated" exemption heuristic is concrete, not vague judgment - [evidence: ties to existing LOC-soft-guidance + exempt-tier + `quick_reference.md` §8 update-vs-create criteria, no new scoring axis invented]
- [x] CHK-013 [P1] Proposal checked against `phase_system.md` §2 thresholds for internal consistency - [verified: review - proposal explicitly preserves the score>=25 AND level>=3 dual-threshold gate in every section, changes recommendation priority only]
- [x] CHK-014 [P0] `memory_choice`/`memory_loaded` gap independently verified as a real defect (not intentional design) before implementation - [evidence: Fable-model agent verdict "real gap — implement it", grounded in 4 independent proofs cross-checked against actual files, see `implementation-summary.md` Round 9]
- [x] CHK-015 [P0] `context_loading` fix applied across all 16 YAML files, verified by a separate read-only agent (not the implementing agents' self-report) - [evidence: 20/20 PASS in the independent verify-phase agent's PASS/FAIL table, `implementation-summary.md` Verification]
- [x] CHK-016 [P1] `context_loading` fix scoped to only `.opencode/commands/create/assets/`, no unrelated files touched - [evidence: `git diff --stat` shows exactly 20 files changed in that directory, 335 insertions/42 deletions, additive-only]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met - [evidence: 2/2 success criteria met (SC-001, SC-002) - proposal names concrete files/wording, cross-checked before presenting]
- [x] CHK-021 [P0] Manual testing complete - [evidence: dispatch ran end-to-end, exit code 0, output parsed and read]
- [ ] CHK-022 [P1] Edge cases tested - N/A, no code in this packet
- [ ] CHK-023 [P1] Error scenarios validated - N/A, no code in this packet
- [x] CHK-024 [P0] All 16 `context_loading`-fix YAML files parse cleanly - [evidence: `python3 -c "import yaml..."` PASS on all 16, confirmed independently by both implementing and verify-phase agents]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets - [evidence: `grep` for credential-shaped tokens in `scratch/dispatch-prompt.txt` and `scratch/gpt-5.6-sol-proposal.md` found none; auth handled via opencode's own credential store]
- [ ] CHK-031 [P0] Input validation implemented - N/A, no code in this packet
- [x] CHK-032 [P1] Auth/authz working correctly - [evidence: `opencode providers list` confirmed OpenAI configured before dispatch]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized - [evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md` all reflect the same dispatch-then-verify flow]
- [ ] CHK-041 [P1] Code comments adequate - N/A, no code in this packet
- [ ] CHK-042 [P2] README updated (if applicable) - N/A, no README affected
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in `scratch/` only - [evidence: `dispatch-prompt.txt`, `gpt-5.6-sol-analysis.json`, `gpt-5.6-sol-proposal.md` all under `scratch/`]
- [x] CHK-051 [P1] `scratch/` cleaned before completion - [evidence: kept intentionally as the raw evidence trail for the proposal; `scratch/` is git-ignored so it doesn't pollute the tree]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 10/11 (1 N/A: input validation - no code) |
| P1 Items | 11 | 8/11 (3 N/A: edge cases, error scenarios, code comments - no code) |
| P2 Items | 1 | 0/1 (N/A: no README affected) |

**Verification Date**: 2026-07-11
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->

