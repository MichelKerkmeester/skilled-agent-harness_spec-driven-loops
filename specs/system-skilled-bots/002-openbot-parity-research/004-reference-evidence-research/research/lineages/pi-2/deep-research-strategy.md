---
title: Deep Research Strategy
description: Runtime strategy file tracking research focus, progress and outcomes across iterations for the pi-2 reference-evidence lineage.
trigger_phrases:
  - "deep research strategy"
  - "research strategy"
  - "research session tracking"
  - "exhausted research approaches"
importance_tier: normal
contextType: planning
version: 1.14.3.0
---

# Deep Research Strategy - pi-2 Reference Evidence Lineage

Runtime state file for this lineage. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for this research run. Records what to investigate, what worked, what failed, and where to focus next.

### Question Injection Surface

`{spec_folder}/research/lineages/pi-2/inbox.jsonl` carries the frontier node dealt to this lineage. The reducer reads it on every reduce step.

---

## 2. TOPIC
Reference evidence for the OpenBot parity build of skilled bots. Two deliverables: (1) per-003-phase reference evidence (files and lines, what to lift or mirror with licence, where the plan and the references differ, and unguarded failures/tests/fixes), and (2) net-new capability in the ten reference repos that neither the build plan nor the parity synthesis skip list covers, ranked by value to a small team with size.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Phase 011-messaging-channels: which reference files implement a channel adapter seam, Telegram, Slack, Signal and WhatsApp transports, identity linking, a durable queue and approvals rendered as buttons or replies, what should the builder lift or mirror, and which delivery, retry or duplicate-message failures did those repos hit?
- [ ] What dedupe window does a transport need when the provider offset resets on restart, and what does the reference's bounded recent-update cache size imply for a durable seen record?
- [ ] Which transports can prove a send never left (NotSent reconciliation) from their own error shape, and which must treat every ambiguous result as unknown?
- [ ] Does a Slack envelope redelivered after reconnect double-answer when the press was already applied, and what acknowledgement order keeps the reply index idempotent?
- [ ] Which button or block label vocabulary does the reference already carry, and does any of it pass a secret-literal check without new text?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Repeating a finding that one of the three earlier syntheses (001-parity, 002-plan-review, 003-plan-depth) already carries.
- Implementing any phase of the build; this run produces evidence only.
- Editing any reference repo, the build plan, or the built runtime.

---

