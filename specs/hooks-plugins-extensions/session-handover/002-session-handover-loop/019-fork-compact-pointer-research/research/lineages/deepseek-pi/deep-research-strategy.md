---
title: Deep Research Strategy — fork compact-pointer misfire
description: Lineage strategy for the deepseek-pi research lineage investigating why the session-relaunch compact-pointer hook fires into forked sub-agents.
---

# Deep Research Strategy - fork compact-pointer misfire

## 1. OVERVIEW

### Purpose

Persistent brain for the deepseek-pi lineage: which questions are open, what was tried, what failed, and where the next iteration looks.

### Usage

- Init writes Topic, Key Questions, Non-Goals, Stop Conditions, Known Context.
- Per iteration the agent reads Next Focus and writes evidence to `iterations/iteration-NNN.md`; the reducer refreshes the machine-owned sections.

---

## 2. TOPIC
Debug the session-relaunch compact-pointer misfire into forked sub-agents: establish the exact mechanism by which the Claude SessionStart hook `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs` fires (and names a parent-owned claim note) inside a fork sub-agent whose parent never compacted, map every hook path that shares the hazard, and name the smallest correct fix plus the test that would prove it.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What does the SessionStart compact payload actually contain for a fork versus its parent session?
- [x] Where do fork sub-agent transcripts live, and do they carry the parent session_id or a distinct id?
- [x] Which hook paths (nudge, note-keep, claim, Stop-arm) key off session_id and therefore share the fork hazard?
- [x] What is the smallest correct fix that separates a fork from its parent without regressing the parent path?
- [x] What test or observable evidence would prove the fork misfire is gone?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implement the fix. This lineage reports findings and a recommended patch; writing hook source is out of scope.
- Redesign the relaunch state machine or the note/claim schema.
- Evaluate runtimes other than Claude Code for this hazard, except where they share the same hook file.

---

## 5. STOP CONDITIONS
- Stop policy is `max-iterations`: all 10 iterations run even if the convergence score falls below 0.1. Early convergence is telemetry only; a low ratio means the next iteration broadens the review angle instead of synthesizing early.
- Any further iteration would require writing outside this lineage directory: record the scope limit as a finding and continue with read-only evidence.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What does the SessionStart compact payload actually contain for a fork versus its parent session?
- Where do fork sub-agent transcripts live, and do they carry the parent session_id or a distinct id?
- Which hook paths (nudge, note-keep, claim, Stop-arm) key off session_id and therefore share the fork hazard?
- What is the smallest correct fix that separates a fork from its parent without regressing the parent path?
- What test or observable evidence would prove the fork misfire is gone?

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
### "Add an agent-identity check to the payload": ruled out for the third time by the documented payload contract, which carries no agent field. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: "Add an agent-identity check to the payload": ruled out for the third time by the documented payload contract, which carries no agent field.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Add an agent-identity check to the payload": ruled out for the third time by the documented payload contract, which carries no agent field.

### "Apply the same fix to every runtime adapter": ruled out because no other runtime has a compact pointer; the shared hazard is session-keyed state, which is a different finding with a different fix. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "Apply the same fix to every runtime adapter": ruled out because no other runtime has a compact pointer; the shared hazard is session-keyed state, which is a different finding with a different fix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Apply the same fix to every runtime adapter": ruled out because no other runtime has a compact pointer; the shared hazard is session-keyed state, which is a different finding with a different fix.

### "Assert on the log row alone": ruled out as the primary evidence, because a log row proves a decision was recorded, not that the parent path still emits. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "Assert on the log row alone": ruled out as the primary evidence, because a log row proves a decision was recorded, not that the parent path still emits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Assert on the log row alone": ruled out as the primary evidence, because a log row proves a decision was recorded, not that the parent path still emits.

### "Disable the pointer for all forks by registering a SubagentStart marker": ruled out as the smallest fix, because it adds a new hook registration where a transcript check inside the existing hook suffices. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: "Disable the pointer for all forks by registering a SubagentStart marker": ruled out as the smallest fix, because it adds a new hook registration where a transcript check inside the existing hook suffices.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Disable the pointer for all forks by registering a SubagentStart marker": ruled out as the smallest fix, because it adds a new hook registration where a transcript check inside the existing hook suffices.

### "Every project hook misfires in a fork": ruled out by the attachment census — PostToolUse and Stop adapters never ran in the forks, so the blast radius is SessionStart plus the seed's instruction, not the whole hook surface. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "Every project hook misfires in a fork": ruled out by the attachment census — PostToolUse and Stop adapters never ran in the forks, so the blast radius is SessionStart plus the seed's instruction, not the whole hook surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Every project hook misfires in a fork": ruled out by the attachment census — PostToolUse and Stop adapters never ran in the forks, so the blast radius is SessionStart plus the seed's instruction, not the whole hook surface.

