---
title: "Goal: Phase 4: hub-doc-pointers"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hub doc pointers goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/004-hub-doc-pointers"
    last_updated_at: "2026-10-10T21:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Reran every completion criterion from the final state"
    next_safe_action: "Commit the child"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-012-004-hub-doc-pointers"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: hub-doc-pointers

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the sk-code hub docs name the legacy shell PostToolUse hook as legacy and point at the live hook, and make the stack detection table cite only files that exist.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | TH-001 and TH-002 keep testing the `.sh`, and only their description and overview wording change. |
| D2 | The dead path in `stack-detection.md` becomes `.skilled/skills/sk-doc/scripts/frontmatter-version.mjs`, and hypothetical prompts that name a preview server stay. |
| D3 | The hub moves to 2.2.8.0 in all six carriers with `changelog/v2.2.8.0.md`, a re-mint and a Hermes copy. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n 'shared Claude Code PostToolUse|shared PostToolUse|shared .claude-posttooluse' .skilled/skills/sk-code/manual-testing-playbook/tooling-and-hooks .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` prints nothing.
- [ ] `rg -n preview-server .skilled/skills/sk-code/shared/references/stack-detection.md` prints nothing, and `test -e .skilled/skills/sk-doc/scripts/frontmatter-version.mjs` exits 0.
- [ ] `rg -n '2\.2\.8\.0' .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/README.md .skilled/skills/sk-code/ROUTER.md .skilled/skills/sk-code/description.json .skilled/skills/sk-code/hub-router.json .skilled/skills/sk-code/mode-registry.json` prints six lines.
- [ ] `node .skilled/bin/compiled-route-guard.cjs` prints `sk-code` as `fresh`, and `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS: 70 Hermes skill copies in sync`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review/004-hub-doc-pointers --strict` prints `RESULT: PASSED`.
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
| Stale wording gone | Passed | `rg` printed nothing |
| Dead path gone | Passed | `rg` printed nothing, target exists |
| Six carriers at 2.2.8.0 | Passed | `rg` printed six lines |
| Route guard and Hermes | Passed | `sk-code fresh` after the commit's re-mint, Hermes in sync |
| Strict validation | Passed | `RESULT: PASSED` |

### Deviations and findings

| Item | Note |
|------|------|
| Playbook root wording | The builder placed the parenthetical between "hook's" and "two warn-only banner branches". The orchestrator reordered the clause so the sentence reads cleanly |
<!-- /ANCHOR:log -->
