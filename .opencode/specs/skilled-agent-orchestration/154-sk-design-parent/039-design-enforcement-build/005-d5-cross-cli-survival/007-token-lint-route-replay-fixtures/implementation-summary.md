---
title: "Implementation Summary: D5-R7 — Static design-proof-token lint plus route-replay and negative-control fixtures"
description: "A dispatched design-proof token now survives transport with its shape intact: a static lint fails closed on a stripped, weakened, or missing token, proven by three sibling dispatch fixtures and a vitest, with the gated sk-design hub route headline left byte-stable at 13 pass / 5 known-gap / 0 regression."
trigger_phrases:
  - "d5-r7 implementation summary"
  - "design token lint built"
  - "route replay fixtures summary"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/007-token-lint-route-replay-fixtures"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Author static design-token lint, 3 sibling dispatch fixtures, and vitest"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-token-lint-route-replay-fixtures |
| **Completed** | 2026-06-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Before this phase, the other D5 cross-CLI claims rested on a test gate that had no fixture proving a design-proof token survives a dispatch boundary with its shape intact. You can now replay a design dispatch and catch a stripped or weakened proof token: a faithful token that carries the manifest files lints clean, a token with a downgraded `singleUse` is rejected, and a dispatch with no token at all fails closed. The new corpus lives in a sibling directory, so the gated sk-design hub route headline stays byte-stable at 13 pass / 5 known-gap / 0 regression.

### Static design-proof-token lint

`design-token-lint.cjs` exports a pure function `lintDesignToken(payload)` that returns `{ verdict: 'valid' | 'rejected', findings: [] }`. It implements the static presence and shape rules from the `DESIGN_PROOF_TOKEN v1` contract (§2/§6/§7): every required v1 field is present, each digest field matches `sha256:<64 lowercase hex>`, `singleUse` is strictly the boolean `true` with a non-empty `nonce` and `runId`, `issuedAt` and `expiresAt` are ISO-8601 UTC timestamps, `loadedFiles` is a non-empty array where each entry carries a path plus a well-formed digest and the four manifest paths are present (`sk-design/SKILL.md`, `shared/context_loading_contract.md`, `shared/register.md`, `shared/assets/proof_of_application_card.md`), `workflowModes` is a non-empty array of non-empty strings, and `mintedBy` and `boundSurface` are non-empty. A token extractor unwraps the raw token from several envelope shapes (`designProofToken`, `dispatchPayload.designProofToken`, the public fixture form), so the lint reads the same token whether it arrives bare or inside a fixture. The verdict is `valid` only when there are zero findings; any finding rejects the token.

### Thin CLI

The module also ships a `require.main` CLI mirroring the sibling checkers: `--file <payload.json>` reads a payload, lints it, prints the result as JSON, and exits 0 on `valid`, 1 on `rejected`, and 2 on a usage error or unreadable file. It reuses the existing `_args.cjs` argument parser, so it adds no new flag-parsing surface.

### Sibling dispatch fixtures

Three public/private pairs under `fixtures/sk-design-dispatch/` drive the route-replay and the lint. The faithful pair carries a complete v1 token and expects lint `valid` plus a route to the `sk-design`/interface lane. The stripped pair carries a weakened token (downgraded `singleUse`) and expects lint `rejected` with the `single-use-not-true` finding even though the prompt still routes to `sk-design`, proving that routing alone does not certify the token. The neither-loaded control carries a non-design prompt with no payload and expects no design route plus lint `rejected` with `missing-token`, so a checker that passed everything would fail this control.

### Vitest hook with no-regression guard