## 5. STOP CONDITIONS
- Convergence at the configured threshold is telemetry only; this run stops at maxIterations (10) by stop policy.
- All frontier nodes closed or pruned.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Phase 011-messaging-channels: which reference files implement a channel adapter seam, Telegram, Slack, Signal and WhatsApp transports, identity linking, a durable queue and approvals rendered as buttons or replies, what should the builder lift or mirror, and which delivery, retry or duplicate-message failures did those repos hit?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the *test names* beside the code. `a_deduplicated_update_still_advances_the_offset` and `socket_mode_acks_envelopes_dispatches_events_and_reconnects_after_a_disconnect` each name the exact failure the repo was fixing, which is the cheapest reliable source of "what broke in production". (iteration 1)
- reading the error *type* rather than the error *message*. `PartialTextSendError`'s two flags and `ApiFailure`'s four variants are the repo's own taxonomy of "did it land", which is exactly the question the plan's `unknown` state has to answer. (iteration 2)
- collecting all ten licence headers in one pass. The earlier synthesis's licensing table made the new fact visible by omission — tinychannels was simply absent from it — and one grep for a term none of three sides uses (DST) turned a suspicion into a citable gap. (iteration 3)
- reading the reference's *test list* rather than its source. Six test names in `render_tests.rs` told me which six failures a real TUI had to fix, and two of them do not appear anywhere in a 26-state mockup set. (iteration 4)
- reading `memory.js`'s constant block before its logic. Four numbers on one line settled the provenance question instantly — three appear verbatim in the plan and the fourth, `crowded: 28`, is the trigger for the mechanism the plan left out. That is a cheaper way to find an omission than reading the plan for what is absent. (iteration 5)
- looking for the *failure path* of a narrowing mechanism rather than the mechanism. All ten repos narrow access somehow, so nothing there was new; only OpenMausBot treats "narrowed correctly but the credential is short" as its own state, which is precisely the state a per-bot filter creates. (iteration 6)
- searching the *whole plan* for one word (`hook`) after finding a large reference capability. The negative result converted a plausible "later phase owns it" assumption into a citable absence in one call. (iteration 7)
- reading the reference kit's header comment before its checks. One sentence — "never substitutes a synthetic transport for the provider fixture" — is the whole difference between the plan's suite and the reference's, and it is stated as design intent rather than as behaviour. (iteration 8)
- measuring before ranking. One `find | wc -l` loop over `vendor/` turned "five crates" into twenty-one and 4.38 million lines, which changed the whole answer. A ranking built on the topic's list would have been confidently wrong. (iteration 9)
- reading manifests and data files rather than source. `plugin.yaml` and `eval_skill_adherence.json` are 12 and 56 lines and each names a mechanism the plan lacks; the same information from source would have cost two orders of magnitude more reading. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- grepping OpenMausBot for transport directories returned nothing, because its messaging lives behind a hosted portal rather than in-tree. A keyword grep for `telegram`/`slack` over the whole tree would have shown that faster than a directory-shape guess. (iteration 1)
- hunting the plan for a `seen/` retention rule by grepping "seen" only. The design document does define absence-of-pruning implicitly by never mentioning it, which is a weaker signal than a stated rule; a grep for "prune", "retention" or "gc" would have settled it faster. (iteration 2)
- approaching 001 and 002 expecting defects. The plan had already excluded the two obvious additions with citations, so two of the five findings are confirms rather than gaps. That is a good outcome for the plan and a lesson about where to hunt: the unguarded cases live in the seams between three artefacts (plan, runtime, reference), not in any one of them. (iteration 3)
- searching OpenBot for a working-directory prompt line by phrase. Two literal phrases found nothing, which is weak evidence on its own; reading the document that explains what a Bot is told made the negative defensible. (iteration 4)
- approaching 006 expecting the rung ladder to be the finding. The plan already carries the ladder faithfully; the value was in the *exception* paragraph below it and in the recognition table, which are the parts a summary of the doc skips. (iteration 5)
- reading 008's spec by grep for "echo" or "redact". The plan's coverage is spread across a risk row, a measured backend note and the post-run scan requirement, so a single-term grep found fragments; reading the requirement table settled it. (iteration 6)
- expecting 010 to have reference-side evidence. Its records are packet-internal contracts, so the only reference material is two paragraphs of architecture prose; the phase is essentially net-new and the finding had to be about the exclusion rather than the design. (iteration 7)
- expecting the three proof phases to yield reference evidence. Two of them are about this repository's own process, so the honest result is two negatives; the temptation was to manufacture a third finding from a scenario table that cites other phases. (iteration 8)
- reading crate headers one at a time. Seven crates have `src/lib.rs` and fourteen use `crates/<name>/src/lib.rs`, so the first pass returned two headers and three empties; a `find -name lib.rs` per crate fixed it. (iteration 9)
- the first survey pass over `OpenGhost` returned 20 flat JavaScript files, which read as a desktop app rather than a framework. It took iteration 7's `rules.js` read to know that the folder's flatness hid a 703-line engine; a directory listing is not a capability inventory. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`buzz`'s admin surface, `rakazo`'s auth and DB, `OpenMausBot`'s relay and devices.** Every one is named in the parity synthesis's skip list, and their sizes are platform-sized. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **`buzz`'s admin surface, `rakazo`'s auth and DB, `OpenMausBot`'s relay and devices.** Every one is named in the parity synthesis's skip list, and their sizes are platform-sized.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`buzz`'s admin surface, `rakazo`'s auth and DB, `OpenMausBot`'s relay and devices.** Every one is named in the parity synthesis's skip list, and their sizes are platform-sized.

### **Comparing the plan's eight capability keys with the reference's `ConformanceFeature` enum.** The plan flattens a nested record to eight booleans and says why, and it is GPL-3.0 code either way; the count difference is not a gap. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Comparing the plan's eight capability keys with the reference's `ConformanceFeature` enum.** The plan flattens a nested record to eight booleans and says why, and it is GPL-3.0 code either way; the count difference is not a gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Comparing the plan's eight capability keys with the reference's `ConformanceFeature` enum.** The plan flattens a nested record to eight booleans and says why, and it is GPL-3.0 code either way; the count difference is not a gap.

### **Copying OpenGhost's LLM tidy as the memory bound's answer.** It rewrites operator-confirmed facts with no record of the rewrite, which contradicts 005's own premise that an entry records who said it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Copying OpenGhost's LLM tidy as the memory bound's answer.** It rewrites operator-confirmed facts with no record of the rewrite, which contradicts 005's own premise that an entry records who said it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Copying OpenGhost's LLM tidy as the memory bound's answer.** It rewrites operator-confirmed facts with no record of the rewrite, which contradicts 005's own premise that an entry records who said it.

### **Finding a per-run MCP config equivalent in a reference.** None of the ten repos narrows a connector list per run; they narrow per user or per item. 007 is net-new on the mechanism and borrows only the failure path of finding 1. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Finding a per-run MCP config equivalent in a reference.** None of the ten repos narrows a connector list per run; they narrow per user or per item. 007 is net-new on the mechanism and borrows only the failure path of finding 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Finding a per-run MCP config equivalent in a reference.** None of the ten repos narrows a connector list per run; they narrow per user or per item. 007 is net-new on the mechanism and borrows only the failure path of finding 1.

### **Looking for a manual test script in the references.** None carries one; the closest artefact is the conformance kit, which is a library rather than a playbook. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Looking for a manual test script in the references.** None carries one; the closest artefact is the conformance kit, which is a library rather than a playbook.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Looking for a manual test script in the references.** None carries one; the closest artefact is the conformance kit, which is a library rather than a playbook.

