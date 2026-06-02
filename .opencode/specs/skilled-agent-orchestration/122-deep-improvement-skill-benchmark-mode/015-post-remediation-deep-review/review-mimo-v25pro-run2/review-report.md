---
title: "Deep-Review Report: skill:deep-improvement post-remediation (MiMo-v2.5-pro, run 2)"
description: "Second independent MiMo-v2.5-pro 5-iteration pass over the v1.11.1.0 remediated deep-improvement skill (run-to-run stability check). Verdict CONDITIONAL: 0 P0, 2 P1, 12 P2. Re-confirms the criteria-exec default + SKILL.md script-list + greedy grader-regex issues; adds cache-key + normalizeParsedPayload nuances."
trigger_phrases:
  - "mimo run2 post-remediation review report"
importance_tier: "important"
contextType: "general"
---
# Deep-Review Report: skill:deep-improvement post-remediation (MiMo-v2.5-pro, run 2)

<!-- ANCHOR:executive-summary -->
## 1. Executive Summary

**Verdict: CONDITIONAL** — no blockers; this second pass independently re-confirms the run-1 top issues and adds a few remediation-specific nuances.

| Severity | Count | Meaning |
|----------|-------|---------|
| **P0** | **0** | Nothing broken. |
| **P1** | **2** | Should-fix — both also flagged by run 1 (high confidence). |
| **P2** | **12** | Advisory: grader-regex robustness, cache, refactor cohesion. |
| **Total** | **14** | Across 5 iterations (all 4 core dimensions + inventory). |

This run is a **run-to-run stability check** against MiMo run 1 (which found 0 P0 / 8 P1 / 15 P2). It surfaced fewer findings (14 vs 23) but **both its P1s overlap run 1's** — the permissive criteria-exec default and the SKILL.md §11 script-list mismatch — confirming those are stable, real issues rather than single-pass noise. It also independently re-flagged the greedy grader regex (as P2 here) and the grader cache-raw-output concern. Net-new this pass: two sharp observations about the remediation code itself — `normalizeParsedPayload` conflating dim stamping with the mismatch confidence-cap, and the grader cache key omitting `system_prompt_path` (relevant now that the grader uses `--append-system-prompt`).

**Reviewer caveat:** same model as run 1 (MiMo-v2.5-pro), so this measures *stability*, not independent-model diversity. Agreement across two fresh passes raises confidence; non-overlap reflects the model's run-to-run variance, not necessarily absence.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:planning-trigger -->
## 2. Planning Trigger

Same as run 1: a small follow-up is recommended, not forced (no P0). The two re-confirmed P1s should anchor that follow-up. The net-new `harness.cjs:341` cache-key omission is worth folding in — it is a correctness nuance the prior remediation didn't address.
<!-- /ANCHOR:planning-trigger -->

---

<!-- ANCHOR:finding-registry -->
## 3. Active Finding Registry

### P1 — should-fix (2) — both overlap run 1
| # | Location | Finding |
|---|----------|---------|
| R2-P1-1 | `scorer/score-model-variant.cjs:111-120` | Permissive criteria-exec default allows arbitrary command execution when `DEEP_AGENT_ALLOW_CRITERIA_EXEC` is unset (= run-1 M-P1-4). |
| R2-P1-2 | `SKILL.md:544` | §11 claims a comprehensive script list but omits 9 skill-benchmark scripts despite the v1.11.1.0 changelog claiming reconciliation (= run-1 M-P1-2). |

### P2 — advisory (12)
- **Grader regex robustness (re-confirmed from run 1):** `harness.cjs:211` greedy regex / matches across object boundaries / extracts wrong object from multi-object responses (×3 facets).
- **Net-new remediation-code nuances:** `harness.cjs:127` `normalizeParsedPayload` conflates missing-dim_id stamping with the mismatch confidence-cap (two concerns in one branch); `harness.cjs:341` grader **cache key omits `system_prompt_path`** — two different system prompts could collide in cache (newly relevant with `--append-system-prompt`).
- **Cache redaction (re-confirmed):** `harness.cjs:385-403` cache stores raw model output by default; needs `DEEP_AGENT_GRADER_CACHE_RAW=0`.
- **Gate warning (re-confirmed):** `score-model-variant.cjs:116` `criteriaExecAllowed` warn-once may be missed in batch runs.
- **Refactor cohesion (score-skill-benchmark):** `:162` `modeAScore` double-rounds (per-row then weighted sum); `:141` `scoreAssetRecall` returns null, asymmetric with other scorers; `:109` `scoreD2`/`scoreD3` lack metric-naming JSDoc.
- **Duplication:** `d4-ablation.cjs:39` duplicate `clamp01` between d4-ablation and harness.
<!-- /ANCHOR:finding-registry -->

