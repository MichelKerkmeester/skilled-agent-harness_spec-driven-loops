---
title: "Decision Record: Hook Feature Flags + Full Hub Index"
description: "Architecture decisions for shared hook kill-switch semantics, shell parity, enforcement separation, canonical editing, compiled distribution loading, and documentation ownership."
status: "accepted"
completion_pct: 100
trigger_phrases:
  - "hook feature flag decisions"
  - "isHookEnabled architecture"
  - "hook kill-switch ADR"
  - "hook flags shell parity"
importance_tier: "high"
contextType: "decision"
parent: "./spec.md"
_memory:
  continuity:
    packet_pointer: "hooks/010-hook-feature-flags-and-hub-index"
    last_updated_at: "2026-08-14T08:08:08Z"
    last_updated_by: "opencode"
    recent_action: "Shipped all seven phases and reconciled the complete Level-3 packet"
    next_safe_action: "Retain verification evidence for future review"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "4654af88-ba88-466a-bd14-2fa43ea87923"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use one shared concern guard with master and per-concern flags"
      - "Keep MK_SPEC_GATE_ENFORCE separate from generic disable controls"
      - "Keep the hub README as the only canonical kill-switch index"
---
# Decision Record: Hook Feature Flags + Full Hub Index

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Cross-Runtime Hook Kill-Switch Architecture

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-14 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

Repo-authored hooks run through different runtime adapters, module formats, shell entrypoints, and compiled distributions. Operators need one predictable way to silence all hooks or one concern without changing default behavior, weakening independent enforcement policy, or maintaining competing flag catalogs.

### Constraints

- Existing hooks remain enabled when no disable flag is set.
- Runtime-specific loaders and canonical symlink ownership must continue to resolve correctly.
- `MK_SPEC_GATE_ENFORCE` remains an independent deny control.
- The git pre-commit emergency-off cannot bypass the existing mass-deletion protection by default.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Use one concern-generic guard contract across runtime, shell, git, and compiled hook surfaces.

**How it works**:

1. `isHookEnabled(concern)` checks `MK_HOOKS_DISABLED`, then `MK_<CONCERN>_DISABLED` and registered legacy aliases. It is default-on and fail-open.
2. POSIX consumers source `hook-flags.sh`, which mirrors the CJS/MJS truthy and default semantics.
3. Spec-gate uses the `spec-gate` concern guard while keeping `MK_SPEC_GATE_ENFORCE` separate: the master switch silences the hook, while enforcement still scopes deny behavior when the hook is enabled.
4. The git pre-commit chain accepts `MK_GIT_COMMIT_HOOKS_DISABLED` as an early emergency-off without weakening the mass-deletion guard or comment-hygiene checks during normal operation.
5. `.opencode/hooks/README.md` is the single canonical kill-switch index. No `kill-switches.md` catalog is added.
6. Changes target canonical files behind skill-owned symlinks, not the hub symlink paths.
7. Compiled distribution hooks resolve the shared guard with `createRequire`, so source changes become effective after the required rebuild.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared concern guard plus POSIX mirror** | One operator model, default-on compatibility, isolated concerns, cross-module parity | Requires each adapter family to wire the guard correctly | 9/10 |
| Per-adapter conditionals | Small local edits | Semantics and aliases drift across runtimes | 4/10 |
| Master switch only | Minimal flag surface | Cannot isolate one noisy or failing concern | 5/10 |
| Separate `kill-switches.md` catalog | Dedicated flag document | Creates a fourth catalog that can diverge from the hub index | 3/10 |

**Why this one**: The shared contract gives operators one stable model while preserving each hook's existing enabled behavior and concern-specific isolation. A POSIX mirror extends that contract to shell and git consumers without introducing a shell-to-Node dependency.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The 20 concerns share master-off, self-flag, isolation, and truthy/falsy behavior.
- Existing aliases remain usable while the README exposes one canonical flag per concern.
- Canonical source edits and distribution rebuilds produce the behavior loaded by runtime shims.

**What it costs**:
- New hook families must select and document a concern slug. Mitigation: keep the canonical matrix in `.opencode/hooks/README.md`.
- CJS/MJS and POSIX implementations must remain behaviorally aligned. Mitigation: retain the cross-flavor and shell matrix proofs.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A compiled hook loads stale behavior | H | Resolve the guard through `createRequire` and rebuild distributions after source changes |
| A concern flag disables unrelated work | H | Verify per-concern isolation across all 20 concerns |
| Spec-gate disable and enforce controls become conflated | H | Keep `MK_SPEC_GATE_ENFORCE` outside the generic disable resolver |
| Documentation catalogs diverge | M | Keep the hub README as the only canonical index |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Runtime adapters and shell consumers need a common operator kill-switch contract |
| 2 | **Beyond Local Maxima?** | PASS | Master-only, per-adapter, and separate-catalog alternatives were compared |
| 3 | **Sufficient?** | PASS | One shared resolver plus one POSIX mirror covers the required module and shell boundaries |
| 4 | **Fits Goal?** | PASS | The design directly supports all 20 verified concern families |
| 5 | **Open Horizons?** | PASS | New concerns can adopt the same slug-derived canonical flag without new resolver APIs |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Runtime adapters call `isHookEnabled` before executing concern work.
- Shell, install, cleanup, freshness, and git paths use the POSIX mirror where appropriate.
- The hub README and environment reference document the canonical flags and live aliases.

**How to roll back**: Set the master or concern-specific disable flag for immediate operational silence. Revert a concern's canonical source and rebuild its compiled distribution only when removing the integration itself is required.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
