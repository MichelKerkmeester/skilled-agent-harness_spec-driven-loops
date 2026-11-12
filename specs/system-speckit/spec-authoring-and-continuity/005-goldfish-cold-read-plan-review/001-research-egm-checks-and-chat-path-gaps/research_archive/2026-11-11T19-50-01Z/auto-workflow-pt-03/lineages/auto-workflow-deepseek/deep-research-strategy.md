---
title: Deep Research Strategy - Command-workflow protection for natural-chat sessions
description: Runtime strategy for the fan-out lineage auto-workflow-deepseek researching how a chat session can inherit the spec-kit command workflows' checks without the user typing a command.
trigger_phrases:
  - "chat path workflow protection"
  - "speckit workflow checks in chat"
  - "advisor recommendation to automatic workflow"
  - "natural chat spec-kit gate"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

Lineage `auto-workflow-deepseek` of fan-out packet `auto-workflow-pt-03`. Single research loop, `stopPolicy: max-iterations` (10), convergence is telemetry only.

## 2. TOPIC

How can a natural-chat session get the protection of the spec-kit command workflows without the user typing a command, while staying flexible? Today the skill advisor recommends a skill or command in a hook brief, and a recommendation is not automatic use: a chat session that writes files loads AGENTS.md, the `system-spec-kit` SKILL.md, the authoring card, the packet templates and `validate.sh`, and never loads `.skilled/commands/speckit/assets/speckit-plan.yaml`, `speckit-implement.yaml` or `speckit-complete.yaml`. Prior packet findings live in `research/research.md`, `research/hardening-pt-02/research.md` and `scratch/prior-reads.md`.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which checks exist only in the speckit command workflows and are absent from the natural-chat write path, and which are already duplicated there?
- [ ] For each candidate mechanism (AGENTS.md gate, shared step reference, hook injection, template and validate.sh enforcement, advisor-driven command invocation), what does it cost and what does it break?
- [x] How does each candidate mechanism behave across the seven runtimes and in a dispatched child with no user present?
- [x] How does each mechanism keep Level 1 and trivial edits light, and how does a user opt out in one sentence?
- [x] What is the token cost per turn of each mechanism, measured from file sizes?
- [x] Where does a plan only its author can follow get through on the chat path today, and what is the smallest change that stops it?
- [x] How do the mechanisms rank, which one should be recommended, and what is the smallest set of changes to existing files?
- [x] What should not be built?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Not designing a new command, agent, or skill; the answer must land on existing files first.
- Not implementing the change: findings only, no edits outside this lineage directory.
- Not re-litigating the packet's other lineages (understand/quality) beyond what the mechanism comparison needs.

---

## 5. STOP CONDITIONS

