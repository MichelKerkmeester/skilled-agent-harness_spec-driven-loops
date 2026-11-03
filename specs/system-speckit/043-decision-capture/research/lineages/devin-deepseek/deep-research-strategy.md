---
title: Deep Research Strategy - decision capture open gaps
description: Runtime strategy for the devin-deepseek fan-out lineage: routing words, per-project state scoping, and chat-answer judgment.
trigger_phrases:
  - "decision capture open gaps strategy"
importance_tier: normal
contextType: planning
version: 1.0.0.0
---

# Deep Research Strategy - decision capture open gaps

## 1. OVERVIEW

### Purpose

Persistent brain for this lineage. The topic is the three open gaps in operator decision capture that 007's Known Limitations name: no routing words for decision requests, one state folder shared by every linked project, and model judgment still needed for chat answers.

### Usage

- **Init:** topic, key questions, known context and research boundaries set here.
- **Per iteration:** the executor reads Next Focus and writes iteration evidence; the reducer refreshes machine-owned sections.

### Question Injection Surface

`specs/system-speckit/043-decision-capture/research/lineages/devin-deepseek/inbox.jsonl` is not used by this lineage; questions come from the dispatch topic.

---

## 2. TOPIC

Three open gaps in operator decision capture (`.skilled/hooks/decision-capture`, the system-spec-kit save step and the decision-record writer). (1) No routing words for decision requests. (2) Linked projects share one state folder. (3) Chat answers still need judgment. Prefer the smallest change; avoid overengineering.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which routing surface decides that "record my chat reply as a decision" belongs to a skill, and what is the smallest metadata change that makes it route without stealing another skill's prompts?
- [x] Which packet should own the routing-vocabulary change, given that 043's goal D1 limits its children to the decision-capture pipeline, the writer or the save step?
- [x] What is the smallest correct scoping fix that keeps linked projects' queues, consumed log and orphan scan separate when `.skilled` is symlinked whole into each project?
- [x] Can a deterministic or cheaper check reduce the saving model's judgment for chat candidates without auto-accepting a non-answer, and what must it reject per ADR-002's probe?
- [x] Do the three fixes interact, and what order and verification cost do they imply?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing any of the three fixes. This is research: findings and a recommended smallest change only.
- Re-opening decisions 007 already made (ADR-001, ADR-002, ADR-003) or the series goal's D1 to D6.
- Building a new conversation runner or re-running the 006 live matrix.

---

## 5. STOP CONDITIONS

- Convergence by the workflow's composite rule, or 5 iterations, whichever comes first.
- Every key question answered with cited evidence, or explicitly recorded as unresolved with the reason.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which routing surface decides that "record my chat reply as a decision" belongs to a skill, and what is the smallest metadata change that makes it route without stealing another skill's prompts?
- Which packet should own the routing-vocabulary change, given that 043's goal D1 limits its children to the decision-capture pipeline, the writer or the save step?
- What is the smallest correct scoping fix that keeps linked projects' queues, consumed log and orphan scan separate when `.skilled` is symlinked whole into each project?
- Can a deterministic or cheaper check reduce the saving model's judgment for chat candidates without auto-accepting a non-answer, and what must it reject per ADR-002's probe?
- Do the three fixes interact, and what order and verification cost do they imply?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the scorer's actual inputs rather than the skill docs showed that `graph-metadata.json` is live at scoring time, which turns the fix into a data edit and rules out a code change. (iteration 1)
- reading every producer's project-directory source proved the identity is available everywhere, which is the precondition for any scoping fix. (iteration 2)
- reading the labeled fixture rather than only the detector showed that the true answer is structurally distinct (numbered mapping) while the non-answers are imperative task switches, which is the evidence any rule must use. (iteration 3)
- scanning every skill's declared signals turned the collision risk from a guess into a phrase-overlap result, and the 031 precedent settled ownership without inventing a new convention. (iteration 4)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- assuming a `decision` token would route to system-spec-kit. The only description that carries the word belongs to sk-design, which is exactly the stealing risk the dispatch named. (iteration 1)
- looking for an existing project field in the queue record. There is none, which rules out a filter-only fix for pre-fix data. (iteration 2)
- looking for a confidence score or question-type field. Neither exists, so the evidence block is a real addition rather than a threshold change. (iteration 3)
- looking for a graph convergence path inside the lineage. The tool's write target is the packet, so the inline vote had to run without it. (iteration 4)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **A full local classifier.** It is a larger change than the evidence block, needs training data the packet does not have, and adds a new model surface to a save path that must stay deterministic. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A full local classifier.** It is a larger change than the evidence block, needs training data the packet does not have, and adds a new model surface to a save path that must stay deterministic.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A full local classifier.** It is a larger change than the evidence block, needs training data the packet does not have, and adds a new model surface to a save path that must stay deterministic.

