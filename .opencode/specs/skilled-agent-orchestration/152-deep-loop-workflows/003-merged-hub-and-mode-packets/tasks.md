---
title: "Tasks: Merged hub and mode packets"
description: "Tasks for phase 003 of the deep-loop-workflows merge: Merged hub and mode packets."
trigger_phrases:
  - "deep-loop-workflows phase 003"
  - "merged-hub-and-mode-packets"
  - "deep loop merge tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-deep-loop-workflows/003-merged-hub-and-mode-packets"
    last_updated_at: "2026-06-15T05:45:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Assembled tasks from parallel planning fleet"
    next_safe_action: "Execute phase 003 per the gated pipeline"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-152-003-merged-hub-and-mode-packets-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Merged hub and mode packets

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [ ] T001 Read predecessor continuity and `../research/research.md` for this phase's scope
- [ ] T002 Load the phase-001 parity baseline for the affected modes/surfaces

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T001 Scaffold the hub: routing-only SKILL.md (no per-mode logic), graph-metadata.json with skill_id=name=folder=deep-loop-workflows and family=deep-loop, README (`.opencode/skills/deep-loop-workflows/SKILL.md`, `.opencode/skills/deep-loop-workflows/graph-metadata.json`)
- [ ] T002 Build context/ packet (copy deep-context, drop graph-metadata, anchored rewrite, fix 2 escaping runtime walks in loop-lock.cjs/reduce-state.cjs) (`.opencode/skills/deep-loop-workflows/context/`)
- [ ] T003 Build research/ packet (copy deep-research, drop graph-metadata, anchored rewrite ~434 self-refs, re-enumerate escaping walks on post-002 tree) (`.opencode/skills/deep-loop-workflows/research/`)
- [ ] T004 Build review/ packet (copy deep-review, drop graph-metadata, anchored rewrite, depth fix) (`.opencode/skills/deep-loop-workflows/review/`)
- [ ] T005 Build ai-council/ packet (opus): copy deep-ai-council, drop graph-metadata, anchored rewrite, and +1 '..' on the 8 relative require('../../deep-loop-runtime/...') that throw on load (`.opencode/skills/deep-loop-workflows/ai-council/`)
- [ ] T006 Build improvement/ packet (opus, heaviest): copy deep-improvement, drop graph-metadata, anchored rewrite (~408 self + 43 exec refs), +1 '..' on escaping walks (check-agent-mirror-sync 4->5, skill-benchmark 3->4, shared/reduce-state runtime reach) leaving packet-internal scorer walks unchanged (`.opencode/skills/deep-loop-workflows/improvement/`)
- [ ] T007 Author mode-registry.json: 8 workflowModes each with runtimeLoopType (value or explicit null), backendKind, aliases, packetPath, permissions, commandNames, artifactRoot; ai-council->council mapping explicit (`.opencode/skills/deep-loop-workflows/mode-registry.json`)
- [ ] T008 Author+run registry completeness test (R4): every mode has the unambiguous triple; improvement modes runtimeLoopType===null EXPLICIT (negative test on omission); backendKind<->nullability consistency (`.opencode/skills/deep-loop-workflows/tests/registry-completeness.vitest.ts`)
- [ ] T009 Keystone+rewrite gate: exactly one graph-metadata.json under hub; nested-SKILL.md discovery test (read-only, not advisor_rebuild) shows zero extra packet nodes; full-tree residual self-path grep empty; ~15 cross-mode refs resolve (`.opencode/skills/deep-loop-workflows/`)
- [ ] T010 Per-mode single-executor artifact byte-parity vs phase-001 baseline (Lane D dry-run basis); doubles as depth-fix verifier since a missed +1 throws or diffs (`.opencode/skills/deep-loop-workflows/`)
- [ ] T011 Strict validate + frozen-boundary check (`.opencode/specs/skilled-agent-orchestration/152-deep-loop-workflows/003-merged-hub-and-mode-packets`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Run the parity check: Two required proofs vs phase-001 baseline: (1) per-packet source-verbatim — inverse-apply the path rewrite to each new packet and diff -r vs the source deep-<name>/, only allowed delta is the dropped graph-metadata.json; (2) artifact byte-parity — run each mode single-executor from the new path on phase-001's exact fixture and diff emitted artifacts byte-for-byte vs baseline (byte-identical only if no absolute skill path leaks into output AND every escaping __dirname walk/require was depth-corrected, so this test also verifies the depth fix). Registry correctness via the R4 completeness test incl explicit-null negative test. Lane D compared on dry-run basis (B8).
- [ ] T015 `validate.sh --strict` on this phase folder
- [ ] T016 Confirm the phase success criteria in `spec.md` are met

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Parity check passed against the phase-001 baseline.
- [ ] `validate.sh --strict` green.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Evidence**: `../research/research.md`, `../context/context-report.md`

<!-- /ANCHOR:cross-refs -->
