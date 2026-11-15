---
title: "Implementation Plan: Phase 18: vibe-compaction-context"
description: "Add a compaction detector to the Vibe turn-start composer and a cheap post_tool binding of it, so the first turn start or tool call after a compaction re-injects the goal slice, the history lookup offer and the handoff pointer once. Register Vibe with the history lookup so the offer can be served."
trigger_phrases:
  - "vibe compaction context plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 18: vibe-compaction-context

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES modules, one TypeScript edit in the spec-kit runtime, TOML hook registration |
| **Framework** | Vibe 3.1.2 `pre_agent` and `post_tool` hooks, the session-reader package and the history lookup core |
| **Storage** | A per-session compaction watermark under the gitignored `.skilled/skills/.state/` |
| **Testing** | `node --test` fixture tests over a recorded compaction journal, the history lookup suites, and one keyed run forced to compact on phase 014's small-context fixture config |

### Overview
Vibe gives no compaction event, so the detector reads it from the journal: the phase 014 reader lists compaction entries, and a watermark records the last one handled. On a new entry, the turn-start part returns the goal slice, the `## History Lookup` offer and the handoff pointer once, and resets the advisor directive receipt. A `post_tool` binding runs the same detector only when the journal's size changed, so a long headless turn catches a compaction at its next tool call.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 014 records a forced compaction's journal entry (`rg -n 'context_compacted' ../014-vibe-journal-fixture-and-reader/implementation-summary.md` prints the finding)
- [ ] The 014 reader and the 015 composer exist (`ls .skilled/hooks/shared/session-readers/vibe.mjs .skilled/hooks/session-lifecycle/vibe/turn-start.mjs` prints both paths)
- [ ] The history lookup suites pass before the `hook-state.ts` edit

### Definition of Done
- [ ] `node --test .skilled/hooks/session-lifecycle/vibe/compaction-context.test.mjs` prints `fail 0`
- [ ] The history lookup suites print the same pass count as the baseline plus the Vibe case
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Journal-watermark detector.

### Key Components
- **Detector** (`session-lifecycle/vibe/compaction-context.mjs`): compares compaction entries with the watermark and builds the re-injected text. Without it, nothing notices a compaction.
- **Turn-start part** (inside `turn-start.mjs`): delivers the text at the next operator message. Without it, the detector has no seam.
- **Post-tool binding** (`session-lifecycle/vibe/compaction-post-tool.mjs`): delivers it at the next tool call when the journal grew. Without it, a long headless turn runs to its end without the context.
- **History registration** (`session-readers/index.mjs`, `hook-state.ts`): lets the lookup CLI read a Vibe session. Without it, the `## History Lookup` offer points at a command that refuses the runtime.

### Data Flow
Vibe compacts and writes a compaction entry to the journal under `transcript_path`. At the next `pre_agent` or `post_tool`, the detector asks the reader for compaction entries after the watermark. On a new one it writes the watermark first, then returns the goal slice from `renderVibeGoalSlice`, the history offer built by the lookup-offer module for this session and the open handoff note pointer, and the hook returns them as `additional_context`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the phase 014 compaction finding, copies the recorded journal into a fixture and captures the history lookup baseline. Implementation adds the detector, the turn-start part, the `post_tool` binding, the history registration, the dist rebuild, the tests and the README rows. Verification runs the fixture tests, the history lookup suites and one keyed run forced to compact on phase 014's small-context fixture config. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`compaction-context.test.mjs` covers: one new compaction returns the slice and the offer; the same journal again returns nothing; no compaction returns nothing and writes no watermark; a missing journal or malformed entry exits 0 with nothing; the `post_tool` binding skips an unchanged journal size and fires on a grown one; a new compaction clears the advisor directive receipt and a repeat leaves it in place. The history lookup suites gain one Vibe read case. The forced-compaction run is the only proof Vibe's real entry matches the detector.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`vibe 3.1.2`, Node.js, the phase 014 reader and compaction finding, the phase 015 turn-start composer, `.skilled/hooks/goal/vibe/goal-inject.mjs` (`renderVibeGoalSlice`), the history lookup core under `.skilled/skills/system-spec-kit/runtime/hooks/lib/history/`, and the runtime dist build. `MISTRAL_API_KEY` for the keyed run. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: the detector injects on every turn, or the history registration breaks another runtime's lookup. Remove the `post_tool` binding entry from `.vibe/hooks.toml`, then revert the phase's commit and rebuild the runtime dist so `hook-state.ts` returns to six runtimes.
<!-- /ANCHOR:rollback -->

---
