---
title: "Tasks: Surface-Reality Conformance"
description: "Task breakdown for building the cross-repo drift guard, repairing the citations it found broken, and proving it fails closed."
trigger_phrases:
  - "obsidian surface reality conformance tasks"
  - "sk-code-obsidian phase 013 tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/013-surface-reality-conformance"
    last_updated_at: "2026-08-29T00:05:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Surface-reality conformance guard + repair"
    next_safe_action: "None — this is the packet's final planned phase"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Surface-Reality Conformance

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

- [x] T001 Read `scripts/run-source-gates.sh`'s existing three-guard pattern (naming, comments, folder-docs) as the integration model
- [x] T002 [P] Confirm the packet's markdown cites specific plugin filenames/paths, making a resolution guard meaningful

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Build `tools/naming/scan-skill-references.mjs`: extract citations from packet markdown, resolve against the live plugin tree, report a `broken` count
- [x] T011 Write `references/skill-reference-integrity.md` documenting the guard's method and its sentinel counter-example
- [x] T012 Wire the guard into `SKILL.md`: reference-map row, assets note naming the gates runner, two checks under INTEGRATION POINTS
- [x] T013 Wire the guard into `scripts/run-source-gates.sh` as a fourth check, following the existing SKIP-not-FAIL pattern
- [x] T014 Run the guard against the live tree: `broken : 23`
- [x] T015 Repair every broken citation across 14 documents (26 substitutions)
- [x] T016 Re-run the guard: `broken : 0`

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Confirm the sentinel counter-example fails to resolve (`counter-example rejected : yes`)
- [x] T021 Plant a deliberately dead citation; confirm the guard returns rc 1, `broken : 1`
- [x] T022 Remove the planted citation; confirm the guard returns rc 0, `broken : 0`
- [x] T023 Run `bash scripts/run-source-gates.sh`: all four guards PASS, rc 0
- [x] T024 Re-run the plugin gate suite (`tsc`, `build`, `vitest`, `screenshots:verify`, `lint`) and confirm exact baseline match
- [x] T025 Write `implementation-summary.md` recording the guard's standing limitation (resolves paths, not claims) as a carried-forward risk

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks in this leaf marked `[x]`
- [x] No `[B]` blocked tasks remaining in this leaf
- [x] Guard proven in both directions (planted-then-removed citation) before being trusted at `broken : 0`

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Guard Script**: `../../../tools/naming/scan-skill-references.mjs`
- **Predecessor**: `../012-doc-template-conformance/`

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
- [x] CHK-003 [P1] Existing `run-source-gates.sh` guard pattern read before wiring the new guard in

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The guard script runs offline and deterministically — no network, no model dispatch, no state between runs
- [x] CHK-011 [P0] No spec path, requirement id, task id, or checklist id appears in `scan-skill-references.mjs` or any repaired document
- [x] CHK-012 [P1] The guard's sentinel exclusion is scoped to the one constant it documents, not a general allowlist

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] First guard run against the live post-rename tree: `broken : 23`
- [x] CHK-021 [P0] Post-repair guard run: `broken : 0`
- [x] CHK-022 [P0] Sentinel counter-example confirmed rejected: `counter-example rejected : yes`
- [x] CHK-023 [P0] Planted dead citation caught (rc 1, `broken : 1`) then confirmed cleared (rc 0, `broken : 0`)
- [x] CHK-024 [P0] `bash scripts/run-source-gates.sh` exits 0 with all four guards PASS
- [x] CHK-025 [P1] Plugin gate suite re-run and matches exact baseline: `tsc` 0, `build` 0, `vitest` 386, `screenshots:verify` 180, `lint` 115 (100/15)

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] All 23 originally broken citations are repaired, confirmed by the guard's own re-run rather than by manual spot-check alone
- [x] CHK-FIX-002 [P0] The guard is proven to fail closed, not just to pass once: the sentinel and the plant-then-remove test both required a real state change to flip the guard's result
- [x] CHK-FIX-003 [P1] The guard's standing limitation — it resolves paths, not the accuracy of the prose around them — is stated explicitly in this leaf and not implied to be solved

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret, token, or absolute personal path is embedded in the guard script or its documentation
- [x] CHK-031 [P1] No plugin source file, component, or stylesheet touched by this phase — only the guard script, its reference doc, `SKILL.md`, the gates runner, and packet citation text

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `references/skill-reference-integrity.md` documents the guard's method and the sentinel counter-example it must reject
- [x] CHK-041 [P1] `SKILL.md` names the guard in its reference map, assets note, and INTEGRATION POINTS checks
- [x] CHK-042 [P2] The distinction between "the guard passes" and "the surrounding prose is accurate" is stated explicitly as a standing risk, not left implicit

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] New files land only at `tools/naming/scan-skill-references.mjs` and `references/skill-reference-integrity.md`; wiring edits land only in `SKILL.md` and `scripts/run-source-gates.sh`
- [x] CHK-051 [P1] `scratch/` and `graph-metadata.json` left untouched in this leaf

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-28

**Note**: This is the packet's final planned phase. All four source gates (`scan-naming`,
`scan-comments`, `scan-folder-docs`, `scan-skill-references`) report PASS via
`run-source-gates.sh`, and the plugin's own build/test/lint suite matches the exact baseline
recorded at phase 010/011's close. The guard's standing limitation — it resolves paths, not the
accuracy of prose — is carried forward, not claimed solved.

<!-- /ANCHOR:summary -->
