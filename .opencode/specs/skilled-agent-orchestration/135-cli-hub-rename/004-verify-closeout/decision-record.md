---
title: "Decision Record: Treat Environment Failures as Blockers"
description: "Defines how closeout distinguishes passing targeted checks from stale-dist and unrelated graph failures."
trigger_phrases: ["verification blocker decision", "stale dist closeout"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-cli-hub-rename/004-verify-closeout"
    last_updated_at: "2026-07-13T06:08:29Z"
    last_updated_by: "claude-code"
    recent_action: "Authored and validated the phase spec docs"
    next_safe_action: "Orchestrator gate and commit"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Treat Environment Failures as Blockers
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- ANCHOR:adr-001 -->
## ADR-001: Do Not Convert Blocked Gates Into Passes or Product Failures
### Metadata
| Field | Value |
|---|---|
| Status | Accepted |
| Date | 2026-07-13 |
| Deciders | Repository maintainers |
<!-- ANCHOR:adr-001-context -->
### Context
Targeted rename checks pass, but three broader checks cannot complete because required compiled artifacts are stale or unrelated graph keys are missing. Rebuilding is explicitly forbidden in this task.

### Constraints
- Do not rebuild compiled distributions.
- Do not modify unrelated graph-owning skills.
- Do not claim full validation passed.
<!-- /ANCHOR:adr-001-context -->
<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: Mark the closeout phase active and each unexecutable gate blocked, while preserving all passing targeted evidence.

**How it works**: Checklists and summaries state PASS only for executed checks; blocked checks name the missing prerequisite and remain unchecked.
<!-- /ANCHOR:adr-001-decision -->
<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|---|---|---|---:|
| **Explicit blocked state** | Honest and actionable | Packet cannot close yet | 10/10 |
| Treat blocked as pass | Fast closeout | False completion claim | 0/10 |
| Treat blocked as rename failure | Conservative | Misattributes environment defects | 3/10 |
| Rebuild now | Could unblock checks | Violates explicit scope | 0/10 |

**Why this one**: It preserves the distinction between implementation evidence and environment readiness.
<!-- /ANCHOR:adr-001-alternatives -->
<!-- ANCHOR:adr-001-consequences -->
### Consequences
**What improves**: reviewers can trust every completion claim.

**What it costs**: the parent and phase 4 remain active until authorized repairs occur.

| Risk | Impact | Mitigation |
|---|---|---|
| Blocker forgotten | Medium | Record it in frontmatter, tasks, checklist, and summary |
<!-- /ANCHOR:adr-001-consequences -->
<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation
| Check | Result | Evidence |
|---|---|---|
| Necessary | PASS | Three gates are not executable |
| Alternatives explored | PASS | Four closeout policies compared |
| Sufficient | PASS | No out-of-scope repair attempted |
| Fits goal | PASS | Final docs remain honest |
| Open horizons | PASS | Blockers have clear rerun paths |
<!-- /ANCHOR:adr-001-five-checks -->
<!-- ANCHOR:adr-001-impl -->
### Implementation
- Record passing targeted checks verbatim.
- Mark executor-delegation, skill graph, and strict validation gates blocked.
- Resume only after authorized prerequisite repair.

**How to roll back**: restore prior documentation; no production code rollback is involved.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
