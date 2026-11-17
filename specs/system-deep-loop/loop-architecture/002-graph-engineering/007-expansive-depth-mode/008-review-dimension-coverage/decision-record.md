---
title: "Decision Record: Support custom review dimensions end to end (D10)"
description: "The operator decision for Slice H, accepted 2026-11-17: support custom review dimensions in buildDimensionCoverage, so every configured dimension is tracked and can be covered."
trigger_phrases:
  - "review dimension coverage decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage"
    last_updated_at: "2026-11-17T18:00:00Z"
    last_updated_by: "operator-decision"
    recent_action: "Recorded the operator decision: support custom dimensions"
    next_safe_action: "Capture the REQ-004 baseline (T002)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-review-dimension-coverage"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Enforce the four-name rule in code, or support custom review dimensions? Support, decided by the operator on 2026-11-17."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Support custom review dimensions end to end (D10)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Enforce the four canonical review dimensions, or support custom ones

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted. Support custom dimensions. |
| **Date** | 2026-11-17 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

`buildDimensionCoverage` (`runtime/scripts/reduce-state.cjs:1223-1250`) only knows the four `REQUIRED_DIMENSIONS`, while `convergence.cjs:1541-1556` counts every configured dimension as missing until covered. A non-canonical entry therefore disables `all_dimensions_clean` and, with it, the review pivot (`divergent-review-pivot.ts:338-340`). The only guard is the prose line at `deep-review.yaml:654`, which the orchestrating model executes, so a non-compliant orchestrator or a hand edit can produce the input. Parent `research.md` §12 item 7 asks the operator to choose.

### Constraints

- Contract-compliant runs, the only ones the workflow allows, must not change.
- Eight sites in the review reducer iterate the fixed list (`deriveDimension` :1215, `buildDimensionCoverage` :1225 and :1246, and the consumers :2173, :2178, :2185, :2272, :2301), so support touches all of them.
- The four names are also hard-coded outside the reducer: the workflow input, risk order, normalize rule, registry seed and dimension table in `deep-review.yaml`, the agent definition, the review prompt pack, the setup presentation and `review-mode-contract.yaml`. Support that stops at the reducer leaves a custom name with no way in, no order and no rubric.
- Slice K (`../011-review-frontier-mode/`) depends on this slice, because the operator chose support.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Support custom dimensions in `buildDimensionCoverage`. Every configured dimension is tracked and can be covered.

**How it works**: One dimension universe, the four canonical names in risk order followed by each configured custom name, feeds the coverage map, every reducer consumer, the workflow input and order, the prompt pack, the agent rubric and the mode contract. The workflow rule at `deep-review.yaml:654` is relaxed to allow configured custom names. The universe rules (normalization, order, rubric) are in `plan.md` §3. Because the universe always starts with the four, runs whose configured names are all canonical keep identical registries.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Enforce in code | Smallest change; turns a silent unreachable stop into a loud, early error; no new feature surface | Custom review axes stay impossible; Slice K must work within the four names | 8/10 |
| **Support custom dimensions (chosen)** | Lets a review run use its own axes, which a review frontier could later use as sub-targets | A feature, not a fix; touches five reducer sites and the workflow contract; makes Slice K depend on this slice | 6/10 |
| Filter unknown names with a warning | No run fails | Silently narrows the review the operator asked for | 3/10 |

**Why this one**: The operator asked for the best UX and logic, even if it takes more time. Support makes a configured dimension mean what it says: it is tracked, it can be covered, and the clean stop and the review pivot stay reachable. The planner scores above predate the decision and are kept as the offered record.

**Rejected**: Enforcing only the four built-in names in code.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- No review run loses its clean stop and its pivot to a configured dimension the reducer cannot track.
- The workflow line at `deep-review.yaml:654` and the code agree.

