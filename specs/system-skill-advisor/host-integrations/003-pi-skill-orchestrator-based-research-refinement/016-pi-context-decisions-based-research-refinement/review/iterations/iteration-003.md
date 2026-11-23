# Iteration 003 - Traceability

## Dispatcher

- Iteration 3 of 5, generation 3, sessionId 2026-11-23T09:35:31.105Z, lineageMode restart (config). The state log holds two iteration records, so the derived number is 3 and matches dispatch.
- Dimension: traceability. Operator focus addressed by rechecking phase 028's doc-side fixes (children 007 to 010 statuses, the receipt-guard catalog sources, 027 AC-006) at HEAD by rerunning their commands, then widening the same checks to every child of the epic, the epic's own completion metadata and goal criteria, and the catalog and playbook entries the epic touched.

## Dimension

D3 Traceability.

## Files Reviewed

- Epic `spec.md:29, 65, 135-164` (continuity completion_pct, Status cell, phase table) and `goal.md:24, 100-106` (criteria)
- All 28 children: `spec.md` Status row, `graph-metadata.json` status, `acceptance-criteria.md` Unmet count and Closeable line (one scripted pass)
- `012-plan-text-and-goal-closeout/implementation-summary.md:32`, `graph-metadata.json:39`, `tasks.md`; `003-follow-up-routing-benchmark/graph-metadata.json:38`, `tasks.md:70-80`, `implementation-summary.md:80`
- `028-second-epic-review-fixes/acceptance-criteria.md` (claims), `027-epic-review-fixes/acceptance-criteria.md:59` (AC-006)
- `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/weak-follow-up-route-receipt-guard.md:30-45`, `feature-catalog/scorer-fusion/pasted-reply-stripping.md:14-46`, eight more scoped catalog files and eight scoped playbook files (link resolution)
- Strip call sites: `runtime/lib/scorer/fusion.ts:1089`, `runtime/handlers/advisor-recommend.ts:529`, `runtime/scripts/skill_advisor.py:1052, 5053`, `hooks/claude/user-prompt-submit.ts:19`, `runtime/lib/skill-advisor-brief.ts:424`
- Adapters: `hooks/dsh/prompt-advisor.mjs:136-199`, `hooks/vibe/prompt-advisor.mjs:192-264`, `hooks/pi/prompt-advisor.ts:77, 149-186`; `SKILL.md:26-27`; `hooks/skill-advisor-hook.md:57, 117`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Child 012 still reads in progress in two of its three status fields** -- specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/012-plan-text-and-goal-closeout/graph-metadata.json:39 -- The child's `spec.md:25` says `Complete` and its `tasks.md` has no open `- [ ]` line, but `graph-metadata.json:39` holds `"status": "in_progress"` and `implementation-summary.md:32` holds `completion_pct: 70`. This is the same drift generation 2 raised as its R3-P2-001 for children 007 to 010; phase 028 fixed exactly those four (its AC-004 names only 007 to 010) and left 012, which the scripted pass over all 28 children shows as the one remaining unexplained case. Child 003 shows the same graph status but is explained: its tasks T009 to T014 stay open by the recorded no-ship decision (`003-follow-up-routing-benchmark/implementation-summary.md:80`).
   Finding class: stale completion metadata (residue of a class a prior fix closed only for named instances)
   Scope proof: 012 is a child of the epic under review; its metadata files are not modified in the working tree, so the drift is committed at HEAD.
   Affected surface hints: `012-plan-text-and-goal-closeout/graph-metadata.json` status, `012-plan-text-and-goal-closeout/implementation-summary.md` completion_pct.
   Case: a status query over the epic's graph metadata lists 012 as an open child of an epic whose closure phases all read Complete.

2. **The epic's Status cell stops at phase 022 and its completion_pct says 100 while phase 028 is open** -- specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/spec.md:65 -- The Status cell's narrative ends with "Phase 022 fixes all eleven in worktree 489", yet the phase table carries rows 23 to 28 (spec.md:159-164), the last one In Progress. The continuity block sets `completion_pct: 100` (spec.md:29) while the same file's Status reads `In Progress` and the graph metadata reads `in_progress`, so the three completion signals in one packet disagree.
   Finding class: stale packet narrative and contradictory completion metadata
   Scope proof: the epic `spec.md` is in the declared scope file list.
   Affected surface hints: epic `spec.md` Status cell and `_memory.continuity.completion_pct`.
   Case: a reader of the epic's metadata table learns of no work after phase 022 and sees 100 percent completion while phase 028 still has two Unmet criteria.

