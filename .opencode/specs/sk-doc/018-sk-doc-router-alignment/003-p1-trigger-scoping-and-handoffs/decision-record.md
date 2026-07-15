---
title: "Decision Record: Trigger Specificity and Handoffs"
description: "Records why artifact-specific nouns select packets while broad domain, syntax, and schema tokens defer."
trigger_phrases: ["trigger specificity decision", "sibling handoff decision"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-sk-doc-router-alignment/003-p1-trigger-scoping-and-handoffs"
    last_updated_at: "2026-07-13T06:25:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored and validated the phase spec docs"
    next_safe_action: "Orchestrator gate and commit"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Trigger Specificity and Handoffs
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Require Artifact-Specific Selection Evidence
### Metadata
| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-13 |
| Decider | Operator brief |

<!-- ANCHOR:adr-001-context -->
### Context
Bare benchmark, generic documentation, command suffixes, and hub-schema terms do not identify the artifact a user wants. They created broad or accidental child-mode ownership.

### Constraints
- Workstream-A benchmark families must remain routable.
- Schema and mode terms remain valid inside workflow instructions.
- Excluded artifact types need executable sibling handoffs.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: retain artifact/family phrases as positive selectors, remove broad domain/syntax/schema selectors, and require exact sibling ids in every handoff list.

**How it works**: Generic prompts defer under the null default; family-specific and artifact-specific prompts still gain an alias-class match in addition to any shared action verb.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---|
| Specific phrases plus defer | Predictable and safe | Some broad prompts need clarification | 9/10 |
| Broad vocabulary plus tie-break | Fewer deferrals | Arbitrary child selection | 3/10 |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences
**What improves**: Ambiguous prompts defer and sibling ownership is explicit.

**What it costs**: The router asks for artifact intent on broad requests. Mitigation: preserve clear nouns such as `readme`, `flowchart`, and all benchmark-family phrases.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation
Necessary: PASS. Alternatives explored: PASS. Minimal vocabulary change: PASS. Fits frozen goal: PASS. Supports new families: PASS.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation
Narrow trigger lines, remove per-mode hub identity classes, and normalize ten handoff lists. Rollback restores only affected trigger/class/handoff entries.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
