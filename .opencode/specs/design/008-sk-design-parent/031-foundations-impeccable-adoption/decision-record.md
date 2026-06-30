---
title: "Decision Record: design-foundations impeccable adoption"
description: "Binding decisions: scope-locked cli-codex dispatch with read-first skip-if-present + per-diff verification (ADR-001); adopt only as crosswalk refinements into design-foundations with no new mode or parallel system, then independently fresh-Opus-verify (ADR-002)."
trigger_phrases:
  - "031-foundations-impeccable-adoption decisions"
  - "impeccable foundations ADRs"
  - "sk-design impeccable foundations decisions"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/031-foundations-impeccable-adoption"
    last_updated_at: "2026-06-27T15:30:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the foundations build ADRs"
    next_safe_action: "Commit phases 031-034 when approved"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-031-foundations-impeccable-adoption"
      parent_session_id: null
    completion_pct: 100
    answered_questions: []
---
# Decision Record: design-foundations impeccable adoption

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Scope-locked codex dispatch with read-first skip-if-present + fresh-Opus verification

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context
The foundations references are mature and prior corpus adoptions already pulled craft, so duplication is a real risk. The operator's goal named cli-codex gpt-5.5 high fast for the build and fresh Opus agents for verification.

### Constraints
- Edits additive and confined to the named foundations files.
- Already-present content skipped.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: one scope-locked codex dispatch that reads each file in full first and skips present content, then an independent zero-context fresh Opus reviewer verifies each item landed.

**How it works**: codex reported its skips; the orchestrator verified the diff; a fresh Opus agent re-verified each item against the backlog and returned PASS.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scope-locked dispatch + skip-if-present + fresh-Opus verify (chosen)** | No duplication; independently verified | Per-diff + review cost | 9/10 |
| Self-verified build | Faster | No independent check | 5/10 |
| Hand-edit | Max control | Ignores the named executor | 5/10 |

**Why this one**: adds only net-new content and confirms it with an independent reviewer.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Only net-new content lands, additive, independently verified PASS.

**What it costs**:
- A per-diff review + a fresh-Opus pass. Mitigation: small additive diff.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Codex re-adds present content | M | read-first skip-if-present; fresh-Opus verify |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The foundations backlog had to be applied |
| 2 | **Beyond Local Maxima?** | PASS | Weighed self-verify and hand-edit |
| 3 | **Sufficient?** | PASS | Scope-lock + skip + fresh-Opus verify |
| 4 | **Fits Goal?** | PASS | Implements the foundations slice |
| 5 | **Open Horizons?** | PASS | Per-file revert keeps it reversible |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation
**What changes**: the named foundations files edited additively.
**How to roll back**: `git checkout -- <file>` per file.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Adopt only as crosswalk refinements; no new mode or parallel system

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-002-context -->
### Context
The 028 research ruled out impeccable's structural systems (second register/score, detector engine, prose validator, live-mode, document-seed) as already-analogous or infrastructure.

### Constraints
- The five-mode structure and hub-is-routing-only invariant hold.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision
**We chose**: adopt the foundations items only as additive crosswalk refinements into the existing references; build no ruled-out system and no new mode.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Crosswalk refinements, no new system (chosen)** | Preserves ownership; no duplication | Per-item verification | 9/10 |
| Import impeccable's systems | "Parity" | Parallel conflicting machinery | 2/10 |
| New mode | Tidy home | Unjustified | 2/10 |
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The mode gains verified refinements without structural bloat.

**What it costs**:
- Some impeccable surface deliberately left unadopted. Mitigation: already-covered or infrastructure.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A wrongly-skipped item | M | fresh-Opus reviewer checks completeness |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Avoids parallel systems |
| 2 | **Beyond Local Maxima?** | PASS | Considered import-all and new-mode |
| 3 | **Sufficient?** | PASS | Crosswalk refinements capture the value |
| 4 | **Fits Goal?** | PASS | Implements the verified backlog |
| 5 | **Open Horizons?** | PASS | Preserves the five-mode structure |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation
**What changes**: the foundations references gain the named items.
**How to roll back**: revert the specific file(s).
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
