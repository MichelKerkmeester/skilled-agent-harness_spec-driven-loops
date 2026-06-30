---
title: "Decision Record: designer-skills-main → sk-design improvement research"
description: "Binding decisions: hold sk-design's build/visual scope as the adoption filter and adopt no new mode (ADR-001); execute as 9 sequential iterations then an operator-directed 4-agent parallel wave with race-free per-agent outputs and a serial merge (ADR-002)."
trigger_phrases:
  - "designer-skills-main research decisions"
  - "sk-design scope decisions designer-skills"
  - "no new mode verdict decisions"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/024-designer-skills-research"
    last_updated_at: "2026-06-27T11:12:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the binding research decisions as ADRs"
    next_safe_action: "A future build phase adopts backlog ranks 1-5 into existing sk-design modes"
    blockers: []
    key_files:
      - "spec.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dr-154-024-designer-skills-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: designer-skills-main → sk-design improvement research

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Hold the build/visual scope filter and adopt no new mode

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Deciders** | Operator + orchestrator (research phase) |

---

<!-- ANCHOR:adr-001-context -->
### Context

`designer-skills-main` is a 9-plugin suite (~96 skills) covering the whole design lifecycle. Its breadth invites scope creep: absorbing research, strategy, ops, and governance would bloat a focused five-mode build/visual skill and dilute its taste.

### Constraints

- sk-design is a five-mode hub (interface, foundations, motion, audit, md-generator); the hub holds no per-mode logic.
- A new mode requires an explicit `mode-registry.json` extension with a new packet, not hub logic.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: hold sk-design's build/visual scope as the adoption filter — adopt only concrete observable UI/visual checks, record all lifecycle capabilities (research/strategy/ops/governance) as out-of-scope, and add no new mode.

**How it works**: each plugin is classified in-scope or out-of-scope; adoptable items map into the existing five modes; visual-critique becomes an audit *crosswalk*, not a second score; md-generator receives nothing.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scope-filtered adoption, no new mode (chosen)** | Keeps sk-design focused; adopts real craft | Requires per-plugin adjudication | 9/10 |
| Absorb the suite (add research/strategy/ops modes) | "Complete" design platform | Massive scope creep; dilutes taste; off-mission | 2/10 |
| Add a new critique mode for visual-critique | Tidy home for 7 dimensions | Duplicates audit ownership; unjustified routing/output split | 3/10 |

**Why this one**: the adoptable value is build/visual craft that fits the existing modes; the rest is a different product.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A small, high-signal backlog of build-facing craft (audit crosswalk, flow floors, hardening, state-machine, layout).
- A clear out-of-scope ledger that protects sk-design from lifecycle bloat.

**What it costs**:
- Per-plugin adjudication effort. Mitigation: the research records the ledger and rationale once for reuse.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breadth read as a mandate to expand sk-design | H | Explicit out-of-scope ledger + no-new-mode verdict |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without the filter, the suite's breadth would bloat sk-design |
| 2 | **Beyond Local Maxima?** | PASS | Weighed absorb-the-suite and new-critique-mode alternatives |
| 3 | **Sufficient?** | PASS | The five modes cover every adoptable item |
| 4 | **Fits Goal?** | PASS | Answers Q1-Q4 and the new-mode question |
| 5 | **Open Horizons?** | PASS | Leaves a clean build path; a new mode stays possible if future evidence warrants |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- This phase: research only — `research/research.md` records the scope-filtered backlog. No live sk-design change.
- Future build phase: applies backlog ranks 1-5 into existing mode packets.

**How to roll back**: delete the `024-designer-skills-research` packet; no live sk-design content was changed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Execute sequential then an operator-directed parallel wave with a serial merge

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Deciders** | Operator (requested parallelism) + orchestrator |

---

<!-- ANCHOR:adr-002-context -->
### Context

After 9 sequential iterations (newInfoRatio declining 0.78 -> 0.16) the operator asked for "more iterations at once." The corpus is plugin-partitioned, so the remaining distinct in-scope slices (visual-critique, design-systems, net-new extraction, scope/backlog) are independent and parallelizable.

### Constraints

- The deep-research runtime's `writeFirstRecordExecutor` does read-modify-write on the shared state log — unsafe for concurrent writers.
- Operator authorized parallel dispatch (the single-dispatch-discipline exception).
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: stop the sequential driver and run a 4-agent parallel wave, each agent writing ONLY its own iteration file + delta; then merge the four `type:iteration` records into the state log serially and run the reducer once.

**How it works**: each wave agent got a focused slice prompt and a hard instruction not to touch the shared state log or other agents' files, eliminating the read-modify-write race.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per-agent own-files + serial merge (chosen)** | True parallelism, no state race | Orchestrator merges records | 9/10 |
| Keep sequential to the 20 cap | Simple, accumulating | Slow (~45 more min); ignores the operator request | 5/10 |
| Parallel agents sharing the state log | Fewer merge steps | Read-modify-write corruption risk | 2/10 |

**Why this one**: it honors the parallel request while keeping the state log uncorrupted.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The remaining corpus was covered in ~5 min (4 concurrent) instead of ~45 min sequential.
- Each slice hit fresh material (ratios 0.56-0.68), so coverage stayed high-signal.

**What it costs**:
- A manual merge of 4 records + one reducer run. Mitigation: scripted, idempotent, verified (corruption 0).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Parallel agents lose cross-iteration accumulation | M | Slices are independent plugins; the iter-13 ledger consolidated 1-9 |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator requested parallelism; sequential was slow |
| 2 | **Beyond Local Maxima?** | PASS | Considered stay-sequential and shared-state-parallel |
| 3 | **Sufficient?** | PASS | 4 slices covered the remaining distinct in-scope corpus |
| 4 | **Fits Goal?** | PASS | Completed the research faster without state corruption |
| 5 | **Open Horizons?** | PASS | The merge is resumable and the trail stays inspectable |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Iterations 1-9 sequential via the loop driver; 10-13 via 4 concurrent codex dispatches.
- The four iteration records merged into the state log; reducer synced (13 iterations, corruption 0).

**How to roll back**: the wave outputs are plain iteration files + deltas; remove them and the merged records to revert to the 9-iteration state.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
