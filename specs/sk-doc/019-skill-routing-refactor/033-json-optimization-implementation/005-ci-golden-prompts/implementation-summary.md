---
title: "Implementation Outcome: Gate-2 Golden-Prompt Acceptance Suite"
description: "A CI-wired golden-prompt suite that runs the real TS scorer in the pinned force-local regime and asserts top-1/top-3 skill selection plus joined compiled-mode (skip-on-legacy) for representative prompts, shipped as a separate CI job."
trigger_phrases:
  - "gate-2 golden prompt suite outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/005-ci-golden-prompts"
    last_updated_at: "2026-07-29T14:40:05Z"
    last_updated_by: "claude-code"
    recent_action: "Built + verified golden-prompt gate (10/10, 31/31 combined); wired as a separate CI job"
    next_safe_action: "Phase 006 ci-compiler-accuracy-gates"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/005-ci-golden-prompts"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which scorer drives the CI gate — the real TS scoreAdvisorPrompt in the 002 pinned force-local regime, run as a separate CI job (operator-approved A')."
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Outcome: Gate-2 Golden-Prompt Acceptance Suite

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete |
| **Delivered** | 2026-07-29 |
| **Track** | sk-doc |
| **Scope** | New fixture + new vitest + one new CI job; no scorer/engine code touched |
| **Depends on** | `002-baseline-capture` (pinned force-local regime + provenance) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A golden-prompt fixture (`mcp-server/scripts/fixtures/gate2-golden-prompts.jsonl`, nine cases + a `_schema` line) spanning `sk-doc`, `sk-git`, `system-deep-loop`, `system-spec-kit`, `mcp-tooling`, `sk-prompt`, with reused cases carrying a `sourceCaseId`. A vitest suite (`mcp-server/tests/routing-golden-prompts.vitest.ts`) runs the real, unmocked `scoreAdvisorPrompt` in the same pinned force-local regime the 002 baseline uses, asserts top-1 or top-3 skill selection per case, and — for cases whose hub is in `COMPILED_ROUTING_HUBS` and declares an `expectedMode` — asserts the joined `workflowMode` via the real `compiled-route.cjs`. A separate `golden-prompt-gate` CI job in `routing-registry-drift.yml` installs the scorer + its `@spec-kit/shared` dist and runs the suite; the dependency-light `routing-drift` job is left byte-identical.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The suite drives `scoreAdvisorPrompt` (not the full `handleAdvisorRecommend`) because the lean CI job installs only vitest, so the native advisor is `GENERATION_ABSENT` there; the pinned force-local regime is the production scorer core, deterministic, needing no built SQLite graph. The F22 probe (`scaffold a new parent skill hub with mode-registry`) was re-verified against the current v4 tree: `sk-doc` ranks top-1 in this regime, so the case ships as a top-3 floor with a note that the 029 rank-3 miss does not reproduce here. The joined-mode assertion is **skip-on-legacy**: every v4 hub currently serves `{ servingAuthority: "legacy" }` (compiled manifests mid-restructure), so the mode check logs and skips rather than fails, and activates automatically once a hub is re-minted — the top-1/top-3 selection still gates.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

**Real TS scorer via the pinned regime, as a separate CI job (operator-approved A').** The original "call `handleAdvisorRecommend` in the lean job" could not work — that job has no scorer deps. **F22 as a top-3 floor, calibrated to reality** (sk-doc is top-1 here) rather than asserting an outcome the fleet does not produce. **Joined-mode skip-on-legacy** so the gate passes on the current all-legacy v4 fleet while still asserting mode for any compiled-serving hub and reactivating on re-mint. Provenance by `sourceCaseId`, not a third independent "golden" definition.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Confirmed in the worktree (real scorer, pinned regime):
- `npx vitest run tests/routing-golden-prompts.vitest.ts` → **10 passed (10)** (nine cases + fixture-shape guard), including F22 at its true top-3 rank.
- Combined four-file `routing-drift` set (`routing-registry-drift-guard`, `routing-parity-deep-skills`, `routing-parity-deep-council`, `routing-golden-prompts`) → **31 passed (31)** — no regression to the three pre-existing suites.
- Both `expectedMode` cases (deep-loop → research, sk-prompt → prompt-improve) currently log the skip-on-legacy note (`compiled-route.cjs` returns `servingAuthority: legacy` for both hubs on v4); the top-1 selection still passes.
- Workflow parses (two jobs: `routing-drift`, `golden-prompt-gate`); the lean 3-file step is unchanged.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The joined-mode assertion is **currently exercised by zero cases** because every v4 hub serves legacy compiled routing (a pre-existing mid-restructure state, not this phase's doing); the assertion logic is present and reactivates the moment a hub is re-minted. The gate drives `scoreAdvisorPrompt`, not the full handler, so handler-only behaviours (command-bridge routing, abstain-tier) stay gated by the existing regression corpus, not duplicated here. `validate.sh --strict` could not run (spec-kit orchestrator build broken repo-wide by a concurrent session's incomplete pi-hook relocation); verified by the direct vitest runs above. The `npm ci` legs in the new CI job are confirmable only on first push.
<!-- /ANCHOR:limitations -->
