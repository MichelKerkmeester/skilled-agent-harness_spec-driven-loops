---
title: "Verification Checklist: Stop skill-advisor state from leaking into spec folders [template:level_2/checklist.md]"
description: "Verification evidence for the advisor workspace-root fallback hardening, the lockstep schema twin, the regression test, the dist rebuild, and the removal of the 23 stray advisor-state directories."
trigger_phrases:
  - "advisor state leak checklist"
  - "workspace root hoist checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/003-advisor-and-codegraph/005-advisor-state-spec-folder-leak"
    last_updated_at: "2026-06-18T00:00:00Z"
    last_updated_by: "opus-agent"
    recent_action: "All checklist items verified with evidence"
    next_safe_action: "None — complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/utils/workspace-root.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/utils/workspace-root.vitest.ts"
    session_dedup:
      fingerprint: "sha256:4f30b5ad13efa49ec32794edceb40b650f1555b6454193c66981860b76981a44"
      session_id: "027-003-005-advisor-state-spec-folder-leak"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Stop skill-advisor state from leaking into spec folders

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] CHK-001 [P0] Root cause confirmed against source
  - **Evidence**: `workspace-root.ts` fallback was `return resolve(start)`; advisor writes `<root>/.opencode/skills/.advisor-state/skill-graph-generation.json` via `generation.ts`
- [x] CHK-002 [P0] Stray inventory snapshotted before deletion
  - **Evidence**: 23 dirs listed in `scratch/stray-advisor-state-before.txt`


<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code typechecks
  - **Evidence**: `npm run typecheck` exited 0 (tsc, no errors)
- [x] CHK-011 [P1] Change scoped to the fallback branch; happy path untouched
  - **Evidence**: walk-up returns on sentinel hit before the fallback; happy-path test asserts unchanged return
- [x] CHK-012 [P1] Comment hygiene respected
  - **Evidence**: helper comments state the durable WHY; no spec ids/paths embedded in code
- [x] CHK-013 [P1] Lockstep twin updated
  - **Evidence**: `detectRepoRoot` in `advisor-tool-schemas.ts` carries the inlined guard + a comment naming its partner


<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Regression test passes
  - **Evidence**: `tests/utils/workspace-root.vitest.ts` — 5/5 passed
- [x] CHK-021 [P0] No regressions attributable to this change
  - **Evidence**: stash-baseline run showed `python-ts-parity` and `local-native-divergence-ratchet` already failing WITHOUT my edits (`rr-iter2-060`, divergence-ledger drift)
- [x] CHK-022 [P1] Edge cases covered
  - **Evidence**: canonical `.opencode/specs`, bare `specs` alias, deep-nested property, non-specs fallback all asserted


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-025 [P0] The leak vector is structurally closed
  - **Evidence**: fallback returns `hoistAboveSpecsTree(start) ?? resolve(start)`; the property test asserts no `specs` segment in the result for any packet-nested start
- [x] CHK-026 [P1] Existing strays removed
  - **Evidence**: re-sweep of `.opencode/specs/` reports 0 `.advisor-state` directories
- [x] CHK-027 [P1] Related-but-distinct spillage flagged, not silently expanded
  - **Evidence**: `.opencode/node_modules` opencode-plugin installs in two research dirs documented as out-of-scope follow-up


<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] No widening of the workspaceRoot allowlist surface
  - **Evidence**: `detectRepoRoot` only narrows the allowlist anchor toward the true root; bounding logic in `isAllowedWorkspaceRoot` unchanged
- [x] CHK-031 [P2] Deletion cannot escape the spec tree
  - **Evidence**: deletions driven by the snapshot under `.opencode/specs/`; `rmdir` removes wrappers only when empty


<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/summary synchronized
  - **Evidence**: all five canonical docs authored at Level 2 against the live template contract
- [x] CHK-041 [P2] Follow-ups recorded
  - **Evidence**: opencode-plugin `.opencode/node_modules` spillage and pre-existing parity drift noted in spec + summary


<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Evidence kept in `scratch/`
  - **Evidence**: `scratch/stray-advisor-state-before.txt`
- [x] CHK-051 [P2] No stray temp files outside `scratch/`
  - **Evidence**: only canonical docs + `scratch/` created in the packet


<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 9 | 9/9 |
| P2 Items | 4 | 4/4 |

**Verification Date**: 2026-06-18
**Verified By**: AI Assistant (Claude)

<!-- /ANCHOR:summary -->
