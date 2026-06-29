---
title: "Verification Checklist: D5-R6 — Reject register=unknown at cross-CLI design dispatch (deny-by-default register acceptance)"
description: "P0/P1/P2 verification evidence for the deny-by-default register-acceptance gate at the cross-CLI design dispatch boundary, including fix-completeness for the class-wide register gap and the honest enforceable-vs-residual split."
trigger_phrases:
  - "d5-r6 checklist"
  - "reject register unknown checklist"
  - "register acceptance cli verification"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/006-reject-register-unknown"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify all P0/P1 checks with grep and truth-table evidence"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/cli_child_pairing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r6-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: D5-R6 — Reject register=unknown at cross-CLI design dispatch (deny-by-default register acceptance)

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

- [x] CHK-001 [P0] Accepted posture set located as the single membership source of truth
  - **Evidence**: `registerPolicy.accepted == ["brand","product"]` confirmed across the design commands in `command-metadata.json`; consumed read-only, file untouched
- [x] CHK-002 [P0] Carrier field located and `unknown` semantics confirmed
  - **Evidence**: `Register: <Brand | Product | unknown ...>` in cli-opencode Template 16 (`prompt_templates.md`); `unknown` = register.md unread / posture undecided; encoded at `cli_child_pairing.md` line 357
- [x] CHK-003 [P0] Enforcement home located by content
  - **Evidence**: insertion fixed at EOF after the laundering guard; new H2 "Register Acceptance Gate" at `cli_child_pairing.md` line 346; prior Deny Rules / Parent Re-Validation / Named Residual sections matched by content
- [x] CHK-004 [P1] Reuse target confirmed (no new escalation token)
  - **Evidence**: `STATUS=ASK MISSING_REGISTER` reused (4 occurrences in `cli_child_pairing.md`); no newly minted token

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Deny-by-default reject authored at the cross-CLI boundary
  - **Evidence**: Register Deny Rules table (lines 367-372) — Unknown / Missing / Out-of-set / Parallel-list, each fail-closed `DENY` before launch
- [x] CHK-011 [P0] Parent Re-Validation step reconstructs and membership-tests the register
  - **Evidence**: 6-step Parent Re-Validation Extension (lines 352-361) resolves via `resolutionOrder`, interprets via `shared/register.md`, tests `∈ registerPolicy.accepted` (step 3)
- [x] CHK-012 [P0] Membership reads the policy field, not a hardcoded list
  - **Evidence**: `registerPolicy.accepted` referenced 8 times; "MUST NOT maintain a second hardcoded accepted-register list" (line 350); no parallel `["brand","product"]` list found in the contract
- [x] CHK-013 [P1] Reconciled with the two postures and the deny-by-default invariant
  - **Evidence**: postures cited (line 348: Brand/Product); "An unresolved register is a missing precondition ... deny-by-default posture" (line 363)

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Unknown register is rejected (the acceptance core)
  - **Evidence**: truth-table row `unknown` ⇒ `DENY` / `STATUS=ASK MISSING_REGISTER`, do not launch (line 378); backed by Re-Validation steps 4-5 (lines 359-360)
- [x] CHK-021 [P0] Known register passes
  - **Evidence**: truth-table rows `brand` ⇒ pass and `product` ⇒ pass (lines 380-381); Accepted-postures acceptance row (line 397)
- [x] CHK-022 [P0] Out-of-set token is rejected like unknown
  - **Evidence**: truth-table row `marketing` ⇒ `DENY` (line 379) + Out-of-set deny row (line 371), proving membership-against-`accepted`, not a literal `unknown` match
- [x] CHK-023 [P1] ASK escalation reuses the existing token
  - **Evidence**: escalation is `STATUS=ASK MISSING_REGISTER` (4 occurrences); no newly minted token

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class identified: `class-of-bug` — the cross-CLI dispatch path lacks a register-acceptance gate as a whole, not a single-CLI miss
  - **Evidence**: no boundary rejected an unresolved register across the cli-* family before this gate; the Register Acceptance Gate (line 346) closes the class at the shared boundary
- [x] CHK-FIX-002 [P0] Same-class coverage: the reject is enforced at the shared boundary that all cli-* dispatches cross
  - **Evidence**: the Deny Rules live in `cli_child_pairing.md` — the cross-CLI parent boundary every sibling crosses (lines 367-372); the gate fires before launch and at demand-back (line 354)
- [x] CHK-FIX-003 [P1] Consumer integrity: no drift-prone duplicate of the accepted set
  - **Evidence**: the gate consumes `registerPolicy.accepted` by reference (line 350); if D2-R8 changes the accepted set, the gate follows it with no second list to update

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Deny-by-default is fail-closed (no silent default coercion)
  - **Evidence**: "do not coerce a default at this boundary" (line 360); unresolved state is rejected/ASK'd, consistent with the D4 deny-by-default invariant (line 363)
- [x] CHK-031 [P1] Read-only policy boundary respected
  - **Evidence**: `git status` shows `command-metadata.json` and `shared/register.md` untouched; the gate only consumes `registerPolicy.accepted`
- [x] CHK-032 [P1] No proof-token / guarded-proxy / transport-result schema redefined
  - **Evidence**: `git diff --numstat` = 58 insertions, 0 deletions; transport-result=9, assertion=7, laundering=4 references intact; only the register gate appended

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD]: authored rule carries NO ephemeral artifact IDs/paths as policy values
  - **Evidence**: `grep -nE "specs/|packet|phase[ -]|ADR-|REQ-|task-[0-9]|finding"` over lines 346-400 returned nothing; policy named by `registerPolicy.accepted`, postures by `shared/register.md`
- [x] CHK-041 [P0] Honest enforceable-vs-residual split documented
  - **Evidence**: the deterministic membership test is the enforceable floor; Named Residuals subsection names residual 1 (mixed-surface register correctness) and residual 2 (text-only child) as advisory (lines 385-387)
- [x] CHK-042 [P1] Residual 2 inherits the existing Named Residual rather than over-claiming
  - **Evidence**: "bounded by the existing text-only Named Residual and parent demand-back" (line 387); no machine-checkable register pass claimed for prose-only returns

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Writes scoped to the named targets only
  - **Evidence**: `git status` shows only `cli_child_pairing.md` (the named output) plus the in-folder spec docs; the optional `design-command-surface-check.mjs` assertion was deferred (P2), so no unrelated file was touched
- [x] CHK-051 [P1] No temp/scratch artifacts left in the repo
  - **Evidence**: scratchpad-only temp use; repo tree clean of task scratch files

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 9 | 9/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent (orchestrator-confirmed git diff + grep evidence)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Status planned: all items pending; evidence lines state the confirming method, not fabricated results
-->
