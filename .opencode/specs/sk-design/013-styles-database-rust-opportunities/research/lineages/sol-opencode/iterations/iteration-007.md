# Iteration 7: Local Text and Image Model Runtimes

## Focus

Assess on-device text and image embedding through ONNX Runtime and Candle, including capability, model residency, packaging, privacy/offline value, JavaScript/native-addon alternatives, and current/10x/100x Rust gates.

## Actions Taken

1. Read the externalized state, reducer-owned strategy, iteration 6, configuration, and output contract.
2. Traced the repository's resident `hf-local` client, embedding manifest, styles vector profile, and installed Transformers.js/ONNX Runtime dependencies.
3. Compared official Transformers.js local-model and multimodal support with ONNX Runtime's Node and custom-build packaging contracts.
4. Compared the Rust `ort` binding and Candle's model/backend surface against the existing native Node baseline.

## Findings

### F1. Offline text and multimodal inference is already available without a Rust component

The repository already installs `@huggingface/transformers` 3.8.1, `onnxruntime-node` 1.21.0, `onnxruntime-web`, and `sharp`. The official Transformers.js surface supports text feature extraction, image feature extraction, CLIP-class multimodal models, and quantized dtypes. It can point at a local model directory, disable remote model loading, and self-host WASM files. Therefore local text embeddings, local screenshot embeddings, no-request-time cloud dependency, and offline operation are capabilities of the existing TypeScript/native stack, not Rust-exclusive features. [SOURCE: .opencode/skills/system-spec-kit/package-lock.json:3050-3079] [SOURCE: https://huggingface.co/docs/transformers.js/en/index] [SOURCE: https://huggingface.co/docs/transformers.js/en/custom_usage]

Privacy follows the deployment contract: image/text bytes remain local only when remote model access and telemetry are disabled and required model/runtime artifacts have already been provisioned. Replacing the JavaScript host with Rust does not improve that property by itself.

### F2. Rust `ort` and `onnxruntime-node` share the ONNX Runtime compute residency, so language substitution is not an inference optimization

`onnxruntime-node` already invokes native ONNX Runtime and ships prebuilt CPU binaries for macOS, Linux, and Windows on x64/arm64; its prebuilt accelerator coverage is narrower. The Rust `ort` crate is a safe wrapper over the same native runtime and exposes sessions, execution providers, and ahead-of-time graph compilation. Moving orchestration from Node to Rust therefore does not relocate model kernels from JavaScript to native code: they are native already. [SOURCE: https://onnxruntime.ai/docs/get-started/with-javascript/node.html] [SOURCE: https://docs.rs/ort/latest/ort/]

An `ort` worker is justified only by a measured boundary benefit such as lower host RSS through process isolation, bounded image preprocessing, a needed execution provider/custom build, or a materially simpler deployable. A napi-rs addon is weaker than a sidecar here: it retains native kernels but shares the TypeScript process's crash and OOM boundary, while the existing local client already understands loading, health, respawn, retry, load time, device, and inference telemetry. [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:891-949] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:1024-1049]

### F3. Candle is a distinct runtime option, but its value is model-specific rather than a general ONNX replacement

Candle offers Rust-native CPU execution, optional Accelerate on macOS, CUDA, WASM, safetensors, and examples for BERT sentence embeddings and CLIP image/text embeddings. This can remove ONNX Runtime from a narrowly supported worker and may offer a useful Apple or serverless packaging profile. However, it also transfers model architecture, preprocessing, quantization, numerical parity, and backend qualification into a separate Rust release surface. The current Transformers.js path supports a broader catalog through ONNX conversion and already supplies the required text, vision, and multimodal pipeline classes. [SOURCE: https://github.com/huggingface/candle] [SOURCE: https://huggingface.co/docs/transformers.js/en/index]

Candle should be evaluated only for a named model whose required graph and preprocessing are supported and whose measured target-host result beats the ONNX oracle. It should not be selected merely because it is Rust. `ort` is the lower-risk Rust experiment when exact ONNX model parity is required; Candle is the conditional experiment when removing the C++ runtime, using a Candle-specific backend, or packaging a supported model is itself material.

### F4. Model residency needs an opt-in artifact contract; embedding weights into the npm package or addon is the wrong default

The styles profile currently identifies provider, model, dimensions, and configuration hash, while the shared embedder contract is text-specific and admits only Ollama, remote API, or a sentence-transformers sidecar. It does not identify modality, image preprocessing, weight digest, model license, runtime build, execution provider, or offline completeness. [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:188-225] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/types.ts:12-74]

Add a content-addressed, opt-in model installation contract before selecting a runtime: immutable model/profile ID; modality; weight and tokenizer/preprocessor digests; source and license; quantization/dtype; runtime and execution-provider versions; required files; local completeness; and golden-vector tolerance. Keep large weights outside npm/native binaries, resolve them from a verified local store, and allow no-network startup to fail closed when the declared profile is incomplete. ONNX Runtime's reduced-operator/minimal builds can shrink a fixed deployment, but they bind the runtime package to the admitted model/operator set and add a per-platform build matrix. [SOURCE: https://huggingface.co/docs/transformers.js/en/custom_usage] [SOURCE: https://onnxruntime.ai/docs/build/custom.html]

### F5. Rust clears no current-scale gate; 10x and 100x are benchmark-triggered worker decisions

At the current approximately 1,290 styles and at most roughly 6,450 five-viewport screenshots, start with a shadow Transformers.js/ONNX profile. Reuse the existing queue, retrieval-hash cache, TypeScript publication, and lexical fallback; add modality-aware identity rather than a new runtime. This establishes quality, cold-load, warm batch, RSS, and package-size oracles before Rust is considered. [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/spec.md:48-75] [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:175-277]

At 10x, a resident sidecar becomes reasonable if measured cold rebuild or incremental drain misses its declared service window, concurrent text/image models cause unacceptable host RSS, or native image preprocessing becomes the dominant stage. Rust enters only if an `ort` or Candle prototype materially improves those failed metrics while reproducing normalized vectors and fallback behavior; corpus growth alone is insufficient.

At 100x, approximately 129,000 styles and 645,000 five-viewport captures make bounded decode/preprocessing queues, worker isolation, model residency policy, resumable publication, and hardware-provider selection operationally important. A Rust sidecar is then a credible candidate, but still conditional on a representative replay showing a material end-to-end gain rather than faster kernels hidden by capture, I/O, hashing, or SQLite publication. TypeScript must retain profile selection, queue state, generation publication, feature flags, fallback, and parity-oracle ownership. [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/spec.md:63-70]

## Questions Answered

- **Does local text/image inference require Rust?** No. The installed Transformers.js/ONNX Runtime stack already supports local, offline-capable text, vision, and multimodal inference.
- **Which Rust runtime is the default candidate?** Neither today. If a measured Rust experiment is warranted, `ort` is the lower-risk parity path; Candle is conditional on a named supported model and a material backend or packaging advantage.
- **Addon or sidecar?** Prefer a supervised sidecar for resident models because isolation and lifecycle control are the plausible benefits. An in-process addon offers no new kernel residency over `onnxruntime-node`.
- **What clears the scale gate?** A failed quality or operational SLO plus a representative Rust replay that materially improves end-to-end RSS, startup, preprocessing, drain throughput, or deployment footprint while preserving the TypeScript oracle and fallback.

## Questions Remaining

- Which labeled text-to-visual and image-to-style tasks prove a joint embedding profile adds retrieval value over structured tokens, prose, and text embeddings?
- What exact model/profile manifest and screenshot-derived-feature schema joins local artifacts to an immutable styles generation?
- What measured cold-load, warm-batch, RSS, package-size, preprocessing, drain, and end-to-end thresholds define “material” on the reference host?
- Can the existing generation pointer atomically publish screenshot features and an external vector index without a new manifest contract?
- Which complete opportunity set clears residency, materiality, and scale gates after the remaining evidence iterations?

## Ruled Out Directions

- Rust as the source of privacy/offline value: locality comes from model provisioning and network policy, not host language.
- A Rust `ort` rewrite for inference speed: both Node and Rust wrappers execute ONNX Runtime's native kernels.
- An in-process native addon as the default resident model host: it does not isolate RSS, crashes, or OOM from the TypeScript shell.
- Bundling model weights into the npm package or native binary: it couples large, licensed, profile-specific artifacts to every installation and release.
- Candle as a universal model runtime: each admitted architecture, preprocessing path, backend, and numerical contract requires separate qualification.

## Assessment

- **newInfoRatio:** 0.74
- **Novelty justification:** This iteration separated offline/privacy value from implementation language, established the installed ONNX stack as the mandatory local multimodal oracle, distinguished `ort` from Candle by parity and packaging risk, and converted Rust adoption into worker-isolation and artifact-contract gates at 10x/100x scale.
- **Confidence:** High on repository residency and existing Node capability; medium on Candle/ORT comparative materiality because no named multimodal model replay or package/RSS benchmark exists yet.

## Next Focus

Define a modality-aware model and screenshot-feature publication manifest, then specify the labeled retrieval tasks and benchmark matrix needed to compare the existing Transformers.js oracle with conditional `ort` and Candle workers.
