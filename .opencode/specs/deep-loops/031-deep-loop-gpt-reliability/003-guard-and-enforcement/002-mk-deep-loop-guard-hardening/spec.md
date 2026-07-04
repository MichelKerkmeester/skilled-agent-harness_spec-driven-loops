---
title: "Feature Specification: mk-deep-loop-guard Orchestrate Loop-Detection Hardening"
description: "Research + design phase for extending mk-deep-loop-guard.js with orchestrate-specific loop-detection logic: mechanically block repeated/loop-like orchestrate-to-command-owned-loop-executor dispatches while allowing exactly one bounded hand-off, addressing phase 012's measured GPT-5.5 enforcement inconsistency."
trigger_phrases:
  - "mk-deep-loop-guard hardening"
  - "orchestrate loop detection"
  - "bounded hand-off enforcement"
importance_tier: "high"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/003-guard-and-enforcement/002-mk-deep-loop-guard-hardening"
    last_updated_at: "2026-07-01T20:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "5-iteration dual-model research complete; design options synthesized"
    next_safe_action: "Operator decides implementation option before a new phase codes it"
    blockers: []
    key_files:
      - "../015-skill-doc-drift-remediation/implementation-summary.md"
      - ".opencode/plugins/mk-deep-loop-guard.js"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-016-init"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Implementation option: in-process counter (fast, weaker) vs external state + iteration-aware counting (stronger, more code) -- both research lineages independently converged on needing an iteration-state heuristic to avoid false-positiving on legitimate command-driven loop iterations."
    answered_questions:
      - "Does tool.execute.before expose session-scoped state? Yes -- sessionID/callID present on every call; 3 sibling plugins already use in-process closure Maps, mk-goal.js uses external per-session JSON state."
      - "Can subagent_type be trusted as the target-identity signal? No -- independently verified: orchestrate.md's dispatch template and Priority table both literally set subagent_type='general' for every agent row. The guard (both existing and future) must parse the prompt's 'Agent:'/'Deep Route:' text for real identity."
---
# Feature Specification: mk-deep-loop-guard Orchestrate Loop-Detection Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 (research-only; implementation is a separate future phase) |
| **Priority** | P2 |
| **Status** | Complete (research) |
| **Created** | 2026-07-01 |
| **Predecessor** | `../015-skill-doc-drift-remediation/` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cli-opencode/SKILL.md` now correctly documents that `orchestrate` may perform exactly one bounded hand-off dispatch to a command-owned loop executor (`deep-research`, `deep-review`, `deep-improvement`, `prompt-improver`), but never re-implement the loop itself. This is currently a *wording* contract, not a *mechanical* one — nothing actually stops `orchestrate` from repeatedly dispatching the same loop executor across turns, which would functionally reimplement loop management outside the owning command. Phase 012's real benchmark measured GPT-5.5 inconsistently enforcing an analogous rule: it refused one direct `deep-research` dispatch citing the rule, but allowed an identical direct `deep-review` dispatch in a separate run.

### Purpose
Research whether `.opencode/plugins/mk-deep-loop-guard.js` (currently a single-dispatch mode-mismatch detector) can be extended with session-scoped dispatch-history tracking to mechanically detect and optionally block repeated/loop-like `orchestrate` → command-owned-loop-executor dispatches, while still allowing the one legitimate bounded hand-off.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Research existing `tool.execute.before` plugin capabilities/limits for tracking dispatch history across multiple Task-tool calls within one session.
- Research what "loop-like" should mean mechanically (e.g., same `subagent_type` dispatched N times within a session/time-window from the same caller).
- Research whether OpenCode's plugin API exposes enough session/caller context to distinguish a genuine single-iteration hand-off from a caller re-invoking the same iteration repeatedly.
- Produce concrete design options with trade-offs, not an implementation.

### Out of Scope
- Implementing the hardening itself (a separate phase after design is settled).
- Re-litigating Cluster 6's already-settled decision (orchestrate's `@deep-review` row stays; `cli-opencode/SKILL.md`'s wording is already fixed).

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Research whether plugin-level session-scoped state tracking is feasible in this OpenCode version | Concrete answer with evidence (SDK docs, existing plugin precedent) |
| REQ-002 | Produce at least 2 concrete design options for detecting loop-like repeated dispatch | Each option has a clear trigger condition and a stated false-positive risk |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Research produces an evidence-backed answer on technical feasibility, not speculation.
- **SC-002**: At least one design option is judged implementable without requiring OpenCode core changes.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Session-scoped state may not be available to a `tool.execute.before` hook | Design would need an alternative signal (e.g., external state file) | Research the plugin API surface directly before assuming |
| Risk | Over-aggressive loop detection creates false positives on legitimate repeated hand-offs (e.g., retries) | Blocks legitimate work | Design options must explicitly address retry/legitimate-repeat cases |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- Any proposed design must fail open (a bug in the new logic must never block an unrelated, correctly-routed dispatch), matching `mk-deep-loop-guard.js`'s existing fail-open principle.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A legitimate retry of a failed hand-off (not a loop) should not be flagged as loop-like.
- Multiple independent sessions dispatching the same loop executor concurrently should not cross-contaminate each other's dispatch history.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | [10/25] | Research-only phase, no implementation |
| Risk | [5/25] | No production code changed by this phase |
| Research | [18/20] | 5 real GPT-5.5/GLM-5.2 iterations investigating plugin API feasibility |
| **Total** | **[33/70]** | **Level TBD pending design outcome** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- See `_memory.continuity.open_questions` above.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Predecessor**: `../015-skill-doc-drift-remediation/implementation-summary.md`
- **Plugin under study**: `.opencode/plugins/mk-deep-loop-guard.js`

<!-- /ANCHOR:related-docs -->
