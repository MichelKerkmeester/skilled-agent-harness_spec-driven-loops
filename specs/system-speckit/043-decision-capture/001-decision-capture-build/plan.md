---
title: "Implementation Plan: Automatic operator decision capture"
description: "Use a local capture queue and transcript sweep, then let the session model draft entries for a deterministic save-time writer."
trigger_phrases:
  - "decision capture plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Automatic operator decision capture

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM hooks and TypeScript save pipeline |
| **Framework** | Existing Claude, OpenCode, Pi, Codex and Devin hook adapters |
| **Storage** | Gitignored per-session JSONL queue plus tracked Markdown decision record |
| **Testing** | Node test runner for ESM hooks and Vitest for TypeScript save and writer tests |

### Overview

A runtime-neutral capture core writes normalized question events to a locked local queue. Claude's transcript sweep always backfills tool answers and offers plain-chat Q/A candidates for the session model to confirm during full-auto save.

The session model produces short operatorDecisions entries. A deterministic writer resolves each target, upserts the decision and verbatim appendix by one stable question id and guards the packet level before creating a record. Other runtime adapters stay disabled until a probe confirms their answer payload.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The problem and frozen scope are stated in spec.md.
- [x] Success criteria are observable in spec.md.
- [x] Runtime dependencies and unresolved payload questions are listed.

### Definition of Done
- [ ] All acceptance criteria are Met, Waived or Superseded with evidence.
- [ ] The focused Node and Vitest suites pass for capture, filtering, payload, routing, writer, appendix and level guard.
- [ ] `validate.sh --strict` on this Level 3 packet prints `RESULT: PASSED`.
- [ ] The decision record, save docs and runtime-state README agree with the implemented fields.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Local capture queue with save-time rewrite

### Key Components
- **Capture core**: normalizes tool results, drops known process questions and appends deduplicated events under a lock.
- **Claude transcript sweep**: recovers missed AskUserQuestion answers and offers confirmed chat candidates to the save model.
- **Save payload**: carries operatorDecisions entries with decided, why, supersedes and carried-by fields.
- **Decision writer**: maps a tool event or matched chat turns to a stable Q id, resolves packet scope, preserves the pre-write level and upserts two anchored sections.

### Data Flow

The hook reads one tool event and extracts its question, options and answer when available. The transcript sweep always checks Claude JSONL and fills any gap by the same source key. At save time the session model confirms plain-chat pairs, filters process prompts and writes a structured payload. The full-auto workflow calls the deterministic writer, which routes each entry, records the verbatim exchange in the appendix and marks the queue key consumed only after the file write succeeds.

The writer resolves targets from the bound packet. A cross-phase decision belongs in the phase parent. A phase-local decision belongs in the bound child or the child chosen by the existing parent save rule. A standard packet receives its decisions directly.

Before the writer creates a decision record, it reads the packet's current detected level. If spec.md has no marker, it writes a marker with that pre-write level before creating the record. If it cannot resolve the level, it refuses the record write. Tests compare the detected level before and after.


### Plan refinements

ADR-002 in decision-record.md records six refinements made after reading the code. The validator needs no change. The sweep reads JSONL itself. Routing happens in the workflow with the existing child resolver. The writer reuses the validator's level detection. Claude registration waits for the live probe. Consumed keys sit in a gitignored file, while the tracked appendix keeps the source key for stable ids.

### Shared surfaces touched

| Surface | Owner | One real caller | Contract that must hold |
|---------|-------|-----------------|-------------------------|
| `runtime/api/index.ts` exports | system-spec-kit runtime | `cli/core/workflow.ts:66` imports `upsertThinContinuityInMarkdown` | Existing exports unchanged; the writer is added |
| `detectLevel` in `orchestrator.ts` | validation orchestrator | `orchestrator.ts:1352` inside `validateFolder` | Same return for every folder; only gains `export` |
| Save payload in `input-normalizer.ts` | save pipeline | `workflow.ts:65` `normalizeInputData` | Unknown-field detection and every existing field keep their behavior |
| `session-stop.ts` Stop hook | spec-kit Claude hooks | `.claude/settings.json` Stop binding to `dist/hooks/claude/session-stop.js` | Fails open, prints nothing when no decision is pending |
| `decision-record.md.tmpl` | spec-kit templates | `upgrade-level.sh` `template_for_doc` | No required anchor for decision records (`orchestrator.ts:666`) |

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup runs the live Claude probe, records the baseline packet level and marks the four non-Claude runtime surfaces UNKNOWN. Implementation builds Claude capture, transcript recovery, process filtering, the save payload and the guarded writer. Verification runs the happy path and one edge case for each public surface, then the packet validator.

