---
title: "Implementation Summary"
description: "The design surface this phase ships, the two report roots it reads, the clean criterion that decides closure and the re-measured help and verb counts."
trigger_phrases:
  - "skilled and doc alignment implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/014-skilled-and-doc-alignment"
    last_updated_at: "2026-11-25T21:10:00Z"
    last_updated_by: "wo-11"
    recent_action: "Shipped the design surface and aligned spec, plan, tasks, acceptance criteria and goal with it"
    next_safe_action: "Run both alignment commands and copy the last run of each into evidence/"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "wo-11-013-skilled-and-doc-alignment"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-skilled-and-doc-alignment |
| **Completed** | Not yet. The design surface is delivered and the two runs are pending |
| **Level** | 2 |
| **Base commit** | `79519553b62e41c7a018f4e3fde04f1d2f7f30ff` |
| **Interpreters** | `node` v26.13.0 and `python3` 3.9.6, both on PATH |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase ships the design surface a builder reads instead of deciding, and it aligns the packet's five planning docs with that surface. The two alignment runs themselves are not made yet, so the clean criterion has nothing to read and the packet is not closeable.

### Phase 13: skilled-and-doc-alignment

The phase exists because phases 001 to 013 change the bots CLI, the runtime modules and the skill's own docs, and nothing in the packet checks either against the standard it is held to. Two operator-local commands exist for that check and neither has ever run over these docs. The design surface below fixes every record, every state, every sequence, every stop and every screen those two commands produce, so the run that follows is a transcription and not a design decision.

The two report roots are `<state>/local-skilled-alignment/system-skilled-bots/<UTC timestamp>/` and `<state>/local-doc-alignment/system-skilled-bots/<UTC timestamp>/`, where `<state>` is `${XDG_STATE_HOME:-$HOME/.local/state}`. Both sit outside the checkout, which is why the last run of each command is copied into `evidence/skilled-alignment/` and `evidence/doc-alignment/` before the packet closes.

The clean criterion is the report line `- Open findings: 0 (0 handed off, 0 rebutted)`. Every check in this packet matches the prefix `^- Open findings: 0` and never the whole line, because the parenthesised counts follow the zero and a `$`-anchored pattern never matches.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `design/records.md` | Created | Every field of the topic entry, `scope.json`, `battery.json`, `findings.json`, `dispositions.json`, `report.md`, `fix-plan.md`, `recheck.json`, `recheck.md`, `applied.json`, `scratch/rebuttals.md` and `evidence/`, in 13 sections |
| `design/state-machines.md` | Created | Six Mermaid state machines: the skilled run, the doc run, the finding, the recheck bucket, the topic and this phase's clean-criterion loop |
| `design/sequences.md` | Created | Five Mermaid sequence diagrams, each naming the script, the file it writes and the line it prints |
| `design/refusals.md` | Created | Every way either command stops, with the line it prints and its exit status, plus the aggregator's six problems and the five recheck buckets |
| `design/mockups.md` | Created | Every screen a person sees, including the no-topic display, the unknown-topic display, both result blocks and the bots help block |
| `design/fixtures/` | Created | One golden per record, each produced by the script that writes it, plus the seven checks its `README.md` names |
| `evidence/README.md` | Created | The copy manifest, the two checks over the copy and what 015 does with it |
| `evidence/skilled-alignment/` | Created | The destination for the last skilled run's `report.md`, `findings.json` and `recheck.md` |
| `evidence/doc-alignment/` | Created | The destination for the last doc run's `report.md`, `findings.json` and `recheck.md` |
| `spec.md` | Modified | REQ-009 and SC-006 added, the severity rule stated, the handoff criteria named, the design references indexed in §5b and four stale citations corrected |
| `plan.md` | Modified | The design artifacts table added to §3, the evidence copy added to the data flow and the Definition of Done, and the clean-criterion pattern corrected to a prefix |
| `tasks.md` | Modified | T000 reads the design artifacts, T020 and T021 copy and check the evidence, T022 and T023 are the gates, and the wave table grew to nine waves |
| `acceptance-criteria.md` | Modified | AC-009 added for the evidence copy, AC-004's length read corrected for a bare array and the closure statement updated |
| `goal.md` | Modified | The clean-criterion pattern corrected to a prefix, an evidence criterion added and the three decision citations re-pointed after the spec edits |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The design surface was written first and every record in it was produced by the script that writes that record, so no field is a guess. `design/fixtures/README.md` names the seven checks over the goldens and each one was run here with no tty.

