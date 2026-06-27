---
title: "Decision Record: adopt the designer-skills-main foundations findings into sk-design"
description: "Binding decisions: implement via a scope-locked cli-codex dispatch with read-first skip-if-present and per-diff verification (ADR-001); add net-new layout/theme/type refinements; skip phase-023 additions and the existing data-viz coverage (ADR-002)."
trigger_phrases:
  - "027-foundations-adoption decisions"
  - "sk-design adoption decisions"
  - "designer-skills build ADRs"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/027-foundations-adoption"
    last_updated_at: "2026-06-27T11:49:46Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the binding build decisions as ADRs"
    next_safe_action: "Commit phases 025-027 once all three finalize"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-027-foundations-adoption"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:

---
# Decision Record: adopt the designer-skills-main foundations findings into sk-design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Scope-locked codex dispatch with read-first skip-if-present and per-diff verification

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The target modes are mature and a prior build (phase 023) already edited sibling files, so duplication and attribution matter. The operator named `cli-codex gpt-5.5 high fast`.

### Constraints

- Edits must be additive and confined to the named files.
- Phase-023 and already-covered content must be skipped.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: one scope-locked codex dispatch that reads each file in full first and skips anything already present, with the orchestrator verifying every diff.

**How it works**: the prompt named the files, the exact items, a hard scope lock, and a read-first skip-if-present rule; codex reported its skips and the orchestrator confirmed the diff is additive and in-scope.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scope-locked dispatch + skip-if-present (chosen)** | No duplication; verifiable; honors the named executor | Per-diff review | 9/10 |
| Blind adoption of all items | Fast | Duplicates mature content | 3/10 |
| Orchestrator hand-edits | Max control | Ignores the operator-named executor | 5/10 |

**Why this one**: adds only net-new content while respecting the mature mode and the named executor.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Only net-new content lands, verified per file.
- Skip-if-present kept phase-023 content from being duplicated.

**What it costs**:
- A per-diff review. Mitigation: small additive diff.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Codex re-adds present content | M | Read-first + skip-if-present; verify diff |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The targeted backlog items had to be applied |
| 2 | **Beyond Local Maxima?** | PASS | Weighed blind-adopt and hand-edit |
| 3 | **Sufficient?** | PASS | Scope-lock + skip-if-present + verify is the minimal safe control |
| 4 | **Fits Goal?** | PASS | Applies the slice precisely |
| 5 | **Open Horizons?** | PASS | Per-file revert keeps it reversible |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The named files edited additively.

**How to roll back**: `git checkout -- <file>` per file.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Add net-new layout/theme/type refinements; skip phase-023 additions and the existing data-viz coverage

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-002-context -->
### Context

Foundations already carries concentric radius, image-edge outline, shadow-as-border, dark-mode ring, font smoothing, text-wrap caveats, tabular numbers (all from phase 023), and full data-visualization coverage. The net-new corpus value is an explicit grid contract, density modes, a containment restraint, theme-specific media verification, and script-specific typography.

### Constraints

- The five-mode structure and the hub-is-logic-free invariant hold.
- Already-covered and phase-023 content must be skipped.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: add the grid contract, density modes, and containment restraint to layout_responsive.md; theme-specific media verification and a cultural-color note to palette_theming.md; and a script-specific typography note to typography_system.md — skipping every phase-023 addition and data-viz.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Net-new layout/theme/type + skip-covered (chosen)** | Adds real system craft; no duplication | Per-diff discipline | 9/10 |
| Re-import all corpus foundations items | "Complete" | Duplicates phase-023 + data-viz | 2/10 |

**Why this one**: it lands the net-new value without scope creep or a new mode.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Layout system handoff is more concrete (grid + density + containment).
- Media is verified per theme; non-Latin scripts get correct treatment.

**What it costs**:
- Reviewers learn the new guidance. Mitigation: compact, anchored additions.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Duplication of existing content | M | Read-first skip-if-present; verify diff |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The slice would otherwise be unbuilt |
| 2 | **Beyond Local Maxima?** | PASS | Considered import-everything and new-mode |
| 3 | **Sufficient?** | PASS | The named additions cover the slice |
| 4 | **Fits Goal?** | PASS | Implements the backlog items |
| 5 | **Open Horizons?** | PASS | Preserves the five-mode structure |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `layout_responsive.md` gains grid/density/containment; `palette_theming.md` gains theme-media + cultural-color; `typography_system.md` gains the script note.

**How to roll back**: revert the specific mode file(s).
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
