---
title: "001 — Typed Agent I/O Adapter"
description: "Add a typed, OPTIONAL adapter layer over the existing spec-kit agent contracts so orchestration decisions (status/confidence/failure) become machine-parseable, without replacing the rich-markdown bodies."
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
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/006-gem-team-adoption/001-typed-agent-io-adapter"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 001 from research 007 P1 + 009 integration"
    next_safe_action: "Author agent-io-contract.md, then wire @orchestrate header"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-001-typed-agent-io-adapter-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "context_snapshot one-shot vs orchestrator-maintained progressive cache (default one-shot)"
      - "Exact numeric confidence defaults (HIGH=0.90 / MED=0.70 / LOW=0.30)"
    answered_questions:
      - "Proposal P1 confirmed as phase 001 — substrate child of 006-gem-team-adoption"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 001 — Typed Agent I/O Adapter

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

Phase 001 is the substrate child of the Gem Team adoption work in 027. The phase-007 study (19 iterations) and the phase-009 integration synthesis (5 iterations) converged on one finding: the spec-kit's agents already carry rich, evidence-first contracts, but the orchestration-relevant facts (status, confidence, failure class, dispatch intent) are expressed in scattered prose and are not machine-parseable. This packet adds a typed, OPTIONAL adapter layer over the existing contracts — never replacing the rich-markdown bodies.

The adapter has three additive pieces plus a Wave-1 wiring:

- A shared, versioned, advisory contract doc (`agent-io-contract.md`) with grouped optional sections (dispatch / result / handoff / pre_execution / advisory) so later children 002 and 003 reuse the same schema rather than diverging.
- An optional `AGENT_IO_DISPATCH` header emitted by `@orchestrate` when it dispatches a sub-agent (carrying a stable `dispatch_id`, the target agent, a per-agent `task_definition`, and a lean `context_snapshot` plus read-directives).
- An optional `AGENT_IO_RESULT` envelope (status, confidence with band + derived numeric, failure_type) appended AFTER the existing agent body, never before it.

Wave-1 wiring is deliberately narrow: `@orchestrate` and the four `@context` dispatches in `/speckit:plan` Step 5. The phase-009 synthesis verdict was FEASIBLE, FULLY ADDITIVE — nothing breaks if every field stays optional, the rich bodies stay canonical, and `@orchestrate` never rejects envelope-less output.

Source context:
- Proposal P1: `../research/007-gem-team-adoption-matrix/sub-packet-proposals.md` (§ Proposal P1).
- Integration + impact: `../research/009-gem-team-integration-impact/research.md` (§2 matrix, §3 contract, §4 rollout, §5 backward-compat, §8 open questions).
- Sequence decision: P1 is phase `001` (the substrate); P2 → `002`, P3 → `003`, both reusing this contract.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Spec-Scaffolded |
| **Parent Packet** | `027-xce-research-based-refinement/006-gem-team-adoption` |
| **Source** | `../research/007-gem-team-adoption-matrix/sub-packet-proposals.md` § P1; `../research/009-gem-team-integration-impact/research.md` §§2-8 |
| **Depends on** | None (this is the substrate children 002 and 003 build on) |
| **Feeds into** | `002-scoped-preexec-and-handoff-gates` (P2 gate fields) and `003-planner-review-focus-and-drift-hint` (P3 advisory fields) — both reuse `agent-io-contract.md` |
| **LOC budget** | ~180-260 (docs/contract, mostly the contract doc + additive agent sections) |
| **Branch** | `main` |
| **Created** | 2026-06-06 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The spec-kit agents pass work to each other through loose prose. When `@orchestrate` dispatches `@context`, `@code`, `@review`, or `@debug`, the dispatch intent and the returned outcome are expressed as free-form markdown. The orchestration-relevant facts — did the sub-agent succeed, how confident is it, what class of failure occurred, what exactly was it asked to do — are present but not in a stable, machine-parseable shape. The phase-007 study scored this the single highest net-new gap of the run (output-envelope ratio 0.83), and the phase-009 cross-model refinement re-weighted the dispatch-INPUT header as the PRIMARY gap (the `@code` RETURN already carries typed escalation enums and confidence bands, so the input header is where the real leverage is).

