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
version: 1.14.3.0
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
- [x] openhuman-full, never studied before: what do its five vendored crates (tinyagents, tinyconnectors, tinymemory, tinyhumans-sdk, tinysecurity) and its built openhuman-tui crate hold that openhuman-main lacks, and what does that change for phase 003-terminal-screen and its six children and for any other planned phase?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Not a build: no phase file, contract or runtime file outside this lineage directory is edited.
- Not a repeat of the three earlier syntheses: a finding one of them already carries is cited to that synthesis section, not restated.
- Not a full audit of the ten repos: net-new candidates are ranked and sized, not specified.
- Not a licence opinion beyond naming the licence of each cited source.

---

## 5. STOP CONDITIONS
- `maxIterations` 10, the bound stop policy, so every iteration runs.
- Stop early only on an unrecoverable state or gateway refusal.
- All fourteen 003 phases carry at least one cited finding, and the net-new ranking is published in `research.md`.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- openhuman-full, never studied before: what do its five vendored crates (tinyagents, tinyconnectors, tinymemory, tinyhumans-sdk, tinysecurity) and its built openhuman-tui crate hold that openhuman-main lacks, and what does that change for phase 003-terminal-screen and its six children and for any other planned phase?

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
### **A per-phase "readiness" score.** The three earlier syntheses already produce verdict-per-phase tables and the plan-depth run downgraded and rejected findings with reasons; a fourth score would be a fourth scale. This iteration states coverage as counts plus the one qualitative fact that matters (whether a reference implementation exists behind the finding), and leaves scoring to 014-deep-review. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **A per-phase "readiness" score.** The three earlier syntheses already produce verdict-per-phase tables and the plan-depth run downgraded and rejected findings with reasons; a fourth score would be a fourth scale. This iteration states coverage as counts plus the one qualitative fact that matters (whether a reference implementation exists behind the finding), and leaves scoring to 014-deep-review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A per-phase "readiness" score.** The three earlier syntheses already produce verdict-per-phase tables and the plan-depth run downgraded and rejected findings with reasons; a fourth score would be a fourth scale. This iteration states coverage as counts plus the one qualitative fact that matters (whether a reference implementation exists behind the finding), and leaves scoring to 014-deep-review.

### **Adding `--demo` as a phase-003 requirement.** The reference's `--demo` offline preview is the closest thing to a deterministic renderer harness, but `006-hardening-and-proof` names it and rules it out ("a `--demo` binary, a bench flag, mouse support and a theme picker - the parent rules each out"), and REQ-022 already proves the answer path through a release `pty_smoke` run. Not a gap; not a finding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Adding `--demo` as a phase-003 requirement.** The reference's `--demo` offline preview is the closest thing to a deterministic renderer harness, but `006-hardening-and-proof` names it and rules it out ("a `--demo` binary, a bench flag, mouse support and a theme picker - the parent rules each out"), and REQ-022 already proves the answer path through a release `pty_smoke` run. Not a gap; not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Adding `--demo` as a phase-003 requirement.** The reference's `--demo` offline preview is the closest thing to a deterministic renderer harness, but `006-hardening-and-proof` names it and rules it out ("a `--demo` binary, a bench flag, mouse support and a theme picker - the parent rules each out"), and REQ-022 already proves the answer path through a release `pty_smoke` run. Not a gap; not a finding.

### **Claiming `apps:` as a sandbox gap.** It is not a gap: 007's scope boundary says the key is a filter and confines no child, which is the honest statement the reference's `unknown tools deny` default would otherwise be cited against. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Claiming `apps:` as a sandbox gap.** It is not a gap: 007's scope boundary says the key is a filter and confines no child, which is the honest statement the reference's `unknown tools deny` default would otherwise be cited against.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Claiming `apps:` as a sandbox gap.** It is not a gap: 007's scope boundary says the key is a filter and confines no child, which is the honest statement the reference's `unknown tools deny` default would otherwise be cited against.

### **Claiming the plan lacks an inbound dedupe story.** REQ-006 resolves a press or reply with no approval-index entry through `answerItem`'s existing answered-or-expired row, which is what "a second press, a redelivery after a crash and the second chat of a two-target bot" reach. That is a dedupe path, so no gap. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Claiming the plan lacks an inbound dedupe story.** REQ-006 resolves a press or reply with no approval-index entry through `answerItem`'s existing answered-or-expired row, which is what "a second press, a redelivery after a crash and the second chat of a two-target bot" reach. That is a dedupe path, so no gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Claiming the plan lacks an inbound dedupe story.** REQ-006 resolves a press or reply with no approval-index entry through `answerItem`'s existing answered-or-expired row, which is what "a second press, a redelivery after a crash and the second chat of a two-target bot" reach. That is a dedupe path, so no gap.

### **Closing the `tinyjuice` question by inspection.** Its README is a logo and a broken image link, and `tinyflows`' README points at tinyjuice's image, so the two are related but neither describes itself. No claim is made; a later iteration can open its crate list. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Closing the `tinyjuice` question by inspection.** Its README is a logo and a broken image link, and `tinyflows`' README points at tinyjuice's image, so the two are related but neither describes itself. No claim is made; a later iteration can open its crate list.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Closing the `tinyjuice` question by inspection.** Its README is a logo and a broken image link, and `tinyflows`' README points at tinyjuice's image, so the two are related but neither describes itself. No claim is made; a later iteration can open its crate list.

### **Comparing the reference's legacy `Channel` API against its v2 `ChannelAdapter`.** The README says the legacy surface "remains for source compatibility and is not the production factory path", which is a two-contract lesson the plan already avoids by defining one adapter contract (REQ-001). Nothing to add. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Comparing the reference's legacy `Channel` API against its v2 `ChannelAdapter`.** The README says the legacy surface "remains for source compatibility and is not the production factory path", which is a two-contract lesson the plan already avoids by defining one adapter contract (REQ-001). Nothing to add.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Comparing the reference's legacy `Channel` API against its v2 `ChannelAdapter`.** The README says the legacy surface "remains for source compatibility and is not the production factory path", which is a two-contract lesson the plan already avoids by defining one adapter contract (REQ-001). Nothing to add.

### **Copying `llms-full.txt` as a second generated artifact.** A 3,231-line concatenation is a distribution format for a published corpus; this repo's docs are read in place, so the index alone earns its place. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Copying `llms-full.txt` as a second generated artifact.** A 3,231-line concatenation is a distribution format for a published corpus; this repo's docs are read in place, so the index alone earns its place.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Copying `llms-full.txt` as a second generated artifact.** A 3,231-line concatenation is a distribution format for a published corpus; this repo's docs are read in place, so the index alone earns its place.

### **Finding a duplicate-send gap in the plan's queue.** There is none: REQ-013 already records an uncertain or orphaned `sending` entry as `unknown`, never retries it, writes the state to the run record, and prints M21, with an acceptance criterion that names the exact test. The reference's queue state machine is the same shape, so the comparison confirms the plan and produces no finding. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Finding a duplicate-send gap in the plan's queue.** There is none: REQ-013 already records an uncertain or orphaned `sending` entry as `unknown`, never retries it, writes the state to the run record, and prints M21, with an acceptance criterion that names the exact test. The reference's queue state machine is the same shape, so the comparison confirms the plan and produces no finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Finding a duplicate-send gap in the plan's queue.** There is none: REQ-013 already records an uncertain or orphaned `sending` entry as `unknown`, never retries it, writes the state to the run record, and prints M21, with an acceptance criterion that names the exact test. The reference's queue state machine is the same shape, so the comparison confirms the plan and produces no finding.

