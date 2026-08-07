---
title: "Feature Research: llama-cpp Metal Investigation [template:research.md]"
description: "Technical investigation into node-llama-cpp Metal initialization warnings and CPU fallback behavior for local EmbeddingGemma GGUF embeddings."
trigger_phrases:
  - "llama-cpp"
  - "Metal"
  - "ggml_metal_library_init_from_source"
  - "tensor API"
  - "EmbeddingGemma"
importance_tier: "important"
contextType: "research"
---
# Feature Research: llama-cpp Metal Investigation

<!-- SPECKIT_TEMPLATE_SOURCE: research | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Research ID**: RESEARCH-041
- **Feature/Spec**: `041-llama-cpp-metal-investigation`
- **Status**: Complete
- **Date Started**: 2026-05-14
- **Date Completed**: 2026-05-14
- **Researcher(s)**: Codex GPT-5.5
- **Reviewers**: User
- **Last Updated**: 2026-05-14

**Related Documents**:
- Spec: `spec.md`
- ADR: `decision-record.md`
- Scratch evidence: `scratch/system-probes.txt`
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:investigation-report -->
## 2. INVESTIGATION REPORT

### Request Summary
Investigate repeated node-llama-cpp Metal warnings during local embedding generation. The goal is research-only: document cause, enumerate hypotheses, and recommend a path without changing provider source or any existing packet.

### Current Behavior
Observed embedding probes emit this stderr on every llama-cpp embedding call:

```text
[node-llama-cpp] ggml_metal_library_init_from_source: error compiling source
[node-llama-cpp] ggml_metal_device_init: - the tensor API is not supported in this environment - disabling
[node-llama-cpp] load: control-looking token:    212 '</s>' was not control-type; this is probably a bug in the model. its type will be overridden
[node-llama-cpp] load: special_eos_id is not in special_eog_ids - the tokenizer config may be incorrect
```

The observed provider path still produced a correct `Float32Array(768)` embedding for 2831 characters in about 889 ms. The expected Metal path is about 150 ms in this environment, so the observed CPU path is roughly 5.9x slower.

### Key Findings
1. **The installed Metal binary is present but tied to b8179 and macOS platform version 25.3.0**: The local optional package is `@node-llama-cpp/mac-arm64-metal@3.17.1`, with `_nlcBuildMetadata.json` recording `llama.cpp` release `b8179`, `gpu: "metal"`, and `platformInfo.version: "25.3.0"`.
2. **The provider already passes `gpuLayers: 0` by default**: `resolveGpuLayers()` returns `0` when `LLAMA_CPP_EMBEDDINGS_GPU_LAYERS` is unset, and `loadRuntime()` passes `gpuLayers: resolveGpuLayers()` into `llama.loadModel()`.
3. **Backend selection happens before model layer offload**: The provider calls `getLlama()` with no options. node-llama-cpp defaults `NODE_LLAMA_CPP_GPU` to `auto`, which selects Metal on Apple Silicon before `loadModel({ gpuLayers: 0 })`.
4. **Explicit `gpuLayers: 0` did not avoid Metal failure in the scratch probe**: The auto backend probe still hit Metal backend initialization and failed context creation with `ggml_metal_init: error: failed to create command queue`.
5. **Explicit CPU backend is not currently usable without a CPU binary or build**: `getLlama({ gpu: false, build: "never" })` fails with `NoBinaryFoundError`. A first CPU probe without `build: "never"` attempted to download build tooling, which is why the saved scratch probe now prevents build/download behavior.

### Recommendations
The research recommendation is Option C: defer implementation in this packet and do not make a `gpuLayers: 0`-only source change. The evidence points to Metal backend initialization, while `gpuLayers: 0` is already present in the provider path.

**Primary Recommendation**:
- Defer source implementation and open a future implementation packet that first tests a newer node-llama-cpp Metal binary, then separately tests a CPU-only backend path with a local CPU binary or local build. This keeps the current correctness path intact and avoids a misleading one-line patch.

**Alternative Approaches**:
- Set `gpuLayers: 0` explicitly: low code cost, but current source already does this and the direct probe still enters Metal initialization.
- Upgrade node-llama-cpp: plausible fix if newer binaries account for Darwin 25.4.0, but it is medium risk and network/package mutation was out of scope.
- Downgrade Node: high disruption with weak evidence because the native addon loads and fails inside Metal/backend initialization rather than at Node ABI load time.
<!-- /ANCHOR:investigation-report -->

---

