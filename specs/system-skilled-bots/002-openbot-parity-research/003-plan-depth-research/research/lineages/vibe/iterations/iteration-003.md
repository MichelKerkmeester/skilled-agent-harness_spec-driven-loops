# Iteration 3: Shared architecture, the small phases, and the cross-cutting seams

## Focus
Frontier node F-1-005 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/spec.md, specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer, specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure, .skilled/skills/system-skilled-bots/runtime/lib): Small phases 004-computer-exposure and 002-routine-layer, and cross-cutting design: is there a shared architecture doc (module map, file ownership, prompt builder order, answer seam, state-root layout) that every phase builds against, or must one be added before building?

## Actions Taken
1. Read 004's Scope, Files to Change and all nine requirements, including its "Design references" table.
2. Read the runtime library README's package topology, allowed-direction rule and module table — the only architecture document in the tree.
3. Read `answer.ts`'s import block to test the README's allowed-direction rule against the code it governs.
4. Grepped the whole packet for diagram artifacts (`mermaid`, `sequenceDiagram`, `graph TD`, `.svg`, `.puml`) and for the "Design references" table, to measure how unevenly the depth devices are distributed.
5. Re-read 002's plan Architecture section for the state-root and routine-state facts already gathered in iteration 1.

## Findings
1. **P0 — There is no target-state architecture document: the only architecture doc describes the 28 modules that exist today, while the packet adds roughly fifteen modules across fourteen phases and no artifact lists the post-build module map, the group each new module joins, or the new import edges.** The README's topology and module table cover `repo-config` through `status-index` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/README.md:20-60], and the phases add `activity.ts`, `actor.ts`, `routine.ts`, `routine-state.ts`, `memory.ts`, `channel.ts`, `channel-link.ts`, `channel-approval.ts`, `channel-queue.ts`, five `channel-*` transports, plus the vault, skills and chat modules — none of which appears in the table. Closing artifact: `contracts/architecture.md` with the target module map, the group per module, the allowed edges, and a per-phase "modules added" row; it belongs to the same new cross-cutting phase that owns `contracts/`.
2. **P0 — The README's allowed-direction rule is already false in the code it governs, and 011 adds a fourth violation, so a builder cannot tell whether to follow the rule or the code.** The rule reads "a contracts module imports no `lib/` module outside its own group" [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/README.md:39], but `answer.ts` — a contracts-and-state module — imports `dispatch.js`, `request-queue.js` and `runner.js` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:22-27], three modules outside its group. 011 REQ-021 then adds a roster check to `answer.ts` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:208], which would import `channel-link.ts` as a fourth. Closing artifact: restate the rule as the layering the code actually has (or invert the roster check behind an injected predicate passed by the caller), and add a `rg` check to the phase's verification so the rule cannot drift again.
3. **P1 — The prompt section order lives in one phase's plan paragraph and is cited by three other phases, so the shared contract is a citation rather than a document.** 005's plan fixes the order as "exemption, spec folder, working place, checkout, memory, skills, decision marker, body, conversation" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:71], and 004 cites it for its slot [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:158], 009 and 010 cite it for theirs [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:150]. Four phases edit one function and the order is owned by a plan that a later phase may rewrite. Closing artifact: `contracts/prompt-sections.md` with the ordered list, the exact line text per block, and the absent-block rule.
4. **P1 — The answer seam's stage order is stated in three requirements and drawn nowhere.** 005 fixes the seam after the answer and the scope and before the resume request [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:167], 006 fixes the scope write before the seam [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:156], and 011 fixes the roster check before the write [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:208]. A builder must assemble the five-stage order from three documents. Closing artifact: `contracts/sequences/answer.md` with one sequence diagram and the stage list, which is also the test's assertion order.
5. **P1 — The state-root layout has no target tree, while six phases add a folder to it.** 002 adds `routines/` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:62], 005 adds `memory/` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:90], 009 adds a skills folder, 010 adds `conversations/` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:146], and 011 adds `channels/` with `queue/` and `seen/` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:151]. `state-root.ts` names today's folders only [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117-131]. Closing artifact: `contracts/state-root.md` with the final tree, the mode per node (0700 folder, 0600 file) and the owning phase per node.
6. **P1 — The packet contains zero diagrams, while three of its flows have ten, five and eight ordered stages.** A grep for `mermaid`, `sequenceDiagram`, `graph TD`, `.svg` and `.puml` across all fourteen phases returns no match, and the flows that need one are the runner's ten-step order [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/README.md:58], the answer seam's five stages and the channel inbound-to-answer path [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:76]. Closing artifact: `contracts/sequences/` with four mermaid diagrams (run, answer, channel inbound, chat turn), each cited by the phase that owns the flow.
7. **P2 — The depth devices are unevenly distributed: 004 carries a "Design references" table mapping every requirement to the existing shape it follows, and 002, 005, 006 and 010 carry none.** 004's table names one reference per requirement [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:169-180]; a grep for "Design references" across the packet returns 004 and two 003 children only. Closing artifact: add the table to every phase, or move it into `contracts/architecture.md` as one shared reference index keyed by requirement.

