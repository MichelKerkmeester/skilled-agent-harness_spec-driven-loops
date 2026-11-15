---
title: Deep Review Report - compat opt-in and image declaration (fan-out lineage, cli-pi / deepseek-v4.1-flash)
description: Verdict, finding registry, remediation lanes and audit appendix for the detached fan-out lineage review of specs/hooks/021-compat-opt-in-and-image-declaration.
review_target: specs/hooks/021-compat-opt-in-and-image-declaration
review_target_type: spec-folder
session_id: fanout-deepseek-v41-flash-1789146937931-6gxjep
verdict: CONDITIONAL
stop_reason: maxIterationsReached
iteration_count: 1
generated: 2026-09-11T17:28:00Z
---

# Deep Review Report — `specs/hooks/021-compat-opt-in-and-image-declaration`

Detached fan-out lineage, generation 1. Executor: `cli-pi`, model `deepseek-v4.1-flash` (reasoningEffort max). `stopPolicy: max-iterations`, `maxIterations: 1`, so the run terminates at the cap; convergence math is telemetry only and no converged STOP is claimed.

---

## 1. Executive Summary

**Verdict: CONDITIONAL** — `hasAdvisories: true`. Active findings: **P0 = 0, P1 = 1, P2 = 5**.

The change under review does what the packet says it does on the surfaces the packet names. A model name no longer opts a channel into DeepSeek wire-format advice; `thinkingFormat` is never reported missing, never suggested and never written by `/cache-optimizer fix`; an explicit `sendSessionAffinityHeaders: false` is a warning-free opt-out; and the two `.pi/models.json` declarations are present and effective under Pi's provider+model compat merge. Three suspected under-reports were investigated and ruled out with runtime evidence: the narrowing of the gate to `openai-completions` matches the only API module that consumes those keys, genuine DeepSeek endpoints are auto-detected by Pi core regardless of the gate, and provider-level compat is not inert.

One confirmed regression survived: **the chat-surface session-affinity advisory is now unreachable for every DeepSeek-named channel** (F001). `describeMissingCacheCompatForModel` composes the generic affinity rule with the DeepSeek additions as intended, but the surface that renders the launch warning for these models — the DeepSeek adapter's `warningText` — still builds its message from the DeepSeek-only list and returns `undefined` when the opt-in gate is off, and the notification path consults a single first-match adapter with no fallback. An opted-in channel that also lacks `sendSessionAffinityHeaders` therefore gets a warning that omits affinity; an unopted channel gets no chat warning at all while `/cache-optimizer compat|doctor` still report the missing flag. The packet's own decision table asserts the opposite ("so affinity advice is never lost for opted-in channels"), and its Known Limitations entry covers only the unopted case.

Scope: commit `80576ef8aa` (`.pi/extensions/pi-cache-optimizer/index.ts`, `tests/review-findings.test.ts`, `.pi/models.json`) and the packet's claims, probes and check evidence. Convergence reason: `maxIterationsReached` with all four dimensions and both core traceability protocols covered in the single pass.

---

## 2. Planning Trigger

Route **CONDITIONAL → remediation planning** (`/speckit:plan`). Remediation is bounded and does not reopen the design: one behavior fix on an existing surface (F001), two evidence/verification closures (F004, F006), one regression-claim correction (F002), one dead-code/comment cleanup (F003) and one artifact-hygiene trim (F005). Two verifications could not be performed inside this lineage's read-only, bounded write surface and must be re-run by the implementing session: `validate.sh <folder> --strict` and a request-side affinity re-probe.

