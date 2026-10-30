---
title: "Implementation Summary"
description: "This packet is specified and not started: it records the twelve check rows, the nine fixtures and the criteria that will decide it, with no implementation claim."
trigger_phrases:
  - "agents md check implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/002-check-engine"
    last_updated_at: "2026-10-30T12:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the specification state; implementation has not started"
    next_safe_action: "Start with the failing suite once the doctor sk-skill command is on main"
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
| **Spec Folder** | 002-check-engine |
| **Completed** | Not started |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built. This packet holds the specification, the plan and the acceptance criteria for one read-only engine that classifies a repository against the shipped manifest, and no code has run against it.

### Phase 2: check engine

When it is built, an operator will learn in one command which of seven install states a repository is in, which shipped sections it has lost, which of its own sections sit outside the markers with their byte ranges, and how each runtime copy stands. The report is the input the embed engine composes from.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/agents-md-check.cjs` | Planned create | The read-only engine |
| `.skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` | Planned create | The failing-first suite |
| `.skilled/commands/doctor/scripts/tests/fixtures/agents-md/<nine trees>/` | Planned create | One planted defect per fixture |
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
| One fixture per row rather than one large fixture | A fixture that fails several rows cannot tell which row broke |
| Fixtures are built from the manifest | A hand-written fixture drifts from the data it is supposed to exercise |
| An absent canary is `UNKNOWN`, never `PASS` | A green result with no evidence behind it is the failure mode this row exists to prevent |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/commands/doctor/scripts/agents-md-check.cjs` | PENDING: script does not exist yet |
| `node --test .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` | PENDING: suite does not exist yet |
| Read-only promise | NOT RUN: `git status --porcelain \| shasum` is the check, and it runs once the engine exists |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The fixtures are small trees.** They carry the shipped sections and one planted defect each, not a full 27 KB template, so a defect that only appears at full size can pass the suite.
<!-- /ANCHOR:limitations -->

---
