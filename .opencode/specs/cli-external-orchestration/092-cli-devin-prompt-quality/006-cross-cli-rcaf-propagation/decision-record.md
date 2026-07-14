---
title: "Decision Record: cli-cross-rcaf-propagation"
description: "Documents why packet 113/006 propagates only medium pre-planning density guidance and defers the other 113/003 findings to packet 113/007."
trigger_phrases:
  - "113/006 adr medium pre plan"
  - "bundle gate deferred"
  - "anti hallucination deferred"
  - "rcaf already default"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/006-cross-cli-rcaf-propagation"
    last_updated_at: "2026-05-17T12:18:18Z"
    last_updated_by: "cli-codex"
    recent_action: "documented-propagation-decision"
    next_safe_action: "use-113-007-for-held-validation-findings"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/092-cli-devin-prompt-quality/007-cross-model-validation/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-codex-113-cli-devin-prompt-quality/006-cross-cli-rcaf-propagation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Medium pre-plan density is model-agnostic enough to propagate now"
      - "Bundle gate and anti-hallucination findings require packet 113/007 validation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: cli-cross-rcaf-propagation

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Propagate Only Medium Pre-Plan Guidance

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-17 |
| **Deciders** | cli-codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

The 113/003 eval-loop measured that medium-density pre-planning beat dense pre-planning by roughly 10-15% on SWE 1.6. That result maps to a general prompt-composition principle: use enough structure to anchor the work, but avoid dense pre-plans that spend too much budget before touching the task.

The same eval-loop also surfaced bundle-gate-aversion and framework-dominates-anti-hallucination signals. Those signals came from SWE 1.6, a small coding-specialized model, and may not hold for larger frontier models with more reasoning budget.

### Constraints

- Packet 113/006 can update skill prompt guidance, but cannot claim cross-model evidence that has not been run.
- RCAF is already the cross-CLI default in the quality cards, so this packet must not frame RCAF as newly introduced.
- The sibling CLI skills need release metadata for any user-visible prompt card update.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Propagate only the medium-pre-plan finding cross-CLI; hold bundle-gate-aversion and anti-hallucination-deprioritization for cross-model validation.

**How it works**: The sk-prompt master CLI prompt quality card receives the medium pre-planning density note, and the four sibling CLI cards mirror it. The two held findings remain documented as excluded scope and move to packet 113/007 for validation on deepseek-v4-pro and kimi-k2.6.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Propagate only medium pre-plan guidance** | Shares the clearly model-agnostic composition finding now | Requires a follow-on validation packet for the other findings | 9/10 |
| Propagate all 113/003 findings cross-CLI | Fastest alignment across cards | Risks encoding SWE 1.6-specific behavior as universal CLI guidance | 4/10 |
| Defer all findings until cross-model validation | Maximizes caution | Leaves a broadly applicable planning-density improvement unused | 6/10 |

**Why this one**: Medium pre-planning density is a prompt-composition principle that likely generalizes across CLI orchestrators. The other findings depend more on model capability and constraint tolerance, so packet 113/007 is the right gate.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- CLI prompt cards converge on medium pre-planning density guidance.
- Cross-CLI defaults avoid overfitting SWE 1.6-specific findings.
- Packet history stays accurate about RCAF already being present.

**What it costs**:
- Bundle-gate and anti-hallucination guidance remain uneven until packet 113/007 completes. Mitigation: packet 113/007 defines the validation harness and decision gates.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Held findings stay unresolved too long | M | Keep packet 113/007 as the next safe action |
| Mirror cards drift from master card wording | M | Treat the sk-prompt card as the source for future mirror checks |
| Medium pre-plan guidance is overgeneralized | L | The guidance is advisory composition text, not a hard runtime gate |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The 113/003 result exposed a reusable prompt-composition improvement |
| 2 | **Beyond Local Maxima?** | PASS | The decision separates model-agnostic guidance from model-specific findings |
| 3 | **Sufficient?** | PASS | Card guidance, version bumps, and changelogs cover the release surface |
| 4 | **Fits Goal?** | PASS | The change keeps sibling CLI prompt cards aligned |
| 5 | **Open Horizons?** | PASS | Packet 113/007 remains available for broader propagation after validation |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `sk-prompt` master CLI prompt card adds the medium pre-planning density note.
- Four sibling CLI prompt cards mirror the note.
- Four sibling SKILL.md files and changelogs record the release metadata.

**How to roll back**: Revert the packet 113/006 skill-card, SKILL.md, and changelog changes from the follow-on commit; no data migration or runtime rollback is involved.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
