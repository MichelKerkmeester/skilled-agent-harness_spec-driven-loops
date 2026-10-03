---
title: "Goal: Fix: fan-out runner, merge and lineage prompt"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/012-fanout-runner-and-prompt-fixes"
    last_updated_at: "2026-10-03T05:30:12Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-049"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Fix: fan-out runner, merge and lineage prompt

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix the fan-out runner, merge and lineage prompt faults phase 048 recorded, so a deep-research fan-out runs without manual repair.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
| ---- | ---------- |
| D1 | Read more field names at the merge and restate the contract in the prompt, rather than rewriting lineage output |
| D2 | A refusal that the same input will repeat is not retried |
| D3 | Containment attribution stays out of scope |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `fanout-merge.vitest.ts` passes, with a case that merges `claim` rows
- [ ] `fanout-run.vitest.ts` passes, with a case that does not retry a projection refusal
- [x] Re-merging 048's 008 lineages from the original delta rows yields 53 findings and the closeout invariant passes
- [x] `validate.sh --strict` prints `RESULT: PASSED` on this phase
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
| Phase opened | Done | Spec, plan, tasks and goal authored 2026-10-03 from 048's goal log |
| Merge and prompt build | Done | `fanout-merge.cjs` reads `claim` and `summary` and warns on an unreadable row; the iteration prompt pack states the `label` field, the contradiction rule and the verbatim lineage-path rule |
| Cross-family review (2026-10-03) | Done | Luna on cli-codex: 2 P1 on REQ-003. The absolute lineage path moved to the runner as REQ-004 (spec amended), and `prompt-pack.vitest.ts` now asserts all three instructions, each phrase new and unique in the template |
| Tests (2026-10-03) | Done | `fanout-merge.vitest.ts`, `deep-research-run-open.vitest.ts` and `check-contract-drift.vitest.ts` 78 passed; `prompt-pack.vitest.ts` 11 passed; contract drift OK |
| Re-merge proof (2026-10-03) | Done | 048/008 copied to scratch with the original `claim` delta rows: 53 findings, `synthesis-closeout` exit 0 (`synthesis_complete`). HEAD merge: 26 findings, reconstruction gap 27, closeout exit 2 |
| Runner part | Blocked | REQ-002 and REQ-004 change `fanout-run.cjs`, which carries the uncommitted `system-deep-loop/040-cli-pi-opencode-go-route` edit in the primary checkout. Build after 040 lands |

### Deviations and findings

| Item | Note |
|------|------|
| Absolute lineage path moved to the runner | REQ-003 asked the prompt pack for an absolute path, but the runner passes the base directory as the caller wrote it. The prompt keeps the verbatim-path rule; REQ-004 resolves the path in the runner |
<!-- /ANCHOR:log -->
