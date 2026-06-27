---
title: "Decision Record: adopt the make-interfaces-feel-better backlog into sk-design"
description: "Binding build decisions: implement via cli-codex gpt-5.5 high fast with per-mode scope-locked dispatches and per-diff verification (ADR-001); land the craft as foundations rules paired with audit detectors while keeping the hub logic-free and the conflict decisions intact (ADR-002)."
trigger_phrases:
  - "mifb design adoption decisions"
  - "sk-design corpus adoption build decisions"
  - "design backlog build ADRs"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/023-mifb-design-adoption"
    last_updated_at: "2026-06-27T09:26:47Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the binding build decisions as ADRs"
    next_safe_action: "Commit the 023 build phase and the 12 sk-design edits"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-023-mifb-design-adoption"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: adopt the make-interfaces-feel-better backlog into sk-design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Implement via scope-locked per-mode cli-codex dispatches with per-diff verification

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Deciders** | Operator (named the executor) + orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The build edits live design-guidance docs across ~12 files in four modes plus shared and the hub. The operator asked to implement with `cli-codex gpt-5.5 high fast`. Editing production design guidance risks voice drift and scope creep if a model rewrites adjacent content.

### Constraints

- The executor is operator-named (`cli-codex gpt-5.5 high fast`), so it is plan-locked.
- Each edit must be additive and land at the anchor the 022 coverage map names.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: dispatch five focused, scope-locked codex runs (foundations, audit, motion, interface, md-gen+shared+hub), verifying each diff before the next.

**How it works**: each prompt names only its target files, the exact items, and a hard scope lock; the orchestrator reads every diff and reverts on any drift before continuing.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Per-mode scope-locked dispatches (chosen)** | Focused, verifiable, easy revert | More dispatches, sequential | 9/10 |
| One big dispatch for all 12 files | Fewer round-trips | Low precision, hard to verify/revert | 4/10 |
| Orchestrator hand-edits all files | Maximum control | Ignores the operator-named executor | 5/10 |

**Why this one**: it honors the named executor while keeping each change small, verifiable, and revertible.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Every change is attributable to a focused dispatch and reviewed before acceptance.
- Drift is caught per group, not after a large blended edit.

**What it costs**:
- Five sequential dispatches. Mitigation: each is fast (gpt-5.5 high fast) and runs in the background.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A dispatch edits outside scope | M | Per-diff review + `git checkout -- <file>` revert before re-dispatch |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator named the executor; the edits had to be applied |
| 2 | **Beyond Local Maxima?** | PASS | Weighed one-big-dispatch and hand-edit alternatives |
| 3 | **Sufficient?** | PASS | Scope-lock + per-diff review is the minimal safe control |
| 4 | **Fits Goal?** | PASS | Applies the 022 backlog precisely |
| 5 | **Open Horizons?** | PASS | Clean per-file revert keeps the change reversible |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- 12 sk-design files edited additively across five dispatches.
- The hub doc-fix is a precise 3-line citation swap.

**How to roll back**: `git checkout -- <file>` per file, or discard all working-tree changes under `.opencode/skills/sk-design/`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Land the craft as foundations rules paired with audit detectors; keep the hub logic-free and the conflict decisions intact

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-002-context -->
### Context

The 022 research found the highest-leverage home is foundations (the rule) plus audit (the detector), and recorded conflict decisions that protect the anti-slop posture. The build must respect both, or it would drift taste or fragment the rules.

### Constraints

- The hub holds no per-mode logic.
- shadow-as-border is replacement-only; image-outline is an optical exception; the do-not list governs.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: place each net-new rule in foundations and its matching detector in audit, add only the missing motion pieces and light interface preflight reminders, keep md-generator capture-only, and preserve every 022 conflict decision verbatim.

**How it works**: foundations gained radius/outline/smoothing/text-wrap/shadow/ring/tabular; audit gained the five detectors; motion gained the icon-swap fallback + escape hatch + split/stagger + fixed-exit; the hub only got its doc bug fixed.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Foundations rules + audit detectors (chosen)** | Single rule home, reviewable | Concentrates edits in two modes | 9/10 |
| Spread every item into its most local mode | "Balanced" | Fragmented, inconsistent, harder to enforce | 4/10 |
| Re-state the already-covered motion rules too | "Complete" | Duplication; contradicts the do-not list | 2/10 |

**Why this one**: it matches where the craft lives and keeps enforcement next to the rule.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Net-new surface craft is now taught, and each rule has a matching audit detector.
- The anti-slop posture is reinforced, not weakened (ghost-card cross-link, image-outline exception).

**What it costs**:
- Foundations and audit carry most of the change. Mitigation: the per-mode rollup names exactly what landed where.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A corpus default transplanted wholesale | M | Do-not list in every prompt; verified 44x44 and stagger caps preserved |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without a rule home, the edits fragment and lose enforcement |
| 2 | **Beyond Local Maxima?** | PASS | Considered even-spread and re-state-everything alternatives |
| 3 | **Sufficient?** | PASS | Foundations + audit covers the high-leverage core |
| 4 | **Fits Goal?** | PASS | Implements the 022 per-mode rollup faithfully |
| 5 | **Open Horizons?** | PASS | Preserves the hub invariant and the conflict decisions |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- foundations (3 files), audit (2 files), motion (2 files), interface (2 files), md-generator (1), shared (1), hub (1).
- Already-covered motion rules left intact; the do-not list not contradicted.

**How to roll back**: revert the specific mode file(s); the rule/detector pairs are independent per mode.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
