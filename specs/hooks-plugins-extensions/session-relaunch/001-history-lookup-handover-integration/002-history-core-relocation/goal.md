---
title: "Goal: Phase 2: history-core-relocation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "history core relocation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/002-history-core-relocation"
    last_updated_at: "2026-11-15T06:24:21Z"
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
# Goal: Phase 2: history-core-relocation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The handover concern owns the runnable history lookup entry, and the printed command names it, with the history suites at the same count.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The TypeScript source and its build stay in `.skilled/skills/system-spec-kit/runtime/`; the handover concern owns the runnable `.mjs` entry. |
| D2 | `HISTORY_LOOKUP_COMMAND` names the concern entry, not the compiled `dist/hooks/lib/history/cli.js`. |
| D3 | The entry calls the same `runHistoryLookupCli`; no lookup operation, reply bound or search behaviour changes. |
| D4 | The core tests stay in `runtime/tests/`; the concern gets its own `node --test` entry test. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/hooks/session-relaunch/bin/history-lookup.mjs` prints `{"ok":false,"code":"invalid_usage"}` and exits 2.
- [ ] `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/history-*.vitest.ts` prints `Test Files 13 passed (13)` and `Tests 191 passed (191)`.
- [ ] `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0.
- [ ] `rg -n "HISTORY_LOOKUP_COMMAND =" .skilled/skills/system-spec-kit/runtime/hooks/lib/history/lookup-offer.ts` prints `node .skilled/hooks/session-relaunch/bin/history-lookup.mjs`.
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
| Placement compared | Done | `plan.md` §3 compares A and B and names A's four failures. |
| Baseline recorded | Done | `npx vitest run tests/history-*.vitest.ts` printed 13 files and 191 tests on 2026-11-15. |
| Entry, constant and tests | Pending | Tasks T004 to T011. |
| Verification | Pending | Tasks T012 to T015. |

### Deviations and findings

| Item | Note |
|------|------|
| The task brief said to move the tests and README with the core. | The tests stay with the source because the runtime's vitest config roots at `.skilled/skills/system-spec-kit` (`vitest.config.ts:15`) and includes `runtime/tests/**` (`vitest.config.ts:18-20`). The concern gets its own entry test instead. |
| The task brief said to update every importer. | No importer changes. The eight code importers keep importing `lib/history`; only the printed command and the seven CLI-path assertions in four test and support files change. |

### Open questions

- Answered 2026-11-15: the operator accepts split ownership. The source and the build stay in the spec-kit runtime, and the handover concern owns the runnable entry, the printed command, the docs and the wiring. The orchestrating session checked the four facts in `plan.md` section 3 against the code and all four hold. The full move is possible but costs a build step for the concern, breaking the two-way import between `hook-state.ts` and `lookup-offer.ts`, and an exception to the hooks README rule.
<!-- /ANCHOR:log -->
