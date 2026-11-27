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

- [ ] `find specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages -maxdepth 3 -path '*/iterations/iteration-*.md' | wc -l` prints 40
- [ ] `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md` exists and names each of the fourteen 003 phase folders in a heading
- [ ] `grep -c "openhuman-full" specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/research.md` prints 1 or more
- [ ] `git status --short` after the run lists no path outside `specs/system-skilled-bots/002-openbot-parity-research/`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research --strict` prints `RESULT: PASSED`
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
| T006 fan-out run | Pending | Waits for the operator's go |
| Continuity and decisions saved | Done | generate-context.js --full-auto exited 0 and wrote 2 operator decisions to decision-record.md |

### Deviations and findings

| Item | Note |
|------|------|
| Level 1, not Level 2 | The packet is a research record with no `acceptance-criteria.md`, like its three siblings, and `recommend-level.sh` printed Level 1 |
| The preview shows no command for a Vibe lineage | The runner builds a Vibe command only while it writes the lineage home, so the dry run names `vibe-1` and `vibe-2` and prints a note for each |
| The preview shows an empty frontier scope | Seeding runs after the preview, so the six seeds are dealt at the real run |
| `openhuman-full` is more than a copy of `openhuman-main` | Its five vendored crates hold 4,471 files, and the same folders are empty in `openhuman-main` |
<!-- /ANCHOR:log -->
