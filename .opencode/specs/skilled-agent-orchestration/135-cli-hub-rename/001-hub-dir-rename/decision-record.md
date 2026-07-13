---
title: "Decision Record: History-Preserving CLI Hub Rename"
description: "Chooses a direct git move to establish cli-external-orchestration without duplicating the hub."
trigger_phrases: ["cli hub rename decision", "cli-external-orchestration git mv"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-cli-hub-rename/001-hub-dir-rename"
    last_updated_at: "2026-07-13T06:08:29Z"
    last_updated_by: "claude-code"
    recent_action: "Authored and validated the phase spec docs"
    next_safe_action: "Orchestrator gate and commit"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: History-Preserving CLI Hub Rename
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

<!-- ANCHOR:adr-001 -->
## ADR-001: Move the Existing Hub Instead of Copying It
### Metadata
| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-13 |
| Deciders | Repository maintainers |

<!-- ANCHOR:adr-001-context -->
### Context
The external CLI hub needed the canonical name `cli-external-orchestration`. A copy-and-delete sequence would obscure history and could leave two competing router identities.

### Constraints
- Preserve repository history.
- Keep nested executor packets intact.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: Rename the hub directory with `git mv`.

**How it works**: The existing hub becomes `.opencode/skills/cli-external-orchestration/`; consumer alignment is handled in later phases.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---:|
| **Direct `git mv`** | Preserves identity and history | Requires a consumer sweep | 9/10 |
| Copy then remove | Simple filesystem operation | Splits history and risks duplicate hubs | 3/10 |
| Compatibility alias | Reduces immediate churn | Keeps the old contract alive | 4/10 |

**Why this one**: A direct move is the smallest change that establishes one canonical hub.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences
**What improves**: one hub identity and preserved history.

**What it costs**: every live consumer must point to the new path.

| Risk | Impact | Mitigation |
|---|---|---|
| Missed consumer | High | Dedicated advisor and reference phases |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation
| Check | Result | Evidence |
|---|---|---|
| Necessary | PASS | Canonical hub name was required |
| Alternatives explored | PASS | Three options compared |
| Sufficient | PASS | No compatibility layer added |
| Fits goal | PASS | Establishes the target identity |
| Open horizons | PASS | Nested executors remain extensible |
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation
- Move the existing hub with `git mv`.
- Repoint consumers in phases 2 and 3.

**How to roll back**: reverse the move and restore consumer references from the same diff.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
