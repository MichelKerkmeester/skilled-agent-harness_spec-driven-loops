---
title: "Tasks: Doc-Template Conformance"
description: "Task breakdown for running the real sk-doc validators against sk-code-obsidian and its sibling SURFACE packets, and recording each result honestly."
trigger_phrases:
  - "obsidian doc template conformance tasks"
  - "sk-code-obsidian phase 012 tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/025-sk-code-obsidian-surface/012-doc-template-conformance"
    last_updated_at: "2026-08-28T23:55:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Doc-template conformance audit"
    next_safe_action: "Surface-reality conformance (phase 013)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Doc-Template Conformance

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm no `/doc:quality` command exists in this runtime, and that `sk-create-quality-control` ships no runnable script
- [x] T002 Locate the three real `sk-doc` validators: `validate_skill_package.py`, `validate-playbook-package.cjs`, `validate_document.py`
- [x] T003 [P] List every non-symlinked markdown file in the `sk-code-obsidian` packet to establish the audit's file set

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Run `validate_skill_package.py` against `sk-code-obsidian`: rc 0, PASS; record the `Detected kind: standalone` finding against the validator, not the packet
- [x] T011 Run `validate-playbook-package.cjs --package` against `sk-code-obsidian/manual-testing-playbook/`: rc 0, PASS, strict on, tier=FAIL_CLOSED, scenarios=7, violations=0, warnings=0
- [x] T012 Run `validate_document.py` across every non-symlinked packet markdown: 34 PASS, 3 `missing_required_section` failures
- [x] T013 Re-run `validate_document.py` against `sk-code-mobile-cli` (3 missing), `sk-code-webflow` (4 missing), `sk-code-opencode` (4 missing), and the template's own playbook index to confirm the divergence is class-wide

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Confirm this packet is joint-best of the four SURFACE packets on the `missing_required_section` comparison
- [x] T021 Confirm the operator's binding requirement (mirror `sk-code-mobile-cli` exactly) precludes renaming `## 1. WHEN THE HUB BUNDLES THIS` in isolation
- [x] T022 State the reversal condition: the header rename applies only if the SURFACE-packet class adopts the generic vocabulary together
- [x] T023 Write `spec.md`, `plan.md`, `implementation-summary.md` recording every validator result and the reasoning for each accepted-not-fixed finding

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks in this leaf marked `[x]`
- [x] No `[B]` blocked tasks remaining in this leaf
- [x] Every validator result recorded with its exact rc/figures, not summarized from memory

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Successor**: `../013-surface-reality-conformance/`

<!-- /ANCHOR:cross-refs -->
---

## Verification Checklist

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Confirmed no `/doc:quality` command exists before falling back to the real validators

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No `SKILL.md`, reference, playbook, or asset file modified by this phase — audit and record only
- [x] CHK-011 [P0] No spec path, requirement id, task id, or checklist id written into any source or skill file
- [x] CHK-012 [P1] Every figure in this leaf traces to an actual validator run performed in this phase, not to an assumed or estimated result

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] `validate_skill_package.py <sk-code-obsidian>` run: rc 0, PASS
- [x] CHK-021 [P0] `validate-playbook-package.cjs --package <playbook>` run: rc 0, PASS, strict on, tier=FAIL_CLOSED, scenarios=7, violations=0, warnings=0
- [x] CHK-022 [P0] `validate_document.py` run across every non-symlinked packet markdown: 34 PASS, 3 `missing_required_section`
- [x] CHK-023 [P1] `validate_document.py` re-run against `sk-code-mobile-cli`, `sk-code-webflow`, `sk-code-opencode`, and the template's playbook index for comparison

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The `standalone`-classification finding is recorded against the validator's logic for hub SURFACE packets, not miscast as a packet defect
- [x] CHK-FIX-002 [P0] The three `missing_required_section` findings are recorded as a class-wide, structural divergence (confirmed across all three siblings plus the template's playbook index), with this packet joint-best of the four
- [x] CHK-FIX-003 [P1] The decision to leave `## 1. WHEN THE HUB BUNDLES THIS` unrenamed is recorded with its reasoning and an explicit reversal condition, not left as a silent gap

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret, token, or absolute personal path is embedded in this leaf's docs
- [x] CHK-031 [P1] No source file, hub configuration, or validator script touched by this phase

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Every validator's exact rc and figures are stated, not paraphrased
- [x] CHK-041 [P1] The distinction between "the validator failed" and "the validator's classification is wrong for this packet class" is made explicit, not left implicit
- [x] CHK-042 [P2] The reversal condition for the withheld `SKILL.md` header rename is stated in both `spec.md` and `implementation-summary.md`

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] This phase writes only to `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` in this leaf
- [x] CHK-051 [P1] `scratch/` and `graph-metadata.json` left untouched

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-28

**Note**: This summary verifies the audit run and recorded in *this leaf* (012). The 3
`missing_required_section` findings are recorded as a class-wide structural divergence, deliberately
not fixed here — see `implementation-summary.md` for the reversal condition.

<!-- /ANCHOR:summary -->
