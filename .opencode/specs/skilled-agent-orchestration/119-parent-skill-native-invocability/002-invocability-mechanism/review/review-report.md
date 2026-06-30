# Deep Review Report — 001-invocability-mechanism

**Target:** `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism`  
**Mode:** round-robin · 4 models (Kimi-K2.7, MiniMax-M3, DeepSeek-v4-Pro, MiMo-v2.5-Pro) · 10 iterations  
**Generated:** 2026-06-28T07:38:09.123Z

## 1. Verdict

**FAIL** — P0=4 · P1=20 · P2=5 · total 29

## 2. Dimension coverage

- correctness: covered
- security: covered
- traceability: covered
- maintainability: covered

## 3. P0 — Blockers
### P0 Findings (4)

- **001-F001 [P0/correctness]** False completion claim in implementation-summary.md
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/implementation-summary.md` (line 46)
  - Evidence: "**Completed** | Mechanism decided (Option E, Accepted); reference implementation in spec 154"
  - Impact: Claims the packet is complete when every checklist item, every task, and every `_memory.completion_pct` field in the packet still reads 0/unchecked.
  - Fix: Either mark the applicable checklist/tasks complete and bump `completion_pct` consistently, or remove the completion language and keep the packet Draft.
  - _via Kimi-K2.7, iter 1_
- **001-F002 [P0/correctness]** Contradictory ADR-001 status: Accepted vs Proposed
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md` (line 47)
  - Evidence: "| **Status** | Accepted |"
  - Impact: plan.md ADR-001 at line 288 says "**Status**: Proposed"; the same decision cannot be both Proposed and Accepted.
  - Fix: Reconcile the two ADR-001 instances to a single status that matches the packet’s actual state.
  - _via Kimi-K2.7, iter 1_
- **001-F003 [P0/correctness]** False claim of runtime-probe evidence
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md` (line 99)
  - Evidence: "The mechanism is chosen against evidence from a real runtime probe rather than an assumption."
  - Impact: tasks.md Phase 1 tasks T001–T005 are all unchecked, tasks.md states "All tasks below are pending", and spec.md next_safe_action says to run the Phase 1 probe; no probe has happened.
  - Fix: Remove the probe-evidence claim or actually execute and evidence the Phase 1 probe before asserting it.
  - _via Kimi-K2.7, iter 1_
- **001-F006 [P0/security]** Invokable-hub routing (Option E) widens per-mode tool-permission contracts, violating NFR-S01
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md` (line 157)
  - Evidence: NFR-S01: "No mechanism may widen a packet's tool-permission contract as a side effect of becoming invocable."
  - Impact: The canonical implementation (deep-loop-workflows) and reference implementation (sk-design) both demonstrate that when Skill(<parent>) routes to a mode, only the hub's allowed-tools governs. Mode packets that declare narrower tool sets (e.g. deep-context/allowed-tools excludes Task/WebFetch; design-foundations/allowed-tools excludes Write/Edit/Bash) silently gain those tools through the hub. The spec's own security NFR is violated by the mechanism the decision record selected.
  - Fix: Either (a) constrain each mode's effective tool set to its own allowed-tools by having the hub read and honor the mode packet's frontmatter, or (b) amend NFR-S01 and the decision record to document that hub-level allowed-tools is the single contract, removing per-mode allowed-tools as misleading.
  - _via DeepSeek-v4-Pro, iter 3_

## 4. P1 — Required
### P1 Findings (20)

- **001-F004 [P1/correctness]** Scope inconsistency: Option E chosen though spec.md scoped only A–D
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md` (lines 84–86)
  - Evidence: "A decision-record framing of the mechanism options (per-mode commands, per-mode agents, thin shim skills, runtime enhancement)"
  - Impact: decision-record.md introduces and selects Option E ("invokable-hub routing"), which was never listed in the authorized scope, creating an undocumented scope expansion.
  - Fix: Amend spec.md scope to include Option E, or amend decision-record.md to restrict the choice to the originally scoped A–D options.
  - _via Kimi-K2.7, iter 1_
- **001-F005 [P1/correctness]** Parent/child status and completion mismatch
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/spec.md` (line 49)
  - Evidence: "| **001-invocability-mechanism** | ... | Mechanism **accepted** (ADR-001); validated in practice by the 154 sk-design conversion |"
  - Impact: The child 001 spec.md says Status "Draft" and `_memory.completion_pct: 0`, while the parent reports the child as accepted/validated and the parent itself sets `completion_pct: 50`.
  - Fix: Align parent and child status/completion metadata so the same phase is not simultaneously Draft and accepted.
  - _via Kimi-K2.7, iter 1_