- `config.maxIterations` (10) reached: stop with `stopReason: maxIterationsReached`.
- Required control files unreadable, or every in-scope source unreachable after Tier 1 retries.
- Convergence below threshold is telemetry only for this run; broaden angle instead of stopping early.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which checks exist only in the speckit command workflows and are absent from the natural-chat write path, and which are already duplicated there?
- How does each candidate mechanism behave across the seven runtimes and in a dispatched child with no user present?
- How does each mechanism keep Level 1 and trivial edits light, and how does a user opt out in one sentence?
- What is the token cost per turn of each mechanism, measured from file sizes?
- Where does a plan only its author can follow get through on the chat path today, and what is the smallest change that stops it?
- How do the mechanisms rank, which one should be recommended, and what is the smallest set of changes to existing files?
- What should not be built?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the workflow's gate blocks before the step bodies produced the scored gates first, which are the workflow-only checks that actually block. Step bodies mostly describe activities; the gate blocks and validation tokens are where refusal lives. (iteration 1)
- tracing "which document reads plan.md" instead of "which rule should exist" found the answer fast. Only four rule families touch the file, and all four are structural, so the hole is structural rather than a missing check inside an existing checker. (iteration 2)
- reading the mirrors rather than the root file settled reach. The root file cannot say who reads it, and the Cursor rule's generated-block comment is the single line that turns "AGENTS.md is universal" into "AGENTS.md plus one pointer". (iteration 3)
- checking the machine `INTENT_SIGNALS` against the prose claim found the load gap in one read. A prose-only reading of `ROUTER.md` would have concluded the card loads on every write and the mechanism was free. (iteration 4)
- reading `spec-gate` as a precedent rather than as an unrelated guard answered three questions at once — channel coverage, repetition control and block-versus-notice. It is the closest existing thing to "inject a step when a write is about to happen". (iteration 5)
- reading the `ANCHORS_VALID` rule's two adjacent paragraphs answered both halves at once — the cheapest lever and the reason the maintainers declined the analogous one. Rule text that explains its own refusals is the best kind of evidence for a cost question. (iteration 6)
- testing the premise before the design changed the answer. The question assumes a recommendation is not automatic use; the evidence says skill use is automatic and command recommendation does not exist, which splits one mechanism into a working half and a missing half. (iteration 7)
- counting the mirrors made the command mechanism's reach concrete. The question's framing treats "a command" as universally available; the directory listings show four runtimes reach it only as a prompt template and one not at all. (iteration 8)
- measuring bytes before estimating tokens kept two claims separate — the hard number and the conversion. It also ranked the mechanisms differently than intuition would: the hook looked cheap and is maintenance-heavy, the command looked free and is the most expensive. (iteration 9)
- scoring against five criteria instead of one kept the answer honest. Mechanism D is free and universal and still cannot carry the check; mechanism B is keyword-gated and still wins because the gate is one line. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- an initial pass grepped for `validation:` and collected only step-ending tokens, which made the workflow look like seven named states with no teeth. Adding the `quality_gates` and `workflow_enforcement` blocks changed the picture: the teeth are thresholds, not tokens. (iteration 1)
- expecting the authoring card's Acceptance/Verify pairs to be machine-run. They are instructions with a human-run command, so a section whose acceptance is a heading count cannot carry a decision test no matter how it is worded. That reframes "smallest change" as "cheapest recorded signal", not "cheapest enforced gate". (iteration 2)
- starting from token cost. The cost is real but secondary; the reach gap and the shipped-surface blast radius would each sink the mechanism before cost mattered. (iteration 3)
- assuming the card's role was to carry checks. It carries authoring steps with human-run verifications; its Bounds block rules out enforcement, so it can host a step but never a gate. (iteration 4)
- treating the advisor hook as the model. It is prompt-time only and one line long, so it understates both the reach (Cursor dormancy is a prompt-time problem) and the cost (a new concern is not one file). (iteration 5)
- estimating cost from the registry alone. The registry row is small; the script is not, and the corpus regrade is invisible in both. The real cost of mechanism D is in what it would make fail. (iteration 6)
- looking for an auto-invoke switch. There is no switch to flip, because the advisor's contract stops at recommending a skill; everything past that point is the skill's text. (iteration 7)
- reading the hooks coverage matrix as a delivery guarantee. It marks adapter coverage, and a child still receives nothing because the core returns early. Coverage and delivery are different claims. (iteration 8)
- treating the workflow as a single unit. Its ALWAYS rules list has a level-conditional entry and an unconditional one, and the unconditional `document_all_decisions` is the very check the chat path misses, which makes it the cheapest possible thing to port. (iteration 9)
- looking for a single mechanism that both instructs and enforces. None exists in this codebase at this cost, and the recommendation has to name that gap rather than paper over it with a combination. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "A new card section is enough": it is enough to instruct, and not enough to change behavior for a model that never opens the card under the fallback branch. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "A new card section is enough": it is enough to instruct, and not enough to change behavior for a model that never opens the card under the fallback branch.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "A new card section is enough": it is enough to instruct, and not enough to change behavior for a model that never opens the card under the fallback branch.

### "Assume prompt caching makes resident context free": the cache discounts repeated prefixes on some providers, but the window still holds the tokens and the discount is not a property the framework can rely on across seven runtimes. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "Assume prompt caching makes resident context free": the cache discounts repeated prefixes on some providers, but the window still holds the tokens and the discount is not a property the framework can rely on across seven runtimes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Assume prompt caching makes resident context free": the cache discounts repeated prefixes on some providers, but the window still holds the tokens and the discount is not a property the framework can rely on across seven runtimes.

### "Inject the whole step list": the injection channels are designed for short, bounded text — the advisor brief is one line plus a fixed directive, and the spec-gate notice is three sentences. A multi-step list would either be truncated or dominate the turn. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "Inject the whole step list": the injection channels are designed for short, bounded text — the advisor brief is one line plus a fixed directive, and the spec-gate notice is three sentences. A multi-step list would either be truncated or dominate the turn.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Inject the whole step list": the injection channels are designed for short, bounded text — the advisor brief is one line plus a fixed directive, and the spec-gate notice is three sentences. A multi-step list would either be truncated or dominate the turn.

