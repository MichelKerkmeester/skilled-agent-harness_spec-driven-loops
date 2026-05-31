---
title: "Implementation Summary: Selector fix + shared socket + client resilience"
description: "Implemented. Swapped the hf-local selector probe from a Python sentence_transformers import to the /api/health canLoad probe (restoring the zero-install fallback), pinned a shared HF_EMBED_SERVER_URL across all 5 runtime configs, and hardened the client (ECONNRESET/EPIPE retry on both the readiness GET and a bounded embed-POST retry, actionable readiness-timeout). A 4-lens adversarial review's 3 P1s (5-runtime scope gap, embed-POST retry gap, test-coverage gap) were fixed and the P2 tradeoffs documented; both tsc builds + 38 tests green."
trigger_phrases:
  - "selector shared socket implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/031-embedding-stack-hardening/001-selector-and-shared-socket"
    last_updated_at: "2026-05-29T15:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Selector to /api/health; socket pinned in 5 runtimes; review fixes; 38 tests green"
    next_safe_action: "Phase 002: server-liveness & supervision hardening"
    blockers: []
    key_files:
      - "shared/embeddings/auto-select.ts"
      - "shared/embeddings/providers/hf-local.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003114"
      session_id: "031-001-impl-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-selector-and-shared-socket |
| **Completed** | 2026-05-29 (4 NOW fixes + 3 review P1s; both tsc + 38 tests green; review clean) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