---

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Evidence | First/Last seen | Status |
|----|----------|-----------|-------|----------|-----------------|--------|
| F001 | P1 | correctness | Chat-level session-affinity advisory dropped for every DeepSeek-named channel; no adapter fallback | `index.ts:3097-3105`, `2960-2969`, `4053-4055`, `4102-4104`; `scratch/verify-no-warning.txt` control C | 1 / 1 | active |
| F002 | P2 | traceability | One of four new gate tests passes against the pre-change implementation | `tests/review-findings.test.ts:1138-1149`; removed predicate from `review/change-under-review.diff` | 1 / 1 | active |
| F003 | P2 | maintainability | Predicate drifts from its documented shape; `thinkingFormat` survives in placement and repair code | `index.ts:2987-2990`, `6921-6924`, `6962-6968`, `7031-7034`, `7087-7089`, `7310-7313`; `plan.md` §3 | 1 / 1 | active |
| F004 | P2 | traceability | Affinity probe licenses less than claimed: response-only artifact, uncommitted request, provider-wide declaration proven on one model | `scratch/live-affinity-probe.json`, `scratch/live-affinity-probe.md`, `.pi/models.json` | 1 / 1 | active |
| F005 | P2 | security | Committed probe responses embed third-party account metadata including an `apiKeyHash` | `scratch/live-affinity-probe.json`, `scratch/live-image-probe.json` | 1 / 1 | active |
| F006 | P2 | traceability | Packet reports Complete while `plan.md` Definition of Done stays unchecked | `plan.md` §2 vs `spec.md` §1 and `tasks.md` T001–T013 | 1 / 1 | active |

Machine-readable registry: `deep-review-findings-registry.json`. Claim adjudication packet for the single P1: `iterations/iteration-001.md` (F001 block).

---

## 4. Remediation Workstreams

**Lane 1 — Restore the affinity advisory on the chat surface (F001).** Order 1.
- In the DeepSeek adapter's `warningText` (`index.ts:3097-3105`), fall back to the generic proxy warning when `isDeepSeekCompatCheckApplicable(model)` is false, and build the opted-in message from `describeMissingCacheCompatForModel(model)` rather than the DeepSeek-only list, so `sendSessionAffinityHeaders` can appear in the rendered advice again (the affinity branch at `index.ts:3045-3049` is already there to render it).
- Simplify: with the composed list, `describeMissingCacheCompatForModel` becomes the single producer for every advice surface, which is what `plan.md` §3 and `implementation-summary.md:93` already claim.
- Verification: extend `scratch/verify-no-warning.mjs` with a control that expects 1 chat warning for a DeepSeek-named, unopted channel missing affinity, and one for an opted-in channel missing both flags; re-run and attach the transcript.

**Lane 2 — Close the evidence and completion gaps (F004, F006, F002).** Order 2.
- Commit the probe command/script used for the affinity request and re-probe with a request-side assertion; if the endpoint cannot echo anything, state explicitly in `live-affinity-probe.md` that the artifact proves acceptance only, mirroring the honesty of the image probe.
- Check `plan.md` §2's four DoD boxes with their evidence, or remove the block if the Level 1 packet's gate surface is `tasks.md` alone.
- Reword REQ-006 in `spec.md` to name the three tests that discriminate against the removed predicate, and note in the test file that `tests:1138-1149` pins preserved behaviour.

**Lane 3 — Remove the stale wire-format doctrine (F003).** Order 3.
- Drop the `thinkingFormat` half of the `decideFixPlacement` condition (`index.ts:6962-6968`) and refresh the comments at `index.ts:6921-6924`, `7031-7034`, `7087-7089`, `7310-7313`, which still describe `legacy -> deepseek` repairs.
- Align `plan.md` §3's predicate description with the implemented gate (add the `isOfficialOpenAIBaseUrl` bypass or drop "non-official" from the description).

**Lane 4 — Trim committed probe metadata (F005).** Order 3 (independent).
- Reduce the two probe response artifacts to the fields the claims need (`choices[0].message.content`, `usage`, `model`), or move the account metadata into prose in the md files.

---

## 5. Spec Seed

