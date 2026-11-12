---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
How can a natural-chat session get the protection of the spec-kit command workflows without the user typing a command, while staying flexible? Today the skill advisor recommends a skill or command in a hook brief, and a recommendation is not automatic use. A chat session that writes files loads AGENTS.md, the system-spec-kit SKILL.md, its ROUTER.md, the authoring card, the packet templates and validate.sh. It does not load .skilled/commands/speckit/assets/speckit-plan.yaml, speckit-implement.yaml or speckit-complete.yaml. Candidate mechanisms: a gate in AGENTS.md that routes a write request into workflow steps; a small shared step reference both paths read; a hook that injects the one relevant step at prompt or tool time; enforcement carried by templates and validate.sh; the session invoking the command itself when the advisor is confident. Rank them and recommend one, with the smallest set of changes to existing files. Prefer changing an existing line over a new file, hook, command or agent.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which checks exist only in the three command workflow files and are absent from the chat path (AGENTS.md, system-spec-kit SKILL.md and ROUTER.md, the authoring card, templates/core, validate.sh rules, hooks), and which are already duplicated there? Cite file and line for each.
- [x] For each of the five candidate mechanisms, what does it cost, what does it break, and how does it behave across the seven runtimes and in a dispatched child with no user present?
- [x] How do Level 1 and trivial edits stay light under each mechanism, and how does a user opt out in one sentence?
- [x] Where does a plan that only its author can follow get through on the chat path today, and what is the smallest change to an existing line that stops it?
- [x] What is the per-turn token cost of each mechanism measured from file sizes, what should not be built, and which single mechanism is recommended?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
[What this research session is NOT trying to answer -- populated during initialization]

---

## 5. STOP CONDITIONS
[Explicit conditions beyond convergence that should end the session -- populated during initialization]

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which checks exist only in the three command workflow files and are absent from the chat path (AGENTS.md, system-spec-kit SKILL.md and ROUTER.md, the authoring card, templates/core, validate.sh rules, hooks), and which are already duplicated there? Cite file and line for each.
- For each of the five candidate mechanisms, what does it cost, what does it break, and how does it behave across the seven runtimes and in a dispatched child with no user present?
- How do Level 1 and trivial edits stay light under each mechanism, and how does a user opt out in one sentence?
- Where does a plan that only its author can follow get through on the chat path today, and what is the smallest change to an existing line that stops it?
- What is the per-turn token cost of each mechanism measured from file sizes, what should not be built, and which single mechanism is recommended?

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
### **`description.json`'s `level` as a reliable corpus join key.** It works for 4,915 tracked packets, but 38 carry `unset` and 6 have no description at all; those 44 sit at 47.4% and 33.3% heading presence. Not a defect worth chasing — the join is strong on the population that matters — but a future corpus measurement should report the unjoined residue instead of folding it into the denominator, which is the same error finding 4 corrects. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **`description.json`'s `level` as a reliable corpus join key.** It works for 4,915 tracked packets, but 38 carry `unset` and 6 have no description at all; those 44 sit at 47.4% and 33.3% heading presence. Not a defect worth chasing — the join is strong on the population that matters — but a future corpus measurement should report the unjoined residue instead of folding it into the denominator, which is the same error finding 4 corrects.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`description.json`'s `level` as a reliable corpus join key.** It works for 4,915 tracked packets, but 38 carry `unset` and 6 have no description at all; those 44 sit at 47.4% and 33.3% heading presence. Not a defect worth chasing — the join is strong on the population that matters — but a future corpus measurement should report the unjoined residue instead of folding it into the denominator, which is the same error finding 4 corrects.

### **A plan-review verdict as a chat-path carrier.** Structurally dead: the only producer is a command loop, and the artifact it emits is a self-report by its own contract. This is the last of the three places iteration 1's hole could have been closed by prose about review; with the YAML gates (iteration 1), the validator rules (iteration 3) and now the verdict surface (this iteration) all checked, the prose-plus-decidable-shape edit set is the whole of what remains. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A plan-review verdict as a chat-path carrier.** Structurally dead: the only producer is a command loop, and the artifact it emits is a self-report by its own contract. This is the last of the three places iteration 1's hole could have been closed by prose about review; with the YAML gates (iteration 1), the validator rules (iteration 3) and now the verdict surface (this iteration) all checked, the prose-plus-decidable-shape edit set is the whole of what remains.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A plan-review verdict as a chat-path carrier.** Structurally dead: the only producer is a command loop, and the artifact it emits is a self-report by its own contract. This is the last of the three places iteration 1's hole could have been closed by prose about review; with the YAML gates (iteration 1), the validator rules (iteration 3) and now the verdict surface (this iteration) all checked, the prose-plus-decidable-shape edit set is the whole of what remains.

### **A predicate that passes on the card's own example for free.** The first candidate — "the three phase lines exist and are one line each" — is exactly what the current verify already approximates, and it passes on `:120`, on the FILL stub and on `## 4. AFFECTED SURFACES`. It measures the count, not the shape, so it inherits the false positive in finding 2. Rejected rather than tuned, since tuning it towards "has backticks" would still pass `--keep <n>`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A predicate that passes on the card's own example for free.** The first candidate — "the three phase lines exist and are one line each" — is exactly what the current verify already approximates, and it passes on `:120`, on the FILL stub and on `## 4. AFFECTED SURFACES`. It measures the count, not the shape, so it inherits the false positive in finding 2. Rejected rather than tuned, since tuning it towards "has backticks" would still pass `--keep <n>`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A predicate that passes on the card's own example for free.** The first candidate — "the three phase lines exist and are one line each" — is exactly what the current verify already approximates, and it passes on `:120`, on the FILL stub and on `## 4. AFFECTED SURFACES`. It measures the count, not the shape, so it inherits the false positive in finding 2. Rejected rather than tuned, since tuning it towards "has backticks" would still pass `--keep <n>`.

### **Adding a review or approval section to `plan.md.tmpl` as the chat-path carrier.** It needs a new template section plus a new validator rule to mean anything, it still leaves the verdict unfalsifiable, and it re-introduces a reviewer step into a session the topic says has no operator typing anything. The decidable shape check reaches the checkable half with amended existing lines. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Adding a review or approval section to `plan.md.tmpl` as the chat-path carrier.** It needs a new template section plus a new validator rule to mean anything, it still leaves the verdict unfalsifiable, and it re-introduces a reviewer step into a session the topic says has no operator typing anything. The decidable shape check reaches the checkable half with amended existing lines.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding a review or approval section to `plan.md.tmpl` as the chat-path carrier.** It needs a new template section plus a new validator rule to mean anything, it still leaves the verdict unfalsifiable, and it re-introduces a reviewer step into a session the topic says has no operator typing anything. The decidable shape check reaches the checkable half with amended existing lines.

