
# Deep Research Strategy - Session Tracking Template

Runtime template copied to `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `frontier`, `operator`, or `legacy-import`
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
Reference evidence for the OpenBot parity build of skilled bots.

Inputs, all read-only. Do not edit any of them.
- The ten reference repos under specs/system-skilled-bots/context/: OpenBot-main (the primary reference), OpenMausBot-main, rakazo-main, openhuman-main, openhuman-full, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main and tinychannels-main.
- The build plan: the fourteen phase folders and the contracts/ folder of specs/system-skilled-bots/003-openbot-parity-build (001-activity-and-actor, 002-routine-layer, 003-terminal-screen, 004-computer-exposure, 005-memory, 006-approval-grants, 007-per-bot-apps, 008-vault, 009-skills, 010-conversations, 011-messaging-channels, 012-manual-testing-scenarios, 013-skilled-and-doc-alignment, 014-deep-review).
- The three earlier syntheses: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md, .../002-plan-review-research/research/research.md and .../003-plan-depth-research/research/research.md.
- The built runtime: .skilled/skills/system-skilled-bots/runtime/lib/, .skilled/bin/bots.cjs and .skilled/skills/system-skilled-bots/scripts/bot-check.cjs.

Answer two things.

1. Evidence per planned phase. For each of the fourteen phases: which reference files and lines implement the same thing; what a builder should lift or mirror, with the licence of the source; where the plan differs from how the references do it, and which side the evidence supports; and which failures, tests and fixes in those repos the plan does not yet guard against.

2. Net-new. What do the ten repos have that neither the build plan nor the skip list in section 13 of the parity synthesis covers? Rank each by its value to a small team and give its size. Read openhuman-full first: no earlier run studied it, and it carries five vendored crates (tinyagents, tinyconnectors, tinymemory, tinyhumans-sdk, tinysecurity) and a built openhuman-tui crate that openhuman-main lacks.

Rules.
- Do not repeat a finding one of the three earlier syntheses already carries. Cite the earlier finding and add only what is new.
- Cite every claim as [SOURCE: path:line]. A claim with no resolving citation is not a finding.
- Mark each claim observed (you read the line) or inferred (you reason from it).
- Name the 003 phase every finding belongs to. A finding that fits no phase goes under net-new.
- Write only inside your own lineage folder.


---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Trust, phases 006-approval-grants, 007-per-bot-apps and 008-vault: which reference files implement approval grants, per-bot tool or app filtering and a secret store with injection, what should the builder lift or mirror, and which leak, bypass or precedence bugs did those repos hit that the plan does not guard against?
- [ ] Net-new and operations: what do the ten reference repos have that neither the 003 build plan nor the skip list of the parity synthesis covers, ranked by value to a small team, and which test corpora, failure-handling patterns and upgrade paths in those repos should feed phases 012-manual-testing-scenarios, 013-skilled-and-doc-alignment and 014-deep-review?
- [ ] Does the per-run filtered UTCP config compare a tool name before or after normalisation, and can a normalised alias slip past the apps filter?
- [ ] Which of the four non-override rules does a routine-origin approval need, and does a standing answer saved from a check-in survive the next run?
- [ ] Does the plan secret-store-unreadable detail ever carry a captured backend message, and what fixed phrase replaces it per cause?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Not a re-derivation of the three earlier syntheses: a finding they already carry is cited, not repeated.
- Not an implementation pass: no file outside this lineage folder changes.
- Not a licence audit: licences are recorded per lifted source, not adjudicated.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: the run ends at iteration 10 regardless of convergence.
- Convergence below 0.05 before iteration 10 is telemetry only; broaden the review angle instead of synthesizing early.
- Terminal synthesis record must carry stopReason maxIterationsReached.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the plan's scope boundary first, then the reference, then the plan's own refusal table, turned each read into a gap rather than a restatement. The refusal table is what proved finding 7 — the plan prints `<detail>` where rakazo deliberately prints nothing. (iteration 1)
- testing the topic's premise before ranking anything. A per-directory file count is one command and it turned a plausible premise into three citable corrections, which is worth more than any single crate's README. (iteration 2)
- reading the plan's `design/` files before the reference. The design files are where the plan states its exact strings and match rules, and three of the five questions this iteration carried were answered by the plan rather than by a reference. A gap claim needs the plan's own text, not just the reference's. (iteration 3)
- reading the reference's *rule lists* rather than its page code. `OPENBOT_WORKING_EVENT_TYPES` and `CALLS_RECORDED_AS_CHANGES` are two exported constants, and between them they carry the two rules the plan lacks. A page component would have shown the same rules as branches. (iteration 4)
- fixing what each word means before comparing mechanisms. Both phases are named after a reference concept they do not implement, and a comparison that skipped that step would have produced four false gaps — a missing browser handoff, a missing memory engine, a missing namespace tree and a missing three-state key. (iteration 5)
- reading the reference's capability list as a checklist against the plan's REQ table. tinyskills states twenty capabilities in one README, and walking them against nine requirements found five differences in one pass — the highest yield per call in the run so far. (iteration 6)
- reading the reference's *docs* rather than its source for 011. `channel-delivery.md` states the durability rule and its caveat in four sentences, and the caveat — that a capability declaration is not proof of behaviour — is the finding, not the code. The source would have shown the enum and not the reason. (iteration 7)
- reading `TESTING.md` for its *standards* section rather than its procedure. The procedure is 400 lines of relay setup that has no analogue in a local CLI, and the 14-line standards section at the top is the only part that transfers — and it carries the single strongest 014 finding in the packet. (iteration 8)
- reading each unread repo's *entry point* rather than its source. Five repos, five top-level listings and five READMEs, and the two highest-value findings in the run came from a 45-line README and a 56-line JSON file. A repo's entry point states what its authors thought was worth proving. (iteration 9)
- reading the reference's *own reversal note*. `approvals.md` records that it once shipped exactly the plan's two-answer model and reversed it, with the pull request and the reason. That single paragraph is worth more than any amount of code reading, because it is a design decision with its outcome attached. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- searching OpenBot for the plan's own vocabulary (`ladder`, `rung`) returned nothing, because the vocabulary is the plan's invention. Searching for the mechanism (`offersStandingRule`, `DECISION_TOOLS`, `ApprovalGrants2`) found it immediately. (iteration 1)
- reading the vendor `README.md` files one at a time gave a purpose per crate but no ranking signal, because a README states what a crate is and never what it costs. The Rust file and line counts are what made the ranking possible. (iteration 2)
- iteration 1 inferred an echo risk from a `<detail>` placeholder in a contract table without reading the design file that fills it. The contract names the refusal; the design file fixes the string. Reading the contract alone produced a wrong finding. (iteration 3)
- my first three candidate findings for 002 — a missing `does` key, a missing check-in cap, a missing `until` — were all wrong, and reading the plan's REQ table refuted each in one line. The plan is more complete than a reference-first read suggests. (iteration 4)
- searching `OpenBot-main/docs/` for a memory document returned nothing, because the reference has no memory doc; its memory surface is a settings type and an automatic-learning doc. The search cost one call and taught the shape of the repo. (iteration 5)
- the first pass at 010 looked for a conversation file format in the reference and found none, because the reference stores a thread on the server and the plan stores a file. The mismatch cost a call and produced finding 6. (iteration 6)
- the first pass at 013 looked for a doc-alignment mechanism in `buzz-main/docs/` and found 70 flat files with no index, because the reference has no alignment tooling at all. The value was in the artifacts the discipline produced — the symlink, the glossary, the `deny.toml` — not in a tool. (iteration 7)
- the first pass looked for a manual-testing corpus in the reference and found a runbook instead, because the reference has no operator scenario table. The value was in the runbook's *warnings* — the silent failure and the destructive command — not in its steps. (iteration 8)
- the first pass at `rakazo-main` and `OpenMausBot-main` looked for feature code and found 6,365 and 9,637 files of a product the skip list already excludes. The transferable part was one directory in each, and finding it needed the top-level listing rather than a search. (iteration 9)
- the first pass at 003 looked for a layout difference and found none, because the plan's 003 already follows openhuman-tui's layout and lists the demo, bench and theme surfaces out of scope. The value was in the one module the plan has no analogue for, `crash_reporting.rs`, which is not a layout at all. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`buzz-main/PLANS/` as a source.** It holds two files, `ANDROID_PUSH.md` and `REPLICA_FULL_READ_ROUTING_DESIGN.md`, both about a mobile and a relay design with no analogue in a local CLI. Read once, not again. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **`buzz-main/PLANS/` as a source.** It holds two files, `ANDROID_PUSH.md` and `REPLICA_FULL_READ_ROUTING_DESIGN.md`, both about a mobile and a relay design with no analogue in a local CLI. Read once, not again.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`buzz-main/PLANS/` as a source.** It holds two files, `ANDROID_PUSH.md` and `REPLICA_FULL_READ_ROUTING_DESIGN.md`, both about a mobile and a relay design with no analogue in a local CLI. Read once, not again.

### **`OpenGhost-main`'s layout as anything but a caution.** Recorded as finding 9. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **`OpenGhost-main`'s layout as anything but a caution.** Recorded as finding 9.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`OpenGhost-main`'s layout as anything but a caution.** Recorded as finding 9.

### **`OpenMausBot-main/enterprise/` and `connector/`.** Both are covered by the section-13 skip list's enterprise-roles and connector-catalogue rows, so they are cited and not repeated. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:88-95] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **`OpenMausBot-main/enterprise/` and `connector/`.** Both are covered by the section-13 skip list's enterprise-roles and connector-catalogue rows, so they are cited and not repeated. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:88-95]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`OpenMausBot-main/enterprise/` and `connector/`.** Both are covered by the section-13 skip list's enterprise-roles and connector-catalogue rows, so they are cited and not repeated. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:88-95]

### **`rakazo-main` and `OpenMausBot-main` for 008.** Iteration 1 read rakazo's secret store and iteration 3 read the plan's fail-closed surfaces; nothing new was found in either this iteration, so 008 is closed on those two. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **`rakazo-main` and `OpenMausBot-main` for 008.** Iteration 1 read rakazo's secret store and iteration 3 read the plan's fail-closed surfaces; nothing new was found in either this iteration, so 008 is closed on those two.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`rakazo-main` and `OpenMausBot-main` for 008.** Iteration 1 read rakazo's secret store and iteration 3 read the plan's fail-closed surfaces; nothing new was found in either this iteration, so 008 is closed on those two.

### **`rakazo-main`'s i18n as a lift.** The plan writes English docs for one team. Recorded as finding 8. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **`rakazo-main`'s i18n as a lift.** The plan writes English docs for one team. Recorded as finding 8.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`rakazo-main`'s i18n as a lift.** The plan writes English docs for one team. Recorded as finding 8.

### **`turnstone-main/HYPOTHESIS.md` as a rule source.** It is a formal definition, not a rule set, and the one rule it yields — split parse failure from authorization rejection — the plan already follows. Recorded as finding 6. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **`turnstone-main/HYPOTHESIS.md` as a rule source.** It is a formal definition, not a rule set, and the one rule it yields — split parse failure from authorization rejection — the plan already follows. Recorded as finding 6.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`turnstone-main/HYPOTHESIS.md` as a rule source.** It is a formal definition, not a rule set, and the one rule it yields — split parse failure from authorization rejection — the plan already follows. Recorded as finding 6.

### **A "never only a reaction" rule for 010.** The plan has no reactions and already refuses a blank line. Recorded as finding 9. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A "never only a reaction" rule for 010.** The plan has no reactions and already refuses a blank line. Recorded as finding 9.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A "never only a reaction" rule for 010.** The plan has no reactions and already refuses a blank line. Recorded as finding 9.

### **A `chat_approvals` capability flag for 011.** The plan's `buttons` and `numberedReply` keys are the same gate at finer grain. Recorded as finding 5. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A `chat_approvals` capability flag for 011.** The plan's `buttons` and `numberedReply` keys are the same gate at finer grain. Recorded as finding 5.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A `chat_approvals` capability flag for 011.** The plan's `buttons` and `numberedReply` keys are the same gate at finer grain. Recorded as finding 5.

### **A generated-UI surface for 007.** The plan has none, so the reference's sandbox rule is recorded and not lifted. Recorded as finding 8. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **A generated-UI surface for 007.** The plan has none, so the reference's sandbox rule is recorded and not lifted. Recorded as finding 8.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A generated-UI surface for 007.** The plan has none, so the reference's sandbox rule is recorded and not lifted. Recorded as finding 8.

### **A hosted relay for 011.** The plan already lists "A hosted relay or a web UI" as out of scope, citing the 001 synthesis. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:103] Not repeated. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A hosted relay for 011.** The plan already lists "A hosted relay or a web UI" as out of scope, citing the 001 synthesis. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:103] Not repeated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A hosted relay for 011.** The plan already lists "A hosted relay or a web UI" as out of scope, citing the 001 synthesis. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:103] Not repeated.

### **A keyword classifier for 006.** The plan owns its tools and a declaration is the stronger mechanism; the gap is only for a tool it does not own. Recorded as finding 5. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **A keyword classifier for 006.** The plan owns its tools and a declaration is the stronger mechanism; the gap is only for a tool it does not own. Recorded as finding 5.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A keyword classifier for 006.** The plan owns its tools and a declaration is the stronger mechanism; the gap is only for a tool it does not own. Recorded as finding 5.

### **A missing `does` key in 002.** The plan has `does: act|tell` at REQ-003 and refuses `tell` beside `delivery`. The reference's "Does" is already covered. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A missing `does` key in 002.** The plan has `does: act|tell` at REQ-003 and refuses `tell` beside `delivery`. The reference's "Does" is already covered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing `does` key in 002.** The plan has `does: act|tell` at REQ-003 and refuses `tell` beside `delivery`. The reference's "Does" is already covered.

### **A missing `until` outcome.** The plan's `until` plus `until_check` is stronger than the reference's prose outcome. Recorded as finding 7. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A missing `until` outcome.** The plan's `until` plus `until_check` is stronger than the reference's prose outcome. Recorded as finding 7.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing `until` outcome.** The plan's `until` plus `until_check` is stronger than the reference's prose outcome. Recorded as finding 7.

### **A missing check-in cap as an oversight.** The plan states the deferral at spec.md:120. It is a recorded non-goal, not a gap; finding 5 records only the residual size. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A missing check-in cap as an oversight.** The plan states the deferral at spec.md:120. It is a recorded non-goal, not a gap; finding 5 records only the residual size.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing check-in cap as an oversight.** The plan states the deferral at spec.md:120. It is a recorded non-goal, not a gap; finding 5 records only the residual size.

### **A normalisation bypass in the `apps:` filter.** The match is exact, case-sensitive, prefix-distinct and fail-closed by default. Recorded as finding 1. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A normalisation bypass in the `apps:` filter.** The match is exact, case-sensitive, prefix-distinct and fail-closed by default. Recorded as finding 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A normalisation bypass in the `apps:` filter.** The match is exact, case-sensitive, prefix-distinct and fail-closed by default. Recorded as finding 1.

### **A numbered copy-paste runbook for 012 in place of the scenario table.** The plan's corpus is 25 or more scenarios across ten categories; a numbered procedure does not scale past the first run. Recorded as finding 7, with the reference's shape kept for the opening section. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **A numbered copy-paste runbook for 012 in place of the scenario table.** The plan's corpus is 25 or more scenarios across ten categories; a numbered procedure does not scale past the first run. Recorded as finding 7, with the reference's shape kept for the opening section.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A numbered copy-paste runbook for 012 in place of the scenario table.** The plan's corpus is 25 or more scenarios across ten categories; a numbered procedure does not scale past the first run. Recorded as finding 7, with the reference's shape kept for the opening section.

### **A post-hoc mining pass for 014.** The plan seeds every review-input row before any lineage spawns, which is the stronger ordering. Recorded as finding 4. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **A post-hoc mining pass for 014.** The plan seeds every review-input row before any lineage spawns, which is the stronger ordering. Recorded as finding 4.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A post-hoc mining pass for 014.** The plan seeds every review-input row before any lineage spawns, which is the stronger ordering. Recorded as finding 4.

### **A rules store, an auto-review switch or an extra-vigilant switch for 006.** The plan's scope boundary defers all three and the deferral is right; only the conversation scope is in reach. Recorded as finding 1. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **A rules store, an auto-review switch or an extra-vigilant switch for 006.** The plan's scope boundary defers all three and the deferral is right; only the conversation scope is in reach. Recorded as finding 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A rules store, an auto-review switch or an extra-vigilant switch for 006.** The plan's scope boundary defers all three and the deferral is right; only the conversation scope is in reach. Recorded as finding 1.

### **A scope-precedence ladder for 009.** The plan has one tree and one name; the reference's five roots are a multi-root product's problem. Recorded as finding 4. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A scope-precedence ladder for 009.** The plan has one tree and one name; the reference's five roots are a multi-root product's problem. Recorded as finding 4.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A scope-precedence ladder for 009.** The plan has one tree and one name; the reference's five roots are a multi-root product's problem. Recorded as finding 4.

### **A standing-answer hole in the routine layer.** The plan refuses `--scope always` outright, so there is no standing answer to save. Recorded as finding 4. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A standing-answer hole in the routine layer.** The plan refuses `--scope always` outright, so there is no standing answer to save. Recorded as finding 4.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A standing-answer hole in the routine layer.** The plan refuses `--scope always` outright, so there is no standing answer to save. Recorded as finding 4.

### **A task-thread handoff for 010.** The plan's conversation is the run and its Problem Statement already names the limit. Recorded as finding 6. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A task-thread handoff for 010.** The plan's conversation is the run and its Problem Statement already names the limit. Recorded as finding 6.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A task-thread handoff for 010.** The plan's conversation is the run and its Problem Statement already names the limit. Recorded as finding 6.

### **A three-mode durability negotiation for 011.** The plan owns all five transports, so a mode it never selects is a branch no test reaches. Recorded as finding 1, with the reference's conformance-coverage rule kept. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A three-mode durability negotiation for 011.** The plan owns all five transports, so a mode it never selects is a branch no test reaches. Recorded as finding 1, with the reference's conformance-coverage rule kept.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A three-mode durability negotiation for 011.** The plan owns all five transports, so a mode it never selects is a branch no test reaches. Recorded as finding 1, with the reference's conformance-coverage rule kept.

### **A three-state `memory` key as a gap.** The plan's boolean is right for a file with no inheritance chain. Recorded as finding 7 with the condition that would change it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A three-state `memory` key as a gap.** The plan's boolean is right for a file with no inheritance chain. Recorded as finding 7 with the condition that would change it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A three-state `memory` key as a gap.** The plan's boolean is right for a file with no inheritance chain. Recorded as finding 7 with the condition that would change it.

### **An echo risk in `secret-store-unreadable`.** The detail is a fixed phrase per cause. Iteration 1's finding 7 is corrected by finding 5. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **An echo risk in `secret-store-unreadable`.** The detail is a fixed phrase per cause. Iteration 1's finding 7 is corrected by finding 5.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An echo risk in `secret-store-unreadable`.** The detail is a fixed phrase per cause. Iteration 1's finding 7 is corrected by finding 5.

### **Deriving the ladder from a `ladder` or `rung` identifier in OpenBot.** A search for both terms across the TypeScript and Markdown returns nothing; the ladder is the plan's own framing of the documented order, not an OpenBot symbol. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Deriving the ladder from a `ladder` or `rung` identifier in OpenBot.** A search for both terms across the TypeScript and Markdown returns nothing; the ladder is the plan's own framing of the documented order, not an OpenBot symbol.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Deriving the ladder from a `ladder` or `rung` identifier in OpenBot.** A search for both terms across the TypeScript and Markdown returns nothing; the ladder is the plan's own framing of the documented order, not an OpenBot symbol.

### **Porting tinymemory's engine or namespace tree into 005.** The plan's two files and one bound are the right size; the reference's three crates and a namespace tree are not. Recorded as finding 4. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Porting tinymemory's engine or namespace tree into 005.** The plan's two files and one bound are the right size; the reference's three crates and a namespace tree are not. Recorded as finding 4.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Porting tinymemory's engine or namespace tree into 005.** The plan's two files and one bound are the right size; the reference's three crates and a namespace tree are not. Recorded as finding 4.

### **Ranking `tinyvoice`, `tinyjuice`, `tinysearch` and `tinystoragedrivers` as candidates.** Voice (1,937 files), juice (2,158 files), web search (232 files) and storage drivers (330 files) each solve a problem the plan does not have: a terminal client, a model gateway, a UTCP-named search server and a SQLite index. Named here so a later iteration does not re-open them. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Ranking `tinyvoice`, `tinyjuice`, `tinysearch` and `tinystoragedrivers` as candidates.** Voice (1,937 files), juice (2,158 files), web search (232 files) and storage drivers (330 files) each solve a problem the plan does not have: a terminal client, a model gateway, a UTCP-named search server and a SQLite index. Named here so a later iteration does not re-open them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Ranking `tinyvoice`, `tinyjuice`, `tinysearch` and `tinystoragedrivers` as candidates.** Voice (1,937 files), juice (2,158 files), web search (232 files) and storage drivers (330 files) each solve a problem the plan does not have: a terminal client, a model gateway, a UTCP-named search server and a SQLite index. Named here so a later iteration does not re-open them.

### **Reading `computer-control.ts` as 004's reference implementation.** The plan excludes the browser computer; the file is a handoff state machine for a page the plan does not have. Recorded as finding 1. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Reading `computer-control.ts` as 004's reference implementation.** The plan excludes the browser computer; the file is a handoff state machine for a page the plan does not have. Recorded as finding 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `computer-control.ts` as 004's reference implementation.** The plan excludes the browser computer; the file is a handoff state machine for a page the plan does not have. Recorded as finding 1.

### **Reading `openhuman-full` for anything but `vendor/`.** The per-directory counts are identical to `openhuman-main`, so a second read of `crates/`, `app/` or `docs/` in the full tree returns the same bytes. Recorded as finding 2. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Reading `openhuman-full` for anything but `vendor/`.** The per-directory counts are identical to `openhuman-main`, so a second read of `crates/`, `app/` or `docs/` in the full tree returns the same bytes. Recorded as finding 2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `openhuman-full` for anything but `vendor/`.** The per-directory counts are identical to `openhuman-main`, so a second read of `crates/`, `app/` or `docs/` in the full tree returns the same bytes. Recorded as finding 2.

### **Reading the OpenBot approval engine from code.** `server/src/approvals/` is absent from the snapshot; only the shared declarations and `docs/approvals.md` survive. Recorded as finding 13 rather than retried. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Reading the OpenBot approval engine from code.** `server/src/approvals/` is absent from the snapshot; only the shared declarations and `docs/approvals.md` survive. Recorded as finding 13 rather than retried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading the OpenBot approval engine from code.** `server/src/approvals/` is absent from the snapshot; only the shared declarations and `docs/approvals.md` survive. Recorded as finding 13 rather than retried.

### **Treating the vendor tree as a lift source.** All twenty-one crates are GPL-3.0. Recorded as finding 4. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Treating the vendor tree as a lift source.** All twenty-one crates are GPL-3.0. Recorded as finding 4.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the vendor tree as a lift source.** All twenty-one crates are GPL-3.0. Recorded as finding 4.

### **Treating tinysecurity as a lift source.** GPL-3.0 rules it out for a build that ships Apache-2.0 and MIT notices. Its contract text is still the best statement of the grant precedence rules, so it is cited as design evidence only. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Treating tinysecurity as a lift source.** GPL-3.0 rules it out for a build that ships Apache-2.0 and MIT notices. Its contract text is still the best statement of the grant precedence rules, so it is cited as design evidence only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating tinysecurity as a lift source.** GPL-3.0 rules it out for a build that ships Apache-2.0 and MIT notices. Its contract text is still the best statement of the grant precedence rules, so it is cited as design evidence only.

### `buzz-main/ARCHITECTURE.md` and `docs/` for 014's review method — the reference reviews through pull requests and a changelog generator, not through a review phase. The method is in `TESTING.md` and `AGENTS.md`, not in the architecture. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `buzz-main/ARCHITECTURE.md` and `docs/` for 014's review method — the reference reviews through pull requests and a changelog generator, not through a review phase. The method is in `TESTING.md` and `AGENTS.md`, not in the architecture.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `buzz-main/ARCHITECTURE.md` and `docs/` for 014's review method — the reference reviews through pull requests and a changelog generator, not through a review phase. The method is in `TESTING.md` and `AGENTS.md`, not in the architecture.

### `buzz-main/ARCHITECTURE.md` as a source for any 003 phase — it is a 991-line Nostr relay architecture with no analogue in a local CLI. Read once for the documentation discipline, not again. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `buzz-main/ARCHITECTURE.md` as a source for any 003 phase — it is a 991-line Nostr relay architecture with no analogue in a local CLI. Read once for the documentation discipline, not again.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `buzz-main/ARCHITECTURE.md` as a source for any 003 phase — it is a 991-line Nostr relay architecture with no analogue in a local CLI. Read once for the documentation discipline, not again.

### `buzz-main/docs/` as a source for 013's doc-alignment mechanism — it is 70 flat files with no topic or term index, which is the failure mode the plan's `terms` list fixes. Do not read it again for a scoping pattern. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `buzz-main/docs/` as a source for 013's doc-alignment mechanism — it is 70 flat files with no topic or term index, which is the failure mode the plan's `terms` list fixes. Do not read it again for a scoping pattern.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `buzz-main/docs/` as a source for 013's doc-alignment mechanism — it is 70 flat files with no topic or term index, which is the failure mode the plan's `terms` list fixes. Do not read it again for a scoping pattern.

### `buzz-main/lefthook.yml` and `ct.yaml` as a review gate — they are pre-commit and chart-testing hooks, and the plan's gate is `validate.sh` plus the suite. No finding. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `buzz-main/lefthook.yml` and `ct.yaml` as a review gate — they are pre-commit and chart-testing hooks, and the plan's gate is `validate.sh` plus the suite. No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `buzz-main/lefthook.yml` and `ct.yaml` as a review gate — they are pre-commit and chart-testing hooks, and the plan's gate is `validate.sh` plus the suite. No finding.

### `contracts/refusals.md` section 3.7 as the place a detail string is fixed — the design files own the detail, the contract owns the name and the exit. Do not read the contract for a detail again. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `contracts/refusals.md` section 3.7 as the place a detail string is fixed — the design files own the detail, the contract owns the name and the exit. Do not read the contract for a detail again.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `contracts/refusals.md` section 3.7 as the place a detail string is fixed — the design files own the detail, the contract owns the name and the exit. Do not read the contract for a detail again.

### `hermes-muse-main` beyond `plugin.yaml` — 125 files of a companion plugin whose goals and notices the plan's 002 and 010 already cover. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `hermes-muse-main` beyond `plugin.yaml` — 125 files of a companion plugin whose goals and notices the plan's 002 and 010 already cover.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `hermes-muse-main` beyond `plugin.yaml` — 125 files of a companion plugin whose goals and notices the plan's 002 and 010 already cover.

### `OpenBot-main/docs/` has no memory document; the memory surface is `shared/learning.ts` and `docs/automatic-learning.md`. Do not look for `docs/memory.md`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `OpenBot-main/docs/` has no memory document; the memory surface is `shared/learning.ts` and `docs/automatic-learning.md`. Do not look for `docs/memory.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `OpenBot-main/docs/` has no memory document; the memory surface is `shared/learning.ts` and `docs/automatic-learning.md`. Do not look for `docs/memory.md`.

