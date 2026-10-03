---
title: "Goal: Build: improve the Jev completion-claim audit (026)"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/010-completion-claims-improvements"
    last_updated_at: "2026-10-03T05:30:10Z"
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
# Goal: Build: improve the Jev completion-claim audit (026)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build the recommendations 048 ranked for the Jev completion-claim audit (026) that need no new labels, corpus or default-on switch.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
| ---- | ---------- |
| D1 | Build only what this spec names. New corpora, new labels and any default-on switch stay out, per 003 D4 and 047 D6 |
| D2 | A change to a flag line, call protocol, aggregation or question text is a keep-rule amendment. Record it in the log before the re-measure, and keep the old verdict on record |
| D3 | A re-measure calls live Jev only when `jev auth status` passes, and records every call with `--out` |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `completion-evidence-sentinel.vitest.ts` and `completion-claim-audit.vitest.ts` pass with the new cases
- [ ] The scorer's census on the 047 rows reports more than 0 true and at most 7 false fires for the shipped sentinel, with every arm's counts in the log
- [ ] `.cursor/hooks.json` lists the completion adapter
- [ ] `validate.sh --strict` prints `RESULT: PASSED` on this phase
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
| Phase opened | Done | Spec, plan, tasks and goal authored 2026-10-03 from 048's ranked table |

### Deviations and findings

| Item | Note |
|------|------|
| Injection contract added to scope (2026-10-03) | The first build halted on R9: the injection contract says the sentinel injects nothing, while `hooks/pi/completion-evidence.ts` sends a `display:false` message delivered next turn. The code is the truth and R9 exists to reconcile the docs to it, so the session added `.skilled/hooks/injection-contract.md` to Files to Change |
<!-- /ANCHOR:log -->
