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
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/003-daemon-reliability-research"
    last_updated_at: "2026-05-28T18:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Iters 2-3 (Opus, adversarial) corrected RC-1 to the sidecar, refuted RC-5, hardened roadmap (§6)"
    next_safe_action: "Open a follow-on packet to implement the §6 hardened roadmap (sidecar-scoped first)"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/003-daemon-reliability-research/research/research.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000304"
      session_id: "030-impl-summary"
      parent_session_id: null
    completion_pct: 70
    open_questions: []
    answered_questions:
      - "Dominant RC-1 RSS is in the forked SIDECAR process, not the daemon singleton (corrected iter 2-3)"
      - "Forced reconnects are bridge-to-dead-socket (existsSync, no liveness probe)"
      - "RC-5 IPC leak is refuted; transparent daemon respawn breaks the MCP session (use graceful-exit)"
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
| **Spec Folder** | 003-daemon-reliability-research |
| **Completed** | 2026-05-28 (research phase) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet explains why the MCP daemons kept dying and disconnecting all session, and hands off a ranked, evidence-backed roadmap to stop it. It is research only — no runtime code changed here. The full analysis lives in `research/research.md`; this summary is the executive view.

### Root causes (4 independent defects)

The failures were never one bug. In impact order: (RC-1) **OOM at ~1–2 GB RSS** is driven by native ONNX/ORT model memory — held as a process-lifetime singleton and made worse because `invalidateProviderSingleton()` nulls the old provider without disposing it, orphaning a full model's native memory on every swap; `--max-old-space-size` cannot bound that, and there is no RSS watchdog. (RC-2) **Nothing auto-restarts** a dead daemon — the launcher clears its lease and exits, so recovery is a manual `/mcp` reconnect. (RC-3) **Reconnects bridge to a dead socket**: the IPC bridge connects whenever the socket file exists (`fs.existsSync`) without probing that anything is listening, and a SIGKILL/OOM'd daemon leaves a stale socket, so the reconnect "succeeds" into nothing. (RC-4) **Rebuilding crashes the running daemon** because the build deletes `dist/` in place while lazy-loaded modules and the forked sidecar still read from it. A slow IPC per-connection leak (RC-5) compounds reconnect churn.

### Ranked durable fixes — then hardened by two Opus convergence iterations

The first pass proposed six fixes (F1–F6). Two further Opus iterations (deepen-design, then adversarially refute) then found **every top fix unsafe as first framed** and corrected the analysis — see `research/research.md` §6 and `research/iterations/iteration-00{2,3}.md`. The decisive correction: under the default `auto` policy the ~1–2 GB model RSS lives in a **forked sidecar process**, not the daemon — so the OOM fix must target the sidecar. Other corrections: transparent daemon respawn **breaks the MCP `initialize` session** (use graceful-exit-then-relaunch instead); F2's in-flight gate must track the native run, not the JS timeout, or it segfaults; F1+F3 can **steal each other's socket** (split-brain) unless the lease records the child pid and respawn funnels through one lock; and **RC-5 is refuted — F5 should not be built**. The hardened, re-sequenced roadmap is §6.4.

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
| Hybrid (parallel fan-out then convergence) over a full 10-iteration sequential loop | The user asked for parallel + max sub-agents; breadth-first plus targeted verification was faster — and the 2 Opus convergence iterations then caught four flaws the single pass missed |
| Keep this packet research-only | The fixes touch the launcher and the embedding singleton (critical paths); they deserve their own implementation packet with isolated tests, not a rushed end-of-session edit |
| Adversarial convergence (Opus skeptics) before any implementation | It corrected RC-1's process scope (sidecar, not daemon), killed an unsafe transparent-respawn design, and refuted RC-5 — preventing a plausible-but-wrong roadmap from being implemented |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Top-3 root-cause claims verified by direct read | PASS (no dispose in invalidateProviderSingleton; existsSync-only bridge; in-place dist clean) |
| Iter 2-3 adversarial convergence (4 Opus skeptics) | PASS — all 4 verdicts `designHoldsUp:false`; corrected RC-1 (sidecar), refuted RC-5, hardened F1/F2/F3 |
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
