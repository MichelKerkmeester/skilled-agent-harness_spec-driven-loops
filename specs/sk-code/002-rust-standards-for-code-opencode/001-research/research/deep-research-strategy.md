# Deep-Research Strategy — Rust Standards for code-opencode (Packet 018 / Phase 001)

> Charter the deep-research loop reads at the start of every round. Single lineage, **GPT-5.6-sol** (`high`, `fast`) via **`cli-opencode`** (`openai/gpt-5.6-sol-fast`, `--variant high`), up to **10 rounds**. Research-only: **no Rust is written and no skill source is modified.**

## Objective

Produce a **code-opencode-ready Rust standard** and a **mechanical upgrade manifest**, so that when Rust enters this codebase (as napi-rs/WASM/sidecar modules interoperating with the TS/Node MCP backend), `sk-code` already routes to correct, conformant Rust guidance.

## Framing invariant (enforce every round)

Rust in this repo is **not greenfield services**. The rewrite-research packets (`system-code-graph/011`, `system-skill-advisor/013`, `system-speckit/030`) converge on **napi-rs / WASM / Rust sidecar** interoperating with the existing TypeScript/Node MCP backend, under **byte-for-byte determinism/parity** contracts (six-decimal scores, stable sort/tie-breaks, deterministic IDs). Weight every Rust recommendation to that reality. A generic Rust styleguide that ignores the interop boundary and the parity contracts is a failed round.

## Three thrusts

- **A — External Rust (web).** Official Rust API Guidelines, Rust Style Guide/rustfmt, Clippy, the Book/Reference, `napi-rs` + `wasm-bindgen`/`wasm-pack` docs, ecosystem norms. Every external claim carries `[SOURCE: url]`.
- **B — Our conventions.** How `code-opencode` encodes a language standard and how a new language registers (SMART ROUTING block, parent-hub `RESOURCE_MAP` union, drift guard, detection markers). Anchor: `.opencode/skills/sk-code/code-opencode/SKILL.md`, `.opencode/skills/sk-code/SKILL.md`, `mode-registry.json`, `hub-router.json`.
- **C — Our code.** The existing `code-opencode` language trios (`references/typescript/`, `references/python/`, `references/shell/`, `references/config/`, `references/javascript/`) and checklists as the template Rust must match structurally.

## The 11 predefined angles

**Thrust A:** A1 core idioms & API design · A2 tooling & lint tiers (rustfmt/clippy/MSRV/edition/cargo-deny) · A3 testing & benchmarking (proptest/criterion/insta/golden-parity) · A4 **FFI/interop** (napi-rs/wasm-bindgen/cxx: DTO stability, error propagation, copy vs zero-copy, packaging, native-ABI) · A5 determinism/parity + async/unsafe discipline.

**Thrust B:** A6 the language-standard convention (trio + checklist + playbook) · A7 new-language registration mechanics (SMART ROUTING + parent-hub union + drift guard + detection) · A8 validation surface (router-replay + drift guard + validate.sh).

**Thrust C:** A9 cross-language template extraction (section skeleton/depth/tone; Rust-specific vs shared-tier) · A10 language-vs-surface placement.

**Synthesis:** A11 the Rust standard + the exact upgrade manifest.

## Round → angle allocation

Round 1 → A1. Round 2 → A2. Round 3 → A3. Round 4 → **A4 (double-weight — the interop angle)**. Round 5 → A5. Round 6 → A6. Round 7 → A7. Round 8 → A9 (+ A10). Round 9 → A8 + A4 second pass (packaging/native-ABI in this repo). Round 10 → **A11 synthesis**: assemble the Rust trio + checklist content and the file/edit manifest. See `../plan.md` §3.

## Deliverables (must exist in `research.md` at convergence)

1. **Rust standard synthesis** — draft content for `references/rust/{style_guide,quality_standards,quick_reference}.md` + `assets/checklists/rust_checklist.md`, with repo-specific non-negotiables (interop boundary is a stability contract; determinism/parity byte-for-byte; no unsafe without a documented invariant + test).
2. **Upgrade manifest** — the exact files to create and the exact edits to `code-opencode/SKILL.md` (detection: `.rs` + `Cargo.toml`/`Cargo.lock`; SMART ROUTING `RUST` INTENT_SIGNALS + RESOURCE_MAP) and the parent `sk-code` hub union + drift guard + `manual_testing_playbook/language-standards/004-rust-standards.md`.
3. **Template-conformance map** — Rust trio section skeleton aligned to the existing TS/Python/shell trios.
4. **Gate plan** — the exact commands that prove the upgrade green (drift guard, skill-benchmark router-replay, `validate.sh --strict`).

## Non-goals

- Writing Rust, scaffolding a crate, or editing any skill source.
- Live Rust-vs-TS benchmarking (owned by the rewrite-research packets).

## Stop conditions

- `newInfoRatio` sustained below the convergence threshold, OR
- 10 rounds reached, OR
- All 11 angles answered with cited evidence and the four deliverables written.

## Evidence discipline

- Every finding carries `[SOURCE: file:line]` (repo) or `[SOURCE: url]` (external Rust docs).
- Confirmed-vs-inferred stated explicitly; the interop/parity framing invariant applied to every Rust recommendation.
- Every proposed file/edit is mapped to an existing sibling artifact — no invented structure that would break the parent-hub union or drift guard.