`tests/design-token-lint.vitest.ts` replays each public prompt through the existing `routeSkillResources`, runs `lintDesignToken`, and asserts the verdict matrix. A second describe block re-scores the existing 18-pair `fixtures/sk-design/` corpus through the unchanged `scoreScenario` and `aggregate` and asserts the hubRoute gate stays `failed:false` at 13 pass / 5 known-gap / 0 regression, so any future edit that moves the headline fails the suite.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/design-token-lint.cjs` | Created | `lintDesignToken(payload)` static v1 shape lint plus a thin `--file` CLI (exit 0 valid / 1 rejected / 2 usage) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-faithful-001.{public,private}.json` | Created | Faithful token pair: routes `sk-design` + lint `valid` (0 findings) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-stripped-001.{public,private}.json` | Created | Weakened token pair: routes `sk-design` + lint `rejected` (`single-use-not-true`) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/assets/skill_benchmark/fixtures/sk-design-dispatch/sk-design-dispatch-neither-001.{public,private}.json` | Created | Negative control: no design route + lint `rejected` (`missing-token`) |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/tests/design-token-lint.vitest.ts` | Created | Route-replay + lint assertions + the no-regression guard on the existing corpus |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer (cli-codex gpt-5.5 xhigh fast) read the `DESIGN_PROOF_TOKEN v1` contract, the existing router-replay and scorer seams, and the gated `fixtures/sk-design/` corpus first, then authored only new files: the lint module, the six fixtures in a sibling corpus directory, and the vitest. No existing file was edited. The orchestrator verified the deliverable independently, and that verification was re-run here against the local checkout: `lintDesignToken` on the public fixtures returns `valid` with zero findings for the faithful payload, `rejected` with `single-use-not-true` for the stripped payload, and `rejected` with `missing-token` for the neither-loaded control; the CLI exits 0 for the faithful fixture and 1 for the stripped one; `node --check design-token-lint.cjs` passes; and `git status` shows only new untracked files under the skill-benchmark tree, so `fixtures/sk-design/` (18 pairs), `score-skill-benchmark.cjs`, and `router-replay.cjs` are byte-unchanged and the gated hubRoute scorer stays 13 pass / 5 known-gap / 0 regression.

The honest framing: this lint is static (§2/§6/§7 presence and shape only) rather than a live time-window or replay-consumption check. It proves that a dispatched design-proof token survives transport with its shape intact, so a stripped or weakened token is caught (for example a downgraded `singleUse`) and a missing token fails closed. Boundary-side freshness, nonce consumption, payload recomputation, and file re-hashing belong to live validators and stay out of scope. The new fixtures live in a sibling corpus directory so the gated hub route headline is preserved; the lint is deterministic and makes no taste claim.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Make the lint static shape/presence only, not a live freshness check | Boundary-side freshness, nonce consumption, and file re-hashing belong to live validators; a fixture replay can only assert that the token shape survived transport, so over-claiming a live time-window check would be dishonest |
| Put the new fixtures in a sibling `sk-design-dispatch/` corpus | The gated hubRoute scorer counts the `fixtures/sk-design/` corpus; a sibling directory keeps that headline (13/5/0) byte-stable while still exercising route-replay and the lint |
| Add only new files, edit nothing existing | Keeping `score-skill-benchmark.cjs` and `router-replay.cjs` untouched preserves the gate as a single source of truth and makes rollback a clean delete of the new files |
| Reject on routing-passes-but-token-weakened (stripped fixture) | Routing a design prompt to `sk-design` does not certify the token; the stripped fixture proves the lint catches a weakened `singleUse` even when the route is correct |
| Keep a neither-loaded negative control | A checker that passes everything would mask a regression; the no-route/no-token control must fail closed with `missing-token` so the gate has a guaranteed failure path |
| Reuse `_args.cjs` and the existing checker CLI shape | Mirroring `router-replay.cjs` / `d5-connectivity.cjs` keeps the CLI surface consistent and adds no new argument-parsing code |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Faithful token lints clean | PASS — `lintDesignToken(faithful.public)` returns `verdict: valid` with 0 findings |
| Stripped token caught, fails closed | PASS — `lintDesignToken(stripped.public)` returns `verdict: rejected`, finding code `single-use-not-true` |
| Neither-loaded control fails closed | PASS — `lintDesignToken(neither.public)` returns `verdict: rejected`, finding code `missing-token` |
| Faithful prompt routes to sk-design | PASS — vitest asserts `routeSkillResources` resolves the `interface` workflow mode and `design-interface/SKILL.md` |
| Neither-loaded prompt does not route to design | PASS — vitest asserts `intents == []`, `defaultApplied == true`, and no forbidden workflow mode |
| CLI exit codes | PASS — `--file faithful.public.json` exits 0; `--file stripped.public.json` exits 1 |
| `node --check design-token-lint.cjs` | PASS — exits 0 (NODE_CHECK_OK) |
| Manifest tokens present in faithful fixture | PASS — `loadedFiles` carries `SKILL.md`, `context_loading_contract.md`, `register.md`, `proof_of_application_card.md` |
| No-regression: existing corpus byte-unchanged | PASS — `git status` shows only new untracked files; `fixtures/sk-design/`, `score-skill-benchmark.cjs`, `router-replay.cjs` not modified |
| No-regression: hubRoute headline | PASS — vitest guard asserts 18 route rows, 13 pass, `knownGaps: 5`, `regressions: 0`, `gate.hubRoute.failed: false` |
| Sibling corpus does not touch the gated count | PASS — new fixtures live in `fixtures/sk-design-dispatch/`; the gated scorer reads `fixtures/sk-design/` |
| Evergreen: no spec IDs/paths/packet numbers | PASS — fixtures and `.cjs`/test code use feature names, file paths, and finding codes only |
| Scope clean — no live skill file touched beyond the named new files | PASS — `git status` shows only `design-token-lint.cjs`, `tests/design-token-lint.vitest.ts`, and `fixtures/sk-design-dispatch/` added; no existing skill file edited |
| `validate.sh --strict` | PASS except the expected GENERATED_METADATA residual (orchestrator regenerates `description.json` / `graph-metadata.json`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The lint is static, not a live freshness check.** It asserts §2/§6/§7 presence and shape (required v1 fields, `sha256:<64 hex>` digests, `singleUse` true plus `nonce`/`runId`, ISO-8601 UTC timestamps, non-empty `loadedFiles`/`workflowModes`). It does not verify the time window against now, consume the nonce, recompute the payload, or re-hash the cited files. Those checks belong to a live boundary-side validator and stay out of scope.
2. **The token-lint findings are not yet wired into the gate weighting.** The scorer already accepts an `aggregate({ lintFindings })` seam, but surfacing the dispatch-corpus findings through it is optional and was not enabled, so the lint runs in the vitest rather than as a weighted hubRoute dimension.
3. **Generated metadata is a residual at hand-off.** `description.json` still records level `1` and both `description.json` and `graph-metadata.json` need regeneration by the orchestrator after this doc sync; the strict validator's GENERATED_METADATA finding is expected and is not hand-written.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
