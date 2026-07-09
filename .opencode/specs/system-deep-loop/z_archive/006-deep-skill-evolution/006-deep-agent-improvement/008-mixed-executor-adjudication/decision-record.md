---
title: "Decision Record: 128 — Deep-Agent-Improvement Mixed-Executor + Adjudication Methodology"
description: "ADR-001 for mixed-executor dispatch and adjudication-iter false-positive filter."
trigger_phrases:
  - "decision"
  - "record"
  - "128 deep-agent-improvement"
  - "mixed-executor"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/006-deep-agent-improvement/008-mixed-executor-adjudication"
    last_updated_at: "2026-05-23T08:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "decision-record authored"
    next_safe_action: "run strict-validate"
    blockers: []
    completion_pct: 100
    key_files:
      - "decision-record.md"
---
# Decision Record: 128 — Deep-Agent-Improvement Mixed-Executor + Adjudication Methodology

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Mixed-Executor + Adjudication Methodology for DAI

### Metadata

|| Field | Value |
||-------|-------|
|| **Status** | Accepted |
|| **Date** | 2026-05-23 |
|| **Deciders** | DAI Maintainer |
|| **Precedent** | Arc 119 deep-research uplift |

---

<!-- ANCHOR:adr-001-context -->
### Context

Deep-agent-improvement currently lacks the methodology patterns proven in arc 119's deep-research uplift. The 119 research demonstrated that single-executor approaches lose breadth/synthesis balance, and without adjudication, adversarial passes produce 90%+ false-positive findings. DAI operators running multi-iter evaluation sweeps would benefit from the same mixed-executor dispatch (cli-devin SWE-1.6 breadth + cli-codex gpt-5.5 synthesis) and adjudication-iter false-positive filter patterns that improved deep-research reliability.

### Constraints
- Must not break existing DAI workflow or evaluator logic
- Should be documented as RECOMMENDED patterns, not enforced contracts
- Must cross-reference 119 as the methodology origin
- Should address DAI-004 (dynamic profiling auditability) as a parallel concern
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Document mixed-executor dispatch (cli-devin SWE-1.6 breadth + cli-codex gpt-5.5 synthesis) and adjudication-iter false-positive filter as recommended methodology patterns for DAI multi-iter evaluation sweeps, and add profile-selection rationale logging to address DAI-004.

**Details**:
- Add "Mixed-Executor Dispatch (recommended)" section to DAI SKILL.md documenting the 8+2 split (breadth iters 1-N-2 on cli-devin SWE-1.6, synthesis iters N-1, N on cli-codex gpt-5.5)
- Add "Adjudication-Iter Pattern (recommended)" section to DAI SKILL.md documenting the false-positive filter pass (typically at iter-7-equivalent)
- Create reference doc `references/mixed_executor_methodology.md` with detailed guidance on when to use the pattern, the 8+2 split mechanics, adjudication-iter implementation, and cross-link to 119
- Create reference doc `references/profiling_audit_log.md` addressing DAI-004 with log format and retention policy
- Add profile-selection rationale logging to `scripts/generate-profile.cjs` (additive only, no signature changes)
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

|| Option | Pros | Cons | Score |
||--------|------|------|-------|
|| **Mixed-executor + adjudication (recommended)** | Proven in 119, 90%+ false-positive reduction, breadth/synthesis balance | Documentation-only for this packet (no auto-dispatch) | 9/10 |
|| Single-executor (cli-devin only) | Simpler, no cross-CLI coordination | Loses synthesis quality, higher false-positive rate per 119 | 5/10 |
|| Single-executor (cli-codex only) | Strong synthesis, higher reasoning | Loses breadth, expensive for all iters | 4/10 |
|| No adjudication | Simpler workflow | 90%+ false-positive rate per 119 precedent | 3/10 |
|| Auto-dispatch in YAML workflow | Fully automated | Out of scope for this packet, requires workflow rewiring | 6/10 |

**Why Chosen**: Mixed-executor + adjudication is the proven pattern from 119 with measurable false-positive reduction (90%+). Documenting as RECOMMENDED provides immediate value to operators without requiring workflow rewiring (which is a future enhancement). The 8+2 split balances breadth (cli-devin SWE-1.6) with synthesis (cli-codex gpt-5.5), and adjudication at iter-7-equivalent filters false positives before synthesis.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**Positive**:
- Methodology parity with sibling skills (deep-research, deep-review)
- Operators can run multi-iter DAI sweeps with proven patterns
- False-positive reduction (90%+ per 119 precedent)
- Profile-selection auditability (DAI-004 addressed)
- No breaking changes to existing DAI workflow

**Negative**:
- Patterns are recommendations, not enforced (operators must opt-in)
- No auto-dispatch in YAML workflow (future enhancement)
- Additional documentation to maintain

**Risks**:
|| Risk | Impact | Mitigation |
||------|--------|------------|
|| Documentation drift if 119 patterns evolve | L | Cross-reference 119 as precedent; patterns are recommendations |
|| Operators ignore recommendations | L | Document benefits clearly; future auto-dispatch can enforce |
|| Logging performance impact | L | Single-line append, < 1ms overhead, try/catch protection |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**Affected Systems**:
- DAI SKILL.md (add two new sections)
- DAI references/ (add two new .md files)
- DAI scripts/generate-profile.cjs (additive logging)

**Rollback**: Revert SKILL.md edits, delete new reference docs, revert script changes. No data migrations.
<!-- /ANCHOR:adr-001-impl -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

1. **Correctness**: Does this solve the stated problem? Yes - brings proven methodology from 119 to DAI.
2. **Completeness**: Does this address all requirements? Yes - REQ-001 through REQ-007 covered.
3. **Consistency**: Is this consistent with existing patterns? Yes - follows 119 precedent.
4. **Clarity**: Is the decision clearly documented? Yes - ADR-001 with full context.
5. **Testability**: Can this be verified? Yes - strict-validate, sk-doc validate, node --check.
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3 Decision Record
Document significant technical decisions
One ADR per major decision
All ADRs should have Accepted/Rejected status before completion
-->