- **001-F007 [P1/security]** ADR-001 never evaluates the chosen mechanism against spec NFR-S01
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md` (lines 67-73 (Option E decision) and lines 80-91 (alternatives))
  - Evidence: Decision: "We chose: Option E — invokable-hub routing." The section describes mechanics and lists pros/cons (single identity, no runtime change) but never mentions tool-permission contracts. The alternatives table likewise evaluates identity and surface costs, not permission widening.
  - Impact: The decision record selects a mechanism without auditing its most directly-stated security NFR. This is a traceability and security-review gap: the checklist (CHK-130, CHK-030–032) has all security items unchecked or deferred, and the decision record's Five Checks never include a security axis.
  - Fix: Add a security evaluation row to ADR-001 that candidly assesses Option E against NFR-S01, documents the gap (hub allowed-tools overrides per-mode declarations), and either proposes mitigation or records an accepted risk.
  - _via DeepSeek-v4-Pro, iter 3_
- **001-F008 [P1/traceability]** Requirements have no forward trace to tasks or checklist items
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md` (lines 114-124 (requirements), tasks.md lines 59-87, checklist.md lines 61-199)
  - Evidence: spec.md defines REQ-001...REQ-005 and SC-001/SC-002, but tasks.md T001-T010 and checklist.md CHK-001/CHK-100/etc. carry no requirement identifiers or traceability matrix.
  - Impact: Cannot verify that every requirement has implementation work and a verification item; coverage gaps cannot be measured.
  - Fix: Add a traceability matrix or annotate tasks/checklist items with the REQ/SC/NFR IDs they satisfy, with bidirectional references back to the problem statement.
  - _via Kimi-K2.7, iter 5_
- **001-F009 [P1/traceability]** Canonical parent-skill example is described as non-Skill() invokable but now documents invokable-hub routing
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md` (line 73; contradicted by .opencode/skills/deep-loop-workflows/SKILL.md lines 18 and 36)
  - Evidence: spec.md: "`deep-loop-workflows` reaches its modes through its `/deep:*` commands and agent types, never through `Skill()`." deep-loop-workflows/SKILL.md: "Invoke it as `Skill(deep-loop-workflows)`" and "Routing is registry-driven (invokable-hub, Option E)."
  - Impact: The problem statement's evidence is undermined; a reader verifying the cross-reference will find the canonical skill already uses the mechanism the packet claims is missing.
  - Fix: Update the problem statement to distinguish `Skill(<mode>)` failure from `Skill(<parent>)` success, and align the canonical-example citation with the current deep-loop-workflows/SKILL.md.
  - _via Kimi-K2.7, iter 5_
- **001-F010 [P1/traceability]** Checklist verification summary shows zero verified items despite a passed validate.sh --strict run
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/implementation-summary.md` (line 66; checklist.md lines 136-143)
  - Evidence: implementation-summary.md: "The packet was validated with `validate.sh --strict`." checklist.md Verification Summary: "P0 Items 11 | 0/11 ... P1 Items 14 | 0/14 ... P2 Items 2 | 0/2". A fresh `validate.sh --strict` run on the packet returns RESULT: PASSED.
  - Impact: The checklist does not reflect the validation that occurred; pre-implementation and documentation checks remain unchecked even though the underlying docs exist and validation passed.
  - Fix: Mark applicable documentation/architecture checklist items complete with evidence from the validation run and reconcile the verification summary.
  - _via Kimi-K2.7, iter 5_
