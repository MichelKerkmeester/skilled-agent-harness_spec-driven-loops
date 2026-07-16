---
title: "Feature Specification: Fanout LEAF-Identity Conflation"
description: "Reword buildLoopPrompt's identity line so the dispatched fan-out subprocess no longer claims LEAF-agent identity, fixing codex-lineage finding F003."
trigger_phrases:
  - "fanout leaf identity conflation"
  - "F003 identity fix"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/011-followup-remediation/002-fanout-leaf-identity-conflation"
    last_updated_at: "2026-07-01T20:22:37Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Completed buildLoopPrompt identity wording fix and regression test"
    next_safe_action: "Final spec validation and report"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/agents/deep-review.md"
      - ".opencode/agents/deep-context.md"
      - ".opencode/agents/deep-research.md"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-011-followup-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Fanout LEAF-Identity Conflation

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 2 |
| **Predecessor** | 001-fanout-session-id-propagation |
| **Successor** | 003-scaffold-content-002-deep-loop-runtime |
| **Handoff Criteria** | `buildLoopPrompt`'s identity line no longer claims LEAF-agent identity for any loop type, still instructs the subprocess to run the loop's phases, and the new regression test passes for context/research/review |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shared fan-out prompt builder `buildLoopPrompt` in `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` (function spans roughly lines 863-945) tells the dispatched CLI subprocess "You are a {agentName} agent running a fan-out lineage" (around line 930, `agentName` set at line 870, e.g. `'deep-review'`) and then instructs it to "Run phase_init, phase_main_loop (...), and phase_synthesis" (around line 940) — the FULL multi-iteration loop. But `.opencode/agents/deep-review.md` (and the sibling `deep-context.md`, `deep-research.md`) define their agent as a LEAF that executes exactly ONE iteration per dispatch and must refuse a request to run the full loop (`deep-review.md`'s "ILLEGAL NESTING (HARD BLOCK)" section, roughly lines 54-64, forbids sub-agent/Task dispatch and mandates a canonical REFUSE string if asked to run beyond one iteration). This conflation affects all 3 loop types that share `buildLoopPrompt` (`agentName` mapping around line 870 covers context/research/review), not just review.

### Purpose
Reword the identity line so the dispatched subprocess is framed as running/orchestrating the loop-type's workflow YAML as a detached fan-out lineage (mirroring how `buildNativeCommandInput`, a sibling function around lines 947-980, already correctly invokes the `:auto` command surface rather than claiming to BE the leaf agent), not as "being" the LEAF agent itself. Keep the phase-instruction line (phase_init/phase_main_loop/phase_synthesis) since that's correct for whoever actually owns/drives the loop (the command surface, not the LEAF agent). Fix once in the shared builder so all 3 loop types (context/research/review) are covered by the same change, not just review.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reword the identity line in `buildLoopPrompt`.
- Verify the fix covers context/research/review since they share the same function.
- Add a new regression test asserting the fan-out prompt never claims LEAF identity for any loop type, but still contains the phase-instruction line for the actual loop owner.

### Out of Scope
- The session-id fix (child 001, separate concern).
- `buildNativeCommandInput` (already correctly framed, not part of this bug).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | Reword the identity line in `buildLoopPrompt` |
| `.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts` | Modify | New regression test asserting no LEAF-identity claim across loop types |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Reworded identity line must not claim LEAF-agent identity | The fan-out prompt no longer states or implies the dispatched subprocess IS the LEAF agent, for context/research/review |
| REQ-002 | Subprocess must still be instructed to actually run the loop's phases | The reworded prompt still contains the phase-instruction line (phase_init/phase_main_loop/phase_synthesis) |

### P1 — Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Fix applies uniformly across context/research/review | Single shared edit inside `buildLoopPrompt`, not 3 separate loop-type-specific patches |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: New test passes, asserting the fan-out prompt never claims LEAF identity for any loop type (context/research/review), while still containing the phase-instruction line.
- **SC-002**: Existing `fanout-run.vitest.ts` assertions (which per prior research don't touch identity-line wording) remain passing.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Wording-only change to a prompt string | None significant; no behavior/schema change | Grep the test file for the old identity-line substring before editing, to confirm no existing assertion depends on the exact old wording |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Scope bounded by the codex lineage's F003 finding, independently re-verified against current code before this phase was scaffolded.
<!-- /ANCHOR:questions -->
