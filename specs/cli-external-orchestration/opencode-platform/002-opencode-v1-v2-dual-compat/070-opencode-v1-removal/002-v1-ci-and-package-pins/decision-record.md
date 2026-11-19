---
title: "Decision Record: Phase 2: v1-ci-and-package-pins"
description: "Decision records for phase 002: an ordering check whose before-edit condition was missed."
trigger_phrases:
  - "v1 ci and package pins decision record"
  - "sdk record ordering waiver"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/002-v1-ci-and-package-pins"
    last_updated_at: "2026-11-19T18:00:00Z"
    last_updated_by: "review-fix-run"
    recent_action: "Recorded ADR-001 (SDK record ordering) after the deep review"
    next_safe_action: "None for this phase; the decision closes with phase 002"
    blockers: []
    key_files:
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "review-fix-002-v1-ci-and-package-pins"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Phase 2: v1-ci-and-package-pins

<!-- ANCHOR:adr-001 -->
## ADR-001: Waive the SDK record ordering check

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-19 |
| **Deciders** | Operator, approving the deep-review fix plan |

### Context

CHK-003 requires the SDK-usage and `variant` records to exist before the manifests or `opencode.json` change. The manifests were edited at 10:28:36 and `scratch/sdk-usage.txt` was written at 10:29:25, 49 seconds later. The record is correct: no runtime file imports `@opencode-ai/plugin`, and `variant` is read by `context-usage.cjs`. Only the "before" condition is missed.

### Decision

CHK-003 is waived. The records stay as written, and no file is backdated.

### Consequences

- The removal rests on a record that is correct but was written after the change it justifies. Any file that imported the SDK would have failed the package tests, which pass.

### Alternatives Considered

| Option | Why not chosen |
|--------|----------------|
| Backdate the record | Fabricates when the evidence was taken |
| Revert the manifests and redo them in order | Repeats a verified change to satisfy a timestamp |
<!-- /ANCHOR:adr-001 -->
