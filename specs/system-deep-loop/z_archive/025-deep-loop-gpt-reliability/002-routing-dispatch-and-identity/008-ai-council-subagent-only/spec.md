---
title: "Feature Specification: ai-council Subagent-Only Conversion"
description: "Convert .opencode/agents/ai-council.md from mode: all to mode: subagent, removing its direct top-level invocability so it is reachable only via Task dispatch (orchestrate or the deep.md router). Operator-directed deliberate deviation from research/research.md's unanimous 6/6 recommendation to keep mode: all — see decision-record.md for the override rationale."
trigger_phrases:
  - "ai-council subagent only"
  - "ai council mode conversion"
  - "remove primary agent reachability"
importance_tier: "critical"
contextType: "implementation"
predecessor_research: "../007-gpt-behavioral-hardening-research/research/research.md"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/025-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/008-ai-council-subagent-only"
    last_updated_at: "2026-07-01T15:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implementation complete; validate.sh --strict passing"
    next_safe_action: "Proceed to phase 011"
    blockers: []
    key_files:
      - "decision-record.md"
      - "../007-gpt-behavioral-hardening-research/research/research.md"
      - ".opencode/agents/ai-council.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-010-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Confirmed via live opencode CLI test: Task-tool dispatch to @ai-council works independent of mode:all (a general/orchestrate session Task-dispatched to subagent_type 'ai-council' and got a correct reply). Direct opencode run --agent ai-council now correctly rejected post-conversion."
      - "Grep sweep found 2 real callers depending on direct reachability (cli-opencode/agent_delegation.md, sk-doc/agent_template.md) -- both redirected to Command-only / Task-dispatch patterns rather than left broken."
      - "Research/research.md §1, §3 unanimously (6/6 lineages) recommends keeping mode: all. This phase proceeds anyway per explicit, twice-stated operator instruction (2026-07-01) — see decision-record.md for the full override rationale."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: ai-council Subagent-Only Conversion

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Packet** | `025-deep-loop-gpt-reliability` |
| **Predecessor** | `../009-orchestrate-universal-routing/` (must land first) |
| **Successor** | `../011-deep-route-guard-plugin/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`.opencode/agents/ai-council.md:4` currently declares `mode: all`, meaning it is dual-reachable: directly selectable as a top-level agent in OpenCode (like a primary agent) AND dispatchable as a Task-tool sub-agent. Every other deep-loop sub-agent (`deep-context`, `deep-research`, `deep-review`) declares `mode: subagent` — `ai-council` is the sole outlier in that family. Research/research.md §1 and §3 examined this directly and unanimously (6 of 6 lineages, across both research rounds) recommended **keeping** `mode: all`, reasoning that converting it would remove a working, documented depth-0 parallel-seat path that the operator's four reported symptoms don't implicate.

### Purpose

**This phase is an explicit, deliberate deviation from that unanimous research recommendation**, made by direct operator instruction rather than research consensus. The operator's stated rationale (2026-07-01, given twice in the same session): Claude Code has no equivalent "primary agent" concept at all — every agent in that runtime is dispatched as a subagent via the Task tool, with no top-level direct-invoke surface. Keeping `ai-council` as OpenCode's one `mode: all` outlier (shared only with `markdown.md`, which is out of scope here) is an architectural inconsistency across the two runtimes this repo mirrors. The operator wants `@orchestrate` to be the single, reliably-correct universal entry point for every sub-agent — deep or otherwise — rather than leaving one agent independently reachable outside that routing surface. Per the PLAN-WORKFLOW LOCK discipline (flag deviations, don't silently drop the research's contrary finding), this spec and `decision-record.md` record the deviation and its rationale explicitly rather than treating the research's recommendation as simply overruled without a trace.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Change `.opencode/agents/ai-council.md:4` from `mode: all` to `mode: subagent`.
- Verify `/deep:ai-council`'s own command-level dispatch (`deep_ai-council_auto.yaml`, `deep.md` router) does not depend on `mode: all` — confirm it already reaches `@ai-council` exclusively via Task-tool dispatch (the same path every other deep sub-agent already uses).
- Verify `@orchestrate`'s non-deep planning dispatches (Priority-table row 3, "Multi-strategy planning and architecture synthesis") continue to reach `@ai-council` correctly post-conversion — this is the direct-dispatch path phase 009 hardens.
- Write `decision-record.md` documenting the override: research's recommendation, the operator's rationale, and the explicit acceptance of the residual risk research flagged (removing a working dual-reach path).

### Out of Scope

- `markdown.md`'s own `mode: all` field — not mentioned by the operator, not touched by this phase.
- Any change to `@ai-council`'s internal behavior, seat composition, or planning logic — this phase changes reachability only.
- Orchestrate's Priority-table completeness — `../009-orchestrate-universal-routing/` (predecessor, must land first so the subagent-only path is already proven reliable before the direct-invoke path is removed).

### Files Likely to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/agents/ai-council.md:4` | Modify | `mode: all` → `mode: subagent` |
| `decision-record.md` | Create | Document the deliberate deviation from research consensus |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | ai-council reachable only via Task dispatch post-conversion | `mode: subagent` set; `@ai-council` no longer appears as a directly-selectable top-level OpenCode agent. |
| REQ-002 | No loss of functional reachability | Every path that could previously reach ai-council directly (orchestrate planning dispatch, `/deep:ai-council` command) still reaches it correctly via Task dispatch after conversion. |
| REQ-003 | Deviation documented, not silent | `decision-record.md` exists, cites research/research.md §1/§3 verbatim recommendation, and states the operator's override rationale. |

