---
title: "Decision Record: cli-opencode permissions-matrix"
description: "ADRs for Phase B: schema shape + enforcer hook location."
trigger_phrases:
  - "permissions-matrix ADRs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/114-small-ai-model-optimization/003-structured-permissions-matrix"
    last_updated_at: "2026-05-18T14:15:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 003 decision-record"
    next_safe_action: "Author 003 implementation-summary"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000011"
      session_id: "114-003-decisions-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Decision Record: cli-opencode permissions-matrix

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Schema shape — flat rules[] array with most-specific-wins resolution

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-18 |
| **Deciders** | implementer + reviewer |

---

<!-- ANCHOR:adr-001-context -->
### Context

The permissions matrix needs a structure that's easy to author, easy to validate, and unambiguous at runtime. Options: nested per-operation (e.g. `{read: [...], write: [...]}`), flat rules with effect (allow/deny per rule), gitignore-style include/exclude semantics.

### Constraints

- Authors will write these by hand; readability matters
- Runtime resolution must be deterministic and fast
- Validator must reject ambiguous matrices
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Flat `rules[]` array; each rule has `target_glob`, `operation_class`, `scope`, `effect` (allow|deny), `rationale`. Resolution: most-specific glob wins. If two rules tie on specificity, the FIRST in array order wins (predictable + auditable).

**How it works**: Author writes a JSON file like `{"version": "1.0", "rules": [{...}, {...}]}`. Enforcer iterates rules at tool-call time, picks the most-specific match, applies its effect. Empty rules[] = default-deny.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Flat rules[] with most-specific-wins (chosen)** | Easy to author, deterministic, glob-friendly | Need clear most-specific tiebreaker | 8/10 |
| Nested per-operation `{read:[], write:[],...}` | Slightly easier mental model for some operations | Duplicates glob patterns across operations; harder to audit | 6/10 |
| Gitignore-style include/exclude | Familiar to many developers | Order-sensitive resolution can surprise; less explicit | 5/10 |

**Why this one**: Audit clarity. A reviewer reading the matrix sees `effect: allow` or `effect: deny` per rule without needing to mentally compute include/exclude precedence. The first-wins tiebreaker on equal specificity is the simplest deterministic rule.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Matrices are diff-friendly (each rule is a JSON object; changes are local)
- Validator can reject ambiguous matrices (e.g. duplicate globs with conflicting effects + same specificity)
- Audit log can cite the exact rule that fired

**What it costs**:

- "Most-specific glob wins" tiebreaker requires a stable specificity metric. Cost: define a glob-specificity comparator (longer literal prefix beats shorter; explicit beats wildcard). Documented in the reference doc.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Glob specificity comparator has edge cases | Medium | Unit tests cover symbolic edge cases |
| Author confusion on tiebreaker | Low | Reference doc explains with 3 examples |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without a schema shape, every matrix is bespoke |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives compared |
| 3 | **Sufficient?** | PASS | Flat structure covers all 3 example matrices |
| 4 | **Fits Goal?** | PASS | Author-friendly + audit-clear matches the operator need |
| 5 | **Open Horizons?** | PASS | Schema versioning (`version: "1.0"`) leaves room for future shape evolution |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:

- `permissions-matrix.schema.json` defines the flat rules[] structure with required fields
- `permissions-gate.ts` implements the resolver with most-specific-wins tiebreaker
- Reference doc explains specificity metric with 3 worked examples

**How to roll back**: Delete the schema; existing dispatches fall back to the four-layer prose mitigation (still supported during transition).
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