### `OpenBot-main/docs/approvals.md` beyond line 60 — the rest is the admin settings table and the audit-trail description, both of which the plan's 006 defers by scope boundary. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `OpenBot-main/docs/approvals.md` beyond line 60 — the rest is the admin settings table and the audit-trail description, both of which the plan's 006 defers by scope boundary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `OpenBot-main/docs/approvals.md` beyond line 60 — the rest is the admin settings table and the audit-trail description, both of which the plan's 006 defers by scope boundary.

### `OpenBot-main/docs/routines.md` as a source for the routine *file* shape — the reference has no file, only a store. Do not read it again for a schema. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `OpenBot-main/docs/routines.md` as a source for the routine *file* shape — the reference has no file, only a store. Do not read it again for a schema.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `OpenBot-main/docs/routines.md` as a source for the routine *file* shape — the reference has no file, only a store. Do not read it again for a schema.

### `OpenBot-main/server/` — does not exist. Do not cite it again in a later iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `OpenBot-main/server/` — does not exist. Do not cite it again in a later iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `OpenBot-main/server/` — does not exist. Do not cite it again in a later iteration.

### `OpenBot-main/shared/activity-rows.ts` as a source for the seven group ids — it carries exclusions and dedupe, not the groups. The groups are in `app/src/lib/bot-lifecycle/activity-groups.ts`, which the parity synthesis already cites. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `OpenBot-main/shared/activity-rows.ts` as a source for the seven group ids — it carries exclusions and dedupe, not the groups. The groups are in `app/src/lib/bot-lifecycle/activity-groups.ts`, which the parity synthesis already cites.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `OpenBot-main/shared/activity-rows.ts` as a source for the seven group ids — it carries exclusions and dedupe, not the groups. The groups are in `app/src/lib/bot-lifecycle/activity-groups.ts`, which the parity synthesis already cites.