The constraint that makes this hard is that the existing contracts are valuable and must stay canonical: `@code`'s first-line `RETURN:` is consumed by compact-first-line readers, `@context` must keep its six required Context-Package sections, and `@review` already speaks P0/P1/P2. Any typed layer must be additive and optional, or it would either flatten the evidence-rich bodies into brittle protocol compliance or force every existing spec folder and agent invocation to fail.

### Purpose

Make orchestration decisions machine-parseable at the point they are first knowable (the planning fan-out), by adding an optional typed dispatch header and an optional result envelope over the unchanged agent bodies, governed by one shared versioned contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

1. **Shared advisory contract doc**
   - Add `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md`.
   - Versioned (`schema_version`), advisory only, with grouped OPTIONAL sections so 002 and 003 extend the same file rather than forking:
     - `dispatch`: `dispatch_id`, `agent`, per-agent `task_definition`, `context_snapshot`, `read_directives`.
     - `result`: `status`, `confidence { band, numeric }`, `failure_type`, `summary_ref`.
     - `handoff`: reserved for 002 (debug to implement) — defined as a placeholder grouping, not wired here.
     - `pre_execution`: reserved for 002 (pre-mortem, boundary contract) — placeholder grouping only.
     - `advisory`: reserved for 003 (reviewer_focus, self_assessed_quality, spec_drift) — placeholder grouping only.

2. **Optional `AGENT_IO_DISPATCH` header (emitted by `@orchestrate`)**
   - A small fenced header prepended to a dispatch prompt.
   - Carries `dispatch_id`, the target `agent`, a lean per-agent `task_definition`, a `context_snapshot`, and `read_directives` buckets (`safe_to_assume` / `verify_before_use` / `do_not_re_read`).
   - Header kept compact (target under 15 lines) to avoid bloating the planning fan-out.

3. **Optional `AGENT_IO_RESULT` envelope (appended by leaf agents)**
   - A small fenced block appended AFTER the existing agent body.
   - Carries `status`, `confidence` (human-canonical `band` plus a derived `numeric`), and `failure_type` mapped from existing escalation/severity vocabularies (`@code` escalation classes, `@review` P0/P1/P2).
   - Never placed before `@code`'s first-line `RETURN:`.

4. **Wave-1 wiring (only)**
   - `@orchestrate`: emit the dispatch header, consume the result envelope for routing, tolerate output with NO envelope.
   - `@code`, `@review`, `@context`, `@debug`: additive sections describing the envelope/header they may emit or accept (Wave-1 touches these agent docs minimally; full per-command rollout for implement/complete/deep-loops is later waves, out of scope here).
   - `/speckit:plan` Step 5: the four `@context` dispatches emit the `AGENT_IO_DISPATCH` header (via `speckit_plan_auto.yaml` and `speckit_plan_confirm.yaml`).
   - `AGENTS.md`: one small pointer noting the optional/advisory contract (Four Laws and Gates unchanged).

### Out of Scope