### **Lifting `_one_line`'s 400-character summary cap as a requirement.** The plan already clips `grants.action` to 120 characters and puts only stderr's first line in the status row, so the reference's cap is a weaker version of a rule the plan has. The one detail worth keeping is the reason: the reference caps because "its line feeds could push the card and its RISK line off screen", which is the same argument the plan's status-row rule makes. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Lifting `_one_line`'s 400-character summary cap as a requirement.** The plan already clips `grants.action` to 120 characters and puts only stderr's first line in the status row, so the reference's cap is a weaker version of a rule the plan has. The one detail worth keeping is the reason: the reference caps because "its line feeds could push the card and its RISK line off screen", which is the same argument the plan's status-row rule makes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Lifting `_one_line`'s 400-character summary cap as a requirement.** The plan already clips `grants.action` to 120 characters and puts only stderr's first line in the status row, so the reference's cap is a weaker version of a rule the plan has. The one detail worth keeping is the reason: the reference caps because "its line feeds could push the card and its RISK line off screen", which is the same argument the plan's status-row rule makes.

### **Lifting any code from the vendor tree.** GPL-3.0-only across all 21 crates. Every item above is a rule set or a design, and the finding says so per item rather than once. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Lifting any code from the vendor tree.** GPL-3.0-only across all 21 crates. Every item above is a rule set or a design, and the finding says so per item rather than once.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Lifting any code from the vendor tree.** GPL-3.0-only across all 21 crates. Every item above is a rule set or a design, and the finding says so per item rather than once.

### **Lifting any vendored crate.** All five name GPL-3.0-only in their own `LICENSE` (and 25 of their crate manifests say `license = "GPL-3.0-only"`), the same licence as openhuman itself. They are design references only; no function is copyable into this MIT tree. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Lifting any vendored crate.** All five name GPL-3.0-only in their own `LICENSE` (and 25 of their crate manifests say `license = "GPL-3.0-only"`), the same licence as openhuman itself. They are design references only; no function is copyable into this MIT tree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Lifting any vendored crate.** All five name GPL-3.0-only in their own `LICENSE` (and 25 of their crate manifests say `license = "GPL-3.0-only"`), the same licence as openhuman itself. They are design references only; no function is copyable into this MIT tree.

### **Lifting turnstone's body-free index into 005.** It solves a problem the plan does not have: the index exists because turnstone's memory is unbounded and bodies cannot be injected, while the plan's bound is 3.6 KB, which is cheaper to inject whole than to index and then fetch. The plan's choice is the one the evidence supports; only the pinned-block consequence (finding 3) needs closing. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Lifting turnstone's body-free index into 005.** It solves a problem the plan does not have: the index exists because turnstone's memory is unbounded and bodies cannot be injected, while the plan's bound is 3.6 KB, which is cheaper to inject whole than to index and then fetch. The plan's choice is the one the evidence supports; only the pinned-block consequence (finding 3) needs closing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Lifting turnstone's body-free index into 005.** It solves a problem the plan does not have: the index exists because turnstone's memory is unbounded and bodies cannot be injected, while the plan's bound is 3.6 KB, which is cheaper to inject whole than to index and then fetch. The plan's choice is the one the evidence supports; only the pinned-block consequence (finding 3) needs closing.

### **Merging the net-new ranking into the parity synthesis's ranked build order.** The two orders answer different questions — the build order ranks *planned phases*, the ranking above ranks *unplanned candidates* — and merging them would put a what-if verb ahead of the routine layer for no reason. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Merging the net-new ranking into the parity synthesis's ranked build order.** The two orders answer different questions — the build order ranks *planned phases*, the ranking above ranks *unplanned candidates* — and merging them would put a what-if verb ahead of the routine layer for no reason.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Merging the net-new ranking into the parity synthesis's ranked build order.** The two orders answer different questions — the build order ranks *planned phases*, the ranking above ranks *unplanned candidates* — and merging them would put a what-if verb ahead of the routine layer for no reason.

### **Proposing a fourth alignment command.** 013 already runs two generators and a re-run loop with a parsed `Open findings:` grammar; a doc index is a generated artifact of the run, not a third command. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Proposing a fourth alignment command.** 013 already runs two generators and a re-run loop with a parsed `Open findings:` grammar; a doc index is a generated artifact of the run, not a third command.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Proposing a fourth alignment command.** 013 already runs two generators and a re-run loop with a parsed `Open findings:` grammar; a doc index is a generated artifact of the run, not a third command.

### **Proposing a full policy engine for 007.** The reference's `tinysecurity-policy` is a 288k-line workspace whose engine folds three inputs into one verdict and whose bus carries a versioned contract; the plan's own scope boundary declines a rule store, and findings 1 to 3 are the three checks that fit without one. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Proposing a full policy engine for 007.** The reference's `tinysecurity-policy` is a 288k-line workspace whose engine folds three inputs into one verdict and whose bus carries a versioned contract; the plan's own scope boundary declines a rule store, and findings 1 to 3 are the three checks that fit without one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Proposing a full policy engine for 007.** The reference's `tinysecurity-policy` is a 288k-line workspace whose engine folds three inputs into one verdict and whose bus carries a versioned contract; the plan's own scope boundary declines a rule store, and findings 1 to 3 are the three checks that fit without one.

### **Proposing openhuman's `FINDINGS-*.md` as a required file per review.** One note per finding would duplicate what 014's review report already holds; the finding keeps the two *sections* (rejected hypothesis, correction) and not the file-per-note convention. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Proposing openhuman's `FINDINGS-*.md` as a required file per review.** One note per finding would duplicate what 014's review report already holds; the finding keeps the two *sections* (rejected hypothesis, correction) and not the file-per-note convention.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Proposing openhuman's `FINDINGS-*.md` as a required file per review.** One note per finding would duplicate what 014's review report already holds; the finding keeps the two *sections* (rejected hypothesis, correction) and not the file-per-note convention.

### **Ranking `learning.ts` (335 lines) as a net-new item.** Its per-agent learning targets and its "who reviews what a person's own Learning space proposes" default-to-admins rule is the same question 009's proposal review and 011's roster already answer with `operators.json`; adding a second review-routing mechanism would duplicate the roster. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Ranking `learning.ts` (335 lines) as a net-new item.** Its per-agent learning targets and its "who reviews what a person's own Learning space proposes" default-to-admins rule is the same question 009's proposal review and 011's roster already answer with `operators.json`; adding a second review-routing mechanism would duplicate the roster.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Ranking `learning.ts` (335 lines) as a net-new item.** Its per-agent learning targets and its "who reviews what a person's own Learning space proposes" default-to-admins rule is the same question 009's proposal review and 011's roster already answer with `operators.json`; adding a second review-routing mechanism would duplicate the roster.

