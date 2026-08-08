---
title: "Feature Specification: Guardrail Controls and Activation Gate"
description: "Planning spec: build the behavioral negative-control suite and the per-runtime-per-candidate activation/rollback gate that candidates 002-006 must pass, with unknown or ambiguous state defaulting to emit, closing out the injection-bloat-reduction phase map."
status: complete
completion_pct: 100
trigger_phrases:
  - "guardrail negative controls"
  - "per-runtime activation gate"
  - "injection reduction rollback"
  - "governor behavioral scenarios"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation"
    last_updated_at: "2026-08-07T04:31:31Z"
    last_updated_by: "codex"
    recent_action: "Verified guardrail controls"
    next_safe_action: "Collect candidate-owned behavioral and delivery evidence without changing flag defaults"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
      - ".opencode/specs/hooks/001-per-prompt-injection-audit/research/research.md"
    session_dedup:
      fingerprint: "sha256:278b9e65874f833631372cb83bcfb08910a624cd27d9a06d613f5014952c6820"
      session_id: "2026-08-06-hooks-002-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The governor is scored by four behavioral markers and remains valid under marker-preserving wording changes."
      - "The activation matrix is shared here; candidates 002-006 fill its evidence fields without changing this gate's fail-open policy."
---
# Feature Specification: Guardrail Controls and Activation Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete (gate defined; candidate flags remain off) |
| **Created** | 2026-08-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | 006-pi-dispatch-and-compaction |
| **Successor** | 008-sk-code-alignment |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
None of candidates 002-006 (OpenCode route bounding, transform dedup, full-first/route-only-repeats, Gate suppression, Pi compaction) can safely activate on byte savings alone. The research's rollout requires behavioral negative controls — long-context, advisor failure, no-match, comment-writing, completion-proof, advisory Gate, invalid-answer, child-session, resume, compaction (research.md §11 step 6) — and an explicit per-runtime-per-candidate activation gate that "activate[s] only cells whose behavioral and delivery evidence passes; unknown state always emits" (research.md §11 step 7). Seven central risks are named but not yet mapped to controls: long-context drift, compaction loss, false-negative relevance classifiers, advisory Gate invisibility, Pi override/preload loss, Cursor version drift, and OpenCode transform aliasing (research.md §11).

### Purpose
Build the terminal behavioral negative-control suite and the per-runtime-per-candidate activation/rollback gate that the whole program's candidates (002-006) must pass before any is turned on in production, closing out the injection-bloat-reduction phase map with a fail-open default for every unproven or ambiguous cell.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A behavioral negative-control suite: reject a REAL forbidden code comment (comment-hygiene), block an unsupported completion claim (proof-over-appearance/governor), and verify governor behavior with scored scenarios rather than exact-string matching
- A per-runtime-per-candidate activation matrix: activate only cells whose behavioral AND delivery evidence passes; unknown/ambiguous state always defaults to emit (fail-open)
- A per-block/per-runtime rollback procedure: disable the candidate flag, clear delivery state, and return to full baseline emission
- An explicit risk register mapping each of the seven named central risks (long-context drift, compaction loss, false-negative relevance classifiers, advisory Gate invisibility, Pi override/preload loss, Cursor version drift, OpenCode transform aliasing) to a control or monitoring plan

### Out of Scope
- Building or activating candidates 002-006 themselves — each is owned by its own phase child
- Any activation without both behavioral AND delivery evidence passing — no evidence, no activation, ever
- Removing or weakening the fail-open default for unknown/ambiguous state

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `guardrail-negative-controls.test.mjs` | Create | Forbidden-comment reject, unsupported-completion block, governor scored scenarios |
| `activation-matrix.json` | Create | Six-runtime x five-candidate grid with fail-open verdicts |
| `activation-matrix.schema.json` | Create | Cell shape and behavioral/delivery evidence contract |
| `activation-matrix.test.mjs` | Create | Matrix completeness and zero-activation fail-open proof |
| `risk-register.md` | Create | Seven central risk-to-control mappings |
| `rollback-procedure.md` | Create | Per-block/per-runtime rollback template and worked example |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A scored-scenario governor behavioral test exists, not exact-string matching | Test proves the governor still functions when its directive text changes, scored against behavior not string equality |
| REQ-002 | A REAL forbidden code comment negative control exists and is rejected end-to-end | Control uses an actual forbidden comment pattern, not a simulated string, and is rejected by the live guard |
| REQ-003 | An unsupported-completion-claim negative control exists and is blocked end-to-end | Control submits a real unsupported completion claim and is blocked by the live guard |
| REQ-004 | The per-runtime-per-candidate activation matrix enumerates every cell and defaults unknown/ambiguous cells to emit | Matrix covers 6 runtimes x candidates 002-006; every cell without both behavioral and delivery evidence defaults to fail-open emit |
| REQ-005 | Every activation matrix cell has a documented per-block/per-runtime rollback procedure | Rollback procedure named for every cell: disable flag, clear delivery state, full baseline emission |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The seven named central risks are each mapped to a control or monitoring plan | Long-context drift, compaction loss, false-negative relevance classifiers, advisory Gate invisibility, Pi override/preload loss, Cursor version drift, and OpenCode transform aliasing each have a named entry |
| REQ-007 | The activation gate's pass/fail evidence format is defined for 002-006 to report against | A single documented schema (fields, required evidence types) that every candidate phase can fill in consistently |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All three named behavioral negative controls (forbidden-comment reject, unsupported-completion block, governor scored scenarios) are specified with concrete pass/fail criteria
- **SC-002**: The activation matrix template covers all six runtimes (Claude Code, Codex, Cursor, Devin, OpenCode, Pi) x candidates 002-006
- **SC-003**: Every one of the seven named central risks has an explicit mitigation or monitoring entry
- **SC-004**: The rollback procedure is proven reversible on paper for at least one worked example (a hypothetical candidate cell disabled end-to-end)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A scored-scenario test still under-detects governor regressions | Medium | Multiple scenario variants reviewed against the governor's actual behavioral contract, not just its directive text |
| Risk | The activation matrix ships before 002-006 have real evidence to report, creating a false sense of readiness | Low (this packet defines the gate; it does not itself activate anything) | REQ-004's explicit fail-open default for missing evidence |
| Dependency | Phase 001 canonical block IDs, hashes, and delivery-receipt fields | High - hard prerequisite per parent Phase Transition Rules | Do not activate any candidate until 001 lands; the gate schema itself can be designed now |
| Dependency | Candidates 002-006 each supplying their own behavioral and delivery evidence into this gate's matrix | High - this packet cannot activate anything alone | Fail-open default means missing evidence never silently activates a cell |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- What exact scored-scenario rubric proves governor behavior without relying on the directive's current exact string? (research.md §11 rollout step 6)
- Should the activation matrix be a single shared artifact across 002-006, or does each candidate phase own its own row and this packet only defines the schema?
<!-- /ANCHOR:questions -->
