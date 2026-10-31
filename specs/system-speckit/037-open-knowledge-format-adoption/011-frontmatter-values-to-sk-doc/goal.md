---
title: "Goal: Phase 11: frontmatter-values-to-sk-doc"
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
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/011-frontmatter-values-to-sk-doc"
    last_updated_at: "2026-10-04T19:45:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "All six criteria met"
    next_safe_action: "Operator reviews the diff and decides the commit"
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
# Goal: Phase 11: frontmatter-values-to-sk-doc

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Move the document contextType values and the importance_tier values into sk-create-frontmatter, keep the session list in system-spec-kit, and leave every check giving the result it gave before. Done when: sk-create-frontmatter/assets/frontmatter-values.json holds the old document values, document aliases, tiers and tier aliases and no session list; the old system-spec-kit/shared/frontmatter-values.json is gone and no live file outside specs/ names it; context-types.ts exports the baseline values from source and from dist, with SESSION_CONTEXT_TYPES as the same 11-value literal; the shared tests, CLI vitest, sk-doc Python tests and advisor checker each pass with no fewer passing tests than their baseline; with the file missing, the TypeScript module, rule helper and advisor checker name the new path and validate_document.py stays silent; phase 008's corpus sweep gives both checkers the same warnings as their baseline, line for line.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The values and aliases move unchanged. |
| D2 | The session list stays in system-spec-kit. |
| D3 | No existing spec doc is rewritten. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] sk-create-frontmatter/assets/frontmatter-values.json holds the old document values, document aliases, tiers and tier aliases and no session list
- [x] the old system-spec-kit/shared/frontmatter-values.json is gone and no live file outside specs/ names it
- [x] context-types.ts exports the baseline values from source and from dist, with SESSION_CONTEXT_TYPES as the same 11-value literal
- [x] the shared tests, CLI vitest, sk-doc Python tests and advisor checker each pass with no fewer passing tests than their baseline
- [x] with the file missing, the TypeScript module, rule helper and advisor checker name the new path and validate_document.py stays silent
- [x] phase 008's corpus sweep gives both checkers the same warnings as their baseline, line for line
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
| Phase opened | Done | spec, plan, tasks, acceptance criteria and decision record written |
| Move and verification | Done | 8/8 AC; every check identical to `scratch/baseline/` |

### Deviations and findings

| Item | Note |
|------|------|
| Corpus criterion | Changed from "0 warnings" to "same as baseline" before the move: the baseline holds 7 warnings, all in phase 008's off-list model-writer docs |
| Missing-file criterion | Narrowed before the move: `validate_document.py` stays silent by design, so only the other three readers must fail |
<!-- /ANCHOR:log -->
