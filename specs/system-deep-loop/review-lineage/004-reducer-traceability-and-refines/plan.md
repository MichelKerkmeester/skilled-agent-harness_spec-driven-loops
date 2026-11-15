---
title: "Implementation Plan: Correct deep-review reducer dead ends and refinement counting"
description: "Remove the traceability-to-dead-end fallback, carry an optional refines link on structured findings, fold a linked refinement into its target, and prove both with failing-first reducer tests."
trigger_phrases:
  - "reducer traceability and refines plan"
  - "fold refinement finding plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Correct deep-review reducer dead ends and refinement counting

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS |
| **Framework** | None, a single reducer script |
| **Storage** | JSONL state, iteration markdown, JSON registry |
| **Testing** | `node:test` with `node:assert/strict` |

### Overview
Change `parseIterationFile` so `Traceability Checks` no longer becomes a dead-end source. Carry an optional `refines` value on the two structured finding converters, then fold a linked row into its target in `buildFindingRegistry` before the existing id-reuse split runs. Prove the two fixes with one new test file whose first two cases fail on today's code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `reduce-state.cjs:349` still maps `Traceability Checks` to `deadEnds` and the evidence strategy still holds the false BLOCKED entries.
- [ ] `reduce-state.cjs:954-982` still keeps an id reuse as a second finding.
- [ ] The evidence run at `039-hop-dialog-goal-title/review/` is readable.

### Definition of Done
- [ ] `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-traceability-and-refines.test.cjs` exits 0 and reports no failing case.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-deep-loop/review-lineage/004-reducer-traceability-and-refines --strict` prints `RESULT: PASSED`.
- [ ] The prompt template names `refines` in one line.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single reducer pipeline.

### Key Components
- **`parseIterationFile`**: reads one iteration markdown file into focus, findings, ruled out, dead ends and next focus. It stops using `Traceability Checks` as a dead-end source.
- **`buildExhaustedApproaches`**: groups `deadEnds` and `ruledOut` into BLOCKED entries. It keeps its behavior and receives a smaller, truthful input.
- **`buildTraceabilityRollup`**: reads structured `traceabilityChecks.results` and remains the only traceability status source in the registry.
- **`deltaRecordToFinding` and `findingDetailToFinding`**: map structured rows into registry findings. Both carry `refines`.
- **`buildFindingRegistry.upsertFinding`**: resolves a `refines` target before the content-based id-reuse split, then folds or inserts.

### Data Flow
Iteration markdown supplies `deadEnds` and narrative findings. Delta files supply `findingDetails` and `type:"finding"` rows. The converters normalize both structured forms. `upsertFinding` resolves a `refines` id against the in-memory `findingById` map. A resolved target receives the refinement, and an unresolved value continues through the ordinary path. The registry then splits open and resolved findings and the strategy renderer replaces the exhausted-approaches anchor.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `reduce-state.cjs:349` | Maps `Traceability Checks` into `deadEnds` | Update to read only `Dead Ends` | Direct parser case in the new test file |
| `reduce-state.cjs:1811` | Concats `deadEnds` and `ruledOut` for BLOCKED output | Unchanged, input is narrower | Explicit dead-end case still prints BLOCKED |
| `buildTraceabilityRollup` at `reduce-state.cjs:1372-1389` | Aggregates `traceabilityChecks.results` | Unchanged | Existing summary fallback test still passes |
| `registry.traceability` at `reduce-state.cjs:1753` | Publishes structured protocol status | Unchanged | Read by `deep-review/scripts/divergent-review-pivot.ts:271-272` |
| Markdown `Traceability Checks` section | Only read at `reduce-state.cjs:349` | Not read after this change | `rg -n "Traceability Checks" runtime/scripts/reduce-state.cjs` prints one compatibility comment only |
| `deltaRecordToFinding` at `reduce-state.cjs:625-660` | Builds a finding from a `type:"finding"` delta row | Add optional `refines` | Refines row test |
| `findingDetailToFinding` at `reduce-state.cjs:735-753` | Builds a finding from `findingDetails[]` | Add optional `refines` and the observed `refinementOf` alias | Refines row test, evidence row shape |
| `upsertFinding` at `reduce-state.cjs:951-998` | Splits same-id rows by content | Add resolved-target fold before the split | Refines fold test and unlinked reuse guard |
| `persistentSameSeverity` and `severityChanged` at `reduce-state.cjs:1707-1719` | Classify transitions | Ignore transitions whose `from` equals `to` | Refines test asserts no churn |
| `prompt-pack-iteration.md.tmpl` | Tells the iteration agent how to write `findingDetails[]` | Add one `refines` line | `rg -n "refines"` prints one line |
| `deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs` | Existing reducer regression suite | Not a consumer of the new field | Run it as a compatibility check |

Required inventories:
- Same-class producers: `rg -n "refinementOf|refines" .skilled/skills/system-deep-loop` finds the evidence record and this plan's new field.
- Consumers of `deadEnds`: `rg -n "deadEnds" .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` returns the parser, the returned iteration shape and `buildExhaustedApproaches`.
- Consumers of structured traceability: `rg -n "traceabilityChecks|registry.traceability" .skilled/skills/system-deep-loop` returns `buildTraceabilityRollup`, `divergent-review-pivot.ts` and the existing reducer test.
- Matrix axes: finding source (`findingDetails[]` or `type:"finding"`), link state (`refines` absent, resolved, unknown), severity change (same or different), and dead-end source (`Dead Ends`, `Ruled Out`, `Traceability Checks`).
- Algorithm invariant: a finding is counted once when it names a resolvable target, and every finding without a resolvable link keeps the existing one-entry-per-content behavior.
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
| Unit | `parseIterationFile` dead ends and `buildFindingRegistry` fold behavior through `reduceReviewState` | `node --test` and a temporary review fixture |
| Integration | Full reducer strategy rendering and registry counts | `reduceReviewState` with `write: false` |
| Regression | Existing summary fallback reducer suite | `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/reduce-state-summary-fallback.test.cjs` |

The new test file has three cases. The fixture writes a minimal `deep-review-strategy.md` and passes `createMissingAnchors: true`, so the exhausted-approaches anchor is created without a template copy. `traceability checks do not become blocked dead ends` fails today because the strategy contains six BLOCKED traceability entries. `a refines row folds into its target` fails today because the registry holds two open findings. `an id reuse without refines keeps both findings` passes today and must keep passing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node.js built-in test runner | Internal | Green | The new test file cannot run |
| Existing reducer exports `parseIterationFile` and `reduceReviewState` | Internal | Green | The test file would need a process-level invocation |
| Evidence review folder for transcript shape | Internal | Green | The fixture can use a synthetic copy of the same sections |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The reducer drops a real finding, changes an unlinked id-reuse count, or a registry consumer fails after the change.
- **Procedure**: Revert the reducer edit, the prompt template line and the new test file through the change set that introduced them. No data migration is involved, and rerunning the reducer on the prior source restores the prior registry.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Packet close |
<!-- /ANCHOR:phase-deps -->
