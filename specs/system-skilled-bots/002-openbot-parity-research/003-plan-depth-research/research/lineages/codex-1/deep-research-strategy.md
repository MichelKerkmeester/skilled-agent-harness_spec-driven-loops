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
Planning-depth review of packet specs/system-skilled-bots/003-openbot-parity-build, the OpenBot parity build for skilled bots: fourteen phases (001-activity-and-actor, 002-routine-layer, 003-terminal-screen, 004-computer-exposure, 005-memory, 006-approval-grants, 007-per-bot-apps, 008-vault, 009-skills, 010-conversations, 011-messaging-channels, 012-manual-testing-scenarios, 013-skilled-and-doc-alignment, 014-deep-review). The operator wants to build all of it in one shot to perfection, so every phase must be planned and architected deeply enough that a builder needs no design decision while building.

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

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Implementation, phase 003 child review, and edits to source phase docs are outside this research pass.

---

## 5. STOP CONDITIONS
Reach the configured five-iteration cap even if convergence telemetry would otherwise stop; do not write outside this lineage.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Data and contracts: for phases 001, 002, 005, 006 and 010, are every record schema, field, state machine and bots --json payload specified completely enough to build without a decision? What schema files or contract docs are missing?
- Phase 011-messaging-channels: is the adapter architecture, per-channel transport, identity linking, durable queue, approval rendering and conformance test design deep enough to one-shot, and how should it split into children (shared adapter, Telegram, Slack, Signal, WhatsApp)?
- Small phases 004-computer-exposure and 002-routine-layer, and cross-cutting design: is there a shared architecture doc (module map, file ownership, prompt builder order, answer seam, state-root layout) that every phase builds against, or must one be added before building?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- comparing requirement tables to the runtime validators exposed that strong per-phase field lists still need a shared rollout contract when readers reject unknown keys. (iteration 1)
- reading the channel requirements beside the reference adapter exposed that outbound retry policy does not define inbound acknowledgement durability. (iteration 2)
- comparing the recovered routine purpose and Phase 002 requirements against the OpenBot routine reference surfaced two omitted behaviors, while checking Phase 004's exact output contract and rollback showed its bounded change is already planned concretely. (iteration 3)
- reading each state-changing path as a concurrent or interrupted process exposed gaps that the happy-path module and test plans did not cover. (iteration 4)
- comparing acceptance evidence to handoff criteria exposed that a syntactically complete corpus and a clean report can still leave unresolved runtime failures outside the next phase's declared inputs. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the initial broad runtime lookup used module names that were not present, so it returned no useful contract evidence. (iteration 1)
- the warning event had no lossless representation through the current append gateway, even though the workflow's failure branch requests one. (iteration 2)
- the existing runtime README cannot answer how the parity target should be organized because it describes current modules rather than planned modules. (iteration 3)
- broad searches over all context repositories produced noisy output; narrowing to the phase's named source files and specific reference modules yielded direct evidence. (iteration 4)
- none of the review gaps is visible from module lists alone; they appear in the cross-phase close and handoff clauses. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A blanket claim that phases have no shared contracts is not supported: the build spec has a shared-record ownership table. The gap is a consolidated target architecture and sequence map across those contracts. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:122-139] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A blanket claim that phases have no shared contracts is not supported: the build spec has a shared-record ownership table. The gap is a consolidated target architecture and sequence map across those contracts. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:122-139]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A blanket claim that phases have no shared contracts is not supported: the build spec has a shared-record ownership table. The gap is a consolidated target architecture and sequence map across those contracts. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:122-139]

### Do not copy tinychannels' in-memory approval reply index: phase 011 requires the approval index to survive restart. Use tinychannels first for the adapter/capability model and queue policy, and rakazo for sender linking and bounded polling startup. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs:58-70] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:120,188] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Do not copy tinychannels' in-memory approval reply index: phase 011 requires the approval index to survive restart. Use tinychannels first for the adapter/capability model and queue policy, and rakazo for sender linking and bounded polling startup. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs:58-70] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:120,188]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not copy tinychannels' in-memory approval reply index: phase 011 requires the approval index to survive restart. Use tinychannels first for the adapter/capability model and queue policy, and rakazo for sender linking and bounded polling startup. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs:58-70] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:120,188]

