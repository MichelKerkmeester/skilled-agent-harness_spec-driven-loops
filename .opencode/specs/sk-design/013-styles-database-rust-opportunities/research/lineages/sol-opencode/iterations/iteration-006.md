# Iteration 6: Visual and Multimodal Style Analysis

## Focus

Pressure-test screenshot palette and spacing extraction, perceptual hashing, layout fingerprints, and multimodal embeddings; classify which capabilities need Rust versus the existing TypeScript crawler and native-backed JavaScript tools.

## Actions Taken

1. Read the externalized state, reducer-owned strategy, prior shared-inference findings, and iteration-output contract.
2. Traced the styles schema and indexer to identify the current screenshot, artifact, token-axis, embedding, and generation boundaries.
3. Compared the existing design-md-generator's five-viewport screenshots and DOM geometry/style collection with the proposed pixel and layout features.
4. Checked primary documentation for Playwright geometry, sharp/libvips image statistics, Rust perceptual hashing, and Transformers.js image pipelines.

## Findings

### F1. Spacing extraction and layout fingerprints should be DOM-first TypeScript features, not screenshot-first Rust vision

The existing crawler already retains each page's HTML and captures five responsive screenshots. More importantly, its `ElementStyle` records contain element rectangles, padding, margin, gap, display, position, flex direction, alignment, grid columns, maximum width, landmark region, child count, and image presence. This is nearly the complete raw input for a responsive layout fingerprint and spacing-scale histogram before any image decoding is introduced. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:17-25] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/types.ts:51-108] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:726-756]

A practical first feature is therefore a versioned, viewport-specific canonical projection in TypeScript: normalize visible rectangles by viewport width/height; bucket landmark order, width bands, grid/flex topology, gaps, padding, and vertical rhythm; then hash the stable JSON. Playwright exposes bounding boxes in CSS pixels and even supports ARIA snapshots with boxes, so geometry collection is already native to the browser boundary. [SOURCE: https://playwright.dev/docs/api/class-locator#locator-bounding-box]

Pixel-only spacing inference should be ruled out for live-page ingestion because it must rediscover boundaries that the DOM and computed styles expose exactly. Screenshot segmentation remains useful only for image-only imports where no DOM exists; that is a separate, model-quality-gated product path, not a reason to move the normal crawler into Rust.

### F2. Screenshot palette analysis is practical now through native-backed JavaScript, but it adds a new artifact contract

The crawler already produces PNG buffers for five viewport widths and writes screenshot files during extraction. The current style database does not ingest them: `style_artifacts` accepts only canonical JSON, tokens, DESIGN.md, source, CSS variables, and Tailwind files, while provenance stores only a `screenshot_url`. The indexer rejects any unsupported artifact. [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/crawl.ts:730-756] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/scripts/extract.ts:284-317] [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:97-123] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:86-93] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:224-270]

That means the hard problem is not pixel throughput but identity and publication: define screenshot roles by viewport, content hashes, capture URL/time, rights/evidence scope, algorithm version, and derived-feature rows that participate in the immutable corpus generation. Without that contract, palette results cannot be reproduced or invalidated reliably.

