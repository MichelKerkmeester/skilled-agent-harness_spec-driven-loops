---
title: "Feature Specification: code README coverage for the system-deep-loop runtime"
description: "Most source folders in the system-deep-loop runtime carry no code README. A census of runtime/lib found 56 of 93 module folders without a README.md, and the entire 036 clone-column output (ledger schema, reducers, sealed artifacts, certificates, resume adapters, shadow parity, rollback gates across eight mode lanes plus the shared substrate) shipped with none. Fourteen of the 37 existing runtime READMEs also carry recorded defects. This phase adds a code README to every source-bearing folder in the runtime and repairs the fourteen, authored to the sk-doc create-readme standard, so each module states its purpose, public surface, and place in the spine. Additive and corrective documentation only; no code changes."
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
    recent_action: "Amended: 14 existing-README defects attached; standard-ruling dependency added"
    next_safe_action: "Re-verify the 14 defects and re-run the 56-missing census, then wait on the standard ruling"
    blockers:
      - "R1 is unverifiable until the code-README tree ruling lands in sk-doc/022-code-readme-coverage/001"
    key_files:
      - "spec.md"
    completion_pct: 0
    open_questions:
      - "Sequencing of runtime/README.md against WS1 032, which edits the same file for content drift"
    answered_questions:
      - "Placement = an additive planned phase child 019 under 036"
      - "Standard = the sk-doc create-readme code-README format"
      - "Scope includes runtime/tests and runtime/scripts — 10 of the 14 recorded defects live there"
      - "The 37 existing READMEs are re-checked, not left as-is — 14 confirmed defects attached"
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
The 37 folders that do carry a README are not a clean set either: fourteen recorded defects span `runtime/README.md`,
`runtime/scripts/lib`, eight `runtime/tests/**` folders, and two `runtime/lib/**` modules whose bodies narrate migration
history rather than describing the module.

### Purpose
Add a code README to every source-bearing folder in the runtime, authored to the sk-doc create-readme standard, so each
module documents its purpose, its public surface, its key dependencies, and its role in the spine. Pure documentation:
no runtime code changes, no behavioral risk.

### Non-Goals
- Any runtime code change — READMEs only.
- README coverage outside the `system-deep-loop` runtime.
- Rewriting existing conforming READMEs. The fourteen recorded defects are in scope; the remaining 23 existing READMEs are
  touched only if the coverage check finds a real defect.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Every `runtime/lib/<module>/` folder lacking a `README.md`, authored to the sk-doc create-readme standard.
- The `runtime/tests` and `runtime/scripts` trees — in scope; ten of the fourteen recorded defects live there.
- The 14 recorded defects in existing `runtime/**` READMEs, repaired against the same standard.
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
- **R4** — A coverage check enumerates the in-scope folder set and confirms full README coverage at close, driven by the
  manifest-based auditor rather than a hand-rolled census.
- **R5** — Existing runtime READMEs are re-checked and repaired against the standard, not only missing ones. The fourteen
  recorded defects are closed and the remaining existing READMEs pass the same conformance check.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. Every in-scope source-bearing folder carries a README conforming to the sk-doc create-readme standard.
2. README claims are verified against real source, not guessed.
3. No runtime code, test, or behavior changed; the whole-runtime test and typecheck gates stay green.
4. `validate.sh --strict` passes for this phase, and the coverage check confirms zero uncovered folders.
5. The fourteen recorded defects in existing runtime READMEs are closed, and every existing runtime README passes the same
   conformance check the authored ones do.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Risk — stale README claims.** A README can drift from the code it describes; mitigation is authoring from the real
  exports and re-checking against source, not from memory.
- **Dependency — sk-doc create-readme** for the standard and workflow; **the landed runtime source** as the authoring input.
- **Dependency — `sk-doc/022-code-readme-coverage/001-code-readme-standard-and-enforcement`, hard.** R1 is not verifiable
  until the Directory-Tree ruling exists, and R4's coverage check uses that phase's manifest-driven auditor rather than a
  hand-rolled census.
- **Coordination — WS1 child `032-docs-drift-and-p2-batch`** also edits `runtime/README.md`, for content drift. Sequence this
  phase's edit after `032` or land both in one commit. Do not re-derive WS1's facts here.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- How is `runtime/README.md` sequenced against WS1 `032`, which edits the same file for content drift — after `032`, or in
  one shared commit?

### Answered

- *Does the scope include `runtime/tests` and `runtime/scripts`?* **Yes.** Ten of the fourteen recorded defects are in
  `runtime/tests/**` and `runtime/scripts/lib`.
- *Should the 37 modules that already carry a README be re-checked?* **Yes.** Fourteen confirmed defects are attached and
  covered by R5.
<!-- /ANCHOR:questions -->
