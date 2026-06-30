---
title: "Implementation Plan: Treat Agent I/O as advisory-only; name the real design gate"
description: "Plan to land one single-sourced prose clarification that marks the Agent I/O contract as advisory-only and names the proof-token plus guarded boundary as the actual design-enforcement gate."
trigger_phrases:
  - "agent io advisory only plan"
  - "agent io not the design gate"
  - "advisory vs gate clarification"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/008-agent-io-advisory-only"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Fix L2 anchors; mark plan phases complete"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r8-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Treat Agent I/O as advisory-only; name the real design gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | Markdown reference contracts (documentation only) |
| **Change class** | docs — prose-contract clarification, no new enforcement |
| **Primary edit** | `agent-io-contract.md` (advisory-status note) |
| **Reconciliation source** | `cli_child_pairing.md` "Agent I/O Is Not The Gate" |
| **Verification** | Prose review, cross-reference resolve, evergreen lint, DQI |

### Overview
This phase lands a single, single-sourced prose clarification stating that the Agent I/O
contract is **advisory-only** — a convenience header that may opportunistically carry
manifest or result digests — and is **never** the design-enforcement gate. The real gate is
the design proof token plus the guarded boundary (guarded-proxy classification, the
structured Open Design transport result, and parent re-validation). The goal is that a reader
who lands on the general Agent I/O contract cannot mistake an Agent I/O header for the
enforcement mechanism. This is a prose clarification only: it names what is **not** the gate
and points to what is; it adds no new checker, schema, or refusal reason.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source of truth read: phase `spec.md` objective, target, and acceptance — read before authoring
- [x] Existing landed pieces read: `agent-io-contract.md` and `cli_child_pairing.md` — both read
- [x] Home decided with lowest-duplication rationale recorded — general contract, single-sourced by pointer (§6 decision note)
- [x] Advisory-vs-gate framing agreed (what is advisory, what is the authority) — advisory = Agent I/O; authority = proof token + guarded boundary

### Definition of Done
- [x] Advisory-only status stated in the chosen home — `agent-io-contract.md` line 32
- [x] The real gate (proof token + guarded boundary) named as the authority — line 32
- [x] Reconciled with the existing "Agent I/O Is Not The Gate" language (no contradiction) — by-name pointer, no restatement
- [x] Authored prose is evergreen (no spec IDs, phase numbers, backlog IDs, or spec-folder paths) — grep over lines 30-32 clean
- [x] Checklist items verified with evidence — all P0/P1 checked in `checklist.md`

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-source reference clarification. One general contract names its own advisory status and
delegates the authoritative deny rules to the contract that already owns them, rather than
cloning enforcement prose across multiple consumer files.

### Key Components
- **Agent I/O contract** — the general, surface-agnostic advisory dispatch/result contract.
  It already declares `optional-advisory` and that absence is never a refusal condition, but it
  does not currently point to the design-enforcement gate. This is where the new note lands.
- **Open Design CLI child pairing contract** — already carries the canonical, Open-Design-scoped
  "Agent I/O Is Not The Gate" statement plus an acceptance row. This is the reconciliation source;
  it is not re-stated, only referenced.
- **Design proof token + guarded boundary** — the actual authority: proof-token reference,
  guarded-proxy classification, structured transport result, digest comparison, and parent
  re-validation. The note names these as the gate; it does not redefine them.
- **Three cli-* design contracts** — already cross-reference the Agent I/O contract. They inherit
  the clarification by reference; they receive no cloned copy.

### Data Flow (reader navigation)
1. A reader arrives at the general Agent I/O contract (e.g., via the documented dispatch-header pointer).
2. The Contract Status area now states Agent I/O is advisory-only for design handoffs.
3. The same note names the proof-token + guarded boundary as the real gate and links to the
   Open Design pairing contract's "not the gate" section for the scoped deny rules.
4. A reader cannot conclude that a present (or absent) Agent I/O header satisfies a design handoff.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Decide & Verify Home
- [x] Confirm `cli_child_pairing.md` already states the Open-Design-scoped "not the gate" rule — present at line 174
- [x] Confirm `agent-io-contract.md` declares `optional-advisory` and has no design-gate pointer — confirmed at Contract Status
- [x] Lock the recommended home: a short advisory-status note in `agent-io-contract.md`,
      placed immediately after the Contract Status section — landed at line 32
