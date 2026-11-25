---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Planning-depth review of packet specs/system-skilled-bots/003-openbot-parity-build, the OpenBot parity build for skilled bots: fourteen phases (001-activity-and-actor, 002-routine-layer, 003-terminal-screen, 004-computer-exposure, 005-memory, 006-approval-grants, 007-per-bot-apps, 008-vault, 009-skills, 010-conversations, 011-messaging-channels, 012-manual-testing-scenarios, 013-skilled-and-doc-alignment, 014-deep-review). The operator wants to build all of it in one shot to perfection, so every phase must be planned and architected deeply enough that a builder needs no design decision while building.

Phase 003-terminal-screen was just expanded into a Level 3 phase parent with six children (UX and component map with a design/ folder of mockups, key map, glyph table and component inventory; architecture and contracts; shell and navigation; panes; answer flow; hardening). Use it as the benchmark for depth. Do not review 003's children themselves.

For every other phase answer: is it planned deeply enough to one-shot? What is missing: module and file design, data contracts and record schemas with every field, state machines and lifecycles, error and refusal catalogue, concurrency and restart behavior, migration and rollback, test strategy with fixtures, the interfaces it offers to and takes from other phases, security boundaries, operator prerequisites, and design artifacts (diagrams, schema files, sequence flows, mockups for anything user-facing such as chat and channel messages)? Should it become a phase parent with children like 003, and which children? What reference code in specs/system-skilled-bots/context/ (OpenBot-main, OpenMausBot-main, rakazo-main, openhuman-main, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main, tinychannels-main) should it study first?

Evidence (read-only): the phase docs; the built runtime under .skilled/skills/system-skilled-bots/runtime/lib/ and .skilled/bin/bots.cjs; the earlier research in specs/system-skilled-bots/002-openbot-parity-research/.

Every finding names the phase, the gap, the evidence as [SOURCE: path:line], a severity (P0 the build cannot be one-shot without it, P1 a builder would have to decide, P2 polish) and the exact planning artifact or child phase that closes it. End with a ranked per-phase expansion plan.

- Started: 2026-11-25T21:23:53.000Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-vibe-1795641770973-zif3qt
- Parent Session: 2026-11-25T21:22:47.916Z
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Frontier node F-1-001 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor, specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer, specs/system-skilled-bots/003-openbot-parity-build/005-memory, specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants, specs/system-skilled-bots/003-openbot-parity-build/010-conversations, .skilled/skills/system-skilled-bots/runtime/lib): Data and contracts: for phases 001, 002, 005, 006 and 010, are every record schema, field, state machine and bots --json payload specified completely enough to build without a decision? What schema files or contract docs are missing? | data-contracts | 0.93 | 7 | complete |
| 2 | Frontier node F-1-003 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels, specs/system-skilled-bots/context/tinychannels-main, specs/system-skilled-bots/context/rakazo-main): Phase 011-messaging-channels: is the adapter architecture, per-channel transport, identity linking, durable queue, approval rendering and conformance test design deep enough to one-shot, and how should it split into children (shared adapter, Telegram, Slack, Signal, WhatsApp)? | messaging-channels | 0.86 | 7 | complete |
| 3 | Frontier node F-1-003 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels, specs/system-skilled-bots/context/tinychannels-main, specs/system-skilled-bots/context/rakazo-main): Phase 011-messaging-channels: is the adapter architecture, per-channel transport, identity linking, durable queue, approval rendering and conformance test design deep enough to one-shot, and how should it split into children (shared adapter, Telegram, Slack, Signal, WhatsApp)? | architecture | 0.86 | 7 | complete |
| 4 | Frontier node F-2-006 (depth 2, scope .skilled/bin/bots.cjs, .skilled/skills/system-skilled-bots/runtime/lib/status.ts): What is the exact JSON envelope convention every bots ... --json verb must follow, and which existing verb sets the precedent? | json-contracts | 0.90 | 5 | complete |
| 5 | Frontier node F-2-007 (depth 2, scope .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts, phases 001/005/006/009/010): Which phases must change when the needs-you item gains grants, kind, conversationId and proposal fields, and is the closed ITEM_KEYS list a single-writer contract or a per-phase one? | shared-records | 0.86 | 7 | complete |
| 6 | Phases 007-per-bot-apps and 008-vault: are the security boundaries, secret handling, per-run config and operator prerequisites planned deeply enough to one-shot? | security | 0.93 | 8 | complete |
| 7 | Phases 009-skills and 012-manual-testing-scenarios: are the skill-proposal staged-write path and the 33-scenario corpus planned deeply enough to one-shot, and does the corpus have fixtures rather than prose? | test-strategy | 0.88 | 8 | complete |
| 8 | Phases 013-skilled-and-doc-alignment and 014-deep-review: can the two closing phases actually prove the packet, and does 014 five-lineage review have a defined input, merge rule and fix-verification loop? | closing-phases | 0.90 | 8 | complete |
| 9 | Cross-cutting layer: does the packet have one error and refusal catalogue, one concurrency and restart rule, and one migration and rollback rule, or is each phase names the only record? | cross-cutting | 0.92 | 8 | complete |
| 10 | The ranked per-phase expansion plan: which phases become parents with which children, which single cross-cutting artifact closes the most findings, and what design artifacts the user-facing surfaces still need. | expansion-plan | 0.80 | 8 | complete |

- iterationsCompleted: 10
- keyFindings: 73
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Data and contracts: for phases 001, 002, 005, 006 and 010, are every record schema, field, state machine and bots --json payload specified completely enough to build without a decision? What schema files or contract docs are missing?
- [x] Phase 011-messaging-channels: is the adapter architecture, per-channel transport, identity linking, durable queue, approval rendering and conformance test design deep enough to one-shot, and how should it split into children (shared adapter, Telegram, Slack, Signal, WhatsApp)?
- [x] Small phases 004-computer-exposure and 002-routine-layer, and cross-cutting design: is there a shared architecture doc (module map, file ownership, prompt builder order, answer seam, state-root layout) that every phase builds against, or must one be added before building?
- [x] What is the exact JSON envelope convention every bots ... --json verb must follow, and which existing verb sets the precedent?
- [x] Which phases must change when the needs-you item gains grants, kind, conversationId and proposal fields, and is the closed ITEM_KEYS list a single-writer contract or a per-phase one?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▆▄▄▄▅▆▆▅▅▇▇▆▅▆▆▇▇▄▁
- score sparkline: █▆▄▄▄▅▆▆▅▅▇▇▆▅▆▆▇▇▄▁
- Last 3 ratios: 0.90 -> 0.92 -> 0.80
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.80
- coverageBySources: {"code":94,"other":20}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
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

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:frontier -->
## 6B. FRONTIER
- Frontier size: 5 nodes (0 open, 0 active, 5 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 1
- Budget depth1: 3 of 5 iterations spent
- Budget depth2: 2 of 5.5 iterations spent
- Budget depth3: 0 of 5 iterations spent

<!-- /ANCHOR:frontier -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
