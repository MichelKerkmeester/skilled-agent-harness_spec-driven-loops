---
title: "Goal: Phase 3: mint-locator-at-prepare"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "mint locator at prepare goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/003-mint-locator-at-prepare"
    last_updated_at: "2026-11-15T06:24:23Z"
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
# Goal: Phase 3: mint-locator-at-prepare

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A prepared handover leaves a locator for the sending session that the receiving session's lookup CLI can redeem.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The mint runs in `prepare` only on the path that writes a relaunch record. A prepare that prints a manual claim command or declines at the hop cap mints nothing, because no automatic hop follows it. |
| D2 | `keep` mints nothing. Its claim happens after a compaction, and the compaction path already mints for that session. |
| D3 | The provenance source value is `handover`, beside `precompact` and `post_compaction`. |
| D4 | `HISTORY_LOCATOR_VERSION` stays 1. A bump would invalidate every stored locator, and this change only widens one enum. |
| D5 | The mint is skipped for a runtime with no locator kind (Cursor) and for Claude or Codex when the transcript path does not resolve. A locator that cannot be re-derived is worse than none. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] A prepare with a Claude session log stores one locator whose `provenance.source` is `handover`, and `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `# fail 0`.
- [ ] With the hook-state directory unwritable, `prepare` exits 0 and the relaunch record exists.
- [ ] `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/history-locator.vitest.ts` exits 0.
- [ ] The measured command prints a non-zero count for both handover files, against 0 for both before the change.
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
| T001 measured the current mint count | Pending | — |
| T002 confirmed the compiled helpers | Pending | — |
| T003 handover CLI suite green before the change | Pending | — |
| T004 schema provenance source | Pending | — |
| T005 locator contract test | Pending | — |
| T006 mint helper in the handover core | Pending | — |
| T007 call site in prepare | Pending | — |
| T008 CLI cases | Pending | — |
| T009 handover CLI suite after the change | Pending | — |
| T010 locator contract suite | Pending | — |
| T011 measured command after the change | Pending | — |
| T012 packet validation | Pending | — |

### Deviations and findings

| Item | Note |
|------|------|
| The Claude compaction offer checks the provenance source it expects | A handover locator in the shared state field is withheld by that path rather than printed with a command that cannot redeem it. |
| The CLI refuses a locator 30 minutes old | A handover locator is stamped at prepare time, so a slow hop reaches the CLI as `locator_stale`. The handover itself is unaffected. |
<!-- /ANCHOR:log -->
