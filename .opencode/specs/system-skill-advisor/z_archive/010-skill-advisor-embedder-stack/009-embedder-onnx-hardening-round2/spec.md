---
title: "Feature Specification: Embedder ONNX Hardening — Round 2 Review Remediation"
description: "Plan fixes for 4 findings from an independent adversarial review of packet 005's Round 2 shipped diff: an hf-model-server shutdown failsafe race, a latent env-var collision in the cross-server DB-leak fix, a destructive 3-arg embedder-provider write, and a missing end-to-end DB-leak regression test."
trigger_phrases:
  - "009 embedder onnx hardening round 2"
  - "hf-model-server shutdown failsafe race"
  - "skill-advisor MEMORY_DB_PATH env var collision"
  - "setActiveEmbedder 3-arg provider clear"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/010-skill-advisor-embedder-stack/009-embedder-onnx-hardening-round2"
    last_updated_at: "2026-07-08T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored planning-only spec for 4 findings from packet 005's Round 2 review"
    next_safe_action: "Get plan.md's 4 technical approaches approved, then implement per tasks.md Phase 2"
    blockers: []
    key_files:
      - ".opencode/bin/hf-model-server.cjs"
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/launcher-bootstrap.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "009-embedder-onnx-hardening-round2-spec"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Spec folder: user supplied the exact new phase-child path under 010-skill-advisor-embedder-stack"
      - "Scope: planning-only (spec/plan/tasks/checklist), no implementation in this packet"
---
# Feature Specification: Embedder ONNX Hardening — Round 2 Review Remediation

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
| **Created** | 2026-07-08 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 009 |
| **Predecessor** | `005-shared-embedder-logic-with-spec-memory` (Round 2 hardening, shipped 2026-07-08) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

An independent adversarial code review of packet 005's Round 2 shipped diff (provider persistence, cross-server DB-path leak fix, onnx shutdown-crash mitigation — see `../005-shared-embedder-logic-with-spec-memory/implementation-summary.md`) found 4 gaps that Round 2's own verification never exercised: (1) `hf-model-server.cjs`'s graceful-shutdown failsafe timer can SIGKILL the process before a legitimately in-flight embed finishes draining; (2) the cross-server DB-leak fix reuses `MEMORY_DB_PATH`, an env var whose repo-wide established meaning is mk-spec-memory's database, creating a latent landmine that could silently reopen the exact leak it fixed; (3) the new 4th `provider` parameter on `setActiveEmbedder()`/`setActiveEmbedderTransactional()` makes the 3-arg call form destructively clear any already-persisted provider, and 005's implementation-summary.md inaccurately claims 3-arg call sites are unchanged; (4) the DB-leak fix has only a unit test on `createChildEnv()`'s output, never an executed end-to-end test confirming the real child process opens the correct sqlite file.

### Purpose

Plan (not implement) a fix for each of the 4 findings, so packet 005's hardening work closes cleanly with regression coverage for the exact gaps this review found, before any of it is implemented.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Plan a fix for F1: close the race between `hf-model-server.cjs`'s SIGKILL failsafe timer and `dispose()`'s legitimate drain budgets (`INFERENCE_DRAIN_TIMEOUT_MS`, `MODEL_LOAD_TIMEOUT`), plus a live SIGTERM-during-active-embed regression test.
- Plan a fix for F2: replace the overloaded `MEMORY_DB_PATH` ambient-collision check in `mk-skill-advisor-launcher.cjs`'s `createChildEnv()` with a dedicated skill-advisor-namespaced override var, so an unrelated ambient `MEMORY_DB_PATH` can never silently reopen the cross-server DB-leak bug.
- Plan a fix for F3: make the 3-arg `setActiveEmbedder()`/`setActiveEmbedderTransactional()` form preserve any already-persisted `provider` value instead of overwriting it with an empty-string sentinel.
- Plan a correction to 005's `implementation-summary.md` claim that 3-arg call sites are "unchanged" (cross-reference, not duplicate, the correction).
- Plan a true end-to-end regression test for the cross-server DB-leak fix (F4): the real child-process/module resolution path, not just `createChildEnv()`'s return value.

### Out of Scope

