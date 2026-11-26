---
title: "Goal: Phase 7: per-bot-apps"
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
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/007-per-bot-apps"
    last_updated_at: "2026-11-25T19:58:11Z"
    last_updated_by: "create-goal"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "w3-007-per-bot-apps"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 7: per-bot-apps

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Deliver Phase 7 of `../goal.md`: a bot declares the connector servers it may reach, every run writes a filtered UTCP config holding only those, the run record says which names were honored, and the definition checker fails closed on a name the config does not hold.

### Decisions

Frozen choices. Changing one is an amendment.

The packet's ten decisions are D1 to D10 in [`../contracts/decisions.md`](../contracts/decisions.md), and D5 there is the one that lands in this phase: a shared run that declares no `apps` records `posture.apps: []` while its child reads the full repository config, and a shared run that declares `apps` is refused `apps-unenforceable`. This phase's own decisions are G1 to G8, so a bare `D` number in this packet always means the packet's.

| ID | Decision |
|----|----------|
| G1 | `apps` is a filter, not a sandbox. It narrows the server list the run's config names, and it confines no child that reads a config from another path. |
| G2 | An absent `apps:` means no servers, not all servers, because the research calls the mechanism a whitelist that fails closed. |
| G3 | A declared name the config does not hold is refused, never dropped, so a typo cannot silently widen or narrow reach. |
| G4 | The five project MCP config pins stay, and the worktree write is what makes a pin resolve to the filtered file. A shared run's child reads the repository config, which is a named limit rather than a silent one. |
| G5 | The child key is admitted per dispatch through `dispatchEnvKeys`, never by a prefix rule or a widened kind list, because a prefix would admit any future caller's key built from a bot-controlled name. |
| G6 | The filtered config copies every top-level key verbatim and filters only `manual_call_templates`. The one rewrite is `load_variables_from`'s `env_file_path`, made absolute against the source config's folder. |
| G7 | The run-folder copy is written for every run, including a shared run that declares no `apps`, because it is the run's evidence and the file `UTCP_CONFIG_FILE` names. |
| G8 | A tree found holding the filtered file at the next open is restored before anything else is written. The next open compares the tree's `.utcp_config.json` with the checkout's and restores from the tree's own git index when the two differ, so a run killed between the write and the restore cannot leave the filtered copy as the base a later run copies from. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server` prints a line starting `FAIL: apps-unknown-server:` and exits 1, and the same command over `.skilled/skills/system-skilled-bots/scripts/fixtures/clean` exits 0.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts` exits 0, so the parse, the unknown-name refusal, the written file, the record, the child environment key, the worktree write, both refusals and the killed-run restore are covered.
- [ ] `grep -c 'dispatchEnvKeys' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints 2, `grep -c 'UTCP_CONFIG_FILE' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` prints 2 and `grep -c 'utcp_config.json' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` prints 2, so the child key and both restores are there.
- [ ] `grep -n 'apps: null' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints one line, and `grep -c 'apps-unenforceable' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints at least 1.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm test && npm run typecheck` exits 0.
- [ ] `ls specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design` prints `fixtures`, `fixtures.md`, `mockups.md`, `records.md`, `refusals.md` and `state-machines.md`, and every verify command in those documents prints what it says.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps --strict` prints `RESULT: PASSED`.
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
| Goal authored | Done | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps` prints `RESULT: PASSED (5/5 checks)` |
| Packet validates | Done | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps --strict` prints `RESULT: PASSED` |
| The `apps` key | Pending | `grep -c 'apps' .skilled/skills/system-skilled-bots/runtime/lib/definition.ts` prints 0 today |
| The filtered config | Pending | `ls .skilled/skills/system-skilled-bots/runtime/lib/apps.ts` exits 1 today, so no module writes the file |
| The child key | Pending | `grep -c 'dispatchEnvKeys' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints 0 today |
| The checker invariant | Pending | `grep -c 'apps-unknown-server' .skilled/skills/system-skilled-bots/scripts/bot-check.cjs` prints 0 today |
| The template field | Pending | `grep -c 'apps: null' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints 0 today |
| Acceptance criteria | Pending | All sixteen rows in `acceptance-criteria.md` read `Unmet`, except AC-016, which the design documents meet today |
| The five design documents | Done | `ls specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/design` prints `fixtures`, `fixtures.md`, `mockups.md`, `records.md`, `refusals.md` and `state-machines.md` |
| The five goldens | Done | The three commands in `design/fixtures.md` section 5 print `5 goldens parse`, `4 top-level keys, 1 template and 0 templates, absolute dotenv path` and `worktree apps github, shared apps empty` |
| The next-open restore | Pending | `grep -c 'utcp_config.json' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` prints 0 today, so neither restore exists |

### Deviations and findings

| Item | Note |
|------|------|
| Parent binding row | The parent goal's row for this phase names `007-per-bot-apps/goal.md`, which this file supplies. No parent decision or criterion changes, so the parent goal needs no amendment and no resend. |
| The parent row's `#high` effort cell | `opencode-go/deepseek-v4.1-flash` is pinned to the max tier by policy and the fan-out builder upgrades a lower request, so the `#high` cells in `plan.md` §8 name the tier each task earns under the parent's tier rule and run at max on this route. The row's `#high` stays the phase default. |
| Scaffold tokens outside this goal's write scope | `implementation-summary.md` still carries six unfilled value tokens, which the implementation run fills when it writes that file. `validate.sh --strict` reports them as a warning on a Draft packet, not as an error. |
| Derived metadata re-derived | Adding `goal.md` and the `plan.md` §8 section changed the source-doc fingerprint, so `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps --apply` re-derived `graph-metadata.json`. |
| Phase decisions renumbered | The phase's own decisions were D1 to D7, which collided with the packet's D1 to D9 in `../contracts/decisions.md`. They were renumbered D10 to D17, and on 2026-11-26 the contract reconciliation pass renamed them G1 to G8, because the packet's own D10 (the conversation line break) now exists in `../contracts/decisions.md`. A bare `D` number in this packet always means the packet's decision. No choice changed, only its label. |
| The next-open restore added | Work order WO-14 in the plan-depth research adds one sentence to REQ-003 and one test row for a run killed before the restore. The rule is G8, the mechanism is `design/state-machines.md` section 3 and the case is row 21 of `design/fixtures.md` section 1. |
| The design documents added | Five documents under `design/` and five goldens under `design/fixtures/`, so a builder reads a field table, a gate order, a refusal catalogue, a fixture matrix and a literal text sample rather than deciding any of them. REQ-010 and AC-016 carry them. |
| Contract citations into this phase's files | Adding the design section and the two-restore paragraphs moved the lines the packet's contracts cite. In `spec.md` the shift is 21 lines from the top, so `contracts/refusals.md` lines 123 to 127, `contracts/records.md` lines 151 and 500 and `contracts/decisions.md` line 28 now land 21 lines early. In `plan.md` the shift is 2 lines before the module list and 14 lines after it, so `contracts/runtime-architecture.md` lines 51, 178 and 180 land early by that much. The same drift already affects `001-activity-and-actor/spec.md` line 156, which three contracts cite and which now holds a heading. The durable fix is for a contract to cite a REQ id or a section name rather than a line, and that edit is the contract owner's, not this phase's. |

### Sources

- Parent goal, whose decisions bind this phase and are not restated here: `../goal.md`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/goal.md:39] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/goal.md:72]
- Phase outcome and scope: `spec.md` sections 2 and 3. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md, section "Problem Statement"] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md, section "3. SCOPE"]
- Requirements REQ-001 to REQ-010: `spec.md` section 4.
- Success criteria SC-001 to SC-010: `spec.md` section 5.
- Criteria AC-001 to AC-016: `acceptance-criteria.md` section 2.
- The packet's decisions D1 to D9, of which D5 lands here: `../contracts/decisions.md`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/decisions.md, D5]
- The refusal columns this phase's catalogue cites: `../contracts/refusals.md` section 3.6. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md, section "3.6 Phase 007, per-bot apps"]
- The run record's field table and the version rule: `../contracts/records.md` section 4 and `../contracts/versioning.md` section 1. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md, section "4. RUN RECORD ADDITIONS"] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/versioning.md, section "1. THE RULES"]
- The module's group and imports: `../contracts/runtime-architecture.md` section 1.2. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/contracts/runtime-architecture.md, section "1.2 New modules", row `apps.ts`]
- The work order this phase executes: the plan-depth research section 6, WO-14. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:539]
<!-- /ANCHOR:log -->
