---
title: "Goal: Build: improve the Jev citation drift scan (032)"
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
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/003-citation-drift-improvements"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "All completion criteria met with evidence"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-049"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Build: improve the Jev citation drift scan (032)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build the recommendations 048 ranked for the Jev citation drift scan (032) that need no new labels, corpus or default-on switch, and record one re-measure.

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

- [x] `test-cite-drift-scan.mjs` passes, with cases for the min-rerun flag, hash refusal and stop branches
- [x] The census reads each document at most once on the fixture tree
- [x] The re-measure's verdict line and the amendment are in the log
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
| Phase opened | Done | Spec, plan, tasks and goal authored 2026-10-03 from 048's ranked table |
| Build | Done | Luna on cli-codex; suite 36 passed |
| Cross-family review | Done | DeepSeek on cli-pi: 1 P0 fixed (legacy label hashes), 1 P1 (re-measure, done below), 2 P2 recorded |
| Re-measure (2026-10-03) | Done | Amendment: flag on the lowest rerun, adaptive reruns near the line, live and constructed columns. `verdict jev: keep K=40 M=40 A=35 B=13 W=22 L=0 TP=26 FP=0 F=0 p=2.384e-7 labels_sha256=2cbfddfc199d`, 55 calls (40 screening, 14 adaptive, 1 auth). Live column A=19 B=13 W=6 L=0, sign test p=0.01563. Run folder `~/.skilled/.labels/runs/049-003-jev-20261003` |
| Validate | Done | `validate.sh --strict` RESULT: PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Claim unit per label row | Not in the original plan. Added to fix the review P0 without touching the committed labels file |
<!-- /ANCHOR:log -->