<!-- ANCHOR:executive-overview -->
## 3. EXECUTIVE OVERVIEW

### Executive Summary
The strongest local explanation is a Metal backend compatibility problem between the current macOS/Darwin environment and the installed node-llama-cpp Metal prebuilt. The warning is not best explained by the GGUF variant: model tokenizer warnings are present, but the Metal failures happen in backend initialization and context creation.

The tempting one-line fix is to set `gpuLayers: 0`, but the provider already defaults to that. That setting controls model layer offload, not the earlier `getLlama()` backend selection. To silence Metal initialization, a future packet would need to test backend selection itself, such as a CPU binary path or a package upgrade, not only layer count.

### Architecture Diagram

```text
LlamaCppProvider
  -> getLlama() with default GPU auto
      -> @node-llama-cpp/mac-arm64-metal b8179
          -> Metal backend initialization warning/failure
  -> loadModel({ embedding: true, gpuLayers: 0 })
  -> createEmbeddingContext()
  -> 768-dim embedding or backend failure
```

### Quick Reference Guide

**When to use this research**:
- Planning a future llama-cpp Metal warning fix.
- Deciding whether a `gpuLayers: 0` patch is sufficient.
- Checking whether the local node-llama-cpp package has the relevant Metal prebuilt.

**When NOT to use this research**:
- As proof that all macOS 26.4 machines fail Metal.
- As proof that BF16 or F32 GGUF variants fail, because they were intentionally not loaded.

**Key considerations**:
- Network access was disabled, so latest package and Apple release-note checks remain external.
- The current dirty worktree contains unrelated changes; any future implementation must stage only its own packet.

### Research Sources

| Source Type | Description | Link/Reference | Credibility |
|-------------|-------------|----------------|-------------|
| Local command output | Node, Darwin, macOS, Xcode, package, binary, and GGUF metadata | `scratch/system-probes.txt` | High |
| Local source read | Provider `resolveGpuLayers()` and `getLlama()` call path | `.opencode/skills/system-spec-kit/shared/embeddings/providers/llama-cpp.ts` | High |
| Local package read | node-llama-cpp API types and config defaults | `.opencode/skills/system-spec-kit/mcp_server/node_modules/node-llama-cpp/dist/` | High |
| Runtime probe | Scratch Node script with explicit `gpuLayers: 0` | `scratch/probe-gpulayers-zero-*.txt` | Medium |
| External documentation | macOS 26.4 / Darwin 25.4.0 release notes | Deferred due network disabled | Unknown |
<!-- /ANCHOR:executive-overview -->

---

<!-- ANCHOR:technical-specifications -->
## 4. TECHNICAL FINDINGS

### Environment

| Item | Value |
|------|-------|
| Node | v25.6.1 |
| Node ABI | modules 141, N-API 10 |
| Kernel | Darwin 25.4.0 arm64 |
| macOS | 26.4 build 25E246 |
| Xcode path | `/Applications/Xcode.app/Contents/Developer` |
| Xcode | 26.2 build 17C52 |
| `NODE_LLAMA_CPP_GPU` | unset |
| `LLAMA_CPP_EMBEDDINGS_GPU_LAYERS` | unset |
| `LLAMA_CPP_EMBEDDINGS_MODEL_PATH` | unset |

### node-llama-cpp State

| Item | Value |
|------|-------|
| Package path requested by task | `mcp_server/node_modules/node-llama-cpp/package.json` was absent at repo root |
| Actual installed path | `.opencode/skills/system-spec-kit/mcp_server/node_modules/node-llama-cpp/package.json` |
| node-llama-cpp version | 3.17.1 |
| Optional Metal package | `@node-llama-cpp/mac-arm64-metal@3.17.1` |
| llama.cpp prebuilt release | b8179 |
| Prebuilt build metadata | macOS platform version 25.3.0, arm64, Metal |
| Requested `llama/build/release/` directory | Absent |
| Actual binary directory | `node_modules/node-llama-cpp/node_modules/@node-llama-cpp/mac-arm64-metal/bins/mac-arm64-metal/` |

### GGUF Variants

| Variant | Size | Modified | Loaded by this packet |
|---------|------|----------|-----------------------|
| BF16 | 612,429,792 bytes | 2026-05-13 11:50:39 | No |
| F32 | 1,217,982,432 bytes | 2026-05-13 11:51:35 | No |
| Q8_0 | 328,577,056 bytes | 2026-05-13 11:44:15 | Yes, only for the scratch `gpuLayers: 0` probe |

### Scratch Probe Results

