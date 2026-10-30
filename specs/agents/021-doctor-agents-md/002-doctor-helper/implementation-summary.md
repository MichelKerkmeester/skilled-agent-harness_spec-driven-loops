---
title: "Implementation Summary"
description: "This packet is specified and not started: it records the matcher, its accuracy bar, the reach contract and the plumbing it will land, with no implementation claim."
trigger_phrases:
  - "doctor helper implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/002-doctor-helper"
    last_updated_at: "2026-10-30T12:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the specification state; implementation has not started"
    next_safe_action: "Re-measure the counts and write both suites first"
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
| **Spec Folder** | 002-doctor-helper |
| **Completed** | Not started |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built. This packet holds the specification, the plan and the acceptance criteria for one read-only command that names the doctor command a described problem needs, and no code has run against it.

### Phase 2: doctor-helper

When it is built, an operator can type a problem in plain words and get at most three doctor routes ranked with the class and the reason on every line. A read-only route runs in place; a writing route is printed for the operator to run, so its own plan and yes still decide the change.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/helper.md` | Planned create | Router, six canonical sections |
| `.skilled/commands/doctor/assets/doctor-helper.yaml` | Planned create | Read-only workflow |
| `.skilled/commands/doctor/assets/doctor-helper-presentation.txt` | Planned create | Presentation templates |
| `.skilled/commands/doctor/scripts/doctor-helper-match.cjs` | Planned create | The deterministic matcher |
| `.skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs` | Planned create | Unit, self-recall and held-out accuracy |
| `.skilled/commands/doctor/scripts/tests/doctor-helper-contract.test.cjs` | Planned create | Reach, parity and setup-row coverage |
| `.skilled/commands/doctor/scripts/tests/fixtures/doctor-helper/` | Planned create | The frozen held-out set and the tune set |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The baseline route and test counts were captured on this worktree at `006d96370d` and are recorded in `spec.md` section 2; they are re-measured when implementation starts, because the sibling phase also adds routes.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A deterministic matcher rather than the advisor | The advisor's doctor rules forbid doctor-versus-doctor ranking, and it measured zero of forty paraphrases |
| The held-out set is frozen before tuning and pinned by hash | A set that can be edited during tuning measures the tuning, not the matcher |
| A writing pick is handed off, never run | Each writer's plan and yes must run under its own frontmatter, and the helper holds read tools only |
| The helper's own bridge ships inactive unless four checks pass | An advisor answer is useful, but it must not cost a passing prompt |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/commands/doctor/scripts/doctor-helper-match.cjs -- "<problem>"` | PENDING: script does not exist yet |
| `node --test .skilled/commands/doctor/scripts/tests/doctor-helper-match.test.cjs` | PENDING: suite does not exist yet |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | NOT RUN for this packet; the pre-implementation figure is `OK: route-validate — 19 routes validated, 3 warnings` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A paraphrase far from the manifest vocabulary still misses.** The remedy is a manifest phrase, never a hidden synonym table, so the vocabulary stays the one table both the helper and the advisor read.
2. **The shared counts move under the sibling phase.** Every criterion states the re-measured figure rather than an absolute, so whichever packet lands second rebases them.
<!-- /ANCHOR:limitations -->

---
