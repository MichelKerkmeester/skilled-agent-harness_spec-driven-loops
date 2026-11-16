---
title: Deep Research Strategy - OpenCode/Pi Session Hand-Over Parity
description: Runtime strategy for the opencode-go-deepseek detached fan-out lineage of the 011 OpenCode/Pi hand-over parity packet.
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for this lineage's research run. Records what to investigate, what worked, what failed, and where to focus next. Read at every iteration; machine-owned sections are rewritten by the reducer.

### Mutability

Analyst-owned sections stay stable. Sections 3, 6, 7-11A are rewritten by `reduce-state.cjs` from the registry after each iteration.

---

## 2. TOPIC

Find every reason a session hand-over hop on OpenCode or Pi can fail to finish the sender's task, or fail to recover a detail the note left out through the History Lookup, and name a concrete fix for each. Known case: a live Pi hop on DeepSeek V4.1 Flash at max scored 4/5. The sender kept a side word out of its note as told, then wrote that a fresh session could not recover it. The receiver was offered a working History Lookup, did not run it, asked the operator and left the note claimed. The same task on OpenCode scored 5/5.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What does each runtime's prepare text tell the sender about keeping details out of the note, and does it over-promise what a fresh session can recover through the History Lookup?
- [x] What claim text and History Lookup offer does the receiver read on OpenCode versus Pi, and what makes a receiver leave a claim unverified instead of running the lookup?
- [x] How do the OpenCode and Pi session readers feed the History Lookup, including their tool-call argument shapes and secret redaction, and what does each fail to recover?
- [x] Does model and effort carry on relaunch for each runtime, and where can it silently degrade or be dropped?
- [x] Which known limits (OpenCode store without a directory column, AI_SESSION_CHILD leaking into test sandboxes, the 160-character preview cut, a double nudge from two hooks) cause a hop to fail, and what concrete fix addresses each?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing the fixes. This run reports findings and concrete fix proposals only.
- Re-scoring the live Pi/OpenCode runs in `scratch/runs/`; their scorecards are evidence, not targets.
- Auditing unrelated hook subsystems (git, spec-gate, skill-advisor) except where they change hand-over behaviour.

---

## 5. STOP CONDITIONS

