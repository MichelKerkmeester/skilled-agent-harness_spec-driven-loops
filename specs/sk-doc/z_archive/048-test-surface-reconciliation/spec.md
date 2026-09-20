---
title: "Feature Specification: Reconcile the test and fixture surfaces that had frozen against a tree that moved"
description: "Ninety-eight test failures across seven suites, almost none of them a code regression. Renamed packets, a renumbered runtime layout, a retired hub, a withdrawn mode and a kebab-case migration all landed without updating the tests and fixtures that named them, and two of the failures hid real production defects."
trigger_phrases:
  - "stale test expectation after a rename"
  - "fixture minted against a retired hub"
  - "frozen scorer digest re-pin"
  - "playbook loader sees no scenarios"
  - "benchmark suite failing on moved paths"
importance_tier: "high"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Reconcile the test and fixture surfaces that had frozen against a tree that moved

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-09-01 |
| **Branch** | `skilled/v4.0.0.0` (no branch created for this packet) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Seven test suites were carrying failures, and running them together made the shape obvious.
Mode packets were renamed from `code-` to `sk-code-`. The compiled runtime layout was
renumbered. The sk-design hub was retired and its interface mode deleted. A deep-alignment
mode was withdrawn. Filenames moved from snake_case to kebab-case. Each landed as a
deliberate change, and each left behind tests, fixtures and pinned digests that still named
the old shape. The failures then read as noise, which is the worst outcome: two of them were
real production defects hiding in the middle of the stale ones.

### Purpose

A failing test means something is broken, and the suites say so honestly again.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The deep-improvement benchmark suite, its model-benchmark sibling and their fixtures.
- The spec-kit validation suite and every fixture under its test-fixtures tree.
- The advisor regression gate and the phrase anchors behind it.
- The five per-hub canary validators and their pinned digests.
- The deep-loop runtime and ai-council suites.
- The sk-communication projection suite and the plugin suite.
- The Python suites, including one that could not be collected at all.
- The playbook loader, which cannot see eleven playbooks' scenarios.

### Out of Scope

- Authoring new scenarios for a skill that turns out to be thinly covered. Coverage is a
  separate question from whether the harness can read what is already there.
- The compiled-routing serving repair, which is its own packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/**` | Modify | Stale paths, retired subjects, one real loader defect |
| `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py` | Modify | Three phrase anchors below the routing floor |
| `.opencode/skills/system-spec-kit/scripts/test-fixtures/**` | Modify | Fingerprints attesting a document set that had changed |
| `specs/.../009-parent-hub-rollout/*/harness/validate-canary.cjs` | Modify | Digests, literals and falsifiers that had rotted |
| `.opencode/skills/mcp-tooling/ROUTER.md`, `.opencode/skills/sk-code/ROUTER.md` | Modify | Stage-two routing a mode never received |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every suite in scope reports zero failures, or a failure that is named and explained |
| REQ-002 | No assertion is weakened, skipped or deleted to reach green |
| REQ-003 | Each stale pin is re-pinned with a comment saying what it attests and what refreshes it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Where a test's subject was withdrawn, the test is retargeted at something still real rather than deleted |
| REQ-005 | Real production defects found among the stale failures are fixed, not just noted |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The deep-improvement benchmark suite runs 53 files and 673 tests with none failing
- **SC-002**: The spec-kit validation suite reports 83 passed and 0 failed
- **SC-003**: The advisor regression gate reports every case passing with `overall_pass` true
- **SC-004**: All five per-hub canary validators exit zero
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A stale expectation and a real regression look identical from the outside | High | Every fix states which side was wrong and the evidence that settled it |
| Risk | Re-pinning a digest can mask the drift the pin exists to catch | High | Each re-pin is preceded by a red run proving the pin still bites, and carries a comment naming what refreshes it |
| Risk | Making previously-invisible scenarios visible changes eleven skills' verdicts | Medium | Blast radius measured per skill before and after, and reported rather than absorbed |
| Dependency | The compiled-routing repair in the sibling packet | Several suites read the promoted mirror | That packet landed first, and its gates were green before this work began |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The deep-improvement suite stays under a minute, so it can gate a commit
- **NFR-P02**: A timing-sensitive test is judged over repeated runs, never a single sample

### Security
- **NFR-S01**: No fix widens a path, sandbox or permission boundary to make a test pass
- **NFR-S02**: The restored on-disk resolution keeps every authored path inside its skill root

### Reliability
- **NFR-R01**: A pin that goes stale reports which file drifted, not merely that something did
- **NFR-R02**: A withdrawn mode retires its fixture cases rather than leaving them failing
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A playbook with exactly one scenario: an honest count, not a degraded parse
- A playbook whose index table uses a different column order: currently invisible, which is the defect
- A fixture carrying no gold: loads as a scenario with its gold state recorded, rather than being skipped

### Error Scenarios
- A frozen scorer edited without re-pinning: the parity gate aborts before writing a report
- A hub source edited without refreshing its canary digests: the canary reports the hub's own edits as corruption
- A test whose subject was deleted: crashes on an undefined lookup rather than failing cleanly

### State Transitions
- A suite that could not be collected at all hides every assertion inside it
- A rebuild that promotes an authored source silently erases anything added only to the mirror
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 22/25 | Seven suites, five canary packets, dozens of fixtures |
| Risk | 15/25 | Mostly test-side, but two production defects and one live routing change |
| Research | 18/20 | Each failure needed history read to tell a stale expectation from a regression |
| **Total** | **55/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

None outstanding. The one genuine fork, whether the documented-compliant validation fixtures
should validate cleanly or stay as negative fixtures, was resolved by observing that every
signal they deliberately carry is a warning rather than an error, so clearing their errors
costs no coverage.
<!-- /ANCHOR:questions -->

---
