---
title: "Implementation Summary: Phase 1: compiled-route-manifest-suite"
description: "The compiled-route rebuild now traces every hub from its authored source, and the manifest suite passes 42 of 42."
trigger_phrases:
  - "compiled route manifest suite implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/001-compiled-route-manifest-suite"
    last_updated_at: "2026-10-10T20:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase"
    next_safe_action: "Start the next phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-001-compiled-route-manifest-suite"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 1: compiled-route-manifest-suite

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-compiled-route-manifest-suite |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The compiled-route rebuild now traces every hub from its authored source, and the manifest suite passes 42 of 42.

### Phase 1: compiled-route-manifest-suite

An adopter who ran the documented rebuild on main got `SYNC FAILED` for the cli-classifier hub. The authored harness still mapped a SKILL.md for the removed cli-deem mode. Deleting that line made the authored and served copies identical and the rebuild resolve all 7 hubs. That exposed a second cause: the manifest test pinned the hub count at 6. The test now reads the count from the sync script's own hub list.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `specs/sk-doc/z_archive/.../008-cli-classifier/harness/build-artifacts.cjs` | Modified | Removed the stale cli-deem entry |
| `.skilled/bin/tests/compiled-route-manifest.test.cjs` | Modified | Hub count read from `sync.HUBS` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two one-change builds by DeepSeek V4.1 Flash at max effort through cli-pi on llmgateway. The orchestrator reran every check itself.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read the count from `sync.HUBS` | A literal goes stale each time a hub is added, which is how this broke |
| Leave the served copy alone | It was already correct; only the authored copy had drifted |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `compiled-route-sync.cjs --check` | exit 1 before, exit 0 after |
| Manifest suite | 26 of 42 before, 28 of 42 after the harness fix, 42 of 42 after the count fix |
| `compiled-route-guard.cjs` | exit 0, all hubs fresh |
| `compiled-route-sync.cjs --verify` | move-simulation OK, all 7 hubs |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The authored source still lives under `specs/sk-doc/z_archive/`.** An adopter reads that folder as history, yet the rebuild depends on it. Moving it is a larger change, left as an open question in the research.
<!-- /ANCHOR:limitations -->

---