- All five key questions answered with cited evidence and a named fix per failure mode.
- Two consecutive iterations with `newInfoRatio` at or below 0.05 after the minimum-iteration floor clears.
- `maxIterations` (10) reached.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What does each runtime's prepare text tell the sender about keeping details out of the note, and does it over-promise what a fresh session can recover through the History Lookup?
- What claim text and History Lookup offer does the receiver read on OpenCode versus Pi, and what makes a receiver leave a claim unverified instead of running the lookup?
- How do the OpenCode and Pi session readers feed the History Lookup, including their tool-call argument shapes and secret redaction, and what does each fail to recover?
- Does model and effort carry on relaunch for each runtime, and where can it silently degrade or be dropped?
- Which known limits (OpenCode store without a directory column, AI_SESSION_CHILD leaking into test sandboxes, the 160-character preview cut, a double nudge from two hooks) cause a hop to fail, and what concrete fix addresses each?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the live note against the generated text rather than against the README's own description of behaviour. The note sentence and the sender's reasoning line match the absence of lookup wording in `handoffText` exactly, which turns a behavioural score into a text defect with a location. (iteration 1)
- measuring the preview bound against the actual prompt offset turned a documented caution into a number (295 > 160), which makes the fix testable. (iteration 2)
- going to the receiver's own session header settled carry in one read, where the scorecard, the relaunch log and the run metadata all said nothing. The runtime's own record beats the harness's observation of the process. (iteration 3)
- reading the consumer before the producer. Seeing that the flag is the first gate, not a modifier, turned an environment-hygiene note into a "the hop never starts" failure. (iteration 4)
- ordering the fixes by the layer they change (sender text, receiver text, reader, evidence) kept each one attributable to a single recorded failure instead of producing a wish list. (iteration 5)
- reading the guard's implementation rather than treating the block as a nuisance. The block named a real weakness in the evidence base, and the fix was to record classes, not to argue. (iteration 6)
- reading the guard's edge filter instead of guessing at the threshold. One line explained both remaining violations. (iteration 7)
- reading the coverage function instead of tuning the graph. The rule is two direct answers per question, which is a reasonable minimum for a research packet. (iteration 8)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- treating the README's History Lookup section as evidence of the protocol failed — the section describes what `claim` prints, and the sender is never told that section exists. Documentation of a receiver capability is not instruction to the sender. (iteration 1)
- reading the README's refusal-code list first suggested `store_unreadable` was a store problem; only the dispatcher showed it is also the wrapper for every projection defect. (iteration 2)
- reading the wrapper's argv builder could prove what would be passed but not what was passed, because the record is consumed. Only the receiver closes that gap. (iteration 3)
- assuming the harness sanitized its environment because it named four variables. It names exactly four, and the child flag is not one of them. (iteration 4)
- an early attempt to write one combined "protocol hardening" fix collapsed four distinct causes into one unverifiable change; split per failure mode is what makes each observable. (iteration 5)
- treating "many files read" as diversity. The guard counts classes, and the run's own records are the class the earlier iterations under-cited. (iteration 6)
- assuming a `SUPPORTS` edge to a question was equivalent to answering it. In this graph it is not, and the metric is what the stop decision reads. (iteration 7)
- treating `SUPPORTS` as interchangeable with `ANSWERS` across two separate guards; both metrics filter on the relation, so the mistake cost two passes. (iteration 8)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "Fix the model by making the receiver read the note harder": ruled out by iteration 1. The receiver read the note exactly; the note was wrong, and the offer arrived without authority over it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "Fix the model by making the receiver read the note harder": ruled out by iteration 1. The receiver read the note exactly; the note was wrong, and the offer arrived without authority over it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Fix the model by making the receiver read the note harder": ruled out by iteration 1. The receiver read the note exactly; the note was wrong, and the offer arrived without authority over it.

### "Fix the preview by raising it without limit": ruled out as a design choice; the reply budget is what keeps the lookup inside a model-visible payload. The bounded fix is a load pointer or whole-part preview inside the same budget. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "Fix the preview by raising it without limit": ruled out as a design choice; the reply budget is what keeps the lookup inside a model-visible payload. The bounded fix is a load pointer or whole-part preview inside the same budget.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Fix the preview by raising it without limit": ruled out as a design choice; the reply budget is what keeps the lookup inside a model-visible payload. The bounded fix is a load pointer or whole-part preview inside the same budget.

### "OpenCode 2's missing model flag is a bug in the replay builder": ruled out; the version gate is deliberate, because a replayed `-m` would end the launch with a usage error. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "OpenCode 2's missing model flag is a bug in the replay builder": ruled out; the version gate is deliberate, because a replayed `-m` would end the launch with a usage error.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "OpenCode 2's missing model flag is a bug in the replay builder": ruled out; the version gate is deliberate, because a replayed `-m` would end the launch with a usage error.

### "Pi did not mint or print the lookup": ruled out by finding 5 — the receiver's session log holds the rendered section and a `hl1_` handle. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "Pi did not mint or print the lookup": ruled out by finding 5 — the receiver's session log holds the rendered section and a `hl1_` handle.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Pi did not mint or print the lookup": ruled out by finding 5 — the receiver's session log holds the rendered section and a `hl1_` handle.

### "Pi dropped the model or effort on relaunch": ruled out by the receiver's own session header. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "Pi dropped the model or effort on relaunch": ruled out by the receiver's own session header.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Pi dropped the model or effort on relaunch": ruled out by the receiver's own session header.

