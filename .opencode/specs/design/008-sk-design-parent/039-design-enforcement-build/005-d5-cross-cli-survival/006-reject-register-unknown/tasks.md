---
title: "Tasks: D5-R6 — Reject register=unknown at cross-CLI design dispatch (deny-by-default register acceptance)"
description: "Ordered grounding, authoring, and verification tasks for the deny-by-default register-acceptance gate at the cross-CLI design dispatch boundary, reconciled with D2-R8 registerPolicy and the D4 deny-by-default invariant."
trigger_phrases:
  - "d5-r6 tasks"
  - "reject register unknown tasks"
  - "register acceptance cli dispatch tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/006-reject-register-unknown"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all grounding, authoring, and verification tasks complete"
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
# Tasks: D5-R6 — Reject register=unknown at cross-CLI design dispatch (deny-by-default register acceptance)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Re-read `registerPolicy.accepted` and confirm `["brand","product"]` is identical across all five design commands (`.opencode/skills/sk-design/command-metadata.json`) [3m] — DONE: confirmed; source read-only, untouched
- [x] T002 [P] Re-read the `Register: <Brand | Product | unknown ...>` field in the compact Context Manifest and confirm `unknown` is the "register.md unread" placeholder (`.opencode/skills/cli-opencode/assets/prompt_templates.md`) [3m] — DONE: confirmed `unknown` = register.md unread
- [x] T003 [P] Re-read the Parent Re-Validation algorithm, Deny Rules table, and Named Residual section to locate the insertion points (`.opencode/skills/mcp-open-design/references/cli_child_pairing.md`) [4m] — DONE: insertion fixed at EOF; new H2 at line 346
- [x] T004 [P] Re-read the existing `STATUS=ASK MISSING_REGISTER` + `registerPolicy.accepted` membership assertions to confirm the reuse target (`.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [3m] — DONE: reuse target confirmed before authoring

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### The boundary deny rule (primary, enforceable)
- [x] T005 Add the *Unaccepted register* Deny Rule row: register `unknown` OR ∉ `registerPolicy.accepted` ⇒ fail-closed `DENY` for the dispatch/handoff (`.opencode/skills/mcp-open-design/references/cli_child_pairing.md`) [8m] — DONE: Register Deny Rules table, 4 rows each → DENY (lines 367-372)
- [x] T006 Add the matching Parent Re-Validation step: reconstruct the effective register from the dispatch manifest / transport-result material, then test membership against `registerPolicy.accepted` (read by reference, not hardcoded) (`.opencode/skills/mcp-open-design/references/cli_child_pairing.md`) [8m] — DONE: 6-step Parent Re-Validation Extension (lines 352-361)

### Pre-dispatch ASK (reuse, no new token)
- [x] T007 Document the pre-dispatch escalation: an `unknown` register on the hoisted manifest `Register:` field yields `STATUS=ASK MISSING_REGISTER` before launch — reuse, do not mint a new token (`.opencode/skills/mcp-open-design/references/cli_child_pairing.md`) [5m] — DONE: step 5 + Unknown-register deny row (lines 360, 369); reused, no new token

### Reconciliation + evergreen
- [x] T008 Reconcile the rule wording with the two postures in `shared/register.md` and the D4 deny-by-default invariant (unknown register = missing precondition ⇒ deny); name the policy by field, the postures by `shared/register.md` (`.opencode/skills/mcp-open-design/references/cli_child_pairing.md`) [5m] — DONE: postures cited (line 348); "missing precondition ... deny-by-default posture" (line 363)
- [x] T009 Evergreen [HARD]: ensure the authored rule block embeds no spec path / packet / phase / ADR / REQ / task / finding ID as a policy value (`.opencode/skills/mcp-open-design/references/cli_child_pairing.md`) [included] — DONE: grep over lines 346-400 returned nothing

### Optional defense-in-depth
- [x] T010 [P] (Optional) Extend the surface-check so the hoisted manifest carrier is asserted to enumerate only accepted postures + the `STATUS=ASK MISSING_REGISTER` token (`.opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs`) [8m] — DEFERRED (P2 optional): not added this phase; `design-command-surface-check.mjs` untouched (carrier-only scope, no live skill file changed)

> The reject reads `registerPolicy.accepted` as the single membership source of truth across T005-T008; no parallel posture list is introduced.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Truth table (the acceptance core)
- [x] T011 Confirm `register=unknown` ⇒ fail-closed `DENY` / `STATUS=ASK MISSING_REGISTER`, no child launched [3m] — DONE: truth row (line 378) + step 4/5 + Unknown deny row
- [x] T012 Confirm `register=brand` ⇒ pass and `register=product` ⇒ pass [2m] — DONE: truth rows (lines 380-381); Accepted-postures acceptance row (line 397)
- [x] T013 Confirm an out-of-set token (e.g. `marketing`) ⇒ `DENY` — proving the test is membership against `accepted`, not a literal `unknown` match [3m] — DONE: `marketing` ⇒ DENY truth row (line 379) + Out-of-set deny row (line 371)

### Reconciliation + reuse
- [x] T014 `grep` confirms the rule references `registerPolicy.accepted`; no second hardcoded `["brand","product"]` posture list exists outside `command-metadata.json` [3m] — DONE: 8 references; "MUST NOT maintain a second hardcoded accepted-register list" (line 350)
- [x] T015 `grep` confirms the escalation is `STATUS=ASK MISSING_REGISTER`, not a newly minted token [2m] — DONE: 4 occurrences; no new token

### Evergreen + residual honesty
- [x] T016 `grep -nE "specs/|packet|phase[ -]|ADR-|REQ-|task-[0-9]|finding"` over the authored rule block returns NOTHING (evergreen [HARD]) [2m] — DONE: clean over lines 346-400
- [x] T017 Confirm both named residuals are documented: mixed-surface register *correctness* (advisory) and the text-only cli-claude-code channel (advisory, inheriting the existing Named Residual) [2m] — DONE: Named Residuals subsection (lines 385-387)
- [x] T018 [P] (Optional) If the surface-check extension was added, run it and confirm green on the manifest carrier assertion [3m] — DEFERRED (P2 optional): the extension was not added; nothing to run (carrier-only scope)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` (T010 and T018 are P2-optional, deferred with documented reason)
- [x] No `[B]` blocked tasks remaining
- [x] Truth table holds: unknown/out-of-set ⇒ reject; brand/product ⇒ pass
- [x] Membership reads `registerPolicy.accepted` (single source of truth); ASK reuses `MISSING_REGISTER`
- [x] Authored rule is evergreen (no ephemeral IDs/paths as policy values)
- [x] Both named residuals documented honestly
- [x] checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md` (reject contract in §3, HALT conditions in L2 enhanced rollback)
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Grounding → author boundary deny rule + re-validation + ASK reuse → verify truth table
- Verification centers on the unknown/out-of-set ⇒ reject, brand/product ⇒ pass truth table + reconciliation + evergreen
-->
