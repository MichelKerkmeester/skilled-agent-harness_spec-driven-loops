---
title: Deep Research Strategy - Reference Evidence for the OpenBot Parity Build
description: Runtime strategy for the vibe-1 fan-out lineage of the 004 reference-evidence research run.
trigger_phrases:
  - "reference evidence research strategy"
  - "openbot parity reference evidence"
importance_tier: normal
contextType: planning
version: 1.14.3.0
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose

Persistent brain for the vibe-1 fan-out lineage. Records what to investigate, what worked, what failed, and where to focus next. Read at every iteration; machine-owned sections are rewritten by the reducer.

### Usage

- **Init:** populated from config and the lineage frontier inbox.
- **Per iteration:** the agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** mutable — analyst-owned sections stay stable, machine-owned sections are rewritten by the reducer after each iteration.

### Question Injection Surface

`research/inbox.jsonl` is the question intake. This lineage was dealt two frontier rows (F-1-001, F-1-005) by `fanout-run.cjs`, so the frontier rows are the only question intake and Section 3 carries no question lines until the reducer renders them.

---

## 2. TOPIC

Reference evidence for the OpenBot parity build of skilled bots. For each of the fourteen 003 build phases: which reference files and lines implement the same thing, what a builder should lift or mirror with the source licence, where the plan differs from how the references do it and which side the evidence supports, and which failures, tests and fixes in those repos the plan does not yet guard against. Plus net-new: what the ten reference repos have that neither the build plan nor the skip list in section 13 of the parity synthesis covers, ranked by value to a small team with size. Read `openhuman-full` first.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Human surface, phases 001-activity-and-actor and 002-routine-layer: which reference files implement an activity feed, an inbox, an actor on a record and routines with an until outcome, what should the builder lift or mirror, and which failures or fixes in those repos does the plan not guard against?
- [x] Prompt and records, phases 004-computer-exposure, 005-memory, 009-skills and 010-conversations: which reference files implement a working place named in the prompt, shared and per-bot memory with a size bound, a skill list under a cap and an append-only conversation with bot routing, and which pitfalls did those repos hit?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing any phase of the 003 build. This run produces evidence, not code.
- Repeating a finding one of the three earlier syntheses already carries. Cite the earlier finding and add only what is new.
- Editing any input: the ten reference repos, the 003 phase folders, the three earlier syntheses, and the built runtime are read-only.
- Writing outside `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1`.

---

## 5. STOP CONDITIONS

- `config.stopPolicy` is `max-iterations`: the loop runs to `maxIterations` (10) and the terminal synthesis record carries `stopReason: maxIterationsReached`. Convergence before the cap is telemetry only.
- A claim with no resolving `[SOURCE: path:line]` citation is not a finding and is not recorded.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Human surface, phases 001-activity-and-actor and 002-routine-layer: which reference files implement an activity feed, an inbox, an actor on a record and routines with an until outcome, what should the builder lift or mirror, and which failures or fixes in those repos does the plan not guard against?
- Prompt and records, phases 004-computer-exposure, 005-memory, 009-skills and 010-conversations: which reference files implement a working place named in the prompt, shared and per-bot memory with a size bound, a skill list under a cap and an append-only conversation with bot routing, and which pitfalls did those repos hit?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the reference's own comments rather than only its code. `routine-firing.ts` and `plan.ts` both carry a recorded production failure in prose beside the fix, which is the exact class of evidence the topic asks for ("which failures, tests and fixes in those repos the plan does not yet guard against") and which no earlier synthesis could reach because none read these files. (iteration 1)
- reading `openhuman-full`'s vendored `tinymemory` before the plan. Its `render.rs` overflow ladder and its single token unit are exactly the two decisions phase 005 leaves open, and neither is reachable from `openhuman-main`, which lacks the crate. The topic's instruction to read `openhuman-full` first paid for itself in one iteration. (iteration 2)
- measuring the premise before reading the code. Two `diff -rq` calls and one `find` turned the topic's central claim about `openhuman-full` into a precise statement — the vendored sources are the difference, not the TUI — which changes what every later iteration should read in that checkout. (iteration 3)
- testing the earlier synthesis's citation instead of trusting it. One `head` of `tool-name.ts` showed it is a display humaniser, which turned a reuse-table row into a correction and led straight to the real classifier in `approvals.ts`. (iteration 4)
- reading the lifted files rather than the plan's description of them. The plan says "lifted with its notice" three times, and each file holds a constant or a return shape that the description omits and that a reimplementation would get wrong. (iteration 5)
- reading the *enforcement* code rather than the type definitions. `capabilities.rs` gives the vocabulary, but `check_feature` gives the contract, and the contract is what the plan is missing. The same held for `policy.rs`: the interesting part was `is_permanent_delivery_error`, not the queue struct. (iteration 6)
- searching for *artifact-shaped files* rather than reading source. `tests.json`, `eval_skill_adherence.json` and `lint_hypothesis.py` are all top-level files whose names say what they are, and each one is the closing artifact of a phase the synthesis had written off. The lesson is that a phase about producing a document should be researched by looking for that document in the references, not by looking for the feature it documents. (iteration 7)
- reading the workspace `Cargo.toml` and the `crates/` listing before reading any source. That inventory took two calls and produced the whole ranking; reading source first would have produced detail about three crates and no map. The `//!` doc comment at the top of each `lib.rs` is the highest-value line in a Rust crate, and 21 of them fit in one call. (iteration 8)
- listing top-level directories of the six repos and looking for folders whose names are not source-code names. `evals/`, `benchmarks/`, `dashboard/` and `desktop/` are the four that paid; `apps/`, `packages/`, `crates/` and `src/` are where the phase evidence lives and where iterations 1 through 7 already went. The net-new question has a different search shape from the phase question, and it took this iteration to notice. (iteration 9)
- reading the plan's own `contracts/` folder before writing the licence table. That one read turned a confident finding into a correction, which is the right outcome — a lineage that never corrects itself is not reading carefully. The `contracts/verification.md` V9 check is also the single best thing in the plan and no earlier iteration had read it. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- searching for an `actor` counterpart in OpenBot's audit trail. The reference attributes by conversation and routine owner, so there is nothing to lift and the search cost two calls. (iteration 1)
- looking for a phase-004 counterpart in turnstone. No repo names a working directory in its prompt, so the search returned nothing and cost two calls. (iteration 2)
- looking for a second TUI implementation. `crates/` is identical between the checkouts, so the search had one possible answer and cost two calls. (iteration 3)
- looking for `approval-ladder.md` in the runtime. It is a phase-006 deliverable that has not been written, so the search could only confirm an absence. (iteration 4)
- looking for a constant-time compare in the first 55 lines of `secrets-guard.ts`. The file is 188 lines and the compare is further down; the search cost one call and added nothing. (iteration 5)
- the first pass at `adapter.rs` read only the trait method signatures and concluded the ack policy was a single setting. The enum body at `:16-22` corrected that. Reading a declaration without its definition is how a four-value choice gets flattened into a rule. (iteration 6)
- the first pass looked for test *code* (`*_test.rs`, `test_*.py`) and found hundreds of files with nothing to say about 012. The signal was in the manifests and the linters, which are not tests at all. (iteration 7)
- the first attempt looked for `src/lib.rs` at each workspace root and found nothing for 15 of 21 crates, because each vendored crate is itself a workspace with its members under `crates/`. The `find -maxdepth 3 -name lib.rs` retry found them. The lesson is that "vendored crate" here means "vendored workspace". (iteration 8)
- the first pass at `OpenMausBot-main` read `apps/` and found a product. The `evals/` folder was one line further down the listing. Alphabetical listing order is not a search strategy. (iteration 9)
- iteration 8 asserted a negative ("the plan does not state") from evidence that only covered the reference repos. A negative claim about the plan needs a read of the plan. That is the same error as the 003 synthesis's "no context repository applies" to phase 012, which iteration 7 corrected — the mistake is symmetric and this lineage made it too. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`ChannelReceiveAckPolicy` as a global setting.** The enum is per-adapter (`declared_capabilities` and `receive_ack_policy` are both trait methods with defaults), so there is no single correct ack point to write into the plan. Any plan text that names one ack rule for all transports is contradicted by the reference's own structure. Candidates for the reducer's exhausted list: "one global ack rule for phase 011". -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **`ChannelReceiveAckPolicy` as a global setting.** The enum is per-adapter (`declared_capabilities` and `receive_ack_policy` are both trait methods with defaults), so there is no single correct ack point to write into the plan. Any plan text that names one ack rule for all transports is contradicted by the reference's own structure. Candidates for the reducer's exhausted list: "one global ack rule for phase 011".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`ChannelReceiveAckPolicy` as a global setting.** The enum is per-adapter (`declared_capabilities` and `receive_ack_policy` are both trait methods with defaults), so there is no single correct ack point to write into the plan. Any plan text that names one ack rule for all transports is contradicted by the reference's own structure. Candidates for the reducer's exhausted list: "one global ack rule for phase 011".