### `OpenBot-main/shared/computer-control.ts` as a source for the plan's working-place line — the two share only the word "computer". -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `OpenBot-main/shared/computer-control.ts` as a source for the plan's working-place line — the two share only the word "computer".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `OpenBot-main/shared/computer-control.ts` as a source for the plan's working-place line — the two share only the word "computer".

### `OpenBot-main/shared/orchestration.ts` as a source for the plan's conversation file format — the reference has no file, only tools and a thread. Do not read it again for a record shape. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `OpenBot-main/shared/orchestration.ts` as a source for the plan's conversation file format — the reference has no file, only tools and a thread. Do not read it again for a record shape.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `OpenBot-main/shared/orchestration.ts` as a source for the plan's conversation file format — the reference has no file, only tools and a thread. Do not read it again for a record shape.

### `OpenBot-main/shared/tool-name.ts` as a filter reference — it is a display module, not a filter. Do not read it again for 007's match rule. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `OpenBot-main/shared/tool-name.ts` as a filter reference — it is a display module, not a filter. Do not read it again for 007's match rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `OpenBot-main/shared/tool-name.ts` as a filter reference — it is a display module, not a filter. Do not read it again for 007's match rule.

### `openhuman-main/vendor/` — does not exist. Do not look for the vendor tree in the `-main` tree again. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `openhuman-main/vendor/` — does not exist. Do not look for the vendor tree in the `-main` tree again.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `openhuman-main/vendor/` — does not exist. Do not look for the vendor tree in the `-main` tree again.

