---
title: "Decision Record: typed-spine rollout labeling and orphan classification"
description: "How the deep-loop typed-spine modules get a rollout label without this packet guessing, and how the 94 system-spec-kit orphan leaves get classified without bulk-linking."
trigger_phrases:
  - "typed spine rollout label"
  - "dark shadow-only catalog labeling"
  - "orphan leaf classification"
  - "deep loop rollout adjudication"
importance_tier: "high"
contextType: "planning"
parent: "sk-doc/023-feature-catalog-integrity/003-large-surface-catalog-reconciliation"
_memory:
  continuity:
    packet_pointer: "sk-doc/023-feature-catalog-integrity/003-large-surface-catalog-reconciliation"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the labeling and classification decision as proposed"
    next_safe_action: "Build the evidence table in T002 and dispatch it in T003"
    blockers:
      - "Q5 adjudication is owned by the 036 program; status stays Proposed until it returns"
    key_files: []
    completion_pct: 0
    open_questions:
      - "Q5 who adjudicates typed-spine rollout state"
    answered_questions: []
---
# Decision Record: Typed-Spine Rollout Labeling and Orphan Classification

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Adjudicate Rollout State Externally, Classify Orphans Individually

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | The 036 program owner for rollout state; the operator for orphan classification policy |

---

<!-- ANCHOR:adr-001-context -->
### Context

The deep-loop runtime catalog claims a complete 50-entry inventory while `runtime/lib/` holds whole undocumented
domains: the authorized ledger, event envelopes, conditional fan-in, mode contracts, receipts and effect recovery,
path-coverage termination, shadow parity, rollback drills, and per-mode typed implementations with their own unit
tests. The standard requires unshipped behavior to be explicitly labeled and to carry empty or stub source tables, so
the fix is not "document the modules" but "determine, per module, whether it is active, shadow-only,
dark-but-implemented, or planned, and label it accordingly".

That determination is a judgment about the runtime, not about the catalog. A module can have full unit tests and no
wiring. A module can be wired behind a default-off flag. A documentation packet reading the source cannot reliably tell
"implemented and dormant" from "implemented and live" without knowing the program's intent, and getting it wrong makes
the catalog assert that unshipped runtime behavior ships. That is the one genuinely risky error available in this
track.

Separately, `system-spec-kit` holds 94 of the repo's 104 orphan leaves. Turning bijection on there requires knowing
which orphans are features owed a root entry and which are category overviews or retirement records that are correctly
excluded. Bulk-linking all 94 would turn the checker green and corrupt the inventory.

### Constraints

- The standard is explicit that a feature not yet implemented must say so clearly and leave SOURCE FILES tables empty
  or stub-only. Labeling is therefore mandatory, not optional, once a module appears in the catalog.
- `001` owns the feature-leaf definition. This phase applies it; it does not invent one.
- `036/032` is editing deep-loop documentation in the same window on different files but the same facts.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: produce evidence, request adjudication, and label only from the adjudicated result. Classify orphans one
at a time with a recorded reason.

**How it works**:

1. Lane B opens by building a per-module rollout-state table: module path, unit tests present, wiring path if any,
   default-on or default-off, proposed label, and the evidence for the proposal. That table is the lane's first
   artifact, produced before any catalog prose is written.
2. The table goes to the 036 program owner for adjudication. **OPERATOR-DECISION (Q5).** This phase does not decide.
3. Catalog labels come from the adjudicated table only. A module returned as unknown is labeled unresolved and carries
   a stub SOURCE FILES table. Shipped is never the default.
4. Each of the 94 orphans is classified individually as a feature, a category overview, or a retirement record, under
   `001`'s feature-leaf definition, and the classification and its reason are recorded in a committed ledger.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Evidence table plus external adjudication** | The riskiest claim in the track is made by the party who knows the answer; the table is reusable evidence | Introduces a hard external dependency that can stall the lane | 9/10 |
| Label from source reading alone | No external dependency, faster | Cannot distinguish implemented-and-dormant from implemented-and-live; the failure mode is a false shipped claim | 3/10 |
| Omit the typed spine entirely, as today | No wrong labels | The catalog keeps claiming a complete inventory it does not have; the finding stays open | 2/10 |
| Bulk-link all 94 orphans | Bijection turns green immediately | Satisfies the checker and corrupts the inventory; a category overview is not a feature | 2/10 |
| Defer the orphans to a later packet | Smaller phase | Leaves `system-spec-kit` unable to enter the gate at fail severity, which stalls `001`'s promotion ladder | 4/10 |

**Why this one**: the only reading-based alternative gets the safety-relevant question wrong by construction, and the
only cheap orphan alternative trades a correct inventory for a green check.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A reader can tell which typed-spine modules ship, and the claim is traceable to whoever is entitled to make it.
- The 94 orphans become a legible ledger of path, class and reason, which is reusable the next time the definition is
  questioned.
- `system-spec-kit` and the deep-loop catalogs can enter the gate at fail severity.

**What it costs**:
- Lane B's typed-spine writing stalls until the adjudication returns. Mitigation: the rest of Lane B is independent and
  runs beside it, and the table is dispatched in Phase 1.
- Individual classification of 94 leaves is slower than bulk-linking. Mitigation: it is the only option that leaves the
  inventory correct.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The adjudication never returns | M | The evidence table itself is a deliverable; the lane closes with the typed-spine item explicitly deferred rather than guessed |
| An adjudicated label is wrong | H | A reviewer spot-checks five labels against actual command and YAML wiring, independently of the table |
| A classification mis-labels a real feature as an overview | M | Each reason is recorded, so the ledger can be re-reviewed without redoing the analysis |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The runtime catalog claims a complete 50-entry inventory while whole typed domains are undocumented |
| 2 | **Beyond Local Maxima?** | PASS | Five alternatives weighed, including the two cheap ones |
| 3 | **Sufficient?** | PASS | Evidence plus adjudication is the minimum that produces a correct label; nothing broader is decided |
| 4 | **Fits Goal?** | PASS | This is the track's only safety-relevant claim, and the decomposition's only hard external dependency |
| 5 | **Open Horizons?** | PASS | The evidence table and the orphan ledger both remain useful after this phase closes |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `system-deep-loop/runtime/feature-catalog/**`: per-module entries with adjudicated rollout labels and, for dark or
  shadow-only modules, empty or stub SOURCE FILES tables.
- `system-spec-kit/feature-catalog/**`: 94 orphans linked or classified, with a committed classification ledger.
- A tool-reconciliation generator in `.opencode/skills/sk-doc/shared/scripts/`.

**How to roll back**: revert the labeling commit; the evidence table and the orphan ledger stay, because they are
evidence rather than claims. If a single label is wrong, correct the label and its SOURCE FILES table in the same edit,
since a shipped label with a stub table and a dark label with a populated table are both violations of the standard.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
