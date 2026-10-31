---
title: "Goal: Phase 10: source-tag-hardening"
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
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/010-source-tag-hardening"
    last_updated_at: "2026-10-04T12:00:35Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All seven criteria met"
    next_safe_action: "None"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: source-tag-hardening

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make a SOURCE_TAGS warning mean the same thing wherever it runs, with measured accuracy and recall per class. Done when: measurement-protocol.md names every sample size, the seed, the ground-truth rule per class, the planted classes and every threshold, and its timestamp precedes every result file; a tag citing REPO RULES.md:88 resolves and a test covers it; a tag under a gitignored folder gets the same result with the file present and absent, and tests cover both; accuracy per class on a stratified sample drawn after the fixes is recorded with a Wilson 95% interval against the protocol threshold; recall per class on a planted lineage of known bad tags is recorded; the 20 comparison packets give identical warnings in the worktree and the main checkout at one commit; with the default cutoff, no existing packet changes its validation result.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The rule stays warn-only and skips packets created on or before the cutoff. |
| D2 | The rule reuses the shared citation resolver and defines no copy. |
| D3 | No sample size, seed or threshold changes once the first result file exists. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] measurement-protocol.md names every sample size, the seed, the ground-truth rule per class, the planted classes and every threshold, and its timestamp precedes every result file
- [x] a tag citing REPO RULES.md:88 resolves and a test covers it
- [x] a tag under a gitignored folder gets the same result with the file present and absent, and tests cover both
- [x] accuracy per class on a stratified sample drawn after the fixes is recorded with a Wilson 95% interval against the protocol threshold
- [x] recall per class on a planted lineage of known bad tags is recorded
- [x] the 20 comparison packets give identical warnings in the worktree and the main checkout at one commit
- [x] with the default cutoff, no existing packet changes its validation result
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
| Phase opened | Pending | spec, plan, tasks and acceptance criteria written |
| phase 010-source-tag-hardening measurement | Open on operator | see implementation-summary.md |
| phase 010 | Complete | 7/7 AC; runtime overage accepted in ADR-001; one-commit comparison identical |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
