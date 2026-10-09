---
title: "Goal: Archive path follow-ups"
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
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/003-archive-path-follow-ups"
    last_updated_at: "2026-10-09T09:17:51Z"
    last_updated_by: "orchestrator"
    recent_action: "Closeout 3: citations re-checked; gate rows re-cited to tree5"
    next_safe_action: "Ship with lane A combined commit"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/tests/archive-track.vitest.ts"
      - ".skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Goal: Archive path follow-ups

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Confirm tool agreement on archive current-location semantics with a round-trip validator test.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Current-location semantics already implemented by Phase 15: recorded paths are derived facts, and git history keeps provenance. |
| D2 | Tools already agree: repair-derived does not freeze archives, heal-spec-docs skips archives, migrate-generated-json walks and re-derives them, upgrade-legacy repairs them. |
| D3 | Built in wave 4 by DeepSeek V4.1 Flash max through cli-pi on the OpenCode Go route: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "<brief>" --model opencode-go/deepseek-v4.1-flash --thinking max --mode text --offline </dev/null`. One task from tasks.md per brief, in task order, and the diff is checked before the next brief |
| D4 | Reviewed read-only by Luna max fast through cli-codex with `--sandbox read-only`. The builder applies a finding only after confirming it in the code, for at most two rounds |
| D5 | The builder writes only the files in spec.md Files to Change, its tests and this folder. The orchestrator reverts any other write |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Build-dependent:
- [x] Fixture test archives a packet, restores it, validates: `npx vitest run tests/archive-track.vitest.ts` shows test passing (closeout run: 18 passed, rc 0)
- [x] Heal-spec-docs.cjs: `grep -n "z_archive" .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` lists z_archive in SKIP_DIRS (line 66; it was line 64 before the final review's comment fix, and line 40 in the first draft) with documentation comment (lines 54-65)

Confirmation (already in place from phase 015):
- [x] Repair-derived.cjs: `grep -A5 "FROZEN_TREES" .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` shows `['node_modules', '.git', 'scratch']` only (line 442)
- [x] Migrate-generated-json.ts: `grep -n "z_archive\|archive" .skilled/skills/system-spec-kit/runtime/cli/graph/migrate-generated-json.ts` shows walk and re-derive (lines 25-27, 72-74; the enumerator that reaches archives is at line 191)
- [x] Upgrade-legacy.mjs: `grep -n "repairArchived" .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` shows repair function (lines 923-963 at closeout 3, with its policy comment at 918-922; 967-1007 and 962-966 at closeout 2; the first citation, 419-429, holds reversibility-manifest code)
- [x] README-repair-derived.md: Section 6 documents archive scope under current-location (lines 127-144; the archived-packets bullet is at 140-144)
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
| Fixture test added | Done | Round-trip case at `archive-track.vitest.ts:280-317`; the file reports 18 passed, rc 0, at closeout |
| Tool audit completed | Done | The four tools were read at the lines in tasks.md T001 to T009. Only the test file and the heal-spec-docs.cjs comment changed |
| SKIP_DIRS policy comment | Done | `heal-spec-docs.cjs:54-63`, directly above SKIP_DIRS (line 64). The constant is unchanged |
| Documentation alignment | Done, verify only | README-repair-derived.md section 6 (lines 127-144) already states archive scope. Its stale marker-line wording is a follow-up for another phase |
| Suite validation | Open | The whole-tree `npm test` has not run. AC-006 stays Unmet, pending the whole-tree gate run before ship |
| Suite validation, closeout | Done 2026-10-09 | tree3 whole-tree gate: the cli test exited 0 with 171 files passed and 1752 tests passed, 0 failed. The row above is the state before that run |
| Build briefs | Done | 003-E1 (the test) and 003-E2 (the comment) were built on DeepSeek V4.1 Flash max through cli-pi on the OpenCode Go route. The orchestrator checked each diff before the next brief |
| Review | Done | One round (003-R1b). Its one P2 finding, a stale citation, is corrected here |
| Closeout gates | See implementation-summary.md | repair-derived `--apply`, `validate.sh --strict` and `check-goal.cjs` were run after the last edit; results are in implementation-summary.md Verification |
| Comment fix after final review | Done | 003-O4 (cli-devin) rewrote the SKIP_DIRS comment to state that an explicit `--folder` bypasses the skip. The comment is now `heal-spec-docs.cjs:54-65` and SKIP_DIRS is at line 66 |
| Closeout re-check (2026-10-09) | Done | Each citation was read again at its current line. The current lines are in the line-drift row below. The whole-tree gate result is in implementation-summary.md Verification |
| Closeout 3 (2026-10-09) | Done | Citations re-read after the Opus alignment fixes. Gate rows re-cited to tree5 in acceptance-criteria.md AC-006 and implementation-summary.md. The current lines are in the closeout 3 line-drift row below |

### Deviations and findings

| Item | Note |
|------|------|
| Review route (D4) | D4 names Luna max fast through cli-codex. The first review (003-R1, route RDSL: DeepSeek on the LLM Gateway) failed with the API error "reasoning_content in the thinking mode must be passed back" and wrote nothing. It was rerun as 003-R1b on DeepSeek through pi on the OpenCode Go route. So the reviewer was DeepSeek, not Luna through cli-codex. The build evidence's lanes section runs DeepSeek only from 16:40 and records an operator message to spread the work across pi, OpenCode Go and Devin. It does not record a decision that replaces the Luna reviewer named in D4. Operator to confirm |
| Brief order (D3) | D3 asks for one task per brief in task order. The test brief (T010) ran before the comment brief (T008). The two briefs touch different files, so neither result depends on the order |
| Review finding F1 (P2) | goal.md cited repairArchived at upgrade-legacy.mjs:419-429. Those lines hold reversibility-manifest code. repairArchived is at lines 891-931. Corrected in the criterion above, in tasks.md T009 and in plan.md. Finding class `instance-only`. No code change |
| SKIP_DIRS citation | The criterion cited line 40. The constant is at line 64 in the current file. Corrected above |
| AC-002 citation | acceptance-criteria.md cited archive-track.vitest.ts:177-192, which is an older case. The round-trip case is at lines 280-317. Corrected in acceptance-criteria.md |
| Shared file | heal-spec-docs.cjs carried other lanes' uncommitted edits when the builder started. This phase's share of that file is lines 54-63 |
| Changelog | The phase context asks for a refresh of `../changelog/` at close. No changelog folder exists under 016 or 034, so nothing was refreshed |
| Whole-tree gate | Not run. AC-006 stays Unmet, and the packet is not closeable until it is Met |
| Four tools not edited | The plan's actions for repair-derived.cjs (clarify, remove the freeze claim) and migrate-generated-json.ts (add a policy comment) were not taken, because their comments already matched. Recorded in implementation-summary.md Deviations |
| Review route, closeout note | The reviewer is DeepSeek through cli-pi on opencode-go. Parent D1 records that the operator dropped Luna on 2026-10-08, so a child goal's Luna route reads as DeepSeek. Parent D7 moved the failed llmgateway route (003-R1) to the other route (003-R1b). The reviewer identity is therefore covered by D1 and D7 |
| Line drift at closeout | The citations in this folder were written before upgrade-legacy.mjs and heal-spec-docs.cjs moved, because phases 011, 012 and 015 edited the same files (parent D6). Current lines: repairArchived at upgrade-legacy.mjs:967-1007 with its policy comment at 962-966 and call sites at 1141 and 1475; the upgrade-legacy header archive policy at lines 13-17; the heal SKIP_DIRS comment at 54-65, SKIP_DIRS at line 66 and the discover skip at line 723. The 891-931 and 886-890 citations in earlier rows are stale |
| Final review fix (003-O4) | The fresh Opus high final review (F3, P2) found that the SKIP_DIRS comment did not state the `--folder` bypass. Brief 003-O4 ran on DeepSeek through cli-devin and rewrote the comment. SKIP_DIRS itself is unchanged |
| Line drift, closeout 2 (2026-10-09) | The test round moved the round-trip case to `archive-track.vitest.ts:312-338` (its describe at 312) and added cases at 213, 342, 380 and 411. The Progress rows above keep the numbers observed at the time. The citations for the four tools are current: repairArchived at `upgrade-legacy.mjs:967-1007`, FROZEN_TREES at `repair-derived.cjs:442`, the heal SKIP_DIRS comment at `heal-spec-docs.cjs:54-65` with SKIP_DIRS at line 66 |
| Track-packet edge cases, closeout 2 | The spec's two track-packet parent cases are still not pinned by a test (tasks.md CHK-022). The round-trip case covers a top-level packet only |
| Line drift, closeout 3 (2026-10-09) | After the Opus alignment fixes the current lines are: heal comment 54-65 and `SKIP_DIRS` 66 (unchanged); discover skip 746; `--folder` bypass 645-649; `repairArchived` 923-963 with its policy comment at 918-922; call sites 1097 and 1443; header 13-17; round trip 313-338; `upgrade-legacy.vitest.ts` archive cases 647-750. The earlier rows keep the numbers observed at the time |
| Test round review, closeout 3 (2026-10-09) | TR-R1 (Luna, read-only, RLUNA route) reviewed the test round, whose brief named `archive-track.vitest.ts`, and its output records no finding on that file. Its sandbox denied Vite's cache write, so the review read the files and did not run them. The closeout 2 statements that no reviewer read these cases are superseded |
<!-- /ANCHOR:log -->
