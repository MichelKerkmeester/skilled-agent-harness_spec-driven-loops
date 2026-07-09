---
title: "Decision Record: Per-Topic Multi-Round Orchestration"
description: "Scaffold for Per-Topic Multi-Round Orchestration."
trigger_phrases:
  - "129 003 per-topic multi-round orchestration"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/002-deep-ai-council/010-iterative-per-topic-multi-round"
    last_updated_at: "2026-05-23T07:53:20Z"
    last_updated_by: "codex"
    recent_action: "orchestrate-topic + orchestrate-session authored, 5 tests PASS"
    next_safe_action: "dispatch F3 -- 129/004 multi-topic session + registry"
    blockers: []
    key_files:
      - ".opencode/skills/deep-ai-council/scripts/orchestrate-topic.cjs"
      - ".opencode/skills/deep-ai-council/scripts/orchestrate-session.cjs"
    session_dedup:
      fingerprint: "sha256:1290160000000000000000000000000000000000000000000000000000000006"
      session_id: "wave-5-e1-2026-05-23"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Per-Topic Multi-Round Orchestration

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Consume F1 Primitives From Council Scripts

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-23 |
| **Deciders** | Phase implementer |

<!-- ANCHOR:adr-001-context -->
### Context

Phase 001 ADRs define the architecture. F1 placed shared primitives in `deep-loop-runtime/lib/council/`, while this phase owns council-specific orchestration under `deep-ai-council/scripts/`.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

Implement `orchestrate-topic.cjs` as the topic-local loop and `orchestrate-session.cjs` as the session wrapper. Both scripts consume F1 primitives directly and keep executor calls injectable for deterministic tests and future CLI dispatch wiring.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Direct primitive consumption | Minimal adapter code; matches ADR-001 boundary | Requires orchestration-specific tests here | 9/10 |
| Add another runtime layer | Centralizes more logic | Reopens ADR-001 and duplicates F1 surface | 4/10 |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

The council skill now owns the per-topic and session loop contracts without modifying F1 runtime primitives. F3 can build the findings registry and broader multi-topic session command on top of these exports.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

| Check | Result |
|-------|--------|
| Simplicity | Pass - two focused scripts consume existing primitives. |
| Scope | Pass - no changes outside allowed files and packet docs. |
| Maintainability | Pass - executor/adjudicator boundaries are injected. |
| Testability | Pass - 5 Vitest scenarios cover topic and session stops. |
| Reversibility | Pass - new files can be removed without changing F1. |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation

Implemented in `.opencode/skills/deep-ai-council/scripts/orchestrate-topic.cjs` and `.opencode/skills/deep-ai-council/scripts/orchestrate-session.cjs`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