- **001-F012 [P1/maintainability]** Stale Branch field in metadata
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md` (line 64)
  - Evidence: | **Branch** | `system-speckit/028-memory-search-intelligence` |
  - Impact: Repo is currently on `system-speckit/154-design-context-loading` (verified via `git branch --show-current`); the Branch field is a copy-paste from a completely unrelated packet (028) and there is no `system-speckit/155-...` branch at all. Any future reader who trusts this field will look for the work on the wrong branch and may conclude the packet was never authored on its own branch.
  - Fix: Either set Branch to the actual current branch (`system-speckit/154-design-context-loading`) at authoring time or remove the field; do not leave an unrelated packet's branch name as authoritative metadata.
  - _via MiniMax-M3, iter 6_
- **001-F013 [P1/maintainability]** Dead pointer to non-existent HVR rules file
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/implementation-summary.md` (line 36 (also decision-record.md line 36))
  - Evidence: <!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
  - Impact: `hvr_rules.md` does not exist anywhere in the repo (verified via glob). Two docs advertise an HVR reference that 404s. Future maintainers following the HVR comment looking for the verification rules it implies will not find it, and any lint/validator that walks HVR_REFERENCE links will produce false negatives.
  - Fix: Either author `.opencode/skills/sk-doc/references/hvr_rules.md` with the rules the comment implies, or remove the HVR_REFERENCE comments from both docs.
  - _via MiniMax-M3, iter 6_
- **001-F014 [P1/maintainability]** Five-vs-four option count drift across docs
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md` (lines 3, 56, 80, 82-88, 122 (and plan.md line 59, spec.md line 86))
  - Evidence: Line 3 description: "Frames the four candidate mechanisms"; Line 56: "This decision frames the candidate mechanisms and records that the choice is deferred"; Line 80: "The four mechanism options. Scores are preliminary"; Line 122: "Four distinct mechanisms are framed" — but the alternatives table (lines 82-88) lists A, B, C, D, E and marks E as CHOSEN. Plan.md line 59 also says "four mechanism options". Spec.md line 86 names four (commands/agents/shims/runtime).
  - Impact: Even setting aside the scope-inconsistency (Option E out of frame), the prose count is wrong in at least four places. A future reader sees "four options" in the description and immediately distrusts the table when E appears. Reconciliation requires opening both files.
  - Fix: Update all four/five numeric references to a single authoritative count once the mechanism set is stable; recommend explicitly distinguishing "in scope at authoring" from "ultimately considered" so the doc is internally self-consistent.
  - _via MiniMax-M3, iter 6_
- **001-F015 [P1/maintainability]** ADR-001 Five-Checks #5 "Open Horizons" contradicts the chosen decision
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/decision-record.md` (lines 119-125)
  - Evidence: Row 5: "Open Horizons? | PASS | Deferring keeps option D open while pre-committing a fallback if it is out of reach" — but Decision (line 70) chose Option E, and Alternatives (line 87) marks D as "not needed". Consequences table (line 109) still lists "Option D is not achievable in-repo" as a residual risk with a fallback mitigation, even though D is already excluded.
  - Impact: The same ADR simultaneously declares D "open", "not needed", and "a risk that needs a fallback". Any Five-Checks-driven audit will read 5/5 PASS and stop there, missing that the ADR's own decision contradicts row 5 and the consequences row.
  - Fix: Mark row 5 as FAIL (the decision closed the horizon) or rewrite row 5 to acknowledge the decision was made and only D-not-needed is the residual open question; reconcile the Consequences risk table with D's actual status.
  - _via MiniMax-M3, iter 6_
- **001-F016 [P1/maintainability]** plan.md and decision-record.md ADR Consequences contradict each other
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/plan.md` (lines 286-300 vs decision-record.md lines 94-104)
  - Evidence: plan.md ADR-001 Status: Proposed; Decision: "Deferred"; Consequences: "Keeping the choice open avoids pre-deciding a mechanism that the runtime may not support." decision-record.md ADR-001 Status: Accepted; Decision: "We chose Option E"; Consequences: "The mechanism is chosen against evidence from a real runtime probe rather than an assumption."
  - Impact: The same ADR is in two contradictory states across the packet: plan-only/deferred/Proposed in plan.md, decided/Accepted in decision-record.md. The Five-Checks table and consequences rationale only match the decision-record version. Future readers will pick one file and get the wrong story.
  - Fix: Make plan.md ADR-001 a historical-reference stub pointing at decision-record.md, or align its Status/Decision/Consequences with the chosen-mechanism narrative; do not leave two copies of the same ADR in different states.
  - _via MiniMax-M3, iter 6_
- **001-F018 [P1/correctness]** implementation-summary.md internally contradicts itself on validate.sh --strict
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/implementation-summary.md` (lines 66 vs 87)
  - Evidence: line 66: "The packet was validated with `validate.sh --strict`." (past tense); line 87: "`validate.sh --strict` on this packet | PASS expected at completion of authoring" (future/conditional)
  - Impact: The same document asserts validation both happened and is expected to happen. If the run occurred, line 87 should cite the result and timestamp, not hedge. If it didn't, line 66 is a false past-tense claim. Either way the verification record is untrustworthy.
  - Fix: Pick one truth: record the actual validate.sh output (pass or fail) with a concrete timestamp, or remove the past-tense claim and mark validation pending.
  - _via DeepSeek-v4-Pro, iter 7_
