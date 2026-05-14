---
title: "Feature Specification: CocoIndex CoreML EP Investigation"
description: "Research-only packet documenting whether CocoIndex can use ONNX Runtime CoreML EP on this Mac, what it uses today, and whether an acceleration change is justified."
trigger_phrases:
  - "cocoindex coreml"
  - "onnxruntime execution provider"
  - "sentence-transformers backend"
  - "semantic code search acceleration"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/043-cocoindex-coreml-ep-investigation"
    last_updated_at: "2026-05-14T16:20:00Z"
    last_updated_by: "codex-gpt5.5"
    recent_action: "Wrote EP research packet"
    next_safe_action: "Review ADR before source work"
    blockers: []
    key_files:
      - "research.md"
      - "decision-record.md"
      - "scratch/step1-venv-inventory.txt"
      - "scratch/step4-search-baseline.txt"
    session_dedup:
      fingerprint: "sha256:a33bb4bef5fdfd3569505047c40304469c1099e70a4a2cff89280ce49f3cfab7"
      session_id: "cli-codex-gpt5.5-xhigh-fast-043"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "CoreMLExecutionProvider is bundled in onnxruntime 1.26.0."
      - "CocoIndex does not currently use ONNX Runtime for embeddings."
      - "Current warm search latency is about 80 ms in the in-process probe."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: CocoIndex CoreML EP Investigation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-14 |
| **Branch** | `main` |
| **Packet ID** | `system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/043-cocoindex-coreml-ep-investigation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
CocoIndex semantic code search might look like a candidate for the same Apple GPU acceleration proven in the sibling llama-cpp Metal investigation. The actual runtime path needed verification because the fork uses Python, `sentence-transformers`, and potentially ONNX Runtime, and those layers have different acceleration switches.

### Purpose
Determine whether CocoIndex currently uses CoreML/Metal/ANE acceleration, identify the smallest credible enablement path, and document whether a source or package change is worth pursuing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory the `.opencode/skills/mcp-coco-index/mcp_server/.venv/` runtime state.
- Inspect CocoIndex embedder creation and provider/backend configuration.
- Measure a three-trial baseline for a single search query without modifying source.
- Produce `research.md`, `decision-record.md`, and raw scratch evidence for later implementation work.

### Out of Scope
- Modifying `.opencode/skills/mcp-coco-index/` source code.
- Modifying `.opencode/skills/system-spec-kit/` source code.
- Modifying `.opencode/skills/system-code-graph/` or the parallel `042` packet.
- Killing live MCP or CocoIndex daemon child processes.
- Reopening llama-cpp/Metal findings already covered by packet `041`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/043-cocoindex-coreml-ep-investigation/spec.md` | Modify | Define the research-only packet scope and success criteria. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/043-cocoindex-coreml-ep-investigation/plan.md` | Modify | Record the investigation approach and verification route. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/043-cocoindex-coreml-ep-investigation/tasks.md` | Modify | Track completed inventory, analysis, and validation work. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/043-cocoindex-coreml-ep-investigation/implementation-summary.md` | Modify | Summarize findings and evidence after completion. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/043-cocoindex-coreml-ep-investigation/research.md` | Create | Document the EP state, hypothesis matrix, and performance baseline. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/043-cocoindex-coreml-ep-investigation/decision-record.md` | Create | Record the CoreML EP adoption recommendation. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-llama-cpp/043-cocoindex-coreml-ep-investigation/scratch/*.txt` | Create | Preserve raw command output for auditability. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Inventory installed ONNX Runtime, `sentence-transformers`, platform, and provider state. | Scratch evidence records `onnxruntime==1.26.0`, available providers, package presence, and platform. |
| REQ-002 | Identify CocoIndex's actual embedder backend and provider configuration. | Research cites source call sites showing `SentenceTransformerEmbedder(... device=...)` and default `SentenceTransformer` backend behavior. |
| REQ-003 | Classify H1-H4 against collected evidence. | `research.md` includes a hypothesis matrix with one leading hypothesis. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Measure current search latency without source changes. | Scratch evidence includes three trials and an average/median. |
| REQ-005 | Recommend one adoption path. | `decision-record.md` chooses one of options A-D with rationale. |
| REQ-006 | Validate packet structure under strict spec-kit validation. | `validate.sh <043-path> --strict` exits 0. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet clearly answers whether CoreML EP is bundled and whether it is used today.
- **SC-002**: The packet distinguishes ONNX Runtime CoreML EP from the current `sentence-transformers` Torch backend path.
- **SC-003**: The recommendation names the trade-off between package/source changes and the measured current latency.
- **SC-004**: **Given** the raw venv inventory, **When** a maintainer reviews the packet, **Then** they can reproduce the provider and package conclusions without rerunning probes.
- **SC-005**: **Given** a future source-change packet, **When** it starts from this ADR, **Then** it has a concrete adoption path and known missing prerequisites.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Local venv state | Package availability may differ after reinstall. | Record exact versions and provider list in scratch evidence. |
| Dependency | Sandbox daemon permissions | `ccc status` cannot lock `~/.cocoindex_code/daemon.spawn-lock`. | Use an in-process equivalent query path and document the CLI failure. |
| Risk | False ONNX premise | `onnxruntime` can be installed while the embedder still uses Torch. | Cite the CocoIndex wrapper and `SentenceTransformer` signature directly. |
| Risk | Over-optimizing search | Warm query latency is already about 80 ms in this probe. | Recommend deferral unless reindex or query latency becomes a measured bottleneck. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Future work should start only if a measured CocoIndex workload needs faster indexing or query-time embedding.
<!-- /ANCHOR:questions -->
