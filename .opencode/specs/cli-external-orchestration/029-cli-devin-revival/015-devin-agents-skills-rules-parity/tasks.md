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
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase re-scaffolded (Planned)."
    next_safe_action: "Execute T001-T009 in order."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-agents-skills-rules-parity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
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

- [ ] T001 Fetch the current Devin CLI docs for `.devin/agents/[name]/AGENT.md` format. [EVIDENCE: fetched page/section cited by URL.]
- [ ] T002 Cross-check the fetched format against `cli-devin/SKILL.md`'s existing description. [EVIDENCE: diff noted if the live format differs from what is currently documented.]
- [ ] T003 [B] If the fetch contradicts the mechanism's existence, halt and escalate per the Logic-Sync Protocol. [EVIDENCE: escalation message drafted if triggered; otherwise not applicable.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Build one real `.devin/agents/<name>/AGENT.md` profile matching the confirmed live format. [EVIDENCE: file created, content matches the cited format.]
- [ ] T005 Run `devin skills list` and `devin rules list`; capture the real output. [EVIDENCE: command output captured verbatim.]
- [ ] T006 Add a documentation section to `cli-devin/SKILL.md` citing the captured output for both mechanisms. [EVIDENCE: `SKILL.md` diff shows the new cited section.]
- [ ] T007 Record the "commands doesn't apply for Devin" decision explicitly. [EVIDENCE: decision note added, citing the live `--help` confirmation.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Live-probe `devin -p` dispatching `run_subagent` targeting the new profile; confirm resolution (not "profile not found"). [EVIDENCE: probe transcript.]
- [ ] T009 Run phase 015 strict and recursive parent strict validation. [EVIDENCE: `validate.sh --strict` reports 0 errors, 0 warnings for phase 015 and the 029 parent.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0/P1 tasks have command-backed evidence.
- [ ] No blocked implementation tasks remain (T003 resolves either way).
- [ ] Runtime, configuration, docs, and recursive packet gates pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
<!-- /ANCHOR:cross-refs -->