### **Mining OpenMausBot for channel transports.** Grepped the tree for `telegram`/`slack` path components and found none; the only Slack code is the hosted management URL of finding 6. Not retried. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Mining OpenMausBot for channel transports.** Grepped the tree for `telegram`/`slack` path components and found none; the only Slack code is the hosted management URL of finding 6. Not retried.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Mining OpenMausBot for channel transports.** Grepped the tree for `telegram`/`slack` path components and found none; the only Slack code is the hosted management URL of finding 6. Not retried.

### **Ranking only the five crates the topic names.** The measurement in finding 1 makes that set the smallest end of the tree; the ranking above covers all twenty-one. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Ranking only the five crates the topic names.** The measurement in finding 1 makes that set the smallest end of the tree; the ranking above covers all twenty-one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Ranking only the five crates the topic names.** The measurement in finding 1 makes that set the smallest end of the tree; the ranking above covers all twenty-one.

### **Re-deriving the 24-column and 8-row floor.** The plan already lifts it from `openhuman-tui/src/render.rs:26` and draws the 30x7 frame from it. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Re-deriving the 24-column and 8-row floor.** The plan already lifts it from `openhuman-tui/src/render.rs:26` and draws the 30x7 frame from it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-deriving the 24-column and 8-row floor.** The plan already lifts it from `openhuman-tui/src/render.rs:26` and draws the 30x7 frame from it.

### **Re-deriving the fatigue rule's ten-failure count.** Plan 002 states it with the run-record citations and the `enabledAt` reset; nothing new to add. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Re-deriving the fatigue rule's ten-failure count.** Plan 002 states it with the run-record citations and the `enabledAt` reset; nothing new to add.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-deriving the fatigue rule's ten-failure count.** Plan 002 states it with the run-record citations and the `enabledAt` reset; nothing new to add.

### **Re-deriving the five conformance rules from the reference.** The plan already numbers the reference's five assertions and cites the line ranges of the reference's kit for each. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Re-deriving the five conformance rules from the reference.** The plan already numbers the reference's five assertions and cites the line ranges of the reference's kit for each.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-deriving the five conformance rules from the reference.** The plan already numbers the reference's five assertions and cites the line ranges of the reference's kit for each.

### **Re-deriving the plan's inbound acknowledge sequence.** The 002 design already fixes the seven steps, the per-transport dedupe key, and the `after-seen-record` policy for four transports, citing the reference adapter policy. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md:62-93] Not a gap. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Re-deriving the plan's inbound acknowledge sequence.** The 002 design already fixes the seven steps, the per-transport dedupe key, and the `after-seen-record` policy for four transports, citing the reference adapter policy. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md:62-93] Not a gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-deriving the plan's inbound acknowledge sequence.** The 002 design already fixes the seven steps, the per-transport dedupe key, and the `after-seen-record` policy for four transports, citing the reference adapter policy. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md:62-93] Not a gap.

### **Re-deriving the rung order.** The plan takes the reference's four rungs and adds a `bot` fallback; the reference has no fallback value, so the addition is the plan's and is already documented. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Re-deriving the rung order.** The plan takes the reference's four rungs and adds a `bot` fallback; the reference has no fallback value, so the addition is the plan's and is already documented.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-deriving the rung order.** The plan takes the reference's four rungs and adds a `bot` fallback; the reference has no fallback value, so the addition is the plan's and is already documented.

### **Re-deriving the wire facts (endpoints, limits, backoff constants).** The plan's children 005 and 006 already cite those lines, and re-deriving them would repeat the earlier syntheses. This iteration read only the control flow around them. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Re-deriving the wire facts (endpoints, limits, backoff constants).** The plan's children 005 and 006 already cite those lines, and re-deriving them would repeat the earlier syntheses. This iteration read only the control flow around them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-deriving the wire facts (endpoints, limits, backoff constants).** The plan's children 005 and 006 already cite those lines, and re-deriving them would repeat the earlier syntheses. This iteration read only the control flow around them.

### **Re-reading `hermes-muse`'s skills folder.** It is a companion's prompt skills, which the plan already handles as skill bodies. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Re-reading `hermes-muse`'s skills folder.** It is a companion's prompt skills, which the plan already handles as skill bodies.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-reading `hermes-muse`'s skills folder.** It is a companion's prompt skills, which the plan already handles as skill bodies.

### **Reading `rules.js` in full.** The event table, the matcher grammar and the rule grammar are enough to size and characterise the missing capability; the evaluation loop would not change the finding. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Reading `rules.js` in full.** The event table, the matcher grammar and the rule grammar are enough to size and characterise the missing capability; the evaluation loop would not change the finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `rules.js` in full.** The event table, the matcher grammar and the rule grammar are enough to size and characterise the missing capability; the evaluation loop would not change the finding.

