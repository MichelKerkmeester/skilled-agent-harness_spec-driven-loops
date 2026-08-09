---
title: "Tasks: Route-Only Activation for [SYS] Runtimes"
description: "Completed task record for proving, wiring, and activating candidate 004 on Claude Code, Codex, Devin, and OpenCode."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "route-only activation sys runtimes tasks"
  - "candidate 004 sys tasks"
importance_tier: "high"
contextType: "tasks"
parent: "hooks/002-injection-bloat-reduction"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/017-route-only-activation-sys-runtimes"
    last_updated_at: "2026-08-09T14:52:56Z"
    last_updated_by: "sol"
    recent_action: "Reconciled four-runtime route-only activation"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts"
      - ".opencode/plugins/mk-skill-advisor.js"
      - "specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs"
    session_dedup:
      fingerprint: "sha256:5344c2f707507c5ff6fbb9f7d9c0380310674a77525ea59c1ad7054a24b43d9d"
      session_id: "2026-08-09-route-only-activation-sys-runtimes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Route-Only Activation for [SYS] Runtimes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` will mean completed and evidenced; `[~]` will mean explicitly deferred with a recorded reason and owner; `[ ]` will mean pending.
- `T-NNN` identifiers will remain stable within this packet.
- Every completed task is checked and cites implementation or gate evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Record the current 007 matrix baseline: 30 cells, 13 applicable cells, four candidate-004 [SYS] cells at `emit`, zero activated cells, and `activationState: "all-candidate-flags-off"`. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] T-002 Trace candidate 004 from `DeliveryStateMachine.decideSuppression` through `render.ts`, the canonical `user-prompt-submit.ts` hook, the Codex/Devin adapters, and the OpenCode system-transform plugin. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] T-003 Capture the current full-output and shadow-output behavior for first turn, same-content repeat, content change, missing identity, resume, compaction, and advisor fallback. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] T-004 Record the evidence-gated activation contract and the exact four candidate-004 cells before activation. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs` passed 5/5.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-005 Build and run the phase-007 behavioral negative-control suite for long-context, advisor failure, no-match, comment-writing, completion-proof, advisory Gate, invalid-answer, child-session, resume, and compaction. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] T-006 Assert full guardrail preservation for every negative-control case, including the advisor-failure and directives-only fallback paths. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] T-007 Record behavioral evidence separately for Claude Code, Codex, Devin, and OpenCode, with scenario identity and the output boundary under test. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-008 Wire the canonical [SYS] `user-prompt-submit.ts` path to consume route-only only after a proven same-session, same-epoch `SUPPRESSED_SAME` decision, while retaining full fail-open output. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] T-009 Wire the Codex and Devin `user-prompt-submit.ts` adapters to preserve their native runtime identity and envelope when they call the shared consumer. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] T-010 Wire `.opencode/plugins/mk-skill-advisor.js` to consume the route-only result before `output.system.push`, without conflating it with existing transform deduplication. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] T-011 Preserve full delivery on unknown or ambiguous identity, advisor failure, no-match, content change, resume, compaction, observer failure, and any matrix cell that remains `emit`. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.

### Phase 4: Delivery Evidence and Matrix Activation

- [x] T-012 Gather a host-observed delivery receipt for each eligible runtime and bind it to candidate `004`, the exact block hash, a positive lifecycle epoch, and an artifact digest. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] T-013 Validate the behavioral and delivery evidence pair for each of the four candidate-004 cells with `activation-matrix-evidence.mjs`. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] T-014 Change only `Claude Code/004`, `Codex/004`, `Devin/004`, and `OpenCode/004` from `emit` to `activated` after both records pass; keep all other unproven or ambiguous cells fail-open. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] T-015 Update `activation-matrix.test.mjs` so it asserts the exact four-cell activation set and continues rejecting missing, failed, unknown, ambiguous, configured-only, mismatched, and wrong-epoch evidence. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.

### Phase 5: Verification and Rollback Rehearsal

- [x] T-016 Run the focused state-machine, renderer, hook, plugin, negative-control, receipt, and matrix tests from the final implementation state. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] T-017 Prove the fail-open paths retained full emission for advisor failure and unknown identity. Evidence: `.opencode/skills/system-skill-advisor/mcp-server/tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed; advisor failure was 763 bytes full and unknown identity was 806 bytes full.
- [x] T-018 Verify that Pi and Cursor received no source, adapter, receipt, or activation changes from this phase. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
- [x] T-019 Inspect the final scoped diff and confirm that no generated metadata, temporary fixture, or unrelated file remains in the implementation change. Evidence: `tests/route-only-activation-negative-controls.vitest.ts`; 86 focused tests passed and `activation-matrix.test.mjs` passed 5/5.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- The four eligible [SYS] runtimes will consume route-only only after proven `SUPPRESSED_SAME` same-epoch repeats.
- The ten negative controls will preserve every guardrail and will fail open on uncertainty.
- Each activated cell will have two validator-passing evidence records, and the matrix test will assert exactly four activations.
- Pi and Cursor will remain outside this phase and will be reserved for later work.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements and success criteria will be defined in `spec.md`.
- Architecture, execution phases, testing, and rollback will be defined in `plan.md`.
- The source research will be `specs/hooks/002-injection-bloat-reduction/014-injection-surface-deprecation-research/research/research.md`, section 5 row 6 and section 6 step 3.
- The shared evidence contract will be `specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.json` and `activation-matrix-evidence.mjs`.
- The activation matrix and its behavioral plus delivery evidence recorded the completed four-cell decision.
<!-- /ANCHOR:cross-refs -->