### Do not promote these phases to parents on their `/70` complexity totals alone. The decomposition gate requires the separate phase-score threshold and Level 3 documentation threshold; all three reviewed specs currently identify as Level 2. [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:59-66] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:232] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:237] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:255] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Do not promote these phases to parents on their `/70` complexity totals alone. The decomposition gate requires the separate phase-score threshold and Level 3 documentation threshold; all three reviewed specs currently identify as Level 2. [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:59-66] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:232] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:237] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:255]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Do not promote these phases to parents on their `/70` complexity totals alone. The decomposition gate requires the separate phase-score threshold and Level 3 documentation threshold; all three reviewed specs currently identify as Level 2. [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:59-66] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:232] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:237] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:255]

### No child decomposition is needed for phases 012–014 from this pass. Each is a single operational workflow: scenario corpus and recorder; two alignment runs and a fix pass; or one review/fix/retest loop. Their gaps are handoff and closure rules. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No child decomposition is needed for phases 012–014 from this pass. Each is a single operational workflow: scenario corpus and recorder; two alignment runs and a fix pass; or one review/fix/retest loop. Their gaps are handoff and closure rules.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No child decomposition is needed for phases 012–014 from this pass. Each is a single operational workflow: scenario corpus and recorder; two alignment runs and a fix pass; or one review/fix/retest loop. Their gaps are handoff and closure rules.

### No live external provider was needed to answer the planning-depth question: phase 011 deliberately tests transports with a fake and does not open sockets. The remaining gap is the operator runbook and acknowledgement contract, not a need to make credentials a unit-test prerequisite. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:135-140] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No live external provider was needed to answer the planning-depth question: phase 011 deliberately tests transports with a fake and does not open sockets. The remaining gap is the operator runbook and acknowledgement contract, not a need to make credentials a unit-test prerequisite. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:135-140]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No live external provider was needed to answer the planning-depth question: phase 011 deliberately tests transports with a fake and does not open sockets. The remaining gap is the operator runbook and acknowledgement contract, not a need to make credentials a unit-test prerequisite. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:135-140]

### No named frontier node remained after iteration 3, so the expansive frontier block returned empty. The user-requested phase breadth focus was used; no frontier proposals were emitted. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No named frontier node remained after iteration 3, so the expansive frontier block returned empty. The user-requested phase breadth focus was used; no frontier proposals were emitted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No named frontier node remained after iteration 3, so the expansive frontier block returned empty. The user-requested phase breadth focus was used; no frontier proposals were emitted.

### No repository from the nine context references is the first source for these closing phases. Use the in-repository playbook contract/recorder for 012, the local-alignment commands and report schemas for 013, and the deep-review command/fan-out runner for 014. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No repository from the nine context references is the first source for these closing phases. Use the in-repository playbook contract/recorder for 012, the local-alignment commands and report schemas for 013, and the deep-review command/fan-out runner for 014.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No repository from the nine context references is the first source for these closing phases. Use the in-repository playbook contract/recorder for 012, the local-alignment commands and report schemas for 013, and the deep-review command/fan-out runner for 014.

### Phase 004-computer-exposure does not need a new child on current evidence: its scope is one prompt line over existing record fields with no new state, CLI, or schema, and its plan names implementation modules, tests, dependencies, and rollback. The phase already specifies matching workDir/cwd, branch/null handling, exact prompt text, status row, and JSON output. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:42-55,98-113,143-149] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:58-70,170-180,203-207] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Phase 004-computer-exposure does not need a new child on current evidence: its scope is one prompt line over existing record fields with no new state, CLI, or schema, and its plan names implementation modules, tests, dependencies, and rollback. The phase already specifies matching workDir/cwd, branch/null handling, exact prompt text, status row, and JSON output. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:42-55,98-113,143-149] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:58-70,170-180,203-207]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 004-computer-exposure does not need a new child on current evidence: its scope is one prompt line over existing record fields with no new state, CLI, or schema, and its plan names implementation modules, tests, dependencies, and rollback. The phase already specifies matching workDir/cwd, branch/null handling, exact prompt text, status row, and JSON output. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:42-55,98-113,143-149] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:58-70,170-180,203-207]