### **Ranking `security-floor.ts` (351 lines) as a net-new item.** A signed `security-floor.json` published beside the update feed, which raises a minimum safe app version and shows one notice below it, is real engineering for a product that ships signed desktop installers. This build ships a repository and a CLI, where `git pull` is the update path, so the value to a small team is near zero. Not ranked. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Ranking `security-floor.ts` (351 lines) as a net-new item.** A signed `security-floor.json` published beside the update feed, which raises a minimum safe app version and shows one notice below it, is real engineering for a product that ships signed desktop installers. This build ships a repository and a CLI, where `git pull` is the update path, so the value to a small team is near zero. Not ranked.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Ranking `security-floor.ts` (351 lines) as a net-new item.** A signed `security-floor.json` published beside the update feed, which raises a minimum safe app version and shows one notice below it, is real engineering for a product that ships signed desktop installers. This build ships a repository and a CLI, where `git pull` is the update path, so the value to a small team is near zero. Not ranked.

### **Ranking `tinycomputer` and `tinybox` as net-new candidates.** They are the two largest crates in the tree (630,174 and 159,147 lines) and both exist to give a bot a machine. 004-computer-exposure declined that, with evidence, and the parity synthesis's eliminated-alternatives row records it. Their size is the argument *against* them for a small team, not for them. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Ranking `tinycomputer` and `tinybox` as net-new candidates.** They are the two largest crates in the tree (630,174 and 159,147 lines) and both exist to give a bot a machine. 004-computer-exposure declined that, with evidence, and the parity synthesis's eliminated-alternatives row records it. Their size is the argument *against* them for a small team, not for them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Ranking `tinycomputer` and `tinybox` as net-new candidates.** They are the two largest crates in the tree (630,174 and 159,147 lines) and both exist to give a bot a machine. 004-computer-exposure declined that, with evidence, and the parity synthesis's eliminated-alternatives row records it. Their size is the argument *against* them for a small team, not for them.

### **Re-opening 004's container question.** OpenBot's `computer-start.ts` and `computer-token.ts` are the container's own bootstrap and token derivation; 004 declines the container, so their evidence lands on a refused capability. The parity synthesis's eliminated-alternatives row already records that refusal. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Re-opening 004's container question.** OpenBot's `computer-start.ts` and `computer-token.ts` are the container's own bootstrap and token derivation; 004 declines the container, so their evidence lands on a refused capability. The parity synthesis's eliminated-alternatives row already records that refusal.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-opening 004's container question.** OpenBot's `computer-start.ts` and `computer-token.ts` are the container's own bootstrap and token derivation; 004 declines the container, so their evidence lands on a refused capability. The parity synthesis's eliminated-alternatives row already records that refusal.

### **Re-opening any finding to raise its severity.** This is a reading iteration, not a re-adjudication; where a rank moved (finding 3, items 1 and 11) the iteration says which earlier finding it came from. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **Re-opening any finding to raise its severity.** This is a reading iteration, not a re-adjudication; where a rank moved (finding 3, items 1 and 11) the iteration says which earlier finding it came from.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-opening any finding to raise its severity.** This is a reading iteration, not a re-adjudication; where a rank moved (finding 3, items 1 and 11) the iteration says which earlier finding it came from.

### **Reading `rakazo-main` for per-agent tool filtering.** A grep for `allowedTools`, `toolAllowlist` and `enabledTools` over its `packages/core/src` returned no file, so rakazo does not carry the pattern; the search is recorded rather than repeated. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Reading `rakazo-main` for per-agent tool filtering.** A grep for `allowedTools`, `toolAllowlist` and `enabledTools` over its `packages/core/src` returned no file, so rakazo does not carry the pattern; the search is recorded rather than repeated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `rakazo-main` for per-agent tool filtering.** A grep for `allowedTools`, `toolAllowlist` and `enabledTools` over its `packages/core/src` returned no file, so rakazo does not carry the pattern; the search is recorded rather than repeated.

### **Reading `tinysecurity`'s sandbox and egress crates for this iteration.** `tinysecurity-sandbox`, `tinysecurity-egress` and `tinysecurity-crypto` all exist and are large, but 004-computer-exposure already rules out a browser computer and a container per bot, so their evidence would land on a phase that has declined the capability. Recorded for a later iteration only if 004's decision is revisited. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Reading `tinysecurity`'s sandbox and egress crates for this iteration.** `tinysecurity-sandbox`, `tinysecurity-egress` and `tinysecurity-crypto` all exist and are large, but 004-computer-exposure already rules out a browser computer and a container per bot, so their evidence would land on a phase that has declined the capability. Recorded for a later iteration only if 004's decision is revisited.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `tinysecurity`'s sandbox and egress crates for this iteration.** `tinysecurity-sandbox`, `tinysecurity-egress` and `tinysecurity-crypto` all exist and are large, but 004-computer-exposure already rules out a browser computer and a container per bot, so their evidence would land on a phase that has declined the capability. Recorded for a later iteration only if 004's decision is revisited.

### **Reading OpenBot's routine UI tests** (`routine-plan.test.ts`, `new-routine-form.test.tsx`, `routine-edit.test.tsx` and eleven more) for phase 002. They test a React routine editor the plan deliberately does not build — `bots routines` is a list — so their evidence would land on a surface 003 declined. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Reading OpenBot's routine UI tests** (`routine-plan.test.ts`, `new-routine-form.test.tsx`, `routine-edit.test.tsx` and eleven more) for phase 002. They test a React routine editor the plan deliberately does not build — `bots routines` is a list — so their evidence would land on a surface 003 declined.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading OpenBot's routine UI tests** (`routine-plan.test.ts`, `new-routine-form.test.tsx`, `routine-edit.test.tsx` and eleven more) for phase 002. They test a React routine editor the plan deliberately does not build — `bots routines` is a list — so their evidence would land on a surface 003 declined.

### **Reading OpenGhost's cross-window reload path (`store.onChange`, `SAVE_DELAY = 400`).** It exists because two Electron windows share one memory; the runtime has one process per run and no second window, so it is dead code for this build. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Reading OpenGhost's cross-window reload path (`store.onChange`, `SAVE_DELAY = 400`).** It exists because two Electron windows share one memory; the runtime has one process per run and no second window, so it is dead code for this build.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading OpenGhost's cross-window reload path (`store.onChange`, `SAVE_DELAY = 400`).** It exists because two Electron windows share one memory; the runtime has one process per run and no second window, so it is dead code for this build.

### **Reading openhuman's `e2e/` directory as a corpus.** It is a Docker Compose harness (`docker-compose.yml`, `run-local.sh`, an entrypoint script) for a containerised stack the build does not have, so its shape does not transfer. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Reading openhuman's `e2e/` directory as a corpus.** It is a Docker Compose harness (`docker-compose.yml`, `run-local.sh`, an entrypoint script) for a containerised stack the build does not have, so its shape does not transfer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading openhuman's `e2e/` directory as a corpus.** It is a Docker Compose harness (`docker-compose.yml`, `run-local.sh`, an entrypoint script) for a containerised stack the build does not have, so its shape does not transfer.

### **Reading openhuman's composer** (`src/composer.rs`, 343 lines) for the paste rule. The README's controls table states the rule normatively, and the implementation would only show the escape sequence it listens for, which the plan's crate would pick for itself. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Reading openhuman's composer** (`src/composer.rs`, 343 lines) for the paste rule. The README's controls table states the rule normatively, and the implementation would only show the escape sequence it listens for, which the plan's crate would pick for itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading openhuman's composer** (`src/composer.rs`, 343 lines) for the paste rule. The README's controls table states the rule normatively, and the implementation would only show the escape sequence it listens for, which the plan's crate would pick for itself.

