---
title: "create-feature-catalog: Manual Testing Playbook"
description: "Operator playbook for the create-feature-catalog workflow across root inventories, per-feature files, source anchors, current-state claims and package validation."
version: 1.0.0.0
---

# create-feature-catalog: Manual Testing Playbook

This playbook validates the `sk-create-feature-catalog` workflow as an authoring tool. It checks package shape, root-to-leaf parity, source anchors, current-state wording and the catalog boundary with manual playbooks.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into the skill benchmark reports folder. Generated report Markdown is renderer-owned.

## 1. OVERVIEW

The package covers catalog structure, source traceability and scope and validation. Scenarios use the shipped `SKILL.md`, README, templates, references and package validator as sources. There is no feature catalog for this mode. Each scenario carries the full execution contract in one category file.

The key negative checks keep the catalog trustworthy. A root row without a leaf is incomplete. A feature without source and validation anchors is unverified. Planned behavior and execution matrices belong elsewhere.

---

## 2. GLOBAL PRECONDITIONS

1. Run commands from the repository root.
2. Read the target system docs, source files, tests and README before claiming a feature is shipped.
3. Stabilize category names and feature slugs before writing cross-links.
4. Keep the root catalog inventory-first. Put implementation truth in per-feature files.
5. Use real source and validation paths. Do not freeze measured counts or dated snapshots in catalog prose.
6. A `SKIP` verdict is valid only when a named sandbox or runtime blocker prevents the command from running.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The exact user request and exact operator prompt.
- The category and feature slug decision.
- The root entry and matching leaf path.
- The implementation and validation or test anchors.
- The current-state or explicit planned-state wording.
- The exact validator command, output and exit status.
- A `PASS`, `FAIL` or `SKIP` verdict with a reason.

An answer without source anchors does not pass. A catalog row without a leaf does not pass. A scenario matrix inside a catalog does not pass because that belongs to the playbook workflow.

---

## 4. DETERMINISTIC COMMAND NOTATION

- `bash:` marks a shell command.
- `agent:` marks a read or reasoning step.
- `->` separates sequential steps.
- Paths are repository-relative.
- Commands are read-only unless a scenario names a recovery path.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

For each scenario, confirm that the prompt was used as written, the claimed feature is grounded in current files, the root and leaf agree and the evidence is complete. A scenario passes only when the named catalog invariant is visible in the output.

The package is releasable when all mapped scenarios pass, every root entry maps to one leaf, every leaf is linked, source anchors exist and current-state prose contains no unlabeled roadmap claim.

---

## 6. ORCHESTRATION AND WAVE PLANNING

Run structure scenarios first. Run source-anchor and current-state scenarios next. Run scope and validation scenarios last. Keep root summaries short and inspect per-feature files for detailed truth. Record the root path, leaf path, source anchors and validator output for each wave.

---

## 7. CATALOG STRUCTURE (`FCR-001..FCR-002`)

### FCR-001 | Create the root catalog package

Verify the root catalog, category folders and per-feature files follow the canonical package shape.

> **Scenario:** [FCR-001](catalog-structure/create-root-catalog-package.md)

### FCR-002 | Preserve root-to-leaf bijection

Verify that every root entry links to one leaf and no leaf is orphaned.

> **Scenario:** [FCR-002](catalog-structure/preserve-root-leaf-bijection.md)

---

## 8. SOURCE TRACEABILITY (`FCR-003..FCR-004`)

### FCR-003 | Anchor a feature in source and tests

Verify that a per-feature file carries real implementation and validation anchors for its claims.

> **Scenario:** [FCR-003](source-traceability/anchor-feature-in-source-and-tests.md)

### FCR-004 | Keep published slugs stable

Verify that category and feature slugs are treated as linkable interfaces and are not renamed casually.

> **Scenario:** [FCR-004](source-traceability/keep-published-slugs-stable.md)

---

## 9. SCOPE AND VALIDATION (`FCR-005..FCR-006`)

### FCR-005 | Leave execution matrices to the playbook

Verify that the catalog describes current behavior and links to manual validation instead of embedding test steps.

> **Scenario:** [FCR-005](scope-and-validation/leave-execution-matrices-to-playbook.md)

### FCR-006 | Validate a leaf from the repository root

Verify the root and per-feature validators are run with the path context that detects the leaf document type.

> **Scenario:** [FCR-006](scope-and-validation/validate-leaf-from-repository-root.md)

---

## 10. AUTOMATED TEST CROSS-REFERENCE

| Check | Coverage | Playbook overlap |
|---|---|---|
| `validate_document.py` | Root and per-feature document structure | Direct on FCR-001 and FCR-006 |
| `validate_catalog_package.py` | Root-to-leaf bijection, source paths, parity and current-state rules | Direct on FCR-002 through FCR-004 |
| `check-markdown-links.cjs` | Cross-file link resolution in CI | Direct on FCR-002 and FCR-004 |
| Feature catalog templates | Root and per-feature authoring shape | Direct on FCR-001 and FCR-003 |

This playbook records catalog authoring behavior. It does not duplicate manual execution matrices or turn a catalog into a roadmap.
