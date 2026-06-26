---
title: "Feature Specification: Phase 8: nested-parent-conversion"
description: "Plan-only spec for converting the flat sk-design family (one umbrella + five top-level siblings) into one nested-packet parent skill (invokable hub + mode-registry + exactly one graph-metadata + five nested mode packets + shared/), reversing the 002 Model-B decision. No implementation in this packet."
trigger_phrases:
  - "sk-design nested parent conversion"
  - "sk-design model A reversal"
  - "sk-design invokable hub routing"
  - "sk-design single graph-metadata"
  - "flat design family to nested packets"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/008-nested-parent-conversion"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored plan-only spec for the flat-to-nested sk-design conversion"
    next_safe_action: "Operator review of the Model-A reversal and staged plan before any build"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skilled-agent-orchestration/154-sk-design-parent/008-nested-parent-conversion"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Worktree vs committed-baseline for the irreversible structural move (Stage 2)"
      - "Whether to ship /design:* commands + agents now or defer (Stage 4 optional)"
    answered_questions:
      - "Structural model: Model A (one nested-packet parent), reversing 002 Model B"
      - "Invocation mechanism: invokable parent hub routes to modes; no advisor merged-identity"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 8: nested-parent-conversion

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This is a **plan-only** specification. It documents how to convert the current flat `sk-design` family - a thin umbrella router plus five independent top-level sibling skills (`sk-design-interface`, `sk-design-foundations`, `sk-design-motion`, `sk-design-audit`, `sk-design-md-generator`) - into a single **nested-packet parent skill** that follows the `deep-loop-workflows` pattern: one invokable hub `SKILL.md` (routing-only) plus `mode-registry.json` plus **exactly one** `graph-metadata.json` (the hub's), with the five former skills nested as self-contained mode packets carrying **zero** `graph-metadata.json`, over a `shared/` base.

This reverses the binding **002 Model-B** decision (umbrella + flat siblings). The operator wants a true single-identity nested parent like `deep-loop-workflows`; the flat siblings never delivered that single identity. The decision record in this packet (a) records the 002 Model-B → Model-A reversal and (b) records the invocation mechanism: modes are reached through the invokable hub, not via `Skill(<mode>)`.

**Key Decisions**: Model A - one nested-packet parent (this packet's decision-record ADR-001); invokable-hub routing with advisor merged-identity deliberately avoided (ADR-002).

**Critical Consequence**: Because the advisor routes only to `sk-design` (one identity, hub `trigger_phrases` aggregating all mode keywords) and the hub picks the mode internally, this conversion does **not** require the deep-loop-specific advisor merged-identity extension (no new Python/TS `nl_ID`/`nl` map, no new drift-guard). That avoidance is a load-bearing simplification versus the generic second-parent warning in `parent_skills_nested_packets.md`.

**No implementation in this packet** - `completion_pct` is 0. The work below is staged and gated for a later, operator-approved execution.
<!-- /ANCHOR:executive-summary -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned (plan-only; not implemented) |
| **Created** | 2026-06-26 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 |
| **Predecessor** | ../007-family-deep-review/spec.md |
| **Successor** | None |
| **Handoff Criteria** | The Model-A reversal and the invocation mechanism are recorded with rationale and rejected alternatives; the five conversion stages are each defined with entry/exit gates and rollback; nothing is built in this packet. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the sk-design parent skill specification. Phases 002–007 built and hardened the family under the **002 Model-B** structural decision: `sk-design` is a thin umbrella/router and the design sub-skills are independent top-level skills the advisor routes to directly. Phase 7 deep-reviewed and remediated all six skills under that model.

This phase does not extend Model B - it **reverses** it. The operator's goal is a true single-identity nested parent, the same shape as `deep-loop-workflows` (hub `SKILL.md` + `mode-registry.json` + one `graph-metadata.json` + nested mode packets + `shared/`). Model B's flat siblings each carry their own `graph-metadata.json`, so the advisor sees six design identities, not one; that does not satisfy the single-identity goal.

**Scope Boundary**: This packet is **plan-only**. It produces the decision record, the staged plan, the task list, the checklist, and an honest (0% complete) implementation summary. It performs **no** folder moves, **no** skill/advisor/code changes, and **no** reference rewrites. The structural move, the rewires, and the validation runs are defined here as gated future stages, not executed.

**The settled mechanism** (built into the plan, not re-litigated): `Skill(sk-design)` is invocable because the hub is a top-level skill carrying the one `graph-metadata.json`. When invoked - optionally with args such as `"motion: <request>"` - the hub's smart router classifies the request and Reads the matching nested packet at `sk-design/<mode>/SKILL.md`. The advisor routes only to `sk-design`; the hub picks the mode. Optional complementary surfaces (`/design:*` commands + design-mode agents, mirroring the deep-loop pattern) are deferred to an optional stage; the primary invocation is `Skill(sk-design[, args])` plus hub routing.

**Dependencies**:
- The pattern + the one-graph-metadata invariant: `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md`
- The hub/registry/graph templates: `.opencode/skills/sk-doc/assets/skill/parent_skill_hub_template.md`, `parent_skill_registry_template.json`, `parent_skill_graph_metadata_template.json`
- The canonical worked example: `.opencode/skills/deep-loop-workflows/`
- The blast-radius facts gathered for this conversion (see decision-record ADR-001)
- The prior reversed decision: `../002-architecture-decision/`

**Changelog**:
- When this phase closes (after a future execution), refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `sk-design` family currently ships as one umbrella router skill plus five independent top-level sibling skills, each with its own `graph-metadata.json`. The Skill Advisor therefore discovers six separate design identities and routes to each directly. The operator wants the family to present as **one** advisor identity - `sk-design` - that internally dispatches to focused modes, exactly like `deep-loop-workflows`. The flat-sibling structure (locked at 002 as Model B specifically to avoid the conversion blast radius) cannot deliver a single identity, and there is no recorded plan for how to convert to the nested-packet shape, how to rewire the references that point at the flat names, or how to reach the modes once they stop being independently discoverable.

### Purpose
Record a complete, evidence-based, staged, and gated **plan** to convert the flat family into one nested-packet parent skill (Model A), reversing the 002 Model-B decision with rationale, and to settle the invocation mechanism (invokable-hub routing) so that the conversion does **not** need the deep-loop-specific advisor merged-identity layer. The plan must enumerate the structural move, the reference rewires, the optional command/agent surfaces, the validation, and the rollback - without performing any of them in this packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A recorded **architecture reversal**: 002 Model B (umbrella + flat siblings) → Model A (one nested-packet parent), with rationale, the rejected "keep Model B" alternative, and consequences (decision-record ADR-001).
- A recorded **invocation-mechanism decision**: modes are reached through the invokable parent hub (`Skill(sk-design[, args])` + hub smart routing), and the advisor merged-identity extension is deliberately avoided; with the rejected `Skill(<mode>)` and "build a second merged-identity layer" alternatives (decision-record ADR-002).
- A **target structure** definition for Model A: `sk-design/` = hub `SKILL.md` (routing-only) + `mode-registry.json` + exactly one `graph-metadata.json` (the hub's) + nested mode packets `{interface, foundations, motion, audit, md-generator}` (each its own `SKILL.md`/`references/`/etc., **zero** `graph-metadata.json`) + `shared/` (the anti-slop / token / cognitive-laws base references). The five current flat skills become the nested packets; their per-skill `graph-metadata.json` files are **deleted** so exactly one hub `graph-metadata.json` remains.
- A **naming record**: any folder-vs-`packetSkillName` mismatch is recorded via `packetSkillName` in `mode-registry.json`. `md-generator`'s Playwright backend is itself a packet - its `backendKind` differs from the pure-judgment modes and that difference is noted.
- A **staged plan** with explicit entry/exit gates: Stage 1 scaffold hub + registry + one graph-metadata; Stage 2 nest each packet (move content, delete child graph-metadata, repoint internal paths); Stage 3 rewire the ~72 `.opencode/skills/` cross-refs; Stage 4 commands/agents (optional); Stage 5 validate.
- A **rollback** strategy (additive-first; keep a recovery baseline; isolate the irreversible structural move in a worktree or behind a committed baseline).
- The required Level-3 deliverables for this packet plus the generated `description.json` and `graph-metadata.json`.
- An **append-only** row added to the parent 154 `spec.md` PHASE DOCUMENTATION MAP for phase 008.

### Out of Scope
- **Any implementation.** No folder moves, no `graph-metadata.json` deletions, no content moves, no reference rewrites, no advisor/skill-graph rebuild, no command/agent authoring. All of that is defined here as future gated stages and executed only after operator approval.
- **Any advisor merged-identity work** (no new Python `nl_ID`/`nl` map, no new TS analog, no new drift-guard). The chosen invocation mechanism avoids it; building it would be out of scope and contrary to ADR-002.
- The **434 `.opencode/specs/` historical doc mentions** of the flat names - they are non-breaking history and are explicitly left as-is.
- The design-judgment **content** authored inside each mode packet - owned by each skill's own history, not re-authored here; this conversion moves content verbatim.
- Re-opening the family **taxonomy** (which modes exist) - frozen since 002; this packet changes only the structural model and invocation, not the five-member set.

### Files to Change

This packet is plan-only; the only files it writes are its own spec-folder docs plus the append to the parent map. The `.opencode/skills/**` rows below are the **planned future** change surface, listed for the audit trail and not touched in this packet.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | This plan-only spec |
| `plan.md` | Create | The staged, gated conversion plan |
| `tasks.md` | Create | Planning tasks (this packet) + staged execution tasks (future, unchecked) |
| `decision-record.md` | Create | ADR-001 Model-B→Model-A reversal; ADR-002 invokable-hub routing / merged-identity avoided |
| `checklist.md` | Create | Verification items for this plan-only packet |
| `implementation-summary.md` | Create | Honest plan-only summary, completion_pct 0 |
| `description.json` | Generate | Via `generate-description.js` |
| `graph-metadata.json` | Generate | Via `backfill-graph-metadata.js` |
| `../spec.md` | Modify (append-only) | Add the phase 008 row to the parent PHASE DOCUMENTATION MAP |
| `.opencode/skills/sk-design/**` | Create/Modify (FUTURE) | Hub SKILL.md, mode-registry.json, one graph-metadata.json, nested packets, shared/ |
| `.opencode/skills/sk-design-*/**` | Delete-after-move (FUTURE) | Five flat skills become nested packets; their graph-metadata.json deleted |
| `.opencode/skills/**` (~72 files) | Modify (FUTURE) | Rewire flat-name cross-refs to `sk-design` (+ mode/packet path) |
| `CLAUDE.md`, `AGENTS.md` | Modify (FUTURE) | 2 root-config references to the flat design names |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The 002 Model-B → Model-A reversal is recorded unambiguously with rationale, the rejected alternative, and consequences. | `decision-record.md` ADR-001 states Model A as the single chosen model, names why Model B's flat siblings fail the single-identity goal, records the rejected "keep Model B" option, and lists consequences (blast radius accepted). |
| REQ-002 | The invocation mechanism is recorded: invokable-hub routing, advisor merged-identity avoided. | `decision-record.md` ADR-002 states `Skill(sk-design[, args])` + hub smart routing as the mechanism, explicitly records that no advisor merged-identity layer (Python/TS map, drift-guard) is added, and names the rejected `Skill(<mode>)` and "second merged-identity layer" alternatives. |
| REQ-003 | The Model-A target structure is defined exactly, including the one-graph-metadata invariant. | `spec.md` scope and `plan.md` architecture define `sk-design/` = hub + registry + exactly one graph-metadata + five nested packets (zero graph-metadata each) + shared/, and state that the five flat per-skill graph-metadata files are deleted. |
| REQ-004 | The plan is staged into five gated stages with entry/exit gates and rollback. | `plan.md` defines Stage 1 scaffold, Stage 2 nest, Stage 3 rewire, Stage 4 commands/agents (optional), Stage 5 validate, each with an entry gate, an exit gate, and a rollback note; the irreversible structural move is isolated. |
| REQ-005 | This packet performs no implementation. | No `.opencode/skills/**` files are created, moved, deleted, or edited by this packet; `implementation-summary.md` records `completion_pct` 0 and "plan-only". |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The reference rewire surface is enumerated from evidence, distinguishing breaking from non-breaking. | `plan.md` Stage 3 records ~72 `.opencode/skills/` cross-refs to rewire, the 434 `.opencode/specs/` mentions left as historical, the 2 root-config refs, and that `mcp-open-design` no longer hard-references the flat name (0 matches). |
| REQ-007 | The naming and backend differences are recorded. | `mode-registry.json` plan records `packetSkillName` for any folder mismatch, and the plan notes `md-generator`'s differing `backendKind` (Playwright engine packet vs pure-judgment modes). |
| REQ-008 | The validation stage names the exact checks. | `plan.md` Stage 5 names `package_skill.py --check` on the hub, `advisor_rebuild` + `skill_graph_validate`, routing fixtures (sk-design routes design queries ≥0.8 and the hub routes to modes), and `validate.sh --recursive` on 154. |
| REQ-009 | The dependency/relation edges are recorded. | `graph-metadata.json` (and decision-record) record depends_on 155 (native invocability, now satisfied by the hub-routing approach), related-to 002 (reversed) and 147/150 (pattern). |
| REQ-010 | The parent 154 phase map gains an append-only row for 008. | The parent `spec.md` PHASE DOCUMENTATION MAP contains the 008 row and rows 001–007 are unchanged. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reviewer can read `decision-record.md` and understand both the structural reversal (Model B → Model A) and the invocation mechanism (invokable-hub routing, merged-identity avoided), with rationale and rejected alternatives, without consulting any other document.
- **SC-002**: A future executor can follow `plan.md` + `tasks.md` to perform the conversion in five gated stages, knowing the exact target structure, the rewire surface, the validation checks, and the rollback, with the irreversible structural move isolated behind a recovery baseline.
- **SC-003**: This packet validates clean under `validate.sh --strict`, the parent 154 validates clean under `validate.sh --strict` after the append-only phase-map row, and nothing under `.opencode/skills/**` was changed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `parent_skills_nested_packets.md` + the three parent-skill templates | If the pattern/invariant were misread, the target structure would be wrong | The plan mirrors the canonical `deep-loop-workflows` example and the one-graph-metadata invariant verbatim |
| Risk | The structural move (deleting five child graph-metadata + nesting content) is irreversible mid-flight | High | Stage 2 is isolated in a worktree or behind a committed recovery baseline; additive-first ordering keeps Stage 1 reversible |
| Risk | Rewiring ~72 cross-refs could miss a reference and break routing or a co-load | Med | Stage 3 rewires from an enumerated evidence list and Stage 5 re-greps for residual flat-name references before validation |
| Risk | Reversing a binding decision (002) without recording it would desync the packet history | Med | ADR-001 records the reversal explicitly; the parent map keeps 002 as `complete` and adds 008 as a distinct row |
| Risk | A future executor assumes advisor merged-identity work is required (the generic second-parent warning) | Med | ADR-002 records that the invokable-hub mechanism avoids it; the plan's Stage 5 verifies single-identity routing instead of building a merged-identity layer |
| Dependency | 155 (native invocability research) | The mechanism depends on the hub being natively invocable | The mechanism is now decided (invokable hub); 155's research question is satisfied by the hub-routing approach, recorded in `graph-metadata.json` edges |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Correctness
- **NFR-C01**: After the future conversion, exactly one `graph-metadata.json` exists under `sk-design/` (the hub's, `skill_id == folder`); zero exist in any nested packet or `shared/`. This is the load-bearing invariant the plan must preserve.
- **NFR-C02**: After the future conversion, the advisor discovers exactly one design identity (`sk-design`) and a design query routes to it at ≥0.8; the hub, not the advisor, selects the mode.

### Least Privilege
- **NFR-S01**: The hub `SKILL.md` `allowed-tools` is the union the modes need and no more; per-mode tool guards stay in each packet (e.g. `md-generator`'s engine vs pure-judgment modes).

### Reversibility
- **NFR-R01**: Every stage before the irreversible structural move (Stage 2) is additive and revertible; the structural move runs only behind a recovery baseline.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Structural
- **Folder vs packetSkillName mismatch**: if any mode folder name differs from its packet `SKILL.md` name, record it via `packetSkillName` in `mode-registry.json` (the grandfathered-exception mechanism), never codify a new silent mismatch.
- **Heterogeneous backend**: `md-generator` ships a Playwright engine, so its packet `backendKind` differs from the pure-judgment modes; the registry records the difference rather than flattening it.

### Reference Rewire
- **Non-breaking history**: the 434 `.opencode/specs/` mentions of flat names are historical and left untouched; only live `.opencode/skills/` refs and the 2 root-config refs are rewired.
- **Already-clean pairing**: `mcp-open-design` no longer hard-references the flat name (0 matches verified), so the mandatory co-load pairing needs minimal or no rewire - the plan does not assume a rewire that the evidence says is unnecessary.

### Decision Continuity
- **Reversing a binding decision**: 002 stays `complete` in the parent map; the reversal is a new recorded decision (ADR-001), not an edit to 002, so the history stays legible.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | One hub + five nested packets + ~72 rewires + optional commands/agents (all planned, not built) |
| Risk | 16/25 | An irreversible structural move and a binding-decision reversal; mitigated by staging and a baseline |
| Research | 16/20 | Pattern, invariant, blast facts, prior decision, and canonical example all consolidated into the plan |
| **Total** | **50/70** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Structural move corrupts the family mid-flight | H | L | Worktree / committed baseline; additive-first; Stage 2 isolated |
| R-002 | A flat-name reference is missed during rewire | M | M | Enumerated rewire list + residual-reference re-grep in Stage 5 |
| R-003 | Second graph-metadata accidentally left in a packet | H | L | Stage 2 deletes all five child graph-metadata; Stage 5 asserts exactly one remains |
| R-004 | Future executor builds an unneeded merged-identity layer | M | M | ADR-002 records the avoidance; Stage 5 verifies routing, not a merged-identity map |
| R-005 | Advisor fails to route to the single identity post-conversion | M | L | Stage 5 advisor_rebuild + routing fixtures gate the conversion |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Single design identity (Priority: P0)

**As an** operator, **I want** the design family to present as one advisor identity (`sk-design`) that internally routes to modes, **so that** discovery is one identity like `deep-loop-workflows` rather than six siblings.

**Acceptance Criteria**:
1. Given the plan is executed in a future packet, When the advisor is queried with a design request, Then it routes to `sk-design` at ≥0.8 and the hub selects the mode.
2. Given the converted skill, When discovery runs, Then exactly one `graph-metadata.json` is found under `sk-design/`.

### US-002: Reviewable reversal (Priority: P0)

**As a** reviewer, **I want** the Model-B → Model-A reversal and the invocation mechanism recorded with rationale and rejected alternatives, **so that** I can approve or reject the direction before any build.

**Acceptance Criteria**:
1. Given `decision-record.md`, When I read ADR-001 and ADR-002, Then I see the chosen option, the rejected options, the rationale, and the consequences for each.

### US-003: Safe staged execution (Priority: P1)

**As a** future executor, **I want** the conversion split into gated stages with rollback and the irreversible move isolated, **so that** I can stop at any gate without a corrupted family.

**Acceptance Criteria**:
1. Given `plan.md`, When I reach a stage gate, Then I have an explicit entry condition, exit condition, and rollback note, and the structural move is behind a recovery baseline.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Worktree vs committed-baseline for isolating the irreversible Stage 2 structural move - to be chosen by the executor at execution time; both are recorded as acceptable in the plan's rollback.
- Whether to ship the optional `/design:*` commands + design-mode agents in the same execution (Stage 4) or defer them to a follow-up - deferred decision; the primary invocation (`Skill(sk-design[, args])` + hub routing) does not depend on them.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Reversed decision**: See `../002-architecture-decision/`
- **Pattern + invariant**: `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md`
- **Canonical example**: `.opencode/skills/deep-loop-workflows/`

---

<!--
LEVEL 3 SPEC (~200 lines)
- Core + L2 + L3 addendums
- Executive summary, risk matrix, user stories
- Full architecture documentation
-->