### P1 - Should Have

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Sequenced after phase 009 | This phase does not land before `../009-orchestrate-universal-routing/` completes, since that phase is what makes the subagent-only path provably reliable. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `.opencode/agents/ai-council.md:4` reads `mode: subagent`.
- **SC-002**: A manual or scripted check confirms `ai-council` is no longer listed among OpenCode's directly-invocable top-level agents.
- **SC-003**: `/deep:ai-council` and orchestrate's planning-dispatch path both still reach `@ai-council` successfully post-conversion (smoke-tested, not assumed).
- **SC-004**: `decision-record.md` exists and is cited from `spec.md`.
- **SC-005**: `validate.sh --strict` passes for this phase folder once implementation lands.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Research's flagged concern materializes: some working depth-0 parallel-seat path silently breaks | Real functional regression, exactly the failure mode research warned about | Do not land until phase 009's Task-dispatch reliability is confirmed; smoke-test `/deep:ai-council` and orchestrate's planning dispatch explicitly before closing this phase |
| Risk | An undiscovered caller invokes `@ai-council` directly outside orchestrate/deep.md (e.g., a user habit, a doc example, a script) | Silent breakage for a caller this research/phase didn't anticipate | Grep the repo for direct `@ai-council` invocation examples in docs/commands before landing; update any found |
| Dependency | Phase 009 (orchestrate universal routing) | Sequencing | Must land first |
| Accepted residual risk | Research explicitly disagrees with this change (6/6 lineages) | This is a deliberate, operator-directed trade-off, not an oversight | Documented in `decision-record.md`; not re-litigated here |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- See frontmatter `open_questions`.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Post-conversion, every legitimate ai-council invocation path (planning dispatch, `/deep:ai-council`) must be smoke-tested, not assumed correct by analogy to other `mode: subagent` agents.

### Maintainability
- **NFR-M01**: `decision-record.md` must remain the durable record of why this repo's `ai-council` differs from its own research's recommendation — future work should not need to re-derive this from conversation history.

### Compatibility
- **NFR-C01**: No change to ai-council's Claude-runtime mirror is needed — Claude Code has no `mode` field/primary-agent concept, so there is nothing to convert on that side (this is itself part of the operator's stated rationale for making this change).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- None — this is a single frontmatter field change plus reachability verification, not a data-shape change.

### Error Scenarios
- If a smoke test reveals a caller that genuinely depended on direct `mode: all` reachability and cannot be redirected through Task dispatch, halt and escalate to the operator per the Logic-Sync Protocol (implementation evidence contradicting the approved decision) rather than silently reverting or silently proceeding.

### State Transitions
- This phase can begin only after phase 009 lands. Phase 011 (enforcement plugin) benefits from, but does not strictly require, this phase's completion first.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Single-line frontmatter change plus one new decision-record doc |
| Risk | 20/25 | Explicitly overrides a unanimous 6/6 research recommendation; residual-risk smoke-testing is load-bearing |
| Research | 14/20 | Grounded in research.md's own explicit (contrary) finding, which this phase must accurately represent rather than paraphrase away |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## RELATED DOCUMENTS

- **Research (contrary recommendation)**: `../007-gpt-behavioral-hardening-research/research/research.md` §1 ("Keep ai-council as mode: all. Unanimous across all 6 lineages."), §3 KQ row "ai-council subagent-only"
- **Decision record (this phase's override rationale)**: `decision-record.md`
- **Predecessor**: `../009-orchestrate-universal-routing/`
- **Parent Spec**: `../spec.md`
