---
title: "Implementation Summary: D5-R6 — Reject register=unknown at cross-CLI design dispatch (deny-by-default register acceptance)"
description: "The cross-CLI design dispatch boundary now fails closed on an unresolved or out-of-set register: it resolves the effective register, tests membership against registerPolicy.accepted by reference, and escalates STATUS=ASK MISSING_REGISTER rather than coercing a default."
trigger_phrases:
  - "d5-r6 implementation summary"
  - "reject register unknown built"
  - "register acceptance gate summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/006-reject-register-unknown"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Append register acceptance gate to cli_child_pairing.md"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-reject-register-unknown |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The cross-CLI design dispatch boundary used to launch a child no matter what register it carried, including `unknown` — the Template 16 placeholder that means `shared/register.md` was never read and no Brand-versus-Product judgment was made. Dispatching that ships unresolved ambiguity into a child that cannot settle it. This phase closes the gap by appending a Register Acceptance Gate to the CLI child pairing contract: the parent now resolves the effective register, tests it against `registerPolicy.accepted` read by reference, and fails closed before launch on anything unresolved or out of set, escalating `STATUS=ASK MISSING_REGISTER` instead of coercing a default.

### Register Acceptance Gate

The appended section makes register acceptance a deterministic precondition of every cross-CLI design dispatch. The parent resolves the effective register in policy order from `registerPolicy.resolutionOrder` (explicit flag, declared register, task cue, surface in focus, safe default), interprets the value through the two postures in `shared/register.md` (Brand means the design is the product; Product means the design serves the product), and tests membership against `registerPolicy.accepted` in `command-metadata.json`. The membership source is read by reference: the gate forbids a second hardcoded accepted-register list in the contract, prompts, or dispatch glue, so it cannot drift from D2-R8's policy field. A "Register Deny Rules" table covers Unknown register, Missing register, Out-of-set register, and a Parallel accepted list as fail-closed `DENY` before launch, and a truth table fixes the behavior: `unknown` and out-of-set `marketing` deny, while `brand` and `product` pass. An unresolved register is treated as a missing precondition and inherits the contract's deny-by-default posture.

### registerPolicy.accepted as the single membership source

The gate invents no new policy. It consumes D2-R8's `registerPolicy.accepted` as the single membership source of truth and extends the D4 deny-by-default invariant (fail closed on a missing or unresolved precondition) to the register field. The escalation reuses the existing `STATUS=ASK MISSING_REGISTER` ASK rather than minting a new token, and `command-metadata.json` and `shared/register.md` are read-only — neither was touched.

### Named residuals

