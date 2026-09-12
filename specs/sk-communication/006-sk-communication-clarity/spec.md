---
title: "Feature Specification: sk-communication clarity program"
description: "Adopt the evidence in three external communication sources across the repository's communication stack: root doc, repo rules, and the sk-communication skill."
trigger_phrases:
  - "sk-communication clarity"
  - "clarity rules"
  - "claude style patch"
  - "colon rule"
  - "verbless fragment"
  - "stacked compression"
  - "adhd output shaping"
  - "communication repo rule"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/006-sk-communication-clarity"
    last_updated_at: "2026-09-12T13:00:00Z"
    last_updated_by: "opus-5-session"
    recent_action: "Authored the phase parent and its five child phases"
    next_safe_action: "Run phase 001 research, then decide allocations in phase 002"
    blockers: []
    key_files:
      - "AGENTS.md"
      - "REPO RULES.md"
      - "repo-rules/communication.md"
      - ".opencode/skills/sk-communication/SKILL.md"
      - ".opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-5-clarity-program"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the colon-clause ban survive contact with this repository's own prose?"
      - "Is a reader-profile rule a repo rule at all, or an operator-selected mode?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: sk-communication clarity program

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-12 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None, this is the parent |
| **Parent Packet** | sk-communication/006-sk-communication-clarity |
| **Predecessor** | `../005-deprecate-visual-explanation-lane` |
| **Successor** | None |
| **Handoff Criteria** | Each child validates independently before the next begins |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The repository governs how a reply reads across three layers: `AGENTS.md` keeps the two clauses
that must bind when nothing loads, `repo-rules/communication.md` carries the reply-shape rules and
fires on every substantive reply, and `sk-communication` re-renders an existing byte stream in
plainer words while routing its wording standard to the Human Voice Rules under `sk-doc`. Three
external sources now sit in `context/` and each one names something this stack does not cover.
Nothing in the stack measures whether a loaded rule changed the output, and the rule that claims
to fire on every reply is loaded by a gate that only fires before a write.

### Purpose

Decide, with evidence, which of the three sources' recommendations this repository adopts, then
place each adopted recommendation in the one document that owns it and prove the placement changed
observable output.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed
> planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the
> Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Research over the three sources in `context/`, run as independent deep-research lineages.
- A synthesis that allocates every adopted recommendation to exactly one owning document.
- Changes to `AGENTS.md`, `REPO RULES.md` and the communication-shaped files under `repo-rules/`.
- New `repo-rules/` files where an adopted recommendation belongs to no existing rule.
- Changes to `sk-communication`, its two rewrite commands, and its routing to the wording standard.
- A measurement harness that scores replies, and a persistence mechanism that survives a long thread.

### Out of Scope

- Detailed per-phase implementation plans at the parent level, they live in each child.
- The projection package's byte-safety, privacy and provider invariants, frozen by packet 001.
- Reviving the retired explanation lane, retired deliberately by packet 005.
- Rewriting the Human Voice Rules as a whole, its document-scoring half is `sk-doc`'s to own.

### Files to Change

Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `001-research-communication-context/research/` | Create | 001 | Research lineage and synthesis. Complete |
| `004-sk-communication-upgrade/research/` | Create | 004 | Engine-logic research and synthesis. Complete |
| `002-synthesis-and-decisions/decision-record.md` | Create | 002 | Rule conflicts, engine decisions, plan corrections |
| `repo-rules/communication.md` | Modify | 003, 006 | Split in 003, then ten candidates in 006 |
| `repo-rules/[split-sibling].md` | Create | 003 | The other half of the split, with its router row |
| `REPO RULES.md` | Modify | 003 | Trigger and index rows for the new half |
| `repo-rules/presenting-decisions.md` | Modify | 008 | Reader triage, time estimates |
| `repo-rules/handoff-and-questions.md` | Modify | 008 | Restatement cadence, closing contract |
| `repo-rules/evidence-and-proof.md` | Modify | 008 | The unconfirmed-cause qualifier |
| `sk-doc/sk-create-with-human-voice/references/` | Modify | 007 | Base plus supplement, six candidates |
| `sk-communication/cli-communication-projection/src/` | Modify | 004 | The four decision-free engine fixes |
| `.opencode/commands/rewrite/*.md` | Modify | 004 | Each command declares the pass it performs |
| `sk-code` quality checklist, repo-rule template | Modify | 009 | Two candidates on other skills' surfaces |
| `sk-communication/benchmark/` | Create | 005 | Reply-scoring harness and release gate |
| `AGENTS.md` | Modify | 003 | Only if phase 002 finds a clause that cannot live below. The research says it will not |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

