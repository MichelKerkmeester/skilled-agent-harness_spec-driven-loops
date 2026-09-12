---
title: "Implementation Plan: A successful advisor call with nothing to recommend reported itself as an outage"
description: "Split one diagnostics branch in two, keep the outage wording untouched, and prove the new test fails against the old behaviour before trusting it."
trigger_phrases:
  - "no match diagnostic plan"
  - "diagnostics branch split"
  - "negative control for a diagnostic fix"
  - "advisor test seam export"
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: A successful advisor call with nothing to recommend reported itself as an outage

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript hook library compiled into the advisor's served build |
| **Framework** | The advisor's CLI fallback, which every runtime's prompt hook reaches |
| **Storage** | None |
| **Testing** | A unit test over the pure result builder, plus the real hook against three prompt kinds |

### Overview

One conditional produced the wrong answer for half the cases reaching it. The fix adds the missing branch and leaves the other half alone. The work that earns confidence is not the edit, it is the negative control.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

The result builder is a pure function of the CLI's response. That is what makes a hermetic test possible here, and why the seam is an export rather than a daemon fixture. This package already has one daemon-dependent suite that passes alone and fails inside a full run, which is the outcome to avoid.

### Key Components
- **The status resolver**: returns `skipped` for both an empty result and an unreachable advisor, which is correct and unchanged
- **The diagnostics branch**: previously described both as an outage, and is where the fix lives
- **The envelope reason**: a free-form string, so the honest value needed no type change

### Data Flow

The CLI answers, the builder turns that response into a hook result, and the diagnostics it attaches are the only explanation a reader ever sees for a missing brief.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

A diagnostic message is exactly the kind of change that passes a test written after the fact, because the test is written against what the code now does. So the test was run against the old branch as well, where it fails, and the restored branch, where it passes. Alongside that, the real hook was exercised with three prompts: two that route and one that does not.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The advisor's compiled build, since the hooks are served from it rather than from source.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the two files and rebuild. No state, no migration, and the routing behaviour is untouched either way.
<!-- /ANCHOR:rollback -->

---
