---
title: "Goal: sk-code-obsidian SKILL.md and README.md"
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
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/004-skill-core"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "None; every criterion is met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-03-child-goal-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: sk-code-obsidian SKILL.md and README.md

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Author `sk-code-obsidian/SKILL.md` and `README.md` in the `sk-code` hub so they mirror `sk-code-mobile-cli`'s section grammar, frontmatter and file structure while every factual claim describes the Obsidian Note Database plugin as measured in `audit.json` and designed in `mode-design-plan.md`.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase creates only `SKILL.md` and `README.md` under `sk-code-obsidian/` and touches no hub routing file. |
| D2 | `SKILL.md` §3b keeps the plugin's measured current state apart from the target conventions a later phase adopts, and never presents a target convention as shipped. |
| D3 | Traps and open P0/P1 items are recorded as evidence with no proposed fix. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `SKILL.md` and `README.md` exist under `$HUB/.opencode/skills/sk-code/sk-code-obsidian/` and no other file was created there by this phase
- [x] `SKILL.md` frontmatter carries `name: sk-code-obsidian`, `allowed-tools: [Read, Bash, Grep, Glob]` and `version: 0.1.0.0`, and parses against the `sk-create-skill` contract
- [x] `SKILL.md` sections run `1`, `2`, `2b`, `3`, `3b`, `4`, `5`, `6` with the same titles as `sk-code-mobile-cli/SKILL.md`, and `README.md` carries its eight sections from `AT A GLANCE` to `RELATED DOCUMENTS` in order
- [x] `SKILL.md` §2b holds a Python block defining `DEFAULT_RESOURCE`, `INTENT_SIGNALS` and `RESOURCE_MAP`
- [x] A grep of both files for `svelte`, `runes` and `scoped style` returns no match
- [x] Neither file contains a phase number, requirement id, task id or checklist id
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
| Both files authored section by section | Done (2026-08-28) | `tasks.md` T010 to T016 |
| Header parity, number re-check, grep, write boundary | Done | `tasks.md` T020 to T024, CHK-020 to CHK-023, CHK-050 |
| Phase status | Complete | `implementation-summary.md` metadata |

### Deviations and findings

| Item | Note |
|------|------|
| Status wording | `spec.md` metadata reads `Done` while `implementation-summary.md` reads `Complete` |
| Reconstructed summary | `implementation-summary.md` was rebuilt from `tasks.md`; its results are quoted, not re-run |
<!-- /ANCHOR:log -->
