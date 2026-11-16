---
title: "Goal: Phase 4: hook-readme-fold-and-rewrite"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hook readme fold and rewrite goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite/004-hook-readme-fold-and-rewrite"
    last_updated_at: "2026-11-15T14:58:53Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-goal-hook-library-cleanup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: hook-readme-fold-and-rewrite

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Every README under `.skilled/hooks/` describes real code and reads in one pass, and no README is left for a folder that holds only symlinks.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No code changes. Paths, flags, events and numbers in a README stay byte-exact. |
| D2 | Every rewrite follows `sk-create-readme`, `readme-code-template.md` and the human voice rules. |
| D3 | Vibe CLI workers on `deepseek-flash` draft the READMEs, with cli-opencode on OpenCode Go as fallback, and the orchestrating session briefs and reviews each one. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `python3 -c "print([str(r.parent) for r in __import__('pathlib').Path('.skilled/hooks').rglob('README.md') if all(c.is_symlink() for c in r.parent.iterdir() if c.name != 'README.md')])"` prints `[]`
- [ ] `ls .skilled/hooks/ask-surface-guard/README.md .skilled/hooks/decision-capture/README.md` exits 0
- [ ] For every `README.md` under `.skilled/hooks/`, `.skilled/skills/sk-doc/shared/scripts/validate_document.py` prints `VALID` and `hvr_scan.py` reports `hard blockers: 0`
- [ ] `scratch/readme-gates.py fold` in this phase folder prints `FOLD missing=0`: each link in a folder that holds only links is named as `<runtime>/<file>` in the README one level up
- [ ] `readme-metrics.py` in the parent's `scratch/` folder, run over `.skilled/hooks` and the five session-handover documents, prints `FAIL` for no file except `.skilled/hooks/skill-advisor/README.md`
- [ ] `validate.sh --recursive --strict` on the parent packet prints `RESULT: PASSED`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Goal authored | Done | `/create:goal` run on 2026-11-15 from this phase's `spec.md` |
| Phase planning | Pending | |
| Phase planning | Done | /speckit:plan run on 2026-11-15. spec.md, plan.md, tasks.md and acceptance-criteria.md hold no unfilled token |
| Criteria amended at planning | Done | Six criteria. New criteria cover the fold check of REQ-004 and the sentence metrics of REQ-005, which names skill-advisor/README.md as the one file that may fail |
| Phase 004 close-out | Blocked on T021 | T084-T086 done, 15/15 AC Met, review APPROVED, recursive strict PASSED; env-secret-guard README needs the operator |
| Phase 004 close-out | done | T021 and CHK-011 closed after the operator's env-secret-guard README edit; G1-G7 pass, FOLD missing=0 |

### Deviations and findings

| Item | Note |
|------|------|
| Goal authored before the phase was planned | The objective, decisions and criteria come from the Phase Context and Handoff Criteria in this phase's `spec.md`, because its scope sections and `acceptance-criteria.md` were still scaffolds. Amend this goal when the phase is planned |
| No criterion for the sentence metrics | The Handoff Criteria point at targets in a plan that does not exist yet. Add them as a criterion when the plan sets them |
<!-- /ANCHOR:log -->