- [x] Record the lowest-duplication rationale (see Dependencies and the decision note below) — recorded in §6

### Phase 2: Author the Clarification
- [x] Write the advisory-only statement (convenience header; may carry digests as data) — line 32
- [x] Name the real gate: proof token + guarded boundary, transport result, parent re-validation — line 32
- [x] State both directions: presence never substitutes for the gate; absence never passes a handoff — line 32
- [x] Add a by-name pointer to the Open Design pairing contract's "Agent I/O Is Not The Gate" section — pointer present
- [x] Keep the note short (2-4 sentences); do not duplicate the scoped deny-rule prose — 4-sentence note, no restatement

### Phase 3: Verify
- [x] Prose review: advisory-vs-gate framing is unambiguous — advisory vs authority read clearly distinct
- [x] Reconciliation check: no contradiction with the existing "not the gate" language — consistent, references it
- [x] Cross-reference resolves to the correct sibling section — resolves to `cli_child_pairing.md` line 174
- [x] Evergreen lint: no spec IDs, phase numbers, backlog IDs, or spec-folder paths in the prose — grep over lines 30-32 clean
- [x] DQI computed and recorded; spec acceptance items satisfied — DQI 92; SC-001/SC-002 met

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Prose review | Advisory-vs-gate framing reads unambiguously | Manual read of the authored note |
| Reconciliation | New note does not contradict the existing scoped statement | Side-by-side compare with the pairing contract |
| Cross-reference | Pointer resolves to the correct sibling section | Follow the link; confirm anchor/section exists |
| Evergreen lint | No spec IDs, phase numbers, backlog IDs, or spec-folder paths | grep the authored note for forbidden tokens |
| Quality | Documentation quality bar met | DQI rubric, target >= 75 |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli_child_pairing.md` "Agent I/O Is Not The Gate" | Internal (landed) | Green | Reconciliation source missing; cannot single-source |
| `agent-io-contract.md` `optional-advisory` status | Internal (landed) | Green | Advisory baseline missing; note has nothing to extend |
| Design proof token + guarded boundary contracts | Internal (landed) | Green | Cannot name the gate authority by reference |
| Phase `spec.md` acceptance | Internal | Green | No acceptance bar to verify against |

### Decision note — home selection (lowest duplication)
- **Rejected — clone into all three cli-* design contracts:** three copies, ongoing parity
  burden, drift risk. The spec itself asks the stance to stay single-sourced.
- **Rejected — add more prose only in the pairing contract:** it already states the rule, so a
  reader landing on the general Agent I/O contract is still not told; the gap is not closed.
- **Recommended — one short note in the general Agent I/O contract:** closes the gap at the
  exact place a reader can be misled, single-sources the deny prose to the pairing contract, and
  the three cli-* contracts inherit it by their existing cross-reference. Zero clones, no parity
  burden, and consistent with the spec's single-source intent.

> The spec names the cli-* design-contract sections as the target and also asks the stance to be
> single-sourced via cross-reference. This plan satisfies the single-source intent: the cli-*
> contracts already reference the general Agent I/O contract, so landing the clarification there
> reaches them by reference without per-CLI duplication. Flag to the implementer if a literal
> per-CLI sentence is still required.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The note contradicts the existing scoped statement, or a reviewer rejects the framing.
- **Procedure**: Revert the single doc edit. No code, schema, or checker changed, so reversal is
  a one-file revert with no downstream impact.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Decide & Verify Home) ──> Phase 2 (Author) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Decide & Verify Home | None | Author |
| Author | Decide & Verify Home | Verify |
| Verify | Author | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Decide & Verify Home | Low | 15 minutes |
| Author the Clarification | Low | 20 minutes |
| Verify | Low | 15 minutes |
| **Total** | | **~50 minutes** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Original file content captured (the section being edited) — Contract Status section read before append
- [x] Feature flag configured (N/A — documentation only) — N/A
- [x] Monitoring alerts set (N/A — documentation only) — N/A

### Rollback Procedure
1. **Immediate**: Remove the added advisory-status note from the general Agent I/O contract.
2. **Revert code**: revert the single doc edit.
3. **Verify**: Confirm the contract reads as before and the pairing contract is unaffected.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable — prose-only change.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Docs-only prose-contract clarification: names what is NOT the gate
-->