### **Adding a shape-count command to card `:124` so the verify proves the acceptance rather than locating it.** Measured: 31 of 4,965 plans have three compliant phase lines, so this verify would fail on 99.4% of the corpus. That is the same new-obligation-as-rule problem that withdrew the validator backstop in iteration 8, arriving this time on the verify line instead of in the registry. The verify stays a locator; the acceptance carries the obligation. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Adding a shape-count command to card `:124` so the verify proves the acceptance rather than locating it.** Measured: 31 of 4,965 plans have three compliant phase lines, so this verify would fail on 99.4% of the corpus. That is the same new-obligation-as-rule problem that withdrew the validator backstop in iteration 8, arriving this time on the verify line instead of in the registry. The verify stays a locator; the acceptance carries the obligation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding a shape-count command to card `:124` so the verify proves the acceptance rather than locating it.** Measured: 31 of 4,965 plans have three compliant phase lines, so this verify would fail on 99.4% of the corpus. That is the same new-obligation-as-rule problem that withdrew the validator backstop in iteration 8, arriving this time on the verify line instead of in the registry. The verify stays a locator; the acceptance carries the obligation.

### **Anchoring the requirement on `.cursor/rules/skill-routing.md` instead of `AGENTS.md`.** It is inside any size budget at 2,257 bytes and is injected on Cursor and Devin, but it is absent on the other five runtimes, so it would be an additional file serving a subset of the runtimes the existing line already serves. Measured, then rejected (finding 4). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Anchoring the requirement on `.cursor/rules/skill-routing.md` instead of `AGENTS.md`.** It is inside any size budget at 2,257 bytes and is injected on Cursor and Devin, but it is absent on the other five runtimes, so it would be an additional file serving a subset of the runtimes the existing line already serves. Measured, then rejected (finding 4).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Anchoring the requirement on `.cursor/rules/skill-routing.md` instead of `AGENTS.md`.** It is inside any size budget at 2,257 bytes and is injected on Cursor and Devin, but it is absent on the other five runtimes, so it would be an additional file serving a subset of the runtimes the existing line already serves. Measured, then rejected (finding 4).

### **Assuming a fix to the `AGENTS.md` truncation belongs to this recommendation.** It does not: the -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Assuming a fix to the `AGENTS.md` truncation belongs to this recommendation.** It does not: the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Assuming a fix to the `AGENTS.md` truncation belongs to this recommendation.** It does not: the

### **Assuming a new gate inherits the child-dispatch exemption.** The exemption enumerates the clauses it converts; a later gate is outside that list. Recorded as a requirement of the recommendation rather than an assumption. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Assuming a new gate inherits the child-dispatch exemption.** The exemption enumerates the clauses it converts; a later gate is outside that list. Recorded as a requirement of the recommendation rather than an assumption.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Assuming a new gate inherits the child-dispatch exemption.** The exemption enumerates the clauses it converts; a later gate is outside that list. Recorded as a requirement of the recommendation rather than an assumption.

### **Assuming an existing delivered line already carries the obligation.** The directed search over lines 1–183 found four `plan` hits and none of them is a plan-shape or verdict rule (finding 2), which is what makes a line amendment a genuine addition rather than a restatement. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Assuming an existing delivered line already carries the obligation.** The directed search over lines 1–183 found four `plan` hits and none of them is a plan-shape or verdict rule (finding 2), which is what makes a line amendment a genuine addition rather than a restatement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Assuming an existing delivered line already carries the obligation.** The directed search over lines 1–183 found four `plan` hits and none of them is a plan-shape or verdict rule (finding 2), which is what makes a line amendment a genuine addition rather than a restatement.

### **Claiming "no review surface exists anywhere in the repo".** False as stated and therefore not claimed: `.skilled/commands/deep/review.md` is a review surface. The scoped claim in finding 3 is about the packet-shaped chat path — the references, the SKILL entry point and the two templates a writing session actually loads. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Claiming "no review surface exists anywhere in the repo".** False as stated and therefore not claimed: `.skilled/commands/deep/review.md` is a review surface. The scoped claim in finding 3 is about the packet-shaped chat path — the references, the SKILL entry point and the two templates a writing session actually loads.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Claiming "no review surface exists anywhere in the repo".** False as stated and therefore not claimed: `.skilled/commands/deep/review.md` is a review surface. The scoped claim in finding 3 is about the packet-shaped chat path — the references, the SKILL entry point and the two templates a writing session actually loads.

### **Comparing the mechanisms by total file size.** The denominator is paid before any mechanism is chosen — `AGENTS.md` is 6,800 tokens resident whether or not a gate is added — so a total-size comparison prices the file, not the change. Only the delta is comparable, which is why finding 3's line-versus-block measurement carries the answer. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Comparing the mechanisms by total file size.** The denominator is paid before any mechanism is chosen — `AGENTS.md` is 6,800 tokens resident whether or not a gate is added — so a total-size comparison prices the file, not the change. Only the delta is comparable, which is why finding 3's line-versus-block measurement carries the answer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Comparing the mechanisms by total file size.** The denominator is paid before any mechanism is chosen — `AGENTS.md` is 6,800 tokens resident whether or not a gate is added — so a total-size comparison prices the file, not the change. Only the delta is comparable, which is why finding 3's line-versus-block measurement carries the answer.

### **Compressing the rule into the ≤ 27 B bracket.** The bracket is free but 27 bytes cannot express a -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Compressing the rule into the ≤ 27 B bracket.** The bracket is free but 27 bytes cannot express a
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Compressing the rule into the ≤ 27 B bracket.** The bracket is free but 27 bytes cannot express a

### **Fixing the card alone and leaving the template's `tasks.md` ownership clause in place.** Finding 5's contradiction is bidirectional; amending one side leaves the scaffolded file instructing the opposite of the reference. The template edit is not a nice-to-have, it is the half that reaches sessions which never open the card. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Fixing the card alone and leaving the template's `tasks.md` ownership clause in place.** Finding 5's contradiction is bidirectional; amending one side leaves the scaffolded file instructing the opposite of the reference. The template edit is not a nice-to-have, it is the half that reaches sessions which never open the card.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Fixing the card alone and leaving the template's `tasks.md` ownership clause in place.** Finding 5's contradiction is bidirectional; amending one side leaves the scaffolded file instructing the opposite of the reference. The template edit is not a nice-to-have, it is the half that reaches sessions which never open the card.

### **Keeping the bullet at `:176` because 926 B is the number that was inherited.** The 926 B is a property of one address, not of the rule. The Execution Behavior slot takes a 292-byte draft with 17 B of headroom, so the choice between "the right section with a smaller budget" and "the wrong section with a larger one" resolves to the right section — the budget only binds if the text is written at the size of iteration 8's 351-byte draft rather than the 292-byte one. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Keeping the bullet at `:176` because 926 B is the number that was inherited.** The 926 B is a property of one address, not of the rule. The Execution Behavior slot takes a 292-byte draft with 17 B of headroom, so the choice between "the right section with a smaller budget" and "the wrong section with a larger one" resolves to the right section — the budget only binds if the text is written at the size of iteration 8's 351-byte draft rather than the 292-byte one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Keeping the bullet at `:176` because 926 B is the number that was inherited.** The 926 B is a property of one address, not of the rule. The Execution Behavior slot takes a 292-byte draft with 17 B of headroom, so the choice between "the right section with a smaller budget" and "the wrong section with a larger one" resolves to the right section — the budget only binds if the text is written at the size of iteration 8's 351-byte draft rather than the 292-byte one.

