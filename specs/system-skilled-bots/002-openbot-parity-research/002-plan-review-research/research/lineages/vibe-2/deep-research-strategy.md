---
title: Deep Research Strategy - OpenBot Parity Build Readiness Review (lineage vibe-2)
description: Runtime strategy for the fan-out lineage reviewing the eleven planned phases of 003-openbot-parity-build against the built runtime, each other, parity, and security.
trigger_phrases:
  - "deep research strategy"
  - "openbot parity build readiness"
importance_tier: normal
contextType: planning
version: 1.14.3.0
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for this fan-out lineage. Records what to investigate, what worked, what failed, and where to focus next. Read at every iteration; machine-owned sections are rewritten by the reducer.

### Usage

- **Init:** populated Topic, Key Questions, Known Context, and Research Boundaries from config.
- **Per iteration:** the leaf reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** analyst-owned sections stay stable; machine-owned sections are rewritten by the reducer after each iteration.

### Question Injection Surface

`inbox.jsonl` in this lineage directory is the question intake. Each line is one JSON object with `id`, `text`, `source`, `origin`, `injectedAtIteration`, `promotedQuestionId`.

---

## 2. TOPIC

Build-readiness review of the eleven planned phases of packet `specs/system-skilled-bots/003-openbot-parity-build` (001-activity-and-actor, 002-routine-layer, 003-terminal-screen, 004-computer-exposure, 005-memory, 006-approval-grants, 007-per-bot-apps, 008-vault, 009-skills, 010-conversations, 011-messaging-channels). Each phase carries spec.md, plan.md, tasks.md and acceptance-criteria.md, written in parallel and never checked against the built runtime or against each other. This is a review of plans, not new design research.

Four angles:
1. Plan versus runtime: do the files, functions, records, fields and verbs each plan names exist with the shapes it assumes, and are its test and verify commands runnable here?
2. Cross-phase consistency: do the phases agree on shared records (`by:` actor, grants, `operators.json`, conversation JSONL, memory files, state-root layout, HonoredPosture fields, `bots --json` output read by the terminal screen and the channels), and are the build order and dependencies sound?
3. Parity gaps and overbuild: for a small team, what is still missing after all eleven phases, and what do the plans build that is not needed or duplicates another phase or the runtime?
4. Security and failure modes: secret leakage, token storage, spoofed chat users, who may approve, restarts, lost or duplicated messages and answers, concurrent approvals from terminal and chat, prompt injection through memory, skills or chat, routine `until` and fatigue edge cases.

Every finding names the phase, the doc and line, the evidence with `[SOURCE: path:line]`, a severity (P0 blocks the build, P1 wrong or missing, P2 polish) and the exact spec edit that fixes it. The run ends with findings grouped by phase and ranked, plus a cross-phase conflict list.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Parity gaps and overbuild: against OpenBot's eight parts and the 002 synthesis, what does a small team still lack after all eleven phases, and what do the plans build that is not needed or duplicates another phase or the runtime?
- [x] Plan versus runtime: do the files, functions, records, fields and verbs each of the eleven plans names exist with the shapes it assumes, and are its test and verify commands runnable in this checkout?
- [x] Cross-phase consistency: do the eleven phases agree on the shared records (by: actor, grants, operators.json, conversation JSONL, memory files, state-root layout, HonoredPosture fields, bots --json output) and is the build order and dependency graph sound?
- [x] Security and failure modes: secret leakage, token storage, spoofed chat users, who may approve, restarts, lost or duplicated messages and answers, concurrent approvals from terminal and chat, prompt injection through memory, skills or chat, and routine until and fatigue edge cases.
- [x] Which planned surfaces duplicate the built runtime or another phase and can be cut for a small team, ranked by the build time they save?
- [x] Which runtime modules do more than one phase modify, and in what order must those phases land so the parser, record and index shapes do not collide?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Designing new capabilities. This run reviews plans; it does not author features.
- Implementing any fix. Findings only; implementation is a separate follow-up.
- Re-litigating the 002 parity research conclusions. The 002 synthesis is evidence, not a target.
- Judging code style or test coverage of the built runtime beyond what a plan depends on.
- Modifying any file outside this lineage directory.

---

## 5. STOP CONDITIONS

- `config.stopPolicy` is `max-iterations`: the loop runs all 13 iterations and stops with `maxIterationsReached`. Convergence below the threshold is telemetry only and must not end the run early.
- A hard stop also applies on three consecutive failed iterations, on the max-duration budget, or on an operator pause sentinel.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Parity gaps and overbuild: against OpenBot's eight parts and the 002 synthesis, what does a small team still lack after all eleven phases, and what do the plans build that is not needed or duplicates another phase or the runtime?
- Which planned surfaces duplicate the built runtime or another phase and can be cut for a small team, ranked by the build time they save?
- Which runtime modules do more than one phase modify, and in what order must those phases land so the parser, record and index shapes do not collide?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Assuming `.opencode/bin/bots.cjs` is a symlink.** It is a regular 26,523-byte file, so `diff -q` is a real comparison and the mirror must be edited. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Assuming `.opencode/bin/bots.cjs` is a symlink.** It is a regular 26,523-byte file, so `diff -q` is a real comparison and the mirror must be edited.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Assuming `.opencode/bin/bots.cjs` is a symlink.** It is a regular 26,523-byte file, so `diff -q` is a real comparison and the mirror must be edited.

### **Calling phase 001's `activity.ts` overbuild.** The plan's argument that one module must own the grouping rule so the text and JSON forms cannot disagree (`001-activity-and-actor/plan.md:52`) is sound, and `status.ts` already renders rows but owns no grouping vocabulary. A new module is the smaller change. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Calling phase 001's `activity.ts` overbuild.** The plan's argument that one module must own the grouping rule so the text and JSON forms cannot disagree (`001-activity-and-actor/plan.md:52`) is sound, and `status.ts` already renders rows but owns no grouping vocabulary. A new module is the smaller change.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Calling phase 001's `activity.ts` overbuild.** The plan's argument that one module must own the grouping rule so the text and JSON forms cannot disagree (`001-activity-and-actor/plan.md:52`) is sound, and `status.ts` already renders rows but owns no grouping vocabulary. A new module is the smaller change.

### **Calling phase 011's `channel-link.ts` overbuild.** A chat identity has to resolve to an actor before any approval check, and no runtime module does that today; the lockout is the only part that could be trimmed, and it is five lines of state. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Calling phase 011's `channel-link.ts` overbuild.** A chat identity has to resolve to an actor before any approval check, and no runtime module does that today; the lockout is the only part that could be trimmed, and it is five lines of state.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Calling phase 011's `channel-link.ts` overbuild.** A chat identity has to resolve to an actor before any approval check, and no runtime module does that today; the lockout is the only part that could be trimmed, and it is five lines of state.

### **Calling the packet build-ready with caveats.** Two of the three P0s make a phase's own Definition of Done unreachable, which is the definition of not build-ready. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: **Calling the packet build-ready with caveats.** Two of the three P0s make a phase's own Definition of Done unreachable, which is the definition of not build-ready.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Calling the packet build-ready with caveats.** Two of the three P0s make a phase's own Definition of Done unreachable, which is the definition of not build-ready.

