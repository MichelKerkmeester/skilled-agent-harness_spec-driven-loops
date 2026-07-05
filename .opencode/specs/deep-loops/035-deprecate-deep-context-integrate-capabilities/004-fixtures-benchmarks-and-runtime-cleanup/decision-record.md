---
title: "Decision Record: Fixtures Benchmarks Archive And Runtime Cleanup"
description: "Architecture decision for conditional runtime branch removal and fixture cleanup after standalone deep-context public and discoverability surfaces are closed."
trigger_phrases:
  - "deep-context runtime cleanup decision"
  - "conditional context branch removal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/035-deprecate-deep-context-integrate-capabilities/004-fixtures-benchmarks-and-runtime-cleanup"
    last_updated_at: "2026-07-04T18:32:06Z"
    last_updated_by: "opencode"
    recent_action: "Validated runtime cleanup compatibility decision"
    next_safe_action: "Recover Spec Memory daemon and reindex packet metadata"
    blockers:
      - "Spec Memory daemon indexing is unavailable: socket absent."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-phase-004-decision"
      parent_session_id: "2026-07-04-phase-004-contract-authoring"
    completion_pct: 100
    open_questions:
      - "Spec Memory reindex pending daemon recovery."
    answered_questions:
      - "Active context fan-out is rejected; historical context graph/query parsing remains with tests."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Fixtures Benchmarks Archive And Runtime Cleanup

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Conditional Runtime Removal

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-04 |
| **Deciders** | User, OpenCode assistant |

---

<!-- ANCHOR:adr-001-context -->
### Context

Runtime scripts, tests, fixtures, and benchmark docs still mention `context` as a deep-loop type. Some of those references may be active support for the standalone loop; others may be historical artifact parsing, generic graph metadata, or stale generated inputs. Removing all of them at once risks breaking shared runtime behavior.

Direct file checks also did not find the nested deep-context packet directory that compiler and docs references expect. This indicates stale source lists or already-missing packet files, not a safe deletion target.

### Constraints

- Phases 002 and 003 must pass first.
- Generated contracts should be regenerated from corrected source lists.
- Runtime changes require baseline and post-change tests.
- Historical artifact compatibility should be retained only if concrete tests or persisted artifacts justify it.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: remove active standalone context dispatch while retaining narrow historical context artifact compatibility.

**How it works**: phase 004 classifies every runtime/fixture/benchmark `context` hit, removes active standalone dependencies, and runs targeted tests. Active fan-out now rejects `context` before dispatch. Coverage graph, convergence, query, status, and upsert surfaces retain legacy `context` parsing only for historical artifacts covered by runtime tests.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Conditional removal with tests** | Safest path through shared runtime | Requires more inventory and test work | 9/10 |
| Delete all context branches | Fast and visually clean | High regression risk and historical artifact breakage | 3/10 |
| Keep all context support | Avoids runtime risk | Leaves hidden active support without a current product need | 4/10 |
| Only clean fixtures and leave runtime forever | Low short-term risk | Permanent drift between public behavior and runtime internals | 5/10 |

**Why this one**: it matches the staged deprecation goal and avoids both blind deletion and indefinite hidden support.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Runtime cleanup is backed by test evidence.
- Fixture and benchmark surfaces stop keeping standalone context current by accident.
- Any retained compatibility is explicit, narrow, and reviewable.

**What it costs**:
- Final cleanup may take longer than deleting files directly. Mitigation: use targeted inventories and tests.
- Some context strings may remain if they are compatibility or false-positive metadata. Mitigation: classify each retained hit with evidence.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Shared runtime regression | High | Run runtime unit/integration tests before and after changes. |
| Benchmark coverage loss | Medium | Replace context fixtures with supported-mode fixtures when needed. |
| Stale compiler source list | High | Update compiler source lists and regenerate outputs. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Runtime and fixture greps show remaining context support. |
| 2 | **Beyond Local Maxima?** | PASS | Considered delete-all, keep-all, and fixture-only cleanup. |
| 3 | **Sufficient?** | PASS | Covers compiler, runtime, fixtures, benchmarks, docs, and tests. |
| 4 | **Fits Goal?** | PASS | This closes the staged deprecation after public and discoverability cleanup. |
| 5 | **Open Horizons?** | PASS | Leaves a clear compatibility rule if historical artifacts require it. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Command contract compiler source lists.
- Runtime scripts/libs/tests that accept context as a loop type.
- Behavior benchmark docs and private skill benchmark fixtures.
- Runtime/workflow docs and generated metadata.

**How to roll back**: revert phase 004 runtime, fixture, compiler, and docs edits; regenerate command contracts; rerun the failed test subset; document retained compatibility if full removal proves unsafe.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