- **REQ-003**: widen the acceptance criterion from "`false` produces no warning" to "a DeepSeek-named channel still receives generic proxy advice on the chat surface, and `false` suppresses the affinity clause specifically". The current wording does not cover the regression in F001.
- **REQ-004**: state the evidence required — a request whose affinity headers are visible in the recorded evidence (echoed header or committed probe script) — rather than "a request through the channel still returns 200 with the headers enabled".
- **REQ-006**: replace "New tests fail against the pre-patch behavior" with the enumerated discriminating tests and name the preserved-behaviour pin explicitly.
- **New (optional)**: a statement that the provider-level affinity declaration covers every model in the provider and that the probe covers the endpoint, not each model.
- **Scratch/evidence convention**: response bodies committed as evidence should be trimmed of account metadata.

---

## 6. Plan Seed

1. **T101** Patch the DeepSeek adapter `warningText` to fall back to the generic warning and to render from `describeMissingCacheCompatForModel`; update or add the two harness controls; re-run `verify-no-warning.mjs` (F001). Target: `.pi/extensions/pi-cache-optimizer/index.ts:3097-3105`, `scratch/verify-no-warning.mjs`.
2. **T102** Add a regression test that an unopted DeepSeek-named proxy missing affinity produces a chat warning, and one that an opted-in channel missing both flags names both (F001). Target: `tests/review-findings.test.ts`.
3. **T103** Re-probe the affinity headers with request-side evidence; commit the probe script; update `live-affinity-probe.md` (F004).
4. **T104** Reconcile `plan.md` DoD and REQ-006/REQ-004 acceptance wording (F002, F006, spec seed).
5. **T105** Remove the dead `thinkingFormat` placement branch and the four stale comments; align `plan.md` §3 (F003).
6. **T106** Trim the committed probe response artifacts (F005).
7. **T107** Re-run `npm run check` in `.pi/extensions/pi-cache-optimizer`, then `validate.sh <folder> --strict`, then regenerate metadata and re-run the validator (REQ-007, REQ-008).

---

## 7. Traceability Status

| Protocol | Level | Status | Gate | Evidence | Notes |
|---|---|---|---|---|---|
| `spec_code` | core | **pass** | hard | `index.ts:2987-2995`, `3013-3027`, `2710-2718`; `.pi/models.json`; `tests:1122-1202`, `1651-1662` | REQ-001, REQ-002, REQ-003, REQ-005 resolve to shipped behaviour. REQ-004's declaration is present and effective; its acceptance criterion is under-evidenced (F004). |
| `checklist_evidence` | core | **partial** | hard | `plan.md` §2; `spec.md` §1; `tasks.md`; `implementation-summary.md:105-115` | F006 (unchecked DoD under a Complete status) and F002 (overstated regression coverage). |
| `skill_agent` | overlay | notApplicable | advisory | — | Spec-folder target. |
| `agent_cross_runtime` | overlay | notApplicable | advisory | — | No agent definition in scope. |
| `feature_catalog_code` | overlay | notApplicable | advisory | — | No catalog claims in scope. |
| `playbook_capability` | overlay | notApplicable | advisory | — | No playbook scenario in scope. |

---

## 8. Deferred Items

- **Strict validator run (REQ-008)**: not performed — this lineage is forbidden from running `validate.sh`. `implementation-summary.md:115` claims PASS after metadata regeneration; unverified here, not contradicted.
- **Metadata freshness**: the generated pair (`description.json`, `graph-metadata.json`) exists; freshness after the last spec-doc edit is unverifiable inside this lineage.
- **Security-sensitive stabilization**: the change touches env precedence (`models.json` compat) and a schema boundary (compat keys), so the override's `minStabilizationPasses=2` applies. This cap-limited single pass explicitly does **not** satisfy it; a second stabilization iteration should accompany the remediation.
- **Live re-verification of the assertions**: pre-change behaviour was evaluated against the diff, not executed; no worktree check was run for this lineage.
- **Advisory (F005)**: committed gateway account metadata; no credential value was exposed.

---

## 9. Audit Appendix

### Iteration table