> **Folder numbers are creation order, not execution order.** Phases 6 to 9 were added after the
> research changed what the work is, so they carry higher numbers than the verification phase that
> must run last. The execution column below is authoritative.

| Phase | Folder | Focus | Execution | Status |
|-------|--------|-------|-----------|--------|
| 1 | 001-research-communication-context/ | Classify all three sources against the stack; 29 candidates, 4 conflicts | 1st | Complete |
| 2 | 002-synthesis-and-decisions/ | Settle 3 rule conflicts, 5 engine decisions and 2 plan corrections | 2nd | Pending |
| 3 | 003-root-doc-and-repo-rules/ | Split the reply-shape rule and capture both baselines. No rule content | 3rd | Pending |
| 6 | 006-reply-shape-rules/ | The 10 reply-shape candidates, into the split halves | 4th | Pending |
| 8 | 008-decision-and-handoff-rules/ | 5 candidates across the decision, handback and evidence rules | 4th, parallel with phase 6 | Pending |
| 7 | 007-wording-standard-restructure/ | Base plus supplement, 6 candidates, one exclusion retired | 5th | Pending |
| 4 | 004-sk-communication-upgrade/ | 8 engine items, including sending the standard as the instruction. Its own research is Complete | 6th, after phase 7 | Research complete, build pending |
| 9 | 009-adjacent-surface-rules/ | 2 candidates on the code skill and the rule template | 7th | Pending |
| 5 | 005-verification-and-rollout/ | Baseline, harness, blind scoring, mirrors, recursive validation | 8th, last | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit
- Phase 5 captures the pre-change baseline during phase 3's setup, not at its own start, because a
  baseline taken after the rules change cannot support a regression claim

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-research-communication-context | 002-synthesis-and-decisions | Every lineage wrote a non-empty research.md and its iteration count matches the requested depth | Read the state log, not the run's own summary. Met: 10 iterations, synthesis written |
| 002-synthesis-and-decisions | 003-root-doc-and-repo-rules | Every recommendation and every engine decision carries a verdict, and each adopted one names exactly one owning surface | Decision-record row count equals the recommendation count plus the eight decisions |
| 003-root-doc-and-repo-rules | 006-reply-shape-rules | The split landed, the router reaches both halves, and the size and per-mark baselines are recorded | Trigger-table walk in both directions, plus the two recorded baselines |
| 002-synthesis-and-decisions | 008-decision-and-handoff-rules | The error-reporting conflict is resolved, since it decides the fifth candidate's form | Read the decision record for that ADR |
| 006-reply-shape-rules | 007-wording-standard-restructure | The voice-half delegation is in place, so the reply-facing candidates can reach a reply | Follow the delegation from the reply-shape half to the standard |
| 007-wording-standard-restructure | 004-sk-communication-upgrade | The standard's reply base exists, because the provider instruction now resolves to it | Open the base and confirm the engine can name it |
| 002-synthesis-and-decisions | 009-adjacent-surface-rules | Both adjacent candidates carry a verdict, and the code skill's real comment-guidance file is confirmed | Decision record, plus reading the code skill's own routing |
| 007-wording-standard-restructure | 005-verification-and-rollout | Every consumer of the standard resolves, and the exclusion list is one row shorter | Open every consumer; count the exclusion rows |
| 004-sk-communication-upgrade | 005-verification-and-rollout | The package gate passes from the final state and the standard still has one home | `npm run check` in the package, plus the duplication search |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does the colon-clause ban survive contact with this repository's own prose, where `communication.md` currently offers the colon as the em-dash replacement?
- Is a reader-profile rule such as the ADHD output contract a repo rule at all, or an operator-selected mode that should stay off by default?
- Should the wording standard split into a document half and a reply half, or stay one document that two consumers read with stated exclusions?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Context sources**: See `context/clarity.md`, `context/claude-style-patch-main/STYLE.md`, `context/i-have-adhd-main/skills/i-have-adhd/SKILL.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
