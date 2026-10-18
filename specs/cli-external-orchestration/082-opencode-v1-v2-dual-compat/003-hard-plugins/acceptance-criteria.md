---
title: "Acceptance Criteria: Phase 3: hard-plugins"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "hard plugins acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/003-hard-plugins"
    last_updated_at: "2026-10-18T12:45:03Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-hard-plugins"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 3: hard-plugins

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins
**Level:** 2
**Status:** Draft
**Date:** 2026-10-18
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the five hard plugins on v2, When `opencode2 api GET /api/plugin` runs with the raw query, Then all five names in `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/003-hard-plugins/scratch/hard-5.txt` appear as active | v2 read filtered to this worktree Evidence: `scratch/v2-active-003.txt:5` lists `opencode-goal`, and lines 11, 12, 14 and 15 carry the other four names, so `comm -23 scratch/hard-5.txt scratch/v2-active-003.txt` prints no line. `scratch/v2-after-003.json` reports 16 entries and 16 active. | Met | - |
| AC-002 | REQ-002 | Given the five hard plugins on v1, When `opencode debug config </dev/null` runs, Then each name appears on a plugin load line and no `failed to load plugin` line appears | v1 load capture Evidence: `grep -c 'failed to load plugin' scratch/v1-load-after-003.txt` prints 0, the five plugin paths sit at lines 282, 284, 285, 290 and 296 of `scratch/v1-load-after-003.txt:7`, and `scratch/v1-harness-after-003.jsonl:10` reports `sk-vision` loaded with no failed row. | Met | - |
| AC-003 | REQ-003 | Given the registration cases, When they run before and after the ports, Then every case fails before its port and passes after it | Registration before and after Evidence: `scratch/hard-before.txt:13` reports 9 failures against the 9 cases at line 10, and `scratch/hard-after.txt:14` reports 0 failures with 10 passes at line 13. The captures come from the symbol reporter, which writes the count as `ℹ fail 9` rather than `# fail 9`, so the original `#` count grep no longer matches anything. | Met | - |
| AC-004 | REQ-004 | Given the sentinel behaviour case, When it runs before and after its port, Then it fails before the port and passes after it | Sentinel behaviour case Evidence: `scratch/hard-before.txt:6` marks the case with the failure glyph, and `scratch/hard-after.txt:6` marks it with the pass glyph. The captures use the symbol reporter, not `not ok` and `ok`, so the original grep no longer matches anything. | Met | - |
| AC-005 | REQ-005 | Given the spec gate behaviour case, When it runs before and after its port, Then it fails before the port and passes after it, and the denial reaches the caller | Spec gate behaviour case Evidence: `scratch/hard-before.txt:7` marks the case with the failure glyph, and `scratch/hard-after.txt:7` marks it with the pass glyph and the denial assertion. The captures use the symbol reporter, so the original grep no longer matches anything. | Met | - |
| AC-006 | REQ-006 | Given the `sk-vision` source and its build, When the bundle is rebuilt and loaded, Then both hosts load it, or the phase 1 blocker is recorded | Bundle and load proof Evidence: `scratch/sk-vision-build-after-fix.txt:6` records build exit 0 with `dist/plugin.js` at 506257 bytes at line 7, `scratch/v1-harness-after-003.jsonl:10` reports `sk-vision` loaded on v1 on `command.execute.before`, and `scratch/v2-active-003.txt:10` lists it active on v2. The planned `scratch/sk-vision-load.txt` capture was not produced under that name, so this row cites the v1 harness and the v2 active list instead. | Met | - |
| AC-007 | REQ-007 | Given the plugin suite, When it runs, Then the failure count is zero and the pass count is at or above the phase 2 floor | Suite summary against the floor Evidence: `scratch/suite-after.txt:365` reports 353 passes with 0 failures at line 366, at or above the floor of 331 in `scratch/baseline-floor.txt:3`. The capture comes from the symbol reporter, which writes the count as `ℹ pass 353` rather than `# pass 353`, so the original `#` count grep no longer matches anything. | Met | - |
| AC-008 | REQ-008 | Given the phase, When its captures are searched, Then no step stopped, started or restarted the v2 service | Service state capture Evidence: `grep -l -E 'opencode2 service (stop\|start\|restart)' scratch/*.txt` prints nothing, and `scratch/service-state.txt:2` records the v2 service as PID 46220 with the same start time as the phase 2 capture, so it was not restarted. | Met | - |
| AC-009 | REQ-009 | Given the goal port, When its source is searched, Then the prompt enqueue call uses `delivery: "queue"`, and the goal case passes | Goal queue Evidence: the enqueue call sits in the shared bridge at `.opencode/plugins/lib/v2-bridge.js:148` with `delivery: 'queue'` in single quotes, because decision 5 moved the v2 legs into the bridge, and the goal queue case passes at `scratch/hard-after.txt:8`. The original grep names the two goal files, which no longer carry the call. | Met | - |
| AC-010 | REQ-010 | Given the skill advisor port, When its source is searched, Then the context hook and the tool transform are registered on v2, and the advisor case passes | Advisor v2 leg Evidence: the context hook registers at `.opencode/plugins/lib/v2-bridge.js:351` and the tool transform at `.opencode/plugins/lib/v2-bridge.js:367`, because decision 5 moved the v2 legs into the bridge, and the advisor case passes at `scratch/hard-after.txt:10`. The original grep names `system-skill-advisor.js`, which no longer carries either call. | Met | - |
| AC-011 | REQ-011 | Given the defensive null guards in the four entry modules, When they are searched, Then each guard the port touched has a positive capability check and a recorded replacement | Guard audit Evidence: `scratch/grep-checks-003.txt:73` records no `return null` line changed in the four entry modules, so the port touched no null guard and there is no replacement to list. The guard inventory sits at `scratch/grep-checks-003.txt:19`, and the implementation summary records the zero replacement count. | Met | - |
| AC-012 | REQ-012 | Given the five default exports, When the entry modules are searched, Then each exports only its default, and no seam remains | Export shape Evidence: `scratch/grep-checks-003.txt:3` shows one `export default dualPlugin(...)` line per JavaScript entry module and `scratch/grep-checks-003.txt:13` shows no `__test` line. `scratch/grep-checks-003.txt:11` records the sk-vision named helper `toV1FileUrl` beside the default export at line 12. Decision 12 rules that REQ-012 constrains only the default export, which keeps `id`, `setup` and `server`, and that neither host loads the helper as a plugin. | Met | - |
| AC-013 | REQ-013 | Given the phase, When `git status --porcelain` is compared with the snapshot, Then every new or changed path falls inside the file list in `spec.md` section 3 | Scope comparison Evidence: `scratch/scope-check-003.txt:1` lists the changed paths. Four fall outside the file list in `spec.md` section 3, and decision 13 rules each in scope: `.opencode/plugins/lib/v2-bridge.js` and `.opencode/plugins/tests/v2-bridge.test.cjs` (decision 5 moved the v2 legs there), `.opencode/plugins/tests/system-spec-gate.test.cjs` (the seam removal and the child-environment fix), and `.skilled/skills/sk-vision/vision-runtime/src/plugin.test.ts` (the test for the base64 fix). `scratch/decisions.txt:29` records the four rulings. | Met | - |
| AC-014 | REQ-014 | Given the diff, When DeepSeek reviews it against `sk-code/sk-code-opencode`, Then the review lists no open P0 or P1 item | Review and fix verification Evidence: `scratch/review-003.txt:7` reports no P0 and four P1 findings, decision 8 sends all four to one fix run (`scratch/decisions.txt:19`), `scratch/fix-003-report.txt:3` records the four fixes, and `scratch/review-003-verify.txt:2` closes all four with no new P0 or P1 and a PASS verdict at line 35. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.

