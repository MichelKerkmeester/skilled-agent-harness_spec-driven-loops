---
title: "Goal: Phase 5: deprecate-compaction-offer"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "deprecate compaction offer goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-relaunch/001-history-lookup-handover-integration/005-deprecate-compaction-offer"
    last_updated_at: "2026-11-15T07:45:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the phase planning docs"
    next_safe_action: "Run tasks T001 to T003 once phase 004 is proven"
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
# Goal: Phase 5: deprecate-compaction-offer

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Offer the session history lookup once, at the handover, by removing every compaction-time mint and offer.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | After this phase no compaction path mints a locator or prints the lookup section on any runtime. |
| D2 | The compaction summary and the `/speckit:resume` pointer stay unchanged on Pi, DSH and Devin. |
| D3 | The locator schema, the `hl1_` digest and the lookup CLI are not changed by this phase. |
| D4 | The OpenCode plugin is deleted, not gated behind a flag. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n "History Lookup|buildHistoryLookupSection|mintHistoryLocator"` over the seven producer files prints nothing and exits 1
- [ ] `npx vitest run tests/history-*.vitest.ts tests/hook-precompact.vitest.ts` exits 0 from `.skilled/skills/system-spec-kit/runtime`
- [ ] `node --test .opencode/plugins/tests/` exits 0
- [ ] `npx tsc --noEmit -p tsconfig.json` exits 0 from `.skilled/skills/system-spec-kit/runtime`
- [ ] The Pi, DSH and Devin suites still assert the summary and `/speckit:resume`
- [ ] `validate.sh` on this packet prints `RESULT: PASSED`
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
| Planning docs | Done | Level 1 spec, plan, tasks and this goal |
| Producer survey | Done | `spec.md` Measured Behavior: seven files, 22 references, and the per-file table in `plan.md` section 3 |
| Implementation | Pending | Starts at T001, gated on phase 004 |

### Deviations and findings

| Item | Note |
|------|------|
| Test suites | Four suites are deleted rather than rewritten, because each one proved an offer that no longer exists. `plan.md` section 5 names what replaces each proof. |
| OpenCode coverage | The plugin test was the only OpenCode CLI redemption proof. Phase 004's claim tests own the offer that reaches OpenCode. |

### Open questions

Open question: Does the handover mint a Claude locator over the transcript path? The CLI recomputes the handle from the resolved transcript at `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/cli.ts:397`, so a locator minted over the identity alone would refuse with `handle_mismatch`. Phase 003 and 004 must answer it; this phase does not change the CLI.

Open question: Who carries the OpenCode purpose line once `.opencode/plugins/session-history-lookup.js` is gone? `specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/spec.md:188` planned to ride that plugin. The operator decides, and phase 006 owns the docs.
<!-- /ANCHOR:log -->