### "Fail open on a missing transcript to protect the parent path": ruled out because the parent path is documented to carry `transcript_path`, and a silent fail-open reproduces exactly the observed misfire. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "Fail open on a missing transcript to protect the parent path": ruled out because the parent path is documented to carry `transcript_path`, and a silent fail-open reproduces exactly the observed misfire.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Fail open on a missing transcript to protect the parent path": ruled out because the parent path is documented to carry `transcript_path`, and a silent fail-open reproduces exactly the observed misfire.

### "Fork writes its turns into the parent transcript, so one path covers both": ruled out by the zero sidechain count in the parent transcript. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "Fork writes its turns into the parent transcript, so one path covers both": ruled out by the zero sidechain count in the parent transcript.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Fork writes its turns into the parent transcript, so one path covers both": ruled out by the zero sidechain count in the parent transcript.

### "Infer compaction from the nudge state file": ruled out because the state file is exactly what the hook overwrites, so it cannot serve as evidence. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "Infer compaction from the nudge state file": ruled out because the state file is exactly what the hook overwrites, so it cannot serve as evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Infer compaction from the nudge state file": ruled out because the state file is exactly what the hook overwrites, so it cannot serve as evidence.

### "Key the fix on transcript_path matching a `/subagents/` segment": not refuted, but unprovable from local evidence, and it would be wrong if the payload names the parent transcript. Recorded as a candidate with a known risk rather than the recommendation. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "Key the fix on transcript_path matching a `/subagents/` segment": not refuted, but unprovable from local evidence, and it would be wrong if the payload names the parent transcript. Recorded as a candidate with a known risk rather than the recommendation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Key the fix on transcript_path matching a `/subagents/` segment": not refuted, but unprovable from local evidence, and it would be wrong if the payload names the parent transcript. Recorded as a candidate with a known risk rather than the recommendation.

### "Patch only the seed text so it stops claiming a compaction": ruled out as insufficient, because the fork would still be pushed to claim the parent's note; the text is a symptom of the missing gate. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "Patch only the seed text so it stops claiming a compaction": ruled out as insufficient, because the fork would still be pushed to claim the parent's note; the text is a symptom of the missing gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Patch only the seed text so it stops claiming a compaction": ruled out as insufficient, because the fork would still be pushed to claim the parent's note; the text is a symptom of the missing gate.

### "Read the fork marker out of the payload": ruled out by the documented payload contract, which exposes no agent or fork field. Any fix must derive fork-ness from a value the payload does carry. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "Read the fork marker out of the payload": ruled out by the documented payload contract, which exposes no agent or fork field. Any fix must derive fork-ness from a value the payload does carry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Read the fork marker out of the payload": ruled out by the documented payload contract, which exposes no agent or fork field. Any fix must derive fork-ness from a value the payload does carry.

### "Reuse the existing transcript reader": ruled out because nothing in the tree parses compaction boundaries and the tail helper is not exported. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "Reuse the existing transcript reader": ruled out because nothing in the tree parses compaction boundaries and the tail helper is not exported.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Reuse the existing transcript reader": ruled out because nothing in the tree parses compaction boundaries and the tail helper is not exported.

### "Store the delivery marker in the note frontmatter": ruled out because the note is the parent's artifact and the marker would then travel with it into a future claim, confusing `status` semantics. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "Store the delivery marker in the note frontmatter": ruled out because the note is the parent's artifact and the marker would then travel with it into a future claim, confusing `status` semantics.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Store the delivery marker in the note frontmatter": ruled out because the note is the parent's artifact and the marker would then travel with it into a future claim, confusing `status` semantics.

### "The boundary guard alone is sufficient": ruled out by residual window A, which the guard structurally cannot see. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "The boundary guard alone is sufficient": ruled out by residual window A, which the guard structurally cannot see.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The boundary guard alone is sufficient": ruled out by residual window A, which the guard structurally cannot see.

### "The fork hazard can be detected from transcript-side metadata by the hook": ruled out because `agentId`/`isSidechain` live on transcript records, while the adapter only receives the payload. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The fork hazard can be detected from transcript-side metadata by the hook": ruled out because `agentId`/`isSidechain` live on transcript records, while the adapter only receives the payload.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The fork hazard can be detected from transcript-side metadata by the hook": ruled out because `agentId`/`isSidechain` live on transcript records, while the adapter only receives the payload.