**What it costs**:
- More surface to keep in step than the offered option named: eight reducer sites plus the workflow input, order, normalize step, registry seed and dimension table, the agent and its five mirrors, the prompt pack, the setup presentation, the mode contract and its snapshot, the reference docs and the review compiled contract (`spec.md` §3). Mitigation: a stop-path fixture with a custom dimension, a byte-identity pack golden, and the contract-drift and mirror checks.
- Slice K now waits on this slice.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The change misses one of the eight reducer sites or one non-reducer surface | M | Grep `REQUIRED_DIMENSIONS` after the change; the stop-path fixture fails on a miss |
| A config written in another casing by a fan-out or optimizer path splits one dimension into two keys | L | Normalize case on the configured list, as `buildDimensionCoverage` already lowercases |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A prose-only rule guards a stop-disabling input (parent §13 D10) |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared, including filter-and-warn |
| 3 | **Sufficient?** | PASS | The universe reaches every reader of the list: the eight reducer sites, the workflow, the agent, the prompt pack, the presentation and the mode contract (`spec.md` §3) |
| 4 | **Fits Goal?** | PASS | Hardens the review loop the frontier builds on, and gives it configurable axes |
| 5 | **Open Horizons?** | PASS | Custom axes can later serve as review frontier sub-targets |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `runtime/scripts/reduce-state.cjs` (universe builder, `deriveDimension`, coverage builder and five consumers), `deep-review.yaml` (input, order, normalize, seed, dimension table, pack variable), the review prompt pack, the agent definition and its mirrors, the setup presentation, `review-mode-contract.yaml` and its snapshot, the reference docs and the review compiled contract. The full list is `spec.md` §3. `../011-review-frontier-mode/` records this slice as a binding dependency.

**How to roll back**: Revert the slice's commit and regenerate the review compiled contract. The change does not alter a stored format older code cannot read.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| OD-001 | 2026-11-17: support custom dimensions in `buildDimensionCoverage` | Best UX and logic, even if it takes more time: every configured dimension is tracked and can be covered | ADR-001 Proposed status | `plan.md`, `tasks.md` T003-T018; `../011-review-frontier-mode/` dependency |
| OD-002 | 2026-11-17 (night, autonomous): the registry seed keeps the four literal canonical keys and appends custom keys through `{dimension_coverage_custom_seed}` | `system-spec-kit` `deep-review-contract-parity` pins the literal `"<dim>":false` keys, and a default run stays byte-identical | A whole-object seed placeholder | `deep-review.yaml` `step_create_findings_registry`; rollback: restore the seed line and drop the output |
| OD-003 | 2026-11-17 (night, autonomous): the mode contract states the custom rule as a `customDimensionRule` key, not a fifth `dimensions` entry | Consumers that loop over `dimensions` keep seeing the canonical four | A `<custom>` list entry | `review-mode-contract.yaml`; rollback: delete the key |
| Q001 | Support custom review dimensions in buildDimensionCoverage instead of enforcing only the four built-ins. | Operator asked for the best UX and logic even if it takes more time; 011-review-frontier-mode now depends on 008. | None | 008-review-dimension-coverage/decision-record.md ADR-001, 011-review-frontier-mode/spec.md |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

**OD-001** (2026-11-17)

- Asked: enforce the four canonical review dimension names in code, or support custom dimensions?
- Offered: enforce in code; support custom dimensions; filter unknown names with a warning.
- Operator answer: "the best UX and logic, even if it takes more time". Recorded choice: support custom dimensions.

### Q001
<!-- source: claude:94a4cf06-5c71-4a49-952f-6bbffe1f9b56:toolu_01AqJKf7Vpa3evWkpgH9i7hX:1 -->

Question:
```text
Phase 008 (D10): a review dimension outside the four built-ins (correctness, security, traceability, maintainability) can never be marked covered. Which fix?
```

Options:
```text
Enforce the four (Recommended)
Support custom ones
```

Answer:
```text
we want best uxc and logic, even if it takes more time
```

<!-- /ANCHOR:operator-answers-verbatim -->

---