| Probe | Result | Evidence |
|-------|--------|----------|
| `node scratch/probe-gpulayers-zero.mjs auto` | Failed in Metal context creation despite `gpuLayers: 0` | `scratch/probe-gpulayers-zero-auto.txt` |
| `node scratch/probe-gpulayers-zero.mjs cpu` | Failed before model load because no CPU prebuilt exists with `build: "never"` | `scratch/probe-gpulayers-zero-cpu.txt` |

### External Release Notes
Recent macOS Darwin 25.4.0 release notes mentioning Metal or tensor API changes were not fetched because network access was disabled. This needs an external check in a future packet before treating H5 as confirmed.
<!-- /ANCHOR:technical-specifications -->

---

<!-- ANCHOR:hypotheses -->
## 5. HYPOTHESIS EVALUATION

### H1: Node 25.6.1 is too new for the prebuilt Metal binding

**Evidence for**:
- Node is very new: v25.6.1, modules 141, N-API 10.
- node-llama-cpp package metadata only requires Node `>=20.0.0`, which is broad.

**Evidence against**:
- The native addon loads far enough to emit llama.cpp and Metal runtime errors.
- The failure is not an immediate Node ABI or module load failure.
- `llama-addon.node` is a Mach-O arm64 binary and links to the expected local Metal dylibs.

**Read**: Possible but not leading.

### H2: Xcode Command Line Tools or Metal SDK version mismatch

**Evidence for**:
- The original stderr includes `ggml_metal_library_init_from_source: error compiling source`, which can involve Metal shader compilation.
- Xcode 26.2 is installed while the prebuilt metadata records platform version 25.3.0.

**Evidence against**:
- `xcode-select -p` resolves to a full Xcode install.
- The installed package uses a prebuilt Metal binary, so a local compile toolchain mismatch is less central than runtime Metal compatibility.
- The direct CPU path failed due missing CPU prebuilt, not due Xcode.

**Read**: Plausible secondary factor.

### H3: GGUF model variant incompatibility

**Evidence for**:
- The model emits tokenizer warnings about `'</s>'`, `special_eos_id`, and `special_eog_ids`.
- Only Q8_0 was loaded by the scratch probe.

**Evidence against**:
- The observed provider path can produce a valid `Float32Array(768)`.
- The Metal-specific errors happen before or during backend/context initialization, not during variant-specific tensor evaluation.
- BF16 and F32 were only metadata-probed by request, so there is no direct evidence that they behave differently.

**Read**: Not leading.

### H4: node-llama-cpp version is stale relative to llama.cpp upstream Metal API

**Evidence for**:
- Installed node-llama-cpp is 3.17.1, using llama.cpp prebuilt release b8179.
- The prebuilt files are dated 2026-03-05 and built for macOS platform version 25.3.0.
- Metal backend code changes upstream could plausibly address current runtime behavior.

**Evidence against**:
- Network access was disabled, so the latest node-llama-cpp version and upstream llama.cpp state were not checked.
- Current package is internally consistent: node-llama-cpp and optional Metal package versions both match 3.17.1.

**Read**: Plausible, but external verification is required.

### H5: macOS Darwin 25.4.0 tensor API changes broke the prebuilt

**Evidence for**:
- Current system is Darwin 25.4.0 / macOS 26.4.
- The installed Metal prebuilt metadata records macOS platform version 25.3.0.
- The observed stderr explicitly mentions the tensor API being unsupported in the environment.
- The direct auto probe fails in Metal backend/context initialization even with `gpuLayers: 0`.

**Evidence against**:
- No external release notes were checked.
- The direct scratch probe surfaced `failed to create command queue`, which is stronger than the original observed fallback warning and may depend on process environment.

**Read**: Leading hypothesis.
<!-- /ANCHOR:hypotheses -->

---

<!-- ANCHOR:conclusion -->
## 6. CONCLUSION

The leading cause is a Metal backend compatibility issue between the current Darwin 25.4.0 / macOS 26.4 environment and the installed node-llama-cpp mac-arm64-metal b8179 prebuilt. The evidence does not support a `gpuLayers: 0`-only source patch because the provider already defaults to `0`, and the failing path starts at `getLlama()` backend selection.

Recommended next step for a future implementation packet: first evaluate a node-llama-cpp upgrade with a newer Metal binary, then evaluate an explicit CPU backend only if a local CPU binary or local build path is available without network/build side effects. This packet should ship as research and ADR only.
<!-- /ANCHOR:conclusion -->
