---
title: "Implementation Summary"
description: "Three agent hooks that a host could stall by never closing stdin now give up waiting after three seconds, so a stuck pipe costs a moment instead of a turn."
trigger_phrases:
  - "hook stdin deadlines implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/001-hook-stdin-deadlines"
    last_updated_at: "2026-10-10T21:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Built, verified and closed the phase"
    next_safe_action: "Commit the child"
    blockers: []
    key_files:
      - ".skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs"
      - ".skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs"
      - ".skilled/skills/sk-git/scripts/hooks/stdin-deadline.test.mjs"
      - ".skilled/skills/sk-git/SKILL.md"
      - ".skilled/skills/sk-git/README.md"
      - ".skilled/skills/sk-git/changelog/v1.8.1.0.md"
      - ".skilled/skills/sk-vision/hooks/devin/sk-vision.mjs"
      - ".skilled/skills/sk-vision/hooks/devin/sk-vision-devin.test.mjs"
      - ".skilled/skills/sk-vision/SKILL.md"
      - ".skilled/skills/sk-vision/README.md"
      - ".skilled/skills/sk-vision/changelog/v0.3.1.0.md"
      - ".hermes/skills/sk-git/SKILL.md"
      - ".hermes/skills/sk-vision/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-hook-stdin-deadlines"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-hook-stdin-deadlines |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Three agent hooks that a host could stall by never closing stdin now give up waiting after three seconds, so a stuck pipe costs a moment instead of a turn.

### Phase 1: hook-stdin-deadlines

The sk-git message gate and preflight advisory, and the Devin vision hook, now read stdin through the shared reader the hooks tree already ships. It returns at end of stream or after 3000 ms, whichever comes first. Every other path is unchanged, so a normal payload is read and judged exactly as before. Two new spawn tests hold stdin open and fail if a hook does not exit on its own.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-git/scripts/hooks/git-message-gate.mjs` | Modified | Shared deadline reader |
| `.skilled/skills/sk-git/scripts/hooks/git-preflight-advisory.mjs` | Modified | Shared deadline reader |
| `.skilled/skills/sk-git/scripts/hooks/stdin-deadline.test.mjs` | Created | Open-stdin test for both sk-git hooks |
| `.skilled/skills/sk-git/SKILL.md` | Modified | Version 1.8.1.0 |
| `.skilled/skills/sk-git/README.md` | Modified | Version 1.8.1.0 |
| `.skilled/skills/sk-git/changelog/v1.8.1.0.md` | Created | Changelog entry |
| `.skilled/skills/sk-vision/hooks/devin/sk-vision.mjs` | Modified | Shared deadline reader |
| `.skilled/skills/sk-vision/hooks/devin/sk-vision-devin.test.mjs` | Modified | Open-stdin case |
| `.skilled/skills/sk-vision/SKILL.md` | Modified | Version 0.3.1.0 |
| `.skilled/skills/sk-vision/README.md` | Modified | Version 0.3.1.0 |
| `.skilled/skills/sk-vision/changelog/v0.3.1.0.md` | Created | Changelog entry |
| `.hermes/skills/sk-git/SKILL.md` | Modified | Regenerated Hermes copy |
| `.hermes/skills/sk-vision/SKILL.md` | Modified | Regenerated Hermes copy |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each test and each hook change went to DeepSeek V4.1 Flash at max effort through cli-pi on the DevPass route, one file per brief. The first round of hook briefs asked for an inline copy of the reader. The orchestrator stopped those builds before any finished and sent import briefs instead, because both skills already import from `.skilled/hooks/shared/`. It restored the one file a stopped build had touched. The orchestrator then reran every test, fed the gate a live payload, and wrote the bumps, changelogs and Hermes copies.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Import the shared reader instead of copying it | `git-preflight-advisory.mjs` and `sk-vision.mjs` already load helpers from `.skilled/hooks/shared/`, so one import line reuses existing code, as the review recommended |
| `git-message-gate.mjs`, `git-preflight-advisory.mjs`: deadline added | Registered in `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json`, host timeouts 5 to 10 s |
| `sk-vision.mjs`: deadline added | Registered in `.devin/hooks.v1.json`, timeout 60 s |
| `system-skill-advisor/hooks/claude/user-prompt-submit.ts` and `directive-lifecycle-boundary.ts`: no deadline needed | Run only as `spawnSync` children of the spec-kit shims with `input:` set, so stdin is a closed pipe, or imported in-process by Pi. The shims read the host's stdin with `readBoundedStdin` |
| `skill-advisor-cli.ts --json -`: no deadline needed | An operator CLI option with no host |
| `inline-gate-renderer.ts` and `.sh`: no deadline needed | Template CLI, registered in no runtime |
| `style-library.mjs`: no deadline needed | Operator CLI guarded by `isTTY` |
| `directive-lifecycle-boundary-bridge.vitest.ts`: no deadline needed | A test file |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `stdin-deadline.test.mjs` | PASS. `pass 2`, `fail 0`, about 3.05 s per hook. Before the fix: `pass 0`, `fail 2` |
| `sk-vision-devin.test.mjs` | PASS for the new case at about 3.0 s. `pass 8`, `fail 1`, the one failure being the build-dependent case that also failed before |
| `git-preflight-advisory.test.mjs` | PASS. `pass 7`, `fail 0` |
| `message-contract.test.mjs` | PASS. `pass 38`, `fail 0` |
| Live gate payload | PASS. A bad `git commit -m` is denied with `subject.format` and `body.required`, exit 0 |
| Hermes `--check` | PASS. `PASS: 70 Hermes skill copies in sync` |
| Strict validation | PASS. `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The sk-vision build-dependent case still fails without a build.** `resolves a built entry that exports what the adapter calls` needs `vision-runtime/dist`, which is gitignored. It failed before this phase too.
<!-- /ANCHOR:limitations -->

---
