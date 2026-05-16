---
title: "Decision Record: Phase 007 Deep Review Remediation"
description: "Deferral decisions for Packet 070 deep review findings P1-003 and P1-004."
trigger_phrases:
  - "070 phase 007 decision record"
  - "P1-003 deferral"
  - "P1-004 deferral"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/070-sk-deep-rename/007-deep-review-remediation"
    last_updated_at: "2026-05-05T17:10:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Recorded approved P1 deferrals"
    next_safe_action: "Run remediation verification"
    blockers: []
    key_files:
      - "decision-record.md"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json"
      - ".opencode/skills/sk-code/graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 007 Deep Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/070-sk-deep-rename/007-deep-review-remediation` |
| **Date** | 2026-05-05 |
| **Status** | Accepted |
| **Scope** | P1-003 and P1-004 deferral decisions |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:decisions -->
## Decisions

### ADR-001: Defer P1-003 `sk-deep` Family ID Cleanup

**Decision**: DEFERRED.

The `sk-deep` family in `skill-graph.json` is an internal grouping name, not a user-facing skill ID. The two exposed skill IDs are correctly named `deep-review` and `deep-research` without the `sk-` prefix.

The family bucket name is a structural label that groups those skills. Renaming it to `deep` or `deep-loop` would require a separate refactor packet because it touches schema, compiler, validation, and generated graph surfaces. Leaving it as-is is acceptable for Phase 007 because it does not reintroduce user-facing old skill IDs.

**Future cleanup**: Create a dedicated graph-family refactor packet if the internal family taxonomy needs to drop the `sk-` prefix.

### ADR-002: Defer P1-004 `sk-code` Reference Category Validation

**Decision**: DEFERRED.

The `reference-category` entity kind issue is pre-existing in `.opencode/skills/sk-code/graph-metadata.json:201` and was not introduced by Packet 070. The strict advisor validator rejects that entity kind because it is not in the current allow-list.

Fixing it requires either extending the allow-list or changing the entity kind in `sk-code` metadata. Both options are outside Packet 070's rename remediation scope and should be handled as their own metadata-contract change.

**Future cleanup**: Open a separate `sk-code` metadata validation packet to decide whether `reference-category` is a valid entity kind or should be normalized to an allowed kind.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:impact -->
## Impact

These deferrals leave no active P0 blocker in Phase 007. P1-003 remains an internal naming consistency task, and P1-004 remains an unrelated metadata validation task.
<!-- /ANCHOR:impact -->
