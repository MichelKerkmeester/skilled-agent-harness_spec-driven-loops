---
title: "sk-code adapter"
description: "The hybrid authority adapter that surface-detects code artifacts and runs the real per-surface drift tooling plus a reasoning-agent dispatch layer for the code artifact-class."
trigger_phrases:
  - "sk-code adapter"
  - "surface detection stack_detection"
  - "verify_alignment_drift.py"
  - "webflow minification verification"
  - "reasoning-agent dispatch packet"
version: 1.0.0.0
---

# sk-code adapter

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The hybrid authority adapter that surface-detects code artifacts and runs the real per-surface drift tooling plus a reasoning-agent dispatch layer for the `code` artifact-class.

`sk-code.cjs` is the hardest, least-deterministic adapter (ADR-008: HYBRID). It wraps the real sk-code surface-detection router and the real deterministic drift tooling, and builds a documented dispatch packet for everything that tooling structurally cannot check. Every finding is tagged `deterministic` or `reasoning-agent` — no false determinism.

## 2. HOW IT WORKS

`discover()` walks code files (the OpenCode-checkable extension set plus CSS/HTML), reading each candidate's content because `stack_detection.md`'s WEBFLOW detection order includes a content-grep fallback a path-only classifier cannot reproduce. It classifies each artifact's surface (OPENCODE highest precedence, then WEBFLOW path/filename/content markers, else UNKNOWN) and flags a MOTION_DEV overlay signal. `standardSource('sk-code')` returns the surface router, the per-surface validators, an `excludedFromCheck` record for the tree-mutating `minify-webflow.mjs`, and the reference dirs. `check()` runs a surface-routed deterministic layer — `verify_alignment_drift.py --root` for OPENCODE (ERROR → P0, WARN → P1; a non-covered extension yields a `deterministic-layer-not-applicable` P2), and `verify-minification.mjs`/`test-minified-runtime.mjs` for WEBFLOW when a real project root is discoverable (FAIL → P0; otherwise an honest `deterministic-layer-unavailable` fallback per NFR-R01) — plus a reasoning-agent `checkPatternConformance()` layer. That layer is verify-first: `buildReasoningLayerDispatch()` prepares which dimensions to judge and which references to read, but the `.cjs` never judges itself; it only translates confirmed, cited contradictions the caller feeds back into findings.

The adapter deliberately excludes `minify-webflow.mjs` from `check()` because it writes `z_minified/*.min.js` and a manifest, which would violate the read-only default; a documented spec-vs-tool extension-set discrepancy (Rust) is recorded rather than silently resolved.

**Difference from deep-review:** deep-review reviews code correctness generally with one leaf agent's judgment. sk-code-adapter instead checks code against sk-code's *own* stack-detection and pattern references, runs sk-code's real drift/minification tools deterministically, and cleanly separates what a script proved from what a reasoning agent judged — and it refuses to run any tool that would mutate the reviewed tree.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/adapters/sk-code.cjs` | Adapter | `discover`/`standardSource`/`check`, the ported surface classifier, per-surface subprocess wrappers, and `buildReasoningLayerDispatch()`. |
| `references/adapters/sk_code_adapter.md` | Reference | Full specification: surface classifier provenance, the two deterministic surfaces (Section 4.1), the reasoning-agent dispatch (ADR-008). |
| `references/adapters/sk_code_known_deviations.md` | Reference | The sk-code suppression list parsed by `loadKnownDeviations()`. |
| `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py` | Wrapped tool | The OPENCODE deterministic drift checker. |
| `.opencode/skills/sk-code/code-webflow/assets/scripts/verify-minification.mjs` | Wrapped tool | The WEBFLOW minification-pattern-preservation checker (read-only). |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/adapters/sk-code.cjs` CLI (`discover`/`check`/`standard-source`/`reasoning-dispatch`) | Manual dry-run | Runs the adapter and prints the reasoning-agent dispatch packet for inspection. |
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/007-adapter-sk-code/` | Spec phase | The sk-code hybrid adapter's spec and acceptance criteria (REQ-001, REQ-002, REQ-005, ADR-008). |

---

## 4. SOURCE METADATA

- Group: Adapter contract
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `adapter-contract/adapter-sk-code.md`
- Primary sources: `scripts/adapters/sk-code.cjs`, `references/adapters/sk_code_adapter.md`, `references/adapters/sk_code_known_deviations.md`
Related references:
- [adapter-sk-design.md](adapter-sk-design.md) — sk-design adapter
- [check.md](check.md) — check(artifact, rules)
- [../alignment-contract/read-only-default.md](../alignment-contract/read-only-default.md) — Read-only default
