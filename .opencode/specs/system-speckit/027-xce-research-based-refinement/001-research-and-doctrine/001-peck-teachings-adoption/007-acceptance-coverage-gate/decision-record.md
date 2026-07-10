---
title: "Decision Record: 011 — Acceptance-Criteria Coverage Gate"
description: "Architectural decisions for the revived T1 acceptance-criteria coverage gate: AC-format normalization as a hard prerequisite, the canonical per-level AC location, the per-level AND lifecycle opt-in, and the shared-manifest-template sequencing dependency."
trigger_phrases:
  - "027 phase 011"
  - "acceptance coverage gate"
  - "AC_COVERAGE rule"
  - "AC-format normalization"
  - "AC coverage decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/007-acceptance-coverage-gate"
    last_updated_at: "2026-06-10T07:17:10Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Accepted source-pass AC coverage decisions"
    next_safe_action: "Plan validator v3 dispatch wiring if approved"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-011-acceptance-coverage-gate-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Final SPECKIT_AC_COVERAGE_FLOOR default (proposed 0.9)"
      - "Whether L3 counts story-ACs only or both tables (recommend story-ACs only)"
    answered_questions:
      - "AC-format normalization is a HARD prerequisite, not optional (cross-model verified)"
---
# Decision Record: 011 — Acceptance-Criteria Coverage Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

## ADR-002: Canonical per-level AC location (L3 counts story-ACs only)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | Operator, claude-opus-4-8 (scaffold), MiniMax M3 (cross-model verify) |

### Context

A Level 3 spec carries acceptance criteria in two places: the `Requirement | Acceptance Criteria` table and the Given/When/Then story acceptance criteria under user stories. If the `AC_COVERAGE` rule counts both, it double-counts the same intent; if it counts neither cleanly, it misses. The cross-model verification (research 006 §5, MiniMax M3) flagged this as a real classification hazard. We needed to pick exactly one canonical location per level so counting logic and template authoring agree.

### Constraints

- Level 1 and Level 2 carry acceptance criteria primarily in the requirement table; Level 3 adds story-level Given/When/Then ACs.
- The rule must produce one stable total per folder; a moving denominator makes the floor meaningless.

### Decision

**We chose**: Count exactly one canonical AC location per level - at Level 3, count the Given/When/Then story acceptance criteria only, not the requirement-table rows.

**How it works**: The `ac-coverage.*` rule selects the story-AC section at L3 as the denominator and ignores the requirement-table rows for counting. At L1/L2, where there are no separate story ACs, it counts the (now assertion-shaped) requirement-table criteria.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Story-ACs only at L3 (chosen)** | One stable denominator; story ACs are already assertion-shaped Given/When/Then | Requirement-table criteria are not directly counted at L3 | 8/10 |
| Count both tables, dedupe | Captures every stated criterion | Dedupe is heuristic and fragile; high double-count/miss risk | 4/10 |
| Count requirement table only at all levels | Uniform across levels | Ignores the richer story ACs that L3 authors actually verify | 5/10 |

**Why this one**: Story ACs at L3 are already in assertion shape and map most directly to tests, giving the rule a clean, classifiable denominator without dedupe heuristics.

### Consequences

**What improves**:
- The denominator is stable and unambiguous per level, so the floor is meaningful.
- Counting logic and template authoring agree on one location.

**What it costs**:
- At L3, requirement-table criteria are not separately counted. Mitigation: AC-format normalization (ADR-001) keeps the requirement table assertion-shaped so it still feeds story-AC authoring.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| L3 authors put unique criteria only in the requirement table | M | Template guidance directs verifiable criteria into story ACs; AC-stub generation seeds story rows from the requirement table |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without one canonical location the rule double-counts or misses (research 006 §5). |
| 2 | **Beyond Local Maxima?** | PASS | Both-tables and requirement-only alternatives were evaluated and scored. |
| 3 | **Sufficient?** | PASS | One location per level is the minimum that makes the floor well-defined. |
| 4 | **Fits Goal?** | PASS | Directly enables reliable coverage counting, the packet's purpose. |
| 5 | **Open Horizons?** | PASS | A future merged-table model remains a deliberate follow-on if wanted. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- `ac-coverage.*` selects story-ACs as the L3 denominator (REQ-007).
- `spec.md.tmpl` guidance points verifiable criteria into the story-AC section.

**How to roll back**: If story-only counting under-counts in practice, switch the L3 denominator selection to the requirement table and add a regression fixture; the change is localized to the rule's location selector.

---

