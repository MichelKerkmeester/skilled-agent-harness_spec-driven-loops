---
title: "Checklist: Read-Only cli-codex Deep-Alignment Audit Leaf"
description: "Verification checklist for the read-only cli-codex alignment leaf fix."
importance_tier: "standard"
contextType: "general"
---
# Checklist: Read-Only cli-codex Deep-Alignment Audit Leaf

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Mark `[x]` only with evidence (test output, run artifact path, or file:line). Do not claim completion without the end-to-end LUNA run.

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] Read the current `if_cli_codex` branch and the leaf OUTPUT CONTRACT before editing.
- [ ] Confirm the state-record schema the reducer consumes (field-for-field).

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] Route-proof fields authored by the wrapper, never trusted from the model.
- [ ] Read-only sandbox set on the cli-codex dispatch; no workspace-write remains on that path.
- [ ] No spec paths / packet ids / task ids in code comments (comment hygiene).

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] `leaf-artifact-writer.vitest.ts`: valid / malformed / missing-field / route-proof cases pass.
- [ ] Existing deep-loop runtime vitest suites pass (no regression).
- [ ] End-to-end LUNA alignment run completes full budget, sk-code lane covered, no `executor_contract_violation`.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] The cli-codex alignment leaf runs read-only and cannot write (probe/run evidence).
- [ ] Wrapper authors all three artifacts with wrapper-owned route-proof fields.
- [ ] Malformed leaf output fails the iteration fail-closed (no partial record, no halt).
- [ ] Full-budget run covers both lanes (sk-doc then sk-code) with no `executor_contract_violation`.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] Read-only leaf cannot create/modify/delete any file (sandbox-enforced).
- [ ] 038 out-of-scope containment retained as belt-and-suspenders.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] `implementation-summary.md` records what was built + verification evidence.
- [ ] `decision-record.md` captures the read-only-vs-alternatives decision + codex probe evidence.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] Helper under `runtime/lib/deep-loop/`; test under `runtime/tests/unit/`.
- [ ] No new top-level dirs; packet docs under this spec folder.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] All P0 requirements verified with evidence.
- [ ] `validate.sh --strict` Errors:0.

<!-- /ANCHOR:summary -->
