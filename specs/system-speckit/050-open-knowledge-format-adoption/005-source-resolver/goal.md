---
title: "Goal: Phase 5: source-resolver"
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
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/005-source-resolver"
    last_updated_at: "2026-10-04T09:20:00Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Added the operator UX and command-surface criterion"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-04-speckit-050"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: source-resolver

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Catch missing and stale [SOURCE:] tags mechanically in new research and review docs, with a warn-only rule. Done when: the rule entry in validator-registry.json has warn severity and runs only on packets newer than the recorded cutoff; a fixture with an invented line number produces a warning, a clean fixture none, and a packet with no [SOURCE:] tags stays green; the rule output states that a pass means the path and line exist and nothing more; the rule imports the phase 004 resolver and no second copy exists; 20 existing packets recorded in the phase notes return identical validate.sh --strict results before and after, and description.json and graph-metadata.json are unchanged by the rule; a fresh /deep:research fixture lineage with one invented tag gets exactly one warning naming the tag, its class and, if moved, its new path.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Authored spec docs are untouched and packets older than the recorded cutoff are skipped. |
| D2 | Hand-typed sources frontmatter is not built. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] the rule entry in validator-registry.json has warn severity and runs only on packets newer than the recorded cutoff
- [x] a fixture with an invented line number produces a warning, a clean fixture none, and a packet with no [SOURCE:] tags stays green
- [x] the rule output states that a pass means the path and line exist and nothing more
- [x] the rule imports the phase 004 resolver and no second copy exists
- [x] 20 existing packets recorded in the phase notes return identical validate.sh --strict results before and after, and description.json and graph-metadata.json are unchanged by the rule
- [x] a fresh /deep:research fixture lineage with one invented tag gets exactly one warning naming the tag, its class and, if moved, its new path
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
| Phase opened | Done | plan.md and tasks.md written |
| SOURCE_TAGS rule built and registered at warn | Done | implementation-summary.md:115-121 |
| 20-packet comparison, default and forced cutoff | Done | scratch/p005-comparison.json |
| CLI suite | Done | 1660 passed, exit 0 (implementation-summary.md:125) |

### Deviations and findings

| Item | Note |
|------|------|
| Plan written alongside the build | The plan and tasks were authored during the build, not before it (implementation-summary.md:91) |
<!-- /ANCHOR:log -->