### "The fork is protected because a model refuses the instruction": ruled out as a control, since `claimHandoff` would have accepted the claim; the refusals observed were model judgment, not an enforced guarantee. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The fork is protected because a model refuses the instruction": ruled out as a control, since `claimHandoff` would have accepted the claim; the refusals observed were model judgment, not an enforced guarantee.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The fork is protected because a model refuses the instruction": ruled out as a control, since `claimHandoff` would have accepted the claim; the refusals observed were model judgment, not an enforced guarantee.

### "The fork ran the hook in a different state directory": ruled out because the hook's `stateDir()` keys on uid (501), not on agent, so forks and parent share one relaunch state directory. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The fork ran the hook in a different state directory": ruled out because the hook's `stateDir()` keys on uid (501), not on agent, so forks and parent share one relaunch state directory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The fork ran the hook in a different state directory": ruled out because the hook's `stateDir()` keys on uid (501), not on agent, so forks and parent share one relaunch state directory.

### "The hook is mis-registered on a start source other than compact": ruled out because the registration has an empty matcher and the hook returns early unless `payload.source === 'compact'`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The hook is mis-registered on a start source other than compact": ruled out because the registration has an empty matcher and the hook returns early unless `payload.source === 'compact'`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The hook is mis-registered on a start source other than compact": ruled out because the registration has an empty matcher and the hook returns early unless `payload.source === 'compact'`.

### "The parent compacted and the transcript simply lacks the boundary": ruled out because the parent transcript has zero compact_boundary records on 2026-10-21 while three SessionStart:compact hook attachments exist only in fork sidechains. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The parent compacted and the transcript simply lacks the boundary": ruled out because the parent transcript has zero compact_boundary records on 2026-10-21 while three SessionStart:compact hook attachments exist only in fork sidechains.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The parent compacted and the transcript simply lacks the boundary": ruled out because the parent transcript has zero compact_boundary records on 2026-10-21 while three SessionStart:compact hook attachments exist only in fork sidechains.

