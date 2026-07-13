---
title: "Decision Record: Registry Synchronization Method"
description: "Records the hand-sync method used because no scoped sk-doc router generator exists."
trigger_phrases: ["registry synchronization decision", "router hand sync"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/004-p2-standardization-and-regen"
    last_updated_at: "2026-07-13T06:25:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored and validated the phase spec docs"
    next_safe_action: "Orchestrator gate and commit"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Registry Synchronization Method
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Hand-Sync and Prove Zero Drift
### Metadata
| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-13 |
| Decider | Scoped evidence |

<!-- ANCHOR:adr-001-context -->
### Context
Searches across sk-doc and system-skill-advisor found no generator that projects packet trigger lines into sk-doc's registry and router. Adding a generator would require writes outside the allowed paths.

### Constraints
- Both JSON files must match packet source exactly.
- The multiplexed create-skill packet needs a declared split.
- Workstream-A benchmark vocabulary must survive.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: hand-edit both JSON files and run a deterministic extractor that compares every projected array to the packet source.

**How it works**: Parse one trigger line per packet, drop slash-command ids, split parent-hub phrases into `create-skill-parent`, and compare registry aliases plus router class keywords.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---|
| Hand-sync plus drift proof | In scope and deterministic | Manual JSON edit | 9/10 |
| Add generator | Better long-term automation | Outside allowed paths and frozen scope | 6/10 |
| Leave registry unchanged | No edit cost | Preserves three-way drift | 1/10 |
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences
**What improves**: Current source and both runtime projections are identical with measured zero drift.

**What it costs**: Future edits still need the extractor or a later generator. Mitigation: hub contract now states the authority boundary.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation
Necessary: PASS. Alternatives explored: PASS. Simplest in-scope method: PASS. Fits goal: PASS. Leaves a clear automation seam: PASS.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation
Synchronize both JSON files, parse them, run drift extraction, and replay six queries. Rollback restores prior arrays and score classes.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