### **Calling the packet unbuildable.** The order is sound, the runtime shapes are mostly matched, and the parity coverage is complete. Three P0s and nine one-line edits is a day's work, not a redesign. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: **Calling the packet unbuildable.** The order is sound, the runtime shapes are mostly matched, and the parity coverage is complete. Three P0s and nine one-line edits is a day's work, not a redesign.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Calling the packet unbuildable.** The order is sound, the runtime shapes are mostly matched, and the parity coverage is complete. Three P0s and nine one-line edits is a day's work, not a redesign.

### **Counting the corrected `channel-approval.ts` finding as a conflict.** Iteration 2 established that 011's index is a message-id-to-item-id map, not a second answer store, so 006 and 011 do not conflict on the answer path; they conflict on the grant scope, which is conflict 11. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Counting the corrected `channel-approval.ts` finding as a conflict.** Iteration 2 established that 011's index is a message-id-to-item-id map, not a second answer store, so 006 and 011 do not conflict on the answer path; they conflict on the grant scope, which is conflict 11.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Counting the corrected `channel-approval.ts` finding as a conflict.** Iteration 2 established that 011's index is a message-id-to-item-id map, not a second answer store, so 006 and 011 do not conflict on the answer path; they conflict on the grant scope, which is conflict 11.

### **Counting the corrected finding twice.** Iteration 2 corrected iteration 1's `channel-approval.ts` duplication finding; the registry holds the correction, so the ranking counts it once, at P2. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Counting the corrected finding twice.** Iteration 2 corrected iteration 1's `channel-approval.ts` duplication finding; the registry holds the correction, so the ranking counts it once, at P2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Counting the corrected finding twice.** Iteration 2 corrected iteration 1's `channel-approval.ts` duplication finding; the registry holds the correction, so the ranking counts it once, at P2.

### **Counting the desktop shell as a gap.** It is deliberately out of scope at `spec.md:85`, so its absence is not a parity gap. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Counting the desktop shell as a gap.** It is deliberately out of scope at `spec.md:85`, so its absence is not a parity gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Counting the desktop shell as a gap.** It is deliberately out of scope at `spec.md:85`, so its absence is not a parity gap.

### **Cutting phase 001's `activity.ts`.** Already ruled out in iteration 2: one module must own the grouping rule so the text and JSON forms cannot disagree. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Cutting phase 001's `activity.ts`.** Already ruled out in iteration 2: one module must own the grouping rule so the text and JSON forms cannot disagree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Cutting phase 001's `activity.ts`.** Already ruled out in iteration 2: one module must own the grouping rule so the text and JSON forms cannot disagree.

### **Cutting phase 003 entirely.** Already ruled out in iteration 3: the operator decision of 2026-11-25 chose the Rust screen. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Cutting phase 003 entirely.** Already ruled out in iteration 3: the operator decision of 2026-11-25 chose the Rust screen.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Cutting phase 003 entirely.** Already ruled out in iteration 3: the operator decision of 2026-11-25 chose the Rust screen.

### **Cutting phase 003 entirely.** The operator decision of 2026-11-25 chose the Rust screen over a web page or a desktop app (`specs/system-skilled-bots/002-openbot-parity-research/research/research.md:157`), so the crate is authorised scope; only its CI job is cuttable. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Cutting phase 003 entirely.** The operator decision of 2026-11-25 chose the Rust screen over a web page or a desktop app (`specs/system-skilled-bots/002-openbot-parity-research/research/research.md:157`), so the crate is authorised scope; only its CI job is cuttable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Cutting phase 003 entirely.** The operator decision of 2026-11-25 chose the Rust screen over a web page or a desktop app (`specs/system-skilled-bots/002-openbot-parity-research/research/research.md:157`), so the crate is authorised scope; only its CI job is cuttable.

### **Cutting phase 004's `isolation.ts` `checkoutBranch`.** `isolation.ts` already exists and already reads branches in `reopenBotWorktree` and `finishBotWorktree` (`isolation.ts:589`, `isolation.ts:675`), but neither reads the main checkout's current branch, which is what the working-place line needs. It is an update, not a duplicate. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Cutting phase 004's `isolation.ts` `checkoutBranch`.** `isolation.ts` already exists and already reads branches in `reopenBotWorktree` and `finishBotWorktree` (`isolation.ts:589`, `isolation.ts:675`), but neither reads the main checkout's current branch, which is what the working-place line needs. It is an update, not a duplicate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Cutting phase 004's `isolation.ts` `checkoutBranch`.** `isolation.ts` already exists and already reads branches in `reopenBotWorktree` and `finishBotWorktree` (`isolation.ts:589`, `isolation.ts:675`), but neither reads the main checkout's current branch, which is what the working-place line needs. It is an update, not a duplicate.

### **Cutting phase 005's memory bound.** The 60-entry and 3,600-byte bound is OpenGhost's measured shape (`specs/system-skilled-bots/context/OpenGhost-main/memory.js:11`), not an invented one. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Cutting phase 005's memory bound.** The 60-entry and 3,600-byte bound is OpenGhost's measured shape (`specs/system-skilled-bots/context/OpenGhost-main/memory.js:11`), not an invented one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Cutting phase 005's memory bound.** The 60-entry and 3,600-byte bound is OpenGhost's measured shape (`specs/system-skilled-bots/context/OpenGhost-main/memory.js:11`), not an invented one.

### **Cutting phase 006's `action-kind.ts` word lists.** Considered as overbuild: a keyword classifier over the bot's own words is a guess. But it is six word lists and one function, and the alternative — a declared `[KIND: …]` marker in the question — changes the prompt contract every phase shares. The saving does not justify the change. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Cutting phase 006's `action-kind.ts` word lists.** Considered as overbuild: a keyword classifier over the bot's own words is a guess. But it is six word lists and one function, and the alternative — a declared `[KIND: …]` marker in the question — changes the prompt contract every phase shares. The saving does not justify the change.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Cutting phase 006's `action-kind.ts` word lists.** Considered as overbuild: a keyword classifier over the bot's own words is a guess. But it is six word lists and one function, and the alternative — a declared `[KIND: …]` marker in the question — changes the prompt contract every phase shares. The saving does not justify the change.

### **Cutting phase 011's `channel-link.ts`.** Already ruled out in iteration 2: a chat identity has to resolve to an actor before any approval check. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Cutting phase 011's `channel-link.ts`.** Already ruled out in iteration 2: a chat identity has to resolve to an actor before any approval check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Cutting phase 011's `channel-link.ts`.** Already ruled out in iteration 2: a chat identity has to resolve to an actor before any approval check.

### **Grouping the edits by finding instead of by document.** A builder applies edits per file; grouping by finding would make them open twelve files 47 times. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **Grouping the edits by finding instead of by document.** A builder applies edits per file; grouping by finding would make them open twelve files 47 times.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Grouping the edits by finding instead of by document.** A builder applies edits per file; grouping by finding would make them open twelve files 47 times.

