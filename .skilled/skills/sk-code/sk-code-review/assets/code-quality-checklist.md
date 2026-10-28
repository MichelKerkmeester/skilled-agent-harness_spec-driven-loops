---
title: Code Quality Checklist
description: Correctness, performance, and boundary-condition checklist for identifying production-impacting quality defects.
trigger_phrases:
  - "code quality review checklist"
  - "silent failure data corruption risks"
  - "boundary condition review pass"
  - "kiss dry enforcement checks"
  - "error handling review defects"
importance_tier: normal
contextType: implementation
version: 1.5.1.0
---

# Code Quality Checklist

Correctness, performance, and boundary-condition checklist for identifying production-impacting quality defects.

---

## 1. OVERVIEW

### Purpose

Provide a systematic pass for non-security defects that still cause outages, regressions, or high maintenance cost.

### Usage

Run this pass on every findings-first review; walk each section against the changed diff and cite file:line for anything flagged.

### Core Principle

Prioritize silent-failure and data-corruption risks above stylistic concerns.

### Rule Ids

Each section names its rule ids under its heading. A **floor** id is fixed: no repository or surface changes it. A **default lens** id is this mode's default, which a repository or surface may drop or replace with a `## Rule overrides` row. [`review-core.md`](../references/review-core.md) section 8 lists every id and how an override reaches the review.

---

## 2. ERROR HANDLING

Rule: floor, `review.correctness-minimums` and `floor.silent-failures`.

Flag:
- Swallowed exceptions (`catch {}` or log-only catches).
- Overly broad exception handling hiding root causes.
- Missing async error propagation.
- User-facing leakage of internal stack traces.
- Missing fallback behavior for recoverable failures.

Review prompts:
- "Will callers know this failed?"
- "Is there enough context to debug without exposing internals?"

---

## 3. PERFORMANCE AND SCALING

Rule: default lens, `review.performance`.

Flag:
- N+1 query patterns.
- Per-item network/database calls that should be batched.
- Expensive work in hot loops without memoization/cache.
- Synchronous blocking work in request paths.
- Unbounded collections and memory growth risks.

Review prompts:
- "How does this behave with 10x data volume?"
- "Can this call path be batched or cached safely?"

---

## 4. BOUNDARY CONDITIONS

Rule: floor, `review.correctness-minimums`.

Check:
- Null/undefined handling and optional chaining misuse.
- Empty collection behavior for first/last/indexed access.
- Numeric boundaries (division by zero, overflow, negative values).
- String boundaries (empty, whitespace-only, very long input, unicode).
- Off-by-one errors in loops, pagination, and slicing.

Common risky patterns, shown as a JavaScript example:

```javascript
const first = items[0]              // no empty check
const avg = total / count           // count may be zero
if (value) { /* skips valid 0 */ }  // truthy trap
```

---

## 5. DATA FLOW AND CONTRACT SAFETY

Rule: floor, `review.correctness-minimums`.

Flag:
- Function or method signature changes that break existing callers (added required parameters, removed parameters, changed return types).
- New null or undefined return paths introduced where callers expect a value.
- Data transformation functions that silently drop fields, truncate values, or lose type precision.
- Default parameter value changes that alter behavior for existing callers without updating call sites.
- Implicit behavioral contract changes (sort order, iteration order, timing guarantees) not documented in the diff.
- Public API response shape changes without versioning or migration path.

Review prompts:
- "If an existing caller is not updated, will it still work correctly after this change?"
- "Does any data transformation lose information that downstream consumers need?"
- "Are implicit behavioral guarantees (ordering, timing, idempotency) preserved?"

Severity guidance, under the reach rule in [`review-core.md`](../references/review-core.md) section 2:
- P1 for a breaking change to a public API or shared interface with no migration path, when the finding names a caller or a published contract the break reaches. It is P0 only when that break also causes destructive data loss or opens a security hole in reach.
- P1 for new null returns or type changes that existing callers do not handle.
- P2 for implicit contract changes with low blast radius, and for any break whose reach the finding cannot name.

---

## 6. MAINTAINABILITY SIGNALS

Rule: default lens. Each item names its own id, and the numbers below are defaults a repository may change.

