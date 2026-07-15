---
title: "Verification Checklist: alignment render-pipeline parity + ai-council fix flip"
description: "Level 2 checklist with concrete drift, render, and conformance evidence."
trigger_phrases:
  - "deep alignment render pipeline parity"
  - "ai-council fix rollout flip"
  - "contract drift clean"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/064-deep-command-family-parity/001-pipeline-command-parity"
    last_updated_at: "2026-07-13T14:15:00Z"
    last_updated_by: "claude"
    recent_action: "All checklist items verified with evidence"
    next_safe_action: "Proceed to child 002"
---
# Verification Checklist: alignment render-pipeline parity + ai-council fix flip

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md]
  - **Evidence**: `spec.md` REQ-001 through REQ-010 define the pipeline-parity + fix-flip requirements.
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md]
  - **Evidence**: `plan.md` architecture and phases describe the compile/drift/render flow.
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: plan.md dependencies]
  - **Evidence**: `plan.md` lists the render-pipeline scripts and `mode-registry.json` as green internal dependencies.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Contract regenerated cleanly, no placeholder [EVIDENCE: deep_alignment.contract.md]
  - **Evidence**: `deep_alignment.contract.md` carries `GENERATED_COMMAND_CONTRACT_HEADER_START`.
- [x] CHK-011 [P0] No drift across registered commands [EVIDENCE: check-contract-drift.cjs]
  - **Evidence**: `check-contract-drift.cjs` reported `OK commands=4` (exit 0).
- [x] CHK-012 [P1] Native-only tool surface, no overflow [EVIDENCE: TOOL_ALLOWLIST]
  - **Evidence**: `tools.allowed` is the eight-tool native set; no `TOOL_ALLOWLIST_OVERFLOW`.
- [x] CHK-013 [P1] Contract follows the leaf-dispatch sibling pattern [EVIDENCE: compile-command-contracts.cjs]
  - **Evidence**: the `deep/alignment` entry clones the `deep/review` leaf-dispatch shape.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: REQ-001 through REQ-010]
  - **Evidence**: every REQ has a passing gate recorded in `implementation-summary.md`.
- [x] CHK-021 [P0] Render smoke passes in `fix` mode [EVIDENCE: renderCommandContract]
  - **Evidence**: alignment + ai-council returned `mode=fix` with the contract injected, no throw.
- [x] CHK-022 [P1] Placeholder-free slices verified [EVIDENCE: PLACEHOLDER_PATTERN]
  - **Evidence**: the drift regex reported `CLEAN` (0 hits) in both lifted slices.
- [x] CHK-023 [P1] Command conformance across all 7 commands [EVIDENCE: validate_document.py]
  - **Evidence**: `validate_document.py --type command` reported `8 pass / 0 fail`.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] Rollout flips applied [EVIDENCE: command-injection-rollout.json]
  - **Evidence**: `command-injection-rollout.json` sets `deep/alignment: fix` and `deep/ai-council: fix`.
- [x] CHK-025 [P1] Pre-existing peer staleness fixed, body-identical [EVIDENCE: BODY UNCHANGED]
  - **Evidence**: `ai-council`, `review`, `research` regenerated with matching stripped-body sha256.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in changed files [EVIDENCE: asset + config diff]
  - **Evidence**: the changed files are markdown/JSON assets plus one data-map entry in `compile-command-contracts.cjs`; no credential-shaped values.
- [x] CHK-031 [P0] Contract advertises only read-only native tools [EVIDENCE: no Write/Edit]
  - **Evidence**: `tools.allowed` omits `Write`/`Edit`, matching the alignment command frontmatter.
- [x] CHK-032 [P1] Write boundary preserves alignment read-only invariant [EVIDENCE: writeBoundary]
  - **Evidence**: the contract `writeBoundary.banned` forbids modifying any audited artifact.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: spec-plan-task sync]
  - **Evidence**: `spec.md`, `plan.md`, and `tasks.md` all describe the same registration + fix-flip scope.
- [x] CHK-041 [P1] Owned-assets doc updated [EVIDENCE: deep_alignment.body.md]
  - **Evidence**: `legacy/deep_alignment.body.md` §2 references the presentation and the `fix`-mode contract.
- [x] CHK-042 [P2] Command comment hygiene preserved
  - **Evidence**: no ephemeral artifact ids were added to any code comment; changes are docs/data only.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files committed [EVIDENCE: scratchpad only]
  - **Evidence**: temporary smoke output used `writeManifest:false`; `manifest.jsonl` stayed clean.
- [x] CHK-051 [P1] Assets live in the canonical deep command locations [EVIDENCE: assets path]
  - **Evidence**: the presentation and contract live under `.opencode/commands/deep/assets/`.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-13
**Verified By**: Claude (pipeline gates)

<!-- /ANCHOR:summary -->
