---
title: "Tasks: Replace emphasis labels in the agent template and every agent with plain statements of the same boundaries"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "agent emphasis register tasks"
  - "agent label rewrite tasks"
importance_tier: "important"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Replace emphasis labels in the agent template and every agent with plain statements of the same boundaries

<!-- SPECKIT_LEVEL: 1 -->

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

- [ ] T001 Record the baseline label counts for the template and both authored trees (`implementation-summary.md`)
- [ ] T002 Get an answer to the `orchestrate.md` bare `MANDATORY` question (`spec.md` §7)
- [ ] T003 Run the mirror checks once from the starting state and record their results
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Amend the template lead-ins, checklist headings and the `:814` check (`.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md`)
- [ ] T005 Add the release note and bump the version (`sk-create-agent/changelog/v1.0.2.0.md`, `sk-create-agent/SKILL.md`)
- [ ] T006 [P] Rewrite the labelled sites in each of the nine agents (`.skilled/agents/*.md`)
- [ ] T007 [P] Apply the same rewrites to the Claude twins (`.claude/agents/*.md`)
- [ ] T008 Regenerate the Codex, Pi and Hermes mirrors (`sync-agents.cjs`, `sync-agents-pi.cjs`, `sync-skills-hermes.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Rerun the label search and confirm zero hits (REQ-001, REQ-004)
- [ ] T010 Write the before/after list for all 36 sites and get a second reader to sign it off (REQ-002)
- [ ] T011 Rerun the mirror checks and the mirror-sync vitest (REQ-003)
- [ ] T012 Update `implementation-summary.md` and run `validate.sh --strict` to `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Origin**: `specs/agents/013-prompting-guide-alignment/research/synthesis.md` §3
<!-- /ANCHOR:cross-refs -->

---