### **Recording the sanitizer rule as a new gap in `004-panes`.** It is not a gap: REQ-021 lands exactly the rule the reference's filter is not, and the citation to `theme.rs` is already in the plan. Only the filter-versus-replace divergence is new, and it is finding 5. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Recording the sanitizer rule as a new gap in `004-panes`.** It is not a gap: REQ-021 lands exactly the rule the reference's filter is not, and the citation to `theme.rs` is already in the plan. Only the filter-versus-replace divergence is new, and it is finding 5.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Recording the sanitizer rule as a new gap in `004-panes`.** It is not a gap: REQ-021 lands exactly the rule the reference's filter is not, and the citation to `theme.rs` is already in the plan. Only the filter-versus-replace divergence is new, and it is finding 5.

### **Reusing `tinysecurity-audit`'s journal design as a 006 finding.** The crate's own doc ("Sanitized ordered audit batches and restricted durable native storage") is real, but the plan already writes JSONL under a 0700 state root and defers grant audit rows to a later packet by decision, so the difference is one of degree and produced no finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Reusing `tinysecurity-audit`'s journal design as a 006 finding.** The crate's own doc ("Sanitized ordered audit batches and restricted durable native storage") is real, but the plan already writes JSONL under a 0700 state root and defers grant audit rows to a later packet by decision, so the difference is one of degree and produced no finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reusing `tinysecurity-audit`'s journal design as a 006 finding.** The crate's own doc ("Sanitized ordered audit batches and restricted durable native storage") is real, but the plan already writes JSONL under a 0700 state root and defers grant audit rows to a later packet by decision, so the difference is one of degree and produced no finding.

### **Treating `tinymcp` as an MCP client.** Its name promises one; its README opens "A production-ready Rust 2024 TinyBus module template used by TinyHumans AI". Recorded because a name-based search would have cited it as evidence that the reference has first-class MCP support, which it does not. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Treating `tinymcp` as an MCP client.** Its name promises one; its README opens "A production-ready Rust 2024 TinyBus module template used by TinyHumans AI". Recorded because a name-based search would have cited it as evidence that the reference has first-class MCP support, which it does not.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `tinymcp` as an MCP client.** Its name promises one; its README opens "A production-ready Rust 2024 TinyBus module template used by TinyHumans AI". Recorded because a name-based search would have cited it as evidence that the reference has first-class MCP support, which it does not.

### **Treating `what-if.ts` as a 006 requirement.** It is not: 006 is a build packet for the grant record and the ladder's first rung, and a what-if verb is a read over deciders that must exist first. It is a net-new candidate for a later packet, and finding 2 says so. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Treating `what-if.ts` as a 006 requirement.** It is not: 006 is a build packet for the grant record and the ladder's first rung, and a what-if verb is a read over deciders that must exist first. It is a net-new candidate for a later packet, and finding 2 says so.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating `what-if.ts` as a 006 requirement.** It is not: 006 is a build packet for the grant record and the ladder's first rung, and a what-if verb is a read over deciders that must exist first. It is a net-new candidate for a later packet, and finding 2 says so.

### **Treating openhuman-full as a new TUI design source.** Reading it as a second TUI would have been wasted work: `crates/openhuman-tui/src/` is byte-for-byte the same file list and the same size as `openhuman-main`'s, and the plan already cites that source. Read as a *vendored-crate* source instead, which is where the 658 MB of difference lives. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Treating openhuman-full as a new TUI design source.** Reading it as a second TUI would have been wasted work: `crates/openhuman-tui/src/` is byte-for-byte the same file list and the same size as `openhuman-main`'s, and the plan already cites that source. Read as a *vendored-crate* source instead, which is where the 658 MB of difference lives.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating openhuman-full as a new TUI design source.** Reading it as a second TUI would have been wasted work: `crates/openhuman-tui/src/` is byte-for-byte the same file list and the same size as `openhuman-main`'s, and the plan already cites that source. Read as a *vendored-crate* source instead, which is where the 658 MB of difference lives.

### **Treating the diff-preview finding as a 010 item.** A conversation shows what was said, not what an action will change; the preview belongs to the approval card. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Treating the diff-preview finding as a 010 item.** A conversation shows what was said, not what an action will change; the preview belongs to the approval card.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the diff-preview finding as a 010 item.** A conversation shows what was said, not what an action will change; the preview belongs to the approval card.

### **Treating the permission ladder as a 009-skills item.** A skill declares `allowed-tools` in its frontmatter (the reference parses it as "scalar or sequence"), but the skill's declaration is a *claim about the skill*, not a ceiling on the caller, and 009's own caps already bound what a skill can inject. The ceiling belongs to the bot. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: **Treating the permission ladder as a 009-skills item.** A skill declares `allowed-tools` in its frontmatter (the reference parses it as "scalar or sequence"), but the skill's declaration is a *claim about the skill*, not a ceiling on the caller, and 009's own caps already bound what a skill can inject. The ceiling belongs to the bot.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the permission ladder as a 009-skills item.** A skill declares `allowed-tools` in its frontmatter (the reference parses it as "scalar or sequence"), but the skill's declaration is a *claim about the skill*, not a ceiling on the caller, and 009's own caps already bound what a skill can inject. The ceiling belongs to the bot.

### `014-deep-review/spec.md` was read for the words `ruled out`, `hypothesis` and `correction` and returned nothing, which is what finding 5 rests on; the absence of a word is weaker evidence than the presence of a requirement, so the finding is stated as "does not require" and not "forbids". -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `014-deep-review/spec.md` was read for the words `ruled out`, `hypothesis` and `correction` and returned nothing, which is what finding 5 rests on; the absence of a word is weaker evidence than the presence of a requirement, so the finding is stated as "does not require" and not "forbids".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `014-deep-review/spec.md` was read for the words `ruled out`, `hypothesis` and `correction` and returned nothing, which is what finding 5 rests on; the absence of a word is weaker evidence than the presence of a requirement, so the finding is stated as "does not require" and not "forbids".

### `find … -print0 | xargs -0 wc -l | tail -1` printed `17,485 total`, which is one `xargs` batch's total rather than the tree's; the correct figure came from `… | xargs -0 cat | wc -l` (4,379,258). Recorded because the wrong number was believable and would have understated the tree by two orders of magnitude. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `find … -print0 | xargs -0 wc -l | tail -1` printed `17,485 total`, which is one `xargs` batch's total rather than the tree's; the correct figure came from `… | xargs -0 cat | wc -l` (4,379,258). Recorded because the wrong number was believable and would have understated the tree by two orders of magnitude.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `find … -print0 | xargs -0 wc -l | tail -1` printed `17,485 total`, which is one `xargs` batch's total rather than the tree's; the correct figure came from `… | xargs -0 cat | wc -l` (4,379,258). Recorded because the wrong number was believable and would have understated the tree by two orders of magnitude.

