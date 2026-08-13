---
title: "QA Checklist: Combo Test Matrix and Ambient-Config Isolation"
description: "Verify the three isolation and executor-coverage leaves through strict closeout."
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/047-executor-wiring-and-parity/003-cli-executor-fanout-parity/005-combo-test-matrix"
    last_updated_at: "2026-08-11T14:03:33Z"
    last_updated_by: "codex"
    recent_action: "Reconciled all three built leaves with the strict-validation contract"
    next_safe_action: "Pass strict validation and obtain operator sign-off."
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# QA Checklist: Combo Test Matrix + Ambient-Config Isolation

<!-- ANCHOR:protocol -->
## Verification Protocol
Per leaf: exact-arg / coverage tests (full output, never through `tail`) + whole-runtime tsc + live probes for the ambient-config isolation (hostile-config markers that must not fire for a read-only leaf).
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] CHK-001 [P0] Confirmed read-only pi is text-analysis-only (read-only file tools; no skill invocation).
  - **Evidence**: `implementation-summary.md` records the read-only tool contract and the live pi probe.
- [x] CHK-002 [P0] Confirmed the pi `--no-*` flags exist and are valid.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] CHK-010 [P0] Leaf 1: `--no-extensions --no-skills --no-prompt-templates` added only to the read-only pi branch; other kinds/paths untouched.
- [x] CHK-011 [P1] Comment hygiene: durable WHY (extension lifecycle can write independent of the tool allowlist), no ephemeral ids.
  - **Evidence**: `fanout-run.cjs` documents the ambient lifecycle boundary without packet-local labels.
- [x] CHK-012 [P1] Leaves 2-3 build to the same standard.
  - **Evidence**: `implementation-summary.md` records the combo-matrix and neutral-workspace mechanisms plus their verification gates.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] CHK-020 [P0] fan-out 93/93, model-benchmark 35/35, ai-council 106/106; tsc 0.
- [x] CHK-021 [P0] Live pi accepts the new flags and writes nothing.
  - **Evidence**: `implementation-summary.md` verification table records accepted flags and byte-identical git status.
- [x] CHK-022 [P0] Combo coverage matrix + ambient-config isolation probes.
  - **Evidence**: `combo-matrix.vitest.ts` passed 2/2 over 117 combinations; the exact cursor isolation probe did not fire the planted hook.
- [ ] CHK-023 [P0] `validate.sh --strict` passes.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] CHK-030 [P0] The pi extension-lifecycle write vector for read-only leaves/seats is closed structurally.
  - **Evidence**: `fanout-run.cjs` emits all three `--no-*` flags in the read-only pi branch.
- [x] CHK-031 [P0] Cursor hooks + unapproved MCP isolated for read-only leaves via the neutral workspace; devin config verified with no override rules. Ambient-config boundary closed for all read-only executors.
  - **Evidence**: `implementation-summary.md` records the clean neutral-workspace probe and the devin no-override verification.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] CHK-040 [P0] Read-only pi cannot load a write-capable extension/skill/template.
  - **Evidence**: `fanout-run.cjs` supplies `--no-extensions --no-skills --no-prompt-templates` for read-only pi.
- [x] CHK-041 [P0] No read-only executor can write or hang via ambient config: pi extensions off, cursor hooks+MCP isolated, devin config verified no-override.
  - **Evidence**: `implementation-summary.md` verification table records the four-suite re-gate and end-to-end hostile-config probe.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] CHK-050 [P1] The pi read-only builder documents why extensions/skills/templates are disabled.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] CHK-060 [P1] Leaf 1 confined to `fanout-run.cjs` and the three exact-arg suites.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
- [x] CHK-070 [P1] All three leaf gates and live-probe evidence recorded in the implementation summary.
  - **Evidence**: `implementation-summary.md` includes exact test counts for leaves 1-3 and the SOL P1 dispositions.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
- [ ] CHK-080 [P1] Operator review of the completed combo matrix and ambient-config isolation leaves.
<!-- /ANCHOR:sign-off -->
