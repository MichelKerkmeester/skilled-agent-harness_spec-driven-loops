---
title: "Implementation Plan: Optimize Spec-Kit Core-Document Contract and Plan Template"
description: "Plan the manifest lifecycle field, runtime alignment, plan-template trimming, compatibility matrix, and regression verification for the remaining spec-kit template optimizations"
trigger_phrases:
  - "spec-kit optimization plan"
  - "lifecycleRequiredDocs"
  - "implementation-summary contract"
  - "plan phase duplication"
  - "template golden snapshots"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Optimize Spec-Kit Core-Document Contract and Plan Template

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, TypeScript, JSON, and Markdown |
| **Registry** | `.opencode/skills/system-spec-kit/templates/spec-kit-docs.json` |
| **Template** | `.opencode/skills/system-spec-kit/templates/core/plan.md.tmpl` |
| **Runtime Rules** | `check-files.sh`, `check-level-match.sh`, and `spec-doc-health.ts` |
| **Verification** | `create.sh` smoke cases, resolver tests, `validate.sh --recursive`, and golden snapshots |

### Overview

The later implementation makes the manifest describe the runtime lifecycle that already governs `implementation-summary.md`. It removes the summary from unconditional numbered-level core lists, adds `lifecycleRequiredDocs.afterImplementationStarts`, and keeps the completed task or checklist item as the transition condition. It also trims the repeated phase checkbox rows from `plan.md.tmpl`, keeps `tasks.md` authoritative for phase state, and preserves higher-level planning guidance.

This phase writes only `spec.md`, `plan.md`, and `tasks.md`. The later implementation phase owns all registry, template, runtime, validator, test, and snapshot changes named in `spec.md`.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The four-document lifecycle decision is explicit and the pre-start three-document state is defined.
- [x] The manifest field name and all runtime consumers are named.
- [x] The plan-template trim preserves the anchor contract and identifies the Level 2+ content that must remain.
- [x] The create, recursive validation, resolver, and snapshot verification gates are defined.

### Definition of Done for the Later Implementation Step

- [ ] All numbered levels resolve the same lifecycle-gated summary contract.
- [ ] A fresh planned packet passes without `implementation-summary.md`.
- [ ] A started packet requires `implementation-summary.md`.
- [ ] A Level-1 plan render contains no duplicated phase checkbox rows.
- [ ] Level 2+ substantive testing, rollback, phase-dependency, and FIX ADDENDUM content remains present and level gated; Level 3 and Level 3+ dependency graph content remains present at its existing gate.
- [ ] Existing packets pass recursive validation and existing summary files remain valid.
- [ ] Contract tests and golden snapshots pass with only intentional output changes.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Use one manifest-driven contract with two document states. The pre-start state contains the required trio `spec.md`, `plan.md`, and `tasks.md`. The post-start state adds the lifecycle-required `implementation-summary.md`. Use the completed task or checklist item detector already shared by the runtime rules as the state transition.

### Key Components

- **Manifest contract**: Stores `lifecycleRequiredDocs.afterImplementationStarts` for `implementation-summary.md` at Levels 1, 2, 3, and 3+ while leaving the four-document lifecycle meaning explicit.
- **Contract projection**: Makes `level-contract-resolver.ts` and `template-structure.js` expose the same required and lifecycle-gated lists to scaffold and validation code.
- **Runtime gate**: Keeps `check-files.sh` and `check-level-match.sh` from treating the summary as unconditionally required and retains the anchored completed-item detector.
- **Plan template**: Removes phase checkbox rows, keeps the `phases` anchor as a concise sequencing pointer, and renders compact Level-1 N/A paths while preserving Level 2+ sections.
- **Regression layer**: Covers manifest classification, scaffold shape, negative controls, recursive validation, and snapshot output.

### Data Flow

1. `spec-kit-docs.json` declares the required trio and the post-start lifecycle document for each numbered level.
2. The resolver and structure helper validate and project those declarations without placing the summary in the unconditional required list.
3. `create.sh` emits the pre-start trio for a planned packet and follows the later workflow transition for the summary.
4. `check-files.sh` and `check-level-match.sh` inspect completed task or checklist list items before requiring the summary. The shared parser reports the same three-file Level-1 pre-start contract.
5. `plan.md.tmpl` delegates phase state to `tasks.md`; its L2+ sections remain available through their existing level gates.
6. Focused tests, recursive validation, and golden snapshots compare the resulting contract with existing packet behavior.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

The later implementation follows the ordered tasks in `tasks.md`. `tasks.md` owns the Setup, Implementation, and Verification phase checkboxes. This plan keeps the required `phases` anchor as a sequencing pointer and does not repeat those checkboxes.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract matrix | Required trio and lifecycle-gated summary at Levels 1, 2, 3, and 3+ | `level-contract-resolver.vitest.ts` |
| Lifecycle behavior | Fresh planned packet, started packet, notation-table negative control, and existing summary file | `create.sh`, `check-files.sh`, `check-level-match.sh`, `spec-doc-health.test.ts` |
| Template render | No duplicated Level-1 phase checkbox rows; preserved L2+ sections and anchors; concise Level-1 N/A paths | Inline renderer and `scaffold-golden-snapshots.vitest.ts` |
| Recursive validation | Existing parent packet and its child phases produce no new failures | `validate.sh --recursive` |
| Snapshot regression | Intentional plan/scaffold changes only; unrelated rendered output remains stable | `scaffold-golden-snapshots.vitest.ts` and its snapshot file |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `spec-kit-docs.json` | Internal registry | Available | The lifecycle and level contract cannot be expressed consistently. |
| `level-contract-resolver.ts` | Internal TypeScript contract layer | Available | Scaffold and tests cannot consume the new lifecycle field. |
| `template-structure.js` | Internal structure helper | Available | Anchor and document compatibility checks can drift from the resolver. |
| `check-files.sh` and `check-level-match.sh` | Internal runtime rules | Available | The manifest can diverge from the actual implementation-start gate. |
| `plan.md.tmpl` and `tasks.md.tmpl` | Internal templates | Available | Phase ownership and Level-1 output shape remain duplicated. |
| Golden snapshot fixtures | Internal verification | Available | Rendered changes lack an approved baseline. |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase makes no runtime or template changes, so no rollback action applies to the design artifact. If the later implementation fails its compatibility or verification gates, revert only the later changes to `spec-kit-docs.json`, `plan.md.tmpl`, their contract consumers, tests, and snapshots. Keep existing `implementation-summary.md` files unchanged and rerun the focused lifecycle and render checks before resuming.

<!-- /ANCHOR:rollback -->
