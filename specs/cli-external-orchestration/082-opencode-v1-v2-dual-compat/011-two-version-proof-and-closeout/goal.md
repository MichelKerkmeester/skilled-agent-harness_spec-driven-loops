---
title: "Goal: Phase 11: two-version-proof-and-closeout"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "two version proof and closeout goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/011-two-version-proof-and-closeout"
    last_updated_at: "2026-10-18T12:45:11Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-011-two-version-proof-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 11: two-version-proof-and-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove the whole OpenCode v1 and v2 tree against the phase 001 baseline and the doctor battery on both pinned versions, then record the scoped compatibility claim and close the packet.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| Parent | Parent decisions D1 to D8 bind this phase. None is restated here. |
| L1 | A count compares only with `001-unknowns-and-baseline/baseline.json`, never with an earlier run in this phase. |
| L2 | The battery runs against the existing installs. No step in this phase changes an install or restarts a service. |
| L3 | A failing suite or battery goes back to the phase that owns the code. This phase changes no code. |
| L4 | The claim names only 1.19.3 and 2.0.32, with the date of the passing battery. |
| L5 | The orchestrator runs every test, probe and battery. The claim text goes to DeepSeek through cli-devin, and Luna reviews it through cli-codex, as parent D6 requires. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Every suite in `001-unknowns-and-baseline/baseline.json` passes at or above its recorded pass count
- [ ] The doctor battery exits 0 on OpenCode 1.19.3 and on OpenCode 2.0.32
- [ ] `validate.sh specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat --recursive --strict` prints `RESULT: PASSED`
- [ ] No acceptance row in phases 001 to 011 is Unmet, and every Met row carries evidence
- [ ] `.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md` contains the scoped claim with OpenCode 1.19.3, OpenCode 2.0.32 and the verification date
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
| Planning documents filled | Done | The six documents in this folder, written from the phase 011 brief and research sections 1, 8 and 11 |
| Whole-tree proof | Pending | None yet |
| Scoped claim | Pending | None yet |
| Reconciliation and recursive validation | Pending | None yet |

### Deviations and findings

| Item | Note |
|------|------|
| Claim executor | The brief names the orchestrator as the only executor for this phase. D6 routes doc writes to DeepSeek and review to Luna. The plan follows D6 for the claim text, and the open question in spec.md stays open until the orchestrator decides. |
<!-- /ANCHOR:log -->
