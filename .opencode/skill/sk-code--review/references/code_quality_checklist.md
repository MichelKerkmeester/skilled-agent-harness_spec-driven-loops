---
title: Code Quality Checklist
description: Correctness, performance, and boundary-condition checklist for identifying production-impacting quality defects.
---

# Code Quality Checklist

Correctness, performance, and boundary-condition checklist for identifying production-impacting quality defects.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Provide a systematic pass for non-security defects that still cause outages, regressions, or high maintenance cost.

### Core Principle

Prioritize silent-failure and data-corruption risks above stylistic concerns.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:error-handling -->
## 2. ERROR HANDLING

Flag:
- Swallowed exceptions (`catch {}` or log-only catches).
- Overly broad exception handling hiding root causes.
- Missing async error propagation.
- User-facing leakage of internal stack traces.
- Missing fallback behavior for recoverable failures.

Review prompts:
- "Will callers know this failed?"
- "Is there enough context to debug without exposing internals?"
<!-- /ANCHOR:error-handling -->

---

<!-- ANCHOR:performance -->
## 3. PERFORMANCE AND SCALING

Flag:
- N+1 query patterns.
- Per-item network/database calls that should be batched.
- Expensive work in hot loops without memoization/cache.
- Synchronous blocking work in request paths.
- Unbounded collections and memory growth risks.

Review prompts:
- "How does this behave with 10x data volume?"
- "Can this call path be batched or cached safely?"
<!-- /ANCHOR:performance -->

---

<!-- ANCHOR:boundaries -->
## 4. BOUNDARY CONDITIONS

Check:
- Null/undefined handling and optional chaining misuse.
- Empty collection behavior for first/last/indexed access.
- Numeric boundaries (division by zero, overflow, negative values).
- String boundaries (empty, whitespace-only, very long input, unicode).
- Off-by-one errors in loops, pagination, and slicing.

Common risky patterns:

```javascript
const first = items[0]              // no empty check
const avg = total / count           // count may be zero
if (value) { /* skips valid 0 */ }  // truthy trap
```
<!-- /ANCHOR:boundaries -->

---

<!-- ANCHOR:maintainability -->
## 5. MAINTAINABILITY SIGNALS

Watch for:
- Repeated logic with inconsistent behavior.
- Magic literals where domain constants are expected.
- Overly nested control flow reducing readability.
- Hidden coupling through global/shared mutable state.
- Tests missing for newly introduced edge cases.

Decision cue: if reviewers cannot explain intent quickly, maintenance risk is likely at least P2.
<!-- /ANCHOR:maintainability -->

---

<!-- ANCHOR:kiss-dry -->
## 6. KISS / DRY ENFORCEMENT

### KISS Checks

Flag:
- New abstraction layers without a current behavior need.
- Generic helpers used in only one place.
- Workflow complexity introduced "for future flexibility" without evidence.

### DRY Checks

Flag:
- Duplicated constants/rules across modules.
- Copy-paste branches with minor name changes.
- Repeated validation/parsing blocks that can share one source.

Severity guidance:
- P2 default for stylistic duplication/complexity.
- Escalate to P1 if duplication or complexity introduces behavior/regression risk.
<!-- /ANCHOR:kiss-dry -->

---

<!-- ANCHOR:related-resources -->
## 7. RELATED RESOURCES

- [quick_reference.md](./quick_reference.md) - Baseline review flow and severity output contract.
- [security_checklist.md](./security_checklist.md) - Security, authz, abuse, and privacy risk checks.
- [solid_checklist.md](./solid_checklist.md) - SOLID (SRP/OCP/LSP/ISP/DIP) and architecture risk prompts.
- [removal_plan.md](./removal_plan.md) - Removal candidate classification and migration planning.

Overlay portability: pair this baseline with stack-specific quality guidance from `sk-code--opencode`, `sk-code--web`, or `sk-code--full-stack`.
<!-- /ANCHOR:related-resources -->
