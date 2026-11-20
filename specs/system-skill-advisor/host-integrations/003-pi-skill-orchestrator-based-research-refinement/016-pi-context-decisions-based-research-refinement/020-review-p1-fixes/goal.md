---
title: "Goal: Phase 20: review-p1-fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "review p1 fixes goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/020-review-p1-fixes"
    last_updated_at: "2026-11-20T11:52:43Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-020-review-p1-fixes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 20: review-p1-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** The three P1 defects the 019 deep review confirmed are fixed and proven: a running daemon reaches full vector coverage after every reindex, the recommend path never opens the skill-graph database read-write, and `advisor_status` reports the semantic lane the way the scorer treats it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only the three confirmed P1 defects are fixed; the review's P2 advisories stay in its report |
| D2 | Each fix lands with a test seen failing on main `03c7fb56e47` before the fix |
| D3 | Status follows the scorer: incomplete coverage reports `incomplete_skill_vectors` and `laneEnabled: false` |
| D4 | Work happens on the existing branch `worktrees/480-ollama-lane-honest-and-closeout`; commit, merge to main and push are approved |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `npx vitest run tests/skill-graph/refresh-in-background.vitest.ts tests/scorer/semantic-shadow-cosine.vitest.ts tests/handlers/advisor-status.vitest.ts` exits 0 from `.skilled/skills/system-skill-advisor/runtime`
- [x] `npx vitest run` exits 0 from `.skilled/skills/system-skill-advisor/runtime` after `node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted`
- [x] `rg -n 'embeddingCoverage\(\)' .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts` prints nothing
- [ ] `git merge-base --is-ancestor worktrees/480-ollama-lane-honest-and-closeout origin/main` exits 0
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/*/003-pi-*/016-pi-*/020-* --strict` prints `RESULT: PASSED`, and `acceptance-criteria.md` there has no `Unmet` row
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
| Plan | Done | spec, plan, tasks and acceptance criteria written by `/speckit:plan`; strict `RESULT: PASSED` |
| Fixes and tests | Done | c411bcc842c; three suites 50 passed (46 before), each new test failed on the old source; full suite 2559 passed 8 skipped; typecheck 0; @review APPROVED, P2-1 and P2-3 applied, P2-2 deferred |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | - |
<!-- /ANCHOR:log -->
