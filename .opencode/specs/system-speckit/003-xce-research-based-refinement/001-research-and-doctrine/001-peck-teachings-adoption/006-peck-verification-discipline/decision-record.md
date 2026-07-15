---
title: "Decision Record: 006 — Peck Verification Discipline"
description: "Architectural decisions for adopting the peck verification-discipline bundle (T5-T9) into spec-kit with zero new infrastructure, warn-first rollout, and UX+automation as top priorities."
trigger_phrases:
  - "decision"
  - "record"
  - "009 peck verification discipline"
  - "decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/006-peck-verification-discipline"
    last_updated_at: "2026-06-10T15:10:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Accepted T6 freshness gate"
    next_safe_action: "Monitor freshness warnings"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-009-peck-verification-discipline-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: 009 — Peck Verification Discipline

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Adopt the bundle as five warn-first rules on existing surfaces, freshness as the anchor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-10 |
| **Deciders** | Operator, gpt-5.5-fast |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed to decide how to adopt peck's verification-discipline bundle (completion-freshness, escalation gates, anti-softening, reviewer read-budget, numeric-severity note) without disrupting in-flight work or building parallel machinery. The integration research (this packet, iterations 019-023, cross-model verified) showed every rule maps onto a surface that already exists, and that the operator's two top priorities are UX and automation.

### Constraints

- Zero new infrastructure: reuse `validate.sh`/validator-registry, structured-verdict enforcement, and the existing `warn->strict` env convention.
- UX: each rule must reuse an existing user-facing surface with a warn-first, actionable message; no new prompt, no wall-of-errors.
- Automation: completion-freshness must run automatically; the rest are semi-auto with human judgment retained.
- Must not block a freshly-scaffolded folder; must depend on 010 fixtures before any rule promotes to enforcing.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: adopt the bundle as five rules, with completion-verdict freshness as the anchor, each shipping warn-first behind a feature flag on an existing surface, and rejecting peck's literal `score>=4 blocks`.

**How it works**: freshness binds checklist `[x]` evidence to a recomputed content fingerprint + clean-tree precondition in `validate.sh --strict`; escalation/anti-softening/read-budget land as prompt-contract rules on sk-code, the completion ritual, deep-review, and `@review`; the numeric-severity note is docs-only. Rollout copies `SPECKIT_SAVE_QUALITY_GATE` (default-on, warn-only window, persisted activation timestamp), gated by `SPECKIT_COMPLETION_FRESHNESS` + `..._ENFORCE`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Five warn-first rules on existing surfaces (chosen)** | Zero new infra; reversible; UX/automation-first | Touches many surfaces incl. `.claude` mirrors | 9/10 |
| New "verification engine" subsystem | Centralized | Parallel machinery; high blast radius; slow | 3/10 |
| Adopt peck literally (incl. `score>=4 blocks`) | Faithful to source | Over-blocks P2-advisory cleanup; wrong for spec-kit P0/P1/P2 | 2/10 |

**Why this one**: it delivers the verification value with the least new surface area and the lowest user friction, and it is fully reversible via flags.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Completion can no longer silently go stale after in-scope edits (the biggest gap).
- Reviewers stop softening Fails and over-reading; escalation becomes a bounded decision instead of thrash.

**What it costs**:
- Edits span ~40 surfaces incl. command YAMLs and `.claude/agents/*` mirrors. Mitigation: phase the rollout; mirror-update or record mirror-lag per change.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| False blocks on legacy folders | M | warn-only window + lifecycle opt-in; copy SPECKIT_SAVE_QUALITY_GATE graduation |
| `.claude` mirror drift | M | mirror-update checklist item (CHK-141) |
| Over-adoption of numeric scoring | L | keep numeric note docs-only; literal block rejected |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Completion is not bound to content/HEAD today (research §2 T6, cross-model confirmed) |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives scored; new-subsystem and literal-adoption rejected |
| 3 | **Sufficient?** | PASS | Reuses existing surfaces; no new infra needed |
| 4 | **Fits Goal?** | PASS | Directly serves the operator's UX + automation priorities |
| 5 | **Open Horizons?** | PASS | Flag-gated + reversible; 010 fixtures make it regression-safe |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Completion gate: `CLAUDE.md`/`AGENTS.md` §2, `constitutional/verify-before-completion-claims.md`, `validate.sh`, `continuity-freshness.ts`, `spec-doc-structure.ts`.
- Prompts: `sk-code/SKILL.md`, `/speckit:complete`, `deep-review/SKILL.md` + YAMLs, `@review` (+ `.claude` mirrors), `sk-code-review`.

**How to roll back**: set the enforce flags to `false` (`SPECKIT_COMPLETION_FRESHNESS_ENFORCE=false`) to return to warn-only; remove the flag entirely to disable. No data migration involved.

**Final T6 scope decisions**: the clean-tree precondition is packet-scoped, not whole-repository scoped; the `clock_drift` path remains a benign PASS path; `ENV_REFERENCE.md`, registry, dist, command YAML, and observability surfaces stayed outside the final approved write set.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3 Decision Record: One ADR per major decision.
Write in human voice: active, direct, specific.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
