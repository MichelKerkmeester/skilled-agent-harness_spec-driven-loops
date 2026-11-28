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
Planning-depth review of packet specs/system-skilled-bots/003-openbot-parity-build, the OpenBot parity build for skilled bots: fourteen phases (001-activity-and-actor, 002-routine-layer, 003-terminal-screen, 004-computer-exposure, 005-memory, 006-approval-grants, 007-per-bot-apps, 008-vault, 009-skills, 010-conversations, 011-messaging-channels, 013-manual-testing-scenarios, 014-skilled-and-doc-alignment, 015-deep-review). The operator wants to build all of it in one shot to perfection, so every phase must be planned and architected deeply enough that a builder needs no design decision while building.

Phase 003-terminal-screen was just expanded into a Level 3 phase parent with six children (UX and component map with a design/ folder of mockups, key map, glyph table and component inventory; architecture and contracts; shell and navigation; panes; answer flow; hardening). Use it as the benchmark for depth. Do not review 003's children themselves.

For every other phase answer: is it planned deeply enough to one-shot? What is missing: module and file design, data contracts and record schemas with every field, state machines and lifecycles, error and refusal catalogue, concurrency and restart behavior, migration and rollback, test strategy with fixtures, the interfaces it offers to and takes from other phases, security boundaries, operator prerequisites, and design artifacts (diagrams, schema files, sequence flows, mockups for anything user-facing such as chat and channel messages)? Should it become a phase parent with children like 003, and which children? What reference code in specs/system-skilled-bots/context/ (OpenBot-main, OpenMausBot-main, rakazo-main, openhuman-main, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main, tinychannels-main) should it study first?

Evidence (read-only): the phase docs; the built runtime under .skilled/skills/system-skilled-bots/runtime/lib/ and .skilled/bin/bots.cjs; the earlier research in specs/system-skilled-bots/002-openbot-parity-research/.

Every finding names the phase, the gap, the evidence as [SOURCE: path:line], a severity (P0 the build cannot be one-shot without it, P1 a builder would have to decide, P2 polish) and the exact planning artifact or child phase that closes it. End with a ranked per-phase expansion plan.


---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Data and contracts: for phases 001, 002, 005, 006 and 010, are every record schema, field, state machine and bots --json payload specified completely enough to build without a decision? What schema files or contract docs are missing?
- [x] Phase 011-messaging-channels: is the adapter architecture, per-channel transport, identity linking, durable queue, approval rendering and conformance test design deep enough to one-shot, and how should it split into children (shared adapter, Telegram, Slack, Signal, WhatsApp)?
- [x] Small phases 004-computer-exposure and 002-routine-layer, and cross-cutting design: is there a shared architecture doc (module map, file ownership, prompt builder order, answer seam, state-root layout) that every phase builds against, or must one be added before building?
- [x] What is the exact JSON envelope convention every bots ... --json verb must follow, and which existing verb sets the precedent?
- [x] Which phases must change when the needs-you item gains grants, kind, conversationId and proposal fields, and is the closed ITEM_KEYS list a single-writer contract or a per-phase one?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Reviewing the six children of phase 003-terminal-screen (they are the depth benchmark, not the subject). Implementing any fix: this is a planning-depth review, findings only. Re-deciding the fourteen-phase decomposition itself.

---