### Phase 010's `--transcript --json` payload is not an open design decision in this focus: the packet says it returns a JSON array, enumerates the message fields, and defines append/duplicate/torn-line behavior. Keep an executable fixture, but no additional payload-schema child is required for this gap. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:153-157,167] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md:100,196] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Phase 010's `--transcript --json` payload is not an open design decision in this focus: the packet says it returns a JSON array, enumerates the message fields, and defines append/duplicate/torn-line behavior. Keep an executable fixture, but no additional payload-schema child is required for this gap. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:153-157,167] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md:100,196]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Phase 010's `--transcript --json` payload is not an open design decision in this focus: the packet says it returns a JSON array, enumerates the message fields, and defines append/duplicate/torn-line behavior. Keep an executable fixture, but no additional payload-schema child is required for this gap. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:153-157,167] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md:100,196]

### The completeness of the 58-scenario inventory does not prove its verdicts are clean: its recorded-result acceptance row expressly permits FAIL rows when defects are named. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/acceptance-criteria.md:60-62] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: The completeness of the 58-scenario inventory does not prove its verdicts are clean: its recorded-result acceptance row expressly permits FAIL rows when defects are named. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/acceptance-criteria.md:60-62]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The completeness of the 58-scenario inventory does not prove its verdicts are clean: its recorded-result acceptance row expressly permits FAIL rows when defects are named. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/acceptance-criteria.md:60-62]

### The current runtime README documents existing package topology, not the planned parity target architecture; do not treat it as a substitute for the target module and state-root maps. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/README.md:21-39,43-75] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The current runtime README documents existing package topology, not the planned parity target architecture; do not treat it as a substitute for the target module and state-root maps. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/README.md:21-39,43-75]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The current runtime README documents existing package topology, not the planned parity target architecture; do not treat it as a substitute for the target module and state-root maps. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/README.md:21-39,43-75]

### The first runtime search used presumed module paths that are not present; narrowing to the current `needs-you.ts` and `request-record.ts` validators produced direct evidence for the closed-key compatibility risk. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The first runtime search used presumed module paths that are not present; narrowing to the current `needs-you.ts` and `request-record.ts` validators produced direct evidence for the closed-key compatibility risk.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The first runtime search used presumed module paths that are not present; narrowing to the current `needs-you.ts` and `request-record.ts` validators produced direct evidence for the closed-key compatibility risk.

### The phase already covers the main refusal, security, and outbound-reliability rules: default-deny linking, approver checks, secret redaction, signature validation, restart-safe approval prompts, unknown-after-send, and bounded retries. Keep these as shared child invariants rather than reopening their policy decisions. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:185-195,201-210,239-248,264-271] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The phase already covers the main refusal, security, and outbound-reliability rules: default-deny linking, approver checks, secret redaction, signature validation, restart-safe approval prompts, unknown-after-send, and bounded retries. Keep these as shared child invariants rather than reopening their policy decisions. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:185-195,201-210,239-248,264-271]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The phase already covers the main refusal, security, and outbound-reliability rules: default-deny linking, approver checks, secret redaction, signature validation, restart-safe approval prompts, unknown-after-send, and bounded retries. Keep these as shared child invariants rather than reopening their policy decisions. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:185-195,201-210,239-248,264-271]

### The prior security and skill reviews already identified 008's grammar/mapping/index/migration/lock gaps and 009's grammar/default/sentinel/schema gaps; this pass rechecked those against the current requirements and did not count them as separate new findings. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-006.md:15-27] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-007.md:15-23] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The prior security and skill reviews already identified 008's grammar/mapping/index/migration/lock gaps and 009's grammar/default/sentinel/schema gaps; this pass rechecked those against the current requirements and did not count them as separate new findings. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-006.md:15-27] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-007.md:15-23]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The prior security and skill reviews already identified 008's grammar/mapping/index/migration/lock gaps and 009's grammar/default/sentinel/schema gaps; this pass rechecked those against the current requirements and did not count them as separate new findings. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-006.md:15-27] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-007.md:15-23]

