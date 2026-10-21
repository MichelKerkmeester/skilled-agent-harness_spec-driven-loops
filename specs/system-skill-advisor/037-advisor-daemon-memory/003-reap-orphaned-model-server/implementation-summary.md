---
title: "Implementation Summary"
description: "A model server whose launcher died no longer stays loaded forever: the next supervisor that starts reaps it, after checking its parent is PID 1 and its command is the model server, and a supervised one takes its place."
trigger_phrases:
  - "reap orphaned model server implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/037-advisor-daemon-memory/003-reap-orphaned-model-server"
    last_updated_at: "2026-10-21T14:17:16Z"
    last_updated_by: "orchestrator"
    recent_action: "Shipped the orphan reap, fixed the review findings, proved it live"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".skilled/bin/lib/model-server-supervision.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-reap-orphaned-model-server"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-reap-orphaned-model-server |
| **Completed** | 2026-10-21 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A launcher killed by SIGKILL or an uncaught exception used to leave its model server running with its model loaded, and every later launcher backed off from it because the shared socket still answered. Nothing evicted it.

### Phase 3: reap-orphaned-model-server

When a supervisor starts its demand listener and the socket answers alive, it now reads the recorded model server pid. If that process is alive, its parent is PID 1 and its command runs `hf-model-server.cjs`, the supervisor takes the respawn lock, checks the pid and command again, reaps it, confirms it is gone, clears the pid file and any old give-up cooldown, and listens; the next embedding starts a supervised server. In every other case it backs off as before. `SPECKIT_HF_MODEL_SERVER_ORPHAN_REAP=0` turns the reap off.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/lib/model-server-supervision.cjs` | Modified | Orphan branch, `readProcessCommand`, expected-pid reap, confirm-dead unlink, reap label, kill switch |
| `launcher-model-server-idle-eviction.vitest.ts` | Modified | Eleven orphan cases and a `readProcessCommand` test |
| `ENV-REFERENCE.md`, `.env.example` | Modified | The kill switch |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-6 Luna at max effort built the change and then the review fixes. A fresh DeepSeek v4.1 Flash review returned CONDITIONAL with two P1s: the re-check and the signal read the pid file separately, and the socket was unlinked even when nothing had been reaped. Both were fixed, along with the misleading reap log, the stale pid file and an old cooldown that could refuse embeds. The orchestrator removed each guard in turn and saw a test fail, then started a real model server with parent PID 1 and ran the real preflight against it, with the kill switch off and on.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reap, not adopt | A process gets no exit events for a non-child |
| No settling window | A server whose launcher died stays at parent PID 1; the state does not flicker |
| Orphans from any checkout are reaped | The model server socket is shared by every checkout |
| `tcp://` addresses out of scope | That branch never probes; the doctor orphan check still reports such a server |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Embedder and supervision suites | PASS, 130 passed, 2 skipped |
| Advisor `launcher-bootstrap` | PASS, 20 |
| Mutation: parent check, both command checks, expected pid, confirm-dead, kill switch | Each fails a test when removed |
| Live: real orphaned model server, 581 MB, parent PID 1 | Default reaps it and listens; switch `0` leaves it running |
| Fresh DeepSeek v4.1 Flash review | CONDITIONAL; P1s and five P2s fixed, one rejected, one recorded as out of scope |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Reaps only at supervisor start.** An orphan lives until the next launcher starts its demand listener; the doctor orphan check reports it in the meantime.
2. **Not for `tcp://` model servers.**
3. **An init-system model server on the shared socket would be reaped.** Set `SPECKIT_HF_MODEL_SERVER_ORPHAN_REAP=0` for that setup.
<!-- /ANCHOR:limitations -->

---