## 5. STOP CONDITIONS
Stop at maxIterations=10 (stopPolicy max-iterations). Convergence below 0.05 is telemetry only; broaden review angles instead of synthesizing early.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Data and contracts: for phases 001, 002, 005, 006 and 010, are every record schema, field, state machine and bots --json payload specified completely enough to build without a decision? What schema files or contract docs are missing?
- Phase 011-messaging-channels: is the adapter architecture, per-channel transport, identity linking, durable queue, approval rendering and conformance test design deep enough to one-shot, and how should it split into children (shared adapter, Telegram, Slack, Signal, WhatsApp)?
- Small phases 004-computer-exposure and 002-routine-layer, and cross-cutting design: is there a shared architecture doc (module map, file ownership, prompt builder order, answer seam, state-root layout) that every phase builds against, or must one be added before building?
- What is the exact JSON envelope convention every bots ... --json verb must follow, and which existing verb sets the precedent?
- Which phases must change when the needs-you item gains grants, kind, conversationId and proposal fields, and is the closed ITEM_KEYS list a single-writer contract or a per-phase one?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the live TypeScript interfaces beside the REQ tables turned "is this specified?" into a diff between the current type and the phase's prose, which is what exposed the answer-nullability gap that a spec-only read would have missed. (iteration 1)
- counting files and modules against 003's parent-child ratio turned "is this too big?" into a comparable number, which is what makes the phase-parent recommendation defensible rather than a preference. (iteration 2)
- testing the README's stated rule against `answer.ts`'s actual imports turned a documentation question into a contradiction with evidence on both sides, which is the strongest kind of finding this review can produce. (iteration 3)
- reading the one existing `--json` implementation settled the convention in a single call, because the precedent was already in the code and only the packet was silent about it. (iteration 4)
- reading the parent spec's Shared Records table before the phase docs turned the question from "who writes this" into "which rows are missing", which is a much smaller and more actionable gap. (iteration 5)
- reading the acceptance criteria as a schema source. AC-002 turned out to be the only place the index shape is written down, which is itself the finding — the phase's data contract lives in a test command. (iteration 6)
- grepping every phase spec for `kind` and `ITEM_KEYS` at once. That single search turned a suspected missing field into a documented contradiction between 005's decision record and 009's requirement, which is a stronger and more actionable finding. (iteration 7)
- testing the handoff as a claim rather than reading it as prose. 013 says twice that it hands runtime findings to 014; checking 014's dependency list for a receiver took one grep and turned a sentence into a P1. (iteration 8)
- grepping the code for the vocabulary before grepping the docs for it. Finding `REFUSAL_CAUSES` and `EXIT_CODES` first turned "the packet has no catalogue" into the sharper and more actionable "the catalogue exists and no phase cites it". (iteration 9)
- counting files and requirements per phase before ranking. The counts put 011 first and 004 last without argument, and they exposed that 003's Level 3 status is about a screen, not about size. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- grepping `tasks.md` for shapes wasted two calls; tasks carry verify commands, not field lists, so they can only confirm a symbol name. (iteration 1)
- reading the acceptance criteria for field shapes wasted a call; AC rows assert behavior, so they can only confirm a refusal name. (iteration 2)
- grepping for diagrams was cheap but only confirms an absence; the useful part was counting the stages each flow has, which is what makes the absence a gap rather than a preference. (iteration 3)
- checking for a pretty-print contract was wasted effort; no test compares whitespace, so indentation cannot be a contract. (iteration 4)
- grepping the prior research for `ITEM_KEYS` returned a large volume of already-settled findings; the useful part was one row, and the rest cost context. (iteration 5)
- grepping the reference code for a name grammar to cite. The phase cites rakazo for a length bound and for two lifted modules, not for the grammar, so there is nothing to adopt without a decision. (iteration 6)
- assuming 012's FAIL rule was absent. REQ-006 covers it; the real gap is that naming a FAIL satisfies the rule, which only showed up after reading the handoff criteria beside it. (iteration 7)
- expecting 014 to be the weak phase. It is the strongest document in the packet, so the findings had to come from the seams around it — what it does not read, and what it forbids itself from re-running. (iteration 8)
- one grep over the packet hit a prior lineage's session-chunk JSON and flooded the output. The lesson is to scope greps to `0*/spec.md` rather than the packet root, which the later counts did. (iteration 9)
- expecting the design-artifact gap to be partial. One grep over 28 files returned a single match, so the finding is total rather than a shortfall. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### 002's own depth is not the gap here: its block rules, floor, fatigue count and refusal names are specified to the field level [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:153-181]; the gaps iteration 1 found (state file, `until` observation) are the only ones, so 002 needs no child either. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: 002's own depth is not the gap here: its block rules, floor, fatigue count and refusal names are specified to the field level [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:153-181]; the gaps iteration 1 found (state file, `until` observation) are the only ones, so 002 needs no child either.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 002's own depth is not the gap here: its block rules, floor, fatigue count and refusal names are specified to the field level [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:153-181]; the gaps iteration 1 found (state file, `until` observation) are the only ones, so 002 needs no child either.

### 009's addition is a value rather than a key, so it does not widen the array; only 001, 005, 006 and 010 do. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: 009's addition is a value rather than a key, so it does not widen the array; only 001, 005, 006 and 010 do.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 009's addition is a value rather than a key, so it does not widen the array; only 001, 005, 006 and 010 do.

### Assuming the pretty-print indentation is part of the contract: `status` uses `null, 2` [SOURCE: .skilled/bin/bots.cjs:387], but no test compares exact whitespace, so indentation is a style choice rather than a contract and is not raised as a gap. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Assuming the pretty-print indentation is part of the contract: `status` uses `null, 2` [SOURCE: .skilled/bin/bots.cjs:387], but no test compares exact whitespace, so indentation is a style choice rather than a contract and is not raised as a gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming the pretty-print indentation is part of the contract: `status` uses `null, 2` [SOURCE: .skilled/bin/bots.cjs:387], but no test compares exact whitespace, so indentation is a style choice rather than a contract and is not raised as a gap.

### Concluding that 004 needs a child: it lists 12 files, nine requirements, the exact prompt line text, the null-branch variant and a design-reference per requirement [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:150-180], so it is the packet's best example of a one-shot-ready small phase. It needs the shared contracts, not children. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Concluding that 004 needs a child: it lists 12 files, nine requirements, the exact prompt line text, the null-branch variant and a design-reference per requirement [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:150-180], so it is the packet's best example of a one-shot-ready small phase. It needs the shared contracts, not children.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Concluding that 004 needs a child: it lists 12 files, nine requirements, the exact prompt line text, the null-branch variant and a design-reference per requirement [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:150-180], so it is the packet's best example of a one-shot-ready small phase. It needs the shared contracts, not children.

### Looking for 013's report folders in 014's inputs: 014's dependency list is five bullets and none names them, which is what makes finding 1 a boundary gap rather than a wording quibble. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Looking for 013's report folders in 014's inputs: 014's dependency list is five bullets and none names them, which is what makes finding 1 a boundary gap rather than a wording quibble.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for 013's report folders in 014's inputs: 014's dependency list is five bullets and none names them, which is what makes finding 1 a boundary gap rather than a wording quibble.

### Looking for a `kind` field on `NeedsYouItem` today: `needs-you.ts:29-48` has no such field and `ITEM_KEYS` does not list it, so 005's REQ-009 is what introduces it. That confirms the field is 005's to define and makes finding 3 a contradiction between two phases rather than a missing field. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Looking for a `kind` field on `NeedsYouItem` today: `needs-you.ts:29-48` has no such field and `ITEM_KEYS` does not list it, so 005's REQ-009 is what introduces it. That confirms the field is 005's to define and makes finding 3 a contradiction between two phases rather than a missing field.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a `kind` field on `NeedsYouItem` today: `needs-you.ts:29-48` has no such field and `ITEM_KEYS` does not list it, so 005's REQ-009 is what introduces it. That confirms the field is 005's to define and makes finding 3 a contradiction between two phases rather than a missing field.

