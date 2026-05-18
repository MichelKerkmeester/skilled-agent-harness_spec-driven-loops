---
title: "Implementation Summary: llama-cpp Metal Investigation [template:level_1/implementation-summary.md]"
description: "Research packet delivered local evidence for node-llama-cpp Metal initialization failures and recorded an ADR recommendation. No source code or existing packet was changed."
trigger_phrases:
  - "implementation"
  - "summary"
  - "llama-cpp"
  - "Metal"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/041-llama-cpp-metal-investigation"
    last_updated_at: "2026-05-14T15:55:00Z"
    last_updated_by: "orchestrator-post-investigation"
    recent_action: "Recorded Option A execution outcome"
    next_safe_action: "Reopen if Metal perf degrades"
    blockers: []
    key_files:
      - "research.md"
      - "decision-record.md"
      - "scratch/probe-gpulayers-zero-auto.txt"
      - "scratch/probe-gpulayers-zero-cpu.txt"
    session_dedup:
      fingerprint: "sha256:264f1497580860d4381e24d976a63c1dd8965bc48eb729864cd484e9aa0eecc0"
      session_id: "cli-codex-gpt5.5-xhigh-fast-041"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A gpuLayers-only change is not supported by the current provider evidence because gpuLayers already defaults to 0."
      - "Option A (rebuild from source against local Darwin 25.4 SDK) was executed post-ADR and succeeded; the Metal kernel-init warnings persist but are cosmetic — Metal is the active backend and embeddings run at GPU speeds (4ms warm short, 265ms warm long, 452ms cold first)."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `041-llama-cpp-metal-investigation` |
| **Completed** | 2026-05-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet captures why llama-cpp embeddings are noisy and slower on the current macOS arm64 environment. It does not change runtime behavior; it gives the next implementation packet a bounded cause analysis and an ADR.

### Research Packet

The research ties together the observed stderr, local platform state, package version, Metal prebuilt metadata, provider behavior, and scratch runtime probes. The strongest evidence points to Metal backend initialization compatibility, not GGUF model corruption or a missing `gpuLayers: 0` setting.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | Defines research-only scope and exclusions |
| `plan.md` | Created | Records evidence collection and validation plan |
| `tasks.md` | Created | Tracks packet tasks |
| `implementation-summary.md` | Created | Summarizes findings and decision |
| `research.md` | Created | Documents cause analysis and hypotheses |
| `decision-record.md` | Created | Records ADR recommendation |
| `description.json` | Created | Provides packet identity metadata |
| `graph-metadata.json` | Created | Provides packet graph metadata |
| `scratch/` | Created | Stores probe script and captured outputs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work used read-only probes plus one scratch script in the 041 packet. No source code, existing spec packet, live MCP process, or parallel 040 folder was modified.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Recommend Option C for this packet: defer implementation | The provider already defaults `gpuLayers` to 0, while `getLlama()` still selects the Metal prebuilt; a gpuLayers-only patch is unlikely to silence backend initialization warnings. |
| Treat H5 as the leading hypothesis | The installed Metal prebuilt was built for macOS platform version 25.3.0, while this machine runs Darwin 25.4.0 / macOS 26.4, and the failure happens in Metal backend initialization. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pre-check `ls .../014-local-embeddings-migration/ \| grep '^041-'` | PASS, no existing 041 folder |
| Scratch auto backend probe | FAIL as expected for evidence, Metal context creation failed even with explicit `gpuLayers: 0` |
| Scratch CPU backend probe with `build: "never"` | FAIL as expected for evidence, no CPU prebuilt binary found |
| Strict spec validation | PASS, exit 0 |
| **Post-ADR Option A executed** (rebuild from source via `node-llama-cpp source build --gpu metal` against Xcode 26.2 / Darwin 25.4 SDK after `brew install cmake`) | **PASS, build exit 0; new binaries at `node_modules/node-llama-cpp/llama/localBuilds/mac-arm64-metal/Release/`** |
| **Post-rebuild direct `getLlama("lastBuild")` + `getLlama(<default>)` warm embeds** | **PASS, ~3-4ms per short embed, ~265ms warm long, ~452ms cold first — definitively Metal-accelerated** |
| **Post-rebuild live MCP `memory_search` query latency** | **PASS, total 38ms (stage1 candidate gen + embed: 33ms)** |
| **Post-rebuild `memory_health` reports** | `embeddingProvider.healthy: true`; `failed: 0`; `flapping: false`; `transitionsInLast10Min: 0` (was false/214/true/3 pre-rebuild) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **External release notes were not checked during the research phase.** Network access was disabled at that time. Post-investigation execution proved unnecessary — the rebuild succeeded against local SDKs.
2. **The ADR recommendation has been superseded operationally.** Option C (defer) was the right call given the evidence available at the time. After this packet shipped, a one-line `brew install cmake` + `node-llama-cpp source build --gpu metal` executed Option A successfully — Metal is now operational. The kernel-init warnings still fire but are cosmetic; `llama.gpu` returns `'metal'` and embeddings run at GPU speeds.
3. **The "tensor API is not supported - disabling" warning is misleading.** It logs during early Metal backend handshake but a fallback compile path succeeds — embeddings run on the GPU. Pre-rebuild AND post-rebuild both emit this warning. Treat it as noise unless `llama.gpu` returns something other than `'metal'`.
4. **CPU backend proof is incomplete.** `getLlama({ gpu: false, build: "never" })` fails because the current install has no CPU-only prebuilt binary. Not a regression — orthogonal to Metal status.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