### **Reading `tinyartifacts`.** The directory is `tiny-artifacts` and the crate is 6,720 lines; its value is below the resolution of this ranking. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Reading `tinyartifacts`.** The directory is `tiny-artifacts` and the crate is 6,720 lines; its value is below the resolution of this ranking.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `tinyartifacts`.** The directory is `tiny-artifacts` and the crate is 6,720 lines; its value is below the resolution of this ranking.

### **Reading `tinycomputer` and `tinyvoice`.** Both are excluded surfaces in the parity synthesis, and their sizes settle the ranking without reading them. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Reading `tinycomputer` and `tinyvoice`.** Both are excluded surfaces in the parity synthesis, and their sizes settle the ranking without reading them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `tinycomputer` and `tinyvoice`.** Both are excluded surfaces in the parity synthesis, and their sizes settle the ranking without reading them.

### **Reading OpenBot for a worktree or per-run directory model.** It is a server whose conversations share one deployment; there is no per-run tree to mirror, which is why 004 has no reference implementation. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Reading OpenBot for a worktree or per-run directory model.** It is a server whose conversations share one deployment; there is no per-run tree to mirror, which is why 004 has no reference implementation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading OpenBot for a worktree or per-run directory model.** It is a server whose conversations share one deployment; there is no per-run tree to mirror, which is why 004 has no reference implementation.

### **Reading OpenBot's `shared/activity-rows.ts` for 009.** It belongs to 001's activity lift and carries nothing about skills. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Reading OpenBot's `shared/activity-rows.ts` for 009.** It belongs to 001's activity lift and carries nothing about skills.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading OpenBot's `shared/activity-rows.ts` for 009.** It belongs to 001's activity lift and carries nothing about skills.

### **Reading OpenMausBot's `connector/` host directory for a second implementation.** It is a connector marketplace host, not a per-bot filter. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Reading OpenMausBot's `connector/` host directory for a second implementation.** It is a connector marketplace host, not a per-bot filter.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading OpenMausBot's `connector/` host directory for a second implementation.** It is a connector marketplace host, not a per-bot filter.

### **Searching for a reference-side durable seen store.** There is none: `TelegramUpdateWindow` is in-memory with an eviction path, and the WhatsApp and Signal paths carry no seen store at all. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Searching for a reference-side durable seen store.** There is none: `TelegramUpdateWindow` is in-memory with an eviction path, and the WhatsApp and Signal paths carry no seen store at all.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Searching for a reference-side durable seen store.** There is none: `TelegramUpdateWindow` is in-memory with an eviction path, and the WhatsApp and Signal paths carry no seen store at all.

### **The 20-enabled cap as a gap.** It is an explicit exclusion with a citation and a reason. Re-adding it would contradict a frozen scope decision. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The 20-enabled cap as a gap.** It is an explicit exclusion with a citation and a reason. Re-adding it would contradict a frozen scope decision.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The 20-enabled cap as a gap.** It is an explicit exclusion with a citation and a reason. Re-adding it would contradict a frozen scope decision.

### **The first-failure notice as a gap.** Explicitly deferred with a reversal condition. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The first-failure notice as a gap.** Explicitly deferred with a reversal condition.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The first-failure notice as a gap.** Explicitly deferred with a reversal condition.

### **Treating `OpenMausBot`'s `announcements` folder as a new capability.** It is a notification surface, and iteration 6 already took the discipline worth having from the reference. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Treating `OpenMausBot`'s `announcements` folder as a new capability.** It is a notification surface, and iteration 6 already took the discipline worth having from the reference.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `OpenMausBot`'s `announcements` folder as a new capability.** It is a notification surface, and iteration 6 already took the discipline worth having from the reference.

### **Treating 006's unimplemented rungs 2 to 4 as a gap.** The plan names them as not implemented in this phase, with the reason (no store supplies them). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Treating 006's unimplemented rungs 2 to 4 as a gap.** The plan names them as not implemented in this phase, with the reason (no store supplies them).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating 006's unimplemented rungs 2 to 4 as a gap.** The plan names them as not implemented in this phase, with the reason (no store supplies them).

### **Treating Slack's "do not acknowledge an envelope we could not retain" as new.** The plan already cites that exact line and relies on the reconnect redelivery. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md:73] No finding added. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Treating Slack's "do not acknowledge an envelope we could not retain" as new.** The plan already cites that exact line and relies on the reconnect redelivery. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md:73] No finding added.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating Slack's "do not acknowledge an envelope we could not retain" as new.** The plan already cites that exact line and relies on the reconnect redelivery. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md:73] No finding added.

### **Treating the missing mention path as a defect.** It is a deliberate design difference with a stated auditing benefit; recorded as such. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Treating the missing mention path as a defect.** It is a deliberate design difference with a stated auditing benefit; recorded as such.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the missing mention path as a defect.** It is a deliberate design difference with a stated auditing benefit; recorded as such.

