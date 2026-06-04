---
title: "Deep Research: Launcher Concurrency Spawn & Bridge Investigation"
description: "Validated root causes of two spec-kit launcher/MCP/embedder runtime defects (T1 hf-local spurious spawn; T2 code-index+advisor daemon bridge not serving) plus a unified design-conformance fix plan. Read-only research; no code changed."
---

# Deep Research — Launcher Concurrency Spawn & Bridge Investigation

> READ-ONLY research packet. 5 iterations, native executor. No source/config was modified. Canonical synthesis. Companion handover updated separately.

## 1. Executive Summary

Two runtime defects in the spec-kit launcher-coordination layer, both triggered by the owner's **heavy concurrent-session workflow** (observed live: 2 Claude + 4 `codex gpt-5.5` sessions sharing one repo), were investigated and root-caused with **HIGH confidence**:

- **T1 — hf-local model server spurious spawn.** The hf-local ONNX model server is spawned at startup by a **launcher liveness probe**, not by any embedder/pointer path. `probeModelServer` sends a literal `GET /api/health`; the cold-state demand listener `handleModelServerDemand` treats *any* HTTP request as an embed demand and `launch()`es. Under launcher **overlap**, a new model-server owner's boot probe lands on a live sibling's cold listener → spawn → (on this Ollama host) crash-loop → give-up marker. **Confirmed (HIGH).**
- **T2 — `mk_code_index` + `mk_skill_advisor` disconnect for secondary sessions.** Packet 012 *did* build the daemon IPC bridge so secondaries attach instead of exiting `LEASE_HELD_BY (no-bridge-socket)`. The bridge bind runs un-gated in the running daemons and the socket inodes are created at startup — but the later-added security gate **`canUnlinkExistingSocket()` aborts the bind on a benign EADDRINUSE/TOCTOU** (no ENOENT guard), **orphaning the inode** under N-way primary contention. Secondaries then can neither attach nor take over → they wedge. **Confirmed (HIGH).**