### **Listing the 003/002 routines pair as a conflict.** It is declared on both sides and agrees; finding 6 records it as the counter-example. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Listing the 003/002 routines pair as a conflict.** It is declared on both sides and agrees; finding 6 records it as the counter-example.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Listing the 003/002 routines pair as a conflict.** It is declared on both sides and agrees; finding 6 records it as the counter-example.

### **Looking for a `bot-check.cjs` invariant over the `until` field.** The checker's hard invariants cover the schedule, the label, the posture and the executor bounds, and none reads the routine block. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Looking for a `bot-check.cjs` invariant over the `until` field.** The checker's hard invariants cover the schedule, the label, the posture and the executor bounds, and none reads the routine block.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a `bot-check.cjs` invariant over the `until` field.** The checker's hard invariants cover the schedule, the label, the posture and the executor bounds, and none reads the routine block.

### **Looking for a `crates/` directory or a Rust toolchain pin in the repository.** Neither exists, so phase 003's toolchain is a new prerequisite rather than an existing one. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Looking for a `crates/` directory or a Rust toolchain pin in the repository.** Neither exists, so phase 003's toolchain is a new prerequisite rather than an existing one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a `crates/` directory or a Rust toolchain pin in the repository.** Neither exists, so phase 003's toolchain is a new prerequisite rather than an existing one.

### **Looking for a `crates/` directory.** It does not exist, which is why phase 003's DoR build check cannot pass before the phase. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Looking for a `crates/` directory.** It does not exist, which is why phase 003's DoR build check cannot pass before the phase.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a `crates/` directory.** It does not exist, which is why phase 003's DoR build check cannot pass before the phase.

### **Looking for a `kind` field on the needs-you item today.** `ITEM_KEYS` has no `kind`, so both phases 005 and 006 introduce one and neither sees the other. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Looking for a `kind` field on the needs-you item today.** `ITEM_KEYS` has no `kind`, so both phases 005 and 006 introduce one and neither sees the other.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a `kind` field on the needs-you item today.** `ITEM_KEYS` has no `kind`, so both phases 005 and 006 introduce one and neither sees the other.

### **Looking for a `schemaVersion` bump in any phase.** No phase mentions `RunRecord.schemaVersion`; only 010's conversation record carries its own `schemaVersion`, which is a different record. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Looking for a `schemaVersion` bump in any phase.** No phase mentions `RunRecord.schemaVersion`; only 010's conversation record carries its own `schemaVersion`, which is a different record.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a `schemaVersion` bump in any phase.** No phase mentions `RunRecord.schemaVersion`; only 010's conversation record carries its own `schemaVersion`, which is a different record.

### **Looking for a 002 row that covers messaging channels.** There is none, including in the skip list and the eliminated-alternatives table, so 011's provenance cannot be recovered from the research. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Looking for a 002 row that covers messaging channels.** There is none, including in the skip list and the eliminated-alternatives table, so 011's provenance cannot be recovered from the research.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a 002 row that covers messaging channels.** There is none, including in the skip list and the eliminated-alternatives table, so 011's provenance cannot be recovered from the research.

### **Looking for a conflict between 002 and 003 on the routines pane.** 003 reads 002's verb and declares it; there is none. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Looking for a conflict between 002 and 003 on the routines pane.** 003 reads 002's verb and declares it; there is none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a conflict between 002 and 003 on the routines pane.** 003 reads 002's verb and declares it; there is none.

### **Looking for a conflict between 004 and 007 on the working place.** 004 names the tree in the prompt and 007 filters the apps inside it; the two touch different inputs of the same run and do not overlap. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Looking for a conflict between 004 and 007 on the working place.** 004 names the tree in the prompt and 007 filters the apps inside it; the two touch different inputs of the same run and do not overlap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a conflict between 004 and 007 on the working place.** 004 names the tree in the prompt and 007 filters the apps inside it; the two touch different inputs of the same run and do not overlap.

### **Looking for a finding that no phase owns.** Every finding names a phase or the parent; none is unassigned. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Looking for a finding that no phase owns.** Every finding names a phase or the parent; none is unassigned.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a finding that no phase owns.** Every finding names a phase or the parent; none is unassigned.

### **Looking for a finding with no edit.** Every one of the 52 has a fix in its own text; the list is a regrouping, not a new analysis. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **Looking for a finding with no edit.** Every one of the 52 has a fix in its own text; the list is a regrouping, not a new analysis.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a finding with no edit.** Every one of the 52 has a fix in its own text; the list is a regrouping, not a new analysis.

### **Looking for a fourth P0.** The sweep in iteration 9 covered every phase's Definition of Done for version and count assertions and found one instance, already recorded. The other two P0s came from cross-document reads, not from a DoD sweep. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: **Looking for a fourth P0.** The sweep in iteration 9 covered every phase's Definition of Done for version and count assertions and found one instance, already recorded. The other two P0s came from cross-document reads, not from a DoD sweep.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a fourth P0.** The sweep in iteration 9 covered every phase's Definition of Done for version and count assertions and found one instance, already recorded. The other two P0s came from cross-document reads, not from a DoD sweep.

### **Looking for a phase that cannot start at all.** Only 003's DoR is circular, and it is a one-line fix. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: **Looking for a phase that cannot start at all.** Only 003's DoR is circular, and it is a one-line fix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a phase that cannot start at all.** Only 003's DoR is circular, and it is a one-line fix.

### **Looking for a phase that declares a parallel build.** None does; the map's transition rules already imply serial order, which is why finding 1 is a missing statement rather than a wrong one. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Looking for a phase that declares a parallel build.** None does; the map's transition rules already imply serial order, which is why finding 1 is a missing statement rather than a wrong one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a phase that declares a parallel build.** None does; the map's transition rules already imply serial order, which is why finding 1 is a missing statement rather than a wrong one.

### **Looking for a phase that enforces app reach.** None does, and 007's own Out of Scope block is the proof; the gap cannot be closed by reading another phase. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Looking for a phase that enforces app reach.** None does, and 007's own Out of Scope block is the proof; the gap cannot be closed by reading another phase.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a phase that enforces app reach.** None does, and 007's own Out of Scope block is the proof; the gap cannot be closed by reading another phase.

### **Looking for a phase with zero findings.** None has zero; 010 has one and 004 has one, and both are cross-phase rather than internal. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Looking for a phase with zero findings.** None has zero; 010 has one and 004 has one, and both are cross-phase rather than internal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a phase with zero findings.** None has zero; 010 has one and 004 has one, and both are cross-phase rather than internal.

### **Looking for a routine block example in the phase docs.** Neither `spec.md` nor `plan.md` shows a filled `routine` block, which is why the prose-versus-command ambiguity survived review: there is no example to read. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Looking for a routine block example in the phase docs.** Neither `spec.md` nor `plan.md` shows a filled `routine` block, which is why the prose-versus-command ambiguity survived review: there is no example to read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a routine block example in the phase docs.** Neither `spec.md` nor `plan.md` shows a filled `routine` block, which is why the prose-versus-command ambiguity survived review: there is no example to read.

