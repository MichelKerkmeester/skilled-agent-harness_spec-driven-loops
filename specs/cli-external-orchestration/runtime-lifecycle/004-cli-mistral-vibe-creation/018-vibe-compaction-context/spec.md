---
title: "Feature Specification: Phase 18: vibe-compaction-context"
description: "After Vibe compacts a session, the goal slice, the history lookup offer and the handoff pointer are gone for the rest of the run, because Vibe has no compaction hook and session_start does not run again. This phase adds a compaction detector to the turn-start composer that notices a new compaction in the session journal and re-injects that context once."
trigger_phrases:
  - "vibe compaction context"
  - "phase 18 vibe compaction context"
  - "vibe history lookup after compaction"
  - "vibe context_compacted"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 18: vibe-compaction-context

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/383-mistral-vibe-runtime` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 21 |
| **Predecessor** | 017-vibe-decision-capture |
| **Successor** | 019-vibe-relaunch-command-tier |
| **Handoff Criteria** | The detector fixture re-injects the goal slice and the history offer once after a recorded compaction entry, and a forced-compaction run shows it in the journal |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the Mistral Vibe runtime mode build specification.

**Scope Boundary**: Detecting a compaction from the journal and re-injecting context at the next turn start or tool call, plus registering Vibe with the history lookup so the offer can be served. No relaunch, no change to how Vibe compacts.

**Dependencies**:
- Phase 014 (`014-vibe-journal-fixture-and-reader`): item (c), the on-disk shape of a `context_compacted` entry from a forced compaction, and the journal reader that lists compaction entries since a watermark.
- Phase 015 (`015-vibe-turn-start-advisor-and-dist`): the turn-start composer the detector runs inside, and the advisor directive receipt this phase resets.
- Phase 017 precedes this one in the linear order but is not a dependency.

**Deliverables**:
- A compaction detector part in the turn-start composer, with a per-session watermark.
- A cheap `post_tool` binding of the same detector for a compaction in the middle of a long turn.
- A `vibe` row in the session-reader capabilities and the history locator kinds.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Vibe compacts automatically and records it as a `context_compacted` observation with its trigger and summary (`mistralai_vibe_local_harness/protocol.py:1419-1427`), but it has no hook type for it (`vibe/core/hooks/models.py:20-27`), and `session_start` fires only on `startup`, `resume`, `clear` and `fork`. So the goal slice and context the phase 011 `session_start` hook injected are summarized away, and nothing offers the history lookup that OpenCode's `session-history-lookup.js` offers after `session.compacted`. The history lookup cannot serve a Vibe session either: `HISTORY_LOCATOR_KINDS` has no `vibe` row and no Vibe session reader exists.

### Purpose
The first turn start or tool call after a Vibe compaction re-injects the bound packet's goal slice, a `## History Lookup` offer for the session and the open handoff pointer, once per compaction.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n 228,235p .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts
export const HISTORY_LOCATOR_KINDS = {
  claude: 'transcript_path',
  codex: 'transcript_path',
  pi: 'live_branch_or_session_log',
  devin: 'transcript_file',
  dsh: 'session_log',
  opencode: 'session-store',
} as const;
$ ls .skilled/hooks/shared/session-readers | rg -c "^vibe"; echo "exit=$?"
exit=1
$ ls .skilled/hooks/session-lifecycle/vibe
README.md
session-start.mjs
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a compaction detector part to the turn-start composer that compares the journal's compaction entries with a per-session watermark under `.skilled/skills/.state/` and, on a new one, returns the goal slice from `renderVibeGoalSlice`, the `## History Lookup` offer and the open handoff note pointer.
- Reset the advisor directive receipt on a new compaction, so phase 015 sends the directive block again. A fixture case proves the receipt is cleared on a new compaction and kept on a repeat.
- Bind the same detector to `post_tool` with a stat check of the journal's size, so a compaction inside one long headless turn is caught at the next tool call.
- Promote the `vibe` session-reader row phase 014 adds as `gated` to `ready` (or keep it `gated` with the reason), add `vibe` to `HISTORY_LOCATOR_KINDS` and `HISTORY_LOCATOR_RUNTIMES`, and rebuild the runtime dist.

### Out of Scope
- Relaunching the session at a context limit - phase 019 owns the relaunch tier.
- Changing Vibe's compaction prompt or threshold - those are Vibe settings, not hooks.
- Re-injecting the session-prime context - it is long, and the goal slice and the lookup offer are what the model needs to recover.
- Any change to default models - DevPass stays the default.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` | Create | The detector: watermark, entry comparison and the re-injected text |
| `.skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs` | Create | Fixture cases over a recorded compaction journal |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | Modify | Runs the detector as a part |
| `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs` | Create | The `post_tool` binding with the stat check |
| `.vibe/hooks.toml` | Modify | One non-strict `post_tool` entry for the binding |
| `.skilled/hooks/shared/session-readers/index.mjs` | Modify | Promote the `vibe` row phase 014 added as `gated` |
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts` | Modify | `vibe` in `HISTORY_LOCATOR_KINDS`, `HISTORY_LOCATOR_RUNTIMES` and the kind values |
| `.skilled/hooks/session-lifecycle/vibe/README.md` | Modify | The detector and binding rows |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A new compaction re-injects context once | The detector fixture over a journal with one compaction entry returns text holding the goal slice and `## History Lookup`; a second call with the same journal returns nothing |
| REQ-002 | No compaction means no injection | A journal with no compaction entry returns nothing and writes no watermark |
| REQ-003 | The detector fails open | A missing journal, an unreadable watermark or a malformed entry returns nothing and exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The history lookup serves a Vibe session | After the dist rebuild, the lookup CLI reads a recorded Vibe session by its exact id and returns at least one entry |
| REQ-005 | A mid-turn compaction is caught | The `post_tool` binding test with a grown journal holding a new compaction returns the re-injection as `additional_context`; an unchanged journal size returns nothing without reading it |
| REQ-006 | A live compaction is observed | One keyed run on phase 014's small-context fixture config compacts once and shows the re-injected goal slice in its journal after the compaction entry |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs` prints `fail 0`.
- **SC-002**: `node --test .skilled/hooks/goal/vibe/goal-vibe.test.mjs` still prints `fail 0`.
- **SC-003**: The history lookup capability check names `vibe` as `ready`, or as `gated` with the recorded reason.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 014 item (c): the on-disk shape of a compaction entry | High: no recorded journal holds one yet, so the detector has nothing to match | Setup halts until 014 records a forced compaction; the detector matches only the recorded shape and fails open on anything else |
| Dependency | The phase 014 reader's conformance to the `readSession` envelope | Med: the lookup CLI refuses a reader that does not return `{ ok, source, items }` | Register the capability as `gated` with a reason if the reader does not conform, and keep the detector, which needs only the compaction list |
| Risk | Re-injected text piles up in the conversation, because `pre_agent` context stays for later turns | Low | One injection per compaction, keyed on the compaction id |
| Risk | Editing `hook-state.ts` touches every runtime's history lookup | Med | Add one row and one list entry only; rerun the history lookup suites after the dist rebuild |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- UNVERIFIED: the on-disk shape of a `context_compacted` entry in the session journal. The protocol model has `compaction_id`, `trigger` and `summary`, but no recorded journal holds a compaction yet. Phase 014 item (c) records one.
- UNVERIFIED: whether a `pre_agent` part runs on the turn right after an automatic compaction, or only on the next operator message. The `post_tool` binding covers the gap either way.
<!-- /ANCHOR:questions -->

---
