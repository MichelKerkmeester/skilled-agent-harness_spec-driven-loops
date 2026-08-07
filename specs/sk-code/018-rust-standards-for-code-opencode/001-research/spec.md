---
title: "Feature Specification: Phase 1 — Rust Standards Deep Research"
description: "Run a 10-round GPT-5.6-sol deep-research pass to produce a code-opencode-ready Rust standard: external Rust best practices weighted to napi-rs/WASM interop with a TS/Node MCP backend and determinism parity, our own skill/standard conventions, and how code-opencode encodes its other languages — ending in a Rust standards synthesis plus an exact upgrade file/edit manifest."
trigger_phrases:
  - "rust standards research"
  - "018 rust research code-opencode"
  - "rust best practices deep research"
  - "napi-rs wasm interop standards research"
  - "rust language standard for sk-code"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/001-research"
    last_updated_at: "2026-07-11T13:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Completed the 10-round Rust-standards research and merged research.md"
    next_safe_action: "Packet complete; handoff was to 002-standard-docs (not 002-upgrade)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "research/deep-research-strategy.md"
      - "research/deep-research-fanout-config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-sk-code-018-001-rust-standards-research"
      parent_session_id: null
    completion_pct: 100
    status: "Complete"
    open_questions: []
    answered_questions:
      - "Does Rust belong as a code-opencode language trio? YES — a language slice of the code-opencode surface (mode-registry two-axis model), interop/build content stays in the Rust trio, not a new shared file."
      - "Which determinism/parity rules must be Rust non-negotiables? Byte-for-byte TS parity: per-operation six-decimal numerics, complete comparators with terminal unique tie-break, deterministic-ID preimage/encoding, BTreeMap/IndexMap for observable order, no unsafe without SAFETY+test, panics never as boundary errors (research.md Deliverable 1)."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1 — Rust Standards Deep Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-11 |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 6 (research gate) |
| **Predecessor** | None |
| **Successor** | `002-standard-docs/` — authors the Rust standard docs from this phase's manifest |
| **Handoff Criteria** | `research/research.md` produced with a Rust standard synthesis + an exact code-opencode upgrade file/edit manifest for human review |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is the **research gate**. It runs a pre-planned **10-round** deep-research pass (single lineage, **GPT-5.6-sol** at `high` reasoning, `fast` service tier, via the **`cli-opencode`** executor through `/deep:research`) over three bodies of evidence:

1. **External** — Rust best practices from the web (official Rust API Guidelines, Rust Style Guide / rustfmt, Clippy, the Rust Book/Reference, napi-rs and wasm-bindgen docs, ecosystem norms).
2. **Our conventions** — how `sk-code`/`code-opencode` encodes a language standard and how a new language is registered end-to-end.
3. **Our code** — the existing `code-opencode` language trios (TypeScript/Python/shell/config) as the template Rust must match.

**Framing invariant (enforce every round):** Rust here is not greenfield services — the rewrite-research packets (`011`, `013`, `030`) converge on **napi-rs / WASM / sidecar Rust interoperating with the existing TypeScript/Node MCP backend**, under **byte-for-byte determinism/parity** contracts (six-decimal scores, stable sort/tie-breaks). The Rust standard must be weighted to *that* reality, not a generic Rust styleguide.

**Scope Boundary**: Research and synthesize only. **No Rust is written, no crate is scaffolded, and no skill source is modified in this phase.**

**Deliverables**:
- `research/research.md` — merged, cited synthesis across all rounds.
- A **Rust standard synthesis**: the content for `references/rust/{style_guide,quality_standards,quick_reference}.md` + `assets/checklists/rust_checklist.md`, with the repo-specific non-negotiables (interop boundary, determinism parity, unsafe discipline).
- An **upgrade manifest**: the exact files to create and the exact edits to `code-opencode/SKILL.md` (detection rules + SMART ROUTING `RUST` intent/resource) and the parent `sk-code` hub union + drift guard, so phase 002 is mechanical.
- A **template-conformance map**: Rust trio section skeleton aligned to the existing TS/Python/shell trios.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Adding a language to `code-opencode` is not free-form authoring: the surface has a fixed trio+checklist+playbook shape, a machine-readable SMART ROUTING block, and a parent-hub `RESOURCE_MAP` union enforced by a drift guard and a skill-benchmark router-replay. A Rust standard written without grounding in (a) current idiomatic Rust + the interop reality this repo will use, and (b) the exact conventions and gates of our own skill system, would either be a generic styleguide that misfits the repo or a structurally non-conformant artifact that breaks the drift guard. This phase produces both the *content* and the *conformant integration plan* from evidence.

