---
title: "Implementation Plan: Phase 1: continuity-freshness-claim-binding"
description: "Bind a completion claim to implementation-summary.md's fingerprint, stop the timestamp check from silently overriding the completion verdict, and add a skip signal the orchestrator can carry without moving any exit code."
trigger_phrases:
  - "continuity freshness binding plan"
  - "validateContinuityFreshness reorder"
  - "skip code family distinguish"
  - "fingerprint stamp completion claim"
  - "fresh_completion verdict return"
  - "continuity-freshness.vitest.ts suite"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: continuity-freshness-claim-binding

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node ESM), run through `.opencode/skills/system-spec-kit`'s own CLI bridge |
| **Framework** | None - a validation rule module plus a continuity-writer module |
| **Storage** | None - reads/writes markdown frontmatter and `graph-metadata.json` on disk |
| **Testing** | Vitest (`continuity-freshness.vitest.ts`, `generate-context-cli-authority.vitest.ts`, `generate-context-save-lock.vitest.ts`) |

### Overview
Reorder `validateContinuityFreshness` so the completion-freshness verdict returns directly whenever it has one, instead of falling through to the unrelated timestamp-staleness check; add a skip-vs-pass distinction the orchestrator's shell-rule bridge can carry into JSON output; and make the continuity writer stamp a fingerprint whenever it writes a completion claim, so the skip path stops being the default for a freshly closed packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (`continuity-freshness.vitest.ts` plus the two writer suites)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Rule-plus-writer seam: one validation module reads state a separate writer module produces, bridged through a third orchestrator module that maps raw rule output to aggregate pass/fail.

### Key Components
- **`continuity-freshness.ts`**: owns `ContinuityFreshnessResult`, `evaluateCompletionFreshness`, and `validateContinuityFreshness`. This phase changes the return-precedence in `validateContinuityFreshness` (lines 376-382) and extends the code vocabulary.
- **`generate-context.ts` / `memory-metadata.ts`**: the continuity writer. This phase adds a fingerprint-stamp trigger keyed on the presence of a completion claim in the document being written, reusing the existing `buildContinuityFingerprint` helper already imported by the rule.
- **`orchestrator.ts` shell-rule bridge (`parseShellRuleOutput`, `mapShellRuleStatus`)**: consumes the rule's tab-separated CLI output (`printBridgeOutput`) and folds it into the aggregate `ValidationEntry`. This phase adds recognition for the new skip signal without changing `mapShellRuleStatus`'s existing pass/warn/fail mapping for any code that already exists today.

### Data Flow
Spec-folder documents → `collectCompletionCandidates` reads each `COMPLETION_DOCS` file → `evaluateCompletionFreshness` resolves one completion verdict → `validateContinuityFreshness` returns it directly (new) or falls through to the timestamp-staleness comparison only when there is no completion verdict to report → `printBridgeOutput` serializes the result as tab-separated lines → `runRegistryNodeRule` spawns the CLI and reads those lines → `parseShellRuleOutput`/`mapShellRuleStatus` produce the `ValidationEntry` the aggregate `validate.sh --strict` report shows.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `continuity-freshness.ts:376-382` (`validateContinuityFreshness` fall-through) | Discards a `pass`-status completion verdict when a timestamp check also runs | update: return the completion verdict whenever `evaluateCompletionFreshness` produced one, before the timestamp branch | `continuity-freshness.vitest.ts` new case reproducing the `052` zero-fingerprint-plus-stale scenario |
| `continuity-freshness.ts:544-546` (`runCli`) vs the exported `validateContinuityFreshness` | CLI gates on `isOptedIn()`; function itself unguarded | unchanged (documented as intentional: the function is a library entry point, the CLI is the opt-in-gated surface) | new vitest case pinning both call paths' current behavior |
| `orchestrator.ts` `mapShellRuleStatus`/`parseShellRuleOutput` | Maps shell `pass`/`warn`/`fail`/`info` tokens; a shell `skip` token already maps to `pass` | update: recognize the new skip code family emitted by `continuity-freshness.ts` and preserve it in the `ValidationEntry` details/message, not the top-level status, so `validate.sh --strict`'s exit code is unaffected | `validate.sh --strict` run against `052`, `053`, and this packet, comparing exit code and summary counts before/after |
| `generate-context.ts` + `memory-metadata.ts:185` | Assembles `session_dedup` from collected session data on save; does not check whether the document being written carries a completion claim | update: stamp `session_dedup.fingerprint` via `buildContinuityFingerprint` when the write target carries a completion claim | `generate-context-cli-authority.vitest.ts`, `generate-context-save-lock.vitest.ts` unchanged in pass count; new assertion that a completion-claim save produces a non-zero fingerprint |

