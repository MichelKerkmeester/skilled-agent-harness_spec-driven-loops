---
title: "Decision Record: sk-code and code README audit scope"
description: "Architecture decision for packet 026 audit boundaries, README generation, and source finding deferral."
trigger_phrases:
  - "026 sk-code audit"
  - "code README coverage"
importance_tier: "high"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/026-sk-code-readme-audit"
    last_updated_at: "2026-05-15T11:40:19Z"
    last_updated_by: "codex"
    recent_action: "Decision record aligned to ADR manifest anchors"
    next_safe_action: "Run validation, commit, and push"
    blockers: []
    key_files:
      - "audit-report.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0260000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-sk-code-readme-audit"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Decision Record: sk-code and code README audit scope

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Audit first-party code folders and defer broad source normalization

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-15 |
| **Deciders** | Codex, operator directive |

---

<!-- ANCHOR:adr-001-context -->
### Context

The dispatch asked for sk-code convention compliance and code README coverage across 19 skills. A literal all-code scan includes vendored virtualenv packages, generated outputs, databases, data folders, and fixture paths, while the directive explicitly forbids fixture edits and broad refactors.

### Constraints

- Stay on main and avoid branch creation.
- Do not edit packets 001 through 025.
- Do not edit fixtures or unrelated dirty files.
- Do not rename tool IDs, server IDs, or skill IDs.
- Keep source fixes below the 10 LOC per violation threshold, and defer larger clusters.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Audit first-party code-bearing folders, create missing code READMEs, and defer broad source convention clusters as named follow-on packets.

**How it works**: The audit includes direct code-bearing folders under source, scripts, hooks, MCP server, tests, stress tests, shared, bin, schemas, tools, handlers, plugin bridges, and executable asset-script areas. It excludes vendored, generated, database, data, scratch, and fixture folders from coverage math.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **First-party README sweep plus deferred source clusters** | Clears coverage target with a scoped commit | Leaves source convention debt visible but unresolved | 9/10 |
| Audit every directory with code | Maximizes literal coverage | Includes third-party and fixture paths that should not be edited | 4/10 |
| Patch all header and type findings inline | Reduces source drift immediately | Crosses many package and test surfaces, with heavy verification cost | 5/10 |

**Why this one**: It satisfies the README coverage mandate and records source debt without violating fixture, dirty-worktree, or major-refactor constraints.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Code README compliance rises to 97.4% across the audited first-party scope.
- Maintainers get a matrix of sk-code findings and named follow-on packets.

**What it costs**:
- Source convention drift remains until packets 027 through 030 execute. Mitigation: audit-report.md lists grouped counts and reasons.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Existing noncompliant READMEs stay untouched | Low | Coverage remains above target, and future packet can refresh them. |
| Source findings become stale | Medium | Follow-on packet names and categories are recorded in audit-report.md. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Missing README coverage existed before this dispatch. |
| 2 | **Beyond Local Maxima?** | PASS | Three scope options were compared. |
| 3 | **Sufficient?** | PASS | Missing READMEs clear the target without source churn. |
| 4 | **Fits Goal?** | PASS | Directly addresses the operator's coverage audit. |
| 5 | **Open Horizons?** | PASS | Follow-on packets preserve a path for source normalization. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Create packet 026 docs and audit report.
- Create 47 missing README.md files in first-party code-bearing folders.
- Record deferred sk-code source clusters.

**How to roll back**: Revert the scoped commit for packet 026. No runtime state, database, or config migration is involved.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
