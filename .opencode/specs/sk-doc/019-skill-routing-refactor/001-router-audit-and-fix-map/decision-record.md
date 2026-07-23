---
title: "Decision Record: Router Alignment Audit"
description: "Records source authority, generator discovery, and measurement decisions for the audit phase."
trigger_phrases: ["router audit decisions", "registry source authority"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/001-router-audit-and-fix-map"
    last_updated_at: "2026-07-13T06:25:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored and validated the phase spec docs"
    next_safe_action: "Orchestrator gate and commit"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Router Alignment Audit
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Treat Packet Trigger Lines as Authoring Source
### Metadata
| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-13 |
| Decider | Operator brief |

<!-- ANCHOR:adr-001-context -->
### Context
The user requires packet `SKILL.md` files to be source of truth and the JSON routers to be regenerated projections. The hub previously described the registry as the sole source, while packet trigger lines were inconsistent.

### Constraints
- Runtime classification still consumes the JSON files.
- `create-skill` and `create-skill-parent` share one packet source and require a deterministic split.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: one `Keyword triggers:` line in each packet as the authoring source, with parent-hub phrases projected to `create-skill-parent` and remaining phrases projected to `create-skill`.

**How it works**: Extract backticked phrases, omit bound command ids from aliases, split the multiplexed skill packet by parent-hub phrase set, and compare both JSON projections byte-for-byte by array value.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---|
| Packet trigger source | Matches brief and removes hidden drift | Requires explicit multiplex split | 9/10 |
| Registry-only source | Matches old hub prose | Contradicts brief and leaves packet drift | 3/10 |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences
**What improves**: Trigger ownership is reviewable at the packet boundary and measurable against both runtime projections.

**What it costs**: Hand synchronization remains necessary until a generator exists. Mitigation: deterministic Node drift extraction.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation
Necessary: PASS. Alternatives explored: PASS. Simplest scoped approach: PASS. Fits frozen goal: PASS. Supports future generator: PASS.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation
Update the hub authority sentence, normalize packet trigger lines, synchronize the two JSON files, and run the extractor. Rollback restores the old trigger arrays and hub sentence.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
