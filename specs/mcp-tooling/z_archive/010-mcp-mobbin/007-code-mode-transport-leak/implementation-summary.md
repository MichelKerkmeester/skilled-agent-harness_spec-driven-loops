---
title: "Implementation Summary: Code Mode releases transports instead of accumulating remote MCP children"
description: "The server held a child process per registered manual for the whole session and abandoned them on exit, so orphans accumulated until concurrent instances of one remote transport contended over shared credential state and looped a browser prompt. Transports are now released after discovery and before exit."
trigger_phrases:
  - "code mode transport leak fixed"
  - "mobbin repeated browser prompt resolved"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/007-code-mode-transport-leak"
    last_updated_at: "2026-08-25T06:56:20Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Released idle and shutdown transports in the Code Mode server"
    next_safe_action: "Operator reviews the working-tree changes, then commits"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-code-mode/mcp-server/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-010-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-code-mode-transport-leak |
| **Completed** | 2026-08-25 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Code Mode server no longer holds transport child processes it is not using, and no longer leaves them running when it exits.

### The root cause

The reported symptom was a Mobbin authorization window reopening every few minutes with no user action.

Registering a manual opens a transport to read its tool list. All thirteen manuals in the shared configuration are stdio, so startup spawned thirteen child processes and cached every one for the session, though a session typically calls none of them.

Those children also outlived the server: its shutdown path exited the process without closing the client, leaving each child running and reparented to the init process. Twenty-one orphans were found, the oldest three days old, thirteen of them for one endpoint.

Concurrent instances for one endpoint then contended over a single shared credential store. Each independently decided it needed authorization, so each opened a browser window; the observed cadence was one attempt every two to five minutes. Mobbin surfaced the defect only because it had accumulated the most instances — the mechanism is generic to any transport reached through browser-based authorization.

### The fix

Transports are released at both lifecycle points. Idle ones are released once startup discovery finishes, which leaves the tool repository intact so everything stays searchable and the protocol reopens a transport on the first real call. All remaining ones are released before exit, bounded by a timeout so an unresponsive transport delays exit rather than preventing it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/mcp-code-mode/mcp-server/index.ts` | Modified | Release idle transports after discovery, and all transports before exit |
| `.opencode/skills/mcp-code-mode/mcp-server/dist/` | Rebuilt | Build output the runtime loads; ignored by version control, so it is not carried by the commit |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Attribution came from process ancestry: the transport processes traced to the Code Mode server under a running agent session, which ruled out the runtimes first suspected. Reading the entry point showed the exit path calling process exit directly, and the protocol implementation showed cached sessions with a teardown entry point nothing was calling.

Proof used a purpose-built local stdio manual so no real credential flow was involved. The same spawn-and-kill probe ran against a preserved pre-fix build and the fixed build, differing only in the build under test. A second probe measured children, tool searchability, and a real call across a release boundary to confirm nothing regressed. Probe artifacts were removed from the package tree afterwards.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Release idle transports rather than prune the manual roster | The roster is correct; trimming it would trade capability for a symptom, and the cost was retention, not registration |
| Release after discovery rather than defer registration | Deferring would have removed tools from discovery; releasing keeps every tool searchable because the repository outlives the transport |
| Bound the release with a timeout | Exit correctness outranks clean teardown; a hung transport must not strand the process, which is the failure being fixed |
| Use the client's own teardown entry point | It already cascades into every protocol; reaching into private session state or killing processes directly would duplicate shipped behavior |
| Leave the already-running orphans to a one-time operator sweep | They belong to sessions that no longer exist; no code change can reach them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Negative control — pre-fix build, spawn and shut down | PASS (fails as predicted) — `1 / 1` children still alive, `RESULT: LEAKED` |
| Positive control — fixed build, identical probe | PASS — `0 / 1` children alive, `RESULT: REAPED` |
| Steady state — idle transport children after startup | PASS — `0`, sampled twice across fourteen seconds |
| Tools searchable after release | PASS — search still returns the registered tool |
| Call after release reopens its transport | PASS — call returned `OK`, child count returned to one on demand |
| Manual roster audit for the teardown side effect | PASS — `13` stdio manuals, `0` http, `0` declaring auth |
| Typecheck and build | PASS — `npx tsc` exit code 0 |
| Probe residue removed | PASS — package tree holds only the four expected build outputs |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **First call to a manual now pays transport startup cost.** Previously every manual was already connected. A session that calls one manual repeatedly pays this once; the previous behavior paid it for all thirteen every session regardless of use.
2. **The teardown also clears stored authorization for direct HTTP manuals.** Inert for the current roster, which has none, but adding an HTTP manual with authorization would need this revisited.
3. **The build output is not versioned.** Only the source is committed, so any checkout or machine picks the fix up after a rebuild, not from the commit alone. A session started against a stale build keeps the old behavior.
4. **Proof used a local stand-in manual, not a live remote transport.** That was deliberate, to avoid triggering the very authorization flow under investigation; the lifecycle path exercised is identical because both are stdio manuals.
<!-- /ANCHOR:limitations -->