- JSON-only agent outputs - the rich markdown body stays canonical; the envelope is an adjunct.
- Replacing the `@context` Context Package - the six required sections stay; the header/directives layer on top.
- Runtime enforcement or validators - `validate.sh`, `check-completion.sh`, and `spec-doc-structure` stay unchanged; the contract is advisory.
- Deep-loop integration - deep-loop CLI executors consume raw prompt packs; the output envelope is not pushed there (Wave 4 header-only is a later child).
- The P2 gates - debug-handoff schema, boundary contract-first, pre-mortem live in child 002.
- The P3 advisory fields - reviewer_focus, self_assessed_quality, spec_drift write-back live in child 003.
- Waves 2-4 command wiring - `/speckit:implement`, `/speckit:complete`, `/deep:start-review-loop`, `/deep:start-research-loop`, `/memory:save` are later waves.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md` | Create | New shared, versioned, advisory contract with grouped optional sections (dispatch / result / handoff / pre_execution / advisory) |
| `.opencode/agents/orchestrate.md` | Modify | Emit the dispatch header, consume the result envelope for routing, tolerate missing envelope (must never reject envelope-less output) |
| `.opencode/agents/code.md` | Modify | Append the `AGENT_IO_RESULT` envelope AFTER the existing body section, never before the first-line `RETURN:`; map existing escalation classes to `failure_type` |
| `.opencode/agents/review.md` | Modify | Map existing P0/P1/P2 severities plus confidence bands into the envelope |
| `.opencode/agents/context.md` | Modify | Accept the dispatch header and read-directives; the envelope must NOT become a 7th Context-Package section (six required sections stay) |
| `.opencode/agents/debug.md` | Modify | Accept the dispatch/handoff header (handoff fields are reserved for 002; Wave-1 adds only the header awareness) |
| `.opencode/commands/speckit/assets/speckit_plan_auto.yaml` | Modify | Emit the `AGENT_IO_DISPATCH` header on the four Step 5 `@context` dispatches |
| `.opencode/commands/speckit/assets/speckit_plan_confirm.yaml` | Modify | Emit the `AGENT_IO_DISPATCH` header on the four Step 5 `@context` dispatches |
| `AGENTS.md` | Modify | Small pointer noting the optional/advisory contract; Four Laws and Gates unchanged |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Add the shared `agent-io-contract.md` with a `schema_version` and the five grouped sections (dispatch, result, handoff, pre_execution, advisory). | Contract file exists at the workflows path; every field is documented as OPTIONAL/additive; handoff/pre_execution/advisory are present as reserved groupings for 002/003. |
| REQ-002 | Define the optional `AGENT_IO_DISPATCH` header emitted by `@orchestrate`. | Header structure documents `dispatch_id`, `agent`, per-agent `task_definition`, `context_snapshot`, and `read_directives`; header is compact (target under 15 lines). |
| REQ-003 | Define the optional `AGENT_IO_RESULT` envelope appended after existing bodies. | Envelope documents `status`, `confidence { band, numeric }`, and `failure_type`; placement is explicitly AFTER the existing body and never before `@code`'s first-line `RETURN:`. |
| REQ-004 | Define a deterministic numeric-to-band mapping for confidence. | Mapping is stated in the contract (e.g. HIGH=0.90 / MED=0.70 / LOW=0.30); numeric is DERIVED from the band, never a competing truth. |
| REQ-005 | Wire the `AGENT_IO_DISPATCH` header onto the four `@context` dispatches in `/speckit:plan` Step 5. | Both `speckit_plan_auto.yaml` and `speckit_plan_confirm.yaml` show the header on the planning fan-out dispatches. |
| REQ-006 | Guarantee backward compatibility: `@orchestrate` must never reject envelope-less output. | `@orchestrate` documents the graceful-degrade path (no envelope → parse the existing markdown contract); an agent emitting no envelope still works unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Preserve every existing canonical contract surface. | `@code` first-line `RETURN:` preserved; `@context` six required sections preserved; `@review` P0/P1/P2 vocabulary preserved. |
| REQ-008 | Map `failure_type` from existing vocabularies rather than importing a new taxonomy wholesale. | `failure_type` enum is derived from `@code` escalation classes and `@review` severities; no net-new taxonomy is introduced. |
| REQ-009 | Keep governance and validators untouched. | The Four Laws, Gate 3, Logic-Sync, and the validators stay unchanged; the only `AGENTS.md` edit is the small optional/advisory pointer. |
| REQ-010 | Group contract fields by purpose to prevent top-level bloat as 002/003 extend it. | The five groupings keep dispatch/result separate from the reserved handoff/pre_execution/advisory; later children add fields within a group, not at top level. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The shared contract doc exists, is versioned, and documents all five grouped sections with every field optional.
- **SC-002**: The four `@context` planning dispatches in `/speckit:plan` Step 5 emit the `AGENT_IO_DISPATCH` header.
- **SC-003**: An agent that emits NO `AGENT_IO_RESULT` envelope still works unchanged, and `@orchestrate` falls back to parsing the existing markdown contract.
- **SC-004**: The numeric-to-band confidence mapping is defined and the numeric value is derived from the band.
- **SC-005**: `@code`'s first-line `RETURN:` and `@context`'s six required sections are preserved after the additive edits.
- **SC-006**: Children 002 and 003 can record this contract as their reusable substrate (their fields slot into the reserved groupings).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `@orchestrate` rejecting envelope-less output would break every existing agent invocation. | High | Optional-only: `@orchestrate` documents and follows the graceful-degrade path; envelope-less output parses the existing markdown contract. This is the single highest-risk behavior and is verified explicitly. |
| Risk | Prompt bloat in the four-agent planning fan-out from a verbose dispatch header. | Medium | Keep the header compact (target under 15 lines); carry a lean `context_snapshot` and read-directive buckets, not a full context dump. |
| Risk | Contract bloat as 002 and 003 add their fields. | Medium | Group fields by purpose (dispatch / result / handoff / pre_execution / advisory); later children add within a group, never at top level. |
| Risk | Flattening the evidence-rich markdown bodies into a protocol-compliance format. | Medium | The envelope is an adjunct block appended AFTER the body; the rich markdown stays canonical (ruled-out alternative in the plan ADR). |
| Risk | Numeric and qualitative confidence diverging into two competing truths. | Low | Numeric is derived from the band; the band stays human-canonical. |
| Risk | Placing the envelope before `@code`'s first-line `RETURN:` breaks compact-first-line consumers. | Medium | Contract and `@code` edit both state the envelope is appended after the body only. |
| Dependency | None. | None | This packet is the substrate; it has no upstream dependency. Children 002 and 003 depend on it. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Compatibility

- **NFR-C01**: Every adapter field is optional and additive; no existing agent invocation, spec folder, or validator changes behavior when the fields are absent.
- **NFR-C02**: Consumers degrade gracefully — absent envelope falls back to the existing markdown contract; absent header falls back to the existing dispatch prose.

### Maintainability

- **NFR-M01**: One shared contract doc is the single source of truth for the schema; agents reference it rather than restating divergent copies.
- **NFR-M02**: Fields are grouped by purpose so 002 and 003 extend the contract without reshaping its top level.

### Clarity

- **NFR-CL01**: The dispatch header target size is under 15 lines so the planning fan-out stays readable.
- **NFR-CL02**: The numeric-to-band mapping is stated once and unambiguously, with the band as the canonical human signal.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

| Case | Expected Behavior |
|------|-------------------|
| Agent emits no `AGENT_IO_RESULT` envelope | `@orchestrate` parses the existing markdown contract; no failure. |
| `@code` output with the first-line `RETURN:` and an appended envelope | First-line `RETURN:` stays first; envelope is read from after the body. |
| `@context` output | Six required Context-Package sections present; envelope, if any, is not counted as a seventh section. |
| Dispatch with no `AGENT_IO_DISPATCH` header (legacy path) | Sub-agent runs from the existing prose dispatch; no failure. |
| `confidence` band present but no numeric | Numeric is derived from the band via the stated mapping. |
| `failure_type` value outside the mapped vocabulary | Treated as unknown/unmapped; orchestrator falls back to reading the body. |
| Header present but `task_definition` partial | Sub-agent uses what is present and reads the body for the rest; header is advisory, not authoritative. |
| Contract consumed by a tool expecting 002/003 groupings before they ship | Reserved groupings exist but are empty placeholders; absent fields are simply not present. |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One new contract doc plus additive sections in five agents and two plan YAMLs; docs/contract only, no runtime code. |
| Risk | 14/25 | The backward-compat behavior (`@orchestrate` never rejecting envelope-less output) is load-bearing and touches the central dispatch hub. |
| Research | 6/20 | Proposals P1 and the phase-009 synthesis already define the contract shape, rollout, and open questions. |
| **Total** | **32/70** | **Level 2** because the central orchestration hub and the preserve-existing-contract constraints need explicit verification. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- `context_snapshot` shape: one-shot retrieval (per-invocation) versus an orchestrator-maintained progressive cache enriched between waves. This is the phase-007 architectural fork; default is one-shot, recorded as a ruled-out alternative in the plan ADR if progressive is rejected.
- Exact numeric confidence defaults: confirm HIGH=0.90 / MED=0.70 / LOW=0.30 (the phase-009 iter-001 proposal) or adjust during contract authoring.
<!-- /ANCHOR:questions -->
</content>
</invoke>
