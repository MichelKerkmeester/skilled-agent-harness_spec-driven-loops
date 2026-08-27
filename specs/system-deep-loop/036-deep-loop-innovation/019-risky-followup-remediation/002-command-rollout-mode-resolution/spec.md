---
title: "Feature Specification: Command Rollout-Mode Resolution"
description: "Resolve the render-command-contract + check-contract-drift failures: the deep/review, deep/research, deep/ai-council compiled contracts are stale, but recompiling them (the sanctioned fix) silently flips deep/review's rollout mode fix->fallback, breaking resolveMode. Decide the intended default mode, make the tests and config agree, then recompile."
trigger_phrases:
  - "command rollout mode resolution"
  - "stale source digest deep review"
  - "resolveMode fix fallback"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/019-risky-followup-remediation/002-command-rollout-mode-resolution"
    last_updated_at: "2026-08-26T15:40:00.000Z"
    last_updated_by: "claude"
    recent_action: "Kept rollout at fallback; corrected stale test; validate-rollout green"
    next_safe_action: "Re-verify whole suite (vitest + node:test); push correction to v4"
    blockers: []
    key_files:
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Intended default rollout mode for deep/* is 'fallback': fix requires an evidence object that does not exist (validate-rollout governance)."
---
# Feature Specification: Command Rollout-Mode Resolution

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-26 |
| **Decision** | Intended default mode = `fallback` (governance: `fix` requires evidence that does not exist; `bce47507b6d` demoted deliberately and added the validator) |
| **Failing tests** | `render-command-contract.vitest.ts`, `check-contract-drift.vitest.ts` — both now pass; `validate-rollout.test.cjs` kept green |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 001-dependency-and-node-abi-alignment |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The compiled command contracts for `deep/review`, `deep/research`, and `deep/ai-council` are stale — their source digest no longer matches the compiled artifact (`STALE_SOURCE_DIGEST`), so `check-contract-drift` fails. Separately, `render-command-contract` fails because `resolveMode('deep/review')` expected `fix` while the rollout config held `fallback`. Rollout mode is not cosmetic: it decides which body the command renders at runtime (the compiled `fix` contract vs the `fallback` legacy body).

The decisive governance constraint: a rollout entry set to `fix` MUST carry an evidence object (`captureManifest`, `fallbackHash`, `comparatorRuns`, `baselineDivergence`), enforced by `validate-rollout.cjs` and its node:test. `bce47507b6d` demoted these three entries to `fallback` **deliberately** — "demotes the four rollout entries that lacked their evidence mechanism and adds the validator that keeps them honest" — because the `fix` evidence never existed. A first attempt at this packet flipped the config back to a bare `"fix"` string; that reintroduced the exact violation the validator guards (a bare `fix` string is invalid) and broke `validate-rollout.test.cjs` — a node:test the vitest gate did not run. The correct, evidence-honest state is therefore `fallback`, and the stale expectation is `render-command-contract`'s assertion, not the config.

### Purpose

Keep the deep commands in the governance-intended `fallback` mode, recompile the contracts to clear the staleness, and correct the stale `render-command-contract` expectation to `fallback` so all four tests — `check-contract-drift`, `render-command-contract`, `legacy-projections`, and `validate-rollout` — pass without reintroducing a rollout-evidence violation.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Trace `resolveMode` in `scripts/render-command-contract.cjs` and what sets `fix` vs `fallback`.
- Determine, from the rollout config + git history + the renderer's intent, the correct default mode for `deep/review` / `deep/research` / `deep/ai-council`.
- Make the tests and the config/compiler agree (fix the compiler/config if `fix` is intended; update the stale test if `fallback` is intended).
- Recompile the deep/* contracts and clear the staleness.

### Out of Scope

- The dependency/Node-ABI failure (child 001).
- Redesigning the rollout-mode mechanism — only setting the correct default and removing the drift.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `shared/rollout/command-injection-rollout.json` | Keep `fallback` | The three deep entries stay `fallback` (governance-intended) |
| `tests/unit/render-command-contract.vitest.ts` | Modify | Update the stale `resolveMode('deep/review')` expectation from `fix` to `fallback` |
| `commands/deep/assets/compiled/deep-*.contract.md` | Modify | Recompiled contracts (via the sanctioned tool) to clear staleness |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The intended default rollout mode is decided with evidence | The decision is `fallback`, sourced to `validate-rollout.cjs` governance and `bce47507b6d`'s deliberate demotion. |
| REQ-002 | No rollout-evidence violation | `validate-rollout.test.cjs` passes; the config holds no bare `fix` string lacking its evidence object. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The stale contracts are cleared | `check-contract-drift` passes; no `STALE_SOURCE_DIGEST`. |
| REQ-004 | Tests and config agree on `fallback` | `render-command-contract` passes; `resolveMode('deep/review')` = `fallback`. |
| REQ-005 | No unintended runtime behavior change | `fallback` is the already-shipped mode, so the deep commands render exactly as before; only staleness and a stale test expectation change. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `render-command-contract.vitest.ts` and `check-contract-drift.vitest.ts` pass.
- **SC-002**: `resolveMode('deep/review')` = `fallback`; `validate-rollout.test.cjs` stays green.
- **SC-003**: Whole-suite delta vs the 017 baseline shows no new failures (vitest AND node:test).

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Promoting to `fix` without evidence | Reintroduces the rollout-evidence violation the validator guards | Keep `fallback`; a real `fix` promotion needs a genuine evidence object, not a bare string |
| Risk | Verifying with the wrong gate | A node:test regression (`validate-rollout`) passes the vitest-only gate | Run BOTH vitest and `run-node-tests.mjs` before completion |
| Dependency | `validate-rollout.cjs` + its node:test | Enforces the evidence rule | Verified present and kept green |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- `fix` vs `fallback` default — **RESOLVED: `fallback`.** Governance requires a `fix` entry to carry an evidence object (`validate-rollout.cjs`); that evidence never existed, so `bce47507b6d` deliberately demoted the entries and added the validator. Promoting to `fix` would need genuine evidence, which is out of scope. The contracts were recompiled to clear staleness and the stale `render-command-contract` expectation was corrected to `fallback`. (A first attempt wrongly flipped the config to a bare `fix` string; it was reverted after `validate-rollout.test.cjs` — a node:test — caught the violation.)

<!-- /ANCHOR:questions -->