### **Looking for a rule store in the runtime.** `needs-you.ts` holds items and answers, not standing rules, so 006's rung 2 has no substrate to read. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Looking for a rule store in the runtime.** `needs-you.ts` holds items and answers, not standing rules, so 006's rung 2 has no substrate to read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a rule store in the runtime.** `needs-you.ts` holds items and answers, not standing rules, so 006's rung 2 has no substrate to read.

### **Looking for a runtime module that already renders status markers.** `status.ts` owns `BOT_ROW_STATES` — ten bot-row states such as `retired`, `held` and `launchd-failed` (`status.ts:42-53`) — which is a different axis from a run's outcome, so 003 cannot reuse it and must read 001's group id instead. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Looking for a runtime module that already renders status markers.** `status.ts` owns `BOT_ROW_STATES` — ten bot-row states such as `retired`, `held` and `launchd-failed` (`status.ts:42-53`) — which is a different axis from a run's outcome, so 003 cannot reuse it and must read 001's group id instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a runtime module that already renders status markers.** `status.ts` owns `BOT_ROW_STATES` — ten bot-row states such as `retired`, `held` and `launchd-failed` (`status.ts:42-53`) — which is a different axis from a run's outcome, so 003 cannot reuse it and must read 001's group id instead.

### **Looking for a second `SCHEMA_VERSION`-shaped P0.** The sweep over every phase's Definition of Done found one instance, already recorded. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Looking for a second `SCHEMA_VERSION`-shaped P0.** The sweep over every phase's Definition of Done found one instance, already recorded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a second `SCHEMA_VERSION`-shaped P0.** The sweep over every phase's Definition of Done found one instance, already recorded.

### **Looking for a shared JSON envelope in the runtime.** `bots status --json` prints its own shape and no module defines a common wrapper, so the envelope has to be introduced by a phase rather than reused. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Looking for a shared JSON envelope in the runtime.** `bots status --json` prints its own shape and no module defines a common wrapper, so the envelope has to be introduced by a phase rather than reused.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a shared JSON envelope in the runtime.** `bots status --json` prints its own shape and no module defines a common wrapper, so the envelope has to be introduced by a phase rather than reused.

### **Looking for a shared-module owner document.** The parent spec has no section listing which runtime module each phase touches; the only such list is each phase's own Files to Change table. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Looking for a shared-module owner document.** The parent spec has no section listing which runtime module each phase touches; the only such list is each phase's own Files to Change table.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a shared-module owner document.** The parent spec has no section listing which runtime module each phase touches; the only such list is each phase's own Files to Change table.

### **Looking for a sub-verb parser in `bots.cjs`.** `parseArgs` has no notion of a second positional as a sub-verb; `VERB_SPECS[verb].ids` counts ids, not sub-verbs. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Looking for a sub-verb parser in `bots.cjs`.** `parseArgs` has no notion of a second positional as a sub-verb; `VERB_SPECS[verb].ids` counts ids, not sub-verbs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a sub-verb parser in `bots.cjs`.** `parseArgs` has no notion of a second positional as a sub-verb; `VERB_SPECS[verb].ids` counts ids, not sub-verbs.

### **Looking for an edit that fixes two findings at once.** Only the parent's `:139` rule does, because it is the target list three other edits fill in. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **Looking for an edit that fixes two findings at once.** Only the parent's `:139` rule does, because it is the target list three other edits fill in.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for an edit that fixes two findings at once.** Only the parent's `:139` rule does, because it is the target list three other edits fill in.

### **Looking for an existing outbound-send retry in `delivery.ts`.** It records `attempted`, `delivered`, `failed` and `uncertain` outcomes (`delivery.ts:75`, `:233-235`) but has no retry or backoff, so 011's backoff table is genuinely new behaviour — the duplication is the queue primitive, not the retry policy. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Looking for an existing outbound-send retry in `delivery.ts`.** It records `attempted`, `delivered`, `failed` and `uncertain` outcomes (`delivery.ts:75`, `:233-235`) but has no retry or backoff, so 011's backoff table is genuinely new behaviour — the duplication is the queue primitive, not the retry policy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for an existing outbound-send retry in `delivery.ts`.** It records `attempted`, `delivered`, `failed` and `uncertain` outcomes (`delivery.ts:75`, `:233-235`) but has no retry or backoff, so 011's backoff table is genuinely new behaviour — the duplication is the queue primitive, not the retry policy.

### **Looking for an existing single-pass multi-value matcher.** `findSecretLiteral` is the only matcher, and it is already one pass over the map (`dispatch.ts:287`). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Looking for an existing single-pass multi-value matcher.** `findSecretLiteral` is the only matcher, and it is already one pass over the map (`dispatch.ts:287`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for an existing single-pass multi-value matcher.** `findSecretLiteral` is the only matcher, and it is already one pass over the map (`dispatch.ts:287`).

### **Looking for an injection test or a fence in the runtime.** `buildBotPrompt` assembles the body, the request and the context with no labelled fences, so the guard has to be introduced rather than reused. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Looking for an injection test or a fence in the runtime.** `buildBotPrompt` assembles the body, the request and the context with no labelled fences, so the guard has to be introduced rather than reused.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for an injection test or a fence in the runtime.** `buildBotPrompt` assembles the body, the request and the context with no labelled fences, so the guard has to be introduced rather than reused.

### **Numbering the edits as a sequence.** Only two have an order (finding 4); the rest are independent, and a sequence would imply a dependency that is not there. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **Numbering the edits as a sequence.** Only two have an order (finding 4); the rest are independent, and a sequence would imply a dependency that is not there.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Numbering the edits as a sequence.** Only two have an order (finding 4); the rest are independent, and a sequence would imply a dependency that is not there.

### **Proposing the edits as patches.** The review's non-goal is implementation; the list names the document, the line and the change, and stops there. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **Proposing the edits as patches.** The review's non-goal is implementation; the list names the document, the line and the change, and stops there.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Proposing the edits as patches.** The review's non-goal is implementation; the list names the document, the line and the change, and stops there.

### **Ranking by phase order instead of severity.** A phase-ordered list would put 001 first and 002's P0 fourth, which buries the one defect that makes a phase's central mechanism unsafe. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Ranking by phase order instead of severity.** A phase-ordered list would put 001 first and 002's P0 fourth, which buries the one defect that makes a phase's central mechanism unsafe.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Ranking by phase order instead of severity.** A phase-ordered list would put 001 first and 002's P0 fourth, which buries the one defect that makes a phase's central mechanism unsafe.