- Implementing any of the 4 fixes — this packet is planning-only; implementation is a follow-up pass against this spec/plan/tasks set.
- Re-litigating packet 005's shipped provider-selection cascade backfill logic — the review assessed it as correct; only the 4 findings above are in scope.
- Broader `onnxruntime-node` native-module lifecycle refactors beyond the shutdown-timing race in F1.
- Any change to mk-spec-memory's own use of `MEMORY_DB_PATH` — that meaning is correct and stays as-is; F2 only changes which var skill-advisor's launcher treats as "already configured for skill-advisor."
- Touching `shared/embeddings/factory.ts`'s cascade internals — F2's fix stays at the launcher boundary; F4's test targets the existing consumer contract, it does not change it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/hf-model-server.cjs` | Modify | F1: rework the shutdown failsafe timer so it cannot fire before `dispose()`'s real drain budget elapses; clear the timer on successful close. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/embedders/hf-model-server.vitest.ts` (or a new dedicated test file) | Modify/Create | F1: add a live SIGTERM-during-active-embed regression test. |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modify | F2: add a dedicated skill-advisor-namespaced DB-path override var; stop treating a blindly-forwarded `MEMORY_DB_PATH` as the "already configured" signal in `createChildEnv()`. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-bootstrap.vitest.ts` | Modify | F2: update the existing "honors an explicit parent-provided `MEMORY_DB_PATH`" test to the new override var; add a regression test proving an ambient, unrelated `MEMORY_DB_PATH` no longer silently wins. F4: add the true end-to-end DB-resolution test. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts` | Modify | F3: change `setActiveEmbedderTransactional()`'s 3-arg behavior to preserve an existing persisted provider instead of clearing it. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/embedders/schema.vitest.ts` | Modify | F3: add a regression test for 3-arg preserve-provider behavior. |
| `../005-shared-embedder-logic-with-spec-memory/implementation-summary.md` | Modify | F3: correct the inaccurate "3-arg call sites remain valid unchanged" claim; cross-reference this packet instead of duplicating detail. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

_None. All 4 findings are Medium/Low severity per the source review; nothing here blocks other in-flight work._

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| 009-REQ-001 | F1: shutdown failsafe cannot pre-empt a legitimate drain | A SIGTERM sent while an embed call is mid-inference results in a clean `process.exitCode = 0` exit after `dispose()` completes, not a `SIGKILL`; idle shutdowns remain fast (no material regression to the existing ~1.5s idle exit time). |
| 009-REQ-002 | F1: shutdown failsafe timer is cleaned up | The failsafe timer is explicitly cleared on a successful `close()`, not left to expire silently via `.unref()` alone. |
| 009-REQ-003 | F1: busy-shutdown path has regression coverage | A new automated test exercises SIGTERM-during-active-embed (not just idle shutdown) and would fail against the pre-fix 1500ms-fixed-timer behavior. |
| 009-REQ-004 | F2: skill-advisor's DB-leak default cannot be silently reopened by an ambient `MEMORY_DB_PATH` | `createChildEnv()` no longer treats a blindly-forwarded parent `MEMORY_DB_PATH` as evidence that skill-advisor was explicitly configured; a new dedicated skill-advisor-namespaced var is the only way to override the default. |
| 009-REQ-005 | F2: existing explicit-override behavior is preserved under the new var name | `launcher-bootstrap.vitest.ts`'s override-respecting test is updated to the new var and still passes; a new test proves an ambient, unrelated `MEMORY_DB_PATH` no longer silently overrides the advisor default. |

### P2 - Optional (can defer with documented reason)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| 009-REQ-006 | F3: 3-arg `setActiveEmbedder()` no longer destroys a persisted provider | Calling the 3-arg form when a provider value already exists in `vec_metadata` leaves that provider value intact after the call. |
| 009-REQ-007 | F3: 005's implementation-summary.md claim corrected | The "3-arg call sites... remain valid unchanged" sentence is corrected to reflect the two 4-arg call sites inside `schema.ts` itself, with a cross-reference to this packet, not a duplicated writeup. |
| 009-REQ-008 | F4: cross-server DB-leak fix has a true end-to-end regression test | A test spawns (or closely simulates spawning) the real child-process/module resolution path with the launcher-derived env and asserts the advisor's `skill-graph.sqlite` — not mk-spec-memory's `context-index.sqlite` — is the one actually opened. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `hf-model-server.cjs`'s shutdown path can no longer SIGKILL a process mid-drain of a legitimate in-flight embed; a live test proves this for both the busy and idle cases.
- **SC-002**: `mk-skill-advisor-launcher.cjs`'s DB-leak fix can no longer be silently undone by an ambient `MEMORY_DB_PATH` set for mk-spec-memory's own established purpose.
- **SC-003**: The 3-arg `setActiveEmbedder()` form (currently test-only) can no longer silently clear a persisted provider, and 005's documentation accurately describes the 4-arg call sites it introduced.
- **SC-004**: The cross-server DB-leak fix has a real end-to-end regression test exercising the actual consumer resolution path, not just a unit test on `createChildEnv()`'s return value.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:nfr -->
## 6. NON-FUNCTIONAL REQUIREMENTS

