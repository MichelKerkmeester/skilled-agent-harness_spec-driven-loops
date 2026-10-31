---
title: "Implementation Summary"
description: "The resident hf-local model server now unloads after 10 idle minutes by default instead of staying loaded all day, because a reload costs under half a second while the loaded model holds about 470 MB."
trigger_phrases:
  - "hf model server idle default implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/037-advisor-daemon-memory/001-hf-model-server-idle-default"
    last_updated_at: "2026-10-21T11:45:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Shipped the 10-minute default, ran the supervision suites, superseded the live check by ADR-002"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".skilled/bin/lib/model-server-supervision.cjs"
      - ".skilled/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-idle-eviction.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-hf-model-server-idle-default"
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
| **Spec Folder** | 001-hf-model-server-idle-default |
| **Completed** | 2026-10-21 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The hf model server now unloads after 10 minutes of idle time by default, which releases hundreds of megabytes between embedding sessions. When the model is cached, the measured reload took under half a second, so the default trades a short reload for a smaller idle footprint.

### Phase 1: hf-model-server-idle-default

Unset, blank, and non-numeric timeout values use the 10-minute default. Setting the value to 0 or a negative number keeps the server warm. Fractional positive values still set shorter idle windows.

### Cold-Start Measurements

The orchestrator measured three first-embedding runs on this machine on 2026-10-21:

| Run / Metric | Result | Context |
|--------------|--------|---------|
| First embed after fresh spawn, run 1 | 20,303 ms | First-time model download into the new worktree cache; excluded from the reload cost |
| First embed after fresh spawn, run 2 | 462 ms | Warm model cache |
| First embed after fresh spawn, run 3 | 407 ms | Warm model cache |
| Warm embedding | 8–10 ms | Model already loaded |
| Resident RSS | 462–521 MB | Model loaded |

The 10-minute default keeps short pauses warm and releases roughly half a gigabyte after longer idle periods. The two warm-cache reloads took 407–462 ms.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/bin/lib/model-server-supervision.cjs` | Modified | Defaults idle eviction to 10 minutes and keeps zero or negative values warm |
| `.skilled/skills/system-spec-kit/runtime/tests/embedders/launcher-model-server-idle-eviction.vitest.ts` | Modified | Covers the default, blank and invalid fallbacks, fractional values, zero and negative values |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modified | Documents the new default and warm-server opt-out |
| `.env.example` | Modified | Shows the 10-minute default and zero opt-out |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The CommonJS syntax check, six-case config probe, ENV reference validator and comment-hygiene check passed. All four Skilled drift guards passed with 10 non-blocking warnings. The idle eviction Vitest suite and live idle-and-respawn check were not run here; the orchestrator runs those checks.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use a 10-minute idle timeout by default | Warm-cache reloads took 407–462 ms, while a loaded model used 462–521 MB RSS |
| Use the default for unset, blank and non-numeric values; keep zero and negative values warm | Invalid input should preserve the safe default, while zero and negative values remain explicit opt-outs |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check .skilled/bin/lib/model-server-supervision.cjs` | PASS, exit 0 |
| Node config probe for unset, blank, non-numeric, fractional, zero and negative values | PASS, six cases, exit 0 |
| `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md --type reference --blocking-only` | VALID, exit 0; one non-blocking issue reported |
| Comment-hygiene check on `model-server-supervision.cjs` | PASS, exit 0 |
| `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` | PASS, exit 0; 10 non-blocking warnings |
| Strict spec validation | PASS after the orchestrator refreshed the generated metadata |
| Embedder Vitest suites, including idle eviction | PASS, 90 passed, 2 skipped |
| Launcher IPC bridge, demand probe and respawn lock suites | PASS, 29 passed |
| Advisor `launcher-bootstrap` suite | PASS, 20 passed |
| Live idle-and-respawn check at the default | Superseded by ADR-002: the shared model server socket starts only through a launcher with spawn authority |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live run at the real default yet.** The 10-minute unload has not been watched on a launcher-owned server; the supervision suite proves eviction with a short timeout (ADR-002).
2. **First embedding after a pause is slower.** It waits about half a second while the model reloads.
<!-- /ANCHOR:limitations -->

---


