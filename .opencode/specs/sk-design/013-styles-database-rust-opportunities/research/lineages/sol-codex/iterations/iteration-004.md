# Iteration 4: Local Embedding Inference

## Focus

Determine whether a local model runtime creates enough new value to justify native compute, and whether Rust is required rather than one of several viable shells over the same model.

## Findings

1. Local inference unlocks real product capability at today's corpus: offline indexing, no text sent to an embedding service, reproducible model/profile pinning, no per-call API cost, and an always-available semantic lane. This is newly introduced CPU/GPU-heavy compute, not a port of the small cosine loop, so it can clear residency and materiality gates even at 1,290 documents during initial/rebuild embedding. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:649-655] [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:206-216]
2. The current architecture already has the seam: `indexStyleCorpus()` accepts an async `embedder` callback, records provider/model/dimension/config identity, queues by semantic retrieval hash, caches by `(retrieval_hash, profile_id)`, and publishes vectors only after a current-identity check. A local runtime can be added without changing transport, lifecycle, or query contracts. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:622-655,872-900] [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:206-295]
3. Rust is not necessary. Microsoft's supported `onnxruntime-node` package already supplies native CPU binaries across Windows, Linux, and macOS plus selected accelerators. Transformers.js also runs models through JavaScript-facing runtimes. For a text-only embedding MVP, a TypeScript adapter over `onnxruntime-node` is the lower-effort proof. [SOURCE: https://onnxruntime.ai/docs/get-started/with-javascript/node.html] [SOURCE: https://huggingface.co/docs/transformers.js/en/index]
4. Rust becomes strategically attractive when the same local runtime must serve text embeddings, image embeddings, palette/layout models, and other repository search systems from one audited package. Candle offers Rust-native tensor/model code, CPU plus optional CUDA/Metal-oriented backends, WASM examples, and included BERT/JinaBERT/CLIP/DINOv2/BLIP families; this breadth supports a shared multimodal core rather than a one-off text embedder. [SOURCE: https://github.com/huggingface/candle]
5. `ort` in Rust is mostly a wrapper over Microsoft's ONNX Runtime, not evidence that Rust owns inference. It provides a Rust API and broad execution-provider integration, but the Node binding reaches the same native engine with less custom boundary code. Choose `ort` only if the reusable Rust core is already justified; do not create Rust merely to wrap ONNX Runtime. [SOURCE: https://github.com/pykeio/ort] [SOURCE: https://onnxruntime.ai/docs/get-started/with-javascript/node.html]
6. Model/profile identity must expand beyond the existing opaque `config_hash`: pin model bytes/digest, tokenizer bytes/digest, pooling, normalization, quantization, runtime version, and output dimension. Differential tests should compare fixed inputs and serialized float vectors byte-for-byte where runtime determinism permits; where hardware kernels differ, either force a canonical CPU path for parity or treat accelerated profiles as distinct, explicitly versioned projections. [INFERENCE: existing embedding profile and byte-parity standard] [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:188-204] [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/quality-standards/determinism-and-parity.md:37-68]
7. Risk is medium-high: model licensing and distribution size, tokenizer/pooling parity, platform acceleration matrices, cold start, native artifact supply chain, and nondeterministic floating-point kernels. The smallest safe phase is a CPU-only, quantized sentence-embedding profile behind `shadow`, with Node ONNX Runtime as the comparator and the current external embedder retained as fallback. [INFERENCE: upstream platform matrix plus repository adapter model]

## Ruled Out

- Build a Rust wrapper around ONNX Runtime solely for speed: the heavy kernels are already native in `onnxruntime-node`.
- Make GPU acceleration the first milestone: it expands packaging and determinism risk before value is proven.
- Reuse one profile ID across hardware/runtime variants: it would invalidate cache and parity semantics.

## Dead Ends

- “On-device” does not mean “Rust”; the feature and the implementation language are separate decisions.

## Edge Cases

- Ambiguous input: “no external API” may still permit one-time model download; production policy must decide vendored versus fetched weights.
- Contradictory evidence: Candle offers portability and model breadth, while ONNX Runtime has the simpler supported Node path. This is a phased choice: prove value in Node, adopt Rust only for shared multimodal reuse.
- Missing dependencies: model license, target hardware matrix, and acceptable artifact size are not specified.
- Partial success: capability and architecture are clear; a specific model cannot be recommended without relevance and package-size tests.

## Sources Consulted

- https://github.com/huggingface/candle
- https://onnxruntime.ai/docs/get-started/with-javascript/node.html
- https://github.com/pykeio/ort
- https://huggingface.co/docs/transformers.js/en/index
- `.opencode/skills/sk-design/styles/_db/indexer.mjs:622-655,872-900`
- `.opencode/skills/sk-design/styles/_db/vectors.mjs:206-295`

## Assessment

- New information ratio: 0.88
- Questions addressed: local embedding runtime
- Questions answered: local embedding runtime

## Reflection

- What worked and why: the existing embedder callback and cache/profile schema made incremental adoption concrete.
- What did not work and why: upstream capability lists do not establish relevance quality or packaged footprint for this corpus.
- What I would do differently: evaluate two small permissively licensed embedding models against a hand-labeled style-query set.

## Recommended Next Focus

Assess parallel/streaming indexing, incremental hashing, embedding scheduling, and file watching; separate already-implemented automation from Rust-worthy continuous operation.