### "Let the session type the command": a session cannot inject a user turn; it can only follow the command's contract, which is the YAML read. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "Let the session type the command": a session cannot inject a user turn; it can only follow the command's contract, which is the YAML read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Let the session type the command": a session cannot inject a user turn; it can only follow the command's contract, which is the YAML read.

### "Make the gate a HARD BLOCK": a hard block on a write that a user asked for turns every documentation edit into a workflow decision, and it contradicts the §6 trivial-edit exemption the framework sells as its low-friction path. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "Make the gate a HARD BLOCK": a hard block on a write that a user asked for turns every documentation edit into a workflow decision, and it contradicts the §6 trivial-edit exemption the framework sells as its low-friction path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Make the gate a HARD BLOCK": a hard block on a write that a user asked for turns every documentation edit into a workflow decision, and it contradicts the §6 trivial-edit exemption the framework sells as its low-friction path.

### "Make the rule a WARNING so it does not regrade": a warning never fails `--strict` and the framework's own instruction is to fix every warning as a failure, so the practical difference is whatever the reader chooses to do. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "Make the rule a WARNING so it does not regrade": a warning never fails `--strict` and the framework's own instruction is to fix every warning as a failure, so the practical difference is whatever the reader chooses to do.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Make the rule a WARNING so it does not regrade": a warning never fails `--strict` and the framework's own instruction is to fix every warning as a failure, so the practical difference is whatever the reader chooses to do.

### "Measure by line count": lines misrank the files. `validation-rules.md` is long but only read on failure, while `plan.md.tmpl` is short and loaded on every plan write, so bytes and load frequency together decide the cost. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: "Measure by line count": lines misrank the files. `validation-rules.md` is long but only read on failure, while `plan.md.tmpl` is short and loaded on every plan write, so bytes and load frequency together decide the cost.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Measure by line count": lines misrank the files. `validation-rules.md` is long but only read on failure, while `plan.md.tmpl` is short and loaded on every plan write, so bytes and load frequency together decide the cost.

### "Rank by cost alone": mechanism D is free and weakest on the check that matters, so a single-axis ranking inverts the answer. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: "Rank by cost alone": mechanism D is free and weakest on the check that matters, so a single-axis ranking inverts the answer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Rank by cost alone": mechanism D is free and weakest on the check that matters, so a single-axis ranking inverts the answer.

### "Rank by enforcement alone": the only enforcing mechanism is the validator, and it cannot express the failure. Enforcement is capped by what the mechanism can see, not by how hard it blocks. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: "Rank by enforcement alone": the only enforcing mechanism is the validator, and it cannot express the failure. Enforcement is capped by what the mechanism can see, not by how hard it blocks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Rank by enforcement alone": the only enforcing mechanism is the validator, and it cannot express the failure. Enforcement is capped by what the mechanism can see, not by how hard it blocks.

### "Runtimes without a command surface are out of scope": they are four of seven for the command mechanism, and Devin is one of the runtimes the repository explicitly supports. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "Runtimes without a command surface are out of scope": they are four of seven for the command mechanism, and Devin is one of the runtimes the repository explicitly supports.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Runtimes without a command surface are out of scope": they are four of seven for the command mechanism, and Devin is one of the runtimes the repository explicitly supports.

### "Teach the advisor to recommend commands": the bridge schema is slash-marker keyed across 62 generated entries, so this is a generator change plus a scoring-lane change, not a text edit. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: "Teach the advisor to recommend commands": the bridge schema is slash-marker keyed across 62 generated entries, so this is a generator change plus a scoring-lane change, not a text edit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Teach the advisor to recommend commands": the bridge schema is slash-marker keyed across 62 generated entries, so this is a generator change plus a scoring-lane change, not a text edit.

### "The authoring card already says one action per section": §5's acceptance is about content under headings, not about decisions inside a section [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:106]. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The authoring card already says one action per section": §5's acceptance is about content under headings, not about decisions inside a section [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:106].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The authoring card already says one action per section": §5's acceptance is about content under headings, not about decisions inside a section [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:106].

### "The card is already loaded on every write because `SKILL.md` says so": the machine router's score threshold disproves it. The claim is a routing intention, not a load guarantee, and the fallback path carries a checklist instead of the card. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "The card is already loaded on every write because `SKILL.md` says so": the machine router's score threshold disproves it. The claim is a routing intention, not a load guarantee, and the fallback path carries a checklist instead of the card.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The card is already loaded on every write because `SKILL.md` says so": the machine router's score threshold disproves it. The claim is a routing intention, not a load guarantee, and the fallback path carries a checklist instead of the card.