### `find … | xargs grep -ln "class StructuredMemory"` returned no file, yet `grep -ln` over the same tree had already named `turnstone/core/memory.py` and `turnstone/core/memory_index.py`. The `xargs` form silently dropped the paths, so the class body was never read; the doc plus the module names were enough, and no claim rests on the class body. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `find … | xargs grep -ln "class StructuredMemory"` returned no file, yet `grep -ln` over the same tree had already named `turnstone/core/memory.py` and `turnstone/core/memory_index.py`. The `xargs` form silently dropped the paths, so the class body was never read; the doc plus the module names were enough, and no claim rests on the class body.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `find … | xargs grep -ln "class StructuredMemory"` returned no file, yet `grep -ln` over the same tree had already named `turnstone/core/memory.py` and `turnstone/core/memory_index.py`. The `xargs` form silently dropped the paths, so the class body was never read; the doc plus the module names were enough, and no claim rests on the class body.

### `find` over `tinychannels` for `*.ts` returned 0 lines and a `wc` of 0, which is not a fact about the repo: the crate is Rust (`crates/tinychannels-*`), so the TypeScript search found nothing. Recorded so a later iteration does not repeat it as a content claim. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `find` over `tinychannels` for `*.ts` returned 0 lines and a `wc` of 0, which is not a fact about the repo: the crate is Rust (`crates/tinychannels-*`), so the TypeScript search found nothing. Recorded so a later iteration does not repeat it as a content claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `find` over `tinychannels` for `*.ts` returned 0 lines and a `wc` of 0, which is not a fact about the repo: the crate is Rust (`crates/tinychannels-*`), so the TypeScript search found nothing. Recorded so a later iteration does not repeat it as a content claim.

### `grep` for `actor|onBehalfOf|actedBy|requestedBy` in `app/src/lib/bot-lifecycle/queries.ts` produced one unrelated comment line, so no claim about how OpenBot attributes a scheduled action to a person is made. The parity synthesis's open question 1 (who is the actor for a scheduled run) therefore remains open on the reference side, and this iteration adds nothing to it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `grep` for `actor|onBehalfOf|actedBy|requestedBy` in `app/src/lib/bot-lifecycle/queries.ts` produced one unrelated comment line, so no claim about how OpenBot attributes a scheduled action to a person is made. The parity synthesis's open question 1 (who is the actor for a scheduled run) therefore remains open on the reference side, and this iteration adds nothing to it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `grep` for `actor|onBehalfOf|actedBy|requestedBy` in `app/src/lib/bot-lifecycle/queries.ts` produced one unrelated comment line, so no claim about how OpenBot attributes a scheduled action to a person is made. The parity synthesis's open question 1 (who is the actor for a scheduled run) therefore remains open on the reference side, and this iteration adds nothing to it.

### `grep` for `pub fn`/`max_`/`rotate` in `tinysecurity-audit/src/rotation.rs` returned nothing, and `journal.rs` has no exported bound either; the rotation story could not be established from exported names, so no claim about audit-log growth is made. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `grep` for `pub fn`/`max_`/`rotate` in `tinysecurity-audit/src/rotation.rs` returned nothing, and `journal.rs` has no exported bound either; the rotation story could not be established from exported names, so no claim about audit-log growth is made.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `grep` for `pub fn`/`max_`/`rotate` in `tinysecurity-audit/src/rotation.rs` returned nothing, and `journal.rs` has no exported bound either; the rotation story could not be established from exported names, so no claim about audit-log growth is made.

### `grep` for `REQ-0` in `010-conversations/spec.md` returned two rows that are *requirement-id history*, not requirements: the phase parent assigns its children's id ranges and records two renumbering decisions. The real requirement tables live in the three children, which is where they were read. Recorded so a later iteration does not mistake the parent's range table for a missing requirement list. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `grep` for `REQ-0` in `010-conversations/spec.md` returned two rows that are *requirement-id history*, not requirements: the phase parent assigns its children's id ranges and records two renumbering decisions. The real requirement tables live in the three children, which is where they were read. Recorded so a later iteration does not mistake the parent's range table for a missing requirement list.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `grep` for `REQ-0` in `010-conversations/spec.md` returned two rows that are *requirement-id history*, not requirements: the phase parent assigns its children's id ranges and records two renumbering decisions. The real requirement tables live in the three children, which is where they were read. Recorded so a later iteration does not mistake the parent's range table for a missing requirement list.

### `grep` for a `PermissionLevel` enum across `vendor/tinyagents` returned nothing, so the per-tool permission claim for phase 007 and 009 is **not** established this iteration. `tinyagents/crates/tinyagents-hooks/` holds `command/`, `lifecycle/`, `stop/`, `tool/`, `turn/`, `session/` and `scope.rs`, which is a hook seam worth a later read, but the file names alone are not evidence of a contract. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `grep` for a `PermissionLevel` enum across `vendor/tinyagents` returned nothing, so the per-tool permission claim for phase 007 and 009 is **not** established this iteration. `tinyagents/crates/tinyagents-hooks/` holds `command/`, `lifecycle/`, `stop/`, `tool/`, `turn/`, `session/` and `scope.rs`, which is a hook seam worth a later read, but the file names alone are not evidence of a contract.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `grep` for a `PermissionLevel` enum across `vendor/tinyagents` returned nothing, so the per-tool permission claim for phase 007 and 009 is **not** established this iteration. `tinyagents/crates/tinyagents-hooks/` holds `command/`, `lifecycle/`, `stop/`, `tool/`, `turn/`, `session/` and `scope.rs`, which is a hook seam worth a later read, but the file names alone are not evidence of a contract.

### `ls tinyartifacts` failed; the directory is `tiny-artifacts`. A hyphenated name is easy to lose in a list, and a later iteration should copy the name from `ls`. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `ls tinyartifacts` failed; the directory is `tiny-artifacts`. A hyphenated name is easy to lose in a list, and a later iteration should copy the name from `ls`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `ls tinyartifacts` failed; the directory is `tiny-artifacts`. A hyphenated name is easy to lose in a list, and a later iteration should copy the name from `ls`.

### A first draft of finding 1 carried the cite path through a `vendor/../crates` segment, which is both wrong and unreadable; it was replaced with the plain path before the iteration was recorded. Recorded because a SOURCE tag that resolves through `..` can still resolve, so a broken path is easy to leave in place. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A first draft of finding 1 carried the cite path through a `vendor/../crates` segment, which is both wrong and unreadable; it was replaced with the plain path before the iteration was recorded. Recorded because a SOURCE tag that resolves through `..` can still resolve, so a broken path is easy to leave in place.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A first draft of finding 1 carried the cite path through a `vendor/../crates` segment, which is both wrong and unreadable; it was replaced with the plain path before the iteration was recorded. Recorded because a SOURCE tag that resolves through `..` can still resolve, so a broken path is easy to leave in place.

### Nothing new was searched, so there is no dead end from searching. The one thing that did not work was attempting to state a coverage percentage: 50 findings over fourteen phases is not a percentage of anything, because a phase's reference surface is not enumerable. The count table is what survived. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Nothing new was searched, so there is no dead end from searching. The one thing that did not work was attempting to state a coverage percentage: 50 findings over fourteen phases is not a percentage of anything, because a phase's reference surface is not enumerable. The count table is what survived.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Nothing new was searched, so there is no dead end from searching. The one thing that did not work was attempting to state a coverage percentage: 50 findings over fourteen phases is not a percentage of anything, because a phase's reference surface is not enumerable. The count table is what survived.

