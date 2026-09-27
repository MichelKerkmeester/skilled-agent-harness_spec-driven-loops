---
title: "Tasks: Phase 17: deem-search-narrowing-arm"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "track narrowing tasks"
  - "score-track-narrowing tasks"
  - "deem narrowing verification"
  - "track baseline tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 17: deem-search-narrowing-arm

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [B] Confirm phase 010 has landed, then rebuild the index to scratch with `generate-trigger-index.mjs --out`, `--manifest`, `--diagnostics` and `--variants` all pointing into scratch, and diff its path set against `runtime/data/trigger-index.json`. Expect 0 missing and an unchanged `git status --porcelain` (`.skilled/skills/system-spec-kit/runtime/data/trigger-index.json`)
- [ ] T002 Read the owner's contracts before writing: the retrieval `README.md`, `lookup-trigger-index.mjs`, `lib/rg-lane.mjs`, `lib/normalize.mjs`, `measure-cold-lookup.mjs` and `tests/trigger-index.vitest.ts`, and route the code write through `sk-code` (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/`)
- [ ] T003 [P] Build the vitest fixture corpus: three tracks, packets with clean, placeholder and leaking descriptions, and an index built with the package's `generate()` (`.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Test-set builder: walk live packet folders, apply the placeholder and multi-word-name leak filters, keep at most 20 rows per track by SHA-256 of the folder path, print kept, placeholder, leak and residual-exposure counts (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs`)
- [ ] T005 Lookup baseline: `lookup()` with limit 0, own-folder rows removed, first scoring `specs/` row gives the track, print `manifestHash` (same file)
- [ ] T006 Ripgrep baseline: path-only recipe over `specs` per distinct 3-plus-character token with a per-token cache, distinct-token file score, tie rule, own-folder exclusion (same file)
- [ ] T007 Zero-call output: both accuracies on identical rows, the better one as baseline, the paraphrase-probe line, the headroom line with `no headroom` above 0.90, the 10-point margin printed as a constant, no file written (same file)
- [ ] T008 [B] Deem gate behind `--deem`: `cli-deem health` within 2,000 ms, the four skip lines, `--out` required, the payload notice (same file). Blocked on phase 008
- [ ] T009 [B] Deem arm: 17 options from the track descriptions with their SHA-256 printed, three left rotations, modal pick, `unstable`, `none` as abstention, the exit table and `calls.jsonl` records with the commit pair (same file). Blocked on phase 008
- [ ] T016 Jev gate behind `--jev`: identity line with the `jev` path and provider P first, then `command -v jev`, `jev --version` printing `jev 0.6.2` and `jev auth status --provider P`, the three skip lines, `--out` required, the payload notice without a dollar figure (same file)
- [ ] T017 Jev arm: one `jev auth test --provider P`, the same 17 options and three rotations as the Deem arm with no answer cache, the question on stdin and closed, the same `--provider P` on every call, the 90 s spawn cap, phase 002's exit handling and `calls.jsonl` lines carrying the `jev` version, provider and model (same file)
- [ ] T010 Verdict per backend column: rows that backend measured, accuracy gap against the baseline, exact one-sided sign test on discordant rows, flip rate, `verdict <backend>: keep` or `verdict <backend>: stop (<reason>)`, `requalify: model commit changed` on a new Deem pair and `requalify: model changed` on a new Jev provider or model (same file)
- [ ] T011 README: add the script row and tree line, and note that it reads the probe queries of `semantic-probes.json` (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Vitest: at least 17 cases, a happy path plus one edge case for each changed surface, the Deem exit 4 changed-pair case, the requalify case, the Jev key-rejected case and one `--provider` value on every logged `jev` call. Run from `runtime/cli`: `npx vitest run --config ../../vitest.config.ts --project cli tests/score-track-narrowing.vitest.ts` (`.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts`)
- [ ] T013 One zero-call run on the real tree with stub `cli-deem` and `jev` first on `PATH`. Record both accuracies, the kept row count and the headroom line in `goal.md`'s log
- [ ] T014 [B] Unless T013 printed `no headroom`, one `--deem --out <dir>` run against the served instance. Record the verdict line, the commit pair and p50 and p95 in `goal.md`'s log
- [ ] T018 [B] Only when the operator passes `--jev`, one `--jev --out <dir>` run. Record the identity line, the verdict line, provider, model and p50 and p95 in `goal.md`'s log. Blocked on the operator's flag
- [ ] T015 `git status --porcelain` shows only the script, its test, the README and the report directory. `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the script returns no match
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available: phase 010's index, phase 008's `cli-deem` and, for `--jev`, `jev` 0.6.2 with a credential
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented: every `cli-deem` exit has one handling
- [ ] CHK-013 [P1] Code follows project patterns: MODULE banner, exported pure functions, `isMainModule`, no spec path or requirement id in comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete: one zero-call run and, unless `no headroom`, one `--deem` run
- [ ] CHK-022 [P1] Edge cases tested: leak drop, own-folder exclusion, `no headroom`, stub backend skip
- [ ] CHK-023 [P1] Error scenarios validated: exit 4 with a changed commit pair
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented: option count and `--out` checked before any call
- [ ] CHK-032 [P1] Auth/authz working correctly: `jev auth status --provider P` gates the Jev arm, `jev` resolves its own key and the script passes none to either binary
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-27
<!-- /ANCHOR:summary -->

---

