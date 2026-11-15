---
title: "Feature Specification: Phase 4: offer-lookup-at-claim"
description: "A receiving session claims a handoff and receives only the note body, so a detail the sender left out is unreachable even though the sender's transcript still exists. This phase makes claim re-mint the sender's locator and print the history lookup section, and adds one receiver step to the handoff command."
trigger_phrases:
  - "offer lookup at claim"
  - "phase 4 offer lookup at claim"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: offer-lookup-at-claim

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/399-hook-feature-subtracks` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 6 |
| **Predecessor** | 003-mint-locator-at-prepare |
| **Successor** | 005-deprecate-compaction-offer |
| **Handoff Criteria** | A claim prints a `## History Lookup` section whose command names the sender session, the locator it redeems was minted at claim time, and a claim whose sender left no session log still exits 0 with the note body. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Move the session history lookup out of the compaction path and into the in-session handover, so a receiving session can look up the sender's earlier turns. specification.

**Scope Boundary**: Only the `claim` output and the receiver steps change. `prepare` already mints the locator (phase 3), the lookup core and its four operations are unchanged (phase 2), and no compaction path is touched (phase 5).

**Dependencies**:
- Phase 3 leaves a locator for the sending session in that session's hook state file, keyed by `getStatePath(senderSessionId)`.
- Phase 2 settles where the lookup core and its built `lookup-offer` module live, so `claim` can load `buildHistoryLookupSection`.
- The reader capability table decides whether the sender's runtime can be read at all.

**Deliverables**:
- A re-stamp of the sender's stored locator at claim time, so its freshness window starts at the claim.
- The shared `## History Lookup` section printed after the note body, naming the sender session.
- A fail-open path that keeps the claim working when the locator or the section cannot be produced.
- One receiver step in `.skilled/commands/speckit/handoff.md` section 5, and the tests that cover all three.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A session that claims a handoff receives the note's four sections, the complete command and the goal packet, and nothing else (`session-handover.cjs:706-720`). The sending session's transcript is still readable by the runtime reader, and the lookup CLI redeems it for whoever holds the locator, because it compares the `--session` argument with the stored locator and never asks who is calling (`cli.ts:540-548`). The claim output prints no such command, so a detail the sender did not write down is unreachable and the receiver can only guess or ask.

