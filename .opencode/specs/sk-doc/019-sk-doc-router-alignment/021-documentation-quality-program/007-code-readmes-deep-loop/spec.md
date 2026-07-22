---
title: "Feature Specification: Code READMEs (System-Deep-Loop Batch)"
description: "Author lean per-folder code READMEs for the fifty-three system-deep-loop code and script folders that have none, including the thirty-five runtime library domains, and refresh the two stale runtime catalogs that under-list their subfolders."
trigger_phrases:
  - "code readmes deep loop"
  - "runtime lib domain readmes"
  - "stale runtime catalog fix"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/007-code-readmes-deep-loop"
    last_updated_at: "2026-07-22T15:15:43Z"
    last_updated_by: "claude"
    recent_action: "Shipped 53 code READMEs and refreshed the two stale runtime catalogs; all validate clean."
    next_safe_action: "Proceed to phase 008 (closeout and the deferred operator decisions)."
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/README.md"
      - ".opencode/skills/system-deep-loop/runtime/tests/README.md"
---

# Feature Specification: Code READMEs (System-Deep-Loop Batch)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-22 |
| **Branch** | `sk-doc/0097-documentation-quality` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The repo-wide scan flagged fifty-three code and script folders without a README under `system-deep-loop`, the largest single group. Thirty-five are runtime library domains under `runtime/lib/` (the convergent-architecture spine: typed event ledger, sealed artifacts, receipts, replay fingerprints, blinded adjudication and the rest), each a sibling of the three already-documented domains. The remaining eighteen span other runtime folders, the deep-alignment, deep-research, deep-review and deep-improvement modes, and the shared library. Separately, two catalogs are stale: `runtime/lib/README.md` lists three domains while thirty-seven exist, and `runtime/tests/README.md` under-lists its subfolders.

### Purpose

Author a lean per-folder code README for each of the fifty-three folders, sourced from the real files, using the already-documented `runtime/lib/council` README as the batch model for the thirty-five domains. Refresh the two stale catalogs to list every real subfolder so they match the tree after this phase.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- A `README.md` in each of the fifty-three folders (35 `runtime/lib` domains, 4 other runtime, 14 mode and shared).
- Refresh `runtime/lib/README.md` to list all thirty-seven domains and `runtime/tests/README.md` to list its real subfolders.
- The floor validator reports zero issues on every new and refreshed README, and the new prose is HVR-clean.

### Out of Scope

- The closeout sweeps and the deferred optional-extension decisions (phase 008).
- Any change to the deep-loop runtime code being documented.
- The already-documented `runtime/lib/council`, `coverage-graph` and `deep-loop` domain READMEs, apart from the catalog that indexes them.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Sev | Requirement |
|----|-----|-------------|
| REQ-001 | P2 | Each of the fifty-three folders carries a `README.md` with a numbered ALL-CAPS OVERVIEW and an accurate CONTENTS table. |
| REQ-002 | P2 | The thirty-five `runtime/lib` domain READMEs follow the lean `council` model, adding an ARCHITECTURE note only where a domain has real internal layers. |
| REQ-003 | P2 | `runtime/lib/README.md` lists all thirty-seven domains and `runtime/tests/README.md` lists its real subfolders, each with a one-line purpose. |
| REQ-004 | P2 | Fixtures and test folders are documented as such and kept lean. |
| REQ-005 | P2 | `validate_document.py --type readme` reports zero issues for every new and refreshed README, and the em-dash and semicolon sweep is zero. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All fifty-three folders have a `README.md` that reports VALID with zero issues.
- The two refreshed catalogs list every real subfolder and themselves report VALID.
- Every CONTENTS table matches the folder's real `ls`, and the em-dash and semicolon sweep returns zero.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Thirty-five near-identical domains.** Mitigated by the shared `council` model and a per-domain source read so each README states that domain's real role.
- **Catalog drift after authoring.** Mitigated by refreshing the two catalogs from the real folder listing during reconcile, after the domain READMEs exist.
- **Invented file purposes.** Mitigated by requiring each author to open the real files.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- A code README orients before the source and documents current behavior only.
- The refreshed catalogs stay a scan-first index, not a restatement of each domain README.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- `runtime/lib/deep-loop/continuity-identity` is a nested domain under `lib/deep-loop/`, documented at its own path.
- `runtime/scripts/lib` is CLI infrastructure, distinct from the domain `runtime/lib/`; its README states the boundary.
- `mixed-version-fixtures` and the `tests/fixtures` folders hold test input data, so a lean README is safe and no harness fixture is a runnable seed here.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether the thirty-seven-domain `runtime/lib/README.md` catalog should also carry the dependency direction between domains is deferred; this phase indexes them without asserting a domain graph the code does not yet enforce.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (this phase).
- `../spec.md` and `../context-index.md` (the 021 program parent).
- Previous phase: [`006-code-readmes-design-prompt-speckit`](../006-code-readmes-design-prompt-speckit/spec.md). Next phase: [`008-existing-readme-cleanup`](../008-existing-readme-cleanup/spec.md).

<!-- /ANCHOR:related-docs -->