### **A hand-maintained list of scenarios.** `buzz-db/TESTING.md`'s discovery-by-structure plus its guard script is the counter-example; a list is the thing the guard exists to avoid. Candidate for the exhausted list: "register each scenario in an index file". -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A hand-maintained list of scenarios.** `buzz-db/TESTING.md`'s discovery-by-structure plus its guard script is the counter-example; a list is the thing the guard exists to avoid. Candidate for the exhausted list: "register each scenario in an index file".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A hand-maintained list of scenarios.** `buzz-db/TESTING.md`'s discovery-by-structure plus its guard script is the counter-example; a list is the thing the guard exists to avoid. Candidate for the exhausted list: "register each scenario in an index file".

### **A per-crate licence check.** The licence is uniform across all 21 vendored workspaces, so a per-crate table adds nothing beyond F-8-1's two exceptions (`tinyflows`, `tinyhumans-sdk`, both `-or-later`). -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **A per-crate licence check.** The licence is uniform across all 21 vendored workspaces, so a per-crate table adds nothing beyond F-8-1's two exceptions (`tinyflows`, `tinyhumans-sdk`, both `-or-later`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A per-crate licence check.** The licence is uniform across all 21 vendored workspaces, so a per-crate table adds nothing beyond F-8-1's two exceptions (`tinyflows`, `tinyhumans-sdk`, both `-or-later`).

### **A per-phase licence section in each of the fourteen phase specs.** The plan already has one shared `contracts/` folder; fourteen copies of a licence rule is the drift problem `hermes-muse`'s generated-doc check exists to prevent. Candidate for the reducer's exhausted list: "per-phase licence statements". -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **A per-phase licence section in each of the fourteen phase specs.** The plan already has one shared `contracts/` folder; fourteen copies of a licence rule is the drift problem `hermes-muse`'s generated-doc check exists to prevent. Candidate for the reducer's exhausted list: "per-phase licence statements".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A per-phase licence section in each of the fourteen phase specs.** The plan already has one shared `contracts/` folder; fourteen copies of a licence rule is the drift problem `hermes-muse`'s generated-doc check exists to prevent. Candidate for the reducer's exhausted list: "per-phase licence statements".

### **A single-prompt scenario format.** `tests.json`'s `user_prompts` array of ten paraphrases makes a one-prompt scenario look under-specified by comparison. Any 012 scenario written with one prompt is contradicted by the reference's own design. Candidate for the reducer's exhausted list: "one prompt per manual scenario". -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A single-prompt scenario format.** `tests.json`'s `user_prompts` array of ten paraphrases makes a one-prompt scenario look under-specified by comparison. Any 012 scenario written with one prompt is contradicted by the reference's own design. Candidate for the reducer's exhausted list: "one prompt per manual scenario".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A single-prompt scenario format.** `tests.json`'s `user_prompts` array of ten paraphrases makes a one-prompt scenario look under-specified by comparison. Any 012 scenario written with one prompt is contradicted by the reference's own design. Candidate for the reducer's exhausted list: "one prompt per manual scenario".

### **A single-tier eval.** `OpenMausBot`'s three tiers (scripted, golden replay, opt-in live) and `buzz-dataset`'s two layers (regression k=1, workflow k=3) are independent designs that both refuse a single tier. A plan that specifies one kind of scenario test is contradicted twice. Candidate for the reducer's exhausted list: "one eval tier for phase 012". -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **A single-tier eval.** `OpenMausBot`'s three tiers (scripted, golden replay, opt-in live) and `buzz-dataset`'s two layers (regression k=1, workflow k=3) are independent designs that both refuse a single tier. A plan that specifies one kind of scenario test is contradicted twice. Candidate for the reducer's exhausted list: "one eval tier for phase 012".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A single-tier eval.** `OpenMausBot`'s three tiers (scripted, golden replay, opt-in live) and `buzz-dataset`'s two layers (regression k=1, workflow k=3) are independent designs that both refuse a single tier. A plan that specifies one kind of scenario test is contradicted twice. Candidate for the reducer's exhausted list: "one eval tier for phase 012".

### **A typed error taxonomy for permanent failures.** The reference uses substring matching on provider text. A typed taxonomy would require every transport to map its provider's errors, which is the refactor the reference avoided. Do not propose it as an improvement. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A typed error taxonomy for permanent failures.** The reference uses substring matching on provider text. A typed taxonomy would require every transport to map its provider's errors, which is the refactor the reference avoided. Do not propose it as an improvement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A typed error taxonomy for permanent failures.** The reference uses substring matching on provider text. A typed taxonomy would require every transport to map its provider's errors, which is the refactor the reference avoided. Do not propose it as an improvement.

### **Averaging behaviour results into one score.** `buzz-dataset` explicitly forbids it: "Report regression results per behavior, not as an average capability score" [SOURCE: specs/system-skilled-bots/context/buzz-main/benchmarks/buzz-dataset/README.md:35]. Candidate for the exhausted list: "a single pass-rate headline for 012". -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Averaging behaviour results into one score.** `buzz-dataset` explicitly forbids it: "Report regression results per behavior, not as an average capability score" [SOURCE: specs/system-skilled-bots/context/buzz-main/benchmarks/buzz-dataset/README.md:35]. Candidate for the exhausted list: "a single pass-rate headline for 012".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Averaging behaviour results into one score.** `buzz-dataset` explicitly forbids it: "Report regression results per behavior, not as an average capability score" [SOURCE: specs/system-skilled-bots/context/buzz-main/benchmarks/buzz-dataset/README.md:35]. Candidate for the exhausted list: "a single pass-rate headline for 012".

