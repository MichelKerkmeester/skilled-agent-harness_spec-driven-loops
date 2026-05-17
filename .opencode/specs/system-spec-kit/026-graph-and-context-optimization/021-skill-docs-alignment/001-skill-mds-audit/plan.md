---
title: "Plan: 021/001 skill mds audit"
description: "Phases for the Explore-agent-driven skill docs sweep"
trigger_phrases: ["021/001 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/021-skill-docs-alignment/001-skill-mds-audit"
    last_updated_at: "2026-05-17T20:40:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored audit phases"
    next_safe_action: "Dispatch Explore agent"
    blockers: []
    key_files:
      - "evidence/skill-docs-audit.csv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000021001"
      session_id: "021-001-skill-mds-audit-plan"
      parent_session_id: "021-001-skill-mds-audit"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 021/001 skill mds audit

<!-- ANCHOR:summary -->
## 1. SUMMARY

Explore agent sweeps `.opencode/skills/*/{SKILL.md,README.md,references/**,assets/**}` for stale embedder/architecture refs. Output: `evidence/skill-docs-audit.csv` + `evidence/audit-summary.md`. P0/P1 fixes shipped inline; P2/P3 logged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Coverage | All skills under `.opencode/skills/` audited |
| CSV schema | path:line, current_text, recommended_fix, severity |
| P0/P1 fixes | Inline; not deferred |
| Strict-validate | PASSED |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
Explore agent (Sonnet)
  ↓ scans .opencode/skills/*/{SKILL,README,references,assets}
  ↓ classifies refs (P0/P1/P2/P3)
  ↓ writes audit.csv + summary.md
  ↓ inline fixes for P0/P1
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Dispatch Explore agent
- Scoped prompt with allowlist + severity rubric
- Background execution

### Phase 2: Review agent output
- Verify CSV schema
- Spot-check 3-5 high-severity findings

### Phase 3: Apply P0/P1 fixes
- Direct edits in same packet (one commit per skill if blast radius wide)

### Phase 4: Strict-validate + commit
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Spot-check: 3-5 high-severity findings hand-verified against the cited source
- After P0/P1 fixes: re-grep for the original stale strings; expect 0 hits in the audited surface
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Explore agent
- 016-019 current-state knowledge (embedded in dispatch prompt)
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

| Trigger | Action |
|---|---|
| Audit surfaces > 50 P0 findings | Halt; manual triage; widen-fix scope to its own packet |
| Inline fixes break a skill's own validation | Revert; file as P1 backlog with fix-recommendation |
<!-- /ANCHOR:rollback -->
