---
title: "Implementation Summary: skill-advisor model-server default spawn"
description: "The skill-advisor launcher now arms the shared HF model-server spawn by default, and the launcher, supervision library and model-server child agree on the short socket directory, so a demand on the shared socket starts the server from a worktree."
trigger_phrases:
  - "model server default spawn summary"
  - "demand listener ready"
  - "onnxruntime-common missing"
  - "spawn default flipped"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-model-server-default-spawn"
    last_updated_at: "2026-09-04T05:06:33Z"
    last_updated_by: "claude-code"
    recent_action: "Flipped the spawn default and unified the socket directory"
    next_safe_action: "Operator installs onnxruntime-common in the main checkout, then re-run the demand proof"
    blockers:
      - "onnxruntime-common is absent from the host's installed transformers tree, so the spawned model server cannot load the model"
    key_files:
      - ".opencode/bin/system-skill-advisor-launcher.cjs"
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/bin/hf-model-server.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-04-023-model-server-default-spawn"
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
| **Spec Folder** | 023-model-server-default-spawn |
| **Completed** | 2026-09-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The shared HF model server has a spawner again. Since phase 003 of the memory decommission deleted the memory launcher, nothing armed the spawn unless an operator set a flag to exactly `1`; the skill-advisor launcher now arms it by default and `0` is the kill switch. Getting the spawn to work from a worktree exposed three resolvers that still fell back to the deleted memory database directory, and they now agree on the embedding client's short default.

### Default-on with a kill switch

The launcher reads the flag into three states. Unset or blank arms the lazy demand listener. `0`, or any value other than `1`, turns the spawner off. An explicit `1` keeps a missing supervision library fatal, where the default logs a line and leaves embedding to the other providers; in auto mode that is Ollama first, with hf-local as the fallback behind it. The listener is lazy: it binds the shared socket, answers the first embed request with 503 loading, releases the socket and spawns the model server, and it skips entirely when a resident already listens.

### One socket directory

The launcher used to hand the memory server's database directory to the supervision control as the home for the model server's socket, pid, respawn lock and give-up files, and the model-server child fell back to the same directory. That directory no longer exists and, inside a worktree, is 132 bytes long against a 104-byte Unix socket limit, so the child died in listen on every spawn. All three now resolve to `/tmp/system-hf-embed`, which is what the embedding client has used since phase 002.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/system-skill-advisor-launcher.cjs` | Modified | Setting reader, graceful degradation, model-server files directory, test exports |
| `.opencode/bin/lib/model-server-supervision.cjs` | Modified | tcp-mode lock and give-up fallback on the short default |
| `.opencode/bin/hf-model-server.cjs` | Modified | Listen-target fallback on the short default |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/launcher-model-server-default.vitest.ts` | Created | Four cases over the setting |
| `.opencode/skills/system-skill-advisor/mcp-server/tests/launcher-bootstrap.vitest.ts` | Modified | Child socket directory asked of the IPC bridge instead of assumed to be the database directory |
| `.env.example`, `mcp-server/ENV-REFERENCE.md`, `.claude/mcp.json`, `.cursor/mcp.json`, `opencode.json` | Modified | Default and kill switch documented |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built and verified by the orchestrator directly. The launcher ran in the foreground from the worktree with the flag unset; its stderr reported the lazy demand listener ready at the shared socket after reclaiming a stale lock, a demand request on the socket returned 503, the launcher spawned the child, and the child logged that it was listening on the same path. The bootstrap suite exposed a pre-existing expectation from phase 002 (child socket directory equals the database directory) and now asks the bridge instead.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Default on, flag kept as kill switch | The preserve set kept the model server for one consumer, the advisor; a spawner nobody arms leaves that code dead in practice |
| Explicit `1` stays fatal on a missing library, the default degrades | An operator who asked for the server should hear when it cannot exist; a default should never break the advisor, which on an Ollama host never needs the model server |
| Fix the three fallbacks rather than set the environment variable | The variable is an override, and three resolvers with different defaults is the defect the worktree run exposed |
| Leave the host install alone | The missing `onnxruntime-common` lives in the main checkout's node_modules, shared with another live session |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `launcher-model-server-default.vitest.ts` | 4 passed |
| Advisor launcher suites (bootstrap, lease, reap, orphan reaping, tri-daemon, default) | 47 passed, 1 skipped, exit 0 |
| Spec-kit embedders, supervision, IPC bridge, session proxy, sweeper, env drift | 134 passed, 2 skipped, exit 0; embedders plus supervision alone 88 passed |
| Live proof from the worktree, flag unset | demand listener ready at `/tmp/system-hf-embed/hf-embed.sock`; demand POST 503; child spawned; child listening at the same path |
| Model load in the spawned child | FAIL: `Cannot find module onnxruntime-common`; lockfile lists it under both onnxruntime packages, neither is installed in the main checkout |
| `validate.sh --strict` on this packet | recorded after metadata regeneration |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The model does not load on this host.** The spawn chain works, but the shared transformers install lacks `onnxruntime-common`, so the child enters crash-loop cooldown; on this host it does not matter day to day because auto mode embeds through Ollama and hf-local is only the fallback. Fix: run the package install in the main checkout so node_modules matches the lockfile, then send one demand request to the shared socket and expect `state: ready`.
2. **Every advisor start binds one more Unix socket.** The listener is lazy and skips when a resident owns the socket; set the flag to `0` on hosts that must not run a model server.
3. **The launcher's test hook still accepts the old field name** for the files directory so existing callers keep working; the new name is `modelServerFilesDir`.
<!-- /ANCHOR:limitations -->

---