### "Redaction drops secrets from tool-call arguments in a shape-dependent way": ruled out for objects, which are key-checked and string-scrubbed; the shape hazard is the reverse — non-object arguments are dropped before redaction can matter. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "Redaction drops secrets from tool-call arguments in a shape-dependent way": ruled out for objects, which are key-checked and string-scrubbed; the shape hazard is the reverse — non-object arguments are dropped before redaction can matter.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Redaction drops secrets from tool-call arguments in a shape-dependent way": ruled out for objects, which are key-checked and string-scrubbed; the shape hazard is the reverse — non-object arguments are dropped before redaction can matter.

### "Source diversity means counting files": ruled out by reading the guard; it counts distinct quality classes, so ten code files remain one class. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "Source diversity means counting files": ruled out by reading the guard; it counts distinct quality classes, so ten code files remain one class.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Source diversity means counting files": ruled out by reading the guard; it counts distinct quality classes, so ten code files remain one class.

### "Supporting evidence counts as coverage": ruled out by the implementation, which filters to `ANSWERS` before counting. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "Supporting evidence counts as coverage": ruled out by the implementation, which filters to `ANSWERS` before counting.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Supporting evidence counts as coverage": ruled out by the implementation, which filters to `ANSWERS` before counting.

### "The blocked stop was a false positive to be argued past": ruled out. The block described the evidence base accurately. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The blocked stop was a false positive to be argued past": ruled out. The block described the evidence base accurately.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The blocked stop was a false positive to be argued past": ruled out. The block described the evidence base accurately.

### "The child flag suppresses only the claim": ruled out; the nudge is the suppressed path, and the claim path has no check at all. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The child flag suppresses only the claim": ruled out; the nudge is the suppressed path, and the claim path has no check at all.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The child flag suppresses only the claim": ruled out; the nudge is the suppressed path, and the claim path has no check at all.

### "The graph thresholds are miscalibrated for five questions": not pursued. The thresholds are reachable with two direct answers per question, which this evidence base supports. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "The graph thresholds are miscalibrated for five questions": not pursued. The thresholds are reachable with two direct answers per question, which this evidence base supports.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The graph thresholds are miscalibrated for five questions": not pursued. The thresholds are reachable with two direct answers per question, which this evidence base supports.

### "The guard should count SUPPORTS": not pursued. Counting only direct answers is defensible; the ledger was wrong, not the guard. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "The guard should count SUPPORTS": not pursued. Counting only direct answers is defensible; the ledger was wrong, not the guard.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The guard should count SUPPORTS": not pursued. Counting only direct answers is defensible; the ledger was wrong, not the guard.

### "The harness's unset list is a general environment sanitizer": ruled out; it names four specific variables plus a Vibe key, so every other inherited flag passes through. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The harness's unset list is a general environment sanitizer": ruled out; it names four specific variables plus a Vibe key, so every other inherited flag passes through.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The harness's unset list is a general environment sanitizer": ruled out; it names four specific variables plus a Vibe key, so every other inherited flag passes through.

### "The Pi reader enumerates the store and may pick the wrong session": ruled out; it filters by exact id and refuses ambiguity. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The Pi reader enumerates the store and may pick the wrong session": ruled out; it filters by exact id and refuses ambiguity.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Pi reader enumerates the store and may pick the wrong session": ruled out; it filters by exact id and refuses ambiguity.

### "The Pi session reader could not find the sender's session": ruled out indirectly; the claim mint calls the same reader and the mint succeeded, since the section printed. The remaining reader risk is therefore about breadth of what a found session yields, not about finding it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The Pi session reader could not find the sender's session": ruled out indirectly; the claim mint calls the same reader and the mint succeeded, since the section printed. The remaining reader risk is therefore about breadth of what a found session yields, not about finding it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The Pi session reader could not find the sender's session": ruled out indirectly; the claim mint calls the same reader and the mint succeeded, since the section printed. The remaining reader risk is therefore about breadth of what a found session yields, not about finding it.