### Purpose
Produce a decision-ready, cited Rust standard and a mechanical upgrade manifest so that phase 002 can ship Rust support into `code-opencode` with the parent-hub union and all gates green on the first pass.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Survey idiomatic Rust, the official API Guidelines, the Rust Style Guide/rustfmt, Clippy lint tiers, testing/benchmarking, error handling, module/crate/workspace layout, MSRV/edition, and unsafe/async discipline.
- Deep-dive the interop surface (napi-rs, wasm-bindgen/wasm-pack, cxx): boundary DTO stability, error propagation, copy vs zero-copy, build/packaging, and cross-platform native-ABI fragility.
- Define determinism/parity rules for Rust that match the repo's byte-stable output contracts.
- Extract the `code-opencode` language-standard template from the existing trios; map the new-language registration mechanics (SMART ROUTING, parent-hub union, drift guard, detection markers).
- Produce `research.md`, the Rust standard synthesis, the upgrade manifest, and the template-conformance map.

### Out of Scope
- Writing Rust, scaffolding a crate, or wiring napi-rs/WASM anywhere.
- Editing `code-opencode`, the parent hub, or any skill source (owned by phase 002).
- Live benchmarking Rust vs TypeScript (belongs to the rewrite-research packets, not here).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/deep-research-fanout-config.json` | Create | cli-opencode executor config (openai/gpt-5.6-sol-fast, high, 10 rounds) |
| `research/deep-research-strategy.md` | Create | Charter: three thrusts, 11 angles, framing invariant, deliverables, stop conditions |
| `research/deep-research-state.jsonl` | Create | Append-only round state log (loop-generated) |
| `research/iterations/iteration-*.md` | Create | Per-round findings (loop-generated) |
| `research/research.md` | Create | Merged synthesis + Rust standard + upgrade manifest (loop-generated) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run the deep-research loop to convergence or the 10-round cap with the GPT-5.6-sol cli-opencode executor | `research/deep-research-state.jsonl` shows rounds with a terminal `stopReason` (`converged` or `maxIterationsReached`) |
| REQ-002 | Merged synthesis produced | `research/research.md` exists with cross-round findings and `[SOURCE: file:line]` (repo) / `[SOURCE: url]` (external) citations |
| REQ-003 | Rust standard synthesis produced | Draft content for the `references/rust/` trio + `rust_checklist.md`, including the interop-boundary and determinism-parity non-negotiables |
| REQ-004 | Conformance to our conventions verified | Every proposed file/edit is mapped to an existing sibling (TS/Python trio, an existing checklist, the SMART ROUTING block, the parent-hub union) — no invented structure |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Upgrade manifest produced | Exact list of files to create + exact SKILL.md / parent-hub / drift-guard edits, ready for phase 002 to apply mechanically |
| REQ-006 | Detection + routing design | `.rs` + `Cargo.toml`/`Cargo.lock` detection rules and the `RUST` INTENT_SIGNALS/RESOURCE_MAP entries drafted, consistent with the parent-hub union equality |
| REQ-007 | Gate plan | Names the exact commands that prove the upgrade green (drift guard, skill-benchmark router-replay, `validate.sh --strict`) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` consolidates all rounds with citations.
- **SC-002**: Every predefined angle (§7) is answered or explicitly marked unresolved with the reason.
- **SC-003**: The Rust standard is weighted to napi-rs/WASM interop + determinism parity, not a generic styleguide; each non-negotiable names the repo contract it protects.
- **SC-004**: The upgrade manifest is mechanical — phase 002 can apply it without re-deriving structure, and it preserves the parent-hub union equality.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Generic Rust styleguide that ignores the interop reality | Misfit standard, low value | Framing invariant forces napi-rs/WASM/sidecar + determinism weighting every round |
| Risk | Structurally non-conformant Rust docs | Drift guard / router-replay break in 002 | REQ-004/REQ-006 map every artifact to an existing sibling + the parent-hub union |
| Risk | cli-opencode lineage runs `--dangerously-skip-permissions` | Rogue delete/modify of the live tree | Run in an isolated git worktree; research writes only under `research/`; clean baseline recorded |
| Risk | 10 rounds × GPT-5.6-sol high with web search | Multi-hour, real API cost | 1-round smoke check first; single lineage; convergence may stop early; state is resumable |
| Risk | opencode `openai` provider not authed | Loop fails | Provider pre-flight confirmed (OpenAI OAuth configured); 1-round smoke verifies live |
| Dependency | `opencode` CLI + `openai/gpt-5.6-sol-fast` | Loop cannot run | opencode v1.17.11 present; model confirmed in `opencode models` |
| Dependency | `code-opencode` + parent hub source | No template/subject | Present in-repo, read-only for this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

