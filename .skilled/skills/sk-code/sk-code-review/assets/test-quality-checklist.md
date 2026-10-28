---
title: Test Quality Checklist
description: Test adequacy, coverage quality, and anti-pattern detection checklist for identifying unreliable or misleading test suites.
trigger_phrases:
  - "test quality review checklist"
  - "tests that cannot fail"
  - "test smell detection"
  - "coverage quality assessment"
  - "test pyramid awareness"
importance_tier: normal
contextType: implementation
version: 1.5.1.0
---

# Test Quality Checklist

Test adequacy, coverage quality, and anti-pattern detection checklist for identifying unreliable or misleading test suites.

---

## 1. OVERVIEW

### Purpose

Provide a systematic pass for test defects that reduce confidence in code correctness or mask regressions.

### Usage

Apply when the diff changes tests; check each item against the test diff and flag false-confidence patterns that mask regressions.

### Core Principle

Tests that cannot fail are worse than no tests. They create false confidence and hide real defects.

### Rule Ids

Each section names its rule ids under its heading. A **floor** id is fixed: no repository or surface changes it. A **default lens** id is this mode's default, which a repository or surface may drop or replace with a `## Rule overrides` row. The items that make a test unable to fail are floor wherever they sit. [`review-core.md`](../references/review-core.md) section 8 lists every id and how an override reaches the review.

A test finding follows the reach rule in [`review-core.md`](../references/review-core.md) section 2 like any other: its reach is the changed behavior the test claims to cover. A test defect alone exploits nothing and destroys no data, so it is at most P1.

---

## 2. COVERAGE QUALITY

Rule: floor, `review.correctness-minimums`. The happy-path-only item carries `floor.boundary-tests`, the overridable universal rule.

Flag:
- Test functions that execute code paths without any assertions (assertion-free execution). This test cannot fail.
- `floor.boundary-tests`: test suites covering only happy-path scenarios with no error or edge case validation.
- Changed behavior that lacks a corresponding test update or addition.
- New public API surface introduced without any test coverage.
- Snapshot or golden-file tests that auto-pass because the baseline was never updated after behavior changes. This test cannot fail.

Review prompts:
- "Does every test function contain at least one meaningful assertion?"
- "Are failure modes and boundary conditions tested alongside the happy path?"
- "Do the tests cover the behavior that actually changed in this diff?"

Severity guidance:
- P1 for an assertion-free test function, a silently passing test that verifies nothing, when it is a test of behavior the change touches. P2 when it covers nothing the change reaches.
- P1 for changed behavior with no corresponding test update.
- P2 for missing edge case coverage on low-risk paths.

---

## 3. TEST STRUCTURE AND CLARITY

Rule: default lens. Each item names its own id, and each is a default a repository may change.

Flag:
- `review.test-aaa-layout`: by default, test functions missing clear Arrange/Act/Assert separation.
- `review.test-structure`: test names that do not describe the scenario or expected outcome.
- `review.test-magic-values`: by default, magic values in test data without comments explaining their significance.
- `review.test-single-concern`: by default, multiple unrelated assertions in a single test function.
- `review.test-structure`: test setup that obscures the behavior under test.

Review prompts:
- "Can a reader determine what this test validates from the name alone?"
- "Is the test data traceable to a specific requirement or edge case?"
- "Would a failure message from this test pinpoint the broken behavior?"

Severity guidance:
- P2 default for structural clarity issues.
- P1 if poor structure makes regression detection unreliable (for example, a multi-assertion test where early failures mask later ones).

---

## 4. TEST INDEPENDENCE AND RELIABILITY

Rule: floor, `review.correctness-minimums`.

Flag:
- Tests that depend on execution order or results from prior tests.
- Shared mutable state between test functions without proper reset.
- Tests that rely on wall-clock timing, network availability, or filesystem state.
- Missing cleanup or teardown for resources created during test setup.
- Tests that pass in isolation but fail when run with the full suite (or vice versa).

Review prompts:
- "Can each test run independently in any order and produce the same result?"
- "Does the test rely on external state that could change between runs?"
- "Is shared state properly isolated or reset between test functions?"

Severity guidance:
- P1 for flaky tests or tests with execution-order dependencies.
- P2 for missing teardown or cleanup that does not yet cause observed failures.

---

## 5. TEST SMELL DETECTION

Rule: default lens, `review.test-smells`, except the over-mocking and swallowed-assertion items, which make a test unable to fail and are floor, `review.correctness-minimums`.

Flag:
- Tests tightly coupled to implementation details (breaking on safe refactors).
- Floor: over-mocking that replaces the system under test with stubs, testing mock behavior instead of real behavior. This test cannot fail.
- Conditional logic (if/else, try/catch) inside test functions that creates untested branches.
- Floor: catch blocks inside tests that swallow assertion failures and convert them to passing results. This test cannot fail.
- Copy-paste duplication across test functions without shared helpers or parameterized tests.

Review prompts:
- "Would a safe refactor (rename, extract method) break this test without changing behavior?"
- "Is this test verifying real system behavior or just mock wiring?"
- "Does any catch block inside a test risk swallowing an assertion error?"

Severity guidance:
- P1 for catch blocks that swallow assertion failures (tests that cannot fail) in a test of behavior the change touches. P2 when that test covers nothing the change reaches.
- P1 for over-mocking that replaces the system under test, so the test cannot detect a real defect, in a test of behavior the change touches. P2 when that test covers nothing the change reaches.
- P2 for implementation coupling, conditional logic or copy-paste duplication.

---

## 6. TEST PYRAMID AWARENESS

Rule: default lens, `review.test-pyramid`. The levels below are a default a repository may change.

Flag:
- Unit tests that require database, network, or filesystem access (should be integration tests).
- End-to-end tests for logic that can be validated at the unit level.
- New external service calls or integrations introduced without integration test coverage.
- Test suite dominated by one level (all unit, all E2E) with no balance.

Review prompts:
- "Is this test at the right level of the test pyramid for what it validates?"
- "Does a new external dependency have at least one integration-level test?"
- "Could this slow integration test be replaced by a faster unit test?"

Severity guidance:
- P2 default for test-level misplacement.
- P1 when wrong test level creates a confidence gap (for example, unit-testing an integration boundary without any integration test).

---

## 7. RELATED RESOURCES

- [quick-reference.md](../references/quick-reference.md) - Baseline review flow and severity output contract.
- [code-quality-checklist.md](./code-quality-checklist.md) - Correctness, performance, KISS, and DRY checks.
- [security-checklist.md](./security-checklist.md) - Security, authz, abuse, and privacy risk checks.
- [solid-checklist.md](./solid-checklist.md) - SOLID (SRP/OCP/LSP/ISP/DIP) and architecture risk prompts.

Surface portability: pair this baseline with surface-specific test guidance from `sk-code`.