### Looking for a conformance fixture list in `tasks.md`: the tasks name the test files and their verify commands, not the rules. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Looking for a conformance fixture list in `tasks.md`: the tasks name the test files and their verify commands, not the rules.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a conformance fixture list in `tasks.md`: the tasks name the test files and their verify commands, not the rules.

### Looking for a generated schema of the item: no schema file exists (iteration 1), so the table is the only ownership artifact. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Looking for a generated schema of the item: no schema file exists (iteration 1), so the table is the only ownership artifact.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a generated schema of the item: no schema file exists (iteration 1), so the table is the only ownership artifact.

### Looking for a host-capacity rule in the fan-out contract: the plan's fallback order covers which executor to prefer, not what to do when one is absent. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Looking for a host-capacity rule in the fan-out contract: the plan's fallback order covers which executor to prefer, not what to do when one is absent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a host-capacity rule in the fan-out contract: the plan's fallback order covers which executor to prefer, not what to do when one is absent.

### Looking for a migration section: every phase's complexity table asserts "no migration" or "no data migration" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:244] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:250], so the packet has no migration artifact to extend; the nullability rules are the migration story and they are incomplete for the answer object. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Looking for a migration section: every phase's complexity table asserts "no migration" or "no data migration" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:244] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:250], so the packet has no migration artifact to extend; the nullability rules are the migration story and they are incomplete for the answer object.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a migration section: every phase's complexity table asserts "no migration" or "no data migration" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:244] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:250], so the packet has no migration artifact to extend; the nullability rules are the migration story and they are incomplete for the answer object.

### Looking for a packet-level catalogue file: `grep -rln "refusal catalogue|error catalogue|refusal table|exit-code table"` over the packet returns nothing, so the vocabulary lives only in `runner.ts` and in each phase's prose. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Looking for a packet-level catalogue file: `grep -rln "refusal catalogue|error catalogue|refusal table|exit-code table"` over the packet returns nothing, so the vocabulary lives only in `runner.ts` and in each phase's prose.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a packet-level catalogue file: `grep -rln "refusal catalogue|error catalogue|refusal table|exit-code table"` over the packet returns nothing, so the vocabulary lives only in `runner.ts` and in each phase's prose.

### Looking for a per-phase "Interfaces" section: the Level 2 template has no such anchor, so the offered and consumed interfaces are only ever prose inside Scope and Requirements. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Looking for a per-phase "Interfaces" section: the Level 2 template has no such anchor, so the offered and consumed interfaces are only ever prose inside Scope and Requirements.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a per-phase "Interfaces" section: the Level 2 template has no such anchor, so the offered and consumed interfaces are only ever prose inside Scope and Requirements.

### Looking for a phase whose size alone justifies a split: 009 at 25 files and 001 and 002 at 24 are large but each is one module family, and iteration 7 already ruled out a parent for 009. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Looking for a phase whose size alone justifies a split: 009 at 25 files and 001 and 002 at 24 are large but each is one module family, and iteration 7 already ruled out a parent for 009.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a phase whose size alone justifies a split: 009 at 25 files and 001 and 002 at 24 are large but each is one module family, and iteration 7 already ruled out a parent for 009.

### Looking for a skill-name grammar in `bot-check.cjs` to cite: the checker has no name-grammar helper, so 009 has nothing to reuse. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Looking for a skill-name grammar in `bot-check.cjs` to cite: the checker has no name-grammar helper, so 009 has nothing to reuse.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a skill-name grammar in `bot-check.cjs` to cite: the checker has no name-grammar helper, so 009 has nothing to reuse.

### Looking for a state-root or record version field: neither `state-root.ts` nor `run-record.ts` has one, and only 001 mentions "record version" at all, in an unrelated sense. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Looking for a state-root or record version field: neither `state-root.ts` nor `run-record.ts` has one, and only 001 mentions "record version" at all, in an unrelated sense.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for a state-root or record version field: neither `state-root.ts` nor `run-record.ts` has one, and only 001 mentions "record version" at all, in an unrelated sense.

### Looking for an envelope rule in the parent spec: the phase map names no payload and no verb [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:151-166]. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Looking for an envelope rule in the parent spec: the phase map names no payload and no verb [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:151-166].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an envelope rule in the parent spec: the phase map names no payload and no verb [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:151-166].

### Looking for an existing lock helper to cite: the runtime has the atomic-rename convention but no exported lock, so 008 would have to introduce one or state that last-writer-wins is accepted. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Looking for an existing lock helper to cite: the runtime has the atomic-rename convention but no exported lock, so 008 would have to introduce one or state that last-writer-wins is accepted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for an existing lock helper to cite: the runtime has the atomic-rename convention but no exported lock, so 008 would have to introduce one or state that last-writer-wins is accepted.

### Looking for design artifacts outside 003: the grep over all 28 spec and plan files returns one match, so there is nothing to consolidate — the gap is total for 010 and 011. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Looking for design artifacts outside 003: the grep over all 28 spec and plan files returns one match, so there is nothing to consolidate — the gap is total for 010 and 011.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Looking for design artifacts outside 003: the grep over all 28 spec and plan files returns one match, so there is nothing to consolidate — the gap is total for 010 and 011.

### Making 003's six-child shape the template for every phase. 003 is a Level 3 phase with a screen to draw; 004, 007, 013 and 014 are smaller than 003's first child and would be damaged by a split. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Making 003's six-child shape the template for every phase. 003 is a Level 3 phase with a screen to draw; 004, 007, 013 and 014 are smaller than 003's first child and would be damaged by a split.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making 003's six-child shape the template for every phase. 003 is a Level 3 phase with a screen to draw; 004, 007, 013 and 014 are smaller than 003's first child and would be damaged by a split.

