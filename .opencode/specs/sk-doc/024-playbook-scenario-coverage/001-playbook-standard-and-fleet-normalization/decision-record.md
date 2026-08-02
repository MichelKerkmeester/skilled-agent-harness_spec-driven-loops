---
title: "Decision Record: playbook standard enforcement and fleet normalization"
description: "Two proposed decisions carrying evidence: where the new operator-contract validator lives relative to the existing routing-gold gate, and whether the gate is strict by default."
trigger_phrases:
  - "playbook validator ownership decision"
  - "strict by default decision"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/024-playbook-scenario-coverage/001-playbook-standard-and-fleet-normalization"
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
# Decision Record: Playbook Standard Enforcement and Fleet Normalization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

The operator's locked rulings settle the validator ownership, corpus boundary, strict-default behavior, and staged
rollout for this build leaf. Fleet scenario repair, topology-gate changes, and CI wiring remain outside this leaf.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The validator lives with the standard, not with the existing gate

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted by operator |
| **Date** | 2026-07-30 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The only playbook gate today is owned by the packet that defines the routing-gold contract, while the packet that defines the operator-scenario contract ships no scripts at all. That ownership inversion is why `sk-git` is scored 0-of-42 against a contract it was never written to.

### Constraints

- The new validator must enforce the operator-scenario standard, not the routing-gold contract the sibling gate already owns.
- Both validators must name their contract in their output so a reader can tell which one produced a given report.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: `validate-playbook-package.cjs` lives under `sk-create-manual-testing-playbook/scripts/`, beside the SKILL.md that defines what it enforces.

**How it works**: the standard's packet gains a `scripts/` directory and the ownership obligation that comes with it. Both validators keep walking the same trees, and the contract-naming requirement in each one's output is what keeps the two reports legible side by side.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **New validator beside the standard (chosen)** | Contract and enforcement live together; report is unambiguous about which contract it checked | New `scripts/` directory and ownership obligation | 8/10 |
| Extend the existing topology gate with operator-contract checks | No new script to own | Puts two contracts behind one exit code; deepens the exact confusion this phase exists to end | 3/10 |

**Why this one**: co-locating the validator with the standard it enforces is the only option that keeps a failing report traceable to a single contract.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The standard's packet gains a `scripts/` directory and an ownership obligation it did not have, closing the gap that let `sk-git` ship unscored.
- Two validators now walk the same trees, but the contract-naming requirement keeps their reports legible rather than conflated.

**What it costs**:
- A second validator to maintain alongside the sibling topology gate. Mitigation: both name their contract explicitly in `--help` and in every report line.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reader conflates the two validators' reports | M | Contract-naming requirement (REQ-002) enforced in `--help` output and every report line |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `sk-git` is scored 0-of-42 against a contract with no enforcing script anywhere in the repository |
| 2 | **Beyond Local Maxima?** | PASS | The alternative of extending the existing topology gate was considered and rejected with a stated reason |
| 3 | **Sufficient?** | PASS | One new `scripts/` directory beside the standard it enforces, no broader restructuring |
| 4 | **Fits Goal?** | PASS | Directly on the critical path to Milestone M2, "Gate exists and is fail-closed" |
| 5 | **Open Horizons?** | PASS | Contract-naming keeps both validators independently legible if either is extended later |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` is created, exit-code contracted (0 conforming / 1 violations / 2 usage or boundary), strict-by-default.
- Its `--help` output names both contracts and states which one it enforces.

**How to roll back**: delete the new `scripts/` directory and its CI wiring; the sibling topology gate is untouched and continues enforcing the routing-gold contract exactly as before.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Strict is the default

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted by operator |
| **Date** | 2026-07-30 |
| **Deciders** | Operator |

### Context

This repository already carries two fail-open validators. A gate that prints a failure and exits 0 is indistinguishable from no gate.

### Decision

**We chose**: strict on by default; `--no-strict` for local triage only, never in CI, asserted by the fixture suite.

### Alternatives Considered

- Matching the sibling gate's opt-in strictness for consistency: rejected — consistency with a known defect is not a reason to repeat it.

### Consequences

- The sibling topology gate remains unchanged in this leaf. Its existing fail-open posture and the later CI sequencing
  decision remain visible to the repair/normalization workstream.
<!-- /ANCHOR:adr-002 -->

<!-- ANCHOR:adr-003 -->
## ADR-003: Split the two corpora with per-file typed-gold classification

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted by operator |
| **Date** | 2026-08-02 |
| **Deciders** | Operator |

### Decision

The validator first honors repository-relative whole-tree roots in `playbook-corpus-manifest.json` as explicit overrides.
For every other scenario file, it reads frontmatter and excludes the file from operator auditing when
`expected_workflow_mode` is non-empty and `expected_leaf_resources` contains at least one typed pair. All other files
remain operator scenarios. No scenario frontmatter changes are required, and the existing topology gate and Lane-C
loader continue reading their current paths without consulting the manifest.

### Consequences

- Mixed roots follow the same typed-gold signature as the topology gate without manual sub-folder enumeration.
- Homogeneous routing-oracle hubs retain explicit whole-tree overrides as a belt-and-suspenders boundary.
- The manifest remains additive and validator-owned; it is not a second source of truth for routing-gold consumers.
<!-- /ANCHOR:adr-003 -->

<!-- ANCHOR:rollout -->
## Staged rollout: warn existing fleet, fail closed for new packages

Every package measured in the first fleet run is explicitly listed in the validator's warning set. Existing violations
produce a `WARN` package verdict and exit 0 while the repair workstream closes the backlog. A clean package or a new
playbook is absent from that set and fails closed on a contract violation. Promotion is removal from the warning set
after a clean validator run.
<!-- /ANCHOR:rollout -->