### "The shared prepare text differs between OpenCode and Pi": ruled out; both adapters call the same `handoffText`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: "The shared prepare text differs between OpenCode and Pi": ruled out; both adapters call the same `handoffText`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The shared prepare text differs between OpenCode and Pi": ruled out; both adapters call the same `handoffText`.

### "The two Pi nudge hooks can both deliver the same text": ruled out by the map delete before send. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The two Pi nudge hooks can both deliver the same text": ruled out by the map delete before send.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The two Pi nudge hooks can both deliver the same text": ruled out by the map delete before send.

### "The two questions needed a new source": ruled out. Their primary artifacts were already read and cited; only the edge relation was wrong. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "The two questions needed a new source": ruled out. Their primary artifacts were already read and cited; only the edge relation was wrong.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The two questions needed a new source": ruled out. Their primary artifacts were already read and cited; only the edge relation was wrong.

### Adding still more code citations. The gap was relation shape, not source count. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Adding still more code citations. The gap was relation shape, not source count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding still more code citations. The gap was relation shape, not source count.

### Any fix that only changes documentation: the README already documents the lookup correctly and the sender never reads it at the hand-over moment. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Any fix that only changes documentation: the README already documents the lookup correctly and the sender never reads it at the hand-over moment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Any fix that only changes documentation: the README already documents the lookup correctly and the sender never reads it at the hand-over moment.

### Auditing carry from `relaunch.log` or the relaunch record: neither holds the relaunch argv after the hop. Only the receiver's own session store does. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Auditing carry from `relaunch.log` or the relaunch record: neither holds the relaunch argv after the hop. Only the receiver's own session store does.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Auditing carry from `relaunch.log` or the relaunch record: neither holds the relaunch argv after the hop. Only the receiver's own session store does.

### Looking for a reader-level fallback when the project directory misses: none exists, by design. Any fix must be at the note/claim layer (record the store key) rather than in the reader. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for a reader-level fallback when the project directory misses: none exists, by design. Any fix must be at the note/claim layer (record the store key) rather than in the reader.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a reader-level fallback when the project directory misses: none exists, by design. Any fix must be at the note/claim layer (record the store key) rather than in the reader.

### Looking for a wrapper-level sanitizer that already handles dispatcher markers: none exists. The wrapper only clears its own `SKILLED_LOOP_*` namespace. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for a wrapper-level sanitizer that already handles dispatcher markers: none exists. The wrapper only clears its own `SKILLED_LOOP_*` namespace.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a wrapper-level sanitizer that already handles dispatcher markers: none exists. The wrapper only clears its own `SKILLED_LOOP_*` namespace.

### Re-running the same code reads as if they were a second class. They are not. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Re-running the same code reads as if they were a second class. They are not.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-running the same code reads as if they were a second class. They are not.

### Recounting the same code paths as if a second read made them independent. That would satisfy no guard honestly. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Recounting the same code paths as if a second read made them independent. That would satisfy no guard honestly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recounting the same code paths as if a second read made them independent. That would satisfy no guard honestly.