- **NFR-001**: The F1 fix must not materially slow down the already-verified idle shutdown path (the existing ~1.5s fast exit is a load-bearing operator expectation for daemon restarts).
- **NFR-002**: The F2 fix must not require any change to `shared/embeddings/factory.ts`'s cascade — the fix stays entirely at the launcher boundary, matching packet 005's own established pattern (D-007: "close the DB-path leak at the launcher boundary, not inside `factory.ts`").
- **NFR-003**: All 4 fixes must be surgical — no unrelated refactors to `hf-model-server.cjs`, `mk-skill-advisor-launcher.cjs`, or `schema.ts` beyond what each finding requires.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 7. EDGE CASES

- **F1 — model still loading at shutdown**: `dispose()` also waits up to `MODEL_LOAD_TIMEOUT` (120000ms) for a pending model load, not just `INFERENCE_DRAIN_TIMEOUT_MS` (5000ms) for in-flight inference; the fix must account for both waits, not just the inference-drain case named in the review.
- **F1 — repeated signals**: a second SIGTERM/SIGINT arriving while shutdown is already in progress must not re-arm a second failsafe timer or double-invoke `dispose()` (existing code already guards `dispose()` via `state.disposePromise`; the fix must preserve that guard).
- **F2 — no override set at all**: with neither the old nor the new env var set, the launcher must still default to the advisor's own `skill-graph.sqlite` (existing default-injection behavior must survive the refactor).
- **F2 — legacy scripts or shells still exporting `MEMORY_DB_PATH`**: after the fix, such a value must be silently ignored for skill-advisor's own default-injection decision (it no longer satisfies "already configured"); this is the exact scenario the fix closes.
- **F3 — 3-arg call site that intentionally wants to clear a stale provider**: if any future caller does need to explicitly clear a provider (not just omit it), the fix must not make that impossible — see plan.md for how "omitted" and "explicitly clear" are distinguished.
- **F4 — clean test isolation**: the new end-to-end test must not depend on machine state (a running daemon, a real Ollama install, or a pre-existing `skill-graph.sqlite`) to stay deterministic in CI.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 8. COMPLEXITY

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| File count | Low-Medium | 3 production files (`hf-model-server.cjs`, `mk-skill-advisor-launcher.cjs`, `schema.ts`) plus their test files, plus a doc correction in 005's implementation-summary.md. |
| Behavioral risk | Medium | F1 touches live daemon shutdown behavior; F2 touches env-var precedence for a shared child-process boundary; both are runtime-sensitive paths already fixed once this round. |
| Architecture change | Low | No new components; all 4 fixes tighten existing boundaries (shutdown timing, env precedence, persisted-field write semantics, test coverage) without introducing new abstractions. |
| Verification load | Medium | Requires new live/regression tests for F1 and F4 specifically (both findings exist because the prior verification pass never exercised the busy/e2e path), plus typecheck and strict spec validation. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risks -->
## 9. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | F1's fix could overcorrect and make idle shutdowns slower if the failsafe duration is simply raised to the full worst-case drain budget | Medium — would regress the already-verified ~1.5s idle exit UX | Plan a dynamic/tiered failsafe (fast path when nothing is in-flight, slow path only when inference or model-load is genuinely in-flight at shutdown time) rather than a single raised constant; see plan.md. |
| Risk | F2's fix changes the semantics of an existing, currently-passing test (`launcher-bootstrap.vitest.ts`'s "honors an explicit parent-provided MEMORY_DB_PATH" case) | Low — test-only churn, not a production risk, but must not be missed | Explicitly listed as a file to change (see Scope) and as its own task in tasks.md. |
| Risk | F4's true end-to-end test needs a way to observe which DB the real consumer path opens without exporting new private internals from `shared/embeddings/factory.ts` (out of scope to modify) | Low-Medium | Plan a subprocess-boundary test using distinguishable sentinel `vec_metadata` rows in two temp fixture databases, asserting on the existing public resolution entry points; see plan.md for the two candidate approaches. |
| Dependency | Packet 005 (Round 2) already shipped | None — this packet only plans fixes for gaps in what shipped; it does not block on further 005 work. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The 4 findings, their severities, and the needed-fix direction were fully specified by the source adversarial review; plan.md commits to one concrete technical approach per finding.
<!-- /ANCHOR:questions -->
