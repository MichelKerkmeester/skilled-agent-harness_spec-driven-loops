---
title: "Decision Record: Update Live References Without Rewriting History"
description: "Limits the reference sweep to active contract surfaces while preserving historical evidence."
trigger_phrases: ["reference sweep decision", "live references historical evidence"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-cli-hub-rename/003-reference-sweep"
    last_updated_at: "2026-07-13T06:08:29Z"
    last_updated_by: "claude-code"
    recent_action: "Authored and validated the phase spec docs"
    next_safe_action: "Orchestrator gate and commit"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Update Live References Without Rewriting History
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- ANCHOR:adr-001 -->
## ADR-001: Repoint Active Consumers and Preserve Historical Records
### Metadata
| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-13 |
| Deciders | Repository maintainers |
<!-- ANCHOR:adr-001-context -->
### Context
Current router, skill, and prompt-quality surfaces must use the new hub name. Historical records may legitimately describe the old state and should not be rewritten as if it never existed.

### Constraints
- Active instructions must resolve to existing paths.
- Historical evidence must remain trustworthy.
<!-- /ANCHOR:adr-001-context -->
<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: Update live references only, while retaining historical context that is not executable or directive.

**How it works**: Search results are classified as live consumers or historical evidence before editing; prompt-quality-card synchronization verifies the active projection.
<!-- /ANCHOR:adr-001-decision -->
<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---:|
| **Live-only sweep** | Accurate current contract and honest history | Requires classification | 9/10 |
| Replace every occurrence | Simple rule | Corrupts historical evidence | 3/10 |
| Keep compatibility references | Lower immediate churn | Leaves stale active paths | 2/10 |

**Why this one**: It fixes current behavior without falsifying past evidence.
<!-- /ANCHOR:adr-001-alternatives -->
<!-- ANCHOR:adr-001-consequences -->
### Consequences
**What improves**: active references and generated prompt data agree.

**What it costs**: future searches must distinguish retained history from live instructions.

| Risk | Impact | Mitigation |
|---|---|---|
| Historical match mistaken for stale live reference | Medium | Classify by execution role and document the distinction |
<!-- /ANCHOR:adr-001-consequences -->
<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation
| Check | Result | Evidence |
|---|---|---|
| Necessary | PASS | Live refs needed a valid hub path |
| Alternatives explored | PASS | Three sweep policies compared |
| Sufficient | PASS | No compatibility alias added |
| Fits goal | PASS | Prompt-quality-card sync PASS |
| Open horizons | PASS | History remains auditable |
<!-- /ANCHOR:adr-001-five-checks -->
<!-- ANCHOR:adr-001-impl -->
### Implementation
- Repoint live references to `cli-external-orchestration`.
- Keep executor-specific `cli-opencode` references where semantically correct.
- Verify prompt-quality-card synchronization.

**How to roll back**: restore the changed live references from the rename diff.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
