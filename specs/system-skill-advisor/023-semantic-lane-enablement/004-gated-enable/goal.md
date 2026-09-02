---
title: "Goal: Gated Enable"
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
    packet_pointer: "system-skill-advisor/023-semantic-lane-enablement/004-gated-enable"
    last_updated_at: "2026-09-03T00:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-023-004-gated-enable"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Gated Enable

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE. Keep it short, because goal surfaces cap what
> they hold, and a truncated objective loses its tail, where the criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Run the semantic lane at the researched weight, prove it cost nothing the project measures, and keep the revert to one command.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The environment override is the switch. The committed default moves only after the override has held |
| D2 | Every measurement reads the resolved weights back first, because a malformed override is silently ignored |
| D3 | The revert is executed once and recorded, never merely described |
| D4 | Gate B must reach 30 of 172, and anything below 20 of 172 reverts |
| D5 | A green ratchet is necessary and not sufficient, because its baseline is captured on fixture vectors |
| D6 | A rise in abstain failures or a lost control prompt is a revert trigger, not a note |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these verbatim into the objective. Nothing dereferences a path.

- [ ] `advisor_status` reports resolved lane weights equal to the intended set, and no runtime file changed
- [ ] `npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts` exits 0 with no metric below baseline
- [ ] The frozen 180-row corpus reports at least 30 of 172 reaching their intended mode first
- [ ] Five named canary prompts each return their intended hub at `recommendations[0]`
- [ ] The 224 out-of-scope controls lose no prompt and the abstain counts do not rise
- [ ] Unsetting the override and restarting returns every recorded metric to its pre-enable value
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
| Pre-enable numbers recorded | Pending | None yet |
| Override applied and read back | Pending | None yet |
| Gates measured | Pending | None yet |
| Revert exercised | Pending | None yet |

### Deviations and findings

| Item | Note |
|------|------|
| The switch already exists | The lane registry reads a per-lane weight override from the environment, merges it over the defaults and clamps each value between zero and one |
| A malformed override is silent | An unparseable value falls back to the defaults without an error, so a run that skips the read-back can confidently measure no change |
<!-- /ANCHOR:log -->
