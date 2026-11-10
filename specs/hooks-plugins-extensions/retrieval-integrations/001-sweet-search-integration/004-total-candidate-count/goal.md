---
title: "Goal: Phase 4: report total candidates in the trigger lookup"
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
    packet_pointer: "hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/004-total-candidate-count"
    last_updated_at: "2026-11-09T18:30:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "57bcd03f-32c4-439a-a610-ec91a7c3d3ba"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: report total candidates in the trigger lookup

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Make every truncated trigger-index lookup say how many documents ranked before the cut, and document the research-folder exclusion, shipped with docs, an alignment pass and a measured benchmark.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The human `candidates :` line changes only when truncated; untruncated output stays byte-identical. |
| D2 | `totalCandidates` is additive; exit codes do not change. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `npx vitest run` from `.skilled/skills/system-spec-kit` on `trigger-index.vitest.ts` and `retrieval-coverage-parity.vitest.ts` exits 0
- [x] A `--limit 2 --json` lookup for "spec folder validation strict" returns `totalCandidates` greater than 2
- [x] The six untruncated benchmark queries print byte-identical human output before and after
- [x] `validate_catalog_package.py` and `validate-playbook-package.cjs` exit 0 and scenario 489 exists
- [x] `/local-skilled-alignment` recheck on this phase's change shows 0 open P0 and P1 findings
- [x] `benchmark/results.md` shows 6/6 truncated answers stating a total and median time within 10% of before
- [x] `validate.sh` on this phase prints `RESULT: PASSED` and every `acceptance-criteria.md` row is `Met`
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
| Planning docs | Done | Level 2 spec, plan, tasks, acceptance criteria |
| Build, docs, alignment, benchmark | Done | Suite 4077 passed, 0 failed; recheck 0 still open; 6/6 totals; scenario 489 PASS |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | - |
<!-- /ANCHOR:log -->