### **Reading phase 004's `'2'` as a deliberate pre-state check.** A Definition of Done is a post-state gate, and 004's own AFFECTED SURFACES repeats the same command as its verification, so the `'2'` is a copy of 001's pre-state, not a design choice. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Reading phase 004's `'2'` as a deliberate pre-state check.** A Definition of Done is a post-state gate, and 004's own AFFECTED SURFACES repeats the same command as its verification, so the `'2'` is a copy of 001's pre-state, not a design choice.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading phase 004's `'2'` as a deliberate pre-state check.** A Definition of Done is a post-state gate, and 004's own AFFECTED SURFACES repeats the same command as its verification, so the `'2'` is a copy of 001's pre-state, not a design choice.

### **Reading phase 010's `--json` array as an envelope.** It is a bare array, which is the shape most likely to break a consumer when a field is added; that is why finding 3 asks for an envelope rather than a version field on the array. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Reading phase 010's `--json` array as an envelope.** It is a bare array, which is the shape most likely to break a consumer when a field is added; that is why finding 3 asks for an envelope rather than a version field on the array.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading phase 010's `--json` array as an envelope.** It is a bare array, which is the shape most likely to break a consumer when a field is added; that is why finding 3 asks for an envelope rather than a version field on the array.

### **Reading the 001 `SCHEMA_VERSION` mismatch as a pre/post-state contradiction.** The Definition of Ready expects `'2'` and the FIX ADDENDUM expects `'3'`; those are the before and after states and are consistent. The real defect is the command's line count, recorded as finding 7. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Reading the 001 `SCHEMA_VERSION` mismatch as a pre/post-state contradiction.** The Definition of Ready expects `'2'` and the FIX ADDENDUM expects `'3'`; those are the before and after states and are consistent. The real defect is the command's line count, recorded as finding 7.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading the 001 `SCHEMA_VERSION` mismatch as a pre/post-state contradiction.** The Definition of Ready expects `'2'` and the FIX ADDENDUM expects `'3'`; those are the before and after states and are consistent. The real defect is the command's line count, recorded as finding 7.

### **Recommending a twelfth phase for the three parity gaps.** Each is a requirement inside a part the packet already builds; a new phase would add a dependency edge for no capability. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: **Recommending a twelfth phase for the three parity gaps.** Each is a requirement inside a part the packet already builds; a new phase would add a dependency edge for no capability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Recommending a twelfth phase for the three parity gaps.** Each is a requirement inside a part the packet already builds; a new phase would add a dependency edge for no capability.

### **Recommending the transport cut as a condition of building.** It is a scope decision for the operator, not a blocker; 011 builds as written, it just builds four adapters nobody asked for. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: **Recommending the transport cut as a condition of building.** It is a scope decision for the operator, not a blocker; 011 builds as written, it just builds four adapters nobody asked for.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Recommending the transport cut as a condition of building.** It is a scope decision for the operator, not a blocker; 011 builds as written, it just builds four adapters nobody asked for.

### **Searching the phase docs for a phase that owns `operators.json`.** None does; the only owner-shaped text is 011's open question, which is why finding 3 is a parent/child contradiction rather than a missing requirement. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Searching the phase docs for a phase that owns `operators.json`.** None does; the only owner-shaped text is 011's open question, which is why finding 3 is a parent/child contradiction rather than a missing requirement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Searching the phase docs for a phase that owns `operators.json`.** None does; the only owner-shaped text is 011's open question, which is why finding 3 is a parent/child contradiction rather than a missing requirement.

### **Treating `needs-you.ts` as a landing-order problem.** The three phases that extend `ITEM_KEYS` land in numeric order; the defect is the `kind` collision recorded in iteration 6, which order cannot fix. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Treating `needs-you.ts` as a landing-order problem.** The three phases that extend `ITEM_KEYS` land in numeric order; the defect is the `kind` collision recorded in iteration 6, which order cannot fix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `needs-you.ts` as a landing-order problem.** The three phases that extend `ITEM_KEYS` land in numeric order; the defect is the `kind` collision recorded in iteration 6, which order cannot fix.

### **Treating `README.md` as a merge risk worth a finding of its own.** It is documentation; it is named in finding 1 only because it shares the nine-phase count. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Treating `README.md` as a merge risk worth a finding of its own.** It is documentation; it is named in finding 1 only because it shares the nine-phase count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `README.md` as a merge risk worth a finding of its own.** It is documentation; it is named in finding 1 only because it shares the nine-phase count.

### **Treating `status-index.ts` as a landing-order problem.** Phase 001 bumps `SCHEMA_VERSION` to `'3'` and phase 004 adds a JSON column with no bump, which is a Definition-of-Done contradiction already recorded as a P0 in iteration 1; the order does not change it. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Treating `status-index.ts` as a landing-order problem.** Phase 001 bumps `SCHEMA_VERSION` to `'3'` and phase 004 adds a JSON column with no bump, which is a Definition-of-Done contradiction already recorded as a P0 in iteration 1; the order does not change it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `status-index.ts` as a landing-order problem.** Phase 001 bumps `SCHEMA_VERSION` to `'3'` and phase 004 adds a JSON column with no bump, which is a Definition-of-Done contradiction already recorded as a P0 in iteration 1; the order does not change it.

### **Treating `unknown` sends as a lost-message defect.** The state is deliberate: a sender with no acknowledgement cannot claim delivery, and `unknown` is the honest record. The defect would be a silent retry, which the phase forbids. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Treating `unknown` sends as a lost-message defect.** The state is deliberate: a sender with no acknowledgement cannot claim delivery, and `unknown` is the honest record. The defect would be a silent retry, which the phase forbids.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `unknown` sends as a lost-message defect.** The state is deliberate: a sender with no acknowledgement cannot claim delivery, and `unknown` is the honest record. The defect would be a silent retry, which the phase forbids.

### **Treating phase 011's dependency on 006 as satisfied by the phase map alone.** The map names 006, but 011's own Out of Scope block removes the grant it depends on, which is why finding 2 is a defect rather than a documentation gap. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Treating phase 011's dependency on 006 as satisfied by the phase map alone.** The map names 006, but 011's own Out of Scope block removes the grant it depends on, which is why finding 2 is a defect rather than a documentation gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating phase 011's dependency on 006 as satisfied by the phase map alone.** The map names 006, but 011's own Out of Scope block removes the grant it depends on, which is why finding 2 is a defect rather than a documentation gap.

### **Treating the `by`/`actor` split as a defect.** Phase 001 uses `by` on an answer and `actor` on a run record deliberately: the answer is a person's act and the run record is a run's attribution. Only the third name, `sender`, is a defect. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Treating the `by`/`actor` split as a defect.** Phase 001 uses `by` on an answer and `actor` on a run record deliberately: the answer is a person's act and the run record is a run's attribution. Only the third name, `sender`, is a defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the `by`/`actor` split as a defect.** Phase 001 uses `by` on an answer and `actor` on a run record deliberately: the answer is a person's act and the run record is a run's attribution. Only the third name, `sender`, is a defect.

### **Treating the `until` check as a precheck.** It reuses the helper's process-group and timeout machinery, which is the right reuse; only the working directory and the outcome vocabulary are wrong. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Treating the `until` check as a precheck.** It reuses the helper's process-group and timeout machinery, which is the right reuse; only the working directory and the outcome vocabulary are wrong.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the `until` check as a precheck.** It reuses the helper's process-group and timeout machinery, which is the right reuse; only the working directory and the outcome vocabulary are wrong.

