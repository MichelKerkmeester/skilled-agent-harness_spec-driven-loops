---
title: "Implementation Plan: 027/006/001 Typed Agent I/O Adapter"
description: "Plan for the optional typed adapter layer: a shared versioned agent-io-contract, an optional dispatch header from @orchestrate, an optional result envelope after existing agent bodies, and Wave-1 wiring on the 4 planning @context dispatches."
trigger_phrases:
  - "027 phase 006/001"
  - "typed agent io adapter"
  - "agent-io-contract"
  - "AGENT_IO_DISPATCH header"
  - "AGENT_IO_RESULT envelope"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/001-research-and-doctrine/002-gem-team-adoption/001-typed-agent-io-adapter"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Implemented advisory contract and planning headers"
    next_safe_action: "Ready for handoff"
    blockers: []
    key_files: ["spec.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-001-typed-agent-io-adapter-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "context_snapshot is one-shot for Wave-1 dispatch headers"
      - "Confidence defaults are high=0.90, medium=0.70, low=0.30"
---
# Implementation Plan: 027/006/001 Typed Agent I/O Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (agent contracts, shared contract doc) and YAML (command assets) |
| **Framework** | OpenCode agent runtime + system-spec-kit |
| **Storage** | None - this is a docs/contract change, no schema or persistence |
| **Testing** | Manual contract review, grep-based preservation checks, strict spec validation |

### Overview

Phase 001 adds an optional typed adapter over the existing agent contracts. The work is a single shared versioned contract doc plus additive, optional sections in five agents and two plan command assets. No runtime code, validator, or governance behavior changes; every adapter field is optional and the rich-markdown agent bodies stay canonical.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Proposal P1 scope identified in `../research/007-gem-team-adoption-matrix/sub-packet-proposals.md`.
- [x] Integration model, impact matrix, contract shape, and rollout waves identified in `../research/009-gem-team-integration-impact/research.md`.
- [x] Target files named and verified present (5 agents, 2 plan YAMLs, root `AGENTS.md`; contract path absent as expected).
- [x] No upstream dependency preconditions.

### Definition of Done

- [x] `agent-io-contract.md` exists with `schema_version` and the five grouped sections, all fields optional.
- [x] The optional `AGENT_IO_DISPATCH` header is defined and emitted by `@orchestrate`.
- [x] The optional `AGENT_IO_RESULT` envelope is defined and appended after existing bodies, never before `@code`'s `RETURN:`.
- [x] The numeric-to-band confidence mapping is defined and derived from the band.
- [x] The four `@context` dispatches in `/speckit:plan` Step 5 emit the header (both auto and confirm YAMLs).
- [x] `@orchestrate` documents and follows the never-reject-envelope-less degrade path.
- [x] `@code` first-line `RETURN:` and `@context` six required sections are preserved.
- [ ] Strict spec validation passes for this packet.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Adapter over existing contracts. One shared, versioned, advisory schema is the single source of truth; agents reference it and add small optional emit/accept sections. The orchestrator is the single hub that emits the dispatch header and consumes the result envelope; leaf agents append the envelope after their canonical bodies.

### Key Components

- **`agent-io-contract.md`**: the versioned schema with five grouped sections (dispatch, result, handoff, pre_execution, advisory). Handoff/pre_execution/advisory are reserved placeholders for children 002/003.
- **`AGENT_IO_DISPATCH` header**: emitted by `@orchestrate` when dispatching a sub-agent; carries `dispatch_id`, `agent`, per-agent `task_definition`, `context_snapshot`, and `read_directives` buckets.
- **`AGENT_IO_RESULT` envelope**: appended by leaf agents after their existing body; carries `status`, `confidence { band, numeric }`, and `failure_type` mapped from existing vocabularies.
- **Wave-1 wiring**: `@orchestrate` plus the four `@context` dispatches in `/speckit:plan` Step 5.

### Data Flow

`@orchestrate` composes a dispatch prompt and optionally prepends the `AGENT_IO_DISPATCH` header. The leaf agent (`@context` / `@code` / `@review` / `@debug`) runs its existing workflow, writes its canonical body, and optionally appends the `AGENT_IO_RESULT` envelope after that body. `@orchestrate` reads the envelope for routing if present, and falls back to parsing the existing markdown contract if absent. The contract doc is the schema both sides reference; it is advisory and is not consulted by any validator.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet touches shared agent-contract surfaces and the planning dispatch path, so the producer/consumer inventory is enumerated even though the change is additive docs/contract rather than a bug fix.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md` | Does not exist yet | Create | File present; `schema_version` and five groupings documented; all fields optional |
| `.opencode/agents/orchestrate.md` | Central dispatch hub; emits dispatch prose, consumes agent outputs | Modify | Header emit + envelope consume sections present; never-reject-envelope-less path documented |
| `.opencode/agents/code.md` | Leaf implementer; first-line `RETURN:` + escalation classes + confidence bands | Modify | Envelope appended after body section; `grep` confirms first-line `RETURN:` contract intact |
| `.opencode/agents/review.md` | Read-only reviewer; P0/P1/P2 severities | Modify | P0/P1/P2 to envelope mapping present; severity vocabulary unchanged |
| `.opencode/agents/context.md` | Retrieval agent; six required Context-Package sections | Modify | Header/read-directives accept section present; `grep` confirms six required sections intact |
| `.opencode/agents/debug.md` | Debug agent; 5-phase method | Modify | Dispatch/handoff header awareness added; 5-phase method untouched (handoff fields reserved for 002) |
| `.claude/agents/{orchestrate,code,review,context,debug}.md` | Claude runtime mirrors | Modify | Optional advisory I/O guidance mirrors the OpenCode intent while preserving runtime-specific path conventions |
| `.codex/agents/{orchestrate,code,review,context,debug}.toml` | Codex runtime mirrors | Modify | Optional advisory I/O guidance mirrors the OpenCode intent; TOML parsing verified with `tomli` |
| `.opencode/commands/speckit/assets/speckit_plan_auto.yaml` | Planning workflow (auto) Step 5 four `@context` dispatches | Modify | Header shown on the four planning dispatches |
| `.opencode/commands/speckit/assets/speckit_plan_confirm.yaml` | Planning workflow (confirm) Step 5 four `@context` dispatches | Modify | Header shown on the four planning dispatches |
| `AGENTS.md` | Framework guardrails (Four Laws, Gates) | Modify (small) | One optional/advisory pointer added; Four Laws and Gates text unchanged |

Required inventories:
- Existing-contract preservation: grep `@code` for the first-line `RETURN:` contract and `@context` for the six required Context-Package section headers before and after the edits; both must remain.
- Consumer awareness: confirm `@orchestrate` is the only emitter of the dispatch header and the only consumer of the result envelope in Wave-1 scope; the four leaf agents only accept/emit.
- Out-of-wave surfaces: `/speckit:implement`, `/speckit:complete`, `/deep:start-review-loop`, `/deep:start-research-loop`, and `/memory:save` are NOT consumers in this packet; verify they are left unchanged.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read the five agent docs (`orchestrate`, `code`, `review`, `context`, `debug`) and locate the body/return/section anchors the envelope must respect.
- [x] Read `/speckit:plan` Step 5 in both plan YAMLs and locate the four `@context` dispatch blocks.
- [x] Confirm the `agent-io-contract.md` path is absent and the `workflows/` parent exists.
- [x] Record the current `@code` first-line `RETURN:` contract and the `@context` six required section headers as the preservation baseline.

### Phase 2: Core Implementation

- [x] Author `agent-io-contract.md` with `schema_version`, the `dispatch` and `result` groups fully specified, and `handoff` / `pre_execution` / `advisory` as reserved placeholder groupings for 002/003.
- [x] Document the `AGENT_IO_DISPATCH` header (fields, compact target under 15 lines, read-directive buckets) in the contract.
- [x] Document the `AGENT_IO_RESULT` envelope (status, confidence band+numeric, failure_type) and the after-body placement rule.
- [x] Define the deterministic numeric-to-band confidence mapping in the contract.
- [x] Add the header-emit and envelope-consume sections to `@orchestrate`, including the never-reject-envelope-less degrade path.
- [x] Add the after-body envelope section to `@code`, mapping its escalation classes to `failure_type`; keep the first-line `RETURN:` first.
- [x] Add the P0/P1/P2-to-envelope mapping section to `@review`.
- [x] Add the header/read-directives accept section to `@context`; keep the six required sections and do not add a seventh.
- [x] Add the dispatch/handoff header awareness to `@debug` (handoff fields reserved for 002).
- [x] Wire the `AGENT_IO_DISPATCH` header onto the four Step 5 `@context` dispatches in both plan YAMLs.
- [x] Add the small optional/advisory pointer to `AGENTS.md`; leave Four Laws and Gates unchanged.

### Phase 3: Verification

- [x] Confirm the contract doc exists and every field is documented as optional.
- [x] Confirm both plan YAMLs show the header on all four planning `@context` dispatches.
- [x] Confirm `@orchestrate` documents the envelope-less degrade path and an envelope-less agent still works.
- [x] Confirm the numeric-to-band mapping is defined and derived from the band.
- [x] Grep-confirm `@code`'s first-line `RETURN:` and `@context`'s six required sections survive.
- [x] Confirm no validator/governance file changed except the small `AGENTS.md` pointer.
- [ ] Run strict spec validation for this packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Reason |
|-------|------------|--------|
| Phase 1: Setup | None | Read agents and plan YAMLs and capture the preservation baseline before editing. |
| Phase 2: Core Implementation | Phase 1 | The contract must be authored first because all agent edits reference its field names and placement rules. |
| Phase 3: Verification | Phase 2 | Preservation and degrade-path checks require the edits to exist. |

Within Phase 2, author the contract doc first, then `@orchestrate` (the hub), then the four leaf agents, then the two plan YAMLs, then the `AGENTS.md` pointer. The contract is the shared vocabulary every other edit consumes.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract review | `agent-io-contract.md` field set, grouping, optionality, numeric-to-band mapping | Manual read |
| Preservation grep | `@code` first-line `RETURN:`; `@context` six required sections | `rg` over the agent docs |
| Wiring check | Header present on the four planning `@context` dispatches | `rg` over both plan YAMLs |
| Degrade-path review | `@orchestrate` never rejects envelope-less output | Manual read of the consume section |
| Documentation | Spec folder contract | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |

Required matrix:

| Axis | Values |
|------|--------|
| Envelope presence | present, absent |
| Agent body type | `@code` first-line `RETURN:`, `@context` six sections, `@review` P0/P1/P2, `@debug` 5-phase |
| Header presence | present, absent (legacy dispatch) |
| Confidence form | band only (numeric derived), band + explicit numeric |
| Contract group readiness | dispatch/result active, handoff/pre_execution/advisory reserved-empty |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATE

| Area | Docs/Contract LOC | Notes |
|------|-------------------|-------|
| `agent-io-contract.md` | 90-130 | Versioned schema, five groupings, header + envelope + mapping definitions |
| `@orchestrate` additive sections | 25-40 | Header emit + envelope consume + degrade path |
| `@code` / `@review` / `@context` / `@debug` additive sections | 40-70 | ~10-20 LOC each, mostly the emit/accept note |
| Two plan YAMLs (header on 4 dispatches) | 15-30 | Header block on the Step 5 `@context` dispatches |
| `AGENTS.md` pointer | 3-8 | One small optional/advisory note |
| **Total** | **180-260** | Matches the P1 L2 estimate (docs/contract, no runtime code). |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing `@code` RETURN contract | Internal | Available | Source of `failure_type` mapping and the first-line preservation rule |
| Existing `@review` P0/P1/P2 gate I/O | Internal | Available | Source of the severity-to-envelope mapping |
| Existing `@context` Context Package | Internal | Available | Six-section preservation constraint and header-overlay target |
| Child `002-scoped-preexec-and-handoff-gates` | Downstream | Waits on this packet | Reuses `handoff` / `pre_execution` groupings |
| Child `003-planner-review-focus-and-drift-hint` | Downstream | Waits on this packet | Reuses the `advisory` grouping |

No external dependencies. No network access required.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `@orchestrate` is observed rejecting or mishandling envelope-less output, or a preservation check shows `@code`'s `RETURN:` or `@context`'s six sections were disturbed.
- **Procedure**: Revert the agent and plan-YAML edits and remove `agent-io-contract.md`; the contract is additive, so removal returns the system to the current prose-based behavior.
- **Blast radius**: Agent dispatch documentation and the planning fan-out header only; no runtime, schema, or validator state is involved.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Failure Mode | Detection | Rollback |
|--------------|-----------|----------|
| `@orchestrate` rejects envelope-less output | Degrade-path review or an envelope-less dispatch fails | Restore the prior `@orchestrate` consume text; keep the contract doc but mark the envelope consume as deferred. |
| Envelope placed before `@code`'s `RETURN:` | Preservation grep finds `RETURN:` no longer first | Restore the `@code` ordering; move the envelope section strictly after the body. |
| `@context` gains a seventh required section | Preservation grep finds the section count changed | Restore the six-section list; demote the header/directives to an optional accept-only note. |
| Header bloats the planning fan-out | Header exceeds the compact target in the plan YAMLs | Trim `context_snapshot` and read-directives to the lean field set. |

Rollback must preserve any preservation-baseline notes captured in Phase 1, even if the agent edits are reverted during investigation.

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: context_snapshot is one-shot, not a progressive orchestrator-maintained cache

**Status**: Proposed

**Context**: The phase-007 study surfaced an architectural fork. Gem's `context_envelope` is a progressive, orchestrator-maintained cache enriched between waves, whereas the spec-kit's `@context` Context Package is one-shot retrieval per invocation. The dispatch header's `context_snapshot` could follow either model.

**Decision**: For this packet, `context_snapshot` carries a lean one-shot snapshot scoped to a single dispatch. It does not introduce an orchestrator-maintained progressive cache.

**Consequences**:
- Keeps the header compact and the change additive; no new state machine in `@orchestrate`.
- Aligns with the existing one-shot `@context` retrieval model, so nothing about Context Package semantics changes.
- If a progressive cache is later wanted, it is a deliberate follow-on, not an implicit consequence of this header.

**Alternatives Rejected**:
- Progressive orchestrator-maintained `context_snapshot` cache: rejected for this packet because it adds cross-wave state and a maintenance burden that the additive/advisory goal does not justify; the cross-model review judged one-shot defensible as long as it is a conscious choice (recorded here).
<!-- /ANCHOR:enhanced-rollback -->
</content>