### OpenBot's `shared/routine-firing.ts` continues past line 30 with the reader half (`readFiring`) and more failure notes; only the frame's declaration was read. The reader's stripping rule is not claimed here. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: OpenBot's `shared/routine-firing.ts` continues past line 30 with the reader half (`readFiring`) and more failure notes; only the frame's declaration was read. The reader's stripping rule is not claimed here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: OpenBot's `shared/routine-firing.ts` continues past line 30 with the reader half (`readFiring`) and more failure notes; only the frame's declaration was read. The reader's stripping rule is not claimed here.

### Reading `_show_lines`'s CR-LF rule as a finding for the plan's message storage: the plan already keeps every line feed and drops every other control character, "the carriage return included" (REQ-003, decision D10), which is the same rule with a clearer boundary. No finding. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Reading `_show_lines`'s CR-LF rule as a finding for the plan's message storage: the plan already keeps every line feed and drops every other control character, "the carriage return included" (REQ-003, decision D10), which is the same rule with a clearer boundary. No finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `_show_lines`'s CR-LF rule as a finding for the plan's message storage: the plan already keeps every line feed and drops every other control character, "the carriage return included" (REQ-003, decision D10), which is the same rule with a clearer boundary. No finding.

### Reading `OpenBot-main/docs/routines.md` around the count-reset rule to compare fatigue semantics produced nothing new: 002 REQ-006 already cites the exact line. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Reading `OpenBot-main/docs/routines.md` around the count-reset rule to compare fatigue semantics produced nothing new: 002 REQ-006 already cites the exact line.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `OpenBot-main/docs/routines.md` around the count-reset rule to compare fatigue semantics produced nothing new: 002 REQ-006 already cites the exact line.

### Reading `src/viewport.rs` for selection-anchor semantics (the plan's "a row selected by its index moves under the operator" defect) did not settle it: the cache anchors a *cached block* by index and offset (`anchor: Option<(usize, usize)>`), which is a scroll-position anchor for a transcript, not an identity anchor for a list. Not usable as evidence for the panes defect, so no claim is made. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading `src/viewport.rs` for selection-anchor semantics (the plan's "a row selected by its index moves under the operator" defect) did not settle it: the cache anchors a *cached block* by index and offset (`anchor: Option<(usize, usize)>`), which is a scroll-position anchor for a transcript, not an identity anchor for a list. Not usable as evidence for the panes defect, so no claim is made.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `src/viewport.rs` for selection-anchor semantics (the plan's "a row selected by its index moves under the operator" defect) did not settle it: the cache anchors a *cached block* by index and offset (`anchor: Option<(usize, usize)>`), which is a scroll-position anchor for a transcript, not an identity anchor for a list. Not usable as evidence for the panes defect, so no claim is made.

### The `grep -c "^| BOT-"` count of 33 is the scenario table's own count, not a coverage claim: several rows cite the same requirement, so "33 scenarios" does not mean 33 distinct behaviours. No coverage percentage is claimed from it. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The `grep -c "^| BOT-"` count of 33 is the scenario table's own count, not a coverage claim: several rows cite the same requirement, so "33 scenarios" does not mean 33 distinct behaviours. No coverage percentage is claimed from it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `grep -c "^| BOT-"` count of 33 is the scenario table's own count, not a coverage claim: several rows cite the same requirement, so "33 scenarios" does not mean 33 distinct behaviours. No coverage percentage is claimed from it.

### The delta aggregation read `iter-001` to `iter-009` by name rather than by listing the directory, so a future reader adding an iteration must extend the loop; recorded because a stale script is how a coverage table silently undercounts. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: The delta aggregation read `iter-001` to `iter-009` by name rather than by listing the directory, so a future reader adding an iteration must extend the loop; recorded because a stale script is how a coverage table silently undercounts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The delta aggregation read `iter-001` to `iter-009` by name rather than by listing the directory, so a future reader adding an iteration must extend the loop; recorded because a stale script is how a coverage table silently undercounts.

### The first grep for `PermissionLevel` over `vendor/tinyagents/crates` returned nothing, and the type turned out to live one level deeper, in `vendor/tinyagents/vendor/tinytools/crates/tinytools/src/permission/types.rs` — a *vendored crate inside a vendored crate*. Recorded because it explains why iteration 1's search came up empty and why a vendor tree needs a recursive search rather than a `crates/*/src/*.rs` glob. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: The first grep for `PermissionLevel` over `vendor/tinyagents/crates` returned nothing, and the type turned out to live one level deeper, in `vendor/tinyagents/vendor/tinytools/crates/tinytools/src/permission/types.rs` — a *vendored crate inside a vendored crate*. Recorded because it explains why iteration 1's search came up empty and why a vendor tree needs a recursive search rather than a `crates/*/src/*.rs` glob.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The first grep for `PermissionLevel` over `vendor/tinyagents/crates` returned nothing, and the type turned out to live one level deeper, in `vendor/tinyagents/vendor/tinytools/crates/tinytools/src/permission/types.rs` — a *vendored crate inside a vendored crate*. Recorded because it explains why iteration 1's search came up empty and why a vendor tree needs a recursive search rather than a `crates/*/src/*.rs` glob.

### The nine headers were read, not the bodies. Each finding's size is an estimate from the module's line count and its stated contract, and is marked as a size, not a measurement. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The nine headers were read, not the bodies. Each finding's size is an estimate from the module's line count and its stated contract, and is marked as a size, not a measurement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The nine headers were read, not the bodies. Each finding's size is an estimate from the module's line count and its stated contract, and is marked as a size, not a measurement.

