---
title: "Verification Checklist: INTERACTION STATE MATRIX proof lane"
description: "Verification items for the additive conditional INTERACTION STATE MATRIX lane across the sk-design context loading contract, proof-of-application card, and interface pre-flight card: presence/consistency, binary completeness, conditional N/A behavior, existing-gate no-regression, trigger documentation, fix-completeness, evergreen, and scope-lock."
trigger_phrases:
  - "interaction state matrix checklist"
  - "stateful ui proof lane design build"
  - "d6-r4 interaction state matrix"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/004-interaction-state-matrix"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the delivered mirrored matrix lane"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/context_loading_contract.md"
      - ".opencode/skills/sk-design/shared/assets/proof_of_application_card.md"
      - ".opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: INTERACTION STATE MATRIX proof lane

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

- [x] CHK-001 [P0] All three targets read in full before edit, and the additive pattern to mirror confirmed (existing conditional proof blocks in the contract, proof-field rows on the application card, binary box sections on the pre-flight card)
  - **Evidence**: the matrix mirrors the existing `INTERFACE PREFLIGHT` / `AUDIT EVIDENCE` blocks and the binary box sections; no new structural form invented
- [x] CHK-002 [P0] Scope frozen to the 3 named markdown files; `mode-registry.json`, `proof_check.py`, and `context_loaded_card.md` are NOT touched
  - **Evidence**: change set limited to the contract, proof card, and pre-flight card; orchestrator-verified `mode-registry.json` / `proof_check.py` / `context_loaded_card.md` untouched

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `INTERACTION STATE MATRIX` field block present in `context_loading_contract.md` under REQUIRED PROOF FIELDS, in the same fenced form as the existing conditional proof blocks, with the fixed nine-part shape (states / events / transitions / forbidden / guards / uiByState / recovery / a11y / reducedMotion) plus surface, trigger, and verdict lines
  - **Evidence**: `### Interaction State Matrix` under §4 (line 117); `uiByState` (line 135) and `reducedMotion` (line 141) present in the nine-part shape
- [x] CHK-011 [P0] One conditional matrix row added to the §5 HARD GATES table; every existing gate row unchanged
  - **Evidence**: gate row at line 177 ("Any stateful surface ship/ready/done claim ... non-stateful surfaces mark N/A"); existing gate rows unchanged
- [x] CHK-012 [P0] The matrix mirrored on `proof_of_application_card.md` as a conditional fillable section over the same nine dimensions, marked stateful-only, with the honest "carried by discipline, not auto-parsed by `proof_check.py`" note
  - **Evidence**: `## 8. INTERACTION STATE MATRIX` at line 88; fillable, stateful-only, with the discipline-carried note
- [x] CHK-013 [P0] The matrix mirrored on `interface_preflight_card.md` as a binary `[ ]`-box section feeding the verdict; the existing VERDICT section renumbered without dropping, adding, or rewording any box in §1-§10
  - **Evidence**: `## 11` at line 163, `## 12. VERDICT` at line 186; §1-§10 verbatim, VERDICT 11→12 the only existing-text edit
- [x] CHK-014 [P1] The field set is consistent across all three homes (contract shape == proof-card rows == pre-flight boxes, same nine dimensions and intent)
  - **Evidence**: same nine dimensions across the contract field shape, the proof-card rows, and the pre-flight boxes

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] PRESENCE: the lane exists in all three files with a consistent nine-part field set (grep the field names across the contract + both cards)
  - **Evidence**: grep confirms `INTERACTION STATE MATRIX` in the contract (line 122 / `### Interaction State Matrix` line 117), the proof card (line 88), and the pre-flight card (line 163)
- [x] CHK-021 [P0] BINARY COMPLETENESS: every pre-flight matrix box is binary and the renumbered verdict consumes them — for a stateful surface a single failed matrix box = FIX
  - **Evidence**: `## 11` binary `[ ]`-boxes feed `## 12. VERDICT`; a single failed applicable box blocks the ship/ready/done claim at the existing Interface Pre-Flight gate
- [x] CHK-022 [P0] CONDITIONAL: a non-stateful (static) surface marks the lane N/A and passes exactly as before — no new required box bites
  - **Evidence**: the `## 11` section is stateful-only ("else N/A"); a non-stateful surface marks N/A and walks the cards as before
