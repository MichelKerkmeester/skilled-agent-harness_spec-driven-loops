---
title: "Feature Specification: Phase 16: stop-hook-auto-record"
description: "Captured operator answers stay queued until someone runs a full-auto save, so sessions that end without one leave answers orphaned. The Claude Stop hook should record them itself when the session worked in exactly one packet."
trigger_phrases:
  - "stop hook auto record"
  - "phase 16 stop hook auto record"
  - "auto record operator answers at stop"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 16: stop-hook-auto-record

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-24 |
| **Branch** | `worktrees/542-stop-hook-auto-record` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 16 |
| **Predecessor** | 015-devin-database-reader |
| **Successor** | None |
| **Handoff Criteria** | A Claude session bound to one packet ends with its queued tool answers in that packet's `decision-record.md` and no nudge, and an unbound session still gets the nudge |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the decision-capture series. Child 001 chose a Stop-hook nudge over an automatic write. This child adds the automatic write for the one case where the target packet is not in doubt.

**Scope Boundary**: The Claude Stop hook and the tool answers in this session's capture queue. Other runtimes, chat-reply candidates and the context autosave's summary text stay as they are.

**Dependencies**:
- The capture queue and `pendingRecords` in `.skilled/hooks/decision-capture/lib/capture-core.mjs`.
- `writeDecisionRecord` and `recordConsumedKeys`, exported from `@spec-kit/runtime/api`.
- The transcript spec-folder detection already in `session-stop.ts`.

**Deliverables**:
- An auto-record step in the Claude Stop hook, gated on a single bound packet.
- Vitest coverage for the bound, unbound and failure paths.
- README updates for the decision-capture and session-lifecycle hooks.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The decision-capture hook queues every answered question, but nothing writes the queue into a decision record until someone runs `/speckit:save --full-auto`. The Stop hook only nudges, and its context autosave calls the writer with `--json`, which writes no operator decisions. Sessions that end without a save leave their answers orphaned: the orphan scan lists 22 such sessions today.

### Purpose
When a Claude session worked in exactly one packet, its queued tool answers land in that packet's decision record at Stop without a manual save.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node --input-type=module -e "import {pendingRecords} from './.skilled/hooks/decision-capture/lib/capture-core.mjs'; console.log('pending', pendingRecords(process.cwd(),'0b81ad2f-04a7-4ad7-b174-0b3f9930b833').length)"
pending 7
$ grep -n "scriptPath, '--json'" .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts
177:    [scriptPath, '--json', JSON.stringify(payload)],
$ node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/match-decision-table.js --scan-orphans | wc -l
      22
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a strict bound-packet check: the transcript tail names exactly one spec folder, and that folder has a `spec.md`.
- Write this session's pending tool answers into that folder's `decision-record.md` at Stop, then record their keys as consumed.
- Keep the nudge for every other case: no packet, several packets, a child session or a failed write.
- Cover the bound, unbound, child-session and write-failure paths with Vitest.
- Document the new behavior in the decision-capture and session-lifecycle READMEs.

### Out of Scope
- Chat-reply candidates - deciding whether a free-text reply answers a question needs judgment the hook cannot make.
- Codex, Pi, Devin, OpenCode, DSH and Vibe - each has its own stop path, so they follow once the Claude path is proven.
- Richer `decided` and `why` text - the hook records answers verbatim and leaves rewording to a later save.
- The context autosave's noisy summaries - a separate defect in how the summary is extracted.
- A new hook flag - `SYSTEM_DECISION_CAPTURE_DISABLED` already turns the whole concern off.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts` | Modify | Add the bound-packet check and the auto-record step before the nudge. |
| `.skilled/skills/system-spec-kit/runtime/tests/hook-session-stop.vitest.ts` | Modify | Cover the bound, unbound, child and failure paths. |
| `.skilled/hooks/decision-capture/README.md` | Modify | Say when Stop records answers itself and when it nudges. |
| `.skilled/hooks/session-lifecycle/README.md` | Modify | Name the auto-record step in the Stop flow. |
| `.skilled/skills/system-spec-kit/runtime/dist/hooks/claude/session-stop.js` | Modify | Rebuilt output of the hook. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | When the transcript tail names exactly one spec folder with a `spec.md`, Stop writes each pending tool answer of this session into that folder's `decision-record.md`, with the question, options and answer verbatim. |
| REQ-002 | After a successful write, Stop records each written key as consumed, so `pendingRecords` for the session returns 0 and no nudge prints. |
| REQ-003 | When the tail names no spec folder or more than one, Stop writes nothing and prints the existing nudge. |
| REQ-004 | A write error never fails the Stop hook: the answers stay pending and the nudge prints. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | A session with `AI_SESSION_CHILD=1` never auto-records. |
| REQ-006 | `SYSTEM_DECISION_CAPTURE_DISABLED=1` turns auto-record off along with the rest of the concern. |
| REQ-007 | Each auto-recorded entry says it was recorded automatically, with `why` left as `Not stated.`, because its key is consumed and no later save offers it again. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A Vitest case with one packet in the transcript and two queued answers ends with two new rows in that packet's `decision-record.md` and 0 pending.
- **SC-002**: A Vitest case naming two packets ends with no decision-record change and the nudge text returned.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `writeDecisionRecord` from `@spec-kit/runtime/api` | If the hook cannot import it, nothing is recorded | Catch the import error and fall back to the nudge |
| Risk | An answer about one packet lands in another, because the tail names only the packet worked on last | Med | Require exactly one folder in the tail, not the current-packet preference the autosave uses |
| Risk | A slow write delays the session end | Low | Write only this session's few records, with no subprocess |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The auto-record step adds under 200 ms to a Stop with 10 pending answers.
- **NFR-P02**: N/A: the hook runs once per turn and serves no traffic.

### Security
- **NFR-S01**: The hook writes only inside the repository's `specs/` tree and its decision-capture state folder.
- **NFR-S02**: N/A: no credentials or network calls are involved.

### Reliability
- **NFR-R01**: Every failure path exits the Stop hook with status 0.
- **NFR-R02**: A rerun after a partial failure writes no duplicate rows, because the writer upserts by source key.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a session with no pending answers writes nothing and prints no nudge.
- Maximum input: 50 pending answers are written in one `writeDecisionRecord` call.
- Failure path: a folder whose level cannot be resolved raises `LEVEL_UNRESOLVED`, the answers stay pending and the nudge prints.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One hook file, one test file and two READMEs, about 300 lines |
| Risk | 10/25 | Writes into packet docs without a person in the loop |
| Research | 4/20 | The writer, queue and detection already exist |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should a packet the session only read, never wrote, count as bound? Decision for planning: yes, because the tail check cannot tell reads from writes, and the risk row covers it.
<!-- /ANCHOR:questions -->

---
