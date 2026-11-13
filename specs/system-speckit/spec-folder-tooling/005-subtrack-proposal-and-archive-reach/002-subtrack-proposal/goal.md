---
title: "Goal: Phase 2: subtrack-proposal"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "subtrack proposal goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach/002-subtrack-proposal"
    last_updated_at: "2026-11-13T10:07:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-subtrack-proposal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: subtrack-proposal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make system-spec-kit propose a subtrack at the right moment, as a complete whole-track map for a crowded flat track and as a best-fit answer for a new packet.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `suggest-subtracks.mjs` is read-only. It never moves a packet and never writes a file. |
| D2 | The default threshold is 8 live packets, and `--threshold <n>` overrides it. |
| D3 | A retroactive map names every live packet of the track exactly once, in the `relocate.mjs` `--map` format. |
| D4 | The `create.sh` line is advisory. It goes to stderr and never changes the exit code. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/system-spec-kit/runtime/cli/spec/suggest-subtracks.mjs --track <flat track with more than 8 live packets>` exits 0 and prints one `from` entry per live packet
- [ ] That map, passed to `relocate.mjs --map <file>` as a dry run, passes preflight and the run exits 1
- [ ] On a flat track of 7 live packets the tool prints no map, and `--threshold 5` prints one
- [ ] `--track <track> --describe "<text>"` prints one existing subtrack name or `none fits`
- [ ] `git status --porcelain` prints the same lines before and after both modes run
- [ ] `rg -c -i "subtrack|sub-track" .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` prints 3 or more
- [ ] `create.sh --json` in a scratch tree at the threshold exits 0, prints parseable JSON on stdout and one advisory line on stderr
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
| Planning documents authored | Done | `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` in this folder |
| Implementation | Pending | Not started |
| Build: suggest-subtracks.mjs, advise_sub_track and option C wording | Done | suggest-subtracks.mjs created and advise_sub_track added to create.sh by DeepSeek V4.1 Flash through the dsh harness. Option C changed on every surface by operator decision, speckit-implement.yaml included. Real tree: git status identical around every run. npm test exit 0, equal to the phase 001 baseline. Gate suites 124 pass 0 fail. Open: AC-007 has no recorded create.sh --json run |
| Finding: FLAT track is a fixture | Done | No real flat track holds 8 or more live packets, the largest is cli-classifier with 6. Fixture demo, 10 packets, in a throwaway clone under /private/tmp: map exit 0 with 10 entries, relocate.mjs dry run exit 1 moves=10 moved=0 |

### Deviations and findings

| Item | Note |
|------|------|
| Open question: `speckit-implement.yaml` line 71 | It carries the same option C wording. The approved plan names only the plan and complete assets, so these docs leave it unchanged until the operator decides. |
| Flag names | The approved plan names no flag for the threshold or for present mode. These docs use `--threshold` and `--describe`. |
| Plan pointer `create.sh:1553` | `list_recent_track_packets` is declared at line 1552. |
<!-- /ANCHOR:log -->
