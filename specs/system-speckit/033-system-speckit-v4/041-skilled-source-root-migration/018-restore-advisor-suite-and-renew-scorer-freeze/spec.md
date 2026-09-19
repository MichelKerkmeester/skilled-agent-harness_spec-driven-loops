---
title: "Feature Specification: Phase 18: restore-advisor-suite-and-renew-scorer-freeze"
description: "Return the advisor test suite to green by fixing what moved it, stop a test rewriting a tracked fixture, and renew the compiled-routing scorer freeze once the routing battery passes."
trigger_phrases:
  - "advisor suite restore"
  - "scorer freeze renewal"
  - "advisor plugin cache regression"
  - "python ts parity drop"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 18: restore-advisor-suite-and-renew-scorer-freeze

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-19 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 18 |
| **Predecessor** | 017-build-compiled-serving-gold-admission-checker |
| **Successor** | None |
| **Handoff Criteria** | The advisor's plugin and parity suites pass, no test rewrites a tracked file, and the scorer freeze matches the scorer |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the skilled source-root migration specification.

**Scope Boundary**: The advisor suite failures phase 17 found and the operator chose on 2026-09-19 to fix here, and the scorer freeze they gated. The three CLI job tests that fail only under the full parallel run are recorded, not changed.

**Dependencies**:
- Phase 17 found the failures and left the freeze stale on purpose.

**Deliverables**:
- A plugin that caches for any workspace inside a checkout.
- Parity restored, and one ledger entry re-approved.
- A test fixture that test runs no longer rewrite.
- A renewed scorer freeze.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor suite had 13 failures and nothing in CI runs it. Eight plugin cache tests broke in phase 12 (`63ad140f9b`): the plugin looks for a source root directly under its workspace, so a workspace inside the checkout but below its root never caches, and every prompt spawns the advisor again. The Python reference lost one correct decision (109 to 108) and the local-versus-native ledger recorded a changed divergence. A scorer test rewrote a tracked embeddings fixture on every run. And the compiled-routing scorer freeze could not be renewed, because its rule requires a green routing battery.

### Purpose
The advisor suite passes, runs leave the tree clean, and the scorer freeze is current.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The plugin's source-root lookup, with a test for a nested workspace and one outside any checkout, and the same lookup in three other plugins' log helpers.
- The cause of the Python parity drop, and its fix.
- The changed ledger divergence, reviewed and re-approved.
- The embeddings fixture write.
- Renewing the scorer freeze, and the knock-on re-mint and contract recompiles.

### Out of Scope
- The three CLI job tests that fail only in the full parallel run - they pass alone and predate this work.
- The runtime-engine harness's remaining failures - recorded for their own change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/system-skill-advisor.js` | Modify | Find the source root from the repository root |
| `.skilled/skills/system-skill-advisor/runtime/tests/system-skill-advisor-plugin.vitest.ts` | Modify | Nested and outside-checkout workspaces |
| `.opencode/plugins/mcp-route-guard.js`, `system-dist-freshness-guard.js`, `sk-code-post-edit-quality.js`, `tests/mcp-route-guard.test.cjs` | Modify | Log under the checkout's source root from a nested project |
| `.skilled/skills/system-deep-loop/SKILL.md` | Modify | Drop the `iteration-history` keyword |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modify | Re-approve one entry |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/fixtures/seed-skill-embeddings.ts`, `README.md` | Modify | Write the cache only on request |
| `specs/sk-doc/019-skill-routing-refactor/015-router-unification-program/shared/frozen-scorer-pins.json` | Modify | Renewed freeze |
| system-deep-loop activation manifests and three deep command contracts | Regenerate | Follow the `SKILL.md` change |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The plugin caches for a workspace anywhere inside a checkout and never for one outside, each proven by a test that fails without the fix. |
| REQ-002 | The parity suites pass without lowering a pinned count. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A test run leaves every tracked file unchanged. |
| REQ-004 | The scorer freeze matches the scorer, renewed only after the routing battery passes. |
| REQ-005 | Every manifest and command contract that digests the changed `SKILL.md` is current. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The advisor suite fails only the three load-sensitive CLI job tests, which pass alone.
- **SC-002**: `frozen-scorer-contract.cjs` reports that the scorer matches its pins.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Dropping a keyword re-breaks the ratchet the keyword was added for | High | The CI ratchet `scorer-eval-baseline-ratchet` runs on both variants before the change |
| Risk | A `SKILL.md` change leaves a manifest or contract stale | Med | The route guard and contract drift check run after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The plugin caches again for nested workspaces, so a repeated prompt no longer spawns the advisor.

### Security
- **NFR-S01**: No private home-derived path in any tracked file.

### Reliability
- **NFR-R01**: A workspace with no source root is never cached.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A workspace outside any checkout: signature refused, no caching.

### Error Scenarios
- No embedding provider: the seeding helper still skips, as before.

### State Transitions
- Renewing the freeze with red parity would pin an unverified scorer; the renewal waits for green.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Five source files, fixtures, regenerated artifacts |
| Risk | 10/25 | Routing metadata and a caching path |
| Research | 10/20 | A bisection to find the parity cause |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None for this phase. The runtime-engine harness findings in `implementation-summary.md` need their own decision.
<!-- /ANCHOR:questions -->

---
