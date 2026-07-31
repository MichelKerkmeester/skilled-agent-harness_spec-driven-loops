---
title: "Decision Record: authoring the operator scenarios the coverage map proves are owed"
description: "Two proposed decisions carrying evidence: treating the derived uncovered-inventory report as both the worklist and the gate, and re-testing every absence claim across all 11 playbooks before authoring against it."
trigger_phrases:
  - "derived worklist decision"
  - "cross-playbook absence claim decision"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/024-playbook-scenario-coverage/003-uncovered-workflow-authoring"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Promoted the two inline plan.md ADRs into the decision record"
    next_safe_action: "Operator accepts or rejects ADR-001 and ADR-002"
    blockers: []
    key_files:
      - "decision-record.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Authoring the Operator Scenarios the Coverage Map Proves Are Owed

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

Both decisions below are **Proposed**. Neither may be marked Accepted by the executing agent — that is the operator's signature.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The derived map is the worklist and the gate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

Coverage in this fleet has always been argued from prose, and it drifted in every hub counted so far. A finding list is a snapshot of one research loop; the live registries are the current truth, and they move independently of that snapshot.

### Constraints

- The inventory must be re-derived at phase start, not reused from the research loop's snapshot.
- Closure must be measured by the report shrinking to empty, never by an author's assertion that coverage is complete.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: the uncovered inventory, re-derived from live registries (`mode-registry.json`, `command-metadata.json`, public MCP tool schemas, registered hooks/adapters) at phase start, is the worklist. The 13 findings seed it but do not define it.

**How it works**: the phase builds the derived inventory first, joins it against indexed scenario IDs to emit the uncovered set, and authors only against items still present in that set — never directly against the finding list.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Derive the map, author against it (chosen)** | Coverage claim is falsifiable and self-correcting as registries change | Slower start; the derivation itself must be built and proven reproducible | 8/10 |
| Author straight from the 13 findings | Faster to start | Reinstates the prose-driven coverage claim this whole program exists to remove | 3/10 |

**Why this one**: a derived map is the only version of "complete" that survives the next registry change without drifting.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Coverage closure becomes a measurable report shrinking to empty, not an assertion.
- Findings that do not survive re-derivation are re-examined rather than authored on faith, catching drift the original research loop could not see.

**What it costs**:
- Extra up-front work to build and prove the derivation reproducible before any scenario is authored. Mitigation: the reproducibility test (two consecutive runs on an unchanged tree diff clean) is itself a phase task (REQ-023), not deferred.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Derivation misses a registry source and under-reports coverage gaps | M | Weaker-signal derivation for hubs without `mode-registry.json` is labeled as weaker in the report, not hidden |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Coverage has drifted in every hub counted so far when argued from prose instead of derived from registries |
| 2 | **Beyond Local Maxima?** | PASS | Authoring straight from the 13 findings was considered and rejected with a stated reason |
| 3 | **Sufficient?** | PASS | One derivation join against existing registries, no new registry format introduced |
| 4 | **Fits Goal?** | PASS | Directly the phase's stated worklist mechanism, gating every authoring lane |
| 5 | **Open Horizons?** | PASS | A derived map stays correct as registries change, unlike a fixed finding list |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- A per-hub expected-inventory builder joins `mode-registry.json`, `command-metadata.json`, public MCP tool schemas, and registered hooks/adapters against indexed scenario IDs.
- The uncovered-inventory report becomes the authoring worklist for Lanes A through D.

**How to roll back**: discard the derivation script and revert to authoring directly against the 13 findings; no scenario content already authored against the derived map needs to change, since each scenario is independently valid regardless of how it was selected.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Absence is a cross-playbook claim, not a hub-scoped one

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | Operator |

### Context

A research finding asserting "no coverage anywhere" was refuted during the loop precisely because the coverage lived under a different hub's playbook. A hub-scoped absence search misses coverage that already exists elsewhere in the fleet.

### Decision

**We chose**: every absence claim is re-tested across all 11 playbooks before a scenario is authored against it, and the search itself is recorded.

### Alternatives Considered

- Trusting the owning hub's own index: rejected — it is exactly the assumption that produced the already-refuted finding.

### Consequences

- Slightly more search work per candidate item, which is the difference between authoring a genuinely needed scenario and shipping a duplicate that already exists under a sibling hub.
<!-- /ANCHOR:adr-002 -->
