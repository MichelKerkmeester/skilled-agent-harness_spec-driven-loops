---
title: "Goal: Phase 25: release-notes-and-doc-sync"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "release notes and doc sync goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/025-release-notes-and-doc-sync"
    last_updated_at: "2026-11-14T12:45:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the durable directive"
    next_safe_action: "Run T001 once phases 019 to 024 are Complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-025-release-notes-and-doc-sync"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 25: release-notes-and-doc-sync

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Make the advisor's open release notes and its reference pages say what the advisor does after the offer guards, the head parity, the workflow measure and the review fixes, with no number a closed phase did not print.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The open entry `v1.1.0.0.md` is extended. No new version is written while `origin/main` ships 1.0.0.0, and the phase stops when that is no longer true. |
| D2 | Every number, file name and behaviour sentence comes from `scratch/release-facts.txt`, which is copied from the closed phases at build time. The plan holds no result number. |
| D3 | No sentence says the brief makes a model follow a correct workflow more often. The entry states what the measure counts and its limits. |
| D4 | Documents only: seven files. No code, test, version carrier, published release or root release note. |
| D5 | Each doc task routes through the `sk-doc` mode that owns its page. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] `python3 .skilled/skills/sk-doc/sk-create-changelog/scripts/check_changelog_shape.py .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md` prints `SUMMARY files=1 pass=1 fail=0`.
- [ ] `rg -c -e '^## (Command Fit|One Head on Every Runtime|Workflow Measure)$' .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md` prints 3.
- [ ] `rg -c -F '17 cases' .skilled/skills/system-skill-advisor/runtime/tests/README.md .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md` prints nothing.
- [ ] `rg -c -F 'Also: /doctor:<command> <target> (<policy>)'` prints 1 for `feature-catalog/scorer-fusion/doctor-command-routing.md` and 1 for `runtime/scripts/command-bridges/README.md` under `.skilled/skills/system-skill-advisor/`.
- [ ] `scratch/fact-check.txt` holds no line that starts `UNTRACED` and one line `verifier: PASS`.
- [ ] `git -c core.fsmonitor=false diff --name-only <start commit> -- . ':!specs'` names seven files, all Markdown under `.skilled/skills/system-skill-advisor/`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/025-release-notes-and-doc-sync --strict` prints `RESULT: PASSED` with the phase status Complete.
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
| Phase planned | Done | 2026-11-14, at commit 47577daa6f |
| The entry at planning | Recorded | `wc -l` printed 168 of 280 lines, 9 section tags of 14, 17 items of 32. `origin/main` prints `version: 1.0.0.0`, the working tree `1.1.0.0` |
| Stale statements | Recorded | `17 cases` in two pages, the companion line with no policy word in two pages, `only the top pick can carry` in the advisor recommend page and no `commandOnlyMentioned` in the lib README |
| Level | Decided | `recommend-level.sh --loc 220 --files 8` printed Level 1. Level 2 chosen because the closure gate is `acceptance-criteria.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Check scripts not run at planning | The planning session could not run `python3`, so the lines `PASS` and `SUMMARY files=1 pass=1 fail=0` are read from `check_changelog_shape.py` itself. T001 runs every check before the first edit |
| Waits on the operator | Whether the amended root release note also gains phases 019 to 024. Recommendation in `spec.md` |
<!-- /ANCHOR:log -->
