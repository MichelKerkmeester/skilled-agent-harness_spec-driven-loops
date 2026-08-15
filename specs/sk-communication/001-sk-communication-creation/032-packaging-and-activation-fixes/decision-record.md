---
title: "Decision Record: Packaging and Activation Fixes"
description: "Use the existing package build and local provider loader as the authorities for install activation and LM Studio configuration."
trigger_phrases:
  - "packaging-and-activation-fixes"
  - "architecture decision"
  - "LM Studio endpoint normalization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/001-sk-communication-creation/032-packaging-and-activation-fixes"
    last_updated_at: "2026-08-15T09:15:00.000Z"
    last_updated_by: "opencode"
    recent_action: "Accepted and verified the package and loader authority decision."
    next_safe_action: "Use the verified package activation flow."
    blockers: []
    key_files:
      - "decision-record.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-032-packaging-and-activation-fixes-20260815"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
---
# Decision Record: Packaging and Activation Fixes

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep build activation in the package lifecycle and LM Studio resolution in the loader

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-15 |
| **Deciders** | Project owner and implementer at closeout |

---

<!-- ANCHOR:adr-001-context -->
### Context

Both runtime entry points import ignored `dist/` output, while the package has no install lifecycle build. The packed artifact also excludes the wrapper and enablement example. The existing loader already accepts `lmstudio`, but the example places it in an ignored decorative block. The requested example uses LM Studio's `/v1` API base, while the transport posts directly to the record endpoint and therefore needs the concrete chat-completions route.

### Constraints

- Install must build through the existing TypeScript script.
- Packing must not add source, tests, or dependencies.
- Configuration must retain one loader authority and one real provider block.
- Absent, malformed, disabled, unsafe, and failed paths must retain exact-original behavior.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We decided**: add `prepare` as a delegate to `npm run build`, ship the wrapper and enablement example through the package allowlist and bin map, and keep LM Studio on the existing `lmstudio` loader kind.

The loader will normalize only an LM Studio endpoint whose path is `/v1` or `/v1/` to `/v1/chat/completions`. Explicit full endpoints remain unchanged. Validation and privacy classification remain unchanged.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Benefit | Cost | Score |
|--------|---------|------|-------|
| Existing build and loader authorities | Small change with no duplicate config logic | Runtime still depends on a successful install | 9/10 |
| Add a second LM Studio config block parser | Accepts the decorative shape | Creates two competing configuration paths | 2/10 |
| Add launcher-side enablement parsing | Allows passthrough without build output | Duplicates loader rules and weakens runtime validation | 3/10 |
| Add a new LM Studio provider family | More distinct naming | Duplicates an already-supported OpenAI-compatible route | 2/10 |

**Why this one**: it fixes the observed packaging failures with the smallest authority-preserving change.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Plain package install creates the ignored runtime output.
- Tarball consumers receive the executable wrapper and the real config example.
- Copying the LM Studio example resolves to the request endpoint that the transport needs.

**What it costs**:

- Install runs the TypeScript build.
- A missing or failed install still leaves entry points without built output.

**Mitigation**: the install proof and package gate verify the build, and runtime fallback behavior remains unchanged rather than duplicating config parsing in the wrapper.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | Necessary? | PASS | Fresh checkout and packed-consumer entry points lack required artifacts. |
| 2 | Beyond local maxima? | PASS | Lifecycle, launcher, loader, and provider alternatives were compared. |
| 3 | Sufficient? | PASS | Manifest, example, endpoint resolution, and tests cover all requested P1 items. |
| 4 | Fits goal? | PASS | The result supports plain install and copy-paste LM Studio activation. |
| 5 | Open horizons? | PASS | Other provider kinds and explicit full endpoints remain unchanged. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

The package manifest, enablement example, local provider loader, and focused package tests implement this decision. Rollback restores those files and reruns the package and packet gates. No canonical or persisted user data changes.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
