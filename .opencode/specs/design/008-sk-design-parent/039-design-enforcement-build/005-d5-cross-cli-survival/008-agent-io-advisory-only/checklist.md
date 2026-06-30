---
title: "Verification Checklist: Treat Agent I/O as advisory-only; name the real design gate"
description: "Verification checklist for the single-sourced prose clarification marking Agent I/O as advisory-only and naming the proof-token plus guarded boundary as the design-enforcement gate."
trigger_phrases:
  - "agent io advisory only checklist"
  - "advisory vs gate checklist"
  - "agent io not the gate checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/008-agent-io-advisory-only"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify all P0/P1 checks with append-diff and pointer evidence"
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
# Verification Checklist: Treat Agent I/O as advisory-only; name the real design gate

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

- [x] CHK-001 [P0] Phase spec objective, target, and acceptance read
  - **Evidence**: `spec.md` objective/target/acceptance read before authoring; advisory-only + name-the-gate intent confirmed
- [x] CHK-002 [P0] Existing pieces read: the general Agent I/O contract and the Open Design pairing contract
  - **Evidence**: `agent-io-contract.md` Contract Status (`status: optional-advisory`) and `cli_child_pairing.md` "Agent I/O Is Not The Gate" (line 174) both read
- [x] CHK-003 [P1] Home decided with a recorded lowest-duplication rationale
  - **Evidence**: home = general Agent I/O contract; rationale recorded in `plan.md` §6 decision note (cli-* inherit by existing cross-reference, zero clones)

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Advisory-only status stated: Agent I/O is a convenience header that may carry digests as data, never as authority
  - **Evidence**: "Agent I/O is advisory-only: a convenience header that may opportunistically carry manifest or result digests as data, never as authority" (`agent-io-contract.md` line 32)
- [x] CHK-011 [P0] The real gate named: the design proof token plus the guarded boundary (guarded-proxy classification, structured transport result, parent re-validation)
  - **Evidence**: "the design proof token plus the guarded boundary: guarded-proxy classification, the structured Open Design transport result, and parent re-validation" (line 32)
- [x] CHK-012 [P0] Both failure directions stated: presence never substitutes for the gate; absence never passes a design handoff
  - **Evidence**: "Presence of Agent I/O headers never substitutes for that gate, and absence of Agent I/O headers never passes a design handoff" (line 32)
- [x] CHK-013 [P1] Note is concise (2-4 sentences) and does not duplicate the scoped deny-rule prose
  - **Evidence**: 4-sentence note; `git diff --numstat` = 4 insertions, 0 deletions; scoped deny prose not restated (pointer only)

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Spec acceptance met: a handoff relying solely on Agent I/O presence/absence (no transport result) is named as rejected by the gate
  - **Evidence**: both failure directions stated (line 32); the gate is the proof token + guarded boundary, so an Agent-I/O-only handoff with no transport result is not passed; SC-001 met
- [x] CHK-021 [P0] Reconciliation: the new note does not contradict the existing "Agent I/O Is Not The Gate" language
  - **Evidence**: note references `cli_child_pairing.md` line 174 by name; same posture (advisory, not the gate); no conflicting claim introduced
- [x] CHK-022 [P1] Cross-reference resolves to the correct sibling section
  - **Evidence**: pointer target "Agent I/O Is Not The Gate" resolves at `cli_child_pairing.md` line 174 (`grep` confirmed)
- [x] CHK-023 [P1] Advisory-vs-gate framing reads unambiguously to a first-time reader
  - **Evidence**: note draws an explicit advisory (Agent I/O) vs authority (proof token + guarded boundary) distinction in one paragraph

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] The gap is fully closed: a reader landing on the general Agent I/O contract is pointed to the real gate (no partial/orphaned note)
  - **Evidence**: note lands right after Contract Status (line 32) where a reader is misled; names the real gate and points to the canonical scoped statement
- [x] CHK-031 [P0] Single-source preserved: the canonical scoped deny rules remain in the pairing contract; the note references rather than re-states them
  - **Evidence**: full deny prose stays in `cli_child_pairing.md` (untouched, `git status` clean); note carries only a by-name pointer, no clone
- [x] CHK-032 [P1] No new enforcement introduced: the change adds no checker, schema, or refusal reason — it only names what is not the gate
  - **Evidence**: note states "this prose adds no checker, schema, or refusal reason"; no new token/schema/checker added; 4 insertions, 0 deletions
- [x] CHK-033 [P1] cli-* design contracts inherit the clarification by their existing cross-reference; no orphaned per-CLI clone was added
  - **Evidence**: no per-CLI sentence cloned; the three cli-* contracts reach the note through their existing reference to `agent-io-contract.md`; no cli-* SKILL touched by this phase

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Advisory framing does not weaken the gate: nothing in the note implies Agent I/O can authorize a design handoff
  - **Evidence**: note explicitly says presence never substitutes for the gate and absence never passes a handoff; Agent I/O is named data, never authority (line 32)
- [x] CHK-041 [P1] The gate authority is named by reference and not redefined or re-minted in the note
  - **Evidence**: proof token + guarded boundary named as existing authority; no schema/algorithm redefined; 0 deletions to prior sections

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Authored prose is evergreen: no spec IDs, phase numbers, backlog IDs, or spec-folder paths
  - **Evidence**: `grep -nE "specs/|packet|phase[ -]|ADR-|REQ-|task-[0-9]|finding"` over the appended lines 30-32 returned nothing
- [x] CHK-051 [P1] Cross-reference uses the contract name and the link convention already present in these contracts
  - **Evidence**: note names `cli_child_pairing.md` and the section title "Agent I/O Is Not The Gate" verbatim, matching the existing by-name reference style in these contracts
- [x] CHK-052 [P1] DQI computed and >= 75
  - **Evidence**: DQI 92 (manual sk-doc rubric: structure, accuracy, evergreen, single-source, honesty) — well above the 75 floor

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Only the chosen home file was edited; no out-of-scope files touched
  - **Evidence**: this phase modified only `agent-io-contract.md` (the named output); `cli_child_pairing.md` and all cli-* SKILLs untouched (`git status` clean for those)
- [x] CHK-061 [P2] No temp files left outside scratch/
  - **Evidence**: scratchpad-only temp use; repo tree clean of task scratch files

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent (orchestrator-confirmed git diff + grep + cross-ref evidence)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