Follow the ordered tasks in tasks.md. It owns the Setup, Implementation and Verification checkboxes and task state.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Public surface | Happy path | Edge case | Evidence |
|----------------|------------|------------|----------|
| Capture | A Claude AskUserQuestion answer normalizes to one queue event. | Duplicate tool-use id is appended once; malformed response writes nothing. | capture-core.test.mjs (node --test) |
| Transcript and chat | A transcript sweep backfills two question-tool rounds and confirms an answered chat pair at save. | A question without a matching user reply stays a candidate and is not consumed. | sweep-transcript.test.mjs (node --test) |
| Filter | A product preference enters the decision payload. | Gate 3, worktree or branch and commit or push permission prompts create no tracked row or appendix item. | capture-core.test.mjs and save payload tests |
| Rewrite payload | The session model emits all four required fields with the same question id. | Missing rationale is written as Not stated rather than inferred. | .skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts |
| Target routing | A standard packet receives its decision; cross-phase goes to the parent and local goes to the child. | An unresolved child target leaves the queue item pending. | .skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts |
| Writer idempotence | Re-saving one question id leaves decision-record.md byte-identical. | The same id cannot create a duplicate row or appendix entry. | .skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts |
| Verbatim appendix | The original question, options and answer are stored exactly. | Markdown fences and line breaks survive without changing the text value. | .skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts |
| Level guard | A missing level marker is added before record creation and the detected level stays the same. | An unresolvable level blocks record creation. | .skilled/skills/system-spec-kit/runtime/cli/tests/decision-record-writer.vitest.ts |

The Claude live probe is manual and runs before adapter implementation. It must produce an explicit present or absent result for tool_response.answers. The transcript sweep stays enabled in both cases. The Codex, OpenCode, Pi and Devin probes must each produce evidence or leave the runtime UNKNOWN and disabled.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Claude PostToolUse and transcript | Internal runtime surfaces | Green, T001 confirmed tool_response.answers | The hook may omit answers; transcript recovery still captures the result. |
| Spec gate boundSpecFolder state | Internal | Green | Without it, the writer must not infer a packet target. |
| Existing phase child resolver | Internal | Green | A phase-local decision must follow the save workflow's child selection rule. |
| Codex, OpenCode, Pi and Devin answer delivery | Runtime-specific | OpenCode and Devin Green through stored sessions; Codex and Pi UNKNOWN | Leave that runtime adapter disabled until its probe confirms a usable payload. |

No new external package or credential is required.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A probe or test shows answer loss, incorrect packet routing, duplicate rows or a level change.
- **Procedure**: Disable the affected hook registration and the save writer call. Revert the capture and writer code changes. Keep existing decision rows and verbatim answers in place so rollback does not erase the audit record.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Setup ──► Implementation ──► Verification

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The Level 3 packet and runtime access. | Claude hook registration until T001 records its payload result. |
| Implementation | T001 probe and the bound-packet resolver. | Verification until capture, save writer and level guard exist. |
| Verification | Implementation and runtime probes. | Packet closure until every criterion has evidence. |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
capture-core.mjs ──► ask-capture-posttooluse.mjs ──► registration (after T001)
       │
       ├──────────► sweep-transcript.mjs
       └──────────► session-stop.ts nudge
decision-record-writer.ts ──► input-normalizer.ts + workflow.ts ──► save docs
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| capture-core.mjs | None | Queue records, process filter, consumed-key reader | Adapter, sweep, Stop nudge |
| decision-record-writer.ts | detectLevel export | Upserted decision-record.md and consumed keys | Save wiring |
| input-normalizer.ts and workflow.ts | Writer | Full-auto save of operatorDecisions | Save docs and closure |
| sweep-transcript.mjs | Capture core | Recovered tool answers and chat candidates | Save step docs |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Writer and its tests (T008-T011)** - one worker run - CRITICAL
2. **Save payload and workflow wiring (T007, T012)** - one worker run - CRITICAL
3. **Strict validation and evidence (T021, T022)** - one orchestrator pass - CRITICAL

**Total Critical Path**: three sequential steps; worker run time is not measured in advance.

**Parallel Opportunities**:
- The capture core (T003, T004, T006) and the writer (T008-T011) run at the same time on disjoint files.
- The sweep (T005) and the save wiring (T007, T012) run at the same time after those two land.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Capture core and writer exist | `node --test .skilled/hooks/decision-capture/lib/capture-core.test.mjs` and the writer vitest file pass | Implementation |
| M2 | Save writes decisions | `save-continuity-write.vitest.ts` passes with an operatorDecisions full-auto case | Implementation |
| M3 | Packet closes | `validate.sh --strict` prints `RESULT: PASSED` and every AC row has evidence | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Capture answers locally and rewrite them at save time

**Status**: Accepted

**Context**: Operator answers reach no decision record unless someone retypes them, and a hook lacks the session's reasoning.

**Decision**: Capture to a gitignored queue, and let the session model write short decisions at a full-auto save. The full record is ADR-001 in decision-record.md.

**Consequences**:
- Decisions keep their verbatim wording and a short rewrite.
- No tracked entry exists until a full-auto save. Mitigation: the Stop hook reports pending decisions.

**Alternatives Rejected**:
- Rewrite inside the hook: lacks session reasoning and writes tracked files mid-turn.

### ADR-002: Refine the build plan against the code it touches

**Status**: Accepted

**Context**: The plan asked for edits the code does not need and for reuse the layers do not allow.

**Decision**: Six refinements, recorded as ADR-002 in decision-record.md.

**Consequences**:
- Fewer edits to shared modules, and routing and level checks reuse trusted code.
- Claude live capture waits for T001. Mitigation: the sweep recovers answers at save.

**Alternatives Rejected**:
- Build exactly as written: edits a validator that already behaves correctly.



