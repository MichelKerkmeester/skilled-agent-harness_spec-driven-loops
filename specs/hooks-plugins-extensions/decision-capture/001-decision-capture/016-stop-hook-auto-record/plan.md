---
title: "Implementation Plan: Phase 16: stop-hook-auto-record"
description: "Add an auto-record step to the Claude Stop hook. When the transcript tail names exactly one packet, it writes this session's queued tool answers into that packet's decision record through the existing writer and marks them consumed; otherwise it keeps the nudge."
trigger_phrases:
  - "stop hook auto record plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 16: stop-hook-auto-record

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node ESM), compiled to `runtime/dist/` |
| **Framework** | Claude Code `Stop` hook |
| **Storage** | `decision-record.md` in the packet, `consumed.jsonl` in the decision-capture state folder |
| **Testing** | Vitest, `npx vitest run tests/hook-session-stop.vitest.ts` from `.skilled/skills/system-spec-kit/runtime` |

### Overview
The Stop hook already reads the transcript tail for spec-folder paths and already counts pending answers for the nudge. This plan adds one step between them. When the tail names exactly one folder with a `spec.md`, the step calls `writeDecisionRecord` with this session's pending tool records and then `recordConsumedKeys`, so the nudge that follows finds nothing pending. In every other case the step does nothing and the nudge runs as today.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `npx vitest run tests/hook-session-stop.vitest.ts` passes with the new cases, and fails the bound case when the step is removed
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A best-effort step inside an existing hook, with no new module, flag or subprocess.

### Key Components
- **Bound-packet check**: reuses the transcript tail read and the path normalizer, and accepts only one unique folder that holds a `spec.md`. It does not use the current-packet preference the autosave uses, because that picks one folder out of several.
- **Auto-record step**: reads `pendingRecords` for the session, keeps tool records only, maps each to an `OperatorDecisionEntry` and writes them in one call. `decided` reads "Recorded automatically: <answer>", `why` is left out so the record says `Not stated.`, and `carriedBy` reads "Not linked to a requirement yet."
- **Nudge**: unchanged. It runs after the step and reports whatever is still pending.

### Data Flow
Stop input -> transcript tail -> unique spec folders. If there is exactly one, pending tool records go to `writeDecisionRecord`, and the returned ids go to `recordConsumedKeys`. Then `takeNudge` counts what is left. Any thrown error is caught and logged, and the flow falls through to the nudge.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: this is a new behavior, not a fix from a review verdict. The surfaces it touches are listed for completeness.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `session-stop.ts` `decisionCaptureNudge` | Counts pending answers and prints the nudge | unchanged, runs after the new step | `rg -n "decisionCaptureNudge" .skilled/skills/system-spec-kit/runtime/hooks/claude/session-stop.ts` |
| `capture-core.mjs` `pendingRecords` and `readConsumedKeys` | Queue reader and consumed-key reader | not a consumer change | the bound Vitest case shows 0 pending after the write |
| `decision-record-writer.ts` `writeDecisionRecord` and `recordConsumedKeys` | The writer a full-auto save calls | reused unchanged | `rg -n "recordConsumedKeys" .skilled/skills/system-spec-kit/runtime/cli/core/workflow.ts` |
| Other runtimes' stop paths | Nudge or nothing | unchanged, out of scope | spec.md Out of Scope |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Bound-packet check: zero, one and two folders, and one folder without `spec.md` | Vitest |
| Integration | Stop with a temp project: one packet and two queued answers, two packets, `AI_SESSION_CHILD=1`, the concern disabled and a writer that throws | Vitest with a temp repository root |
| Manual | One real Claude session that answers a question while working in one packet, then ends | Claude Code |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@spec-kit/runtime/api` exports `writeDecisionRecord` and `recordConsumedKeys` | Internal | Green | The step cannot write and the nudge stays the only path |
| `capture-core.mjs` `pendingRecords` | Internal | Green | The step has nothing to read |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an answer lands in the wrong packet, or Stop slows or fails.
- **Procedure**: set `SYSTEM_DECISION_CAPTURE_DISABLED=1` at once, then revert the hook commit and rebuild `dist`. Rows already written stay in their records and can be moved by hand.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing | Implementation |
| Implementation | Setup: the failing bound case exists | Verification |
| Verification | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---