## ADR-003: Per-level AND lifecycle opt-in (not level alone)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | Operator, claude-opus-4-8 (scaffold), MiniMax M3 (cross-model verify) |

### Context

A coverage gate keyed on level alone would fire on a freshly scaffolded Level 2 spec that has zero tests by design, producing an ERROR (or noisy WARN) at scaffold time. The cross-model verification (research 006 §5) recommended a lifecycle opt-in: enforce only once the folder is actually being implemented. We needed an enforcement predicate that protects fresh scaffolds while still catching under-covered in-flight work.

### Constraints

- Level 1 is exempt entirely (the framework does not require a checklist at L1).
- A fresh scaffold must pass strict validation with no coverage ERROR.

### Decision

**We chose**: Enforce coverage only for Level 2 and above, and only once `checklist.md` exists AND `implementation-summary.md` is in-progress or later; Level 1 is exempt.

**How it works**: The rule reads the level marker and the `implementation-summary.md` status; if level is 1, or the lifecycle predicate is unmet, the rule is a no-op for that folder.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per-level AND lifecycle (chosen)** | Fresh scaffolds never blocked; in-flight work still gated | Two conditions to evaluate | 9/10 |
| Level alone (L2+) | Simple | Blocks fresh L2 scaffolds with zero tests | 3/10 |
| Always on | Maximal coverage pressure | Blocks scaffolding; high false-ERROR volume | 2/10 |

**Why this one**: It is the only option that satisfies the hard requirement that a fresh scaffold passes strict validation while still gating real in-flight work.

### Consequences

**What improves**:
- Scaffolding is never blocked by coverage; the gate engages exactly when tests are expected.

**What it costs**:
- The rule depends on an accurate `implementation-summary.md` status. Mitigation: the status field is already part of the continuity contract and is validated elsewhere.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A folder stays "Spec-Scaffolded" long after implementation starts, evading the gate | M | Other completion-gate signals (009 freshness) catch stale status; coverage is one signal among several |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Level-alone enforcement breaks fresh scaffolds (SC-006). |
| 2 | **Beyond Local Maxima?** | PASS | Level-alone and always-on were evaluated. |
| 3 | **Sufficient?** | PASS | The two-condition predicate covers the scaffold-vs-in-flight boundary. |
| 4 | **Fits Goal?** | PASS | Enables enforcement without breaking in-flight folders, the stated purpose. |
| 5 | **Open Horizons?** | PASS | The predicate can tighten later without changing the rule's shape. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- `ac-coverage.*` evaluates level + lifecycle before counting (REQ-005, NFR-C02).
- `deep-review/SKILL.md` and the two YAMLs reflect the same opt-in.

