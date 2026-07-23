---
title: "Feature Specification: sk-design Structure & Naming Cleanup"
description: "Remove the misplaced styles/docs stray, rename dunder test/fixture folders to the kebab-case sk-doc naming convention, and conform the /interface command workflow YAML assets to the create-command contract. Per-mode manual-testing-playbooks are kept (doctrine-correct)."
trigger_phrases:
  - "sk-design structure cleanup"
  - "sk-design naming convention"
  - "styles/docs stray removal"
  - "dunder test folder rename"
  - "interface command yaml conformance"
importance_tier: "important"
contextType: "general"
---
# Feature Specification: sk-design Structure & Naming Cleanup

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-07-23 |
| **Track** | sk-design |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three structural/naming defects in `sk-design`: (1) a misplaced `styles/docs/` folder holding a stray `manual-testing-playbook.md` whose content the hub playbook already covers under `styles-library-utilization/`; (2) dunder test/fixture folders (`corpus/__tests__` in five modes plus a backend `tests/__fixtures__`) that violate the kebab-case sk-doc filesystem naming convention (node_modules excepted as tool-mandated); (3) the `/interface` command workflow YAML assets that do not conform to the create-command contract that governs `commands/interface/assets/`.

### Purpose
Bring sk-design's folder structure and command assets into line with the sk-doc naming convention and the create-command contract, without disturbing the doctrine-correct per-mode manual-testing-playbooks (every multi-mode hub keeps per-packet playbooks — mcp-tooling 7, cli-external 4, sk-prompt/sk-doc 2 each).

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete `sk-design/styles/docs/` (the stray README + misplaced playbook).
- Rename dunder folders to kebab-case (`__tests__` → `tests`, `__fixtures__` → `fixtures`) and update every config/import that references them; keep tests green.
- Conform the ten `/interface` command workflow YAML assets to the create-command contract.

### Out of Scope
- The 6 per-mode `manual-testing-playbook/` dirs — kept; they are doctrine-correct and match every other multi-mode hub.
- `node_modules/` — tool-mandated, excepted from the naming convention.
- Any behavior change to the design modes, style DB, or command logic beyond structural/asset conformance.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/styles/docs/` | Delete | Stray README + misplaced manual-testing-playbook. |
| `sk-design/*/corpus/__tests__/` (×5) + `design-md-generator/backend/tests/__fixtures__/` | Rename | Dunder → kebab; update configs/imports. |
| `.opencode/commands/interface/assets/*.yaml` (×10) | Modify | Conform to the create-command contract. |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | styles/docs removed | The folder no longer exists; no dangling reference to it. |
| REQ-002 | Dunder folders renamed, tests still pass | No `__tests__`/`__fixtures__` remain (node_modules excepted); the affected vitest/node test suites run green post-rename. |
| REQ-003 | Interface YAMLs conform to the contract | Each `/interface` asset matches the create-command contract shape the checker enforces. |
| REQ-004 | Per-mode playbooks untouched | The 6 per-mode `manual-testing-playbook/` dirs are unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Comment hygiene | No spec paths / packet ids / task ids embedded in code comments. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `styles/docs/` is gone; a repo grep finds no reference to it.
- **SC-002**: No dunder folders under sk-design (node_modules excepted); the renamed test/fixture suites pass.
- **SC-003**: The create-command contract checker passes for the `/interface` assets.
- **SC-004**: `spec validate --strict` on this packet reports Errors:0.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Renaming a test folder breaks discovery/imports | Test suite fails silently | Grep every reference before rename; re-run the affected suites after. |
| Risk | Over-consolidating playbooks | Loss of correct per-packet docs | Explicitly out of scope; per-mode playbooks kept. |
| Risk | YAML conformance changes command behavior | Broken `/interface` command | Conform structure/metadata to the contract without altering the workflow logic; validate against the checker. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Reversibility**: every change is a delete/rename/asset-edit reversible by `git checkout`.
- **Isolation**: confined to sk-design + its `/interface` command assets.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A dunder folder referenced by an absolute path in a config → update the config, not just the folder.
- An interface YAML that is already partially conformant → change only the non-conformant parts.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Consolidate the per-mode playbooks? **Resolved: No** — they are doctrine-correct; only the styles/docs stray is removed.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Summary**: See `implementation-summary.md`
- **Naming convention**: the sk-doc kebab-case filesystem convention (sk-doc/017 program).
- **Command contract**: `sk-doc/create-command/assets/command-contract.json`.

<!-- /ANCHOR:related-docs -->
