---
title: "Implementation Plan: sk-design Structure & Naming Cleanup"
description: "Phased plan for removing the styles/docs stray, renaming dunder folders to kebab, and conforming the interface command YAMLs to the create-command scaffolding."
importance_tier: "standard"
contextType: "general"
---
# Implementation Plan: sk-design Structure & Naming Cleanup

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Four scoped structural/naming fixes in sk-design: delete the misplaced `styles/docs/` stray; rename the six dunder test/fixture folders to kebab-case and repoint every live reference; and give the ten `/interface` command YAMLs the create-command scaffolding vocabulary while keeping their lean creation-contract delegation. The doctrine-correct per-mode manual-testing-playbooks are explicitly left in place.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Corpus node:test suites + the cross-mode transport test pass after the renames.
- No live dunder references remain (benchmark run-records + node_modules excepted).
- All 10 interface YAMLs parse as valid YAML with the scaffolding sections; original workflow/pipeline value-preserved.
- `validate.sh --strict` on this packet → Errors:0.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The cleanup is delete/rename/asset-edit only — no behavior change. Renames use `git mv` so history is preserved; references are updated in live docs/code but not in frozen benchmark run-records. Interface YAML conformance is additive: `operating_mode` is expanded and command-standard sections are inserted, while `workflow`, `deliverable`, `status_contract`, `pipeline`, `task_projections`, and `backend_boundary` are preserved value-identical so the commands behave exactly as before.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

- **Phase 1 — Setup.** Confirm scope + reference blast-radius (who references styles/docs, the dunder folders, the create-command contract).
- **Phase 2 — Implementation.** Delete styles/docs; rename the 6 dunder folders + fix references; conform the 10 interface YAMLs (design pair as the pattern, agent applies to the rest).
- **Phase 3 — Verification.** Run the affected test suites; parse-check + value-preserve-check all 10 YAMLs; validate the packet.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Corpus tests via `node --test` on each renamed `tests/` dir; the cross-mode `transport-grounding.test.mjs` for the fixture import.
- YAML parse + scaffolding-presence + value-preservation (current vs HEAD) checks for the interface assets.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The sk-doc kebab-case filesystem naming convention (sk-doc/017 program).
- `sk-doc/create-command/assets/command-contract.json` (interface family topology).
- The design-pair YAMLs as the scaffolding template for the remaining actions.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every change is a delete/rename/asset-edit reversible by `git checkout` (or `git revert` of the two commits). Frozen benchmark records and node_modules were untouched, so no coordinated rollback is needed.

<!-- /ANCHOR:rollback -->