### **Treating the missing mouse hit-target rule as a gap.** The plan has no mouse support, so the reference's rule does not apply. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Treating the missing mouse hit-target rule as a gap.** The plan has no mouse support, so the reference's rule does not apply.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the missing mouse hit-target rule as a gap.** The plan has no mouse support, so the reference's rule does not apply.

### **Treating the plan's missing echo guard as a gap.** It is measured and guarded three ways: the length refusal, the never-print rule and the post-run scan. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Treating the plan's missing echo guard as a gap.** It is measured and guarded three ways: the length refusal, the never-print rule and the post-run scan.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the plan's missing echo guard as a gap.** It is measured and guarded three ways: the length refusal, the never-print rule and the post-run scan.

### `buzz`'s benchmarks and `HYPOTHESIS.md`/`lint_hypothesis.py` in turnstone are interesting process artefacts and no capability; not ranked. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `buzz`'s benchmarks and `HYPOTHESIS.md`/`lint_hypothesis.py` in turnstone are interesting process artefacts and no capability; not ranked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `buzz`'s benchmarks and `HYPOTHESIS.md`/`lint_hypothesis.py` in turnstone are interesting process artefacts and no capability; not ranked.

### `openhuman-full/vendor/tinyconnectors` was in the node scope but not opened: the iteration budget went to tinychannels, which is the only repo holding all four transports. Carried to the net-new iteration rather than promoted to Exhausted Approaches. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `openhuman-full/vendor/tinyconnectors` was in the node scope but not opened: the iteration budget went to tinychannels, which is the only repo holding all four transports. Carried to the net-new iteration rather than promoted to Exhausted Approaches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `openhuman-full/vendor/tinyconnectors` was in the node scope but not opened: the iteration budget went to tinychannels, which is the only repo holding all four transports. Carried to the net-new iteration rather than promoted to Exhausted Approaches.

### `tinyagents`'s internal `vendor/tinytools` is patched into the workspace through three `[patch]` entries; [SOURCE: specs/system-skilled-bots/context/openhuman-full/Cargo.toml:50-64] the redirection is a build detail with no product value. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `tinyagents`'s internal `vendor/tinytools` is patched into the workspace through three `[patch]` entries; [SOURCE: specs/system-skilled-bots/context/openhuman-full/Cargo.toml:50-64] the redirection is a build detail with no product value.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `tinyagents`'s internal `vendor/tinytools` is patched into the workspace through three `[patch]` entries; [SOURCE: specs/system-skilled-bots/context/openhuman-full/Cargo.toml:50-64] the redirection is a build detail with no product value.

### 010's transcript envelope and message-record rules are entirely packet-internal (`contracts/records.md` section 10, `contracts/cli-json.md` section 3.1), so there is no reference to compare them with; the only reference-side transcript facts are the shared-transcript attribution and the handoff rule. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: 010's transcript envelope and message-record rules are entirely packet-internal (`contracts/records.md` section 10, `contracts/cli-json.md` section 3.1), so there is no reference to compare them with; the only reference-side transcript facts are the shared-transcript attribution and the handoff rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 010's transcript envelope and message-record rules are entirely packet-internal (`contracts/records.md` section 10, `contracts/cli-json.md` section 3.1), so there is no reference to compare them with; the only reference-side transcript facts are the shared-transcript attribution and the handoff rule.

### 012's scenario table is 30-plus rows that cite their own phases; verifying each would have repeated phase evidence this run already carries in iterations 1 to 7. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: 012's scenario table is 30-plus rows that cite their own phases; verifying each would have repeated phase evidence this run already carries in iterations 1 to 7.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 012's scenario table is 30-plus rows that cite their own phases; verifying each would have repeated phase evidence this run already carries in iterations 1 to 7.

### A full read of `turnstone`'s eval module was not needed: the case format and the two scoring tests establish both the mechanism and that it is tested. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A full read of `turnstone`'s eval module was not needed: the case format and the two scoring tests establish both the mechanism and that it is tested.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A full read of `turnstone`'s eval module was not needed: the case format and the two scoring tests establish both the mechanism and that it is tested.

### A grep for `hook` across all fourteen phase specs and their children produced only git-hook matches, which is the negative evidence for finding 2. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: A grep for `hook` across all fourteen phase specs and their children produced only git-hook matches, which is the negative evidence for finding 2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A grep for `hook` across all fourteen phase specs and their children produced only git-hook matches, which is the negative evidence for finding 2.

### A repository-wide grep of `openhuman-tui` for a panic-free resize property beyond the one test name found no second guard; the test name is the evidence. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A repository-wide grep of `openhuman-tui` for a panic-free resize property beyond the one test name found no second guard; the test name is the evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A repository-wide grep of `openhuman-tui` for a panic-free resize property beyond the one test name found no second guard; the test name is the evidence.

### Grepping the runtime for DST support found nothing to cite beyond the absence; the finding rests on that absence on three sides plus the plan's own local-time sentence. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Grepping the runtime for DST support found nothing to cite beyond the absence; the finding rests on that absence on three sides plus the plan's own local-time sentence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Grepping the runtime for DST support found nothing to cite beyond the absence; the finding rests on that absence on three sides plus the plan's own local-time sentence.