### Searching the prepare/seed text for any recovery wording: there is none to find. Any fix has to add it rather than repair it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching the prepare/seed text for any recovery wording: there is none to find. Any fix has to add it rather than repair it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching the prepare/seed text for any recovery wording: there is none to find. Any fix has to add it rather than repair it.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- "Pi did not mint or print the lookup": ruled out by finding 5 — the receiver's session log holds the rendered section and a `hl1_` handle. (iteration 1)
- "The Pi session reader could not find the sender's session": ruled out indirectly; the claim mint calls the same reader and the mint succeeded, since the section printed. The remaining reader risk is therefore about breadth of what a found session yields, not about finding it. (iteration 1)
- "The shared prepare text differs between OpenCode and Pi": ruled out; both adapters call the same `handoffText`. (iteration 1)
- Searching the prepare/seed text for any recovery wording: there is none to find. Any fix has to add it rather than repair it. (iteration 1)
- "Redaction drops secrets from tool-call arguments in a shape-dependent way": ruled out for objects, which are key-checked and string-scrubbed; the shape hazard is the reverse — non-object arguments are dropped before redaction can matter. (iteration 2)
- "The Pi reader enumerates the store and may pick the wrong session": ruled out; it filters by exact id and refuses ambiguity. (iteration 2)
- Looking for a reader-level fallback when the project directory misses: none exists, by design. Any fix must be at the note/claim layer (record the store key) rather than in the reader. (iteration 2)
- "OpenCode 2's missing model flag is a bug in the replay builder": ruled out; the version gate is deliberate, because a replayed `-m` would end the launch with a usage error. (iteration 3)
- "Pi dropped the model or effort on relaunch": ruled out by the receiver's own session header. (iteration 3)
- "The two Pi nudge hooks can both deliver the same text": ruled out by the map delete before send. (iteration 3)
- Auditing carry from `relaunch.log` or the relaunch record: neither holds the relaunch argv after the hop. Only the receiver's own session store does. (iteration 3)
- "The child flag suppresses only the claim": ruled out; the nudge is the suppressed path, and the claim path has no check at all. (iteration 4)
- "The harness's unset list is a general environment sanitizer": ruled out; it names four specific variables plus a Vibe key, so every other inherited flag passes through. (iteration 4)
- Looking for a wrapper-level sanitizer that already handles dispatcher markers: none exists. The wrapper only clears its own `SKILLED_LOOP_*` namespace. (iteration 4)
- "Fix the model by making the receiver read the note harder": ruled out by iteration 1. The receiver read the note exactly; the note was wrong, and the offer arrived without authority over it. (iteration 5)
- "Fix the preview by raising it without limit": ruled out as a design choice; the reply budget is what keeps the lookup inside a model-visible payload. The bounded fix is a load pointer or whole-part preview inside the same budget. (iteration 5)
- Any fix that only changes documentation: the README already documents the lookup correctly and the sender never reads it at the hand-over moment. (iteration 5)
- "Source diversity means counting files": ruled out by reading the guard; it counts distinct quality classes, so ten code files remain one class. (iteration 6)
- "The blocked stop was a false positive to be argued past": ruled out. The block described the evidence base accurately. (iteration 6)
- Recounting the same code paths as if a second read made them independent. That would satisfy no guard honestly. (iteration 6)
- "The guard should count SUPPORTS": not pursued. Counting only direct answers is defensible; the ledger was wrong, not the guard. (iteration 7)
- "The two questions needed a new source": ruled out. Their primary artifacts were already read and cited; only the edge relation was wrong. (iteration 7)
- Re-running the same code reads as if they were a second class. They are not. (iteration 7)
- "Supporting evidence counts as coverage": ruled out by the implementation, which filters to `ANSWERS` before counting. (iteration 8)
- "The graph thresholds are miscalibrated for five questions": not pursued. The thresholds are reachable with two direct answers per question, which this evidence base supports. (iteration 8)
- Adding still more code citations. The gap was relation shape, not source count. (iteration 8)

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

- Hand-over hook family: `.skilled/hooks/session-handover/` with per-runtime subdirectories (`claude/`, `codex/`, `opencode/`, `pi/`, `vibe/`), shared `lib/`, `history/` (the History Lookup), and `bin/`.
- Shared session readers: `.skilled/hooks/shared/session-readers/` (claude, codex, cursor, devin, dsh, identity, index).
- Pi extension surface: `.pi/extensions/session-handover.ts`.
- OpenCode plugin surface: `.opencode/plugins/` (notably `session-handover.js`, plus adjacent plugins that can double-fire a nudge).
- Live run evidence: `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/` containing `base1-pi` and `base1-opencode` notes, panes, meta and scorecards.
- Known limits named in the charter: OpenCode store without a directory column; `AI_SESSION_CHILD` leaking into test sandboxes; 160-character preview cut; double nudge from two hooks.
- `resource-map.md` not present; skipping coverage gate.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Current generation: 1
- Started: 2026-11-16T05:46:33Z
