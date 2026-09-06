---
title: "Implementation Summary"
description: "Claude and Cursor hooks now fail loud the way Codex and Devin do, and the improvement/ artifact family is documented and shape-checked."
trigger_phrases:
  - "claude cursor hook drift markers"
  - "mkHookDrift fallback claude cursor"
  - "improvement artifact family"
  - "IMPROVEMENT_ARTIFACTS rule"
  - "rule count 39 registry"
  - "doctor rows new adapters"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/023-trigger-index-root-and-drift-fixes/003-hook-markers-and-improvement-family"
    last_updated_at: "2026-09-05T21:16:57Z"
    last_updated_by: "template-author"
    recent_action: "Hook markers, improvement rule"
    next_safe_action: "None; phase complete, proceed to 004"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:219879ce3945f6eb6c201bc0d74f9f7391273ee0afe361bd65261cd06654f6c7"
      session_id: "scaffold-003-hook-markers-and-improvement-family"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-hook-markers-and-improvement-family |
| **Status** | Complete |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every adapter invocation in `.claude/settings.json` (21) and `.cursor/hooks.json` (17) now carries the fallback Codex and Devin got in packet 054: on adapter failure the host still receives well-formed output with `"mkHookDrift": true`, and stderr gets one recognizable line. The doctor asset lists the new adapters and the parity test asserts the marker per host. `improvement/` joins `research/` and `review/` in the folder-structure reference, and rule `IMPROVEMENT_ARTIFACTS` checks that every config inside it parses and carries the fields all three real generations share.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.claude/settings.json`, `.cursor/hooks.json` | Modify | Drift fallback on every registration |
| `.opencode/commands/doctor/assets/doctor-runtime-mirrors.yaml` | Modify | Health rows for the new adapters |
| `runtime/tests/hook-adapter-path-parity.vitest.ts` | Modify | Marker assertions per host |
| `references/structure/folder-structure.md` | Modify | `improvement/` documented |
| `runtime/cli/rules/check-improvement-artifacts.sh`, `runtime/cli/lib/validator-registry.json` | Add, Modify | The rule and its registration |
| `README.md`, `runtime/hooks/claude/README.md`, `runtime/hooks/cursor/README.md` | Modify | Rule count 39; fallback paragraph |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A GLM 5.3 Flash lane through OpenRouter made the hook, asset, test, reference and rule edits; the README count and the two hook README paragraphs were outside its file list and were added here; all claims rerun before commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Warn severity for the improvement rule | Matches the repo's other shape rules; a malformed config surfaces without blocking a completion claim |
| Presence-only field check | Several fields are legitimately empty at creation; nested keys differ across generations |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Markers | `.claude/settings.json` 21, `.cursor/hooks.json` 17 |
| Synthetic adapter failure | exit 0, marker on stdout, stderr line, file restored |
| Parity test | 103 of 103 |
| Codex hook check | OK |
| Rule | reported on the archived packet; malformed fixture flagged; listed in `--help` |
| Strict validate on 054 | rule listed, `RESULT: PASSED` |
| Typecheck, CLI build, freshness, doc-count test | exit 0, built, fresh, green at 39 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- Pi and OpenCode registrations answer through a different surface and keep their own fallback shape.
<!-- /ANCHOR:limitations -->