### Making 008, 009 or 010 a parent. Each is one coherent module plus one seam; their gaps are missing contract text, not missing decomposition. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Making 008, 009 or 010 a parent. Each is one coherent module plus one seam; their gaps are missing contract text, not missing decomposition.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making 008, 009 or 010 a parent. Each is one coherent module plus one seam; their gaps are missing contract text, not missing decomposition.

### Re-raising the `kind` collision as an unknown: the prior research already found it and the parent's Shared Records table already assigns the values to 005 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/research/research.md:577], so the open part is the nested `grants.kind`, not the top-level one. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Re-raising the `kind` collision as an unknown: the prior research already found it and the parent's Shared Records table already assigns the values to 005 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/research/research.md:577], so the open part is the nested `grants.kind`, not the top-level one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-raising the `kind` collision as an unknown: the prior research already found it and the parent's Shared Records table already assigns the values to 005 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/research/research.md:577], so the open part is the nested `grants.kind`, not the top-level one.

### Reading 007 as under-planned. It names its refusals (`apps-unknown-server`, `apps-unenforceable`), its env key (`UTCP_CONFIG_FILE` through `dispatchEnvKeys`), its filtered-config write and its worktree-restore-after-exit rule. It is the second-best-planned phase in the packet after 004, and needs no child. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Reading 007 as under-planned. It names its refusals (`apps-unknown-server`, `apps-unenforceable`), its env key (`UTCP_CONFIG_FILE` through `dispatchEnvKeys`), its filtered-config write and its worktree-restore-after-exit rule. It is the second-best-planned phase in the packet after 004, and needs no child.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading 007 as under-planned. It names its refusals (`apps-unknown-server`, `apps-unenforceable`), its env key (`UTCP_CONFIG_FILE` through `dispatchEnvKeys`), its filtered-config write and its worktree-restore-after-exit rule. It is the second-best-planned phase in the packet after 004, and needs no child.

### Reading 009 as needing a phase parent. Its 25 files are one loader plus one proposal path, and its caps, overflow rule, wrapper format and digest chain are all pinned. The gaps are four additions to the existing documents. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Reading 009 as needing a phase parent. Its 25 files are one loader plus one proposal path, and its caps, overflow rule, wrapper format and digest chain are all pinned. The gaps are four additions to the existing documents.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading 009 as needing a phase parent. Its 25 files are one loader plus one proposal path, and its caps, overflow rule, wrapper format and digest chain are all pinned. The gaps are four additions to the existing documents.

### Reading 012 as under-planned. It has a 33-row inventory with a requirement citation per row, a package validator as its gate, a single writer for the run folder (`record-playbook-run.cjs`), a FAIL-handling requirement, a SKIP rule for a missing channel account, and a wave plan. It needs no child phase; it needs two rules added (findings 6 and 8). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Reading 012 as under-planned. It has a 33-row inventory with a requirement citation per row, a package validator as its gate, a single writer for the run folder (`record-playbook-run.cjs`), a FAIL-handling requirement, a SKIP rule for a missing channel account, and a wave plan. It needs no child phase; it needs two rules added (findings 6 and 8).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading 012 as under-planned. It has a 33-row inventory with a requirement citation per row, a package validator as its gate, a single writer for the run folder (`record-playbook-run.cjs`), a FAIL-handling requirement, a SKIP rule for a missing channel account, and a wave plan. It needs no child phase; it needs two rules added (findings 6 and 8).

### Reading 013 as needing a child phase. It is two command runs plus a fix pass; its problem is where the evidence lands, not how much design it needs. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Reading 013 as needing a child phase. It is two command runs plus a fix pass; its problem is where the evidence lands, not how much design it needs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading 013 as needing a child phase. It is two command runs plus a fix pass; its problem is where the evidence lands, not how much design it needs.

### Reading 014 as under-planned. It is the deepest plan in the packet: five named dimensions mapped onto four canonical ids, a five-part stop rule with the frontier veto and the strongest-restriction verdict, a roster with per-kind effort and enforced allowlists, a fallback order, a file-partitioned fix pass, and a measured test floor. Its gaps are boundary rules, not design. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Reading 014 as under-planned. It is the deepest plan in the packet: five named dimensions mapped onto four canonical ids, a five-part stop rule with the frontier veto and the strongest-restriction verdict, a roster with per-kind effort and enforced allowlists, a fallback order, a file-partitioned fix pass, and a measured test floor. Its gaps are boundary rules, not design.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading 014 as under-planned. It is the deepest plan in the packet: five named dimensions mapped onto four canonical ids, a five-part stop rule with the frontier veto and the strongest-restriction verdict, a roster with per-kind effort and enforced allowlists, a fallback order, a file-partitioned fix pass, and a measured test floor. Its gaps are boundary rules, not design.

### Reading the acceptance-criteria file for the missing shapes: it asserts behavior per requirement and names no field, so it cannot close a schema gap. Checked 011's AC rows for REQ-001, REQ-006 and REQ-017. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Reading the acceptance-criteria file for the missing shapes: it asserts behavior per requirement and names no field, so it cannot close a schema gap. Checked 011's AC rows for REQ-001, REQ-006 and REQ-017.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the acceptance-criteria file for the missing shapes: it asserts behavior per requirement and names no field, so it cannot close a schema gap. Checked 011's AC rows for REQ-001, REQ-006 and REQ-017.

### Reading the packet as having no refusal discipline. It has a typed registry, a frozen exit-code object and a documented table; the gap is that no phase document points at any of them. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Reading the packet as having no refusal discipline. It has a typed registry, a frozen exit-code object and a documented table; the gap is that no phase document points at any of them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the packet as having no refusal discipline. It has a typed registry, a frozen exit-code object and a documented table; the gap is that no phase document points at any of them.

