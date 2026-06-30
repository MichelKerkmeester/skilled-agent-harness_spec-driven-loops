---
title: "Verification Checklist: D5-R7 token lint + route-replay fixtures"
description: "Priority-tagged verification checklist for the additive design-proof-token lint and route-replay/negative-control fixtures, including fix-completeness."
trigger_phrases:
  - "d5-r7 checklist"
  - "design token lint checklist"
  - "route replay fixtures checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/007-token-lint-route-replay-fixtures"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify all P0/P1 checks with lint output and git evidence"
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
# Verification Checklist: D5-R7 token lint + route-replay fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: spec.md §2-§5 (PROBLEM/SCOPE/REQUIREMENTS/SUCCESS CRITERIA), REQ-001..008
- [x] CHK-002 [P0] Technical approach defined in plan.md (lint module + sibling fixture corpus + vitest hook)
  - **Evidence**: plan.md §3 ARCHITECTURE + §4 phases
- [x] CHK-003 [P1] Exact targets named (new fixtures dir, `design-token-lint.cjs`, `design-token-lint.vitest.ts`)
  - **Evidence**: all three present as new untracked files per `git status`
- [x] CHK-004 [P1] v1 lint rules sourced from `design_proof_token.md` §2/§6/§7
  - **Evidence**: `REQUIRED_FIELDS`, `REQUIRED_DIGEST_FIELDS`, `DIGEST_RE`, `ISO_UTC_RE`, `REQUIRED_MANIFEST_PATHS` in `design-token-lint.cjs`

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` passes on `design-token-lint.cjs`
  - **Evidence**: `node --check design-token-lint.cjs` → NODE_CHECK_OK (exit 0)
- [x] CHK-011 [P1] `lintDesignToken` is a pure function returning `{ verdict, findings }`; CLI mirrors existing checker shape
  - **Evidence**: `module.exports = { lintDesignToken }`; `require.main` CLI uses `_args.cjs`, exits 0/1/2
- [x] CHK-012 [P1] No edits to `score-skill-benchmark.cjs` or `router-replay.cjs` (reuse exports only)
  - **Evidence**: `git status` shows neither modified; vitest requires both from the unchanged files
- [x] CHK-013 [P0] Evergreen: no spec IDs, packet numbers, or spec-folder paths in fixtures or `.cjs`/test code
  - **Evidence**: fixtures and module use finding codes and skill file paths only; no spec/packet/phase IDs

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Faithful token lints clean (`valid`) AND positive prompt routes to the `DESIGN`/sk-design lane
  - **Evidence**: `lintDesignToken(faithful.public)` → `valid` (0 findings); vitest asserts the `interface` route + `design-interface/SKILL.md`
- [x] CHK-021 [P0] Stripped/weakened token is caught (`rejected`, fails closed) with the expected finding
  - **Evidence**: `lintDesignToken(stripped.public)` → `rejected`, finding `single-use-not-true`; CLI exit 1
- [x] CHK-022 [P1] Neither-loaded negative control does not route to `DESIGN` and fails the lint
  - **Evidence**: route `intents == []`, `defaultApplied == true`; `lintDesignToken(neither.public)` → `rejected`, `missing-token`
- [x] CHK-023 [P1] Faithful fixture carries the manifest tokens (sk-design, context_loading_contract.md, register.md, proof card)
  - **Evidence**: faithful `loadedFiles` lists `SKILL.md`, `context_loading_contract.md`, `register.md`, `proof_of_application_card.md`

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:no-regression -->
## No-Regression

- [x] CHK-030 [P0] Existing 18-pair `fixtures/sk-design/` corpus unchanged (byte-identical)
  - **Evidence**: `git status` shows only new untracked files; `fixtures/sk-design/` not modified
- [x] CHK-031 [P0] hubRoute scorer still reports 13 pass / 5 known-gap / 0 regression (gate `failed:false`)
  - **Evidence**: vitest guard asserts 18 route rows, 13 pass, `knownGaps:5`, `regressions:0`, `failed:false`
- [x] CHK-032 [P1] New fixtures additive in `sk-design-dispatch/`; ignored by the gated hubRoute corpus count
  - **Evidence**: guard loads `fixtures/sk-design/` only; new pairs live in the sibling `fixtures/sk-design-dispatch/`

<!-- /ANCHOR:no-regression -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-040 [P0] Acceptance fully met: lint catches stripped/weakened token; faithful token + route passes; no-regression holds
  - **Evidence**: faithful `valid`, stripped `rejected single-use-not-true`, neither `rejected missing-token`; hubRoute headline guarded at 13/5/0
- [x] CHK-041 [P1] All three fixture intents present (faithful, stripped, neither-loaded) — no partial corpus
  - **Evidence**: six files in `fixtures/sk-design-dispatch/` — faithful/stripped/neither, each `.public.json` + `.private.json`
- [x] CHK-042 [P1] Vitest hook wired into the existing skill-benchmark test surface; passes locally
  - **Evidence**: `tests/design-token-lint.vitest.ts` requires `router-replay.cjs`, `score-skill-benchmark.cjs`, `design-token-lint.cjs` from the existing harness
- [ ] CHK-043 [P2] Optional: token-lint findings surfaced via `aggregate({ lintFindings })` without changing gate weighting
  - **Evidence**: DEFERRED (P2, optional by design) — the `aggregate({ lintFindings })` seam exists but is left disabled; the lint runs in the vitest rather than as a weighted hubRoute dimension

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-070 [P0] Lint fails closed (deny-by-default) on a missing or weakened token
  - **Evidence**: verdict is `valid` only when findings is empty; missing token → `missing-token`, downgraded `singleUse` → `single-use-not-true`
- [x] CHK-071 [P1] Read-only boundary respected — no live skill, scorer, or gated corpus file edited
  - **Evidence**: `git status` shows only the three new additive paths; `score-skill-benchmark.cjs`, `router-replay.cjs`, `fixtures/sk-design/`, and the `DESIGN_PROOF_TOKEN v1` contract untouched
- [x] CHK-072 [P1] No proof-token or scorer schema redefined; the v1 contract is consumed read-only
  - **Evidence**: the lint encodes the v1 shape rules; it adds no new token schema and reuses `routeSkillResources`/`aggregate` exports as-is

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] spec/plan/tasks/checklist synchronized to final implementation
  - **Evidence**: spec upgraded to Level 2; plan/tasks/checklist marked complete with evidence; implementation-summary.md authored
- [x] CHK-051 [P2] Lint rules and fixture shape documented inline in the module header
  - **Evidence**: `design-token-lint.cjs` header docblock states the static §2/§6/§7 scope and the live-validator boundary

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] New artifacts confined to the fixtures dir + skill-benchmark scripts/tests dirs
  - **Evidence**: `git status` shows only `fixtures/sk-design-dispatch/`, `scripts/skill-benchmark/design-token-lint.cjs`, `scripts/skill-benchmark/tests/design-token-lint.vitest.ts`
- [x] CHK-061 [P1] No temp files left outside scratch/
  - **Evidence**: `git status` shows no stray files; only the three additive paths above

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 14 | 14/14 |
| P2 Items | 2 | 1/2 (CHK-043 deferred by design) |

**Verification Date**: 2026-06-29
**Verified By**: markdown-agent (orchestrator-dispatched), acceptance re-run on the local checkout

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
PLANNING ONLY: status planned, all items pending
-->
