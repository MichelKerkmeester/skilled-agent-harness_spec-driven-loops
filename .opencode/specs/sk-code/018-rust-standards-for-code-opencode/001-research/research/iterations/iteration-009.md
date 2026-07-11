<!-- provenance: manual cli-opencode orchestration | executor openai/gpt-5.6-sol-fast --variant high | round 9 angle A8+A4(2nd pass) — Validation surface + Rust packaging -->

The round is read-only and repo-grounded. I’ll load the deep-research contract, inspect the benchmark/validation and rewrite-research evidence, then verify every cited line and command before producing the single Markdown deliverable.
The required context trigger timed out, so no memory result is being treated as evidence. Skill routing is explicit from the request: `deep-research`; I’m loading that workflow before inspecting repository files.
Repository evidence confirms the Rust target is a narrow interop boundary, not a wholesale service rewrite: all three packets describe long-lived TS/Node MCP backends whose heavy primitives are already native or WASM. The remaining question is the exact validation invocation and distribution contract, so I’m narrowing inspection to the benchmark reports, router-sync test, and canonical napi-rs/wasm-bindgen guidance.
## Round 9 — A8 + A4 Second Pass: Validation Surface and Rust Packaging

### Validation Surface

**Confirmed:** `code-opencode` owns an inline machine-readable router whose paths are relative to the surface root. The parent `sk-code` router must equal the re-prefixed union of the `code-opencode` and `code-webflow` child maps plus a fixed parent-owned tier. Therefore, adding Rust requires updating the child language slice and the parent projection together. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:42-50] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:113-124]

**Confirmed:** The drift guard performs four relevant checks:

- The machine-readable router parses.
- Every routed path exists.
- Every routable reference/asset document is covered.
- Every explicit full path in the prose maps appears in the machine projection. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:85-110]

It separately asserts that each child router is non-empty, every child path exists, and the parent map is exactly the re-prefixed child union plus the allowlisted parent tier. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts:144-192]

**Actionable consequence:** A Rust addition is incomplete unless the following become routable together:

- `references/rust/style_guide.md`
- `references/rust/quality_standards.md`
- `references/rust/quick_reference.md`
- `assets/checklists/rust_checklist.md`

The existing language contract loads one detected language trio, while quality checklists are separately routed. [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:26-40] [SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:77-116]

### Router-Replay Meaning of Green

**Confirmed:** Mode A is the deterministic CI gate. It parses the target skill’s `INTENT_SIGNALS` and `RESOURCE_MAP`, replays substring scoring against authored playbook scenarios, runs the D5 connectivity hard gate first, and then emits JSON and Markdown reports. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:17-25] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:100-110]

**Confirmed:** The current `code-opencode` Mode-A baseline is:

- Verdict `PASS`
- Aggregate `84/100`
- Eight of eight scenarios passed
- D1-intra `100`
- D2 discovery `100`
- D5 connectivity `100`
- No connectivity-gate failure, hub-route regression, known gap, or tool-surface violation [SOURCE: .opencode/skills/sk-code/code-opencode/benchmark/router-mode-a/skill-benchmark-report.md:3-23] [SOURCE: .opencode/skills/sk-code/code-opencode/benchmark/router-mode-a/skill-benchmark-report.md:30-49] [SOURCE: .opencode/skills/sk-code/code-opencode/benchmark/router-mode-a/skill-benchmark-report.json:11-27]

**Confirmed:** D1-inter advisor behavior and D4 usefulness are not measured by Mode A. They must not be represented as green merely because router replay passes. [SOURCE: .opencode/skills/sk-code/code-opencode/benchmark/router-mode-a/skill-benchmark-report.md:23-28] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:106-111]

**Important gate defect:** The benchmark orchestrator returns exit code `0` after writing the report regardless of the report verdict. CI must inspect `skill-benchmark-report.json`; process success alone does not prove a green benchmark. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:208-218]

The checked-in directory named `live-mode-b` reports `traceMode: live`, but its report still describes D1-inter and D4 as unscored. It is supporting routing evidence, not a substitute for the deterministic Mode-A gate or a complete live usefulness evaluation. [SOURCE: .opencode/skills/sk-code/code-opencode/benchmark/live-mode-b/skill-benchmark-report.json:3-12] [SOURCE: .opencode/skills/sk-code/code-opencode/benchmark/live-mode-b/skill-benchmark-report.md:23-28]

### Exact Gate Plan

Run from the repository root.

#### 1. Parent/child router-union drift guard

```bash
npx vitest run .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts
```

