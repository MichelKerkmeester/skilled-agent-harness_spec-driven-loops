---
title: "Decision Record: Deprecate Standalone Deep Context"
description: "Decision record for staged deprecation of standalone deep-context and migration of useful context capabilities into deep-research and deep-review."
trigger_phrases:
  - "deep-context decision"
  - "context mode deprecation decision"
  - "research review context integration decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/038-deprecate-deep-context-integrate-capabilities"
    last_updated_at: "2026-07-04T13:24:26Z"
    last_updated_by: "opencode"
    recent_action: "Completed research synthesis"
    next_safe_action: "Implement /deep:context redirect stub"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-04-deep-context-deprecation-plan"
      parent_session_id: null
    completion_pct: 45
    open_questions: []
    answered_questions:
      - "Staged deprecation was selected over immediate deletion."
      - "Deep-research completed 10 iterations."
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Deprecate Standalone Deep Context

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Stage standalone context deprecation and migrate capabilities

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-04 |
| **Deciders** | User, OpenCode assistant |

---

<!-- ANCHOR:adr-001-context -->
### Context

The framework currently exposes `deep-context` as a standalone mode through the deep-loop registry, `/deep:context`, a native agent, a Claude mirror, command YAML assets, and a nested skill packet. The mode exists to produce reuse-first codebase context, but `deep-research` and `deep-review` already own the longer-lived investigation and audit workflows where that context is usually consumed.

### Constraints

- `deep-context` has active runtime and documentation references, so hard deletion risks broken command, agent, registry, and advisor behavior.
- Research/review replacement behavior must keep cited file pointers and gaps, not collapse into vague prose.
- Historical specs and archived artifacts should remain stable unless they feed active fixtures or indexes.
- Generated command contracts must be regenerated through the existing compiler when command docs are affected.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: staged deprecation of standalone `deep-context`, with useful context capabilities integrated into `deep-research` and `deep-review` before the old callable surfaces are removed.

**How it works**: First inventory and classify all active references. Then add context snapshot behavior to research/review, convert `/deep:context` to a fail-closed redirect, clean registry/advisor/docs/mirrors, and remove or archive the nested packet only after verification passes.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Stage deprecation and integrate capabilities** | Preserves user value, reduces public surface, lowers breakage risk | More steps and verification | 9/10 |
| Immediate hard delete | Fast cleanup, no long deprecation period | High chance of broken registry, docs, tests, and mirrors | 3/10 |
| Keep standalone context indefinitely | No migration work, preserves current command | Continues duplicate maintenance and routing confusion | 4/10 |
| Rebrand context as a private helper called by research/review | Might reuse old code directly | Keeps callable dependency and can hide old contract drift | 5/10 |

**Why this one**: Staging matches the current evidence: `context` is live in the registry and command assets, while research/review already have code graph capability and are better destinations for durable context artifacts.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Users get fewer overlapping deep-loop entrypoints and clearer routing.
- Research and review gain the useful reuse-first context discipline where planning and audit decisions already happen.
- Advisor and registry maintenance becomes simpler after `deep-context` stops being discoverable as its own mode.

**What it costs**:
- Implementation must touch commands, agents, nested skill docs, registry, advisor metadata, generated contracts, and public docs. Mitigation: execute the staged task list and verify each layer.
- Existing users of `/deep:context` must learn replacement paths. Mitigation: keep a deprecation redirect before deletion.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Replacement snapshots lose detail | High | Require reuse candidates, integration points, dependencies, gaps, and file:line evidence. |
| Registry cleanup breaks tests | Medium | Defer internal runtime loop-type removal if tests still require it. |
| Advisor graph remains stale | Medium | Refresh index/graph and run routing probes. |
| Mirror drift | Medium | Update canonical and mirror agent inventories together. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The registry and `/deep:context` still expose a standalone context mode while research/review already own adjacent workflows. |
| 2 | **Beyond Local Maxima?** | PASS | Compared staged deprecation, hard delete, indefinite retention, and private helper reuse. |
| 3 | **Sufficient?** | PASS | Keeps the minimal public goal: stop standalone use, preserve context value, verify routing. |
| 4 | **Fits Goal?** | PASS | Directly addresses user request to deprecate deep-context and integrate features into research/review. |
| 5 | **Open Horizons?** | PASS | Leaves internal runtime cleanup separable and avoids binding future loops to a context helper. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `/deep:context` moves from active router to deprecation redirect, then archive/delete after parity.
- `deep-research` and `deep-review` gain context snapshot contracts.
- `mode-registry.json`, advisor projection/index inputs, active docs, and mirrors stop exposing standalone context.
- Historical archived specs remain unchanged unless active fixture or index behavior requires regeneration.

**How to roll back**: Restore the previous command router, registry entry, advisor projections, and agent mirrors from git. Re-run advisor graph refresh and routing probes. If only internal runtime cleanup fails, restore runtime `context` support while keeping public deprecation intact.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