### "The hook covers the child because adapters exist": the core no-ops for a child before any state read, so adapter presence is not delivery. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: "The hook covers the child because adapters exist": the core no-ops for a child before any state read, so adapter presence is not delivery.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The hook covers the child because adapters exist": the core no-ops for a child before any state read, so adapter presence is not delivery.

### "The validator already catches bad plans": it catches missing files, unfilled tokens, unpaired anchors and unmet acceptance rows. Every one of those is a shape, and a vague plan has the right shape. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: "The validator already catches bad plans": it catches missing files, unfilled tokens, unpaired anchors and unmet acceptance rows. Every one of those is a shape, and a vague plan has the right shape.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The validator already catches bad plans": it catches missing files, unfilled tokens, unpaired anchors and unmet acceptance rows. Every one of those is a shape, and a vague plan has the right shape.

### "The validator will catch it once the status is no longer Draft": true for tokens, false for prose. A plan with every token filled and every anchor present can still leave a decision open, so status escalation does not close this hole. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "The validator will catch it once the status is no longer Draft": true for tokens, false for prose. A plan with every token filled and every anchor present can still leave a decision open, so status escalation does not close this hole.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The validator will catch it once the status is no longer Draft": true for tokens, false for prose. A plan with every token filled and every anchor present can still leave a decision open, so status escalation does not close this hole.

### "Use the deny channel to force the step": a deny on the first write stops the turn and hands the model a reason string, which turns every documentation write into a failed call. That is the blocked-turn behavior the spec-gate design deliberately avoids by delivering at the prompt and not at the turn. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: "Use the deny channel to force the step": a deny on the first write stops the turn and hands the model a reason string, which turns every documentation write into a failed call. That is the blocked-turn behavior the spec-gate design deliberately avoids by delivering at the prompt and not at the turn.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Use the deny channel to force the step": a deny on the first write stops the turn and hands the model a reason string, which turns every documentation write into a failed call. That is the blocked-turn behavior the spec-gate design deliberately avoids by delivering at the prompt and not at the turn.

### "Write the gate and let each runtime mirror pick it up": false for Cursor, which reads only its own rule file plus the generated pointer. Any mechanism that relies on `AGENTS.md` alone has a known blind runtime. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "Write the gate and let each runtime mirror pick it up": false for Cursor, which reads only its own rule file plus the generated pointer. Any mechanism that relies on `AGENTS.md` alone has a known blind runtime.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Write the gate and let each runtime mirror pick it up": false for Cursor, which reads only its own rule file plus the generated pointer. Any mechanism that relies on `AGENTS.md` alone has a known blind runtime.

### A new hook concern for the workflow step: the hub's cost is a core plus seven adapters plus a kill-switch row [SOURCE: .skilled/hooks/README.md:45], which puts it above every mechanism that edits an existing line. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A new hook concern for the workflow step: the hub's cost is a core plus seven adapters plus a kill-switch row [SOURCE: .skilled/hooks/README.md:45], which puts it above every mechanism that edits an existing line.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new hook concern for the workflow step: the hub's cost is a core plus seven adapters plus a kill-switch row [SOURCE: .skilled/hooks/README.md:45], which puts it above every mechanism that edits an existing line.

### A new validator rule for plan decisions: it is a script plus a registry row plus documentation, and its judgment would still be a regex over prose. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A new validator rule for plan decisions: it is a script plus a registry row plus documentation, and its judgment would still be a regex over prose.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new validator rule for plan decisions: it is a script plus a registry row plus documentation, and its judgment would still be a regex over prose.

### A prompt-time-only hook: Cursor's prompt channel is dormant under the tested CLI build, so the mechanism would miss one of the seven runtimes entirely. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A prompt-time-only hook: Cursor's prompt channel is dormant under the tested CLI build, so the mechanism would miss one of the seven runtimes entirely.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A prompt-time-only hook: Cursor's prompt channel is dormant under the tested CLI build, so the mechanism would miss one of the seven runtimes entirely.

### Adding a required plan anchor at the current template version: it regrades every existing v2.4 plan document and would ship a corpus-wide failure. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Adding a required plan anchor at the current template version: it regrades every existing v2.4 plan document and would ship a corpus-wide failure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a required plan anchor at the current template version: it regrades every existing v2.4 plan document and would ship a corpus-wide failure.

### Auto-executing in `auto` mode from chat: it skips the folder-choice gate, which iteration 1 established is the chat path's strongest existing check. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Auto-executing in `auto` mode from chat: it skips the folder-choice gate, which iteration 1 established is the chat path's strongest existing check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Auto-executing in `auto` mode from chat: it skips the folder-choice gate, which iteration 1 established is the chat path's strongest existing check.

