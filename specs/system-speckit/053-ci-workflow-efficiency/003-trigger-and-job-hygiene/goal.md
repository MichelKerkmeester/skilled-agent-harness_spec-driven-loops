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
    last_updated_at: "2026-10-24T09:00:00Z"
    last_updated_by: "markdown"
    recent_action: "Marked the six landed checkboxes and recorded the remaining probe, delta and closure work"
    next_safe_action: "Run T027 to T034 CI probes, then T035/T036 once the 002 baseline exists; T037/T038 close"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-003-trigger-and-job-hygiene"
      parent_session_id: null
    completion_pct: 60
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

- [x] `grep -L '^concurrency:' .github/workflows/*.yml` lists exactly `dependabot-auto-merge.yml` and `strict-pass-freshness-report.yml`
- [x] `grep -lF "cancel-in-progress: \${{ github.event_name == 'pull_request' }}" .github/workflows/*.yml | wc -l` returns `30`
- [x] `grep -c "^      - '" .github/workflows/command-tree-parity.yml` returns `46` and `grep -c "^      - '" .github/workflows/agent-mirror-sync.yml` returns `11`
- [x] `grep -c 'dispatch-audit.test.mjs' .github/workflows/dispatch-enforcement-guard.yml` returns `0`
- [x] `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`
- [x] `python3 -c "import yaml,glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]"` exits `0`
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
| Operator decisions | Done | `scratch/decisions.md` records `D2=pr-only, D3=approve, D4=drop-step, D7=depth-2, D10=skip` |
| Baseline rows | Pending | `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md` does not exist yet; T006 and T036 wait on it |
| Implementation | Done | Six concern commits on `main`: concurrency on 30 workflows, both filters, the dedup, both suppression removals, the three depth changes, the README table and the 13-key inventory |
| CI probes | Pending | T027 to T034: the concurrency cancel observation and the positive/negative trigger probes per filtered workflow |
| Delta and closure | Pending | T035 inventory re-check, T036 delta against the 002 baseline, T037/T038 closure evidence and commit |

### Deviations and findings

| Item | Note |
|------|------|
| T007 anchor drift | The rewritten comment sits at `command-tree-parity.yml:98-102`, not the planned `:47-50`; amendment 2026-10-24 |
| T021 wording | `README.md:71` names three inputs (`check-agent-mirror-sync.cjs`, both agent trees, the workflow file); accepted as more accurate, 2026-10-24 |
| AC-011 count | The guard regex returns 4, not the planned 2 (both roots' guards and the workflow file in both lists); amendment 2026-10-24 |
| Inventory shape | The hook has 13 gate keys (`private-skill` arrived with `7648ae8b56`) and the table carries a sixth `Reason` column; T035 and AC-012 corrected to 13/13/13 |
| T013 local/CI version split | CI run `40026353792` is green with all seven suites. On 2026-10-24, the focused test printed `Tests 7 passed (7)` with `opencode` hidden from `PATH` and `OPENCODE_BIN=/nonexistent/opencode`, but `Tests 2 failed \| 5 passed (7)` with local OpenCode v2.1.4 visible; the v1-only rule is skipped locally. The test is not hermetic, and pinning its resolved version belongs to dispatch-hooks, outside this packet |
<!-- /ANCHOR:log -->
