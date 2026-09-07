---
title: "Implementation Summary"
description: "One canonical hook registry now generates the four runtime registration files byte for byte in their own dialects, verifies the Pi symlinks, and reports drift in CI."
trigger_phrases:
  - "registration schema unification"
  - "hook registration drift"
  - "one behavioral contract five schemas"
  - "generated hook registration check"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/014-registration-schema-unification"
    last_updated_at: "2026-09-07T15:05:56Z"
    last_updated_by: "template-author"
    recent_action: "Closed the packet with every gate observed green"
    next_safe_action: "Implement child 015"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:ca5567d731cc2373fc77e075b50c5a72a9a400afc7843e5e01517cb4dc85e8f8"
      session_id: "scaffold-014-registration-schema-unification"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-registration-schema-unification |
| **Completed** | 2026-09-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four runtimes registered their hooks through four hand-kept JSON files in four dialects, and nothing said whether they described the same hook set. Every command in those files was parsed into one wrapper grammar, runner, script, arguments, fallback style and message, and all 77 round-tripped, so the set could be written once: `hook-registry.json` names 28 hooks with a concern, a script and a binding per runtime, plus the Pi extension each binds through. `sync-hook-registrations.cjs` renders the four files from it in their own shapes, replacing only the `hooks` key of the Claude settings file, and verifies every Pi symlink resolves; its first run reproduced all four files byte for byte. `--check` reports drift like the mirror synchronizer and runs in CI's mirrors job.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/cli/runtime-mirrors/hook-registry.json` | Created | The canonical hook set |
| `runtime/cli/runtime-mirrors/sync-hook-registrations.cjs` | Created | Renderer for four shapes, Pi verification, `--check` |
| `runtime/cli/tests/hook-registration-sync.vitest.ts` | Created | Byte parity, drift, restore, Pi symlink cases |
| `runtime/hooks/README.md`, `runtime/cli/runtime-mirrors/README.md` | Modified | Registration section; two new rows |
| `.github/workflows/spec-kit-check.yml` | Modified | Hook registration and Gate 1 pointer checks in the mirrors job |
| `mcp-server/tests/hooks/settings-driven-invocation-parity.vitest.ts` | Modified | Regex names the hook path the registration files use |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

An extraction script parsed every registered command and re-rendered it, refusing to proceed until zero commands fell outside the grammar. The registry was then built from that parse, with concerns and Pi mappings authored by hand, and the generator written against it. The first `--check` found the Claude settings file differing by its two `async` flags, the schema gained the flag, and the second run matched all four files. The generator test seeds a temporary copy of the files and a Pi extensions directory and walks the drift, restore and missing-symlink paths.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Derive the registry from the files, then require byte parity | The registry must capture today's behaviour exactly before it is allowed to change it |
| Record group and slot per binding | Two runtimes group the same event differently; order and grouping are part of the file's shape |
| Verify Pi instead of generating | Pi registers by symlink; the registry can name the link and check it, not write it |
| Model fallback as a style plus an optional message | Five wrapper styles cover all 77 commands; a raw-string escape hatch was never needed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Extraction round-trip of every registered command | 77 of 77, zero misses |
| Generator write against the repository, diff per file | all four identical to HEAD |
| `sync-hook-registrations.cjs --check` | PASS, 28 hooks, 15 Pi extensions resolve |
| `hook-registration-sync.vitest.ts` | 4 pass |
| `sync-runtime-mirrors.cjs --check` on the regenerated files | PASS, 169 mirrors |
| Hook adapter path parity, completion-evidence sentinel and stop, lifecycle bridge suites | 139 pass |
| Advisor `settings-driven-invocation-parity.vitest.ts` | 41 pass |
| `validate.sh <this child> --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The Claude settings file is never created from the registry.** The generator rewrites its `hooks` key and refuses when the file is absent, because the other keys are hand-authored.
2. **Pi's event bindings are not in the registry.** Each extension registers its own events in code; the registry names the symlink only.
<!-- /ANCHOR:limitations -->

---