### Auto-executing the workflow in `confirm` mode from chat: four unrequested approval prompts is a worse experience than the problem being solved. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Auto-executing the workflow in `confirm` mode from chat: four unrequested approval prompts is a worse experience than the problem being solved.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Auto-executing the workflow in `confirm` mode from chat: four unrequested approval prompts is a worse experience than the problem being solved.

### Choosing a mechanism per runtime: seven variants is a maintenance surface the repository's own mirror-drift rules exist to prevent [SOURCE: .cursor/README.md:72]. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Choosing a mechanism per runtime: seven variants is a maintenance surface the repository's own mirror-drift rules exist to prevent [SOURCE: .cursor/README.md:72].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Choosing a mechanism per runtime: seven variants is a maintenance surface the repository's own mirror-drift rules exist to prevent [SOURCE: .cursor/README.md:72].

### Creating a new "shared step reference" file: the card already occupies that role for both paths, and a second document would have to be linked from `SKILL.md`, `ROUTER.md`, two routers and two YAMLs to reach the same readers. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Creating a new "shared step reference" file: the card already occupies that role for both paths, and a second document would have to be linked from `SKILL.md`, `ROUTER.md`, two routers and two YAMLs to reach the same readers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Creating a new "shared step reference" file: the card already occupies that role for both paths, and a second document would have to be linked from `SKILL.md`, `ROUTER.md`, two routers and two YAMLs to reach the same readers.

### Gating auto-invocation on advisor confidence: the ceiling is 0.95 and ties are common, so the gate would fire on ambiguity rather than resolve it. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Gating auto-invocation on advisor confidence: the ceiling is 0.95 and ties are common, so the gate would fire on ambiguity rather than resolve it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Gating auto-invocation on advisor confidence: the ceiling is 0.95 and ties are common, so the gate would fire on ambiguity rather than resolve it.

### None. The inventory resolved cleanly. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None. The inventory resolved cleanly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. The inventory resolved cleanly.

### Proposing a Level 1 opt-out phrase rather than a level branch: a phrase requires the reader to know the phrase; a level branch is what `use_checklist_for_verification_level_2_plus` already does. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Proposing a Level 1 opt-out phrase rather than a level branch: a phrase requires the reader to know the phrase; a level branch is what `use_checklist_for_verification_level_2_plus` already does.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Proposing a Level 1 opt-out phrase rather than a level branch: a phrase requires the reader to know the phrase; a level branch is what `use_checklist_for_verification_level_2_plus` already does.

### Proposing a new `plan-decisions.md` artifact: the packet's own reversal-cost order puts a new file above editing an existing line, and the plan template's seven anchors leave no room for a second plan document at Level 1. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Proposing a new `plan-decisions.md` artifact: the packet's own reversal-cost order puts a new file above editing an existing line, and the plan template's seven anchors leave no room for a second plan document at Level 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Proposing a new `plan-decisions.md` artifact: the packet's own reversal-cost order puts a new file above editing an existing line, and the plan template's seven anchors leave no room for a second plan document at Level 1.

### Proposing a per-turn injection of the workflow's steps: 16.3k tokens per turn would dominate every session, and the workflow is a procedure for one moment, not a per-turn fact. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Proposing a per-turn injection of the workflow's steps: 16.3k tokens per turn would dominate every session, and the workflow is a procedure for one moment, not a per-turn fact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Proposing a per-turn injection of the workflow's steps: 16.3k tokens per turn would dominate every session, and the workflow is a procedure for one moment, not a per-turn fact.

### Proposing that `PLACEHOLDER_FILLED` evaluate prose: the rule is a token scanner over five files by construction [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:326]; broadening it into prose judgment would duplicate the document's purpose in a text validator. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Proposing that `PLACEHOLDER_FILLED` evaluate prose: the rule is a token scanner over five files by construction [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:326]; broadening it into prose judgment would duplicate the document's purpose in a text validator.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Proposing that `PLACEHOLDER_FILLED` evaluate prose: the rule is a token scanner over five files by construction [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:326]; broadening it into prose judgment would duplicate the document's purpose in a text validator.