Green means every test passes, including the exact parent-union assertion. This is the repository-documented standalone invocation. [SOURCE: .opencode/skills/sk-code/shared/references/smart_routing.md:297-301] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/README.md:180-190]

#### 2. Deterministic skill-benchmark router replay

```bash
node .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs \
  --skill .opencode/skills/sk-code/code-opencode \
  --outputs-dir .opencode/skills/sk-code/code-opencode/benchmark/router-mode-a \
  --trace-mode router
```

Then fail closed on the generated report:

```bash
node -e '
const r = require("./.opencode/skills/sk-code/code-opencode/benchmark/router-mode-a/skill-benchmark-report.json");
const allPassed = r.funnel?.passed === r.coverage?.scored;
if (r.verdict !== "PASS" || r.gate?.gateFailed || r.gate?.d5Score !== 100 || !allPassed) {
  console.error(JSON.stringify({
    verdict: r.verdict,
    gate: r.gate,
    funnel: r.funnel,
    coverage: r.coverage
  }, null, 2));
  process.exit(1);
}
'
```

The benchmark CLI’s required arguments and output behavior are confirmed by its entrypoint and orchestrator. [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:177-218] [SOURCE: .opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs:277-291]

The language addition should also add Rust-focused playbook scenarios; otherwise the old eight scenarios can remain green without proving Rust detection or Rust resource selection.

