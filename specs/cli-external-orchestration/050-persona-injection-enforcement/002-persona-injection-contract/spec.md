---
title: "Feature Specification: Persona-Injection Contract Design"
description: "Design the shared persona-injection contract that every external-CLI dispatch path must follow: the invariant rule, runtime-aware persona resolution per AGENTS.md §7, the per-mode native-load-vs-inline mechanism, the inline persona block format, the prompt/persona consistency guard, and the rare explicit exceptions — architecture-preserving and reusing the orchestrate.md and DESIGN_DISPATCH_MANIFEST precedents."
trigger_phrases:
  - "persona injection contract design"
  - "native load vs inline persona rule"
  - "agent persona block format cli dispatch"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/050-persona-injection-enforcement/002-persona-injection-contract"
    last_updated_at: "2026-08-19T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded Phase 002 Level 2 docs"
    next_safe_action: "Author the contract into scratch/persona-injection-contract.md"
    blockers: []
    key_files:
      - "../001-analysis-inventory/scratch/dispatch-point-inventory.md"
      - ".opencode/agents/orchestrate.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-050-002-contract"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Feature Specification: Persona-Injection Contract Design

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-08-19 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The P1 inventory confirmed the gap: only `cli-claude-code` `--agent` loads a resolved persona natively on the non-interactive path; the other five modes and the `fanout-run.cjs` runtime dispatch persona-less. Fixing this needs ONE shared contract that P3 (mode SKILLs + hub) and P4 (sk-prompt) can each reference, rather than six divergent ad-hoc rules. The contract must be architecture-preserving: it reuses the existing inline-payload precedent (`DESIGN_DISPATCH_MANIFEST v1`) and the native-dispatch precedent (`orchestrate.md` "Agent Loading Protocol (MANDATORY)"), and it must resolve the persona runtime-aware per AGENTS.md §7 rather than hardcoding one runtime.

### Purpose
Produce one contract design artifact that specifies: (a) the invariant rule; (b) runtime-aware persona resolution + persona→intent mapping; (c) the per-mode native-load-vs-inline mechanism table (from the verified inventory); (d) the inline persona block format; (e) the prompt/persona consistency guard; (f) the rare, explicit exceptions; and (g) where each part lives so P3/P4 can implement it without re-deciding. This artifact is the direct input to P3 and P4.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author the persona-injection contract (design only) into `scratch/persona-injection-contract.md`.
- Anchor the contract in the verified P1 inventory and the `orchestrate.md` + `DESIGN_DISPATCH_MANIFEST` precedents.
- Specify the exact placement plan (canonical home + per-mode + hub) for P3/P4.

### Out of Scope
- Editing any mode `SKILL.md`, the hub, or `sk-prompt` (that is P3/P4).
- Editing agent `.md` personas or `mode-registry.json`.
- Changing routing/registry behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `002-persona-injection-contract/scratch/persona-injection-contract.md` | Create | The contract design artifact P3/P4 implement |
| `002-persona-injection-contract/implementation-summary.md` | Modify | Record the contract summary + verification |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Invariant rule stated | The contract states that every external-CLI dispatch MUST compose {resolved persona + task prompt}, mirroring `orchestrate.md`'s native protocol |
| REQ-002 | Runtime-aware resolution specified | Resolution maps runtime→agent dir per AGENTS.md §7 (never hardcoded); includes the subtask→persona mapping |
| REQ-003 | Per-mode mechanism table | Each mode + the fanout runtime is assigned native-load OR inline, matching the P1 `§C` verdicts |
| REQ-004 | Inline block format defined | An exact, copyable persona-block format is specified (reusing the `DESIGN_DISPATCH_MANIFEST` inline-payload pattern) |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Exceptions enumerated | The rare, explicit no-persona / focused-summary exceptions are listed; default is always-attach |
| REQ-006 | Placement plan | The contract names its canonical home + per-mode + hub placement so P3/P4 need no further design |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: P3 can add the per-mode rule to each of the 6 SKILLs using only the contract, no re-investigation.
- **SC-002**: P4 can add the persona-injection step to `cli-prompt-quality-card.md` using only the contract.
- **SC-003**: Every mechanism verdict in the contract traces to a P1 `§C` citation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Contract bloats the thin hub | Violates hub thinness invariant | Canonical home is `cli-prompt-quality-card.md`; hub gets one ALWAYS rule + a link only |
| Risk | Inline persona too large for small-context models | Dispatch failures / truncation | Contract includes a focused-summary exception for small-context models |
| Dependency | P1 verified inventory | Contract mechanism table depends on it | `001-analysis-inventory` complete + validated |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Every mechanism verdict cites the P1 inventory (no new unverified claims).

### Maintainability
- **NFR-M01**: The contract lives in ONE canonical place and is referenced, not copied, to avoid the drift class the sync-guard already polices.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Native load available** (`cli-claude-code --agent`): the contract treats native resolution as satisfying the rule; inline is redundant there.
- **Small-context model**: the contract permits a focused persona summary instead of the full `.md`.
- **Pure mechanical dispatch** (run an exact command, no agent semantics): the only sanctioned no-persona case, and it must be declared.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Medium. The design is synthesis from the verified P1 inventory plus two existing precedents. The difficulty is precision (an exact, copyable block format and an accurate per-mode table), not novelty.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. The `fanout-run.cjs` payload question from P1 is resolved in the contract by requiring persona to travel in the composed prompt string (the runtime has no separate persona slot).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent**: See `../spec.md`
- **Previous phase**: See `../001-analysis-inventory/spec.md`
- **Next phase**: See `../003-cli-mode-enforcement/spec.md`
- **Inventory (input)**: See `../001-analysis-inventory/scratch/dispatch-point-inventory.md`