- **001-F019 [P1/correctness]** Unchecked task T005 has an existing output that exceeds its documented scope
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/tasks.md` (line 63 (T005), cross-referenced with decision-record.md line 70 and line 88)
  - Evidence: tasks.md T005 (still `[ ]` unchecked): "Produce the mechanism decision selecting among options A through D with cited evidence and a fallback (decision-record.md)". decision-record.md line 70: "We chose: Option E". Line 88: Option E table row. The decision already exists, chose Option E (outside A–D), and the task that was supposed to produce it was never marked complete.
  - Impact: The decision output was produced outside the task workflow, exceeding the scope the task defined (A–D, not A–E). This breaks traceability: no task produced this output according to the task list, yet the output is cited as evidence of completion. A downstream reviewer cannot trust the task list to reflect what actually happened.
  - Fix: Either mark T005 complete and update its description to match what was actually done (A-E, Option E chosen), or re-derive the decision from the task workflow and reconcile the scope.
  - _via DeepSeek-v4-Pro, iter 7_
- **001-F020 [P1/traceability]** Parent phase-map claims 001 accepted while child graph-metadata says draft
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/spec.md` (line 49)
  - Evidence: Phase Documentation Map: 001-invocability-mechanism Status = 'Mechanism accepted (ADR-001); validated in practice by the 154 sk-design conversion' — but child graph-metadata.json line 61 has "status": "draft" and child spec.md line 62 has Status 'Draft'
  - Impact: Parent and child disagree on the fundamental state of the phase; memory search, resume, and phase routing will surface conflicting statuses
  - Fix: Align the parent phase-map status with the child docs; if the child is still draft/proposed, the parent must not claim accepted
  - _via Kimi-K2.7, iter 9_
- **001-F021 [P1/traceability]** Parent graph-metadata status 'planned' contradicts parent spec.md 'accepted' for 001
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/graph-metadata.json` (line 38)
  - Evidence: "status": "planned" — contradicts parent spec.md line 49 which states phase 001 'Mechanism accepted (ADR-001); validated in practice by the 154 sk-design conversion'
  - Impact: Machine-readable graph metadata does not match the human-readable phase-map, breaking automated status queries and resume routing
  - Fix: Update parent graph-metadata.json derived.status to match the spec.md phase-map claim, or correct the spec.md claim if it is premature
  - _via Kimi-K2.7, iter 9_
- **001-F022 [P1/traceability]** REQ-002 (P0 blocker) acceptance criterion is not satisfied by the decision-record artifact
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md` (line 115)
  - Evidence: REQ-002 requires 'decision-record.md lists options A through D, each with pros, cons, and the invocability-vs-identity tension, and marks the choice deferred to Phase 1' — but decision-record.md line 70 states 'We chose: Option E — invokable-hub routing' and lines 82-89 list options A through E
  - Impact: A P0 requirement traces to an artifact that directly violates its acceptance criterion
  - Fix: Update REQ-002 to describe the actual A-E framing with E chosen, or revert decision-record.md to A-D pending per the original requirement
  - _via Kimi-K2.7, iter 9_
