---
title: "Decision Record: cli-devin quality optimization"
description: "ADRs for Phase C: verification opt-in default + per-model budget shape."
trigger_phrases:
  - "cli-devin quality ADRs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/004-budget-and-output-verification"
    last_updated_at: "2026-05-18T14:36:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 004 decision-record"
    next_safe_action: "Author 004 implementation-summary"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000017"
      session_id: "114-004-decisions-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Decision Record: cli-devin quality optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Verification pipeline OFF by default; opt-in per recipe

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-18 |
| **Deciders** | implementer + reviewer |

---

<!-- ANCHOR:adr-001-context -->
### Context

The verification pipeline (compile/run/test/lint + hard-fail) could either ship enabled-by-default or opt-in. Enabled-by-default would catch hallucinated code immediately but risks false-failing iters that produce legitimate non-code output (e.g. research narratives). Opt-in is safer but requires explicit recipe updates per use case.

### Constraints

- 113-arc deep-research / deep-review iters must continue passing without changes
- Verification cost (compile + run + test) is non-trivial; not every iter should pay it
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Verification OFF by default. Each agent-config recipe gets a new field `verification_enabled` (bool) + `verification_languages` (array). Operators opt-in per recipe.

**How it works**: post-dispatch-validate.ts checks the recipe config; if `verification_enabled: true`, run the rubric-based verification pass after iter output is captured. Otherwise pass through unchanged.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **OFF by default (chosen)** | Safe; backward compat; cost only when needed | Requires explicit opt-in | 8/10 |
| ON by default | Catches hallucinations everywhere | False-fails research iters; cost on every iter | 5/10 |
| ON for code-producing iters only | Auto-detects via output language | Detection heuristic fragile | 6/10 |
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**: Backward compat absolute; cost is paid only when opted in; recipe-level control is granular.

**What it costs**: Operators must remember to opt-in for code-producing iters. Mitigation: 004's reference doc has a "when to enable" checklist.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operator forgets to opt-in | M | Reference doc + cli-devin SKILL.md cross-reference |
| Misconfigured `verification_languages` array | L | Validator checks list against supported set |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Must choose default behavior |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives weighed |
| 3 | **Sufficient?** | PASS | Recipe-level opt-in covers all use cases |
| 4 | **Fits Goal?** | PASS | Backward compat + opt-in safety |
| 5 | **Open Horizons?** | PASS | Can flip default in future once rubric is proven |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- agent-config recipe schema gains `verification_enabled` (bool, default false) + `verification_languages` (array of strings)
- post-dispatch-validate.ts checks the config; runs verification pass when enabled

**How to roll back**: Set `verification_enabled: false` in all recipes; ignore unused config fields.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
