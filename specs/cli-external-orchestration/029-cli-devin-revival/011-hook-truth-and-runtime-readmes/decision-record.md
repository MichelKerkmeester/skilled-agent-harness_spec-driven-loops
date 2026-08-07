---
title: "Decision Record: Current Devin hook truth with preserved superseded evidence"
description: "Choose how current documentation ranks corrected schema and live observations while retaining the failed experiments that caused the original dormancy conclusion."
trigger_phrases:
  - "Devin hook truth decision"
  - "superseded hook evidence"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/011-hook-truth-and-runtime-readmes"
    last_updated_at: "2026-07-26T19:05:13Z"
    last_updated_by: "opencode"
    recent_action: "Applied source-ranked reconciliation with preserved history"
    next_safe_action: "Rotate or revoke the removed credentials in the provider dashboards"
    blockers: []
    key_files: ["../hook-testing-results.md", "../../../.devin/hooks.v1.json"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-011-hook-truth"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Preserve tests 1-9 as superseded evidence rather than delete them."]
---
# Decision Record: Current Devin Hook Truth With Preserved Superseded Evidence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Rank Corrected Schema and Observed Events Above Unsupported-Schema Tests

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-25 |
| **Deciders** | Operator and OpenCode executor |

---

<!-- ANCHOR:adr-001-context -->
### Context

Tests 1-9 observed no hooks while `.devin/hooks.v1.json` used an unsupported wrapper shape. Tests 10-14 rewrote the file to Devin's documented top-level event structure and then observed six lifecycle events, real payload fields and model-visible adapter output. Current docs still mix those two conclusions, which can mislead maintainers into treating working safeguards as dead code.

### Constraints

- Historical observations remain useful for explaining why the unsupported schema failed silently.
- Current operator guidance must not present the superseded inference as present behavior.
- Events and branches that did not occur remain unobserved, not failed and not verified.
- Credential values found in user-local configuration must not be copied into documentation.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Source-ranked reconciliation with explicit supersession.

**How it works**: Current docs lead with the corrected schema and tests 10-14. Tests 1-9 remain in the canonical evidence document under a dated superseded heading, and any later reference to them states that the observation was real but the registration was invalid and the packet-wide dormancy inference was wrong.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Source-ranked reconciliation** | Accurate current state, preserves audit trail and debugging lesson | Requires a broad bounded documentation sweep | 9/10 |
| Delete tests 1-9 | Removes contradictory text quickly | Erases useful evidence and the root-cause lesson | 4/10 |
| Leave current docs unchanged and add one handover note | Small diff | Operational docs remain false and future phases inherit the wrong enum | 2/10 |

**Why this one**: It is the only option that gives operators a correct current answer without rewriting history. The extra sweep cost is bounded by focused grep and strict validation.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Runtime and planning docs describe the same observed event matrix.
- Future work distinguishes `observed live`, `directly tested`, `registered but unobserved` and `not applicable`.
- The unsupported-schema failure remains discoverable for future debugging.

**What it costs**:

- Several completed phase docs need correction. Mitigation: use a fixed target list and regenerate metadata after content settles.
- Some uses of `dormant` remain valid for the MCP route guard's independent no-external-family condition. Mitigation: classify every surviving occurrence rather than banning the word globally.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A current-status sentence escapes the sweep | H | Focused packet and README grep after edits. |
| Historical evidence is accidentally rewritten as if it never happened | M | Keep tests 1-9 and mark their inference superseded. |
| A live event is overstated | H | Retain explicit caveats for events and branches not observed. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Current operational docs contradict verified live behavior. |
| 2 | **Beyond Local Maxima?** | PASS | Delete-history and one-note alternatives were evaluated. |
| 3 | **Sufficient?** | PASS | Correct docs and metadata only; no adapter rewrite is needed. |
| 4 | **Fits Goal?** | PASS | Hook-truth reconciliation is the active goal's first completion condition. |
| 5 | **Open Horizons?** | PASS | Observation-state wording remains valid when new events are tested later. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- Canonical evidence, phase status and runtime READMEs adopt the source-ranked event matrix.
- Planned manual-test and feature-catalog requirements use observation-state vocabulary.
- User-local Zed entries that retain obsolete credentials are removed rather than documented.

**How to roll back**: Reverse only the allowlisted repository diff, remove the added Cursor symlink and restore the exact pre-edit Zed blocks from the captured content. Then rerun the same schema, README, symlink and packet gates.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
