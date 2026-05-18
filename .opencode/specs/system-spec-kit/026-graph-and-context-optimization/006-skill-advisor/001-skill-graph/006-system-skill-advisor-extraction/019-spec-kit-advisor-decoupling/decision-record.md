---
title: "Decision Record: Full spec-kit advisor import decoupling [template:level_3/decision-record.md]"
description: "Architectural decisions for isolating system-spec-kit from system-skill-advisor source imports."
trigger_phrases:
  - "019 decision record"
  - "advisor decoupling ADR"
  - "spec-kit advisor import boundary"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-extraction/019-spec-kit-advisor-decoupling"
    last_updated_at: "2026-05-15T09:20:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded import-isolation architecture decisions."
    next_safe_action: "Keep future advisor behavior inside advisor package or process boundaries."
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Plugin bridge remains because it is process-boundary, not source coupling."
---
# Decision Record: Full Spec-Kit Advisor Import Decoupling

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Advisor source belongs to advisor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-15 |
| **Deciders** | Operator, Codex |

---

<!-- ANCHOR:adr-001-context -->
### Context

`system-spec-kit/mcp_server` still imported advisor hook, schema, and test support code after the advisor extraction. That kept the packages coupled in-process and contradicted the narrowed operator directive for zero advisor source imports from spec-kit MCP code.

### Constraints

- The existing runtime hook paths had to keep working.
- Tool IDs, server IDs, and skill IDs could not be renamed.
- The plugin bridge could remain only if it stayed a process boundary.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: move advisor-owned hooks, tests, and stress coverage into `system-skill-advisor`, while leaving spec-kit with local utilities and executable stubs only.

**How it works**: Advisor hook implementations now live under `system-skill-advisor/hooks`. Spec-kit hook paths execute compiled advisor hooks as child processes for compatibility. Spec-kit schema and utility code no longer imports advisor source.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Move advisor-owned code to advisor | Enforces ownership and satisfies zero-import audit | Requires moving tests and updating fixtures | 9/10 |
| Keep neutral seams in spec-kit | Smaller diff | Still preserves in-process coupling | 3/10 |
| Rename tool/server IDs | Could make the split more explicit | Forbidden by operator scope | 0/10 |

**Why this one**: It satisfies the import boundary without changing public IDs or runtime command surfaces.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Spec-kit no longer owns advisor implementation tests.
- Import audits can detect future boundary regressions directly.
- Advisor vitest now carries the moved advisor behavior.

**What it costs**:
- Some runtime compatibility remains as process stubs. Mitigation: keep those stubs thin and covered by hook smoke.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future spec-kit code imports advisor internals again | High | Keep `rg 'from.*system-skill-advisor' .opencode/skills/system-spec-kit/mcp_server` as a release gate |
| Moved tests keep old packet paths | Medium | Fixed lane-weight-sweep paths to current packets |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operator explicitly required full import isolation |
| 2 | **Beyond Local Maxima?** | PASS | Compared source moves, neutral seams, and ID rename options |
| 3 | **Sufficient?** | PASS | Exact import audit returns zero |
| 4 | **Fits Goal?** | PASS | Scope is limited to 019 decoupling |
| 5 | **Open Horizons?** | PASS | Advisor can evolve independently after the split |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `system-skill-advisor/hooks` owns the advisor prompt hook logic.
- `system-skill-advisor/mcp_server/tests` and `stress_test` own advisor behavior coverage.
- `system-spec-kit/mcp_server/hooks` contains executable stubs only.
- Spec-kit schemas and local utilities no longer import advisor modules.

**How to roll back**: Revert the 019 commit as a unit. Do not reintroduce in-process advisor imports piecemeal.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
