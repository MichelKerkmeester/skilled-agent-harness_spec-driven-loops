---
title: "Goal: Phase 4: computer-exposure"
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
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/004-computer-exposure"
    last_updated_at: "2026-11-25T19:53:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w3-004-computer-exposure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: computer-exposure

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Name the directory a bot run works in, its branch and its run folder in the prompt, and carry that path and branch into the run record and every `bots status` row, so an operator can tell where an unattended run worked without opening its folder.

### Decisions

Frozen choices. Changing one is an amendment.

These five are this phase's own decisions. They are not the packet's D1 to D9, which are frozen in `contracts/decisions.md` and bind every phase. Where the two meet, the packet's decision wins and this phase's row only says how it lands here.

| ID | Decision |
|----|----------|
| D1 | The working-place line takes the shared section order's working-place slot, after the spec-folder line and before the checkout line, so 005's memory block and 009's skills block land after it without moving it. |
| D2 | `evidence.branch` is a string for every dispatched run and null only when git reports a detached HEAD or does not answer. A failed read never refuses a run. |
| D3 | Both status parts are appended after every part the row already prints, so no existing position moves and no consumer parses a new one. |
| D4 | `SCHEMA_VERSION` stays `'2'`. The two fields ride in the run summary's JSON column, so an index built before this phase opens without `--rebuild`. |
| D5 | This phase adds no isolation surface: no container, no per-bot token and no vault login, and `posture.ts` keeps deciding which runs get a tree. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- dispatch` prints no `failed` and names `workingPlaceLine` in both shapes, with the line after the spec-folder line and before the checkout line.
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- isolation` prints no `failed`, and a worktree run's prompt holds `evidence.worktreePath` while the stub's `cwd` equals it.
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime test -- runner` prints no `failed`, and covers a shared run's branch, a refusal's two nulls and a parked prompt that gains the line.
- [ ] `node .skilled/bin/bots.cjs status` prints `branch <name>` on a row whose last run recorded a branch, and `node .skilled/bin/bots.cjs status --json` carries `lastRun.branch` and `lastRun.worktreePath`.
- [ ] `node .skilled/bin/bots.cjs status` exits 0 against an index built before this phase, without `--rebuild`, and `rg -n "SCHEMA_VERSION = '2'" .skilled/skills/system-skilled-bots/runtime/lib/status-index.ts` prints one line.
- [ ] `rg -n 'working place' .skilled/skills/system-skilled-bots/runtime/lib/README.md` prints one line, `rg -n 'branch <name>' .skilled/skills/system-skilled-bots/bots-status/references/status-and-inbox.md` prints one line, and `ls specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/design` prints six documents and `fixtures` with every golden in `design/fixtures/` parsing.
- [ ] `npm --prefix .skilled/skills/system-skilled-bots/runtime test` prints no `failed`, `npm --prefix .skilled/skills/system-skilled-bots/runtime run typecheck` exits 0, and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure --strict` prints `RESULT: PASSED`.
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
| Goal authored | Done | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure` prints `RESULT: PASSED (5/5 checks)` |
| Parent binding row | Done | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build --strict` no longer lists `004-computer-exposure/goal.md` among its `SPECDOC_SUFFICIENCY_006` errors |
| Design folder | Done | `ls specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/design` prints six documents and `fixtures`, and `ls .../design/fixtures` prints twelve goldens and `README.md` |
| Working-place line | Pending | T009 and T010. `rg -n 'workingPlaceLine' .skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` prints no line today |
| Branch on every record | Pending | T011 to T014. The measured record holds `"branch":null` for a shared run |
| Status row parts | Pending | T015 to T017. `node .skilled/bin/bots.cjs status` prints no `branch` part today |
| Docs | Pending | T023 and T024. Neither file names the working place yet |
| Packet validation | Pending | T032. The packet prints `RESULT: PASSED` before the edits and must still print it after them |

### Deviations and findings

| Item | Note |
|------|------|
| The design folder is authored in the planning pass, not the build | `spec.md` section 4 lists six documents and twelve goldens under `design/`, and REQ-010 makes the folder the authority for every shape the phase writes. The build waves read it rather than deciding a shape, which is why T008 sits in Setup and every implementation task names the document it needs. |
| The parent row's single `#high` effort cell | All three implementation workers carry `#high` in `plan.md`, which is the parent row's cell and its note that the work is edits to settled modules only. The tier rule would put two of them at `#max`, and the frozen row wins. The difference costs nothing on this route, because `opencode-go/deepseek-v4.1-flash` is pinned to max by policy. |
| `spec.md` and `plan.md` cite `specs/system-skilled-bots/003-openbot-parity-build/spec.md:130` for the shared prompt order | Line 130 is the `bots inbox --json` row. The order is at line 134. This goal cites 134. The two existing citations are left alone because this goal's write scope is `goal.md`. |
| The verify commands name the two multi-word commands in full | `npm --prefix .skilled/skills/system-skilled-bots/runtime` and `node .skilled/bin/bots.cjs` are written out at every use in `tasks.md` and `plan.md`. A variable holding either one would need word splitting, and the shell this packet is verified in is zsh, which does not split. |

### Sources

- Parent goal, whose decisions bind this phase and are not restated here: `../goal.md`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/goal.md:39] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/goal.md:69]
- Phase outcome and scope: `spec.md` sections 2 and 3. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:63] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:66]
- Success criteria SC-001 to SC-006: `spec.md` section 5. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:203] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:208]
- Criteria AC-001 to AC-010: `acceptance-criteria.md` section 2. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/acceptance-criteria.md:39] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/acceptance-criteria.md:48]
- The packet's frozen decisions D1 to D9, which outrank this phase's own: `contracts/decisions.md`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/decisions.md:1]
<!-- /ANCHOR:log -->
