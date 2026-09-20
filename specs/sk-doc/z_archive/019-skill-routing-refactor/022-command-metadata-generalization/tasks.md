---
title: "Task Breakdown: Command Metadata as a Hub Standard"
description: "Executed task list for the core schema, gate wiring, six authored hub surfaces, scaffolder, doctrine, and cross-model verification."
trigger_phrases:
  - "command metadata tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/022-command-metadata-generalization"
    last_updated_at: "2026-07-28T13:08:48Z"
    last_updated_by: "claude-code"
    recent_action: "Recorded executed tasks"
    next_safe_action: "None"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "022-command-metadata-generalization"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Task Breakdown: Command Metadata as a Hub Standard

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete with evidence; `T-nn` ordering follows execution.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Map command ownership: registries declare sk-design 2, sk-doc 12 (one without a definition file), system-deep-loop 8, sk-prompt 1; remaining hubs none
- [x] T-02 Confirm sk-design's file carries every core field (subset proof target)
- [x] T-03 Worktree from origin tip via the naming allocator
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-04 `lib/command-metadata-schema.cjs` — pure core validator with injected existence probes
- [x] T-05 Contract flip in `skill-root-metadata-contract.cjs` (H-required, S-forbidden, overlay emptied)
- [x] T-06 `checkCommandMetadata()` in the fleet gate: registry modes, choreography resolution, command-file mapping, `COMMAND_METADATA_*` codes
- [x] T-07 Empty declarations for cli-external-orchestration, mcp-tooling, sk-code; sk-prompt entry authored
- [x] T-08 LUNA xhigh dispatch: sk-doc (11 entries) + system-deep-loop (8 entries), self-validated against the gate
- [x] T-09 Scaffolder writes `[]` on the parent path; SKILL.md step 5, canonical doc v1.1.0.0, both READMEs updated
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-10 Contract tests extended (H-required, S-forbidden, uniformity); doctor fixture carries `[]`
- [x] T-11 Seeded-mutation probe: unknown owner mode + missing resource both caught, file restored, gate clean
- [x] T-12 Scaffold proof both classes; all suites + drift guards green
- [x] T-13 SOL high adversarial verification of the full diff
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Fleet gate 11/11 with per-hub command validation; every suite green; SOL verdict with no unrefuted P0/P1; landed on the release branch.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · Checklist `checklist.md` · Summary `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