### Reading the phase `tasks.md` files for the missing shapes: they carry verify commands (`rg -n 'MEMORY_LIMITS|parseMemory|renderMemory'`) rather than field lists, so they confirm a symbol exists and never its shape. Checked 005's tasks T007-T010 and 002's T001-T006. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading the phase `tasks.md` files for the missing shapes: they carry verify commands (`rg -n 'MEMORY_LIMITS|parseMemory|renderMemory'`) rather than field lists, so they confirm a symbol exists and never its shape. Checked 005's tasks T007-T010 and 002's T001-T006.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the phase `tasks.md` files for the missing shapes: they carry verify commands (`rg -n 'MEMORY_LIMITS|parseMemory|renderMemory'`) rather than field lists, so they confirm a symbol exists and never its shape. Checked 005's tasks T007-T010 and 002's T001-T006.

### Searching for a `contracts/` or `schemas/` folder under the packet root returns nothing, so there is no partial artifact to extend. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Searching for a `contracts/` or `schemas/` folder under the packet root returns nothing, so there is no partial artifact to extend.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a `contracts/` or `schemas/` folder under the packet root returns nothing, so there is no partial artifact to extend.

### Searching for a name grammar in the reference code to adopt by citation: rakazo's `bot-secrets.md:35` is cited for the 16,384 bound only, and the packet never cites it for the grammar. Adopting one would be a design decision the phase does not authorize. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Searching for a name grammar in the reference code to adopt by citation: rakazo's `bot-secrets.md:35` is cited for the 16,384 bound only, and the packet never cites it for the grammar. Adopting one would be a design decision the phase does not authorize.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a name grammar in the reference code to adopt by citation: rakazo's `bot-secrets.md:35` is cited for the 16,384 bound only, and the packet never cites it for the grammar. Adopting one would be a design decision the phase does not authorize.

### The `--json` flag parsing itself is not a gap: `json` is already in `FLAG_OPTIONS` and `STATUS_OPTIONS` [SOURCE: .skilled/bin/bots.cjs:59-62], so a new verb inherits the flag with no parser change. The gap is the payload, not the flag. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The `--json` flag parsing itself is not a gap: `json` is already in `FLAG_OPTIONS` and `STATUS_OPTIONS` [SOURCE: .skilled/bin/bots.cjs:59-62], so a new verb inherits the flag with no parser change. The gap is the payload, not the flag.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `--json` flag parsing itself is not a gap: `json` is already in `FLAG_OPTIONS` and `STATUS_OPTIONS` [SOURCE: .skilled/bin/bots.cjs:59-62], so a new verb inherits the flag with no parser change. The gap is the payload, not the flag.

### The `crates/bots-tui/tests/fixtures/bots` contract gap is already closed in the packet: 001's affected-surfaces table marks the fixture "not this phase's" and asserts payloads through `bots ... --json` instead [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:92], and 003's child 006 enumerates the four payloads the fixture carries [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/plan.md:122]. Do not re-raise it as a missing Modify row; the remaining gap is that the payload shapes themselves have no schema file (finding 1). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The `crates/bots-tui/tests/fixtures/bots` contract gap is already closed in the packet: 001's affected-surfaces table marks the fixture "not this phase's" and asserts payloads through `bots ... --json` instead [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:92], and 003's child 006 enumerates the four payloads the fixture carries [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/plan.md:122]. Do not re-raise it as a missing Modify row; the remaining gap is that the payload shapes themselves have no schema file (finding 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `crates/bots-tui/tests/fixtures/bots` contract gap is already closed in the packet: 001's affected-surfaces table marks the fixture "not this phase's" and asserts payloads through `bots ... --json` instead [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:92], and 003's child 006 enumerates the four payloads the fixture carries [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/plan.md:122]. Do not re-raise it as a missing Modify row; the remaining gap is that the payload shapes themselves have no schema file (finding 1).

### The `unknown-key` refusal is not the problem: it is the mechanism that makes the closed list safe, and it works. The problem is that five phases edit the list without one target. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The `unknown-key` refusal is not the problem: it is the mechanism that makes the closed list safe, and it works. The problem is that five phases edit the list without one target.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The `unknown-key` refusal is not the problem: it is the mechanism that makes the closed list safe, and it works. The problem is that five phases edit the list without one target.

### The adapter contract itself is not a gap: REQ-001 and REQ-002 give the six members and the four message shapes with every field [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:183-184], so the contract is deeper than 001's or 005's. Do not re-raise it; the gap is the capability vocabulary and the conformance rules, not the interface. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The adapter contract itself is not a gap: REQ-001 and REQ-002 give the six members and the four message shapes with every field [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:183-184], so the contract is deeper than 001's or 005's. Do not re-raise it; the gap is the capability vocabulary and the conformance rules, not the interface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The adapter contract itself is not a gap: REQ-001 and REQ-002 give the six members and the four message shapes with every field [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:183-184], so the contract is deeper than 001's or 005's. Do not re-raise it; the gap is the capability vocabulary and the conformance rules, not the interface.

### The README is not useless: its package topology and module table are the right shape for the target-state doc, so the closing artifact is an extension of that file plus a `contracts/` copy, not a new invention. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The README is not useless: its package topology and module table are the right shape for the target-state doc, so the closing artifact is an extension of that file plus a `contracts/` copy, not a new invention.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The README is not useless: its package topology and module table are the right shape for the target-state doc, so the closing artifact is an extension of that file plus a `contracts/` copy, not a new invention.