### Purpose
A session that claims a handoff can look up the sending session's earlier turns from the claim output, on the same runtime and for the immediate predecessor only.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -n "printHandoffBody|completeCommandFor|Goal packet" .skilled/hooks/session-handover/bin/session-handover.cjs
350:function printHandoffBody(filePath) {
644:      + `\`${nudge.completeCommandFor(handoffPath, USAGE_PROGRAM)}\`.\n`,
706:  printHandoffBody(handoffPath);
711:    `\nWhen the remaining work is done, run \`${nudge.completeCommandFor(handoffPath, nudge.CLI_COMMAND)}\``
717:      `\nGoal packet: ${goalPacket} (the goal the sending session worked under;`

$ rg -n "History Lookup|buildHistoryLookupSection" .skilled/hooks/session-handover/ .skilled/commands/speckit/handoff.md
$ echo $?
1
```

The `claim` function prints the note body at line 706, the complete command at line 711 and the goal packet at line 717. The second run exits 1 with no output, so neither the handover tree nor the handoff command mentions the lookup section today.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Re-stamp the sender's stored locator at claim time, so `mintedAt` and `provenance.capturedAt` carry the claim time and the handle is unchanged.
- Print the shared `## History Lookup` section after the note body, with the sender's session id and handle in its command.
- Keep the claim at exit 0 and its body intact when the locator, the capability check or the section build fails.
- Add one receiver step to `.skilled/commands/speckit/handoff.md` section 5 that tells the receiver to look up a detail the note does not spell out before guessing.

### Out of Scope
- Minting the locator at `prepare` - phase 3 owns it, and this phase only reads what it left behind.
- The lookup operations, the reply bound and the search behaviour - unchanged, because the receiver redeems an existing locator through the existing CLI.
- The compaction-time mint and offer - phase 5 removes them, and this phase adds no second offer path.
- Cross-runtime and multi-hop lookups - the locator holds one runtime and one session, so a receiver reads its immediate predecessor on the same runtime only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | Modify | A re-stamp helper that rewrites `mintedAt` and `provenance.capturedAt` on the sender's stored locator and persists it through the hook-state writer. |
| `.skilled/hooks/session-handover/bin/session-handover.cjs` | Modify | `claim` re-mints the sender's locator, builds the section and prints it after the note body, all inside a fail-open guard. |
| `.skilled/commands/speckit/handoff.md` | Modify | One receiver step in section 5 that points at the printed lookup command. |
| `.skilled/hooks/session-handover/tests/session-handover-cli.test.cjs` | Modify | Claim cases for the section, its position, the re-minted timestamp and the fail-open path. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `claim` prints the shared `## History Lookup` section after the note body, for the session named in the note's `session_id` field. | The claim test asserts the section heading index is greater than the body index and that the printed command carries `--session '<sender id>'`. |
| REQ-002 | `claim` re-mints the sender's locator at claim time, so a manual claim made hours after `prepare` still redeems. | A locator stored with `mintedAt` three hours before the claim is rewritten to the claim time, and the CLI's freshness check accepts it (`cli.ts:212-217`). |
| REQ-003 | Every refusal keeps the claim working: a missing, unreadable or invalid locator, a runtime with no ready reader and a failed write each leave the claim at exit 0 with the note body printed and no section. | The fail-open case exits 0, prints the note body and prints no `## History Lookup` heading. |
| REQ-004 | The section is withheld when the checkout cannot run the CLI, so the claim never prints a command that cannot run. | `buildHistoryLookupSection` returns null for a workspace without `.git` or without the CLI path (`lookup-offer.ts:94-96`, `lookup-offer.ts:136`), and the claim exits 0 with no section. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `.skilled/commands/speckit/handoff.md` section 5 gains one receiver step that tells the receiver to look up a detail the note does not spell out before guessing. | The step appears once in the numbered list of eight receiver steps, and `rg -n` finds it in section 5. |
| REQ-006 | The printed section stays within the shared 600-character bound. | The claim test asserts the section length is at most `HISTORY_LOOKUP_MAX_CHARS`, which is 600 (`lookup-offer.ts:21`). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A claim of a note whose `session_id` is `S` prints a `## History Lookup` section whose command carries `--session 'S'` and `--handle 'hl1_...'`, after the note body.
- **SC-002**: A locator minted three hours before the claim still redeems, because the claim rewrote `mintedAt` to the claim time.
- **SC-003**: A claim whose sender left no session log exits 0 and prints the note body with no section.
- **SC-004**: The receiver step appears once in `handoff.md` section 5 and names the lookup command the claim prints.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 3's locator in the sender's hook state file | No locator to re-stamp, so no section | Fail open: the claim prints the body and exits 0, and the receiver works from the note alone |
| Dependency | The built `lookup-offer` module that `buildHistoryLookupSection` lives in | The claim cannot build the section | Load it inside the fail-open guard and print nothing when the load throws |
| Risk | `getStatePath` keys the state directory by `process.cwd()` (`hook-state.ts:459-472`), and the claim runs in the receiver's folder | High: a receiver started in another folder reads no locator | The hop preserves the sender's `cwd`, and a miss is fail-open rather than a claim failure |
| Risk | The printed command checks `process.cwd()` against `locator.workspace` (`cli.ts:547`) | Med: a receiver in a subfolder could print a command that refuses | The command moves to `git rev-parse --show-toplevel` first (`lookup-offer.ts:70`), and `lookupRunsFrom` withholds the section when that root cannot run the CLI |
| Risk | The note's `runtime` field is free text, while the locator schema admits six runtimes (`hook-state.ts:240`) | Med: an unlisted runtime could produce a locator the CLI refuses | A runtime outside the six gets no section, and the claim still exits 0 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The note's `runtime` field is free text and `HistoryLocatorSchema` accepts only claude, codex, pi, devin, dsh and opencode (`hook-state.ts:240`). Decision: a note naming any other runtime gets no section, and the claim still exits 0.
- A manual claim can arrive days after `prepare`, and the sender's transcript may have been rotated away. Decision: the re-stamp succeeds and the CLI then refuses with `session_not_found` (`cli.ts:376`); the claim itself still exits 0.
<!-- /ANCHOR:questions -->

---
