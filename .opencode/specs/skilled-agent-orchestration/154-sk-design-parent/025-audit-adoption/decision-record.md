---
title: "Decision Record: adopt the designer-skills-main audit findings into sk-design"
description: "Binding decisions: implement via a scope-locked cli-codex dispatch with read-first skip-if-present and per-diff verification (ADR-001); land visual-critique as a crosswalk onto the existing P0-P3 severity, never a second score or a new mode (ADR-002)."
trigger_phrases:
  - "audit adoption decisions designer-skills"
  - "visual-critique crosswalk decision"
  - "sk-design audit build ADRs"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/025-audit-adoption"
    last_updated_at: "2026-06-27T11:49:46Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Recorded the binding audit-build decisions as ADRs"
    next_safe_action: "Commit phases 025-027 once 026 and 027 verify"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-025-audit-adoption"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: adopt the designer-skills-main audit findings into sk-design

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

The audit mode is mature (a five-dimension score, P0-P3 severity, a Nielsen lens, RTL hardening). A naive adoption would duplicate existing content. A prior build (023) also already edited sibling audit files, so attribution and non-duplication matter.

### Constraints

- Operator named `cli-codex gpt-5.5 high fast` as the executor.
- Edits must be additive and confined to the four audit reference files.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: one scope-locked codex dispatch that reads each audit file in full first and skips anything already present, with the orchestrator verifying every diff.

**How it works**: the prompt named the four files, the exact items, a hard scope lock, and a read-first skip-if-present rule; codex reported its skips (RTL/text-expansion) and the orchestrator confirmed the diff is additive and in-scope.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scope-locked dispatch + skip-if-present (chosen)** | No duplication; verifiable; honors the named executor | Requires per-diff review | 9/10 |
| Blind adoption of all backlog items | Fast | Duplicates mature audit content | 3/10 |
| Orchestrator hand-edits | Max control | Ignores the operator-named executor | 5/10 |

**Why this one**: it adds only net-new audit content while respecting the mature mode and the named executor.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Only net-new audit content lands (+57 lines), verified per file.
- The skip-if-present discipline kept RTL/text-expansion from being duplicated.

**What it costs**:
- A per-diff review. Mitigation: small, additive diff in four files.

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
| 1 | **Necessary?** | PASS | The audit-targeted backlog items had to be applied |
| 2 | **Beyond Local Maxima?** | PASS | Weighed blind-adopt and hand-edit alternatives |
| 3 | **Sufficient?** | PASS | Scope-lock + skip-if-present + verify is the minimal safe control |
| 4 | **Fits Goal?** | PASS | Applies the audit slice precisely |
| 5 | **Open Horizons?** | PASS | Per-file revert keeps it reversible |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Four audit reference files edited additively (+57 lines).

**How to roll back**: `git checkout -- <audit file>` per file.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Visual-critique is a crosswalk onto existing severity, never a second score or a new mode

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-27 |
| **Deciders** | Operator + orchestrator |

---

<!-- ANCHOR:adr-002-context -->
### Context

The visual-critique plugin ships its own seven-dimension scoring model. The audit mode already owns severity, evidence, scoring, and owner routing. The 024 research explicitly ruled out a parallel scoring system and a new critique mode.

### Constraints

- Audit's P0-P3 severity and five dimensions are fixed; the crosswalk must feed them.
- Brand-consistency checks require supplied references (no hallucinated brand truth).
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: add the seven critique dimensions as a crosswalk table — each dimension maps to a scan probe and the existing audit dimension/severity it feeds — not a separate score, and not a new mode.

**How it works**: `critique_hardening.md` gained a "Visual-Critique Crosswalk" table that explicitly feeds the existing model, plus a "Polish As Trust" perceived-quality lens tied to observable consistency.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Crosswalk onto existing severity (chosen)** | Preserves audit ownership; adds the lenses | Requires mapping each dimension | 9/10 |
| Import the 7-dimension score | "Complete" | Two competing score models | 2/10 |
| New critique mode | Tidy home | Duplicates audit ownership; unjustified | 3/10 |

**Why this one**: it captures the critique value without a second scoring system or a sixth mode.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Sharper, more systematic screen critique mapped to the existing severity.
- The perceived-quality gap (named in §4 but never landed) is now filled.

**What it costs**:
- Reviewers learn the crosswalk. Mitigation: it is one compact table.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Crosswalk drifts into a second score | M | The added text states "lenses, not a second score" and feeds existing dimensions |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Critique value would otherwise be lost or duplicate the score |
| 2 | **Beyond Local Maxima?** | PASS | Considered import-the-score and new-mode |
| 3 | **Sufficient?** | PASS | A crosswalk + polish lens covers the audit value |
| 4 | **Fits Goal?** | PASS | Implements rank 1 + rank 11 |
| 5 | **Open Horizons?** | PASS | Preserves audit ownership and the five-mode structure |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `critique_hardening.md` gains the crosswalk table + the Polish As Trust lens.

**How to roll back**: `git checkout -- design-audit/references/critique_hardening.md`.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->