### The reference-code question is already answered inside the phase: the plan cites `tinychannels-main`'s `adapter.rs`, `envelope.rs`, `intent.rs`, `receipt.rs`, `error.rs`, `delivery/queue.rs`, `delivery/policy.rs`, `security/mod.rs` and `bus/config.rs`, and states the reference is GPL-3.0 so it is design only [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:66-72]. A child split should keep those citations per child rather than re-deriving them. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The reference-code question is already answered inside the phase: the plan cites `tinychannels-main`'s `adapter.rs`, `envelope.rs`, `intent.rs`, `receipt.rs`, `error.rs`, `delivery/queue.rs`, `delivery/policy.rs`, `security/mod.rs` and `bus/config.rs`, and states the reference is GPL-3.0 so it is design only [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:66-72]. A child split should keep those citations per child rather than re-deriving them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The reference-code question is already answered inside the phase: the plan cites `tinychannels-main`'s `adapter.rs`, `envelope.rs`, `intent.rs`, `receipt.rs`, `error.rs`, `delivery/queue.rs`, `delivery/policy.rs`, `security/mod.rs` and `bus/config.rs`, and states the reference is GPL-3.0 so it is design only [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:66-72]. A child split should keep those citations per child rather than re-deriving them.

### Treating `bots status --json` as a special case because it prints a report rather than a list: the report is the only precedent the packet has, and its shape (object with a named collection key) is exactly what `activity` already follows, so it generalizes. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating `bots status --json` as a special case because it prints a report rather than a list: the report is the only precedent the packet has, and its shape (object with a named collection key) is exactly what `activity` already follows, so it generalizes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `bots status --json` as a special case because it prints a report rather than a list: the report is the only precedent the packet has, and its shape (object with a named collection key) is exactly what `activity` already follows, so it generalizes.

### Treating 008 as needing a phase parent. Its 19 files and 15 requirements are one coherent store plus one injection path; the gaps above are additions to the existing documents, not a split. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating 008 as needing a phase parent. Its 19 files and 15 requirements are one coherent store plus one injection path; the gaps above are additions to the existing documents, not a split.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating 008 as needing a phase parent. Its 19 files and 15 requirements are one coherent store plus one injection path; the gaps above are additions to the existing documents, not a split.

### Treating 014's "at least 381 tests" as a gap. The number is a floor measured before the build, so a larger suite still passes. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating 014's "at least 381 tests" as a gap. The number is a floor measured before the build, so a larger suite still passes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating 014's "at least 381 tests" as a gap. The number is a floor measured before the build, so a larger suite still passes.

### Treating concurrency as unowned. 002, 005, 006, 010 and 011 each state their queue and lease rules in detail; the gap is the shared-file writers, not the queue owners. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating concurrency as unowned. 002, 005, 006, 010 and 011 each state their queue and lease rules in detail; the gap is the shared-file writers, not the queue owners.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating concurrency as unowned. 002, 005, 006, 010 and 011 each state their queue and lease rules in detail; the gap is the shared-file writers, not the queue owners.

### Treating migration as entirely absent. 006's risk row and 008's "read a missing field as a default" are real compatibility rules; they are just not a migration story. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating migration as entirely absent. 006's risk row and 008's "read a missing field as a default" are real compatibility rules; they are just not a migration story.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating migration as entirely absent. 006's risk row and 008's "read a missing field as a default" are real compatibility rules; they are just not a migration story.

### Treating the contract document as a fifteenth phase. It is an artifact the existing phases cite, not a build step, and giving it a phase would put a document in the build order. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating the contract document as a fifteenth phase. It is an artifact the existing phases cite, not a build step, and giving it a phase would put a document in the build order.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the contract document as a fifteenth phase. It is an artifact the existing phases cite, not a build step, and giving it a phase would put a document in the build order.

### Treating the landing order as the fix: the phases land 001, 005, 006, 009, 010 in numeric order, but order cannot reconcile two vocabularies or supply a missing key list. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the landing order as the fix: the phases land 001, 005, 006, 009, 010 in numeric order, but order cannot reconcile two vocabularies or supply a missing key list.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the landing order as the fix: the phases land 001, 005, 006, 009, 010 in numeric order, but order cannot reconcile two vocabularies or supply a missing key list.

### Treating the parent phase map's "Depends on" column as the interface contract: it names one dependency per phase in prose ("001, whose run records carry the fields") and no field, so it cannot close a schema gap [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:151-166]. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the parent phase map's "Depends on" column as the interface contract: it names one dependency per phase in prose ("001, whose run records carry the fields") and no field, so it cannot close a schema gap [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:151-166].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the parent phase map's "Depends on" column as the interface contract: it names one dependency per phase in prose ("001, whose run records carry the fields") and no field, so it cannot close a schema gap [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:151-166].

### Treating the parent spec's phase map as the architecture doc: it names one dependency per phase and no module, group or edge [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:151-166]. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the parent spec's phase map as the architecture doc: it names one dependency per phase and no module, group or edge [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:151-166].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the parent spec's phase map as the architecture doc: it names one dependency per phase and no module, group or edge [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:151-166].