### **Counting findings per phase from the registry.** The registry is reducer-owned and read-only for this agent; the counts in F-10-4 come from the iteration files, which are this lineage's own artifacts. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Counting findings per phase from the registry.** The registry is reducer-owned and read-only for this agent; the counts in F-10-4 come from the iteration files, which are this lineage's own artifacts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Counting findings per phase from the registry.** The registry is reducer-owned and read-only for this agent; the counts in F-10-4 come from the iteration files, which are this lineage's own artifacts.

### **Importing a copy check from a reference repo.** None has one. The plan's own V9 is the best available and should be extended, not replaced. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Importing a copy check from a reference repo.** None has one. The plan's own V9 is the best available and should be extended, not replaced.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Importing a copy check from a reference repo.** None has one. The plan's own V9 is the best available and should be extended, not replaced.

### **Lifting `tool-name.ts` for the approval ladder.** It is a display humaniser; the classifier is `approvals.ts` plus the `docs/approvals.md` table. Recorded as finding 1 so the correction reaches the synthesis. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Lifting `tool-name.ts` for the approval ladder.** It is a display humaniser; the classifier is `approvals.ts` plus the `docs/approvals.md` table. Recorded as finding 1 so the correction reaches the synthesis.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Lifting `tool-name.ts` for the approval ladder.** It is a display humaniser; the classifier is `approvals.ts` plus the `docs/approvals.md` table. Recorded as finding 1 so the correction reaches the synthesis.

### **Lifting code from `openhuman-full`, `openhuman-main` or `tinychannels-main`.** All three are GPL-3.0 (F-8-1). Any plan text that says "copy this file" from those repos is wrong. Candidate for the reducer's exhausted list: "lift code from a GPL-3.0 reference". -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Lifting code from `openhuman-full`, `openhuman-main` or `tinychannels-main`.** All three are GPL-3.0 (F-8-1). Any plan text that says "copy this file" from those repos is wrong. Candidate for the reducer's exhausted list: "lift code from a GPL-3.0 reference".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Lifting code from `openhuman-full`, `openhuman-main` or `tinychannels-main`.** All three are GPL-3.0 (F-8-1). Any plan text that says "copy this file" from those repos is wrong. Candidate for the reducer's exhausted list: "lift code from a GPL-3.0 reference".

### **Lifting the reference's `AppTab` set as the screen's tabs.** Its four tabs are Logs, Chat, Config and Settings; the plan's screen draws activity, inbox, routines and chat, so only the cycle shape transfers, not the tab list. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Lifting the reference's `AppTab` set as the screen's tabs.** Its four tabs are Logs, Chat, Config and Settings; the plan's screen draws activity, inbox, routines and chat, so only the cycle shape transfers, not the tab list.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Lifting the reference's `AppTab` set as the screen's tabs.** Its four tabs are Logs, Chat, Config and Settings; the plan's screen draws activity, inbox, routines and chat, so only the cycle shape transfers, not the tab list.

### **Looking for an `actor` field in OpenBot's audit trail.** A search of `shared/audit-words.ts` and `server/src` for `actorId`/`actor_id` returns nothing, so phase 001's `actor` has no reference counterpart to lift. The reference attributes by conversation and by routine owner instead, which is a different model and does not settle the plan's `by:` field. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Looking for an `actor` field in OpenBot's audit trail.** A search of `shared/audit-words.ts` and `server/src` for `actorId`/`actor_id` returns nothing, so phase 001's `actor` has no reference counterpart to lift. The reference attributes by conversation and by routine owner instead, which is a different model and does not settle the plan's `by:` field.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for an `actor` field in OpenBot's audit trail.** A search of `shared/audit-words.ts` and `server/src` for `actorId`/`actor_id` returns nothing, so phase 001's `actor` has no reference counterpart to lift. The reference attributes by conversation and by routine owner instead, which is a different model and does not settle the plan's `by:` field.

### **OpenGhost's `tidy` rewrite as a phase-005 gap.** Phase 005 refuses it by name and gives its reason — a model call inside a verb [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:100] — so the `TIDY` prompt at `memory.js:12-15` is a decided deferral, not a gap. Recorded here so a later iteration does not re-open it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **OpenGhost's `tidy` rewrite as a phase-005 gap.** Phase 005 refuses it by name and gives its reason — a model call inside a verb [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:100] — so the `TIDY` prompt at `memory.js:12-15` is a decided deferral, not a gap. Recorded here so a later iteration does not re-open it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **OpenGhost's `tidy` rewrite as a phase-005 gap.** Phase 005 refuses it by name and gives its reason — a model call inside a verb [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:100] — so the `TIDY` prompt at `memory.js:12-15` is a decided deferral, not a gap. Recorded here so a later iteration does not re-open it.

### **Phase 004 has no reference counterpart.** OpenBot's "computer" is a loopback-only container with a per-bot token, not a directory named in a prompt, so there is nothing to lift for a working-place line. The 003 synthesis already records "Reference code to study first: none in `C/`" for 004, so this is a confirmation and not a new finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Phase 004 has no reference counterpart.** OpenBot's "computer" is a loopback-only container with a per-bot token, not a directory named in a prompt, so there is nothing to lift for a working-place line. The 003 synthesis already records "Reference code to study first: none in `C/`" for 004, so this is a confirmation and not a new finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Phase 004 has no reference counterpart.** OpenBot's "computer" is a loopback-only container with a per-bot token, not a directory named in a prompt, so there is nothing to lift for a working-place line. The 003 synthesis already records "Reference code to study first: none in `C/`" for 004, so this is a confirmation and not a new finding.

### **rakazo's `connection-catalog.ts` and `connected-apps.ts` as phase-007 evidence.** They are a connector catalogue, not a per-bot allowlist, and 007 is already closed by iteration 4. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **rakazo's `connection-catalog.ts` and `connected-apps.ts` as phase-007 evidence.** They are a connector catalogue, not a per-bot allowlist, and 007 is already closed by iteration 4.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **rakazo's `connection-catalog.ts` and `connected-apps.ts` as phase-007 evidence.** They are a connector catalogue, not a per-bot allowlist, and 007 is already closed by iteration 4.

### **Re-reading the fourteen phase specs to build the licence table.** The table in F-10-2 is built from this lineage's own iteration findings plus the ten `LICENSE` files, both already in the packet. A phase-spec reread would add the plan's *intent* per phase, which the 003 synthesis already carries. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Re-reading the fourteen phase specs to build the licence table.** The table in F-10-2 is built from this lineage's own iteration findings plus the ten `LICENSE` files, both already in the packet. A phase-spec reread would add the plan's *intent* per phase, which the 003 synthesis already carries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-reading the fourteen phase specs to build the licence table.** The table in F-10-2 is built from this lineage's own iteration findings plus the ten `LICENSE` files, both already in the packet. A phase-spec reread would add the plan's *intent* per phase, which the 003 synthesis already carries.