**Selector fix (the headline).** `probeHfLocal` (`auto-select.ts`) no longer gates hf-local on a Python `import sentence_transformers` subprocess — it now calls `HfLocalProvider.canLoad`, a `/api/health` probe (`ready` OR `loading` ⇒ available, since the launcher's demand-listener answers `503 loading` and lazily spawns the real server). The `defaultPythonImportProbe`, the `runPythonImportProbe` seam, and the `execFile`/`promisify` imports are deleted; the seam is renamed `probeHfLocalServer` (new exported type `HfLocalServerAvailability`). This restores the zero-install fallback on Node-only machines.

**Shared socket.** `HF_EMBED_SERVER_URL=unix:///tmp/mk-hf-embed/hf-embed.sock` is pinned in the `mk-spec-memory` AND `mk_skill_advisor` env blocks of **all 5 runtime configs** (`.claude/mcp.json`, `opencode.json`, `.gemini/settings.json`, `.codex/config.toml`, `.vscode/mcp.json`) — it resolves first in every resolver, so both launchers converge on one resident server while keeping separate daemon-IPC sockets.

**Client resilience.** `isRetryableReadinessError` now also retries `ECONNRESET`/`EPIPE`; the `waitForReady` final throw branches on a `sawLoading` flag (actionable "still loading — raise `HF_EMBED_SERVER_READY_TIMEOUT_MS`" vs "unreachable"); and `embedPrepared` wraps the `/api/embed` POST in a **bounded (2-attempt) retry** so a mid-request reap (the dominant reap window, under inference load) retries against the respawned server instead of counting toward the circuit breaker.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `shared/embeddings/auto-select.ts` | Modify | `probeHfLocal` → `/api/health` via `canLoad`; deleted Python probe + seam + `execFile`/`promisify` imports; new `probeHfLocalServer` seam + `HfLocalServerAvailability` type |
| `shared/embeddings/providers/hf-local.ts` | Modify | `ECONNRESET`/`EPIPE` retryable; `sawLoading`-branched readiness-timeout; bounded embed-POST retry |
| `.claude/mcp.json`, `opencode.json`, `.gemini/settings.json`, `.codex/config.toml`, `.vscode/mcp.json` | Modify | Pin shared `HF_EMBED_SERVER_URL` (both services × all 5 runtimes); fix stale `_NOTE_3_PROVIDERS` |
| `INSTALL_GUIDE.md`, `references/memory/embedder_architecture.md` | Modify | Replace Python/sentence-transformers selector docs with the pure-Node `/api/health` model; document first-embed download |
| `tests/embedder-auto-selection.vitest.ts` | Modify | Migrate `runPythonImportProbe` → `probeHfLocalServer` injections |
| `tests/embedders/hf-local-client.vitest.ts` | Modify | +4 tests: ECONNRESET/EPIPE readiness retry, embed-POST retry, `sawLoading` + unreachable timeout messages |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented directly by the orchestrator (surgical edits with exact line targets from the prior 5-agent analysis, which had verified the two headline findings by hand). After the first build + 34-test pass, a 4-lens opus adversarial review (probe-swap/cascade, shared-socket config, client resilience, test/scope; find → verify pipeline, 17 agents) returned **9 confirmed defects**. The three P1s were fixed: (1) the shared socket was pinned in only 2 of 5 runtime configs → widened to all 5; (2) the `ECONNRESET`/`EPIPE` retry covered only the readiness GET, not the embed POST that actually trips the breaker → added the bounded embed-POST retry; (3) the new client branches had zero coverage → added 4 regression tests. The P2s were resolved as documented tradeoffs (reset-retry latency, the 5000ms-vs-2500ms cascade-probe-timeout divergence) or accepted (default-probe path covered structurally by the Python-code removal); the stale `_NOTE_1_DB` code-graph note was confirmed out of scope (pre-existing, unrelated).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Reuse `HfLocalProvider.canLoad` as the selector probe rather than a new probe | `canLoad` already does the correct `/api/health` check (ready/loading = available); reusing it avoids divergence and a circular import |
| Pin the shared socket in ALL 5 runtime configs, not just Claude/OpenCode | The convergence guarantee (SC-002) must hold project-wide; Gemini/Codex/VS Code launch the same launchers and would otherwise recreate the divergence on Node-only hosts |
| Bound the embed-POST retry at 2 attempts | A mid-request reap recovers in one retry against the ~250ms-respawned server; bounding it caps worst-case latency for a permanently-resetting server |
| Document (not code-fix) the 5000/2500ms probe-timeout divergence | It governs a sub-50ms local health GET; `SPECKIT_CASCADE_PROBE_TIMEOUT_MS` already lets operators align both — threading an explicit timeout into skill-advisor's package is a deferred fast-follow |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `tsc --build` @spec-kit/shared + @spec-kit/mcp-server | PASS (both) |
| `vitest` embedder-auto-selection + hf-local-client + embeddings | PASS (38 passed \| 8 skipped; +4 new resilience tests) |
| JSON validity (`.claude/mcp.json`, `opencode.json`, `.gemini/settings.json`, `.vscode/mcp.json`) + TOML (`.codex`) | PASS |
| `HF_EMBED_SERVER_URL` pin count across 5 runtimes | 10 (2 services × 5 configs) |
| No Python-probe / `execFile` residue in `auto-select.ts` | Clean (only the explanatory doc comment) |
| 4-lens opus adversarial review (find → verify, 17 agents) | 9 defects — 3 P1 fixed, P2s documented/accepted; re-verified green |
| `validate.sh --strict` on this phase folder | PASS |
| SC: live Node-only selection + cross-launcher shared resident | DEFERRED to phase 005 live validation (needs running daemons) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Reset-retry latency (accepted)** — treating `ECONNRESET`/`EPIPE` as retryable means a permanently-resetting server consumes up to the full `HF_EMBED_SERVER_READY_TIMEOUT_MS` (default 45s) per attempt before failing; the embed-POST retry is bounded at 2 attempts to cap it. Availability-over-fast-fail tradeoff, documented in the spec risk table.
2. **Cascade-probe-timeout divergence (documented)** — spec-memory probes the shared socket at 5000ms, skill-advisor at 2500ms (its `EnsureActiveEmbedderOptions` has no `timeoutMs` field). Marginal (a sub-50ms local `/api/health` GET); `SPECKIT_CASCADE_PROBE_TIMEOUT_MS` aligns both. Threading an explicit shared timeout into the skill-advisor package is a deferred fast-follow.
3. **Live selection not exercised end-to-end** — the probe swap + 5-runtime convergence are covered by unit tests with injected transports; a live Node-only daemon selecting hf-local and two launchers sharing one resident server is verified in phase 005.
<!-- /ANCHOR:limitations -->
