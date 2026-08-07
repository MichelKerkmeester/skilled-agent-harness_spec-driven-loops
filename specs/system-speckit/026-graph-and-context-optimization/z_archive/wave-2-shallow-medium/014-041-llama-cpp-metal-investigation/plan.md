---
title: "Implementation Plan: llama-cpp Metal Investigation [template:level_1/plan.md]"
description: "Research-only plan for documenting local node-llama-cpp Metal initialization failures and choosing a future path. The approach is evidence collection, hypothesis scoring, and ADR capture without source changes."
trigger_phrases:
  - "llama-cpp"
  - "Metal"
  - "research"
  - "ADR"
  - "gpuLayers"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/z_archive/wave-2-shallow-medium/014-041-llama-cpp-metal-investigation"
    last_updated_at: "2026-05-14T15:23:23Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-041"
    recent_action: "Planned read-only investigation steps"
    next_safe_action: "Review ADR before authorizing a future implementation packet"
    blockers: []
    key_files:
      - "research.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:1b4025dc7b8d27cf38df85e77b20ed44a00851a2c28b338560560d85deded8e3"
      session_id: "cli-codex-gpt5.5-xhigh-fast-041"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "External macOS release notes need checking later."
    answered_questions:
      - "The package has a Metal prebuilt but no CPU prebuilt available through the current node_modules tree."
---
# Implementation Plan: llama-cpp Metal Investigation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript provider, Node.js runtime, native node-llama-cpp bindings |
| **Framework** | system-spec-kit embeddings provider |
| **Storage** | Local GGUF files under `~/.cache/huggingface/gguf/embeddinggemma-300m/` |
| **Testing** | Read-only shell probes, scratch Node probe, strict spec validation |

### Overview
This packet documents a local Metal backend failure in node-llama-cpp embeddings. The plan is to collect system state, inspect package and provider behavior, run one scratch probe for explicit `gpuLayers: 0`, and record a future recommendation in an ADR.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Strict validation passing
- [x] Docs updated in the 041 packet only
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Research packet with no source implementation.

### Key Components
- **LlamaCppProvider**: Existing provider path that calls `getLlama()` and `loadModel({ gpuLayers })`.
- **node-llama-cpp 3.17.1**: Native binding package with the installed `@node-llama-cpp/mac-arm64-metal` prebuilt.
- **EmbeddingGemma GGUF files**: Local F32, BF16, and Q8_0 variants used as metadata evidence.

### Data Flow
Embedding calls load node-llama-cpp, initialize the selected backend, load the GGUF model, create an embedding context, and then return a 768-dimensional vector. The observed failure happens during Metal backend initialization or context creation, before model variant differences become the leading explanation.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shared/embeddings/providers/llama-cpp.ts` | Existing provider source | Read-only evidence, unchanged | `research.md` records `getLlama()` and `gpuLayers` findings |
| `node-llama-cpp` package | Native Metal binding and API | Read-only evidence, unchanged | `scratch/system-probes.txt` records version and binary metadata |
| `~/.cache/huggingface/gguf/embeddinggemma-300m/` | Local model variants | Metadata only, no variant loads except Q8_0 scratch probe | `scratch/system-probes.txt` records size and mtime |
| 041 spec packet | Research output | Created | Strict validation |

Required inventories:
- Same-class producers: not applicable because source implementation is out of scope.
- Consumers of changed symbols: not applicable because no symbols changed.
- Matrix axes: Node version, OS/Darwin version, node-llama-cpp version, Metal prebuilt release, GGUF variant metadata, backend selection mode.
- Algorithm invariant: no provider behavior changes are made in this packet.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm no existing 041 folder.
- [x] Create 041 packet path.
- [x] Add scratch probe script.

### Phase 2: Research Documentation
- [x] Capture system state and package metadata.
- [x] Run explicit `gpuLayers: 0` scratch probe.
- [x] Enumerate H1-H5 with evidence.
- [x] Write ADR recommendation.

### Phase 3: Verification
- [x] Run strict spec validation.
- [x] Stage only 041 packet files.
- [x] Commit on `main`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Read-only probe | System, Xcode, package, binary, model metadata | Shell commands captured in `scratch/system-probes.txt` |
| Runtime probe | `getLlama()` backend selection and explicit `gpuLayers: 0` | `scratch/probe-gpulayers-zero.mjs` |
| Validation | Spec folder contract | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <041-path> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Network access | External | Red | Cannot check latest node-llama-cpp release or macOS release notes |
| CPU-only node-llama-cpp binary | Local package | Red | Explicit CPU backend cannot be loaded with `build: "never"` |
| Metal prebuilt b8179 | Local package | Yellow | Present, but fails Metal initialization in direct probe |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Packet content is invalid, mis-scoped, or not wanted.
- **Procedure**: Revert only `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/001-local-embeddings-foundation/041-llama-cpp-metal-investigation/`.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
