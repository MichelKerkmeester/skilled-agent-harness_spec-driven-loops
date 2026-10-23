---
title: "Goal: Phase 3: trigger-and-job-hygiene"
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
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene"
    last_updated_at: "2026-10-23T12:45:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-003-trigger-and-job-hygiene"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: trigger-and-job-hygiene

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Stop paying twice for the same CI verdict by giving every PR-triggered workflow one concurrency slot, by filtering the two workflows that re-check the whole tree to the files their checkers read, by removing the duplicate dispatch-audit step and one suppression layer from each report-only workflow, and by checking out only the history each job reads.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| G1 | The concurrency block is the same three lines in all 30 files and sits immediately above `jobs:`. `trigger-index-rebuild.yml` and `dependabot-auto-merge.yml` are not touched. |
| G2 | `cancel-in-progress` reads the event name, so a pull-request run is cancelled and a push or hand-run is not. |
| G3 | A filter names every file its checker reads, its own guard at both roots where a twin exists, and its workflow file. Every `.skilled/` entry carries its `.opencode/` twin in the same list. |
| G4 | `dispatch-enforcement-guard` keeps both jobs. Only the duplicate `Run the dispatch audit core suite` step is deleted, and the fail-closed rule-suite guard stays byte-identical. |
| G5 | A report-only step fails while its job stays green: `continue-on-error` stays, the repair hint moves into an `::error::` line, and the freshness report prints before the step exits. |
| G6 | The pre-commit inventory records a verdict per gate key and nothing in this phase acts on it. |
| G7 | Six concern commits, one per concern, and one closure commit for the acceptance evidence; no R-id, D-id or phase number in a workflow comment, a step name, a filter entry, a README row or an inventory row. |

The packet's operator decisions are D2, D3, D4, D7 and D10 in `plan.md`; the G-numbers above are local to this goal.

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -L '^concurrency:' .github/workflows/*.yml` lists exactly `dependabot-auto-merge.yml` and `strict-pass-freshness-report.yml`
- [ ] `grep -lF "cancel-in-progress: \${{ github.event_name == 'pull_request' }}" .github/workflows/*.yml | wc -l` returns `30`
- [ ] `grep -c "^      - '" .github/workflows/command-tree-parity.yml` returns `46` and `grep -c "^      - '" .github/workflows/agent-mirror-sync.yml` returns `11`
- [ ] `grep -c 'dispatch-audit.test.mjs' .github/workflows/dispatch-enforcement-guard.yml` returns `0`
- [ ] `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`
- [ ] `python3 -c "import yaml,glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]"` exits `0`
- [ ] `scratch/phase-result.md` exists, carries ten workflow rows and contains the word `unmeasured`
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
| Plan authored | Done | `spec.md`, `plan.md`, `tasks.md` T001 to T038, `acceptance-criteria.md` AC-001 to AC-017, `decision-record.md` ADR-001 to ADR-011 |
| Operator decisions | Pending | `scratch/decisions.md` is not written |
| Baseline rows | Pending | `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md` does not exist yet |
| Implementation | Pending | No file named by `tasks.md` has changed |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | The phase has not started, so no work has diverged from the directive |
<!-- /ANCHOR:log -->