Watch for:
- `review.maintainability`: repeated logic with inconsistent behavior.
- `review.magic-literals`: magic literals where domain constants are expected.
- `review.nesting-depth`: overly nested control flow reducing readability. By default, 4 or more nesting levels without structural justification.
- `review.maintainability`: hidden coupling through global/shared mutable state.
- `floor.boundary-tests`: tests missing for newly introduced edge cases.
- `review.function-length`: by default, a function longer than 20 lines without structural justification.
- `review.law-of-demeter`: by default, method chaining across more than two object boundaries (Law of Demeter: a.b().c().d()).
- `review.maintainability`: functions that produce side effects not implied by their name or signature (Principle of Least Astonishment).
- `floor.error-messages`: error messages that lack actionable context for debugging (missing what failed and what to try).
- `review.todo-tracking`: a TODO, FIXME or HACK comment on a production code path that does not say what is left and why, or does not follow the repository's tracking convention. The review never asks for a tracker id that the repository's comment-hygiene rules forbid in a comment: while `hygiene.issue`, `hygiene.task`, `hygiene.adr`, `hygiene.req`, `hygiene.rc` or `hygiene.chk` is on, a TODO names no id of that kind, and once the repository switches one off, an id of that kind raises no review finding. [`review-core.md`](../references/review-core.md) section 8 gives the mapping.
- `review.hardcoded-config`: hardcoded environment-specific values (URLs, ports, timeout thresholds) that should be externalized for deployment flexibility.
- `review.prefer-native`: hand-rolled standard-library behavior where the language or runtime already provides a clear, readable primitive. Prefer the standard API when behavior and edge cases match.
- `review.prefer-native`: custom code or a dependency duplicating a native platform/runtime capability without a current requirement the native feature cannot satisfy.

Decision cue: if reviewers cannot explain intent quickly, maintenance risk is likely at least P2.

---

## 7. KISS / DRY ENFORCEMENT

Rule: default lens, `review.kiss`, `review.dry`, `review.rule-of-three` and `review.ceiling-marker`.

### KISS Checks

`review.kiss` flags:
- New abstraction layers without a current behavior need.
- Generic helpers used in only one place.
- Workflow complexity introduced "for future flexibility" without evidence.
- Features, parameters, or configuration options added for speculative future use without a current requirement (YAGNI).
- New code not traceable to a current requirement (a feature, parameter, branch, or config that nothing in the stated scope asked for). Recommend removal (see removal-plan.md), not just simplification. Ask: was this asked for? If the requirement were dropped, would anything break? If not, it is a removal candidate. P2 by default per the severity rule below; escalate to P1 only when the unneeded code adds attack surface, contract obligations, or regression/maintenance risk.

### DRY Checks

`review.dry` flags:
- Duplicated constants/rules across modules.
- Copy-paste branches with minor name changes.
- Repeated validation/parsing blocks that can share one source.

`review.rule-of-three` flags abstractions extracted from only two instances without evidence of a shared concept. By default, apply the Rule of Three before consolidating to avoid premature generalization (AHA).

Severity guidance:
- P2 default for stylistic duplication/complexity.
- Escalate to P1 if duplication or complexity introduces behavior/regression risk.

Intentional-simplification evidence, `review.ceiling-marker`:
- By default, a concrete `ceiling:` comment (naming the shortcut, its ceiling, and the upgrade path) is evidence that a "too simple" or "missing feature" KISS/YAGNI finding is deliberate, so downgrade or suppress that P2 finding. This NEVER applies to security, auth, persistence, sandboxing, public-contract, or correctness findings; those are judged on their own contract regardless of any comment.

---

## 8. RELATED RESOURCES

- [quick-reference.md](../references/quick-reference.md) - Baseline review flow and severity output contract.
- [security-checklist.md](./security-checklist.md) - Security, authz, abuse, and privacy risk checks.
- [solid-checklist.md](./solid-checklist.md) - SOLID (SRP/OCP/LSP/ISP/DIP) and architecture risk prompts.
- [removal-plan.md](./removal-plan.md) - Removal candidate classification and migration planning.
- [test-quality-checklist.md](./test-quality-checklist.md) - Test quality, coverage, and anti-pattern checks.

Surface portability: pair this baseline with surface-specific quality guidance from `sk-code`.
