---
title: "Implementation Plan: Phase 2: architecture-decision [template:level_1/plan.md]"
description: "Synthesize the 001 corpus research, confirm each call against the operator's locked decisions, and record the umbrella-router + 5-core-children architecture as this phase's binding deliverable."
trigger_phrases:
  - "sk-design architecture plan"
  - "umbrella router plan"
  - "design decision approach"
  - "sk-design migration order"
  - "design parent plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/002-architecture-decision"
    last_updated_at: "2026-06-25T12:41:14Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the decision approach and umbrella architecture"
    next_safe_action: "Hand off to 003-scaffold-parent to scaffold the umbrella skill and registry"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "../001-corpus-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "design/008-sk-design-parent/002-architecture-decision"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Foundations grain (color/layout split) deferred to 005"
      - "Optional sk-design-output child revisit deferred"
    answered_questions:
      - "Structural model: umbrella-router over a sibling family"
      - "Taxonomy: 5 core children, output deferred"
      - "Naming/compat: keep flat sk-design-* names, preserve legacy triggers"
      - "Migration order: 003 scaffold, 004 onboard, 005 build, 006 integrate"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: architecture-decision

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (spec-kit documentation); no code in this phase |
| **Framework** | system-spec-kit Level 1 |
| **Storage** | None (decision recorded as spec-folder docs) |
| **Testing** | `validate.sh --strict` on this spec folder |

### Overview
This phase synthesizes the consolidated 4-model research in `../001-corpus-research/research/research.md`, confirms each finding against the operator's locked decisions, and records the resulting architecture. The technical approach is documentation-only: there is no build, just the binding decision (umbrella-router structural model, 5 core children, flat-name compat, 003-006 migration order) that the downstream phases consume.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Umbrella-router over a sibling family. `sk-design` is a thin umbrella/router skill; the design sub-skills remain independent top-level skills the advisor routes to directly (NOT a single hub that co-loads a broad design blob). Hub-style structure (a once-per-session setup loading a shared base + register, à la `impeccable`) is used ONLY inside the `sk-design-interface` child.

### Key Components
- **`sk-design` (umbrella/router)**: thin parent that routes generic design entry to the right child; does not co-load child runtimes.
- **`sk-design-interface`**: flagship; distinctive interface direction and build; hub-style internal structure; keeps its name.
- **`sk-design-spec`**: DESIGN.md extract (the md-generator Playwright backend) plus author; folds `sk-design-md-generator`, keeping that name as an alias.
- **`sk-design-foundations`**: static visual system (OKLCH color, type, layout, tokens); new.
- **`sk-design-motion`**: animation, micro-interactions, transitions; new.
- **`sk-design-audit`**: cross-cutting a11y/perf/critique/harden with a P0-P3 + 5-dimension `/20` contract; new.
- **Deferred `sk-design-output`**: its sources become a references library under the interface child for v1.

### Data Flow
A design request is matched by the advisor to a specific child trigger (or, for generic entry, routed via the umbrella to interface). Each child runs independently; cross-domain needs are delegated child-to-child (interface delegates token math to foundations, motion to motion, review to audit, artifact capture to spec). Because the children keep flat `sk-design-*` names, existing references (mcp-open-design, mcp-figma, sk-code, CLAUDE.md gates) keep resolving with zero rewrites.

The rejected alternative is a single hub with nested mode packets (kimi27's dissent, on single-advisor-identity grounds). It was rejected because the family's runtimes are heterogeneous (a hub would co-load the Playwright backend on every request), the children are independently invokable, and nesting would break the flat-name references. It is deferred, not deleted: if future advisor/usage telemetry shows mostly-generic entry, the call can be revisited.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not applicable (no bug fix; this is a decision phase). This phase records an architecture decision and does not modify code, security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy. The producer/consumer inventory belongs to the build phases (004-006), where the flat-name compat policy is exercised against the actual references.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the consolidated synthesis in `../001-corpus-research/research/research.md`
- [x] Confirm the operator's locked calls against the research recommendation
- [x] Confirm this is a documentation-only decision phase (no build)

### Phase 2: Core Implementation
- [x] Record the structural model (umbrella-router) with rationale and the rejected hub alternative
- [x] Record the taxonomy (5 core children, output deferred)
- [x] Record the naming/backward-compat policy and the migration order

### Phase 3: Verification
- [x] Confirm no unresolved either/or remains in the documented decision
- [x] Confirm consequences and deferred open questions are recorded
- [x] Documentation updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Not applicable (no code) | n/a |
| Integration | Not applicable (no code) | n/a |
| Manual | Decision completeness review: all four calls recorded, no either/or remaining, consequences + rejected alternative captured | Read-through against the 001 research |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../001-corpus-research/research/research.md` | Internal | Green | Without the synthesis there is no recommendation to bind |
| Operator lock of the four decisions | Internal | Green | Without the lock the decision cannot be recorded as binding |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New evidence (notably advisor/usage telemetry favoring a single-hub identity) or a downstream build phase surfacing a structural blocker.
- **Procedure**: The decision is reversible by amending this phase. Update spec.md/plan.md here to record the revised call (for example, flip to the documented hub alternative), then re-derive the affected downstream phases. No code rollback is needed because this phase ships only documentation.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
