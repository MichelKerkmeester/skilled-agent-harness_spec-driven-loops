---
title: "Feature Specification: Turn close-out next steps and structured operator questions"
description: "Decide whether the close-out behaviour the operator wants becomes a tenth repo rule or a section inside an existing one, then author it and wire it into the three integration points."
trigger_phrases:
  - "end with next steps"
  - "what the operator must do next"
  - "ask question tool"
  - "structured choice"
  - "turn close-out"
  - "repo rule"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/009-turn-closeout-next-steps"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Scaffolded the five-phase packet and authored the parent spec"
    next_safe_action: "Run phase 001 deep research, four iterations, cli-pi deepseek-v4.1-flash"
    blockers: []
    key_files:
      - "REPO RULES.md"
      - "AGENTS.md"
      - "repo-rules/communication.md"
      - "repo-rules/evidence-and-proof.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "manual-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the proposal survive the four decision tests as a rule file, or is it a section inside communication.md?"
      - "Naming a runtime's question tool is dispatch mechanics, which REPO RULES.md section 4 declares Out. Operator chose to name it, so section 4 needs a fourth widening or the naming has to live elsewhere."
    answered_questions:
      - "Spec folder: new packet under the agents track, specs/agents/009-turn-closeout-next-steps"
      - "Research may return refuse-as-rule-file; later phases adapt to whichever shape it returns"
      - "The question-tool half names the tool per runtime rather than staying runtime-agnostic"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Turn close-out next steps and structured operator questions

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | agents/009-turn-closeout-next-steps |
| **Predecessor** | agents/003-communication-quality |
| **Successor** | None |
| **Handoff Criteria** | Each phase validates independently before the next begins |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nothing in the framework binds a turn to end with what the operator has to do next. The closest existing content is `evidence-and-proof.md` section 10, which requires an honest status covering what ran, what is inferred, what only the operator can verify, and the state of the work. That is a report about the past. It does not require an action list for the reader, and a reader who finishes an honest status still has to work out what is now theirs to do.

The second half of the gap is sharper. A grep across `AGENTS.md` and all nine rule files returns zero hits for `AskUserQuestion`. The name appears only inside spec records describing sessions that happened to use it. No binding document tells any runtime when a structured choice beats a prose question, so the decision is made fresh every turn and inconsistently.

### Purpose
Settle whether this behaviour may exist as a repo rule at all, using the four decision tests in `sk-doc/sk-create-repo-rule`, then author it in whichever shape those tests admit and wire it so it actually loads. A correct rule that nothing points at is inert, and a rule that duplicates `communication.md` is worse than no rule.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Four iterations of read-only deep research into the observed failure, the existing homes, and the decision-test verdict.
- Running the four decision tests and recording the verdict with the test that decided it.
- Authoring the content, as a new file under `repo-rules/` or as a section inside an existing rule, whichever the tests admit.
- The three wiring points: a trigger row in `REPO RULES.md` section 2, an index row in section 3, and a pointer from every `AGENTS.md` section the content governs.
- Naming the per-runtime question tool, which the operator chose over a runtime-agnostic phrasing.
- Verification: link resolution, row and file counts, and `validate.sh --strict` on every phase.

