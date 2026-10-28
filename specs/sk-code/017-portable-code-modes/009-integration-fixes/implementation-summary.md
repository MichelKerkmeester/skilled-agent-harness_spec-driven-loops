---
title: "Implementation Summary"
description: "/doctor:sk-code quality status now shows every checklist the gate would apply with its seat, override rows and refusals, and the hygiene rules in force. The implement dashboard uses the runner's gate values, and the quality docs state the outside-repository limit."
trigger_phrases:
  - "integration fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/017-portable-code-modes/009-integration-fixes"
    last_updated_at: "2026-10-28T01:30:00Z"
    last_updated_by: "implementer"
    recent_action: "Surfaced conflicts in explain and the doctor"
    next_safe_action: "Conductor wires the child into the parent phase table and commits"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/sk-code-quality-config.cjs"
      - ".skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs"
      - ".skilled/commands/doctor/assets/doctor-sk-code-presentation.txt"
      - ".skilled/commands/speckit/assets/speckit-implement-presentation.txt"
      - ".skilled/skills/sk-code/sk-code-quality/references/quality-config.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "integration-fixes-implementer"
      parent_session_id: null
    completion_pct: 100
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
| **Spec Folder** | 009-integration-fixes |
| **Completed** | 2026-10-28 |
| **Status** | Complete |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`/doctor:sk-code quality` status now tells you what the gate would apply in your repository: each checklist, where it was declared, what its `## Rule overrides` section changes or why that section was refused, and which hygiene rules are in force. A quality run now applies those sections too: a refused one stops the run, and each accepted row is recorded in the envelope. The `/speckit:implement` dashboard no longer offers a `pass` the quality runner never reports.

### The doctor shows the applied rules

Status asks the runner itself, through `quality-gate.cjs --explain`, so the doctor holds no copy of checklist discovery. It samples one file per first three folders and extension from the files a worktree run would see, explains them in batches of 500 and merges the per-file rows. In this repository that sample resolved the same 15 checklists as every tracked file. A checklist the gate cannot read, such as one the config names that is missing, fails the status with the runner's own code, and so does a refused override section, because every gate run that loads either stops with exit 3. A repository `checklists[]` row the sample did not reach, such as one for `src/a/b/deep/**`, is still listed as `declared, not reached by the sample`, its file checked and its section linted. Two checklists at one level that disagree on a rule for a sampled file print `override-conflict <id> <file> <file>` with the sampled files, read from the per-file `rule_conflicts` that `--explain` now carries, and a note that the gate reads `UNVERIFIED` there. The JSON gains an `applies` field and the text gains lines, and the `STATUS` line is unchanged in a repository with no broken checklist.

### The run applies override sections

`quality-gate.cjs` used to read `## Rule overrides` only for `--explain`. A run now reads the section of every checklist it loads through the same reader. A refused section ends the run `ERROR` with `CONFIG_INVALID`, exit 3, and its `config.errors` row names the checklist and every reason. A row whose id no declaring document carries refuses its file the same way. Each accepted row lands in a new `rule_overrides` verdict field with the files it applies to after precedence, and the envelope's `p0_p1_p2_decisions` lists it as `override <id> <none|replace> from <file>` ahead of `PENDING_AGENT_JUDGMENT`. Two checklists at one precedence level that disagree on a rule for a file are listed in `rule_conflicts` and as `override-conflict <id> <file> <file>`. Neither row applies, so the rule keeps its default, and the rule id joins `summary.unverified`. In this repository a run over `.skilled/**` files now carries one decision line, `override review.todo-tracking replace from hub:sk-code/sk-code-skilled/assets/checklists/universal-checklist.md`, and still reads `NO_BLOCKER_FOUND`.

### One registry of rule ids

