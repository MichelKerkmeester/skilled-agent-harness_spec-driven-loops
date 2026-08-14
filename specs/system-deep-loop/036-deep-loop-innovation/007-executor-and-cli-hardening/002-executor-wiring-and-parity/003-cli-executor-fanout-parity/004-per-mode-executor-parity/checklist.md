<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# QA Checklist: Per-Mode Executor Parity

<!-- ANCHOR:protocol -->
## Verification Protocol
Per leaf: targeted lane test (full output, never through `tail`) + a stash-baseline delta requiring the post-change failure set to be a strict subset of the pre-change set (zero new failures) + whole-runtime tsc + a require smoke test + SOL cross-verify before landing.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] Per-mode coverage matrix produced; the three gap modes identified.
- [x] Confirmed the shared builder fits cursor/devin/pi and is reused, not forked.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] Leaf 1: cursor/devin/pi delegate to `buildLineageCommand`; opencode/claude untouched; fan-out builders untouched.
- [x] Leaf 1: stale local cursor/pi allowlists removed with no dangling references; `cli-devin` registered in both registries.
- [ ] Leaf 2 (skill-benchmark) and leaf 3 (ai-council) delegate cursor/devin/pi to the shared builder.
- [x] Comment hygiene: durable WHY only, no ephemeral ids/spec paths.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] Leaf 1 targeted test 32/32; tsc 0; require smoke test ok.
- [x] Leaf 1 stash-baseline delta: zero new failures (post ⊂ pre baseline).
- [x] Leaf 1 SOL cross-verify: 3 P1 found — two fixed + scenario-tested (sweep-abort throw, pi exit-0 false-success), one documented (unused bin-override); re-gate 35/35, tsc 0, zero new regressions.
- [ ] Leaves 2-3 built + baseline-verified + SOL-verified.
- [ ] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] Leaf 1: model-benchmark's cli-pi stub removed and its stale cursor read-only fiction replaced with the hardened flags.
- [ ] All three modes reach cursor/devin/pi parity.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] Read-only-by-default preserved: write-capable is the explicit opt-in mapping to `workspace-write`.
- [x] Read-only cursor/devin/pi dispatches inherit the hardened, genuinely-read-only flags from the shared builder.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] Each mode's delegation documents the durable WHY (reuse the single hardened source, no fork).
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] Leaf 1 confined to model-benchmark's dispatch-model.cjs, profile-validator.cjs, and its lane test.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
- [x] Leaf 1 unit + baseline-delta evidence recorded in the implementation summary.
- [ ] SOL verdicts recorded per leaf.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
- [ ] Operator review before the combo-matrix phase (005) exercises the parity end-to-end.
<!-- /ANCHOR:sign-off -->