- [x] CHK-023 [P0] NO-REGRESSION: `proof_check.py` over the proof card is output- and exit-identical to baseline (four-field gate untouched); existing pre-flight boxes §1-§10 and existing contract proof blocks are unchanged
  - **Evidence**: `proof_check.py` untouched (the `## 8` section is reader content it does not parse); pre-flight §1-§10 verbatim; contract additive (0 removed)

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class assigned: implicit interaction-state coverage is a `class-of-gap` (a verification-floor gap — stateful UI work could be called done with its error/empty/pending states left unmodeled), not a one-card omission
  - **Evidence**: the fix generalizes the floor from implicit craft to a fixed, mirrored, binary-checkable lane that gates every stateful surface the same way
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the three gate cards are the producers of the design proof surface — contract (SSOT field shape), proof card (end-of-work), pre-flight card (pre-delivery binary). All three must carry the mirrored lane; none may be left out
  - **Evidence**: the lane lands in all three — contract §4 + §5 gate row, proof card `## 8`, pre-flight card `## 11`; the contract defines, the cards mirror
- [x] CHK-FIX-003 [P0] Consumer inventory completed: the new lane is consumed by the Interface Pre-Flight HARD gate (walks the binary boxes into SHIP/FIX) and the proof-card discipline; `proof_check.py` does NOT consume the new proof-card section (out of scope), which is recorded honestly rather than overclaimed
  - **Evidence**: the enforceable consumer is the pre-flight gate (walks `## 11` into the `## 12` verdict); the `## 8` proof-card section is reader-carried; `proof_check.py` untouched
- [x] CHK-FIX-004 [P0] Adversarial cases listed for the build to exercise: stateful surface with a complete matrix (SHIP), stateful surface missing recovery/forbidden/guard (FIX at the pre-flight gate), non-stateful surface (N/A → passes), and the existing-gate no-op (proof_check.py unchanged)
  - **Evidence**: all four cases covered by the additive contract — complete matrix SHIPs, a gap FIXes at the pre-flight gate, non-stateful marks N/A, and `proof_check.py` stays a no-op
- [x] CHK-FIX-005 [P1] Matrix axes listed: surface kind (stateful / non-stateful) × lane home (contract / proof card / pre-flight card) × box outcome (pass / fail / N/A) — every combination must behave per the additive contract
  - **Evidence**: every combination behaves per the additive contract; the lane only bites a stateful surface at the pre-flight gate and is N/A elsewhere

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The lane binds a ship/ready claim for a stateful surface to a modeled matrix (states/transitions/guards/recovery), not a self-attested "looks done" — a single unmodeled box blocks delivery at the existing Interface Pre-Flight gate
  - **Evidence**: the §5 HARD GATE row + the binary `## 11` boxes bind a stateful surface's ship/ready/done claim to a modeled matrix; a single failed box blocks at the existing pre-flight gate
- [x] CHK-031 [P1] HONEST scope recorded: presence and consistency of the lane and the binary boxes are enforceable via the existing pre-flight gate; whether a live prompt triggers the lane is advisory NL judgment; whether the modeled states/transitions/guards are correct and complete is advisory (taste/modeling quality), never certified by a checkbox
  - **Evidence**: the honest split appears in `spec.md` OPEN QUESTIONS, `plan.md` §1, and the card notes; no new script or registry alias claimed this phase

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD]: no spec/packet/phase IDs or spec paths embedded in any of the three shipped files (grep clean)
  - **Evidence**: orchestrator evergreen scan clean across the contract, proof card, and pre-flight card
- [x] CHK-041 [P1] spec/plan/tasks/checklist synchronized on the nine-part matrix shape, the three mirrored homes, the conditional/advisory triggering, and the honest enforceable-vs-advisory split
  - **Evidence**: all four docs reflect the nine-part shape, the three homes, advisory triggering, and the enforceable-vs-advisory split
- [x] CHK-042 [P1] The `mode-registry.json` trigger-alias addition is documented as a deferred follow-up (not silently claimed as done), since the registry is out of this phase's frozen scope
  - **Evidence**: spec OPEN QUESTIONS, plan §1, and the implementation-summary record the per-state-machine auto-parser + registry aliases as a named deferred follow-up

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] Only `context_loading_contract.md`, `proof_of_application_card.md`, and `interface_preflight_card.md` modified; `mode-registry.json`, `proof_check.py`, and `context_loaded_card.md` untouched
  - **Evidence**: orchestrator-verified change set is the three named files; `mode-registry.json` / `proof_check.py` / `context_loaded_card.md` untouched
- [x] CHK-051 [P1] No temp/scratch files left outside the scratchpad; the working tree carries only the three modified skills files plus this phase folder's docs
  - **Evidence**: working tree carries the three modified skills files plus this phase folder's docs; no scratch left

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 6 | 6/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent (independent re-verification of the delivered INTERACTION STATE MATRIX lane across the contract + proof card + pre-flight card)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