### hermes-muse's staged-write note was not opened beyond its path: the prior synthesis already carries it as a lift for proposal review, and 005's proposal path cites it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: hermes-muse's staged-write note was not opened beyond its path: the prior synthesis already carries it as a lift for proposal review, and 005's proposal path cites it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: hermes-muse's staged-write note was not opened beyond its path: the prior synthesis already carries it as a lift for proposal review, and 005's proposal path cites it.

### No crate in the tree is permissively licensed; the licence check is one file for all twenty-one. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: No crate in the tree is permissively licensed; the licence check is one file for all twenty-one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No crate in the tree is permissively licensed; the licence check is one file for all twenty-one.

### No reference attempts to size a seen store from provider retention, so finding 1's recommendation is inference from the reference's bound plus the plan's own provider facts, not a lifted constant. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No reference attempts to size a seen store from provider retention, so finding 1's recommendation is inference from the reference's bound plus the plan's own provider facts, not a lifted constant.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No reference attempts to size a seen store from provider retention, so finding 1's recommendation is inference from the reference's bound plus the plan's own provider facts, not a lifted constant.

### OpenBot's `agent-langgraph-ts` prompt modules were not opened in depth: the two prompt-line searches returned nothing, and reading the whole prompt builder would not have changed the negative. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: OpenBot's `agent-langgraph-ts` prompt modules were not opened in depth: the two prompt-line searches returned nothing, and reading the whole prompt builder would not have changed the negative.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: OpenBot's `agent-langgraph-ts` prompt modules were not opened in depth: the two prompt-line searches returned nothing, and reading the whole prompt builder would not have changed the negative.

### OpenBot's `shared/tool-name.ts` was not re-read: the prior synthesis names it as the lifted classifier and the plan's `classifyAction` cites it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: OpenBot's `shared/tool-name.ts` was not re-read: the prior synthesis names it as the lifted classifier and the plan's `classifyAction` cites it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: OpenBot's `shared/tool-name.ts` was not re-read: the prior synthesis names it as the lifted classifier and the plan's `classifyAction` cites it.

### OpenBot's activity `queries.ts` and `mutations.ts` were not opened: the plan lifts only `activity-groups.ts` and `shared/activity-rows.ts`, and reading the screen-side mutations would not change the grouping rule. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: OpenBot's activity `queries.ts` and `mutations.ts` were not opened: the plan lifts only `activity-groups.ts` and `shared/activity-rows.ts`, and reading the screen-side mutations would not change the grouping rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: OpenBot's activity `queries.ts` and `mutations.ts` were not opened: the plan lifts only `activity-groups.ts` and `shared/activity-rows.ts`, and reading the screen-side mutations would not change the grouping rule.

### rakazo's `secret-matcher.ts` was located but not read: 008's known-secret map is built from stored values rather than from pattern matching, so the matcher's pattern list would not have changed any finding. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: rakazo's `secret-matcher.ts` was located but not read: 008's known-secret map is built from stored values rather than from pattern matching, so the matcher's pattern list would not have changed any finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: rakazo's `secret-matcher.ts` was located but not read: 008's known-secret map is built from stored values rather than from pattern matching, so the matcher's pattern list would not have changed any finding.

### Searching OpenBot-main for a docs check produced one negative. A second search for a review or audit loop was not worth a call: the earlier iterations found its audit rows described as product behaviour, not as a review process. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Searching OpenBot-main for a docs check produced one negative. A second search for a review or audit loop was not worth a call: the earlier iterations found its audit rows described as product behaviour, not as a review process.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching OpenBot-main for a docs check produced one negative. A second search for a review or audit loop was not worth a call: the earlier iterations found its audit rows described as product behaviour, not as a review process.

### The `connector-scope-hint` mechanism is reachable only where a connector's OAuth scopes are known per tool slug; the plan would need a per-connector scope table to use it, which is worth naming in 007's design as the cost of finding 1. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: The `connector-scope-hint` mechanism is reachable only where a connector's OAuth scopes are known per tool slug; the plan would need a per-connector scope table to use it, which is worth naming in 007's design as the cost of finding 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `connector-scope-hint` mechanism is reachable only where a connector's OAuth scopes are known per tool slug; the plan would need a per-connector scope table to use it, which is worth naming in 007's design as the cost of finding 1.

### The reference's `whatsapp_web/identity.rs` exists but is the linked-device client the phase puts out of scope; not opened beyond confirming its name. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The reference's `whatsapp_web/identity.rs` exists but is the linked-device client the phase puts out of scope; not opened beyond confirming its name.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The reference's `whatsapp_web/identity.rs` exists but is the linked-device client the phase puts out of scope; not opened beyond confirming its name.