### **Reading `activity-rows.ts` as the row-shape source.** It is the personal-edition event-row filter, not the activity row type; the row shape lives in `bot-lifecycle/queries.ts` (`ActivityItem`, `BotActivity`). Phase 001's seven row keys are its own and are not contradicted by the reference. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Reading `activity-rows.ts` as the row-shape source.** It is the personal-edition event-row filter, not the activity row type; the row shape lives in `bot-lifecycle/queries.ts` (`ActivityItem`, `BotActivity`). Phase 001's seven row keys are its own and are not contradicted by the reference.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `activity-rows.ts` as the row-shape source.** It is the personal-edition event-row filter, not the activity row type; the row shape lives in `bot-lifecycle/queries.ts` (`ActivityItem`, `BotActivity`). Phase 001's seven row keys are its own and are not contradicted by the reference.

### **Reading `buzz-main/benchmarks/harbor-buzz-orchestra`.** The `buzz-dataset` README already states the orchestration model (Harbor tasks, `task.toml`, evaluation layers); the orchestra folder is the runner for it, and the runner is not the liftable artifact. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Reading `buzz-main/benchmarks/harbor-buzz-orchestra`.** The `buzz-dataset` README already states the orchestration model (Harbor tasks, `task.toml`, evaluation layers); the orchestra folder is the runner for it, and the runner is not the liftable artifact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `buzz-main/benchmarks/harbor-buzz-orchestra`.** The `buzz-dataset` README already states the orchestration model (Harbor tasks, `task.toml`, evaluation layers); the orchestra folder is the runner for it, and the runner is not the liftable artifact.

### **Reading `buzz-main/crates/buzz-acp/TESTING.md` and `buzz-cli/TESTING.md`.** The `buzz-db` file already yielded the discovery-by-structure pattern (F-7-2); the other two are per-crate variants of the same shape. Reading them would produce redundant evidence for a pattern already established. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Reading `buzz-main/crates/buzz-acp/TESTING.md` and `buzz-cli/TESTING.md`.** The `buzz-db` file already yielded the discovery-by-structure pattern (F-7-2); the other two are per-crate variants of the same shape. Reading them would produce redundant evidence for a pattern already established.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `buzz-main/crates/buzz-acp/TESTING.md` and `buzz-cli/TESTING.md`.** The `buzz-db` file already yielded the discovery-by-structure pattern (F-7-2); the other two are per-crate variants of the same shape. Reading them would produce redundant evidence for a pattern already established.

### **Reading `docs/approvals.md:3-13` as new.** Phase 006 already cites the four-rung order at that line [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:63], so the order itself is carried; only the kind-opening rule and the grant identity are new. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Reading `docs/approvals.md:3-13` as new.** Phase 006 already cites the four-rung order at that line [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:63], so the order itself is carried; only the kind-opening rule and the grant identity are new.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `docs/approvals.md:3-13` as new.** Phase 006 already cites the four-rung order at that line [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:63], so the order itself is carried; only the kind-opening rule and the grant identity are new.

### **Reading `hermes-muse-main/scripts/check_boundaries.py`.** Named in the same CI job as `check_callers.py` [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/.github/workflows/test.yml:22], but "boundaries" is an architecture-import check, which belongs to 014's review criteria rather than 013's doc alignment. Deferred. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Reading `hermes-muse-main/scripts/check_boundaries.py`.** Named in the same CI job as `check_callers.py` [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/.github/workflows/test.yml:22], but "boundaries" is an architecture-import check, which belongs to 014's review criteria rather than 013's doc alignment. Deferred.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `hermes-muse-main/scripts/check_boundaries.py`.** Named in the same CI job as `check_callers.py` [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/.github/workflows/test.yml:22], but "boundaries" is an architecture-import check, which belongs to 014's review criteria rather than 013's doc alignment. Deferred.

### **Reading `OpenGhost-main` for net-new.** Iterations 2 and 4 already extracted its memory bounds, its two-tier skill list, its `CAN` matrix and its `FOREIGN_EVENTS` set. Nothing in the earlier reads suggested a capability outside those. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Reading `OpenGhost-main` for net-new.** Iterations 2 and 4 already extracted its memory bounds, its two-tier skill list, its `CAN` matrix and its `FOREIGN_EVENTS` set. Nothing in the earlier reads suggested a capability outside those.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `OpenGhost-main` for net-new.** Iterations 2 and 4 already extracted its memory bounds, its two-tier skill list, its `CAN` matrix and its `FOREIGN_EVENTS` set. Nothing in the earlier reads suggested a capability outside those.

### **Reading `openhuman-main`'s TUI as a different, older crate.** It is byte-identical to `openhuman-full`'s, so there is no second version to compare and no "built" source to prefer. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Reading `openhuman-main`'s TUI as a different, older crate.** It is byte-identical to `openhuman-full`'s, so there is no second version to compare and no "built" source to prefer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `openhuman-main`'s TUI as a different, older crate.** It is byte-identical to `openhuman-full`'s, so there is no second version to compare and no "built" source to prefer.

### **Reading `rakazo-main/packages/` in depth.** The package taxonomy (`adapter-kit`, `page-kit`, `testkit`, `contracts`, `ui-tokens`, `ui-web`, `chat-ui`, `memory`, `auth`, `db`, `i18n`, `logging`, `core`, `adapters`) is a monorepo layout for a multi-app product, which is closer to §13's multi-tenant and mobile skip rows than to anything the plan builds. The listing is recorded here so a later iteration need not re-inventory it. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Reading `rakazo-main/packages/` in depth.** The package taxonomy (`adapter-kit`, `page-kit`, `testkit`, `contracts`, `ui-tokens`, `ui-web`, `chat-ui`, `memory`, `auth`, `db`, `i18n`, `logging`, `core`, `adapters`) is a monorepo layout for a multi-app product, which is closer to §13's multi-tenant and mobile skip rows than to anything the plan builds. The listing is recorded here so a later iteration need not re-inventory it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `rakazo-main/packages/` in depth.** The package taxonomy (`adapter-kit`, `page-kit`, `testkit`, `contracts`, `ui-tokens`, `ui-web`, `chat-ui`, `memory`, `auth`, `db`, `i18n`, `logging`, `core`, `adapters`) is a monorepo layout for a multi-app product, which is closer to §13's multi-tenant and mobile skip rows than to anything the plan builds. The listing is recorded here so a later iteration need not re-inventory it.

### **Reading `src/approvals/mod.rs` for the approval index.** The 003 synthesis already rules this out — the reference keeps its approval index in memory and the phase must not copy it [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:011-messaging-channels]. Not re-read. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Reading `src/approvals/mod.rs` for the approval index.** The 003 synthesis already rules this out — the reference keeps its approval index in memory and the phase must not copy it [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:011-messaging-channels]. Not re-read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `src/approvals/mod.rs` for the approval index.** The 003 synthesis already rules this out — the reference keeps its approval index in memory and the phase must not copy it [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:011-messaging-channels]. Not re-read.

### **Reading `src/delivery/queue.rs` for queue-entry fields.** The synthesis names it as a file to study, and 003 gap 4 already records that the queue entry has no field list. Reading it would produce a field list, which is the gap's closing artifact rather than new evidence. Deferred to the phase's own contracts child. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Reading `src/delivery/queue.rs` for queue-entry fields.** The synthesis names it as a file to study, and 003 gap 4 already records that the queue entry has no field list. Reading it would produce a field list, which is the gap's closing artifact rather than new evidence. Deferred to the phase's own contracts child.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `src/delivery/queue.rs` for queue-entry fields.** The synthesis names it as a file to study, and 003 gap 4 already records that the queue entry has no field list. Reading it would produce a field list, which is the gap's closing artifact rather than new evidence. Deferred to the phase's own contracts child.

