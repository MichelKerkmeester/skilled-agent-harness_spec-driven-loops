---
title: Deep Research Strategy - Conversation Adoption Audit (Devin Lineage)
description: Session tracking for the audit of the 28 manual-testing-playbook packages the first lineage never read.
trigger_phrases:
  - "conversation adoption audit"
  - "playbook conversation candidates"
  - "devin lineage research"
importance_tier: normal
contextType: planning
version: 1.0.0.0
---

# Deep Research Strategy - Conversation Adoption Audit (Devin Lineage)

## 1. OVERVIEW

This lineage continues the conversation-adoption audit for the 28 manual-testing-playbook packages the first lineage never read. It applies the four ordered style questions and the runner's five-runtime and three-action limits. It records verdicts only; it changes no playbook, skill or runner file.

## 2. TOPIC

Continue the conversation-adoption audit for the 28 manual-testing-playbook packages the first lineage never read, applying the four ordered style questions and the runner's runtime/action constraints, and giving convert, update, add or keep verdicts with a SOURCE tag and deciding question.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which scenarios in the 28 unaudited packages meet Q2 or Q3 and should convert or gain a conversation companion, and which are blocked by the runner's five runtimes and three session actions?
- [x] Which existing single-prompt scenarios need updating rather than converting because the behavior is multi-turn but the current scenario checks it only once?
- [x] Which packages have no conversation candidate at all, so every scenario stays single prompt under Q1 or Q4?
- [x] Which multi-turn, answer-dependent, restart, compaction or cross-runtime behaviors in these packages lack any scenario that a conversation would add?
- [ ] Which candidates rank highest by risk reduction relative to authoring and run cost across the 28 packages?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not re-audit the 28 packages the first lineage already read.
- Do not author, convert or edit any playbook, skill or runner file.
- Do not run the conversation runner against live runtimes.
- Do not evaluate packages outside the named 28.

---

## 5. STOP CONDITIONS

- All 28 named packages have a verdict or an explicit no-candidate note.
- Or `maxIterations` (6) is reached.
- Or legal convergence clears the 0.05 threshold with the quality guards passing.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which scenarios in the 28 unaudited packages meet Q2 or Q3 and should convert or gain a conversation companion, and which are blocked by the runner's five runtimes and three session actions?
- Which existing single-prompt scenarios need updating rather than converting because the behavior is multi-turn but the current scenario checks it only once?
- Which packages have no conversation candidate at all, so every scenario stays single prompt under Q1 or Q4?
- Which multi-turn, answer-dependent, restart, compaction or cross-runtime behaviors in these packages lack any scenario that a conversation would add?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the root index first made the per-package shape visible without opening every scenario; the one candidate in mcp-code-mode came from its scenario file, not its index, because the index does not mention the live-session gap. (iteration 1)
- reading the per-feature scenario file for the UNKNOWN fallback exposed the missing post-answer turn that the root index only hints at. (iteration 2)
- reading the scenario file rather than the root index surfaced both answer-dependent gates; the roots describe DIA-003 and SD-007 without their approval and disambiguation branches. (iteration 3)
- reading the SP-008 file rather than its summary exposed the `needs_disambiguation` flag and the fail-if-proceeds condition, which is what makes the answer turn load-bearing. (iteration 4)
- reading CHG-007's scenario file showed the clarification question is the contract, which is what makes the answer turn a real gap. (iteration 5)
- reading the refusal scenarios' triage sections surfaced the documented follow-up in RRD-004, which the root index does not mention. (iteration 6)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- a keyword scan would have misclassified mcp-code-mode's "restart Code Mode" steps as runner restarts. (iteration 1)
- the package indexes alone would have kept sk-code at "no candidate", because SD-003's contract describes the question but not the turn after it. (iteration 2)
- the sk-design hub's 55-line index carries no contract detail, so a root-only pass would have missed SD-007 entirely. (iteration 3)
- the sk-design-md-generator index reads like a multi-step pipeline, but every step is a command the operator runs, not an exchange with the runtime. (iteration 4)
- the create-command scenarios use "asks" and "pause for approval", but those are properties of the authored command, not behavior of the authoring session. (iteration 5)
- a root-index-only pass would have missed both follow-up paths, because both live in the scenario contract's expected behavior. (iteration 6)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Converting cli-classifier's routing scenarios because they gate release. Q3's regression-gate clause still needs turns a shell check can decide; a one-send conversation would add setup cost without a new check. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Converting cli-classifier's routing scenarios because they gate release. Q3's regression-gate clause still needs turns a shell check can decide; a one-send conversation would add setup cost without a new check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Converting cli-classifier's routing scenarios because they gate release. Q3's regression-gate clause still needs turns a shell check can decide; a one-send conversation would add setup cost without a new check.

