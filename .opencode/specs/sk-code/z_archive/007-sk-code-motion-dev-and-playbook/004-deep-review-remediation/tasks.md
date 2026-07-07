---
title: "Tasks: Packet 069 Deep Review Remediation"
description: "Finding-by-finding task ledger for Phase 004 remediation."
trigger_phrases:
  - "069 remediation tasks"
  - "deep review finding tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/007-sk-code-motion-dev-and-playbook/004-deep-review-remediation"
    last_updated_at: "2026-05-05T12:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Tracked finding-by-finding remediation tasks"
    next_safe_action: "Validate post-remediation"
    blockers: []
    key_files:
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: Packet 069 Deep Review Remediation

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

**Task Format**: `T-### Finding ID - Severity - exact remediation`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 F-004 - P0 - Prove Webflow pointer no-clobber state by checking cached and unstaged numstat for `.opencode/skills/sk-code/references/webflow/`; document empty-output pass because no Webflow deletion is present.
- [x] T-002 F-005 - P0 - Convert `layout_transition.js` from undocumented `window.MotionPlus`/`window.Motion` probing to documented `await import("motion-plus/animate-layout")` with `unstable_animateLayout`, try/catch, and reduced-motion handling.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-003 F-001 - P1 - Remove bare `from "motion"` and generic `motion.dev` markers from WEBFLOW surface detection in `SKILL.md`, router docs, and README; keep Motion as MOTION_DEV intent context.
- [x] T-004 F-002 - P1 - Replace stale `https://motion.dev/docs/timeline` citations in Motion references with `https://motion.dev/docs/animate`.
- [x] T-005 F-006 - P1 - Rework `es_module_bootstrap.js` to match dynamic import, try/catch, export validation, and reduced-motion fallback.
- [x] T-006 F-007 - P1 - Refresh parent `spec.md` status, phase map, and resolved open questions; add Phase 004 row.
- [x] T-007 F-008 - P1 - Refresh continuity blocks in child specs 001, 002, and 003 to completion_pct 100 with updated action/next-safe-action.
- [x] T-008 F-009 - P1 - Update Packet 2 implementation summary to reflect remediated runnable snippets and the new nine-snippet inventory after F-012.
- [x] T-009 F-010 - P1 - Add `motion_dev` to manual playbook global precondition folder lists.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-010 F-011 - P2 - Add local `references/motion_dev/*` and relevant `assets/motion_dev/*` links to each MR/CB scenario source section.
- [x] T-011 F-012 - P2 - Add runnable `stagger_animation.js` with JSDoc, Motion `stagger()` usage, snake_case naming, and reduced-motion handling; update playbook entries.
- [x] T-012 F-013 - P2 - Update Packet 3 `graph-metadata.json` causal summary to delivered outcome.
- [x] T-013 F-014 - P2 - Add `---` divider lines between numbered sections in the seven MR/CB scenario files.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification

- [x] T-014 Run strict parent validation and record exit code.
- [x] T-015 Run no-clobber proof and record output.
- [x] T-016 Run stale URL grep and record zero-hit result.
- [x] T-017 Run snippet parse check and record exit code.
- [x] T-018 Run bare-motion marker grep and record acceptable result.
- [x] T-019 Run continuity/precondition greps and record output.
- [x] T-020 Author final implementation summary with finding statuses, file references, and verification evidence.
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All active finding tasks marked `[x]`.
- [x] All verification tasks marked `[x]` after commands run.
- [x] `implementation-summary.md` cites every finding and command.
- [x] No open questions remain.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Review report**: `../review/review-report.md`
<!-- /ANCHOR:cross-refs -->