### **A lexical-overlap threshold as an accept rule.** "yes" answers a yes/no question with zero overlap, and "make it blue" answers "which color?" with zero overlap against the question's words. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A lexical-overlap threshold as an accept rule.** "yes" answers a yes/no question with zero overlap, and "make it blue" answers "which color?" with zero overlap against the question's words.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A lexical-overlap threshold as an accept rule.** "yes" answers a yes/no question with zero overlap, and "make it blue" answers "which color?" with zero overlap against the question's words.

### **A new child under 043.** Parent goal D1 limits every 043 child to the decision-capture pipeline, the writer or the save step; routing metadata is none of those, and 007's Known Limitations already calls the advisor metadata "another artifact". -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **A new child under 043.** Parent goal D1 limits every 043 child to the decision-capture pipeline, the writer or the save step; routing metadata is none of those, and 007's Known Limitations already calls the advisor metadata "another artifact".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A new child under 043.** Parent goal D1 limits every 043 child to the decision-capture pipeline, the writer or the save step; routing metadata is none of those, and 007's Known Limitations already calls the advisor metadata "another artifact".

### **A strict real-path containment check as the gap-2 fix.** It would reject every linked project and disable capture there; the token scopes data without refusing the sanctioned install shape. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A strict real-path containment check as the gap-2 fix.** It would reject every linked project and disable capture there; the token scopes data without refusing the sanctioned install shape.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A strict real-path containment check as the gap-2 fix.** It would reject every linked project and disable capture there; the token scopes data without refusing the sanctioned install shape.

### **Adding a bare `decision` keyword to `system-spec-kit/SKILL.md`.** It would fire on every prompt that mentions a decision, and `sk-design` already owns "decision tree", "colour decision" and "color decision" signals. The keyword pass weights a single keyword at 1.0 while a three-word signal reaches 1.6, so the broad keyword is both weaker and more likely to steal. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Adding a bare `decision` keyword to `system-spec-kit/SKILL.md`.** It would fire on every prompt that mentions a decision, and `sk-design` already owns "decision tree", "colour decision" and "color decision" signals. The keyword pass weights a single keyword at 1.0 while a three-word signal reaches 1.6, so the broad keyword is both weaker and more likely to steal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding a bare `decision` keyword to `system-spec-kit/SKILL.md`.** It would fire on every prompt that mentions a decision, and `sk-design` already owns "decision tree", "colour decision" and "color decision" signals. The keyword pass weights a single keyword at 1.0 while a three-word signal reaches 1.6, so the broad keyword is both weaker and more likely to steal.

### **Adding the exact sentence "record my chat reply as a decision" as a signal.** It fixes one phrasing and nothing adjacent, and the phrase-boundary rule would still miss "record this as a decision". -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Adding the exact sentence "record my chat reply as a decision" as a signal.** It fixes one phrasing and nothing adjacent, and the phrase-boundary rule would still miss "record this as a decision".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding the exact sentence "record my chat reply as a decision" as a signal.** It fixes one phrasing and nothing adjacent, and the phrase-boundary rule would still miss "record this as a decision".

### **Auto-accept a candidate whose reply matches an option label.** It would accept "b" to a product question with options, but it still cannot tell a reply that names an option from one that merely mentions it, and most questions offer no options. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Auto-accept a candidate whose reply matches an option label.** It would accept "b" to a product question with options, but it still cannot tell a reply that names an option from one that merely mentions it, and most questions offer no options.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Auto-accept a candidate whose reply matches an option label.** It would accept "b" to a product question with options, but it still cannot tell a reply that names an option from one that merely mentions it, and most questions offer no options.

### **Auto-accept a lone candidate.** ADR-002's probe shows a lone candidate can be an off-topic reply. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Auto-accept a lone candidate.** ADR-002's probe shows a lone candidate can be an off-topic reply.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Auto-accept a lone candidate.** ADR-002's probe shows a lone candidate can be an off-topic reply.

