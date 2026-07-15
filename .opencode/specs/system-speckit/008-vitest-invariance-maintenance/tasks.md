---
title: "Tasks: Repair the three RED system-spec-kit vitest suites left by the ADR-007-deferred de-numbering"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "vitest"
  - "invariance"
  - "allowlist maintenance"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/008-vitest-invariance-maintenance"
    last_updated_at: "2026-07-11T20:45:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded Level 2 task list from investigation findings"
    next_safe_action: "T001 — read the three suites' current assertions and baseline the RED output"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/tests/outsourced-agent-handback-docs.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/workflow-invariance.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/031-vitest-invariance-maintenance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Repair the three RED system-spec-kit vitest suites left by the ADR-007-deferred de-numbering

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Scaffold spec folder `008-vitest-invariance-maintenance` (Level 2, `--track system-speckit --skip-branch`)
- [ ] T002 Read the three suites' current assertions; resolve the current de-numbered filename replacing `149-` and the `cli-opencode` `prompt_templates.md` path
- [ ] T003 Baseline: run `vitest run` on all three suites, record the RED failure counts (real starting numbers)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] Suite (a): replace the stale `149-` filename literal with the current de-numbered name (`scripts/tests/outsourced-agent-handback-docs.vitest.ts`) — do NOT touch the `vitest-recovery-followup` `it.fails.skip` at ~line 26
- [ ] T005 [P] Suite (a): add the missing `recentContext` example to `cli-opencode` `prompt_templates.md` to close the content-parity gap
- [ ] T006 [P] Suite (b): relocate the 8 env-var mapping-row assertions to the rows' new post-reorg locations (`mcp_server/tests/feature-flag-reference-docs.vitest.ts`)
- [ ] T007 [P] Suite (b): repoint the 6 numbered-doc content assertions at the de-numbered doc paths / current content
- [ ] T008 Suite (c): add a `node_modules/` exclusion guard to the invariance scanner (`scripts/tests/workflow-invariance.vitest.ts`) — clears the ~11 spurious local-dependency hits
- [ ] T009 Suite (c): refresh the ~3 stale de-numbering-caused allowlist entries
- [ ] T010 Suite (c): add ~40 justified allowlist entries for the legitimate `preset`/`capability`/`kind`/`manifest` technical-vocab uses, each with a one-line rationale (Finding = hypothesis: confirm each is genuine vocab, not a real leak, before allowlisting)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run each suite green (`vitest run`) — record the green counts vs the T003 baseline delta
- [ ] T012 Injected-leak proof: temporarily add a fake private-taxonomy token, confirm `workflow-invariance` FAILS, then revert (anti-false-green evidence for SC-002)
- [ ] T013 Confirm `git diff` shows the `vitest-recovery-followup` `it.fails.skip` line (~L26) byte-identical (SC-003)
- [ ] T014 `bash validate.sh 008-vitest-invariance-maintenance --strict` clean; write `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All three suites green + injected-leak proof passed and reverted
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Record**: See `decision-record.md` (ADR-007 — supersedes sk-doc/026 ADR-006 exclusion assumption)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
