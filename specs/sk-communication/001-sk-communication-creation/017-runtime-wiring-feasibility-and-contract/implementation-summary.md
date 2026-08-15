---
title: "Implementation Summary: Phase 017 Runtime-Wiring Feasibility and Contract"
description: "The design phase is complete: the feasibility matrix and the hook-to-projection integration contract are finalized and validated by the successful 018-028 implementation, with the manual OpenCode live-render check recorded as the sole documented follow-up."
trigger_phrases:
  - "runtime-wiring-feasibility-and-contract"
  - "implementation summary"
  - "hook to projection integration contract"
  - "runtime wiring feasibility validated"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/017-runtime-wiring-feasibility-and-contract"
    last_updated_at: "2026-08-14T09:35:00.000Z"
    last_updated_by: "claude"
    recent_action: "Closed out Phase 017 as Complete."
    next_safe_action: "Run the OpenCode live-render check as the manual follow-up."
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-017-runtime-wiring-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "The feasibility matrix and integration contract are finalized and validated by the successful 018-028 implementation."
      - "The sole open item is the manual OpenCode live-render check, recorded as a documented manual follow-up, not a blocker."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 017 Runtime-Wiring Feasibility and Contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 017-runtime-wiring-feasibility-and-contract |
| **Status** | Complete |
| **Completed** | 2026-08-14 |
| **Completion** | 100% |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 017 is a design and contract phase; it produces no code of its own. Its deliverables are the per-runtime feasibility matrix and the hook-to-projection integration contract that phases 018-028 implement against. Both deliverables were authored and finalized in this packet, and both are now validated by the successful downstream implementation.

The feasibility matrix assigns each of the six runtimes exactly one integration pattern with a go/no-go verdict: the native plugin pattern for OpenCode and the CLI-output wrapper pattern for Claude Code, Codex, Devin, and Cursor, with Pi assigned to the wrapper per the matrix's fallback rule. The integration contract states the enablement-gate placement (`isProjectionEnabled()` on every activation path), the fail-open exact-original fallback, canonical-bytes preservation, and the per-runtime capability and privacy pre-checks that gate hosted routing.

The downstream phases 018-028 were implemented against this contract and all pass. That successful implementation is the validation evidence for this phase:

- **Phase 018 (projection runtime core)** and **Phase 019 (OpenCode native plugin)**: the package gate passes with 385/385 tests across 73 files (typecheck, build, and public-import smoke included), and the OpenCode plugin suite passes 17/17 tests.
- **Phases 020-025 (CLI-output wrapper framework plus the Claude Code, Codex, Pi, Devin, and Cursor wrappers)**: all five CLI wrappers are built against the wrapper seam contract.
- **Phase 026 (capability and privacy gating)**: the capability/privacy doctor gate is built.
- **Phase 027 (evaluation and release gate)** and **Phase 028 (wiring docs and operator rollout)**: the evaluation/release gate and operator rollout documentation are built.
- Every implementing phase 018-028 reports a Complete status in its own packet metadata.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `017-runtime-wiring-feasibility-and-contract/` | Completed | Recorded the Level-3 packet with the feasibility matrix, the integration contract, and the validation evidence from the 018-028 implementation |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The phase authored its documentation-only deliverables first: the feasibility matrix and the seam contract in `spec.md`, the execution plan and task breakdown in `plan.md` and `tasks.md`, the verification gates in `checklist.md`, and the integration-pattern and fail-open decisions in `decision-record.md`. No runtime adapter or hook surface was changed by this phase.

After the design was finalized, phases 018-028 implemented against it. Each implementing phase consumed the matrix assignment for its runtime and the seam rules from the contract, and each passed its own verification. This closeout reconciles the Phase 017 packet to Complete on the strength of that downstream evidence, with the single interactive check that could not run in an automated environment recorded explicitly as a manual follow-up.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Adopt two integration patterns behind one seam contract | Only OpenCode has a native output-transform hook; the input-hook-only runtimes need the CLI-output wrapper, and one seam rule keeps later phases from diverging |
| Mandate `isProjectionEnabled()` on every activation path | The Phase 016 default-off gate is the hard dependency of every activation rule |
| Contract a fail-open exact-original fallback | Any error, disabled flag, incapable runtime, or failed fidelity check must yield the byte-exact original, never partial output |
| Preserve canonical bytes with retained originals | The projection layer must never mutate canonical message bytes, and exact restore must always be possible |
| Gate hosted routing behind capability and privacy pre-checks | No content leaves the machine until the runtime and provider are verified |
| Record the OpenCode live-render check as a manual follow-up | The display check requires an interactive OpenCode session and cannot be proven by an automated closeout, so it is documented rather than claimed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Feasibility matrix | PASS: `spec.md` assigns each of the six runtimes exactly one integration pattern and a go/no-go verdict |
| Integration contract | PASS: `spec.md` REQ-001 through REQ-006 and `decision-record.md` ADR-001 and ADR-002 state the gate placement, fail-open fallback, canonical-bytes preservation, and pre-checks |
| Downstream validation | PASS: phases 018-028 are implemented against this contract and each reports a Complete status in its packet metadata |
| Package gate | PASS: `npm run check` in `cli-communication-projection` passes typecheck, build, public-import smoke, and 385/385 tests across 73 files |
| OpenCode plugin suite | PASS: `node --test .opencode/plugins/tests/mk-communication-projection.test.cjs` reports 17/17 tests passing |
| Wrapper and gate phases | PASS: the Claude Code, Codex, Pi, Devin, and Cursor wrappers (020-025), the capability/privacy doctor gate (026), and the evaluation/release gate (027) are all built |
| Phase 017 strict validation | PASS: `validate.sh --strict` on Phase 017 reports 0 errors and 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The OpenCode live-render check has not been run.** Whether a mutated `chat.message` `output.parts` entry renders visibly in the OpenCode chat bubble requires a live, interactive OpenCode session and cannot be validated in this automated closeout. This is a documented manual follow-up, not a blocker: the design contract does not depend on the render result, the plugin's fail-open behavior is fully unit-tested, and the canonical original is always recoverable. The check is already recorded as a manual validation step in Phase 019's `implementation-summary.md`.

### Manual Follow-Up

Run an interactive OpenCode session with the projection plugin enabled, send a message, and observe whether the assistant text in the chat bubble renders as the projection or the original. With the flag off, or with the kill-switch set, the original must render byte-identically. Until this check runs, the visible-render outcome remains unconfirmed by design.

### Post-Land Continuation

After this phase closes:

1. Run the manual OpenCode live-render check in an interactive session and record its outcome.
2. Re-validate the feasibility matrix snapshot if any runtime changes its hook surface.
3. Reuse the contract as the authority for any future runtime added to the matrix.
<!-- /ANCHOR:limitations -->
