---
title: "Implementation Summary"
description: "Every derived layer is rebuilt without Hermes: compiled routing serves both affected hubs again, the deep command contracts match their sources, and the trigger index matches the corpus."
trigger_phrases:
  - "hermes removal alignment sweep"
  - "regenerate after hermes removal"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/086-cli-hermes-deprecation/003-regeneration-and-alignment-sweep"
    last_updated_at: "2026-11-07T14:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Completed phase 3: regeneration-and-alignment-sweep"
    next_safe_action: "Operator review, then commit and merge the worktree branch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-086-003-regeneration-and-alignment-sweep"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Remove cli-hermes completely with no backup"
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-regeneration-and-alignment-sweep |
| **Status** | Complete |
| **Completed** | 2026-11-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every derived layer is rebuilt without Hermes: compiled routing serves both affected hubs again, the deep command contracts match their sources, and the trigger index matches the corpus.

### Phase 3: regeneration-and-alignment-sweep

Removing a mode changed two hubs' policy hashes, so their routing manifests went stale and routing quietly fell back to the legacy path. The served routing copies were brought back in line with the authored closure and the manifests re-minted, which restored compiled serving and the 16 compiled-route tests that had been failing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/**` | Modify | Authored routing closure and manifests |
| `.skilled/bin/lib/compiled-routing/**` | Modify | Served routing mirror and manifests |
| `.skilled/commands/deep/assets/compiled/*.contract.markdown` | Regenerate | Deep command contracts |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and retrieval fixtures | Regenerate | Trigger index |
| `.skilled/hooks/session-relaunch/README.md`, relaunch playbook | Modify | Drop two dead spike links |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I did this phase directly: synced the authored closure, re-minted the manifests the way the pre-commit gate does, regenerated the contracts and the trigger index with their own generators, then ran the residue sweep and the alignment battery.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Edit the authored routing closure under `specs/z_archive` | It is the live source the served routing copies are built from; leaving it stale breaks the sync gate |
| Skip the archived canary harness | It fails on main on a stale `.opencode` path and is not a gate for this change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Compiled-route tests | PASS, 101/101 (baseline 85 of 101) |
| Sync check and move simulation | PASS, 55 copies match, all 7 hubs resolve |
| Hub status | PASS, compiled-serving for both hubs |
| Contract drift | PASS, OK commands=3; render and drift tests 43/43 |
| Advisor and compiled-route replay | PASS, Pi routes to `cli-pi`, Hermes gets no route |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Kept residue.** Nous Hermes model labels, captured transcript and benchmark data, frozen fixtures, the pinned held-out set and the AGENTS.md manifest history still contain the word, each for a stated reason.
2. **Pre-existing failures remain.** The deep-loop ledger-schema test and six doctor tests fail on main too.
<!-- /ANCHOR:limitations -->

---
