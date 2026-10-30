---
title: "Implementation Summary"
description: "This packet is specified and not started: it records the composition rules, the preservation invariant, the allowlist and the criteria that will decide it."
trigger_phrases:
  - "agents md embed implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/003-embed-engine"
    last_updated_at: "2026-10-30T12:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the specification state; implementation has not started"
    next_safe_action: "Start with the failing suite once the check engine exists"
    blockers:
      - "Waits on /doctor:sk-skill (packet sk-doc/075-doctor-sk-skill-command) landing on main"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-embed-engine |
| **Completed** | Not started |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built. This packet holds the specification, the plan and the acceptance criteria for the only part of this command that writes, and no code has run against it.

### Phase 3: embed engine

When it is built, a repository can take the shipped template and keep every line it wrote: the composition carries its own sections, its edited shipped sections and the unique lines of a divergent `CLAUDE.md` into one marked block, the plan shows exactly what will change, and the post-write proof restores the backup if a single line would have been lost.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/agents-md-embed.cjs` | Planned create | `plan`, `apply`, `restore` and the preservation function |
| `.skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` | Planned create | The failing-first suite over temporary copies |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The baseline commands were captured on this worktree at `006d96370d` and are recorded in `spec.md` section 2; they are re-measured when implementation starts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The preservation check is a pure function with an exported name | A proof that needs a whole run to exercise is a proof nobody repeats |
| Adopt-and-carry is the default even when a three-way merge is clean | A merged section stays edited forever, so the next run has the same problem |
| The backup never goes inside a path the ignore check does not match | A backup in a tracked path becomes part of the diff it is supposed to undo |
| Apply refuses a digest mismatch | What is written must equal what the operator approved |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` | PENDING: suite does not exist yet |
| `node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan` | PENDING: script does not exist yet |
| Preservation on a fixture copy | NOT RUN: the ledger and the restore path are exercised once the engine exists |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A fork copied from a non-release commit classifies as `unknown-base`.** Its old template lines are carried into the block, which is noisy but never lossy, because only known shipped lines are dropped.
<!-- /ANCHOR:limitations -->

---
