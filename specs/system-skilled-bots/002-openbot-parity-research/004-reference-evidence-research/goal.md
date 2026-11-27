---
title: "Goal: Reference evidence research for the OpenBot parity build"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "reference evidence research goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research"
    last_updated_at: "2026-11-27T06:31:18Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Reference evidence research for the OpenBot parity build

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give each of the fourteen 003 build phases the reference code to lift or mirror and the pitfalls to guard against, and rank what the ten reference repos have that the plan and the skip list both miss.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One `/deep:research` fan-out in expansive depth mode: two `cli-mistral-vibe` lineages on `deepseek-flash` and two `cli-pi` lineages on `deepseek-v4.1-flash-1017` at max thinking, 10 iterations each, with the stop policy set to max iterations |
| D2 | The run starts from the six seeds in `scratch/frontier-seed.json` and the topic in `scratch/research-topic.txt` |
| D3 | Every input is read-only. No file outside this packet changes |
| D4 | Every finding names its 003 phase or goes under net-new, and carries a `[SOURCE: path:line]` |
| D5 | A finding one of the three earlier syntheses already carries is cited, not repeated |
| D6 | The run starts on `main` in the primary checkout, where the gitignored reference repos exist |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `find specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages -maxdepth 3 -path '*/iterations/iteration-*.md' | wc -l` prints 40
- [x] `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md` exists and names each of the fourteen 003 phase folders in a heading
- [x] `grep -c "openhuman-full" specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md` prints 1 or more
- [x] `git status --short` after the run lists no path outside `specs/system-skilled-bots/002-openbot-parity-research/`
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research --strict` prints `RESULT: PASSED`
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
| T001 topic written | Done | `scratch/research-topic.txt`, 20 lines |
| T002 seeds written | Done | `frontier-admit.cjs seed` against a scratch folder admitted `F-1-001` to `F-1-006` and pruned none |
| T003 inputs and executors | Done | `scratch/preflight.txt`: ten repos, `vibe 3.1.2`, `pi 1.6.0` |
| T004 provider probes | Done | `scratch/preflight.txt`: both probes answered `OK`, and Vibe's `export.json` records `exit_code` 0 and `outcome` `finished` |
| T005 dry run | Done | `scratch/dry-run.txt`: four lineages previewed, `dry_run_halt` printed, no `research/` folder written |
| T006 fan-out run | Done | `research/orchestration-summary.json` records `total_cli_lineages` 4, `succeeded` 4 and `failed` 0. The run took about 17 minutes |
| T007 reruns | Done | None needed, `failed` is 0 |
| T008 synthesis | Done | `research/research.md` names the fourteen phase folders in `###` headings and ranks sixteen net-new candidates |
| T009 re-check | Done | Seven verification workers opened every cited line. 121 rows stood (90 confirmed, 31 weak) and `research/regrade-log.md` held 332 rows. After the two reviews below, 86 are confirmed and 35 weak, and all 994 source tags in the two files resolve |
| Synthesis reviewed twice and fixed | Done | A single-pass Opus review raised 20 items. A deep review by two cli-mistral-vibe lineages of 10 iterations each returned CONDITIONAL with 1 P1 and 26 P2. A separate Opus worker checked all 47: 43 hold, 3 partly hold, 1 skipped as outside the repository. Every one that held is fixed in `research/research.md` and `research/regrade-log.md`. Record: `review/review-report.md` and `review/fix-log.md` |
| T010 iteration count | Done | The `find` command of the first criterion prints 40 |
| T011 write containment | Done | `git status --short` lists paths under this packet only |
| T012 validation | Done | `validate.sh --strict` prints `RESULT: PASSED` for this folder and for the parent with `--recursive` |
| Continuity and decisions saved | Done | generate-context.js --full-auto exited 0 and wrote 2 operator decisions to decision-record.md |

### Deviations and findings

| Item | Note |
|------|------|
| Level 1, not Level 2 | The packet is a research record with no `acceptance-criteria.md`, like its three siblings, and `recommend-level.sh` printed Level 1 |
| The preview shows no command for a Vibe lineage | The runner builds a Vibe command only while it writes the lineage home, so the dry run names `vibe-1` and `vibe-2` and prints a note for each |
| The preview shows an empty frontier scope | Seeding runs after the preview, so the six seeds are dealt at the real run |
| `openhuman-full` is more than a copy of `openhuman-main` | Its five vendored crates hold 4,471 files, and the same folders are empty in `openhuman-main` |
| `openhuman-full` has 21 vendored crates, not five | The spec, the topic and seed F-1-003 name five. The synthesis covers all 21 in section 4, and every one is GPL-3.0 |
| The orchestrator did not re-read every finding itself | Seven Opus workers, one per phase group, opened every cited line. The orchestrator read their tables, opened 20 load-bearing citations and reran four counts. Section 9 of the synthesis says which is which |
| The workflow was run step by step, not as one command call | The fan-out, the merge, the closeout event, the spec write-back and the status flip each ran from `deep-research.yaml`. The context-loading step was skipped, because a fan-out root has no strategy file to inject into |
| `/speckit:resume` ran without its confirm checkpoints | The handoff note named the packet, and the goal bars a pause |
| `maxDurationMinutes` is 120 | The workflow default. The plan-depth run used 180. No lineage came near the limit |
| A stray row in one lineage log | `research/lineages/pi-2/deep-research-state.jsonl` holds one `synthesis_complete` row with vibe-1's lineage id, written after vibe-1 ended. The cause is not confirmed. The iteration records are unaffected |
| A stray folder in one lineage | `research/lineages/vibe-2/` holds a `specs` subfolder the lineage created inside its own folder. Nothing outside the packet was written |
| 30 of 718 citations in the iteration records do not resolve | Wrong paths, ranges past the end of a file and tags with no line. Section 9 of the synthesis lists the counts per lineage |
| Both review lineages are marked failed | Each ran 10 iterations and wrote its report, but neither state log holds a `terminal_gates` row, so the runner marked both failed and the merge carries their findings as untrusted. vibe-1 also wrote its closeout row with the root session id. Every finding was re-checked before any fix. The defect belongs to the deep-loop runtime |
| The spec write-back event is not in the state log | The findings fence was written under the `questions` anchor of `spec.md`. The state gateway accepted the `synthesis_complete` event and refused the `spec_mutation` event twice with "Payload validator rejected the event". The row was not written by hand |
<!-- /ANCHOR:log -->
