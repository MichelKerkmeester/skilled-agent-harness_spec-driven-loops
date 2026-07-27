---
title: "Tasks: Cursor agents/skills/rules parity"
description: "Task breakdown for resolving the UserPromptSubmit question first, then populating .cursor/rules and recording the agents/commands decisions."
trigger_phrases:
  - "cursor agents skills rules parity tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/014-cursor-agents-skills-rules-parity"
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "claude"
    recent_action: "Implemented static rules and parity findings."
    next_safe_action: "Review scoped uncommitted diff."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cursor-agents-skills-rules-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Cursor agents/skills/rules parity

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

- [x] T001 Read the `.cursor/hooks.json` `UserPromptSubmit` handler's actual implementation source. [EVIDENCE: `.opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts:5-14` marks delivery unconfirmed; `:45-51` shows the shared-advisor adapter call.]
- [x] T002 Determine whether the handler injects skill-advisor-equivalent context. [EVIDENCE: the adapter is designed to inject the brief, but the live marker re-probe under `cursor-agent 2026.07.23-e383d2b` confirmed `beforeSubmitPrompt` does not fire; `hook-contract.md:106` records the result.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Populate `.cursor/rules/*.md` with static routing content. [EVIDENCE: `cursor-agent generate-rule --help` was checked; `.cursor/rules/skill-routing.md` was created with `alwaysApply: true` and pointers scoped to the missing dynamic brief.]
- [x] T004 Record the agents non-applicability decision in `cli-cursor/SKILL.md`. [EVIDENCE: the new Repository Rules, Hook Delivery, and Parity Boundaries section states the live `--help` result.]
- [x] T005 Record the commands non-applicability decision in `cli-cursor/SKILL.md`. [EVIDENCE: the same section states Cursor has no dedicated command-file-system concept or `commands` command.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Diff the new rules content against the hook's designed/injected scope to confirm non-overlap. [EVIDENCE: `implementation-summary.md` records the source comparison: adapter transports the current prompt to the advisor; the rule contains static packet pointers, with no copied dynamic brief or event envelope.]
- [x] T007 Run phase 014 strict and recursive parent strict validation. [EVIDENCE: final `validate.sh --strict` and `--recursive --strict` output is recorded in `implementation-summary.md`.]
- [x] T008 Cross-reference the Devin-side sibling phase's decisions for consistency. [EVIDENCE: sibling `cli-devin/SKILL.md` records the same commands non-applicability framing at lines 306-308; Cursor records it in its new parity section.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0/P1 tasks have command-backed evidence.
- [x] No blocked implementation tasks remain.
- [x] Runtime, configuration, docs, and recursive packet gates pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
