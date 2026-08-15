---
title: "Decision Record: Phase 017 Runtime-Wiring Feasibility and Contract"
description: "Proposed architecture decisions for Phase 017: adopt two integration patterns with a per-runtime assignment, and contract a fail-open exact-original fallback at every seam."
trigger_phrases:
  - "runtime-wiring-feasibility-and-contract"
  - "architecture decision"
  - "integration pattern and fail-open seam contract"
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
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-017-runtime-wiring-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The integration contract is the two-pattern assignment behind one fail-open seam."
      - "Every activation path must consult the Phase 016 enablement gate before projecting."
      - "Both ADRs are Accepted and validated by the successful 018-028 implementation."
---
# Decision Record: Phase 017 Runtime-Wiring Feasibility and Contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Adopt two integration patterns with a per-runtime assignment

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-14 |
| **Deciders** | Operator and implementer; acceptance follows the successful implementation of phases 019-025 against this decision |

---

<!-- ANCHOR:adr-001-context -->
### Context

The runtimes do not share a uniform hook surface. Prior research shows that OpenCode is the only runtime with a native output-transform hook, the plugin `chat.message` event whose `output.parts` mutation renders as the chat bubble. Claude Code, Codex, Devin, and Cursor expose only input, tool, and session-lifecycle hooks and cannot rewrite a rendered assistant message. Pi is partial: `turn_end` delivers the assistant message but in-repo only reads it. Later phases must know which integration each runtime uses before they can wire projection.

### Constraints

- The decision must assign every supported runtime exactly one integration pattern.
- The OpenCode display caveat must be validated before the native pattern is treated as final.
- The Pi `turn_end` mutation question must be resolved before Pi is assigned a native pattern.
- No runtime hook surface may be changed by this design phase.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We decided**: adopt exactly two integration patterns, the native plugin pattern for OpenCode and the CLI-output wrapper pattern for the input-hook-only runtimes, with Pi assigned by probe outcome.

**How it works**: OpenCode uses the plugin `chat.message` event, mutating `output.parts` so the projection renders in the chat bubble, subject to the display-validation probe. Claude Code, Codex, Devin, and Cursor run through the CLI-output wrapper, which runs the CLI in headless, stream, or print mode, captures the rendered assistant message, transforms it, and re-renders it. Pi attempts the native `turn_end` mutation; if the probe does not prove that the rendered bubble changes, Pi is routed to the wrapper. The feasibility matrix records the assignment and the go/no-go verdict per runtime as the authority for phases 019-025.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Two patterns with a per-runtime assignment | Matches the real hook surfaces, one native path where possible, one wrapper path elsewhere | Two integration paths to maintain | 9/10 |
| Native plugin everywhere | One integration mechanism | Only OpenCode exposes a render-time hook, so the other runtimes cannot use it | 3/10 |
| CLI-output wrapper everywhere | One integration mechanism | Wastes the only native render seam and adds wrapper latency on OpenCode | 5/10 |
| Per-runtime bespoke integrations | Maximally tailored | Reintroduces the divergence the contract is meant to prevent | 4/10 |

**Why this one**: the two-pattern assignment matches the confirmed capability split, keeps the native render seam where it exists, and gives later phases one contract instead of per-runtime invention.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Each runtime has one unambiguous integration path for phases 019-025.
- The native OpenCode seam is used where it can render, and the wrapper covers the rest.

**What it costs**:

- Two integration patterns must be maintained. Mitigation: both share the same seam contract, so the seam rules are decided once.
- The native pattern depends on the OpenCode display probe passing. Mitigation: the fail-open seam preserves the original and the matrix re-assigns OpenCode if the probe fails.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The OpenCode mutation does not render visibly. | High | The display probe runs in setup; on failure OpenCode is re-assigned and the original is preserved. |
| The Pi mutation probe is inconclusive. | Medium | Pi routes to the CLI-output wrapper with the reason recorded. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Later phases must know the per-runtime integration before they can wire projection. |
| 2 | Beyond local maxima? | PASS | Four materially different integration strategies were compared. |
| 3 | Sufficient? | PASS | Two patterns behind one seam contract is the smallest complete design. |
| 4 | Fits goal? | PASS | It makes runtime wiring a contract decision rather than per-phase invention. |
| 5 | Open horizons? | PASS | New runtimes can join the matrix without changing the seam contract. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What will change**:

