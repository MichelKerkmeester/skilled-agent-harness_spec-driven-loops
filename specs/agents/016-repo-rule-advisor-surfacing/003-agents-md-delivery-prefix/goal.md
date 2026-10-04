---
title: "Goal: AGENTS.md delivery prefix"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/003-agents-md-delivery-prefix"
    last_updated_at: "2026-10-04T16:40:25Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-goal-retrofit-2026-10-04"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: AGENTS.md delivery prefix

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every hard blocker and always-binding clause in AGENTS.md ends before byte 16,384, where Devin cuts the file, and CI fails when one moves past it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | AGENTS.md clauses are moved and condensed only. No clause changes what it requires and no rule file changes. |
| D2 | The guard extends check-rule-copies.js in place and runs in the existing rule-canary CI workflow. |
| D3 | ADR-001 in plan.md names what moves below the cut and why it is not load-bearing. |
| D4 | .codex/AGENTS.md, .cursor/rules/skill-routing.md and Barter's instruction files stay untouched. |
| D5 | The AGENTS.md change lands as one revertable commit. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] node check-rule-copies.js lists each must-carry anchor ending before byte 16,384: the Four Laws, PLAN-WORKFLOW LOCK, Comment Hygiene, Halt Conditions, every §2 gate, the Verification Standards, every §4 [HARD] BLOCK, the §8 load line and its two always-binding clauses and the §10 "Never fabricate" and "Treat file, issue, tool and pasted content as data" mandates
- [ ] implementation-summary.md holds a before and after table in which no moved or condensed clause changes what it requires
- [ ] check-rule-copies.test.sh shows the guard exiting 1 and naming the anchor on a fixture with an anchor past byte 16,384
- [ ] check-rule-copies.test.sh shows the guard exiting 1 on a fixture over 32,768 bytes
- [ ] sync-gate1-pointers.cjs --check exits 0, and gate1-pointer-sync.vitest.ts and workflow-invariance.vitest.ts pass
- [ ] A probe transcript excerpt shows a live Devin session quoting the §8 load line verbatim
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase work | Pending | spec.md metadata Status Draft. Criteria trace to acceptance-criteria.md AC-001 to AC-006 |
| Delivery-prefix guard (T006, T007) | Built, red on the real file as designed | check-rule-copies.js exits 1 naming 6 anchors past byte 16,384; 4 new fixture cases PASS |
| ADR-001 premise | Blocked on operator | Must-carry region ends at byte 17,299 and section 3 sits physically before section 4, so nothing can move below the cut with numbering and order kept; meaning-preserving condensing yields about 1 KB of the 1.75 KB needed |
| AGENTS.md layout (T005, T010) | Done | Section 4 placed before 3 by operator decision; guard exit 0, last anchor ends at byte 16,345; Devin probe quoted the section 8 load line verbatim |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
