# Iteration 9: Rust Boundary, Adapter, Fallback, and Parity

## Focus

Specify the smallest architecture that could host local multimodal inference or later ANN without transferring product behavior into Rust.

## Findings

1. TypeScript already has the correct control plane. `resolveStyleDatabaseMode()` owns the default-off `legacy|shadow|persistent` choice, and shadow mode returns legacy results while recording persistent comparison evidence. Any native capability must sit below this adapter rather than invent a fourth database authority. [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:16-18,97-166]
2. The preferred first boundary is a workspace with `styles-search-core` plus exactly one thin napi-rs adapter. The pure core may own pinned model/tokenizer loading, deterministic preprocessing, batch text/image inference, vector validation/encoding, palette/pHash primitives if co-located, and later a versioned ANN interface. The napi adapter only converts owned DTOs/buffers, dispatches measured blocking/CPU work, and maps typed errors. It must not own SQLite, feature flags, queries, fusion, cards, licensing, generation publication, or filesystem/network transport. [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/quick-reference/overview-and-boundary-template.md:29-70] [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/quality-standards/overview-and-data-ownership.md:58-72,217-226]
3. napi-rs is preferable to baseline WASM for the first model runtime because the current host is Node and inference is CPU/blocking work. The standard says to use `AsyncTask` only for measured CPU or blocking work and notes baseline WASM is single-threaded. A sidecar becomes preferable only if model-process isolation, crash containment, GPU/runtime conflicts, or sharing one loaded model across multiple tools outweigh IPC and supervision cost. Choose one adapter per phase, not three speculative transports. [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/style-guide/interop-errors-and-parity.md:194-214]
4. TypeScript remains the shell: it fetches/validates screenshot bytes, resolves model/profile and feature flags, chooses Rust versus JS fallback, batches work, writes vector/cache rows, publishes generations, performs retrieval/fusion/card assembly, applies timeouts, and records shadow telemetry. Rust exposes capability and never self-selects. This also preserves the existing embedder callback seam. [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/style-guide/interop-errors-and-parity.md:273-283] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:622-655]
5. The fallback should be a real TypeScript-shell implementation using Node ONNX Runtime/Sharp for the same pinned model and preprocessing contract, not a disabled error path. Rust failure, unsupported platform, model checksum mismatch, timeout, or failed self-test routes to JS and emits telemetry; the DB adapter mode remains unchanged. Rollback is therefore a feature-flag flip plus removal of the optional native package, with no database rollback when vectors are profile-versioned. [INFERENCE: existing adapter and profile seams]
6. Parity is a release blocker. Golden bytes originate from a pinned TypeScript oracle and cover DTO serialization, tokenizer/preprocessing output, palette/pHash, profile/cache keys, vector byte encoding, errors, omissions, Unicode, ties, and final result cards. Native and fallback artifacts each replay the same fixtures. Model/provider numerical drift must be quantized by an explicit shared contract or it fails the gate; semantic closeness is insufficient. [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/quality-standards/determinism-and-parity.md:37-118,215-244]
7. ANN needs an additional constraint: approximate candidate selection cannot promise arbitrary-query byte identity with the exact TypeScript oracle. It can ship only as a separately flagged capability with a pinned serialized index/search profile, recall@k and stability gates, exact deterministic re-score/tie-break, and exact fallback. If repository policy interprets byte parity as whole-result equality for every query, ANN cannot satisfy the standard and must remain an experiment or use an identical JS/WASM binding to the same engine/index. [INFERENCE: approximation semantics plus parity standard]
8. Packaging risk is explicit: publish integrity-pinned optional binaries for supported Node/OS/architecture targets, test missing/corrupt/addon-load failure, keep generated declarations reviewed, run golden replay on every target, and reject model/index artifacts whose profile checksums differ. No network download occurs inside the Rust core. [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/quality-standards/overview-and-data-ownership.md:58-72] [SOURCE: .opencode/skills/sk-code/code-opencode/references/rust/quality-standards/determinism-and-parity.md:215-232]

## Ruled Out

- Rust ownership of SQLite, adapter mode, transport, feature flags, or ranking policy.
- Shipping napi-rs, WASM, and sidecar adapters simultaneously.
- A fallback that only reports “native unavailable.”
- Semantic-only parity or Rust-authored golden fixtures.
- Native model/index artifact downloads from inside the core.

## Dead Ends

- Adding a native backend directly to `legacy|shadow|persistent` conflates storage migration with compute selection.

## Edge Cases

- Ambiguous input: new features lack a historical TS implementation; their JS fallback becomes the pinned behavior oracle before Rust ships.
- Contradictory evidence: ANN is valuable precisely because it differs from exact search, so strict whole-result parity may prohibit it.
- Missing dependencies: supported platform matrix, model license/size, and accepted inference quantization contract.
- Partial success: ship the JS fallback and shadow telemetry before the native adapter.

## Sources Consulted

- `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs`
- `.opencode/skills/sk-design/styles/_engine/style-library.mjs`
- `.opencode/skills/sk-design/styles/_db/indexer.mjs`
- `.opencode/skills/sk-code/code-opencode/references/rust/quick-reference/overview-and-boundary-template.md`
- `.opencode/skills/sk-code/code-opencode/references/rust/quality-standards/overview-and-data-ownership.md`
- `.opencode/skills/sk-code/code-opencode/references/rust/quality-standards/determinism-and-parity.md`
- `.opencode/skills/sk-code/code-opencode/references/rust/style-guide/interop-errors-and-parity.md`

## Assessment

- New information ratio: 0.63
- Questions addressed: adapter and parity architecture
- Questions answered: adapter and parity architecture

## Reflection

- What worked and why: anchoring below the existing migration adapter preserved product authority and made rollback concrete.
- What did not work and why: strict byte parity remains structurally tense with approximate retrieval and cross-runtime model numerics.
- What I would do differently: obtain a policy decision on ANN parity before any ANN implementation.

## Recommended Next Focus

Rank every opportunity and produce a gate-driven phased adoption path.