### **Keeping the level qualifier out of caution.** It reads as the safe choice, but the phases section is unguarded in the template at every level and Level 1 requires `plan.md`, so the clause would exempt a packet class that already carries the heading 96.6% of the time. A clause that changes nothing on the scaffolded path is dead text in a section whose problem is that it already says too much and disagrees with itself. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Keeping the level qualifier out of caution.** It reads as the safe choice, but the phases section is unguarded in the template at every level and Level 1 requires `plan.md`, so the clause would exempt a packet class that already carries the heading 96.6% of the time. A clause that changes nothing on the scaffolded path is dead text in a section whose problem is that it already says too much and disagrees with itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Keeping the level qualifier out of caution.** It reads as the safe choice, but the phases section is unguarded in the template at every level and Level 1 requires `plan.md`, so the clause would exempt a packet class that already carries the heading 96.6% of the time. A clause that changes nothing on the scaffolded path is dead text in a section whose problem is that it already says too much and disagrees with itself.

### **Looking for a hook that gates a write at tool time.** The advisor hook is a `UserPromptSubmit` / system-transform hook: it injects text and returns `{}` on failure, so it informs a turn and never blocks one. Any mechanism claiming tool-time enforcement would need a different hook family, which is a new hook concern — the frozen preference order's last resort. Not re-investigating the advisor hook for enforcement capability. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Looking for a hook that gates a write at tool time.** The advisor hook is a `UserPromptSubmit` / system-transform hook: it injects text and returns `{}` on failure, so it informs a turn and never blocks one. Any mechanism claiming tool-time enforcement would need a different hook family, which is a new hook concern — the frozen preference order's last resort. Not re-investigating the advisor hook for enforcement capability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a hook that gates a write at tool time.** The advisor hook is a `UserPromptSubmit` / system-transform hook: it injects text and returns `{}` on failure, so it informs a turn and never blocks one. Any mechanism claiming tool-time enforcement would need a different hook family, which is a new hook concern — the frozen preference order's last resort. Not re-investigating the advisor hook for enforcement capability.

### **Looking for a validator rule that already anchors plan phases.** All 42 rule ids and descriptions were dumped; `FILE_EXISTS`, `LEVEL_MATCH`, `PLACEHOLDER_FILLED`, `SCAFFOLD_NEVER_TOUCHED`, `COMPLEXITY_MATCH` and `AC_CLOSURE` cover existence, level, placeholders, scaffold markers, content complexity and closure. None reads a phase line for a path or a proof command. Do not re-run this as a way of finding a hidden anchoring check. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Looking for a validator rule that already anchors plan phases.** All 42 rule ids and descriptions were dumped; `FILE_EXISTS`, `LEVEL_MATCH`, `PLACEHOLDER_FILLED`, `SCAFFOLD_NEVER_TOUCHED`, `COMPLEXITY_MATCH` and `AC_CLOSURE` cover existence, level, placeholders, scaffold markers, content complexity and closure. None reads a phase line for a path or a proof command. Do not re-run this as a way of finding a hidden anchoring check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a validator rule that already anchors plan phases.** All 42 rule ids and descriptions were dumped; `FILE_EXISTS`, `LEVEL_MATCH`, `PLACEHOLDER_FILLED`, `SCAFFOLD_NEVER_TOUCHED`, `COMPLEXITY_MATCH` and `AC_CLOSURE` cover existence, level, placeholders, scaffold markers, content complexity and closure. None reads a phase line for a path or a proof command. Do not re-run this as a way of finding a hidden anchoring check.

### **Making the backstop an inline rule inside `validate.sh`.** `validate.sh:5-11` forecloses it in its own words, and the architecture it describes is the reason the rule registry exists: a second implementation would let a packet's verdict depend on which caller asked. Recorded as a correction to iteration 6 rather than implemented around. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Making the backstop an inline rule inside `validate.sh`.** `validate.sh:5-11` forecloses it in its own words, and the architecture it describes is the reason the rule registry exists: a second implementation would let a packet's verdict depend on which caller asked. Recorded as a correction to iteration 6 rather than implemented around.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Making the backstop an inline rule inside `validate.sh`.** `validate.sh:5-11` forecloses it in its own words, and the architecture it describes is the reason the rule registry exists: a second implementation would let a packet's verdict depend on which caller asked. Recorded as a correction to iteration 6 rather than implemented around.

### **Numeric phase-readiness thresholds as a chat-path carrier.** The YAML planning gate's 70/100 weighting cannot be replicated in prose without inventing a scoring scheme the chat path does not have, and no validator rule reads a phase line. Structurally the same dead end iteration 3 recorded for anchoring rules; noted here only to close the question of whether the recommendation should carry a score. It should not. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Numeric phase-readiness thresholds as a chat-path carrier.** The YAML planning gate's 70/100 weighting cannot be replicated in prose without inventing a scoring scheme the chat path does not have, and no validator rule reads a phase line. Structurally the same dead end iteration 3 recorded for anchoring rules; noted here only to close the question of whether the recommendation should carry a score. It should not.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Numeric phase-readiness thresholds as a chat-path carrier.** The YAML planning gate's 70/100 weighting cannot be replicated in prose without inventing a scoring scheme the chat path does not have, and no validator rule reads a phase line. Structurally the same dead end iteration 3 recorded for anchoring rules; noted here only to close the question of whether the recommendation should carry a score. It should not.

### **Offsetting the eviction by pointing at a duplicate carrier under `.skilled/repo-rules/`.** Checked; -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Offsetting the eviction by pointing at a duplicate carrier under `.skilled/repo-rules/`.** Checked;
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Offsetting the eviction by pointing at a duplicate carrier under `.skilled/repo-rules/`.** Checked;

### **Placing the bullet after `:181` at 283–293 B.** Not ruled out of scope: ruled out on price. It -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Placing the bullet after `:181` at 283–293 B.** Not ruled out of scope: ruled out on price. It
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Placing the bullet after `:181` at 283–293 B.** Not ruled out of scope: ruled out on price. It

### **Placing the bullet after `:183` or later.** `:183` ends at byte 16,356, leaving 27 B — not a slot. `:184` and everything after it starts at or beyond 16,357, where residual budget is negative. This also explains finding 2: the section is not merely crowded, it is already cut. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Placing the bullet after `:183` or later.** `:183` ends at byte 16,356, leaving 27 B — not a slot. `:184` and everything after it starts at or beyond 16,357, where residual budget is negative. This also explains finding 2: the section is not merely crowded, it is already cut.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Placing the bullet after `:183` or later.** `:183` ends at byte 16,356, leaving 27 B — not a slot. `:184` and everything after it starts at or beyond 16,357, where residual budget is negative. This also explains finding 2: the section is not merely crowded, it is already cut.

### **Pricing an insertion by residual bytes.** Residual bytes past the cut are live instruction, so the -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Pricing an insertion by residual bytes.** Residual bytes past the cut are live instruction, so the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Pricing an insertion by residual bytes.** Residual bytes past the cut are live instruction, so the

