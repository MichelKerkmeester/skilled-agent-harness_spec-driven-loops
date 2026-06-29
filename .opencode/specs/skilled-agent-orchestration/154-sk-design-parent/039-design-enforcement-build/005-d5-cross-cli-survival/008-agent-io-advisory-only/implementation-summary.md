---
title: "Implementation Summary: D5-R8 — Treat Agent I/O as advisory-only; name the real design gate"
description: "The general Agent I/O contract now carries a single-sourced advisory-status note: Agent I/O may carry manifest/result digests as data but is never the design gate, the real gate is the proof token plus the guarded boundary, and a by-name pointer single-sources the scoped deny rules to cli_child_pairing.md."
trigger_phrases:
  - "d5-r8 implementation summary"
  - "agent io advisory only built"
  - "agent io not the gate summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/008-agent-io-advisory-only"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Append advisory-only note to agent-io-contract.md"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-agent-io-advisory-only |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reader who landed on the general Agent I/O contract could mistake an Agent I/O header for the design-enforcement mechanism: the contract declared `optional-advisory` and said absence is never a refusal condition, but it never named what the actual design gate is. That gap let a present header read as proof and an absent header read as a clean pass. This phase closes the gap at the exact place a reader is misled by appending a short advisory-status note to the general contract: Agent I/O is advisory-only and is never the design gate; the real gate is the design proof token plus the guarded boundary; and the canonical scoped deny rules stay single-sourced by a by-name pointer rather than a clone.

### Advisory-only status, named against the real gate

The appended note states four things in one paragraph. First, Agent I/O is advisory-only: a convenience header that may opportunistically carry manifest or result digests as data, never as authority. Second, it names the enforceable design gate by reference: the design proof token plus the guarded boundary, which is guarded-proxy classification, the structured Open Design transport result, and parent re-validation. Third, it states both failure directions explicitly so neither can be inverted: presence of Agent I/O headers never substitutes for that gate, and absence of Agent I/O headers never passes a design handoff. Fourth, it points by name to the `cli_child_pairing.md` "Agent I/O Is Not The Gate" section as the canonical scoped statement, so the full deny prose is single-sourced and not restated here. This completes the D5 cross-CLI survival dimension.

### Single-sourced by pointer, not cloned per CLI

The original phase scaffold named the three cli-* design-contract sections as the target. The clarification instead landed once in the general Agent I/O contract that all three cli-* contracts already cross-reference, so they inherit it by reference with zero clones and no parity burden. The canonical scoped deny rules remain owned by `cli_child_pairing.md`; the new note references that section by name rather than re-stating it. This satisfies the spec's single-source intent and closes the gap at the general contract a reader actually lands on.

### A prose clarification, not new enforcement

