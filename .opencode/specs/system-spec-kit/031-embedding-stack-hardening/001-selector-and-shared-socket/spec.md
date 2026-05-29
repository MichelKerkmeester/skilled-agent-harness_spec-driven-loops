---
title: "Feature Specification: Selector fix + shared socket + client resilience"
description: "Swap the hf-local selector probe to /api/health, delete the stale Python import probe and docs, pin a shared HF_EMBED_SERVER_URL in .mcp.json and opencode.json, retry transient ECONNRESET/EPIPE resets, and make the readiness-timeout message actionable."
trigger_phrases:
  - "hf-local selector probe fix"
  - "shared HF_EMBED_SERVER_URL socket"
  - "ECONNRESET EPIPE readiness retry"
importance_tier: "important"
contextType: "general"
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
      - ".claude/mcp.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003111"
      session_id: "031-001-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Predecessor: None (foundation phase)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Selector fix + shared socket + client resilience

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Implemented (probe→/api/health; socket pinned in all 5 runtimes; embed-POST retry; 38 tests green; review clean) |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-server-liveness-supervision |
| **Handoff Criteria** | Selector picks hf-local when `/api/health` is reachable and Python is absent; both launchers resolve the same pinned socket; transient resets retry and the readiness-timeout message is actionable. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1 of 5** of the embedding-stack hardening decomposition: fix the zero-install selector, pin a shared cross-launcher socket, and harden the client against transient resets and unhelpful timeouts. Everything downstream depends on a working selector and a shared socket.

**Scope Boundary**: Rewrite the hf-local selector probe to use the existing `/api/health` probe, delete the Python import probe and stale Python docs, pin `HF_EMBED_SERVER_URL` in both launcher configs, and harden the client's retry + timeout messaging. Does NOT include server-side liveness, supervision, observability, or perf work (later phases).

**Dependencies**:
- Parent packet: `../spec.md`.
- Predecessor: None — this is the foundation phase.

**Deliverables**:
- Rewrite `probeHfLocal` to call `HfLocalProvider.canLoad` (`/api/health`) instead of the Python import probe.
- Delete `defaultPythonImportProbe`, the `runPythonImportProbe` option, and the `ProbeContext` Python field; update the cascade comment.
- Fix stale Python/sentence-transformers docs in `INSTALL_GUIDE.md`, `embedder_architecture.md`, and the `.mcp.json` `_NOTE_3_PROVIDERS`.
- Pin `HF_EMBED_SERVER_URL=unix:///tmp/mk-hf-embed/hf-embed.sock` in the `mk-spec-memory` and `mk_skill_advisor` env blocks of both `.mcp.json` and `opencode.json`.
- Add `ECONNRESET` and `EPIPE` to `isRetryableReadinessError`.
- Branch the `waitForReady` final throw on the last observed state for an actionable message.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The zero-install fallback is silently broken: `probeHfLocal` (`auto-select.ts:435-449`) still gates hf-local selection on a Python `import sentence_transformers` probe, but the post-029 server is pure-Node with zero Python, so a normal Node-only machine fails the probe, rejects hf-local, and falls through to an error or silent cloud egress. In parallel, cross-launcher sharing is dormant: `.mcp.json` and `opencode.json` pin `SPECKIT_IPC_SOCKET_DIR` to different per-service dirs with `HF_EMBED_SERVER_URL` unset, so the two launchers resolve different sockets and the single-owner machinery never fires. The client also trips its circuit breaker on transient `ECONNRESET`/`EPIPE` reaps and throws an unhelpful readiness-timeout that does not distinguish "still loading" from "unreachable".

### Purpose
Make the selector pick the working pure-Node hf-local server, pin one shared socket both launchers resolve, and harden the client so transient resets retry and timeout failures tell the operator what to do.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite `probeHfLocal` to call `HfLocalProvider.canLoad` (`/api/health`) and adapt its `{available, reason}` return to the `ProbeOutcome` shape.
- Delete `defaultPythonImportProbe`, the `runPythonImportProbe` option, and the `ProbeContext` Python field; update the cascade comment.
- Fix stale Python/sentence-transformers docs (`INSTALL_GUIDE.md:107/126`, `embedder_architecture.md`, `.mcp.json` `_NOTE_3_PROVIDERS`).
- Pin `HF_EMBED_SERVER_URL=unix:///tmp/mk-hf-embed/hf-embed.sock` in both env blocks of both `.mcp.json` and `opencode.json`.
- Add `ECONNRESET`/`EPIPE` to `isRetryableReadinessError`.
- Branch the `waitForReady` final throw on the last observed state for an actionable message.