### **Changing `doctor:symlink` to merge mode or to leave `.skilled/skills/.state` unmirrored.** It cannot help a whole `.skilled` link, it changes every skill's state folder rather than this feature's, and it is outside 043's goal D1. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Changing `doctor:symlink` to merge mode or to leave `.skilled/skills/.state` unmirrored.** It cannot help a whole `.skilled` link, it changes every skill's state folder rather than this feature's, and it is outside 043's goal D1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Changing `doctor:symlink` to merge mode or to leave `.skilled/skills/.state` unmirrored.** It cannot help a whole `.skilled` link, it changes every skill's state folder rather than this feature's, and it is outside 043's goal D1.

### **Keying the folder by project basename.** Two checkouts named `app` would share a folder, which is the same bug with a smaller blast radius. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Keying the folder by project basename.** Two checkouts named `app` would share a folder, which is the same bug with a smaller blast radius.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Keying the folder by project basename.** Two checkouts named `app` would share a folder, which is the same bug with a smaller blast radius.

### **Landing gap 3 before gap 2.** It would add evidence to candidate payloads while the queue rows they describe may move. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Landing gap 3 before gap 2.** It would add evidence to candidate payloads while the queue rows they describe may move.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Landing gap 3 before gap 2.** It would add evidence to candidate payloads while the queue rows they describe may move.

### **Moving the queue to a temp directory.** Pending answers must survive a reboot and be found by a later save; a temp path loses them. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Moving the queue to a temp directory.** Pending answers must survive a reboot and be found by a later save; a temp path loses them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Moving the queue to a temp directory.** Pending answers must survive a reboot and be found by a later save; a temp path loses them.

### **One combined child for gaps 2 and 3 with a single acceptance gate.** It hides two different proofs behind one closure verdict. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **One combined child for gaps 2 and 3 with a single acceptance gate.** It hides two different proofs behind one closure verdict.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **One combined child for gaps 2 and 3 with a single acceptance gate.** It hides two different proofs behind one closure verdict.

### **Per-row `project` field with read-time filtering only.** It fixes the scan and the consumed log, but it leaves isolation to every present and future reader, and pre-fix rows have no field to filter on. The subdirectory isolates by construction. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Per-row `project` field with read-time filtering only.** It fixes the scan and the consumed log, but it leaves isolation to every present and future reader, and pre-fix rows have no field to filter on. The subdirectory isolates by construction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Per-row `project` field with read-time filtering only.** It fixes the scan and the consumed log, but it leaves isolation to every present and future reader, and pre-fix rows have no field to filter on. The subdirectory isolates by construction.

### **Putting gap 1 in a 043 child.** D1 freezes 043 children to the pipeline, writer or save step; routing metadata is none of those, and 031 is the precedent owner. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Putting gap 1 in a 043 child.** D1 freezes 043 children to the pipeline, writer or save step; routing metadata is none of those, and 031 is the precedent owner.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Putting gap 1 in a 043 child.** D1 freezes 043 children to the pipeline, writer or save step; routing metadata is none of those, and 031 is the precedent owner.

### **Ranking candidates and asking the model only about the top one per reply.** Several candidates can share one reply, so a ranking cut can drop the real answer. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Ranking candidates and asking the model only about the top one per reply.** Several candidates can share one reply, so a ranking cut can drop the real answer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Ranking candidates and asking the model only about the top one per reply.** Several candidates can share one reply, so a ranking cut can drop the real answer.

### **Relying on `PHRASE_INTENT_BOOSTERS`.** It is a hard-coded code map; a metadata signal is the smaller change and the one 031 used for the same class of gap. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Relying on `PHRASE_INTENT_BOOSTERS`.** It is a hard-coded code map; a metadata signal is the smaller change and the one 031 used for the same class of gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Relying on `PHRASE_INTENT_BOOSTERS`.** It is a hard-coded code map; a metadata signal is the smaller change and the one 031 used for the same class of gap.

### Looking for a `keywords:` frontmatter field on system-spec-kit's SKILL.md: the file carries an HTML `<!-- Keywords: -->` comment, which the frontmatter parser does not read, so editing that comment changes nothing. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Looking for a `keywords:` frontmatter field on system-spec-kit's SKILL.md: the file carries an HTML `<!-- Keywords: -->` comment, which the frontmatter parser does not read, so editing that comment changes nothing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a `keywords:` frontmatter field on system-spec-kit's SKILL.md: the file carries an HTML `<!-- Keywords: -->` comment, which the frontmatter parser does not read, so editing that comment changes nothing.

