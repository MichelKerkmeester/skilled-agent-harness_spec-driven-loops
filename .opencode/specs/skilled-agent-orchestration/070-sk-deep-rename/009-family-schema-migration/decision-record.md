---
title: "Decision Record: Phase 009 Family Schema Migration"
description: "ADR-001 documents the schema migration approach that makes deep-loop the accepted internal family value."
trigger_phrases:
  - "070 phase 009 adr"
  - "deep-loop schema migration decision"
  - "skill graph check constraint adr"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/070-sk-deep-rename/009-family-schema-migration"
    last_updated_at: "2026-05-05T18:25:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Recorded ADR-001 for deep-loop schema migration"
    next_safe_action: "Execute schema migration and SQLite reset"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-009"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 009 Family Schema Migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Schema Migration to Support deep-loop Family

| Field | Value |
|-------|-------|
| **Status** | ACCEPTED |
| **Date** | 2026-05-05 |
| **Decision Owner** | cli-codex |
| **Scope** | Skill graph family schema, type/schema mirrors, compiled graph source, and SQLite reset |

### Context
The previous reversion to `sk-deep` in Phase 008 ADR-001 cited the SQL `CHECK` constraint as a blocker. That constraint lives in the SQLite skill graph schema and rejects `deep-loop` at insert time even when JSON metadata and compiler source have been renamed.

### Decision
Accept `deep-loop` as the internal family identity. This packet does the schema migration by updating the SQL `CHECK` constraint in the TypeScript source and dist mirror, updating all active type/schema family mirrors, removing the existing SQLite database so it recreates with the new schema, and re-applying the rename in graph metadata and compiler validation.

### Rationale
Internal family identity should match the autonomous-loop nature of `deep-review` and `deep-research`. Supporting both `sk-deep` and `deep-loop` would preserve an obsolete name and hide migration drift. Updating the schema and deleting the stale database makes the constraint change explicit and testable.

### Consequences
- `deep-loop` becomes the only accepted family value for autonomous loop skills.
- The next orchestrator-owned advisor rebuild must recreate `skill-graph.sqlite` from the updated schema.
- Any missed source or dist enum mirror will surface through TypeScript/build, compiler, or grep verification.
<!-- /ANCHOR:adr-001 -->