### `openhuman-tui`'s `cockpit.rs`, `browser_login.rs` and `demo.rs` — three surfaces the plan's 003 lists out of scope by name, so reading them again would repeat a decision the plan already made. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `openhuman-tui`'s `cockpit.rs`, `browser_login.rs` and `demo.rs` — three surfaces the plan's 003 lists out of scope by name, so reading them again would repeat a decision the plan already made.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `openhuman-tui`'s `cockpit.rs`, `browser_login.rs` and `demo.rs` — three surfaces the plan's 003 lists out of scope by name, so reading them again would repeat a decision the plan already made.

### `OpenMausBot-main` beyond `evals/` — 9,637 files of a desktop and cloud product whose desktop and cloud surfaces the plan excludes. `evals/` is the one transferable part. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `OpenMausBot-main` beyond `evals/` — 9,637 files of a desktop and cloud product whose desktop and cloud surfaces the plan excludes. `evals/` is the one transferable part.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `OpenMausBot-main` beyond `evals/` — 9,637 files of a desktop and cloud product whose desktop and cloud surfaces the plan excludes. `evals/` is the one transferable part.

### `rakazo-main` beyond its licence and its README set — 6,365 files of a multi-tenant web app whose tenancy the skip list already excludes. Do not read it again. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `rakazo-main` beyond its licence and its README set — 6,365 files of a multi-tenant web app whose tenancy the skip list already excludes. Do not read it again.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `rakazo-main` beyond its licence and its README set — 6,365 files of a multi-tenant web app whose tenancy the skip list already excludes. Do not read it again.