- `spec.md`: the feasibility matrix assigning each runtime one pattern and a go/no-go verdict.
- `plan.md` and `tasks.md`: the OpenCode display probe and the Pi mutation probe that close the assignment.
- `decision-record.md`: this ADR and the fail-open contract ADR.

**How to roll back**: revise the affected matrix row and its contract clause, rerun the failing probe, and refresh the packet metadata. No runtime code changes are involved.

**Validation**: the decision is Accepted and validated by the successful implementation of phases 019-025 against the matrix assignment: the OpenCode native plugin, the wrapper framework, and the Claude Code, Codex, Pi, Devin, and Cursor wrappers all pass.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Contract a fail-open exact-original fallback at every seam

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-14 |
| **Deciders** | Operator and implementer; acceptance follows the successful implementation of phases 019-025 against this decision |

---

<!-- ANCHOR:adr-002-context -->
### Context

Projection rewrites rendered output at the seam, where any failure could corrupt what the operator sees. The runtimes vary in capability, the fidelity checks can reject a candidate, and projection may be disabled or unsupported. Without a single fallback rule, each wiring phase could choose its own failure behavior and leak partial or transformed output.

### Constraints

- Any error, disabled flag, incapable runtime, or failed fidelity check must never yield partial output.
- The byte-exact original must always be available for exact restore.
- The fallback must be local and require no network access.
- The rule must apply identically at every seam, native or wrapped.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We decided**: contract a fail-open exact-original fallback at every seam, so any failure resolves to the byte-exact original message.

**How it works**: every activation path and seam entry first calls `isProjectionEnabled()` and returns the exact original when projection is disabled. Capability and privacy pre-checks run before any hosted routing. When projection proceeds, the fidelity check validates the candidate; on any error, disabled flag, incapable runtime, or failed fidelity check the seam emits the byte-exact original. Originals are retained for exact restore, and no projection path mutates canonical message bytes.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Fail-open exact-original fallback | Guarantees the operator never sees partial output, local and simple | An error silently reverts to the original, hiding projection failure | 9/10 |
| Fail-closed with an error marker | Signals that projection failed | Can interrupt the session and confuse the operator | 4/10 |
| Best-effort partial output | Keeps some projected value | Violates the byte-exact guarantee and can corrupt the canonical view | 2/10 |

**Why this one**: the byte-exact original is the only safe contract for a display layer whose canonical bytes must never be changed.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:

- Every seam resolves to one safe outcome, so later phases cannot diverge.
- Canonical bytes stay intact and restorable at all times.

**What it costs**:

- A failed projection reverts to the original, which hides the failure from the operator. Mitigation: the seam contract records the revert as the designed, observable behavior.
- The retained originals require storage. Mitigation: retention is bounded to the message window already used for restoration.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A seam skips the gate and projects by default. | High | The contract requires `isProjectionEnabled()` on every activation path, with the exact original on `false`. |
| An operator reads the revert as a bug. | Medium | The revert is the documented, deterministic contract, not an error path. |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | A display layer that can corrupt the canonical view requires a single safe fallback. |
| 2 | Beyond local maxima? | PASS | Three failure policies were compared. |
| 3 | Sufficient? | PASS | The gate, pre-checks, fidelity check, and byte-exact original form the smallest complete rule. |
| 4 | Fits goal? | PASS | It keeps the byte-exact original as the guaranteed fallback. |
| 5 | Open horizons? | PASS | New runtimes and seams inherit the same rule without redesign. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What will change**:

- `spec.md`: REQ-002 through REQ-005 stating the gate placement, the fail-open fallback, canonical-bytes preservation, and the pre-checks.
- `plan.md` and `tasks.md`: the contract authoring tasks that later phases consume.
- `decision-record.md`: this ADR recording the fallback contract.

**How to roll back**: revise the contract clause and the corresponding requirements, then refresh the packet metadata. No runtime code changes are involved.

**Validation**: the decision is Accepted and validated by the successful implementation of the fail-open seam in phases 018-026, including the enablement gate, exact-original restore, and privacy pre-checks.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
