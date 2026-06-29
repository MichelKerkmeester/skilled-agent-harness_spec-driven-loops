---
title: "Feature Specification: D5-R7 — Static design-proof-token lint plus route-replay and negative-control fixtures"
description: "The D5 cross-CLI claims rest on a test gate that has no fixture proving a design-proof token survives a dispatch boundary with its shape intact; without one, manifest presence and routing are claims, not facts, and a checker that passes everything can mask a regression."
trigger_phrases:
  - "d5-r7 token lint route replay fixtures"
  - "design routing fixtures design build"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/007-token-lint-route-replay-fixtures"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2 contract; mark phase complete"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs"
      - ".opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r7-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: D5-R7 — Static design-proof-token lint plus route-replay and negative-control fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `007-token-lint-route-replay-fixtures` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The other D5 cross-CLI phases are only as trustworthy as their test gate. Without a fixture that replays a design dispatch and inspects the carried token, manifest presence and routing are claims, not facts: nothing proves a design-proof token survives a dispatch boundary with its shape intact, and a stripped or weakened token could slip through unnoticed. A checker that passed everything would also mask a regression, so the gate needs a negative control that must fail closed.

### Purpose
Add a static design-proof-token lint plus route-replay and negative-control fixtures under the existing skill-benchmark harness. A faithful token that carries the manifest files lints clean and the prompt routes to the `sk-design` lane; a stripped or weakened token is caught and fails closed even when the route is correct; a neither-loaded control routes nowhere and fails the lint. The work is strictly additive: the new fixtures live in a sibling corpus directory so the gated sk-design hub route headline (13 pass / 5 known-gap / 0 regression) stays byte-stable, and no existing checker is edited.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author `design-token-lint.cjs`: a pure `lintDesignToken(payload)` returning `{ verdict, findings }` over the static `DESIGN_PROOF_TOKEN v1` presence/shape rules (§2/§6/§7), plus a thin `--file` CLI.
- Author three sibling fixture pairs (`faithful-001`, `stripped-001`, `neither-001`) under `fixtures/sk-design-dispatch/`, each a `.public.json` + `.private.json`.
- Author a vitest hook that replays route + lint over the new corpus and guards the existing 18-pair corpus headline.