### **Treating the `until` timeout as the defect.** The timeout works and is tested by the helper's own suite; the defect is that a prose field is executed. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Treating the `until` timeout as the defect.** The timeout works and is tested by the helper's own suite; the defect is that a prose field is executed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the `until` timeout as the defect.** The timeout works and is tested by the helper's own suite; the defect is that a prose field is executed.

### **Treating the 002 ranked order as the packet's scope contract.** It is not: the parent's phase map adds phase 011 and moves the TUI to position 3, so the order is evidence of intent, not a checklist. Reading it as a checklist would have produced a false "all eleven phases are parity work" conclusion. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Treating the 002 ranked order as the packet's scope contract.** It is not: the parent's phase map adds phase 011 and moves the TUI to position 3, so the order is evidence of intent, not a checklist. Reading it as a checklist would have produced a false "all eleven phases are parity work" conclusion.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the 002 ranked order as the packet's scope contract.** It is not: the parent's phase map adds phase 011 and moves the TUI to position 3, so the order is evidence of intent, not a checklist. Reading it as a checklist would have produced a false "all eleven phases are parity work" conclusion.

### **Treating the 17 P2s as one bucket.** They split into three kinds: pure cost (26, 27, 29, 30, 32), unstated contract (31, 34, 38, 39) and stale prose (36, 40). Only the second kind can become a P1 if a builder guesses. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Treating the 17 P2s as one bucket.** They split into three kinds: pure cost (26, 27, 29, 30, 32), unstated contract (31, 34, 38, 39) and stale prose (36, 40). Only the second kind can become a P1 if a builder guesses.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the 17 P2s as one bucket.** They split into three kinds: pure cost (26, 27, 29, 30, 32), unstated contract (31, 34, 38, 39) and stale prose (36, 40). Only the second kind can become a P1 if a builder guesses.

### **Treating the 300 s lockout as insufficient.** It is file-backed and survives a restart, which is the property that matters for a spoofing attempt. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Treating the 300 s lockout as insufficient.** It is file-backed and survives a restart, which is the property that matters for a spoofing attempt.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the 300 s lockout as insufficient.** It is file-backed and survives a restart, which is the property that matters for a spoofing attempt.

### **Treating the eight "unknown verb" probes as a single finding.** They all pass, so they belong in Verified Correct, not in the defect list. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Treating the eight "unknown verb" probes as a single finding.** They all pass, so they belong in Verified Correct, not in the defect list.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the eight "unknown verb" probes as a single finding.** They all pass, so they belong in Verified Correct, not in the defect list.

### **Treating the five transports as five equal cuts.** Telegram is the only transport with no operator prerequisite; WhatsApp needs a public URL and a Meta business account (`011-messaging-channels/spec.md:114`), so it is the first cut, not an equal one. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Treating the five transports as five equal cuts.** Telegram is the only transport with no operator prerequisite; WhatsApp needs a public URL and a Meta business account (`011-messaging-channels/spec.md:114`), so it is the first cut, not an equal one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the five transports as five equal cuts.** Telegram is the only transport with no operator prerequisite; WhatsApp needs a public URL and a Meta business account (`011-messaging-channels/spec.md:114`), so it is the first cut, not an equal one.

### **Treating the four deferred capabilities (d)-(g) as parity failures.** Each is deferred by name with a reason in its own phase, and 002's skip list already rules out the larger versions. They are limits to state, not gaps to close. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Treating the four deferred capabilities (d)-(g) as parity failures.** Each is deferred by name with a reason in its own phase, and 002's skip list already rules out the larger versions. They are limits to state, not gaps to close.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the four deferred capabilities (d)-(g) as parity failures.** Each is deferred by name with a reason in its own phase, and 002's skip list already rules out the larger versions. They are limits to state, not gaps to close.

### **Treating the missing injection guard as a runtime defect.** The runtime builds the prompt and could fence the blocks, but the fence and the boundary sentence are prompt content each phase authors, so the fix belongs in the phase specs. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Treating the missing injection guard as a runtime defect.** The runtime builds the prompt and could fence the blocks, but the fence and the boundary sentence are prompt content each phase authors, so the fix belongs in the phase specs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the missing injection guard as a runtime defect.** The runtime builds the prompt and could fence the blocks, but the fence and the boundary sentence are prompt content each phase authors, so the fix belongs in the phase specs.

### **Treating the numeric build order as a conflict.** Every real edge points backwards, so the order satisfies all fourteen; the defects are in the declared graph, recorded in iteration 8. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Treating the numeric build order as a conflict.** Every real edge points backwards, so the order satisfies all fourteen; the defects are in the declared graph, recorded in iteration 8.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the numeric build order as a conflict.** Every real edge points backwards, so the order satisfies all fourteen; the defects are in the declared graph, recorded in iteration 8.

### **Treating the numeric order as unsound.** Every real dependency edge points backwards — 008 before 011, 005 before 009, 007 before 008 — so building 001 through 011 in order satisfies all of them. The defects are in the declared graph and in the missing serial-order rule, not in the order itself. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Treating the numeric order as unsound.** Every real dependency edge points backwards — 008 before 011, 005 before 009, 007 before 008 — so building 001 through 011 in order satisfies all of them. The defects are in the declared graph and in the missing serial-order rule, not in the order itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the numeric order as unsound.** Every real dependency edge points backwards — 008 before 011, 005 before 009, 007 before 008 — so building 001 through 011 in order satisfies all of them. The defects are in the declared graph and in the missing serial-order rule, not in the order itself.