### tinychannels `whatsapp_web/` (a linked-device client) exists and is explicitly out of scope for phase 011; not opened. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: tinychannels `whatsapp_web/` (a linked-device client) exists and is explicitly out of scope for phase 011; not opened.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: tinychannels `whatsapp_web/` (a linked-device client) exists and is explicitly out of scope for phase 011; not opened.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Mining OpenMausBot for channel transports.** Grepped the tree for `telegram`/`slack` path components and found none; the only Slack code is the hosted management URL of finding 6. Not retried. (iteration 1)
- **Re-deriving the wire facts (endpoints, limits, backoff constants).** The plan's children 005 and 006 already cite those lines, and re-deriving them would repeat the earlier syntheses. This iteration read only the control flow around them. (iteration 1)
- `openhuman-full/vendor/tinyconnectors` was in the node scope but not opened: the iteration budget went to tinychannels, which is the only repo holding all four transports. Carried to the net-new iteration rather than promoted to Exhausted Approaches. (iteration 1)
- tinychannels `whatsapp_web/` (a linked-device client) exists and is explicitly out of scope for phase 011; not opened. (iteration 1)
- **Re-deriving the plan's inbound acknowledge sequence.** The 002 design already fixes the seven steps, the per-transport dedupe key, and the `after-seen-record` policy for four transports, citing the reference adapter policy. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md:62-93] Not a gap. (iteration 2)
- **Searching for a reference-side durable seen store.** There is none: `TelegramUpdateWindow` is in-memory with an eviction path, and the WhatsApp and Signal paths carry no seen store at all. (iteration 2)
- **Treating Slack's "do not acknowledge an envelope we could not retain" as new.** The plan already cites that exact line and relies on the reconnect redelivery. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md:73] No finding added. (iteration 2)
- No reference attempts to size a seen store from provider retention, so finding 1's recommendation is inference from the reference's bound plus the plan's own provider facts, not a lifted constant. (iteration 2)
- The reference's `whatsapp_web/identity.rs` exists but is the linked-device client the phase puts out of scope; not opened beyond confirming its name. (iteration 2)
- **Re-deriving the fatigue rule's ten-failure count.** Plan 002 states it with the run-record citations and the `enabledAt` reset; nothing new to add. (iteration 3)
- **The 20-enabled cap as a gap.** It is an explicit exclusion with a citation and a reason. Re-adding it would contradict a frozen scope decision. (iteration 3)
- **The first-failure notice as a gap.** Explicitly deferred with a reversal condition. (iteration 3)
- Grepping the runtime for DST support found nothing to cite beyond the absence; the finding rests on that absence on three sides plus the plan's own local-time sentence. (iteration 3)
- OpenBot's activity `queries.ts` and `mutations.ts` were not opened: the plan lifts only `activity-groups.ts` and `shared/activity-rows.ts`, and reading the screen-side mutations would not change the grouping rule. (iteration 3)
- **Re-deriving the 24-column and 8-row floor.** The plan already lifts it from `openhuman-tui/src/render.rs:26` and draws the 30x7 frame from it. (iteration 4)
- **Reading OpenBot for a worktree or per-run directory model.** It is a server whose conversations share one deployment; there is no per-run tree to mirror, which is why 004 has no reference implementation. (iteration 4)
- **Treating the missing mouse hit-target rule as a gap.** The plan has no mouse support, so the reference's rule does not apply. (iteration 4)
- A repository-wide grep of `openhuman-tui` for a panic-free resize property beyond the one test name found no second guard; the test name is the evidence. (iteration 4)
- OpenBot's `agent-langgraph-ts` prompt modules were not opened in depth: the two prompt-line searches returned nothing, and reading the whole prompt builder would not have changed the negative. (iteration 4)
- **Copying OpenGhost's LLM tidy as the memory bound's answer.** It rewrites operator-confirmed facts with no record of the rewrite, which contradicts 005's own premise that an entry records who said it. (iteration 5)
- **Re-deriving the rung order.** The plan takes the reference's four rungs and adds a `bot` fallback; the reference has no fallback value, so the addition is the plan's and is already documented. (iteration 5)
- **Treating 006's unimplemented rungs 2 to 4 as a gap.** The plan names them as not implemented in this phase, with the reason (no store supplies them). (iteration 5)
- hermes-muse's staged-write note was not opened beyond its path: the prior synthesis already carries it as a lift for proposal review, and 005's proposal path cites it. (iteration 5)
- OpenBot's `shared/tool-name.ts` was not re-read: the prior synthesis names it as the lifted classifier and the plan's `classifyAction` cites it. (iteration 5)
- **Finding a per-run MCP config equivalent in a reference.** None of the ten repos narrows a connector list per run; they narrow per user or per item. 007 is net-new on the mechanism and borrows only the failure path of finding 1. (iteration 6)
- **Reading OpenMausBot's `connector/` host directory for a second implementation.** It is a connector marketplace host, not a per-bot filter. (iteration 6)
- **Treating the plan's missing echo guard as a gap.** It is measured and guarded three ways: the length refusal, the never-print rule and the post-run scan. (iteration 6)
- rakazo's `secret-matcher.ts` was located but not read: 008's known-secret map is built from stored values rather than from pattern matching, so the matcher's pattern list would not have changed any finding. (iteration 6)
- The `connector-scope-hint` mechanism is reachable only where a connector's OAuth scopes are known per tool slug; the plan would need a per-connector scope table to use it, which is worth naming in 007's design as the cost of finding 1. (iteration 6)
- **Reading `rules.js` in full.** The event table, the matcher grammar and the rule grammar are enough to size and characterise the missing capability; the evaluation loop would not change the finding. (iteration 7)
- **Reading OpenBot's `shared/activity-rows.ts` for 009.** It belongs to 001's activity lift and carries nothing about skills. (iteration 7)
- **Treating the missing mention path as a defect.** It is a deliberate design difference with a stated auditing benefit; recorded as such. (iteration 7)
- 010's transcript envelope and message-record rules are entirely packet-internal (`contracts/records.md` section 10, `contracts/cli-json.md` section 3.1), so there is no reference to compare them with; the only reference-side transcript facts are the shared-transcript attribution and the handoff rule. (iteration 7)
- A grep for `hook` across all fourteen phase specs and their children produced only git-hook matches, which is the negative evidence for finding 2. (iteration 7)
- **Comparing the plan's eight capability keys with the reference's `ConformanceFeature` enum.** The plan flattens a nested record to eight booleans and says why, and it is GPL-3.0 code either way; the count difference is not a gap. (iteration 8)
- **Looking for a manual test script in the references.** None carries one; the closest artefact is the conformance kit, which is a library rather than a playbook. (iteration 8)
- **Re-deriving the five conformance rules from the reference.** The plan already numbers the reference's five assertions and cites the line ranges of the reference's kit for each. (iteration 8)
- 012's scenario table is 30-plus rows that cite their own phases; verifying each would have repeated phase evidence this run already carries in iterations 1 to 7. (iteration 8)
- Searching OpenBot-main for a docs check produced one negative. A second search for a review or audit loop was not worth a call: the earlier iterations found its audit rows described as product behaviour, not as a review process. (iteration 8)
- **Ranking only the five crates the topic names.** The measurement in finding 1 makes that set the smallest end of the tree; the ranking above covers all twenty-one. (iteration 9)
- **Reading `tinyartifacts`.** The directory is `tiny-artifacts` and the crate is 6,720 lines; its value is below the resolution of this ranking. (iteration 9)
- **Reading `tinycomputer` and `tinyvoice`.** Both are excluded surfaces in the parity synthesis, and their sizes settle the ranking without reading them. (iteration 9)
- `tinyagents`'s internal `vendor/tinytools` is patched into the workspace through three `[patch]` entries; [SOURCE: specs/system-skilled-bots/context/openhuman-full/Cargo.toml:50-64] the redirection is a build detail with no product value. (iteration 9)
- No crate in the tree is permissively licensed; the licence check is one file for all twenty-one. (iteration 9)
- **`buzz`'s admin surface, `rakazo`'s auth and DB, `OpenMausBot`'s relay and devices.** Every one is named in the parity synthesis's skip list, and their sizes are platform-sized. (iteration 10)
- **Re-reading `hermes-muse`'s skills folder.** It is a companion's prompt skills, which the plan already handles as skill bodies. (iteration 10)
- **Treating `OpenMausBot`'s `announcements` folder as a new capability.** It is a notification surface, and iteration 6 already took the discipline worth having from the reference. (iteration 10)
- `buzz`'s benchmarks and `HYPOTHESIS.md`/`lint_hypothesis.py` in turnstone are interesting process artefacts and no capability; not ranked. (iteration 10)
- A full read of `turnstone`'s eval module was not needed: the case format and the two scoring tests establish both the mechanism and that it is tested. (iteration 10)

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
Frontier node F-2-006 (depth 2, scope specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/api.rs, specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/api.rs, specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue): Which transports can prove a send never left (NotSent reconciliation) from their own error shape, and which must treat every ambiguous result as unknown?

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
- Reference repos (read-only): `specs/system-skilled-bots/context/` with OpenBot-main (primary), OpenMausBot-main, rakazo-main, openhuman-main, openhuman-full, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main, tinychannels-main.
- Build plan (read-only): `specs/system-skilled-bots/003-openbot-parity-build/` fourteen phase folders plus `contracts/`.
- Earlier syntheses (read-only): `specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md`, `002-plan-review-research/research/research.md`, `003-plan-depth-research/research/research.md`.
- Built runtime (read-only): `.skilled/skills/system-skilled-bots/runtime/lib/`, `.skilled/bin/bots.cjs`, `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs`.
- resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

- Source pointers: the ten context repos and their build files; the 003 phase folders; the three prior syntheses.
- Reuse candidates: OpenBot-main channel/queue code, openhuman-full vendored crates.
- Constraints: no out-of-lineage writes; every claim needs `[SOURCE: path:line]`; mark observed vs inferred.

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
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-11-27T07:21:04.081Z
