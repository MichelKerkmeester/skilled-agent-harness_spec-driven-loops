---
title: "Tasks: Cross-delegation token laundering guard"
description: "Author the laundering-guard deny contract: three attacks, one deny rule each reusing the proof-token replay/freshness rules, named residuals, evergreen."
trigger_phrases:
  - "laundering guard tasks"
  - "replay omit weaken deny tasks"
  - "child re-validate token tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/007-cross-child-laundering-guard"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark every task complete with one-line delivery evidence"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/cli_child_pairing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Cross-delegation token laundering guard

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

**Task Format**: `T### [P?] Description (target) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Re-read the proof-token §2 replay defense and §6 boundary table; list the exact rules the guard will reuse, NOT redefine (`design_proof_token.md` §2/§6) [15m] — Done: §2 (singleUse/nonce/runId) and §6 (required-field/time/TTL/single-use/surface/digest) reused by citation
- [x] T002 Lock the home: recommend extending `cli_child_pairing.md` with a laundering-guard section; record the deviation from the `design_delegation_payload.md` framing and the standalone-`laundering_guard.md` alternative, and surface the choice for confirmation (`cli_child_pairing.md`) [15m] — Done: appended to `cli_child_pairing.md`; deviation recorded in plan/spec

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Threat model
- [x] T003 Write the three-attack threat model: REPLAY (consumed `nonce`+`runId`), OMIT (design-affecting child op with no token), WEAKEN (strip `singleUse` / extend `expiresAt` / swap `boundSurface`) (`cli_child_pairing.md`) [30m] — Done: Threat Model table defines all three attacks

### Deny rules (one per attack, reusing §2/§6)
- [x] T004 Author the REPLAY deny rule: parent-owned run-scoped consumed-set check, reusing §2 replay defense + §6 consumed-pair rejection (`cli_child_pairing.md`) [20m] — Done: "Replay consumed pair" deny row, parent-owned run-scoped consumed set → DENY
- [x] T005 Author the OMIT deny rule: required-token-on-child-design-op, reusing §6 required-field rejection elevated to mandatory token presence; absence is never exempt, fail closed (`cli_child_pairing.md`) [20m] — Done: "Missing child design token" deny row, absence never exempt → DENY
- [x] T006 Author the WEAKEN deny rule: field-integrity re-validation against the original mint (single-use exactly true, no TTL/freshness extension, surface must match mint and op target), reusing §6 time/TTL/single-use/surface + the content-bound digests as tamper evidence (`cli_child_pairing.md`) [25m] — Done: "Relaxed token fields" deny row; content-bound digests are the tamper evidence

### Enforcement + reconciliation
- [x] T007 Document the two enforcement points: child PreToolUse re-validation before the design-affecting call, and the parent demand-back reconciling `designProofTokenRef` against the mint (`cli_child_pairing.md`) [20m] — Done: Enforcement Points list; parent demand-back named as the enforceable floor
- [x] T008 [P] State the no-second-schema invariant explicitly: the guard consumes proof-token fields and applies §6 rules; it defines no new token schema or fields (`cli_child_pairing.md`) [10m] — Done: opening + acceptance state §2/§6 reuse, no new token schema (18 token refs, no field table)

### Residuals
- [x] T009 Name the forge-from-stolen-inputs residual: a fully-compromised child re-minting a digest-valid token from captured authorized inputs inside the freshness window is out of scope; the guard is enforceable only at the parent/agent boundary the parent controls (`cli_child_pairing.md`) [15m] — Done: Named Residual paragraph; enforceable control is the parent boundary
- [x] T010 [P] Name the old-contract residual: an unmodifiable child CLI that ignores the guard loses the child-side early deny but stays covered by the parent demand-back floor; extend the existing text-only-child residual (`cli_child_pairing.md`) [15m] — Done: Named Residual paragraph; unmodifiable child covered only by the parent floor

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Verify each of the three attacks has exactly one matching deny rule that cites §2 or §6 (`cli_child_pairing.md`) [10m] — Done: replay→consumed-pair, omit→missing-token, weaken→relaxed-fields; all cite §2/§6
- [x] T012 [P] Grep the authored section for ID/path leakage (spec IDs, finding IDs, iteration numbers, line numbers); confirm evergreen (`cli_child_pairing.md`) [10m] — Done: appended body scan clean, no IDs/paths
- [x] T013 [P] Confirm no new token field/schema table was introduced and the proof-token + pairing dependencies are cited, not redefined (`cli_child_pairing.md`) [10m] — Done: §2/§6 cited; no new field/schema table (18 token refs)

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Three attacks defined with one deny rule each (reusing §2/§6)
- [x] Both residuals named
- [x] Evergreen check passed (no IDs/paths in the contract)

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Doc-authoring phase; "target" column is the contract file, not source code
- Planning only: no live edits this phase
-->