### Converting RRD-001, RRD-002 or RRD-003. Their refusals name a destination or an owner; only RRD-004 explicitly invites the user to return with new evidence. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Converting RRD-001, RRD-002 or RRD-003. Their refusals name a destination or an owner; only RRD-004 explicitly invites the user to return with new evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Converting RRD-001, RRD-002 or RRD-003. Their refusals name a destination or an owner; only RRD-004 explicitly invites the user to return with new evidence.

### Converting SD-007 itself into a conversation. It is a routing-gold file whose YAML contract and expected resources feed the typed-gold gate; a companion operator scenario keeps that gate intact while adding the answer turn. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Converting SD-007 itself into a conversation. It is a routing-gold file whose YAML contract and expected resources feed the typed-gold gate; a companion operator scenario keeps that gate intact while adding the answer turn.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Converting SD-007 itself into a conversation. It is a routing-gold file whose YAML contract and expected resources feed the typed-gold gate; a companion operator scenario keeps that gate intact while adding the answer turn.

### Converting sk-code-quality's CQ-009 trust sequence. Setting `skilled.trustRepoChecks` is an operator config action between two command runs, not a scripted answer in a conversation. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Converting sk-code-quality's CQ-009 trust sequence. Setting `skilled.trustRepoChecks` is an operator config action between two command runs, not a scripted answer in a conversation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Converting sk-code-quality's CQ-009 trust sequence. Setting `skilled.trustRepoChecks` is an operator config action between two command runs, not a scripted answer in a conversation.

### Converting sk-create-command's CMI-001 and CMI-002. Their gates and confirm modes are authored-file properties; the scenario does not run the command, so there is no live question to answer. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Converting sk-create-command's CMI-001 and CMI-002. Their gates and confirm modes are authored-file properties; the scenario does not run the command, so there is no live question to answer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Converting sk-create-command's CMI-001 and CMI-002. Their gates and confirm modes are authored-file properties; the scenario does not run the command, so there is no live question to answer.

### Converting sk-prompt's SP-012 deliver-first scenario. Its rule explicitly forbids a clarifying question before the prompt, so a conversation would contradict the behavior it tests. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Converting sk-prompt's SP-012 deliver-first scenario. Its rule explicitly forbids a clarifying question before the prompt, so a conversation would contradict the behavior it tests.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Converting sk-prompt's SP-012 deliver-first scenario. Its rule explicitly forbids a clarifying question before the prompt, so a conversation would contradict the behavior it tests.

### Keyword scanning for "session", "restart" or "compact" alone. The terms appear in cli-jev and mcp-code-mode as command or server lifecycle language, not as runtime-session behavior. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Keyword scanning for "session", "restart" or "compact" alone. The terms appear in cli-jev and mcp-code-mode as command or server lifecycle language, not as runtime-session behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Keyword scanning for "session", "restart" or "compact" alone. The terms appear in cli-jev and mcp-code-mode as command or server lifecycle language, not as runtime-session behavior.

### Looking for a question in the with-human-voice scanner. Its unchecked categories are for a reader, not for the runtime, so the judgment pass is Q1 and never a conversation. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Looking for a question in the with-human-voice scanner. Its unchecked categories are for a reader, not for the runtime, so the judgment pass is Q1 and never a conversation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a question in the with-human-voice scanner. Its unchecked categories are for a reader, not for the runtime, so the judgment pass is Q1 and never a conversation.

### Package-level keyword scans for "session" or "OAuth" in the MCP transports. Both terms describe operator prerequisites, not runtime-session behavior. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Package-level keyword scans for "session" or "OAuth" in the MCP transports. Both terms describe operator prerequisites, not runtime-session behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Package-level keyword scans for "session" or "OAuth" in the MCP transports. Both terms describe operator prerequisites, not runtime-session behavior.