These **predefined research angles** seed the loop, grouped by thrust. Each must be answered or explicitly marked unresolved, and each names concrete anchors. Round→angle allocation is in `plan.md` §3 and `research/deep-research-strategy.md`.

### Thrust A — External Rust best practices (weighted to this repo's interop reality)

1. **A1 — Core idioms & API design.** Ownership/borrowing patterns, `Result`-based error handling (`thiserror`/`anyhow`), newtypes, builder/Into patterns, module/crate/workspace layout, and the official Rust API Guidelines. `[SOURCE: url]`.
2. **A2 — Tooling & lint tiers.** `rustfmt` config, `clippy` lint levels/tiers (warn/deny, pedantic), `cargo` workflows, MSRV + edition policy, and supply-chain (`cargo-deny`, `cargo-audit`). `[SOURCE: url]`.
3. **A3 — Testing & benchmarking.** Unit/integration/doc tests, `proptest`, `criterion`, snapshot (`insta`), and **golden/parity testing** as a first-class practice. `[SOURCE: url]`.
4. **A4 — FFI/interop (the load-bearing angle).** `napi-rs` (Node addon), `wasm-bindgen`/`wasm-pack` (WASM), `cxx`: boundary DTO stability, error propagation across the boundary, copy vs zero-copy, panic-safety, and build/packaging (`prebuildify`, cross-platform, native-ABI fragility). `[SOURCE: url]`.
5. **A5 — Determinism/parity, async & unsafe.** Reproducing byte-stable/six-decimal/stable-sort/tie-break contracts in Rust (float formatting, sort stability, hashing order); `tokio`/`rayon` where warranted; and unsafe discipline (documented invariants + tests). `[SOURCE: url]`.

### Thrust B — Our skill & standard conventions

6. **A6 — The code-opencode language-standard convention.** The `references/<lang>/{style_guide,quality_standards,quick_reference}.md` trio + `assets/checklists/<lang>_checklist.md` + `manual_testing_playbook/language-standards/` shape, and the "non-negotiables" framing. `[SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md]`.
7. **A7 — New-language registration mechanics.** The SMART ROUTING block (`INTENT_SIGNALS` + `RESOURCE_MAP`), the parent `sk-code` hub `RESOURCE_MAP` **union projection**, the **drift guard** that enforces equality, and the two-step detection rules (surface trigger + extension/marker). `[SOURCE: .opencode/skills/sk-code/code-opencode/SKILL.md:42]` `[SOURCE: .opencode/skills/sk-code/SKILL.md]`.
8. **A8 — Validation surface.** How the skill-benchmark router-replay + drift guard + `validate.sh --strict` gate a language addition, and exactly what "green" is. `[SOURCE: .opencode/skills/sk-code/code-opencode/benchmark/]`.

### Thrust C — How code-opencode handles its other languages

9. **A9 — Cross-language template extraction.** Compare the TypeScript/Python/shell trios to derive the canonical section skeleton, depth, and tone, and to decide what is Rust-specific vs deferred to the shared tier. `[SOURCE: .opencode/skills/sk-code/code-opencode/references/typescript/]` `[SOURCE: .opencode/skills/sk-code/code-opencode/references/python/]`.
10. **A10 — Language vs surface placement.** Confirm Rust belongs as a `code-opencode` language (not a separate surface like `code-webflow`), and where interop/build content lives (language trio vs `references/shared/`). `[SOURCE: .opencode/skills/sk-code/mode-registry.json]`.

### Synthesis

11. **A11 — Rust standard + upgrade manifest (round 10).** Assemble the Rust trio + checklist content and the exact file/edit manifest (SKILL.md detection + `RUST` routing, parent-hub union, drift-guard update, playbook entry), plus the gate commands that prove it green.

### Non-Goals (charter)
- Writing Rust, scaffolding a crate, or editing any skill source.
- Live Rust-vs-TS benchmarking.

### Stop Conditions (charter)
- `newInfoRatio` sustained below the convergence threshold, OR
- 10 rounds reached, OR
- All 11 angles answered with cited evidence, plus the Rust standard synthesis and the upgrade manifest written.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Successor**: `../002-standard-docs/`
- **Upgrade target**: `../../../../skills/sk-code/code-opencode/`
- **Plan**: `plan.md` (10-round allocation + executor config)
- **Loop artifacts**: `research/research.md`, `research/deep-research-strategy.md`, `research/deep-research-state.jsonl`