### **Reading `tinycomputer`, `tinybox`, `tinyagents`, `tinyflows`, `tinymcp`, `tinymemory` and `tinyskills` in depth.** Each is either covered by a phase (005, 009, 002, 010) or by a §13 skip row (row 6 covers the container computer, browser farm and gVisor). Reading them would produce evidence for capabilities the plan has already decided against. Their line counts and member-crate lists are recorded in the table so a later iteration can pick one up without re-inventorying. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Reading `tinycomputer`, `tinybox`, `tinyagents`, `tinyflows`, `tinymcp`, `tinymemory` and `tinyskills` in depth.** Each is either covered by a phase (005, 009, 002, 010) or by a §13 skip row (row 6 covers the container computer, browser farm and gVisor). Reading them would produce evidence for capabilities the plan has already decided against. Their line counts and member-crate lists are recorded in the table so a later iteration can pick one up without re-inventorying.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `tinycomputer`, `tinybox`, `tinyagents`, `tinyflows`, `tinymcp`, `tinymemory` and `tinyskills` in depth.** Each is either covered by a phase (005, 009, 002, 010) or by a §13 skip row (row 6 covers the container computer, browser farm and gVisor). Reading them would produce evidence for capabilities the plan has already decided against. Their line counts and member-crate lists are recorded in the table so a later iteration can pick one up without re-inventorying.

### **Reading `tinywallet`, `tinyhosts`, `tinyhumans-sdk`, `tiny-artifacts`.** Ranked 1 on value; `tinyhumans-sdk` is a typed client for one vendor's backend, which is a lock the plan should not take. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Reading `tinywallet`, `tinyhosts`, `tinyhumans-sdk`, `tiny-artifacts`.** Ranked 1 on value; `tinyhumans-sdk` is a typed client for one vendor's backend, which is a lock the plan should not take.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `tinywallet`, `tinyhosts`, `tinyhumans-sdk`, `tiny-artifacts`.** Ranked 1 on value; `tinyhumans-sdk` is a typed client for one vendor's backend, which is a lock the plan should not take.

### **The `secrets` name grammar and the environment key mapping.** Both are the 003 synthesis's 008 gaps 1 and 2 and the phase now fixes them in `design/names-and-keys.md`; nothing in rakazo adds to them. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The `secrets` name grammar and the environment key mapping.** Both are the 003 synthesis's 008 gaps 1 and 2 and the phase now fixes them in `design/names-and-keys.md`; nothing in rakazo adds to them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `secrets` name grammar and the environment key mapping.** Both are the 003 synthesis's 008 gaps 1 and 2 and the phase now fixes them in `design/names-and-keys.md`; nothing in rakazo adds to them.

### **The at-rest encryption toggle as a phase-008 gap.** `resolveContentEncryption` is a real mechanism — `CONTENT_ENCRYPTION=on|off`, with reads decrypting either way so switching off never strands data [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts:32-44] — but phase 008 refuses encryption beyond the file mode by decision and records turnstone's config-only key rule as the alternative [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:107]. Recorded so a later iteration does not re-open it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The at-rest encryption toggle as a phase-008 gap.** `resolveContentEncryption` is a real mechanism — `CONTENT_ENCRYPTION=on|off`, with reads decrypting either way so switching off never strands data [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts:32-44] — but phase 008 refuses encryption beyond the file mode by decision and records turnstone's config-only key rule as the alternative [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:107]. Recorded so a later iteration does not re-open it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The at-rest encryption toggle as a phase-008 gap.** `resolveContentEncryption` is a real mechanism — `CONTENT_ENCRYPTION=on|off`, with reads decrypting either way so switching off never strands data [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts:32-44] — but phase 008 refuses encryption beyond the file mode by decision and records turnstone's config-only key rule as the alternative [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:107]. Recorded so a later iteration does not re-open it.

### **tinymemory's recall/fetch/store engine as a phase-005 design.** It is a three-crate memory service with namespaces and seven model-callable tools; only its `context.md` compiler and its token estimate bear on 005. The engine belongs under net-new. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **tinymemory's recall/fetch/store engine as a phase-005 design.** It is a three-crate memory service with namespaces and seven model-callable tools; only its `context.md` compiler and its token estimate bear on 005. The engine belongs under net-new.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **tinymemory's recall/fetch/store engine as a phase-005 design.** It is a three-crate memory service with namespaces and seven model-callable tools; only its `context.md` compiler and its token estimate bear on 005. The engine belongs under net-new.

### **Treating `HostCommandPolicy` as a phase-006 gap.** It governs host shell commands, which the runtime's posture matrix already refuses by pair, so it belongs to the deferred per-action packet and not to 006. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Treating `HostCommandPolicy` as a phase-006 gap.** It governs host shell commands, which the runtime's posture matrix already refuses by pair, so it belongs to the deferred per-action packet and not to 006.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `HostCommandPolicy` as a phase-006 gap.** It governs host shell commands, which the runtime's posture matrix already refuses by pair, so it belongs to the deferred per-action packet and not to 006.

### **Treating `OpenMausBot-main/evals` as a test suite.** It is a behaviour harness with a scripted model. The distinction is the whole point of F-9-1 and reading it as a test suite would have produced "they have tests too" instead of the freeze-then-score seam. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Treating `OpenMausBot-main/evals` as a test suite.** It is a behaviour harness with a scripted model. The distinction is the whole point of F-9-1 and reading it as a test suite would have produced "they have tests too" instead of the freeze-then-score seam.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `OpenMausBot-main/evals` as a test suite.** It is a behaviour harness with a scripted model. The distinction is the whole point of F-9-1 and reading it as a test suite would have produced "they have tests too" instead of the freeze-then-score seam.

### **Treating `tests.json` as a test runner.** First read suggested a runner config; the `cases` array with `expected_actions` and `match_mode` shows it is a declarative manifest whose runner is elsewhere. The manifest is the liftable artifact, not the runner. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Treating `tests.json` as a test runner.** First read suggested a runner config; the `cases` array with `expected_actions` and `match_mode` shows it is a declarative manifest whose runner is elsewhere. The manifest is the liftable artifact, not the runner.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `tests.json` as a test runner.** First read suggested a runner config; the `cases` array with `expected_actions` and `match_mode` shows it is a declarative manifest whose runner is elsewhere. The manifest is the liftable artifact, not the runner.

### **Treating F-8-1 as correct.** It was not, in the part that mattered. F-10-1 replaces it. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Treating F-8-1 as correct.** It was not, in the part that mattered. F-10-1 replaces it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating F-8-1 as correct.** It was not, in the part that mattered. F-10-1 replaces it.

### **Treating OpenBot's `recurring` group as a routine list.** It mixes routines, goals and check-ins, so it cannot be lifted as a routine list; only its ordering rule is reusable. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Treating OpenBot's `recurring` group as a routine list.** It mixes routines, goals and check-ins, so it cannot be lifted as a routine list; only its ordering rule is reusable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating OpenBot's `recurring` group as a routine list.** It mixes routines, goals and check-ins, so it cannot be lifted as a routine list; only its ordering rule is reusable.

