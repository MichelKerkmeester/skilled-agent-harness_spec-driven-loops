---
title: "Decision Record: Make Invalid Input Fail Loudly and Repair the Harnesses That Produce Evidence"
description: "Decision record for 031-silent-failure-and-harness-repair: the architectural rulings this remediation child depends on, with alternatives and consequences."
trigger_phrases:
  - "silent failure harness repair"
  - "input validation exit code deep loop"
  - "aggregate suite double registration"
  - "manual playbook dead runtime path"
  - "deep loop 031 silent failure"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/031-silent-failure-and-harness-repair"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored ADR-001 and ADR-002 from the WS1 phase-tree proposal"
    next_safe_action: "Operator accepts or rejects ADR-001 and ADR-002"
    blockers: []
    key_files:
      - "decision-record.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

# Decision Record: Make Invalid Input Fail Loudly and Repair the Harnesses That Produce Evidence

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Invalid input returns INPUT_VALIDATION with a distinct exit code

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | Packet owner |

---

<!-- ANCHOR:adr-001-context -->
### Context

Twelve Lane A findings describe the same shape: invalid input produces a success, a generic script error, or a silently substituted default. A `NaN` limit reaches array slicing with `status ok`. A misspelled flag writes to the default root and exits successfully. A schema failure surfaces as `SCRIPT_ERROR` rather than as an input problem. An operator cannot tell "the work happened" from "the input was wrong and the script proceeded anyway".

### Constraints

- Existing automation may branch on the current exit codes.
- The classification must be distinguishable from a genuine runtime failure.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Every invalid-input case returns an `INPUT_VALIDATION` classification with a distinct exit code, separate from both success and generic script failure.

**How it works**: Validation happens before any work. A failure produces the classification and the distinct code, and no downstream record is written. Consumers of the current codes are enumerated and updated in the same change.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`INPUT_VALIDATION` with a distinct exit code** | An operator can tell input problems from runtime failures; automation can branch | Existing consumers must be updated | 9/10 |
| Keep exit 1 for everything, improve the message | No consumer change | A message is not branchable; the class recurs at the next script | 4/10 |
| Exit 0 with a warning | Nothing breaks | This is the status quo failure | 1/10 |

**Why this one**: A distinct code is what turns "the operator might notice" into "the automation can act", which is the difference the twelve findings describe.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A silent success can no longer hide work that never happened.
- Automation can branch on an input problem specifically.

**What it costs**:
- Existing consumers of the current codes must be updated. Mitigation: enumerated in Phase 1.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A consumer breaks on the new code | M | Consumer enumeration (CHK-012) and same-change updates |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Twelve findings describe invalid input presenting as fine |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed |
| 3 | **Sufficient?** | PASS | A distinct code plus pre-work validation closes the lane |
| 4 | **Fits Goal?** | PASS | The evidence these scripts produce feeds every other claim |
| 5 | **Open Horizons?** | PASS | New scripts adopt the same classification |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Argument and input validation across the `runtime/scripts` set.
- Consumers that branch on the current exit codes.

**How to roll back**: Revert the Lane A commits; the previous codes return. Record that the Lane A findings re-open.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: A lower discovered-test count after de-duplication is a correction, not lost coverage

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | Packet owner, `021` owner |

---

<!-- ANCHOR:adr-002-context -->
### Context

`F-034-01` records that three rollback aggregates side-effect-import executable suites that Vitest also discovers independently, so roughly a hundred tests per aggregate are registered twice. The inflated counts are precisely the evidence `021` is reconciling. Fixing this lowers the number, and a lower number read without context looks like lost coverage.

### Constraints

- `021` may have already issued citations based on the inflated counts.
- The reduction must be attributable per file, or it cannot be distinguished from a genuine loss.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: The count reduction is reported as a delta with per-file attribution and explicit evidence that no unique test was removed.

**How it works**: The baseline records per-file discovered counts before de-duplication. After, the delta shows exactly which files dropped and by how much, with the unique-test set unchanged. The result is handed back to `021` so its citations can be re-verified.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Report as an attributed delta with unique-test evidence** | The reduction is legible as a fix; `021` can re-verify | Requires a per-file baseline before the change | 9/10 |
| Fix quietly and report only the final number | Simpler | A lower number with no explanation is indistinguishable from lost coverage, which is exactly the ambiguity `021` exists to remove | 2/10 |
| Leave the double registration and document it | No count change | Keeps inflated evidence in place; the counts stay unusable | 2/10 |

**Why this one**: The whole point of `021` is that a number without a reproducible derivation is not evidence. A count change produced by this child must therefore arrive with its derivation attached.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Test counts become usable evidence again.
- `021` can re-verify its citations against an attributable change.

**What it costs**:
- A per-file baseline must be captured before Lane B. Mitigation: it is one recorded run.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A genuinely unique test is removed alongside the duplicates | H | Unique-test evidence in the delta (CHK-033) |
| `021` re-reconciliation is forgotten | M | CHK-122 hand-back note; the sequencing rule in `MANIFEST.md` |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The inflated counts poison the evidence `021` is reconciling |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed |
| 3 | **Sufficient?** | PASS | An attributed delta is what makes the reduction legible |
| 4 | **Fits Goal?** | PASS | Directly supports Blocker 4's remediation |
| 5 | **Open Horizons?** | PASS | Future count changes follow the same reporting form |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Three rollback aggregate suites.
- The reported count evidence handed back to `021`.

**How to roll back**: Revert Lane B; the inflated counts return and `021`'s existing citations stay valid. Record that `F-034-01` re-opens.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