### **Treating the parent's stale audit trail as a cross-phase conflict.** It is a documentation defect in one document, recorded as P2 in iteration 1, and no two phases disagree because of it. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Treating the parent's stale audit trail as a cross-phase conflict.** It is a documentation defect in one document, recorded as P2 in iteration 1, and no two phases disagree because of it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the parent's stale audit trail as a cross-phase conflict.** It is a documentation defect in one document, recorded as P2 in iteration 1, and no two phases disagree because of it.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Counting the desktop shell as a gap.** It is deliberately out of scope at `spec.md:85`, so its absence is not a parity gap. (iteration 1)
- **Looking for a 002 row that covers messaging channels.** There is none, including in the skip list and the eliminated-alternatives table, so 011's provenance cannot be recovered from the research. (iteration 1)
- **Reading the 001 `SCHEMA_VERSION` mismatch as a pre/post-state contradiction.** The Definition of Ready expects `'2'` and the FIX ADDENDUM expects `'3'`; those are the before and after states and are consistent. The real defect is the command's line count, recorded as finding 7. (iteration 1)
- **Searching the phase docs for a phase that owns `operators.json`.** None does; the only owner-shaped text is 011's open question, which is why finding 3 is a parent/child contradiction rather than a missing requirement. (iteration 1)
- **Treating the 002 ranked order as the packet's scope contract.** It is not: the parent's phase map adds phase 011 and moves the TUI to position 3, so the order is evidence of intent, not a checklist. Reading it as a checklist would have produced a false "all eleven phases are parity work" conclusion. (iteration 1)
- **Calling phase 001's `activity.ts` overbuild.** The plan's argument that one module must own the grouping rule so the text and JSON forms cannot disagree (`001-activity-and-actor/plan.md:52`) is sound, and `status.ts` already renders rows but owns no grouping vocabulary. A new module is the smaller change. (iteration 2)
- **Calling phase 011's `channel-link.ts` overbuild.** A chat identity has to resolve to an actor before any approval check, and no runtime module does that today; the lockout is the only part that could be trimmed, and it is five lines of state. (iteration 2)
- **Looking for a `crates/` directory or a Rust toolchain pin in the repository.** Neither exists, so phase 003's toolchain is a new prerequisite rather than an existing one. (iteration 2)
- **Looking for an existing outbound-send retry in `delivery.ts`.** It records `attempted`, `delivered`, `failed` and `uncertain` outcomes (`delivery.ts:75`, `:233-235`) but has no retry or backoff, so 011's backoff table is genuinely new behaviour — the duplication is the queue primitive, not the retry policy. (iteration 2)
- **Treating the five transports as five equal cuts.** Telegram is the only transport with no operator prerequisite; WhatsApp needs a public URL and a Meta business account (`011-messaging-channels/spec.md:114`), so it is the first cut, not an equal one. (iteration 2)
- **Cutting phase 003 entirely.** The operator decision of 2026-11-25 chose the Rust screen over a web page or a desktop app (`specs/system-skilled-bots/002-openbot-parity-research/research/research.md:157`), so the crate is authorised scope; only its CI job is cuttable. (iteration 3)
- **Cutting phase 005's memory bound.** The 60-entry and 3,600-byte bound is OpenGhost's measured shape (`specs/system-skilled-bots/context/OpenGhost-main/memory.js:11`), not an invented one. (iteration 3)
- **Looking for a phase that enforces app reach.** None does, and 007's own Out of Scope block is the proof; the gap cannot be closed by reading another phase. (iteration 3)
- **Looking for a rule store in the runtime.** `needs-you.ts` holds items and answers, not standing rules, so 006's rung 2 has no substrate to read. (iteration 3)
- **Treating the four deferred capabilities (d)-(g) as parity failures.** Each is deferred by name with a reason in its own phase, and 002's skip list already rules out the larger versions. They are limits to state, not gaps to close. (iteration 3)
- **Assuming `.opencode/bin/bots.cjs` is a symlink.** It is a regular 26,523-byte file, so `diff -q` is a real comparison and the mirror must be edited. (iteration 4)
- **Looking for a `crates/` directory.** It does not exist, which is why phase 003's DoR build check cannot pass before the phase. (iteration 4)
- **Looking for a sub-verb parser in `bots.cjs`.** `parseArgs` has no notion of a second positional as a sub-verb; `VERB_SPECS[verb].ids` counts ids, not sub-verbs. (iteration 4)
- **Reading phase 004's `'2'` as a deliberate pre-state check.** A Definition of Done is a post-state gate, and 004's own AFFECTED SURFACES repeats the same command as its verification, so the `'2'` is a copy of 001's pre-state, not a design choice. (iteration 4)
- **Treating the eight "unknown verb" probes as a single finding.** They all pass, so they belong in Verified Correct, not in the defect list. (iteration 4)
- **Looking for a `schemaVersion` bump in any phase.** No phase mentions `RunRecord.schemaVersion`; only 010's conversation record carries its own `schemaVersion`, which is a different record. (iteration 5)
- **Looking for a shared JSON envelope in the runtime.** `bots status --json` prints its own shape and no module defines a common wrapper, so the envelope has to be introduced by a phase rather than reused. (iteration 5)
- **Reading phase 010's `--json` array as an envelope.** It is a bare array, which is the shape most likely to break a consumer when a field is added; that is why finding 3 asks for an envelope rather than a version field on the array. (iteration 5)
- **Treating phase 011's dependency on 006 as satisfied by the phase map alone.** The map names 006, but 011's own Out of Scope block removes the grant it depends on, which is why finding 2 is a defect rather than a documentation gap. (iteration 5)
- **Treating the `by`/`actor` split as a defect.** Phase 001 uses `by` on an answer and `actor` on a run record deliberately: the answer is a person's act and the run record is a run's attribution. Only the third name, `sender`, is a defect. (iteration 5)
- **Looking for a `kind` field on the needs-you item today.** `ITEM_KEYS` has no `kind`, so both phases 005 and 006 introduce one and neither sees the other. (iteration 6)
- **Looking for an injection test or a fence in the runtime.** `buildBotPrompt` assembles the body, the request and the context with no labelled fences, so the guard has to be introduced rather than reused. (iteration 6)
- **Treating `unknown` sends as a lost-message defect.** The state is deliberate: a sender with no acknowledgement cannot claim delivery, and `unknown` is the honest record. The defect would be a silent retry, which the phase forbids. (iteration 6)
- **Treating the 300 s lockout as insufficient.** It is file-backed and survives a restart, which is the property that matters for a spoofing attempt. (iteration 6)
- **Treating the missing injection guard as a runtime defect.** The runtime builds the prompt and could fence the blocks, but the fence and the boundary sentence are prompt content each phase authors, so the fix belongs in the phase specs. (iteration 6)
- **Cutting phase 001's `activity.ts`.** Already ruled out in iteration 2: one module must own the grouping rule so the text and JSON forms cannot disagree. (iteration 7)
- **Cutting phase 003 entirely.** Already ruled out in iteration 3: the operator decision of 2026-11-25 chose the Rust screen. (iteration 7)
- **Cutting phase 004's `isolation.ts` `checkoutBranch`.** `isolation.ts` already exists and already reads branches in `reopenBotWorktree` and `finishBotWorktree` (`isolation.ts:589`, `isolation.ts:675`), but neither reads the main checkout's current branch, which is what the working-place line needs. It is an update, not a duplicate. (iteration 7)
- **Cutting phase 006's `action-kind.ts` word lists.** Considered as overbuild: a keyword classifier over the bot's own words is a guess. But it is six word lists and one function, and the alternative — a declared `[KIND: …]` marker in the question — changes the prompt contract every phase shares. The saving does not justify the change. (iteration 7)
- **Cutting phase 011's `channel-link.ts`.** Already ruled out in iteration 2: a chat identity has to resolve to an actor before any approval check. (iteration 7)
- **Looking for a runtime module that already renders status markers.** `status.ts` owns `BOT_ROW_STATES` — ten bot-row states such as `retired`, `held` and `launchd-failed` (`status.ts:42-53`) — which is a different axis from a run's outcome, so 003 cannot reuse it and must read 001's group id instead. (iteration 7)
- **Looking for an existing single-pass multi-value matcher.** `findSecretLiteral` is the only matcher, and it is already one pass over the map (`dispatch.ts:287`). (iteration 7)
- **Looking for a phase that declares a parallel build.** None does; the map's transition rules already imply serial order, which is why finding 1 is a missing statement rather than a wrong one. (iteration 8)
- **Looking for a shared-module owner document.** The parent spec has no section listing which runtime module each phase touches; the only such list is each phase's own Files to Change table. (iteration 8)
- **Treating `needs-you.ts` as a landing-order problem.** The three phases that extend `ITEM_KEYS` land in numeric order; the defect is the `kind` collision recorded in iteration 6, which order cannot fix. (iteration 8)
- **Treating `README.md` as a merge risk worth a finding of its own.** It is documentation; it is named in finding 1 only because it shares the nine-phase count. (iteration 8)
- **Treating `status-index.ts` as a landing-order problem.** Phase 001 bumps `SCHEMA_VERSION` to `'3'` and phase 004 adds a JSON column with no bump, which is a Definition-of-Done contradiction already recorded as a P0 in iteration 1; the order does not change it. (iteration 8)
- **Treating the numeric order as unsound.** Every real dependency edge points backwards — 008 before 011, 005 before 009, 007 before 008 — so building 001 through 011 in order satisfies all of them. The defects are in the declared graph and in the missing serial-order rule, not in the order itself. (iteration 8)
- **Looking for a `bot-check.cjs` invariant over the `until` field.** The checker's hard invariants cover the schedule, the label, the posture and the executor bounds, and none reads the routine block. (iteration 9)
- **Looking for a routine block example in the phase docs.** Neither `spec.md` nor `plan.md` shows a filled `routine` block, which is why the prose-versus-command ambiguity survived review: there is no example to read. (iteration 9)
- **Looking for a second `SCHEMA_VERSION`-shaped P0.** The sweep over every phase's Definition of Done found one instance, already recorded. (iteration 9)
- **Treating the `until` check as a precheck.** It reuses the helper's process-group and timeout machinery, which is the right reuse; only the working directory and the outcome vocabulary are wrong. (iteration 9)
- **Treating the `until` timeout as the defect.** The timeout works and is tested by the helper's own suite; the defect is that a prose field is executed. (iteration 9)
- **Counting the corrected finding twice.** Iteration 2 corrected iteration 1's `channel-approval.ts` duplication finding; the registry holds the correction, so the ranking counts it once, at P2. (iteration 10)
- **Looking for a finding that no phase owns.** Every finding names a phase or the parent; none is unassigned. (iteration 10)
- **Looking for a phase with zero findings.** None has zero; 010 has one and 004 has one, and both are cross-phase rather than internal. (iteration 10)
- **Ranking by phase order instead of severity.** A phase-ordered list would put 001 first and 002's P0 fourth, which buries the one defect that makes a phase's central mechanism unsafe. (iteration 10)
- **Treating the 17 P2s as one bucket.** They split into three kinds: pure cost (26, 27, 29, 30, 32), unstated contract (31, 34, 38, 39) and stale prose (36, 40). Only the second kind can become a P1 if a builder guesses. (iteration 10)
- **Counting the corrected `channel-approval.ts` finding as a conflict.** Iteration 2 established that 011's index is a message-id-to-item-id map, not a second answer store, so 006 and 011 do not conflict on the answer path; they conflict on the grant scope, which is conflict 11. (iteration 11)
- **Listing the 003/002 routines pair as a conflict.** It is declared on both sides and agrees; finding 6 records it as the counter-example. (iteration 11)
- **Looking for a conflict between 002 and 003 on the routines pane.** 003 reads 002's verb and declares it; there is none. (iteration 11)
- **Looking for a conflict between 004 and 007 on the working place.** 004 names the tree in the prompt and 007 filters the apps inside it; the two touch different inputs of the same run and do not overlap. (iteration 11)
- **Treating the numeric build order as a conflict.** Every real edge points backwards, so the order satisfies all fourteen; the defects are in the declared graph, recorded in iteration 8. (iteration 11)
- **Treating the parent's stale audit trail as a cross-phase conflict.** It is a documentation defect in one document, recorded as P2 in iteration 1, and no two phases disagree because of it. (iteration 11)
- **Grouping the edits by finding instead of by document.** A builder applies edits per file; grouping by finding would make them open twelve files 47 times. (iteration 12)
- **Looking for a finding with no edit.** Every one of the 52 has a fix in its own text; the list is a regrouping, not a new analysis. (iteration 12)
- **Looking for an edit that fixes two findings at once.** Only the parent's `:139` rule does, because it is the target list three other edits fill in. (iteration 12)
- **Numbering the edits as a sequence.** Only two have an order (finding 4); the rest are independent, and a sequence would imply a dependency that is not there. (iteration 12)
- **Proposing the edits as patches.** The review's non-goal is implementation; the list names the document, the line and the change, and stops there. (iteration 12)
- **Calling the packet build-ready with caveats.** Two of the three P0s make a phase's own Definition of Done unreachable, which is the definition of not build-ready. (iteration 13)
- **Calling the packet unbuildable.** The order is sound, the runtime shapes are mostly matched, and the parity coverage is complete. Three P0s and nine one-line edits is a day's work, not a redesign. (iteration 13)
- **Looking for a fourth P0.** The sweep in iteration 9 covered every phase's Definition of Done for version and count assertions and found one instance, already recorded. The other two P0s came from cross-document reads, not from a DoD sweep. (iteration 13)
- **Looking for a phase that cannot start at all.** Only 003's DoR is circular, and it is a one-line fix. (iteration 13)
- **Recommending a twelfth phase for the three parity gaps.** Each is a requirement inside a part the packet already builds; a new phase would add a dependency edge for no capability. (iteration 13)
- **Recommending the transport cut as a condition of building.** It is a scope decision for the operator, not a blocker; 011 builds as written, it just builds four adapters nobody asked for. (iteration 13)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Bounded Context Snapshot

- Source pointers: `specs/system-skilled-bots/003-openbot-parity-build/{001..011}-*/{spec,plan,tasks,acceptance-criteria}.md`; `.skilled/skills/system-skilled-bots/runtime/lib/`; `.skilled/bin/bots.cjs`; `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs`; `.skilled/skills/system-skilled-bots/runtime/tests/`; `specs/system-skilled-bots/002-openbot-parity-research/research/research.md`; `specs/system-skilled-bots/context/{OpenBot-main,OpenMausBot-main,rakazo-main,openhuman-main,OpenGhost-main,hermes-muse-main,turnstone-main,buzz-main,tinychannels-main}`.
- Reuse candidates: the built runtime's record shapes, verbs and state-root layout are the ground truth a plan must match.
- Integration points: `bots --json` output, `operators.json`, grants, conversation JSONL, memory files, HonoredPosture, state-root layout.
- Constraints and risks: all evidence is read-only; the review must not modify the packet or the runtime.
- resource-map.md not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 13
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue` (live); `fork` deferred
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Question injection surface: `inbox.jsonl`
- Canonical pause sentinel: `.deep-research-pause`
- Current generation: 1
- Started: 2025-11-25T15:05:00.000Z
