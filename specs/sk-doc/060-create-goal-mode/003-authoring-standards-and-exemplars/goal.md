---
title: "Goal: Phase 3: Goal Authoring Standards and Exemplars"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "goal authoring standards"
  - "goal objective rubric"
  - "goal completion criteria"
  - "goal corpus exemplars"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/060-create-goal-mode/003-authoring-standards-and-exemplars"
    last_updated_at: "2026-09-25T19:30:00Z"
    last_updated_by: "gpt-6-luna"
    recent_action: "Planned goal standards and corpus checks"
    next_safe_action: "Execute phase 3 against its completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-authoring-standards-and-exemplars"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: Goal Authoring Standards and Exemplars

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This phase goal states the work that its completion criteria judge.
> Its objective is one sentence, its decisions are phase-local and its log stays
> outside the durable directive.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give sk-create-goal a reader-checkable quality bar for packet objectives, frozen decisions, completion evidence, volatile notes and human voice.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Store the standards in references/authoring-standards.md and the corpus examples in assets/goal-exemplars.md. |
| D2 | Each standard names the failure it prevents and gives the author or reviewer a check they can apply. |
| D3 | Keep every exemplar tied to its original source path and verified line range. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets. Each answer is an exit code, a count or a named artifact, and none depends on opening another file.

- [ ] references/authoring-standards.md contains five standards, each with its failure, reader check and a cited real goal example.
- [ ] assets/goal-exemplars.md records 3/3 known-bad examples as failures and 1/1 known-good child objective as a pass, with verified path:line citations.
- [ ] The mode reference index and skill workflow link to or load the standards and exemplar set.
- [ ] Strict validation on this phase folder prints RESULT: PASSED after generated metadata is refreshed.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied into the objective, and it is expected to grow. Progress, evidence, deviations and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase planned | Done | this folder's spec.md, plan.md, tasks.md |
| Standards | Done | `references/authoring-standards.md`: five standards, each with failure, reader check and cited example |
| Exemplars | Done | `assets/goal-exemplars.md`: 3/3 known-bad FAIL, 1/1 known-good PASS, all citations re-opened |
| Wiring | Done | `references/README.md` and `SKILL.md` load both files |
| Strict validation | Done | `RESULT: PASSED` on 2026-09-25 |

### Deviations and findings

| Item | Note |
|------|------|
| Worker lane | GPT-6 Luna at xhigh on the pi gateway lane; the Codex plan is at its usage limit. |
| Exemplar quotes | Each exemplar quotes its excerpt inline, so it stays readable if the source packet moves. |
| HVR scope | `hvr_scan.py` scores the mechanical rules only; rhythm, significance inflation and the other judgment rules were read, not scored. |

<!-- /ANCHOR:log -->