## Ruled Out
- Concluding that 004 needs a child: it lists 12 files, nine requirements, the exact prompt line text, the null-branch variant and a design-reference per requirement [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:150-180], so it is the packet's best example of a one-shot-ready small phase. It needs the shared contracts, not children.
- Treating the parent spec's phase map as the architecture doc: it names one dependency per phase and no module, group or edge [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:151-166].
- Looking for a per-phase "Interfaces" section: the Level 2 template has no such anchor, so the offered and consumed interfaces are only ever prose inside Scope and Requirements.

## Dead Ends
- The README is not useless: its package topology and module table are the right shape for the target-state doc, so the closing artifact is an extension of that file plus a `contracts/` copy, not a new invention.
- 002's own depth is not the gap here: its block rules, floor, fatigue count and refusal names are specified to the field level [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:153-181]; the gaps iteration 1 found (state file, `until` observation) are the only ones, so 002 needs no child either.

## Edge Cases
- Ambiguous input: the node asks about "a shared architecture doc" and about two specific phases. Selected interpretation: answer the cross-cutting question first (findings 1-6) and treat 004 and 002 as the test cases for whether a small phase can be one-shot without one (finding 7 and the Dead Ends). Deferred: the target-state module map's exact content, which needs the module list from all fourteen phases and belongs to the contracts phase.
- Contradictory evidence: the README's rule versus `answer.ts`'s imports is a genuine contradiction between a document and its code; both are cited and the code is treated as the current truth, with the rule flagged as stale rather than the code as wrong.
- Missing dependencies: none; the README, `answer.ts` and `state-root.ts` are all present.
- Partial success: none.

## Questions Answered
- Is there a shared architecture doc every phase builds against? No. There is a current-state module doc (the lib README) whose import rule is already false, and the cross-cutting contracts (prompt order, answer seam, state-root tree, diagrams) live in phase plans or nowhere.
- Must one be added before building? Yes: `contracts/architecture.md`, `contracts/prompt-sections.md`, `contracts/state-root.md` and `contracts/sequences/`, owned by a new cross-cutting phase that lands before 001.
- Do 004 and 002 need children? No. 004 is the packet's best one-shot-ready small phase; 002's only gaps are the two iteration 1 found.

## Questions Remaining
- Should the contracts phase be a new phase 015 or a child of 013-skilled-and-doc-alignment, given that 013 already owns doc alignment?
- Does the roster check belong in `answer.ts` at all, or should the caller pass an `isApprover` predicate so the contracts group keeps its import boundary?

## Sources Consulted
- .skilled/skills/system-skilled-bots/runtime/lib/README.md:20-60
- .skilled/skills/system-skilled-bots/runtime/lib/answer.ts:22-27
- .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:117-131
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:92-180
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:153-181
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/plan.md:58-73
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/plan.md:71
- specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:90, 167
- specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:156
- specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:146, 150
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:151, 208
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:76
- specs/system-skilled-bots/003-openbot-parity-build/spec.md:151-166
- grep for mermaid/sequenceDiagram/graph TD/.svg/.puml across the packet (no matches)

## Assessment
- New information ratio: 0.86
- Questions addressed: the F-1-005 node question (shared architecture doc, small phases, cross-cutting design)
- Questions answered: all three parts

## Reflection
- What worked and why: testing the README's stated rule against `answer.ts`'s actual imports turned a documentation question into a contradiction with evidence on both sides, which is the strongest kind of finding this review can produce.
- What did not work and why: grepping for diagrams was cheap but only confirms an absence; the useful part was counting the stages each flow has, which is what makes the absence a gap rather than a preference.
- What I would do differently: read the README's allowed-direction rule before the phase plans, because it is the one document that claims to govern every phase and it is the fastest way to find a cross-phase conflict.

## Recommended Next Focus
The two depth-2 nodes admitted under F-1-001 (the `--json` envelope rule and the `ITEM_KEYS` single-writer question), then the phases this lineage has not yet reviewed: 007-per-bot-apps, 008-vault, 009-skills, 012-manual-testing-scenarios, 013-skilled-and-doc-alignment and 014-deep-review. The contracts phase recommendation now has three independent supports (iteration 1's schemas, iteration 2's channel records, this iteration's architecture and diagrams), so it should be ranked first in the synthesis.