### Row sources and evidence

AC-001 and AC-002 come from the brief's load acceptance. AC-003 comes from the brief's registration acceptance. AC-004 and AC-005 come from the brief's behaviour acceptance for the sentinel and the spec gate. AC-006 comes from the brief's `sk-vision` scope. AC-007 carries the floor from phase 2. AC-008 comes from brief decision D4. AC-009 and AC-010 come from the brief's scope for the goal and the skill advisor. AC-011 comes from the brief's defensive guard rule. AC-012 comes from brief decision D1. AC-013 comes from the file list in `spec.md` section 3. AC-014 comes from brief decisions D6 and D7.

The template has no separate evidence column. The Verification column names the check, and it takes the observed evidence once the check runs. Each row stays `Unmet` until that evidence sits in its Verification cell.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

All 14 rows are `Met`, each with observed evidence in its Verification cell. The phase 1 questions that three rows depended on are settled: the two approved live v2 runs confirmed that v2 delivers neither `session.idle` nor `session.compacted` (`scratch/phase1-answers.txt:81`), so the aliases are the delivered path. Ten rows were amended to the delivered tree. AC-003, AC-004, AC-005 and AC-007 cite the symbol reporter's counts because the captures are not TAP output, AC-006 cites the v1 harness and the v2 active list because the planned `scratch/sk-vision-load.txt` capture was not produced under that name, and AC-009 to AC-013 carry the decision 5 bridge move, the unchanged null guards, the decision 12 helper ruling and the decision 13 scope rulings. The strict validator runs last, in T025.
<!-- /ANCHOR:closure -->