### "The pending-handoff guard covers the unwrapped case": ruled out because the guard is keyed on `SKILLED_LOOP_ID` and the observed note has an empty `loop_id`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The pending-handoff guard covers the unwrapped case": ruled out because the guard is keyed on `SKILLED_LOOP_ID` and the observed note has an empty `loop_id`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The pending-handoff guard covers the unwrapped case": ruled out because the guard is keyed on `SKILLED_LOOP_ID` and the observed note has an empty `loop_id`.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- "The hook is mis-registered on a start source other than compact": ruled out because the registration has an empty matcher and the hook returns early unless `payload.source === 'compact'`. (iteration 1)
- "The parent compacted and the transcript simply lacks the boundary": ruled out because the parent transcript has zero compact_boundary records on 2026-10-21 while three SessionStart:compact hook attachments exist only in fork sidechains. (iteration 1)
- "Read the fork marker out of the payload": ruled out by the documented payload contract, which exposes no agent or fork field. Any fix must derive fork-ness from a value the payload does carry. (iteration 2)
- "The fork ran the hook in a different state directory": ruled out because the hook's `stateDir()` keys on uid (501), not on agent, so forks and parent share one relaunch state directory. (iteration 2)
- "The fork is protected because a model refuses the instruction": ruled out as a control, since `claimHandoff` would have accepted the claim; the refusals observed were model judgment, not an enforced guarantee. (iteration 3)
- "The pending-handoff guard covers the unwrapped case": ruled out because the guard is keyed on `SKILLED_LOOP_ID` and the observed note has an empty `loop_id`. (iteration 3)
- "Every project hook misfires in a fork": ruled out by the attachment census — PostToolUse and Stop adapters never ran in the forks, so the blast radius is SessionStart plus the seed's instruction, not the whole hook surface. (iteration 4)
- "The fork hazard can be detected from transcript-side metadata by the hook": ruled out because `agentId`/`isSidechain` live on transcript records, while the adapter only receives the payload. (iteration 4)
- "Fork writes its turns into the parent transcript, so one path covers both": ruled out by the zero sidechain count in the parent transcript. (iteration 5)
- "Key the fix on transcript_path matching a `/subagents/` segment": not refuted, but unprovable from local evidence, and it would be wrong if the payload names the parent transcript. Recorded as a candidate with a known risk rather than the recommendation. (iteration 5)
- "Infer compaction from the nudge state file": ruled out because the state file is exactly what the hook overwrites, so it cannot serve as evidence. (iteration 6)
- "Patch only the seed text so it stops claiming a compaction": ruled out as insufficient, because the fork would still be pushed to claim the parent's note; the text is a symptom of the missing gate. (iteration 6)
- "Apply the same fix to every runtime adapter": ruled out because no other runtime has a compact pointer; the shared hazard is session-keyed state, which is a different finding with a different fix. (iteration 7)
- "Fail open on a missing transcript to protect the parent path": ruled out because the parent path is documented to carry `transcript_path`, and a silent fail-open reproduces exactly the observed misfire. (iteration 7)
- "Assert on the log row alone": ruled out as the primary evidence, because a log row proves a decision was recorded, not that the parent path still emits. (iteration 8)
- "Reuse the existing transcript reader": ruled out because nothing in the tree parses compaction boundaries and the tail helper is not exported. (iteration 8)
- "Store the delivery marker in the note frontmatter": ruled out because the note is the parent's artifact and the marker would then travel with it into a future claim, confusing `status` semantics. (iteration 9)
- "The boundary guard alone is sufficient": ruled out by residual window A, which the guard structurally cannot see. (iteration 9)
- "Add an agent-identity check to the payload": ruled out for the third time by the documented payload contract, which carries no agent field. (iteration 10)
- "Disable the pointer for all forks by registering a SubagentStart marker": ruled out as the smallest fix, because it adds a new hook registration where a transcript check inside the existing hook suffices. (iteration 10)

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
- What else does the fork's SessionStart payload carry (transcript_path, any agent id, cwd) that a gate could read? (iteration 1)
- Which other hook paths key off session_id and share this hazard? (iteration 1)
- What is the smallest correct discriminator, and what test proves it? (iteration 1)
- What the smallest correct fix is, and what test proves it. (iteration 2)
- Which of the nudge, note-keep, claim and Stop-arm paths share the hazard, and how severe each is. (iteration 2)
- Whether a fork's transcript_path points at its own subagent jsonl or at the parent transcript — unproven locally, and the deciding detail for one candidate fix. (iteration 2)
- Whether the Stop-arm and the UserPromptSubmit/PostToolUse nudge paths fire inside forks at all, and what they would do there. (iteration 3)
- Whether a fork's transcript_path differs from the parent's — the deciding detail for a transcript-based fix. (iteration 3)
- The smallest correct fix and its proof test. (iteration 3)
- Whether a fork's `transcript_path` points at its own subagent jsonl or at the parent transcript — still unproven, and it decides which fix is smallest. (iteration 4)
- The smallest correct fix and the test that proves it. (iteration 4)
- The test that would prove the fix. (iteration 5)
- The smallest correct fix, given that `transcript_path` may name either transcript. (iteration 5)
- Whether any existing test or caller depends on the pointer firing without a transcript, which would make the fail-closed branch a breaking change. (iteration 6)
- The exact test set that proves the fix and the suppression side-effect property. (iteration 6)
- Whether the boundary guard still lets a fork through after a genuine parent compaction, and how large that residual window is. (iteration 8)
- Whether the second clause belongs in the same change or a follow-up, and the final consolidated recommendation. (iteration 9)
- The fork's exact `transcript_path` value, which no local artifact records. It does not change the recommended fix. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Pointer-based snapshot, captured before iteration 1:

- Hook under investigation: `.skilled/hooks/session-relaunch/claude/compact-pointer.mjs` (the logged emitter of `compact-pointer`).
- Relaunch runtime state: `os.tmpdir()/skilled-relaunch-501/` (`relaunch.log`, claim-note files such as `20261021T140733Z-0b9dc60c.md`).
- Parent transcript: `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/0b9dc60c-478f-4659-8191-2da52f1cd765.jsonl` (no `compact_boundary` on 2026-10-21).
- The packet this lineage belongs to is itself the hook subsystem's spec tree: `specs/hooks/023-session-relaunch-loop/`, which should hold the launcher, note, claim and Stop-arm implementations to compare against the Claude hook adapter.
- Reuse candidates: the sibling hook implementations and any existing hook test harness, so the proposed test lands where the repo already tests hooks.

### Bounded Context Snapshot

- Source pointers: `.skilled/hooks/session-relaunch/`, `specs/hooks/023-session-relaunch-loop/`.
- Integration points: hook payload shape (session_id, transcript_path, source), claim-note naming, Stop-arm gating.
- Constraints and risks: the reproduction depends on Claude Code's fork payload, which may only be observable in logs and transcripts on this machine, not from source in this repo.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.1
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-10-21T18:48:08Z