#### 3. Strict packet validation

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <owning-language-addition-spec-folder> --strict
```

**Confirmed:** This is the canonical strict-validation command. Exit codes are `0=pass`, `1=user error`, `2=validation error`, and `3=system error`; strict mode also enables evidence, generated-metadata, command-parity, and applicable continuity-freshness checks. [SOURCE: .opencode/skills/sk-code/shared/references/workflow_verify.md:76-88]

**Unknown:** None of the inspected rewrite-research parent specs is identified as the owning packet for the `code-opencode` Rust-standard addition. Substituting one of those three paths would fabricate scope. Replace the placeholder with the frozen implementation packet when that packet is established.

### Repo-Specific Rust Boundary

**Confirmed:** All three rewrite subjects are long-lived TypeScript/Node MCP backends, not greenfield Rust services:

- Code graph already uses WASM parsing and native SQLite; candidate Rust work is JS-resident indexing, traversal, normalization, and ranking. [SOURCE: .opencode/specs/system-code-graph/011-rust-backend-rewrite-research/spec.md:61-67]
- Skill advisor already uses native SQLite and ONNX/vector paths; its strongest candidate is the scoring and ranking core. [SOURCE: .opencode/specs/system-skill-advisor/013-rust-backend-rewrite-research/spec.md:61-67]
- Spec memory already uses `sqlite-vec`, `better-sqlite3`, ONNX, and tree-sitter WASM; only a minority of fusion, ranking, and extraction work is pure TypeScript. [SOURCE: .opencode/specs/system-speckit/030-rust-backend-rewrite-research/spec.md:61-67]

**Recommendation:** Default to a targeted Rust compute crate exposed through napi-rs. Keep MCP transport, tool schemas, daemon/CLI wiring, feature flags, and fallback selection in TypeScript. A sidecar is justified only when crash isolation, independent lifecycle, or process-level resource control outweighs serialization and protocol costs. This follows the packets’ own decision space of targeted native module versus sidecar versus no rewrite. [SOURCE: .opencode/specs/system-code-graph/011-rust-backend-rewrite-research/spec.md:64-67] [SOURCE: .opencode/specs/system-skill-advisor/013-rust-backend-rewrite-research/spec.md:64-67]

### Node-API and Native Packaging

**Confirmed externally:** Node-API is ABI-stable across compatible Node releases, but that guarantee does not cover OS, CPU, libc, deployment target, linked native libraries, or APIs introduced after the selected Node-API level. [SOURCE: https://nodejs.org/api/n-api.html#node-api] [SOURCE: https://napi.rs/docs/more/support-compatibility#node-api-abi-compatibility]

Rules for this repository:

1. Select the lowest Node-API level that supports the addon’s actual API usage.
2. Declare the matching `napiN` Cargo feature and `engines.node` floor.
3. Test the oldest claimed Node runtime explicitly.
4. Do not derive the runtime floor from the newer Node version required to run `@napi-rs/cli`; build-tool and addon-runtime requirements are separate. [SOURCE: https://napi.rs/docs/more/support-compatibility#node-api-abi-compatibility] [SOURCE: https://napi.rs/docs/more/support-compatibility#cli-and-rust-requirements]

Do not hard-code a Node-API version into the Rust standard before checking the repository’s supported Node floor and required napi-rs APIs. “Use N-API 8/9” without that evidence would be arbitrary.

### Platform Packages

**Confirmed externally:** napi-rs normally publishes a small root package plus one platform package per OS/CPU/libc target. The root package lists those platform packages under `optionalDependencies`; each platform package uses `os`, `cpu`, and where necessary `libc` constraints. The generated loader selects a local development binary or the matching installed package. [SOURCE: https://napi.rs/docs/introduction/getting-started#how-the-generated-package-is-distributed]

Recommended package shape:

```json
{
  "optionalDependencies": {
    "@repo/native-darwin-arm64": "x.y.z",
    "@repo/native-darwin-x64": "x.y.z",
    "@repo/native-win32-x64-msvc": "x.y.z",
    "@repo/native-linux-x64-gnu": "x.y.z",
    "@repo/native-linux-x64-musl": "x.y.z",
    "@repo/native-linux-arm64-gnu": "x.y.z"
  }
}
```

The exact matrix must be support-policy-driven. Adding a target to `napi.targets` does not create or test its CI build automatically; each claimed target needs an artifact build, real load test, clean-install selection test, and oldest OS/libc/Node verification. [SOURCE: https://napi.rs/docs/introduction/getting-started#how-the-generated-package-is-distributed] [SOURCE: https://napi.rs/docs/more/support-compatibility#adding-or-claiming-a-target]

### WASM/WASI Fallback

**Recommendation:** For a fallback to the same Node-facing addon API, prefer napi-rs’s generated WASI path over a separately designed `wasm-bindgen` package. napi-rs can build `wasm32-wasip1-threads`, generate shared types and Node loaders, try native first, and then load a local or separately published `-wasm32-wasi` package. [SOURCE: https://napi.rs/docs/concepts/webassembly#webassembly-and-wasi] [SOURCE: https://napi.rs/docs/concepts/webassembly#how-native-to-wasi-fallback-works]

Use `wasm-bindgen --target nodejs` when the module intentionally has a separate wasm-bindgen ABI or must also serve non-WASI environments; that target generates CommonJS-compatible Node shims. [SOURCE: https://rustwasm.github.io/docs/wasm-bindgen/reference/deployment.html#nodejs]

WASI is a separate release target, not presumed equivalent to native. Filesystem behavior, threading, operating-system APIs, memory limits, and native dependencies can differ. [SOURCE: https://napi.rs/docs/concepts/webassembly#webassembly-and-wasi]

For this repository’s byte-for-byte contracts, CI must run the same parity corpus against:

- Existing TypeScript implementation
- Each supported native platform binary
- Forced WASI fallback using `NAPI_RS_FORCE_WASI=error`

The forced mode prevents a fallback test from silently exercising the native addon. [SOURCE: https://napi.rs/docs/concepts/webassembly#how-native-to-wasi-fallback-works]

The corpus must compare serialized boundary output, not merely Rust-domain values: six-decimal formatting, negative zero handling, non-finite-number policy, stable sort and tie-break order, deterministic IDs, byte encoding, and order-independent hashing/iteration must match exactly.

### Encode-this

- **(style_guide)** Keep MCP transport and public tool contracts in TypeScript; expose only measured compute kernels through a narrow napi-rs/WASI interface.
- **(style_guide)** Never let `HashMap` iteration order, unstable sorting, locale formatting, or platform-native path behavior determine observable output; contract: deterministic IDs/hash/order.
- **(quality_standards)** Select the lowest proven Node-API level, declare the matching runtime floor, and test the oldest claimed Node version; contract: native ABI compatibility.
- **(quality_standards)** Publish one constrained optional package per supported OS/CPU/libc target; require clean-install and real-load tests for every claimed target.
- **(quality_standards)** Treat native and WASI as separate release targets and run the identical TS/native/WASI golden corpus; contracts: six-decimal formatting, stable sort/tie-breaks, deterministic IDs/hash/order.
- **(quality_standards)** Force fallback tests with `NAPI_RS_FORCE_WASI=error`; a test that can silently load native is not fallback evidence.
- **(quick_reference)** Run `sk-code-router-sync.vitest.ts`, regenerate Mode-A router replay, inspect the JSON verdict/hard gate, then run `validate.sh <owning-spec-folder> --strict`.
- **(quick_reference)** Do not use benchmark process exit `0` as the verdict; assert `verdict === "PASS"`, `gateFailed === false`, D5 `100`, and all scored scenarios passed.
- **(checklist)** Add the Rust language trio, Rust checklist, child-router entries, parent-union projection, and Rust-specific routing scenarios in one change.
- **(checklist)** Verify byte-for-byte serialized output across TS, every native target, and forced WASI before claiming parity; contracts: all determinism and interop contracts.
