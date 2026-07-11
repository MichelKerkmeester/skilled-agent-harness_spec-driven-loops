---
title: "Feature Specification: Phase 5 — Registration Touchpoints & Multi-Language Routing"
description: "Update the six registration touchpoints so every tool recognizes Rust (stack_detection.md, hub-router.json, verify_stack_folders.py, verify_alignment_drift.py plus its test, router-replay.cjs plus fixtures, and the shared trio), and change language selection from first-match to a touched-language set so a Rust-plus-TypeScript parity task loads both language trios."
trigger_phrases:
  - "018 phase 005 touchpoints multilang"
  - "rust known_languages router-replay fixtures"
  - "touched language set rust typescript"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/005-touchpoints-and-multilang"
    last_updated_at: "2026-07-11T09:56:28Z"
    last_updated_by: "claude-code"
    recent_action: "Landed the five sk-code-local touchpoints; router-replay deferred"
    next_safe_action: "Wire router-replay.cjs Rust detection + touched-language set when the operator session is quiet"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5 — Registration Touchpoints & Multi-Language Routing

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-07-11 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 004-parent-union-drift-guard |
| **Successor** | 006-gate-verification-rollup |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Beyond the surface router and parent union, several tools independently classify languages (stack detection, the hub router, two Python verifiers, and the skill-benchmark router-replay). Until each recognizes Rust, verification and the router-replay stay incomplete. Separately, language selection is first-match-only, so a napi-rs/WASM parity task that legitimately touches both Rust and TypeScript loads only one trio.

### Purpose
Teach every touchpoint about Rust and change selection to a touched-language set so interop parity work loads both the Rust and TypeScript standards.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `stack_detection.md`: a RUST row (`.rs`; fallback Cargo markers; napi-rs/wasm-bindgen vocabulary).
- `hub-router.json`: extend the `code-opencode-runtime` vocabulary with Rust terms.
- `verify_stack_folders.py`: add `rust` to `KNOWN_LANGUAGES`.
- `verify_alignment_drift.py`: add `.rs -> rust` and Rust dispatch checks; update its test.
- `router-replay.cjs`: surface regex, `OPENCODE_LANGUAGES`, Rust detection, and new replay fixtures.
- Shared trio: add Rust to `universal_patterns.md` and `code_organization.md`.
- Multi-language routing: change first-match selection to a touched-language set so Rust+TypeScript loads both trios.

### Out of Scope
- Doc authoring (phase 002); surface SKILL.md (phase 003); parent union (phase 004).
- Running the final gate plan and parent rollup (phase 006).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/shared/references/stack_detection.md` | Modify | RUST detection row + touched-language-set rule |
| `.opencode/skills/sk-code/hub-router.json` | Modify | Rust vocabulary |
| `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_stack_folders.py` | Modify | `rust` in KNOWN_LANGUAGES |
| `.opencode/skills/sk-code/code-opencode/assets/scripts/verify_alignment_drift.py` | Modify | `.rs` mapping + Rust checks (+ test) |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs` | Modify | Rust detection, languages, fixtures, touched-language set |
| `.opencode/skills/sk-code/code-opencode/references/shared/universal_patterns.md` | Modify | Rust scope + shared parity contracts |
| `.opencode/skills/sk-code/code-opencode/references/shared/code_organization.md` | Modify | `references/rust/` layout + Rust test conventions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All touchpoints recognize Rust | Each listed file classifies `.rs`/Cargo/napi-rs/wasm as Rust |
| REQ-002 | Router-replay fixtures added | Fixtures for `.rs`, Cargo-only, napi-rs, wasm-bindgen, WASI, Rust+TypeScript, and a Rust quality prompt |
| REQ-003 | Touched-language set | A Rust+TypeScript task loads both trios plus shared guidance (not first-match-only) |
| REQ-004 | No regression | Existing TypeScript/Python/shell/config detection and routing stay green |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every touchpoint recognizes Rust; verifiers exit 0 for a `references/rust/` folder.
- **SC-002**: Router-replay Rust and Rust+TypeScript fixtures select the right trios.
- **SC-003**: No existing-language scenario regresses.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Touched-language-set change is behavioral, not additive | Could shift existing routing | Add fixtures first; assert no existing scenario regresses |
| Risk | `router-replay.cjs` lives under system-deep-loop, not sk-code | Cross-skill edit | Scope the edit to Rust detection + fixtures only |
| Dependency | Phases 002–004 landed | Touchpoints reference authored files/union | Sequence 005 after 004 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Confirm whether the touched-language-set change belongs solely in `router-replay.cjs`/`stack_detection.md` or also in the live surface router, at apply time.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: ../spec.md
- **Manifest**: ../001-research/research/research.md (Deliverable 2D + multi-language resolution)
- **Predecessor**: ../004-parent-union-drift-guard/ · **Successor**: ../006-gate-verification-rollup/
