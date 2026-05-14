---
title: "Decision Record: CocoIndex CoreML Execution Provider Adoption"
description: "ADR proposing whether to adopt ONNX Runtime CoreML EP for CocoIndex semantic code search."
trigger_phrases:
  - "cocoindex coreml"
  - "execution provider adoption"
  - "onnxruntime coreml"
importance_tier: "important"
contextType: "general"
---
# Decision Record: CocoIndex CoreML Execution Provider Adoption

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: CocoIndex CoreML Execution Provider Adoption

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-14 |
| **Deciders** | Maintainer review pending |

---

<!-- ANCHOR:adr-001-context -->
### Context

CocoIndex semantic search might benefit from Apple acceleration, but the current implementation does not use ONNX Runtime for embeddings. The installed ONNX Runtime package advertises `CoreMLExecutionProvider`, while CocoIndex's embedder path calls `SentenceTransformer` through a wrapper that exposes only model, device, and trust settings.

### Constraints

- This packet is research-only and cannot modify `.opencode/skills/mcp-coco-index/` source.
- Network, package installation, and source dependency mutation are forbidden in this dispatch.
- Any future adoption must preserve existing search quality for `google/embeddinggemma-300m`.
- The current warm search baseline is about 80 ms, so query-time acceleration is not yet a proven bottleneck.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Option C, defer CoreML EP adoption for now.

**How it works**: Keep CocoIndex on the current `sentence-transformers` Torch backend. Revisit CoreML only in a future source packet if reindexing or query embedding latency becomes a measured bottleneck.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| A) Add CoreML EP to providers list in CocoIndex source | Small if there were a direct `InferenceSession` call site; uses installed CoreML EP. | No such call site exists in the fork; real patch must expose `backend="onnx"` and provider kwargs. | 5/10 |
| B) Install `onnxruntime-silicon` in the venv and configure providers | Matches the initial CoreML EP mental model. | Current `onnxruntime==1.26.0` already exposes CoreML; missing packages are `optimum` and `onnx`, not just ORT. | 4/10 |
| **C) Defer because current CPU performance is acceptable** | No source/package risk; warm query latency is about 80 ms; avoids optimizing an unproven bottleneck. | Does not improve cold model load or indexing throughput. | 8/10 |
| D) Switch to `mlx-embeddings` or another Apple-native stack | Could provide a cleaner Apple Silicon story long term. | Large architecture and quality migration for a code-search system that is already working. | 3/10 |

**Why this one**: Option C fits the evidence. CoreML is available but unused, and the adoption path is broader than a provider string while the measured warm query path is already fast.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Maintainers avoid a package/source change without benchmark pressure.
- The next acceleration packet starts from a precise gap: expose ONNX backend/provider settings, not just install another ORT wheel.

**What it costs**:
- Cold model load remains about 3.9 seconds in this probe. Mitigation: keep the daemon warm where sandbox policy allows.
- Reindex-time embedding acceleration remains untested. Mitigation: benchmark indexing separately before implementing CoreML.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Future maintainers assume ORT provider availability means usage. | Medium | Point them to `research.md` H4 and source call sites. |
| Deferral hides a real indexing bottleneck. | Medium | Run a reindex benchmark before any future acceleration work. |
| ONNX/CoreML adoption changes embedding numerics. | Medium | Require quality comparison against existing search results before rollout. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | There is a real question from packet 041 follow-up. |
| 2 | **Beyond Local Maxima?** | PASS | Options A-D compare source, package, deferral, and architecture paths. |
| 3 | **Sufficient?** | PASS | Deferral is enough because no bottleneck is established. |
| 4 | **Fits Goal?** | PASS | Research-only scope asked for recommendation, not implementation. |
| 5 | **Open Horizons?** | PASS | Future work has clear prerequisites and benchmark gates. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- No CocoIndex source changes in this packet.
- Future source packet, if justified, should add settings for Sentence Transformers `backend` and ONNX `provider`, then install/test the missing ONNX backend packages.
- Future package packet should verify whether `onnxruntime==1.26.0` is sufficient, since it already lists `CoreMLExecutionProvider`.

**How to roll back**: Remove this packet or supersede the ADR with benchmark evidence that makes CoreML adoption necessary.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