### Reading every changelog scenario for an approval gate. CHG-007 is the only one that asks; the release scenarios either prepare text or refuse to publish. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Reading every changelog scenario for an approval gate. CHG-007 is the only one that asks; the release scenarios either prepare text or refuse to publish.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading every changelog scenario for an approval gate. CHG-007 is the only one that asks; the release scenarios either prepare text or refuse to publish.

### Reading the sk-design hub root for scenario detail. It is only a 55-line index; the SD-007 contract lives in the category file and carries the disambiguation branch. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reading the sk-design hub root for scenario detail. It is only a 55-line index; the SD-007 contract lives in the category file and carries the disambiguation branch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the sk-design hub root for scenario detail. It is only a 55-line index; the SD-007 contract lives in the category file and carries the disambiguation branch.

### Searching sk-prompt for approval language. The only blocking branch is SP-008's `needs_disambiguation`; the rest of the skill is designed to deliver first and list open items. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Searching sk-prompt for approval language. The only blocking branch is SP-008's `needs_disambiguation`; the rest of the skill is designed to deliver first and list open items.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching sk-prompt for approval language. The only blocking branch is SP-008's `needs_disambiguation`; the rest of the skill is designed to deliver first and list open items.

### Treating "restart Code Mode" in CM-021, CM-022 and CM-024 as the runner's `restart` action. The restart is an MCP-server process restart inside the task, not a runtime session restart, so a conversation turn cannot perform it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating "restart Code Mode" in CM-021, CM-022 and CM-024 as the runner's `restart` action. The restart is an MCP-server process restart inside the task, not a runtime session restart, so a conversation turn cannot perform it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating "restart Code Mode" in CM-021, CM-022 and CM-024 as the runner's `restart` action. The restart is an MCP-server process restart inside the task, not a runtime session restart, so a conversation turn cannot perform it.

### Treating GUIDED-014's stop-before-validation as an approval gate. The wrapper halts because `DESIGN.md` does not exist; there is no operator answer that changes the next step. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating GUIDED-014's stop-before-validation as an approval gate. The wrapper halts because `DESIGN.md` does not exist; there is no operator answer that changes the next step.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating GUIDED-014's stop-before-validation as an approval gate. The wrapper halts because `DESIGN.md` does not exist; there is no operator answer that changes the next step.

### Treating mcp-mobbin's or mcp-refero's "fresh Code Mode session" precondition as a runner `restart`. The runner restarts the subject runtime, not the Code Mode MCP server, and no check would observe the server reload. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating mcp-mobbin's or mcp-refero's "fresh Code Mode session" precondition as a runner `restart`. The runner restarts the subject runtime, not the Code Mode MCP server, and no check would observe the server reload.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating mcp-mobbin's or mcp-refero's "fresh Code Mode session" precondition as a runner `restart`. The runner restarts the subject runtime, not the Code Mode MCP server, and no check would observe the server reload.

### Treating SCG-007's session-goal redirect as a new conversation candidate. The first lineage already recommends the goal-injection companion family, and SCG-008's resend is that same shape; counting it again here would double-count the same behavior. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating SCG-007's session-goal redirect as a new conversation candidate. The first lineage already recommends the goal-injection companion family, and SCG-008's resend is that same shape; counting it again here would double-count the same behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating SCG-007's session-goal redirect as a new conversation candidate. The first lineage already recommends the goal-injection companion family, and SCG-008's resend is that same shape; counting it again here would double-count the same behavior.

### Treating sk-create-diff SNAP-002's "oh, I never saved a baseline" as a conversational correction. The scenario deliberately runs `compare` then `compare-pair` as two commands in one operator session. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating sk-create-diff SNAP-002's "oh, I never saved a baseline" as a conversational correction. The scenario deliberately runs `compare` then `compare-pair` as two commands in one operator session.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating sk-create-diff SNAP-002's "oh, I never saved a baseline" as a conversational correction. The scenario deliberately runs `compare` then `compare-pair` as two commands in one operator session.

