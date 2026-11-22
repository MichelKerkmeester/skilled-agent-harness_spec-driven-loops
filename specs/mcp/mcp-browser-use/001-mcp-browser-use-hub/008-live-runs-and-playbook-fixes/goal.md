---
title: "Goal: Phase 8: live-runs-and-playbook-fixes"
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
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/008-live-runs-and-playbook-fixes"
    last_updated_at: "2026-11-22T12:00:50Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive and the log"
    next_safe_action: "Run validate.sh --strict on this child and on the parent"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-11-22-live-runs-and-playbook-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 8: live-runs-and-playbook-fixes

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Record the live Bladebro and Aside runs the operator approved, correct the scenario forms those runs showed to be wrong, and leave both browser modes with validated playbooks and packages.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase documents work already done. It changes no skill or playbook file. |
| D2 | Live runs stay read-only. No page text, workspace name, cookie name or account id goes into a report. |
| D3 | A FAIL stays FAIL. A rewritten form stays unverified until a live run passes it. |
| D4 | Commit, push and install wait for the operator's approval. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] The Bladebro run folder's `results.csv` holds 5 rows with 4 PASS and 1 FAIL, and the Aside run folder's holds 15 rows with 10 PASS and 5 FAIL
- [x] `validate-playbook-package.cjs --package mcp-browser-use/mcp-bladebro` exits 0 with `scenarios=15` and `violations=0`
- [x] `validate-playbook-package.cjs --package mcp-browser-use/mcp-aside-devtools` and `--package mcp-browser-use/mcp-chrome-devtools` each exit 0 with `violations=0`
- [x] `validate_catalog_package.py --package mcp-browser-use/mcp-bladebro` exits 0 with 0 violations
- [x] `ls /Users/michelkerkmeester/worktrees/public/505-mcp-browser-use-hub` exits 1, and `git branch --list "*505*"` prints nothing
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
| Scaffold as a Level 2 phase child | Done | `create.sh --phase --parent` wrote the 007 file set. Child `ls` lists it |
| Level chosen | Done | `recommend-level.sh --loc 3005 --files 71` prints `Recommended Level: 2` |
| Bladebro real-browser run | Done | `results.csv`: BB-010, 011, 013 and 015 PASS, BB-012 FAIL with the launch reason |
| Aside signed-in run | Done | `results.csv`: 10 PASS and 5 FAIL over 15 scenario ids |
| BB-015 and the Bladebro package | Done | `attach-mode-reads.md`; playbook `scenarios=15`; catalog `violations=0` over 18 markdown files |
| Form fixes in Chrome DevTools and Aside | Done; Aside forms live-tested, Chrome forms not | Both validators `violations=0`. The rewritten forms are listed in spec section 10 |
| Leftover 505 worktree removed | Done | `ls` exits 1, and no branch or worktree for 505 is registered |
| Parent amendments | Done | Parent phase map row 8, handoff row, binding rows for 007 and 008, `children_ids` |

### Deviations and findings

| Item | Note |
|------|------|
| Parent binding table had no 007 row | The brief asked for the 007 pattern, but 007 had no row. `sk-create-goal` requires a row for each phase child on disk, so 007 and 008 both have one |
| `create.sh` wrote placeholder rows into the parent | `[Phase 8 scope]` and a `[Criteria TBD]` handoff row. Replaced with real text. The pre-existing 006 to 007 `[Criteria TBD]` row is left as it was |
| Status is Complete with FAIL verdicts | The operator asked for Complete. The FAIL verdicts are recorded results. The open work is in spec section 10 |
| 007 `Successor` left as None | The precedent: 006's `Successor` stayed None after 007 was added |
| Child file modes | `create.sh` wrote mode 600. Set to 644 to match the sibling packets |
<!-- /ANCHOR:log -->
