---
title: "Implementation Plan: Phase 1 — Rust Standards Deep Research"
description: "Configure and run a single-lineage 10-round deep-research loop (GPT-5.6-sol high/fast via cli-opencode) across three thrusts (external Rust best practices, our skill conventions, our other-language templates), then synthesize a Rust standard plus an exact code-opencode upgrade manifest."
trigger_phrases:
  - "018 rust research plan"
  - "rust standards research plan"
  - "10 round rust research allocation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/001-research"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the 10-round allocation and cli-opencode executor config"
    next_safe_action: "1-round smoke check; then launch the loop"
    blockers: []
    key_files:
      - "research/deep-research-fanout-config.json"
      - "research/deep-research-strategy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-sk-code-018-001-rust-standards-research"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1 — Rust Standards Deep Research

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Deep-research loop (`/deep:research`) over `system-deep-loop` runtime |
| **Executor** | `cli-opencode` — `openai/gpt-5.6-sol-fast`, `reasoningEffort=high` (→ `--variant high`) |
| **Subject** | External Rust docs (web) + `sk-code`/`code-opencode` conventions + existing language trios |
| **Storage** | `research/` JSONL state + `iterations/` + merged `research.md` |
| **Testing** | 1-round smoke check + cap/convergence verification + `validate.sh` |

### Overview
Run one deep-research lineage of up to 10 rounds with GPT-5.6-sol (high, fast) via `cli-opencode`, across three thrusts: (A) external Rust best practices weighted to napi-rs/WASM interop + determinism parity, (B) our skill/standard conventions and the new-language registration + drift-guard mechanics, and (C) the existing code-opencode language trios as the structural template. Synthesize a Rust standard (trio + checklist content) and an exact upgrade manifest for phase 002. Research-only: no Rust is written and no skill source is touched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `opencode` installed; `openai` provider authed; `openai/gpt-5.6-sol-fast` resolvable
- [ ] `deep-research-fanout-config.json` written with the cli-opencode executor block (openai/gpt-5.6-sol-fast, high, iterations 10)
- [ ] `deep-research-strategy.md` seeded (3 thrusts, 11 angles, framing invariant, deliverables, stop conditions)
- [ ] 1-round smoke check passes (executor reachable, writes an iteration file + JSONL delta)
- [ ] Loop scoped to an isolated worktree (cli-opencode runs `--dangerously-skip-permissions`)

### Definition of Done
- [ ] `research/deep-research-state.jsonl` shows a terminal `stopReason`
- [ ] `research/research.md` merged with citations
- [ ] Rust standard synthesis + upgrade manifest + template-conformance map + gate plan present
- [ ] `validate.sh` passes for this spec folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-lineage sequential deep-research (`/deep:research`), one round per iteration, externalized state in `research/deep-research-state.jsonl`. The 10 rounds are pre-allocated to 11 angles across three thrusts; the loop may converge early but must cover every angle at least once. The interop angle (A4) and synthesis (A11) are highest-value.

### Round → angle allocation

| Round | Angle | Thrust | Question the round must close |
|-------|-------|--------|-------------------------------|
| 1 | A1 Core idioms & API design | A | Ownership/error/module patterns + Rust API Guidelines to encode |
| 2 | A2 Tooling & lint tiers | A | rustfmt/clippy tiers, MSRV/edition, cargo-deny/audit policy |
| 3 | A3 Testing & benchmarking | A | unit/doc/proptest/criterion/insta + golden-parity practice |
| 4 | A4 FFI/interop (double-weight) | A | napi-rs/wasm-bindgen/cxx boundary, DTO stability, packaging, native-ABI |
| 5 | A5 Determinism/parity + async/unsafe | A | byte-stable output in Rust; tokio/rayon; unsafe discipline |
| 6 | A6 Language-standard convention | B | trio+checklist+playbook shape + non-negotiables framing |
| 7 | A7 Registration mechanics | B | SMART ROUTING + parent-hub union + drift guard + detection markers |
| 8 | A9 (+A10) Template extraction & placement | C | canonical section skeleton; Rust-specific vs shared-tier; language vs surface |
| 9 | A8 + A4 second pass | B/A | router-replay/drift/validate gate plan; repo-specific packaging/native-ABI |
| 10 | A11 Synthesis | — | Rust standard content + exact upgrade file/edit manifest + gate commands |

### Loop mechanics
- **Convergence**: `newInfoRatio` below threshold for the window, OR 10 rounds, OR all angles closed with the four deliverables written.
- **Evidence discipline**: `[SOURCE: file:line]` (repo) / `[SOURCE: url]` (external); the interop/parity framing invariant on every Rust recommendation; every proposed artifact mapped to an existing sibling.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm `opencode` + `openai/gpt-5.6-sol-fast` reachable; provider authed.
- Write the fanout-config (done) and seed the strategy (done).
- Create/point at an isolated git worktree for the run; record a clean baseline.
- 1-round smoke check.

### Phase 2: Core Loop
- Launch the single-lineage 10-round loop via the `/deep:research` owned runner (`fanout-run.cjs`), cli-opencode executor.
- Execute the round→angle allocation; append per-round findings + JSONL state.
- Converge or hit the 10-round cap; merge into `research.md` with the four deliverables.

### Phase 3: Verification
- Confirm a terminal `stopReason`; confirm every angle A1–A11 appears in at least one round.
- Confirm the upgrade manifest is mechanical and preserves the parent-hub union equality.
- Run `validate.sh`; update `implementation-summary.md`; hand off to `002-upgrade/`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Smoke**: 1-round run confirms the cli-opencode executor is reachable and writes an iteration file.
- **Cap/convergence**: `deep-research-state.jsonl` ends with a terminal `stopReason`.
- **Coverage**: every angle A1–A11 appears in at least one round.
- **Conformance check**: every proposed file/edit maps to an existing sibling; the RUST routing entry preserves the parent-hub union.
- **Structure**: `scripts/spec/validate.sh` passes for `018-rust-standards-for-code-opencode/001-research`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Executor**: `cli-opencode` (`opencode` v1.17.11) with the `openai` provider authed; the deep-research loop engine (`/deep:research`, `system-deep-loop` runtime).
- **Subject**: external Rust docs (web) + `sk-code`/`code-opencode` source, present in-repo.
- **No Rust toolchain dependency** in this phase — nothing is compiled.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- This phase produces only research artifacts under `research/`. "Rollback" is deleting the generated loop outputs; the charter (`spec.md`, `plan.md`, `strategy`, `fanout-config`) remains.
- No skill source is modified, so there is nothing to revert in `code-opencode`.
- If the loop diverges or the executor is unavailable, stop the run, keep the charter, and re-launch later — the config is deterministic and the state is resumable.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Spec**: `spec.md` (charter + 11 angles)
- **Parent**: `../spec.md`
- **Strategy**: `research/deep-research-strategy.md`
- **Config**: `research/deep-research-fanout-config.json`