Both are **launcher-overlap-under-concurrency** consequences. A **unified, design-conformance fix** is specified (§12) with **GO** (T1) and **GO-WITH-CONDITIONS** (T2) verdicts. The `onnxruntime-common` topology break is **orthogonal** (it only makes T1's already-unwanted spawn fail *loudly*; it matters only on non-Ollama hosts).

## 2. Research Question & Scope

Validate/refute/refine two prior static root-cause findings, ground them in the original design intent (ADR-013→014; the `006-mcp-launcher-concurrency` arc), and produce one unified design-conformance fix plan. Read-only; propose only. Out of scope: implementing fixes, the `onnxruntime` topology repair, scanning the (intentionally empty) code graph.

## 3. Methodology

5 sequential `@deep-research` iterations (Opus, native), fresh context each, externalized JSONL/delta state, adversarial completeness critic in the final pass. Evidence is `file:line`-cited against the **Public source** (the canonical tree; Barter `coder/.opencode` is a gitignored mirror). Live runtime state was inspected read-only (`ps`, `lsof`, `sqlite3` SELECT, marker/`ls`), deliberately **never** connecting to `hf-embed.sock` (a request triggers the very spawn under study).

newInfoRatio trajectory: 0.90 → 0.70 → 0.60 → 0.50 → (final critic) — clean convergence; stop reason `maxIterationsReached` with all key questions answered.

## 4. Background & Design Context

- **ADR-014** (local-first cascade): Ollama tier-1; **hf-local is a zero-install fallback meant to stay COLD on Ollama hosts**, woken lazily on first embed demand. `/api/health` is defined as a **liveness READ** (`embedder_architecture.md:47-58`).
- **Single resident model server**: `mk-spec-memory` and `mk_skill_advisor` share ONE `hf-embed.sock`; the launcher lazily spawns + supervises it (crash-loop guard `MAX_DEATHS=3`, give-up cooldown).
- **`006-mcp-launcher-concurrency` arc** (13 packets): multi-session coordination. `010-multi-client-stdio-socket-bridge` introduced the stdio↔socket bridge (daemon side shipped for mk-spec-memory only); `012-daemon-bridge-socket-for-skill-advisor-and-code-index` lifted it into the advisor + code-index daemons so secondaries attach. `012` was smoke-tested single-secondary only (**SC-004 explicitly notes runtime was not directly verified**).

## 5. Thread 1 — Root Cause: probe == demand

The hf-local spawn is **demand-driven by the launcher's own liveness probe**, independent of embedder selection:

- `probeModelServer` (`.opencode/bin/lib/launcher-ipc-bridge.cjs:230-306`) builds (`:240`) and writes (`:269`) a literal `GET /api/health HTTP/1.1` request to the model-server socket.
- `prepareModelServerDemandTarget` (`.opencode/bin/lib/model-server-supervision.cjs:1160-1168`) probes any **pre-existing** socket at boot.
- `handleModelServerDemand` (`:1204-1238`) calls `getSupervisor().launch()` on **any** HTTP request when no give-up cooldown is active. `routePath` is used **only for the log line** (`:1205,:1216`) — there is **no `/api/health` allowlist**. `MODEL_SERVER_DEMAND_STATUS = 503` (`:33`).
- The idle monitor (`:1045-1090`) is **spawn-safe** — it only probes when a model server already runs (`getPid()` guard `:1049-1050`).

**Why it fires despite valid Ollama pointers:** the embedder paths all short-circuit (auto-select cascade `shared/embeddings/auto-select.ts:528-545`; advisor `ensureActiveEmbedder` `embedders/schema.ts:223-230`; `embedder_status` only touches hf-local when `effectiveProvider==='hf-local'`, `handlers/embedder-status.ts:62-67`). The probe path reads none of that. **Triggering precondition = launcher OVERLAP**: a launcher becoming the model-server owner while a live sibling still holds the *cold* demand listener → the new owner's probe is received as demand → spawn. Sequential (non-overlapping) boots avoid it, which is why give-up markers are occasional, not constant.

## 6. Thread 1 — The fix-conformance constraint (critical)

The naïve fix ("make `GET /api/health` non-spawning; only a POST embed wakes") is **RULED OUT**: the **genuine consumer also wakes via `GET /api/health`**. `HfLocalProvider`'s real embed path does `embedPrepared` (`hf-local.ts:826-833`) → `waitForReady` (`:718-785`) → `healthOnce` `GET /api/health` (`:712`), *then* `POST /api/embed` (`:835`). Suppressing health-triggered spawn would break real hf-local hosts. **T1 is a known-but-untested seam**: spawn-on-health is *by design* (the lazy first-embed trigger, `010/004-launcher-supervision/implementation-summary.md:50`, REQ-001 `:126`); the probe-vs-demand discriminator was a **documented OPEN QUESTION never closed** (`004/spec.md:170`); the sibling-overlap probe was never anticipated.

**Conformant fix:** the launcher's *internal* probe must be distinguishable from a *consumer* demand — a dedicated probe-marker header (see §12).

## 7. Thread 2 — Root Cause: the bind aborts on a benign socket race

The bridge is **present and serving-capable**, but aborts under concurrency:

- The bind runs **un-gated** after `server.connect(stdioTransport)` in both *running* artifacts: code-index `dist/index.js:127`, advisor `dist/mcp_server/advisor-server.js:232`. Not a missing feature, not gated off, not an un-rebuilt dist.
- The socket inodes **were created at startup** (`srw-------`, mtime = owner boot): `chmod 0o600` runs only *after* a successful `listen` (`lib/ipc/socket-server.ts:260-262`), so binding succeeded at least once.
- Yet live `lsof` shows **no FD holder** on `/tmp/mk-code-index/daemon-ipc.sock` and `/tmp/mk-skill-advisor/daemon-ipc.sock`, while `/tmp/mk-spec-memory/daemon-ipc.sock` **has** one (daemon pid 61626) — despite both code-index (60718) and advisor (61317) daemons being alive and heartbeating their leases.

**Mechanism:** the two failing copies carry a later-added security gate **`canUnlinkExistingSocket()`** (`.../socket-server.ts:118-131`) used on the EADDRINUSE reclaim path. It does `fs.lstatSync` with **no ENOENT guard** (`:123`) and refuses on uid/realpath/isSocket mismatch (`:120-128`). Under N-way **primary-vs-primary** EADDRINUSE contention this throws ENOENT (TOCTOU: the racing peer unlinked between stat and use) or refuses, and the caller `throw err` (`:242-243`) **aborts the bind**, leaving the owner without a served socket (orphaned inode). `close()` is **byte-identical** across copies (`:224-247` vs `:269-292`), so a teardown/close race is **ruled out**. Secondaries never bind (`mk-code-index-launcher.cjs:100-130`) — the racer is a **second primary** under overlap. Drift is post-012 (`012/implementation-summary.md:104` copied verbatim; the gate, `DR-008`, was added later and never reconciled across the three copies).

## 8. Thread 2 — The security-intent correction (make-or-break)

The intuitive fix ("converge toward spec-memory's permissive copy") is **WRONG and would reopen a security hole**. The completeness-critic pass established:

- **spec-memory's permissive copy is the OLDER, UN-hardened one** and is itself vulnerable to the `DR-008-01` threat — it unconditionally `fs.unlinkSync`+rebinds on EADDRINUSE (`system-spec-kit/.../socket-server.ts:196-207`) with **no dir-ownership / foreign-node check**.
- `canUnlinkExistingSocket` (uid/realpath/isSocket fence) is a **genuine security improvement** guarding against an attacker-planted `/tmp/mk-<svc>/` dir or a foreign-owned/symlinked socket node.

**Therefore the fix is "race-safe, NOT permissive":** keep the gate's *refuse-to-unlink-foreign-node* fence; fix only the *abort-bind-on-benign-stale/TOCTOU* path (ENOENT → treat as reclaimable; lstat/realpath best-effort; never `throw` to abort the bind). Reconvergence must level **spec-memory UP** to the hardened-race-safe contract, not level the others down.

## 9. Cross-Cutting Analysis

T1 and T2 are the **same root condition** — incomplete handling of **launcher overlap under concurrent multi-session use** — surfacing in two subsystems:
- T1: an internal liveness probe is indistinguishable from a consumer demand at the demand listener.
- T2: a hardened bind aborts on a benign concurrent-primary socket race instead of reclaiming.

Neither manifests in single-session/sequential use, which is why both evaded prior single-secondary smoke tests.

## 10. Live Evidence Snapshot (point-in-time, read-only)

- Give-up marker `/tmp/mk-hf-embed/hf-embed-giveup.json`: `writtenAt 2026-06-04T15:21:26.973Z`, pid 44195, cooldown long-expired (stale). `hf-embed.sock` held by cold demand listener pid 61625.
- Embedder pointers valid at the 15:21 spawn: memory `vec_metadata` created `2026-06-04 07:01` provider=ollama; advisor `2026-05-21`; `nomic-embed-text:v1.5` pulled (so `probeOllama` succeeds); advisor `vec_768 = 22 = skill_nodes`.
- `lsof` asymmetry: spec-memory daemon-ipc.sock has a listener + client FDs; code-index/advisor have none (stale inode).
- Concurrency: owner Claude (60494) holds the live trio; a 2nd Claude (8421) + 4 `codex gpt-5.5 xhigh exec` (62664/65/66/69) each spawned launchers; the 4 codex code-index launchers were alive ~49 MB (wedged).

## 11. Design-Intent Reconciliation

- **T1**: spawn-on-health is intended laziness; the gap (probe≠demand) is a *documented, never-closed* open question — the fix *closes* it rather than inventing behavior.
- **T2**: 012 delivered the bridge correctly for the single-secondary case it tested; the failure is a *post-012 drift* (the `DR-008` security gate) interacting badly with an *untested* N-way-primary race. 012's own OPEN QUESTION about consolidating the three `socket-server.ts` copies is the right home for the reconvergence.

## 12. Unified Design-Conformance Fix Plan (PROPOSAL — not implemented)

Ship **T2 first** (active wedge degrading live sessions), then **T1** (independent seam):

**T2 — race-safe reclaim + reconverge (GO-WITH-CONDITIONS):**
1. Make `canUnlinkExistingSocket` race-safe in BOTH failing copies: ENOENT → treat as reclaimable (the node is already gone); lstat/realpath checks best-effort; **never `throw` to abort the bind** on a benign stale/TOCTOU case. **Keep** the foreign-node refusal (the security fence).
2. Reconverge the three `socket-server.ts` copies behind one shared module (012's deferred consolidation), leveling spec-memory **UP** to the hardened-race-safe contract. Add a drift check.
3. **Condition:** the fix packet MUST preserve + document the gate; it must NOT "simplify" by deleting it.

**T1 — probe-marker header (GO):**
1. Emit `X-Speckit-Probe: liveness` in `probeModelServer`'s request (`launcher-ipc-bridge.cjs:240`).
2. In `handleModelServerDemand` (`model-server-supervision.cjs:1216`, before `launch()`) read `request.headers['x-speckit-probe']`; when present, return a non-spawning liveness reply.
3. Genuine consumers (`hf-local.ts`) do not send the header, so the lazy first-embed wake (GET health + POST embed) contract holds. Optional defense-in-depth: `prepareModelServerDemandTarget` (`:1160-1201`) defers when the respawn lock is held by a live sibling.

**Minimal fix surface:** T1 = 2 files (`launcher-ipc-bridge.cjs`, `model-server-supervision.cjs`); T2 = 2 daemon copies (+ optional shared module). Both durable in **Public source**.

## 13. Risk Assessment & Verdicts

| Thread | Verdict | Confidence | Key residual risk |
|--------|---------|------------|-------------------|
| T1 probe-marker | **GO** | HIGH | header must survive the raw HTTP/1.1 write+parse round-trip; verify all `probeModelServer` call-sites carry it and no consumer path sets it |
| T2 race-safe gate + reconverge | **GO-WITH-CONDITIONS** | HIGH | must keep the security fence (do not regress to permissive); per-package socket/db path divergence must be preserved during reconvergence |

`onnxruntime-common` topology break: **orthogonal**, portability-only (non-Ollama hosts); not required for either fix on this host.

## 14. Verification / Test Strategy (for the future fix packet)

- **T2**: a deterministic **N-way-primary** test — force two daemons to contend the same socket path under EADDRINUSE and assert the survivor ends up **serving** (lsof shows a holder), plus a foreign-node test asserting the security fence still refuses to unlink an attacker-owned node.
- **T1**: a **probe-no-spawn** assertion (probe with the marker header → demand listener returns liveness, no `launch()`), paired with a **consumer-still-wakes** assertion (no header → spawn fires).

## 15. Ruled-Out Directions (negative knowledge)

- T2 ≠ "bridge never implemented / launcher lacks front-proxy" (it's daemon-side per 012).
- T2 ≠ regression that removed the bind, ≠ conditional gate, ≠ un-rebuilt dist, ≠ `close()`/teardown race (close is byte-identical).
- T2 fix ≠ "make it permissive like spec-memory" (reopens DR-008-01).
- T1 ≠ embedder cascade / pointer-unset bootstrap (pointers were valid; cascade short-circuits).
- T1 fix ≠ suppress `GET /api/health` (breaks genuine consumer wake).

## 16. Open Questions & Follow-ups

- Should the optional defense-in-depth (defer probe when respawn-lock held by a live sibling) ship with T1 or as a separate hardening step?
- Does the OpenCode plugin's `bridgeTimeoutMs=1000` (012 OPEN QUESTION) need raising once T2 serves reliably?
- Is a drift-detection CI check warranted for the (to-be) shared `socket-server.ts` module?

## 17. References

- Source: `.opencode/bin/lib/{model-server-supervision.cjs, launcher-ipc-bridge.cjs}`, `.opencode/bin/{mk-spec-memory,mk-code-index,mk-skill-advisor}-launcher.cjs`, `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts`, `…/auto-select.ts`, `…/factory.ts`, `…/handlers/embedder-status.ts`, `…/embedders/schema.ts`, `…/{system-skill-advisor,system-code-graph,system-spec-kit}/mcp_server/.../lib/ipc/socket-server.ts`.
- Prior design: arc `006-mcp-launcher-concurrency` (esp. 010, 012, 007); `010-embedding-consolidation-hf-local-server`; `references/memory/embedder_architecture.md` + `embedding_resilience.md` (ADR-013→014).
- Iteration evidence: `research/iterations/iteration-001..005.md`; structured deltas `research/deltas/iter-001..005.jsonl`.
- Resource inventory: `research/resource-map.md`.

---

## Convergence Report

- **Stop reason:** maxIterationsReached (all key questions answered)
- **Total iterations:** 5
- **Questions answered:** 5 / 5
- **Remaining questions:** 0
- **Iteration summaries:** run 1: T2 bridge-not-serving (0.90) · run 2: T2 root-cause lock — inverted asymmetry (0.70) · run 3: T1 probe=demand + embed-path-wakes-via-health (0.60) · run 4: unified fix plan; T1 known-but-untested (0.50) · run 5: completeness critic — security-intent correction; GO/GO-WITH-CONDITIONS
- **Convergence threshold:** 0.05 (newInfoRatio, negative-knowledge emphasis)
- **Net correction value:** the loop overturned two intermediate fix shapes (suppress-health for T1; permissive-reclaim for T2), preventing a consumer-breaking and a security-regressing fix respectively.