For computation, a custom Rust component is unnecessary initially. `sharp` is a Node binding over libvips and exposes channel statistics, entropy, sharpness, and a dominant color from a 4096-bin histogram. It is already present transitively elsewhere in the repository through `@huggingface/transformers`, although the extractor does not declare it directly. A bounded downsample plus native-backed quantization can produce rendered palette shares, contrast, saturation, and viewport stability while TypeScript retains orchestration. [SOURCE: https://sharp.pixelplumbing.com/api-input/#stats] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/package-lock.json:80-97] [SOURCE: .opencode/skills/sk-design/design-md-generator/backend/package.json:22-33]

### F3. Perceptual hashing is useful for duplicate/change automation, not semantic style similarity, and does not clear a Rust gate

Perceptual hashes can cheaply detect duplicate captures, responsive views that are visually unchanged, and large recrawl changes before expensive multimodal inference. The maintained Rust `image_hasher` crate supplies multiple perceptual algorithms and Hamming-distance comparison, so Rust has an implementation option. [SOURCE: https://docs.rs/image_hasher/latest/image_hasher/]

However, the current corpus yields only about 6,450 primary screenshots at five viewports for 1,290 bundles. Hash calculation is an offline ingestion task, not a resident query hotspot, and the useful contract is algorithm/version/viewport/hash plus a calibrated Hamming threshold. Existing native-backed JavaScript or a small WASM library should be benchmarked first. A Rust module becomes material only if the same decode pass is proven to dominate a larger image-analysis pipeline or a shared batch worker avoids repeated decoding across palette, hash, and model preprocessing.

Perceptual distance must not rank "similar style": it is intentionally sensitive to near-identical visual content, while semantically similar designs can have different pixels and small page changes can move large regions. Its safe roles are exact-ish deduplication, recrawl invalidation, and evidence-quality alerts.

### F4. Multimodal embeddings add real screenshot-to-style and text-to-visual search, but the resident text ABI cannot be reused unchanged

Transformers.js publicly supports image classification, image segmentation, image-to-text, object detection, and zero-shot image classification pipelines, and its installation in this repository brings ONNX Runtime plus sharp-backed image processing. This makes a TypeScript/native baseline viable before introducing another runtime. [SOURCE: https://huggingface.co/docs/transformers.js/api/pipelines#module_pipelines.pipeline] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/package-lock.json:80-97]

The existing resident `hf-local` embedding client is text-only: `/api/embed` receives `input: string[]`, and the shared manifest defines query/document text prefixes rather than media modality, image preprocessing, or joint image/text profile identity. Reusing the service process may be possible, but reusing the ABI or cache identity is not. [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:886-934] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:963-1021] [SOURCE: .opencode/skills/system-spec-kit/shared/embeddings/types.ts:12-74]

The genuinely new product capability is a joint-profile lane: index one or more screenshot embeddings per style and permit image-query-to-style plus text-query-to-visual-style retrieval, fused with existing structured/lexical/text-vector ranks. It requires a modality-aware profile fingerprint, deterministic resize/crop/color normalization, viewport aggregation policy, image-content hashes, and golden-vector tolerances. Rust is conditional: adopt it only if a required vision model is unsupported or measured ONNX preprocessing/inference throughput, RSS, startup, or packaging beats the JavaScript/native baseline materially. Model execution, not palette math or hashing, is the only candidate likely to justify a resident native worker.

### F5. The phased opportunity set preserves TypeScript ownership and avoids coupling cheap features to model inference

The sequence with the lowest contract risk is: (1) add a screenshot/evidence identity contract; (2) derive DOM spacing/layout fingerprints in the crawler; (3) add native-backed palette statistics and perceptual hashes as deterministic ingestion features; (4) validate whether those features improve dedupe, drift detection, facets, or retrieval; and only then (5) run a shadow multimodal profile against labeled image/text relevance cases.

TypeScript should continue to own capture, viewport policy, content hashes, schema/generation publication, feature flags, fusion, fallback, and telemetry. A Rust core should receive immutable image bytes plus an explicit algorithm/model profile and return deterministic derived values. Combining all visual processing in Rust before measurements would turn four separable features into one release and failure boundary and would violate the repository's narrow-kernel rule. [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/style-guide/interop-model.md:33-52]

## Questions Answered

- **Which new visual/style-analysis features are practical?** DOM spacing/layout fingerprints, rendered palette statistics, and perceptual hashes are practical deterministic ingestion features. Joint multimodal embeddings are practical as a shadow retrieval experiment after screenshot identity and labeled relevance data exist.
- **Which features need Rust?** None clears the Rust gate today. DOM geometry belongs in the browser/TypeScript crawler; palette and hashing should start with existing native-backed JavaScript. Only local multimodal model preprocessing/inference is a credible conditional Rust kernel.
- **Can the resident model-service shape be reused?** The long-lived process, batching, health, and telemetry shape can be reused conceptually, but the current text-only `/api/embed` payload, manifest, normalization, and cache identity cannot. A modality-aware profile and ABI are required.

## Questions Remaining

- Which labeled visual-search tasks and relevance judgments demonstrate that multimodal retrieval adds value beyond existing tokens, prose, and text embeddings?
- What screenshot artifact and derived-feature schema binds viewport, capture provenance, algorithm/model profile, and generation publication atomically?
- Can an external ANN index be atomically bound to the styles generation pointer without a new manifest contract?
- What measured arrival, selectivity, cold-build, image-processing, embedding-drain, and end-to-end query values clear phased adoption at current, 10x, and 100x scale?
- Which complete opportunity set clears residency, materiality, and scale gates today versus conditionally?

## Ruled Out Directions

- Screenshot-first spacing extraction for live pages: DOM rectangles and computed spacing are already more exact and cheaper.
- A bespoke Rust palette engine: native-backed Node image tooling supplies the initial decode/statistics baseline.
- Perceptual hashes as semantic style rank: they identify near-duplicate pixels, not design-language similarity.
- Reusing the text embedding ABI unchanged for images: modality, preprocessing, profile identity, and cache keys differ.
- One monolithic Rust visual-analysis worker before feature-level measurements: it couples independent failure and release boundaries without proven residency.

## Assessment

- **newInfoRatio:** 0.76
- **Novelty justification:** This iteration located an already-rich DOM geometry plane, exposed the missing screenshot artifact/publication contract, separated perceptual dedupe from semantic retrieval, and narrowed Rust's only plausible visual role to measured multimodal model execution.
- **Confidence:** High on current crawler/schema/embedding boundaries and deterministic feature classification; medium on multimodal model value because no labeled visual relevance set or runtime benchmark exists.

## Next Focus

Define the screenshot artifact and derived-feature publication contract, then test which labeled visual-search tasks could prove multimodal retrieval adds value beyond existing token, prose, and text-vector lanes.
