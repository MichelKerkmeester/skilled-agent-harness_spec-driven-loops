---
title: "Feature Specification: Phase 7: compaction-pointer-staleness"
description: "After a compaction the pointer sends the session back to its handoff note with no age for it, so stale Remaining work can be redone or trusted. This phase dates the pointer and asks for git evidence first."
trigger_phrases:
  - "compaction pointer staleness"
  - "phase 7 compaction pointer staleness"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: compaction-pointer-staleness

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-25 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 9 (wave 1) |
| **Predecessor** | ../006-relaunch-coverage-gaps/spec.md |
| **Successor** | ../008-claim-error-per-state/spec.md |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and both test commands pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the research remediation packet for the session relaunch loop. It is a wave 1 phase with no dependency on the others. Build order follows the wave order in `../spec.md`, not the folder order.

**Scope Boundary**: the after-compaction branch of `seedText` and the three callers that pass it the note date. The relaunch seed text and the withdrawn compaction text stay as they are.

**Dependencies**:
- None inside the packet. Each caller reads the note once today through `noteSpecFolder()`, which returns only `spec_folder`; that helper is widened to return `{ specFolder, createdAt }` from the same read.

**Deliverables**:
- A dated after-compaction pointer with a git check step, sent by Claude, Pi and OpenCode.
- Failing-first tests in the nudge suite and in each adapter suite.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After a compaction, the pointer tells the session to claim its note and continue "Remaining work" (`.skilled/hooks/session-relaunch/lib/nudge.cjs:210-240`, `seedText` with `afterCompaction`). It gives no age for the note, so Remaining work written before later commits can be redone, or trusted when it is stale. Research section 11a lesson 2 makes the same point: clear a stale claim only on later evidence. The text reaches Claude (`claude/compact-pointer.mjs:214`), Pi (`pi/session-relaunch.ts:638`) and OpenCode (`.opencode/plugins/session-relaunch.js:285`).

### Purpose
After a compaction the session knows when its note was written and checks git for what changed since before it trusts Remaining work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `seedText` takes the note's `created_at` and, with `afterCompaction` true, names it and asks for `git log --since=<created_at>` and `git status`.
- Claude, Pi and OpenCode widen their note helper (`noteSpecFolder()` in `claude/compact-pointer.mjs:65-72`, `pi/session-relaunch.ts:356-366`, `.opencode/plugins/session-relaunch.js:116-123`) to return `{ specFolder, createdAt }` from the one read it already does, and pass `createdAt` to `seedText`.
- Tests in the nudge suite and the three adapter suites.

### Out of Scope
- The relaunch seed text - it must stay byte-identical.
- The withdrawn compaction text (`staleNoteText`) - that note is never claimed, so its age does not matter.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | `seedText` accepts `createdAt` and adds the dated git step after compaction |
| `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs` | Modify | Pass the note `created_at` |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modify | Pass the note `created_at`; widen the `seedText` options type |
| `.opencode/plugins/session-relaunch.js` | Modify | Pass the note `created_at` |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` | Modify | Failing-first text test and the missing-date case |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modify | Adapter date test |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | Modify | Adapter date test |
| `.opencode/plugins/tests/session-relaunch.test.cjs` | Modify | Adapter date test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The after-compaction text names the note's `created_at`. |
| REQ-002 | It asks for `git log --since=<created_at>` and `git status` before Remaining work is trusted. |
| REQ-004 | The relaunch seed text (no `afterCompaction`) is byte-identical to today. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Claude, Pi and OpenCode pass `created_at` to `seedText`. |
| REQ-005 | A missing `created_at` still yields a valid text with the git step. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **AC-001**: **Given** a note with `created_at: 2026-10-25T10:00:00Z`, **When** `seedText` runs with `afterCompaction: true`, **Then** the text holds that timestamp, `git log --since=2026-10-25T10:00:00Z` and `git status`. Verify: `nudge.test.cjs`, red before.
- **AC-002**: **Given** each runtime's compaction path with that note, **When** it sends the pointer, **Then** the sent text holds the timestamp. Verify: one test per adapter.
- **AC-003**: **Given** `afterCompaction` false, **When** `seedText` runs, **Then** existing seed tests pass unedited. Verify: test run.
- **AC-004**: **Given** a note with no `created_at`, **When** the pointer builds, **Then** it holds the git step and no `undefined`. Verify: test.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A `created_at` value with shell metacharacters lands in the git command the session runs | Low | Wrap the date in `shellQuote` inside the git command |
| Risk | Phases 007 and 009 both edit `pi/session-relaunch.ts` and its test file, in separate regions | Low | The second phase to land rebases onto the first |
| Dependency | Note frontmatter carries `created_at` (optional; `validateHandoff` never checks it) | Low | Empty and missing `created_at` are treated the same: the undated git step |

No existing test pins the old after-compaction text exactly: the Claude (`claude-adapters.test.cjs:1261`) and Pi (`:1030`) tests match only the opening line, OpenCode (`:1463`) checks only the claim path, and `adapter-conformance.test.cjs` holds no pointer text.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: One read of the note, as today; the widened helper returns both fields from it.
- **NFR-P02**: The hook does no git call itself; the session runs the commands.

### Security
- **NFR-S01**: The date is inserted as text only and never run by the hook.
- **NFR-S02**: No new paths or environment reads.

### Reliability
- **NFR-R01**: The pointer is always emitted, with or without a date.
- **NFR-R02**: The relaunch path output does not change.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: an empty or missing `created_at` yields the git step without a date and no `undefined`.
- Maximum length: the date is a single ISO timestamp; no truncation is needed.
- Invalid format: the date is wrapped in `shellQuote` inside the git command; git reports a bad date to the session itself. The parser stores trimmed strings (`relaunch-core.cjs:279`), so a missing key (undefined) and an empty one (`''`) take the same undated path.

### Error Scenarios
- External service failure: not applicable; no service is called.
- Network timeout: not applicable.
- Concurrent access: not applicable; the text is built per call.

### State Transitions
- Partial completion: a session compacted twice gets the same note date both times.
- Session expiry: unchanged; claim rules are not touched.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Four source files, four test files, small text change |
| Risk | 6/25 | Text only; relaunch text must stay byte-identical |
| Research | 3/20 | Done in the parent research |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The design is fixed by the brief and goal decision D1.
<!-- /ANCHOR:questions -->
