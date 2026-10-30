---
title: "Implementation Summary"
description: "This packet is specified and not started: it records the plan, the files it will touch and the criteria that will decide it, with no implementation claim."
trigger_phrases:
  - "agents md manifest implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/001-manifest-and-template-block"
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
| **Spec Folder** | 001-manifest-and-template-block |
| **Completed** | Not started |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built. This packet holds the specification, the plan and the acceptance criteria for one manifest of the shipped template surface, and no code has run against it.

### Phase 1: manifest and template block

When it is built, a repository will be able to ask what the template ships without reading the template: the manifest names the 46 sections with the prefixes that find them, the pins the tooling greps with the file that consumes each one, the runtime copies a repository is expected to hold, the delivery budget and the shipped router rows. The two root-file edits give the template the one sentence that points at its own block and the empty block itself.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Planned create | The shipped manifest |
| `.skilled/commands/doctor/scripts/agents-md-manifest.cjs` | Planned create | `--write` and `--check` |
| `.skilled/commands/doctor/scripts/lib/agents-md-sections.cjs` | Planned create | Shared segmenter and classifier |
| `.skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs` | Planned create | The failing-first suite |
| `AGENTS.md` | Planned modify | Line 3 wording and the empty block |
| `.github/workflows/spec-kit-check.yml` | Planned modify | Two path-filter entries |
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
| One manifest with an authored part and a generated part | A consumer has no other copy of the template, and a hand-kept copy drifts silently while a generated one fails a check |
| Pins name the file that consumes them | A pin list with no consumer check is a comment that rots |
| Both root edits land in one commit with the regenerated derived key | The freshness check compares the two, so splitting them makes CI red between commits |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` | PENDING: script does not exist yet |
| `node --test .skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs` | PENDING: suite does not exist yet |
| `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` | NOT RUN for this child; the pre-implementation figure is `OK: all rule invariants present` with the last anchor at byte 16374 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The history key depends on release tags.** A branch with no tag holds one body per section, so a stale fork copy cannot be recognised there and classifies as `unknown-base` in the check engine.
<!-- /ANCHOR:limitations -->

---