### Treating the plan's Data Flow as the contract: it names `links.json`, `approvals.json` and `queue/` in passing [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:76] but gives no field, so it locates the files without specifying them. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the plan's Data Flow as the contract: it names `links.json`, `approvals.json` and `queue/` in passing [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:76] but gives no field, so it locates the files without specifying them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the plan's Data Flow as the contract: it names `links.json`, `approvals.json` and `queue/` in passing [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:76] but gives no field, so it locates the files without specifying them.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Looking for a migration section: every phase's complexity table asserts "no migration" or "no data migration" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/spec.md:244] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:250], so the packet has no migration artifact to extend; the nullability rules are the migration story and they are incomplete for the answer object. (iteration 1)
- Reading the phase `tasks.md` files for the missing shapes: they carry verify commands (`rg -n 'MEMORY_LIMITS|parseMemory|renderMemory'`) rather than field lists, so they confirm a symbol exists and never its shape. Checked 005's tasks T007-T010 and 002's T001-T006. (iteration 1)
- Searching for a `contracts/` or `schemas/` folder under the packet root returns nothing, so there is no partial artifact to extend. (iteration 1)
- The `crates/bots-tui/tests/fixtures/bots` contract gap is already closed in the packet: 001's affected-surfaces table marks the fixture "not this phase's" and asserts payloads through `bots ... --json` instead [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:92], and 003's child 006 enumerates the four payloads the fixture carries [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/006-hardening-and-proof/plan.md:122]. Do not re-raise it as a missing Modify row; the remaining gap is that the payload shapes themselves have no schema file (finding 1). (iteration 1)
- Treating the parent phase map's "Depends on" column as the interface contract: it names one dependency per phase in prose ("001, whose run records carry the fields") and no field, so it cannot close a schema gap [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:151-166]. (iteration 1)
- Looking for a conformance fixture list in `tasks.md`: the tasks name the test files and their verify commands, not the rules. (iteration 2)
- Reading the acceptance-criteria file for the missing shapes: it asserts behavior per requirement and names no field, so it cannot close a schema gap. Checked 011's AC rows for REQ-001, REQ-006 and REQ-017. (iteration 2)
- The adapter contract itself is not a gap: REQ-001 and REQ-002 give the six members and the four message shapes with every field [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:183-184], so the contract is deeper than 001's or 005's. Do not re-raise it; the gap is the capability vocabulary and the conformance rules, not the interface. (iteration 2)
- The reference-code question is already answered inside the phase: the plan cites `tinychannels-main`'s `adapter.rs`, `envelope.rs`, `intent.rs`, `receipt.rs`, `error.rs`, `delivery/queue.rs`, `delivery/policy.rs`, `security/mod.rs` and `bus/config.rs`, and states the reference is GPL-3.0 so it is design only [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:66-72]. A child split should keep those citations per child rather than re-deriving them. (iteration 2)
- Treating the plan's Data Flow as the contract: it names `links.json`, `approvals.json` and `queue/` in passing [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:76] but gives no field, so it locates the files without specifying them. (iteration 2)
- 002's own depth is not the gap here: its block rules, floor, fatigue count and refusal names are specified to the field level [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:153-181]; the gaps iteration 1 found (state file, `until` observation) are the only ones, so 002 needs no child either. (iteration 3)
- Concluding that 004 needs a child: it lists 12 files, nine requirements, the exact prompt line text, the null-branch variant and a design-reference per requirement [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:150-180], so it is the packet's best example of a one-shot-ready small phase. It needs the shared contracts, not children. (iteration 3)
- Looking for a per-phase "Interfaces" section: the Level 2 template has no such anchor, so the offered and consumed interfaces are only ever prose inside Scope and Requirements. (iteration 3)
- The README is not useless: its package topology and module table are the right shape for the target-state doc, so the closing artifact is an extension of that file plus a `contracts/` copy, not a new invention. (iteration 3)
- Treating the parent spec's phase map as the architecture doc: it names one dependency per phase and no module, group or edge [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:151-166]. (iteration 3)
- Assuming the pretty-print indentation is part of the contract: `status` uses `null, 2` [SOURCE: .skilled/bin/bots.cjs:387], but no test compares exact whitespace, so indentation is a style choice rather than a contract and is not raised as a gap. (iteration 4)
- Looking for an envelope rule in the parent spec: the phase map names no payload and no verb [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:151-166]. (iteration 4)
- The `--json` flag parsing itself is not a gap: `json` is already in `FLAG_OPTIONS` and `STATUS_OPTIONS` [SOURCE: .skilled/bin/bots.cjs:59-62], so a new verb inherits the flag with no parser change. The gap is the payload, not the flag. (iteration 4)
- Treating `bots status --json` as a special case because it prints a report rather than a list: the report is the only precedent the packet has, and its shape (object with a named collection key) is exactly what `activity` already follows, so it generalizes. (iteration 4)
- 009's addition is a value rather than a key, so it does not widen the array; only 001, 005, 006 and 010 do. (iteration 5)
- Looking for a generated schema of the item: no schema file exists (iteration 1), so the table is the only ownership artifact. (iteration 5)
- Re-raising the `kind` collision as an unknown: the prior research already found it and the parent's Shared Records table already assigns the values to 005 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/research/research.md:577], so the open part is the nested `grants.kind`, not the top-level one. (iteration 5)
- The `unknown-key` refusal is not the problem: it is the mechanism that makes the closed list safe, and it works. The problem is that five phases edit the list without one target. (iteration 5)
- Treating the landing order as the fix: the phases land 001, 005, 006, 009, 010 in numeric order, but order cannot reconcile two vocabularies or supply a missing key list. (iteration 5)
- Looking for an existing lock helper to cite: the runtime has the atomic-rename convention but no exported lock, so 008 would have to introduce one or state that last-writer-wins is accepted. (iteration 6)
- Reading 007 as under-planned. It names its refusals (`apps-unknown-server`, `apps-unenforceable`), its env key (`UTCP_CONFIG_FILE` through `dispatchEnvKeys`), its filtered-config write and its worktree-restore-after-exit rule. It is the second-best-planned phase in the packet after 004, and needs no child. (iteration 6)
- Searching for a name grammar in the reference code to adopt by citation: rakazo's `bot-secrets.md:35` is cited for the 16,384 bound only, and the packet never cites it for the grammar. Adopting one would be a design decision the phase does not authorize. (iteration 6)
- Treating 008 as needing a phase parent. Its 19 files and 15 requirements are one coherent store plus one injection path; the gaps above are additions to the existing documents, not a split. (iteration 6)
- Looking for a `kind` field on `NeedsYouItem` today: `needs-you.ts:29-48` has no such field and `ITEM_KEYS` does not list it, so 005's REQ-009 is what introduces it. That confirms the field is 005's to define and makes finding 3 a contradiction between two phases rather than a missing field. (iteration 7)
- Looking for a skill-name grammar in `bot-check.cjs` to cite: the checker has no name-grammar helper, so 009 has nothing to reuse. (iteration 7)
- Reading 009 as needing a phase parent. Its 25 files are one loader plus one proposal path, and its caps, overflow rule, wrapper format and digest chain are all pinned. The gaps are four additions to the existing documents. (iteration 7)
- Reading 012 as under-planned. It has a 33-row inventory with a requirement citation per row, a package validator as its gate, a single writer for the run folder (`record-playbook-run.cjs`), a FAIL-handling requirement, a SKIP rule for a missing channel account, and a wave plan. It needs no child phase; it needs two rules added (findings 6 and 8). (iteration 7)
- Looking for 013's report folders in 014's inputs: 014's dependency list is five bullets and none names them, which is what makes finding 1 a boundary gap rather than a wording quibble. (iteration 8)
- Looking for a host-capacity rule in the fan-out contract: the plan's fallback order covers which executor to prefer, not what to do when one is absent. (iteration 8)
- Reading 013 as needing a child phase. It is two command runs plus a fix pass; its problem is where the evidence lands, not how much design it needs. (iteration 8)
- Reading 014 as under-planned. It is the deepest plan in the packet: five named dimensions mapped onto four canonical ids, a five-part stop rule with the frontier veto and the strongest-restriction verdict, a roster with per-kind effort and enforced allowlists, a fallback order, a file-partitioned fix pass, and a measured test floor. Its gaps are boundary rules, not design. (iteration 8)
- Treating 014's "at least 381 tests" as a gap. The number is a floor measured before the build, so a larger suite still passes. (iteration 8)
- Looking for a packet-level catalogue file: `grep -rln "refusal catalogue|error catalogue|refusal table|exit-code table"` over the packet returns nothing, so the vocabulary lives only in `runner.ts` and in each phase's prose. (iteration 9)
- Looking for a state-root or record version field: neither `state-root.ts` nor `run-record.ts` has one, and only 001 mentions "record version" at all, in an unrelated sense. (iteration 9)
- Reading the packet as having no refusal discipline. It has a typed registry, a frozen exit-code object and a documented table; the gap is that no phase document points at any of them. (iteration 9)
- Treating concurrency as unowned. 002, 005, 006, 010 and 011 each state their queue and lease rules in detail; the gap is the shared-file writers, not the queue owners. (iteration 9)
- Treating migration as entirely absent. 006's risk row and 008's "read a missing field as a default" are real compatibility rules; they are just not a migration story. (iteration 9)
- Looking for a phase whose size alone justifies a split: 009 at 25 files and 001 and 002 at 24 are large but each is one module family, and iteration 7 already ruled out a parent for 009. (iteration 10)
- Looking for design artifacts outside 003: the grep over all 28 spec and plan files returns one match, so there is nothing to consolidate — the gap is total for 010 and 011. (iteration 10)
- Making 003's six-child shape the template for every phase. 003 is a Level 3 phase with a screen to draw; 004, 007, 013 and 014 are smaller than 003's first child and would be damaged by a split. (iteration 10)
- Making 008, 009 or 010 a parent. Each is one coherent module plus one seam; their gaps are missing contract text, not missing decomposition. (iteration 10)
- Treating the contract document as a fifteenth phase. It is an artifact the existing phases cite, not a build step, and giving it a phase would put a document in the build order. (iteration 10)

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
- What envelope rule should every `bots ... --json` verb follow, and does `status --json` already set the precedent? (iteration 1)
- Does the `until` observation belong on the run record at all, given the state file already carries `untilMetAt`? (iteration 1)
- Which phase owns the `contracts/` folder, and does it land as a new phase 015 or as a child of 014-skilled-and-doc-alignment? (iteration 1)
- Which capability names belong in `declaredCapabilities`, and does the terminal transport declare the same set as Telegram? (iteration 2)
- Do the three unstated conformance rules match the reference's own suite, or does the packet need a fourth fixture class for the queue's `unknown` state? (iteration 2)
- Does the roster check belong in `answer.ts` at all, or should the caller pass an `isApprover` predicate so the contracts group keeps its import boundary? (iteration 3)
- Should the contracts phase be a new phase 015 or a child of 014-skilled-and-doc-alignment, given that 013 already owns doc alignment? (iteration 3)
- Should the activity row's `state` be renamed `group` before 001 lands, or is the collision acceptable because the two payloads never mix? (iteration 4)
- Does 010 accept the `{messages: []}` change, or does the chat pane's fixture absorb the bare array as a documented exception? (iteration 4)
- Does 006 accept `grants.actionKind`, or does the item's top-level `kind` get renamed instead? (iteration 5)
- Should the final key list live in the Shared Records table or in `contracts/needs-you-item.schema.json`? (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior research packet: specs/system-skilled-bots/002-openbot-parity-research/ (001-011 phases). Built runtime: .skilled/skills/system-skilled-bots/runtime/lib/ and .skilled/bin/bots.cjs. Reference code: specs/system-skilled-bots/context/ (OpenBot-main, OpenMausBot-main, rakazo-main, openhuman-main, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main, tinychannels-main). Depth benchmark: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/ with six children.

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
- Started: 2026-11-25T21:23:53.000Z