### **Treating the conformance crate as a test harness only.** First read suggested it was a fixture runner; the `check_feature` body shows it is the enforcement point for the capability contract. Re-read at `:373-430` to confirm, which is why F-6-1 is stated as a contract rather than a test. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Treating the conformance crate as a test harness only.** First read suggested it was a fixture runner; the `check_feature` body shows it is the enforcement point for the capability contract. Re-read at `:373-430` to confirm, which is why F-6-1 is stated as a contract rather than a test.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the conformance crate as a test harness only.** First read suggested it was a fixture runner; the `check_feature` body shows it is the enforcement point for the capability contract. Re-read at `:373-430` to confirm, which is why F-6-1 is stated as a contract rather than a test.

### **Treating the missing `target/` directory as evidence the crate was never built.** The build log records the compile and the link warning; the target directory is simply not in the checkout. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Treating the missing `target/` directory as evidence the crate was never built.** The build log records the compile and the link warning; the target directory is simply not in the checkout.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the missing `target/` directory as evidence the crate was never built.** The build log records the compile and the link warning; the target directory is simply not in the checkout.

### **Treating the vendored tree as one artefact.** The first read assumed 21 independent crates. They share a `TinyBus` module protocol and a `tinystoragedrivers` port layer, so they are one product stack. That changes the ranking: a crate that is infrastructure for a stack the plan is not building ranks low even when it is large. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Treating the vendored tree as one artefact.** The first read assumed 21 independent crates. They share a `TinyBus` module protocol and a `tinystoragedrivers` port layer, so they are one product stack. That changes the ranking: a crate that is infrastructure for a stack the plan is not building ranks low even when it is large.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the vendored tree as one artefact.** The first read assumed 21 independent crates. They share a `TinyBus` module protocol and a `tinystoragedrivers` port layer, so they are one product stack. That changes the ranking: a crate that is infrastructure for a stack the plan is not building ranks low even when it is large.

### `endsWhenMet` evaluation: the flag is set and read in the app (`plan.ts:30`, `merged.ts:147-152`, `goal-page.tsx:402`) but the server-side "is the outcome met" evaluation is not in the checkout under a name a search finds, so the reference offers no liftable `until` check. Phase 002's `until_check` command has no counterpart and is the plan's own design; the evidence neither supports nor contradicts it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `endsWhenMet` evaluation: the flag is set and read in the app (`plan.ts:30`, `merged.ts:147-152`, `goal-page.tsx:402`) but the server-side "is the outcome met" evaluation is not in the checkout under a name a search finds, so the reference offers no liftable `until` check. Phase 002's `until_check` command has no counterpart and is the plan's own design; the evidence neither supports nor contradicts it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `endsWhenMet` evaluation: the flag is set and read in the app (`plan.ts:30`, `merged.ts:147-152`, `goal-page.tsx:402`) but the server-side "is the outcome met" evaluation is not in the checkout under a name a search finds, so the reference offers no liftable `until` check. Phase 002's `until_check` command has no counterpart and is the plan's own design; the evidence neither supports nor contradicts it.

### A constant-time compare in `secrets-guard.ts`: the plan names one, and the file's first 55 lines hold the placeholder guard and the encryption toggle but no compare, so the compare is further down and adds nothing to the five findings above. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A constant-time compare in `secrets-guard.ts`: the plan names one, and the file's first 55 lines hold the placeholder guard and the encryption toggle but no compare, so the compare is further down and adds nothing to the five findings above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A constant-time compare in `secrets-guard.ts`: the plan names one, and the file's first 55 lines hold the placeholder guard and the encryption toggle but no compare, so the compare is further down and adds nothing to the five findings above.

### A per-bot app filter in rakazo: its vault and secret layer is phase 008's, and its app surface is a connector catalogue rather than a per-bot allowlist, so nothing there answers 007. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A per-bot app filter in rakazo: its vault and secret layer is phase 008's, and its app surface is a connector catalogue rather than a per-bot allowlist, so nothing there answers 007.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A per-bot app filter in rakazo: its vault and secret layer is phase 008's, and its app surface is a connector catalogue rather than a per-bot allowlist, so nothing there answers 007.

### A per-bot secret index in rakazo: the vault is per owner and per item, with bots as grantees, so there is no per-bot list to compare against the plan's `secrets:` field beyond finding 4. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A per-bot secret index in rakazo: the vault is per owner and per item, with bots as grantees, so there is no per-bot list to compare against the plan's `secrets:` field beyond finding 4.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A per-bot secret index in rakazo: the vault is per owner and per item, with bots as grantees, so there is no per-bot list to compare against the plan's `secrets:` field beyond finding 4.

### A reference conversation store with `@bot` routing: turnstone keeps conversations in `ChatSession` with no append-only file and no routing grammar, so 010's file format has no counterpart. Only its compaction policy transfers (finding 6). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A reference conversation store with `@bot` routing: turnstone keeps conversations in `ChatSession` with no append-only file and no routing grammar, so 010's file format has no counterpart. Only its compaction policy transfers (finding 6).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A reference conversation store with `@bot` routing: turnstone keeps conversations in `ChatSession` with no append-only file and no routing grammar, so 010's file format has no counterpart. Only its compaction policy transfers (finding 6).

### A reference for phase 004's prompt line: searched `turnstone/prompts/` and `turnstone/core/` for a working-directory line and found none, so no repo names its working place in the prompt. 004's design is the plan's own and the evidence neither supports nor contradicts it. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A reference for phase 004's prompt line: searched `turnstone/prompts/` and `turnstone/core/` for a working-directory line and found none, so no repo names its working place in the prompt. 004's design is the plan's own and the evidence neither supports nor contradicts it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A reference for phase 004's prompt line: searched `turnstone/prompts/` and `turnstone/core/` for a working-directory line and found none, so no repo names its working place in the prompt. 004's design is the plan's own and the evidence neither supports nor contradicts it.

### A second TUI implementation in `openhuman-full`: `crates/` is identical to `openhuman-main`'s and the only other UI surface is `crates/openhuman-app` (a desktop app), so there is no second terminal client to compare. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A second TUI implementation in `openhuman-full`: `crates/` is identical to `openhuman-main`'s and the only other UI surface is `crates/openhuman-app` (a desktop app), so there is no second terminal client to compare.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A second TUI implementation in `openhuman-full`: `crates/` is identical to `openhuman-main`'s and the only other UI surface is `crates/openhuman-app` (a desktop app), so there is no second terminal client to compare.

### A written `approval-ladder.md` in the runtime: the file does not exist, so the precedence rule has no current home and finding 2 is a gap in a deliverable rather than a contradiction in a document. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A written `approval-ladder.md` in the runtime: the file does not exist, so the precedence rule has no current home and finding 2 is a gap in a deliverable rather than a contradiction in a document.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A written `approval-ladder.md` in the runtime: the file does not exist, so the precedence rule has no current home and finding 2 is a gap in a deliverable rather than a contradiction in a document.

### OpenBot's 20-enabled cap: already out of scope in phase 002 by name [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:114], so not a gap. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: OpenBot's 20-enabled cap: already out of scope in phase 002 by name [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:114], so not a gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: OpenBot's 20-enabled cap: already out of scope in phase 002 by name [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:114], so not a gap.

