---
title: "Implementation Summary"
description: "Four runtimes now bind or inject the packet goal through one core: OpenCode gains bind, resent and packet actions, Pi and Cursor gain the resend reminder, Devin gains an injection adapter, and Claude Code and Codex keep their native goal command."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/036-goal-unification/005-runtime-surfaces"
    last_updated_at: "2026-09-11T07:11:50Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped pi, opencode, cursor and devin goal surfaces over the packet core"
    next_safe_action: "Build 007-retirement-docs-and-verification"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-system-spec-kit-goals"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-runtime-surfaces |
| **Completed** | 2026-09-11 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every runtime in the decision record now reaches the same packet `goal.md`. OpenCode binds through its plugin tool, Pi through its native command, Cursor and Devin receive the injected brief with the resend reminder, and the two runtimes with a host-private goal command are reached through the speckit workflows instead of a shadow command.

### Phase 5: runtime-surfaces

On OpenCode, `/goal-opencode bind <packet>` makes the packet goal the directive and `resent` clears the reminder once you have set the copy. On Pi the same actions ride `/goal-pi`. Cursor and Devin inject the brief and a one-line reminder while the operator copy is behind; Cursor also answers `/goal-cursor packet <path>` with the durable slice because a file read needs no session. The open question from research is closed: the ESM plugin requires the CommonJS slice module directly, so one module serves both implementations and the numeric policy no longer has to be duplicated to stay in sync.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/opencode-goal.js` | Modified | Shared slice import, bind and resent mutations, packet action, packet-aware render, whitelisted packet fields |
| `.opencode/commands/goal-opencode.md` | Modified | bind, resent, packet routes |
| `.opencode/hooks/goal/pi/goal-context.ts` | Modified | Packet-aware render and resend reminder |
| `.pi/prompts/goal-pi.md` | Modified | Action list |
| `.opencode/hooks/goal/cursor/goal-inject.mjs` | Modified | Resend reminder |
| `.cursor/commands/goal-cursor.md` | Modified | Session-free packet read, management refused |
| `.opencode/hooks/goal/devin/goal-inject.mjs`, `goal-devin.test.mjs` | Created | Devin injection adapter and tests |
| `.devin/hooks.v1.json` | Modified | Goal adapter on SessionStart and UserPromptSubmit |
| `.opencode/hooks/goal/lib/goal-core.cjs`, `bin/goal.cjs` | Modified | `describePacketGoal`, `renderResendReminder`, `packet` action |
| Plugin and hook test suites | Modified | Bind, resent, packet, reminder and cursor command cases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each adapter got its own test on top of the shared core tests, then an end-to-end playbook ran the CLI and both hook binaries against this packet's real `goal.md` with the state directory redirected to a temp folder. One pinned plugin contract was updated deliberately: the `__test` seam list gained the three new exports. The presentation offer line was kept as pinned; binding behavior lives in the workflow YAML instead.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Cursor command reads packets, still refuses management | A packet read binds nothing and needs no session; management without identity was the failure 009 removed |
| Devin is injection-only | The repository exposes no Devin prompt-command surface; the hook surface carries eight events and two accept context |
| Plugin requires the slice module instead of copying it | One boundary definition; the duplicated caps stay but the strip cannot drift |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| node --test six hook suites | PASS 110/110 |
| node --test eight plugin suites | PASS 134/134 |
| verify_alignment_drift.py --root .opencode/hooks/goal | PASS 0 findings |
| Playbook against the real 036 packet | PASS: bind mutation=bound, packet_nested=true, resend_pending true then false after resent; cursor and devin envelopes carry the brief and reminder with no frontmatter |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Host injection caps outside OpenCode are still unknown.** The core's 4800 stays the only enforced ceiling.
2. **The pi extension is not type-checked in CI** because its host types are not installed here; its tests exercise the core it calls.
<!-- /ANCHOR:limitations -->

---