### Looking for a `realpath` trick that keeps the state under the project: the symlink sits inside the project, so every path under it resolves to the checkout. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for a `realpath` trick that keeps the state under the project: the symlink sits inside the project, so every path under it resolves to the checkout.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a `realpath` trick that keeps the state under the project: the symlink sits inside the project, so every path under it resolves to the checkout.

### Looking for a confidence score on candidates: the detector emits none. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a confidence score on candidates: the detector emits none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a confidence score on candidates: the detector emits none.

### Looking for a graph convergence snapshot path inside the lineage: the tool takes only `--spec-folder` and writes under the packet, outside this lineage. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for a graph convergence snapshot path inside the lineage: the tool takes only `--spec-folder` and writes under the packet, outside this lineage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a graph convergence snapshot path inside the lineage: the tool takes only `--spec-folder` and writes under the packet, outside this lineage.

### Looking for a question-type field: candidates carry only key, kind, question, answer and turn ids. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a question-type field: candidates carry only key, kind, question, answer and turn ids.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a question-type field: candidates carry only key, kind, question, answer and turn ids.

### Looking for a save-side deterministic check: the save step is a model instruction, not a script. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a save-side deterministic check: the save step is a model instruction, not a script.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a save-side deterministic check: the save step is a model instruction, not a script.

### Looking for an existing decision phrase in another skill's signals: none exists, so the collision check is a phrase-overlap check rather than a live routing comparison. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for an existing decision phrase in another skill's signals: none exists, so the collision check is a phrase-overlap check rather than a live routing comparison.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an existing decision phrase in another skill's signals: none exists, so the collision check is a phrase-overlap check rather than a live routing comparison.

### Looking for an existing project identifier in the queue record: records carry runtime, session and tool ids only. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for an existing project identifier in the queue record: records carry runtime, session and tool ids only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an existing project identifier in the queue record: records carry runtime, session and tool ids only.

### Searching the trigger index for the phrase: the index is a document-retrieval corpus, not the skill router, so a hit there would not have changed skill selection. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching the trigger index for the phrase: the index is a document-retrieval corpus, not the skill router, so a hit there would not have changed skill selection.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching the trigger index for the phrase: the index is a document-retrieval corpus, not the skill router, so a hit there would not have changed skill selection.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **A new child under 043.** Parent goal D1 limits every 043 child to the decision-capture pipeline, the writer or the save step; routing metadata is none of those, and 007's Known Limitations already calls the advisor metadata "another artifact". (iteration 1)
- **Adding a bare `decision` keyword to `system-spec-kit/SKILL.md`.** It would fire on every prompt that mentions a decision, and `sk-design` already owns "decision tree", "colour decision" and "color decision" signals. The keyword pass weights a single keyword at 1.0 while a three-word signal reaches 1.6, so the broad keyword is both weaker and more likely to steal. (iteration 1)
- **Adding the exact sentence "record my chat reply as a decision" as a signal.** It fixes one phrasing and nothing adjacent, and the phrase-boundary rule would still miss "record this as a decision". (iteration 1)
- **Relying on `PHRASE_INTENT_BOOSTERS`.** It is a hard-coded code map; a metadata signal is the smaller change and the one 031 used for the same class of gap. (iteration 1)
- Looking for a `keywords:` frontmatter field on system-spec-kit's SKILL.md: the file carries an HTML `<!-- Keywords: -->` comment, which the frontmatter parser does not read, so editing that comment changes nothing. (iteration 1)
- Searching the trigger index for the phrase: the index is a document-retrieval corpus, not the skill router, so a hit there would not have changed skill selection. (iteration 1)
- **Changing `doctor:symlink` to merge mode or to leave `.skilled/skills/.state` unmirrored.** It cannot help a whole `.skilled` link, it changes every skill's state folder rather than this feature's, and it is outside 043's goal D1. (iteration 2)
- **Keying the folder by project basename.** Two checkouts named `app` would share a folder, which is the same bug with a smaller blast radius. (iteration 2)
- **Moving the queue to a temp directory.** Pending answers must survive a reboot and be found by a later save; a temp path loses them. (iteration 2)
- **Per-row `project` field with read-time filtering only.** It fixes the scan and the consumed log, but it leaves isolation to every present and future reader, and pre-fix rows have no field to filter on. The subdirectory isolates by construction. (iteration 2)
- Looking for a `realpath` trick that keeps the state under the project: the symlink sits inside the project, so every path under it resolves to the checkout. (iteration 2)
- Looking for an existing project identifier in the queue record: records carry runtime, session and tool ids only. (iteration 2)
- **A full local classifier.** It is a larger change than the evidence block, needs training data the packet does not have, and adds a new model surface to a save path that must stay deterministic. (iteration 3)
- **A lexical-overlap threshold as an accept rule.** "yes" answers a yes/no question with zero overlap, and "make it blue" answers "which color?" with zero overlap against the question's words. (iteration 3)
- **Auto-accept a candidate whose reply matches an option label.** It would accept "b" to a product question with options, but it still cannot tell a reply that names an option from one that merely mentions it, and most questions offer no options. (iteration 3)
- **Auto-accept a lone candidate.** ADR-002's probe shows a lone candidate can be an off-topic reply. (iteration 3)
- **Ranking candidates and asking the model only about the top one per reply.** Several candidates can share one reply, so a ranking cut can drop the real answer. (iteration 3)
- Looking for a confidence score on candidates: the detector emits none. (iteration 3)
- Looking for a question-type field: candidates carry only key, kind, question, answer and turn ids. (iteration 3)
- Looking for a save-side deterministic check: the save step is a model instruction, not a script. (iteration 3)
- **A strict real-path containment check as the gap-2 fix.** It would reject every linked project and disable capture there; the token scopes data without refusing the sanctioned install shape. (iteration 4)
- **Landing gap 3 before gap 2.** It would add evidence to candidate payloads while the queue rows they describe may move. (iteration 4)
- **One combined child for gaps 2 and 3 with a single acceptance gate.** It hides two different proofs behind one closure verdict. (iteration 4)
- **Putting gap 1 in a 043 child.** D1 freezes 043 children to the pipeline, writer or save step; routing metadata is none of those, and 031 is the precedent owner. (iteration 4)
- Looking for a graph convergence snapshot path inside the lineage: the tool takes only `--spec-folder` and writes under the packet, outside this lineage. (iteration 4)
- Looking for an existing decision phrase in another skill's signals: none exists, so the collision check is a phrase-overlap check rather than a live routing comparison. (iteration 4)

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