| # | Focus | Files | Dimensions | New P0/P1/P2 | Ratio | Status | Verdict |
|---|-------|-------|-----------|---------------|-------|--------|---------|
| 1 | All-dimension breadth pass: gate, affinity relocation, probe evidence, packet claims | 17 | correctness, security, traceability, maintainability | 0 / 1 / 5 | 0.62 | complete | CONDITIONAL |

### Convergence signal replay

| Signal | Weight | Value | Contribution |
|---|---|---|---|
| rollingAvg (severity-weighted new findings) | 0.30 | 0.62 | 0.186 |
| madScore (noise floor) | 0.25 | 0.00 (single pass; no churn to estimate) | 0.000 |
| dimensionCoverage (4/4 dimensions + 2/2 core protocols addressed) | 0.45 | 1.00 | 0.450 |
| **compositeStop** | — | **0.636** | above `compositeStopScore` 0.60 |

Telemetry only: `stopPolicy: max-iterations` with `maxIterations: 1` terminates the run at the cap, and the persisted `stopReason` is `maxIterationsReached`. No converged STOP is claimed, and the security-sensitive stabilization override is recorded as unmet (Deferred Items).

### File coverage matrix

| File | Dimensions | Findings | Notes |
|---|---|---|---|
| `.pi/extensions/pi-cache-optimizer/index.ts` | D1-D4 | F001, F003 | Changed regions plus every caller of the changed predicates and the adapter/notification chain. |
| `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts` | D1, D3 | F002 | New gate tests and the fix-command assertion evaluated against the removed implementation. |
| `.pi/models.json` | D1, D3 | — | Both declarations verified present; provider scope confirmed via `provider-composer.js`. |
| `spec.md` | D3 | — | REQ-001/2/3/5 confirmed by code; REQ-006 wording is F002. |
| `plan.md` | D3, D4 | F003, F006 | Predicate description drift and the unchecked DoD block. |
| `tasks.md` | D3 | — | T001–T013 consistent with the summary. |
| `implementation-summary.md` | D3 | — | Verification table matches `check-run.txt`; limitation 6 discloses the unopted chat silence but not the affinity clause. |
| `scratch/live-affinity-probe.{md,json}` | D3, D2 | F004, F005 | Response-only artifact; account metadata present. |
| `scratch/live-image-probe.{md,json}` | D3, D2 | F005 | Answer matches the fixture; metadata present. |
| `scratch/vision-probe.png` | D3 | — | Independently OCR'd and colour-analysed; ground truth corroborated. |
| `scratch/verify-no-warning.{mjs,txt}` | D3 | — | Real notification path; controls A/B genuine, control C encodes the F001 silence as expected. |
| `scratch/check-run.txt` | D3 | — | 114 tests / 28 suites / 0 failures, four gate tests present, pack and diff checks included. |
| Installed Pi runtime (reference) | D1 | — | `detectCompat`, compat merge order, and the `openai-completions`-only consumption of the two keys. |

### Dimension breakdown

- **Correctness (D1)** — CONDITIONAL: the gate, the suggestion, the write-set and the opt-out all behave as specified; one automatic advisory is lost (F001).
- **Security (D2)** — PASS with advisory: no credential exposure, no trust-boundary defect in the change; probe artifacts carry account metadata (F005).
- **Traceability (D3)** — CONDITIONAL: `spec_code` pass, `checklist_evidence` partial (F002, F004, F006).
- **Maintainability (D4)** — PASS with advisory: predicate is cohesive and well documented at its definition; dead placement branch and stale comments remain (F003).

### What could not be checked

- `validate.sh --strict` exit status and generated-metadata freshness (forbidden for this lineage).
- Whether the affinity probe's request actually carried the three headers (no request-side evidence committed; no probe script committed).
- Pre-change behaviour executed live; the removed implementation was reconstructed from `review/change-under-review.diff`.
- Whether the previous session's probe evidence (`review/README.md` records a denied dispatch) was produced with the same config revision as the reviewed commit.
