# Iteration 6: Screenshot-Derived Style Intelligence

## Focus

Test whether screenshots can add genuinely new style signals, then separate the feature case from the language choice.

## Findings

1. The corpus schema already records a `screenshot_url`, while canonical bundles already carry structured color, layout, imagery, token, and capability fields. Screenshot processing should therefore add evidence that the authored metadata cannot express—visual similarity, near-duplicate detection, rendered-versus-declared discrepancies, and region-level composition—not re-extract existing tokens as a primary deliverable. [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:97-107] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:118-172]
2. A low-cost visual lane can compute dominant palettes, contrast/histogram descriptors, aspect/density features, and perceptual hashes. That unlocks duplicate-family clustering, screenshot change detection, and validation of declared palettes. Rust is not necessary: Sharp is a Node-API binding over native libvips with decoding, colour-space, resize, extraction, and streaming primitives; it avoids JavaScript-resident pixel loops. [SOURCE: https://github.com/lovell/sharp] [SOURCE: https://github.com/libvips/libvips]
3. Rust's `image` ecosystem is viable for a future shared core—it supports common formats, image buffers, colour conversion, resize, and optional Rayon-backed work—but it does not create unique product capability versus Sharp at 1,290 images. A Rust implementation is justified only if visual preprocessing must be packaged beside a Rust inference runtime or reused by multiple systems. [SOURCE: https://github.com/image-rs/image]
4. CLIP-class models unlock a qualitatively different lane: a text query such as “dense editorial dashboard with muted earth tones” can retrieve by rendered appearance, and image-to-image queries can find visually related styles. CLIP's published design explicitly aligns image and natural-language representations; this is new retrieval semantics, not a faster form of the existing text-vector cosine loop. [SOURCE: https://arxiv.org/abs/2103.00020]
5. Multimodal embedding inference is material even at 1,290 screenshots because decoding, preprocessing, and model execution are new CPU/GPU-resident work performed during indexing. Rust can be useful for one local Candle/ORT text-and-image runtime, but it is not necessary: Node ONNX Runtime or Transformers.js can prove relevance and model fit before a native boundary. [SOURCE: https://github.com/huggingface/candle] [SOURCE: https://onnxruntime.ai/docs/get-started/with-javascript/node.html]
6. Layout fingerprinting ranges from cheap global geometry to expensive region detection/segmentation. The cheap form can be derived with image primitives and is Rust-optional; learned region embeddings or segmentation have high implementation and evaluation risk and should proceed only after a labelled relevance set shows that global CLIP/palette signals miss useful distinctions. [INFERENCE: feature decomposition and model-runtime evidence]
7. Screenshot ingestion is the dominant non-language risk. URLs may be missing, remote, unstable, licensed, or mutable. Every derived artifact needs a content hash of fetched bytes, provenance, fetch policy, decoder/model version, and a failure-tolerant path that preserves text-only retrieval. [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:97-107] [INFERENCE: external screenshot provenance]

## Ruled Out

- A Rust palette/perceptual-hash implementation as the first step.
- Treating screenshot parsing as a replacement for canonical structured metadata.
- Learned layout segmentation before a relevance set demonstrates a gap.
- Making screenshot availability a hard dependency of normal retrieval.

## Dead Ends

- Pixel-processing benchmarks do not establish product value; native Sharp already removes the claimed JavaScript pixel-loop bottleneck.

## Edge Cases

- Ambiguous input: “style analysis” can mean metadata validation, visual search, or semantic labelling. They require separate outputs and success metrics.
- Contradictory evidence: Rust image crates are capable, but capability parity with Sharp argues against a language migration.
- Missing dependencies: screenshot coverage, fetchability, image sizes, and a judged visual-query set are unknown.
- Partial success: palette/pHash validation can ship independently while multimodal relevance is evaluated.

## Sources Consulted

- https://arxiv.org/abs/2103.00020
- https://github.com/lovell/sharp
- https://github.com/libvips/libvips
- https://github.com/image-rs/image
- https://github.com/huggingface/candle
- `.opencode/skills/sk-design/styles/_db/schema.mjs:97-107`
- `.opencode/skills/sk-design/styles/_db/indexer.mjs:118-172`

## Assessment

- New information ratio: 0.86
- Questions addressed: screenshot-derived style analysis
- Questions answered: screenshot-derived style analysis

## Reflection

- What worked and why: dividing deterministic image descriptors from learned multimodal signals exposed two different value/risk profiles.
- What did not work and why: no screenshot coverage report or judged query set exists, so relevance gains cannot be claimed.
- What I would do differently: inventory screenshot availability and label 30–50 visual queries before selecting a model.

## Recommended Next Focus

Test whether a domain-neutral search/inference core can coherently serve sk-design, system-code-graph, and spec-kit memory.