Prior context is the archived single-executor research `specs/system-speckit/043-decision-capture/research_archive/2026-11-02-pre-gaps/research.md` (3 iterations, stop reason maxIterationsReached). It established the pipeline shape and the gap fixes that became 002 to 007, but it did not study the three gaps this lineage was dispatched for.

Current packet state:

- Parent `spec.md` phase map lists 001 to 007 as Complete.
- 007's Known Limitations name gap 1 explicitly: "`system-spec-kit` has no routing words for operator decisions, so 'record my chat reply as a decision' routes nowhere; its advisor metadata is another artifact (parent goal D1)."
- 007 ADR-002 records that no auto-accept was added for a lone chat candidate, because a probe returned one candidate for an off-topic reply (`actually first fix the login bug`), so the saving model's judgment is load-bearing.
- The state folder `.skilled/skills/.state/decision-capture/` holds several sessions' queues, one `consumed.jsonl`, and per-session `.nudge` counters in this checkout.
- `capture-core.mjs` resolves every queue path as `projectDir + .skilled/skills/.state/decision-capture`.

### Bounded Context Snapshot

- Source pointers: `.skilled/hooks/decision-capture/lib/capture-core.mjs` (paths, queue, consumed, nudge), `.skilled/hooks/decision-capture/lib/chat-questions.mjs` (candidate detection), `.skilled/skills/system-spec-kit/runtime/lib/continuity/decision-record-writer.ts` (writer, consumed log), `.skilled/skills/system-spec-kit/runtime/cli/continuity/match-decision-table.ts` (scan, release, match), `.skilled/skills/system-spec-kit/graph-metadata.json` (routing signals), `.skilled/skills/system-spec-kit/SKILL.md` (advisor description), `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` (scoring).
- Reuse candidates: the existing `graph-metadata.json` `intent_signals` array, the advisor's source signal map, the existing `--scan-orphans` listing, and `capture-core`'s single path helper.
- Integration points: skill advisor routing, trigger index, doctor:symlink link shapes, save step, Stop-hook nudge.
- Constraints and risks: goal D1 freezes the artifact scope; a vocabulary addition must not steal sk-design's "decision tree" or sk-doc's "decision record" prompts; any state-scoping change must keep existing queues readable.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.1
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Question injection surface: `specs/system-speckit/043-decision-capture/research/lineages/devin-deepseek/inbox.jsonl`
- Canonical pause sentinel: `specs/system-speckit/043-decision-capture/research/lineages/devin-deepseek/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-11-03T08:36:56.698Z
