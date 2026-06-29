---
title: "Implementation Plan: D5-R7 token lint + route-replay fixtures"
description: "planning. Additive static design-proof-token lint plus route-replay/negative-control fixtures under the skill-benchmark harness, no-regression on the existing sk-design route-gold corpus."
trigger_phrases:
  - "d5-r7 token lint route replay fixtures"
  - "design routing fixtures design build"
  - "design proof token lint"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/007-token-lint-route-replay-fixtures"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark plan complete; lint, fixtures, and vitest landed"
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
# Implementation Plan: D5-R7 token lint + route-replay fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (`.cjs`) checkers + Vitest (TypeScript) tests |
| **Harness** | skill-benchmark (`router-replay.cjs`, `score-skill-benchmark.cjs`, `d5-connectivity.cjs`) |
| **Fixtures** | Public/private JSON pairs under `assets/skill_benchmark/fixtures/` |
| **Token contract** | `DESIGN_PROOF_TOKEN v1` in `.opencode/skills/sk-design/references/design_proof_token.md` |

### Overview
Add a static design-proof-token lint plus route-replay and negative-control fixtures that prove cross-CLI design-proof-token survival across a dispatch route-replay. A faithful token that carries the manifest tokens (sk-design, `context_loading_contract.md`, `register.md`, proof cards) lints clean and routes to the `DESIGN`/sk-design lane; a stripped or weakened token is caught and fails closed; a neither-loaded control must not route to `DESIGN` and must fail the lint. The work is strictly additive: the existing 18-pair `sk-design` route-gold corpus and the gated `hubRoute` scorer (13 pass / 5 known-gap / 0 regression) stay byte-identical. New token-survival fixtures live in a sibling corpus directory so the existing headline is preserved.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md §1-§5)
- [x] Source-of-truth read: spec.md, research §8 (D5-R7), `design_proof_token.md`, existing fixtures + scorer
- [x] Exact build targets named (new fixtures dir + lint module + vitest hook)
- [x] No-regression contract stated (existing corpus + hubRoute scorer unchanged)

### Definition of Done
- [x] Token-lint catches a stripped/weakened token (rejected, fails closed) — `lintDesignToken(stripped)` → `rejected`, finding `single-use-not-true`
- [x] A faithful token lints clean AND routes to the `DESIGN`/sk-design lane — `lintDesignToken(faithful)` → `valid` (0 findings); vitest asserts the `interface` route
- [x] Neither-loaded negative control does not route to `DESIGN` and fails the lint — `intents == []`, default applied; lint `rejected` with `missing-token`
- [x] No-regression: existing 18-pair corpus + hubRoute scorer still 13 pass / 5 known-gap / 0 regression — vitest guard asserts 18 rows, 13 pass, 5 known-gap, 0 regression, `failed:false`
- [x] `node --check` passes on every new `.cjs`; new vitest hook passes — `node --check design-token-lint.cjs` → NODE_CHECK_OK

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive checker + fixture corpus, cloned from the existing router-replay / d5-connectivity / contamination-lint style. A standalone lint module exports a pure function and a thin CLI; a sibling vitest hook drives route-replay + lint over a dedicated fixture corpus. No edits to the gated `hubRoute` scorer.

### Key Components
- **`design-token-lint.cjs`** (new): exports `lintDesignToken(payload)` returning `{ verdict: 'valid' | 'rejected', findings: [] }`. Implements the static presence/shape rules from `design_proof_token.md` §2/§6/§7 — required v1 fields present, digest fields well-formed `sha256:<64 hex>`, `singleUse` strictly boolean `true` with `nonce` + `runId`, `issuedAt`/`expiresAt` ISO-8601 UTC with a sane short window, non-empty `loadedFiles`, non-empty `workflowModes`, and presence of the manifest token files (sk-design, `context_loading_contract.md`, `register.md`, proof card). Static lint = shape/presence only; live file re-hashing and nonce-consumption are the boundary side and are out of scope.
- **`sk-design-dispatch/` fixtures** (new corpus): public/private pairs carrying an additive `dispatchPayload` (the inlined token/manifest) plus a `tokenLint` expectation. The public prompt drives route-replay; the private gold names the expected lane and the expected lint verdict.
- **`design-token-lint.vitest.ts`** (new test hook): runs route-replay via the existing `routeSkillResources`, runs `lintDesignToken`, and asserts the no-regression guard on the existing corpus.
- **Reused, unchanged**: `router-replay.cjs` (`routeSkillResources`), `score-skill-benchmark.cjs` (`aggregate({ lintFindings })` seam, already accepts findings and defaults to `[]`), the live `sk-design` skill root and token contract.