---

<!-- ANCHOR:remediation-workstreams -->
## 4. Remediation Workstreams

**WS-1 · Re-confirmed P1s (R2-P1-1, R2-P1-2)** — same as run-1 WS-A/WS-C: reconcile the §11 script list to the actual tree; tighten the criteria-exec default/gate.
**WS-2 · Grader correctness nuances (harness.cjs:341, :127)** — add `system_prompt_path` to the grader cache key (prevents cross-system-prompt cache collisions); split `normalizeParsedPayload` so stamping and the mismatch-cap are distinct.
**WS-3 · Grader regex hardening** — non-greedy / single-object extraction (same as run-1 WS-B).
**WS-4 · Cohesion/duplication (score-skill-benchmark, d4-ablation)** — optional backlog: fix `modeAScore` double-round, symmetric `scoreAssetRecall`, shared `clamp01`.
<!-- /ANCHOR:remediation-workstreams -->

---

<!-- ANCHOR:spec-seed -->
## 5. Spec Seed

> **Title:** Post-remediation grader-cache + doc-sync follow-up. **Level:** 1 (<40 LOC). **Priority:** P2.
> **In scope:** §11 script-list reconciliation, criteria-exec default, grader cache-key `system_prompt_path`, non-greedy grader regex. **Acceptance:** §11 matches the tree; grader cache keys on the system prompt; regex cannot stitch across objects; suite green. (Merges with run-1's spec seed.)
<!-- /ANCHOR:spec-seed -->

---

<!-- ANCHOR:plan-seed -->
## 6. Plan Seed

1. Reconcile SKILL.md §11 ↔ tree ↔ README counts.
2. Add `system_prompt_path` to `derive_grader_key` inputs in `harness.cjs`.
3. Non-greedy/brace-balanced grader regex; split `normalizeParsedPayload`.
4. Criteria-exec default decision (fail-closed or documented).
5. Re-run suite (358+/0) + drift guard.
<!-- /ANCHOR:plan-seed -->

---

<!-- ANCHOR:traceability-status -->
## 7. Traceability Status

| Iteration | Dimension | P1/P2 | secs |
|-----------|-----------|-------|------|
| 1 | inventory+correctness | 0 / 3 | 172 |
| 2 | correctness | 0 / 1 | 185 |
| 3 | security | 1 / 2 | 170 |
| 4 | traceability | 1 / 0 | 231 |
| 5 | maintainability | 0 / 6 | 242 |

All 4 core dimensions + inventory covered; ran to the 5-iteration cap (`newFindingsRatio` 1.0 throughout). The two P1s landed in the security + traceability dimensions, matching run 1's pattern.
<!-- /ANCHOR:traceability-status -->

---

<!-- ANCHOR:deferred-items -->
## 8. Deferred Items

- Run-1-unique findings not re-surfaced here (SKILL.md `1.12.0.0`-vs-changelog, `bundle-gate.cjs` gate divergence, `dispatch-model.cjs` size) — retained from run 1's report, not dropped; non-overlap reflects MiMo's run-to-run variance.
- The cohesion/duplication P2s are advisory backlog.
- The full run-to-run comparison lives in the phase `implementation-summary.md`.
<!-- /ANCHOR:deferred-items -->

---

<!-- ANCHOR:audit-appendix -->
## 9. Audit Appendix

- **Target:** `skill:deep-improvement` (v1.11.1.0). **Reviewer:** `xiaomi-token-plan-ams/mimo-v2.5-pro --variant high` via cli-opencode (`--pure`, read-only) — second independent pass (session `mimo-deepreview-015-run2`).
- **Iterations:** 5. **Timings (s):** 172, 185, 170, 231, 242. **Findings:** 14 (0 P0 / 2 P1 / 12 P2).
- **Replaced:** the originally-planned MiniMax-M3 pass (aborted by the operator after run 1).
- **Read-only confirmed:** wrote only this `review-mimo-v25pro-run2/` packet.
<!-- /ANCHOR:audit-appendix -->
