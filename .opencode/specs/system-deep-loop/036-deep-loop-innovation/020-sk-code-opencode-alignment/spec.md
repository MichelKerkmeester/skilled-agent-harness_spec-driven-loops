---
title: "Feature Specification: sk-code / code-opencode alignment for the system-deep-loop runtime"
description: "Much of the system-deep-loop runtime was authored across many fan-out build sessions and has never been run through the sk-code code-opencode surface alignment pass. Patterns, module structure, and verification conventions may diverge from the code-opencode surface standard. This phase audits the runtime against those conventions and aligns the divergences, preserving behavior — the full test and typecheck gates stay green. Behavior-preserving refactor; no functional change."
trigger_phrases:
  - "align deep-loop runtime with sk-code"
  - "code-opencode surface alignment runtime"
  - "runtime code not aligned with sk-code"
  - "sk-code conventions system-deep-loop"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/020-sk-code-opencode-alignment"
    last_updated_at: "2026-07-29T07:59:00Z"
    last_updated_by: "claude"
    recent_action: "Captured the sk-code alignment gap as a planned phase"
    next_safe_action: "Run the sk-code code-opencode surface audit to enumerate concrete divergences"
    blockers: []
    key_files:
      - "spec.md"
    completion_pct: 0
    open_questions:
      - "Which specific code-opencode conventions does the runtime audit enumerate?"
    answered_questions:
      - "Placement = an additive planned phase child 020 under 036"
      - "Method = the sk-code smart router resolves the code-opencode surface and its conventions"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Feature Specification: sk-code / code-opencode Alignment for the system-deep-loop Runtime

> Phase adjacency under the `036-deep-loop-innovation` parent (grouping order, not a runtime dependency): predecessor `019-runtime-code-readmes`; successor: none (last sibling).

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
A large share of the system-deep-loop runtime was authored across many independent fan-out build sessions, and that code
has never been run through the sk-code `code-opencode` surface alignment pass. Module structure, naming, error-handling
idioms, and verification conventions likely diverge from the code-opencode surface standard in ways no one has enumerated.
The divergence is not a functional defect — the modules pass their own tests — but it is a maintainability and consistency
cost: the runtime does not read as one codebase written to one standard.

### Purpose
Audit the runtime against the sk-code code-opencode surface conventions, enumerate the concrete divergences, and align
them while preserving behavior. Every change keeps the whole-runtime vitest and tsc gates green; this is a
consistency-and-structure pass, not a functional rewrite.

### Non-Goals
- Functional change — behavior is preserved; today's passing tests pass unchanged after alignment.
- Alignment of non-`system-deep-loop` surfaces.
- Blind reformatting — only audit-identified divergences are addressed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- An sk-code code-opencode surface audit enumerating concrete, evidence-backed divergences.
- Behavior-preserving alignment of those divergences (structure, naming, idioms, verification wiring).
- Re-verification after each aligned unit: the module's vitest plus the whole-runtime typecheck stay green.

### Out of Scope
- Any change to runtime behavior or public contracts.
- Code outside the `system-deep-loop` runtime.
<!-- /ANCHOR:scope -->

### Resolved Border

This phase owns `.opencode/skills/system-deep-loop/runtime/**` only, including runtime modules from earlier waves and the 036 clone-column output. Non-runtime trees such as `shared/**` and `deep-improvement/scripts/**` remain in the sk-code conformance program at `sk-code/021-code-conformance-alignment`; this phase does not claim them.

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **R1** — Divergences from the code-opencode standard are enumerated with source-level citations, not assumed.
- **R2** — Each divergence is aligned to the standard or recorded as an accepted, documented exception.
- **R3** — Behavior is preserved: the vitest suite and whole-runtime tsc are green before and after, compared as a delta.
- **R4** — No public contract of any runtime module changes.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

1. The sk-code code-opencode audit has enumerated the runtime's divergences, each with a source-level citation.
2. Every divergence is aligned or recorded as an accepted, documented exception.
3. No runtime behavior changed: the full vitest suite and whole-runtime tsc are green before and after, compared as a delta.
4. `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Risk — a "cleanup" that silently changes behavior.** Mitigation is the strict no-regression gate: the green suite is
  the tripwire, and any behavior delta blocks the unit.
- **Dependency — the sk-code code-opencode surface** for the standard and verification; **phase 019** so a module ideally
  gets its README and alignment pass together.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which specific code-opencode conventions does the runtime diverge from — enumerated by the sk-code audit, not assumed?
<!-- /ANCHOR:questions -->