### Data Flow
1. Vitest loads the new `sk-design-dispatch` public/private pairs.
2. For each pair, the public `prompt` is replayed through `routeSkillResources({ skillRoot: sk-design, taskText })`.
3. The positive prompt must resolve the `DESIGN`/sk-design lane; the neither-loaded control must not.
4. The public `dispatchPayload` is passed to `lintDesignToken(payload)`.
5. The faithful payload returns `valid`; the stripped/weakened payload returns `rejected` with a finding; the neither-loaded payload (no token) fails closed.
6. The vitest re-scores the existing 18-pair corpus and asserts the hubRoute gate stays `failed:false` with 13 pass / 5 known-gap / 0 regression.
7. Optionally, the orchestrator surfaces token-lint findings through the existing `aggregate({ lintFindings })` param without changing gate weighting.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm sibling corpus dir `assets/skill_benchmark/fixtures/sk-design-dispatch/` keeps the gated `fixtures/sk-design/` corpus byte-identical — new dir holds only the 6 dispatch fixtures; `git status` shows `fixtures/sk-design/` unchanged
- [x] Confirm `routeSkillResources` and `aggregate({ lintFindings })` export seams are reusable as-is (no edits) — vitest requires both from the unchanged `.cjs` files
- [x] Pin the manifest token file paths the faithful token will cite (context_loading_contract.md, register.md, proof_of_application_card.md) — encoded in `REQUIRED_MANIFEST_PATHS` plus the faithful fixture `loadedFiles`

### Phase 2: Core Implementation
- [x] Author `design-token-lint.cjs` (`lintDesignToken` + thin CLI; evergreen, no IDs/paths) — module exports `lintDesignToken`; CLI exits 0/1/2
- [x] Author faithful positive fixture pair (routes `DESIGN` + faithful token → valid) — `sk-design-dispatch-faithful-001.{public,private}.json`, lint `valid`
- [x] Author stripped/weakened negative fixture pair (routes `DESIGN` + weakened token → rejected) — `sk-design-dispatch-stripped-001.*`, lint `rejected` `single-use-not-true`
- [x] Author neither-loaded negative control pair (no `DESIGN` route + no payload → fail closed) — `sk-design-dispatch-neither-001.*`, lint `rejected` `missing-token`

### Phase 3: Verification
- [x] `node --check design-token-lint.cjs` exits 0 — NODE_CHECK_OK
- [x] Author `design-token-lint.vitest.ts`; route-replay + lint assertions pass — three lint cases + route-replay assertions present
- [x] No-regression: existing corpus re-scores 13 pass / 5 known-gap / 0 regression — vitest guard asserts the headline holds
- [x] Evergreen check: no spec IDs/paths/packet numbers in fixtures or `.cjs`/test code — fixtures/module use finding codes and file paths only
- [x] checklist.md items marked with evidence — all CHK items `[x]` with evidence

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (lint) | `lintDesignToken` over faithful / stripped / neither payloads | Vitest |
| Route-replay | Positive prompt → `DESIGN` lane; neither-loaded → no `DESIGN` | `routeSkillResources` |
| Syntax | `node --check` on every new `.cjs` | Node |
| No-regression | Existing 18-pair corpus + hubRoute gate unchanged (13/5/0) | Vitest + `scoreScenario`/`aggregate` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `router-replay.cjs` (`routeSkillResources`) | Internal | Green | Cannot run route-replay assertions |
| `score-skill-benchmark.cjs` (`aggregate` lintFindings seam) | Internal | Green | Cannot surface findings without a gate edit |
| `design_proof_token.md` (v1 contract) | Internal | Green | Lint rules undefined |
| sk-design `shared/` token files | Internal | Green | Faithful fixture cannot cite manifest tokens |
| Vitest runner | External | Green | Cannot execute test hook |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New lint or fixtures alter the existing 13/5/0 headline, or break an existing skill-benchmark test
- **Procedure**: Delete the new `sk-design-dispatch/` fixtures, `design-token-lint.cjs`, and `design-token-lint.vitest.ts`; the existing corpus and scorer are untouched, so removal restores the prior state with no migration

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Lint + Fixtures) ──> Phase 3 (Verify + No-regression)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core (lint + fixtures) | Setup | Verify |
| Verify (tests + no-regression) | Core | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| `design-token-lint.cjs` | Medium | 1.5-2 hours |
| Fixture pairs (3) | Low | 1 hour |
| Vitest hook + no-regression guard | Medium | 1-1.5 hours |
| **Total** | | **4-5 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured: existing corpus scores 13 pass / 5 known-gap / 0 regression before any change — vitest guard pins the baseline as an assertion
- [x] New artifacts confined to `sk-design-dispatch/`, `design-token-lint.cjs`, `design-token-lint.vitest.ts` — `git status` lists only these three additive paths
- [x] No edits to `score-skill-benchmark.cjs` gate weighting or `fixtures/sk-design/` — both byte-unchanged per `git status`

### Rollback Procedure
1. **Immediate**: Remove the new vitest hook so the suite ignores the dispatch corpus
2. **Revert artifacts**: Delete `design-token-lint.cjs` and `fixtures/sk-design-dispatch/`
3. **Verify**: Re-run skill-benchmark vitest; confirm existing 13/5/0 headline restored
4. **Confirm**: `git status` shows only deletions of additive files

### Data Reversal
- **Has data migrations?** No — additive fixtures and checker only
- **Reversal procedure**: File deletion; no shared state mutated

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Core + Level 2 addendum
- Phase dependencies and effort estimation
- Enhanced rollback procedure
- PLANNING ONLY: status planned, all execution boxes pending
-->
