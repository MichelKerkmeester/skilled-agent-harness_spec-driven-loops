---
title: "Goal: Phase 4: offer-lookup-at-claim"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "offer lookup at claim goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/004-offer-lookup-at-claim"
    last_updated_at: "2026-11-15T06:24:25Z"
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
# Goal: Phase 4: offer-lookup-at-claim

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A session that claims a handoff can look up the sending session's earlier turns from the claim output.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `claim` prints the section for the session named in the note's `session_id` field, never for the receiver's own session. |
| D2 | The claim re-stamps the sender's stored locator to the claim time rather than minting a new one, so the handle, runtime, session id and workspace stay as phase 3 wrote them and only `mintedAt` and `provenance.capturedAt` move. |
| D3 | Every refusal is fail-open: a missing, unreadable or invalid locator, an unready reader and a failed write each leave the claim at exit 0 with the note body printed and no section. |
| D4 | The section is withheld when the checkout cannot run the CLI, so the claim never prints a command that cannot run. |
| D5 | The section is printed after the goal packet line, so the complete command stays the last thing the receiver reads before it answers. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] A claim of a note whose `session_id` is `S` prints a `## History Lookup` section whose command carries `--session 'S'`, after the note body.
- [ ] A locator stored with `mintedAt` three hours before the claim still redeems, because the claim rewrote it to the claim time.
- [ ] A claim whose sender left no session log exits 0, prints the note body and prints no `## History Lookup` heading.
- [ ] `rg -c '^[0-9]+\. ' .skilled/commands/speckit/handoff.md` prints 9.
- [ ] `node --test .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` prints `ℹ fail 0`.
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
| Planning docs authored | Done | `spec.md`, `plan.md`, `tasks.md` and this file filled; `validate.sh --strict --quiet` prints `RESULT: PASSED` |
| Claim output measured | Done | `rg -n "printHandoffBody|completeCommandFor|Goal packet" .skilled/hooks/session-handover/bin/session-handover.cjs` prints lines 350, 644, 706, 711 and 717 |
| Lookup section absent from the handover today | Done | `rg -n "History Lookup|buildHistoryLookupSection" .skilled/hooks/session-handover/ .skilled/commands/speckit/handoff.md` exits 1 with no output |
| Implementation | Pending | Tasks T005 to T010 |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | No implementation step has run. |

### Open questions

- Open question: which built module path `claim` loads `buildHistoryLookupSection` from. Phase 2 relocates the lookup core under the handover concern, and that placement decides whether the CommonJS claim loads an ESM build or a CommonJS one. Recorded rather than guessed, because no file states the post-relocation path.
<!-- /ANCHOR:log -->
