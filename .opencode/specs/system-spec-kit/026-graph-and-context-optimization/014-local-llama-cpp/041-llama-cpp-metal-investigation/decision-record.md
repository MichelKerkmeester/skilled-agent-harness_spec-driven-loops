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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/041-llama-cpp-metal-investigation"
    last_updated_at: "2026-05-14T15:18:02Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-041"
    recent_action: "Recorded ADR recommendation for research-only packet"
    next_safe_action: "Open a future implementation packet if runtime behavior should change"
    blockers:
      - "Network disabled for latest package and Apple release-note checks"
    key_files:
      - "research.md"
      - "scratch/system-probes.txt"
    session_dedup:
      fingerprint: "sha256:041-llama-cpp-metal-investigation-adr-20260514"
      session_id: "cli-codex-gpt5.5-xhigh-fast-041"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Would a newer node-llama-cpp Metal binary built after Darwin 25.4.0 resolve the warning?"
    answered_questions:
      - "A gpuLayers-only patch is not recommended because current provider source already defaults to 0."
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
| **Status** | Proposed |
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
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!--
Level 3 Decision Record (Addendum): One ADR per major decision.
Write in human voice: active, direct, specific. No em dashes, no hedging.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
