---
title: "Checklist: Read-Only cli-codex Deep-Alignment Audit Leaf"
description: "Verification checklist for the read-only cli-codex alignment leaf fix."
importance_tier: "standard"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/002-executor-wiring-and-parity/001-cli-codex-read-only-audit-leaf"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Reconciled the moved packet metadata and strict-validation contract"
    next_safe_action: "Run the full-budget alignment gate."
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
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

- [ ] CHK-001 [P0] Read the current `if_cli_codex` branch and the leaf OUTPUT CONTRACT before editing.
- [ ] CHK-002 [P0] Confirm the state-record schema the reducer consumes (field-for-field).

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Route-proof fields authored by the wrapper, never trusted from the model.
- [ ] CHK-011 [P0] Read-only sandbox set on the cli-codex dispatch; no workspace-write remains on that path.
- [ ] CHK-012 [P1] No spec paths / packet ids / task ids in code comments (comment hygiene).

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `leaf-artifact-writer.vitest.ts`: valid / malformed / missing-field / route-proof cases pass.
- [ ] CHK-021 [P1] Existing deep-loop runtime vitest suites pass (no regression).
- [ ] CHK-022 [P0] End-to-end LUNA alignment run completes full budget, sk-code lane covered, no `executor_contract_violation`.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] The cli-codex alignment leaf runs read-only and cannot write (probe/run evidence).
- [ ] CHK-031 [P0] Wrapper authors all three artifacts with wrapper-owned route-proof fields.
- [ ] CHK-032 [P0] Malformed leaf output fails the iteration fail-closed (no partial record, no halt).
- [ ] CHK-033 [P0] Full-budget run covers both lanes (sk-doc then sk-code) with no `executor_contract_violation`.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] Read-only leaf cannot create/modify/delete any file (sandbox-enforced).
- [ ] CHK-041 [P1] Out-of-scope containment retained as belt-and-suspenders.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] `implementation-summary.md` records what was built + verification evidence.
- [ ] CHK-051 [P1] `decision-record.md` captures the read-only-vs-alternatives decision + codex probe evidence.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Helper under `runtime/lib/deep-loop/`; test under `runtime/tests/unit/`.
- [ ] CHK-061 [P1] No new top-level dirs; packet docs under this spec folder.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-070 [P0] All P0 requirements verified with evidence.
- [ ] CHK-071 [P0] `validate.sh --strict` Errors:0.

<!-- /ANCHOR:summary -->