**How to roll back**: Loosen or tighten the lifecycle predicate in one place (the rule's gating check); the deep-review binding reads the same signal.

---

## ADR-004: Sequence after pending 001/002 for the shared manifest templates

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | Operator, claude-opus-4-8 (scaffold), MiniMax M3 (cross-model verify, MUST-FIX D6) |

### Context

Phases 1-2 edit `spec.md.tmpl` and `checklist.md.tmpl`. The pending `001/002-self-check-templates` packet (T3) edits the SAME manifest templates. The cross-model review (research 006 §5, MUST-FIX D6) required making this coordination explicit so the two efforts do not edit the same files in parallel and cause merge conflicts or silent drift. We needed an explicit sequencing rule.

### Constraints

- Both efforts target the same two template files.
- Parallel edits to manifest templates risk conflicts and drift across every future scaffold.

### Decision

**We chose**: Land pending `001/002-self-check-templates` first, OR coordinate a single shared edit window; do not edit `spec.md.tmpl` / `checklist.md.tmpl` concurrently with 002.

**How it works**: Phase 1 is blocked (task T001 marked `[B]`) until 002 has landed or a coordinated edit window is explicitly opened; the Definition of Ready carries this precondition.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Sequence after / coordinate window (chosen)** | No conflicting concurrent edits; clean template history | 011 phases 1-2 wait on 002 | 9/10 |
| Edit in parallel | No waiting | High merge-conflict and drift risk on shared templates | 2/10 |
| Fork the templates | Independent progress | Two divergent template sources; defeats the single-source goal | 1/10 |

**Why this one**: It is the only option that preserves a single, conflict-free manifest-template source, which every future scaffold depends on.

### Consequences

**What improves**:
- The shared templates have one clean edit history; no concurrent-edit conflicts.

**What it costs**:
- 011 phases 1-2 are gated on 002. Mitigation: phases 3-4 (rule, registry, deep-review) do not touch the shared templates and can be designed in parallel.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| 002 slips and blocks 011 indefinitely | M | A coordinated single edit window is an explicit alternative to waiting for 002 to fully land |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Both efforts edit the same templates (research 006 §7 MUST-FIX). |
| 2 | **Beyond Local Maxima?** | PASS | Parallel-edit and fork alternatives were evaluated. |
| 3 | **Sufficient?** | PASS | Sequencing or a coordinated window removes the conflict entirely. |
| 4 | **Fits Goal?** | PASS | Protects the shared-template surface the packet must edit. |
| 5 | **Open Horizons?** | PASS | Leaves room to coordinate rather than strictly serialize. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- Task T001 is blocked on the 002 window; the Definition of Ready records the precondition.

**How to roll back**: If the window cannot be coordinated, defer phases 1-2 and ship phases 3-4 design only, then revisit once 002 lands.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: AC-format normalization is a hard prerequisite

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-06 |
| **Deciders** | Operator, claude-opus-4-8 (scaffold), MiniMax M3 (cross-model verify) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The `AC_COVERAGE` rule must classify each acceptance criterion as Tested, Partially, Manual, or Not-covered. Today the acceptance-criteria text in `spec.md.tmpl` is placeholder prose ("[How to verify it's done]", `spec.md.tmpl:91,97,445-453`). The cross-model verification (research 006 §5, MiniMax M3) confirmed the rule can COUNT coverage on placeholder text but cannot CLASSIFY it. We needed to decide whether AC-format normalization is an optional companion or a hard prerequisite for the rule.

### Constraints

- Classification requires assertion-shaped ACs (`precondition + action -> outcome`), which placeholder prose does not provide.
- The rule and the normalization both edit or depend on `spec.md.tmpl`, which is also owned by pending 002 (see ADR-004).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Treat AC-format normalization (Phase 1) as a HARD prerequisite that must land before the `AC_COVERAGE` rule (Phase 3), not as an optional nicety.

**How it works**: Phase 1 rewrites the L1/L2 placeholder ACs into mechanical assertions and tightens the L3 requirement tables; the rule is only authored and shipped against assertion-shaped ACs, so classification is well-defined.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Normalization as hard prerequisite (chosen)** | Classification is well-defined; the rule is meaningful | Phase 1 gates the rule and is itself gated by the 002 window | 9/10 |
| Ship the rule first, normalize later | Faster to a visible rule | The rule can only count, not classify; produces misleading coverage on placeholder text | 2/10 |
| Count-only rule, never classify | Simplest rule | Loses the Tested/Partially/Not-covered signal that is the point of T1 | 3/10 |

**Why this one**: Classification is the core value of the coverage gate, and it is impossible on placeholder AC text, so normalization must precede the rule.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The rule produces a real classification (Tested / Partially / Manual / Not-covered), not just a raw count.
- Authors get assertion-shaped AC templates that map directly to tests.

**What it costs**:
- Phase 3 is gated on Phase 1, and Phase 1 is gated on the pending-002 template window. Mitigation: the rule's counting/floor logic can be designed in parallel while the template edits wait.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The rule ships before normalization and WARNs on placeholder text | H | Phase ordering is enforced (ADR-001); task T008 depends on T002-T004 |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Classification is impossible on today's placeholder AC text (research 006 §5). |
| 2 | **Beyond Local Maxima?** | PASS | Ship-first and count-only alternatives were evaluated and scored. |
| 3 | **Sufficient?** | PASS | Normalization is the minimum that makes classification well-defined. |
| 4 | **Fits Goal?** | PASS | Classification is the core deliverable of the revived T1 gate. |
| 5 | **Open Horizons?** | PASS | Assertion-shaped ACs also benefit AC-stub generation and future tooling. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `spec.md.tmpl` L1/L2 ACs become `precondition + action -> outcome` assertions; L3 requirement tables are tightened (REQ-001).
- The `ac-coverage.*` rule depends on assertion-shaped ACs and is authored after normalization (REQ-003, ordering in plan.md §4).

**How to roll back**: If normalization breaks template rendering, revert the `spec.md.tmpl` edits and hold the rule; the rule must not ship against placeholder text.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3 Decision Record: ADR-001 (AC-format prerequisite) carries the canonical anchored block.
ADR-002 (canonical per-level location), ADR-003 (lifecycle opt-in), and ADR-004 (shared-template sequencing)
are recorded above as prose ADRs. All four are cross-model-verified constraints from research 006 §3 + §5.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
</content>