### Treating SKD-022 as an approval gate. The reference tells the agent to choose the shadow system from the project's needs, not to ask the operator. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating SKD-022 as an approval gate. The reference tells the agent to choose the shadow system from the project's needs, not to ask the operator.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating SKD-022 as an approval gate. The reference tells the agent to choose the shadow system from the project's needs, not to ask the operator.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Converting cli-classifier's routing scenarios because they gate release. Q3's regression-gate clause still needs turns a shell check can decide; a one-send conversation would add setup cost without a new check. (iteration 1)
- Keyword scanning for "session", "restart" or "compact" alone. The terms appear in cli-jev and mcp-code-mode as command or server lifecycle language, not as runtime-session behavior. (iteration 1)
- Treating "restart Code Mode" in CM-021, CM-022 and CM-024 as the runner's `restart` action. The restart is an MCP-server process restart inside the task, not a runtime session restart, so a conversation turn cannot perform it. (iteration 1)
- Converting sk-code-quality's CQ-009 trust sequence. Setting `skilled.trustRepoChecks` is an operator config action between two command runs, not a scripted answer in a conversation. (iteration 2)
- Package-level keyword scans for "session" or "OAuth" in the MCP transports. Both terms describe operator prerequisites, not runtime-session behavior. (iteration 2)
- Treating mcp-mobbin's or mcp-refero's "fresh Code Mode session" precondition as a runner `restart`. The runner restarts the subject runtime, not the Code Mode MCP server, and no check would observe the server reload. (iteration 2)
- Converting SD-007 itself into a conversation. It is a routing-gold file whose YAML contract and expected resources feed the typed-gold gate; a companion operator scenario keeps that gate intact while adding the answer turn. (iteration 3)
- Reading the sk-design hub root for scenario detail. It is only a 55-line index; the SD-007 contract lives in the category file and carries the disambiguation branch. (iteration 3)
- Treating SKD-022 as an approval gate. The reference tells the agent to choose the shadow system from the project's needs, not to ask the operator. (iteration 3)
- Converting sk-prompt's SP-012 deliver-first scenario. Its rule explicitly forbids a clarifying question before the prompt, so a conversation would contradict the behavior it tests. (iteration 4)
- Searching sk-prompt for approval language. The only blocking branch is SP-008's `needs_disambiguation`; the rest of the skill is designed to deliver first and list open items. (iteration 4)
- Treating GUIDED-014's stop-before-validation as an approval gate. The wrapper halts because `DESIGN.md` does not exist; there is no operator answer that changes the next step. (iteration 4)
- Converting sk-create-command's CMI-001 and CMI-002. Their gates and confirm modes are authored-file properties; the scenario does not run the command, so there is no live question to answer. (iteration 5)
- Reading every changelog scenario for an approval gate. CHG-007 is the only one that asks; the release scenarios either prepare text or refuse to publish. (iteration 5)
- Treating sk-create-diff SNAP-002's "oh, I never saved a baseline" as a conversational correction. The scenario deliberately runs `compare` then `compare-pair` as two commands in one operator session. (iteration 5)
- Converting RRD-001, RRD-002 or RRD-003. Their refusals name a destination or an owner; only RRD-004 explicitly invites the user to return with new evidence. (iteration 6)
- Looking for a question in the with-human-voice scanner. Its unchecked categories are for a reader, not for the runtime, so the judgment pass is Q1 and never a conversation. (iteration 6)
- Treating SCG-007's session-goal redirect as a new conversation candidate. The first lineage already recommends the goal-injection companion family, and SCG-008's resend is that same shape; counting it again here would double-count the same behavior. (iteration 6)

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
Follow up on: sk-create-with-human-voice has no conversation candidate: its nine scenarios run the mechanical scanner, the scope gate and a re-scan, and the judgment pass is a reader's one-prompt review; Q1 governs the judged reads...

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

The first lineage read 28 of 56 packages and synthesized its results in `specs/sk-doc/065-conversation-playbook-scenarios/003-conversation-adoption-research/research/research.md`. Its decision rule: Q1 human judgment -> single prompt; Q2 multi-exchange, answer-dependent next step, restart or compaction -> conversation; Q3 several runtimes or release regression with shell-checkable turns -> conversation; Q4 otherwise single prompt. The runner drives only claude-code, opencode, codex, pi and devin, and its only session actions are send, restart and compact.

### Bounded Context Snapshot

- Source pointers: `.skilled/skills/<package>/manual-testing-playbook/` for each named package; the style rule at `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md` section 6.
- Reuse candidates: the first lineage's principles in `research/research.md`; the existing conversation prototypes in system-spec-kit and MTP-007.
- Integration points: none; this is a read-only audit recorded in this lineage.
- Constraints and risks: the runner cannot drive Cursor, Hermes, Aside or Orca, and cannot fork; a Q2 behavior in those surfaces stays manual.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 6
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-11-02T18:18:53Z
