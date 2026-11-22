---
title: "Goal: Phase 3: hub-reports-destination"
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
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/007-playbook-run-recording/003-hub-reports-destination"
    last_updated_at: "2026-11-22T11:50:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase goal"
    next_safe_action: "Commit on the operator's instruction"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-hub-reports-destination"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: hub-reports-destination

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A mode packet with no benchmark folder of its own saves its playbook runs into its owning hub's reports folder through one flag, and the three playbook roots that need it name that flag.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `--reports DIR` is opt-in. Without it, the recorder writes into the playbook's own skill, as before. |
| D2 | `--reports` must end in `benchmark/reports`, and its skill must contain the playbook. Otherwise the recorder refuses with exit 1 before any write. |
| D3 | A run saved through `--reports` names the owning hub in the reports index and in its `source.md`. |
| D4 | The 25 cli-mistral-vibe verdicts are moved as recorded. No scenario is run again. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node scripts/tests/record-playbook-run.test.cjs` in the mode exits 0 and prints `recorder hub reports: PASS`
- [x] `node --test scripts/tests/run-conversation-scenario.test.cjs` in the mode reports `fail 0`
- [x] `validate-playbook-package.cjs --package <root>` exits 0 with `violations=0` for sk-code-ci, sk-code-frontend and cli-mistral-vibe
- [x] `rg -l 'Recorded Result'` over the cli-mistral-vibe playbook prints nothing, and the two report folders hold 22 and 3 PASS rows
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this child, the parent, 001 and 002
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
| Recorder `--reports` and `resolveReports` | Done | `resolveReports` at recorder line 455, its export and its call; `runHubReports` 8 assertions PASS |
| Runner forwards `--reports` | Done | `run-conversation-scenario.test.cjs` reports `fail 0` |
| Three playbook roots name the flag | Done | `rg -n -- '--reports .skilled'` prints one line per root; `validate-playbook-package.cjs --package` exit 0, `violations=0` on each |
| cli-mistral-vibe blocks moved | Done | 0 `Recorded Result` blocks left; report folders hold 22 and 3 PASS rows |
| Mode docs and changelog | Done | SKILL.md 1.3.0.0, template 1.0.3.0, `changelog/v1.3.0.0.md` |
| Strict validation for the packet | Done | `validate.sh --strict` prints RESULT: PASSED for this child, the parent, 001 and 002. Detail in `implementation-summary.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Skip blocker line added to `fanout/adapter-stress-cells.md` | Removing its `Recorded Result` block also removed the sentence naming the live-probe SKIP blocker, which the validator needs. The sentence is restored as a `Skip blocker:` line in the scenario contract. |
| Parent Out of Scope bullet | "Rewriting existing run reports into the recorder's format" excludes the move of the 25 blocks. The parent scope is not edited here. Open question in `spec.md` section 10. |
<!-- /ANCHOR:log -->
