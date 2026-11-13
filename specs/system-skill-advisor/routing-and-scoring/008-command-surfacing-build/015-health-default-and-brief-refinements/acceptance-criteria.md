---
title: "Acceptance Criteria: Phase 15: health-default-and-brief-refinements"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "health default and brief refinements acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/015-health-default-and-brief-refinements"
    last_updated_at: "2026-11-13T07:48:56Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-health-default-and-brief-refinements"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 15: health-default-and-brief-refinements

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `system-skill-advisor/routing-and-scoring/008-command-surfacing-build/015-health-default-and-brief-refinements`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`ADV`, `HK`, `MET`, `ST`, `STT`, `CA`, `REC`, `RCT`, `CAP`, `BASE`, `S`, `T`, `OF`, `R`, `MBC`, `MBCT`, `PLG`, `NPL`, `DSY`, `DALL`, `HD`, `HV`, `ARCH`, `FC`, `RAR`, `HOOK`, `FINAL`, `SP`, `FLOOR`, `EVAL`, `DRV`, `SRM`, `SLICE`, `TC`, `V`, `VT` and `VALL` are the names in `tasks.md`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `SKILL_ADVISOR_DEBUG` unset, When a diagnostic record is persisted, Then the line holds no `skillLabel` and no `errorDetails`, 301 writes leave 200 lines and with the variable set the record is written whole | The two T012 cases in `STT` and the T026 tail line `[false,false,"claude","ok"` Met 2026-11-13: the targeted run that holds `STT` reports 297 passed, including `writes a health record without the debug variable and keeps the skill label out` and `trims the default health log to 200 records`. `scratch/health-live.txt` reads `tail record: [false,false,"claude","ok","2026-11-13T10:37:01.497Z"]`. No test reads a record written with the variable set, so `scratch/debug-set-probe.txt` shows that clause: with `SKILL_ADVISOR_DEBUG=1` the built sink wrote `"skillLabel":"sk-doc","errorDetails":"probe detail"`, and with it unset both read `null`. Receipts: `scratch/health-live.txt:4` `scratch/debug-set-probe.txt:3` `scratch/debug-set-probe.txt:6` `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:537` `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:566` | Met | - |
| AC-002 | REQ-002 | Given a CLI answer from the local scorer, When the hook persists its record, Then the record holds `degraded: true` and the health section's `rollingDegradedRate` counts it | T018 and T019 verifies, and the T020 case reading `rollingDegradedRate` 0.5 Met 2026-11-13: `rg -n` finds `...(degraded ? { degraded: true } : {})` at `FB` line 517, `rg -c "degraded: result.metrics.degraded === true" $UPS` prints 1, `TC` exits 0 and the case `reports the newest record time and the degraded share` passes with `expect(parsed.hookHealth?.rollingDegradedRate).toBe(0.5)`. Receipts: `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:517` `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:614` | Met | - |
| AC-003 | REQ-003 | Given durable records, When `advisor_status` runs, Then `hookHealth` carries `rollingDegradedRate` and `lastRecordAt` equal to the newest record's `timestamp` and the strict schema accepts it | The T020 case and the T026 `hookHealth` line Met 2026-11-13: the same case passes after `AdvisorStatusOutputSchema.parse` with `lastRecordAt` `2026-11-13T08:00:05.000Z`. `SCH` lines 456 and 457 add the two fields. `scratch/health-live.txt` reads `"lastRecordAt":"2026-11-13T10:37:01.497Z"`, equal to the tail record's timestamp. Receipts: `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:456` `scratch/health-live.txt:5` `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-status.vitest.ts:589` | Met | - |
| AC-004 | REQ-004 | Given the rebuilt label rule, When the capture runs, Then `needs_mode_floor` reads `{"count":1,"total":35}` and `needsModeRows` reads `["nm-system-skill-advisor-01"]`, from `{"count":3,"total":35}` and 16 rows | The T003 and T024 `jq` lines, the T014 cases and the T027 hub heads Met 2026-11-13: `jq -c '.attachedMetrics.needs_mode_floor, .attachedMetrics.needsModeRows' $BASE` prints `{"count":1,"total":35}` and `["nm-system-skill-advisor-01"]`, `CAT` passes in the targeted run and the two hub heads in `scratch/live-heads.txt` hold `(needs a mode)`. The before values `{"count":3,"total":35}` and 16 rows rest on the `spec.md` section 2 label probe and the T003 worker log, because T024 overwrote that capture. Receipts: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json:2296` `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:361` `scratch/live-heads.txt:3` `scratch/live-heads.txt:4` | Met | - |
| AC-005 | REQ-005 | Given `compiledRouteTopOnly`, When a hub tops and a lower row carries the hub's routed command, Then the top row names that command, and without the option it does not | The T021 case and the T027 create-agent head holding `/create:agent (start)` Met 2026-11-13: `RCT` passes in the targeted run with the T021 case, and `scratch/live-heads.txt` reads `cmd-create-agent-plain-tune-01: Advisor: live; use sk-doc → /create:agent (start) 0.82/0.16 pass.` Receipts: `scratch/live-heads.txt:1` `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts:158` | Met | - |
| AC-006 | REQ-006 | Given a routed prompt, When the OpenCode transform runs, Then it pushes one system entry | `NPL` with the two T004 assertions and the T028 probe printing 1 on all nine labels Met 2026-11-13: `NPL` reports `pass 42` and `fail 0`, `rg -c "assert.equal\(output.system.length, 1\)" $NPLT` prints 4 and `jq` over `scratch/render-entries-after.json` prints 1 on all nine labels. Receipts: `scratch/after.txt:18` `.opencode/plugins/tests/system-skill-advisor.test.cjs:414` `scratch/render-entries-after.json:2` | Met | - |
| AC-007 | REQ-007 | Given the final arm, When it is summarised, Then `deliveryUnknown` reads `{"claude":0,"devin":0,"dsh":1,"opencode":24,"pi":0}` | The T006 case in `T` and the T031 summary Met 2026-11-13: `VT` passes in the targeted run with the T006 case, and `jq -cS 'map_values([.post.deliveryUnknown, .post.unsafe, .post.unsafeNoChangedPath])'` over `scratch/summary-final-after.json` prints `{"claude":[0,0,0],"devin":[0,2,1],"dsh":[1,2,2],"opencode":[24,2,0],"pi":[0,1,1]}`. Receipts: `scratch/summary-final-after.json:1` `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:952` | Met | - |
| AC-008 | REQ-008 | Given the final arm, When it is summarised, Then `[unsafe, unsafeNoChangedPath]` reads claude `[0,0]`, devin `[2,1]`, dsh `[2,2]`, opencode `[2,0]` and pi `[1,1]` and `unsafe` is computed as before | The T015 case, the T031 command and CHK-012 Met 2026-11-13: `VT` passes with the T015 and T036 cases, the T031 command prints `{"claude":[0,0],"devin":[2,1],"dsh":[2,2],"pi":[1,1],"opencode":[2,0]}` and the CHK-012 `rg` prints nothing while `rg -n` finds the unchanged `unsafe: start.unsafe \|\| loop === false` at `S` line 1204. Receipts: `scratch/summary-final-after.json:1` `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:845` `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1204` | Met | - |
| AC-009 | REQ-009 | Given all changes, When the floors run, Then none is lower than its line in `$SP/before.txt` | The T032 outputs in `$SP/after.txt` Met 2026-11-13: `scratch/after.txt` prints the four `FLOOR` lines and `[160,50,21,5]` equal to `scratch/before.txt`, `TC` exit 0, `NPL` `pass 42` and `fail 0`, `DALL` `pass 1188` and `fail 0`, `DRV` fresh and `SRM` in sync. The first `VALL` run failed one case, and the rerun after T039 reads 183 files and 1755 passed, 0 failed, exit 0. Receipts: `scratch/after.txt:4` `scratch/after.txt:9` `scratch/after.txt:31` | Met | - |
| AC-010 | REQ-010 | Given the diff and the run, When they are searched, Then `AGENTS.md`, `.skilled/commands/create/`, `render.ts`, the golden test and every package file are unchanged and no added comment names a spec label | The T033 outputs Met 2026-11-13: the close-out reran T033. `git diff --quiet` exits 0, both label scans print nothing while the same pattern matches a control line, the package diff stat is empty and the status lists 31 entries, each named in a task. Receipts: `scratch/boundaries.txt:2` `scratch/boundaries.txt:4` `scratch/boundaries.txt:6` | Met | - |
| AC-011 | REQ-011 | Given the setup workflow, When it is read, Then the advisor leg shows the degraded share and the record time and states the true reason when no record exists, without naming `SKILL_ADVISOR_DEBUG` | The T007 `rg` counts and `DALL` Met 2026-11-13: `rg -c "SKILL_ADVISOR_DEBUG" $DSY` prints nothing, `rg -c "rollingDegradedRate" $DSY` prints 1, `rg -c "hook health not recorded" $DSY` prints 1 and `rg -o` finds `no prompt hook has written a record for this checkout yet`. `DALL` in `scratch/after.txt` reports `pass 1188` and `fail 0`. Receipts: `.skilled/commands/doctor/assets/doctor-setup.yaml:59` `scratch/after.txt:21` | Met | - |
| AC-012 | REQ-012 | Given a stub hook, When the brief-cost script runs, Then a live arm prints `liveRows` and head statistics and an arm with no live head exits 2 with `degraded_brief` | `V tests/measure-brief-cost.vitest.ts` reporting 2 passed and the T030 record Met 2026-11-13: `V tests/measure-brief-cost.vitest.ts` reports 2 passed. `scratch/brief-cost-live.json` reads `{"error":"degraded_brief","rows":44,"liveRows":0}` with exit 2. No live byte number was measured in this phase. Receipts: `.skilled/skills/system-skill-advisor/runtime/tests/measure-brief-cost.vitest.ts:80` `scratch/brief-cost-live.json:1` | Met | - |
| AC-013 | REQ-013 | Given a DSH store that gained several sessions, When the runner picks the turn's session, Then it names the one whose first user record is the prompt, and none on a tie | The T016 inline checks and the T029 probe Met 2026-11-13: the T016 inline checks print `c` and `null`, `VO` passes with the three T037 cases and `scratch/dsh-session.txt` reads `chosen: session-ee6df6b3-bda7-4ec2-9a37-ebb1360794a1`, the candidate with 108 records, which no `FINAL` line names. Receipts: `scratch/dsh-session.txt:2` `scratch/dsh-session.txt:6` `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts:96` | Met | - |
| AC-014 | REQ-014 | Given the guides and the README, When they are searched, Then they describe the default record, the debug addition, the bounding variable's remaining role, the label keys, `unsafeNoChangedPath` with its limit, `deliveryUnknown` per run line and the refusal | The T008 to T011, T017 and T025 verify commands Met 2026-11-13: the T008 to T011, T017, T025 and T038 verify commands print their expected counts, and the T025 `rg -o ... \| sort -u \| wc -l` prints 8. Receipts: `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:191` `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook-validation.md:100` `.skilled/skills/system-skill-advisor/ARCHITECTURE.md:150` `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/claude-hook.md:42` `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:99` | Met | - |

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
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

AC-001 to AC-014 are `Met` on `scratch/after.txt`, `scratch/boundaries.txt`, the wave 6 files and `scratch/debug-set-probe.txt`, with every verify command rerun from the final working tree over `2549786f28` on 2026-11-13.
<!-- /ANCHOR:closure -->