### Proposing that Cursor be given a full `AGENTS.md` copy: the repository treats divergence between runtimes as drift, and the Cursor README names a single generator for the one generated block [SOURCE: .cursor/README.md:72]. A copy would need a second sync mechanism to stay true. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Proposing that Cursor be given a full `AGENTS.md` copy: the repository treats divergence between runtimes as drift, and the Cursor README names a single generator for the one generated block [SOURCE: .cursor/README.md:72]. A copy would need a second sync mechanism to stay true.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Proposing that Cursor be given a full `AGENTS.md` copy: the repository treats divergence between runtimes as drift, and the Cursor README names a single generator for the one generated block [SOURCE: .cursor/README.md:72]. A copy would need a second sync mechanism to stay true.

### Proposing the gate be written inside the repo-local block: that would fix this repository and ship nothing, which cannot answer a question about every chat session. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Proposing the gate be written inside the repo-local block: that would fix this repository and ship nothing, which cannot answer a question about every chat session.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Proposing the gate be written inside the repo-local block: that would fix this repository and ship nothing, which cannot answer a question about every chat session.

### Putting the card in `LOADING_LEVELS.ALWAYS`: it is a one-line change but it charges every invocation, including read-only turns, for a step that only matters when a plan is written. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Putting the card in `LOADING_LEVELS.ALWAYS`: it is a one-line change but it charges every invocation, including read-only turns, for a step that only matters when a plan is written.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Putting the card in `LOADING_LEVELS.ALWAYS`: it is a one-line change but it charges every invocation, including read-only turns, for a step that only matters when a plan is written.

### Reading `speckit-complete.yaml` line by line this iteration: the complete workflow composes the plan and implement steps, so its step bodies would duplicate findings 2-5 at 1444 lines of cost. Its router-level contract was enough for the inventory; the composed workflow is the same checks in one run. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading `speckit-complete.yaml` line by line this iteration: the complete workflow composes the plan and implement steps, so its step bodies would duplicate findings 2-5 at 1444 lines of cost. Its router-level contract was enough for the inventory; the composed workflow is the same checks in one run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `speckit-complete.yaml` line by line this iteration: the complete workflow composes the plan and implement steps, so its step bodies would duplicate findings 2-5 at 1444 lines of cost. Its router-level contract was enough for the inventory; the composed workflow is the same checks in one run.

### Recommending a combination of B and C as co-equal: two carriers for one check double the maintenance and the model's attention cost for no additional enforcement. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Recommending a combination of B and C as co-equal: two carriers for one check double the maintenance and the model's attention cost for no additional enforcement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recommending a combination of B and C as co-equal: two carriers for one check double the maintenance and the model's attention cost for no additional enforcement.

### Recommending mechanism D as the primary carrier: it cannot read judgment, and the one check that matters most here is a judgment. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Recommending mechanism D as the primary carrier: it cannot read judgment, and the one check that matters most here is a judgment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recommending mechanism D as the primary carrier: it cannot read judgment, and the one check that matters most here is a judgment.

### Recommending the fourth candidate by default: it is optional and belongs to the operator's choice of visibility, not to the minimum. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Recommending the fourth candidate by default: it is optional and belongs to the operator's choice of visibility, not to the minimum.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Recommending the fourth candidate by default: it is optional and belongs to the operator's choice of visibility, not to the minimum.

### Relying on the validator for ordering: sequence is not in its input, so no rule can express "plan before code". -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Relying on the validator for ordering: sequence is not in its input, so no rule can express "plan before code".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Relying on the validator for ordering: sequence is not in its input, so no rule can express "plan before code".

### Treating the child case as a separate design: the child is already handled by Gate 3's exemption and the workflow's own clause, so the mechanism only has to not break it. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating the child case as a separate design: the child is already handled by Gate 3's exemption and the workflow's own clause, so the mechanism only has to not break it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the child case as a separate design: the child is already handled by Gate 3's exemption and the workflow's own clause, so the mechanism only has to not break it.

