---
title: "Implementation Summary: Build hf-model-server.cjs local HTTP model server"
description: "Implemented. Pure-Node hf-model-server.cjs (HTTP/UDS) wrapping the ported transformers load; binds before load (/api/health during cold start), /api/embed awaits in-flight load, runtime-derived dim, prefix-agnostic. Headless-verified (node --check + 7 vitest) and adversarially reviewed (0 defects). NOT yet wired in (phases 003/004)."
trigger_phrases:
  - "hf-model-server HTTP/UDS service implementation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/002-hf-model-server"
    last_updated_at: "2026-05-29T07:55:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented hf-model-server via codex gpt-5 xhigh; review clean; 7 vitest green"
    next_safe_action: "Phase 003: rewrite hf-local.ts as an HTTP client against this server"
    blockers: []
    key_files:
      - ".opencode/bin/hf-model-server.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000592"
      session_id: "029-002-impl-summary"
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
| **Spec Folder** | 002-hf-model-server |
| **Completed** | 2026-05-29 (implemented + headless-verified; not yet wired in — phases 003/004) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`.opencode/bin/hf-model-server.cjs` — a hand-written pure-Node CommonJS local HTTP/UDS embedding model server (a "mini-ollama"), ~770 LOC. It dynamic-`import()`s `@huggingface/transformers` and ports the `HfLocalProvider.getModel()` load logic verbatim (MPS→CPU device fallback, `MODEL_LOAD_TIMEOUT=120000`, dtype resolution default q8, `loadingPromise` single-flight, dispose-drain + `getSessionCount===1` single-session assertion). It binds the listener BEFORE the model load resolves, so `GET /api/health` answers `{state:'loading'}` during the 15-30s cold start and `'ready'` after; `POST /api/embed {model,input}` awaits the in-flight load mid-request then returns `{embeddings,dim}` with the dim runtime-derived from the first vector length. Default UDS at `<dbDir>/hf-embed.sock` (mkdir 0o700, unlink-before-listen) with a `tcp://` fallback. The server is prefix-agnostic (clients own `PREFIX_REGISTRY`). It is NOT yet wired into any provider/launcher — phases 003 (client) and 004 (supervision) do that.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/hf-model-server.cjs` | Create | Pure-Node HTTP/UDS model server: `/api/embed` + `/api/health`, ported load logic, runtime dim, prefix-agnostic, injectable for tests via `require.main` guard |
| `mcp_server/tests/embedders/hf-model-server.vitest.ts` | Create | 7 headless tests (injectable mock load): require-safety, listen-target resolution, loading-then-ready health, mid-load embed await + runtime dim, single-session dispose assertion, self-warm-failure-stays-ready, null-body→400 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented by a `cli-codex` dispatch (`gpt-5.5`, xhigh reasoning, fast tier, `--sandbox workspace-write`) fenced to the new server + test (`hf-local.ts` reference-only). The orchestrator ran independent verification (node --check + vitest) and a 4-lens opus adversarial review (load-port fidelity, readiness, transport/dim, test/scope) — 0 confirmed defects, port confirmed faithful. The review noted two minor non-defects which the orchestrator fixed: self-warm failure no longer pins `state:'error'` (the model loaded — important so phase-004's `probeModelServer` won't reap a working server), and a null/non-object embed body now returns 400 instead of a leaky 500; both locked with new tests.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep implementation status pending | This pass is spec authoring only; implementation must occur in a later scoped session |
| Preserve Level-1 anchors and phase headers from the reference packet | The validator enforces template shape and anchor consistency |
| Include concrete verification command tokens | Future implementers need runnable checks, and implementation-summary verification must not be vague |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check .opencode/bin/hf-model-server.cjs` | PASS |
| `vitest run tests/embedders/hf-model-server.vitest.ts` | PASS (7/7) |
| `npm run build --workspace=@spec-kit/mcp-server` (tsc unaffected by the new .cjs) | PASS |
| 4-lens opus adversarial review (load-port / readiness / transport-dim / test-scope) | PASS — 0 confirmed defects; load-port faithful; 2 minor non-defects fixed |
| `validate.sh --strict` on this packet | PASS |
| SC: live model load / RSS / real cold-start | DEFERRED — needs a running server (live verification when wired in via phase 004) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not yet wired in** — the server is standalone; nothing spawns it or routes embeds to it until phase 003 (client) + phase 004 (launcher supervision). Verified headlessly only.
2. **Live model-load not exercised** — the tests inject a mock load (no real 274MB model / 15-30s cold start); a live load + RSS check is the natural follow-up once phase 004 supervises it.
3. **Single-resident-model v1** — a request for a different model than the loaded one returns 404 (clients fall back); multi-model residency is out of scope by design.
<!-- /ANCHOR:limitations -->

