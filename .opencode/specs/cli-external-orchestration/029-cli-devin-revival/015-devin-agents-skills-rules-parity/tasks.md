---
title: "Tasks: Devin agents/skills/rules parity"
description: "Task breakdown for the live-docs-gated AGENT.md build and the skills/rules discovery documentation."
trigger_phrases:
  - "devin agents skills rules parity tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/015-devin-agents-skills-rules-parity"
    last_updated_at: "2026-07-27T11:15:00Z"
    last_updated_by: "claude"
    recent_action: "Implemented (GPT-5.6-LUNA); live probes completed by Claude."
    next_safe_action: "Run strict validation."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", ".devin/agents/code-reviewer/AGENT.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-agents-skills-rules-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Native AGENT.md format is documented at https://docs.devin.ai/cli/subagents.", "The code-reviewer profile resolves and dispatches live, producing a real review with a valid finding.", "The dispatched build sandbox's own network could not reach Devin's model service; a re-run outside that sandbox succeeded."]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Devin agents/skills/rules parity

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

- [x] T001 Fetch the current Devin CLI docs for `.devin/agents/[name]/AGENT.md` format. [EVIDENCE: live-verified context cites https://docs.devin.ai/cli/subagents before profile creation.]
- [x] T002 Cross-check the fetched format against `cli-devin/SKILL.md`'s existing description. [EVIDENCE: native `allowed-tools`/`permissions` fields match; the Claude auto-import claim is corrected for Devin 3000.2.17 in `SKILL.md`.]
- [x] T003 [B] If the fetch contradicts the mechanism's existence, halt and escalate per the Logic-Sync Protocol. [EVIDENCE: not triggered; live docs confirm the native `.devin/agents/[name]/AGENT.md` mechanism.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Build one real `.devin/agents/<name>/AGENT.md` profile matching the confirmed live format. [EVIDENCE: `.devin/agents/code-reviewer/AGENT.md` created with native frontmatter, read-only tools, and write/edit denies.]
- [x] T005 Run `devin skills list` and `devin rules list`; capture the real output. [EVIDENCE: Devin 3000.2.17 output captured verbatim in `SKILL.md`; task-local XDG paths were required for the sandbox.]
- [x] T006 Add a documentation section to `cli-devin/SKILL.md` citing the captured output for both mechanisms. [EVIDENCE: `SKILL.md` contains the live output blocks and invocation guidance.]
- [x] T007 Record the "commands doesn't apply for Devin" decision explicitly. [EVIDENCE: `SKILL.md` cites `devin --help` and the `devin commands` unexpected-argument result.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Live-probe `devin -p` dispatching `run_subagent` targeting the new profile; confirm resolution (not "profile not found"). [EVIDENCE: the dispatched build environment's sandboxed network could not reach Devin's model service (`No ModelInfo available for model 'glm-5-2'`); re-run outside that sandbox succeeded on both counts: (1) `devin -p "List every subagent profile..."` lists `code-reviewer` alongside the two built-ins; (2) `devin -p "Use the code-reviewer subagent to review ..." --permission-mode auto` actually dispatched, ran a read-only review, and returned real findings (a valid P1 type-guard observation on `permission-request-policy.mjs`, verdict APPROVED).]
- [x] T009 Run phase 015 strict and recursive parent strict validation. [EVIDENCE: `validate.sh --strict` reports 0 errors, 0 warnings for phase 015.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0/P1 tasks have command-backed evidence.
- [x] No blocked implementation tasks remain.
- [x] Runtime, configuration, docs, and recursive packet gates pass. [EVIDENCE: phase 015 strict 0/0.]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