### **Re-auditing `.claude`, `.codex`, `.opencode` and `.pi` for `AGENTS.md` delivery.** The open instance was the two runtimes outside the advisor contract; the other four are contract-named and were counted in iteration 3. Re-reading them would have spent the iteration confirming a count already taken. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Re-auditing `.claude`, `.codex`, `.opencode` and `.pi` for `AGENTS.md` delivery.** The open instance was the two runtimes outside the advisor contract; the other four are contract-named and were counted in iteration 3. Re-reading them would have spent the iteration confirming a count already taken.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-auditing `.claude`, `.codex`, `.opencode` and `.pi` for `AGENTS.md` delivery.** The open instance was the two runtimes outside the advisor contract; the other four are contract-named and were counted in iteration 3. Re-reading them would have spent the iteration confirming a count already taken.

### **Re-deriving iteration 3's cost axis or iteration 4's runtime matrix.** Both are inherited as measured; this iteration adds only the delivery-window arithmetic and the re-rank the matrix enables. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Re-deriving iteration 3's cost axis or iteration 4's runtime matrix.** Both are inherited as measured; this iteration adds only the delivery-window arithmetic and the re-rank the matrix enables.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-deriving iteration 3's cost axis or iteration 4's runtime matrix.** Both are inherited as measured; this iteration adds only the delivery-window arithmetic and the re-rank the matrix enables.

### **Re-deriving the by-level corpus cross-tab.** Iteration 8 answered it (96.6 / 96.2 / 93.4 / 90.6% heading presence) and the level qualifier is withdrawn; a second derivation would confirm a withdrawn clause. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Re-deriving the by-level corpus cross-tab.** Iteration 8 answered it (96.6 / 96.2 / 93.4 / 90.6% heading presence) and the level qualifier is withdrawn; a second derivation would confirm a withdrawn clause.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-deriving the by-level corpus cross-tab.** Iteration 8 answered it (96.6 / 96.2 / 93.4 / 90.6% heading presence) and the level qualifier is withdrawn; a second derivation would confirm a withdrawn clause.

### **Reading `.dsh/patches/*.patch.yml` in full to find an instruction loader.** A grep for `AGENTS` across all of `.dsh/` answered it: no patch references the file, and the only `system-prompt` row shape the repo generates is the persona patch. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Reading `.dsh/patches/*.patch.yml` in full to find an instruction loader.** A grep for `AGENTS` across all of `.dsh/` answered it: no patch references the file, and the only `system-prompt` row shape the repo generates is the persona patch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `.dsh/patches/*.patch.yml` in full to find an instruction loader.** A grep for `AGENTS` across all of `.dsh/` answered it: no patch references the file, and the only `system-prompt` row shape the repo generates is the persona patch.

### **Reading `recommend-level.sh` end to end to understand Level 0.** The boundary constants and the mapping branch are contiguous; a 20-line read produced the whole ladder. The scorer's weighting arithmetic is not in scope for a lightness answer. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Reading `recommend-level.sh` end to end to understand Level 0.** The boundary constants and the mapping branch are contiguous; a 20-line read produced the whole ladder. The scorer's weighting arithmetic is not in scope for a lightness answer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `recommend-level.sh` end to end to understand Level 0.** The boundary constants and the mapping branch are contiguous; a 20-line read produced the whole ladder. The scorer's weighting arithmetic is not in scope for a lightness answer.

### **Reading the three YAMLs in full to diff them.** The plan YAML alone is 885 lines and its gates are front-loaded into a contiguous block; two targeted reads of the gate blocks plus a vocabulary grep produced the same inventory at a fraction of the budget. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:403-424] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Reading the three YAMLs in full to diff them.** The plan YAML alone is 885 lines and its gates are front-loaded into a contiguous block; two targeted reads of the gate blocks plus a vocabulary grep produced the same inventory at a fraction of the budget. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:403-424]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading the three YAMLs in full to diff them.** The plan YAML alone is 885 lines and its gates are front-loaded into a contiguous block; two targeted reads of the gate blocks plus a vocabulary grep produced the same inventory at a fraction of the budget. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:403-424]

### **Requiring the phase predicate at every documentation level.** Tightening a rule that 23% of the existing corpus fails, with no soundness coverage added, would convert a low-cost prose fix into a migration project. Deferred to finding 4's scoping decision. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Requiring the phase predicate at every documentation level.** Tightening a rule that 23% of the existing corpus fails, with no soundness coverage added, would convert a low-cost prose fix into a migration project. Deferred to finding 4's scoping decision.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Requiring the phase predicate at every documentation level.** Tightening a rule that 23% of the existing corpus fails, with no soundness coverage added, would convert a low-cost prose fix into a migration project. Deferred to finding 4's scoping decision.

### **Restoring the level qualifier in `AGENTS.md` rather than in the card.** Same bracket accounting, -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Restoring the level qualifier in `AGENTS.md` rather than in the card.** Same bracket accounting,
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Restoring the level qualifier in `AGENTS.md` rather than in the card.** Same bracket accounting,

### **Searching `.skilled/` for the planning-gate check ids to find a second implementation.** No hits outside the YAMLs at any depth. This is a confirmed absence, not a thin search — do not re-run it as a way of finding a hidden enforcer. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Searching `.skilled/` for the planning-gate check ids to find a second implementation.** No hits outside the YAMLs at any depth. This is a confirmed absence, not a thin search — do not re-run it as a way of finding a hidden enforcer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Searching `.skilled/` for the planning-gate check ids to find a second implementation.** No hits outside the YAMLs at any depth. This is a confirmed absence, not a thin search — do not re-run it as a way of finding a hidden enforcer.

### **Searching for an adapter that arbitrates precedence.** None exists, and the reason is structural rather than a gap: the contract declines authority for the injected text instead of resolving conflicts in it. Recorded as finding 4 rather than as a missing capability. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Searching for an adapter that arbitrates precedence.** None exists, and the reason is structural rather than a gap: the contract declines authority for the injected text instead of resolving conflicts in it. Recorded as finding 4 rather than as a missing capability.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Searching for an adapter that arbitrates precedence.** None exists, and the reason is structural rather than a gap: the contract declines authority for the injected text instead of resolving conflicts in it. Recorded as finding 4 rather than as a missing capability.

### **Taking the backstop with a creation-date cutoff, following `AC_CLOSURE`'s dated-scoping precedent.** `folder-structure.md:156` shows the mechanism exists and works. Rejected on finding 3 rather than on cost: a dated cutoff suits a rule whose subject is universally present and newly required, and the path-plus-proof line is present in 1 of 4,915 packets, so the cutoff would police a behaviour nothing has ever produced while the prose that would produce it is the thing being shipped. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Taking the backstop with a creation-date cutoff, following `AC_CLOSURE`'s dated-scoping precedent.** `folder-structure.md:156` shows the mechanism exists and works. Rejected on finding 3 rather than on cost: a dated cutoff suits a rule whose subject is universally present and newly required, and the path-plus-proof line is present in 1 of 4,915 packets, so the cutoff would police a behaviour nothing has ever produced while the prose that would produce it is the thing being shipped.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Taking the backstop with a creation-date cutoff, following `AC_CLOSURE`'s dated-scoping precedent.** `folder-structure.md:156` shows the mechanism exists and works. Rejected on finding 3 rather than on cost: a dated cutoff suits a rule whose subject is universally present and newly required, and the path-plus-proof line is present in 1 of 4,915 packets, so the cutoff would police a behaviour nothing has ever produced while the prose that would produce it is the thing being shipped.