The contract is honest about where determinism ends. The deterministic gate proves only that the value is a member of `registerPolicy.accepted`; it cannot prove the selected posture is the right design judgment on a genuinely mixed surface where Brand and Product dials diverge, so register correctness on a mixed surface stays advisory. A text-only child with no machine-readable register field degrades register checking to advisory, bounded by the existing text-only Named Residual and parent demand-back. No taste claim is made.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-open-design/references/cli_child_pairing.md` | Modified (append-only) | Appended the "Register Acceptance Gate" H2 section (lines 346-400): the resolve-and-test contract, a Parent Re-Validation Extension, a four-row Register Deny Rules table, a four-row truth table, two named residuals, and an acceptance subsection. 58 insertions, 0 deletions — every pre-existing section (Result Schema, Parent Re-Validation, Deny Rules, Named Residual, the D5-R5 Transport Assertion Pairing, the Cross-Delegation Token Laundering Guard, the transport-result schema) preserved byte-identical |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) read `registerPolicy.accepted` in `command-metadata.json`, the `Register:` carrier field in cli-opencode Template 16, the postures in `shared/register.md`, and the existing `cli_child_pairing.md` deny contract first, then appended one H2 section at the end of the file, leaving every prior line untouched. The orchestrator verified the deliverable independently: `git diff --numstat` confirmed 58 insertions and 0 deletions (pure append); the prior sections are intact (transport-result references = 9, assertion references = 7, laundering references = 4); the Register Acceptance Gate, its Parent Re-Validation Extension, the Register Deny Rules table, and the truth table are all present; `registerPolicy.accepted` is referenced as the single membership source (8 references); the truth table holds (`unknown` and out-of-set `marketing` deny, `brand` and `product` pass); the two named residuals are documented; `command-metadata.json` and `shared/register.md` are untouched; and an evergreen scan over the appended section returned no spec path, packet, phase, ADR, REQ, task, or finding ID.

The honest framing: this fail-closes the cross-CLI boundary on an unresolved, unknown, or out-of-set register by consuming D2-R8's `registerPolicy.accepted` as the single source, escalating `STATUS=ASK MISSING_REGISTER` rather than coercing a default. The membership test is deterministic and replayable on the local checkout. Register correctness on a genuinely mixed surface and the text-only child channel stay advisory (the two named residuals). No taste claim is made.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat an unknown register as a missing precondition, not a pass-through default | `unknown` means `shared/register.md` was never read and no posture was decided; dispatching it ships ambiguity into a child that cannot resolve it, so the deny-by-default posture must extend to the register field |
| Test membership against `registerPolicy.accepted` by reference, never a copied list | A second hardcoded accepted-register list would drift from D2-R8's policy field; reading the field by reference keeps one source of truth and follows it automatically if the accepted set changes |
| Make the test membership-based, not a literal `unknown` match | An out-of-set token like `marketing` is just as unresolved as `unknown`; testing `∈ accepted` rejects both, so the gate cannot be bypassed with a concrete but unaccepted value |
| Reuse `STATUS=ASK MISSING_REGISTER`, mint no new token | The ASK behavior already exists for this exact escalation; reusing it keeps the escalation surface stable and avoids a parallel token that could diverge |
| Append-only, every prior section preserved | The gate extends the existing cross-CLI deny contract; touching no prior line keeps the transport-result schema, assertion pairing, and laundering guard a single source of truth and makes rollback a clean section delete |
| Name the mixed-surface and text-only residuals as advisory | The gate proves membership, not correctness; over-claiming a taste guarantee from a string-set test would be dishonest, so both residuals are named with the parent demand-back as the floor |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Register Acceptance Gate present | PASS — H2 "Register Acceptance Gate" with resolve-and-test contract (`cli_child_pairing.md` lines 346-363) |
| Parent Re-Validation Extension | PASS — 6-step extension resolves, interprets via `shared/register.md`, tests `∈ registerPolicy.accepted`, denies and escalates (lines 352-361) |
| Register Deny Rules table | PASS — Unknown / Missing / Out-of-set / Parallel-list rows, each fail-closed DENY (lines 367-372) |
| Truth table holds | PASS — `unknown` ⇒ DENY/ASK, `marketing` ⇒ DENY, `brand` ⇒ pass, `product` ⇒ pass (lines 378-381) |
| Membership reads policy field by reference | PASS — `registerPolicy.accepted` referenced 8 times; "MUST NOT maintain a second hardcoded accepted-register list" (line 350); no parallel list found |
| ASK reuse, no new token | PASS — `STATUS=ASK MISSING_REGISTER` reused (4 occurrences); no newly minted escalation token |
| Named residuals documented | PASS — mixed-surface register correctness advisory + text-only child advisory bounded by the existing Named Residual (lines 385-387) |
| Append-only / preserved content | PASS — `git diff --numstat` shows 58 insertions, 0 deletions; transport-result=9, assertion=7, laundering=4 references intact |
| Evergreen scan over appended section | PASS — `grep -nE "specs/|packet|phase[ -]|ADR-|REQ-|task-[0-9]|finding"` over lines 346-400 returned nothing |
| Read-only policy boundary respected | PASS — `git status` shows `command-metadata.json` and `shared/register.md` untouched |
| Scope clean — no live skill file touched beyond the named output | PASS — `git status` shows only `cli_child_pairing.md` (the named output) modified; no cli-* SKILL and no policy source edited |
| `validate.sh --strict` | PASS except the expected GENERATED_METADATA residual (orchestrator regenerates `description.json` / `graph-metadata.json`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Register correctness on a genuinely mixed surface is advisory, not deterministic.** The gate proves the value is a member of `registerPolicy.accepted`; it cannot prove the child picked the right posture when Brand and Product dials diverge. A substantively-wrong-but-accepted register passes the deterministic gate. Application taste stays advisory.
2. **The text-only child channel degrades register checking to advisory.** A prose-only return with no machine-readable register field has no structured value to reconstruct. The residual inherits the existing text-only Named Residual; the parent demand-back remains the fail-closed floor for any machine-readable channel.
3. **Generated metadata is a residual at hand-off.** `description.json` and `graph-metadata.json` still need regeneration by the orchestrator after this doc sync; the strict validator's GENERATED_METADATA findings are expected and are not hand-written.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
