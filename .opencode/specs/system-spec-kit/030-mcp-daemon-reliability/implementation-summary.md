---
title: "Implementation Summary: MCP daemon reliability investigation"
description: "Research-only packet. Root-caused the recurring mk-spec-memory/mk_code_index disconnects and OOM deaths via a hybrid parallel fan-out + convergence investigation, and produced a ranked durable-fix roadmap. No code changed in this packet; fixes land in a follow-on."
trigger_phrases:
  - "mcp daemon reliability summary"
  - "daemon oom root cause summary"
  - "daemon durable fix roadmap summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/030-mcp-daemon-reliability"
    last_updated_at: "2026-05-28T18:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed research synthesis + packet docs; root causes RC1-RC5, fixes F1-F6"
    next_safe_action: "Open a follow-on packet to implement F2 then F1 then F3"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/030-mcp-daemon-reliability/research/research.md"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/shared/embeddings.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000304"
      session_id: "030-impl-summary"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions:
      - "OOM driver is native ONNX/ORT memory + undisposed provider swaps, not JS caches"
      - "Forced reconnects are bridge-to-dead-socket (existsSync, no liveness probe)"
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
| **Spec Folder** | 030-mcp-daemon-reliability |
| **Completed** | 2026-05-28 (research phase) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet explains why the MCP daemons kept dying and disconnecting all session, and hands off a ranked, evidence-backed roadmap to stop it. It is research only — no runtime code changed here. The full analysis lives in `research/research.md`; this summary is the executive view.

### Root causes (4 independent defects)

The failures were never one bug. In impact order: (RC-1) **OOM at ~1–2 GB RSS** is driven by native ONNX/ORT model memory — held as a process-lifetime singleton and made worse because `invalidateProviderSingleton()` nulls the old provider without disposing it, orphaning a full model's native memory on every swap; `--max-old-space-size` cannot bound that, and there is no RSS watchdog. (RC-2) **Nothing auto-restarts** a dead daemon — the launcher clears its lease and exits, so recovery is a manual `/mcp` reconnect. (RC-3) **Reconnects bridge to a dead socket**: the IPC bridge connects whenever the socket file exists (`fs.existsSync`) without probing that anything is listening, and a SIGKILL/OOM'd daemon leaves a stale socket, so the reconnect "succeeds" into nothing. (RC-4) **Rebuilding crashes the running daemon** because the build deletes `dist/` in place while lazy-loaded modules and the forked sidecar still read from it. A slow IPC per-connection leak (RC-5) compounds reconnect churn.

### Ranked durable fixes

Six fixes (F1–F6), sequenced F2 → F1 → F3 → F4 → F5 → F6: dispose the provider on invalidate (F2, cheap, stops the worst leak), add a launcher RSS-ceiling watchdog + supervised auto-respawn (F1, the safety net), liveness-probe before bridging + respawn on a dead socket (F3, kills the forced-reconnect loop), build to a temp dir + atomic rename (F4), close the per-connection server on disconnect (F5), plus defense-in-depth env/sidecar tuning (F6). F1+F3 together would have eliminated nearly all the manual reconnects seen this session.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `research/research.md` | Created | Full root-cause analysis (RC-1..RC-5) + ranked fixes (F1..F6) with file:line evidence |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created | Level 1 packet docs framing the investigation and roadmap |
| (no runtime code) | — | Fixes are specified here and implemented in a follow-on packet |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A hybrid investigation: five read-only sub-agents ran in parallel, one per failure facet (memory/OOM, launcher lease + IPC bridge, rebuild fragility, supervision gap, timer/listener leaks). Their findings were mutually consistent, and a convergence pass verified the three highest-impact claims by direct file read — `invalidateProviderSingleton` has no `.dispose()`, the bridge uses `existsSync` + `createConnection` with no liveness check, and the mcp_server build deletes `dist/` in place. The JS-cache-leak hypothesis was ruled out by every relevant agent: all in-process caches are bounded.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Hybrid (parallel fan-out then convergence) over a full 10-iteration sequential loop | The user asked for parallel + max sub-agents; much of the root cause was already known from this session, so breadth-first plus targeted verification was faster and sufficient |
| Keep this packet research-only | The fixes touch the launcher and the embedding singleton (critical paths); they deserve their own implementation packet with isolated tests, not a rushed end-of-session edit |
| Name native ORT memory (not JS caches) as the OOM driver | Convergent evidence: caches are bounded, the model singleton plus undisposed swaps are not, and `--max-old-space-size` does not bound native memory |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Top-3 root-cause claims verified by direct read | PASS (no dispose in invalidateProviderSingleton; existsSync-only bridge; in-place dist clean) |
| Cross-agent consistency | PASS (no contradictions; JS-cache-leak hypothesis ruled out by all) |
| Spec validation (`validate.sh --strict`) | PASS |
| Fixes implemented | N/A — deferred to follow-on packet by design |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Research only — no fix is live yet.** The recurring failures persist until a follow-on packet implements F1–F5. Until then, the manual `/mcp` reconnect remains the workaround.
2. **One facet (IPC per-connection leak, RC-5) is lower-confidence** than the OOM/bridge findings. Confirm with a reconnect-churn RSS trace before investing heavily in F5.
<!-- /ANCHOR:limitations -->