### Out of Scope
- Changing any `AGENTS.md` hard blocker, gate, or Four Law. A pointer is the only mechanical edit this packet may make there.
- Skill routing, workflow selection, and which agent or command to dispatch.
- Retiring or rewriting any of the nine existing rules beyond adding a section if the tests route the content into one.
- Widening `REPO RULES.md` section 4 without explicit operator sign-off. See open question 2.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `specs/agents/009-turn-closeout-next-steps/001-deep-research/research/research.md` | Create | 001 | Four-iteration research output |
| `repo-rules/<name>.md` or an existing rule file | Create or Modify | 003 | The rule content, shape decided in 002 |
| `REPO RULES.md` | Modify | 004 | Trigger row and index row, if the content becomes a file |
| `AGENTS.md` | Modify | 004 | Pointer only, in each governed section |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-deep-research/` | Four read-only iterations via cli-pi on `deepseek-v4.1-flash` at `max` effort, establishing the observed failure, the existing homes, and the decision-test verdict | Complete |
| 002 | `002-decision-and-design/` | Decision tests returned refuse; operator overrode and chose the rule-file route, which also settled the section 4 widening | Complete |
| 003 | `003-rule-authoring/` | `repo-rules/handoff-and-questions.md` authored, 165 lines, preferred band | Complete |
| 004 | `004-agents-md-integration/` | Trigger row, index row, three governed-section pointers, section 4 fourth widening recorded | Complete |
| 005 | `005-verification/` | Structural checks, count parity, link resolution and strict validation; re-verified after HEAD moved under the session | Complete |
| 006 | `006-synthesis-presentation/` | Research returned `deep-loop-contracts-only`, refusing the rule on the four-part test. Operator took the verdict. No rule authored; the work moves to `specs/system-deep-loop/046-synthesis-chat-presentation` | Complete |
| 007 | `007-progress-updates/` | A third proposal: forward-looking progress updates during multi-step work. Decision tests returned `AGENTS.md-row`, so no rule was authored. The bullet is applied to section 3 on the operator's instruction | Complete |
| 008 | `008-communication-split/` | `communication.md` split two ways: prose craft keeps the file and its broad trigger, and the decision-shape sections became `presenting-decisions.md` with a narrower one | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Run `validate.sh --recursive` on the parent to validate all phases as an integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | `research/research.md` exists with four iterations recorded and every citation resolving | Open one citation per iteration and confirm the path and line |
| 002 | 003 | The shape is decided, the deciding test is named, and the scope question is answered by the operator | Decision recorded in the phase's own docs |
| 003 | 004 | The draft passes the anatomy contract and sits inside its length band | Structural check against the nine shipped rules |
| 004 | 005 | All three wiring points exist, and every `AGENTS.md` change beyond a pointer is named for operator confirmation | `git diff AGENTS.md` reviewed line by line; one non-pointer clause found and raised |
| 005 | done | Counts equal, every link resolves, strict validation passes | `validate.sh --recursive --strict` reports PASSED |
| 005-verification | 006-synthesis-presentation | [Criteria TBD] | [Verification TBD] |
| 006-synthesis-presentation | 007-progress-updates | The four decision tests are answered with evidence and the verdict names its deciding test | `validate.sh 007-progress-updates --strict` reports PASSED; `git status` shows `repo-rules/`, `REPO RULES.md` and `AGENTS.md` unchanged |
| 007-progress-updates | 008-communication-split | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- **Resolved.** Phase 001's proposal failed the always-loaded and scope tests; the operator overrode and directed the rule-file route. `repo-rules/handoff-and-questions.md` exists because of that decision, not because it passed. The research that refused it is preserved in phase 001.
- **Resolved.** `REPO RULES.md` section 4 carries a fourth widening admitting the ask surface of the runtime you are already in, while route selection stays Out.
- **Resolved 2026-09-11.** Phase 006 returned `deep-loop-contracts-only` and the operator took the verdict. No synthesis rule, no router change. The six deep-loop contracts get a per-mode content field instead, in the sibling packet.
- **Resolved 2026-09-11.** Phase 007 returned `AGENTS.md-row` and authored no rule. Its finding: `communication.md` section 9 already obliges a numbered forward plan, and the un-carried residue is cadence alone. The residue does not vary by context, so it has nowhere to live but the always-loaded document.
- **Open, needs operator approval.** Two separate non-pointer `AGENTS.md` edits now await a decision. Phase 003's clause on the close-out row is applied and unconfirmed. Phase 007's three-line bullet for section 3 is drafted and not applied. Approving or reverting them is an operator call because `AGENTS.md` changes beyond a pointer escalate by contract.
- **Open, decided but not started.** The operator approved splitting `repo-rules/communication.md` two ways: prose craft keeps the file and the broad trigger, and sections 7 to 9 move to a new rule about presenting a decision with a narrower trigger. It runs as a further phase after the deprecation agent lands. Two proposals in this packet were shaped by that file's 244-line ceiling rather than by their merits, which is the evidence for the split.
- **Open, raised by phase 007.** The HVR-in-a-reply boundary at `communication.md` section 4 is reached by both phase 006 and phase 007. One edit settles both, and the split may relocate that sentence anyway. Decide it once.
- **Recorded, not a defect.** The deterministic scorer returns a phase score of 10 against a threshold of 25, so this packet never qualified for phasing on the numbers. It is phased on the operator's explicit instruction.
- **Recorded, runtime defect.** The fan-out write-containment guard reverted unrelated uncommitted work twice on 2026-09-11, 23 files then 19. Both restored from the guard's own recovery patches, verified against a pre-dispatch snapshot. Tracked separately in `specs/system-deep-loop/045-fanout-write-containment-hardening`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Graph Metadata**: See `graph-metadata.json` for the `derived.last_active_child_id` pointer
