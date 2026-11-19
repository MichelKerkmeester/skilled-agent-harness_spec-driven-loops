---
title: "Decision Record: Phase 1: v1-runtime-code-and-tests"
description: "Decision records for phase 001: the acceptance criteria that a later decision superseded, with the reason and the replacement check."
trigger_phrases:
  - "v1 runtime code and tests decision record"
  - "keep global disposed branches"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/opencode-platform/002-opencode-v1-v2-dual-compat/070-opencode-v1-removal/001-v1-runtime-code-and-tests"
    last_updated_at: "2026-11-19T11:50:00Z"
    last_updated_by: "closure-run"
    recent_action: "Recorded ADR-001 (supersedes AC-007) and ADR-002 (event-capture ordering)"
    next_safe_action: "None for this phase; the decision closes with phase 001"
    blockers: []
    key_files:
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "closure-001-v1-runtime-code-and-tests"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: Phase 1: v1-runtime-code-and-tests

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep the global.disposed plugin branches

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-19 |
| **Deciders** | Operator, recorded at closure of this phase |

### Context

Acceptance criterion AC-007 expected that no `.disposed` string remained in the plugin folder, so that every `*.disposed` branch was gone. The 2.3.2 binary defines the bus event `global.disposed` beside the global connection stream, and the three plugin files that match on `.disposed` match on that exact name. The binary has no literal for `server.instance.disposed` or `app.disposed`, so those two branches are v1-only.

### Decision

Remove the `server.instance.disposed` and `app.disposed` branches. Keep the `global.disposed` branches in `system-dist-freshness-guard.js`, `system-skill-advisor.js` and `opencode-goal.js`, matched on that exact name.

AC-007 is superseded by this decision. Its zero-match check cannot hold, because `global.disposed` contains `.disposed`. The replacement check is `rg -n -F -e 'server.instance.disposed' -e 'app.disposed' .opencode/plugins/*.js | wc -l`, which prints `0`.

### Consequences

- The `global.disposed` branches stay on the strength of the binary definition. A live standalone capture on 2026-11-19 (`scratch/event-capture.txt`) did not see the event: shutdown arrived as `location.shutdown` plus the `dispose` hook. Each kept branch clears in-memory state only, which a standalone process drops on exit, so nothing leaks. The branch is kept for a shared server, where the event may arrive.
- A future OpenCode version that drops `global.disposed` needs this branch removed under the same rule.

### Alternatives Considered

| Option | Why not chosen |
|--------|----------------|
| Remove every `*.disposed` branch to meet AC-007 as written | Removes a branch that the 2.3.2 binary defines, with no evidence that the branch is dead |
| Keep all three `*.disposed` branches | Keeps `server.instance.disposed` and `app.disposed`, which have no literal in the 2.3.2 binary |
<!-- /ANCHOR:adr-001 -->

<!-- ANCHOR:adr-002 -->
## ADR-002: Waive the event-capture ordering check

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-19 |
| **Deciders** | Operator, approving the deep-review fix plan |

### Context

CHK-003 requires the event capture to be recorded before any plugin branch is removed. The first capture, a static scan of the binary, was written at 10:53:55, after three plugin files were last changed between 10:53:12 and 10:53:17. The live capture ran later the same day. Both records are correct, but the "before" condition cannot be met after the fact.

### Decision

CHK-003 is waived. Both captures stay as written, and no file is backdated.

### Consequences

- The removals rest on the binary scan, which found no literal for the removed events, and on the live capture, which saw neither removed disposal event.

### Alternatives Considered

| Option | Why not chosen |
|--------|----------------|
| Backdate the capture | Fabricates when the evidence was taken |
| Restore the removed branches and redo them in order | Brings back v1-only code to satisfy a timestamp |
<!-- /ANCHOR:adr-002 -->
