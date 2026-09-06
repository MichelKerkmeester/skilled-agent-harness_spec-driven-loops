---
title: "Tasks: Phase 6: verify-rollout"
description: "Verify the landed template reductions across snapshots, derived status, fresh scaffolds, strict validation, dist freshness, byte reduction, and final packet hygiene before rollout."
trigger_phrases:
  - "verify rollout tasks"
  - "template reduction close-out"
  - "recursive validation gate"
  - "zero deriveStatus delta"
importance_tier: "important"
contextType: "general"
---
# Tasks: Phase 6: verify-rollout

<!-- SPECKIT_LEVEL: 1 -->
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

**Task Format**: `T### [P?] Description (file path); done when ...`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [REQ-001, REQ-002, REQ-005] Capture the before baseline for snapshots, derived status, and rendered bytes (`.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap`, `.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts`); done when the comparison inputs and representative shipped L2+ fleet are recorded.
- [ ] T002 [REQ-003] Confirm predecessor outputs and validation targets (`specs/system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/002-tasks-checklist-merge/`, `003-template-dedup/`, `004-continuity-single-source/`, `005-comment-extraction/`); done when phases 002 through 005 are landed and fresh L1/L2/L3/L3+ plus legacy targets are selected.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [REQ-001] Run and review the whole golden-snapshot suite (`.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts`, `.opencode/skills/system-spec-kit/scripts/tests/__snapshots__/scaffold-golden-snapshots.vitest.ts.snap`); done when all renders pass and only intended reviewed re-baselines differ.
- [ ] T004 [REQ-003] Rebuild both runtime distributions and check freshness (`.opencode/skills/system-spec-kit/scripts/dist/`, `.opencode/skills/system-spec-kit/mcp-server/dist/`); done when both trees are regenerated from current sources and the freshness gate passes.
- [ ] T005 [REQ-003] Scaffold fresh packets at L1, L2, L3, and L3+ (`.opencode/skills/system-spec-kit/scripts/spec/create.sh`); done when each scaffold contains the expected documents and is ready for strict validation alongside a shipped legacy packet.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 [REQ-002] Compare `deriveStatus` before and after for the representative fleet (`.opencode/skills/system-spec-kit/mcp-server/lib/graph/graph-metadata-parser.ts`); done when every derived status is identical and the fleet delta is zero.
- [ ] T007 [REQ-003] Run strict validation on fresh levels and the shipped legacy packet (`.opencode/skills/system-spec-kit/scripts/spec/validate.sh`); done when every target exits 0 with rebuilt distributions.
- [ ] T008 [REQ-003, REQ-004] Run the parent recursive strict gate (`.opencode/skills/system-spec-kit/scripts/spec/validate.sh`, `specs/system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/`); done when recursive validation is clean, no unrelated file changed, and no stray output remains.
- [ ] T009 [REQ-005] Measure and report rendered-byte reduction (`.opencode/skills/system-spec-kit/scripts/tests/scaffold-golden-snapshots.vitest.ts`); done when before/after byte totals and the achieved reduction are recorded against the phase baseline.
- [ ] T010 [REQ-004] Inspect completion claims before rollout (`specs/system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/`); done when no phase or packet document claims completion without verification evidence, and the phase implementation summary remains deferred until the gates pass.
- [ ] T011 [REQ-001, REQ-002, REQ-003, REQ-004, REQ-005] Write the rollout changelog and acceptance evidence (`specs/system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/changelog/`, `006-verify-rollout/spec.md`); done when all five requirements have evidence, the changelog reflects the verified result, and no false-completion artifact remains.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] REQ-001 through REQ-005 each have a completed mapped task and evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: See `../005-comment-extraction/`
<!-- /ANCHOR:cross-refs -->
