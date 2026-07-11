---
title: "Implementation Plan: Phase 5 — Registration Touchpoints & Multi-Language Routing"
description: "Apply the six registration-touchpoint edits from research.md Deliverable 2D so every tool recognizes Rust, and change language selection to a touched-language set so Rust-plus-TypeScript parity work loads both trios."
trigger_phrases:
  - "018 phase 005 plan"
  - "touchpoints multilang plan rust"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/018-rust-standards-for-code-opencode/005-touchpoints-and-multilang"
    last_updated_at: "2026-07-11T08:53:41Z"
    last_updated_by: "claude-code"
    recent_action: "Scaffolded this phase plan from the 018 research manifest"
    next_safe_action: "Apply the touchpoint edits, then the touched-language-set change"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5 — Registration Touchpoints & Multi-Language Routing

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Targets** | stack_detection.md, hub-router.json, 2 Python verifiers (+ test), router-replay.cjs (+ fixtures), shared trio |
| **Source** | `research.md` Deliverable 2D + multi-language resolution |
| **Behavior change** | First-match language selection to a touched-language set |
| **Testing** | Verifiers exit 0; router-replay Rust + Rust+TypeScript fixtures |

### Overview
Teach every touchpoint about Rust and change selection so a Rust+TypeScript parity task loads both trios. Additive detection first, then the behavioral selection change with regression fixtures.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 002–004 landed
- [ ] Each touchpoint's Rust-relevant block located

### Definition of Done
- [ ] All six touchpoints recognize Rust
- [ ] Touched-language set loads both trios for interop tasks
- [ ] No existing-language regression
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive Rust detection in each classifier; the touched-language-set change is a shared-selection behavior change guarded by new replay fixtures and a no-regression assertion on existing scenarios.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Detection touchpoints
`stack_detection.md`, `hub-router.json`, `verify_stack_folders.py`, `verify_alignment_drift.py` (+ test), shared trio.

### Step 2: Router-replay
`router-replay.cjs` surface regex, languages, detection, and new fixtures.

### Step 3: Multi-language selection
Change first-match to a touched-language set; add Rust+TypeScript fixtures.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Verifiers exit 0 for a `references/rust/` folder.
- Router-replay: `.rs`, Cargo-only, napi-rs, wasm-bindgen, WASI, Rust+TypeScript, Rust quality fixtures.
- Regression: existing-language scenarios unchanged.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phases 002–004.
- `research.md` Deliverable 2D + multi-language resolution.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Revert each touchpoint edit; the touched-language-set change is the last to revert (restores first-match selection).
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS

- **Spec**: spec.md
- **Manifest**: ../001-research/research/research.md (Deliverable 2D)
