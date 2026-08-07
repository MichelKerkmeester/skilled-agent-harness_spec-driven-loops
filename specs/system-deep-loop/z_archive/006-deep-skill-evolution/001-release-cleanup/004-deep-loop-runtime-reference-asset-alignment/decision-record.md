---
title: "Decision Record: Deep Skills Reference And Asset Alignment"
description: "Architecture decision record for the shared deep-skill resource model."
trigger_phrases:
  - "deep skills alignment decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/001-release-cleanup/004-deep-loop-runtime-reference-asset-alignment"
    last_updated_at: "2026-05-24T12:00:00Z"
    last_updated_by: "codex"
    recent_action: "decisions-recorded"
    next_safe_action: "await-human-approval-for-phase-9"
    blockers:
      - "Phase 9 approval pending."
    key_files: ["decision-record.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000013017"
      session_id: "131-000-013-deep-skills-reference-asset-alignment"
      parent_session_id: "131-000-013-deep-skills-reference-asset-alignment"
    completion_pct: 89
    open_questions:
      - "Approve Phase 9?"
    answered_questions: []
---

# Decision Record: Deep Skills Reference And Asset Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Shared Deep-Skill Resource Model

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-24 |
| **Deciders** | User, Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

The three deep skills are now siblings, but their resource shapes were uneven. `deep-research` had the modern split family, `deep-review` lacked focused state/convergence references, and `deep-ai-council` had no assets folder. Operators needed predictable navigation without confusing research novelty, review severity, and council agreement.

### Constraints

- Must follow sk-doc skill/reference/asset templates.
- Must use sk-prompt RCAF/CLEAR for delegated prompts.
- Must not change runtime YAML, reducers, scripts, commands, or agents.
- Must stop before Phase 9 until human approval.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Align the three skills to one resource family shape while preserving distinct domain vocabulary and stop semantics.

**How it works**: Each skill exposes README, SKILL router, quick/loop guidance, convergence/state references where useful, runtime assets, changelog, and validation evidence. Council gets new operational assets, review gets focused references, and research keeps its existing split family with a version/navigation update.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shared shape, distinct domain voice** | Predictable navigation, low runtime risk, preserves semantics | Requires resource-map discipline | 9/10 |
| Rewrite all three skills from scratch | Maximum uniformity | High churn, likely erases domain nuance | 4/10 |
| Only update README/SKILL metadata | Fast | Leaves council asset gap and review split gap | 5/10 |
| Add council assets only | Fixes biggest asymmetry | Leaves review reference family behind | 6/10 |

**Why this one**: It solves the current alignment problem with the least behavioral risk. The resource family becomes comparable while each skill keeps its own operating model.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Operators can navigate the three deep skills with the same mental model.
- Council now has real config, strategy, dashboard, prompt-pack, and capability assets.
- Review has focused state/convergence references like research.

**What it costs**:

- More documentation surfaces need validation. Mitigation: resource map rows name validation commands and owner phases.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Copy-paste domain drift | M | `domain_uniqueness_note` per resource-map row |
| Decorative assets | M | Assets limited to workflow-backed surfaces |
| Premature Phase 9 execution | H | Approval gate in spec, plan, checklist, and summary |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Council asset gap and review split gap were verified. |
| 2 | **Beyond Local Maxima?** | PASS | Alternatives considered full rewrite, metadata-only, and council-only. |
| 3 | **Sufficient?** | PASS | Docs/resources only; runtime behavior untouched. |
| 4 | **Fits Goal?** | PASS | Directly implements user-supplied plan. |
| 5 | **Open Horizons?** | PASS | Phase 9 can add map logic after approval without reworking resources. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `deep-ai-council` gets quick/loop references and five council-specific assets.
- `deep-review` gets focused convergence/state references.
- `deep-research` records existing alignment through version/navigation/changelog.
- Phase packet adds schemas, prompts, resource map, audit findings, and validation reports.

**How to roll back**: Revert the specific changed skill docs/resources and phase packet files from this phase, then rerun sk-doc quick validation and strict spec validation.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
