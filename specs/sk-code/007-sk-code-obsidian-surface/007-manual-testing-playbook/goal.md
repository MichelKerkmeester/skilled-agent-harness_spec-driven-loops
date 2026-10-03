---
title: "Goal: sk-code-obsidian Manual Testing Playbook"
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
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/007-manual-testing-playbook"
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
# Goal: sk-code-obsidian Manual Testing Playbook

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Author a routing-recall manual testing playbook under `sk-code-obsidian/manual-testing-playbook/`, a root index plus scenarios `OB-001` to `OB-007` in `sk-code-mobile-cli`'s playbook shape, covering the surface's five real intents with every expected resource grounded in the live packet tree.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase writes only under `sk-code-obsidian/manual-testing-playbook/`. `SKILL.md`, `README.md`, `references/`, `assets/` and every hub routing file stay untouched. |
| D2 | The stale filenames in `SKILL.md` §2b are recorded in the index and the affected scenarios' failure triage, never silently corrected. |
| D3 | Scenarios validate which evidence loads, not plugin behavior. This phase authors the corpus and runs no benchmark. |
| D4 | `IMPLEMENTATION` and `CODE_QUALITY` are the two doubled intents. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `manual-testing-playbook.md` and seven scenario files `OB-001` to `OB-007` exist under `sk-code-obsidian/manual-testing-playbook/`
- [x] `IMPLEMENTATION` and `CODE_QUALITY` each appear in two scenarios, and `DEBUGGING`, `VERIFICATION` and `STACK_STANDARDS` each appear in one
- [x] Every scenario's frontmatter parses with `id`, `category`, `title`, `description`, `expected_surface: OBSIDIAN`, `expected_intent`, `expected_resources` and `version: 1.0.0.0`
- [x] A `test -e` loop over all 23 `expected_resources` paths finds every one under `sk-code-obsidian/`
- [x] The root index table and every scenario's frontmatter agree on ID, intent and filename
- [x] The root index's `MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` points at `sk-code-obsidian/benchmark/reports/<dated-run-label>/`
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
| Index and seven scenarios drafted | Done (2026-08-28) | `tasks.md` T010 to T017 |
| Resource paths, index agreement, citation re-check, write boundary | Done | `tasks.md` T020 to T025, CHK-020 to CHK-022 |
| Phase status | Complete | `spec.md` metadata and `implementation-summary.md` |

### Deviations and findings

| Item | Note |
|------|------|
| `SKILL.md` §2b `RESOURCE_MAP` drift | Six names in `SKILL.md` §2b do not exist in the shipped tree; the correction is deferred because `SKILL.md` is outside this phase's boundary |
| Persistence contract criterion | `tasks.md` records drafting the retargeted contract (T010) but no separate check of it |
| Reconstructed summary | `implementation-summary.md` was rebuilt from `tasks.md`; its results are quoted, not re-run |
<!-- /ANCHOR:log -->