### Treating the chat JSON array shape itself as missing was disproved by phase 010 REQ-006 and its CLI fixture; the remaining shared-contract gap concerns cross-phase record evolution. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Treating the chat JSON array shape itself as missing was disproved by phase 010 REQ-006 and its CLI fixture; the remaining shared-contract gap concerns cross-phase record evolution.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the chat JSON array shape itself as missing was disproved by phase 010 REQ-006 and its CLI fixture; the remaining shared-contract gap concerns cross-phase record evolution.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Phase 010's `--transcript --json` payload is not an open design decision in this focus: the packet says it returns a JSON array, enumerates the message fields, and defines append/duplicate/torn-line behavior. Keep an executable fixture, but no additional payload-schema child is required for this gap. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:153-157,167] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md:100,196] (iteration 1)
- The first runtime search used presumed module paths that are not present; narrowing to the current `needs-you.ts` and `request-record.ts` validators produced direct evidence for the closed-key compatibility risk. (iteration 1)
- Treating the chat JSON array shape itself as missing was disproved by phase 010 REQ-006 and its CLI fixture; the remaining shared-contract gap concerns cross-phase record evolution. (iteration 1)
- Do not copy tinychannels' in-memory approval reply index: phase 011 requires the approval index to survive restart. Use tinychannels first for the adapter/capability model and queue policy, and rakazo for sender linking and bounded polling startup. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs:58-70] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:120,188] (iteration 2)
- No live external provider was needed to answer the planning-depth question: phase 011 deliberately tests transports with a fake and does not open sockets. The remaining gap is the operator runbook and acknowledgement contract, not a need to make credentials a unit-test prerequisite. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:135-140] (iteration 2)
- The phase already covers the main refusal, security, and outbound-reliability rules: default-deny linking, approver checks, secret redaction, signature validation, restart-safe approval prompts, unknown-after-send, and bounded retries. Keep these as shared child invariants rather than reopening their policy decisions. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:185-195,201-210,239-248,264-271] (iteration 2)
- A blanket claim that phases have no shared contracts is not supported: the build spec has a shared-record ownership table. The gap is a consolidated target architecture and sequence map across those contracts. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:122-139] (iteration 3)
- Phase 004-computer-exposure does not need a new child on current evidence: its scope is one prompt line over existing record fields with no new state, CLI, or schema, and its plan names implementation modules, tests, dependencies, and rollback. The phase already specifies matching workDir/cwd, branch/null handling, exact prompt text, status row, and JSON output. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:42-55,98-113,143-149] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:58-70,170-180,203-207] (iteration 3)
- The current runtime README documents existing package topology, not the planned parity target architecture; do not treat it as a substitute for the target module and state-root maps. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/README.md:21-39,43-75] (iteration 3)
- Do not promote these phases to parents on their `/70` complexity totals alone. The decomposition gate requires the separate phase-score threshold and Level 3 documentation threshold; all three reviewed specs currently identify as Level 2. [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:59-66] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:232] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:237] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:255] (iteration 4)
- No named frontier node remained after iteration 3, so the expansive frontier block returned empty. The user-requested phase breadth focus was used; no frontier proposals were emitted. (iteration 4)
- The prior security and skill reviews already identified 008's grammar/mapping/index/migration/lock gaps and 009's grammar/default/sentinel/schema gaps; this pass rechecked those against the current requirements and did not count them as separate new findings. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-006.md:15-27] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-007.md:15-23] (iteration 4)
- No child decomposition is needed for phases 012–014 from this pass. Each is a single operational workflow: scenario corpus and recorder; two alignment runs and a fix pass; or one review/fix/retest loop. Their gaps are handoff and closure rules. (iteration 5)
- No repository from the nine context references is the first source for these closing phases. Use the in-repository playbook contract/recorder for 012, the local-alignment commands and report schemas for 013, and the deep-review command/fan-out runner for 014. (iteration 5)
- The completeness of the 58-scenario inventory does not prove its verdicts are clean: its recorded-result acceptance row expressly permits FAIL rows when defects are named. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/acceptance-criteria.md:60-62] (iteration 5)

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
Prior plan-depth analysis exists in the sibling vibe lineage; treat it as leads and verify every claim against phase docs and runtime sources.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
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
- Started: 2026-11-25T21:46:25.000Z
