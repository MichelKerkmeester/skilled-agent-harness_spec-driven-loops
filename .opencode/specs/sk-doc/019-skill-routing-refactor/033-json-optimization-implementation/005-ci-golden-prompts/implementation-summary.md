---
title: "Implementation Outcome: Gate-2 Golden-Prompt Acceptance Suite"
description: "Planned record of a new CI-wired golden-prompt acceptance suite asserting joined parent-then-mode skill routing, grounded in a live 029 research miss; not yet built."
trigger_phrases:
  - "gate-2 golden prompt suite outcome"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/005-ci-golden-prompts"
    last_updated_at: "2026-07-29T09:05:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers:
      - "Depends on 002 (routing-accuracy corpus hash pinned) for fixture provenance only"
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/005-ci-golden-prompts"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Exact fixture case count and full representative-hub list beyond sk-doc/sk-git/system-deep-loop — left to implementation time"
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary | v2.2 -->

# Implementation Outcome: Gate-2 Golden-Prompt Acceptance Suite

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Planned |
| **Delivered** | Not yet — build not started |
| **Track** | sk-doc |
| **Scope** | New fixture + new vitest suite + one-line CI-step edit; no production/scorer/compiled-routing-engine code touched |
| **Depends on** | `002-baseline-capture` (fixture provenance only) — no dependency on Phase 1's derived-authority decision |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A new golden-prompt fixture (`mcp-server/scripts/fixtures/gate2-golden-prompts.jsonl`) covering representative multi-hub prompts (at minimum `sk-doc`/create-skill, `sk-git`, `system-deep-loop`/research) plus every existing P0 case from `skill-advisor-regression-cases.jsonl` referenced by id; a new vitest suite (`mcp-server/tests/routing-golden-prompts.vitest.ts`) that calls the real, unmocked `handleAdvisorRecommend` for each case and asserts top-1/top-3 skill selection plus — for compiled-routing-eligible hubs — the joined mode-level outcome via the recommendation's `compiledRoute`; and a one-line extension of `routing-registry-drift.yml`'s existing `routing-drift` job so the new suite runs in CI alongside the three already-wired vitest files. The fixture will include a case that reproduces the 029 research's live miss (`scaffold a new parent skill hub with mode-registry` ranking `sk-prompt` above `sk-doc`) as an explicit top-3 regression floor, not a fix to the ranking itself.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Three phases per `tasks.md`: (1) Setup — read the three already-wired vitest files and existing fixtures to avoid schema duplication, re-confirm the F22 live-miss citation with a fresh probe, and confirm the real `compiledRoute` field path; (2) Implementation — author the fixture, author the vitest suite, extend the CI step's vitest invocation by one file; (3) Verification — run the new suite alone, run it together with the three pre-existing suites, dry-run the CI command from a clean working directory, and run `validate.sh --strict` on this folder. No `paths:` trigger edit to the workflow is needed — both new files already fall under the existing `.opencode/skills/system-skill-advisor/mcp-server/**` glob.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Assert the reproduced live-miss case at its true current rank (top-3), not top-1 — tightening the ranking itself is 029's O6 (intent-signal quality), a separate phase; this phase's job is a CI-enforced floor against further regression, not a scorer fix. Reuse `002`'s pinned corpus and the existing regression corpus for provenance (`sourceCaseId`) rather than authoring an independent, third definition of "golden," per 029 §4's warning that unpinned baselines are version-sensitive and contradictory across sources. Call `handleAdvisorRecommend` directly and unmocked so the suite proves the real production code path, including the `compiled-route.cjs` subprocess enrichment, rather than a scorer-mocked unit test.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Not yet run — Status: Planned. Once built, verification will be: `npx vitest run tests/routing-golden-prompts.vitest.ts` passing for every fixture case against the current fleet; the combined four-file `routing-drift` vitest set passing with no regression to the three pre-existing suites; a CI-command dry-run from a clean working directory; and `validate.sh <folder> --strict` reporting Errors:0. All `checklist.md` items are currently unchecked.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

This phase does not fix the underlying ranking miss (sk-doc landing at rank 3 instead of rank 1 on the reproduced prompt) — it only guards against further regression from the current state; the actual fix is 029's O6 (intent-signal quality), out of scope here. Fixture case count and full hub coverage beyond the three named in scope are left to implementation time. As with any CI-blocking test addition, a miscalibrated assertion could stall unrelated PRs on the routing surface until reverted — mitigated by the single-line rollback documented in `plan.md` §7.
<!-- /ANCHOR:limitations -->