### Out of Scope
- A live freshness, nonce-consumption, payload-recomputation, or file-re-hashing check — those belong to a live boundary-side validator.
- Any edit to `score-skill-benchmark.cjs`, `router-replay.cjs`, the gated `fixtures/sk-design/` corpus, the `DESIGN_PROOF_TOKEN v1` contract, or any live `sk-design`/cli-* skill file.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs` | Created | `lintDesignToken(payload)` static v1 shape lint plus a thin `--file` CLI (exit 0 valid / 1 rejected / 2 usage) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/*.json` | Created | Three public/private fixture pairs: faithful (valid), stripped (rejected `single-use-not-true`), neither-loaded control (rejected `missing-token`) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/design-token-lint.vitest.ts` | Created | Route-replay + lint assertions + the no-regression guard on the existing corpus |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Static token lint catches a stripped/weakened token | `lintDesignToken(stripped)` returns `verdict: rejected` with the `single-use-not-true` finding; fails closed |
| REQ-002 | Faithful token lints clean and routes to design | `lintDesignToken(faithful)` returns `verdict: valid` (0 findings) AND the prompt routes to the `sk-design`/interface lane |
| REQ-003 | Neither-loaded negative control fails closed | the control routes nowhere (`intents == []`, default applied) AND `lintDesignToken` returns `rejected` with `missing-token` |
| REQ-004 | No-regression on the gated corpus | `git` shows only new files; the hubRoute scorer stays 13 pass / 5 known-gap / 0 regression with `gate.hubRoute.failed == false` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `node --check` passes and the vitest hook passes | `node --check design-token-lint.cjs` exits 0; the route-replay + lint assertions pass |
| REQ-006 | Faithful fixture carries the manifest tokens | `loadedFiles` includes `SKILL.md`, `context_loading_contract.md`, `register.md`, `proof_of_application_card.md` |
| REQ-007 | New artifacts confined to a sibling corpus | the new fixtures live in `fixtures/sk-design-dispatch/`; the gated `fixtures/sk-design/` corpus is byte-identical |
| REQ-008 | Deliverable is evergreen | no spec path / packet / phase / ADR / REQ / task / finding ID in the fixtures or `.cjs`/test code |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A dispatched design-proof token survives transport with its shape intact under replay: a faithful token lints `valid` and routes to `sk-design`, a stripped/weakened token is rejected and fails closed even when the route is correct, and a missing token fails closed on the neither-loaded control.
- **SC-002**: The lint is honestly framed as static shape/presence only (not a live freshness check), and the new corpus is additive so the gated sk-design hub route headline stays byte-stable at 13 pass / 5 known-gap / 0 regression.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A static shape lint could be over-claimed as live freshness enforcement | Claiming a time-window or replay-consumption guarantee from a presence/shape test would be dishonest | Scope the lint to §2/§6/§7 presence and shape only; name freshness, nonce consumption, payload recomputation, and file re-hashing as the live-validator boundary, out of scope |
| Risk | New fixtures could shift the gated hubRoute headline | A moved 13/5/0 headline would read as a regression in the gated corpus | Keep the new fixtures in a sibling `fixtures/sk-design-dispatch/` directory; the gated scorer reads `fixtures/sk-design/`, which stays byte-identical |
| Risk | Editing `score-skill-benchmark.cjs` or `router-replay.cjs` could couple the new corpus to the gate | An edit to the shared scorer could break the existing suite | Add only new files; reuse `routeSkillResources`, `scoreScenario`, and `aggregate` exports as-is |
| Risk (residual, advisory) | Routing-correct but token-weakened dispatch | A prompt can route to `sk-design` while carrying a stripped token | The stripped fixture proves the lint rejects on a weakened `singleUse` independent of the route, so routing alone never certifies the token |
| Dependency | `router-replay.cjs` (`routeSkillResources`) | Reused | Green — drives the route-replay assertions, unchanged |
| Dependency | `score-skill-benchmark.cjs` (`scoreScenario`/`aggregate`) | Reused | Green — re-scores the existing corpus for the no-regression guard, unchanged |
| Dependency | `DESIGN_PROOF_TOKEN v1` contract | Consumed | Green — the source of the §2/§6/§7 lint rules, read-only |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The lint is a pure function with a thin CLI that reuses `_args.cjs`, so it adds no new argument-parsing surface and mirrors the existing checker shape.
- **NFR-M02**: The deliverable is evergreen — no ephemeral artifact IDs — so the fixtures and module survive corpus reorganization.

### Safety
- **NFR-S01**: The lint fails closed: any missing required field, malformed digest, downgraded `singleUse`, bad timestamp, empty `loadedFiles`/`workflowModes`, or absent token yields `rejected`. A `valid` verdict requires zero findings.
- **NFR-S02**: The change is reversible by deleting the new files; the gated corpus and scorer are untouched, so removal restores the prior state with no migration.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Weakened token, correct route
- The prompt routes to `sk-design` but the token has `singleUse` downgraded: the lint returns `rejected` with `single-use-not-true`. Routing never certifies the token.

### No token at all
- The neither-loaded control carries a non-design prompt and no payload: the route resolves no design intent (default applied) and the lint returns `rejected` with `missing-token`. The gate has a guaranteed failure path.

### Live freshness (out-of-scope boundary)
- A token whose `expiresAt` has passed in real time still lints `valid` if its shape is intact: the static lint does not check the clock. Live time-window and nonce-consumption checks belong to a boundary-side validator and are named out of scope.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One lint module + thin CLI, three fixture pairs, one vitest hook; no edits to shared checkers |
| Risk | 10/25 | Additive only; main risk is the honest static-vs-live framing and keeping the gated headline byte-stable |
| Research | 7/20 | Consumes the `DESIGN_PROOF_TOKEN v1` §2/§6/§7 rules and the existing router-replay/scorer seams |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None outstanding. Two scope boundaries are recorded as decisions, not open defects: (1) the lint is **static** §2/§6/§7 presence/shape only — live freshness, nonce consumption, payload recomputation, and file re-hashing are the live-validator boundary and stay out of scope; (2) the new fixtures live in a **sibling** `fixtures/sk-design-dispatch/` corpus so the gated sk-design hub route headline (13 pass / 5 known-gap / 0 regression) stays byte-stable. Wiring token-lint findings into the gate weighting through the existing `aggregate({ lintFindings })` seam is deferred as optional and was left disabled.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
