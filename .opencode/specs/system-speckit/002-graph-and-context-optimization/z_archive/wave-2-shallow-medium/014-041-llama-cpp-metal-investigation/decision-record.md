---
title: "Decision Record: llama-cpp Metal Investigation [template:level_3/decision-record.md]"
description: "ADR for choosing the next path after local node-llama-cpp Metal backend initialization failures."
trigger_phrases:
  - "decision"
  - "ADR"
  - "llama-cpp"
  - "Metal"
  - "gpuLayers"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/z_archive/wave-2-shallow-medium/014-041-llama-cpp-metal-investigation"
    last_updated_at: "2026-05-14T15:55:00Z"
    last_updated_by: "orchestrator-post-investigation"
    recent_action: "Recorded post-decision execution outcome: Option A succeeded operationally despite ADR recommending defer"
    next_safe_action: "Operate under restored Metal path. Reopen ADR only if Darwin/SDK drift surfaces again."
    blockers: []
    key_files:
      - "research.md"
      - "scratch/system-probes.txt"
    session_dedup:
      fingerprint: "sha256:041-llama-cpp-metal-investigation-adr-20260514"
      session_id: "cli-codex-gpt5.5-xhigh-fast-041"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A gpuLayers-only patch is not recommended because current provider source already defaults to 0."
      - "Would a newer node-llama-cpp Metal binary built after Darwin 25.4.0 resolve the warning? — Not the warning, but a local rebuild against Darwin 25.4 SDK does restore full Metal acceleration; the warning is cosmetic and persists with both the prebuilt and the local rebuild."
---
# Decision Record: llama-cpp Metal Investigation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Defer llama-cpp Metal Fix Implementation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Superseded by Option A execution on 2026-05-14T15:55Z — see "Post-Decision Execution" below |
| **Date** | 2026-05-14 |
| **Deciders** | User, Codex GPT-5.5 |

---

<!-- ANCHOR:adr-001-context -->
### Context

llama-cpp embeddings currently emit Metal initialization warnings and run on the slower CPU path in the observed provider probes. The investigation needed to decide whether the next change should be a narrow provider tweak, a package/environment change, or no implementation yet.

### Constraints

- This packet is research-only and cannot modify source code.
- Network access is disabled, so latest node-llama-cpp and Apple release-note checks are deferred.
- The provider source already passes `gpuLayers: 0` by default when `LLAMA_CPP_EMBEDDINGS_GPU_LAYERS` is unset.
- The installed package has a Metal prebuilt but no CPU-only prebuilt available through `getLlama({ gpu: false, build: "never" })`.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Option C, defer implementation in this packet and do not make a `gpuLayers: 0`-only source change.

**How it works**: The current packet remains documentation-only. A future implementation packet should first test a node-llama-cpp upgrade or Metal prebuilt refresh, then test explicit CPU backend selection only if a local CPU binary or local build exists.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Option A: Set `{ gpuLayers: 0 }` explicitly in `LlamaCppProvider.loadRuntime` | Low source diff; no performance loss versus current observed CPU fallback | Current source already defaults to `0`; direct probe still enters Metal backend initialization; unlikely to silence warnings alone | 4/10 |
| Option B: Upgrade node-llama-cpp | Most plausible path to restore Metal speed if newer prebuilt handles Darwin 25.4.0 | Medium risk; can shift native binding behavior; requires network/package mutation outside this packet | 7/10 |
| **Option C: Defer entirely** | Preserves correctness; avoids misleading one-line patch; keeps source untouched as required | Warning noise and CPU performance gap remain | 8/10 |
| Option D: Downgrade Node | Tests the Node-version hypothesis directly | High disruption; weak evidence because addon loads and fails in Metal/backend initialization, not Node ABI loading | 3/10 |

**Why this one**: Option C best fits the evidence and the scope. The issue is likely backend initialization, while the proposed `gpuLayers: 0` path is already present and therefore is not a clean fix.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Future implementation work starts from the right layer: backend selection or package compatibility, not only model layer offload.
- The current working CPU correctness path is not disturbed.
- The packet records the Metal prebuilt and OS-version mismatch evidence for reuse.

**What it costs**:
- The warning remains until a future packet changes package or backend behavior. Mitigation: use this ADR to scope that packet tightly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future work over-applies `gpuLayers: 0` despite current evidence | Medium | Keep this ADR linked from implementation planning |
| Newer node-llama-cpp changes embedding behavior | Medium | Add vector dimension, health, and benchmark checks in the future packet |
| CPU-only backend requires local build tooling | Medium | Use `build: "never"` probes first to avoid accidental network/build attempts |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Warning noise and about 5.9x performance gap are real operational issues |
| 2 | **Beyond Local Maxima?** | PASS | Considered provider tweak, package upgrade, deferral, and Node downgrade |
| 3 | **Sufficient?** | PASS | Deferral is sufficient for a research-only packet |
| 4 | **Fits Goal?** | PASS | User requested cause documentation and recommendation, not implementation |
| 5 | **Open Horizons?** | PASS | ADR leaves clear future implementation tests |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- No source code changes in this packet.
- New 041 research docs and scratch evidence are added.

**How to roll back**: Remove only the 041 packet folder if the research packet should be withdrawn.

### Post-Decision Execution (2026-05-14T15:55Z)

The user requested Option A be attempted as a "quick win" experiment after the ADR shipped. The orchestrator executed it:

1. **Installed cmake** via `brew install cmake` (cmake was absent from `/opt/homebrew/bin/` — Option A's missing prerequisite).
2. **Rebuilt node-llama-cpp from source** via `node_modules/.bin/node-llama-cpp source build --gpu metal` against the locally-installed Xcode 26.2 / Darwin 25.4 SDK. Build exit 0. New binaries landed at `node_modules/node-llama-cpp/llama/localBuilds/mac-arm64-metal/Release/`.
3. **Verified outcome via direct probes:**
   - `getLlama("lastBuild")` and `getLlama(<default>)` BOTH return `llama.gpu === 'metal'`.
   - Warm short embeds complete in **3-4 ms** (Metal speed).
   - Warm long embed (2831-byte normalized markdown checklist) completes in **265 ms**.
   - Cold first embed (model-load + first-inference) **452 ms** (was ~889 ms pre-rebuild).
4. **Verified via live MCP** after `/mcp` reconnect (new launcher spawn picks up new binaries):
   - `memory_search` total latency **38 ms** (stage1 candidate-gen + query embed: 33 ms).
   - `memory_health.embeddingProvider.healthy: true` (was `false` pre-rebuild).
   - `failed: 0` (was 214); `flapping: false` (was `true`); `transitionsInLast10Min: 0` (was 3).

**Why the ADR's "Option A=4/10" scoring was wrong, in retrospect:**
- The ADR scored Option A low partly because "provider already defaults gpuLayers to 0 — patch unlikely to silence warnings." That observation was correct, but Option A's *real* mechanism is the SDK-matched rebuild, not the gpuLayers flag itself. The rebuild produces binaries that work despite the misleading kernel-init warnings.
- The original `889 ms cold-only` probe conflated model-load time + first-inference + Metal kernel-init fallback into a single number, masking that Metal *was* successfully completing the inference. Warm-state measurements (4 ms / 265 ms) made the truth visible.

**Net:** The ADR's "defer" recommendation was the safe call given the evidence-collection moment, but the situation it described as broken was actually already partly working under warning noise — and a one-shot rebuild made it fully working. No regression risk now. Future implementation packets should test Metal warm-state perf, not cold-load perf, to avoid this misdiagnosis pattern.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
