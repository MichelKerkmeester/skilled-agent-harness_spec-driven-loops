---
title: "Injection Inbox and Question Provenance Attribution"
description: "The deep-research reduce-state script has no stable surface for injecting external questions mid-run; questions added directly to the key-questions markdown block bypass the state machine, losing origin tracking. A canonical research/inbox.jsonl with durable provenance records is needed."
trigger_phrases:
  - "injection inbox provenance"
  - "research inbox jsonl"
  - "question attribution badges"
  - "origin tracking open questions"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-implementation/003-deep-loop-workflows/004-injection-inbox-provenance"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored spec.md from research.md §5.2 (iters 25, 29)"
    next_safe_action: "Define inbox.jsonl schema and wire reducer to read it"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-authoring-003-deep-loop-workflows"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Injection Inbox and Question Provenance Attribution

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 12 |
| **Predecessor** | 003-cross-mode-anti-convergence-adr |
| **Successor** | 005-anchor-ownership-conflict-adr |
| **Handoff Criteria** | `research/inbox.jsonl` schema defined; reducer reads inbox on each reduce step; `origin` field carried through `openQuestions`; legacy markdown import path is non-breaking |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the deep-loop-workflows recommendations.

**Scope Boundary**: Establishing the inbox schema and provenance fields. Conflict resolution when injected question disagrees with the reducer rewrite belongs to 005-anchor-ownership-conflict-adr.

**Dependencies**:
- No hard predecessors; however 005 depends on this phase's inbox schema being frozen first

**Deliverables**:
- `research/inbox.jsonl` schema with `id/text/source/origin/injectedAtIteration/promotedQuestionId` fields
- `reduce-state.cjs` inbox reader + `origin` propagation into `openQuestions`/`resolvedQuestions`
- Dashboard attribution badges rendered per open question from `origin` field
- Legacy import path: direct markdown edits to `key-questions` treated as `origin:"legacy-import"` without error

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Operators and analyst agents can inject questions mid-run only by editing the `key-questions` markdown block directly, which bypasses the state machine. This loses origin tracking (was the question from the angle-bank, analyst-strategy, or a human operator?), makes dashboard attribution impossible, and sets up an overwrite race with the reducer's next rewrite of the same block.

### Purpose
Establish `research/inbox.jsonl` as the canonical injection surface with durable provenance records (`id/text/source/origin/injectedAtIteration/promotedQuestionId`); carry `origin:"angle-bank"|"analyst-strategy"` through `openQuestions`/`resolvedQuestions`; render dashboard attribution badges; treat direct markdown edits as a legacy import path.

> **Reference evidence**: `external/loop-cli-main/src/types.ts:10-18` (typed inbox records); `external/kasper/src/prompt-utils.ts:121-190` (provenance-stamped question attribution). Research.md §5.2 + (iters 25, 29).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `research/inbox.jsonl` schema: `id`, `text`, `source`, `origin` (`"angle-bank"|"analyst-strategy"|"operator"|"legacy-import"`), `injectedAtIteration`, `promotedQuestionId`
- `reduce-state.cjs`: inbox reader executed on each reduce step; `origin` propagated into `openQuestions`/`resolvedQuestions`
- Dashboard: attribution badges rendered per open question from the `origin` field
- Legacy import path: direct markdown edits to `key-questions` treated as `origin:"legacy-import"` (non-breaking, deprecation warning logged)
- `deep_research_strategy.md`: document `research/inbox.jsonl` as the canonical injection surface

### Out of Scope
- Conflict resolution when an injected question disagrees with the reducer's `key-questions` rewrite — that is 005-anchor-ownership-conflict-adr
- Cross-mode inbox generalization

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-research/scripts/reduce-state.cjs` | Modify | Add inbox reader; propagate `origin` into open/resolved question lists; legacy import path |
| `.opencode/skills/deep-loop-workflows/deep-research/assets/deep_research_strategy.md` | Modify | Document `research/inbox.jsonl` as the canonical injection surface |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `research/inbox.jsonl` schema defined with all six provenance fields; `reduce-state.cjs` reads inbox records on each reduce step and propagates `origin` into `openQuestions`/`resolvedQuestions` | A question written to `inbox.jsonl` with `origin:"angle-bank"` appears in `openQuestions` with that `origin` field after the next reduce step |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Dashboard renders attribution badges per open question from `origin` field; direct markdown edits to `key-questions` are assigned `origin:"legacy-import"` without throwing an error | Dashboard output includes source attribution; editing `key-questions` directly still works; reducer logs a deprecation warning |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An injected question in `research/inbox.jsonl` with `origin:"angle-bank"` appears in `openQuestions` with correct `origin` and `injectedAtIteration` fields after the reduce step; no error is thrown
- **SC-002**: A direct markdown edit to the `key-questions` section is read as `origin:"legacy-import"` by the reducer; the dashboard renders a `[legacy-import]` attribution badge for that question
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Inbox schema version mismatch if `reduce-state.cjs` is updated before sessions using older inbox records complete | Med | Version field in inbox records; reducer tolerates missing fields with safe defaults |
| Risk | Legacy import path could silently absorb operator mistakes (editing markdown instead of inbox) | Low | Log a deprecation warning on each legacy-import detection; document the preferred `inbox.jsonl` path in strategy doc |
| Dependency | 005-anchor-ownership-conflict-adr depends on the inbox schema being stable before implementing conflict resolution | High | Freeze inbox schema in this phase; do not modify field names in 005 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `research/inbox.jsonl` be locked during the reduce step to prevent concurrent writes, or is an append-only model sufficient?
- What happens when two inbox records share the same `promotedQuestionId`? Should the reducer merge them, log an error, or take the latest by `injectedAtIteration`?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