The change is honest about what it is. It names what is **not** the gate (Agent I/O headers) and points to the authority that already exists (the proof token plus the guarded boundary). It adds no new checker, schema, or refusal reason; the enforceable behavior is unchanged. The note itself says so, so a future reader cannot misread it as a new enforcement surface.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md` | Modified (append-only) | Appended the "Advisory Status For Design Handoffs" H3 note immediately after the Contract Status section: advisory-only status, the real-gate naming (proof token + guarded boundary), both failure directions, and a by-name pointer to `cli_child_pairing.md` "Agent I/O Is Not The Gate". `git diff --numstat` shows 4 insertions, 0 deletions — every pre-existing section (Dispatch, Result, Handoff, Pre-Execution, Advisory, Evidence, Compatibility) preserved byte-identical |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) read the existing `agent-io-contract.md` Contract Status section and the `cli_child_pairing.md` "Agent I/O Is Not The Gate" section first, then appended one short H3 note directly after the Contract Status bullet list, leaving every prior line untouched. The orchestrator verified the deliverable independently: `git diff --numstat` confirmed 4 insertions and 0 deletions (pure append, existing content preserved); the advisory-only status, the real-gate naming (proof token plus guarded boundary, guarded-proxy classification, structured Open Design transport result, parent re-validation), both failure directions, and the by-name pointer to `cli_child_pairing.md` "Agent I/O Is Not The Gate" are all present in the note; that target section resolves and is byte-identical (`cli_child_pairing.md` line 174, untouched in `git status`); and an evergreen scan over the appended lines returned no spec path, packet, phase, ADR, REQ, task, or finding ID.

The honest framing: this is a prose-contract clarification. It names what is **not** the gate (Agent I/O headers) and points to the authority (the proof token plus the guarded boundary); it adds no new checker, schema, or refusal reason. The single-source-via-pointer decision keeps the canonical scoped deny rules in `cli_child_pairing.md` and lets the three cli-* contracts inherit the clarification through their existing cross-reference, so no per-CLI clone was added. This is the last D5 phase; D5 cross-CLI survival is complete after it.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Land the clarification once in the general Agent I/O contract, not cloned into each cli-* contract | The three cli-* design contracts already cross-reference the general contract, so one note reaches them by reference with zero clones and no parity burden; the spec asked the stance to stay single-sourced |
| Single-source the scoped deny rules by a by-name pointer, not a restatement | The canonical "Agent I/O Is Not The Gate" prose already lives in `cli_child_pairing.md`; pointing to it by name avoids a second copy that could drift from the authority |
| State both failure directions explicitly | A reader could otherwise invert the gate in either direction — reading a present header as proof or an absent header as a clean pass; naming both closes both holes |
| Name the real gate by reference, do not redefine it | The proof token plus the guarded boundary already exist; the note names them as the authority without re-minting or weakening the gate |
| Append-only, every prior section preserved | The note extends the existing contract; touching no prior line keeps the dispatch/result/handoff/evidence schemas a single source of truth and makes rollback a clean 4-line delete |
| Frame it as a prose clarification, not new enforcement | The change adds no checker, schema, or refusal reason; claiming a new enforcement surface would be dishonest, so the note says it adds none |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Advisory-only status stated | PASS — "Agent I/O is advisory-only: a convenience header that may opportunistically carry manifest or result digests as data, never as authority" (`agent-io-contract.md` line 32) |
| Real gate named | PASS — "the design proof token plus the guarded boundary: guarded-proxy classification, the structured Open Design transport result, and parent re-validation" (line 32) |
| Both failure directions stated | PASS — "Presence ... never substitutes for that gate, and absence ... never passes a design handoff" (line 32) |
| By-name pointer present (single-source) | PASS — pointer to `cli_child_pairing.md` "Agent I/O Is Not The Gate"; target resolves at `cli_child_pairing.md` line 174 |
| Append-only / preserved content | PASS — `git diff --numstat` shows 4 insertions, 0 deletions; Dispatch/Result/Handoff/Pre-Execution/Advisory/Evidence/Compatibility sections intact |
| Single-source preserved (no clone) | PASS — full deny prose not restated in the note; canonical rules remain in `cli_child_pairing.md`, referenced by name |
| No new enforcement introduced | PASS — note states "this prose adds no checker, schema, or refusal reason"; no new checker/schema/token added |
| Cross-ref target untouched | PASS — `git status` shows `cli_child_pairing.md` clean (untouched) |
| Evergreen scan over appended note | PASS — `grep -nE "specs/\|packet\|phase[ -]\|ADR-\|REQ-\|task-[0-9]\|finding"` over lines 30-32 returned nothing |
| Scope clean — no live skill file touched beyond the named output | PASS — only `agent-io-contract.md` (the named output) modified by this phase; no cli-* SKILL and no `cli_child_pairing.md` edit |
| `validate.sh --strict` | PASS except the expected GENERATED_METADATA residual (orchestrator regenerates `description.json` / `graph-metadata.json`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This is a prose clarification, not enforcement.** The note names what is not the gate and points to the authority; it adds no new checker, schema, or refusal reason. The enforceable behavior is unchanged — the proof token plus the guarded boundary remain the only gate, exactly as before.
2. **The scoped deny rules are single-sourced by pointer.** The full "Agent I/O Is Not The Gate" prose lives only in `cli_child_pairing.md`; if that section is renamed or moved, the by-name pointer in `agent-io-contract.md` must be updated to match. This is the deliberate cost of avoiding a drift-prone clone.
3. **Generated metadata is a residual at hand-off.** `description.json` and `graph-metadata.json` still need regeneration by the orchestrator after this doc sync; the strict validator's GENERATED_METADATA finding is expected and is not hand-written.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