`shared/scripts/lib/rule-registry.cjs` reads every id an override row may name from the three documents the contract names: the runner's ids from `runner-contract.md` section 5, with the hygiene names from the checker's table through the quality config loader, the `floor.*` ids from `code-quality-standards.md` sections 3 to 5 and the `review.*` ids from `review-core.md` section 8. Here it reads 85 ids. A row added to one of those tables is known at once, and a missing section or table throws with its name. So does a table body row whose first cell names no id, such as an unquoted `review.kiss`, and a section 5 `hygiene.` row that is not the `hygiene.<name>` template, each with its file and line, so the registry can no longer shrink without a sound. A wildcard first cell such as `syntax.*` is the one row allowed no id. The linter still checks grammar, action and floor only. The runner and the doctor both check existence through the registry.

Output on the scratch fixture (path shortened):

```text
Hygiene: disabled hygiene.task
Checklists: 3, resolved by quality-gate.cjs --explain over 3 of 4 listed files (one file per first 3 folders and extension)
  default      hub:sk-code/shared/references/universal/code-quality-standards.md (universal floor, 3 sampled files)
  repo-config  .sk-code/checklists/house.md (.sk-code/quality.json, paths src/**, 1 sampled file)
    override floor.documentation none (No doc comments here)
    override review.function-length replace: A function stays under 80 lines (Team limit)
  repo-config  .sk-code/checklists/strict.md (.sk-code/quality.json, paths src/**, 1 sampled file)
    overrides REFUSED, none of its rows apply:
      line 7: `floor.input-validation` is on the hard floor (Input validation: every external input is validated at the boundary) and cannot be overridden
  ERROR  CONFIG_INVALID: .sk-code/checklists/strict.md has a refused ## Rule overrides section, so none of its rows apply: line 7: ...
Hygiene rules: 20 apply (hygiene.packet-slash, ..., hygiene.issue), disabled hygiene.task
STATUS=FAIL SOURCE="repo" TRUST=none ERROR=CONFIG_INVALID
```

### The dashboard and the docs

