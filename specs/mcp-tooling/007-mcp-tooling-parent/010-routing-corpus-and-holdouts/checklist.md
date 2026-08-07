---
title: "Verification Checklist: Phase 10: routing-corpus-and-holdouts"
description: "Verification Date: 2026-07-16"
trigger_phrases:
  - "routing corpus holdouts checklist"
  - "verification"
  - "checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/010-routing-corpus-and-holdouts"
    last_updated_at: "2026-07-16T14:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All applicable items verified with evidence"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-010-routing-corpus-and-holdouts"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 10: routing-corpus-and-holdouts

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

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` §4 lists REQ-001 through REQ-005 (5-of-5 with concrete acceptance criteria)
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` §1-§4; mirror-and-append architecture with named model artifacts (MT-H01/MT-H02 contract, existing corpus row schema)
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: `capture-scorer-eval-baseline.mjs` and `scorer-eval-baseline-ratchet.vitest.ts` located and exercised under `system-skill-advisor/mcp_server/`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks
  - **Evidence**: no code changed; `labeled-prompts.jsonl` parses 200-of-200 lines as JSON; baseline fixture is script-generated JSON
- [x] CHK-011 [P0] No console errors or warnings introduced
  - **Evidence**: `npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` reports `Tests 7 passed (7)` with no stderr noise
- [x] CHK-012 [P1] Error handling implemented
  - **Evidence**: not applicable, 0/7 touched files are executable code (`git status` shows only `.md`, `.jsonl`, `.json`); `scorer-eval-baseline-ratchet.vitest.ts` is the standing error detector for these data surfaces
- [x] CHK-013 [P1] Code follows project patterns
  - **Evidence**: new holdouts reproduce MT-H01/MT-H02 frontmatter keys exactly (`stage: holdout`, `blindToRouterKeywords: true`); corpus rows reproduce the existing `skill_routing_prompts` key set
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met
  - **Evidence**: REQ-001..REQ-005 verified 5-of-5; per-REQ evidence in `tasks.md` T003-T011
- [x] CHK-021 [P0] Manual testing complete
  - **Evidence**: `wc -l labeled-prompts.jsonl` = 200; line-by-line JSON parse `invalid: 0`; 6-of-6 `expected_intent` mode ids enumerated across MT-H01..MT-H06
- [x] CHK-022 [P1] Edge cases tested
  - **Evidence**: 2/2 adjacency pairs written into the fixtures: MT-H01/MT-H04 are chrome-vs-aside inverses (`holdout_browser_inspect.md:17` boundary section); MT-H05/MT-H06 document the refero-vs-mobbin defer as tolerable secondary outcome
- [x] CHK-023 [P1] Error scenarios validated
  - **Evidence**: ratchet gate is the drift detector; it failed before re-capture (pre-existing July 10 drift) and passes 7/7 after, proving it discriminates
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class
  - **Evidence**: the one healed defect (stale baseline fixture after the July 10 relabel) classed `instance-only` fixture drift; all other work is additive fixtures
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep
  - **Evidence**: `scorer-eval-baseline.json` is the only fixture the capture script writes (single `OUTPUT_JSON` target in `capture-scorer-eval-baseline.mjs`); no sibling baseline exists under `routing-accuracy/`
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests
  - **Evidence**: fixture consumer inventory in `plan.md` FIX ADDENDUM; `scorer-eval-baseline-ratchet.vitest.ts` is the single consumer and passes 7/7
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests
  - **Evidence**: not applicable, 0/7 touched files are security/path/parser/redaction code (`git status` over both skill trees shows data and fixture surfaces only)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed
  - **Evidence**: verification matrix = 1 corpus parse + 1 `capture-scorer-eval-baseline.mjs` run + 1 ratchet run (7/7 tests) + 6 holdout-coverage checks + 1 spec-child validate; 10/10 rows run
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state
  - **Evidence**: not applicable, `scorer-eval-baseline-ratchet.vitest.ts` reads only the 3 checked-in fixture files it hashes; 0 process-wide state reads involved
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range
  - **Evidence**: baseline fixture pins `capturedAtSha: 2146dee114`; spec-doc work performed on `skilled/v4.0.0.0` as working-tree changes at verification time, to be bound to the commit SHA at commit time
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - **Evidence**: 7/7 corpus rows and 5/5 touched holdout files contain only synthetic prompts; `rg -i "token|api[_-]?key|secret"` over the added lines returns 1 hit and it is the phrase "design tokens" in rr-hub6-202's prompt text, not a credential
- [x] CHK-031 [P0] Input validation implemented
  - **Evidence**: not applicable, 0 input-accepting code authored; corpus integrity enforced by the line-by-line `JSON.parse` check (200/200 valid) and the ratchet's hash comparison
- [x] CHK-032 [P1] Auth/authz working correctly
  - **Evidence**: not applicable, 0/7 touched files carry an auth surface (`git status` shows playbook fixtures and routing-accuracy data only)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: all three docs describe the same 7-file, 11-task, 4-gate delivery; file inventory matches `git status` for the touched trees
- [x] CHK-041 [P1] Code comments adequate
  - **Evidence**: not applicable, 0 code authored; 5/5 touched holdout files carry an `## Expected Behavior` section explaining their routing contract in place of comments
- [x] CHK-042 [P2] README updated (if applicable)
  - **Evidence**: not applicable; `routing-accuracy/README.md` already documents the capture/ratchet workflow used here, and holdout files are self-describing playbook fixtures
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: verification ran via inline Bash; `git status` shows no stray files in packet or spec trees
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: `ls scratch/` in this packet returns only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-16
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