### The plan-side `grep` for `base64|pem|entropy|luhn|IBAN` over `008-vault/design/leak-checks.md` returned only the base64 and URL-encoded forms, which is what finding 3 rests on; there is no separate entropy or PEM check to compare against, so the finding is stated as an addition, not as a conflict. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The plan-side `grep` for `base64|pem|entropy|luhn|IBAN` over `008-vault/design/leak-checks.md` returned only the base64 and URL-encoded forms, which is what finding 3 rests on; there is no separate entropy or PEM check to compare against, so the finding is stated as an addition, not as a conflict.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The plan-side `grep` for `base64|pem|entropy|luhn|IBAN` over `008-vault/design/leak-checks.md` returned only the base64 and URL-encoded forms, which is what finding 3 rests on; there is no separate entropy or PEM check to compare against, so the finding is stated as an addition, not as a conflict.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Adding `--demo` as a phase-003 requirement.** The reference's `--demo` offline preview is the closest thing to a deterministic renderer harness, but `006-hardening-and-proof` names it and rules it out ("a `--demo` binary, a bench flag, mouse support and a theme picker - the parent rules each out"), and REQ-022 already proves the answer path through a release `pty_smoke` run. Not a gap; not a finding. (iteration 1)
- **Lifting any vendored crate.** All five name GPL-3.0-only in their own `LICENSE` (and 25 of their crate manifests say `license = "GPL-3.0-only"`), the same licence as openhuman itself. They are design references only; no function is copyable into this MIT tree. (iteration 1)
- **Recording the sanitizer rule as a new gap in `004-panes`.** It is not a gap: REQ-021 lands exactly the rule the reference's filter is not, and the citation to `theme.rs` is already in the plan. Only the filter-versus-replace divergence is new, and it is finding 5. (iteration 1)
- **Treating openhuman-full as a new TUI design source.** Reading it as a second TUI would have been wasted work: `crates/openhuman-tui/src/` is byte-for-byte the same file list and the same size as `openhuman-main`'s, and the plan already cites that source. Read as a *vendored-crate* source instead, which is where the 658 MB of difference lives. (iteration 1)
- `grep` for a `PermissionLevel` enum across `vendor/tinyagents` returned nothing, so the per-tool permission claim for phase 007 and 009 is **not** established this iteration. `tinyagents/crates/tinyagents-hooks/` holds `command/`, `lifecycle/`, `stop/`, `tool/`, `turn/`, `session/` and `scope.rs`, which is a hook seam worth a later read, but the file names alone are not evidence of a contract. (iteration 1)
- Reading `src/viewport.rs` for selection-anchor semantics (the plan's "a row selected by its index moves under the operator" defect) did not settle it: the cache anchors a *cached block* by index and offset (`anchor: Option<(usize, usize)>`), which is a scroll-position anchor for a transcript, not an identity anchor for a list. Not usable as evidence for the panes defect, so no claim is made. (iteration 1)
- **Claiming `apps:` as a sandbox gap.** It is not a gap: 007's scope boundary says the key is a filter and confines no child, which is the honest statement the reference's `unknown tools deny` default would otherwise be cited against. (iteration 2)
- **Reading `tinysecurity`'s sandbox and egress crates for this iteration.** `tinysecurity-sandbox`, `tinysecurity-egress` and `tinysecurity-crypto` all exist and are large, but 004-computer-exposure already rules out a browser computer and a container per bot, so their evidence would land on a phase that has declined the capability. Recorded for a later iteration only if 004's decision is revisited. (iteration 2)
- **Reusing `tinysecurity-audit`'s journal design as a 006 finding.** The crate's own doc ("Sanitized ordered audit batches and restricted durable native storage") is real, but the plan already writes JSONL under a 0700 state root and defers grant audit rows to a later packet by decision, so the difference is one of degree and produced no finding. (iteration 2)
- `grep` for `pub fn`/`max_`/`rotate` in `tinysecurity-audit/src/rotation.rs` returned nothing, and `journal.rs` has no exported bound either; the rotation story could not be established from exported names, so no claim about audit-log growth is made. (iteration 2)
- The plan-side `grep` for `base64|pem|entropy|luhn|IBAN` over `008-vault/design/leak-checks.md` returned only the base64 and URL-encoded forms, which is what finding 3 rests on; there is no separate entropy or PEM check to compare against, so the finding is stated as an addition, not as a conflict. (iteration 2)
- **Claiming the plan lacks an inbound dedupe story.** REQ-006 resolves a press or reply with no approval-index entry through `answerItem`'s existing answered-or-expired row, which is what "a second press, a redelivery after a crash and the second chat of a two-target bot" reach. That is a dedupe path, so no gap. (iteration 3)
- **Comparing the reference's legacy `Channel` API against its v2 `ChannelAdapter`.** The README says the legacy surface "remains for source compatibility and is not the production factory path", which is a two-contract lesson the plan already avoids by defining one adapter contract (REQ-001). Nothing to add. (iteration 3)
- **Finding a duplicate-send gap in the plan's queue.** There is none: REQ-013 already records an uncertain or orphaned `sending` entry as `unknown`, never retries it, writes the state to the run record, and prints M21, with an acceptance criterion that names the exact test. The reference's queue state machine is the same shape, so the comparison confirms the plan and produces no finding. (iteration 3)
- **Reading OpenBot's routine UI tests** (`routine-plan.test.ts`, `new-routine-form.test.tsx`, `routine-edit.test.tsx` and eleven more) for phase 002. They test a React routine editor the plan deliberately does not build — `bots routines` is a list — so their evidence would land on a surface 003 declined. (iteration 3)
- `find` over `tinychannels` for `*.ts` returned 0 lines and a `wc` of 0, which is not a fact about the repo: the crate is Rust (`crates/tinychannels-*`), so the TypeScript search found nothing. Recorded so a later iteration does not repeat it as a content claim. (iteration 3)
- OpenBot's `shared/routine-firing.ts` continues past line 30 with the reader half (`readFiring`) and more failure notes; only the frame's declaration was read. The reader's stripping rule is not claimed here. (iteration 3)
- **Lifting turnstone's body-free index into 005.** It solves a problem the plan does not have: the index exists because turnstone's memory is unbounded and bodies cannot be injected, while the plan's bound is 3.6 KB, which is cheaper to inject whole than to index and then fetch. The plan's choice is the one the evidence supports; only the pinned-block consequence (finding 3) needs closing. (iteration 4)
- **Re-opening 004's container question.** OpenBot's `computer-start.ts` and `computer-token.ts` are the container's own bootstrap and token derivation; 004 declines the container, so their evidence lands on a refused capability. The parity synthesis's eliminated-alternatives row already records that refusal. (iteration 4)
- **Reading OpenGhost's cross-window reload path (`store.onChange`, `SAVE_DELAY = 400`).** It exists because two Electron windows share one memory; the runtime has one process per run and no second window, so it is dead code for this build. (iteration 4)
- `find … | xargs grep -ln "class StructuredMemory"` returned no file, yet `grep -ln` over the same tree had already named `turnstone/core/memory.py` and `turnstone/core/memory_index.py`. The `xargs` form silently dropped the paths, so the class body was never read; the doc plus the module names were enough, and no claim rests on the class body. (iteration 4)
- Reading `OpenBot-main/docs/routines.md` around the count-reset rule to compare fatigue semantics produced nothing new: 002 REQ-006 already cites the exact line. (iteration 4)
- **Ranking `learning.ts` (335 lines) as a net-new item.** Its per-agent learning targets and its "who reviews what a person's own Learning space proposes" default-to-admins rule is the same question 009's proposal review and 011's roster already answer with `operators.json`; adding a second review-routing mechanism would duplicate the roster. (iteration 5)
- **Ranking `security-floor.ts` (351 lines) as a net-new item.** A signed `security-floor.json` published beside the update feed, which raises a minimum safe app version and shows one notice below it, is real engineering for a product that ships signed desktop installers. This build ships a repository and a CLI, where `git pull` is the update path, so the value to a small team is near zero. Not ranked. (iteration 5)
- **Treating `what-if.ts` as a 006 requirement.** It is not: 006 is a build packet for the grant record and the ladder's first rung, and a what-if verb is a read over deciders that must exist first. It is a net-new candidate for a later packet, and finding 2 says so. (iteration 5)
- `grep` for `actor|onBehalfOf|actedBy|requestedBy` in `app/src/lib/bot-lifecycle/queries.ts` produced one unrelated comment line, so no claim about how OpenBot attributes a scheduled action to a person is made. The parity synthesis's open question 1 (who is the actor for a scheduled run) therefore remains open on the reference side, and this iteration adds nothing to it. (iteration 5)
- The nine headers were read, not the bodies. Each finding's size is an estimate from the module's line count and its stated contract, and is marked as a size, not a measurement. (iteration 5)
- **Lifting `_one_line`'s 400-character summary cap as a requirement.** The plan already clips `grants.action` to 120 characters and puts only stderr's first line in the status row, so the reference's cap is a weaker version of a rule the plan has. The one detail worth keeping is the reason: the reference caps because "its line feeds could push the card and its RISK line off screen", which is the same argument the plan's status-row rule makes. (iteration 6)
- **Reading openhuman's composer** (`src/composer.rs`, 343 lines) for the paste rule. The README's controls table states the rule normatively, and the implementation would only show the escape sequence it listens for, which the plan's crate would pick for itself. (iteration 6)
- **Treating the diff-preview finding as a 010 item.** A conversation shows what was said, not what an action will change; the preview belongs to the approval card. (iteration 6)
- `grep` for `REQ-0` in `010-conversations/spec.md` returned two rows that are *requirement-id history*, not requirements: the phase parent assigns its children's id ranges and records two renumbering decisions. The real requirement tables live in the three children, which is where they were read. Recorded so a later iteration does not mistake the parent's range table for a missing requirement list. (iteration 6)
- Reading `_show_lines`'s CR-LF rule as a finding for the plan's message storage: the plan already keeps every line feed and drops every other control character, "the carriage return included" (REQ-003, decision D10), which is the same rule with a clearer boundary. No finding. (iteration 6)
- **Copying `llms-full.txt` as a second generated artifact.** A 3,231-line concatenation is a distribution format for a published corpus; this repo's docs are read in place, so the index alone earns its place. (iteration 7)
- **Proposing a fourth alignment command.** 013 already runs two generators and a re-run loop with a parsed `Open findings:` grammar; a doc index is a generated artifact of the run, not a third command. (iteration 7)
- **Proposing openhuman's `FINDINGS-*.md` as a required file per review.** One note per finding would duplicate what 014's review report already holds; the finding keeps the two *sections* (rejected hypothesis, correction) and not the file-per-note convention. (iteration 7)
- **Reading openhuman's `e2e/` directory as a corpus.** It is a Docker Compose harness (`docker-compose.yml`, `run-local.sh`, an entrypoint script) for a containerised stack the build does not have, so its shape does not transfer. (iteration 7)
- `014-deep-review/spec.md` was read for the words `ruled out`, `hypothesis` and `correction` and returned nothing, which is what finding 5 rests on; the absence of a word is weaker evidence than the presence of a requirement, so the finding is stated as "does not require" and not "forbids". (iteration 7)
- The `grep -c "^| BOT-"` count of 33 is the scenario table's own count, not a coverage claim: several rows cite the same requirement, so "33 scenarios" does not mean 33 distinct behaviours. No coverage percentage is claimed from it. (iteration 7)
- **Closing the `tinyjuice` question by inspection.** Its README is a logo and a broken image link, and `tinyflows`' README points at tinyjuice's image, so the two are related but neither describes itself. No claim is made; a later iteration can open its crate list. (iteration 8)
- **Lifting any code from the vendor tree.** GPL-3.0-only across all 21 crates. Every item above is a rule set or a design, and the finding says so per item rather than once. (iteration 8)
- **Ranking `tinycomputer` and `tinybox` as net-new candidates.** They are the two largest crates in the tree (630,174 and 159,147 lines) and both exist to give a bot a machine. 004-computer-exposure declined that, with evidence, and the parity synthesis's eliminated-alternatives row records it. Their size is the argument *against* them for a small team, not for them. (iteration 8)
- **Treating `tinymcp` as an MCP client.** Its name promises one; its README opens "A production-ready Rust 2024 TinyBus module template used by TinyHumans AI". Recorded because a name-based search would have cited it as evidence that the reference has first-class MCP support, which it does not. (iteration 8)
- `find … -print0 | xargs -0 wc -l | tail -1` printed `17,485 total`, which is one `xargs` batch's total rather than the tree's; the correct figure came from `… | xargs -0 cat | wc -l` (4,379,258). Recorded because the wrong number was believable and would have understated the tree by two orders of magnitude. (iteration 8)
- `ls tinyartifacts` failed; the directory is `tiny-artifacts`. A hyphenated name is easy to lose in a list, and a later iteration should copy the name from `ls`. (iteration 8)
- **Proposing a full policy engine for 007.** The reference's `tinysecurity-policy` is a 288k-line workspace whose engine folds three inputs into one verdict and whose bus carries a versioned contract; the plan's own scope boundary declines a rule store, and findings 1 to 3 are the three checks that fit without one. (iteration 9)
- **Reading `rakazo-main` for per-agent tool filtering.** A grep for `allowedTools`, `toolAllowlist` and `enabledTools` over its `packages/core/src` returned no file, so rakazo does not carry the pattern; the search is recorded rather than repeated. (iteration 9)
- **Treating the permission ladder as a 009-skills item.** A skill declares `allowed-tools` in its frontmatter (the reference parses it as "scalar or sequence"), but the skill's declaration is a *claim about the skill*, not a ceiling on the caller, and 009's own caps already bound what a skill can inject. The ceiling belongs to the bot. (iteration 9)
- A first draft of finding 1 carried the cite path through a `vendor/../crates` segment, which is both wrong and unreadable; it was replaced with the plain path before the iteration was recorded. Recorded because a SOURCE tag that resolves through `..` can still resolve, so a broken path is easy to leave in place. (iteration 9)
- The first grep for `PermissionLevel` over `vendor/tinyagents/crates` returned nothing, and the type turned out to live one level deeper, in `vendor/tinyagents/vendor/tinytools/crates/tinytools/src/permission/types.rs` — a *vendored crate inside a vendored crate*. Recorded because it explains why iteration 1's search came up empty and why a vendor tree needs a recursive search rather than a `crates/*/src/*.rs` glob. (iteration 9)
- **A per-phase "readiness" score.** The three earlier syntheses already produce verdict-per-phase tables and the plan-depth run downgraded and rejected findings with reasons; a fourth score would be a fourth scale. This iteration states coverage as counts plus the one qualitative fact that matters (whether a reference implementation exists behind the finding), and leaves scoring to 014-deep-review. (iteration 10)
- **Merging the net-new ranking into the parity synthesis's ranked build order.** The two orders answer different questions — the build order ranks *planned phases*, the ranking above ranks *unplanned candidates* — and merging them would put a what-if verb ahead of the routine layer for no reason. (iteration 10)
- **Re-opening any finding to raise its severity.** This is a reading iteration, not a re-adjudication; where a rank moved (finding 3, items 1 and 11) the iteration says which earlier finding it came from. (iteration 10)
- Nothing new was searched, so there is no dead end from searching. The one thing that did not work was attempting to state a coverage percentage: 50 findings over fourteen phases is not a percentage of anything, because a phase's reference surface is not enumerable. The count table is what survived. (iteration 10)
- The delta aggregation read `iter-001` to `iter-009` by name rather than by listing the directory, so a future reader adding an iteration must extend the loop; recorded because a stale script is how a coverage table silently undercounts. (iteration 10)

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
Read-only inputs: the ten reference repos under `specs/system-skilled-bots/context/`, the fourteen phase folders and `contracts/` of `specs/system-skilled-bots/003-openbot-parity-build`, the three earlier syntheses under `specs/system-skilled-bots/002-openbot-parity-research/00{1,2,3}-*/research/research.md`, and the built runtime under `.skilled/skills/system-skilled-bots/runtime/lib/`.

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
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
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
- Started: 2026-11-27T07:22:54.514Z
- Fan-out lineage: pi-1 of the 004 reference-evidence run; every write stays inside this lineage directory.
- Expansive depth: frontier share is one depth-1 node, F-1-003 (openhuman-full, never studied before).
