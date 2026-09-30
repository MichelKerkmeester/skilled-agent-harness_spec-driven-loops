---
title: "Goal: Phase 39: hub-cleanup"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "cli classifier hub cleanup goal"
  - "cli usage to cli jev rename goal"
  - "pre-release versions goal"
  - "cli deem playbook goal"
  - "hub cleanup criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/039-hub-cleanup"
    last_updated_at: "2026-09-30T16:40:00Z"
    last_updated_by: "markdown-leaf"
    recent_action: "Authored the durable directive as a Planned phase"
    next_safe_action: "Build the phase against the completion criteria"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/039-hub-cleanup/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/039-hub-cleanup/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-039-hub-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 39: hub-cleanup

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the cli-classifier hub say what it is: a `cli-jev` folder for the Jev mode, pre-release versions everywhere, and a testing playbook for each transport.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Rename `cli-usage` to `cli-jev` with `git mv`. `cli-usage` stays a routing alias so old prompts still route |
| D2 | No cli-classifier skill, mode or README reaches `1.0.0.0`. Each line continues under `0.x` by the mapping in context.md, and changelog history is kept |
| D3 | Live references move to the new path after each is read. Closed spec folders keep their history |
| D4 | cli-deem's playbook needs no served model: every scenario runs on stubs or a refused call |
| D5 | Routing, leaf manifest and Hermes copies are regenerated, never hand-edited |
| D6 | Executors follow parent D5: DeepSeek writes, MiMo reviews, no Claude workers. Fix P0 and P1, record P2 |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `.skilled/skills/cli-classifier/cli-jev/SKILL.md` exists, `cli-usage/` does not, and a `cli-usage` prompt still routes to mode `cli-jev`
- [ ] A grep for `cli-classifier/cli-usage` outside `specs/` and benchmark reports finds nothing
- [ ] A grep over every cli-classifier version field finds no value at or above `1.0.0.0`
- [ ] `validate-playbook-package.cjs` prints PASS on `cli-deem/manual-testing-playbook`
- [ ] `compiled-route-guard.cjs`, `ci-leaf-manifest-freshness.cjs`, `parent-skill-check.cjs` and `sync-skills-hermes.cjs --check` pass, and `validate.sh --strict` passes for this phase
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
| Spec authored | Done | 2026-09-30, docs only, from `scratch/context/context.md` and `scratch/context/refs.txt`, the operator's ask and the choices "Rename to cli-jev (Recommended)" and "Continue each line (Recommended)". Status Planned, Level 2, priority P1. No build exists |

### Deviations and findings

| Item | Note |
|------|------|
| Planned state (2026-09-30) | At authoring, nothing is built and the five completion criteria are open. This phase runs before 038's build because both touch the same packet, and the repoint covers 038's Planned docs so its build reads `cli-jev` |
| Version scope | The authoring grep found 71 version fields at or above `1.0.0.0` under `.skilled/skills/cli-classifier/`, more than the lines context.md enumerates. The design pass fixes the full table before the first edit (D2) |
| Proposed README mapping | The README version lines follow the same continuation but are marked proposed in context.md. The design pass fixes them with the rest of the table |
| Phase 040 | The `hard_rules` sidecar move is out of scope and belongs to 040. This phase only repoints the dispatch registry path that reads the rules |
<!-- /ANCHOR:log -->