### **Testing the 16,384-byte cut empirically by running Devin.** The repo's own runtime doc records the limit *and* an observed instance of the worse variant ("could not be injected due to token limits"); an empirical re-run would be a stronger source but is not available in this session, and the bound is the conservative reading either way. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Testing the 16,384-byte cut empirically by running Devin.** The repo's own runtime doc records the limit *and* an observed instance of the worse variant ("could not be injected due to token limits"); an empirical re-run would be a stronger source but is not available in this session, and the bound is the conservative reading either way.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Testing the 16,384-byte cut empirically by running Devin.** The repo's own runtime doc records the limit *and* an observed instance of the worse variant ("could not be injected due to token limits"); an empirical re-run would be a stronger source but is not available in this session, and the bound is the conservative reading either way.

### **The strict predicate as a rule.** 1 of 4,915. Recorded as finding 3 rather than as a defective predicate — the predicate does discriminate (it returns 3 on the amended example, 0 on the current `:120`), which is what a rule needs and a corpus does not have. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **The strict predicate as a rule.** 1 of 4,915. Recorded as finding 3 rather than as a defective predicate — the predicate does discriminate (it returns 3 on the amended example, 0 on the current `:120`), which is what a rule needs and a corpus does not have.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The strict predicate as a rule.** 1 of 4,915. Recorded as finding 3 rather than as a defective predicate — the predicate does discriminate (it returns 3 on the amended example, 0 on the current `:120`), which is what a rule needs and a corpus does not have.

### **Treating "Level 1 is cheap" as a premise to measure.** The four Level-1 templates total ~49.6 KB. Level 1 is a *bounded* cost, not a small one, so the lightness question is only ever about marginal cost per mechanism. Measuring absolute Level-1 weight would have produced a number that answers nothing. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Treating "Level 1 is cheap" as a premise to measure.** The four Level-1 templates total ~49.6 KB. Level 1 is a *bounded* cost, not a small one, so the lightness question is only ever about marginal cost per mechanism. Measuring absolute Level-1 weight would have produced a number that answers nothing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating "Level 1 is cheap" as a premise to measure.** The four Level-1 templates total ~49.6 KB. Level 1 is a *bounded* cost, not a small one, so the lightness question is only ever about marginal cost per mechanism. Measuring absolute Level-1 weight would have produced a number that answers nothing.

### **Treating `.devin/hooks/` as a hook implementation surface.** It holds a single `README.md`; the real Devin hook wiring is `.devin/hooks.v1.json`, rendered from the shared registry. The directory name is not the adapter. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Treating `.devin/hooks/` as a hook implementation surface.** It holds a single `README.md`; the real Devin hook wiring is `.devin/hooks.v1.json`, rendered from the shared registry. The directory name is not the adapter.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `.devin/hooks/` as a hook implementation surface.** It holds a single `README.md`; the real Devin hook wiring is `.devin/hooks.v1.json`, rendered from the shared registry. The directory name is not the adapter.

### **Treating `PLACEHOLDER_FILLED` as proof that templates enforce their own shape.** The 63 surviving stubs are direct counter-evidence at the surface the backstop would join (finding 5). Not escalated into a claim about cause, because the cause was not investigated and is not needed to withdraw the premise. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Treating `PLACEHOLDER_FILLED` as proof that templates enforce their own shape.** The 63 surviving stubs are direct counter-evidence at the surface the backstop would join (finding 5). Not escalated into a claim about cause, because the cause was not investigated and is not needed to withdraw the premise.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `PLACEHOLDER_FILLED` as proof that templates enforce their own shape.** The 63 surviving stubs are direct counter-evidence at the surface the backstop would join (finding 5). Not escalated into a claim about cause, because the cause was not investigated and is not needed to withdraw the premise.

### **Treating `SKILL.md` or `ROUTER.md` as truncated in practice.** Both exceed 16,384 bytes, which makes "they are cut too" a tempting extension of iteration 4's result. It is not the same mechanism: they are read by a tool call, not injected as rules, so the rule-file budget does not bind them. Ruled out to prevent an over-broad defect claim (finding 3). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Treating `SKILL.md` or `ROUTER.md` as truncated in practice.** Both exceed 16,384 bytes, which makes "they are cut too" a tempting extension of iteration 4's result. It is not the same mechanism: they are read by a tool call, not injected as rules, so the rule-file budget does not bind them. Ruled out to prevent an over-broad defect claim (finding 3).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `SKILL.md` or `ROUTER.md` as truncated in practice.** Both exceed 16,384 bytes, which makes "they are cut too" a tempting extension of iteration 4's result. It is not the same mechanism: they are read by a tool call, not injected as rules, so the rule-file budget does not bind them. Ruled out to prevent an over-broad defect claim (finding 3).

### **Treating `speckit-resume-*.yaml` and the presentation `.txt` assets as comparison targets.** The topic froze the comparison to plan, implement and complete; `resume` is the continuity path, not a protection gate, and the presentations are display text. Deferred rather than excluded — if a mechanism later needs the resume path this must be reopened. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Treating `speckit-resume-*.yaml` and the presentation `.txt` assets as comparison targets.** The topic froze the comparison to plan, implement and complete; `resume` is the continuity path, not a protection gate, and the presentations are display text. Deferred rather than excluded — if a mechanism later needs the resume path this must be reopened.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `speckit-resume-*.yaml` and the presentation `.txt` assets as comparison targets.** The topic froze the comparison to plan, implement and complete; `resume` is the continuity path, not a protection gate, and the presentations are display text. Deferred rather than excluded — if a mechanism later needs the resume path this must be reopened.

### **Treating the deep-review verdict line as a truth-bearing artifact to anchor on.** Its own contract says the check is shape-only and the registry is the record (finding 4), so a chat-path rule requiring "a recorded verdict" would have been the card's unanchored verify in a new costume: satisfiable by writing the line. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Treating the deep-review verdict line as a truth-bearing artifact to anchor on.** Its own contract says the check is shape-only and the registry is the record (finding 4), so a chat-path rule requiring "a recorded verdict" would have been the card's unanchored verify in a new costume: satisfiable by writing the line.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the deep-review verdict line as a truth-bearing artifact to anchor on.** Its own contract says the check is shape-only and the registry is the record (finding 4), so a chat-path rule requiring "a recorded verdict" would have been the card's unanchored verify in a new costume: satisfiable by writing the line.

### **Treating the drafted example's file names as real paths to test.** `progress.sh` and `progress.test.sh` are illustrative in the same way the current example's "ten archives become three" is illustrative; the commands in the drafted example are shape demonstrations, and card `:107` already establishes the pattern of a real command against `<packet folder>` elsewhere in the same file. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Treating the drafted example's file names as real paths to test.** `progress.sh` and `progress.test.sh` are illustrative in the same way the current example's "ten archives become three" is illustrative; the commands in the drafted example are shape demonstrations, and card `:107` already establishes the pattern of a real command against `<packet folder>` elsewhere in the same file.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the drafted example's file names as real paths to test.** `progress.sh` and `progress.test.sh` are illustrative in the same way the current example's "ten archives become three" is illustrative; the commands in the drafted example are shape demonstrations, and card `:107` already establishes the pattern of a real command against `<packet folder>` elsewhere in the same file.

