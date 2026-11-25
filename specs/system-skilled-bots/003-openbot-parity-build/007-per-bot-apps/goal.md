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

| ID | Decision |
|----|----------|
| D1 | `apps` is a filter, not a sandbox. It narrows the server list the run's config names, and it confines no child that reads a config from another path. |
| D2 | An absent `apps:` means no servers, not all servers, because the research calls the mechanism a whitelist that fails closed. |
| D3 | A declared name the config does not hold is refused, never dropped, so a typo cannot silently widen or narrow reach. |
| D4 | The five project MCP config pins stay, and the worktree write is what makes a pin resolve to the filtered file. A shared run's child reads the repository config, which is a named limit rather than a silent one. |
| D5 | The child key is admitted per dispatch through `dispatchEnvKeys`, never by a prefix rule or a widened kind list, because a prefix would admit any future caller's key built from a bot-controlled name. |
| D6 | The filtered config copies every top-level key verbatim and filters only `manual_call_templates`. The one rewrite is `load_variables_from`'s `env_file_path`, made absolute against the source config's folder. |
| D7 | The run-folder copy is written for every run, including a shared run that declares no `apps`, because it is the run's evidence and the file `UTCP_CONFIG_FILE` names. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/apps-unknown-server` prints a line starting `FAIL: apps-unknown-server:` and exits 1, and the same command over `.skilled/skills/system-skilled-bots/scripts/fixtures/clean` exits 0.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npx vitest run tests/apps.vitest.ts` exits 0, so the parse, the unknown-name refusal, the written file, the record, the child environment key, the worktree write and both refusals are covered.
- [ ] `grep -c 'dispatchEnvKeys' .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` prints 2 and `grep -c 'UTCP_CONFIG_FILE' .skilled/skills/system-skilled-bots/runtime/lib/runner.ts` prints 2.
- [ ] `grep -n 'apps: null' .skilled/skills/system-skilled-bots/assets/bot-template.txt` prints one line, and `grep -c 'apps-unenforceable' .skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` prints at least 1.
- [ ] `cd .skilled/skills/system-skilled-bots/runtime && npm test && npm run typecheck` exits 0.
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
| Acceptance criteria | Pending | All fourteen rows in `acceptance-criteria.md` read `Unmet` |

### Deviations and findings

| Item | Note |
|------|------|
| Parent binding row | The parent goal's row for this phase names `007-per-bot-apps/goal.md`, which this file supplies. No parent decision or criterion changes, so the parent goal needs no amendment and no resend. |
| The parent row's `#high` effort cell | `opencode-go/deepseek-v4.1-flash` is pinned to the max tier by policy and the fan-out builder upgrades a lower request, so the `#high` cells in `plan.md` §8 name the tier each task earns under the parent's tier rule and run at max on this route. The row's `#high` stays the phase default. |
| Scaffold tokens outside this goal's write scope | `implementation-summary.md` still carries eleven unfilled value tokens, which the implementation run fills when it writes that file. `validate.sh --strict` reports them as a warning on a Draft packet, not as an error. |
| Derived metadata re-derived | Adding `goal.md` and the `plan.md` §8 section changed the source-doc fingerprint, so `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps --apply` re-derived `graph-metadata.json`. |

### Sources

- Parent goal, whose decisions bind this phase and are not restated here: `../goal.md`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/goal.md:39] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/goal.md:72]
- Phase outcome and scope: `spec.md` sections 2 and 3. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:58] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:93]
- Requirements REQ-001 to REQ-009: `spec.md` section 4. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:140] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:153]
- Success criteria SC-001 to SC-008: `spec.md` section 5. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:164] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:171]
- Criteria AC-001 to AC-014: `acceptance-criteria.md` section 2. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/acceptance-criteria.md:54] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/acceptance-criteria.md:67]
<!-- /ANCHOR:log -->
