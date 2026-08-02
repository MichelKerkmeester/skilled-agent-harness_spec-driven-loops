---
title: "Decision Record: executor-and-dispatch-contract-truth"
description: "Three proposed decisions carrying evidence: the disposition of unreachable Copilot branches, the separation of CLI capability from packet policy, and ownership of the executor roster number."
trigger_phrases:
  - "copilot branch disposition"
  - "capability versus policy"
  - "executor roster ownership"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/001-executor-and-dispatch-contract-truth"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "track-e-spec-author"
    recent_action: "Authored three Proposed decisions from synthesis rulings with evidence"
    next_safe_action: "Operator accepts or rejects ADR-001 through ADR-003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending-first-save"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: executor-and-dispatch-contract-truth

**Execution status:** In Progress. ADR-001 through ADR-003 remain Proposed; the BUILD leaf does not sign operator decisions.

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

All three decisions below are **Proposed**. Each carries the evidence the research loop and the synthesis produced, and each names the tasks it blocks. None may be marked Accepted by the executing agent — that is the operator's signature.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Disposition of the unreachable Copilot branches

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

Three command YAML assets carry conditional branches keyed on an executor kind that the executor schema does not define. The research found zero occurrences of that kind in the schema module and three branch sites in the YAMLs. A runtime test confirms the practical consequence: a dispatch naming that kind silently degrades to the native executor rather than failing. So the branches are dead weight that also lie — they imply a route exists.

Two exits are available, and they land in different packets.

### Constraints

- Registering the kind is a change to the executor schema, which is code, and this is a documentation packet.
- Leaving the branches in place preserves a documented route that cannot be taken, which is the exact defect class this phase exists to remove.
- Whichever way it goes, the YAMLs and the schema must agree afterwards.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: retire the branches — remove the dead conditional sites so the YAMLs describe only kinds the schema defines.

**How it works**: the three branch sites are deleted, and the phase's derived-roster check then covers the YAML assets as well as the documents, so a future branch on an undefined kind fails a check rather than degrading silently.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

- **Register the kind in the schema.** Rejected as the default because it converts a documentation phase into a code change with its own test surface. If the operator wants the executor genuinely supported, this is the right answer — but the code half files to the code-conformance packet and this phase carries only the documentation.
- **Leave the branches and document them as aspirational.** Rejected: a route that raises or silently degrades is not aspirational, it is wrong, and documenting it as intentional makes the next reader trust it.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The YAMLs and the schema agree; the silent-degradation path disappears.

**What it costs**:
- If the executor is later wanted, the branches must be rewritten. Mitigation: the deletion is a small, revertible diff and the intent is recorded here.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The executor is wanted later and the deletion looks like it foreclosed the option | L | The rationale and the revertible diff are recorded here, in this decision record |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A runtime test confirms the branches silently degrade to the native executor rather than failing |
| 2 | **Beyond Local Maxima?** | PASS | Registering the kind in the schema was considered and rejected as a code change outside this phase's scope |
| 3 | **Sufficient?** | PASS | Three branch-site deletions, no broader schema or dispatch redesign |
| 4 | **Fits Goal?** | PASS | Directly removes a defect this phase exists to find and fix: documentation that describes a route that cannot be taken |
| 5 | **Open Horizons?** | PASS | The deletion is a small, revertible diff; genuine future support remains available through the code-conformance packet |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The three conditional branch sites keyed on the undefined executor kind are deleted from the command YAML assets.
- The phase's derived-roster check is extended to cover the YAML assets as well as the documents, so a future branch on an undefined kind fails a check rather than degrading silently.

**How to roll back**: revert the deletion commit; the derived-roster check extension can be reverted independently since it only adds coverage, it does not depend on the branch deletion.

### Blocks

`tasks.md` T026. Also gates whether this phase has any cross-packet code dependency at all.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: CLI capability and packet policy are two separate statements

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-002-context -->
### Context

The prior correction incorrectly reframed Cursor's parameterized-model rejection as a deep-loop policy exclusion. Live tests against installed `cursor-agent 2026.07.23-e383d2b` rejected all three forms at the CLI boundary: `composer-2.5[effort=high]`, Cursor's own `--help` example `claude-opus-4-8[context=1m,effort=high,fast=false]`, and `cursor-grok-4.5[effort=high]`. Each returned `Cannot use this model: ... Available models: ...` and exited 1 before repository dispatch code ran.

The bracket syntax is therefore a real CLI capability limit. The deep-loop model allowlist is a separate policy constraint for exact supported ids, but it is not the reason the bracket forms fail.

### Constraints

- A capability claim is falsifiable against the binary; a policy claim is not.
- The live CLI rejection establishes the bracket limitation independently of the repository allowlist.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: restore the bracket-model rejection as a CLI capability limit, while keeping the exact-id allowlist as a separate packet-policy statement.

**How it works**: the packet states that the installed CLI itself rejects parameterized model strings with `Cannot use this model`, and separately states that deep-loop dispatch is limited to the exact allowlisted ids. The docs must not claim that policy alone excludes a bracket form the CLI cannot parse.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

- **Treat the bracket syntax as policy-only.** Rejected: three live CLI tests show the failure occurs before repository dispatch code runs.
- **Treat the CLI help example as proof that the bracket syntax works.** Rejected: the CLI advertises the example but rejects it with `Cannot use this model`.

### Consequences

- Positive: the capability limitation is documented from live CLI behavior, and the separate allowlist policy remains reviewable on its own merits.
- Negative: the references retain both a capability warning and an allowlist statement. Accepted.

### Blocks

`tasks.md` T012.
<!-- /ANCHOR:adr-002-alternatives -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: One document owns the executor roster number

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | Operator, with the track that owns the feature-catalog leaf |

---

<!-- ANCHOR:adr-003-context -->
### Context

The same fact about how many executors the dispatcher supports is stated independently in a deep-loop mechanics reference and in a feature-catalog leaf owned by another track. Both were found stale, separately, by two different research tracks. That is the signature of a number with no owner: each copy rots on its own schedule and neither reader can tell which is current.

### Constraints

- The two documents live in different packets with different owners, so the decision needs agreement, not just a ruling.
- The underlying authority is code; neither document should hold the number if it can hold a link instead.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: the deep-loop mechanics reference is the single authority for the dispatcher roster, and it derives its value from the code rather than restating it. Every other mention, including the feature-catalog leaf, becomes a link to that reference.

**How it works**: the authority document names the code symbol it derives from; the derived-roster check asserts the authority's set against that symbol; every other document is checked for a *link*, not for a number.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

- **Let the catalog leaf be authoritative.** Rejected: the catalog is an index of features, not a contract about dispatch, and it is further from the code.
- **Let both restate it and add a consistency test.** Rejected: a test that compares two hand-typed numbers still requires both to be edited, and it will be disabled the first time it is inconvenient.

### Consequences

- Positive: one number, one owner, one check.
- Negative: requires a cross-track agreement before either lands. Mitigation: `tasks.md` T034 makes that agreement an explicit task rather than an assumption.

### Blocks

`tasks.md` T034; coordination with the track (c) packet.
<!-- /ANCHOR:adr-003-alternatives -->
<!-- /ANCHOR:adr-003 -->