The five planning docs were then edited against the surface and against the frozen contracts in `../contracts/`. Each contract is cited by file and section and never copied. The three that bear on this phase are `contracts/records.md`'s opening paragraph for why a run folder is not a runtime record, `contracts/cli-json.md` section 1 rule 1 for why `findings.json` is a bare array and `contracts/refusals.md` section 3.11 for why this phase adds no refusal.

The gate is `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/014-skilled-and-doc-alignment --strict`, and it must print `RESULT: PASSED`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The clean criterion matches a prefix and not the whole line | The report line reads `- Open findings: 0 (0 handed off, 0 rebutted)`, so a `$`-anchored pattern never matches it and every criterion that used one was silently unmeetable |
| The last run of each command is copied into `evidence/` | Both commands write outside the checkout, so the clean close was unreadable from the packet and a pruned run folder took the evidence with it |
| `scratch/rebuttals.md` carries `handed_off` as well as `rebutted` | A finding whose code root is wrong is handed to 015 rather than fixed by editing the doc to agree with the runtime, and a decline with no record is a dropped finding |
| The doc run's `recheck.md` is its last `report.md` under the recheck name | The doc run has no recheck mode, so it has no recheck table, and the criterion for the doc run reads the report's `Open findings` line instead |
| The topic entry copies the `overlay-layout` shape | That entry is the one in `topics.json` that sets every optional field, so a builder pastes a shape that already parses rather than inventing one |
| No new surface in `surface-map.yaml` and no new alignment command | S1 to S16 already fire for a `.skilled` scope, so a new surface would duplicate a check that exists |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node .skilled/bin/bots.cjs --help \| wc -l` | 35 lines, the block `design/mockups.md` section 9 reproduces byte for byte |
| `node .skilled/bin/bots.cjs --help \| rg -o '^  [a-z]+' \| sort -u \| wc -l` | 11, the same number the `VERB_SPECS` key count prints |
| `node -e "const s=require('fs').readFileSync('.skilled/bin/bots.cjs','utf8');const m=s.match(/const VERB_SPECS = \{([\s\S]*?)\n\};/);console.log([...m[1].matchAll(/^  ([a-z]+):/gm)].length)"` | 11, so `USAGE` and `VERB_SPECS` agree on one verb set today |
| `node -e "const t=require('./.skilled/commands/assets/local-doc-alignment/topics.json');console.log(Object.keys(t.topics).length)"` | 10, the count the new entry raises to 11 |
| `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/system-skilled-bots` | exit 0 |
| `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` | exit 0 |
| `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots` | exit 0, `violations=0 warnings=0` over 58 scenarios in 17 categories. The seventeen `INDEX_ORPHAN_FILE` rows that stood before 013 are closed by that phase's root-index task, so the criterion is a regression guard and T014 keeps it green |
| `rg -n '^- Open findings: 0' evidence/*/report.md` | Prints nothing yet, because neither run is made. This is the row that decides closure |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/014-skilled-and-doc-alignment --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Neither alignment run is made.** The topic entry, the two runs, the fix pass and the evidence copy are all pending, so `evidence/skilled-alignment/` and `evidence/doc-alignment/` hold only their `.gitkeep` and the clean criterion has nothing to read. The workaround is the task order in `tasks.md`: T009 adds the topic, T010 and T011 make the two runs, T012 to T016 work the reports and T020 copies the evidence.
2. **The help-line and verb counts are recorded, not asserted.** The 35-line help and the 11-verb table are the pre-001 measurement. Phases 001 to 011 add eight more verb groups, so both counts move before this phase runs. T008 records the pair at this phase's setup in `scratch/help-baseline.md`, and the new pair replaces the two rows above.
3. **The doc run's `recheck.md` is a copy of its last `report.md`.** The doc run has no recheck mode, so its `still_open` and `new` buckets do not exist and the criterion for that command reads the report's `Open findings` line instead. `design/records.md` section 12 records the choice.
<!-- /ANCHOR:limitations -->

---