The dashboard's `Quality gate` field now reads `not-run` or one of the runner's gate values, with a note that `NO_BLOCKER_FOUND` is not a pass and `NOTHING_CHECKED` is not clean. `sk-code-quality/SKILL.md` and `references/quality-config.md` say plainly that a surface skill in another repository is never discovered, and show how such a repository names its rules in `.sk-code/quality.json` `checklists[]` and a `## Rule overrides` section.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/sk-code-quality-config.cjs` | Modified | Status samples the tree, calls `--explain`, merges checklists and prints overrides and hygiene rules |
| `.skilled/commands/doctor/scripts/tests/sk-code-quality-config.test.cjs` | Modified | Three new cases, and the no-process assertion restated for the one runner call |
| `.skilled/commands/doctor/assets/doctor-sk-code-quality.yaml` | Modified | Status phase keeps and renders `applies`, and the invariant names `--explain` |
| `.skilled/commands/doctor/assets/doctor-sk-code-presentation.txt` | Modified | Hygiene line, Applied Rules block, summary line and two troubleshooting rows |
| `.skilled/commands/speckit/assets/speckit-implement-presentation.txt` | Modified | Dashboard quality gate values and a note on what they mean |
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Modified | Outside-repository paragraph and version 1.13.7.0 |
| `.skilled/skills/sk-code/sk-code-quality/references/quality-config.md` | Modified | Outside-repository section, doctor status row, two known limits, version 1.0.6.0 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` | Modified | Run path reads each loaded checklist's override section, refuses a bad or unknown row, resolves precedence and conflicts, and records the result in `rule_overrides`, `rule_conflicts`, `summary.unverified` and the envelope |
| `.skilled/skills/sk-code/shared/scripts/lib/rule-registry.cjs` | Created | The rule id registry, read from the declaring documents |
| `.skilled/skills/sk-code/shared/scripts/tests/rule-registry.test.cjs` | Created | Derivation, no-silent-shrink, table agreement and shipped-checklist cases |
| `.skilled/skills/sk-code/SKILL.md`, `description.json`, `mode-registry.json`, `hub-router.json` | Modified | Hub version 3.9.13.0 |
| `.skilled/skills/sk-code/changelog/v3.9.13.0.md` | Created | Hub changelog entry for the registry |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and its twin under `specs/sk-doc/z_archive/` | Modified | Regenerated with the guard's own repair command after the hub version step |
| `.skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` | Modified | Five run-path override cases (refused, recorded, unknown id, conflict, agreement and level) and one explain conflict case |
| `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` | Modified | `rule_overrides`, the decisions field, the refusal cause, the explain `rule_conflicts` field and the `unverified` wording, version 1.0.7.0 |
| `.skilled/commands/doctor/scripts/tests/README.markdown` | Modified | The suite row names what the status covers and the processes it starts |
| `.skilled/skills/sk-code/sk-code-quality/changelog/v1.13.7.0.md` | Created | Changelog entry for the runner, doctor and doc changes |
| `.skilled/skills/system-spec-kit/SKILL.md` | Modified | Version 2.12.15.0 |
| `.skilled/skills/system-spec-kit/changelog/v2.12.15.0.md` | Created | Changelog entry for the dashboard |
| `.hermes/skills/sk-code-quality/SKILL.md`, `.hermes/skills/system-spec-kit/SKILL.md` | Modified | Mirrors regenerated by the Hermes sync |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The sample was measured first: over all 120,280 tracked regular files the explain union took 33,707 ms, and the depth-three sample of 1512 files took 550 ms and printed the same 15 checklist lines. The new cases ran against the `HEAD` script, put back in place for the run and restored afterwards (`cmp` confirmed), and failed. They passed against the changed script. Then every doctor suite, route validation, the quality runner suite, the setup battery, the speckit presentation contract and the Hermes check ran from the final state.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Call the runner as a process with `--explain` rather than import it | `quality-gate.cjs` exports no explain entry. `spawnArgv` from the runner's own `run-check.cjs` runs it as an argv array with no shell and a 60 s deadline, one process per batch of 500 sampled files, one after another, so up to eight at the 4000-file cap |
| Restate the test that said the script starts no process at all | The property it protects is that no configured command runs, and the canary case, now on a trusted config, still proves that. The new assertion allows one `spawnArgv` call site, whose argv is the exported `RUNNER` and `--explain`, and still bans every other way to start a process |
| Sample one file per first three folders and extension, capped at 4000 | Explaining every file took 34 s here. The sample matched the full union in 0.55 s, and the status names the sample so a reader knows it is one |
| A checklist error fails the status | The runner treats a reached `CHECKLIST_MISSING` as a run error with exit 3, so an `OK` status beside it would mislead. The `STATUS` line gains no new token, only the `ERROR=` code it already carries for config faults |
| A refused override section fails the run and the status | The review round extended the scope to the runner, so the run now follows the shared contract's outcome table: a refused file is `CONFIG_INVALID`, exit 3. The status matches it. In the first round the run ignored sections and the status only showed the refusal |
| Refuse in the run's `config.errors`, not a new error code | A missing checklist already reports there, and the contract names `CONFIG_INVALID`, so no consumer meets a new code |
| Record accepted rows ahead of the marker, joined by `, ` | The runner knows these decisions, and the per-severity dispositions are still the agent's, so `PENDING_AGENT_JUDGMENT` stays and a field that still holds it is still open work. A run with no row prints the field exactly as before |
| Derive the registry, never list the ids | The contract names three documents as the sources, so the registry parses their tables and the hygiene names come through the loader that already reads the checker. A test compares the floor and review tables with the contract's fixed list, and another reads every shipped override row, so a renamed or dropped id fails a case instead of passing silently |
| Put the registry in the hub's `shared/scripts/lib/` | The linter already lives in `shared/scripts/`, the runner loads it from its own hub, and the doctor reaches the same folder, so all three read one module |
| A conflict joins `summary.unverified`, so the gate reads `UNVERIFIED` | `runner-contract.md` already expresses an open claim through `summary.unverified` and the `UNVERIFIED` gate, exit 4, and the contract asks for the rule to be reported unverified with no new exit code. `decideGate` takes the conflicting rule ids beside the check ids, and an error or a blocker still outranks it |
| `rule_overrides` rows gain `files` | A row can apply to one file and lose to a higher level or a conflict on another, so the envelope lists only rows that applied somewhere, and a reader can see which |
| The doctor refuses unknown ids | A refused file stops every run that loads it, so the status must match |
| `--explain` gains per-file `rule_conflicts`, computed by the run's own override pass | The review found the doctor printing both conflicting rows as applying. Calling `runOverrides` and so `resolveOverridePrecedence` from `explain` keeps one copy of precedence. Its `overrides` block stays the linter's alone, and the new field is additive, so the explain key lists in the tests gained one name and nothing else moved |
| A conflict does not fail the doctor status | The doctor's refusals fail it because every gate run that loads the file stops with exit 3, as the comment above `failed` and the presentation say. A conflict stops no run: the gate reads `UNVERIFIED`, exit 4, for the files it covers. So the status lists it with that note and stays `OK`. The nearer analogue is a configured check whose tool is absent, which reads `DEGRADED` and also leaves a required check `UNVERIFIED`; that rule is about the environment, not the config, so I did not borrow it |
| The registry throws on a row with no id, but allows a wildcard | The standards' Mechanical Floor table lists `syntax.*`, `conflict.*` and `secret.*`, classes the runner's own rows declare, so a throw there would break a correct document |
| Check unreached repository rows only | A repository row is what the repository can fix and what the sample most often misses below the third folder. A hub or outside-skill row the sample misses still goes unlisted, which the docs now say |
| A broken resolution reads `DEGRADED`, an empty repository does not | A timeout or an unreadable explain document means the status could not show what it promises. An empty repository has nothing to resolve, which is a fact, not a fault |
| The dashboard field keeps `not-run` | The runner has no value for "no verdict was read", and the field needs one. Every other value is the runner's own gate |
| Edit only the presentation for the dashboard | `speckit-implement.yaml` holds scored pre and post gates and no dashboard value list, so the field's values come from the presentation alone. Its scored gates are not the runner and were left as they are |
| Log the doctor change under sk-code-quality | The last change to the same doctor script logged there, and the same entry carries the doc change |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Doctor quality tests against the `HEAD` script | exit 1, `tests 14`, `pass 10`, `fail 4`: the three new cases and the restated process assertion |
| Doctor quality tests against the changed script | exit 0, `tests 14`, `pass 14`, `fail 0` |
| Doctor quality tests against the first-round script (review-round cases) | exit 1, `tests 15`, `pass 12`, `fail 3`: the trusted no-process case, the refused reached section and the unreached row |
| Doctor quality tests after the review round | exit 0, `tests 15`, `pass 15`, `fail 0` |
| `run overrides` runner cases against the `HEAD` runner | exit 1, `tests 2`, `pass 0`, `fail 2` |
| `run overrides` runner cases against the changed runner | exit 0, `tests 2`, `pass 2`, `fail 0` |
| Every doctor suite, `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` | exit 0, `tests 490`, `pass 490`, `fail 0`, after rebuilding the ignored advisor `dist`, which the rebase had left stale |
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | exit 0, the OK line reports 18 routes validated and 2 warnings, both about other doctor commands |
| Round-two runner cases against the round-one runner | exit 1, `tests 5`, `pass 1`, `fail 4`: the unknown-id, conflict and agreement cases, and the recorded-rows case whose rows now carry `files` |
| Round-two runner cases against the changed runner | exit 0, `tests 5`, `pass 5`, `fail 0` |
| Registry suite with the module absent, then present | exit 1, `Cannot find module '../lib/rule-registry.cjs'`, then exit 0, `pass 3` |
| Shared suite, `node --test .skilled/skills/sk-code/shared/scripts/tests/*.test.cjs` | exit 0, `tests 21`, `pass 21`, `fail 0` |
| Doctor quality tests against the round-one script, then the changed one | exit 1, `tests 16`, `fail 1` (the unknown-id case), then exit 0, `pass 16` |
| Quality runner suite, `node --test .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` | exit 0, `tests 142`, `pass 142`, `fail 0`: 139 before plus three new cases |
| `compiled-route-guard.cjs --json` after the hub version step and the manifest refresh | `failures: 0` |
| A run in this repository over five SKILLED, spec and workflow files | `NO_BLOCKER_FOUND`, `p0_p1_p2_decisions: override review.todo-tracking replace from hub:sk-code/sk-code-skilled/assets/checklists/universal-checklist.md, PENDING_AGENT_JUDGMENT`. A run over one workflow file alone keeps `PENDING_AGENT_JUDGMENT` |
| `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` | `STATUS=OK legs=9` |
| `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` | `pass 5`, `fail 0` |
| Status in this repository | `Checklists: 15`, ends `STATUS=OK SOURCE="none" TRUST=none` as before, 1.30 to 1.77 s against 0.09 s before |
| `validate_document.py --json` on both docs and both changelog entries | `total_issues: 0` on each |
| `hvr_scan.py` on both changelog entries and `quality-config.md` | `hard blockers: 0`. `SKILL.md` reports 11, all on lines this change did not write, the same 11 as at `HEAD` |
| `sync-skills-hermes.cjs --check` | `PASS: 67 Hermes skill copies in sync` |
| `parent-skill-check.cjs .skilled/skills/sk-code` | the OK line reports all hard invariants passed and 0 warnings |
| Round-three explain and doctor conflict cases before the change | exit 1, `tests 2`, `pass 0`, `fail 2` |
| Round-three registry case against the round-two registry, then the changed one | exit 1, `tests 4`, `fail 1`, `Missing expected exception`, then exit 0, `pass 4` |
| Quality runner suite after round three | exit 0, `tests 143`, `pass 143`, `fail 0` |
| Shared suite after round three | exit 0, `tests 22`, `pass 22`, `fail 0` |
| Every doctor suite after round three | exit 0, `tests 491`, `pass 491`, `fail 0`, the quality file 17 of 17 |
| A run in this repository over the six changed code files after round three | `NO_BLOCKER_FOUND`, exit 0, decisions `override review.todo-tracking replace from hub:sk-code/sk-code-skilled/assets/checklists/universal-checklist.md, PENDING_AGENT_JUDGMENT`. Status ends `STATUS=OK SOURCE="none" TRUST=none` with no conflict line, and `--explain .skilled/skills/sk-code/SKILL.md` reads `rule_conflicts: []` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The sample can miss a hub or outside-skill row.** A paths selector deeper than three folders, a contentMarkers selector or a surface file or content marker can miss every sampled file. Every repository `checklists[]` row is still listed and checked, and `quality-gate.cjs --explain <path>` answers for any one file. The same sample bounds the conflicts the status shows: a conflict only on files it did not reach goes unlisted there, though a run still reports it.
2. **Surface discovery is unchanged.** A surface skill in an external repository is still never discovered. The docs now say so and name the repository-config route, and a row there adds a checklist, never a surface label.
3. **Doctor READMEs, the command doc and the feature catalog are not updated here.** `.skilled/commands/doctor/scripts/README.markdown`, `.skilled/commands/doctor/sk-code.md` and the sk-code feature-catalog doctor entry still describe the status without the `applies` block. They belong to the docs-alignment lane.
<!-- /ANCHOR:limitations -->

---