### Out of Scope
- Server-side liveness, wedged-but-loading detection, supervision, or crash-loop cooldown (phase 002).
- Observability, model-switch, or cold-start timeout alignment (phase 003).
- Perf instrumentation, batching, latch, or cache work (phase 004).
- Live two-launcher validation or the advisor flag flip (phase 005).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `shared/embeddings/auto-select.ts` | Modify | Rewrite `probeHfLocal` to `/api/health`; delete Python probe + option + ProbeContext field; update cascade comment |
| `shared/embeddings/providers/hf-local.ts` | Modify | Add `ECONNRESET`/`EPIPE` to `isRetryableReadinessError`; branch `waitForReady` final throw; **bounded embed-POST retry** so a mid-request reap retries instead of tripping the breaker (review fix) |
| `.claude/mcp.json`, `opencode.json`, `.gemini/settings.json`, `.codex/config.toml`, `.vscode/mcp.json` | Modify | Pin `HF_EMBED_SERVER_URL=unix:///tmp/mk-hf-embed/hf-embed.sock` in `mk-spec-memory` + `mk_skill_advisor` env blocks of **all 5 runtime configs** (review fix — convergence must hold project-wide, not just Claude/OpenCode); fix `_NOTE_3_PROVIDERS` |
| `INSTALL_GUIDE.md / embedder_architecture.md` | Modify | Remove stale Python/sentence-transformers selector docs; document first-embed model download |
| `tests/embedders/hf-local-client.vitest.ts`, `tests/embedder-auto-selection.vitest.ts` | Modify | Migrate probe seam; add reset-retry / embed-POST-retry / readiness-message regression tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The selector must pick hf-local on a Node-only machine | `probeHfLocal` calls `HfLocalProvider.canLoad` (`/api/health`) and selects hf-local when the server is reachable and Python is absent |
| REQ-002 | The Python probe must be fully removed | `defaultPythonImportProbe`, the `runPythonImportProbe` option, and the `ProbeContext` Python field are deleted and the cascade comment is updated |
| REQ-003 | Both launchers must resolve the same socket | `HF_EMBED_SERVER_URL=unix:///tmp/mk-hf-embed/hf-embed.sock` is pinned in the `mk-spec-memory` and `mk_skill_advisor` env blocks of both `.mcp.json` and `opencode.json` |
| REQ-004 | Transient resets must retry | `ECONNRESET` and `EPIPE` are treated as retryable in `isRetryableReadinessError` so a mid-request reap retries instead of tripping the breaker |
| REQ-005 | Readiness-timeout must be actionable | The `waitForReady` final throw distinguishes "still loading/downloading — raise the timeout or wait" from "unreachable at &lt;target&gt;" based on the last observed state |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Stale Python selector docs must be corrected | `INSTALL_GUIDE.md`, `embedder_architecture.md`, and `.mcp.json` `_NOTE_3_PROVIDERS` no longer describe a Python/sentence-transformers selection prerequisite |
| REQ-007 | The shared socket path must dodge the macOS sun_path limit | The pinned path is short enough to stay under the macOS 104-char `sun_path` limit and resolves first in both resolvers |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A Node-only machine with the server reachable selects hf-local instead of erroring or egressing to cloud.
- **SC-002**: Both launchers resolve the identical pinned socket so the single-owner machinery can fire.
- **SC-003**: A mid-request reset retries instead of tripping the circuit breaker.
- **SC-004**: A readiness timeout reports whether the model is still loading or the server is unreachable.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Removing the Python probe changes selection on machines that still expect it | Med | Reuse `canLoad`'s existing `{available, reason}` contract; the pure-Node server is the only supported local path post-029 |
| Risk | A short `/tmp` socket path may collide across users on shared hosts | Med | Keep the path canonical and let later phase-005 perimeter hardening assert ownership |
| Risk | Over-broad retry classification could mask real failures | Med | Restrict retry to `ECONNRESET`/`EPIPE` only; the breaker still trips on persistent errors |
| Risk (accepted) | Reset-retry extends worst-case hard-down readiness latency to the full `HF_EMBED_SERVER_READY_TIMEOUT_MS` (default 45s) per attempt; the embed-POST retry is bounded at 2 attempts to cap it | Low | Accepted tradeoff (availability over fast-fail); the 2-attempt embed-POST cap + the breaker's threshold bound the stall before BM25 fallback engages |
| Risk (accepted) | The two cascade consumers probe the shared socket at different default ceilings (spec-memory 5000ms vs skill-advisor 2500ms) — newly effective once the probe honors `context.timeoutMs` | Low | Marginal: the ceiling governs a sub-50ms local `/api/health` GET (the launcher answers `503 loading` immediately). `SPECKIT_CASCADE_PROBE_TIMEOUT_MS` raises the floor for both without code edits; threading an explicit shared timeout into skill-advisor is deferred to a fast-follow |
| Dependency | 029 hf-local HTTP client + `/api/health` probe | High | The new selector reuses the shipped `canLoad` probe rather than inventing one |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the pinned socket dir be created/owned by the launcher at startup, or left to phase-005 perimeter hardening?
- Should the actionable timeout message include the current `HF_EMBED_SERVER_READY_TIMEOUT_MS` value inline?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
**Given**
**Given**
**Given**
**Given**
**Given**
-->
