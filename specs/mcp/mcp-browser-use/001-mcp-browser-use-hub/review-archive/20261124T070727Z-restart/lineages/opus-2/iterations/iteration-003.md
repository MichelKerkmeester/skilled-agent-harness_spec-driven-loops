# Iteration 003 — Traceability: every phase goal against shipped evidence

## Dispatcher
- Lineage opus-2, iteration 3 (2 prior iteration rows). steer.md absent.

## Dimension
traceability

## Review Focus Coverage
This iteration is the operator focus head-on: it listed the completion criteria of all 13 child goal.md files, compared each with the phase's spec status and implementation-summary evidence, and re-ran the criteria that can be re-run read-only (003 registry and rg pair, parent-skill-check on both hubs, mutation manifest skill_dir, 005 REQ-009 phrases, 008 results.csv tallies).

## Files Reviewed
- `specs/.../00{1..9},01{0..3}-*/goal.md` completion sections; each child `spec.md` Status row
- `specs/.../003-mode-relocation/goal.md:58-62`, `implementation-summary.md:3,125`
- `specs/.../004-bladebro-mode/goal.md:21,59-63`, `implementation-summary.md:33`
- `specs/.../005-routing-and-surfaces/spec.md:23,140-150`, `implementation-summary.md:47,157-159`
- `specs/.../008-live-runs-and-playbook-fixes/implementation-summary.md:127`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:53,146`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/{results.csv,README.md}`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--signed-in-live/results.csv`
- `.skilled/commands/doctor/assets/mcp-mutation-class-manifest.yaml:45,61,68`

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Phase 003 and 004 goal criteria are all unchecked although both phases are complete and the criteria hold** -- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/004-bladebro-mode/goal.md:59 -- 003 goal.md:58-62 and 004 goal.md:59-63 keep every completion box `[ ]` and their continuity block reads `completion_pct: 0`, `recent_action: "Authored the durable directive"`. Their specs say Complete, 003's implementation-summary.md:125 says 8 of 8 criteria met, 004's says completion_pct 100, and the live re-run here confirms 003's criteria (mcp-tooling 6 modes, rg pair no match, parent-skill-check OK on both hubs, manifest skill_dir under mcp-browser-use). Every other child goal ticks its boxes, so a goal-state reader sees two phases as not started.
   Finding class: stale goal state.
   Scope proof: grep of `^- [ ]` returns lines only in 003 and 004 goal.md.
   Affected surface hints: 003-mode-relocation/goal.md, 004-bladebro-mode/goal.md continuity and completion sections.
   Case: the GOAL POSTURE rule reads goal.md as the only source of goal state, so resuming 003 or 004 reports zero criteria met.
2. **Parent spec keeps a TBD handoff row and a removed branch** -- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:146 -- The 006→007 handoff row reads `[Criteria TBD] | [Verification TBD]` while every other row has criteria, and metadata line 53 names branch `worktrees/505-mcp-browser-use-hub`, which phase 008's last criterion removed (`git worktree list` has no 505 entry).
   Finding class: stale parent metadata.
   Scope proof: spec.md:53 and :146.
   Affected surface hints: parent spec.md metadata and Phase Handoff Criteria table.
   Case: a reader checking the 006→007 transition finds no criterion to verify it against.
3. **Live playbook verdicts cite evidence that was never kept** -- .skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/results.csv:3 -- Every row of the Bladebro ClickUp run and the Aside signed-in run (and the rewritten-forms and probe-guard reruns) sets evidence to "outside the repository and not kept (bbNNN.txt)", and the README marks runtime and reason "not recorded". The tallies match 008's criterion 1 (4 PASS/1 FAIL, 10 PASS/5 FAIL), but parent criterion 6 ("a recorded run") and the PASS verdicts rest only on self-reported rows; no output survives to re-check a verdict.
   Finding class: evidence retention gap.
   Scope proof: results.csv evidence column in four report folders.
   Affected surface hints: record-playbook-run.cjs evidence handling, report READMEs, 008 implementation-summary evidence table.
   Case: an auditor re-checking BB-010 PASS has only the line "outside the repository and not kept (bb010.txt)" to go on.
4. **005's unmet REQ-009 has no owning follow-up and still reproduces** -- specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/implementation-summary.md:158 -- The advisor still returns mcp-browser-use at confidence 0.82 for "set that aside and fix the failing unit test" (compiled route mcp-aside-devtools) and for "write a lighthouse keeper short story" (compiled route mcp-chrome-devtools), above the 0.8 confidence bar. 005 is honestly marked Partial and the parent spec status cites it, but none of phases 006-013 takes REQ-003, REQ-008 or REQ-009 into scope, so the gap is recorded and orphaned.
   Finding class: orphaned unmet requirement.
   Scope proof: live advisor replay this iteration; 005 spec.md:150; no 006-013 spec names REQ-009.
   Affected surface hints: advisor vocabulary for bare "aside"/"lighthouse", 005 known limitations, parent spec status.
   Case: the prompt "set that aside and fix the failing unit test" lists mcp-browser-use at 0.82 with a route to mcp-aside-devtools.

## Traceability Checks
- spec_code (partial): 13 phases' criteria compared with shipped state; 003 criteria re-run and hold; 005 Partial is honest; drift in goal state and parent spec (findings 1, 2, 4).
- checklist_evidence (partial): 003 acceptance 8/8 met with citations; 008 tallies match results.csv; recorded run evidence not retained (finding 3).

## Integration Evidence
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs` on `.skilled/skills/mcp-tooling` and `.skilled/skills/mcp-browser-use`: both print `OK ... 0 warnings`.
- `skill-advisor.cjs advisor_recommend` replay of the two REQ-009 phrases.

## Edge Cases
- 005 goal criterion 1 ("mcp-tooling for none of them" above threshold) is ticked while REQ-003 fails at `--threshold 0.5`; the goal uses the default threshold, so not a contradiction.
- 009-013 goal criteria require `validate.sh --recursive --strict` PASSED; not re-run here (lineage write limits forbid validate.sh).

## Confirmed-Clean Surfaces
- 001 (12 iteration records), 002, 006, 007, 008 criteria match their implementation summaries.

## Ruled Out
- Parent spec "Complete" vs 005 "Partial": the parent status row names the three unmet REQs explicitly, so it is disclosed, not hidden.

## Next Focus
- Dimension: maintainability
- Focus area: hub docs (SKILL.md, ROUTER.md, README, mode SKILL.md files), compiled-routing harness duplication, changelog topology from 007, 013's doc fixes against bdg 0.6.10.
- Reason: last canonical dimension not yet covered.
- Required evidence: file:line in hub and mode docs.

Review verdict: PASS