### `rg "ladder|rung"` over `OpenBot-main` — no hits. The plan's four-rung vocabulary has no counterpart in the reference and must not be presented as lifted. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `rg "ladder|rung"` over `OpenBot-main` — no hits. The plan's four-rung vocabulary has no counterpart in the reference and must not be presented as lifted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `rg "ladder|rung"` over `OpenBot-main` — no hits. The plan's four-rung vocabulary has no counterpart in the reference and must not be presented as lifted.

### `tinyskills` as a source for the plan's `skills:` list shape — the reference discovers bundles, the plan names them. Do not read it again for a list schema. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `tinyskills` as a source for the plan's `skills:` list shape — the reference discovers bundles, the plan names them. Do not read it again for a list schema.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `tinyskills` as a source for the plan's `skills:` list shape — the reference discovers bundles, the plan names them. Do not read it again for a list schema.

### The topic's "five vendored crates" — a subset of twenty-one. Do not carry the number forward into the synthesis. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The topic's "five vendored crates" — a subset of twenty-one. Do not carry the number forward into the synthesis.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The topic's "five vendored crates" — a subset of twenty-one. Do not carry the number forward into the synthesis.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Deriving the ladder from a `ladder` or `rung` identifier in OpenBot.** A search for both terms across the TypeScript and Markdown returns nothing; the ladder is the plan's own framing of the documented order, not an OpenBot symbol. (iteration 1)
- **Reading the OpenBot approval engine from code.** `server/src/approvals/` is absent from the snapshot; only the shared declarations and `docs/approvals.md` survive. Recorded as finding 13 rather than retried. (iteration 1)
- **Treating tinysecurity as a lift source.** GPL-3.0 rules it out for a build that ships Apache-2.0 and MIT notices. Its contract text is still the best statement of the grant precedence rules, so it is cited as design evidence only. (iteration 1)
- `OpenBot-main/server/` — does not exist. Do not cite it again in a later iteration. (iteration 1)
- `rg "ladder|rung"` over `OpenBot-main` — no hits. The plan's four-rung vocabulary has no counterpart in the reference and must not be presented as lifted. (iteration 1)
- **Ranking `tinyvoice`, `tinyjuice`, `tinysearch` and `tinystoragedrivers` as candidates.** Voice (1,937 files), juice (2,158 files), web search (232 files) and storage drivers (330 files) each solve a problem the plan does not have: a terminal client, a model gateway, a UTCP-named search server and a SQLite index. Named here so a later iteration does not re-open them. (iteration 2)
- **Reading `openhuman-full` for anything but `vendor/`.** The per-directory counts are identical to `openhuman-main`, so a second read of `crates/`, `app/` or `docs/` in the full tree returns the same bytes. Recorded as finding 2. (iteration 2)
- **Treating the vendor tree as a lift source.** All twenty-one crates are GPL-3.0. Recorded as finding 4. (iteration 2)
- `openhuman-main/vendor/` — does not exist. Do not look for the vendor tree in the `-main` tree again. (iteration 2)
- The topic's "five vendored crates" — a subset of twenty-one. Do not carry the number forward into the synthesis. (iteration 2)
- **A normalisation bypass in the `apps:` filter.** The match is exact, case-sensitive, prefix-distinct and fail-closed by default. Recorded as finding 1. (iteration 3)
- **A standing-answer hole in the routine layer.** The plan refuses `--scope always` outright, so there is no standing answer to save. Recorded as finding 4. (iteration 3)
- **An echo risk in `secret-store-unreadable`.** The detail is a fixed phrase per cause. Iteration 1's finding 7 is corrected by finding 5. (iteration 3)
- `contracts/refusals.md` section 3.7 as the place a detail string is fixed — the design files own the detail, the contract owns the name and the exit. Do not read the contract for a detail again. (iteration 3)
- `OpenBot-main/shared/tool-name.ts` as a filter reference — it is a display module, not a filter. Do not read it again for 007's match rule. (iteration 3)
- **A missing `does` key in 002.** The plan has `does: act|tell` at REQ-003 and refuses `tell` beside `delivery`. The reference's "Does" is already covered. (iteration 4)
- **A missing `until` outcome.** The plan's `until` plus `until_check` is stronger than the reference's prose outcome. Recorded as finding 7. (iteration 4)
- **A missing check-in cap as an oversight.** The plan states the deferral at spec.md:120. It is a recorded non-goal, not a gap; finding 5 records only the residual size. (iteration 4)
- `OpenBot-main/docs/routines.md` as a source for the routine *file* shape — the reference has no file, only a store. Do not read it again for a schema. (iteration 4)
- `OpenBot-main/shared/activity-rows.ts` as a source for the seven group ids — it carries exclusions and dedupe, not the groups. The groups are in `app/src/lib/bot-lifecycle/activity-groups.ts`, which the parity synthesis already cites. (iteration 4)
- **A three-state `memory` key as a gap.** The plan's boolean is right for a file with no inheritance chain. Recorded as finding 7 with the condition that would change it. (iteration 5)
- **Porting tinymemory's engine or namespace tree into 005.** The plan's two files and one bound are the right size; the reference's three crates and a namespace tree are not. Recorded as finding 4. (iteration 5)
- **Reading `computer-control.ts` as 004's reference implementation.** The plan excludes the browser computer; the file is a handoff state machine for a page the plan does not have. Recorded as finding 1. (iteration 5)
- `OpenBot-main/docs/` has no memory document; the memory surface is `shared/learning.ts` and `docs/automatic-learning.md`. Do not look for `docs/memory.md`. (iteration 5)
- `OpenBot-main/shared/computer-control.ts` as a source for the plan's working-place line — the two share only the word "computer". (iteration 5)
- **A "never only a reaction" rule for 010.** The plan has no reactions and already refuses a blank line. Recorded as finding 9. (iteration 6)
- **A scope-precedence ladder for 009.** The plan has one tree and one name; the reference's five roots are a multi-root product's problem. Recorded as finding 4. (iteration 6)
- **A task-thread handoff for 010.** The plan's conversation is the run and its Problem Statement already names the limit. Recorded as finding 6. (iteration 6)
- `OpenBot-main/shared/orchestration.ts` as a source for the plan's conversation file format — the reference has no file, only tools and a thread. Do not read it again for a record shape. (iteration 6)
- `tinyskills` as a source for the plan's `skills:` list shape — the reference discovers bundles, the plan names them. Do not read it again for a list schema. (iteration 6)
- **A `chat_approvals` capability flag for 011.** The plan's `buttons` and `numberedReply` keys are the same gate at finer grain. Recorded as finding 5. (iteration 7)
- **A hosted relay for 011.** The plan already lists "A hosted relay or a web UI" as out of scope, citing the 001 synthesis. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:103] Not repeated. (iteration 7)
- **A three-mode durability negotiation for 011.** The plan owns all five transports, so a mode it never selects is a branch no test reaches. Recorded as finding 1, with the reference's conformance-coverage rule kept. (iteration 7)
- `buzz-main/ARCHITECTURE.md` as a source for any 003 phase — it is a 991-line Nostr relay architecture with no analogue in a local CLI. Read once for the documentation discipline, not again. (iteration 7)
- `buzz-main/docs/` as a source for 013's doc-alignment mechanism — it is 70 flat files with no topic or term index, which is the failure mode the plan's `terms` list fixes. Do not read it again for a scoping pattern. (iteration 7)
- **`buzz-main/PLANS/` as a source.** It holds two files, `ANDROID_PUSH.md` and `REPLICA_FULL_READ_ROUTING_DESIGN.md`, both about a mobile and a relay design with no analogue in a local CLI. Read once, not again. (iteration 8)
- **A numbered copy-paste runbook for 012 in place of the scenario table.** The plan's corpus is 25 or more scenarios across ten categories; a numbered procedure does not scale past the first run. Recorded as finding 7, with the reference's shape kept for the opening section. (iteration 8)
- **A post-hoc mining pass for 014.** The plan seeds every review-input row before any lineage spawns, which is the stronger ordering. Recorded as finding 4. (iteration 8)
- `buzz-main/ARCHITECTURE.md` and `docs/` for 014's review method — the reference reviews through pull requests and a changelog generator, not through a review phase. The method is in `TESTING.md` and `AGENTS.md`, not in the architecture. (iteration 8)
- `buzz-main/lefthook.yml` and `ct.yaml` as a review gate — they are pre-commit and chart-testing hooks, and the plan's gate is `validate.sh` plus the suite. No finding. (iteration 8)
- **`OpenGhost-main`'s layout as anything but a caution.** Recorded as finding 9. (iteration 9)
- **`OpenMausBot-main/enterprise/` and `connector/`.** Both are covered by the section-13 skip list's enterprise-roles and connector-catalogue rows, so they are cited and not repeated. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:88-95] (iteration 9)
- **`rakazo-main`'s i18n as a lift.** The plan writes English docs for one team. Recorded as finding 8. (iteration 9)
- **`turnstone-main/HYPOTHESIS.md` as a rule source.** It is a formal definition, not a rule set, and the one rule it yields — split parse failure from authorization rejection — the plan already follows. Recorded as finding 6. (iteration 9)
- `hermes-muse-main` beyond `plugin.yaml` — 125 files of a companion plugin whose goals and notices the plan's 002 and 010 already cover. (iteration 9)
- `OpenMausBot-main` beyond `evals/` — 9,637 files of a desktop and cloud product whose desktop and cloud surfaces the plan excludes. `evals/` is the one transferable part. (iteration 9)
- `rakazo-main` beyond its licence and its README set — 6,365 files of a multi-tenant web app whose tenancy the skip list already excludes. Do not read it again. (iteration 9)
- **`rakazo-main` and `OpenMausBot-main` for 008.** Iteration 1 read rakazo's secret store and iteration 3 read the plan's fail-closed surfaces; nothing new was found in either this iteration, so 008 is closed on those two. (iteration 10)
- **A generated-UI surface for 007.** The plan has none, so the reference's sandbox rule is recorded and not lifted. Recorded as finding 8. (iteration 10)
- **A keyword classifier for 006.** The plan owns its tools and a declaration is the stronger mechanism; the gap is only for a tool it does not own. Recorded as finding 5. (iteration 10)
- **A rules store, an auto-review switch or an extra-vigilant switch for 006.** The plan's scope boundary defers all three and the deferral is right; only the conversation scope is in reach. Recorded as finding 1. (iteration 10)
- `OpenBot-main/docs/approvals.md` beyond line 60 — the rest is the admin settings table and the audit-trail description, both of which the plan's 006 defers by scope boundary. (iteration 10)
- `openhuman-tui`'s `cockpit.rs`, `browser_login.rs` and `demo.rs` — three surfaces the plan's 003 lists out of scope by name, so reading them again would repeat a decision the plan already made. (iteration 10)

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
Frontier node F-1-006 (depth 1, scope specs/system-skilled-bots/context, specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios, specs/system-skilled-bots/003-openbot-parity-build/014-deep-review, specs/system-skilled-bots/context/buzz-main): Net-new and operations: what do the ten reference repos have that neither the 003 build plan nor the skip list of the parity synthesis covers, ranked by value to a small team, and which test corpora, failure-handling patterns and upgrade paths in those repos should feed phases 012-manual-testing-scenarios, 013-skilled-and-doc-alignment and 014-deep-review?

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
None

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
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue` through `--extend=N` and `--extend-minutes=M` (live)
- Deferred lifecycle branch: `fork` (not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-11-27T07:19:55.756Z