3. **The pasted-reply stripping catalog names one call site and one runtime, but the strip runs in six places across two runtimes** -- .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/pasted-reply-stripping.md:22 -- "How it works" says `scoreAdvisorPrompt calls it before the lane scorer runs`, and Source Files lists only `prompt-policy.ts` and `fusion.ts` (lines 30-31). The strip also runs in the recommend handler (`runtime/handlers/advisor-recommend.ts:529`, phases 002 and 008), the brief producer (`runtime/lib/skill-advisor-brief.ts:424, 480`), the Claude hook (`hooks/claude/user-prompt-submit.ts:19`), and a separate Python copy (`runtime/scripts/skill_advisor.py:5053`, called at 1052, phase 007) that reads the shared fixture `runtime/tests/fixtures/pasted-reply-strip-cases.json`. Neither the Python copy nor the shared fixture appears in the entry. This is the same class as generation 2's R3-P2-002 (the receipt-guard catalog naming only the Claude hook), which phase 028 fixed for that one entry only; the receipt-guard entry now lists the DSH, Vibe and Pi adapters and the DSH test (weak-follow-up-route-receipt-guard.md:36-38, 45), matching the adapters' commit code.
   Finding class: incomplete feature-catalog source list
   Scope proof: the catalog entry and every cited call site are in the declared scope file list.
   Affected surface hints: `feature-catalog/scorer-fusion/pasted-reply-stripping.md` sections 2 and 3; the matching playbook scenario names no Python or fixture source either.
   Case: a maintainer who changes the strip rule using this entry as the map edits `prompt-policy.ts` only, and learns of the Python copy only when the shared fixture parity test fails.

## Traceability Checks

- spec_code (pass): phase 028's doc-side claims hold at HEAD. Children 007 to 010 each read `Complete` in `spec.md` and `complete` in `graph-metadata.json` (scripted pass); the receipt-guard catalog's Source Files list the DSH, Vibe and Pi adapters and the DSH test (weak-follow-up-route-receipt-guard.md:36-38, 45), and each adapter's role text matches its code (dsh `commitDeliveredReceipts` and `dropRouteReceipt` at prompt-advisor.mjs:136, 184; vibe `commitDelivery` at prompt-advisor.mjs:201; pi loads the shared handler at prompt-advisor.ts:77). The code-side claims were settled in iterations 1 and 2.
- checklist_evidence (partial): 028 AC-004 and AC-005 reproduce (`git grep score-outcome-rerank -- ':!specs/' ':!*changelog/*'` exit 1, no output, matching 027 acceptance-criteria.md:59). Epic goal criteria at goal.md:102, 103 and 106 reproduce (ENV-REFERENCE.md:310 one line; 003 implementation-summary.md:80; zero open tasks in 014, 015, 016). Criterion goal.md:104 (`validate.sh --recursive --strict` PASSED for every folder) does not reproduce now: 27 folders pass and `028-second-epic-review-fixes` fails with 2 errors (SOURCE_FINGERPRINT_MISMATCH, description drift) and a warning naming malformed evidence citations in AC-002, AC-004, AC-006, AC-007. That is 028's expected in-progress state and its own AC-006 gate covers it, so it is not raised as a finding. Partial because of finding 1 and the in-progress 028 failure.
- skill_agent (notApplicable): the epic changed no agent definition; `SKILL.md:26-27` trigger phrases do name the shipped pasted-reply and route-receipt features.
- agent_cross_runtime (notApplicable): no agent definition or runtime agent mirror is in the epic's scope. The cross-runtime question the epic does raise, receipt-guard parity across hook adapters, was checked under spec_code above (Claude, DSH, Vibe, Pi).
- feature_catalog_code (partial): receipt-guard entry matches code; pasted-reply stripping entry under-names its sources (finding 3). Link resolution over nine scoped catalog files left only bare cross-skill names (`feature-flag-governance.md`, `compiled-routing-and-legacy-fallback.md` at advisor-recommend.md:31) that exist in other skills and predate the epic (blame 2026-11-13).
- playbook_capability (partial): link resolution over eight scoped playbook files found no dangling path that the epic introduced; the unresolved names are scenario output files (`nc-011-*.json`) or an intentionally absent archive path. Scenarios were not executed this iteration.

## Integration Evidence

- `validate.sh <epic> --recursive --strict` run at HEAD working tree: 27 PASSED, 1 FAILED (028), 41.7 s.
- Probe script `/private/tmp/claude-501/r3/paths.py` (outside the repo) resolved backticked paths in the 17 scoped catalog and playbook files.

## Edge Cases

- 028's uncommitted working-tree state and its Unmet AC-006 and AC-007 are expected per dispatch and are not findings; its strict-validate failure is carried forward for AC-006.
- Child 003's `in_progress` graph status is explained by open tasks under a recorded no-ship decision; ruled out, as generation 2 also ruled out its open tasks.
- The epic goal's criterion 104 is ticked while it currently fails; the cause is 028 in progress, so it is recorded here only.

## Confirmed-Clean Surfaces

- Children 001 to 011 and 013 to 027: spec Status and graph status agree (except 003, explained above); every child with an acceptance-criteria file other than 028 reads Closeable Yes with 0 Unmet.
- 027 AC-006 now reproduces.

## Ruled Out

- 003 graph status in_progress: explained by the recorded no-ship decision.
- Dangling cross-skill catalog links at advisor-recommend.md:31: targets exist in other skills and predate the epic.
- Receipt-guard catalog naming only the Claude hook: fixed.

## Next Focus

- Dimension: maintainability
- Focus area: shared heuristic duplication between the native and Python offer gates and strip rule (two regex copies held in step by one fixture), the residue tool's size and structure, the doctor cleanup wiring, comment hygiene in the epic's changed code.
- Reason: planned rotation; last uncovered dimension.
- Rotation status: 3/4 dimensions covered.
- Carry-forward: scripted cross-child metadata passes and command reruns were productive; validate.sh recursive is affordable (about 42 s).
- Required evidence: file:line for each maintainability claim; any carried playbook execution stays optional.

Review verdict: PASS