### **Treating the email-style "exempt (typo fix)" checklist line as a separate exemption.** It is the same rung as `AGENTS.md:245`, restated in a checklist. Counting it twice would have over-stated the number of opt-out surfaces. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Treating the email-style "exempt (typo fix)" checklist line as a separate exemption.** It is the same rung as `AGENTS.md:245`, restated in a checklist. Counting it twice would have over-stated the number of opt-out surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the email-style "exempt (typo fix)" checklist line as a separate exemption.** It is the same rung as `AGENTS.md:245`, restated in a checklist. Counting it twice would have over-stated the number of opt-out surfaces.

### **Treating the observed 91-character advisor brief as the mechanism's cost.** It is one sample; the ceiling is 2,048 characters. Used the observed value only for the "what it actually costs when it fires" row and the ceiling for the bound. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Treating the observed 91-character advisor brief as the mechanism's cost.** It is one sample; the ceiling is 2,048 characters. Used the observed value only for the "what it actually costs when it fires" row and the ceiling for the bound.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the observed 91-character advisor brief as the mechanism's cost.** It is one sample; the ceiling is 2,048 characters. Used the observed value only for the "what it actually costs when it fires" row and the ceiling for the bound.

### **Treating the residual budget after `:183` (28 B) as a candidate.** Falls inside the same -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Treating the residual budget after `:183` (28 B) as a candidate.** Falls inside the same
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the residual budget after `:183` (28 B) as a candidate.** Falls inside the same

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Reading the three YAMLs in full to diff them.** The plan YAML alone is 885 lines and its gates are front-loaded into a contiguous block; two targeted reads of the gate blocks plus a vocabulary grep produced the same inventory at a fraction of the budget. [SOURCE: .skilled/commands/speckit/assets/speckit-plan.yaml:403-424] (iteration 1)
- **Searching `.skilled/` for the planning-gate check ids to find a second implementation.** No hits outside the YAMLs at any depth. This is a confirmed absence, not a thin search — do not re-run it as a way of finding a hidden enforcer. (iteration 1)
- **Treating `speckit-resume-*.yaml` and the presentation `.txt` assets as comparison targets.** The topic froze the comparison to plan, implement and complete; `resume` is the continuity path, not a protection gate, and the presentations are display text. Deferred rather than excluded — if a mechanism later needs the resume path this must be reopened. (iteration 1)
- **Looking for a hook that gates a write at tool time.** The advisor hook is a `UserPromptSubmit` / system-transform hook: it injects text and returns `{}` on failure, so it informs a turn and never blocks one. Any mechanism claiming tool-time enforcement would need a different hook family, which is a new hook concern — the frozen preference order's last resort. Not re-investigating the advisor hook for enforcement capability. (iteration 2)
- **Reading `recommend-level.sh` end to end to understand Level 0.** The boundary constants and the mapping branch are contiguous; a 20-line read produced the whole ladder. The scorer's weighting arithmetic is not in scope for a lightness answer. (iteration 2)
- **Treating "Level 1 is cheap" as a premise to measure.** The four Level-1 templates total ~49.6 KB. Level 1 is a *bounded* cost, not a small one, so the lightness question is only ever about marginal cost per mechanism. Measuring absolute Level-1 weight would have produced a number that answers nothing. (iteration 2)
- **Treating the email-style "exempt (typo fix)" checklist line as a separate exemption.** It is the same rung as `AGENTS.md:245`, restated in a checklist. Counting it twice would have over-stated the number of opt-out surfaces. (iteration 2)
- **Assuming a new gate inherits the child-dispatch exemption.** The exemption enumerates the clauses it converts; a later gate is outside that list. Recorded as a requirement of the recommendation rather than an assumption. (iteration 3)
- **Comparing the mechanisms by total file size.** The denominator is paid before any mechanism is chosen — `AGENTS.md` is 6,800 tokens resident whether or not a gate is added — so a total-size comparison prices the file, not the change. Only the delta is comparable, which is why finding 3's line-versus-block measurement carries the answer. (iteration 3)
- **Looking for a validator rule that already anchors plan phases.** All 42 rule ids and descriptions were dumped; `FILE_EXISTS`, `LEVEL_MATCH`, `PLACEHOLDER_FILLED`, `SCAFFOLD_NEVER_TOUCHED`, `COMPLEXITY_MATCH` and `AC_CLOSURE` cover existence, level, placeholders, scaffold markers, content complexity and closure. None reads a phase line for a path or a proof command. Do not re-run this as a way of finding a hidden anchoring check. (iteration 3)
- **Treating the observed 91-character advisor brief as the mechanism's cost.** It is one sample; the ceiling is 2,048 characters. Used the observed value only for the "what it actually costs when it fires" row and the ceiling for the bound. (iteration 3)
- **Re-auditing `.claude`, `.codex`, `.opencode` and `.pi` for `AGENTS.md` delivery.** The open instance was the two runtimes outside the advisor contract; the other four are contract-named and were counted in iteration 3. Re-reading them would have spent the iteration confirming a count already taken. (iteration 4)
- **Reading `.dsh/patches/*.patch.yml` in full to find an instruction loader.** A grep for `AGENTS` across all of `.dsh/` answered it: no patch references the file, and the only `system-prompt` row shape the repo generates is the persona patch. (iteration 4)
- **Searching for an adapter that arbitrates precedence.** None exists, and the reason is structural rather than a gap: the contract declines authority for the injected text instead of resolving conflicts in it. Recorded as finding 4 rather than as a missing capability. (iteration 4)
- **Testing the 16,384-byte cut empirically by running Devin.** The repo's own runtime doc records the limit *and* an observed instance of the worse variant ("could not be injected due to token limits"); an empirical re-run would be a stronger source but is not available in this session, and the bound is the conservative reading either way. (iteration 4)
- **Treating `.devin/hooks/` as a hook implementation surface.** It holds a single `README.md`; the real Devin hook wiring is `.devin/hooks.v1.json`, rendered from the shared registry. The directory name is not the adapter. (iteration 4)
- **Anchoring the requirement on `.cursor/rules/skill-routing.md` instead of `AGENTS.md`.** It is inside any size budget at 2,257 bytes and is injected on Cursor and Devin, but it is absent on the other five runtimes, so it would be an additional file serving a subset of the runtimes the existing line already serves. Measured, then rejected (finding 4). (iteration 5)
- **Assuming an existing delivered line already carries the obligation.** The directed search over lines 1–183 found four `plan` hits and none of them is a plan-shape or verdict rule (finding 2), which is what makes a line amendment a genuine addition rather than a restatement. (iteration 5)
- **Numeric phase-readiness thresholds as a chat-path carrier.** The YAML planning gate's 70/100 weighting cannot be replicated in prose without inventing a scoring scheme the chat path does not have, and no validator rule reads a phase line. Structurally the same dead end iteration 3 recorded for anchoring rules; noted here only to close the question of whether the recommendation should carry a score. It should not. (iteration 5)
- **Re-deriving iteration 3's cost axis or iteration 4's runtime matrix.** Both are inherited as measured; this iteration adds only the delivery-window arithmetic and the re-rank the matrix enables. (iteration 5)
- **Treating `SKILL.md` or `ROUTER.md` as truncated in practice.** Both exceed 16,384 bytes, which makes "they are cut too" a tempting extension of iteration 4's result. It is not the same mechanism: they are read by a tool call, not injected as rules, so the rule-file budget does not bind them. Ruled out to prevent an over-broad defect claim (finding 3). (iteration 5)
- **A plan-review verdict as a chat-path carrier.** Structurally dead: the only producer is a command loop, and the artifact it emits is a self-report by its own contract. This is the last of the three places iteration 1's hole could have been closed by prose about review; with the YAML gates (iteration 1), the validator rules (iteration 3) and now the verdict surface (this iteration) all checked, the prose-plus-decidable-shape edit set is the whole of what remains. (iteration 6)
- **Adding a review or approval section to `plan.md.tmpl` as the chat-path carrier.** It needs a new template section plus a new validator rule to mean anything, it still leaves the verdict unfalsifiable, and it re-introduces a reviewer step into a session the topic says has no operator typing anything. The decidable shape check reaches the checkable half with amended existing lines. (iteration 6)
- **Claiming "no review surface exists anywhere in the repo".** False as stated and therefore not claimed: `.skilled/commands/deep/review.md` is a review surface. The scoped claim in finding 3 is about the packet-shaped chat path — the references, the SKILL entry point and the two templates a writing session actually loads. (iteration 6)
- **Treating the deep-review verdict line as a truth-bearing artifact to anchor on.** Its own contract says the check is shape-only and the registry is the record (finding 4), so a chat-path rule requiring "a recorded verdict" would have been the card's unanchored verify in a new costume: satisfiable by writing the line. (iteration 6)
- **A predicate that passes on the card's own example for free.** The first candidate — "the three phase lines exist and are one line each" — is exactly what the current verify already approximates, and it passes on `:120`, on the FILL stub and on `## 4. AFFECTED SURFACES`. It measures the count, not the shape, so it inherits the false positive in finding 2. Rejected rather than tuned, since tuning it towards "has backticks" would still pass `--keep <n>`. (iteration 7)
- **Making the backstop an inline rule inside `validate.sh`.** `validate.sh:5-11` forecloses it in its own words, and the architecture it describes is the reason the rule registry exists: a second implementation would let a packet's verdict depend on which caller asked. Recorded as a correction to iteration 6 rather than implemented around. (iteration 7)
- **Requiring the phase predicate at every documentation level.** Tightening a rule that 23% of the existing corpus fails, with no soundness coverage added, would convert a low-cost prose fix into a migration project. Deferred to finding 4's scoping decision. (iteration 7)
- **Treating `PLACEHOLDER_FILLED` as proof that templates enforce their own shape.** The 63 surviving stubs are direct counter-evidence at the surface the backstop would join (finding 5). Not escalated into a claim about cause, because the cause was not investigated and is not needed to withdraw the premise. (iteration 7)
- **`description.json`'s `level` as a reliable corpus join key.** It works for 4,915 tracked packets, but 38 carry `unset` and 6 have no description at all; those 44 sit at 47.4% and 33.3% heading presence. Not a defect worth chasing — the join is strong on the population that matters — but a future corpus measurement should report the unjoined residue instead of folding it into the denominator, which is the same error finding 4 corrects. (iteration 8)
- **Fixing the card alone and leaving the template's `tasks.md` ownership clause in place.** Finding 5's contradiction is bidirectional; amending one side leaves the scaffolded file instructing the opposite of the reference. The template edit is not a nice-to-have, it is the half that reaches sessions which never open the card. (iteration 8)
- **Keeping the level qualifier out of caution.** It reads as the safe choice, but the phases section is unguarded in the template at every level and Level 1 requires `plan.md`, so the clause would exempt a packet class that already carries the heading 96.6% of the time. A clause that changes nothing on the scaffolded path is dead text in a section whose problem is that it already says too much and disagrees with itself. (iteration 8)
- **Taking the backstop with a creation-date cutoff, following `AC_CLOSURE`'s dated-scoping precedent.** `folder-structure.md:156` shows the mechanism exists and works. Rejected on finding 3 rather than on cost: a dated cutoff suits a rule whose subject is universally present and newly required, and the path-plus-proof line is present in 1 of 4,915 packets, so the cutoff would police a behaviour nothing has ever produced while the prose that would produce it is the thing being shipped. (iteration 8)
- **The strict predicate as a rule.** 1 of 4,915. Recorded as finding 3 rather than as a defective predicate — the predicate does discriminate (it returns 3 on the amended example, 0 on the current `:120`), which is what a rule needs and a corpus does not have. (iteration 8)
- **Adding a shape-count command to card `:124` so the verify proves the acceptance rather than locating it.** Measured: 31 of 4,965 plans have three compliant phase lines, so this verify would fail on 99.4% of the corpus. That is the same new-obligation-as-rule problem that withdrew the validator backstop in iteration 8, arriving this time on the verify line instead of in the registry. The verify stays a locator; the acceptance carries the obligation. (iteration 9)
- **Keeping the bullet at `:176` because 926 B is the number that was inherited.** The 926 B is a property of one address, not of the rule. The Execution Behavior slot takes a 292-byte draft with 17 B of headroom, so the choice between "the right section with a smaller budget" and "the wrong section with a larger one" resolves to the right section — the budget only binds if the text is written at the size of iteration 8's 351-byte draft rather than the 292-byte one. (iteration 9)
- **Placing the bullet after `:183` or later.** `:183` ends at byte 16,356, leaving 27 B — not a slot. `:184` and everything after it starts at or beyond 16,357, where residual budget is negative. This also explains finding 2: the section is not merely crowded, it is already cut. (iteration 9)
- **Re-deriving the by-level corpus cross-tab.** Iteration 8 answered it (96.6 / 96.2 / 93.4 / 90.6% heading presence) and the level qualifier is withdrawn; a second derivation would confirm a withdrawn clause. (iteration 9)
- **Treating the drafted example's file names as real paths to test.** `progress.sh` and `progress.test.sh` are illustrative in the same way the current example's "ten archives become three" is illustrative; the commands in the drafted example are shape demonstrations, and card `:107` already establishes the pattern of a real command against `<packet folder>` elsewhere in the same file. (iteration 9)
- **Assuming a fix to the `AGENTS.md` truncation belongs to this recommendation.** It does not: the (iteration 10)
- **Compressing the rule into the ≤ 27 B bracket.** The bracket is free but 27 bytes cannot express a (iteration 10)
- **Offsetting the eviction by pointing at a duplicate carrier under `.skilled/repo-rules/`.** Checked; (iteration 10)
- **Placing the bullet after `:181` at 283–293 B.** Not ruled out of scope: ruled out on price. It (iteration 10)
- **Pricing an insertion by residual bytes.** Residual bytes past the cut are live instruction, so the (iteration 10)
- **Restoring the level qualifier in `AGENTS.md` rather than in the card.** Same bracket accounting, (iteration 10)
- **Treating the residual budget after `:183` (28 B) as a candidate.** Falls inside the same (iteration 10)

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
- **Q5** — per-turn token cost per mechanism and the single recommendation. Finding 11 supplies the first measurement only. (iteration 1)
- **Q4** — partially answered (findings 9–10 name the hole and the fix); not closed until the fix is checked against Levels 1–3 and against a dispatched child with no user present. (iteration 1)
- **Q2** — per-mechanism cost, breakage and cross-runtime / child-dispatch behaviour for all five mechanisms. Untouched; needs the hook path inspected. (iteration 1)
- **Q3** — how Level 1 and trivial edits stay light, and the one-sentence opt-out. (iteration 1)
- **Q4** — closer. Finding 12 closes the Level 1–3 half of the check: the fix must carry a level qualifier or it raises Level 1 cost. The child-dispatch half (does a dispatched child with no user present run the card at all) is still untested. (iteration 2)
- **Q2** — per-mechanism cost, breakage and cross-runtime / child-dispatch behaviour for all five mechanisms. Still open. This iteration touched the hook's firing conditions, its data-driven skip list and the no-user checkpoint fallback, which is a partial contribution: the hook has a kill switch and an automatic pre-filter, and the command path has a `child_dispatch` record-and-continue rule. Neither has been checked against the seven runtime adapters. (iteration 2)
- **Q5** — per-turn token cost per mechanism and the single recommendation. Findings 4, 6, 9 and 10 supply four measurements (templates 49,620 bytes; policy 1,486 bytes; implement 60,098 / complete 93,496 bytes; card 9,699 / 208 lines). The ranking is now constrained from the lightness side but not yet decided. (iteration 2)
- **Q2** — per-mechanism cost, breakage and cross-runtime / child-dispatch behaviour for all five mechanisms. Closer but not closed. This iteration supplies the cost axis for all five (finding 2), the child-dispatch rule that any `AGENTS.md` addition must state (finding 7), and one concrete cross-runtime gap (finding 5: six adapters against seven runtime directories). Still unevidenced: whether the `.dsh` and `.devin` runtimes deliver `AGENTS.md` as a prefix at all, and what each of the six hook adapters does with an injected step that contradicts card text already in context. (iteration 3)
- None unchecked in the strategy's key-question list. Q5's *ranking* is now fully constrained from both the lightness side (iteration 3) and the delivery side (finding 8), but it is not re-scored this iteration: the matrix changes which mechanism can *win*, and re-ranking without re-reading the recommendation's exact edit set would be a claim without evidence. (iteration 4)
- Open verification thread carried forward: whether the recommended edit's target line is inside the first 16,384 bytes on the Devin carrier it is written into. That is a property of the edit, not a research question, and it is cheap to check at implementation time. (iteration 4)
- **Implementation constraint (from finding 5):** the recommendation is now one rule in four line replacements across two existing files — `AGENTS.md:176`, card `:113`, card `:123-124` — plus, if the backstop is taken, one rule in `validate.sh`. Whoever writes them must not carry the verdict clause forward. (iteration 6)
- **Residual coverage gap (from finding 5):** plan soundness has no chat-path carrier. Any future mechanism that claims to cover it must name the artifact a third party could recompute, or it re-creates the hole it claims to close. (iteration 6)
- **Implementation constraint (iteration 6, carried):** the `AGENTS.md:176` addition must stay inside ~926 bytes and must not reinstate the verdict clause. (iteration 7)
- **Residual coverage gap (iteration 6, carried):** plan soundness has no chat-path carrier. The decidable-shape rule proves a stranger can locate each step and run its proof; it does not prove the plan is sound, and nothing in this iteration narrows that. (iteration 7)
- **Implementation constraint (findings 1, 4, 6):** the edit set is four targets across two existing files, plus one optional new rule whose scoping must be decided first. Whoever writes it must amend card `:120` alongside `:113` and `:123-124`, or the section contradicts itself. (iteration 7)
- **Implementation constraint (final):** six amended lines across three existing files — card `:113`, `:120`, `:123-124`; template `:124`, `:126`; one `AGENTS.md` bullet after `:176` within 926 bytes. No new file, no new hook, no new rule, no new command. (iteration 8)
- **Carried, unchanged:** the `AGENTS.md` bullet must not reinstate a review-verdict clause (iteration 6). (iteration 8)
- **Residual coverage gap (unchanged, three iterations):** plan soundness has no chat-path carrier. The decidable-shape rule proves a stranger can locate each step and run its proof; it does not prove the plan is sound. Nothing in this iteration narrows that, and finding 3 makes it worse in one respect: a plan can now be *shaped* correctly and still be wrong, which is a more comfortable failure mode than the current one but not a solved one. (iteration 8)
- **Carried, unchanged:** the verify at card `:124` must name the heading, not the number `4`, or it passes on `specs/cli-orca/001-mcp-orca-cli/plan.md:114`, a plan with no phases section at all (iteration 7). (iteration 8)
- **Withdrawn this iteration:** the level qualifier (finding 1), and the optional validator script plus registry entry (finding 3). Neither should be written. Whoever implements must not reinstate either. (iteration 8)
- **Carried, unchanged:** no review-verdict clause (iteration 6); the verify names `IMPLEMENTATION PHASES`, never the number `4` (iteration 7); no level qualifier and no validator backstop (iteration 8). (iteration 9)
- **New, unowned:** `AGENTS.md` is already truncated at `:184` on the Devin carrier, so `:186`'s "Plan before acting" does not arrive there. This edit set does not fix it and no candidate mechanism priced it. (iteration 9)
- **Residual coverage gap (unchanged, four iterations):** plan soundness has no chat-path carrier. The decidable shape proves a stranger can locate each step and run its proof; it does not prove the plan is sound. (iteration 9)
- **Implementation constraint (placement corrected):** the `AGENTS.md` bullet goes after `:181`, not `:176`, because the Execution Behavior slot leaves 310 B and a 293-byte bullet including its newline fits; `:176`'s 926 B sits in Blast-Radius Management and was a slot artifact. (iteration 9)
- **Implementation constraint (text):** the drafted six lines in Next Focus are the measured text; card `:113` 271 → 352 B, card `:124` 64 → 88 B. (iteration 9)
- **Implementation constraint (size):** the bullet may not exceed 309 B of text — 17 B of headroom over the 292-byte draft, so any added clause forces the wrong section. (iteration 9)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
An earlier pass on this question ran as one model session and is archived under research_archive/. Its claims are unverified: do not cite it as evidence, and re-read any line before relying on it. Source pointers: AGENTS.md sections 2 to 4; .skilled/skills/system-spec-kit/SKILL.md and ROUTER.md; references/workflows/spec-authoring-card.md and quick-reference.md; templates/core/*.tmpl; references/validation/validation-rules.md; .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md; .skilled/hooks/; .skilled/commands/speckit/*.md and assets/*.yaml. Constraints: no new command, agent, hook concern or document unless a cheaper move is shown to fail; keep flexibility across spec Levels 1, 2 and 3.

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: [from config.maxToolCallsPerIteration] tool calls, [from config.maxMinutesPerIteration] minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: [from config.lineage.generation]
- Started: [timestamp]
