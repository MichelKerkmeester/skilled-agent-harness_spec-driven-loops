---
title: "Implementation Summary"
description: "goal-core now binds a session to a packet and renders the brief from that packet's goal.md, with frontmatter stripped, a resend hash, and a locked log append; the legacy record keeps only pointer, liveness and telemetry."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/036-goal-unification/004-goal-core-packet-backed"
    last_updated_at: "2026-09-11T07:11:49Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped packet-backed goal-core with tests"
    next_safe_action: "Build 005-runtime-surfaces and 006-speckit-command-integration"
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
| **Spec Folder** | 004-goal-core-packet-backed |
| **Completed** | 2026-09-11 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A bound session now reads its directive from the packet `goal.md` every time it renders, so editing the file changes what the model sees on the next turn and nothing remembered can drift from it. The frontmatter cannot reach chat, injection or the objective because every surface goes through one slice module.

### Phase 4: goal-core-packet-backed

Bind a session with `goal.cjs bind <packet>`. The core resolves the path inside the workspace, refuses anything outside it or without a goal document, derives the operator copy (pointer first, then the binding sentence when the packet is phased, then the criteria), and stores only the pointer plus bookkeeping. Rendering reads the file; a bound record whose file is gone injects nothing and never falls back to a stale copy.

The durable slice hash tells you whether the operator copy is behind: it changes on a decision, binding row or criterion edit and ignores log appends and reflow. `resent` records that the slice was sent, and `log` appends a progress row under a per-packet lock while refusing any write that would alter the durable slice.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/hooks/goal/lib/goal-slice.cjs` | Created | Shared projections both the CommonJS core and the ESM plugin can import |
| `.opencode/hooks/goal/lib/goal-core.cjs` | Modified | Packet binding, resend tracking, log append, packet-backed render |
| `.opencode/hooks/goal/bin/goal.cjs` | Modified | bind, unbind, resent, log actions and packet fields in show |
| `.opencode/hooks/goal/lib/goal-slice.test.cjs` | Created | Five cases: no leak, slice boundaries, nested versus singular, hash stability, unbound paths |
| `.opencode/hooks/goal/lib/goal-core.test.cjs` | Modified | Nine packet cases including two-session isolation and the CLI envelope |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read path first, then write path, each with its own tests. The existing 91 hook tests still pass unchanged, so an unbound record renders exactly as before and the injection labels stay byte-compatible with the plugin. The 132 plugin tests pass untouched because the plugin was not modified in this phase; converging it is phase 005.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A new module instead of functions inside the core | The ESM plugin must consume the same slice logic without importing the whole core |
| Record keeps the operator copy | The runtime judges completion against a stored string; the packet is read at render so the two cannot silently diverge |
| Log append serialized per packet | Two sessions on one packet must not interleave rows; the lock lives in the state dir, keyed by workspace and packet path |
| Hash ignores whitespace and comments | A reflow or a log edit is not a durable change and must not trigger a resend |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| node --test five goal suites | PASS 105/105 |
| node --test eight plugin suites | PASS 132/132 |
| verify_alignment_drift.py --root .opencode/hooks/goal | PASS, 9 files, 0 findings |
| Smoke on the 036 parent | nested=true, 3864 durable chars, chat slice 3544, no frontmatter |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The plugin still keys and caps independently.** `opencode-goal.js` does not yet import the slice module; phase 005 converges it or declares it a thin client.
2. **Whether the ESM plugin can require the CommonJS module without a build step is untested** until phase 005 tries it.
<!-- /ANCHOR:limitations -->

---


