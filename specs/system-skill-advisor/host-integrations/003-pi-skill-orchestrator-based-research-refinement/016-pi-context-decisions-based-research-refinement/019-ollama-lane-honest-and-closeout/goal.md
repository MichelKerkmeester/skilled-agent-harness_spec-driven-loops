---
title: "Goal: Phase 19: ollama-lane-honest-and-closeout"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "ollama lane honest and closeout goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout"
    last_updated_at: "2026-11-19T17:05:15Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-019-ollama-lane-honest-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 19: ollama-lane-honest-and-closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Nothing from phases 014 to 018 is left open: the Ollama lane is correct and its weight rests on a fresh measurement, every recorded gap is fixed or explained, and both alignment checks clear the change before it lands.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Full, current vector coverage for every embeddable skill and command, kept by the daemon at any lane weight, with the doctor checks reading it; plus the coverage gate, outage as degraded and `OLLAMA_*` forwarding |
| D2 | Ablation pass bar: more correct with the lane and no new none-gold fire; pass sets 0.05, fail keeps 0 |
| D3 | Write all 231 orphan answers from ended sessions, one commit per spec track, after verifying the inferred mappings |
| D4 | `system-spec-kit/shared/embeddings` is not changed |
| D5 | Commit, merge to main and push are approved |
| D6 | Before the merge, `/local-skilled-alignment` runs over the committed branch and `/local-doc-alignment` over a new advisor-vector topic; each finding is fixed or accepted with a reason |
| D7 | Stop only the `ollama serve` this phase started |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `npx vitest run` exits 0 from `.skilled/skills/system-skill-advisor/runtime`, and from `.skilled` with `--config vitest.config.bin.ts`
- [x] `implementation-summary.md` records two matching ablation summaries and the default weight that follows from them
- [x] `node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/match-decision-table.js --scan-orphans` lists no ended session that was not skipped with a reason
- [x] `ls specs/system-skill-advisor/*/003-pi-*/016-pi-*/019-*/evidence/{skilled,doc}-alignment/report.md` lists two files, and `implementation-summary.md` names each finding in both reports as fixed or accepted with a reason
- [x] `git merge-base --is-ancestor worktrees/480-ollama-lane-honest-and-closeout origin/main` exits 0
- [x] On main, `node .skilled/bin/skill-advisor.cjs advisor_status --workspace-root "$PWD" --include-semantic-health true --format json` shows `coverageComplete: true`, with `embedded` equal to `total` for skills and for commands
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/*/003-pi-*/016-pi-*/019-* --strict` prints `RESULT: PASSED`, and `acceptance-criteria.md` there has no `Unmet` row
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
| Spec docs | Done | written 2026-11-19 |
| Criteria evidence | Done | 1: runtime 2555 passed 8 skipped, bin 94, on main; 2: runs 8 and 9 match runs 3 to 7, weight 0; 3: only held answers and live session 91021a9f; 4: two reports, ALL_IDS_PRESENT; 5: exit 0 at 63b338c07ff; 6: 15/15 and 47/47, coverageComplete true; 7: RESULT PASSED, no Unmet row |
| Build, ablation, docs, orphan answers | Done | All five suites green on the final tree: runtime 2553 passed 6 skipped, Python 122, bin 94, spec-kit 202, DSH 18 |
| Finalization | Done | merged 519b2b1ef8e and 71acd3069ef, pushed; main 15/15 and 47/47 current; both alignment runs closed; suites green with and without Ollama |

### Deviations and findings

| Item | Note |
|------|------|
| Amended 2026-11-19 | Operator: "Create goal for all open work / Also add /local-doc-alignment and /local-skilled-alignment to goal for finalization". Added D6, D7 and criteria 4, 6 and 7 |
| Amended 2026-11-20 | Criterion 6's command lacked `--workspace-root`, which `advisor_status` requires (exit 64); the argument is added and the check is unchanged |
<!-- /ANCHOR:log -->
