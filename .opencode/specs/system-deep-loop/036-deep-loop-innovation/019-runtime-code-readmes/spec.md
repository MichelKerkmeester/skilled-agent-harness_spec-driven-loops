---
title: "Feature Specification: code README coverage for the system-deep-loop runtime"
description: "Most source folders in the system-deep-loop runtime carry no code README. A census of runtime/lib found 56 of 93 module folders without a README.md, and the entire 036 clone-column output (ledger schema, reducers, sealed artifacts, certificates, resume adapters, shadow parity, rollback gates across eight mode lanes plus the shared substrate) shipped with none. This phase adds a code README to every source-bearing folder in the runtime, authored to the sk-doc create-readme standard, so each module states its purpose, public surface, and place in the spine. Additive documentation only; no code changes."
trigger_phrases:
  - "deep-loop runtime code readmes"
  - "missing code readme runtime modules"
  - "add readme to runtime lib modules"
  - "code readme coverage system-deep-loop"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/019-runtime-code-readmes"
    last_updated_at: "2026-07-29T07:58:00Z"
    last_updated_by: "claude"
    recent_action: "Captured the code-README coverage gap as a planned phase"
    next_safe_action: "Scope the exact folder set then author READMEs via the sk-doc create-readme standard"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 0
    open_questions:
      - "Does the scope include runtime/tests and runtime/scripts folders, or only runtime/lib module folders?"
    answered_questions:
      - "Placement = an additive planned phase child 019 under 036"
      - "Standard = the sk-doc create-readme code-README format"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: Code README Coverage for the system-deep-loop Runtime

> Phase adjacency under the `036-deep-loop-innovation` parent (grouping order, not a runtime dependency): predecessor `018-drift-census-and-plan-revalidation`; successor `020-sk-code-opencode-alignment`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-29 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent** | `system-deep-loop/036-deep-loop-innovation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Most folders that hold code in the system-deep-loop runtime have no README. A census of `runtime/lib` on 2026-07-29
found **56 of 93 module folders without a `README.md`** (only 37 have one). The gap is concentrated in the 036 output:
every clone-column module built in the per-mode migration program — ledger schema, reducers, sealed artifacts,
certificates, resume adapters, shadow parity, and rollback gates, across all eight mode lanes plus the shared
`deep-improvement-common` and substrate modules — shipped with no per-module README. A reader landing in one of these
folders has no short, authored explanation of what the module is for, what it exports, or how it fits the ledger spine.

### Purpose
Add a code README to every source-bearing folder in the runtime, authored to the sk-doc create-readme standard, so each
module documents its purpose, its public surface, its key dependencies, and its role in the spine. Pure documentation:
no runtime code changes, no behavioral risk.

### Non-Goals
- Any runtime code change — READMEs only.
- README coverage outside the `system-deep-loop` runtime.
- Rewriting existing conforming READMEs unless the audit finds a real defect.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every `runtime/lib/<module>/` folder lacking a `README.md`, authored to the sk-doc create-readme standard.
- The `runtime/tests` and `runtime/scripts` trees, pending the scope open question.
- A final coverage check proving no source-bearing runtime folder is left without a README.

### Out of Scope
- Runtime source or test behavior — additive documentation only.
- README coverage outside the `system-deep-loop` runtime.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1** — Each authored README conforms to the sk-doc create-readme code-README format.
- **R2** — Each README's purpose, exports, dependencies, and spine role are accurate against the real module source.
- **R3** — No runtime source, test, or behavior is modified by this phase.
- **R4** — A coverage check enumerates the in-scope folder set and confirms full README coverage at close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. Every in-scope source-bearing folder carries a README conforming to the sk-doc create-readme standard.
2. README claims are verified against real source, not guessed.
3. No runtime code, test, or behavior changed; the whole-runtime test and typecheck gates stay green.
4. `validate.sh --strict` passes for this phase, and the coverage check confirms zero uncovered folders.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Risk — stale README claims.** A README can drift from the code it describes; mitigation is authoring from the real
  exports and re-checking against source, not from memory.
- **Dependency — sk-doc create-readme** for the standard and workflow; **the landed runtime source** as the authoring input.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the scope include `runtime/tests` and `runtime/scripts`, or only `runtime/lib` module folders?
- Should the 37 modules that already carry a README be re-checked against the current standard, or left as-is?
<!-- /ANCHOR:questions -->