- **001-F023 [P1/traceability]** Task T005 scope does not match the produced decision-record artifact
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/tasks.md` (line 63)
  - Evidence: T005: 'Produce the mechanism decision selecting among options A through D with cited evidence and a fallback (decision-record.md)' — but decision-record.md line 70 chose Option E and line 88 lists 'E. Invokable-hub routing'
  - Impact: Forward traceability from task to artifact is broken; T005 cannot be checked off against the existing decision-record
  - Fix: Update T005 to reference options A through E and the chosen Option E, or update decision-record.md to match the A-D scope
  - _via Kimi-K2.7, iter 9_
- **001-F024 [P1/traceability]** SC-002 fallback requirement is not traced to a satisfied artifact
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md` (line 132)
  - Evidence: SC-002 requires 'an explicit fallback if a runtime enhancement is out of reach in-repo' — but decision-record.md line 88 marks Option D 'not needed' and only defines a fallback for the rejected Option D; no fallback is defined for the chosen Option E
  - Impact: A success criterion is unmet; the chosen mechanism has no documented fallback if invokable-hub routing fails
  - Fix: Add an explicit fallback for Option E in decision-record.md (e.g., revert to commands/agents A/B or shim C if hub routing proves insufficient)
  - _via Kimi-K2.7, iter 9_
- **001-F026 [P1/maintainability]** implementation-summary reverses cause/effect of Option E reference implementation
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/implementation-summary.md` (line 55 (What Was Built section))
  - Evidence: the mechanism's reference implementation was carried out in spec 154 (the sk-design conversion): Skill(sk-design) loads the hub, which routes to the nested design-<mode> packets
  - Impact: deep-loop-workflows/SKILL.md (line 36) reads "Routing is registry-driven (invokable-hub, Option E)" and was authored Jun 26 (one day before sk-design/SKILL.md at Jun 27). spec 154/008-nested-parent-conversion/spec.md line 56 explicitly says sk-design "follows the deep-loop-workflows pattern" and line 212 records 155's mechanism as now satisfied by the hub-routing approach. The packet attributes the proof to the wrong spec, so a future reader will search spec 154 for the original evidence that already lives in deep-loop-workflows.
  - Fix: Rewrite line 55 to attribute Option E to deep-loop-workflows (the canonical original) and cite spec 154/008 only as a secondary adoption that formalized the pattern on sk-design.
  - _via MiniMax-M3, iter 10_
- **001-F027 [P1/maintainability]** next_safe_action / recent_action YAML fields in 3 docs still say 'Await user gate' while implementation-summary claims decision completed
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/checklist.md` (checklist.md line 17-18; tasks.md line 17-18; implementation-summary.md line 17-18 vs implementation-summary.md line 46)
  - Evidence: tasks.md line 18 "next_safe_action: Await user gate; then start the runtime extensibility probe task"; checklist.md line 18 "next_safe_action: Await user gate; verify Phase 1 outputs against these items"; implementation-summary.md line 18 "next_safe_action: Await user gate; then run Phase 1 runtime probe and prototype" — but implementation-summary.md line 46 "**Completed** | Mechanism decided (Option E, Accepted); reference implementation in spec 154"
  - Impact: The YAML frontmatter is the canonical quick-read summary the memory saver and resume ladder read first. Three docs still say "Await user gate" while the implementation-summary body claims the decision is Accepted; a future reader resuming the packet will see contradictory status between YAML headers and bodies across the same folder, eroding trust in the frontmatter.
  - Fix: Update the three YAML frontmatters to reflect the post-decision state: set recent_action to "Decision recorded (Option E, ADR-001 Accepted)" and next_safe_action to "Phase 1 prototype execution (gated)" so the YAML matches the body's claimed completion.
  - _via MiniMax-M3, iter 10_

## 5. P2 — Suggestions
### P2 Findings (5)

- **001-F011 [P2/traceability]** Files-to-change table lists stale parent-folder paths
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md` (lines 99-102)
  - Evidence: The table lists `.opencode/specs/skilled-agent-orchestration/spec.md`, `plan.md`, `tasks.md`, `decision-record.md`, but the actual packet files live under `.../155-parent-skill-native-invocability/001-invocability-mechanism/`.
  - Impact: Cross-reference paths in the spec do not resolve to the actual artifact locations, indicating the spec was not updated after the phase-parent restructure.
  - Fix: Update the Files to Change table to the actual `001-invocability-mechanism/` paths.
  - _via Kimi-K2.7, iter 5_
- **001-F017 [P2/maintainability]** All-zero placeholder fingerprint in every doc's YAML frontmatter
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/spec.md` (line 24 (also plan.md:24, tasks.md:23, checklist.md:23, decision-record.md:24, implementation-summary.md:24))
  - Evidence: session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", ... }
  - Impact: All six docs share the same zeroed fingerprint and the same session_id (`scaffold-155-parent-skill-native-invocability`), which is a clear template placeholder never filled in. The authoritative source_fingerprint lives only in graph-metadata.json (`sha256:ff2494bf5ffc14316b0f6d59f2aec1449ba52d42e81a6e5a47971207de9e02e8`), so any tooling that reads YAML frontmatter first gets a misleading zero value; deduplication that relies on the fingerprint will treat every save as the same session.
  - Fix: Either populate the fingerprint from a real content hash at save time, or remove the fingerprint field entirely so it cannot be mistaken for a real identity.
  - _via MiniMax-M3, iter 6_
