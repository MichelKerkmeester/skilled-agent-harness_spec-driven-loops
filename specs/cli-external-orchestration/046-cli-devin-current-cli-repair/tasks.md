---
title: "Tasks: Repair cli-devin Fan-out Dispatch for the Current Devin CLI"
description: "Task breakdown for the cli-devin headless dispatch repair: trust flag, sandbox drop, and live verification."
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/046-cli-devin-current-cli-repair"
    last_updated_at: "2026-08-17T12:45:34Z"
    last_updated_by: "claude"
    recent_action: "All tasks complete"
    next_safe_action: "Closed"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-046-cli-devin-repair"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: Repair cli-devin Fan-out Dispatch for the Current Devin CLI

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending · `[x]` done · `[~]` in progress
- Each task names its file and the observable check that proves it.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T1: Append `--respect-workspace-trust false` unconditionally in `buildDevinLineageCommand` (`fanout-run.cjs`).
- [x] T2: Update the three devin-arg unit assertions to expect the trust flag (`fanout-run.vitest.ts`).

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T3: Stop appending `--sandbox` for the workspace-write branch; use `--permission-mode dangerous` alone.
- [x] T4: Rewrite the rationale comment to describe the current devin `--sandbox` behavior and guard-based confinement.
- [x] T5: Update the workspace-write unit assertion to expect no `--sandbox`.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T6: `fanout-run.vitest.ts` green.
- [x] T7: Live devin write repro in a fresh dir (exit 0, file written) — captured pre-fix.
- [x] T8: Re-run the 045 glm-devin lineage; confirm `research.md` produced.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 requirements met; `validate.sh <packet> --strict` exit 0.
- 045 glm-devin lineage produces `research.md`.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Consumed by: `specs/cli-external-orchestration/045-cli-pi-bridge-cursor-devin/001-research-bridge-possibilities`

<!-- /ANCHOR:cross-refs -->
