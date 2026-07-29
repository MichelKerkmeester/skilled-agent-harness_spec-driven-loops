<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Per-Mode Executor Parity

<!-- ANCHOR:notation -->
## Task Notation
`[ ]` open · `[x]` done. Status: In Progress — leaf 1 built and gated (SOL verify in flight); leaves 2-3 pending.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] Audit per-mode executor coverage; confirm fan-out modes already have full parity and the three gap modes.
- [x] Confirm `buildLineageCommand` fits cursor/devin/pi (no mode-specific arg divergence) but not opencode.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] Leaf 1 — model-benchmark: cursor/devin/pi delegate to `buildLineageCommand`; `cli-devin` registered; stale local allowlists removed.
- [ ] Leaf 2 — skill-benchmark: route cursor/devin/pi/claude-code through the shared builder.
- [ ] Leaf 3 — ai-council: shared-builder seat spawn for cursor/devin/pi; extend the allowlist (keep codex excluded).
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] Leaf 1 targeted test: 32/32 pass; whole-runtime tsc 0; require smoke test ok.
- [x] Leaf 1 stash-baseline delta: pre-change 29 failed / 594, post-change 28 failed / 570 passed; zero new failures (strict subset).
- [x] Leaf 1 SOL cross-verify: 0 P0 / 3 P1 — P1-003 (throw aborts sweep) and P1-001 (pi exit-0 auth false-success) fixed + scenario-tested; P1-002 (unused bin-override drop) documented. Re-gate 35/35, tsc 0.
- [ ] Leaves 2-3 built, baseline-verified, SOL-verified.
- [ ] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [ ] All three modes dispatch cursor/devin/pi through the shared builder with hardened flags.
- [ ] Every leaf: zero new failures, SOL clean, landed on origin.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Parent: `system-deep-loop/043-cli-executor-fanout-parity`
- Predecessor: `003-devin-cursor-exec-hardening`; successor: `005-combo-test-matrix`
- Code: `model-benchmark/dispatch-model.cjs`, `skill-benchmark/executor-dispatch.cjs`, `deep-ai-council/scripts/orchestrate-session.cjs`
<!-- /ANCHOR:cross-refs -->
