---
title: "Goal: Verification and Closeout"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/005-verification-and-closeout"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-005-verification-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Verification and Closeout

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short, because goal surfaces cap what
> they hold, and a truncated objective loses its tail, where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove the final state with one pass of every gate, and leave one consistent account of what this packet did.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every gate runs against one final state, and a gate run against a state that has since moved is discarded |
| D2 | A passing result is required explicitly. An absent failure line is not a pass |
| D3 | The validator is invoked through a resolved real path, because the spec scripts can silently do nothing through a symlink |
| D4 | Metadata is regenerated after the last document edit, never before |
| D5 | A failed gate returns the packet to phase 004 rather than being written up as a caveat |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these verbatim into the objective. Nothing dereferences a path.

- [ ] `research/final-state.md` carries every gate's number beside the command that produced it
- [ ] Recursive validation reports a passing result for all six folders, with rule lines present and zero errors
- [ ] The corpus hashes and the coverage count are identical before and after the final pass
- [ ] The predecessor roadmap entry and finding 10 both name this packet and its result
- [ ] The parent map, the parent goal log and each phase status agree on completion
- [ ] The resolved lane weights and the committed default are both recorded, and any difference is explained
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
| Orchestrator rebuilt | Pending | None yet |
| Final-state pass complete | Pending | None yet |
| Predecessor items closed | Pending | None yet |
| Recursive validation clean | Pending | None yet |

### Deviations and findings

| Item | Note |
|------|------|
| A stale orchestrator certifies silence as success | The validator exits with a system error and emits no rule output at all, so a sweep looking only for a failure line reads that as a pass |
| A phase parent's output runs past the folder asked about | The recursion continues into children, so the first result line is the one describing the folder itself |
<!-- /ANCHOR:log -->
