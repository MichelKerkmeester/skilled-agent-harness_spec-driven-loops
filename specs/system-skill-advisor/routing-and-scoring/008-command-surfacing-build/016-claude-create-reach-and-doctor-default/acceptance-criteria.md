---
title: "Acceptance Criteria: Phase 16: claude-create-reach-and-doctor-default"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "claude create reach and doctor default acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/016-claude-create-reach-and-doctor-default"
    last_updated_at: "2026-11-13T14:05:56Z"
    last_updated_by: "scaffold"
    recent_action: "Rewrote the criteria for the rename of /create:skill and the five lanes"
    next_safe_action: "Run tasks.md, then mark each row with its evidence in T029"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-claude-create-reach-and-doctor-default"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 16: claude-create-reach-and-doctor-default

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `system-skill-advisor/routing-and-scoring/008-command-surfacing-build/016-claude-create-reach-and-doctor-default`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`G`, `SP`, `ADV`, `HK`, `TC`, `V`, `VALL`, `SC`, `MS`, `MST`, `NMST`, `SRM`, `MSR`, `PSY`, `ASY`, `AMSC`, `HO`, `HOT`, `HCT`, `HD`, `RA`, `CAP`, `BASE`, `CORPUS`, `SLICE`, `FLOOR`, `REAL`, `EVAL`, `DER`, `DRV`, `DS`, `DALL`, `AMS`, `AMT`, `AMM`, `MAN`, `AMC`, `GPS`, `GPC`, `CUR`, `RCC`, `CRS`, `PSC`, `CCM`, `RV`, `DPR`, `RTS`, `SSK`, `LIN`, `MBC`, `MBCT`, `RAR`, `HOOK`, `CLI`, `OLDP`, `OLD` and `KEPT` are the names in `tasks.md`.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the moved command file and the edited areas, When the old-name scan runs, Then `.skilled/commands/create/sk-skill.md` exists, `find .skilled/commands -iname skill.md` prints nothing, no alias names the old command and `OLD` lists exactly the nine `KEPT` files | The T003 `R` status line and the T028 `OLD` output Met 2026-11-13: `git status` shows `RM .skilled/commands/create/skill.md -> .skilled/commands/create/sk-skill.md`. `OLD` lists ten files, the nine `KEPT` files and `.skilled/skills/sk-doc/changelog/v2.10.0.0.md`, which must name the old command to record the break. `find .skilled/commands -iname skill.md \| wc -l` prints 22, and all 22 are `SKILL.md` fixtures of the sk-skill doctor checks under `.skilled/commands/doctor/scripts/tests/fixtures/`, with 0 outside that folder. No mirror reads them, so the check was read as excluding `tests/fixtures`. No alias names the old command. Receipts: `scratch/after.txt:79` `.skilled/skills/sk-doc/changelog/v2.10.0.0.md:16` | Met | - |
| AC-002 | REQ-002 | Given `MS`, When it is searched, its test runs and the regenerated tree is checked, Then it holds no `COLLAPSE_ALLOWLIST`, a capitalised `SKILL.md` fixture is flagged, and `SRM` exits 0 and prints `visibility claude 44/44, cursor 44/44` | The T004 `fail 2` before and `fail 0` after, and the T016 and T027 `SRM` lines Met 2026-11-13: `rg -c COLLAPSE_ALLOWLIST` on `MS` prints nothing, both checks lowercase each name before they compare it, and `flags a skill file in any capitalisation` passes. The worker log records `fail 2` before the change. `NMST` reads `pass 9` and `fail 0` at close-out, and `SRM` prints `visibility claude 44/44, cursor 44/44` with exit 0. Receipts: `scratch/after.txt:26` `scratch/after.txt:30` `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:254` `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:273` `.skilled/skills/system-spec-kit/runtime/cli/tests/sync-runtime-mirrors.test.mjs:289` | Met | - |
| AC-003 | REQ-003 | Given every generated output, When each generator has written it and its check runs, Then `DRV` prints `"changed": []`, `SRM`, `PSY`, `ASY`, `AMSC`, `MAN` and `GPC` pass and the recaptured `BASE` keys `/create:sk-skill` | The T014, T015, T016 and T021 verify lines and the same checks in `$SP/after.txt` Met 2026-11-13: `scratch/after.txt` reads `DRV` `{"status":"fresh","changed":[]}`, `SRM` in sync, `PSY` 45 three times, `ASY` 11 three times, `AMSC` in sync, `MAN` `PASS` and `GPC` `PASS`. `jq -r '.commands \| keys[]' $BASE \| rg -cx '/create:sk-skill'` prints 1. The sk-doc compiled-route manifest, which the plan did not list, was refreshed by its own generator and all seven hubs read `fresh`. Receipts: `scratch/after.txt:23` `scratch/after.txt:27` `scratch/after.txt:53` `scratch/after.txt:57` `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1074` | Met | - |
| AC-004 | REQ-004 | Given the routing corpus, When its expected commands are counted, Then four rows read `/create:sk-skill` and none reads `/create:skill`, the holdout row changed only in `expected_command` by the count-only `sed` with a reported count of 1, and `holdout-prompts.jsonl` was never opened | The T010 count, the `numstat` line `4`, `4` and CHK-030 Met 2026-11-13: `jq` over the corpus counts four `/create:sk-skill` rows, one each of `["holdout","plain"]`, `["none","slash-variant"]`, `["none","typed"]` and `["tune","plain"]`. `rg -c` for the old expected command prints nothing and `git diff --numstat HEAD` reads `4`, `4`. The holdout row changed by the count-only `sed`, which reported 1. No task opened `holdout-prompts.jsonl`. Receipts: `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl:35` `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl:36` `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl:171` | Met | - |
| AC-005 | REQ-005 | Given the rebuilt cue, When `doctorProblemCue` reads a negated "show up" or "appear" and the capture runs, Then it returns `strong` for the two problem phrases, `null` for the two view phrases, and `BASE` reads `"offered":true` for `cmd-doctor-mcp-plain-tune-01` and `false` for `cmd-doctor-skill-advisor-plain-tune-01` | The T011 cases in `HOT` and `HCT` and the T021 row lines Met 2026-11-13: `reads a tool that does not show up as a strong cue` and `offers the helper beside the skills for a tool that does not show up` pass in the close-out run of seven files, 57 passed. T030 added `it doesn't appear to cover the routing case` and `don't show up-to-date entries only` as `null`. `BASE` reads `true` for the mcp tune row and `false` for the skill-advisor tune row, from `false` and `false`. Receipts: `.skilled/skills/system-skill-advisor/runtime/lib/scorer/doctor-helper-handoff.ts:55` `.skilled/skills/system-skill-advisor/runtime/tests/doctor-helper-handoff.vitest.ts:40` `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts:117` `scratch/after.txt:83` `scratch/after.txt:84` | Met | - |
| AC-006 | REQ-006 | Given the edited `AGENTS.md`, When its checks run, Then line 65 reads exactly the new line quoted in `spec.md` section 2, `AMM` and `CUR` carry it, every history hash recorded at `HEAD` is still recorded and `AMC`, `MAN`, `GPC` and `RCC` pass | The T012 `fail 1` before, the T015 verify lines and the four checks in `$SP/after.txt` Met 2026-11-13: `AGENTS.md` line 65 and `.cursor/rules/skill-routing.md` line 35 hold the stdin form. `git diff --numstat HEAD -- AGENTS.md` reads `1`, `1`, `sed -n 65p AGENTS.md \| wc -c` prints 205 and the history hash `comm` prints nothing. The worker log records `fail 1` on the new case before the line changed, and the manifest test reads `pass 32` and `fail 0` at close-out. `AMC`, `MAN`, `GPC` and `RCC` pass. Receipts: `AGENTS.md:65` `.cursor/rules/skill-routing.md:35` `.skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs:416` `scratch/after.txt:50` `scratch/after.txt:54` | Met | - |
| AC-007 | REQ-007 | Given all changes, When the floors and the suites run, Then typed recall is at least 24 of 44, both false offer counts are 0 of 35, typed delivery is 44 of 44, plain tune combined is at least 23 of 45, `EVAL` holds `[160,50,21,5]` with the fourth value no higher than 5, and `TC`, `VALL`, `DALL` and `CRS` pass | `$SP/after.txt` beside `$SP/before.txt` from T027 Met 2026-11-13: typed 24 of 44, both false offer counts 0 of 35, typed delivery 44 of 44 and plain tune combined 28 of 45, from 23. The 28 is tune reach the new phrases built in, not a gain. `EVAL` reads `[160,50,21,5]`. `TC` exits 0, `VALL` reads 1758 passed and 0 failed over 183 files, `DALL` reads `pass 1189` and `fail 0` and `CRS` prints both lines. Receipts: `scratch/after.txt:6` `scratch/after.txt:9` `scratch/after.txt:12` `scratch/after.txt:18` `scratch/after.txt:21` `scratch/after-vall.log:13` | Met | - |
| AC-008 | REQ-008 | Given the diff and the run, When they are searched, Then no holdout prompt was printed, no worker started a session, a daemon or Ollama, no file under `specs/` outside this folder, no published changelog entry and no Out of Scope file changed, and no added comment names a spec path, a phase, a task, a rank or a finding id | The T028 boundary and label scans and CHK-030 and CHK-031 Met 2026-11-13: the label scan prints nothing while the same pattern matches a control line. The scratch files and captures hold ids and counts only. No worker brief starts a session, a daemon or Ollama. Every `KEPT` file and every published changelog entry is unchanged, and the package diff stat is empty. One file under `specs/` outside this packet changed: the authored twin of the sk-doc compiled-route manifest, which the refresh rewrites and `CRS` holds equal to the served copy. Receipts: `scratch/after.txt:63` `scratch/after.txt:64` | Met | - |
| AC-009 | REQ-009 | Given the five commands' phrases fixed in T019, When the coordinator takes the real capture after them, Then plain holdout is at least 2 above the T018 count, typed reads 24 of 44, false offers read 0 of 35 in both columns, the three floor rows offer nothing, and no new phrase repeats its command's tune prompt word for word | `$SP/real-before-d.json`, `$SP/real-after-d.json` and the T019 overlap count of 0 Met 2026-11-13: read with the `REAL` filter, `scratch/real-before-d.json` reads holdout 3 of 44 and `scratch/real-after-d.json` reads holdout 5 of 44, 2 above. Both read typed 24 of 44, false offers 0 of 35 in both columns and `[false,false,false]`. Tune top-1 went from 13 to 18 of 45, recorded as built in. The close-out recount of the 23 added phrases against the five tune prompts prints 0. Receipts: `scratch/before.txt:95` `scratch/real-before-d.json` `scratch/real-after-d.json` | Met | - |
| AC-010 | REQ-010 | Given the sandboxed `TMPDIR`, When one brief-cost run ends, Then every hook child saw a `TMPDIR` inside its sandbox and the line count of every file in the shared metrics folder is unchanged | The T013 case in `MBCT` and the two identical listings in `$SP/brief-cost-run.txt` from T025 Met 2026-11-13: `runs each hook child with TMPDIR inside its sandbox` passes and `tests/measure-brief-cost.vitest.ts` reports 3 passed. The worker log records 1 failed before the change. The two listings in `scratch/brief-cost-run.txt` are identical, 224 files and 6651 lines in total. The run itself exited 2 with `degraded_brief`, so no live byte number was measured. Receipts: `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs:170` `.skilled/skills/system-skill-advisor/runtime/tests/measure-brief-cost.vitest.ts:108` `scratch/brief-cost-run.txt:226` `scratch/brief-cost-run.txt:228` `scratch/brief-cost-run.txt:455` | Met | - |
| AC-011 | REQ-011 | Given the rebuilt daemon, When the hook and the stdin CLI read the `cmd-doctor-mcp-plain-tune-01` prompt, Then the brief holds a line starting `Also: /doctor:helper` and the CLI returns `["/doctor:helper","run"]`, and the skill-advisor row gets neither | `$SP/doctor-live.txt` from T024 Met 2026-11-13: the mcp brief holds `Also: /doctor:helper` and its CLI line reads `["/doctor:helper","run"]`. The skill-advisor brief holds no `/doctor:` and its CLI line is empty. Receipts: `scratch/doctor-live.txt:4` `scratch/doctor-live.txt:7` `scratch/doctor-live.txt:13` | Met | - |
| AC-012 | REQ-012 | Given the regenerated Claude tree, When the folder is listed and the operator lists the Skill tool in a copy of it, Then `.claude/commands/create` holds `sk-skill.md` and twelve siblings with no `skill.md` in any capitalisation, and the listing names `create:sk-skill` and the twelve other `create:*` names | `$SP/claude-observed.txt` from T022 and the empty `comm` output over `$SP/claude-listing.txt` from T023 Met 2026-11-13: `scratch/claude-observed.txt` reads `visibility claude 44/44`, 13 entries in `.claude/commands/create` with `sk-skill.md` among them and a `skill.md` count of 0. The coordinator ran T023 in place of the operator, in a throwaway folder outside any repository. `scratch/claude-expected.txt` holds 44 names, `comm -23` against the listing prints nothing and the listing holds 13 `create:` names. Receipts: `scratch/claude-observed.txt:1` `scratch/claude-observed.txt:13` `scratch/claude-observed.txt:16` `scratch/claude-listing.txt:11` | Met | - |
| AC-013 | REQ-013 | Given the operator's answer to Q3 (`v2.10.0.0`), When the changelog task has run, Then one new entry at that version records the rename and its reason, no published entry changed and `PSC` passes with 0 warnings | The T026 verify lines Met 2026-11-13: `git status --short -- '*/changelog/*'` lists only `.skilled/skills/sk-doc/changelog/v2.10.0.0.md`, `git diff --quiet HEAD` on the two changelog folders exits 0 and `PSC` reads `all hard invariants passed, 0 warnings`. The four hub version fields read `2.10.0.0`. Receipts: `.skilled/skills/sk-doc/changelog/v2.10.0.0.md:16` `scratch/after.txt:67` | Met | - |

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

AC-001 to AC-013 are `Met` on `scratch/before.txt`, `scratch/after.txt`, `scratch/after-vall.log`, the three real captures and the wave 7 files, with the read-only checks rerun from the final working tree over `087888ec4a` on 2026-11-13. AC-001 reads the `skill.md` check as excluding the 22 doctor test fixtures and counts ten files in the old-name scan, both recorded deviations. The coordinator ran the AC-012 listing in place of the operator.
<!-- /ANCHOR:closure -->
