---
title: "Goal: Phase 10: verification-and-release"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "verification and release goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/010-verification-and-release"
    last_updated_at: "2026-10-30T05:21:21Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-010-verification-and-release"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 10: verification-and-release

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove on the final tree that `/doctor:sk-skill` converts both supported input kinds end to end while every shipped skill, routing baseline and CI check stays where it was, and record the release.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Scratch conversions run only in the temp-repo harness, never in the real `.skilled/skills/`. |
| D2 | A moved baseline stops the release and reopens the phase that caused it; this phase fixes nothing itself. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `package_skill.py --check --strict` gives every shipped skill the same verdict as the phase 1 baseline
- [ ] `capture-scorer-eval-baseline.mjs` reads 155/195, 49/66 and 19/24, and `leaf-route-replay.cjs | grep ^total` prints `total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50`
- [ ] `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0 with every suite PASS
- [ ] A scratch plain skill and a scratch pre-migration skill each end convert with strict PASS and a resolving `.skilled/changelog/<name>` link
- [ ] `validate_document.py .skilled/commands/doctor/sk-skill.md --type command` exits 0, and `/doctor:setup` lists both `/doctor:sk-skill` targets
- [ ] Every CI run for the merge commit on main concludes `success` or is switched off
- [ ] A new framework entry under `.skilled/changelog/skilled/` passes `validate_document.py --type changelog`
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
| Baselines read | Done | 2026-10-30 at `66157ee7e6`: replay `total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50`; scorer 155/195, 49/66, 19/24 |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | No verification run has started |
<!-- /ANCHOR:log -->