### The reference's `cockpit.rs` overlay and approval banner: read for the approval surface, but phase 003's `005-answer-flow` child already specifies the banner and the overlay, so nothing there is new. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The reference's `cockpit.rs` overlay and approval banner: read for the approval surface, but phase 003's `005-answer-flow` child already specifies the banner and the overlay, so nothing there is new.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The reference's `cockpit.rs` overlay and approval banner: read for the approval surface, but phase 003's `005-answer-flow` child already specifies the banner and the overlay, so nothing there is new.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Looking for an `actor` field in OpenBot's audit trail.** A search of `shared/audit-words.ts` and `server/src` for `actorId`/`actor_id` returns nothing, so phase 001's `actor` has no reference counterpart to lift. The reference attributes by conversation and by routine owner instead, which is a different model and does not settle the plan's `by:` field. (iteration 1)
- **Reading `activity-rows.ts` as the row-shape source.** It is the personal-edition event-row filter, not the activity row type; the row shape lives in `bot-lifecycle/queries.ts` (`ActivityItem`, `BotActivity`). Phase 001's seven row keys are its own and are not contradicted by the reference. (iteration 1)
- **Treating OpenBot's `recurring` group as a routine list.** It mixes routines, goals and check-ins, so it cannot be lifted as a routine list; only its ordering rule is reusable. (iteration 1)
- `endsWhenMet` evaluation: the flag is set and read in the app (`plan.ts:30`, `merged.ts:147-152`, `goal-page.tsx:402`) but the server-side "is the outcome met" evaluation is not in the checkout under a name a search finds, so the reference offers no liftable `until` check. Phase 002's `until_check` command has no counterpart and is the plan's own design; the evidence neither supports nor contradicts it. (iteration 1)
- OpenBot's 20-enabled cap: already out of scope in phase 002 by name [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:114], so not a gap. (iteration 1)
- **OpenGhost's `tidy` rewrite as a phase-005 gap.** Phase 005 refuses it by name and gives its reason — a model call inside a verb [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:100] — so the `TIDY` prompt at `memory.js:12-15` is a decided deferral, not a gap. Recorded here so a later iteration does not re-open it. (iteration 2)
- **Phase 004 has no reference counterpart.** OpenBot's "computer" is a loopback-only container with a per-bot token, not a directory named in a prompt, so there is nothing to lift for a working-place line. The 003 synthesis already records "Reference code to study first: none in `C/`" for 004, so this is a confirmation and not a new finding. (iteration 2)
- **tinymemory's recall/fetch/store engine as a phase-005 design.** It is a three-crate memory service with namespaces and seven model-callable tools; only its `context.md` compiler and its token estimate bear on 005. The engine belongs under net-new. (iteration 2)
- A reference conversation store with `@bot` routing: turnstone keeps conversations in `ChatSession` with no append-only file and no routing grammar, so 010's file format has no counterpart. Only its compaction policy transfers (finding 6). (iteration 2)
- A reference for phase 004's prompt line: searched `turnstone/prompts/` and `turnstone/core/` for a working-directory line and found none, so no repo names its working place in the prompt. 004's design is the plan's own and the evidence neither supports nor contradicts it. (iteration 2)
- **Lifting the reference's `AppTab` set as the screen's tabs.** Its four tabs are Logs, Chat, Config and Settings; the plan's screen draws activity, inbox, routines and chat, so only the cycle shape transfers, not the tab list. (iteration 3)
- **Reading `openhuman-main`'s TUI as a different, older crate.** It is byte-identical to `openhuman-full`'s, so there is no second version to compare and no "built" source to prefer. (iteration 3)
- **Treating the missing `target/` directory as evidence the crate was never built.** The build log records the compile and the link warning; the target directory is simply not in the checkout. (iteration 3)
- A second TUI implementation in `openhuman-full`: `crates/` is identical to `openhuman-main`'s and the only other UI surface is `crates/openhuman-app` (a desktop app), so there is no second terminal client to compare. (iteration 3)
- The reference's `cockpit.rs` overlay and approval banner: read for the approval surface, but phase 003's `005-answer-flow` child already specifies the banner and the overlay, so nothing there is new. (iteration 3)
- **Lifting `tool-name.ts` for the approval ladder.** It is a display humaniser; the classifier is `approvals.ts` plus the `docs/approvals.md` table. Recorded as finding 1 so the correction reaches the synthesis. (iteration 4)
- **Reading `docs/approvals.md:3-13` as new.** Phase 006 already cites the four-rung order at that line [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:63], so the order itself is carried; only the kind-opening rule and the grant identity are new. (iteration 4)
- **Treating `HostCommandPolicy` as a phase-006 gap.** It governs host shell commands, which the runtime's posture matrix already refuses by pair, so it belongs to the deferred per-action packet and not to 006. (iteration 4)
- A per-bot app filter in rakazo: its vault and secret layer is phase 008's, and its app surface is a connector catalogue rather than a per-bot allowlist, so nothing there answers 007. (iteration 4)
- A written `approval-ladder.md` in the runtime: the file does not exist, so the precedence rule has no current home and finding 2 is a gap in a deliverable rather than a contradiction in a document. (iteration 4)
- **rakazo's `connection-catalog.ts` and `connected-apps.ts` as phase-007 evidence.** They are a connector catalogue, not a per-bot allowlist, and 007 is already closed by iteration 4. (iteration 5)
- **The `secrets` name grammar and the environment key mapping.** Both are the 003 synthesis's 008 gaps 1 and 2 and the phase now fixes them in `design/names-and-keys.md`; nothing in rakazo adds to them. (iteration 5)
- **The at-rest encryption toggle as a phase-008 gap.** `resolveContentEncryption` is a real mechanism — `CONTENT_ENCRYPTION=on|off`, with reads decrypting either way so switching off never strands data [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts:32-44] — but phase 008 refuses encryption beyond the file mode by decision and records turnstone's config-only key rule as the alternative [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:107]. Recorded so a later iteration does not re-open it. (iteration 5)
- A constant-time compare in `secrets-guard.ts`: the plan names one, and the file's first 55 lines hold the placeholder guard and the encryption toggle but no compare, so the compare is further down and adds nothing to the five findings above. (iteration 5)
- A per-bot secret index in rakazo: the vault is per owner and per item, with bots as grantees, so there is no per-bot list to compare against the plan's `secrets:` field beyond finding 4. (iteration 5)
- **`ChannelReceiveAckPolicy` as a global setting.** The enum is per-adapter (`declared_capabilities` and `receive_ack_policy` are both trait methods with defaults), so there is no single correct ack point to write into the plan. Any plan text that names one ack rule for all transports is contradicted by the reference's own structure. Candidates for the reducer's exhausted list: "one global ack rule for phase 011". (iteration 6)
- **A typed error taxonomy for permanent failures.** The reference uses substring matching on provider text. A typed taxonomy would require every transport to map its provider's errors, which is the refactor the reference avoided. Do not propose it as an improvement. (iteration 6)
- **Reading `src/approvals/mod.rs` for the approval index.** The 003 synthesis already rules this out — the reference keeps its approval index in memory and the phase must not copy it [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:011-messaging-channels]. Not re-read. (iteration 6)
- **Reading `src/delivery/queue.rs` for queue-entry fields.** The synthesis names it as a file to study, and 003 gap 4 already records that the queue entry has no field list. Reading it would produce a field list, which is the gap's closing artifact rather than new evidence. Deferred to the phase's own contracts child. (iteration 6)
- **Treating the conformance crate as a test harness only.** First read suggested it was a fixture runner; the `check_feature` body shows it is the enforcement point for the capability contract. Re-read at `:373-430` to confirm, which is why F-6-1 is stated as a contract rather than a test. (iteration 6)
- **A hand-maintained list of scenarios.** `buzz-db/TESTING.md`'s discovery-by-structure plus its guard script is the counter-example; a list is the thing the guard exists to avoid. Candidate for the exhausted list: "register each scenario in an index file". (iteration 7)
- **A single-prompt scenario format.** `tests.json`'s `user_prompts` array of ten paraphrases makes a one-prompt scenario look under-specified by comparison. Any 012 scenario written with one prompt is contradicted by the reference's own design. Candidate for the reducer's exhausted list: "one prompt per manual scenario". (iteration 7)
- **Reading `buzz-main/crates/buzz-acp/TESTING.md` and `buzz-cli/TESTING.md`.** The `buzz-db` file already yielded the discovery-by-structure pattern (F-7-2); the other two are per-crate variants of the same shape. Reading them would produce redundant evidence for a pattern already established. (iteration 7)
- **Reading `hermes-muse-main/scripts/check_boundaries.py`.** Named in the same CI job as `check_callers.py` [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/.github/workflows/test.yml:22], but "boundaries" is an architecture-import check, which belongs to 014's review criteria rather than 013's doc alignment. Deferred. (iteration 7)
- **Treating `tests.json` as a test runner.** First read suggested a runner config; the `cases` array with `expected_actions` and `match_mode` shows it is a declarative manifest whose runner is elsewhere. The manifest is the liftable artifact, not the runner. (iteration 7)
- **A per-crate licence check.** The licence is uniform across all 21 vendored workspaces, so a per-crate table adds nothing beyond F-8-1's two exceptions (`tinyflows`, `tinyhumans-sdk`, both `-or-later`). (iteration 8)
- **Lifting code from `openhuman-full`, `openhuman-main` or `tinychannels-main`.** All three are GPL-3.0 (F-8-1). Any plan text that says "copy this file" from those repos is wrong. Candidate for the reducer's exhausted list: "lift code from a GPL-3.0 reference". (iteration 8)
- **Reading `tinycomputer`, `tinybox`, `tinyagents`, `tinyflows`, `tinymcp`, `tinymemory` and `tinyskills` in depth.** Each is either covered by a phase (005, 009, 002, 010) or by a §13 skip row (row 6 covers the container computer, browser farm and gVisor). Reading them would produce evidence for capabilities the plan has already decided against. Their line counts and member-crate lists are recorded in the table so a later iteration can pick one up without re-inventorying. (iteration 8)
- **Reading `tinywallet`, `tinyhosts`, `tinyhumans-sdk`, `tiny-artifacts`.** Ranked 1 on value; `tinyhumans-sdk` is a typed client for one vendor's backend, which is a lock the plan should not take. (iteration 8)
- **Treating the vendored tree as one artefact.** The first read assumed 21 independent crates. They share a `TinyBus` module protocol and a `tinystoragedrivers` port layer, so they are one product stack. That changes the ranking: a crate that is infrastructure for a stack the plan is not building ranks low even when it is large. (iteration 8)
- **A single-tier eval.** `OpenMausBot`'s three tiers (scripted, golden replay, opt-in live) and `buzz-dataset`'s two layers (regression k=1, workflow k=3) are independent designs that both refuse a single tier. A plan that specifies one kind of scenario test is contradicted twice. Candidate for the reducer's exhausted list: "one eval tier for phase 012". (iteration 9)
- **Averaging behaviour results into one score.** `buzz-dataset` explicitly forbids it: "Report regression results per behavior, not as an average capability score" [SOURCE: specs/system-skilled-bots/context/buzz-main/benchmarks/buzz-dataset/README.md:35]. Candidate for the exhausted list: "a single pass-rate headline for 012". (iteration 9)
- **Reading `buzz-main/benchmarks/harbor-buzz-orchestra`.** The `buzz-dataset` README already states the orchestration model (Harbor tasks, `task.toml`, evaluation layers); the orchestra folder is the runner for it, and the runner is not the liftable artifact. (iteration 9)
- **Reading `OpenGhost-main` for net-new.** Iterations 2 and 4 already extracted its memory bounds, its two-tier skill list, its `CAN` matrix and its `FOREIGN_EVENTS` set. Nothing in the earlier reads suggested a capability outside those. (iteration 9)
- **Reading `rakazo-main/packages/` in depth.** The package taxonomy (`adapter-kit`, `page-kit`, `testkit`, `contracts`, `ui-tokens`, `ui-web`, `chat-ui`, `memory`, `auth`, `db`, `i18n`, `logging`, `core`, `adapters`) is a monorepo layout for a multi-app product, which is closer to §13's multi-tenant and mobile skip rows than to anything the plan builds. The listing is recorded here so a later iteration need not re-inventory it. (iteration 9)
- **Treating `OpenMausBot-main/evals` as a test suite.** It is a behaviour harness with a scripted model. The distinction is the whole point of F-9-1 and reading it as a test suite would have produced "they have tests too" instead of the freeze-then-score seam. (iteration 9)
- **A per-phase licence section in each of the fourteen phase specs.** The plan already has one shared `contracts/` folder; fourteen copies of a licence rule is the drift problem `hermes-muse`'s generated-doc check exists to prevent. Candidate for the reducer's exhausted list: "per-phase licence statements". (iteration 10)
- **Counting findings per phase from the registry.** The registry is reducer-owned and read-only for this agent; the counts in F-10-4 come from the iteration files, which are this lineage's own artifacts. (iteration 10)
- **Importing a copy check from a reference repo.** None has one. The plan's own V9 is the best available and should be extended, not replaced. (iteration 10)
- **Re-reading the fourteen phase specs to build the licence table.** The table in F-10-2 is built from this lineage's own iteration findings plus the ten `LICENSE` files, both already in the packet. A phase-spec reread would add the plan's *intent* per phase, which the 003 synthesis already carries. (iteration 10)
- **Treating F-8-1 as correct.** It was not, in the part that mattered. F-10-1 replaces it. (iteration 10)

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

- Source pointers: `specs/system-skilled-bots/context/` holds the ten reference repos; `specs/system-skilled-bots/003-openbot-parity-build/` holds the fourteen phase folders plus `contracts/`; the three earlier syntheses are `001-openbot-parity-research`, `002-plan-review-research` and `003-plan-depth-research` under `002-openbot-parity-research/`.
- Reuse candidates: `OpenBot-main` is the primary reference; `openhuman-full` is unstudied by earlier runs and carries five vendored crates plus a built `openhuman-tui`.
- Integration points: the built runtime at `.skilled/skills/system-skilled-bots/runtime/lib/`, `.skilled/bin/bots.cjs` and `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs`.
- Constraints and risks: every input is read-only; the earlier syntheses already carry many findings, so novelty must be argued against them explicitly.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue` through `--extend=N` and `--extend-minutes=M` (live)
- Deferred lifecycle branch: `fork` (not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `research/inbox.jsonl`
- Question conflict owner: reducer registry
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-11-27T07:20:47.581Z
