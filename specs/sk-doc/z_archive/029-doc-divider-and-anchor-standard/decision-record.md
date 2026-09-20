---
title: "Decision Record: One structural standard for section dividers and doc navigation"
description: "Records the operator-ratified choice of bare numbered-H2 (no TOC, no nav-anchors, --- between numbered ALL-CAPS H2) as the single source of truth, over the older TOC-plus-double-dash-anchor style still baked into the validator and HVR."
trigger_phrases:
  - "bare numbered h2 decision"
  - "toc anchor removal decision"
  - "divider standard adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/029-doc-divider-and-anchor-standard"
    last_updated_at: "2026-08-13T06:20:00Z"
    last_updated_by: "spec-author"
    recent_action: "Recorded ADR-001 ratifying bare numbered-H2"
    next_safe_action: "Proceed to validator enforcement once approved"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-029-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: One structural standard for section dividers and doc navigation

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Bare numbered-H2 is the single structural standard

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-13 |
| **Deciders** | Operator (ratified during investigation) |

---

<!-- ANCHOR:adr-001-context -->
### Context

Two authorities inside sk-doc disagree about README and skill-doc navigation. `core-standards.md` §3 and the `sk-create-readme` suite say never add a Table of Contents or `<!-- ANCHOR -->` nav comments, and navigate by the numbered ALL-CAPS H2 hierarchy. The enforced validator (`validate_document.py`) plus `hvr-rules.md` §9 still treat a TOC with double-dash anchors as the valid general-document style, and only the opt-in code-folder path forbids it. Because the general path neither requires nor forbids a TOC, both styles pass, and the fleet stayed mixed.

Separately, the `---`-between-numbered-H2 divider rule is stated by every authority but enforced only on the code-folder path, so 1,015 numbered-H2 files drifted.

### Constraints

- The spec-kit continuity anchor system (in `spec.md` / `plan.md` / `tasks.md` / `implementation-summary.md` / `memory/context.md`) is a separate, required, error-severity contract and must not be affected.
- `validate_document.py` runs in CI, so the change must not turn the doc gate red on correct files.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Bare numbered-H2 as the one structural standard for READMEs and skill docs. No Table of Contents, no `<!-- ANCHOR -->` nav comments, and `---` between every numbered ALL-CAPS H2 section.

**How it works**: Lift the divider and no-TOC/no-nav-anchor rules that already exist in the code-folder path into the general validation path for applicable doc types, reconcile `hvr-rules.md` §9 and `core-standards.md` to match, then normalize the fleet behind the now-enforcing gate. The functional continuity-anchor contract stays exactly as it is.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Bare numbered-H2 (chosen)** | Matches the written standard and 803 of 819 READMEs; lowest churn; simplest reader model | Requires stripping TOC/anchors from a small set and reconciling HVR/validator | 9/10 |
| TOC + double-dash anchors | Matches current validator behavior; no anchor stripping | Reverses the skill's stated direction; forces adding TOCs to hundreds of files; keeps two nav systems | 4/10 |

**Why this one**: Only 16 of 819 READMEs carry a TOC, and the authoring standard already points at bare numbered-H2. The chosen option removes a contradiction instead of entrenching it.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One rule, enforced mechanically, so navigation drift cannot merge silently.
- Readers get consistent dividers across 1,015 currently-inconsistent files.

**What it costs**:
- The CI doc gate will flag the current fleet until normalization lands. Mitigation: land enforcement and normalization in a controlled sequence, dry-run first.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Bulk strip removes a functional continuity anchor | H | Doc-type/path allowlist; verify against `007`/`008` fixtures |
| Divider auto-insert corrupts a fenced block | M | Reuse fence-aware line tracking; act only between numbered H2 |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 1,015 drifted files and a live authority conflict |
| 2 | **Beyond Local Maxima?** | PASS | Both nav conventions weighed; operator chose |
| 3 | **Sufficient?** | PASS | Reuses existing code-folder rules; no new subsystem |
| 4 | **Fits Goal?** | PASS | Directly serves sk-doc documentation-quality |
| 5 | **Open Horizons?** | PASS | Leaves the continuity-anchor system and memory policy open |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `validate_document.py`: general-path divider check plus README/skill-doc TOC/nav-anchor prohibition.
- `template-rules.json`, `hvr-rules.md` §9, `core-standards.md`: reconciled to state the one rule.
- Fleet `.md` files: normalized in bulk.

**How to roll back**: The validator and rules change is one commit; revert it to restore prior gate behavior. The fleet normalization is a separate commit and reverts independently.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
