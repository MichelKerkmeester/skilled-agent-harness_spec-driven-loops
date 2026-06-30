---
title: "Feature Specification: llama-cpp Metal Investigation [template:level_1/spec.md]"
description: "Research-only packet documenting node-llama-cpp Metal initialization failures on darwin/arm64. The packet captures local evidence, evaluates likely causes, and records a no-source-change recommendation for a future implementation packet."
trigger_phrases:
  - "llama-cpp"
  - "Metal"
  - "embeddings"
  - "ggml_metal_library_init_from_source"
  - "gpuLayers"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/041-llama-cpp-metal-investigation"
    last_updated_at: "2026-05-14T15:23:23Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-041"
    recent_action: "Created research-only packet for llama-cpp Metal backend failures"
    next_safe_action: "Review ADR"
    blockers: []
    key_files:
      - "research.md"
      - "decision-record.md"
      - "scratch/system-probes.txt"
    session_dedup:
      fingerprint: "sha256:3b92cc255009c1a8541990fd00bcde181bc803a80b234f086647210c078bb7e4"
      session_id: "cli-codex-gpt5.5-xhigh-fast-041"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "External macOS 26.4 / Darwin 25.4.0 Metal release notes still need checking with network access."
    answered_questions:
      - "node-llama-cpp 3.17.1 and mac-arm64-metal b8179 are installed under system-spec-kit mcp_server node_modules."
      - "The provider already passes gpuLayers: 0 by default when LLAMA_CPP_EMBEDDINGS_GPU_LAYERS is unset."
---
# Feature Specification: llama-cpp Metal Investigation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

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
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every observed llama-cpp embedding call emits Metal-related stderr before falling back to CPU behavior. Correctness still works in the observed provider path, but the warning noise repeats and CPU embeddings are materially slower than the expected Metal path.

### Purpose
Document the local cause analysis and record a grounded recommendation without implementing any Metal, provider, package, or environment fix in this packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Capture the exact stderr symptom and observed performance impact.
- Probe local system, Xcode, node-llama-cpp, Metal binary, and GGUF model state.
- Enumerate H1-H5 with evidence for and against each hypothesis.
- Record an ADR selecting a research-only recommendation for future work.
- Validate the new 041 Level 1 packet.

### Out of Scope
- system-code-graph skill changes.
- Existing 014, 008, 038, or 039 packet changes.
- Any shared/dist patch changes.
- Live MCP process changes or termination.
- The parallel 040 packet folder.
- Implementation of any Metal fix.
- Source code changes of any kind.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/041-llama-cpp-metal-investigation/spec.md` | Create | Level 1 scope and requirements |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/041-llama-cpp-metal-investigation/plan.md` | Create | Research execution plan |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/041-llama-cpp-metal-investigation/tasks.md` | Create | Research task ledger |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/041-llama-cpp-metal-investigation/implementation-summary.md` | Create | Research delivery summary |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/041-llama-cpp-metal-investigation/research.md` | Create | Cause analysis and evidence |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/041-llama-cpp-metal-investigation/decision-record.md` | Create | ADR for recommendation |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/041-llama-cpp-metal-investigation/description.json` | Create | Packet identity metadata |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/041-llama-cpp-metal-investigation/graph-metadata.json` | Create | Packet graph metadata |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/041-llama-cpp-metal-investigation/scratch/` | Create | Read-only probe captures and scratch script |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Confirm 041 does not already exist before binding | Pre-check command returns no matching `041-*` directory |
| REQ-002 | Keep all authored changes inside the new 041 packet | `git status --short` shows only the 041 packet staged for this dispatch |
| REQ-003 | Capture the exact Metal warning symptom | `research.md` includes the original stderr block verbatim |
| REQ-004 | Avoid source-code implementation | No source files are modified or staged |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Capture local system and package state | `scratch/system-probes.txt` records Node, OS, Xcode, package, binary, and model metadata |
| REQ-006 | Enumerate H1-H5 | `research.md` records evidence for and against each hypothesis |
| REQ-007 | Run a no-source scratch probe for explicit `gpuLayers: 0` | `scratch/probe-gpulayers-zero-*.txt` records auto and CPU-mode results |
| REQ-008 | Record an ADR recommendation | `decision-record.md` selects one option and explains trade-offs |
| REQ-009 | Validate the packet | Strict spec validation exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet explains the most likely cause without requiring network access or source edits.
- **SC-002**: The ADR records why a `gpuLayers: 0`-only source change is not supported by the current evidence.
- **SC-003**: Strict validation passes for the 041 folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | External macOS release notes | Cannot confirm whether Darwin 25.4.0 changed Metal/tensor behavior | Mark as external follow-up because network access is disabled |
| Dependency | CPU-only node-llama-cpp binary | Explicit CPU backend cannot be proven without a CPU prebuilt or local build | Use `build: "never"` probe to avoid network/build side effects |
| Risk | Existing dirty worktree | Unrelated changes could be accidentally staged | Stage only the 041 packet path |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Did macOS 26.4 / Darwin 25.4.0 change Metal tensor API behavior in a way that affects llama.cpp b8179? External release notes must be checked later.
- Is a newer node-llama-cpp release available with a Metal binary built after Darwin 25.4.0? Network access was disabled for this research packet.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