Required inventories:
- Same-class producers: `rg -n "buildPass\('missing_fingerprint'|buildPass\('zero_fingerprint'|buildPass\('no_completion_claim'" .opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts` - confirms these are the only three call sites producing the skip family this phase targets.
- Consumers of changed symbols: `rg -n "validateContinuityFreshness|ContinuityFreshnessResult" .opencode/skills/system-spec-kit --glob '*.ts' --glob '*.js' --glob '*.md'` - finds the CLI entry, the orchestrator bridge, the vitest suite, and any reference doc naming the rule by symbol.
- Matrix axes: completion-claim present/absent × fingerprint present/absent/zero × `SPECKIT_COMPLETION_FRESHNESS` on/off × `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` on/off - 2×3×2×2 = 24 theoretical combinations; the four new/extended test cases cover the load-bearing corners (claim+fingerprint, claim+no-fingerprint, claim+zero-fingerprint, opted-out), the existing five cases already cover the no-claim and timestamp-only corners.
- Algorithm invariant: the completion-freshness verdict, once resolved to a `pass`-with-evidence-gap code, must be the value returned by `validateContinuityFreshness` unless a `fail`/`warn` from the same evaluation supersedes it; the timestamp-staleness branch only runs when `evaluateCompletionFreshness` returned `null` or `no_completion_claim`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `continuity-freshness.ts`'s `evaluateCompletionFreshness` and `validateContinuityFreshness` return-precedence | Vitest (`continuity-freshness.vitest.ts`) |
| Integration | Continuity writer fingerprint stamp against the CLI authority and save-lock suites; orchestrator bridge against `validate.sh --strict` | Vitest, `validate.sh` |
| Manual | Live reproduction against real packets `052-memory-decommission-landing` (zero-fingerprint, Complete) and `053-spec-kit-runtime-rename` before and after | `SPECKIT_COMPLETION_FRESHNESS=1 node continuity-freshness.ts --folder <packet> --json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@spec-kit/runtime` `buildContinuityFingerprint` / `ZERO_CONTINUITY_FINGERPRINT` exports | Internal | Green - already imported by `continuity-freshness.ts:11-14` | The writer stamp would need its own SHA-256 helper, duplicating existing logic |
| `runtime/lib/continuity/thin-continuity-record.ts` session-dedup validation | Internal | Green - already validates fingerprint shape at write time | A malformed stamp would be rejected before reaching disk, which is the desired fail-closed behavior |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `validate.sh --strict` regresses on any packet in `049-memory-decommission/`, `052-memory-decommission-landing/`, or `053-spec-kit-runtime-rename/` after this change lands.
- **Procedure**: revert the `continuity-freshness.ts` return-precedence change and the writer stamp in one commit; the orchestrator bridge change is additive and safe to leave if the rule-side change is reverted, since it does nothing without the new skip codes to recognize.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (read rule + writer + orchestrator source) ──┐
                                                    ├──► Core (rule precedence fix, writer stamp, orchestrator recognition) ──► Verify (vitest + live validate.sh runs)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Already complete during authoring - source read and live reproduction done |
| Core Implementation | Med | Rule precedence fix, writer stamp, orchestrator recognition - three small, independently testable diffs |
| Verification | Med | Four new/extended vitest cases plus three live `validate.sh --strict` comparisons |
| **Total** | | **Half a session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline `validate.sh --strict` output captured for `052` and `053` before this change
- [ ] `continuity-freshness.vitest.ts` baseline run captured (5 passing, 1 `it.fails.skip`)
- [ ] No feature flag needed - this is a validation-rule and writer change, not a runtime toggle

### Rollback Procedure
1. Revert the `continuity-freshness.ts` and writer commits.
2. Re-run `validate.sh --strict` on `052` and `053` and diff against the captured baseline.
3. Re-run `continuity-freshness.vitest.ts` and confirm the same 5-passing/1-skip baseline.
4. No stakeholder notification needed - this is an internal validation-tooling change with no external contract.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - no persisted schema changes, only rule logic and writer behavior
<!-- /ANCHOR:enhanced-rollback -->

---
