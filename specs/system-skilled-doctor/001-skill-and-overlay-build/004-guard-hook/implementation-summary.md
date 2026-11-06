---
title: "Implementation Summary"
description: "The overlay-guard hook refuses an agent's edit to a file a vendored copy's overlay owns and names the overlay file to edit, in five runtimes."
trigger_phrases:
  - "guard hook implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/004-guard-hook"
    last_updated_at: "2026-11-06T09:57:50Z"
    last_updated_by: "generate-context"
    recent_action: "Built and registered the overlay-guard hook; hook tests 18 of 18, doctor suite 1067 of 1067"
    next_safe_action: "Commit phase 004, then close the packet: recursive strict validation and the trigger index"
    blockers: []
    key_files:
      - ".skilled/hooks/overlay-guard/lib/overlay-guard.cjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json"
    session_dedup:
      fingerprint: "sha256:7aa31fadccdc2e4fbe3a6e084d1b1720c869900b7adff039f582d35ccc97c3ff"
      session_id: "scaffold-004-guard-hook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-guard-hook |
| **Completed** | 2026-11-06 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An agent that edits a vendored file an overlay owns is now stopped before the write and told which overlay file to change. In a repository with no overlays the hook does nothing.

### Phase 4: guard-hook

One core asks the engine's `--guard` about each path a pending write names. Adapters for Claude, Codex, Cursor, Devin and Pi translate each runtime's payload and answer. One registry entry registers all five.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/overlay-guard/` | Created | The core, five adapters, the tests and the README |
| `hook-registry.json` and the four registration files | Modified, Generated | One entry, registered in each runtime |
| `.claude/hooks/`, `.codex/hooks/`, `.cursor/hooks/`, `.devin/hooks/`, `.pi/extensions/` | Created | The mirror links |
| `hook-registration-sync.vitest.ts` | Modified | The pinned binding count, 101 to 105 |
| `.skilled/hooks/README.md`, `hook-flags.env.example`, `doctor-runtime-mirrors.yaml` | Modified | The hook listed with its flag and health checks |
| `.skilled/skills/system-skilled-doctor/` | Modified | The guard in the overlay reference and the v1.3.0.0 changelog |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The 17 hook tests failed before the core existed. The byte-identical test was then checked against a copy of the core that applies after refusing, and it failed once its fixture carried a pin. The registered Cursor command was tested last, which found the swallowed refusal.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| No fallback chain on the Cursor binding | The chain turned Cursor's exit 2 into an allow (ADR-001) |
| Fail open on an engine error | A broken engine must not stop every edit, and `status` still catches the edit (ADR-002) |
| No OpenCode adapter | The plan names five runtimes, and Barter's OpenCode plugin carried the dropped post-edit apply (ADR-003) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Hook tests | PASS, 18 of 18 |
| Doctor contract tests | PASS, `fail 0` |
| REQ-013 search | Nothing found |
| Registrations and mirrors | PASS, 4 files, 20 Pi extensions, 219 mirrors |
| Registry and shared flag tests | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No adapter has run inside a live runtime session.** The tests feed each adapter a payload shaped like its runtime's.
2. **Shell writes are not guarded,** nor are notebook edits or Cursor tools other than `Write`.
3. **Other Cursor deny hooks may never refuse.** `spec-gate-enforce` and `task-dispatch-guard` use the fallback chain ADR-001 removed here.
<!-- /ANCHOR:limitations -->
