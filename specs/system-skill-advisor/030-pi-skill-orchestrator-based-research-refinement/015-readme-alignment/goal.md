---
title: "Goal: README Alignment for the Root and Skill Advisor READMEs"
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
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/015-readme-alignment"
    last_updated_at: "2026-09-28T16:26:28Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed the confirmed drift in both READMEs and rechecked every fix at its source"
    next_safe_action: "None. The commit and the push close the phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-28-030-phase-015"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: README Alignment for the Root and Skill Advisor READMEs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The root README and the skill advisor README describe the repository as it is, with every drift the check found fixed or recorded.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A claim changes only after its cited source confirms the drift. A judgment call stays as written, with its reason in the ledger. |
| D2 | Fixes change what a claim says, never the README structure. Voice work is limited to the hard HVR blockers in the two files. |
| D3 | Drift in any other document is recorded as a follow-up, not fixed. |
| D4 | No file another session has changed is staged. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Every row in `015-readme-alignment/evidence/claim-ledger.md` is marked fixed and rechecked, kept with a reason or recorded as a follow-up
- [ ] `validate_document.py --type readme` reports zero issues on `README.md` and on `.skilled/skills/system-skill-advisor/README.md`
- [ ] `hvr_scan.py` reports `hard blockers: 0` on both READMEs
- [ ] `frontmatter-version.mjs compute` derives the `version` the advisor README carries
- [ ] `validate.sh` on packet 030 with `--strict --recursive` prints `RESULT: PASSED` for every folder
- [ ] The changes are committed and pushed to origin/main
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
| Phase opened | Done | Scaffolded with `create.sh` at Level 1. `recommend-level.sh --loc 150 --files 2` returned level 0, so Level 1 is the floor |
| Baselines | Done | Both READMEs valid with zero issues. HVR: one hard blocker in the root README, four in the advisor README (`evidence/baselines.txt`) |
| Claim check | Done | Four agents checked 404 root README claims and the orchestrator checked the advisor README and the root Skill Advisor section |
| Drift fixed | Done | 70 root README ledger rows and four advisor README items fixed, eight claims kept with a reason, five follow-ups recorded (`evidence/claim-ledger.md`) |
| Rechecks and gates | Done | 48 of 48 source rechecks pass. Both READMEs are valid with zero issues and zero hard HVR blockers (`evidence/final-checks.txt`) |

### Deviations and findings

| Item | Note |
|------|------|
| Parent goal budget | The 015 binding row pushed the parent slice past 4,000 characters, so D3's second sentence moved to the parent log under step 5 of the cut order |
<!-- /ANCHOR:log -->
