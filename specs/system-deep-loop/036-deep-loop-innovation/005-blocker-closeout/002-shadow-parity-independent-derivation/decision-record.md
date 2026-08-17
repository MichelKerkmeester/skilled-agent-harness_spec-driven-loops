---
title: "Decision Record: Rebuild Shadow Parity So Both Sides Derive Independently"
description: "Decision record for 002-shadow-parity-independent-derivation: the architectural rulings this remediation child depends on, with alternatives and consequences."
trigger_phrases:
  - "shadow parity independent derivation"
  - "blocker 1 parity harness"
  - "harness adapter legacy oracle"
  - "divergence injection test parity"
  - "deep loop 022 parity"
importance_tier: "critical"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/005-blocker-closeout/002-shadow-parity-independent-derivation"
    last_updated_at: "2026-08-17T04:04:40Z"
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

# Decision Record: Rebuild Shadow Parity So Both Sides Derive Independently

---

<!-- ANCHOR:adr-001 -->
## ADR-001: One comparator pattern applied six times, not six bespoke harnesses

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | Packet owner, independent verifier |

---

<!-- ANCHOR:adr-001-context -->
### Context

Six adapters exhibit the same defect in six shapes: the harness compares a projection to a near-copy of itself. `F-006-01` and `F-006-02` are CONFIRMED; the four `F-012-*` findings describe the same mechanism in the improvement variants and deep-review. Fixing them independently would produce six comparators that drift, and would leave no shared definition of what "parity" covers.

### Constraints

- Each mode has a different protected semantic surface, so the comparator must be parameterised by data rather than forked per mode.
- A partial oracle already exists (`assertLegacyProjectionMatchesCurrentState`, four digests, throws rather than diffing).
- The rebuild must be provable, not merely plausible: a renamed harness must be distinguishable from a rebuilt one.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: One comparator core parameterised by a per-mode protected-surface list, with an independently implemented legacy oracle per mode.

**How it works**: The comparator takes a ledger projection, a legacy projection, and a surface list, and returns a diff. Each mode supplies an oracle that derives the legacy projection from the input log without reading the reducer fold. An import-graph assertion enforces that independence mechanically.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One comparator core + six oracles** | Single definition of parity; per-mode differences stay data; independence enforced mechanically | Requires enumerating six surfaces up front | 9/10 |
| Six bespoke comparators | Each mode evolves freely | Six definitions of parity that drift; the defect recurs per mode | 3/10 |
| Reuse the reducer as the oracle with a different entry point | Least code | Not independent; this is precisely the confirmed defect | 1/10 |
| Property-based differential testing only | Finds surprises the surface list misses | Non-deterministic gate; cannot serve as cutover evidence on its own | 5/10 |

**Why this one**: It is the only option that yields a single, reviewable definition of parity while keeping the two derivations genuinely independent, and the import-graph assertion makes independence a check rather than a promise.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Parity becomes capable of failing, which is the whole point of Blocker 1.
- A future mode inherits the comparator instead of inventing a seventh variant.
- Independence is enforced by an assertion rather than by author discipline.

**What it costs**:
- Six protected-surface lists must be enumerated before any comparator code. Mitigation: that enumeration is the highest-value review artifact in the child.
- A shared core means a comparator bug affects all six modes. Mitigation: divergence injection per mode catches a comparator that under-reports.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Surface list is incomplete, so the comparator misses a real divergence | H | Surface-to-test mapping (CHK-032) with no unmapped element; independent review of the lists |
| Shared core bug affects all six modes at once | M | Six independent divergence injections would all fail, making the bug loud rather than silent |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Blocker 1 is a named cutover blocker with two CONFIRMED findings |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed, including property-based differential testing |
| 3 | **Sufficient?** | PASS | A comparator plus a surface list is the smallest thing that makes parity falsifiable |
| 4 | **Fits Goal?** | PASS | Directly discharges Blocker 1, which gates `014` |
| 5 | **Open Horizons?** | PASS | A seventh mode inherits the core by supplying a surface list and an oracle |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Six `*-shadow-parity/harness-adapter.ts` modules.
- A new comparator core module and six oracle modules under `runtime/lib`.
- Six `runtime/tests/unit/*-shadow-parity.vitest.ts` suites.

**How to roll back**: Each mode is an independent commit. Revert the failing mode's adapter and oracle commits and re-run that mode's suite; the other five stand.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Absorb the existing partial oracle instead of duplicating it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | Packet owner |

---

<!-- ANCHOR:adr-002-context -->
### Context

`F-006-02`'s verification notes that a partial independent oracle already exists: `assertLegacyProjectionMatchesCurrentState` checks four digests and throws rather than diffing. Writing six new oracles beside it would leave two definitions of the same idea, and the throwing form cannot report which surface diverged.

### Constraints

- Existing callers depend on the throwing behavior.
- The four digests it already checks are real coverage that must not be lost.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Fold `assertLegacyProjectionMatchesCurrentState` into the comparator core, converting throw-on-mismatch into a structured diff, and keep a thin throwing wrapper for existing callers.

**How it works**: The comparator returns a diff; the wrapper throws when the diff is non-empty, preserving current call sites. The four digests become entries in the shared surface list rather than a special case.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Absorb into the comparator, keep a throwing wrapper** | No duplicate definition; existing callers unchanged; diverged surface is reportable | Slightly more indirection at the call site | 9/10 |
| Leave it and write six new oracles beside it | No refactor risk | Two definitions of parity that drift; the four digests stay invisible to the surface list | 3/10 |
| Replace it outright and update all callers | Cleanest end state | Wider blast radius than this child needs; callers are outside its scope | 5/10 |

**Why this one**: Absorption preserves existing behavior at the call sites while making the four digests part of the one surface definition, which is exactly what the comparator needs.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- One definition of parity instead of two.
- A diverged surface can be named rather than only raised.

**What it costs**:
- One extra indirection layer for existing callers. Mitigation: the wrapper is a few lines and preserves the exact prior behavior.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A caller depended on the exact exception type or message | M | Wrapper preserves type and message; a test asserts the prior contract |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Otherwise two parity definitions coexist |
| 2 | **Beyond Local Maxima?** | PASS | Three options weighed |
| 3 | **Sufficient?** | PASS | A wrapper is the minimum to preserve callers |
| 4 | **Fits Goal?** | PASS | Keeps the comparator single-sourced |
| 5 | **Open Horizons?** | PASS | Callers can migrate to the diff form later without another refactor |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- The module exporting `assertLegacyProjectionMatchesCurrentState`.
- The new comparator core.

**How to roll back**: Restore the original function body and remove the wrapper; the comparator can keep its own surface list independently.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