### Treating the router Markdown files as check carriers: both routers explicitly disclaim dispatch, step logic and artifact writes and delegate to the YAML [SOURCE: .skilled/commands/speckit/implement.md:13]. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the router Markdown files as check carriers: both routers explicitly disclaim dispatch, step logic and artifact writes and delegate to the YAML [SOURCE: .skilled/commands/speckit/implement.md:13].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the router Markdown files as check carriers: both routers explicitly disclaim dispatch, step logic and artifact writes and delegate to the YAML [SOURCE: .skilled/commands/speckit/implement.md:13].

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- None. The inventory resolved cleanly. (iteration 1)
- Reading `speckit-complete.yaml` line by line this iteration: the complete workflow composes the plan and implement steps, so its step bodies would duplicate findings 2-5 at 1444 lines of cost. Its router-level contract was enough for the inventory; the composed workflow is the same checks in one run. (iteration 1)
- Treating the router Markdown files as check carriers: both routers explicitly disclaim dispatch, step logic and artifact writes and delegate to the YAML [SOURCE: .skilled/commands/speckit/implement.md:13]. (iteration 1)
- "The authoring card already says one action per section": §5's acceptance is about content under headings, not about decisions inside a section [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:106]. (iteration 2)
- "The validator will catch it once the status is no longer Draft": true for tokens, false for prose. A plan with every token filled and every anchor present can still leave a decision open, so status escalation does not close this hole. (iteration 2)
- Proposing a new `plan-decisions.md` artifact: the packet's own reversal-cost order puts a new file above editing an existing line, and the plan template's seven anchors leave no room for a second plan document at Level 1. (iteration 2)
- Proposing that `PLACEHOLDER_FILLED` evaluate prose: the rule is a token scanner over five files by construction [SOURCE: .skilled/skills/system-spec-kit/references/validation/validation-rules.md:326]; broadening it into prose judgment would duplicate the document's purpose in a text validator. (iteration 2)
- "Make the gate a HARD BLOCK": a hard block on a write that a user asked for turns every documentation edit into a workflow decision, and it contradicts the §6 trivial-edit exemption the framework sells as its low-friction path. (iteration 3)
- "Write the gate and let each runtime mirror pick it up": false for Cursor, which reads only its own rule file plus the generated pointer. Any mechanism that relies on `AGENTS.md` alone has a known blind runtime. (iteration 3)
- Proposing that Cursor be given a full `AGENTS.md` copy: the repository treats divergence between runtimes as drift, and the Cursor README names a single generator for the one generated block [SOURCE: .cursor/README.md:72]. A copy would need a second sync mechanism to stay true. (iteration 3)
- Proposing the gate be written inside the repo-local block: that would fix this repository and ship nothing, which cannot answer a question about every chat session. (iteration 3)
- "A new card section is enough": it is enough to instruct, and not enough to change behavior for a model that never opens the card under the fallback branch. (iteration 4)
- "The card is already loaded on every write because `SKILL.md` says so": the machine router's score threshold disproves it. The claim is a routing intention, not a load guarantee, and the fallback path carries a checklist instead of the card. (iteration 4)
- Creating a new "shared step reference" file: the card already occupies that role for both paths, and a second document would have to be linked from `SKILL.md`, `ROUTER.md`, two routers and two YAMLs to reach the same readers. (iteration 4)
- Putting the card in `LOADING_LEVELS.ALWAYS`: it is a one-line change but it charges every invocation, including read-only turns, for a step that only matters when a plan is written. (iteration 4)
- "Inject the whole step list": the injection channels are designed for short, bounded text — the advisor brief is one line plus a fixed directive, and the spec-gate notice is three sentences. A multi-step list would either be truncated or dominate the turn. (iteration 5)
- "Use the deny channel to force the step": a deny on the first write stops the turn and hands the model a reason string, which turns every documentation write into a failed call. That is the blocked-turn behavior the spec-gate design deliberately avoids by delivering at the prompt and not at the turn. (iteration 5)
- A new hook concern for the workflow step: the hub's cost is a core plus seven adapters plus a kill-switch row [SOURCE: .skilled/hooks/README.md:45], which puts it above every mechanism that edits an existing line. (iteration 5)
- A prompt-time-only hook: Cursor's prompt channel is dormant under the tested CLI build, so the mechanism would miss one of the seven runtimes entirely. (iteration 5)
- "Make the rule a WARNING so it does not regrade": a warning never fails `--strict` and the framework's own instruction is to fix every warning as a failure, so the practical difference is whatever the reader chooses to do. (iteration 6)
- "The validator already catches bad plans": it catches missing files, unfilled tokens, unpaired anchors and unmet acceptance rows. Every one of those is a shape, and a vague plan has the right shape. (iteration 6)
- A new validator rule for plan decisions: it is a script plus a registry row plus documentation, and its judgment would still be a regex over prose. (iteration 6)
- Adding a required plan anchor at the current template version: it regrades every existing v2.4 plan document and would ship a corpus-wide failure. (iteration 6)
- Relying on the validator for ordering: sequence is not in its input, so no rule can express "plan before code". (iteration 6)
- "Let the session type the command": a session cannot inject a user turn; it can only follow the command's contract, which is the YAML read. (iteration 7)
- "Teach the advisor to recommend commands": the bridge schema is slash-marker keyed across 62 generated entries, so this is a generator change plus a scoring-lane change, not a text edit. (iteration 7)
- Auto-executing in `auto` mode from chat: it skips the folder-choice gate, which iteration 1 established is the chat path's strongest existing check. (iteration 7)
- Auto-executing the workflow in `confirm` mode from chat: four unrequested approval prompts is a worse experience than the problem being solved. (iteration 7)
- Gating auto-invocation on advisor confidence: the ceiling is 0.95 and ties are common, so the gate would fire on ambiguity rather than resolve it. (iteration 7)
- "Runtimes without a command surface are out of scope": they are four of seven for the command mechanism, and Devin is one of the runtimes the repository explicitly supports. (iteration 8)
- "The hook covers the child because adapters exist": the core no-ops for a child before any state read, so adapter presence is not delivery. (iteration 8)
- Choosing a mechanism per runtime: seven variants is a maintenance surface the repository's own mirror-drift rules exist to prevent [SOURCE: .cursor/README.md:72]. (iteration 8)
- Treating the child case as a separate design: the child is already handled by Gate 3's exemption and the workflow's own clause, so the mechanism only has to not break it. (iteration 8)
- "Assume prompt caching makes resident context free": the cache discounts repeated prefixes on some providers, but the window still holds the tokens and the discount is not a property the framework can rely on across seven runtimes. (iteration 9)
- "Measure by line count": lines misrank the files. `validation-rules.md` is long but only read on failure, while `plan.md.tmpl` is short and loaded on every plan write, so bytes and load frequency together decide the cost. (iteration 9)
- Proposing a Level 1 opt-out phrase rather than a level branch: a phrase requires the reader to know the phrase; a level branch is what `use_checklist_for_verification_level_2_plus` already does. (iteration 9)
- Proposing a per-turn injection of the workflow's steps: 16.3k tokens per turn would dominate every session, and the workflow is a procedure for one moment, not a per-turn fact. (iteration 9)
- "Rank by cost alone": mechanism D is free and weakest on the check that matters, so a single-axis ranking inverts the answer. (iteration 10)
- "Rank by enforcement alone": the only enforcing mechanism is the validator, and it cannot express the failure. Enforcement is capped by what the mechanism can see, not by how hard it blocks. (iteration 10)
- Recommending a combination of B and C as co-equal: two carriers for one check double the maintenance and the model's attention cost for no additional enforcement. (iteration 10)
- Recommending mechanism D as the primary carrier: it cannot read judgment, and the one check that matters most here is a judgment. (iteration 10)
- Recommending the fourth candidate by default: it is optional and belongs to the operator's choice of visibility, not to the minimum. (iteration 10)

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
Follow up on: **The honest limit of the recommendation is that it lowers frequency, not the ceiling.** A fill-note clause and a keyword fix are instructions; neither proves a plan was read by anyone but its author. The one thing th...

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- `.skilled/commands/speckit/assets/speckit-plan.yaml` is 885 lines, `speckit-implement.yaml` 830, `speckit-complete.yaml` 1444; the chat path never reads them.
- `.skilled/skills/system-spec-kit/SKILL.md` (28185 bytes) and `ROUTER.md` (26012 bytes) are what a chat session does load.
- `AGENTS.md` is 27372 bytes and already carries Gate 2 artifact routing plus Gate 3 spec-folder questions and Gate 5 `REPO RULES.md` loading.
- Prior packet findings exist in `research/research.md`, `research/hardening-pt-02/research.md` and `scratch/prior-reads.md`.

### Bounded Context Snapshot

- Source pointers: `.skilled/commands/speckit/assets/*.yaml`, `.skilled/commands/speckit/*.md`, `.skilled/skills/system-spec-kit/`, `.skilled/skills/system-skill-advisor/hooks/`, `.skilled/hooks/`, `.skilled/agents/`, runtime agent/command directories.
- Reuse candidates: the authoring card, `quick-reference.md`, `validate.sh` rule set, the advisor hook brief, the templates under `templates/core/`.
- Integration points: `AGENTS.md` gate text, `system-spec-kit/SKILL.md` + `ROUTER.md`, `references/workflows/spec-authoring-card.md`, hook configs, `validate.sh`.
- Constraints: no new command, hook, agent or file if an existing line can carry the change; Level 1 and trivial edits must stay light; seven runtimes must keep working.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05 (telemetry only; stop policy is max-iterations)
- Per-iteration budget: 24 tool calls, 14 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Comment hygiene: no spec paths or ids in code comments
- Started: 2026-11-11T19:27:28Z