- **001-F025 [P2/traceability]** No checklist item verifies ADR status synchronization across documents
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/checklist.md` (line 151)
  - Evidence: CHK-101 [P1] 'All ADRs have status (Proposed/Accepted)' — it checks only that a status exists, not consistency; plan.md line 288 says 'Status: Proposed' while decision-record.md line 47 says 'Status: Accepted'
  - Impact: The existing cross-document ADR status mismatch would pass checklist verification because no item checks synchronization
  - Fix: Add a checklist item requiring ADR status to match across spec.md, plan.md, decision-record.md, and implementation-summary.md
  - _via Kimi-K2.7, iter 9_
- **001-F028 [P2/maintainability]** implementation-summary.md Spec Folder field points to the parent phase, not this child
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/implementation-summary.md` (line 45 (Metadata table))
  - Evidence: **Spec Folder** | 155-parent-skill-native-invocability
  - Impact: graph-metadata.json line 4 records the actual spec_folder as "skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism". A memory search landing on this implementation-summary will direct the reader to the parent phase folder, which is itself a phase parent that links to two children (001 and 002) — easy to land on the wrong child packet and read the wrong decisions.
  - Fix: Replace the value with the full child path "skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism" to match graph-metadata.json spec_folder.
  - _via MiniMax-M3, iter 10_
- **001-F029 [P2/maintainability]** tasks.md labels Phase 1 'Setup' while plan.md labels it 'Research and design'
  - File: `.opencode/specs/skilled-agent-orchestration/119-parent-skill-native-invocability/001-invocability-mechanism/tasks.md` (tasks.md line 53 vs plan.md line 124)
  - Evidence: tasks.md line 53 "## Phase 1: Setup"; plan.md line 124 "### Phase 1: Research and design (gated entry; produces the decision)"
  - Impact: Tasks and plan are supposed to cross-reference; if the phase names diverge a reader using one to navigate to the other will spend cycles confirming the same label actually means the same phase. Phase 1's intent (research before implementation) is otherwise lost in the "Setup" label.
  - Fix: Rename tasks.md Phase 1 heading to "Research and design" to match plan.md — the smaller change, since plan.md already documents the phase as research-driven.
  - _via MiniMax-M3, iter 10_

## 6. Convergence

Final newFindingsRatio: 0.138. Iterations run to the requested fixed count (10); see deep-review-dashboard.md for per-iteration ratios.

## 7. Method

Each iteration dispatched one model via cli-opencode (read-only), prompted with its empirically-best framework, given the accumulated findings to avoid duplication and build on prior passes. Orchestrator owned state, dedup, and synthesis. Round-robin: see deep-review-config.json executorPlan.

## 8. Remediation next step

`/speckit:plan` remediation from the P0/P1 findings above.

## 9. Artifacts

`review/deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `deep-review-dashboard.md`, `iterations/`, `deltas/`, `resource-map.md`.
---

## 10. Post-synthesis spot-verification (orchestrator)

- 001-F001/F002/F003 (P0, doc-internal contradictions) confirmed by direct read: implementation-summary "Completed" vs zeroed completion_pct/unchecked tasks; ADR-001 Accepted (decision-record) vs Proposed (plan.md); "real runtime probe" claim vs all Phase-1 tasks unchecked.
- 001-F006 (P0/security, NFR-S01 tool-permission widening via invokable-hub) is a valid design observation, not a doc typo: it depends on whether the runtime narrows to the selected mode's `allowed-tools`; treat as a real open risk to resolve in the decision record, mirrored by 002-F009/F033.
- Stale `Branch` field (F012) and dead `HVR_REFERENCE` path (F013) confirmed.
